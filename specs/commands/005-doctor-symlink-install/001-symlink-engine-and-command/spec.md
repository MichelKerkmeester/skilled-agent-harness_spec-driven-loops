---
title: "Feature Specification: Phase 1: symlink-engine-and-command"
description: "Two link shapes grew up in the projects that use Skilled and no script made either one, so 10 broken links in one repo and 1 in another point at checkout paths that no longer exist, and no doctor command reads any of it. This phase builds one engine that checks, plans, links and unlinks those entries, and the /doctor:symlink router in front of it."
trigger_phrases:
  - "symlink engine and command"
  - "phase 1 symlink engine and command"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "commands/005-doctor-symlink-install/001-symlink-engine-and-command"
    last_updated_at: "2026-10-31T14:24:00Z"
    last_updated_by: "doctor-symlink-install-reconcile"
    recent_action: "Amended SC-002 to the shapes the two live runs reported"
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
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 1: symlink-engine-and-command

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-31 |
| **Branch** | `worktrees/304-doctor-symlink-install` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 6 |
| **Predecessor** | None |
| **Successor** | 002-install-guide-router |
| **Handoff Criteria** | `route-validate.sh` still reports 24 routes, and `symlink-engine.cjs check` runs read-only against both user repos, so phase 002 can call it in place |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the doctor symlink and install packet: link Skilled into a user's project repo and guide that setup.

**Scope Boundary**: The engine, its entry manifest, its test file, one router with three targets, three workflow YAMLs and one presentation. Phase 002 owns the guided install command. Phase 003 owns the `_routes.yaml` entries, the helper menu, the advisor fixtures and every README.

**Dependencies**:
- The plan, digest and run-record convention `agents-md-embed.cjs` already follows, whose hash helper `lib/agents-md-sections.cjs` exports
- The thin-router shape `agents-md.md` uses: one router, one workflow per target, one presentation contract
- Both user repos, read-only, for the live dry runs

**Deliverables**:
- `scripts/symlink-engine.cjs` with `check`, `plan`, `apply` and `unlink`
- `assets/symlink-manifest.json`: the core folder, the seven runtimes, the four extras and the three instruction files
- `scripts/tests/symlink-engine.test.cjs` over temp source and target trees
- `symlink.md`, `doctor-symlink-{check,link,unlink}.yaml` and `doctor-symlink-presentation.txt`
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Two link shapes grew up in the projects that use Skilled, and no script made either one. One links whole folders at the repo root; the other keeps real runtime folders and links each entry inside them. The exploration behind this packet found 10 broken links in the second repo and 1 in the first, all pointing at Skilled paths that no longer exist. No doctor command reports a link, makes one, or takes one away.

### Purpose
One engine says what a project repo holds and what it would take to complete it, applies only the plan an operator approved by digest, and undoes exactly one run.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

```text
$ ls .skilled/commands/doctor/scripts/symlink-engine.cjs .skilled/commands/doctor/symlink.md
ls: .skilled/commands/doctor/scripts/symlink-engine.cjs: No such file or directory
ls: .skilled/commands/doctor/symlink.md: No such file or directory
```

That is the measurement taken when the phase was scoped, before either file existed: no command could report a link, so the 11 broken links in the two user repos had nothing watching them. The 10 and the 1 are the exploration's counts, recorded in the packet plan, and not a number this checkout can produce.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `check`, which reports one status per selected entry and writes nothing, in text or under `--json`
- Add `plan`, which resolves the action list and prints the digest the operator approves
- Add `apply`, which recomposes the plan, refuses a drifted digest, and records every action in a run manifest as it goes
- Add `unlink`, which undoes one recorded run in reverse and skips any path changed since
- Add the entry manifest that maps the core folder, the seven runtimes, the four opt-in extras and the three instruction files
- Add the test suite over temp trees, and the `/doctor:symlink` router with its three workflows and presentation

