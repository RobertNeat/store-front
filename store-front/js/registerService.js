class customer{
    constructor(
        name,
        surname,
        address,
        contact,
        username,
        password
    ){
        this.person_id=null;
        this.name=name;
        this.surname=surname;
        this.address=address;
        this.contact=contact;
        this.username=username;
        this.password=password
    }
}

// check password retype
const checkPass = () => {
    const retype_pass=document.querySelector("#retype_password");
    const register_password=document.querySelector("#register_password");
    if(retype_pass.value==register_password.value){
        performRegister();
    }
}

const register = async (customer_data) => {
    try {
        const response = await fetch('http://localhost:8080/api/v2/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                    person_id: null,
                    name: customer_data.name,
                    surname: customer_data.surname,
                    adress: customer_data.address,
                    contact: customer_data.contact,
                    username: customer_data.username,
                    password: customer_data.password
            })
        });

        if (response.ok) {
            return Promise.resolve();
        }
        else {
            return Promise.reject();
        }

    }
    catch (e) {
        return Promise.reject(e);
    }
}

const performRegister = () => {
    const register_name = document.querySelector('#register_name');
    const register_surname = document.querySelector('#register_surname');
    const register_address = document.querySelector('#register_address');
    const register_contact = document.querySelector('#register_contact');

    const register_username = document.querySelector('#register_username');
    const register_password = document.querySelector('#register_password');

    if (register_name &&
        register_surname &&
        register_address &&
        register_contact &&
        register_username &&
        register_password){

            const customer_data = 
                new customer(register_name.value,
                                register_surname.value,
                                register_address.value,
                                register_contact.value,
                                register_username.value,
                                register_password.value
                                );
            
            register(customer_data)
            .then( _ => {
                document.querySelector("#register_ok").click();
                document.location.href="index.html";//nie przekierowuje
                return false;
                //forward to index()
                
            })
            .catch(e=>{
                console.log(e);                
                document.querySelector("#register_not_ok").click();
                return false;
            })
            
    }
    else{
        throw new Error('Missing one of the register elements');
    }

    return false;
}