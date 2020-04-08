const getters = {
    device: state => state.app.device,
    resources: state => state.user.resources,
    addRouters: state => state.permission.addRouters
}
export default getters