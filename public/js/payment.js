// const payment = function(sessionId){
//     var stripe = Stripe('pk_test_51JhmMRAJmTM0iQwXr7gAT6Ix0kF5eAglRMzHqkQUM3zGapXlJmvLshz3CklgaLRdKqSpAkONViIJDhMIFtB2oW3M007TmQrWYm');
//     var orderBtn = document.getElementById('order_btn');
//     // console.log('orderBtn')
//     orderBtn.addEventListener('click', function(){
//         console.log('working in event listener')
//         stripe.redirectToCheckout({
//             sessionId: `${sessionId}`
//         })
//     })
// }