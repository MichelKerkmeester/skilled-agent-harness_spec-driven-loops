# Deep Review Iteration 004

## Dispatcher
- Target: `.opencode/skills/sk-doc/create-readme/`
- Spec folder: `.opencode/specs/skilled-agent-orchestration/125-sk-doc-parent/010-subskill-doc-review/002-create-readme`
- Mode: review
- Focus: maintainability, final template-fidelity sweep, de-duplication, route-proof and synthesis
- Budget profile: verify
- Route proof: `target_agent=deep-review`, `agent_definition_loaded=true`, `mode=review`, resolved route points to the create-readme target and packet-local review artifact directory.

## Files Reviewed
- `.opencode/skills/sk-doc/create-readme/SKILL.md`
- `.opencode/skills/sk-doc/create-readme/README.md`
- `.opencode/skills/sk-doc/create-readme/references/README.md`
- `.opencode/skills/sk-doc/create-readme/assets/readme/readme_template.md`
- `.opencode/skills/sk-doc/create-readme/assets/readme/readme_code_template.md`
- `.opencode/skills/sk-doc/create-readme/assets/readme/install_guide_template.md`
- `.opencode/skills/sk-doc/create-readme/references/readme/writing_patterns.md`
- `.opencode/skills/sk-doc/create-readme/references/readme/types_and_voice.md`
- `.opencode/skills/sk-doc/create-readme/references/readme/quality_and_checklist.md`
- `.opencode/skills/sk-doc/create-readme/references/install_guide/section_examples.md`
- `.opencode/skills/sk-doc/create-readme/references/install_guide/quality_and_standards.md`
- `.opencode/skills/sk-doc/shared/scripts/validate_document.py`
- `.opencode/skills/sk-doc/create-readme/scripts/audit_readmes.py`
- `.opencode/skills/sk-code/code-review/references/review_core.md`

## Findings - New

### P0 Findings

None. Final route-proof parse confirmed zero active P0 findings across iterations 1-3 before this iteration.

### P1 Findings

None.

### P2 Findings

1. **Install-guide template still carries stale parent-hub mode wording** -- `.opencode/skills/sk-doc/create-readme/assets/readme/install_guide_template.md:992` -- The create-readme packet identifies itself as a nested workflow packet that owns README and install-guide authoring, and its README says `SKILL.md` is the authoritative local workflow contract. The install-guide asset's related-resource footer labels the local `../../SKILL.md` link as `sk-doc SKILL.md - Mode 4: Install Guide Creation`, which reads like stale parent-hub or monolithic-mode terminology rather than the current nested `create-readme` packet. This is not a blocking workflow defect because the link resolves, but it increases maintenance drift in the asset users copy for future guides. [SOURCE: `.opencode/skills/sk-doc/create-readme/assets/readme/install_guide_template.md:992`] [SOURCE: `.opencode/skills/sk-doc/create-readme/SKILL.md:12`] [SOURCE: `.opencode/skills/sk-doc/create-readme/SKILL.md:37`] [SOURCE: `.opencode/skills/sk-doc/create-readme/README.md:25`] [SOURCE: `.opencode/skills/sk-doc/create-readme/README.md:58`]
   - Recommendation: Rename the related-resource label to `create-readme SKILL.md - README and install-guide workflow contract` or similar current nested-packet wording.
   - Finding class: instance-only
   - Scope proof: Grep for `Mode 4|sk-doc SKILL|legacy|deprecated|monolith` in the target found this active stale mode label as the only durable parent-mode wording outside illustrative deprecation prose.
   - Affected surface hints: `install_guide_template.md`, asset back-links, related-resource footer

## Traceability Checks
- Final validator baseline: all required target docs still return `valid: true`, `total_issues: 0` for their requested sk-doc types.
- Final route-proof parse: iterations 1-3 were present before this write with `target_agent=deep-review`, `agent_definition_loaded=true`, `mode=review` and non-empty `resolved_route`; iteration 4 writes the same fields.
- Final P0 check: accumulated iteration findings before iteration 4 contained zero P0 findings.
- Final relative markdown link check: 58 links checked across target docs and assets, with one known broken asset example link carried forward from iteration 1.

