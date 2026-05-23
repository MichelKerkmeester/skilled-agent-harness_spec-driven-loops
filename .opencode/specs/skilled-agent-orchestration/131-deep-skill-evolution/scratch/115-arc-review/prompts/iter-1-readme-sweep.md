# Iter-1 — PUBLIC README + ROOT DOCS sweep

## Role
Senior deep-reviewer. Read-only. Cite EVIDENCE for every finding (file:lines).

## Context
Two rename arcs shipped 2026-05-21:
- 007 (114/007): sk-small-model → sk-ai-small-model
- 115: deep-ai-council → sk-ai-council (skill) + ai-council (agent)

## Scope: PUBLIC ROOT DOCS

### Files to inspect
1. `/README.md` (root, public-facing)
2. `/AGENTS.md` + `/CLAUDE.md` (symlink to AGENTS.md)
3. `.opencode/skills/README.md` (skills index)
4. `.opencode/agents/README.txt` + `.claude/agents/README.txt` + `.codex/agents/README.txt` + `.gemini/agents/README.txt`

### Checks
1. Verify NO live mentions of old names `sk-small-model` or `deep-ai-council` in these files (allow only HISTORICAL narrative with corrective tags).
2. Verify `sk-ai-council` and `sk-ai-small-model` are listed in the skills catalog (root README + skills index README).
3. Verify `@ai-council` agent appears in Agent Definitions / Quick Reference (AGENTS.md).
4. Verify all 4 runtime agent README.txt inventories reflect renamed agent.
5. Verify CLAUDE.md (symlink) reflects AGENTS.md edits correctly.

## Output
JSON `## FINDINGS` block with `findings: [{id, severity, evidence, recommendation}]` + `## NARRATIVE` markdown 150-300 words.

End.
