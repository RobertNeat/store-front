// navigation functions
function goToIndex(){window.location.href="index.html";}
function goToProduct(){window.location.href="product.html";}
function goToLogin(){window.location.href="login.html";}
function goToRegister(){window.location.href="register.html";}
function goToCart(){window.location.href=`cart.html?client=${sessionStorage.getItem("userId")}`;}
function goToArchive(){window.location.href="archive.html";}
function goToAbout(){window.location.href="about.html";}

// common logging action
const accountMenuShow = () =>{
    const account__menu = document.querySelector('#account__menu');
    if(account__menu) account__menu.classList.remove('common__topbar__account__hidden');
    else throw new Error('Missing Account element');
}

const accountMenuHide = () =>{
    const account__menu = document.querySelector('#account__menu');
    if(account__menu) account__menu.classList.add('common__topbar__account__hidden');
    else throw new Error('Missing Account element');
}

//onLoad show "Account" if user logged in
function checkLoggedIn(){
    if(sessionStorage.getItem('userId')){
        document.querySelector('#topbar__register__login').classList.add('common__topbar__account__hidden');
        document.querySelector('#topbar__account').classList.remove('common__topbar__account__hidden');
        accountMenuHide();
    }
}


checkLoggedIn();

const logout = () => {
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('token');
    location.reload();
}