import request from '@/utils/request'

export function getResources(params) {
  return request({
    url: `/admin/resources/list`,
    method: 'get',
    params: params
  })
}
export function getResourcesRoots(params) {
  return request({
    url: `/admin/resources/root`,
    method: 'get',
    params: params
  })
}

export function getUserRoleTree(params) {
  return request({
    url: `admin/resources/user`,
    method: 'get',
    params: params
  })
}

export function postResources(params) {
  return request({
    url: `/admin/resources/create`,
    method: 'post',
    data: params
  })
}

export function putResources(params) {
  return request({
    url: `/admin/resources/update`,
    method: 'put',
    data: params
  })
}

export function removeResources(params) {
  return request({
    url: `/admin/resources/${params.id}`,
    method: 'delete'
  })
}
