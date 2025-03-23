from django.contrib.auth.forms import UserCreationForm, PasswordResetForm, SetPasswordForm
from django import forms
from dashboard.models import User
from crispy_forms.helper import FormHelper

class RegisterUserForm(UserCreationForm):
    class Meta:
        model = User
        fields = ("email","firstname", "lastname")

class ResetUserPasswordForm(PasswordResetForm):
    class Meta:
        model = User
        fields = "__all__"

class ResetUserPasswordConfirmForm(SetPasswordForm):
    class Meta:
        model = User
        fields = "__all__"