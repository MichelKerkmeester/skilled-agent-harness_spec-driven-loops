---
title: "Feature Specification: sk-design styles library from Refero"
description: "Extract the styles.refero.design per-style design references into the sk-design local token library, one folder per style in the cursor 6-file template, via a resumable real-browser harness — piloted on ~50 styles before deciding on the full 1,290."
trigger_phrases:
  - "refero styles extraction"
  - "sk-design styles library"
  - "bulk design token extraction"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/010-sk-design-styles-from-refero"
    last_updated_at: "2026-07-18T10:25:46Z"
    last_updated_by: "claude"
    recent_action: "Initialized lean phase-parent for the Refero styles extraction"
    next_safe_action: "Author and build child 001-extraction-harness"
    blockers: []
    key_files:
      - "spec.md"
      - "001-extraction-harness/spec.md"
      - "002-pilot-batch/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-styles-refero-010"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Storage for the full 1,290 set (~13k files): commit all, gitignore canonical, or external?"
      - "Slug source of truth when one brand has multiple styles."
    answered_questions:
      - "Capture transport is Chrome DevTools MCP (mcp-chrome); the Refero MCP is a different dataset."
      - "Scope is piloted on ~50 styles before any go/no-go on the full 1,290."
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT — root purpose + planned child list + outcome only; heavy docs live in children. -->

# Feature Specification: sk-design styles library from Refero

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Structure** | Phase Parent lean trio |
| **Priority** | P1 |
| **Status** | Complete — harness built, pilot GO, full set extracted (1,290/1,290, 0 errors) |
| **Created** | 2026-07-18 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | None; root packet under the design track |
| **Parent Packet** | `sk-design` |
| **Handoff Criteria** | Child phases are authored and validated independently; the harness proves the cursor-template output before the pilot runs, and the pilot passes before any full-set wave is authored |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`sk-design` holds exactly one extracted design reference (`.opencode/skills/sk-design/styles/cursor/`), captured by hand from a styles.refero.design per-style page. The site publishes a large catalog of AI-readable design systems (its sitemap lists 1,290 `/style/<uuid>` pages), each rendering four tabs — DESIGN.md, Tailwind v4, CSS Variables, Design Tokens — in Extended variants. There is no way to enumerate or reproduce those tabs through the Refero MCP: the MCP is a different dataset (it rejected the website UUID, is semantic-search-only, and emits its own synthesized style document rather than the site's four rendered tabs). So the only faithful source for the tab exports is the website itself, and one-off manual capture does not scale to hundreds of styles.

### Purpose

Stand up a resumable extraction harness that reads the site's sitemap, drives a real browser (Chrome DevTools MCP) to capture each style's four tabs in both variants verbatim, and writes one folder per style in the same 6-file template as `cursor/`. The parent defines the child-phase map and the high-level outcome only; the harness design, the pilot run, and all verification live in the child phase folders. The site's robots.txt disallows AI crawlers, so the operator has authorized a throttled real-browser capture of the public per-style pages (low concurrency, polite delay, honor 429); `/api/` is never touched.

> **Phase-parent note:** This `spec.md` is the only authored markdown document at the parent level. The parent root intentionally stays lean: `spec.md`, `description.json`, and `graph-metadata.json`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- A committed, resumable extraction harness that enumerates the sitemap, captures each style's four tabs (Extended) via Chrome DevTools MCP, and writes the cursor-template folder plus a crawl manifest and a styles index.
- A ~50-style pilot run that proves the output matches the `cursor/` template and produces a go/no-go recommendation for the full 1,290.
- Throttle and compliance guards: real-browser UA, low concurrency, polite delay, honor 429, never touch `/api/` or `/extract/`, lastmod-keyed idempotent resume.

### Out of Scope

- The full 1,290-style extraction itself — mapped as planned waves but not authored or run until the pilot passes.
- Any use of the Refero MCP as the capture source (different dataset; unsuitable).
- Any change to the `sk-design` runtime hub, its modes, or the `design-md-generator` backend (its DESIGN.md section schema is reused as the output contract, not modified).

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.opencode/skills/sk-design/styles/_harness/extract-refero.mjs` | Create | 001-extraction-harness | Resumable sitemap-to-folder extractor driving Chrome DevTools MCP |
| `.opencode/skills/sk-design/styles/_harness/README.md` | Create | 001-extraction-harness | Harness usage, throttle contract, resume behavior |
| `.opencode/skills/sk-design/styles/_manifest.json` | Create | 001-extraction-harness | Crawl state (uuid, url, lastmod, slug, status, capturedAt) |
| `.opencode/skills/sk-design/styles/<slug>/**` | Create | 002-pilot-batch | ~50 extracted style folders in the cursor 6-file template |
| `.opencode/skills/sk-design/styles/README.md` | Create | 002-pilot-batch | Index of extracted styles |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | `001-extraction-harness/` | Build + unit-prove the resumable capture harness on 2–3 styles | Complete |
| 2 | `002-pilot-batch/` | Run the harness on ~50 styles; validate; emit full-set go/no-go | Complete — GO |
| 3 | `003-full-set/` | Run the harness over the full sitemap; validate; index | Complete — 1,290/1,290, 0 errors |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins.
- Parent spec tracks aggregate progress via this map.
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase.
- Run `validate.sh --recursive` on the parent to validate all phases as an integrated unit.
- No `003+` full-set wave is authored until phase 002 records a go decision and the storage question is resolved.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001 harness | 002 pilot | The harness re-captures a known style and its four Extended tabs diff-match the committed `cursor/` files; 6-file shape and JSON validity hold; slug-collision path exercised | Harness self-test output + diff against `cursor/` |
| 002 pilot | 003+ full set | ~50 folders pass the shape/JSON checks, re-run is a no-op, and the implementation summary records an explicit go decision plus a storage decision for ~13k files | Pilot manifest (50 captured, 0 silent errors) + go/no-go note |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Storage for the full 1,290 set (~13k files): commit everything, gitignore the bulky `*-canonical.json`, or hold the library outside the repo? Decided at the pilot go/no-go.
- Slug source of truth when one brand has multiple styles: page title, domain, or a uuid-suffixed slug on collision.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md.
- **Output template**: `.opencode/skills/sk-design/styles/cursor/` — the 6-file per-style shape every extraction mirrors.
- **Graph Metadata**: See `graph-metadata.json` for the `derived.last_active_child_id` pointer.
