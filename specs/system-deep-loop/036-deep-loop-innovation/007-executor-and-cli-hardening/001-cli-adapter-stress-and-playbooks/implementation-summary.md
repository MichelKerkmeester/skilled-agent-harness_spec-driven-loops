---
title: "Implementation Summary: CLI-Adapter Stress-Tests and Playbooks"
description: "Delivered a hermetic stress program for the six external CLI adapters and fan-out, with 98 paired playbooks, a bijection validator, and direct destructive-scope containment evidence."
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
    last_updated_at: "2026-08-16T03:12:23Z"
    last_updated_by: "claude"
    recent_action: "Reconciled to Complete; leaf strict PASSED, global parity drift fixed on origin"
    next_safe_action: "Hand off to 004 whole-system gate and 036 parent reconcile"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/tests/stress/cli-adapter/"
      - ".opencode/skills/cli-external-orchestration/cli-*/manual-testing-playbook/stress/"
      - ".opencode/skills/cli-external-orchestration/manual-testing-playbook/fanout-stress/"
      - "checklist.md"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The stress harness is hermetic: PATH shims inject faults without provider access."
      - "All six adapters and fan-out have independent stress files."
      - "The validator proves 98 tests map bijectively to 98 playbooks."
      - "The program range changes no shipped adapter, scheduler, or config file."
      - "The fatal containment path restores HEAD and rejects the violating lineage."
      - "Leaf validation has Errors: 0; the global parity probe still exits non-zero."
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
| **Status** | Complete |
| **Level** | 3 |
| **Completion** | 100% (47/47 checklist items) |
| **Implemented Subjects** | six CLI adapters plus fan-out |
| **Coverage Surface** | 7 Vitest files, 133 tests, 98 indexed cells, 98 playbook snippets |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

The implementation delivers a hermetic, hang-safe stress program for `cli-codex`, `cli-opencode`, `cli-pi`, `cli-claude-code`, `cli-devin`, `cli-cursor`, and the fan-out scheduler. Deterministic PATH shims exercise real command-building and process boundaries without provider credentials. Live probes remain opt-in and become specific dependency skips when unavailable.

Delivered artifacts include:

- Seven independently runnable Vitest files under `runtime/tests/stress/cli-adapter/`.
- A 14-row × seven-subject matrix with 98 implemented, named cells.
- Shared bounded-process, worktree, live-preflight, and adapter fixtures.
- Fourteen snippets in each of six adapter stress directories and fourteen fan-out snippets.
- A validator that enforces exact test/playbook bijection, required evidence sections, triage language, and zero missing, duplicate, or orphan cells.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/tests/stress/cli-adapter/*.vitest.ts` | Created | Six adapter suites plus fan-out scheduler coverage |
| `runtime/tests/stress/cli-adapter/{fixtures,shims}/` | Created | Hermetic fault injection, process bounds, worktree isolation, and preflight |
| `runtime/tests/stress/cli-adapter/matrix-manifest.ts` | Created | 98 named test/playbook cells |
| `runtime/tests/stress/cli-adapter/validate-playbook-package.cjs` | Created | Matrix/test/playbook bijection and content validation |
| `cli-external-orchestration/cli-*/manual-testing-playbook/stress/` | Created | 84 adapter operator snippets |
| `cli-external-orchestration/manual-testing-playbook/fanout-stress/` | Created | 14 fan-out operator snippets |

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Program commits delivered the foundation, five additional adapters, fan-out coverage, playbooks, the bijection validator, two adversarial-review remediations, and the final destructive-scope support test. Commit `5d953ef6b2` makes transport-missing discrimination and max-iterations enforcement behaviorally meaningful; commit `eb87c7e2cf` proves fatal write containment against a committed out-of-scope file.

The shipped adapters, fan-out scheduler, executor configuration, and registries remain read-only contracts. The program-range diff from `07bd8e9e4e` through `eb87c7e2cf` contains 23 stress-tree files and 98 stress playbooks, with zero changes under `runtime/lib`, `runtime/scripts`, or runtime/package configuration.

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
| Aggregate stress suite | Pass | 7 files; 133 passed + 7 gated-live skips; exit 0 |
| cli-codex | Pass | 26 passed + 1 skip; exit 0 |
| cli-opencode | Pass | 18 passed + 1 skip; exit 0 |
| cli-pi | Pass | 19 passed + 1 skip; exit 0 |
| cli-claude-code | Pass | 17 passed + 1 skip; exit 0 |
| cli-devin | Pass | 18 passed + 1 skip; exit 0 |
| cli-cursor | Pass | 17 passed + 1 skip; exit 0 |
| fan-out | Pass | 18 passed + 1 skip; exit 0 |
| Destructive-scope containment | Pass | `fanout.vitest.ts:338-407`; restored HEAD, fatal violation, rejected lineage, exit 3 |
| Matrix bijection | Pass | 98 cells / 98 indexed tests / 98 indexed playbooks; 35 support tests; zero gaps, duplicates, or orphans |
| TypeScript | Pass | `npx --no-install tsc --noEmit --ignoreDeprecations 6.0`; exit 0 |
| Additive-only scope | Pass | 0 program-range changes under shipped runtime/config paths |
| Redaction and cleanup scans | Pass | 0 credential-pattern, operator-path, or blanket-pkill file hits |
| Strict packet validation | Blocked | Errors: 0 / Warnings: 0 / RESULT: PASSED, but wrapper exit 2 from global `COMMAND_TREE_PARITY` exit 1 |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Global command-mirror parity (out-of-scope, already fixed on main)**: the strict wrapper exits 2 because repository-wide `.claude/commands` mirrors are stale and `.cursor` has an extra hook — drift already fixed on origin/skilled/v4.0.0.0 that this Aug-14 fork predates (36 files differ). This additive leaf changes none of those paths, and its own validation is Errors: 0 / Warnings: 0 / RESULT: PASSED; the branch inherits the fix on rebase/merge.
2. **Direct-children kill discipline**: cli-codex intentionally reaps the captured PID and direct children without blanket process matching; the suite preserves unrelated processes.
3. **Gated live probes**: real CLI/auth probes are opt-in; the default hermetic gate records seven specific dependency skips.

<!-- /ANCHOR:limitations -->
