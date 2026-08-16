# F8 — Inbound Media Preview: implementation phases

Six phases are required. The first two establish whether inbound bytes can enter the product safely; the third supplies the shared read/viewer foundation; the fourth makes the transcript useful; the fifth closes the mobile lifecycle and accessibility gaps; the sixth is the production enablement and security signoff. Each phase can be deployed behind the capability gate and has its own observable release boundary.

The order is dependency-driven:

1. Protocol and pre-stdout capability proof.
2. Ticketed publication, sanitization, and atomic artifact storage.
3. Exact read lane and shared F6 viewer/resource foundation.
4. Inline transcript card and complete lifecycle state rendering.
5. Fullscreen mobile interaction, privacy lifecycle, and accessibility hardening.
6. Approved host enablement, physical-device proof, and release signoff.

## Shared verification gate

Every phase must run all of the following before it is considered independently shippable:

- npm run typecheck
- npm test
- npm run test:web
- the phase fixture through scripts/inbound-media-cdp.mjs with DevTools Protocol device metrics set to exactly 390 CSS pixels and theme light, saving the screenshot under /private/tmp
- the same CDP fixture with theme dark, saving the screenshot under /private/tmp
- the relevant production build

The CDP runner must use Emulation.setDeviceMetricsOverride or the equivalent device emulation API. A desktop browser window made narrow is not a valid substitute. Screenshots and temporary binary fixtures stay outside the repository. A phase may use the existing demo surface or an explicit disabled/unsupported fixture until its feature slice is available, but it must still produce a real light and dark 390px screenshot.

The final command set is expected to be:

- npm run typecheck
- npm test
- npm run test:web
- node scripts/inbound-media-cdp.mjs --viewport-width 390 --theme light --screenshot /private/tmp/f8-light.png
- node scripts/inbound-media-cdp.mjs --viewport-width 390 --theme dark --screenshot /private/tmp/f8-dark.png
- npm run build

## Phase 1 — Protocol and pre-stdout capability boundary

### Objective

Create the versioned inbound_image contract, preserve honest old-client behavior, and prove that the pinned cli-pi 0.95/0.20 integration can intercept image-bearing output before stdout or session persistence. The feature remains disabled unless this proof passes.

### Scope

This phase is a contract and capability gate. It does not expose image bytes to the phone and does not accept a path, URL, base64 payload, or raised transport limit. It is independently shippable as a protocol package plus a disabled host capability and unsupported-row client behavior.

### Concrete tasks

- Change packages/pi-rpc-protocol/src/types.ts to add InboundImageBlock, the processing/ready/terminal unions, artifact descriptors, safe presentation metadata, and exact redaction/share fields.
- Change packages/pi-rpc-protocol/src/guards.ts to validate the union with strict exact-key checks, bounded safe text, opaque IDs, digests, dimensions, timestamps, MIME types, and availability/content consistency.
- Change packages/pi-rpc-protocol/src/index.ts to export the new types and guards.
- Extend packages/pi-rpc-protocol/tests/guards.test.ts with valid lifecycle fixtures, unknown-field rejection, path/URL/base64/OCR rejection, malformed digest/revision tests, bounds, and old transcript fixtures.
- Add extensions/pi-remote-inbound-media/package.json, tsconfig.json, src/index.ts, and tests/publisher-boundary.test.ts as the isolated host adapter seam. The adapter must observe approved image-bearing output before it can reach stdout/session persistence and must expose no capability when the seam is unavailable.
- Review extensions/pi-remote-plan/src/index.ts and the host policy contract so plan mode remains read-only and capture authority remains on the host. Do not make the phone a capture authorizer.
- Add the minimal web compatibility branch in apps/pi-remote-web/src/state.ts and apps/pi-remote-web/src/App.tsx so an inbound_image received by an old or not-yet-enabled client renders the existing unsupported/redacted row rather than disappearing.
- Add a disabled/unsupported lifecycle fixture to apps/pi-remote-web/src/demo.ts and add the initial scripts/inbound-media-cdp.mjs harness. It must capture the existing transcript plus the unsupported/disabled state in light and dark.
- Add root workspace wiring only for the new extension package and the CDP runner; do not add a binary fixture or modify any application transport limit.

### Verification gate

Run the shared verification gate:

- npm run typecheck
- npm test
- npm run test:web
- node scripts/inbound-media-cdp.mjs --viewport-width 390 --theme light --screenshot /private/tmp/f8-phase-1-light.png
- node scripts/inbound-media-cdp.mjs --viewport-width 390 --theme dark --screenshot /private/tmp/f8-phase-1-dark.png
- npm run build

The publisher test must spy on stdout/session writes and prove that no image-bearing content is forwarded when pre-stdout interception is unavailable. The CDP screenshots must use 390 CSS pixels and show no feature-enabling control.

### Acceptance

- The protocol guard accepts all valid inbound lifecycle shapes and rejects every unsafe shape listed in the feature acceptance criteria.
- Existing transcript kinds and F5 ImageContent remain type-compatible.
- An unknown inbound block is visible as an honest unsupported/redacted row, not silently dropped.
- The host advertises inbound media only when cli-pi 0.95/0.20 proves the pre-stdout seam.
- No image byte, base64, path, or URL reaches stdout, JSONL, sync, transcript, or durable state.
- Security review is required before Phase 2 because the next phase introduces an inbound binary publication boundary.

## Phase 2 — Ticketed publication, sanitization, and atomic artifact storage

### Objective

Build the secure relay-side publication path. A ticketed approved publisher can create a processing block and commit only relay-sanitized bounded derivatives as ready; every other outcome becomes withheld with no retrievable original.

### Scope

This phase crosses the inbound redaction posture. It includes the extension-only binary route, ticket binding, isolated decoder worker, artifact store, persistent metadata, retention, quota, and revision settlement. It can ship with the PWA capability disabled and be verified entirely through relay/extension integration fixtures.

### Concrete tasks

- Add apps/pi-remote-relay/src/store/artifact-store.ts for random immutable artifact IDs, artifact revisions, variant files, digest/ETag, 24-hour retention, 50 MiB session quota, expiry, revocation purge, and filesystem permissions.
- Add apps/pi-remote-relay/src/store/artifact-sanitizer.ts for streaming source limits, magic-byte/decoder validation, worker isolation, one-frame checks, orientation, sRGB conversion, metadata stripping, exclusion masks, OCR secret/path detection, opaque burned-in masks, deterministic thumbnail/full encoding, and fail-closed withholding.
- Change apps/pi-remote-relay/src/auth/policy.ts and apps/pi-remote-relay/src/auth/auth-service.ts to add artifact:publish as a distinct action and bind one-use tickets to principal, host extension, session, run, turn, block ID, submission ID, expected transcript revision, declared length, media family, and 90-second start deadline.
- Change apps/pi-remote-relay/src/http/server.ts to implement the extension-only publish-ticket and binary publish operations. Consume the ticket before reading the body, enforce declared and streamed length, reject browser-origin requests, delete partial bodies, and suppress raw errors.
- Change apps/pi-remote-relay/src/store/relay-store.ts and apps/pi-remote-relay/src/store/transcript-projector.ts to insert processing metadata, settle ready/withheld through expected-revision compare-and-swap, preserve block ID/sequence, and finalize abandoned processing after 60 seconds.
- Add the next numbered migration under apps/pi-remote-relay/migrations/ for artifact metadata, lifecycle state, variant digests, expiry, and ownership. Store no source bytes, path, URL, OCR, or decoder detail in durable relational fields.
- Add or update the host adapter at extensions/pi-remote-inbound-media/src/index.ts so only approved capture handles or in-memory bytes enter the binary route. It must reject Markdown paths, arbitrary repository paths, symlinks, and unapproved source tools.
- Add apps/pi-remote-relay/tests/artifact-store.test.ts, artifact-sanitizer.test.ts, inbound-media-publish.test.ts, and security fixtures under apps/pi-remote-relay/tests/security/. Add extension publication tests under extensions/pi-remote-inbound-media/tests/.
- Add relay-only deterministic fixtures for processing, ready, withheld, expiry, and scanner failure. Fixtures must contain no committed image bytes and must clean their temporary directories.
- Add a demo processing/withheld state to apps/pi-remote-web/src/demo.ts so the CDP harness continues to exercise a real UI state without making the web client a publisher.

### Verification gate

Run the shared verification gate:

