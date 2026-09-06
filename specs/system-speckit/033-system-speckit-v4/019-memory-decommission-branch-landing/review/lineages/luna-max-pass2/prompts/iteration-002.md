---
iteration: 2
mode: review
focus: D2 Security — embedding authorization, model identity, IPC and process boundaries
---

Review the current HF model-server and client trust boundaries. Trace remote-bind authorization through the HTTP request path, verify that availability and readiness identify the requested model, compare Unix-socket hardening with the shared IPC implementation, and inspect response-shape validation. Re-read current sources and tests; carry earlier findings only when independently confirmed. Record typed adjudication for every P1 and finish with an exact `Review verdict:` line.

