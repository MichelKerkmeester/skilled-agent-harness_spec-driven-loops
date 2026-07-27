# Deep Review Iteration 004

## Dispatcher

- Route proof: Resolved route: mode=review target_agent=deep-review
- Session: `fanout-sol-1785128932566-ou7z2l`
- Generation: `1`
- Lineage mode: `new`
- Target: `.opencode/specs/sk-design/012-sk-design-program/006-design-mode-consolidation`
- Focus: maintainability
- Budget profile: verify
- Status: complete

## Files Reviewed

- `.opencode/skills/sk-code/code-review/references/review-core.md`
- `.opencode/specs/sk-design/012-sk-design-program/006-design-mode-consolidation/review/lineages/sol/deep-review-state.jsonl`
- `.opencode/specs/sk-design/012-sk-design-program/006-design-mode-consolidation/review/lineages/sol/deep-review-findings-registry.json`
- `.opencode/specs/sk-design/012-sk-design-program/006-design-mode-consolidation/review/lineages/sol/deep-review-strategy.md`
- `.opencode/specs/sk-design/012-sk-design-program/006-design-mode-consolidation/review/lineages/sol/deep-review-config.json`
- `.opencode/skills/sk-design/SKILL.md`
- `.opencode/skills/sk-design/mode-registry.json`
- `.opencode/skills/sk-design/hub-router.json`
- `.opencode/skills/sk-design/command-metadata.json`
- `.opencode/commands/interface/design.md`
- `.opencode/skills/sk-design/design-interface/SKILL.md`
- `.opencode/skills/sk-design/design-interface/procedures/component-system-inventory.md`
- `.opencode/skills/sk-design/design-interface/procedures/hierarchy-rhythm-review.md`
- `.opencode/skills/sk-design/design-interface/procedures/tweakable-design-controls.md`
- `.opencode/skills/sk-design/design-interface/manual-testing-playbook/manual-testing-playbook.md`
- `.opencode/skills/sk-design/shared/procedure-card-schema.md`
- `.opencode/skills/sk-design/shared/creation-contract.md`
- `.opencode/skills/sk-design/shared/scripts/procedure-card-schema-check.mjs`
- `.opencode/specs/sk-design/012-sk-design-program/006-design-mode-consolidation/implementation-summary.md`

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **Retained foundations procedure cards are absent from the live interface selection contract** -- `.opencode/skills/sk-design/design-interface/SKILL.md:87` -- The interface mode's conditional procedure list names only six interface procedure cards plus shared polish, and the Section 3 selection table repeats the same six-card set at `.opencode/skills/sk-design/design-interface/SKILL.md:180-188`. The command choreography has the same list in `.opencode/skills/sk-design/command-metadata.json:51`. Three retained foundations cards still exist and carry active triggers at `.opencode/skills/sk-design/design-interface/procedures/component-system-inventory.md:21`, `.opencode/skills/sk-design/design-interface/procedures/hierarchy-rhythm-review.md:21`, and `.opencode/skills/sk-design/design-interface/procedures/tweakable-design-controls.md:21`, while the manual playbook still treats the foundations procedure-card scenarios as release-relevant at `.opencode/skills/sk-design/design-interface/manual-testing-playbook/manual-testing-playbook.md:671` and `.opencode/skills/sk-design/design-interface/manual-testing-playbook/manual-testing-playbook.md:704`. The moved cards are therefore present but not discoverable through the active selection contract that agents are told to follow. Content hash: `sha256:f5358f85202628977e04a3ad2bc8e83765f1ff03aab2e743f3e5a764e98e6652`.
   Finding class: cross-consumer
   Scope proof: Exact searches for `component-system-inventory`, `hierarchy-rhythm-review`, and `tweakable-design-controls` across `SKILL.md`, `command-metadata.json`, `/interface:design`, and the shared command-surface tests found no live selection-contract entry; direct reads confirmed the three files exist under `design-interface/procedures/`.
   Affected surface hints: ["interface procedure selection", "foundations visual-system cards", "/interface:design choreography", "manual testing playbook", "procedure-card schema checker"]

```json
{"type":"gate-relevant-p1","claim":"Retained foundations procedure cards are present on disk and remain release-relevant, but the live interface mode and command choreography omit them from the selectable procedure-card contract.","evidenceRefs":[".opencode/skills/sk-design/design-interface/SKILL.md:87",".opencode/skills/sk-design/design-interface/SKILL.md:180",".opencode/skills/sk-design/design-interface/SKILL.md:188",".opencode/skills/sk-design/command-metadata.json:51",".opencode/skills/sk-design/design-interface/procedures/component-system-inventory.md:21",".opencode/skills/sk-design/design-interface/procedures/hierarchy-rhythm-review.md:21",".opencode/skills/sk-design/design-interface/procedures/tweakable-design-controls.md:21",".opencode/skills/sk-design/design-interface/manual-testing-playbook/manual-testing-playbook.md:671",".opencode/skills/sk-design/design-interface/manual-testing-playbook/manual-testing-playbook.md:704"],"counterevidenceSought":"Checked the hub references, interface resource-loading table, interface Section 3 procedure selection table, command metadata choreography, /interface:design command, command-surface tests, and direct on-disk procedure inventory. The three foundations cards are present but not named by the live selection contracts; procedure-card-schema-check.mjs also reports exactly those three cards as failing the current required-field schema.","alternativeExplanation":"The cards may have been intentionally left as historical/manual-only material. That does not fit the live tree because they are under `design-interface/procedures/`, have active trigger phrases, and the playbook still requires the foundations procedure-card scenarios for release readiness.","finalSeverity":"P1","confidence":"high","downgradeTrigger":"Downgrade to P2 if maintainers explicitly mark the three files as historical/non-selectable and remove them from release-readiness playbook expectations."}
```

