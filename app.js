import { places } from './locations.js';

// DOM APP
const views = [...document.querySelectorAll('.view')];
const tabs = [...document.querySelectorAll('.nav-tab')];
let map;
let markerLayer;
let userMarker;
let activeCategory = 'All';
let origin = { lat:44.9720, lng:-93.1560 };

function distanceMiles(lat1, lng1, lat2, lng2) {
  const toRadians = degrees => degrees * Math.PI / 180;
  const earthRadiusMiles = 3958.8;
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLng / 2) ** 2;
  return earthRadiusMiles * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function placesWithDistance() {
  return places.map(place => ({ ...place, distanceMiles: distanceMiles(origin.lat, origin.lng, place.lat, place.lng) }))
    .sort((a, b) => a.distanceMiles - b.distanceMiles);
}

function distanceLabel(place) { return `${place.distanceMiles.toFixed(1)} mi`; }

function setView(name) {
  views.forEach(view => { const active = view.dataset.screen === name; view.hidden = !active; view.classList.toggle('is-active', active); });
  tabs.forEach(tab => { const active = tab.dataset.view === name; tab.classList.toggle('is-active', active); tab.setAttribute('aria-selected', String(active)); tab.tabIndex = active ? 0 : -1; });
  history.replaceState(null, '', `#${name}`);
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (name === 'nearby') { initMap(); setTimeout(() => map?.invalidateSize(), 50); }
}

document.querySelectorAll('[data-view]').forEach(control => control.addEventListener('click', event => { event.preventDefault(); setView(control.dataset.view); }));

document.querySelector('.bottom-nav').addEventListener('keydown', event => {
  if (!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
  event.preventDefault();
  const current = tabs.indexOf(document.activeElement);
  let next = current;
  if (event.key === 'ArrowRight') next = (current + 1) % tabs.length;
  if (event.key === 'ArrowLeft') next = (current - 1 + tabs.length) % tabs.length;
  if (event.key === 'Home') next = 0;
  if (event.key === 'End') next = tabs.length - 1;
  tabs[next].focus();
  setView(tabs[next].dataset.view);
});

function cardTemplate(place) {
  return `<button class="deal-card" data-place="${place.id}" aria-label="View ${place.name} details"><span class="deal-visual" style="--accent:${place.accent}"><span class="deal-logo">${place.initials}</span><span class="discount-badge">${place.discount}</span></span><span class="deal-body"><h3>${place.name}</h3><p>${distanceLabel(place)} · ${place.category}</p></span></button>`;
}

function renderFeatured() {
  document.querySelector('#featured-deals').innerHTML = placesWithDistance().slice(0,4).map(cardTemplate).join('');
}
renderFeatured();

function placeRow(place) {
  return `<button class="place-row" data-place="${place.id}"><span class="place-logo">${place.initials}</span><span><h3>${place.name}</h3><p>${distanceLabel(place)} · ${place.category}</p></span><span class="place-discount"><strong>${place.discount}</strong><small>View details</small></span></button>`;
}

function filteredPlaces() {
  const sorted = placesWithDistance();
  return activeCategory === 'All' ? sorted : sorted.filter(place => place.category === activeCategory);
}

function renderPlaces() {
  const filtered = filteredPlaces();
  document.querySelector('#places-list').innerHTML = filtered.map(placeRow).join('');
  document.querySelector('#results-count').textContent = `${filtered.length} place${filtered.length === 1 ? '' : 's'}`;
  if (markerLayer) {
    markerLayer.clearLayers();
    filtered.forEach(place => addMarker(place));
  }
}

function markerIcon(place) {
  return L.divIcon({ className:'', html:`<div class="custom-marker"><span>${place.initials}</span></div>`, iconSize:[40,40], iconAnchor:[19,36] });
}

function addMarker(place) {
  L.marker([place.lat, place.lng], {icon: markerIcon(place)}).addTo(markerLayer).bindTooltip(`${place.name} · ${place.discount}`).on('click', () => openPlace(place.id));
}

function initMap() {
  if (map || !window.L) return;
  map = L.map('discount-map', { zoomControl:false }).setView([44.9720,-93.1560], 12);
  L.control.zoom({position:'topright'}).addTo(map);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom:19, attribution:'© OpenStreetMap contributors' }).addTo(map);
  markerLayer = L.layerGroup().addTo(map);
  renderPlaces();
}

function openPlace(id) {
  const place = places.find(item => item.id === id);
  if (!place) return;
  const content = document.querySelector('#dialog-content');
  content.innerHTML = `<div class="dialog-hero" style="--accent:${place.accent}"><div><span class="kicker">${place.category} · ${distanceLabel({...place, distanceMiles:distanceMiles(origin.lat, origin.lng, place.lat, place.lng)})}</span><h2>${place.name}</h2></div></div><div class="dialog-body"><div class="dialog-offer"><span>Military offer status</span><br><strong>${place.discount}</strong></div><p>${place.description}</p><p><strong>Location</strong><br>${place.address}</p><div class="dialog-actions"><a class="directions-link" href="${place.directionsUrl}" target="_blank" rel="noopener">Directions</a><a class="source-link" href="${place.sourceUrl}" target="_blank" rel="noopener">Offer terms</a></div></div>`;
  document.querySelector('#place-dialog').showModal();
}

document.addEventListener('click', event => {
  const placeControl = event.target.closest('[data-place]');
  if (placeControl) openPlace(placeControl.dataset.place);
});

document.querySelector('.dialog-close').addEventListener('click', () => document.querySelector('#place-dialog').close());
document.querySelector('#place-dialog').addEventListener('click', event => { if (event.target === event.currentTarget) event.currentTarget.close(); });

document.querySelectorAll('.filter').forEach(button => button.addEventListener('click', () => {
  activeCategory = button.dataset.category;
  document.querySelectorAll('.filter').forEach(item => {
    const active = item === button;
    item.classList.toggle('is-active', active);
    item.setAttribute('aria-pressed', String(active));
  });
  renderPlaces();
}));

document.querySelector('#map-list-toggle').addEventListener('click', event => {
  const panel = document.querySelector('#places-panel');
  panel.classList.toggle('is-hidden');
  const expanded = !panel.classList.contains('is-hidden');
  event.currentTarget.textContent = expanded ? 'Hide list' : 'Show list';
  event.currentTarget.setAttribute('aria-expanded', String(expanded));
});

document.querySelector('#use-location').addEventListener('click', event => {
  if (!navigator.geolocation) { event.currentTarget.textContent = 'Location unavailable'; return; }
  event.currentTarget.textContent = 'Locating…';
  navigator.geolocation.getCurrentPosition(position => {
    initMap();
    const point = [position.coords.latitude, position.coords.longitude];
    origin = { lat:point[0], lng:point[1] };
    map.setView(point, 11);
    if (userMarker) userMarker.remove();
    userMarker = L.circleMarker(point, {radius:7,color:'#fff',weight:3,fillColor:'#2e78d2',fillOpacity:1}).addTo(map).bindTooltip('You are here').openTooltip();
    renderPlaces();
    renderFeatured();
    event.currentTarget.innerHTML = '<span>⌖</span> Distances updated';
  }, () => { event.currentTarget.textContent = 'Location blocked'; }, {enableHighAccuracy:true,timeout:8000});
});

const initial = location.hash.slice(1);
setView(['home','nearby','profile'].includes(initial) ? initial : 'home');
