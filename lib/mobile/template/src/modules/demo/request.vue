<template>
    <div class="skin">
        <div class="demo-title"><span @click="$router.replace('/')"><</span>ajax请求</div>
        <div class="demo-btn">
            <div>
                <img src="/captcha?v=1527643456560"/>
                <div class="test-input">
                    <input v-model="formData.mobile" type="tel" placeholder="请输入电话号码"/>
                </div>
                <div class="test-input">
                    <input v-model="formData.captcha" placeholder="请输入验证码"/>
                </div>
                <div class="block">
                    {{formData}}
                    <p>
                        result:  {{data}}
                    </p>
                </div>
            </div>
            <button class="demo-button" @click.prevent="submitForm">Black</button>
        </div>
    </div>
</template>
<script type="text/babel">
    import qs from 'qs'

    export default {
        data() {
            return {
                formData: {
                    mobile: null,
                    captcha: null,
                },
                data: '',
            }
        },
        methods: {
            /**
             * 获取数据
             *
             *
             * 文件获取规则
             * 例如：
             * json文件的开发路径为： src/modules/demo/request/json/list.json
             * ajax调用的路径则是：src/modules/demo/request/json/list.json
             */
            submitForm() {
                if (!this.formData.mobile) {
                    alert('请输入手机号码')
                    return
                }
                if (!this.formData.captcha) {
                    alert('请输入验证码')
                    return
                }
                this.SWXHR.POST('/api/adpwreset/sendMessageToMobile', qs.stringify(this.formData))
                    .then(res => {
                        this.data = res
                    })
            }
        }
    }
</script>

<style lang="less" scoped>
    .test-input {
        padding: 10px 0;
        input {
            -webkit-appearance: none;
            background-color: #fff;
            background-image: none;
            border-radius: 4PX;
            border: 1PX solid #dcdfe6;
            box-sizing: border-box;
            color: #606266;
            display: inline-block;
            font-size: inherit;
            height: 40PX;
            line-height: 40PX;
            outline: none;
            padding: 0 15PX;
            transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
            width: 100%;
        }
    }
</style>
