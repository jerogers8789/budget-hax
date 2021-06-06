let db;

const req = indexDB.open('budget', 1);

req.onupgradeneeded = function (e) {
    const db = e.target.result;
    db.createObjectStore('pending', {autoIncrement: true});
};
req.onsuccess = function(e) {
    db = e.target.result;
    if (navigator.onLine) {
        checkDatabase();
    }
};
req.onerror = function (e) {
    console.log(e.target.errorCode);
};

const saveRecord = function(record) {
    let transaction = db.transaction(['pending'], 'readwrite');
    let store = transaction.objectStore('pending');
    store.add(record);
}

const checkDatabase = function() {
    let transaction = db.transaction(['pending'], 'readwrite');
    let store = transaction.objectStore('pending');
    let getAll = store.getAll();

    getAll.onsuccess = function() {
        if (getAll.result.length > 0) {
            fetch('/api/transaction/bulk', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'content-type': 'application/json'
                }
            })
            .then(res => res.json())
            .then(() => {
                let transaction = db.transaction(['pending'], 'readwrite');
                let store = transaction.objectStore('pending');
                store.clear();
            });
        }
    };
}
window.addEventListener('online', checkDatabase);