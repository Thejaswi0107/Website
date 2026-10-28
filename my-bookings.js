const bookingData = [
  {
    id: 1,
    title: 'Skyline Haven Villa',
    location: 'Beverly Hills, California',
    status: 'upcoming',
    startDate: '2026-11-14',
    endDate: '2026-11-20',
    guests: 4,
    price: 2850,
    cover: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
    type: 'Entire villa',
    nights: 6,
    bookingRef: 'HN-104728',
    description: 'A contemporary villa featuring panoramic city views, an infinity plunge pool, and a private garden designed for serene luxury stays.'
  },
  {
    id: 2,
    title: 'Harbor View Loft',
    location: 'Miami Beach, Florida',
    status: 'upcoming',
    startDate: '2026-12-03',
    endDate: '2026-12-07',
    guests: 2,
    price: 1640,
    cover: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80',
    image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80',
    type: 'Penthouse apartment',
    nights: 4,
    bookingRef: 'HN-809312',
    description: 'A breezy waterfront loft with polished oak finishes, balcony sunsets, and direct access to the marina promenade.'
  },
  {
    id: 3,
    title: 'Cedar Crest House',
    location: 'Austin, Texas',
    status: 'past',
    startDate: '2026-04-16',
    endDate: '2026-04-22',
    guests: 3,
    price: 2050,
    cover: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80',
    image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80',
    type: 'Townhouse',
    nights: 6,
    bookingRef: 'HN-647914',
    description: 'A warm family home with courtyard seating, a modern kitchen, and a leafy neighborhood ambiance perfect for relaxed weekends.'
  },
  {
    id: 4,
    title: 'Sunset Point Condo',
    location: 'San Diego, California',
    status: 'past',
    startDate: '2026-08-09',
    endDate: '2026-08-13',
    guests: 2,
    price: 1485,
    cover: 'https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1200&q=80',
    image: 'https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1200&q=80',
    type: 'Condo',
    nights: 4,
    bookingRef: 'HN-335188',
    description: 'This airy condo offers sunset-view terraces, resort-style amenities, and thoughtful interiors for a laid-back coastal stay.'
  },
  {
    id: 5,
    title: 'The Linden Retreat',
    location: 'Aspen, Colorado',
    status: 'past',
    startDate: '2025-12-18',
    endDate: '2025-12-24',
    guests: 5,
    price: 3120,
    cover: 'https://images.unsplash.com/photo-1448630360428-65456885c650?auto=format&fit=crop&w=1200&q=80',
    image: 'https://images.unsplash.com/photo-1448630360428-65456885c650?auto=format&fit=crop&w=1200&q=80',
    type: 'Mountain chalet',
    nights: 6,
    bookingRef: 'HN-221439',
    description: 'A rustic-luxe alpine escape complete with scenic terraces, wood-burning accents, and spectacular snow views.'
  },
  {
    id: 6,
    title: 'Terra Nova House',
    location: 'Seattle, Washington',
    status: 'cancelled',
    startDate: '2027-01-21',
    endDate: '2027-01-27',
    guests: 3,
    price: 2190,
    cover: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    type: 'Modern family home',
    nights: 6,
    bookingRef: 'HN-119433',
    description: 'A thoughtful, design-forward residence with warm cedar tones, a quiet reading room, and a generous entertainment deck.'
  }
];

const statusLabels = {
  upcoming: 'Upcoming',
  past: 'Past',
  cancelled: 'Cancelled'
};

const listEl = document.getElementById('bookingList');
const emptyStateEl = document.getElementById('bookingEmptyState');
const modalEl = document.getElementById('bookingDetailModal');
const modalBodyEl = document.getElementById('bookingModalBody');
const tabButtons = document.querySelectorAll('.booking-tab');

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value);
}

