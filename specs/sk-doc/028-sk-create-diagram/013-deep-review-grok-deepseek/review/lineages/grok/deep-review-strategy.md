---
title: Deep Review Strategy
description: Grok fan-out lineage strategy for reviewing skill:sk-create-diagram.
trigger_phrases:
  - "deep review strategy"
  - "sk-create-diagram review"
importance_tier: normal
contextType: planning
version: 1.11.0.13
---

# Deep Review Strategy - Session Tracking

## 1. OVERVIEW

### Purpose

Persistent brain for the grok fan-out lineage reviewing `skill:sk-create-diagram`. Fan-out setup bindings named spec folder `specs/sk-doc/028-sk-create-diagram/013-deep-review-grok-deepseek` as the state home; parent `review/deep-review-config.json` binds the review target to the skill. Packet 013 has no `spec.md`, so scope is the skill tree plus hub/command registration files.

---

## 2. TOPIC

Review: skill:sk-create-diagram (nested sk-doc workflow packet: 27 HTML/SVG types, ascii-markdown flowcharts, draw.io/Mermaid import, PNG/SVG export, `/create:diagram` + `/create:flowchart` pass-through).

---

## 3. REVIEW DIMENSIONS (remaining)
<!-- MACHINE-OWNED: START -->
- [x] D1 Correctness, Logic errors, off-by-one, wrong return types, broken invariants
- [ ] D2 Security, Injection, auth bypass, secrets exposure, unsafe deserialization
- [ ] D3 Traceability, Spec/code alignment, checklist evidence, cross-reference integrity
- [ ] D4 Maintainability, Patterns, clarity, documentation quality, safe follow-on change cost
<!-- MACHINE-OWNED: END -->

---

## 4. NON-GOALS

- Implementing fixes during this review
- Re-running the 9 manual-testing-playbook scenarios
- Reviewing the upstream `context/` plugin source
- Changing files outside this lineage directory
- Reviewing sibling packets except where overlay protocols require a citation

---

## 5. STOP CONDITIONS

- Composite convergence after all 4 dimensions plus one stabilization pass, or `maxIterations=5`
- Rolling average of last 2 `newFindingsRatio` values below 0.08 with coverage_age >= 1
- Any confirmed P0 blocks PASS but does not by itself skip remaining dimensions
- Pause sentinel `.deep-review-pause` suspends the loop

---

## 6. COMPLETED DIMENSIONS
<!-- MACHINE-OWNED: START -->
[None yet -- populated as iterations complete dimension reviews]

| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|
| D1 Correctness | PASS | 1 | Three P2 advisories (html-only fallback checklist, nesting-depth false positive, unused LOAD_LEVELS); XXE and 27-type claim ruled out. |
<!-- MACHINE-OWNED: END -->

---

## 7. RUNNING FINDINGS
<!-- MACHINE-OWNED: START -->
- **P0 (Critical):** 0 active
- **P1 (Major):** 0 active
- **P2 (Minor):** 0 active
- **Delta this iteration:** +0 P0, +0 P1, +0 P2

[Findings are tracked in `deep-review-findings-registry.json`. This section provides a running count summary updated after each iteration.]
<!-- MACHINE-OWNED: END -->

---

## 8. WHAT WORKED

- Direct read of SKILL.md router + running `validate-flowchart.sh` on shipped pattern assets: produced file:line evidence without inference (iteration 1)

---

## 9. WHAT FAILED

[First iteration -- populated after iteration 1 completes]

---

## 10. EXHAUSTED APPROACHES (do not retry)

[None yet]

---

## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS

- Packet 013 as a self-contained spec-folder review: no `spec.md` / `plan.md` / `checklist.md` at init; reviewing it would audit an empty state home rather than the skill the parent config named.

---

## 12. NEXT FOCUS
<!-- MACHINE-OWNED: START -->
Dimension: security
Files: `.opencode/skills/sk-doc/sk-create-diagram/scripts/drawio_extract.py`, `scripts/mermaid_extract.py`, `scripts/validate-flowchart.sh`
Why: Trust boundary of extract CLIs (`--out` writes, XML/Mermaid parsing) after correctness found no P0/P1.
<!-- MACHINE-OWNED: END -->

---

## 13. KNOWN CONTEXT

prior_context: None (Spec Kit Memory MCP unavailable in this runtime).

resource-map.md not present; skipping coverage gate.

### Bounded Context Snapshot

