---
title: "Implementation Summary: D3-R7 Registry static-audit gate"
description: "Post-build record for scanHubRegistry() beside scanConnectivity in d5-connectivity.cjs: the five registry checks, the BLOCKED-BY-REGISTRY hard gate, the healthy/broken/collision acceptance, the SEVERITY_PENALTY refactor with scanConnectivity left unchanged, and the offline-vitest verification limitation."
trigger_phrases:
  - "registry static audit implementation summary"
  - "scanhubregistry build record"
  - "blocked-by-registry gate summary"
importance_tier: "normal"
contextType: "general"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/003-d3-routing-utilization/007-registry-static-audit"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Record the scanHubRegistry build and the BLOCKED-BY-REGISTRY gate verification"
    next_safe_action: "Let the parent process refresh description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/d5-connectivity.cjs"
      - ".opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/tests/skill-benchmark.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-registry-static-audit |
| **Completed** | 2026-06-28 |
| **Level** | 2 |
| **Deliverables** | Additive `scanHubRegistry({ skillRoot })` in `d5-connectivity.cjs` + the `BLOCKED-BY-REGISTRY` hard gate + additive vitest blocks |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

The hub registry was structurally clean but undefended. Five modes, a typed router, and matched packet folders all lined up by hand, yet nothing stopped that state from silently rotting on the next edit. This phase adds a static auditor that turns the clean baseline into a guarded one: a registry mode with no packet or router projection, a packet folder nothing references, an alias owned by two modes, or a registry that will not parse now fails closed with the literal `BLOCKED-BY-REGISTRY` verdict instead of slipping through.

### `scanHubRegistry({ skillRoot })`

A new pure function sits beside `scanConnectivity` in `d5-connectivity.cjs` and mirrors its return shape (`score`, `gateFailed`, `findings[]`, named defect arrays) so a downstream consumer reads it the same way. It audits a skill's hub registry across five facets and reports each: `missingModes`, `deadPackets`, `aliasCollisions`, `packetNameMismatches`, and `uncoveredIntentRate` (with the raw `uncoveredKeywords` it could not type). When `mode-registry.json` is absent at `skillRoot`, the scan returns a benign pass (`registryPresent:false`, `score:100`, empty arrays), which is what keeps it a no-op for every registry-less skill and guarantees no-regression for the existing suite.

### The `BLOCKED-BY-REGISTRY` hard gate

Three classes are hard violations: a missing mode, a dead packet, and an alias collision. A registry that fails to parse is treated the same way, surfacing a `registry_unparseable` P0 finding rather than throwing. Any of these sets `gateFailed:true` and carries `verdict:'BLOCKED-BY-REGISTRY'` in the scan's own return (and folds into the additive CLI exit code). A `packetNameMismatch` is reported as a P1 finding that lowers the score but does NOT by itself trip the gate, and `uncoveredIntentRate` is a reported metric with its threshold gate OFF by default, so the clean baseline never blocks.

### `SEVERITY_PENALTY` refactor

