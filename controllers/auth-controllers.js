
class AuthController {

    //[GET] /login
    getLogin = (req, res) =>{   
        // const cookie = req.get('Cookie').split(';');
        // // console.log('Cookie: ',cookie)
        // const isLoggedIn = cookie.find(i => i.includes('isLoggedIn'))
        // const authenticated = isLoggedIn.trim().split('=')[1]
        // console.log('Authenticated: ',authenticated);
        console.log(req.session.isLoggedIn);
        const authenticated = req.session.isLoggedIn
        res.render('auth/login',{
            title: 'Login',
            path: '/login',
            authenticated,
        })
    }

    // [POST] /login 
    postLogin = (req, res) =>{
        // res.cookie('isLoggedIn', true);
        req.session.isLoggedIn = true;
        res.redirect('/')
    }


}

export default AuthController;