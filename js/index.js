'use strict';
const productNameInput = document.getElementById('productName');
const productPriceInput = document.getElementById('productPrice');
const productCategoryInput = document.getElementById('productCategory');
const productImageInput = document.getElementById('productImage');
const productDescriptionInput = document.getElementById('productDescription');
const searchInput = document.getElementById('productSearch');
const addBtn = document.getElementById('addBtn');
const updateBtn = document.getElementById('updateBtn');
let productList = [];
if (localStorage.getItem('products') != null) {
  productList = JSON.parse(localStorage.getItem('products'));
  displayProducts(productList);
}
if (!productList.length) { document.getElementById('displayProduct').innerHTML = '<p class="text-center text-primary">No products to display!</p>'; }
function addProduct() {
  if (validateAllInputs()) {
    const customValue = Date.now();
    const productImageFile = productImageInput.files[0];
    if (productImageFile) {
      const reader = new FileReader();
      reader.onload = function (event) {
        const imageData = event.target.result;
        const product = {
          name: productNameInput.value,
          price: productPriceInput.value,
          category: productCategoryInput.value,
          Image: imageData,
          desc: productDescriptionInput.value,
          customValue: customValue
        }
        productList.push(product);
        localStorage.setItem('products', JSON.stringify(productList));
        sortProducts(filteredProducts());
        clearForm();
        removeValidationClasses();
        document.getElementById('imagePreview').style.display = 'none';
        if (productList.length > 1) { document.getElementById('sortProducts').removeAttribute('disabled'); }
        if (productList.length) { document.querySelectorAll('.priceSlider').forEach(slider => { slider.removeAttribute('disabled'); }) }
      }
      reader.readAsDataURL(productImageFile);
    }
  }
}
function clearForm() {
  productNameInput.value = '';
  productPriceInput.value = '';
  productCategoryInput.value = '';
  productImageInput.value = null;
  productDescriptionInput.value = '';
  document.getElementById('imagePreview').style.display = 'none';
  document.getElementById('imagePreview').src = '';
  removeValidationClasses();
}
function displayProducts(list = productList) {
  let output = '';
  if (list.length === 0) {
    output = '<p class="text-center text-primary">No products to display!</p>';
  } else {
    list.forEach(product => {
      output += `
        <div class="col-lg-3 col-md-4 col-sm-6">
          <div class="product bg-light p-3 rounded-3">
            <div class="text-center">
              <img class="img-fluid" src="${product.Image}" alt="${product.name}">
            </div>
            <h2>${product.nameHighlighted || product.name}</h2>
            <div class="d-flex justify-content-between">
              <span>${product.price}$</span>
              <span class="badge text-bg-secondary">${product.category}</span>
            </div>
            <p>${product.desc || 'No description available'}</p>
            <div class="d-flex justify-content-between">
              <button onclick="editProduct(${product.customValue})" class="btn btn-warning"><i class="fa-solid fa-pen-to-square"></i></button>
              <button onclick="deleteProduct(${product.customValue})" class="btn btn-danger"><i class="fa-solid fa-trash"></i></button>
            </div>
          </div>
        </div>`;
    });
  }
  document.getElementById('displayProduct').innerHTML = output;
  if (!productList.length) { document.getElementById('displayProduct').innerHTML = '<p class="text-center text-primary">No products to display!</p>'; }
}
function deleteProduct(deleteIndex) {
  productList = productList.filter((product) => product.customValue !== deleteIndex);
  localStorage.setItem('products', JSON.stringify(productList));
  sortProducts(filteredProducts());
  if (!productList.length) { document.getElementById('displayProduct').innerHTML = '<p class="text-center text-primary">No products to display!</p>'; }
  if (productList.length < 2) { document.getElementById('sortProducts').setAttribute('disabled', 'true'); }
  if (productList.length) { document.querySelectorAll('.priceSlider').forEach(slider => { slider.setAttribute('disabled', 'true'); }) }
}
let updateIndex;
function editProduct(editedIndex) {
  updateIndex = productList.findIndex(product => product.customValue == editedIndex);
  productNameInput.value = productList[updateIndex].name;
  productPriceInput.value = productList[updateIndex].price;
  productCategoryInput.value = productList[updateIndex].category;
  productDescriptionInput.value = productList[updateIndex].desc;
  let base64Image = productList[updateIndex].Image;
  let file = base64ToFile(base64Image, 'image.jpg');
  let dataTransfer = new DataTransfer();
  dataTransfer.items.add(file);
  productImageInput.files = dataTransfer.files;
  const imgPreview = document.getElementById('imagePreview');
  imgPreview.src = base64Image;
  document.getElementById('imagePreview').style.display = 'block';
  addBtn.classList.add('d-none');
  updateBtn.classList.remove('d-none');
  window.scrollTo(0, 0);
}
function updateProduct() {
  if (validateAllInputs()) {
    let productImageFile = productImageInput.files[0];
    if (productImageFile) {
      let reader = new FileReader();
      reader.onload = function (event) {
        let imageData = event.target.result;
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
        if (searchInput.value.trim() == '') { sortProducts(filteredProducts()); }
        else { searchProductByName(searchInput.value); }

      };
      reader.readAsDataURL(productImageFile);
    }
  }
}

