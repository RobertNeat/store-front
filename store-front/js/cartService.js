var basketId = null; //is the same as userId

var total = document.querySelector("#cart__summary__total");
var counter = 0;
var cartPrices = [];

document.querySelector("#cart__summary__total").innerHTML = "0.00$"
//total.innerHTML = "0.00$"

const getCartProducts = async () => {
    try {
        basketId = parseInt(sessionStorage.getItem("userId"));
        const response = await fetch("http://localhost:8080/api/v2/commodity/group/" + basketId);//http://localhost:8080/api/v2/basket/
        const data = await response.json();
        return Promise.resolve(data);
    }
    catch (error) {
        return Promise.reject(error);
    }
}

const renderCartProducts = (products) => {
    checkLoggedIn();

    console.log("cart..loading...");
    if (sessionStorage.getItem("userId")) {
        console.log("for userId: " + sessionStorage.getItem("userId"));
        basketId = sessionStorage.getItem("userId");
        //get table from the page 
        const cartTable = document.querySelector('#cart__table');

        if (cartTable) {
            //query all cart products from database

            tableBody = `<table class="table">
        <thead>
            <th scope="col">#</th>
            <th scope="col">Product</th>
            <th scope="col">Name</th>
            <th scope="col">Quantity</th>
            <th scope="col">Price</th>
            <th></th>
        </thead><tbody>`;

            //console.log(JSON.stringify(products));

            Object.values(products)?.forEach(product => {
                //console.log(JSON.stringify(product));
                tableBody += `
            <tr class="align-middle">
                                <th scope="row">${product.book_id}</th>
                                <td><img src="/img/book/book_${product.book_id}.png" class="cart__item__image"></td>
                                <td class="cart__item__title font_Ubuntu">${product.book.name}</td>
                                <td><input type="number" min="1" class="cart__item__count__input" value="${product.number}" id="item${counter}" onchange="updateItemCount(${counter},${product.commodity_id})"></td>
                                <td>${product.book.price}$</td>
                                <td>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                        class="bi bi-trash3" viewBox="0 0 16 16" onclick="confirmDelete(${product.commodity_id})"><!-deleteItemfromBasket(${product.commodity_id})-->
                                        <path
                                            d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z" />
                                    </svg>
                                    <button class="common__display__none" id="deleteConfirm" data-bs-toggle="modal" data-bs-target="#deletePosition"></button>
                                </td>
                            </tr>
            `;
                cartPrices.push(product.book.price);
                counter++;
            }
            );

            tableBody += `</tbody></table>`;

            cartTable.innerHTML = tableBody;
        }
        else {
            throw new Error('Missing cart table div in DOM');
        }
    }
    updateTotalCartValue();
}


//pobranie zawartości tabeli Customer
const getCustomer = async () =>{
    try {
        customerId=parseInt(sessionStorage.getItem("userId"));
        const response = await fetch("http://localhost:8080/api/v2/customer/"+customerId);
        const data = await response.json();
        return Promise.resolve(data);
    }
    catch(e){
        return Promise.reject(e);
    }
}

//zaktualizowanie adresu do formularza koszyka
const displayAddress = (adress) =>{
    document.getElementById("cart_address").value=adress;
}

//pobranie zawartości tabeli Basket
const getBasket = async () =>{
    try {
        basketId=parseInt(sessionStorage.getItem("userId"));
        const response = await fetch("http://localhost:8080/api/v2/basket/"+basketId);
        const data = await response.json();
        return Promise.resolve(data);
    }
    catch(e){
        return Promise.reject(e);
    }
}

//zaktualizowanie płatności do formularza koszyka
const displayPayment = (payment) =>{
    document.getElementById("cart_payment").value=payment;
}


//------------------------załadowanie strony koszyka---------------------
getCartProducts()
    .then(items => {
        renderCartProducts(items);
        //zaczytanie adresu z bazy danych
    })
    .catch(error => {
        console.log('[DEBUG] Error: ' + error);
    });

getCustomer()
    .then(customer => {
        displayAddress(customer.adress);
        //console.log("[DEBUG]:"+JSON.stringify(customer));
    })
    .catch(error=>{
        console.log('[DEBUG] Address error: '+ error);
    });

getBasket()
    .then(basket =>{
        //console.log("[DEBUG]:"+JSON.stringify(basket.payment));
        displayPayment(basket.payment);
    })
    .catch(error=>{
        console.log('[DEBUG] Basket error: '+ error);
    }); 

//------------------aktuzalizacja zawartości koszyka-----------------------
const updateTotalCartValue = () => {
    const cart__summary__total = document.querySelector("#cart__summary__total");
    //console.log(cartPrices);

    let text="#item";

    totalCart=0;

    for (a = 0; a < counter; a++) {
        //console.log(cartPrices[a]);
        //console.log(document.querySelector(text+a).value);
        //console.log(cartPrices[a]*document.querySelector(text+a).value);
        totalCart+=(cartPrices[a]*document.querySelector(text+a).value);
    }

    //console.log("Total:"+totalCart);
    
    document.querySelector("#cart__summary__total").innerHTML=(totalCart).toFixed(2)+"$";
    total.innerHTML== totalCart+"$";
}



