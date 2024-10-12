import { CrudOptions, AddReq, compute,DelReq, EditReq, dict, CrudExpose, UserPageQuery, CreateCrudOptionsRet} from '@fast-crud/fast-crud';
import _ from 'lodash-es';
import * as api from './api';
import { request } from '/@/utils/service';
import {auth} from "/@/utils/authFunction";
import { ElMessage,ElMessageBox } from "element-plus";
import {successMessage,errorMessage} from '../../../utils/message';
import { useUserInfo } from '/@/stores/userInfo';
import { TrophyBase } from '@element-plus/icons-vue/dist/types';
//此处为crudOptions配置
	export default function ({ crudExpose}: { crudExpose: CrudExpose}): CreateCrudOptionsRet {
	const { crudBinding } = crudExpose;
	const pageRequest = async (query: any) => {
		return await api.GetList(query);
	};
	const editRequest = async ({ form, row }: EditReq) => {
		if (row.id) {  
			form.id = row.id;
		}
		return await api.UpdateObj(form);
	};
	const delRequest = async ({ row }: DelReq) => {
		return await api.DelObj(row.id);
	};
	const addRequest = async ({ form }: AddReq) => {
		return await api.AddObj(form);
	};

    const exportRequest = async (query: UserPageQuery) => {
		return await api.exportData(query)
	};

	return {
		crudOptions: {
			request: {
				pageRequest,
				addRequest,
				editRequest,
				delRequest,
			},
			actionbar: {
				buttons: {
					add: {
						show: auth('user:Create')
					},
				},
			},
			rowHandle: {
				//固定右侧
				fixed: 'right',
				width: 400,
				buttons: {
					remove: {
						show: auth("orderTypeModelViewSet:Delete")
						,
					},
			},
			},
			columns: {

				user: {
					title: '用户',
					type: 'text',
					search: { show: false},
					column: {
						minWidth: 120,
						sortable: 'custom',
					},
					form: {
						show: false,
					},
				},
				amount: {
					title: '订单数量',
					type: 'number',
					search: { show: false},
					column: {
						minWidth: 120,
						sortable: 'custom',
					},
					form: {
						show: false,
					},
				},
				commission_rate: {
					title: '提成单价',
					type: 'number',
					search: { show: false},
					column: {
						minWidth: 120,
						sortable: 'custom',
						component: {
							name: 'el-input-number',
							props: {
								controls: true,
								precision: 2,
								step: 0.1,
								min: 0
							},
							events: {
								change: async (ctx: any) => {
									const { row } = ctx;
									try {
										await api.UpdateObj({
											id: row.id,
											commission_rate: row.commission_rate
										});
										ElMessage.success('提成单价更新成功');
										// 刷新总额
										row.total_commission = row.amount * row.commission_rate;
										await api.UpdateObj({
											id: row.id,
											total_commission: row.total_commission
										});
										// 强制刷新视图
										ctx.emit('update:modelValue', row.commission_rate);
										ctx.$emit('change', row.commission_rate);
									} catch (error: any) {
										ElMessage.error('更新失败：' + error.message);
									}
								}
							}
						}
					},
					form: {
						show: true,
						component: {
							name: 'el-input-number',
							props: {
								controls: true,
								precision: 2,
								step: 0.1,
								min: 0
							}
						}
					},
				},
				total_commission: {
					title: '提成总额',
					type: 'number',
					search: { show: false},
					column: {
						minWidth: 120,
						sortable: 'custom',
						component: {
							name: 'el-input',
							props: {
								disabled: true
							}
						}
					},
					form: {
						show: false,
					},
				},
			}
		}		
	}
	}