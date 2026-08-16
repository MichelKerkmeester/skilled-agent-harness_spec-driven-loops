# Spec 002 — Folder & Phase Architecture

One **phase per feature**. Inside each feature, phase **001 is research**; the
build work follows as numbered phases in `implementation-phases.md`.

- **8 feature phases · 80 research iterations · 8 syntheses · 8 specs · 34 build phases**
- Build order (see `ROADMAP.md`): **F1 → F2 → F3 → F4 → F6 → F7 → F5 → F8**
  (partials / UI-only first; the two security-crossing binary lanes — F5 upload, F8 inbound media — last, each gated on an adversarial security review)

---

## Folder tree

```
specs/002/
├── README.md                     ← spec overview + budgets
├── ROADMAP.md                    ← build order, cross-cutting table, security gates
├── ARCHITECTURE.md               ← this file
├── _run.log / _synth.log / _specdocs.log
│
├── <Fn-feature>/                 ← FEATURE PHASE
│   ├── spec.md                   ← build spec (decision · scope · acceptance · security)
│   ├── implementation-phases.md  ← the feature's build phases
│   └── 001-research/             ← research sub-phase
│       ├── BRIEF.md
│       ├── SYNTHESIS.md          ← build-ready decision (SOL xhigh)
│       └── iter-NN-<model>.md    ← independent cited passes (DeepSeek / SOL / Grok)
│
└── … one folder per feature below
```

Per-feature research lane makeup:
- **YES tier** (F1, F2): 5 × DeepSeek (`iter-01..05-deepseek`).
- **PARTIAL tier** (F3, F4, F6, F7): 5 × SOL + 5 × Grok (`iter-01..05-sol`, `iter-06..10-grok`).
- **NO / security-crossing** (F5, F8): 5 × SOL + 5 × Grok + 5 × DeepSeek (`…-sol`, `…-grok`, `iter-11..15-deepseek`).

---

## Phase hierarchy (in build order)

```
Spec 002
│
├── F1 — Change model            [YES · research 5]  →  3 build phases
│   ├── 001 Research
│   ├── Phase 1 — Protocol, redaction, and bound runtime authority
│   ├── Phase 2 — Functional model switcher sheet and state machine
│   └── Phase 3 — iPhone interaction, accessibility, visual, and release hardening
│
├── F2 — Change effort           [YES · research 5]  →  4 build phases
│   ├── 001 Research
│   ├── Phase 1 — Typed host snapshot, reconciliation, and redacted outcomes
│   ├── Phase 2 — Complete runtime state machine and mutation boundary
│   ├── Phase 3 — Canonical sheet, effort rows, and shared entry points
│   └── Phase 4 — Accessibility, visual hardening, and device proof
│
├── F3 — Slash commands          [PARTIAL · research 10]  →  4 build phases
│   ├── 001 Research
│   ├── Phase 1 — Versioned catalog authority and fail-closed submission
│   ├── Phase 2 — Shared in-memory catalog and deterministic command engine
│   ├── Phase 3 — Inline terminal-style autocomplete surface
│   └── Phase 4 — Explicit Send integration and iPhone/PWA hardening
│
├── F4 — Plan mode + Tab         [PARTIAL · research 10]  →  5 build phases
│   ├── 001 Research
│   ├── Phase 1 — Protocol and relay authority contract
│   ├── Phase 2 — Host enforcement and structured plan lifecycle
│   ├── Phase 3 — Persistent composer control and keyboard affordance
│   ├── Phase 4 — Plan-ready card, review sheet, and atomic execution
│   └── Phase 5 — Accessibility, PWA layout, and release hardening
│
├── F6 — File preview            [PARTIAL · research 10]  →  4 build phases
│   ├── 001 Research
│   ├── Phase 1 — Openable redacted diff foundation
│   ├── Phase 2 — Relay-authorized immutable artifact contract
│   ├── Phase 3 — Text, Markdown, code, and controlled export
│   └── Phase 4 — Image/PDF renderers and device release hardening
│
├── F7 — Rich content blocks     [PARTIAL · research 10]  →  3 build phases   (reuses F6 viewer)
│   ├── 001 Research
│   ├── Phase 1 — Authoritative rich-block contract and redacted projection
│   ├── Phase 2 — Inline cards, exact Copy, and F6 inspection
│   └── Phase 3 — Progressive highlighting, performance, accessibility, and release hardening
│
├── F5 — Media upload            [NO · research 15]  →  5 build phases   ⚠ security-review gate
│   ├── 001 Research
│   ├── Phase 1 — Protocol contracts and fail-closed capability gate
│   ├── Phase 2 — Ticketed binary ingress, quarantine, and cleanup
│   ├── Phase 3 — Normalized Pi image bridge and redacted transcript
│   ├── Phase 4 — Local composer draft, preview, and redacted-card UI
│   └── Phase 5 — End-to-end submission, reconciliation, and release enablement
│
└── F8 — Inbound media preview   [NO · research 15]  →  6 build phases   ⚠ security-review gate
    ├── 001 Research
    ├── Phase 1 — Protocol and pre-stdout capability boundary
    ├── Phase 2 — Ticketed publication, sanitization, and atomic artifact storage
    ├── Phase 3 — Exact read lane and shared F6 viewer/resource foundation
    ├── Phase 4 — Transcript projection and inline image card
    ├── Phase 5 — Fullscreen interaction, privacy lifecycle, and accessibility hardening
    └── Phase 6 — Approved host enablement, security signoff, and release
```

---

## Summary

| Build # | Feature | Tier | Research iters | Build phases |
|:-------:|---------|------|:--------------:|:------------:|
| 1 | F1 Change model | YES (harden) | 5 | 3 |
| 2 | F2 Change effort | YES (harden) | 5 | 4 |
| 3 | F3 Slash commands | PARTIAL | 10 | 4 |
| 4 | F4 Plan mode + Tab | PARTIAL | 10 | 5 |
| 5 | F6 File preview | PARTIAL | 10 | 4 |
| 6 | F7 Rich content blocks | PARTIAL | 10 | 3 |
| 7 | F5 Media upload | NO ⚠ | 15 | 5 |
| 8 | F8 Inbound media preview | NO ⚠ | 15 | 6 |
| | **Total** | | **80** | **34** |

⚠ = crosses the read-only security posture (new binary lane); requires an adversarial
security/redaction review of its `spec.md` before any build phase starts.

Cross-cutting reuse: F7 restyles the tool/evidence renderer and shares F6's full-screen
viewer shell; F8 reuses that same viewer for inbound images. Build F6 → F7 → F8 in that
order to avoid rework in the transcript/viewer layer.
