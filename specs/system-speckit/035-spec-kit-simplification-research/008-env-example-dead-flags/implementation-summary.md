---
title: "Implementation Summary: Env example dead flags"
description: "Thirteen variables nothing reads left the root env template, the ranking and discovery entries now describe the code that reads them, two unreachable-flag rows left the reference, the unused batch constants left the runtime config, the stale skill-level template is gone, and the drift guard that had been scanning a deleted directory runs again."
trigger_phrases:
  - "env dead flags summary"
  - "what shipped env template cleanup"
  - "drift guard scripts path fixed"
  - "batch constants removed"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/035-spec-kit-simplification-research/008-env-example-dead-flags"
    last_updated_at: "2026-09-06T21:10:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Closed the packet with every gate observed green"
    next_safe_action: "None; continue with the research lanes"
    blockers: []
    key_files:
      - ".env.example"
      - ".opencode/skills/system-spec-kit/runtime/ENV-REFERENCE.md"
      - ".opencode/skills/system-spec-kit/runtime/core/config.ts"
    session_dedup:
      fingerprint: "sha256:32d1c0cb4790029a3914822e4dcebe4cabfb81277fb335fa76aa586c5b1274b6"
      session_id: "2026-09-06-simplification-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Env example dead flags

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 008-env-example-dead-flags |
| **Completed** | 2026-09-06 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

You asked whether the env template still carried memory-database flags. It did: thirteen of its 216 variables had no reader anywhere in the real tree. They are gone, and the entries that stay describe the code that reads them today.

### What left the template

`SPEC_KIT_ROOT_DIR`, `SPECKIT_SKIP_API_VALIDATION`, `SPECKIT_ROLLOUT_PERCENT`, `SPECKIT_ADAPTIVE_FUSION`, `SPECKIT_INCLUDE_ARCHIVED_DEFAULT`, `SPECKIT_DOC_TYPE_WEIGHT_FACTOR`, `SPECKIT_LEARNED_STAGE2_COMBINER` with its whole "cognitive and learning" section, `SPECKIT_AUTO_INDEX_TOUCHED`, `SPEC_KIT_BATCH_SIZE`, `SPEC_KIT_BATCH_DELAY_MS`, `DEVIN_BIN`, `SPECKIT_SKIP_PREPUSH_TESTS` and `SPECKIT_PREPUSH_TESTS_ENFORCE`. Three of them were read only by `adaptive-fusion.ts` and `learned-combiner.ts`, modules reachable through nothing but the shared barrel; whether those modules stay is lane 003's call, and a template must not advertise switches nothing reachable honours.

### What changed wording

The ranking section said its flags were read by the retrieval scripts. They are read by `rrf-fusion.ts`, whose only live consumer is the skill advisor's fusion scorer, and the banner now says so. `SPECKIT_INDEX_SPEC_DOCS` spoke of indexing; it turns spec-document discovery off for metadata generation and the spec-root registry, and now says that. Section numbers and the two cross-references that pointed at them were corrected.

### What else went

The two rows for the unreachable flags left `ENV-REFERENCE.md`. The batch constants that read the two removed variables left `runtime/core/config.ts`, since nothing imported them. The skill-level `.env.example`, which described a provider cascade that no longer exists and was referenced by nothing, was deleted. The env-reference drift guard had been failing since the CLI moved out of `scripts/`, because it still scanned that directory; it now scans `runtime/cli` and passes.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.env.example` | Modified | Thirteen variables removed, one section removed, banners renumbered, two entries reworded, two cross-references corrected |
| `.opencode/skills/system-spec-kit/runtime/ENV-REFERENCE.md` | Modified | Two rows removed |
| `.opencode/skills/system-spec-kit/runtime/core/config.ts` | Modified | Batch block removed, sections renumbered |
| `.opencode/skills/system-spec-kit/runtime/tests/env-reference-drift.vitest.ts` | Modified | Scans `runtime/cli` instead of the deleted `scripts/` |
| `.opencode/skills/system-spec-kit/.env.example` | Deleted | Stale duplicate |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A Python walk collected every code file in the real tree, excluding the gitignored repository copy under `barter/` and the old worktree under `.worktrees/` that had inflated a first pass, and matched each template name against read-site patterns. A second pass added the extension-less git hooks and the `env.NAME` form, which brought six variables back from dead to live. The hook kill-switch family was kept whole because its names are composed at runtime. Edits ran as a literal-replacement script; the runtime was rebuilt; the drift guard and the CLI typecheck were run.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep the external CLI credentials | The Cursor and Devin binaries read them; this repository documents them for the operator |
| Keep every `SYSTEM_<CONCERN>_DISABLED` switch | The hook-flag library composes the name at runtime, so a literal census cannot see the read |
| Remove the adaptive-fusion flags from the template but leave the module | The module is lane 003's; a template advertising an unreachable switch is wrong either way |
| Fix the drift guard rather than skip it | It is the one test that keeps the reference honest, and its failure was a stale path, not a real drift |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Census over the final template | Every remaining variable has a reader in the real tree, or is an external CLI credential, or is a composed hook switch |
| `npm run build` in `runtime` | PASS |
| `env-reference-drift.vitest.ts` | PASS, 5 tests, after the path fix |
| `npm run typecheck` in `runtime/cli` | PASS |
| References to the deleted skill-level template | None outside specs |
| `validate.sh <this child> --strict` | RESULT: PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The reference still describes the adaptive-fusion module** Its section 7 prose says the primitives ship; only the two flag rows were removed. Lane 003 decides whether the module and that prose stay.
<!-- /ANCHOR:limitations -->

---
