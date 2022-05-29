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
                //保存之后如果有回调的地址 则跳转回去
                if (this.url) {
                    // console.log(this.url);
                    location.assign(this.url)
                }
            }
        })
    }

    //获取节点
    $(tag) {
        let res = document.querySelectorAll(tag);
        return res.length == 1 ? res[0] : res;
    }
}
new Login;