### P2 Findings

1. **Shared procedure and proof contracts still bless retired foundations/audit owners** -- `.opencode/skills/sk-design/shared/procedure-card-schema.md:56` -- The shared procedure-card schema still lists `design-foundations` and `design-audit` as valid owning modes, and its read-only compatibility row repeats both retired owners at `.opencode/skills/sk-design/shared/procedure-card-schema.md:72`. The same file's example card is still a `design-audit` card at `.opencode/skills/sk-design/shared/procedure-card-schema.md:119` and `.opencode/skills/sk-design/shared/procedure-card-schema.md:120`; separately, the shared creation contract's deterministic-minimum table still has `foundations` and `audit` rows at `.opencode/skills/sk-design/shared/creation-contract.md:167` and `.opencode/skills/sk-design/shared/creation-contract.md:169`. This does not currently prove a runtime routing failure, but it keeps the retired ownership vocabulary alive in maintainer-facing contracts that future cards and proof tables copy from. Content hash: `sha256:d162e1bd9c198b2d4c8eb7a958c28b8c4506c1ef51ff85e7e16901ed0e7c73f7`.
   Finding class: cross-consumer
   Scope proof: Narrow exact searches over shared procedure/proof contracts found stale retired owners in schema and proof-minimum docs; current registry reads confirm only `interface`, `motion`, `md-generator`, and `design-mcp-open-design` remain registered.
   Affected surface hints: ["procedure-card schema", "creation proof table", "future procedure cards", "maintainer examples"]

## Traceability Checks

- `spec_code`: partial. Current resource files for the visual-system `RESOURCE_MAP` exist, but retained procedure-card discoverability is inconsistent with the live interface selection contract.
- `checklist_evidence`: partial. Not reopened as a checklist audit; maintainability evidence came from current contracts and release-relevant playbook lines only.
- `skill_agent`: partial. Hub, registry, command metadata, interface mode, and procedure-card schema were reviewed; schema/checker results show three moved foundations procedure cards fail the live procedure schema.
- `agent_cross_runtime`: notApplicable. No agent-definition or runtime mirror change was claimed.
- `feature_catalog_code`: notApplicable. Prior broad feature-catalog/playbook routes remain exhausted; this pass used only release-relevant manual-playbook lines as support for the retained procedure-card issue.
- `playbook_capability`: partial. The playbook still expects the foundations procedure-card scenarios, which supports the active-discoverability finding; no manual scenario was executed.

## Integration Evidence

- `node .opencode/skills/sk-design/shared/scripts/procedure-card-schema-check.mjs` returned `status: "fail"`, `cardCount: 12`, and `failingCardCount: 3`; the three failures are `component-system-inventory.md`, `hierarchy-rhythm-review.md`, and `tweakable-design-controls.md`.
- Direct existence checks confirmed all `VISUAL_SYSTEM` resource-map references in `design-interface/SKILL.md` exist under `design-interface/references/foundations/` or `design-interface/assets/foundations/`.
- Exact searches found no live selection-contract references to `component-system-inventory`, `hierarchy-rhythm-review`, or `tweakable-design-controls` in `design-interface/SKILL.md`, `command-metadata.json`, `/interface:design`, or the command-surface tests.

## Edge Cases

- Code graph data was unavailable; this iteration used direct reads, exact searches, file existence checks, and one local schema-check command.
- One exploratory search had a shell quoting caveat and was not used as sole evidence; direct line reads and narrowed exact searches supplied the cited proof.
- Historical feature-catalog and broad manual-playbook claims were not treated as active findings unless tied to current live contracts or release-readiness language.
- Stale shared references to `foundations` were downgraded to P2 where they did not prove active selection or routing failure.

## Confirmed-Clean Surfaces

- `mode-registry.json` still registers only `interface`, `motion`, `md-generator`, and `design-mcp-open-design`.
- The `VISUAL_SYSTEM` resource-map file paths checked in this iteration exist on disk.
- No new P0 candidate was found.

## Ruled Out

- No missing-file finding for the `VISUAL_SYSTEM` resource map; all checked referenced files exist.
- No repeat finding for the prior sk-code handoff retired-identity issue; this iteration's P1 has a separate root cause in interface procedure-card discoverability.
- No P1 escalation for the shared procedure/proof table stale owner vocabulary; current evidence supports maintainability drift, not immediate runtime failure.

## Next Focus

- dimension: cross-reference/readiness
- focus area: final iteration carry-forward, active P1/P2 synthesis readiness, and no-retry confirmation for exhausted searches
- reason: all four named dimensions have been reviewed once; iteration 5 should avoid reopening blocked broad searches and prepare reducer/synthesis evidence.
- rotation status: maintainability complete; fallback to final cross-reference/readiness.
- blocked/productive carry-forward: Productive direct reads and exact searches; blocked broad `foundations`/`audit` corpus searches remain exhausted.
- required evidence: active finding carry-forward, state/strategy consistency, and any newly verified remediation if files changed before iteration 5.

Review verdict: CONDITIONAL
