const submitButton = document.getElementById("shopForm");
const name = document.getElementById("name");
const price = document.getElementById("price");
const quantity = document.getElementById("quantity");
const items = document.getElementById("items");
const total = document.getElementById("total");

const API = "https://crudcrud.com/api/2c01e38ee831479e873c9fd615072329/shopdata";

submitButton.addEventListener("submit", async (e) => {
    e.preventDefault();
    await uploadData();
    await renderData();
    emptyForm();
});

async function uploadData() {
    const data = {
        name: name.value,
        price: price.value,
        quantity: quantity.value
    };
    try {
        await axios.post(API, data);
    } catch (err) {
        console.error("Error uploading data", err);
    }
}

function emptyForm() {
    name.value = "";
    price.value = 0;
    quantity.value = 0;
}

async function getData() {
    try {
        const res = await axios.get(API);
        return res.data;
    } catch (err) {
        console.error("API call error", err);
        return [];
    }
}

async function renderData() {
    const data = await getData();
    items.innerHTML = "";

    data.forEach(item => {
        const ul = document.createElement("ul");
        const li = document.createElement("li");
        const p = document.createElement("p");
        const input = document.createElement("input");
        input.setAttribute("type", "number");
        const buyButton = document.createElement("button");

        buyButton.innerText = "Buy";
        buyButton.addEventListener("click", async () => {
            if ((item.quantity - input.value) <= 0) {
                await deleteData(item._id);
                items.removeChild(ul);
                renderData();
            } else {
                await updateData(item, item.quantity - input.value);
                await renderData();
            }
        });

        const deleteButton = document.createElement("button");
        deleteButton.innerText = "Delete";
        deleteButton.addEventListener("click", async () => {
            await deleteData(item._id);
            items.removeChild(ul);
        });

        p.innerHTML = `${item.name} RS:${item.price} ${item.quantity}KG `;
        p.appendChild(input);
        p.appendChild(buyButton);
        p.appendChild(deleteButton);

        li.appendChild(p);
        ul.appendChild(li);
        items.insertBefore(ul, items.firstChild);
    });

    total.textContent = `${data.length}`;
}

async function updateData(item, newQuantity) {
    try {
        await axios.put(`${API}/${item._id}`, {
            name: item.name,
            price: item.price,
            quantity: newQuantity
        });
    } catch (err) {
        console.error("Error updating data", err);
    }
}

async function deleteData(id) {
    try {
        await axios.delete(`${API}/${id}`);
    } catch (err) {
        console.error("Error deleting data", err);
    }
}

// Initial render
renderData();
