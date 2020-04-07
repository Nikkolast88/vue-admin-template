import request from '@/utils/request'

export function getRoles(params) {
  return request({
    url: `/admin/roles/list`,
    method: 'get',
    params: params
  })
}

export function postRoles(params) {
  return request({
    url: `/admin/roles/create`,
    method: 'post',
    data: params
  })
}

export function putRoles(params) {
  return request({
    url: `/admin/roles/update`,
    method: 'put',
    data: params
  })
}

export function removeRoles(params) {
  return request({
    url: `/admin/roles/${params.id}`,
    method: 'delete'
  })
}

export function getRolesResource(params) {
  return request({
    url: `/admin/roles/resource/${params.roleId}`,
    method: 'get',
    params: params
  })
}

export function postRolesResource(params) {
  return request({
    url: `/admin/roles/resource`,
    method: 'post',
    data: params
  })
}
