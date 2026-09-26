# Deep Review Report — mimo lineage

Lineage-local synthesis for `fanout-mimo-1790437845885-htqb7q` (cli-pi, `mimo-v2.6-pro`, high effort). The parent fan-out run merges this with the `deepseek` lineage via `fanout-merge.cjs`; per the cross-lineage contract, any active P0 in any lineage makes the merged verdict FAIL.

- **Review target**: `specs/system-skill-advisor/030-pi-skill-orchestrator-based-research-refinement/006-fanout-deep-review` (spec-folder)
- **Scope**: the 38 repo-relative paths in `goal-file-manifest.txt` (phases 2-5 of the advisor refinements plus the research-workflow fix), read against `../002-hook-deadline-and-diagnostics/spec.md` .. `../005-follow-up-fixes/spec.md`
- **Iterations**: 3 of 3, `stopPolicy: max-iterations`, `stopReason: maxIterationsReached`
- **Resource map**: `resource-map.md` absent at init — coverage gate skipped

<!-- REDUCER-OWNED: FINDINGS-REGISTRY:START -->
## 1. Executive Summary

- **Overall verdict: CONDITIONAL** — no active P0; one active P1 requires remediation sign-off
- **hasAdvisories**: true (six active P2 advisories)
- **Active findings**: P0=0, P1=1, P2=6
- **Review scope summary**: three dimension passes (correctness+inventory; security; traceability+maintainability) over the manifest slices — Pi `edit_lines` hash-verified edits, the advisor hook shims and daemon request path, the OpenCode plugin mirror, the deep-loop `step_convergence_report` close in both workflow families, and the phase specs/tests/docs triangle.

## 2. Planning Trigger

`/speckit:plan` is required before any fix lands: the verdict is CONDITIONAL and R1-P1-001 needs an operator severity call.

```json
{
  "Planning Packet": {
    "triggered": true,
    "verdict": "CONDITIONAL",
    "hasAdvisories": true,
    "activeFindings": [
      {"id": "R1-P1-001", "severity": "P1", "title": "edit_lines interior-hash verification is conditional, contradicting its stated invariant", "file": ".pi/extensions/pi-cache-optimizer/index.ts:8201", "dimension": "correctness"},
      {"id": "R1-P2-002", "severity": "P2", "title": "directive-dedup normalization never participates in dedup identity", "file": ".skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts:142", "dimension": "correctness"},
      {"id": "R1-P2-003", "severity": "P2", "title": "review-side step_convergence_report never folds lineage state logs", "file": ".skilled/commands/deep/assets/deep-review-auto.yaml:2407", "dimension": "correctness"},
      {"id": "R2-P2-001", "severity": "P2", "title": "the hook's advisor CLI child receives the full user prompt in its process arguments", "file": ".skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:224", "dimension": "security"},
      {"id": "R2-P2-002", "severity": "P2", "title": "shim nested deadline holds only when SPECKIT_CLAUDE_HOOK_TIMEOUT_MS is unset", "file": ".skilled/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts:102", "dimension": "security"},
      {"id": "R3-P2-001", "severity": "P2", "title": "interior-drift test exercises only the line_hashes path; minimal call unguarded and untested", "file": ".pi/extensions/pi-cache-optimizer/tests/hash-verified-edits.test.ts:150", "dimension": "traceability"},
      {"id": "R3-P2-002", "severity": "P2", "title": "close-out invariant program duplicated inline across the two auto workflows and already diverged", "file": ".skilled/commands/deep/assets/deep-review-auto.yaml:2260", "dimension": "maintainability"}
    ],
    "remediationWorkstreams": ["WS-1 edit_lines verification contract (R1-P1-001, R3-P2-001)", "WS-2 deep-loop close-out single-sourcing (R1-P2-003, R3-P2-002)", "WS-3 hook-path hardening (R2-P2-001, R2-P2-002)", "WS-4 dedup contract alignment (R1-P2-002)"],
    "specSeed": ["See §5"],
    "planSeed": ["See §6"],
    "findingClasses": ["silent-corruption", "contract-doc-mismatch", "convergence-telemetry", "local-disclosure", "availability-regression", "evidence-gap", "duplication-drift"],
    "affectedSurfacesSeed": ["pi-cache-optimizer edit_lines tool", "pi prompt-advisor hook", "claude shim deadline nesting", "hook CLI spawn", "deep-review/deep-research auto workflows", "hash-verified-edits tests"],
    "fixCompletenessRequired": false
  }
}
```

