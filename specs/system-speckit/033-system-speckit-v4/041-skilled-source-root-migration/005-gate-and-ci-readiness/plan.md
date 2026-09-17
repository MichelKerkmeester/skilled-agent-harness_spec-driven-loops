---
title: "Implementation Plan: Gate and CI Readiness"
description: "One two-root block copied into every gate file, two-root filters and run paths in hooks and CI, a missing-script rule that never passes silently inside this repository and an independent check outside the moved tree, delivered in small reviewed units."
trigger_phrases:
  - "gate readiness plan"
  - "source root block plan"
  - "gate input check design"
  - "hook and ci delegation plan"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Gate and CI Readiness

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash 3.2 for the git hooks, the CI steps, the shared block and the check. GitHub Actions YAML |
| **Framework** | Git hooks reached through a global `core.hooksPath` and GitHub Actions |
| **Storage** | None |
| **Testing** | Shell test scripts that run the real hook file in a throwaway repository, Ruby's `yaml` for workflow syntax, the independent check and a drill in a disposable clone |

### Overview

Each gate file gets one marked block that looks up a root-relative path under `.skilled/` first and `.opencode/` second. Hooks use the block for every script they run, and every staged-path filter lists both roots. When a script is missing under both roots, the spec-kit sentinel decides what that means. Inside this repository a blocking gate blocks and a gate that cannot block warns, while any other repository sees exactly what it sees today. CI jobs resolve the root once and use it for every path. Workflow filters gain `.skilled/` twins and the six skip conditionals fail closed. An independent check in `.github/scripts/` fails when any gate names an input that exists under neither root, and a drill in a disposable clone shows that a broken move fails.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 004 has validated, and its layout names what `.opencode/` keeps, the move's commit shape and the hook log root
- [ ] Every line cited in §3 re-opened at the phase start commit, with any drift recorded in `goal.md`
- [ ] Baselines recorded: the 126 hook test cases, the CI conclusion and failure set per workflow and the no-op pre-commit timing
- [ ] Today's silent pass reproduced with today's hooks in a clone where the tree is renamed to `.skilled/`

### Definition of Done
- [ ] Every row in `acceptance-criteria.md` is Met with its evidence
- [ ] The hook test scripts, the block's matrix test, the check's test and the drill pass from the final state
- [ ] Every contract change carries a SWE-2 max review with no open finding
- [ ] `validate.sh --strict` prints `RESULT: PASSED` from the main checkout's toolchain
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:amendment-l1 -->
## AMENDMENT: SMALLER CHANGE UNDER L1

Phase 004 accepted L1: `.opencode` becomes one tracked relative link to `.skilled` (`../004-migration-design/decision-record.md` ADR-001). Phase 003 showed that under that link every gate still finds its script and that only path filters miss `.skilled/` changes (`../003-layout-probes/probes/gate-filters-under-linked-root.md`). So the two-root lookup this plan designed for a layout without a link no longer earns its size. GPT-5.6 sol, asked whether a smaller change suffices under L1, answered that it does and found no case the smaller change misses (`review/gpt-5-6-sol-scope-under-l1.md`, brief `review/scope-under-l1-brief.md`). This amendment takes precedence over the sections below wherever they differ.

| Part of this plan | Status under the amendment |
|-------------------|----------------------------|
| Two-root block `.github/scripts/source-root.sh`, copied into nine gate files, with `source_root_resolve` (T006 to T008) | Withdrawn. Gate scripts keep their literal `.opencode/` paths, which resolve through the link |
| C04, export step and `$SOURCE_ROOT` in 21 CI jobs (T029) | Withdrawn. CI checkouts carry the tracked link, and phase 009 leaves phase-005-owned hooks and workflows to keep their literals |
| H20, autostash log root | Withdrawn. `.opencode/logs` resolves into `.skilled/logs` through the link |
| Missing-script rule L1 to L4 | Kept. Identity becomes one small function per gate file, `_in_toolchain_repo`, true when `skills/system-spec-kit/SKILL.md` is a regular file under `.opencode/` or `.skilled/`. A missing script then blocks or warns as L2 and L3 say, and a foreign repository stays silent |
| Filter twins H04, H05, H07, H08, H09 (pathspecs), H13, H16, H22 and C01 to C03 | Kept unchanged |
| C05 fail-closed conditionals | Kept unchanged |
| Independent check | Kept, with five rules: gate-files, hook-inputs (every literal `$REPO_ROOT/.opencode/<path>` or `${REPO_ROOT}/.opencode/<path>` in a gate file resolves), workflow-inputs (every literal executable `.opencode/<path>` in a workflow resolves, a glob needs a match), filter-twins and parser-miss. The block-copies and escaped-roots rules go with the block |
| Broken-move drill | Kept, with three sections: an L1 clone where the check passes, a broken input in that clone that the check reports and the hook blocks or warns on, and the pre-change control plus the foreign control |
| REQ-012 naming guard | Kept unchanged |
<!-- /ANCHOR:amendment-l1 -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

