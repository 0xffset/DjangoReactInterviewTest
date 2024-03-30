import React, { useMemo, useState } from "react";
import {
  MRT_EditActionButtons,
  MaterialReactTable,
  // createRow,
  type MRT_ColumnDef,
  type MRT_Row,
  type MRT_TableOptions,
  useMaterialReactTable,
} from "material-react-table";
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

interface AddressProps {
  id_client: String | undefined;
}

interface Address {
  id: string;
  name: string;
  description: string;
}

const Example: React.FC<AddressProps> = ({ id_client }) => {
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string | undefined>
  >({});

  const [address, setAddress] = React.useState<Address[]>([]);

  React.useEffect(() => {
    const url = `http://127.0.0.1:8000/api/v1/accounts/address/client/${id_client}/`;
    axios.get(url).then((res) => {
      console.log(res.data);
      setAddress(res.data["results"]);
    });
  }, [id_client]);

  const columns = useMemo<MRT_ColumnDef<Address>[]>(
    () => [
      {
        accessorKey: "id",
        header: "Id",
        enableEditing: false,
        size: 80,
      },
      {
        accessorKey: "name",
        header: "Name",
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.firstName,
          helperText: validationErrors?.firstName,
          //remove any previous validation errors when address focuses on the input
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              firstName: undefined,
            }),
          //optionally add validation checking for onBlur or onChange
        },
      },
      {
        accessorKey: "description",
        header: "Description",
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.lastName,
          helperText: validationErrors?.lastName,
          //remove any previous validation errors when address focuses on the input
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              lastName: undefined,
            }),
        },
      },
    ],
    [validationErrors]
  );

  //call CREATE hook
  const { mutateAsync: createUser, isPending: isCreatingUser } =
    useCreateAddress(id_client?.toString());
  //call READ hook
  const {
    data: fetchedUsers = [],
    isError: isLoadingUsersError,
    isFetching: isFetchingUsers,
    isLoading: isLoadingUsers,
  } = useGetAddresses(address);
  //call UPDATE hook
  const { mutateAsync: updateAddress, isPending: isUpdatingUser } =
    useUpdateAddress(id_client?.toString());
  //call DELETE hook
  const { mutateAsync: deleteAddress, isPending: isDeletingUser } =
    useDeleteAddress();

  //CREATE action
  const handleCreateAddress: MRT_TableOptions<Address>["onCreatingRowSave"] =
    async ({ values, table }) => {
      const newValidationErrors = validateUser(values);
      if (Object.values(newValidationErrors).some((error) => error)) {
        setValidationErrors(newValidationErrors);
        return;
      }
      setValidationErrors({});
      await createUser(values);
      table.setCreatingRow(null); //exit creating mode
    };

  //UPDATE action
  const handleSaveUser: MRT_TableOptions<Address>["onEditingRowSave"] = async ({
    values,
    table,
  }) => {
    const newValidationErrors = validateUser(values);
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});
    await updateAddress(values);
    table.setEditingRow(null); //exit editing mode
  };

  //DELETE action
  const openDeleteConfirmModal = (row: MRT_Row<Address>) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      deleteAddress(row.original.id);
    }
  };

  const table = useMaterialReactTable({
    columns,
    data: address,
    createDisplayMode: "modal", //default ('row', and 'custom' are also available)
    editDisplayMode: "modal", //default ('row', 'cell', 'table', and 'custom' are also available)
    enableEditing: true,
    getRowId: (row) => row.id,
    muiToolbarAlertBannerProps: isLoadingUsersError
      ? {
          color: "error",
          children: "Error loading data",
        }
      : undefined,
    muiTableContainerProps: {
      sx: {
        minHeight: "500px",
      },
    },
    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: handleCreateAddress,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveUser,
    //optionally customize modal content
    renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h3">Create new Address</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          {internalEditComponents} {/* or render custom edit components here */}
        </DialogContent>
        <DialogActions>
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </DialogActions>
      </>
    ),
    //optionally customize modal content
    renderEditRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h3">Edit Address</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          {internalEditComponents} {/* or render custom edit components here */}
        </DialogContent>
        <DialogActions>
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </DialogActions>
      </>
    ),
    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: "flex", gap: "1rem" }}>
        <Tooltip title="Edit">
          <IconButton onClick={() => table.setEditingRow(row)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton color="error" onClick={() => openDeleteConfirmModal(row)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    renderTopToolbarCustomActions: ({ table }) => (
      <Button
        variant="contained"
        onClick={() => {
          table.setCreatingRow(true); //simplest way to open the create row modal with no default values
          //or you can pass in a row object to set default values with the `createRow` helper function
          // table.setCreatingRow(
          //   createRow(table, {
          //     //optionally pass in default values for the new row, useful for nested data or other complex scenarios
          //   }),
          // );
        }}
      >
        Create New Address
      </Button>
    ),
    state: {
      isLoading: isLoadingUsers,
      isSaving: isCreatingUser || isUpdatingUser || isDeletingUser,
      showAlertBanner: isLoadingUsersError,
      showProgressBars: isFetchingUsers,
    },
  });

  return <MaterialReactTable table={table} />;
};

