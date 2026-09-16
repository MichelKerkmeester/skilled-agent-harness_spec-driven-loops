---
title: "Implementation Plan: Phase 4: migration-design"
description: "Weighs four shapes for .opencode against what reads it today, resolves them through a decision tree on the phase 003 probes, and freezes a 25-step cutover with a check and a rollback on every step."
trigger_phrases:
  - "skilled layout options"
  - "opencode link decision tree"
  - "skilled cutover steps"
  - "second family design review"
importance_tier: "important"
contextType: "planning"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 4: migration-design

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash git hooks, Node.js CommonJS and ESM scripts, GitHub Actions YAML, Markdown |
| **Framework** | Seven CLI runtimes that read authored assets through links, plus the spec-kit toolchain |
| **Storage** | Git index and working tree, and ignored SQLite databases and `.state/` under `.opencode/skills/` in the main checkout |
| **Testing** | Hook test suite, generator `--check` modes, `validate.sh --strict` from the main checkout, live runtime loads |

### Overview
This phase writes no code. It picks what `.opencode/` becomes and the order in which phases 005 to 011 move the tree. Four layout shapes are weighed against what the repository proves reads `.opencode` today, and the phase 003 probes choose between the two shapes that survive. The cutover runs in 25 numbered steps: gates and dual-root code publish first, the tree moves in a rename-only commit held in the worktree, and the main checkout moves once, in phase 010, with the global hooks reinstalled directly after it.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 001 and 002 research read, with the blocker inventory and the map totals cited by line
- [ ] Phase 003 records exist for probes P1, P2 and P3, or record why a probe could not run
- [ ] The seven ordering constraints are listed with the steps that satisfy them

### Definition of Done
- [ ] ADR-001 to ADR-003 read Accepted
- [ ] All 25 cutover steps carry a check and a rollback, and step 24 is named the point of no return
- [ ] The GPT-5.6 review is adjudicated finding by finding
- [ ] `validate.sh --strict` from the main checkout prints `RESULT: PASSED` for this folder
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Source root with a resolvable compatibility name. `.skilled/` holds the real files, runtime directories link to `.skilled/` directly, and `.opencode` stays a name that resolves into `.skilled/` for the readers that cannot be moved: opencode itself, root discovery, the global hooks until step 20 and consumer projects.

### Key Components
- **`.skilled/`**: the authored tree of skills, commands, agents, hooks, plugins, bin, scripts, install guides, changelogs and the playbook link.
- **`.opencode`**: the compatibility name. Its shape is ADR-001's decision.
- **Runtime directories**: `.claude`, `.codex`, `.cursor`, `.devin`, `.hermes` and `.pi`, whose links move from `.opencode` targets to `.skilled` targets in phase 008.
- **Gates**: seven hooks installed machine-wide from the main checkout, 19 workflows that name `.opencode`, and one new independent move check that lives outside both roots.
- **External state**: seven global hook links, six home-level files, ten consumer links and 184 ignored entries under the main checkout's `.opencode/`.

### Data Flow
A runtime, a gate or a consumer names a path. Under the chosen layout that path resolves through `.opencode` or directly into `.skilled/`, and the operating system follows the links. CommonJS code that asks for its own location gets the real path (`PUBLIC-RELEASE.md:32` records this for consumer links today), so it sees `.skilled/`. Whether opencode's plugin host does the same is part of probes P1 and P2. Git never follows a directory link: it records every change under `.skilled/`, which is why each path filter that names `.opencode/` has to learn the second root before anything moves.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:layout-options -->
## LAYOUT OPTIONS

### What reads `.opencode` today

| Reader | What it needs | Evidence |
|--------|---------------|----------|
| opencode runtime | Plugins by a flat glob, every skill, agents, the `code_mode` launcher and the `@opencode-ai/plugin` dependency | `.opencode/plugins/README.md:16`, `.opencode/skills/cli-external-orchestration/cli-opencode/README.md:47`, `.opencode/skills/cli-external-orchestration/cli-opencode/SKILL.md:214`, `opencode.json:10-19`, `.opencode/package.json:3-5` |
| Root discovery | The sentinel file, and a literal `.opencode` segment for the fallback hoist | `.opencode/skills/system-spec-kit/shared/workspace/repo-root.mjs:27`, `:38-46` |
| MCP launcher | A server path built from literal `.opencode` segments | `.opencode/bin/mcp-code-mode-launcher.cjs:19-28` |
| Devin | A native scan of `.opencode/skills/` with no mirror | `.devin/SYNC.md:20`, `:39` |
| Global git hooks | Seven absolute links into the main checkout's `.opencode/scripts/git-hooks/` | `ls -l ~/.config/git/hooks` on 2026-09-16, `.opencode/scripts/install-git-hooks.sh:30-31` |
| Consumer projects | A link named `.opencode` to `Public/.opencode`. Ten exist within five levels of `~/MEGA/Development`: four projects and six worktrees | `PUBLIC-RELEASE.md:22`, `find ~/MEGA/Development -maxdepth 5 -name .opencode -type l` on 2026-09-16 |
| Spec compatibility | `.opencode/specs -> ../specs` | `.opencode/bin/check-no-spec-imports.cjs:26-32`, `.opencode/skills/system-spec-kit/runtime/cli/core/spec-root-migration.ts:356-357` |

### The four shapes

| ID | Shape | Keeps working | Breaks or depends on | Score |
|----|-------|---------------|----------------------|-------|
| L1 | `.opencode` becomes one tracked relative link to `.skilled` | Every reader above, with no rewrite needed on the day of the move | Probes P1 and P3. Filters naming `.opencode/` see nothing. opencode's install files (`package.json`, `bun.lock`, `node_modules`) live in `.skilled/` | 8/10 |
| L2 | `.opencode/` stays a real directory holding one relative link per moved entry | The same readers, and opencode's install files can stay in `.opencode/` | Probes P2 and P3. A plugin reached through `.opencode/plugins` may resolve bare imports from `.skilled/`, so P2 decides where `node_modules` lives. A walker that starts at `.opencode/` meets links as child entries, and the leaf-manifest walker is one that treats a child link as a non-directory (`.opencode/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:104-111`) | 6/10 |
| L3 | `.opencode/` keeps only opencode-mandated entries: plugins, skills, agents, commands, the launcher and install files | opencode and root discovery | Drops `scripts`, `hooks` and the rest, so the seven global hooks dangle when the main checkout moves (`001-deep-research/research/research.md:59`) and consumer paths into dropped entries break. Every reference into a dropped entry becomes a precondition of the move, which puts content edits ahead of the rename | 4/10 |
| L4 | `.opencode` is removed | Nothing that names it | Violates parent D5 (`../goal.md:50`): opencode, root discovery and ten consumer links stop resolving | 1/10 |

