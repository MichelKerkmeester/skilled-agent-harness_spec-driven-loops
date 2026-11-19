# Deep Review Report: OpenCode v1 removal (branch worktrees/477-opencode-v1-removal)

## 1. Executive Summary

- **Verdict: FAIL.** No P0 findings. The verdict is FAIL because the required `coverage` terminal gate failed at the stop (`traceability-incomplete`: the core `checklist_evidence` protocol finished `partial`). Two active P1 findings and one open search-debt item would by themselves give CONDITIONAL.
- **hasAdvisories:** false (the verdict is not PASS).
- **Counts the verdict used** (`review-verdict.cjs` over the refreshed registry): active P0 = 0, active P1 = 2, active P2 = 7, search debt = 1, failed required gates = `coverage`.
- **Adversarial self-check:** both active P1 findings were re-read against source and **confirmed** at P1. No downgrades and no false positives, so no adjudication rows were appended.
  - DR4-P1-001: `dualPlugin` returns `{ id, setup }` at `.opencode/plugins/lib/v2-bridge.js:593`; `.vibe/plugins/repo-guards/session-cleanup.mjs:51` and `:60` still call `sessionCleanupPlugin.server(...)`; `runGuard` at `.vibe/plugins/repo-guards/lib/hook-io.mjs:112-123` catches the TypeError and sets exit code 0.
  - DR3-P1-001: `003-v1-docs-and-playbooks-sweep/acceptance-criteria.md:57` records AC-004 as met with live evidence, while `003-v1-docs-and-playbooks-sweep/implementation-summary.md:130` states "T019 and AC-004 are not met, so the phase is not Complete".
- **Scope:** 311 files touched by the branch's own commits ba9720f2f08, fc8b3a9a241, af87a2aa13a, 96e3d8a8f24, 3ef324c3de1, 4c72145b752, plus the a793f3ad733 conflict resolution in `cli-opencode/references/providers-and-models.md`. Changes merged in from origin/main were out of scope.
- **Run:** 5 iterations on executor cli-pi (`--model llmgateway/deepseek-v4.1-flash-1017 --thinking` from reasoning effort `max`), stop policy `max-iterations`, stop reason `maxIterationsReached`. Generation 2 (restart); generation 1 was refused at the cli-opencode containment preflight before any iteration and is archived under `review-archive/20261119T155645Z/`.

## 2. Planning Trigger

`/speckit:plan` **is required**: the verdict is FAIL, with two P1 findings and an incomplete core traceability protocol.

```json
{
  "Planning Packet": true,
  "triggered": true,
  "verdict": "FAIL",
  "hasAdvisories": false,
  "activeFindings": [
    {"id": "DR4-P1-001", "severity": "P1", "file": ".opencode/plugins/lib/v2-bridge.js:593", "findingClass": "dangling consumer of a removed export key", "refinedBy": "DR5-P1-002"},
    {"id": "DR3-P1-001", "severity": "P1", "file": "specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/acceptance-criteria.md:57", "findingClass": "closure-metadata inconsistency", "refinedBy": "DR5-P1-001"},
    {"id": "DR1-P2-001", "severity": "P2", "file": ".skilled/hooks/cli-dispatch/lib/opencode-version.mjs:17", "findingClass": "documentation-accuracy"},
    {"id": "DR1-P2-002", "severity": "P2", "file": ".skilled/skills/system-deep-loop/runtime/scripts/opencode-version.cjs:148", "findingClass": "duplicate-implementation"},
    {"id": "DR1-P2-003", "severity": "P2", "file": ".skilled/bin/skilled-loop:1217", "findingClass": "error-reporting"},
    {"id": "DR2-P2-001", "severity": "P2", "file": ".skilled/hooks/cli-dispatch/lib/opencode-version.mjs", "findingClass": "trust-boundary"},
    {"id": "DR3-P2-001", "severity": "P2", "file": "specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/acceptance-criteria.md:55", "findingClass": "checklist-evidence discipline"},
    {"id": "DR3-P2-002", "severity": "P2", "file": "specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/scratch/justified.txt:23", "findingClass": "evidence-artifact drift after rename"},
    {"id": "DR4-P2-001", "severity": "P2", "file": ".opencode/plugins/lib/v2-bridge.js:602", "findingClass": "export surface wider than its consumers"}
  ],
  "remediationWorkstreams": [
    "WS1 (P1): restore or replace the Vibe session-cleanup path that still calls the removed server key",
    "WS2 (P1): reconcile AC-004 / T019 closure state across phase 003 and the parent continuity",
    "WS3 (P2): version-resolver and loop-wrapper cleanups",
    "WS4 (P2): phase-003 acceptance-row and evidence-artifact hygiene"
  ],
  "specSeed": [
    "Add the Vibe session-cleanup adapter to the server-key removal's consumer list",
    "Decide the single truth for AC-004 and record it in acceptance-criteria.md, implementation-summary.md and the parent continuity"
  ],
  "planSeed": [
    "Port .vibe/plugins/repo-guards/session-cleanup.mjs to the { id, setup } shape and add a test that fails if it calls .server",
    "Widen the 001 AC-007 .server( check beyond .opencode/plugins/tests",
    "Amend AC-004 or record a waiver; regenerate the stale parent continuity"
  ],
  "findingClasses": ["dangling consumer of a removed export key", "closure-metadata inconsistency", "documentation-accuracy", "duplicate-implementation", "error-reporting", "trust-boundary", "checklist-evidence discipline", "evidence-artifact drift after rename", "export surface wider than its consumers"],
  "affectedSurfacesSeed": [".opencode/plugins/lib/v2-bridge.js", ".opencode/plugins/session-cleanup.js", ".vibe/plugins/repo-guards/session-cleanup.mjs", ".vibe/plugins/repo-guards/lib/hook-io.mjs", ".skilled/hooks/cli-dispatch/lib/opencode-version.mjs", ".skilled/skills/system-deep-loop/runtime/scripts/opencode-version.cjs", ".skilled/bin/skilled-loop", "070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/"],
  "fixCompletenessRequired": true
}
```

