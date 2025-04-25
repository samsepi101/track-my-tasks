/* eslint-disable */
/* eslint-env serviceworker */

importScripts("https://www.gstatic.com/firebasejs/10.9.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.9.0/firebase-messaging-compat.js");

firebase.initializeApp({
    apiKey: "AIzaSyC_7iEOrVbqbGBspe-UAAwzCUorvVkPvmY",
    authDomain: "student-task-tracker-908e9.firebaseapp.com",
    projectId: "student-task-tracker-908e9",
    messagingSenderId: "224600961579",
    appId: "1:224600961579:web:434a827e05664dba5a306e",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
    console.log("[firebase-messaging-sw.js] Received background message ", payload);

    self.registration.showNotification(payload.notification.title, {
        body: payload.notification.body,
        icon: "/logo192.png",
    });
});