One shared rule, copied as a marked block into each gate file, with the independent check failing on any copy that drifts. The repository already keeps copied blocks this way: `sync-gate1-pointers.cjs:22-23` defines the start and end markers of the Gate 1 pointer block, `:74-83` finds the block between them and `:85-91` replaces it.

### Key Components
- **Two-root block**, canonical in `.github/scripts/source-root.sh`. `source_root_resolve <repo-root> <path>` prints `<repo-root>/.skilled/<path>` when that exists, else `<repo-root>/.opencode/<path>` when that exists and otherwise returns 1. `source_root_toolchain <repo-root>` returns 0 when `skills/system-spec-kit/SKILL.md` resolves to a regular file, the same sentinel root discovery uses (`.opencode/skills/system-spec-kit/shared/workspace/repo-root.mjs:27`). `source_root_report <BLOCKED|WARNING> <gate> <path> [<escape>]` prints the one standard line.
- **Export mode** of the same file. `bash .github/scripts/source-root.sh export` appends `SOURCE_ROOT=.skilled` or `SOURCE_ROOT=.opencode` to `$GITHUB_ENV`, choosing the root that holds the sentinel, and fails the job when neither does.
- **Gate files**: nine files carry a byte-identical copy of the block between `# source-root:begin` and `# source-root:end`. They are `pre-commit`, `pre-push`, `prepare-commit-msg`, `post-commit`, `post-merge`, `post-rewrite`, `lib/autostash-orphan-guard.sh`, `.opencode/hooks/git/pre-commit` and `.opencode/bin/check-git-hooks.sh`.
- **CI jobs**: all 21 jobs run the export step right after checkout and use `$SOURCE_ROOT` in every executable path.
- **Independent check** `.github/scripts/check-gate-inputs.sh` and its workflow `.github/workflows/gate-inputs.yml`.
- **Broken-move drill** `.github/scripts/tests/broken-move-drill.sh`.

### Data Flow

A hook reads `REPO_ROOT` from git and asks the block for each script. A resolved script runs exactly as it does today. An unresolved script goes to the missing-script rule, which asks the sentinel whether this repository ships the toolchain. CI resolves the root once per job. The independent check reads the gate files and workflows themselves, so it does not depend on any of them running.

### Why the block is copied rather than sourced

Sourcing one shared file from every hook fails in two places the tests already exercise. First, the autostash test script copies `post-commit`, `post-rewrite` and the library into a throwaway repository (`.opencode/scripts/git-hooks/tests/autostash-orphan-guard.test.sh:43-48`), where no shared file exists. Second, a globally linked hook would have to find its own checkout, and git exports `GIT_DIR` inside hooks, which is why the test scripts clear it before calling git (`tests/pre-commit.test.sh:16-20`). A copied block works in both cases. Two alternatives were weighed and set aside: a sourced library beside the hooks with a second copy for CI kept in step by a parity test, and a hook-relative path into `.github/scripts/`. Both add a second failure mode, and the GPT-5.6 review re-examines the choice.

### The missing-script rule

