---
title: "Implementation Plan: Registry static-audit gate (scanHubRegistry)"
description: "Additive scanHubRegistry() beside scanConnectivity in d5-connectivity.cjs that statically audits a hub registry (missingModes, deadPackets, packetNameMismatches, aliasCollisions, uncoveredIntentRate) and emits BLOCKED-BY-REGISTRY on a hard structural defect."
trigger_phrases:
  - "scanhubregistry d5 connectivity"
  - "registry static audit gate"
  - "blocked-by-registry hub scan"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/003-d3-routing-utilization/007-registry-static-audit"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Confirm the plan against the delivered scanHubRegistry gate and mark phases done"
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
# Implementation Plan: Registry static-audit gate (scanHubRegistry)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js, CommonJS (`.cjs`) |
| **Target module** | `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/d5-connectivity.cjs` |
| **Registry audited** | `sk-design/mode-registry.json` (5 modes + aliases) + `sk-design/hub-router.json` (`routerSignals` + `vocabularyClasses`) + `sk-design/design-*/` packet folders |
| **Testing** | Vitest (`scripts/skill-benchmark/tests/skill-benchmark.vitest.ts`), `node --check` |

### Overview
Add a new pure function `scanHubRegistry({ skillRoot })` next to the existing `scanConnectivity()` in `d5-connectivity.cjs`. It statically audits a skill's hub registry and reports five facets — `missingModes`, `deadPackets`, `packetNameMismatches`, `aliasCollisions`, and `uncoveredIntentRate` — mirroring `scanConnectivity`'s return shape (`score`, `gateFailed`, `findings[]`, named defect arrays) so a downstream consumer integrates it the same way. A hard structural defect (a registry mode with no packet/router projection, a packet folder nothing references, or an alias owned by two modes) sets `gateFailed:true` and carries the literal `verdict:'BLOCKED-BY-REGISTRY'` label. The change is strictly additive: `scanConnectivity` is untouched, and the new scan is a benign no-op for any skill without a registry, so the existing suite for other skills is unaffected.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] `scanConnectivity` return shape, gate rule (P0 → `gateFailed`), and score model understood and mirrored
- [x] `mode-registry.json` / `hub-router.json` / `design-*/` structures confirmed as the audit inputs
- [x] Hard-violation set fixed to: missing mode, dead packet, alias collision (plus unparseable registry)
- [x] `uncoveredIntentRate` derivation defined; threshold-gate kept OFF by default

### Definition of Done
- [x] `scanHubRegistry({ skillRoot })` added beside `scanConnectivity` and exported
- [x] On the live sk-design registry: `missingModes`, `deadPackets`, `aliasCollisions`, `packetNameMismatches` all empty; `uncoveredIntentRate` reported (`0.39`); `gateFailed:false`
- [x] A seeded broken registry (unparseable registry OR alias collision) → `gateFailed:true`, `verdict:'BLOCKED-BY-REGISTRY'`
- [x] `scanConnectivity` behavior unchanged for registry-less skills (no-regression, function + diff level)
- [x] `node --check d5-connectivity.cjs` passes; full Vitest suite NOT runnable offline (function + diff no-regression instead)
- [x] No spec/packet/phase IDs or spec paths embedded in code or comments (evergreen)

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Additive pure-function scan mirroring `scanConnectivity`. `scanHubRegistry` reads the registry off disk, computes defect arrays, derives a score and a hard-gate verdict, and returns a plain object. No shared mutable state with `scanConnectivity`; no change to its signature, body, or exports beyond adding the new function to `module.exports`.

### Key Components
- **`scanHubRegistry({ skillRoot })`** — the new scan. Reads `mode-registry.json` + `hub-router.json` + packet folders relative to `skillRoot`.
- **Registry-presence guard** — when `mode-registry.json` is absent at `skillRoot`, return a benign pass (`registryPresent:false`, `gateFailed:false`, `score:100`, empty arrays, `uncoveredIntentRate:null`). This is what keeps the scan a no-op for non-registry skills and guarantees no-regression.
- **Finding + score model** — reuse `scanConnectivity`'s severity/penalty scheme (`P0:40, P1:12, P2:3`, score floored at 0) so a score-comparison consumer reads consistent numbers.
- **CLI hook (additive)** — in the `require.main === module` block, keep the `scanConnectivity` run/print/exit exactly as today, then, only when `registryPresent`, append the registry result and fold its gate into the exit code.

