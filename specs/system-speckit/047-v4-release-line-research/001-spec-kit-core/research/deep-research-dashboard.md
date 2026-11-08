---
title: Deep Research Dashboard
description: Auto-generated reducer view over the research packet.
---

# Deep Research Dashboard - Session Overview

Auto-generated from JSONL state log, iteration files, findings registry, and strategy state. Never manually edited.

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Reducer-generated observability surface for the active research packet.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:status -->
## 2. STATUS
- Topic: Audit the Skilled v4 spec-kit core, .skilled/skills/system-spec-kit/** and .skilled/commands/speckit/**, across releases v4.0.0.0 to v4.0.2.0. Surfaces: the Gate 3 classifier (system-spec-kit/shared/gate-3-classifier.ts), validate.sh and its rules (runtime/cli/spec/, runtime/cli/rules/), the trigger index and retrieval (runtime/cli/retrieval/), continuity save and resume (generate-context.js, /speckit:save, /speckit:resume), the goal system (goal.md, goal.cjs), upgrade and /doctor:update, the level templates and create.sh. Releases: notes in .skilled/changelog/skilled/v4.0.*.md. Tags: v4.0.0.0-beta.1 (baseline), v4.0.0.0 3fed08373e, v4.0.0.1 bcb775402e, v4.0.0.2 7980001709, v4.0.0.3 c9bd4b156c, v4.0.0.4 to v4.0.0.10 all 4d8f403355 (one commit: use each note plus git log --since/--until by date, not tag diffs), v4.0.0.11 e2b2e393fa, v4.0.0.12 7fecd5f219, v4.0.0.13 42b41dd286, v4.0.0.14 bb9b9d1c09, v4.0.0.15 22c3a9b2c7, v4.0.0.16 f459b06479, v4.0.1.0 6a93a2cfeb, v4.0.2.0 51f70a0317. Always path-limit git diff: git diff <prev>..<tag> -- <cluster path>; the unlimited diff times out. Finding types: 1 drift (note vs code vs docs disagree), 2 misalignment with sk-code, sk-doc or Skilled canon, 3 bug, 4 improvement, 5 UX for the operator and the AI user, 6 over-engineering (say what breaks if removed, or that nothing does), 7 extension (a concrete way to extend the logic). Evidence bar for every finding: type, severity P0/P1/P2, [SOURCE: path:line] for a line you read this iteration, the release that introduced it, confidence, and a verify command. A bug needs a repro command or a failing check you ran. Read code, not only release notes. Read-only research: never edit, stage or commit repository files, and run commands only in read-only, check, plan or dry-run modes.
- Started: 2026-11-08T19:56:59.169Z
- Status: INITIALIZED
- Iteration: 20 of 10
- Session ID: 2026-11-08T19:56:59.168Z
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Gate 3 classifier parity with AGENTS.md and the v4.0.0.1 note; validate.sh rule inventory versus the v4.0.0.0 and v4.0.0.5 notes | - | 0.55 | 0 | insight |
| 2 | Iteration 2: validate.sh rules (ANCHORS_VALID nested anchors; commit and PR gates) and trigger index rebuild/staleness/exit codes. | - | 0.62 | 0 | insight |
| 3 | Q4 continuity save/resume routing; Q5 goal system and the 4,000-character durable-slice budget | - | 0.68 | 0 | insight |
| 4 | unknown | - | 0.00 | 0 | error |
| 5 | Q6/Q7: /doctor:update upgrade surface, create.sh + level templates against validate.sh --strict, and a fixture reproduction of the check-goal --all exit claim | - | 0.62 | 0 | insight |
| 6 | Q8 doc drift for v4.0.0.13-v4.0.2.0 shipped features and Q9 scripts with no caller | - | 0.55 | 0 | insight |
| 7 | Q10 operator/AI friction probes, Q11 sk-code and sk-doc conformance, Q12 concrete extensions, plus the f-iter006-004 correction and a disk recount of the speckit commands | - | 0.58 | 0 | insight |
| 8 | Continuity save/resume writer routing: where decisions, summary and handover actually go, plus a live run of generate-context.js against a scratch packet | - | 0.64 | 0 | insight |
| 9 | v4.0.0.15 / v4.0.0.16 / v4.0.1.0 / v4.0.2.0 code deltas and the trigger-index --check contract | - | 0.70 | 0 | insight |
| 10 | KQ1 re-run through the real classifyPrompt export with ten prompts; KQ2 fixtures under /tmp for the rules the v4.0.0.0 note names; withdrawal of iteration 9's clean-checkout framing | - | 0.72 | 0 | insight |
| 11 | Attribution pass over all 48 logged findings via git log -S/--follow plus commit-date to release mapping, and two new findings from the v4.0.0.11 (22-file) and v4.0.0.12 (4-file) diffs | - | 0.68 | 0 | insight |
| 12 | Repro and verify each open P1 (Gate 3 order asymmetry, ANCHORS_VALID phase-parent skip, check-goal corpus exit, create.sh template root, CROSS_ANCHOR_CONTAMINATION, resolveProjectRoot fallback, trigger-index staling); then compare system-spec-kit references docs against sk-doc's reference template on frontmatter and section shape. | - | 0.64 | 0 | insight |
| 13 | Improvement and over-engineering pass on the two thinnest types: the validation rule registry (rules always skipped, unproduced, or duplicating another), create.sh size and its repeated TEMPLATES_BASE blocks, and one concrete improvement row per confirmed P1 | - | 0.62 | 0 | insight |
| 14 | Release-coverage and UX pass: attribute v4.0.0.4 and 0.6-0.10, run validate.sh --strict on /tmp copies of a Level 1 and a phase-parent packet, and exercise lookup-trigger-index.mjs with a typo flag, an empty prompt and an unknown flag. | - | 0.55 | 0 | insight |
| 15 | Bug and extension pass on surfaces not yet read: recommend-level.sh, check-placeholders.sh beyond 110-120, continuity writer argument handling, generate-trigger-index.mjs | - | 0.57 | 0 | insight |
| 16 | Verification pass: re-run the ten strongest P1 repros on /tmp copies, record command/output/exit code, attribute introducing release, and name zero-finding releases | - | 0.42 | 0 | insight |
| 17 | Dist-versus-source drift pass: compare compiled runtime/cli and runtime/lib dist against sources, find how dist is built and whether CI checks it, and close iteration 16's V6 | - | 0.52 | 0 | insight |
| 18 | Fresh-clone path pass: which documented commands need a compiled dist the clone lacks, which documented step builds it, and which messages name the fix | - | 0.60 | 0 | insight |
| 19 | shared/ package and the session hooks: spec-gate adapters, the disable/env surface, and TS-vs-compiled divergence | - | 0.58 | 0 | insight |
| 20 | Repo-root resolution across four cwd scenarios: findRepoRoot vs resolveProjectRoot vs getDefaultWorkspaceRoot | - | 0.62 | 0 | insight |

- iterationsCompleted: 20
- keyFindings: 308
- openQuestions: 2
- resolvedQuestions: 10

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 10/12
- [x] Does the Gate 3 classifier in .skilled/skills/system-spec-kit/shared/gate-3-classifier.ts classify the same prompts as the Gate 3 text in AGENTS.md and the v4.0.0.1 note section The Gate That Asks Once, and which prompt does it misclassify?
- [x] Which validate.sh rules named in the v4.0.0.0 and v4.0.0.5 notes exist in runtime/cli/rules and the validation orchestrator, and does any rule pass on a packet it should fail?
- [x] Does the trigger index lookup and build (runtime/cli/retrieval/) match retrieval-conventions.md and the release notes on rebuild, staleness and exit codes?
- [x] Does continuity save and resume (generate-context.js, /speckit:save, /speckit:resume) route content where the v4.0.0.13, v4.0.0.14 and v4.0.1.0 notes say it does?
- [x] Does the goal system shipped in v4.0.0.2 (goal.md template, goal.cjs, the 4,000-character slice budget) behave as its docs say, and where is the budget enforced?
- [x] Which spec-kit changes in v4.0.0.13 to v4.0.2.0 (handover, environment settings, Decisions Through the Question Tool) are missing or stale in system-spec-kit SKILL.md and references?
- [x] Which spec-kit scripts, rules or options have no caller, no test, or duplicate another, and what breaks if each is removed?
- [x] What friction do the operator and the AI user hit in validate.sh, create.sh and the speckit commands: error text, exit codes, required flags, output length?
- [x] Where do system-spec-kit code and docs depart from sk-code standards and sk-doc skill format?
- [x] What concrete extensions to the Gate 3 classifier, validate rules, trigger index, continuity and goal features would close a gap found in this run?
- [ ] Do upgrade, preview and rollback (/doctor:update check, align, apply, rollback from v4.0.0.3 and v4.0.0.5) hold up when read end to end and run only in check, preview or dry-run modes, and which step has no test? [legacy-import]
- [ ] Do create.sh and the level templates produce a packet that passes validate.sh --strict without hand edits, and do template fill notes agree with sk-doc and the template canon? [legacy-import]

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 2
- [ ] Do upgrade, preview and rollback (/doctor:update check, align, apply, rollback from v4.0.0.3 and v4.0.0.5) hold up when read end to end and run only in check, preview or dry-run modes, and which step has no test?
- [ ] Do create.sh and the level templates produce a packet that passes validate.sh --strict without hand edits, and do template fill notes agree with sk-doc and the template canon?

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ▆▇█▁▇▆▇▇███▇▇▆▇▅▆▇▇▇
- score sparkline: ▆▇█▁▇▆▇▇███▇▇▆▇▅▆▇▇▇
- Last 3 ratios: 0.60 -> 0.58 -> 0.62
- Stuck count: 1
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.62
- coverageBySources: {}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- None yet

<!-- /ANCHOR:dead-ends -->
<!-- ANCHOR:divergent-pivots -->
## 6A. DIVERGENT PIVOTS
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergent-pivots -->
<!-- ANCHOR:next-focus -->
## 7. NEXT FOCUS
**Carried**: Q7 `create.sh` + level templates (scaffold-versus-`--strict`, fill-note canon);

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 8. ACTIVE RISKS
- None active beyond normal research uncertainty.

<!-- /ANCHOR:active-risks -->
<!-- ANCHOR:blocked-stops -->
## 9. BLOCKED STOPS
No blocked-stop events recorded.

<!-- /ANCHOR:blocked-stops -->
<!-- ANCHOR:graph-convergence -->
## 10. GRAPH CONVERGENCE
- graphConvergenceScore: 0.00
- graphDecision: [Not recorded]
- graphBlockers: none recorded

<!-- /ANCHOR:graph-convergence -->