| Rule | Applies to | Behavior |
|------|------------|----------|
| L1 Identity | Every gate file | This repository ships the toolchain when `source_root_toolchain` returns 0. The sentinel is consulted only after a script is found missing, so a present script runs as today in any repository. The existing test fixtures never create the sentinel, and they keep passing for that reason |
| L2 Blocking gates | Gates whose own verdict blocks | Inside this repository: exit 1 with `BLOCKED [gate:<name>]: <path> is missing under .skilled/ and .opencode/`, plus the gate's existing escape where it has one. Elsewhere: skip silently, as today |
| L3 Gates that cannot block | `prepare-commit-msg`, which never blocks by contract (`:11-12`). `post-commit`, `post-merge` and `post-rewrite`, whose exit status git ignores. The SessionStart hook check, which always exits 0 (`check-git-hooks.sh:22-23`). The pre-push skill-root metadata gate, whose stale verdict prints a message but never fails the push (`pre-push:216-229`) | Inside this repository: one `WARNING [gate:<name>]` line naming the path, with the exit status unchanged. Elsewhere: silent |
| L4 Trigger first | Gates triggered by staged paths | Look the script up only after the trigger matches, so a missing script blocks only a commit that gate would have checked. Mirror parity runs on every commit by design (`pre-commit:111-113`), so its missing script blocks every commit |

### Per-gate change list

Every line below was re-opened at `728c4f3efc`, where the gate files carry no uncommitted change. Hook paths are relative to `.opencode/scripts/git-hooks/` unless named in full. Class `literal` is a text edit with no control-flow change, `path` swaps a constant for a lookup and `rule` changes what a missing script does.

