# Deep Review Report - sk-design Claude Parity

## 1. Executive Summary

Final verdict: CONDITIONAL. The completed 10-iteration deep review found 0 P0, 8 P1, and 3 P2 active findings across the sk-design Claude-parity packet, covering the hub manager, five mode packets, fourteen procedure cards, the md-generator backend, feature catalog surfaces, manual testing playbooks, and benchmark gate evidence. The headline risk theme is concentrated in the design-md-generator backend: correctness gaps in generated-design value provenance and transition parsing, output/artifact policy mismatches, CSS-context injection surfaces in generated report/preview artifacts, and one feature-catalog traceability mismatch around overwrite behavior.

## 2. Planning Trigger

```json Planning Packet
{
  "triggerReason": "8 open P1 findings require remediation",
  "recommendedNextSpec": ".opencode/specs/sk-design/010-sk-design-claude-parity-review-remediation",
  "affectedFiles": [
    ".opencode/skills/sk-design/design-md-generator/backend/scripts/build-write-prompt.ts",
    ".opencode/skills/sk-design/design-md-generator/backend/scripts/extract.ts",
    ".opencode/skills/sk-design/design-md-generator/backend/scripts/guided-run.ts",
    ".opencode/skills/sk-design/design-md-generator/backend/scripts/report-gen.ts",
    ".opencode/skills/sk-design/design-md-generator/backend/scripts/preview-gen.ts",
    ".opencode/skills/sk-design/design-md-generator/backend/scripts/proof.ts",
    ".opencode/skills/sk-design/design-md-generator/backend/scripts/css-analyzer.ts",
    ".opencode/skills/sk-design/design-md-generator/feature_catalog/report-preview/report-preview.md",
    ".opencode/skills/sk-design/design-md-generator/backend/tests"
  ],
  "severityBreakdown": {
    "P0": 0,
    "P1": 8,
    "P2": 3
  }
}
```

Top-level `.opencode/specs/sk-design/010-*` was not observed in the current spec-file glob; the proposed next packet avoids collision with existing `009` phase children.

## 3. Active Finding Registry

| ID | Severity | Title | File:Line | Confidence | Status |
|----|----------|-------|-----------|------------|--------|
| P1-001 | P1 | WRITE prompt omits component facts while requiring exact component values | `.opencode/skills/sk-design/design-md-generator/backend/scripts/build-write-prompt.ts:53` | 0.88 | active |
| P1-002 | P1 | md-generator output guard does not enforce the documented spec-folder or sandbox boundary | `.opencode/skills/sk-design/design-md-generator/backend/scripts/extract.ts:267` | 0.84 | active |
| P1-003 | P1 | Extracted live-site values enter the WRITE prompt without prompt-data isolation | `.opencode/skills/sk-design/design-md-generator/backend/scripts/build-write-prompt.ts:18` | 0.80 | active |
| P1-004 | P1 | Report/preview catalog promises overwrite protection the scripts do not implement | `.opencode/skills/sk-design/design-md-generator/feature_catalog/report-preview/report-preview.md:59` | 0.86 | active |
| P1-005 | P1 | Guided run validates relative output against one cwd but executes extraction from another | `.opencode/skills/sk-design/design-md-generator/backend/scripts/guided-run.ts:149` | 0.87 | active |
| P1-006 | P1 | Dark-mode CSS variable values are injected into report style attributes without data isolation | `.opencode/skills/sk-design/design-md-generator/backend/scripts/report-gen.ts:533` | 0.84 | active |
| P1-007 | P1 | Transition shorthand parsing splits cubic-bezier commas into bogus transitions | `.opencode/skills/sk-design/design-md-generator/backend/scripts/css-analyzer.ts:224` | 0.82 | active |
| P1-008 | P1 | Report and preview renderers inject source-derived CSS token strings into style contexts without validation | `.opencode/skills/sk-design/design-md-generator/backend/scripts/preview-gen.ts:200` | 0.83 | active |
| P2-001 | P2 | Procedure-card schema lint is manual-only and outside the existing canon checker | `.opencode/skills/sk-design/shared/procedure_card_schema.md:75` | 0.82 | active |
| P2-002 | P2 | Byte-identical benchmark artifacts remain under two incompatible naming conventions | `.opencode/specs/sk-design/009-sk-design-claude-parity/012-routing-benchmark-rigor/decision-record.md:253` | 0.86 | active |
| P2-003 | P2 | Focused extraction modules mostly have no real test files | `.opencode/skills/sk-design/design-md-generator/backend/tests/a11y-extract.test.ts:8` | 0.89 | active |

