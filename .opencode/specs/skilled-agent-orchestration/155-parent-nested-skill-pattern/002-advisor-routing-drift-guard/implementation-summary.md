---
title: "Implementation Summary: Registry advisorRouting block + CI drift-guard"
description: "Phase 002 of the parent-nested-skill-pattern epic: made mode-registry.json the declarative source of truth via a per-mode advisorRouting block, added a --dump-routing-maps flag, exported DEEP_MODE_BY_CANONICAL, and added a drift-guard vitest. C-plus: no runtime registry read; 19/19 tests green."
trigger_phrases:
  - "advisorRouting drift guard summary"
  - "phase 002 complete"
  - "C-plus routing implemented"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/155-parent-nested-skill-pattern/002-advisor-routing-drift-guard"
    last_updated_at: "2026-06-15T13:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "C-plus routing implemented + verified (19/19 vitest, one identity)"
    next_safe_action: "Phase 4 formalization (sk-doc + create + doctor + benchmark)"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-workflows/mode-registry.json"
      - ".opencode/skills/system-skill-advisor/mcp_server/tests/routing-registry-drift-guard.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-155-002-implementation-summary"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Runtime registry-read or drift-guard? C-plus drift-guard — no novel cross-skill coupling, same anti-drift guarantee"
---
# Implementation Summary: Registry advisorRouting block + CI drift-guard

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Phase** | 002 of the parent-nested-skill-pattern epic |
| **Status** | Complete |
| **Date** | 2026-06-15 |
| **Branch** | `system-speckit/027-xce-research-based-refinement` |
| **Depends on** | `../research/research.md` |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

Implemented the phase-2 recommendation (Model A via C-plus) as a purely additive change across four files:

- **`mode-registry.json`** — a per-mode `advisorRouting` block on all 8 modes: `routingClass` (lexical | alias-fold | metadata | command-bridge), `legacyAdvisorId`, `advisorDefaultMode` (agent-improvement only), `legacyAliases`, `packetSkillName`; plus a top-level `advisorRoutingContract` legend. Registry version bumped 1.0.0 → 1.1.0. The description now states the C-plus reality (the advisor does not read this at runtime; a drift-guard keeps the maps in sync).
- **`skill_advisor.py`** — a read-only `--dump-routing-maps` flag that emits `DEEP_ROUTING_SKILLS` + `DEEP_ROUTING_MODE_BY_KEY` as JSON for the test.
- **`aliases.ts`** — exported the previously module-private `DEEP_MODE_BY_CANONICAL`.
- **`tests/routing-registry-drift-guard.vitest.ts`** — the new guard: registry projection equals the Python and TS maps, alias sets equal `SKILL_ALIAS_GROUPS`, coverage of all modes, exactly one `advisorDefaultMode`.

The mechanism is **C-plus, not runtime-derive**: the advisor keeps its hardcoded maps and the registry is enforced as the source of truth by the test, so there is no cross-skill import on the advisor hot path (the advisor's only existing import-time `json.load` is advisor-local).

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Implemented directly by the orchestrator after host-verifying the real maps, alias groups, and test harness against source. The registry projection was checked to equal the real maps before the test was written, so the guard passed first run. No worker fleet — the vitest suite is the gate.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

- **C-plus over runtime-derive** (from `../research/research.md`): a CI drift-guard, not an advisor that reads the registry at runtime.
- **Lexical regex weights stay in Python**; the registry governs only the projection + routing class.
- **`routingClass` makes the three cardinalities explicit data**: lexical (Python 3) / lexical+alias-fold (TS 4) / metadata (context) / command-bridge (the improvement lanes).
- **`ai-council` grandfathered** via `packetSkillName: "deep-ai-council"` (folder stays `ai-council`).

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

- `npx vitest run` over the drift-guard + both routing-parity suites: **19 passed (5 + 9 + 5)**.
- `python3 skill_advisor.py --dump-routing-maps` emits the maps; registry `lexical` projection == `DEEP_ROUTING_MODE_BY_KEY`, `lexical`+`alias-fold` == `DEEP_MODE_BY_CANONICAL` (exact).
- One `graph-metadata.json` under `deep-loop-workflows` (no new advisor identity).
- `skill_advisor.py` parses clean (`ast.parse`).
- `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this folder> --strict` — run at close-out this turn; expected green at Level 2.

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

- The drift-guard covers the projection maps + alias sets, not the lexical regex *weights* (those stay tuning in Python by design); a separate coverage fixture for the lexical SET could be added later if a mode's lexical membership changes.
- `model-benchmark` keeps its own `deep-model-benchmark` command-bridge alias group (in `RAW_ALIAS_GROUPS`) which is outside the mode-projection maps; the guard correctly classifies it `command-bridge` and excludes it from the projection comparison.

<!-- /ANCHOR:limitations -->
