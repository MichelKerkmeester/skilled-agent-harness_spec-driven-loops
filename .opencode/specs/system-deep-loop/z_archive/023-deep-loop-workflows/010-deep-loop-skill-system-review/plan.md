---
title: "Implementation Plan: Comprehensive deep review of the deep-loop + skill-system trio (152/153/155)"
description: "Implementation Plan for the orchestrated-wave deep review of packets 152/153/155: how the review was scoped, dispatched read-only across claude2 opus-4.8 plus gpt-5.5-fast xhigh seats, adversarially verified in round-2, reduced to a stable verdict, and handed off to a remediation phase."
trigger_phrases:
  - "deep-loop trio review plan"
  - "152 153 155 review plan"
  - "orchestrated-wave deep review plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/023-deep-loop-workflows/010-deep-loop-skill-system-review"
    last_updated_at: "2026-06-15T19:40:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored the review plan for the delivered workspace"
    next_safe_action: "Open the remediation phase from the report's ordered plan"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-156-deep-loop-skill-system-review-plan"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Comprehensive deep review of the deep-loop + skill-system trio (152/153/155)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Deep-review workflow over `deep-loop-runtime`; evidence is JSONL deltas + a markdown report |
| **Framework** | Orchestrated-wave deep review (in-process scope agents → discovery seats → round-2 adversarial verify) |
| **Storage** | `.opencode/specs/system-deep-loop/023-deep-loop-workflows/010-deep-loop-skill-system-review/review/` |
| **Executors** | `claude2 opus-4.8` read-only primary; `cli-opencode gpt-5.5-fast xhigh` fallback (per `review/deep-review-config.json`) |
| **Testing** | round-2 refute pass per P0/P1, orchestrator-executed resolution check, `validate.sh --strict` on this packet |

### Overview
A read-only deep review of three sibling packets (152/153/155), dispatched as concurrent waves of ≤3 read-only seats with the orchestrator writing all iteration/delta/state so no executor trips the Gate-3 write block. Discovery surfaced ~38 raw findings; a round-2 pass dispatched fresh seats prompted to *refute* every escalated P0/P1, and the orchestrator ran a direct resolution check to settle the "broken requires" hypothesis. The result is calibrated to a stable verdict (CONDITIONAL PASS: 0 P0 / 3 P1 / 35 P2) plus an ordered remediation plan. This packet writes no production code; it produces `review/review-report.md` and hands remediation to a follow-on phase.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The three reviewed packets exist in shipped form (`../../152`, `../../153`, `../../155`).
- [x] `review/deep-review-config.json` defines the executor stack, allocation, and round structure.
- [x] Scope limited to a read-only review producing the report + remediation plan (no fixes here).

### Definition of Done
- [x] All three packets reviewed; surviving findings carry file:line evidence.
- [x] Every escalated P0/P1 adversarially verified in round-2; refuted findings recorded, not shipped.
- [x] `review/review-report.md` carries verdict + triage + refuted list + ordered remediation plan (with the `skill_creation.md` split map).
- [x] No production file mutated by the review; orchestrator owns all `review/` writes.
- [x] This packet validates green at Level 2 (`validate.sh --strict`, close-out this turn).

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Orchestrated-wave deep review: in-process scope-mapping agents fix the surface and allocation, discovery seats hunt findings in parallel waves, the orchestrator runs a direct resolution check on the highest-stakes hypothesis, then round-2 fresh seats are each prompted to refute a specific escalated P0/P1. Findings are reduced centrally; the report is the single mutable deliverable.

### Parallel Groups (worker fleet)
- **Discovery (round-1):** ~38 seats across waves of ≤3 — 9 opus discovery seats + 2 gpt-5.5 seats + 3 in-process scope-mapping agents, allocated `152:20, 153:18, 155:12`.
- **Resolution check:** 1 orchestrator-executed pass (the 23 cross-skill require resolution that refuted the broken-requires hypothesis).
- **Verify (round-2):** 3 opus adversarial-verify seats, each prompted to refute an escalated finding.

