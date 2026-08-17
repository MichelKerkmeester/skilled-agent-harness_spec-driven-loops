---
title: "Feature Specification: Residual Finding Closeouts (022 / 025 / 028)"
description: "A single Planned home to plan, execute, and record evidence for three small deferred residuals that live in already-landed sibling phases: 022's REQ-005 full-surface fixtures plus formal closeout, 025's F-011-01 restore-authorization under-binding, and 028's open QA items. The siblings are not reopened; this child tracks their closeout."
trigger_phrases:
  - "residual finding closeouts"
  - "REQ-005 full-surface fixtures closeout"
  - "F-011-01 restore authorization under-binding"
  - "028 open QA items closeout"
  - "shadow-parity surface coverage closeout"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/006-residual-finding-closeouts"
    last_updated_at: "2026-08-17T22:30:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Closed REQ-001 fixtures (6 modes), REQ-004 disposition, 028 hygiene; Complete"
    next_safe_action: "None; packet Complete — parent 036 metadata reconcile is the epic step"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The three source siblings stay landed and are read-only; every fix landed on runtime/test surfaces."
      - "REQ-001 (022 REQ-005 full-surface fixtures) is closed across all six shadow-parity modes; the deep-alignment finding-chain coverage limit is surfaced as a candidate future harness improvement, not hidden."
      - "The F-011-01 sameReference change landed on this branch as commit 484076e32f with red-before/green-after plus a positive control."
      - "The 028 substantive per-finding negative-test bar plus the packet-hygiene (whole-gate delta 215/0, inventories, rollback, freshness-warning disposition) are closed; REQ-004 deferred items dispositioned."
---
# Feature Specification: Residual Finding Closeouts (022 / 025 / 028)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

> This child is Complete. All three sibling residuals are closed: REQ-001 (022 REQ-005 full-surface fixtures) across all six shadow-parity modes with a formal per-mode closeout note, REQ-002 (025 F-011-01), and REQ-003 (028 open QA — substantive negative-test bar plus packet-hygiene). REQ-004 deferred items are dispositioned. Every fix landed on runtime/test surfaces, never on the source siblings, and every mode suite was re-run first-hand before shipping. One documented coverage limitation remains surfaced, not hidden: deep-alignment's six finding-chain fields are covered only by a proven structural-limit skip (`MAX_JSON_NODES = 10_000`), a candidate future harness improvement. See `implementation-summary.md` for the commit-level evidence and the closeout note.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | `system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/006-residual-finding-closeouts` |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-12 |
| **Reconciled** | 2026-08-17 (REQ-001 fixtures closed across six modes; REQ-004 dispositioned; 028 packet-hygiene closed) |
| **Branch** | `skilled/v4.0.0.0` (also cherry-picked to `main`); no branch created |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `system-deep-loop/036-deep-loop-innovation` |
| **Source siblings (read-only)** | `002-shadow-parity-independent-derivation`, `003-artifact-certificate-binding`, `006-fanout-dispatch-integrity` |
| **Status boundary** | Closeout fixes land only on runtime/test surfaces; the source siblings stay read-only |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Three sibling phases under `036-deep-loop-innovation` landed their primary deliverables but each left one small, explicitly-documented residual open. Those residuals currently live only inside the landed siblings' own docs, where they are easy to lose and where re-editing the sibling would falsely imply its main work is unfinished. Without a single tracked home, the residuals risk being forgotten before a cutover.

The three residuals are:

1. **022 — REQ-005 full-surface fixtures + formal closeout.** Blocker 1 (independent derivation / divergence-detectability) is discharged across all six shadow-parity modes. At intake, REQ-005's full protected-surface fixture coverage was still open across all modes — only the event stems a mode's current fixture emitted were empirically diffed field-by-field. This closeout closed that gap (see the REQ-005 closeout note in `implementation-summary.md`).
2. **025 — F-011-01 restore-authorization under-binding.** `resolveLifecycleAuthorization` resolves deletion/restoration authorization against `qualified_digest` only, not the full reference (which also carries `artifact_kind`), leaving a low-severity, near-zero-exposure gap that the same file already closes elsewhere with a `sameReference` primitive.
3. **028 — open QA items.** The fan-out dispatch integrity packet landed its findings but left 21 checklist items unchecked (14 of them P0): a captured pre-edit baseline, per-finding negative tests, per-dispatch-kind containment tests, sink redaction, a rehearsed rollback, and a clean `validate.sh --strict` exit.