## 3. Active Finding Registry

| ID | Sev | Title | Dim | File:line | Evidence | Impact | Fix recommendation | Disposition | Class | Scope proof | Surface hints |
|----|-----|-------|-----|-----------|----------|--------|--------------------|-------------|-------|-------------|---------------|
| R1-P1-001 | P1 | `edit_lines` interior-hash verification is conditional, contradicting its stated invariant | correctness | `.pi/extensions/pi-cache-optimizer/index.ts:8201` | Interior loop gated on optional `line_hashes` (`:8205`); schema `required` omits it (`:7965-7975`); `execute` passes calls through (`:8478-8481`) | Silent wrong-line overwrite — the exact failure the capability exists to prevent | Require `line_hashes` for multi-line edits or verify interiors from a re-read; alternatively correct the comment + docs to the endpoint+line-count baseline | active; claim packet in `iterations/iteration-001.md` | silent-corruption | section 11 in scope per manifest | pi edit_lines tool, read annotation hook |
| R1-P2-002 | P2 | directive-dedup normalization never participates in dedup identity | correctness | `.skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts:142` | `map.get(key) === context` compares raw context; normalized parts (`:84-92`) used only as eligibility gate | Fail-open today; trap for maintainers | Compare normalized parts or reword the comment | active | contract-doc-mismatch | phase 3 changed file | pi prompt-advisor hook |
| R1-P2-003 | P2 | review-side `step_convergence_report` never folds lineage state logs | correctness | `.skilled/commands/deep/assets/deep-review-auto.yaml:2407` | Research sibling folds lineage logs (`deep-research-auto.yaml:2185-2188`); completed fan-out packets have no root state log | Fan-out close reports `totalIterations: 0` and vacuous registry invariants | Fold lineage logs in the review variant | active | convergence-telemetry | step_convergence_report only | deep-review-auto.yaml close |
| R2-P2-001 | P2 | hook's advisor CLI child receives the full prompt in argv | security | `.skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:224` | `--json JSON.stringify(payload)` carries the prompt; `subprocess.ts:204` uses stdin | Local disclosure of prompt content via `ps`/crash tooling | Move prompt to stdin (in-repo precedent) | active | local-disclosure | phase 2/3 changed file | hook CLI spawn |
| R2-P2-002 | P2 | shim nested deadline holds only when `SPECKIT_CLAUDE_HOOK_TIMEOUT_MS` is unset | security | `.skilled/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts:102` | Budget seeded below kill deadline only when env unset (`:102-106`); `SIGKILL` at 2,500 ms (`:114-116`) | Dropped fallback returns under an operator override | Clamp child budget to `min(env, CHILD_TIMEOUT_MS - margin)` | active | availability-regression | phase 2 changed file | claude shim deadline |
| R3-P2-001 | P2 | interior-drift test exercises only the `line_hashes` path | traceability | `.pi/extensions/pi-cache-optimizer/tests/hash-verified-edits.test.ts:150` | Every assertion supplies `line_hashes` (`:158`); no minimal-call case | The R1-P1-001 path cannot fail CI | Add a no-`line_hashes` interior-drift case once R1-P1-001 is fixed | active | evidence-gap | manifest lists the tests | edit_lines tests |
| R3-P2-002 | P2 | close-out invariant program duplicated inline across the two auto workflows and already diverged | maintainability | `.skilled/commands/deep/assets/deep-review-auto.yaml:2260` | ~200-line inline node programs in both auto YAMLs; observed divergence behind R1-P2-003 | Every close-out fix must be hand-ported twice | Extract one shared synthesis-report runtime script (`fanout-merge.cjs` pattern) | active | duplication-drift | step_convergence_report only | both auto workflows |

