---
title: "Implementation Plan: Refero extraction harness"
description: "Build a resumable Node harness that enumerates the Refero sitemap and captures each style's four tabs via chrome-devtools-mcp into the cursor 6-file template, proven by a byte-match self-test."
trigger_phrases:
  - "refero harness plan"
  - "styles capture plan"
  - "sitemap crawler plan"
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
    answered_questions: []
---

# Implementation Plan: Refero extraction harness

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js ESM (`.mjs`), stdlib only (`https`, `child_process`, `fs/promises`) |
| **Transport** | `chrome-devtools-mcp@0.26.0` spawned directly over stdio (`npx --isolated=true`) |
| **Storage** | `styles/<slug>/` folders + `styles/_manifest.json` crawl state |
| **Testing** | `--self-test` byte-diff against `styles/cursor/`; `--limit N` shape checks |

### Overview
A single host script enumerates the sitemap into a manifest, then for each style fetches the page HTML (browser UA) to parse the embedded canonical data and drives one Chrome page to click through the four tabs (Extended), reading each rendered `<pre>`. It writes the cursor 6-file template and updates the manifest per style. Throttle and lastmod-keyed resume live in the host loop; the browser round-trip is one `evaluate_script` per style.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Transport chosen (chrome-devtools-mcp direct) and tool schema confirmed
- [x] Output template (cursor 6-file shape) inventoried
- [x] Sitemap enumeration and robots constraints understood

### Definition of Done
- [x] Self-test byte-matches the committed cursor Extended tabs and prints PASS
- [x] A `--limit N` run writes N valid 6-file folders and updates the manifest
- [x] Errored rows retry; captured rows are skipped on re-run
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Host-orchestrated capture: Node owns enumeration, throttling, resume, canonical parsing, and file writing; the browser (chrome-devtools-mcp) owns only the DOM reads. The two are decoupled so the sandbox-free host writes files the browser cannot.

### Key Components
- **Enumerate**: parse `/sitemaps/styles.xml` → `_manifest.json` rows `{uuid,url,lastmod,slug,status,capturedAt,error}`.
- **Canonical parse**: reconstruct the page's embedded flight `result` object into `<slug>-canonical.json`.
- **captureTabs**: one reused page, navigated per style; one in-page async script returns the four tab texts + the h1.
- **writeStyle**: the cursor 6-file template + a source.md.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `styles/_harness/extract-refero.mjs` | n/a (new) | create the extractor | `--self-test` PASS |
| `styles/_manifest.json` | n/a (new) | crawl state | 1,290 rows after enumerate |
| `styles/<slug>/**` | n/a (new) | per-style output | 6-file shape, JSON valid |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Transport + enumeration
- [x] Spawn chrome-devtools-mcp directly; confirm `new_page`/`navigate_page`/`evaluate_script`/`wait_for`
- [x] Parse the sitemap into the manifest

### Phase 2: Capture + write
- [x] One-script capture of four tabs (Extended); parse the embedded canonical
- [x] Slug + collision rule; write the cursor 6-file template

### Phase 3: Resume + self-test
- [x] lastmod-keyed skip; per-style manifest write; `--self-test` byte-diff
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- `--self-test`: re-capture cursor, diff the four Extended tabs against the committed reference (timestamp-normalized).
- `--limit 3`: capture three real styles; assert the 6-file shape and JSON validity.
- Re-run: confirm captured rows are skipped and errored rows retry.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- `chrome-devtools-mcp@0.26.0` (via `npx`), a working Chrome, and network access to styles.refero.design.
- The committed `styles/cursor/` as the self-test reference.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

The harness only creates files under `styles/`; delete the `_harness/`, `_manifest.json`, and any captured `<slug>/` folders to fully revert. No runtime or shared code is touched.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

- Phase 2 depends on Phase 1's confirmed tool schema.
- Phase 3's self-test depends on Phase 2's write path and the committed cursor reference.
- Child 002 (pilot) depends on this harness passing its self-test.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Item | Estimate |
|------|----------|
| Harness build + transport pivot | ~1 session |
| Per-style capture cost | ~12–13s |
| ~50-style pilot | ~12–15 min |
<!-- /ANCHOR:effort -->

---

## RELATED DOCUMENTS

- **Specification**: `spec.md`
- **Tasks**: `tasks.md`
- **Checklist**: `checklist.md`
- **Harness**: `../../../../skills/sk-design/styles/_harness/extract-refero.mjs`
