---
title: "Implementation Summary"
description: "Each containment pass keeps its own quarantine evidence under a pass-keyed directory; nothing an earlier pass wrote is ever replaced."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/010-fanout-write-containment-hardening/012-quarantine-retention-per-pass"
    last_updated_at: "2026-09-14T17:44:17Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Made quarantine evidence per-pass and filled the packet docs"
    next_safe_action: "Commit once the full suite exits zero"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-012-quarantine-retention-per-pass"
      parent_session_id: null
    completion_pct: 0
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
| **Spec Folder** | 012-quarantine-retention-per-pass |
| **Completed** | 2026-09-14 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## 2. WHAT WAS BUILT

A later containment pass no longer overwrites an earlier one. In `runtime/lib/deep-loop/write-containment.ts` the quarantine tree is now `containment/quarantine/<pass>/`, where the pass segment is the iteration plus `-attempt-<n>` when the runner passes one; the combined revert patch lives under the same pass directory, still keyed by remedy; every quarantine and patch file is created with an exclusive open so an existing file is reported rather than replaced; and the patch destination passes the same canonicality refusal as every other write. The returned quarantine path and recovery hint name the pass that wrote them. The runner needed no change: it already passes the attempt and forwards the paths.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

One dispatch to DeepSeek V4.1 Flash at max through the gateway on cli-pi. Against the unmodified writer the retention test failed and an on-disk probe showed one manifest surviving two passes. The delegate caught two defects its own change introduced: the new patch write following a link at the pass directory, fixed by routing it through the refusal, and an exclusive mkdir discarding a manifest when the patch had already created the directory, fixed by reusing the directory and claiming only files. The orchestrator reviewed the diff, updated the protocol line and parent plan, regenerated the compiled contract and ran the whole suite before committing.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Reuse the pass directory, claim files exclusively | The combined patch and the quarantine share a directory; only files must never be replaced |
| Key by attempt as well as iteration | A retry is a distinct pass whose evidence must survive |
| Route the patch through the canonicality refusal | A pass directory is below the artifact root and a lane can plant a link there |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Retention test and probe against unmodified writer | FAIL as expected: one manifest after two passes |
| Both touched test files plus typecheck | PASS, exit 0, 216 tests |
| Full deep-loop suite | `npm test` in the runtime: 152 files, 2614 passed, 8 skipped, exit 0, 1205 s; contract drift and render tests rerun green after the protocol edit and recompile |
| `validate.sh --strict` on this phase | RESULT: PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Growth.** Retained passes accumulate under the lane; the quarantine size bound still applies per pass.
<!-- /ANCHOR:limitations -->

---