L1 against L2 is the real choice. L1 keeps one tree, so a module reached through either name resolves its dependencies from the same `node_modules`, and a walker that starts below `.opencode` never meets a link. L2 keeps opencode's install files out of `.skilled/` at the cost of a possible split between where opencode installs a dependency and where a plugin looks for it. L3 is a later shrink rather than a day-one shape: once the phase 009 rescan shows nothing names a dropped entry, a follow-up can remove those links from an L2 layout.
<!-- /ANCHOR:layout-options -->

---

<!-- ANCHOR:decision-tree -->
## DECISION TREE ON PHASE 003

### Probe inputs

| ID | Question | Source | Decides |
|----|----------|--------|---------|
| P1 | With `.opencode` a link to a real `.skilled/`, does `opencode run` load plugins by the flat glob, resolve `@opencode-ai/plugin`, load skills, agents and commands, and start the `code_mode` launcher? | `001-deep-research/research/research.md:69`, `:163` | L1 |
| P2 | With `.opencode/` real and `plugins`, `skills`, `agents`, `commands` and `bin` as links into `.skilled/`, does the same hold with install files in `.opencode/` (P2a) or in `.skilled/` (P2b)? | `002-per-runtime-reference-map/research/research.md:170` | L2 and its variant |
| P3 | Does Devin discover skills when `.opencode/skills` resolves through a link, for the whole-directory shape and the per-entry shape? | `001-deep-research/research/research.md:69` | L1 or L2 |
| P4 | With `.opencode` resolving through a link, do hook scripts run while their staged-path filters miss changes under `.skilled/`? | `001-deep-research/research/research.md:87`, `:165` | How steps 2 and 3 are verified, not the order |
| P5 | Does git fail or skip when a hook under `core.hooksPath` is a dangling link? | `001-deep-research/research/research.md:164` | Whether step 20 adds a hook-execution proof |
| P6 | Does a rehearsed push range record every moved file as a rename, and does pre-push Gate 0 count any of them as a deletion? | `001-deep-research/research/research.md:166`, `.opencode/scripts/git-hooks/pre-push:97-119` | Push mechanics in step 24 |
| P7 | When a checkout with a real `.opencode/` holding ignored files fast-forwards to the moved tree, does git refuse, remove the ignored files or leave them? | Added by this design | Whether a skipped relocation in step 19 fails loudly or silently |
| P8 | Can any runtime be pointed at a root other than its own directory name? | `001-deep-research/research/research.md:162` | Nothing under parent D5, only a later simplification |
| P9 | Do Pi extension imports still resolve through a second link hop? | `002-per-runtime-reference-map/research/research.md:170` | Whether step 15 must precede step 19, which it already does |

Phase 003 numbers its probes by question, so its ids differ from the ones above. Read each input from this record:

| Input here | Phase 003 probe and record |
|------------|----------------------------|
| P1 | Q2 rows R1, R2, R3, R12 and R13 in shape A, `003-layout-probes/probes/runtime-symlink-resolution.md` |
| P2a, P2b | The same rows in shape B (P2a) and rows R1 and R13 in shape B2 (P2b), same record |
| P3 | Q2 row R4 in shapes A and B, same record |
| P4 | Q4, `003-layout-probes/probes/gate-filters-under-linked-root.md` |
| P5 | Q3, `003-layout-probes/probes/dangling-hook-behavior.md` |
| P6, P7 | Q5 and its final checkout over ignored build output, `003-layout-probes/probes/rename-rehearsal.md` |
| P8 | Q1, `003-layout-probes/probes/runtime-root-configurability.md` |
| P9 | Q2 row R5 in shape B, `003-layout-probes/probes/runtime-symlink-resolution.md` |

P6 has to be measured over the whole push range, not the rename commit alone: Gate 0 compares the remote tip with the local tip in one diff (`.opencode/scripts/git-hooks/lib/mass-deletion-guard.sh:45-47`), so a moved file that phase 009 also edited needs inexact rename detection to count as a rename.

### The tree

```text
Start
 |
 +-- P1 passes AND P3 passes for the whole-directory link
 |     -> L1: .opencode -> .skilled
 |
 +-- otherwise: (P2a OR P2b passes) AND P3 passes for per-entry links
 |     -> L2: .opencode/<entry> -> ../.skilled/<entry>
 |        install files stay in .opencode/ when P2a passes,
 |        and move to .skilled/ when only P2b passes
 |
 +-- otherwise, P1 and P2 both fail
 |     -> STOP: no link shape serves opencode. The probe voids the design
 |        (parent D2). Escalate with the probe records.
 |
 +-- otherwise, P3 fails for every shape
       -> STOP: Devin loses native skills, which contradicts the
          no-mirror decision in .devin/SYNC.md:20. Escalate.
```

### Modifiers once the layout is chosen

- **P4**: confirmed or refuted, steps 2 and 3 are verified the same way, with a staged `.skilled/` change that must trip each gate.
- **P5**: if git skips a dangling hook silently, step 20 adds a proof commit in a scratch repository whose hook prints a marker. If git fails loudly, the proof is optional.
- **P6**: if every moved file counts as a rename and Gate 0 counts no deletion beyond the placeholder, step 24 pushes with no bypass. Otherwise step 24 pushes once with `SPECKIT_ALLOW_MASS_DELETION=1`, and only after step 12 lists every deletion and each one is expected.
- **P7**: any answer leaves step 19 unchanged, because it relocates ignored state before the fast-forward. A refusal makes a skipped relocation loud. A silent removal makes step 18's archive the only copy.
- **P8**: no change.
- **P9**: if the second hop fails, step 15 already retargets the `.pi/extensions` links to `.skilled/` before step 19 moves the main checkout.

### When phase 003 leaves a probe unrun

P4 to P9 have a safe default: every step that depends on them is ordered to be correct under each answer, so the order stands and the step records "not probed". P1, P2 and P3 have no default. Without them ADR-001 stays Proposed and phase 005 does not start (parent D1, `../goal.md:46`).
<!-- /ANCHOR:decision-tree -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

