<template>
	<fs-page class="PageFeatureSearchMulti">

  
	  <!-- 原有的 fs-crud 组件 -->
	  <fs-crud ref="crudRef" v-bind="crudBinding">
		<template #cell_url="scope">
		  <el-tag size="small">{{ scope.row.url }}</el-tag>
		</template>
		<!-- 添加的控件 -->
		<template #actionbar-right>
		  <!-- 导入按钮 -->
		  <importExcel api="api/cardModelViewSet/" v-auth="'user:Import'">导入</importExcel>
		  
		  <!-- 新增的导出按钮控件 -->
		</template>
	  </fs-crud>
	  
	  <!-- 添加出库对话框 -->
	  <el-dialog v-model="outboundCardVisible" title="出库" width="400px" draggable :before-close="handleOutboundCardClose">
		<div>
			<el-input v-model="outboundCardForm.sales_destination" placeholder="出库去向" style="margin-bottom: 20px" />
			<el-input v-model="outboundCardForm.sales" placeholder="金额" style="margin-bottom: 20px" />
		</div>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="handleOutboundCardClose">取消</el-button>
				<el-button type="primary" @click="handleOutboundCardSubmit">提交</el-button>
			</span>
		</template>
	  </el-dialog>
	</fs-page>
  </template>
  

<script lang="ts">
import { onMounted, getCurrentInstance, defineComponent, ref, reactive } from 'vue';
import { useFs } from '@fast-crud/fast-crud';
import createCrudOptions  from './crud';
import { UpdateObj } from './api';
import { ElMessage } from 'element-plus';
import { useUserInfo } from '/@/stores/userInfo';

// 注释编号: django-vue3-admin-index192316:导入组件
import importExcel from '/@/components/importExcel/index.vue'   


export default defineComponent({    //这里配置defineComponent
    name: "cardModelViewSet",   //把name放在这里进行配置了
	components: {importExcel},  //注释编号: django-vue3-admin-index552416: 注册组件，把importExcel组件放在这里，这样<template></template>中才能正确的引用到组件
    setup() {   //这里配置了setup()

		const instance = getCurrentInstance();

	

		

		// 添加出库相关的响应式变量和方法
		const outboundCardVisible = ref(false);
		const outboundCardForm = reactive({
			id: '',
			walletNo: '',
			cardNo: '',
			cardId: '',
			account_info: '',
			account_type: '',
			created_at: '',
			sales_destination: '',
			sales: '',
			status: '',
			delivered_by: ''
		});

		const handleOutboundCardOpen = (row: any) => {
			Object.keys(row).forEach(key => {
					if (key in outboundCardForm) {
						(outboundCardForm as any)[key] = row[key];
					}
				});
			const userStore = useUserInfo();
			const currentUser = userStore.userInfos;
			outboundCardForm.status = '已出库';
			outboundCardForm.delivered_by = currentUser.name;
			outboundCardVisible.value = true;
		};

		const handleOutboundCardClose = () => {
			outboundCardVisible.value = false;
			Object.keys(outboundCardForm).forEach((key) => {
				(outboundCardForm as any)[key] = '';
			});
		};

		const context: any = {
			handleOutboundCardOpen
		};
		const { crudBinding, crudRef, crudExpose, resetCrudOptions } = useFs({ createCrudOptions, context});  

		const handleOutboundCardSubmit = async () => {
			try {
				// 将 crx 的所有字段赋值给 outboundCardForm
				
				await UpdateObj(outboundCardForm);
				ElMessage.success('出库成功');
				handleOutboundCardClose();
				crudExpose.doRefresh();
			} catch (error) {
				console.error('出库失败:', error);
				ElMessage.error('出库失败');
			}
		};

		const handleAddOrderOpen = (crx:any) => {

};

		// 页面打开后获取列表数据
		onMounted(() => {
			crudExpose.doRefresh();
		});

		return {  
			crudBinding,
			crudRef,
			outboundCardVisible,
			outboundCardForm,
			handleOutboundCardOpen,
			handleOutboundCardClose,
			handleOutboundCardSubmit
		};
    } 	//这里关闭setup()
  });  //关闭defineComponent

</script>