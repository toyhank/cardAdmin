from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from .models import cardModel
#from .forms import OrderForm
from rest_framework import serializers
from card_shop.serializers import cardModelSerializer, cardModelCreateUpdateSerializer
from dvadmin.utils.viewset import CustomModelViewSet
from rest_framework.permissions import AllowAny  # 导入所需权限类
from rest_framework.response import Response
from rest_framework.decorators import action

class ImportCardSerializer(cardModelSerializer):
    """
    部门-导入-序列化器
    """

    class Meta:
        model = cardModel
        fields = '__all__'
        read_only_fields = ["id"]

class ExportCardModelSerializer(cardModelSerializer):
    """
    订单导出序列化器
    """

    walletNo = serializers.CharField(read_only=True)
    cardNo = serializers.CharField(read_only=True)
    cardId = serializers.CharField(read_only=True)
    created_by = serializers.CharField(read_only=True)
    delivered_by = serializers.CharField(read_only=True)
    account_info = serializers.CharField(read_only=True)
    account_type = serializers.CharField(read_only=True)
    status = serializers.CharField(read_only=True)
    sales_destination = serializers.CharField(read_only=True)
    sales = serializers.CharField(read_only=True)
    created_at = serializers.CharField(read_only=True)


    class Meta:
        model = cardModel
        fields = [
            'walletNo','cardNo','cardId','created_by','delivered_by','account_info','account_type','status','sales_destination', 'sales','created_at'
        ]



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
    export_serializer_class = ExportCardModelSerializer
    import_serializer_class = ImportCardSerializer

    export_field_label = {
        'created_at': '创建时间',
        'account_info': '账密',
        'account_type': '账号种类',
        'walletNo':'钱包编号',
        'cardNo': '卡号',
        'id': 'id',
        'created_by': '创建人',
    }

    
    import_field_dict = {
        'created_at': '创建时间',
        'account_info': '账密',
        'account_type': '账号种类',
        'walletNo':'钱包编号',
        'cardNo': '卡号',
        'id': 'id',
        'created_by': '创建人',
    }

    @action(detail=False, methods=['get'])
    def get_card_key(self, request):
        account_type = request.GET.get('account_type')
        count = request.GET.get('count')
        delivered_by = request.GET.get('delivered_by')
        sales_destination = request.GET.get('sales_destination')
        sales = request.GET.get('sales')
        
        try:
            card_keys = cardModel.batch_deliver(account_type, count, delivered_by, sales_destination, sales)
            return Response({
                'card_keys': card_keys,
            })
        except ValueError as e:
            return Response({'error': str(e)}, status=400)

