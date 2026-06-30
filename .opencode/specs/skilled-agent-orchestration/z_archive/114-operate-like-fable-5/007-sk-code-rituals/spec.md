---
title: "Feature Specification: sk-code engineering rituals: mutation-check, verification ladder with named blind spots, and decision-economy plus fail-closed-by-construction doctrine [template:level_2/spec.md]"
description: "[What is broken, missing, or inefficient? 2-3 sentences describing the specific pain point.]"
trigger_phrases:
  - "feature"
  - "specification"
  - "name"
  - "template"
  - "spec core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "scaffold/007-sk-code-rituals"
    last_updated_at: "2026-06-15T14:06:39Z"
    last_updated_by: "template-author"
    recent_action: "Initialized Level 2 template"
    next_safe_action: "Replace continuity placeholders"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/007-sk-code-rituals"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: sk-code engineering rituals: mutation-check, verification ladder with named blind spots, and decision-economy plus fail-closed-by-construction doctrine

<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-15 |
| **Branch** | `system-speckit/027-xce-research-based-refinement` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`sk-code` Phase 3 (`.opencode/skills/sk-code/SKILL.md` lines 41, 208-214) tells the agent to "run surface verification commands and record evidence," but it never says how to know the evidence is honest. A passing test suite is treated as proof, yet the most expensive failure class the fable-mode research found is the green-but-vacuous test: a suite that runs clean against a path it never actually exercises, or that would still pass after the production code is deleted. The skill also gives no rung-by-rung map of where verification stops short (a unit pass says nothing about in-memory wiring; an in-memory pass says nothing about the live server), and no rule for what to do with an open decision in code, so agents leave bare `TODO`s or, worse, dead controls that look wired but never fire.

