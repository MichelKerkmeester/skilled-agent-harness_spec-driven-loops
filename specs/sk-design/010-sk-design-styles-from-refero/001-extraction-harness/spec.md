---
title: "Feature Specification: Refero extraction harness"
description: "A committed, resumable Node harness that enumerates the styles.refero.design sitemap and captures each style's four tabs (Extended) via Chrome DevTools MCP into the cursor 6-file template, throttled and idempotent."
trigger_phrases:
  - "refero extraction harness"
  - "styles capture script"
  - "sitemap style crawler"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/010-sk-design-styles-from-refero/001-extraction-harness"
    last_updated_at: "2026-07-18T10:25:46Z"
    last_updated_by: "claude"
    recent_action: "Built the harness and proved it with a byte-match self-test"
    next_safe_action: "Run the pilot batch in child 002"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-styles-refero-010-001"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The harness spawns chrome-devtools-mcp directly, not through Code Mode."
---

# Feature Specification: Refero extraction harness

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-18 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | None; first child |
| **Successor** | `../002-pilot-batch/spec.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The styles.refero.design per-style tabs (DESIGN.md, Tailwind v4, CSS Variables, Design Tokens, each Extended) are client-rendered, so they cannot be read from raw HTML and cannot be reproduced through the Refero MCP (a different dataset). The one existing extraction (`styles/cursor/`) was captured by hand and does not scale.

### Purpose
Build a single committed, resumable harness that enumerates the sitemap and captures every style's four tabs verbatim through a real browser, writing each style in the same 6-file shape as `cursor/`, so hundreds of styles can be extracted deterministically and re-run cheaply.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `styles/_harness/extract-refero.mjs`: sitemap enumeration into `_manifest.json`; per-style capture of the four tabs (Extended) via chrome-devtools-mcp; folder writing in the cursor template; the embedded-flight canonical parse; throttle + lastmod resume; a `--self-test` that re-captures cursor and diffs.
- `styles/_harness/README.md`: usage, throttle contract, resume behavior.

### Out of Scope
- The pilot run and the full set (children 002 and 003+).
- Any change to `sk-design` runtime or `design-md-generator`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design/styles/_harness/extract-refero.mjs` | Create | The resumable extractor |
| `.opencode/skills/sk-design/styles/_harness/README.md` | Create | Harness usage + contract |
| `.opencode/skills/sk-design/styles/_manifest.json` | Create | Crawl state (1,290 rows) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Faithful capture | A re-capture of a known style byte-matches the committed `styles/cursor/` four Extended tabs (modulo the site's per-extraction timestamp). |
| REQ-002 | Cursor-template output | Each captured style writes exactly the 6-file shape: four Extended tabs + `<slug>-canonical.json` + `source.md`. |
| REQ-003 | Never clobber references | The self-test captures without writing to any real style folder; the committed `cursor/` stays untouched. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Resumable + idempotent | A lastmod-keyed manifest skips already-captured unchanged styles; errored rows retry; a second run over done rows is a no-op. |
| REQ-005 | Throttled + compliant | Real Chrome UA, one page at a time, a polite inter-page delay, and `/api/` is never touched. |
| REQ-006 | Robust slugging | Slug derives from the style name; a distinct style colliding on a slug is disambiguated with a short uuid suffix. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `--self-test` prints MATCH for all four Extended tabs and PASS.
- **SC-002**: A `--limit N` run writes N well-formed 6-file folders with valid JSON and updates the manifest.
- **SC-003**: `--enumerate-only` refreshes a 1,290-row manifest without capturing.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | robots.txt bans AI crawlers | Medium | Operator-authorized throttled real-browser capture of public pages; `/api/` untouched. |
| Risk | A page fails to render a tab | Low | The style is marked `error` with a reason and retried on the next run; other styles proceed. |
| Dependency | `chrome-devtools-mcp@0.26.0` | Low | Spawned directly via `npx --isolated=true`; proven this session. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: ~12–13s per style (four tabs (Extended) in one in-page script), acceptable for batched runs.

### Security
- **NFR-S01**: No credentials; public pages only; `/api/` and `/extract/` never requested.

### Reliability
- **NFR-R01**: The manifest is written after every style, so an interrupted run resumes cleanly.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A style whose embedded flight data does not parse still writes the four tabs; its `<slug>-canonical.json` records a `parseError` rather than failing the style.

### Error Scenarios
- A blocked or empty page (no `<pre>`) raises a per-style error, is logged, and does not abort the batch.

### State Transitions
- A changed `lastmod` flips a captured row to `stale` so the next run re-captures it.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | One script + README + manifest; no runtime change. |
| Risk | 12/25 | External site + browser automation; robots compliance is the main sensitivity, gated by operator decision. |
| Research | 8/20 | Transport + enumeration + template settled by exploration this session. |
| **Total** | **30/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None; the harness is built and self-test-proven. Scale and storage questions live at the parent and in child 002.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent**: `../spec.md`
- **Successor**: `../002-pilot-batch/spec.md`
- **Harness**: `.opencode/skills/sk-design/styles/_harness/extract-refero.mjs`
- **Output template**: `.opencode/skills/sk-design/styles/cursor/`
