// =========================
// CACHE NAME
// =========================

const CACHE_NAME =
"weather-app-v1";

// =========================
// FILES TO CACHE
// =========================

const urlsToCache = [

"/",
"/index.html",
"/style.css",
"/script.js",
"/manifest.json"

];

// =========================
// INSTALL SERVICE WORKER
// =========================

self.addEventListener("install", event => {

event.waitUntil(

caches.open(CACHE_NAME)
.then(cache => {

console.log("Cache Opened");

return cache.addAll(urlsToCache);

})

);

});

// =========================
// FETCH CACHE
// =========================

self.addEventListener("fetch", event => {

event.respondWith(

caches.match(event.request)
.then(response => {

// Return cache if found

return response || fetch(event.request);

})

);

});

// =========================
// ACTIVATE
// =========================

self.addEventListener("activate", event => {

console.log("Service Worker Activated");

});