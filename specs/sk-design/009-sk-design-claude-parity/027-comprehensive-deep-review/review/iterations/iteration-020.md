# Iteration 020 - Final Structural Re-check and Synthesis

## Dimension

- Final cross-cutting synthesis across correctness, security, traceability, and maintainability.
- Fresh structural conformance checks only; no new content review outside checker evidence.

## Files Reviewed

- `.opencode/skills/sk-code/code-review/references/review_core.md:28`
- `.opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/deep-review-findings-registry.json:9`
- `.opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/deep-review-findings-registry.json:911`
- `.opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/deep-review-strategy.md:73`
- `.opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/deep-review-state.jsonl:17`
- `.opencode/skills/sk-design/design-mcp-open-design/SKILL.md:1`
- `.opencode/skills/sk-design/design-mcp-open-design/changelog/v1.0.0.0.md:1`
- `.opencode/skills/sk-design/design-mcp-open-design/changelog/v1.1.0.0.md:1`
- `.opencode/skills/sk-design/design-mcp-open-design/changelog/v1.2.0.0.md:1`
- `.opencode/skills/sk-design/design-mcp-open-design/changelog/v1.3.0.0.md:1`
- `.opencode/skills/sk-design/design-mcp-open-design/changelog/v1.4.0.0.md:1`
- `.opencode/skills/sk-design/design-mcp-open-design/changelog/v1.4.0.1.md:1`

## Fresh Structural Checks

- Hub check: `node .opencode/commands/doctor/scripts/parent-skill-check.cjs .opencode/skills/sk-design` returned `OK: parent-skill-check - all hard invariants passed, 0 warnings`, exit `0`.
- `design-interface`: `Result: PASS`, exit `0`, with 2 warnings: `SKILL.md has 4173 words (recommended max: 3000)` and missing smart-router markers `discover_markdown_resources`, `_guard_in_skill`, `UNKNOWN_FALLBACK`. Both are already represented by active P2 registry findings from iteration 7 and are not re-counted here.
- `design-foundations`: `Result: PASS`, exit `0`, with 1 warning: `SKILL.md has 3163 words (recommended max: 3000)`. This is already represented by active package-size warning coverage and is not re-counted here.
- `design-motion`: `Result: PASS`, exit `0`, no warnings.
- `design-audit`: `Result: PASS`, exit `0`, with 1 warning: `SKILL.md has 3281 words (recommended max: 3000)`. This is already represented by active iteration 11 package-size warning coverage and is not re-counted here.
- `design-md-generator`: `Result: FAIL`, exit `1`, because `SKILL.md exceeds word limit (5759 words, max: 5000)`. This re-confirms active `P1-016-001` and is not re-counted here.
- `design-mcp-open-design`: `Result: PASS`, exit `0`, with 7 warnings. Two warning classes appear new in the current registry and are recorded below as P2 findings.

## Findings by Severity

### P0

- None.

### P1

- No new P1 findings in this iteration.
- The registry remains `P0=0`, `P1=13`, `P2=13` before this iteration's delta, with 26 active findings and no resolved findings. Because iterations 18 and 19 were running in parallel and are not present in the read state/registry, this synthesis is based on the last available reduced registry rather than a fully wave-merged registry.
- Dominant active risk theme: `design-md-generator/backend/` output-boundary bypass and checker conformance debt. The most material active finding remains `P1-001`, where standalone artifact writers bypass the central output-boundary policy, with `P1-016-001` adding a hard sk-doc package failure for the same mode packet.

### P2

#### P2-020-001 [P2] Open Design transport packet exceeds the recommended SKILL.md size budget

- Claim: `package_skill.py --check` warns that `design-mcp-open-design/SKILL.md` is 3935 words against the recommended 3000-word budget.
- Evidence refs: `.opencode/skills/sk-design/design-mcp-open-design/SKILL.md:1`; fresh checker output: `SKILL.md has 3935 words (recommended max: 3000)`.
- Finding class: matrix/evidence.
- Scope proof: the warning is isolated to the `design-mcp-open-design` mode packet check; the checker still returned `Result: PASS`.
- Recommendation: move non-routing operational detail into references while preserving runtime-critical pairing, tool-surface, and transport warnings in `SKILL.md`.
- Final severity: P2.
- Confidence: 0.89.

#### P2-020-002 [P2] Open Design transport changelog entries omit required version frontmatter

- Claim: `package_skill.py --check` warns that six `design-mcp-open-design/changelog/` files are missing a `version` frontmatter field.
- Evidence refs: `.opencode/skills/sk-design/design-mcp-open-design/changelog/v1.0.0.0.md:1`, `.opencode/skills/sk-design/design-mcp-open-design/changelog/v1.1.0.0.md:1`, `.opencode/skills/sk-design/design-mcp-open-design/changelog/v1.2.0.0.md:1`, `.opencode/skills/sk-design/design-mcp-open-design/changelog/v1.3.0.0.md:1`, `.opencode/skills/sk-design/design-mcp-open-design/changelog/v1.4.0.0.md:1`, `.opencode/skills/sk-design/design-mcp-open-design/changelog/v1.4.0.1.md:1`.
- Finding class: matrix/evidence.
- Scope proof: fresh checker output names exactly these six docs and still returns `Result: PASS`, making this advisory structural debt rather than a hard package failure.
- Recommendation: add 4-part `version: X.Y.Z.W` frontmatter to the six transport changelog entries.
- Final severity: P2.
- Confidence: 0.92.

## Traceability Checks

- `spec_code`: PASS for this iteration's scope; structural checker output was tied back to mode packet files and registry state.
- `checklist_evidence`: N/A; this read-only review iteration produced review evidence artifacts only and did not update checklist completion.
- `skill_agent`: PASS; no sub-agents were dispatched, and the required `deep-review` skill and shared review doctrine were loaded.
- `agent_cross_runtime`: N/A; no runtime agent definitions were reviewed or invoked in this iteration.
- `feature_catalog_code`: N/A for final structural checker synthesis; content coverage belongs to prior iterations.
- `playbook_capability`: N/A for final structural checker synthesis; playbook capability coverage belongs to prior iterations.

## Verdict

- Overall verdict: CONDITIONAL.
- Reason: the accumulated registry still contains active P1 findings (`P1=13`) and this iteration added two P2 structural advisories. There are no active P0 findings in the registry read for this pass.
- Registry completeness caveat: iterations 18 and 19 were parallel wave siblings and were not present in `deep-review-state.jsonl` or `deep-review-findings-registry.json` at read time, so the final signal should be re-reduced after the wave merge if their deltas add or resolve findings.

## Next Dimension

None — review complete

Review verdict: CONDITIONAL
