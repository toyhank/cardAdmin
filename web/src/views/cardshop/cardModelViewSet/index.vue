<template>
	<fs-page class="PageFeatureSearchMulti">
	  <!-- 添加仪表盘 -->
	  <div class="dashboard">
		<el-row :gutter="20">
		  <el-col :span="6">
			<el-card shadow="hover">
			  <div slot="header">总订单数</div>
			  <div class="dashboard-item">
				<h2>{{ 1200 }}</h2>
			  </div>
			</el-card>
		  </el-col>
		  <el-col :span="6">
			<el-card shadow="hover">
			  <div slot="header">今日订单数</div>
			  <div class="dashboard-item">
				<h2>{{ 1 }}</h2>
			  </div>
			</el-card>
		  </el-col>
		</el-row>
	  </div>
  
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
	</fs-page>
  </template>
  

<script lang="ts">
import { onMounted, getCurrentInstance, defineComponent} from 'vue';
import { useFs } from '@fast-crud/fast-crud';
import createCrudOptions  from './crud';

// 注释编号: django-vue3-admin-index192316:导入组件
import importExcel from '/@/components/importExcel/index.vue'   


export default defineComponent({    //这里配置defineComponent
    name: "orderModelViewSet",   //把name放在这里进行配置了
	components: {importExcel},  //注释编号: django-vue3-admin-index552416: 注册组件，把importExcel组件放在这里，这样<template></template>中才能正确的引用到组件
    setup() {   //这里配置了setup()

		const instance = getCurrentInstance();

		const context: any = {
			componentName: instance?.type.name
		};

		const { crudBinding, crudRef, crudExpose, resetCrudOptions } = useFs({ createCrudOptions, context});  


		// 页面打开后获取列表数据
		onMounted(() => {
			crudExpose.doRefresh();
		});
		return {  
		//增加了return把需要给上面<template>内调用的<fs-crud ref="crudRef" v-bind="crudBinding">
				crudBinding,
				crudRef,
			};
	

    } 	//这里关闭setup()
  });  //关闭defineComponent

</script>