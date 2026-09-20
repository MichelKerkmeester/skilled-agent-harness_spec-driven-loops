---
title: "Feature Specification: Repair cli-devin Fan-out Dispatch for the Current Devin CLI"
description: "The current devin CLI (3000.4.25) blocks non-interactive fan-out lineages two ways — an untrusted-workspace gate and a --sandbox mode that rejects writes — so every cli-devin research/review lineage exits without producing its artifact. Restore a working headless dispatch."
trigger_phrases:
  - "cli-devin fanout repair current devin cli"
  - "devin respect-workspace-trust false"
  - "devin sandbox rejects writes non-interactive"
  - "cli-devin lineage salvage_miss"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/046-cli-devin-current-cli-repair"
    last_updated_at: "2026-08-17T12:45:34Z"
    last_updated_by: "claude"
    recent_action: "Fix landed and verified end-to-end"
    next_safe_action: "Closed"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-046-cli-devin-repair"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Feature Specification: Repair cli-devin Fan-out Dispatch for the Current Devin CLI

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-17 |
| **Branch** | `skilled/v4.0.0.0` |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The installed devin CLI (3000.4.25) breaks non-interactive fan-out lineages in two independent ways. First, a workspace-trust gate refuses to run in any directory not interactively trusted, and print mode cannot answer the prompt. Second, the `--sandbox` flag forces an "autonomous" permission mode that overrides `--permission-mode dangerous` and rejects every write tool call in non-interactive mode. The fan-out's `buildDevinLineageCommand` dispatched `--permission-mode dangerous --sandbox` with no trust flag, so a cli-devin lineage does its read-only exploration, cannot write, and exits 0 without producing `research.md` — recorded as a `salvage_miss` fan-out failure.

### Purpose
Restore a working headless cli-devin dispatch against the current devin CLI so fan-out research/review lineages can write their artifacts, verified by a live reproduction rather than stub-only unit tests.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `buildDevinLineageCommand` in `fanout-run.cjs`: always pass `--respect-workspace-trust false`; stop passing `--sandbox` for the workspace-write case so writes are auto-approved.
- The devin-command unit assertions in `fanout-run.vitest.ts`.
- The rationale comment in `buildDevinLineageCommand` that documented the now-invalid `--sandbox` confinement assumption.

### Out of Scope
- The cursor / opencode / claude-code / codex / pi lineage command builders.
- The devin model allowlist and default-model id (already current on this branch).
- The fan-out write-containment guard itself (it remains the confinement mechanism after `--sandbox` is dropped).
- The 045 research packet that surfaced this bug (research-only; consumes this fix).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modify | Trust flag added; drop `--sandbox` for workspace-write; update rationale comment |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts` | Modify | Devin arg assertions expect trust flag and no `--sandbox` |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Devin runs in an untrusted fresh directory in print mode | `buildDevinLineageCommand` always appends `--respect-workspace-trust false`; live devin call in a fresh temp dir does not refuse |
| REQ-002 | A devin write-lineage can actually write | workspace-write no longer passes `--sandbox`; live devin call writes a file in a fresh dir (exit 0, file present) |
| REQ-003 | Fan-out unit suite stays green | `fanout-run.vitest.ts` passes with updated devin assertions |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Confinement is preserved by the software guard | Comment documents that write-containment (not `--sandbox`) now confines devin lineages; out-of-scope writes are still reverted |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A real cli-devin fan-out lineage produces `research.md` end-to-end (proven by re-running the 045 glm-devin lineage).
- **SC-002**: `fanout-run.vitest.ts` is green and asserts the new devin arg shape.
- **SC-003**: No unrelated executor's dispatch changed.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Installed devin CLI version | Flag names/behavior can shift between devin releases | Verified against 3000.4.25 by live reproduction; re-verify on devin upgrades |
| Risk | Dropping `--sandbox` removes OS write confinement | A misbehaving devin leaf could write outside its lineage dir | Fan-out write-containment guard reverts any out-of-scope path a lineage touched |
| Risk | Session-lifecycle hook writes `.opencode/bin/git-*.sh` inside a lineage | Guard reverts the write and fatals the lineage | Out of scope here; salvage the lineage's `research.md` and track the hook interaction separately |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should the fan-out later grant devin a confined-but-writable mode if a future devin CLI reconciles `--sandbox` with non-interactive writes? Not pre-decided.

<!-- /ANCHOR:questions -->
---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Consumed by**: `specs/cli-external-orchestration/045-cli-pi-bridge-cursor-devin/001-research-bridge-possibilities` (the research run this fix unblocks)
