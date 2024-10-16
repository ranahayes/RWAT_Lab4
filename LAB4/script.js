function insertIntoTable(data) {
    const tableBody = document.querySelector("#data-table tbody");
    data.forEach(entry => {
        const [firstName, lastName] = entry.name.split(' ');
        const row = document.createElement('tr');
        row.innerHTML = `<td>${firstName}</td><td>${lastName}</td><td>${entry.id}</td>`;
        tableBody.appendChild(row);
    });
}

// Synchronous XMLHttpRequest
function fetchSync() {
    const reference = new XMLHttpRequest();
    reference.open("GET", "./data/reference.json", false);
    reference.send();
    const data1File = JSON.parse(reference.responseText).data_location;

    const data1 = new XMLHttpRequest();
    data1.open("GET", `./data/${data1File}`, false);
    data1.send();
    const data2File = JSON.parse(data1.responseText).data_location;

    insertIntoTable(JSON.parse(data1.responseText).data);

    const data2 = new XMLHttpRequest();
    data2.open("GET", `./data/${data2File}`, false);
    data2.send();
    insertIntoTable(JSON.parse(data2.responseText).data);

    const data3 = new XMLHttpRequest();
    data3.open("GET", "./data/data3.json", false);
    data3.send();
    insertIntoTable(JSON.parse(data3.responseText).data);
}

// Asynchronous XMLHttpRequest with callbacks
function fetchAsync() {
    const reference = new XMLHttpRequest();
    reference.open("GET", "./data/reference.json", true);
    reference.onload = function() {
        const data1File = JSON.parse(reference.responseText).data_location;
        const data1 = new XMLHttpRequest();
        data1.open("GET", `./data/${data1File}`, true);
        data1.onload = function() {
            const data2File = JSON.parse(data1.responseText).data_location;
            insertIntoTable(JSON.parse(data1.responseText).data);

            const data2 = new XMLHttpRequest();
            data2.open("GET", `./data/${data2File}`, true);
            data2.onload = function() {
                insertIntoTable(JSON.parse(data2.responseText).data);

                const data3 = new XMLHttpRequest();
                data3.open("GET", "./data/data3.json", true);
                data3.onload = function() {
                    insertIntoTable(JSON.parse(data3.responseText).data);
                };
                data3.send();
            };
            data2.send();
        };
        data1.send();
    };
    reference.send();
}

// Fetch API with Promises
function fetchWithPromises() {
    fetch('./data/reference.json')
        .then(response => response.json())
        .then(referenceData => fetch(`./data/${referenceData.data_location}`))
        .then(response => response.json())
        .then(data1 => {
            insertIntoTable(data1.data);
            return fetch(`./data/${data1.data_location}`);
        })
        .then(response => response.json())
        .then(data2 => {
            insertIntoTable(data2.data);
            return fetch('./data/data3.json');
        })
        .then(response => response.json())
        .then(data3 => {
            insertIntoTable(data3.data);
        })
        .catch(error => console.error('Error:', error));
}
