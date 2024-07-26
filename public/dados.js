document.addEventListener('DOMContentLoaded', () => {
    fetch('/cliente')
        .then(response => response.json())
        .then(data => populateTable('clientesTable', data));

    fetch('/produto')
        .then(response => response.json())
        .then(data => populateTable('produtosTable', data));

    fetch('/funcionario')
        .then(response => response.json())
        .then(data => populateTable('funcionariosTable', data));
});

function populateTable(tableId, data) {
    const table = document.getElementById(tableId).getElementsByTagName('tbody')[0];
    data.forEach(item => {
        const newRow = table.insertRow();
        Object.values(item).forEach((value, index) => {
            const newCell = newRow.insertCell(index);
            newCell.textContent = value;
        });
    });
}
