---
title: "Feature Specification: Activate the doctor helper and agents-md advisor bridges"
description: "Four doctor bridges derive but were never added to the advisor's activation list, so no advisor prompt reached /doctor:helper or /doctor:agents-md. This packet activates all four in both scoring lanes, proves every manifest phrase and runnable string with the reach probe, pins the routing slice, and holds every accuracy metric at its committed baseline."
trigger_phrases:
  - "advisor bridge activation"
  - "doctor helper advisor bridge"
  - "agents md advisor bridge"
  - "activate the doctor bridges"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "agents/021-doctor-agents-md/003-advisor-bridge-activation"
    last_updated_at: "2026-10-30T18:30:00Z"
    last_updated_by: "code-agent"
    recent_action: "Activated the four bridges and closed every gate"
    next_safe_action: "None: the packet is complete"
    blockers: []
    key_files:
      - ".skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/scoring-compatibility.json"
      - ".skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/doctor-prompts.jsonl"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "worktree-300-doctor-bridge-activation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Which wordings still reach no doctor route after activation, and whose change is that"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Activate the doctor helper and agents-md advisor bridges

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-30 |
| **Branch** | `worktrees/300-doctor-bridge-activation` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 3 |
| **Predecessor** | 002-doctor-helper |
| **Successor** | None |
| **Handoff Criteria** | `doctor-phrase-reach.cjs` exits 0 with `bridges=28` at `STATUS=OK`, the deriver reports `fresh`, and no routing-accuracy metric sits below its committed baseline |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of `agents/021-doctor-agents-md`.

**Scope Boundary**: Activation only. It adds no doctor route, no router, no phrase and no workflow. It edits the advisor's activation list, the routing fixture, the generated surfaces that list feeds, the advisor's version and changelog, one catalog note and this packet.

**Dependencies**:
- `_routes.yaml` is the only phrase table. Every phrase and runnable string the four bridges advertise is already declared there by phase 001 and phase 002; this phase copies, never invents.
- The advisor build and the `system-spec-kit` shared build must compile before the probe can score anything, because the probe refuses a stale `dist/runtime`.
- The routing-accuracy baseline pins the fixture hashes it was captured against. `doctor-prompts.jsonl` is scored by its own slice suite and is not one of the three hashed fixtures, so a new slice row does not force a re-capture.

**Deliverables**:
- Four activation entries, in both scoring lanes.
- One deriver run, whose three generated outputs stay generated.
- Thirteen routing-slice rows in four waves, one wave per bridge.
- An advisor version and changelog entry, a refreshed Hermes mirror, and a corrected catalog note.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Deriving a bridge and activating it are two different acts. The deriver turns every doctor route into an inventory entry, the TypeScript projection, a Python slash marker and a rendered runnable line, and not one of those makes an entry routable: `scoring-compatibility.json` decides that, and it named 29 TypeScript and 39 Python entries while the inventory it sits beside carried four doctor ids it did not name. `command-doctor-helper`, `command-doctor-agents-md-check`, `command-doctor-agents-md-embed` and `command-doctor-agents-md-restore` were therefore derived, listed, rendered and unreachable. An operator who asked which doctor command fits a problem, or who asked to fold `CLAUDE.md` into `AGENTS.md`, reached a skill or nothing, and the description of both surfaces sold a route the advisor could not serve.

### Purpose
Activate all four in both lanes, then prove the activation with the gates the family already owns rather than with a reading: the reach probe must show every declared phrase and every runnable string landing on its own bridge, the deriver must report the generated copies fresh, the doctor suites must pass, and every routing-accuracy metric must hold at its committed baseline.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
The tree this phase starts on carries all four bridges in the inventory and none of them in the activation list.

```text
$ node .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs --check
{
  "status": "fresh",
  "counts": {
    "commandMetadata": 19,
    "allowList": 8,
    "doctorRoutes": 28,
    "generated": 55,
    "typescriptActive": 29,
    "pythonActive": 39
  },
  "changed": []
}

$ node .skilled/commands/doctor/scripts/doctor-phrase-reach.cjs
STATUS=OK phrases=142 bridges=24
```

Twenty-eight derived doctor routes, twenty-four of them admitted. The four missing ids are the two surfaces this parent packet builds, which is why the description of each one outran what the advisor could do.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add the four ids to both the `typescript` and `python` lists in `scoring-compatibility.json`, continuing the order numbers.
- Regenerate the bridge file, the TypeScript projection and the Python markers through the deriver, then prove a second run changes nothing.
- Add routing-slice rows for each bridge: its runnable command as a prompt that must put that bridge first, plus two or three natural phrasings taken from its own manifest phrases.
- Rebuild the advisor, refresh its skill graph, and require the reach probe to report 28 bridges at every declared phrase.
- Bump the advisor skill version with a changelog entry, refresh the Hermes mirror, and correct the catalog note that listed six active bridges as if the rest were not.
- Author this phase child and add its row to the parent's phase map.