The inline penalty literal `{ P0: 40, P1: 12, P2: 3 }` that `scanConnectivity` used was lifted to a single shared `SEVERITY_PENALTY` const at module scope and reused by both scans, so the registry findings and the connectivity findings score on exactly one penalty table. The values are identical to the prior inline literal; `scanConnectivity`'s logic is unchanged.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/d5-connectivity.cjs` | Modified | Added `scanHubRegistry` + the `BLOCKED-BY-REGISTRY` gate; lifted the inline penalty literal to a shared `SEVERITY_PENALTY` const; added `scanHubRegistry` to `module.exports` |
| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/tests/skill-benchmark.vitest.ts` | Modified | Added 5 additive test blocks (healthy real-state, synthetic broken registry, alias collision) + import expansions; existing blocks untouched |

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementer (cli-codex gpt-5.5 high fast) added `scanHubRegistry` beside `scanConnectivity`, wired the `BLOCKED-BY-REGISTRY` gate, performed the `SEVERITY_PENALTY` refactor, and added the additive vitest blocks. The orchestrator then verified acceptance independently rather than trusting the claim, and the numbers below were re-confirmed at doc time by requiring the module directly.

On the healthy live sk-design registry the scan returns `registryPresent:true`, `score:100`, `gateFailed:false`, `verdict:null`, with `missingModes`, `deadPackets`, `aliasCollisions`, and `packetNameMismatches` all empty, no findings, and `uncoveredIntentRate` measured at `0.39` (`0.3928…`) — an improvement on the ~0.46 research baseline because the typed hub-router vocabulary now covers more keywords. The gate was proven on two seeded defects: a registry missing its `hub-router.json` parsed-input produced a `registry_unparseable` finding and `verdict:'BLOCKED-BY-REGISTRY'`, and a registry with a valid `hub-router.json` but a colliding alias produced a populated `aliasCollisions` array plus an `alias_collision` finding and the same `BLOCKED-BY-REGISTRY` verdict.

No-regression was confirmed at the function level and the diff level, not by executing the full suite. `scanConnectivity` is logic-unchanged: the only `d5-connectivity.cjs` deletions are the benign refactor (inline `{ P0:40, P1:12, P2:3 }` to the shared `SEVERITY_PENALTY` const, same values) and the `module.exports` line gaining `scanHubRegistry`; `scanConnectivity` still runs and returns its intact keys. The vitest diff is purely additive (5 new blocks plus import expansions, no existing block modified). `node --check d5-connectivity.cjs` exits 0.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Mirror `scanConnectivity`'s return shape and severity model in `scanHubRegistry` | A score-comparison consumer integrates both scans the same way and reads consistent numbers from one penalty table |
| Guard the scan behind `registryPresent` and pass benignly when no `mode-registry.json` exists | Makes the change a no-op for every registry-less skill, so no-regression holds by construction for the rest of the suite |
| Fail closed to `BLOCKED-BY-REGISTRY` on `registry_unparseable` rather than throwing | An unparseable registry is an unverifiable one; matching the module's defensive style keeps the auditor itself from crashing the run |
| Keep `packetNameMismatch` a reported P1, not a gate trigger | The brief fixes the hard-violation set to missing mode / dead packet / alias collision; a name drift should surface and lower the score without blocking |
| Leave `uncoveredIntentRate` reported with its threshold OFF by default | The clean `0.39` baseline is informational drift signal, not a defect, so it must not block today |
| Lift the inline penalty literal to a shared `SEVERITY_PENALTY` const with identical values | One penalty table means the registry and connectivity scans can never disagree on scoring, and `scanConnectivity`'s behavior is preserved exactly |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --check d5-connectivity.cjs` | PASS, exit 0 (re-run at doc time) |
| Real-state (live sk-design) | PASS, `registryPresent:true`, `score:100`, `gateFailed:false`, `verdict:null`, all defect arrays empty, 0 findings |
| Real-state `uncoveredIntentRate` | PASS, `0.39` (`0.3928…`), improved from the ~0.46 research baseline |
| Synthetic gate (unparseable registry) | PASS, missing `hub-router.json` → `registry_unparseable` finding → `BLOCKED-BY-REGISTRY` |
| Synthetic gate (alias collision) | PASS, valid `hub-router.json` + colliding alias → `aliasCollisions` populated + `alias_collision` finding → `BLOCKED-BY-REGISTRY` |
| NO-REGRESSION: `scanConnectivity` unchanged | PASS, only deletions are the `SEVERITY_PENALTY` refactor (same values) + the `module.exports` line; `scanConnectivity` runs with intact keys |
| NO-REGRESSION: vitest diff additive | PASS, 5 new test blocks + import expansions; no existing block modified |
| Full skill-benchmark vitest suite | NOT RUN, suite is not runnable in this offline environment (needs network / its own config); no-regression verified at the function + diff level only |
| Scope clean (only the 2 named files) | PASS, `git status` shows only `d5-connectivity.cjs` + `skill-benchmark.vitest.ts` modified; no live skills file authored by this phase folder |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The full skill-benchmark vitest suite was not executed.** It is not runnable in this offline environment (it needs network access and its own config), so no-regression was verified at the function level (`scanConnectivity` logic-unchanged and still runs) and the additive-diff level, not by a green suite run. Re-run `npx vitest run skill-benchmark/tests` from `scripts/` in a networked environment to close this out.
2. **`uncoveredIntentRate` is reported, not gated.** It measures `0.39` on the live registry (vs the ~0.46 research baseline); its threshold gate is documented but OFF by default, so untyped-keyword drift surfaces in the score and findings but never trips `BLOCKED-BY-REGISTRY`.
3. **`packetNameMismatch` is non-gating by design.** A registry `packetSkillName` that drifts from a packet's `SKILL.md` `name:` lowers the score and emits a P1 finding but does not block; only missing mode / dead packet / alias collision / unparseable registry trip the hard gate.
4. **Aggregate-ladder wiring is out of scope.** Threading a `BLOCKED-BY-REGISTRY` tier into `score-skill-benchmark.cjs aggregate()` is an explicit follow-on, not delivered here; the verdict currently lives in the scan return and the additive CLI exit code.

<!-- /ANCHOR:limitations -->

---

<!--
LEVEL 2 IMPLEMENTATION SUMMARY
- Core + Level 2 verification focus
- Build record for scanHubRegistry beside scanConnectivity + the BLOCKED-BY-REGISTRY gate
- No-regression verified at the function + diff level; full vitest suite not runnable offline
-->
