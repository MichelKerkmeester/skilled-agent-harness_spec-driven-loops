# F7 — Implementation phases

F7 is delivered in three phases. Phase 1 makes the authoritative redacted contract safe and backward-compatible. Phase 2 delivers the first user-visible vertical slice: inline cards, exact Copy, and F6 Open with plaintext fallback. Phase 3 adds progressive highlighting and device/release hardening; plaintext remains a valid renderer if highlighting is unavailable.

The existing F6 viewer shell is a prerequisite for Phase 2. F7 extends its typed document adapter and uses its history, focus, safe-area, scroll-lock, and dismissal ownership. F7 must not create a second modal or a new artifact-resource route.

Every phase is independently verifiable. Every gate includes the repository typecheck, tests, build, and true-390px CDP captures in both themes. Screenshot output is written to a temporary directory and is not committed.

## Phase 1 — Authoritative rich-block contract and redacted projection

### Objective

Expose enough relay-authored identity and lifecycle data for rich rendering while keeping old clients safe, preserving the existing read-only transcript transport, and proving that no unredacted rich value can enter persistence, replay, broadcast, cache, or fixtures.

### Scope

Protocol types and guards, relay projection, redaction metadata, transcript/sync compatibility, deterministic security fixtures, and the baseline CDP harness. There is no new rich UI in this phase; the current Activity, prose, and safe fallback renderers remain the visible behavior until Phase 2 is enabled.

### Concrete tasks

- Update `packages/pi-rpc-protocol/src/types.ts` with bounded rich-capable fields on tool call/result blocks: opaque `callId`, authoritative shell genre, lifecycle/checkpoint values, output completeness, and the existing block identity/revision fields. Add a relay-authored `TextArtifactBlock` for explicit prompt/goal/plan/document/text metadata. Keep legacy block shapes valid for older cached and replayed data, but do not make legacy data rich-eligible.
- Update `packages/pi-rpc-protocol/src/guards.ts` with strict bounded guards for every new field and discriminant. Reject invalid call identities, missing required rich identity, unknown lifecycle/checkpoint/completeness values, oversized source strings, malformed artifact labels, invalid revisions, and malformed redaction metadata before a block reaches the web reducer.
- Export the new types and guards from `packages/pi-rpc-protocol/src/index.ts`. Preserve the existing public barrel so relay and web imports do not bypass the guard boundary.
- Extend `packages/pi-rpc-protocol/tests/guards.test.ts` with valid shell lifecycle fixtures, explicit text-artifact fixtures, legacy compatibility fixtures, unknown-key/unknown-discriminant rejection, bounds, wrong-type, duplicate-identity, and redaction-metadata cases.
- Update `apps/pi-remote-relay/src/store/transcript-projector.ts` so `tool_execution_start`, `tool_execution_update`, `tool_execution_end`, `bash_execution_update`, assistant tool-call messages, and tool-result messages carry the same stable `callId` through every revision. Preserve the current stable block key and monotonic revision behavior. Relay-authored shell genre, terminal checkpoint, lifecycle, and truncation must come from event/protocol metadata; do not derive them from output wording.
- Keep result-before-call evidence available to the client instead of dropping it or attaching it to an adjacent call. Emit a safe unmatched result when identity cannot be proven.
- Add explicit text-artifact projection only for trusted relay metadata. Do not classify a streaming paragraph or optimistic prompt in the relay. Keep fenced-code parsing in the web normalizer.
- Update `apps/pi-remote-relay/src/store/redaction.ts` so command input, output, text-artifact source, tool names, and metadata are redacted before `relay-store` persistence and before replay/broadcast. Preserve policy version, fields-redacted count, and reason categories without exposing removed values or sensitive offsets.
- Verify `apps/pi-remote-relay/src/store/relay-store.ts` and `apps/pi-remote-relay/src/replay/sync.ts` retain the new guarded fields and never serialize an unredacted projection. The existing page route in `apps/pi-remote-relay/src/http/server.ts` (`/api/sessions/:sessionId/transcript`) and read-only socket (`/api/sync`, `sync:read`) remain the only transcript transport; add no endpoint, auth action, ticket, or filesystem lookup.
- Extend `apps/pi-remote-relay/tests/transcript-projector.test.ts`, `redaction.test.ts`, `store.test.ts`, `sync.test.ts`, and `tests/security/negative-controls.test.ts` with concurrent calls, out-of-order results, replay revisions, redaction markers, result-before-call, terminal-without-result, truncation, log/error safety, and no-new-route assertions.
- Add redacted protocol and event fixtures under `apps/pi-remote-relay/src/fixtures/` for Bash success/failure/streaming, non-shell tools, explicit text artifacts, secrets, paths, URL credentials, bidi controls, ANSI bytes, malformed payloads, and old cached shapes. The fixtures must never contain live secrets; use deterministic sentinel values that the redactor replaces.
- Extend `apps/pi-remote-web/src/relay.ts`, `src/state.ts`, and `src/cache.ts` only as needed to accept the guarded fields and preserve `relay`, `cache`, and `optimistic` provenance. A cache entry without identity, revision, or redaction metadata must remain safely renderable as legacy content, not be upgraded by guesswork.
- Add `scripts/rich-content-cdp.mjs` with a deterministic baseline fixture mode, exact CSS-pixel viewport assertion, light/dark theme selection, screenshot output argument, and an overflow assertion. Its baseline fixture must prove the existing Activity/prose layout is unchanged before rich UI is enabled.

