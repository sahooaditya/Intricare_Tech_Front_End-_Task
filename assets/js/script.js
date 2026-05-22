const root = document.documentElement;
const sidebar = document.querySelector("#sidebar");
const mobileScrim = document.querySelector("#mobileScrim");
const openNav = document.querySelector("#openNav");
const closeNav = document.querySelector("#closeNav");
const themeButtons = Array.from(document.querySelectorAll("[data-theme-pick]"));
const methodCards = Array.from(document.querySelectorAll(".method-card"));
const panels = Array.from(document.querySelectorAll("[data-panel]"));
const importMethodPanel = document.querySelector(".import-method-panel");
const builder = document.querySelector(".builder");
const senderScreen = document.querySelector("#senderScreen");
const workflowTabs = Array.from(document.querySelectorAll(".workflow-tab"));
const nextButton = document.querySelector("#nextButton");
const previousButton = document.querySelector("#previousButton");
const submitButton = document.querySelector("#submitButton");
const validateUrl = document.querySelector("#validateUrl");
const urlInput = document.querySelector("#urlInput");
const urlStatus = document.querySelector("#urlStatus");
const dropZone = document.querySelector("#dropZone");
const csvInput = document.querySelector("#csvInput");
const leadOptions = Array.from(document.querySelectorAll(".lead-option"));
const toast = document.querySelector("#toast");
const lookalikeModal = document.querySelector("#lookalikeModal");
const closeLookalikeModal = document.querySelector("#closeLookalikeModal");
const createLeadList = document.querySelector("#createLeadList");
const modalEmpty = document.querySelector(".modal-empty");
const lookalikeListState = document.querySelector("#lookalikeListState");
const lookalikeOptions = Array.from(document.querySelectorAll(".lookalike-option"));
const cancelLookalikeList = document.querySelector("#cancelLookalikeList");
const selectLookalikeList = document.querySelector("#selectLookalikeList");

const panelOrder = ["linkedin", "csv", "map", "lists"];
let selectedMethod = "linkedin";

function setTheme(theme) {
  root.dataset.theme = theme;
  localStorage.setItem("campaign-theme", theme);
  themeButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.themePick === theme);
  });
}

function openSidebar(open) {
  sidebar.classList.toggle("open", open);
  mobileScrim.hidden = !open;
  document.body.style.overflow = open ? "hidden" : "";
}

function showToast(message) {
  toast.textContent = message;
  toast.hidden = false;
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => {
    toast.hidden = true;
  }, 2200);
}

function showPanel(name) {
  selectedMethod = name;

  methodCards.forEach((card) => {
    const selected =
      card.dataset.method === name || (name === "map" && card.dataset.method === "csv");
    card.classList.toggle("selected", selected);
    const existingMark = card.querySelector(".checkmark");

    if (selected && !existingMark) {
      const mark = document.createElement("span");
      mark.className = "checkmark";
      mark.textContent = "✓";
      card.append(mark);
    }

    if (!selected && existingMark) {
      existingMark.remove();
    }
  });

  panels.forEach((panel) => {
    const shouldShow = panel.dataset.panel === name;
    panel.hidden = !shouldShow;
  });

  if (importMethodPanel) {
    importMethodPanel.hidden = name === "map";
  }

  if (name === "webhook") {
    showToast("Inbound Webhook selected");
  }
}

function validateLinkedInUrl() {
  const value = urlInput.value.trim();
  const isValid = /^https:\/\/(www\.)?linkedin\.com\/.+/i.test(value);
  urlStatus.textContent = isValid
    ? "LinkedIn URL validated successfully."
    : "Please enter a valid LinkedIn URL.";
  urlStatus.style.color = isValid ? "var(--green)" : "var(--danger)";
  showToast(isValid ? "Validated successfully" : "Invalid LinkedIn URL");
}

function handleCsvFile(file) {
  if (file) {
    dropZone.querySelector("strong").textContent = file.name;
    dropZone.querySelector("small").textContent = "CSV uploaded. Map properties below.";
  }
  panels.forEach((panel) => {
    panel.hidden = panel.dataset.panel !== "map";
  });
  if (importMethodPanel) {
    importMethodPanel.hidden = true;
  }
  selectedMethod = "map";
  showToast(file ? "CSV uploaded" : "Map properties opened");
}

