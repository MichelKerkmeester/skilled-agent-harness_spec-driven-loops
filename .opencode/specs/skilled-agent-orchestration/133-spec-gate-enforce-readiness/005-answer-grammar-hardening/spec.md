---
title: "Feature Specification: Answer-grammar hardening for the spec-gate Gate-3 parser"
description: "The spec-gate answer parser false-closes the Gate-3 gate on prompts like 'skip the lint errors, just fix the parser', rejects natural answers like 'option B, 042-foo', and hands a human-phrased deny message to a model audience. Harden the grammar so the gate stays open when the answer is ambiguous."
trigger_phrases:
  - "answer grammar hardening"
  - "spec-gate skip regex"
  - "answerParse false skip"
  - "gate-3 deny detail"
  - "spec folder answer parser"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/133-spec-gate-enforce-readiness/005-answer-grammar-hardening"
    last_updated_at: "2026-07-11T11:05:58.098Z"
    last_updated_by: "spec-author"
    recent_action: "Authored Level 2 planning docs for answer-grammar hardening"
    next_safe_action: "Implement the SKIP_WORD_REGEX and answer-grammar changes in spec-gate-core.mjs"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/runtime/lib/spec-gate/spec-gate-core.mjs"
      - ".opencode/skills/system-spec-kit/runtime/lib/spec-gate/spec-gate-core.test.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/005-answer-grammar-hardening"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: Answer-grammar hardening for the spec-gate Gate-3 parser

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
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
| **Priority** | P2 |
| **Status** | Draft |
| **Created** | 2026-07-11 |
| **Branch** | `scaffold/005-answer-grammar-hardening` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 5 |
| **Predecessor** | 004-headless-enforce-scoping |
| **Successor** | None |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The spec-gate core's answer parser (`answerParse` plus `SKIP_WORD_REGEX`, `spec-gate-core.mjs:329-380`) mis-reads three answer classes. `SKIP_WORD_REGEX = /^\s*skip\b/i` (`:329`) closes the gate as `skipped` for any prompt that merely starts with "skip" — including "skip the lint errors for now, just fix the parser bug" — which silences the guard for the rest of the session even though the user asked for a code change. A bare letter "D" always resolves to `{ type: 'skip' }` (`:360`), so a "D" that answers some other A/B/C/D question the model posed inside the open-gate window also false-closes the gate. And the deny `detail` handed back by `evaluateMutation` (`:583`) is `GATE_3_QUESTION` (`:88-95`), a string phrased as a question to a human ("pick one: A) ... B) ..."), yet on the deny path it lands in the model's context (`spec-gate-enforce.mjs:56`, `permissionDecisionReason`) where the model, not a human, is reading it.

Separately, the answer grammar is too narrow: `ANSWER_LETTER_PREFIX_REGEX = /^\s*([a-eA-E])(?=[\s,.:)\-]|$)/` (`:330`) only recognizes a bare leading letter, and a bare folder token can bind only when that letter matched (`:369-373`). Natural forms like "option B, 042-foo" therefore parse to `null` and the gate re-asks a valid answer.

### Purpose
The spec-gate answer parser recognizes natural answer forms, closes the gate only on an unambiguous answer, and — when the input is ambiguous — stays open and re-asks rather than mis-closing; the deny message tells the model what to do.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Tighten `SKIP_WORD_REGEX` and the standalone-letter-D skip path so only bare "skip"-class answers close the gate as `skipped`.
- Broaden the answer grammar to recognize a closed set of natural letter lead-ins ("option B", "go with C") so folder-naming answers bind.
- Add a model-audience deny-detail constant and return it from the `evaluateMutation` deny branch, keeping the classify/advise surface on the existing user-facing question.
- Expand the `answerParse` positive/negative corpus test with the new natural-form and adversarial cases as an acceptance item.

