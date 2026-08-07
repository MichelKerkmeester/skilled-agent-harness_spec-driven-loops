---
title: Deep Review Iteration 006 - md-generator Deep Revisit
description: Correctness/security revisit for md-generator backend P1 remediation design.
---

# Deep Review Iteration 006 - md-generator Deep Revisit

## Dimension

Correctness and security deep revisit. This pass re-read the md-generator write/prompt pipeline and report/preview/proof writers in full, then tested whether the four active md-generator P1s share one root cause, whether they compound into P0, and whether the focused files contain additional correctness or security issues not already covered by iterations 2-4.

## Files Reviewed

| Area | Evidence | Result |
|------|----------|--------|
| Prior state and severity doctrine | `.opencode/specs/sk-design/009-sk-design-claude-parity/review/deep-review-strategy.md:66`, `.opencode/specs/sk-design/009-sk-design-claude-parity/review/iterations/iteration-002.md:32`, `.opencode/specs/sk-design/009-sk-design-claude-parity/review/iterations/iteration-003.md:32`, `.opencode/specs/sk-design/009-sk-design-claude-parity/review/iterations/iteration-004.md:34`, `.opencode/specs/sk-design/009-sk-design-claude-parity/review/iterations/iteration-005.md:22`, `.opencode/skills/sk-code/code-review/references/review_core.md:28` | Loaded the prior P1/P2 context and review severity contract before adjudicating new severity. Existing P1-001 through P1-004 were treated as active prior findings and not re-reported as new. |
| Code graph readiness | `code_graph_status`: freshness `stale`, reason `git HEAD changed: ba890674 -> 6d30c102; 18 file(s) have newer mtime than indexed_at; 29 tracked file(s) no longer exist on disk` | Structural graph assertions remain unavailable; this iteration used graphless fallback with direct file reads and targeted grep. |
| Extraction output path and writes | `.opencode/skills/sk-design/design-md-generator/backend/scripts/extract.ts:258`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/extract.ts:267`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/extract.ts:276`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/extract.ts:589`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/extract.ts:606`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/extract.ts:635` | Reconfirmed P1-002 output-boundary gap and P1-004 overwrite implications for fixed extraction artifacts. No new path traversal source was found in `extract.ts`. |
| Guided wrapper | `.opencode/skills/sk-design/design-md-generator/backend/scripts/guided-run.ts:120`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/guided-run.ts:149`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/guided-run.ts:168`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/guided-run.ts:189`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/guided-run.ts:215`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/guided-run.ts:222` | Found new P1-005: relative output paths are checked against one cwd but passed to extraction under another cwd, breaking the documented repo-root relative output workflow. Shell injection remains ruled out because `spawnSync` uses argv arrays. |
| WRITE prompt builder | `.opencode/skills/sk-design/design-md-generator/backend/scripts/build-write-prompt.ts:16`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/build-write-prompt.ts:53`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/build-write-prompt.ts:80`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/build-write-prompt.ts:93` | Reconfirmed P1-001 and P1-003 share the prompt/facts encoder seam. No single output-path remediation would fix these prompt-data issues. |
| Report, preview, and proof writers | `.opencode/skills/sk-design/design-md-generator/backend/scripts/report-gen.ts:627`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/report-gen.ts:650`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/preview-gen.ts:249`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/preview-gen.ts:252`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/proof.ts:301`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/proof.ts:436`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/proof.ts:442` | Reconfirmed P1-004 and that these scripts need the same output artifact policy as extraction/guided-run. No additional report/preview/proof P1 beyond the existing overwrite contract was confirmed. |
| Tests and docs for guided workflow | `.opencode/skills/sk-design/design-md-generator/backend/tests/guided-run.test.ts:5`, `.opencode/skills/sk-design/design-md-generator/backend/tests/guided-run.test.ts:14`, `.opencode/skills/sk-design/design-md-generator/backend/tests/guided-run.test.ts:26`, `.opencode/skills/sk-design/design-md-generator/backend/README.md:46`, `.opencode/skills/sk-design/design-md-generator/backend/README.md:61`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/cli.ts:13` | Counterevidence check for P1-005: tests only assert parsing/planning/unsafe skill path, while README/CLI docs explicitly require repo-root relative output paths. |

## Findings by Severity

### P0

None.

### P1

#### P1-005 [P1] Guided run validates relative output against one cwd but executes extraction from another

