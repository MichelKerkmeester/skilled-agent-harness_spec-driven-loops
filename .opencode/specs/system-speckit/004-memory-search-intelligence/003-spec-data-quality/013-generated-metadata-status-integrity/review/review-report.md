---
title: Deep Review Report — gpt-followup-audit
description: 10-iteration adversarial review (executor cli-opencode, openai/gpt-5.5-fast, reasoningEffort=xhigh) of two targets — create.sh parent-packet description.json corruption bug and independent audit of the shipped deriveStatus completion-evidence fix (phase 010, commits ea2bb09b7a/ca9bea9f78/b70a441388)
trigger_phrases:
  - "gpt followup audit review report"
  - "create.sh parent packet corruption review"
  - "deriveStatus fix independent audit review"
importance_tier: high
contextType: review
version: 1.0.0
---

# Deep Review Report — gpt-followup-audit

Session: `gpt-followup-audit-20260702T104647Z` | Executor: cli-opencode (`openai/gpt-5.5-fast`, reasoningEffort=xhigh) | Iterations: 10/10 (stopPolicy=max-iterations, no early convergence) | Spec folder: `.opencode/specs/system-speckit/004-memory-search-intelligence/002-spec-data-quality/047-generated-metadata-status-integrity`

## 1. Executive Summary

**Overall verdict: CONDITIONAL** (`hasAdvisories=true` — 1 active P2 alongside the P1s)

- **P0: 0 | P1: 6 | P2: 1** (active, deduplicated across all 10 iterations)
- No P0 (blocker) findings on either target.
- Review scope: two independent targets in system-spec-kit's generated-metadata subsystem —
  1. **Target 1**: `create.sh --phase --phase-parent` scaffolding bug that corrupts the PARENT packet's `description.json` (root-cause, determinism, blast-radius, minimal-fix review).
  2. **Target 2**: independent adversarial audit of the shipped `deriveStatus` completion-evidence fix (system-speckit/028 phase 010, commits `ea2bb09b7a`, `ca9bea9f78`, `b70a441388`) against `spec.md` REQ-001..REQ-005.
- All 10 iterations produced valid artifacts (iteration narrative + state.jsonl append + delta file); reducer ran clean after each with `--create-missing-anchors`.

## 2. Planning Trigger

`/speckit:plan` remediation **is required** — 6 active P1 findings need code/test/spec follow-up before this subsystem is release-clean, even though nothing is release-blocking (no P0).

```json Planning Packet
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": true,
  "activeFindings": {
    "P0": 0,
    "P1": 6,
    "P2": 1
  },
  "remediationWorkstreams": [
    "T1: guard create.sh parent description.json regeneration in append mode",
    "T1: scoped dry-run repair of already-corrupted phase-parent metadata (system-speckit/004-memory-search-intelligence/001-speckit-memory)",
    "T2: close the explicit-status-precedence bypass in deriveStatus ahead of the completion-evidence fallback",
    "T2: wire statusCompletionConsistencyEnforced through the MCP validation orchestrator",
    "T2: add orchestrator-level enforced-mode regression test",
    "T2 (P2, advisory): add direct parser edge-case regression tests"
  ],
  "specSeed": [
    "Amend create.sh phase-scaffolding contract to state append-mode must never regenerate the existing parent's description.json",
    "Amend phase-010 spec.md REQ-001/REQ-002/REQ-005 to explicitly state whether explicit frontmatter/table status (e.g. status: Done) is sufficient completion evidence on its own, or must also satisfy completion_pct/tasks.md evidence"
  ],
  "planSeed": [
    "Guard the parent generator call in create.sh with APPEND_TO_EXISTING_PARENT != true",
    "Build and dry-run a read-only classifier over .opencode/specs/**/description.json and specs/**/description.json using the isPhaseParent() direct-child rule, then regenerate only confirmed same-signature candidates",
    "Change deriveStatus so explicit complete-like frontmatter/table status routes through the same completion_pct/open-tasks evidence gate as the no-checklist fallback, or explicitly document why it is exempt",
    "Pass statusCompletionConsistencyEnforced (or equivalent) through mcp_server/lib/validation/orchestrator.ts call site",
    "Add an orchestrator-level test exercising validateFolder with the env flag enabled and a status/completion mismatch fixture",
    "Add direct parser tests for malformed/quoted completion_pct, comments-only tasks.md, whitespace-only implementation-summary.md, and derive-only concurrency"
  ],
  "findingClasses": [
    "cross-consumer",
    "correctness",
    "test-coverage-gap"
  ],
  "affectedSurfacesSeed": [
    "create.sh phase append mode",
    "generate-description.ts / dist generate-description.js",
    "description.json metadata identity (specFolder, parentChain)",
    "memory_search spec-folder filtering",
    "graph traversal parent lineage",
    "mcp_server/lib/graph/graph-metadata-parser.ts deriveStatus",
    "mcp_server/lib/validation/generated-metadata-integrity.ts resolveGeneratedMetadataIntegrity",
    "mcp_server/lib/validation/orchestrator.ts",
    "mcp_server/lib/config/capability-flags.ts SPECKIT_STATUS_COMPLETION_CONSISTENCY_GATE"
  ],
  "fixCompletenessRequired": false
}
```

