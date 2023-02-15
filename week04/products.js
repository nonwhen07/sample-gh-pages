// VueCDN 
import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.26/vue.esm-browser.min.js';



let productModal = null;
let deleteModal = null;
let fileInput = null;
let showMessage = '';

const app = createApp({
    data(){
        return {
            //1. 使用管理者API路徑
            apiUrl: 'https://vue3-course-api.hexschool.io/v2/',
            apiPath: 'jeff_hexschool',
            productList: [],
            selectProduct: {
                imagesUrl: [],
            },
            pages: {}, //紀錄頁數
            isNew: false//new Item/edit check
            ,showMessage: '' //圖片上傳後訊息顯示
        }
    },
    methods: {
        //登入確認後載入表單
        checkLogin(){
            axios.post(`${this.apiUrl}api/user/check`)
                .then((res) => {
                    //alert('確認登入');
                    this.getProductPages();
                })
                .catch((err) => {
                    alert(err.response.data.message);
                    location = "../week04/loginPage.html";
                })
        },
        //登出
        logout(){
            // defaults:  每次都會帶入 headers
            axios.post(`${this.apiUrl}logout`)
                .then((res) => {
                    alert('將跳轉回登入頁面...');
                    location = "../week04/loginPage.html";
                })
                .catch((err) => {
                    alert(err.response.data.message);
                })
        },
        
        //線上取得清單(新增頁數判斷)
        getProductPages( page = 1 ){ //預設頁碼參數
            axios.get(`${this.apiUrl}api/${this.apiPath}/admin/products?page=${page}`)
            .then((res) => {
                this.productList = res.data.products;
                this.pages = res.data.pagination; //頁碼資訊
                //this.selectProduct = { imagesUrl: [], };//selectProduct清空 
            })
            .catch((err)=>{
                alert(err.response.data.message);
            })
        },

        //上傳圖片網址並取得網址，轉換元件失敗了，想問助教是否有可以參考的例子
        uploadImage(){
            const file = fileInput.files[0];
            const formData = new FormData();
            formData.append('file-to-upload',file);
            axios.post(`${this.apiUrl}/api/${this.apiPath}/admin/upload`, formData)
                .then((res) => {
                    this.showMessage = '上傳圖片網址 : ' + res.data.imageUrl;
                })
                .catch((err) => {
                    this.showMessage = err.response;
                })
        },
        //Bootstrap Modal 打開產品表單
        openModal(isNew, item){
            if (isNew === 'new') {
                this.selectProduct = {
                    imagesUrl: [],
                };
                this.isNew = true;
                productModal.show();
            }
            else {
                this.selectProduct = { ...item };
                this.isNew = false;
                productModal.show();
            }
        },
        //Bootstrap Modal 打開刪除表單
        openDeleteModal(item){
            this.selectProduct = { ...item };
            deleteModal.show();
        }
        


    },
    //畫面生成後重新擷取動元素
    mounted() {
        productModal = new bootstrap.Modal(document.querySelector('#productModal'));
        deleteModal = new bootstrap.Modal(document.querySelector('#deleteModal'));
        fileInput = document.querySelector('#fileInput');

        //取得名為 "tokenCookie" 的cookie，如果有就存入憑證。
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)tokenCookie\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        // 2.cookie儲存時，defaults: 每次都會帶入 headers，透過cookie給予憑證。
        axios.defaults.headers.common['Authorization'] = token; // cookie儲存時
        this.checkLogin();
    }
})

// 分頁元件
app.component('pagination-pages', {
    template: '#pagination',
    props: ['pages'],
    methods: {
      emitPages(page) {
        this.$emit('emit-pages', page);
      },
    },
  });

// 產品新增/編輯元件
app.component('productModal', {
    template: '#productModal',
    props: ['selectitem', 'isNew'],
    data() {
        return {
          apiUrl: 'https://vue3-course-api.hexschool.io/v2',
          apiPath: 'jeff_hexschool',
        };
      },
    mounted() {
        productModal = new bootstrap.Modal(document.getElementById('productModal'), {
            keyboard: false,
            backdrop: 'static'
        });
    },
    methods: {
        //更新產品內容
        updateProduct(){
            let url = `${this.apiUrl}/api/${this.apiPath}/admin/product`;
            let http = 'post';

            //<!-- 下面這段isNew部分copy助教 -->
            if (!this.isNew) {
                //url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.selectProduct.id}`;
                url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.selectitem.id}`;
                http = 'put'
            }

            axios[http](url, { data: this.selectitem })
                .then((res) => {
                    alert(res.data.message);
                    productModal.hide();
                    //更新後關閉modal，重讀清單
                    //this.getProductPages();
                    this.$emit('update');
                })
                .catch((err)=>{
                    alert(err.response.data.message);
                })
        },
        //新增圖片Url路徑
        insertImages() {
            // this.selectProduct.imagesUrl = [];
            // this.selectProduct.imagesUrl.push('');
            this.selectitem.imagesUrl = [];
            this.selectitem.imagesUrl.push('');
        },
        //Bootstrap Modal 打開產品表單
        openModal(isNew, item){
            if (isNew === 'new') {
                // this.selectProduct = {
                //     imagesUrl: [],
                // };
                this.selectitem = {
                    imagesUrl: [],
                };
                this.isNew = true;
                productModal.show();
            }
            else {
                //this.selectProduct = { ...item };
                this.selectitem = { ...item };
                this.isNew = false;
                productModal.show();
            }
        },
    },
  });

// 產品刪除元件
app.component('deleteModal', {
    template: '#deleteModal',
    props: ['selectitem'],
    data(){
        return {
            apiUrl: 'https://vue3-course-api.hexschool.io/v2',
            apiPath: 'jeff_hexschool',
          };
    },
    mounted() {
        deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'), {
            keyboard: false,
            backdrop: 'static',
          });
      },
    methods: {
        //刪除商品
        deleteProduct(){
            //let url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.selectProduct.id}`;
            let url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.selectitem.id}`;
            let http = 'delete'
            axios[http](url, { data: this.selectitem })
                .then((res) => {
                    alert(res.data.message);
                    deleteModal.hide();
                    //刪除後刷新表單
                    //this.getProductPages();
                    this.$emit('update');
                })
                .catch((err)=>{
                    alert(err.response.data.message);
                })
        },
    },
  });


// 圖片上傳元件
// 圖片上傳部分有做出來，但是在轉換Vue元件時卡關了
// 轉換失敗，想問助教是否有可以參考的例子
// app.component('fileUpload', {
//     template: '#fileUpload',
//     props: ['message'],
//     data(){
//         return {
//             apiUrl: 'https://vue3-course-api.hexschool.io/v2',
//             apiPath: 'jeff_hexschool',
//           };
//     },
//     mounted() {
//         fileInput = document.querySelector('#fileInput');
//         //let message = '';
//     },
//     methods: {
//         //上傳圖片網址
//         uploadImage(){
//             const file = fileInput._element.files[0];
//             const formData = new FormData();
//             // formData.append('file-to-upload',file);
//             // this.showMessage = '上傳圖片網址 : '+file;
//             // axios.post(`${this.apiUrl}/api/${this.apiPath}/admin/upload`, formData)
//             //     .then((res) => {
//             //         console.log(res.data.imageUrl);
//             //         this.showMessage = '上傳圖片網址 : ' + res.data.imageUrl;
//             //     })
//             //     .catch((err) => {
//             //         console.log(err);
//             //         //this.showMessage = err.response;
//             //     })
//         },
//     },
//   });

//createApp(app).mount('#mainApp');  //渲染


app.mount('#mainApp');  //渲染