const properties = [
  {
    id: 1,
    name: 'Royal Crest Villa',
    location: 'Bangalore, Karnataka',
    city: 'Bangalore',
    type: 'Villa',
    status: 'For Sale',
    bedrooms: 5,
    bathrooms: 5,
    area: 4000,
    priceLabel: '₹2.5 Cr',
    salePriceLakh: 250,
    image:
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 2,
    name: 'Skyline Heights',
    location: 'Bangalore, Karnataka',
    city: 'Bangalore',
    type: 'Apartment',
    status: 'For Rent',
    bedrooms: 3,
    bathrooms: 5,
    area: 4000,
    priceLabel: '₹45,000/month',
    rentMonthly: 45000,
    image:
      'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 3,
    name: 'Oakwood Residence',
    location: 'Bangalore, Karnataka',
    city: 'Bangalore',
    type: 'Villa',
    status: 'For Sale',
    bedrooms: 4,
    bathrooms: 5,
    area: 4000,
    priceLabel: '₹2.5 Cr',
    salePriceLakh: 250,
    image:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 4,
    name: 'Emerald Court',
    location: 'Bangalore, Karnataka',
    city: 'Bangalore',
    type: 'Apartment',
    status: 'For Rent',
    bedrooms: 1,
    bathrooms: 1,
    area: 750,
    priceLabel: '₹20,000/month',
    rentMonthly: 20000,
    image:
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80'
  }
];

const propertyGrid = document.getElementById('propertyGrid');
const emptyState = document.getElementById('emptyState');
const propertyCount = document.getElementById('propertyCount');
const favoritesToggle = document.getElementById('favoritesToggle');
const favCount = document.getElementById('favCount');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const form = document.getElementById('propertySearch');
const locationInput = document.getElementById('locationInput');
const typeSelect = document.getElementById('typeSelect');
const priceSelect = document.getElementById('priceSelect');
const bedroomSelect = document.getElementById('bedroomSelect');
const viewAllBtn = document.getElementById('viewAllProperties');
const currentYear = document.getElementById('currentYear');
const authModal = document.getElementById('authModal');
const propertyModal = document.getElementById('propertyModal');
const propertyModalContent = document.getElementById('propertyModalContent');
const categoryButtons = document.querySelectorAll('.category-card');

const FAVORITES_STORAGE_KEY = 'homeNestFavoriteIds';

function getStoredFavoriteIds() {
  try {
    const saved = JSON.parse(localStorage.getItem(FAVORITES_STORAGE_KEY) || '[]');
    return new Set(Array.isArray(saved) ? saved.map(Number) : []);
  } catch (error) {
    return new Set();
  }
}

function persistFavoriteIds() {
  localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify([...favoriteIds]));
}

const favoriteIds = getStoredFavoriteIds();
let showFavoritesOnly = false;
let selectedCategory = '';

function formatFavoriteCount() {
  if (favCount) {
    favCount.textContent = favoriteIds.size;
  }
}

function getPriceMatches(property, selectedRange) {
  if (selectedRange === 'any') return true;

  if (property.status === 'For Sale') {
    const price = Number(property.salePriceLakh);
    const ranges = {
      'under-1cr': price < 100,
      '1-2cr': price >= 100 && price <= 200,
      '2-3cr': price > 200 && price <= 300,
      '3cr-plus': price > 300
    };
    return ranges[selectedRange] ?? true;
  }

  const price = Number(property.rentMonthly);
  const ranges = {
    'under-25k': price < 25000,
    '25k-50k': price >= 25000 && price <= 50000,
    '50k-75k': price > 50000 && price <= 75000,
    '75k-plus': price > 75000
  };

  return ranges[selectedRange] ?? true;
}

function filterProperties() {
  if (!locationInput || !typeSelect || !priceSelect || !bedroomSelect) {
    return properties;
  }

  const locationValue = locationInput.value.trim().toLowerCase();
  const typeValue = typeSelect.value;
  const priceValue = priceSelect.value;
  const bedroomValue = bedroomSelect.value;

  return properties.filter((property) => {
    const matchesLocation =
      !locationValue ||
      property.location.toLowerCase().includes(locationValue) ||
      property.city.toLowerCase().includes(locationValue);

    const matchesType = typeValue === 'any' || property.type === typeValue;
    const matchesCategory = !selectedCategory || property.type === selectedCategory;
    const matchesPrice = getPriceMatches(property, priceValue);
    const matchesBedrooms =
      bedroomValue === 'any' || Number(property.bedrooms) >= Number(bedroomValue);
    const matchesFavorites = !showFavoritesOnly || favoriteIds.has(property.id);

    return (
      matchesLocation &&
      matchesType &&
      matchesCategory &&
      matchesPrice &&
      matchesBedrooms &&
      matchesFavorites
    );
  });
}