- Target pointers: `.opencode/skills/sk-doc/sk-create-diagram/` (SKILL.md, references/{foundations,types,primitives,import-export,ascii-format}, assets/{templates,examples,ascii-patterns}, scripts/{drawio_extract.py,mermaid_extract.py,validate-flowchart.sh}), hub files `mode-registry.json` / `hub-router.json` / `leaf-manifest.json` / `command-metadata.json`, commands `/create:diagram` and `/create:flowchart`.
- Behavior claims: 27 HTML/SVG types; ascii-markdown flowchart format; draw.io/Mermaid extract-then-redraw; manual PNG/SVG export; hub registration without packet-local advisor identity; `/create:flowchart` is a pass-through that pre-selects ascii-markdown.
- Reuse and conventions: nested sk-doc workflow packet; router + presentation + auto/confirm YAML; `validate-flowchart.sh` exit 0 required including warning-only runs.
- Review risks and gaps: phase 008 reorganized `references/` and `assets/` into domain subfolders — registry files may still list flat paths. Phase 012 merged flowchart into this packet — command-metadata and hub aliases may lag. Graph coverage seed skipped (write-boundary: lineage dir only).
- Out of scope: `context/` source plugin, implementing fixes, parent `review/` merge artifacts.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pending | | Parent 028 + skill SKILL.md vs shipped files |
| `checklist_evidence` | core | pending | | 013 has no checklist.md; use packet playbook/benchmark evidence |
| `skill_agent` | overlay | notApplicable | | No dedicated create-diagram runtime agent |
| `agent_cross_runtime` | overlay | notApplicable | | No per-runtime agent definitions for this packet |
| `feature_catalog_code` | overlay | pending | | Catalog vs hub/command/skill files |
| `playbook_capability` | overlay | pending | | Playbook CMD-002 leaf-path expectation vs leaf-manifest |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| `.opencode/skills/sk-doc/sk-create-diagram/SKILL.md` | | | | pending |
| `.opencode/skills/sk-doc/sk-create-diagram/scripts/drawio_extract.py` | | | | pending |
| `.opencode/skills/sk-doc/sk-create-diagram/scripts/mermaid_extract.py` | | | | pending |
| `.opencode/skills/sk-doc/sk-create-diagram/scripts/validate-flowchart.sh` | | | | pending |
| `.opencode/skills/sk-doc/leaf-manifest.json` | | | | pending |
| `.opencode/skills/sk-doc/mode-registry.json` | | | | pending |
| `.opencode/skills/sk-doc/hub-router.json` | | | | pending |
| `.opencode/skills/sk-doc/command-metadata.json` | | | | pending |
| `.opencode/commands/create/diagram.md` | | | | pending |
| `.opencode/commands/create/flowchart.md` | | | | pending |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 5
- Convergence threshold: 0.10
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-grok-1786561206858-teuyl2, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: skill
- Cross-reference checks: core=spec_code,checklist_evidence, overlay=skill_agent,agent_cross_runtime,feature_catalog_code,playbook_capability
- Started: 2026-08-12T19:03:49Z
- Write boundary: `specs/sk-doc/028-sk-create-diagram/013-deep-review-grok-deepseek/review/lineages/grok` only
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
- P2 (Suggestions): 12
- Resolved: 0

<!-- /ANCHOR:running-findings -->

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### 27-type claim vs files: 27 `references/types/type-*.md` files exist and match the SKILL.md type table. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: 27-type claim vs files: 27 `references/types/type-*.md` files exist and match the SKILL.md type table.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: 27-type claim vs files: 27 `references/types/type-*.md` files exist and match the SKILL.md type table.

### Downgrading F-T-001: ascii-format nested paths in the same manifest prove the file is a filesystem index, not logical ids. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Downgrading F-T-001: ascii-format nested paths in the same manifest prove the file is a filesystem index, not logical ids.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Downgrading F-T-001: ascii-format nested paths in the same manifest prove the file is a filesystem index, not logical ids.

### Downgrading F-T-002: argumentHint is still `<target-diagram.html>` with no ascii-markdown flag. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Downgrading F-T-002: argumentHint is still `<target-diagram.html>` with no ascii-markdown flag.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Downgrading F-T-002: argumentHint is still `<target-diagram.html>` with no ascii-markdown flag.

