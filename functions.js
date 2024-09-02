export function createHome(alert) {

    let container = document.querySelector(".container");


    container.innerHTML = `
    
  <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
       </div> 

    	<h1>Shops</h1>

    <button class="button">Add shop</button>

	<table class="table">
		<thead>
			<tr class="table-header">
				<th>Id</th>
				<th>Name</th>
				<th>Location</th>
				<th>employees</th>
			</tr>
		</thead>
		<tbody>
		</tbody>
	</table>
    `
    let button = document.querySelector(".button");
    let table = document.querySelector(".table");
    const alertPlaceholder = document.querySelector('.container-alert');
    let load = document.querySelector(".spinner-border");

    const appendAlert = (message, type) => {
        const wrapper = document.createElement('div')
        wrapper.innerHTML = [
            `<div class="alert alert-${type} alert-dismissible" role="alert">`,
            `   <div>${message}</div>`,
            '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
            '</div>'
        ].join('')

        alertPlaceholder.append(wrapper)
    }

    api("https://localhost:7081/api/v1/Shop/all").then(response => {
        return response.json();
    }).then(data => {
        load.classList = "";
        console.log(data);
        attachShops(data.shopList);
    }).catch(error => {
        load.classList = "";
        console.error('Error fetching data:', error);
        appendAlert(error, "danger");
    });


    button.addEventListener("click", (eve) => {
        CreateAddShopPage();
    });

    table.addEventListener("click", (eve) => {

        if (eve.target.classList.contains("updateShop")) {
            api(`https://localhost:7081/api/v1/Shop/id/${eve.target.textContent}`).then(res => {
                return res.json();
            }).then(data => {
                console.log(data);

                let shop = {
                    name: data.name,
                    location: data.location,
                    employees: data.employees
                }

                CreateUpdatePage(shop, eve.target.textContent);

            }).catch(error => {
                console.error('Error fetching data:', error);
            });
        }

    });

    if (alert === "deleted") {
        load.classList = "";
        appendAlert("Shop has been DELETED with success!", "success");
    }

    if (alert === "updated") {
        load.classList = "";
        appendAlert("Shop has been UPDATED with success!", "success");
    }

    if (alert === "added") {
        load.classList = "";
        appendAlert("Shop has been ADDED with success!", "success");
    }

}

export function CreateAddShopPage() {

    let container = document.querySelector(".container");


    container.innerHTML = `
    
      <h1>New Shop</h1>
    <form>
        <p class="name-container">
            <label for="name">Name</label>
            <input name="name" type="text" id="name">
            <a class="nameErr">Name required!</a>
        </p>
        <p class="location-container">
            <label for="location">Location</label>
            <input name="location" type="text" id="location">
            <a class="locationErr">Location required!</a>
        </p>
        <p class="employees-container">
            <label for="employees">Employees</label>
            <input name="ratiemployeesng" type="text" id="employees">
            <a class="employeesErr">Employees required!</a>
        </p>
        <div class="createShop">
         <a href="#">Create New Shop</a>
        </div>
        <div class="cancel">
         <a href="#">Cancel</a>
        </div>
    </form>

    `

    let button = document.querySelector(".cancel");
    let test = document.querySelector(".createShop");

    button.addEventListener("click", (eve) => {
        createHome("");
    })

    test.addEventListener("click", (eve) => {
        createUpdateShop("create");
    })

}


