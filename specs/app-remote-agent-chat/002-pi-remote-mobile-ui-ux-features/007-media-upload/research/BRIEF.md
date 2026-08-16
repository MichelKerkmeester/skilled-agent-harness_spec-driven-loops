# F5-media-upload — research brief

**Feature:** Upload media from the iOS gallery into the chat
**Tier:** NO — reach the desired result with flawless UX

**Goal:** Attach photos/media from the iOS gallery or camera into the composer and get them to pi — with a security-safe design.
**Current state:** Not built: no composer file picker and no relay upload lane. The only file input is the enrollment QR scanner.
**Desired:** A composer attach affordance (iOS gallery + camera), previews, and a security-safe path to pi. This crosses the read-only posture: design the upload endpoint, size/type limits, how bytes reach pi, and how attachments are redacted/shown in the transcript.

**Target bar:** Claude iOS app + Kimi Code app.
**Sources:** Mobbin reference flows (via web) where relevant, general web crawl, and other remote-CLI / agent-chat apps on GitHub.
**Budget:** 5x sol + 5x grok + 5x deepseek (no early convergence).

Each `iter-NN-<model>.md` is one independent, cited pass under a rotating lens.
`SYNTHESIS.md` (written after) is the build-ready decision.
