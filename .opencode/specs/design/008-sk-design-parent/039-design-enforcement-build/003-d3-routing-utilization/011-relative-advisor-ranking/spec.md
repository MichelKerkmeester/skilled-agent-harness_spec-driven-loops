---
title: "D3-R11 — Relative advisor ranking (transport suppression)"
description: "Add rankBelowSkillIds to the benchmark gold expected schema and scoreRelativeAdvisorRanking() + a --rank-below fail-closed CLI to advisor-probe.cjs that gates sk-design at rank #1 with figma/open-design transports ranked below; the scorer surfaces the signal advisory-only so hubRoute stays 13/5/0 and routeTelemetry is intact. Proves ordering, not taste."
trigger_phrases:
  - "d3-r11 relative advisor ranking"
  - "transport suppression design build"
  - "scoreRelativeAdvisorRanking rank-below"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/003-d3-routing-utilization/011-relative-advisor-ranking"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Upgrade the spec to the Level 2 contract and mark the relative-ranking build complete"
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
# D3-R11 — Relative advisor ranking (transport suppression)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Enforcement class** | hybrid (enforceable at the probe, advisory at the scorer) |
| **Dimension** | D3 — Routing & Utilization |
| **Completed** | 2026-06-29 |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The deterministic advisor already returns sk-design at rank #1 with figma / open-design transports at ranks 3 and 5, but nothing in the benchmark machinery guards that ordering. A transport could drift above the design-judgment skill on a design prompt and no check would notice. There is no relative-ranking signal at all.

### Purpose
Make the ordering checkable. Add an optional `rankBelowSkillIds` field to the benchmark gold `expected` block and a `scoreRelativeAdvisorRanking()` check in `advisor-probe.cjs` that consumes the advisor's ranked recommendations plus that field. The check is enforceable at the probe level — a new `--rank-below` CLI flag fails closed (exit non-zero) when a listed transport ranks at or above the target. When surfaced in `score-skill-benchmark.cjs` it rides the advisory / `runQuality` block ONLY, so the weighted aggregate, the `hubRoute` gate (13 pass / 5 known-gap / 0 regression), and `routeTelemetry` are all byte-stable. The check proves ordering; it makes no claim about whether the design is good.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `scoreRelativeAdvisorRanking({ advisorResult, expectedSkillId, rankBelowSkillIds })` in `advisor-probe.cjs`, returning `{ score, pass, targetRank, violatingSkills, checkedSkillIds, ranks, advisory }`, added to `module.exports`
- A `--rank-below <csv>` flag (paired with `--expected-skill-id`) on the `advisor-probe.cjs` CLI that exits non-zero when a transport out-ranks the target
- An optional `rankBelowSkillIds` (string array) on the benchmark gold `expected` block, surfaced through `load-playbook-scenarios.cjs` so it is not dropped on parse
- One seeded sk-design private fixture (`sk-design-mp-tokens-001.private.json`) whose `expected.rankBelowSkillIds` names the transports
- An advisory-only `dims.relativeRanking` lane in `score-skill-benchmark.cjs`, reduced into `advisorySignals.relativeRanking` / `runQuality`

