const deleteBtn = (btn) => {
	const id = btn.parentNode.querySelector("[name=id]").value;
	const _csrf = btn.parentNode.querySelector("[name=_csrf]").value;

    const productElement = btn.closest('article');

	fetch("/admin/delete-product/" + id, {
		method: "DELETE",
		headers: {
			"csrf-token": _csrf,
		},
	})
		.then((response) => {
			// console.log(response);
            return response.json();
		})
        .then(data =>{
            console.log(data);
            productElement.parentNode.removeChild(productElement);
        })
		.catch((err) => {
			console.log(err);
		});
};
