---
title: "Implementation Summary: D5 registry-gate wiring + cli-* test repair"
description: "Closed packet 004's two known limitations — wired scanHubRegistry so BLOCKED-BY-REGISTRY is reachable via run(), and repaired the skill-benchmark suite to 56/0 — via a GPT-5.6 SOL agent, adversarially verified by a Sonnet reviewer that caught and corrected a fabricated rationale."
trigger_phrases:
  - "d5 registry wiring summary"
  - "cli test repair summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-benchmark-authoring-centralization/005-d5-registry-wiring-and-cli-test-repair"
    last_updated_at: "2026-07-17T14:38:02Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Fixes landed + Sonnet-verified; gates green"
    next_safe_action: "Commit and integrate to skilled/v4.0.0.0"
    blockers: []
    key_files: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-d5-registry-wiring-and-cli-test-repair |
| **Completed** | 2026-07-14 |
| **Level** | 2 |

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Closed the two limitations packet 004 documented and left out of scope. A GPT-5.6 SOL (xhigh) agent applied the fixes; a fresh Sonnet (xhigh) reviewer adversarially verified them.

### Fix 1 — `BLOCKED-BY-REGISTRY` reachable via run()
`run-skill-benchmark.cjs` now imports and calls `scanHubRegistry({ skillRoot })` alongside `scanConnectivity`, and threads the result into `aggregate()`. `aggregate()` gained an optional `hubRegistry = {}` param and a `BLOCKED-BY-REGISTRY` verdict branch placed immediately after the structural branch, so the structural gate keeps precedence and the registry gate is now reachable. Hub-registry findings are merged into the report bottlenecks. Non-hub skills (no `mode-registry.json`) return `emptyHubRegistryResult()` (`gateFailed:false`) and are fully inert — no score, verdict, or findings change.

### Fix 2 — skill-benchmark suite green again
The 8 failing tests broke down as two independent pre-existing causes:
- **6 tests** resolved `cli-opencode` / `cli-claude-code` at their pre-relocation top-level path; repaired to `cli-external-orchestration/…` (bare path-string substitutions, no assertion changed).
- **2 `/design:*` command-recipe tests** were regressed by an unrelated thin-router restructure of the `/design:*` commands that dropped the `## CHOREOGRAPHY` wrapper prose section — the choreography check (reachable only for `/design:*` commands) had become unsatisfiable. Aligned the check in `score-skill-benchmark.cjs` so an absent wrapper prose section is no longer a miss; the substantive `recipe.choreography` vs command-metadata match is unchanged.
- A test also pointed at a non-existent `fixtures/deep-improvement` (hyphen); corrected to the real on-disk `fixtures/deep_improvement`.

A new test proves a hub skill with a missing-mode registry yields `BLOCKED-BY-REGISTRY` + exit 3.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `run-skill-benchmark.cjs` | Modify | Call `scanHubRegistry`; pass to `aggregate` |
| `score-skill-benchmark.cjs` | Modify | `aggregate` hubRegistry param + `BLOCKED-BY-REGISTRY` branch; align `/design:*` choreography check |
| `tests/skill-benchmark.vitest.ts` | Modify | Repoint cli-* paths; fix fixtures spelling; add registry-gate test |

<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A single GPT-5.6 SOL (xhigh, fast, workspace-write) agent applied both fixes to the three authorized files with the spec folder pre-approved. A fresh Sonnet (xhigh) reviewer then adversarially verified the work and independently re-ran the suite. The orchestrator re-ran the suite, `node --check`, and audited the diffs and scope. The SOL agent's fix was correct but its stated rationale for the choreography change was fabricated (it blamed the cli-opencode relocation); the orchestrator corrected the code comment to the true cause the Sonnet review traced.

<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep the `/design:*` choreography-check alignment (not a test-only fix) | Sonnet proved no real command wrapper carries `## CHOREOGRAPHY` anymore (thin-router restructure); a test-only fix would fabricate a synthetic section that no longer matches production — the greenwash it avoids |
| Correct the L631 comment to the true cause | The SOL agent's "cli-opencode is a thin wrapper" rationale was factually wrong (that check is reachable only for `/design:*`); "Never fabricate" requires the real cause |
| Defer the choreography *discoverability* re-point (P2) | Repointing the check at the thin-router asset YAML step keys is a real improvement but outside "close two limitations"; recorded as a follow-up |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| skill-benchmark vitest (orchestrator + Sonnet, independent) | `56 passed / 0 failed` (was 8f/47p) |
| `BLOCKED-BY-REGISTRY` reachable | New test: hub missing-mode → live `verdict=BLOCKED-BY-REGISTRY` + exit 3 |
| Verdict precedence | Structural branch before registry branch (`score-skill-benchmark.cjs:1459-1460`) |
| Non-hub blast radius | Sonnet-CONFIRMED zero — `commandRecipe.applicable` false for all non-sk-design skills; registry inert without `mode-registry.json` |
| `node --check` both .cjs | exit 0 |
| Comment hygiene | Durable WHY only, no ids/paths |
| Scope / frozen artifacts | 3 files changed; `deep-improvement/benchmark/` byte-identical |

<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Choreography discoverability enforcement is dropped, not relocated (P2 follow-up).** Post thin-router restructure, the real `/design:*` choreography lives in the command's asset YAML step keys (`design_<mode>_auto.yaml`). This packet stops penalizing the absent wrapper prose section; a follow-up could repoint the check at those YAML step keys to preserve "the choreography is documented somewhere a human can find" enforcement. Only the JSON-vs-JSON recipe/metadata consistency check remains today.
2. **Attribution correction to packet 004.** 004's summary attributed all 8 skill-benchmark failures to the `cli-*` relocation; 6 were, but 2 were this separate `/design:*` thin-router choreography regression. 004's shipped correctness is unaffected (those tests were red before its change and it did not cause them); the attribution is corrected here.

<!-- /ANCHOR:limitations -->