### Out of Scope
- Any edit to `_routes.yaml`. All four bridges already reach every phrase they declare, so a phrase change would be tuning a route that is not broken.
- Widening the doctor vocabulary for wordings no route declares, such as a bare "something is broken, which doctor fixes it". That request reaches `/doctor:helper`'s own matcher as `NO_MATCH` too, so the gap is the matcher's tuned contract and belongs to a packet that owns its held-out set.
- Rewriting released changelog entries or the packet's historical decision rows. They record what those releases said.
- Re-capturing the scoring baseline. No metric moved, so a new baseline would only move the pin.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/scoring-compatibility.json` | Modify | The four activation entries, in both lanes |
| `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json` | Regenerate | The deriver's inventory copy |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts` | Regenerate | The generated TypeScript projection block |
| `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py` | Regenerate | The generated Python projection block |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/doctor-prompts.jsonl` | Modify | Thirteen slice rows in four waves |
| `.skilled/skills/system-skill-advisor/SKILL.md` | Modify | Skill version to the next free one |
| `.skilled/skills/system-skill-advisor/changelog/v0.17.30.0.md` | Create | The release note for the activation |
| `.hermes/skills/system-skill-advisor/SKILL.md` | Regenerate | Hermes mirror of the versioned skill file |
| `.skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/doctor-command-routing.md` | Modify | States that every derived bridge is active |
| `specs/agents/021-doctor-agents-md/spec.md` and `graph-metadata.json` | Modify | The phase map row and the child pointer |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Both scoring lanes admit all four bridges | `derive-command-bridges.cjs --check` prints `"status": "fresh"` with `typescriptActive` 33 and `pythonActive` 43 |
| REQ-002 | Every declared phrase and runnable string reaches its own bridge | `doctor-phrase-reach.cjs` exits 0 with `STATUS=OK phrases=164 bridges=28` |
| REQ-003 | The routing slice asserts each activated bridge | `vitest run tests/doctor-routing-slice.vitest.ts` passes, and the four new waves are active because every doctor id they name is active |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | No routing-accuracy metric drops below its committed baseline | `capture-scorer-eval-baseline.mjs` prints the committed figures unchanged and `vitest run tests/parity tests/scorer` passes |
| REQ-005 | The advisor and doctor suites pass, and the release notes name the activation | `npm --prefix …/runtime test`, the pytest file, `doctor/scripts/tests/run-all.sh` and `route-validate.sh` all exit 0, and `SKILL.md` carries the new version with its changelog |
| REQ-006 | The docs stop implying these bridges are inactive | the doctor routing catalog note states that every derived bridge is active, and `rg -n -i 'inactive'` over the catalog and the doctor READMEs finds no claim about these four |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node .skilled/commands/doctor/scripts/doctor-phrase-reach.cjs` prints `STATUS=OK phrases=164 bridges=28` and exits 0, against `phrases=142 bridges=24` before the change.
- **SC-002**: `derive-command-bridges.cjs --check` reports `fresh`, `typescriptActive` 33 and `pythonActive` 43, against 29 and 39 before the change.
- **SC-003**: The capture script prints full corpus 155 of 195, holdout 49 of 66, ambiguity 19 of 24, 13 unknown, 5 gold-none false fires and all three buckets unchanged, so nothing in the baseline moved.
- **SC-004**: The advisor suite passes over 158 files and 1353 tests, the doctor suite over 41 node:test files and 931 tests, and the Python suite over its own file, each exit 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The skill-first ordering rule keeps a passing skill above a doctor bridge | A new bridge can only show as the second line unless its own phrase anchors it | Measure every phrase through the probe, which reads the same three-result window the brief renders, instead of assuming a top pick |
| Risk | A new bridge displaces another doctor line out of the three rendered results | A phrase that reached its bridge before now lands nowhere | The probe scores all 28 bridges on every run, so a displaced phrase fails the gate rather than a review |
| Risk | Activating four entries moves a skill score | The corpus, holdout or ambiguity accuracy drops | Doctor bridges never change a skill's score, and the ratchet re-scores all three slices live; a drop fails the suite |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None. The one wording worth noting, "something is broken, which doctor fixes it", reaches no doctor route in either lane, and it reaches `/doctor:helper`'s own matcher as `NO_MATCH` as well; widening that vocabulary is the helper's tuned contract, not this activation, so it is recorded here rather than fixed here.
<!-- /ANCHOR:questions -->

---
