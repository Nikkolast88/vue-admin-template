import request from '@/utils/request'

export function getLogIn(params) {
  return request({
    url: `/login`,
    method: 'post',
    data: params
  })
}
