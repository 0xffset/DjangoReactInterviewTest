from django.urls import path
from rest_framework_simplejwt import views as jwt_views
from .views import (
    RegisterUserView,
    UserProfileView,
    ClientListCreateView,
    ClientDetailView,
    ClientUpdateView,
    ClientDeleteView,
    AllClientListView,
    AddressListCreateView,
    AddressUpdateView,
    AllAddressListView,
    AddressDetailView,
    AddressDeleteView,
    AllAddressClientView
)

urlpatterns = [
    path("register/", RegisterUserView.as_view(), name="register"),
    path("login/", jwt_views.TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", jwt_views.TokenRefreshView.as_view(), name="token_refresh"),
    path("profile/", UserProfileView.as_view(), name="user_profile"),
    # Client
    path("client/", ClientListCreateView.as_view(), name="client-list-create"),
    path("client/<int:pk>/", ClientDetailView.as_view(), name="client-detail"),
    path("client/all/", AllClientListView.as_view(), name="client-movies-list"),
    path("client/delete/<int:pk>/", ClientDeleteView.as_view(), name="client-delete"),
    path("client/update/<int:pk>/", ClientUpdateView.as_view(), name="client-update"),
    # Address
    path("address/", AddressListCreateView.as_view(), name="address-list-create"),
    path("address/<int:pk>/", AddressDetailView.as_view(), name="address-detail"),
    path("address/all/", AllAddressListView.as_view(), name="address-list"),
    path("address/client/<int:client_id>/", AllAddressClientView.as_view(), name="all-address-client-list"),

    path(
        "address/delete/<int:pk>/", AddressDeleteView.as_view(), name="address-delete"
    ),
    path(
        "address/update/<int:pk>/", AddressUpdateView.as_view(), name="address-update"
    ),
]
