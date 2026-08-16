# Checklist — Openable redacted diff foundation

- [ ] Existing diff cards remain compact and do not auto-open.
- [ ] The whole card is one accessible button; the six-line peek is noninteractive.
- [ ] Pressing the card opens one full-screen labelled dialog and focuses the first safe heading.
- [ ] The exact received patch is rendered with visible `+`/`−` prefixes.
- [ ] Opening the diff makes no `fetch`, WebSocket, filesystem/path, or tool request.
- [ ] Close, Escape, browser Back, iOS edge-back, and VoiceOver scrub return to the same session.
- [ ] Chat scroll position and originating-card focus are restored, with the transcript fallback when virtualization removed the trigger.
- [ ] Second-source replacement and close-during-opening cannot commit stale viewer state.
- [ ] The locked ink-on-parchment light/dark system, safe areas, focus rings, reduced motion, and 390px reflow are verified.
- [ ] `npm run typecheck` passes.
- [ ] `npm run test:web` passes, including the negative filesystem-request control.
- [ ] The light CDP command passes at exactly 390 CSS pixels and its screenshot is inspected.
- [ ] The dark CDP command passes at exactly 390 CSS pixels and its screenshot is inspected.
- [ ] Temporary screenshot output is outside the repository and no application, protocol, relay, or `001-research` file changed.