| ID | File:line | Today | Change | Class | Executor |
|----|-----------|-------|--------|-------|----------|
| H01 | `pre-commit:17-28` | Kill switch sourced from `.opencode/hooks/shared/hook-flags.sh`, silently absent when missing | Look it up. Inside this repository a missing file warns once and gates stay enabled | rule | DeepSeek draft, GPT-5.6 review |
| H02 | `pre-commit:45-54` | Checker at `.opencode/`, and a missing checker blocks only while `.opencode/skills/sk-code` exists (`:50`) | Look the checker up, replace the `sk-code` test with L1 and block per L2 | rule | DeepSeek draft, GPT-5.6 review |
| H03 | `pre-commit:90`, `:97-106` | Checker at `.opencode/`, and a missing checker warns and skips (`:98-99`) | Look it up and block per L2. A missing `node` keeps its warning | rule | DeepSeek draft, GPT-5.6 review |
| H04 | `pre-commit:95` | Filter `^\.(opencode\|claude)/agents/` | Admit `skilled` | literal | DeepSeek |
| H05 | `pre-commit:125-145` | Mirror outputs and sources name `.opencode/` only (`:131`, `:139-141`, `:143`, `:145`) | Twin every `.opencode/` entry with a `.skilled/` entry | literal | DeepSeek |
| H06 | `pre-commit:167-191` | Six scripts at `$REPO_ROOT/.opencode/` (`:168-175`), skipped by `continue` when missing (`:180`) | Look each up and block per L2, naming `SPECKIT_SKIP_MIRROR_PARITY=1` | rule | DeepSeek draft, GPT-5.6 review |
| H07 | `pre-commit:199-212` | Guard at `.opencode/` (`:200`), skipped when missing (`:201`), trigger regex `^\.opencode/skills/` (`:202`) | Regex admits `skilled`. After the trigger matches, look the guard up and block per L2 and L4 | literal, rule | DeepSeek for the regex. DeepSeek draft and GPT-5.6 review for the rule |
| H08 | `pre-commit:221-234` | Guard at `.opencode/` (`:222`), skipped when missing (`:223`), trigger regex rooted at `^\.opencode/` (`:224`) | Same shape as H07 | literal, rule | Same as H07 |
| H09 | `pre-commit:253-410` | Trigger pathspecs (`:259-260`) and per-hub paths (`:302-305`) name `.opencode/` only. The mint tool (`:254`), guard module (`:268`), layout module (`:279`), runtime root (`:278`), authored suffix (`:288`) and `--skill-root` (`:361`) are `.opencode` literals. A missing mint tool already blocks (`:348-356`) | Twin the pathspecs. Look up the tool and both modules, pass the resolved runtime root at `:278`, strip that same root at `:288`, and pass the root the hub resolved under to `--skill-root` | literal, path | DeepSeek |
| H10 | `pre-commit:503` | `repair-derived.cjs` at `.opencode/`. A failing run already blocks (`:521-529`) | Look it up. When it is missing, block per L2 without starting node | path, rule | DeepSeek draft, GPT-5.6 review |
| H11 | `pre-push:34-47` | Library at `.opencode/`, and a missing library means no deletion ceiling, a documented fail-open (`:34-36`) | Look it up. Inside this repository a missing library blocks each update push unless `SPECKIT_ALLOW_MASS_DELETION=1` approves it (`lib/mass-deletion-guard.sh:18`). A library that fails to source keeps today's warning | rule | DeepSeek draft, GPT-5.6 review |
| H12 | `pre-push:49-69`, `:136-139` | A missing `worktree-naming.sh` skips the permission gate with a warning (`:52-54`) | Look it up. Inside this repository a missing script rejects each push the permission gate would check unless `SPECKIT_ALLOW_REMOTE_PUSH` approves it, and release branches still pass at `:128-130` | rule | DeepSeek draft, GPT-5.6 review |
| H13 | `pre-push:121` | Skill changes detected with `-- .opencode/skills` | Add `.skilled/skills` | literal | DeepSeek |
| H14 | `pre-push:208-231` | Checker at `.opencode/` (`:209`). A missing checker warns when skills changed (`:213-214`) | Look it up and keep the warning. The gate's own stale verdict never fails the push (`:216-229`), although its header comment says it blocks (`:201-203`), so the warning follows the code | path | DeepSeek |
| H15 | `pre-push:250-268` | Guard at `.opencode/` (`:251`), skipped with no output when missing (`:252`) | Look it up and block per L2, naming `SPECKIT_SKIP_PREPUSH_ROUTE_GATE=1` (`:249`) | rule | DeepSeek draft, GPT-5.6 review |
| H16 | `pre-push:280-287` | Routing-byte pathspecs name `.opencode/` only | Twin them | literal | DeepSeek |
| H17 | `prepare-commit-msg:39-50` | Identity is the allocator's presence, and a missing allocator exits 0 in silence (`:47-50`) | Look it up. Inside this repository a missing allocator warns that the commit stays unstamped, and the hook still exits 0 per L3 | rule | DeepSeek draft, GPT-5.6 review |
| H18 | `post-commit:20-24`, `post-merge:18-22`, `post-rewrite:19-23` | Autostash library at `.opencode/`, skipped in silence when missing | Look it up and warn per L3 | rule | DeepSeek draft, GPT-5.6 review |
| H19 | `post-commit:36-57` | Kill switch (`:37-41`) and `bin/git-sync.sh` (`:54-55`) at `.opencode/`, skipped in silence when missing | Look both up. A missing kill switch warns and live-sync stays enabled as today. A missing `git-sync.sh` in an autosync session warns | rule | DeepSeek draft, GPT-5.6 review |
| H20 | `lib/autostash-orphan-guard.sh:34`, `:38` | Log written under `$root/.opencode/logs`, and `mkdir -p` would recreate `.opencode/` after the move | Carry the block and write under the log root phase 004 names | path | DeepSeek |
| H21 | `.opencode/hooks/git/pre-commit:8-22` | The legacy helper warns and exits 0 when its checker is missing (`:19-21`) | Look up the checker and the kill switch, and block per L2 | rule | DeepSeek draft, GPT-5.6 review |
| H22 | `.opencode/hooks/git/pre-commit:48-64` | Agent checker at `.opencode/`, filter `^\.(opencode\|claude)/agents/` (`:53`), skipped when missing (`:56-57`) | Same as H03 and H04 | literal, rule | Same as H03 and H04 |
| H23 | `.opencode/bin/check-git-hooks.sh:35-59` | Kill switch at `.opencode/` (`:38-40`), hook source directory at `.opencode/` (`:50`), silent exit when that directory is missing (`:59`) | Look both up. Inside this repository a missing source directory warns, and the check still exits 0 per L3 | rule | DeepSeek draft, GPT-5.6 review |
| H24 | `.opencode/bin/check-git-hooks.sh:131-132` | Self-heal runs `.opencode/scripts/install-git-hooks.sh` only when present | Look the installer up. The fix hint at `:109` is text for phase 009 | path | DeepSeek |

Reviewed and unchanged: `commit-msg` names `.opencode` only in its install comment (`:5`) and `lib/mass-deletion-guard.sh` names no root. The four adapters under `.opencode/hooks/git-hooks-check/` are relative links to `../../../bin/check-git-hooks.sh` that travel with the move.

