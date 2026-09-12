---
title: "Feature Specification: The five suite failures the decommission inherited"
description: "Three were one half-finished rename and one stale census, and are fixed. Two are accuracy pins a large skill restructure moved, and are a judgment call rather than a defect."
trigger_phrases:
  - "pre-existing advisor suite failures"
  - "memory save command bridge drift"
  - "command metadata census pin"
  - "scorer baseline ratchet regression"
importance_tier: "important"
contextType: "implementation"
---
# Feature Specification: The five suite failures the decommission inherited

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-12 |
| **Branch** | `worktrees/052-swe-2-model-cutover` |
| **Origin** | Operator: "Fix pre existing", after the advisor suite was reported at 860 passed, 5 failed, 7 skipped of 872 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Five advisor suites failed, and they were carried as "pre-existing" across the whole decommission without anyone asking what they were. They are not one thing. Three are real defects with real causes. A command rename from `/memory:save` to `/speckit:save` was applied to two of the three places that describe those bridges and not the third, so the drift guard comparing them failed, the resolution guard found a slash id with no command file behind it, and both had been failing since. Separately a pinned census expected 21 declared commands where the tree now has 20, because the skill-benchmark lane was retired and took its declaration with it.

The other two are not defects. Both assert that the scorer still routes a fixed corpus exactly as well as a baseline captured on 2026-09-04. It does not: 152 correct against 154. Roughly ninety routing inputs changed in between, including a full `sk-design` restructure and new hub routers for `sk-doc` and `mcp-tooling`. The pins are measuring eight days of legitimate work, not a bug.

### Purpose

The three defects are fixed at their cause, and the two accuracy pins are separated from them so nobody keeps calling a judgment call a failure.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The half-applied `/memory:save` rename in the inventory projection block
- The stale command census pin, recounted rather than relaxed, as the test's own comment instructs
- A written account of what the two accuracy pins actually measure

### In Scope, added after the operator asked for fixes over deferrals
- **Re-capturing the scorer baseline.** The earlier caution was wrong: the release floors are separate hardcoded constants the baseline never touches, and at 0.7795 the live number clears the 0.75 floor with room
- **Identifying the two regressed prompts and disposing of them.** Both were found, measured in both scoring regimes, and recorded on the accepted list the parity suite already maintains for exactly this case

### Out of Scope
- **Re-tuning vocabulary to recover the two prompts.** It was attempted and moved neither, which is what identifies dilution rather than a missing term as the cause. Resolving hub vocabulary bleed is routing-quality work with its own blast radius
- **The Python scorer's `/memory:save` vocabulary.** It is the fallback scorer the parity suites measure against; changing it moves the very numbers under discussion, so it waits on the baseline decision
<!-- /ANCHOR:scope -->

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-skill-advisor/runtime/lib/scorer/projection.ts` | Modify | Inventory projection block brought in line with the command-bridge block it is compared against |
| `.opencode/skills/system-skill-advisor/runtime/tests/command-metadata-e2e.vitest.ts` | Modify | Census pin recounted from 21 to 20, with the retirement that moved it recorded |

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | No bridge cites a slash id with no command file behind it | The resolution guard passes |
| REQ-002 | The two blocks describing the same bridges agree | The drift guard passes |
| REQ-003 | The census pin matches a recount, and the recount is explained | The metadata suite passes and names the retired command |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The two accuracy pins are diagnosed, not silently relaxed | This packet states what moved them and what the shipped floor gate says |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The three command suites pass, 12 tests
- **SC-002**: The fix is shown not to move scorer accuracy, measured with and without it
- **SC-003**: The shipped routing-accuracy floor gate still reports a pass
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Editing routing vocabulary silently moves scorer accuracy | High | Measured both ways: 152 with and without the change, so it moved nothing |
| Risk | Updating a pinned count hides a real regression | High | The census was recounted independently and the retirement that removed the command was found in history before the pin was touched |
| Risk | Treating the accuracy pins as failures invites relaxing them | Med | They are recorded here as a decision the operator owns, with the numbers |
| Dependency | The corpus and holdout files | Low | Their hashes still match the baseline, so the data did not move; only the scorer's inputs did |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Whether to re-capture the scorer baseline at 152 or spend the work recovering the two prompts. Re-capturing lowers a release floor; recovering them is routing-quality work.
- Whether a pin this tight is the right instrument at all, when ninety routing inputs can legitimately change between captures.
<!-- /ANCHOR:questions -->

---
