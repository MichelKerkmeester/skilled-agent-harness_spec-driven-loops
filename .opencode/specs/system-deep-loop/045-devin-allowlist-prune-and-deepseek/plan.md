---
title: "Implementation Plan: devin allowlist prune, DeepSeek gap, and mirror parity"
description: "Evidence-gated prune of the curated-out devin aliases, addition of the missing DeepSeek ids, and a mirror-parity test, executed by a dispatched GPT-5.6 SOL session and verified by the orchestrator."
trigger_phrases:
  - "devin prune plan"
  - "deepseek allowlist addition plan"
  - "mirror parity test plan"
  - "devin curated scope enforcement"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/045-devin-allowlist-prune-and-deepseek"
    last_updated_at: "2026-07-30T07:45:39.076Z"
    last_updated_by: "implementer"
    recent_action: "Record the executed approach"
    next_safe_action: "Commit the runtime change + packet"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts"
      - ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-045-plan"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: devin allowlist prune, DeepSeek gap, and mirror parity

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Evidence-gated narrowing of the devin dispatch surface to the curated four-family scope: prune nine curated-out aliases, add the two missing DeepSeek ids, and pin the deliberate CJS mirror to the TS source with parity tests so drift becomes a test failure instead of a silent risk. Implemented by a GPT-5.6 SOL (high, fast) dispatch under an exact-target-state brief; verified independently by the orchestrator.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Criteria | Result |
|------|----------|--------|
| Prune gate | No runtime-consumed config names a pruned alias | PASS — sweep of deep-loop scripts/configs found none |
| Unit suites | Both suites fully green including new parity tests | PASS — 182/182 (orchestrator-run) |
| Surface parity | Both devin blocks = exactly the 15-id curated set; default `swe` | PASS (greps: 15/15, 0 pruned ids, deepseek ×2 each) |
| Fail-closed prune | `adaptive` / `opus` now rejected | PASS (rejection fixtures green) |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

The devin allowlist exists in two deliberate surfaces: the typed source (`executor-config.ts`) and a plain-JS mirror in `fanout-run.cjs` kept so the lineage-command builder stays synchronous and directly unit-testable (the same doctrine as the cursor mirror). This packet keeps that shape and instead exposes the mirror's set + default on the script's existing export surface, letting a vitest assert sorted-set and default equality against the TS exports. Drift now fails CI rather than shipping.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Evidence gate

Sweep runtime-consumed configs (deep-loop scripts, dispatch adapters, compiled-routing harnesses) for the nine prune candidates in devin context — none found. Re-check catalog↔runtime mapping, which surfaced the missed DeepSeek family: the catalog features it but no deepseek id existed in the devin allowlist.

### Phase 2: Dispatched implementation

Single SOL pass edits both allowlist surfaces to the exact 15-id target set, exposes the mirror internals via the existing `module.exports`, adds the two parity assertions, extends the rejection fixtures with pruned ids, and updates the exact-set pin.

### Phase 3: Independent verification

Orchestrator re-runs both suites (182/182) and greps both devin blocks: 15 ids each, zero pruned ids, DeepSeek present twice in each, default `swe` in both.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- `npx vitest run tests/unit/executor-config.vitest.ts tests/unit/fanout-run.vitest.ts` — orchestrator-run, not executor-claimed
- New parity tests: `[...DEVIN_ALLOWED_MODELS].sort()` equals `[...DEVIN_SUPPORTED_MODELS].sort()`; CJS default equals TS default
- Rejection fixtures extended with `adaptive` and `opus` (pruned) alongside the existing off-list ids
- Content greps as the structural backstop (counts, pruned-id absence, deepseek presence)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Live `devin models list` — provenance for `deepseek-v4-pro` / `deepseek-v4`
- The curated cli-devin catalog — the scope authority
- Predecessor packet's additive change — this packet completes what it deferred
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Single revert restores the superset allowlist and removes the parity tests. Rejections are fail-closed errors at dispatch construction, so any config that unexpectedly named a pruned alias surfaces loudly and is fixed by naming a curated id — no data or persisted state involved.
<!-- /ANCHOR:rollback -->
