---
title: "Spec: Lane C skill-benchmark applicability reporting (excluded-by-design vs unscored)"
description: "The Lane C skill-benchmark silently normalizes D1-inter (advisor rank) and D4 out of the weighted aggregate for skills that cannot support them, so an advisor-invisible surface like code-opencode reports two 'unscored' dimensions that read as gaps rather than structural N/A. This packet makes the harness distinguish excluded-by-design from runnable-but-unscored: D1-inter is excluded for advisor-invisible skills (no graph-metadata.json) with the owning advisor identity recorded as the delegated measure; the report gains an excludedDimensions channel; the D4-R ablation fails closed instead of silently borrowing another skill's scenarios; and the hub-D1 skillId propagation bug is fixed so advisor-visible hubs score D1-inter correctly. Scoring weights and aggregates are unchanged — this is reporting honesty plus two correctness fixes, no advisor changes."
trigger_phrases:
  - "skill benchmark excluded by design"
  - "D1-inter advisor-invisible reporting"
  - "D4-R fail closed scenario selection"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/060-skill-benchmark-applicability-reporting"
    last_updated_at: "2026-07-11T14:30:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded packet; design verified vs code + GPT review; implementation pending"
    next_safe_action: "Implement Phase 2 harness changes"
    blockers: []
    completion_pct: 10
    open_questions: []
    answered_questions:
      - "Operator: harness reporting fix + hub-D1 skillId bug; do NOT touch the advisor"
      - "GPT-5.6-sol: D1-inter is N/A-by-design for advisor-invisible surfaces; keep weighted D4 unscored"
---
# Spec: Lane C Skill-Benchmark Applicability Reporting

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

## 1. METADATA
<!-- ANCHOR:metadata -->
| Field | Value |
|-------|-------|
| **Packet** | 060-skill-benchmark-applicability-reporting |
| **Level** | 2 |
| **Status** | Complete |
| **Origin** | Operator: make D1-inter/D4 "work" for code-opencode; scope chosen = harness reporting fix + hub-D1 skillId bug |
<!-- /ANCHOR:metadata -->

## 2. PROBLEM & PURPOSE
<!-- ANCHOR:problem -->
The Lane C skill-benchmark scores five weighted dimensions (D1-inter 12, D1-intra 13, D2 20, D3 15, D4 25, D5 15). Two are reported as `unscored-mode-a` for skills that cannot support them, and the aggregate is normalized over only the measured dimensions. For `code-opencode` — a read-only, advisor-invisible surface packet bundled by the `sk-code` identity — this produces a live report with D1-inter and D4 both "unscored," which reads as a measurement gap rather than a structural fact.

Two of those reports are not just cosmetic:

- **D1-inter is a category error for an advisor-invisible surface.** The advisor's filesystem projection only creates a candidate for a directory that carries `graph-metadata.json` (`system-skill-advisor/.../scorer/projection.ts`); `code-opencode` deliberately has none, so the advisor ranks the `sk-code` hub, never the surface. Reporting "unscored" implies it *could* be scored.
- **The D4-R task-outcome ablation silently borrows another skill's scenarios.** `DEFAULT_D4R_SCENARIOS` holds `LS-*/SD-*` ids and intersects them with the target playbook, so an `OC-*` run scores nothing (or, on an id collision, a foreign scenario) with no signal that nothing ran.

Separately, a real bug blocks D1-inter for advisor-*visible* hubs: `runPlaybook()` never passes `skillId` into `scoreScenario()`, so the `expectedFromScenario()` fallback `arg.skillId` is always undefined and a scenario that relies on it scores against an undefined expected identity.

Purpose: report the two dimensions honestly (excluded-by-design vs runnable-unscored), fail closed on D4-R scenario selection, and fix the skillId propagation — with the weighted aggregate provably unchanged and no edits to the advisor.
<!-- /ANCHOR:problem -->

