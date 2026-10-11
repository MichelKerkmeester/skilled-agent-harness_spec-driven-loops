---
title: "Implementation Summary"
description: "advisor_recommend now accepts options.surfaceHint and forwards it to the compiled-route front door as --surface-hint, and the advisor ships 0.15.0.0 covering this and the scoring fixes."
trigger_phrases:
  - "advisor surface hint implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/014-skill-authoring-ux-research/008-advisor-surface-hint"
    last_updated_at: "2026-10-10T21:00:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Closed the phase with every goal criterion passing"
    next_safe_action: "Start the next phase"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "summary-014-008-advisor-surface-hint"
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
| **Spec Folder** | 008-advisor-surface-hint |
| **Completed** | 2026-10-10 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

advisor_recommend now accepts options.surfaceHint and forwards it to the compiled-route front door as --surface-hint, and the advisor ships 0.15.0.0 covering this and the scoring fixes.

### Phase 8: advisor-surface-hint

The strict options schema accepts `surfaceHint`, a string of 1 to 64 characters, and the tool and CLI manifest JSON schemas describe it. The handler passes the hint through enrichCompiledRoutes into the front-door call as its own argv pair after `--prompt-stdin`; the front door already ignores a surface it does not know. The runtime's `package.json` and lockfile root now declare `engines.node >=20.19.0`, the floor its build dependencies need. SKILL.md moves to 0.15.0.0 with a changelog entry for this phase and the scoring phase, and the Hermes copy is regenerated.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/schemas/advisor-tool-schemas.ts` | Modify | surfaceHint option |
| `runtime/handlers/advisor-recommend.ts` | Modify | Forward --surface-hint |
| `runtime/tools/advisor-recommend.ts`, `runtime/skill-advisor-cli-manifest.ts` | Modify | Describe the option |
| `runtime/tests/advisor-surface-hint.vitest.ts` | Create | Three cases |
| `runtime/package.json`, `runtime/package-lock.json` | Modify | engines.node >=20.19.0 |
| `SKILL.md`, `changelog/v0.15.0.0.md`, `.hermes/skills/system-skill-advisor/SKILL.md` | Modify, Create | Release 0.15.0.0 |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Two DeepSeek V4.1 Flash max builds through cli-pi on the LLM gateway: the option and its forwarding, then the test file. The orchestrator ran the test against the committed handler and schema to see it fail, added the engines field from a handoff by the root-cause track, bumped the version, wrote the changelog and regenerated the Hermes copy. skill-advisor-cli.ts and the hook files were left alone because another track owns their stdin reads.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Accept any short string | The front door already validates and ignores an unknown surface, so a second list here would drift |
| Engines in this phase | It is the one phase that already touches the advisor runtime's package files and release |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npx vitest run tests/advisor-surface-hint.vitest.ts` | 3 passed; against the committed sources 2 failed, 1 passed (the no-hint control) |
| `grep -c surface-hint handlers/advisor-recommend.ts` | 1 |
| `npm run typecheck` | exit 0 |
| `npx vitest run` | 137 files, 1021 passed, 6 skipped, 0 failed |
| advisor_recommend with surfaceHint WEBFLOW | status ok, sk-code routed to sk-code-webflow |
| `validate.sh --strict` on this phase | RESULT: PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. Another worktree may also bump the advisor version; the master renumbers once at merge.
<!-- /ANCHOR:limitations -->

---
