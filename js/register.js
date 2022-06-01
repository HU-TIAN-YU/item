class Register {
    constructor() {
        this.bindTwo();

        //window的滚轮滑动事件
        window.addEventListener('scroll', this.navTop.bind(this));

        //绑定点击注册事件
        this.$('.ok').addEventListener('click', this.confirmReg.bind(this));

        this.bindTwo();
        //得到回调地址
        let search = location.search;
        // console.log(search);
        //以=为分隔符分割
        if (search) {
            this.url = search.split('=')[1];
        }
        console.log(this.url);
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
        // if (!userId || !password || !username || !confirmPw) {
        //     layer.open({
        //         title: '必填项不能为空',
        //         content: '请重新填写'
        //     })
        // }
        //验证正则表达式
        // let reg = [/^\w{4,10}$/, /^[\w\-]{8,18}$/, /^[\u4E00-\u9FA5\w]{3,8}$/];
        // console.log(reg[0]);
        // console.log(reg[0].test(userId));
        //验证用户名
        // if (reg[0].test(userId)) {
        //     this.$('#inputUsername+span').style.display = 'none';
        // } else {
        //     this.$('#inputUsername+span').style.display = 'block';
        // }
        // //验证密码
        // if (reg[1].test(password)) {
        //     this.$('#inputPassword+span').style.display = 'none';
        // } else {
        //     this.$('#inputPassword+span').style.display = 'block';
        // }
        // //验证姓名
        // if (reg[2].test(username)) {
        //     this.$('.nameTag').style.display = 'none';
        // } else {
        //     this.$('.nameTag').style.display = 'block';
        // }
        // //验证确认密码
        // if (password == confirmPw) {
        //     this.$('.pwTwo').style.display = 'none';
        // } else {
        //     this.$('.pwTwo').style.display = 'block';
        // }

        //拼接参数
        let param = `username=${userId}&password=${password}&rpassword=${confirmPw}&nickname=${username}`;
        //发送注册请求
        axios.post('http://localhost:8888/users/register', param, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(({ data, status }) => {
            // console.log(data, status);
            // console.log(res);
            //判断是否注册成功
            if (status == 200 && data.code == 1) {
                // console.log('注册成功');
                if (this.url) {
                    location.assign(this.url);
                } else {
                    location.assign('./login.html')
                }
            } else {
                layer.open({
                    title: '错误',
                    content: '不能为空或格式错误或密码不一致或用户已存在,请重新输入'
                })
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
new Register;