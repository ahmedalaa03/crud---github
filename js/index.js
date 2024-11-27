var productNameInput = document.getElementById('productName');
var productPriceInput = document.getElementById('productPrice');
var productCategoryInput = document.getElementById('productCategory');
var productImageInput = document.getElementById('productImage');
var productDescriptionInput = document.getElementById('productDescription');
var addBtn = document.getElementById('addBtn');
var updateBtn = document.getElementById('updateBtn');
var productList = [];
if (localStorage.length) {
  productList = JSON.parse(localStorage.getItem('products'));
  displayProducts(productList);
  console.log(productList);
}
if (!productList.length) { document.getElementById('displayProduct').innerHTML = '<p class="text-center text-primary">No products found!</p>'; }
function addProduct() {
  if (validateAllInputs()) {
    customValue = Date.now()
    products = {
      name: productNameInput.value,
      price: productPriceInput.value,
      category: productCategoryInput.value,
      Image: `images/${productImageInput.files[0]?.name}`,
      desc: productDescriptionInput.value,
      customValue: customValue
    };
    productList.push(products);
    localStorage.setItem('products', JSON.stringify(productList));
    clearForm();
    displayProducts(productList);
    removeValidationClasses();
  }
  else { alert('Complete Inputs'); }
}
function clearForm() {
  productNameInput.value = '';
  productPriceInput.value = '';
  productCategoryInput.value = '';
  productImageInput.value = null;
  productDescriptionInput.value = '';
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
              <h2>${list[i].title ? list[i].title : list[i].name}</h2>
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
          </div>`
  }
  document.getElementById('displayProduct').innerHTML = box
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
  addBtn.classList.add('d-none');
  updateBtn.classList.remove('d-none');
}
function updateProduct() {
  if (validateAllInputs()) {
    productList[updateIndex].name = productNameInput.value;
    productList[updateIndex].price = productPriceInput.value;
    productList[updateIndex].category = productCategoryInput.value;
    productList[updateIndex].Image = `images/${productImageInput.files[0]?.name}`;
    productList[updateIndex].desc = productDescriptionInput.value;
    localStorage.setItem('products', JSON.stringify(productList));
    clearForm();
    displayProducts(productList);
    addBtn.classList.remove('d-none');
    updateBtn.classList.add('d-none');
    removeValidationClasses();
  }
  else { alert('Complete Inputs'); }
}
function searchProductByName(keyword) {
  var matchedSearch = [];
  var regex = new RegExp(`(${keyword})`, 'gi');
  for (var i = 0; i < productList.length; i++) {
    if (productList[i].name.toLowerCase().includes(keyword.toLowerCase())) {
      productList[i].title = productList[i].name.replace(regex, `<span class="text-danger">$1</span>`);
      matchedSearch.push(productList[i]);
    }
  }

  displayProducts(matchedSearch);
  if (matchedSearch.length === 0) {
    document.getElementById('displayProduct').innerHTML = '<p class="text-center text-danger">No products found!</p>';
  }
}
function validate(input) {
  var regex = {
    productName: /^[A-Z][a-z]{2,}(\s?\w+)*$/,
    productPrice: /^(?:[6-9]\d{3}(\.\d+)?|[1-5]\d{4}(\.\d+)?|60000(\.0+)?)$/,
    productCategory: /^(TV|Phone|Electronics|Screen|Laptop)$/,
    productDescription: /^[a-zA-Z]{0,250}$/,
    productImage: /\.(jpg|jpeg|png|gif)$/i
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
  if (validate(productNameInput) && validate(productPriceInput) && validate(productCategoryInput) && validate(productDescriptionInput) && validate(productImageInput)) {
    addBtn.removeAttribute('disabled')
    updateBtn.removeAttribute('disabled')
    return true;
  }
  else {
    addBtn.setAttribute('disabled', 'true');
    updateBtn.setAttribute('disabled', 'true');
  }
}
productNameInput.addEventListener('input', validateAllInputs);
productPriceInput.addEventListener('input', validateAllInputs);
productCategoryInput.addEventListener('input', validateAllInputs);
productDescriptionInput.addEventListener('input', validateAllInputs);
productImageInput.addEventListener('change', validateAllInputs);