---
title: "Feature Specification: cli-devin Executor Repair"
description: "Repair the cli-devin deep-loop executor adapter so cli-devin lineages run again on the current installed devin CLI. The installed devin 3000.4.16 added a non-interactive workspace-trust gate that fails every fresh fan-out lineage before any work starts, and the adapter's model lists have drifted off devin's live model catalog."
trigger_phrases:
  - "cli-devin executor repair"
  - "devin workspace-trust gate"
  - "respect-workspace-trust false"
  - "cli-devin model list drift"
  - "buildDevinLineageCommand fix"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/007-cli-devin-executor-repair"
    last_updated_at: "2026-08-13T14:27:57.000Z"
    last_updated_by: "markdown-agent"
    recent_action: "Landed and verified in commit dfdd41f531; packet reconciled to Complete"
    next_safe_action: "None; packet complete, no follow-up required"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    completion_pct: 100
    open_questions:
      - "Does the live devin model catalog change often enough to warrant a periodic drift-check, beyond the one-time reconciliation in this packet?"
    answered_questions:
      - "Should the workspace-trust mitigation flag ever be conditional? No: it is unconditional in the shipped fix, since cli-devin always runs in print mode."
---
# Feature Specification: cli-devin Executor Repair

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-08-12 |
| **Branch** | `system-deep-loop/0144-036-p0-remediation` |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

**Primary (systemic):** the installed `devin 3000.4.16` added a workspace-trust gate. In non-interactive `-p`/print mode — which the cli-devin adapter always uses — devin refuses to run in any directory that has not been interactively "trusted," exiting 1 before any work starts ("Refusing to run in an untrusted workspace"). Deep-loop fan-out always dispatches leaves into fresh, never-trusted worktree/lineage directories, so every cli-devin lineage dies immediately. `buildDevinLineageCommand` (`.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`) builds its `devin` invocation as `['-p', prompt, '--model', model, ...]` and never passes the documented mitigation `--respect-workspace-trust false`.

**Secondary (latent):** the adapter's `DEVIN_DEFAULT_MODEL = 'swe'` is no longer a live model — devin has no `swe` family, alias, or uid, only `swe-1.7` / `swe-1.6` families. Both `DEVIN_ALLOWED_MODELS` (`fanout-run.cjs`) and `DEVIN_SUPPORTED_MODELS` (`.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts`) still carry `'swe'` and have drifted off the live model set in other ways as well.

### Purpose

Restore cli-devin lineage execution in deep-loop fan-out by always passing the workspace-trust mitigation flag and by reconciling the default/allowed/supported model lists to devin's live model catalog, backed by a hermetic unit test and a live red-before/green-after reproduction.

### Resolution

Landed in commit `dfdd41f531`. See `implementation-summary.md` for the shipped state and verification evidence.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Documenting the workspace-trust gate failure and the model-list drift as confirmed, reproducible facts.
- Documenting the fix scope for a parallel process to implement: the `--respect-workspace-trust false` flag, the model-list reconciliation, the hermetic unit test, and the live reproduction.
- This packet's own artifacts are documentation only — it does not implement, run, or verify the fix.

### Out of Scope

- Implementing the code fix itself (owned by a parallel process, not this packet).
- Any other cli-devin behavior beyond the workspace-trust flag and the model lists (e.g., sandbox/permission-mode mapping, which is unaffected and already correct).
- Other deep-loop executor adapters (`cli-codex`, `cli-claude-code`, `cli-opencode`, `cli-cursor`, `cli-pi`, native).
- Future devin CLI releases beyond the currently installed `3000.4.16`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modify | `buildDevinLineageCommand` always appends `--respect-workspace-trust false`; reconcile `DEVIN_DEFAULT_MODEL` and prune `DEVIN_ALLOWED_MODELS` to live-only uids |
| `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts` | Modify | Reconcile `DEVIN_DEFAULT_MODEL` and prune `DEVIN_SUPPORTED_MODELS` to the same live-only uids as `fanout-run.cjs` |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts` | Modify | Add a hermetic unit test asserting the built `devin` command carries `--respect-workspace-trust false` and a valid model |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `buildDevinLineageCommand` always appends `--respect-workspace-trust false` to the built `devin` command | The built command's `args` array contains `--respect-workspace-trust`/`false` for every lineage, regardless of sandbox or permission mode |
| REQ-002 | Model lists reconciled to devin's live catalog | `DEVIN_DEFAULT_MODEL` resolves to a live uid (`glm-5-2`); `DEVIN_ALLOWED_MODELS` (`fanout-run.cjs`) and `DEVIN_SUPPORTED_MODELS` (`executor-config.ts`) contain only live model uids and are identical to each other |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Hermetic unit test covers the fix | `fanout-run.vitest.ts` asserts the built command carries the workspace-trust flag and a valid model, pinned `tsc` return code 0, per-file `vitest` green |
| REQ-004 | Live reproduction captured | A red-before run (fresh untrusted directory, current adapter) reproduces "Refusing to run in an untrusted workspace"; a green-after run (fixed adapter) shows no refusal |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: cli-devin lineages no longer fail immediately with "Refusing to run in an untrusted workspace" when dispatched into a fresh deep-loop fan-out worktree/lineage directory.
- **SC-002**: `DEVIN_DEFAULT_MODEL`, `DEVIN_ALLOWED_MODELS`, and `DEVIN_SUPPORTED_MODELS` contain only live devin model uids and stay identical in membership between `fanout-run.cjs` and `executor-config.ts`.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Installed `devin 3000.4.16` | The workspace-trust gate behavior is specific to this version; a future devin release could change trust semantics again | Pin the live reproduction to the installed version and note the version in the reproduction evidence |
| Dependency | Live devin CLI availability | REQ-004's live red/green reproduction needs a real `devin` binary on PATH | Documented as a prerequisite in `plan.md` §5 Testing Strategy |
| Risk | Model catalog drift recurrence | The live model set can change again after this one-time reconciliation, silently reintroducing dead uids | Not mitigated by this packet; flagged as an open question below |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should the workspace-trust mitigation flag ever be conditional, or is always-on correct because deep-loop fan-out never dispatches into a pre-trusted directory?
- Does the live devin model catalog change often enough to warrant a periodic drift-check, beyond the one-time reconciliation in this packet?

<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
