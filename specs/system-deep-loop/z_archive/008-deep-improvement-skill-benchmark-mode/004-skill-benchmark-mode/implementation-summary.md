---
title: "Implementation Summary: Phase 004 — Lane C (skill-benchmark) build"
description: "Built Lane C: deterministic Mode A core (router-replay, contamination lint, D5 gate, D1-intra/D2/D3 scorer, report-builder, loop-host wiring, command) PLUS D1-inter advisor scoring (deterministic, opt-in). Full deep-improvement suite 208 passed / 20 files / exit 0. D4 ablation + Mode B live trace remain follow-on."
trigger_phrases:
  - "122 phase 004 implementation summary"
  - "lane c skill-benchmark build results"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/008-deep-improvement-skill-benchmark-mode/004-skill-benchmark-mode"
    last_updated_at: "2026-05-30T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Lane C Mode A + D1-inter advisor scoring; review fixes; full suite 208 pass exit 0"
    next_safe_action: "Phase 005 three-lane docs + hardening; D4 ablation + Mode B live trace are follow-on"
    blockers: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Implementation Summary — Phase 004: Lane C (skill-benchmark) build

## 1. What was done

Built Lane C as a third lane on the `deep-improvement` skill, per the Phase 002 playbook. Doctrine (operator override mid-campaign): **main-loop Opus authored the code; an Opus subagent reviewed** — no CLI executors.

Two passes: (1) the deterministic Mode A spine; (2) graduating D1-inter from "deferred" into the deterministic core (the Python advisor reads SQLite, no LLM, so it is verifiable this session) plus the Opus review's P0+P1 fixes.

## 2. Files (all under `.opencode/skills/deep-improvement/`)

**Scripts (`scripts/skill-benchmark/`):** `router-replay.cjs`, `contamination-lint.cjs`, `d5-connectivity.cjs`, `score-skill-benchmark.cjs`, `build-report.cjs`, `run-skill-benchmark.cjs`, `advisor-probe.cjs` (D1-inter), `_args.cjs`.
**Wiring:** `scripts/shared/loop-host.cjs` — additive `--mode=skill-benchmark` arm (Lane A/B untouched).
**Assets/refs/command:** `assets/skill-benchmark/{default_profile.json, remediation_taxonomy.json, fixtures/deep-improvement/*}`; `references/skill-benchmark/{operator_guide, scoring_contract, scenario_authoring}.md`; `.opencode/commands/deep/start-skill-benchmark-loop.md`.
**Tests:** `scripts/tests/skill-benchmark.vitest.ts` (27 tests).

## 3. Verification evidence (genuinely observed — see honesty note)

- **Full `deep-improvement` vitest suite: 208 passed, 0 failed, exit 0** (20 test files). Must be run from `scripts/` — its `vitest.config.ts` sets `root: __dirname`; running from the skill root yields a false "No test files found".
- **Lane C suite alone (`skill-benchmark.vitest.ts`): 27 passed, 0 failed.**
- **TST-1 non-regression:** loop-host identity test green within the suite — Lane A default + Lane B plans byte-identical; the skill-benchmark arm is purely additive; full suite green = no collateral.
- **End-to-end, both modes:** `--mode=skill-benchmark --skill=cli-codex` (default) → exit 0, dual report. `--skill=deep-improvement --advisor-mode=python` → exit 0; **D1-inter is now SCORED** (the dimension flows to the report; `unscoredDimensions` drops to `["D4"]`).
- **D1-inter measured value (honest):** for the current `agent-improve-001` fixture the advisor routes the paraphrased prompt to `sk-code`, not `deep-improvement`, so D1-inter scores **0** for that scenario. That is a real measurement (the advisor doesn't select the target for this paraphrase) and/or a fixture-quality signal — NOT a code defect. The dimension's machinery is verified working; the score value is honest, not tuned.
- **Router-replay correctness:** on `cli-codex`, "review this diff for security vulnerabilities…" → intent `REVIEW` → exact RESOURCE_MAP match, `missingResources: []`.
- **D5 gate:** router-less skill → `BLOCKED-BY-STRUCTURE`; `cli-codex` → not gated.
- **Advisor probe determinism:** `advisor-probe.cjs` → `ok:true` with a ranked list from the SQLite graph (no LLM).

### Honesty note (kept on the record)
Earlier drafts of this summary claimed "23/23" then "256/256" / "274/274" passing **before those runs were verified** — my `vitest` calls had returned "No test files found" (wrong cwd), and an Opus reviewer then found the suite RED (2 negative-fixture tests assumed `deep-improvement` had no router; post-rename it does). Those premature counts were wrong and are retracted. **The verified count is 208 passed (20 files), exit 0** (Lane C suite alone 27 passed) after fixing the cwd, the fixture assumption, and the review bugs.

### Review fixes applied (Opus P0 + P1), each test-covered
1. **P0** — negative-fixture tests build a throwaway router-less skill (`mkdtempSync`) instead of pointing at `deep-improvement`.
2. **P1** — `loadFixtures` wraps `JSON.parse` in try/catch → a malformed fixture degrades to a `loadError` entry instead of crashing (unit-tested via exported `loadFixtures`).
3. **P1** — D3 efficiency couples to the suppression outcome for negative scenarios (was giving full credit when a suppressed resource was wrongly routed). Tested.
4. P2 items (banned-vocab word-boundary, brace-parse latent edge, D5 score uniformity) recorded as follow-on calibration.

## 4. Scope: built + verified vs deferred (honest)

**Built + verified deterministically:** D1-inter (advisor selection, opt-in `--advisor-mode=python`), D1-intra (in-skill routing), D2 (discovery proxy), D3 (efficiency proxy), D5 (structural hard gate); full report/funnel/bottleneck/remediation pipeline; dual JSON+MD artifact; loop-host wiring; command; fixtures + references.

**Deferred to live mode (Mode B) — reported `unscored`, never faked:**
- **D4** (usefulness ablation) — needs live skill-on/off model dispatch through the grader; this session's CLI instability makes live runs unverifiable.
- **Mode B live trace capture** — per-executor `.out` parsing (codex = shell-verb scraping; no native token counts), per the 002 audit.

Lane C runs end-to-end on real target skills and emits a ranked, actionable report, with **four of five dimensions scored deterministically** (D1-inter, D1-intra, D2, D3) plus the D5 gate. Only D4 (genuinely live) remains — exceeding SC3's deterministic-core bar.

## 5. Calibration note

Weights (D1=25/D2=20/D4=25/D3=15/D5=15) + verdict bands are provisional per the playbook — calibrate on 2–3 pilots. The `agent-improve-001` fixture should be revised (or its expected `skillId` reconsidered) given the D1-inter=0 result. `router_unparseable`-as-hard-gate is a defensible v1 choice; may warrant a softer NOT-APPLICABLE for skills routing via a non-`INTENT_SIGNALS` mechanism.

## 6. Next steps

- **Phase 005** — three-lane docs (SKILL.md WHEN-TO-USE + smart-router/RESOURCE_MAP for skill-benchmark, README, advisor metadata) + the hardening/deep-review gate.
- **Follow-on packet** — D4 ablation + Mode B live trace + per-executor capture; pilot calibration of weights/bands; fixture revision.
