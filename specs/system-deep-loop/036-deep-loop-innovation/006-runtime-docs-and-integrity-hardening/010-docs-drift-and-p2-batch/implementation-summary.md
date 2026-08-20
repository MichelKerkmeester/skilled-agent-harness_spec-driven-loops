---
title: "Implementation Summary: Batch the P2 Backlog and the Three Doc-Contract P1s"
description: "Closeout evidence for the 032 documentation-drift and P2 batch."
trigger_phrases:
  - "docs drift p2 batch"
  - "032 implementation summary"
importance_tier: "normal"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/006-runtime-docs-and-integrity-hardening/010-docs-drift-and-p2-batch"
    last_updated_at: "2026-08-18T23:59:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Reconciled packet docs to Complete against landed commit bf4f280ce7"
    next_safe_action: "None — T014 re-landed; packet deferrals closed"
    blockers: []
    key_files:
      - "implementation-summary.md"
      - "tasks.md"
      - "checklist.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary | v2.2 -->

# Implementation Summary: Batch the P2 Backlog and the Three Doc-Contract P1s

completion_pct: 100

## Metadata

<!-- ANCHOR:metadata -->
| Field | Value |
|---|---|
| **Spec Folder** | 010-docs-drift-and-p2-batch |
| **Completed** | 2026-08-07 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

## What Was Built

<!-- ANCHOR:what-built -->

Lane A now points duplicated facts at `mode-registry.json` and the playbook indices, derives the registry counts in `scripts/check-documentation-drift.cjs`, scans local links, checks benchmark report folders against the index, and derives command help from `COMMANDS` and `LEAF_BY_LOOP`. Lane B now uses code-unit ordering and frozen wave arrays without mutable casts, and persists convergence snapshots. All 29 findings are landed: 27 shipped in `bf4f280ce7`, and the two that adopt shared strict-gate helpers in the legacy research/review rollback gates (`F-031-01`, `F-031-02`) were re-landed on 2026-08-18 (see Known Limitations item 1).

Landed as `bf4f280ce7` on `skilled/v4.0.0.0`. The completion evidence below uses candidate SHA `9229cb8f3e281c9291e6d631237528bc755e6f4b`, the worktree HEAD at the start of implementation used for the focused checks.

### T001 confirmation and per-finding evidence

The finding is a hypothesis until its cited anchor is checked. T001 re-read all 29 anchors before edits: 25 were confirmed, one moved, and three were already fixed. The red checks named below failed against the pre-fix tree; the corresponding green checks pass on this tree.

| Finding | Status | Evidence / resulting work unit |
|---|---|---|
| F-038-02 | CONFIRMED | Research README corruption claim; corrected to fail-closed behavior. Probe: research README inspection plus drift docs check. |
| F-038-03 | CONFIRMED | Script contract omitted council; registry/script contract inventory now includes it. |
| F-038-06 | CONFIRMED | Council docs called advisory completion a gate; docs now record advisory semantics. |
| F-003-04 | MOVED | Live anchor is `.opencode/commands/deep/assets/deep-research-auto.yaml:610`; snapshot persistence flags added there. |
| F-033-04 | CONFIRMED | Empty report index beside four folders; index backfilled and folder/index check passes. |
| F-026-06 | CONFIRMED | Council scenario count was not tied to the index; docs now point to the authoritative 33-scenario index. |
| F-026-09 | CONFIRMED | Council roster omitted alignment; docs now point to the registry. |
| F-033-06 | ALREADY-FIXED | Cited alignment evidence link resolved at T001; no code change required. |
| F-001-02 | CONFIRMED | Alignment adapter inventory omitted `sk-doc-command`; docs now name the registry/scoper source. |
| F-026-02 | CONFIRMED | Same adapter drift as F-001-02; handled as one merge group. |
| F-038-04 | CONFIRMED | Unsupported `--convergence` help removed; supported threshold/window flags documented. |
| F-033-03 | CONFIRMED | Unconsumed fixture catalog path removed from improvement config. |
| F-033-05 | CONFIRMED | Skill benchmark profile/taxonomy were inert; scorer and renderer now load them. |
| F-026-07 | CONFIRMED | Improvement output claim narrowed to lane-specific roots. |
| F-001-03 | CONFIRMED | Research family/lane roster stale; points to the registry. |
| F-026-03 | CONFIRMED | Same roster drift as F-001-03; one merge group. |
| F-038-05 | CONFIRMED | Sibling roster drift; one merge group. |
| F-035-05 | CONFIRMED | Empty Code Graph section filled with the shared runtime integration contract. |
| F-026-08 | CONFIRMED | Unsupported external-adapter backend wording removed in favor of registry-defined backend kinds. |
| F-035-04 | CONFIRMED | Same backend-kind drift as F-026-08; one merge group. |
| F-002-03 | CONFIRMED | `localeCompare` ordering replaced by deterministic code-unit comparison; policy checks pass. The full authorized-ledger suite has one unrelated missing-fixture failure. |
| F-036-05 | CONFIRMED | Frozen wave collection mutable casts removed; wave immutability test and tsc pass. |
| F-031-01 | CONFIRMED · RESOLVED | Exact top-level checks already existed at T001; the re-land replaces both local `hasExactKeys` copies with the shared `mode-contracts` export, so the gates now consume `027`'s validator instead of duplicating it. |
| F-031-02 | CONFIRMED · RESOLVED | Malformed rollback rows now reject the evidence set through the shared `validateRows` instead of being silently filtered, proven by two added negative tests per gate that fail against the unfixed lib. |
| F-026-05 | CONFIRMED | Runtime README omitted alignment; consumer inventory now includes it. |
| F-001-01 | ALREADY-FIXED | Runtime scripts README had no removed parent link at T001. |
| F-026-01 | ALREADY-FIXED | Same resolved link state as F-001-01. |
| F-032-07 | CONFIRMED | Renderer help was retyped; it now derives command names from `COMMANDS`. |
| F-032-06 | CONFIRMED | Verify help was retyped; it now derives leaf names from `LEAF_BY_LOOP`. |

