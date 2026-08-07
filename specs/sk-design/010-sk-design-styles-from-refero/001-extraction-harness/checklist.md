---
title: "Verification Checklist: Refero extraction harness"
description: "P0/P1 gates for the Refero extractor: faithful byte-match capture, cursor-template output, references never clobbered, resumable + throttled, robust slugging."
trigger_phrases:
  - "refero harness checklist"
  - "styles capture gates"
  - "sitemap crawler verification"
importance_tier: "important"
contextType: "verification"
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

# Verification Checklist: Refero extraction harness

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Readiness Impact |
|----------|----------|------------------|
| **P0** | Hard blocker | Must pass before complete |
| **P1** | Required | Must pass or carry an approved deferral |
| **P2** | Optional | May remain for follow-up |

> Built and verified; gates are `[x]` with inline `[EVIDENCE: ...]`.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Transport confirmed (chrome-devtools-mcp tool schema). [EVIDENCE: probe listed the tools + `evaluate_script({function})`.]
- [x] CHK-002 [P1] Output template inventoried from `cursor/`. [EVIDENCE: 6-file shape enumerated from `styles/cursor/`.]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P1] Host/browser separation: Node writes files, the browser only reads DOM. [EVIDENCE: `writeStyle` in Node; single `evaluate_script` in browser.]
- [x] CHK-011 [P1] Stdlib-only, no new dependencies. [EVIDENCE: imports are `node:https`/`child_process`/`fs`.]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] REQ-001 faithful capture. [EVIDENCE: `--self-test` MATCH ×4, PASS.]
- [x] CHK-021 [P0] REQ-002 cursor-template output. [EVIDENCE: captured folders hold the 6-file shape; `design-tokens.json` valid.]
- [x] CHK-022 [P1] REQ-004 resume + retry. [EVIDENCE: re-run retried only errored rows; `_manifest.json` skips captured.]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-030 [P0] REQ-003 references never clobbered. [EVIDENCE: self-test captures without writing; `git status` on `cursor/` clean.]
- [x] CHK-031 [P1] REQ-006 slug-collision disambiguation present. [EVIDENCE: `resolveSlug` appends a uuid suffix for a distinct colliding style.]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-040 [P0] REQ-005 `/api/` and `/extract/` never requested; only public per-style pages + sitemap. [EVIDENCE: only `styles.refero.design/style/<uuid>` and `/sitemaps/styles.xml` are fetched.]
- [x] CHK-041 [P1] Real-browser UA; no credentials. [EVIDENCE: `const UA` real-Chrome header; no auth headers sent.]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P1] Harness README documents usage, throttle, and resume. [EVIDENCE: `styles/_harness/README.md`.]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-060 [P1] Harness + manifest live under `styles/_harness/` and `styles/`; extracted folders are siblings of `cursor/`. [EVIDENCE: `styles/<slug>/` are siblings of `cursor/`.]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Gate | State | Evidence |
|------|-------|----------|
| Faithful capture (REQ-001) | VERIFIED | self-test MATCH ×4, PASS |
| Cursor-template output (REQ-002) | VERIFIED | 6-file shape, JSON valid |
| References untouched (REQ-003) | VERIFIED | cursor/ clean after self-test |
| Resume + retry (REQ-004) | VERIFIED | re-run skips captured, retries errored |
| Throttle + compliance (REQ-005) | VERIFIED | only public pages + sitemap fetched |
| Slug collision (REQ-006) | VERIFIED | uuid-suffix disambiguation |

**Verification Date**: 2026-07-18
<!-- /ANCHOR:summary -->
