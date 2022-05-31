class Details {
    constructor() {
        this.getInfo();
        this.bindEve();
        this.bigPic();
        this.bindTwo();
    }
    //绑定事件
    bindEve() {
        //给加入购物车添加点击事件
        // console.log(this.$('.join'));
        this.$('.join').addEventListener('click', this.checkLogin.bind(this));
        //window的滚轮滑动事件
        window.addEventListener('scroll', this.navTop.bind(this));

        //显示用户名 判断是否登录
        window.addEventListener('load', this.isLogin.bind(this));

        //退出登录
        this.$('.outLogin').addEventListener('click', this.outLogin.bind(this));
    }
    isLogin() {
        //判断是否登录 如果已登录就显示用户信息在页面右上角
        let token = localStorage.getItem('token');
        // console.log(token);
        if (token) {
            // console.log('已经登录');
            //获取登录的用户名
            let username = sessionStorage.getItem('user_name');
            // console.log(username);
            //把用户名显示到右上角 
            this.$('.login').innerHTML = username;
            this.$('.liTwo').onmouseover = () => {
                this.$('.outLogin').style.display = 'block';
            }
            this.$('.liTwo').onmouseout = () => {
                this.$('.outLogin').style.display = 'none';
            }
        }
    }
    //退出登录
    outLogin() {
        // console.log('退出');
        // console.log(this);
        let self = this;
        //检测是否登录
        let token = localStorage.getItem('token');
        if (token) {
            let uId = localStorage.getItem('user_id');
            // console.log(uId);
            //发送退出请求
            axios.get('http://localhost:8888/users/logout?id=' + uId).then(({ data, status }) => {
                // console.log(res);
                if (status == 200 && data.code == 1) {
                    layer.open({
                        title: '退出',
                        content: '确定退出登录吗',
                        btn: ['确定', '取消'],
                        yes: function (index, layero) {
                            console.log(self);
                            //清除localStorage中的token个userId
                            localStorage.removeItem('token');
                            localStorage.removeItem('user_id');
                            sessionStorage.removeItem('user_name');
                            //换成登录选项
                            self.$('.login a').innerHTML = `<a href="./login.html?ReturnUrl=./index.html" style="color: black;">登录与注册</a>`;
                            //删除退出文本
                            self.$('.outLogin').remove();
                            //刷新页面
                            location.reload();
                        }
                    })

                }
            })
        }
    }
    //放大镜
    bigPic() {
        //获取节点
        this.magnifying = this.$('.magnifying');
        this.magnifyingBig_Img = this.$('.magnifyingBig-img');
        this.mask = this.$('.mask');
        this.bigImg = this.$('.bigImg');
        this.big_Image = this.$('.big_Image');
        // console.log(magnifying,big_Img,mask,bigImg,big_Image);
        //绑定移入移出移动事件
        this.magnifyingBig_Img.addEventListener('mouseenter', this.mouseEnter.bind(this));
        this.magnifyingBig_Img.addEventListener('mouseleave', this.mouseLeave.bind(this));
        this.magnifyingBig_Img.addEventListener('mousemove', this.mouseMove.bind(this));
    }
    //鼠标移入事件
    mouseEnter() {
        this.mask.style.display = 'block';
        this.bigImg.style.display = 'block';
    }
    //鼠标移出事件
    mouseLeave() {
        this.mask.style.display = 'none';
        this.bigImg.style.display = 'none';
    }
    //鼠标移动事件
    mouseMove(eve) {
        //获取鼠标相对于文档的坐标
        let px = eve.pageX;
        let py = eve.pageY;
        // console.log(px, py);
        //获取图片外面盒子相对坐标
        let mL = this.magnifying.offsetLeft;
        let mT = this.magnifying.offsetTop;
        // console.log(mL, mT);
        //获取mask相对于盒子的位置
        let x = px - mL - 160 - this.mask.offsetWidth / 2;
        let y = py - mT - this.mask.offsetHeight / 2;
        // console.log(x, y);
        //求出mask的最大边界
        let xMax = this.bigImg.offsetWidth - this.mask.offsetWidth;
        let yMax = this.bigImg.offsetHeight - this.mask.offsetHeight;
        // console.log(xMax, yMax);
        //判断是否到达边界值
        if (x < 0) x = 0;
        if (y < 0) y = 0;
        if (x > xMax) x = xMax;
        if (y > yMax) y = yMax;

        //设置给mask的top和left
        this.mask.style.left = x + 'px';
        this.mask.style.top = y + 'px';

        //获取大图的最大边界值
        let imgMaxLeft = this.bigImg.offsetWidth - this.big_Image.offsetWidth;
        let imgMaxTop = this.bigImg.offsetHeight - this.big_Image.offsetHeight;
        // console.log(imgMaxLeft, imgMaxTop);
        //mask实时位置/mask最大移动位置=大图实时位置/大图最大移动位置
        //求出大图的实时位置
        let imgBigX = x / xMax * imgMaxLeft;
        let imgBigY = y / yMax * imgMaxTop;
        //设置给大图
        this.big_Image.style.left = imgBigX + 'px';
        this.big_Image.style.top = imgBigY + 'px';

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
        this.$('.big_Image').src = data.info.img;
        this.$('.introduce h2').innerHTML = data.info.title;
        this.$('.introduce h1').innerHTML = data.info.titleCn;
        this.$('.unit-price').innerHTML = data.info.price;
    }
    /*********加入购物车***********/
    //1、判断是否已经登录
    checkLogin() {
        // console.log(this);
        //判断用户是否登录，如果localStroage中有token表示登录
        let token = localStorage.getItem('token');
        // console.log(token);
        //如果没有token表示没有登录 此时跳到登录页面
        //ReturnUrl为回调页面 即登录成功跳转回此页面
        if (!token) location.assign('./login.html?ReturnUrl=./details.html');

        //如果用户已经登录成功，此时需要讲商品加入到购物车
        //先获取商品id和用户id
        let goodsId = sessionStorage.getItem('goods_id');
        // console.log(goodsId);
        let userId = localStorage.getItem('user_id');
        this.addCart(goodsId, userId);
    }
    //2、将商品添加到购物车
    addCart(goodsId, userId) {
        // console.log(goodsId,userId);
        //发送请求 添加购物车 后台需要验证是否为登录状态，即token值是否存在
        const AUTH_TOKEN = localStorage.getItem('token');
        // console.log(AUTH_TOKEN);
        axios.defaults.headers.common['authorization'] = AUTH_TOKEN;
        axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        //拼接参数
        let param = `id=${userId}&goodsId=${goodsId}`;
        axios.post('http://localhost:8888/cart/add', param).then(({ data, status }) => {
            // console.log(res);
            // console.log(data,status);
            //判断是否请求成功
            if (status == 200 && data.code == 1) {
                layer.open({
                    title: '商品添加成功',
                    content: '前去购物车',
                    btn: ['确定', '取消'],
                    yes: function (index, layero) {
                        // console.log('去购物车');
                        location.assign('./cart.html')
                    }
                })
            } else {
                //登录过期或没有登录
                //清除localStorage中的token个userId
                localStorage.removeItem('token');
                localStorage.removeItem('user_id');
                sessionStorage.removeItem('user_name');
                //跳转到登录页面  回跳当前页面
                location.assign('./login.html?ReturnUrl=./details.html');
            }
        })
    }
    //导航栏吸顶
    navTop() {
        // console.log(document.documentElement.scrollTop);
        // console.log(this.$('nav'));
        let top = document.documentElement.scrollTop;
        if (top >= 180) {
            this.$('nav').style.position = 'fixed';
            this.$('nav').style.top = 0;
        } else {
            this.$('nav').style.position = 'relative';
        }
    }
    //二级菜单绑定
    bindTwo() {
        //二级菜单的移入移出
        this.$('.btn1').addEventListener('mouseover', this.mouseOver1.bind(this));
        this.$('.btn1').addEventListener('mouseout', this.mouseOut1.bind(this));
        this.$('.btn2').addEventListener('mouseover', this.mouseOver2.bind(this));
        this.$('.btn2').addEventListener('mouseout', this.mouseOut2.bind(this));
        this.$('.btn3').addEventListener('mouseover', this.mouseOver3.bind(this));
        this.$('.btn3').addEventListener('mouseout', this.mouseOut3.bind(this));
    }
    //二级菜单显示
    mouseOver1() {
        // console.log(111);
        //显示出来
        this.$('.makeUpSubmenu1').style.display = 'block';
    }
    mouseOut1() {
        //隐藏
        this.$('.makeUpSubmenu1').style.display = 'none';
    }
    mouseOver2() {
        // console.log(111);
        //显示出来
        this.$('.makeUpSubmenu2').style.display = 'block';
    }
    mouseOut2() {
        //隐藏
        this.$('.makeUpSubmenu2').style.display = 'none';
    }
    mouseOver3() {
        // console.log(111);
        //显示出来
        this.$('.makeUpSubmenu3').style.display = 'block';
    }
    mouseOut3() {
        //隐藏
        this.$('.makeUpSubmenu3').style.display = 'none';
    }
    //获取节点
    $(tag) {
        let res = document.querySelectorAll(tag);
        return res.length == 1 ? res[0] : res;
    }
}
new Details;