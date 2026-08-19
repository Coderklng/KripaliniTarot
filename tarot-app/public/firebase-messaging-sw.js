importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

// Actual string values direct paste karein (process.env mat use karein)
firebase.initializeApp({
  apiKey: "AIzaSyCXycrFjeKaixONArcR_F2uRxSyuHkwR68",
  authDomain: "kripalini-b8778.firebaseapp.com",
  projectId: "kripalini-b8778",
  storageBucket: "kripalini-b8778.firebasestorage.app",
  messagingSenderId: "1030281371160",
  appId: "1:1030281371160:web:5afb910e36b072a5622d6d",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification?.title || 'Tarot Notification';
  const notificationOptions = {
    body: payload.notification?.body || '',
    icon: '/images/logos/tarot-pro.jpg',
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});