


        
import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.26/vue.esm-browser.min.js';


//1. 登入，確認是否登入
//2. 使用管理者API路徑
const url = 'https://vue3-course-api.hexschool.io/v2/';
const path = 'jeff_hexschool';

//取得名為 "tokenCookie" 的cookie，如果有就存入憑證。
const token = document.cookie.replace(/(?:(?:^|.*;\s*)tokenCookie\s*\=\s*([^;]*).*$)|^.*$/, "$1");
// 2.cookie儲存時，defaults: 每次都會帶入 headers，透過cookie給予憑證。
axios.defaults.headers.common['Authorization'] = token; // cookie儲存時

const app = {
    data(){
        return {
        }
    },
    //方法集
    methods: {
        login(){
            //登入功能
            const username = document.querySelector('#emailInput').value;
            const password = document.querySelector('#pwInput').value;
            const user = {
                username,
                password
            };
            axios.post(`${url}admin/signin`, user)
            .then((res) => {
                //登入成功時，存入cookie
                const {token, expired} = res.data;
                //登入成功時，存入cookie
                document.cookie = `tokenCookie=${token}; expires=${expired};`;
                // 1.登入成功時，defaults: 每次都會帶入 headers，透過cookie給予憑證。
                axios.defaults.headers.common['Authorization'] = token; // 登入成功時
                //console.log('登入成功，將跳轉至產品頁面。');
                location = "productList.html";

            })
            .catch((err) =>{
                console.log(`${err.message}，登入失敗請確認帳號、密碼是否正確。`);
            })

            //note..........
            // loginBtn.addEventListener('click', () => {
            //     const username = emailInput.value; // email
            //     const password = pwInput.value;
            //     const user = {
            //         username,
            //         password
            //     }
            //     // console.log(user);
            //     axios.post(`${url}admin/signin`, user)
            //     .then((res) => {
            //         //console.log(res);
            //         const {token, expired} = res.data;
            //         //console.log(token, expired);
            //         //EX document.cookie用法
            //         // document.cookie = "someCookieName=true; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/";
            //         // "someCookieName":為自訂名稱，可替換任意名詞。 "expires":到期日。
            //         //登入成功時，存入cookie
            //         document.cookie = `tokenCookie=${token}; expires=${expired};`;
            //         // 1.登入成功時，defaults: 每次都會帶入 headers，透過cookie給予憑證。
            //         axios.defaults.headers.common['Authorization'] = token; // 登入成功時
            //         console.log('登入成功');
            //     })
            //     .catch((err) => {
            //         console.log(err.message);
            //     })
            // });
        }

    },
    //生命週期，元件開始時，執行這段
    mounted() {
        
    }
};

// 1. 建立元件
// 2. 生成Vue應用程式
// 3. 渲染至畫面上
createApp(app)
    .mount('#mainApp');

   
   
    