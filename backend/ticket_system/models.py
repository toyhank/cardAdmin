from django.db import models
from django.contrib.auth.models import User
from django.conf import settings

class ticketModel(models.Model):
    ticket_title = models.CharField(default="",null=True, blank=True,max_length=100, verbose_name='工单标题')
    ticket_content = models.TextField(default="",null=True, blank=True, verbose_name='工单内容')
    ticket_type = models.TextField(default="",null=True, blank=True, verbose_name='工单分类')
    create_by = models.CharField(null=True, blank=True,default="",max_length=100, verbose_name='创建人')
    assigned_by = models.CharField(default="",null=True, blank=True,max_length=100, verbose_name='接单人')
    is_completed = models.BooleanField(default=False, verbose_name='完结')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='创建时间')
    assigned_at = models.DateTimeField(null=True, blank=True, verbose_name='接单时间')
    completed_at = models.DateTimeField(null=True, blank=True, verbose_name='完成时间')
    is_accepted = models.BooleanField(default=False, verbose_name='是否接单')
    priority = models.CharField(null=True, blank=True,max_length=100, default='普通', verbose_name='优先级')
    only_assigned_to = models.CharField(max_length=100, blank=True, null=True,default='',verbose_name='指定接单人')
    def __str__(self):
        return f"工单 {self.ticket_title}"

    class Meta:
        verbose_name = '工单'
        verbose_name_plural = '工单列表'