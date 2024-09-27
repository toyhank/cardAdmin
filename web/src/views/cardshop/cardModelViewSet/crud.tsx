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
					export: {
						text: '导出', //按钮文字
						title: '导出', //鼠标停留显示的信息
						show: auth('user:Export'),
						click() {
							return exportRequest(crudExpose!.getSearchFormData());
						},
					},
				},
			},
			rowHandle: {
				//固定右侧
				fixed: 'right',
				width: 400,
				buttons: {
					remove: {
						show: auth("orderModelViewSet:Delete")
						,
					},
					outbound: {
						text: '出库',
						show: true,
						click: async (ctx) => {
							try {
								const { row } = ctx;
								const { value: outboundRemark } = await ElMessageBox.prompt(
									'请输入出库备注',
									'出库',
									{
									  confirmButtonText: '确定',
									  cancelButtonText: '取消',
									  inputValidator: (value) => {
										if (!value) {
										  return '备注不能为空';
										}
										return true;
									  },
									}
								);
								row.status = '已出库';
								const userStore = useUserInfo();
								const currentUser = userStore.userInfos;
								row.delivered_by = currentUser.name;
								row.memo = outboundRemark;
								await api.UpdateObj(row);
								successMessage('订单已出库');
							} catch (error) {
								if (error !== 'cancel') {
									errorMessage('订单出库失败');
									console.error(error);
								}
							}
						},
					},
				},
				
			},
			columns: {
				
				created_at: {
					title: '创建时间',
					search: { show: false},
					column: {
						minWidth: 120,
						sortable: 'custom',
					},
					form: {
						show: false,
					},
				},
				walletNo: {
					title: '钱包编号',
					search: { show: false},
					column: {
						minWidth: 120,
						sortable: 'custom',
					},
					form: {
						show: true,
					},
				},
				cardNo: {
					title: '卡号',
					search: { show: false},
					column: {
						minWidth: 120,
						sortable: 'custom',
					},
					form: {
						show: true,
					},
				},
				cardId: {
					title: 'ID',
					search: { show: false},
					column: {
						minWidth: 120,
						sortable: 'custom',
					},
					form: {
						show: true,
					},
				},
				status: {
					title: '状态',
					type: 'dict-select',
					search: { show: true },
					dict: dict({
						data: [
							{ value: '已出库', label: '已出库' },
							{ value: '未出库', label: '未出库' },
						]
					}),
					column: {
						minWidth: 120,
						sortable: 'custom',
					},
					form: {
						show: false,
					},
				},
				memo: {
					title: '出库备注',
					type: 'text',
					search: { show: true},
					column: {
						minWidth: 120,
						sortable: 'custom',
					},
					form: {
						show: false,
					},
				},
				
				created_by: {
					title: '创建人',
					search: { show: false},
					column: {
						minWidth: 120,
						sortable: 'custom',
						show: false,
					},
					form: {
						show: false,
					},
				},
                account_info: {
					title: '账密',
					type: 'text',
					search: { show: true },
					column: {
						minWidth: 120,
						sortable: 'custom',
					},
					form: {
						rules: [{ required: true, message: '账密必填' }],
						component: {
							placeholder: '请输入账密',
						},
					},
				},

                account_type: {
					title: '账号类型',
					type: 'dict-select',
					search: { show: true },
					dict: dict({
						data: [
							{ value: 'gpt', label: 'GPT' },
							{ value: 'claude', label: 'Claude' },
							{ value: 'mj', label: 'Midjourney' },
							{ value: 'disney', label: 'Disney' }
						]
					}),
					column: {
						minWidth: 120,
						sortable: 'custom',
					},
					form: {
						rules: [{ required: true, message: '账号类型必填' }],
						component: {
							placeholder: '请选择账号类型',
						},
					},
				},
			}
			
	}
	}
}