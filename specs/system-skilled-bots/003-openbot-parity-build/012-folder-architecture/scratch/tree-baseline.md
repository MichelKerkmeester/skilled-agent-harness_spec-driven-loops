# Tree baseline

BASE: 1937abca82319d1e985992709464c54300894ca6

This record measures the tree the phase opened on. Every number below comes from a command run at that commit. Each command is listed so a later reader can rerun it. The draft this replaces is `scratch/draft-tree-measure.md`, which measured an earlier commit and is not a baseline.

## How each column was measured

Every command ran from the repository root at 1937abca823. `<root>` is the row's path.

```bash
git ls-files -- <root> | wc -l
git ls-files -- <root> | xargs -n1 dirname | sort -u | wc -l
git ls-files -- <root> | xargs -n1 dirname | sort | uniq -c | awk '$1==1' | wc -l
git ls-files -- <root> | awk -F/ '{print NF"\t"$0}' | sort -n | tail -1
```

A folder counts when it holds a tracked file directly. A folder that holds one file plus subfolders counts as a one-file folder, so `benchmark/`, `feature-catalog/`, `manual-testing-playbook/` and `scripts/fixtures/` each count once for their own index or README. Depth is the number of path parts, the file name included. The last row is a set of six files rather than a folder, so its four measures were taken over that file list.

## Measures