function createPropertyCard(property) {
  const card = document.createElement('article');
  card.className = 'property-card';
  card.innerHTML = `
    <div class="property-image-wrap">
      <img src="${property.image}" alt="${property.name}" />
      <span class="status-badge ${property.status === 'For Sale' ? 'sale' : 'rent'}">${property.status}</span>
      <button type="button" class="favorite-button ${favoriteIds.has(property.id) ? 'active' : ''}" data-property-id="${property.id}" aria-label="Save ${property.name}">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21.35 10.55 20C5.4 15.36 2 12.28 2 8.5A4.5 4.5 0 0 1 6.5 4c1.74 0 3.41.81 4.5 2.09A6.09 6.09 0 0 1 15.5 4 4.5 4.5 0 0 1 20 8.5c0 3.78-3.4 6.86-8.55 11.5L12 21.35Z"/></svg>
      </button>
    </div>
    <div class="property-content">
      <div class="property-meta">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a7 7 0 0 1 7 7c0 5.25-7 13-7 13S5 14.25 5 9a7 7 0 0 1 7-7Zm0 9.5A2.5 2.5 0 1 0 12 6a2.5 2.5 0 0 0 0 5.5Z"/></svg>
        <span>${property.location}</span>
      </div>
      <h3 class="property-name">${property.name}</h3>
      <div class="property-detail-list">
        <div class="property-detail-item">
          <span>Bedrooms</span>
          <strong>${property.bedrooms}</strong>
        </div>
        <div class="property-detail-item">
          <span>Bathrooms</span>
          <strong>${property.bathrooms}</strong>
        </div>
        <div class="property-detail-item">
          <span>Area</span>
          <strong>${property.area.toLocaleString()} sqft</strong>
        </div>
      </div>
      <div class="property-footer">
        <span class="property-price">${property.priceLabel}</span>
        <button type="button" class="property-arrow" data-property-id="${property.id}" aria-label="View details for ${property.name}">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.172 12 8.222 7.05 9.636 5.636l6.364 6.364-6.364 6.364-1.414-1.414L13.172 12Z"/></svg>
        </button>
      </div>
    </div>
  `;

  const favoriteButton = card.querySelector('.favorite-button');
  favoriteButton.addEventListener('click', () => toggleFavorite(property.id));

  const propertyArrow = card.querySelector('.property-arrow');
  propertyArrow.addEventListener('click', () => {
    window.location.href = `property-details.html?id=${property.id}`;
  });

  return card;
}

function updatePropertyCount(numberOfProperties) {
  if (!propertyCount) return;
  const label = selectedCategory ? `${selectedCategory} properties` : 'properties';
  propertyCount.textContent = `Showing ${numberOfProperties} ${label}`;
}

function renderProperties() {
  if (!propertyGrid || !emptyState || !propertyCount) return;
  const filtered = filterProperties();
  propertyGrid.innerHTML = '';

  if (!filtered.length) {
    emptyState.hidden = false;
    const friendlyMessage = selectedCategory
      ? `No properties are available for ${selectedCategory} right now. Try another category or view all properties.`
      : 'No properties match the selected filters.';
    emptyState.textContent = friendlyMessage;
    updatePropertyCount(0);
    return;
  }

  emptyState.hidden = true;
  updatePropertyCount(filtered.length);
  filtered.forEach((property) => propertyGrid.appendChild(createPropertyCard(property)));
}

function toggleFavorite(id) {
  if (favoriteIds.has(id)) {
    favoriteIds.delete(id);
  } else {
    favoriteIds.add(id);
  }

  persistFavoriteIds();
  formatFavoriteCount();
  renderProperties();
}

function setFavoritesOnly(flag) {
  showFavoritesOnly = flag;
  favoritesToggle.classList.toggle('active', flag);
  renderProperties();
}

