<style scoped>
    .js-toast-container {
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        z-index: 2000;
        background: rgba(0, 0, 0, .3);
        -webkit-animation: fadein 0.7s ease alternate;
        -moz-animation: fadein 0.7s ease alternate;
        animation: fadein 0.7s ease alternate;
    }

    .com-toast {
        position: fixed;
        z-index: 100;
        top: 45%;
        width: 100%;
        text-align: center;
        font-size: 13px;
        font-family: sans-serif;
    }

    .com-toast .com-toast-text {
        display: inline-block;
        margin: -24px auto auto;
        padding: 9px 20px;
        min-width: 50px;
        -webkit-background-clip: padding-box;
        color: #fff;
        background-color: rgba(0,0,0,.8);
        border-radius: 5px;
    }
</style>

<template>
    <div class="js-toast-container" id="page-loader" v-if="isShow" >
        <div class="com-toast">
            <div class="com-toast-text">
                <img :src="getImage('load-vue.gif')" style="height: 50px;width: auto"/>
                <div style="margin-top: 5px">{{ toastText }}</div>
            </div>
        </div>
    </div>
</template>

<script>
    module.exports = {
        name:'loading',
        props: {
            isShow: Boolean,
            toastText: String,
        },
        methods: {
            show: function() {
                this.isShow = true;
            },
            hide: function() {
                this.isShow = false;
            },
            toggle: function() {
                this.isShow = !this.isShow;
            }
        },
        events: {
            'vue-loading-show': function() {
                this.show();
            },
            'vue-loading-hide': function() {
                this.hide();
            },
            'vue-loading-toggle': function() {
                this.toggle();
            }
        }
    };
</script>
