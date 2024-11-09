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

function downloadPDF() {
    // Inicializar o jsPDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Título do PDF
    doc.setFontSize(18);
    doc.text("Lista de Compras", 10, 10);

    // Configurações de posição para a tabela
    let y = 20;
    doc.setFontSize(12);

    // Cabeçalhos da tabela
    doc.text("Item", 10, y);
    doc.text("Quantidade", 60, y);
    doc.text("Valor Unitário", 110, y);
    doc.text("Total", 160, y);

    y += 10;

    // Adicionar os itens da lista ao PDF
    const rows = document.querySelectorAll("#itemList tr");
    rows.forEach((row) => {
        const columns = row.querySelectorAll("td");
        if (columns.length === 5) { // Se tem 5 colunas (excluindo o botão)
            doc.text(columns[0].textContent, 10, y);  // Nome do item
            doc.text(columns[1].textContent, 60, y);  // Quantidade
            doc.text(columns[2].textContent, 110, y); // Valor Unitário
            doc.text(columns[3].textContent, 160, y); // Total
            y += 10;
        }
    });

    // Adicionar o valor total geral ao PDF
    const grandTotal = document.getElementById("grandTotal").textContent;
    y += 10;
    doc.setFontSize(14);
    doc.text("Valor Total:", 110, y);
    doc.text(grandTotal, 160, y);

    // Salvar o PDF
    doc.save("Lista_de_Compras.pdf");
}

//adicionar link whatsapp

function shareToWhatsApp() {
    let message = "Lista de Compras:\n\n"; // Cabeçalho da mensagem

    // Percorre cada item na lista e formata para o WhatsApp
    const rows = document.querySelectorAll("#itemList tr");
    rows.forEach(row => {
        const columns = row.querySelectorAll("td");
        if (columns.length === 5) { // Se tem 5 colunas (excluindo o botão)
            const item = columns[0].textContent;
            const quantity = columns[1].textContent;
            const unitPrice = columns[2].textContent;
            const total = columns[3].textContent;

            message += '* ${ item }*\n';
            message += 'Quantidade: ${ quantity } \n';
            message += 'Valor Unitário: ${ unitPrice } \n';
            message += 'Total: ${ total } \n\n';
        }
    });

    // Adiciona o valor total da lista
    const grandTotal = document.getElementById("grandTotal").textContent;
    message += '* Valor Total:* ${ grandTotal } \n';

    // Codifica a mensagem para a URL do WhatsApp
    const whatsappURL = 'https://wa.me/?text=${encodeURIComponent(message)}';

        // Abre o link no WhatsApp
        window.open(whatsappURL, "_blank");
}