### Out of Scope
- The guided install command - phase 002 owns it and only prints this command's invocations
- The `_routes.yaml` entries, helper menu rows, advisor fixtures, catalogs, READMEs and runtime mirrors - phase 003 owns every integration surface
- Repairing the 11 broken links in the two user repos - `/doctor:symlink link` does that under the user's own yes once this ships
- The project-root defect when a save runs from a linked repo - packet 051 tracks it, and phase 002 only warns about it
- A `.pi-subagents` link - Skilled has no such directory, and the one in Obsidian Plugin is the broken link this command reports

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/doctor/scripts/symlink-engine.cjs` | Create | The four subcommands, CommonJS, Node built-ins only |
| `.skilled/commands/doctor/assets/symlink-manifest.json` | Create | The entry map every mode reads |
| `.skilled/commands/doctor/scripts/tests/symlink-engine.test.cjs` | Create | Temp-tree cases for both modes, the refusals and the unlink round-trip |
| `.skilled/commands/doctor/symlink.md` | Create | The router, tagged `skill_agent: system-spec-kit` |
| `.skilled/commands/doctor/assets/doctor-symlink-check.yaml` | Create | The read-only check workflow |
| `.skilled/commands/doctor/assets/doctor-symlink-link.yaml` | Create | The link workflow, plan then digest then apply |
| `.skilled/commands/doctor/assets/doctor-symlink-unlink.yaml` | Create | The unlink workflow, dry run then yes |
| `.skilled/commands/doctor/assets/doctor-symlink-presentation.txt` | Create | Every visible line the three targets print |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `check --root <dir>` writes nothing and reports one status per selected entry, from `linked-whole`, `linked-merge`, `partial-merge`, `missing`, `broken`, `foreign-link`, `local` and `source-missing`, plus the repo fields `detected_runtimes` and `tracked_absolute_links`; `--json` prints exactly one object and nothing else. |
| REQ-002 | `plan` writes nothing, resolves actions sorted by `path` then by the order `mkdir, replace-link, remove-broken, link, ignore-add`, and ends with the line `PLAN DIGEST: <64 hex>`; an empty action list prints `NOTHING TO DO` and still prints the digest. |
| REQ-003 | `apply --plan-digest <d>` recomposes the plan with the same flags, prints `DIGEST MISMATCH` and exits 3 writing nothing when the digest differs, and otherwise writes the run record before the first action and after each one. |
| REQ-004 | `unlink --run <dir>` without `--dry-run` or `--yes` prints its plan and exits 2, `--dry-run` prints it and writes nothing, and `--yes` performs it; it removes only a link whose text still matches the record, restores a recorded `from`, recreates a removed broken link, removes only empty directories the run created, removes only recorded ignore lines, and reports a path that changed since apply. |
| REQ-005 | The mode table holds: `whole` refuses a real folder, `merge` never overwrites a real path and reports each `local_conflicts` entry, `auto` links whole where the name is absent or already points at the source; the only removals any mode makes are broken links whose text starts with the source checkout path. |
| REQ-006 | An unknown flag, a flag on the wrong subcommand, a missing value, an unknown runtime, extra or mode, or a second positional exits 2 with one `ERROR:` line; a `--root` that is missing, is not a directory, equals the source, sits inside it or contains it exits 2. |
| REQ-007 | Ignore lines default to `<git-dir>/info/exclude`, and a line is written only when git does not already ignore it; `--ignore gitignore` and `--ignore none` override the file, `check` warns on every tracked absolute symlink, and a root that is not a git work tree reports `ignored: null` and skips the ignore action with a warning. |
| REQ-008 | `.skilled` is always in the runtime set, `--runtimes` accepts only the seven names, and with no list the engine detects the runtimes whose primary entry already exists and reports an empty detection instead of guessing; a manifest entry whose source path is absent is reported `source-missing` and planned as nothing. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-009 | `symlink.md` binds `check` as the default target because it only reads, `link` and `unlink` as the writing targets, and never composes a link itself: the three workflow YAMLs and the presentation own the behavior and every visible line. |
| REQ-010 | `--link-instructions` links `AGENTS.md`, `CLAUDE.md` and `REPO RULES.md`, the type `relative-link` writes its target text verbatim, `--include env` prints its secrets warning, and `.github` is merge-only so it never gets a whole-folder link. |
| REQ-011 | `symlink-engine.test.cjs` builds temp source and target trees under `os.tmpdir()` and covers whole and merge, a local-conflict refusal, pruning a broken link into the source while a foreign link is kept, a digest-drift refusal, the unlink round-trip and the target-inside-source refusal. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node --test .skilled/commands/doctor/scripts/tests/symlink-engine.test.cjs` exits 0 with `# fail 0`.
- **SC-002**: `check --root` against the repo that links whole folders reports every runtime folder, `.skilled`, `AGENTS.md` and `CLAUDE.md` as `linked-whole`, `.mcp.json` as `missing` and `REPO RULES.md` as `local`, and reports no `.pi-subagents` link because that path is outside the manifest; against the repo that links entries it reports `.skilled`, `.claude`, `.codex`, `.cursor`, `.pi` and `.hermes` as `partial-merge` and names the missing doctor prompts and the broken `vision.md`, `goal-opencode.md`, `plugins` and `scheduled_tasks.lock` links, `.opencode` and `.devin` as `linked-merge` with local conflicts, and `repo-rules` and `.github` as `linked-whole`.
- **SC-003**: An `apply` against a scratch copy writes only the planned actions, and the following `unlink --run` leaves a second `check` identical to the first.

