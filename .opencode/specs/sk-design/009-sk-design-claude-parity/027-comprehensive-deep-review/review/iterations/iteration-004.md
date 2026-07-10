# Iteration 004 - Hub Catalog, Changelog, And Manual Playbook

## Dimension

- Correctness
- Traceability
- Assigned scope: `.opencode/skills/sk-design/feature_catalog/**`, `.opencode/skills/sk-design/changelog/**`, `.opencode/skills/sk-design/manual_testing_playbook/**`

## Files Reviewed

- `.opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/deep-review-strategy.md:40`
- `.opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/deep-review-findings-registry.json:11`
- `.opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/deep-review-config.json:54`
- `.opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/deep-review-state.jsonl:1`
- `.opencode/skills/sk-code/code-review/references/review_core.md:28`
- `.opencode/skills/sk-design/mode-registry.json:3`
- `.opencode/skills/sk-design/mode-registry.json:38`
- `.opencode/skills/sk-design/changelog/v1.0.0.0.md:3`
- `.opencode/skills/sk-design/changelog/v1.0.0.1.md:3`
- `.opencode/skills/sk-design/changelog/v1.0.0.2.md:3`
- `.opencode/skills/sk-design/changelog/v1.0.0.3.md:3`
- `.opencode/skills/sk-design/changelog/v1.1.0.0.md:1`
- `.opencode/skills/sk-design/changelog/v1.2.0.0.md:1`
- `.opencode/skills/sk-design/changelog/v1.4.3.0.md:1`
- `.opencode/skills/sk-design/feature_catalog/feature_catalog.md:15`
- `.opencode/skills/sk-design/feature_catalog/feature_catalog.md:97`
- `.opencode/skills/sk-design/manual_testing_playbook/manual_testing_playbook.md:32`
- `.opencode/skills/sk-design/manual_testing_playbook/manual_testing_playbook.md:35`
- `.opencode/skills/sk-design/manual_testing_playbook/01--mode-routing/mcp-open-design-mode.md:22`
- `.opencode/skills/sk-design/manual_testing_playbook/07--fallback-and-resilience/direct-fallback-without-subagents.md:22`

## Findings By Severity

### P0

- None.

### P1

#### P1-002 [P1] Newer changelog files omit required `version:` frontmatter

- Claim: Three changelog files do not carry the required YAML frontmatter `version:` field, even though this review packet's charter says every changelog file must have correct frontmatter with `version:`.
- Evidence refs: `.opencode/skills/sk-design/changelog/v1.1.0.0.md:1`, `.opencode/skills/sk-design/changelog/v1.2.0.0.md:1`, `.opencode/skills/sk-design/changelog/v1.4.3.0.md:1` all begin directly with an H1, not a `---` frontmatter block. Older changelog files demonstrate the required shape with `version:` at `.opencode/skills/sk-design/changelog/v1.0.0.0.md:3`, `.opencode/skills/sk-design/changelog/v1.0.0.1.md:3`, `.opencode/skills/sk-design/changelog/v1.0.0.2.md:3`, and `.opencode/skills/sk-design/changelog/v1.0.0.3.md:3`.
- Counterevidence sought: Searched the changelog directory for `version:` and inspected the three newer files directly; no `version:` frontmatter was present in those files.
- Alternative explanation: These may predate the newly established sk-doc requirement or have been authored before frontmatter was standardized. That explains the drift but does not satisfy the current frontmatter contract.
- Final severity: P1, because `review_core.md` classifies must-fix gate/spec mismatch issues as required fixes and the user charter explicitly made changelog frontmatter part of this iteration's correctness checks.
- Confidence: 0.98.
- Downgrade trigger: Downgrade to P2 only if the sk-doc requirement is changed to make changelog frontmatter optional or a generator proves these three files are intentionally exempt.

### P2

- None.

## Traceability Checks

- `changelog_frontmatter`: FAIL. Four older changelog entries have `version:` frontmatter; `v1.1.0.0.md`, `v1.2.0.0.md`, and `v1.4.3.0.md` do not.
- `feature_catalog_code`: PASS with no finding. The sampled hub catalog describes five workflow/design mode packets while separately documenting the `design-mcp-open-design` transport separation; current `mode-registry.json` has five `packetKind: "workflow"` modes plus one `packetKind: "transport"` mode.
- `playbook_capability`: PASS with no finding. Sampled root, Open Design transport, md-generator, and direct-fallback scenarios align with current mode-registry routing and tool-surface expectations.
- `skill_agent`: PASS with no finding. The sampled playbook expects a single `sk-design` advisor identity with hub mode resolution, matching the registry description.
- `checklist_evidence`: Not applicable for this leaf review iteration; no checklist completion state was modified.

## Verdict

CONDITIONAL. One new P1 was found in the assigned changelog surface. No P0 findings were found.

## Next Dimension

Continue Wave 1 after sibling iterations 2, 3, and 5 land, then run the wave-level reducer/registry merge once to avoid concurrent-write races.

Review verdict: CONDITIONAL
