# Deep Review Iteration 003

## Dispatcher

- target_agent: deep-review
- resolved_route: `.opencode/agents/deep-review.md`
- agent_definition_loaded: true
- mode: review
- run: create-agent-deep-review-auto
- focus: fabricated tool/flag/section claims in create-agent validation guidance
- dimension: correctness
- budgetProfile: verify
- status: complete

## Files Reviewed

- `.opencode/skills/sk-doc/create-agent/SKILL.md`
- `.opencode/skills/sk-doc/create-agent/README.md`
- `.opencode/skills/sk-doc/create-agent/assets/agent_template.md`
- `.opencode/skills/sk-doc/create-agent/references/permission_design.md`
- `.opencode/skills/sk-doc/shared/scripts/validate_document.py`
- `.opencode/skills/sk-doc/shared/scripts/extract_structure.py`
- `.opencode/skills/sk-doc/shared/scripts/quick_validate.py`
- `.opencode/commands/create/assets/create_agent_auto.yaml`
- `.opencode/commands/create/assets/create_agent_confirm.yaml`

## Findings - New

### P0 Findings

- None.

### P1 Findings

1. **Validation gate promises runtime/link checks the cited validators do not implement** -- `.opencode/skills/sk-doc/create-agent/SKILL.md:154` -- The create-agent gate tells authors that delivery validation must prove filename/name parity, runtime directory correctness, permission/authority consistency, related-resource existence, and unresolved markdown links, immediately after prescribing only `validate_document.py ... --type agent` and `extract_structure.py` as the validation commands [SOURCE: `.opencode/skills/sk-doc/create-agent/SKILL.md:143-154`]. The actual shared validator CLI only accepts a document path plus documentation-format flags such as `--type`, `--json`, `--blocking-only`, `--fix`, `--dry-run`, and `--no-exclude` [SOURCE: `.opencode/skills/sk-doc/shared/scripts/validate_document.py:687-700`], while `extract_structure.py` exposes only a `filepath` argument and emits structural JSON [SOURCE: `.opencode/skills/sk-doc/shared/scripts/extract_structure.py:1234-1248`]. Because this is the packet's delivery gate for generated agents, consumers can believe runtime and permission safety were checked when only markdown/document structure was script-backed.
   - Finding class: cross-consumer
   - Scope proof: Target docs cite only shared validators for this gate [SOURCE: `.opencode/skills/sk-doc/create-agent/SKILL.md:147-150`; `.opencode/skills/sk-doc/create-agent/README.md:32-38`]; packet-local scripts are explicitly absent [SOURCE: `.opencode/skills/sk-doc/create-agent/README.md:23`]. Direct grep for runtime-directory, permission-consistency, link, filename/name, and related-resource validation terms in the two cited validator scripts found no implemented checks beyond generic path/type detection.
   - Affected surface hints: [`create-agent validation gate`, `shared sk-doc validators`, `generated agent delivery checklist`, `/create:agent command consumers`]
   - Recommendation: Split the gate into script-backed checks versus required manual checks, or add/link a real agent-specific validator that checks filename/frontmatter parity, runtime path, permissions, related-resource links, and unresolved markdown links before the packet claims those checks are covered.
   ```json
   {
     "type": "gate-relevant P1 compact skeptic/referee",
     "claim": "The create-agent validation gate overstates what its cited validators verify for generated agents.",
     "evidenceRefs": [
       ".opencode/skills/sk-doc/create-agent/SKILL.md:143-154",
       ".opencode/skills/sk-doc/create-agent/README.md:23",
       ".opencode/skills/sk-doc/shared/scripts/validate_document.py:687-700",
       ".opencode/skills/sk-doc/shared/scripts/extract_structure.py:1234-1248"
     ],
     "counterevidenceSought": "Checked whether create-agent has packet-local scripts, whether README names additional validation tooling, and whether shared validators expose flags or code paths for runtime directory, permission consistency, filename/name parity, related-resource existence, or unresolved link checks.",
     "alternativeExplanation": "The prose may intend these as manual required checks in addition to the two commands, but the section title, placement, and command-only example make the gate look script-backed without separating manual work from automated coverage.",
     "finalSeverity": "P1",
     "confidence": "0.82",
     "downgradeTrigger": "Downgrade to P2 if the packet adds an explicit manual-check checklist or links a separate workflow that performs the missing checks before delivery."
   }
   ```