### Verification gate

Run all of the following from the repository root:

```text
npm run typecheck
npm test
npm run test:web
npm run build
node scripts/rich-content-cdp.mjs --fixture legacy-activity --viewport-width 390 --theme light --output <temporary-directory>/f7-phase-1-light.png
node scripts/rich-content-cdp.mjs --fixture legacy-activity --viewport-width 390 --theme dark --output <temporary-directory>/f7-phase-1-dark.png
```

The gate is complete only when the protocol and relay suites pass, the CDP runner reports exactly 390 CSS pixels, page horizontal overflow is zero, and both screenshots have been inspected for unchanged transcript/composer geometry, theme contrast, and no clipped controls. The security suite must demonstrate that the redaction marker—not the fixture sentinel—appears in page responses, sync messages, stored envelopes, logs, and error text.

### Acceptance

- New shell-capable transcript blocks carry a stable `callId`, shell genre, authoritative lifecycle/checkpoint, completeness, block identity, and monotonic revision; legacy blocks remain safe non-rich inputs.
- Concurrent, out-of-order, duplicate, lower-revision, result-before-call, and terminal-without-result fixtures retain enough identity for the client to represent the specified state without adjacency matching.
- `isTranscriptBlock` and all new guards reject malformed rich fields and unknown rich variants before rendering.
- Redaction occurs before persistence, page response, sync broadcast, cache fixture generation, logs, and error reporting; no sentinel secret survives outside the expected redaction marker.
- The existing transcript page and `/api/sync` remain read-only and require no new mutation ticket or host-file operation.
- Old clients and cached legacy blocks continue to show their existing renderers, and the true-390px light/dark baseline screenshots show no layout regression.

This phase crosses the security posture because it changes the data contract and the values that may be broadcast as transcript content. A security/privacy review must approve the new fields, redaction ordering, call identity propagation, terminal/truncation semantics, fixture hygiene, and the negative controls before rich-capable blocks are enabled.

## Phase 2 — Inline cards, exact Copy, and F6 inspection

### Objective

Ship the complete user-visible core slice over the Phase 1 contract: semantic Bash Command/Output cards, code and text-artifact cards, exact unit-level Copy, and explicit full-screen Open through the existing F6 viewer. Plaintext is the first-paint and failure renderer for all code.

### Scope

Pure normalization and routing, card primitives, safe Markdown, clipboard feedback, F6 adapter integration, transcript virtualization wiring, cache/source labels, deterministic UI fixtures, and DOM/CDP coverage. Syntax highlighting may remain disabled or plaintext in this phase; no user-visible action may depend on it.

### Concrete tasks

