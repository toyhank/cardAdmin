#backend/crud_demo/serializers.py

from orders.models import orderModel
from dvadmin.utils.serializers import CustomModelSerializer


class orderModelSerializer(CustomModelSerializer):
    """
    序列化器
    """
#这里是进行了序列化模型及所有的字段
    class Meta:
        model = orderModel
        fields = "__all__"

#这里是创建/更新时的列化器
class orderModelCreateUpdateSerializer(CustomModelSerializer):
    """
    创建/更新时的列化器
    """

    class Meta:
        model = orderModel
        fields = '__all__'