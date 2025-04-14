import json

# Django modules for handling authentication, permissions, messages, and HTTP responses
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import Group
from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt

# Importing custom user model and forms
from account.models import User
from account.forms import AddUserForm, EditUserForm

# Importing the Room model
from .models import Room

# Redundant import, already imported above
from django.shortcuts import render


# API view to create a chat room
@csrf_exempt  # Disables CSRF validation – only use in testing, not production!
@require_POST  # Ensures the view only handles POST requests
def create_room(request, uuid):
    # Get room name and URL from POST data
    name = request.POST.get("name", "")
    url = request.POST.get("url", "")

    # Create a new Room instance in the database
    Room.objects.create(uuid=uuid, client=name, url=url)

    # Return success response as JSON
    return JsonResponse({"message": "room created"})


# Admin panel view, shows all rooms and staff users
@login_required  # Requires user to be logged in
def admin(request):
    rooms = Room.objects.all().order_by("-created_at")  # Get all chat rooms
    users = User.objects.filter(is_staff=True)  # Get all staff users

    # Render admin template with room and user data
    return render(request, "chat/admin.html", {"rooms": rooms, "users": users})


# Chat room view
@login_required
def room(request, uuid):
    # Get the specific room by UUID
    room = Room.objects.get(uuid=uuid)

    if room.status == Room.WAITING:
        room.status = Room.ACTIVE
        room.agent = request.user
        room.save()

    # Render the room template with the room object
    return render(request, "chat/room.html", {"room": room})


# Chat room delete
@login_required
def delete_room(request, uuid):
    if request.user.has_perm("room.delete_room"):
        # Get the specific room by UUID
        room = Room.objects.get(uuid=uuid)
        room.delete()

        messages.success(request, "The room was deleted")
        return redirect("/chat-admin/")
    else:
        # If user doesn't have permission, show error and redirect
        messages.error(request, "You don't have access to delete users!")
        return redirect("/chat-admin/")


@login_required
def user_detail(request, uuid):
    user = User.objects.get(pk=uuid)
    rooms = user.rooms.all()
    return render(
        request,
        "chat/user_detail.html",
        {
            "user": user,
            "rooms": rooms,
        },
    )


# edit user
@login_required
def edit_user(request, uuid):
    # Check if current user has permission to add users
    if request.user.has_perm("user.edit_user"):
        user = User.objects.get(pk=uuid)

        if request.method == "POST":
            form = EditUserForm(request.POST, instance=user)

            if form.is_valid:
                form.save()

                messages.success(request, "The changes were saved")
                return redirect("/chat-admin/")
        else:
            form = EditUserForm(instance=user)

        return render(
            request,
            "chat/edit_user.html",
            {
                "user": user,
                "form": form,
            },
        )

    else:
        # If user doesn't have permission, show error and redirect
        messages.error(request, "You don't have access to edit users!")
        return redirect("/chat-admin/")


# Add new user view (only if user has permission)
@login_required
def add_user(request):
    # Check if current user has permission to add users
    if request.user.has_perm("user.add_user"):
        print("***Begin adding user...")
        if request.method == "POST":
            form = AddUserForm(request.POST)  # Populate form with POST data
            print("***form...", form)

            print(request.POST)

            if form.is_valid():
                print("***form.is_valid...")
                user = form.save(
                    commit=False
                )  # Create user object without saving to DB yet
                user.is_staff = True  # Set user as staff

                password = request.POST.get("password")
                if password:
                    user.set_password(password)
                else:
                    messages.error(request, "Password is required.")
                    return render(request, "chat/add_user.html", {"form": form})

                user.save()  # Save user to database

                # Add user to "Managers" group if their role is MANAGER
                if user.role == User.MANAGER:
                    try:
                        group = Group.objects.get(name="Managers")
                        group.user_set.add(user)
                    except Group.DoesNotExist:
                        messages.warning(
                            request,
                            "Manager group does not exist. User not added to group.",
                        )

                # Show success message
                messages.success(request, "The user was added!!")
                return redirect("chat:admin")  # <--- redirect to the admin page

            else:
                messages.error(request, "Form is invalid. Please check the input.")
                return render(request, "chat/add_user.html", {"form": form})

        else:
            form = AddUserForm()  # If GET request, show empty form

        # Render add user form
        return render(request, "chat/add_user.html", {"form": form})
    else:
        # If user doesn't have permission, show error and redirect
        messages.error(request, "You don't have access to add users!")
        return redirect("/chat-admin/")
