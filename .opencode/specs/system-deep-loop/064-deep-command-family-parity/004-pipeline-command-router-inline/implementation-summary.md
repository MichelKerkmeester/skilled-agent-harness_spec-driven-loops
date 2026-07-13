---
title: "Implementation Summary: pipeline command router inline — uniform triad shape for the 4 render-pipeline deep commands"
description: "Level 2 implementation summary — research/review/ai-council/alignment are now full self-describing router triads with the runtime bang dropped and the compile/render/drift pipeline kept dormant-but-maintained."
trigger_phrases:
  - "deep command router inline"
  - "promote deep command body drop bang"
  - "render pipeline stub to router triad"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/064-deep-command-family-parity/004-pipeline-command-router-inline"
    last_updated_at: "2026-07-13T21:30:00Z"
    last_updated_by: "claude"
    recent_action: "Promoted the 4 stubs to inline routers; recompiled contracts; all local gates green"
    next_safe_action: "Run live :auto smoke of research/review; orchestrator runs generate-context.js next"
    completion_pct: 90
---
# Implementation Summary: pipeline command router inline — uniform triad shape for the 4 render-pipeline deep commands

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-pipeline-command-router-inline |
| **Completed** | 2026-07-13 (implementation + local verification; live smoke + orchestrator save pending) |
| **Level** | 2 |
| **Actual Effort** | Plan estimate 140 minutes (actual not separately tracked) |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

All 8 `/deep:*` commands now share one self-describing router-triad shape. The four render-pipeline commands — `research`, `review`, `ai-council`, `alignment` — are no longer opaque ~10-line render stubs: each committed `command.md` now holds its full `## 1..## 6` router body inline, the runtime `!render-command-contract.cjs` bang is gone, and the compile/render/drift pipeline stays present and maintained but off the live path. What the operator opens is now the router itself.

### The four promoted routers

Each of `research`, `review`, `ai-council`, and `alignment` is now frontmatter (with `allowed-tools` preserved byte-for-byte) + H1 + the promoted `legacy/deep_<name>.body.md` router body, with a folded `### AUTONOMOUS EXECUTION DIRECTIVE (:auto)` subsection inside `## 1 ROUTER CONTRACT`. The directive prose was extracted faithfully from each command's compiled `autonomousExecutionDirective`, so autonomous behaviour is preserved without the bang. The section shape is uniform across all four: ROUTER CONTRACT, OWNED ASSETS, MODE ROUTING, EXECUTION TARGETS, PRESENTATION BOUNDARY, WORKFLOW SUMMARY.

### The pipeline, kept dormant-but-maintained

Nothing was deleted. The four compiled contracts were recompiled from the promoted sources, the four stay `fix` in the rollout, drift is clean, and render `--compare` is byte-consistent. Dropping the bang is what decouples the live runtime injection path; the compile/render/drift machinery remains a maintained safety net.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/commands/deep/research.md` | Modified | Promoted to a full inline `## 1..## 6` router (185 lines); directive folded; bang removed; `allowed-tools` preserved |
| `.opencode/commands/deep/review.md` | Modified | Promoted to a full inline router (151 lines); directive folded; bang removed; `allowed-tools` preserved |
| `.opencode/commands/deep/ai-council.md` | Modified | Promoted to a full inline router (151 lines); directive folded; bang removed; `allowed-tools` preserved |
| `.opencode/commands/deep/alignment.md` | Modified | Promoted to a full inline router (~152 lines); directive folded; bang removed; special-cased (see Deviations) |
| `.opencode/commands/deep/assets/compiled/deep_{research,review,ai-council,alignment}.contract.md` | Regenerated | Recompiled against the promoted sources; drift-clean; still `fix` |
| `.opencode/skills/sk-doc/create-command/SKILL.md` | Modified | Removed the stale research/review/ai-council compiled-stub examples (variant kept documented generically) |
| `.opencode/skills/sk-doc/create-command/assets/command_router_template.md` | Modified | Same example correction |
| `.opencode/skills/sk-doc/create-command/assets/command_template.md` | Modified | Same example correction |

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The base was set up with three clean cherry-picks of packet 064's content commits onto the local branch (`c04c36c13e` alignment parity + ai-council flip, `957fcbb945` skill-benchmark + ai-system-improvement yaml-backed, `60897ff9e2` bless-the-dialect), behind a rollback anchor tag `pre-064-cherrypick` at `0ef70cfbc5`; a full merge was avoided because it collided with the live sk-doc 016/019 renumbering. All three cherry-picks were conflict-free and left the concurrent 017/benchmark dirty files untouched. Then each of the four routers was promoted by lifting its legacy body verbatim and folding in the directive, the four contracts were recompiled, the create-command example docs were corrected, and every gate was run green before writing these docs. The live `:auto` smoke of research/review is intentionally deferred to a pre-merge operator/runtime pass.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| PATH A: promote the legacy body, drop the bang, fold the directive | The compiled contract is injected at runtime and is not the file the operator opens, so only inlining the router makes `command.md` self-describing; the legacy body is already a full `## 1..## 6` router, so lifting it is lower-risk than re-authoring |
| Keep the pipeline dormant-but-maintained (nothing deleted) | The operator wants the compile/render/drift safety net kept; the four stay `fix` so render vitest `mode==='fix'` assertions stay green |
| Fold the `autonomousExecutionDirective` as belt-and-suspenders | Machine-level Gate-3 is driven by the spec-gate hook's `classificationOptions`, not the injected contract, so dropping the bang preserves behaviour; the folded prose makes the intent visible in the router itself |
| Special-case alignment's `## 2` | Its legacy `## 2` was prose describing the render pipeline (referenced `render-command-contract.cjs` + `deep_alignment.contract.md`), which was factually wrong after the bang removal and tripped an `ENUMERATED_SOURCE_GAP` |
| Preserve `allowed-tools` byte-for-byte | The drift checker's `checkToolAllowlist` depends on it; any reformat risks `TOOL_ALLOWLIST_OVERFLOW` |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Test Type | Status | Coverage | Notes |
|-----------|--------|----------|-------|
| Contract drift | Pass | All 4 registered commands | `check-contract-drift.cjs` → `[CONTRACT DRIFT] OK commands=4` |
| Render smoke (`--compare`) | Pass | All 4 in `mode=fix` | COMPARE OK: research 11036B, review 8283B, ai-council 7641B, alignment 8575B |
| Command conformance | Pass | All 8 deep commands | `validate_document.py --type command` → exit 0 each; the 4 promoted now pass full section checks (no marker early-return) |
| Vitest suites | Pass | render-command-contract + check-contract-drift + compile-command-contracts | 3 files / 30 tests PASSED (runtime/vitest.config.ts) |
| resolve-injection-mode | Pass | injection-mode resolver | `resolve-injection-mode.test.cjs` (node --test) → 1/1 PASS |
| create-command package check | Pass | create-command packet | `package_skill.py --check create-command` → PASS (4 warnings, all pre-existing/unrelated) |
| Live `:auto` smoke | Deferred | research + review | Pre-merge operator/runtime step; static evidence strong (see Known Limitations) |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:nfr-verify -->
## NFR Verification

