---
title: "Acceptance Criteria: Phase 1: deep-research"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "deep research acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/001-deep-research"
    last_updated_at: "2026-11-06T09:00:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Met every criterion and recorded the evidence behind each one"
    next_safe_action: "Start phase 002 offline contract pin"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-085-001-deep-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 1: deep-research

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** `cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/001-deep-research`
**Level:** 2
**Status:** Complete
**Date:** 2026-11-06
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the finished fan-out, When `research/orchestration-summary.json` is read, Then it reports 2 of 2 lineages succeeded and 0 failed | `research/orchestration-summary.json:9` and `research/orchestration-summary.json:10`. The `node -e` read printed `"succeeded":2,"total":2,"failed":0` on 2026-11-06 | Met | - |
| AC-002 | REQ-002 | Given the merged registry, When its metrics are read, Then it reports 20 iterations and a non-empty key-findings list | `research/findings-registry.json:2931` and `research/findings-registry.json:2934`. The `node -e` read printed `"iterations":20,"keyFindings":145` and 20 iteration files exist under `research/lineages/` | Met | - |
| AC-003 | REQ-003 | Given the synthesis step, When the research folder is listed, Then `research.md` and `phase-plan.md` exist and the plan covers phases 002 to 014 | `research/phase-plan.md:66` to `research/phase-plan.md:278` hold the 13 phase sections and `research/research.md:1` opens the synthesis. `rg -c '^### 0' research/phase-plan.md` prints 13 | Met | - |
| AC-004 | REQ-004 | Given the closeout, When the config and state log are read, Then the config status is `complete` and the log holds `synthesis_complete` | `research/deep-research-config.json:50` holds `"status": "complete"` and `research/deep-research-state.jsonl:1` holds `synthesis_complete` with `stopReason` `maxIterationsReached` | Met | - |
| AC-005 | REQ-005 | Given the filled phase docs, When `validate.sh` runs on the phase folder with `--strict`, Then it prints `RESULT: PASSED` | `tasks.md:60` records the run. `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <phase folder> --strict` printed `RESULT: PASSED` on 2026-11-06 | Met | - |

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

Every criterion is met with the evidence named in its row.
<!-- /ANCHOR:closure -->
