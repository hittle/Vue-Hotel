<template>
  <div id="hello">
    <div v-if="books.length">
    <table>
      <thead>
        <tr>
          <th></th>
          <th>书籍名称</th>
          <th>出版日期</th>
          <th>价格</th>
          <th>数量</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(book,index) in books" >
          <td >{{index+1}}</td>
          <td >{{book.name}}</td>
          <td >{{book.date}}</td>
          <td >{{book.price | showPrice}}</td>
          <td ><button @click="decrement(index)" :disabled="book.count <= 1">-</button>{{book.count}}<button @click="increment(index)">+</button></td>
          <td><button @click="deleteBook(index)">删除</button></td>
        </tr>
      </tbody>
      <h2>总价格{{totalPrice | showPrice}}</h2>
    </table>
   </div>
   <h2 v-else>购物车为空</h2>
   <get-cust></get-cust>
  </div>
</template>
<script>
import getCust from '../components/getCust'
import GetCust from '../components/getCust.vue';
export default {
  name:'index',
  components:{
    getCust
  },
  data(){
    return{
    books:[
      {
        id: 1,
        name: '《数学》',
        date: '2006-9',
        price: 85.00,
        count: 1
      },
      {
        id: 2,
        name: '《数学》',
        date: '2006-9',
        price: 85.00,
        count: 1
      },
      {
        id: 3,
        name: '《数学》',
        date: '2006-9',
        price: 85.00,
        count: 1
      },
      {
        id: 4,
        name: '《数学》',
        date: '2006-9',
        price: 85.00,
        count: 1
      }

    ]
  }
  },
  methods:{
    decrement(index){
      if(this.books[index].count>=1)
      this.books[index].count--;
    },
    increment(index){
      this.books[index].count++;
    },
    
    deleteBook(index){
      this.books.splice(index,1);
    }
  },
  computed:{
    totalPrice(){
      let totalPrice = 0;
      for(let i = 0; i < this.books.length; i++){
        totalPrice += this.books[i].price * this.books[i].count;
      }
      return totalPrice;
    }
  },
  filters:{
    showPrice(price){
      return '￥'+price.toFixed(2);
    }
  }
};
</script>
<style scoped>
table {
  border: 1px solid #e9e9e9;
  border-collapse: collapse;
  border-spacing: 0;
}
th, td {
  padding: 0px 16px;
  border: 1px solid #e9e9e9;
  text-align: left;
}
th {
  background-color: #f7f7f7;
  color: #5c6b77;
  font-weight: 600;
}
</style>