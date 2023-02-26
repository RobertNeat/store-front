// scripts for displaying products in index.html
const getProducts = async () => {
    try{
        const response = await fetch('http://localhost:8080/api/v2/book');
        const data = await response.json();
        return Promise.resolve(data);
    }
    catch(error){
        return Promise.reject(error);
    }
}

const renderProducts = (products) => {
    const items_div = document.querySelector('#items');
    if(items_div){
        products.forEach(book => {
            items_div.innerHTML+=`
            <div class="card col-12 col-sm-6 col-md-4 col-lg-4 col-xl-3 col-xxl-3 index__item__card">
            <a href="product.html?book_id=${book.book_id}">
                <img src="img/book/book_${book.book_id}.png" class="card-img-top" alt="Book Photo">
            </a>

            <div class="card-body index__item__description">
                <h5 class="index__item__card__title font_Ubuntu">${book.name}</h5>
                <p class="card-text">${book.author}</p>
                <p class="text-left">${book.price} $</p>
                <a href="product.html?book_id=${book.book_id}"
                    class="btn btn-primary index__purchase__button font_Ubuntu">Buy</a>
            </div>
            </div>
            `;
        });
    }
    else{
        throw new Error('Missing #items in DOM.');
    }
}

getProducts()
    .then( products => {
        renderProducts(products);
    })
    .catch(error => {
        console.log('[DEBUG] Error: '+error);
    });