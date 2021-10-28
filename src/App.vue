<template>
  <div id="app">
    <Header/>
    <Actions h2="Heading H2"/>
    <Footer/>
  </div>
</template>

<script>
import Actions from './pages/Actions.vue';
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';

export default {
  name: 'App',
  components: {
    Actions,
    Header,
    Footer
  }
}
</script>
<style>

</style>
