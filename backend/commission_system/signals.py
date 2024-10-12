# signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import commissionModel
from orders.models import orderModel

@receiver(post_save, sender=orderModel)
def create_or_update_target_model(sender, instance, created, **kwargs):
    if created:
        commissionModel.objects.create(source=instance, computed_value=instance.value * 2)
    else:
        commissionModel = orderModel.objects.get(source=instance)
        commissionModel.computed_value = instance.value * 2
        commissionModel.save()