The contract files the cutover changes, which the second-family review covers.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `repo-root.mjs` | Root sentinel and `.opencode` hoist (`repo-root.mjs:27`, `:38-46`) | Update in step 6: accept either sentinel, hoist above either segment | Owning suite passes with a start path under each root |
| `mcp-code-mode-launcher.cjs` | Server path from literal segments (`:19-28`) | Update in step 6: resolve under whichever root exists | Launcher starts from both roots in a rehearsal clone |
| `install-git-hooks.sh` | Owns the seven hook links, judging ownership by the target's path prefix (`:30`, `:58-67`, `:138-142`) | Update in step 6: treat a link into either root as its own | A reinstall replaces seven `.opencode` links and `readlink` shows `.skilled` |
| Hook drivers | Filters, pathspecs and checker paths name `.opencode/` (`pre-commit:95`, `:143-145`, `:168-180`, `pre-push:37`, `:121`, `prepare-commit-msg:47-50`, `post-commit:20-22`) | Update in step 2 | A staged `.skilled/` change trips each gate in a disposable clone |
| 19 workflows | `paths:` filters and skip-on-missing guards (`.github/workflows/markdown-link-integrity.yml:6-13`, `:29-33`, `.github/workflows/spec-kit-check.yml:4-20`) | Update in step 4 | Each workflow's path filter matches a `.skilled/` sample path, and a missing guard fails |
| `.gitignore` | 62 lines name `.opencode`, and `:7-10` negates the global `/.opencode/` ignore | Update in step 7: add `.skilled/` twins, keep the originals | Ignored-entry count unchanged across a rehearsed move |
| `opencode.json` | Launches `.opencode/bin/mcp-code-mode-launcher.cjs` (`:15`) | Unchanged, kept by ADR-003 | opencode starts `code_mode` in step 23 |
| `PUBLIC-RELEASE.md` | Consumer contract `.opencode -> Public/.opencode` (`:22`) | Contract unchanged, one sentence added in step 17 on where the link now resolves | Consumer links resolve in step 22 |
| `check-no-spec-imports.cjs`, `spec-root-migration.ts` | The `.opencode/specs` compatibility contract | Update in step 6: accept both roots | Guard passes at both roots |
| Runtime mirror generators | Write links and files naming `.opencode/commands` (`.opencode/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs:41`) | Inputs switch in step 13 | Every owner's `--check` passes after step 14 |
| `.opencode/bin/lib/compiled-routing/serving-closure.manifest.json` | Records `runtimeRoot` as `.opencode/bin/lib/compiled-routing` (`:4`) | Regenerated in step 16 | The compiled-route check passes |

Required inventories:
- Same-class producers: evidence unit E1 lists every hook line naming `.opencode`, E2 every workflow line and E3 every `.gitignore` line.
- Consumers of changed symbols: map A (435 links), map B (231 runtime files and 36 home-level paths), map C (4,029 references), the ten consumer links and the seven global hooks.
- Matrix axes: layout (L1, L2) by checkout kind (the worktree, the main checkout, another linked worktree on an old branch, a consumer project), eight rows in step 22's proof.
- Algorithm invariant: a path that resolved before the move resolves after it for every reader in the layout table, and git records changes only under `.skilled/`. Adversarial cases for step 6: a nested `.opencode/` planted under a wrong root (`repo-root.mjs:4-7`), a consumer link chained through `Public/.opencode`, a start path under each root, and a walker that meets a link as a child entry.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:cutover-sequence -->
## CUTOVER SEQUENCE

Frozen once ADR-002 is Accepted. A step starts only after the previous step's check passed. `<L1>` and `<L2>` mark the only layout-dependent lines, which T008 fixes once ADR-001 resolves.

### Ordering constraints

| Constraint | Satisfied by |
|------------|--------------|
| Gates and CI learn the new root before anything moves, because they skip when their scripts or filters miss (`001-deep-research/research/research.md:75-87`) | Steps 2 to 5 before step 11 |
| Dual-root code lands before the move | Steps 6 to 8 before step 11 |
| The `.skilled/` placeholder is handled before any `git mv` (`001-deep-research/research/research.md:73`) | Step 10 before step 11 |
| Renames land in commits separate from content edits (`.opencode/skills/sk-git/references/large-reorg-playbook.md:82-85`) | Steps 10 and 11 are their own commits, and steps 13 to 17 are content or regeneration commits |
| The seven global hooks are reinstalled when the main checkout's tree moves | Step 20 directly after step 19 |
| Generated files are regenerated by their owners, never text-edited | Steps 14 and 16 |
| Toolchain validation runs on the main checkout's toolchain | Every `validate.sh` call names the main checkout's script, and step 22 re-runs every check on the moved main checkout |

### Phase 005: gate and CI readiness (published)

1. **Guard every executing session.**
   - **Does**: Export `SPECKIT_AUTOSYNC=0`, so the post-commit hook never publishes a worktree commit to the live branch (`.opencode/scripts/git-hooks/post-commit:26-32`). Stage explicit pathspecs only, never `git add -A`, because four untracked `containment/` directories in this packet hold 396 files.
   - **Check**: `echo "$SPECKIT_AUTOSYNC"` prints `0`, and after every commit `git ls-remote origin refs/heads/skilled/v4.0.0.0` prints the SHA it printed before that commit, until a step publishes on purpose.
   - **Rollback**: None needed, the step changes no file.
2. **Teach the hook drivers both roots.**
   - **Does**: Every staged-path filter and pathspec in the seven hooks matches `.opencode/` and `.skilled/`, checker paths resolve under `.skilled/` first, and a checker missing from a checkout that ships the toolchain blocks the commit instead of continuing past it (`pre-commit:180`).
   - **Check**: The tests under `.opencode/scripts/git-hooks/tests/` pass, and in a disposable clone `git -c core.hooksPath=<clone>/.opencode/scripts/git-hooks commit` of a staged `.skilled/agents/` change is blocked by the agent mirror gate.
   - **Rollback**: `git revert <step-2 commit>`.
