<template>
  <div>
    <NotOpenRoom  />
    <OpenRoom  />
  </div>
</template>


<script>
import NotOpenRoom from '../components/NotOpenRoom';
import OpenRoom from '../components/OpenRoom';
export default {
  data() {
    return {
      
    }
  },
  components:{
    NotOpenRoom,
    OpenRoom
  },
  mounted(){
  },
  methods:{
    
  },
  computed:{
    // notOpened(){
    //   // console.log(1)
    //   return this.room.filter(function(item){
    //     return item.room_status===0;
    //   })
      
    // },
    // opened(){
    //   // console.log(1)
    //   return this.room.filter(function(item){
    //     return item.room_status===1;
    //   })
      
    // },
  },
}
</script>
