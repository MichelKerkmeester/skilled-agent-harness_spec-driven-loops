# Deep Review Iteration 002

## Dispatcher
- Target: `.opencode/skills/sk-doc/create-readme/`
- Spec folder: `.opencode/specs/skilled-agent-orchestration/125-sk-doc-parent/010-subskill-doc-review/002-create-readme`
- Mode: review
- Focus: correctness and template fidelity, especially `SKILL.md` self-sufficiency and reference overflow boundaries
- Budget profile: verify
- Route proof: `target_agent=deep-review`, `agent_definition_loaded=true`, `mode=review`, resolved route points to the create-readme target and packet-local review artifact directory.

## Files Reviewed
- `.opencode/skills/sk-doc/create-readme/SKILL.md`
- `.opencode/skills/sk-doc/create-readme/references/README.md`
- `.opencode/skills/sk-doc/create-readme/references/readme/types_and_voice.md`
- `.opencode/skills/sk-doc/create-readme/references/readme/writing_patterns.md`
- `.opencode/skills/sk-doc/create-readme/references/install_guide/section_examples.md`
- `.opencode/skills/sk-doc/create-readme/references/install_guide/quality_and_standards.md`
- `.opencode/skills/sk-doc/create-readme/assets/readme/readme_template.md`
- `.opencode/skills/sk-doc/create-readme/assets/readme/install_guide_template.md`
- `.opencode/skills/sk-doc/create-readme/scripts/audit_readmes.py`
- `.opencode/skills/sk-doc/shared/scripts/validate_document.py`
- `.opencode/skills/sk-code/code-review/references/review_core.md`

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **Install-guide template teaches a non-table troubleshooting format where the workflow requires a 3-column table** -- `.opencode/skills/sk-doc/create-readme/assets/readme/install_guide_template.md:273` -- `SKILL.md` defines the install-guide troubleshooting format as a three-column `Error | Cause | Fix` table, and the overflow quality reference repeats that troubleshooting must use a 5+ entry, 3-column table. The primary install-guide template also says `Use 3-column format: Error → Cause → Fix`, but its immediate required example is not a table. It shows `### Common Errors` followed by bold error headings and bullet `Cause` / `Fix` blocks. A user copying the template can therefore produce troubleshooting that fails the primary workflow's required format. [SOURCE: `.opencode/skills/sk-doc/create-readme/SKILL.md:267`] [SOURCE: `.opencode/skills/sk-doc/create-readme/SKILL.md:269`] [SOURCE: `.opencode/skills/sk-doc/create-readme/SKILL.md:321`] [SOURCE: `.opencode/skills/sk-doc/create-readme/references/install_guide/quality_and_standards.md:35`] [SOURCE: `.opencode/skills/sk-doc/create-readme/references/install_guide/quality_and_standards.md:79`] [SOURCE: `.opencode/skills/sk-doc/create-readme/assets/readme/install_guide_template.md:273`] [SOURCE: `.opencode/skills/sk-doc/create-readme/assets/readme/install_guide_template.md:277`] [SOURCE: `.opencode/skills/sk-doc/create-readme/assets/readme/install_guide_template.md:280`] [SOURCE: `.opencode/skills/sk-doc/create-readme/assets/readme/install_guide_template.md:281`]
   - Recommendation: Replace the bullet-style troubleshooting examples in `install_guide_template.md` with the exact `| Error | Cause | Fix |` table shape, including at least five rows in the copyable scaffold or an explicit instruction to add five rows.
   - Finding class: cross-consumer
   - Scope proof: Direct reads compared the primary workflow, install-guide quality reference and primary install-guide template; the same three-column table contract appears in the workflow and quality reference, while the template example diverges.
   - Affected surface hints: `install_guide_template.md`, install-guide troubleshooting sections, install-guide validation checklist
   ```json
   {"type":"template_contract_mismatch","claim":"The install-guide template's troubleshooting example contradicts the workflow-required three-column table format.","evidenceRefs":[".opencode/skills/sk-doc/create-readme/SKILL.md:267",".opencode/skills/sk-doc/create-readme/SKILL.md:269",".opencode/skills/sk-doc/create-readme/SKILL.md:321",".opencode/skills/sk-doc/create-readme/references/install_guide/quality_and_standards.md:35",".opencode/skills/sk-doc/create-readme/references/install_guide/quality_and_standards.md:79",".opencode/skills/sk-doc/create-readme/assets/readme/install_guide_template.md:273",".opencode/skills/sk-doc/create-readme/assets/readme/install_guide_template.md:277",".opencode/skills/sk-doc/create-readme/assets/readme/install_guide_template.md:280",".opencode/skills/sk-doc/create-readme/assets/readme/install_guide_template.md:281"],"counterevidenceSought":"Checked the quality reference and the template's own preceding sentence. Both support the table requirement rather than the bullet example.","alternativeExplanation":"The bullet examples may be legacy explanatory material, but the template labels the pattern required and places it in the primary template users are told to copy.","finalSeverity":"P1","confidence":"high","downgradeTrigger":"Downgrade to P2 if the bullet examples are moved to non-copyable explanatory prose or the workflow intentionally permits both table and bullet troubleshooting forms."}
   ```

