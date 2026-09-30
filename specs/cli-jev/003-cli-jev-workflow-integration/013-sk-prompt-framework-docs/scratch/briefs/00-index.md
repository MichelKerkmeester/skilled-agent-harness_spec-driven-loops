# Build index: sk-prompt framework docs

Run every command from the worktree root unless a row names another directory. `S=.skilled/skills/sk-prompt`. Executor `pi` means `llmgateway/deepseek-v4.1-flash`, thinking `max`. Briefs 02 and 03 edit the same file, so run them one after the other. Briefs 01 and 04 touch other files and may run in parallel with 02.

| Order | Brief | Change | Executor, effort | Depends on | Files touched | Orchestrator verification | Expected result |
|-------|-------|--------|------------------|------------|---------------|---------------------------|-----------------|
| 0 | ORCHESTRATOR | Concurrent-access recheck (spec edge case, T001) before the first brief. Record the build-start `git rev-parse --short HEAD` as the new AC-007 base | orchestrator | none | none | `git status --short -- $S .hermes/skills/sk-prompt` and `git log -5 --format='%h %ad %s' --date=short -- $S $S/SKILL.md $S/assets/framework-registry.json` | Status prints nothing. Newest skill commit is `094cdb9f8a` (changelog metadata only). No commit after `86e99e7fc1` touches `SKILL.md`, none after `ec33385ae5` touches the registry. Anything newer: reread the moved lines before dispatch |
| 1 | ORCHESTRATOR | Baseline (T002, T003): plan section 5 commands, the sweep test and the Hermes mirror check, recorded in `implementation-summary.md` | orchestrator | 0 | `implementation-summary.md` | plan.md section 5 block with `PYTHONDONTWRITEBYTECODE=1`, the sweep test below, `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check` | 23081, 36580, 3066, 3950, 2670, 538, `rcaf,race,cidi,tidd-ec,costar false false`, VALID, `Skill is valid!`, `GUARD PASS`, sweep exit 0 (first recorded run), `PASS: 71 Hermes skill copies in sync` (seen 2026-09-27) |
| 2 | `01-registry-description.md` | Registry `description` names the five scaffolds, CRISPE and CRAFT without one, and `patterns-evaluation.md` as the source | pi, max | 1 | `$S/assets/framework-registry.json` | `node -p` of AC-001, then `git diff --numstat -- $S/assets/framework-registry.json` | `rcaf,race,cidi,tidd-ec,costar true true`, numstat `1 1` |
| 3 | `02-skill-section-read-rule.md` | Section-read rule under Resource Loading Levels plus the amended agent-rules bullet | pi, max | 1 | `$S/SKILL.md` | `grep -c 'FRAMEWORK DEEP DIVES' $S/SKILL.md`, same for `CLEAR EVALUATION MASTERY` and `'"all frameworks"'`, `wc -c < $S/SKILL.md`, `git diff --numstat -- $S/SKILL.md` | 2, 2, 1, 23893, `9 1` |
| 4 | `03-skill-version-bump.md` | `SKILL.md` frontmatter `version` 3.0.1.0 to 3.0.2.0, matching the new changelog | pi, max | 3 | `$S/SKILL.md` | `sed -n 5p $S/SKILL.md`, `wc -c < $S/SKILL.md`, `git diff --numstat -- $S/SKILL.md` | `version: 3.0.2.0`, 23893, `10 2` |
| 5 | `04-changelog-v3020.md` | New owner changelog entry `v3.0.2.0.md` for both changes | pi, max | 1 | `$S/changelog/v3.0.2.0.md` (new) | `git status --short -- $S/changelog`, `head -11 $S/changelog/v3.0.2.0.md` | One `??` line for `v3.0.2.0.md`, frontmatter with the three trigger phrases |
| 6 | ORCHESTRATOR | Regenerate the Hermes mirror of `SKILL.md` (generated copy, not in D3's file list: record as a deviation) | orchestrator | 3, 4 | `.hermes/skills/sk-prompt/SKILL.md` | `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs`, then the same with `--check`, then `git status --short -- .hermes/skills` | `PASS`, and the only new `.hermes` change is `sk-prompt/SKILL.md` (`cli-devin/SKILL.md` was already modified before this phase) |
| 7 | ORCHESTRATOR | Verify and measure (T009 to T013): AC-002 greps, `sed` range counts, scope diff | orchestrator | 2 to 6 | `implementation-summary.md` | AC-002 commands, plan section 5 `sed` counts, `git status --short -- $S` | 2 and 4; 3066, 3950, 2670, 538 unchanged; `SKILL.md` 23893 (at most 24000); exactly `M SKILL.md`, `M assets/framework-registry.json`, `?? changelog/v3.0.2.0.md` |
| 8 | ORCHESTRATOR | Phase docs (T014): tasks ticks, acceptance evidence, implementation-summary, goal log, the parent `../changelog/` refresh named in spec Phase Context | orchestrator | 7 | phase docs, `../changelog/` | phase-close gates below | all pass |

## Phase-close gates (orchestrator)

Run from the worktree root, with `PYTHONDONTWRITEBYTECODE=1` exported:

1. `python3 .skilled/skills/sk-doc/scripts/validate_document.py .skilled/skills/sk-prompt/SKILL.md` prints `VALID`, exit 0. The same content, simulated in the scratchpad before these briefs were written, printed `VALID`, 0 issues.
2. `python3 .skilled/skills/sk-doc/scripts/quick_validate.py .skilled/skills/sk-prompt` prints `Skill is valid!`, exit 0. If phase 012 has landed by then (it was `Planned` on 2026-09-27), note it.
3. `bash .skilled/skills/system-skill-advisor/runtime/scripts/check-prompt-quality-card-sync.sh .` prints `GUARD PASS`, exit 0.
4. From `.skilled/skills/system-deep-loop/deep-improvement/scripts` (its `vitest.config.mjs` lives there): `npx vitest run model-benchmark/tests/sweep-foundation.vitest.ts`, exit 0.
5. `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check` prints `PASS`, exit 0.
6. `git diff --name-only <build-start HEAD>..HEAD -- .skilled/skills/sk-prompt` after the build commit lists exactly `SKILL.md`, `assets/framework-registry.json` and `changelog/v3.0.2.0.md`.
7. `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/cli-jev/003-cli-jev-workflow-integration/013-sk-prompt-framework-docs --strict` prints `RESULT: PASSED`.
8. `node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs specs/cli-jev/003-cli-jev-workflow-integration/013-sk-prompt-framework-docs` exits 0.

## Premises that no longer match (checked 2026-09-27 at `6f47c32dce`)

- `acceptance-criteria.md:65` (AC-007) and `goal.md:89` diff from `00480a8d5c`. The main merge brought in `094cdb9f8a`, which added search metadata to 15 sk-prompt changelog files, so that diff already prints 15 files before any build edit. Move the base to the build-start HEAD (row 0). `goal.md:89` is in the durable slice, so the change is an amendment and the chat slice must be resent.
- `tasks.md:37` (T001) and `spec.md:145` expect no sk-prompt commit after `ee5852eae6`. `094cdb9f8a` is one, but it touches only `changelog/*.md` and neither edited file. Harmless. The recheck stays.
- `spec.md` Files to Change and goal D3 list three sk-prompt files. `.hermes/skills/sk-prompt/SKILL.md` is a generated mirror (`sync-skills-hermes.cjs`) that both earlier `SKILL.md` commits (`239bc805db`, `86e99e7fc1`) updated alongside the source. Row 6 regenerates it. Record it as a deviation.
- The spec does not mention the `SKILL.md` frontmatter `version`. The owner's last release (`239bc805db`) bumped it from 3.0.0.0 to 3.0.1.0 when it created that changelog file, and sk-create-changelog's bump table makes a docs change a patch, so v3.0.2.0. Brief 03 applies it. Drop brief 03 if you read the convention differently: it is independent of the other three.
- Every other cited location still holds: `SKILL.md` lines 3, 12, 38, 91, 98, 146, 313, 315, 355-356, 459, 461; `prompt-improver.md:181`; `sweep-benchmark.cjs:45-48`; `sweep-foundation.vitest.ts:37,43-45`; `README.md:214,216`; all byte counts in plan.md section 5.
- The rule text adds 812 bytes to `SKILL.md` (23,081 to 23,893), inside NFR-P02's 919-byte allowance. The rule deliberately does not quote the `"all frameworks"` keyword in double quotes, because AC-004 pins that grep at exactly 1.

## Out of scope, per the dispatch

`references/depth-framework.md` is not trimmed and `SWEEP.md` is not touched (the spec's two open questions).
