from django.db import models
from django.db.models import Count
from django.conf import settings
from orders.models import orderModel  # 假设订单模型在 orders 应用中
from django.db.models.signals import post_save
from django.dispatch import receiver

from django.db.models import Count


# 获取每个名字及其计数




class UserOrderStats(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    order_count = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.user.username} - 订单数量: {self.order_count}"

class CommissionModel(models.Model):
    user = models.CharField(null=True, blank=True,default="",max_length=100, verbose_name='创建人')
    amount = models.IntegerField(null=True, blank=True, default=0, verbose_name='订单数量')
    commission_rate = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True, default=5, verbose_name='提成比例')
    total_commission = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, default=0, verbose_name='总佣金')
    
    def calculate_total_commission(self):
        return self.amount * self.commission_rate 
    
    def save(self, *args, **kwargs):
        # 在保存时计算并更新total_commission
        self.total_commission = self.calculate_total_commission()
        super().save(*args, **kwargs)
    
    @classmethod
    def update_stats(cls):
        # 更新用户订单统计
        user_order_counts = orderModel.objects.exclude(assigned_by__isnull=True).values('assigned_by').annotate(order_count=Count('assigned_by'))
        
        for user_stats in user_order_counts:
            if user_stats['assigned_by']:
                commission_obj, created = cls.objects.get_or_create(
                    user=user_stats['assigned_by'],
                    defaults={'amount': user_stats['order_count']}
                )
                if not created:
                    commission_obj.amount = user_stats['order_count']
                    commission_obj.save()
                
                UserOrderStats.objects.update_or_create(
                    user_id=user_stats['assigned_by'],
                    defaults={'order_count': user_stats['order_count']}
                )
        
        print(f"用户订单统计和佣金已更新：{user_order_counts}")

@receiver(post_save, sender=orderModel)
def create_target_record(sender, instance, created, **kwargs):
    name_counts = sender.objects.exclude(create_by='').values('assigned_by').annotate(count=Count('assigned_by'))

    for item in name_counts:
        if item['assigned_by']:
            # 检查记录是否存在
            obj, created = CommissionModel.objects.get_or_create(user=item['assigned_by'], defaults={'amount': item['count']})
            #if not created:
            obj.amount = item['count']
            obj.save()

# def update_user_order_stats(sender, instance, created, **kwargs):
#     if created or instance.assigned_by:
#         CommissionModel.update_stats()