## 4. Remediation Workstreams

1. **WS-1 — `edit_lines` verification contract (P1 first)**: decide the contract (endpoints vs full-range), implement enforcement or documentation alignment, and extend `hash-verified-edits.test.ts` with the minimal-call interior-drift case. Covers R1-P1-001, R3-P2-001.
2. **WS-2 — deep-loop close-out single-sourcing**: extract the inline synthesis program into a shared runtime script and restore the lineage-log fold on the review side. Covers R1-P2-003, R3-P2-002.
3. **WS-3 — hook-path hardening**: move the hook's CLI prompt transport to stdin; clamp the shim's child budget under any env override. Covers R2-P2-001, R2-P2-002.
4. **WS-4 — dedup contract alignment (advisory)**: make `decidePiDirectiveDelivery` compare normalized brief parts or correct the comment. Covers R1-P2-002.

## 5. Spec Seed

- `../005-follow-up-fixes` successor or a new phase: `edit_lines` interior-verification contract decision + test case (WS-1).
- Deep-loop workflow phase: single-source the close-out program; update REQ-005-style acceptance to count lineage iterations in fan-out closes (WS-2).
- Hook phase: stdin prompt transport and unconditional deadline nesting as explicit acceptance criteria (WS-3).

## 6. Plan Seed

1. Decide and codify the `edit_lines` verification contract; implement; add the minimal-call interior-drift test; rerun `hash-verified-edits.test.ts`.
2. Extract `synthesis-report.cjs` (loop-type parameterized); switch both auto YAMLs' `step_convergence_report` to call it; add a fan-out close test asserting `totalIterations` equals summed lineage iterations.
3. Change `runCliRecommend` to carry the prompt over stdin; add a shim clamp test for `SPECKIT_CLAUDE_HOOK_TIMEOUT_MS >= CHILD_TIMEOUT_MS`.
4. Align `splitPiDirectiveBrief`/`decidePiDirectiveDelivery` (or reword the comment); add a headed-vs-headless dedup identity test.

## 7. Traceability Status

**Core protocols**

| Protocol | Status | Evidence | Unresolved drift |
|----------|--------|----------|------------------|
| spec_code | pass | Phase 2 R1/R3/R5/R11/R12 and phase 3 R2/R5 mechanisms located and matched to their motivating failure modes across both phase specs | none |
| checklist_evidence | n/a | Level 1 packet; no `checklist.md` (AC_COVERAGE exempt) | n/a |

**Overlay protocols**

| Protocol | Status | Evidence | Unresolved drift |
|----------|--------|----------|------------------|
| skill_agent | pass | Plugin mirror renders through the canonical compiled renderer; fallback heads mirror `render.ts` | none |
| agent_cross_runtime | pass | Claude handler shared by Codex/Cursor/Devin; runtime labels set in codex/devin shared shims (`:108`/`:117`) | none |
| feature_catalog_code | n/a | no catalog entries cover these surfaces | n/a |
| playbook_capability | n/a | no playbook claims these capabilities | n/a |

`AC_COVERAGE`: exempt (Level 1, no checklist.md). Resource-map coverage gate: skipped (`resource-map.md` absent at init).

## 8. Deferred Items

- R2-P2-001 severity escalation if this stack is ever deployed on shared hosts or managed CI (then P1).
- Full reads of the Codex/Cursor/Devin shim bodies (sampled; they inherit the Claude handler).
- Reducer `dimensionCoverage` block reports `false` for all four dimensions despite complete pass coverage: the reducer keys coverage off the projected state-log rows, and the fold's minimal iteration rows carry no `dimensions` array. Telemetry-only; recorded here rather than as a finding because it is an instance of R1-P2-003's projection-fidelity class.

