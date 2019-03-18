//get elements
const itemList = document.querySelector(".items");
const httpForm = document.getElementById("httpForm");
const itemInput = document.getElementById("itemInput");
const imageInput = document.getElementById("imageInput");
const feedback = document.querySelector(".feedback");
const items = document.querySelector(".items");
const submitBtn = document.getElementById("submitBtn");
let editedItemID = 0;
const url = "https://5c8de3ef35643b00149389fd.mockapi.io/items";
httpForm.addEventListener('submit', submitItem);
//submit Items
function submitItem(event) {
    event.preventDefault();
    const itemValue = itemInput.value;
    const imageValue = imageInput.value;
    if (itemValue.length === 0 || imageValue.length === 0) {
        showFeedback('please enter valid values');
    } else {
        postItemAPI(imageValue, itemValue);
        imageInput.value = '';
        itemInput.value = '';
    }
}
//load items
document.addEventListener('DOMContentLoaded', function () {
    getItemsAPI(showItems);
});
//show feedback
function showFeedback(text) {
    feedback.classList.add('showItem');
    feedback.innerHTML = `<p>${text}</p>`;
    setTimeout(() => {
        feedback.classList.remove("showItem");
    }, 3000);
}
//get items
function getItemsAPI(cb) {
    const url = "https://5c8de3ef35643b00149389fd.mockapi.io/items";
    const ajax = new XMLHttpRequest();
    ajax.open('GET', url, true);
    ajax.onload = function () {
        if (this.status === 200) {
            cb(this.responseText);
        } else {
            console.log('something went wrong');
        }
    };
    ajax.onerror = function () {
        console.log('there was an error');
    };
    ajax.send();
}
//show items
function showItems(data) {
    const items = JSON.parse(data);
    console.log(items);
    let info = "";
    items.forEach(item => {
        info += `
        <li class="list-group-item d-flex align-items-center justify-content-between flex-wrap item my-2">
       <img src="${item.image}" id='itemImage' class='itemImage img-thumbnail' alt="">
       <h6 id="itemName" class="text-capitalize itemName">${item.name}</h6>
       <div class="icons">
        <a href='#' class="itemIcon mx-2 edit-icon" data-id='${item.id}'>
         <i class="fas fa-edit"></i>
        </a>
        <a href='#' class="itemIcon mx-2 delete-icon" data-id='${item.id}'>
         <i class="fas fa-trash"></i>
        </a>
       </div>
      </li>`
    })
    itemList.innerHTML = info;
    //get icons
    getIcons();

}
//post items
function postItemAPI(img, itemName) {
    const image = `img/${img}.jpeg`;
    const name = itemName;
    const url = "https://5c8de3ef35643b00149389fd.mockapi.io/items";
    const ajax = new XMLHttpRequest();
    ajax.open('POST', url, true);
    ajax.setRequestHeader('content-Type', 'application/x-www-form-urlencoded');
    ajax.onload = function () {
        getItemsAPI(showItems);
    };
    ajax.onerror = function () {
        console.log('there was an error');
    };
    ajax.send(`image=${image}&name=${name}`);
}

function getIcons() {
    const editIcon = document.querySelectorAll(".edit-icon");
    const deleteIcon = document.querySelectorAll(".delete-icon");


    deleteIcon.forEach(icon => {

        const itemId = icon.dataset.id;
        icon.addEventListener('click', function (event) {
            event.preventDefault();
            console.log(itemId);
            deleteItemAPI(itemId);
        });
    });


    editIcon.forEach(icon => {
        const itemId = icon.dataset.id;
        icon.addEventListener("click", function (event) {
            event.preventDefault();
            const parent = event.target.parentElement.parentElement.parentElement;
            const img = parent.querySelector('.itemImage').src;
            const name = parent.querySelector('.itemName').textContent;


            editItemUI(parent, img, name, itemId);
        });
    });

}
//delete user

function deleteItemAPI(id) {


    const url = `https://5c8de3ef35643b00149389fd.mockapi.io/items/${id}`;
    const ajax = new XMLHttpRequest();
    ajax.open('DELETE', url, true);
    ajax.onload = function () {
        if (this.status === 200) {
            console.log(this.responseText);
            getItemsAPI(showItems);
        } else {
            console.log('something went wrong');
        }
    };
    ajax.onerror = function () {
        console.log('there was an error');
    };
    ajax.send();
}



function editItemUI(parent, itemImg, name, itemId) {
    event.preventDefault();
    itemList.removeChild(parent);

    //console.log(itemImg);
    const imgIndex = itemImg.indexOf('img/');
    const jpegIndex = itemImg.indexOf('.jpeg');
    console.log(imgIndex, jpegIndex);
    const img = itemImg.slice(imgIndex + 4, jpegIndex);

    itemInput.value = name.trim()
    imageInput.value = img;
    editedItemID = itemId;

    submitBtn.innerHTML = "edit item";
    httpForm.removeEventListener('submit', submitItem);
    httpForm.addEventListener('submit', editItemAPI);
}
//sunction editItemAPI


function editItemAPI() {
    event.preventDefault();
    const id = editedItemID;


    const itemValue = itemInput.value;
    const imageValue = imageInput.value;
    if (itemValue.length === 0 || imageValue.length === 0) {
        showFeedback('please enter valid values');
    } else {
        const img = `img/${imageValue}.jpeg`;
        const name = itemValue;
        const url = `https://5c8de3ef35643b00149389fd.mockapi.io/items/${id}`;
        const ajax = new XMLHttpRequest();
        ajax.open('PUT', url, true);
        ajax.setRequestHeader('content-Type', 'application/x-www-form-urlencoded');
        ajax.onload = function () {
            console.log(this.responseText);
            reverseForm();

        };
        ajax.onerror = function () {
            console.log('there was an error');
        };
        ajax.send(`image=${img}&name=${name}`);
    }

}

function reverseForm() {
    itemInput.value = '';
    imageInput.value = '';
    submitBtn.innerHTML = "edit item";
    httpForm.removeEventListener('submit', submitItem);
    httpForm.addEventListener('submit', editItemAPI);
    getItemsAPI(showItems);

}