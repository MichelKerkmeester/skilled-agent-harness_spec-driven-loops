---
title: Deep Review Strategy - docs-metadata pass five
description: Runtime strategy for the docs-metadata fan-out lineage of review pass five on the command-surfacing packet.
---

# Deep Review Strategy - docs-metadata pass five

## 1. REVIEW CHARTER

- Target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build` (spec-folder review, pass five).
- Lineage area: `docs-metadata` (14 files from `review/review-scope-5.txt`, plus docs describing them).
- Dimensions: correctness, security, traceability, maintainability.
- Operator focus: the text bound as `reviewFocus`, reproduced in `deep-review-config.json`.
- Stop conditions: legal convergence per `convergence.cjs`, or `maxIterations=4`.
- Success criteria: every docs-vs-code claim in scope checked with file:line evidence; holdout hygiene preserved; no code changed.

## 2. TOPIC

Docs and generated metadata for command surfacing: the v1.1.0.0 changelog, four feature-catalog leaves, the manual-testing playbook root plus two CLI-hook scenarios and one native scenario, the tests README, the playbook inventory test, and the skill's leaf/graph metadata.

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS

- Not re-implementing or fixing any reviewed file; findings only.
- Not reviewing code assigned to the kill-switch-cli, vibe-hooks-doctor and accuracy-runner lineages except as evidence for a doc claim.
- Not opening holdout prompt text; counts only.

## 5. STOP CONDITIONS

- Legal convergence from `convergence.cjs` with all quality gates passing.
- `maxIterationsReached` after iteration 4, with synthesis recording partial coverage honestly.

<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability

<!-- /ANCHOR:completed-dimensions -->
<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 0
- P2 (Suggestions): 8
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED

- [Direct claim-to-code verification]: reading the exact constant or function a doc names catches count drift and contradiction cheaply (iteration 1).
- [Inventory comparison]: diffing a documented file list against the directory tree proves omission versus invention in one step (iteration 2).
- [Formula-to-expression comparison]: reading the note's sentence beside the exact numerator and denominator settled the load-rate definition without running the scorer (iteration 3).- [Switch-order reading]: reading the disable check at the CLI call site and the launcher's allowlist closed both privacy claims in one pass (iteration 4).

## 9. WHAT FAILED

- [None yet]: iteration 1 has no failed approach to record.
- [Partial-directory assumption]: assuming the tests README tree was intentionally curated cost a second pass; the heading and file-by-file form say otherwise (iteration 2).

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### A `:autopilot` suffix mismatch: the code accepts all three documented suffixes. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: A `:autopilot` suffix mismatch: the code accepts all three documented suffixes.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A `:autopilot` suffix mismatch: the code accepts all three documented suffixes.

### A `followedRate` formula mismatch: ruled out; the numerator and denominator match the note. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: A `followedRate` formula mismatch: ruled out; the numerator and denominator match the note.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A `followedRate` formula mismatch: ruled out; the numerator and denominator match the note.

### A broken central-playbook link: none. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: A broken central-playbook link: none.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A broken central-playbook link: none.

### A kill switch that resolves after the daemon call: ruled out by the call order. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: A kill switch that resolves after the daemon call: ruled out by the call order.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A kill switch that resolves after the daemon call: ruled out by the call order.

### A kill-switch value-rule mismatch: the "truthy" vocabulary is defined and honoured. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: A kill-switch value-rule mismatch: the "truthy" vocabulary is defined and honoured.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A kill-switch value-rule mismatch: the "truthy" vocabulary is defined and honoured.

### A mismatch between the tests README and the files it does list: none; all 39 listed files exist, so the defect is omission rather than invention. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: A mismatch between the tests README and the files it does list: none; all 39 listed files exist, so the defect is omission rather than invention.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A mismatch between the tests README and the files it does list: none; all 39 listed files exist, so the defect is omission rather than invention.

### A missing runtime in the health-record list: ruled out; the two runtimes that do not write (Vibe, OpenCode) are either no-op or explicitly excluded. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: A missing runtime in the health-record list: ruled out; the two runtimes that do not write (Vibe, OpenCode) are either no-op or explicitly excluded.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A missing runtime in the health-record list: ruled out; the two runtimes that do not write (Vibe, OpenCode) are either no-op or explicitly excluded.

### A non-load counted in `loadRate`: ruled out; the numerator is `command + skill`, both witnessed loads. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: A non-load counted in `loadRate`: ruled out; the numerator is `command + skill`, both witnessed loads.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A non-load counted in `loadRate`: ruled out; the numerator is `command + skill`, both witnessed loads.

### A playbook inventory mismatch: the root document, the category tree and the inventory test agree on 53 scenarios. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: A playbook inventory mismatch: the root document, the category tree and the inventory test agree on 53 scenarios.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A playbook inventory mismatch: the root document, the category tree and the inventory test agree on 53 scenarios.

### A second, hidden scenario-verdict vocabulary: none found; the split is between the persistence contract and the verdict section only. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: A second, hidden scenario-verdict vocabulary: none found; the split is between the persistence contract and the verdict section only.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A second, hidden scenario-verdict vocabulary: none found; the split is between the persistence contract and the verdict section only.

### A separate Vibe scoring path: ruled out; Vibe records feed the same `workflowPath()`. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: A separate Vibe scoring path: ruled out; Vibe records feed the same `workflowPath()`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A separate Vibe scoring path: ruled out; Vibe records feed the same `workflowPath()`.

### A stale line anchor in `advisor-recommend.md` for the options it cites: none; all four anchors land on the named declarations. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: A stale line anchor in `advisor-recommend.md` for the options it cites: none; all four anchors land on the named declarations.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A stale line anchor in `advisor-recommend.md` for the options it cites: none; all four anchors land on the named declarations.

### A stale manifest or alias row pointing at a missing file: none; all 119 leaves resolve. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: A stale manifest or alias row pointing at a missing file: none; all 119 leaves resolve.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A stale manifest or alias row pointing at a missing file: none; all 119 leaves resolve.

### A switch forwarded into the shared daemon: ruled out by the allowlist. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: A switch forwarded into the shared daemon: ruled out by the allowlist.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A switch forwarded into the shared daemon: ruled out by the allowlist.

### A tests-README key file that does not exist: none; 5 of 5 named files are present. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: A tests-README key file that does not exist: none; 5 of 5 named files are present.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A tests-README key file that does not exist: none; 5 of 5 named files are present.

### A tests-README subfolder that does not exist: none; 13 of 13 named subfolders are present. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: A tests-README subfolder that does not exist: none; 13 of 13 named subfolders are present.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A tests-README subfolder that does not exist: none; 13 of 13 named subfolders are present.

### A Vibe health-record leak: ruled out by the no-op diagnostic writer. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: A Vibe health-record leak: ruled out by the no-op diagnostic writer.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A Vibe health-record leak: ruled out by the no-op diagnostic writer.

### An offer counted as a followed step without an offer: ruled out; the `asked` branch requires `askedAndWaited`. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: An offer counted as a followed step without an offer: ruled out; the `asked` branch requires `askedAndWaited`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: An offer counted as a followed step without an offer: ruled out; the `asked` branch requires `askedAndWaited`.

### Graph metadata drift between `graph-metadata.json` and `skill-graph.json`: none. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Graph metadata drift between `graph-metadata.json` and `skill-graph.json`: none.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Graph metadata drift between `graph-metadata.json` and `skill-graph.json`: none.

### Holdout prompt leakage through a scoped document: none; no file path or attributed row. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Holdout prompt leakage through a scoped document: none; no file path or attributed row.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Holdout prompt leakage through a scoped document: none; no file path or attributed row.

### Link rot across the nine scoped documents: every relative target exists. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Link rot across the nine scoped documents: every relative target exists.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Link rot across the nine scoped documents: every relative target exists.

### Prompt text in the health record: ruled out by the serializer and the changelog's own sample. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Prompt text in the health record: ruled out by the serializer and the changelog's own sample.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Prompt text in the health record: ruled out by the serializer and the changelog's own sample.

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS

- [Link rot across the nine scoped documents]: every relative markdown link resolves; no broken-target finding exists (iteration 1).
- [Graph metadata drift]: `graph-metadata.json` intent signals and enhance edges match `runtime/scripts/skill-graph.json` exactly (iteration 1).

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none remaining. All four configured dimensions have a full iteration. - Focus area: synthesis only. - Reason: `maxIterations=4` is reached with all dimensions covered and no active P0 or P1. - Rotation status: complete. - Blocked/productive carry-forward: none. - Required evidence: the terminal convergence decision and the finding registry. - Recovery note: none; no failed iteration. Review verdict: PASS

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- Target pointers: the 14 scope files listed in `review/review-scope-5.txt` under area `docs-metadata`, plus the code they name (`runtime/lib/command-attach.ts`, `runtime/lib/render.ts`, `runtime/lib/scorer/fusion.ts`, `hooks/vibe/prompt-advisor.mjs`, `runtime/scripts/command-bridges/*`).
- Behavior claims: v1.1.0.0 hook health, direct-call kill switch, command offer gates, child-session policy words, Vibe command documents, doctor bridge generation and meaning matching.
- Reuse and conventions: review-core severity and evidence rules; the leaf-manifest generator contract in sk-doc.
- Review risks and gaps: generated metadata can be stale but is reducer-owned; docs counts move with the corpus, so only exact generated evidence settles them.
- Resource map: `resource-map.md not present; skipping coverage gate`.

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
[Alignment checks completed across core and overlay protocols]

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | [pending/pass/partial/fail/blocked] | [N] | [details] |
| `checklist_evidence` | core | [pending/pass/partial/fail/blocked] | [N] | [details] |
| `skill_agent` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
| `agent_cross_runtime` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
| `feature_catalog_code` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
| `playbook_capability` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
<!-- MACHINE-OWNED: END -->

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
[Per-file coverage state table -- populated during initialization from scope discovery]

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| `.skilled/skills/system-skill-advisor/changelog/v1.1.0.0.md` | - | - | - | pending |
| `.skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-recommend.md` | - | - | - | pending |
| `.skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/command-meaning-matching.md` | - | - | - | pending |
| `.skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/doctor-command-routing.md` | - | - | - | pending |
| `.skilled/skills/system-skill-advisor/graph-metadata.json` | - | - | - | pending |
| `.skilled/skills/system-skill-advisor/leaf-aliases.json` | - | - | - | pending |
| `.skilled/skills/system-skill-advisor/leaf-manifest.json` | - | - | - | pending |
| `.skilled/skills/system-skill-advisor/manual-testing-playbook/cli-hooks-and-plugin/brief-command-policy-word.md` | - | - | - | pending |
| `.skilled/skills/system-skill-advisor/manual-testing-playbook/cli-hooks-and-plugin/vibe-command-documents.md` | - | - | - | pending |
| `.skilled/skills/system-skill-advisor/manual-testing-playbook/manual-testing-playbook.md` | - | - | - | pending |
| `.skilled/skills/system-skill-advisor/manual-testing-playbook/native-cli-tools/command-offer-fit-gates.md` | - | - | - | pending |
| `.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json` | - | - | - | pending |
| `.skilled/skills/system-skill-advisor/runtime/tests/manual-testing-playbook.vitest.ts` | - | - | - | pending |
| `.skilled/skills/system-skill-advisor/runtime/tests/README.md` | - | - | - | pending |
<!-- MACHINE-OWNED: END -->

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 4
- Convergence threshold: 0.1
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-docs-metadata-5-1794760565927-i99t40, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 60 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-11-15T16:45:27.000Z
<!-- MACHINE-OWNED: END -->
