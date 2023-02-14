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
            isNew: false, //new Item/edit check
            pages: {}, //紀錄頁數
            productList: [],
            selectProduct: {
                imagesUrl: [],
            }

            , showMessage:'' //圖片上傳訊息顯示
        }
    },
    methods: {
        //登入確認後載入表單
        checkLogin(){
            axios.post(`${this.apiUrl}api/user/check`)
                .then((res) => {
                    //alert('確認登入');
                    this.getProductsAll();
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
                    console.log(err.response.data.message);
                })
        },
        
        //線上取得清單(新增頁數判斷)
        getProductsAll( page = 1 ){ //預設頁碼參數
            axios.get(`${this.apiUrl}api/${this.apiPath}/admin/products?page=${page}`)
            .then((res) => {
                this.productList = res.data.products;
                this.pages = res.data.pagination; //頁碼資訊

                //console.log(res.data.pagination);
                //this.selectProduct = { imagesUrl: [], };//selectProduct清空
            })
            .catch((err)=>{
                console.log(err.response.data.message);
            })
        },
        //更新產品內容
        updateProduct(){
            let url = `${this.apiUrl}/api/${this.apiPath}/admin/product`;
            let http = 'post';

            //<!-- 下面這段isNew部分copy助教 -->
            if (!this.isNew) {
                url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.selectProduct.id}`;
                http = 'put'
            }

            axios[http](url, { data: this.selectProduct })
                .then((res) => {
                    //更新後關閉modal重讀清單
                    alert(res.data.message);
                    productModal.hide();
                    this.getProductsAll();
                })
                .catch((err)=>{
                    console.log(err.response.data.message);
                })
        },
        //刪除商品
        deleteProduct(){
            let url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.selectProduct.id}`;
            let http = 'delete'
            axios[http](url, { data: this.selectProduct })
                .then((res) => {
                    alert(res.data.message);
                    deleteModal.hide();
                    this.getProductsAll();
                })
                .catch((err)=>{
                    console.log(err.response.data.message);
                })

        },

        // //上傳圖片確認(檔案格式、大小)
        // imageCheck(){
        //     //console.dir(fileInput);
        //     const file = fileInput._element.files[0];
        //     const formData = new FormData();
        //     formData.append('file-to-upload',file);
        //     this.showMessage = fileInput._element.files[0].name;
        // },
        //上傳圖片網址
        uploadImage(){
            const file = fileInput._element.files[0];
            const formData = new FormData();
            formData.append('file-to-upload',file);
            axios.post(`${this.apiUrl}/api/${this.apiPath}/admin/upload`, formData)
                .then((res) => {
                    console.log(res.data.imageUrl);
                    this.showMessage = res.data.imageUrl;
                })
                .catch((err) => {
                    // console.log(err.data.message);
                    // this.showMessage = err.data.message;
                    this.showMessage = err.response;
                })

        },

        //新增圖片Url路徑
        insertImages() {
            this.selectProduct.imagesUrl = [];
            this.selectProduct.imagesUrl.push('');
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
        fileInput = new bootstrap.Modal(document.querySelector('#fileInput'));

        //取得名為 "tokenCookie" 的cookie，如果有就存入憑證。
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)tokenCookie\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        // 2.cookie儲存時，defaults: 每次都會帶入 headers，透過cookie給予憑證。
        axios.defaults.headers.common['Authorization'] = token; // cookie儲存時
        this.checkLogin();
        //this.getProductsAll();
    }
})

// 分頁元件
app.component('pagination-pages', {
    template: '#pagination',
    props: ['pages'],
    methods: {
      emitPages(item) {
        this.$emit('emit-pages', item);
      },
    },
  });

//createApp(app).mount('#mainApp');  //渲染
app.mount('#mainApp');  //渲染