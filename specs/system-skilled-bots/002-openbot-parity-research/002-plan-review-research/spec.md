---
title: "Feature Specification: Build-readiness review of the 003 build plan"
description: "The eleven 003 build phases were written alone and never checked against the runtime or each other. This run reviewed them, found two blockers and ninety-six more findings, and ranked the repair."
trigger_phrases:
  - "plan review research"
  - "phase 2 plan review research"
  - "build readiness review"
importance_tier: "normal"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Build-readiness review of the 003 build plan

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
| **Created** | 2026-11-25 |
| **Branch** | `system-skilled-bots` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 3 |
| **Predecessor** | 001-openbot-parity-research |
| **Successor** | 003-plan-depth-research |
| **Handoff Criteria** | Every P0 and P1 the review raised is fixed in the 003 docs or recorded as a decision, and the merged findings registry holds no open P0 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the Research runs for the OpenBot parity work: plan review and plan depth specification.

**Scope Boundary**: The eleven phase packets of `specs/system-skilled-bots/003-openbot-parity-build` as they stood on 2026-11-25, read against the built runtime, against each other, against the 001 parity synthesis and against the reference repos. The review reports findings and does not rewrite the phase documents.

**Dependencies**:
- The eleven 003 phase packets, each with `spec.md`, `plan.md`, `tasks.md` and `acceptance-criteria.md`.
- The built skilled-bots runtime under `.skilled/skills/system-skilled-bots/runtime/lib/`, `.skilled/bin/bots.cjs` and `scripts/bot-check.cjs`.
- The 001 parity synthesis and the reference repos under `specs/system-skilled-bots/context/`.

**Deliverables**:
- `research/research.md`, the merged synthesis with 98 deduped findings and a ranked repair order.
- `research/resource-map.md` and `research/findings-registry.json`, the resource map and the merged registry.
- `research/review-2-findings.md` to `research/review-6-findings.md`, five fresh review rounds after the first fix pass.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
The eleven phases of `003-openbot-parity-build` were written in parallel, each alone, and nobody had checked them against the built runtime or against each other. Each phase passed its own review, and two defects that only a cross-phase reading can see would stop the build on its first day. [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/002-plan-review-research/research/research.md:9]

### Purpose
A ranked, sourced repair order that names every blocker and every wrong or missing requirement in the 003 plan, with the exact edit that fixes each one, so the build starts from a plan that holds together. [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/002-plan-review-research/research/research.md:482]
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->
```text
$ find specs/system-skilled-bots/002-openbot-parity-research/002-plan-review-research/research/lineages -name 'iteration-*.md' | wc -l
      51
$ grep -h '^- R[0-9]-P0-' specs/system-skilled-bots/002-openbot-parity-research/002-plan-review-research/research/review-*-findings.md | wc -l
       9
$ grep -h '^- R[0-9]-P1-' specs/system-skilled-bots/002-openbot-parity-research/002-plan-review-research/research/review-*-findings.md | wc -l
      35
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. Before you list a new file, module, option, layer or dependency, name what fails today without it, or drop it. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope
- Run one `/deep:research` fan-out of four lineages over the eleven 003 phase packets, with 13 iterations each and the stop policy set to max iterations.
- Check each phase's plan against the built runtime: the files, functions, records, fields and verbs it names, and whether its verify commands run here.
- Check the phases against each other on the shared records: the actor, grants, `operators.json`, the conversation JSONL, the memory files, the state-root layout and the `bots --json` output.
- Rank the findings into a repair order of four gates and name the exact edit that fixes each one.
- Record the parity gaps and the overbuild that remain after all eleven phases, and the security and failure modes a small team meets.

### Out of Scope
- Building any phase or changing the 003 documents - the review reports findings and the build packet applies them.
- New design research - the run reads the plans and the runtime, and adds no design.
- Reviewing the six children of `003-terminal-screen` - they were written after this run, and the depth run uses them as its benchmark.
- Changing the reference repos under `specs/system-skilled-bots/context/` - they are read-only inputs and stay gitignored.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `research/` | Create | The four lineage folders, the merged findings registry, `research.md`, `resource-map.md` and the five review rounds |
| `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` | Modify | Packet docs and continuity |
| `goal.md` | Create | The durable directive and its completion criteria |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The run reviews all eleven 003 phase packets against the built runtime and against each other, with at least 50 iteration records across four lineages. | `find research/lineages -name 'iteration-*.md' \| wc -l` prints 51, and `research/research.md` names each of the eleven phase folders. |
| REQ-002 | Every finding names the phase, the document and line, the evidence with a resolving `[SOURCE: path:line]`, a severity and the exact edit that fixes it. | `research/research.md` holds 98 deduped findings with 2 P0, 46 P1 and 50 P2, and every P0 and P1 citation resolves to an existing file and an in-range line. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The synthesis ranks the repair into four gates and names the fix order for each phase. | `research/research.md` section 10 holds the four gates and the per-phase table. |
| REQ-004 | The synthesis records the cross-phase conflicts, the parity gaps, the overbuild, the security paths and the failure modes. | `research/research.md` sections 5 to 9 hold all five. |
| REQ-005 | Five fresh review rounds follow the first fix pass, each read-only and each recorded with its P0, P1 and P2 findings. | `research/review-2-findings.md` to `research/review-6-findings.md` exist and hold 9 P0, 35 P1 and 30 P2 findings between them. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: The 003 build plan carries one owner per shared record and no open P0, so the build can start from it.
- **SC-002**: 51 iteration records exist under `research/lineages/`, and the merged registry dedupes to 98 findings.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Devin weekly quota | devin-1 stops at 12 iterations and writes no synthesis | The other three lineages cover the four angles, and the synthesis re-checks every P0 and P1 against its source |
| Risk | A finding rests on a reading, not a run | A "cannot pass" claim is wrong | Every P0 and P1 is re-checked against the cited line, and the synthesis names what was not verified |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

- None. All eight questions the review opened are settled by the 003 docs as they now stand, and `research/research.md` names the line that settles each one.
<!-- /ANCHOR:questions -->

---