## 3. SCOPE
<!-- ANCHOR:scope -->
In scope:
1. **Excluded-by-design channel.** `aggregate()` marks D1-inter `applicable:false, status:"excluded-by-design"` with a `reason` and `delegatedMeasure.targetSkill` (the owning advisor identity) when the benchmarked skill root lacks `graph-metadata.json`. A new `excludedDimensions` array carries such dimensions; they leave `unscoredDimensions`.
2. **hub-D1 skillId fix.** `runPlaybook()` threads `skillId` into `scoreScenario()` so the `expectedFromScenario()` fallback resolves for advisor-visible hubs.
3. **D4-R fail-closed selection.** `augmentWithD4R()` drops the cross-target `LS-*/SD-*` defaults; with no explicit `--d4-scenarios`/`--scenarios` that exist in the target playbook, it emits `not-run-no-target-scenarios` and scores nothing.
4. **Report rendering.** `build-report.cjs` renders excluded dimensions distinctly from unscored ones (reason + delegated measure).
5. **Tests + Lane C docs** updated to the new contract.

Out of scope (FROZEN): any change to `advisor-probe.cjs` scoring, the advisor scorer/`system-skill-advisor` code, `sk-code` vocabulary/`graph-metadata.json`/`hub-router.json`, or the dimension weights. Wiring a live weighted-D4 scorer is explicitly NOT done — the D4 instrument grades hallucination hygiene, not usefulness, and the mutation-free surface cannot support a weighted causal usefulness claim.
<!-- /ANCHOR:scope -->

## 4. REQUIREMENTS
<!-- ANCHOR:requirements -->
- R1: For an advisor-invisible skill (no `graph-metadata.json` at its root), D1-inter is reported `excluded-by-design` with a reason and `delegatedMeasure.targetSkill`, and appears in `excludedDimensions`, not `unscoredDimensions`.
- R2: For an advisor-visible skill, D1-inter behavior is unchanged (scored when an advisor probe produced a score, else `unscored-mode-a`).
- R3: The weighted `aggregateScore` and per-scenario `modeAScore` for `code-opencode` are byte-identical before and after (D1-inter/D4 were already normalized out).
- R4: `runPlaybook()` passes `skillId` to `scoreScenario()`.
- R5: D4-R with no target-owned scenarios emits `not-run-no-target-scenarios` and never mutates `aggregateScore`.
- R6: No file under `system-skill-advisor/` or `sk-code/{SKILL.md,graph-metadata.json,mode-registry.json,hub-router.json}` is modified.
<!-- /ANCHOR:requirements -->

## 5. SUCCESS CRITERIA
<!-- ANCHOR:success-criteria -->
- code-opencode live report: `excludedDimensions:["D1inter"]`, `unscoredDimensions:["D4"]`, `aggregateScore` unchanged (84), verdict PASS.
- New/updated Lane C tests green; full `skill-benchmark/tests/` suite green.
- sk-code router benchmark re-run after the skillId fix; any D1-inter delta baselined and reported (landed separately from the report-only change if it moves the aggregate).
- `git diff --stat` shows zero files under `system-skill-advisor/` or `sk-code/` metadata/vocab.
<!-- /ANCHOR:success-criteria -->

## 6. RISKS & DEPENDENCIES
<!-- ANCHOR:risks -->
- **Advisor tuning program is gated.** `system-skill-advisor/012-skill-advisor-tuning` is In Progress with gated vocab/reindex/ratchet follow-up; any advisor-owned diff is a scope breach and halts the patch.
- **Contract mirrors.** Existing tests/playbook assertions expect `D4=unscored-mode-a` and `unscoredDimensions:["D1inter","D4"]`; these must be updated in lockstep.
- **hub-D1 delta.** Fixing skillId may legitimately change sk-code's D1-inter and its aggregate; baseline and land that separately from the report-only change.
<!-- /ANCHOR:risks -->

## 7. OPEN QUESTIONS
<!-- ANCHOR:questions -->
None open. Vehicle (targeted harness patch, not advisor, not /deep:improvement) and scope (reporting + hub-D1 bug) are operator-decided.
<!-- /ANCHOR:questions -->
