---
title: "Tasks: Single-Segment Packet Pointer"
description: "Ordered tasks: reproduce RED, widen the regex, prove GREEN, rebuild, re-validate a real flattened-tree packet."
status: "complete"
completion_pct: 100
trigger_phrases:
  - "single segment packet pointer tasks"
  - "packet_pointer regex widening tasks"
importance_tier: "high"
contextType: "tasks"
parent: "system-speckit"
_memory:
  continuity:
    packet_pointer: "system-speckit/050-single-segment-packet-pointer"
    last_updated_at: "2026-09-02T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored tasks for the single-segment packet_pointer widening"
    next_safe_action: "T001 — reproduce the RED case (external cli-devin dispatch)"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp-server/lib/validation/spec-doc-structure.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-050"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Single-Segment Packet Pointer

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Add a vitest case asserting a single-segment `packet_pointer` (e.g. `"obsidian"`) passes `SPECDOC_FRONTMATTER_004`; run it and observe it RED against the current regex. Was: rejected with `is not a safe relative packet path` (observed 2026-09-02 against `spec-doc-structure.ts` lines 720-765, current pattern `/^[a-z0-9._-]+(?:\/[a-z0-9._-]+)+\/?$/`) — re-observed RED here at `spec-doc-structure.vitest.ts:335`, `AssertionError: expected 'fail' to be 'pass'`, 1 failed | 19 passed, under `git stash` control of the source file with the new test file kept in place.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Widen the `packet_pointer` pattern in `SPECDOC_FRONTMATTER_004` (`spec-doc-structure.ts` ~lines 720-765) to accept exactly one safe segment as well as two-or-more, without loosening the `..`, leading-slash, absolute-path, or safe-character guards. Was: no packet_pointer spelling passes both `SPECDOC_FRONTMATTER_004` and `METADATA_DISK_PATH_CONSISTENCY` for a single-segment packet from either repository root — now: `spec-doc-structure.ts:751` regex segment group changed `+`→`*`, verified by diff read in full; every other guard (`..`, leading-slash anchoring, safe-char class, trailing-slash) unchanged.
- [x] T003 Re-run T001's case and observe it GREEN; re-run the full existing `SPECDOC_FRONTMATTER_004` suite and confirm every negative case (leading slash, `..`, absolute path, unsafe characters) still fails. Was: not yet run against the widened regex — now: `vitest run tests/spec-doc-structure.vitest.ts` exit 0, Test Files 1 passed, Tests 20 passed (20); the new `rejects unsafe packet_pointer shapes` case (`../x`, `/abs`, `a//b`, `bad\path`, `UPPER/Case`) all fail with `SPECDOC_FRONTMATTER_004`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T004 `cd mcp-server && npm run build`; confirm exit 0. Was: not yet rebuilt against the widened regex — now: exit 0, observed post-restore rebuild (`@spec-kit/mcp-server dist build preparation recorded` x3, `tsc --build` clean).
- [x] T005 `NODE_PRESERVE_SYMLINKS=1 bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/obsidian/005-component-surface-system --strict`; confirm the first `RESULT:` line reads `RESULT: PASSED` and the output carries zero `SPECDOC_FRONTMATTER_004` lines. Was: fails with `SPECDOC_FRONTMATTER_004` under the current regex (observed 2026-09-02); `validate.sh` also exits 3 "stale" until T004 rebuilds the orchestrator — now: first `RESULT:` line `RESULT: PASSED`, `grep -c SPECDOC_FRONTMATTER_004` = 0.
- [x] T006 `NODE_PRESERVE_SYMLINKS=1 npx tsx .opencode/skills/system-spec-kit/scripts/graph/backfill-graph-metadata.ts specs/system-speckit/050-single-segment-packet-pointer`; confirm it completes and `graph-metadata.json` reflects this packet. Was: `graph-metadata.json` already present from initial authoring; backfill re-run here to positionally align after this packet's own edits.
- [x] T007 `NODE_PRESERVE_SYMLINKS=1 bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/system-speckit/050-single-segment-packet-pointer --strict`; confirm the first `RESULT:` line reads `RESULT: PASSED` for this packet itself.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- The single-segment vitest case is observed RED before the change and GREEN after.
- Every existing `SPECDOC_FRONTMATTER_004` negative case still fails after the change.
- `npm run build` exits 0.
- `validate.sh --strict` reports `RESULT: PASSED` for both `specs/obsidian/005-component-surface-system` and this packet.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`.
- **Plan**: See `plan.md`.
<!-- /ANCHOR:cross-refs -->
