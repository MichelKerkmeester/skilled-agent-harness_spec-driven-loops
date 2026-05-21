# Deep-Review iter-5 — 007 rename packet — dimension: ADVERSARIAL CROSS-CUTTING

## Role
Senior deep-reviewer. Read-only. Cite EVIDENCE. **Adversarial mode**: try to FIND issues prior dimensions missed.

## Context
Target: 007 rename packet. Iters 1-4 done across 4 dimensions (correctness, traceability, security, maintainability).

## Scope: ADVERSARIAL — cross-cutting hypothesis-driven hunt (iter 5)

### Pre-planning

1. **Hypothesis H1: missed runtime mirrors**. Check `.gemini/`, `.codex/`, `.claude/` runtime dirs for any sk-small-model reference NOT already covered by the 007 rename. Note: 007 did NOT rename any agent files (this was a pure skill rename), but runtime mirrors of root behavioral docs (AGENTS.md etc.) may reference the skill.
   - Acceptance: per-runtime grep output + missed-or-not verdict.

2. **Hypothesis H2: TypeScript or other code references**. The 007 packet's spec.md §3 lists no code surfaces. Run `rg "sk-small-model" .opencode/skills/system-skill-advisor/mcp_server/lib/ .opencode/skills/system-spec-kit/mcp_server/tests/` — if any TS/JS code/tests reference the OLD name, that's a missed live surface.
   - Acceptance: rg output + verdict.

3. **Hypothesis H3: bench fixtures**. The `mcp-coco-index/mcp_server/benchmarks/` dirs have per-probe.jsonl files. After 007's rename, do any benchmark fixture lines still reference `sk-small-model`? Were these intentionally preserved as historical fixtures, or missed?
   - Acceptance: fixture-line cite + classification verdict.

4. **Hypothesis H4: git hook + CI**. Check `.github/hooks/`, `.github/workflows/`, `Makefile`, `package.json` scripts — does any automation reference the OLD sk-small-model path?
   - Acceptance: file:lines + verdict.

5. **Hypothesis H5: parent metadata drift**. After Step 13 canonical save ran generate-context.js, did the parent 114/spec.md frontmatter `_memory.continuity` get corrupted/wiped per [[feedback_generate_context_regenerates_parent_metadata]]? If so, is the loss recoverable or does it block resume?
   - Acceptance: frontmatter inspect + verdict.

6. **Convergence assessment**: If iters 1-4 returned 0 findings AND this adversarial iter returns 0 NEW findings, recommend `stop_recommendation: converged`. If new findings emerge, recommend `continue` with next adversarial round.

### Action
Run 1-6 in order, emit findings.

### Output
JSON `## FINDINGS` + `## NARRATIVE`. Include `convergence_assessment` summary at the end of NARRATIVE.

End of prompt.
