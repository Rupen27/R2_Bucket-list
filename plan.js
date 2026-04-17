const STORAGE_KEY = "coupleBucketList";

const params = new URLSearchParams(window.location.search);
const id = params.get("id");
const form = document.querySelector("#planForm");
const planTitle = document.querySelector("#planTitle");

let items = loadItems();
let item = items.find((savedItem) => savedItem.id === id);

if (!item) {
  document.querySelector(".plan-paper").innerHTML = `
    <a class="back-link" href="index.html">Back to bucket list</a>
    <section class="empty-state"><p>This plan could not be found. Go back and choose an item from the list.</p></section>
  `;
} else {
  fillForm();
  form.addEventListener("submit", savePlan);
}

function loadItems() {
  try {
    const savedItems = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(savedItems) ? savedItems : [];
  } catch {
    return [];
  }
}

function fillForm() {
  planTitle.textContent = item.title;
  form.elements.title.value = item.title || "";
  form.elements.date.value = item.date || "";
  form.elements.budget.value = item.budget || "";
  form.elements.location.value = item.location || "";
  form.elements.priority.value = item.priority || "Soon";
  form.elements.notes.value = item.notes || "";
  form.elements.packing.value = item.packing || "";
  form.elements.places.value = item.places || "";
}

function savePlan(event) {
  event.preventDefault();

  const formData = new FormData(form);
  item.title = formData.get("title").trim();
  item.date = formData.get("date").trim();
  item.budget = formData.get("budget").trim();
  item.location = formData.get("location").trim();
  item.priority = formData.get("priority");
  item.notes = formData.get("notes").trim();
  item.packing = formData.get("packing").trim();
  item.places = formData.get("places").trim();

  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  planTitle.textContent = item.title;
  form.querySelector("button").textContent = "Saved";
  setTimeout(() => {
    form.querySelector("button").textContent = "Save plan";
  }, 1200);
}
