const dashboardProperties = [
  {
    id: 1,
    name: 'Royal Crest Villa',
    location: 'Bangalore, Karnataka',
    type: 'Villa',
    bedrooms: 5,
    bathrooms: 5,
    area: 4000,
    priceLabel: '₹2.5 Cr',
    image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 2,
    name: 'Skyline Heights',
    location: 'Bangalore, Karnataka',
    type: 'Apartment',
    bedrooms: 3,
    bathrooms: 5,
    area: 4000,
    priceLabel: '₹45,000/month',
    image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 3,
    name: 'Oakwood Residence',
    location: 'Bangalore, Karnataka',
    type: 'Villa',
    bedrooms: 4,
    bathrooms: 5,
    area: 4000,
    priceLabel: '₹2.5 Cr',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 4,
    name: 'Emerald Court',
    location: 'Bangalore, Karnataka',
    type: 'Apartment',
    bedrooms: 1,
    bathrooms: 1,
    area: 750,
    priceLabel: '₹20,000/month',
    image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80'
  }
];

const FAVORITES_STORAGE_KEY = 'homeNestFavoriteIds';
const PROFILE_STORAGE_KEY = 'homeNestProfileData';
const MESSAGES_STORAGE_KEY = 'homeNestMessagesData';
const SETTINGS_STORAGE_KEY = 'homeNestSettingsData';
const AUTH_SESSION_KEY = 'homeNestIsLoggedIn';

function isAuthenticated() {
  return localStorage.getItem(AUTH_SESSION_KEY) === 'true';
}

function ensureDashboardAccess() {
  const isDashboardPage = window.location.pathname.endsWith('/dashboard.html') || window.location.pathname.endsWith('dashboard.html');
  const isProtectedDashboardPage = ['dashboard.html', 'my-bookings.html', 'favorites.html', 'profile.html', 'messages.html', 'settings.html'].some((name) => window.location.pathname.endsWith(name));

  if (isProtectedDashboardPage && !isAuthenticated()) {
    window.location.href = 'login.html';
    return false;
  }

  if (window.location.pathname.endsWith('/login.html') || window.location.pathname.endsWith('login.html')) {
    if (isAuthenticated()) {
      window.location.href = 'dashboard.html';
      return false;
    }
  }

  if (isDashboardPage && !isAuthenticated()) {
    window.location.href = 'login.html';
    return false;
  }

  return true;
}

function logoutDashboardSession() {
  localStorage.setItem(AUTH_SESSION_KEY, 'false');
  window.location.href = 'login.html';
}

function getStoredFavoriteIds() {
  try {
    const saved = JSON.parse(localStorage.getItem(FAVORITES_STORAGE_KEY) || '[]');
    return new Set(Array.isArray(saved) ? saved.map(Number) : []);
  } catch (error) {
    return new Set();
  }
}

function saveFavoriteIds(ids) {
  localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify([...ids]));
}

function getFavoriteProperties() {
  const savedIds = getStoredFavoriteIds();
  return dashboardProperties.filter((property) => savedIds.has(property.id));
}

function getPageName() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  return page.replace('.html', '');
}

function initSidebarState() {
  const current = getPageName();
  document.querySelectorAll('.nav-item').forEach((item) => {
    const page = item.dataset.page || '';
    item.classList.toggle('active', page === current || (current === 'index' && page === 'index'));
  });
}

function updateHeaderFavoriteCount() {
  const countEl = document.querySelector('[data-favorites-count]');
  if (!countEl) return;
  countEl.textContent = getStoredFavoriteIds().size;
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function getProfileData() {
  const defaults = {
    fullName: 'Ada Thompson',
    email: 'ada.thompson@example.com',
    mobile: '+91 98765 43210',
    accountType: 'Premium Buyer',
    memberSince: 'June 2022',
    dob: '1993-05-18',
    gender: 'Female',
    address: 'Bangalore, Karnataka'
  };

  try {
    const saved = JSON.parse(localStorage.getItem(PROFILE_STORAGE_KEY) || '{}');
    return { ...defaults, ...saved };
  } catch (error) {
    return { ...defaults };
  }
}

function saveProfileData(profile) {
  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
}

function getSettingsData() {
  const defaults = {
    language: 'English',
    currency: 'INR',
    notifications: {
      bookingUpdates: true,
      propertyRecommendations: true,
      messageNotifications: true,
      promotionalOffers: false
    }
  };

  try {
    const saved = JSON.parse(localStorage.getItem(SETTINGS_STORAGE_KEY) || '{}');
    return { ...defaults, ...saved, notifications: { ...defaults.notifications, ...(saved.notifications || {}) } };
  } catch (error) {
    return { ...defaults };
  }
}

function saveSettingsData(settings) {
  localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
}

function getDefaultMessages() {
  return [
    {
      id: 'mgr-1',
      name: 'Aisha Patel',
      title: 'Property Manager',
      property: 'Royal Crest Villa',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
      unread: 2,
      messages: [
        { sender: 'them', text: 'Hi Ada! The villa is still available for a private tour this weekend.', time: '09:42 AM' },
        { sender: 'me', text: 'Great, I would love to schedule a visit on Saturday morning.', time: '09:48 AM' },
        { sender: 'them', text: 'Perfect. I have sent the schedule details and pricing summary.', time: '09:50 AM' }
      ]
    },
    {
      id: 'mgr-2',
      name: 'Rahul Nair',
      title: 'Senior Advisor',
      property: 'Skyline Heights',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
      unread: 0,
      messages: [
        { sender: 'them', text: 'Your application for the apartment has been reviewed.', time: 'Yesterday' },
        { sender: 'me', text: 'Thanks! Please let me know the next steps.', time: 'Yesterday' },
        { sender: 'them', text: 'We will reach out with the document checklist shortly.', time: 'Yesterday' }
      ]
    },
    {
      id: 'mgr-3',
      name: 'Jasmine Lee',
      title: 'Client Success',
      property: 'Emerald Court',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=300&q=80',
      unread: 1,
      messages: [
        { sender: 'them', text: 'We found a great match based on your preferences.', time: 'Mon' },
        { sender: 'me', text: 'That sounds promising. Please share the details.', time: 'Mon' }
      ]
    }
  ];
}

function getMessagesData() {
  try {
    const saved = JSON.parse(localStorage.getItem(MESSAGES_STORAGE_KEY) || 'null');
    if (Array.isArray(saved) && saved.length) return saved;
  } catch (error) {}
  const defaultMessages = getDefaultMessages();
  localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(defaultMessages));
  return defaultMessages;
}

function saveMessagesData(messages) {
  localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(messages));
}

function formatTime(date = new Date()) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

document.addEventListener('DOMContentLoaded', () => {
  ensureDashboardAccess();
  initSidebarState();
  updateHeaderFavoriteCount();

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', logoutDashboardSession);
  }
});
