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
        return getItemList()
    }).then(function (contents) {
        document.getElementById('itemList').innerHTML = contents;
    }).catch(function (err) {
        console.log("OOOOPS");
        console.log(err);
    });

    document.getElementById('name').value = '';        
    // don't actually submit the HTML form
    return false;
}

function getItemList() {
    return new Promise(function (resolve, reject) {
        var formattedList = '<ul>';

        db.allDocs({include_docs: true, descending: true}).then(function (response) {
            response.rows.forEach(function (row) {
                formattedList += "<li>" + row.doc.item + "</li>";
            });
            formattedList += '</ul>';

            // console.log(formattedList);
            resolve(formattedList);
        }).catch(function (err) {
            console.log("UH OH");
            console.log(err);
        });
    });

}

window.onload = function() {

    document.getElementById('newItem').onsubmit = newItem;

	db.sync(remoteDB, { live: true }
	).on('change', function (change) {
		return getItemList().then(function (contents) {
			document.getElementById('itemList').innerHTML = contents;
		});
	});

    getItemList().then(function (contents) {
        document.getElementById('itemList').innerHTML = contents;
    });
    console.log("loaded");
}

