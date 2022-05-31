class Cart {
    constructor() {
        this.getCart();
        this.bindEve();
    }
    //绑定事件
    bindEve() {
        //删除按钮点击事件 委托给#plist
        this.$('#plist').addEventListener('click', this.dispatch.bind(this));
        //给全选按钮绑定点击事件
        this.$('.all-ipt').addEventListener('click', this.checkAll.bind(this));
    }
    //事件委托分发
    dispatch(eve) {
        // console.log(this);
        // console.log(eve.target.nodeName);
        //事件源的获取
        let target = eve.target;
        //判断点击的是否是删除按钮
        if (target.nodeName == 'BUTTON' && target.classList.contains('del-btn')) this.delData(target);
        //判断点击的是否是 + 按钮
        if (target.nodeName == 'BUTTON' && target.classList.contains('add')) this.addNum(target);
        //判断点击的是否是 - 按钮
        if(target.nodeName=='BUTTON'&&target.classList.contains('minus')) this.minusNum(target);
    }
    // 按钮(+)加加数量 的实现
    addNum(target) {
        // console.log(target);
        // console.log(this);
        //获取当前商品的tr
        let tr = target.parentNode.parentNode.parentNode;
        // console.log(tr);
        //获取该商品数量，单价，总价
        let num = tr.querySelector('.num input');
        let sum = tr.querySelector('.g_sum span');
        let price = tr.querySelector('.g-price').innerHTML - 0;
        // console.log(num, sum, price);
        //获取数量
        let numVal = num.value;
        //对数量加1 
        numVal++;
        // console.log(numVal);
        //发送修改购买数量请求
        const AUTH_TOKEN = localStorage.getItem('token')
        axios.defaults.headers.common['authorization'] = AUTH_TOKEN;
        axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        //参数 用户id 商品id 要修改的数量
        let u_id = localStorage.getItem('user_id');
        let g_id = tr.dataset.id;
        let param = `id=${u_id}&goodsId=${g_id}&number=${numVal}`;
        // console.log(param);
        //发送请求
        axios.post('http://localhost:8888/cart/number', param).then(({ data, status }) => {
            // console.log(res);
            // console.log(data,status);
            //判断是否修改成功
            if (status == 200 && data.code == 1) {
                // console.log('success');
                //将更新之后的数量设置回去
                num.value = numVal;
                sum.innerHTML = numVal * price;
                //调用统计数量总价的方法
                this.countSum();
            }
        })
    }
    // 按钮(-)减减数量 的实现
    minusNum(target) {
        // console.log(target);
        // console.log(this);
        //获取当前商品的tr
        let tr = target.parentNode.parentNode.parentNode;
        // console.log(tr);
        //获取该商品数量，单价，总价
        let num = tr.querySelector('.num input');
        let sum = tr.querySelector('.g_sum span');
        let price = tr.querySelector('.g-price').innerHTML - 0;
        // console.log(num, sum, price);
        //获取数量
        let numVal = num.value;
        //对数量减1 
        numVal--;
        // console.log(numVal);
        //发送修改购买数量请求
        const AUTH_TOKEN = localStorage.getItem('token')
        axios.defaults.headers.common['authorization'] = AUTH_TOKEN;
        axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        //参数 用户id 商品id 要修改的数量
        let u_id = localStorage.getItem('user_id');
        let g_id = tr.dataset.id;
        let param = `id=${u_id}&goodsId=${g_id}&number=${numVal}`;
        // console.log(param);
        //发送请求
        axios.post('http://localhost:8888/cart/number', param).then(({ data, status }) => {
            // console.log(res);
            // console.log(data,status);
            //判断是否修改成功
            if (status == 200 && data.code == 1) {
                // console.log('success');
                //将更新之后的数量设置回去
                num.value = numVal;
                sum.innerHTML = numVal * price;
                //调用统计数量总价的方法
                this.countSum();
            }
        })
    }

    //全选按钮
    checkAll(eve) {
        // console.log(eve.target);
        //获取全选按钮的选中状态
        let allStatus = eve.target.checked;
        // console.log(allStatus);
        //当点击全选的时候，让单个商品的选中框状态跟全选一样
        //获取单个选中框
        // console.log(this.$('.check'));
        this.$('.check').forEach(res => {
            // console.log(res.checked);
            //跟随全选状态
            res.checked = allStatus;
        })

        //调用统计数量和价格的方法
        this.countSum();
    }
    //单选的实现
    oneCheck() {
        // console.log(this.$('.check'));
        //给每一个单选按钮绑定点击事件
        this.$('.check').forEach(input => {
            // console.log(input);
            //保存this指向
            let self = this;
            input.onclick = function () {
                //获取当前的点击状态
                // console.log(this.checked);
                //判断当前商品单选的状态为false 取消全选的选中状态，改为false
                if (!this.checked) {
                    self.$('.all-ipt').checked = false;
                }
                //当点击选中的时候，判断其他单选框是否选中，全部选中的话就把全选按钮状态改为true
                if (this.checked) {
                    //调用获取单个商品的状态
                    //接收返回值
                    let status = self.getOneStatus();
                    //修改全选框的状态
                    self.$('.all-ipt').checked = status;
                }
                //统计总价和数量
                self.countSum();
            }
        })
    }
    //获取单个商品的选中状态
    getOneStatus() {
        // console.log(this.$('.check'));
        //寻找是否有没选中的单选框，如果没有，都选中的话 res会返回为空数组
        let res = Array.from(this.$('.check')).find(input => {
            // console.log(input.checked);
            return !input.checked;
        })
        // console.log(res);
        //如果res有值 表示有未选中的单选框
        // 如果页面中单选框都选中，则返回true
        return !res;
    }
    //统计购物车的总数量和总价
    countSum() {
        // console.log(this);
        //总价和数量
        let sum = 0;
        let num = 0;
        //优惠和运费
        let yh = 0;
        let yf = 0;
        //循环遍历单选框，统计选中的商品的价格和数量
        this.$('.check').forEach(res => {
            // console.log(res);
            if (res.checked) {
                //找到tr 获取商品价格和数量
                let tr = res.parentNode.parentNode;
                // console.log(tr);
                //获取当前选中的商品的价格和数量
                let g_sum = tr.querySelector('.g_sum span').innerHTML - 0;
                let g_num = tr.querySelector('.num input').value - 0;
                // console.log(g_sum, g_num);
                sum += g_sum;
                num += g_num;

                yh += (tr.querySelector('.num input').value - 0) * 2;
                yf += (tr.querySelector('.num input').value - 0) * 1;
            }
        });

        //将价格和数量渲染到页面中去
        // console.log(this.$('.d-num'));
        this.$('.d-num').innerHTML = num;
        this.$('.d-price').innerHTML = sum;
        this.$('.yh').innerHTML = yh;
        this.$('.yf').innerHTML = yf;
        this.$('.zong').innerHTML = sum - yh + yf;
    }
    //删除数据 
    delData(target) {
        // console.log(target);
        //弹出框 确认是否删除
        layer.confirm('是否删除该商品', {
            title: '删除'
        }, function () {  //确认删除之后的回调函数
            // console.log('确认删除');
            //获取商品id
            let tr = target.parentNode.parentNode;
            // console.log(tr);
            let g_id = tr.dataset.id;
            // console.log(g_id);
            //获取用户id
            let u_id = localStorage.getItem('user_id');
            // console.log(u_id);

            // 必须携待token,后台需要验证是否登录
            const AUTH_TOKEN = localStorage.getItem('token')
            axios.defaults.headers.common['authorization'] = AUTH_TOKEN;
            //发送请求 请求删除数据
            axios.get('http://localhost:8888/cart/remove', {
                params: {
                    id: u_id,
                    goodsId: g_id
                }
            }).then(res => {
                // console.log(res);
                //无刷新删除  关闭弹出框 删除对应的tr
                layer.closeAll();
                tr.remove();
            })
        })
    }
    //获取商品信息 显示购物车
    async getCart() {
        // console.log(111);
        //需要携带token参数验证是否登录
        const AUTH_TOKEN = localStorage.getItem('token');
        // console.log(AUTH_TOKEN);
        axios.defaults.headers.common['authorization'] = AUTH_TOKEN;
        //发送请求
        let { data, status } = await axios.get('http://localhost:8888/cart/list', {
            params: {
                id: localStorage.getItem('user_id')
            }
        })
        // console.log(res);
        // console.log(data, status);
        let html = '';
        //判断是否请求成功
        if (status == 200 && data.code == 1) {
            // console.log(data.cart);
            //拼接字符串 显示到页面中
            data.cart.forEach(goods => {
                // console.log(goods);
                html += `<tr data-id=${goods.goods_id}>
                <td><input class="check" type="checkbox"></td>
                <td><img src="${goods.img}" alt=""></td>
                <td>${goods.titleCn}</td>
                <td class='g-price'>${goods.price}</td>
                <td>
                    <div class="num">
                        <button class="minus">-</button>
                        <input type="text" value="${goods.cart_number}" id="amount">
                        <button class="add">+</button>
                    </div>
                </td>
                <td class='g_sum'><span>${goods.price * goods.cart_number}</span><button type="button"
                class="btn btn-danger del-btn">删除</button></td>
            </tr>`
            })
            //追加到页面
            this.$('#plist').innerHTML += html;
            //异步追加，单选按钮事件需要绑定在这里
            this.oneCheck();
        } else {
            //登录过期跳转
            //清除localStorage中的token个userId
            localStorage.removeItem('token');
            localStorage.removeItem('user_id');
            //跳转到登录页面  回跳当前页面
            location.assign('./login.html?ReturnUrl=./cart.html');
        }

    }
    //获取节点
    $(tag) {
        let res = document.querySelectorAll(tag);
        return res.length == 1 ? res[0] : res;
    }
}
new Cart;