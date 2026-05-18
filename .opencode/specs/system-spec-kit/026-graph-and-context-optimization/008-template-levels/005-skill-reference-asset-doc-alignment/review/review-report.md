# Deep Review Report: 005 skill references assets alignment

## Executive Summary

- **Verdict:** CONDITIONAL
- **Stop reason:** maxIterationsReached
- **Iterations:** 5
- **Active findings:** P0=0, P1=1, P2=4
- **hasAdvisories:** true
- **Review target:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/005-skill-reference-asset-doc-alignment`
- **Primary scope:** 20 phase-ledger files from implementation commit `e60b095416`, plus implementation-context checks against templates, scripts, validators, command YAML, and runtime mirrors.

The review completed all configured implementation-focused dimensions: implementation-spec alignment, code correctness, template-rendering correctness, validator coverage, and cross-runtime mirror consistency. The only required remediation is one P1 defect in the deep-review iteration prompt pack; the remaining findings are advisory P2 documentation/traceability precision gaps.

## Planning Trigger

`/spec_kit:plan` is required before treating this review as a pass because one active P1 remains.

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": true,
  "activeFindings": {
    "P0": 0,
    "P1": 1,
    "P2": 4
  },
  "remediationWorkstreams": [
    "Fix prompt-pack review_core doctrine path for executor consistency",
    "Clean up advisory documentation and runtime mirror wording drift"
  ],
  "specSeed": [
    "Require all deep-review executor prompt packs to reference an existing review doctrine path.",
    "Add parity checks so validation references and runtime mirrors stay aligned with generated/registry-backed sources."
  ],
  "planSeed": [
    "Update .opencode/skills/sk-deep-review/assets/prompt_pack_iteration.md.tmpl line 18 to use .opencode/skills/sk-code-review/references/review_core.md or a rendered runtime variable.",
    "Add a regression check that the prompt-pack review_core path exists.",
    "Optionally align mirror Path Convention wording and validation reference rule inventory."
  ],
  "findingClasses": {
    "cross-consumer": 2,
    "matrix/evidence": 3
  },
  "affectedSurfacesSeed": [
    "prompt pack",
    "cli-codex executor",
    "native rendered context",
    "validation references",
    "runtime mirrors"
  ],
  "fixCompletenessRequired": true
}
```

## Findings

### P0 Findings

None.

### P1 Findings

1. **P1-001: Iteration prompt pack points executor contexts at a non-existent review doctrine path**  
   - **Evidence:** `.opencode/skills/sk-deep-review/assets/prompt_pack_iteration.md.tmpl:18` instructs executors to load `.agents/skills/sk-code-review/references/review_core.md`, while `.opencode/agents/deep-review.md:273` uses the existing `.opencode/skills/sk-code-review/references/review_core.md` path. The auto YAML renders and dispatches this prompt pack through native and CLI executor paths at `.opencode/commands/spec_kit/assets/spec_kit_deep-review_auto.yaml:638-680`.
   - **Impact:** Non-native executor severity classification can diverge or fail to load the required doctrine.
   - **Recommendation:** Replace the prompt-pack path with `.opencode/skills/sk-code-review/references/review_core.md` or render a runtime-resolved existing path.
   - **Finding class:** cross-consumer
   - **Affected surfaces:** prompt pack, cli-codex executor, native rendered context, severity doctrine, post-dispatch validation

### P2 Findings

1. **P2-001: `--path` boundary docs omit the live `/tmp` test-fixture exception**  
   - **Evidence:** `.opencode/skills/system-spec-kit/references/workflows/execution_methods.md:119` and `.opencode/skills/system-spec-kit/references/workflows/quick_reference.md:137` say traversal outside the repo is rejected, while `create.sh` explicitly permits `/tmp`/`${TMPDIR}` test fixtures before repo-boundary rejection at `.opencode/skills/system-spec-kit/scripts/spec/create.sh:751`.
   - **Recommendation:** Clarify that normal targets must stay inside the repository, while `/tmp`/`${TMPDIR}` is reserved for test fixtures.

2. **P2-002: Lazy research document contract cannot be rendered through the shared contract-doc helper path**  
   - **Evidence:** `.opencode/skills/system-spec-kit/templates/manifest/spec-kit-docs.json:119` exposes `research/research.md` while mapping to `research.md.tmpl`; `.opencode/skills/system-spec-kit/scripts/lib/template-utils.sh:205` maps public doc names directly to `manifest/${template_name}.tmpl` except for phase-parent `spec.md`.
   - **Recommendation:** Expose document-template mapping to helper consumers or add an explicit `research/research.md -> research.md.tmpl` helper mapping and regression coverage.

3. **P2-003: Validation references are not registry-complete for the current validator surface**  
   - **Evidence:** `.opencode/skills/system-spec-kit/references/validation/validation_rules.md:16` claims complete rule coverage but omits current registry rules; `validate.sh` derives default rules from `.opencode/skills/system-spec-kit/scripts/lib/validator-registry.json` at `.opencode/skills/system-spec-kit/scripts/spec/validate.sh:357`, `:390`, and `:482`.
   - **Recommendation:** Generate or verify validation reference summaries from `validator-registry.json`.