### P2 Findings

None.

## Traceability Checks
- `SKILL.md` remains the complete primary workflow contract for the main task flow: it contains the numbered operating model, README workflow, output shapes, install-guide workflow, validation and writing rules. [SOURCE: `.opencode/skills/sk-doc/create-readme/SKILL.md:76`] [SOURCE: `.opencode/skills/sk-doc/create-readme/SKILL.md:90`] [SOURCE: `.opencode/skills/sk-doc/create-readme/SKILL.md:200`] [SOURCE: `.opencode/skills/sk-doc/create-readme/SKILL.md:278`] [SOURCE: `.opencode/skills/sk-doc/create-readme/SKILL.md:326`]
- `references/README.md` states references are overflow-only, and inspected references generally add tables, examples, quality weights and writing details rather than replacing the numbered workflow. [SOURCE: `.opencode/skills/sk-doc/create-readme/references/README.md:17`] [SOURCE: `.opencode/skills/sk-doc/create-readme/references/README.md:23`]
- The install-guide references are not entirely clean because their table-format contract conflicts with the primary template example captured as P1-002.

## Integration Evidence
- Validator commands run from repo root with JSON output:
  - `python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py .opencode/skills/sk-doc/create-readme/SKILL.md --type skill --json` -> `valid: true`, total issues 0.
  - `python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py .opencode/skills/sk-doc/create-readme/README.md --type readme --json` -> `valid: true`, total issues 0.
  - `python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py .opencode/skills/sk-doc/create-readme/references/README.md --type reference --json` -> `valid: true`, total issues 0.
  - `python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py .opencode/skills/sk-doc/create-readme/references/readme/types_and_voice.md --type reference --json` -> `valid: true`, total issues 0.
  - `python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py .opencode/skills/sk-doc/create-readme/references/readme/writing_patterns.md --type reference --json` -> `valid: true`, total issues 0.
  - `python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py .opencode/skills/sk-doc/create-readme/references/readme/quality_and_checklist.md --type reference --json` -> `valid: true`, total issues 0.
  - `python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py .opencode/skills/sk-doc/create-readme/references/install_guide/section_examples.md --type reference --json` -> `valid: true`, total issues 0.
  - `python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py .opencode/skills/sk-doc/create-readme/references/install_guide/quality_and_standards.md --type reference --json` -> `valid: true`, total issues 0.
- Tool flag checks:
  - `python3 .opencode/skills/sk-doc/create-readme/scripts/audit_readmes.py --help` confirmed `--repo-root`, `--validator`, `--inventory-out`, `--json-out` and `--markdown-out`.
  - `python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py --help` confirmed `--type`, `--json`, `--blocking-only`, `--fix`, `--dry-run` and `--no-exclude`.

## Edge Cases
- Iteration 2 did not write a separate delta JSONL because the leaf-agent write contract only permits the iteration artifact, strategy file and canonical state log.
- `references/readme/types_and_voice.md` and `references/readme/writing_patterns.md` overlap with `SKILL.md` concepts, but the inspected overlap is accompanied by type tables, worked examples and detailed patterns. I treated it as genuine overflow rather than an active duplicate-workflow finding.
- The existing iteration 1 P1 remains active and overlaps the same install-guide template surface; P1-002 is separate because it concerns troubleshooting format, not the 0-10 section-count mismatch.

## Confirmed-Clean Surfaces
- Required target docs still validate with 0 blocking issues against their requested sk-doc template types.
- `SKILL.md` carries the inline workflow steps needed to run README and install-guide authoring without loading references for the ordinary path.
- The audited script and validator flags claimed by the docs exist in the real scripts.
- README references are grouped under `readme/` and install-guide references under `install_guide/`.

## Ruled Out
- Did not re-file iteration 1's `install_guide_template.md` sections 11-14 mismatch as a new finding.
- Did not classify README reference overlap as duplicate workflow because the inspected files provide detail and examples behind `SKILL.md` sections rather than an alternate numbered workflow.
- Did not treat validator success as proof of template fidelity; the new finding is a semantic template-contract mismatch outside validator coverage.

## Next Focus
- dimension: security
- focus area: review install-guide commands, environment examples, config snippets and audit script behavior for unsafe guidance, secrets exposure or destructive operations
- reason: correctness has identified template-contract mismatches; the next dimension should check whether any guidance creates security or safety risk
- rotation status: traceability and correctness complete; security next, maintainability remains
- blocked/productive carry-forward: template-contract comparisons remain productive; avoid repeating validator-only checks unless evidence changed
- required evidence: install-guide configuration snippets, shell commands, audit script subprocess/write behavior, guidance around secrets and environment variables