| ID | File:line | Today | Change | Class | Executor |
|----|-----------|-------|--------|-------|----------|
| C01 | 8 workflows | 56 `paths:` entries name `.opencode/` only: `chart-corpus.yml:7`, `:11`, `diagram-corpus.yml:7`, `:11`, `markdown-link-integrity.yml:7-9`, `repo-rules-corpus.yml:8`, `routing-registry-drift.yml:26-43`, `:50-67`, `runtime-no-spec-import.yml:13`, `:18`, `skill-doc-frontmatter.yml:8-9`, `spec-kit-check.yml:7`, `:13-15`, `:24`, `:30-32` | Add a `.skilled/` twin right after each entry | literal | DeepSeek, one workflow per brief |
| C02 | `.github/dependabot.yml:13` | Directory `"/.opencode/**"` only | Add `"/.skilled/**"` | literal | DeepSeek |
| C03 | `agent-mirror-sync.yml:29` | Changed names filtered on `^\.(opencode\|claude\|codex)/agents/` | Admit `skilled` | literal | DeepSeek |
| C04 | 19 workflows, 21 jobs | 87 executable references to `.opencode/`, including `working-directory` at `routing-registry-drift.yml:103`, `:187`, `:199` and `:216` | Add the export step after checkout in each job, use `$SOURCE_ROOT/` in every executable path and move each `working-directory` into a `cd` inside its run block. Paths phase 004 keeps under `.opencode/` stay literal | literal | DeepSeek, one workflow per brief |
| C05 | 5 workflows | Six missing-guard conditionals exit 0: `advisory-checks.yml:31-34`, `:42-45`, `comment-hygiene.yml:18-21`, `markdown-link-integrity.yml:30-33`, `prompt-card-sync.yml:16-19`, `skill-doc-frontmatter.yml:21-24` | Replace each with `::error::` and `exit 1`, the shape `agent-mirror-sync.yml:18-23` already uses. `advisory-checks.yml` keeps its step-level `continue-on-error` (`:27`, `:38`), so its job stays green by design while the failed step shows the error | rule | Orchestrator draft, GPT-5.6 review |

The six workflows that already fail closed on a missing guard keep that logic and change only through C04: `agent-mirror-sync.yml:20-23`, `command-tree-parity.yml:36-39`, `dispatch-enforcement-guard.yml:33-36`, `playbook-operator-contract.yml:44-49`, `repo-rules-corpus.yml:27-30` and `rule-canary-sync.yml:20-23`.

### Independent check design

`.github/scripts/check-gate-inputs.sh` lives outside `.opencode/` and `.skilled/`, so a move can neither carry it along nor break its own path. It is bash 3.2 using git, grep, sed, awk, sort and comm, and it sources the canonical block from `.github/scripts/source-root.sh`. Each check prints `FAIL <check>: <file>:<line> <detail>` per violation.

1. **gate-files**: the seven hooks, both libraries, the legacy helper and the SessionStart hook check each resolve under a root.
2. **block-copies**: every file that calls a `source_root_` function carries the marked block, byte-identical to the canonical copy.
3. **hook-inputs**: every literal path passed to `source_root_resolve` resolves under a root. A path built from a variable, such as a hub name, is counted and listed as dynamic rather than dropped.
4. **workflow-inputs**: every `$SOURCE_ROOT/<path>` reference resolves under the root the export step would choose, and a pattern needs at least one match. Every job that uses `$SOURCE_ROOT` runs the export step first.
5. **escaped-roots**: no gate file or workflow builds a root path outside the block, meaning a shell variable followed by `/.opencode/` or `/.skilled/`, or a quoted `.opencode` or `.skilled` path segment handed to node. Comments, echo and printf text and a short keep-list of the paths phase 004 keeps under `.opencode/` are exempt.
6. **filter-twins**: every workflow `paths:` entry, dependabot directory, hook regex and hook pathspec that names one root also names the other.
7. **parser-miss**: a gate file or workflow that names a root outside comments and yields no extracted input fails, so a parser that stops matching cannot report a pass.

The output ends with counts (files scanned, inputs resolved, dynamic inputs, twin pairs) and `RESULT: PASSED` or `RESULT: FAILED`. The exit status is 0 on a pass, 1 on a violation and 2 on a usage or internal error. Per-unit verification filters the output for the unit's file, so the check needs no scope option.