## Integration Evidence
- Validator commands run from repo root with JSON output:
  - `python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py .opencode/skills/sk-doc/create-readme/SKILL.md --type skill --json` -> `valid: true`, total issues 0.
  - `python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py .opencode/skills/sk-doc/create-readme/README.md --type readme --json` -> `valid: true`, total issues 0.
  - `python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py .opencode/skills/sk-doc/create-readme/references/README.md --type reference --json` -> `valid: true`, total issues 0.
  - `python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py .opencode/skills/sk-doc/create-readme/references/readme/writing_patterns.md --type reference --json` -> `valid: true`, total issues 0.
  - `python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py .opencode/skills/sk-doc/create-readme/references/readme/types_and_voice.md --type reference --json` -> `valid: true`, total issues 0.
  - `python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py .opencode/skills/sk-doc/create-readme/references/readme/quality_and_checklist.md --type reference --json` -> `valid: true`, total issues 0.
  - `python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py .opencode/skills/sk-doc/create-readme/references/install_guide/section_examples.md --type reference --json` -> `valid: true`, total issues 0.
  - `python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py .opencode/skills/sk-doc/create-readme/references/install_guide/quality_and_standards.md --type reference --json` -> `valid: true`, total issues 0.
- Tool flag checks: `audit_readmes.py --help` and `validate_document.py --help` completed successfully during final verification.

## Edge Cases
- A packet-local `review-report.md` was requested conditionally by the dispatcher, but this leaf agent's write contract allows only the iteration artifact, strategy and canonical JSONL state log. Synthesis is therefore embedded in this final iteration artifact rather than a separate report file.
- The reducer-owned findings registry remains read-only and stale at its initialized counts; cumulative counts here come from the canonical JSONL iteration records and final artifact synthesis.
- No separate delta JSONL was written because the leaf-agent write boundary does not permit extra state artifacts.

## Confirmed-Clean Surfaces
- No active P0 findings were found in accumulated iteration state.
- `SKILL.md` is self-sufficient as the primary workflow contract for ordinary README and install-guide authoring.
- Required references are grouped into `readme/` and `install_guide/` and are referenced by `references/README.md`.
- Required validator commands pass with zero blocking issues.
- Tool and flag claims inspected in `validate_document.py` and `audit_readmes.py` exist on disk.

## Ruled Out
- Did not duplicate prior P1/P2 findings as new maintainability findings.
- Did not treat the known broken deprecation example link as new because it was already recorded as P2-001.
- Did not write `review-report.md`, dashboard, reducer output or registry updates because the leaf contract marks reports and reducer-owned files as read-only.

## Synthesis - Cumulative Review Result
- Final verdict: CONDITIONAL.
- Cumulative active findings: P0=0, P1=3, P2=2.
- P1-001: `install_guide_template.md` exposes copyable sections 11-14 though `SKILL.md` defines install guides as sections 0-10. Fix by making the copyable scaffold match sections 0-10 and moving extra material to non-copyable overflow.
- P1-002: `install_guide_template.md` teaches bullet-style troubleshooting examples though the contract requires a 3-column `Error | Cause | Fix` table. Fix by replacing copyable troubleshooting examples with the table shape and at least five actionable rows.
- P1-003: `install_guide_template.md:344-345` tells users to export an API key and then `echo` it. Fix by using a non-printing presence check and safe secret-handling guidance.
- P2-001: `install_guide_template.md` deprecation example links to missing `./MCP - New Tool.md`. Fix by using a placeholder, an existing example or an explicit replace-before-publish note.
- P2-002: `install_guide_template.md:992` carries stale `sk-doc SKILL.md - Mode 4` wording. Fix the label to current `create-readme` nested-packet wording.

## Next Focus
- dimension: complete
- focus area: remediation planning for active P1/P2 findings in `install_guide_template.md`
- reason: max-iterations stop policy reached; all requested dimensions have been reviewed
- rotation status: traceability, correctness, security and maintainability complete
- blocked/productive carry-forward: semantic template-contract review was productive; validator-only checks are insufficient for these findings
- required evidence: use the cited source lines in iterations 001-004 as the remediation planning packet
