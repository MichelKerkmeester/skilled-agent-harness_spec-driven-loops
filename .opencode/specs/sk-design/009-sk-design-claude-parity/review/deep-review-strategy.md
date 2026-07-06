---
title: Deep Review Strategy - sk-design Claude-parity packet (009)
description: Session tracking for the 10-iteration deep review of the sk-design Claude-parity build + optimization packet (phases 001-013).
trigger_phrases:
  - "deep review strategy template"
  - "review dimension tracking"
  - "exhausted review approaches"
  - "review session tracking"
importance_tier: normal
contextType: planning
version: 1.11.0.14
---

# Deep Review Strategy - Session Tracking

Runtime state file for the sk-design 009-sk-design-claude-parity review session. Tracks review progress across iterations.

## 1. OVERVIEW

### Purpose

Persistent brain for this deep review session. Records which dimensions remain, what was found (P0/P1/P2), what review approaches worked or failed, and where to focus next.

---

## 2. TOPIC

Review of `.opencode/specs/sk-design/009-sk-design-claude-parity` - the sk-design Claude-parity build (phases 001-005) plus the 8-phase optimization follow-on (phases 006-013: parent-skill canon, procedure card templates, smart routing, README alignment, feature catalog completeness, manual testing playbook, routing benchmark rigor, design commands asset refactor). All 13 phases were implemented and independently verified this session (`validate.sh --strict` clean across parent + all 13 phases), including two follow-up remediation passes for phases 010 (finished 4 remaining feature_catalog packages) and 012 (honest doc reconciliation with a formal ADR-003 descope). This deep review cross-checks the shipped implementation against the specs, and audits the actual `.opencode/skills/sk-design/**` code/docs for correctness, security, traceability, and maintainability issues the implement+verify loop may have missed.

---

## 3. REVIEW DIMENSIONS (remaining)
<!-- MACHINE-OWNED: START -->
- [x] D1 Correctness, Logic errors, off-by-one, wrong return types, broken invariants
- [x] D2 Security, Injection, auth bypass, secrets exposure, unsafe deserialization
- [x] D3 Traceability, Spec/code alignment, checklist evidence, cross-reference integrity
- [x] D4 Maintainability, Patterns, clarity, documentation quality, safe follow-on change cost
<!-- MACHINE-OWNED: END -->

---

## 4. NON-GOALS

Not re-running the routing benchmark harness or the md-generator Playwright pipeline; not re-deriving the original 001-005 Claude-parity architecture decisions (already accepted); not second-guessing Phase 012's ADR-003 accepted descope of the expanded benchmark battery unless new evidence contradicts it.

---

## 5. STOP CONDITIONS

`stop_policy = max-iterations`: convergence signals are telemetry only until iteration 10 is reached; the loop runs the full 10 forced iterations regardless of early all-dimensions-clean signals, per operator request for depth.

---

## 6. COMPLETED DIMENSIONS
<!-- MACHINE-OWNED: START -->
| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|
| Correctness | CONDITIONAL | 2 | Found one P1 in the md-generator WRITE prompt: component exact-value output is required by the v3 format but component style facts are not exposed by `build-write-prompt.ts`. |
| Security | CONDITIONAL | 3 | Found two P1s: md-generator output guards do not enforce the documented spec-folder/sandbox boundary, and live-site-derived typography values enter the AI WRITE prompt without prompt-data isolation. |
| Traceability | CONDITIONAL | 4 | Found one P1: md-generator report/preview catalog promises no silent overwrite, but report/preview/proof scripts write fixed artifact names without output-exists guards or explicit overwrite acceptance. |
| Maintainability | PASS with advisories | 5 | Found two P2 advisories: procedure-card lint remains manual-only/outside canon checker coverage, and byte-identical benchmark artifacts remain under two naming conventions. |
<!-- MACHINE-OWNED: END -->

---

## 7. RUNNING FINDINGS
<!-- MACHINE-OWNED: START -->
- **P0 (Critical):** 0 active
- **P1 (Major):** 4 active
- **P2 (Minor):** 2 active
- **Delta this iteration:** +0 P0, +0 P1, +2 P2

[Findings are tracked in `deep-review-findings-registry.json`. This section provides a running count summary updated after each iteration.]
<!-- MACHINE-OWNED: END -->

