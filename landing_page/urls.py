from re import template
from django.urls import path
from landing_page import views

app_name = "landing_page"
urlpatterns = [
    path("", views.landing_page, name="landing_page"),
    path("register/", views.RegisterView.as_view(), name="register"),
    path('verify-email/<uidb64>/<token>/', views.verify_email, name='verify_email'),
    path("forgot-password/", views.ResetUserPasswordView.as_view(), name="forgot_password"),
    path('reset-password/<uidb64>/<token>/', views.ResetUserPasswordConfirmView.as_view(), name='reset_password_confirm'),
]