---
title: "Feature Specification: Rule delivery debugging"
description: "Models skip the AGENTS.md mandates to open REPO RULES.md before the first write and to load communication.md before a substantive reply, and the rate differs by executor. Find why each executor skips a mandated load and fix it through the delivery surface, never through text added to user prompts."
trigger_phrases:
  - "rule delivery debugging"
  - "mandated rule load skipped"
  - "gate 5 miss cause"
  - "reply rule miss by executor"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Rule delivery debugging

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-04 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 9 of 10 |
| **Predecessor** | 008-gate5-card-pilot |
| **Successor** | 010-rule-phrase-find-surface |
| **Handoff Criteria** | Pre-registered decision reached and the winning delivery fix adopted live, or a null result recorded |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 9** of the repo rule surfacing, concision and loading specification.

**Scope Boundary**: Why a mandated rule load is skipped, and a fix on the delivery surface: the wording and position of the mandate in `AGENTS.md`, the router's shape, a project-level `AGENTS.md`, or a hook when parent D3 allows one. User prompts never change.

**Dependencies**:
- Phase 004 analyzer and its committed baseline
- The `rule-experiment.py` harness, committed in `edba53daeb`
- Phase 008 write-task runs, which also measure the natural Gate 5 miss rate
- Phase 006 and 007 windows measured before any fix goes live

**Deliverables**:
- Natural Gate 5 and reply-rule miss rates per executor
- A cause audit of every missed run
- Pre-registration, arm runs, result and decision

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`AGENTS.md` mandates two loads: Gate 5 opens `REPO RULES.md` before the first write, and the reply-rule line loads `communication.md` and `communication-prose.md` before a substantive reply. Models follow both unevenly. In the live baseline (`004-rule-delivery-instrumentation/baselines/2026-10-04-baseline.txt`), Claude misses Gate 5 at the first write in 23.5% of 17 sessions [9.6-47.3] and Codex in 7.9% of 63 [3.4-17.3]. The reply rules are missing at the first reply of a window in 89.4% of 198 Claude write-session windows [84.3-93.0] and 47.2% of 53 Codex ones [34.4-60.3].

A 16-run pilot in isolated test environments built by `rule-experiment.py`, with reply-only prompts that never mention rules, points the same way. `communication.md` was read before the reply in 7 of 8 DeepSeek V4.1 Flash runs through Devin [52.9-97.8] and 3 of 8 GPT-6 Luna runs through Codex [13.7-69.4]. `REPO RULES.md` was read in 5 of 8 runs on each [30.6-86.3]. Devin cuts the global `AGENTS.md` at 16,384 bytes, and the reply-rule line starts at byte 14,905 of the current 26,778-byte file, inside the cut, so DeepSeek receives it. The operator does not want to fix this by prompting for the rules by hand.

### Purpose
Know why each executor skips a mandated load, and fix it on the delivery surface so the mandate is followed without anyone asking for it.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Measure natural Gate 5 and reply-rule miss rates per executor with the harness, reusing the control arms of 007 and 008 where they match the live rules
- Audit each missed run's transcript and class it: not delivered, truncated, outranked by other instructions, or seen and skipped
- Pre-register candidate fixes as harness arms: wording and position of the mandate, the router's shape, a project-level `AGENTS.md` in the environment, and a hook only if the measured miss rate justifies one under parent D3
- Adopt the winner live after the 006 and 007 windows are measured

