# Iteration 4: Usefulness Evidence

## Focus

Angle 4 of 10: assess what the quality gate catches, costs, and misses from benchmark reports, playbook scenarios, changelog entries, and checker behavior. The dispatch matches the frozen angle order, while the machine-owned Next Focus still points to the final no-relaxation and proof question; that conflict is recorded below.

## Actions Taken

1. Read the run config, state log, strategy, registry, and iteration 1–3 narratives before selecting the focus; no direction was marked exhausted.
2. Compared the saved live and router benchmark summaries, including scenario class, score, and unscored usefulness signals.
3. Read the manual playbook contract and its quality-gate scenario steps and evidence requirements.
4. Inspected the comment-hygiene, distribution-staleness, and ceiling-report checker contracts, then cross-checked changelog entries describing corrected gaps.
5. Kept the work local and read-only outside this iteration’s two output files; no benchmark or checker was run.

## Findings

- **DERIVED: The saved benchmark evidence establishes routing, not the quality gate’s defect catch rate or runtime cost. The live report scores one text-executor scenario; CQ-001 is a routing case, while D4 usefulness and its task-outcome signal are unscored. Catch rate, miss rate, and elapsed gate cost remain UNKNOWN; a future timed run with clean and deliberately failing changed-file cases would resolve them. [SOURCE: .skilled/skills/sk-code/sk-code-quality/benchmark/reports/2026-07-10--live-mode-b--live/skill-benchmark-report.md:9] `Scored (text executors): 1` [SOURCE: .skilled/skills/sk-code/sk-code-quality/benchmark/reports/2026-07-10--live-mode-b--live/skill-benchmark-report.md:20] `D4 usefulness | 25pts | _unscored-mode-a_` [SOURCE: .skilled/skills/sk-code/sk-code-quality/benchmark/reports/2026-07-10--live-mode-b--live/skill-benchmark-report.md:27] `unscored (run --d4 in live mode)` [SOURCE: .skilled/skills/sk-code/sk-code-quality/benchmark/reports/2026-07-10--live-mode-b--live/skill-benchmark-report.md:42] `CQ-001 | routing | 100/100 | passed`**

- **DERIVED: The playbook can catch routing or resource-map drift, but it does not measure quality-check behavior. Its sole scenario passes when expected resource paths exist and the frontmatter intent matches QUALITY; its evidence is a transcript, frontmatter, and router excerpt, with no violating code fixture or P0/P1/P2 outcome. [SOURCE: .skilled/skills/sk-code/sk-code-quality/manual-testing-playbook/manual-testing-playbook.md:19] `Totals: 1 scenario, 1 category.` [SOURCE: .skilled/skills/sk-code/sk-code-quality/manual-testing-playbook/manual-testing-playbook.md:29] `PASS when every path in expected_resources resolves` [SOURCE: .skilled/skills/sk-code/sk-code-quality/manual-testing-playbook/quality-gate/quality-checklist.md:72] `Commands` [SOURCE: .skilled/skills/sk-code/sk-code-quality/manual-testing-playbook/quality-gate/quality-checklist.md:84] `Command transcript from steps 1-3`**

- **OBSERVED: The changelog records concrete misses later corrected: the dist switch reader mishandled inline comments and a UTF-8 BOM; quality documentation pointed to two hooks that were not installed; and Obsidian targets reached the gate without a checklist. These are documented examples of configuration, enforcement, and surface-coverage gaps, though they do not quantify recurrence. [SOURCE: .skilled/skills/sk-code/sk-code-quality/changelog/v1.0.1.0.md:23] `used to read as 1  # note and leave the check on` [SOURCE: .skilled/skills/sk-code/sk-code-quality/changelog/v1.1.1.0.md:16] `Neither is installed.` [SOURCE: .skilled/skills/sk-code/sk-code-quality/changelog/v1.2.0.0.md:16] `reached the gate with nothing to load`**

- **DERIVED: Automated coverage is scoped and uneven. Comment hygiene checks explicit files for supported extensions, skips excluded or unknown inputs, and returns 2 when every input was skipped; dist freshness checks the owning package per edited file, offers --all for broader coverage, and always exits 0 while printing warnings. The optional ceiling report scans tracked code when called without paths but exits 0 regardless of findings. Thus a skipped comment check must not be read as clean, and the ceiling report is an on-demand debt inventory rather than routine gate work. Measured runtime and operator time remain UNKNOWN. [SOURCE: .skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh:5] `check-comment-hygiene.sh <file> [<file>...]` [SOURCE: .skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh:10] `2 — every file was skipped` [SOURCE: .skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh:48] `Unknown extension — skip silently` [SOURCE: .skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh:224] `sys.exit(0 if 0 in codes else 2)` [SOURCE: .skilled/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh:9] `Always exits 0.` [SOURCE: .skilled/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh:13] `default (single-file) mode is intentionally edited-file-scoped` [SOURCE: .skilled/skills/sk-code/sk-code-quality/SKILL.md:91] `exits 0 because it reports and does not gate`**

- **OBSERVED: The dispatched focus is Angle 4, matching the frozen angle order, while the reducer-owned Next Focus still points to the final no-relaxation and proof question. I followed the supplied Angle 4 focus and recommend Angle 5, handoff to verify and debug, next. [SOURCE: specs/sk-code/014-code-modes-research/001-quality-mode-research/research/deep-research-strategy.md:130] `Which behaviors may no recommendation relax` [SOURCE: specs/sk-code/014-code-modes-research/001-quality-mode-research/research/deep-research-strategy.md:156] `4 | Usefulness evidence` [SOURCE: specs/sk-code/014-code-modes-research/001-quality-mode-research/research/deep-research-strategy.md:157] `5 | Handoff to verify and debug`**

## Questions Answered

What does the quality gate catch, cost and miss, judged from its own benchmark reports, playbook scenarios, changelog entries and checker scripts?

**DERIVED:** The documented gate applies the author-side P0/P1/P2 and target checklists, per-file comment hygiene, and conditional distribution-staleness checks. Current benchmark and playbook evidence validates routing and resource availability rather than defect detection. Changelogs expose past enforcement and surface-coverage misses. Actual catch rates, false-negative rates, elapsed runtime, and operator time remain UNKNOWN.

## Questions Remaining

- How should sk-code-quality hand off to verify, debug and sk-code-review, and where should the boundary between the quality and review checklists sit?
- How should a surface packet or a user-authored workflow or surface mode plug into sk-code-quality, and where could a repository keep its own quality configuration without forking the hub?
- Which behaviors may no recommendation relax, and how would a later change to sk-code-quality be proven through both routing stages?

## Next Focus

Angle 5 of 10: handoff to verify and debug, following the frozen angle order. [SOURCE: specs/sk-code/014-code-modes-research/001-quality-mode-research/research/deep-research-strategy.md:157] `5 | Handoff to verify and debug`

## Reflection

newInfoRatio is 0.60: two findings add new evidence (the limits of the saved benchmark and documented changelog misses), two extend earlier playbook/checker work, and one repeats the focus-order conflict already seen in prior iterations. No simplicity bonus was claimed. The answer is bounded by the inspected artifacts; measuring actual quality false negatives and elapsed cost needs a future timed fixture with positive and negative changed-file cases.
