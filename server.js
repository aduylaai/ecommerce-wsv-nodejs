//Khởi động server đến nodejs chỉ có nhiệm vụ khai báo port
const app = require('./src/app');

const PORT = 3055;

const server = app.listen(PORT, () => {
    console.log(`WSV eCommerce start with ${PORT}`);
})

// Phuong thuc quy trinh
// Nhan crtl + c de thoat khoi server
process.on('SIGINT', () => {
    server.close( () => {
        console.log('EXIT SERVER EXPRESS');
    })})


//KẾT NỐI NETWORK, không đụng nữa. Còn nhiệm vụ khác thì chỉnh notify hoặc sửa trong app.js