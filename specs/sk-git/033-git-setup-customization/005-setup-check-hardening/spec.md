---
title: "Feature Specification: Phase 5: setup-check-hardening"
description: "The read-only /doctor:git setup battery can report healthy while a hook is switched off, an advisory never fires or a check did not know. This phase makes every row truthful and every repair safe and correct. It also turns the CI around the battery green."
trigger_phrases:
  - "setup check hardening"
  - "phase 5 setup check hardening"
  - "git-setup-check degraded status"
  - "doctor git setup hardening"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 5: setup-check-hardening

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-10-15 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 5 |
| **Predecessor** | 004-final-deep-review |
| **Successor** | None |
| **Handoff Criteria** | Both review P1 findings fixed with a negative test each, the DEGRADED status shipped with exit 3 across every doc that states the exit codes, each repair line proved on a fixture and Gate Inputs, sk-doc Script Tests and the catalog job green |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the sk-git setup customization packet. Phase 2 built the `/doctor:git setup` battery. Phase 3 researched its weaknesses and phase 4 reviewed it with a CONDITIONAL verdict. This phase fixes what those two found.

**Scope Boundary**: the battery `.skilled/commands/doctor/scripts/git-setup-check.cjs`, its test file, the docs that state its exit codes, rows and repairs, the hooks README runtime table it is checked against, two CI workflows' inputs and the evidence rows in phases 002 and 034 that the review named. No hook, gate, contract or installer changes behavior.

**Dependencies**:
- Review report `../004-final-deep-review/review/review-report.md`, sections 2 to 8.
- Research `../003-improvement-research/research/research.md`, sections 3 to 7.
- Two operator decisions, recorded in section 4 below and not reopened here.

**Deliverables**:
- A battery whose rows cannot read healthy on input it never verified, with a DEGRADED status and exit 3.
- Repairs that each turn their row healthy on a fixture, proved by a test.
- Green Gate Inputs, sk-doc Script Tests and Feature catalog jobs.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The battery promises that a PASS row means the sk-git surface works, yet several rows pass on evidence they never checked. The suppression row reads the environment only, so a master switch saved in `hook-flags.env` silences every hook while the row prints PASS. The AI-tool row passes when the advisory's name appears under any event, so an advisory that never fires on a git command still counts as registered. A check that throws becomes UNKNOWN, and the run still ends `STATUS=OK` with exit 0. Four repairs either do not fix their row or cross the trust boundary the battery guards, and two CI workflows plus the feature catalog job fail on main.

### Purpose
An operator who runs `/doctor:git setup` can trust each row: PASS means verified, any doubt surfaces as DEGRADED or FAIL and every repair line fixes the row it follows without running code from an untrusted clone.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The two review P1 findings: the suppression check and the AI-tool registration check.
- The DEGRADED status with exit 3, and every place that documents the exit codes or the `STATUS=` line.
- The verified research findings on the gates, worktrees and AI-tool rows, plus the install, hooks and contract-dir repairs.
- A test that applies each repair line to a failing fixture and sees its row turn healthy.
- The Gate Inputs package install, the sk-doc README manifest refresh and the catalog leaf title.
- The setup dashboard's mutation class and the DOC-384 precondition.
- The ten review P2 advisories as P2 requirements.