function openModal(modal) {
  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden', 'false');
}

function closeModal(modal) {
  modal.classList.add('hidden');
  modal.setAttribute('aria-hidden', 'true');
}

function openPropertyModal(property) {
  propertyModalContent.innerHTML = `
    <div class="property-modal-image">
      <img src="${property.image}" alt="${property.name}" />
    </div>
    <div class="property-modal-copy">
      <span class="status-badge ${property.status === 'For Sale' ? 'sale' : 'rent'}">${property.status}</span>
      <h3 id="propertyModalTitle">${property.name}</h3>
      <div class="price">${property.priceLabel}</div>
      <div class="meta">
        <span>${property.location}</span>
        <span>${property.area.toLocaleString()} sqft</span>
      </div>
      <ul>
        <li>${property.bedrooms} bedrooms</li>
        <li>${property.bathrooms} bathrooms</li>
        <li>${property.type}</li>
      </ul>
      <p>Perfect for buyers and renters looking for a refined and comfortable lifestyle in a highly desirable neighborhood.</p>
      <button type="button" class="btn btn-primary">Schedule a Tour</button>
    </div>
  `;
  openModal(propertyModal);
}

function resetFilters() {
  locationInput.value = '';
  typeSelect.value = 'any';
  priceSelect.value = 'any';
  bedroomSelect.value = 'any';
  showFavoritesOnly = false;
  selectedCategory = '';
  if (favoritesToggle) favoritesToggle.classList.remove('active');
  if (categoryButtons.length) {
    categoryButtons.forEach((button) => button.classList.remove('active'));
  }
  renderProperties();
}

function setupAuthForms() {
  const tabs = document.querySelectorAll('.auth-tab');
  const forms = {
    login: document.getElementById('loginForm'),
    signup: document.getElementById('signupForm')
  };

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const selected = tab.dataset.authTab;
      tabs.forEach((item) => {
        const isActive = item === tab;
        item.classList.toggle('active', isActive);
        item.setAttribute('aria-selected', String(isActive));
      });

      forms.login.classList.toggle('active', selected === 'login');
      forms.signup.classList.toggle('active', selected === 'signup');
    });
  });

  forms.login.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!forms.login.checkValidity()) {
      forms.login.reportValidity();
      return;
    }
    alert('Frontend demo: login submitted successfully without a backend connection.');
    closeModal(authModal);
    forms.login.reset();
  });

  forms.signup.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!forms.signup.checkValidity()) {
      forms.signup.reportValidity();
      return;
    }
    alert('Frontend demo: account created successfully without a backend connection.');
    closeModal(authModal);
    forms.signup.reset();
  });
}

if (form) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    renderProperties();
  });
}

if (categoryButtons.length) {
  categoryButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const category = button.dataset.category;
      selectedCategory = category === selectedCategory ? '' : category;
      categoryButtons.forEach((item) => item.classList.toggle('active', item === button && Boolean(selectedCategory)));
      const featuredSection = document.getElementById('properties');
      if (featuredSection) featuredSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      renderProperties();
    });
  });
}

if (favoritesToggle) {
  favoritesToggle.addEventListener('click', () => setFavoritesOnly(!showFavoritesOnly));
}

if (viewAllBtn) {
  viewAllBtn.addEventListener('click', resetFilters);
}

if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    const spans = navToggle.querySelectorAll('span');
    spans[0].style.transform = navMenu.classList.contains('active') ? 'rotate(45deg) translate(4px, 4px)' : 'none';
    spans[1].style.opacity = navMenu.classList.contains('active') ? '0' : '1';
    spans[2].style.transform = navMenu.classList.contains('active') ? 'rotate(-45deg) translate(4px, -4px)' : 'none';
  });
}

if (navLinks.length) {
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.forEach((item) => item.classList.remove('active'));
      link.classList.add('active');
      if (navMenu) navMenu.classList.remove('active');
      if (navToggle) {
        const spans = navToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    });
  });
}

[...document.querySelectorAll('[data-modal]')].forEach((trigger) => {
  trigger.addEventListener('click', () => openModal(authModal));
});

