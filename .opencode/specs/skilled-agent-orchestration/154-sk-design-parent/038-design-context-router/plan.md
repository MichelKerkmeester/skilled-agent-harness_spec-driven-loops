---
title: "Plan: per-mode router auto-load of the context-loading contract"
description: "Add the contract to DEFAULT_RESOURCE + an ALWAYS row of the interface/foundations/audit routers so it auto-loads on every task. Surgical, additive."
trigger_phrases:
  - "context contract router plan"
  - "F-004 default resource plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/038-design-context-router"
    last_updated_at: "2026-06-28T07:30:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Recorded the router auto-load approach"
    next_safe_action: "Arc complete"
    blockers: []
    key_files:
      - "spec.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "build-154-038-design-context-router"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Plan: per-mode router auto-load of the context-loading contract

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## SUMMARY

Make the contract load deterministically for the orchestrator's own design work by adding it to the always-loaded base (`DEFAULT_RESOURCE`) of the three build-capable mode routers, with a matching ALWAYS resource-loading row to keep the human table and the machine router in parity. Done directly — six additive edits.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## QUALITY GATES

- The contract is in `DEFAULT_RESOURCE` of interface/foundations/audit and the path resolves.
- Each `DEFAULT_RESOURCE` still parses as a valid Python list; INTENT_SIGNALS/RESOURCE_MAP untouched.
- Each mode has a matching ALWAYS resource-loading row (table↔router parity).
- The three SKILLs pass `sk-doc validate_document.py`.
- `validate.sh --strict` clean for the packet.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## ARCHITECTURE

Each mode router exposes `DEFAULT_RESOURCE` (loaded on every task) + `INTENT_SIGNALS` + `RESOURCE_MAP`. The change adds one entry — `../shared/context_loading_contract.md` — to `DEFAULT_RESOURCE` (where `register.md` already lives), so the router unions it into every routed resource set. The contract sits in the parent `shared/` dir, the sanctioned cross-packet location the D5 connectivity gate already recognizes for `register.md`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## IMPLEMENTATION PHASES

1. **Read** each mode's resource-loading table + router (DEFAULT_RESOURCE) to confirm load semantics.
2. **Edit** — add the contract to `DEFAULT_RESOURCE` and an ALWAYS row in interface, foundations, audit.
3. **Verify** — eval each `DEFAULT_RESOURCE` as a list; confirm path resolution; sk-doc the three SKILLs.
4. **Finalize** — author the wrapper; strict-validate; commit + push to 028.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## TESTING STRATEGY

Structural: `ast.literal_eval` each `DEFAULT_RESOURCE` line (must be a valid list containing the contract); filesystem existence of `../shared/context_loading_contract.md` from each mode; `sk-doc validate_document.py` on the three SKILLs; `validate.sh --strict` on the packet. INTENT_SIGNALS/RESOURCE_MAP left byte-unchanged, so routing for existing intents is unaffected.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## DEPENDENCIES

- The live contract (`shared/context_loading_contract.md`).
- The three mode routers.
- `sk-doc` validator; `python3` for the list-parse check.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## ROLLBACK PLAN

Additive: revert the one entry in each `DEFAULT_RESOURCE` + the three ALWAYS rows (`git checkout` the three SKILLs) + delete the `038` folder. INTENT_SIGNALS/RESOURCE_MAP were not touched, so no routing logic changes to unwind.
<!-- /ANCHOR:rollback -->

---

## Cross-References
- **Specification**: `spec.md`
- **Finding**: `../035-design-context-benchmark/review/review-report.md` (F-004)