### Out of Scope
- The per-repository `hard-rules.json` overlay. It stays a deferred design question, and research section 7 holds its proposed contract (`../003-improvement-research/research/research.md:69-77`).
- Research findings outside the listed scope: allowlist launch-error classification (1.7), hook content and executable-bit checks (1.8), containment for `core.hooksPath`, `skgit.contractDir` and `speckit.worktreeBase` (2.1, apart from the allowlist symlink), the Commit-Id waiver label (3.6), the advisory-rules message split (3.7) and a host-restart note for injected variables (3.8). Each is recorded so it is not lost, and none is planned here.
- Any behavior change in a hook, gate, contract loader, installer or allocator. The battery reports state and names repairs.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/doctor/scripts/git-setup-check.cjs` | Modify | Status model, the two P1 fixes, truthful checks, safe repairs, trust-boundary hardening |
| `.skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs` | Modify | Negative fixture per fix, repair round trips, stronger no-write and planted-helper tests |
| `.skilled/commands/doctor/assets/doctor-git-setup.yaml` | Modify | Exit-code mapping, the `STATUS=` lines and the adapter promise |
| `.skilled/commands/doctor/assets/doctor-git-presentation.txt` | Modify | Setup dashboard mutation class, the DEGRADED result block |
| `.skilled/skills/sk-git/scripts/hooks/README.md` | Modify | Section 3 rows for Claude and Codex match the real wiring |
| `.skilled/skills/sk-git/manual-testing-playbook/doctor-commands/doctor-git-setup-check.md` | Modify | DOC-384 precondition and exit codes |
| `.skilled/skills/sk-git/manual-testing-playbook/manual-testing-playbook.md` | Modify | DOC-384 summary row expectations |
| `.skilled/skills/sk-git/feature-catalog/workflow-playbooks/doctor-git-settings.md` | Modify | Leaf title and exit-code sentence |
| `README.md` | Modify | The setup verify sentence's exit codes and `--tool` |
| `.github/workflows/gate-inputs.yml` | Modify | Install and build the packages the doc-version engine loads |
| `.skilled/skills/sk-doc/scripts/tests/code-folder/durable-directory-manifest.json` | Regenerate | Refreshed by the test's own `--write` mode |
| `specs/sk-git/033-git-setup-customization/002-doctor-git-setup/acceptance-criteria.md`, `tasks.md` | Modify | Evidence the review found unverifiable |
| `specs/sk-git/034-standards-template-round-trip/tasks.md` | Modify | Scratch-only evidence on T001 and T003 replaced with reproducible commands |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

Two operator decisions bind this phase and are not reopened. **Decision 1:** a new DEGRADED status exits 3 when any check is UNKNOWN or a gate is saved off. FAIL still exits 1 and a battery crash exits 2. A run of only PASS and SKIP exits 0. **Decision 2:** the hooks repair always names this checkout's installer (the battery's own root) and never the inspected repository's own `scripts/install-git-hooks.sh`. The operator refined it on 2026-10-15 with option A, recorded in section 10.

Every evidence cell below cites a line the planner opened.

### P0 - Blockers (MUST complete)

| ID | Requirement | Evidence |
|----|-------------|----------|
| REQ-001 | The suppression row resolves each switch the way the hooks do. The environment wins whenever a name is set there, and otherwise the value comes from `hook-flags.env`, parsed in process with the same rules and never loaded as code. The file is the one `HOOK_FLAGS_CONFIG` names, or else `<repo>/.skilled/hooks/hook-flags.env` or `<repo>/.opencode/hooks/hook-flags.env`, picked by the same sentinel test. The row also honors the master alias `MK_HOOKS_DISABLED` and the concern alias `MK_GIT_PREFLIGHT_DISABLED`. Each listed value names its source, and a truthy master switch from either source fails the row. The repair names that source: `unset` for the environment, or the file and its line for a saved value. | `git-setup-check.cjs:559-566` reads `process.env` only. `hook-flags.cjs:87-89` picks the file, `:107-133` parses it and `:151-173` lets the environment win. `hook-flags.sh:12-22` picks the file from the repository's sentinel tree. `hook-flags.cjs:28` and `:74` hold the aliases. `git-preflight-advisory.mjs:81` returns early when `isHookEnabled('git-preflight')` is false |
| REQ-002 | `registersAdvisory` passes only when an entry under the runtime's own pre-tool event, with a matcher that matches the runtime's shell tool name, runs `git-preflight-advisory`. Claude needs `PreToolUse` with no matcher, an empty one or one that matches `Bash`. Codex needs `PreToolUse` with a matcher that matches both `exec` and `Bash`. Devin needs `PreToolUse` with a matcher that matches `exec`. Cursor needs `preToolUse` with a matcher that matches `Shell`. The Codex fixture moves to the real shape, and each of the four runtimes gets a wrong-event negative test. The hooks README section 3 rows for Claude and Codex are corrected to the wiring this check enforces. | `git-setup-check.cjs:580-584` matches a substring anywhere in the hooks section. Real wiring for Claude is at `.claude/settings.json:43`, `:45` and `:59`. Codex is at `.codex/hooks.json:63`, `:65` and `:74`. Devin is at `.devin/hooks.v1.json:76`, `:78` and `:92`. Cursor is at `.cursor/hooks.json:63`, `:76` and `:78`. `git-preflight-advisory.mjs:89-94` accepts `bash`, `exec` and `shell` and notes Codex sends `Bash` from 0.160. README drift: `scripts/hooks/README.md:77` says Claude has no matcher and `:78` says Codex uses `exec`. Wrong-shape fixture: `tests/git-setup-check.test.cjs:337-344` |
| REQ-003 | The battery has three outcomes. It prints `STATUS=OK checks=11` and exits 0 when every row is PASS or SKIP. It prints `STATUS=DEGRADED degraded=<n> skipped=<n> unknown=<n>` and exits 3 when no row fails and at least one row is UNKNOWN or DEGRADED. It prints `STATUS=FAIL failed=<n> degraded=<n> skipped=<n> unknown=<n>` and exits 1 when any row fails. A usage error or a crash still exits 2. The JSON `status` field carries `OK`, `DEGRADED` or `FAIL` with the same exit code. Every doc that states these codes or lines changes in the same commit. | `git-setup-check.cjs:681-686` and `:753-759` decide on FAIL alone. Doc sites: `git-setup-check.cjs:27` and `:732`, `doctor-git-setup.yaml:50`, `:52` and `:58-60`, `doctor-git-presentation.txt:247-256`, `doctor-git-setup-check.md:28`, `manual-testing-playbook.md:947`, `doctor-git-settings.md:29`, `README.md:1505`. Tests that pin the old contract: `tests/git-setup-check.test.cjs:51`, `:152-154`, `:164`, `:175` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Evidence |
|----|-------------|----------|
| REQ-004 | The gates row checks the report's shape. A report without a `gates` array, a report that does not parse and a helper that exits nonzero each give UNKNOWN with the helper's message and no repair, because `/doctor:git hooks` runs the same helper first. A gate saved off gives the new row result DEGRADED, with `/doctor:git hooks` as its repair. The helper runs with `GATE_REGISTRY` removed from its environment. | `git-setup-check.cjs:300-309` fails helper errors with a repair and passes saved-off gates. `git-hook-gates.cjs:210` reads `GATE_REGISTRY`. `doctor-git-hooks.yaml:81` starts with the same `list --json` call. `git-hook-gates.cjs:107-110` and `:128` produce `effective.state` |
| REQ-005 | The AI-tool row gives UNKNOWN, with a detail that says to pass `--tool`, when no active tool is named or detected and no configured adapter is broken. OpenCode passes only when its plugin file registers `tool.execute.before` and imports the shared `git-rule-checks.mjs`. Pi passes only when its extension registers a `tool_call` handler and imports the same module. The setup workflow's adapter promise matches what is checked. | `git-setup-check.cjs:586-591` and `:599-601` leave a tool-less run without an active tool, and `:604-607` pass OpenCode and Pi on file presence. The OpenCode adapter's anchors are `.opencode/plugins/sk-git-preflight-advisory.js:21` and `:95`, and Pi's are `.skilled/skills/sk-git/scripts/hooks/pi/git-preflight-advisory.ts:46` and `:56`. `scripts/hooks/README.md:81-82` documents both events. `doctor-git-setup.yaml:41` promises every adapter registers |
| REQ-006 | The worktree row judges the base itself. An existing base must be a writable directory. A missing base passes when its nearest existing ancestor is writable, since the helper runs `mkdir -p`. A file at the base path fails. The repair follows the winning source: it names `SPECKIT_WORKTREE_BASE` when the environment set the base, and `git config speckit.worktreeBase <dir>` otherwise. | `git-setup-check.cjs:466-472` probes the nearest existing parent of `dirname(base.dir)`. `:403-412` lets the environment win. `:74` always names git config. `worktree-naming.sh:415` runs `mkdir -p "$wtbase"` |
| REQ-007 | The hooks repair depends on which repository is inspected, per option A from section 10. When the inspected repository shares this checkout's git common dir, the battery's existing own-checkout test, the repair is `bash <this checkout's root>/scripts/install-git-hooks.sh` by absolute path. In any other repository the repair is `git config core.hooksPath <this checkout's root>/scripts/git-hooks`, which points at this checkout's hook sources. No branch names the inspected repository's installer, and the installer itself does not change. | `git-setup-check.cjs:225-230` names the inspected repository's installer when it carries the sentinel. `install-git-hooks.sh:23` and `:35-36` read the source tree from the working directory's toplevel, `:45-48` exit when it has none, and `:169-181` link that tree's hooks, which is why a foreign repository gets the hooksPath branch. `git-setup-check.cjs:282-287` already compares the two common dirs. `:248-251` accepts a hook that resolves into this checkout's hook folder |
| REQ-008 | The install repair restores only the missing paths, each named exactly, through `git -C <own checkout> restore --source=HEAD -- <path>` when the battery's root sits in a git work tree, and says to reinstall sk-git from its source otherwise. It no longer names bare `/doctor:update` or a whole-subtree restore. | `git-setup-check.cjs:72` names `git restore .skilled/skills/sk-git` and bare `/doctor:update`. `update.md:16` says bare `/doctor:update` runs the read-only `check`. `git-setup-check.cjs:205-210` already knows the exact missing paths |
| REQ-009 | When `skgit.contractDir` points to a missing directory, the standards repair names `git config --<scope> --unset skgit.contractDir` at the scope the setting came from, or creating the named directory. A malformed rules block keeps `/doctor:git standards` as its repair. | `git-setup-check.cjs:329-333` gives every `ContractError` the same repair, `:75`. `git-standards.cjs:167-175` resolves the same setting first and refuses, so the standards target never reaches `init`. `message-contract.mjs:286-296` reads the scope with `--show-scope` and throws on the missing directory |
| REQ-010 | A test applies every repair line the battery can print to a fixture where that row fails or degrades, reruns the battery and sees the row turn PASS. A repair that names a slash command is proved by running the script that command runs. | The review left this invariant unverified: `004-final-deep-review/review/review-report.md:149`. No current test reruns the battery after a repair: `tests/git-setup-check.test.cjs:398-445` asserts repair text only |
| REQ-011 | The Gate Inputs workflow installs and builds the packages the doc-version engine loads before it runs the hook test scripts, the way the sk-doc workflow does. | `.github/workflows/gate-inputs.yml:15-43` installs nothing. `.github/workflows/sk-doc-script-tests.yml:42-48` installs and builds. `frontmatter-version.mjs:32` imports `@spec-kit/shared`, which `sk-doc/package.json:11` maps to a local package whose `dist/` is ignored by `system-spec-kit/.gitignore:2` |
| REQ-012 | The frozen durable-directory manifest reproduces. It is regenerated with the test's own `--write` mode, and the diff adds only the new sk-code doctor playbook directory. | `test_readme_manifest.py:20-25` is the `--write` path. A local run on 2026-10-15 exited 1 with "frozen durable-directory manifest is not reproducible (added: .skilled/skills/sk-code/manual-testing-playbook/doctor-commands)". That directory is tracked and intended: commits `bbebc4b269` and `1b76a0653c` added its two scenarios |
| REQ-013 | The sk-git catalog leaf title matches its root H3, and the catalog validator passes every package. | `doctor-git-settings.md:2` reads "Repository settings and setup check (/doctor:git)" and `feature-catalog.md:155` reads "Repository settings and setup check". A local `validate_catalog_package.py` run on 2026-10-15 printed `root_leaf_title_mismatch` for sk-git and exited 1 |
| REQ-014 | The setup dashboard prints the mutation class of the target it is rendering, read from the route, so `setup` shows read-only. The setup result block shows the DEGRADED close. | `doctor-git-presentation.txt:89` hardcodes "Mutation class: mutates". `:79` and `_routes.yaml:280` mark setup read-only. `doctor-git-presentation.txt:253` and `:256` close on OK or FAIL only |
| REQ-015 | DOC-384's precondition supports its expectations. It requires the hooks installed and the Claude adapter registered in this checkout, or it runs the battery with the tool that is executing it, and the playbook summary row says the same. | `doctor-git-setup-check.md:26` requires only installed hooks, and `:28` expects every row to pass under `--tool claude`. `manual-testing-playbook.md:947` repeats the all-PASS claim |

### P2 - Advisories (complete OR documented deferral)

| ID | Requirement | Evidence |
|----|-------------|----------|
| REQ-016 | Every file the battery reads from the inspected repository is read only when it is a regular file under a size cap, so a FIFO or a device cannot block the run. | `git-setup-check.cjs:612` and `:393` call `readFileSync` with no type check, and REQ-001 adds a third read |
| REQ-017 | `safeGitEnv` removes `GIT_DIR`, `GIT_WORK_TREE`, `GIT_INDEX_FILE` and `GIT_COMMON_DIR`, so an inherited variable cannot point the probe at another repository. | `git-setup-check.cjs:126-135` copies the environment. The test fixture already drops two of them: `tests/git-setup-check.test.cjs:56` |
| REQ-018 | The battery resolves `git` and `bash` once to absolute paths from the absolute entries of its own `PATH`, and every child process runs that path. A relative or empty `PATH` entry is ignored. | `git-setup-check.cjs:140-146` runs bare names with the inspected root as `cwd`, as do `:161`, `:260`, `:360`, `:493` and `:744` |
| REQ-019 | The allowlist row refuses a symlinked allowlist file and an oversized one, and reports the refusal instead of echoing the file's lines. | `git-setup-check.cjs:382-388` uses `existsSync`, which follows links, and `:391-398` echoes every line. `worktree-naming.sh:148` also follows the link |
| REQ-020 | JSON and human tests cover a run with no FAIL and with SKIP, UNKNOWN or DEGRADED rows, asserting the status and the exit code each one maps to. | `tests/git-setup-check.test.cjs:130-155` derives the expectation from the same rows it checks, so a wrong mapping passes |
| REQ-021 | Human-mode tests assert every row line and every `repair:` line for a failing fixture, and 002's AC-002 and AC-007 cite those tests. | `002-doctor-git-setup/acceptance-criteria.md:55` cites tests that only check the last line. AC-007 at `:60` rests on the Codex `SessionStart` fixture that REQ-002 replaces |
| REQ-022 | The no-write test also snapshots the battery's own sk-git and doctor trees and a private `TMPDIR` given to the child, and fails on any change there. | `tests/git-setup-check.test.cjs:197-214` snapshots only the fixture repository |
| REQ-023 | The planted-helper test plants a module the battery would load if it resolved helpers from the checkout, such as `message-contract.mjs`, asserts the row that loads it was reached, and then asserts the marker is absent. | `tests/git-setup-check.test.cjs:216-256` plants `validate-message.mjs`, which no check loads, and never asserts a row reached a lookup |
| REQ-024 | A test with an allowlist under both `.skilled` and `.opencode` asserts that the patterns shown come from the file the matcher used. | `git-setup-check.cjs:358-388` takes verdicts from the matcher and patterns from its own lookup. `worktree-naming.sh:148-157` holds the matcher's order |
| REQ-025 | Completed tasks in 002 and 034 cite evidence a reviewer can rerun, a command and its expected output, instead of scratch notes. | `002-doctor-git-setup/tasks.md:35` says "scratch notes only". `034-standards-template-round-trip/tasks.md:34` and `:50` cite scratch-only baselines |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Each of the two P1 failure cases from the review now fails or degrades its row, and its new test fails when the fix is reverted.
- **SC-002**: A run with an UNKNOWN or saved-off gate row and no FAIL ends `STATUS=DEGRADED` and exits 3, in human and JSON mode.
- **SC-003**: Every repair line the battery can print turns its row PASS on a fixture, shown by one test per repair.
- **SC-004**: Gate Inputs, sk-doc Script Tests and the Feature catalog job pass on the pushed commit.
- **SC-005**: `run-all.sh`, `route-validate.sh`, `check-gate-inputs.sh` and `hvr_scan.py` on the touched docs pass, and `git-setup-check.cjs --tool claude` on this checkout still ends `STATUS=OK checks=11` with exit 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The installer's source-root rule | Low since option A: the installer is named only where it repairs this checkout | REQ-010's round trip covers both branches of the hooks repair |
| Risk | Exit 3 is new to every caller | Medium: a script that treats nonzero as FAIL now sees DEGRADED as failure | The setup YAML maps 3 explicitly, and every doc that lists the codes changes in the same commit |
| Risk | A tool-less run now degrades | Medium: `node git-setup-check.cjs` outside an AI runtime ends DEGRADED until `--tool` is passed | The UNKNOWN detail names `--tool`, and `README.md:1505` shows the flag |
| Risk | Matcher matching is regex-based | Low: an unusual but valid matcher could read as unregistered | Tests cover each runtime's real matcher from this checkout's own configs |
| Risk | Parallel work on main touches the same docs | Low | Each edit is one brief with its own diff check |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: A full battery run on this checkout stays under five seconds on the operator's machine, measured before and after.
- **NFR-P02**: The new reads add no child process. The hook-flags file and the adapter configs are parsed in process.

### Security
- **NFR-S01**: The battery still writes nothing and runs no code from the inspected repository, and the strengthened tests prove both.
- **NFR-S02**: No input from the inspected repository or the inherited environment picks a binary, a repository or a file the battery then follows outside its contract.

### Reliability
- **NFR-R01**: No input blocks the run. A FIFO, a device or an oversized file becomes a detail line.
- **NFR-R02**: A check that cannot decide reports UNKNOWN, and the run degrades instead of passing.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: a set but empty environment value wins over the file, as `hook-flags.cjs:161-162` does, and reads as not truthy.
- Maximum length: a repository-sourced file over the size cap is not read and its row reports the cap.
- Invalid format: a `hook-flags.env` that does not parse contributes nothing, matching the hooks' fail-open reader at `hook-flags.cjs:107-113`.

### Error Scenarios
- External service failure: the gate helper exits nonzero or prints a report without `gates`, and the row reports UNKNOWN.
- Network timeout: the battery makes no network call.
- Concurrent access: the battery reads a snapshot and never writes, so concurrent runs cannot conflict.

### State Transitions
- Partial completion: a check that throws becomes UNKNOWN and the run continues to the last row.
- Session expiry: not applicable to a one-shot CLI.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 15/25 | About 15 files and 480 lines, most in one script and its test |
| Risk | 12/25 | The exit-code contract is public, and the hooks repair crosses a trust boundary |
| Research | 6/20 | Research and review are done. The OpenCode and Pi shape and the Codex matcher were settled from this checkout's files |
| **Total** | **33/70** | **Level 2**, from `recommend-level.sh --loc 480 --files 15 --api`, score 52 |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- **Resolved 2026-10-15: the hooks repair for a repository other than this checkout.** The installer reads its source tree from the working directory's git toplevel, not from its own location (`install-git-hooks.sh:23`, `:35-36`). Named for another clone that carries the toolchain, it would still link that clone's own hooks (`:169-181`), and for a clone without the toolchain it exits with "no hook sources" (`:45-48`). The operator chose option A. In this checkout the repair names this checkout's installer. In any other repository it names `git config core.hooksPath` pointed at this checkout's hooks folder. The installer does not change. Options B, a source-root override in the installer, and C, the installer in every case, were not taken. REQ-007, T013, T014 and AC-012 follow A.
- **Resolved 2026-10-15: row result vocabulary.** The operator kept DEGRADED as a row result as well as a run status, used only by the gates row for a saved-off gate, so the table and the status agree.
- **Resolved 2026-10-15: hooks README wiring.** The operator kept the correction of the README section 3 rows to the real wiring: Claude matcher `Bash`, Codex matcher `exec|Bash` (REQ-002, T007).
- **Deferred design question:** the per-repository `hard-rules.json` overlay, with the contract research section 7 proposes.
<!-- /ANCHOR:questions -->

---
