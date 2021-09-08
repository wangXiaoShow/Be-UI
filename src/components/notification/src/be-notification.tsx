/*
* @be-notification.vue
* @deprecated 公共的通知组件
* @author czh
* @update (czh 2021/6/7)
*/

import {computed, defineComponent, reactive, ref} from 'vue'
import '../../../assets/style/be-notification.scss';
const renderBody = function (h) {
    return (
        <div class={`be-notification-container be-notification-container__${this.option.placement}`}>
            <div class="be-notification-title">
                <div class="be-notification-head"
                     id={`be_notification_head${this._uid}`}>
                    <div>
                        {this.option.iconPreRender ? this.option.iconPreRender() :
                            <i class={`el-icon-${this.option.msgType} icon-${this.option.msgType}`}></i>}
                        <span class={`text-${this.option.msgType}`}>{this.option.titles}</span>
                    </div>
                    {/**@slot 弹窗头部按钮**/}
                    <div>
                        {this.option.closeRender ? this.option.closeRender() :
                            <i class="el-icon-close" onClick={(event) => this.close(event)}></i>}
                    </div>
                </div>
            </div>
            {/**@slot 弹窗主体**/}
            <div class='be-notification-body'>
                {this.option.bodyRender ? this.option.bodyRender() :
                    <p class="be-notification-description">
                        {this.option.description}
                    </p>
                }
            </div>
        </div>
    )
}
export default defineComponent({
    name: "BeNotification",
    setup(){
        let option = reactive({
            isShow:false,
            style: {},
            placementSelf:'',
            titles:'',//
            customClass:'',//
            msgType:'warning',//
            offsetTop:0,//
            offsetBottom:0,//
            placement:'topRight',//
            bodyRender:null,//
            iconPreRender:null,//
            closeRender:null,//
            description:'',//
            duration:4500,//
            key:'',//
            timer:null,//
        })
        let containerClass = ref('')

        const offsetTopStyle = computed(() => option.offsetTop)
        const offsetBottomStyle = computed(() => option.offsetBottom)
        const placementStyle = computed(() => option.placement)

        const close = (event:Event | null):void=>{
            event && event.stopPropagation()
            /** close事件
             * @event close
             */
            this.$selfEvent.onClose && this.$selfEvent.onClose(event)
            this.$closeNotify(this,false,true)
            if (this.$el && this.$el.parentNode) {
                this.$el.parentNode.removeChild(this.$el);
            }
            // 销毁组件
            this.$destroy()
        }
        const onClick = (event:Event | null):void=>{
            this.$selfEvent.onClick && this.$selfEvent.onClick(event)
        }
        const clearTimer = ()=>{
            clearTimeout(this.timer);
            this.timer = null
        }
        const startTimer = ()=>{
            if (option.duration > 0) {
                this.timer = setTimeout(() => {
                    close(null);
                }, option.duration);//sad
            }
        }
        const setAnimate = ()=>{
            let classStr = `be-notification be-notification__${option.msgType} be-notification__${option.placement} ${option.customClass}`
            containerClass.value = classStr
            if (option.placement === 'bottomRight' || option.placement === 'topRight') {
                containerClass.value = classStr + ' be-notification-animation-right-in be-notification-bottom'
            }
            if (option.placement === 'bottomLeft' || option.placement === 'topLeft') {
                containerClass.value = classStr + ' be-notification-animation-left-in be-notification-top'
            }
        }

     return{
         option,
         containerClass,
         setAnimate,
         startTimer,
         clearTimer,
         onClick,
         close
     }
    },
    render(h) {
        this.clearTimer()
        this.startTimer()
        return (
            <div
                style={this.option.style}
                onClick={(event)=>{this.onClick(event)}}
                class={this.containerClass} id={`be_notification${this._uid}`}>
                <transition name="be-fade-in-linear">
                    {this.option.isShow ? renderBody.call(this, h) : ''}
                </transition>
            </div>
        )
    },
    computed: {

    },
    watch: {
        offsetTopStyle: {
            handler: function (nVal) {
                if (this.option.placementSelf === 'topLeft' || this.option.placementSelf === 'topRight') {
                    this.option.style = {top:nVal + 'px'}
                }
            },
            deep: true,
            immediate: true
        },
        offsetBottomStyle: {
            handler: function (nVal) {
                if (this.option.placementSelf === 'bottomLeft' || this.option.placementSelf === 'bottomRight') {
                    this.option.style = {bottom:nVal + 'px'}
                }
            },
            deep: true,
            immediate: true
        },
        placementStyle: {
            handler: function (nVal) {
                this.option.placementSelf = nVal
                if (this.option.placementSelf === 'bottomLeft' || this.option.placementSelf === 'bottomRight') {
                    this.option.style = {bottom:this.option.offsetBottom + 'px'}
                }
                if (this.option.placementSelf === 'topLeft' || this.option.placementSelf === 'topRight') {
                    this.option.style = {top:this.option.offsetTop + 'px'}
                }
            },
            deep: true,
            immediate: true
        },
    },
   /* methods: {
        /!**
         * 关闭方法，销毁组件
         * @param {Event} event - 事件对象
         *!/
        close(event) {

        },
        /!**
         * 确认按钮方法
         * @param {Event} event - 事件对象
         *!/
        onClick(event) {
            this.$selfEvent.onClick && this.$selfEvent.onClick(event)
        },
        /!**
         * 銷毀定時器
         *!/
        clearTimer() {
            clearTimeout(this.timer);
            this.timer = null
        },
        /!**
         * 定時器 關閉銷毀組件
         *!/
        startTimer() {
            if (this.option.duration > 0) {
                this.timer = setTimeout(() => {
                    this.close();
                }, this.option.duration);//sad
            }
        },
        /!**
         * 设置动画
         *!/
        setAnimate(){
            let classStr = `be-notification be-notification__${this.option.msgType} be-notification__${this.option.placement} ${this.option.customClass}`
            this.containerClass = classStr
            if (this.option.placement === 'bottomRight' || this.option.placement === 'topRight') {
              this.containerClass = classStr + ' be-notification-animation-right-in be-notification-bottom'
            }
            if (this.option.placement === 'bottomLeft' || this.option.placement === 'topLeft') {
                this.containerClass = classStr + ' be-notification-animation-left-in be-notification-top'
            }
        }
    },
    created(){
        this.setAnimate()
    },
    mounted() {
    },*/

})
