---
title: "Tasks: Pi devin/cursor parity alignment"
description: "Task breakdown for closing three gaps between cli-pi and its cli-devin/cli-cursor siblings."
trigger_phrases: ["pi devin cursor parity alignment tasks"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/031-cli-pi-creation/014-pi-devin-cursor-parity-alignment"
    last_updated_at: "2026-07-27T21:50:00Z"
    last_updated_by: "claude-code"
    recent_action: "All tasks executed with real evidence; GLM-5.2 reviewed, findings addressed"
    next_safe_action: "None -- phase complete"
    blockers: []
    key_files: ["references/pi-tools.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-pi-creation-alignment", parent_session_id: null }
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Pi devin/cursor parity alignment

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Catalog `cli-devin`, `cli-cursor`, and `cli-pi`'s current skill-packet content [EVIDENCE: workflow `wf_f578832c-f69`, 3 parallel agents, 343,812 tokens, 63 tool calls]
- [x] T002 [P] Direct-read `cli-pi`'s own `prompt-templates.md`, `integration-patterns.md`, `native-skills-and-extensions.md`, `mcp-and-third-party-packages.md`, `cli-reference.md` [EVIDENCE: full Read calls on each before any edit]
- [x] T003 [P] Direct-read `cursor-tools.md`, `devin-tools.md`, and both siblings' `integration-patterns.md` cross-validation/anti-patterns sections [EVIDENCE: full Read calls on each]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Author `references/pi-tools.md` [EVIDENCE: file created, 8 sections, `validate_document.py` VALID 0 issues]
- [x] T005 Upgrade confidence framing in `native-skills-and-extensions.md` (§§3-4/7, citing phases 012/013) and `mcp-and-third-party-packages.md` (§§2-4, citing phases 007/012) [EVIDENCE: diffs show phase-cited corrections replacing "Per Pi docs, unconfirmed" language]
- [x] T006 Add CROSS-VALIDATION WITH OTHER CLI EXECUTORS and ANTI-PATTERNS sections to `integration-patterns.md`; correct its stale confidence note [EVIDENCE: 2 new sections, 5 named anti-pattern BAD/GOOD pairs]
- [x] T007 Insert a new OVERVIEW section into `agent-delegation.md`, `model-dispatch-gpt-5.6.md`, `native-skills-and-extensions.md`, `mcp-and-third-party-packages.md`, `integration-patterns.md`; renumber each [EVIDENCE: `insert_overview.py` run per file; `agent-delegation.md`'s `2A` sub-section hand-corrected to `3A` since the script's regex didn't match lettered sections]
- [x] T008 Audit every `§N` cross-reference across every touched file by hand; correct mismatches from the renumbering shift [EVIDENCE: 6 real mismatches found and fixed across `native-skills-and-extensions.md`, `mcp-and-third-party-packages.md`, `pi-tools.md` -- all pointed at a sibling file's own unshifted or differently-timed section number]
- [x] T009 Rewrite `assets/prompt-templates.md` with a new OVERVIEW/flag-reference section, a concrete Example under every template, and a new Gate-3-bypass template [EVIDENCE: file rewritten, `validate_document.py` VALID 0 issues]
- [x] T010 [P] Update `SKILL.md` §5 and `README.md` §5/§9 to link `pi-tools.md`; regenerate `leaf-manifest.json` [EVIDENCE: `generate-leaf-manifest.cjs --write`, `parent-skill-check.cjs` `10b-byte-drift` PASS]
- [x] T011 [P] Fix 2 pre-existing `h2_not_uppercase` issues in `mcp-and-third-party-packages.md` [EVIDENCE: `validate_document.py --fix`, re-validated 0 issues]
- [x] T012 Bump `version:` to `1.1.0.0` on every touched file; author `changelog/v1.1.0.0.md` [EVIDENCE: `grep version:` across all touched files shows `1.1.0.0`; changelog file created]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 `validate_document.py --type reference` on all 9 touched/new markdown files [EVIDENCE: each reports `VALID, 0 issues`]
- [x] T014 `parent-skill-check.cjs` on the hub [EVIDENCE: `OK: parent-skill-check -- all hard invariants passed, 0 warnings`]
- [x] T015 GLM-5.2 independent review [EVIDENCE: verdict REQUEST CHANGES -> 1 blocking + 3 minor findings (all about `cli-devin`/`cli-cursor` factual claims: a reasoning-effort mechanism wrongly attributed to `cli-devin`, a model-id separator typo, session-flag conflation, a phase-007 scope overstatement) -> all 4 fixed -> re-validated clean]
- [x] T016 Whole-packet spec-kit `validate.sh --recursive --strict` (parent + all 14 phases) [EVIDENCE: see `implementation-summary.md`]
- [x] T017 Author `implementation-summary.md` [EVIDENCE: this document]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` with real evidence
- [x] No `[B]` blocked tasks remaining
- [x] `validate.sh --strict` exits with `Errors: 0` for this phase folder
- [x] GLM-5.2 review completed, findings addressed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- Depends on `../007-pi-mcp-host-integration/`, `../012-pi-runtime-compatibility/`, `../013-pi-manual-testing-playbook-authoring/`
- Terminal phase of `031-cli-pi-creation` -- no successor
<!-- /ANCHOR:cross-refs -->

---

## RELATED DOCUMENTS
- `spec.md`, `plan.md`, `checklist.md`
