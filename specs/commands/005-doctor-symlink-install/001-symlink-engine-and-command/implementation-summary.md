---
title: "Implementation Summary"
description: "How the symlink engine and the /doctor:symlink router were built and verified: the ten-case suite, the two read-only live checks, the scratch apply-unlink round trip and the acceptance probes that found and fixed two engine defects."
trigger_phrases:
  - "symlink engine and command implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "commands/005-doctor-symlink-install/001-symlink-engine-and-command"
    last_updated_at: "2026-10-31T14:24:00Z"
    last_updated_by: "doctor-symlink-install-reconcile"
    recent_action: "Added the later fixes, the regression case and the acceptance probes to the build record"
    next_safe_action: "Operator commits, then pins the evidence to that commit"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "doctor-symlink-install-reconcile"
      parent_session_id: "doctor-symlink-install-build"
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-symlink-engine-and-command |
| **Completed** | 2026-10-31 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A project repo can now say what framework links it holds, what would complete them, and how to take one run back. `/doctor:symlink` puts that behind three targets: `check` only reads, `link` writes after an approved digest, and `unlink` undoes one recorded run.

### Phase 1: symlink-engine-and-command

One manifest names every path a project repo can link, so no mode carries its own list. The engine reads it and answers four questions: what is there now, what would complete the repo, apply that plan, and undo one recorded run.

