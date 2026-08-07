# Deep Review Iteration 001

## Dispatcher

- target_agent: deep-review
- mode: review
- agent_definition_loaded: true
- resolved_route: `/deep:review:auto` -> `.opencode/skills/sk-doc/create-changelog/` (skill)
- lifecycle: first-run initialization authorized by orchestrator retry
- focus: traceability -- primary workflow contract, reference overflow boundaries, path resolution, and validator/tool-claim evidence
- budgetProfile: scan
- status: complete

## Files Reviewed

- `.opencode/skills/sk-doc/create-changelog/SKILL.md`
- `.opencode/skills/sk-doc/create-changelog/README.md`
- `.opencode/skills/sk-doc/create-changelog/references/README.md`
- `.opencode/skills/sk-doc/create-changelog/references/worked_examples.md`
- `.opencode/skills/sk-doc/create-changelog/references/version_bump_rules.md`
- `.opencode/skills/sk-doc/create-changelog/references/topology_edge_cases.md`
- Integration context: `.opencode/skills/sk-doc/shared/assets/changelog_template.md`, `.opencode/skills/sk-doc/shared/scripts/validate_document.py`, `.opencode/commands/create/changelog.md`, `.opencode/commands/create/assets/create_changelog_presentation.txt`, `.opencode/skills/system-spec-kit/templates/changelog/root.md`, `.opencode/skills/system-spec-kit/templates/changelog/phase.md`, `.opencode/skills/system-spec-kit/scripts/dist/spec-folder/nested-changelog.js`

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **Packet-local worked example is not shaped like the canonical nested templates** -- `.opencode/skills/sk-doc/create-changelog/references/worked_examples.md:77` -- The packet-local example starts directly with `# Changelog - sk-doc parent root` and then `## Summary`, but the canonical nested templates include frontmatter plus a date heading and spec-folder blockquote before the summary fields [SOURCE: `.opencode/skills/sk-doc/create-changelog/references/worked_examples.md:77`; SOURCE: `.opencode/skills/system-spec-kit/templates/changelog/root.md:1`; SOURCE: `.opencode/skills/system-spec-kit/templates/changelog/root.md:15`; SOURCE: `.opencode/skills/system-spec-kit/templates/changelog/phase.md:1`; SOURCE: `.opencode/skills/system-spec-kit/templates/changelog/phase.md:15`]. The same reference correctly says the exact packet-local shape is owned by the templates and generator at lines 99-102, so the filled example can mislead users who copy the example instead of trusting the generator. Proposed fix: either replace the packet-local example with generator-shaped output matching `root.md`/`phase.md`, or label it explicitly as an illustrative excerpt that omits generated frontmatter/date scaffolding.
   - Finding class: instance-only
   - Scope proof: The mismatch is confined to the packet-local example in `references/worked_examples.md`; `SKILL.md` lines 123-129 and 340 correctly route nested writes through the generator/templates, and validators report 0 issues for all target docs.
   - Affected surface hints: ["packet-local changelog example", "nested generator template", "reference overflow docs"]

## Traceability Checks

- SKILL.md primary contract: present and self-contained with seven ordered steps at `.opencode/skills/sk-doc/create-changelog/SKILL.md:331` through `.opencode/skills/sk-doc/create-changelog/SKILL.md:341`.
- Reference overflow boundary: `references/README.md` states SKILL.md and shared template remain authoritative at `.opencode/skills/sk-doc/create-changelog/references/README.md:17` and maps three single-concern files at lines 37-41.
- Shared global format: `SKILL.md` mirrors the shared template's summary-first, no-version-header compact and expanded formats at `.opencode/skills/sk-doc/create-changelog/SKILL.md:141` through `.opencode/skills/sk-doc/create-changelog/SKILL.md:257`; shared template source is `.opencode/skills/sk-doc/shared/assets/changelog_template.md:36` through `.opencode/skills/sk-doc/shared/assets/changelog_template.md:150`.
- Relative paths sampled in `SKILL.md`, `README.md`, and references resolve on disk, including shared template, shared scripts directory, command assets, and nested templates.
- Tool/flag claims checked: `validate_document.py --type skill/readme/reference/changelog` commands ran successfully; `nested-changelog.js --help` exposed `--json` and `--write`.

## Integration Evidence

- Validator commands produced 0 issues for `SKILL.md`, `README.md`, and all three reference files plus the reference route-map.
- `.opencode/commands/create/changelog.md:21` through `.opencode/commands/create/changelog.md:27` confirms the command router loads presentation first and then the auto/confirm YAML route.
- `.opencode/commands/create/assets/create_changelog_presentation.txt:70` through `.opencode/commands/create/assets/create_changelog_presentation.txt:78` confirms `publish_release`, `nested`, and setup-field claims.
- `.opencode/skills/system-spec-kit/scripts/dist/spec-folder/nested-changelog.js --help` confirms documented `--json` and `--write` flags.
- `.opencode/changelog/` currently contains plain component folders such as `sk-doc/`, `system-spec-kit/`, and `sk-code/`, supporting the packet's plain-folder discovery rule.

## Edge Cases

- The shared global template still contains stale `NN--component` path examples in its own prose; this iteration treated the actual `.opencode/changelog/` folder names plus the packet's explicit source-conflict notes as higher-confidence path evidence. No active finding was filed against the target packet for that out-of-scope shared-template wording.
- The packet-local changelog under `create-changelog/changelog/` contains stale references to `references/changelog_creation.md`, but `changelog/` was not part of this iteration's declared review scope. Carry forward only if the orchestrator broadens scope to packet-local changelog history.
- Stop policy requires four iterations, but this LEAF execution can complete only iteration 001; remaining iterations must be dispatched by the orchestrator.

## Confirmed-Clean Surfaces

- SKILL.md and README.md both validate with 0 issues using the requested sk-doc validators.
- `references/README.md`, `references/worked_examples.md`, `references/version_bump_rules.md`, and `references/topology_edge_cases.md` validate with 0 issues using `--type reference`.
- No fabricated `validate_document.py --type changelog` claim was found; the command succeeds on the packet-local changelog sample.
- No active P0 or P1 finding was found in this traceability pass.

## Ruled Out

- Ruled out missing nested generator flags: the runtime help output includes `--json` and `--write`.
- Ruled out missing command router assets: `.opencode/commands/create/changelog.md`, auto YAML, confirm YAML, and presentation file all resolve.
- Ruled out reference-set workflow duplication as a blocker: the references largely point back to `SKILL.md` and carry examples/decision aids rather than restating the seven-step workflow.

## Next Focus

- dimension: correctness
- focus area: global-versus-nested mode detection, component/version rules, and release-option boundaries
- reason: traceability is mostly clean; next iteration should stress behavior-level correctness against command YAML and real repository topology
- rotation status: traceability completed, correctness pending
- blocked/productive carry-forward: productive -- direct file reads plus validator/CLI checks were high signal
- required evidence: targeted reads of create_changelog_auto.yaml/confirm YAML decision branches, version examples, and component folder behavior