`.github/workflows/gate-inputs.yml` runs the check and both `.github/scripts/tests/` scripts on push to `main` and `skilled/**`, on every pull request and on `workflow_dispatch`, with no `paths:` key and `contents: read`. A new workflow is needed because neither existing always-on workflow fits: `advisory-checks.yml` keeps failures green on purpose, and `playbook-operator-contract.yml` does not run on pushes to `skilled/**` (`:6-8`). The check is not wired into a hook, because a hook moves with the tree the check exists to watch. Phases 007, 008 and 011 run it by hand on each tip.

### Broken-move drill

`.github/scripts/tests/broken-move-drill.sh` clones the checkout with `git clone --local` into a temporary directory. It removes the `.skilled/` placeholder, renames `.opencode/` to `.skilled/`, commits that as the clone's baseline and replaces each gate script's body with a stub that records its own path. Then it runs four sections:

1. **Moved and whole**: the independent check prints `RESULT: PASSED`, and each hook, run from the clone with one staged trigger per gate, calls the `.skilled/` path.
2. **Moved and broken**: for each gate input in turn, delete it, expect the check to exit 1 naming it and the owning hook to block or warn per L2 and L3, then restore it.
3. **Pre-change control**: the same break, run against the hooks at the phase base commit (`git show <base>:.opencode/scripts/git-hooks/<hook>`), exits 0 with no gate output, which reproduces today's silent pass.
4. **Foreign control**: a repository with no sentinel under either root runs every hook with exit 0 and no output.

