---
title: "Implementation Summary: CLI-Adapter Stress-Tests and Playbooks"
description: "Progressive build of a hermetic stress-test program for the six external CLI deep-loop adapters and the fan-out scheduler; phase 1 delivers the shared harness and cli-codex coverage."
trigger_phrases:
  - "cli adapter stress tests"
  - "fan-out stress testing"
  - "external CLI manual testing playbook"
importance_tier: "high"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/001-cli-adapter-stress-and-playbooks"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/001-cli-adapter-stress-and-playbooks"
    last_updated_at: "2026-08-15T17:19:22Z"
    last_updated_by: "claude"
    recent_action: "Built stress harness + cli-codex; suite 26/26 + 1 gated skip, exit 0"
    next_safe_action: "Phase 2: add the five remaining adapter stress files"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/tests/stress/cli-adapter/matrix-manifest.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/stress/cli-adapter/cli-codex.vitest.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/stress/cli-adapter/shims/codex-shim.cjs"
      - ".opencode/skills/system-deep-loop/runtime/tests/stress/cli-adapter/fixtures/process-fixture.ts"
    completion_pct: 40
    open_questions: []
    answered_questions:
      - "The stress harness is hermetic: PATH shims inject real faults with no provider access"
      - "Each cli-codex edge cell binds to the real dispatchCodex path, not fixture code"
      - "The suite is additive-only; no shipped adapter, scheduler, or config is modified"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level3-arch | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-cli-adapter-stress-and-playbooks |
| **Status** | In Progress — phase 1 of 3 |
| **Level** | 3 |
| **Phase 1 Scope** | shared harness + cli-codex adapter |
| **Files Created (phase 1)** | 8 stress-tree files |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

This leaf builds a hermetic, hang-safe stress-test program that exercises the six external CLI deep-loop adapters and the fan-out scheduler against their real dispatch paths, using deterministic PATH shims so faults reproduce without any provider credentials or network access. The build is progressive across three phases; this commit is phase 1.

Phase 1 delivered the shared harness and cli-codex coverage:
- A serial, hang-safe test tree at `runtime/tests/stress/cli-adapter/` (no full-aggregate gate).
- A frozen matrix manifest of the 14 edge-case rows, each mapped to a named, adapter-bound test.
- Deterministic PATH shims injecting real OS-level faults (auth denial, model-not-found / insufficient balance, rate-limit, transport-missing, stdin, timeout, malformed output, missing artifact, non-zero / signal exit) without provider access.
- Bounded temporary-process fixtures with captured PIDs and descendant reaping, plus a live preflight that SKIPs gated live cells.
- `cli-codex.vitest.ts`: every one of the 14 edge cells drives the real `dispatchCodex` path with the shim as the `codex` binary, so an adapter regression fails the cell.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/tests/stress/cli-adapter/matrix-manifest.ts` | Created | 14-row edge-case matrix, adapter-bound indexing |
| `runtime/tests/stress/cli-adapter/live-contracts.json` | Created | Captured live dispatch / fan-out contracts |
| `runtime/tests/stress/cli-adapter/cli-codex.vitest.ts` | Created | cli-codex adapter stress suite |
| `runtime/tests/stress/cli-adapter/shims/codex-shim.cjs` | Created | Deterministic fault-injection shim |
| `runtime/tests/stress/cli-adapter/fixtures/process-fixture.ts` | Created | Bounded process + descendant reaping |
| `runtime/tests/stress/cli-adapter/fixtures/codex-fixture.ts` | Created | cli-codex dispatch + PATH-prefix helpers |
| `runtime/tests/stress/cli-adapter/fixtures/live-preflight.ts` | Created | Gated-live SKIP preflight |
| `runtime/tests/stress/cli-adapter/fixtures/worktree-fixture.ts` | Created | Isolated-worktree + realpath fixtures |

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The build is phased to keep each step independently verifiable and additive-only. Phase 1 (this commit) establishes the shared harness plus the first adapter; phase 2 adds the remaining five adapters; phase 3 adds the fan-out scheduler stress, the operator playbook package, the matrix-bijection validator, and the leaf closeout.

The shipped adapters, fan-out scheduler, executor config, and mode registry are read as the behaviour contract and never modified. gpt-5.6-sol (cli-codex) implemented the harness; an adversarial DeepSeek V4 Flash review (via opencode-go) then refuted test meaningfulness, finding four vacuous cells and one overclaimed guarantee. Those were remediated with a test-first red run — constant-true and fixture-only cells were rebound to the real dispatch path, and the manifest was corrected to state only what is asserted.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| ADR | Decision | Status | Impact |
|-----|----------|--------|--------|
| ADR-001 | Dedicated serial stress suite, hang-safe | Accepted | No aggregate hang can mask a per-file failure |
| ADR-002 | Per-skill adapter playbooks + shared fan-out playbook | Accepted | Operator triage maps 1:1 to matrix cells |
| ADR-003 | Deterministic external-dependency gating | Accepted | Hermetic by default; live probes opt-in only |

| Implementation Decision | Rationale |
|-------------------------|-----------|
| Every edge cell drives the real `dispatchCodex` | A test that bypasses the adapter cannot catch a regression |
| Manifest states only asserted behaviour | No "classification" or full-tree-reaping claims the adapter never makes |
| Shim is a real PATH executable | Faults are injected at the OS level, not grepped from strings |

See `decision-record.md` for full ADR documentation.

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Check | Status | Details |
|-------|--------|---------|
| cli-codex stress | Pass | 26 passed + 1 gated-live skip, exit 0 |
| TypeScript | Pass | `tsc --noEmit --ignoreDeprecations 6.0` exit 0 |
| Adversarial review | Pass | DeepSeek: 4 vacuous cells + 1 overclaim found and remediated |
| Static matrix audit | Pass | 14 rows, 14 indexed tests, allAdapterBound true, overclaims none |
| Process cleanup | Pass | No leftover shim processes after the run |
| Scope | Pass | Additive only; no shipped runtime modified |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Phases 2-3 pending** - the five remaining adapters, the fan-out scheduler stress, the operator playbook package, and the matrix-bijection validator are not built yet.
2. **Direct-children kill discipline** - the cli-codex adapter intentionally reaps only the captured pid and its direct children (never a blanket kill of unrelated processes); the suite asserts this true contract rather than full-tree reaping.
3. **Gated live probes** - real CLI/auth cells run only under an explicit opt-in env flag and otherwise SKIP; live evidence is not part of the default hermetic gate.

<!-- /ANCHOR:limitations -->
