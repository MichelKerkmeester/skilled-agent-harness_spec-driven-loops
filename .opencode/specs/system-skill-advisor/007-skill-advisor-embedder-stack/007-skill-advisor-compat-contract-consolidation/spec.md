---
title: "Spec: 022/004a Skill-Advisor Compat-Contract Consolidation (Wave 1)"
description: "Wire 5 production-path inline 0.8/0.35 sites in skill-advisor to import from SKILL_ADVISOR_COMPAT_CONTRACT.defaults. Closes 14 P0 audit findings on duplicate/inline confidenceThreshold + uncertaintyThreshold literals. Waves 2-4 (RoutingCalibration interface, env-var overrides, prompt-policy externalization) split to phase 004b based on Wave-1 structure discovery."
trigger_phrases:
  - "022/004a wave 1 consolidation"
  - "skill-advisor compat contract import"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/007-skill-advisor-embedder-stack/007-skill-advisor-compat-contract-consolidation"
    last_updated_at: "2026-05-23T17:20:00Z"
    last_updated_by: "main_agent"
    recent_action: "Wave 1 shipped"
    next_safe_action: "Phase 004b (waves 2-4 via cli-opencode + deepseek-v4-pro)"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/compat/contract.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/skill-advisor-brief.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/prompt-cache.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/subprocess.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/render.ts"
    session_dedup:
      fingerprint: "sha256:00000000000000000000000000000000000000000000000000000000000022f1"
      session_id: "016-002-022-004a"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Council's wave-1 'lanes/calibration.ts' + 'routing/routing-decision.ts' file paths don't exist in actual skill-advisor; 5 real production sites identified: fusion.ts, skill-advisor-brief.ts, prompt-cache.ts, subprocess.ts, render.ts"
      - "Compat contract path: lib/compat/contract.ts (council referenced lib/policy/contract.ts — minor drift)"
      - "Main-agent direct chosen over cli-opencode dispatch — 5 mechanical Edits below ROI threshold"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Spec: 022/004a Skill-Advisor Compat-Contract Consolidation (Wave 1)

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|---|---|
| Status | Complete |
| Type | Wave 1 of phase 004 (mechanical inline-literal consolidation) |
| Owner | main_agent direct (no cli-opencode dispatch) |
| Parent | `../spec.md` (022-hardcoded-default-remediation-arc) |
| Sibling (planned) | `../004b-skill-advisor-interface-and-env-vars/` (waves 2-4; not yet created) |
| Council recommendation | Originally atomic 4-wave; split based on Wave-1 path-drift discovery |
| Wall-clock | ~15 min |
| Risk class | LOW (compile-checked refactor) |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

`SKILL_ADVISOR_COMPAT_CONTRACT` at `compat/contract.ts:5-12` declares canonical defaults (`confidenceThreshold: 0.8`, `uncertaintyThreshold: 0.35`) but production code never imported it — 5 production-path files had inline `?? 0.8` / `?? 0.35` literals or module-level `DEFAULT_*` constants with the same values. Threshold changes required N-site coordinated edits, with no compile-time guard against drift.

Closes 14 P0 audit findings from packet 021 on duplicate confidence/uncertainty threshold defaults across skill-advisor.

Purpose: make `SKILL_ADVISOR_COMPAT_CONTRACT.defaults` the single source of truth for both thresholds in production code. Future threshold tuning requires only a contract edit.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

5 file edits in `.opencode/skills/system-skill-advisor/mcp_server/lib/`:

| File | Edit |
|---|---|
| `scorer/fusion.ts:41-42` | `const DEFAULT_*_THRESHOLD = 0.8/0.35` → `= SKILL_ADVISOR_COMPAT_CONTRACT.defaults.confidenceThreshold/uncertaintyThreshold` |
| `skill-advisor-brief.ts:110-111` | `export const DEFAULT_ADVISOR_*_THRESHOLD = 0.8/0.35` → derive from contract (preserves export shape) |
| `prompt-cache.ts:48-49` | inline `?? 0.8 / ?? 0.35` → `?? SKILL_ADVISOR_COMPAT_CONTRACT.defaults.*` |
| `subprocess.ts:81-82` | same pattern |
| `render.ts:127,130` | same pattern |

Plus 5 new `import { SKILL_ADVISOR_COMPAT_CONTRACT } from './compat/contract.js'` (relative paths adjusted per file location).

### Out of Scope (split to 004b)

- Wave 2: `RoutingCalibration` interface expansion (3 missing bonus/penalty pairs: memory:save, create:agent, testing-playbook)
- Wave 3: env-var overrides (`SPECKIT_ADVISOR_CALIBRATION_OVERRIDE_JSON`, `SPECKIT_ADVISOR_CONFIDENCE_THRESHOLD`, `SPECKIT_ADVISOR_UNCERTAINTY_THRESHOLD`, `SPECKIT_ADVISOR_LANE_WEIGHTS_JSON`)
- Wave 4: `prompt-policy.ts` externalization to JSON config + 5 fire/no-fire env vars

### Why Split

