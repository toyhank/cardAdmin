<template>
  <fs-page class="PageFeatureSearchMulti">
    <!-- 添加仪表盘 -->

    <!-- 原有的 fs-crud 组件 -->
    <fs-crud ref="crudRef" v-bind="crudBinding">
      <template #cell_url="scope">
        <el-tag size="small">{{ scope.row.url }}</el-tag>
      </template>
      <!-- 添加的控件 -->
      <template #actionbar-right>
        <!-- 导入按钮 -->
        <importExcel api="api/orderModelViewSet/" v-auth="'user:Import'">导入</importExcel>
        
        <!-- 新增的导出按钮控件 -->
      </template>
    </fs-crud>
    
	<el-dialog v-model="addOrderVisible" title="入库" width="400px" draggable :before-close="handleAddOrderClose">
		<div>
			<el-input v-model="addOrderForm.walletNo" placeholder="钱包编号" style="margin-bottom: 20px" />
			<el-input v-model="addOrderForm.cardNo" placeholder="卡号" style="margin-bottom: 20px" />
			<el-input v-model="addOrderForm.cardId" placeholder="ID" style="margin-bottom: 20px" />
		</div>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="handleAddOrderClose">取消</el-button>
				<el-button type="primary" @click="handleAddOrderSubmit">提交</el-button>
			</span>
		</template>
	</el-dialog>
  </fs-page>
</template>

<!-- <script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import { useFs } from '@fast-crud/fast-crud';
import createCrudOptions from './crud';
import importExcel from '/@/components/importExcel/index.vue'

const totalOrders = ref(1200);
const todayOrders = ref(1);
const dialogVisible = ref(false);

const formData = reactive({
  field1: '',
  field2: '',
  field3: '',
  field4: ''
});


const { crudRef,crudBinding, crudExpose } = useFs({createCrudOptions,context});

// 页面打开后获取列表数据
onMounted(() => {
  crudExpose.doRefresh();
});


</script> -->
<script setup lang="ts">
import { ref, onMounted,getCurrentInstance,reactive } from 'vue';
import { useFs } from '@fast-crud/fast-crud';
import { ElMessage } from 'element-plus';
import createCrudOptions from './crud';
import importExcel from '/@/components/importExcel/index.vue'
import { InsertIntoCard} from './api';


const addOrderVisible = ref(false);
const addOrderForm = reactive({
  walletNo: '',
  cardNo: '',
  cardId: '',
  account_info:'',
  account_type:''
});

const handleAddOrderOpen = (crx:any) => {
  addOrderForm.account_info = crx.account_info;
  addOrderForm.account_type = crx.account_type;
  addOrderVisible.value = true;
};

const handleAddOrderClose = () => {
  addOrderVisible.value = false;
  Object.keys(addOrderForm).forEach(key => {
    addOrderForm[key] = '';
  });
};

const handleAddOrderSubmit = async () => {
  if (!addOrderForm.walletNo || !addOrderForm.cardNo || !addOrderForm.cardId) {
    ElMessage.warning('请填写所有字段');
    return;
  }
  
  try {
    // 这里需要替换为实际的API调用
    await InsertIntoCard(addOrderForm);
    ElMessage.success('订单添加成功');
    handleAddOrderClose();
    crudExpose.doRefresh();
  } catch (error) {
    console.error('添加订单失败:', error);
    ElMessage.error('添加订单失败');
  }
};



const dialogVisible = ref(false);
const context: any = {
		handleAddOrderOpen
		};
const { crudRef, crudBinding, crudExpose } = useFs({ createCrudOptions,context });

// 页面打开后获取列表数据
onMounted(() => {
  crudExpose.doRefresh();
});
</script>