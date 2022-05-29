class Details {
    constructor() {
        this.getInfo();
        this.bindEve();
    }
    //绑定事件
    bindEve() {
        //给加入购物车添加点击事件
        // console.log(this.$('.join'));
        this.$('.join').addEventListener('click', this.checkLogin.bind(this));
    }
    //获取详情信息
    async getInfo() {
        // console.log(1111);
        //获取商品id
        let listId = sessionStorage.getItem('goods_id');
        // console.log(listId);
        //发送请求
        let { status, data } = await axios.get('http://localhost:8888/goods/item?id=' + listId);
        // console.log(data, status);
        //判断是否请求成功
        if (status != 200 || data.code != 1) throw new Error('请求错误');
        // console.log(data.info);
        //修改页面中的属性值
        // console.log(this.$('.big_Img').src);
        this.$('.big_Img').src = data.info.img;
        this.$('.introduce h2').innerHTML = data.info.title;
        this.$('.introduce h1').innerHTML = data.info.titleCn;
        this.$('.unit-price').innerHTML = data.info.price;
    }
    /*********加入购物车***********/
    //判断是否已经登录
    checkLogin() {
        // console.log(this);
        //判断用户是否登录，如果localStroage中有token表示登录
        let token = localStorage.getItem('token');
        // console.log(token);
        //如果没有token表示没有登录 此时跳到登录页面
        if (!token) location.assign('./login.html?ReturnUrl=./details.html');
        
        //如果用户已经登录成功，此时需要讲商品加入到购物车
        //先获取商品id和用户id
        let goodsId=sessionStorage.getItem('goods_id');
        // console.log(goodsId);
        let userId=localStorage.getItem('user_id');
        this.addCart(goodsId,userId);
    }
    //添加到购物车
    addCart(goodsId,userId){
        console.log(goodsId,userId);
    }

    //获取节点
    $(tag) {
        let res = document.querySelectorAll(tag);
        return res.length == 1 ? res[0] : res;
    }
}
new Details;