3. **Add the independent move check.**
   - **Does**: A script outside both `.opencode/` and `.skilled/`, for example under `.github/scripts/`, asserts that the root sentinel resolves, that no link dangles beyond the eight map A records as dangling today (`map-a-symlinks.tsv` lines 204, 209, 336, 358, 429 and 431 to 433), that each gate script exists under the resolved root, and that each workflow path filter matches a `.skilled/` sample path.
   - **Check**: It exits non-zero on a disposable clone with one gate script deleted and one runtime link broken, and exits 0 on the unbroken tree.
   - **Rollback**: `git revert <step-3 commit>`.
4. **Teach CI both roots.**
   - **Does**: Add a `.skilled/**` twin to every `paths:` entry naming `.opencode/`, resolve guard paths under either root, and turn each skip-on-missing guard into a failure when either root is present. Twelve workflows match a skip pattern by the 2026-09-16 count, and evidence unit E2 lists them by line.
   - **Check**: `grep -l "'\.opencode/" .github/workflows/*.yml` and `grep -l "'\.skilled/" .github/workflows/*.yml` list the same files, and step 3's check passes its workflow-filter assertion.
   - **Rollback**: `git revert <step-4 commit>`.
5. **Publish phase 005 and move the main checkout's hook drivers.**
   - **Does**: Push the phase 005 commits to `skilled/v4.0.0.0` and `main` (parent D2), then fast-forward the main checkout, because the global hooks run the main checkout's copies.
   - **Check**: `git -C <main checkout> merge-base --is-ancestor <step-4 commit> HEAD` exits 0, and `grep -c skilled <main checkout>/.opencode/scripts/git-hooks/pre-commit` prints a number above 0.
   - **Rollback**: Revert the phase 005 commits on `skilled/v4.0.0.0` and `main`, push, and fast-forward the main checkout again. The changes are backward compatible, so the revert restores the earlier behavior in full.

### Phase 006: dual-root code and contracts (published)

6. **Make discovery, the launcher, the installers and the compatibility contracts dual-root.**
   - **Does**: `repo-root.mjs` accepts either sentinel and hoists above either segment. The launcher resolves the server under whichever root exists. `install-git-hooks.sh` treats a link into either root's `scripts/git-hooks/` as its own, so a reinstall replaces the seven `.opencode` links instead of skipping them (`install-git-hooks.sh:58-67`, `:138-142`). `.opencode/bin/install-codex-hooks.mjs`, `check-no-spec-imports.cjs` and `spec-root-migration.ts` accept both roots.
   - **Check**: The owning suites pass on the unmoved tree and on a disposable clone where the move is rehearsed, and `findRepoRoot()` prints the clone root from a start path under each root.
   - **Rollback**: `git revert <step-6 commit>`.
7. **Add `.gitignore` twins.**
   - **Does**: For each ignore rule and negation that names `.opencode/`, add the same line under `.skilled/` and keep the original.
   - **Check**: Every row evidence unit E3 marks as a rule has its `.skilled/` twin in `.gitignore`, and in the rehearsal clone `git ls-files -o -i --exclude-standard --directory | wc -l` prints the same number before and after the rehearsed move.
   - **Rollback**: `git revert <step-7 commit>`.
8. **Publish phase 006 and fast-forward the main checkout.**
   - **Does**: Push to `skilled/v4.0.0.0` and `main`, fast-forward the main checkout, and restart the `code_mode` launcher so it runs the dual-root code.
   - **Check**: `validate.sh --strict` from the main checkout prints `RESULT: PASSED` for this packet's phases, and in a disposable clone at the commit before phase 005 a commit runs the global hooks without an error line.
   - **Rollback**: As in step 5.

### Phase 007: source-root move (held in the worktree)

9. **Open the held window.**
   - **Does**: Rebase the worktree branch onto the current `skilled/v4.0.0.0`, record the base SHA and `git ls-files .opencode | wc -l` (17,767 on 2026-09-16), and record the ignored entries under `.opencode/` in `007-source-root-move/scratch/ignored-before-move.txt`.
   - **Check**: `git status --porcelain --untracked-files=no` prints nothing, and `git merge-base --is-ancestor <step-8 tip> HEAD` exits 0.
   - **Rollback**: `git rebase --abort` during the rebase, or `git reset --hard ORIG_HEAD` directly after it, before any new commit.
10. **Retire the placeholder in its own commit.**
    - **Does**: `git rm -r .skilled/future-task-placeholder-move-opencode-contents-to-here-and-relative-symlink-back`, commit, and delete `.skilled/` by hand if only ignored cruft keeps it on disk.
    - **Check**: `git ls-files .skilled | wc -l` prints `0`, and `test ! -e .skilled && echo absent` prints `absent`.
    - **Rollback**: `git revert <step-10 commit>`.
11. **Move the tree in one rename-only commit.**
    - **Does**: `<L1>` `git mv .opencode .skilled`, move any entry from step 9's ignored list that stayed behind into `.skilled/`, remove the emptied `.opencode/`, then `ln -s .skilled .opencode` and `git add .opencode`. `<L2>` `mkdir .skilled`, then for each moved entry `git mv .opencode/<entry> .skilled/<entry>`, `ln -s ../.skilled/<entry> .opencode/<entry>` and `git add .opencode/<entry>`. ADR-003 names what stays in `.opencode/` under L2. No file content changes in this commit.
    - **Check**: `git diff --cached -M --name-status | grep -c '^R'` prints step 9's recorded count for L1, or the per-entry total for L2. `git diff --cached -M --name-status | grep -E '^[ADM]'` lists only the new link or links. `test -e .opencode/skills/system-spec-kit/SKILL.md` exits 0, and step 3's check exits 0.
    - **Rollback**: Before step 12, `git reset --hard <step-10 commit>`, move step 9's ignored entries from `.skilled/` back into `.opencode/`, and confirm `test ! -e .skilled`. After a later commit, `git revert <step-11 commit>` followed by the same move.
12. **Prove the rename kept history.**
    - **Does**: A read-only proof on the committed move.
    - **Check**: For one file each under `skills/`, `commands/`, `agents/`, `hooks/` and `bin/`, `git log --follow --oneline -- .skilled/<path> | wc -l` prints more than 1, and `git show --name-status -M <step-11 commit> | grep -E '^D'` prints nothing. That empty list is P6's input for step 24.
    - **Rollback**: None needed, read-only. A failed check sends the move back to step 11's rollback.

### Phase 008: links and generated state (held)

