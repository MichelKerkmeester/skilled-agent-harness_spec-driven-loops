# Deep Review Iteration 001

## Dispatcher
- Target: `.opencode/skills/sk-doc/create-readme/`
- Spec folder: `.opencode/specs/skilled-agent-orchestration/125-sk-doc-parent/010-subskill-doc-review/002-create-readme`
- Mode: review
- Focus: traceability, template fidelity, relative path and validator baseline
- Budget profile: verify
- Route proof: `target_agent=deep-review`, `agent_definition_loaded=true`, `mode=review`, resolved route points to the create-readme target and packet-local review artifact directory.

## Files Reviewed
- `.opencode/skills/sk-doc/create-readme/SKILL.md`
- `.opencode/skills/sk-doc/create-readme/README.md`
- `.opencode/skills/sk-doc/create-readme/references/README.md`
- `.opencode/skills/sk-doc/create-readme/references/readme/writing_patterns.md`
- `.opencode/skills/sk-doc/create-readme/references/readme/types_and_voice.md`
- `.opencode/skills/sk-doc/create-readme/references/readme/quality_and_checklist.md`
- `.opencode/skills/sk-doc/create-readme/references/install_guide/section_examples.md`
- `.opencode/skills/sk-doc/create-readme/references/install_guide/quality_and_standards.md`
- `.opencode/skills/sk-doc/create-readme/assets/readme/readme_template.md`
- `.opencode/skills/sk-doc/create-readme/assets/readme/readme_code_template.md`
- `.opencode/skills/sk-doc/create-readme/assets/readme/install_guide_template.md`
- `.opencode/skills/sk-doc/create-readme/scripts/audit_readmes.py`
- `.opencode/skills/sk-doc/shared/scripts/validate_document.py`
- `.opencode/skills/sk-doc/shared/scripts/quick_validate.py`
- `.opencode/skills/sk-doc/shared/scripts/extract_structure.py`
- `.opencode/skills/sk-code/code-review/references/review_core.md`

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **Primary install-guide template contradicts the workflow's required 0-10 section contract** -- `.opencode/skills/sk-doc/create-readme/assets/readme/install_guide_template.md:545` -- `SKILL.md` routes install-guide work to `assets/readme/install_guide_template.md` as the primary template and tells users to copy the matching template as a scaffold, while the workflow defines the required install-guide structure as sections 0 through 10. The template itself continues with `## 11. INSTALL GUIDE MAINTENANCE`, `## 12. BEST PRACTICES SUMMARY`, `## 13. COMPLETE TEMPLATE` and `## 14. RELATED RESOURCES`, then says to copy and customize that template. A user following the primary workflow can therefore produce output that violates the primary workflow's own structure. [SOURCE: `.opencode/skills/sk-doc/create-readme/SKILL.md:49`] [SOURCE: `.opencode/skills/sk-doc/create-readme/SKILL.md:83`] [SOURCE: `.opencode/skills/sk-doc/create-readme/SKILL.md:228`] [SOURCE: `.opencode/skills/sk-doc/create-readme/SKILL.md:242`] [SOURCE: `.opencode/skills/sk-doc/create-readme/assets/readme/install_guide_template.md:545`] [SOURCE: `.opencode/skills/sk-doc/create-readme/assets/readme/install_guide_template.md:571`] [SOURCE: `.opencode/skills/sk-doc/create-readme/assets/readme/install_guide_template.md:595`] [SOURCE: `.opencode/skills/sk-doc/create-readme/assets/readme/install_guide_template.md:597`] [SOURCE: `.opencode/skills/sk-doc/create-readme/assets/readme/install_guide_template.md:977`]
   - Recommendation: Make `install_guide_template.md`'s copyable scaffold match sections 0-10, and move maintenance, best-practices and related-resource material into a non-copyable reference appendix or `references/install_guide/` overflow.
   - Finding class: cross-consumer
   - Scope proof: Direct read of `SKILL.md` confirmed the primary template route and required 0-10 structure; direct read of `install_guide_template.md` confirmed the copyable scaffold still exposes sections 11-14.
   - Affected surface hints: `install_guide_template.md`, install-guide authoring workflow, `/create:folder_readme` install-guide outputs
   ```json
   {"type":"spec_mismatch","claim":"The primary install-guide template contradicts the self-sufficient SKILL.md workflow by exposing a copyable 14-section guide where the workflow requires sections 0-10.","evidenceRefs":[".opencode/skills/sk-doc/create-readme/SKILL.md:49",".opencode/skills/sk-doc/create-readme/SKILL.md:83",".opencode/skills/sk-doc/create-readme/SKILL.md:228",".opencode/skills/sk-doc/create-readme/SKILL.md:242",".opencode/skills/sk-doc/create-readme/assets/readme/install_guide_template.md:545",".opencode/skills/sk-doc/create-readme/assets/readme/install_guide_template.md:571",".opencode/skills/sk-doc/create-readme/assets/readme/install_guide_template.md:595",".opencode/skills/sk-doc/create-readme/assets/readme/install_guide_template.md:597",".opencode/skills/sk-doc/create-readme/assets/readme/install_guide_template.md:977"],"counterevidenceSought":"Checked the template's own standard-structure section and the SKILL.md overflow references; those confirm the 11-section model but do not neutralize the later copyable sections 11-14.","alternativeExplanation":"Sections 11-14 may be legacy reference material rather than intended output, but line 597 instructs users to copy and customize the surrounding template.","finalSeverity":"P1","confidence":"high","downgradeTrigger":"Downgrade to P2 if the extra sections are moved outside the copyable scaffold or explicitly marked non-output examples."}
   ```