| Root | Files | Folders | One-file folders | Depth | Deepest path |
|------|-------|---------|------------------|-------|--------------|
| `.skilled/skills/system-skilled-bots` | 402 | 161 | 123 | 9 | `.skilled/skills/system-skilled-bots/scripts/fixtures/worktree-shared-paths-unresolved/bots/nightly-digest/BOT.md` |
| `.skilled/skills/system-skilled-bots/assets` | 1 | 1 | 1 | 5 | `.skilled/skills/system-skilled-bots/assets/bot-template.txt` |
| `.skilled/skills/system-skilled-bots/benchmark` | 5 | 3 | 2 | 7 | `.skilled/skills/system-skilled-bots/benchmark/reports/2026-11-26--manual-testing-playbook--openbot-parity/source.md` |
| `.skilled/skills/system-skilled-bots/bots-author` | 5 | 3 | 2 | 6 | `.skilled/skills/system-skilled-bots/bots-author/references/bot-definition.md` |
| `.skilled/skills/system-skilled-bots/bots-run` | 7 | 3 | 1 | 6 | `.skilled/skills/system-skilled-bots/bots-run/references/run-queue-and-answer.md` |
| `.skilled/skills/system-skilled-bots/bots-schedule` | 5 | 3 | 2 | 6 | `.skilled/skills/system-skilled-bots/bots-schedule/references/schedule-lifecycle.md` |
| `.skilled/skills/system-skilled-bots/bots-status` | 5 | 3 | 2 | 6 | `.skilled/skills/system-skilled-bots/bots-status/references/status-and-inbox.md` |
| `.skilled/skills/system-skilled-bots/changelog` | 1 | 1 | 1 | 5 | `.skilled/skills/system-skilled-bots/changelog/v1.0.0.0.md` |
| `.skilled/skills/system-skilled-bots/feature-catalog` | 24 | 9 | 2 | 6 | `.skilled/skills/system-skilled-bots/feature-catalog/status/status-index.md` |
| `.skilled/skills/system-skilled-bots/manual-testing-playbook` | 59 | 18 | 2 | 6 | `.skilled/skills/system-skilled-bots/manual-testing-playbook/worktree-and-delivery/worktree-run-cleans-up.md` |
| `.skilled/skills/system-skilled-bots/runtime` | 186 | 23 | 16 | 9 | `.skilled/skills/system-skilled-bots/runtime/tests/fixtures/bots/worktree-slow/BOT.md` |
| `.skilled/skills/system-skilled-bots/scripts` | 93 | 92 | 91 | 9 | `.skilled/skills/system-skilled-bots/scripts/fixtures/worktree-shared-paths-unresolved/bots/nightly-digest/BOT.md` |
| `.skilled/skills/system-skilled-bots/shared` | 1 | 1 | 1 | 5 | `.skilled/skills/system-skilled-bots/shared/README.md` |
| `.skilled/crates/bots-tui` | 74 | 11 | 1 | 7 | `.skilled/crates/bots-tui/tests/fixtures/payloads/status.json` |
| `.skilled/bin/bots.cjs` | 1 | 1 | 1 | 3 | `.skilled/bin/bots.cjs` |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts` | 1 | 1 | 1 | 7 | `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts` |
| `.skilled/skills/system-deep-loop/runtime/tests/**executor-audit*` | 6 | 2 | 0 | 7 | `.skilled/skills/system-deep-loop/runtime/tests/unit/executor-audit.vitest.ts` |

The skill holds 402 files across 161 folders. Of those folders 123 hold exactly one file. Its ten root-level files sit in the skill root folder, which the skill row counts once. The `scripts` row carries 91 of the skill's 123 one-file folders on its own.

## One-file folders under the skill

The command below prints the folders that hold exactly one tracked file.

```bash
git ls-files .skilled/skills/system-skilled-bots | xargs -n1 dirname | sort | uniq -c | awk '$1==1{print $2}'
```

Its output is 123 lines.

```text
.skilled/skills/system-skilled-bots/assets
.skilled/skills/system-skilled-bots/benchmark
.skilled/skills/system-skilled-bots/benchmark/reports
.skilled/skills/system-skilled-bots/bots-author/changelog
.skilled/skills/system-skilled-bots/bots-author/references
.skilled/skills/system-skilled-bots/bots-run/changelog
.skilled/skills/system-skilled-bots/bots-schedule/changelog
.skilled/skills/system-skilled-bots/bots-schedule/references
.skilled/skills/system-skilled-bots/bots-status/changelog
.skilled/skills/system-skilled-bots/bots-status/references
.skilled/skills/system-skilled-bots/changelog
.skilled/skills/system-skilled-bots/feature-catalog
.skilled/skills/system-skilled-bots/feature-catalog/hub-routing
.skilled/skills/system-skilled-bots/manual-testing-playbook
.skilled/skills/system-skilled-bots/manual-testing-playbook/channels
.skilled/skills/system-skilled-bots/runtime/tests/fixtures/bots/claude-decision
.skilled/skills/system-skilled-bots/runtime/tests/fixtures/bots/claude-ok
.skilled/skills/system-skilled-bots/runtime/tests/fixtures/bots/crash
.skilled/skills/system-skilled-bots/runtime/tests/fixtures/bots/decide-empty
.skilled/skills/system-skilled-bots/runtime/tests/fixtures/bots/failing-precheck
.skilled/skills/system-skilled-bots/runtime/tests/fixtures/bots/manual-ok
.skilled/skills/system-skilled-bots/runtime/tests/fixtures/bots/needs-decision
.skilled/skills/system-skilled-bots/runtime/tests/fixtures/bots/over-budget
.skilled/skills/system-skilled-bots/runtime/tests/fixtures/bots/silent-precheck
.skilled/skills/system-skilled-bots/runtime/tests/fixtures/bots/slow
.skilled/skills/system-skilled-bots/runtime/tests/fixtures/bots/stuck
.skilled/skills/system-skilled-bots/runtime/tests/fixtures/bots/tamper
.skilled/skills/system-skilled-bots/runtime/tests/fixtures/bots/weak-write
.skilled/skills/system-skilled-bots/runtime/tests/fixtures/bots/worktree-posture
.skilled/skills/system-skilled-bots/runtime/tests/fixtures/bots/worktree-slow
.skilled/skills/system-skilled-bots/runtime/tests/fixtures/osascript-stub
.skilled/skills/system-skilled-bots/scripts/fixtures
.skilled/skills/system-skilled-bots/scripts/fixtures/apps-unknown-server
.skilled/skills/system-skilled-bots/scripts/fixtures/apps-unknown-server/bots
.skilled/skills/system-skilled-bots/scripts/fixtures/apps-unknown-server/bots/nightly-digest
.skilled/skills/system-skilled-bots/scripts/fixtures/bad-budget/bots
.skilled/skills/system-skilled-bots/scripts/fixtures/bad-budget/bots/nightly-digest
.skilled/skills/system-skilled-bots/scripts/fixtures/clean/bots
.skilled/skills/system-skilled-bots/scripts/fixtures/clean/bots/nightly-digest
.skilled/skills/system-skilled-bots/scripts/fixtures/cron-untranslatable/bots
.skilled/skills/system-skilled-bots/scripts/fixtures/cron-untranslatable/bots/nightly-digest
.skilled/skills/system-skilled-bots/scripts/fixtures/delivery-channel-unknown/bots
.skilled/skills/system-skilled-bots/scripts/fixtures/delivery-channel-unknown/bots/nightly-digest
.skilled/skills/system-skilled-bots/scripts/fixtures/duplicate-id/bots
.skilled/skills/system-skilled-bots/scripts/fixtures/duplicate-id/bots/nightly-digest
.skilled/skills/system-skilled-bots/scripts/fixtures/duplicate-id/bots/nightly-digest-copy
.skilled/skills/system-skilled-bots/scripts/fixtures/empty-body/bots
.skilled/skills/system-skilled-bots/scripts/fixtures/empty-body/bots/nightly-digest
.skilled/skills/system-skilled-bots/scripts/fixtures/executor-kind-native/bots
.skilled/skills/system-skilled-bots/scripts/fixtures/executor-kind-native/bots/nightly-digest
.skilled/skills/system-skilled-bots/scripts/fixtures/identity-invalid/bots
.skilled/skills/system-skilled-bots/scripts/fixtures/identity-invalid/bots/nightly-digest
.skilled/skills/system-skilled-bots/scripts/fixtures/isolation-invalid/bots
.skilled/skills/system-skilled-bots/scripts/fixtures/isolation-invalid/bots/nightly-digest
.skilled/skills/system-skilled-bots/scripts/fixtures/isolation-undeclared/bots
.skilled/skills/system-skilled-bots/scripts/fixtures/isolation-undeclared/bots/nightly-digest
.skilled/skills/system-skilled-bots/scripts/fixtures/missing-id/bots
.skilled/skills/system-skilled-bots/scripts/fixtures/missing-id/bots/nightly-digest
.skilled/skills/system-skilled-bots/scripts/fixtures/missing-trigger/bots
.skilled/skills/system-skilled-bots/scripts/fixtures/missing-trigger/bots/nightly-digest
.skilled/skills/system-skilled-bots/scripts/fixtures/no-identity/bots
.skilled/skills/system-skilled-bots/scripts/fixtures/no-identity/bots/nightly-digest
.skilled/skills/system-skilled-bots/scripts/fixtures/posture-unhonorable/bots
.skilled/skills/system-skilled-bots/scripts/fixtures/posture-unhonorable/bots/nightly-digest
.skilled/skills/system-skilled-bots/scripts/fixtures/reserved-id/bots
.skilled/skills/system-skilled-bots/scripts/fixtures/reserved-id/bots/nightly-digest
.skilled/skills/system-skilled-bots/scripts/fixtures/routine-clean/bots
.skilled/skills/system-skilled-bots/scripts/fixtures/routine-clean/bots/digest
.skilled/skills/system-skilled-bots/scripts/fixtures/routine-clean/bots/nightly-report
.skilled/skills/system-skilled-bots/scripts/fixtures/routine-clean/bots/plain
.skilled/skills/system-skilled-bots/scripts/fixtures/routine-floor/bots
.skilled/skills/system-skilled-bots/scripts/fixtures/routine-floor/bots/digest
.skilled/skills/system-skilled-bots/scripts/fixtures/routine-floor/bots/nightly-report
.skilled/skills/system-skilled-bots/scripts/fixtures/routine-floor/bots/plain
.skilled/skills/system-skilled-bots/scripts/fixtures/routine-starts-cron-not-first/bots
.skilled/skills/system-skilled-bots/scripts/fixtures/routine-starts-cron-not-first/bots/digest
.skilled/skills/system-skilled-bots/scripts/fixtures/routine-starts-cron-not-first/bots/nightly-report
.skilled/skills/system-skilled-bots/scripts/fixtures/routine-starts-cron-not-first/bots/plain
.skilled/skills/system-skilled-bots/scripts/fixtures/routine-starts-empty/bots
.skilled/skills/system-skilled-bots/scripts/fixtures/routine-starts-empty/bots/digest
.skilled/skills/system-skilled-bots/scripts/fixtures/routine-starts-empty/bots/nightly-report
.skilled/skills/system-skilled-bots/scripts/fixtures/routine-starts-empty/bots/plain
.skilled/skills/system-skilled-bots/scripts/fixtures/routine-starts-multiple-cron/bots
.skilled/skills/system-skilled-bots/scripts/fixtures/routine-starts-multiple-cron/bots/digest
.skilled/skills/system-skilled-bots/scripts/fixtures/routine-starts-multiple-cron/bots/nightly-report
.skilled/skills/system-skilled-bots/scripts/fixtures/routine-starts-multiple-cron/bots/plain
.skilled/skills/system-skilled-bots/scripts/fixtures/routine-starts-multiple/bots
.skilled/skills/system-skilled-bots/scripts/fixtures/routine-starts-multiple/bots/digest
.skilled/skills/system-skilled-bots/scripts/fixtures/routine-starts-multiple/bots/nightly-report
.skilled/skills/system-skilled-bots/scripts/fixtures/routine-starts-multiple/bots/plain
.skilled/skills/system-skilled-bots/scripts/fixtures/routine-tell-with-targets/bots
.skilled/skills/system-skilled-bots/scripts/fixtures/routine-tell-with-targets/bots/digest
.skilled/skills/system-skilled-bots/scripts/fixtures/routine-tell-with-targets/bots/nightly-report
.skilled/skills/system-skilled-bots/scripts/fixtures/routine-tell-with-targets/bots/plain
.skilled/skills/system-skilled-bots/scripts/fixtures/routine-trigger-conflict/bots
.skilled/skills/system-skilled-bots/scripts/fixtures/routine-trigger-conflict/bots/digest
.skilled/skills/system-skilled-bots/scripts/fixtures/routine-trigger-conflict/bots/nightly-report
.skilled/skills/system-skilled-bots/scripts/fixtures/routine-trigger-conflict/bots/plain
.skilled/skills/system-skilled-bots/scripts/fixtures/routine-until-check-without-outcome/bots
.skilled/skills/system-skilled-bots/scripts/fixtures/routine-until-check-without-outcome/bots/digest
.skilled/skills/system-skilled-bots/scripts/fixtures/routine-until-check-without-outcome/bots/nightly-report
.skilled/skills/system-skilled-bots/scripts/fixtures/routine-until-check-without-outcome/bots/plain
.skilled/skills/system-skilled-bots/scripts/fixtures/routine-until-shell-metacharacters/bots
.skilled/skills/system-skilled-bots/scripts/fixtures/routine-until-shell-metacharacters/bots/digest
.skilled/skills/system-skilled-bots/scripts/fixtures/routine-until-shell-metacharacters/bots/nightly-report
.skilled/skills/system-skilled-bots/scripts/fixtures/routine-until-shell-metacharacters/bots/plain
.skilled/skills/system-skilled-bots/scripts/fixtures/skills-clean/bots
.skilled/skills/system-skilled-bots/scripts/fixtures/skills-clean/bots/nightly-digest
.skilled/skills/system-skilled-bots/scripts/fixtures/skills-over-budget/bots
.skilled/skills/system-skilled-bots/scripts/fixtures/skills-over-budget/bots/nightly-digest
.skilled/skills/system-skilled-bots/scripts/fixtures/skills-too-large/bots
.skilled/skills/system-skilled-bots/scripts/fixtures/skills-too-large/bots/nightly-digest
.skilled/skills/system-skilled-bots/scripts/fixtures/skills-unknown/bots
.skilled/skills/system-skilled-bots/scripts/fixtures/skills-unknown/bots/nightly-digest
.skilled/skills/system-skilled-bots/scripts/fixtures/timeout-over-bound/bots
.skilled/skills/system-skilled-bots/scripts/fixtures/timeout-over-bound/bots/nightly-digest
.skilled/skills/system-skilled-bots/scripts/fixtures/unknown-executor-kind/bots
.skilled/skills/system-skilled-bots/scripts/fixtures/unknown-executor-kind/bots/nightly-digest
.skilled/skills/system-skilled-bots/scripts/fixtures/unknown-trigger-kind/bots
.skilled/skills/system-skilled-bots/scripts/fixtures/unknown-trigger-kind/bots/nightly-digest
.skilled/skills/system-skilled-bots/scripts/fixtures/worktree-shared-paths-unresolved/bots
.skilled/skills/system-skilled-bots/scripts/fixtures/worktree-shared-paths-unresolved/bots/nightly-digest
.skilled/skills/system-skilled-bots/shared
```

## Where the one-file folders sit

- 34 sit at `scripts/fixtures/<case>/bots`, one per fixture case. Each case is a small repository that `scripts/bot-check.cjs` reads at `<case>/bots/config.json` and `<case>/bots/<id>/BOT.md`. `bot-check.cjs:164` builds the `bots` folder from the case root and `bot-check.cjs:81` names `BOT.md` as the definition file.
- 55 sit at `scripts/fixtures/<case>/bots/<id>`, one per bot inside a fixture case. Each holds the case's one `BOT.md`.
- 15 sit at `runtime/tests/fixtures/bots/<id>`, one `BOT.md` per bot folder, in the shape the runtime loader reads.
- The other 19 are listed below.

```text
.skilled/skills/system-skilled-bots/assets
.skilled/skills/system-skilled-bots/benchmark
.skilled/skills/system-skilled-bots/benchmark/reports
.skilled/skills/system-skilled-bots/bots-author/changelog
.skilled/skills/system-skilled-bots/bots-author/references
.skilled/skills/system-skilled-bots/bots-run/changelog
.skilled/skills/system-skilled-bots/bots-schedule/changelog
.skilled/skills/system-skilled-bots/bots-schedule/references
.skilled/skills/system-skilled-bots/bots-status/changelog
.skilled/skills/system-skilled-bots/bots-status/references
.skilled/skills/system-skilled-bots/changelog
.skilled/skills/system-skilled-bots/feature-catalog
.skilled/skills/system-skilled-bots/feature-catalog/hub-routing
.skilled/skills/system-skilled-bots/manual-testing-playbook
.skilled/skills/system-skilled-bots/manual-testing-playbook/channels
.skilled/skills/system-skilled-bots/runtime/tests/fixtures/osascript-stub
.skilled/skills/system-skilled-bots/scripts/fixtures
.skilled/skills/system-skilled-bots/scripts/fixtures/apps-unknown-server
.skilled/skills/system-skilled-bots/shared
```

## Folders the build created

b04f9f9718e is the parent of the build's first runtime commit 00970a71e7e.

```bash
comm -13 <(git ls-tree -r -d --name-only b04f9f9718edb971dbf4f5673221c536114a265f -- .skilled/skills/system-skilled-bots .skilled/crates | sort) <(git ls-tree -r -d --name-only HEAD -- .skilled/skills/system-skilled-bots .skilled/crates | sort) | grep -v 'scripts/fixtures/.*/bots' | grep -v 'tests/fixtures/bots/'
```

Its output is 28 folders.

```text
.skilled/crates
.skilled/crates/bots-tui
.skilled/crates/bots-tui/design
.skilled/crates/bots-tui/src
.skilled/crates/bots-tui/src/view
.skilled/crates/bots-tui/tests
.skilled/crates/bots-tui/tests/answer_flow
.skilled/crates/bots-tui/tests/chat
.skilled/crates/bots-tui/tests/common
.skilled/crates/bots-tui/tests/fixtures
.skilled/crates/bots-tui/tests/fixtures/payloads
.skilled/crates/bots-tui/tests/panes
.skilled/skills/system-skilled-bots/runtime/tests/fixtures/channels
.skilled/skills/system-skilled-bots/scripts/fixtures/apps-unknown-server
.skilled/skills/system-skilled-bots/scripts/fixtures/routine-clean
.skilled/skills/system-skilled-bots/scripts/fixtures/routine-floor
.skilled/skills/system-skilled-bots/scripts/fixtures/routine-starts-cron-not-first
.skilled/skills/system-skilled-bots/scripts/fixtures/routine-starts-empty
.skilled/skills/system-skilled-bots/scripts/fixtures/routine-starts-multiple
.skilled/skills/system-skilled-bots/scripts/fixtures/routine-starts-multiple-cron
.skilled/skills/system-skilled-bots/scripts/fixtures/routine-tell-with-targets
.skilled/skills/system-skilled-bots/scripts/fixtures/routine-trigger-conflict
.skilled/skills/system-skilled-bots/scripts/fixtures/routine-until-check-without-outcome
.skilled/skills/system-skilled-bots/scripts/fixtures/routine-until-shell-metacharacters
.skilled/skills/system-skilled-bots/scripts/fixtures/skills-clean
.skilled/skills/system-skilled-bots/scripts/fixtures/skills-over-budget
.skilled/skills/system-skilled-bots/scripts/fixtures/skills-too-large
.skilled/skills/system-skilled-bots/scripts/fixtures/skills-unknown
```

## Executor audit files

The build edited one deep-loop file, `executor-audit.ts`, in two commits: 96f5727994d and cffa53befcf. `git show --name-only` on each lists no other path under `.skilled/skills/system-deep-loop`. The build touched none of the six test files whose names start with `executor-audit`, so the last row of the table measures files the build left alone.
