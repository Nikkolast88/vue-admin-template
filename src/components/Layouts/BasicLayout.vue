<template>
  <a-layout>
    1
  </a-layout>
</template>
<script>
import { mapState } from 'vuex'
// import SideMenu from '@/components/SideMenu'
export default {
  components: {
  },
  data() {
    return {
      collapsed: false,
      menus: []
    }
  },
  computed: {
    ...mapState({
      mainMenu: state => state.user.resources
    })
  },
  created() {
    const routes = this.mainMenu
    this.menus = routes
  }
}
</script>
<style scoped>

</style>