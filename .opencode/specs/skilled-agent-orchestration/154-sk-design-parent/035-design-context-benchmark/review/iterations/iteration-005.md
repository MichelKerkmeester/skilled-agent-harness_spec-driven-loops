# Iteration 005 - Smart-Router And Anchor Safety

## Dimension

Smart-router and anchor safety: preserve fenced router blocks, frontmatter, and additive-only behavior; then check whether the new behavior is executable.

## Review Actions

- Checked the four edited SKILL files for frontmatter and smart-router sections.
- Compared the human-readable loading rules against the parseable `DEFAULT_RESOURCE` and `RESOURCE_MAP` entries.

## Findings

### F-004 - P1 - Four-miss closure remains advisory in the executable routers

Hypothesis confirmed. The router/frontmatter safety part passes: the four edited SKILL files still have frontmatter, and the interface/foundations/audit packets keep fenced router blocks. The issue is the second half: the new context-loading gates are mostly prose.

Evidence:

- The hub bundle rule is a paragraph at `.opencode/skills/sk-design/SKILL.md:60`, not an executable router rule.
- Interface still sets `DEFAULT_RESOURCE = ["references/design-process/design_principles.md", "../shared/register.md"]` at `.opencode/skills/sk-design/design-interface/SKILL.md:98`; the shared contract and cards are not default-loaded.
- Interface maps `REGISTER_DIALS` only to `brief_to_dials.md` at `.opencode/skills/sk-design/design-interface/SKILL.md:116`, and `MECHANICAL_PREFLIGHT` to preflight-related refs at `.opencode/skills/sk-design/design-interface/SKILL.md:120`; neither map includes `../shared/context_loading_contract.md` or the two proof cards.
- Foundations maps `COLOR` to corpus, OKLCH, and palette refs at `.opencode/skills/sk-design/design-foundations/SKILL.md:121`; it does not include `assets/contrast_pair_inventory.md` or the shared contract.
- Audit maps `AUDIT_CONTRACT` at `.opencode/skills/sk-design/design-audit/SKILL.md:140`; it does not include the shared contract or evidence worksheet in that route.

Fix: add the shared contract/cards/worksheet to executable router maps or add a deterministic pre-dispatch proof-field check.

Review verdict: CONDITIONAL
