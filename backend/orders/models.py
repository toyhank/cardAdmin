from django.db import models
from django.contrib.auth.models import User
from django.conf import settings
from django.utils import timezone

class orderModel(models.Model):
    customer_id = models.CharField(default="",null=True, blank=True,max_length=100, verbose_name='客户编号')
    create_by = models.CharField(null=True, blank=True,default="",max_length=100, verbose_name='创建人')
    account_info = models.CharField(max_length=100, verbose_name='账密')
    account_type = models.CharField(max_length=100, verbose_name='账号种类')
    assigned_by = models.CharField(default="",null=True, blank=True,max_length=100, verbose_name='接单人')
    is_completed = models.BooleanField(default=False, verbose_name='完结')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='创建时间')
    assigned_at = models.DateTimeField(null=True, blank=True, verbose_name='接单时间')
    completed_at = models.DateTimeField(null=True, blank=True, verbose_name='完成时间')
    is_accepted = models.BooleanField(default=False, verbose_name='是否接单')
    PRIORITY_CHOICES = [
        ('紧急', '紧急'),
        ('优先', '优先'),
        ('普通', '普通'),
        ('慢速', '慢速'),
    ]

    priority = models.CharField(max_length=100, choices=PRIORITY_CHOICES, default='普通', verbose_name='优先级')
    only_assigned_to = models.CharField(max_length=100, blank=True, null=True,default='',verbose_name='指定接单人')
    
    def __str__(self):
        return f"订单 {self.customer_id}"

    class Meta:
        verbose_name = '订单'
        verbose_name_plural = '订单列表'

    @classmethod
    def get_total_orders(cls):
        return cls.objects.count()

    @classmethod
    def get_today_orders(cls):
        today = timezone.now().date()
        return cls.objects.filter(created_at__date=today).count()