### Read/Write Split
Every seat is read-only (analysis only). The orchestrator reads the seat output, then writes the iteration markdown, the `deltas/iter-*.jsonl` findings, the append-only state, and `review-report.md`. No seat writes any file, which is what keeps the dispatch Gate-3 safe.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Scope
- [x] Fix the review surface and allocation across 152/153/155 (`review/deep-review-config.json`, `review/iterations/iteration-000-scope-foundation.md`).
- [x] Confirm the executor stack (claude2 opus-4.8 primary, gpt-5.5-fast xhigh fallback) and the orchestrator-writes-state discipline.

### Phase 2: Discovery + Verification
- [x] T001 Run the round-1 discovery waves across the three packets; write `deltas/iter-001..004.jsonl`. — _verify:_ each surviving finding has file:line evidence.
- [x] T002 Run the orchestrator-executed resolution check on the broken-requires hypothesis. — _verify:_ all 23 cross-skill requires resolve → hypothesis refuted.
- [x] T003 Run the round-2 adversarial-verify seats (refute each escalated P0/P1); write `deltas/verdicts.jsonl`. — _verify:_ ~7 hypotheses refuted/downgraded; 3 P1 survive.
- [x] T004 Reduce findings to the calibrated triage and author `review/review-report.md`. — _verify:_ verdict + 0 P0 / 3 P1 / 35 P2 + refuted list + ordered remediation plan present.
- [x] T005 Map the operator-requested `skill_creation.md` dissection as the top remediation item. — _verify:_ split target + inbound-ref repoint list recorded in the report.

### Phase 3: Handoff
- [x] T006 Author this packet's control docs (spec/plan/tasks/checklist/implementation-summary) so the workspace is a valid Level-2 spec folder.
- [x] T007 Run `validate.sh --strict` on this folder. — _verify:_ exits clean modulo the orchestrator-generated `description.json`/`graph-metadata.json`.

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Method |
|-----------|-------|--------|
| Adversarial verify | Every P0/P1 | Round-2 fresh seat prompted to refute the escalated finding |
| Resolution | 152 cross-skill requires | Orchestrator resolves all 23 requires (refuted the broken-requires hypothesis) |
| Live re-check | 153 validate figure | Run `validate.sh --strict` on 153 (the "85%" was stale → PASS) |
| Evidence integrity | Surviving findings | Each carries file:line; refuted findings recorded in the report's refuted list |
| Structural | This packet | `validate.sh --strict` on `010-deep-loop-skill-system-review` |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `../../147-deep-loop-workflows` | Reviewed packet | Shipped | No 152 surface to review |
| `../../148-mcp-skill-install-doctor-standardization` | Reviewed packet | Shipped | No 153 surface to review |
| `../../117-parent-nested-skill-pattern` | Reviewed packet | Shipped | No 155 surface to review |
| `claude2 opus-4.8` / `gpt-5.5-fast xhigh` | Executor stack | Reachable | Seats cannot run; fallback covers opus session limits |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: not applicable to the review itself — it mutates no production state. The relevant rollback is for the remediation phase (the 152 destructive deletion is git-recoverable; the report notes `git restore` as the undo for any swept reference).
- **Procedure**: if a finding is later refuted, amend `review/review-report.md` and the `deltas/` evidence; the workspace is additive and carries no migration.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Scope | The three shipped packets + the config | Discovery |
| Discovery + Verification | Scope | Handoff |
| Handoff | Discovery + Verification | The follow-on remediation phase |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Scope | Low | fix surface + allocation + executor stack |
| Discovery + Verification | High | ~38 discovery seats + 1 resolution check + 3 round-2 refute seats, reduced to a report |
| Handoff | Low | author 5 control docs + strict validate |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Executor stack confirmed read-only; orchestrator-writes-state discipline in place (Gate-3 safe).
- [x] Allocation (`152:20, 153:18, 155:12`) recorded in `review/deep-review-config.json`.

### Rollback Procedure
1. **A surviving finding is later refuted.** -> Amend `review-report.md` + the relevant `deltas/iter-*.jsonl`; the verdict note already discloses convergence so the change is bounded.
2. **The remediation phase needs to undo a fix.** -> `git restore` the swept paths (the 152 deletion is git-recoverable); no data migration is involved.
3. **Coverage is challenged.** -> Run the remaining lower-yield surface to the full 50-seat budget (available on request) and re-reduce.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: none — the review is read-only and the workspace is additive evidence.

<!-- /ANCHOR:enhanced-rollback -->
