<template>
  <div class="cash">
  <el-row>
  	<el-col :span='7' id='order-list' class='cash-order'>
  		<el-tabs>
	  		<el-tab-pane label='点餐'>
	  			<el-table :data='tableData' border style='width:100%;'>
	  				<el-table-column prop='goodsName' label='商品'></el-table-column>
	  				<el-table-column prop='count' label='数量' width='70'></el-table-column>
	  				<el-table-column prop='price' label='金额' width='70'></el-table-column>
	  				<el-table-column  label='操作' width='100' fixed='right'>
	  				<template scope='scope'>
	  					<el-button type='text' size='small' @click='delSingleData(scope.row)'>删除</el-button>
	  					<el-button type='text' size='small' @click='getGoodsData(scope.row)'>添加</el-button>	
	  				</template>
            
	  				</el-table-column>
	  			</el-table>
          <div class='statistics'>
            <small>数量：</small>{{totalCount}} <small>总金额：</small> <span class='usual-price'>￥{{totalPrice}}元</span>
          </div>
	  			<div class='operate-button'>
	  				<el-button type='warning'>挂单</el-button>
		  			<el-button type='danger' @click='deleteAllData'>删除</el-button>
		  			<el-button type='success' @click='settle'>结算</el-button>
	  			</div>
	  		</el-tab-pane>

	  		<el-tab-pane label='挂单'></el-tab-pane>
	  		<el-tab-pane label='外卖'></el-tab-pane>
  		</el-tabs>
  	</el-col>
  	<el-col :span='17'>
  		<div class='usual-goods'>
  			<div class='usual-title'>常用商品</div>
  			<ul>
  				<li v-for='goods in usualGoodsData' @click='getGoodsData(goods)'>
  					<span>{{goods.goodsName}}</span>
  					<span class='usual-price'>￥{{goods.price}}元</span>
  				</li>
  			</ul>
  		</div>
  		<div class='classify-goods'>
  			<el-tabs>
  				<el-tab-pane label='汉堡'>
  					<ul>
		  				<li v-for='goods in classify0GoodsData' @click='getGoodsData(goods)'>
		  					<img :src='goods.goodsImg' class='goods-img'>
		  					<span class='goods-info'>
		  						<span class='food-name'>{{goods.goodsName}}</span>
		  						<span class='food-name-price'>￥{{goods.price}}元</span>
		  					</span>
		  				</li>
  					</ul>
  				</el-tab-pane>
  				<el-tab-pane label='小食'>
  					<ul>
		  				<li v-for='goods in classify1GoodsData' @click='getGoodsData(goods)'>
		  					<img :src='goods.goodsImg' class='goods-img'>
		  					<span class='goods-info'>
		  						<span class='food-name'>{{goods.goodsName}}</span>
		  						<span class='food-name-price'>￥{{goods.price}}元</span>
		  					</span>
		  				</li>
  					</ul>
  				</el-tab-pane>
  				<el-tab-pane label='饮料'>
  					<ul>
		  				<li v-for='goods in classify2GoodsData' @click='getGoodsData(goods)'>
		  					<img :src='goods.goodsImg' class='goods-img'>
		  					<span class='goods-info'>
		  						<span class='food-name'>{{goods.goodsName}}</span>
		  						<span class='food-name-price'>￥{{goods.price}}元</span>
		  					</span>
		  				</li>
  					</ul>
  				</el-tab-pane>
  				<el-tab-pane label='套餐'>
  					<ul>
		  				<li v-for='goods in classify3GoodsData' @click='getGoodsData(goods)'>
		  					<img :src='goods.goodsImg' class='goods-img'>
		  					<span class='goods-info'>
		  						<span class='food-name'>{{goods.goodsName}}</span>
		  						<span class='food-name-price'>￥{{goods.price}}元</span>
		  					</span>
		  				</li>
  					</ul>
  				</el-tab-pane>
  			</el-tabs>
  		</div>
  	</el-col>
  </el-row>
  	
  </div>
</template>

