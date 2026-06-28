---
title: "Tasks: Application-witness (loaded-determinative)"
description: "Ordered implementer items to add an APPLICATION WITNESS section to the application proof card and an additive proof_check.py --require-application-witness classifier flag, with classify + no-regression + py_compile verification."
trigger_phrases:
  - "application witness tasks"
  - "loaded determinative design build"
  - "proof_check require application witness"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/003-d3-routing-utilization/010-application-witness"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Mark all application-witness build and verification tasks complete with evidence"
    next_safe_action: "Let the parent process refresh description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/shared/assets/proof_of_application_card.md"
      - ".opencode/skills/sk-design/shared/scripts/proof_check.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Application-witness (loaded-determinative)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [effort]`

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Re-read targets fully and study the just-landed SOURCE PROOF additive pattern (heading-scoped table parse + new `check()` key) to mirror it (`.opencode/skills/sk-design/shared/assets/proof_of_application_card.md`, `.opencode/skills/sk-design/shared/scripts/proof_check.py`) [10m] — both targets read in full; `--require-source-proof` confirmed as the pattern to mirror
- [x] T002 Add an `## 7. APPLICATION WITNESS` section to `proof_of_application_card.md`: classifier line (`not-loaded` / `loaded-inert` / `loaded-determinative`) + 4-column table `[Output choice, Loaded rule source, Classification, Counterfactual]` with a placeholder row; record the honest "observable effect on one choice, not taste" framing; place it as the new section after `SOURCE PROOF` (`.opencode/skills/sk-design/shared/assets/proof_of_application_card.md`) [15m] — section present with the table, classifier line, and the observable-effect-not-taste framing
- [x] T003 Extend the footer gate hint to document the stricter `--require-application-witness` mode (`.opencode/skills/sk-design/shared/assets/proof_of_application_card.md`) [5m] — footer hint names `--require-application-witness`

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Arg parsing (additive)
- [x] T004 [P] Add the `--require-application-witness` token to arg parsing beside `--json` / `--require-cards` / `--require-source-proof`; keep `paths` filtering on the `--` prefix intact and update the usage string (`.opencode/skills/sk-design/shared/scripts/proof_check.py`) [10m] — token parsed in `main()`; `paths` filter intact; usage string lists the flag

### APPLICATION WITNESS parsing
- [x] T005 Implement a parser that locates the `/APPLICATION WITNESS/i` heading, reads the first markdown table beneath it (until the next heading), extracts 4-cell rows in fixed order `[Output choice, Loaded rule source, Classification, Counterfactual]`, and skips the header, the `|---|` separator, and placeholder rows (underscores/whitespace/empty with an unchecked classification) — mirroring `_find_source_proof_rows` (`proof_check.py`) [25m] — `_find_application_witness_rows` implemented to that contract

### Classification + verdict
- [x] T006 Add checkbox-aware classification regexes (the checked `[x]` form) for `not-loaded` / `loaded-inert` / `loaded-determinative`, and classify each parsed row from its `Classification` cell (`proof_check.py`) [15m] — `_application_classification` matches the checked `[x]` form against `APPLICATION_CLASSIFICATIONS`
- [x] T007 Implement well-formedness: a `loaded-determinative` row requires a non-placeholder `Output choice` AND `Loaded rule source`; otherwise record `witness not well-formed` (`proof_check.py`) [15m] — well-formedness enforced; malformed determinative → `witness not well-formed`
- [x] T008 Implement the aggregate verdict: pass only when ≥1 well-formed `loaded-determinative` witness exists; zero real rows → `application-witness rows missing`; rows present but none determinative → `no loaded-determinative witness` (`proof_check.py`) [15m] — verified: determinative → ok; none → `application-witness rows missing`; inert-only → `no loaded-determinative witness`

### Integration (no-regression safe)
- [x] T009 Thread the witness result into the `check()` return as a new key and fold failures into `missing`/`ok` ONLY when `--require-application-witness` is set; leave existing keys (`fields`, `cards`, `ready`, `not_ready_flag`, `missing`, `ok`, `source_proof`), the `--require-source-proof` path, and the 0/1/2 exit contract unchanged (`proof_check.py`) [15m] — `application_witness` added; no-flag carries NEITHER `source_proof` NOR `application_witness`; source-proof path unchanged

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Acceptance
- [x] T010 Build a faithful sample card with a well-formed `loaded-determinative` witness (named output choice + named rule source) and confirm `proof_check.py --require-application-witness <card>` exits 0 [10m] — `application_witness.ok True`, exit 0
- [x] T011 Inert test: card whose only witness row is `loaded-inert`; confirm exit 1 with a no-loaded-determinative-witness reason [10m] — `no loaded-determinative witness`, exit 1
- [x] T012 None test: card with placeholder-only witness rows; confirm exit 1 with an application-witness-rows-missing reason [5m] — `application-witness rows missing`, exit 1
- [x] T013 Malformed test: a `loaded-determinative` row missing the output choice or rule source; confirm exit 1 with a witness-not-well-formed reason [10m] — `witness not well-formed`, exit 1

### No-regression
- [x] T014 Run `proof_check.py --require-source-proof <card>` and confirm output + exit code are identical to the pre-change baseline (the source-proof path is untouched) [10m] — `--require-source-proof` emits `source_proof` and NOT `application_witness`; path unchanged
- [x] T015 Run `proof_check.py <card>`, `--json <card>`, `--require-cards <card>` and confirm output + exit are identical to baseline; `check()` keys preserved [10m] — no-flag/`--json` carries NEITHER `source_proof` NOR `application_witness`; original keys preserved
- [x] T016 Run `python3 -m py_compile .opencode/skills/sk-design/shared/scripts/proof_check.py` and confirm exit 0 [5m] — `py_compile` exit 0

### Audits
- [x] T017 Evergreen audit: grep the card + script for spec/packet/phase IDs and spec paths; confirm none present [5m] — evergreen scan clean over both files
- [x] T018 Scope-lock audit: confirm only `proof_of_application_card.md` and `proof_check.py` are modified (`context_loaded_card.md` untouched) [5m] — only the two named files edited by the build

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Card with a well-formed `loaded-determinative` witness passes; `loaded-inert`-only, no-witness, and malformed-determinative all fail
- [x] No-regression confirmed for `--require-source-proof` and no-flag / `--json` / `--require-cards`; `py_compile` passes
- [x] Evergreen + scope-lock audits pass
- [x] `checklist.md` fully verified

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Mirrored precedent**: `proof_check.py --require-source-proof` (D3-R6) — the additive flag pattern this build follows

<!-- /ANCHOR:cross-refs -->

---

<!--
LEVEL 2 TASKS
- Core + Level 2 detail (effort estimates, explicit verification + classify/no-regression tasks)
-->