Two link shapes lived in the repos that use Skilled, and no command reported either. `check` now names them per entry: `linked-whole`, `linked-merge`, `partial-merge`, `missing`, `broken`, `foreign-link`, `local` or `source-missing`. `plan` turns the same entries into an action list and prints a digest of its inputs and actions. `apply` recomposes that plan and refuses any digest that does not match, so a change between the plan an operator read and the write is caught rather than applied. `unlink` walks one run record backwards, matches each path against the text the run wrote, and skips a path that changed since. The operator gets a setup step they can read before it runs and undo after it does.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/doctor/scripts/symlink-engine.cjs` | Created | The four subcommands, the mode table, the merge walk, the digest gate and the run record |
| `.skilled/commands/doctor/assets/symlink-manifest.json` | Created | The entry map for the core folder, the seven runtimes, the four extras and the three instruction files |
| `.skilled/commands/doctor/scripts/tests/symlink-engine.test.cjs` | Created | Ten temp-tree cases over both modes, four refusals, the unlink round trip and a merge-only folder the root lacks |
| `.skilled/commands/doctor/symlink.md` | Created | The router: `check` as the default target, `link` and `unlink` as the writing targets |
| `.skilled/commands/doctor/assets/doctor-symlink-check.yaml` | Created | The read-only check workflow |
| `.skilled/commands/doctor/assets/doctor-symlink-link.yaml` | Created | The link workflow: plan, digest, then apply |
| `.skilled/commands/doctor/assets/doctor-symlink-unlink.yaml` | Created | The unlink workflow: dry run, then yes |
| `.skilled/commands/doctor/assets/doctor-symlink-presentation.txt` | Created | Every visible line the three targets print |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The engine was built, parsed, then exercised in four passes: the suite over temp trees, two read-only checks against the repos that use Skilled, one apply-then-unlink round trip against a scratch repo, and the acceptance probes that walked every flag and refusal on throwaway repos.

1. `node --check .skilled/commands/doctor/scripts/symlink-engine.cjs` exited 0.
2. `node --test .skilled/commands/doctor/scripts/tests/symlink-engine.test.cjs` ran 9 tests, 9 pass, 0 fail. The case for a merge-only folder the root lacks was added after the probes, and the suite now runs 10 tests, 10 pass, 0 fail.
3. `check` ran read-only against Obsidian Plugin with `--runtimes` set to all seven and `--link-instructions`, then against AI Systems, and both runs exited 0 without writing.
4. A scratch git repo holding a real `.claude/statusline.sh` took the full `plan` then `apply --plan-digest` sequence, and `unlink --run <dir> --yes` put it back exactly, down to the original exclude file. The run record was deleted after the check. The rerun after the two engine fixes printed `remove empty directory .github` and restored the listing and the exclude file again.
5. `bash .skilled/commands/doctor/scripts/route-validate.sh` printed `OK: route-validate — 28 routes validated, 10 warnings`, and `bash .skilled/commands/doctor/scripts/tests/run-all.sh` passed 7 suites with 0 failed.
6. The acceptance probes ran on throwaway scratch repos: text and `--json` output, `plan` twice, a root that is not a git work tree, runtime detection, both ignore overrides, eight bad invocations and the unlink refusals. They found two engine defects, both fixed; see Key Decisions.
7. A worktree root, where `.git` is a file, resolved its ignore lines through the git common dir, and `unlink --yes` left only `.git`.
8. `quality-gate.cjs` returned `"gate": "NO_BLOCKER_FOUND"` with exit 0 on the engine and its test, and `check-comment-hygiene.sh` exited 0 on the same two files.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The source-pointing test canonicalizes the link's deepest existing ancestor and compares on a path-segment boundary | The bare string prefix missed macOS `/var` against `/private/var` and matched a sibling folder that shared the first characters |
| The git `spawnSync` gets a 256 MB `maxBuffer` | Obsidian Plugin's 2.9 MB `ls-files` output overflowed the 1 MB default and failed `check` |
| `.DS_Store`, `.skilled/output` and `.claude/worktrees` are never mirrored | None of the three is framework content: two are local state, and a mirror of the output directory would link run records into the target |
| An absent merge-only folder is read as empty and planned as `mkdir` plus one link per child | `--include github` on a root without `.github` failed with ENOENT; a plan should create the folder it then fills |
| `unlink` counts the links the same run removes when it judges a folder empty | The folder the run created still held those links at the moment of the emptiness test, so the run left it behind |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --check .skilled/commands/doctor/scripts/symlink-engine.cjs` | exit 0 |
| `node --test .skilled/commands/doctor/scripts/tests/symlink-engine.test.cjs` | 9 tests, 9 pass, 0 fail, then 10 tests, 10 pass, 0 fail once the merge-only case was added. The cases: whole auto, merge keeps the local statusline, local conflict byte-identical, broken source link replaced with the outside link left, whole refuses a real folder, wrong digest exits 3, unlink dry-run and yes round-trip, root inside source exits 2, git exclude add and remove, a merge-only folder the root lacks is created, filled and removed again by unlink |
| `check --root <Obsidian Plugin>` with `--runtimes` all seven and `--link-instructions` | every runtime folder, `.skilled`, `AGENTS.md` and `CLAUDE.md` reported `linked-whole`; `.mcp.json` reported `missing`; `REPO RULES.md` reported `local`; exit 0 |
| `check --root <AI Systems>` | `.skilled`, `.claude`, `.codex`, `.cursor`, `.pi` and `.hermes` reported `partial-merge` and named the missing doctor prompts and the broken `vision.md`, `goal-opencode.md`, `plugins` and `scheduled_tasks.lock` links; `.opencode` and `.devin` reported `linked-merge` with local conflicts; `repo-rules` and `.github` reported `linked-whole`; exit 0 |
| Scratch round trip: `plan`, then `apply --plan-digest` | `.skilled` `linked-whole`, `.claude` `linked-merge`, `.mcp.json` `linked-whole`, `.opencode` `linked-whole`, and the exclude lines were added |
| `unlink --run <dir> --yes` on the same scratch repo | the repo came back to exactly `.claude/statusline.sh` with the original exclude file |
| `bash .skilled/commands/doctor/scripts/route-validate.sh` | `OK: route-validate — 28 routes validated, 10 warnings`; the warnings are informational, shared flags across targets. This phase expected 24, and the four extra are exactly this packet's symlink check, link and unlink routes and the install guide route. |
| `bash .skilled/commands/doctor/scripts/tests/run-all.sh` | 7 suites passed, 0 failed, 934 node tests. The baseline on main was 925 passing, so the delta is the 9 engine tests the run held at that point; the added regression case takes the engine suite to 10 |
| `check --json` on a scratch repo | one object with the keys `command,root,source,entries,detected_runtimes,tracked_absolute_links,git,warnings`; `tracked_absolute_links` held the committed absolute link `tracked-abs`, text mode printed its warning, and the root listing was unchanged afterwards |
| `plan` twice with the same flags | both runs exited 0, the output was byte-identical and both printed `PLAN DIGEST: ebd51114…`; the root listing was unchanged |
| A root that is not a git work tree | `--json` reported `git: false` and `ignored: null` for every entry |
| Runtime detection with no `--runtimes` | the empty root reported `detected_runtimes: []` and listed only `.skilled`, the git root with a real `.claude` reported `["claude"]`, and `--runtimes core` exited 2 with `ERROR: unknown runtime: core` |
| Eight bad invocations, and `unlink` with neither flag | each exited 2 with exactly one `ERROR:` line; the unlink one printed `pass --yes to perform this unlink` |
| A path replaced after apply | `unlink --yes` exited 0, printed `changed since apply: CLAUDE.md` and left the real file in place |
| A worktree root, where `.git` is a file | the ignore lines resolved through the git common dir (`ignore-add ../main/.git/info/exclude`), `apply` exited 0, and `unlink --yes` left only `.git` |
| `quality-gate.cjs` over the engine and its test | `"gate": "NO_BLOCKER_FOUND"`, exit 0 |
| `check-comment-hygiene.sh` over the same two files | exit 0 |
| `rg -ln 'symlink-manifest.json' .skilled` | the engine, its test, the three symlink workflows, the router and the playbook scenario, every one a file this packet added |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Route registration belongs to phase 003.** This phase ships the router, its three workflows and the presentation, but the `_routes.yaml` entries, the helper menu and the advisor fixtures are phase 003's. The recorded `route-validate` run reports 28 routes where this phase expected 24; the four extra are exactly this packet's symlink check, link and unlink routes and the install guide route.
2. **The broken links are reported, not repaired.** The live check named the broken `vision.md`, `goal-opencode.md`, `plugins` and `scheduled_tasks.lock` links in the repo that links each entry; only `/doctor:symlink link`, after the operator's yes, replaces one.
3. **The live checks were read-only.** The one apply and unlink ran against a scratch repo, and the worktree case against a second scratch worktree, so no user repo has been linked by this phase.
4. **Nineteen checklist boxes carry no evidence line.** `tasks.md` leaves them open: behaviours no recorded run exercised, such as a failed apply exiting 1, an unknown `--include` value, an empty action list, a deep merge, a secrets scan and a run that prints no `Warning:` line, and document-structure checks the evidence file never covers. `acceptance-criteria.md` is the closure gate and all eleven of its rows are Met; the operator closes the open boxes or accepts them.
<!-- /ANCHOR:limitations -->

---