### P2 Findings

1. **Template deprecation example links to a non-existent local install guide** -- `.opencode/skills/sk-doc/create-readme/assets/readme/install_guide_template.md:563` -- The deprecation example says `See [New Tool Install Guide](./MCP%20-%20New%20Tool.md)`, but a relative-path resolver run from the template's directory reported `BROKEN ./MCP - New Tool.md`. This is illustrative rather than the main workflow, so it is advisory, but it violates the review request's local-path fidelity requirement for relevant asset back-links. [SOURCE: `.opencode/skills/sk-doc/create-readme/assets/readme/install_guide_template.md:563`]
   - Recommendation: Replace the concrete missing href with a placeholder such as `./[replacement-guide].md`, point to an existing example or mark the snippet as a placeholder that must be replaced.
   - Finding class: instance-only
   - Scope proof: The relative-path resolver checked SKILL.md, README.md, reference files and assets; this was the only non-placeholder broken concrete asset example link reported.
   - Affected surface hints: `install_guide_template.md`, deprecation snippet, asset back-links

## Traceability Checks
- `SKILL.md` primary workflow is self-contained for routing, README workflow, general/code-folder output shapes, install-guide workflow, validation and writing rules. It points overflow to references and assets. [SOURCE: `.opencode/skills/sk-doc/create-readme/SKILL.md:76`] [SOURCE: `.opencode/skills/sk-doc/create-readme/SKILL.md:369`]
- References are grouped into `references/readme/` and `references/install_guide/`, with `references/README.md` acting as an overflow route map. [SOURCE: `.opencode/skills/sk-doc/create-readme/references/README.md:25`] [SOURCE: `.opencode/skills/sk-doc/create-readme/references/README.md:36`]
- Shared validator supports the requested `--type readme|skill|reference` flag. [SOURCE: `.opencode/skills/sk-doc/shared/scripts/validate_document.py:692`]
- README audit script supports the claimed `--repo-root`, `--validator`, `--inventory-out`, `--json-out` and `--markdown-out` flags. [SOURCE: `.opencode/skills/sk-doc/create-readme/scripts/audit_readmes.py:611`] [SOURCE: `.opencode/skills/sk-doc/create-readme/scripts/audit_readmes.py:623`]

## Integration Evidence
- Validator commands run from repo root:
  - `python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py .opencode/skills/sk-doc/create-readme/SKILL.md --type skill` -> VALID, total issues 0.
  - `python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py .opencode/skills/sk-doc/create-readme/README.md --type readme` -> VALID, total issues 0.
  - `python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py .opencode/skills/sk-doc/create-readme/references/README.md --type reference` -> VALID, total issues 0.
  - `python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py .opencode/skills/sk-doc/create-readme/references/readme/writing_patterns.md --type reference` -> VALID, total issues 0.
  - `python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py .opencode/skills/sk-doc/create-readme/references/readme/types_and_voice.md --type reference` -> VALID, total issues 0.
  - `python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py .opencode/skills/sk-doc/create-readme/references/readme/quality_and_checklist.md --type reference` -> VALID, total issues 0.
  - `python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py .opencode/skills/sk-doc/create-readme/references/install_guide/section_examples.md --type reference` -> VALID, total issues 0.
  - `python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py .opencode/skills/sk-doc/create-readme/references/install_guide/quality_and_standards.md --type reference` -> VALID, total issues 0.
- Relative path resolver checked SKILL.md, README.md, reference docs and asset templates; all target-doc markdown links resolved, with the one concrete asset example link captured as P2 and placeholder-style patterns ruled out.

## Edge Cases
- The dispatch requested a full `/deep:review:auto` loop with up to 4 iterations, but this leaf executor contract permits exactly one review iteration per execution. Remaining dimensions must be dispatched as fresh iterations by the loop owner.
- Per-iteration delta JSONL and final synthesized report were requested by the dispatcher, but this leaf agent's writable set is limited to the iteration artifact, strategy file and canonical JSONL state log. No reducer-owned dashboard, registry, report or target file was modified.
- Code graph freshness was stale, but structural code graph was not needed for documentation path, script-flag and validator evidence.

## Confirmed-Clean Surfaces
- All required target documents passed the shared validator with 0 blocking issues for their requested document types.
- `validate_document.py` exposes the requested `--type` flag.
- `audit_readmes.py` exposes the documented audit output flags.
- `quick_validate.py` and `extract_structure.py` exist under `.opencode/skills/sk-doc/shared/scripts/`.
- Reference grouping into `readme/` and `install_guide/` is present.

## Ruled Out
- `.opencode/skills/[name]/README.md` in `types_and_voice.md` is a location pattern with a placeholder, not an active relative link requiring an on-disk target.
- The missing `./MCP - New Tool.md` path is not a P1 because it appears in an illustrative deprecation snippet, not the primary workflow route or validator path.
- No fabricated validator or audit flags were found for the inspected claims.

## Next Focus
- dimension: correctness
- focus area: verify whether examples and templates produce the behavior promised by the workflow, especially install-guide command/config examples and README audit behavior
- reason: traceability found a primary template mismatch; the next iteration should test correctness implications rather than rechecking validator pass/fail
- rotation status: traceability complete for iteration 001; correctness next, then security and maintainability remain
- blocked/productive carry-forward: validator/path checks were productive; validator-only checks are insufficient for template fidelity
- required evidence: install-guide template copyable scaffold, audit script behavior, quick/extract validators, template examples, command snippets
