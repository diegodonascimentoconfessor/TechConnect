// Função para exibir a seção selecionada e ocultar as demais
function showSection(sectionId) {
    console.log(`Exibindo seção: ${sectionId}`);
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.style.display = 'none');
    document.getElementById(sectionId).style.display = 'block';
}

// Função para adicionar uma nova linha na tabela correspondente
function addRowToTable(formId, tableId, data) {
    console.log(`Adicionando dados à tabela ${tableId}:`, data);
    const table = document.getElementById(tableId).getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();
    data.forEach((value, index) => {
        const newCell = newRow.insertCell(index);
        newCell.textContent = value;
    });
    const actionCell = newRow.insertCell(data.length);
    actionCell.innerHTML = '<button onclick="editRow(this)">Editar</button> <button onclick="deleteRow(this)">Excluir</button>';
}

// Função para enviar dados do formulário para o servidor
async function submitForm(event, type) {
    event.preventDefault(); // Evita o envio padrão do formulário
    console.log(`Formulário enviado: ${type}`);

    const form = document.getElementById(`${type}Form`);
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    console.log(`Dados do formulário:`, data);

    // Enviar os dados para o servidor
    const response = await fetch(`/${type}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (response.ok) {
        const result = await response.json();
        addRowToTable(`${type}Form`, `${type}Table`, Object.values(result));
        form.reset();
    } else {
        console.error('Erro ao enviar o formulário:', response.statusText);
    }
}


function editRow(button) {
    console.log(`Editando linha`);
    const row = button.parentElement.parentElement;
    const cells = row.getElementsByTagName('td');
    const formId = row.parentElement.parentElement.id.replace('Table', 'Form');

    Array.from(cells).forEach((cell, index) => {
        if (index < cells.length - 1) {
            const input = document.getElementById(`${formId}${index}`);
            if (input) {
                input.value = cell.textContent;
                console.log(`Preenchendo ${input.id} com ${cell.textContent}`);
            }
        }
    });

    document.getElementById(`${formId}Id`).value = row.rowIndex;
    showSection(formId.replace('Form', ''));
}

async function deleteRow(button) {
    console.log(`Excluindo linha`);
    const row = button.parentElement.parentElement;
    const id = row.cells[0].textContent; 

    if (confirm(`Deseja realmente excluir o item com ID ${id}?`)) {
        try {
         
            const tableId = row.parentElement.parentElement.id;
            const endpoint = `/${tableId.replace('Table', '')}/${id}`;
            
          
            const response = await fetch(endpoint, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                row.parentElement.removeChild(row);
            } else {
                console.error('Erro ao excluir a linha:', response.statusText);
            }
        } catch (error) {
            console.error('Erro ao enviar solicitação de exclusão:', error);
        }
    }
}
