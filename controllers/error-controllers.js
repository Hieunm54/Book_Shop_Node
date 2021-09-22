class ErrorController {
  // [GET] <invalid route>
    notFoundPage = (req, res, next) => {
            res.render("404", { title: "Page Not Found", message: "Page Not Found!", authenticated: req.session.isLoggedIn, });
    }

}

export default ErrorController;
