class Index {
    constructor() {
        this.bindEve();
    }
    //事件绑定
    bindEve() {
        //绑定回到顶部
        window.addEventListener('load', this.loadTop.bind(this));
        //滚动条滚动事件
        // window.addEventListener('scroll', this.showTop.bind(this));
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
            //当top值大于850时候，显示出来
            if (top >= clientH) {
                this.$('aside').style.display = 'block';
            } else {
                this.$('aside').style.display = 'none';
            }
            //用于判断当 点击回到顶部按钮后 滚动条在回滚过程中 如果是手动滚动滚动条，则清除定时器
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
                var speed = Math.floor(-top / 6);
                document.documentElement.scrollTop = top + speed;
                isTop = true;  //用于阻止滚动事件清除定时器
                if (top == 0) {
                    clearInterval(timer);
                }
            }, 30);
        }
    }
    //当页面滚动条滑到一定位置显示
    // showTop() {
    //     let clientH = document.documentElement.clientHeight;
    //     let top = document.documentElement.scrollTop;
    //     // console.log(top);
    //     //当top值大于850时候，显示出来
    //     if (top >= clientH) {
    //         this.$('aside').style.display = 'block';
    //     } else {
    //         this.$('aside').style.display = 'none';
    //     }
    // }
    //获取节点
    $(tag) {
        let res = document.querySelectorAll(tag);
        return res.length == 1 ? res[0] : res;
    }
}
new Index;