SC-002 was amended after the live run, because the run showed the first wording asked for three things the check does not do: it named a `.pi-subagents` link the manifest never reports, it expected `linked-merge` where six folders held only a partial merge, and it carried the exploration's broken-link count where the check names each broken link instead.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Node built-in modules only (`node:fs`, `node:path`, `node:crypto`) | No engine at all if a package were required | The contract fixes CommonJS with no new dependency, so nothing is added to the tree |
| Dependency | `agents-md-embed.cjs` for the digest and run-record convention | A second convention would make the two doctor records disagree | Read `planFor` and `BACKUP_DIR` first, and reuse `sha256` from `lib/agents-md-sections.cjs` |
| Risk | A merge writes over a file the user owns | High | No mode removes or overwrites a real path; every clash is reported as `local_conflicts` and the suite pins the refusal |
| Risk | An absolute link is committed and leaks the local checkout path | Med | Ignore lines go to `.git/info/exclude` by default, and `check` warns on a tracked absolute link |
| Risk | The operator changed a path after a run and `unlink` puts the old state back | Med | Each action checks the recorded target text and skips a mismatch with `changed since apply` |
| Risk | The live dry runs touch real user repos | Low | `check` and `plan` write nothing, and `apply` runs against a scratch copy only |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: `check` runs one `git ls-files -s` per invocation and no more, whatever the entry count.
- **NFR-P02**: `plan` reads each tree once and writes nothing, so a dry run leaves the target byte-identical.

### Security
- **NFR-S01**: The engine reads paths, link text and directory listings, never file contents, so no secret is copied into a plan or a run record.
- **NFR-S02**: The only writes are a link or a directory under the root, a line in an ignore file, and the run record under the source's `.skilled/output/doctor-symlink/`.

### Reliability
- **NFR-R01**: A failed `apply` exits 1 naming the action, and the record still holds every action applied before it, so `unlink` can undo the partial run.
- **NFR-R02**: `unlink` keeps the run directory, so a skipped path can be retried from the same record.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a target that needs no action prints `NOTHING TO DO` and still prints the digest, so the operator can see that the run wrote nothing.
- Maximum input: a merge over a folder holding hundreds of entry links walks the whole tree and removes nothing but broken links whose text points into the source.
- Failure path: a `--root` inside the source exits 2 with one `ERROR:` line, and an `apply` whose digest drifted prints `DIGEST MISMATCH` and exits 3 having written nothing.
- No git work tree: `ignored` is `null` for every entry, the ignore action is skipped with a warning, and the links are still planned.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | One engine of four subcommands, one manifest, one router, three workflows, one presentation, one test file |
| Risk | 12/25 | Writes links inside a user's repository; every write is behind a digest and has a recorded undo |
| Research | 8/20 | The two shapes and the existing digest convention were read before planning |
| **Total** | **38/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- The plan calls the run directory `.skilled/output/doctor-symlink/<timestamp>`, and the frozen engine contract names it after the first 16 hex of the digest. **RESOLVED: the contract's name**, because the digest is what the operator approved and `doctor-agents-md` already names its runs that way.
- Should Pi link `.pi-subagents`? **RESOLVED: no.** Skilled has no such directory, and the link in Obsidian Plugin is exactly what `check` should report as broken.
- `/doctor:symlink` has no route until phase 003, so until then it is reachable by path only. **RESOLVED: keep the phase boundary**; phase 003 registers the three routes and proves phrase reach.
<!-- /ANCHOR:questions -->

---
