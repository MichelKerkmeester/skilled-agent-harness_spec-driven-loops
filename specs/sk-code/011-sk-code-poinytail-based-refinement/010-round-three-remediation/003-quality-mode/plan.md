---
title: "Implementation Plan: Phase 3: quality-mode"
description: "Name the live comment-hygiene hooks in the sk-code-quality SKILL.md, replace its pre-rename mode names, route README spec folders to system-spec-kit and run its two Python checkers directly, then bump the skill to 1.1.1.0 with a changelog file. Every edit is one exact text replacement."
trigger_phrases:
  - "quality mode plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 3: quality-mode

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown edits to one skill package, checked with Python 3, Node.js and bash tools. No code is written |
| **Framework** | None. The skill package contract is `.skilled/skills/sk-doc/sk-create-skill/SKILL.md`, the README contract `.skilled/skills/sk-doc/sk-create-readme/SKILL.md`, the changelog contract `.skilled/skills/sk-doc/sk-create-changelog/SKILL.md` |
| **Storage** | None. The compiled sk-code manifest and the leaf manifest are only checked |
| **Testing** | Three script tests, `validate_document.py`, `package_skill.py --check --strict`, `compiled-route-guard.cjs`, `ci-leaf-manifest-freshness.cjs`, `verify_router_sync.cjs`, `check-markdown-links.cjs` |

### Overview
Four findings land in two files. The comment-hygiene gate table in `SKILL.md` names two legacy files as the live gates, so six lines are rewritten to name the installed hooks and to mark the legacy files as test helpers. Thirteen `SKILL.md` lines still use the names from before the `sk-code-*` rename and are renamed line by line. Three README spots route spec folders to the OpenCode checklist folder and are pointed at `system-spec-kit`, the way `SKILL.md` lines 107 and 121 already route them. Three README commands run Python checkers through `bash` and lose the prefix. A patch bump and a changelog file record the release.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
In-place documentation edit of one skill package: 30 single-text replacements, one new changelog file, then freshness checks of the derived routing artifacts

### Key Components
- **The live hooks (unchanged, verified at planning time).** The pre-commit gate is `.skilled/scripts/git-hooks/pre-commit`. It calls `skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh` (line 90) and also runs the agent-mirror-sync gate (lines 161 to 185) and six more gates listed in `.skilled/scripts/git-hooks/README.md` line 24. `.skilled/scripts/install-git-hooks.sh` installs it through `core.hooksPath` (lines 98 to 114). The write-time warning is `.skilled/hooks/post-edit-quality/claude/claude-posttooluse.cjs`, wired as the Claude `PostToolUse` hook with matcher `Write|Edit` at `.claude/settings.json` lines 202 and 206. `.skilled/skills/sk-code/sk-code-opencode/references/shared/universal-patterns/naming-and-commenting.md` lines 241 to 246 already state this and call `.skilled/hooks/git/pre-commit` and `sk-code-quality/scripts/hooks/claude-posttooluse.sh` compatibility helpers for direct tests. `.skilled/hooks/git/README.md` section 1 and `scripts/hooks/README.md` section 1 say the same. The legacy files stay on disk because their tests still use them, so `SKILL.md` keeps listing them as helpers.
- **The rename map.** `mode-registry.json` keys are `sk-code-quality`, `sk-code-review`, `sk-code-webflow`, `sk-code-opencode` and `sk-code-obsidian`. The stale names are `code-webflow` to `sk-code-webflow`, `code-opencode` to `sk-code-opencode`, `code-review` to `sk-code-review`, and `code-quality` (as a mode name in prose) to `sk-code-quality`. The finding's count `rg -c "code-webflow|code-opencode|code-review"` prints 39 because it also matches 28 current `../sk-code-opencode/assets/...` paths. The pattern `(^|[^-])code-(webflow|opencode|review)` matches only the 11 stale lines (15, 36, 39, 47, 50, 182, 188, 202, 248, 280, 281), and lines 142 and 145 carry `code-quality` as a mode name.
- **The checklist family.** `.skilled/skills/sk-code/sk-code-opencode/assets/checklists/` holds `agent-authoring.md`, `command-authoring.md`, `config-checklist.md`, `javascript-checklist.md`, `mcp-server-authoring.md`, `python-checklist.md`, `rust-checklist/`, `shell-checklist.md`, `skill-authoring.md`, `typescript-checklist.md` and `universal-checklist.md`, and no spec-folder checklist. The spec-folder checklist is `.skilled/skills/system-spec-kit/references/workflows/spec-folder-authoring-checklist.md`, reached from the README as `../../system-spec-kit/references/workflows/spec-folder-authoring-checklist.md`, the same relative link `SKILL.md` line 303 uses.
- **The two checkers.** Both start `#!/usr/bin/env python3` and have mode `-rwxr-xr-x`. `check-comment-hygiene.sh <file>` exits 0 clean, 1 on violations, 2 when every file was skipped (its docstring, lines 2 to 14). `check-dist-staleness.sh` takes `<file>` or `--all` and always exits 0, printing a banner only for a stale or unverifiable package (lines 2 to 20 and 175 to 206). With no argument it exits 0 without checking anything (line 178), so the README's old no-argument form proved nothing even under the right interpreter. The README now gives `--all`.

