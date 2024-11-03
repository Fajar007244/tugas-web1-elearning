// scripts.js
function filterCars() {
    document.getElementById('loadingSpinner').style.display = 'block'; // Show spinner
    var searchQuery = document.getElementById('search').value.toLowerCase();
    var make = document.getElementById('make').value;
    var minPrice = parseInt(document.getElementById('min-price').value) || 0;
    var maxPrice = parseInt(document.getElementById('max-price').value) || Infinity;
    var year = document.getElementById('year').value;
    var features = [];
    if (document.getElementById('sunroof').checked) features.push('Sunroof');
    if (document.getElementById('navigation').checked) features.push('Navigation');
    if (document.getElementById('bluetooth').checked) features.push('Bluetooth');
    var conditionElement = document.querySelector('input[name="condition"]:checked');
    var condition = conditionElement ? conditionElement.value : null;

    var items = document.getElementsByClassName('auction-item');
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        var itemTitle = item.querySelector('h5').textContent.toLowerCase();
        var itemMake = item.getAttribute('data-make');
        var itemFeatures = item.getAttribute('data-features').split(',');
        var itemCondition = item.getAttribute('data-condition');
        var itemPrice = parseInt(item.getAttribute('data-price'));
        var itemYear = item.getAttribute('data-year');
        var match = true;

        if (searchQuery && !itemTitle.includes(searchQuery)) match = false;
        if (make !== 'all' && make !== itemMake) match = false;
        if (itemPrice < minPrice || itemPrice > maxPrice) match = false;
        if (year && year !== itemYear) match = false;
        if (features.length > 0) {
            for (var j = 0; j < features.length; j++) {
                if (itemFeatures.indexOf(features[j]) === -1) match = false;
            }
        }
        if (condition && condition !== itemCondition) match = false;

        if (match) {
            item.classList.remove('hidden');
        } else {
            item.classList.add('hidden');
        }
    }

    // Sorting logic
    var sortOption = document.getElementById('sort').value;
    var itemsArray = Array.from(items);
    
    if (sortOption === 'price-asc') {
        itemsArray.sort((a, b) => parseInt(a.getAttribute('data-price')) - parseInt(b.getAttribute('data-price')));
    } else if (sortOption === 'price-desc') {
        itemsArray.sort((a, b) => parseInt(b.getAttribute('data-price')) - parseInt(a.getAttribute('data-price')));
    } else if (sortOption === 'year-asc') {
        itemsArray.sort((a, b) => parseInt(a.getAttribute('data-year')) - parseInt(b.getAttribute('data-year')));
    } else if (sortOption === 'year-desc') {
        itemsArray.sort((a, b) => parseInt(b.getAttribute('data-year')) - parseInt(a.getAttribute('data-year')));
    }

    // Re-insert sorted items into the DOM
    var auctionList = document.querySelector('.auction-list');
    auctionList.innerHTML = ''; // Clear existing items
    itemsArray.forEach(item => auctionList.appendChild(item));

    // Hide spinner after filtering
    document.getElementById('loadingSpinner').style.display = 'none';
}

function showDetails(image, title, condition, features, specifications, fob) {
    document.getElementById('car-details-modal-body').innerHTML = `
        <img src='${image}' alt='${title}' class='img-fluid'>
        <h3>${title}</h3>
        <p>Condition: ${condition}</p>
        <p>Features: ${features}</p>
        <p><strong>FOB Price: $${fob}</strong></p>
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>Specification</th>
                    <th>Detail</th>
                </tr>
            </thead>
            <tbody>
                ${specifications}
            </tbody>
        </table>`;
    $('#carDetailsModal').modal('show');
}

function resetFilters() {
    document.getElementById('search').value = '';
    document.getElementById('make').value = 'all';
    document.getElementById('min-price').value = '';
    document.getElementById('max-price').value = '';
    document.getElementById('year').value = '';
    document.getElementById('sort').value = 'default';
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => checkbox.checked = false);
    document.querySelectorAll('input[type="radio"]').forEach(radio => radio.checked = false);
    filterCars(); // Reapply filters
}