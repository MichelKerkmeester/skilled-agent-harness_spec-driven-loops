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
- Topic: Is the root README.md still accurate after every change described in .skilled/changelog/skilled/v4.0.0.4.md (per-doc version model, install steps and Node 24, unknown-option refusal, playbook and catalog path checks, advisor CI agreement, retired deep-loop modes, hooks, routing, code review output and the rest of the note), and are the related READMEs accurate: every README the root README links to or that documents the same setup or features (for example .skilled/README.md, install guides, and the hub READMEs for sk-doc, sk-code, sk-git, system-spec-kit, system-skill-advisor and cli-pi, plus any README the v4.0.0.4 changes touch). For each finding give README path:line, the claim, repository evidence (path:line or a command and its output), a class (STALE, MISSING, WRONG or OK-VERIFIED) and a severity, and propose the smallest correct wording fix with no restructure.
- Started: 2026-10-12T14:40:22.000Z
- Status: COMPLETE
- Iteration: 10 of 10
- Session ID: dr-023-readme-freshness-research-2026-10-12T14:40:22.000Z
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none
- stopReason: maxIterationsReached

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Q1: build the related-README inventory from the links in README.md and a grep for README files that document the same setup or features, then read the whole v4.0.0.4 note and map each section to the README lines it could affect. | - | 0.65 | 12 | complete |
| 2 | Q2: root README install, prerequisites (Node 24), first-use and setup statements vs the v4.0.0.4 install changes and the repository | readme-install | 0.75 | 11 | complete |
| 3 | Q3 part 1: root README deep-loop modes, slash commands and agents vs v4.0.0.4 and the repository | readme-accuracy | 0.83 | 6 | complete |
| 4 | Q3 part 2: root README statements on skills and hubs, skill routing and the advisor, hooks, and CI and commit/PR checks | readme-freshness | 0.60 | 12 | complete |
| 5 | Q3 part 3: root README statements on the Spec Kit (validation rules, create.sh options, Gate 3 option C, /doctor:update and upgrades), scripts refusing unknown options, per-doc versions and changelog numbering, playbook and catalog path checks and their counts, and code review output | readme-freshness | 0.74 | 19 | complete |
| 6 | Q4 part 1: setup-facing related READMEs — the .skilled/README.md premise check, the two INSTALL-GUIDE.md files the changelog names, and .skilled/bin/README.md against v4.0.0.4 and the repository | readme-freshness | 0.69 | 8 | complete |
| 7 | Q4 part 2: hub READMEs for system-spec-kit, system-skill-advisor and sk-git (and their mode READMEs where the root README links them), against v4.0.0.4 and the repository | - | 0.77 | 6 | complete |
| 8 | Q4 part 3: hub READMEs for sk-doc, sk-code, system-deep-loop and cli-external-orchestration/cli-pi (plus cli-devin if in the inventory), against v4.0.0.4 and the repository | - | 0.70 | 4 | complete |
| 9 | Q4 part 4 (the six remaining inventory READMEs) plus the Q5 MISSING pass over them | q4-q5-readmes | 0.71 | 5 | complete |
| 10 | Adversarial re-verification: re-open every STALE, WRONG and MISSING finding recorded in iterations 1 to 9, re-read the README line and the evidence, drop or correct any that do not hold, and list the README statements checked and found accurate (OK-VERIFIED) with path:line. | - | 0.25 | 30 | insight |