### P2 Findings

- None new.

## Traceability Checks

- Verified all tool names cited by the create-agent packet against `.opencode/skills/sk-doc/shared/scripts/`: `validate_document.py`, `extract_structure.py`, and `quick_validate.py` exist; no packet-local `scripts/` directory exists and the README accurately says so [SOURCE: `.opencode/skills/sk-doc/create-agent/README.md:23`].
- Verified the documented `validate_document.py ... --type agent` flag against the validator parser; `--type` includes `agent` as an allowed choice [SOURCE: `.opencode/skills/sk-doc/shared/scripts/validate_document.py:692-694`].
- Verified `extract_structure.py` has no hidden flag contract; it takes only `filepath` and emits JSON [SOURCE: `.opencode/skills/sk-doc/shared/scripts/extract_structure.py:1234-1248`].
- Re-checked active P1-001: both `/create:agent` workflow YAML files still default OpenCode output to singular `.opencode/agent` [SOURCE: `.opencode/commands/create/assets/create_agent_auto.yaml:44-46`; `.opencode/commands/create/assets/create_agent_confirm.yaml:45-47`], so the prior P1 remains active.
- Re-checked prior P2-001: the canonical frontmatter example still grants write/edit/bash/memory/list/external_directory before role-specific least-authority reduction [SOURCE: `.opencode/skills/sk-doc/create-agent/SKILL.md:81-94`], and the asset template carries the same broad starter shape [SOURCE: `.opencode/skills/sk-doc/create-agent/assets/agent_template.md:69-82`].

## Integration Evidence

- `.opencode/commands/create/assets/create_agent_auto.yaml` -- re-read runtime path resolution defaults for the active P1.
- `.opencode/commands/create/assets/create_agent_confirm.yaml` -- re-read runtime path resolution defaults for the active P1.
- `.opencode/skills/sk-doc/shared/scripts/validate_document.py` -- read CLI parser and supported `--type agent` flag.
- `.opencode/skills/sk-doc/shared/scripts/extract_structure.py` -- read CLI parser and confirmed single-filepath contract.

## Edge Cases

- The dispatch asked to verify packet-local scripts under `.opencode/skills/sk-doc/create-agent/`; none exist. This is not a finding because the README explicitly states `scripts/` is not present and validation reuses shared sk-doc validators.
- Registry/delta writes remain outside this LEAF contract. This iteration wrote only the iteration artifact, strategy update, and one state JSONL record.
- The validation command itself returned clean for `SKILL.md`, but that does not prove the broader runtime/link checks promised by the packet.

## Confirmed-Clean Surfaces

- No fabricated validator executable names found in create-agent docs; cited shared script filenames exist.
- No fabricated `validate_document.py --type agent` flag found; the flag and `agent` choice are supported.
- No duplicate finding added for the already-active `.opencode/agent` workflow default mismatch or the broad starter permission P2.

## Ruled Out

- `scripts/` absence in the packet is not a defect because the packet documents shared-validator reuse.
- `extract_structure.py` having no flags is not a defect by itself; the issue is only the packet's broader validation-coverage claim.
- The active P1 from iteration 2 was not re-filed as a new finding; it remains active and is carried forward.

## Commands Run

- `python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py .opencode/skills/sk-doc/create-agent/SKILL.md --type skill --blocking-only && python3 .opencode/skills/sk-doc/shared/scripts/extract_structure.py .opencode/skills/sk-doc/create-agent/SKILL.md >/var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/opencode/create-agent-iteration3-structure.json`
  - Result: exit 0; validator output reported `VALID`, document type `skill`, total issues `0`; structural JSON was written to the temp file for local inspection only.

## Next Focus

- dimension: security
- focus area: permission authority, `task`/MCP exposure, runtime path trust boundaries, and whether generated-agent defaults can grant unsafe capabilities
- reason: correctness review found one new validation-gate mismatch; security is the only remaining unreviewed dimension before max-iteration synthesis
- rotation status: maintainability, traceability, and correctness completed; security remains pending
- blocked/productive carry-forward: productive -- direct target/script reads and command-workflow counterevidence; do not retry registry/delta writes inside the LEAF boundary
- required evidence: direct reads of permission defaults, `mcpServers` examples, command workflow permission-emission sections, and any validator logic that claims permission enforcement