- npm run typecheck
- npm test
- npm run test:web
- node scripts/inbound-media-cdp.mjs --viewport-width 390 --theme light --fixture processing --screenshot /private/tmp/f8-phase-2-light.png
- node scripts/inbound-media-cdp.mjs --viewport-width 390 --theme dark --fixture withheld --screenshot /private/tmp/f8-phase-2-dark.png
- npm run build

Additionally run the relay sanitizer fixture suite with exact 15 MiB, 30 MiB, 60 MP, 12,000px, four-image, worker, output, quota, and timeout boundaries. Inspect the temporary artifact directory after each test and assert it is empty.

### Acceptance

- Valid JPEG, PNG, and static WebP publication creates a processing block and then a ready block containing metadata and artifact references only.
- Unsupported, animated, malformed, over-limit, scanner-failed, or redaction-failed publication becomes withheld with no artifact bytes readable.
- Replayed or context-mismatched tickets create no block and no artifact.
- A late revision completion is deleted and cannot reorder or overwrite a newer block.
- Stored variants contain only final sanitized bytes; source and intermediate buffers are gone after commit.
- Retention, revocation, quota, and abandoned-processing cleanup are deterministic and tested.
- Security owner signs off on decoder isolation, source allowlist, redaction detectors, and fail-closed behavior before Phase 3 exposes reads.

## Phase 3 — Exact read lane and shared F6 viewer/resource foundation

### Objective

Expose sanitized variants only through an authenticated exact-revision read and establish the shared memory-only resource/viewer infrastructure that F8 and F6 can use without duplicate lightboxes or persistent browser media storage.

### Scope

This phase is a read-only surface. It does not add a send or export action. If F6 infrastructure is already present, extend it; if it is absent, implement the generic shared foundation here rather than an inbound-only copy.

### Concrete tasks

- Change apps/pi-remote-relay/src/auth/policy.ts to add artifact:read separately from artifact:publish and leave unknown actions denied.
- Change apps/pi-remote-relay/src/http/server.ts to add POST /api/artifacts/read with exact body fields, session membership, Origin/principal/device checks, 404/409/410/429 mapping, concurrency limits, and no-store integrity headers.
- Change apps/pi-remote-relay/src/auth/rate-limit.ts for 60 thumbnail reads, 30 full reads, two thumbnail requests, and one full request per device/session window.
- Extend apps/pi-remote-relay/src/store/artifact-store.ts with immutable exact-tuple lookup, variant streaming, ETag/Content-Digest, expiry, and revocation behavior. It must reject latest and never substitute a newer revision.
- Add or extend apps/pi-remote-web/src/artifacts/useArtifactResource.ts with AbortSignal ownership, streamed length checking, WebCrypto SHA-256, ETag/Content-Digest comparison, HTMLImageElement.decode, typed Blob creation, reference-counted object URLs, bounded LRU retention, and generation invalidation.
- Add or extend apps/pi-remote-web/src/artifacts/ArtifactViewerProvider.tsx and ArtifactViewerHost.tsx as shared React Aria infrastructure outside the virtualized transcript. Keep frozen artifact ID/revision/digest, history entry, scroll offset, focus restoration, and privacy-cover responsibilities in the provider.
- Add or extend apps/pi-remote-web/src/artifacts/ArtifactHeader.tsx, ArtifactDetails.tsx, PreviewControls.tsx, and useArtifactHistory.ts for safe metadata, close/history, zoom/pan controls, and focus restoration.
- Change apps/pi-remote-web/src/relay.ts for readArtifact, exact status mapping, same-origin credentials, no-store, redirect rejection, and no mutation-ticket use.
- Change apps/pi-remote-web/src/cache.ts and apps/pi-remote-web/public/service-worker.js so artifact resources are never persisted or cached. Remove legacy artifact caches during service-worker activation.
- Change apps/pi-remote-web/index.html and apps/pi-remote-web/src/main.tsx to merge the required CSP and mount the provider without putting artifact URLs in markup or history.
- Add apps/pi-remote-relay/tests/artifact-read.test.ts, artifact-headers.test.ts, and artifact-auth.test.ts. Add apps/pi-remote-web/tests/artifact-resource.test.ts, artifact-cache.test.ts, viewer-provider.test.tsx, and viewer-history.test.tsx.
- Extend scripts/inbound-media-cdp.mjs with a deterministic in-memory read fixture that can exercise thumbnail/full verification without committing image data.

### Verification gate

Run the shared verification gate:

- npm run typecheck
- npm test
- npm run test:web
- node scripts/inbound-media-cdp.mjs --viewport-width 390 --theme light --fixture viewer-shell --screenshot /private/tmp/f8-phase-3-light.png
- node scripts/inbound-media-cdp.mjs --viewport-width 390 --theme dark --fixture viewer-shell --screenshot /private/tmp/f8-phase-3-dark.png
- npm run build

The relay test must assert all response headers and exact status codes. The web test must flip one served byte, verify corrupt with zero pixels, and prove Cache Storage, IndexedDB, localStorage, history, and persisted transcript state contain no artifact resource.

### Acceptance

- An authorized exact tuple returns the requested sanitized variant with matching digest and ETag.
- latest, paths, URLs, cross-session tuples, unknown fields, expired/revoked tuples, and unauthorized principals are rejected.
- Reads cannot invoke pi, mint a mutation ticket, or change workspace state.
- The client does not create an object URL until length, digest, ETag/Content-Digest, and decode all pass.
- Strict Mode, close, abort, revision replacement, logout, revocation, and backgrounding leave no resource leak.
- The shared viewer provider mounts outside the virtualized transcript and has deterministic history/focus ownership.
- Security review confirms this read surface remains read-only and no-store before the card is promoted.

## Phase 4 — Transcript projection and inline image card

### Objective

Render inbound_image as a promoted transcript sibling with near-viewport thumbnail loading, stable geometry, honest states, tool-collapse persistence, and the required 390px mobile card behavior.

### Scope

This phase connects the protocol and exact read lane to the transcript. Fullscreen interaction can remain at the shared foundation’s baseline, but the inline card and every card lifecycle state must be testable and visible.

### Concrete tasks

- Change apps/pi-remote-web/src/state.ts to retain the typed inbound block, preserve numeric revision updates, map unknown blocks honestly, and keep processing-to-ready in the same block position.
- Change apps/pi-remote-web/src/App.tsx to render InboundImageBlockView as a standalone transcript item and keep it outside ActivityGroup/DisclosurePanel when the source is a tool result.
- Add apps/pi-remote-web/src/artifacts/InboundImageBlockView.tsx, InboundImageCard.tsx, ImagePlaceholder.tsx, VerifiedImage.tsx, and ImageStatus.tsx. Keep the ready card to one React Aria Button with no nested action.
- Extend apps/pi-remote-web/src/artifacts/useArtifactResource.ts with deferred loading until the card is near two viewport heights, one 750ms visible-card retry, offline wording based on actual read/heartbeat, and terminal error mapping.
- Extend apps/pi-remote-web/src/artifacts/ArtifactDetails.tsx with safe authenticated details for ready/withheld states and no raw source metadata.
- Change apps/pi-remote-web/src/turns.ts only if the new sibling changes turn grouping; preserve order, stable keys, and no dropped block behavior.
- Change apps/pi-remote-web/src/style.css for 16px gutters, 16px radius, reserved 180–240px well, contain fit, light/dark surfaces, checkerboard alpha treatment, 44px identity row, metadata wrapping, focus states, and no horizontal overflow.
- Extend apps/pi-remote-web/src/demo.ts with deterministic fixtures for processing, deferred, thumbnail-fetching, verifying, decoding, inline-ready, withheld, denied, expired, missing, revision-conflict, corrupt, rate-limited, stale, revoked, unsupported, privacy-covered, closing, and aborted.
- Add apps/pi-remote-web/tests/InboundImageCard.test.tsx, inbound-image-states.test.tsx, transcript-placement.test.tsx, and disclosure-persistence.test.tsx.
- Extend scripts/inbound-media-cdp.mjs to assert card geometry, no horizontal overflow, light/dark theme, and card visibility after tool disclosure collapse.

### Verification gate

Run the shared verification gate:

- npm run typecheck
- npm test
- npm run test:web
- node scripts/inbound-media-cdp.mjs --viewport-width 390 --theme light --fixture inline-card --screenshot /private/tmp/f8-phase-4-light.png
- node scripts/inbound-media-cdp.mjs --viewport-width 390 --theme dark --fixture inline-card --screenshot /private/tmp/f8-phase-4-dark.png
- npm run build

The DOM suite must exercise every state fixture and assert copy, aria-busy, actions, reserved geometry, accessible name, no nested controls, and no pixel rendering for withheld/expired/revoked/corrupt states.