- File: `.opencode/skills/sk-design/design-md-generator/backend/scripts/guided-run.ts:149`
- Claim: The guided wrapper accepts and preflights the documented repo-root relative `--output .opencode/specs/.../output` path, but the actual extraction command runs from `BACKEND_ROOT` with the original relative path, so `extract.ts` resolves the same argument inside the skill/backend tree and rejects it as unsafe.
- Evidence: `runPreflight()` resolves `options.output` with `path.resolve(process.cwd(), options.output)` and reports that path in the output-path check. `buildPlan()` then passes the unnormalized `options.output` to `extract.ts`, and `runCommand()` executes that command with `cwd: BACKEND_ROOT`. The write-prompt artifact is later written using `path.resolve(process.cwd(), options.output, 'write-prompt.md')`, so the wrapper itself mixes caller-cwd and backend-cwd interpretations of the same relative output. Evidence: `.opencode/skills/sk-design/design-md-generator/backend/scripts/guided-run.ts:149`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/guided-run.ts:161`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/guided-run.ts:168`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/guided-run.ts:189`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/guided-run.ts:215`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/guided-run.ts:222`.
- Contract evidence: The backend README and CLI comments document running from repo root with relative `.opencode/specs/<track>/<packet>/output`, and expect `extract.ts` to write `tokens.json` into that directory. Evidence: `.opencode/skills/sk-design/design-md-generator/backend/README.md:46`, `.opencode/skills/sk-design/design-md-generator/backend/README.md:52`, `.opencode/skills/sk-design/design-md-generator/backend/README.md:61`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/cli.ts:13`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/cli.ts:16`.
- Counterevidence sought: I checked guided-run tests. They parse relative `.opencode/specs/demo/output`, assert planned step labels, and reject a skill-internal output path, but they do not assert that the extract command receives an absolute/caller-normalized output path or execute the cwd-sensitive plan. Evidence: `.opencode/skills/sk-design/design-md-generator/backend/tests/guided-run.test.ts:5`, `.opencode/skills/sk-design/design-md-generator/backend/tests/guided-run.test.ts:14`, `.opencode/skills/sk-design/design-md-generator/backend/tests/guided-run.test.ts:26`.
- Alternative explanation: Operators can avoid the failure by supplying an absolute output path. That workaround does not satisfy the documented repo-root relative workflow and does not fix the inconsistent path model inside the wrapper.
- Final severity: P1. This breaks the guided md-generator workflow for the documented relative spec-folder output path and belongs with the existing output-policy remediation seam. It is not P0 because it fails closed at extraction rather than writing outside the intended directory.
- Confidence: 0.87.
- Downgrade trigger: Downgrade to P2 if the guided wrapper contract is changed to require absolute output paths only and tests/docs are updated to reject repo-root relative paths; otherwise normalize once to an absolute output path before preflight, planning, extraction, write-prompt, validation, and report steps.
- Finding class: cross-consumer.
- Affected surface hints: `guided-run.ts`, `extract.ts`, `guided-run.test.ts`, backend README, P1-002 shared output path policy.
- Recommendation: Add a single output-path resolver/policy function that resolves relative paths from the operator cwd once, validates the spec/sandbox boundary, passes the resolved path to spawned commands, and uses the same resolved path for wrapper writes and tests.

### P2

None.

## Cross-Cutting Analysis

The four prior md-generator P1s do not share one root cause. They split into two remediation seams plus the new guided-run path-normalization defect:

- Prompt/facts seam: P1-001 and P1-003 require a data-only prompt encoder that can safely surface typography and future component facts. Evidence: `.opencode/skills/sk-design/design-md-generator/backend/scripts/build-write-prompt.ts:16`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/build-write-prompt.ts:80`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/build-write-prompt.ts:93`.
- Output/artifact seam: P1-002, P1-004, and P1-005 require one output policy that resolves cwd once, enforces the spec/sandbox boundary, and handles overwrite/force semantics before every artifact write. Evidence: `.opencode/skills/sk-design/design-md-generator/backend/scripts/extract.ts:267`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/guided-run.ts:149`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/report-gen.ts:650`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/preview-gen.ts:252`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/proof.ts:436`.

The compound P0 escalation from P1-002 plus P1-003 is not confirmed. Live-site-derived prompt text can influence the WRITE prompt content, but the reviewed scripts do not feed that text into `--output`, `outputDir`, or automatic arbitrary file-write paths. Output locations are operator CLI arguments before extraction/write-prompt generation. The combined risk remains important, but the evidence supports P1 remediation rather than P0.

## Traceability Checks

| Check | Status | Evidence |
|-------|--------|----------|
| `spec_code` | Covered with one new P1 | The md-generator guided workflow, README/CLI contract, and backend write behavior were checked against live code. P1-005 is a new guided-run correctness defect. |
| `checklist_evidence` | Not applicable this iteration | This pass focused on backend P1 remediation design, not phase checklist reconciliation. Prior checklist coverage remains covered from iterations 4-5. |
| `skill_agent` | Not applicable this iteration | No mode-routing or agent surface change was under review. |
| `agent_cross_runtime` | Not applicable | Strategy marks this N/A for sk-design. |
| `feature_catalog_code` | Covered for existing report/preview claim | P1-004 remains the report/preview catalog/code mismatch; no additional report/preview/proof finding was confirmed. |
| `playbook_capability` | Not executed | Manual playbook live execution remains outside this focused backend revisit. |

## Search Depth

Scope class is complex. This iteration used graphless fallback because code graph readiness was stale. Target selection followed the prompt: full reads of `extract.ts`, `guided-run.ts`, `build-write-prompt.ts`, `report-gen.ts`, `preview-gen.ts`, and `proof.ts`, plus targeted grep and direct reads of guided-run tests, backend README, and CLI comments. High-risk targets omitted this pass: non-focused backend modules such as `a11y-extract.ts`, `css-analyzer.ts`, `design-boundary-detect.ts`, `dark-mode-detect.ts`, `icon-detect.ts`, and `motion-extract.ts`, because they do not own the active prompt/output P1 remediation seams.

## SCOPE VIOLATIONS

None. No reviewed target source/spec files were modified.

## Verdict

CONDITIONAL for iteration 6: one new P1 finding was recorded. No P0 findings were discovered, and the specific P1-002 plus P1-003 compound escalation path does not currently justify P0.

## Next Dimension

Iteration 7 should continue deeper revisit coverage with a focused pass on non-output md-generator extraction modules and tests, especially any source-derived strings that feed report/preview HTML or future component-facts remediation.

Review verdict: CONDITIONAL
