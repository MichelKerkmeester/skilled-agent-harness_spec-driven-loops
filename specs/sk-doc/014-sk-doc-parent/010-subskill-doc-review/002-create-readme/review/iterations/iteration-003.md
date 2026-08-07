# Deep Review Iteration 003

## Dispatcher
- Target: `.opencode/skills/sk-doc/create-readme/`
- Spec folder: `.opencode/specs/skilled-agent-orchestration/125-sk-doc-parent/010-subskill-doc-review/002-create-readme`
- Mode: review
- Focus: security, maintainability, relative path/tool/flag/section claim verification, assets back-links and grouped reference coverage
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
- `.opencode/skills/sk-code/code-review/references/review_core.md`

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **API-key troubleshooting example prints secrets to the terminal** -- `.opencode/skills/sk-doc/create-readme/assets/readme/install_guide_template.md:344` -- The install-guide template's API error fix tells authors to set `API_KEY_VAR="your-key"` and then run `echo $API_KEY_VAR  # Verify it's set`. If copied with a real key, this exposes the secret in terminal output, scrollback, logs and AI transcripts. This also conflicts with the primary workflow's escalation rule for install steps that need secrets. [SOURCE: `.opencode/skills/sk-doc/create-readme/assets/readme/install_guide_template.md:338`] [SOURCE: `.opencode/skills/sk-doc/create-readme/assets/readme/install_guide_template.md:344`] [SOURCE: `.opencode/skills/sk-doc/create-readme/assets/readme/install_guide_template.md:345`] [SOURCE: `.opencode/skills/sk-doc/create-readme/SKILL.md:360`] [SOURCE: `.opencode/skills/sk-doc/create-readme/SKILL.md:364`]
   - Recommendation: Replace the example with a non-printing secret check such as `test -n "$API_KEY_VAR" && printf 'API key is set\n'`, use placeholder guidance that never includes a real key in shell history, and add a note to use a project-approved secret store or environment injection mechanism.
   - Finding class: cross-consumer
   - Scope proof: Security grep across the target found the only API-key handling example at `install_guide_template.md:344-345`; direct reads confirmed no surrounding warning offsets the printed-secret behavior.
   - Affected surface hints: `install_guide_template.md`, install-guide troubleshooting examples, AI-assisted install guide prompts, shell transcripts
   ```json
   {"type":"secret_exposure_guidance","claim":"The install-guide template instructs users to echo an API key, which can expose secrets in terminal output, logs or AI transcripts.","evidenceRefs":[".opencode/skills/sk-doc/create-readme/assets/readme/install_guide_template.md:338",".opencode/skills/sk-doc/create-readme/assets/readme/install_guide_template.md:344",".opencode/skills/sk-doc/create-readme/assets/readme/install_guide_template.md:345",".opencode/skills/sk-doc/create-readme/SKILL.md:360",".opencode/skills/sk-doc/create-readme/SKILL.md:364"],"counterevidenceSought":"Searched the target for API_KEY, SECRET, TOKEN, password, echo $, sudo and destructive shell patterns, then reread the surrounding API error example and the workflow escalation rule. No local warning says not to print real secrets.","alternativeExplanation":"The example uses a placeholder value, but templates are copied and customized, so the unsafe pattern is the part users retain with real credentials.","finalSeverity":"P1","confidence":"high","downgradeTrigger":"Downgrade to P2 if the template is changed to never print the secret and includes explicit safe-secret handling guidance."}
   ```

### P2 Findings

None.

## Traceability Checks
- Relative markdown link check covered `SKILL.md`, `README.md`, all reference docs and all three asset templates. It checked 58 links and found one broken link, the existing iteration 1 P2 for `./MCP - New Tool.md` in `install_guide_template.md`.
- `validate_document.py --help` confirmed the documented validator flags: `--type`, `--json`, `--blocking-only`, `--fix`, `--dry-run` and `--no-exclude`.
- `audit_readmes.py --help` confirmed documented audit flags: `--repo-root`, `--validator`, `--inventory-out`, `--json-out` and `--markdown-out`.
- Grouped references remain present under `references/readme/` and `references/install_guide/`; coverage was reviewed through `references/README.md` and the group files.

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
- Security pattern grep found actionable API-key exposure only in `install_guide_template.md:344-345`; other hits were benign words or the existing `sudo` troubleshooting guidance.

## Edge Cases
- Separate delta JSONL was not written because this leaf agent's writable set is limited to the iteration artifact, strategy and canonical state log.
- The existing broken asset back-link was verified again but not re-filed as a new finding.
- The generic `Use sudo or fix npm permissions` troubleshooting line in the install-guide quality reference was reviewed as a possible security issue. It remains ruled out as a new active finding in this iteration because it offers a safer alternative and does not provide a privileged command to copy.

## Confirmed-Clean Surfaces
- All required target documents validate with 0 blocking issues.
- `audit_readmes.py` invokes `validate_document.py` via argument-list subprocess, not shell interpolation. [SOURCE: `.opencode/skills/sk-doc/create-readme/scripts/audit_readmes.py:312`] [SOURCE: `.opencode/skills/sk-doc/create-readme/scripts/audit_readmes.py:314`]
- `section_examples.md` platform configuration examples avoid secret values and only show path/config placeholders. [SOURCE: `.opencode/skills/sk-doc/create-readme/references/install_guide/section_examples.md:99`] [SOURCE: `.opencode/skills/sk-doc/create-readme/references/install_guide/section_examples.md:103`]
- Asset and reference groups are present and grouped as requested.

## Ruled Out
- Did not re-file iteration 1's missing `./MCP - New Tool.md` link.
- Did not classify `sudo` mention in `quality_and_standards.md` as active security finding due to lack of a copyable privileged command and presence of an alternative.
- Did not treat validator pass as proof that security guidance is safe; validator checks formatting, not secret-handling semantics.

## Next Focus
- dimension: maintainability
- focus area: final pass over duplication, stale legacy content, template/reference consistency, reducer-friendly synthesis inputs and accumulated findings coherence
- reason: traceability, correctness and security have active findings; the final max-iterations pass should consolidate maintainability risks and prepare synthesis
- rotation status: traceability, correctness and security complete; maintainability remains
- blocked/productive carry-forward: continue semantic template-contract checks; do not repeat validator/path checks unless needed for synthesis evidence
- required evidence: all templates, reference map, grouped references, README and accumulated iteration findings