Council's atomic 4-wave plan referenced file paths that don't exist in actual skill-advisor structure (`lanes/calibration.ts`, `routing/routing-decision.ts`, `lib/policy/contract.ts`). Pre-execution investigation revealed actual paths: `lib/compat/contract.ts`, no `lanes/calibration.ts`, etc. Splitting Wave 1 as 004a allows clean atomic ship of the 14 P0 closure with verified file references; waves 2-4 require additional investigation for the actual RoutingCalibration shape and prompt-policy structure before dispatch.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Verification |
|---|---|---|
| R1 | All 5 production-path inline `?? 0.8` / `?? 0.35` sites import from contract | `rg "?? 0\.8|?? 0\.35" lib/scorer/fusion.ts lib/{prompt-cache,subprocess,render,skill-advisor-brief}.ts` → 0 hits |
| R2 | Each consumer file imports `SKILL_ADVISOR_COMPAT_CONTRACT` from the correct relative path | `rg -l "SKILL_ADVISOR_COMPAT_CONTRACT" lib/` → 6 files (5 consumers + contract.ts itself) |
| R3 | system-spec-kit typecheck:root exits 0 | `npm run typecheck:root` |
| R4 | skill-advisor mcp_server tsc exits 0 | `npx tsc --noEmit -p tsconfig.json` |
| R5 | Strict-validate this phase → exit 0 | `bash validate.sh 004a-skill-advisor-compat-contract-consolidation --strict` |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- R1–R5 all pass
- 14 P0 audit findings closed (duplicate threshold defaults)
- Compat contract becomes the only place where 0.8/0.35 values appear in production code
- Parent arc graph-metadata.json `children_ids` updated with 004a entry
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:approach -->
## 6. APPROACH

Main-agent direct Edit. 10 Edit calls (5 import insertions + 5 value replacements). Below cli-X dispatch ROI for mechanical compile-checked refactor.

Edit order:
1. Add import statement to each of 5 files (after existing imports)
2. Replace each inline `?? 0.8` / `?? 0.35` literal with `?? SKILL_ADVISOR_COMPAT_CONTRACT.defaults.confidenceThreshold/uncertaintyThreshold`
3. For module-level `DEFAULT_*` constants (fusion.ts:41-42, skill-advisor-brief.ts:110-111): change initializer to read from contract (preserves export shape; downstream consumers unchanged).

Verification:
- system-spec-kit typecheck:root → exit 0
- skill-advisor mcp_server tsc → exit 0
- ban-list grep → 0 hits in production paths
- import count = 5 consumers + 1 declaration
<!-- /ANCHOR:approach -->

<!-- ANCHOR:risks -->
## 7. RISKS & DEPENDENCIES

| Risk | Mitigation |
|---|---|
| Downstream consumer of `DEFAULT_ADVISOR_*_THRESHOLD` exports breaks due to type change | Constants kept as `0.8`/`0.35` literal value (derived from contract); type stays `number`; export shape unchanged |
| Circular import: contract.ts imports from skill-advisor-brief, brief imports from contract | Verified: contract.ts is leaf (no imports); brief imports from contract one-way |
| compat/contract.ts path differs from council's expectation (`policy/contract.ts`) | Investigation confirmed actual path; spec.md documents the divergence |
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 8. OPEN QUESTIONS

- None for Wave 1. Wave 2-4 questions deferred to 004b spec.
<!-- /ANCHOR:questions -->

<!-- ANCHOR:cross-links -->
## 9. CROSS-LINKS

- Parent arc: `../spec.md`
- Council brief: `../ai-council/executor-instructions.md` §Phase 004 (referenced 4-wave atomic dispatch; this phase implements only Wave 1)
- Predecessor: phase 002b (last shipped)
- Successor (planned): `../004b-skill-advisor-interface-and-env-vars/` (waves 2-4)
- Audit findings: f-iter004-001 through f-iter004-014 (14 P0 closed)
- Contract source: `compat/contract.ts:5-12`
<!-- /ANCHOR:cross-links -->

<!-- ANCHOR:nfr -->
## 10. NON-FUNCTIONAL REQUIREMENTS

- Behavior preserved: contract values are 0.8/0.35 (same as previous inline literals)
- No runtime overhead: SKILL_ADVISOR_COMPAT_CONTRACT is a `const` object, accessed once per call
- No new dependencies; no new env vars (those land in 004b Wave 3)
<!-- /ANCHOR:nfr -->

<!-- ANCHOR:edge-cases -->
## 11. EDGE CASES

- `metrics.ts:506` SPECKIT_CONFIDENCE_BUCKETS contains `0.8` as one of 6 bucket boundaries — NOT this threshold; left alone.
- `trust-lanes.ts:46,48,49` use `0.35` as `maxContribution` for trust-lane decay caps — different concept; left alone.
- `scoring-constants.ts:169,177,179,183` use `0.8`/`0.35` in calibration constants for distinct scorer behavior — different concept; left alone.
- Compiled `.js` files under `lib/` mirror the .ts changes — TypeScript compiler regenerates them on next build.
<!-- /ANCHOR:edge-cases -->

<!-- ANCHOR:complexity -->
## 12. COMPLEXITY

LEVEL 2 mechanical refactor. 5 files modified, 10 Edit operations, ~20 lines changed. Compile-checked (typecheck exit 0 confirms shape preservation).
<!-- /ANCHOR:complexity -->
