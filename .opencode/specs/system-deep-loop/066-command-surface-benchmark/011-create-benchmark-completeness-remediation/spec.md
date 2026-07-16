---
title: "Feature Specification: create-benchmark completeness remediation"
description: "Remediate the create-benchmark authoring home against the Fable 5 + GPT-5.6 Sol Ultra dual review: fix the broken smart-router fallback, add a schema-v2 behavior scaffold, complete the live conformance exemplar, first-class the command benchmark, and clear the cross-tree staleness sweep."
status: in_progress
trigger_phrases:
  - "create-benchmark completeness remediation"
  - "create-benchmark router fix"
  - "behavior scenario v2 scaffold"
  - "command benchmark first-classing"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/066-command-surface-benchmark/011-create-benchmark-completeness-remediation"
    last_updated_at: "2026-07-16T04:35:00Z"
    last_updated_by: "claude"
    recent_action: "Authored remediation spec from the Fable 5 + Sol Ultra dual review"
    next_safe_action: "Execute P1 fixes (router, behavior v2 scaffold, conformance exemplar)"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/create-benchmark/SKILL.md"
      - ".opencode/skills/sk-doc/create-benchmark/references/shared/README.md"
      - ".opencode/skills/sk-doc/create-benchmark/assets/behavior_benchmark/behavior_benchmark_scenario_template.md"
      - ".opencode/skills/system-deep-loop/deep-alignment/assets/conformance_benchmark/command-surface/"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: create-benchmark completeness remediation

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In progress |
| **Created** | 2026-07-15 |
| **Parent Spec** | ../spec.md |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Two independent reviewers — Fable 5 (Claude family) and GPT-5.6 Sol Ultra — audited whether `sk-doc/create-benchmark` is the complete, correct benchmark-authoring home for every benchmark family that exists in `system-deep-loop` and the wider repo. Both confirmed the ownership boundary is correct: evaluators, scorers, and runtime stay lane-local and nothing is duplicated. Both also surfaced a short list of real authored-input and routing gaps, each verified against source. This phase fixes those findings. The two review reports are preserved verbatim under `evidence/`.

Every fix is behavior-preserving documentation and template work: no scoring, evaluator, scheduler, or runtime logic changes. The single functional defect is create-benchmark's own smart-router fallback, which resolves to a non-existent file.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

**In scope (full-sweep, operator-directed):**
- **P1 router fix:** repoint the smart-router `DEFAULT_RESOURCE` from the non-existent `references/README.md` to `references/shared/README.md`, and add a family-to-disk-key map so `mcp_promotion` loads its `shared/` assets.
- **P1 behavior v2 scaffold:** extend the behavior scenario/index templates so a schema-v2 command-behavior scenario can be authored (schema_version, topology, postconditions, direct-dispatch targets, boundary); make the index result-schema wording conditional; update the guide's fixed-prefix and alignment framing.
- **P1 conformance exemplar completion:** author the missing `command-surface` family `README.md` and `conformance_benchmark.md`; correct the guide's "planned adapter" wording for the now-shipped adapter.
- **P2 command-benchmark first-classing:** add a matrix-manifest field guide/template, a composition entry, and routing keys/triggers so "command benchmark" is discoverable and routable by name.
- **P2 staleness sweep (local):** the phantom "Lane D" reference, the stale route-map (`references/shared/README.md`), plain-text deep-command links, and the unlinked Lane C fixture-authoring doctrine.
- **P2 cross-tree exemplar sweep:** the system-spec-kit MCP `benchmarks/README.md` stale pointers and validator path, the report-template href, the Lane C exemplar READMEs, and create-benchmark back-pointers in the four behavior indexes missing them.

**Out of scope:**
- Any evaluator, scorer, reviewer-verdict, scheduler, adapter, or runtime code — lane-local and correct.
- The 066 behavioral capture matrix and its scorecard — separate 066 closeout work.
- Reverting the sk-code / sk-git hyphen-naming pilot: the Lane C exemplar fix aligns toward hyphen-case, never back to snake_case.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **REQ-001 (P0):** create-benchmark's smart-router fallback resolves to an existing file, and every declared family loads its own assets.
- **REQ-002 (P1):** An author can produce a schema-v2 command-behavior scenario from the create-benchmark templates + guide without hand-deriving fields from the framework.
- **REQ-003 (P1):** The only shipped conformance package (`command-surface`) satisfies the family README + per-benchmark contract that §12 and `/create:benchmark` declare required, and no guide calls the shipped adapter "planned."
- **REQ-004 (P2):** "Command benchmark" is discoverable and routable by name, and its matrix manifest has an authored field shape.
- **REQ-005 (P2):** The staleness and cross-tree exemplar findings are cleared or explicitly labeled legacy; no create-benchmark guide points at a non-existent target.
- **REQ-006 (P1):** A GPT-5.6 Sol Ultra re-review confirms the P1 findings are closed and no regression was introduced.
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- `references/README.md` fallback no longer referenced; the router loads a real file for every family key.
- A v2 scenario authored purely from the template validates against the shipped runner's schema-v2 expectations.
- `command-surface` conformance package contains its README + contract; `validate_document.py` passes on both.
- All edited create-benchmark and cross-tree docs pass `validate_document.py`; no broken cross-links.
- The GPT-5.6 Sol Ultra re-review returns no surviving P1 and no new regression.
- `validate.sh --strict` on this child is Errors:0.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Hyphen-naming pilot collision** — the sk-code Lane C exemplar sits in the hyphen-case pilot; the fix aligns toward hyphens or labels legacy, never reverts to snake_case.
- **Concurrent session** — cross-tree files live in the main tree alongside a concurrent operator session; all commits are pathspec-scoped.
- **066-adjacency** — the conformance exemplar completion overlaps 066 closeout; authored here to unblock the review, cross-referenced in 010.
- Dependencies: the shipped behavior framework/runner, the `sk-doc-command` adapter, and the `/create:benchmark` authoring command (all present).
<!-- /ANCHOR:risks -->

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

- **Behavior preservation:** no runtime, scoring, or scheduling behavior changes; edits are documentation, templates, and one router-fallback string.
- **Validation parity:** every edited doc must pass the same `validate_document.py` type check it passed before, with zero new issues.
- **Reversibility:** each fix is an isolated doc/template edit revertable by a single `git revert` without cross-file coupling.
- **Traceability:** every fix maps to a numbered finding in the archived dual-review reports under `evidence/`.
<!-- /ANCHOR:nfr -->

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- **Conformance docs are 066-owed, not authored here:** if the missing `command-surface` README/contract are deemed 066 phase work, this child records the finding and defers authoring to 066 closeout rather than duplicating it.
- **sk-code naming already ahead of the pilot:** where the Lane C exemplar README already uses hyphen-case ahead of the on-disk snake_case dirs, the fix labels the on-disk dirs legacy rather than "correcting" the README backward.
- **Non-promoted MCP folders:** dated MCP folders missing required files are labeled legacy, not back-filled with fabricated results.
<!-- /ANCHOR:edge-cases -->

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- None open. Operator directed: fold into 066 (this child), full-sweep blast radius, re-review with GPT-5.6 Sol Ultra Fast.
<!-- /ANCHOR:questions -->

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- Parent: `../spec.md` (system-deep-loop/066-command-surface-benchmark).
- Sibling closeout: `../010-scorecard-and-closeout/`.
- Evidence: `evidence/review-sol-ultra.md`, `evidence/review-fable.md`.
- Predecessor workstream: `sk-doc/017-benchmark-authoring-centralization`, `sk-doc/018-sk-doc-router-alignment`.
<!-- /ANCHOR:related-docs -->
