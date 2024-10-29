import { request,downloadFile } from '/@/utils/service';
import { PageQuery, AddReq, DelReq, EditReq, InfoReq } from '@fast-crud/fast-crud';
export function InsertIntoCard(obj: AddReq) {
  return request({
    url:'/api/cardModelViewSet/',
    method: 'post',
    data: obj,
  });
}

export const apiPrefix = '/api/orderModelViewSet/';

export function GetList(query: PageQuery) {
	return request({
		url: apiPrefix,
		method: 'get',
		params: query,
	});
}
export function GetObj(id: InfoReq) {
	return request({
		url: apiPrefix + id,
		method: 'get',
	});
}

export function AddObj(obj: AddReq) {
	return request({
		url: apiPrefix,
		method: 'post',
		data: obj,
	});
}

export function UpdateObj(obj: EditReq) {
	return request({
		url: apiPrefix + obj.id + '/',
		method: 'put',
		data: obj,
	});
}

export function DelObj(id: DelReq) {
	return request({
		url: apiPrefix + id + '/',
		method: 'delete',
		data: { id },
	});
}

export function exportData(params:any){
    return downloadFile({
        url: apiPrefix + 'export_data/',
        params: params,
        method: 'get'
    })
}


export function getOrderNumber(){
	return request({
		url:apiPrefix + 'statistics/',
		method: 'get'
	  });
}

export function getTypeOrderNumber(params:any){
	return request({
		url:apiPrefix + 'type_statistics/',
		params: params,
		method: 'get'
	  });
}


