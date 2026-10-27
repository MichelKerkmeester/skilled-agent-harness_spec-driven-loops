---
title: Deep Review Strategy - 054-weak-model-spec-authoring (lineage deepseek)
description: Review strategy for the 054 packet: shipped spec-kit templates, validator, authoring card, CLI guards and phase records checked against what each phase spec claims.
---

# Deep Review Strategy - 054-weak-model-spec-authoring

## 1. REVIEW CHARTER

- Target: `specs/system-speckit/054-weak-model-spec-authoring` (spec-folder, phased parent with children 001-022), shipped on `main` at `558570a83e`
- Target type: spec-folder
- Dimensions: correctness, security, traceability, maintainability
- Review focus (operator): All work packet 054 shipped in phases 001-022: the spec-kit templates, validator, authoring card, CLI scripts and their tests, the advisor scorer and its phrases, the sk-git provisioning step, the docs and the phase records. Check the shipped code and docs against what each phase spec claims.
- Stop conditions: `stopPolicy=max-iterations`; convergence is telemetry until the 3-iteration ceiling
- Success criteria: every phase claim checked against shipped code or explicitly recorded as unverified; every finding cites `file:line`

---

## 2. TOPIC
[Review target description from config -- set during initialization]

Review of the 054 phase parent and its 22 child phases: do the shipped templates, validator, guards, card, advisor routes and provisioning step do what each phase spec says they do, and did the closeout claims survive contact with the code on main?

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
- [ ] maintainability

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS

- Re-litigating decisions the packet already records (add-on removal, benchmark subject changes) unless a shipped file contradicts them
- Benchmark numbers themselves (phase 018/009 measurement machinery is in scope, the statistical argument is not)
- Re-running repo tooling (`validate.sh`, generated context). Verification is by reading shipped code and specs
- Style-only preferences with no behavioral consequence

---

## 5. STOP CONDITIONS

- Hard ceiling: 3 iterations (`maxIterations`)
- Any confirmed active P0 forces `Review verdict: FAIL`
- Convergence below threshold before the ceiling is treated as telemetry; the remaining iterations broaden to a new angle

---

<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
- [x] correctness
- [x] security
- [x] traceability

<!-- /ANCHOR:completed-dimensions -->
<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 1
- P2 (Suggestions): 6
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED

- Reading each phase `implementation-summary.md` file list first, then opening the shipped file, gives claim and evidence in the same pass (iteration 1)
- Grepping the shipped guard scripts for their exit codes reveals whether a CI wiring claim is real faster than reading the phase closeout (iteration 1)

---

## 9. WHAT FAILED

- Assuming a phase's "Complete" status implies its named guard script is wired into any gate; two guards are standalone-only (iteration 1)

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **`check-example-drift.sh` aborting on a clean example**: with `set -euo pipefail`, `printf | rg -q ... && status=1` is an AND-OR list whose failing first command is exempt. Ruled out by reading, not by execution. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **`check-example-drift.sh` aborting on a clean example**: with `set -euo pipefail`, `printf | rg -q ... && status=1` is an AND-OR list whose failing first command is exempt. Ruled out by reading, not by execution.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`check-example-drift.sh` aborting on a clean example**: with `set -euo pipefail`, `printf | rg -q ... && status=1` is an AND-OR list whose failing first command is exempt. Ruled out by reading, not by execution.

### **`implementation-summary.md` scanned by the shell rule but not the orchestrator**: `FREEFORM_WORKFLOW_DOCS` holds only `review/review-report.md` and `research/research.md`, and `validationDocsForLevel` includes lifecycle and addon docs. Ruled out. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **`implementation-summary.md` scanned by the shell rule but not the orchestrator**: `FREEFORM_WORKFLOW_DOCS` holds only `review/review-report.md` and `research/research.md`, and `validationDocsForLevel` includes lifecycle and addon docs. Ruled out.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`implementation-summary.md` scanned by the shell rule but not the orchestrator**: `FREEFORM_WORKFLOW_DOCS` holds only `review/review-report.md` and `research/research.md`, and `validationDocsForLevel` includes lifecycle and addon docs. Ruled out.

### **`route-validate.sh` warnings hiding a broken route**: the two warnings are the pre-existing `--dry-run` notes the phase recorded. Ruled out. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **`route-validate.sh` warnings hiding a broken route**: the two warnings are the pre-existing `--dry-run` notes the phase recorded. Ruled out.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`route-validate.sh` warnings hiding a broken route**: the two warnings are the pre-existing `--dry-run` notes the phase recorded. Ruled out.

### **A symlink planted inside a packet diverting a repair write outside it**: refused at three layers (`REWRITE_TARGETS`, `linkedRederiveInputs`, `insideSpecs`). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **A symlink planted inside a packet diverting a repair write outside it**: refused at three layers (`REWRITE_TARGETS`, `linkedRederiveInputs`, `insideSpecs`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A symlink planted inside a packet diverting a repair write outside it**: refused at three layers (`REWRITE_TARGETS`, `linkedRederiveInputs`, `insideSpecs`).

### **A symlinked `description.json` being rewritten through its target**: `readIfPresent` returns null for a link and `linkedRewriteTargets` reports the packet as refused. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **A symlinked `description.json` being rewritten through its target**: `readIfPresent` returns null for a link and `linkedRewriteTargets` reports the packet as refused.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A symlinked `description.json` being rewritten through its target**: `readIfPresent` returns null for a link and `linkedRewriteTargets` reports the packet as refused.

