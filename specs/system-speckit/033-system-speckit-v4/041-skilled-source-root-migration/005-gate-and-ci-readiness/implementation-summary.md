---
title: "Implementation Summary"
description: "Every git hook and CI workflow now matches changes under .skilled/ as well as .opencode/, and a gate script missing from this repository blocks or warns instead of passing, proven by an independent check and a broken-move drill. The GPT-5.6 contract reviews are still pending."
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
    last_updated_at: "2026-09-16T22:20:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Implemented and verified every hook, CI, check, drill and naming-guard unit locally"
    next_safe_action: "Run the five contract reviews, then publish"
    blockers:
      - "Codex usage limit until 2026-09-19 10:29 blocks the GPT-5.6 reviews"
    key_files:
      - ".github/scripts/check-gate-inputs.sh"
      - ".github/scripts/tests/broken-move-drill.sh"
      - ".opencode/scripts/git-hooks/pre-commit"
      - ".opencode/scripts/git-hooks/pre-push"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "041-005-gate-and-ci-readiness"
      parent_session_id: null
    completion_pct: 85
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
| **Completed** | Not yet: the contract reviews and the pushed-tip CI runs are pending |
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

Eight workflows gained a `.skilled/` twin for each of their 56 path filters, dependabot scans `/.skilled/**` too and the agent mirror workflow's name filter admits `skilled`. Six guard steps that exited 0 on a missing script now fail the step.

### The independent check and the drill

`.github/scripts/check-gate-inputs.sh` reads the hooks, workflows and dependabot as text and fails when a gate file is missing, when a hook or workflow input resolves nowhere, when a filter names one root or when a file that names a root yields no input. `gate-inputs.yml` runs it with its fixture test on every push to `main` and `skilled/**` and every pull request, with no path filter. `.github/scripts/tests/broken-move-drill.sh` clones the repository, moves the tree with a link back and breaks each of fourteen gate inputs in turn.

### Naming guard

The guard's changed-since mode now passes a rename that keeps its basename, so the four grandfathered snake_case names that move with the tree no longer fail. A new snake_case name, a new snake_case directory on the destination path and a copy that keeps a snake_case name still do.

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
| `.github/workflows/gate-inputs.yml` | Created | Runs the check on every push and pull request |
| Eight filtered workflows, `agent-mirror-sync.yml`, `.github/dependabot.yml` | Modified | `.skilled/` twins |
| `advisory-checks.yml`, `comment-hygiene.yml`, `markdown-link-integrity.yml`, `prompt-card-sync.yml`, `skill-doc-frontmatter.yml` | Modified | Fail closed on a missing guard |
| `.opencode/skills/sk-doc/shared/scripts/check_no_new_snake_case.py` and its test | Modified | A basename-preserving move passes |
| `.opencode/scripts/git-hooks/README.md`, `tests/README.md`, `.github/workflows/README.md` | Modified | The rule, the new cases and the new workflow |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The orchestrator wrote each unit's exact edits and its expected files first, then proved the design: every unit's new test cases were run against the hook before the unit and against the hook after it. DeepSeek V4.1 Flash on cli-pi then applied each unit from a short literal brief, and a return counted only when the changed files matched the expected files byte for byte and nothing else in the worktree had changed. The unit's harness then ran under `/bin/bash` 3.2.57, and each unit landed as its own commit. The orchestrator drafted the check, the drill and the fail-closed workflow steps directly, as the plan assigns.

### Delegation

| Executor | Units | Result |
|----------|-------|--------|
| DeepSeek V4.1 Flash, `--thinking max` | 37 dispatches across T010, T011, T013 to T024, T026 to T028, T032, T045, T046 and the mass-deletion harness | 35 applied their edits. T013's first dispatch, in text mode, wrote nothing, so every later dispatch ran in JSON mode. T019's first dispatch spent its 32,768-token output cap on reasoning, and the unit went out again as a hook brief and a harness brief. The write tool dropped the final newline of three created files, which the orchestrator appended, with the executable bit on the two scripts |
| GPT-5.6 sol, `xhigh`, read-only | T025 attempted | Stopped at Codex's usage limit before a verdict. T012, T031, T034 and T047 wait for the same quota |
| Orchestrator | T009, T030, T033 and every verification task | As assigned in the plan |

Briefs, payloads and returns are kept in `scratch/delegation/`.

### Commits

