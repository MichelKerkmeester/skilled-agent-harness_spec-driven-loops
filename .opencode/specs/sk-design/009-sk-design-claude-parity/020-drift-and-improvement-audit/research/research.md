# Deep Research Synthesis: sk-design Drift and Improvement Audit

## Scope
Audited `.opencode/skills/sk-design/SKILL.md`, `mode-registry.json`, `hub-router.json`, nested mode packets, `.opencode/agents/design.md`, and `.opencode/commands/design/**` for drift, bugs, misalignment, and improvement opportunities. No fixes were implemented.

## Top Findings
1. **P1 bug: `/design:*` command surface validation is failing.** The checked-in validator reports `STATUS=INVALID STAGE=metadata` with ten invalid metadata errors. The dominant causes are `:auto|:confirm` modeled as a flag and missing `design-mcp-open-design` sibling coverage. [SOURCE: command:node .opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs] [SOURCE: .opencode/skills/sk-design/command-metadata.json:32] [SOURCE: .opencode/skills/sk-design/mode-registry.json:145]
2. **P1 drift: `design-md-generator` still references obsolete `mcp-open-design` naming.** Current registry/hub naming is `design-mcp-open-design`, but md-generator says Open Design projects use `mcp-open-design`. [SOURCE: .opencode/skills/sk-design/mode-registry.json:145] [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:48]
3. **P2 misalignment: `.opencode/agents/design.md` grants broad Write/Edit/Bash without explicit per-mode downshift.** Registry forbids Write/Edit/Bash for the four advisory modes, while the agent allows them globally and lists only the five workflow modes. [SOURCE: .opencode/agents/design.md:6] [SOURCE: .opencode/agents/design.md:8] [SOURCE: .opencode/skills/sk-design/mode-registry.json:43]
4. **P2 metadata drift: graph/version surfaces lag current hub shape.** Graph metadata mentions Open Design triggers and all-six causal summary but edges/manual relations only list `sk-code`/`mcp-figma`; versions differ across `SKILL.md`, `mode-registry.json`, and `hub-router.json`. [SOURCE: .opencode/skills/sk-design/graph-metadata.json:37] [SOURCE: .opencode/skills/sk-design/graph-metadata.json:157] [SOURCE: .opencode/skills/sk-design/SKILL.md:5] [SOURCE: .opencode/skills/sk-design/mode-registry.json:3]
5. **Positive control: single-advisor-identity invariant appears preserved.** No per-mode `graph-metadata.json` files were discovered under mode packets, matching the hub rule. [SOURCE: .opencode/skills/sk-design/SKILL.md:209] [SOURCE: glob:.opencode/skills/sk-design/**/graph-metadata.json]

## Severity / Category Counts
- P1 bug/drift: 3 findings
- P2 misalignment/improvement: 4 findings
- P3 improvement/positive control: 2 findings
- Categories: commands/metadata validation (4), transport naming (3), agent/tool-surface parity (3), graph/version hygiene (2), positive controls (1)

## Convergence
The loop converged after 3 iterations. Iteration 3 produced lower novelty (0.42) and mostly contract synthesis/positive-control confirmation after command, transport, packet, graph, and agent surfaces were covered. Further research before fixes would likely repeat the same evidence.

## Recommended Follow-up Order
1. Fix `command-metadata.json` so execution-mode suffixes are modeled outside long-flag validation or update the validator contract intentionally.
2. Decide whether `design-mcp-open-design` should remain command-null but discriminator-visible, then align command metadata and validator expectations.
3. Replace stale `mcp-open-design` mentions in scoped sk-design packet docs with current `design-mcp-open-design` where the nested transport is meant.
4. Clarify `.opencode/agents/design.md` so global agent permissions do not override registry tool-surface restrictions for read-only modes.
5. Regenerate/synchronize graph metadata and version fields after the above changes.

## Blockers and Unknowns
- Code graph was stale at session start, so structural graph evidence was not used.
- Runtime agent dispatch behavior was not tested because this was research-only and leaf-only.
- The desired public command status of `design-mcp-open-design` remains a product decision: registry says `command: null`, validator output expects sibling coverage as `/design:design-mcp-open-design`.
