#backend/crud_demo/serializers.py

from order_type.models import orderTypeModel
from dvadmin.utils.serializers import CustomModelSerializer


class orderTypeModelSerializer(CustomModelSerializer):
    """
    序列化器
    """
#这里是进行了序列化模型及所有的字段
    class Meta:
        model = orderTypeModel
        fields = "__all__"

#这里是创建/更新时的列化器
class orderTypeModelCreateUpdateSerializer(CustomModelSerializer):
    """
    创建/更新时的列化器
    """

    class Meta:
        model = orderTypeModel
        fields = '__all__'