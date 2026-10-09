---
title: "Feature Specification: Phase 2: communication-rule-upgrade"
description: "Upgrade the repository communication rules so they directly guide plain-language replies after removal of the standalone projection skill. Preserve every claim, number, caveat and protected span, and keep the Human Voice Rules as the single wording standard."
trigger_phrases:
  - "communication rule upgrade"
  - "plain-language re-render rule"
  - "communication prose guidance"
  - "human voice rules authority"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 2: communication-rule-upgrade

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-02 |
| **Branch** | `worktrees/074-sk-communication-removal` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 2 of 2 |
| **Predecessor** | `001-skill-and-command-removal` |
| **Successor** | None |
| **Handoff Criteria** | Rule implementation and scoped checks are recorded; final trigger-index regeneration/check and recursive strict validation passed for the parent and both children |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the sk-communication removal and communication-rule upgrade packet.

**Scope Boundary**: Replace the obsolete route to the deleted skill with a self-contained plain-language re-render instruction in `communication.md` §4. Add source-level sentence guidance in `communication-prose.md`; adjust `REPO RULES.md` trigger rows and `AGENTS.md` §8 only where a sentence became false.

**Dependencies**:
- Phase 1 removes the skill, commands, plugin and active integrations.
- The Human Voice Rules in `.skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md` remain available and own the wording standard.
- The operator's fidelity and history boundaries apply to every edit and verification command.

**Deliverables**:
- A `communication.md` §4 instruction for plain-language re-rendering that preserves every claim, number and caveat and keeps protected spans byte-exact.
- Sentence-level prose guidance that prevents terse machine-register phrasing at its source.
- Corrected routing text only where existing trigger or root-rule wording is no longer true.
- Final live-reference, mirror, generated-index, focused test and recursive validation evidence.

**Changelog**:
- Changelog files are historical records in this packet's scope and remain untouched.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`communication.md` §4 currently sends a reader who wants plainer wording to the skill and its rewrite command. Phase 1 removes those surfaces, and the current sentence-level prose rule does not directly prevent terse machine-register wording where it is produced.

### Purpose

Make the repository communication rules sufficient on their own for a clear plain-language reply, with an explicit content-preservation contract and one authoritative wording standard.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Rewrite `communication.md` §4 to give the plain-language re-render instruction directly.
- Require preservation of every factual claim, number, caveat and uncertainty statement; keep code, quotations, paths, identifiers and other protected spans byte-exact.
- Add source-level guidance in `communication-prose.md` that produces complete, connected sentences instead of terse machine notes.
- Correct `REPO RULES.md` trigger rows and `AGENTS.md` §8 only when a sentence became false because of the removal.
- Keep the Human Voice Rules as the sole wording standard and point to them without copying their rubric.

### Out of Scope

- Restoring or creating the skill, either rewrite command, the plugin or another projection runtime.
- Rewriting the Human Voice Rules or duplicating their vocabulary and style checklist in repo rules.
- Broad cleanup of unrelated communication rules or trigger rows that remain true.
- Historical records under `specs/` outside this authorized packet, historical `changelog/` files, and the operator's global `~/.claude/CLAUDE.md`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/repo-rules/communication.md` | Modify | Replace stale §4 routing with a self-contained, fidelity-preserving re-render instruction |
| `.skilled/repo-rules/communication-prose.md` | Modify | Add direct sentence-level guidance against terse machine-register prose |
| `REPO RULES.md` | Modify only if needed | Correct only trigger text made false by the removed skill or commands |
| `AGENTS.md` | Modify only if needed | Correct only false wording in §8; retain valid communication-rule routing |
| `.skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md` | Read only | Confirm the wording standard remains in its existing owner and is not copied |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `communication.md` §4 directly instructs a plain-language re-render and preserves every claim, number, caveat and uncertainty statement; code, quotations, paths, identifiers and other protected spans remain byte-exact. |
| REQ-002 | `communication-prose.md` contains sentence-level guidance that prevents terse machine-register phrasing at the source and keeps the connective meaning a reader needs. |
| REQ-003 | No live communication-rule or router sentence points to the deleted skill or its rewrite commands after both phases finish. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | The Human Voice Rules remain the wording authority; repo rules reference that source without copying its rubric. |
| REQ-005 | `REPO RULES.md` and `AGENTS.md` change only where removal made a sentence false; unrelated trigger behavior remains intact. |
| REQ-006 | The final live-reference sweep, mirror checks, trigger-index check, advisor route-exclusions test, touched sk-doc tests and recursive strict packet validation pass. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A reader can request a plainer version without relying on a deleted command or skill.
- **SC-002**: The instruction retains all meaning-bearing content and protected spans exactly.
- **SC-003**: Sentence-level guidance addresses the terse register at the point of writing.
- **SC-004**: The Human Voice Rules remain one source of truth, and the required repository gates pass.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Human Voice Rules under sk-doc | Without the source link, the rules may restate or drift from the wording authority | Keep the standard at its existing path and link to it; do not copy the rubric |
| Risk | A re-render instruction drops a claim, number, caveat or uncertainty qualifier | A clearer sentence could become less accurate | State preservation requirements explicitly and review representative caveated replies |
| Risk | Protected text is rewritten while simplifying surrounding prose | Commands, quoted strings or identifiers can stop matching their source | Require byte-exact spans and check them directly in the rule contract |
| Risk | Router changes extend beyond wording that became false | Unrelated behavior and trigger ownership could drift | Review the scoped diff against the existing trigger rows and §8 sentence by sentence |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The rule upgrade adds no runtime service, network call or tool invocation.
- **NFR-P02**: A plain-language re-render can use the existing response context and needs no new package dependency.

### Security
- **NFR-S01**: Protected spans remain byte-exact so commands, identifiers and quoted source are not silently altered.
- **NFR-S02**: User text, credentials and private response contents are not added to tests, logs or generated artifacts.

### Reliability
- **NFR-R01**: Rule instructions preserve all claims, values, caveats and uncertainty while changing wording.
- **NFR-R02**: The Human Voice Rules remain the only detailed wording standard; rule references stay resolvable.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: if the source is already clear and plain, return it unchanged rather than inventing edits.
- Maximum length: preserve the full reply; do not omit claims or qualifiers to shorten it.
- Invalid format: if a protected span cannot be distinguished from prose, retain the exact source text for that span.

### Error Scenarios
- Missing wording source: keep the rule's direct preservation and clarity requirements; the Human Voice Rules reference must still resolve before closure.
- Conflicting source claims: preserve the conflict and its caveat; do not resolve it while rewording.
- Unsupported visual request: the plain-language instruction does not promise a diagram or another capability.

### State Transitions
- Partial completion: the rule change remains open until global reference, mirror, index, test and validation checks are recorded.
- Session expiry: the packet's canonical spec and task files retain the scope and open checks.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 15/25 | Two communication rules and only conditionally affected router sentences |
| Risk | 14/25 | Wording must preserve claims and protected text while removing stale paths |
| Research | 8/20 | Source ownership and required checks are operator-specified; final review is semantic |
| **Total** | **37/70** | **Level 2 child** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

None. The replacement rule behavior, HVR ownership and scope limits are specified in the parent brief.
<!-- /ANCHOR:questions -->

---
