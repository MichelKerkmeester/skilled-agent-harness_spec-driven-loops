# Spec 002 — Cross-feature build roadmap

## Recommended order

Build in this order:

**F1 → F2 → F3 → F4 → F6 → F7 → F5 → F8**

This sequence keeps the lowest-risk host-authoritative hardening first, settles the shared composer before adding more composer entry points, establishes one read-only artifact viewer before any feature depends on it, and postpones both binary content lanes until their security boundaries are ready.

- **F1 → F2:** F1 establishes the host-confirmed runtime revision, one-use mutation path, and canonical model/effort sheet. F2 is a comparatively cheap hardening pass over the same non-optimistic runtime control pattern: reconciliation, bounded outcomes, and a shared sheet. It is a useful warm-up before the larger composer and plan-mode changes.
- **F2 → F3 → F4:** F3 depends on a stable `SessionComposer`, draft reducer, send boundary, and keyboard/focus rules. F4 then adds the persistent mode control and composer-scoped shortcut after slash completion and the existing `+` browser have a settled interaction contract. This avoids making three simultaneous owners of composer focus, selection, and mutation state.
- **F4 → F6:** F4 locks the host-enforced read-only/build distinction and structured protocol state. F6 can then add a substantial read-only inspection surface without introducing another authority model, while its immutable artifact and redaction contracts become the foundation for later content rendering.
- **F6 → F7:** F6 owns the full-screen React Aria viewer shell, history, focus restoration, safe-area behavior, immutable revision reads, and renderer boundaries. F7 is deliberately partial and UI-oriented: it promotes already-redacted tool evidence into typed cards, adds bounded previews and Copy, and reuses that viewer rather than creating a second modal or file path.
- **F7 → F5:** Once the transcript renderer, `ActivityGroup` rules, `SessionComposer`, and `+` menu have stopped moving, F5 can add the first new binary lane: user-selected photos entering Pi. F5 remains later because it crosses from a read-only client into ticketed upload, quarantine, normalization, prompt commit, and provider delivery.
- **F5 → F8:** F8 is last. It adds the other binary lane—image content arriving from Pi or an approved host extension—and must intercept, sanitize, redact, store, and publish bytes before they touch stdout, session persistence, or transcript JSON. F8 also reuses F6’s viewer and benefits from F5’s established image limits and binary-lane threat model, but its host integration and pixel-redaction risks are higher.

The syntheses do not reveal a dependency that changes this order. They reinforce it: F2 replaces F1’s nested effort control, F3 and F4 both touch the composer, F7 and F8 explicitly depend on F6’s viewer, and F8 aligns its image normalization with F5’s contract. F7’s UI-only scope is therefore safe to place before the binary work; F8 remains the final feature because it has the highest upstream and redaction uncertainty.

## Feature decisions and phase manifests

**F1 — Change model.** Replace the nested picker with one host-authoritative bottom sheet using React Aria modal, autocomplete, and grouped list primitives. Browsing and staging remain read-only; only explicit confirmation obtains a one-use, revision-bound ticket, and the header changes only after host acceptance. Its `implementation-phases.md` defines **3 phases**.

**F2 — Change effort.** Add a reusable radio-row effort picker inside the canonical model/effort sheet and expose the same surface from the runtime strip. Keep confirmed state non-optimistic, disable streaming changes until host semantics are known, and turn failures into recoverable redacted states. Its `implementation-phases.md` defines **4 phases**.

**F3 — Slash commands.** Add a nonmodal, composer-anchored autocomplete driven only by the relay’s live command catalog. Selecting a row inserts editable canonical text and performs no network mutation; only explicit Send performs fresh catalog, revision, and ticket checks. Its `implementation-phases.md` defines **4 phases**.

**F4 — Plan mode tab.** Add an always-visible host-confirmed mode button, structured Plan lifecycle, composer-scoped `Shift+Tab`, and an atomic reviewed-plan execution operation. Build, Plan, Plan ready, and Executing plan remain distinct; the phone never infers authority or submits `/plan` as chat. Its `implementation-phases.md` defines **5 phases**.

**F6 — File preview.** Build the first openable redacted file card and a history-backed, full-screen read-only viewer over immutable relay-issued snapshots. The viewer supports typed safe renderers and explicit revision identity, never a path-based workspace read. Its `implementation-phases.md` defines **4 phases**.

**F7 — Rich content blocks.** Add typed Bash Command/Output, code, and text-artifact projections with bounded inline previews, unit-level Copy, and explicit Open actions. Shell evidence leaves the quiet `ActivityGroup`, routine tools remain grouped, and the feature restyles `tool_call`/`tool_result` evidence while reusing F6’s viewer shell. No `implementation-phases.md` is present, so **0 phases are currently defined**; a phase manifest is required before build work starts.

