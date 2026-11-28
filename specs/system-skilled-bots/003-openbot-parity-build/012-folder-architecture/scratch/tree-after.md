# Tree after

BASE: 1937abca82319d1e985992709464c54300894ca6
FINAL: 56529b6deab6173ddc6293c38be2ee8790c00f38

This record measures the tree the phase closed on. `git rev-parse HEAD` printed 56529b6deab6173ddc6293c38be2ee8790c00f38, so every number below reads the committed tree at FINAL. The commands are the ones `scratch/tree-baseline.md` used, so each row reads against its baseline value.

## How each column was measured

Every command ran from the repository root at 56529b6deab. `<root>` is the row's path. Every measure reads `git ls-files`, so it reads the committed tree at FINAL.

```bash
git ls-files -- <root> | wc -l
git ls-files -- <root> | xargs -n1 dirname | sort -u | wc -l
git ls-files -- <root> | xargs -n1 dirname | sort | uniq -c | awk '$1==1' | wc -l
git ls-files -- <root> | awk -F/ '{print NF"\t"$0}' | sort -n | tail -1
```

A folder counts when it holds a tracked file directly. A folder that holds one file plus subfolders counts as a one-file folder, so `benchmark/`, `feature-catalog/`, `manual-testing-playbook/` and `scripts/fixtures/` each count once for their own index or README. Depth is the number of path parts, the file name included. The last row is a set of six files rather than a folder, so its four measures were taken over that file list.

## Measures

The roots are the baseline roots in the baseline order. `.skilled/crates` is the one row the baseline table did not have, so its baseline column reads n/a.

