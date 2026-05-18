# Dimension

implementation-spec-alignment

# Files Reviewed

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/003-template-greenfield-impl/spec.md:76`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/003-template-greenfield-impl/spec.md:100`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/003-template-greenfield-impl/spec.md:122`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/003-template-greenfield-impl/resource-map.md:55`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/003-template-greenfield-impl/resource-map.md:74`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/003-template-greenfield-impl/resource-map.md:83`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/003-template-greenfield-impl/resource-map.md:96`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/003-template-greenfield-impl/implementation-summary.md:58`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/003-template-greenfield-impl/implementation-summary.md:74`
- `.opencode/skills/system-spec-kit/mcp_server/lib/templates/level-contract-resolver.ts:57`
- `.opencode/skills/system-spec-kit/scripts/templates/inline-gate-renderer.ts:182`
- `.opencode/skills/system-spec-kit/templates/manifest/spec-kit-docs.json:52`
- `.opencode/skills/system-spec-kit/templates/manifest/phase-parent.spec.md.tmpl:35`
- `.opencode/skills/system-spec-kit/scripts/spec/create.sh:1117`
- `.opencode/skills/system-spec-kit/scripts/spec/create.sh:1123`
- `.opencode/skills/system-spec-kit/scripts/tests/workflow-invariance.vitest.ts:45`
- `.opencode/skills/system-spec-kit/scripts/tests/workflow-invariance.vitest.ts:103`
- `.opencode/skills/system-spec-kit/scripts/tests/workflow-invariance.vitest.ts:120`

# Findings by Severity

## P0

None.

## P1

### DR-001-P1-001 [P1] Phase-parent scaffolding still emits private `manifest` vocabulary into generated public spec text

- File: `.opencode/skills/system-spec-kit/scripts/spec/create.sh:1123`
- Claim: The implementation does not fully satisfy ADR-005/workflow-invariance for phase-parent scaffold output because generated `spec.md` scope text still contains `child phase manifest`.
- Evidence: The spec requires the implementation to fix "Sub-phase manifest" wording and keep workflow-invariance green for public/AI-facing surfaces [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/003-template-greenfield-impl/spec.md:78`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/003-template-greenfield-impl/spec.md:103`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/003-template-greenfield-impl/spec.md:122`]. The phase-parent template itself uses taxonomy-neutral "Sub-phase list" wording [SOURCE: `.opencode/skills/system-spec-kit/templates/manifest/phase-parent.spec.md.tmpl:35`, `.opencode/skills/system-spec-kit/templates/manifest/phase-parent.spec.md.tmpl:37`]. However, `create.sh` renders that template for phase parents and then substitutes scope rows containing `child phase manifest` [SOURCE: `.opencode/skills/system-spec-kit/scripts/spec/create.sh:1117`, `.opencode/skills/system-spec-kit/scripts/spec/create.sh:1123`].
- Counterevidence sought: I checked the current workflow-invariance test. It scans markdown/YAML/JSON/TXT surfaces under templates, commands, agents, feature catalog, manual playbook, root policy docs, and live `--help` output [SOURCE: `.opencode/skills/system-spec-kit/scripts/tests/workflow-invariance.vitest.ts:45`, `.opencode/skills/system-spec-kit/scripts/tests/workflow-invariance.vitest.ts:103`, `.opencode/skills/system-spec-kit/scripts/tests/workflow-invariance.vitest.ts:120`]. That coverage does not exercise generated phase-parent body text from `create.sh`, so the clean template does not prove generated output is clean.
- Alternative explanation: The word "manifest" here could be intended as a generic phase listing rather than the private template manifest. That does not remove the mismatch because this exact wording class was called out for cleanup and the generated spec is an AI-readable public surface.
- Finding class: cross-consumer
- Scope proof: `rg -n "phase manifest|Sub-phase manifest|child phase manifest|phase map|manifest for" create.sh phase-parent.spec.md.tmpl workflow-invariance.vitest.ts .opencode/agent .opencode/commands/spec_kit` returned this single generated-output substitution site.
- Affected surface hints: ["phase-parent scaffold output", "workflow-invariance test", "public Level vocabulary"]
- Recommendation: Replace the generated scope text with taxonomy-neutral wording such as `child phase list` or `phase map`, and extend workflow-invariance coverage to scaffold a phase-parent or otherwise scan rendered phase-parent output.
- Final severity: P1
- Confidence: 0.93
- Downgrade trigger: Downgrade to P2 only if maintainers explicitly classify `child phase manifest` as allowed public terminology, or if an existing generated-output test outside this reviewed scope already fails on this text and blocks release.

## P2

None.

# Traceability Checks

- `spec_code`: Gap found. Manifest-backed resolver, renderer, manifest source, and deleted legacy directory checks align with the implementation ledger, but generated phase-parent output still contradicts the private-vocabulary cleanup requirement.
- `checklist_evidence`: Sampled via spec and implementation-summary claims; no `applied/T-*.md` task files were present for task-file cross-check in this packet.
- `resource-map`: Sampled core ledger entries for manifest/resolver/renderer/scaffolder/invariance surfaces. The reviewed paths exist or are intentionally deleted, except the finding above where an edited implementation path does not satisfy the stated wording cleanup intent.
- `overlay`: Template rendering and workflow-invariance coverage were sampled enough to classify the generated phase-parent wording as a missed public-surface case.

# Verdict

CONDITIONAL. One P1 implementation-spec-alignment gap remains. The implementation should not be treated as workflow-invariant for phase-parent scaffolding until generated output no longer emits `manifest` terminology and the regression surface is covered.

# Next Dimension

code-correctness
