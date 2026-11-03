---
title: "Feature Specification: Phase 6: open-items-and-alignment"
description: "Phases 001 to 005 left five items open: a stale gold-corpus pin, a same-mode tie that throws in sk-design's router, a plan-only save that does not say what it skipped, a deferred changelog entry and a stale executor decision. This phase closes them and then aligns every skill the packet touched, SKILL.md, ROUTER.md, hub routing, references and assets, until the alignment check reports nothing open."
trigger_phrases:
  - "open items and alignment"
  - "phase 6 open items and alignment"
  - "same mode tie compare text"
  - "gold corpus pin"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 6: open-items-and-alignment

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-11-03 |
| **Branch** | `worktrees/314-frontend-upstream-proposals` |
| **Parent Spec** | ../spec.md |
| **Phase** | 6 of 6 |
| **Predecessor** | 005-inferred-confirmations |
| **Successor** | None |
| **Handoff Criteria** | The alignment recheck reports no open finding and recursive strict validation passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the frontend upstream proposals packet.

**Scope Boundary**: the five open items phases 001 to 005 recorded, and the alignment of the skills this packet changed: `sk-code` with `sk-code-frontend`, `sk-design-fundamentals`, `mcp-figma`, `sk-create-skill` and `system-spec-kit`, plus the repository docs and indexes that describe them (the root README, the skills catalog, the changelog index, the Hermes sync contract) and the compiled routers the packet's own fixes changed.

**Dependencies**:
- Phase 005 closed, and main merged into the branch (`5117366374`), so the next system-spec-kit version is known.

**Deliverables**:
- One fix per open item, each with its evidence.
- An alignment run over the branch, its findings fixed, and a recheck that leaves none open.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`compiled-route-admission.test.cjs` pins 96 gold scenarios, but the live corpus holds 84, because the doctor scenarios moved to the central playbook in `28b388e81b` without a re-pin. sk-design's canary router throws when two intents of one mode tie, because `compareText` is never defined in that file, so routing falls back to legacy. A plan-only save with no continuity payload refreshes metadata only and never says so, the rank 12 fix has no system-spec-kit changelog entry, and the parent goal still names codex as the build executor.

### Purpose
Every open item is closed, and every skill this packet touched reads the same in its SKILL.md, ROUTER.md, hub routing, references and assets.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ node --test .skilled/bin/tests/compiled-route-admission.test.cjs
✖ the live corpus holds the pinned number of gold scenarios
  84 !== 96
(per hub now: sk-code=8 system-deep-loop=16 mcp-tooling=16 cli-external-orchestration=10
 cli-classifier=4 sk-doc=26 sk-design=4; at the 96 pin, 0bf2d2c3d46: sk-code=15 system-deep-loop=21)

$ node -e '<scoreIntents on a snapshot with two same-mode intents that tie>'
THROWS: compareText is not defined

$ grep -n "plannerMode" .skilled/skills/system-spec-kit/runtime/cli/core/workflow.ts
525:  if (plannerMode !== 'full-auto') {     (logs only when the payload carries continuity fields)
650:  if (plannerMode !== 'full-auto') {     (logs only when it carries operator decisions)
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Re-pin the admission corpus at its live size, naming the move that shrank it.
- Define the tie-break comparator in sk-design's canary router, authored and served, with a test that ties two same-mode intents.
- Print one summary line on every save that is not `--full-auto`, saying the continuity fields were not written.
- Add the system-spec-kit changelog entry for the trigger-index warning and the plan-only line, and record the build executor change in the parent goal.
- Run `/local-skilled-alignment` over the branch with DeepSeek V4.1 Flash on opencode-go, fix each finding it confirms on a touched skill, and recheck until none is open.

### Out of Scope
- Findings on skills this packet did not touch, and battery failures that predate the branch on main - they belong to their owners and are listed, not fixed.
- The operator-local alignment harness under `.skilled/commands/assets/local-*` - it is gitignored, so a defect in it is reported to the operator.
- Changing the alignment workflow itself - it is used as shipped, with only an executor config passed through `--config`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/bin/tests/compiled-route-admission.test.cjs` | Modify | Re-pin `LIVE_CORPUS_SIZE` |
| `009-parent-hub-rollout/009-sk-design/lib/canary-router.cjs`, authored and served | Modify | Define `compareText` |
| `.skilled/bin/tests/compiled-route-sk-design-tie.test.cjs` | Create | Same-mode tie routes without throwing |
| `.skilled/skills/system-spec-kit/runtime/cli/core/workflow.ts` and a vitest | Modify, create | Plan-only summary line |
| `.skilled/skills/system-spec-kit/changelog/`, `SKILL.md` | Create, modify | Next version entry |
| `../goal.md` | Modify | D6 records DeepSeek builds |
| Touched skills' SKILL.md, ROUTER.md, references and assets | Modify | Whatever the alignment run confirms |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `node --test .skilled/bin/tests/compiled-route-*.test.cjs` exits 0 with no failing test |
| REQ-002 | Two same-mode intents that tie in sk-design route without throwing, in a test that fails without the fix |
| REQ-003 | The alignment recheck over the branch reports no open finding on a touched skill |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | A save without `--full-auto` prints that the continuity fields were not written, in a test that fails without the fix |
| REQ-005 | `system-spec-kit/changelog/` holds an entry for the trigger-index warning and the plan-only line, and `SKILL.md` carries its version |
| REQ-006 | The parent `goal.md` names DeepSeek V4.1 Flash on opencode-go as the build executor |
| REQ-007 | Router reach at concurrency 2 still prints `outranked=  0` on every hub after the last edit |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The compiled-route suites exit 0, where the admission suite failed `84 !== 96`.
- **SC-002**: The final alignment recheck lists no open finding on a touched skill.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | opencode-go DeepSeek through `pi` for the alignment lanes | The lanes cannot run | `pi --list-models` lists `opencode-go/deepseek-v4.1-flash`; on a refusal, stop and ask rather than re-route |
| Risk | An alignment fix in a SKILL.md or ROUTER.md moves routing | Med | Reach on every hub and the hub status after each fix batch |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Reliability
- **NFR-R01**: The plan-only line changes no exit code and no written file.
- **NFR-R02**: The tie fix keeps the existing order: score, then mode tie-break rank, then intent name.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a save with no continuity payload still prints the plan-only line, since that is the silent case.
- Maximum input: more than two tied intents of one mode keep a total order by intent name.
- Failure path: an alignment lane that fails returns no findings for its surface; the run is repeated for that lane before the recheck counts as clean.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | Four small code fixes plus the alignment findings across six skills |
| Risk | 10/25 | Routing sources change; reach and hub status gate them |
| Research | 8/20 | The alignment run does the discovery |
| **Total** | **30/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The merge conflicts were resolved by re-minting, as the operator chose.
<!-- /ANCHOR:questions -->

---
