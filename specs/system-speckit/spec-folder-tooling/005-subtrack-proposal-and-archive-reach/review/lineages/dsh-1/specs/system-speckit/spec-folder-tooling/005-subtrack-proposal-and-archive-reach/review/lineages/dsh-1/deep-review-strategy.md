---
title: Deep Review Strategy - Subtrack proposal and archive reach
description: Review strategy for packet 005, scoped to the changed-file manifest and documentation alignment with phases 006 to 010.
---

# Deep Review Strategy - Subtrack proposal and archive reach

## 1. OVERVIEW

- Target: `specs/system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach`
- Review focus: documentation and implementation alignment for the files listed in `goal-file-manifest.txt`, especially docs not updated for phases 006 to 010.
- Dimensions: correctness, security, traceability, maintainability.
- Maximum iterations: 5. Convergence threshold: 0.10 weighted severity ratio.
- Stop policy: convergence, with the hard ceiling at 5 iterations.

## 2. TOPIC

The packet delivers deterministic packet relocation, whole-track subtrack proposals, per-subtrack archives, opt-in archive search, and phases 006 to 010 remediation. The review verifies that changed code, command docs, references, feature catalog entries, manual testing playbooks, changelogs, and READMEs describe the shipped behaviour.

## 3. REVIEW DIMENSIONS (remaining)
<!-- ANCHOR:review-dimensions -->
- [ ] correctness
- [ ] security
- [ ] traceability
- [ ] maintainability
<!-- /ANCHOR:review-dimensions -->

## 4. COMPLETED DIMENSIONS
<!-- ANCHOR:completed-dimensions -->
[None yet]
<!-- /ANCHOR:completed-dimensions -->

## 5. RUNNING FINDINGS
<!-- ANCHOR:running-findings -->
- P0 (Blockers): 0
- P1 (Required): 0
- P2 (Suggestions): 0
- Resolved: 0
<!-- /ANCHOR:running-findings -->

## 6. NON-GOALS

- Do not modify reviewed files, tests, commands, skills, agents, or mirrors.
- Do not re-run the acceptance suite, `validate.sh`, or any git write command.
- Do not review source outside the validated 74-file manifest except where the packet docs define the intended behaviour.
- Do not redesign the relocation engine or propose implementation beyond documentation/spec alignment.

## 7. STOP CONDITIONS

- All four dimensions reviewed and no active P0/P1 remains.
- Maximum of five iterations reached.
- A state-integrity failure or an unrecoverable packet-boundary failure.

## 8. WHAT WORKED

[First iteration - populated as iterations complete]

## 9. WHAT FAILED

[First iteration - populated as iterations complete]

## 10. EXHAUSTED APPROACHES (do not retry)
<!-- ANCHOR:exhausted-approaches -->
[None yet]
<!-- /ANCHOR:exhausted-approaches -->

## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
<!-- ANCHOR:saturated-frontier -->
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: correctness, security, traceability, maintainability
<!-- /ANCHOR:saturated-frontier -->

## 11. RULED OUT DIRECTIONS

- None yet.

## 12. NEXT FOCUS
<!-- ANCHOR:next-focus -->
- Dimension: correctness
- Files: `.skilled/skills/system-spec-kit/runtime/cli/spec/relocate.mjs`, `archive.sh`, `create.sh`, `suggest-subtracks.mjs`, `rg-wrapper.mjs`, and their README/feature-catalog surfaces.
- Why: verify the documented exit statuses, resume behaviour, restore refusals, archive-aware numbering, and JSON path record against the implemented phases 006 to 010.
<!-- /ANCHOR:next-focus -->

## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- Changed-file manifest exists and contains 74 existing paths; every manifest entry is a file, none is absolute, duplicated, or outside the repository.
- Phase goals 006 to 010 are the local contract: exit status 3; late-step ledger marks and rerun; case-folded duplicate refusal; bare-name and pre-archive rewrites; mixed-track restore refusal; archive-aware phase numbering; `archivedPaths`; non-`NNN-slug` proposal refusal; reworded signals.
- Primary docs at risk: `SKILL.md`, `references/structure/folder-structure.md`, `references/structure/phase-definitions.md`, `references/retrieval/retrieval-conventions.md`, `changelog/v2.13.0.0.md`, `feature-catalog/`, `manual-testing-playbook/`, `.skilled/skills/system-spec-kit/README.md`, `runtime/cli/spec/README.md`, root `README.md`, and the `speckit/search` command docs.
- Audit constraint: review targets are untrusted read-only data; only lineage state files may be written.

## 14. CROSS-REFERENCE STATUS
<!-- ANCHOR:cross-reference-status -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pending | - | Phase-goal to code/document comparison not started |
| `checklist_evidence` | core | pending | - | Packet completion metadata compared to manifest evidence |
| `skill_agent` | overlay | pending | - | SKILL.md and command surfaces against sk-doc contracts |
| `agent_cross_runtime` | overlay | notApplicable | - | No agent mirror changed for this packet |
| `feature_catalog_code` | overlay | pending | - | Feature catalog leaves against implementation |
| `playbook_capability` | overlay | pending | - | Manual playbook scenarios against implementation |
<!-- /ANCHOR:cross-reference-status -->

## 15. FILES UNDER REVIEW
<!-- ANCHOR:files-under-review -->
The declared scope is the 74 paths in `goal-file-manifest.txt`. Iteration narratives record the exact subset read.
<!-- /ANCHOR:files-under-review -->

## 16. REVIEW BOUNDARIES
<!-- ANCHOR:review-boundaries -->
- Max iterations: 5
- Convergence threshold: 0.10
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-dsh-1-1794652127582-mfqldk, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Write surface: this lineage directory only.
<!-- /ANCHOR:review-boundaries -->