4. **P2-004: Runtime mirrors re-label packaged mirror paths as canonical while YAML declares `.opencode/agents/deep-review.md` canonical**  
   - **Evidence:** `.opencode/commands/spec_kit/assets/spec_kit_deep-review_auto.yaml:71-72` names `.opencode/agents/deep-review.md` canonical; mirror Path Convention lines point to `.claude/agents/*.md`, `.gemini/agents/*.md`, and `.codex/agents/*.toml` at `.claude/agents/deep-review.md:27`, `.gemini/agents/deep-review.md:27`, and `.codex/agents/deep-review.toml:20`.
   - **Recommendation:** Reword mirror Path Convention lines to say they are packaged mirrors while `.opencode/agents/deep-review.md` remains the canonical reference path.

## Active Finding Registry

| ID | Severity | Dimension | Primary Evidence | Disposition |
|----|----------|-----------|------------------|-------------|
| P1-001 | P1 | cross-runtime-mirror-consistency | `.opencode/skills/sk-deep-review/assets/prompt_pack_iteration.md.tmpl:18` | active |
| P2-001 | P2 | implementation-spec-alignment | `.opencode/skills/system-spec-kit/references/workflows/execution_methods.md:119` | active |
| P2-002 | P2 | template-rendering-correctness | `.opencode/skills/system-spec-kit/templates/manifest/spec-kit-docs.json:119` | active |
| P2-003 | P2 | validator-coverage | `.opencode/skills/system-spec-kit/references/validation/validation_rules.md:16` | active |
| P2-004 | P2 | cross-runtime-mirror-consistency | `.claude/agents/deep-review.md:27` | active |

## Remediation Workstreams

1. **Required P1 fix:** Correct the deep-review iteration prompt pack's review doctrine path and add a path-existence regression.
2. **Advisory docs precision:** Clarify `create.sh --path` `/tmp` test-fixture exception and registry-complete validation reference coverage.
3. **Advisory rendering/mirror parity:** Add lazy research document mapping coverage and normalize mirror Path Convention wording.

## Spec Seed

- The deep-review executor prompt pack must not reference non-existent doctrine paths.
- The template-system docs should distinguish runtime-safe exceptions from normal repository-boundary guarantees.
- The validation reference surface should be registry-backed or registry-checked.
- Runtime mirrors should identify canonical source paths consistently with command/YAML surfaces.

## Plan Seed

- T001 Update `.opencode/skills/sk-deep-review/assets/prompt_pack_iteration.md.tmpl` line 18 to the existing `.opencode/skills/sk-code-review/references/review_core.md` path or a rendered runtime variable.
- T002 Add a regression test that fails when a prompt-pack doctrine path does not exist.
- T003 Update `execution_methods.md` and `quick_reference.md` to document `/tmp`/`${TMPDIR}` as test-fixture exceptions.
- T004 Add registry parity coverage for validation reference docs.
- T005 Decide whether helper rendering should support public lazy doc names like `research/research.md`.
- T006 Normalize mirror Path Convention language across Claude, Codex, and Gemini deep-review mirrors.

## Traceability Status

### Core Protocols

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | complete | Iterations 001, 003, and 004 compared spec/docs against implementation surfaces. |
| `checklist_evidence` | partial-complete | Iterations checked task/summary claims plus relevant tests; no direct docs-vs-registry parity test was found. |

### Overlay Protocols

| Protocol | Status | Evidence |
|----------|--------|----------|
| `skill_agent` | complete | Iterations 001 and 005 checked skill guidance, prompt pack, and executor invariants. |
| `agent_cross_runtime` | complete | Iteration 005 compared canonical and mirrored deep-review agents. |
| `feature_catalog_code` | notApplicable | No feature catalog files were in the phase ledger. |
| `playbook_capability` | notApplicable | No manual playbook files were in the phase ledger. |

## Deferred Items

- P2-001 through P2-004 can be batched after the required P1 fix unless the operator wants a single cleanup packet.
- `review/resource-map.md` emission is optional for this dispatch because no phase `resource-map.md` was present at initialization; iteration deltas still preserve reviewed file coverage.

## Audit Appendix

- **Iteration files:** `review/iterations/iteration-001.md` through `iteration-005.md`
- **Delta files:** `review/deltas/iter-001.jsonl` through `iter-005.jsonl`
- **State log:** `review/deep-review-state.jsonl`
- **Stop reason:** maxIterationsReached
- **Coverage:** 5/5 configured dimensions completed
- **JSONL final counts:** P0=0, P1=1, P2=4
- **Recovery note:** Iterations 002-005 returned recovery-ready content because direct LEAF artifact writing was unavailable; the command manager materialized markdown, JSONL, delta, and strategy artifacts under the approved review packet.
