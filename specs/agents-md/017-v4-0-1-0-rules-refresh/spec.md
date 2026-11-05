---
title: "Feature Specification: Check whether the v4.0.1.0 release means AGENTS.md or the repo rules need updating"
description: "Research-only check of whether the Skilled v4.0.1.0 release left AGENTS.md, REPO RULES.md or the rule files under .skilled/repo-rules/ pointing at renamed, removed or changed surfaces."
trigger_phrases:
  - "v4 0 1 0 rules refresh"
  - "check whether the v4 0 1 0 release"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Check whether the v4.0.1.0 release means AGENTS.md or the repo rules need updating

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill every row: level, priority, status, date and branch. Use the real branch name. GOOD: Priority P1. Status Draft. Branch `feat/rotate-logs-keep`. WEAK: Priority TBD. Status maybe. -->

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-11-05 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
The v4.0.1.0 release renamed, added and changed skills, commands, scripts and workflows. AGENTS.md (mirrored by CLAUDE.md), REPO RULES.md and the rule files under `.skilled/repo-rules/` cite many of those surfaces by path and name, so a citation can now point at something that moved or behaves differently.

### Purpose
A ranked findings list in `research/research.md`, each with the rule file:line, the v4.0.1.0 change that causes it and a proposed one-line edit, or a plain statement that nothing needs to change.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->
```text
N/A: research-only packet; the evidence lives in research/research.md and the iteration files.
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope
- Read the v4.0.1.0 release changelog, the per-skill entries it names and the v4.0.0.0..v4.0.1.0 commit range
- Check every path, command, skill, mode and script that AGENTS.md, REPO RULES.md and the repo rules cite against the current tree
- Report gaps ranked by impact, each with file:line, cause and a proposed one-line edit
- Apply finding F1 to `AGENTS.md:70` once the operator approved it, and regenerate the doctor manifest

### Out of Scope
- Any edit beyond F1 to AGENTS.md, CLAUDE.md, REPO RULES.md or a repo rule - the research found nothing else worth changing
- Auditing changes outside the v4.0.1.0 range - the question is what this release changed

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `specs/agents-md/017-v4-0-1-0-rules-refresh/research/` | Create | Deep-research state, iterations and the synthesized research.md |
| `AGENTS.md` | Modify | Gate 2 names `ROUTER.md` (finding F1) |
| `.skilled/commands/doctor/assets/agents-md-manifest.json` | Modify | Regenerated so the shipped Gate 2 section matches |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every finding cites the rule file:line and the v4.0.1.0 cause | Each finding row in research/research.md carries both citations |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Every path and command cited by the rules is checked for existence | research/research.md lists the checked citations and any missing ones |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: research/research.md exists with a ranked findings list or an explicit no-change verdict
- **SC-002**: The research run modified no file outside this spec folder, and the follow-up edit leaves `agents-md-check.cjs` at 12 of 12
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | cli-pi with the DevPass route (deepseek-v4.1-flash-1017) | Iterations cannot run | Halt and report; never switch model or provider |
| Risk | A weak executor reports an inferred finding as confirmed | Med | Orchestrator re-reads each cited line before reporting |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

- Check whether anything shipped in the Skilled v4.0.1.0 release means AGENTS.md, REPO RULES.md or the rule files under .skilled/repo-rules/ need updating or refining.

### Research Context

Deep-research is active for this topic; `research/research.md` remains the canonical findings source.
<!-- BEGIN GENERATED: deep-research/spec-findings -->
### Research Findings (generated from research/research.md)

- **Verdict:** one edit is worth making. Everything else v4.0.1.0 shipped is already carried by its owner, and no path or command the rules cite is stale.
- **F1 (P2):** `AGENTS.md:70` Gate 2 never names `ROUTER.md`, the file v4.0.1.0 moved every skill's routing into. Proposed edit: `Routing means loading what its ROUTER.md resolves, under the same loading rule as Gate 5.` (89 bytes, fits the 16,384-byte delivery prefix with 13 bytes to spare).
- **F2-F4 (P3, no edit):** citations clean across `AGENTS.md`, `REPO RULES.md` and the 13 rule files; every addition has an owner; nothing became redundant with a new gate.
- Full ranking, evidence and eliminated alternatives: `research/research.md`.
<!-- END GENERATED: deep-research/spec-findings -->
<!-- /ANCHOR:questions -->

---