---

## 8. WHAT WORKED

- Iteration 1 inventory confirmed the review packet is initialized correctly: `deep-review-config.json`, `deep-review-state.jsonl`, `deep-review-strategy.md`, and `deep-review-findings-registry.json` are present and generation/session values align.
- Directory reads plus targeted globs gave a usable artifact map without entering out-of-scope `external/`, `research/`, or vendored `backend/node_modules/` internals.
- Grep for unchecked checklist rows quickly separated real deferred/descoped rows from potential silent-completion defects.
- Direct reads of `mode-registry.json`, `hub-router.json`, and md-generator backend package/build metadata provided good starting anchors for iteration 2 correctness review.
- Iteration 2 direct-read comparison between `build-write-prompt.ts`, `types.ts`, `cluster.ts`, and `references/design_md_format.md` exposed a value-provenance gap without needing to mutate reviewed code.
- Iteration 3 targeted greps for process execution, path writes, prompt interpolation, URL/selector handling, and mode tool surfaces quickly narrowed the security pass to two confirmed P1s and several ruled-out directions.
- Iteration 4 traceability sampling across phases 010-013, all six feature-catalog packages, procedure-card-contract playbook scenarios, and `/design:*` command projections isolated one real doc/code mismatch without re-reporting prior P1s.
- Iteration 5 maintainability review found no new P0/P1 and clarified two shared remediation seams for the md-generator backend: prompt-data/facts encoding and output/artifact write policy.

---

## 9. WHAT FAILED

- Code graph is stale for this workspace (`git HEAD changed`, newer mtimes, and removed tracked files), so iteration 1 used graphless fallback and did not make structural-graph claims.
- Broad recursive globs over the full skill tree can truncate output; prefer targeted directory reads and narrow globs by packet/type in future iterations.
- Code graph remained unsuitable for correctness assertions, so iteration 2 continued graphless fallback with direct reads and narrow grep/glob evidence.
- Code graph remained unsuitable for security assertions; iteration 3 used graphless fallback and did not make structural graph coverage claims.
- Code graph remained unsuitable for traceability assertions; iteration 4 used graphless fallback and did not make structural graph coverage claims.
- Code graph remained stale in iteration 5 (`git HEAD changed`, newer mtimes, removed tracked files); maintainability assertions used graphless fallback only.

---

## 10. EXHAUSTED APPROACHES (do not retry)

[Populated when a review approach has been tried from multiple angles without yielding new findings]

---

## 11. RULED OUT DIRECTIONS

