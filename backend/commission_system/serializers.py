#backend/crud_demo/serializers.py

from commission_system.models import CommissionModel
from dvadmin.utils.serializers import CustomModelSerializer


class commissionModelSerializer(CustomModelSerializer):
    """
    序列化器
    """
#这里是进行了序列化模型及所有的字段
    class Meta:
        model = CommissionModel
        fields = "__all__"

#这里是创建/更新时的列化器
class commissionModelCreateUpdateSerializer(CustomModelSerializer):
    """
    创建/更新时的列化器
    """

    class Meta:
        model = CommissionModel
        fields = '__all__'