Final adversarial self-check result: P1-001 through P1-008 still hold against current source. No P1 was downgraded, escalated to P0, or marked resolved. The P1-002 plus P1-003 compound-risk path remains ruled out as P0 because live-site prompt content does not feed output path arguments or automatic write destinations.

## 4. Remediation Workstreams

### Seam A: Prompt Data and Component Facts

Findings: P1-001 and P1-003.

Proposed fix: add a data-only prompt encoder for all live-site-derived strings, then surface deterministic component facts or a pre-rendered Components section through that encoder. The writer prompt should explicitly label extracted facts as data, not instructions, and tests should include malicious or instruction-like font/text/component values.

Estimated blast radius: `build-write-prompt.ts`, component fact generation around `types.ts` and component extraction output, `build-write-prompt.test.ts`, and WRITE-phase documentation.

Fix type: code plus tests, with small doc alignment if the WRITE workflow wording changes.

Coupling: P1-003 must land before or with P1-001 so new component facts do not expand the prompt-injection surface.

### Seam B: Output and Artifact Policy

Findings: P1-002 and P1-005, with P1-004 policy overlap.

Proposed fix: create one shared output-policy resolver that resolves relative paths exactly once from the operator cwd, enforces either a current spec output path or an approved `/tmp/skd-*` sandbox, passes the resolved path to spawned commands, and owns overwrite or `--force` semantics for all fixed artifacts.

Estimated blast radius: `extract.ts`, `guided-run.ts`, `report-gen.ts`, `preview-gen.ts`, `proof.ts`, guided-run tests, backend README, extraction workflow docs, manual playbook sandbox wording, and the report/preview feature catalog if behavior is intentionally documented instead of guarded.

Fix type: code plus tests plus doc alignment.

Shared resolver note: a single output-policy resolver can close both P1-002 and P1-005, and can also provide the primitive needed to close P1-004's silent-overwrite mismatch.

### Seam C: Renderer CSS Value Safety

Findings: P1-006 and P1-008.

Proposed fix: add shared `.opencode/skills/sk-design/design-md-generator/backend/scripts/render-safety.ts` with property-specific CSS-value helpers for colors, lengths/radii, font-family, font-size, font-weight, line-height, shadows, URL attributes, and complete style attribute construction. Unsafe source-derived values should render as escaped text-only with warnings instead of being interpolated into CSS declarations.

Estimated blast radius: `report-gen.ts`, `preview-gen.ts`, new `render-safety.ts`, renderer tests, and fixtures for malformed dark-mode, typography, radius, and shadow values. P1-006's dark-mode injection lives in `report-gen.ts:533`. `css-analyzer.ts` is not the renderer sink, but it remains a nearby backend safety target in Seam D.

Fix type: code plus focused renderer tests.

### Seam D: Transition Parser Correctness

Finding: P1-007.

Proposed fix: replace `value.split(',')` in `css-analyzer.ts` with CSS-aware transition-list parsing, either by traversing the CSS value AST or by using a comma splitter that tracks parentheses depth. Add regression tests for `cubic-bezier(...)`, `steps(...)`, and multi-transition shorthands.

Estimated blast radius: `css-analyzer.ts`, `motion-extract.ts` validation expectations, and a new or expanded focused CSS analyzer test file.

Fix type: code plus tests.

### Seam E: Traceability Alignment

Finding: P1-004.

Proposed fix: choose one contract and make docs/code agree. Either implement output-exists guards or explicit `--force` behavior for `report.html`, `preview.html`, `proof-data.json`, and `proof.html`, or revise the feature catalog/playbook to state the scripts overwrite fixed artifact names in the chosen output directory.

Estimated blast radius: low to medium. Code path touches `report-gen.ts`, `preview-gen.ts`, `proof.ts`, and tests if guards are implemented; doc-only path touches `feature_catalog/report-preview/report-preview.md` and playbook wording.

Fix type: code or docs; code is recommended because the same shared output-policy resolver from Seam B can supply the guard.

## 5. Spec Seed

Suggested packet: `.opencode/specs/sk-design/010-sk-design-claude-parity-review-remediation`.

```markdown
# Feature Specification: sk-design Claude-Parity Review Remediation

## Objective

Remediate the active deep-review findings from the sk-design Claude-parity review so the packet can move from CONDITIONAL to PASS without expanding scope beyond the reviewed md-generator and traceability surfaces.

## Scope

1. Prompt-data/component facts: encode extracted data as non-instruction data and expose component facts safely.
2. Output/artifact policy: centralize output path resolution, spec/sandbox enforcement, and overwrite behavior.
3. Renderer CSS-value safety: add shared renderer sanitization for generated report/preview CSS contexts.
4. Transition parser correctness: parse comma-bearing timing functions without corrupting transition lists.
5. Traceability and advisories: align report/preview overwrite docs with behavior and decide whether to schedule the three P2 advisories.

## Acceptance

- P1-001 through P1-008 are fixed or intentionally downgraded with direct evidence.
- Tests cover each remediated bug class, including malicious prompt data, relative output cwd behavior, CSS-value style contexts, and cubic-bezier transition parsing.
- Documentation and feature catalog claims match the implemented behavior.
- No reviewed read-only design modes gain write or execution authority.
```

