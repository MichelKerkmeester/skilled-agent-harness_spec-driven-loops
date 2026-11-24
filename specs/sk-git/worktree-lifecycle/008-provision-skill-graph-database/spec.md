---
title: "Feature Specification: Build the advisor skill-graph database when provisioning a worktree"
description: "A freshly provisioned worktree has no advisor skill-graph database, so the advisor reports degraded health and 24 advisor tests fail until someone runs the scan by hand. Provisioning now builds it."
trigger_phrases:
  - "provision skill graph database"
  - "build the advisor skill graph database when provisioning"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Build the advisor skill-graph database when provisioning a worktree

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill every row: level, priority, status, date and branch. Use the real branch name. GOOD: Priority P1. Status Draft. Branch `feat/rotate-logs-keep`. WEAK: Priority TBD. Status maybe. -->

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-11-24 |
| **Branch** | `worktrees/538-orca-labels-graph-provision` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
`worktree-naming.sh provision` installs dependencies and builds the listed outputs, but it never creates the advisor skill-graph database, `.skilled/skills/system-skill-advisor/runtime/database/skill-graph.sqlite`. The file is gitignored, so a new worktree has none. The advisor then reports degraded health, and a baseline run of the advisor suite in worktree 537 failed 24 tests and the Python suite until `skill_graph_scan --trusted` ran by hand.

### Purpose
A provisioned worktree has a skill-graph database, so the advisor reports `ok` health and its suite passes without a manual step.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->
```text
$ bash .skilled/skills/sk-git/scripts/worktree-naming.sh create orca-labels-graph-provision origin/main
provisioned: 10 installed, 5 built, 4 already present, 0 failed

$ ls .skilled/skills/system-skill-advisor/runtime/database/
README.md

$ python3 .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py --health
Skill graph: SQLite unavailable; JSON export ignored for runtime
  "status": "degraded",
```
In worktree 537, made the same way, the advisor suite failed 24 tests in 6 files before the scan and passed 3207 after it.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
### In Scope
- After the package loop, when no step failed, `provision_worktree` runs `node .skilled/bin/skill-advisor.cjs skill_graph_scan --trusted` in the worktree if `.skilled/bin/skill-advisor.cjs` exists and the database file does not.
- A failed scan counts as a failed provision, so a half-ready tree is never reported ready.
- Add regression cases with a stubbed advisor CLI: a missing database is built, an existing one is left alone, a failing scan fails provisioning, and a tree without the advisor CLI skips the step.
- Name the new step in sk-git `SKILL.md` ALWAYS rule 8.

### Out of Scope
- Listing the database as `regenerable:` for the reaper. The file's own comment says a database does not belong there.
- A changelog entry and version bump. These are left for a release pass.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-git/scripts/worktree-naming.sh` | Modify | Add the skill-graph step to `provision_worktree` |
| `.skilled/skills/sk-git/scripts/tests/worktree-naming.test.sh` | Modify | Four stubbed-CLI cases |
| `.skilled/skills/sk-git/SKILL.md` | Modify | One sentence in ALWAYS rule 8 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `worktree-naming.sh provision` on a worktree with no skill-graph database creates `runtime/database/skill-graph.sqlite`, and `skill_advisor.py --health` then prints `"status": "ok"`. |
| REQ-002 | A failing scan makes `provision` exit non-zero. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | An existing database is not rescanned, and a tree without `.skilled/bin/skill-advisor.cjs` skips the step. |
| REQ-004 | `worktree-naming.test.sh` passes, with every earlier case still passing. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
- **SC-001**: Rerunning `provision` on worktree 538 creates the database and the advisor health is `ok`.
- **SC-002**: The test file prints `FAIL=0` with more PASS cases than its 178 baseline.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The advisor CLI and its built dist | No dist means no scan | The step runs after the build loop and only when nothing failed |
| Risk | The scan leaves an advisor daemon running in the worktree | Med | Check for a lingering process after the real run; the reaper needs a process-free tree |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- FILL: Name one measurable limit per line. Write `N/A` and one reason when the packet runs no service, or delete the whole section. GOOD: The option adds under 5 ms to a run. WEAK: Performance is good. -->
<!-- /ANCHOR:nfr -->

N/A: provisioning runs no service. The scan adds a few seconds once per worktree.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES
- Empty input: a tree without the advisor CLI skips the step and provisions as before.
- Maximum input: an existing database is never rescanned, so a repeat provision is unchanged.
- Failure path: a failing scan prints `FAILED: skill-graph scan` and provisioning exits 1.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT
| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 6/25 | One function, one test block, one doc sentence |
| Risk | 6/25 | Provisioning runs on every new worktree |
| Research | 3/20 | Cause measured in worktrees 537 and 538 |
| **Total** | **15/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS
- None.
<!-- /ANCHOR:questions -->

---