function openLookalikeModal() {
  modalEmpty.hidden = false;
  lookalikeListState.hidden = true;
  lookalikeModal.hidden = false;
  document.body.classList.add("modal-open");
  closeLookalikeModal.focus();
}

function showLookalikeListState() {
  modalEmpty.hidden = true;
  lookalikeListState.hidden = false;
  lookalikeOptions[0].focus();
}

function closeModal() {
  lookalikeModal.hidden = true;
  document.body.classList.remove("modal-open");
  nextButton.focus();
}

function moveNext() {
  const currentIndex = panelOrder.indexOf(selectedMethod);
  const nextMethod = panelOrder[Math.min(currentIndex + 1, panelOrder.length - 1)];

  if (selectedMethod === "csv") {
    handleCsvFile(csvInput.files[0]);
    return;
  }

  if (selectedMethod === "map") {
    showPanel("lists");
    return;
  }

  if (selectedMethod === "lists") {
    openLookalikeModal();
    return;
  }

  showPanel(nextMethod);
}

function setWorkflowTab(tab) {
  workflowTabs.forEach((button) => {
    button.classList.toggle("active", button.dataset.tab === tab);
  });
  showToast(`${tab[0].toUpperCase()}${tab.slice(1)} step selected`);
}

function showSenderProfiles() {
  builder.hidden = true;
  senderScreen.hidden = false;
  previousButton.hidden = false;
  submitButton.hidden = false;
  nextButton.hidden = true;
  workflowTabs.forEach((button) => {
    button.classList.toggle("active", button.dataset.tab === "sender");
  });
}

const savedTheme = localStorage.getItem("campaign-theme");
const preferredTheme = "light";
setTheme(savedTheme || preferredTheme);
showPanel(selectedMethod);

themeButtons.forEach((button) => {
  button.addEventListener("click", () => setTheme(button.dataset.themePick));
});

openNav.addEventListener("click", () => openSidebar(true));
closeNav.addEventListener("click", () => openSidebar(false));
mobileScrim.addEventListener("click", () => openSidebar(false));

methodCards.forEach((card) => {
  card.addEventListener("click", () => showPanel(card.dataset.method));
});

workflowTabs.forEach((button) => {
  button.addEventListener("click", () => setWorkflowTab(button.dataset.tab));
});

leadOptions.forEach((option) => {
  option.addEventListener("click", () => {
    leadOptions.forEach((item) => item.classList.remove("active"));
    option.classList.add("active");
    showToast(`${option.querySelector("strong").textContent} selected`);
  });
});

validateUrl.addEventListener("click", validateLinkedInUrl);
nextButton.addEventListener("click", moveNext);
closeLookalikeModal.addEventListener("click", closeModal);
lookalikeModal.addEventListener("click", (event) => {
  if (event.target === lookalikeModal) {
    closeModal();
  }
});
createLeadList.addEventListener("click", showLookalikeListState);
cancelLookalikeList.addEventListener("click", closeModal);
selectLookalikeList.addEventListener("click", () => {
  const selectedList = document.querySelector(".lookalike-option.selected strong").textContent;
  closeModal();
  showSenderProfiles();
  showToast(`${selectedList} selected`);
});

lookalikeOptions.forEach((option) => {
  option.addEventListener("click", () => {
    lookalikeOptions.forEach((item) => {
      item.classList.remove("selected");
      item.setAttribute("aria-checked", "false");
    });
    option.classList.add("selected");
    option.setAttribute("aria-checked", "true");
  });
});

csvInput.addEventListener("change", () => handleCsvFile(csvInput.files[0]));

["dragenter", "dragover"].forEach((eventName) => {
  dropZone.addEventListener(eventName, (event) => {
    event.preventDefault();
    dropZone.classList.add("dragging");
  });
});

["dragleave", "drop"].forEach((eventName) => {
  dropZone.addEventListener(eventName, (event) => {
    event.preventDefault();
    dropZone.classList.remove("dragging");
  });
});

dropZone.addEventListener("drop", (event) => {
  handleCsvFile(event.dataTransfer.files[0]);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (!lookalikeModal.hidden) {
      closeModal();
      return;
    }
    openSidebar(false);
  }
});
