#backend/crud_demo/serializers.py

from card_shop.models import cardModel
from dvadmin.utils.serializers import CustomModelSerializer


class cardModelSerializer(CustomModelSerializer):
    """
    序列化器
    """
#这里是进行了序列化模型及所有的字段
    class Meta:
        model = cardModel
        fields = "__all__"

#这里是创建/更新时的列化器
class cardModelCreateUpdateSerializer(CustomModelSerializer):
    """
    创建/更新时的列化器
    """

    class Meta:
        model = cardModel
        fields = '__all__'