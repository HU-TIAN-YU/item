class List {
    constructor() {
        this.getData();
        this.bindEve();
        //默认页码
        this.currentPage = 1;
        //使用锁
        this.lock = false;
    }
    /********绑定点击事件*********/
    bindEve() {
        // console.log(this.$('.perfume'));
        //给立即抢购绑定点击事件 委托给外面的div
        this.$('.perfume').addEventListener('click', this.goBuy.bind(this));
        //绑定懒加载
        window.addEventListener('scroll', this.lazyLoader.bind(this));
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

    //获取节点的封装方法
    $(tag) {
        let res = document.querySelectorAll(tag);
        return res.length == 1 ? res[0] : res;
    }
}
new List;