import os #interact with the operating system

from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack #handling user authentication. It wraps the WebSocket connection to ensure the user is authenticated before the connection is allowed.
from channels.security.websocket import AllowedHostsOriginValidator #This adds security to the WebSocket connection by validating the Origin header to make sure it matches the allowed hosts. This prevents cross-origin WebSocket connections from malicious sources.
from django.core.asgi import get_asgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "jatte.settings")

# imports the routing configuration from the chat app.
from chat import routing

#get the ASGI application for the Django project. It handles HTTP requests in the same way Django’s regular WSGI application would, but it's for asynchronous servers.
django_asgi_application = get_asgi_application()

application = ProtocolTypeRouter(
    {
        "http": django_asgi_application, #If the request is an HTTP request, it is passed to django_asgi_application, which handles it as a standard Django HTTP request.

        "websocket": AllowedHostsOriginValidator(
            AuthMiddlewareStack(URLRouter(routing.websocket_urlpatterns))
        ),
        #AllowedHostsOriginValidator: This validates that the connection's origin is from an allowed host (i.e., a trusted source), providing some security.

        #AuthMiddlewareStack: This ensures that the WebSocket connection is wrapped with middleware for handling authentication (so only authenticated users can connect).
    }
)
