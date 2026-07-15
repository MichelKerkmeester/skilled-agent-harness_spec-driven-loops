---
title: "Decision Record: sk-git Review Remediation and sk-code Alignment"
description: "Frozen decisions for remediating the SOL-review defects: new sibling packet under sk-git, parallel per-file LUNA execution, RED-first regression discipline, the doc-overclaim vs data-loss distinction, and the sourceable strict-mode alignment approach."
trigger_phrases:
  - "sk-git remediation decisions"
  - "worktree tooling hardening adr"
  - "sk-git sk-code alignment adr"
importance_tier: "critical"
contextType: "implementation"
status: "complete"
_memory:
  continuity:
    packet_pointer: "sk-git/010-review-remediation-and-alignment"
    last_updated_at: "2026-07-15T04:22:47Z"
    last_updated_by: "claude"
    recent_action: "ADRs frozen (incl. allocator execution addendum); complete"
    next_safe_action: "Commit packet 003 (scoped)"
    blockers: []
    key_files:
      - "decision-record.md"
      - "spec.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-git-review-remediation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: sk-git Review Remediation and sk-code Alignment

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

> Provenance: remediates the DO-NOT-SHIP findings of the GPT-5.6-SOL (max/fast) review of `sk-git/009-skill-scoped-worktree-naming`; each finding was independently re-verified against source before it was accepted here.

---

<!-- ANCHOR:adr-001 -->
## ADR-001: New sibling packet, not a 002 reopen

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-14 |
| **Deciders** | Operator (Gate 3 = New packet); orchestrator |

<!-- ANCHOR:adr-001-context -->
### Context

The SOL review targeted work shipped by 002, whose docs already claim shipped state. Reopening 002 would blur "what shipped" against "what was later fixed", and would entangle the historical ship record with the remediation diff.

### Constraints

- 002 must remain an auditable record of the first ship.
- The remediation must be one revertable unit.
- 002's over-claimed rows still need correcting in place.
<!-- /ANCHOR:adr-001-context -->

<!-- ANCHOR:adr-001-decision -->
### Decision

Track the remediation in a new `sk-git/010-review-remediation-and-alignment` packet (Gate 3 answer: New packet). 002 stays the historical record of the first ship; 003 owns the fixes and reconciles 002's over-claimed rows by reference.
<!-- /ANCHOR:adr-001-decision -->

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

- **Reopen 002 in place** — rejected: blurs ship vs fix provenance and makes the remediation diff hard to isolate/revert.
- **Fold the fixes into an unrelated open packet** — rejected: violates scope-match; the fixes are their own workstream.
<!-- /ANCHOR:adr-001-alternatives -->

<!-- ANCHOR:adr-001-consequences -->
### Consequences

- **Positive**: clean provenance — 002 is the ship, 003 is the hardening; fixes are one revertable unit.
- **Negative**: 002's over-claims must be corrected across two packets (edit in 002, own the reason in 003).
- **Neutral**: 002 stays frozen as the ship record.
<!-- /ANCHOR:adr-001-consequences -->

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

- **Simplicity**: one packet owns one coherent workstream (the remediation).
- **Systems**: touches the four shell surfaces + their harnesses + 002's docs + two READMEs.
- **Bias**: fixes the real defects rather than papering the closeout rows.
- **Sustainability**: keeps ship and hardening auditable as distinct units.
- **Value**: restores the shipped-state claims to truth.
<!-- /ANCHOR:adr-001-five-checks -->

<!-- ANCHOR:adr-001-impl -->
### Implementation

Create `.opencode/specs/sk-git/010-review-remediation-and-alignment` (Level 3, sibling of `009-skill-scoped-worktree-naming`); reconcile 002's over-claimed rows by reference to this packet.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

## ADR-002: Parallel per-file LUNA execution

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-14 |
| **Deciders** | Operator (executor + parallel authorization); orchestrator |

### Context

The findings partition cleanly by file: session (`worktree-session.sh`), reaper (`worktree-reaper.sh`), allocator+pre-push (`worktree-naming.sh`, `pre-push`). The operator directed GPT-5.6-LUNA (xhigh/fast) as the executor and authorized more than one dispatch at a time.

### Decision

