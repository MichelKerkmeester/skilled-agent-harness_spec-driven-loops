# Brief OBSIDIAN-REWRITE — keep the sibling's conventions, drop the dead attribution

## Context you must not re-litigate

The `sk-code-obsidian` surface packet documented several of its conventions as *mirrored from*
the `sk-code-mobile-cli` packet, which is being deleted in this same change. The conventions
themselves are obsidian's own target-state choices and must survive. Only the attribution and the
now-dangling cited paths go. A different brief owns the hub's metadata; do not edit the hub.

## Read first

1. `.skilled/skills/sk-code/sk-code-obsidian/SKILL.md` and `README.md` — where the mirroring is
   stated and where the removed packet is cited as a key source.
2. `.skilled/skills/sk-code/sk-code-obsidian/references/folder-docs.md` — the cited
   `$HUB/.skilled/skills/sk-code/sk-code-mobile-cli/references/folder-docs.md` path.
3. `.skilled/skills/sk-code/sk-code-obsidian/manual-testing-playbook/surface-detection/negative-control-non-obsidian.md`
   — scenario `OB-021`, which shells a text reader over the removed packet's `SKILL.md`.
4. `.skilled/skills/sk-code/sk-code-obsidian/manual-testing-playbook/surface-detection/obsidian-surface-resolution.md`.

## Files in scope (fourteen — enumerate them yourself and confirm the count)

```bash
rg -l "sk-code-mobile-cli|PI_REMOTE" .skilled/skills/sk-code/sk-code-obsidian
```

`.skilled/skills/sk-code/sk-code-obsidian/`: `SKILL.md`, `README.md`, `changelog/v0.1.0.0.md`,
`assets/folder-docs-checklist.md`, `assets/comment-banner-checklist.md`,
`references/folder-docs.md`, `references/comment-grammar.md`, `references/accessibility.md`,
`references/db-class-naming.md`, `references/standards/code-standards.md`,
`references/quality/doc-quality-gate.md`, `manual-testing-playbook/manual-testing-playbook.md`,
`manual-testing-playbook/surface-detection/negative-control-non-obsidian.md`,
`manual-testing-playbook/surface-detection/obsidian-surface-resolution.md`.

## The change

1. Every sentence that presents a convention as *mirrored from*, *inherited from*, or *sourced
   from* the removed packet becomes a statement of that convention in obsidian's own voice — the
   convention is unchanged, its provenance claim is not.
2. Every citation of a path under `.skilled/skills/sk-code/sk-code-mobile-cli/` is either removed
   or repointed at a file you have verified exists by reading it. Never invent a replacement path,
   and never leave a citation pointing at the deleted tree.
3. Scenario `OB-021` in `negative-control-non-obsidian.md`: retarget it off the removed packet's
   markers. Its purpose is to prove a *non-obsidian* target does **not** resolve the obsidian
   surface; after this change a target shaped like the removed mobile stack resolves no surface at
   all. Replace every evidence command that reads the removed packet's files with a command that
   reads a file that still exists, and state the expected outcome as the absence of an obsidian
   resolution rather than the presence of a mobile one.
4. `changelog/v0.1.0.0.md`: remove the attribution sentence that names the removed packet. Do not
   change the entry's version heading or its other content.

## Do not touch

- Anything under `.skilled/skills/sk-code/` outside the `sk-code-obsidian/` subtree.
- `.skilled/skills/sk-doc/**`, the root `README.md`, and the test baselines under
  `.skilled/skills/sk-doc/scripts/tests/code-folder/**`.
- The packet's registered metadata (`mode-registry.json`, `leaf-manifest.json`) — other steps own
  those.

## Hard constraints

- One change only: this packet's dead attribution, dangling citations and the `OB-021` retarget.
  Report unrelated staleness instead of fixing it.
- Comment hygiene: never put an ADR/REQ/CHK/task id or a spec path into a code comment.
- No git: no `git add`, no `git commit`, no branch, no push.
- Keep every command block you rewrite actually runnable, and keep each edit minimal.

## The check that proves it

```bash
rg -n "sk-code-mobile-cli|PI_REMOTE" .skilled/skills/sk-code/sk-code-obsidian
```

Expected: no hit, in any of the fourteen files.

```bash
node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --strict
```

Expected: no `PATH_MISSING` error pointing at a file under
`.skilled/skills/sk-code/sk-code-obsidian/`. Quote the exact line for any finding that survives.

```bash
node .skilled/skills/system-spec-kit/runtime/cli/check-markdown-links.cjs
```

Expected: no broken link reported for a file you edited. This check also covers files that other
briefs are editing concurrently — if it reports a link into the removed packet from a file outside
your fourteen, report it rather than fixing it.

## Return shape

Write your full report to `specs/sk-code/009-sk-code-mobile-cli-deprecation/scratch/obsidian-rewrite-return.md`
containing: the fourteen files with a `file:line` citation and the exact edit for each, the three
commands above with their real output, every citation you removed versus repointed, anything you
deliberately left alone, and any defect you found but did not fix. Reply with only three lines:
files changed, check result, blockers.
