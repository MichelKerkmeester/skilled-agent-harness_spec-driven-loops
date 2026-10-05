---
title: "Implementation Summary"
description: "The derived sanitizer now rejects instruction phrasing rather than single words, and all 14 skill metadata blocks carry a v2 stamp their labels have been proven against."
trigger_phrases:
  - "derived sanitizer instruction shape summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/049-doctor-audit-followups/027-derived-sanitizer-instruction-shape"
    last_updated_at: "2026-10-05T11:30:00Z"
    last_updated_by: "derived-sanitizer-instruction-shape"
    recent_action: "Narrowed the sanitizer filter, stamped all 14 skills and reran DOC-362 to PASS"
    next_safe_action: "None; DOC-362 passes on main"
    blockers: []
    key_files:
      - ".skilled/skills/system-skill-advisor/runtime/lib/derived/sanitizer.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "derived-sanitizer-instruction-shape"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 027-derived-sanitizer-instruction-shape |
| **Completed** | 2026-10-04 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Skill names no longer look like prompt injection to the sanitizer.

### Phase 27: derived-sanitizer-instruction-shape

- **Phrase-shaped filter.** The pattern needs an override verb near an instruction noun, a phrase such as `previous instructions` or `system prompt`, a known injection term, or a tool call that is not part of a routing compound. Lone words such as `system`, `tool` or `run` no longer drop a label.
- **Version v2.** `SKILL_DERIVED_SANITIZER_VERSION` is `sanitizeSkillLabel:v2`, so blocks proven against the old filter read as stale until re-proven.
- **Stamps.** All 14 skills carry `sanitizer_version: sanitizeSkillLabel:v2`, and every one of their curated labels passes unchanged.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `sanitizer.ts` | Modified | Instruction pattern |
| `skill-derived-v2.ts` | Modified | Version |
| `lifecycle-derived-metadata.vitest.ts` | Modified | Routing-label test |
| `lifecycle-routing-stress.vitest.ts` | Modified | Fixture version |
| 14 `graph-metadata.json` files | Modified | v2 stamp |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Graph validation first still reported 14 warnings reading v2 predates v1. The long-lived advisor daemon was still running the old build. Restarting it cleared them.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Bump the version | A stamp claims proof against one filter, so a changed filter must make old stamps stale |
| Exclude routing compounds from the tool-call shape | Labels such as call tool chain and mcp tool bridge name tools rather than command one |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Advisor suite | 134 of 134 files, 1005 passed, 6 skipped |
| Label proof | 14 of 14 skills, 0 labels changed |
| Derived regenerator dry run | 0 changes |
| `ci-skill-root-metadata` | 14 of 14 |
| Graph validation | 0 warnings, 0 errors, 14 nodes, 57 edges |
| DOC-362 rerun with DeepSeek in the test environment at `8a386d9df6` | PASS in 499 seconds, environment left clean |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. A running advisor daemon keeps the old build until it restarts, so a stale daemon reports every v2 stamp as predating v1.
<!-- /ANCHOR:limitations -->

---
