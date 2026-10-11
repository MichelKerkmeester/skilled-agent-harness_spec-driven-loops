# Deep Review Report

- **Target**: `specs/sk-code/011-sk-code-poinytail-based-refinement/016-residual-closeout/006-closeout-deep-review` (spec-folder, review of the 015 closeout product range `77f14f88d0^..d04df31790`)
- **Mode**: review | **Executor**: cli-pi `deepseek-v4.1-flash` (max effort) | **Lineage**: `review/lineages/dsflash-llmgw`
- **Session**: `fanout-dsflash-llmgw-1791717087028-ifv8d2`, generation 1, lineageMode new
- **Iterations**: 5 of 5 | **Stop reason**: `maxIterationsReached` (convergence telemetry only)
- **Completed**: 2026-10-11

---

## Executive Summary

- **Overall verdict: PASS** (hasAdvisories: true)
- **Active findings**: P0 = 0, P1 = 0, P2 = 4 (all advisories, none blocking)
- **Review scope**: 98 manifest files read or checked; the nine commits of the 015 closeout (hub voice rewrite, goal-criteria refresh, sk-git changelog, dispatch-guard escaped quotes + vitest scope, hook late-write coverage, compiled-route content check, review reducer missing config, OpenCode advisor surface hint, open-items ledger), across the four dimensions correctness, security, traceability and maintainability plus a closure replay.
- **Result headline**: every code fix behaves as its phase claims; all read-only repository gates pass from the final state (sync 55/55, route guard all fresh, contract drift OK, canaries 0 failures, skill-derived freshness 14/14, root metadata 14/14, package_skill --check for four skills, playbook topology PASS). Four advisories remain: a pre-existing dispatch-guard coverage gap, a surface-hint detector widening, target-packet derived-artifact staleness, and a corruption-diagnostics headline.

---

## Planning Trigger

`/speckit:plan` is **not required**: the verdict is PASS with advisories only, so the follow-on is `/create:changelog`. The four P2 items may be swept opportunistically; none blocks the phase.

```json
{
  "triggered": false,
  "verdict": "PASS",
  "hasAdvisories": true,
  "activeFindings": [
    {"id": "R1-P2-001", "severity": "P2", "dimension": "correctness", "file": ".skilled/hooks/dispatch/lib/dispatch-audit.mjs:326", "title": "A dispatch inside a later shell wrapper classifies as none, so the Pi preflight guard never inspects it"},
    {"id": "R2-P2-001", "severity": "P2", "dimension": "security", "file": ".opencode/plugins/system-skill-advisor.js:688", "title": "The workspace-surface hint treats any .skilled path component as the hub's own directory, wider than the canonical detector it cites"},
    {"id": "R3-P2-001", "severity": "P2", "dimension": "traceability", "file": ".skilled/skills/system-spec-kit/runtime/data/trigger-index.json", "title": "The target packet's derived artifacts are stale after its phase-doc edits; the trigger-index check fails and graph-metadata reports drift"},
    {"id": "R4-P2-001", "severity": "P2", "dimension": "maintainability", "file": ".skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:592", "title": "The strict missing-config failure is headlined as state-log corruption, so the operator hint misdiagnoses the new condition"}
  ],
  "remediationWorkstreams": [
    {"order": 1, "class": "pre-commit chore", "findingIds": ["R3-P2-001"], "action": "Run the write recipe Step 5 generators and regenerate the trigger index before the phase commit."},
    {"order": 2, "class": "guard coverage", "findingIds": ["R1-P2-001"], "action": "Extend the inspectDispatch unwrap to iterate every shell wrapper in a compound command."},
    {"order": 3, "class": "detector precision", "findingIds": ["R2-P2-001"], "action": "Anchor OPENCODE detection to the hub's own .skilled root instead of any path component."},
    {"order": 4, "class": "diagnostics wording", "findingIds": ["R4-P2-001"], "action": "Word the corruption headline for warning classes so a missing config is not reported as a corrupt state-log line."}
  ],
  "specSeed": [
    "Optional follow-up phase for the four P2 advisories; the P2 set is advisory-only and may be grouped into one housekeeping phase.",
    "If the guard coverage item is picked up, state that the guard classifies only statically provable dispatch shapes and the new work must not convert fail-open shapes into denials."
  ],
  "planSeed": [
    "Regenerate `description.json`, `graph-metadata.json` and `trigger-index.json` for the target packet, then rerun `generate-trigger-index.mjs --check` to exit 0.",
    "Add a second-wrapper case to the dispatch-audit deny matrix before changing the unwrap loop.",
    "Align `detectWorkspaceSurface` with `.skilled/skills/sk-code/shared/references/stack-detection.md` §2 and update the plugin surface table."
  ],
  "findingClasses": ["guard coverage gap", "detector divergence", "derived artifact drift", "diagnostics wording"],
  "affectedSurfacesSeed": [
    ".skilled/hooks/dispatch/lib/dispatch-audit.mjs",
    ".skilled/hooks/dispatch/pi/dispatch-preflight-lint.ts",
    ".opencode/plugins/system-skill-advisor.js",
    ".skilled/skills/system-spec-kit/runtime/data/trigger-index.json",
    ".skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs"
  ],
  "fixCompletenessRequired": false
}
```

