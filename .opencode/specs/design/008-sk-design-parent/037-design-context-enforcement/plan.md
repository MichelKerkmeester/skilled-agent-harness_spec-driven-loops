---
title: "Plan: deterministic enforcement for the context-loading contract"
description: "Add proof_check.py (proof-of-application gate) + APCA to contrast_check.py, wire both into the contract + card, and restore memory indexing (better-sqlite3 rebuild + reindex). Surgical."
trigger_phrases:
  - "context contract enforcement plan"
  - "proof check apca plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/037-design-context-enforcement"
    last_updated_at: "2026-06-28T07:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Recorded the enforcement + indexing approach"
    next_safe_action: "Optional per-mode router auto-load (deferred F-004 piece)"
    blockers: []
    key_files:
      - "spec.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "build-154-037-design-context-enforcement"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Plan: deterministic enforcement for the context-loading contract

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## SUMMARY

Close the two failure-prone gates with calculators and restore memory indexing. Add a deterministic proof-of-application gate, add APCA-W3 Lc to the contrast checker, wire both into the contract + card, and rebuild the broken native module so the arc indexes. Done directly (small, precise).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## QUALITY GATES

- `proof_check.py` PASSES the contract benchmark runs (minimax-B, kimi-B) and FAILS the baseline (kimi-A).
- `contrast_check.py` reports APCA Lc alongside WCAG; both scripts compile.
- Contract §5 + the proof card reference both calculators.
- The arc packets are present in `memory_index` (BM25/FTS searchable).
- Edited docs pass `sk-doc validate_document.py`; `validate.sh --strict` clean for the packet.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## ARCHITECTURE

- **proof_check.py** (`shared/scripts/`): stdlib regex gate over a filled proof card/notes file — checks REGISTER/DIALS, CONTRAST PAIRS, INTERFACE PREFLIGHT, AUDIT EVIDENCE and a checkbox-aware READY verdict; exits non-zero if incomplete.
- **contrast_check.py** APCA: APCA-W3 0.1.9 luminance (2.4 power + black soft-clamp) and polarity-aware Lc; reported next to the WCAG ratio (WCAG stays the contract's stated target).
- **Indexing fix**: `npm rebuild better-sqlite3` against the active node restored the native module; the spec-memory daemon then initialized as the single-writer and indexed the arc.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## IMPLEMENTATION PHASES

1. **Fix deferred** — rebuild `better-sqlite3`; confirm the arc packets index into `memory_index`.
2. **Build gates** — add APCA to `contrast_check.py`; write `proof_check.py`; smoke both on the benchmark artifacts.
3. **Wire** — reference both calculators in the contract §5 and the proof card.
4. **Finalize** — sk-doc the edited docs; author the wrapper; strict-validate; commit + push.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## TESTING STRATEGY

Empirical: `proof_check.py` against all four benchmark `notes.md` (PASS B, FAIL A); `contrast_check.py` against the decisive pairs (`#787878`/white Lc 70.6, `#0a1a2f`/white Lc 104.2); `py_compile` both; a `memory_index` row-count query per packet; `sk-doc` on edited docs; `validate.sh --strict` on the packet.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## DEPENDENCIES

- 035 review + benchmark (the findings + the test artifacts the gate is smoked against).
- Live contract + cards + worksheet.
- `python3` (stdlib only); `npm` + node-gyp for the better-sqlite3 rebuild.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## ROLLBACK PLAN

Additive: delete the two scripts + revert the contract/card notes + the `037` folder. The better-sqlite3 rebuild is re-runnable (`npm rebuild`); no data is mutated, only the native binding recompiled.
<!-- /ANCHOR:rollback -->

---

## Cross-References
- **Specification**: `spec.md`
- **Findings**: `../035-design-context-benchmark/review/review-report.md`