`259f4f6cf4`, `a17d8ab9ce`, `50eca95e28`, `f7165195e2`, `b5f179bd0e`, `576ac3c930` (pre-commit), `5fa1f39da8`, `5ae40d3c1a` (pre-push), `4866bc8eea`, `6ad37a5a13`, `ae007f51a2`, `8ffe7e8dc3` (other hooks), `5cad25db6b`, `fc6305eb69`, `ecf3812ea1` (check, test, workflow), `60605917a9`, `f4f6ea659e`, `9f009e8dd3` (workflows), `be0c3974ab` (drill), `33f2d87531`, `60635ffca5` (naming guard), `0e60909b2e`, `452cc9b6dc` (READMEs), `27dd545510` (mass-deletion harness), `610374769a` (SessionStart harness pin), `fcc0b50028`, `07039dea39` (filter shapes), `9e1bc29d87`, `904bcd479c` (rename-only guard). None is pushed.
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
| New harnesses | PASS: `check-git-hooks.test.sh` 4 of 4, `check-gate-inputs.test.sh` 12 of 12 |
| New cases seen failing first | Each unit's new assertions failed against the files before it. Controls that guard an exemption pass both before and after, and are named as controls in `goal.md` |
| Hostile caller and spaced paths | PASS: every harness with `GIT_DIR`, `GIT_INDEX_FILE` and a global `core.hooksPath` set, and with temporary paths containing a space |
| `bash .github/scripts/check-gate-inputs.sh` | PASS: 32 files, 137 inputs resolved, 8 dynamic, 167 twin pairs, `RESULT: PASSED` in 0.6 s. Its fixture test passes 12 of 12 |
| `bash .github/scripts/tests/broken-move-drill.sh` | PASS: 48 expectations, `RESULT: PASSED` in 49 s, including the earlier hooks passing every silent break without a word |
| Other repositories | PASS: in a clean repository and one with a dangling `.opencode` link, every hook exits 0 and prints nothing beyond two warnings the earlier hooks also printed |
| Naming guard | PASS: suite 8 of 8 with `-p no:cacheprovider`. `--changed-since 7085ec3290` prints `PASS:`, and on a rehearsal clone with the move staged the changed guard passes where the earlier one reports the four names |
| Comment hygiene, run directly | PASS: 0 violations. 12 files checked, 24 skipped by type and no id in the comments added to extensionless hooks |
| Workflow syntax | PASS: 20 workflows and dependabot parse with `ruby -ryaml` |
| No-op pre-commit timing | PASS: median 546 ms against a 559 ms baseline |
| CI on a pushed tip | NOT RUN: nothing is pushed until the contract reviews complete |

### Contract reviews

| Unit | Findings | Disposition |
|------|----------|-------------|
| Missing-script rule in the hooks (T025) | None recorded | Blocked: the review stopped at Codex's usage limit. A supplementary GLM-5.3-Flash review raised two P2 findings: F1 was left to the phase 006 handoff and F2 was fixed in `610374769a` (`scratch/delegation/supplementary-hook-review-verdict.md`) |
| Independent check and workflow (T012) | Not started | Blocked on the same limit. A supplementary GLM-5.3-Flash review of the CI changes confirmed one P2 finding, a filter shape the check could not read, fixed in `07039dea39` (`scratch/delegation/supplementary-ci-review-verdict.md`) |
| Fail-closed workflow steps (T031) | Not started | Blocked on the same limit |
| Broken-move drill (T034) | Not started | Blocked on the same limit |
| Naming guard rule (T047) | Not started | Blocked on the same limit. A supplementary GLM-5.3-Flash review found that a copy whose source also changed lets a new snake_case name through, which awaits an operator decision on REQ-012, and two handoff gaps, since recorded (`scratch/delegation/supplementary-naming-review-verdict.md`) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The phase cannot close yet.** The five GPT-5.6 reviews wait for Codex quota, which returns on 2026-09-19 at 10:29, or for an approved substitute reviewer. Nothing is published until they complete, so the pushed-tip CI evidence waits too.
2. **Adjacent defects, not fixed.** The card-sync and mutation-class triggers pipe `git diff` into `grep -q` under `pipefail`, so a trigger listed first can be missed on a commit that stages thousands of files. The comment hygiene checker skips files without an extension, so no git hook is ever scanned. The git-hooks README still describes a removed naming gate and a doc-model check that moved to CI.
3. **`ci-skill-root-metadata.cjs` needs installed workspace packages.** In a checkout without them it exits with "Cannot find module '@spec-kit/shared/frontmatter/parse-frontmatter.js'", which pre-push reports as stale metadata and does not block.

### Handoff to phase 006

These scripts, called by the gates, keep their own root literals:

| Script | Line | What remains |
|--------|------|--------------|
| `check-agent-mirror-sync.cjs` | 28 and 32 | Agents read from `.opencode/agents`, and the path filter admits `.opencode` and `.claude` only |
| `lib/mirror-sync-verify.cjs` | 19 | The opencode agent template path |
| `hooks/shared/hook-flags.sh` | 15 | The hook-flags config path |
| `sk-git/scripts/worktree-naming.sh` | 145 | The remote allowlist file path |
| `compiled-route-manifest.cjs` | `--skill-root` | How the tool treats a skill root under either spelling |
| `install-git-hooks.sh` | 30 | The hook source directory |
| `hooks/git/install-hooks.sh` | 15 | The legacy hook source directory |
| `sk-doc/shared/scripts/check_no_new_snake_case.py` | 199 and 304 | The completed-spec exemption looks under `.opencode/specs` |

Any tool that stages or diffs a `.opencode/` path also needs the real `.skilled/` path once the link exists, as the route re-mint gate now does.
<!-- /ANCHOR:limitations -->

---
