---
title: "Feature Specification: Phase 20: operator-approved-closeout"
description: "The operator approved the items earlier phases left for them: an AGENTS.md cut to restore Devin headroom with the manifest write, regenerating the sk-design compiled-routing manifest without its unused outcome, and rebuilding the committed trigger index. This phase applies them in that order and records the answers."
trigger_phrases:
  - "operator approved closeout"
  - "phase 20 operator approved closeout"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 20: operator-approved-closeout

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-09 |
| **Branch** | `worktrees/334-v4-release-remediation` |
| **Parent Spec** | ../spec.md |
| **Phase** | 20 of 20 |
| **Predecessor** | 019-template-marker-upgrade-and-staleness-scope |
| **Successor** | None |
| **Handoff Criteria** | Manifest check exits 0 with at least 512 bytes of Devin headroom; sk-design compiled routing fresh; trigger index check exits 0 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 20** of the v4 release line remediation specification.

**Scope Boundary**: The four items the operator answered on 2026-11-09, applied in the order the lead set: AGENTS.md cut, manifest write, sk-design routing regeneration, trigger index rebuild. The leftover cleanup and the merge to main are the lead's.

**Dependencies**:
- Phase 013's ADR-002 and ADR-003 and phase 016's ADR-004 name the steps this phase runs.

**Deliverables**:
- AGENTS.md at least 512 bytes shorter above the Blast-Radius heading, and the manifest recording it.
- sk-design's hub router without the `none` outcome and its compiled-routing manifest regenerated.
- The committed trigger index rebuilt last.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Devin keeps the first 16,384 bytes of AGENTS.md and the last binding clause ended at byte 16,379. `agents-md-manifest.cjs --check` failed because the recorded body was no longer released. sk-design's router declared an outcome nothing emits, and removing it staled the compiled-routing manifest, which only its generator may rewrite. Each needed an operator decision.

### Purpose
Close phase 013's two findings and phase 016's deferred outcome with the operator's approval, and leave the trigger index matching the final tree.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ node .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js
  16379  #### Blast-Radius Management        (Devin keeps 16384 bytes: 5 bytes of margin)

$ node .skilled/commands/doctor/scripts/agents-md-manifest.cjs --check
[agents-md-manifest] FAIL: the manifest's derived key does not match AGENTS.md
exit 1

$ node .skilled/bin/compiled-route-manifest.cjs freshness --hub sk-design ...   # after removing none, before refresh
"fresh":false,"causeCode":"stale-manifest"
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Cut restated prose from AGENTS.md sections 1 and 2 without changing any rule's meaning.
- `agents-md-manifest.cjs --write`, then `--check`; the six doctor tests and the CI manifest step run locally.
- Remove `none` from sk-design's hub router, refresh its manifest with `compiled-route-manifest.cjs refresh`, copy it to its authored path, run sk-design's compiled-routing and package checks.
- Rebuild the trigger index with its generator and run the retrieval parity tests.

### Out of Scope
- `~/.claude/CLAUDE.md` and anything outside the repository - the operator's own copy.
- Deleting leftovers and merging to main - done by the lead.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `AGENTS.md` | Modify | Headroom cut |
| `.skilled/commands/doctor/assets/agents-md-manifest.json` | Regenerate | Released body |
| `.skilled/commands/doctor/scripts/tests/fixtures/agents-md/over-budget/fixture.json` | Modify | Padding independent of AGENTS.md length |
| `.skilled/skills/sk-design/hub-router.json` | Modify | Drop `none` |
| sk-design served and authored activation manifests | Regenerate | Policy hash |
| Trigger index and its three sidecars | Regenerate | Final corpus |
| `../013-agents-md-delivery-budget/*` | Modify | Operator approval, closure |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `check-rule-copies.js` passes with the Blast-Radius clause ending at least 512 bytes under 16,384, and no rule changes meaning. |
| REQ-002 | `agents-md-manifest.cjs --check` exits 0 after the write, and the six doctor test files and the CI manifest step pass. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | sk-design's compiled-routing freshness, guard, sync check and package validation pass with `none` removed. |
| REQ-004 | The committed trigger index passes `--check` and the retrieval parity tests pass. |
| REQ-005 | The decision record carries the four operator answers verbatim, one ADR each. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every runtime, Devin included, receives every binding clause with room for the next edit.
- **SC-002**: No advisory CI step is red on this branch for a reason the operator already decided.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A cut changes a rule's meaning | High | Line-by-line second-family review; one weakening restored |
| Risk | A test depends on AGENTS.md length | Med | Rerun every test that reads AGENTS.md and the doctor suite |
| Dependency | Trigger index must cover the final docs | Stale index | Rebuild last, then rerun `--check` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: No runtime cost; documents and generated data only.

### Security
- **NFR-S01**: Nothing outside the repository is written.

### Reliability
- **NFR-R01**: Every regenerated artifact comes from its documented generator, never a hand edit.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: none; every step has a fixed input.
- Maximum input: AGENTS.md at the 32,768-byte Codex ceiling, covered by the over-budget fixture.
- Failure path: a stale index after a late doc edit; the rebuild runs after the last doc write.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | One doc, three generated artifacts, one fixture |
| Risk | 18/25 | AGENTS.md is every runtime's instruction file |
| Research | 4/20 | Steps named by earlier decision records |
| **Total** | **32/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The operator's answers are in `decision-record.md`.
<!-- /ANCHOR:questions -->

---
