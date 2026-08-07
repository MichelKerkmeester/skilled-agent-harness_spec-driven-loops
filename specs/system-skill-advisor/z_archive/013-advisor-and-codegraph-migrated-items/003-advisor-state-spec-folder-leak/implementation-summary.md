---
title: "Implementation Summary: Stop skill-advisor state from leaking into spec folders"
description: "Hardened the skill-advisor workspace-root fallback so it can never return a path inside a specs/ subtree, mirrored the guard in the schema's detectRepoRoot twin, added a 5-case regression test, rebuilt dist, and removed the 23 stray .advisor-state directories. Pre-existing parity failures were attributed via a stash baseline."
trigger_phrases:
  - "advisor state leak summary"
  - "workspace root hoist summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/013-advisor-and-codegraph-migrated-items/003-advisor-state-spec-folder-leak"
    last_updated_at: "2026-06-18T00:00:00Z"
    last_updated_by: "opus-agent"
    recent_action: "Hardened workspace-root fallback + cleaned 23 stray advisor-state dirs"
    next_safe_action: "Fresh session or /mcp reconnect to activate the dist fix live"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/utils/workspace-root.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/schemas/advisor-tool-schemas.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/tests/utils/workspace-root.vitest.ts"
    session_dedup:
      fingerprint: "sha256:6e2f4017ee99ad6cb0be263c64458e0796ea34d37cd8abe56a9778919098acb0"
      session_id: "027-003-005-advisor-state-spec-folder-leak"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-advisor-state-spec-folder-leak |
| **Completed** | 2026-06-18 |
| **Level** | 2 |
| **Actual Effort** | ~1.75 hours |


<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

The skill-advisor's workspace-root resolver previously fell back to the start directory when its canonical sentinel was unreachable. Any advisor-bearing process dispatched with a cwd inside a `specs/` packet therefore wrote a stray `.opencode/skills/.advisor-state/skill-graph-generation.json` into that packet — 23 such strays had accumulated across `.opencode/specs/`.

A pure helper, `hoistAboveSpecsTree`, now detects a `specs/` boundary (canonical `.opencode/specs/` or the bare `specs/` symlink alias) in the start path and returns the directory that contains that tree. The fallback returns the hoisted workspace root when available, otherwise the prior `resolve(start)`, so the resolver can no longer hand back a spec-subtree path. The schema's inlined `detectRepoRoot` twin received the same guard to keep the workspaceRoot allowlist anchored on the true root. The 23 existing strays were removed with a snapshot-driven deletion that left real vendored `external/` clones intact.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `lib/utils/workspace-root.ts` | Modified | Added `hoistAboveSpecsTree` + `sep` import; fallback now hoists above any `specs/` boundary |
| `schemas/advisor-tool-schemas.ts` | Modified | Inlined lockstep twin of the guard in `detectRepoRoot` |
| `tests/utils/workspace-root.vitest.ts` | Created | 5-case regression test for the hardened fallback |
| `dist/**` | Modified | Rebuilt compiled output containing the fix |
| `.opencode/specs/**/.advisor-state/` (×23) | Deleted | Removed stray runtime spillage |


<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Root cause was confirmed by reading the resolver and the writer (`generation.ts`) before changing anything. The stray inventory was snapshotted to `scratch/` prior to deletion. The fix was implemented as a pure path-math guard so it touches only the cold fallback branch, then proven with a dedicated unit test. Before claiming "no regressions", the two source edits were stashed and the parity suites re-run on the clean baseline — confirming the three parity failures pre-date this change. Finally `dist` was rebuilt and the fix verified present in compiled output.


<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Hoist above `specs/` rather than re-walk for a weaker marker | Guarantees the requested invariant ("never a specs subtree") with pure path math and no extra fs probes |
| Prefer `.opencode/specs` boundary, then bare `specs` | `resolve()` does not follow the `specs` → `.opencode/specs` symlink, so both spellings must be handled |
| Inline the twin in `detectRepoRoot` instead of importing | The file's own comment forbids a schemas/→lib/ import (circular); the existing pattern already inlines the walk-up |
| Delete only `.advisor-state` leaves; `rmdir` wrappers when empty | Avoids harming real vendored `.opencode` clones under `external/` |
| Leave the heavier `.opencode/node_modules` spillage | Distinct artifact class; out of scope, flagged as follow-up |


<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Test Type | Status | Coverage | Notes |
|-----------|--------|----------|-------|
| Typecheck | Pass | - | `npm run typecheck` exit 0 |
| Unit (new) | Pass | 5/5 | happy path, canonical hoist, bare-alias hoist, no-specs property, non-specs fallback |
| Regression baseline | Pass | - | stash baseline proves the 3 parity failures pre-date this change |
| dist build | Pass | - | `hoistAboveSpecsTree` present in compiled `dist` |
| Filesystem re-sweep | Pass | - | 0 stray `.advisor-state` under `.opencode/specs/`; `external/` clones intact |


<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:nfr-verify -->
## NFR Verification

| NFR ID | Target | Actual | Status |
|--------|--------|--------|--------|
| NFR-P01 | No hot-path cost | Hoist runs only on the cold fallback | Pass |
| NFR-R01 | Deterministic, no writes, no throw | Pure path math | Pass |
| NFR-M01 | Twin discoverable | Comment names lockstep partner | Pass |


<!-- /ANCHOR:nfr-verify -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Live activation pending** — the dist is rebuilt, but the running advisor daemon picks up the fix only after a fresh session or `/mcp` reconnect (its launcher does not transparently recycle on child SIGTERM).
2. **Exact post-fix dispatch path unconfirmed** — strays dated after the strict-sentinel fix imply dispatched `opencode run` seats still reached the fallback; the hoist makes this moot for the leak, but the precise dispatch cause was not reproduced.
3. **Related plugin spillage untouched** — two research dirs still hold `.opencode/node_modules` opencode-plugin installs (heavier, gitignored), tracked separately.


<!-- /ANCHOR:limitations -->
---

<!-- ANCHOR:deviations -->
## Deviations from Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| Clean up advisor-state strays | Same, but 2 wrapper `.opencode` dirs survived | They also contain real opencode-plugin `node_modules`; `rmdir` correctly skipped non-empty wrappers |
| Run resolver-adjacent suites green | 3 parity tests failed | Confirmed pre-existing via stash baseline (`rr-iter2-060`, divergence-ledger drift); out of scope |

<!-- /ANCHOR:deviations -->
