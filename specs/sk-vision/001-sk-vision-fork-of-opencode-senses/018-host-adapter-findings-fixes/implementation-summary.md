---
title: "Implementation Summary: Fix the five sk-vision host-adapter findings"
description: "Closeout for the three-phase fix (base64, OCR guard, settings passthrough + four doc gaps), implemented by DeepSeek V4 Flash and verified by Claude."
trigger_phrases:
  - "sk-vision host-adapter findings fixes summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "specs/sk-vision/001-sk-vision-fork-of-opencode-senses/018-host-adapter-findings-fixes"
    last_updated_at: "2026-08-17T20:45:00.000Z"
    last_updated_by: "claude"
    recent_action: "DeepSeek Flash fixed all 5 findings across 3 phases; Claude verified."
    next_safe_action: "Commit the packet on v4."
    blockers: []
    key_files:
      - "specs/sk-vision/001-sk-vision-fork-of-opencode-senses/018-host-adapter-findings-fixes/implementation-summary.md"
      - ".opencode/skills/sk-vision/vision-runtime/python/runtime.py"
      - ".opencode/skills/sk-vision/vision-runtime/src/opencode/tools.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-018-host-adapter-findings-fixes"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 018-host-adapter-findings-fixes |
| **Status** | In Progress |
| **Level** | 1 |

The three code bugs and four doc gaps are fixed and verified; the commit on v4 is the remaining step.
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The five `048`-research findings are fixed: three real code bugs plus four documentation/contract gaps. DeepSeek V4 Flash (cli-pi, OpenRouter, max thinking) made every edit from precise instructions; Claude verified each with objective checks.

### Fix evidence

| Finding | Artifact | Result |
|---------|----------|--------|
| F5a base64 | `runtime.py::_resolve_image` | tolerant decode (whitespace/URL-safe/re-pad) + clear error |
| F3a OCR guard | `runtime.py::handle_ocr` | `_require_task("ocr")` fails loudly on an OCR-incapable model |
| F5b settings | `types.ts`, `photon.ts`, `tools.ts` | `settings` threads tools → provider → Python for query + ocr |
| F3b OCR model | `sk-vision/SKILL.md` | OCR needs Moondream 3.x; preview output is approximate |
| F4 Cursor env | `sk-vision/hooks/README.md` | Cursor reads `.cursor/mcp.json`; env lives in its own scope |
| F1 cli-cursor | `cli-cursor/SKILL.md` | `--approve-mcps` for non-interactive MCP |
| F2 cli-devin | `cli-devin/SKILL.md` | `permissions.allow` MCP allowlist instead of `dangerous` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Three cli-pi dispatches (max thinking) each carried exact before/after code so the small model applied precise replacements: dispatch A did the two `runtime.py` changes, dispatch B threaded `settings` through the three TS files, and dispatch C added the four doc notes. Each dispatch was verified before the next: F5a with a fail-then-pass base64 probe (`base64.b64decode('iVBORw0KGgo')` raises `Incorrect padding`; the tolerant path succeeds), F3a by grep at the guard line, F5b with `tsc --noEmit` (exit 0) plus the provider/server/runtime test suites, and the docs with grep + the skill-package and root-metadata validators. No Claude agent edited code — implementation was DeepSeek V4 Flash throughout.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Exact before/after in each dispatch | A small model applies precise replacements reliably; ambiguity invites drift |
| Verify every dispatch before the next | Catch a bad edit immediately; a bad phase never blocks a good one |
| Thread `settings` on query + ocr only | The Python runtime forwards `settings` for those; scene is a no-op there |
| Document the moondream3 doubling, don't fix it | A preview-checkpoint sampling artifact, not a code defect |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| F5a fail-then-pass | strict decode raises `Incorrect padding`; tolerant path decodes |
| F3a guard | `_require_task("ocr")` present in `handle_ocr` (line 478) |
| F5b types | `tsc --noEmit` exit 0 |
| Tests | provider+server 6/6, runtime protocol 3/3 |
| Docs present | grep confirms F3b/F4/F1/F2 recipes |
| Skill packages | sk-vision `--check` PASS; cli-external parent-check PASS; `ci-skill-root-metadata` 13/13 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## KNOWN LIMITATIONS

- Settings passthrough was verified at the type/build layer and existing tests; a dedicated unit test asserting `settings` reaches the Python payload was not added (the Python side already forwards it and is covered by `runtime.test.ts`).
- The moondream3-preview digit-doubling is documented, not fixed (model-quality, not code).
- `description.json` / `graph-metadata.json` are conductor-generated, not hand-authored.
- Changes are uncommitted pending an explicit commit instruction.
<!-- /ANCHOR:limitations -->
