from rest_framework import mixins, viewsets
from rest_framework.permissions import AllowAny

from .models import Invoice
from .serializers import InvoiceCreateSerializer, InvoiceSerializer


class InvoiceViewSet(
    mixins.CreateModelMixin,
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    viewsets.GenericViewSet,
):
    queryset = Invoice.objects.select_related("customer").prefetch_related("items").all()
    permission_classes = [AllowAny]

    def get_serializer_class(self):
        if self.action == "create":
            return InvoiceCreateSerializer
        return InvoiceSerializer
