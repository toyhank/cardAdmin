#backend/crud_demo/serializers.py

from .models import ticketModel
from dvadmin.utils.serializers import CustomModelSerializer


class ticketModelSerializer(CustomModelSerializer):
    """
    序列化器
    """
#这里是进行了序列化模型及所有的字段
    class Meta:
        model = ticketModel
        fields = "__all__"

#这里是创建/更新时的列化器
class ticketModelCreateUpdateSerializer(CustomModelSerializer):
    """
    创建/更新时的列化器
    """

    class Meta:
        model = ticketModel
        fields = '__all__'