---
title: "Implementation Summary: Symlinked runtime: entry guard, project root and empty saves"
description: "Planned. Nothing is built yet. This records the probes and code reads each finding was confirmed against, so the implementer starts from observed behavior."
trigger_phrases:
  - "symlinked runtime root implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/051-symlinked-runtime-root"
    last_updated_at: "2026-10-12T12:00:00Z"
    last_updated_by: "claude-opus-5.5"
    recent_action: "Planned the packet and confirmed each finding against the code and two live probes"
    next_safe_action: "Write the T001 to T003 cases and record each failing against the current code"
    blockers: []
    key_files:
      - ".skilled/skills/system-spec-kit/runtime/cli/lib/esm-entry.ts"
      - ".skilled/skills/system-spec-kit/runtime/cli/core/config.ts"
      - ".skilled/skills/system-spec-kit/runtime/cli/continuity/generate-context.ts"
      - ".skilled/skills/system-spec-kit/runtime/cli/core/workflow.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-12-symlinked-runtime-root-plan"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Refuse an empty-exchanges save, or write it and exit non-zero"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Symlinked runtime: entry guard, project root and empty saves

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 051-symlinked-runtime-root |
| **Status** | Planned |
| **Completed** | Not yet |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing yet. The packet is planned. What follows is the evidence the plan was checked against.

### Symlinked runtime: entry guard, project root and empty saves

The guard canonicalizes one side. `.skilled/skills/system-spec-kit/runtime/cli/lib/esm-entry.ts:32-38` resolves the launch path and `:40` compares it with `importMetaUrl` as given. The other two copies match it, at `runtime/lib/esm-entry.ts:43` and `runtime/cli/lib/esm-entry.mjs:43`, and the built copy at `runtime/cli/dist/lib/esm-entry.js:24-37` carries the same logic. The guarded call sites are `runtime/cli/spec-folder/generate-description.ts:177-181` and `runtime/cli/continuity/generate-context.ts:1196`, built to `runtime/cli/dist/continuity/generate-context.js:1026`.

The root comes from the script. `runtime/cli/dist/core/config.js:13` takes the module directory, `:33` finds the scripts root from it, and `:195` walks five levels up. `main` already accepts a root, at `runtime/cli/dist/continuity/generate-context.js:969-975`, but the CLI path never passes one. The write guard at `runtime/cli/continuity/generate-context.ts:1151-1154` then checks the packet against that root, and the classifier labels an absent packet `divergent-duplicate`.

The empty save is advisory by design today. `runtime/cli/core/workflow.ts:1517-1520` logs the content-quality score and warns below the threshold set in `runtime/cli/lib/content-filter.ts:642-643`. The later abort at `workflow.ts:1757-1763` reads a different score.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| None yet | Planned | See `spec.md` Files to Change |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not delivered. The two entry-guard probes were run from `AI Systems` on 2026-10-12, and the root was printed by importing the built config from there. The divergent-duplicate path and the empty-save path were confirmed by reading the code, not by running a save.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Resolve the root from the caller's git top-level | The script's location names the runtime, and the runtime is shared by every consuming repository |
| Keep template and asset paths script-relative | Those files live in the runtime, so the script's location is the right anchor for them |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `generate-description.js` with no arguments, without and with the flag | exit 1 with usage, then exit 0 with 0 bytes, observed |
| `generate-context.js --not-an-option`, without and with the flag | exit 1 with the error, then exit 0 with 0 bytes, observed |
| `CONFIG.PROJECT_ROOT` imported from `AI Systems` | `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`, observed |
| Divergent-duplicate refusal and empty-save exit 0 | Read from the code, not run |
| Implementation checks | Not run. Nothing is built. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The earlier packet's comment overstates its fix** `esm-entry.ts:12` says both sides are canonicalized. Only the launch path is. The comment changes with the code here.
<!-- /ANCHOR:limitations -->