### Out of Scope
- Any edit to `router-replay.cjs` or `hub-router.json` — the live route corpus is the no-regression baseline, not a target to re-tune
- Folding the signal into `modeAScore`, `dimensionScores` weighting, `aggregateScore`, the `hubRoute` gate, or any `verdict`
- Editing fixtures other than the one seeded sk-design fixture
- Certifying design quality (the check proves ordering, taste stays advisory — see RISKS and OPEN QUESTIONS)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/advisor-probe.cjs` | Modify | Add `scoreRelativeAdvisorRanking()` + export + the `--rank-below` fail-closed CLI |
| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs` | Modify | Surface the optional `expected.rankBelowSkillIds` field through the gold loader |
| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs` | Modify | Compute `dims.relativeRanking` and reduce it into `advisorySignals.relativeRanking` / `runQuality` only |
| `.opencode/skills/deep-loop-workflows/deep-improvement/assets/skill_benchmark/fixtures/sk-design/sk-design-mp-tokens-001.private.json` | Modify | Seed `expected.rankBelowSkillIds` naming the transports below sk-design |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `scoreRelativeAdvisorRanking()` implemented + exported | Pure function over `{ advisorResult, expectedSkillId, rankBelowSkillIds }` returning `{ score, pass, targetRank, violatingSkills, checkedSkillIds, ranks, advisory }`; present in `module.exports` |
| REQ-002 | A target-#1 ordering passes | sk-design ranked #1 with the listed transports below → `pass: true`, `targetRank: 1`, `violatingSkills: []` |
| REQ-003 | A transport out-ranking the target fails | A transport at or above sk-design → `pass: false`, the transport named in `violatingSkills` |
| REQ-004 | The CLI fails closed | `advisor-probe.cjs --rank-below <csv> --expected-skill-id <id>` exits non-zero when a transport out-ranks the target |
| REQ-005 | No regression to the weighted gate / headline | `hubRoute` stays 13 pass / 5 known-gap / 0 regression; `routeTelemetry` unchanged; `node --check` exits 0 on all 3 `.cjs` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | `rankBelowSkillIds` is optional and absent-safe | A fixture without the field returns `pass: null` / `unscored: 'fixture carries no rankBelowSkillIds'`; existing fixtures degrade to unscored, not fail |
| REQ-007 | Scorer surfacing is advisory only | `dims.relativeRanking` reduces into `advisorySignals.relativeRanking` / `runQuality` with the note "advisory, not weighted"; never `modeAScore` / `dimensionScores` / `verdict` |
| REQ-008 | Evergreen body | The edited `.cjs` files and the fixture carry no spec/packet/phase IDs or `specs/` paths |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `advisor-probe.cjs` exports `scoreRelativeAdvisorRanking()`, a pure function whose pass is `targetRank !== null && violatingSkills.length === 0`.
- **SC-002**: sk-design ranked #1 with transports below → `pass: true`, `targetRank: 1`, `violatingSkills: []`; a transport out-ranking sk-design → `pass: false` with the transport named.
- **SC-003**: `advisor-probe.cjs --rank-below` exits non-zero on a seeded out-ranking (enforceable at the probe).
- **SC-004**: A fixture with no `rankBelowSkillIds` is unscored / advisory (`pass: null`); the scorer surfacing rides `advisorySignals.relativeRanking` / `runQuality` only.
- **SC-005**: `hubRoute` stays 13 / 5 / 0, `routeTelemetry` is unchanged, `node --check` exits 0 on all 3 `.cjs`, and the evergreen scan is clean.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A weighted signal could shift the headline | Folding relative ranking into `modeAScore` / `verdict` would risk the 13/5/0 `hubRoute` headline and change `routeTelemetry` | The signal is enforceable at the probe (pass/fail + CLI exit) but advisory at the scorer: `dims.relativeRanking` reduces into `advisorySignals.relativeRanking` / `runQuality` ONLY, never the weighted aggregate or the `hubRoute` gate — verified byte-stable |
| Risk | `router-replay.cjs` could be mistaken for a target | Re-tuning the live route corpus to satisfy a ranking check would corrupt the no-regression baseline | CORRECTION recorded: `router-replay.cjs` and `hub-router.json` are the no-regression anchor, NOT a target; the enforceable surface is the `advisor-probe.cjs` CLI; the corpus stays untouched and the route-gold guard stays 13/5/0 |
| Risk | The check could be read as a quality certificate | A reader might treat a passing ranking as "the design is good" | HONEST framing recorded: the check proves the advisor ranked sk-design above the named transports on the prompt — it proves ordering, not taste; taste stays advisory |
| Risk | The new field could break existing fixtures | A required field would fail every fixture that lacks it | `rankBelowSkillIds` is optional; a fixture without it returns `pass: null` / `unscored`, so existing fixtures degrade to unscored |
| Dependency | `advisor-probe.cjs` (`probeAdvisor`, `scoreD1Inter`, `scoreModePrecision`) | The integration point and the advisory-lane pattern to mirror | Internal, green |
| Dependency | `load-playbook-scenarios.cjs` gold loader | Surfaces the new field so it is not dropped on parse | Internal, green |
| Dependency | The deterministic Python advisor (SQLite, no LLM) | Produces the ranked recommendations the CLI fail-closed path probes | Internal, green |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Additivity
- **NFR-A01**: `rankBelowSkillIds` is a new optional `expected` field; absence yields zero new behavior (`pass: null` / `unscored`). `scoreRelativeAdvisorRanking()` and the `--rank-below` flag are additive; every existing `advisor-probe.cjs` export and CLI path stays present and unchanged.

### Backward Compatibility
- **NFR-B01**: The scorer adds `dims.relativeRanking` and `advisorySignals.relativeRanking` / `runQuality` only; `modeAScore`, `dimensionScores`, `aggregateScore`, the `hubRoute` gate, `verdict`, and `routeTelemetry` are byte-stable. The route-gold guard stays 13 pass / 5 known-gap / 0 regression.

### Honesty
- **NFR-H01**: The check proves the advisor ranked the target above the named transports on the prompt — it proves ordering, never quality. The scorer surfacing carries the note "advisory, not weighted"; taste stays advisory.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Scoring Boundaries
- **No `rankBelowSkillIds`**: `normalizeSkillIds()` yields an empty list → `pass: null`, `unscored: 'fixture carries no rankBelowSkillIds'` (graceful, advisory).
- **Advisor probe failed**: `advisorResult.ok` false → `pass: null`, `unscored: 'advisor probe failed'`.

### Ranking Boundaries
- **Target #1, transports below**: every listed transport ranks strictly below the target → `violatingSkills` empty → `pass: true`.
- **Transport at or above target**: a transport with `rank <= targetRank` is a violation → `pass: false`, the transport named in `violatingSkills`.
- **Target absent**: `targetRank === null` → `pass: false`, `reason: 'target skill missing from recommendations'`.
- **Listed transport absent**: a transport not in the recommendations is not a violation (ranks below an absent slot) → does not fail the check.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

- **Surface count**: One pure scorer + one CLI branch in `advisor-probe.cjs`, one field surfaced in `load-playbook-scenarios.cjs`, one advisory lane in `score-skill-benchmark.cjs`, and one seeded fixture — four files, all scope-locked.
- **Risk concentration**: The load-bearing piece is the enforceable-vs-advisory split. The probe must fail closed while the scorer surfacing stays advisory, so the weighted aggregate, the `hubRoute` gate, and `routeTelemetry` stay byte-stable. The optional-field no-op (`pass: null` when unseeded) contains the regression risk.

<!-- /ANCHOR:complexity -->
---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should the relative-ranking signal be folded into the weighted aggregate? **RESOLVED: No. It is enforceable at the probe (pass/fail + the `--rank-below` CLI exits non-zero) and advisory at the scorer (`advisorySignals.relativeRanking` / `runQuality`, note "advisory, not weighted"). Folding it into `modeAScore` / `verdict` would risk the 13/5/0 `hubRoute` headline and change `routeTelemetry`; the split keeps both byte-stable.**
- Is `router-replay.cjs` a target for this build? **RESOLVED: No — CORRECTION. `router-replay.cjs` and `hub-router.json` are the no-regression baseline, not a target to re-tune. The enforceable surface is the `advisor-probe.cjs` CLI; the live route corpus stays untouched and the route-gold guard stays 13/5/0.**
- Does a passing check mean the design is good? **RESOLVED: No. The check proves the advisor ranked sk-design above the named transports on the prompt — it proves ordering, not taste. Taste stays advisory.**

<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md`

---

<!--
LEVEL 2 SPEC
- Core + Level 2 verification focus
- Evidence: scoreRelativeAdvisorRanking() + --rank-below fail-closed CLI in advisor-probe.cjs; rankBelowSkillIds gold field; advisory-only dims.relativeRanking in score-skill-benchmark.cjs; one seeded sk-design fixture
- Findings: enforceable at the probe / advisory at the scorer; router-replay-not-a-target correction; hubRoute stays 13/5/0; proves ordering, not taste
-->
