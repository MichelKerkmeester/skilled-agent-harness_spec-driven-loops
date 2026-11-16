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
- Topic: Current reality of the Skilled repository for a root README rewrite — everything that changed since v4.0.0.0, weighted toward v4.0.2.0 → v4.0.2.1 and the commits on main after the v4.0.2.1 tag
- Started: 2026-11-16T07:59:25.000Z
- Status: INITIALIZED
- Iteration: 20 of 20
- Session ID: 2026-11-16T07:59:25.000Z
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Q1 release delta: map the v4 tags, measure each tag range, locate the changelogs and release notes, and list the commits after v4.0.2.1 | - | 0.92 | 14 | complete |
| 2 | Q1 residual scope: read the v4.0.1.0 and v4.0.2.0 release notes, obtain a bounded diff measurement for v4.0.0.0..v4.0.1.0, and confirm which spec packets closed in each range | - | 0.95 | 11 | complete |
| 3 | Q1 close-out on the post-v4.0.2.1 window measured by file, plus the verified on-disk inventory counts that open Q2 | - | 0.92 | 11 | complete |
| 4 | Q2 close-out: the per-runtime CLI executor list, the MCP and Code Mode surface, the doctor command family, and a registry-shape correction | inventory | 0.88 | 10 | complete |
| 5 | Q5 reader-first section order for a shorter README: measure the root README by section, measure the 14 skill READMEs and sibling docs, and propose a tiered order with a shrink map | readme-structure | 0.87 | 12 | complete |
| 6 | Q4 claim audit of the 1,773-line root README: walk the Q5 tier order, settle the two flagged claims, and verify numeric claims against disk | - | 0.78 | 10 | complete |
| 7 | Q3 per-runtime hook, plugin and extension map: enumerate every runtime adapter surface, verify each count against disk, and pair each surface with the shared .skilled/hooks core it calls | hooks-and-runtimes | 0.88 | 11 | complete |
| 8 | Residual claim verification after all key questions resolved: settle the three numeric claims the Q4 audit left unverified (42 validation rules, 29 chart forms, 27 diagram types) and record why the earlier rule count failed | - | 0.60 | 5 | complete |
| 9 | Synthesis-state verification after all key questions resolved: measure whether the workflow-owned research.md reflects the questions answered in iterations 6-8, using the reducer-owned registry and dashboard as the independent reference | - | 0.80 | 5 | complete |
| 10 | Runtime matrix completion: command surfaces, spelling and mirror forms per runtime, plus the synthesis-state check iteration 9 left open | - | 0.79 | 7 | complete |
| 11 | MCP registration topology per runtime: which config file each of the eight runtimes uses for Code Mode, who writes it, and whether the README's seven-config, single-server and 14-template claims hold | mcp-topology | 0.86 | 7 | complete |
| 12 | Install-path verification for the reader's first screen: execute the README's clone-and-build block, confirm the clone URL, measure the tracked top level against the working tree, and locate the version source | - | 0.88 | 9 | complete |
| 13 | Link and switch integrity of the current README: verify every relative link target resolves and is tracked, every same-file anchor matches a heading, and every environment token the README names exists in code after the session-handover rename | - | 0.70 | 5 | complete |
| 14 | FAQ claim audit: the ten §16 answers Q4 never read, weighted to the seven-tool server count, the Claude Code handover default, and the local-first guarantee | - | 0.75 | 6 | complete |
| 15 | Skill catalog copy source and the skill-mirror delivery model: the 14 tracked skills against the 15 directories on disk, the §9 catalog's coverage, and the link form each runtime uses to receive skills | skill-catalog-and-mirrors | 0.90 | 8 | complete |
| 16 | Count and citation contradictions the rewrite would inherit: the 14-versus-15 skill count, the 44-versus-45 command count, and the two wrong README line citations in research.md section 5D | - | 0.68 | 6 | complete |
| 17 | The command-count partition the README rewrite would inherit (43 in six groups plus two utilities) and the four remaining section 5D line anchors | command-inventory | 0.70 | 5 | complete |
| 18 | The last unmeasured numeric claims a rewrite would publish: 42 validation rules, 10 repo-rule files, the four-level taxonomy, and an independent reproduction of the 44-command depth-band count | readme-claim-audit | 0.62 | 4 | complete |
| 19 | The synthesis surface a rewrite brief is assembled from: audit research.md's counts, line anchors and open-question rows against the oracles settled in iterations 15-18 | - | 0.71 | 7 | complete |
| 20 | The runtime roster a rewrite must publish: settle the six-vs-eight conflict and the Hermes candidate against the shipped runtime folders, the changelog and the doctor's runtime-folder manifest | - | 0.85 | 4 | complete |