## 3. Active Finding Registry

| ID | Sev | Title | Dimension | File:Line | Disposition |
|----|-----|-------|-----------|-----------|--------------|
| T1-P1-001 | P1 | Append-mode phase scaffolding overwrites the existing parent packet's `description.json` | correctness | `.opencode/skills/system-spec-kit/scripts/spec/create.sh:1046,1054,1310,1315` | active |
| T1-P1-002 | P1 | Existing phase-parent metadata already carries the same corruption signature (`001-speckit-memory`, both metadata roots) | correctness | `.opencode/specs/system-speckit/004-memory-search-intelligence/001-speckit-memory/description.json:3,20` (+ mirrored `specs/...` root) | active |
| T1-P1-003 | P1 | Already-corrupted phase-parent metadata needs a scoped dry-run repair pass after the writer fix | correctness | same as T1-P1-002 | active |
| T2-P1-001 | P1 | Explicit `complete`-like statuses bypass the new completion-evidence gate | correctness | `.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:1185-1195` (precedes the fixed fallback at `:1215-1239`) | active |
| T2-P1-002 | P1 | MCP validation orchestrator ignores the explicit status-completion enforcement flag | correctness | `.opencode/skills/system-spec-kit/mcp_server/lib/validation/orchestrator.ts:563-568` | active |
| T2-P1-003 | P1 | No orchestrator-level regression test covers the explicit status-completion enforcement flag | traceability | `.opencode/skills/system-spec-kit/mcp_server/tests/generated-metadata-integrity.vitest.ts:7-19,221-232` | active |
| T2-P2-001 | P2 | Edge-case completion-evidence behavior (malformed/quoted pct, comments-only tasks, empty summary, concurrency) is correct by code-reading but not pinned by direct parser tests | traceability | `.opencode/skills/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts:383-439` | active (advisory) |

### T1-P1-001 — Append-mode phase scaffolding overwrites an existing parent packet's `description.json`

**Evidence:** In `create.sh --phase --phase-parent <existing-packet> --phase-names <name> ... "<feature description>"`, append mode rebinds `FEATURE_DIR` to the existing parent (`create.sh:1046-1062`), then still calls the parent description generator with the append request's own description (`create.sh:1310-1317`: `node "$_DESC_SCRIPT" "$FEATURE_DIR" "$(dirname "$FEATURE_DIR")" --description "$FEATURE_DESCRIPTION" --level "phase"`). `generate-description.ts:77-90,108` persists `specFolder`, `description`, `keywords`, and `parentChain` from that call directly onto the parent's `description.json`. The separate child-metadata call (`create.sh:1351-1357`) targets `_child_path`, not the parent, and was explicitly ruled out as an alternative cause.
**Impact:** Every append-mode phase-scaffolding invocation against an existing parent overwrites that parent's canonical identity/description metadata with the new child phase's own text, and drops the track prefix from `specFolder` plus empties `parentChain` — matching the exact symptom reported (`"system-speckit/028-..." → "028-..."`, `parentChain: ["system-speckit"] → []`).
**Fix recommendation (minimal, per iteration 4):** Guard the parent generator call so it does not run when `APPEND_TO_EXISTING_PARENT=true`, e.g. `if [[ "$APPEND_TO_EXISTING_PARENT" != true && -f "$_DESC_SCRIPT" ]]; then ...; fi` around `create.sh:1310-1317`. Leaves new-parent scaffolding and the separate child-metadata write untouched. Add a regression fixture: append a phase under a copied existing parent and assert the parent `description.json` is byte-stable while the new child `description.json` is created.
**Disposition:** active, confidence 0.97 (iteration 10 adjudicated). **Deterministic**: confirmed for every successful append-mode invocation with an existing parent, non-empty feature description, present dist generator, and successful node execution — not conditional on a positional-vs-flag argument quirk or stale parent metadata (both were investigated in iteration 2 and ruled out).

