---
title: "Implementation Summary: Refero extraction harness"
description: "Built-and-verified summary for the Refero extractor: a resumable Node harness that captures each style's four tabs via chrome-devtools-mcp into the cursor 6-file template, proven by a byte-match self-test."
trigger_phrases:
  - "refero harness summary"
  - "styles capture summary"
  - "sitemap crawler status"
importance_tier: "important"
contextType: "implementation"
status: "complete"
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
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Refero extraction harness

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-extraction-harness |
| **Status** | Complete |
| **Level** | 2 |
| **Origin** | First child of the Refero styles-library phase parent |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A single committed Node harness that turns the Refero sitemap into a local design-token library.

### Files Created / Changed

| File | Action | Result |
|------|--------|--------|
| `.opencode/skills/sk-design/styles/_harness/extract-refero.mjs` | Create | Enumerate → capture → write, with throttle + lastmod resume + `--self-test`. |
| `.opencode/skills/sk-design/styles/_harness/README.md` | Create | Usage, throttle contract, resume behavior. |
| `.opencode/skills/sk-design/styles/_manifest.json` | Create | 1,290-row crawl state. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The transport was first attempted through the Code Mode server, but its multi-manual boot (chrome, gitkraken, refero-OAuth, figma, github) was too slow and fragile to gate on, so the harness spawns `chrome-devtools-mcp@0.26.0` directly over stdio. Node owns everything the browser cannot: sitemap enumeration, the embedded-flight canonical parse, slugging, file writing, throttling, and lastmod-keyed resume. The browser round-trip is one in-page async script that clicks the four tabs (Extended) and reads each `<pre>`. One page is reused and navigated per style.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Spawn chrome-devtools-mcp directly, not via Code Mode | The Code Mode boot registered many unrelated manuals and timed out on init; the direct server boots fast and exposes exactly the browser tools needed. |
| Host writes files, browser only reads | The Code Mode isolate has no filesystem; keeping writes in Node is simpler and safer. |
| Sitemap over gallery for enumeration | The sitemap is authoritative and complete (1,290 rows with lastmod); the gallery is client-rendered and `/api/` is robots-disallowed. |
| Self-test captures without writing | Guarantees the committed `cursor/` reference is never overwritten during verification. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Faithful capture (REQ-001) | VERIFIED: self-test MATCH ×4 (DESIGN.md 23274, tailwind 2484, css-vars 3060, tokens 17427), PASS. |
| Cursor-template output (REQ-002) | VERIFIED: `shade/`, `zellerfeld/`, `symbolic-ai/` each hold the 6-file shape; JSON valid. |
| References untouched (REQ-003) | VERIFIED: `git status` on `styles/cursor/` clean after the self-test. |
| Resume + retry (REQ-004) | VERIFIED: a re-run retried only errored rows and skipped captured ones. |
| Compliance (REQ-005) | VERIFIED: only public per-style pages + the sitemap are fetched; `/api/` untouched. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Throttle is a fixed delay, not adaptive.** No published crawl-delay exists; the harness uses one page at a time plus a polite inter-page delay and honors nothing finer. If the site returns 429s, the delay would need raising — a single flag.
2. **Canonical parse is best-effort.** If a page's embedded flight data does not parse, the four tabs still write and the canonical records a `parseError`.
<!-- /ANCHOR:limitations -->