const deleteItemfromBasket = async () => {
    commodity_id=document.querySelector("#confirm_modal").value;
    console.log("Deletecommand:"+commodity_id);

    //perform deleting record from commodity based on commodity_id

    const response = await fetch("http://localhost:8080/api/v2/commodity/"+commodity_id,{
        method: 'DELETE'
    }).then(()=>{
        //console.log("powinno sie usunac");
        location.reload(); //reload cart page so position wont be displayed
    }).catch((error)=>{
        console.log("ERROR::"+error);
    });
}


const confirmDelete = (position) =>{
    document.querySelector("#confirm_modal").value=position;
    document.querySelector("#deleteConfirm").click();
}



const updateItemCount = (element,commodityId) => {
    var commodityCount=document.querySelector("#item"+element).value;
    
    /*
    console.log("Commodity_id:"+commodityId);
    console.log("Number:"+commodityCount);
    */

    //update value in database
    try{
        fetch('http://localhost:8080/api/v2/commodity',{
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                number: commodityCount,
                commodity_id: commodityId
            })
        });
    }
    catch(e){
        console.log(e);
    }
    
    updateTotalCartValue();
}

// ------aktualizacja adresu podczas zmiany i płatności---------
const updateAddress = () => {
    var newAddress=document.getElementById("cart_address").value;
    var customerId=parseInt(sessionStorage.getItem("userId"));
    console.log("newAddress:"+newAddress);
    console.log("customerId:"+customerId);

    //update adress in Customer table
    try{
        fetch('http://localhost:8080/api/v2/customer',{
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                adress: newAddress,
                customer_id: customerId
            })
        });
    }
    catch(e){
        console.log(e);
    }
}

const updatePayment = () => {
    var newPayment=document.getElementById("cart_payment").value;
    var basketId=parseInt(sessionStorage.getItem("userId"));
    console.log("newPayment:"+newPayment);
    console.log("basketId:"+basketId);

    //update payment in Backet table
    try{
        fetch('http://localhost:8080/api/v2/basket',{
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                payment: newPayment,
                basket_id: basketId
            })
        });
    }
    catch(e){
        console.log(e);
    } 
}



//-------------wysłanie formularza zamówienia + (aktualizacja danych w bazie danych) + (przeniesienie zamówienia do archiwum)


const insertArchive = (items) =>{
    userId = parseInt(sessionStorage.getItem("userId"));

}


//przesłanie formularza zamówienia (wywołanie aktualizacji do bazy danych)
const submitPurchase = async() =>{
    
    //*przesłanie maila z zamówieniem do sprzedawcy

    //archiwizacja zamówienia:
        // - przeniesienie danych z koszyka klienta
            //zaczytanie elementów z koszyka
            
        basketId = parseInt(sessionStorage.getItem("userId"));
        customerId = parseInt(sessionStorage.getItem("userId"));
        const response = await fetch("http://localhost:8080/api/v2/commodity/group/"+basketId );
        const data = await response.json();
        //console.log(data);


        Object.values(data)?.forEach(element => {
            console.log(element);
            
            //console.log("customer_id: "+customerId);
            //console.log("book_id:"+element.book_id);
            //console.log("number: "+element.number);
            //console.log("price:"+ element.book.price);
            //console.log("//////////////////////////////////////");
                        

            
            //dodanie elementu koszyka do archiwum
            try{
                fetch('http://localhost:8080/api/v2/archive',{
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        customer_id: customerId,
                        book_id: element.book_id,
                        number: element.number,
                        price: element.book.price
                    })
                });
            }
            catch(e){
                console.log(e);
            }
            

            //usunięcie elementu z koszyka
            try {
                fetch("http://localhost:8080/api/v2/commodity/"+element.commodity_id,{
                    method: 'DELETE',
                });
            }
            catch(error){
                throw new Error(error);
            }
        


        });

        //wyświetlenie powiadomienia o złożeniu zamówienia
        document.getElementById("archiveModal").click();
        

        //usunięcie koszyka dla danego użytkownika
        basketId = parseInt(sessionStorage.getItem("userId"));
        try {
            fetch("http://localhost:8080/api/v2/basket/"+basketId,{
                method: 'DELETE',
            });
        }
        catch(error){
            throw new Error(error);
        }

        //dodanie nowego koszyka dla klienta
        try {
            fetch("http://localhost:8080/api/v2/basket",{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    basket_id: basketId
                })
            });
        }
        catch(error){
            throw new Error(error);
        }

}