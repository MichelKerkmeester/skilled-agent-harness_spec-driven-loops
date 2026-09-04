---
title: "Plan: Single-Segment Packet Pointer"
description: "Widen the SPECDOC_FRONTMATTER_004 packet_pointer pattern to accept one safe segment, keep every other guard, rebuild the orchestrator, and re-validate a flattened-tree packet."
status: "complete"
completion_pct: 100
trigger_phrases:
  - "single segment packet pointer plan"
  - "packet_pointer regex widening plan"
importance_tier: "high"
contextType: "plan"
parent: "system-speckit"
_memory:
  continuity:
    packet_pointer: "system-speckit/050-single-segment-packet-pointer"
    last_updated_at: "2026-09-02T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored the plan for the single-segment packet_pointer widening"
    next_safe_action: "Implement the regex change (external cli-devin dispatch), then rebuild and re-validate"
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
# Plan: Single-Segment Packet Pointer

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (`mcp-server/lib/validation`) |
| **Framework** | Spec Kit validation orchestrator, compiled and run via `validate.sh` |
| **Storage** | None |
| **Testing** | vitest |

### Overview

One targeted regex change in `SPECDOC_FRONTMATTER_004`'s `packet_pointer` check: accept a pointer with exactly one safe segment in addition to the current two-or-more, without touching any other guard in that check or any other rule in the file. Prove it with a RED-then-GREEN vitest case, confirm the existing negative cases are unaffected, rebuild the compiled orchestrator, and re-run `validate.sh --strict` against a real flattened-tree packet.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- The current regex and its rejection message are confirmed by reading `spec-doc-structure.ts` (lines ~720-765).
- The failing case is reproduced: no `packet_pointer` spelling passes both `SPECDOC_FRONTMATTER_004` and `METADATA_DISK_PATH_CONSISTENCY` for a single-segment packet (observed 2026-09-02).

### Definition of Done

- The widened regex accepts one safe segment and continues to accept two-or-more.
- Every existing negative case (leading slash, `..`, absolute path, unsafe characters) still fails.
- `npm run build` in `mcp-server` exits 0.
- `validate.sh specs/obsidian/005-component-surface-system --strict` reports `RESULT: PASSED` with zero `SPECDOC_FRONTMATTER_004` diagnostics.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Single-rule regex widening inside an existing validation function; no new files, no new abstraction.

### Key Components

- `SPECDOC_FRONTMATTER_004` check block in `spec-doc-structure.ts` — the only code changed.
- `METADATA_DISK_PATH_CONSISTENCY` — untouched; continues to bind `packet_pointer` to the real on-disk folder, which is why the two-segment minimum was redundant with it.

### Data Flow

`validate.sh` → compiled orchestrator → `spec-doc-structure.ts` reads each doc's `_memory.continuity.packet_pointer` → the widened regex test replaces the current one → diagnostics list either gains or drops a `SPECDOC_FRONTMATTER_004` entry depending on the pointer shape.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Negative control first: the new single-segment vitest case is run against the *current* regex and observed RED before any code changes, so the same check proves the fix. After the widening, re-run the full `SPECDOC_FRONTMATTER_004` suite (new case plus every existing case) and confirm nothing else moved. `npm run build` and `validate.sh --strict` are the whole-gate re-runs, not substitutes for the focused test.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- `METADATA_DISK_PATH_CONSISTENCY` stays as the guard that ties `packet_pointer` to the real folder; this change depends on it continuing to catch a pointer naming the wrong folder, since the segment-count minimum is being removed as redundant with it.
- The compiled validation orchestrator (`npm run build` in `mcp-server`) — `validate.sh` exits 3 "stale" without a fresh build.
- `specs/obsidian/005-component-surface-system` as the real-world flattened-tree packet used for final-state proof.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Single-file, single-check change: `git checkout -- .opencode/skills/system-spec-kit/mcp-server/lib/validation/spec-doc-structure.ts` (and its test file) reverts to the two-segment-minimum regex. No committed build artifact besides the rebuilt orchestrator, which self-corrects on the next `npm run build`. No data migration, no consumer contract change beyond what packet_pointer shapes validate.
<!-- /ANCHOR:rollback -->