- Missing parent/phase structure: ruled out for inventory scope. Parent lean trio and phase folders `001` through `013` are present.
- Silent unchecked hard-blocker rows: ruled out as a new iteration-1 finding. Phase 012 unchecked P0/P1 rows are deliberately preserved under accepted ADR-003 descope; Phase 013 unchecked rows are P2 deferrals.
- Mode-registry surface mismatch: ruled out for inventory scope. Registry declares exactly five modes with expected read-only vs md-generator tool surfaces.
- Missing md-generator compiled output: ruled out. `backend/dist/cli.js` exists and matches `package.json` `main`.
- Obvious placeholder/stub residue: ruled out for inventory scope. Search hits were intentional policy/examples/deferred rows, not empty stubs.
- Mode-routing/tool-surface correctness: ruled out for iteration 2. `mode-registry.json`, `hub-router.json`, hub `SKILL.md`, and the five mode `SKILL.md` frontmatters agree on the five-mode taxonomy and read-only vs md-generator mutating split.
- Phase 010 residual layout drift: ruled out for iteration 2 based on the live package glob and the phase implementation summary's exact file-count evidence.
- Phase 012 false-pass regression: ruled out for iteration 2. The packet now explicitly records accepted descope / unscored dimensions instead of fabricating expanded-battery completion.
- Shell command injection in md-generator guided-run: ruled out for iteration 3. `spawnSync` uses argv arrays with no shell interpolation.
- Crawler same-domain/action side-effect gap: ruled out for iteration 3 in the sampled path. Link discovery stays on the same hostname, and reveal-click logic skips forms, submits, navigating hrefs, and action-intent controls.
- Read-only mode tool escalation: ruled out for iteration 3. Registry, mode frontmatters, and command frontmatters preserve Read/Glob/Grep-only surfaces for interface/foundations/motion/audit and reserve Write/Edit/Bash for md-generator.
- Prior P1-001 as a separate current security issue: ruled out for iteration 3. Component facts are missing rather than currently interpolated, but any future remediation must apply prompt-data isolation.
- Phase 010 traceability false-completion: ruled out for iteration 4. File-count, package-layout, and checklist claims match observed feature-catalog samples.
- Phase 012 fabricated benchmark closeout: ruled out for iteration 4. ADR-003 descope is explicit, with unbuilt expanded-battery/live/advisor/procedure-card work visible as NOT MET or UNSCORED.
- Procedure-card playbook capability mismatch: ruled out for sampled iteration 4 scenarios. Procedure-card-contract playbooks map to live mode SKILL card-selection and fallback contracts.
- Command projection drift after Phase 013: ruled out for iteration 4. Five `/design:*` commands still match current registry mode and tool-surface behavior.
- Feature-catalog root/leaf duplication as a new maintainability defect: ruled out for iteration 5. The six root catalogs summarize and link leaf files rather than duplicating long-form authoritative capability bodies.
- Phase 012 future-work handoff ambiguity: ruled out for iteration 5. ADR-003, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md` all name the descoped expanded battery, harness fields, live rerun, and baseline promotion.
- md-generator remediation coupling as a separate new P1: ruled out for iteration 5. The existing four P1s share two maintainable remediation seams instead of proving an additional blocker-class design defect.

---

## 12. NEXT FOCUS
<!-- MACHINE-OWNED: START -->
Iteration 6 (deeper revisit): revisit md-generator P1 remediation design with emphasis on prompt-data/facts encoding and shared output/artifact write policy.
<!-- MACHINE-OWNED: END -->

---

## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- **Target pointers:** `.opencode/specs/sk-design/009-sk-design-claude-parity/{spec.md,plan.md,tasks.md,checklist.md}` (parent) + 13 phase folders (006-013 implemented this session, 001-005 implemented earlier); implementation at `.opencode/skills/sk-design/**` (SKILL.md hub + 5 mode SKILL.md, `hub-router.json`, `mode-registry.json`, `shared/procedures/*.md` + 5x `procedures/*.md`, `feature_catalog/**` across 6 packages, `manual_testing_playbook/**` across 6 packages, `benchmark/**`); commands at `.opencode/commands/design/*.md` (5 flat commands, Phase 013 confirmed these stay untouched/planning-only).
- **Behavior claims to verify:** mode-registry.json declares exactly 5 modes with correct toolSurface (interface/foundations/motion/audit = Read/Glob/Grep only; md-generator = full read/write/bash); exactly one graph-metadata.json for the sk-design skill; benchmark/baseline/ untouched since inception; all 6 feature_catalog packages match their spec.md-declared file layout with real, evidence-grounded content (not stubs); all new manual_testing_playbook scenario files follow the established procedure-card-contract pattern; Phase 012's benchmark report.json floors (D1/D2/D5) genuinely support its claimed 100/100 scores; Phase 007/009's verifier-reconciled tracking docs (spec/plan/checklist/implementation-summary) accurately reflect the real edits.
- **Reuse/convention pointers:** hub + design-interface's feature_catalog packages are the reference shape for the 4 remediated packages (design-foundations/motion/audit/md-generator-augmentation) - confirm the remediated packages actually match that shape and aren't subtly divergent.
- **Known risks/gaps entering this review:** (1) Phase 010 and 012 each needed a follow-up remediation pass after their first implement+verify cycle - worth extra scrutiny for residual gaps the remediation may have missed; (2) implement-round agents in this session repeatedly exhibited a pattern of returning vague "waiting for background dispatch" self-reports while real work continued detached - verify no iteration's real output was silently truncated as a result; (3) Phase 012's checklist honestly leaves 6 P0 + 4 P1 items unchecked (formally descoped via ADR-003, not a defect) - do not double-count these as new findings unless the descope itself is unsound; (4) the mk-spec-memory reindex of the renamed sk-design/ tree is still pending (daemon contention) - description.json status drift on phase 009 is a known, non-blocking gap.

Do not inline full source bodies in this file. Use this snapshot only to seed review dimensions and final traceability.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | covered_with_new_p1 | 4 | Traceability pass checked Phase 010/012 claims, feature-catalog samples, and md-generator report/preview scripts; P1-004 is the new mismatch. |
| `checklist_evidence` | core | covered | 4 | Phase 010/011/012/013 checklist evidence sampled; no new checklist-only defect found. |
| `skill_agent` | overlay | covered | 4 | Registry, hub/mode SKILL contracts, playbook scenarios, and command frontmatters preserve expected behavior. |
| `agent_cross_runtime` | overlay | notApplicable | - | sk-design has no dedicated agent family beyond the shared `design` LEAF agent, already covered under skill_agent |
| `feature_catalog_code` | overlay | covered_with_new_p1 | 4 | Hub/interface/foundations/motion/audit samples matched source; md-generator report/preview produced P1-004. |
| `playbook_capability` | overlay | covered | 4 | Sampled procedure-card-contract scenarios map to live SKILL card-selection and fallback contracts. |
| `command_projection_parity` | overlay | covered | 4 | Five `/design:*` commands still match the current five-mode registry and tool-surface split. |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| `.opencode/specs/sk-design/009-sk-design-claude-parity/{spec.md,description.json,graph-metadata.json}` | inventory | 1 | 0 | mapped |
| `.opencode/specs/sk-design/009-sk-design-claude-parity/001-baseline-ownership-gate/` through `013-design-commands-asset-refactor/` | inventory + checklist spot-check + traceability spot-check | 4 | 0 | mapped; Phase 010/012/013 traceability spot-check complete |
| `.opencode/specs/sk-design/009-sk-design-claude-parity/008-smart-routing-optimization/benchmark-after-008/` | inventory | 1 | 0 | mapped |
| `.opencode/specs/sk-design/009-sk-design-claude-parity/external/` | - | 1 | - | out of scope per review strategy |
| `.opencode/specs/sk-design/009-sk-design-claude-parity/research/` | - | 1 | - | out of scope per review strategy |
| `.opencode/specs/sk-design/009-sk-design-claude-parity/review/` | review-state only | 1 | 0 | mapped; own artifacts only |
| `.opencode/skills/sk-design/{SKILL.md,README.md,hub-router.json,mode-registry.json,command-metadata.json,description.json,graph-metadata.json,references/,shared/,changelog/,benchmark/,feature_catalog/,manual_testing_playbook/}` | inventory + correctness routing spot-check + security tool-surface spot-check + traceability samples | 4 | 0 | mapped; sampled feature catalog/playbook command contracts covered |
| `.opencode/skills/sk-design/design-interface/` | inventory | 1 | 0 | mapped; includes extra `LICENSE.txt` noted for maintainability pass |
| `.opencode/skills/sk-design/design-foundations/` | inventory | 1 | 0 | mapped; scripts present |
| `.opencode/skills/sk-design/design-motion/` | inventory | 1 | 0 | mapped |
| `.opencode/skills/sk-design/design-audit/` | inventory | 1 | 0 | mapped; scripts present |
| `.opencode/skills/sk-design/design-md-generator/` | inventory + backend correctness spot-check + security path/prompt spot-check + report/preview traceability spot-check | 4 | 4 P1 | mapped; `build-write-prompt.ts` component-facts gap, output-boundary guard gap, prompt-data isolation gap, and report/preview overwrite-contract gap found |
| `.opencode/skills/sk-design/design-md-generator/backend/node_modules/` | - | 1 | - | out of scope vendored dependency internals |
| `.opencode/commands/design/*.md` | inventory + security tool-surface spot-check + traceability command projection spot-check | 4 | 0 | mapped; read-only versus md-generator mutating split preserved |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 10
- Convergence threshold: 0.10 (telemetry only under stop_policy=max-iterations)
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=2026-07-06T11:48:06.000Z, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 20 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-07-06T11:48:06.000Z
<!-- MACHINE-OWNED: END -->

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->

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
- P1 (Required): 4
- P2 (Suggestions): 2
- Resolved: 0

<!-- /ANCHOR:running-findings -->

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
[No exhausted approach categories yet]

<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All dimensions covered]

<!-- /ANCHOR:next-focus -->