### Purpose
After this phase, the `sk-code` verification guidance makes a test prove it bites before it counts as evidence, names the blind spot left by each verification rung, and replaces bare `TODO`s with named seams and fail-closed-by-construction invariants — without changing how the smart router detects or routes any code surface.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Mutation-check / claim-falsifier discipline added to the `sk-code` verification guidance (rec B4): after green, break the code to confirm the test bites; distinguish true-RED (assertion fails against correct intent) from compile-RED (the suite never compiled or ran); hunt vacuous green.
- The unit -> in-memory -> on-server -> live verification ladder added to the same guidance (rec B5), with the blind spot each rung leaves explicitly named.
- The decision-economy and fail-closed-by-construction doctrine added (rec #11 / B5): a named seam (with a closing condition) instead of a bare `TODO`, and never a dead control; prefer structural invariants over disciplinary reminders.
- Optional: surface decision-economy and/or fail-closed-by-construction as standalone constitutional rules under `.opencode/skills/system-spec-kit/constitutional/` if they warrant always-surfacing rather than living only inside `sk-code`.

### Out of Scope
- The smart-router surface detection and intent classification in `sk-code` (`.opencode/skills/sk-code/SKILL.md` §2) - unchanged; this phase only augments verification guidance and must not regress routing.
- Structural enforcement of these rituals in `deep-loop-runtime`, `post-dispatch-validate`, or `renderPromptPack` - these are advisory point-of-use rituals (recommendations.md class: advisory); structural mechanisms are recs B1/B3/B6 and live in other phases/packets.
- The governor capsule (B2), executor fail-loud provenance (B1), and behavioral measurement (C1) - separate recs owned by other phases.
- Surface-specific verification commands (the WEBFLOW/OPENCODE/UNKNOWN command table) - referenced, not rewritten.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-code/SKILL.md` | Modify | In the verification section (Phase 3, around lines 41 and 208-214): add the mutation-check / claim-falsifier ritual (break-it-to-prove-the-test-bites; true-RED vs compile-RED), the unit -> in-memory -> on-server -> live ladder with each rung's blind spot named, and the decision-economy + fail-closed-by-construction doctrine. Routing and command tables stay intact. |
| `.opencode/skills/system-spec-kit/constitutional/decision-economy.md` | Create (optional) | Standalone constitutional rule for decision-economy ("named seam not a bare TODO, never a dead control"), authored only if owner decides it warrants always-surfacing beyond `sk-code`. |
| `.opencode/skills/system-spec-kit/constitutional/fail-closed-by-construction.md` | Create (optional) | Standalone constitutional rule for fail-closed-by-construction (structural invariants over disciplinary reminders), authored only if owner decides it warrants always-surfacing. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The `sk-code` verification guidance describes the mutation-check / claim-falsifier ritual: after a green run, break the production code to confirm the test fails, and distinguish true-RED from compile-RED. | `grep` of `.opencode/skills/sk-code/SKILL.md` finds the break-it-to-prove-the-test-bites instruction and the true-RED vs compile-RED distinction in the verification section. |
| REQ-002 | The `sk-code` verification guidance includes the unit -> in-memory -> on-server -> live ladder with the blind spot each rung leaves named. | `grep` of `.opencode/skills/sk-code/SKILL.md` finds all four rungs and a named blind spot per rung in the verification section. |
| REQ-003 | The smart-router surface detection, intent classification, and verification command tables are unchanged (no regression). | `git diff` shows changes confined to the verification guidance; §2 routing text and the Verification Commands table are byte-identical except for additive ritual content. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The `sk-code` verification guidance includes the decision-economy + fail-closed-by-construction doctrine: a named seam with a closing condition instead of a bare `TODO`, never a dead control, structural invariants preferred over disciplinary reminders. | `grep` of `.opencode/skills/sk-code/SKILL.md` finds the named-seam / no-dead-control language and the fail-closed-by-construction statement. |
| REQ-005 | The owner decision on whether decision-economy / fail-closed-by-construction also become standalone constitutional rules is recorded, and any created rule files follow the existing constitutional rule format. | Open question OQ-1 resolved in this spec or `plan.md`; if rules are created, they validate against the format of the sibling files in `.opencode/skills/system-spec-kit/constitutional/`. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A reader of the `sk-code` verification section can name, after the change, exactly what a green test does NOT prove and the one action (break the code) that converts a green into evidence.
- **SC-002**: The four ladder rungs and their named blind spots are present and ordered unit -> in-memory -> on-server -> live, so an agent stops claiming "works" at the rung that did not exercise the failing path.
- **SC-003**: The decision-economy / fail-closed doctrine is stated as an instruction (named seam not a bare `TODO`, never a dead control), not as background prose.
- **SC-004**: `bash .opencode/skills/sk-code/scripts/check-comment-hygiene.sh` finds zero violations in any code snippet added to the skill, and the smart-router routing tests/behavior are unchanged.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | None - point-of-use ritual on a single read surface | No upstream blocker; does not wait on B1/B2/B3 phases | Phase can ship independently in any order |
| Risk | Verbosity bloat in `sk-code/SKILL.md` (currently 308 lines) | Med - the source's own named cost is turn-boundary verbosity; an over-long ritual section decays the skill's read-reliability | Keep additions tight and instructional; reuse the existing Phase 3 / Iron Law framing instead of a new top-level block |
| Risk | Accidental edit to smart-router routing while touching the same file | High - a routing regression breaks surface detection across all stacks | Confine edits to the verification section; verify with `git diff` and unchanged routing behavior (REQ-003) |
| Risk | Doctrine drift from the research intent (advisory creep into structural claims) | Low - misstating this as enforced when it is advisory text | Label the rituals as point-of-use advisory guidance, consistent with recommendations.md class:advisory |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The verification-section additions keep `sk-code/SKILL.md` within the skill's read budget; target net growth under ~40 lines so the skill stays scannable.
- **NFR-P02**: No new scripts or runtime steps are added to the Phase 3 verification command set; the rituals are reasoning steps an agent performs around the existing commands.

### Security
- **NFR-S01**: No secrets, credentials, or environment-specific tokens appear in any added snippet (doctrine examples use placeholder-free, generic code).
- **NFR-S02**: Any added code snippet passes comment-hygiene (no spec paths or artifact ids embedded as comments; durable WHY only).

### Reliability
- **NFR-R01**: The change is documentation-only on a read surface; rollback is a single `git revert` of the `sk-code/SKILL.md` edit with no data or state impact.
- **NFR-R02**: After the edit, `sk-code` still loads cleanly and the smart router resolves the same surfaces it resolved before (zero routing-behavior change).
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Surface with no runnable tests (UNKNOWN stack): the mutation-check still applies as a thought experiment ("if I deleted the function, what would catch it?"); guidance must not assume a test runner exists.
- A change with no production code to break (pure config/doc): the ritual reduces to "name what would have caught a wrong value"; the ladder collapses to the rungs that apply.
- A test that cannot be made true-RED because the assertion is tautological: this is itself the vacuous-green finding the ritual is meant to surface.

### Error Scenarios
- Compile-RED mistaken for true-RED: guidance must state that a suite that fails to compile or never executed is NOT a passing-then-failing proof; re-run until it compiles, then break the logic.
- A dead control that "passes" because the test exercises the live branch only: the ladder's in-memory and on-server rungs name this blind spot so the agent does not stop at unit green.
- Decision left as a bare `TODO`: guidance routes it to a named seam with a closing condition, or an `[UNCERTAIN:]` marker, never a silently dead path.

### State Transitions
- Partial ladder climb: an agent that verified unit + in-memory but not on-server must report the live blind spot as still open, not claim "works".
- Re-verification after a fix: the mutation-check is re-run against the patched code, not assumed to still bite.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | One file edited (`sk-code/SKILL.md`), up to two optional small constitutional rule files; no code or runtime change |
| Risk | 10/25 | Shared read surface; the only real risk is an accidental routing regression in the same file, mitigated by diff confinement |
| Research | 6/20 | Fully pre-researched in `002-fable-mode-efficiency-research` (recs B4/B5/#11, 6/6 convergence on mutation-check); no new investigation needed |
| **Total** | **24/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- OQ-1: Should decision-economy and/or fail-closed-by-construction also become standalone constitutional rules (always-surfacing), or live only inside `sk-code`? Recommendation: ship inside `sk-code` first; promote to a constitutional rule only if the doctrine needs to surface outside code work. (Drives REQ-005.)
- OQ-2: Do the ladder rung names (unit / in-memory / on-server / live) need surface-specific aliases for WEBFLOW (e.g., "browser console" as the live rung)? Recommendation: keep generic rung names with a one-line WEBFLOW-vs-OPENCODE mapping note rather than two ladders.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->


<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
