---
title: "Implementation Summary: D3-R11 relative advisor ranking (transport suppression)"
description: "Post-build record for scoreRelativeAdvisorRanking() + the rankBelowSkillIds gold field + the advisor-probe.cjs --rank-below fail-closed CLI + the advisory-only scorer surfacing: the sk-design-#1-pass / transport-out-ranks-fail acceptance, the enforceable-at-probe-vs-advisory-at-scorer split, the additive no-regression (hubRoute 13/5/0, routeTelemetry intact), and the no-taste-claim honesty across 4 scope-locked files."
trigger_phrases:
  - "relative advisor ranking implementation summary"
  - "scoreRelativeAdvisorRanking build record"
  - "rank-below transport suppression summary"
importance_tier: "normal"
contextType: "general"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/003-d3-routing-utilization/011-relative-advisor-ranking"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Record scoreRelativeAdvisorRanking, the --rank-below CLI, and the advisory scorer surfacing"
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
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 011-relative-advisor-ranking |
| **Completed** | 2026-06-29 |
| **Level** | 2 |
| **Deliverables** | `scoreRelativeAdvisorRanking()` + a `--rank-below` fail-closed CLI in `advisor-probe.cjs`, the optional `rankBelowSkillIds` gold field surfaced through `load-playbook-scenarios.cjs`, and the advisory-only `dims.relativeRanking` surfacing in `score-skill-benchmark.cjs` |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

The deterministic advisor already ranked sk-design #1 with figma / open-design transports at ranks 3 and 5, but nothing guarded that ordering. This phase makes the ordering checkable: you can now assert that a transport never out-ranks the design-judgment skill on a design prompt, and the probe CLI exits non-zero when one does. The check is enforceable at the probe level and advisory at the scorer-report level, which is exactly what keeps the `hubRoute` headline (13 pass / 5 known-gap / 0 regression) and `routeTelemetry` untouched. It makes no claim about whether the design is good.

### The `scoreRelativeAdvisorRanking()` check

A new pure function in `advisor-probe.cjs` takes `{ advisorResult, expectedSkillId, rankBelowSkillIds }` and returns `{ score, pass, targetRank, violatingSkills, checkedSkillIds, ranks, advisory }`. It ranks the advisor's recommendations, finds the target's rank, and names any listed transport that ranks at or above the target. Pass is `targetRank !== null && violatingSkills.length === 0` — the target must appear AND every listed transport must rank strictly below it (or be absent). When the fixture carries no `rankBelowSkillIds`, the function returns `pass: null` with `unscored: 'fixture carries no rankBelowSkillIds'`, so existing fixtures degrade gracefully to unscored rather than failing. The function is added to `module.exports` beside `scoreD1Inter` and `scoreModePrecision`.

### The `rankBelowSkillIds` gold field and the `--rank-below` CLI

`rankBelowSkillIds` is a new optional string array on the benchmark gold `expected` block, surfaced through `load-playbook-scenarios.cjs` so it is not dropped on parse. One sk-design private fixture (`sk-design-mp-tokens-001.private.json`) is seeded with it, naming the transports that must rank below sk-design. The `advisor-probe.cjs` CLI gained a `--rank-below <csv>` flag (paired with `--expected-skill-id`): the probe runs standalone and exits `out.ok && relativeRanking.pass ? 0 : 1`, so it fails closed when a transport out-ranks the target. This is the enforceable path that satisfies the spec acceptance.

### The advisory-only scorer surfacing