### Return shape (mirrors `scanConnectivity`)
```
{
  registryPresent: boolean,        // false → benign no-op pass
  score: number,                   // 100 - penalties, floored at 0
  gateFailed: boolean,             // hard violation present
  verdict: string|null,            // 'BLOCKED-BY-REGISTRY' when gateFailed, else null
  findings: Array<{class,severity,locus,detail}>,
  missingModes: Array,             // P0 (hard gate)
  deadPackets: Array,              // P0 (hard gate)
  aliasCollisions: Array,          // P0 (hard gate)
  packetNameMismatches: Array,     // P1 (reported, non-gating)
  uncoveredIntentRate: number|null,// metric (reported, threshold OFF by default)
  uncoveredKeywords: string[]      // the raw keywords not typed in hub-router.json
}
```

### Data Flow (the five checks)
1. **missingModes** [P0 → gate] — for each `modes[].workflowMode`, require BOTH (a) a packet folder `<skillRoot>/<mode.packet>/` that exists and contains `SKILL.md`, AND (b) a router projection `hub-router.json.routerSignals[mode.workflowMode]`. A mode missing either facet is recorded (with which facet is missing).
2. **deadPackets** [P0 → gate] — enumerate packet folders on disk (the registry's declared `packet` set plus any sibling `design-*/` directory found on disk). Any on-disk packet folder not referenced by a registry mode's `.packet` is dead.
3. **aliasCollisions** [P0 → gate] — build `alias(lowercased) → Set<workflowMode>` across all `modes[].aliases[]`; any alias mapped to two or more distinct modes is a collision.
4. **packetNameMismatches** [P1 → reported, NOT a gate trigger] — for each mode, read its packet `SKILL.md` frontmatter `name:` and compare to `mode.packetSkillName`; record mismatches. (The brief fixes the hard-violation set to missing/dead/alias only, so a mismatch lowers the score and surfaces a finding but does not by itself emit BLOCKED-BY-REGISTRY.)
5. **uncoveredIntentRate** [metric → reported] — raw hub keywords = the deduped, lowercased set of registry alias phrases; typed set = the union of all `hub-router.json.vocabularyClasses[*].keywords` (lowercased). `uncoveredIntentRate = |raw \ typed| / |raw|`, with `uncoveredKeywords` listing the misses. Reported only; an optional threshold gate is documented but OFF by default, so the clean ~0.465 baseline does not block.

### Gate rule + emission
`gateFailed = missingModes.length > 0 || deadPackets.length > 0 || aliasCollisions.length > 0`. When `gateFailed`, set `verdict = 'BLOCKED-BY-REGISTRY'`; that label IS the emission the contract requires, carried in the scan's own return (and surfaced via the additive CLI exit). Wiring a `BLOCKED-BY-REGISTRY` tier into the `score-skill-benchmark.cjs` `aggregate()` verdict ladder is explicitly OUT OF SCOPE for this phase (see Dependencies / Rollback).

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Scaffold
- [x] Add `scanHubRegistry({ skillRoot })` skeleton beside `scanConnectivity`; add it to `module.exports`
- [x] Implement the registry-presence guard (benign pass when no `mode-registry.json`)
- [x] Read + JSON-parse `mode-registry.json` and `hub-router.json`; fail-soft (treat unparseable registry as a P0 finding rather than a throw, matching the module's defensive style)

### Phase 2: Core Checks + Emit
- [x] Compute `missingModes` (packet folder + router projection per mode)
- [x] Compute `deadPackets` (on-disk packet folders not referenced by the registry)
- [x] Compute `aliasCollisions` (alias owned by ≥2 modes)
- [x] Compute `packetNameMismatches` (registry `packetSkillName` vs packet `SKILL.md` `name`)
- [x] Compute `uncoveredIntentRate` + `uncoveredKeywords` (raw aliases not typed in `vocabularyClasses`)
- [x] Build `findings[]` with consistent severities; derive `score`, `gateFailed`, and `verdict:'BLOCKED-BY-REGISTRY'`
- [x] Extend the CLI block additively (registry section + folded exit code) only when `registryPresent`

### Phase 3: Verification
- [x] `node --check d5-connectivity.cjs` (exit 0)
- [x] Run `scanHubRegistry` against the live sk-design root; confirmed the real clean state (empty defect arrays, `uncoveredIntentRate` `0.39`)
- [x] Seed a synthetic broken registry (unparseable registry / alias collision) → asserted `gateFailed` + `verdict:'BLOCKED-BY-REGISTRY'`
- [x] Skill-benchmark Vitest suite NOT runnable offline; no-regression verified at the function level (`scanConnectivity` unchanged + runs) + the additive-diff level

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Syntax | `d5-connectivity.cjs` parses | `node --check` |
| Unit (real state) | `scanHubRegistry` on the live sk-design registry: 0 alias collisions, 5/5 packet parity, measured untyped-keyword rate, `gateFailed:false` | Vitest (`require` the module directly) |
| Unit (synthetic gate) | Seeded broken registry in an OS temp dir → `gateFailed:true`, `verdict:'BLOCKED-BY-REGISTRY'` for each hard class | Vitest + `mkdtempSync` (mirrors the existing `makeRouterlessSkill()` pattern) |
| Non-regression | Registry-less skill → `registryPresent:false`, no gate; `scanConnectivity` output for cli-codex / sk-code unchanged; full suite green | `npx vitest run skill-benchmark/tests` (from `scripts/`) |

Tests land additively in the existing `skill-benchmark.vitest.ts` (the established home for `d5-connectivity.cjs` coverage); existing `describe`/`it` blocks are not modified. Temp fixtures are cleaned in `afterAll`, per the suite's read-only-against-repo policy.

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `mode-registry.json` (sk-design) | Internal | Green | Primary audit input; absent → benign no-op |
| `hub-router.json` (sk-design) | Internal | Green | Supplies `routerSignals` + `vocabularyClasses` for projection + uncovered-rate checks |
| `design-*/` packet folders | Internal | Green | Disk truth for missingModes / deadPackets / packetNameMismatches |
| `scanConnectivity` (same file) | Internal | Green | Shape/severity/score model mirrored; must remain untouched |
| `score-skill-benchmark.cjs aggregate()` verdict wiring | Internal | Out of scope | A `BLOCKED-BY-REGISTRY` verdict tier in the suite ladder is a follow-on, not this phase |
| Vitest | External | Green | Verification runner; resolves from the repo-root install |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: `scanHubRegistry` changes `scanConnectivity` numbers for an existing skill, flakes on the live registry, or the suite regresses.
- **Procedure**: Revert the additive function, its export entry, and the CLI hook in `d5-connectivity.cjs`; remove the additive test blocks. Because the change is purely additive and guarded by `registryPresent`, removal restores byte-identical prior behavior.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Scaffold + guard) ──> Phase 2 (Checks + emit) ──> Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Scaffold | None | Checks |
| Checks + emit | Scaffold | Verify |
| Verify | Checks + emit | None |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Scaffold + presence guard | Low | 30-45 minutes |
| Five checks + emit + CLI hook | Medium | 2-3 hours |
| Verification (real + synthetic + no-regression) | Medium | 1-1.5 hours |
| **Total** | | **3.5-5 hours** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Baseline captured: `scanConnectivity` is logic-unchanged (only the same-value penalty refactor + the export line touch its neighborhood)
- [x] Live sk-design `scanHubRegistry` measured rate recorded: `uncoveredIntentRate` `0.39` (for drift comparison)
- [x] Full Vitest suite NOT runnable offline; no-regression verified at the function + diff level instead

### Rollback Procedure
1. **Immediate**: Remove the registry section from the CLI block (restore the prior `process.exit(res.gateFailed ? 1 : 0)`)
2. **Revert code**: Drop `scanHubRegistry` and its `module.exports` entry
3. **Tests**: Remove the additive registry `describe`/`it` blocks
4. **Verify**: `node --check d5-connectivity.cjs` + re-run the suite; confirm the recorded baselines match

### Data Reversal
- **Has data migrations?** No (pure static scan; no persisted state)
- **Reversal procedure**: N/A — code-only, additive revert

<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN
- Additive scanHubRegistry beside scanConnectivity in d5-connectivity.cjs
- Hard-gate set: missingModes / deadPackets / aliasCollisions → BLOCKED-BY-REGISTRY
- No-regression via registryPresent guard; scanConnectivity untouched
-->
