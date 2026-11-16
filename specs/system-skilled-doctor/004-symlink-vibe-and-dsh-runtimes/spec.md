---
title: "Feature Specification: Add the Mistral Vibe and DSH runtimes to the doctor link manifest and its runtime lists"
description: "The doctor link manifest lists six runtimes, while the tree also ships a .vibe and a .dsh folder. The symlink command answers unknown runtime for both, so a project cannot link either through it."
trigger_phrases:
  - "symlink vibe and dsh runtimes"
  - "add the mistral vibe and dsh runtimes"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Add the Mistral Vibe and DSH runtimes to the doctor link manifest and its runtime lists

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill every row: level, priority, status, date and branch. Use the real branch name. GOOD: Priority P1. Status Draft. Branch `feat/rotate-logs-keep`. WEAK: Priority TBD. Status maybe. -->

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | In Progress |
| **Created** | 2026-11-16 |
| **Branch** | `worktrees/425-repin-engine-limits-intake` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
`.skilled/commands/doctor/assets/symlink-manifest.json` lists the runtimes `claude`, `opencode`, `codex`, `cursor`, `devin` and `pi`. The tree also ships `.vibe` and `.dsh`, and `doctor-runtime-mirrors.yaml` already names both as runtime folders derived from `.skilled`. A project that links Skilled therefore gets no Mistral Vibe or DSH folder from `/doctor:symlink`, and `--runtimes vibe` is refused. A vendoring project reported this on 2026-11-16 and overlays the manifest to add `vibe`.

### Purpose
`/doctor:symlink` links `.vibe` and `.dsh` like every other runtime folder, and every runtime list in the doctor commands names them.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->

```text
$ node .skilled/commands/doctor/scripts/symlink-engine.cjs check --root <an empty git repository> --runtimes vibe
ERROR: unknown runtime: vibe
exit status: 2

$ node .skilled/commands/doctor/scripts/symlink-engine.cjs check --root <an empty git repository> --runtimes dsh
ERROR: unknown runtime: dsh

$ node -e 'console.log(Object.keys(require("./.skilled/commands/doctor/assets/symlink-manifest.json").runtimes))'
[ 'claude', 'opencode', 'codex', 'cursor', 'devin', 'pi' ]

$ ls -d .vibe .dsh
.dsh
.vibe
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. Before you list a new file, module, option, layer or dependency, name what fails today without it, or drop it. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope
- Add `vibe` and `dsh` to the manifest's `runtimes`, each as one `dir` entry.
- Name both in every runtime list of the symlink and install commands.
- Cover both with the link engine's tests.
- Check one real session per runtime in a project linked this way, or record that it was not checked.

### Out of Scope
- The `--tool` list of the git setup check - it already names `dsh`, and whether it should name `vibe` is a different check with its own adapter rule.
- The vendoring project's `setup-project.sh` - it is that project's file.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/doctor/assets/symlink-manifest.json` | Modify | The `vibe` and `dsh` runtime entries |
| `.skilled/commands/doctor/symlink.md` | Modify | The `--runtimes` list |
| `.skilled/commands/doctor/install.md` | Modify | The `--runtimes` list |
| `.skilled/commands/doctor/assets/doctor-symlink-link.yaml` | Modify | The runtime list |
| `.skilled/commands/doctor/assets/doctor-symlink-check.yaml` | Modify | The runtime list |
| `.skilled/commands/doctor/assets/doctor-install.yaml` | Modify | The runtime list in the ask step |
| `.skilled/commands/doctor/assets/doctor-install-presentation.txt` | Modify | The runtime list in the question |
| `.skilled/commands/doctor/scripts/tests/symlink-engine.test.cjs` | Modify | Tests that link `.vibe` and `.dsh` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `--runtimes vibe` and `--runtimes dsh` are accepted and link the folder | A test links each into a fixture and finds `.vibe` and `.dsh` as links to the checkout's folders |
| REQ-002 | A project with neither folder is not given one when `--runtimes` is omitted | A test runs a link with no `--runtimes` in a fixture without the folders and finds neither created |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Every runtime list in the symlink and install commands names eight runtimes | `rg -c 'devin,pi,vibe,dsh|devin, pi, vibe, dsh' .skilled/commands/doctor` counts the six files listed under Files to Change that hold a list |
| REQ-004 | The command contract test still passes | `node --test .skilled/commands/doctor/scripts/tests/doctor-symlink-contract.test.cjs` prints `fail 0` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: `node .skilled/commands/doctor/scripts/symlink-engine.cjs check --root <a repository> --runtimes vibe,dsh` prints no `unknown runtime` line.
- **SC-002**: `node --test .skilled/commands/doctor/scripts/tests` prints `fail 0`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | A Mistral Vibe and a DSH install to try a linked project with | Without one, only the link creation is proved, which is all the vendoring project proved too | Record which of the two was tried in a real session and which was not |
| Risk | A runtime reads a file inside its folder that must be the project's own, so a whole-folder link shares state between projects | Medium. `.vibe` holds `config.toml` and `hooks.toml` | T002 reads both folders for such a file before the manifest changes, and stops to ask when one is found |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

- Does `.vibe` or `.dsh` hold a file that must stay per project? No. T002 found none. Both runtimes keep session state, trust and logs in `VIBE_HOME` or `DSH_HOME` outside the folder. `config.toml` and `hooks.toml` are Skilled's own runtime config, like `.claude/settings.json`, which is already linked whole. The evidence is in `implementation-summary.md`.
<!-- /ANCHOR:questions -->

---


