const API_URL = "https://openapi.programming-hero.com/api/phones?search=";
let searchText = '';

function searchHandler(isShowAll) {
    loading(true);
    const searchField = document.getElementById("searchField");
    searchText = searchField.value;
    console.log(searchText);
    loadPhone(searchText, isShowAll);
}

const loading = (isLoading) => {
    const loadingElement = document.getElementById("loading");
    if (isLoading) {
        loadingElement.classList.remove('hidden');
    } else {
        loadingElement.classList.add('hidden');
    }
}

const loadPhone = async (searchText, isShowAll) => {
    try {
        const res = await fetch(`https://openapi.programming-hero.com/api/phones?search=${searchText}`);
        const data = await res.json();
        const phones = data.data || [];
        displayPhones(phones, isShowAll);
    } catch (error) {
        console.error("Error fetching data:", error);
        loading(false);
    }
}

const displayPhones = (phones,isShowAll ) => {
    const phoneContainer = document.getElementById("phone-container");
    phoneContainer.textContent = '';

    const showAll = document.getElementById("showALLBtn");
    if (phones.length > 12 && !isShowAll) {
        showAll.classList.remove('hidden');
    } else {
        showAll.classList.add('hidden');
    }
    if (!isShowAll) {
        phones = phones.slice(0, 12);
    }

    phones.forEach(phone => {
        const phoneCard = document.createElement('div');
        phoneCard.classList = `card`;
        phoneCard.innerHTML = `
            <img src="${phone.image}" alt="phone" />
            <h2>${phone.phone_name}</h2>
            <p>Brand: ${phone.brand}</p>
            <button onclick="showDetailsHandler('${phone.slug}')" class="btn btn-primary">Show Details</button>
        `;
        phoneContainer.appendChild(phoneCard);
    });
    loading(false);
}

function showBtn() {
    searchHandler(true);
}

const showDetailsHandler = async (id) => {
    try {
        const res = await fetch(`https://openapi.programming-hero.com/api/phone/${id}`);
        const data = await res.json();
        const phone = data.data;
        showPhoneDetails(phone);
    } catch (error) {
        console.error("Error fetching phone details:", error);
    }
}

const showPhoneDetails = (details) => {
    const my_modal = document.getElementById('my_modal');
    my_modal.showModal();

    const modelName = document.getElementById('detailsPhoneName');
    const brandName = document.getElementById('detailsBrand');
    const detailsSpec = document.getElementById('detailsSpec');
    const releaseDate = document.getElementById('releaseDate');
    const imageDiv = document.getElementById('imgContainer');

    imageDiv.innerHTML = `<img src="${details.image}" alt="">`;
    modelName.innerText = details.name;
    brandName.innerText = `Brand: ${details.brand}`;

    const features = details.mainFeatures;
    let specs = "";
    for (const key in features) {
        specs += `${key}: ${features[key]} \n`;
    }
    detailsSpec.innerText = specs;
    releaseDate.innerText = `Release Date: ${details.releaseDate}`;
}

loadPhone(searchText);
