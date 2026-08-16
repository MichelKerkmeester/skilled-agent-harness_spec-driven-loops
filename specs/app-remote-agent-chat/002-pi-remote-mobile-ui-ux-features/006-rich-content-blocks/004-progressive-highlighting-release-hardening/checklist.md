# Checklist — Progressive highlighting, accessibility, and release hardening

- [ ] Plaintext first paint and worker/highlighter failure remain readable, selectable, and copyable for every supported and unsupported language.
- [ ] Highlighting is skipped above the configured cutoff, receives no unredacted content, persists no source/token output, and cannot let stale worker output overwrite a newer revision.
- [ ] Deterministic fixtures reach every command, code, artifact, viewer, cache, connection-loss, truncation, malformed, and fallback state with the specified labels/actions.
- [ ] Streaming has stable geometry, no continuous accessibility announcements, no forced tail movement after upward scroll, and correct 96px follow/jump behavior.
- [ ] F6 history contains only an opaque block ID; open/close/replay/revision changes restore focus and scroll, avoid duplicate entries, and make no network or mutation request.
- [ ] Dangerous Markdown/HTML/URL/ANSI/bidi input cannot create executable DOM, unsafe styles, navigation, remote fetches, or misleading accessible output.
- [ ] Light/dark, 320px/390px/430px, portrait/landscape, RTL, 200% text, external keyboard, VoiceOver, Voice Control, and reduced-motion checks pass with the fixed design system and WCAG AA.
- [ ] Repeated large-block open/close cycles release worker, timer, listener, history, selection, and source-cache resources without monotonic memory or live-DOM growth.
- [ ] Negative controls find no Run, Retry, Edit, Approve, Apply, Download, Publish, Open-on-host, Share-file, raw-HTML, filesystem, mutation-ticket, or rich-content fetch path.
- [ ] Release evidence includes typecheck, tests, lint, build, true-390px light/dark screenshots, automated accessibility/security results, and oldest-supported-iPhone sign-off.
- [ ] `npm run typecheck` passes.
- [ ] `npm test` passes.
- [ ] `npm run test:web` passes.
- [ ] `npm run lint` passes.
- [ ] `npm run build` passes.
- [ ] Every `rich-release` CDP run reports exactly 390 CSS pixels and the inspected captures show no clipped safe-area controls, page overflow, contrast failure, syntax-token failure, live-edge jump, or modal focus escape.
- [ ] The oldest-supported-iPhone checklist passes in Safari and installed-PWA standalone mode, portrait and landscape, including VoiceOver, Voice Control, external keyboard, native selection, Back/edge-back, suspension/bfcache recovery, relay loss, RTL, 200% text, reduced motion, streaming, large code, and repeated viewer cycles.
- [ ] Security/privacy release review covers worker messages/caches, raw-DOM prevention, bidi/ANSI handling, Universal Clipboard disclosure, F6 history, app-switcher/bfcache exposure, and absence of host or mutation authority.
