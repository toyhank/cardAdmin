import { CrudOptions, AddReq, compute,DelReq, EditReq, dict, CrudExpose, UserPageQuery,CreateCrudOptionsProps, CreateCrudOptionsRet} from '@fast-crud/fast-crud';
import _ from 'lodash-es';
import * as api from './api';
import { request } from '/@/utils/service';
import {auth} from "/@/utils/authFunction";
import { ElMessage } from "element-plus";
import {successMessage,errorMessage} from '../../../utils/message';
import { useUserInfo } from '/@/stores/userInfo';
import { defineComponent } from 'vue';
import { ref } from 'vue';
import { nextTick } from 'vue'
//此处为crudOptions配置
export default function ({ crudExpose, context }: CreateCrudOptionsProps): CreateCrudOptionsRet {
	const fooRef = ref(0)
	context.fooRef = fooRef //将fooRef 通过context传递给index.vue
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
		const userStore = useUserInfo();
		const currentUser = userStore.userInfos;
		form.create_by = currentUser.name;
		return await api.AddObj(form);
	};

    const exportRequest = async (query: UserPageQuery) => {
		return await api.exportData(query)
	};
	const dialogVisible = ref(false);
    const formData = ref({
        field1: '',
        field2: '',
        field3: '',
        field4: ''
    });

    const openDialog = () => {
        dialogVisible.value = true;
    };

    const handleConfirm = async (ctx) => {
        if (!formData.value.field1 || !formData.value.field2 || !formData.value.field3 || !formData.value.field4) {
            ElMessage.error('所有字段都不能为空');
            return;
        }
        // 处理表单数据
        try {
            await api.InsertIntoCard(formData.value);
			const { row } = ctx;
								row.is_completed = false;
								row.is_accepted = false;
								row.assigned_by = '';
            successMessage('已成功插入一条记录到cardmodel表');
            dialogVisible.value = false;
        } catch (error) {
            errorMessage('插入记录失败');
            console.error(error);
        }
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
				
				ticket_title: {
					title: '工单标题',
					type: 'input',
					search: { show: true},
					column: {
						minWidth: 120,
						sortable: 'custom',
					},
					form: {

						component: {
							placeholder: '客户编码',
						},
					},
				},
                // ticket_content: {
				// 	title: '工单内容',
				// 	type: 'text',
				// 	search: { show: false },
				// 	column: {
				// 		minWidth: 120,
				// 		sortable: 'custom',
				// 	},
				// 	form: {
				// 		rules: [{ required: true, message: '账密必填' }],
				// 		component: {
				// 			placeholder: '请输入账密',
				// 		},
				// 	},
				// },
				ticket_content: {
					title: "内容",
					column: {
					  width: 300,
					  show: false
					},
					type: ["editor-wang5"], // 富文本图片上传依赖file-uploader，请先配置好file-uploader
					form: {
					  // 动态显隐字段
					  // show: compute(({ form }) => {
					  //   return form.change === "wang";
					  // }),
					  col: {
						span: 24
					  },
					  rules: [
						{
						  required: true,
						  message: "此项必填",
						  validator: async (rule, value) => {
							if (value.trim() === "<p><br></p>") {
							  throw new Error("内容不能为空");
							}
						  }
						}
					  ],
					  component: {
						disabled: compute(({ form }) => {
						  return form.disabled;
						}),
						id: "1", // 当同一个页面有多个editor时，需要配置不同的id
						config: {},
						uploader: {
						  type: "form",
						  buildUrl(res) {
							return res.url;
						  }
						}
					  }
					}
				  },

				  ticket_type: {
					title: '工单分类',
					type: 'dict-select',
					search: { show: true },
					dict: dict({
						data: [
							{ value: '钱包问题', label: '钱包问题' },
							{ value: 'id问题', label: 'id问题' },
							{ value: '账号问题', label: '账号问题' },
							{ value: '售后问题', label: '售后问题' },
							{ value: '其他问题', label: '其他问题' }
						]
					}),
					column: {
						minWidth: 120,
						sortable: 'custom',
					},
					form: {
						value:"钱包问题",
						component: {
							placeholder: '工单分类',
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
						value:'普通',
						component: {
							placeholder: '请选择优先级',
						},
					},
				},
				is_accepted: {
					title: "按钮",
					search: { show: false },
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
					search: { show: false },
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
