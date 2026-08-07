# Deep-Review iter-7 — 007 rename packet — DEEPER ADVERSARIAL ROUND 2

## Role
Senior deep-reviewer. Read-only. Adversarial. Cite EVIDENCE.

## Context
Iters 1-5 covered correctness, traceability, security, maintainability, adversarial-R1. Findings: 0 P0/P1, 3 P2 (M-001 + H5-001 + H5-002). Iter-6 re-verifies H5 fixes. This iter probes deeper.

## Scope: ADVERSARIAL ROUND 2 — second-order hypothesis hunt

### Pre-planning

1. **Hypothesis A1: sk-prompt-small-model SKILL.md body internal references**. Read `.opencode/skills/sk-prompt-small-model/SKILL.md` end-to-end. Look for:
   - Any link/path/wikilink that still resolves to a `deep-ai-council` analog or other broken reference
   - Any inconsistency between frontmatter `name` and H1
   - Any orphaned section due to the rename
   - Acceptance: per-finding verdict.

2. **Hypothesis A2: changelog v0.3.0.0 vs v0.1+v0.2 consistency**. Read all three changelog files. Verify v0.3.0.0 is consistent with v0.2.0.0's format. Verify v0.1+v0.2 weren't accidentally altered.
   - Acceptance: per-changelog content cite + diff verdict (vs git history if possible).

3. **Hypothesis A3: agent surface impact**. The 007 packet was a skill rename, not an agent rename. But: do any agent files (`.opencode/agents/**.md`) load `.opencode/skills/sk-small-model/...`? If so, that's a missed reference.
   - Acceptance: per-agent grep verdict.

4. **Hypothesis A4: pattern-index.md table internal links**. Read `.opencode/skills/sk-prompt-small-model/references/pattern-index.md`. Verify every internal link `[...](path)` resolves to an existing file post-rename.
   - Acceptance: per-link verdict.

5. **Hypothesis A5: incidental fixes are reversible**. The 007 incidental fixes to `system-rerank-sidecar` (category) and `mcp-coco-index` (reverse-sibling) introduced edges that didn't exist before. Verify they're consistent with sibling skill metadata in those skills' READMEs/SKILL.md/references.
   - Acceptance: per-skill consistency verdict.

### Action + Output
JSON `## FINDINGS` + `## NARRATIVE`. Same schema.

End of prompt.
