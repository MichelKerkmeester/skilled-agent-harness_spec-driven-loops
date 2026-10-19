---
title: "Acceptance Criteria: Pi and OpenCode adapters"
description: "The criteria this phase must satisfy before handoff. Each row uses Met, Unmet, Waived or Superseded. A Waived or Superseded row must name a decision record."
trigger_phrases:
  - "Pi and OpenCode adapter acceptance criteria"
  - "phase 002 closure gate"
importance_tier: "important"
contextType: "implementation"
---
# Acceptance Criteria: Pi and OpenCode adapters

<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded` row MUST
> name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** specs/hooks/023-session-relaunch-loop/002-pi-opencode-adapters
**Level:** 3
**Status:** Complete
**Date:** 2026-10-17
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written. Supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | a verdict row per runtime with evidence, which is a quoted help line, source line or captured event. (seed AC-2.1) | `SPIKE-REPORT.md` verdict table and run-ledger D27 record Pi 1.2.0 AUTO and OpenCode 1.19.0 AUTO with captured or source evidence. Evidence: ../scratch/run-ledger.md:151. | Met | - |
| AC-002 | REQ-002 | adapter tests pass. (seed AC-2.2) | Run-ledger D47 records the OpenCode plugin suite 20/20. D54 and PG1 record Pi Vitest 11/11 and Node 170/170, fail 0. Evidence: ../scratch/run-ledger.md:185, ../scratch/run-ledger.md:192. | Met | - |
| AC-003 | REQ-003 | `pi --offline --approve -p "list your available tools" </dev/null` exits 0. A `node -e "import('<plugin path>').then(()=>console.log('ok'))"` prints `ok`. (seed AC-2.3) | Run-ledger AC-2.3 smokes records isolated-extension Pi rc=0 and OpenCode import output `function`. The planned plain Pi command returned rc=1 on the pre-existing duplicate `--fast` extension. The import output differs from `ok`. Evidence: ../scratch/run-ledger.md:165, ../scratch/run-ledger.md:166, ../scratch/run-ledger.md:167. | Met | - |
| AC-004 | REQ-004 | a fixture test shows a nudge once at or above the threshold and one re-nudge at +5%, with arming only when a pending file exists. (seed AC-2.4) | Run-ledger D36 records Pi 9/9, OpenCode 9/9 and wrapper arms 20/20. D54 and PG1 record Node 170/170, fail 0 and Pi Vitest 11/11. Evidence: ../scratch/run-ledger.md:170, ../scratch/run-ledger.md:192. | Met | - |
| AC-005 | REQ-005 | for each verified runtime, the stub-runtime wrapper test asserts the seed, the cwd change and no resume flag. (seed AC-2.5) | Run-ledger D36 records wrapper arms 20/20. D40, D43 and D52 record model, Pi extension-selection and spec-folder carry coverage. Evidence: ../scratch/run-ledger.md:170, ../scratch/run-ledger.md:178, ../scratch/run-ledger.md:181, ../scratch/run-ledger.md:190. | Met | - |
| AC-006 | REQ-006 | docs exist and pass their validators. (seed AC-2.6) | Orchestrator rerun: validate_document rc=0 on the concern, bin and plugins READMEs (code_folder), the catalog entry (feature_catalog) and the Pi and OpenCode playbook (playbook_feature); hvr_scan rc=0 on all but the plugins README, whose 19 hard blockers are unchanged from HEAD; playbook package validator rc=0. Evidence: ../scratch/run-ledger.md:194, ../scratch/run-ledger.md:198. | Met | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is `Waived` or `Superseded`, naming a decision record that exists in `decision-record.md`. A waiver naming an ADR that is not there fails validation. The point of a waiver is to record its reasoning, so an unbacked waiver remains unmet.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** Yes

All six criteria are Met with cited evidence. AC-006 closed on the orchestrator's own validator rerun after lane 2.6c (run-ledger.md:194 and 198), and strict child validation reports RESULT: PASSED.
<!-- /ANCHOR:closure -->

