---
title: "Implementation Summary: deterministic enforcement for the context-loading contract"
description: "Closed the 035 review/benchmark gaps with calculators: proof_check.py (deterministic proof-of-application gate, PASSES contract runs / FAILS baseline), APCA-W3 Lc added to contrast_check.py, both wired into the contract HARD GATES + the proof card. Also fixed the deferred memory indexing by rebuilding better-sqlite3, after which the daemon indexed the whole arc (029/030/035/036, 18 rows)."
trigger_phrases:
  - "context contract enforcement summary"
  - "proof check gate added"
  - "memory indexing fixed"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/037-design-context-enforcement"
    last_updated_at: "2026-06-28T07:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Added proof gate + APCA + wiring; rebuilt better-sqlite3; indexed the arc"
    next_safe_action: "Optional: per-mode router auto-load of the contract (deferred F-004 piece)"
    blockers: []
    key_files:
      - "spec.md"
      - "../../../../skills/sk-design/shared/scripts/proof_check.py"
      - "../../../../skills/sk-design/design-foundations/scripts/contrast_check.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "build-154-037-design-context-enforcement"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Deterministic calculators close both the weak-model contrast gap and the orchestrator-path enforcement gap without touching the per-mode router blocks"
      - "Memory indexing was an environment defect (better-sqlite3 ABI), fixed by rebuild; the daemon then indexed the arc"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | Complete |
| **Date** | 2026-06-28 |
| **Level** | 1 |
| **Type** | Enforcement follow-up + environment fix |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Two calculators that make the contract's failure-prone gates enforceable, their wiring, and the fix that restored memory indexing.

### Headline
The contract no longer relies on a model judging its own ratios or remembering to prove its work. `contrast_check.py` now reports **APCA-W3 Lc** beside the WCAG ratio, and `proof_check.py` is a **deterministic delivery gate** that exits non-zero unless all four proof fields are present and the verdict reads READY — empirically PASSING the contract benchmark runs and FAILING the baseline. Separately, rebuilding `better-sqlite3` unblocked semantic indexing; the daemon then indexed the whole arc.

### Files Changed
- **New:** `sk-design/shared/scripts/proof_check.py` — deterministic proof-of-application gate (checkbox-aware verdict).
- **Edited:** `sk-design/design-foundations/scripts/contrast_check.py` — added APCA-W3 0.1.9 Lc (functions + evaluate + output column).
- **Edited:** `sk-design/shared/context_loading_contract.md` — §5 deterministic-enforcement note pointing at both calculators.
- **Edited:** `sk-design/shared/assets/proof_of_application_card.md` — gate footer.
- **Environment:** `better-sqlite3` rebuilt against the active node (not a tracked code change); arc reindexed.
- **Wrapper:** `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Done directly (surgical). First the deferred fix: `npm rebuild better-sqlite3` against node v22.23.1 (MODULE_VERSION 127) restored the native module; the spec-memory daemon (pid 8028) then became the single-writer and indexed the arc — confirmed by row counts in `memory_index`. Then APCA was added to the contrast checker and `proof_check.py` written, each smoke-tested against the real 035 benchmark artifacts before wiring into the contract + card.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- **Calculators, not prose** — the benchmark proved a model will run a check yet mis-judge it; deterministic scripts remove the judgment.
- **Standalone gates over router edits** — closes the enforcement need without touching the per-mode smart-router blocks (that piece stays deferred per research §17).
- **APCA alongside WCAG** — WCAG remains the contract's stated target; APCA Lc is reported as the perceptual companion, implemented per APCA-W3 0.1.9.
- **Rebuild over workaround** — the indexing failure was a genuine native-module ABI defect; rebuilding fixed the root cause.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

- **Proof gate**: `proof_check.py` → PASS on minimax-B + kimi-B, FAIL on kimi-A (missing all four fields); checkbox-aware verdict avoids the unchecked-label false positive.
- **APCA**: `#787878`/white → WCAG 4.42 / APCA Lc 70.6 (both sub-body); `#0a1a2f`/white → 17.48 / Lc 104.2. Both scripts `py_compile` clean.
- **Indexing**: `memory_index` holds 029=4, 030=4, 035=4, 036=6 rows (18 total, BM25/FTS searchable).
- **Docs**: edited contract + card pass `sk-doc validate_document.py`.
- **Packet**: `validate.sh --strict` (see final state).
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- **One F-004 piece still deferred** — wiring the contract into the per-mode smart-router RESOURCE_MAPs (executable auto-load) is not done; it edits the router blocks and is architectural (research §17). The standalone calculators cover the enforcement need meanwhile.
- **APCA scope** — Lc is reported but the contract's pass/fail target stays WCAG; no APCA threshold gating yet.
- **Embeddings deferred** — the arc is BM25/FTS searchable now; vector embeddings index asynchronously via the daemon (normal path).
<!-- /ANCHOR:limitations -->