13. **Switch the generator inputs to `.skilled`.**
    - **Does**: One content commit changes each generator's source-root constant, starting with `sync-runtime-mirrors.cjs:41`.
    - **Check**: Each generator's own tests pass, and `git grep -n "'\.opencode/commands'" -- .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors` prints nothing.
    - **Rollback**: `git revert <step-13 commit>`.
14. **Regenerate generator-owned links and runtime files.**
    - **Does**: Run each owner (runtime mirrors, the Codex, Pi and Hermes prompt and agent sync, hook registrations and Gate 1 pointers) and commit each owner's output as its own regeneration commit. This covers the 146 generated links and 198 generated runtime files (`002-per-runtime-reference-map/research/maps/reconciliation.json:11`, `:19`).
    - **Check**: Every owner's `--check` exits 0 in the worktree, each owner whose outputs named `.opencode` shows a non-empty `git show --stat`, and `git grep -n '/worktrees/public/055' -- .claude .codex .cursor .devin .hermes .pi` prints nothing. Step 22 repeats the `--check` runs on the main checkout.
    - **Rollback**: `git revert` the regeneration commits. The owners are idempotent, so re-running them on the reverted tree reproduces the earlier output.
15. **Retarget the hand-made links.**
    - **Does**: Point the 27 hand-made links (`reconciliation.json:12`) at `.skilled/` using map A's `target_if_no_compat` column, including `.claude/skills`, `.pi/skills`, `.hermes/agents`, the seventeen `.pi/extensions` links and the playbook links.
    - **Check**: `readlink .claude/skills` prints `../.skilled/skills`, and `find . -name node_modules -prune -o -type l ! -exec test -e {} \; -print` lists only the eight links map A records as dangling today.
    - **Rollback**: `git revert <step-15 commit>`.
16. **Regenerate the derived artifacts.**
    - **Does**: Delete `.pytest_cache` under skill roots, then rebuild with each owner: the trigger index, the 13 skill `graph-metadata.json` files, the compiled-routing manifest (`serving-closure.manifest.json:4`), the compiled deep-loop contracts and the absolute-path class that phase 001 counts at roughly 517 files (`001-deep-research/research/research.md:85`). `council-graph.sqlite` waits for a named owner and is never text-edited.
    - **Check**: Each owner's check or freshness mode exits 0, `.opencode/skills/sk-doc/sk-create-skill/scripts/ci-leaf-manifest-freshness.cjs` passes, and `git grep -l '/Public/\.opencode/'` lists only files ADR-003 keeps or the frozen class holds.
    - **Rollback**: `git revert` the regeneration commits and re-run the owners.

### Phase 009: reference rewrite (held)

17. **Rewrite the mechanical references by area.**
    - **Does**: One content commit per map C area rewrites the 2,938 mechanical rows to `.skilled`, leaves the 968 frozen rows and the ADR-003 keep-list alone, settles the 98 manual rows one decision each (`reconciliation.json:22-25`), and rewrites the 35 recorded fixtures only together with the assertion that reads them.
    - **Check**: Re-running `002-per-runtime-reference-map/scratch/build-seed-inventory.py` over tracked files, excluding `**/containment/**`, lists no row outside the keep-list and the frozen class, and the suites of each rewritten area pass.
    - **Rollback**: `git revert` the area commit that failed.

### Phase 010: machine and consumer cutover (the main checkout moves here)

18. **Capture the main checkout's state.**
    - **Does**: Record `git -C <main checkout> rev-parse HEAD`. Stop the processes that hold files under `.opencode/`, including the `code_mode` launcher and the skill advisor daemon, whose lease sits at `.opencode/skills/.state/advisor/skill-graph-daemon-lease.sqlite`. Archive the ignored entries under `.opencode/` (184 on 2026-09-16, four of them SQLite databases) to a timestamped directory outside the repository. Save `ls -l ~/.config/git/hooks` and copies of `~/.codex/hooks.json`, `~/.codex/config.toml`, `~/.hermes/config.yaml`, `~/.claude.json`, `~/.zshrc` and `~/.pi/agent/SYNC.md`. Settle the modified `council-graph.sqlite` with its owner.
    - **Check**: The archive's entry count equals `git -C <main checkout> ls-files -o -i --exclude-standard --directory .opencode | wc -l`, each SQLite file's `shasum` matches its copy, and `git -C <main checkout> status --porcelain --untracked-files=no` prints nothing.
    - **Rollback**: Restart the stopped processes. The step only copies files.
19. **Check drift, relocate ignored state, fast-forward.**
    - **Does**: Confirm no live-branch commit touched `.opencode/` since step 9, and if one did, rebase the worktree branch and repeat the checks of steps 11, 12 and 14 to 17. Move each archived ignored entry that sits under a moved entry from `.opencode/<path>` to `.skilled/<path>`, where step 7's twins ignore it. Then run `git -C <main checkout> merge --ff-only worktrees/055-skilled-source-root-migration`.
    - **Check**: `git log <step-9 base>..origin/skilled/v4.0.0.0 -- .opencode` prints nothing before the merge. After it, `git -C <main checkout> rev-parse HEAD` equals the worktree tip, `test -e <main checkout>/.opencode/skills/system-spec-kit/SKILL.md` exits 0, and the SQLite checksums under `.skilled/` match step 18's.
    - **Rollback**: `git -C <main checkout> reset --hard <step-18 SHA>`, restore the archive into `.opencode/`, and restart the processes.
20. **Reinstall the seven global hooks at that moment.**
    - **Does**: From the moved main checkout, run `bash .skilled/scripts/install-git-hooks.sh`. If P5 showed git skips a dangling hook silently, also make a proof commit in a scratch repository whose hook prints a marker.
    - **Check**: `readlink ~/.config/git/hooks/<hook>` names `<main checkout>/.skilled/scripts/git-hooks/<hook>` for all seven hooks, and `bash .skilled/scripts/install-git-hooks.sh --status` prints no `SHADOWED` line.
    - **Rollback**: Recreate each link from step 18's listing with `ln -sf <old target> ~/.config/git/hooks/<hook>`. The old targets resolve for as long as `.opencode` does.
21. **Update the home configs.**
    - **Does**: Run `install-codex-hooks.mjs`, which writes a timestamped backup when it changes an existing file (`.opencode/bin/install-codex-hooks.mjs:414-421`). Edit `~/.hermes/config.yaml:17`, `~/.codex/config.toml:21`, the one match in `~/.claude.json`, `~/.zshrc:3` and `:32`, and `~/.pi/agent/SYNC.md`.
    - **Check**: `grep -c '\.opencode' <file>` prints, for each file, the count ADR-003 keeps, and Codex, Hermes and Pi each start a session that loads a skill.
    - **Rollback**: Copy each file back from step 18's backups.
