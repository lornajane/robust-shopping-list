var db = new PouchDB('shopping');
var remoteDB = new PouchDB('http://localhost:5984/shopping');

function newItem() {
    var item = document.getElementById('name').value;
    console.log("new item: " + item);

    var now = new Date;
    var doc = {
        "_id": String(now.getTime()),
        "item": item
    };

    console.log(doc);
    db.put(doc).then(function () {
        db.sync(remoteDB);
    }).catch(function (err) {
        console.log("OOOOPS");
        console.log(err);
    });
        
    // don't actually submit the HTML form
    return false;
}

window.onload = function() {

    document.getElementById('newItem').onsubmit = newItem;
    console.log("loaded");
}

