---
title: "Implementation Summary: Header tags, hook catch and script test fixes"
description: "Every shell script under runtime/cli now opens with the documented COMPONENT or SPECKIT tag and every module script with MODULE, the cursor response hook reports a failure instead of hiding it, an unused barrel is gone, and two public scripts have their first tests."
trigger_phrases:
  - "header tag fixes shipped"
  - "completeness clamp errexit bug"
  - "cursor hook stderr report"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/028-header-tags-hook-catch-and-script-test-fixes"
    last_updated_at: "2026-09-06T10:40:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Closed the packet with its verification evidence"
    next_safe_action: "None; the packet is complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:7512abbfe1da688e612e4776b21a099cffa3f89873c847516022c316f1eb6bb8"
      session_id: "2026-09-06-v4-reality-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 028-header-tags-hook-catch-and-script-test-fixes |
| **Completed** | 2026-09-06 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Every shell script under runtime/cli now opens with the documented COMPONENT or SPECKIT tag and every module script with MODULE, the cursor response hook reports a failure instead of hiding it, an unused barrel is gone, and two public scripts have their first tests. One of those tests found a real bug: calculate-completeness.sh exited silently under errexit whenever a packet had placeholders.

### Mechanical rows

Line-three substitutions across 38 files, one deletion, one comment rewrite, one header rationale. Judgment rows each carry a decision below.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| runtime/cli/rules/*.sh (27), spec/*.sh (3), kpi/quality-kpi.sh | Modified | Header tag |
| runtime/cli/retrieval/*.mjs (6), evals/run-phase2-closure-metrics.mjs | Modified | Header tag |
| runtime/cli/utils/memory-frontmatter.ts | Deleted | No importer |
| runtime/hooks/cursor/completion-evidence-response.mjs | Modified | stderr line on failure, exit stays clean |
| runtime/cli/lib/frontmatter-migration.ts | Modified | Header states why it keeps its own fence detection |
| shared/embeddings.ts | Modified | Durable comment instead of a catalog pointer |
| runtime/cli/spec/calculate-completeness.sh | Modified | Clamp written as a full if; the false branch no longer ends the function non-zero |
| runtime/cli/tests/quality-audit-script.vitest.ts, calculate-completeness-script.vitest.ts | Created | Happy path and edge case each |
| runtime/cli/retrieval/generate-trigger-index.mjs, retrofit-convention.mjs, runtime/cli/codex/generate-command-routers.cjs | Modified | Delegate repo-root resolution to the hooks module instead of three private walk-ups |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Substitutions verified by a tag census, the two tests run under the CLI vitest project, the CLI typecheck run after the deletion, the CLI dist rebuilt and reported fresh, the hook syntax-checked. Committed as ee8a17b5b1.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Normalize RULE to COMPONENT | The shell standard documents one tag; ripgrep found no consumer of RULE |
| Report, do not swallow, in the response hook | Sibling hooks fall back to approve or allow; a response hook has nothing to emit, so it writes one stderr line and exits clean |
| Keep the migration parser separate | It classifies malformed legacy blocks the strict shared parser rejects; the header now says so |
| Consolidate the repo-root resolvers onto the hooks module | The sentinel-file resolver in `runtime/hooks/lib/workspace/repo-root.mjs` is the one with a written rationale; the retrieval generator, the retrofit script and the codex router now delegate to it, and the pinned retrieval root test and the router self-check still pass |
| Keep doctor exit codes 20, 26 and 64 | Documented in the script header; 64 is the sysexits usage code |
| Keep the legacy test-* names | Wired by package scripts, not by a glob |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Tag census | grep over runtime/cli: 0 RULE, 0 SPEC-KIT, 0 SCRIPT shell headers; 0 SCRIPT module headers |
| Tests | `vitest run` on the two new files: 4 passed |
| Typecheck | `npm run typecheck` in runtime/cli: exit 0 |
| Dist freshness | `dist-freshness.cjs check-all`: all fresh after rebuild |
| Strict validation | `validate.sh <child> --strict` printed RESULT: PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Recursive child manifest test** `recursive-child-manifest.vitest.ts` fails at HEAD with or without these changes because the corpus manifest it checks is being edited by another session; not caused here.
<!-- /ANCHOR:limitations -->

---
