# Deep Review Iteration 001 - Correctness

## Dispatcher

- Route: `Resolved route: mode=review target_agent=deep-review`
- Target: `.opencode/specs/sk-design/012-sk-design-program/006-design-mode-consolidation`
- Dimension: correctness
- Budget profile: verify (graphless direct reads, exact searches, and one existing checker run)
- Session: `fanout-sol-1785128932566-ou7z2l`, generation 1, lineageMode `new`

## Files Reviewed

- `.opencode/skills/sk-code/code-review/references/review-core.md`
- `.opencode/specs/sk-design/012-sk-design-program/006-design-mode-consolidation/review/lineages/sol/deep-review-config.json`
- `.opencode/specs/sk-design/012-sk-design-program/006-design-mode-consolidation/review/lineages/sol/deep-review-state.jsonl`
- `.opencode/specs/sk-design/012-sk-design-program/006-design-mode-consolidation/review/lineages/sol/deep-review-findings-registry.json`
- `.opencode/specs/sk-design/012-sk-design-program/006-design-mode-consolidation/review/lineages/sol/deep-review-strategy.md`
- `.opencode/skills/sk-design/mode-registry.json`
- `.opencode/skills/sk-design/hub-router.json`
- `.opencode/skills/sk-design/command-metadata.json`
- `.opencode/skills/sk-design/SKILL.md`
- `.opencode/commands/interface/design.md`
- `.opencode/commands/interface/motion.md`
- `.opencode/commands/interface/design-reference.md`
- `.opencode/skills/sk-design/design-interface/SKILL.md`
- `.opencode/skills/sk-design/shared/sk-code-handoff.md`
- `.opencode/skills/sk-design/shared/design-proof-token.md`
- `.opencode/skills/sk-design/shared/context-loading-contract.md`
- `.opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs`
- `.opencode/skills/sk-design/shared/scripts/design-command-surface-check.test.mjs`
- `.opencode/skills/sk-design/shared/scripts/interface-command-contract.test.mjs`
- `.opencode/skills/sk-design/manual-testing-playbook/mode-routing/foundations-mode.md`

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **Retired `foundations` and `audit` identities remain in the live sk-code handoff contract** -- `.opencode/skills/sk-design/shared/sk-code-handoff.md:61` -- The consolidation registry exposes only four workflow modes (`interface`, `motion`, `md-generator`, and `design-mcp-open-design`) [SOURCE: `.opencode/skills/sk-design/mode-registry.json:35`], and the public command surface has only three commands [SOURCE: `.opencode/skills/sk-design/hub-router.json:19`]. The live `/interface:design` choreography still loads `.opencode/skills/sk-design/shared/sk-code-handoff.md` for implementation handoff [SOURCE: `.opencode/skills/sk-design/command-metadata.json:61`], but that shared contract still defines separate `foundations` and `audit` mode extensions [SOURCE: `.opencode/skills/sk-design/shared/sk-code-handoff.md:61`, SOURCE: `.opencode/skills/sk-design/shared/sk-code-handoff.md:71`] and says those retired children use the schema [SOURCE: `.opencode/skills/sk-design/shared/sk-code-handoff.md:105`]. A static-system or audit handoff can therefore speak obsolete mode ownership at the sk-design to sk-code boundary, contradicting the four-mode consolidation and the claim that retired identities have no live consumer.
   - Finding class: cross-consumer
   - Scope proof: Exact search for retired identities found no registry `workflowMode` or command owner for `foundations`/`audit`, while `command-metadata.json` loads `shared/sk-code-handoff.md` as a command handoff resource and that resource still names those retired child users.
   - Affected surface hints: [`sk-design shared handoff`, `/interface:design`, `sk-code implementation handoff`, `retired foundations/audit cleanup`]
   - content_hash: `sha256:47801c789f3b96be294af51317d3f50088f6160a61b8fa171d004e47d7dae547`
   - Claim adjudication:
```json
{
  "type": "gate-relevant-p1",
  "claim": "A live handoff contract loaded by current command metadata still assigns ownership to retired foundations/audit identities.",
  "evidenceRefs": [
    ".opencode/skills/sk-design/mode-registry.json:35",
    ".opencode/skills/sk-design/hub-router.json:19",
    ".opencode/skills/sk-design/command-metadata.json:61",
    ".opencode/skills/sk-design/shared/sk-code-handoff.md:61",
    ".opencode/skills/sk-design/shared/sk-code-handoff.md:71",
    ".opencode/skills/sk-design/shared/sk-code-handoff.md:105"
  ],
  "counterevidenceSought": "Checked the registry, hub command surface, exact retired-identity search, and existing command-surface checker. The checker validates the three-command/four-mode surface but does not inspect sk-code-handoff retired child usage.",
  "alternativeExplanation": "The stale sections may be intended as historical notes, but the file is titled a shared handoff schema and its usage section is phrased as active requirements.",
  "finalSeverity": "P1",
  "confidence": "high",
  "downgradeTrigger": "Downgrade to P2 if maintainers mark the foundations/audit sections explicitly historical and prove no command/workflow loads this file for implementation handoff."
}
```