## 3. Active Finding Registry

| ID | Sev | Dimension | file:line | Title |
|---|---|---|---|---|
| DR4-P1-001 | P1 | correctness | `.opencode/plugins/lib/v2-bridge.js:593` | The removal dropped the dual-export `server` key while the Vibe session-cleanup hook still calls it, and the fail-open wrapper hides the break |
| DR3-P1-001 | P1 | traceability | `.../003-v1-docs-and-playbooks-sweep/acceptance-criteria.md:57` | AC-004 is recorded as both Met and Unmet inside the same phase packet |
| DR1-P2-001 | P2 | correctness | `.skilled/hooks/cli-dispatch/lib/opencode-version.mjs:17` | Retired-major comment promises a token (`unsupported`) the parser never returns (it returns `unknown`) |
| DR1-P2-002 | P2 | correctness | `.skilled/skills/system-deep-loop/runtime/scripts/opencode-version.cjs:148` | Two byte-identical version parsers with divergent failure semantics (the `.mjs` copy is at `:183`) |
| DR1-P2-003 | P2 | correctness | `.skilled/bin/skilled-loop:1217` | Loop wrapper drops the capability probe and always passes `--standalone`, so a v1 binary fails with a raw usage error rather than the resolver's install message |
| DR2-P2-001 | P2 | security | `.skilled/hooks/cli-dispatch/lib/opencode-version.mjs` | The bare-name probe runs a command-chosen `opencode<N>` binary from PATH before any rule decides |
| DR3-P2-001 | P2 | traceability | `.../003-v1-docs-and-playbooks-sweep/acceptance-criteria.md:55` | Phase-003 AC rows carry Waiver `-` while their printed verification command fails as written |
| DR3-P2-002 | P2 | traceability | `.../003-v1-docs-and-playbooks-sweep/scratch/justified.txt:23` | `justified.txt` justifies a feature-catalog path that no longer exists after the rename |
| DR4-P2-001 | P2 | maintainability | `.opencode/plugins/lib/v2-bridge.js:602` | Two of the four re-exported internals (`MAPPED_HOOKS`, `TOOL_ALIASES`) have no importer |

**Details for the P1s:**

- **DR4-P1-001.** *Evidence:* `v2-bridge.js:593` (`const plugin = { id, setup };`), `session-cleanup.js:375` (`export default dualPlugin('session-cleanup', sessionCleanupPlugin)`), `session-cleanup.mjs:51,60` (`await sessionCleanupPlugin.server({ worktree: projectDir })`), `hook-io.mjs:112-123`. *Impact:* on Vibe, the session-start warning and end-of-session cleanup legs never run, and the hook reports success. *Fix:* call `setup` (or the plugin factory) from the Vibe adapter, and add a regression test. *Refined by:* DR5-P1-002 (`v2-bridge.js:327`), which confirms this adapter is the only remaining runtime consumer. *scopeProof:* both the producer and the consumer change were made in ba9720f2f08.
- **DR3-P1-001.** *Evidence:* `acceptance-criteria.md:57`, `tasks.md:68`, `implementation-summary.md:43,45,89,130,133`, parent `spec.md:147`, `scratch/live.txt:55,71,76`. *Impact:* a resume or closure run reads contradictory closure state. One reading re-runs a gate that is done; the other trusts "all ACs Met" while the summary says the phase is not complete. *Fix:* choose one truth, then amend the AC row or record a waiver, and regenerate the stale parent continuity. *Refined by:* DR5-P1-001 (`implementation-summary.md:130`).

## 4. Remediation Workstreams

1. **WS1, P1, DR4-P1-001 (fix first).** This is a silent functional break in shipped hook code. Port `.vibe/plugins/repo-guards/session-cleanup.mjs` off `.server`, add a test, and widen the 001 AC-007 `.server(` check beyond `.opencode/plugins/tests`.
2. **WS2, P1, DR3-P1-001.** Reconcile AC-004 / T019 across phase 003 and the parent.
3. **WS3, P2 advisories.** DR1-P2-001, DR1-P2-002, DR1-P2-003, DR2-P2-001 and DR4-P2-001.
4. **WS4, P2 advisories.** DR3-P2-001 and DR3-P2-002.

