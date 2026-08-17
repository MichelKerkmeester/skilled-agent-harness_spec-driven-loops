---
title: "Implementation Summary: Residual Finding Closeouts (022 / 025 / 028)"
description: "Reconciles 051 off its Planned scaffold to In Progress. REQ-002 (025 F-011-01 restore-authorization under-binding) is closed with a landed one-call-site fix plus red-before/green-after tests. The 028 substantive per-finding negative-test bar is met across fulfillment, containment, per-kind sandbox, audit-record, and sink redaction, each with a verified commit. REQ-001 (022 REQ-005 full-surface fixtures) and REQ-004 disposition are open; the 028 packet-hygiene items (baseline/delta, inventories, validate --strict, rollback doc) remain open bookkeeping."
trigger_phrases:
  - "residual finding closeouts implementation"
  - "F-011-01 restore authorization closed"
  - "028 negative test bar met"
  - "051 closeout reconciliation"
importance_tier: "high"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/006-residual-finding-closeouts"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/006-residual-finding-closeouts"
    last_updated_at: "2026-08-17T04:04:40Z"
    last_updated_by: "markdown-agent"
    recent_action: "Reconciled 051 to In Progress; REQ-002 and 028 test bar met with commits"
    next_safe_action: "Close 028 packet-hygiene, then REQ-001/REQ-004, or defer per operator"
    blockers: []
    key_files:
      - "implementation-summary.md"
      - "spec.md"
      - "tasks.md"
      - "checklist.md"
    completion_pct: 45
    open_questions:
      - "Are the 028 packet-hygiene items (baseline/delta, inventories, rollback doc) in-scope for this closeout or operator-deferred?"
      - "Is REQ-001 full-surface fixture coverage still deprioritized, and is REQ-004 disposition to be scheduled or accepted as-is?"
    answered_questions:
      - "Is REQ-002 (F-011-01) closed? Yes, landed as commit 484076e32f with red-before/green-after plus a positive control."
      - "Is the 028 substantive per-finding negative-test bar met? Yes, across fulfillment, containment, per-kind sandbox, audit-record, and sink redaction, each with a verified commit."
      - "Do the source siblings stay read-only? Yes; every fix landed on runtime/test surfaces, never on 022/025/028 docs."
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

> This packet is In Progress, not complete. REQ-002 is closed and the 028 substantive negative-test bar is met with verified commits. REQ-001, REQ-004, and the 028 packet-hygiene bookkeeping remain open. Every commit cited below was verified with `git show --stat` on this worktree branch.
>
> Next safe action: close 028 packet-hygiene (baseline/delta, inventories, validate --strict, rollback doc) then REQ-001/REQ-004; or defer per operator.

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-residual-finding-closeouts |
| **Level** | 2 |
| **Status** | In Progress. REQ-002 fix landed; 028 substantive negative-test bar met; REQ-001, REQ-004, and 028 packet-hygiene open. |
| **Completion** | 45% |
| **Reconciled** | 2026-08-12 (this pass) |
| **Branch** | Current worktree `skilled/v4.0.0.0`; no branch created |
| **Prior claimed status (superseded)** | "Planned" / 0% scaffold, accurate when authored; the closeout commits below landed after it. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The three sibling residuals moved from scaffold to partial closeout. REQ-002 is fully closed on the runtime store. The 028 verification-debt findings that warranted a dedicated negative test now each have one, implemented by GPT-5.6-SOL via cli-opencode and independently re-verified by the orchestrator with a real red-before step (the guard was neutralized and the test failed, then restored and the test passed). Each closeout was test-only and scoped to a single file. REQ-001 was deprioritized by the operator and REQ-004 disposition is still pending, so this packet is In Progress rather than complete.

### REQ-002 — 025 F-011-01 restore-authorization binding (CLOSED)

`resolveLifecycleAuthorization` now binds deletion and restoration authorization to the full reference via `sameReference`, not `qualified_digest` alone. An authorization sharing a digest but differing in `artifact_kind` is now rejected, and a legitimate same-reference authorization still resolves. The change carries a red-before/green-after negative test and a positive control, and compiled clean (`tsc` return code 0). Landed as commit `484076e32f` (`sealed-artifact-store.ts` plus `sealed-reference-artifacts.vitest.ts`). The near-zero-exposure calibration from the source residual is preserved: this closed a low-severity consistency gap, not an active exploit.

### REQ-003 — 028 open QA (SUBSTANTIVE NEGATIVE-TEST BAR MET; PACKET-HYGIENE OPEN)

The substantive per-finding negative-test bar is met. Each finding below is closed by a verified commit, except where noted as covered by the existing suite or dispositioned:

| 028 finding | Closeout | Evidence |
|-------------|----------|----------|
| F-010-01 / F-010-02 fulfillment (report-only and self-reported counters rejected) | Negative tests added | `90121aeed6` (051 CHK-030/031) |
| F-010-03 provenance (`effectiveConfig` + `invocationFingerprint` preserved) | Covered by existing suite, no new commit | `fanout-run.vitest.ts:872-1008` |
| F-010-04 audit-record distinguishability | Negative test added | `888fab793a` |
| F-016-02 / F-016-03 sandbox enforcement (opencode rejects an unenforceable mode; native honors read-only) | Per-kind tests added | `a20833dacb` |
| F-016-04 / F-016-05 containment (dirty-file truncation detected by content identity; out-of-worktree hard-fail) | Negative tests added | `ed26cf274b` (051 CHK-033/034) |
| F-020-01 sink recursive nested redaction | Negative test added | `52da064126` (051 CHK-040) |
| REQ-010 per-kind containment for all 7 executor kinds plus matrix-alignment guard | Test added | `f48b50be79` (051 CHK-032) |
| F-020-02 raw lineage label on stderr | Accepted low-severity disposition, no code gap | No sanitizer exists in code; label is operator/config-authored (calibrated like F-016-01) |

