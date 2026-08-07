# Iteration 4: Maintainability and Link Integrity

## Dispatcher

- Route: `mode=review target_agent=deep-review`
- Budget: verify

## Dimension

Maintainability of authored navigation after the reference-file split.

## Files Reviewed

- `.opencode/skills/sk-code/code-webflow/references/debugging/error_recovery.md:110-114`
- `.opencode/skills/sk-code/code-webflow/references/css/quick_reference.md:18-193`
- `.opencode/skills/sk-code/code-opencode/references/config/quality_standards.md`
- Repository markdown-link checker output.

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **F002: Reference splits left broken markdown links across shipped sk-code docs** -- `.opencode/skills/sk-code/code-webflow/references/debugging/error_recovery.md:113-114` -- The split deleted monolithic targets but authored docs still link to them. The deterministic checker reports 154 repository-wide broken links, including a large `sk-code` cluster: `minification_guide.md`, `debugging_workflows.md`, `verification_workflows.md`, `dev_workflow.md`, JavaScript/CSS quality and style guides, implementation workflow directories, and code-opencode shared docs. This contradicts phase 010 R2 (`no deleted path remains`) and phase 012's claim that all part links resolve [SOURCE: .opencode/specs/sk-code/018-rust-standards-for-code-opencode/010-code-webflow-other-references/spec.md:77-89].
   Finding class: broken_reference_graph
   Scope proof: the broken links point to files deleted by phases 008-010.
   Affected surface hints: human navigation, skill resource discovery, documentation integrity.

```json
{"findingId":"F002","type":"claim_adjudication","claim":"The hygiene split left active authored markdown links pointing at deleted monolithic files.","evidenceRefs":[".opencode/skills/sk-code/code-webflow/references/debugging/error_recovery.md:113-114",".opencode/specs/sk-code/018-rust-standards-for-code-opencode/010-code-webflow-other-references/spec.md:77-89"],"counterevidenceSought":"Ran the repository markdown-link checker, which resolves links against both source-relative and repository-root locations; the named targets fail both resolution modes.","alternativeExplanation":"Some display text intentionally preserves old filenames, but these are actual markdown href targets, not display-only historical prose.","finalSeverity":"P1","confidence":0.99,"downgradeTrigger":"Rewire all active sk-code href targets to valid part files or directories and make the scoped markdown-link checker clean.","transitions":[{"iteration":4,"from":null,"to":"P1","reason":"Confirmed active navigation failures after split"}]}
```

### P2 Findings

None.

## Traceability Checks

- Phase 010's dangling-link success criterion is not met by the current authored surface.

## Edge Cases

- The checker includes unrelated repository failures; F002 is limited to directly observed `sk-code` links tied to this packet's deleted files.

## Next Focus

Traceability: benchmark/playbook gold after the code-quality checklist split.

Review verdict: CONDITIONAL
