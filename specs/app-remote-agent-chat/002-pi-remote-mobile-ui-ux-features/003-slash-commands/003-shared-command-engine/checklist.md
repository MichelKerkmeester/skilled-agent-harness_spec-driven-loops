# Checklist — Shared in-memory catalog and deterministic command engine

- [ ] One live session prefetches one catalog and shares it between consumers without browser persistence.
- [ ] Session switches, host-epoch changes, aborts, reconnects, foreground refreshes, and out-of-order responses cannot overwrite the current scoped snapshot.
- [ ] Ranking tests cover exact name, alias, prefix, boundary, substring, subsequence, description, hint, host-order ties, and no edit-distance correction.
- [ ] The `+` browser inserts exactly the canonical command string and revision binding used by the future inline route.
- [ ] Selection and filtering make zero ticket, prompt, mutation, submission, telemetry-content, or Pi RPC requests.
- [ ] Trigger parsing is independent from transport/filtering, and command-token edits clear bindings while argument edits retain them.
- [ ] No client fallback catalog or inferred command metadata is introduced; the phase remains read-only.
- [ ] `npm run typecheck` passes.
- [ ] The targeted `CommandPalette`, ranking, trigger, and insertion Vitest command passes.
- [ ] `npm run test:web` passes.
- [ ] CDP captures the existing `+` browser and composer at exactly 390 CSS pixels in light and dark.
- [ ] Catalog refresh produces no composer displacement or visual regression.

