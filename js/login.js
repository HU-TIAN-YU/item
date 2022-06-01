class Login {
    constructor() {
        //给登录按钮绑定点击事件
        this.$('.log').addEventListener('click', this.goLogin.bind(this));
        //得到回调地址
        let search = location.search;
        // console.log(search);
        //以=为分隔符分割
        if (search) {
            this.url = search.split('=')[1];
        }
        this.bindTwo();

        //window的滚轮滑动事件
        window.addEventListener('scroll', this.navTop.bind(this));
    }
    //登录按钮
    goLogin() {
        // console.log(this.$('.log'));
        //获取input框中的内容
        let inputs = document.forms[2].elements;
        // console.log(inputs);
        //获取输入的内容
        let username = inputs.inputUsername.value.trim();
        let password = inputs.inputPassword.value.trim();
        // console.log(username, password);
        //非空验证
        if (!username || !password) throw new Error('账号或密码不能为空');

        //发送登录请求
        //将参数编码
        let param = `username=${username}&password=${password}`;
        axios.post('http://localhost:8888/users/login', param, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(res => {
            // console.log(res);
            //token为是否登录的标识
            //判断登录请求是否成功，如果成功保存id和token
            if (res.status == 200 && res.data.code == 1) {
                //保存到localStorage
                localStorage.setItem('user_id', res.data.user.id);
                localStorage.setItem('token', res.data.token);
                // sessionStorage.setItem('user_name', username)
                localStorage.setItem('username', username);
                //保存之后如果有回调的地址 则跳转回去
                if (this.url) {
                    // console.log(this.url);
                    location.assign(this.url)
                } else {
                    location.assign('./index.html');
                }
            } else {
                throw new Error('用户名或密码错误');
            }
            inputs.inputUsername.value = '';
            inputs.inputPassword.value = '';
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
new Login;