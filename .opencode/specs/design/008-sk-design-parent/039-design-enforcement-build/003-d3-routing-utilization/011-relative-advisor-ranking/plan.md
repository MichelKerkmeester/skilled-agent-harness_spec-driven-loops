---
title: "Implementation Plan: D3-R11 — Relative advisor ranking (transport suppression)"
description: "planning. Add rankBelowSkillIds to the benchmark gold schema and scoreRelativeAdvisorRanking() in advisor-probe.cjs; gate sk-design #1 with figma/open-design ranked below."
trigger_phrases:
  - "d3-r11 relative advisor ranking plan"
  - "transport suppression design build plan"
  - "scoreRelativeAdvisorRanking implementation plan"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/003-d3-routing-utilization/011-relative-advisor-ranking"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Mark every plan phase and gate done with one-line delivery evidence"
    next_safe_action: "Let the parent process refresh description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/advisor-probe.cjs"
      - ".opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs"
      - ".opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs"
      - ".opencode/skills/deep-loop-workflows/deep-improvement/assets/skill_benchmark/fixtures/sk-design/sk-design-mp-tokens-001.private.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: D3-R11 — Relative advisor ranking (transport suppression)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS (`.cjs`) — Lane C skill-benchmark machinery |
| **Framework** | Vitest (synthetic + non-regression suites); `node --check` for parse gate |
| **Storage** | JSON private gold fixtures (`assets/skill_benchmark/fixtures/sk-design/`) |
| **Testing** | Vitest in `scripts/skill-benchmark/tests/`; deterministic Python advisor (SQLite, no LLM) via `advisor-probe.cjs` |

### Overview
The deterministic skill-advisor already returns sk-design at rank #1 with figma / open-design transports at ranks 3 and 5, but nothing in the benchmark machinery guards that ordering. This build adds a relative-ranking check so a transport can never out-rank the design-judgment skill on a design prompt. Two real edits carry the deliverable: (1) a new `rankBelowSkillIds` field on the benchmark gold `expected` schema, and (2) a new `scoreRelativeAdvisorRanking()` function in `advisor-probe.cjs` that consumes the advisor's ranked recommendations and the new field. The check is enforceable at the probe level (the CLI fails closed on a seeded out-ranking, per spec acceptance); when surfaced in the scorer report it rides the advisory / `runQuality` block only, so the weighted aggregate, the `hubRoute` gate (13 pass / 5 known-gap / 0 regression), and `routeTelemetry` are all unchanged.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Spec deliverable + target frozen (`spec.md` §3: `advisor-probe.cjs` + playbook schema)
- [x] Exact attach points located (`advisor-probe.cjs:150` scoreD1Inter sibling; private-fixture `expected` block)
- [x] No-regression contract captured (hubRoute 13/5/0; routeTelemetry intact; advisory-block-only integration)
- [x] Evergreen constraint noted (no spec IDs / paths in shipped code)

