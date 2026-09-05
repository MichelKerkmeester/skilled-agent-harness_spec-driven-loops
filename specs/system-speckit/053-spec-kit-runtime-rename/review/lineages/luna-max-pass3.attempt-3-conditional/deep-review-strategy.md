---
title: Deep Review Strategy - system-spec-kit runtime rename
description: Inline ten-iteration review state for the detached luna-max-pass3 lineage.
version: 1.0.0
sessionId: fanout-luna-max-pass3-1788562574615-h6l4fh
---

# Deep Review Strategy - Session Tracking

## 1. Overview

Review the renamed `system-spec-kit/runtime` package and the bounded 453-file content-change scope for correctness, security, traceability, and maintainability. The target is read-only. Only this lineage directory is writable.

## 2. Execution contract

- Artifact root is bound directly to `review/lineages/luna-max-pass3`.
- All ten iterations execute inline in this session with `cli-codex`, model `gpt-5.6-luna`.
- Nested executor dispatch is satisfied by the current process and prohibited.
- `max-iterations` is the hard stop at iteration 10. Convergence signals before then are telemetry only.
- The configured convergence threshold is the supplied value `3`.
- Repository validation, build, generated-output, and continuity commands are not run because their writes would leave the authorized surface.

## 3. Topic and dimensions

The change renames the Spec Kit engine package from `system-spec-kit/mcp-server` and `@spec-kit/mcp-server` to `system-spec-kit/runtime` and `@spec-kit/runtime`, prunes dead dependencies, updates consumers, and preserves behavior.

| Dimension | Required coverage | Status at init |
|---|---|---|
| Correctness | package, workspace, entry point, build, path, and behavior invariants | covered, conditional |
| Security | path boundaries, hook process boundaries, dependency and transport residue | covered, advisory |
| Traceability | spec, plan, tasks, acceptance criteria, references, and live implementation | covered, conditional |
| Maintainability | names, documentation, tests, follow-on change safety, and stale seams | covered, conditional |

## 4. Files under review

The complete bounded list is `.opencode/specs/system-speckit/053-spec-kit-runtime-rename/scratch/review-scope.txt`. Iterations select explicit files from that list and record selection and search ledgers in the state and delta records.

## 5. Cross-reference status

### Core

| Protocol | Status | Note |
|---|---|---|
| `spec_code` | partial | Package and exact-residue checks pass, but the `chokidar` consumer claim remains unresolved. |
| `checklist_evidence` | partial | AC-010 and T009 remain open, and AC-006 overstates dependency evidence. |

### Overlay

| Protocol | Status | Note |
|---|---|---|
| `skill_agent` | notApplicable | Target is a package/spec folder, not a skill-agent contract. |
| `agent_cross_runtime` | notApplicable | No agent runtime implementation is in scope. |
| `feature_catalog_code` | notApplicable | Feature catalog is excluded by the target scope. |
| `playbook_capability` | partial | Council and playbook references are checked where listed in scope. |

## 6. Known context

- `spec.md` requires a behavior-preserving move, a live dependency manifest, updated consumers, and a ten-iteration review with no P0 or P1.
- `acceptance-criteria.md` marks AC-001 through AC-009 met and AC-010 unmet before this review.
- `tasks.md` leaves the ten-iteration review task open.
- The current checkout has no `.opencode/skills/system-spec-kit/runtime/dist` and the tracked `.opencode/skills/system-spec-kit/scripts/runtime` symlink points to `../runtime/dist`.
- The supplied freshness error was reproduced by a read-only direct call into the checker.
- The resource map is absent and emission is disabled.
- Preserved `system-skill-advisor/mcp-server` references and historical evidence are not runtime-rename defects.

## 7. Review boundaries

- Max iterations: 10
- Stop policy: `max-iterations`
- Convergence threshold: 3, telemetry only before iteration 10
- Severity threshold: P2
- Scope class: complex, 453 content-changed files from the bounded list
- Session: `fanout-luna-max-pass3-1788562574615-h6l4fh`
- Requested lineage mode: `auto`; resolved lineage mode: `new`
- Resource map: absent

## 8. Initial risk map

- Cross-package freshness traversal and build-order assumptions
- Hook target resolution and canonical path containment
- Manifest and lockfile ownership after the move
- Old identity residue in live operational documentation
- Test helper vocabulary and cache cleanup isolation

## 9. Next focus

The configured ten-iteration run is complete. No further review iteration is scheduled because `max-iterations` is the terminal stop policy. Implementation follow-up should address the two P1 findings before release.

## 10. Iteration coverage and convergence

| Iterations | Dimensions | New findings | Active totals after pass | Decision |
|---|---|---:|---:|---|
| 1, 5, 9 | correctness | 2 initial P1s, then 0 | P0 0, P1 2, P2 2 | continue |
| 2, 6, 10 | security | 1 initial P2, then 0 | P0 0, P1 2, P2 2 | continue |
| 3, 7 | traceability | 2 initial findings, then 0 | P0 0, P1 2, P2 2 | continue |
| 4, 8 | maintainability | 0 | P0 0, P1 2, P2 2 | continue |

The final convergence score is 0.04. Early convergence signals were telemetry only because the configured stop policy is `max-iterations`. The terminal reason is `maxIterationsReached`, not an early convergence synthesis.

## 11. Final finding register

### DR-001 - P1 correctness

The scripts freshness walker follows the dangling `scripts/runtime -> ../runtime/dist` link and calls `statSync()` on it, producing ENOENT before a classified missing-candidate result. Evidence: `.opencode/skills/system-spec-kit/scripts/lib/dist-freshness.cjs:217-235,795-800`.

### DR-004 - P1 correctness

The runtime manifest declares `chokidar`, but the bounded production source inventory found no import or require. The cited consumer is in the preserved `system-skill-advisor/mcp-server` package. Evidence: `.opencode/skills/system-spec-kit/runtime/package.json:41-45`, `.opencode/skills/system-spec-kit/runtime/tsconfig.json:17-23`, and `.opencode/specs/system-speckit/053-spec-kit-runtime-rename/implementation-summary.md:88-100`.

### DR-002 - P2 security

The two explicit Claude hook target overrides accept any existing absolute regular file. The normal install-anchored path is bounded, and the child process has bounded input, output, and timeout handling. Evidence: `.opencode/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts:37-68,91-128`.

### DR-003 - P2 traceability

Current operator, root, fixture, and fallback guidance retains generic MCP-server or `mcp_server` vocabulary while pointing at the runtime package. Exact old path and npm-name residue was separately ruled out. Evidence: `.opencode/bin/README.md:183`, `README.md:771`, and the runtime fixture and Devin references recorded in the iteration ledgers.

## 12. Synthesis constraints and handoff

- Final release-readiness state: in-progress with a CONDITIONAL verdict because two P1 findings require remediation.
- No P0 finding was observed, and both active P1 claims carry typed claim-adjudication packets with producer and consumer inventories.
- The resource map was absent at initialization and emission was disabled.
- Repository validation, build, generated-output, and continuity commands were not run because the user-bound write surface is this lineage directory only.
- The report is a read-only review handoff. It does not claim that the two P1s are fixed.
