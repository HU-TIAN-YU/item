class List {
    constructor() {
        this.getData();
        this.bindEve();
        //默认页码
        this.currentPage = 1;
        //使用锁
        this.lock = false;

        this.nextPic();
        this.autoPlay();
        this.bindTwo();
    }
    /********绑定点击事件*********/
    bindEve() {
        // console.log(this.$('.perfume'));
        //给立即抢购绑定点击事件 委托给外面的div
        this.$('.perfume').addEventListener('click', this.goBuy.bind(this));
        //绑定懒加载
        window.addEventListener('scroll', this.lazyLoader.bind(this));

        //绑定回到顶部
        window.addEventListener('load', this.loadTop.bind(this));
        //下一张图
        this.$('.swiper-button-next').addEventListener('click', this.nextImg.bind(this));
        //上一张图
        this.$('.swiper-button-prev').addEventListener('click', this.prevImg.bind(this));
        //移入 移出
        this.$('#swiper').addEventListener('mouseover', this.mouseOver.bind(this));
        this.$('#swiper').addEventListener('mouseout', this.mouseOut.bind(this));
        //window的滚轮滑动事件
        window.addEventListener('scroll', this.navTop.bind(this));

        //退出登录
        this.$('.outLogin').addEventListener('click', this.outLogin.bind(this));
    }
    /*********获取数据的方法********/
    async getData(page = 1) {
        // console.log(1111);
        //发送ajax请求
        let { data, status } = await axios.get('http://localhost:8888/goods/list' + '?' + 'current=' + page);
        // console.log(res);
        // console.log(data, status);
        let html = '';
        //判断是否请求成功
        if (status == 200 && data.code == 1) {
            // console.log(data);
            //循环渲染数据
            data.list.forEach(goods => {
                // console.log(goods);
                //拼接字符串
                html += `<div class='buy' listId=${goods.goods_id}> 
            <img src="${goods.img}" alt="">
            <p class="perfumeEn">${goods.title}</p>
            <p class="perfumeCn">${goods.titleCn}</p>
            <p class="perfumePrice">￥${goods.price}</p>
            <a href="#none" class="button">立即购买</a>
        </div>`;
            });

        } else {
            throw new Error('获取数据失败');
        }
        //追加到页面中去
        this.$('.perfume').innerHTML += html;
    }
    //立即抢购点击事件
    goBuy(eve) {
        // console.log(eve.target.className);
        //判断是否点击的是a标签
        if (eve.target.nodeName != 'A' || eve.target.className != 'button') throw new Error('点击的不是a标签');
        //获取此商品的id
        let listId = eve.target.parentNode.getAttribute('listId');
        // console.log(listId);
        //将商品id存到sessionStorage
        sessionStorage.setItem('goods_id', listId);

        //如果是a标签则跳转到详情页面
        location.assign('./details.html');
    }
    //懒加载
    // 当前所有需要高度===滚动条距顶部的高度 + 可视区的高度
    // 需要获取新数据时候    当前实际的内容高度<滚动条距离顶部的高度 + 可视区的高度
    lazyLoader() {
        //获取滚动条距离顶部的高度
        let top = document.documentElement.scrollTop;
        // console.log(top);
        //获取可视区的高度,固定不变的
        let cliH = document.documentElement.clientHeight;
        // console.log(cliH);
        //获取实际内容
        let offH = this.$('main').offsetHeight + this.$('header').offsetHeight + this.$('nav').offsetHeight + this.$('.swiper-container').offsetHeight;
        // console.log(offH);
        //当内容高度<top+cliH时候，需要加载数据
        if ((offH + 200) < top + cliH) {
            //满足条件 加载数据 使用节流和防抖

            //如果是锁着的就结束代码执行
            if (this.lock) return;
            this.lock = true;
            //指定时间开锁时间 才能进行下次数据清除
            setTimeout(() => {
                this.lock = false;
            }, 1000)
            this.getData(++this.currentPage);
        }
    }
    //轮播图
    nextPic() {
        // console.log(this);
        //获取需要的节点
        this.bigImg = this.$('.swiper-wrapper-one div');
        this.page = this.$('.swiper-pagination-clickable span');
        // console.log(this.bigImg, this.next, this.prev, this.page, this.box);
        //保存需要用到的下标
        //即将隐藏的图片下标
        this.nextIndex = 0;
        //即将显示的图片下标
        this.index = 0;
        //循环遍历每一个页数 绑定点击事件
        Array.from(this.page).forEach((span, key) => {
            // console.log(span, key);
            // key为下标
            //给每一个span绑定点击事件
            span.onclick = () => {
                //先把要隐藏的下标设置给index 要显示的下标为key
                this.nextIndex = this.index;
                this.index = key;
                //调用显示的方法
                this.changeImg();
            }
        });
    }
    //下一张按钮
    nextImg() {
        // console.log(111);
        //修改下标
        this.nextIndex = this.index;
        this.index++;
        //判断到最大值时候
        if (this.index > this.bigImg.length - 1) {
            this.index = 0;
        }
        this.changeImg();
    }
    //上一张按钮
    prevImg() {
        //修改下标
        this.nextIndex = this.index;
        this.index--;
        //判断到最小值时候
        if (this.index < 0) {
            this.index = this.bigImg.length - 1;
        }
        this.changeImg();
    }
    //设置轮播图自动播放
    autoPlay() {
        this.timer = setInterval(() => {
            this.nextImg();
        }, 2000)
    }
    //当鼠标移入时候停止自动播放
    mouseOver() {
        clearInterval(this.timer);
    }
    //鼠标移出继续自动播放
    mouseOut() {
        this.autoPlay();
    }
    //轮播图显示和隐藏图片
    changeImg() {
        this.page[this.nextIndex].classList.remove('swiper-pagination-bullet-active');
        this.bigImg[this.nextIndex].classList.remove('swiper-slide-active');
        this.page[this.index].classList.add('swiper-pagination-bullet-active');
        this.bigImg[this.index].classList.add('swiper-slide-active');
    }
    //回到顶部
    loadTop() {
        //获取回到顶部按钮
        let top = this.$('.goTop');
        // console.log(top);
        //获取可视区域的高度
        let clientH = document.documentElement.clientHeight;
        // console.log(clientH);
        //定义一个定时器
        let timer = '';
        //定义一个布尔值，用于判断是否到达顶部
        let isTop = true;
        //滚动条滚动事件
        window.onscroll = () => {
            //获取滚动条的滚动高度
            let top = document.documentElement.scrollTop;
            // console.log(top);
            //当top值大于可视高度时候，显示出来
            if (top >= clientH) {
                this.$('aside').style.display = 'block';
            } else {
                this.$('aside').style.display = 'none';
            }
            //用于判断,当点击回到顶部按钮后 滚动条在回滚过程中,如果是手动滚动滚动条,则清除定时器
            if (!isTop) {
                clearInterval(timer);
            }
            isTop = false;

        }
        //回到顶部按钮点击事件
        top.onclick = () => {
            //设置一个定时器
            timer = setInterval(() => {
                //获取滚动条的滚动高度
                let top = document.documentElement.scrollTop;
                //用于设置速度差，产生缓动的效果
                let speed = Math.floor(-top / 6);
                document.documentElement.scrollTop = document.body.scrollTop = top + speed;
                //用于阻止滚动事件清除定时器
                isTop = true;
                if (top == 0) {
                    clearInterval(timer);
                }
            }, 30);
        }

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
        this.$('.btn1')[0].addEventListener('mouseover', this.mouseOver1.bind(this));
        this.$('.btn1')[0].addEventListener('mouseout', this.mouseOut1.bind(this));
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
    //获取节点的封装方法
    $(tag) {
        let res = document.querySelectorAll(tag);
        return res.length == 1 ? res[0] : res;
    }
}
new List;