### **Command injection through a crafted packet folder name**: every spawn is an argv array (see Confirmed-Clean). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Command injection through a crafted packet folder name**: every spawn is an argv array (see Confirmed-Clean).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Command injection through a crafted packet folder name**: every spawn is an argv array (see Confirmed-Clean).

### **Phase 015's neutralization missing a rendered example**: no match under `templates/`. Ruled out. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Phase 015's neutralization missing a rendered example**: no match under `templates/`. Ruled out.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Phase 015's neutralization missing a rendered example**: no match under `templates/`. Ruled out.

### **Phase 017's block detection accepting an empty block**: `measured_behavior_block_state` requires a non-empty fenced line or an `N/A:` line with a reason after the colon, and it treats a bare value token as unfilled. Ruled out. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Phase 017's block detection accepting an empty block**: `measured_behavior_block_state` requires a non-empty fenced line or an `N/A:` line with a reason after the colon, and it treats a bare value token as unfilled. Ruled out.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Phase 017's block detection accepting an empty block**: `measured_behavior_block_state` requires a non-empty fenced line or an `N/A:` line with a reason after the colon, and it treats a bare value token as unfilled. Ruled out.

### **Placeholder gate reachable only for v2.3 docs while templates stamp v2.4**: `speckit_carries_token_gate_stamp` compares major/minor against 2.3, so v2.4 is gated. Ruled out. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Placeholder gate reachable only for v2.3 docs while templates stamp v2.4**: `speckit_carries_token_gate_stamp` compares major/minor against 2.3, so v2.4 is gated. Ruled out.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Placeholder gate reachable only for v2.3 docs while templates stamp v2.4**: `speckit_carries_token_gate_stamp` compares major/minor against 2.3, so v2.4 is gated. Ruled out.

### **Registry rule output forging a pass**: an exit-status mismatch is promoted to an error. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Registry rule output forging a pass**: an exit-status mismatch is promoted to an error.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Registry rule output forging a pass**: an exit-status mismatch is promoted to an error.

### **Template fill-note examples naming the benchmark task**: the sweep prints no match under `templates/`. Ruled out. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Template fill-note examples naming the benchmark task**: the sweep prints no match under `templates/`. Ruled out.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Template fill-note examples naming the benchmark task**: the sweep prints no match under `templates/`. Ruled out.

### **The `check-measured-behavior.sh` header repeating the "Sourced by validate.sh" mistake**: it does carry the same header line, but unlike the placeholder rule it has no native orchestrator twin, so the registry does run it — the header is merely imprecise about the mechanism, and the claim it describes is true. Folded into `F1-P2-002` rather than re-raised. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **The `check-measured-behavior.sh` header repeating the "Sourced by validate.sh" mistake**: it does carry the same header line, but unlike the placeholder rule it has no native orchestrator twin, so the registry does run it — the header is merely imprecise about the mechanism, and the claim it describes is true. Folded into `F1-P2-002` rather than re-raised.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The `check-measured-behavior.sh` header repeating the "Sourced by validate.sh" mistake**: it does carry the same header line, but unlike the placeholder rule it has no native orchestrator twin, so the registry does run it — the header is merely imprecise about the mechanism, and the claim it describes is true. Folded into `F1-P2-002` rather than re-raised.

### **Workflow command injection through a packet name**: names are escaped for `::` and line breaks before they reach an annotation. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Workflow command injection through a packet name**: names are escaped for `::` and line breaks before they reach an annotation.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Workflow command injection through a packet name**: names are escaped for `::` and line breaks before they reach an annotation.

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS

- Placeholder-gate bypass through fenced code blocks: the gate strips fenced blocks before matching, so a token inside a fence is not counted (iteration 1, evidence: `check-placeholders.sh` fence-strip pass)

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
maintainability

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- Target pointers: phase children `001-022` under the packet, their `spec.md`/`plan.md`/`tasks.md`/`implementation-summary.md`, and the shipped surfaces they name: `templates/core/*.md.tmpl`, `runtime/cli/rules/check-placeholders.sh`, `runtime/cli/spec/check-example-drift.sh`, `runtime/cli/spec/check-card-sync.sh`, `runtime/lib/validation/orchestrator.ts`, `references/workflows/spec-authoring-card.md`, the four `runtime/cli/tests/*.vitest.ts` files, the advisor scorer and `sk-git` provisioning assets
- Behavior claims to verify: v2.3 placeholder token gate is Draft-warn / later-error and v2.3-only; every core template section carries one fill instruction plus a good and a weak example; the card exists and the router loads it; both guard scripts exit non-zero on drift; draft metadata is repaired while a packet is Draft
- Reuse and conventions: `validate.sh` rule taxonomy in `references/validation/validation-rules.md`; the phase parent's Phase Documentation Map as the claim index
- Review risks and gaps: 22 phases exceed three iterations, so coverage is claim-sampled per phase with the shipped file as the deciding evidence; no repo tooling runs during review; the packet's own `review/` folder is another lineage's write surface and is out of scope

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | [pending/pass/partial/fail/blocked] | [N] | [details] |
| `checklist_evidence` | core | [pending/pass/partial/fail/blocked] | [N] | [details] |
| `skill_agent` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
| `agent_cross_runtime` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
| `feature_catalog_code` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
| `playbook_capability` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| [path/to/file] | [D1, D3] | [N] | [0 P0, 1 P1, 2 P2] | [partial/complete] |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 3
- Convergence threshold: 0.1
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-deepseek-1793081281038-z2aj1o, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-10-27T06:08:02Z
<!-- MACHINE-OWNED: END -->
