---
title: "Verification Checklist: D3-R11 — Relative advisor ranking (transport suppression)"
description: "Verification checklist for scoreRelativeAdvisorRanking() + rankBelowSkillIds, including the additive no-regression contract and a fix-completeness section."
trigger_phrases:
  - "d3-r11 relative advisor ranking checklist"
  - "scoreRelativeAdvisorRanking verification"
  - "transport suppression no-regression checklist"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/003-d3-routing-utilization/011-relative-advisor-ranking"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Verify every checklist item against the delivered scorer, CLI, and fixture"
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
# Verification Checklist: D3-R11 — Relative advisor ranking (transport suppression)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

<!-- /ANCHOR:protocol -->
---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Spec deliverable + exact target confirmed
  - **Evidence**: `spec.md` §3 names `advisor-probe.cjs` + the gold `expected` schema + the loader + the seeded fixture; the implemented scorer sits at `advisor-probe.cjs:165`
- [x] CHK-002 [P0] Baseline route-gold guard captured BEFORE edits (13/5/0)
  - **Evidence**: route-gold guard confirmed green at 13 pass / 5 known-gap / 0 regression before the change
- [x] CHK-003 [P1] Baseline full vitest suite green BEFORE edits
  - **Evidence**: skill-benchmark vitest suite confirmed green pre-change

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `node --check` passes on every edited `.cjs`
  - **Evidence**: `node --check` on `advisor-probe.cjs`, `load-playbook-scenarios.cjs`, and `score-skill-benchmark.cjs` exits 0
- [x] CHK-011 [P0] [P] No spec IDs / packet / phase numbers / spec paths in shipped code comments (evergreen [HARD])
  - **Evidence**: evergreen scan over the 3 edited `.cjs` + the fixture returned no ID/path artifacts
- [x] CHK-012 [P1] `scoreRelativeAdvisorRanking()` is a pure function mirroring `scoreD1Inter` shape, with no hidden coupling to the weighted gate
  - **Evidence**: `advisor-probe.cjs:165` reads only `advisorResult` + `expectedSkillId` + `rankBelowSkillIds` and returns a plain result object
- [x] CHK-013 [P1] `rankBelowSkillIds` is optional and absent-safe (existing fixtures unaffected)
  - **Evidence**: a fixture without the field returns `pass: null` / `unscored: 'fixture carries no rankBelowSkillIds'`; existing fixtures degrade to unscored, not fail

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Relative-ranking metric computes over the gold corpus per the spec
  - **Evidence**: the seeded sk-design fixture with `rankBelowSkillIds` produces a `pass` result; `score-skill-benchmark.cjs:677` computes `dims.relativeRanking`
- [x] CHK-021 [P0] [P] Synthetic PASS case: sk-design #1, transports below → `pass: true`
  - **Evidence**: orchestrator ran `scoreRelativeAdvisorRanking()` against the real advisor shape → `pass: true`, `targetRank: 1`, `violatingSkills: []`
- [x] CHK-022 [P0] [P] Synthetic FAIL case: transport out-ranks sk-design → `pass: false`, violating transport named
  - **Evidence**: a transport (cli-codex) above sk-design → `pass: false`, `targetRank: 2`, `violatingSkills: ["cli-codex"]`
- [x] CHK-023 [P1] [P] Edge cases: target absent → fail; transport absent → pass
  - **Evidence**: target absent → `pass: false`, `reason: 'target skill missing from recommendations'`; a listed transport absent from recommendations is not a violation
- [x] CHK-024 [P1] CLI fail-closed: `advisor-probe.cjs --rank-below` exits non-zero on a seeded out-ranking
  - **Evidence**: the CLI branch exits `out.ok && relativeRanking.pass ? 0 : 1`, so a transport out-ranking the target exits non-zero

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-060 [P0] No-regression: `hubRoute` headline stays 13 pass / 5 known-gap / 0 regression, `failed: false`
  - **Evidence**: route-gold guard green after edits at 13 pass / 5 known-gap / 0 regression
- [x] CHK-061 [P0] No-regression: `routeTelemetry` reducer output unchanged
  - **Evidence**: `routeTelemetry` reducer output intact; the new lane never touches the telemetry block
- [x] CHK-062 [P0] No-regression: weighted `aggregateScore`, `dimensionScores`, and `verdict` logic unchanged (no new `BLOCKED-BY-*` verdict)
  - **Evidence**: `dims.relativeRanking` reduces into `advisorySignals` / `runQuality` only (`score-skill-benchmark.cjs:879/893`); `modeAScore` / `dimensionScores` / `verdict` math untouched
- [x] CHK-063 [P1] New metric rides the advisory / `runQuality` block only — never folded into the weighted aggregate or the `hubRoute` gate
  - **Evidence**: `advisorySignals.relativeRanking` carries the note "advisor target rank relative to sibling transports; advisory, not weighted"; the weighted aggregate is unchanged
- [x] CHK-064 [P1] Acceptance met: probe passes when sk-design #1 with transports below (today: #1, transports at 3/5) and fails a seeded transport out-ranking
  - **Evidence**: sk-design #1 → `pass: true`, `targetRank: 1`, `violatingSkills: []`; transport out-ranks → `pass: false`, `violatingSkills: ["cli-codex"]`; CLI fail-closed exit
- [x] CHK-065 [P1] Full skill-benchmark vitest suite green
  - **Evidence**: suite green after edits

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No new external input surface or arbitrary code path introduced
  - **Evidence**: the change is a pure scorer + an optional CLI flag over existing advisor output; no new I/O or eval path
- [x] CHK-031 [P1] CLI flag parsing rejects/ignores malformed `--rank-below` input safely
  - **Evidence**: `--rank-below` without a value or without `--expected-skill-id` prints usage and exits 2; an empty `rankBelowSkillIds` normalizes to `[]` → `pass: null` / unscored (no crash)

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] spec / plan / tasks / checklist synchronized on the final mechanism
  - **Evidence**: all four reflect `scoreRelativeAdvisorRanking()` + the `rankBelowSkillIds` gold field + the `--rank-below` CLI + the advisory-only scorer surfacing
- [x] CHK-041 [P1] `implementation-summary.md` records the advisory-vs-gating decision and the no-regression evidence
  - **Evidence**: `implementation-summary.md` authored with the enforceable-at-probe / advisory-at-scorer split, the acceptance results, and the 13/5/0 no-regression evidence
- [x] CHK-042 [P2] README / inline docs for the new advisory signal updated if applicable
  - **Evidence**: the signal is self-documenting inline — the JSDoc on `scoreRelativeAdvisorRanking()` plus the `note: "advisory, not weighted"` string in `score-skill-benchmark.cjs`; no separate README edit was in scope (the build was scope-locked to the 4 files, none a README)

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only
  - **Evidence**: no temp files left outside the scratchpad; the working tree carries only the 4 modified skills files plus this phase folder's docs
- [x] CHK-051 [P1] scratch/ cleaned before completion
  - **Evidence**: no scratch artifacts remain at close

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 11/11 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-06-29
**Verified By**: markdown-agent (post-build verification of the delivered `scoreRelativeAdvisorRanking()`, the `--rank-below` fail-closed CLI, the `rankBelowSkillIds` gold field, and the advisory-only scorer surfacing)

<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
