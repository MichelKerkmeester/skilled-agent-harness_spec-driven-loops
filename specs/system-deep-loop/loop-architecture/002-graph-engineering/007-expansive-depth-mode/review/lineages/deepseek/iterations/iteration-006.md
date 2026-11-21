# Review Iteration 006

## Dispatcher

- Mode: review (deep-review LEAF, inline executor for this detached lineage)
- Session: `fanout-deepseek-1795201537192-sq1ivw`, generation 1, lineageMode `new`
- Iteration: 6 of 24
- Focus: **Frontier node F-1-006: security**
- Dimension: security
- Frontier node: F-1-006 (depth 1 of 3), scope `.skilled/commands/deep`, `.skilled/skills/system-deep-loop/deep-review/references`, `.skilled/skills/system-deep-loop/deep-research/references`, `.skilled/skills/system-deep-loop/runtime/feature-catalog`
- Convergence before dispatch: `CONTINUE` / `noStopCandidate`, stuck 0, consecutive failures 0.
- Sources read this iteration: `steer.md` (absent), `deep-review-config.json`, `deep-review-findings-registry.json`, `deep-review-strategy.md`, `frontier-nodes.jsonl`, the command docs, both presentations, `loop-protocol.md`, `fanout-run.md`, the prompt-pack template, and the manual-testing playbooks.

## Files Reviewed

- `.skilled/commands/deep/review.md:111`, `.skilled/commands/deep/research.md:118` (opencode sandbox paragraph)
- `.skilled/commands/deep/assets/deep-review-presentation.txt:142,222,226`, `.skilled/commands/deep/assets/deep-research-presentation.txt:131,195,199`
- `.skilled/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md:284-289`
- `.skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-run.md:110,197`
- `.skilled/skills/system-deep-loop/deep-review/assets/prompt-pack-iteration.md.tmpl:102-109`
- `.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/manual-testing-playbook.md:14,47,104`
- `.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/command-flow-stress-tests/resource-map-coverage-gate.md:11-72`

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None. This pass produced no new finding.

## Traceability Checks

| Protocol | Status | Evidence | Summary |
|----------|--------|----------|---------|
| `spec_code` | pass | `.skilled/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md:286-288`, `.skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-run.md:197` | Every confinement claim found names the control it relies on and its limit: the opencode deny is called compensating, never preventive; Bash is named as unconfined; read-only is named as refused for opencode and as a tool allowlist for pi. |
| `checklist_evidence` | notApplicable | - | No spec checklist for a commit-range target. |
| `skill_agent` | notApplicable | - | No agent definition in the range. |
| `agent_cross_runtime` | notApplicable | - | No runtime mirror in the range. |
| `playbook_capability` | pass | `.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/manual-testing-playbook.md:14,47,104` | The playbooks use "sandbox" only for the fixture directory and the SKIP criterion; none claims a confinement property the runtime does not have. |
| `feature_catalog_code` | pass | `.skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-run.md:197` | The fan-out catalog's containment paragraph matches the builder and the preview's `sandboxEnforcement` value. |

## Integration Evidence

- `.skilled/skills/system-deep-loop/deep-review/assets/prompt-pack-iteration.md.tmpl:102-109` states the write contract as a prompt-level rule with an explicit "BANNED OPERATIONS" list and a scope-violation protocol, and `loop-protocol.md:286` names that contract as one of the three real containment layers rather than an OS sandbox. The two statements agree.
- `.skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-run.md:197` describes the opencode default as "`--auto` with an inline `OPENCODE_CONFIG_CONTENT` that denies `external_directory`" and says the preview records `compensating`, never `preventive`, which matches `fanout-run.cjs:3034` and `sandboxEnforcementFor`.
- `.skilled/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md:288` names the dsh narrowing and the pi same-command behavior, so the two kinds whose sandbox mode does not map one-to-one are documented where an operator would look.

## Edge Cases

- **`read-only` is not one behavior across kinds.** It is a pass-through flag on codex and cursor, a permission mode on claude and dsh, a tool allowlist on pi, and a refusal on opencode. The docs state each case in the kind's own bullet, and the general sentence at `loop-protocol.md:288` is qualified by the opencode bullet above it. No contradiction found.
- **The prompt-level write contract is not a sandbox.** It is documented as instruction-following plus post-dispatch validation, and the review's own containment guard is the enforcement layer. Treating the prompt text as a security boundary would be the error; the docs do not make that claim.
- **Playbook "sandbox" means a fixture directory.** The word appears only in that sense and in the SKIP criterion, so it cannot be read as a confinement claim.

## Confirmed-Clean Surfaces

- **Opencode containment description.** Command docs, both presentations, both compiled contracts and the protocol reference all describe the same three layers and the same Bash limitation.
- **`sandboxEnforcement` vocabulary.** The catalog uses `compensating` and `preventive` with the same meaning the code assigns, and never calls a compensating control preventive.
- **Playbooks.** No playbook asserts a confinement property; the SKIP criterion is about unavailable dependencies, not about sandboxing.
- **Prompt pack.** The write contract is stated as a rule with a violation protocol, not as an enforced boundary.

## Ruled Out

- **A doc claiming an OS sandbox where only a permission rule exists.** Ruled out: every opencode and pi statement names the control as a permission rule or tool allowlist and names Bash as unconfined.
- **A doc omitting the opencode read-only refusal.** Ruled out: `review.md`, both presentations, both compiled contracts and `loop-protocol.md:286` all state it.
- **A playbook claiming confinement.** Ruled out: the word is used only for fixture directories and the SKIP criterion.
- **A security finding from the pi help line.** Already recorded as R4-P2-001 in the F-1-002 security pass; re-reporting it here would double-count the same sentence.

## Next Focus

- Dimension: correctness
- Frontier node: F-2-007 (open, zero visits; the admitted child of F-1-002)
- Focus area: the sandbox enforcement label matrix across every executor kind and all three sandbox modes — whether `sandboxEnforcementFor` reports `preventive`, `compensating` or `none` correctly for each kind, including the kinds whose builder emits a different mode than the one requested.
- Reason: F-1-006 security is clean; the frontier's only unvisited node is the admitted child, and its question is the one R1-P2-001 opened.
- Rotation status: F-1-006 correctness and security covered; F-2-007 correctness next.
- Blocked/productive carry-forward: productive (claim-by-claim comparison found no overstatement); no blocked approaches.
- Required evidence: `sandboxEnforcementFor` and every builder's `confines`/`compensatingControl` argument, plus the conformance test's per-surface assertions.
- Recovery note: none.

Review verdict: PASS