- Add `apps/pi-remote-web/src/rich-content/normalizeTranscriptBlocks.ts` with a pure `normalizeTranscriptBlocks` function. Carry `sessionId`, stable block identity, revision, sequence, source, redaction metadata, canonical source strings, and authoritative lifecycle/completeness. Pair shell call/result only by `callId`; retain a result-before-call pending state; ignore duplicate/lower revisions; derive stable fence ordinals from the source block identity; and never classify optimistic prompts.
- Add `apps/pi-remote-web/src/rich-content/RichContentRouter.tsx` with exhaustive routing for `command`, `code`, `text-artifact`, ordinary prose, Activity, diff, and safe fallback. The router must make malformed or legacy-incomplete content non-copyable and non-openable.
- Add `apps/pi-remote-web/src/rich-content/RichBlockFrame.tsx` for shared paper chrome, headings, metadata, status, redaction provenance, focus order, and action layout. Add `RedactionBadge.tsx` with visible, non-sensitive reason categories only.
- Add `apps/pi-remote-web/src/rich-content/CommandOutputCard.tsx` with separate Command/Output regions, exact lifecycle labels, tail-first output preview, clipped-line count, stable streaming geometry, no vertical inner scroll, `Copy command`, conditional `Copy output`/`Copy current output`, and `Open full screen`.
- Add `apps/pi-remote-web/src/rich-content/CodeCard.tsx` with escaped plaintext `<pre><code>`, allowlisted safe language labels, first-12-line/228px preview, horizontal code-only pan, line count, `Copy code`, and F6 Open. Do not add line numbers or a highlighter dependency to the first paint.
- Add `apps/pi-remote-web/src/rich-content/TextArtifactCard.tsx` with trusted labels, `Long text` heuristic labelling after settlement, six-line Source Serif preview, count, continuation indicator, `Copy text`, and F6 Open. Keep optimistic prompts and short prose outside this component.
- Add `apps/pi-remote-web/src/rich-content/SafeMarkdown.tsx` as a strict React AST renderer for the allowed CommonMark/GFM subset. Escape or omit raw HTML, scripts, forms, images, iframes, media, data URLs, remote embeds, unsafe links, and language-derived styles. Invalid or unsafe input falls back to plain text.
- Add `apps/pi-remote-web/src/rich-content/useCopyFeedback.ts` to call `navigator.clipboard.writeText` directly from `onPress`, preserve button focus, announce one named result through a persistent polite status region, hide the action when Clipboard API is missing, and expose the exact touch-and-hold recovery text on failure.
- Extend the existing F6 `ArtifactViewerProvider` seam with `apps/pi-remote-web/src/rich-content/F6ViewerAdapter.tsx`. Map command/output, code, and text-artifact blocks to the shared viewer’s frozen in-memory document without a fetch. If the F6 provider is in a separate existing location, modify that provider only through its established adapter boundary; do not mount a second `ModalOverlay`.
- Wire `apps/pi-remote-web/src/App.tsx` to normalize and route committed transcript blocks while keeping the provider outside the virtualized transcript. Update `src/state.ts` and `src/turns.ts` only where needed to preserve stable turn keys, source provenance, replay behavior, live-edge state, and optimistic prompt exclusion.
- Extend `apps/pi-remote-web/src/style.css` with the established light/dark card, shell-well, focus-ring, 44px action, safe-area, logical-property, reduced-motion, 320px reflow, and code-only horizontal-overflow rules. Do not introduce a new visual language, shadow system, or accent status color.
- Update `apps/pi-remote-web/src/relay.ts` to continue using only transcript page/sync reads for rich blocks. Opening, copying, wrapping, and closing must not call it. Update `src/cache.ts` and `public/service-worker.js` so rich bodies/highlight output are not newly persisted or service-worker cached; cache only the already-approved bounded transcript representation.
- Extend `apps/pi-remote-web/src/demo.ts` with deterministic core fixtures for every command lifecycle, output state, code fence, explicit artifact, long-text promotion, stale cache, unknown payload, result-before-call, optimistic prompt, and malformed fallback.
- Add focused tests such as `apps/pi-remote-web/tests/normalizeTranscriptBlocks.test.ts`, `RichContentRouter.test.tsx`, `CommandOutputCard.test.tsx`, `CodeCard.test.tsx`, `TextArtifactCard.test.tsx`, `SafeMarkdown.test.tsx`, `copy-feedback.test.tsx`, and `F6ViewerAdapter.test.tsx`. Extend `App.test.tsx`, `turns.test.tsx`, cache tests, and service-worker tests for integration, Strict Mode, virtualization, no-request behavior, and focus/scroll restoration.
- Extend `scripts/rich-content-cdp.mjs` with `rich-core` fixtures and scripted interactions for inline Copy, Open, Close, running tail, completed top, malformed fallback, and the four principal light/dark screenshots. Assert the measured viewport width rather than trusting screenshot pixel dimensions.

### Verification gate

Run all of the following:

```text
npm run typecheck
npm test
npm run test:web
npm run build
node scripts/rich-content-cdp.mjs --fixture rich-core --viewport-width 390 --theme light --output <temporary-directory>/f7-phase-2-light.png
node scripts/rich-content-cdp.mjs --fixture rich-core --viewport-width 390 --theme dark --output <temporary-directory>/f7-phase-2-dark.png
```