| Root | Files | Folders | One-file folders | Baseline one-file folders | Depth | Deepest path |
|------|-------|---------|------------------|---------------------------|-------|--------------|
| `.skilled/skills/system-skilled-bots` | 402 | 160 | 122 | 123 | 9 | `.skilled/skills/system-skilled-bots/scripts/fixtures/worktree-shared-paths-unresolved/bots/nightly-digest/BOT.md` |
| `.skilled/skills/system-skilled-bots/assets` | 1 | 1 | 1 | 1 | 5 | `.skilled/skills/system-skilled-bots/assets/bot-template.txt` |
| `.skilled/skills/system-skilled-bots/benchmark` | 5 | 3 | 2 | 2 | 7 | `.skilled/skills/system-skilled-bots/benchmark/reports/2026-11-26--manual-testing-playbook--openbot-parity/source.md` |
| `.skilled/skills/system-skilled-bots/bots-author` | 5 | 3 | 2 | 2 | 6 | `.skilled/skills/system-skilled-bots/bots-author/references/bot-definition.md` |
| `.skilled/skills/system-skilled-bots/bots-run` | 7 | 3 | 1 | 1 | 6 | `.skilled/skills/system-skilled-bots/bots-run/references/run-queue-and-answer.md` |
| `.skilled/skills/system-skilled-bots/bots-schedule` | 5 | 3 | 2 | 2 | 6 | `.skilled/skills/system-skilled-bots/bots-schedule/references/schedule-lifecycle.md` |
| `.skilled/skills/system-skilled-bots/bots-status` | 5 | 3 | 2 | 2 | 6 | `.skilled/skills/system-skilled-bots/bots-status/references/status-and-inbox.md` |
| `.skilled/skills/system-skilled-bots/changelog` | 1 | 1 | 1 | 1 | 5 | `.skilled/skills/system-skilled-bots/changelog/v1.0.0.0.md` |
| `.skilled/skills/system-skilled-bots/feature-catalog` | 24 | 9 | 2 | 2 | 6 | `.skilled/skills/system-skilled-bots/feature-catalog/status/status-index.md` |
| `.skilled/skills/system-skilled-bots/manual-testing-playbook` | 59 | 18 | 2 | 2 | 6 | `.skilled/skills/system-skilled-bots/manual-testing-playbook/worktree-and-delivery/worktree-run-cleans-up.md` |
| `.skilled/skills/system-skilled-bots/runtime` | 186 | 22 | 15 | 16 | 9 | `.skilled/skills/system-skilled-bots/runtime/tests/fixtures/bots/worktree-slow/BOT.md` |
| `.skilled/skills/system-skilled-bots/scripts` | 93 | 92 | 91 | 91 | 9 | `.skilled/skills/system-skilled-bots/scripts/fixtures/worktree-shared-paths-unresolved/bots/nightly-digest/BOT.md` |
| `.skilled/skills/system-skilled-bots/shared` | 1 | 1 | 1 | 1 | 5 | `.skilled/skills/system-skilled-bots/shared/README.md` |
| `.skilled/crates` | 75 | 12 | 2 | n/a | 7 | `.skilled/crates/bots-tui/tests/fixtures/payloads/status.json` |
| `.skilled/crates/bots-tui` | 74 | 11 | 1 | 1 | 7 | `.skilled/crates/bots-tui/tests/fixtures/payloads/status.json` |
| `.skilled/bin/bots.cjs` | 1 | 1 | 1 | 1 | 3 | `.skilled/bin/bots.cjs` |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts` | 1 | 1 | 1 | 1 | 7 | `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts` |
| `.skilled/skills/system-deep-loop/runtime/tests/**executor-audit*` | 6 | 2 | 0 | 0 | 7 | `.skilled/skills/system-deep-loop/runtime/tests/unit/executor-audit.vitest.ts` |

The skill holds 402 files across 160 folders. Of those folders 122 hold exactly one file. Its ten root-level files sit in the skill root folder, which the skill row counts once. The `scripts` row carries 91 of the skill's 122 one-file folders on its own.

## What changed

The skill's one-file folder count went from 123 to 122. One folder left the list, `.skilled/skills/system-skilled-bots/runtime/tests/fixtures/osascript-stub`. Its one file is now `.skilled/skills/system-skilled-bots/runtime/tests/fixtures/osascript-stub.sh`, so the folder is gone and the file sits directly in `runtime/tests/fixtures`. That is M016, the map's only move row.

The diff that found it compares the baseline list with the current one.

```bash
git ls-files .skilled/skills/system-skilled-bots | xargs -n1 dirname | sort | uniq -c | awk '$1==1{print $2}'
```

The baseline list holds 123 lines and this output holds 122. The only line in the baseline list that this output lacks is the `osascript-stub` folder. No line appears here that the baseline list lacks.

The skill's file count did not change, 402 before and 402 after, because M016 renames a file rather than adding one. Its folder count fell from 161 to 160 and the `runtime` row's folder count fell from 23 to 22, both from that same move. The `runtime` row's one-file folder count fell from 16 to 15 for the same reason.

`.skilled/crates` is a row the baseline table did not have, so it is marked n/a in the baseline column. It holds 75 files across 12 folders. `.skilled/crates/bots-tui` holds 74 of those files, so the crates root holds one file, `.skilled/crates/README.md`, the README that R001 records as new. That README is the one file the phase added under `.skilled/crates`, and no baseline row measured the folder it sits in.

## Why the rest stay

The skill keeps 122 one-file folders, and the keep rows M001 to M015 and M017 to M020 and M032 hold them: the hub root folders the parent-skill check allows, the mode packet `changelog` and `references` folders the leaf manifest resolves, the catalog and playbook category folders their root indexes link, the 89 fixture `bots` and bot folders whose input shape `bot-check.cjs` reads, the 15 runtime fixture bot folders the loader reads and the `apps-unknown-server` case whose root file the apps check reads.

The crate keeps its one one-file folder, `.skilled/crates/bots-tui/tests/fixtures`, and M023 holds it because `tests/pty_smoke.rs` and `tests/common/fixture.rs` name the bots stub inside it.

`.skilled/bin/bots.cjs` keeps one file in one folder at depth 3, and M030 holds it because the CLI entry is the path every verb, playbook scenario and CI job names.

The executor audit file keeps one file in one folder at depth 7, and M031 holds it because it sits in the deep-loop runtime's own lib layout, a folder the build edited but does not own.

## Map size

The move map holds 32 M rows, 1 move and 31 keep, and 28 R rows, 2 readme and 26 skip. Both counts come from the map itself.

```bash
rg -c '^\| M[0-9]{3} \|' specs/system-skilled-bots/003-openbot-parity-build/012-folder-architecture/scratch/move-map.md
rg -c '^\| R[0-9]{3} \|' specs/system-skilled-bots/003-openbot-parity-build/012-folder-architecture/scratch/move-map.md
```

The first prints 32 and the second prints 28. The verdicts split the same way, 1 move and 31 keep, 2 readme and 26 skip.
