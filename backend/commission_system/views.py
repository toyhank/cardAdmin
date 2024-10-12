from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from .models import CommissionModel
#from .forms import commissionForm
from rest_framework import serializers
from commission_system.serializers import commissionModelSerializer, commissionModelCreateUpdateSerializer
from dvadmin.utils.viewset import CustomModelViewSet
from rest_framework.permissions import AllowAny  # 导入所需权限类



class commissionModelViewSet(CustomModelViewSet):
    """
    list:查询
    create:新增
    update:修改
    retrieve:单例
    destroy:删除
    """
    queryset = CommissionModel.objects.all()
    serializer_class = commissionModelSerializer
    create_serializer_class = commissionModelCreateUpdateSerializer
    update_serializer_class = commissionModelCreateUpdateSerializer
    permission_classes = [AllowAny]