The 028 packet-hygiene items are still open and are 028-packet bookkeeping, not runtime work: pre-edit baseline plus whole-gate delta (CHK-002/004/110), producer/consumer inventories (CHK-FIX-002/003), a clean `validate.sh --strict` exit for the 028 packet (its CONTINUITY_FRESHNESS warning, CHK-008), and a rehearsed rollback doc (CHK-120).

### REQ-001 — 022 REQ-005 full-surface fixtures (NOT STARTED)

Operator-deprioritized as a low-urgency thoroughness gap. Divergence-detectability already holds for all six shadow-parity modes; the open work is only the full protected-surface fixture coverage that empirically diffs every stem field-by-field. No fixtures were authored in this pass.

### REQ-004 — deferred-item disposition (PENDING)

The disposition of 028's explicitly-deferred items (F-016-01, F-016-06) and the never-built per-mode artifact contract is still pending. Nothing was scheduled or formally accepted in this pass.

### Files Changed (closeout evidence, landed on this branch)

| File | Action | Commit |
|------|--------|--------|
| `.opencode/skills/system-deep-loop/runtime/lib/sealed-reference-artifacts/sealed-artifact-store.ts` | Modified (bind `sameReference`) | `484076e32f` |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/sealed-reference-artifacts.vitest.ts` | Modified (negative + positive) | `484076e32f` |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts` | Modified (fulfillment, per-kind, sandbox) | `90121aeed6`, `f48b50be79`, `a20833dacb` |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/write-containment.vitest.ts` | Modified (truncation + out-of-worktree) | `ed26cf274b` |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/observability-events.vitest.ts` | Modified (nested redaction) | `52da064126` |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/executor-audit.vitest.ts` | Modified (audit distinguishability) | `888fab793a` |

This reconciliation pass itself edited only `051/` tracker docs and metadata: it created `implementation-summary.md` and updated `spec.md`, `tasks.md`, `checklist.md`, `description.json`, and `graph-metadata.json`. No source sibling file and no runtime code was touched by the reconciliation.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each closeout was implemented by GPT-5.6-SOL through cli-opencode and independently verified by the orchestrator. Verification used a real negative control: the guard under test was neutralized so the new test failed (red before), then restored so the test passed (green after). Every closeout was test-only and RM-8-scoped to one file, so a revert is confined to that single surface. The REQ-002 store change additionally compiled clean at `tsc` return code 0. The source siblings 022, 025, and 028 stayed read-only throughout; fixes landed only on the runtime and test surfaces the residuals name.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Bind lifecycle authorization with `sameReference` | Matches the creation-evidence and read paths in the same file, so a same-digest, different-kind authorization can no longer resolve. |
| Record F-010-03 as covered by the existing suite | The pre-existing tests at `fanout-run.vitest.ts:872-1008` already assert `effectiveConfig` and `invocationFingerprint` preservation, so a new test would duplicate coverage. |
| Disposition F-020-02 rather than test it | The raw lineage label is operator/config-authored and no sanitizer exists in the code; this is a calibrated low-severity robustness item, not a code gap. |
| Keep the 028 packet-hygiene items open | Baseline/delta, inventories, validate --strict, and the rollback doc are 028-packet bookkeeping, not runtime work; they are tracked here as open rather than silently dropped. |
| Leave REQ-001 unstarted | Operator deprioritized full-surface fixtures; divergence-detectability already holds for all six modes. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| REQ-002 negative test (same digest, different kind rejected) | PASS, red before / green after (`484076e32f`) |
| REQ-002 positive control (legitimate same-reference resolves) | PASS (`484076e32f`) |
| REQ-002 typecheck | PASS, `tsc` return code 0 |
| F-010-01/02 fulfillment negatives | PASS (`90121aeed6`) |
| F-010-04 audit-record distinguishability | PASS (`888fab793a`) |
| F-016-02/03 per-kind sandbox enforcement | PASS (`a20833dacb`) |
| F-016-04/05 truncation + out-of-worktree hard-fail | PASS (`ed26cf274b`) |
| F-020-01 nested sink redaction | PASS (`52da064126`) |
| REQ-010 per-kind containment (7 executor kinds) | PASS (`f48b50be79`) |
| F-010-03 provenance | Covered by existing suite (`fanout-run.vitest.ts:872-1008`) |
| Commit SHA verification | PASS, all 7 confirmed via `git show --stat` on this branch |
| `validate.sh --strict` on 051 | PASS, exit 0, zero errors, zero warnings (CONTINUITY_FRESHNESS skipped: no completion claim) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **REQ-001 (022 REQ-005 full-surface fixtures) not started.** Operator-deprioritized. Divergence-detectability already holds for all six shadow-parity modes; only the full field-by-field surface coverage is open.
2. **REQ-004 disposition pending.** F-016-01, F-016-06, and the never-built per-mode artifact contract are not yet scheduled or formally accepted.
3. **028 packet-hygiene open.** Pre-edit baseline plus whole-gate delta (CHK-002/004/110), producer/consumer inventories (CHK-FIX-002/003), a clean 028 `validate.sh --strict` exit (CHK-008), and a rehearsed rollback doc (CHK-120) remain open bookkeeping, not runtime work.
4. **F-020-02 is dispositioned, not tested.** The raw lineage label on stderr is an accepted low-severity item because no sanitizer exists in the code and the label is operator/config-authored.
<!-- /ANCHOR:limitations -->
