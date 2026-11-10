---
title: "Feature Specification: Phase 7: search-routing-followups"
description: "The search command still ran the raw ripgrep recipe, so the per-file flood control never reached it, and the advisor sent spec-search prompts to other skills."
trigger_phrases:
  - "search routing followups"
  - "phase 7 search routing followups"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 7: search-routing-followups

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
| **Created** | 2026-11-10 |
| **Branch** | `hooks-plugins-extensions/0335-sweet-search-retrieval-build` |
| **Parent Spec** | ../spec.md |
| **Phase** | 7 of 7 |
| **Predecessor** | 006-rg-flood-control |
| **Successor** | None |
| **Handoff Criteria** | Advisor probe P01 routes to `system-spec-kit`, the default `/speckit:search` lane runs the wrapper, and the alignment battery reports 0 failures |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 7** of the Route the search command through the wrapper and spec-search prompts to system-spec-kit specification.

**Scope Boundary**: The `/speckit:search` command documents and the `system-spec-kit` advisor signals. No retrieval code changes.

**Dependencies**:
- Phase 6 shipped the wrapper record with `schemaVersion: 2`, which this phase puts in front of the command.

**Deliverables**:
- The default free-text lane of `/speckit:search` runs `rg-wrapper.mjs structured`.
- Four retrieval phrases in the `system-spec-kit` `intent_signals`.
- A recorded decision on the `AGENTS.md` Gate 1 sentence.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
Phase 6 gave `rg-wrapper.mjs` one row per file and a 20-file cap, but `/speckit:search` kept running the raw Section 2.1 recipe, so a person using the command still got every matching line. The skill advisor also sent two spec-search prompts to `sk-doc` and `sk-code`, because `system-spec-kit` declared no search phrase among its intent signals.

### Purpose
A common phrase typed into `/speckit:search` returns 20 ranked files with a hidden count, and a prompt about searching the spec docs routes to `system-spec-kit`.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->
```text
$ rg --no-config --hidden --json --fixed-strings --ignore-case --glob '*.md' --glob '!**/z_archive/**' --glob '!**/node_modules/**' --glob '!**/.git/**' --glob '!**/scratch/**' -- 'trigger index' specs .skilled | grep -c '"type":"match"'
2614

$ node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"Search the spec and skill docs for a common phrase and return one highest-ranked row per file, capped at 20 files by default, with hidden-result counts and an option to remove the cap."}' --format json
top skill: sk-doc, confidence 0.87, lane explicit_author (recorded in the phase 6 alignment report, probe P01)
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope
- Route the default free-text lane of `/speckit:search` through `rg-wrapper.mjs structured --json`.
- Reword the presentation asset and the command README so they describe the wrapper as the lane the command runs.
- Add four retrieval phrases to the `system-spec-kit` `intent_signals` and rebuild the advisor.
- Record why the `AGENTS.md` Gate 1 sentence stays as written.

### Out of Scope
- The path-only, count and context recipes - they return paths or counts, which cannot flood, and the wrapper has no context mode.
- `AGENTS.md` and its manifest copies - the sentence is still true, and it is the contract every vendoring repository reads.
- Advisor scorer code - the miss was missing vocabulary, which metadata fixes.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/speckit/search.md` | Modify | Default free-text lane runs the wrapper |
| `.skilled/commands/speckit/assets/search-presentation.txt` | Modify | Raw recipe becomes the exception |
| `.skilled/commands/speckit/README.txt` | Modify | Lane table and wrapper sentence |
| `.skilled/skills/system-spec-kit/graph-metadata.json` | Modify | Four retrieval intent signals |
| `.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json` | Modify | Recompile from the metadata |
| `.skilled/skills/system-spec-kit/SKILL.md`, `changelog/v2.12.44.0.md` | Modify, Create | Version and changelog entry |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The default free-text lane of `/speckit:search` runs the wrapper | `search.md` shows `rg-wrapper.mjs structured '<QUERY>' --json` as the default command, and that command on `trigger index` returns 20 results with `hidden.files` above 0 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | The phase 6 advisor probe P01 routes to `system-spec-kit` without moving any approved route | `advisor_recommend` on probe P01 names `system-spec-kit` first, and the advisor suite passes with the divergence ledger unchanged |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: `rg-wrapper.mjs structured 'trigger index' --json` returns 20 results where the raw recipe returned 2,614 match lines.
- **SC-002**: The alignment battery over this change reports `fail=0`, and probe P01 passes.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The advisor daemon picks up metadata only after a scan and rebuild | Probes keep their old route | Run `skill_graph_scan --trusted`, then `advisor_rebuild --trusted --force true` |
| Risk | A query that starts with `--` is read by the wrapper as a flag | Low | The command falls back to the raw recipe for that phrase, and the wrapper exits 2 instead of searching for something else |
| Risk | New signals pull unrelated prompts toward `system-spec-kit` | Med | Run the whole advisor suite, which holds the routing corpus. A signal holding the word `search` did this: it moved a prompt about a `research` summary off `sk-code`, so no signal carries that word |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

None.
<!-- /ANCHOR:questions -->

---


