---
title: "Implementation Summary [template:level_2/implementation-summary.md]"
description: "Status PLANNED. Scaffolded phase that will add one safe fence-aware prose-style detector for the HVR voice on spec-docs. No code change has landed."
trigger_phrases:
  - "hvr style"
  - "em-dash linter"
  - "prose semicolon"
  - "oxford comma"
  - "style auto-fix"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/001-on-write-quality/006-hvr-style-autofix"
    last_updated_at: "2026-06-21T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored phase impl doc for A6 hvr style auto-fix scaffold"
    next_safe_action: "Hold for implementation, no code change has landed yet"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/quality-loop.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-hvr-style-autofix |
| **Completed** | Not yet, status PLANNED |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Status PLANNED. This phase is scaffolded and not yet implemented. No code change has landed and nothing below has shipped. The section describes the change the phase will make once it is built.

### Fence-aware prose-style detector

The phase will add a `hvr.style` detector that enforces the HVR house voice on authored spec-docs. It will parse the document into prose ranges that exclude fenced code blocks inline code spans and YAML frontmatter, then apply three deterministic swaps over prose only, em-dash to a spaced hyphen or sentence split, prose semicolon to a sentence split or comma, and Oxford comma removal before the terminal conjunction. The parser will reuse the fence-aware approach already shipped for the wikilink validator, so a swap never fires inside code or frontmatter.

### Safe length-neutral registry entry

The phase will register the detector on the shared detector registry as `{id, surface: 'spec-doc', detect, fixClass: 'safe', fix}`, the one safe content-mutating fix in the frozen allow-list. The `fix` will run only when `'safe'` is present in `opts.allowFixClass`, will leave every non-prose range byte-identical, and will stay length-neutral and idempotent under a `content_hash` guard so a second pass is a no-op. It deliberately avoids the destructive `runQualityLoop` host, which trims content to an 8000-char budget and would amputate a 10KB spec.

### Files Changed

This table lists the planned changes. None have been applied.

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/.../detector-registry.ts` | Planned modify | Add the `hvr.style` detector entry with `fixClass: 'safe'` and `surface: 'spec-doc'` |
| `.opencode/skills/system-spec-kit/mcp_server/.../detectors/hvr-style.ts` | Planned create | The fence-aware prose parser, the three swap rules, and the length-neutrality and idempotency guards |
| `.opencode/skills/system-spec-kit/mcp_server/.../detectors/__tests__/hvr-style.vitest.ts` | Planned create | Fixtures for each swap rule, fence and frontmatter exclusion, and idempotency |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not yet delivered. The planned path lands the detector module and fixtures first, proves fence and frontmatter exclusion plus idempotency, then adds the single registry entry with `fixClass: 'safe'`. The fence and frontmatter fixtures gate the `'safe'` grant, so the entry registers only after every boundary case passes.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Host the fix on the new engine, not `runQualityLoop` | The quality-loop auto-fix path trims to an 8000-char budget, so it would silently amputate a 10KB spec |
| Grant `fixClass: 'safe'` only for this detector | A body-touching fix is normally never safe, this one earns the exception because it is length-neutral and fence-aware |
| Reuse the wikilink validator fence detector | The fence-aware boundary logic already ships and is proven, so the parser avoids a fresh boundary bug |
| Guard idempotency on `content_hash` | A sentence-split swap can change length, so a hash guard keeps a second pass a clean no-op |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

No verification has run. The checks below are planned and currently unmet.

| Check | Result |
|-------|--------|
| A mixed fixture auto-fixes to zero issues with code inline-code and frontmatter regions byte-identical | PLANNED, not yet run |
| A re-run over already-clean prose applies zero changes under the `content_hash` guard | PLANNED, not yet run |
| An em-dash inside a fence and inside frontmatter yields zero issues | PLANNED, not yet run |
| `detect` in report mode returns issues and leaves the file unchanged on disk | PLANNED, not yet run |
| Each ambiguous swap asserts its exact documented output | PLANNED, not yet run |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Not implemented.** This is a scaffold. No code change has landed and no check has passed.
2. **Engine precondition.** The detector cannot register until the shared-safe-fix-engine phase lands `dq-engine.ts`, `detector-registry.ts`, and the frozen `fixClass` allow-list.
3. **Open default question.** Whether the em-dash default is spaced-hyphen everywhere or sentence-split when the dash joins two independent clauses is unresolved, the detector must pick one deterministic rule and document it.
4. **Open parser-share question.** Whether the prose parser reuses the wikilink validator fence detector directly or calls a single shared prose-range helper is unresolved.
<!-- /ANCHOR:limitations -->

---