document.getElementById('sortProducts').addEventListener('change', function () { sortProducts(); })
function sortProducts(list = filteredProducts()) {
  const sortOption = document.getElementById('sortProducts').value;
  if (sortOption === 'old') {
    list.sort((a, b) => a.customValue - b.customValue);
  }
  if (sortOption === 'new') {
    list.sort((a, b) => b.customValue - a.customValue);
  }
  if (sortOption === 'asc') {
    list.sort((a, b) => a.price - b.price);
  }
  if (sortOption === 'desc') {
    list.sort((a, b) => b.price - a.price);
  }
  if (sortOption === 'az') {
    list.sort((a, b) => a.name.localeCompare(b.name));
  }
  if (sortOption === 'za') {
    list.sort((a, b) => b.name.localeCompare(a.name));
  }
  displayProducts(list);
}
window.addEventListener('load', function () {
  if (productList.length > 1) { document.getElementById('sortProducts').removeAttribute('disabled'); }
  if (productList.length) { document.querySelectorAll('.priceSlider').forEach(slider => { slider.removeAttribute('disabled'); }) }
})
productNameInput.addEventListener('input', function () { validate(this); validateAllInputs(); });
productPriceInput.addEventListener('input', function () { validate(this); validateAllInputs(); });
productCategoryInput.addEventListener('input', function () { validate(this); validateAllInputs(); });
productDescriptionInput.addEventListener('input', function () { validate(this); validateAllInputs(); });
productImageInput.addEventListener('change', function () { validate(this); validateAllInputs(); });
searchInput.addEventListener('input', function () { searchProductByName(this.value); })
addBtn.addEventListener('click', addProduct)
updateBtn.addEventListener('click', updateProduct)
function validate(input) {
  const regex = {
    productName: /^[A-Z][a-z]{2,}(\s?\w+)*$/,
    productPrice: /^(?:[6-9]\d{3}(\.\d+)?|[1-5]\d{4}(\.\d+)?|60000(\.0+)?)$/,
    productCategory: /^(TV|Phone|Electronics|Screen|Laptop)$/,
    productDescription: /^[a-zA-Z]{0,250}$/,
    productImage: /\.jpg$/i
  }

  let isValid;

  if (input.id === 'productImage') {
    isValid = productImageInput.files.length && regex.productImage.test(productImageInput.files[0].name) && productImageInput.files[0].size <= 2 * 1024 * 1024;
  } else {
    isValid = regex[input.id].test(input.value);
  }

  if (isValid) {
    input.classList.add('is-valid');
    input.classList.remove('is-invalid');
    input.nextElementSibling.classList.replace('d-block', 'd-none');
  } else {
    input.classList.add('is-invalid');
    input.classList.remove('is-valid');
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
  const allFilled = productNameInput.value.trim() && productPriceInput.value.trim() && productCategoryInput.value.trim() && productImageInput.files.length;

  if (allFilled && validate(productNameInput) && validate(productPriceInput) && validate(productCategoryInput) && validate(productImageInput)) {
    addBtn.removeAttribute('disabled');
    updateBtn.removeAttribute('disabled');
    return true;
  } else {
    addBtn.setAttribute('disabled', 'true');
    updateBtn.setAttribute('disabled', 'true');
    return false;
  }
}
function base64ToFile(base64String, fileName) {
  let byteCharacters = atob(base64String.split(',')[1]);
  let byteArrays = [];
  for (let offset = 0; offset < byteCharacters.length; offset++) {
    byteArrays.push(byteCharacters.charCodeAt(offset));
  }
  let blob = new Blob([new Uint8Array(byteArrays)], { type: 'image/jpg' });
  let file = new File([blob], fileName, { type: 'image/jpg' });
  return file;
}
productImageInput.addEventListener('change', function () {
  if (validate(productImageInput)) {
    let reader = new FileReader();
    reader.onload = function (e) {
      document.getElementById('imagePreview').src = e.target.result;
      document.getElementById('imagePreview').style.display = 'block';
    }
    reader.readAsDataURL(productImageInput.files[0]);
  } else {
    productImageInput.value = '';
    document.getElementById('imagePreview').style.display = 'none';
  }
});
function filteredProducts() {
  let filtered = productList;
  if (selectedCategories.length) {
    filtered = filtered.filter(product => selectedCategories.includes(product.category));
  }
  const minPrice = parseInt(minPriceSlider.value);
  const maxPrice = parseInt(maxPriceSlider.value);
  filtered = filtered.filter(product => {
    const price = parseInt(product.price);
    return price >= minPrice && price <= maxPrice;
  });
  return filtered;
}
function searchProductByName(keyword) {
  let matchedSearch = [];
  let regex = new RegExp(`(${keyword})`, 'gi');
  filteredProducts().forEach(product => {
    if (product.name.toLowerCase().includes(keyword.toLowerCase())) {
      let productClone = { ...product };
      productClone.nameHighlighted = productClone.name.replace(regex, `<span class="text-danger">$1</span>`);
      matchedSearch.push(productClone);
    }
  });
  if (keyword.trim() === '') {
    sortProducts(filteredProducts());
  } else if (matchedSearch.length === 0) {
    document.getElementById('displayProduct').innerHTML = '<p class="text-center text-danger">No products found!</p>';
  } else {
    sortProducts(matchedSearch);
  }
}
let selectedPriceProducts = [];
const minPriceSlider = document.getElementById('minPrice');
const maxPriceSlider = document.getElementById('maxPrice');
minPriceSlider.addEventListener('input', updatePriceFilter);
maxPriceSlider.addEventListener('input', updatePriceFilter);
function updatePriceFilter() {
  const minPrice = parseInt(minPriceSlider.value);
  const maxPrice = parseInt(maxPriceSlider.value);
  if (minPrice > maxPrice) {
    maxPriceSlider.value = minPrice;
  } else if (maxPrice < minPrice) {
    minPriceSlider.value = maxPrice;
  }
  document.getElementById('minPriceLabel').innerHTML = minPrice;
  document.getElementById('maxPriceLabel').innerHTML = maxPrice;
  if (selectedCategories.length) {
    selectedPriceProducts = selectedCategoryProducts.filter(product => {
      const price = parseInt(product.price);
      return price >= minPrice && price <= maxPrice;
    });
  }
  else {
    selectedPriceProducts = productList.filter(product => {
      const price = parseInt(product.price);
      return price >= minPrice && price <= maxPrice;
    });
  }
  sortProducts(selectedPriceProducts);
  if (!selectedPriceProducts.length) { document.getElementById('displayProduct').innerHTML = '<p class="text-center text-danger">No products in this range!</p>'; }
}
let selectedCategoryProducts = [];
let selectedCategories = [];
const categoryCheckboxes = document.querySelectorAll('.category-checkbox');
categoryCheckboxes.forEach(checkbox => { checkbox.addEventListener('change', filterByCategory); });
function filterByCategory() {
  selectedCategories = Array.from(categoryCheckboxes).filter(checkbox => checkbox.checked).map(checkbox => checkbox.value);
  if (selectedCategories.length) {
    selectedCategoryProducts = productList.filter(product => {
      const matchesCategory = selectedCategories.includes(product.category);
      const price = parseInt(product.price);
      const isPriceInRange = price >= minPriceSlider.value && price <= maxPriceSlider.value;
      return matchesCategory && isPriceInRange;
    });
  } else {
    selectedCategoryProducts = productList.filter(product => {
      const price = parseInt(product.price);
      return price >= minPriceSlider.value && price <= maxPriceSlider.value;
    });
  }
  sortProducts(selectedCategoryProducts);
  if (!selectedCategoryProducts.length) {
    document.getElementById('displayProduct').innerHTML = '<p class="text-center text-danger">No products match the selected filters!</p>';
  }
}