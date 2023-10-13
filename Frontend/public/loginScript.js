document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const emailInput = document.getElementById('emailInput').value;
    const passwordInput = document.getElementById('passwordInput').value;
    const data = {
        emailInput: emailInput,
        passwordInput: passwordInput
    }
    try {
        const result = await axios.post('/user/check-login', data, {
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (result.data.data == 'success') {
            alert('Login Successfull');
            window.location = '/expense/expense'
        }
    } catch (error) {
        if (error.response.data.data) {
            if (error.response.data.data == 'Failed') {
                alert('Invalid Password');
            }
            if (error.response.data.data == 'notExist') {
                alert('User Not Found!')
            }
            if (error.response.data.data == 'error') {
                alert('Something went wrong...')
            }
        }
    }
})