## 6. Plan Seed

Recommended ordering:

1. Implement Seam B output/artifact policy first because it unifies P1-002, P1-005, and most of P1-004. It should be one PR or one phase because the same resolver must be used consistently by extraction, guided-run, report, preview, and proof.
2. Implement Seam A prompt-data/component facts next. Sequence P1-003's encoder before P1-001's component facts so remediation does not widen the prompt-data injection surface.
3. Implement Seam C renderer CSS safety in parallel with Seam A only if separate owners avoid touching `build-write-prompt.ts`; otherwise run after output policy. This work shares renderer tests across `report-gen.ts` and `preview-gen.ts`.
4. Implement Seam D transition parser independently. It is a focused parser/test change and should not wait on output or prompt work.
5. Close Seam E traceability after the output/artifact policy decision. Prefer code alignment if Seam B adds guards; choose doc-only alignment only if the product intentionally allows overwrites.

Parallelizable lanes: Seam D is independent. Seam C can run beside Seam A if test fixtures are coordinated. Seam B and Seam E should be sequenced together because both define artifact write semantics.

## 7. Traceability Status

| Protocol | Status | Summary |
|----------|--------|---------|
| `spec_code` | covered | Iterations 2, 4, 5, 6, 7, 8, 9, and 10 checked live code against spec, docs, and backend claims. |
| `checklist_evidence` | covered | Iterations 4 and 5 checked Phase 007, Phase 010, Phase 012, and Phase 013 evidence; no new checklist-only defect remained. |
| `skill_agent` | covered | Registry, hub/mode SKILL contracts, command frontmatters, and procedure-card private guidance preserve expected mode behavior. |
| `feature_catalog_code` | covered | Feature catalog sampling covered all six packages; P1-004 remains the active feature-catalog/code mismatch. |
| `agent_cross_runtime` | not applicable | sk-design has no dedicated agent family beyond the shared design LEAF agent. |
| `playbook_capability` | partial | Procedure-card scenario structure maps to live capability, but live execution of every manual testing scenario was outside the review scope. |

Command projection parity was also covered in iteration 4 and remained aligned with the five-mode registry and tool-surface split.

## 8. Deferred Items

| ID | Advisory | Why P2, Not P1 |
|----|----------|----------------|
| P2-001 | Procedure-card schema lint is manual-only and outside the existing canon checker. | Current sampled cards conform; the risk is future drift when manual lint is skipped, not a current broken behavior. |
| P2-002 | Byte-identical benchmark artifacts remain under two incompatible naming conventions. | The duplicate benchmark evidence is documented and no consumer breakage was confirmed; this is cleanup/wayfinding debt. |
| P2-003 | Focused extraction modules mostly have no real test files. | The missing tests raise regression risk and reinforce P1 remediation needs, but the actionable release blockers are the confirmed implementation defects. |

## 9. Search Ledger and Audit Appendix

| Dimension | Status | Closing Iteration | Notes |
|-----------|--------|-------------------|-------|
| correctness | complete | 2, with revisits through 10 | Initial correctness pass found P1-001; later md-generator revisits found P1-005, P1-007, and final re-verification kept all P1s active. |
| security | complete | 3, with revisits through 8 and 10 | Security pass found P1-002 and P1-003; later renderer reviews found P1-006 and P1-008; compound P0 escalation was ruled out. |
| traceability | complete | 4 | Feature-catalog/report-preview mismatch became P1-004; command projection and checklist evidence were covered. |
| maintainability | complete | 5, with focused advisories through 7 | P2 advisories were recorded; shared remediation seams were identified without adding extra P1s. |

Audit facts:

- Total iterations: 10.
- Session ID: `2026-07-06T11:48:06.000Z`.
- Final counts: P0=0, P1=8, P2=3, resolved=0.
- Tool-call budget: per-iteration budget was 12 tool calls and 20 minutes; no budget breach was recorded in the strategy, registry, dashboard, or iteration narratives.
- Graph mode: code graph remained stale during review, so assertions used graphless fallback with direct reads, targeted globs, and exact grep evidence.
- Synthesis self-check: current source windows for P1-001 through P1-008 were re-read during synthesis; all eight still hold, and the final verdict remains CONDITIONAL.