### T1-P1-002 / T1-P1-003 — Existing corruption + required repair

**Evidence:** A read-only path-aware classifier (iteration 3) scanned 4918 `description.json` files across `.opencode/specs/**` and `specs/**`, classified 512 phase-parent packets by the same `isPhaseParent()` direct-child rule the codebase uses, and found exactly **2 physical files representing 1 logical packet** already carrying the identical corruption signature: `system-speckit/004-memory-search-intelligence/001-speckit-memory` — `specFolder` collapsed to `"001-speckit-memory"` (missing the `system-speckit/004-memory-search-intelligence/` prefix) and `parentChain: []` in both the `.opencode/specs/` and legacy `specs/` mirrors. The parent's own `spec.md` title/purpose still reads as a genuine parent-level summary (not overwritten with child text), so the confirmed corruption is identity/lineage metadata, not a full description-body overwrite for this specific packet.
**Also surfaced but NOT counted** as this same-signature blast radius: 332 "related metadata drift" records (mostly absolute-root `parentChain` values or `system-spec-kit` vs `system-speckit` path-spelling mismatches) — deferred as a separate, lower-confidence data-quality question rather than folded into the count.
**Impact:** Wrong/missing `description.json` metadata is documented framework-wide to make a packet "invisible to memory search and graph traversal" — this specific packet's parent lineage and canonical path filtering are already degraded.
**Fix recommendation:** After the writer fix ships, run a dry-run-first, scoped repair: reuse the same classifier, regenerate only confirmed same-signature candidates from the parent's own `spec.md` with a specs-root-relative base (not the corrupted stored data), verify `specFolder`/`parentChain`, then re-index.
**Disposition:** both active, confidence 0.91 / 0.86.

### T2 findings — see §7 Traceability Status and the REQ-by-REQ table below for full derivation.

## 4. Remediation Workstreams

**P1 (required before this subsystem is release-clean):**
1. T1-P1-001 — add the `APPEND_TO_EXISTING_PARENT` guard in `create.sh` around the parent generator call, plus a regression fixture.
2. T1-P1-002/003 — scoped, dry-run-first repair of `system-speckit/004-memory-search-intelligence/001-speckit-memory`'s `description.json` in both metadata roots, gated behind the writer fix landing first.
3. T2-P1-001 — close the explicit-status precedence bypass in `deriveStatus` (route explicit complete-like statuses through the same `completion_pct >= 100 && !openTasks` gate, or amend the spec to explicitly exempt them).
4. T2-P1-002 — wire `statusCompletionConsistencyEnforced` through `mcp_server/lib/validation/orchestrator.ts`.
5. T2-P1-003 — add an orchestrator-level regression test for the enforced-mode flag path.

**P2 (advisory, does not block):**
6. T2-P2-001 — add direct parser regression tests for the edge cases the shipped fallback already handles correctly by code-reading (malformed/quoted `completion_pct`, comments-only `tasks.md`, empty `implementation-summary.md`, derive-only concurrency).

## 5. Spec Seed

- `create.sh`'s phase-scaffolding contract should state explicitly: append-mode (`--phase-parent <existing>`) MUST NOT regenerate or mutate the existing parent's `description.json`; only new-parent creation and child-phase metadata generation may write description.json.
- Phase-010 `spec.md` REQ-001/REQ-002/REQ-005 should be amended to state explicitly whether an explicit frontmatter/table status of `Done`/`complete` is sufficient completion evidence on its own (current shipped behavior) or must additionally satisfy `completion_pct >= 100` and no open `tasks.md` items (the REQ-001/REQ-002 wording as currently read implies the latter, but the shipped code and its own test suite implement the former for explicit-status folders).

## 6. Plan Seed