Merge groups collapsed: runtime scripts link; sk-doc-command adapter; family/lane roster; backend-kind wording. Authoritative sources: `mode-registry.json` for families/lanes/backends, `scoping.cjs` for adapters, playbook indices for scenarios, report folders for benchmark membership, and the command/leaf tables for help text.
<!-- /ANCHOR:what-built -->

## How It Was Delivered

<!-- ANCHOR:how-delivered -->
The implementation was kept in the assigned worktree, then landed as `bf4f280ce7` on `skilled/v4.0.0.0`. Red probes were run before each grouped fix, focused per-file suites and tsc were run after the fixes, and the drift checks were exercised against deliberate mismatches. The mode-gate shared-validator adoption (`F-031-01`, `F-031-02`) did not ship in `bf4f280ce7`; it was re-landed separately on 2026-08-18 on branch `worktrees/015-036-mode-gate-strict-validator` after the regression was reproduced as a negative control and fixed at the root.
<!-- /ANCHOR:how-delivered -->

## Key Decisions

<!-- ANCHOR:decisions -->
| Decision | Why |
|---|---|
| Keep registry and playbook indices authoritative | Duplicated prose cannot silently diverge when the check derives counts from those sources. |
| Keep council completion advisory | This preserves existing callers while making the documentation match the implementation. |
| Revert the shared strict-gate helper adoption in research/review rollback gates | Regressed 2 deep-review rollback-window evidence-counting tests; shipping a known regression was rejected in favor of reverting to origin and deferring the adoption. |
<!-- /ANCHOR:decisions -->

## Verification

<!-- ANCHOR:verification -->

| Check | Before | After |
|---|---|---|
| `node scripts/check-documentation-drift.cjs --mismatch` | FAIL (synthetic missing registry packet) | PASS on real tree without `--mismatch` |
| `node scripts/check-documentation-drift.cjs --report-mismatch` | FAIL (synthetic missing report index entry) | PASS on real tree with `--reports` |
| `node scripts/check-documentation-drift.cjs --links` | Broken-link finding existed in the cited tree | PASS, zero broken links |
| `verify-iteration.cjs --help` | Retyped unsupported `context` entry | PASS; help derives from `LEAF_BY_LOOP` |
| `render-command-contract.cjs --help` | Omitted a table-defined command | PASS; help derives from `COMMANDS` |
| Runtime tsc | Baseline rc 0 | rc 0 after edits |
| Wave focused suite | Mutable-cast finding reproduced | 1 passed, 15 skipped |
| Research/review rollback focused suites (shared-validator adoption attempt) | Legacy row handling finding reproduced | Adoption regressed 2 deep-review rollback-window evidence-counting tests (83 pass at origin baseline, 2 fail with the change); reverted, DEFERRED (not landed) |
| Authorized-ledger suite | Policy checks pass; unrelated fencing fixture is absent | 28 passed, 1 pre-existing failure |
| Council completion suite | Advisory semantics exercised | 12 passed |
| Skill benchmark suite | Existing unrelated route/metadata fixture failures remain | 50 passed, 7 failed; no failure is in the profile/taxonomy renderer assertions |
| Render command contract suite | Existing compiled-contract freshness failures | 12 passed, 4 allowed pre-existing failures |

The full runtime run was not used because the authored contract forbids the append-lock-hanging 168-file suite. The earlier grouped attempt was stopped after the known render-contract failures and hang; focused per-file checks above are the required receipts.
<!-- /ANCHOR:verification -->

## Known Limitations

<!-- ANCHOR:limitations -->

No `transition-authorization-gateway.ts` or other excluded surfaces were changed. The hook installer check still reports repository hook drift (`missing=8`, `command=8`, `orphaned=7`), which is environment/repository state outside this packet.

1. **`F-031-01`/`F-031-02` RESOLVED (re-landed 2026-08-18)** — The adoption of `027`'s shared strict-gate validator (`hasExactKeys`, `validateRows`) in the legacy `deep-research-rollback-gate/mode-gate.ts` and `deep-review-rollback-gate/mode-gate.ts` is complete. The original attempt regressed the rollback-window evidence count because it flipped the entire row predicate from filter to reject; that predicate conflated three separate concerns. The re-land splits them: structural row validity (token id, positive safe-integer epoch, sha256 certificate digest, declared authority-state and result members) now rejects the whole evidence set via the shared `validateRows`, while success and authentication selection stay a filter. Legal `incomplete`/`abstained` rows and well-formed rows absent from `authenticatedExecutions` are therefore excluded from the count rather than rejecting the set — which is exactly what the two evidence-counting tests assert.
<!-- /ANCHOR:limitations -->
