---
title: "Acceptance Criteria: Phase 52: unproven-feature-proof"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "unproven feature proof acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/052-unproven-feature-proof"
    last_updated_at: "2026-10-05T07:00:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Met all eight criteria with evidence"
    next_safe_action: "None; packet closeable"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "052-unproven-feature-proof"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 52: unproven-feature-proof

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** cli-jev/003-cli-jev-workflow-integration/052-unproven-feature-proof
**Level:** 2
**Status:** Complete
**Date:** 2026-10-05
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the feature registry, When a fifth feature is registered, Then `registry_holds_exactly_the_four_proven_features` fails | `node --test .skilled/skills/cli-classifier/shared/scripts/tests/` 81 pass; `registry_holds_exactly_the_four_proven_features` at `jev-features.test.mjs:62` | Met | - |
| AC-002 | REQ-002 | Given any of the three scorers, When two gates fail at once, Then the earlier gate in the order coverage, kill, margin, sign test, strongest policy, class floor, flips names the verdict | All three `KEEP_RULE_LINE` texts name the order; precedence tests in each scorer pass (017 38, 020 42, 022 57) | Met | - |
| AC-003 | REQ-003 | Given a column that beats the baseline but ties or trails the strongest simple policy, or loses one class, When the verdict is decided, Then it is `stop (strongest policy)` or `stop (class floor)`, and removing either gate in a copy makes a test fail | Removing each strongest gate, each floor gate or the 022 gate wiring fails 1 to 3 tests; files restored byte for byte | Met | - |
| AC-004 | REQ-004 | Given the 40 frozen rows, When the scorer runs with `--arm masked-state`, Then it runs only the gate and the masked arm, prints a `mask:` line, and no state text appears in stdout, `calls.jsonl` or `report.json` | Masked-only stub test passes; live run made 121 calls and a scan of stdout, `calls.jsonl` and `report.json` found no 60-character run of any row state | Met | - |
| AC-005 | REQ-005 | Given a stored Jev credential, When the masked-state run finishes, Then its verdict line, power line and call count are recorded under `~/.skilled/.labels/runs/` and the next step follows the decision fixed in `plan.md` | `~/.skilled/.labels/runs/052-022-masked-jev.stdout.txt`: `verdict jev: stop (margin) K=40 M=40 A=29 B=30 W=8 L=9 F=4 p=0.6855`; the fixed decision retires this question shape | Met | - |
| AC-006 | REQ-006 | Given a model verdict line in any scorer, When the report prints, Then a `power`, a `strongest policy` and a `class floor` line follow it | Scorer tests assert `strongest policy`, `class floor` and `power` lines after each model verdict; the live run printed all three | Met | - |
| AC-007 | REQ-007 | Given local Claude Code and Codex transcripts, When the census runs, Then it makes no model call and prints only counts and the real clarify rate | `052-020-census-claude-v2` prints `real clarify rate: 6/315`; `052-020-census-codex-v2` prints `real clarify rate: 41/773` with `mirror_lines_skipped=979`; the census makes no model call | Met | - |
| AC-008 | REQ-008 | Given this phase's plan, When a reader looks up any of the three features, Then it finds corpus, labels, rule, power, controls, consumer fail-open tests and the staged rollout | `plan.md` section 8 covers all three features | Met | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`, naming a decision record that exists in
`decision-record.md`. A waiver naming an ADR that is not there fails validation:
the point of a waiver is that someone recorded the reasoning, so an unbacked
waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** Yes

All eight criteria are met. The masked-state run carried the packet: it retired the folder suggestion question shape on its fixture. The 017 holdout, clarify shadow logging and the routing alternatives contract stay out, as `plan.md` section 8 schedules them.
<!-- /ANCHOR:closure -->
