---
title: "Feature Specification: Phase 2: retrieval lessons from sweet-search"
description: "Five-iteration deep research on which lexical search techniques from sweet-search would improve system-spec-kit retrieval (trigger index and ripgrep recipes) without embeddings, MCP, a daemon or a persistent index."
trigger_phrases:
  - "retrieval lessons research"
  - "phase 2 retrieval lessons research"
  - "sweet search retrieval lessons"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 2: retrieval lessons from sweet-search

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
| **Phase** | 2 of 6 |
| **Predecessor** | ../001-sweet-search-research/spec.md |
| **Successor** | ../003-retrieval-feature-design-research/spec.md |
| **Handoff Criteria** | `research/research.md` rates each of the five lessons adopt, adapt or drop, with evidence from Skilled's own retrieval code and real queries |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the sweet-search integration packet. Phase 1 concluded that Skilled should not integrate the tool, but that its grep-side techniques may improve Skilled's own retrieval.

**Scope Boundary**: Research only. Reads `../context/sweet-search-main/core/search/` and Skilled's retrieval code and docs; writes only under `research/` in this folder.

**Dependencies**:
- Phase 1 synthesis: `../001-sweet-search-research/research/research.md`.
- The cli-devin executor with model `deepseek-v4-1-flash-max`.

**Deliverables**:
- `research/research.md` with a verdict per lesson and a ranked build list.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
system-spec-kit retrieval is a committed trigger index plus ripgrep recipes with a caller-side ranking tuple. It can miss packets the index has not caught up with, let one large file flood the results, show boilerplate lines, stay silent about hits outside a scoped search, and repeat the same text from runtime mirror folders. Phase 1 saw the first of these happen in this session.

### Purpose
Decide which of five lexical techniques from sweet-search to adopt, adapt or drop, so a later build phase changes only what demonstrably helps, with no embeddings, MCP, daemon or persistent index.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
generate-context.js save on 001-sweet-search-research, 2026-11-09:
"Trigger index: STALE for spec.md (added: phase 1 sweet search research, sweet search research; removed: none)"
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Test five candidate lessons against Skilled's actual retrieval code: the zero-hit fallback to changed files, per-file result caps with an elision line, preferring meaningful lines over boilerplate, an out-of-scope hit hint, and dedup plus a final-k cut.
- Run real queries against this repo to show whether each gap exists today.
- Rate each lesson adopt, adapt or drop, and rank the adopted ones by value per cost.

### Out of Scope
- Embeddings, vector or BM25 fusion, MCP servers, daemons and persistent indexes - Skilled removed these on purpose (system-spec-kit `SKILL.md` declared loss).
- Changing any retrieval file - a later build phase does that.

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
| REQ-001 | Each of the five lessons gets an adopt, adapt or drop verdict backed by Skilled code and a real query | `research/research.md` has one verdict per lesson with `[SOURCE: path:line]` tags and the query that was run |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | No recommended change needs embeddings, MCP, a daemon or a persistent index | Every adopted lesson names the file it would change and uses only file reads, git and ripgrep |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All five iterations pass `verify-iteration.cjs` and `research/research.md` exists.
- **SC-002**: The synthesis ranks the adopted lessons and names a build-phase file list.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | cli-devin with DeepSeek | Loop cannot dispatch if auth or quota fails | Stop and report |
| Risk | A lesson is already handled by Skilled's lookup code | Med | Each iteration must read `lookup-trigger-index.mjs` and the recipes before claiming a gap |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which of the five gaps actually occur in Skilled today, and how often?
- research lessons from sweet-search lexical search to improve system-spec-kit retrieval without embeddings, mcp, daemons or a persistent index

### Research Context

Deep research ran 5 iterations on this topic (cli-devin, deepseek-v4-1-flash-max, in parallel). `research/research.md` is the canonical output.

<!-- BEGIN GENERATED: deep-research/spec-findings -->
- **All five lessons rated ADAPT.** Every sweet-search mechanism needs its index or code graph; four of the principles transfer with only file reads, git and ripgrep, and the fifth (dedup) is already in place apart from one count.
- **Build next, in order:** (1) a total-candidate count beside `truncated` plus a section 9 row documenting the research-folder exclusion; (2) a zero-hit fallback that reads frontmatter phrases of git-changed spec docs; (3) an elision line and one-line-per-file guarantee in the ripgrep wrapper.
- **Defer with triggers:** boilerplate demotion in the ripgrep lane, and the out-of-scope hint (no caller passes a scope to the keyed lookup today).
- **Live evidence:** the committed trigger index holds none of this packet's paths, so a lookup for its own topic returns 0 results.
<!-- END GENERATED: deep-research/spec-findings -->
<!-- /ANCHOR:questions -->

---
