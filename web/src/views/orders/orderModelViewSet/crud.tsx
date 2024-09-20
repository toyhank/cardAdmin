import { CrudOptions, AddReq, compute,DelReq, EditReq, dict, CrudExpose, UserPageQuery, CreateCrudOptionsRet} from '@fast-crud/fast-crud';
import _ from 'lodash-es';
import * as api from './api';
import { request } from '/@/utils/service';
import {auth} from "/@/utils/authFunction";
import { ElMessage } from "element-plus";
import {successMessage,errorMessage} from '../../../utils/message';
import { useUserInfo } from '/@/stores/userInfo';
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
					custom: {
						text: '取消',
						show: true,
						click: async (ctx) => {
							try {
								const { row } = ctx;
								row.is_completed = false;
								row.is_accepted = false;
								row.assigned_by = '';
								await api.UpdateObj(row);
								successMessage('订单已取消');
							} catch (error) {
								errorMessage('取消订单失败');
								console.error(error);
							}
						},
					},
					remove: {
						show: auth("orderModelViewSet:Delete")
						,
					},
				},
				
			},
			columns: {
				created_at: {
					title: '创建时间',
					search: { show: true},
					column: {
						minWidth: 120,
						sortable: 'custom',
					},
					form: {
						show: false,
					},
				},
				
				customer_id: {
					title: '客户编码',
					type: 'input',
					search: { show: true},
					column: {
						minWidth: 120,
						sortable: 'custom',
					},
					form: {
						helper: {
							render() {
								return <div style={"color:blue"}>客户编码是必需要填写的</div>;
								}
							},
						rules: [{ required: true, message: '客户编码必填' }],
						component: {
							placeholder: '客户编码',
						},
					},
				},
                account_info: {
					title: '账密',
					type: 'number',
					search: { show: false },
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
					type: 'text',
					search: { show: false },
					column: {
						minWidth: 120,
						sortable: 'custom',
					},
					form: {
						rules: [{ required: true, message: '账号类型必填' }],
						component: {
							placeholder: '请输入账号类型',
						},
					},
				},
				priority: {
					title: '优先级',
					type: 'dict-select',
					search: { show: true },
					dict: dict({
						data: [
							{ value: '紧急', label: '紧急' },
							{ value: '优先', label: '优先' },
							{ value: '普通', label: '普通' },
							{ value: '慢速', label: '慢速' }
						]
					}),
					column: {
						minWidth: 120,
						sortable: 'custom',
						name: 'el-tag',
						style: ({ row }) => {
							const colorMap = {
								'紧急': 'color: #fff; background-color: #ffffff;',
								'优先': 'color: #fff; background-color: #e6a23c;',
								'普通': 'color: #fff; background-color: #409eff;',
								'慢速': 'color: #fff; background-color: #909399;'
							};
							return colorMap[row.priority as keyof typeof colorMap] || '';
						}
					},
					form: {
						component: {
							placeholder: '请选择优先级',
						},
					},
				},
				is_accepted: {
					title: "按钮",
					search: { show: true },
					type: "button",
					
					column: {
					  component: {
						disabled: compute(({ row }) => {
							const userStore = useUserInfo();
							const currentUser = userStore.userInfos;
							console.log(row.only_assigned_to);
							if(!row.only_assigned_to)
								return false;
							else if(row.only_assigned_to !== currentUser.username)
								return true;
						}),
						text: compute(({ value }) => {
							// Set button text based on value
							return value === true ? "已接单" : "接单";
						  }),
						
						style: {
							backgroundColor: '#409EFF', // Change the button color
							color: 'white' // Change the text color if needed
						  },
						  on: {
							// 注意：必须要on前缀
							click: async (ctx: any) => { 
							  const { row } = ctx;
							  
							  // 获取登录用户信息
							  const userStore = useUserInfo();

							  const currentUser = userStore.userInfos;
							  console.log(currentUser);
							  if (!currentUser) {
								errorMessage("请先登录");
								return;
							  }
							  
							  try {
								const res = await api.GetObj(row.id);
								if (res.data.is_accepted) {
								  errorMessage("接单失败，该订单已被接单");
								} else {
								  row.is_accepted = true;
								  row.assigned_by = currentUser.username; // 假设用户ID存储在id字段
								  console.log('11111'+currentUser.username)
								  row.assigned_at = new Date().toISOString();
								  const updateRes = await api.UpdateObj(row);
								  successMessage(updateRes.msg as string);
								}
							  } catch (error) {
								errorMessage("接单操作失败");
								console.error(error);
							  }
							}
						  }
					  }
					},
					form: {
						show: false,
					},
				  },
				  is_completed: {
					title: "按钮",
					search: { show: true },
					type: "button",
					form: {
						show: false,
					},
					
					column: {
					  component: {
						text: compute(({ value }) => {
							// Set button text based on value
							return value === true ? "已完成" : "完成";
						  }),
						style: {
							backgroundColor: '#409EFF', // Change the button color
							color: 'white' // Change the text color if needed
						  },
						on: {
						  // 注意：必须要on前缀
						  click: (ctx: any) => { 
							const { row } = ctx;
							row.is_completed = true;
							row.copleted_at = new Date().toISOString();
							const userStore = useUserInfo();

							const currentUser = userStore.userInfos;
							console.log(currentUser);
							if (!currentUser) {
							  errorMessage("请先登录");
							  return;
							}
							row.completed_by = currentUser.id; // 假设用户ID存储在id字段
							console.log(ctx)
						
                                    api.UpdateObj(row).then((res: APIResponseData) => {
                                        successMessage(res.msg as string);
                                    })
						   }
						}
					  }
					}
				  },
			only_assigned_to: {
				title: '指定接单人',
				type: 'dict-select',
				dict: dict({
					url: '/api/system/user/',
					value: 'username',
					label: 'username'
				}),
				column: {
					show: false // 不在表格中显示
				},
				form: {
					show: true, // 在表单中显示
					component: {
						placeholder: '请选择指定接单人'
					}
				}
			},


			},
			table: {
				rowClassName: ({row}) => {
					if (row.priority === '紧急') {
						return 'urgent-row';
					} else if (row.priority === '优先') {
						return 'high-priority-row';
					} else if (row.priority === '普通') {
						return 'normal-row';
					} else if (row.priority === '慢速') {
						return 'low-priority-row';
					}
					return '';
				}
			}
		},
	};
}