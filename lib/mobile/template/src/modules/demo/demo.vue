<template>
    <div class="home">
        <div class="demo-title">demo</div>
        <div class="demo-btn">
            <button class="demo-button" @click="$router.push('/theme')">{{$t('message.skin')}}</button>
            <button class="demo-button" @click="$router.push('/request')">{{$t('message.request')}}</button>
            <button class="demo-button" @click="setLang">{{$t('message.switchLang')}}</button>
            <div>
                {{$t('o')}}
            </div>
        </div>
    </div>
</template>
<script type="text/babel">
    export default {
        data() {
            return {}
        },
        methods: {
            /**
             * 设置语言
             */
            setLang() {
                this.$i18nLanguage(this.$i18n.locale === 'zh' ? 'en' : 'zh')
            },
        }
    }
</script>
