---
title: "Implementation Summary: Sidecar-Client P1 Fixes"
description: "Completion record for 010/003/003 sidecar-client P1 closures."
trigger_phrases:
  - "arc 010 003 003 summary"
  - "sidecar-client p1 implementation summary"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/010-system-spec-kit-mcp-sidecar-investigation/003-fix-sidecar-investigation-remaining-p1s-and-p2s-for-resource-bounds-and-deadcode/003-fix-investigation-p1s-for-sidecar-client-constructor-and-helpers"
    last_updated_at: "2026-05-23T06:45:00Z"
    last_updated_by: "codex"
    recent_action: "completed-7-sidecar-client-p1-fixes"
    next_safe_action: "parent-agent-commit-handoff"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.testables.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/embedders/sidecar-hardening.vitest.ts"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0100030030100030030100030030100030030100030030100030030100030030"
      session_id: "010-003-003-sidecar-client-p1"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "F57 is distinct from F79 and now has one grace-period helper."
      - "F20 touched execution-router only as the duplicate EmbedOptions definer."
      - "F73 removed SidecarClient.ready() and tests now start workers through embed paths."
---
# Implementation Summary: Sidecar-Client P1 Fixes

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Status** | Completed |
| **completion_pct** | 100 |
| **Started** | 2026-05-23 |
| **Completed** | 2026-05-23 |
| **Executor** | Codex |
| **Findings Closed** | F18, F20, F25, F57, F62, F73, F91 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## 2. WHAT WAS BUILT

| Finding | Result | Evidence |
|---------|--------|----------|
| F18 | Split production and test constructor options with overloads, removing the internal test-options assertion. | `sidecar-client.ts:21-43`, `sidecar-client.ts:317-337`, `sidecar-client.testables.ts:7-28` |
| F20 | Made `EmbedOptions` canonical in `sidecar-client.ts` and imported it in execution-router. | `sidecar-client.ts:54-56`, `execution-router.ts:11`, `execution-router.ts:141-150` |
| F25 | Removed trivial `responseHasId`, separate signal helper, and separate wait helper; retained meaningful validation/default/env/termination helpers. | `sidecar-client.ts:164-290` |
| F57 | Consolidated SIGTERM, grace wait, SIGKILL, and final wait into one helper with `gracePeriodMs`. | `sidecar-client.ts:209-252`, `sidecar-client.ts:483-499`, `sidecar-hardening.vitest.ts:404-431` |
| F62 | Replaced response assertion with object/id/type validation and discriminator-specific handling; unknown type emits structured client error. | `sidecar-client.ts:597-657`, `sidecar-hardening.vitest.ts:473-491` |
| F73 | Deleted `SidecarClient.ready()` and removed sidecar-hardening `.ready()` calls. | no `.ready()` match in sidecar-client or sidecar-hardening |
| F91 | Added `validateEmbedInput()` and flattened `embed()` validation. | `sidecar-client.ts:276-290`, `sidecar-client.ts:340-367` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## 3. HOW IT WAS DELIVERED

- Scaffolded this Level 2 packet from the sibling canonical-anchor structure and validated the scaffold before implementation.
- Patched `sidecar-client.ts` for option separation, helper consolidation, readiness removal, validation flattening, termination sequencing, and response narrowing.
- Patched `execution-router.ts` only to import the canonical `EmbedOptions`.
- Added `sidecar-client.testables.ts` for the F18 negative typecheck fixture.
- Extended `sidecar-hardening.vitest.ts` with F57 and F62 runtime fixtures and removed test dependence on `ready()`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## 4. KEY DECISIONS

- **Constructor split:** Production options stay minimal; tests use `SidecarClientTestOptions` via overloads.
- **EmbedOptions canonicalization:** Keep the one-property interface in `sidecar-client.ts` and import it from execution-router rather than adding a new shared file.
- **Termination helper:** F57 remained distinct from F79; one helper now owns SIGTERM/SIGKILL grace sequencing while `terminateChild()` keeps the single-promise lifecycle.
- **Response narrowing:** Unknown discriminators reject with `SidecarClientError` instead of resolving via a broad assertion.
- **Readiness deletion:** `SidecarClient` now implements the execution adapter surface without `ready()`.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## 5. VERIFICATION

