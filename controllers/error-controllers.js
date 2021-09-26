class ErrorController {
  // [GET] <invalid route>
    notFoundPage = (req, res, next) => {
            res.render("404", { title: "Page Not Found", message: "Page Not Found!", });
    }

    get500ErrorPage = (req, res, next) => {
      res.render('500',{title:'Page Not Found'});
    }

}

export default ErrorController;