## 9. Dimension Expansion Map

- Saturated directions (this lineage): `applyEditsToLines` splice ordering; write-queue serialization; IPC socket hijack; brief label injection; shell injection through child spawns; REQ-007 docs drift; manifest integrity.
- Pivots: none prepared (stop policy is `max-iterations`; no divergent mode).
- Remaining frontier: full cross-runtime shim reads; performance claims in `../003` REQ-006 (needs a debug-on window, per that spec's own dependency note); plugin-side in-flight dedup under concurrent sessions.
- This section records breadth only and does not alter the verdict.

## 10. Search Ledger

- `searchCoverage`: requiredBugClasses `silent-corruption, contract-doc-mismatch, convergence-telemetry, local-disclosure, availability-regression, privilege-boundary, injection-sink, evidence-gap, duplication-drift` — all covered across passes 1-3 (`graphCoverageMode: graphless_fallback`).
- `candidateCoverage`: covered superset of required classes; `searchDebt`: empty; `ruledOutCandidates`: splice ordering, write-queue races, socket hijack, label injection, shell injection, docs drift (each with cited evidence in `deltas/iter-00*.jsonl`); `cleanSearchProof`: per-pass `searchLedger[]` rows SL-001..SL-010 with cited `searchActions`.
- `hasSearchDebt: false`.

## 11. Audit Appendix

### Iteration Summary

| # | Dimension(s) | Ratio | P0/P1/P2 (new) | Status | Verdict |
|---|--------------|-------|----------------|--------|---------|
| 1 | correctness (+inventory) | 0.35 | 0/1/2 | complete | CONDITIONAL |
| 2 | security | 0.10 | 0/0/2 | complete | PASS |
| 3 | traceability + maintainability | 0.10 | 0/0/2 | complete | PASS |

Stop: iteration ceiling reached (3/3), `stopReason: maxIterationsReached`. Convergence telemetry: rolling avg last-2 ratios 0.10 (above the 0.08 band); stop policy is `max-iterations`, so convergence never gated the stop.

### Coverage

All four configured dimensions covered (correctness iter 1; security iter 2; traceability+maintainability iter 3). The reducer's `dimensionCoverage` block did not map these (projection-fidelity note in §8).

### Replay and Adjudication

- R1-P1-001 carries a typed claim-adjudication packet (`iterations/iteration-001.md`): claim, evidenceRefs, counterevidenceSought, alternativeExplanation, finalSeverity, confidence, downgradeTrigger.
- Adversarial self-check (hunter/skeptic/referee) on the single active P1: re-read at `index.ts:8195-8245` in iterations 1 and 3; skeptic position (endpoints+line_count may be the intended contract) recorded as the downgrade trigger; referee **confirms P1** pending the operator's contract decision.
- No active P0 — VERDICT_LOCK not engaged. Note the shape-only nature of the per-iteration verdict lines: the governing verdict here is recomputed from the registry (P1 present ⇒ CONDITIONAL).

### Sources Reviewed

38 manifest files (12 in depth across the three passes: pi-cache-optimizer §11, prompt-advisor.ts, render.ts, skill-advisor-cli-fallback.ts, skill-advisor-cli.ts, user-prompt-submit.ts ×2, plugin mirror, subprocess.ts, both auto YAML `step_convergence_report` blocks, the two phase specs, hook docs/ARCHITECTURE, 5 test files), plus sibling-lineage evidence from `specs/system-speckit/.../010-checklist-full-retirement/review/` for the fan-out close finding.

### Cross-Reference Appendix

**Core Protocols**: spec_code (pass, evidence in §7), checklist_evidence (n/a, Level 1). **Overlay Protocols**: skill_agent (pass), agent_cross_runtime (pass), feature_catalog_code (n/a), playbook_capability (n/a).
<!-- REDUCER-OWNED: FINDINGS-REGISTRY:END -->
