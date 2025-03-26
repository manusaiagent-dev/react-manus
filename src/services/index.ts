import request from '@/utils/request';
export async function queryInvite(params: {address: string}) {
  return request.post('/user/invite/info', params);
}
export async function newInvite(params: {address: string}) {
  return request.post('/user/invite/new', params);
}