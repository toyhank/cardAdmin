from django.db import models
from django.contrib.auth.models import User
from django.conf import settings
from django.contrib.auth import get_user_model

class cardModel(models.Model):
    walletNo = models.CharField(max_length=100, verbose_name='钱包编号',null=True, blank=True,default="")
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

    @classmethod
    def batch_deliver(cls, account_type, count, delivered_by, sales_destination=None, sales=None):
        """
        批量出库，填入账号种类和数量，可选填销售额和销售去向，并返回指定数量的账密信息
        
        参数:
        account_type: 账号种类
        count: 需要的账号数量
        delivered_by: 出库人
        sales_destination: 销售去向（可选）
        sales: 销售额（可选）

        返回:
        指定数量的卡密信息列表

        异常:
        如果可用数量不足，抛出ValueError异常
        """
        try:
            count = int(count)
        except ValueError:
            raise ValueError("count 必须是一个有效的整数")
        print(f'ddd{account_type}  {count}')
        available_cards = cls.objects.filter(account_type=account_type, status="未出库")
        if available_cards.count() < count:
            raise ValueError(f"可用的{account_type}账号数量不足。请求数量：{count}，可用数量：{available_cards.count()}")
        for card in available_cards:
            print(f"ID: {card.id}, 钱包编号: {card.walletNo}, 卡号: {card.cardNo}, 账密: {card.account_info}, 账号种类: {card.account_type}, 状态: {card.status}")
        cards = available_cards[:count]
        print(cards)
        update_data = {
            'delivered_by': delivered_by,
            'status': "已出库"
        }
        if sales_destination:
            update_data['sales_destination'] = sales_destination
        if sales:
            update_data['sales'] = sales
        # 使用列表推导式获取所有卡片的ID
        card_ids = [card.id for card in cards]
        
        # 使用过滤器更新符合条件的卡片
        cls.objects.filter(id__in=card_ids).update(**update_data)
        return [
            {
                'account_info': card.account_info,
            }
            for card in cards
        ]