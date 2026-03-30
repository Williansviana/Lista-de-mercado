document.addEventListener('DOMContentLoaded', carregarLista);

function addItem() {
    const itemSelect = document.getElementById("item");
    const itemName = itemSelect.value;
    const quantity = parseFloat(document.getElementById("quantity").value);
    const unitPrice = parseFloat(document.getElementById("unitPrice").value);

    if (itemName && quantity > 0 && unitPrice >= 0) {
        const item = {
            id: Date.now(), // ID único para evitar erros na edição
            itemName,
            quantity,
            unitPrice
        };

        salvarNoLocalStorage(item);
        renderizarItem(item);
        
        // Resetar campos
        itemSelect.selectedIndex = 0;
        document.getElementById("quantity").value = 1;
        document.getElementById("unitPrice").value = "";
        itemSelect.focus();
    } else {
        alert("Por favor, selecione um item e informe os valores.");
    }
}

function renderizarItem(item) {
    const total = item.quantity * item.unitPrice;
    const tableRow = document.createElement("tr");
    tableRow.setAttribute('data-id', item.id);

    tableRow.innerHTML = `
        <td>${item.itemName}</td>
        <td>${item.quantity}</td>
        <td>R$ ${item.unitPrice.toFixed(2)}</td>
        <td>R$ ${total.toFixed(2)}</td>
        <td class="td-actions">
            <button class="edit-btn" onclick="editItem(${item.id})">✏️</button>
            <button class="remove-btn" onclick="removeItem(${item.id})">🗑️</button>
        </td>
    `;
    document.getElementById("itemList").appendChild(tableRow);
    atualizarTotalGeral();
}

function editItem(id) {
    let lista = JSON.parse(localStorage.getItem("listaDeCompras")) || [];
    const item = lista.find(i => i.id === id);
    if (item) {
        const novaQtd = prompt(`Nova quantidade para ${item.itemName}:`, item.quantity);
        if (novaQtd !== null && !isNaN(novaQtd) && novaQtd > 0) {
            item.quantity = parseFloat(novaQtd);
            localStorage.setItem("listaDeCompras", JSON.stringify(lista));
            refreshUI();
        }
    }
}

function removeItem(id) {
    let lista = JSON.parse(localStorage.getItem("listaDeCompras")) || [];
    lista = lista.filter(item => item.id !== id);
    localStorage.setItem("listaDeCompras", JSON.stringify(lista));
    refreshUI();
}

function atualizarTotalGeral() {
    const lista = JSON.parse(localStorage.getItem("listaDeCompras")) || [];
    const total = lista.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
    document.getElementById("grandTotal").textContent = "R$ " + total.toFixed(2);
}

function refreshUI() {
    document.getElementById("itemList").innerHTML = "";
    carregarLista();
}

function carregarLista() {
    const lista = JSON.parse(localStorage.getItem("listaDeCompras")) || [];
    lista.forEach(renderizarItem);
}

function salvarNoLocalStorage(item) {
    const lista = JSON.parse(localStorage.getItem("listaDeCompras")) || [];
    lista.push(item);
    localStorage.setItem("listaDeCompras", JSON.stringify(lista));
}

function clearList() {
    if(confirm("Deseja apagar toda a lista?")) {
        localStorage.removeItem("listaDeCompras");
        refreshUI();
    }
}

function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.text("Minha Lista de Compras", 10, 10);
    let y = 20;
    const lista = JSON.parse(localStorage.getItem("listaDeCompras")) || [];
    lista.forEach(item => {
        const total = item.quantity * item.unitPrice;
        doc.text(`${item.itemName} - ${item.quantity}x R$${item.unitPrice.toFixed(2)} = R$${total.toFixed(2)}`, 10, y);
        y += 10;
    });
    doc.text(`Total: ${document.getElementById("grandTotal").textContent}`, 10, y + 10);
    doc.save("lista-viana.pdf");
}