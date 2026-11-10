# Brief PACKET-REMOVE — delete the packet and clear every catalogue reference

## Context you must not re-litigate

The `sk-code` hub must stop advertising a surface packet for the retired Pi Remote Mobile-CLI
stack. Two other briefs own the hub's metadata and the sibling `sk-code-obsidian` packet. Your job
is the deletion, plus the catalogue surfaces that list it.

## Read first

1. `.skilled/skills/sk-code/sk-code-mobile-cli/` — confirm what you are deleting (82 files, 668K).
2. `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/playbook-failclosed-allowlist.txt`
   — find the allowlist root that names the removed packet's manual-testing-playbook, and read the
   file's own rules comment.
3. `.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md`
   — the passage around the example that names the removed packet as a shipped hub mode.
4. `README.md` (repository root) — the section that lists the hub's replaceable surface packets.

## The change

1. Delete the packet directory `.skilled/skills/sk-code/sk-code-mobile-cli/` in full.
2. Remove the allowlist line for that deleted manual-testing-playbook root from
   `playbook-failclosed-allowlist.txt`. The file's general rule is "never remove a line to make a
   red build green", and the paired CI step permits exactly this removal in the same change when
   the root itself is deleted — so add nothing to the file except the removal, and say in your
   return that the root was deleted rather than dropped for convenience.
3. In `parent-skills-nested-packets.md`, correct the example so it no longer cites the removed
   packet: keep the point the passage makes about a hub mode that is reachable in one stage but not
   the other, and use a live example (the sibling `sk-code-obsidian` packet is still registered).
   If the passage lists two shipped examples, either replace the removed one or reduce to the ones
   that still exist — whichever keeps the sentence true.
4. In the root `README.md`, remove the removed packet from the list of the hub's surface packets,
   leaving the other surfaces and the surrounding prose intact.

## Do not touch

- `.skilled/skills/sk-doc/scripts/tests/code-folder/**` — those frozen baselines are refreshed by
  their own test writers, not by hand (a separate step owns them).
- Any hub file under `.skilled/skills/sk-code/` — another brief owns the de-registration.
- `.skilled/skills/sk-code/sk-code-obsidian/**` — another brief owns it.
- `.skilled/skills/README.txt` — check it and report the result, but expect no mention; if you find
  one, report it instead of editing, because the file's shape is owned elsewhere.

## Hard constraints

- One change only: the deletion and the catalogue references it leaves behind. Do not fix unrelated
  staleness you notice; report it instead.
- Comment hygiene: never put an ADR/REQ/CHK/task id or a spec path into a code comment.
- No git: no `git add`, no `git commit`, no branch, no push. Use a plain recursive delete; do not
  use `git rm` or `git restore`.
- Do not reformat untouched regions.

## The check that proves it

```bash
find .skilled/skills/sk-code/sk-code-mobile-cli -type f
```

Expected: no output at all (the directory is gone).

```bash
rg -n "sk-code-mobile-cli" README.md .skilled/skills/sk-doc/sk-create-manual-testing-playbook/playbook-failclosed-allowlist.txt .skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md
```

Expected: no hit in any of the four files.

```bash
node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --strict
```

Expected: it validates every remaining playbook root. It may report findings owned by the sibling
`sk-code-obsidian` playbook (a different brief retargets its citations) — if it does, quote the
exact error lines and say which file they point at, rather than editing that file.

## Return shape

Write your full report to `specs/sk-code/009-sk-code-mobile-cli-deprecation/scratch/packet-remove-return.md`
containing: the deleted tree's file count, each file edited with a `file:line` citation and the
exact edit, the three commands above with their real output, the result of the
`.skilled/skills/README.txt` check, anything you deliberately left alone, and any defect you found
but did not fix. Reply with only three lines: files changed, check result, blockers.
