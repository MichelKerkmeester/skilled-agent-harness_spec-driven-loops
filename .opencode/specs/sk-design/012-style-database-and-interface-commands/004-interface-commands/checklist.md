---
title: "Verification Checklist: /interface:* creation commands"
description: "Verification for the interface commands build."
_memory:
  continuity:
    packet_pointer: "sk-design/012-style-database-and-interface-commands/004-interface-commands"
    last_updated_at: "2026-07-19T10:03:20Z"
    last_updated_by: "implementation-engineer"
    recent_action: "Verified canonical commands, aliases, boundaries, checkers, tests, and packet completion"
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

# Verification Checklist: /interface:* creation commands

<!-- ANCHOR:protocol -->
## Verification Protocol

- Verify each item against real files + checker/test output. Mark `[x]` only with cited evidence (`[SOURCE: file:line]`, `[TESTED: ...]`).

<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] 002 design + current commands/design + sk-design surface/checkers read before authoring. [EVIDENCE: `../002-research-design-commands/research/research.md`; `.opencode/commands/design/`; `shared/scripts/*-check.mjs`]
- [x] CHK-002 [P1] Confirmed names used exactly (design, foundations, motion, audit, design-reference). [EVIDENCE: `.opencode/commands/interface/` contains the exact five action names]

<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Commands reference the shared contract; no copied mode taste/reference tables. [EVIDENCE: `node --test interface-command-contract.test.mjs` passed copied-table boundary scenarios in the 16/16 suite]
- [x] CHK-011 [P0] Internal workflow mode IDs unchanged; commands never invoke commands. [EVIDENCE: `node --test interface-command-contract.test.mjs` passed stable-mode and nested-dispatch scenarios in the 16/16 suite]
- [x] CHK-012 [P1] Each command exposes the common visible output blocks. [EVIDENCE: `node --test interface-command-contract.test.mjs` passed eight-block assertions across all five command packages]

<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Four sk-design checkers PASS (incl. design-command-surface-check) for interface + design aliases. [EVIDENCE: `design-command-surface-check.mjs` plus three sibling checkers exited 0; surface drift=0]
- [x] CHK-021 [P0] Route/contract test suite green (route, output, alias routing, boundary rejections). [EVIDENCE: `node --test` reports `# tests 16`, `# pass 16`, `# fail 0`]

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-030 [P0] `/design:*` aliases still route correctly (compatibility). [EVIDENCE: 5/5 alias mapping and `$ARGUMENTS` passthrough assertions passed]
- [x] CHK-031 [P1] `validate.sh --strict` for this phase = 0 errors. [EVIDENCE: `validate.sh --strict` reports 0 errors and 0 warnings]

<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-040 [P0] Exemplars are evidence-only; commands never mutate code directly (sk-code handoff boundary). [EVIDENCE: `shared/creation-contract.md`; command tool surfaces; `shared/sk-code-handoff.md`]

<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P1] Shared creation-contract reference documents the lifecycle, envelope, and proof labels. [EVIDENCE: `.opencode/skills/sk-design/shared/creation-contract.md`]

<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-060 [P1] New commands under `commands/interface/`; shared contract under `sk-design/shared/`; scoped edits only. [EVIDENCE: `.opencode/commands/interface/`; `.opencode/skills/sk-design/shared/creation-contract.md`]

<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

- [x] CHK-070 [P0] P0 met; checkers + tests + validate green; internal modes unchanged. [EVIDENCE: `node --test` passed 16/16 and all four required checker commands exited 0]
- [x] CHK-071 [P1] Handoff/state recorded in `implementation-summary.md`. [EVIDENCE: `implementation-summary.md` records completion, verification, limitations, and reviewer action]

<!-- /ANCHOR:summary -->
