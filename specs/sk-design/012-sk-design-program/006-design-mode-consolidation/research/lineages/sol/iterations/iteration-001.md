# Iteration 1: Live Hub and Parent-Doctrine Drift

## Focus

Compare the live hub, registry, router, and command surface against sk-doc parent-hub doctrine. The narrow question was whether any current—not historical—artifact still carries retired-mode ceremony or creates a concrete maintenance/routing contradiction.

## Actions Taken

1. Read the lineage config, state log, and strategy before selecting the focus.
2. Inspected `mode-registry.json`, `hub-router.json`, and all three live `/interface:*` command routers.
3. Searched active sk-design sources for retired command, `auditFrame`, `commandSubworkflows`, procedure, and extension references while separating historical benchmark/changelog evidence.
4. Ran the sk-doc skill-package validator and four compiled-route probes.
5. Compared live hub structures with the sk-doc parent-hub doctrine.

## Findings

1. **The shared creation contract is the highest-value live cleanup target.** Its opening correctly says it serves three commands, but later text still treats `foundations` and `audit` as live proof rows, says `no-fit` is valid for them, describes “four advisory modes,” and says audit routes findings. Because each live command includes this shared contract, the stale model is on the active command path rather than confined to history. The smallest fix is to delete the retired rows and rewrite the remaining sentences around `interface`, `motion`, and `md-generator`; no replacement construct is needed. Cost: a small documentation edit plus the existing command-contract test. [SOURCE: .opencode/skills/sk-design/shared/creation-contract.md:16] [SOURCE: .opencode/skills/sk-design/shared/creation-contract.md:126] [SOURCE: .opencode/skills/sk-design/shared/creation-contract.md:164] [SOURCE: .opencode/skills/sk-design/shared/creation-contract.md:176] [SOURCE: .opencode/skills/sk-design/shared/creation-contract.md:194] [SOURCE: .opencode/commands/interface/design.md:9] [SOURCE: .opencode/commands/interface/motion.md:9] [SOURCE: .opencode/commands/interface/design-reference.md:9]

2. **`mode-registry.json` retains an audit-era semantic inside a live extension.** The four-mode registry has no `audit` mode, yet the transform-verb extension still defines an `auditFrame` and explains an audit/interface split. Direct compiled-route probes for “Should it be bolder?”, “Make it bolder,” and an explicit audit request all currently resolve to `interface`, so this is not a routing outage. It is current maintenance drift: the live registry describes an impossible target and keeps audit-specific test/docs alive. The smallest fix is to delete only the audit-frame field and audit wording while preserving the interface aliases if they still serve routing. Cost: small registry/doc/test edits and manifest refresh. [SOURCE: .opencode/skills/sk-design/mode-registry.json:17] [SOURCE: .opencode/skills/sk-design/mode-registry.json:27] [SOURCE: .opencode/skills/sk-design/mode-registry.json:35] [SOURCE: command: node .opencode/bin/compiled-route.cjs --hub sk-design --prompt "Should it be bolder?"]

3. **The consolidated hub otherwise matches the core parent-hub doctrine.** It has one advisor identity, one `modes[]` registry, matching router-signal keys/tie-break order, matching folder and packet skill names, exactly one root `graph-metadata.json`, and real per-packet procedure sets. The official validator passes the package, compiled-routing readiness, and parent-skill check. A hub rebuild, registry redesign, or procedure removal is therefore not justified. [SOURCE: .opencode/skills/sk-doc/create-skill/SKILL.md:227] [SOURCE: .opencode/skills/sk-doc/create-skill/SKILL.md:231] [SOURCE: .opencode/skills/sk-doc/create-skill/SKILL.md:234] [SOURCE: .opencode/skills/sk-doc/create-skill/SKILL.md:236] [SOURCE: .opencode/skills/sk-doc/create-skill/SKILL.md:244] [SOURCE: .opencode/skills/sk-design/mode-registry.json:35] [SOURCE: .opencode/skills/sk-design/hub-router.json:4] [SOURCE: command: python3 .opencode/skills/sk-doc/create-skill/scripts/validate_skill_package.py .opencode/skills/sk-design]

4. **The transport extension is warranted, unlike the stale audit subfield.** Sk-doc allows named extensions when real routing semantics require them. Open Design is a real fourth packet with a different `packetKind`, backend, tool surface, and mandatory taste-authority boundary. Deleting the transport axis or coercing it into `surface` would create a larger schema/behavior change without solving a present failure. [SOURCE: .opencode/skills/sk-doc/create-skill/SKILL.md:249] [SOURCE: .opencode/skills/sk-design/mode-registry.json:22] [SOURCE: .opencode/skills/sk-design/mode-registry.json:99]

## Questions Answered

- Which current hub artifacts still carry duplicated or retired-surface ceremony? The live shared creation contract and the audit half of transform-verb metadata.
- Where does the current hub drift from sk-doc parent-hub doctrine? Only narrowly: live runtime documentation still models retired modes; the core hub topology validates.

## Questions Remaining

- Whether the folded interface preflight retains audit/foundations capability at adequate depth.
- Whether the styles facade creates a current operational burden.
- Final value-to-cost ranking across all evidence.

## Ruled Out

- **Rebuild the hub or redesign the registry schema:** validation passes and the core one-hub/one-registry topology conforms.
- **Remove procedure folders:** each workflow packet has concrete, separately triggered procedures, which sk-doc explicitly permits.
- **Remove or reclassify the Open Design transport axis:** it represents current distinct routing semantics and would require more change than it saves.

## Dead Ends

- Historical changelog and benchmark hits for retired modes were not treated as live drift; they are provenance, not runtime authority.
- `commandSubworkflows` produced no active-source hit and should not be reintroduced as a cleanup target.

## Edge Cases

- Ambiguous input: “structural drift” could mean any difference from the template; this pass limited it to active contradictions or measurable maintenance burden.
- Contradictory evidence: the validator passes even though active shared documentation is stale. Structural validation and semantic currency are different checks.
- Missing dependencies: code graph unavailable; exact file reads and compiled-route probes were used.
- Partial success: none.

## Sources Consulted

- `.opencode/skills/sk-design/SKILL.md`
- `.opencode/skills/sk-design/mode-registry.json`
- `.opencode/skills/sk-design/hub-router.json`
- `.opencode/skills/sk-design/shared/creation-contract.md`
- `.opencode/commands/interface/design.md`
- `.opencode/commands/interface/motion.md`
- `.opencode/commands/interface/design-reference.md`
- `.opencode/skills/sk-doc/create-skill/SKILL.md`
- `python3 .opencode/skills/sk-doc/create-skill/scripts/validate_skill_package.py .opencode/skills/sk-design`
- `node .opencode/bin/compiled-route.cjs --hub sk-design --prompt ...`

## Assessment

- New information ratio: 0.88
- Novelty justification: three findings were fully new to this lineage and one narrowed a suspected doctrine violation into a justified exception.
- Confidence: high for file-state claims; medium-high for maintenance-cost ranking until later iterations compare other candidates.

## Reflection

- What worked and why: separating active files from history prevented obsolete benchmark/changelog evidence from inflating the cleanup list.
- What did not work and why: an unrestricted retired-term search crossed the 7,812-file styles corpus and historical benchmark payloads, producing noise.
- What I would do differently: apply narrow glob exclusions before every cross-package text search.

## Recommended Next Focus

Test the folded interface mode and seven binary mechanical preflight checks against the former audit/foundations responsibilities. Identify only present coverage or proof gaps, not missing old structure.