### Out of Scope
- Any text added to a user prompt that tells the model to read a rule - it would measure prompting, not delivery, and the operator ruled it out
- Editing the live global `AGENTS.md` to run an arm - it reaches every live session through `~/.claude/CLAUDE.md`
- Changing rule text - phase 006 owns it

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `009-rule-delivery-debugging/experiment/` | Create | Arms and prompt sets for this phase |
| `009-rule-delivery-debugging/preregistration.md` | Create | Metric, sample size, arms and decision rule |
| `009-rule-delivery-debugging/results/` | Create | Aggregates-only miss rates, cause audit and decision |
| `AGENTS.md` | Modify | Only at adoption, if the winning arm moves or rewords a mandate |
| `REPO RULES.md` | Modify | Only at adoption, if the winning arm reshapes the router |
| `.skilled/skills/sk-doc/sk-create-repo-rule/scripts/rule-experiment.py` | Modify | Only if an arm needs an instruction source the harness cannot vary today |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | No candidate fix and no adopted fix adds rule-reading instructions to a user prompt. Prompt sets never mention rules |
| REQ-002 | Every rate is reported with its denominator and a Wilson 95% interval |
| REQ-003 | Natural Gate 5 and reply-rule miss rates are measured per executor with the harness, Gate 5 on write-task prompts and the reply rules on reply-only prompts |
| REQ-004 | Every missed run in the measurement is classed as not delivered, truncated, outranked or seen and skipped, with the counts per class |
| REQ-005 | The pre-registration, with its arms, metric, sample size and decision rule, is committed before the first scored arm run |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | A hook arm runs only if the measured miss rate passes a threshold stated in the pre-registration, as parent D3 requires |
| REQ-007 | The winning fix goes live only after the 006 and 007 windows are measured |
| REQ-008 | The phase records whether arms vary the global `AGENTS.md` through a project-level file or a copied global, and why |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Each executor's Gate 5 and reply-rule miss rate is known, with a cause count for its missed runs.
- **SC-002**: The decision follows the pre-registered rule, including a null result.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 008 write-task runs | Med | The harness can run write-task prompts on its own if 008 stalls |
| Risk | Executors load global instructions from different files | High | T003 traces each executor's source before any arm is drafted. `~/.codex/AGENTS.md` resolves to the repository's `.codex/AGENTS.md`, a separate 10,361-byte file, not the root `AGENTS.md` |
| Risk | A fix tuned to the fixture project does not carry to live use | Med | Adoption is followed by a live window measured with the 004 analyzer |
| Risk | Small pilot samples | Med | Sample size is set in the pre-registration, and the pilot is excluded from the result |
| Risk | Model or runtime updates during the runs | Med | Arms interleave in a seeded order, so drift spreads across arms |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

- **NFR-S01**: No reply text, transcript text, secret or credential lands in a committed artifact. Results hold aggregates only, as `rule-experiment.py score` prints them.
- **NFR-R01**: A run order is reproducible from its seed.
- **NFR-R02**: A run that exits non-zero or leaves no transcript is counted as unscorable, never dropped silently.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- A run reads the rule after replying: counted as a miss, since a rule read afterwards is a post-mortem.
- A reply-only run reads `REPO RULES.md`: recorded, but not a Gate 5 event, since Gate 5 fires on the first write.
- A write run reads `REPO RULES.md` but not the rule its action triggers: Gate 5 delivered, rule load missed, both recorded.
- A transcript shows the mandate cut off: classed as truncated, with the byte offset of the cut.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | Experiment config, results, and at adoption one or two instruction files |
| Risk | 14/25 | An adopted fix changes what every runtime loads |
| Research | 16/20 | Cause audit across two executors and a pre-registered design |
| **Total** | **42/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- How do arms vary the global instructions? The root `AGENTS.md` reaches Claude Code through the `~/.claude/CLAUDE.md` symlink, so an arm cannot edit it without changing every live session. Arms can only add a project-level `AGENTS.md` to the environment or point the executor at a copied global. This phase decides which, under REQ-008.
- How does Luna receive the mandates at all? `~/.codex/AGENTS.md` points at `.codex/AGENTS.md`, and a search of that file for `REPO RULES`, `communication.md` and `Gate 5` finds nothing. T003 settles this before arms are drafted.
- What miss rate justifies a hook arm? The pre-registration states the threshold.
<!-- /ANCHOR:questions -->

---
