---
title: "Tasks: Refero extraction harness"
description: "Build queue for the Refero extractor: spawn chrome-devtools-mcp, enumerate the sitemap, capture four tabs x two variants, write the cursor template, add resume + a byte-match self-test."
trigger_phrases:
  - "refero harness tasks"
  - "styles capture tasks"
  - "sitemap crawler tasks"
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
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Refero extraction harness

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: T### [P?] Description (file path)

> Built and verified; every task carries inline `[EVIDENCE: ...]`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Spawn `chrome-devtools-mcp@0.26.0` directly and confirm the tool schema (REQ-001) (`styles/_harness/extract-refero.mjs`). [EVIDENCE: probe listed `new_page`/`navigate_page`/`evaluate_script({function})`/`wait_for`/`close_page`.]
- [x] T002 Parse `/sitemaps/styles.xml` into `_manifest.json` (REQ-004) (`extract-refero.mjs`). [EVIDENCE: `--enumerate-only` wrote 1,290 rows.]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Capture the four tabs (Extended) in one in-page script; grab the h1 title (REQ-001) (`extract-refero.mjs`). [EVIDENCE: single `evaluate_script` returns four tab texts + `__title`.]
- [x] T004 Parse the embedded flight `result` into `<slug>-canonical.json` (REQ-002) (`extract-refero.mjs`). [EVIDENCE: `<slug>-canonical.json` parses for captured styles.]
- [x] T005 Slug + collision rule; write the cursor 6-file template + provenance source.md (REQ-002, REQ-006) (`extract-refero.mjs`). [EVIDENCE: `shade/`, `zellerfeld/`, `symbolic-ai/` each hold 6 files.]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Throttle + lastmod-keyed resume; write the manifest after every style (REQ-004, REQ-005) (`extract-refero.mjs`). [EVIDENCE: `_manifest.json` status gates the run — errored retried, captured skipped.]
- [x] T007 `--self-test` re-captures cursor without writing a real folder and diffs the four Extended tabs (REQ-001, REQ-003) (`extract-refero.mjs`). [EVIDENCE: MATCH ×4 (23274/2484/3060/17427), PASS; committed `cursor/` untouched.]
- [x] T008 Write `styles/_harness/README.md` documenting usage, throttle, and resume. [EVIDENCE: `styles/_harness/README.md` present.]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Self-test PASS (four Extended tabs byte-match cursor) [EVIDENCE: self-test MATCH ×4, PASS]
- [x] `--limit N` writes valid 6-file folders and updates the manifest [EVIDENCE: 3-style + 50-style runs each wrote valid folders]
- [x] Resume + retry behavior confirmed [EVIDENCE: re-run retried only errored rows; captured skipped]
- [x] Harness README written [EVIDENCE: styles/_harness/README.md (code-folder template)]
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Successor**: `../002-pilot-batch/`
<!-- /ANCHOR:cross-refs -->
