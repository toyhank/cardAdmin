from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from .models import cardModel
#from .forms import OrderForm
from rest_framework import serializers
from card_shop.serializers import cardModelSerializer, cardModelCreateUpdateSerializer
from dvadmin.utils.viewset import CustomModelViewSet
from rest_framework.permissions import AllowAny  # 导入所需权限类


# class ExportOrderModelSerializer(orderModelSerializer):
#     """
#     订单导出序列化器
#     """
#     customer_id = serializers.CharField(read_only=True)
#     account_info = serializers.CharField(read_only=True)
#     is_accepted = serializers.BooleanField(read_only=True)
#     only_assigned_to = serializers.CharField(read_only=True)
#     assigned_by = serializers.CharField(read_only=True)
#     #created_by = serializers.CharField(read_only=True)
#     is_completed = serializers.SerializerMethodField()
#     created_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S", read_only=True)
#     assigned_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S", read_only=True)
#     completed_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S", read_only=True)
#     priority = serializers.CharField(read_only=True)
#     account_type = serializers.CharField(read_only=True)
    
#     def get_priority(self, obj):
#         return obj.get_priority_display()
    
#     def get_account_type(self, obj):
#         return obj.get_account_type_display()

#     def get_is_completed(self, obj):
#         return "已完成" if obj.is_completed else "未完成"

#     class Meta:
#         model = orderModel
#         fields = [
#             'created_at','customer_id','account_info','account_type','priority','only_assigned_to','assigned_by','is_accepted','is_completed', 'assigned_at','completed_at'
#         ]


class cardModelViewSet(CustomModelViewSet):
    """
    list:查询
    create:新增
    update:修改
    retrieve:单例
    destroy:删除
    """
    queryset = cardModel.objects.all()
    serializer_class = cardModelSerializer
    create_serializer_class = cardModelCreateUpdateSerializer
    update_serializer_class = cardModelCreateUpdateSerializer
    permission_classes = [AllowAny]
    #export_serializer_class = ExportcardModelSerializer

    export_field_label = {
        'created_at': '创建时间',
        'account_info': '账密',
        'account_type': '账号种类',
        'walletNo':'钱包编号',
        'cardNo': '卡号',
        'id': 'id',
        'created_by': '创建人',
    }