### P2 Findings

1. **Proof-token example uses a non-registry `foundations` workflow mode** -- `.opencode/skills/sk-design/shared/design-proof-token.md:68` -- The proof-token schema requires `workflowModes` to contain registry-valid sk-design workflow modes [SOURCE: `.opencode/skills/sk-design/shared/design-proof-token.md:36`], and the newer context-loading contract enumerates valid non-transport modes as `interface`, `motion`, or `md-generator` [SOURCE: `.opencode/skills/sk-design/shared/context-loading-contract.md:305`]. The JSON example still uses `["interface", "foundations"]` [SOURCE: `.opencode/skills/sk-design/shared/design-proof-token.md:68`], which teaches an invalid retired mode in an otherwise validator-facing contract.
   - Finding class: instance-only
   - Scope proof: Exact search found the invalid example in `shared/design-proof-token.md`; the adjacent normative lines require registry-valid modes, and `context-loading-contract.md` lists the current valid non-transport set.
   - Affected surface hints: [`DESIGN_PROOF_TOKEN docs`, `context loading proof`, `Open Design transport proof`]
   - content_hash: `sha256:e26c9a3f2d44455c784f2cc7af1b956a351db6cb81c9f6b69dac77fc3aab48a8`

## Traceability Checks

- `spec_code`: partial. Registry and command surface match the four-mode/three-command claim, but the live handoff contract contradicts the retired-identity cleanup claim.
- `checklist_evidence`: not covered in this correctness iteration beyond command-surface checker evidence.
- `skill_agent`: partial. Hub, registry, interface skill routing, and command metadata were checked directly.
- `feature_catalog_code`: partial. The foundations manual routing scenario still documents correct mode resolution and a known resource-map gap; no manual run was performed.
- `playbook_capability`: partial. Static visual-system reachability is present through `VISUAL_SYSTEM` in `design-interface/SKILL.md`.

## Integration Evidence

- `.opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs --json` returned `status: "valid"`, `commandCount: 3`, and workflow modes `design-mcp-open-design`, `interface`, `md-generator`, `motion`.
- `.opencode/skills/sk-design/shared/scripts/design-command-surface-check.test.mjs` asserts the allowed command/token set is `/interface:design`, `/interface:design-reference`, `/interface:motion`, and `design-mcp-open-design` [SOURCE: `.opencode/skills/sk-design/shared/scripts/design-command-surface-check.test.mjs:63`].

## Edge Cases

- Graph data was unavailable by dispatch; this iteration used direct line reads, exact searches, and the existing command-surface checker as the graphless fallback.
- Several historical benchmark/changelog/manual-testing references still mention retired identities. These were not treated as findings unless a live command, shared contract, or validation-facing document consumed them.
- The P1 is limited to the sk-design to sk-code handoff boundary; no public `/interface:*` command for `foundations` or `audit` was found.

## Confirmed-Clean Surfaces

- `mode-registry.json` lists exactly four modes and no `foundations`/`audit` `workflowMode`.
- `hub-router.json` maps exactly three public `/interface:*` commands and defaults generic design routing to `interface`.
- `/interface:design`, `/interface:motion`, and `/interface:design-reference` wrappers bind to `interface`, `motion`, and `md-generator` respectively.
- Static visual-system reachability exists through the interface lane: `command-metadata.json` has `VISUAL_SYSTEM` / `visual-system`, and `design-interface/SKILL.md` maps `VISUAL_SYSTEM` to the relocated foundations references and assets.

## Ruled Out

- No P0 candidate: no destructive data loss, exploit path, or auth/security bypass was found in this correctness pass.
- No active finding for the three-command surface: the registry, hub router, wrappers, and checker agree on three public commands.
- No active finding for generic `foundations` keyword routing: `hub-router.json` routes foundations vocabulary classes into `interface`, and the manual scenario expects `workflowMode: interface`.

## Next Focus

- dimension: security
- focus area: path handling, shell/process gates, trust boundaries, and removed safeguards
- reason: correctness found stale retired identity cleanup at the handoff boundary but no command-count or registry-count failure
- rotation status: D1 completed; proceed to D2
- blocked/productive carry-forward: productive direct-read plus exact-search fallback; avoid re-running broad corpus searches over `styles/` and historical benchmark directories
- required evidence: shell/write authority in md-generator, Open Design transport boundary, command wrappers, and any path/overwrite gates

Review verdict: CONDITIONAL