### Purpose

Provide one Planned packet that names each residual precisely (quoted from its source), states what "closed" means for it, and lists the execution tasks and verification evidence needed to close it. This child does not reopen or re-narrate the landed siblings; it references them and tracks the remaining work to a formal closeout.

### Calibration

> These are cutover-readiness and thoroughness residuals, not new defects and not evidence of compromise. 022's residual is a coverage-thoroughness gap, not a divergence-detectability gap. 025's residual is a low-severity hardening item with confirmed near-zero production exposure. 028's residuals are verification-debt items behind already-landed code.

### Non-Goals

- Reopening, re-narrating, or changing the primary landed deliverables of 022, 025, or 028.
- Implementing any fixture, runtime change, or test in this scaffold pass.
- Editing any file outside this `051` folder except reading the named source siblings.
- Widening scope to residuals not named here.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Capture the three sibling residuals as requirements (REQ-001, REQ-002, REQ-003), each with a precise, source-quoted definition and a closeout acceptance criterion.
- Define the execution tasks and verification evidence that close each residual in a later pass.
- Keep the three source siblings read-only; cite them by `file:line` rather than editing them.
- Route each residual's eventual fix to the correct owner: 022's fixtures to the shadow-parity harnesses, 025's one-line binding change to `sealed-artifact-store.ts`, 028's QA debt to the fan-out test and rollback surfaces.

### Out of Scope

- Any implementation, fixture, test, or runtime change in this scaffold pass.
- Reopening the siblings' status or altering their landed behavior beyond each named residual fix.
- New findings, new modes, or unrelated deep-loop work.

### Source Residual Provenance (read-only)

| Residual | Source sibling | Cited evidence |
|----------|----------------|----------------|
| REQ-005 full-surface fixtures + formal closeout | `002-shadow-parity-independent-derivation` | `spec.md:68`, `spec.md:175`, `implementation-summary.md:118,120` |
| F-011-01 restore-authorization under-binding | `003-artifact-certificate-binding` | `implementation-summary.md:138`, `implementation-summary.md:95,107`, `spec.md:134,153` |
| Open QA items | `006-fanout-dispatch-integrity` | `checklist.md:286` (summary), unchecked rows `CHK-002/003/004/030/031/032/033/034/036/040/008/120/110/052/FIX-002/FIX-003` |

### Files to Read or Create Later

