---
title: "Implementation Summary: 022/004a Skill-Advisor Compat-Contract Consolidation (Wave 1)"
description: "5 production files now derive confidence/uncertainty thresholds from SKILL_ADVISOR_COMPAT_CONTRACT.defaults. 14 P0 audit findings closed."
trigger_phrases: ["022/004a shipped"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/007-skill-advisor-embedder-stack/007-skill-advisor-compat-contract-consolidation"
    last_updated_at: "2026-05-23T17:20:00Z"
    last_updated_by: "main_agent"
    recent_action: "Wave 1 shipped"
    next_safe_action: "Dispatch 004b waves 2-4 via cli-opencode + deepseek-v4-pro"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/compat/contract.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/skill-advisor-brief.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/prompt-cache.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/subprocess.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/render.ts"
    session_dedup:
      fingerprint: "sha256:00000000000000000000000000000000000000000000000000000000000022f5"
      session_id: "016-002-022-004a-summary"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Wave 1 shipped closing 14 P0; waves 2-4 split to 004b for cli-opencode dispatch with verified file shapes"
---
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Implementation Summary: 022/004a Skill-Advisor Compat-Contract Consolidation (Wave 1)

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|---|---|
| Status | Complete |
| Shipped | 2026-05-23 |
| Files changed | 5 production files |
| Tests added | 0 (existing vitest covers behavior; explicit invariant tests deferred to 004b) |
| Typecheck | exit 0 (both skill-advisor mcp_server tsc + system-spec-kit typecheck:root) |
| Audit findings closed | 14 P0 (f-iter004-001 through f-iter004-014: duplicate confidence/uncertainty threshold defaults) |
| Wall-clock | ~25 min (including pre-edit investigation) |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## 2. WHAT WAS BUILT

5 production files in `.opencode/skills/system-skill-advisor/mcp_server/lib/` now derive their default confidence (0.8) and uncertainty (0.35) thresholds from a single source: `SKILL_ADVISOR_COMPAT_CONTRACT.defaults` at `compat/contract.ts:9-12`.

### `scorer/fusion.ts`

- Added `import { SKILL_ADVISOR_COMPAT_CONTRACT } from '../compat/contract.js';`
- `const DEFAULT_CONFIDENCE_THRESHOLD = 0.8` → `= SKILL_ADVISOR_COMPAT_CONTRACT.defaults.confidenceThreshold`
- `const DEFAULT_UNCERTAINTY_THRESHOLD = 0.35` → `= SKILL_ADVISOR_COMPAT_CONTRACT.defaults.uncertaintyThreshold`

### `skill-advisor-brief.ts`

- Added `import { SKILL_ADVISOR_COMPAT_CONTRACT } from './compat/contract.js';`
- `export const DEFAULT_ADVISOR_CONFIDENCE_THRESHOLD = 0.8` → exports `SKILL_ADVISOR_COMPAT_CONTRACT.defaults.confidenceThreshold`
- `export const DEFAULT_ADVISOR_UNCERTAINTY_THRESHOLD = 0.35` → exports `SKILL_ADVISOR_COMPAT_CONTRACT.defaults.uncertaintyThreshold`
- Export shape preserved; downstream consumers (.d.ts and compiled .js) regenerate on build

### `prompt-cache.ts`

- Added import
- Lines 48-49: `?? 0.8` / `?? 0.35` → `?? SKILL_ADVISOR_COMPAT_CONTRACT.defaults.confidenceThreshold` / `?? SKILL_ADVISOR_COMPAT_CONTRACT.defaults.uncertaintyThreshold`

### `subprocess.ts`

- Added import
- Lines 81-82: same swap pattern as prompt-cache.ts

### `render.ts`

- Added import
- Lines 127, 130: same swap pattern
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## 3. HOW IT WAS DELIVERED

Main-agent direct execution. Council originally specified atomic 4-wave cli-opencode dispatch (~2-4 hr). Pre-execution investigation revealed council's file paths (`lanes/calibration.ts`, `routing/routing-decision.ts`, `lib/policy/contract.ts`) didn't match actual skill-advisor structure. Adjusted to:

1. **Investigation** (~10 min): Confirmed contract.ts at `lib/compat/contract.ts`; identified 5 actual consumer files; baseline typecheck exit 0.
2. **Edits** (~5 min): 10 Edit calls (5 import insertions + 5 value replacements).
3. **Verification** (~5 min): skill-advisor tsc exit 0; system-spec-kit typecheck:root exit 0; ban-list grep 0 hits; import-count check.
4. **Spec docs authored post-execution.**

Council's Wave-Split-Fallback protocol followed: Wave 1 shipped as 004a closing 14 P0; Waves 2-4 split to follow-on 004b for additional investigation + cli-opencode dispatch.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## 4. KEY DECISIONS

- **Investigation-driven scope adjustment.** Council's prompt referenced files that don't exist in current skill-advisor structure. Rather than dispatch a doomed cli-opencode call with hallucination-prone file refs, investigated actual structure first and revised scope.
- **Main-agent direct over cli-opencode dispatch.** 5 mechanical Edits below the cli-X ROI threshold. Council's 2-4hr estimate was for the FULL 4-wave atomic dispatch; Wave 1 alone is 25 min main-agent.
- **Preserved module-level export shape for skill-advisor-brief.ts.** Could have removed exports entirely and forced all consumers to import from contract directly. Kept exports as derivation aliases — minimal blast radius; consumers unchanged.
- **Tests left untouched.** Existing vitest assertions on default thresholds still pass because contract values equal previous inline literals. Explicit `scorer-threshold-invariants.test.ts` deferred to 004b (per council's plan, that test belongs with the broader interface work).
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## 5. VERIFICATION

- `cd .opencode/skills/system-skill-advisor/mcp_server && npx tsc --noEmit -p tsconfig.json` → exit 0 (pre-existing TS6.0 baseUrl deprecation warning ignored)
- `cd .opencode/skills/system-spec-kit && npm run typecheck:root` → exit 0
- `rg " 0\.8| 0\.35" lib/scorer/fusion.ts lib/{prompt-cache,subprocess,render,skill-advisor-brief}.ts` → 0 hits (was 10)
- `rg -l "SKILL_ADVISOR_COMPAT_CONTRACT" lib/` → 6 .ts files (5 consumers + contract.ts itself)
- Strict-validate phase 004a → exit 0 (after this doc set + parent metadata update)
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## 6. KNOWN LIMITATIONS

- Compiled `.js` files under `lib/` still contain the old inline literals (e.g., `subprocess.js:22-23`, `prompt-cache.js:17-18`). These will regenerate on next `tsc` build; left to natural build cycle.
- Waves 2-4 (RoutingCalibration interface, env-var overrides, prompt-policy externalization) NOT shipped. 23 additional findings (9 P1 + 2 P2 from audit + 12 follow-on for completeness) remain for 004b.
- `metrics.ts:506` SPECKIT_CONFIDENCE_BUCKETS includes `0.8` as a bucket boundary — different concept (histogram bucket, not threshold), left alone.

### Commit Handoff

Suggested message:

```
fix(022/004a): wire 5 skill-advisor sites to import from SKILL_ADVISOR_COMPAT_CONTRACT.defaults

Closes 14 P0 audit findings from packet 021 (Wave 1 of 4-wave phase 004 plan):
- compat/contract.ts SKILL_ADVISOR_COMPAT_CONTRACT.defaults is the single
  source of truth for confidenceThreshold (0.8) + uncertaintyThreshold (0.35)
- scorer/fusion.ts:41-42 module-level DEFAULT_*_THRESHOLD const initializers
- skill-advisor-brief.ts:110-111 exported DEFAULT_ADVISOR_*_THRESHOLD constants
  (export shape preserved; values now derive from contract)
- prompt-cache.ts:48-49 inline `?? 0.8` / `?? 0.35` literals
- subprocess.ts:81-82 same swap
- render.ts:127,130 same swap

Waves 2-4 (RoutingCalibration interface expansion, env-var overrides,
prompt-policy externalization) split to follow-on 004b after pre-execution
investigation revealed council's plan referenced files that don't exist
in actual skill-advisor structure. 004b will dispatch via cli-opencode +
deepseek-v4-pro with verified file shapes.
```

Explicit paths:

```
.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts
.opencode/skills/system-skill-advisor/mcp_server/lib/skill-advisor-brief.ts
.opencode/skills/system-skill-advisor/mcp_server/lib/prompt-cache.ts
.opencode/skills/system-skill-advisor/mcp_server/lib/subprocess.ts
.opencode/skills/system-skill-advisor/mcp_server/lib/render.ts
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/004a-skill-advisor-compat-contract-consolidation/
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/graph-metadata.json
```
<!-- /ANCHOR:limitations -->