export function CreateUpdatePage(shop, idShop) {

    let container = document.querySelector(".container");

    container.innerHTML = `
    <h1>Update Shop</h1>
    <form>
        <p>
            <label for="name">Name</label>
            <input name="name" type="text" id="name" value="${shop.name}">
             <a class="nameErr">Name required!</a>
        </p>
        <p>
            <label for="location">Location</label>
            <input name="location" type="text" id="location" value="${shop.location}">
             <a class="locationErr">Location required!</a>
        </p>
        <p>
            <label for="employees">Employees</label>
            <input name="employees" type="text" id="employees" value="${shop.employees}">
             <a class="employeesErr">Employees required!</a>
        </p>

        <div class="submitUpdate">
         <a href="#">Update Shop</a>
        </div>

          <div class="cancel">
         <a href="#">Cancel</a>
        </div>
        <div class="submitDelete">
         <a href="#">Delete Shop</a>
        </div>
    </form>
    `

    let cancelButton = document.querySelector(".cancel");
    let submitUpdateButton = document.querySelector(".submitUpdate");
    let submitDeleteButton = document.querySelector(".submitDelete");
    let nameinput = document.getElementById("name");

    nameinput.disabled = true;

    cancelButton.addEventListener("click", (eve) => {
        createHome("");
    });

    submitUpdateButton.addEventListener("click", (eve) => {
        createUpdateShop("update", idShop);
    });

    submitDeleteButton.addEventListener("click", (eve) => {

        api(`https://localhost:7081/api/v1/Shop/delete/${idShop}`, "DELETE")
            .then(response => {
                return response.json();
            })
            .then(data => {
                console.log(data);
                createHome("deleted");
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });

    })


}

function createRow(shop) {

    let tr = document.createElement("tr");

    tr.innerHTML = `
				<td class="updateShop">${shop.id}</td>
				<td>${shop.name}</td>
				<td>${shop.location}</td>
				<td>${shop.employees}</td>
    `

    return tr;
}

function api(path, method = "GET", body = null) {

    const url = path;
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'X-Requested-With': 'XMLHttpRequest',
        }
    }
    if (body != null) {
        options.body = JSON.stringify(body);
    }

    return fetch(url, options);
}

function attachShops(shops) {

    let lista = document.querySelector("thead");

    console.log(shops);

    shops.forEach(shop => {

        let tr = createRow(shop);
        lista.appendChild(tr);

    });

    return lista;

}

function createUpdateShop(request, idShop) {

    const isNumber = (str) => {
        return /^[+-]?\d+(\.\d+)?$/.test(str);
    };

    let name = document.getElementById("name").value;
    let location = document.getElementById("location").value;
    let employees = document.getElementById("employees").value;

    let nameError = document.querySelector(".nameErr");
    let locationError = document.querySelector(".locationErr");
    let employeesError = document.querySelector(".employeesErr");

    let errors = [];

    if (name == '') {

        errors.push("Name");

    } else if (nameError.classList.contains("beDisplayed") && name !== '') {

        errors.pop("Name");
        nameError.classList.remove("beDisplayed");
    }

    if (location == '') {

        errors.push("Location");

    } else if (locationError.classList.contains("beDisplayed") && location !== '') {

        errors.pop("Location");
        locationError.classList.remove("beDisplayed");
    }

    if (employees == '') {

        errors.push("Employees");

    } else if (employeesError.classList.contains("beDisplayed") && employees !== '') {

        errors.pop("Employees");
        employeesError.classList.remove("beDisplayed");

    }

    if (!isNumber(employees) && employees != '') {

        errors.push("Employees2");
    }
    else if (isNumber(employees)) {

        errors.pop("Employees2");

    } else if (employeesError.classList.contains("beDisplayed") && employees !== '') {

        errors.pop("Employees2");
        employeesError.classList.remove("beDisplayed");
    }

    if (errors.length == 0) {

        let shop = {
            name: name,
            location: location,
            employees: employees
        }

        if (request === "create") {
            api("https://localhost:7081/api/v1/Shop/create", "POST", shop)
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    console.log(data);
                    createHome("added");
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
        } else if (request === "update") {
            api(`https://localhost:7081/api/v1/Shop/update/${idShop}`, "PUT", shop)
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    console.log(data);
                    createHome("updated");
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
        }
    } else {

        errors.forEach(err => {

            if (err.includes("Name")) {

                nameError.classList.add("beDisplayed");
            }

            if (err.includes("Location")) {

                locationError.classList.add("beDisplayed");
            }

            if (err.includes("Employees")) {

                employeesError.classList.add("beDisplayed");
            }

            if (err.includes("Employees2")) {
                employeesError.classList.add("beDisplayed")
                employeesError.textContent = "Only numbers";
            }

        })

    }

}