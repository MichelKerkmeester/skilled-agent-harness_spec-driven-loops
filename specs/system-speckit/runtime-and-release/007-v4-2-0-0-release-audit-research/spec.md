---
title: "Feature Specification: Deep research audit of the v4.2.0.0 changelog against the commits since v4.1.0.0 and the recent spec folders"
description: "The v4.2.0.0 release notes are written but not yet tagged, and 1,084 non-merge commits landed since v4.1.0.0. Nobody has checked the notes against that window for missing entries, drifted claims or bugs shipped in it."
trigger_phrases:
  - "v4 2 0 0 release audit research"
  - "v4.2.0.0 changelog audit"
  - "v4.2.0.0 missing entries drift bugs"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Deep research audit of the v4.2.0.0 changelog against the commits since v4.1.0.0 and the recent spec folders

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-25 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The v4.2.0.0 release notes at `.skilled/changelog/skilled/v4.2.0.0.md` describe a release that is not tagged yet, while work kept landing after the notes were drafted. A release published with a missing entry, a claim the code contradicts, or a defect shipped in the window misleads every operator who upgrades from it.

### Purpose
One synthesis that lists, with a commit hash and a `file:line` for each, every user-visible change the notes miss, every note the code contradicts and every bug found in code shipped in the window.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ git rev-list --count v4.1.0.0..HEAD; git rev-list --no-merges --count v4.1.0.0..HEAD; wc -l < .skilled/changelog/skilled/v4.2.0.0.md; git tag --list 'v4.2*' | wc -l
1204
1084
     926
       0
```
HEAD was `c75200c504a` when this was measured.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Run one `/deep:research` fan-out with two lineages: cli-codex on `gpt-6-luna` at `xhigh` on the `fast` tier, and cli-devin on `deepseek-v4-1-flash-max`, ten iterations each, convergence stop.
- Audit the window `v4.1.0.0..HEAD` (the commit list in `scratch/window-commits.txt`) and the 21 recently touched packets in `scratch/recent-packets.txt` against the release notes.
- Classify each finding as missing, drift or bug, with a commit hash, a `file:line` and the changelog line it concerns.
- Verify every finding the synthesis repeats against the repository, and settle disagreements between the two lineages by reading the code.
- Amended 2026-11-25 on the operator's instruction: fix the confirmed bugs first, then update the release notes.

### Out of Scope
- Release-note edits beyond the confirmed findings, the reorder and the section openings the operator asked for.
- Bugs the research does not confirm, and any fix beyond the two confirmed bugs and the lost executable bits of the same cause.
- Tagging or publishing v4.2.0.0 - a release action the operator owns.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `specs/system-speckit/runtime-and-release/007-v4-2-0-0-release-audit-research/research/` | Create | Fan-out state, lineage iterations and the synthesis `research.md` |
| `.skilled/commands/doctor/scripts/overlay-engine.cjs` | Modify | The reserved `root/skilled` guard compares without case |
| `.skilled/commands/doctor/scripts/tests/overlay-engine-strict-writes.test.cjs` | Modify | Regression test for a case-variant source |
| `.skilled/skills/sk-git/scripts/worktree-naming.sh`, its `tests/worktree-naming.test.sh`, `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py` | Mode | Restore the executable bit lost in the window |
| `.skilled/changelog/skilled/v4.2.0.0.md` | Modify | Release-note fixes, after the bug fixes |
| `specs/system-speckit/runtime-and-release/007-v4-2-0-0-release-audit-research/scratch/` | Create | Frozen inputs: the window commit list and the packet list |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Both lineages run and write iteration state | `ls research/lineages/*/iterations/iteration-*.md` lists files under both lineage labels, and their state rows carry `target_agent: "deep-research"` |
| REQ-002 | A synthesis exists with classified, cited findings | `research/research.md` exists, and each finding it states carries a commit hash or a `file:line` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Every finding reported to the operator was re-checked in the repository | Each reported finding names the command or file read that confirmed it, or it is marked unconfirmed |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `research/research.md` exists and `research/deep-research-config.json` reads `"status": "complete"`.
- **SC-002**: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-speckit/runtime-and-release/007-v4-2-0-0-release-audit-research --strict --quiet` prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | ChatGPT OAuth for codex and Devin account OAuth | A lineage fails at dispatch | Both pre-flights passed on 2026-11-25: `codex login status` and `devin auth status` print logged in |
| Risk | A lineage cites a `file:line` that does not exist or overstates a finding | Med | Every finding the synthesis repeats is opened in the repository first, and a disagreement is settled by the code, never by a tally |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

<!-- BEGIN GENERATED: deep-research/spec-findings -->
The canonical source is `research/research.md`. Of 26 lineage candidates, 16 were confirmed in the repository (9 missing, 5 drift, 2 bug) and 10 were rejected.

- P1 missing: the Claude Stop hook writes queued answers into the bound packet's `decision-record.md` with no note entry, on by default unless `SYSTEM_DECISION_CAPTURE_DISABLED=1`.
- P1 drift: notes line 906 installs Bladebro without the `--ignore-scripts` and digest steps that its install guide requires.
- P1 bug: `worktree-naming.sh` lost its executable bit, so the direct form at notes line 915 fails.
- Resolved 2026-11-25 by the operator: the component list names every component with a new entry, and the Stop-hook auto-record ships on by default.
<!-- END GENERATED: deep-research/spec-findings -->
<!-- /ANCHOR:questions -->

---
