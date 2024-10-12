from django.db import models
from django.contrib.auth.models import User
from django.conf import settings
from django.contrib.auth import get_user_model

class orderTypeModel(models.Model):
    order_type_string = models.CharField(max_length=100, verbose_name='订单类型')


    def __str__(self):
        return f"订单类型 {self.id}"

    class Meta:
        verbose_name = '订单类型'
        verbose_name_plural = '订单类型列表'