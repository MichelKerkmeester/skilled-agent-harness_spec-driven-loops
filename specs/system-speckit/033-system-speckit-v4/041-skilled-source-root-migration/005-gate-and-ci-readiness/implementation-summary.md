---
title: "Implementation Summary"
description: "Every git hook and CI workflow now matches changes under .skilled/ as well as .opencode/, and a gate script missing from this repository blocks or warns instead of passing, proven by an independent check, a broken-move drill and the hook test scripts in CI. Publishing and the pushed-tip CI read are pending."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/005-gate-and-ci-readiness"
    last_updated_at: "2026-09-17T09:05:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Closed the Luna review loop and added the hook test scripts to CI"
    next_safe_action: "Merge 0aa71350e4, publish, read CI on the pushed tip, then close"
    blockers:
      - "Publish and pushed-tip CI pending"
    key_files:
      - ".github/scripts/check-gate-inputs.sh"
      - ".github/scripts/tests/broken-move-drill.sh"
      - ".opencode/scripts/git-hooks/pre-commit"
      - ".opencode/scripts/git-hooks/pre-push"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "041-005-gate-and-ci-readiness"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-gate-and-ci-readiness |
| **Completed** | Not yet: publishing and the pushed-tip CI runs are pending |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Before this phase, moving the tree to `.skilled/` would have switched most gates off without a word. Filters named `.opencode` only, and a missing gate script read as a reason to skip. Now every hook and workflow matches both roots, a checkout that ships the toolchain treats a missing gate script as a broken install and a check that lives outside the tree proves both on every push.

### Hooks

Every staged-path filter, pathspec and trigger regex in `pre-commit`, `pre-push` and the legacy hygiene helper names `.skilled/` beside `.opencode/`. Script paths keep their `.opencode/` literals, which resolve through the tracked link phase 004 chose. Each gate file defines `_in_toolchain_repo`, true when `skills/system-spec-kit/SKILL.md` is a file under either root. There, a missing gate script blocks with its path and bypass when the gate can block, and warns when it cannot: `prepare-commit-msg`, the three post-hooks and the SessionStart check keep their exit status. Any other repository sees no new output and no new block.

One gate needed more than a twin. Git refuses to stage a path that runs through a symbolic link, and `git diff --quiet` through one reports a changed file as clean, so the route re-mint gate now stages its manifests through the directory `.opencode` resolves to.

### CI

Eight workflows gained a `.skilled/` twin for each of their 56 path filters, dependabot scans `/.skilled/**` too and the agent mirror workflow's name filter admits `skilled`. Six guard steps that exited 0 on a missing script now fail the step, and `gate-inputs.yml` runs the six hook test scripts and the SessionStart check's test script, so CI exercises the real gates against staged changes under both roots.

### The independent check and the drill

`.github/scripts/check-gate-inputs.sh` reads the hooks, workflows and dependabot as text and fails when a gate file is missing, when a hook or workflow input resolves nowhere, when a filter names one root or when a file that names a root yields no input. A twin counts only inside the workflow filter, dependabot entry, hook array or hook command segment that holds its partner, so a comment, a second command or another event's filter cannot stand in for it. Every line that names a root outside a comment must be read by a rule or recognized as a message, a label or a path read through the link, so a shape the parsers do not know fails instead of passing beside a real input. `gate-inputs.yml` runs it with its fixture test on every push to `main` and `skilled/**` and every pull request, with no path filter. `.github/scripts/tests/broken-move-drill.sh` clones the repository, moves the tree with a link back and breaks each of fourteen gate inputs in turn.

### Naming guard

The guard's changed-since mode now passes a rename that keeps its basename, so the four grandfathered snake_case names that move with the tree no longer fail. A new snake_case name, a new snake_case directory on the destination path and a copy that keeps a snake_case name still do.

### Agent mirror checker