1. `create.sh`: guard parent description regeneration behind `APPEND_TO_EXISTING_PARENT != true`; add shell/vitest fixture asserting parent `description.json` byte-stability across an append-mode phase creation.
2. Write a read-only, dry-run-first repair classifier (reuse `isPhaseParent()` direct-child rule) and run it once against the confirmed `001-speckit-memory` candidate; only regenerate after explicit review of the dry-run diff.
3. `graph-metadata-parser.ts`: change `deriveStatus` so the explicit-status branch (~line 1185-1195) either routes through the same completion-evidence fallback used at line 1215-1239, or the spec is amended and a comment/test documents the intentional precedence.
4. `mcp_server/lib/validation/orchestrator.ts`: pass `statusCompletionConsistencyEnforced` (sourced the same way `grandfather` is sourced today) into the generated-metadata-integrity call at `orchestrator.ts:598-633`.
5. Add `mcp_server/tests/generated-metadata-integrity.vitest.ts` coverage for `validateFolder`/orchestrator with `SPECKIT_STATUS_COMPLETION_CONSISTENCY_GATE` enabled and a status/completion-mismatch fixture.
6. (P2) Add `graph-metadata-schema.vitest.ts` cases pinning malformed/quoted `completion_pct`, comments-only `tasks.md`, whitespace-only `implementation-summary.md`, and concurrent `deriveStatus` calls.

## 7. Traceability Status

### Core Protocols

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | CONDITIONAL | Target 1: full call-graph traced (create.sh → generate-description.ts/.js → description.json), deterministic and reproduced in isolated analysis only (no live repo packet touched). Target 2: audited against `spec.md` REQ-001..REQ-005 line-by-line (iteration 5) — REQ-003/REQ-004 SATISFIED, REQ-001/REQ-002/REQ-005 PARTIALLY SATISFIED (explicit-status bypass, see T2-P1-001). |
| `checklist_evidence` | NOT APPLICABLE | This review audited code/spec/test claims directly, not a `checklist.md` for this review packet itself (phase-010's own checklist is the audit *subject*, not this review's evidence gate). |

### Overlay Protocols

| Protocol | Status | Evidence |
|----------|--------|----------|
| `skill_agent` | PASS | `deep-review` LEAF role and `sk-code-review/references/review_core.md` doctrine loaded before every severity call, every iteration. |
| `agent_cross_runtime` | NOT APPLICABLE | No cross-runtime agent-definition parity was in scope. |
| `feature_catalog_code` | NOT APPLICABLE | No feature catalog surface in scope. |
| `playbook_capability` | NOT APPLICABLE | No manual testing playbook capability in scope. |
| `claim_adjudication` | PASS | All 6 active P1 findings received typed Hunter/Skeptic/Referee packets (claim, evidenceRefs, counterevidenceSought, alternativeExplanation, finalSeverity, confidence, downgradeTrigger) in iteration 10. |
| `AC_COVERAGE` | EXEMPT | This is a review packet auditing another packet's shipped fix; not itself a lifecycle-active implementation spec folder with its own AC set. |

### REQ-by-REQ audit of phase-010 spec.md (Target 2, iteration 5)