- iterationsCompleted: 20
- keyFindings: 139
- openQuestions: 0
- resolvedQuestions: 5

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 5/5
- [x] Q1 Release delta: what did v4.0.0.0 -> v4.0.1.0 -> v4.0.2.0 -> v4.0.2.1 -> current main HEAD each change? Use git log and git diff --stat between tags (v4.0.0.0, v4.0.1.0, v4.0.2.0, v4.0.2.1; v4.0.0.14-16 also exist), changelogs (**/changelog/**, root CHANGELOG or release notes) and spec packets closed in that range. Most weight on v4.0.2.1 and the ~37 commits after the tag, including the hook-library cleanup merged from worktree 411.
- [x] Q2 Current inventory verified against files on disk: skills and their modes and hubs (.skilled/skills/*/SKILL.md, mode-registry.json), commands (.skilled/commands/), agents (.skilled/agents/ or .claude/agents/), supported runtimes and CLI executors (Claude Code, Codex, OpenCode, Pi, Devin, DeepSeek Harness/DSH, Mistral Vibe, Cursor, Hermes), doctor commands, MCP and Code Mode.
- [x] Q3 Every dedicated hook, plugin and extension per runtime (.claude/hooks, .codex/hooks, .opencode/plugins, .pi/extensions, .devin, .dsh/plugins, .vibe, shared .skilled hook cores): name, runtime(s), what it does in one or two sentences, source path. Complete and verified, one README subsection each.
- [x] Q4 Claim audit of the current root README.md (1,773 lines): which statements are stale, wrong, missing or over-detailed versus the code. Cite README line numbers and the contradicting source.
- [x] Q5 Reader-first section order for a shorter README: what a new reader needs first (what it is, install, core workflow), what can shrink to a link, and what other READMEs in the repo (.skilled/skills/*/README.md) already own so the root can link instead of repeat.

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 0
- None

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ▇█▇▇▆▅▇▁▅▅▆▇▃▄▇▃▃▁▃▆
- score sparkline: ▇█▇▇▆▅▇▁▅▅▆▇▃▄▇▃▃▁▃▆
- Last 3 ratios: 0.62 -> 0.71 -> 0.85
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.85
- coverageBySources: {"code":231,"other":175}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- **`--diff-filter=A --name-only` without `--no-renames` as a closure proxy.** Moves count as additions after the sub-track restructure, so the number measures path churn rather than closed packets. (iteration 2)
- **`git diff --dirstat=files,0` as a summary.** It emitted 21,718 per-directory lines, nearly all rounded to `0.0%`, which conveys no ranking. Aggregating `--numstat` per two-segment path is the readable form. (iteration 2)
- **`git diff --stat` on the early range.** Rename detection over 3,365 commits did not finish inside 150 s. `--no-renames` returned in seconds, so the earlier "quadratic diff" note in strategy §8 is better explained by rename detection than by diff size. This does not change the recommendation — aggregate with `--numstat` rather than emit per-file stats. (iteration 2)
- Counting `implementation-summary.md` paths as a proxy for closed packets. Definitively eliminated: the v4.0.2.1 sub-track restructure makes the measure meaningless at this scale. (iteration 2)
- **Quoting the post-tag `--shortstat` as a measure of change.** 576,916 insertions collapses to roughly 177,000 once the two scratch patches are excluded, and to a few tens of thousands once spec packets are excluded. The raw figure is a scaffolding count. (iteration 3)
- **Re-running iteration 2's reads to satisfy the literal dispatch text.** Both release notes are already read in full and their findings recorded in `iteration-002.md`; a second pass would produce a redundant iteration and no new citations. (iteration 3)
- Treating `specs/hooks-plugins-extensions` post-tag churn as evidence of a shipped hook rewrite. The 1,075 files are research artifacts for a packet that describes the rewrite; the rewrite itself is the 378 files under `.skilled/hooks`. (iteration 3)
- **Re-reading the two release notes to satisfy the literal dispatch text.** Both are already read in full and their findings recorded in `iteration-002.md`; a second pass would produce a redundant iteration and no new citations. Blocked in strategy §9 before this iteration began. (iteration 4)
- **Re-running `git diff --stat` for `v4.0.0.0..v4.0.1.0`.** Blocked by rename detection, and the bounded measurement plus its deleted-archive explanation already sit in the synthesis. (iteration 4)
- Describing `modes` as an object keyed by numeric index. `jq keys` over an array returns `0,1,2,…`, which is indistinguishable from object keys in output; only `jq 'type'` separates the two. Do not carry the object description forward. (iteration 4)
- **Reading all 14 skill READMEs in full to confirm ownership.** Their H2 skeletons plus line counts were sufficient: every one has OVERVIEW / QUICK START / HOW IT WORKS / VERIFICATION, so the ownership question is answered by the skeleton, not the prose. Only `system-spec-kit/README.md` needed its section spans, because it is the one file with COMMANDS and CONFIGURATION sections. (iteration 5)
- **Treating §17 RELATED DOCUMENTS as the navigation answer.** It holds ~20 links but omits nine skill READMEs, so it is a partial index rather than the map. (iteration 5)
- **Using `grep -c` on section names as a duplication measure.** Title-level matching cannot distinguish a section that repeats content from one that links to it; the line-span measurement replaced it. (iteration 5)
- None this iteration. Every action produced usable evidence. (iteration 5)
- **Counting rule ids by grepping quoted uppercase strings under `runtime/cli/rules`.** The directory holds `check-*.sh` entry points plus `.cjs` helpers, and the grep returned 36 loose matches rather than a registry. The "42 rules" claim is therefore recorded as unverified rather than wrong. (iteration 6)
- **Re-deriving the six-versus-eight runtime question from the release notes.** The disk directory listing settles it in one call and is the authoritative source; the release narrative only explains when dsh and Vibe were added, which the rewrite does not need. (iteration 6)
- None. Every action produced usable evidence. (iteration 6)
- **Deriving the runtime mapping from the release notes.** The release narrative explains when DSH and Vibe were added; the adapter directories are the authoritative inventory and were listed directly. (iteration 7)
- **Re-auditing Q4 to satisfy the dispatch's stale next-focus line.** Q4 is ticked in strategy §3 and listed under §6; a second pass would produce redundant findings and no new citations. (iteration 7)
- **Counting rule ids by grepping quoted uppercase strings under `runtime/cli/rules`.** Already blocked in strategy §9 after iteration 6; this iteration confirms the reason from the other side. The directory holds 33 `check-*.sh` entry points plus 10 helpers, and the rule identity lives in a sibling JSON registry, so no grep over that directory can produce a rule count. (iteration 8)
- **Counting rules from `references/validation/validation-rules.md`.** The doc's §2 table documents 16 rules, so it understates the registry by 26. It is a reader's guide to selected rules, not the registry. (iteration 8)
- **Editing `research/research.md` to fold in Q3 and this iteration's verifications.** `progressiveSynthesis` is true in config, but this dispatch's allowed-write list names only `iterations/iteration-008.md` and `deltas/iter-008.jsonl`, so the edit was not executed. Recorded under SCOPE VIOLATIONS for the workflow owner. (iteration 8)
- None. Every action produced usable evidence, and the three unverified claims are now settled. (iteration 8)
- **A broad Q4 re-audit to cover the spelling sentence.** Q4 is answered and a second full pass would repeat iteration 6. Only the one claim Q4 never reached — `README.md:208` — was measured, and it is recorded above as a single correction. (iteration 10)
- **Editing `research.md` to apply §5E–§5G.** `progressiveSynthesis` is true in config, but this dispatch's ALLOWED WRITE PATHS block names only `iterations/iteration-010.md` and `deltas/iter-010.jsonl`. Recorded under SCOPE VIOLATIONS. (iteration 10)
- **Treating iteration 7's hook counts as the whole runtime matrix.** They cover one column of seven; the matrix needed the command surface, its form, its count and its spelling. (iteration 10)
- **Counting registrations as seven without checking the writer.** The count and the writer are different facts, and the README's sentence conflates them; the doctor doc's six-value `--runtime` list is what separates the two. (iteration 11)
- **Editing `research.md` to add a §5I for this iteration's MCP matrix.** `progressiveSynthesis` is true in config, but this dispatch's ALLOWED WRITE PATHS block names only `iterations/iteration-011.md` and `deltas/iter-011.jsonl`. Recorded under SCOPE VIOLATIONS; the material is ready to paste. (iteration 11)
- **Re-running the synthesis-state check a third time.** Iteration 9 measured it and iteration 10 re-confirmed `research.md` unchanged at 172 lines. A third measurement would add no citation, only redundancy. (iteration 11)
- **Reading the eight runtime READMEs in full for MCP statements.** The config files are the authoritative inventory; the READMEs' MCP lines were already reached by grep, and a full read would repeat iteration 7's shape. (iteration 11)
- **Deriving the install path from the release notes.** The manifests and the executed command are authoritative; the release narrative only explains when the doctor family arrived. (iteration 12)
- **Re-running the Node-version audit.** Q4 settled it: `README.md:164` says "Node.js 24" while both packages declare `^22.23.4 || ^24.22.1 || >=26.12.1`. A second pass would repeat iteration 6. (iteration 12)
- **Reading `INSTALL-SKILLED.md` in full.** Its H2 structure plus the four anchors the README links answers the delegation question; the guide's body is install detail the root README is supposed to link, not repeat. (iteration 12)
- **Reading all 35 workflow files to name badge candidates.** The map finding is about root entries; badge selection happens at rewrite time from `.github/workflows/`, which is already listed. (iteration 12)
- **Treating `timeout 45 node ...` as portable.** macOS has no `timeout` binary, so the first advisor run exited 127 for that reason, not because the command was wrong. Retried without the wrapper and it passed. This is a harness portability trap, not a README defect. (iteration 12)
- **A whitespace-collapsing slugger as the anchor oracle.** It produced 7 false "broken anchor" reports on a file whose anchors are all correct. The fix is to reproduce the renderer's rule (one hyphen per space), not to trust a hand-rolled approximation. (iteration 13)
- **Editing `research/research.md`.** `progressiveSynthesis` is true in config, but this dispatch's ALLOWED WRITE PATHS block names only `iterations/iteration-013.md` and `deltas/iter-013.jsonl`. Recorded under SCOPE VIOLATIONS. (iteration 13)
- **Re-counting the validation rules.** Settled in iteration 8 against the registry; this iteration only re-located the four README occurrences. (iteration 13)
- **Re-running the Node-version audit.** Q4 settled it and iteration 12 re-confirmed the block; a second pass would repeat iteration 6. (iteration 13)
- **Reading `INSTALL-SKILLED.md` in full.** Blocked in iteration 12: the guide's H2 structure plus the four verified anchors answer the delegation question. (iteration 13)
- **A broad Q4 re-audit.** Q4 is answered and blocked as a repeat in strategy §9 since iteration 10; this iteration read only the region Q4's spans never reached. (iteration 14)
- **Editing `research/research.md`.** `progressiveSynthesis` is true in config, but this dispatch's ALLOWED WRITE PATHS block names only `iterations/iteration-014.md` and `deltas/iter-014.jsonl`. (iteration 14)
- **Re-counting the 14 templates and the 14 skills.** Settled in iterations 11 and 6; the FAQ only needed their line references confirmed. (iteration 14)
- **Reading `INSTALL-SKILLED.md` in full.** Blocked in iteration 12; the FAQ's install-adjacent answers do not depend on it. (iteration 14)
- **Treating the FAQ as soft prose.** The first framing assumed FAQ answers are explanatory and hard to falsify; four of the ten turned out to have a mechanical oracle (a registration count, a defaults row, file existence, and gate text). The lesson is that a FAQ is a claim surface like any catalog section, not a commentary layer. (iteration 14)
- **A per-mirror `git ls-files` count as the ownership signal for the flat mirrors.** It returns `1` for `.claude/skills`, `.devin/skills`, `.opencode/skills` and `.pi/skills` — not because one file is tracked, but because the tracked path is the *directory symlink itself*. The count was right and its interpretation was wrong; `ls -ld` on the parents is what corrected it. Candidate for reducer promotion: a link-form question needs `ls -ld`, never a file count. (iteration 15)
- **Re-deriving the four flat mirrors' tracking depth from `git status`.** `git status --porcelain .skilled/skills` printed nothing, which reads as "clean" and is actually "ignored". `git ls-files` and `ls -ld` separated the two in one call. (iteration 15)
- **Reading `mode-registry.json` to enumerate mode names for the 41-entry decomposition.** `jq -r '.modes[]? | .name // .id'` returned zero names across all seven registries, the same schema guess that cost iterations 3 and 8 two calls each. The directory listing was already authoritative and settled the decomposition without the registries. (iteration 15)
- **Treating the 15 directories on disk as the skill count.** The README's 14 is right; `local-webflow` is an external symlink. Recorded above as finding 1. (iteration 15)
- **`git ls-files '.skilled/commands/**/*.md'` as the command count.** Returns 89 because the pathspec recurses into reference folders. (iteration 16)
- **`ls .skilled/commands/**/*.md` without `globstar`.** It expands `**` as a single `*`, so it returned the correct 44 depth-2 command files while saying nothing about the 45 deeper markdown files. The number was right for the wrong reason. (iteration 16)
- **A broad Q4 re-audit.** Blocked in strategy §9 since iteration 10; this iteration read only the four README regions its findings cite. (iteration 16)
- **An independent re-count of the 14 skills and 14 templates.** Blocked in iterations 6, 11 and 14. The skill count here came from the git index during the tracking check, which is the evidence that resolves the §5D collision; it is not a second count of the catalog. (iteration 16)
- **`git ls-files .skilled/commands | awk -F/ 'NF==3'` as the depth-2 count.** Returns 1 (`README.txt`) because group command documents sit at `NF==4`. The band was one level off; the `NF==4` pass produced the 49 that reconciles to 44. (iteration 17)
- **A broad Q4 re-audit.** Blocked in strategy §9 since iteration 10; this iteration read only the README regions its findings cite plus the heading list. (iteration 17)
- **An independent re-count of the 14 skills and 14 templates.** Blocked in iterations 6, 11 and 14, and untouched here. (iteration 17)
- **Deriving the command count from a recursive markdown glob.** `git ls-files '.skilled/commands/*/*.md'` returns 89 because the pathspec crosses slashes into depth-7 fixtures; the depth band has to be applied before the count means anything. (iteration 17)
- **Treating `prompt` as a utility rather than a group.** The README's taxonomy implies it, the disk contradicts it — `prompt/improve.md` is a group file. This is the root cause of the 43 + 2 partition, and it is now recorded rather than repeated. (iteration 17)
- **`NF==3` as the command depth band.** Returns 1 (`README.txt`) because group command documents sit at `NF==4`. (iteration 18)
- **A broad Q4 re-audit.** Blocked in strategy §9 since iteration 10; this iteration measured only claims with no prior oracle. (iteration 18)
- **Counting rules from `references/validation/validation-rules.md`.** The doc's §2 table documents 16 rules, so it understates the registry by 26. It is a reader's guide, not the registry. (Established in iteration 8; re-confirmed here as the reason the registry is the oracle.) (iteration 18)
- **Deriving the command count from a recursive markdown glob.** Blocked in iterations 16-17; the depth band has to be applied before the count means anything. (iteration 18)
- **Grepping `runtime/cli/rules` for quoted uppercase rule ids.** Returns loose matches over `check-*.sh` entry points and `.cjs` helpers, not a rule count. This is the dead end that left "42 rules" unverified since iteration 6. (iteration 18)
- **Reading `INSTALL-SKILLED.md` in full.** Blocked in iteration 12; nothing in this iteration's claim set depends on it. (iteration 18)
- **`git ls-files .skilled/commands | awk -F/ 'NF==3'` as the command count.** Same class: returns 1 because group documents are four segments. (iteration 19)
- **`git ls-files .skilled/skills | awk -F/ 'NF==3'` as the skill count.** Returns 1 (`README.txt`) because tracked skill files sit at `NF==4`. This is the fourth `NF` band slip of the run; the band has to be stated against a declared base before a count means anything. (iteration 19)
- **`ls -ld .skilled/skills/*/` as the link-form oracle.** The trailing slash dereferences symlinks, so it reports all 15 entries as directories and reproduces the F1 error. `git check-ignore` or `ls -ld` without the slash is the oracle. (iteration 19)
- **A broad Q4 re-audit.** Blocked in strategy §9 since iteration 10; this iteration read only the synthesis and the README lines it anchors. (iteration 19)
- **An independent re-count of the 14 skills and 14 templates.** Blocked in iterations 6, 11 and 14. The 14 here comes from the git index as the oracle for a synthesis row, not as a new catalog count. (iteration 19)
- **Editing `research.md` to fold the corrections.** `progressiveSynthesis` is true in config, but this dispatch's ALLOWED WRITE PATHS names only `iterations/iteration-019.md` and `deltas/iter-019.jsonl`. Recorded under SCOPE VIOLATIONS. (iteration 19)
- **`ls -1A <runtime-dir> | wc -l` as a runtime-support oracle.** It reports shallow folder layout (8-21 entries) and says nothing about whether the runtime's adapters ship. The tracked-file count and the `runtimeFolders` manifest are the oracles. (iteration 20)
- **A broad Q4 re-audit.** Blocked in strategy §9 since iteration 10; this iteration read only the runtime claim set. (iteration 20)
- **Editing `research.md` to fold the roster correction.** Outside this dispatch's allowed write paths; recorded under SCOPE VIOLATIONS. (iteration 20)
- **Listing Hermes as a supported runtime.** `.hermes` is absent and the CLI mode was removed in `cli-external-orchestration` v2.0.0.0. (iteration 20)
- **Searching the current README for a Hermes claim to correct.** There is none; the only trace of Hermes is historical changelog prose and the strategy question text. The correction belongs in the brief, not in a README claim row. (iteration 20)
- **Treating `README.md:16`'s six-name list as the current roster.** It omits DSH and Mistral Vibe, both shipped and tracked (148 and 203 files). (iteration 20)
- **Using top-level directory entry counts as a support measure.** `.dsh` has 8 entries and 148 tracked files, `.vibe` 8 entries and 203 tracked files; entry count measures layout, not support. (iteration 20)

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
