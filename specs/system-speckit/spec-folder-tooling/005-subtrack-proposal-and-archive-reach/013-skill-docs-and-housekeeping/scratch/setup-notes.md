# Setup notes

Re-read on 2026-11-14 at commit `9e3408e239` on branch `worktrees/378-relocate-restore-fixes`, after phases 011 and 012. `S` is `.skilled/skills/system-spec-kit`.

## The next-number command (T001)

`create.sh` numbers a new packet after the highest number among the numbered folders in the root it writes to and in that root's `z_archive/` (`create.sh:1644`). Without `--track` it also counts numbered git branches (`create.sh:1656-1660`). A phase added to a parent reads the parent's live children and its `z_archive/` (`create.sh:1813`).

The command `SKILL.md` publishes, for one root:

```bash
find specs/<root> specs/<root>/z_archive -mindepth 1 -maxdepth 1 -type d -name '[0-9]*' 2>/dev/null | sed 's#.*/##' | grep -o '^[0-9]*' | sort -n | tail -1 | awk '{n=$1} END{printf "%03d\n", n+1}'
```

It uses `find` rather than a glob, because zsh aborts a command whose glob matches nothing. In a scratch copy with `specs/demo/001-a` live and `specs/demo/z_archive/008-b` archived, it printed `009` for `specs/demo`, and `create.sh --track demo --skip-branch` created `specs/demo/009-probe-packet`. An empty root printed `001`. The command copied back out of `SKILL.md` and run with `bash -c` also printed `009`.

## In Scope lines before the edit

Every cited line still held the text the spec names.

- `S/SKILL.md:295`: the next-number row, which read only the specs root and no archive.
- `S/SKILL.md:317`: the script list, with no `relocate.mjs`, `suggest-subtracks.mjs` or `archive.sh`.
- `S/references/retrieval/retrieval-conventions.md:84`: the `--include-archive` bullet, with no `archivedPaths`.
- `S/references/structure/folder-structure.md:141`: three no-map cases.
- `S/references/structure/phase-definitions.md:255`: the next sequential phase, with no word on archived phases.
- `S/runtime/cli/spec/README.md:114`: the `archive.sh` row, with no status 3 outcome and no mixed-track refusal.
- `S/runtime/cli/spec/README.md:120`: the `relocate.mjs` row, saying exit 3 needs only a failed validation and that every stopped map finishes on a rerun.
- `S/README.md:639`: the `relocate.mjs` row, with no exit 3.
- `../decision-record.md:13`: names Q026, the last row of the table.

## Verify clauses naming files never written (T011)

A loop over every `scratch/*.txt` name in the `tasks.md` files of phases 006 to 010 found twelve names with no file. Each now names the file that holds its evidence:

- 006: `after.txt` and `reproduce.txt` point at `scratch/build-evidence.md`, which holds each failing run and final run.
- 007: `after.txt`, `reproduce.txt`, `baseline.txt` and `bare-name-places.txt` point at `scratch/build-evidence.md`.
- 008: `after.txt`, `reproduce.txt` and `baseline.txt` point at `scratch/build-evidence.md`.
- 010: `timing.txt` and `writer-inputs.txt` point at `scratch/build-evidence.md`. `baseline.txt` points at `../009-proposal-search-and-routing/implementation-summary.md`, which records the 2599-passed suite run that 010 started from.

The same loop run after the edit printed no missing file.