**F5 — Media upload.** Add a photos-only local draft lane through the existing `+` menu, with explicit review before Send, revision-bound upload tickets, quarantine normalization, Pi image blocks, and metadata-only durable transcript cards. It is a deliberate exception to read-only-by-default and excludes arbitrary files, video, audio, and reusable previews. Its `implementation-phases.md` defines **5 phases**.

**F8 — Inbound media.** Add a promoted, metadata-only `inbound_image` block whose sanitized JPEG/PNG variants live in the existing F6 artifact store. Publication is a separate ticketed host-to-relay binary lane; reads are exact-tuple authenticated reads, and no Share, Save, Copy Image, or automatic re-submission is added. No `implementation-phases.md` is present, so **0 phases are currently defined**; a phase manifest is required after the security gate and before build work starts.

## Cross-cutting sequencing

- **Composer `+` menu:** F3 first preserves the existing browser while sharing its catalog and insertion rules with inline slash completion. F4 then reserves the persistent Mode control and keeps `+ → Mode` as a secondary route. F5 is the only later expansion: add Photo Library and Take Photo at the top, followed by the existing mode and command groups. No feature should create a parallel menu or picker.
- **`SessionComposer`:** F1/F2 stabilize host runtime state and mutation guards; F3 owns the controlled draft, caret, IME, autocomplete, and explicit-send boundary; F4 adds mode shortcuts without taking over textarea focus; F5 adds an in-memory attachment draft and submission coordinator. Establish these ownership boundaries before F5 so file objects, tickets, captions, and prompt text do not churn through the same reducer.
- **Transcript renderer and `ActivityGroup`:** F6 first makes the existing redacted diff path openable. F7 then introduces identity- and revision-based rich-block normalization, promotes shell command/result evidence out of `ActivityGroup`, and leaves routine tools grouped. F5 adds a pixel-free attachment block after that routing contract is stable. F8 adds `inbound_image` as a sibling block outside collapsible tool details so images remain visible when activity is collapsed. Every new kind must retain an exhaustive safe fallback for older clients.
- **F6 viewer shell:** F6 is the single owner of `ArtifactViewerProvider`, modal history, focus/scroll restoration, exact-revision reads, object-URL cleanup, and renderer safety. F7 consumes it through an adapter for code, text, and command/output. F8 consumes the same shell and read contract for verified image variants. F5’s local pre-send photo preview must not become a second artifact viewer; it should reuse compatible modal primitives or remain clearly local and non-shareable.
- **Redaction projector and protocol content-block types:** F1–F4 keep control envelopes and host revisions authoritative. F6 defines immutable artifact identity and allowlisted read metadata; F7 propagates redaction provenance through normalized blocks; F5 adds a metadata-only `attachment` kind and keeps pixels out of durable DTOs; F8 adds `inbound_image` with the same artifact-reference discipline. Binary bytes, base64, tickets, paths, filenames, and provider payloads must never enter transcript JSON, persistence, logs, or caches.

## Hard gates

These are release-blocking gates, not ordinary phase acceptance checks:

1. **F5 adversarial security/redaction review:** before F5 Phase 1 starts, review and sign off the spec’s binary ingress, exact-key and ticket binding, spoofed/polyglot/animated/decompression-bomb handling, quarantine cleanup, metadata stripping, Pi/provider persistence boundary, idempotency, plan-mode enforcement, and log/cache/transcript redaction. The review must demonstrate that a failed or ambiguous upload cannot invoke Pi twice or leave recoverable raw media.
2. **F8 adversarial security/redaction review:** before any F8 build phase starts, review and sign off the host interception boundary, publication ticket and revision CAS, decoder and pixel-redaction failure behavior, exact-tuple artifact reads, CSP/no-store/cache rules, background/revocation cleanup, old-client fallback, and the prohibition on image-derived authority or automatic re-submission. If Pi cannot intercept image content before stdout or session persistence, F8 remains disabled.

F7’s phase manifest and F8’s phase manifest are also prerequisites for implementation scheduling. Their absence is recorded here so the roadmap does not imply unreviewed or invented phase boundaries.

## Dependency summary

| Upstream | Downstream leverage |
|---|---|
| F1 | Gives F2 the canonical sheet and gives later controls a proven host-confirmed, revision-bound mutation pattern. |
| F2 | Hardens runtime reconciliation and mutation guards before composer-wide keyboard and focus work. |
| F3 | Settles `SessionComposer`, slash filtering, catalog scoping, and explicit Send before F4 and F5 add more composer actions. |
| F4 | Establishes authoritative Plan/build enforcement that F5 media input and F7/F8 read surfaces must not bypass. |
| F6 | Unblocks F7 and F8’s shared full-screen viewer, exact-revision reads, focus restoration, and safe renderer lifecycle. |
| F7 | Stabilizes rich-block routing and `ActivityGroup` presentation before F5/F8 add new durable content kinds. |
| F5 | Supplies the outbound image normalization and binary-lane security precedent that reduces design variance for F8; it does not authorize inbound reuse of upload IDs or bytes. |

