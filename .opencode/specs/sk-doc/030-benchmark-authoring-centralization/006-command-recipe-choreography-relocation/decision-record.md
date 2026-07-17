---
title: "Decision Record: command-recipe choreography relocation"
description: "Architectural decisions from the SOL ultra advisory: relocate (not repoint) the choreography discoverability check, use a structural (not positional) contract, and de-mask the self-masking test."
trigger_phrases:
  - "choreography relocation decisions"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-benchmark-authoring-centralization/006-command-recipe-choreography-relocation"
    last_updated_at: "2026-07-14T21:15:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Recorded the architectural decisions"
    next_safe_action: "Run Phase 1"
    blockers: []
    key_files: []
    completion_pct: 5
    open_questions: []
    answered_questions: []
---
# Decision Record: command-recipe choreography relocation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Relocate the choreography check to sk-design, do not repoint it positionally in Lane C

<!-- ANCHOR:adr-001-context -->
### Context
Packet 005 removed a false-positive "wrapper `## CHOREOGRAPHY` section is missing" penalty from the Lane C scorer, leaving choreography discoverability enforced nowhere. The tempting fix (A) was to repoint the Lane C check at the new home of choreography — the asset YAML step keys. Grounding showed the two abstractions do not align: `command-metadata.json` carries 5 coarse choreography rows, `design_<mode>_auto.yaml` carries 7 business steps, and `_confirm` adds `step_0_show_prompt`. A positional `recipe.order === step_N` match would reject correct commands.
<!-- /ANCHOR:adr-001-context -->

<!-- ANCHOR:adr-001-decision -->
### Decision
Delete the dead Lane C wrapper-prose branch and keep only the recipe↔metadata equality check there. Move choreography-implements-metadata enforcement to `design-command-surface-check.mjs`, which already owns exactly the 5 design commands and reads their assets — the correct layer.
<!-- /ANCHOR:adr-001-decision -->

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered
- **A — Repoint in Lane C at YAML step keys.** Rejected: incompatible abstractions (5 metadata rows vs 7 YAML steps) force either a false-rejecting positional match or a too-permissive fuzzy match, and it deepens a `/design:*`-specific special case inside a general scorer.
- **B — Leave dropped, delete the dead branch, do nothing else.** Rejected as insufficient: recipe↔metadata equality proves fixture honesty, not that the runtime YAML implements the metadata. Discoverability stays unenforced.
<!-- /ANCHOR:adr-001-alternatives -->

<!-- ANCHOR:adr-001-consequences -->
### Consequences
Enforcement lands at the source-of-truth layer and covers all 5 commands + both execution variants. Cost: the sk-design validator must first be repaired (it currently exits INVALID at the metadata stage) before its choreography check can be strengthened.
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Structural (not positional) choreography contract

<!-- ANCHOR:adr-002-context -->
### Context
The strengthened validator check must verify that the runtime YAML implements the metadata choreography without inferring metadata order from YAML step numbers (which would false-reject given the 5-vs-7 mismatch).
<!-- /ANCHOR:adr-002-context -->

<!-- ANCHOR:adr-002-decision -->
### Decision
Enforce a structural contract: each `design_<mode>_{auto,confirm}.yaml` must have ordered, unique `step_N_<name>` keys with `purpose`/`action`/`output`; auto and confirm must share the same ordered business-step sequence (with `step_0_show_prompt` the sole confirm-only exemption); and canonical hub-load, mode-load, core-workflow, and handoff witnesses must be present in both. If exact semantic mapping is later required, add an explicit owner-defined step-key mapping rather than a positional or text heuristic.
<!-- /ANCHOR:adr-002-decision -->

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered
- **Positional `order === step_N`.** Rejected — false-rejects correct commands.
- **Fuzzy whole-file text matching.** Rejected — too permissive; the existing 50%-overlap check is exactly the weakness being replaced.
<!-- /ANCHOR:adr-002-alternatives -->

<!-- ANCHOR:adr-002-consequences -->
### Consequences
The check becomes meaningful and stable across the thin-router architecture. Negative tests must prove each mutation (missing/renamed step, auto/confirm drift, resource/action drift) fails, and the confirm-only `step_0` is accepted.
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: De-mask the recipe test and document the lane's layering debt

<!-- ANCHOR:adr-003-context -->
### Context
The unit helper `designRecipe()` builds the recipe from a **live** clone of `command-metadata.json`, so it can never detect drift between committed gold and live metadata — which is exactly why the stale `valid` fixture (4 rows vs live 5) went unnoticed. Separately, the `commandRecipe` lane is a `/design:*`-hardcoded extension inside a general D1–D5 scorer whose documented gold schema does not include `commandRecipe`.
<!-- /ANCHOR:adr-003-context -->

<!-- ANCHOR:adr-003-decision -->
### Decision
De-mask the test so it loads committed gold, and refresh the stale fixture to current metadata. Do not remove the `/design:*`-specific lane now; record it as a layering follow-up with the recommended direction: if other skills ever need command-recipe validation, add a target-owned adapter interface rather than broadening the special case.
<!-- /ANCHOR:adr-003-decision -->

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered
- **Remove the lane from the general scorer now.** Deferred — larger refactor, out of this packet's scope; no second consumer exists yet.
<!-- /ANCHOR:adr-003-alternatives -->

<!-- ANCHOR:adr-003-consequences -->
### Consequences
Fixture drift becomes catchable. The layering debt is documented rather than silently carried.
<!-- /ANCHOR:adr-003-consequences -->