The gate is incomplete until the focused protocol/relay/web suites and full build pass; mocked `fetch`, WebSocket, ticket, filesystem, and host-call spies report zero rich-content calls; every visible action measures at least 44×44px; and the light/dark screenshots have been inspected at true 390 CSS pixels for safe-area clipping, no page overflow, stable card geometry, contrast, and focus-visible treatment.

### Acceptance

- The router renders shell calls/results, fenced code, explicit artifacts, and settled long text as the specified cards while leaving short prose, routine tools, thinking, usage, diffs, optimistic prompts, and unsafe/unknown blocks in their specified existing paths.
- Every Command/Output lifecycle and every code/text card state has the correct visible status, bounded preview, available actions, and canonical source.
- Copy tests prove exact string equality for command, output, code, text, current streaming output, and F6 Copy all, including whitespace and final newline.
- Copy success/failure/unavailable states preserve focus and expose the required announcement or recovery text without toast, network, worker, or permission-query dependency.
- F6 Open uses one shared React Aria full-screen viewer, pushes only the block ID into ephemeral history, traps focus, supports Close/Escape/Back/VoiceOver dismissal, restores scroll/focus, and changes no virtualized row height.
- F6 opens command/output at the correct top/tail position, keeps running follow mode at the live edge only, and exposes Jump to latest after upward scroll.
- Safe Markdown and all card previews cannot create executable/raw DOM or remote navigation, and redaction markers remain the only sensitive values visible to the browser and clipboard.
- True-390px light/dark screenshots show the card hierarchy, shell-well boundary, 44px controls, safe areas, no page horizontal scroll, and unchanged composer behavior.

This phase crosses the security posture because it adds an explicit clipboard export boundary and renders untrusted redacted Markdown/code in the DOM. Security/privacy review must inspect the canonical-source path, redaction provenance, clipboard behavior, hidden DOM, safe Markdown renderer, F6 history payload, and the no-network/no-ticket guarantees before enabling the cards for live sessions.

## Phase 3 — Progressive highlighting, performance, accessibility, and release hardening

### Objective

Reach the Claude-style inspection quality on supported devices without making highlighting, streaming, or large payloads a prerequisite for reading. Close the remaining performance, security, accessibility, visual, and physical-device gaps and produce release evidence for every state.

### Scope

Bounded worker highlighting, stale-response protection, large-content behavior, bidi/control presentation, streaming/live-edge hardening, full F6 reconciliation, contrast and reduced motion, memory cleanup, CDP state matrix, and oldest-supported-iPhone verification.

### Concrete tasks

- Add `apps/pi-remote-web/src/rich-content/useHighlightedCode.ts` and a dedicated `apps/pi-remote-web/src/rich-content/highlight.worker.ts` or equivalent worker module. Implement the initial allowlist for Bash, JavaScript, TypeScript, JSX/TSX, JSON, HTML, CSS, Markdown, Python, Go, Rust, YAML, SQL, diff, ANSI, and plaintext. Keep plaintext visible before worker completion and after all failures.
- Enforce the 20,000-character/1,000-line highlighting cutoff before worker dispatch. Worker messages contain only the already-redacted canonical source plus language, theme, content hash, request ID, and revision ID. Responses with stale request/revision IDs are ignored. Highlight output is memory-only and is cleared when the block revision changes, the viewer closes, or the session is discarded.
- Keep `CodeCard.tsx` and the F6 code renderer semantically selectable: token spans are ordinary React text nodes, language labels are safe text, no `dangerouslySetInnerHTML` is introduced, and unsupported/unknown languages remain plaintext.
- Harden `SafeMarkdown.tsx` and its test corpus against raw HTML, URL schemes, data URLs, image/media nodes, forms, iframes, scripts, unsafe links, malformed nesting, ANSI bytes, and bidirectional controls. If an invisible-character presentation is added, make it an explicit read-only view while keeping verbatim Copy unchanged.
- Extend `CommandOutputCard.tsx`, `F6ViewerAdapter.tsx`, and the viewer provider integration to prove revision reconciliation, stale cache labels, connection-loss states, terminal-without-result, source removal, running tail behavior, jump-to-latest, and no refocus/reopen on replay. Keep the last trustworthy redacted snapshot when the source disappears.
- Update `apps/pi-remote-web/src/style.css` and the viewer styles for light/dark shell wells, syntax-token contrast, two-color focus rings, logical properties, RTL prose, 200% text, 320px/landscape reflow, safe-area insets, contained overscroll, and reduced-motion transitions of at most 100ms.
- Add cleanup instrumentation for worker termination, pending requests, timers, selection-preserving revision updates, event listeners, focus restoration, history entries, and scroll locks. Repeated opening and closing of large code/text blocks must not accumulate workers, timers, DOM, or cached source copies.
- Extend `apps/pi-remote-web/tests/` with large-block, worker, stale-response, reduced-motion, contrast, bidi, RTL, 200% text, overflow, focus/scroll, virtualized-row, cache, and repeated open/close tests. Add security-negative coverage to `apps/pi-remote-relay/tests/security/negative-controls.test.ts`, `redaction.test.ts`, and protocol guard tests for every new field that reaches the worker or clipboard.
- Extend `apps/pi-remote-relay/tests/integration/recorded-fixture-flow.test.ts` and `transcript-projector.test.ts` with real recorded streaming/replay sequences, more-redacted higher revisions, connection loss, truncation, and no-secret propagation. Confirm the relay remains on existing `transcript:read`/`sync:read` authority paths.
- Extend `scripts/rich-content-cdp.mjs` with `rich-release` fixtures for the complete state matrix. Capture true 390 CSS-pixel light/dark screenshots for inline command, inline code, inline text, completed F6, running F6 tail, failure/truncation, stale cache, malformed fallback, 200% text, and reduced motion. Add assertions for page overflow, action hit boxes, modal focus, viewer scroll, and row-height/live-edge stability.
- Run the installed-PWA physical-device checklist on the oldest supported iPhone in portrait and landscape: Safari and standalone mode, VoiceOver, Voice Control, native long-press selection, external keyboard, Back/edge-back, app suspension/bfcache recovery, relay loss, RTL, 200% text, reduced motion, shell output streaming, large code, and repeated viewer open/close.