### Acceptance

- Tool-origin image cards remain visible when their owning tool details collapse.
- Assistant-origin cards preserve stream order, and two to four cards stack vertically with 12px gaps.
- The ready card opens only on release, Enter, or Space; a scroll gesture over the card does not open it.
- Near-viewport loading, one automatic retry, exact revision, digest failure, rate limiting, offline wording, expiry, revocation, stale, and resync states match the state table.
- The 390px light/dark screenshots have 16px gutters, no horizontal scroll, contained non-cropped previews, readable metadata, and no clay-only status/boundary/focus signal.
- No image action can send to pi, share, save, copy, download, or create a public URL.

## Phase 5 — Fullscreen interaction, privacy lifecycle, and accessibility hardening

### Objective

Finish the target mobile experience around the shared F6 viewer: exact-revision opening, bounded full reads, zoom/pan alternatives, Details, history/focus restoration, privacy covering, all failure states, and physical-device accessibility.

### Scope

This phase adds the remaining user-facing interaction and lifecycle behavior. It does not add export, capture, re-send, or a second viewer implementation.

### Concrete tasks

- Extend apps/pi-remote-web/src/artifacts/ArtifactViewerProvider.tsx and ArtifactViewerHost.tsx for opening, full-fetching, viewer-ready, full-degraded, stalled, offline-loaded, offline-unavailable, stale, revoked, privacy-covered, closing, and aborted transitions.
- Extend apps/pi-remote-web/src/artifacts/ArtifactHeader.tsx, PreviewControls.tsx, ArtifactDetails.tsx, and useArtifactHistory.ts for opaque viewer chrome, safe heading focus, Close, Details disclosure, zoom/fit, directional pan, keyboard shortcuts, one history child, and exact scroll/focus restoration.
- Extend apps/pi-remote-web/src/artifacts/useArtifactResource.ts for thumbnail retention while full loads, 15-second stalled state, foreground-only offline retention, aborts, one-generation retries, and purge-on-background.
- Change apps/pi-remote-web/src/App.tsx and apps/pi-remote-web/src/main.tsx to connect visibilitychange, pagehide, logout, session switch, revocation, and transcript supersession to the privacy curtain and resource store.
- Change apps/pi-remote-web/src/style.css for opaque carbon viewer stage, two-row high-scale header, safe areas, visual viewport, 100dvh/100svh, overscroll containment, active zoom-surface touch-action, focus rings, 44px controls, and reduced-motion rules.
- Change apps/pi-remote-web/index.html and apps/pi-remote-web/public/service-worker.js if device testing reveals CSP, bfcache, or service-worker cache paths that can retain artifact URLs; do not add persistent media storage.
- Add apps/pi-remote-web/tests/InboundImageViewer.test.tsx, viewer-interaction.test.tsx, viewer-races.test.tsx, privacy-lifecycle.test.tsx, accessibility.test.tsx, and contrast.test.tsx.
- Extend scripts/inbound-media-cdp.mjs to capture card, opening, viewer-ready, full-degraded, withheld, privacy-covered, and close states in both themes at 390px.
- Perform manual installed-PWA and Safari checks on the oldest supported iPhone: VoiceOver, Switch Control, Voice Control, edge-back, Escape/keyboard where available, landscape, offline relay loss, bfcache, reduced motion, increased contrast, RTL, 320px, and 200% text.

### Verification gate

Run the shared verification gate:

- npm run typecheck
- npm test
- npm run test:web
- node scripts/inbound-media-cdp.mjs --viewport-width 390 --theme light --fixture viewer-ready --screenshot /private/tmp/f8-phase-5-light.png
- node scripts/inbound-media-cdp.mjs --viewport-width 390 --theme dark --fixture viewer-ready --screenshot /private/tmp/f8-phase-5-dark.png
- npm run build

Then complete the manual device matrix. A screenshot is not a substitute for VoiceOver dismissal, App Switcher covering, edge-back, or physical memory behavior.

### Acceptance

