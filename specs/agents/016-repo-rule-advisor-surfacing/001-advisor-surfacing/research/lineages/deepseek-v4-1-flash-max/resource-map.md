# Resource Map — repo rule surfacing research (lineage deepseek-v4-1-flash-max)

Emitted from this lineage's deltas (`deltas/iter-001.jsonl` … `iter-004.jsonl`). Lists the sources consulted and the themes each contributed; it is inventory, not net-new findings.

## Consulted sources by theme

### Current load path and corpus
- `AGENTS.md` (root) — Gate 5 firing contract, §8 reply-rule load line, verification standards
- `REPO RULES.md` (root) — trigger table, action-matching rule, §4 scope
- `.skilled/repo-rules/*.md` — 13 rule files; 255 trigger phrases (measured)

### Advisor surface (candidate a)
- `.skilled/skills/system-skill-advisor/runtime/lib/render.ts`
- `.skilled/skills/system-skill-advisor/hooks/lib/directive-lifecycle.ts` (+ contract, file store)
- `.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts`
- `.skilled/plugins/system-skill-advisor.js` (OpenCode mirror)
- `.skilled/skills/system-skill-advisor/runtime/tests/legacy/advisor-renderer.vitest.ts`

### Trigger index (candidate b)
- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/corpus.mjs`
- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs`
- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs`
- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/freshness.mjs`
- `.skilled/skills/system-spec-kit/runtime/data/trigger-index.json` (committed artifact)
- `.skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md`
- `.skilled/skills/sk-doc/sk-create-repo-rule/scripts/check-repo-rules.cjs`

### Hooks and tool-time precedent (candidate c)
- `.skilled/hooks/injection-contract.md`
- `.claude/settings.json`
- `.skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs`
- `.skilled/hooks/` inventory (dispatch, mcp-route-guard, post-edit-quality, task-dispatch, spec-gate, …)

### Prior work and federation
- `specs/hooks/022-smart-rule-injection/decisions.md`, `001-deep-research/implementation-summary.md`
- `specs/agents/010-repo-rule-system-integration/research/synthesis.md`
- Federation listings: `Public/.skilled/repo-rules/`, `Public/repo-rules/`, `Obsidian Plugin/repo-rules/`, sibling root symlinks

### Packet
- `specs/agents/016-repo-rule-advisor-surfacing/spec.md` (problem statement, requirements REQ-001…REQ-004, SC-001…SC-002)

## Themes by iteration
- Iteration 1: Gate 5 contract; corpus shape; prior decisions (022 bar, 010 constraint); federation structure.
- Iteration 2: brief emission mechanics; dedup lifecycle; byte measurements; 022 bar application to candidate (a).
- Iteration 3: corpus walker; lookup semantics; committed index measurements; empirical silence and simulated hits; portability trade-offs.
- Iteration 4: spec-gate delivery machinery; candidate (c) design; candidate (d) flip test; cross-candidate comparison.

## Coverage note
All four candidates were analyzed with at least one measured or read source per claim; the only derived (unmeasured) quantities are the index-growth estimate and the (c) classifier precision, both labeled in `research.md` §13.
