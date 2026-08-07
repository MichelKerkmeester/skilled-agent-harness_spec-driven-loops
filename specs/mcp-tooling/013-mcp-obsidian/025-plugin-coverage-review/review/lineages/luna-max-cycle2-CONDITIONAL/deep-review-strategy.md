---
title: Deep Review Strategy - mcp-obsidian plugin coverage
description: Runtime strategy for the detached ten-iteration coverage review.
trigger_phrases:
  - "mcp-obsidian plugin coverage review"
importance_tier: normal
contextType: planning
version: 1.11.0.0
---

# Deep Review Strategy - Detached Lineage

## Topic

Read-only review of the plugin coverage packet and the shipped `mcp-obsidian` skill surfaces. The target packet currently contains review artifacts but no normative `spec.md`, `plan.md`, `tasks.md`, or `checklist.md`; that absence is itself part of the traceability review.

## Review dimensions

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
<!-- MACHINE-OWNED: END -->

## Non-Goals

- Do not edit the target packet or the shipped skill under review.
- Do not review unrelated packages or repair findings during this audit.
- Do not infer live Obsidian behavior where the references mark a boundary as `VERIFY`.

## Stop Conditions

Run all 10 iterations. Convergence is telemetry only; `max-iterations` is the stop policy.

## Files Under Review

The target packet directory and the `mcp-obsidian` skill's SKILL.md, README, plugin references, plugin assets, feature catalog, manual-testing playbook, examples, and scripts. Missing target packet files are recorded rather than synthesized.

## Cross-Reference Status

<!-- ANCHOR:cross-reference-status -->
- Core `spec_code`: blocked by missing target `spec.md` and implementation plan.
- Core `checklist_evidence`: blocked by missing target `checklist.md`.
- Overlay `feature_catalog_code`: scheduled across all eleven plugin cards.
- Overlay `playbook_capability`: scheduled across all eleven plugin tie-ins.
<!-- /ANCHOR:cross-reference-status -->

## Known Context

<!-- ANCHOR:known-context -->
- Current working-tree changes add six plugin/theme families to the existing mcp-obsidian skill.
- Current router code contains dedicated intents and resource mappings for Charts, Dataview, Excalidraw, Git, Outliner, Minimal, and Health.md.
- The six newer data models retain explicit `VERIFY` markers for facts not fully grounded by installed artifacts.
- `resource-map.md` is absent at init, so the Resource Map Coverage Gate is skipped.
- Review artifacts are bound to the requested lineage directory only.
<!-- /ANCHOR:known-context -->

## Review Boundaries

<!-- ANCHOR:review-boundaries -->
- Max iterations: 10
- Stop policy: max-iterations
- Session: fanout-luna-max-1785919542868-gvbr59
- Lineage mode: auto
- Executor: cli-codex / gpt-5.6-luna / max / fast
- Artifact root: `.opencode/specs/mcp-tooling/013-mcp-obsidian/025-plugin-coverage-review/review/lineages/luna-max`
<!-- /ANCHOR:review-boundaries -->

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
- P1 (Required): 2
- P2 (Suggestions): 2
- Resolved: 0

<!-- /ANCHOR:running-findings -->

<!-- ANCHOR:what-worked -->
## 6. WHAT WORKED
[None yet]
<!-- /ANCHOR:what-worked -->

<!-- ANCHOR:what-failed -->
## 7. WHAT FAILED
[None yet]
<!-- /ANCHOR:what-failed -->

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### A broken relative link in the mcp-obsidian package. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: A broken relative link in the mcp-obsidian package.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A broken relative link in the mcp-obsidian package.

### A P0 contradiction: no security or correctness failure is demonstrated by the stale prose. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: A P0 contradiction: no security or correctness failure is demonstrated by the stale prose.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A P0 contradiction: no security or correctness failure is demonstrated by the stale prose.

### A premature synthesis: this is iteration 10 of 10 and the synthesis follows this pass. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: A premature synthesis: this is iteration 10 of 10 and the synthesis follows this pass.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A premature synthesis: this is iteration 10 of 10 and the synthesis follows this pass.

### A stale plugin count in the body of the package: the body declares 11 tie-ins and OBS-011..OBS-021. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: A stale plugin count in the body of the package: the body declares 11 tie-ins and OBS-011..OBS-021.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A stale plugin count in the body of the package: the body declares 11 tie-ins and OBS-011..OBS-021.

### A version/header parse failure in the sampled plugin references and scenario files. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: A version/header parse failure in the sampled plugin references and scenario files.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A version/header parse failure in the sampled plugin references and scenario files.

### Any out-of-scope write by this review: target files remained read-only and generated artifacts stayed in the lineage directory. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Any out-of-scope write by this review: target files remained read-only and generated artifacts stayed in the lineage directory.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Any out-of-scope write by this review: target files remained read-only and generated artifacts stayed in the lineage directory.