22. **Prove the consumers and re-validate on the main checkout's toolchain.**
    - **Does**: Walk the ten consumer links and re-run every check from steps 2 to 17 on the moved main checkout.
    - **Check**: For each link printed by `find ~/MEGA/Development -maxdepth 5 -name .opencode -type l`, `test -e <link>/skills/system-spec-kit/SKILL.md` exits 0. On the main checkout every generator `--check` exits 0, and `validate.sh --strict` prints `RESULT: PASSED` for each phase of this packet.
    - **Rollback**: Step 19's rollback. Consumer projects carry no change of their own under L1 or L2.

### Phase 011: verification and rollout

23. **Prove every runtime on `.skilled/`.**
    - **Does**: In each of the seven runtimes, load one skill, one command and one agent that resolve into `.skilled/`, and start opencode's `code_mode` launcher.
    - **Check**: Each runtime's transcript names the loaded skill, command and agent, and `realpath` of each loaded file starts with `<main checkout>/.skilled/`.
    - **Rollback**: Step 19's rollback, while nothing is pushed.
24. **Push the moved tree. This is the point of no return.**
    - **Does**: Push to `skilled/v4.0.0.0`, then to `main` (parent D2). If P6 showed Gate 0 counts deletions in the push range, push once with `SPECKIT_ALLOW_MASS_DELETION=1`, and only after step 12's list shows every deletion is expected.
    - **Check**: `git ls-remote origin` shows both branches at the tip, and CI on the tip adds no failure to the per-workflow failure sets phase 005 recorded before its first change, and step 3's independent check passes.
    - **Rollback**: None restores the earlier state. Recovery is a forward fix: a revert range pushed as new commits, then steps 21 and 20 in reverse on every machine that pulled the moved tree.
25. **Clean up.**
    - **Does**: Once `git log origin/skilled/v4.0.0.0..worktrees/055-skilled-source-root-migration` prints nothing, remove this packet's untracked `containment/` directories and worktree 055, then run the runbook's leftover scan (`large-reorg-playbook.md:112-127`) on the main checkout.
    - **Check**: `git worktree list` no longer lists 055, and a second run of the leftover scan prints nothing.
    - **Rollback**: None needed. The branch stays on origin until someone deletes it.

### Surface class traceability

| Surface class | Source | Step |
|---------------|--------|------|
| Runtime links, generator-owned (146) | `reconciliation.json:11` | 14 |
| Runtime links, hand-made (27) | `reconciliation.json:12` | 15 |
| Links inside `.opencode/` that travel intact (203 of 208) | `002-per-runtime-reference-map/research/research.md:20` | 11 |
| Generated runtime files (198) | `reconciliation.json:19` | 14 |
| The 12-file `.claude/agents` fork | `002-per-runtime-reference-map/research/research.md:77` | 17 |
| Root sentinel and launchers | `001-deep-research/research/research.md:97` | 6 |
| Derived state and the absolute-path class | `001-deep-research/research/research.md:85`, `:98` | 16 |
| Hook drivers | `001-deep-research/research/research.md:99` | 2 |
| CI workflows (19) | `001-deep-research/research/research.md:82` | 4 |
| `.gitignore` lines (62) | `../spec.md:83` | 7 |
| The `.skilled/` placeholder | `001-deep-research/research/research.md:73` | 10 |
| The authored tree (17,767 tracked files) | `001-deep-research/research/research.md:112` | 11 |
| Global git hooks (7) | `001-deep-research/research/research.md:59` | 20 |
| Home configs (6 manual rows) | `reconciliation.json:28` | 21 |
| Consumer contract | `001-deep-research/research/research.md:57` | 22 |
| Ignored state in the main checkout (184 entries) | `git ls-files -o -i --exclude-standard --directory .opencode` on 2026-09-16 | 19 |
| Code and documentation references (2,938 mechanical, 98 manual, 968 frozen) | `reconciliation.json:22-25` | 17 |

### Blocker resolution

| Blocker | Resolution | Where |
|---------|------------|-------|
| B1, `.opencode` is a published contract | Routed around: `.opencode` stays a resolvable name under L1 or L2, so consumer links need no edit | ADR-001, step 22 |
| B2, the global hooks dangle when the main checkout moves | Routed around by the layout, since the absolute targets resolve through `.opencode`. Resolved by a reinstall with a dual-root installer | Steps 6 and 20 |
| B3, four external references | Resolved outside Git, with backups and a per-file count check | Steps 18 and 21 |
| B4, runtime behavior through links is unproven | Routed to probes P1 to P3, which select the layout | Decision tree |
| B5, a one-commit landing breaks the rename doctrine | Resolved: placeholder, rename and content land in separate commits | Steps 10, 11 and 13 to 17 |
| B6, `git mv` nests into the existing `.skilled/` | Resolved: the placeholder goes first and step 10 requires `.skilled` to be absent | Steps 10 and 11 |
<!-- /ANCHOR:cutover-sequence -->

---

<!-- ANCHOR:review-plan -->
## SECOND-FAMILY REVIEW PLAN

Parent D3 gives the layout, the cutover order and the contract files a second model family (`../goal.md:48`). The review runs once, after the phase 003 records resolve ADR-001, on the resolved design rather than on its branches.

| # | Unit | Executor | Output |
|---|------|----------|--------|
| R1 | Write a short literal brief: the resolved ADR-001 to ADR-003, the 25 steps, the affected-surfaces table and the probe verdicts, with five questions. Which check can pass while its step failed? Which rollback misses ignored state, hook links or home configs? Which order breaks one of the seven constraints? Which contract change breaks a consumer? Is step 24 the right point of no return? | Orchestrator on Opus | `review/design-review-brief.md` |
| R2 | Run the review read-only | GPT-5.6 sol at `xhigh` on cli-codex | `review/gpt-5-6-sol-design-review.md` |
| R3 | Rule on every finding: accept and amend, reject with evidence, or defer to a named task in a later phase | Orchestrator on Opus | An adjudication table in `decision-record.md`, one row per finding |
| R4 | Apply the accepted amendments, re-validate, and set ADR-001 to ADR-003 to Accepted | Orchestrator on Opus | `decision-record.md`, `validate.sh` output |

