<template>
  <div/>
</template>

<script>
  import axios from 'axios';

  export default {
    layout: 'blank',
    middleware: async (ctx) => {
      let {status, data} = await axios.get('/users/exit');
      if (status === 200) {
        if (data && data.code === 0) {
          location.href = '/login';
        }
      }
    }
  };
</script>

<style>

</style>
