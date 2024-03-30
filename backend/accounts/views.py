from .models import User, Client, Address
from rest_framework import generics
from rest_framework import permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import (
    RegisterUserSerializer,
    UserProfileSeralizer,
    ClientSerializer,
    AddressSerializer,
)
from rest_framework.throttling import UserRateThrottle, AnonRateThrottle

# import ValidationError from rest_framework.exceptions
from rest_framework.exceptions import ValidationError
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView


class RegisterUserView(generics.CreateAPIView):
    """Register a new user and return a token for the user"""

    permission_classes = [permissions.AllowAny]
    throttle_classes = [AnonRateThrottle]
    serializer_class = RegisterUserSerializer

    def perform_create(self, serializer):
        user = serializer.save()
        token = serializer.get_token(user)
        serializer.validated_data["token"] = token
        return super().perform_create(serializer)


class UserProfileView(generics.RetrieveUpdateAPIView):
    """Get and update user profile"""

    serializer_class = UserProfileSeralizer
    permission_classes = [permissions.IsAuthenticated]
    throttle_classes = [UserRateThrottle]

    def get_object(self):
        return self.request.user


class ClientListCreateView(generics.ListCreateAPIView):
    """Get and create clients"""

    queryset = Client.objects.all()
    serializer_class = ClientSerializer


class ClientDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Get clients by id"""

    queryset = Client.objects.all()
    serializer_class = ClientSerializer


class AllClientListView(generics.ListAPIView):
    """Get all clients"""

    queryset = Client.objects.all()
    serializer_class = ClientSerializer


class ClientUpdateView(generics.RetrieveUpdateAPIView):
    """Update client"""

    queryset = Client.objects.all()
    serializer_class = ClientSerializer
    partial = True


class ClientDeleteView(generics.DestroyAPIView):
    """Delete clients"""

    queryset = Client.objects.all()
    serializer_class = ClientSerializer

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response(print("delete client"))


class AddressListCreateView(generics.ListCreateAPIView):
    """Get and create addresses"""

    queryset = Address.objects.all()
    serializer_class = AddressSerializer


class AddressDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Get addresses by id"""

    queryset = Address.objects.all()
    serializer_class = AddressSerializer


class AllAddressListView(generics.ListAPIView):
    """Get all addresses"""

    queryset = Address.objects.all()
    serializer_class = AddressSerializer


class AddressUpdateView(generics.RetrieveUpdateAPIView):
    """Update addresses"""

    queryset = Address.objects.all()
    serializer_class = AddressSerializer
    partial = True

class AllAddressClientView(generics.ListAPIView):
    serializer_class = AddressSerializer

    def get_queryset(self):
        client_id = self.kwargs['client_id']  # Assuming you pass client_id in URL
        return Address.objects.filter(client_id=client_id)

class AddressDeleteView(generics.DestroyAPIView):
    """Delete addresses"""

    queryset = Address.objects.all()
    serializer_class = AddressSerializer

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response(print("delete address"))