function formatDate(dateString) {
  if (!dateString) return '—';
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

function renderTabs() {
  const counts = {
    upcoming: bookingData.filter((booking) => booking.status === 'upcoming').length,
    past: bookingData.filter((booking) => booking.status === 'past').length,
    cancelled: bookingData.filter((booking) => booking.status === 'cancelled').length
  };

  document.getElementById('upcomingCount').textContent = counts.upcoming;
  document.getElementById('pastCount').textContent = counts.past;
  document.getElementById('cancelledCount').textContent = counts.cancelled;
}

function getVisibleBookings(status) {
  return bookingData.filter((booking) => booking.status === status);
}

function renderBookings(status = 'upcoming') {
  const visibleBookings = getVisibleBookings(status);

  if (!listEl || !emptyStateEl) return;

  if (!visibleBookings.length) {
    listEl.innerHTML = '';
    emptyStateEl.classList.remove('hidden');
    return;
  }

  emptyStateEl.classList.add('hidden');
  listEl.innerHTML = visibleBookings
    .map((booking) => {
      const statusLabel = statusLabels[booking.status];
      return `
        <article class="booking-card" data-id="${booking.id}">
          <div class="booking-card-header">
            <div class="booking-cover">
              <img src="${booking.cover}" alt="${booking.title}" />
              <span class="cover-badge">${booking.type}</span>
            </div>
          </div>
          <div class="booking-card-body">
            <div class="booking-row-top">
              <div>
                <h2 class="property-name">${booking.title}</h2>
                <div class="location-row">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5Z"/></svg>
                  <span>${booking.location}</span>
                </div>
              </div>
              <span class="status-pill ${booking.status}">${statusLabel}</span>
            </div>

            <div class="booking-meta">
              <div class="meta-box">
                <span class="meta-label">Check In</span>
                <span class="meta-value">${formatDate(booking.startDate)}</span>
              </div>
              <div class="meta-box">
                <span class="meta-label">Check Out</span>
                <span class="meta-value">${formatDate(booking.endDate)}</span>
              </div>
              <div class="meta-box">
                <span class="meta-label">Guests</span>
                <span class="meta-value">${booking.guests} Guests</span>
              </div>
            </div>

            <div class="booking-actions">
              <div class="price-wrap">
                <span class="price-label">Total</span>
                <span class="price-value">${formatCurrency(booking.price)}</span>
              </div>
              <div class="action-group">
                <button type="button" class="btn btn-outline booking-view" data-id="${booking.id}">View Details</button>
                <button type="button" class="btn btn-primary download-agreement" data-id="${booking.id}">Download Agreement</button>
              </div>
            </div>
          </div>
        </article>
      `;
    })
    .join('');
}

function openBookingModal(bookingId) {
  const booking = bookingData.find((item) => item.id === Number(bookingId));
  if (!booking || !modalBodyEl || !modalEl) return;

  modalBodyEl.innerHTML = `
    <div class="detail-header">
      <div>
        <h2 id="bookingModalTitle">${booking.title}</h2>
        <div class="detail-address">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5Z"/></svg>
          <span>${booking.location}</span>
        </div>
      </div>
      <span class="status-pill ${booking.status}">${statusLabels[booking.status]}</span>
    </div>

    <div class="modal-grid">
      <div class="modal-image">
        <img src="${booking.image}" alt="${booking.title}" />
      </div>
      <aside class="summary-box">
        <h3>Booking Summary</h3>
        <div class="summary-list">
          <div class="summary-item"><span>Booking Ref</span><strong>${booking.bookingRef}</strong></div>
          <div class="summary-item"><span>Check-in</span><strong>${formatDate(booking.startDate)}</strong></div>
          <div class="summary-item"><span>Check-out</span><strong>${formatDate(booking.endDate)}</strong></div>
          <div class="summary-item"><span>Guests</span><strong>${booking.guests}</strong></div>
          <div class="summary-item"><span>Stay</span><strong>${booking.nights} nights</strong></div>
          <div class="summary-item"><span>Total</span><strong>${formatCurrency(booking.price)}</strong></div>
        </div>
      </aside>
    </div>

    <div class="detail-section">
      <span class="detail-label">Property Overview</span>
      <p class="detail-description">${booking.description}</p>
    </div>

    <div class="detail-section">
      <span class="detail-label">Reservation Note</span>
      <p class="detail-description">This reservation includes premium access, seamless check-in support, and digital agreement access for your stay. All booking changes are coordinated through home nest support.</p>
    </div>

    <div class="modal-footer">
      <button type="button" class="btn btn-outline" data-close="bookingDetailModal">Close</button>
      <button type="button" class="btn btn-primary download-agreement" data-id="${booking.id}">Download Agreement</button>
    </div>
  `;

  modalEl.classList.remove('hidden');
  modalEl.setAttribute('aria-hidden', 'false');
}

function closeBookingModal() {
  if (!modalEl) return;
  modalEl.classList.add('hidden');
  modalEl.setAttribute('aria-hidden', 'true');
}

function createRentalAgreement(booking) {
  const content = `Home Nest Rental Agreement

Booking Ref: ${booking.bookingRef}
Property: ${booking.title}
Location: ${booking.location}
Stay: ${formatDate(booking.startDate)} to ${formatDate(booking.endDate)}
Guests: ${booking.guests}
Total Amount: ${formatCurrency(booking.price)}

This agreement serves as a demonstration rental contract for the selected Home Nest reservation. It outlines the terms of the stay, payment schedule, and the support process for guest coordination.

Prepared for: ${booking.title} Guest
`;

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `home-nest-agreement-${booking.bookingRef.toLowerCase()}.txt`;
  link.click();
  URL.revokeObjectURL(url);
}

function initBookingTabs() {
  if (!tabButtons.length) return;

  tabButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const nextStatus = button.dataset.status;
      tabButtons.forEach((tab) => {
        const isActive = tab === button;
        tab.classList.toggle('active', isActive);
        tab.setAttribute('aria-selected', String(isActive));
      });
      renderBookings(nextStatus);
    });
  });
}

function bindBookingActions() {
  document.addEventListener('click', (event) => {
    const viewButton = event.target.closest('.booking-view');
    if (viewButton) {
      openBookingModal(viewButton.dataset.id);
    }

    const downloadButton = event.target.closest('.download-agreement');
    if (downloadButton) {
      const bookingId = Number(downloadButton.dataset.id);
      const booking = bookingData.find((item) => item.id === bookingId);
      if (booking) createRentalAgreement(booking);
    }

    const closeButton = event.target.closest('[data-close="bookingDetailModal"]');
    if (closeButton) {
      closeBookingModal();
    }

    if (event.target === modalEl) {
      closeBookingModal();
    }
  });
}

function initDashboard() {
  renderTabs();
  initBookingTabs();
  bindBookingActions();
  renderBookings('upcoming');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initDashboard);
} else {
  initDashboard();
}