- iterationsCompleted: 10
- keyFindings: 31
- openQuestions: 0
- resolvedQuestions: 5

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 5/5
- [x] Q1: Which READMEs are related to the root README.md (linked from it, or documenting the same setup or features, or touched by v4.0.0.4), built from links and grep rather than guesses?
- [x] Q2: Do the root README install, prerequisites (Node 24), first-use and setup statements match the v4.0.0.4 install changes and the repository?
- [x] Q3: Do the root README statements on features (deep-loop modes, skill hubs, routing and the advisor, hooks, code review output, scripts refusing unknown options, per-doc versions, playbook and catalog checks, CI gates) match v4.0.0.4 and the repository?
- [x] Q4: Which statements in the related READMEs are stale, missing or wrong against v4.0.0.4 and the repository?
- [x] Q5: Which v4.0.0.4 user-facing changes do the READMEs leave out where a reader would need them, and which README statements were checked and found accurate?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 0
- None

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ▆▆▇▇█▇▆▆▇▇▆▇▇▇▇▆▇▆▄▁
- score sparkline: ▆▆▇▇█▇▆▆▇▇▆▇▇▇▇▆▇▆▄▁
- Last 3 ratios: 0.70 -> 0.71 -> 0.25
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.25
- coverageBySources: {"code":106,"other":106}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- None this iteration. (The retired-mode name search is not a dead end: 0 hits is the verified absence that confirms README:562.) (iteration 1)
- Repo-wide `**/README.md` sweep as the inventory source: the find returns more than 100 paths, dominated by benchmark-report and fixture READMEs; the related set was built from root-README links plus the topic-named hubs instead. (iteration 1)
- Forcing the advisor CLI run past its freshness gate with `SYSTEM_SKILL_ADVISOR_CLI_DEV_ALLOW_STALE=1`: unnecessary; the shim's freshness check passed and `list-tools` exited 0 without any bypass, so the bypass env would have changed behavior without adding evidence. (iteration 2)
- None beyond Ruled Out. (iteration 2)
- Root `.nvmrc` or root `package.json` as the Node 24 enforcement source: both absent (cat probes returned not-found); the requirement is enforced per package via the four `engines` fields, so no root version file can be cited or expected. (iteration 2)
- None this iteration. (iteration 3)
- Running `check-corpus.cjs --families` to list the check families: unnecessary; reading `FAMILY_NAMES` (lines 100-150) yields the same list without executing a script. (iteration 5)
- Running `create.sh` with an unknown option to observe the refusal: not executed; a scaffolder run risks writes, so the refusal was evidenced from the source token scan and the changelog instead. (iteration 5)
- `.skilled/README.md` as a related README to audit: the file does not exist and the root README has no reference to it (awk → 0 matches). Do not chase it in later iterations. (iteration 6)
- Mode READMEs for the three hubs as this iteration's audit target: the root README links no per-mode README for them (0 matches for `sk-git/README`; the only nested README it links is `system-spec-kit/runtime/README.md`, which remains on the Q4 inventory). Do not chase per-mode READMEs for these hubs again. (iteration 7)
- cli-devin README as an audit target this iteration: not in the Q1 inventory. Its observed lines (`README.md:12` `version: 1.4.0.11`, `SKILL.md:5` `version: 1.4.6.0`, newest changelog `v1.4.6.0.md`) are consistent with the own-edition model and are deferred. (iteration 8)
- Mode-packet README version parity as a drift class: closed by the frontmatter versioning standard — a mode README carries its own edition, raised by the bump rule, and only the parent-skill doctor's README check compares a hub root README with its `SKILL.md` [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:30], [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:122]. Do not re-chase cli-pi 1.5.0.8 vs 1.5.15.0. (iteration 8)
- An unknown-option note in `.skilled/scripts/README.md`: the v4.0.0.4 refusal set names the spec-kit CLI, the skill advisor, the deep loop, sk-doc, sk-code, sk-design, sk-git and the shared `.skilled/bin` tools, not `.skilled/scripts/`; only `orphan-mcp-sweeper.sh` already refuses an unknown argument (`:87`), so no README update is implicated. (iteration 9)
- Per-file READMEs inside `.skilled/bin/lib/compiled-routing/`: the README itself documents the directory is generated output that carries no README on purpose [SOURCE: .skilled/bin/lib/README.md:58]. (iteration 9)
- A single multi-line awk program for the line re-print: a newline between the OR-chain pattern and its `{print}` action binds the action as an always-true rule, so it dumped whole files; per-file one-liner awks were used instead. (iteration 10)
- None beyond Ruled Out. The `.skilled/README.md` and root `spec/README.md` absence checks confirm the topic's premise errors rather than opening new work; the real spec README sits at `.skilled/skills/system-spec-kit/runtime/cli/spec/README.md`. (iteration 10)
- Recovering iterations 1-5 full rows by matching the first table cell against `` | `path` ``: the rows' first cells do not match that shape; direct probes replaced the need. (iteration 10)

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
[All tracked questions are resolved]

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
