export function createHome() {

    let container = document.querySelector(".container");


    container.innerHTML = `
    
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

    api("https://localhost:7081/api/v1/Shop/all").then(response => {
        return response.json();
    }).then(data => {
        console.log(data);
        attachShops(data.shopList);
    }).catch(error => {
        console.error('Error fetching data:', error);
    });


    let button = document.querySelector(".button");

    button.addEventListener("click", (eve) => {
        CreateAddShopPage();
    });

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
        createHome();
    })

    test.addEventListener("click", (eve) => {
        createShop();
    })

}

function createRow(shop) {

    let tr = document.createElement("tr");

    tr.innerHTML = `
				<td>${shop.id}</td>
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

function createShop() {

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


        api("https://localhost:7081/api/v1/Shop/create", "POST", shop)
            .then(response => {
                return response.json();
            })
            .then(data => {
                console.log(data);
                createHome();
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
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