# Deep Review Iteration 005

## Dispatcher

- Route proof: `Resolved route: mode=review target_agent=deep-review`
- Mode: review
- Target agent: deep-review
- Session: `fanout-sol-1785128932566-ou7z2l`
- Generation: `1`
- Lineage mode: `new`
- Target: `.opencode/specs/sk-design/012-sk-design-program/006-design-mode-consolidation`
- Focus: stabilization and adversarial replay across correctness, security, traceability, and maintainability
- Budget profile: adjudicate
- Status: complete

## Files Reviewed

- `.opencode/skills/sk-code/code-review/references/review-core.md`
- `.opencode/specs/sk-design/012-sk-design-program/006-design-mode-consolidation/review/lineages/sol/deep-review-state.jsonl`
- `.opencode/specs/sk-design/012-sk-design-program/006-design-mode-consolidation/review/lineages/sol/deep-review-findings-registry.json`
- `.opencode/specs/sk-design/012-sk-design-program/006-design-mode-consolidation/review/lineages/sol/deep-review-strategy.md`
- `.opencode/specs/sk-design/012-sk-design-program/006-design-mode-consolidation/review/lineages/sol/deep-review-config.json`
- `.opencode/specs/sk-design/012-sk-design-program/006-design-mode-consolidation/review/lineages/sol/iterations/iteration-001.md`
- `.opencode/specs/sk-design/012-sk-design-program/006-design-mode-consolidation/review/lineages/sol/iterations/iteration-002.md`
- `.opencode/specs/sk-design/012-sk-design-program/006-design-mode-consolidation/review/lineages/sol/iterations/iteration-003.md`
- `.opencode/specs/sk-design/012-sk-design-program/006-design-mode-consolidation/review/lineages/sol/iterations/iteration-004.md`
- `.opencode/skills/sk-design/shared/sk-code-handoff.md`
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/guided-run.ts`
- `.opencode/specs/sk-design/012-sk-design-program/006-design-mode-consolidation/spec.md`
- `.opencode/specs/sk-design/012-sk-design-program/006-design-mode-consolidation/checklist.md`
- `.opencode/specs/sk-design/012-sk-design-program/006-design-mode-consolidation/decision-record.md`
- `.opencode/specs/sk-design/012-sk-design-program/006-design-mode-consolidation/implementation-summary.md`
- `.opencode/skills/sk-design/command-metadata.json`
- `.opencode/skills/sk-design/mode-registry.json`
- `.opencode/skills/sk-design/hub-router.json`
- `.opencode/skills/sk-design/design-interface/SKILL.md`
- `.opencode/commands/interface/design.md`
- `.opencode/skills/sk-design/shared/scripts/interface-command-contract.test.mjs`
- `.opencode/skills/sk-design/shared/scripts/design-command-surface-check.test.mjs`
- `.opencode/skills/sk-design/design-md-generator/backend/tests/guided-run.test.ts`
- `.opencode/skills/sk-design/design-md-generator/references/guided-run.md`
- `.opencode/skills/sk-design/shared/design-proof-token.md`
- `.opencode/skills/sk-design/shared/procedure-card-schema.md`
- `.opencode/skills/sk-design/shared/creation-contract.md`
- `.opencode/skills/sk-design/shared/scripts/procedure-card-schema-check.mjs`

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None.

## Findings - Refinements

### P0 Findings

None.

### P1 Findings

1. **Retired `foundations` and `audit` identities remain in the live sk-code handoff contract** -- `.opencode/skills/sk-design/shared/sk-code-handoff.md:61` -- Reconfirmed. The live `/interface:design` choreography still loads `shared/sk-code-handoff.md` for implementation handoff [SOURCE: `.opencode/skills/sk-design/command-metadata.json:61`], and that file still presents active `foundations` and `audit` handoff cards plus child usage [SOURCE: `.opencode/skills/sk-design/shared/sk-code-handoff.md:61`; SOURCE: `.opencode/skills/sk-design/shared/sk-code-handoff.md:71`; SOURCE: `.opencode/skills/sk-design/shared/sk-code-handoff.md:105`]. Counterevidence confirms the public command surface remains three commands/four modes rather than resolving the stale shared contract [SOURCE: `.opencode/skills/sk-design/shared/scripts/design-command-surface-check.test.mjs:63`; SOURCE: `.opencode/skills/sk-design/shared/scripts/design-command-surface-check.test.mjs:72`; SOURCE: `.opencode/skills/sk-design/shared/scripts/interface-command-contract.test.mjs:34`].
   - Finding class: cross-consumer
   - Scope proof: Narrow reads found `shared/sk-code-handoff.md` loaded by command metadata for three current commands, while registry and command tests validate only the public mode/command surface and do not inspect retired child usage inside the shared handoff contract.
   - Affected surface hints: [`sk-design shared handoff`, `/interface:design`, `/interface:motion`, `/interface:design-reference`, `sk-code implementation handoff`]
   - content_hash: `sha256:41de1ec45a0218917f8cb8d78d85984217634f1da2ac149b2c2c1a507c8bbd18`
```json
{"type":"gate-relevant-p1","claim":"A live handoff contract loaded by current command metadata still assigns active handoff semantics to retired foundations/audit identities.","evidenceRefs":[".opencode/skills/sk-design/command-metadata.json:61",".opencode/skills/sk-design/shared/sk-code-handoff.md:61",".opencode/skills/sk-design/shared/sk-code-handoff.md:71",".opencode/skills/sk-design/shared/sk-code-handoff.md:105",".opencode/skills/sk-design/shared/scripts/design-command-surface-check.test.mjs:63",".opencode/skills/sk-design/shared/scripts/interface-command-contract.test.mjs:34"],"counterevidenceSought":"Reread command metadata, the shared handoff source, current registry, command-surface tests, and interface-command-contract tests. The tests prove the public command surface but do not mark the foundations/audit handoff cards historical or remove the live shared-contract load.","alternativeExplanation":"The sections may be stale remnants rather than intended routes; severity remains P1 because they sit in the live implementation handoff schema consumed by current commands.","finalSeverity":"P1","confidence":"high","downgradeTrigger":"Downgrade to P2 only if the handoff contract marks those cards historical/non-selectable or command metadata stops loading this file for current implementation handoff."}
```

2. **Guided md-generator can delete and rewrite an arbitrary `--design-md` path outside the output policy** -- `.opencode/skills/sk-design/design-md-generator/backend/scripts/guided-run.ts:275` -- Reconfirmed. `runPreflight()` validates only `options.output` through `resolveOutputPath()` [SOURCE: `.opencode/skills/sk-design/design-md-generator/backend/scripts/guided-run.ts:165`], while `--design-md` is independently resolved without the policy [SOURCE: `.opencode/skills/sk-design/design-md-generator/backend/scripts/guided-run.ts:275`] and can be deleted and rewritten in the STUDY retry path [SOURCE: `.opencode/skills/sk-design/design-md-generator/backend/scripts/guided-run.ts:337`; SOURCE: `.opencode/skills/sk-design/design-md-generator/backend/scripts/guided-run.ts:349`]. The negative tests still cover unsafe output paths, not unsafe `designMd` paths [SOURCE: `.opencode/skills/sk-design/design-md-generator/backend/tests/guided-run.test.ts:28`; SOURCE: `.opencode/skills/sk-design/design-md-generator/backend/tests/guided-run.test.ts:41`; SOURCE: `.opencode/skills/sk-design/design-md-generator/backend/tests/guided-run.test.ts:47`].
   - Finding class: cross-consumer
   - Scope proof: `guided-run.test.ts` verifies `--output` allowlisting and absolute argument threading, but the reviewed tests contain no negative `--design-md` policy case before the delete/write retry path.
   - Affected surface hints: [`md-generator guided-run wrapper`, `STUDY retry path`, `output-policy contract`, `/interface:design-reference`, `guided-run tests`]
   - content_hash: `sha256:19bb504ad33707c2a5f0118ce34191244af9d2f409ab143c49e6d9f7aeb1cac1`
```json
{"type":"gate-relevant-p1","claim":"The md-generator guided runner can mutate a DESIGN.md path that was not checked by the shared output policy.","evidenceRefs":[".opencode/skills/sk-design/design-md-generator/backend/scripts/guided-run.ts:165",".opencode/skills/sk-design/design-md-generator/backend/scripts/guided-run.ts:275",".opencode/skills/sk-design/design-md-generator/backend/scripts/guided-run.ts:337",".opencode/skills/sk-design/design-md-generator/backend/scripts/guided-run.ts:349",".opencode/skills/sk-design/design-md-generator/backend/tests/guided-run.test.ts:28",".opencode/skills/sk-design/design-md-generator/backend/tests/guided-run.test.ts:41",".opencode/skills/sk-design/design-md-generator/backend/tests/guided-run.test.ts:47"],"counterevidenceSought":"Reread guided-run.ts, guided-run.test.ts, guided-run.md, and output-policy tests. The reference says the wrapper checks existing tokens/DESIGN.md paths, but implementation and tests still policy-check only output.","alternativeExplanation":"The mutation is local and user-selected, which keeps it below P0. It remains a P1 boundary defect because a declared mutating pipeline allowlist protects output but not the second file it deletes and rewrites.","finalSeverity":"P1","confidence":"high","downgradeTrigger":"Downgrade to P2 if --design-md receives an equivalent output-policy/confirmation contract or is documented as intentionally outside the declared policy boundary."}
```

3. **Active security NFR still requires retired audit shell/path gates to remain intact** -- `.opencode/specs/sk-design/012-sk-design-program/006-design-mode-consolidation/spec.md:157` -- Reconfirmed. `spec.md` still states `NFR-S01` as an active requirement to keep audit shell/path-validation gates intact [SOURCE: `.opencode/specs/sk-design/012-sk-design-program/006-design-mode-consolidation/spec.md:157`]. ADR-002 says `/interface:audit` and `/interface:foundations` were retired entirely [SOURCE: `.opencode/specs/sk-design/012-sk-design-program/006-design-mode-consolidation/decision-record.md:151`; SOURCE: `.opencode/specs/sk-design/012-sk-design-program/006-design-mode-consolidation/decision-record.md:153`], and the checklist marks the same audit gate N/A because no remaining gate exists [SOURCE: `.opencode/specs/sk-design/012-sk-design-program/006-design-mode-consolidation/checklist.md:81`].
   - Finding class: matrix/evidence
   - Scope proof: The active NFR, accepted ADR, and checklist evidence still disagree on whether the audit security gate is live, superseded, or waived.
   - Affected surface hints: [`spec security NFR`, `ADR-002 retirement contract`, `checklist security gate`, `release readiness`]
   - content_hash: `sha256:5d7f456b23db7885dae5da17c08cf3cd3691fbc268dd5fc83e06b8c010ca7b56`
```json
{"type":"gate-relevant-p1","claim":"The packet has an active security requirement to preserve audit shell/path gates even though ADR-002 retired audit and the checklist marks that gate N/A.","evidenceRefs":[".opencode/specs/sk-design/012-sk-design-program/006-design-mode-consolidation/spec.md:157",".opencode/specs/sk-design/012-sk-design-program/006-design-mode-consolidation/decision-record.md:151",".opencode/specs/sk-design/012-sk-design-program/006-design-mode-consolidation/decision-record.md:153",".opencode/specs/sk-design/012-sk-design-program/006-design-mode-consolidation/checklist.md:81"],"counterevidenceSought":"Reread the active NFR, ADR-002 decision text, checklist security rows, implementation-summary current-stage notes, and current command topology. The topology confirms retirement but does not supersede the active NFR line.","alternativeExplanation":"The NFR is likely stale ADR-001 prose. It remains P1 because it is still in the active security requirements section and contradicts release checklist semantics.","finalSeverity":"P1","confidence":"high","downgradeTrigger":"Downgrade to P2 if NFR-S01 is explicitly marked superseded or rewritten to the ADR-002 security rationale."}
```

4. **Retained foundations procedure cards are absent from the live interface selection contract** -- `.opencode/skills/sk-design/design-interface/SKILL.md:87` -- Reconfirmed. The resource-loading table and procedure selection table name the current selectable cards but still omit `component-system-inventory`, `hierarchy-rhythm-review`, and `tweakable-design-controls` [SOURCE: `.opencode/skills/sk-design/design-interface/SKILL.md:87`; SOURCE: `.opencode/skills/sk-design/design-interface/SKILL.md:180`; SOURCE: `.opencode/skills/sk-design/design-interface/SKILL.md:188`]. The command choreography also omits them [SOURCE: `.opencode/skills/sk-design/command-metadata.json:51`]. Counterevidence strengthens the finding rather than resolving it: the public command now has a `visual-system` task lane [SOURCE: `.opencode/commands/interface/design.md:62`] and hub foundations aliases route to `interface` [SOURCE: `.opencode/skills/sk-design/hub-router.json:28`; SOURCE: `.opencode/skills/sk-design/hub-router.json:146`], but the exact retained card names are absent from the live selection contracts; the schema checker still fails exactly those three cards.
   - Finding class: cross-consumer
   - Scope proof: Exact searches across `design-interface/SKILL.md`, `command-metadata.json`, `/interface:design`, and command-surface tests found no live selection-contract references to the three retained foundations procedure-card filenames; `procedure-card-schema-check.mjs` reports only those three cards failing.
   - Affected surface hints: [`interface procedure selection`, `foundations visual-system cards`, `/interface:design choreography`, `procedure-card schema checker`, `visual-system task lane`]
   - content_hash: `sha256:a9a9c0e9e126677f27506eaa61303d8f2edddc8d6e043c1a2513a64e0db26477`
```json
{"type":"gate-relevant-p1","claim":"Retained foundations procedure cards are present and release-relevant, but the live interface mode and command choreography omit them from the selectable procedure-card contract.","evidenceRefs":[".opencode/skills/sk-design/design-interface/SKILL.md:87",".opencode/skills/sk-design/design-interface/SKILL.md:180",".opencode/skills/sk-design/design-interface/SKILL.md:188",".opencode/skills/sk-design/command-metadata.json:51",".opencode/commands/interface/design.md:62",".opencode/skills/sk-design/hub-router.json:28",".opencode/skills/sk-design/hub-router.json:146"],"counterevidenceSought":"Reread interface routing, command choreography, /interface:design task lanes, hub foundations aliases, command tests, and reran procedure-card-schema-check.mjs. The visual-system lane and aliases preserve static-system routing, but the three retained cards remain non-selectable by filename and fail the current card schema.","alternativeExplanation":"The files could be intended as historical/manual-only material. That does not fit their location under design-interface/procedures plus current visual-system routing semantics, so P1 remains supported.","finalSeverity":"P1","confidence":"high","downgradeTrigger":"Downgrade to P2 if maintainers mark these files non-selectable/historical or add an explicit selection mapping that intentionally bypasses procedure-card filename selection."}
```

### P2 Findings

1. **Proof-token example uses a non-registry `foundations` workflow mode** -- `.opencode/skills/sk-design/shared/design-proof-token.md:68` -- Reconfirmed as P2. The schema requires registry-valid workflow modes [SOURCE: `.opencode/skills/sk-design/shared/design-proof-token.md:36`], but the example still uses `["interface", "foundations"]` [SOURCE: `.opencode/skills/sk-design/shared/design-proof-token.md:68`]. This remains documentation drift, not an independently required-fix gate.
   - Finding class: instance-only
   - Scope proof: The invalid example remains local to the proof-token contract; current command-surface checks still validate the public command set separately.
   - Affected surface hints: [`DESIGN_PROOF_TOKEN docs`, `context loading proof`, `Open Design transport proof`]
   - content_hash: `sha256:65bec07aafcb937972cfb7edfb7af8c88d8119fe79aa4e0808442d87753056c4`

2. **Checklist frontmatter still describes the superseded permanent-subworkflow verification target** -- `.opencode/specs/sk-design/012-sk-design-program/006-design-mode-consolidation/checklist.md:3` -- Reconfirmed as P2. The frontmatter still describes permanent interface-owned foundations and audit workflows [SOURCE: `.opencode/specs/sk-design/012-sk-design-program/006-design-mode-consolidation/checklist.md:3`], while the body marks the retired command checks N/A [SOURCE: `.opencode/specs/sk-design/012-sk-design-program/006-design-mode-consolidation/checklist.md:59`; SOURCE: `.opencode/specs/sk-design/012-sk-design-program/006-design-mode-consolidation/checklist.md:60`; SOURCE: `.opencode/specs/sk-design/012-sk-design-program/006-design-mode-consolidation/checklist.md:81`].
   - Finding class: instance-only
   - Scope proof: The stale permanent-subworkflow wording is frontmatter metadata; body rows correctly record ADR-002 N/A treatment.
   - Affected surface hints: [`checklist frontmatter`, `memory search summaries`, `resume context`, `documentation verification`]
   - content_hash: `sha256:a70ea03b63981409ff1605929343984fb9520274d1602b5401d4ac3f438a3a47`

3. **Shared procedure and proof contracts still bless retired foundations/audit owners** -- `.opencode/skills/sk-design/shared/procedure-card-schema.md:56` -- Reconfirmed as P2. The schema still lists `design-foundations` and `design-audit` as owning modes [SOURCE: `.opencode/skills/sk-design/shared/procedure-card-schema.md:56`] and repeats them in read-only compatibility guidance [SOURCE: `.opencode/skills/sk-design/shared/procedure-card-schema.md:72`]. The example remains `design-audit` [SOURCE: `.opencode/skills/sk-design/shared/procedure-card-schema.md:119`; SOURCE: `.opencode/skills/sk-design/shared/procedure-card-schema.md:120`], and the creation contract still has `foundations` and `audit` proof-minimum rows [SOURCE: `.opencode/skills/sk-design/shared/creation-contract.md:167`; SOURCE: `.opencode/skills/sk-design/shared/creation-contract.md:169`].
   - Finding class: cross-consumer
   - Scope proof: Current registry/command checks confirm only four modes and three commands; these shared examples keep retired vocabulary alive without proving a current routing failure.
   - Affected surface hints: [`procedure-card schema`, `creation proof table`, `future procedure cards`, `maintainer examples`]
   - content_hash: `sha256:613b15f71adcce2c08cba210e22964e0b97c50e7b409adeff681fb4f0f9854c5`

## Traceability Checks

- `spec_code`: partial. Stabilization confirms the four-mode/three-command topology and no live old command surface, but active spec/security and shared-contract mismatches remain.
- `checklist_evidence`: partial. The checklist accurately marks many ADR-002-superseded rows N/A and leaves unrun gates pending, but the stale frontmatter and active NFR conflict remain.
- `skill_agent`: partial. Command metadata, registry, hub router, interface command, command tests, md-generator tests, and schema checker were reviewed; active P1s remain at handoff, md-generator write policy, spec NFR, and procedure-card selection boundaries.
- `agent_cross_runtime`: notApplicable. No agent-definition or runtime mirror change was claimed.
- `feature_catalog_code`: notApplicable. Prior broad feature-catalog routes remain exhausted; this pass used current source, tests, and packet evidence only.
- `playbook_capability`: partial. Prior playbook evidence remains a supporting signal for retained foundations cards; this pass did not rerun manual playbook scenarios.

## Integration Evidence

- `node .opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs --json` returned `status: "valid"`, `commandCount: 3`, workflow modes `design-mcp-open-design`, `interface`, `md-generator`, and `motion`, and no drift.
- `node .opencode/skills/sk-design/shared/scripts/procedure-card-schema-check.mjs` returned `status: "fail"`, `cardCount: 12`, and `failingCardCount: 3`; the failures were `component-system-inventory.md`, `hierarchy-rhythm-review.md`, and `tweakable-design-controls.md`.
- `interface-command-contract.test.mjs` asserts only `/interface:design`, `/interface:motion`, and `/interface:design-reference` as canonical command modes, and includes adversarial negative checks for nested command dispatch and evidence-free verified flags.
- Narrow exact searches found no `commandSubworkflows`, `/interface:audit`, `/interface:foundations`, `design-audit/`, or `design-foundations/` references in current registry, command metadata, and public `/interface:*` command wrappers; the only current `foundations` hit in that set is hub routing vocabulary that maps foundations aliases into `interface`.

## Edge Cases

- Code graph data was unavailable by dispatch; direct reads, exact searches, local checker commands, and test inspection were used as graphless fallback.
- Prior strategy marked some checklist paths blocked even though the final prompt explicitly required `checklist_evidence`; this pass reopened only the cited checklist/security/frontmatter lines and did not repeat broad checklist audits.
- The `foundations` keyword remains valid as interface routing vocabulary. This is clean counterevidence for public routing but does not resolve stale retired owner vocabulary in shared handoff/procedure contracts.
- P1-002 remains local-command write-boundary risk, not P0: the mutation requires a user-provided command/path and the STUDY leak retry path.

## Confirmed-Clean Surfaces

- Public command topology is still valid: three canonical `/interface:*` commands, four registered workflow modes, and no drift from `design-command-surface-check.mjs`.
- `interface-command-contract.test.mjs` has adversarial checks for copied taste tables, nested command dispatch, evidence-free `verified=true`, and silent downstream amendment.
- ADR-002, implementation summary, and checklist body consistently describe audit/foundations command retirement and pending styles/benchmark/strict-validation gates.
- Hub `foundations-aliases` route static-system terms into `interface` instead of exposing a retired public command.

## Ruled Out

- No P0 candidate found.
- No new finding for the public command surface; checker and tests validate the current three-command/four-mode topology.
- No new finding for `foundations` as a router keyword; current hub routing intentionally maps foundations vocabulary to `interface`.
- No downgrade of active P1s: counterevidence did not mark stale handoff/procedure sections historical, did not policy-check `--design-md`, and did not reconcile active `NFR-S01`.

## Next Focus

- dimension: synthesis
- focus area: reducer/final report synthesis with four active P1s and three active P2s
- reason: iteration 5 is the final mandatory stabilization pass; no new findings were added and all active P1/P2 findings are synthesis-ready
- rotation status: all dimensions complete; final synthesis should preserve CONDITIONAL verdict while P1s remain active
- blocked/productive carry-forward: do not retry broad historical searches; use the cited direct evidence and current checker outputs
- required evidence: final reducer registry refresh, review report generation, and remediation plan for P1-001 through P1-004

Review verdict: CONDITIONAL