## 5. Spec Seed

- The phase-001 consumer inventory for the `server` key must include `.vibe/plugins/repo-guards/`.
- Phase 003 needs one recorded state for AC-004: Met with evidence, or Unmet with a waiver. Today both are recorded.
- Rows whose printed verification command no longer passes as written need the formal Waiver form that 001 AC-007 uses.

## 6. Plan Seed

- T1: rewrite the Vibe session-cleanup adapter to the `{ id, setup }` contract; add a test asserting that no repo consumer reads `.server`.
- T2: amend `003/acceptance-criteria.md` AC-004 or `003/implementation-summary.md` §Known Limitations; regenerate the parent `spec.md` continuity.
- T3: align the `SUPPORTED_FAMILIES` comment with the parser, or return `unsupported`; deduplicate the two `parseOpencodeVersion` copies.
- T4: restore a v1-binary guard message in `skilled-loop`; constrain the bare-name probe in the version resolver.
- T5: fix the AC-002/006/008 verification commands or waivers; update `scratch/justified.txt:23` to the renamed path; trim the unused `v2-bridge.js` exports.

## 7. Traceability Status

**Core protocols**
- `spec_code`: **pass**. The packet records the server-key removal in 001 AC-007, and the code, `ARCHITECTURE.md:123` and `README.md` state the surviving `{ id, setup }` shape (`001/acceptance-criteria.md:60`, `v2-bridge.js:593`).
- `checklist_evidence`: **partial** (this is the gating failure). All 28 AC rows across the three tables were swept. 26 Met rows carry a printed command and a dated result; 001 AC-007 is Superseded under ADR-001; 002 AC-008 is openly Unmet pending the operator push. Two defects keep it partial: the 001 AC-007 `.server(` check searches only `.opencode/plugins/tests`, and 003 AC-004 conflicts as described in DR3-P1-001.

**Overlay protocols:** recorded per iteration in `iterations/`; none produced a gating failure.

**AC_COVERAGE:** exempt. The review target is a file set, not a spec-folder target.

Resource Map Coverage Gate: skipped, because no `resource-map.md` existed at init. This run emitted `review/resource-map.md`.

## 8. Deferred Items

- `mirror_check_capability` (search debt SL-5-005, iteration 5): whether the mirror check compares bytes only was not verified (`003/acceptance-criteria.md:64`). It was deferred when the iteration budget ran out.
- The P2 advisories in WS3 and WS4.

## Dimension Expansion Map

- No divergent pivots: convergence mode `default`, stop policy `max-iterations`.
- Dimensions swept: correctness (iterations 1 and 4), security (2), traceability (3 and 5), maintainability (4).
- Remaining frontier: `mirror_check_capability`.

## 9. Search Ledger

- `searchCoverage.graphCoverageMode`: `graphless_fallback`.
- Required bug classes: `traceability_status_conflict` and `cross_runtime_contract_break` are covered; `checklist_evidence_scope` is not in the covered list.
- Ruled out: `cross_runtime_contract_multi_consumer`, `stale_plugin_count`, plus 13 ruled-out candidates in total (for example SL-001: fan-out native-lineage residue in `fanout-run.cjs` is guarded by two barriers that throw `inputError`, each with a test).
- Deferred: `mirror_check_capability`.
- **hasSearchDebt: true** (1 item). The verdict already counts it.

## 10. Audit Appendix

- **Convergence:** five iterations ran to the cap, and the stop decision was `maxIterationsReached`. Legal-stop gates recorded as blocked at the cap, as synthesis evidence: `dimensionCoverageGate`, `candidateCoverageGate`, `graphlessFallbackGate`. Terminal gates: evidence = pass, scope = pass, coverage = fail (`traceability-incomplete`). Graph convergence score at the end: 0.836.
- **Coverage:** all four dimensions covered.
- **Per iteration:**

| Iteration | Focus | P0/P1/P2 | newFindingsRatio | Dispatch exit | verify-iteration |
|---|---|---|---|---|---|
| 1 | correctness (inventory) | 0/0/3 | 1.0 | 0 | OK |
| 2 | security | 0/0/1 | 1.0 | 0 | OK |
| 3 | traceability | 0/1/2 | 1.0 | 0 | OK |
| 4 | maintainability (+ correctness) | 0/1/1 | 1.0 | 0 | OK |
| 5 | traceability (finishing checklist_evidence) | 0/2/0 | 0.5 | 0 | OK |

- **Cross-reference appendix**
  - *Core Protocols:* `spec_code` pass; `checklist_evidence` partial.
  - *Overlay Protocols:* see the per-iteration `traceabilityChecks` in `iterations/iteration-00N.md` and `deltas/iter-00N.jsonl`.
- **Sources reviewed:** the 311 scope files in `deep-review-config.json#reviewScopeFiles`. Per-iteration file lists are in `deltas/`.
