class Index {
    constructor() {
        this.bindEve();
        this.nextPic();
        this.autoPlay();
        this.bindTwo();
        // this.timeLast();
    }
    //事件绑定
    bindEve() {
        //绑定回到顶部
        window.addEventListener('load', this.loadTop.bind(this));
        //下一张图
        this.$('.swiper-button-next')[0].addEventListener('click', this.nextImg.bind(this));
        //上一张图
        this.$('.swiper-button-prev')[0].addEventListener('click', this.prevImg.bind(this));
        //移入 移出
        this.$('#swiper').addEventListener('mouseover', this.mouseOver.bind(this));
        this.$('#swiper').addEventListener('mouseout', this.mouseOut.bind(this));

        //window的滚轮滑动事件
        window.addEventListener('scroll', this.navTop.bind(this));

        //退出登录
        this.$('.outLogin').addEventListener('click', this.outLogin.bind(this));

    }

    //倒计时
    
    //导航栏吸顶
    navTop() {
        // console.log(document.documentElement.scrollTop);
        // console.log(this.$('nav'));
        let top = document.documentElement.scrollTop;
        if (top >= 180) {
            this.$('nav').style.position = 'fixed';
            this.$('nav').style.top = 0;
            this.$('#swiper').style.marginTop = 63 + 'px';
        } else {
            this.$('nav').style.position = 'relative';
            this.$('#swiper').style.marginTop = -63 + 'px';
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
            // let username = sessionStorage.getItem('user_name');
            let username = localStorage.getItem('username');
            // console.log(username);
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
                            // sessionStorage.removeItem('user_name');
                            localStorage.removeItem('username');
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
new Index;