[...document.querySelectorAll('[data-close]')].forEach((button) => {
  button.addEventListener('click', () => {
    const targetId = button.dataset.close;
    const modal = document.getElementById(targetId);
    if (modal) closeModal(modal);
  });
});

if (authModal) {
  authModal.addEventListener('click', (event) => {
    if (event.target === authModal) closeModal(authModal);
  });
}

if (propertyModal) {
  propertyModal.addEventListener('click', (event) => {
    if (event.target === propertyModal) closeModal(propertyModal);
  });
}

function initPropertyDetailsPage() {
  const propertyId = Number(new URLSearchParams(window.location.search).get('id')) || 1;
  const property = {
    id: propertyId,
    name: 'Luxury 3 BHK Villa',
    location: 'Whitefield, Bangalore',
    type: 'Villa',
    status: 'For Rent',
    bedrooms: 3,
    bathrooms: 3,
    area: 2400,
    price: '₹25,000/month',
    rentAmount: 25000,
    primaryImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80'
    ]
  };

  const mainImage = document.getElementById('propertyMainImage');
  const thumbRow = document.getElementById('propertyThumbs');
  const previewModal = document.getElementById('imagePreviewModal');
  const previewImage = document.getElementById('previewImage');
  const tabs = document.querySelectorAll('.details-tab');
  const tabPanels = {
    overview: document.getElementById('tabOverview'),
    location: document.getElementById('tabLocation'),
    amenities: document.getElementById('tabAmenities'),
    reviews: document.getElementById('tabReviews')
  };

  const renderGallery = () => {
    mainImage.src = property.gallery[0];
    thumbRow.innerHTML = property.gallery
      .map((image, index) => {
        const isLast = index === property.gallery.length - 1;
        return `
          <button type="button" class="thumb ${index === 0 ? 'active' : ''}" data-index="${index}" aria-label="View property image ${index + 1}">
            <img src="${image}" alt="Property view ${index + 1}" />
            ${isLast ? '<span class="thumb-overlay">+12</span>' : ''}
          </button>
        `;
      })
      .join('');

    thumbRow.querySelectorAll('.thumb').forEach((thumb) => {
      thumb.addEventListener('click', () => {
        const index = Number(thumb.dataset.index);
        mainImage.src = property.gallery[index];
        thumbRow.querySelectorAll('.thumb').forEach((item) => item.classList.toggle('active', item === thumb));
      });
    });
  };

  const setActiveTab = (key) => {
    tabs.forEach((tab) => tab.classList.toggle('active', tab.dataset.tab === key));
    Object.entries(tabPanels).forEach(([name, panel]) => {
      panel.hidden = name !== key;
    });
  };

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => setActiveTab(tab.dataset.tab));
  });

  mainImage.addEventListener('click', () => {
    previewImage.src = mainImage.src;
    openModal(previewModal);
  });

  previewModal.addEventListener('click', (event) => {
    if (event.target === previewModal) closeModal(previewModal);
  });

  document.querySelectorAll('[data-close]').forEach((button) => {
    button.addEventListener('click', () => {
      const targetId = button.dataset.close;
      const modal = document.getElementById(targetId);
      if (modal) closeModal(modal);
    });
  });

  const bookingModal = document.getElementById('bookingModal');
  const visitModal = document.getElementById('visitModal');
  const contactModal = document.getElementById('contactModal');

  const showDemoMessage = (selector, message) => {
    const node = document.querySelector(selector);
    if (node) {
      node.textContent = message;
      node.hidden = false;
      setTimeout(() => {
        node.hidden = true;
      }, 3500);
    }
  };

  document.getElementById('bookNowBtn').addEventListener('click', () => {
    const bookingQuery = new URLSearchParams({
      propertyId: String(propertyId),
      name: property.name,
      type: property.type,
      location: property.location,
      bedrooms: String(property.bedrooms),
      bathrooms: String(property.bathrooms),
      area: String(property.area),
      price: String(property.rentAmount || 25000)
    }).toString();
    window.location.href = `booking.html?${bookingQuery}`;
  });
  document.getElementById('scheduleVisitBtn').addEventListener('click', () => openModal(visitModal));
  document.getElementById('contactManagerBtn').addEventListener('click', () => openModal(contactModal));

  document.getElementById('bookingForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const formData = new FormData(form);
    showDemoMessage('#bookingSuccess', `Booking request submitted for ${formData.get('bookingName')}. Demo confirmation only.`);
    form.reset();
    closeModal(bookingModal);
  });

  document.getElementById('visitForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const formData = new FormData(form);
    showDemoMessage('#visitSuccess', `Visit scheduled for ${formData.get('visitDate')} at ${formData.get('visitTime')}. Demo confirmation only.`);
    form.reset();
    closeModal(visitModal);
  });

  document.getElementById('contactForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const formData = new FormData(form);
    showDemoMessage('#contactSuccess', `Demo contact request sent to Riya Sharma for ${formData.get('contactName')}.`);
    form.reset();
    closeModal(contactModal);
  });

  document.getElementById('reviewForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const formData = new FormData(form);
    const reviewName = formData.get('reviewName') || 'Guest';
    const reviewText = formData.get('reviewText') || 'Sample review';
    showDemoMessage('#reviewSuccess', `Sample review submitted by ${reviewName}. Demo content only.`);
    form.reset();
  });

  const pageTitle = document.getElementById('pagePropertyTitle');
  if (pageTitle) {
    pageTitle.textContent = property.name;
  }

  const detailPrice = document.getElementById('detailPrice');
  if (detailPrice) {
    detailPrice.textContent = property.price;
  }

  renderGallery();
  setActiveTab('overview');
}

