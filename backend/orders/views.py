from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from .models import orderModel
#from .forms import OrderForm
from rest_framework import serializers
from orders.serializers import orderModelSerializer, orderModelCreateUpdateSerializer
from dvadmin.utils.viewset import CustomModelViewSet
from rest_framework.permissions import AllowAny  # 导入所需权限类

from rest_framework.decorators import action
from rest_framework.response import Response

# @login_required
# def order_list(request):
#     orders = Order.objects.all()
#     return render(request, 'orders/order_list.html', {'orders': orders})

# @login_required
# def order_create(request):
#     if request.method == 'POST':
#         form = OrderForm(request.POST)
#         if form.is_valid():
#             form.save()
#             return redirect('order_list')
#     else:
#         form = OrderForm()
#     return render(request, 'orders/order_form.html', {'form': form})

# @login_required
# def order_assign(request, order_id):
#     order = get_object_or_404(Order, pk=order_id)
#     if order.assigned_to is None:  # 确保未被接单
#         order.assigned_to = request.user
#         order.save()
#     return redirect('order_list')

# @login_required
# def order_complete(request, order_id):
#     order = get_object_or_404(Order, pk=order_id)
#     if order.assigned_to == request.user:  # 确保只有接单员可以完结
#         order.is_completed = True
#         order.save()
#     return redirect('order_list')
class ImportOrderSerializer(orderModelSerializer):
    """
    部门-导入-序列化器
    """

    class Meta:
        model = orderModel
        fields = '__all__'
        read_only_fields = ["id"]

class ExportOrderModelSerializer(orderModelSerializer):
    """
    订单导出序列化器
    """
    customer_id = serializers.CharField(read_only=True)
    account_info = serializers.CharField(read_only=True)
    is_accepted = serializers.BooleanField(read_only=True)
    only_assigned_to = serializers.CharField(read_only=True)
    assigned_by = serializers.CharField(read_only=True)
    #created_by = serializers.CharField(read_only=True)
    is_completed = serializers.SerializerMethodField()
    created_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S", read_only=True)
    assigned_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S", read_only=True)
    completed_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S", read_only=True)
    priority = serializers.CharField(read_only=True)
    account_type = serializers.CharField(read_only=True)
    
    def get_priority(self, obj):
        return obj.get_priority_display()
    
    def get_account_type(self, obj):
        return obj.get_account_type_display()

    def get_is_completed(self, obj):
        return "已完成" if obj.is_completed else "未完成"

    class Meta:
        model = orderModel
        fields = [
            'created_at','customer_id','account_info','account_type','priority','only_assigned_to','assigned_by','is_accepted','is_completed', 'assigned_at','completed_at'
        ]


class orderModelViewSet(CustomModelViewSet):
    """
    list:查询
    create:新增
    update:修改
    retrieve:单例
    destroy:删除
    """
    queryset = orderModel.objects.all()
    serializer_class = orderModelSerializer
    create_serializer_class = orderModelCreateUpdateSerializer
    update_serializer_class = orderModelCreateUpdateSerializer
    permission_classes = [AllowAny]
    export_serializer_class = ExportOrderModelSerializer
    import_serializer_class = ImportOrderSerializer

    export_field_label = {
        'created_at': '创建时间',
        'customer_id': '客户编号',
        'account_info': '账密',
        'account_type': '账号种类',
        'priority': '优先级',
        'only_assigned_to': '指定接单人',
        'assigned_by': '接单人',
        'is_accepted': '是否接单',
        'is_completed': '完成状态',
        'assigned_at': '接单时间',
        'completed_at': '完成时间'
    }

    @action(detail=False, methods=['get'])
    def statistics(self, request):
        total_orders = orderModel.get_total_orders()
        today_orders = orderModel.get_today_orders()
        return Response({
            'total_orders': total_orders,
            'today_orders': today_orders
        })


    @action(detail=False, methods=['get'])
    def type_statistics(self, request):
        account_type = request.GET.get('type')
        today_orders = orderModel.get_type_today_orders(account_type)
        return Response({
            'type_orders': today_orders,
        })