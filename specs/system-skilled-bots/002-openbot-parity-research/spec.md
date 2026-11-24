---
title: "Feature Specification: OpenBot parity research for skilled bots"
description: "Skilled bots run headless jobs but lack most of what OpenBot gives a small team. This research finds the smallest set of OpenBot parts worth building, and which of eight reference repos to borrow from."
trigger_phrases:
  - "openbot parity research"
  - "research how close skilled bots can get"
importance_tier: "normal"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: OpenBot parity research for skilled bots

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
| **Created** | 2026-11-24 |
| **Branch** | `system-skilled-bots` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
Skilled bots can run a `BOT.md` by hand, from a queue or on a launchd schedule, park a question for an answer and report what ran. OpenBot gives a team far more: conversations with a bot, routines, memory, skills, connected apps, a computer, approvals and an activity feed, plus a desktop app. Nobody has yet worked out which of those parts a small team using skilled bots needs, or what the eight reference repos already solve that we could reuse.

### Purpose
A ranked, sourced build recommendation that names, for each of OpenBot's eight bot parts, what we have, what we lack, the smallest change that closes the gap and the reference repo to borrow from, plus a verdict on a terminal-first experience against a desktop app.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->
```text
$ ls specs/system-skilled-bots/context/ | wc -l
       8
$ node .skilled/bin/bots.cjs 2>&1 | grep -E '^  [a-z]' | awk '{print $1}' | sort -u | tr '\n' ' '
answer disable drain enable enqueue inbox pause resume run schedule status
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. Before you list a new file, module, option, layer or dependency, name what fails today without it, or drop it. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope
- Run one `/deep:research` loop in expansive depth mode over the eight repos in `specs/system-skilled-bots/context/` and the built bots runtime, with four lineages of 13 iterations each.
- Compare each of OpenBot's eight bot parts (conversations, routines, memory, skills, apps, computer, approvals, activity) against skilled bots today and against the seven other repos.
- Decide whether a terminal or TUI experience can match the OpenBot desktop app for our use, and what a desktop shell would add.
- Scope the result to a small team: who can talk to, approve for and change a bot, and shared versus per-person memory.
- Write a skip list of OpenBot parts we do not need, each with its reason, and note reusable code with its license.

### Out of Scope
- Building any of the recommended changes - this packet ends at a recommendation, and the build gets its own packet.
- Enterprise, multi-tenant, Kubernetes, managed-upgrade and mobile parts of OpenBot - a small team on one machine or a shared host does not need them. The research confirms each skip with a reason.
- Changing the reference repos - they are read-only inputs and stay gitignored.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `specs/system-skilled-bots/002-openbot-parity-research/research/` | Create | The loop's state, iterations, `research.md` synthesis and `resource-map.md` |
| `specs/system-skilled-bots/002-openbot-parity-research/*.md` | Modify | Packet docs and continuity |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The loop runs at least 50 iterations across Devin `deepseek-v4-1-flash-max` and Vibe `deepseek-flash` lineages, with Codex `gpt-6-luna` at `xhigh` and the `fast` tier covering any lineage that runs out of usage. | Each iteration record in `research/` carries `target_agent: "deep-research"` and `agent_definition_loaded: true`, and the records number at least 50 |
| REQ-002 | `research/research.md` covers all eight OpenBot bot parts with OpenBot's behavior, our current state, the best reference repo, the proposed change, its size and its risk. | Each of the eight parts has a row, and every row cites a `[SOURCE: path:line]` that resolves |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The synthesis gives a terminal-versus-desktop verdict, a small-team section and a skip list with a reason for each skipped part. | `research/research.md` holds all three sections |
| REQ-004 | Reusable code is named with its repo, path and license. | Each reuse candidate in `research/research.md` names its license file |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: `research/research.md` ranks the gaps so the first build packet can start from its top rows without more research.
- **SC-002**: At least 50 iteration records exist under `research/`, spread over four lineages.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Devin and Vibe daily usage | A lineage stops short of 13 iterations | Resume the shortfall on Codex `gpt-6-luna` xhigh fast, checked first with `--dry-run` |
| Risk | The workflow does not switch executors on its own | Med | Watch the run and count iterations per lineage before synthesis |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

- Can a resumed fan-out lineage run on a different executor? UNKNOWN until a `--dry-run` shows it.
<!-- /ANCHOR:questions -->

---