`score-skill-benchmark.cjs` computes `dims.relativeRanking` via `scoreRelativeAdvisorRanking()` only when `expected.rankBelowSkillIds` is present, then reduces it into `advisorySignals.relativeRanking` / `runQuality` ONLY — carrying the note "advisor target rank relative to sibling transports; advisory, not weighted". It is never folded into `modeAScore`, `dimensionScores` weighting, `aggregateScore`, the `hubRoute` gate, or any `verdict`. This is the split that keeps the headline and telemetry byte-stable while still surfacing the signal in the report.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/advisor-probe.cjs` | Modified | Added `scoreRelativeAdvisorRanking()` + its `module.exports` entry + the `--rank-below <csv>` fail-closed CLI branch (exits non-zero when a transport out-ranks the target) |
| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs` | Modified | Surfaced the optional `expected.rankBelowSkillIds` field so it flows through the gold loader instead of being dropped on parse |
| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs` | Modified | Computed `dims.relativeRanking` and reduced it into `advisorySignals.relativeRanking` / `runQuality` ONLY (advisory, never weighted or gating) |
| `.opencode/skills/deep-loop-workflows/deep-improvement/assets/skill_benchmark/fixtures/sk-design/sk-design-mp-tokens-001.private.json` | Modified | Seeded `expected.rankBelowSkillIds` naming the figma / open-design transports that must rank below sk-design |

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementer (cli-codex gpt-5.5 xhigh fast) landed the change across the four scope-locked files in one pass, mirroring the existing advisory-signal lane (`scoreModePrecision`) rather than touching the weighted gate. `advisor-probe.cjs` gained the pure scorer, the export, and the `--rank-below` CLI branch; `load-playbook-scenarios.cjs` surfaced the new optional field; `score-skill-benchmark.cjs` gained the `dims.relativeRanking` lane reduced into the advisory / `runQuality` block only; and one private sk-design fixture was seeded with `rankBelowSkillIds`. No other live `.opencode/skills` file was touched: `router-replay.cjs`, `hub-router.json`, and the remaining fixtures stayed untouched.

The orchestrator verified acceptance independently rather than trusting the claim, running `scoreRelativeAdvisorRanking()` against the real advisor result shape `{ ok: true, recommendations: [{ skill, confidence }] }`. sk-design ranked #1 returned `pass: true`, `targetRank: 1`, `violatingSkills: []`. A transport (cli-codex) out-ranking sk-design returned `pass: false`, `targetRank: 2`, `violatingSkills: ["cli-codex"]`. A fixture with no `rankBelowSkillIds` returned unscored / advisory (`pass: null`, graceful). The metric stays advisory in the scorer: `dims.relativeRanking` surfaces as `advisorySignals.relativeRanking` with the note "advisory, not weighted" and is never folded into `modeAScore`, `dimensionScores` weighting, or any `BLOCKED-BY` verdict. No-regression held: `hubRoute` stayed 13 pass / 5 known-gap / 0 regression with 0 regression rows, `node --check` passed on all three `.cjs`, and the evergreen scan over the edits was clean. The phase folder authored docs only.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Split enforcement: gating at the probe, advisory at the scorer | The `--rank-below` CLI fails closed (exit non-zero) so the ordering is genuinely enforceable, but folding the signal into the weighted aggregate would shift `modeAScore` / `verdict` and risk the 13/5/0 headline; keeping the scorer surfacing advisory keeps the headline and `routeTelemetry` byte-stable |
| Make `rankBelowSkillIds` optional and absent-safe | A fixture with no `rankBelowSkillIds` returns `pass: null` / `unscored`, so every existing fixture degrades to unscored instead of failing; the new field is purely additive |
| Mirror the `scoreModePrecision` advisory lane, not the weighted gate | The advisory-signal precedent in the same scorer is proven and low-risk; reusing its shape keeps the new lane consistent and contained |
| Treat the live route corpus as the no-regression baseline, not a new target | The probe CLI is the enforceable surface; `router-replay.cjs` and `hub-router.json` were deliberately left untouched so the route-gold guard stays 13/5/0 — the corpus is the regression anchor, not a gate to re-tune |
| Keep the check a pure function over already-captured advisor output | `scoreRelativeAdvisorRanking()` reads only `advisorResult` + `expectedSkillId` + `rankBelowSkillIds`, so it has no hidden coupling to the weighted gate and is trivially unit-testable |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| ACCEPTANCE — sk-design #1 | PASS, real advisor shape with sk-design ranked #1 → `pass: true`, `targetRank: 1`, `violatingSkills: []` (orchestrator-verified) |
| ACCEPTANCE — transport out-ranks | PASS, a transport (cli-codex) above sk-design → `pass: false`, `targetRank: 2`, `violatingSkills: ["cli-codex"]` (orchestrator-verified) |
| ACCEPTANCE — no `rankBelowSkillIds` | PASS, a fixture without the field → unscored / advisory (`pass: null`, `unscored: 'fixture carries no rankBelowSkillIds'`), graceful |
| ENFORCEABLE — CLI fail-closed | PASS, `advisor-probe.cjs --rank-below` exits `out.ok && relativeRanking.pass ? 0 : 1` (non-zero when a transport out-ranks the target) |
| ADVISORY — scorer surfacing | PASS, `dims.relativeRanking` surfaces in `advisorySignals.relativeRanking` / `runQuality` with the note "advisory, not weighted"; NOT in `modeAScore` / `dimensionScores` / `verdict` |
| NO-REGRESSION — hubRoute headline | PASS, route-gold guard stays 13 pass / 5 known-gap / 0 regression |
| NO-REGRESSION — routeTelemetry | PASS, `routeTelemetry` reducer output unchanged |
| `node --check` on all 3 `.cjs` | PASS, exit 0 on `advisor-probe.cjs`, `load-playbook-scenarios.cjs`, `score-skill-benchmark.cjs` |
| Evergreen [HARD] | PASS, no spec/packet/phase IDs or `specs/` paths in any edited `.cjs` or the fixture |
| Scope clean (only the 4 named files) | PASS, `router-replay.cjs` / `hub-router.json` / other fixtures untouched; this phase folder authored docs only |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The check is enforceable at the probe and advisory at the scorer.** `scoreRelativeAdvisorRanking()` gives a hard pass/fail and the `--rank-below` CLI exits non-zero on an out-ranking, but inside `score-skill-benchmark.cjs` the signal rides `advisorySignals.relativeRanking` / `runQuality` only. A scorer run will never block on a ranking violation; only the standalone probe fails closed. This split is intentional — it is what keeps the 13/5/0 headline and `routeTelemetry` intact.
2. **The check proves ordering, not taste.** A pass means the advisor ranked sk-design above the named transports on the prompt; it makes no claim that the design produced is good. Taste stays advisory throughout.
3. **The gate only fires when `rankBelowSkillIds` is seeded.** A fixture with no `rankBelowSkillIds` is unscored (`pass: null`), so the ordering is checked only where a fixture explicitly names the transports to suppress. Today one sk-design fixture carries the field.

<!-- /ANCHOR:limitations -->

---

<!--
LEVEL 2 IMPLEMENTATION SUMMARY
- Core + Level 2 verification focus
- Build record for scoreRelativeAdvisorRanking() + the --rank-below fail-closed CLI + the rankBelowSkillIds gold field + the advisory-only scorer surfacing
- Enforceable at the probe (pass/fail + CLI exit), advisory at the scorer (advisorySignals/runQuality, never the weighted gate); hubRoute stays 13/5/0; proves ordering, not taste
-->