R2's dispatch shape follows the cli-codex contract: the model and effort mapping (`.opencode/skills/cli-external-orchestration/cli-codex/SKILL.md:227`), the read-only sandbox for review (`:269`), stdin from `/dev/null` (`:272`) and the child waiver (`:284`). `gpt-5.6-sol` is the roster's model for verification and review (`.opencode/skills/cli-external-orchestration/cli-codex/references/providers-and-models.md:53`). Run it from the worktree root with `PHASE` set to this folder's path:

```bash
AI_SESSION_CHILD=1 codex exec --model gpt-5.6-sol -c model_reasoning_effort="xhigh" -c service_tier="fast" \
  --sandbox read-only -o "$PHASE/review/gpt-5-6-sol-design-review.md" \
  "$(cat "$PHASE/review/design-review-brief.md")" </dev/null
```

The brief opens with the child-dispatch preamble and an inlined review persona, because a model cannot see an environment variable and Codex has no persona surface of its own (`cli-codex/SKILL.md:284`, `:286`). One dispatch runs at a time, and cleanup kills only its own captured PID (`cli-codex/SKILL.md:283`).
<!-- /ANCHOR:review-plan -->

---

<!-- ANCHOR:delegation -->
## DELEGATION

Parent D3 keeps judgment with the orchestrator and Opus (`../goal.md:48`). Bounded evidence gathering goes to DeepSeek V4.1 Flash at `max` on cli-pi through the LLM Gateway. Each unit gets one short literal brief, writes to a kebab-case file under `evidence/`, and is verified by the orchestrator before anything cites it.

| Unit | Brief (literal) | Output | Orchestrator verification |
|------|-----------------|--------|---------------------------|
| E1 | "Read-only. In the worktree root, list every line in the seven hook files under `.opencode/scripts/git-hooks/` that names `.opencode`. One markdown table: hook, line number, literal text, kind (filter, pathspec, checker path, message). No commentary." | `evidence/hook-opencode-lines.md` | Row count per hook equals `grep -c '\.opencode'` for that hook, and three rows are opened by line |
| E2 | "Read-only. For each file in `.github/workflows/` that names `.opencode`, list its `paths:` lines, guard path lines and any line that exits 0 when a file is missing. One markdown table: workflow, line number, literal text, kind. No commentary." | `evidence/ci-workflow-root-surface.md` | The table covers 19 workflows, and three of them are opened by line |
| E3 | "Read-only. List every line of `.gitignore` that names `.opencode`, with its line number and whether it is a comment, an ignore rule or a negation. One markdown table. No commentary." | `evidence/gitignore-root-rules.md` | Row count equals `grep -c '\.opencode' .gitignore`, 62 on 2026-09-16 |
| E4 | "Read-only. From `specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/002-per-runtime-reference-map/research/maps/map-a-symlinks.tsv`, output every row whose `class` column is `mechanical`, with the columns `link`, `raw_target`, `target_if_opencode_compat_kept` and `target_if_no_compat`. One markdown table. No commentary." | `evidence/hand-made-link-targets.md` | Row count equals 27 (`reconciliation.json:12`), and three rows are compared with the TSV |

The dispatch shape follows the cli-pi contract: stdin from `/dev/null` (`.opencode/skills/cli-external-orchestration/cli-pi/SKILL.md:9`), `--offline` (`:17`), a provider-qualified model (`:21`), the read-only tool allowlist (`:165`) and the child waiver (`:217`). The gateway id is `llmgateway/deepseek-v4.1-flash`, which accepts `max` (`.opencode/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md:112`). Run from the worktree root, one unit at a time:

```bash
AI_SESSION_CHILD=1 pi -p --offline --model llmgateway/deepseek-v4.1-flash --thinking max \
  --tools read,grep,find,ls "$(cat "$PHASE/scratch/briefs/e1-hook-opencode-lines.md")" \
  </dev/null > "$PHASE/evidence/hook-opencode-lines.md"
```

The tool allowlist is the write boundary, so the orchestrator writes each output file from stdout. Each brief file under `scratch/briefs/` opens with the child-dispatch preamble and an inlined persona. Everything else in this phase stays with the orchestrator on Opus: reading the probe records, resolving the ADRs, writing the review brief, adjudicating and validating. The review (R2) is the only GPT-5.6 unit.
<!-- /ANCHOR:delegation -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state. The 25 cutover steps above belong to phases 005 to 011 and run there, not here.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Each delegated evidence table against a direct count | `grep -c`, `awk` over the maps |
| Integration | The resolved design against the seven ordering constraints and the traceability tables | Orchestrator read-through, then the GPT-5.6 review |
| Manual | Every file:line citation in this folder opens to the text it claims | Orchestrator spot checks, logged in `goal.md` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 003 records for P1 to P3 | Internal | Red | ADR-001 stays Proposed and phase 005 cannot start |
| Phase 003 records for P4 to P9 | Internal | Yellow | The order stands, and steps 2, 20 and 24 record "not probed" |
| Phase 001 and 002 research and maps | Internal | Green | None, both are committed at `728c4f3efc` |
| cli-codex with `gpt-5.6-sol` | External | Yellow | R2 waits and the ADRs stay Proposed |
| cli-pi through the LLM Gateway | External | Yellow | The orchestrator runs E1 to E4 directly and logs the deviation |
| The main checkout's `validate.sh` | Internal | Green | No validation result can be claimed |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A probe record contradicts a decision after it was Accepted, or the review finds an ordering violation after phase 005 started.
- **Procedure**: For this phase, revert its document commit with `git revert` and set the ADRs back to Proposed. For the cutover, each step carries its own rollback line above, and step 24 is the point after which rollback becomes a forward fix.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup: phase 003 records, E1 to E4) ──► Phase 2 (Resolve ADRs, review, adjudicate) ──► Phase 3 (Verify, validate)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 003 records | Resolve |
| Resolve | Setup | Verify |
| Verify | Resolve | Phase 005 |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 1 to 2 hours: four evidence units and their verification |
| Core Implementation | High | 3 to 5 hours: ADR resolution, the brief, the review and the adjudication |
| Verification | Med | 1 to 2 hours |
| **Total** | | **5 to 9 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Step 9 recorded the base SHA, the tracked count and the ignored-entry list before step 11
- [ ] Step 18's archive of ignored state and home configs exists before step 19
- [ ] Step 18 recorded the seven hook link targets before step 20