---

## Active Finding Registry

### R1-P2-001 — P2 (correctness, guard coverage gap)

- **File**: `.skilled/hooks/dispatch/lib/dispatch-audit.mjs:326` (consumed at `.skilled/hooks/dispatch/pi/dispatch-preflight-lint.ts:236`)
- **Evidence**: `inspectDispatch(String.raw`bash -c 'true' ; bash -c "devin -p task </dev/null"`)` → `{"kind":"none"}`; the reverse order returns `{"kind":"direct","executor":"cli-devin"}`.
- **Impact**: a dispatch hidden in a later shell wrapper is never inspected by the Pi name-attribution lint.
- **Fix recommendation**: unwrap every wrapper in sequence, or iterate payload candidates, keeping the existing fail-open contract for genuinely unprovable shapes.
- **Disposition**: active advisory; pre-existing (the old single regex was also first-match-only).

### R2-P2-001 — P2 (security, detector divergence)

- **File**: `.opencode/plugins/system-skill-advisor.js:688` (`real.split(/[\\/]/).includes('.skilled')`)
- **Evidence**: predicate read; cited canonical rule `.skilled/skills/sk-code/shared/references/stack-detection.md` §2 requires the resolved path to land inside the hub's actual `.skilled/` directory; plugin test pins the component-level behavior for a hub folder only.
- **Impact**: a non-hub workspace whose path contains a `.skilled` component receives `surfaceHint: OPENCODE`; worst case a wrong advisor tie-break, never a denial or a code change.
- **Fix recommendation**: compare against the hub's own `.skilled` root rather than any path component; extend the surface table with a negative control.
- **Disposition**: active advisory.

### R3-P2-001 — P2 (traceability, derived artifact drift)

- **File**: `.skilled/skills/system-spec-kit/runtime/data/trigger-index.json`
- **Evidence**: `generate-trigger-index.mjs --check` exit 1, one stale document (`006-closeout-deep-review/goal.md`); `backfill-graph-metadata.js --dry-run` → `changed: 1`, `drift: [description, causal_summary]`.
- **Impact**: Gate 1 retrieval misses the packet's new goal trigger phrases until regeneration; repo freshness check fails today.
- **Fix recommendation**: run the write-recipe Step 5 generators and regenerate the index before the phase commit (`.skilled/skills/system-spec-kit/references/workflows/spec-folder-write-recipe.md:79-90`).
- **Disposition**: active advisory; expected pre-commit chore.

### R4-P2-001 — P2 (maintainability, diagnostics wording)

- **File**: `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:592`
- **Evidence**: strict reduction of a config-less folder throws STATE_CORRUPTION with the headline `parseJsonl detected 1 corrupt line(s) in <state log>` and the hint `to ignore corruption`, while the state log parsed clean; the preview names `deep-review-config.json`.
- **Impact**: operator misdiagnosis of the new missing-config condition; no behavioral change.
- **Fix recommendation**: word the headline for warning classes and keep the `--lenient` hint accurate.
- **Disposition**: active advisory.

---

## Remediation Workstreams

### P0 — none

### P1 — none

### P2 advisories (optional, ordered)

1. **R3-P2-001 — regenerate derived artifacts before the phase commit.** Run `generate-description.js`, `backfill-graph-metadata.js` and `generate-trigger-index.mjs`; confirm the index check exits 0.
2. **R1-P2-001 — broaden the shell-wrapper unwrap.** Add the second-wrapper deny-matrix case first; keep fail-open for unprovable shapes.
3. **R2-P2-001 — tighten surface detection to the hub's own `.skilled` root.** Update the plugin surface table with a negative control.
4. **R4-P2-001 — reword the corruption headline.** Keep file-level naming and the test assertion.

