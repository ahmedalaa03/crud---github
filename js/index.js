var productNameInput = document.getElementById('productName');
var productPriceInput = document.getElementById('productPrice');
var productCategoryInput = document.getElementById('productCategory');
var productImageInput = document.getElementById('productImage');
var productDescriptionInput = document.getElementById('productDescription');
var searchInput=document.getElementById('productSearch');
var addBtn = document.getElementById('addBtn');
var updateBtn = document.getElementById('updateBtn');
var productList = [];
if (localStorage.length) {
  productList = JSON.parse(localStorage.getItem('products'));
  displayProducts(productList);
}
if (!productList.length) { document.getElementById('displayProduct').innerHTML = '<p class="text-center text-primary">No products found!</p>'; }
function addProduct() {
  if (validateAllInputs()) {
    customValue = Date.now();
    var productImageFile = productImageInput.files[0];
    if (productImageFile) {
      var reader = new FileReader();
      reader.onload = function (event) {
        var imageData = event.target.result;
        var product = {
          name: productNameInput.value,
          price: productPriceInput.value,
          category: productCategoryInput.value,
          Image: imageData,
          desc: productDescriptionInput.value,
          customValue: customValue
        };
        productList.push(product);
        localStorage.setItem('products', JSON.stringify(productList));
        clearForm();
        displayProducts(productList);
        removeValidationClasses();
        document.getElementById('imagePreview').style.display = 'none';
      };
      reader.readAsDataURL(productImageFile);
    } else {
      alert('Please select an image file');
    }
  } else {
    alert('Complete Inputs');
  }
}
function clearForm() {
  productNameInput.value = '';
  productPriceInput.value = '';
  productCategoryInput.value = '';
  productImageInput.value = null;
  productDescriptionInput.value = '';
  document.getElementById('imagePreview').src = '';
  document.getElementById('imagePreview').style.display = 'none';
  removeValidationClasses();
}
function displayProducts(list) {
  var box = '';
  for (var i = 0; i < list.length; i++) {
    box += `<div class="col-lg-3 col-md-4 col-sm-6">
              <div class="product bg-light p-3 rounded-3">
                <div class="text-center">
                  <img class="img-fluid" src="${list[i].Image}" alt="">
                </div>
                <h2>${list[i].nameHighlighted ? list[i].nameHighlighted : list[i].name}</h2>
                <div class="d-flex justify-content-between">
                  <span>${list[i].price}$</span>
                  <span class="badge text-bg-secondary">${list[i].category}</span>
                </div>
                <p>${list[i].desc}</p>
                <div class="d-flex justify-content-between">
                  <button onclick="editProduct(${list[i].customValue})" class=" btn btn-warning"><i class="fa-solid fa-pen-to-square"></i></button>
                  <button onclick="deleteProduct(${list[i].customValue})" class="btn btn-danger"><i class="fa-solid fa-trash"></i></button>
                </div>
              </div>
            </div>`;
  }
  document.getElementById('displayProduct').innerHTML = box;
}
function getIndex(customValue) {
  for (var i = 0; i < productList.length; i++) {
    if (customValue == productList[i].customValue) {
      return i
    }
  }
}
function deleteProduct(deleteIndex) {
  index = getIndex(deleteIndex);
  productList.splice(index, 1);
  localStorage.setItem('products', JSON.stringify(productList));
  displayProducts(productList);
  if (!productList.length) { document.getElementById('displayProduct').innerHTML = '<p class="text-center text-primary">No products found!</p>'; }
}
var updateIndex;
function editProduct(editedIndex) {
  updateIndex = getIndex(editedIndex);
  productNameInput.value = productList[updateIndex].name;
  productPriceInput.value = productList[updateIndex].price;
  productCategoryInput.value = productList[updateIndex].category;
  productDescriptionInput.value = productList[updateIndex].desc;
  var base64Image = productList[updateIndex].Image;
  var file = base64ToFile(base64Image, 'image.jpg');
  var dataTransfer = new DataTransfer();
  dataTransfer.items.add(file);
  productImageInput.files = dataTransfer.files;
  var imgPreview = document.getElementById('imagePreview');
  imgPreview.src = base64Image;
  document.getElementById('imagePreview').style.display = 'block';
  addBtn.classList.add('d-none');
  updateBtn.classList.remove('d-none');
}
function updateProduct() {
  if (validateAllInputs()) {
    var productImageFile = productImageInput.files[0];
    if (productImageFile) {
      var reader = new FileReader();
      reader.onload = function (event) {
        var imageData = event.target.result;
        productList[updateIndex].name = productNameInput.value;
        productList[updateIndex].price = productPriceInput.value;
        productList[updateIndex].category = productCategoryInput.value;
        productList[updateIndex].Image = imageData;
        productList[updateIndex].desc = productDescriptionInput.value;
        localStorage.setItem('products', JSON.stringify(productList));
        clearForm();
        addBtn.classList.remove('d-none');
        updateBtn.classList.add('d-none');
        removeValidationClasses();
        console.log(searchInput.value)
        if(searchInput.value==''){displayProducts(productList);}
        else{searchProductByName(searchInput.value);}
        
      };
      reader.readAsDataURL(productImageFile);
    }
  }
}
function searchProductByName(keyword) {
  var matchedSearch = [];
  var regex = new RegExp(`(${keyword})`, 'gi');
  for (var i = 0; i < productList.length; i++) {
    if (productList[i].name.toLowerCase().includes(keyword.toLowerCase())) {
      var productClone = { ...productList[i] };
      productClone.nameHighlighted = productClone.name.replace(regex, `<span class="text-danger">$1</span>`);
      matchedSearch.push(productClone);
    }
  }
  if (keyword === '') {
    displayProducts(productList);
  } else if (matchedSearch.length === 0) {
    document.getElementById('displayProduct').innerHTML = '<p class="text-center text-danger">No products found!</p>';
  } else {
    displayProducts(matchedSearch);
  }
}
function validate(input) {
  var regex = {
    productName: /^[A-Z][a-z]{2,}(\s?\w+)*$/,
    productPrice: /^(?:[6-9]\d{3}(\.\d+)?|[1-5]\d{4}(\.\d+)?|60000(\.0+)?)$/,
    productCategory: /^(TV|Phone|Electronics|Screen|Laptop)$/,
    productDescription: /^[a-zA-Z]{0,250}$/,
    productImage: /\.jpg$/i
  }
  var isValid = regex[input.id].test(input.value);
  if (input.id === 'productImage') {
    if (productImageInput.files.length === 0) {
      isValid = false;
    } else {
      isValid = regex.productImage.test(productImageInput.files[0].name);
    }
  }
  if (isValid) {
    input.classList.add('is-valid')
    input.classList.remove('is-invalid')
    input.nextElementSibling.classList.replace('d-block', 'd-none');
  }
  else {
    input.classList.add('is-invalid')
    input.classList.remove('is-valid')
    input.nextElementSibling.classList.replace('d-none', 'd-block');
  }
  return isValid;
}
function removeValidationClasses() {
  productNameInput.classList.remove('is-valid')
  productPriceInput.classList.remove('is-valid')
  productCategoryInput.classList.remove('is-valid')
  productDescriptionInput.classList.remove('is-valid')
  productImageInput.classList.remove('is-valid')
  productNameInput.classList.remove('is-invalid')
  productPriceInput.classList.remove('is-invalid')
  productCategoryInput.classList.remove('is-invalid')
  productDescriptionInput.classList.remove('is-invalid')
  productImageInput.classList.remove('is-invalid')
}
function validateAllInputs() {
  var allFilled = productNameInput.value.trim() && productPriceInput.value.trim() && productCategoryInput.value.trim() && productDescriptionInput.value.trim() && productImageInput.files.length > 0;

  if (allFilled && validate(productNameInput) && validate(productPriceInput) && validate(productCategoryInput) && validate(productDescriptionInput) && validate(productImageInput)) {
    addBtn.removeAttribute('disabled');
    updateBtn.removeAttribute('disabled');
    return true;
  } else {
    addBtn.setAttribute('disabled', 'true');
    updateBtn.setAttribute('disabled', 'true');
    return false;
  }
}
productNameInput.addEventListener('input', validateAllInputs);
productPriceInput.addEventListener('input', validateAllInputs);
productCategoryInput.addEventListener('input', validateAllInputs);
productDescriptionInput.addEventListener('input', validateAllInputs);
productImageInput.addEventListener('change', validateAllInputs);

function base64ToFile(base64String, fileName) {
  var byteCharacters = atob(base64String.split(',')[1]);
  var byteArrays = [];
  for (var offset = 0; offset < byteCharacters.length; offset++) {
    byteArrays.push(byteCharacters.charCodeAt(offset));
  }
  var blob = new Blob([new Uint8Array(byteArrays)], { type: 'image/jpeg' });
  var file = new File([blob], fileName, { type: 'image/jpeg' });
  return file;
}
productImageInput.addEventListener('change', function () {
  var file = productImageInput.files[0];
  var maxFileSize = 2 * 1024 * 1024;

  if (file && file.size <= maxFileSize && validate(productImageInput)) {
    var reader = new FileReader();
    reader.onload = function (e) {
      document.getElementById('imagePreview').src = e.target.result;
      document.getElementById('imagePreview').style.display = 'block';
    };
    reader.readAsDataURL(file);
    validateAllInputs();
  } else {
    productImageInput.value = '';
    document.getElementById('imagePreview').style.display = 'none';
  }
});