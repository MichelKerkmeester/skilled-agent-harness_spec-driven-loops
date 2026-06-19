---
title: "Implementation Summary: Recall→Render Trust Escaper + Substrate-Kind Recall Correctness (028/001 impl phase)"
description: "Planning-state implementation summary for the six write→recall→prompt spine candidates. One candidate (Constitutional-CAS-guard) is shipped in 030; the remaining five are planned/pending."
trigger_phrases:
  - "028 recall render escaper implementation summary"
  - "C8 implementation status"
  - "recall trust spine status"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/001-speckit-memory/005-005-recall-render-escaper"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Re-planned the impl phase; recorded CAS-guard DONE + 5 pending candidates"
    next_safe_action: "Implement C8 + capture-side injection-filter as one recall-trust spine"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-001-005-recall-render-escaper-impl"
      parent_session_id: null
    completion_pct: 17
    open_questions: []
    answered_questions: []
---

# Implementation Summary: Recall→Render Trust Escaper + Substrate-Kind Recall Correctness (028/001 impl phase)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Status** | Planned (1 of 6 candidates shipped via 030; 5 pending) |
| **Phase** | `system-spec-kit/028-memory-search-intelligence/001-speckit-memory/005-005-recall-render-escaper` |
| **Branch** | `system-speckit/027-xce-research-based-refinement` |
| **Completion** | ~17% (1 DONE / 5 PENDING) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This is a **re-plan**: the phase scopes the write→recall→prompt trust spine plus two same-boundary recall-correctness candidates. Build state per candidate:

| Candidate | Status | Evidence |
|-----------|--------|----------|
| **Constitutional-CAS-guard** | **DONE** | Commit `e1c6a3c793` (030 §14 #10). `E_CONSTITUTIONAL_SELF_EDIT` (unconditional) + `E_STALE_CONSTITUTIONAL_UPDATE` (opt-in `expectedHash` CAS) live at `memory-crud-update.ts:118-142`, precondition wired at `:269-275`; non-constitutional path byte-identical; opus review SHIP; 114 tests pass. |
| **C8 source_kind-gated render escaper** | PENDING | No `recalled-memory-context` wrapper exists in `mcp_server/` (grep = 0). Render boundary still emits raw recalled bodies into the HOT tier. |
| **M-write-time-injection-filter** | PENDING | No `detectInjectionMarkers` exists; `redaction-gate.ts:25-33` is secrets-only. |
| **Constitutional-CAS-P2-polish** | PENDING | The opus-flagged dead downgrade-audit branch (`memory-crud-update.ts:451-452`) is still present; the opt-in-vs-always-on CAS posture is undocumented. |
| **M-system-kind-exclusion** | PENDING (re-scoped from DEFERRED) | 030 dropped the cheap `source_kind='system'` predicate (live-DB proved it = 9,592 canonical spec-docs incl. 29 constitutional rules; hides ~49% of recall). Re-scoped to a real substrate signal. |
| **M-residual-retention-report** | PENDING | No `residual_retention` field on `MemoryRetentionSweepResult` (grep = 0). |

**Done: 1 / Pending: 5.**
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

- **Constitutional-CAS-guard** was delivered in the 030 Wave-0 flat packet (commit `e1c6a3c793`, alongside enrichment gauges + skip-closed sweep hygiene); this phase references that shipped record rather than re-implementing it.
- The remaining five candidates are planned here for implementation as small, independently reversible, individually tested changes on the 028 branch — the recall-trust spine (C8 + injection-filter + probe) as one coherent change, the CAS P2 polish as cleanup, the substrate-kind exclusion as a real correctness build, and the residual-retention field as an additive read-side disclosure.
- Sequencing, shared-infra deps, and rollback are in `plan.md`; the task breakdown is in `tasks.md`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- **C8 = the `source_kind`-gated content-body escaper, NOT the broad cross-cutting wrapper.** The naive cross-cutting C8 generalization was refuted/reachability-gated (Code-Graph render is escaped+trusted; the Deep-Loop sink is dead-code); the durable surviving shape is the render-boundary escaper on the recalled body gated by the stored `source_kind` (synthesis §C, §04).
- **Wrap at the recall content formatter, NOT `wrapForMCP`/`envelope.ts:284-295`** (which serializes every response) — iter-036 ready-to-spec correction.
- **The injection-filter is non-destructive and SEPARATE from the secrets redaction** (flag-only metadata; anchored multi-token phrases; benign-corpus zero-FP gate) — iter-019 / iter-033 reference port.
- **M-system-kind keeps the default flip GATED on a real substrate signal + a constitutional/spec-doc short-circuit + live-DB validation** — the cheap predicate is refuted (it hid ~49% of recall).
- **residual-retention is scoped to the EXISTING sweep result (reading-b), not an `EraseReport`** — the EraseReport variant is NO-GO until an erasure path exists (iter-016); no persistent deny-list registry (GDPR guard rail).
- **Authoritative-source resolution of the I36-02 ↔ synthesis tension:** synthesis wins (per §D) — C8 is a render-gap; the capture filter still installs at the shared `indexSingleFile` chokepoint, but it is not billed as closing a working-memory ingest-bypass.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

- **Constitutional-CAS-guard (DONE):** verified in 030 — `tsc` + build pass; 114 search/crud/schema/health/promoter tests pass; opus review SHIP. Re-confirmed here by reading `memory-crud-update.ts:118-142` (the two error codes + the precondition wiring are present).
- **Pending candidates:** not yet verified — each will require its focused vitest (poison/injection probe, benign-corpus zero-FP gate, CAS posture, substrate-kind default-hidden/opt-in-visible, residual_retention field), the existing suite green with a captured baseline + reported delta, live-DB validation for the substrate-kind exclusion, and `validate.sh --strict` on this folder.
- **This planning artifact** passes `validate.sh --strict` on the folder (spec/plan/tasks/checklist/impl-summary anchors + continuity frontmatter).
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- **No measured benefit number for any candidate** — every leverage/effort tag is structural inference (campaign-wide caveat, synthesis §B). Ship for correctness/reversibility, not a promised delta.
- **C8 is the single-most-likely-wrong verdict of the whole 028 campaign** — its leverage rests on the threat model; the `source_kind`-gated escaper is shipped regardless because it is always-on, additive, and reversible.
- **The aggregate Red-team probe-gate CI is out of scope** — this phase ships its own focused probe vitest; the named cross-cutting CI gate is a sibling phase.
- **M-system-kind default flip is held** until the real substrate signal + live-DB validation are in place; only the opt-in surface path is unconditionally safe.
- **The `EraseReport.residual_retention` variant stays deferred** — no erasure path exists; only the additive sweep-result field ships.
<!-- /ANCHOR:limitations -->

---

## RELATED DOCUMENTS
- **Spec / plan / tasks / checklist:** this folder.
- **Research:** `../research/research.md`; `../../research/roadmap.md`; `../../research/synthesis/{01,03,04}-*.md`; deltas `../research/deltas/iter-{012,016,019,033,036}.jsonl`.
- **Shipped record (do NOT modify):** `../../../030-memory-search-intelligence-impl/spec.md` §14 (`e1c6a3c793`).
