# Checklist — Local Composer Draft, Preview, and Redacted-Card UI

- [ ] Gallery selection appends ordered local tiles without network traffic.
- [ ] Rear-camera capture adds one local tile without network traffic.
- [ ] A fifth item is rejected without changing the existing four-item draft.
- [ ] `+` shows Photo Library and Take Photo before Mode and Commands only when host media capability is present, with the local-storage disclosure.
- [ ] With capability off, the complete photo group and rail disappear without a disabled or decorative action.
- [ ] The rail is an ordered named list with generic Photo ordinals, correct 72 px/64 px geometry, horizontal overflow behavior, and real 44×44 removal targets.
- [ ] Local states `menu-open`, `picker-active`, `local-validating`, `local-ready`, `local-rejected`, and `model-blocked` render their specified behavior.
- [ ] Supported HEIC/HEIF without a WebKit preview remains sendable and shows **“Photo · preview unavailable.”**
- [ ] Preview uses a React Aria modal/dialog with visible Close and Remove, no download/share, Escape handling, and focus restoration to the opening tile.
- [ ] Return inserts a newline, hardware `⌘ Enter` sends, and IME composition suppresses Send.
- [ ] Plan mode keeps the **“Plan · read-only.”** cue and image content grants no authority.
- [ ] Object URLs are revoked on removal and lifecycle cleanup; Strict Mode does not leak URLs, listeners, requests, timers, or callbacks.
- [ ] Original filenames and raw media never appear in DOM, browser storage, cache, analytics, or error strings.
- [ ] Redacted transcript cards render generically with **“Preview not retained”** and unknown kinds remain safe.
- [ ] Service worker and offline cache reject attachment-bearing paths/data.
- [ ] `npm run typecheck` exits 0.
- [ ] `npm run test` exits 0.
- [ ] `npm run test:web` exits 0.
- [ ] Focused web, cache, and service-worker suites exit 0.
- [ ] CDP runs use exactly 390 CSS px in light and dark themes for menu-open, four-tile local-ready, preview, model-blocked, and narrow/reflow states.
- [ ] CDP verification checks actual DOM focus and horizontal overflow, not only screenshots.
- [ ] The 320 px/200% layout reflows without page-level horizontal scroll and RTL/reduced-motion behavior is verified.