- Opening freezes the exact ID/revision/digest, blurs the composer, preserves transcript scroll, pushes one history child, traps focus, and restores focus/scroll on every specified close path.
- Thumbnail remains visible while the full image fetches; full pixels appear only after all integrity and decode checks.
- Zoom and pan have both direct-manipulation and visible single-pointer/keyboard alternatives; no gesture conflicts with transcript scroll or dismisses the viewer.
- Full-degraded, stalled, offline, denied, corrupt, stale, revoked, and privacy-covered behavior matches the state table with bounded retry.
- Backgrounding, pagehide, logout, session switch, revocation, and close synchronously cover and purge pixels and URLs.
- Light/dark, 320px, 200% text, RTL, increased contrast, reduced motion, portrait, and landscape pass without obscured controls or page-level overflow.
- Manual device verification passes in Safari and installed-PWA standalone mode before Phase 6.

## Phase 6 — Approved host enablement, security signoff, and release

### Objective

Connect the completed slices to the real approved source allowlist, prove end-to-end behavior on the pinned host integration, and enable the feature only after security, redaction, device, and release gates pass.

### Scope

This is the production boundary. It turns the capability from disabled/test-only into an allowlisted feature for approved host extensions. It must preserve an immediate kill switch and leave the feature disabled if any precondition is missing.

### Concrete tasks

- Finalize extensions/pi-remote-inbound-media/src/index.ts source allowlist, capability-handle resolution, host policy checks, Plan-mode behavior, run/turn/block binding, and publisher cleanup.
- Review and update extensions/pi-remote-plan/src/index.ts so Plan mode cannot be used by the phone to authorize a new capture or publication, while artifact:read remains a read-only operation.
- Review apps/pi-remote-relay/src/policy/mutation-policy.ts and apps/pi-remote-relay/src/auth/policy.ts for separate artifact:publish and artifact:read actions, default-deny unknown actions, and emergency disable behavior.
- Add the host-to-relay end-to-end fixture using cli-pi 0.95/0.20. Assert image-bearing content is intercepted before stdout/session persistence, a processing block appears, the relay emits ready or withheld, the PWA reads the exact revision, and revocation/expiry covers the UI.
- Add release/kill-switch checks to scripts/release-verify.mjs or the existing release gate without logging image bytes, IDs, paths, OCR, digests, URLs, or decoder exceptions.
- Add production verification for the artifact decoder dependency, network-disabled worker, filesystem permissions, retention job, quota eviction, revocation listener, service-worker activation, CSP, and no-store headers.
- Run all negative controls in apps/pi-remote-relay/tests/security/negative-controls.test.ts and the host publisher suite, including wrong origin, wrong principal, wrong device, stale revision, replayed ticket, path injection, symlink, polyglot, scanner timeout, and forced byte flip.
- Perform final authenticated visual comparison against the target Claude iOS and Kimi Code interaction bar without changing the fixed ink-on-parchment tokens or adding consumer-app export behavior.
- Record the security owner’s approval of source allowlist, redaction detector policy, retention, decoder operations, iOS baseline, App Switcher limitation, and Plan-mode capture semantics before enabling the capability.

### Verification gate

Run the full shared gate against the real host integration:

- npm run typecheck
- npm test
- npm run test:web
- node scripts/inbound-media-cdp.mjs --viewport-width 390 --theme light --fixture end-to-end --screenshot /private/tmp/f8-phase-6-light.png
- node scripts/inbound-media-cdp.mjs --viewport-width 390 --theme dark --fixture end-to-end --screenshot /private/tmp/f8-phase-6-dark.png
- npm run build
- the release verification and rollback/kill-switch checks used by the repository

The final diff/no-stray-files sweep must prove that screenshots, decoded buffers, binary fixtures, artifact caches, and generated media are outside the repository and that only the approved implementation areas changed.

### Acceptance

- The real pinned host integration either publishes through the approved pre-stdout seam or leaves the feature disabled; no fallback transport is accepted.
- Only allowlisted sources can publish, and host/extension policy remains authoritative in Plan mode.
- End-to-end ready, withheld, expiry, revocation, stale-revision, corrupt-byte, offline, and background-privacy behavior passes on the physical device.
- No outbound mutation, F5 attachment, prompt submission, pi re-send, share, save, copy, download, URL, path, or persistent browser media path exists.
- Security owner signs off on the publication lane, redaction pipeline, read authorization, cache hygiene, retention, residual risks, and kill switch.
- The release gate passes with light and dark true-390px CDP screenshots, production build, tests, device matrix, no generated repository media, and no stray files.
