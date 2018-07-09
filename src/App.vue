<template>
  <div id="app">
    <transition name="slide-fade">
      <div id="toTop" @click="toTop" v-show="scrollShow"></div>
    </transition>
    <div class="feedback-box">   
        <feedback></feedback>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
  import feedback from './components/feedback'
    export default {
      components: {
        feedback
    },
  data() {
    return{
      loading2: true,
      scrollShow:false
    }
  },
  name: 'app',
  methods: {
    toTop() {
      $('.nano-content').animate({scrollTop:0},200)
    },
    openFullScreen2() {
        const loading = this.$loading({
          lock: false,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        setTimeout(() => {
          loading.close();
        }, 2000);
      }
  },
  created() {
    // this.openFullScreen2()
    let that = this
    $(".nano").on("update", function(event, values){ 
        if(values.position > 700){
          that.scrollShow = true
        }else(
          that.scrollShow = false
        )
    });
  },
}
</script>

<style>
  .el-loading-mask,.is-fullscreen{
    background: rgba(0, 0, 0, 0.96) !important;
  }

  .slide-fade-enter-active {
    transition: all .4s ease;
  }
  .slide-fade-leave-active {
    transition: all .6s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .slide-fade-enter, .slide-fade-leave-to{
    transform: translateX(10px);
    opacity: 0;
  }
</style>

