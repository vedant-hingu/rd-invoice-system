from decimal import Decimal, ROUND_HALF_UP

from django.db import transaction
from rest_framework import serializers

from .models import Customer, Invoice, InvoiceItem


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ["id", "name", "email", "phone", "address"]


class InvoiceItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = InvoiceItem
        fields = ["id", "item_name", "quantity", "price", "subtotal"]
        read_only_fields = ["subtotal"]


class InvoiceCreateItemSerializer(serializers.Serializer):
    item_name = serializers.CharField(max_length=150)
    quantity = serializers.IntegerField(min_value=1)
    price = serializers.DecimalField(max_digits=10, decimal_places=2, min_value=Decimal("0.01"))


class InvoiceSerializer(serializers.ModelSerializer):
    customer = CustomerSerializer()
    items = InvoiceItemSerializer(many=True, read_only=True)

    class Meta:
        model = Invoice
        fields = [
            "id",
            "customer",
            "invoice_date",
            "tax_rate",
            "subtotal",
            "tax_amount",
            "total_amount",
            "status",
            "items",
            "created_at",
        ]


class InvoiceCreateSerializer(serializers.Serializer):
    customer = CustomerSerializer()
    items = InvoiceCreateItemSerializer(many=True, min_length=1)
    tax_rate = serializers.DecimalField(
        max_digits=5,
        decimal_places=2,
        min_value=Decimal("0.00"),
        required=False,
        default=Decimal("18.00"),
    )
    status = serializers.ChoiceField(
        choices=[Invoice.STATUS_PENDING, Invoice.STATUS_PAID],
        default=Invoice.STATUS_PENDING,
        required=False,
    )

    @staticmethod
    def _money(value):
        return value.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)

    @transaction.atomic
    def create(self, validated_data):
        customer_data = validated_data["customer"]
        items_data = validated_data["items"]
        tax_rate = validated_data.get("tax_rate", Decimal("18.00"))
        status = validated_data.get("status", Invoice.STATUS_PENDING)

        customer, _ = Customer.objects.get_or_create(
            email=customer_data["email"],
            defaults=customer_data,
        )

        if (
            customer.name != customer_data["name"]
            or customer.phone != customer_data["phone"]
            or customer.address != customer_data["address"]
        ):
            customer.name = customer_data["name"]
            customer.phone = customer_data["phone"]
            customer.address = customer_data["address"]
            customer.save(update_fields=["name", "phone", "address"])

        subtotal = Decimal("0.00")
        computed_items = []

        for item in items_data:
            line_subtotal = self._money(Decimal(item["quantity"]) * item["price"])
            subtotal += line_subtotal
            computed_items.append(
                {
                    "item_name": item["item_name"],
                    "quantity": item["quantity"],
                    "price": item["price"],
                    "subtotal": line_subtotal,
                }
            )

        subtotal = self._money(subtotal)
        tax_amount = self._money(subtotal * (tax_rate / Decimal("100")))
        total_amount = self._money(subtotal + tax_amount)

        invoice = Invoice.objects.create(
            customer=customer,
            tax_rate=self._money(tax_rate),
            subtotal=subtotal,
            tax_amount=tax_amount,
            total_amount=total_amount,
            status=status,
        )

        InvoiceItem.objects.bulk_create([InvoiceItem(invoice=invoice, **row) for row in computed_items])
        return invoice

    def to_representation(self, instance):
        return InvoiceSerializer(instance).data
