from django import forms
from django.contrib.auth.forms import AuthenticationForm

from .models import User


class LoginForm(AuthenticationForm):
    class Meta:
        model = User
        fields = (
            "username",
            "password",
        )


class AddUserForm(forms.ModelForm):
    class Meta:
        model = User
        fields = (
            "email",
            "name",
            "role",
            "password",
        )
        widgets = {
            "email": forms.TextInput(
                attrs={"class": "w-full py-2 px-4 rounded-xl border my-2 border-gray-300"}
            ),
            "name": forms.TextInput(
                attrs={"class": "w-full py-2 px-4 rounded-xl border my-2 border-gray-300"}
            ),
            "role": forms.Select(attrs={"class": "w-full py-2 px-4 rounded-xl border my-2 border-gray-300"}),
            "password": forms.TextInput(
                attrs={"class": "w-full py-2 px-4 rounded-xl border my-2 border-gray-300"}
            ),
        }


class EditUserForm(forms.ModelForm):
    class Meta:
        model = User
        fields = (
            "email",
            "name",
            "role",
        )
        widgets = {
            "email": forms.TextInput(
                attrs={
                    "class": "w-full py-2 px-4 rounded-xl border my-2 border-gray-300"
                }
            ),
            "name": forms.TextInput(
                attrs={
                    "class": "w-full py-2 px-4 rounded-xl border my-2 border-gray-300"
                }
            ),
            "role": forms.Select(
                attrs={
                    "class": "w-full py-2 px-4 rounded-xl border mt-2 border-gray-300"
                }
            ),
        }