| Command | Exit | Evidence |
|---------|------|----------|
| `cd .opencode/skills/system-spec-kit && node mcp_server/node_modules/vitest/vitest.mjs run mcp_server/tests/embedders/ --config mcp_server/vitest.config.ts` | 0 | 4 files passed; 40 tests passed; includes F57 and F62 fixtures. |
| `cd .opencode/skills/system-spec-kit && npm run typecheck --workspace=@spec-kit/mcp-server` | 0 | `tsc --noEmit --composite false -p tsconfig.json` passed; includes F18 negative type fixture. |
| `python3 .opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py --root .opencode/skills/system-spec-kit/mcp_server/lib/embedders` | 0 | OpenCode alignment drift check passed. |
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/010-system-spec-kit-mcp-sidecar-investigation/003-fix-sidecar-investigation-remaining-p1s-and-p2s-for-resource-bounds-and-deadcode/003-fix-investigation-p1s-for-sidecar-client-constructor-and-helpers --strict` | 0 | Strict validation passed after final docs update. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## 6. KNOWN LIMITATIONS

- `execution-router.ts` still has unrelated P2 findings outside this packet; only the F20 duplicate `EmbedOptions` definer changed.
- The `EmbedderAdapter` shared contract still includes `ready()` for registry adapters. This packet removes only the sidecar client readiness API because the sidecar execution router uses `Omit<EmbedderAdapter, 'ready'>`.
<!-- /ANCHOR:limitations -->

---

## Commit Handoff

Changed or created files:

- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.testables.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/tests/embedders/sidecar-hardening.vitest.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/010-system-spec-kit-mcp-sidecar-investigation/003-fix-sidecar-investigation-remaining-p1s-and-p2s-for-resource-bounds-and-deadcode/003-fix-investigation-p1s-for-sidecar-client-constructor-and-helpers/spec.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/010-system-spec-kit-mcp-sidecar-investigation/003-fix-sidecar-investigation-remaining-p1s-and-p2s-for-resource-bounds-and-deadcode/003-fix-investigation-p1s-for-sidecar-client-constructor-and-helpers/plan.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/010-system-spec-kit-mcp-sidecar-investigation/003-fix-sidecar-investigation-remaining-p1s-and-p2s-for-resource-bounds-and-deadcode/003-fix-investigation-p1s-for-sidecar-client-constructor-and-helpers/tasks.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/010-system-spec-kit-mcp-sidecar-investigation/003-fix-sidecar-investigation-remaining-p1s-and-p2s-for-resource-bounds-and-deadcode/003-fix-investigation-p1s-for-sidecar-client-constructor-and-helpers/checklist.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/010-system-spec-kit-mcp-sidecar-investigation/003-fix-sidecar-investigation-remaining-p1s-and-p2s-for-resource-bounds-and-deadcode/003-fix-investigation-p1s-for-sidecar-client-constructor-and-helpers/decision-record.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/010-system-spec-kit-mcp-sidecar-investigation/003-fix-sidecar-investigation-remaining-p1s-and-p2s-for-resource-bounds-and-deadcode/003-fix-investigation-p1s-for-sidecar-client-constructor-and-helpers/implementation-summary.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/010-system-spec-kit-mcp-sidecar-investigation/003-fix-sidecar-investigation-remaining-p1s-and-p2s-for-resource-bounds-and-deadcode/003-fix-investigation-p1s-for-sidecar-client-constructor-and-helpers/description.json`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/010-system-spec-kit-mcp-sidecar-investigation/003-fix-sidecar-investigation-remaining-p1s-and-p2s-for-resource-bounds-and-deadcode/003-fix-investigation-p1s-for-sidecar-client-constructor-and-helpers/graph-metadata.json`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/010-system-spec-kit-mcp-sidecar-investigation/003-fix-sidecar-investigation-remaining-p1s-and-p2s-for-resource-bounds-and-deadcode/003-fix-investigation-p1s-for-sidecar-client-constructor-and-helpers/scratch/.gitkeep`

Suggested commit:

`fix(010/003/003): close 7 P1 sidecar-client findings — F18+F20+F25+F57+F62+F73+F91`

PACKET-010-003-003 DONE: 7 P1, 3 new fixtures, strict-validate PASS, EXIT=0
