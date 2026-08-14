---
title: "Implementation Plan: cli-devin Executor Repair"
description: "Technical plan for the cli-devin workspace-trust flag fix and model-list reconciliation. All 3 phases landed and were verified in commit dfdd41f531."
trigger_phrases:
  - "cli-devin executor repair plan"
  - "respect-workspace-trust false fix"
  - "devin model list reconciliation"
  - "fanout-run devin adapter"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/007-cli-devin-executor-repair"
    last_updated_at: "2026-08-12T21:11:31Z"
    last_updated_by: "markdown-agent"
    recent_action: "Reconciled to Complete; all 3 phases landed in commit dfdd41f531"
    next_safe_action: "None; packet complete, no follow-up required"
    blockers: []
    key_files:
      - "plan.md"
      - "spec.md"
      - "tasks.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: cli-devin Executor Repair

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js (CommonJS) + TypeScript |
| **Runtime surface** | `system-deep-loop` fan-out runtime, cli-devin executor adapter |
| **Storage** | N/A (no persistence change) |
| **Testing** | vitest (per-file, hermetic unit tests), pinned `tsc`, live devin CLI reproduction |

### Overview

Two independent, additive fixes to the cli-devin adapter: (1) always append `--respect-workspace-trust false` to the built `devin` command so non-interactive fan-out lineages stop failing the workspace-trust gate, and (2) reconcile `DEVIN_DEFAULT_MODEL`, `DEVIN_ALLOWED_MODELS`, and `DEVIN_SUPPORTED_MODELS` to devin's live model catalog. Both fixes are confined to the cli-devin adapter surface and its dedicated unit test file; no other executor adapter is touched.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Problem statement confirmed against the current source (`buildDevinLineageCommand`, `DEVIN_ALLOWED_MODELS`, `DEVIN_DEFAULT_MODEL`, `DEVIN_SUPPORTED_MODELS` read and grounded)
- [x] Fix scope and files to change documented in `spec.md`
- [x] Success criteria measurable (SC-001, SC-002)

### Definition of Done

- [x] REQ-001 and REQ-002 implemented (commit `dfdd41f531`)
- [x] REQ-003 hermetic unit test passing, pinned `tsc` return code 0 (commit `dfdd41f531`)
- [x] REQ-004 live red-before/green-after reproduction captured (commit `dfdd41f531`)
- [x] `implementation-summary.md` updated with verification evidence by the owning process

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Per-kind command-builder adapter — `buildDevinLineageCommand` is one of several `LINEAGE_COMMAND_ADAPTERS` entries in `fanout-run.cjs`, each building a synchronous, unit-testable CLI invocation for one executor kind.

### Key Components

- **`buildDevinLineageCommand`** (`fanout-run.cjs`) — builds the `devin` CLI invocation (`-p`, model, permission/sandbox flags) for a lineage; needs the workspace-trust flag added.
- **`DEVIN_DEFAULT_MODEL` / `DEVIN_ALLOWED_MODELS`** (`fanout-run.cjs`) — the runtime default model and enforced allowlist consulted by `buildDevinLineageCommand`.
- **`DEVIN_SUPPORTED_MODELS`** (`executor-config.ts`) — the parallel, TypeScript-side model list used by `isDevinModelAllowed` and other config-time checks; must stay identical in membership to `DEVIN_ALLOWED_MODELS`.
- **`fanout-run.vitest.ts`** — hermetic unit tests for `fanout-run.cjs`'s command builders; needs a new assertion for the workspace-trust flag and model validity.

### Data Flow

1. Deep-loop fan-out dispatches a leaf into a fresh worktree/lineage directory (never interactively trusted).
2. `buildDevinLineageCommand` resolves the lineage's model against `DEVIN_ALLOWED_MODELS`, falling back to `DEVIN_DEFAULT_MODEL`.
3. The fixed adapter appends `--respect-workspace-trust false` to `args` alongside the existing `-p`, `--model`, and permission/sandbox flags.
4. `devin` runs non-interactively without prompting for or refusing on workspace trust.
5. The hermetic unit test asserts the built `args` array carries the flag and a valid model; a live reproduction independently confirms the refusal is gone.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Workspace-trust flag fix

- [x] Add `--respect-workspace-trust false` to the `args` array built by `buildDevinLineageCommand` (`fanout-run.cjs`), unconditional on sandbox/permission mode — landed at `fanout-run.cjs:1895` (commit `dfdd41f531`)

### Phase 2: Model list reconciliation

- [x] Reconcile `DEVIN_DEFAULT_MODEL` to a live uid (`glm-5-2`) in `fanout-run.cjs` (commit `dfdd41f531`)
- [x] Prune `DEVIN_ALLOWED_MODELS` (`fanout-run.cjs`) to live-only uids — dropped `swe` and `deepseek-v4` (commit `dfdd41f531`)
- [x] Reconcile `DEVIN_DEFAULT_MODEL` and prune `DEVIN_SUPPORTED_MODELS` (`executor-config.ts`) to the same live-only uids, kept identical to `DEVIN_ALLOWED_MODELS` (commit `dfdd41f531`)

### Phase 3: Verification

- [x] Add a hermetic unit test in `fanout-run.vitest.ts` asserting the built command carries the flag and a valid model — plus two CJS/TS alignment cells (commit `dfdd41f531`)
- [x] Run pinned `tsc`, confirm return code 0 (commit `dfdd41f531`)
- [x] Run per-file `vitest` for `fanout-run.vitest.ts`, confirm green — 115 passed (was 114, +1 cell, no regression)
- [x] Capture a live red-before reproduction (current adapter, fresh untrusted directory) — exit 1, "Refusing to run in an untrusted workspace"
- [x] Capture a live green-after reproduction (fixed adapter, same directory type) — exit 0, devin returned "PONG"

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `buildDevinLineageCommand` output assertions (flag presence, model validity) | vitest (`fanout-run.vitest.ts`) |
| Type-check | Adapter and config surfaces | pinned `tsc`, return code 0 required |
| Live | Red-before (workspace-trust refusal) / green-after (no refusal) | Live `devin` CLI in a fresh, never-trusted worktree/lineage directory |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|--------------------|
| Installed `devin 3000.4.16` CLI | External | Present, used for the live red/green reproduction | REQ-004 live reproduction cannot run |
| `fanout-run.cjs` | Internal | Modified, landed in commit `dfdd41f531` | REQ-001/REQ-002 cannot land |
| `executor-config.ts` | Internal | Modified, landed in commit `dfdd41f531` | REQ-002 cannot land on the TypeScript side |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The reconciled model list rejects a still-live model, or `--respect-workspace-trust false` causes unexpected devin behavior in an already-trusted directory.
- **Procedure**:
  1. Revert the three touched files (`fanout-run.cjs`, `executor-config.ts`, `fanout-run.vitest.ts`) to their pre-fix state.
  2. cli-devin lineages return to the pre-fix failure mode (workspace-trust refusal in fresh directories) until a corrected fix lands.

<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
