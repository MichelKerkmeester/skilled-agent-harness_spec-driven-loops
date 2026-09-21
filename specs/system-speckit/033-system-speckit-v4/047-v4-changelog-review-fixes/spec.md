---
title: "Feature Specification: Phase 1: v4-changelog-review-fixes"
description: "The 046 remediation shipped Complete and the LUNA 5.6 MAX FAST review of the result found eight mechanical or one-clause fixes that are machine-checkable today; this phase applies them in one atomic, evidence-anchored pass and defers the five restructure-class findings to their own future pass."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 1: v4-changelog-review-fixes

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-09-21 |
| **Branch** | `scaffold/047-v4-changelog-review-fixes` |
| **Parent Spec** | ../spec.md |
| **Phase** | 47 of 47 |
| **Predecessor** | 046-v4-changelog-remediation |
| **Successor** | None |
| **Handoff Criteria** | validate.sh 047-v4-changelog-review-fixes --strict passes with no errors; every standing 046 gate still holds on the amended changelog; the count record exists in this packet. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 47** of the v4 changelog review fixes specification.

**Scope Boundary**: The eight applicable findings from the LUNA 5.6 MAX FAST review (recorded at ../046-v4-changelog-remediation/scratch/luna-review-2026-09-21.md), applied as one checked pass: the roster count that says six where the section settles on seven; the goals count that says three where the heading and the later paragraph say four; the Pi model default spelled two ways; the version claim broader than the versioned surface; a judgment hub mentioned only in the glance; a folded heading that changed subject without warning; a glance bullet whose facts already live in their owning sections; and seven extra blank lines that break the &nbsp;-and-divider rhythm. The five restructure-class findings (the reader-facing vendor-roster dump, the rate-card dollars, the metric-soup paragraph, the caveat relocation, the Why-versus-Glance overlap) are deferred.

**Dependencies**:
- 046-v4-changelog-remediation is Complete; the changelog is pinned at its 046-close state (sha256 e3b1b5c1ede77ef5728caa27e13a0face01412cb40ea03c476a4001b407e42b6, 722 lines, skeleton 17/55/18/43).

**Deliverables**:
- The amended changelog with all eight findings applied and every standing gate still green.
- The evidence trail in this packet's scratch/ (the before-copy, the facts extraction, the before-to-after diff).
- The count record (the 046-close baseline plus this pass's deltas) in this packet's success-criteria block.
- The 033 bookkeeping (the phase-47 row, the 046→047 handoff row, the timeline milestone) and one local commit, nothing pushed.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name. (No ../changelog/ directory exists under 033; the refresh is skipped per the 045 precedent.)
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 046 remediation shipped Complete, and the LUNA 5.6 MAX FAST review of its output (13 findings, verdict: mostly reads like the README author but would not ship unchanged) recorded one high and twelve medium-or-low findings. Eight are mechanical or one-clause fixes whose truth is machine-checkable today against the repo: a roster count that contradicts its own section, a goals count that contradicts its own heading, a model default spelled two ways, a version claim broader than the versioned surface, a judgment hub with no owning mention, a folded heading that changed subject without warning, a glance bullet duplicating what its owning section says, and seven extra blank lines that break the &nbsp;-and-divider rhythm the rest of the document follows. The remaining five findings are restructure-class and deserve their own pass.

### Purpose
Apply the eight machine-checkable review findings in one atomic, evidence-anchored edit pass, leaving every standing gate green and every pinned count unchanged.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The roster-count reconciliation: the Pi paragraph's "of the six." becomes "of the seven." (the section's own dominant count; the dispatch-plus-hosting claim holds against all seven).
- The goals count: the Hooks intro's "across three tools" becomes "across four tools" (the Goals heading and the later paragraph both say four).
- The model-default spelling: "DeepSeek V4 Flash as its default" becomes "DeepSeek V4.1 Flash as its default" (the tracked default model is deepseek-v4.1-flash).
- The version-claim narrowing: "Every authored markdown file now carries" becomes "Every skill definition now carries" (15 of 15 skill definitions carry the field; several agents and commands do not).
- The judgment-hub owning mention: one new sentence at the end of the Orchestrating section's introduction, strictly within the reviewed facts.
- The folded-heading bridging lead: one new sentence directly under "#### A Closed Roster" covering both of the heading's subjects (the subagent machinery and the closed model roster).
- The glance slot: the "Two hubs graduated" bullet (whose facts survive in the Orchestrating sentence and the MCP section) is replaced by the source-root bullet, keeping the glance at 15.
- The blank-line rhythm: seven extra blank lines deleted (after the &nbsp; at the Hermes and A-Closed-Roster headings, twice between paragraphs, and before three section dividers).