if (typeof setupAuthForms === 'function') {
  setupAuthForms();
}
if (favCount) {
  formatFavoriteCount();
}
if (propertyGrid && emptyState && propertyCount) {
  renderProperties();
}

function createBookingPropertyFromQuery() {
  const params = new URLSearchParams(window.location.search);
  const propertyId = Number(params.get('propertyId')) || 1;
  return {
    id: propertyId,
    name: params.get('name') || 'Luxury 3 BHK Villa',
    type: params.get('type') || 'Villa',
    location: params.get('location') || 'Whitefield, Bangalore',
    bedrooms: Number(params.get('bedrooms')) || 3,
    bathrooms: Number(params.get('bathrooms')) || 3,
    area: Number(params.get('area')) || 2400,
    price: Number(params.get('price')) || 25000,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
  };
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}

function addDays(dateValue, days) {
  const nextDate = new Date(dateValue);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
}

function toDateInputValue(dateValue) {
  const year = dateValue.getFullYear();
  const month = String(dateValue.getMonth() + 1).padStart(2, '0');
  const day = String(dateValue.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function calculateRentalDuration(startDate, endDate) {
  const diff = Math.max(0, Math.round((endDate - startDate) / (1000 * 60 * 60 * 24)));
  if (diff <= 0) return { days: 0, months: 0, label: '0 days' };

  const months = Math.max(1, Math.round(diff / 30));
  const label = months === 1 ? '1 month' : `${months} months`;
  return { days: diff, months, label };
}

function initBookingPage() {
  const property = createBookingPropertyFromQuery();
  const checkinInput = document.getElementById('checkinDate');
  const checkoutInput = document.getElementById('checkoutDate');
  const guestNameInput = document.getElementById('guestName');
  const guestPhoneInput = document.getElementById('guestPhone');
  const proceedButton = document.getElementById('proceedPaymentBtn');
  const backButton = document.getElementById('backToBookingBtn');
  const payNowButton = document.getElementById('payNowBtn');
  const bookingView = document.getElementById('bookingDetailsView');
  const paymentView = document.getElementById('paymentView');
  const confirmationView = document.getElementById('confirmationView');
  const propertySummaryName = document.getElementById('bookingPropertyName');
  const propertySummaryLocation = document.getElementById('bookingPropertyLocation');
  const summaryAvailableFrom = document.getElementById('summaryAvailableFrom');
  const summaryLeaveDuration = document.getElementById('summaryLeaveDuration');
  const monthlyRentValue = document.getElementById('monthlyRentValue');
  const securityDepositValue = document.getElementById('securityDepositValue');
  const serviceFeeValue = document.getElementById('serviceFeeValue');
  const totalPayableValue = document.getElementById('totalPayableValue');
  const rentalDurationValue = document.getElementById('rentalDurationValue');
  const paymentSummaryTitle = document.getElementById('paymentSummaryTitle');
  const paymentSummaryDates = document.getElementById('paymentSummaryDates');
  const paymentSummaryDuration = document.getElementById('paymentSummaryDuration');
  const paymentSummaryTotal = document.getElementById('paymentSummaryTotal');
  const bookingReference = document.getElementById('bookingReference');
  const confirmationSummaryTitle = document.getElementById('confirmationSummaryTitle');
  const confirmationSummaryDates = document.getElementById('confirmationSummaryDates');
  const confirmationSummaryDuration = document.getElementById('confirmationSummaryDuration');
  const confirmationSummaryTotal = document.getElementById('confirmationSummaryTotal');
  const propertyImage = document.getElementById('bookingPropertyImage');

  const securityDeposit = 250000;
  const serviceFee = 5000;
  const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
  const activeStepEls = document.querySelectorAll('.progress-step');

  function updateProgress(stepName) {
    activeStepEls.forEach((step) => {
      const isActive = step.dataset.step === stepName;
      step.classList.toggle('active', isActive);
      step.classList.toggle('complete', step.dataset.step === 'details' && stepName !== 'details');
    });
  }

  function showView(view) {
    if (bookingView) bookingView.classList.toggle('hidden', view !== 'details');
    if (paymentView) paymentView.classList.toggle('hidden', view !== 'payment');
    if (confirmationView) confirmationView.classList.toggle('hidden', view !== 'confirmation');
  }

  function setDefaultDates() {
    const today = new Date();
    const checkinDate = new Date(today);
    const checkoutDate = addDays(checkinDate, 30);
    checkinInput.value = toDateInputValue(checkinDate);
    checkoutInput.value = toDateInputValue(checkoutDate);
  }

  function getDurationText() {
    const start = checkinInput.value ? new Date(checkinInput.value) : new Date();
    const end = checkoutInput.value ? new Date(checkoutInput.value) : addDays(start, 30);
    const duration = calculateRentalDuration(start, end);
    return duration.label;
  }

  function renderPropertyCard() {
    if (propertyImage) propertyImage.src = property.image;
    if (propertySummaryName) propertySummaryName.textContent = property.name;
    if (propertySummaryLocation) propertySummaryLocation.textContent = property.location;
  }

  function updateBookingSummary() {
    const checkin = checkinInput.value ? new Date(checkinInput.value) : new Date();
    const checkout = checkoutInput.value ? new Date(checkoutInput.value) : addDays(checkin, 30);
    const duration = calculateRentalDuration(checkin, checkout);
    const monthlyRent = property.price;
    const total = monthlyRent * duration.months + securityDeposit + serviceFee;

    if (summaryAvailableFrom) summaryAvailableFrom.textContent = checkinInput.value || '—';
    if (summaryLeaveDuration) summaryLeaveDuration.textContent = duration.label;
    if (monthlyRentValue) monthlyRentValue.textContent = formatCurrency(monthlyRent);
    if (securityDepositValue) securityDepositValue.textContent = formatCurrency(securityDeposit);
    if (serviceFeeValue) serviceFeeValue.textContent = formatCurrency(serviceFee);
    if (totalPayableValue) totalPayableValue.textContent = formatCurrency(total);
    if (rentalDurationValue) rentalDurationValue.textContent = duration.label;

    if (paymentSummaryTitle) paymentSummaryTitle.textContent = property.name;
    if (paymentSummaryDates) paymentSummaryDates.textContent = `${checkinInput.value || '—'} to ${checkoutInput.value || '—'}`;
    if (paymentSummaryDuration) paymentSummaryDuration.textContent = duration.label;
    if (paymentSummaryTotal) paymentSummaryTotal.textContent = formatCurrency(total);

    if (confirmationSummaryTitle) confirmationSummaryTitle.textContent = property.name;
    if (confirmationSummaryDates) confirmationSummaryDates.textContent = `${checkinInput.value || '—'} to ${checkoutInput.value || '—'}`;
    if (confirmationSummaryDuration) confirmationSummaryDuration.textContent = duration.label;
    if (confirmationSummaryTotal) confirmationSummaryTotal.textContent = formatCurrency(total);

    const durationText = duration.label;
    const durationDisplay = document.getElementById('durationInfo');
    if (durationDisplay) {
      durationDisplay.textContent = `Duration: ${durationText}`;
    }
  }

  function setCheckoutMin() {
    if (!checkinInput.value) return;
    checkoutInput.min = checkinInput.value;
    if (!checkoutInput.value || new Date(checkoutInput.value) <= new Date(checkinInput.value)) {
      const nextCheckout = addDays(new Date(checkinInput.value), 1);
      checkoutInput.value = toDateInputValue(nextCheckout);
    }
  }

  function setError(fieldId, message) {
    const node = document.getElementById(fieldId);
    if (node) {
      node.textContent = message || '';
    }
  }

  function validateBookingForm() {
    let valid = true;

    if (!checkinInput.value) {
      setError('checkinError', 'Please select a check-in date.');
      valid = false;
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selectedDate = new Date(checkinInput.value);
      if (selectedDate < today) {
        setError('checkinError', 'Check-in date cannot be earlier than today.');
        valid = false;
      } else {
        setError('checkinError', '');
      }
    }

    if (!checkoutInput.value) {
      setError('checkoutError', 'Please select a checkout date.');
      valid = false;
    } else if (checkinInput.value && new Date(checkoutInput.value) <= new Date(checkinInput.value)) {
      setError('checkoutError', 'Checkout must be after the check-in date.');
      valid = false;
    } else {
      setError('checkoutError', '');
    }

    const guestName = guestNameInput.value.trim();
    if (guestName) {
      if (guestName.length < 2) {
        setError('guestNameError', 'Please enter a valid guest name.');
        valid = false;
      } else {
        setError('guestNameError', '');
      }
    } else {
      setError('guestNameError', '');
    }

    const phoneValue = guestPhoneInput.value.trim();
    if (phoneValue) {
      const phonePattern = /^[6-9]\d{9}$/;
      if (!phonePattern.test(phoneValue)) {
        setError('guestPhoneError', 'Enter a valid 10-digit phone number.');
        valid = false;
      } else {
        setError('guestPhoneError', '');
      }
    } else {
      setError('guestPhoneError', '');
    }

    return valid;
  }

  function proceedToPayment() {
    if (!validateBookingForm()) {
      return;
    }

    updateProgress('payment');
    showView('payment');
    updateBookingSummary();
  }

  function finalizeBooking() {
    updateProgress('confirmation');
    showView('confirmation');
    const ref = `HN-${Math.floor(100000 + Math.random() * 900000)}`;
    if (bookingReference) bookingReference.textContent = ref;
  }

  if (checkinInput) {
    checkinInput.min = toDateInputValue(new Date());
    checkinInput.addEventListener('change', () => {
      setCheckoutMin();
      updateBookingSummary();
    });
  }

  if (checkoutInput) {
    checkoutInput.addEventListener('change', () => {
      updateBookingSummary();
    });
  }

  if (guestNameInput) {
    guestNameInput.addEventListener('blur', validateBookingForm);
  }

  if (guestPhoneInput) {
    guestPhoneInput.addEventListener('blur', validateBookingForm);
  }

  if (proceedButton) {
    proceedButton.addEventListener('click', proceedToPayment);
  }

  if (backButton) {
    backButton.addEventListener('click', () => {
      updateProgress('details');
      showView('details');
    });
  }

  if (payNowButton) {
    payNowButton.addEventListener('click', () => {
      const selectedMethod = document.querySelector('input[name="paymentMethod"]:checked');
      if (!selectedMethod) {
        const paymentNote = document.getElementById('paymentMethodError');
        if (paymentNote) paymentNote.textContent = 'Please select a payment method.';
        return;
      }
      const paymentNote = document.getElementById('paymentMethodError');
      if (paymentNote) paymentNote.textContent = '';
      alert('Demo payment successful. This is a frontend-only demonstration and no real payment has been processed.');
      finalizeBooking();
    });
  }

  paymentMethods.forEach((method) => {
    method.addEventListener('change', () => {
      const paymentNote = document.getElementById('paymentMethodError');
      if (paymentNote) paymentNote.textContent = '';
    });
  });

  renderPropertyCard();
  setDefaultDates();
  setCheckoutMin();
  updateProgress('details');
  showView('details');
  updateBookingSummary();
}

if (document.body.dataset.page === 'property-details') {
  initPropertyDetailsPage();
} else if (document.body.dataset.page === 'booking') {
  initBookingPage();
}