### Out of Scope
- The shared classifier `gate-3-classifier.ts` and its `MANDATORY_SPEC_METADATA_FILES` (`:137/:563`) - scaffolded-folder acceptance is owned by phase `003-scaffolded-folder-acceptance`; WS5 never widens or weakens the shared contract other consumers rely on.
- Trigger-turn self-binding (`002-trigger-turn-self-binding`), advise/would-deny telemetry (`001-advise-telemetry`), and headless enforce scoping (`004-headless-enforce-scoping`) - sibling phases.
- The deny predicate breadth, enforce gating, and fail-open control flow - preserved invariants, not changed here.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/skills/system-spec-kit/runtime/lib/spec-gate/spec-gate-core.mjs | Modify | Tighten `SKIP_WORD_REGEX` and standalone-D skip; broaden letter lead-in grammar; add `GATE_3_DENY_DETAIL` and return it from the `evaluateMutation` deny branch |
| .opencode/skills/system-spec-kit/runtime/lib/spec-gate/spec-gate-core.test.mjs | Modify | Expand `POSITIVE_ANSWER_CORPUS` / `NEGATIVE_PROMPT_CORPUS`; add skip-false-close and natural-form binding cases; update the golden-loop deny-detail assertion |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `SKIP_WORD_REGEX` no longer closes the gate on "skip X ... do Y" prompts | `answerParse('skip the lint errors for now, just fix the parser bug')` returns `null`; `classifyIntent` leaves status `open` |
| REQ-002 | A letter "D" closes as skip only when it stands alone as the answer | `answerParse('D')` and `answerParse('D, no spec folder needed')` return `{ type: 'skip' }`; `answerParse('D is the wrong option, refactor the parser')` returns `null` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Natural letter lead-ins bind a named folder | `answerParse('option B, 042-foo')` returns `{ type: 'binding', path: '042-foo' }`; with `042-foo` present, `classifyIntent` reports `satisfied` |
| REQ-004 | The deny detail is phrased for the model audience | `evaluateMutation` deny returns a `detail` that instructs the model to ask the user to reply A-E naming an existing spec folder (or D to skip) and to not retry until satisfied |
| REQ-005 | The expanded answer corpus passes with zero mis-parses | `node --test spec-gate-core.test.mjs` reports 0 false positives and 0 false negatives across the expanded corpus |
| REQ-006 | Ambiguous inputs stay open (conservative principle) | Every ambiguous case in the negative corpus returns `null`; no ambiguous input closes the gate |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: "skip the lint errors for now, just fix the parser bug" does NOT close the gate - `answerParse` returns `null` and the gate stays open.
- **SC-002**: "option B, 042-foo" (with `042-foo` accepted by `validateSpecFolderBinding`) parses to a binding and the gate closes as `satisfied`.
- **SC-003**: An ambiguous letter-only answer (e.g. "B" with no folder named) stays open and re-asks.
- **SC-004**: The deny detail instructs the model to ask the user to reply A-E naming an existing spec folder.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase `001-advise-telemetry` composes the advise/would-deny detail string in the same `GATE_3_QUESTION`/detail region | Double-edit or merge conflict | Sequence WS1 first per the parent map; rebase WS5 on the telemetry detail shape |
| Dependency | Shared classifier `validateSpecFolderBinding` decides whether a bound folder is valid | WS5 relies on but does not change it | Read-only dependency; bare-token binding still routes through the shared validator |
| Risk | Over-tightening `SKIP_WORD_REGEX` rejects a legitimate bare "skip" answer | Med | Conservative trade-off: a false-open costs one re-ask; the positive corpus pins "skip" / "skip it" / "Skip - handled elsewhere" |
| Risk | Over-broadening letter lead-ins re-introduces prose false positives | Med | Gate bare-token binding behind an explicit answer signal; the negative corpus pins "404-not-found is the error page component" and similar prose to `null` |
| Risk | Reworded deny detail breaks log parsing or the golden-loop assertion | Low | Keep a stable "SPEC FOLDER" marker token in the new detail; update the golden-loop assertion in the same change |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The parser stays O(n) over a single prompt string; no new I/O, filesystem, or network calls are added on the classify path.
- **NFR-P02**: Regex anchoring stays bounded to the leading answer token so a long pasted prompt does not scan the whole body for a skip/letter match.

### Security
- **NFR-S01**: The guard never echoes the shared classifier's matched-token arrays into the TUI or injected context; `GATE_3_QUESTION` and the new `GATE_3_DENY_DETAIL` remain small fixed strings.
- **NFR-S02**: The core adds no logging and never writes stdout/stderr; the OpenCode plugin stays default-export-only. `MK_SPEC_GATE_DISABLED=1` remains a full no-op; deny stays opt-in behind `MK_SPEC_GATE_ENFORCE=1`, default-off, and never widened beyond Write/Edit.

### Reliability
- **NFR-R01**: Fail-open is preserved - any parser throw resolves through `classifyIntent`'s existing try/catch to `closed` with a best-effort state evict.
- **NFR-R02**: No `mcp_server/` dist rebuild; the change is confined to `spec-gate-core.mjs` and its test, and comment hygiene (no artifact ids or spec paths in code comments) holds.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: an empty or whitespace-only prompt returns `null` (unchanged); the gate stays as it was.
- Maximum length: a long prompt is matched only at its leading token; trailing prose defeats both the skip and the standalone-D paths.
- Invalid format: a prompt with both a skip word and a folder token (e.g. "skip, but maybe 042-foo") is ambiguous and stays open rather than guessing.

### Error Scenarios
- External service failure: not applicable; the parser touches no external service.
- Gate not open: `answerParse(text, false)` always returns `null`, structurally, regardless of text.
- Classifier/binding throw: `classifyIntent` fails open and evicts any stale `open` state (existing behavior, untouched).

### State Transitions
- Partial completion: a recognized letter with no folder named stays open and re-asks (no guessed binding).
- Session expiry: unchanged; skip/satisfied state persists per session file until the sweep archives it.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | Two files; ~40 LOC of regex, one constant, and corpus test additions |
| Risk | 9/25 | Session-scoped guard, parser correctness; no auth/API/data-migration surface |
| Research | 6/20 | Corpus design and the conservative-parse trade-off analysis |
| **Total** | **23/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Should a bare "D" be retained as skip, or should skip require the literal word "skip"? Recommendation: retain standalone "D" (option D IS the gate's skip choice) but require it to stand alone; documented in the plan's design decision.
- Should the advise detail (not only the deny detail) also adopt model-audience phrasing? Recommendation: keep the classify/advise surface on the user-facing question (it is relayed to the user) and reword the deny detail only, per the fix brief.
<!-- /ANCHOR:questions -->