| REQ | Status | Basis |
|-----|--------|-------|
| REQ-001 (`deriveStatus`'s `!checklistDoc` branch no longer returns `complete` from file-presence alone) | **PARTIALLY SATISFIED** | The no-checklist fallback is correctly patched (`graph-metadata-parser.ts:1215-1239`), but `deriveStatus` returns any normalized frontmatter/table status (e.g. `status: Done`) *before* that fallback runs (`:1185-1195`), so explicit-status folders still bypass the fix. The current test suite pins this bypass as expected behavior (`graph-metadata-schema.vitest.ts:510-520`). |
| REQ-002 (null-`completion_pct` edge case does not silently resolve to `complete`) | **PARTIALLY SATISFIED** | The null-pct fallback is correctly patched (`:1225-1233`, persisted via `:1356`), but the same explicit-status precedence path (`:1185-1195`) can produce a fresh `complete` from `status: Done` with no parseable `completion_pct` at all, ahead of the null-pct guard. |
| REQ-003 (new `validate.sh --strict` rule flags disagreeing `complete` folders) | **SATISFIED** | `assertStatusCompletionConsistency` correctly implements this (`generated-metadata-integrity.ts:179-233`), tested for absent pct, low pct, and open tasks (`generated-metadata-integrity.vitest.ts:221-249`). |
| REQ-004 (new rule ships non-blocking/report-mode by default) | **SATISFIED** | Flag default-off and resolver wiring verified correct (`capability-flags.ts:193-220`, `generated-metadata-integrity.ts:344-363`, `scripts/validation/generated-metadata-integrity.ts:81-101`), tested (`generated-metadata-integrity.vitest.ts:221-232,296-313`). |
| REQ-005 (regression tests pin both fixes) | **PARTIALLY SATISFIED** | Tests do cover the corrected fallback branch and validator report/enforced modes, but the suite also explicitly asserts the REQ-001/REQ-002 bypass as correct (`graph-metadata-schema.vitest.ts:510-520`), so it does not fully pin the completion-evidence contract as stated in the spec. |

### Severity-resolution regression check (iteration 7) — the other 7 pre-existing violation codes

`resolveGeneratedMetadataIntegrity`'s new per-code blocking logic for `STATUS_COMPLETE_EVIDENCE_MISMATCH` was traced against all 7 other violation codes (`STATUS_NOT_IN_ENUM`, `SPEC_FOLDER_PREFIXED`, `SOURCE_FINGERPRINT_MISSING`, `SOURCE_FINGERPRINT_MISMATCH`, `FILE_UNPARSEABLE`, `FILE_MISSING`, `SCHEMA_INVALID`) — **no regression found**; all 7 remain governed solely by the pre-existing blanket `grandfather` flag, confirmed by direct read of `generated-metadata-integrity.ts:323-364`. The new gate is additive and correctly scoped to the one new code. This is a genuine non-issue (not a finding).

## 8. Deferred Items

- 332 "related metadata drift" records surfaced during the Target 1 blast-radius scan (mostly absolute-root `parentChain` or `system-spec-kit`/`system-speckit` path-spelling mismatches) — a different signature from the confirmed corruption, deferred as a separate data-quality question, not counted in T1-P1-002's blast radius.
- Parser edge-case direct regression tests (T2-P2-001) — advisory, current behavior already verified correct by code-reading.
- Whether `mcp_server/lib/validation/orchestrator.ts` is a supported/reachable validation entrypoint at all (T2-P1-002/003's own downgrade trigger) — if maintainers confirm it is deprecated/unreachable, both findings downgrade to P2 parity cleanup.

## 9. Search Ledger

Reducer-owned `searchCoverage`/`candidateCoverage` (from `deep-review-findings-registry.json`, `candidateCoverage.byBugClass`): 40 bug-class candidates opened across the two targets; 27 covered-and-confirmed, 25 ruled out with cited evidence, 4 deferred (`blast-radius-signature` / `blast_radius_signature` / `related_metadata_drift` / `related_metadata_drift_not_same_signature`), 0 blocked. `hasSearchDebt: true` (3 deferred rows) — this does **not** change the verdict from CONDITIONAL since the deferrals are explicitly lower-priority classification/data-quality follow-ups, not unresolved P0/P1 evidence.

Representative ruled-out candidates (full list in `deep-review-findings-registry.json`):
- `child-writer-false-cause` (iter 1): child generator call confirmed to target `_child_path`, not the parent — direct read of `create.sh:1351,1355`.
- `argument_parsing_misalignment` (iter 2): no shift-style CLI parsing bug found; parent overwrite is deterministic regardless.
- `derive_status_file_presence_fallback` (iter 5): the *specific* file-presence-only fallback named in the original bug report was confirmed removed — but see T2-P1-001 for the *different*, still-open explicit-status-precedence bypass.
- `malformed_completion_pct` / `quoted_completion_pct` / `zero_checkbox_tasks_vacuous` / `derive_only_concurrency` / `empty_implementation_summary` (iter 6): all 5 edge cases verified handled correctly by direct code reading — downgraded to the single P2 advisory (T2-P2-001) for missing direct test pins, not treated as correctness bugs.

## 10. Audit Appendix

### Convergence Summary
- `stopPolicy: max-iterations` — all 10 iterations ran to completion by design; convergence score reached 1.0 by iteration 9-10 (telemetry only, not used to stop early).
- Dimension coverage: correctness, security, traceability, maintainability all covered (`dimensionCoverage: {correctness:true, security:true, traceability:true, maintainability:true}`).
- No `blockedStop` events; no `stuckRecovery` events; all 10 iterations recorded `status:"complete"`.

### Coverage Summary
- Target 1: iterations 1 (inventory/root-cause), 2 (determinism), 3 (blast-radius scan, 4918 files), 4 (minimal-fix proposal + repair plan).
- Target 2: iterations 5 (REQ-001..005 audit), 6 (edge cases), 7 (severity-resolution regression check), 8 (test-suite gap analysis).
- Cross-cutting: iteration 9 (coupling/flag-wiring re-check, no new ground), iteration 10 (adversarial claim adjudication + final verdicts, both targets).

### Sources Reviewed (primary)
- `.opencode/skills/system-spec-kit/scripts/spec/create.sh`, `scripts/spec-folder/generate-description.ts`, `scripts/dist/spec-folder/generate-description.js`, `scripts/spec/is-phase-parent.ts`, `scripts/utils/phase-classifier.ts`, `scripts/lib/phase-classifier.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts`, `mcp_server/lib/validation/generated-metadata-integrity.ts`, `mcp_server/lib/validation/orchestrator.ts`, `mcp_server/lib/config/capability-flags.ts`, `scripts/validation/generated-metadata-integrity.ts`
- `.opencode/skills/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts`, `mcp_server/tests/generated-metadata-integrity.vitest.ts`
- `.opencode/specs/system-speckit/004-memory-search-intelligence/002-spec-data-quality/047-generated-metadata-status-integrity/spec.md`, `implementation-summary.md`
- `git show ea2bb09b7a`, `git show ca9bea9f78`
- `.opencode/specs/system-speckit/004-memory-search-intelligence/001-speckit-memory/description.json` and `spec.md` (both `.opencode/specs/` and legacy `specs/` roots) — the confirmed corrupted packet

### Adversarial Verdicts (iteration 10, final)

> **Target 1 — is the bug deterministic, and how many packets are affected?**
> **CONFIRMED deterministic.** For every successful append-mode invocation (`--phase --phase-parent <existing>`) with a non-empty feature description and a present, working `generate-description` build, the code path deterministically reaches the parent `description.json` writer with `FEATURE_DIR` bound to the existing parent — this is not conditional on argument style, generator state, or stale parent metadata (all investigated and ruled out in iteration 2). **Confirmed existing blast radius: 1 logical packet** (`system-speckit/004-memory-search-intelligence/001-speckit-memory`), represented by 2 physical `description.json` files (`.opencode/specs/` + legacy `specs/` mirror), out of 512 phase-parent packets scanned across 4918 `description.json` files. Future blast radius is unbounded (any future append-mode invocation against any existing parent) until the guard lands.
>
> **Target 1 — is the proposed fix correct and minimal?**
> **CORRECT AND MINIMAL.** Guarding the parent generator call when `APPEND_TO_EXISTING_PARENT=true` addresses the wrong-target write while leaving new-parent scaffolding, child `description.json` generation, and phase-parent detection (`isPhaseParent()`) untouched. A separate, explicitly scoped dry-run repair pass is additionally required for the already-corrupted packet — the code fix alone does not retroactively repair it.
>
> **Target 2 — does the shipped fix have real correctness gaps?**
> **YES — 3 genuine P1 gaps, plus 1 P2 advisory; the P0-level defect described in the original bug report (file-presence-only fallback) is confirmed fixed.** (1) `deriveStatus` still lets explicit `status: Done`-style frontmatter/table values bypass the completion-evidence gate entirely, because that branch runs *before* the patched fallback — this is the same class of defect the fix was meant to close, just via a different code path the fix didn't touch. (2) The MCP validation orchestrator (`orchestrator.ts`) never passes the enforcement flag through to the new validator check, so `SPECKIT_STATUS_COMPLETION_CONSISTENCY_GATE=true` has no effect on that entrypoint. (3) No test exists for that orchestrator-level enforced-mode path. All 3 are P1, not P0, because the default rollout is report-mode/non-blocking either way. The severity-resolution logic for the other 7 pre-existing violation codes was traced end-to-end and found **not regressed** — the new gate is correctly additive.

STATUS=OK PATH=.opencode/specs/system-speckit/004-memory-search-intelligence/002-spec-data-quality/047-generated-metadata-status-integrity