### Out of Scope
- The five restructure-class findings (vendor-roster dump, rate-card dollars, metric soup, caveat relocation, Why-versus-Glance overlap) - each needs its own checked pass per the 045/046 doctrine, and the review scored each only medium.
- `.pi/settings.json` - a concurrent runtime bump; left unstaged.
- Any push - the standing grant covers both earlier commits; this one lands locally.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| CHANGELOG-v4.0.0.0.md (033 root) | Modify | The thirteen-anchor edit pass applying the eight findings |
| 033 spec.md | Modify | The injected phase-47 and handoff rows, filled |
| 033 timeline.md | Modify | The phase-47 milestone line |
| 047-v4-changelog-review-fixes/ | Create | This packet: spec, plan, tasks, implementation summary, scratch evidence |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Apply the eight review findings to the changelog as thirteen whole-anchor edits in one atomic call, each anchor proven unique (count==1) against the pinned pre-edit file. | Each finding's acceptance grep returns its expected post-edit count: "runtime integration of the seven" 1, "across four tools" 1, "DeepSeek V4.1 Flash as its default" 1, "Every skill definition now carries" 1, the cli-jev sentence 1, the A-Closed-Roster lead 1, the source-root bullet 1, and 0 lines carrying double blanks in the seven repaired spots. |
| REQ-002 | Every standing 046 gate still holds on the amended changelog. | The wall census returns 0; the HVR scan returns 0 hard blockers; no semicolon outside &nbsp;; the skeleton stays 17 H2 / 55 H4 / 18 '---' / 43 '&nbsp;'. |
| REQ-003 | The count record: the 046-close baseline, this pass's deltas, and the before-to-after accounting, recorded in this packet. | The success-criteria block carries the baseline (722 lines, 17/55/18/43, sha256 e3b1b5c1…, 0 walls, 0 hard blockers, 0 semicolons outside &nbsp;) and the delta arithmetic (-7 blank lines, +2 inserted sentences as paragraphs, 1 bullet swap, net 718 lines); the scratch/ before-copy and facts extraction exist and the before-to-after diff maps 1:1 to the thirteen declared edits. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The 033 bookkeeping and the close: the phase-47 scope row and the 046→047 handoff row filled, the timeline milestone added, the derived metadata repaired, one local commit over explicit paths with nothing pushed. | The 033 rows carry real content; validate.sh 047-v4-changelog-review-fixes --strict passes; the recursive parent run's only failure remains the pre-existing 030 one, disclosed; the commit's staged set excludes .pi/settings.json; nothing is pushed. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All eight findings' acceptance greps return their expected counts, each re-verified by the same grep that proved the finding (the reviewer's cited lines).
- **SC-002**: Every standing gate holds: 0 walls, 0 HVR hard blockers, 0 semicolons outside &nbsp;, the 17/55/18/43 skeleton unchanged.
- **SC-003**: The facts-before to facts-after extraction diff maps 1:1 to the thirteen declared edits, with every token change attributable to a named edit.
- **SC-004**: validate.sh 047-v4-changelog-review-fixes --strict passes with no errors; exactly one local commit exists for this phase, staged by explicit paths, with nothing pushed.

### Count Record

The 046-close baseline this pass amends (measured 2026-09-21 before any 047 edit):

| Measure | 046 close (before) | 047 pass (after) | Why |
|---------|--------------------|------------------|-----|
| Lines | 722 | 719 | -7 extra blank lines deleted, +4 lines inserted (two one-sentence paragraphs, each with its separating blank) |
| H2 | 17 | 17 | Headings untouched; the pass is prose and whitespace only |
| H4 | 55 | 55 | Headings untouched |
| '---' | 18 | 18 | Dividers untouched; only their preceding extra blanks |
| '&nbsp;' | 43 | 43 | Separators untouched |
| sha256 | e3b1b5c1ede77ef5728caa27e13a0face01412cb40ea03c476a4001b407e42b6 | recorded in the implementation summary after the gates | The post-edit hash closes this record |
| Walls | 0 | 0 | The two inserted paragraphs are one sentence each; no other paragraph changes |
| HVR | 0 hard blockers, -20 deductions, 80/100 | re-measured after the edit | The pass adds no sentence over the admitted patterns |
| Semicolons outside '&nbsp;' | 0 | 0 | The inserted sentences use periods and one colon each |

The thirteen edits are one atomic call, so there is no intermediate state between the baseline and the post-edit measurement. The skeleton pins are untouched by construction: every edit is prose-internal, a blank-line deletion, or a paragraph insertion that preserves the ¶→H4 separator convention.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | 046-v4-changelog-remediation Complete; the changelog pinned at its 046-close sha | What if blocked: the baseline counts would need re-deriving | The sentinel check precedes the edit; the before-copy freezes the pinned state |
| Risk | Concurrent writers were active across the 046 close (commits landed mid-close; the hooks-compat restore half-staled one 046 sentence) | High/Med/Low: Med - a concurrent changelog edit would shift anchors | The pre-edit sentinel (sha + line count) re-verifies immediately before the edit; the commit stages explicit paths only |
| Risk | One of the thirteen anchors fails uniqueness or drifts | Med - the atomic call applies nothing, which is the safe failure | Every anchor is proven count==1 against the pinned file before the call; the edit engine validates the whole batch before applying, so a failure leaves the file untouched |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The scope is fully determined by the LUNA review triage recorded at ../046-v4-changelog-remediation/scratch/luna-review-2026-09-21.md.
<!-- /ANCHOR:questions -->

---

