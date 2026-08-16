# Checklist — Image/PDF renderers and device release hardening

- [ ] Raster images are decoded/re-encoded from sanitized bytes, bounded by bytes/pixels/dimensions, have safe thumbnails, disclose no metadata, support 1×–4× interaction, and expose visible non-gesture controls.
- [ ] Safe PDFs use bounded pages/canvases and revision-consistent ranges/ETags, show page labels and controls, and enable selection/search only for verified safe text layers.
- [ ] Unsafe or unverified PDFs never create a text layer and become explicit `withheld`/`unsupported` states when safety cannot be attested.
- [ ] Decode, worker, range, canvas, and Share failures map to the specified redacted states without raw server/library diagnostics.
- [ ] Every feature lifecycle/content state is reachable through deterministic fixtures with correct actions, announcements, cleanup, and retry behavior.
- [ ] Revocation immediately blanks payloads and stops network/renderer work.
- [ ] Repeated large-PDF open/close does not monotonically increase live canvases, workers, buffers, or blob URLs.
- [ ] Binary Share is enabled only after exact sanitized bytes are prepared and `canShare({ files })` succeeds; it exports no URL or host handoff.
- [ ] No mutation command, path-derived request, public artifact URL, service-worker artifact cache, uncontrolled PDF fallback, or unreviewed binary fallback exists.
- [ ] Light/dark, portrait/landscape, 320px, 390px, 200% text, RTL, VoiceOver, reduced motion, Safari, and installed-PWA behavior pass on the oldest supported iPhone.
- [ ] App background, bfcache restoration, relay loss, expiry, revocation, and pageshow revalidation are covered.
- [ ] `npm run typecheck` passes.
- [ ] `npm test` passes.
- [ ] `npm run test:web` passes.
- [ ] `npm run build` passes.
- [ ] The light image/PDF CDP command passes at exactly 390 CSS pixels and its screenshot is inspected for clipping, contrast, overflow, and stable layout.
- [ ] The dark image/PDF CDP command passes at exactly 390 CSS pixels and its screenshot is inspected for clipping, contrast, overflow, and stable layout.
- [ ] Installed-PWA physical-device verification is recorded for the oldest supported iPhone in portrait and landscape; desktop screenshots do not substitute.
- [ ] Final security/privacy review covers binary sanitization, PDF text layers, thumbnails/alt text, range serving, binary Share, revocation, bfcache, app-switcher exposure, and unsupported-as-withheld decisions.
- [ ] Only the four markdown files in this phase folder were created; no application source, existing feature spec, implementation phases, `001-research`, metadata file, or outside path changed.

