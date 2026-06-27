# Iteration 2: Routing And Benchmark Implications

## Focus

Identify routing changes most likely to raise the operator-provided foundations Mode A score of 83/100.

## Findings

1. The parent hub is intentionally registry-driven and keeps no per-mode design logic. It resolves `workflowMode` through `mode-registry.json` and says generic design prompts default to `interface` unless a static axis dominates. [SOURCE: file:.opencode/skills/sk-design/SKILL.md:39-58]
2. The parent registry foundations aliases are narrower than the child foundations trigger vocabulary. Parent aliases include color system, OKLCH palette, dark-mode palette, typography scale, font pairing, spacing system, responsive layout, and design tokens. They omit child-level terms such as `layout rhythm`, `grid`, `container queries`, `adaptation matrix`, `data visualization`, `chart type`, `data tables`, and `token starter`. [SOURCE: file:.opencode/skills/sk-design/mode-registry.json:27-37], [SOURCE: file:.opencode/skills/sk-design/design-foundations/SKILL.md:31-32]
3. The likely highest-ROI routing improvement is to add those omitted foundations terms to the parent registry alias list. This is low-blast because the child already owns those domains, and the parent registry is the declared routing source of truth. [SOURCE: file:.opencode/skills/sk-design/SKILL.md:41-56], [SOURCE: file:.opencode/skills/sk-design/design-foundations/SKILL.md:70-79]
4. Token routing has a cross-axis underload risk. The resource loading table says cross-axis token-system work should load all three axis folders plus the parent token vocabulary, but the pseudocode `RESOURCE_MAP["TOKENS"]` only loads `references/corpus_map.md` and `assets/token_starter.md`. [SOURCE: file:.opencode/skills/sk-design/design-foundations/SKILL.md:92-93], [SOURCE: file:.opencode/skills/sk-design/design-foundations/SKILL.md:115-122]
5. The requested `154-sk-design-parent/014-routing-benchmark` artifact was not present locally under the parent path. The `83/100` score should be treated as operator-provided context unless another artifact path is supplied. [SOURCE: file:.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/015-per-skill-improvement-research/002-foundations/research/lineages/gpt55fast/deep-research-strategy.md:73-77]

## Sources Consulted

- `.opencode/skills/sk-design/SKILL.md`
- `.opencode/skills/sk-design/mode-registry.json`
- `.opencode/skills/sk-design/design-foundations/SKILL.md`
- Local path searches for `014-routing-benchmark`, `Mode A`, and `83` under the sk-design parent

## Assessment

- newInfoRatio: 0.78
- Novelty: Added routing-specific findings and confirmed a benchmark evidence gap.
- Confidence: High for alias mismatch; medium for score interpretation because the score artifact is absent.

## Reflection

- What worked: Comparing parent aliases against child trigger phrases exposed a concrete improvement.
- What failed: The benchmark path could not be verified locally.
- Ruled out: Using the unverified `83/100` score as a file-cited fact.

## Recommended Next Focus

Research reference and asset UX: what should be added now that coverage holes have already landed?
