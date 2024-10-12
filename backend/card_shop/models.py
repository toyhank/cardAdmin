from django.db import models
from django.contrib.auth.models import User
from django.conf import settings
from django.contrib.auth import get_user_model

class cardModel(models.Model):
    walletNo = models.CharField(max_length=100, verbose_name='钱包编号')
    cardNo = models.CharField(null=True, blank=True,default="",max_length=100, verbose_name='卡号')
    cardId = models.CharField(null=True, blank=True,default="",max_length=100, verbose_name='ID')
    created_by = models.CharField(null=True, blank=True,default="",max_length=100, verbose_name='创建人')
    delivered_by = models.CharField(null=True, blank=True,default="",max_length=100, verbose_name='出库人')
    account_info = models.CharField(max_length=100, verbose_name='账密')
    account_type = models.CharField(max_length=100, verbose_name='账号种类')
    status = models.CharField(null=True, blank=True,default="未出库",max_length=100, verbose_name='状态')
    sales_destination = models.CharField(null=True, blank=True,default="",max_length=100, verbose_name='销售去向')
    sales = models.CharField(null=True, blank=True,default="",max_length=100, verbose_name='销售额')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='创建时间')

    def __str__(self):
        return f"卡密 {self.id}"

    class Meta:
        verbose_name = '卡密'
        verbose_name_plural = '卡密列表'