//CREATE hook (post new address to api)
function useCreateAddress(id_client: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (address: Address) => {
      //send api update request here
      const url = "http://127.0.0.1:8000/api/v1/accounts/address/";
      const res = axios.post(url, {
        name: address.name,
        description: address.description,
        client: id_client,
      });
      await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
      return Promise.resolve(res);
    },
    //client side optimistic update
    onMutate: (newAddressInfo: Address) => {
      queryClient.setQueryData(
        ["addresses"],
        (prevAddresses: any) =>
          [
            ...prevAddresses,
            {
              ...newAddressInfo,
            },
          ] as Address[]
      );
    },
  });
}

//READ hook (get users from api)
function useGetAddresses(address: Address[]) {
  return useQuery<Address[]>({
    queryKey: ["addresses"],
    queryFn: async () => {
      //send api request here
      await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
      return Promise.resolve(address);
    },
    refetchOnWindowFocus: false,
  });
}

//UPDATE hook (put address in api)
function useUpdateAddress(id_client: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (address: Address) => {
      //send api update request here
   
      const url = `http://127.0.0.1:8000/api/v1/accounts/address/update/${address.id}/`;
      const res = axios.patch(url, {
        name: address.name,
        description: address.description,
        client: id_client
      });
      await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
      return Promise.resolve(res);
    },
    //client side optimistic update
    onMutate: (newAddressInfo: Address) => {
      queryClient.setQueryData(["addresses"], (prevAddresses: any) =>
        prevAddresses?.map((prevAddress: Address) =>
          prevAddress.id === newAddressInfo.id ? newAddressInfo : prevAddress
        )
      );
    },
    // onSettled: () => queryClient.invalidateQueries({ queryKey: ['users'] }), //refetch users after mutation, disabled for demo
  });
}

//DELETE hook (delete address in api)
function useDeleteAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (addressId: string) => {
      //send api update request here
      const url = `http://127.0.0.1:8000/api/v1/accounts/address/${addressId}/`;
     const res = axios.delete(url).then((res) => {
        console.log(res);
      });
      await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
      return Promise.resolve(res);
    },
    //client side optimistic update
    onMutate: (addressId: string) => {
      queryClient.setQueryData(["addresses"], (prevAddresses: any) =>
        prevAddresses?.filter((address: Address) => address.id !== addressId)
      );
    },
    // onSettled: () => queryClient.invalidateQueries({ queryKey: ['users'] }), //refetch users after mutation, disabled for demo
  });
}

const queryClient = new QueryClient();

const Addresses: React.FC<AddressProps> = ({ id_client }) => (
  //Put this with your other react-query providers near root of your app
  <QueryClientProvider client={queryClient}>
    <Example id_client={id_client} />
  </QueryClientProvider>
);

export default Addresses;

const validateRequired = (value: string) => !!value.length;
const validateEmail = (email: string) =>
  !!email.length &&
  email
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );

function validateUser(address: Address) {
  return {
    name: !validateRequired(address.name) ? "Name is Required" : "",
    description: !validateRequired(address.description)
      ? "Description is Required"
      : "",
  };
}