### Rollback Procedure
1. Stop at the failing step and run its rollback line from the cutover sequence
2. Before step 24, reset the worktree or the main checkout to the recorded SHA and restore ignored state from the archive
3. Run the failing step's check against the restored state, plus step 3's independent check
4. Record the rollback in the executing phase's `goal.md` log and in the parent goal log

### Data Reversal
- **Has data migrations?** Yes. Ignored SQLite databases and `.state/` move from `.opencode/` to `.skilled/` in step 19.
- **Reversal procedure**: After `git reset --hard <step-18 SHA>` on the main checkout, restore step 18's archive into `.opencode/` and compare `shasum` output with the archive.
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│ 005 gates+CI │────►│ 006 dual-root│────►│ 007 move     │────►│ 008 links +  │
│ steps 1-5    │     │ steps 6-8    │     │ steps 9-12   │     │ generated    │
│ published    │     │ published    │     │ held         │     │ 13-16, held  │
└──────────────┘     └──────────────┘     └──────────────┘     └──────┬───────┘
                                                                      │
┌──────────────┐     ┌──────────────┐     ┌──────────────┐            │
│ 011 verify + │◄────│ 010 machine  │◄────│ 009 rewrite  │◄───────────┘
│ push 23-25   │     │ cutover 18-22│     │ step 17 held │
└──────────────┘     └──────────────┘     └──────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| 005 gates and CI | 004 Accepted | Dual-root hooks and workflows, the independent check | 006 |
| 006 dual-root code | 005 | Discovery, launcher, installers, ignore twins | 007 |
| 007 source-root move | 006 | Retired placeholder, the rename commit | 008 |
| 008 links and generated state | 007 | Retargeted links, regenerated files | 009 |
| 009 reference rewrite | 008 | Rewritten references | 010 |
| 010 machine and consumer cutover | 009 | Moved main checkout, reinstalled hooks, updated home configs | 011 |
| 011 verification and rollout | 010 | Runtime proof, the pushed tip | None |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Phase 003 records for P1 to P3** - UNKNOWN duration - CRITICAL
2. **Steps 2 to 5, gates published to the main checkout** - one session - CRITICAL
3. **Steps 10 and 11, placeholder and rename commits** - one session - CRITICAL
4. **Steps 18 to 20, the main checkout moves and the hooks are reinstalled with no break between 19 and 20** - one sitting - CRITICAL
5. **Step 24, the push** - one sitting - CRITICAL

**Total Critical Path**: UNKNOWN until phase 003 reports. The held window from step 9 to step 19 is planned as one continuous working session (NFR-P01).

**Parallel Opportunities**:
- The review brief (R1) can be drafted while evidence units E1 to E4 run one after another
- E1 to E4 are independent of each other, but run one at a time under the single-dispatch rule
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Probe verdicts mapped | P1 to P9 each cite a phase 003 record or a recorded reason | Phase 003 closed |
| M2 | Design resolved | ADR-001 names one layout or a stop, and the step variants are fixed | After T008 |
| M3 | Design frozen | Review adjudicated, ADRs Accepted, `RESULT: PASSED` | Before phase 005 |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:ai-execution -->
## AI EXECUTION PROTOCOL

### Pre-Task Checklist
- [ ] Read `spec.md`, this plan and `tasks.md` before the first edit
- [ ] Read the phase 003 records a task names before resolving any decision
- [ ] Know a task's verification command before starting it

### Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Run tasks in the order `tasks.md` lists them, and delegated units one at a time |
| TASK-SCOPE | Write only inside this phase folder. Anything else is a finding for the executing phase |
| TASK-VERIFY | Run the task's verification before marking it complete, and read the output as well as the exit status |

### Status Reporting Format

`[TASK-ID] [DONE | IN PROGRESS | BLOCKED] - one line of evidence`

### Blocked Task Protocol
1. Mark the task BLOCKED with the blocking fact
2. Record the fact in the `goal.md` log
3. Continue with the next unblocked task, and escalate after two blocked tasks or on any probe record that voids the design (parent D2)
<!-- /ANCHOR:ai-execution -->

---

## L3: ARCHITECTURE DECISION RECORD

Full records live in `decision-record.md`.

### ADR-001: What `.opencode` becomes

**Status**: Proposed

**Context**: `.skilled/` takes the real files, and parent D5 requires `.opencode/` to stay resolvable for opencode, root discovery and consumers.

**Decision**: L1, one relative link, when P1 and P3 pass for the whole-directory shape. Otherwise L2, one relative link per moved entry, when P2 and P3 pass for per-entry links. Otherwise stop and escalate.

**Consequences**:
- Every path that works today keeps working on the day of the move
- Git filters that name `.opencode/` see nothing, mitigated by steps 2 to 5

**Alternatives Rejected**:
- L3, a thin namespace: the global hooks and consumer paths into dropped entries break when the main checkout moves
- L4, removal: violates parent D5

### ADR-002: The cutover order and its point of no return

**Status**: Proposed

**Context**: Gates skip when their filters miss, hook drivers run from the main checkout, and the main checkout holds ignored state no commit carries.

**Decision**: Publish backward-compatible changes first (steps 1 to 8), hold the layout-changing commits in the worktree (steps 9 to 17), move the main checkout once (steps 18 to 22), and treat the push in step 24 as the point of no return.

**Consequences**:
- Every gate runs dual-root logic before any file moves
- A held window exists, mitigated by the drift check in step 19

**Alternatives Rejected**:
- Publish every phase as it validates: the main checkout and 28 other worktrees would run on a half-moved tree
- One commit for everything: breaks the rename doctrine and passes because the gates skip

### ADR-003: Which `.opencode` references survive

**Status**: Proposed

**Context**: The parent criteria require that no tracked non-frozen file names an `.opencode` path the design did not keep (`../goal.md:90`).

**Decision**: Keep `.opencode` where the reader is opencode itself, root discovery, the consumer contract, the spec compatibility link, a dual-root alternate or a frozen record. Rewrite everything else.

**Consequences**:
- The phase 009 rescan has a finite definition of done
- The dual-root alternates stay until every linked worktree has moved, removed by a later cleanup

**Alternatives Rejected**:
- Rewrite everything: breaks opencode's own config and the consumer contract
- Rewrite nothing: fails the parent completion criterion

---