| File Path | Role | Scaffold Action |
|-----------|------|-----------------|
| `specs/system-deep-loop/036-deep-loop-innovation/005-blocker-closeout/002-shadow-parity-independent-derivation/` | REQ-005 residual source | Read-only citation |
| `specs/system-deep-loop/036-deep-loop-innovation/006-runtime-docs-and-integrity-hardening/003-artifact-certificate-binding/` | F-011-01 residual source | Read-only citation |
| `specs/system-deep-loop/036-deep-loop-innovation/006-runtime-docs-and-integrity-hardening/006-fanout-dispatch-integrity/` | Open-QA residual source | Read-only citation |
| `.opencode/skills/system-deep-loop/runtime/lib/sealed-reference-artifacts/sealed-artifact-store.ts` | F-011-01 fix site (`resolveLifecycleAuthorization`) | Read in later execution; not touched by this scaffold |
| Shadow-parity harness fixtures per mode | REQ-005 fixture expansion | Create only in later execution |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Close 022's REQ-005 with full protected-surface fixture coverage and a formal closeout. Source (`022/spec.md:175`): "The comparator covers the complete protected semantic surface per mode, not a fingerprint of shared state. Per mode, an enumerated surface list; a test per surface element proving a divergence in that element is detected." | For each of the six shadow-parity modes (deep-ai-council, agent-improvement, model-benchmark, skill-benchmark, deep-alignment, deep-review), an enumerated surface list exists and a fixture emits every stem so that field-by-field divergence is empirically diffed for each surface element — closing the gap where only fixture-emitted stems are diffed today (deep-alignment: 9 of 40 stems; `022/implementation-summary.md:118`). Documented reducer-schema-gap fields (agent-improvement's three unrecoverable fields; skill-benchmark's `evidenceSetDigest`) are either recovered by an approved reducer change or recorded as accepted exclusions. A formal REQ-005 closeout note records the final per-mode coverage state. |
| REQ-002 | Close 025's F-011-01 by binding restore/delete authorization to the full reference, not `qualified_digest` alone. Source (`025/implementation-summary.md:138`): "`resolveLifecycleAuthorization` in `sealed-artifact-store.ts` compares only `qualified_digest`, not the full `sameReference` ... A genuine deletion/restore receipt could theoretically authorize a different artifact that shares that digest but differs in `artifact_kind`. ... Fix is a 1-line consistency change (use `sameReference` at this call site too)." | `resolveLifecycleAuthorization` uses `sameReference` (matching the creation-evidence and read paths in the same file) so an authorization sharing `qualified_digest` but differing in `artifact_kind` is rejected. A negative test is red before the change and green after; a positive test proves a legitimate same-reference authorization still resolves. The near-zero-exposure calibration from the source (`025/implementation-summary.md:138`) is preserved in the closeout note. |
| REQ-003 | Close 028's open QA items so the fan-out dispatch integrity packet meets its own remaining verification bar. Source (`028/checklist.md:286`): "The packet's remaining P0 verification bar (a captured pre-edit baseline, dedicated negative tests for most of the 10 landed findings, per-dispatch-kind containment tests, `validate.sh --strict` exiting 0) is still not met." | The 028 residual bar is satisfied or each remaining item is explicitly operator-deferred with a documented reason: pre-edit baseline and whole-gate delta (CHK-002/004/110); per-finding negative tests for F-010-01/02/03/04, F-016-04, F-016-05, F-020-02 (CHK-003); fulfillment tests (CHK-030/031); per-dispatch-kind containment tests (CHK-032); truncation-of-dirty-file detection (CHK-033) and out-of-worktree hard-failure (CHK-034); sink redaction (CHK-040); producer/consumer inventories (CHK-FIX-002/003); rehearsed rollback (CHK-120); and `validate.sh --strict` exiting 0 (CHK-008). |

### P2 - Optional (defer with documented reason)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Record the disposition of 028's explicitly-deferred items and the per-mode artifact contract. Source (`028/checklist.md:19,136,190`): `F-016-01`/`F-016-06` deferred; the per-mode artifact contract (`tasks T005/T006`, CHK-052/CHK-FIX-006/CHK-142) was never built. | Each deferred 028 item is either scheduled into this closeout or recorded as an accepted deferral with a reason; no deferred item is silently dropped. |

### Planning Invariants

