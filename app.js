const STORAGE_KEY = "coupleBucketList";

const starterItems = [
  {
    id: crypto.randomUUID(),
    title: "Camping Trip to Pulau Ubin",
    priority: "Soon",
    date: "",
    budget: "",
    location: "Pulau Ubin",
    notes: "",
    packing: "",
    places: "",
    done: false
  },
  {
    id: crypto.randomUUID(),
    title: "Road Trip to KL",
    priority: "Soon",
    date: "",
    budget: "",
    location: "Kuala Lumpur",
    notes: "",
    packing: "",
    places: "",
    done: false
  },
  {
    id: crypto.randomUUID(),
    title: "Travelling to Thailand!",
    priority: "Special",
    date: "",
    budget: "",
    location: "Thailand",
    notes: "",
    packing: "",
    places: "",
    done: false
  },
  {
    id: crypto.randomUUID(),
    title: "Hiking not Bukit Timah!",
    priority: "Someday",
    date: "",
    budget: "",
    location: "",
    notes: "",
    packing: "",
    places: "",
    done: false
  }
];

const form = document.querySelector("#bucketForm");
const list = document.querySelector("#bucketList");
const template = document.querySelector("#itemTemplate");
const totalCount = document.querySelector("#totalCount");
const doneCount = document.querySelector("#doneCount");
const nextCount = document.querySelector("#nextCount");
const filterButtons = document.querySelectorAll(".filter-button");

let items = loadItems();
let currentFilter = "all";

render();

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const title = formData.get("title").trim();

  if (!title) {
    return;
  }

  items.unshift({
    id: crypto.randomUUID(),
    title,
    priority: "Soon",
    date: "",
    budget: "",
    location: "",
    notes: "",
    packing: "",
    places: "",
    done: false
  });

  form.reset();
  saveItems();
  render();
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.toggle("active", item === button));
    render();
  });
});

function loadItems() {
  const savedItems = localStorage.getItem(STORAGE_KEY);

  if (!savedItems) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(starterItems));
    return starterItems;
  }

  try {
    const parsedItems = JSON.parse(savedItems);
    return Array.isArray(parsedItems) ? parsedItems : starterItems;
  } catch {
    return starterItems;
  }
}

function saveItems() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function render() {
  const visibleItems = getVisibleItems();

  list.innerHTML = "";

  if (visibleItems.length === 0) {
    const emptyState = document.createElement("div");
    emptyState.className = "empty-state";
    emptyState.innerHTML = "<p>No plans here yet. Add one tiny idea and let it become a memory.</p>";
    list.append(emptyState);
  } else {
    visibleItems.forEach((item) => list.append(createItem(item)));
  }

  updateStats();
}

function getVisibleItems() {
  if (currentFilter === "done") {
    return items.filter((item) => item.done);
  }

  if (currentFilter === "open") {
    return items.filter((item) => !item.done);
  }

  return items;
}

function createItem(item) {
  const element = template.content.firstElementChild.cloneNode(true);
  const checkbox = element.querySelector(".item-check");
  const deleteButton = element.querySelector(".delete-button");
  const link = element.querySelector(".item-link");

  element.classList.toggle("done", item.done);
  checkbox.checked = item.done;
  link.textContent = item.title;
  link.href = `plan.html?id=${encodeURIComponent(item.id)}`;

  checkbox.addEventListener("change", () => {
    item.done = checkbox.checked;
    saveItems();
    render();
  });

  deleteButton.addEventListener("click", () => {
    items = items.filter((savedItem) => savedItem.id !== item.id);
    saveItems();
    render();
  });

  return element;
}

function updateStats() {
  const completedItems = items.filter((item) => item.done).length;

  totalCount.textContent = items.length;
  doneCount.textContent = completedItems;
  nextCount.textContent = items.length - completedItems;
}
