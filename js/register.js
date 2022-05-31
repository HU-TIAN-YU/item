class Register {
    constructor() {
        this.bindTwo();

        //window的滚轮滑动事件
        window.addEventListener('scroll', this.navTop.bind(this));

        //绑定点击注册事件
        this.$('.ok').addEventListener('click', this.confirmReg.bind(this));
    }
    confirmReg() {
        // console.log('确认注册');
        //获取输入框中的内容
        let inputs = document.forms[1].elements;
        // console.log(inputs);
        let userId = inputs[2].value.trim();
        let password = inputs[3].value.trim();
        let username = inputs[4].value.trim();
        let confirmPw = inputs[5].value.trim();
        // console.log(userId,password,username,confirmPw);
        //非空验证
        if (!userId || !password || !username || !confirmPw) {
            alert('输入不能为空');
        } else {
            if (password == confirmPw) {
                console.log('密码一致');
            } else {
                alert('密码不一致,重新输')
            }
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
new Register;