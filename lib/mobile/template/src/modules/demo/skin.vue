<template>
    <div class="skin">
        <div class="demo-title"><span @click="$router.replace('/')"><</span>theme</div>
        <div class="theme-buttons">
            <div class="col-33">
                <button class="demo-button color-red" @click="skinTheme('red')">Red</button>
            </div>
            <div class="col-33">
                <button class="demo-button color-green" @click="skinTheme('green')">Green</button>
            </div>
            <div class="col-33">
                <button class="demo-button color-blue" @click="skinTheme('blue')">Blue</button>
            </div>
            <div class="col-33">
                <button class="demo-button color-pink" @click="skinTheme('pink')">Pink</button>
            </div>
            <div class="col-33">
                <button class="demo-button color-yellow" @click="skinTheme('yellow')">Yellow</button>
            </div>
            <div class="col-33">
                <button class="demo-button color-orange" @click="skinTheme('orange')">Orange</button>
            </div>
            <div class="col-33">
                <button class="demo-button color-gray" @click="skinTheme('gray')">Gray</button>
            </div>
            <div class="col-33">
                <button class="demo-button color-black" @click="skinTheme('black')">Black</button>
            </div>
        </div>
    </div>
</template>
<script type="text/babel">
    export default {
        methods: {
            /**
             * 切换皮肤
             * @param {String} name 肤色名称
             */
            skinTheme(name) {
                this.$cutTheme(name)
            }
        }
    }
</script>
