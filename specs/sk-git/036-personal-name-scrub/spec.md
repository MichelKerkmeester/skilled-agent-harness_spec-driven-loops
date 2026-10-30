---
title: "Feature Specification: Remove the operator's personal account name from tracked files outside specs and rename the orphan-sweep launch agent"
description: "Tracked skills, docs and recorded evidence outside specs named the operator's personal account name in 512 files, mostly inside absolute home paths. The orphan-sweep launch agent carried it in its file name and label."
trigger_phrases:
  - "personal name scrub"
  - "remove the operator s personal account name"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Remove the operator's personal account name from tracked files outside specs and rename the orphan-sweep launch agent

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill every row: level, priority, status, date and branch. Use the real branch name. GOOD: Priority P1. Status Draft. Branch `feat/rotate-logs-keep`. WEAK: Priority TBD. Status maybe. -->

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-29 |
| **Branch** | `worktrees/279-personal-name-scrub` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
Tracked files outside `specs/` named the operator's personal account name, mostly inside absolute paths into one machine's home folder. Anyone who clones the public repository reads that name in skill docs, playbooks and benchmark evidence. The orphan-sweep launch agent template carried it in its file name and its launchd label too.

### Purpose
No tracked file outside `specs/` names the operator's personal account name, except the real repository addresses and one upgrade sentence for the renamed launch agent.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->
```text
$ git grep -il "$(id -un)" HEAD -- ":!specs/" | wc -l
     512
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope
- Rewrite absolute paths into the repository as repository-relative paths, and other home paths as `~/` paths, in every tracked text file outside `specs/`.
- Derive the one hard-coded home path in code from the repository root at run time.
- Rename the orphan-sweep launch agent template to `com.skilled.orphan-sweep.plist`, change its label and replace its absolute paths with placeholders the install step fills in.
- Rewrite the two absolute spec-folder values in the tracked council graph database.
- Add the framework changelog entry for the launch agent rename. The entry was folded into `.skilled/changelog/skilled/v4.0.1.0.md`, so that release carries it.

### Out of Scope
- Dated spec records under `specs/` - the operator chose to scrub skills and docs only.
- GitHub addresses, repository slugs and the donation link in `README.md` - they are real addresses, and changing them breaks the links.
- The spaced form of the operator's name in `LICENSE`, a `package.json` author field and one injection-screen scorer - it is a different string from the account name this packet removes.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/scripts/launchagents/com.skilled.orphan-sweep.plist` | Rename and modify | New file name, label and path placeholders |
| `.skilled/scripts/launchagents/README.md` | Modify | New label, placeholder install step and upgrade note |
| `.skilled/skills/system-spec-kit/runtime/cli/continuity/migrate-trigger-phrase-residual.ts` | Modify | Derive the Claude Code project folder name from the repository root |
| `.skilled/skills/system-deep-loop/runtime/database/council-graph.sqlite` | Modify | Repository-relative `spec_folder` values |
| `.skilled/changelog/skilled/v4.0.1.0.md` | Extend | Framework changelog entry for the rename, folded into the v4.0.1.0 release |
| Skill docs, playbooks and benchmark reports outside `specs/` | Modify | Repository-relative and `~/` paths |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | No tracked path outside `specs/` names the operator's personal account name. | `git ls-files \| grep -v '^specs/' \| grep -ic "$(id -un)"` prints 0. |
| REQ-002 | Every remaining occurrence outside `specs/` is a real repository address, the donation link or the one upgrade sentence. | `git grep -il "$(id -un)" -- ":!specs/"` lists only those files. |
| REQ-003 | Routing does not change. | `leaf-route-replay.cjs \| grep ^total` prints `total gold=65 scored=57 tied=3 mean_f1=0.9176 exact=50`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The launch agent install still works from a copy. | The documented `sed` copy lints OK with `plutil` and leaves no placeholder in the copy. |
| REQ-005 | Changed code keeps its tests passing. | The phase 6 migration vitest and the council graph script vitest pass. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: The file count in Measured Behavior falls from 512 to the files kept by REQ-002.
- **SC-002**: The compiled route guard, the Hermes sync check, the markdown link checker and `package_skill.py --check --strict` read the same as before the change.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Generated manifests that hash skill files | A stale manifest fails the route guard | Run the guard and each leaf manifest `--check` after the rewrite |
| Risk | A rewritten path in a markdown link or a shell command stops resolving | Med | Check every changed JSON parses, run the link checker and hand-edit each bare repository-root mention |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

- Should the donation link in `README.md` stay? It is kept for now because it is a real address.
<!-- /ANCHOR:questions -->

---


