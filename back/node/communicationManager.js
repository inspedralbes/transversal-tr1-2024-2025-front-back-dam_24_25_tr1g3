// PRODUCTS
async function getProducts(){

}

async function getProduct(id){

}

async function postProduct(productData){

}

async function updateProduct(id, productData){

}

async function deleteProduct(id){

}

// ORDERS
async function getOrders(){
    
}

async function getOrder(id){

}

async function postOrder(orderData){

}

async function updateOrder(id, orderData){

}

async function deleteOrder(id){

}



const communicationManager = {
    // PRODUCTS
    getProducts,
    getProduct,
    postProduct,
    updateProduct,
    deleteProduct,

    // ORDER
    getOrders,
    getOrder,
    postOrder,
    updateOrder,
    deleteOrder,
}

export { communicationManager }