### Decisions
- **D1, patch bump to 1.1.1.0.** `sk-create-changelog/SKILL.md` section 4 gives patch for "bug fix, refactor, docs, cleanup", and `examples-and-maintenance.md` section 3 gives patch for "bug fixes". Every change here repairs wrong prose and adds no resource. The README `version:` moves with it because the README is edited and its gate wants a matching changelog entry.
- **D2, rename only, two surfaces kept.** The lists that read `code-webflow` / `code-opencode` become `sk-code-webflow` / `sk-code-opencode`. Obsidian is not added: no finding asks for it, the quality target-path map has no Obsidian row, and adding it would claim coverage the mode does not define. Reported for the operator.
- **D3, legacy files named as helpers, not removed.** `SKILL.md` lines 94, 112 and 322 keep listing `scripts/hooks/claude-posttooluse.sh` because the file and its test exist in this packet, but they now say it is registered in no runtime. Line 136 names both legacy files as compatibility helpers kept for direct tests, which is the wording `naming-and-commenting.md` uses.
- **D4, line 142 is edited in two pieces.** The line holds an existing em dash. Two substring replacements (`code-quality routes primarily by TARGET PATH` and `could score code-quality's one routable checklist`) rename the mode name without quoting or touching that character, and each substring occurs once in the file.
- **D5, `schema_version: code-quality/v1` and the keyword comment stay.** The first is a contract identifier that a consumer of the envelope parses. The second is a search-keyword list. Neither is prose naming a mode.
- **D6, the README title is renamed too.** README lines 2 and 14 read `code-quality`, the pre-rename mode name. No round-three finding names them, but the sibling claim checker fails on pre-rename mode names in sk-code docs, so they become `sk-code-quality` (E29 and E30, tasks T042 and T043, added after the orchestrator's review). They run after the orchestrator's Hermes task T041 in task order and touch no line another unit touches.

### Data Flow
An operator or agent reads `SKILL.md` section 2, sees the gate table and the resource rows, and runs the named checker. The README repeats the routing and the commands for a human reader. The compiled manifest hashes only the hub-root `SKILL.md`, `hub-router.json` and `mode-registry.json` (`.skilled/bin/lib/compiled-route-manifest.cjs:435-438`), and the leaf manifest lists only `assets/` and `references/` leaves, so neither moves. The router-sync guard parses this file's Python router block, where only the comment on line 145 changes.

### Handoffs
- **Child 001** owns `.skilled/skills/sk-code/shared/references/universal/code-quality-standards.md` section 7, the other half of f-iter012-001. Its lines 138 and 139 name the same legacy hooks and need the same live-hook wording.
- **Child 005** builds the documentation claim checker. If it lints two-surface phrasing, `SKILL.md` lines 15, 36, 47, 182, 188 and 280 and README lines 57 and 106 list `sk-code-webflow` / `sk-code-opencode` without `sk-code-obsidian` (decision D2).
- **Orchestrator** runs `sync-skills-hermes.cjs` in write mode to regenerate `.hermes/skills/sk-code-quality/SKILL.md`.

### Exact Text of the Edits
Every block below is final and is quoted from the file as it stood on 2026-10-10. The Find text occurs exactly once in its file. Line numbers are the original positions. The same edits, in the same order, are in `scratch/dispatch-units.json`, which `scratch/build-units.cjs` generated from the files and checked for uniqueness.

**E1 (T012), `SKILL.md` line 5, patch version bump.** Find:

````text
version: 1.1.0.0
````

Replace with:

````text
version: 1.1.1.0
````

**E2 (T013), `SKILL.md` line 15, rename.** Find:

````text
`quality` is the author-side quality gate MODE child of the `sk-code` family. It runs after the surface skill (`code-webflow` / `code-opencode`) implements changes and before the surface's verification workflow or done-claim. It consumes the shared surface router, loads the right checklist for the detected surface and target path, fixes quality-gate failures in place, and leaves findings-only output to `code-review`.
````

Replace with:

````text
`quality` is the author-side quality gate MODE child of the `sk-code` family. It runs after the surface skill (`sk-code-webflow` / `sk-code-opencode`) implements changes and before the surface's verification workflow or done-claim. It consumes the shared surface router, loads the right checklist for the detected surface and target path, fixes quality-gate failures in place, and leaves findings-only output to `sk-code-review`.
````

**E3 (T014), `SKILL.md` line 36, rename.** Find:

````text
- The user needs code written, files scaffolded, or behavior implemented. Use the appropriate surface skill (`code-webflow` / `code-opencode`) and its implementation workflow.
````

Replace with:

````text
- The user needs code written, files scaffolded, or behavior implemented. Use the appropriate surface skill (`sk-code-webflow` / `sk-code-opencode`) and its implementation workflow.
````

**E4 (T015), `SKILL.md` line 39, rename.** Find:

````text
- The user asks for findings-first review output, severity-ranked findings, or PR review. Use `code-review`.
````

Replace with:

````text
- The user asks for findings-first review output, severity-ranked findings, or PR review. Use `sk-code-review`.
````

**E5 (T016), `SKILL.md` line 47, rename.** Find:

````text
- The surface skill (`code-webflow` / `code-opencode`) immediately before this gate, because implementation writes the files this mode checks.
````

Replace with:

````text
- The surface skill (`sk-code-webflow` / `sk-code-opencode`) immediately before this gate, because implementation writes the files this mode checks.
````

**E6 (T017), `SKILL.md` line 50, rename.** Find:

````text
- `code-review` when the user wants findings-only output rather than author-side correction.
````

Replace with:

````text
- `sk-code-review` when the user wants findings-only output rather than author-side correction.
````

**E7 (T018), `SKILL.md` line 94, hook naming, Resource Domains bullet.** Find:

````text
- `scripts/hooks/claude-posttooluse.sh` is the write-time warning hook for comment hygiene.
````

Replace with:

````text
- `scripts/hooks/claude-posttooluse.sh` is the legacy write-time hook, kept for direct tests and registered in no runtime. The live write-time warning is `.skilled/hooks/post-edit-quality/claude/claude-posttooluse.cjs`.
````

**E8 (T019), `SKILL.md` line 112, hook naming, loading-table row.** Find:

````text
| ON_DEMAND | Need hook behavior details | `scripts/hooks/claude-posttooluse.sh` |
````

Replace with:

````text
| ON_DEMAND | Need the legacy write-time hook's behavior, which no runtime registers | `scripts/hooks/claude-posttooluse.sh` |
````

**E9 (T020), `SKILL.md` line 132, hook naming, write-time gate row.** Find:

````text
| Write-time warning | `scripts/hooks/claude-posttooluse.sh` | Warns during authoring when a comment carries ephemeral artifact labels. |
````

Replace with:

````text
| Write-time warning | `.skilled/hooks/post-edit-quality/claude/claude-posttooluse.cjs`, wired as the Claude `PostToolUse` hook for `Write` and `Edit` in `.claude/settings.json` | Warns during authoring when a comment carries ephemeral artifact labels. |
````

**E10 (T021), `SKILL.md` line 133, hook naming, pre-commit gate row.** Find:

````text
| Pre-commit block | `.skilled/hooks/git/pre-commit` | Blocks commits with forbidden comment patterns across runtimes. |
````

Replace with:

````text
| Pre-commit block | `.skilled/scripts/git-hooks/pre-commit`, installed through `core.hooksPath` by `.skilled/scripts/install-git-hooks.sh` | Blocks commits with forbidden comment patterns across runtimes. |
````

**E11 (T022), `SKILL.md` line 136, hook naming, the note under the gate table.** Find:

````text
Note that the `.skilled/hooks/git/pre-commit` hook additionally enforces a staged agent-mirror-sync drift gate, independent of comment hygiene, documented in `.skilled/hooks/git/README.md`.
````

Replace with:

````text
The live `.skilled/scripts/git-hooks/pre-commit` also runs the agent-mirror-sync gate and other repository gates, independent of comment hygiene, documented in `.skilled/scripts/git-hooks/README.md`. The older `.skilled/hooks/git/pre-commit` and `scripts/hooks/claude-posttooluse.sh` are compatibility helpers kept for direct tests. Neither is an installed hook.
````

**E12 (T023), `SKILL.md` line 142, rename of the mode name, first of two edits on this line.** Find:

````text
code-quality routes primarily by TARGET PATH
````

Replace with:

````text
sk-code-quality routes primarily by TARGET PATH
````

**E13 (T024), `SKILL.md` line 142, rename of the mode name, second of two edits on this line.** Find:

````text
could score code-quality's one routable checklist
````

Replace with:

````text
could score sk-code-quality's one routable checklist
````

**E14 (T025), `SKILL.md` line 145, rename of the mode name in a code comment.** Find:

````text
# Thin prompt-intent router: code-quality owns a single routable checklist. Its
````

Replace with:

````text
# Thin prompt-intent router: sk-code-quality owns a single routable checklist. Its
````

**E15 (T026), `SKILL.md` line 182, rename.** Find:

````text
1. Resolve the surface and lifecycle state through the shared router. If no implementation changed files yet, route to the appropriate surface skill (`code-webflow` / `code-opencode`) unless the user explicitly asked for a standalone quality audit.
````

Replace with:

````text
1. Resolve the surface and lifecycle state through the shared router. If no implementation changed files yet, route to the appropriate surface skill (`sk-code-webflow` / `sk-code-opencode`) unless the user explicitly asked for a standalone quality audit.
````

**E16 (T027), `SKILL.md` line 188, rename.** Find:

````text
7. If a gate failure requires new files, broader implementation, or behavior design, hand back to the surface skill (`code-webflow` / `code-opencode`).
````

Replace with:

````text
7. If a gate failure requires new files, broader implementation, or behavior design, hand back to the surface skill (`sk-code-webflow` / `sk-code-opencode`).
````

**E17 (T028), `SKILL.md` line 202, rename.** Find:

````text
Quality mode is allowed to edit because it is part of the implementation lifecycle. It should leave the workspace better than it found it, but only inside the current scope. If the requested output is a review report, use `code-review`; if the requested output is evidence that commands pass, use the surface's verification workflow (`workflow-verify.md`).
````

Replace with:

````text
Quality mode is allowed to edit because it is part of the implementation lifecycle. It should leave the workspace better than it found it, but only inside the current scope. If the requested output is a review report, use `sk-code-review`; if the requested output is evidence that commands pass, use the surface's verification workflow (`workflow-verify.md`).
````

**E18 (T029), `SKILL.md` line 248, rename.** Find:

````text
4. Never replace a formal findings-first review; route that to `code-review`.
````

Replace with:

````text
4. Never replace a formal findings-first review; route that to `sk-code-review`.
````

**E19 (T030), `SKILL.md` line 280, rename.** Find:

````text
- `code-webflow` / `code-opencode` implements or changes files before this gate runs, owns root-cause debugging, and gathers verification evidence via the implement → debug → verify workflow doctrine.
````

Replace with:

````text
- `sk-code-webflow` / `sk-code-opencode` implements or changes files before this gate runs, owns root-cause debugging, and gathers verification evidence via the implement → debug → verify workflow doctrine.
````

**E20 (T031), `SKILL.md` line 281, rename.** Find:

````text
- `code-review` owns findings-first review output and PR-style severity reporting.
````

Replace with:

````text
- `sk-code-review` owns findings-first review output and PR-style severity reporting.
````

**E21 (T032), `SKILL.md` line 322, hook naming, Scripts bullet.** Find:

````text
- [`scripts/hooks/claude-posttooluse.sh`](scripts/hooks/claude-posttooluse.sh) - Write-time comment-hygiene warning hook.
````

Replace with:

````text
- [`scripts/hooks/claude-posttooluse.sh`](scripts/hooks/claude-posttooluse.sh) - Legacy write-time comment-hygiene hook, kept for direct tests and registered in no runtime.
````

**E22 (T034), `README.md` line 11, patch version bump.** Find:

````text
version: 1.1.0.0
````

Replace with:

````text
version: 1.1.1.0
````

**E23 (T035), `README.md` line 50, spec-folder routing, checklist-router row.** Find:

````text
| **Spec folders and MCP servers** | routes to the spec-folder and MCP-server-authoring checklists |
````

Replace with:

````text
| **Spec folders** | routes to the spec-folder authoring checklist that `system-spec-kit` owns |
| **MCP servers** | routes to the MCP-server-authoring checklist |
````

**E24 (T036), `README.md` line 63 to 65, direct run of the comment-hygiene checker in Quick Start.** Find:

````text
```bash
bash .skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh <modified-file>
```
````

Replace with:

````text
```bash
.skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh <modified-file>
```
````

**E25 (T037), `README.md` line 87, spec-folder routing, Target-Path Routing prose.** Find:

````text
OpenCode authoring targets route to specific checklists: skills, agents, commands, spec folders, MCP servers, language files and config each have their own checklist. Webflow frontend work uses the code quality checklist and the shared universal standards.
````

Replace with:

````text
OpenCode authoring targets route to specific checklists: skills, agents, commands, MCP servers, language files and config each have their own checklist under `sk-code-opencode`. Spec folders route to the spec-folder authoring checklist that `system-spec-kit` owns. Webflow frontend work uses the code quality checklist and the shared universal standards.
````

**E26 (T038), `README.md` line 115, direct run in the Verification table.** Find:

````text
| Comment hygiene | `bash .skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh <modified-file>` reports zero violations and exits 0 |
````

Replace with:

````text
| Comment hygiene | `.skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh <modified-file>` reports zero violations and exits 0. Run it directly, not through `bash`, because it is a Python program |
````

**E27 (T039), `README.md` line 116, direct run in the Verification table.** Find:

````text
| Distribution drift | `bash .skilled/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh` exits 0 when generated artifacts are current |
````

Replace with:

````text
| Distribution drift | `.skilled/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh --all` prints a banner when a watched package is stale or cannot be checked and nothing when every one is current. It always exits 0 because it warns and does not gate. Run it directly, not through `bash`, because it is a Python program |
````

**E28 (T040), `README.md` line 129, spec-folder routing, Related Documents row.** Find:

````text
| [`assets/checklists/`](../sk-code-opencode/assets/checklists/) | Target-path OpenCode authoring checklists |
````

Replace with:

````text
| [`assets/checklists/`](../sk-code-opencode/assets/checklists/) | Target-path OpenCode authoring checklists for skills, agents, commands, MCP servers, language files and config |
| [`spec-folder-authoring-checklist.md`](../../system-spec-kit/references/workflows/spec-folder-authoring-checklist.md) | Spec-folder authoring checklist, owned by `system-spec-kit` |
````

**E29 (T042), `README.md` line 2, rename of the mode name in the frontmatter title.** Find:

````text
title: code-quality
````

Replace with:

````text
title: sk-code-quality
````

**E30 (T043), `README.md` line 14, rename of the mode name in the H1.** Find:

````text
# code-quality
````

Replace with:

````text
# sk-code-quality
````

**E-CL (T033), new file `changelog/v1.1.1.0.md`.** Compact format, `version:` on line 11 after the five contract keys, as in `v1.1.0.0.md`. The exact bytes are saved at `scratch/units/v1.1.1.0.md.txt`:

````markdown
---
title: "sk-code-quality v1.1.1.0, The Quality Mode Names the Hooks That Run"
description: "The quality mode now names the live pre-commit and write-time hooks, uses the current mode and surface names, routes spec folders to system-spec-kit and runs its two checkers directly."
trigger_phrases:
  - "sk-code-quality v1.1.1.0"
  - "sk-code-quality 1.1.1.0"
  - "live comment hygiene hooks"
  - "quality mode name fixes"
importance_tier: "normal"
contextType: "general"
version: 1.1.1.0
---

# v1.1.1.0, The Quality Mode Names the Hooks That Run

The quality mode told readers that two legacy files were its pre-commit and write-time gates. Neither is installed. This release names the hooks that do run, so the gate an operator is told will block a commit is the gate that blocks it.

> Spec folder: `specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/003-quality-mode` (Level 1)

&nbsp;

## What's New at a Glance

- **The live hooks are named.** The pre-commit block is `.skilled/scripts/git-hooks/pre-commit`, installed through `core.hooksPath`. The write-time warning is `.skilled/hooks/post-edit-quality/claude/claude-posttooluse.cjs`, wired in `.claude/settings.json`. The older `.skilled/hooks/git/pre-commit` and `scripts/hooks/claude-posttooluse.sh` are marked as helpers kept for direct tests.
- **Current names throughout.** `SKILL.md` now says `sk-code-webflow`, `sk-code-opencode`, `sk-code-review` and `sk-code-quality` where it still used the names from before the rename.
- **Spec folders route to system-spec-kit.** The README no longer sends spec folders to the OpenCode checklist folder, which has no spec-folder checklist.
- **The checker commands run.** The README runs `check-comment-hygiene.sh` and `check-dist-staleness.sh` directly. Both are Python programs, so the old `bash` form failed.

&nbsp;

## Upgrade

No migration required.
````

### Expected Diffs
Against the saved copies, `diff` of `SKILL.md` prints exactly these hunk headers: `5c5`, `15c15`, `36c36`, `39c39`, `47c47`, `50c50`, `94c94`, `112c112`, `132,133c132,133`, `136c136`, `142c142`, `145c145`, `182c182`, `188c188`, `202c202`, `248c248`, `280,281c280,281`, `322c322`. The README diff prints exactly `2c2`, `11c11`, `14c14`, `50c50,51`, `64c65`, `87c88`, `115,116c116,117`, `129c130,131`. Both were produced by applying the units in order to copies on 2026-10-10.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- **Script tests, before and after**: `bash $Q/scripts/ceiling-report.test.sh` (8 `PASS` lines, `All ceiling report test cases passed`), `bash $Q/scripts/check-comment-hygiene.test.sh` (22 `PASS` lines, `All comment hygiene test cases passed`) and `bash $Q/scripts/hooks/claude-posttooluse.test.sh` (`Post-edit adapter parse regression fixture passed`), each exit 0 on 2026-10-10.
- **The README commands as written**: `$Q/scripts/check-comment-hygiene.sh $Q/scripts/ceiling-report.sh` printed nothing and exited 0, and `$Q/scripts/check-dist-staleness.sh --all` printed nothing and exited 0 on 2026-10-10. The `bash` forms are never run, because bash would execute the Python lines as shell commands.
- **Validators**: `python3 -I .skilled/skills/sk-doc/shared/scripts/validate_document.py` on `SKILL.md`, on `README.md --type readme` and on the new changelog, each `VALID` and `Total issues: 0`. All three passed on 2026-10-10 against copies with every edit applied. `package_skill.py --check --strict` expects `Result: PASS`. `hvr_scan.py` expects `hard blockers:          0` on the changelog and the README. `check-frontmatter-versions.sh --skill sk-code` printed `[gate] 340 files | ok=337  skip-no-frontmatter=3` before the edit.
- **Routing**: `compiled-route-manifest.cjs freshness --hub sk-code` printed `"fresh": true` and hash `a59ec9ff7f6a450ca96f1d81b4b3174930058e7fcb94babd4a077b8b058299e2`. `compiled-route-guard.cjs` printed `sk-code                     fresh`. `ci-leaf-manifest-freshness.cjs` ended `checked=14 fresh=14 failed=0` with `OK    sk-code  fab6eb8691aa05ea57ffda56837e50fa191f3eb35275f8167202f24fe0b9cfb5`. `verify_router_sync.cjs --checks 1a,1b,2,3,4` ended `router-sync: 5/5 checks passed`. `ci-skill-root-metadata.cjs` ended `checked=14 passed=14 failed=0 fixed=0`. All exit 0.
- **Links and Hermes**: `check-markdown-links.cjs` printed `7927 files, 14029 links checked, 0 broken`, and `sync-skills-hermes.cjs --check` printed `PASS: 70 Hermes skill copies in sync`. Sibling builds can move both counts.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- The worked example `../../009-round-two-follow-ups/002-quality-report-listing/` supplies the command set reused here (validators, manifest checks, scope snapshot).
- Node.js and Python 3. Every Python tool runs as `python3 -I`.
- Six sibling children build in parallel. None owns a file under `sk-code-quality/`. Child 001 edits the hub `SKILL.md` and `ROUTER.md` and child 005 edits the router-sync guard, either of which can move the compiled manifest, the leaf manifest or the router-sync result for a reason this fix did not cause. The tasks say how to tell the cases apart.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- Restore the two modified files with `git restore .skilled/skills/sk-code/sk-code-quality/SKILL.md .skilled/skills/sk-code/sk-code-quality/README.md`.
- Delete the new file `.skilled/skills/sk-code/sk-code-quality/changelog/v1.1.1.0.md`. Nothing else refers to it.
<!-- /ANCHOR:rollback -->

---