It prints one line per expectation and `RESULT: PASSED` only when every expectation held. It runs locally rather than in CI, because it clones the whole repository.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.github/scripts/source-root.sh` | None yet | Create the canonical block and the export mode | `.github/scripts/tests/source-root.test.sh` layout matrix |
| Nine gate files | Look scripts up at `.opencode/` only | Carry the block and apply L1 to L4 | Hook test scripts and the check's `block-copies` and `hook-inputs` rules |
| 19 workflows and `dependabot.yml` | Filter and run at `.opencode/` | Twins, export step, fail-closed guards | `ruby -ryaml` parse and the check's `filter-twins` and `workflow-inputs` rules |
| Scripts the gates call | Carry their own `.opencode` literals | Unchanged here, handed to phase 006 | Handoff list in `implementation-summary.md` |
| Installers | Install from `.opencode/scripts/git-hooks` (`install-git-hooks.sh:30`) | Unchanged here, phase 006 | Not a consumer of this change |
| Global hooks in `~/.config/git/hooks/` | Link to the main checkout's hook files | Unchanged here, phase 010 | `ls -l ~/.config/git/hooks/` before the main checkout carries this phase |

Required inventories:
- Same-class producers: `grep -n '\.opencode'` over the seven hooks, both libraries, the legacy helper, the SessionStart hook check, `.github/workflows/*.yml` and `.github/dependabot.yml`. At `728c4f3efc` it returns 43 lines in `pre-commit`, 19 in `pre-push` and 148 across the workflows, which split into 56 filter entries, 87 executable references, 2 echo lines and 3 comments.
- Consumers of the block: `grep -rn 'source_root_' .opencode/scripts/git-hooks .opencode/hooks/git .opencode/bin .github`.
- Matrix axes: root layout (6 values: `.opencode` only, `.skilled` only, placeholder `.skilled` beside `.opencode`, `.opencode` linked to `.skilled`, both real, neither) by script state (present, missing) by identity (this repository, foreign). That gives 24 combinations, fewer where they collide, since a layout with neither root is always foreign.
- Algorithm invariant: for a repository root R and a root-relative path p, resolve(R, p) is R/.skilled/p when that exists, else R/.opencode/p when that exists, else a failure. R ships the toolchain exactly when resolve(R, `skills/system-spec-kit/SKILL.md`) is a regular file. Adversarial cases: a dangling `.opencode` link, p present under both roots with different content, a space in p or in R and a pattern character in p.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

Each unit lands as its own commit, so any one of them reverts alone, and its SHA goes into the log in `goal.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The two-root block across the layout matrix | `.github/scripts/tests/source-root.test.sh` under `/bin/bash` 3.2 |
| Unit | The independent check against fixture repositories, one case per rule plus a whole-tree rename that passes | `.github/scripts/tests/check-gate-inputs.test.sh` |
| Integration | Each changed hook, run as the real file in a throwaway repository | `.opencode/scripts/git-hooks/tests/*.test.sh` and `.opencode/bin/tests/check-git-hooks.test.sh` |
| Integration | The whole tree renamed, then broken on purpose | `.github/scripts/tests/broken-move-drill.sh` |
| Static | Workflow syntax and filter twins | `ruby -ryaml -e 'ARGV.each { \|f\| YAML.load_file(f) }' .github/workflows/*.yml` and `check-gate-inputs.sh` |
| CI | The pushed tip | `gh run list` and `gh run view` per workflow |

Every new case is seen failing against the unchanged file first, then passing against the changed one. The new cases per test script:

- **`pre-commit.test.sh`**: a `.skilled/`-only fixture that re-mints a hub with `--skill-root .skilled/skills/<hub>`. A staged `.skilled/agents/<name>.md` that reaches the agent checker. A staged `.skilled/skills/cli-external-orchestration/cli-x/SKILL.md` that triggers the card-sync guard, and a staged `.skilled/skills/mcp-tooling/mcp-x/scripts/doctor.sh` that triggers the mutation-class guard. For comment hygiene, agent mirror-sync, mirror parity, card-sync, mutation-class and spec re-mint, a missing script with the sentinel present blocks with the standard line, and the same state without the sentinel exits 0 in silence. For the legacy helper, `.skilled/` resolution, a missing checker that blocks and a foreign repository.
- **`pre-push.test.sh`**: a range that changes only `.skilled/skills` sets the skill-gate trigger. A missing `worktree-naming.sh` rejects a push to a feature branch, while `skilled/v4.0.0.0` still passes and `SPECKIT_ALLOW_REMOTE_PUSH=1` approves the push. A missing route guard blocks. A missing mass-deletion library blocks an update push unless `SPECKIT_ALLOW_MASS_DELETION=1` is set. Each missing case also runs without the sentinel and exits 0.
- **`prepare-commit-msg.test.sh`**: an allocator under `.skilled/` stamps. A missing allocator with the sentinel present prints one warning, leaves the message unstamped and exits 0. The existing foreign case stays as it is.
- **`autostash-orphan-guard.test.sh`**: the guard runs from a `.skilled/` fixture and a missing library with the sentinel present warns. The log lands under the root phase 004 names.
- **`.opencode/bin/tests/check-git-hooks.test.sh`** (new): hooks under `.skilled/scripts/git-hooks` compare correctly and a missing source directory with the sentinel present warns and exits 0. A foreign repository exits 0 in silence.

Regression baseline, observed at `728c4f3efc`: the six existing test scripts pass 126 cases, `pre-commit` 25, `pre-push` 19, `prepare-commit-msg` 51, `commit-msg` 17, `autostash-orphan-guard` 2 and `mass-deletion-guard` 12. None may be removed or weakened. The installer test `install-git-hooks-worktree-harness.sh` exercises an installer that phase 006 owns, so it is not part of this baseline.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 004's frozen layout | Internal | Red until phase 004 validates | The phase cannot start (parent decision D1) |
| DevPass route `llmgateway/deepseek-v4.1-flash` at `--thinking max` on cli-pi | External | Yellow: metered per token, live-verified on 2026-09-10 (`cli-pi/references/providers-and-models.md:113`) | Literal edits fall to the orchestrator, recorded as a deviation |
| `swe-2-max` on cli-devin, replacing `gpt-5.6-sol` on cli-codex after its quota ran out | External | Green: operator decision 2026-09-17 | Contract changes wait, and are never merged unreviewed |
| GitHub Actions on a pushed tip | External | Yellow: UNKNOWN which tip first carries this phase | CI evidence waits for that push, and local evidence does not stand in for it |
| Ruby `yaml` for workflow parsing | Internal | Green: loads on this machine, as does Python's `yaml` | Python's `yaml` takes over |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: any hook test case below its baseline. A hook that blocks, or prints anything, in a foreign repository. A `BLOCKED` line in this repository while every script is present. The check or the drill printing `RESULT: PASSED` over a missing input. A workflow failing while its inputs exist.
- **Procedure**: To undo this: `git revert --no-edit <sha>` for each phase-005 commit, newest first, on the branch that carries it, using the SHAs logged in `goal.md`. This phase changes tracked text files only, so the revert is complete.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:delegation -->
## DELEGATION

Parent decision D3 splits the work by what a mistake costs. Every brief is short and literal, and it names one unit. It binds write authority to that unit's files and pre-answers every gate the executor cannot ask about, including the spec folder, which is this phase. It forbids spec paths, packet or phase numbers and task ids in code comments (`check-comment-hygiene.sh:163-172`), and it requires kebab-case names for new files. The orchestrator reads the executor's `SKILL.md` before the first brief to each executor.

| Unit kind | Units | Executor | Review | Orchestrator verification |
|-----------|-------|----------|--------|---------------------------|
| Literal | C01 to C04, H04, H05, H09, H13, H14, H16, H20, H24, new test cases and README rows | DeepSeek V4.1 Flash as `llmgateway/deepseek-v4.1-flash` at `--thinking max` on cli-pi, with the provider-qualified model the contract requires (`cli-pi/SKILL.md:21`) | None | The unit's test script or YAML parse, then the check filtered to the unit's file, then the diff against the authorized paths |
| Contract | The block and its export mode, the rule side of H01 to H03, H06 to H08, H10 to H12, H15, H17 to H19 and H21 to H23, C05, the check, its workflow and the drill | DeepSeek drafts H-rule units. The orchestrator drafts C05, the check and the drill | `gpt-5.6-sol` at `xhigh` on cli-codex, read-only, the roster's verification model (`cli-codex/references/providers-and-models.md:53`) | Every review finding fixed or answered, then the same checks as a literal unit |

Sequence rules:
- One unit per brief: one workflow, or one hook section with its test cases.
- The unit's suite passes before the next brief goes out: its test script, `bash -n` on changed shell and the check once it exists.
- One cli dispatch at a time, stopped by its own process id when it returns (`cli-codex/SKILL.md:283`).
- A return that fails verification is re-briefed with the failure named, or recorded in `goal.md`. It is never dropped.
- Briefs, review returns and verdicts are kept in `scratch/delegation/` under kebab-case names, and summarized in `implementation-summary.md`.
<!-- /ANCHOR:delegation -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup (004 read, baselines, negative control)
  └──► Block (source-root.sh and its matrix test, reviewed)
         └──► Check (check-gate-inputs.sh, its test and workflow, reviewed)
                ├──► Hooks (H01 to H24, one section per brief) ─────────┐
                └──► CI literal (C01 to C04, one workflow per brief) ──► CI rule (C05, reviewed) ─┤
                                                                                                  └──► Drill (reviewed) ──► Verify
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 004 validated | Block |
| Block | Setup | Check, Hooks, CI literal |
| Check | Block | Hooks, CI literal, Drill |
| Hooks | Block, Check | Drill |
| CI literal | Block, Check | CI rule |
| CI rule | CI literal | Drill |
| Drill | Hooks, CI rule | Verify |
| Verify | Drill | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 1 to 2 hours |
| Block and check | Med | 3 to 5 hours with review |
| Hooks | High | 6 to 9 hours across 24 change rows |
| CI | Med | 4 to 6 hours across 29 literal briefs and C05 |
| Drill and verification | Med | 3 to 5 hours |
| **Total** | | **17 to 27 hours, estimated from unit counts rather than measured** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Baselines recorded before the first change: 126 hook test cases, the CI conclusion and failure set per workflow and the no-op pre-commit timing
- [ ] Each unit committed alone, with its SHA in `goal.md`
- [ ] The foreign-repository proof passing before the main checkout carries this phase

### Rollback Procedure
1. **Stop the harm**: if a live hook misbehaves after the main checkout carries this phase, revert that hook's commit in the main checkout first. Every file in `~/.config/git/hooks/` links to those hook files by path, so the previous behavior returns on the next git command.
2. **Revert the rest**: `git revert --no-edit` the remaining phase commits, newest first.
3. **Verify the rollback**: rerun the six hook test scripts against the 126-case baseline and read the next CI run on the reverted tip.
4. **Record it**: log the trigger and the reverted SHAs in `goal.md`.
5. **Mind the move**: once phase 007 has moved the tree, reverting this phase alone brings the silent skips back on the moved tree, so from then on a revert of this phase travels with a revert of phase 007.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A. This phase changes tracked text files only.
<!-- /ANCHOR:enhanced-rollback -->

---
