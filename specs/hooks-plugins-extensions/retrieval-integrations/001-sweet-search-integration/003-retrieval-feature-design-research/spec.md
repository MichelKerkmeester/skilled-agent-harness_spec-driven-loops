---
title: "Feature Specification: Phase 3: retrieval feature design research"
description: "Five-iteration deep research producing implementation-ready designs for the five retrieval improvements phase 2 borrowed from sweet-search: candidate count, zero-hit fallback, per-file flood control, boilerplate demotion and an out-of-scope hint."
trigger_phrases:
  - "retrieval feature design research"
  - "phase 3 retrieval feature design research"
  - "trigger index zero hit fallback design"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 3: retrieval feature design research

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-09 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 6 |
| **Predecessor** | ../002-retrieval-lessons-research/spec.md |
| **Successor** | ../004-total-candidate-count/spec.md |
| **Handoff Criteria** | `research/research.md` holds one build-ready design per feature: files and lines, answer-shape change, contract text, edge cases and test cases |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the sweet-search integration packet. Phase 2 rated five retrieval lessons and ranked them: build features 1–3, defer 4–5. This phase turns each into a design a build phase can implement without further research.

**Scope Boundary**: Research only. Reads Skilled's retrieval code, tests and conventions, plus the phase 2 synthesis; writes only under `research/` in this folder.

**Dependencies**:
- Phase 2 synthesis: `../002-retrieval-lessons-research/research/research.md`.
- The cli-devin executor with model `deepseek-v4-1-flash-max`.

**Deliverables**:
- `research/research.md` with five designs and a build-phase task list.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 2 named what to build and roughly how big each change is, but not the exact design. A build phase still needs the precise code locations, answer fields, contract wording, edge cases and tests for each feature, and a sharper trigger for the two deferred ones.

### Purpose
Produce one implementation-ready design per feature, so the build phase is mechanical and every change uses only file reads, git and ripgrep.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
generate-context.js save on 002-retrieval-lessons-research, 2026-11-09:
"Trigger index: STALE for spec.md (added: phase 2 retrieval lessons research, retrieval lessons research, sweet search retrieval lessons; removed: none)"
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Design feature 1: report the total candidate count beside `truncated`, plus the section 9 exclusion row.
- Design feature 2: the zero-hit fallback to git-changed spec docs.
- Design feature 3: one line per file plus elision lines in the ripgrep wrapper.
- Design features 4 and 5 at minimum viable size, with a concrete trigger that would justify building each.

### Out of Scope
- Embeddings, vector or BM25 fusion, MCP, daemons and persistent indexes - Skilled removed these on purpose.
- Writing the code - the build phase does that.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `research/` | Create | Deep-research state, iterations and `research.md` synthesis |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Each feature has a design naming files and line ranges, the answer or output change, and test cases | `research/research.md` has five design sections, each with `[SOURCE: path:line]` tags into Skilled code |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Each design lists its edge cases and how it stays deterministic and backward compatible | Every design section has an edge-case list and a compatibility note |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All five iterations pass `verify-iteration.cjs` and `research/research.md` exists.
- **SC-002**: The synthesis ends with an ordered build-phase task list.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | cli-devin with DeepSeek | Loop cannot dispatch if auth or quota fails | Stop and report |
| Risk | A design breaks an existing test or caller contract | Med | Each iteration must list current callers and tests of the code it changes |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- What is the exact JSON answer shape each change adds, and which callers parse it today?
- design the five retrieval improvements from phase 2 at implementation level without embeddings, mcp, daemons or a persistent index

### Research Context

Deep research ran 5 iterations on this topic (cli-devin, deepseek-v4-1-flash-max, in parallel). `research/research.md` is the canonical output.

<!-- BEGIN GENERATED: deep-research/spec-findings -->
- **Build-ready, one packet, in order:** (1) `totalCandidates` beside `truncated` plus the section 9 `research/**` row, about 48 lines; (2) zero-hit fallback via `git status --porcelain=v1 -z --untracked-files=all` in a new `lib/changed-docs.mjs`, about 420-530 lines, mostly tests; (3) one row per file plus `+N more` lines in the ripgrep wrapper, deleting the unused capped recipe, about 200 lines.
- **Designed but deferred:** body line classes (feature 4) behind a recorded-query trigger, and the out-of-scope hint (feature 5) until a caller passes a scope.
- **Conflicts resolved:** feature 3 owns the wrapper's `schemaVersion` bump to 2; feature 2 recomputes `totalCandidates` and `truncated` after its merge.
<!-- END GENERATED: deep-research/spec-findings -->
<!-- /ANCHOR:questions -->

---