### Verification gate

Run all of the following:

```text
npm run typecheck
npm test
npm run test:web
npm run lint
npm run build
node scripts/rich-content-cdp.mjs --fixture rich-release --viewport-width 390 --theme light --output <temporary-directory>/f7-phase-3-light.png
node scripts/rich-content-cdp.mjs --fixture rich-release --viewport-width 390 --theme dark --output <temporary-directory>/f7-phase-3-dark.png
```

The gate is complete only when all automated suites and lint pass, the CDP runner reports exactly 390 CSS pixels for every requested fixture, both theme screenshots are inspected, and the physical-device checklist is complete. The screenshot review must record no clipped safe-area controls, no page-level horizontal overflow, no text contrast failure, no syntax-token failure, no live-edge jump, and no modal focus escape.

### Acceptance

- Plaintext first paint and worker/highlighter failure remain fully readable, selectable, and copyable for every supported and unsupported language.
- Highlighting is never attempted above the configured size cutoff, never receives unredacted content, never persists source/token output, and never lets a stale worker response overwrite a newer revision.
- All command, code, artifact, viewer, cache, connection, truncation, malformed, and fallback states are reachable from deterministic fixtures and match the feature spec’s labels and actions.
- Streaming has stable geometry, no continuous accessibility announcements, no forced tail movement after the reader scrolls away, and correct follow/jump behavior at the 96px threshold.
- F6 history contains only an opaque block ID; open/close/replay/revision changes restore focus and transcript scroll, do not add duplicate entries, and never issue a network or mutation request.
- Dangerous Markdown/HTML/URL/ANSI/bidi inputs cannot create executable DOM, unsafe styles, navigation, remote fetches, or misleading accessible output.
- Light/dark, 320px/390px/430px, portrait/landscape, RTL, 200% text, external keyboard, VoiceOver, Voice Control, and reduced-motion checks pass without violating the fixed visual system or WCAG AA requirements.
- Repeated large-block open/close cycles release worker, timer, listener, history, selection, and source-cache resources; no monotonic memory or live-DOM growth is observed in the supported-device check.
- Repository negative controls find no Run, Retry, Edit, Approve, Apply, Download, Publish, Open-on-host, Share-file, raw-HTML, filesystem, mutation-ticket, or rich-content fetch path added by F7.
- The release evidence contains the typecheck, test, lint, build, true-390px light/dark screenshots, automated accessibility/security results, and the oldest-supported-iPhone sign-off.

This phase crosses the security posture because it sends redacted content through a worker, adds the final safe Markdown/control-character handling, and completes the clipboard/viewer disclosure review. Security/privacy sign-off must verify worker messages and caches, raw-DOM prevention, bidi/ANSI treatment, Universal Clipboard disclosure, F6 history, app-switcher/bfcache exposure, and the absence of any new host or mutation authority.
