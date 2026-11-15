# Setup notes

Re-read on 2026-11-14 at commit `b32e6865f6` on branch `worktrees/378-relocate-restore-fixes`, after phase 011 was committed. `FC` is `.skilled/skills/system-spec-kit/feature-catalog`, `MP` is `.skilled/skills/system-spec-kit/manual-testing-playbook`.

## In Scope lines before the edit (T001)

Every cited line still held the text the spec names.

- `FC/tooling-and-scripts/spec-packet-relocation.md:66`: the exit status paragraph, with no status 3.
- `FC/tooling-and-scripts/spec-packet-relocation.md:44`: step 3 of the rewrite list, with no bare-name, re-parent or pre-archive pass.
- `FC/tooling-and-scripts/spec-packet-relocation.md:91`: the only Validation And Tests row, `relocate.vitest.ts`.
- `FC/tooling-and-scripts/spec-lifecycle-automation.md:45`: the restore paragraph, which said every failed `relocate.mjs` run exits 1.
- `FC/retrieval/rg-archive-search.md:28`: the JSON paragraph, with no `archivedPaths`.
- `FC/tooling-and-scripts/sub-track-proposal.md:30`: three no-map cases.
- `MP/tooling-and-scripts/spec-packet-relocation.md:27` (Objective) and `:226` (Pass), with no status 3 or late-step resume.
- `MP/tooling-and-scripts/sub-track-proposal.md:169` (Pass), with no preflight step.
- `MP/retrieval/rg-archive-search.md:176` (Pass), with no path JSON check.

## Code read after phase 011

- `runtime/cli/spec/relocate.mjs`: the header exit codes, `closeRun`, `applyPlan`'s late steps and `markLateStep`. The late-step flags mark a move unfinished until every flag is set. A rerun then runs every late step again, it does not skip the ones that landed.
- `runtime/cli/spec/archive.sh`: the relocate status handling, where 3 logs success with a warning and exits 0 and any other non-zero exits 1, and `refuse_mixed_track_restore`, which reads declarations and runs no `relocate.mjs`.
- `runtime/cli/retrieval/rg-wrapper.mjs`: `archivedPaths` is set on the path record. Run without `--include-archive` the field is absent, and with it the field holds the archived subset of `paths`.
- `runtime/cli/spec/suggest-subtracks.mjs:296`: the NNN-slug refusal prints one line per misnamed packet, then `track <name>: no map`.

## Validator commands (T001)

- `sk-create-feature-catalog/SKILL.md:225` and `:229`: `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py <page>`.
- `sk-create-manual-testing-playbook/SKILL.md:398`: `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package <skill>/manual-testing-playbook`.

## Scenario ids (T002)

- `492`: spec packet relocation, `MP/tooling-and-scripts/spec-packet-relocation.md`.
- `493`: sub-track proposal, `MP/tooling-and-scripts/sub-track-proposal.md`.
- `494`: ripgrep archive search, `MP/retrieval/rg-archive-search.md`.
- The highest id in the package is `495`, so the next free one is `496`. This phase adds steps to existing scenarios and takes no new id.
- `rg -c 'relocate.mjs --map' MP/tooling-and-scripts/sub-track-proposal.md` printed `1` before the edit.

## Index files (T011)

- `FC/feature-catalog.md`: four summaries changed to match their pages: spec lifecycle automation, spec packet relocation, sub-track proposal and ripgrep archive search.
- `MP/manual-testing-playbook.md`: unchanged. Its rows carry only the scenario id, title and links, and no title changed.