Run three concurrent cli-codex `gpt-5.6-luna` dispatches, one per disjoint file group, each `--sandbox workspace-write`, `AI_SESSION_CHILD=1`, `</dev/null`, PID-captured for scoped cleanup. Executors modify only their file group + its test harness; no repo/branch mutation, no commit. The orchestrator verifies and commits.

### Consequences

No write contention (disjoint files); the orchestrator retains the commit/verify authority the executors are forbidden. Honors PLAN-WORKFLOW LOCK (executor frozen to LUNA) and the cli-codex single-dispatch discipline's operator-authorized N-parallel exception.

**Addendum (execution).** The session/reaper/pre-push fixes landed cleanly via LUNA. The allocator stale-lock race, however, survived two LUNA rounds — each with a 10-run self-gate that passed by luck on a ~10-15% race — so the orchestrator root-caused the residual defect (a non-mutex recovery marker whose per-process unique name let multiple contenders both delete the lock dir) and, under explicit operator approval, applied the final race-safe fix (atomic rename-steal, discard-not-reinsert) directly, proving it with a 100-run determinism gate. LUNA remained the executor of record for the other three file groups; the deviation is the allocator's final fix, recorded here per the honesty mandate.

### Five Checks Evaluation

- **Scope**: disjoint file ownership keeps three parallel writers from colliding.
<!-- WHY: durable rationale only; no packet/requirement identifiers per comment-hygiene. -->

---

## ADR-003: RED-first regression discipline

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-14 |
| **Deciders** | Orchestrator |

### Context

The original harnesses passed precisely because they never exercised adversarial inputs; a green suite hid real defects.

### Decision

Every confirmed finding is fixed RED-first: add the failing adversarial fixture reproducing the SOL scenario, confirm it fails against current code, apply the fix, confirm it passes. The reproduction becomes a permanent regression case.

### Consequences

Each fix is proven against the exact failure it addresses; the suite can no longer be green-while-broken for these classes.

### Five Checks Evaluation

- **Value**: converts each review finding into a durable guardrail, not a one-off patch.

---

## ADR-004: Phase-5 P0 is a doc-overclaim, not data loss

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-14 |
| **Deciders** | Orchestrator (verified against live object reachability) |

### Context

SOL flagged the Phase-5 cleanup as a P0 "lossless proof is false". Independent verification found the disputed OIDs (`900c962…`, `25b29be…`, `1546c05…`) remain reachable via preserved branches / `main`; no committed work was orphaned. What is genuinely wrong is the wording: "every removed HEAD was 0-ahead" over-generalizes (some recorded OIDs are ahead of their own base, but still reachable), and "lossless proof" over-states the methodology.

### Decision

Treat this as a documentation-fidelity fix, not a recovery operation. Reword the 002 Phase-5 claims to a truthful statement ("each removed worktree was 0-ahead of the integration tip **or** its branch was preserved, keeping every commit reachable"); do not re-run any destructive/recovery action. Record the reachability evidence.

### Consequences

The docs stop over-claiming; the cleanup itself needs no reversal. The distinction (reachable-but-ahead vs lost) is preserved for audit.

### Five Checks Evaluation

- **Bias**: names the real defect (wording) instead of manufacturing a recovery that the evidence does not require.

---

## ADR-005: Sourceable strict-mode alignment

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-14 |
| **Deciders** | Orchestrator (per sk-code code-opencode surface) |

### Context

The sk-code OPENCODE/SHELL gate wants top-level `set -euo pipefail`, but `worktree-naming.sh` is sourced by the pre-push hook, where inheriting the caller's `set -e` would change the caller's shell semantics — so strict mode currently lives only inside `_wn_main`.

### Decision

Adopt a guarded pattern that satisfies the gate without breaking sourcing: apply strict mode on the direct-execution path only (the `BASH_SOURCE[0] == $0` guard already gates `_wn_main`), and adopt the sk-code-supported sourceable-script convention so the verifier recognizes the intent. Do not force unconditional top-level `set -e` on a sourceable file.

### Consequences

The verifier passes; sourcing callers (pre-push) keep their own shell semantics; execution still runs strict.

### Five Checks Evaluation

- **Sustainability**: aligns with the shared code surface without regressing the sourcing contract the hook depends on.

---

## RELATED DOCUMENTS

- Charter: `spec.md`
- Plan: `plan.md`
- Checklist: `checklist.md`
- Predecessor: `../009-skill-scoped-worktree-naming/decision-record.md`
