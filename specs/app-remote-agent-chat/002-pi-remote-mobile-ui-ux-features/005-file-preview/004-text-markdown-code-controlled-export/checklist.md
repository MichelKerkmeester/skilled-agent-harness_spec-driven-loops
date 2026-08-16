# Checklist — Text, Markdown, code, and controlled export

- [ ] Text, Markdown, code, and diff render the exact received bytes of the frozen revision.
- [ ] Markdown renders a strict inert AST; raw HTML, remote images, frames, executable links, and external navigation never execute.
- [ ] Code is readable before highlighting completes; highlighting failure leaves plain text; line numbers cannot be selected or copied.
- [ ] Native selection, Find, Copy, keyboard alternatives, and applicable Wrap work without stealing native long-press or horizontal pan.
- [ ] Delayed A/B resources cannot place one artifact’s content under another title, revision, or Share action.
- [ ] Close, revoke, expiry, and replacement prevent late commits and remove object URLs, workers, buffers, and DOM payloads.
- [ ] Loading, stalled, ready, empty, whitespace-only, partial-redaction, truncated, stale, offline, denied, expired, missing, conflict, corrupt, too-large, rate-limited, relay-error, revoked, aborted, and exiting states have explicit tested behavior.
- [ ] Share is shown only when policy and capability permit it, uses only the displayed revision, confirms redaction/truncation, never mints a URL, and treats cancellation as a no-op.
- [ ] Raw relay/server diagnostics do not reach the UI.
- [ ] Text-like bodies, prepared Files, object URLs, and share buffers are absent from persisted cache state.
- [ ] `npm run typecheck` passes.
- [ ] `npm test` passes.
- [ ] `npm run test:web` passes with race, cleanup, selection/copy, share, and cache coverage.
- [ ] The light text/code/share CDP command passes at exactly 390 CSS pixels and its screenshot is inspected.
- [ ] The dark text/code/share CDP command passes at exactly 390 CSS pixels and its screenshot is inspected.
- [ ] Phase 1 and Phase 2 exact-revision, redaction, focus/history, and cache/service-worker boundaries remain green.

