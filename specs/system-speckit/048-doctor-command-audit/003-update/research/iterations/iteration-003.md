# Iteration 003: Q1b, composite child skills as update units

**Focus:** Q1b (carried) — whether composite child skills (`sk-code-*`, `sk-doc-*`, and every other hub's packets) are independent update units with their own versions, or updated only through the parent.

## Actions Taken

1. Composite anatomy. Inventoried `.skilled/skills/sk-code/` and `.skilled/skills/sk-doc/`: packet directories, per-packet `SKILL.md` versions, per-packet `changelog/` directories and their numerically sorted entry counts. Counted the repository corpus of `SKILL.md` files.
2. Version-pin check. Read the hubs' projections (`mode-registry.json`, `hub-router.json`, `leaf-manifest.json`) for version fields and child references.
3. Git independence. For recent commits touching a child path, counted whether the same commit also touched the parent `SKILL.md`, which is the signal that child changes are committable without a hub bump.
4. Projection enforcement. Read `parent-skill-check.cjs` (leaf-manifest flatten, packet guards, direct-child check), `generate-leaf-manifest.cjs` (write and check contract), and the leaf-manifest test header.
5. Runtime mechanics. `.opencode/SYNC.md` surface table, the `.pi` and `.opencode` parent entries, and `git ls-files -s` for the mirror paths.
6. Release coverage. `.skilled/changelog/skilled/v4.0.0.2.md` and `.skilled/changelog/skilled/README.md` for whether release notes enumerate component versions.

All actions were read-only.

## Findings

### F1. Composite children carry their own version lines and changelog sequences

Observed. The `sk-code` hub is `2.2.4.0` while its five packets are `sk-code-obsidian` 0.1.1.0, `sk-code-opencode` 1.1.0.0, `sk-code-quality` 1.0.1.0, `sk-code-review` 1.6.0.0, `sk-code-webflow` 1.1.0.0. The `sk-doc` hub is `2.2.5.0` while its fourteen packets span 1.0.0.0 to 1.5.0.0. Every packet has its own `changelog/` with an independently advanced sequence: `sk-create-changelog` 10 entries, `sk-code-review` 7, `sk-code-obsidian` 2, `sk-create-frontmatter` 1. Versions were read from each packet's `SKILL.md`, entry counts from each packet's `changelog/`.

- The repository corpus is 59 `SKILL.md` files (observed count). Iteration 2 verified all 59 match their numerically newest changelog entry. With 14 top-level skills, 45 of the 59 versioned components are composite children.
- Packet layout is uniform: a direct child directory of the hub holding `SKILL.md`, `README.md`, `changelog/` plus optional `references/`, `assets/`, `scripts/`, `benchmark/`, `manual-testing-playbook/` (observed for `sk-code-review` and `sk-create-command`).

### F2. Hub projections carry the hub's own version and never pin child versions

Observed. `mode-registry.json:3` and `hub-router.json:3` in both hubs carry the hub version (`"version": "2.2.4.0"` for sk-code, `"2.2.5.0"` for sk-doc). Child references in `mode-registry.json` are packet names and paths only (lines 33-34, 52-53, 88-89). No parent artifact carries a child version or hash.

Derived consequence: a child version bump does not force an edit to any hub artifact, unless the bump accompanies a structural change (see F4).

### F3. Child-scoped commits exist that do not touch the parent `SKILL.md`

Observed via per-commit path analysis:

- `1a69fb9957` (`fix(sk-code): stop the rule canary...`) touched 4 files, all inside `sk-code-review`, parent `SKILL.md` not touched.
- `24841a6882` and `094cdb9f8a` (changelog rewrites) each touched 29 files under `sk-code/`, parent `SKILL.md` not touched.
- On the sk-doc side, `6cd0da3618` touched 1 file under `sk-create-command` and `b1f6ffc0de` touched 56 files under `sk-doc`, parent `SKILL.md` not touched in either.
- Counter-examples are broad refactors that move hub and children together (`c1ee9456e0` touched 209 sk-code files and the parent, `ec33385ae5` touched 680 files and the parent).

Derived reading: the repository already treats each packet directory as an independently committable unit. A hub bump is not a precondition for a child change.

### F4. Leaf-inventory and routing changes are coupled to generated hub projections

Observed. `parent-skill-check.cjs` flattens `leaf-manifest.json` into (workflowMode, leafResourceId) pairs (lines 226-232), requires each registered packet to carry `SKILL.md` + `README.md` + `changelog/` (line 367), requires each `packet` value to be a direct child directory with no absolute or `../` segment (lines 377-383), and forbids nested `graph-metadata.json` or `description.json` inside a packet (checks 2a and 2b, lines 302-323) so the advisor keeps exactly one hub identity.

`generate-leaf-manifest.cjs` writes the manifest from `mode-registry.json` with `--write` and recomputes it with `--check`, failing on any byte drift. Check 10 in `parent-skill-check.cjs` activates its leaf-manifest guards only when a hub commits a manifest, and the test header records that every guard fails closed on its own class of drift.

Derived consequence: a child update confined to content inside existing leaves is self-contained. A child update that adds, removes or renames leaf resources, or changes routing vocabulary, must regenerate the hub's `leaf-manifest.json` and, when the packet set or routing text changes, `mode-registry.json` and `hub-router.json`. `generate-leaf-manifest.cjs --check <hub>` is a cheap existing detector for the stale-projection case.

### F5. Runtime mirrors are tracked symlinks, so each skill has exactly one physical copy

Observed. `.pi/skills` and `.opencode/skills` are git-tracked symlinks (mode `120000`, identical blob `be68b2284b24b5b2ac527cc997250af94bde5320`) to `../.skilled/skills`. `.opencode/SYNC.md` states the arrangement: one relative symlink per entry, and drift is impossible for linked entries because a symlink has no content of its own. The earlier byte comparisons of `.pi/skills/sk-code/SKILL.md` and its child against the `.skilled` source are therefore tautological, which the empty `git ls-files` result for paths under the mirrors confirms.

Derived consequence: the updater's mutation target is the path under `.skilled/skills/<hub>/<child>/`. No mirror-level apply step exists for skill content, and there is no second copy to drift.

### F6. Framework release notes do not enumerate component versions

Observed. `.skilled/changelog/skilled/v4.0.0.2.md` names child deliverables narratively (`sk-doc` gains the create-goal mode, line 134) but carries no per-component version table. `.skilled/changelog/skilled/README.md` line 54 leaves each skill's history in `.skilled/skills/<skill>/changelog/`.

Consequence: per-component version truth stays where iterations 1 and 2 located it, in each component's `SKILL.md` plus its numerically newest changelog entry. The release is not a manifest of component versions.

## Questions Answered

**Q1b: answered. Composite children are independent units at the version, diff and apply layer, and not independent at the routing and identity layer.**

1. Independent versions: each composite child carries its own version frontmatter and its own changelog sequence, and neither moves with the hub by rule or by history (F1, F2, F3). The hub projections pin only the hub version.
2. Addressable units: each registered packet is a direct child directory of the hub (F4, check 3c), so `git diff <base>..<release> -- .skilled/skills/<hub>/<child>/` plus the child's `SKILL.md` version gives a clean per-unit delta without touching the hub's own version line.
3. Not independent identities: the hub stays the single advisor identity, packets carry no `graph-metadata.json` or `description.json` (checks 2a and 2b), and runtime skill registration names only the hub (both mirror paths resolve to hub directories).
4. Structural coupling only: leaf-inventory or routing changes pull the hub projections in, and that case is detectable with `generate-leaf-manifest.cjs --check` and doctor check 10 (F4).

Updater design constraints that follow (specification input, not implementation):

- Component granularity is the leaf packet directory. Comparison, delta and apply can be per packet, so a customized child never blocks an update of its pristine siblings.
- After applying a child update, `node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs --check <hub>` is a cheap post-apply gate. A failing check means the update changed the leaf inventory, and hub projection regeneration belongs in the same transaction.
- Customization detection (Q2) inherits this granularity: the per-child path range is the diff scope.

## Questions Remaining

- Q2 (next focus): which customization/override signals does this repository produce or could produce cheaply (three-way merge against the release base, provenance markers, hashes, git history)?
- Q3: how to build and present an alignment proposal for a customized skill while keeping its override specifics.
- Q4: one command or several, and what happens to today's database-rebuild behaviour of `/doctor:update`.
- Q5: each command's shape under the sk-create-command contract and reuse of install/sync scripts. Q1b adds a sub-item: whether hub-projection regeneration belongs in the same apply transaction as the child update.
- Q1a (carried): fallback path when the operator checkout has no git metadata or no gh auth.

## Next Focus

Q2, with one refinement from Q1b: scan for customization signals at leaf-packet granularity, and test whether a hub projection that diverges from its own generator output is itself usable as a structural-drift signal that needs no git history.

## SCOPE VIOLATIONS

None. Research actions were read-only. Writes were confined to this iteration's narrative and delta files, a temp event file, and the append gateway's own writes into the run directory.

## Graph Events (also emitted in the iteration record)

- `q1b` (QUESTION) answered by `f-iter003-001` through `f-iter003-004`.
- `f-iter003-005` (mirrors, one physical copy) supports the version-unit premise of `f-iter003-001`; `f-iter003-006` (release notes carry no component table) supports `f-iter003-002`.
- Sources: composite trees and git log (`src-iter003-001`), doctor and leaf-manifest tooling (`src-iter003-002`), `.opencode/SYNC.md` (`src-iter003-003`), release entry and changelog README (`src-iter003-004`).
