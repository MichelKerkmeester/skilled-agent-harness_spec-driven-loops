# Deep Review Iteration 002

## Dispatcher

- target_agent: deep-review
- resolved_route: `.opencode/agents/deep-review.md`
- agent_definition_loaded: true
- mode: review
- target: `.opencode/skills/sk-doc/create-agent/`
- focus: traceability — reference dissection fidelity, duplicate workflow content, route-map accuracy, relative path resolution, and asset/back-link claims
- budgetProfile: verify
- status: complete for this LEAF iteration; reducer-owned registry and delta artifacts remain outside this agent's writable-file contract

## Files Reviewed

- `.opencode/skills/sk-doc/create-agent/SKILL.md`
- `.opencode/skills/sk-doc/create-agent/README.md`
- `.opencode/skills/sk-doc/create-agent/references/README.md`
- `.opencode/skills/sk-doc/create-agent/references/agent-vs-skill-vs-command.md`
- `.opencode/skills/sk-doc/create-agent/references/permission_design.md`
- `.opencode/skills/sk-doc/create-agent/references/common_pitfalls.md`
- `.opencode/skills/sk-doc/create-agent/assets/agent_template.md`
- `.opencode/skills/sk-doc/shared/references/global/validation.md`
- `.opencode/skills/sk-doc/shared/references/global/core_standards.md`
- `.opencode/skills/sk-doc/shared/assets/frontmatter_templates.md`
- `.opencode/commands/create/agent.md`
- `.opencode/commands/create/assets/create_agent_presentation.txt`
- `.opencode/commands/create/assets/create_agent_auto.yaml`
- `.opencode/commands/create/assets/create_agent_confirm.yaml`

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **Linked `/create:agent` workflows default OpenCode agent output to a non-runtime directory** -- `.opencode/skills/sk-doc/create-agent/references/permission_design.md:62` -- The target packet routes readers to the command workflow YAML as the machine-executed `/create:agent` path, while the packet contract says OpenCode agents belong under `.opencode/agents/` at `.opencode/skills/sk-doc/create-agent/SKILL.md:57-60` and `.opencode/skills/sk-doc/create-agent/README.md:30`. The linked auto and confirm workflows instead set `runtime_agent_path_resolution.default` to `.opencode/agent` at `.opencode/commands/create/assets/create_agent_auto.yaml:44-45` and `.opencode/commands/create/assets/create_agent_confirm.yaml:45-46`; those workflows then consume `[runtime_agent_path]` for default output/check paths and write the generated file to `[agent_path]` at `.opencode/commands/create/assets/create_agent_auto.yaml:247-263`, `.opencode/commands/create/assets/create_agent_auto.yaml:430-438`, `.opencode/commands/create/assets/create_agent_confirm.yaml:262-278`, and `.opencode/commands/create/assets/create_agent_confirm.yaml:484-492`. Direct directory checks found `.opencode/agent` missing and `.opencode/agents/` present, so the default route can create or check the wrong location when no explicit `--path`/pre-bound path overrides it.
   - Finding class: cross-consumer
   - Scope proof: Grep across `.opencode/commands/create/assets/create_agent_*.yaml` found the same singular `.opencode/agent` runtime default in both auto and confirm workflows; direct reads of the create-agent packet found the target contract consistently names `.opencode/agents/` for OpenCode/default runtime placement.
   - Affected surface hints: [`create-agent route map`, `/create:agent auto workflow`, `/create:agent confirm workflow`, `runtime agent directory resolution`]
   - Recommendation: Align both workflow YAML defaults and all `[runtime_agent_path]` examples to `.opencode/agents/`, or make setup resolution inject the correct runtime path before any YAML step can use the singular default.
   - Claim adjudication:
     ```json
     {
       "type": "gate-relevant P1 compact skeptic/referee",
       "claim": "The create-agent packet links users to command workflows whose defaults contradict the packet's OpenCode runtime directory and can target a non-runtime path.",
       "evidenceRefs": [
         ".opencode/skills/sk-doc/create-agent/references/permission_design.md:62",
         ".opencode/skills/sk-doc/create-agent/SKILL.md:57-60",
         ".opencode/skills/sk-doc/create-agent/README.md:30",
         ".opencode/commands/create/assets/create_agent_auto.yaml:44-45",
         ".opencode/commands/create/assets/create_agent_auto.yaml:247-263",
         ".opencode/commands/create/assets/create_agent_auto.yaml:430-438",
         ".opencode/commands/create/assets/create_agent_confirm.yaml:45-46",
         ".opencode/commands/create/assets/create_agent_confirm.yaml:262-278",
         ".opencode/commands/create/assets/create_agent_confirm.yaml:484-492"
       ],
       "counterevidenceSought": "Read the command router and presentation contract; the presentation pre-bound example uses `.opencode/agents/`, and users can override `agent_path`, but the YAML still owns execution behavior and retains a singular default consumed by workflow steps.",
       "alternativeExplanation": "A higher-level setup phase may always override `[runtime_agent_path]`; no in-scope file proved that override is mandatory before every auto/confirm YAML use site.",
       "finalSeverity": "P1",
       "confidence": 0.82,
       "downgradeTrigger": "Downgrade to P2 if the command runtime proves it substitutes `.opencode/agents/` into every `[runtime_agent_path]` and `[agent_path]` token before YAML execution."
     }
     ```