| NFR ID | Target | Actual | Status |
|--------|--------|--------|--------|
| NFR-P01 | Recompile + drift sweep sub-second | Both complete locally in well under a second | Pass |
| NFR-S01 | No tool surface beyond existing `allowed-tools` | Frontmatter preserved byte-for-byte; read-only/native contracts keep their surfaces | Pass |
| NFR-R01 | Deterministic recompile | Same promoted source yields a byte-identical contract body; render `--compare` byte-consistent | Pass |

<!-- /ANCHOR:nfr-verify -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Live `:auto` smoke of research/review is pending.** It is a pre-merge operator/runtime `opencode run` confirmation, not a known risk: machine-level Gate-3 is driven by the spec-gate hook's `classificationOptions`, not the injected contract, and bang-less `agent-improvement` already runs `:auto` with no compiled directive.
2. **Orchestrator finalization is pending.** `graph-metadata.json`, `description.json`, and the 064 parent Phase Documentation Map rollup are produced by the orchestrator's next `generate-context.js` save flow; `spec.md` status stays `Planned` until that reconciliation. Until then, `validate.sh --strict` shows the single expected `GRAPH_METADATA_PRESENT` warning.
3. **Origin-integration recompile is required at merge.** The local drift-clean is against a cherry-pick tree that pairs 064's compiled contracts with the local branch's older `mode-registry.json` / agents / deep-alignment references. On final integration to origin, recompile the four contracts against origin's sources (the standard post-integration toolchain step).
4. **A stale label survives outside this scope.** `skill-benchmark` is still described as "direct-dispatch-script" in `create-command/SKILL.md:317` and `command_template.md:842` (stale since 064 made it yaml-backed). Out of scope for 004; flagged for an sk-doc follow-up.

<!-- /ANCHOR:limitations -->
---

<!-- ANCHOR:deviations -->
## Deviations from Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| Lift every legacy body verbatim | alignment's `## 2` rewritten | Its legacy `## 2` was prose describing the render pipeline that became factually wrong once the bang was removed and tripped an `ENUMERATED_SOURCE_GAP`; replaced with the clean asset table plus "No workflow-asset gap exists" |
| alignment shares the family `## 1..## 6` shape as-is | Added the missing `## 5 PRESENTATION BOUNDARY` and renumbered WORKFLOW SUMMARY to section 6 | The legacy body lacked the presentation-boundary section; adding it aligns alignment with the other three |
| Base 064 content via merge | Base via three clean cherry-picks behind a rollback tag | A full merge collided with the live sk-doc 016/019 renumbering; cherry-picking the three content commits was conflict-free and left concurrent dirty files untouched |

<!-- /ANCHOR:deviations -->