| ID | Invariant | Planned Control |
|----|-----------|-----------------|
| INV-001 | Source siblings stay landed and unedited. | This child cites siblings by `file:line`; execution routes fixes to runtime/test surfaces, never to the siblings' status docs. |
| INV-002 | No residual is closed by lowering its bar. | Each acceptance criterion mirrors the source's own definition of done, including its calibration. |
| INV-003 | This scaffold claims no completion. | All tasks and checklist items remain `[ ]`; no `implementation-summary.md` is authored while Status is Planned. |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Each of the three residuals is captured with a source-quoted definition, a cited `file:line`, and a closeout acceptance criterion.
- **SC-002**: REQ-001 closeout proves full protected-surface fixture coverage (or an approved exclusion) for all six shadow-parity modes.
- **SC-003**: REQ-002 closeout binds restore/delete authorization to the full reference with a red-before/green-after negative test.
- **SC-004**: REQ-003 satisfies or explicitly defers every named 028 residual item, with `validate.sh --strict` exit-0 tracked.
- **SC-005**: The 051 packet reports honest closeout state: Status reflects In Progress, `implementation-summary.md` records the landed evidence and open items, and the packet passes strict validation with zero errors (a CONTINUITY_FRESHNESS warning is acceptable while In Progress).

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Reopening a sibling to "finish" a residual | Falsely implies the sibling's landed work is incomplete | Cite siblings read-only; route fixes to runtime/test surfaces only |
| Risk | REQ-005 fixture expansion needs reducer-schema changes | Broader blast radius than a test-only pass | Separate recoverable surfaces from documented schema-gap exclusions; escalate schema changes as their own decision |
| Risk | F-011-01 fix widens beyond one call site | Scope creep into unrelated store behavior | Constrain to the `sameReference` call-site change plus its negative/positive tests |
| Risk | 028's residual bar is large (14 P0 items) | Closeout under-scoped or rushed | Track each CHK id explicitly; allow documented operator deferral rather than silent skips |
| Dependency | Landed siblings 022 / 025 / 028 | Residual definitions must match the landed state | Definitions are quoted from the siblings at cited `file:line` |
| Dependency | Shadow-parity harness seams and fan-out test harness | REQ-001 / REQ-003 execution needs testable seams | Confirm seam availability at execution start; route missing seams as separate decisions |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Evidence
- **NFR-E01**: Every residual definition names its source sibling and a `file:line` citation.
- **NFR-E02**: Every closeout claim carries red-before/green-after or delta-against-baseline evidence, matching the source's own verification standard.

### Safety
- **NFR-S01**: No source sibling file is modified by this child; fixes land only on the runtime/test surfaces the residuals name.
- **NFR-S02**: The F-011-01 change stays scoped to the one call site and its tests; no adjacent store behavior is altered.

### Honesty
- **NFR-H01**: A residual that cannot be fully closed is recorded as an explicit, reasoned deferral, never marked done.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Coverage Boundaries
- A shadow-parity field is unrecoverable from the reducer's persisted schema (agent-improvement's three fields; skill-benchmark's `evidenceSetDigest`): record as an accepted exclusion with rationale, do not fake coverage.
- A mode emits stems not present in any fixture: the fixture set is incomplete and REQ-001 stays open for that mode.

### Authorization Boundaries
- An authorization shares `qualified_digest` but differs in `artifact_kind`: must be rejected once F-011-01 is closed; this is the exact negative-test case.
- A legitimate same-reference authorization: must still resolve; this is the positive control.

### Verification Boundaries
- A 028 item cannot be closed without a captured pre-edit baseline: the baseline is a prerequisite, not an afterthought (CHK-002/004/110).
- `validate.sh --strict` emits only a `CONTINUITY_FRESHNESS` warning: treat per the source packet's stated acceptance, not as a silent pass of CHK-008.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- Which shadow-parity harness seams allow emitting every event stem per mode without changing reducer behavior, and which modes need a reducer-schema decision first?
- Should the F-011-01 one-line `sameReference` change land inside this closeout child, or as its own runtime packet given it touches shipped `sealed-artifact-store.ts`?
- For 028, which of the 14 P0 items are in-scope for this closeout versus explicitly operator-deferred?

<!-- /ANCHOR:questions -->
---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Parent Spec**: `../spec.md`
- **Source residual — 022**: `../../005-blocker-closeout/002-shadow-parity-independent-derivation/`
- **Source residual — 025**: `../../006-runtime-docs-and-integrity-hardening/003-artifact-certificate-binding/`
- **Source residual — 028**: `../../006-runtime-docs-and-integrity-hardening/006-fanout-dispatch-integrity/`

<!-- /ANCHOR:related-docs -->
