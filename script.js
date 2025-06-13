const banner = "You can send us your design in PDF or AI format and other requirements on your jerseys, our professional design team will make the design for you. We do custom embroidery, design, and printing.";

let currentItem = null;

function showHome() {
    const content = document.getElementById("content");
    content.innerHTML = `<div class="filters">
      <input type="text" id="search" name="search" placeholder="Search..." oninput="filterItems(this.value)">
    </div>
    <div class="products" id="productList"></div>`;
    renderProducts(sampleItems);  
    document.getElementById("homeLink").style.backgroundColor = "#cc6767";
    document.getElementById("listLink").style.backgroundColor = "#333"
}

function renderProducts(items) {
  const list = document.getElementById("productList");
  list.innerHTML = items.map(item => {
    return `
    <div class="product" onclick='viewItem(${JSON.stringify(item)})'>
      <img src="./images/inventory/${item.model}.jpg" alt="${item.name}" width="100%" />
      <h4>${item.name}</h4>
      <button id="saveBtn" onclick='event.stopPropagation(); saveToWishlist(${JSON.stringify(item)})'>❤️ Save</button>
    </div>`}

    // <button onclick='viewItem(${JSON.stringify(item)})'>👁 View</button>
  ).join("");
}

function saveItem(event, item) {
    event.stopPropagation();
    saveToWishlist(item);
}

function filterItems(query) {
    const filtered = sampleItems.filter(i => i.name.toLowerCase().includes(query.toLowerCase()));
    renderProducts(filtered);
}

function viewItem(item) {
    currentItem = item;
    document.getElementById("modalImg").src = "./images/inventory/" + item.model + ".jpg";
    document.getElementById("modalName").textContent = item.name;
    document.getElementById("modalModel").textContent = "UFG-" + item.model;
    document.getElementById("modalDesc").textContent = item.desc;
    document.getElementById("itemModal").style.display = "flex";
    document.getElementById("modalBackdrop").style.display = "block";

}

function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("ClothingDB", 1);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains("wishlist")) {
                db.createObjectStore("wishlist", { keyPath: "id" });
            }
        };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
}


function closeModal() {
    document.getElementById("itemModal").style.display = "none";
}

async function saveToWishlist(item) {
    const db = await openDB();
    const tx = db.transaction("wishlist", "readwrite");
    const store = tx.objectStore("wishlist");
    store.put(item);
    // tx.oncomplete = () => alert("Saved to wishlist!");
    // tx.oncomplete = () => closeModal();
    tx.onerror = () => alert("Save failed.");
}

async function removeFromWishlist(id) {
    const db = await openDB();
    const tx = db.transaction("wishlist", "readwrite");
    const store = tx.objectStore("wishlist");
    store.delete(id);
    tx.oncomplete = () => {
        alert("Item removed from wishlist");
        showWishlist();
    };
    tx.onerror = () => alert("Failed to remove item.");
}

async function showWishlist() {
  document.getElementById("homeLink").style.backgroundColor = "#333";
  document.getElementById("listLink").style.backgroundColor = "#cc6767"
  const db = await openDB();
  const tx = db.transaction("wishlist", "readonly");
  const store = tx.objectStore("wishlist");
  const req = store.getAll();

  req.onsuccess = () => {
    const items = req.result;
    const content = document.getElementById("content");
    content.innerHTML = `<h2>Your Wishlist</h2><div class="products" id="wishlistItems"></div>`;
    document.getElementById("wishlistItems").innerHTML = items.map(item => `
      <div class="product" onclick='viewItem(${JSON.stringify(item)})'>
        <img src="./images/inventory/${item.model}.jpg" width="100%" />
        <h4>${item.name}</h4>
        <button onclick='event.stopPropagation(); removeFromWishlist(${item.id})'>🗑 Remove</button>
      </div>
    `).join("");

    // <button onclick='viewItem(${JSON.stringify(item)})'>👁 View</button>
  };
}

// Initialize view
showHome();

const phrases = [
    "We do custom embroidery, design, and printing.",
    "You can send your design in PDF or AI format.",
    "Please specify requirements on your jerseys.",
    "Our professional design team will make the design for you.",
    "Don't hesitate to reach out for more information!"
];

let idx = 0;
const textElement = document.getElementById("rotatingText");
setInterval(() => {
    textElement.classList.add("hidden");
    setTimeout(() => {
        idx = (idx + 1) % phrases.length;
        textElement.textContent = phrases[idx];
        void textElement.offsetWidth;
        textElement.classList.remove("hidden");
    }, 500);
}, 3000);