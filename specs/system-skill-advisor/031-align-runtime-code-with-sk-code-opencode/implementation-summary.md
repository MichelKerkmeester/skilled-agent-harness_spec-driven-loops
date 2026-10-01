---
title: "Implementation Summary: system-skill-advisor runtime alignment"
description: "The skill-advisor runtime now meets sk-code-opencode: headers, numbered sections, code READMEs, single-file folders folded, dead stress-test code removed and test helpers moved under tests/."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/031-align-runtime-code-with-sk-code-opencode"
    last_updated_at: "2026-09-30T22:06:51Z"
    last_updated_by: "generate-context"
    recent_action: "Merged to main with the checker at 0 findings and the suite at 1079/0"
    next_safe_action: "Verify nothing remains; the packet is closed"
    blockers: []
    key_files:
      - ".skilled/skills/system-skill-advisor/runtime/lib/route-exclusions.ts"
      - ".skilled/skills/system-skill-advisor/ARCHITECTURE.md"
    session_dedup:
      fingerprint: "sha256:01d87d294bc7868c87c79b9eac5f7f6a2ddacbbb03c21f3526ecfe8e35086d93"
      session_id: "scaffold-031-align-runtime-code-with-sk-code-opencode"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: system-skill-advisor runtime alignment

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 031-align-runtime-code-with-sk-code-opencode |
| **Completed** | 2026-10-01, merged to main as `46fc86c8e8` |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The skill-advisor runtime now passes the sk-code-opencode checker with its three strict flags on, and its folder tree is flatter.

### Comment structure and READMEs

The loop added module headers, numbered sections and two code READMEs. `lib/shared/shared-payload.ts` was numbered by hand into four sections. Three shell scripts got COMPONENT headers. After main was merged in, two new routing-accuracy scorers got numbered sections too.

### Folder changes

`caller-context.ts`, `df-idf.ts` and `route-exclusions.ts` moved up into `lib/` from single-file folders; `route-exclusions.ts` now finds its config from both the source and the compiled location. `tests/utils/` folded into `tests/`, the cosine test left `lib/scorer/lanes/__tests__/` for `tests/scorer/`, and the `__fixtures__` and `__shared__` folders merged into `tests/fixtures/`. `stress-test/search-quality/` was dead and was deleted. `lib/test-helpers/` moved to `tests/helpers/`, which also stops the production build shipping it in `dist`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/lib/**`, `runtime/tests/**`, `runtime/scripts/**` | Modified | Headers, sections, merges |
| `runtime/stress-test/search-quality/` | Deleted | Dead code |
| `ARCHITECTURE.md`, READMEs, 2 feature-catalog and 2 playbook docs | Modified | Paths after the merges |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The deep-loop packet's driver ran the header, sections and readme modes with DeepSeek V4.1 Flash at `high` through cli-pi. Opus did each merge alone, then ran the typecheck, the suite and an `rg` for the old path. The test gate rebuilds `dist` first, because the CLI shim exits 69 on a stale build.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep `route-exclusions.ts` working from `dist` with a second config candidate | A plain move silently disables the route denylist in the compiled build |
| Delete `stress-test/search-quality/` rather than repair it | Nothing ran it and its imports were already broken |
| REJECT the `types` and `auth` merges | The fact-check found real importers that the merge would have broken |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Checker, three flags | Findings 0 on main |
| Typecheck | Exit 0 |
| Vitest | Baseline 963 passed with 8 failed; 975 passed and 0 failed before merging main; 1079 passed and 0 failed after |
| Stress suite | sa-016 and sa-034 fail, as they do on main |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The two stress failures are not this packet's.** sa-016 and sa-034 fail on main as well, so they were left alone.
<!-- /ANCHOR:limitations -->
