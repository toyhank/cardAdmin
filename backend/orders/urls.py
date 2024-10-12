#backend/crud_demo/urls.py

from rest_framework.routers import SimpleRouter
from rest_framework.routers import DefaultRouter
from .views import orderModelViewSet

#router = SimpleRouter()
router = DefaultRouter()
# 这里进行注册路径，并把视图关联上，这里的api地址以视图名称为后缀，这样方便记忆api/orderModelViewSet
router.register("api/orderModelViewSet", orderModelViewSet)
#router.register(r'orders', orderModelViewSet, basename='orderModelViewSet')

urlpatterns = [
]
urlpatterns += router.urls