# Iteration 3: Checker Portability

## Focus

Angle 3 of 10 examines what each standalone checker needs from a host repository and where repository-specific settings can live. The supplied dispatch fixes this focus. The strategy's Next Focus names the no-relaxation and proof question, while its frozen angle order assigns checker portability to iteration 3. I followed the dispatch and recorded the mismatch below. [SOURCE: specs/sk-code/014-code-modes-research/001-quality-mode-research/research/deep-research-strategy.md:130] [SOURCE: specs/sk-code/014-code-modes-research/001-quality-mode-research/research/deep-research-strategy.md:155]

## Actions Taken

1. Read the current config, state log, strategy, findings registry and prior iteration notes before selecting the focus.
2. Read all three checker scripts, the dist-freshness helper, and the relevant script and hook configuration documentation.
3. Used local sources only. I did not run the checkers or tests, so the runtime requirements below are derived from the inspected code paths.

## Findings

1. **DERIVED — Comment hygiene inputs:** The checker is a Python 3 program that takes one or more explicit file paths and opens those files directly. It does not discover a repository root. It handles TS, TSX, JS, MJS, CJS, Python, shell and JSONC files. It skips dist, node_modules, .git, .vitest.js and unknown extensions. If every input is skipped, it exits 2, which means no file was checked rather than a clean pass. [SOURCE: .skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh:5] [SOURCE: .skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh:24] [SOURCE: .skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh:35] [SOURCE: .skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh:215]

2. **DERIVED — Dist freshness prerequisites:** The wrapper needs Python 3, Node and the fixed helper at .skilled/skills/system-spec-kit/runtime/cli/lib/dist-freshness.cjs. It looks for that helper under the current directory, then derives a repository root from its own script path. The helper has a fixed registry of packages under .skilled. It considers a package provisioned only when package.json and node_modules exist. Without them, freshness cannot be assessed or rebuilt. [SOURCE: .skilled/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh:74] [SOURCE: .skilled/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh:85] [SOURCE: .skilled/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh:100] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/dist-freshness.cjs:36] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/dist-freshness.cjs:173] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/dist-freshness.cjs:182]

3. **DERIVED — Ceiling report discovery:** With no arguments, the report uses Git to locate the checkout from the script path and enumerate tracked files. With explicit file arguments, it bypasses Git discovery and tracked-file filtering, but every path must exist and must not be a directory. [SOURCE: .skilled/skills/sk-code/sk-code-quality/scripts/ceiling-report.sh:5] [SOURCE: .skilled/skills/sk-code/sk-code-quality/scripts/ceiling-report.sh:150] [SOURCE: .skilled/skills/sk-code/sk-code-quality/scripts/ceiling-report.sh:163] [SOURCE: .skilled/skills/sk-code/sk-code-quality/scripts/ceiling-report.sh:187]

4. **DERIVED — Existing settings seam:** Of these three checkers, dist freshness is the only one with a settings-file reader. HOOK_FLAGS_CONFIG selects that file. Otherwise the checker looks for .skilled/hooks/hook-flags.env. Environment values override file values, and file-read errors produce an empty config. The hook README says the default file is gitignored and copied from hook-flags.env.example. [SOURCE: .skilled/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh:28] [SOURCE: .skilled/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh:57] [SOURCE: .skilled/hooks/post-edit-quality/README.md:109] [SOURCE: .skilled/hooks/post-edit-quality/README.md:119]

5. **INFERRED — Shared repository policy:** A repository can keep the existing dist hook switches in .skilled/hooks/hook-flags.env when it uses this hub, or point HOOK_FLAGS_CONFIG at a repository-owned file. That setting does not configure comment-hygiene rules or ceiling-report policy. A shared repo-local quality policy therefore needs a configuration path that all intended checkers consume. A fixture repository without .skilled, exercised with explicit-file inputs, would confirm how much standalone behavior works outside the hub layout. [INFERENCE: the config reader exists only in the dist checker, while the other two expose file arguments but no settings reader] [SOURCE: .skilled/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh:28] [SOURCE: .skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh:5] [SOURCE: .skilled/skills/sk-code/sk-code-quality/scripts/ceiling-report.sh:5]

6. **DERIVED — Focus mismatch:** The strategy's Next Focus names the no-relaxation and proof question, while its frozen angle order assigns checker portability to iteration 3. The supplied dispatch agrees with the frozen order, so this iteration followed Angle 3 and records the mismatch. [SOURCE: specs/sk-code/014-code-modes-research/001-quality-mode-research/research/deep-research-strategy.md:130] [SOURCE: specs/sk-code/014-code-modes-research/001-quality-mode-research/research/deep-research-strategy.md:155]

## Questions Answered

The dispatched checker-portability sub-question is answered: the three checkers have different host prerequisites, and only dist freshness currently reads a settings file. No complete strategy key question is closed in this iteration, so the canonical answeredQuestions list is empty.

## Questions Remaining

- What does the quality gate catch, cost and miss, judged from its own benchmark reports, playbook scenarios, changelog entries and checker scripts? [SOURCE: specs/sk-code/014-code-modes-research/001-quality-mode-research/research/deep-research-strategy.md:39]
- How should sk-code-quality hand off to verify, debug and sk-code-review, and where should the boundary between the quality and review checklists sit? [SOURCE: specs/sk-code/014-code-modes-research/001-quality-mode-research/research/deep-research-strategy.md:40]
- How should a surface packet or a user-authored workflow or surface mode plug into sk-code-quality, and where could a repository keep its own quality configuration without forking the hub? [SOURCE: specs/sk-code/014-code-modes-research/001-quality-mode-research/research/deep-research-strategy.md:41]
- Which behaviors may no recommendation relax, and how would a later change to sk-code-quality be proven through both routing stages? [SOURCE: specs/sk-code/014-code-modes-research/001-quality-mode-research/research/deep-research-strategy.md:42]

## Next Focus

Angle 4: usefulness evidence across the benchmark reports, playbook scenarios, changelog entries and checkers. The open catch, cost and miss question is the direct next target. [SOURCE: specs/sk-code/014-code-modes-research/001-quality-mode-research/research/deep-research-strategy.md:39] [SOURCE: specs/sk-code/014-code-modes-research/001-quality-mode-research/research/deep-research-strategy.md:157]

## Sources Consulted

- .skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh
- .skilled/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh
- .skilled/skills/sk-code/sk-code-quality/scripts/ceiling-report.sh
- .skilled/skills/system-spec-kit/runtime/cli/lib/dist-freshness.cjs
- .skilled/hooks/post-edit-quality/README.md
- specs/sk-code/014-code-modes-research/001-quality-mode-research/research/deep-research-strategy.md
- specs/sk-code/014-code-modes-research/001-quality-mode-research/research/iterations/iteration-001.md
- specs/sk-code/014-code-modes-research/001-quality-mode-research/research/iterations/iteration-002.md

## Assessment

- New information ratio: 0.60.
- Questions answered: the dispatched checker-portability sub-question.
- Strategy key questions answered: none.

## Reflection

The source reads clarified where the checkers depend on Git, Node and the hub's package layout. A fixture repository without .skilled would be needed to confirm the runtime behavior outside this checkout. No checker or test was run in this iteration.
