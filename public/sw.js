const CACHE_NAME = 'happiness-v1.0.0';
const CACHE_URLS = [
  '/',
  '/dashboard',
  '/mind-gym',
  '/coach',
  '/community',
  '/profile',
  '/onboarding',
  '/quiz',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Install event - cache essential assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(CACHE_URLS);
      })
      .catch(error => {
        console.error('Cache installation failed:', error);
      })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', event => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version if available
        if (response) {
          return response;
        }

        // Clone the request because it's a stream
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(response => {
          // Check if valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response because it's a stream
          const responseToCache = response.clone();

          // Cache successful responses
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });

          return response;
        }).catch(() => {
          // Offline fallbacks
          if (event.request.destination === 'document') {
            return caches.match('/') || new Response(
              `
              <!DOCTYPE html>
              <html>
                <head>
                  <title>Happiness - Offline</title>
                  <meta name="viewport" content="width=device-width, initial-scale=1">
                  <style>
                    body { 
                      font-family: system-ui, sans-serif; 
                      text-align: center; 
                      padding: 2rem; 
                      background: linear-gradient(135deg, #0ea5e9, #8b5cf6);
                      color: white;
                      min-height: 100vh;
                      margin: 0;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      flex-direction: column;
                    }
                    .offline-icon { font-size: 4rem; margin-bottom: 1rem; }
                    .title { font-size: 1.5rem; margin-bottom: 0.5rem; }
                    .message { opacity: 0.9; max-width: 400px; line-height: 1.5; }
                  </style>
                </head>
                <body>
                  <div class="offline-icon">✨</div>
                  <h1 class="title">You're Offline</h1>
                  <p class="message">
                    Your happiness journey continues even offline! 
                    Some features may be limited until you're back online.
                  </p>
                  <button onclick="location.reload()" style="
                    margin-top: 1rem; 
                    padding: 0.75rem 1.5rem; 
                    background: rgba(255,255,255,0.2); 
                    border: 1px solid rgba(255,255,255,0.3);
                    border-radius: 0.5rem; 
                    color: white; 
                    cursor: pointer;
                  ">
                    Try Again
                  </button>
                </body>
              </html>
              `,
              { headers: { 'Content-Type': 'text/html' } }
            );
          }

          // For other resources, return a basic offline response
          return new Response('Offline', { status: 503 });
        });
      })
  );
});

// Background sync for when the app comes back online
self.addEventListener('sync', event => {
  if (event.tag === 'happiness-sync') {
    event.waitUntil(syncHappinessData());
  }
});

async function syncHappinessData() {
  // In a real app, this would sync local data with a server
  console.log('Syncing happiness data...');
  try {
    // Placeholder for future server sync functionality
    return Promise.resolve();
  } catch (error) {
    console.error('Sync failed:', error);
    throw error;
  }
}

// Push notification handler (for future use)
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'Time for your daily Mind Gym session!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'open-mindgym',
        title: 'Start Mind Gym',
        icon: '/icons/shortcut-mindgym.png'
      },
      {
        action: 'dismiss',
        title: 'Maybe Later',
        icon: '/icons/icon-72x72.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Happiness', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'open-mindgym') {
    event.waitUntil(
      clients.openWindow('/mind-gym')
    );
  } else if (event.action !== 'dismiss') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});