// Função para carregar a lista do localStorage quando a página é carregada
document.addEventListener('DOMContentLoaded', () => {
    carregarLista();
});

function addItem() {
    const itemName = document.getElementById("item").value;
    const quantity = parseFloat(document.getElementById("quantity").value);
    const unitPrice = parseFloat(document.getElementById("unitPrice").value);

    if (itemName && quantity > 0 && unitPrice >= 0) {
        const total = quantity * unitPrice;
        const tableRow = document.createElement("tr");

        tableRow.innerHTML = `
            <td>${itemName}</td>
            <td>${quantity}</td>
            <td>R$ ${unitPrice.toFixed(2)}</td>
            <td>R$ ${total.toFixed(2)}</td>
            <td><button onclick="removeItem(this, ${total})">Remover</button></td>
        `;

        document.getElementById("itemList").appendChild(tableRow);
        updateGrandTotal(total);

        // Salva o item no localStorage
        salvarNoLocalStorage(itemName, quantity, unitPrice);

        // Limpar os campos após adicionar
        document.getElementById("item").value = "";
        document.getElementById("quantity").value = 1;
        document.getElementById("unitPrice").value = "";
    } else {
        alert("Por favor, preencha todos os campos corretamente.");
    }
}

function salvarNoLocalStorage(itemName, quantity, unitPrice) {
    const lista = JSON.parse(localStorage.getItem("listaDeCompras")) || [];
    lista.push({ itemName, quantity, unitPrice });
    localStorage.setItem("listaDeCompras", JSON.stringify(lista));
}

function carregarLista() {
    const lista = JSON.parse(localStorage.getItem("listaDeCompras")) || [];
    lista.forEach(item => {
        const total = item.quantity * item.unitPrice;
        const tableRow = document.createElement("tr");

        tableRow.innerHTML = `
            <td>${item.itemName}</td>
            <td>${item.quantity}</td>
            <td>R$ ${item.unitPrice.toFixed(2)}</td>
            <td>R$ ${total.toFixed(2)}</td>
            <td><button onclick="removeItem(this, ${total})">Remover</button></td>
        `;

        document.getElementById("itemList").appendChild(tableRow);
        updateGrandTotal(total);
    });
}

function removeItem(button, itemTotal) {
    const row = button.parentElement.parentElement;
    const itemName = row.cells[0].textContent;
    row.remove();
    updateGrandTotal(-itemTotal);

    // Remove o item do localStorage
    removerDoLocalStorage(itemName);
}

function removerDoLocalStorage(itemName) {
    let lista = JSON.parse(localStorage.getItem("listaDeCompras")) || [];
    lista = lista.filter(item => item.itemName !== itemName);
    localStorage.setItem("listaDeCompras", JSON.stringify(lista));
}

function updateGrandTotal(change) {
    const grandTotalElem = document.getElementById("grandTotal");
    let currentTotal = parseFloat(grandTotalElem.textContent.replace("R$", "").replace(",", "."));
    const updatedTotal = currentTotal + change;
    grandTotalElem.textContent = "R$ " + updatedTotal.toFixed(2);
}

function clearList() {
    document.getElementById("itemList").innerHTML = "";
    document.getElementById("grandTotal").textContent = "R$ 0.00";
    localStorage.removeItem("listaDeCompras");
}