The checker the agent gates call kept only `.opencode` and `.claude` agent paths, so an agent staged under `.skilled/agents/` reached it and was dropped with "nothing verified". Its pattern now admits `.skilled`, and a Vitest suite runs a copy of the checker against an in-sync and a drifted mirror named through a `.skilled` path. The operator placed this fix in this phase on 2026-09-17, after the plans for phases 005 and 006 had each left it to the other.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/scripts/git-hooks/pre-commit` | Modified | Filter twins, missing-script rule for seven gates, route staging through the real directory |
| `.opencode/scripts/git-hooks/pre-push` | Modified | Skill detector and routing-byte twins, missing-script rule for four gates |
| `.opencode/scripts/git-hooks/prepare-commit-msg` | Modified | Warns when the allocator is missing |
| `.opencode/scripts/git-hooks/post-commit`, `post-merge`, `post-rewrite` | Modified | Warn when the autostash library, kill switch or publisher is missing |
| `.opencode/hooks/git/pre-commit` | Modified | Agent filter twin and the missing-script rule |
| `.opencode/bin/check-git-hooks.sh` | Modified | Warns when the hook source directory or installer is missing |
| `.opencode/scripts/git-hooks/tests/pre-commit.test.sh`, `pre-push.test.sh`, `prepare-commit-msg.test.sh`, `autostash-orphan-guard.test.sh` | Modified | Source-root, missing-script and other-repository cases |
| `.opencode/scripts/git-hooks/tests/mass-deletion-guard.test.sh` | Modified | Clears a caller's git environment, as the other harnesses do |
| `.opencode/bin/tests/check-git-hooks.test.sh` | Created | Harness for the SessionStart check |
| `.github/scripts/check-gate-inputs.sh`, `.github/scripts/tests/check-gate-inputs.test.sh` | Created | Independent check and its fixture test |
| `.github/scripts/tests/broken-move-drill.sh` | Created | Local broken-move drill |
| `.github/workflows/gate-inputs.yml` | Created | Runs the check, its fixture test and the hook test scripts on every push and pull request |
| Eight filtered workflows, `agent-mirror-sync.yml`, `.github/dependabot.yml` | Modified | `.skilled/` twins |
| `advisory-checks.yml`, `comment-hygiene.yml`, `markdown-link-integrity.yml`, `prompt-card-sync.yml`, `skill-doc-frontmatter.yml` | Modified | Fail closed on a missing guard |
| `.opencode/skills/sk-doc/shared/scripts/check_no_new_snake_case.py` and its test | Modified | A rename that keeps its basename passes |
| `.opencode/skills/system-deep-loop/deep-improvement/scripts/check-agent-mirror-sync.cjs` | Modified | The agent path pattern admits `.skilled` |
| `.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/check-agent-mirror-sync.vitest.ts`, `shared/tests/README.md` | Created, modified | Cases through a `.skilled` agent path, and the suite's index row |
| `.opencode/scripts/git-hooks/README.md`, `tests/README.md`, `.github/workflows/README.md` | Modified | The rule, the new cases and the new workflow |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The orchestrator wrote each unit's exact edits and its expected files first, then proved the design: every unit's new test cases were run against the hook before the unit and against the hook after it. DeepSeek V4.1 Flash on cli-pi then applied each unit from a short literal brief, and a return counted only when the changed files matched the expected files byte for byte and nothing else in the worktree had changed. The unit's harness then ran under `/bin/bash` 3.2.57, and each unit landed as its own commit. The orchestrator drafted the check, the drill and the fail-closed workflow steps directly, as the plan assigns.

### Delegation

| Executor | Units | Result |
|----------|-------|--------|
| DeepSeek V4.1 Flash, `--thinking max` | 65 dispatches across T010, T011, T013 to T024, T026 to T028, T032, T045, T046, T049 to T051, T053, T055, T057, T059, T060, the mass-deletion harness, the SessionStart harness pin, the filter-shape cases and the rename-only guard | 62 applied their edits. T013's first dispatch, in text mode, wrote nothing, so every later dispatch ran in JSON mode. T019's first dispatch, and later T055's whole-file rewrite of the check after two gateway stream errors, spent the 32,768-token output cap on reasoning before any edit, so both went out again as smaller edit units. One of T055's units reported every edit applied but left two declarations unchanged, which a two-edit unit corrected. The write tool dropped the final newline of five written files, which the orchestrator appended, with the executable bit on the two new scripts |
| GPT-5.6 Luna, `xhigh`, fast tier, read-only | The hook rules, the CI changes, the naming guard, and four rounds of CI fixes with the agent mirror checker | Seven reviews on 2026-09-17, each followed by a worktree fingerprint that matched apart from its return file and the orchestrator's own document edits. Findings and dispositions are in the review table below |
| GPT-5.6 sol, `xhigh`, read-only | T025 attempted | Stopped at Codex's usage limit before a verdict |
| SWE-2 on cli-devin | T025 attempted twice, as the operator's interim reviewer | No verdict. Devin refused a shell command under `auto`, and the second run was stopped when the operator chose GPT-5.6 Luna. A worktree fingerprint showed no write |
| Orchestrator | T009, T030, T033 and every verification task | As assigned in the plan |

Briefs, payloads and returns are kept in `scratch/delegation/`.

### Commits

`259f4f6cf4`, `a17d8ab9ce`, `50eca95e28`, `f7165195e2`, `b5f179bd0e`, `576ac3c930` (pre-commit), `5fa1f39da8`, `5ae40d3c1a` (pre-push), `4866bc8eea`, `6ad37a5a13`, `ae007f51a2`, `8ffe7e8dc3` (other hooks), `5cad25db6b`, `fc6305eb69`, `ecf3812ea1` (check, test, workflow), `60605917a9`, `f4f6ea659e`, `9f009e8dd3` (workflows), `be0c3974ab` (drill), `33f2d87531`, `60635ffca5` (naming guard), `0e60909b2e`, `452cc9b6dc` (READMEs), `27dd545510` (mass-deletion harness), `610374769a` (SessionStart harness pin), `fcc0b50028`, `07039dea39` (filter shapes), `9e1bc29d87`, `904bcd479c` (rename-only guard), `51f90025c4`, `c58a37b8d8`, `057c3664c0`, `a220c9b904`, `7116f95e09`, `da38873e31`, `3f8803e0d0`, `2f9d3bcdd2`, `a55d308ba4`, `26b2360c80` (the check's review fixes), `9bc50c4ce8` (hook test scripts in CI), `ad6d47b2aa`, `4ff3b14bac` (agent mirror checker). None is pushed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep `.opencode/` script literals and add `_in_toolchain_repo` per gate file | Under the tracked link every literal resolves, so the copied two-root block no longer earned its size. A GPT-5.6 scope review agreed |
| Stage route manifests through `cd -P "$REPO_ROOT/.opencode"` | Observed in a scratch repository: `git add` through the link fails with "beyond a symbolic link", and `git diff --quiet` through it reports a changed file as clean |
| Keep `--skill-root .opencode/skills/<hub>` | Reading works through the link, and how the mint tool treats the flag belongs to phase 006 |
| Let a comment-hygiene bypass also bypass its missing-checker block | The rule names the gate's escape in its message, so the escape must work |
| Let route and spec re-mint pass other repositories that stage their own skill trees or spec folders | Both used to block there on a module or tool that repository never had, which the missing-script rule exists to prevent |
| Block pushes on a missing mass-deletion library or permission script where the toolchain ships | A blocking gate never passes a missing script inside this repository. Each keeps its existing approval variable as the escape |
| Keep live sync enabled when its kill switch is missing, and warn | The earlier behavior was fail-open, and a publish is never the dangerous side |
| Compare other-repository output against the earlier hooks rather than requiring silence | Two warnings, from `pre-push` and the legacy helper, predate this phase. The requirement is no new output, and the drill checks exactly that |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Hook harnesses from the tip, `/bin/bash` 3.2.57 | PASS: autostash-orphan-guard 9, commit-msg 17, mass-deletion-guard 12, pre-commit 49, pre-push 32, prepare-commit-msg 56. That is 175 against the 126 baseline, with no case removed |
| New harnesses | PASS: `check-git-hooks.test.sh` 4 of 4, `check-gate-inputs.test.sh` 42 of 42, `check-agent-mirror-sync.vitest.ts` 2 of 2 |
| Deep-improvement Vitest suite | PASS for this phase's change: 393 of 394 across 34 files. The one failure, a `remediation.vitest.ts` case on the cli-pi default model, fails the same way before the change. The worktree needed the `@spec-kit/shared` workspace link that `npm install` creates, added under the ignored `node_modules` |
| New cases seen failing first | Each unit's new assertions failed against the files before it. Controls that guard an exemption pass both before and after, and are named as controls in `goal.md` |
| Hostile caller and spaced paths | PASS: every harness with `GIT_DIR`, `GIT_INDEX_FILE` and a global `core.hooksPath` set, and with temporary paths containing a space |
| `bash .github/scripts/check-gate-inputs.sh` | PASS from `9bc50c4ce8`: 32 files, 132 inputs resolved, 8 dynamic, 167 twin pairs, every root-naming command segment read, `RESULT: PASSED` in about 1 s. Before the review fixes it counted 137. Two informational `echo` lines in workflows and six `$REPO_ROOT` paths inside hook messages no longer count as inputs, each of those six is still checked where a command uses it, the legacy helper's quoted checker path now counts, and the two script paths of the new CI step count too |
| `bash .github/scripts/tests/broken-move-drill.sh` | PASS: 48 expectations, `RESULT: PASSED` in 65 s from `9bc50c4ce8`, including the earlier hooks passing every silent break without a word |
| Other repositories | PASS: in a clean repository and one with a dangling `.opencode` link, every hook exits 0 and prints nothing beyond two warnings the earlier hooks also printed |
| Naming guard | PASS: suite 8 of 8 with `-p no:cacheprovider`. `--changed-since 7085ec3290` prints `PASS:`, and on a rehearsal clone with the move staged the changed guard passes where the earlier one reports the four names |
| Comment hygiene, run directly | PASS: 0 violations. 12 files checked, 24 skipped by type and no id in the comments added to extensionless hooks |
| Workflow syntax | PASS: 20 workflows and dependabot parse with `ruby -ryaml` |
| No-op pre-commit timing | PASS: median 546 ms against a 559 ms baseline |
| CI on a pushed tip | NOT RUN: nothing is pushed until the contract reviews complete |

### Contract reviews

| Unit | Findings | Disposition |
|------|----------|-------------|
| Missing-script rule in the hooks (T025) | 2 | F1 confirmed: the agent mirror checker dropped `.skilled` names, fixed in this phase by the operator's decision (T050, T051). F2 answered: the linked-layout harness case is a deliberate control (`luna-hook-review-verdict.md`). An earlier supplementary GLM-5.3-Flash review found the same checker gap and a harness that depended on the system hooks path, fixed in `610374769a` |
| Independent check and workflow (T012) | 4, 8, 5, 4 and 6, across five review rounds | Every check finding but one confirmed by a fixture case that failed first, and fixed in `c58a37b8d8`, `a220c9b904`, `da38873e31`, `2f9d3bcdd2` and `26b2360c80`. The exception, a root spelled in pieces, is beyond what a text check can read, and the check's header says so. After the fourth round the operator chose another review, and after the fifth chose to fix its six findings without a sixth review and to run the hook test scripts in CI (`9bc50c4ce8`), which test the gates' behavior however they are spelled (`luna-ci-review-verdict.md` to `luna-fix4-review-verdict.md`). A supplementary GLM-5.3-Flash review had found one filter shape the check could not read, fixed in `07039dea39` |
| Fail-closed workflow steps (T031) | None | Reviewed with the CI changes |
| Broken-move drill (T034) | None | Reviewed with the CI changes |
| Naming guard rule (T047) | None | Citations checked (`luna-naming-review-verdict.md`). The supplementary GLM-5.3-Flash review's copy finding was closed by the operator's renames-only decision in `904bcd479c` |
| Agent mirror checker (T052) | 1 | Answered: the checker counts `README.txt` as an agent checked, which it already did under `.opencode` before this phase, and no drift can pass through it (`luna-fix-review-verdict.md`) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The phase cannot close yet.** It closes once the tip is pushed and CI on it is read against the failure baseline recorded before this phase. The hook test scripts in `gate-inputs.yml` have only run on macOS, so that CI run is their first on Linux.
2. **Adjacent defects, not fixed.** The card-sync and mutation-class triggers pipe `git diff` into `grep -q` under `pipefail`, so a trigger listed first can be missed on a commit that stages thousands of files. The comment hygiene checker skips files without an extension, so no git hook is ever scanned. The git-hooks README still describes a removed naming gate and a doc-model check that moved to CI. `agent-mirror-sync.yml` runs the checker without installing workspace packages, and in a checkout without them the checker cannot load its frontmatter parser, exits 1 and the step reports drift. No CI run has reached that path, because the workflow has run only on dependabot pull requests that change no agent.
3. **The independent check reads text, so it has stated limits.** A root spelled in pieces, such as a regex that puts syntax between the dot and the name or a variable that holds the name, is beyond it, and the hook test scripts cover that behavior by staging `.skilled` paths through each gate. Two shapes fail loudly as false positives instead: a `case` pattern that lists both roots separated by `|`, and a quoted string that spans lines.
4. **`ci-skill-root-metadata.cjs` needs installed workspace packages.** In a checkout without them it exits with "Cannot find module '@spec-kit/shared/frontmatter/parse-frontmatter.js'", which pre-push reports as stale metadata and does not block.

### Handoff to phase 006

These scripts, called by the gates, keep their own root literals:

| Script | Line | What remains |
|--------|------|--------------|
| `check-agent-mirror-sync.cjs` | 28 | Agents read from `.opencode/agents`, which resolves through the link. The path pattern at `:32` is fixed in this phase |
| `lib/mirror-sync-verify.cjs` | 19, 109 and 110 | The opencode agent template path, and a body normalization that maps `.opencode`, `.claude` and `.pi` agent paths but not `.skilled`, so an agent body rewritten to name `.skilled/agents/` would read as drift |
| `hooks/shared/hook-flags.sh` | 15 | The hook-flags config path |
| `sk-git/scripts/worktree-naming.sh` | 145 | The remote allowlist file path |
| `compiled-route-manifest.cjs` | `--skill-root` | How the tool treats a skill root under either spelling |
| `install-git-hooks.sh` | 30 | The hook source directory |
| `hooks/git/install-hooks.sh` | 15 | The legacy hook source directory |
| `sk-doc/shared/scripts/check_no_new_snake_case.py` | 199 and 304 | The completed-spec exemption looks under `.opencode/specs` |

Any tool that stages or diffs a `.opencode/` path also needs the real `.skilled/` path once the link exists, as the route re-mint gate now does.
<!-- /ANCHOR:limitations -->

---
