self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));
self.addEventListener("message", (event) => {
  event.waitUntil(
    fetch("/coverage-headers")
      .then((response) => response.json())
      .then((headers) => event.ports[0].postMessage(headers)),
  );
});