### Extractor XXE / entity expansion as a correctness failure: `drawio_extract.py` rejects `<!DOCTYPE` / `<!ENTITY` before parse. [SOURCE: .opencode/skills/sk-doc/sk-create-diagram/scripts/drawio_extract.py:59] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Extractor XXE / entity expansion as a correctness failure: `drawio_extract.py` rejects `<!DOCTYPE` / `<!ENTITY` before parse. [SOURCE: .opencode/skills/sk-doc/sk-create-diagram/scripts/drawio_extract.py:59]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Extractor XXE / entity expansion as a correctness failure: `drawio_extract.py` rejects `<!DOCTYPE` / `<!ENTITY` before parse. [SOURCE: .opencode/skills/sk-doc/sk-create-diagram/scripts/drawio_extract.py:59]

### Grep for `\bif\b` in `simple-workflow.md` found no hits, so the loose `if` token in `check_decision_labels` did not fire on that asset. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Grep for `\bif\b` in `simple-workflow.md` found no hits, so the loose `if` token in `check_decision_labels` did not fire on that asset.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Grep for `\bif\b` in `simple-workflow.md` found no hits, so the loose `if` token in `check_decision_labels` did not fire on that asset.

### Mermaid code execution: no `eval`/`exec`/`subprocess`/`urlopen`; click targets counted and discarded per module docstring. [SOURCE: .opencode/skills/sk-doc/sk-create-diagram/scripts/mermaid_extract.py:7] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Mermaid code execution: no `eval`/`exec`/`subprocess`/`urlopen`; click targets counted and discarded per module docstring. [SOURCE: .opencode/skills/sk-doc/sk-create-diagram/scripts/mermaid_extract.py:7]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Mermaid code execution: no `eval`/`exec`/`subprocess`/`urlopen`; click targets counted and discarded per module docstring. [SOURCE: .opencode/skills/sk-doc/sk-create-diagram/scripts/mermaid_extract.py:7]

### Missing type files vs the 27-type claim: 27 `references/types/type-*.md` exist and match the SKILL.md table. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Missing type files vs the 27-type claim: 27 `references/types/type-*.md` exist and match the SKILL.md table.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Missing type files vs the 27-type claim: 27 `references/types/type-*.md` exist and match the SKILL.md table.

### Packet-local advisor identity: no packet-root `graph-metadata.json` (playbook invariant holds). -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Packet-local advisor identity: no packet-root `graph-metadata.json` (playbook invariant holds).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Packet-local advisor identity: no packet-root `graph-metadata.json` (playbook invariant holds).

### Packet-owned network fetch during onboarding: onboarding.md states fetch is performed by the calling session; packet tool surface has no network-fetch tool. [SOURCE: .opencode/skills/sk-doc/sk-create-diagram/references/foundations/onboarding.md:38] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Packet-owned network fetch during onboarding: onboarding.md states fetch is performed by the calling session; packet tool surface has no network-fetch tool. [SOURCE: .opencode/skills/sk-doc/sk-create-diagram/references/foundations/onboarding.md:38]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Packet-owned network fetch during onboarding: onboarding.md states fetch is performed by the calling session; packet tool surface has no network-fetch tool. [SOURCE: .opencode/skills/sk-doc/sk-create-diagram/references/foundations/onboarding.md:38]

### Restating F-T-003 as a maintainability finding: same alias drift, already recorded. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Restating F-T-003 as a maintainability finding: same alias drift, already recorded.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Restating F-T-003 as a maintainability finding: same alias drift, already recorded.

### Restating unused LOAD_LEVELS: already F-C-003. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Restating unused LOAD_LEVELS: already F-C-003.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Restating unused LOAD_LEVELS: already F-C-003.

### Secrets in skill tree: none observed in extractors or SKILL.md. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Secrets in skill tree: none observed in extractors or SKILL.md.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Secrets in skill tree: none observed in extractors or SKILL.md.

### Validator hard-failing the shipped pattern assets: both assets exit 0. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Validator hard-failing the shipped pattern assets: both assets exit 0.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Validator hard-failing the shipped pattern assets: both assets exit 0.

### XXE / DTD expansion: `_reject_unsafe_xml` rejects `<!DOCTYPE` and `<!ENTITY` before parse. [SOURCE: .opencode/skills/sk-doc/sk-create-diagram/scripts/drawio_extract.py:59] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: XXE / DTD expansion: `_reject_unsafe_xml` rejects `<!DOCTYPE` and `<!ENTITY` before parse. [SOURCE: .opencode/skills/sk-doc/sk-create-diagram/scripts/drawio_extract.py:59]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: XXE / DTD expansion: `_reject_unsafe_xml` rejects `<!DOCTYPE` and `<!ENTITY` before parse. [SOURCE: .opencode/skills/sk-doc/sk-create-diagram/scripts/drawio_extract.py:59]

<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All dimensions covered]

<!-- /ANCHOR:next-focus -->
