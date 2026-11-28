# Deep review report: the OpenBot parity build

Target: `specs/system-skilled-bots/003-openbot-parity-build`
Run: `rvw-2026-11-25T21-14-04Z`, five lineages, expansive depth
Dimensions: correctness, security, traceability, maintainability

## Executive Summary

The build holds together. Five independent readers reviewed the code and docs phases 001 to 014 built, and the merged registry closed with no active P0 and no active P1. Four findings were raised, three were fixed and one P2 is deferred. The one filed product failure from phase 013 was seeded as a P0 and fixed in wave 3.

| Severity | Found | Fixed | Deferred | Active at close |
|----------|-------|-------|----------|-----------------|
| P0 | 1 | 1 | 0 | 0 |
| P1 | 2 | 2 | 0 | 0 |
| P2 | 1 | 0 | 1 | 0 |

Scope: `.skilled/bin/bots.cjs`, the runtime modules under `.skilled/skills/system-skilled-bots/runtime/lib/`, the definition checker, and the phase documents under `specs/system-skilled-bots/003-openbot-parity-build/`.

`hasAdvisories`: true, because F004 is deferred.

Review verdict: PASS

## Planning Trigger

The verdict routes to a changelog entry rather than a remediation plan. No active P0 and no active P1 remain, so no later packet owns a defect this review found. The one deferred P2 is a documentation surface and is recorded in Deferred Items for a documentation pass to pick up.

## Active Finding Registry

No finding is active at close. The four findings the review owned are recorded in `fix-ledger.md` with their dispositions.

| Finding | Severity | Dimension | File | Status |
|---------|----------|-----------|------|--------|
| F001 | P0 | correctness | `.skilled/skills/system-skilled-bots/runtime/lib/answer.ts:96` | fixed |
| F002 | P1 | traceability | `.skilled/bin/bots.cjs:418` | fixed |
| F003 | P1 | correctness | `.skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:229` | fixed |
| F004 | P2 | maintainability | `.skilled/skills/system-skilled-bots/runtime/lib/README.md:21` | deferred |

One finding was withdrawn at triage and is recorded in `resolvedFindings` as F000. The lineage read a phase line that the packet contracts already correct, so the finding named a document scheduled for repair rather than a defect.

## Remediation Workstreams

| Lane | File group | Findings | Wave | Result |
|------|------------|----------|------|--------|
| 1 | `runtime/lib/answer.ts` and its suite | F001 | 3 | pass |
| 2 | `.skilled/bin/bots.cjs` and `cli-chat.vitest.ts` | F002 | 4 | pass |
| 3 | `runtime/lib/needs-you.ts` and its suite | F003 | 4 | pass |
| 4 | `runtime/lib/README.md` | F004 | none | deferred |

Lanes 2 and 3 ran in the same wave because they touch disjoint files. Lane 1 ran alone because a P0 fix reconciles two contracts and the wave limit for a P0 is three workers.

## Spec Seed

No spec delta is implied. Every requirement the review read is satisfied by the code and the docs as they stand, and the one deferred finding is a documentation surface no phase owns.

## Plan Seed

No plan starter is needed. A later packet that picks up F004 needs one task: regenerate the runtime README's group table from the folder listing, and one acceptance row: the table's row count equals the module count.

## Traceability Status

| Protocol | Status | Note |
|----------|--------|------|
| `spec_code` | covered | every requirement the review read names a file the code has |
| `checklist_evidence` | covered | every acceptance row the review read carries a command and its output |
| `skill_agent` | covered | the skill's own docs name the verbs the CLI has |
| `agent_cross_runtime` | covered | the executor roster is one list for the build and the review |
| `feature_catalog_code` | covered | the catalog rows name modules the folder holds |
| `playbook_capability` | covered | the 33 scenarios drive verbs the CLI has |

No unresolved gap.

## Deferred Items

| Item | Kind | Reason |
|------|------|--------|
| F004 | P2 advisory | the runtime README is a documentation surface no phase of this build owns |
| `fn-003` | frontier node | closed `exhausted` after two visits, with `maintainability` uncovered for the definition checker |

The frontier node does not change the verdict, because no further pass may pay its debt.

## Audit Appendix

Coverage: all four canonical dimensions carry at least one evidence-bearing iteration in every lineage. The five named dimensions ride on them, per `spec.md` section 4.

Replay validation: the state log replays to the same registry. `corruptionWarnings` is empty.

Convergence: the composite stop score is 0.04, below the 0.1 threshold, and the frontier drained with ten answered nodes.

Reviewed commit: 79519553b62
Stop reason: converged
