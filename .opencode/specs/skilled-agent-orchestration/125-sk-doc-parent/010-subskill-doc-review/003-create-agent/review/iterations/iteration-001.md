# Deep Review Iteration 001

## Dispatcher

- target_agent: deep-review
- resolved_route: `.opencode/agents/deep-review.md`
- agent_definition_loaded: true
- mode: review
- target: `.opencode/skills/sk-doc/create-agent/`
- focus: maintainability — permission-template clarity and overflow-reference discipline
- budgetProfile: scan
- status: complete for this LEAF iteration; full four-iteration loop deferred to orchestrator because the LEAF contract permits one iteration per invocation

## Files Reviewed

- `.opencode/skills/sk-doc/create-agent/SKILL.md`
- `.opencode/skills/sk-doc/create-agent/README.md`
- `.opencode/skills/sk-doc/create-agent/references/README.md`
- `.opencode/skills/sk-doc/create-agent/references/agent-vs-skill-vs-command.md`
- `.opencode/skills/sk-doc/create-agent/references/permission_design.md`
- `.opencode/skills/sk-doc/create-agent/references/common_pitfalls.md`
- `.opencode/skills/sk-doc/create-agent/assets/agent_template.md`
- `.opencode/skills/sk-doc/shared/scripts/validate_document.py`
- `.opencode/skills/sk-doc/shared/scripts/extract_structure.py`

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **Canonical permission example over-grants before least-authority reduction** -- `.opencode/skills/sk-doc/create-agent/SKILL.md:81` -- The primary workflow says every agent starts with the shown unified `permission:` object, but the example allows write/edit/bash/memory/list/external_directory by default at lines 81-94 while the same rules require explicit least-authority permissions at line 104, and the dedicated permission reference says `external_directory` is high-risk and should be denied unless the role clearly needs it at `.opencode/skills/sk-doc/create-agent/references/permission_design.md:42`. This is advisory because the workflow also tells authors to confirm role needs before writing tool-heavy instructions, but the starter block can still teach broad defaults.
   - Finding class: instance-only
   - Scope proof: Direct reads of `SKILL.md` and `permission_design.md`; no validation blocker was reported by `validate_document.py` for the target docs.
   - Affected surface hints: [`create-agent SKILL.md`, `agent permission guidance`]
   - Recommendation: Make the starter block explicitly illustrative, or default high-risk/default-unneeded permissions to `deny`/`ask` with a note to elevate only when the role body proves the need.

## Traceability Checks

- `validate_document.py` supports the claimed `--type` flag and includes `readme`, `skill`, `reference`, and `agent` choices. [SOURCE: `.opencode/skills/sk-doc/shared/scripts/validate_document.py:13`, `.opencode/skills/sk-doc/shared/scripts/validate_document.py:693`]
- `extract_structure.py` exists and describes JSON structure extraction for frontmatter, headings, code blocks, metrics, and type-specific checklist validation. [SOURCE: `.opencode/skills/sk-doc/shared/scripts/extract_structure.py:6`]
- All relative markdown links found in the reviewed target docs and `assets/agent_template.md` resolved on disk in the link-audit command.

## Integration Evidence

- Validation commands run:
  - `python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py .opencode/skills/sk-doc/create-agent/SKILL.md --type skill` -> valid, zero issues
  - `python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py .opencode/skills/sk-doc/create-agent/README.md --type readme` -> valid, zero issues
  - `python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py .opencode/skills/sk-doc/create-agent/references/README.md --type reference` -> valid, zero issues
  - `python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py .opencode/skills/sk-doc/create-agent/references/agent-vs-skill-vs-command.md --type reference` -> valid, zero issues
  - `python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py .opencode/skills/sk-doc/create-agent/references/permission_design.md --type reference` -> valid, zero issues
  - `python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py .opencode/skills/sk-doc/create-agent/references/common_pitfalls.md --type reference` -> valid, zero issues
- Back-link existence checked with Glob for `.opencode/commands/create/agent.md`, `create_agent_auto.yaml`, `create_agent_confirm.yaml`, shared references, and command template paths.

## Edge Cases

- The dispatch requested a full four-iteration loop and final report from a LEAF agent. The active agent contract permits one review iteration per invocation, so this iteration records the limitation and leaves remaining dimensions for orchestrator-managed follow-up.
- The review packet was missing at the start of the corrected dispatch; first-run initialization created the local review boundary under the bound spec folder.

## Confirmed-Clean Surfaces

- sk-doc validation for `SKILL.md`, `README.md`, and all reference markdown files produced zero issues.
- Relative markdown links in target docs and `assets/agent_template.md` resolved on disk.
- No fabricated `validate_document.py --type` claim was found for the requested `skill`, `readme`, or `reference` validations.

## Ruled Out

- Broken relative markdown links: ruled out by link audit.
- Blocking sk-doc template validation errors: ruled out by validation command outputs.
- Missing packet-local scripts as a defect: ruled out because `README.md` explicitly states no packet-local scripts are present and routes to shared scripts.

## Next Focus

- dimension: traceability
- focus area: verify command/workflow back-links and non-markdown path claims in command/YAML integration surfaces
- reason: validation and link checks are clean; the next highest-value audit requirement is fabricated command/workflow claim prevention
- rotation status: maintainability completed; correctness, security, and traceability remain pending for future LEAF invocations
- blocked/productive carry-forward: productive — validation and link-audit approach should be extended to command workflow surfaces
- required evidence: direct reads of `.opencode/commands/create/agent.md`, `.opencode/commands/create/assets/create_agent_auto.yaml`, and `.opencode/commands/create/assets/create_agent_confirm.yaml`
