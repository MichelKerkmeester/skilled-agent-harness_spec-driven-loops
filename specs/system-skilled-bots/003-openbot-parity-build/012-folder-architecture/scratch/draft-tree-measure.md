Draft at d9159aa94ba: 012's opener re-measures every row after 011.006 and 011.007 merge, writes the real record to `scratch/tree-baseline.md` and deletes this file.

# Draft tree measure

This is a read-only draft of T001's measure. It is not `BASE` and no verify command reads it.

## How each column was measured

Every command ran from the repository root at d9159aa94ba. `<root>` is the row's path.

```bash
git ls-files -- <root> | wc -l
git ls-files -- <root> | xargs -n1 dirname | sort -u | wc -l
git ls-files -- <root> | xargs -n1 dirname | sort | uniq -c | awk '$1==1' | wc -l
git ls-files -- <root> | awk -F/ '{print NF"\t"$0}' | sort -n | tail -1
```

A folder counts when it holds a tracked file directly. A folder that holds one file plus subfolders counts as a one-file folder, so `benchmark/`, `feature-catalog/`, `manual-testing-playbook/` and `scripts/fixtures/` each count once for their own index or README. Depth is the number of path parts, the file name included.

## Measures

| Root | Files | Folders | One-file folders | Depth | Deepest path |
|------|-------|---------|------------------|-------|--------------|
| `.skilled/skills/system-skilled-bots` | 386 | 161 | 123 | 9 | `.skilled/skills/system-skilled-bots/scripts/fixtures/worktree-shared-paths-unresolved/bots/nightly-digest/BOT.md` |
| `.skilled/skills/system-skilled-bots/assets` | 1 | 1 | 1 | 5 | `.skilled/skills/system-skilled-bots/assets/bot-template.txt` |
| `.skilled/skills/system-skilled-bots/benchmark` | 5 | 3 | 2 | 7 | `.skilled/skills/system-skilled-bots/benchmark/reports/2026-11-26--manual-testing-playbook--openbot-parity/source.md` |
| `.skilled/skills/system-skilled-bots/bots-author` | 5 | 3 | 2 | 6 | `.skilled/skills/system-skilled-bots/bots-author/references/bot-definition.md` |
| `.skilled/skills/system-skilled-bots/bots-run` | 6 | 3 | 1 | 6 | `.skilled/skills/system-skilled-bots/bots-run/references/run-queue-and-answer.md` |
| `.skilled/skills/system-skilled-bots/bots-schedule` | 5 | 3 | 2 | 6 | `.skilled/skills/system-skilled-bots/bots-schedule/references/schedule-lifecycle.md` |
| `.skilled/skills/system-skilled-bots/bots-status` | 5 | 3 | 2 | 6 | `.skilled/skills/system-skilled-bots/bots-status/references/status-and-inbox.md` |
| `.skilled/skills/system-skilled-bots/changelog` | 1 | 1 | 1 | 5 | `.skilled/skills/system-skilled-bots/changelog/v1.0.0.0.md` |
| `.skilled/skills/system-skilled-bots/feature-catalog` | 23 | 9 | 2 | 6 | `.skilled/skills/system-skilled-bots/feature-catalog/status/status-index.md` |
| `.skilled/skills/system-skilled-bots/manual-testing-playbook` | 59 | 18 | 2 | 6 | `.skilled/skills/system-skilled-bots/manual-testing-playbook/worktree-and-delivery/worktree-run-cleans-up.md` |
| `.skilled/skills/system-skilled-bots/runtime` | 172 | 23 | 16 | 9 | `.skilled/skills/system-skilled-bots/runtime/tests/fixtures/bots/worktree-slow/BOT.md` |
| `.skilled/skills/system-skilled-bots/scripts` | 93 | 92 | 91 | 9 | `.skilled/skills/system-skilled-bots/scripts/fixtures/worktree-shared-paths-unresolved/bots/nightly-digest/BOT.md` |
| `.skilled/skills/system-skilled-bots/shared` | 1 | 1 | 1 | 5 | `.skilled/skills/system-skilled-bots/shared/README.md` |
| `.skilled/crates/bots-tui` | 74 | 11 | 1 | 7 | `.skilled/crates/bots-tui/tests/fixtures/payloads/status.json` |
| `.skilled/bin/bots.cjs` | 1 | 1 | 1 | 3 | `.skilled/bin/bots.cjs` |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts` | 1 | 1 | 1 | 7 | `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts` |
| `.skilled/skills/system-deep-loop/runtime/tests/**executor-audit*` | 6 | 2 | 0 | 7 | `.skilled/skills/system-deep-loop/runtime/tests/unit/executor-audit.vitest.ts` |

The skill grew from 365 to 386 files since the spec's snapshot, and its one-file folder count stayed at 123. The hub root's own files sit in the hub root folder, which the skill row counts once.

## Where the one-file folders sit

- The case folders under `scripts/fixtures/` hold 90 of the skill's 123. Each fixture case is a small repository that `scripts/bot-check.cjs` reads at `<case>/bots/config.json` and `<case>/bots/<id>/BOT.md` (`bot-check.cjs:81` and `bot-check.cjs:164`), so each case adds a `bots/` folder with one file and a `bots/<id>/` folder with one file.
- `runtime/tests/fixtures/bots/` holds 15 more, one `BOT.md` per bot folder, in the shape the runtime loader reads.
- The other 18, `scripts/fixtures/` itself among them, are rows `M001` to `M018` in `draft-move-map.md`.

## Executor audit files

The parity build edited one deep-loop file, `executor-audit.ts`, in two commits: 96f5727994d and cffa53befcf. `git show --name-only` on each lists no other path under `.skilled/skills/system-deep-loop`. The last row counts the six test files whose names start with `executor-audit`.