### Definition of Done
- [x] `rankBelowSkillIds` parses/flows through the gold `expected` schema — surfaced in `load-playbook-scenarios.cjs` + `score-skill-benchmark.cjs`
- [x] `scoreRelativeAdvisorRanking()` implemented + exported in `advisor-probe.cjs` — `advisor-probe.cjs:165` + `module.exports:253`
- [x] Synthetic case demonstrates pass (sk-design #1, transports below) and fail (transport out-ranks) — orchestrator: pass#1 / fail with `violatingSkills:["cli-codex"]`
- [x] No-regression: route-gold guard stays 13/5/0; full vitest suite green — `hubRoute` 13 pass / 5 known-gap / 0 regression
- [x] `node --check` passes on every edited `.cjs` — exit 0 on all 3 `.cjs`

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Additive sibling-function lane — mirror the existing advisory signals (`scoreModePrecision`) rather than touching the weighted gate. The new check is a pure function over already-captured advisor output, with an optional CLI fail-closed path.

### Key Components
- **`scoreRelativeAdvisorRanking()`** (new, in `advisor-probe.cjs`): pure scorer; given the advisor probe result, the target skill id, and `rankBelowSkillIds`, returns `{ pass, targetRank, violatingSkills, advisory }`. Pass iff the target is present AND every listed transport ranks strictly below the target (or is absent).
- **`rankBelowSkillIds`** (new gold field): optional array on the `expected` block of the private benchmark fixtures. Names the transports that must rank below the target.
- **Gold loader path** (`load-playbook-scenarios.cjs`): surface `rankBelowSkillIds` alongside the existing `expected.*` fields for playbook-shaped gold so the field is not dropped on parse.
- **Advisory surfacing** (optional, `score-skill-benchmark.cjs`): a `dims.relativeRanking` lane reduced into `advisorySignals.relativeRanking` / `runQuality` only — never into `modeAScore` / `aggregateScore` / `hubRouteGate` / `verdict`.
- **`advisor-probe.cjs` CLI**: extend the `require.main` block with a `--rank-below` flag so the probe can be run standalone and exit non-zero when a transport out-ranks the target (satisfies the spec's enforceable acceptance).

### Data Flow
1. A design prompt is routed through the deterministic Python advisor (`probeAdvisor`), returning ranked `{ skill, confidence }` recommendations.
2. The fixture / gold `expected` block carries `skillId` (target) and the new `rankBelowSkillIds` (transports).
3. `scoreRelativeAdvisorRanking()` computes the target's rank and each transport's rank from the recommendations.
4. Pass iff the target appears and every transport ranks strictly below it (or is absent); otherwise fail with the violating transports named.
5. In CLI mode the probe exits non-zero on failure (enforceable). In the scorer it surfaces in the advisory block only (additive, non-gating).

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Schema
- [x] Add optional `rankBelowSkillIds` (string array) to the benchmark gold `expected` block schema — optional, absent-safe
- [x] Surface `rankBelowSkillIds` through the gold loader so it is not dropped on parse — `load-playbook-scenarios.cjs:114/229/285/303`
- [x] Seed one positive sk-design fixture (`expected.rankBelowSkillIds` naming the transports) — `sk-design-mp-tokens-001.private.json`

### Phase 2: Core Implementation
- [x] Implement `scoreRelativeAdvisorRanking({ advisorResult, expectedSkillId, rankBelowSkillIds })` as a sibling to `scoreD1Inter` — `advisor-probe.cjs:165`
- [x] Add it to `module.exports` — `advisor-probe.cjs:253`
- [x] Extend the `advisor-probe.cjs` CLI with a `--rank-below` flag that exits non-zero on a transport out-ranking the target — exits `out.ok && relativeRanking.pass ? 0 : 1`
- [x] Surface `dims.relativeRanking` into `advisorySignals.relativeRanking` / `runQuality` in `score-skill-benchmark.cjs` — never the weighted aggregate or `hubRoute` gate — `score-skill-benchmark.cjs:677/879/893`, note "advisory, not weighted"

### Phase 3: Verification
- [x] Synthetic vitest cases: sk-design #1 + transports below = pass; transport out-ranks = fail; target absent = fail; transport absent = pass — orchestrator-verified against the real advisor shape
- [x] Confirm route-gold guard still asserts 13 pass / 5 known-gap / 0 regression — `hubRoute` 13/5/0, 0 regression
- [x] Confirm `routeTelemetry` reducer output is unchanged — telemetry intact
- [x] `node --check` on every edited `.cjs`; run the full skill-benchmark vitest suite — `node --check` exit 0 on all 3 `.cjs`; suite green

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit (synthetic) | `scoreRelativeAdvisorRanking()` pass/fail/edge branches over seeded recommendation arrays | Vitest |
| Non-regression | `hubRoute` headline stays 13/5/0; `routeTelemetry` intact; weighted aggregate/verdict unchanged | Vitest (`design-token-lint.vitest.ts`, `skill-benchmark.vitest.ts`) |
| Parse gate | Every edited `.cjs` parses | `node --check` |
| CLI fail-closed | `advisor-probe.cjs --rank-below` exits non-zero on a seeded out-ranking | `node` CLI invocation |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `advisor-probe.cjs` (`probeAdvisor`, `scoreD1Inter`) | Internal | Green | Primary edit target; no work possible without it |
| Private gold fixtures (`assets/skill_benchmark/fixtures/sk-design/`) | Internal | Green | Cannot seed positive/negative gold |
| `score-skill-benchmark.cjs` advisory block | Internal | Green | Optional surfacing only; primary deliverable unaffected |
| Deterministic Python advisor (`skill_advisor.py`, SQLite) | Internal | Green | CLI fail-closed demo needs it; synthetic unit cases do not |
| Vitest suite (`tests/`) | Internal | Green | Cannot prove no-regression |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: `hubRoute` headline drifts off 13/5/0, `routeTelemetry` changes, the weighted aggregate/verdict shifts, or the vitest suite regresses
- **Procedure**: Revert the `advisor-probe.cjs` function + export + CLI flag, the `expected`-schema/loader change, the seeded fixtures, and any `score-skill-benchmark.cjs` advisory-block hunk. The change is purely additive, so revert restores the prior contract exactly.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Schema) ──> Phase 2 (Core) ──> Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Schema | None | Core, Verify |
| Core | Schema | Verify |
| Verify | Core | None |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Schema (`rankBelowSkillIds` field + loader + fixture) | Low | 45 minutes |
| Core (`scoreRelativeAdvisorRanking()` + export + CLI + optional advisory surface) | Medium | 1.5-2 hours |
| Verification (synthetic + no-regression + node --check) | Low-Medium | 1-1.5 hours |
| **Total** | | **3.25-4.25 hours** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Baseline captured: route-gold guard green at 13/5/0 BEFORE edits — baseline confirmed before the change
- [x] Baseline captured: full vitest suite green BEFORE edits — baseline confirmed before the change
- [x] Feature scope confirmed additive (no edits to weighted-gate math) — `modeAScore` / `dimensionScores` / `verdict` untouched

### Rollback Procedure
1. **Immediate**: Remove the optional `score-skill-benchmark.cjs` advisory-block hunk (restores report shape)
2. **Revert code**: Revert `advisor-probe.cjs` (function + export + CLI flag)
3. **Revert schema/gold**: Revert the `expected`-schema/loader change and the seeded fixtures
4. **Verify**: Re-run the route-gold guard and full vitest suite; confirm 13/5/0 and green
5. **Notify**: Note the revert in the phase `implementation-summary.md`

### Data Reversal
- **Has data migrations?** No (additive optional field + additive function; no stored state)
- **Reversal procedure**: Plain code/fixture revert; no migration to undo

<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN (~140 lines)
- Core + Level 2 addendum
- Phase dependencies and effort estimation
- Enhanced rollback procedure
-->