<script>
import axios from 'axios';  /*需要axios的时候引入*/
export default {
  name: 'Cash',
  created:function(){
  	let _this=this;
  	axios.get('http://jspang.com/DemoApi/oftenGoods.php')
  	.then(function(response){  /*es5写法 this作用域，需要结合 let _this=this 使用*/
  		_this.usualGoodsData=response.data;
  	})
  	.catch(error=>{ /*es6写法*/
  		alert('网络问题，稍后重试');
  	});
  	axios.get('http://jspang.com/DemoApi/typeGoods.php')
  	.then(response=>{  /*es6写法。里面的this就是指外面的对象*/
  		console.log(response);
  		this.classify0GoodsData=response.data[0];
  		this.classify1GoodsData=response.data[1];
  		this.classify2GoodsData=response.data[2];
  		this.classify3GoodsData=response.data[3];
  	})
  	.catch(error=>{
  		alert('网络问题，稍后重试');
  	})
  },
  /*解决高度100%显示问题*/
  mounted(){
  	let h = document.body.clientHeight;
  	console.log(h);
  	document.getElementById('order-list').style.height=h+'px';
  },
  data () {
    return {
    /*左侧的table表格中数据*/
     	tableData:[],
     	/*常用商品列表*/
     	usualGoodsData:[],
     	/*分类商品列表*/
     	classify0GoodsData:[],
     	classify1GoodsData:[],
     	classify2GoodsData:[],
     	classify3GoodsData:[],
      //总金额
      totalPrice:0,
      //总数量
      totalCount:0,

    }
  },
  methods:{
    getGoodsData(goods){
      //每次计算前总金额总数量都清零
      this.totalPrice = 0;
      this.totalCount = 0;

      //定义个变量，默认是false表示没有
      let isHave = false;
      let n = this.tableData.length;
      for(let i=0;i<n;i++){
        if(this.tableData[i].goodsId==goods.goodsId){
          isHave = true;//说明列表中有这个商品
        }
      }

      //根据isHave的值来写逻辑
      if(isHave){
        //列表中有，则对应的数量增加
        let arr = this.tableData.filter(a=>a.goodsId == goods.goodsId);
        console.log(arr);
        arr[0].count++;
      }else{
        //没有的话则加入到列表中
        let newgoods = {goodsId:goods.goodsId,goodsName:goods.goodsName,price:goods.price,count:1};

        this.tableData.push(newgoods);
      }
      //计算总金额数量
      this.totalAll();

    },
    //计算总金额数量
    totalAll(){
      //每次计算前清零
      this.totalCount=0;
      this.totalPrice=0;
         // this.tableData.forEach(element=>{
        //this.totalCount+=element.count;
        //this.totalPrice=this.totalPrice+(element.count*element.price);
      //})
      let m = this.tableData.length;
      for(let i=0;i<m;i++){
        this.totalCount+=this.tableData[i].count;
        this.totalPrice=this.totalPrice+(this.tableData[i].count*this.tableData[i].price);
      }

    },
   
    //删除单个商品
    delSingleData(goods){
     
         //利用数组的删除子项的方法，也可以利用数组的过滤方法filter实现
        //获取要删除对象的在数组中的下标
        let i = this.tableData.indexOf(goods);
        console.log(i);
        this.tableData.splice(i,1);

        //利用数组的过滤方法filter实现
        //this.tableData=this.tableData.filter(a=>a.goodsId!=goods.goodsId);

           //计算总金额数量
      this.totalAll();

    },
      //删除全部
    deleteAllData(goods){
      //金钱数量总额清零
      this.totalCount=0;
      this.totalPrice=0;
      //数组清零
      this.tableData=0;

    },
    //结算，模拟结算，实际要用到axios.post()方法，现在模拟已经插入数据成功
    //之后就把总金额总数量，商品列表清零,再给一个提示
      settle(){
          if(this.totalCount!=0){
            //金钱数量总额清零
            this.totalCount=0;
            this.totalPrice=0;
            //数组清零
            this.tableData=[];
            this.$message('结算成功呦');
          }else{
             this.$message.error('没有商品，不能结算');
          }
      }

   
  }

}
</script>

<style scoped>
	.cash-order{
		background-color:#f9fafc;
		border-right:1px solid #c0ccda;
	 }
	.operate-button{
		margin-top:10px;
	}
	
	.usual-goods .usual-title{
		height:21px;
		padding:10px;
		border-bottom:1px solid #D3DCE6;
		background-color:#f9fafc;
		text-align:left;
	}
	.usual-goods ul{
		display:flex;
		display:-webkit-flex;
		flex-wrap:wrap;
	}
	.usual-goods ul li{
		margin:5px;
		padding:10px;
		list-style:none;
		border:1px solid #e5e9f2;
		background-color:#fff;
		border-radius:2px;
		-webkit-border-radius:2px;
		-mos-border-radius:2px;
    cursor:pointer;
	}
	 .usual-price{
		color:#58B7FF; 
	}
	.classify-goods ul{
		display:flex;
		display:-webkit-flex;
		flex-wrap:wrap;
	}
	.classify-goods ul li{
		display:flex;
		display:-webkit-flex;
		height:auto;
		overflaow:hidden;
		padding:2px;
		margin:2px;
		border:1px solid #e5e9f2;
		background-color:#fff;
		list-style:none;
		text-align:left;
    cursor:pointer;
	}
	.goods-img{Width:60px;height:50px;}
	.goods-info{
		display:flex;
		display:-webkit-flex;
		flex-direction:column;
		flex-wrap:wrap;
	}
	 .food-name{
       font-size: 18px;
       padding-left: 10px;
       color:brown;
       display:inline-block;
 
   }
   .food-name-price{
       font-size: 16px;
       padding-left: 10px;
       padding-top:10px;
       display:inline-block;
   }
   .statistics{
    height:25px;
    line-height:25px;
    padding:5px 10px;
    border-bottom:1px solid #e5e9f2;
    text-align:left;
   }
   .statistics small{
      margin-left:40px;
      margin-right:5px;
   }
</style>