### Credential leakage in the reviewed examples: no literal secret is present. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Credential leakage in the reviewed examples: no literal secret is present.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Credential leakage in the reviewed examples: no literal secret is present.

### Credential write-through in the git surface: the troubleshooting contract says credentials are app-managed. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Credential write-through in the git surface: the troubleshooting contract says credentials are app-managed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Credential write-through in the git surface: the troubleshooting contract says credentials are app-managed.

### Generic-route shadowing: specific plugin matching is evaluated before `PLUGINS`. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Generic-route shadowing: specific plugin matching is evaluated before `PLUGINS`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Generic-route shadowing: specific plugin matching is evaluated before `PLUGINS`.

### Health.md routing regression: `PLUGIN_HEALTH` is present in all three router structures. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Health.md routing regression: `PLUGIN_HEALTH` is present in all three router structures.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Health.md routing regression: `PLUGIN_HEALTH` is present in all three router structures.

### Missing card-to-scenario mapping for the eleven plugin rows. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Missing card-to-scenario mapping for the eleven plugin rows.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Missing card-to-scenario mapping for the eleven plugin rows.

### Missing catalog cards: all eleven plugin cards are present. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Missing catalog cards: all eleven plugin cards are present.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Missing catalog cards: all eleven plugin cards are present.

### Missing implementation coverage for the six newer plugin families: route, reference, catalog, and playbook cells are present. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Missing implementation coverage for the six newer plugin families: route, reference, catalog, and playbook cells are present.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Missing implementation coverage for the six newer plugin families: route, reference, catalog, and playbook cells are present.

### Missing new-plugin scenarios: the root index and directory both contain eleven tie-ins. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Missing new-plugin scenarios: the root index and directory both contain eleven tie-ins.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Missing new-plugin scenarios: the root index and directory both contain eleven tie-ins.

### Missing playbook tie-ins: all eleven scenario files are present. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Missing playbook tie-ins: all eleven scenario files are present.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Missing playbook tie-ins: all eleven scenario files are present.

### Missing plugin reference sets: all eleven have the required data-model, workflow, and troubleshooting files. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Missing plugin reference sets: all eleven have the required data-model, workflow, and troubleshooting files.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Missing plugin reference sets: all eleven have the required data-model, workflow, and troubleshooting files.

### Real-vault destructive commands: scenarios explicitly prohibit them or use disposable paths. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Real-vault destructive commands: scenarios explicitly prohibit them or use disposable paths.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Real-vault destructive commands: scenarios explicitly prohibit them or use disposable paths.

### Real-vault mutation in the plugin tie-ins: scenarios name disposable vaults or scratch files. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Real-vault mutation in the plugin tie-ins: scenarios name disposable vaults or scratch files.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Real-vault mutation in the plugin tie-ins: scenarios name disposable vaults or scratch files.

### Secret literals in examples: none found. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Secret literals in examples: none found.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Secret literals in examples: none found.

### The stale prior root report's claim that Beancount lacks scratch isolation: the current scenario explicitly names a disposable scratch ledger. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: The stale prior root report's claim that Beancount lacks scratch isolation: the current scenario explicitly names a disposable scratch ledger.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The stale prior root report's claim that Beancount lacks scratch isolation: the current scenario explicitly names a disposable scratch ledger.

### The stale prior root report's claims that Health.md routing is absent: current SKILL.md contains the route in all required structures. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: The stale prior root report's claims that Health.md routing is absent: current SKILL.md contains the route in all required structures.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The stale prior root report's claims that Health.md routing is absent: current SKILL.md contains the route in all required structures.

### Unbounded git push behavior: the git contract keeps destructive operations out of real vaults. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Unbounded git push behavior: the git contract keeps destructive operations out of real vaults.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Unbounded git push behavior: the git contract keeps destructive operations out of real vaults.

### Unmarked uncertainty in the six new data-model files: each sampled boundary is labeled `VERIFY`. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Unmarked uncertainty in the six new data-model files: each sampled boundary is labeled `VERIFY`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Unmarked uncertainty in the six new data-model files: each sampled boundary is labeled `VERIFY`.

<!-- /ANCHOR:exhausted-approaches -->

## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS
[None yet]
<!-- /ANCHOR:ruled-out-directions -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
remediate F001 and F002, then re-run the core traceability gates Review verdict: CONDITIONAL

<!-- /ANCHOR:next-focus -->

<!-- ANCHOR:files-under-review -->
## 12. FILES UNDER REVIEW
- Target packet normative files: absent at init.
- `.opencode/skills/mcp-tooling/mcp-obsidian/SKILL.md`
- `.opencode/skills/mcp-tooling/mcp-obsidian/README.md`
- Plugin references, assets, feature-catalog cards, playbook tie-ins, examples, and scripts under the declared skill root.
<!-- /ANCHOR:files-under-review -->
