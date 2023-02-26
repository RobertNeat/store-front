const query_string = window.location.search;
const url_params = new URLSearchParams(query_string)
const product_id = url_params.get('book_id');

// rendering specific book based on url parameter 
const getProduct = async () => {
    try {
        const response = await fetch("http://localhost:8080/api/v2/book/" + product_id);
        const data = await response.json();
        return Promise.resolve(data);
    }
    catch (error) {
        return Promise.reject(error);
    }
}

const renderProduct = (product) => {
    const item_div = document.querySelector('#item');
    if (item_div) {
        item_div.innerHTML += `
        <div class="row product__product__container">
            <div class="col-12 col-sm-12 col-md-6">
                <img src="img/book/book_${product.book_id}.png" style="width: 100%;">
            </div>
            <div class="col-12 col-sm-12 col-md-6">
                <div class="product__book__description">
                    <h2>${product.name}</h2>
                    <h4 class="product__book__description__noBold">author: ${product.author}</h4>
                    <h5 class="product__book__description__noBold">category: ${product.category}</h5>
                    <h5 class="product__book__description__noBold">publisher: ${product.publisher}</h5>
                    <h5 class="product__book__description__noBold">Publishing year: ${product.released}</h5>
                    <p class="product__book__description__noBold">Publishing year: ${product.description}</p>
                    <div class="product__book__description__toRight">
                    <h5 class="product__book__description__noBold product__book__description__displayInline">${product.price} $</h5>
                    <button type="button" class="btn btn-primary product__book__description__purchase__button product__book__description__displayInline" onclick="performPurchase()">
                    Buy
                    </button>
                </div>
            </div>
        </div>  `;
    }
    else {
        throw new Error('Missing #item in DOM.');
    }
}

getProduct()
    .then(product => {
        renderProduct(product);
    })
    .catch(error => {
        console.log('[DEBUG] Error: ' + error);
});


//updating user basket
const insertProductIntoBasket = async () => {
    console.log("basket_id:",sessionStorage.getItem("userId"));
    console.log("book_id:",product_id);
    console.log("number:",1);
    try {
        const response = await fetch('http://localhost:8080/api/v2/commodity', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                commodity_id: null,
                basket_id: sessionStorage.getItem("userId"),
                book_id: product_id,
                number: 1
            })
        });
    }
    catch (e) {
        return Promise.reject(e);
    }
}

const performPurchase = async () => {
    if (sessionStorage.getItem("userId") != null) {

        await insertProductIntoBasket()
            .then(_ => {
                document.querySelector("#buy_success").click();
            })
            .catch(e => {
                document.querySelector("#buy_failure").click();
                console.log(e);
            });
    } else {
        location.href = "login.html";
    }

}