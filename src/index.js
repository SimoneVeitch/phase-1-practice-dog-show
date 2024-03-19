document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.getElementById("table-body");
    const form = document.getElementById("dog-form");

    // Fetch and render the list of dogs
    function renderDogList() {
        fetch("http://localhost:3000/dogs")
            .then(response => response.json())
            .then(dogs => {
                tableBody.innerHTML = ""; // Clear existing table rows
                dogs.forEach(dog => {
                    const tr = document.createElement("tr");
                    tr.innerHTML = `
                        <td>${dog.name}</td>
                        <td>${dog.breed}</td>
                        <td>${dog.sex}</td>
                        <td><button class="border-round" data-id="${dog.id}">Edit</button></td>
                    `;
                    tableBody.appendChild(tr);
                });
            });
    }

    // Populate the form with the selected dog's information
    function populateForm(dog) {
        form.dataset.id = dog.id;
        form.name.value = dog.name;
        form.breed.value = dog.breed;
        form.sex.value = dog.sex;
    }

    // Handle edit button click to populate the form
    tableBody.addEventListener("click", event => {
        if (event.target.classList.contains("border-round")) {
            const dogId = event.target.dataset.id;
            fetch(`http://localhost:3000/dogs/${dogId}`)
                .then(response => response.json())
                .then(dog => populateForm(dog));
        }
    });

    // Handle form submission to update dog information
    form.addEventListener("submit", event => {
        event.preventDefault();
        const dogId = form.dataset.id;
        const formData = new FormData(form);
        const updatedDog = {
            name: formData.get("name"),
            breed: formData.get("breed"),
            sex: formData.get("sex")
        };
        fetch(`http://localhost:3000/dogs/${dogId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedDog)
        })
            .then(() => renderDogList())
            .catch(error => console.error("Error updating dog:", error));
    });

    // Initial render of the dog list
    renderDogList();
});