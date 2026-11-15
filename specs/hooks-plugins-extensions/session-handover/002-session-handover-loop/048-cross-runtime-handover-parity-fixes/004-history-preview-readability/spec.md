---
title: "Feature Specification: Phase 4: history-preview-readability"
description: "A history lookup preview of a model turn shows each tool call as its serialized block object, so a receiver browsing a Pi sender's turns saw JSON and gave up. This phase makes the preview read as the turn's text and each tool call's name and arguments, then reruns a live Pi hop."
trigger_phrases:
  - "history preview readability"
  - "tool call preview json"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 4: history-preview-readability

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-11-15 |
| **Branch** | `worktrees/420-cross-runtime-handover-parity-fixes` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 4 |
| **Predecessor** | 003-nudge-parity-and-hop-scoring |
| **Successor** | None |
| **Handoff Criteria** | A model-turn preview names its tool calls without block objects, and a live Pi receiver reports the side word through History Lookup |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the cross-runtime hand-over parity fixes. Phase 3's live Pi hop `live2-pi` showed the receiver running the printed browse and getting back previews made of serialized tool-call blocks. The operator chose to fix the previews here and rerun Pi on DeepSeek Flash at max thinking.

**Scope Boundary**: `previewFor` in the history engine's `lib/navigator.ts`, one browse test, the history build, and one live Pi hop.

**Dependencies**:
- The Pi locator from phase 001.
- The llmgateway provider for Pi's DeepSeek Flash model.

**Deliverables**:
- Readable model-turn previews on every runtime.
- One live Pi hop on DeepSeek Flash at max thinking.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`previewFor` takes the first 160 characters of a model turn's blocks, and `contentText` serializes every non-text block whole. A turn that opens with a tool call previews as `{"type":"toolCall","id":"call-...`, with the provider's call id and none of what the turn did. In `live2-pi` all five browsed turns previewed this way, and the receiver stopped without a search or a load.

### Purpose
A preview tells a receiver what each turn did, so it can pick the turn to load.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
live2-pi browse backward: sequences 6 to 2
5 modelTurn …7d2603c86c25016afa149fb7c887d2b3fe5e557c70dcc0","name":"bash","arguments":{"command":"node
4 modelTurn …7d2603c86c25016afa14992c1087d2a8765e001a03a32f","name":"write","arguments":{"path":".skill
receiver: "the history lookup didn't reveal it ... I can't repeat the missing side word without guessing."
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `previewFor`: text blocks, then each tool call as its name and compact arguments.
- `itemText`, so a search excerpt quotes a tool call the same way and a call id is no longer searchable.
- One browse test and one search test pinning the readable form.
- A live Pi hop on DeepSeek Flash at max thinking.

### Out of Scope
- The default browse count.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/session-handover/history/lib/navigator.ts` | Modify | Readable `previewFor` and `itemText` through one `turnText` |
| `.skilled/hooks/session-handover/history/tests/history-search-browse.vitest.ts` | Modify | Browse and search preview tests |
| `.skilled/hooks/session-handover/history/dist/` | Regenerate | The CLI runs the build |
| `../scratch/harness/live-hop.sh` | Modify | `PI_ROUTE=deepseek` launch |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | A model-turn preview holds its text blocks and each non-paging tool call as name and arguments, with no block object or call id |
| REQ-002 | The history engine suite passes with no edited expectation |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | A live Pi hop on DeepSeek Flash at max thinking relaunches, and its receiver reports the side word through History Lookup with the word absent from the note |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The history engine and handover suites pass with 0 failing.
- **SC-002**: The live Pi hop scores 5/5 with the side word reported and absent from the note.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A test elsewhere pins the old preview text | Low | The brief reports such a test instead of editing it |
| Risk | The receiver still does not search | Med | The rerun records what it did, and AC-005 of phase 3 stays honest |
| Dependency | llmgateway provider | The live hop cannot run | Record the gap |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: The preview stays bounded at 160 characters.

### Reliability
- **NFR-R01**: A null block slot left by projection is skipped.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a turn with no text and no public tool call previews as an empty string, as before.
- Maximum input: long arguments are cut at 160 characters.
- Failure path: a paging tool call is already removed by projection and never shows.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 4/25 | One function and one test |
| Risk | 8/25 | Shared history engine output |
| Research | 4/20 | The live run located the cause |
| **Total** | **16/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Does a DeepSeek receiver search for the side word once the previews read as text? The rerun shows it.
<!-- /ANCHOR:questions -->

---
