---
title: "Implementation Plan: /interface:* creation commands"
description: "Build plan for the interface creation commands per the 002 recommendation."
_memory:
  continuity:
    packet_pointer: "sk-design/012-style-database-and-interface-commands/004-interface-commands"
    last_updated_at: "2026-07-19T10:03:20Z"
    last_updated_by: "implementation-engineer"
    recent_action: "Completed the shared contract, canonical commands, aliases, registration, and verification"
    next_safe_action: "Reviewer checks command wording and restarts OpenCode to load the new command surface"
    blockers: []
    key_files:
      - ".opencode/commands/design/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: /interface:* creation commands

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

Markdown command prompts under `.opencode/commands/interface/` + a shared reference under `sk-design/shared/`, mirroring the current `commands/design/` wrapper+asset pattern and the `sk-design` mode-registry/hub-router/command-metadata surface. Authoritative design: `../002-research-design-commands/research/research.md`.

### Overview

Author the shared creation contract, five `/interface:*` command templates, `/design:*` compatibility aliases, registration updates, and route/contract tests; keep internal modes unchanged.

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- 002 design available; current commands/design + sk-design surface + checkers readable.

### Definition of Done

- Five commands + shared contract + aliases exist; 4 sk-design checkers PASS; route/contract tests green; `validate.sh --strict` = 0 errors.

<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Thin wrapper commands over a shared creation contract; commands own choreography, modes own judgment, transports own retrieval/render, `sk-code` owns code mutation; additive alias migration.

### Key Components

- `sk-design/shared/creation-contract.md` (shared 9-stage contract).
- `commands/interface/{design,foundations,motion,audit,design-reference}.md` + assets.
- `commands/design/*.md` → aliases; `command-metadata.json` + `hub-router.json` registration.

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Shared contract + design command
- [x] Author `shared/creation-contract.md`. [SOURCE: `.opencode/skills/sk-design/shared/creation-contract.md`]
- [x] Author `/interface:design` against the contract; prove the route + output blocks. [TESTED: `interface-command-contract.test.mjs`]

### Phase 2: Specialize + aliases + registration
- [x] Author `/interface:{foundations,motion,audit,design-reference}`. [SOURCE: `.opencode/commands/interface/`]
- [x] Convert `/design:*` to aliases; update `command-metadata.json` + `hub-router.json`. [TESTED: `design-command-surface-check.mjs`]

### Phase 3: Verify
- [x] 4 sk-design checkers PASS; route/contract tests green; `validate.sh --strict`. [TESTED: 4 checker passes; Node TAP 16/16; strict 0 errors, 0 warnings]

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- sk-design `*-check.mjs` checkers (esp. `design-command-surface-check`) PASS for interface commands + design aliases; `node --test` route/contract suite covering correct route, common output blocks, alias routing, and rejection of copied taste / nested dispatch / evidence-free proof / silent amendment.

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- 002 research design; current `commands/design/*` + assets; `sk-design` mode-registry/hub-router/command-metadata + checkers.

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- Additive: `/interface:*` are new; `/design:*` remain as working aliases. Rollback = remove `commands/interface/` + revert the registration/alias edits; the original `/design:*` behavior is preserved throughout.

<!-- /ANCHOR:rollback -->
