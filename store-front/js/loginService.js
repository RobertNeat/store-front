
const login = async (username, password) => {
    try {
        const response = await fetch('http://localhost:8080/api/v2/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        if (response.ok) {
            const authData = await response.json();

            sessionStorage.setItem('userId', authData.userId);
            sessionStorage.setItem('token', authData.token);

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

    const performLogin = async () => {
        const username_element = document.querySelector('#login_username');
        const password_element = document.querySelector('#login_password');
    
        if (username_element && password_element) {
            const username = username_element.value;
            const password = password_element.value;
    
            login(username, password)
                .then( _ => {
                    document.querySelector("#login_ok").click();
                })
                .catch(e => {
                    document.querySelector("#login_not_ok").click();
                });
        }
        else {
            throw new Error('Missing #username or #password elements');
        }
    
        return false;
    }