---

## Spec Seed

- A single housekeeping phase can carry all four advisories; none changes a public contract.
- State explicitly that the dispatch guard is a name-attribution lint over statically provable shapes, so its fail-open contract is preserved.

## Plan Seed

- Regenerate the three derived artifacts for the target packet and rerun their checks.
- Add regression cases before each fix: a two-wrapper compound command, a non-hub `.skilled` path, a config-less strict reduce message assertion.

---

## Traceability Status

### Core Protocols

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | pass | Nine phase claims verified against commits and current source; `compiled-route-sync.cjs --check` 55/55 and the reducer probe independently rerun. |
| `checklist_evidence` | pass | All real tasks checked in the 015 phase `tasks.md` files; the target phase is this review's own work in progress. |

### Overlay Protocols

| Protocol | Status | Evidence |
|----------|--------|----------|
| `skill_agent` | notApplicable | No skill/agent contract changed in the range beyond version bumps. |
| `agent_cross_runtime` | pass | Hermes copies matched the canonical versions at each release commit and today; `package_skill.py --check --strict` passes for sk-code, system-deep-loop, system-skill-advisor and system-spec-kit. |
| `feature_catalog_code` | notApplicable | Catalog hand-off entries only (`cli-classifier v0.8.1.0`, `mcp-tooling v1.8.1.0`), verified present. |
| `playbook_capability` | pass | `validate-playbook-topology.cjs` verdict PASS (26 valid, 0 blocked); the model-benchmark alias decision is consistent with contract drift OK. |

**AC_COVERAGE**: exempt — Level 1 target folder (no `checklist.md` lifecycle).

---

## Deferred Items

- Re-running the range's test suites (vitest 142/147, `node --test` 257, plugin 71, advisor batteries) is deferred to the orchestrator: the review loop is read-only and those suites spawn hook processes that write temp workspaces.
- The 016 phases 001-005 remain out of range by the review scope; only their effect on the reviewed files was considered.

---

## Dimension Expansion Map

- Completed pivots: 0 | Failed pivots: 0 | Audited overrides: 0
- Swept directions: none — the run used the risk-ordered first pass plus a closure replay.
- Remaining frontier: none recorded; the max-iterations cap was reached with all four dimensions covered.

---

## Search Ledger

*No search-depth state captured (legacy v1 record)* — this lineage emitted v1 iteration records; ruled-out directions are listed in the Audit Appendix.

---

## Audit Appendix

### Convergence summary

| # | Dimension | newFindingsRatio | P0/P1/P2 (new) | Status |
|---|-----------|------------------|----------------|--------|
| 1 | correctness | 1.0 | 0/0/1 | complete |
| 2 | security | 1.0 | 0/0/1 | complete |
| 3 | traceability | 1.0 | 0/0/1 | complete |
| 4 | maintainability | 1.0 | 0/0/1 | complete |
| 5 | closure replay | 0.0 | 0/0/0 | complete |

Stop: `maxIterationsReached` at 5 of 5; no convergence stop was consulted (stopPolicy max-iterations).

### Coverage summary

- Dimensions: correctness, security, traceability, maintainability — each with one full pass; closure replay re-read all active findings.
- Manifest coverage: 98/98 scope files read or checked; derived artifacts checked via their `--check`/`--dry-run` modes.

### Ruled-out claims

- Deep recursion in `inspectDispatch`, unbounded workspace cache, corrupt-config `readJson` behavior (iteration 1).
- Command injection via the advisor prompt, path traversal from `--check`, DoS via marker reads (iteration 2).
- Missing catalog changelog context, Hermes divergence, corpus-wide index drift (iteration 3).
- Vitest skip misclassification, cache growth, added deferral markers (iteration 4).
- Severity downgrade for a green verdict, state-log/delta disagreement, need for a sixth angle (iteration 5).

### Sources reviewed

- Range diff `77f14f88d0^..d04df31790` (nine commits) and the 98 manifest files.
- Phase docs for 001-009 of the 015 closeout; the 009 open-items ledger.
- Six release changelogs; Hermes mirrors; trigger index; packet graph-metadata.
- Read-only gates: `compiled-route-sync.cjs --check`, `compiled-route-guard.cjs`, `check-contract-drift.cjs`, `all-canaries.cjs`, `ci-skill-derived-freshness.cjs`, `ci-skill-root-metadata.cjs`, `package_skill.py --check`, `validate-playbook-topology.cjs`, `hvr_scan.py`.