### P2 Findings

No new P2 findings.

Carried forward: P2-001 remains active. The canonical permission block in `.opencode/skills/sk-doc/create-agent/SKILL.md:81-94` still grants broad defaults, including `external_directory: allow`, while `.opencode/skills/sk-doc/create-agent/SKILL.md:104` requires least-authority values and `.opencode/skills/sk-doc/create-agent/references/permission_design.md:40-46` says high-risk permissions should be denied unless the role clearly needs them.

## Traceability Checks

- Reference dissection fidelity: `references/README.md` accurately routes component-choice, permission-design, and pitfalls depth to existing reference files. [SOURCE: `.opencode/skills/sk-doc/create-agent/references/README.md:32-36`; link existence checked with Glob]
- Duplicate workflow content: `SKILL.md` carries the primary ordered workflow while references state they are overflow depth, not replacement workflow contracts. [SOURCE: `.opencode/skills/sk-doc/create-agent/SKILL.md:14`, `.opencode/skills/sk-doc/create-agent/references/README.md:16-24`]
- Relative path resolution: `agent_template.md`'s frontmatter template link resolves to `../../shared/assets/frontmatter_templates.md`, which exists and documents the description budget/trim rules. [SOURCE: `.opencode/skills/sk-doc/create-agent/assets/agent_template.md:61`, `.opencode/skills/sk-doc/shared/assets/frontmatter_templates.md:214-217`]
- Asset/back-link claims: sibling links from `references/README.md` to create-skill, create-command, shared quick reference, shared validation, shared standards, and doc-quality workflows all resolved on disk.
- Command back-link accuracy is partially failed by the new P1: the linked command workflows exist, but their runtime-path default contradicts the target packet's `.opencode/agents/` placement contract.

## Integration Evidence

- Validation commands run:
  - `python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py .opencode/skills/sk-doc/create-agent/SKILL.md --type skill` -> valid, zero issues
  - `python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py .opencode/skills/sk-doc/create-agent/README.md --type readme` -> valid, zero issues
  - `python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py .opencode/skills/sk-doc/create-agent/references/README.md --type reference` -> valid, zero issues
  - `python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py .opencode/skills/sk-doc/create-agent/references/permission_design.md --type reference` -> valid, zero issues
- Existence checks:
  - `.opencode/skills/sk-doc/scripts/validate_document.py` exists; the suspected script-path issue was ruled out.
  - `.opencode/agent` does not exist; `.opencode/agents/` exists and contains runtime agent files.
- Exact integration surfaces reviewed: `.opencode/commands/create/agent.md`, `.opencode/commands/create/assets/create_agent_presentation.txt`, `.opencode/commands/create/assets/create_agent_auto.yaml`, `.opencode/commands/create/assets/create_agent_confirm.yaml`.

## Edge Cases

- The dispatch requested `deltas/iteration-002.jsonl` and registry update. This LEAF agent's governing write boundary permits only the iteration artifact, strategy file, and state JSONL append; the reducer-owned registry and delta artifacts were treated as read-only/not writable here.
- The command presentation contract's pre-bound example uses `.opencode/agents/`, which partially mitigates the new P1 when pre-bound setup supplies `agent_path`; it does not remove the YAML default contradiction.
- No final `review-report.md` was produced because the invocation requested iteration 2 only and no unrecoverable abort occurred.

## Confirmed-Clean Surfaces

- Target `SKILL.md`, `README.md`, `references/README.md`, and `references/permission_design.md` passed sk-doc validation with zero issues.
- Route-map links to `create-skill`, `create-command`, shared validation/core standards/quick reference, and doc-quality workflow references resolved on disk.
- The `agent_template.md` description-budget back-link resolves to an existing shared asset and the cited section contains relevant description-budget rules.
- The suspected stale validator script path was ruled out because `.opencode/skills/sk-doc/scripts/validate_document.py` exists as a compatibility surface alongside the shared script path.

## Ruled Out

- Broken route-map links for sibling/shared references: ruled out by Glob checks.
- Missing shared validation scripts: ruled out by direct directory read and validation command success.
- Duplicate full workflow prose in overflow references: ruled out for the three focused references; they contain concise single-concern depth rather than repeating the ordered creation workflow.
- Asset-template back-link fabrication: ruled out by resolving `../../shared/assets/frontmatter_templates.md` and reading the target section.

## Next Focus

- dimension: correctness
- focus area: generated-agent contract correctness across template/YAML/SKILL body sections, especially required hard-boundary shape, permission fields, and validation expectations
- reason: traceability found one command-workflow mismatch; next highest-risk dimension is whether the generated agent shape is internally executable and consistent
- rotation status: maintainability and traceability have completed focused passes; correctness and security remain pending
- blocked/productive carry-forward: productive — direct target reads plus command workflow counterevidence; do not retry registry/delta writes inside the LEAF boundary
- required evidence: direct reads of the remainder of `assets/agent_template.md`, workflow generation/validation sections, and relevant validator checks
