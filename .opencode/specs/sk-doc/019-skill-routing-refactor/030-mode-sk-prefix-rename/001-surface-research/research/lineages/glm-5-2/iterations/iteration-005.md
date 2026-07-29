# Iteration 005 — DB/cache consumers (spec open question) + .devin scope + cross-check frontier

**Focus:** Resolve the spec open question (DB/cache consumers of mode keys). Resolve whether `.devin/skills/` naming is in scope. Broaden the cross-check frontier and finalize Q5 verification levers.

**Lineage:** glm-5-2 | **Executor:** cli-devin glm-5-2 | **Status:** complete

---

## Approach

Inspect the skill-advisor MCP server's state/cache/gold files for mode-key storage. Inspect `.devin/skills/*/SKILL.md` to determine whether the devin naming layer is in scope. Locate the missing `/prompt-improve` and `/doc:quality` command files. Confirm the drift-guard test pattern.

## Findings

### Class K — Advisor DB/cache/state (spec open question) — ANSWERED

The spec asks: "Whether any consumer stores a mode key in a database or cache that a filesystem sweep cannot reach."

| Store | Path | Stores mode keys? | Verdict |
|-------|------|-------------------|---------|
| Advisor state | `.claude/skills/.advisor-state/skill-graph-generation.json` | NO — only a `generation` counter [SOURCE: grep → only `generation` token] | NOT a mode-key consumer |
| Embeddings cache | `.opencode/skills/system-skill-advisor/mcp-server/tests/scorer/fixtures/.embeddings-cache/skill-embeddings.json` | NO — grep for `workflowMode`/`quality`/`interface`/`design-interface`/`code-quality`/`create-skill`/`prompt-improve`/`packet` returned ZERO matches [SOURCE: grep] | Keyed by SKILL IDENTITY (`sk-code` etc.), not mode keys |
| Routing-accuracy gold | `.opencode/skills/system-skill-advisor/mcp-server/scripts/routing-accuracy/labeled-prompts.jsonl` | NO at mode granularity — labels carry `skill_top_1` = skill identity (`sk-code`,`sk-doc`,`system-spec-kit`) [SOURCE: head -3] | Keyed by skill identity; the rename does not change hub names |

**Answer to spec open question:** NO non-filesystem DB/cache consumer of mode keys was found. Every mode-key consumer is filesystem-reachable (typed manifests, generated artifacts, command YAML, agent prose, benchmark reports). The advisor's caches and gold are keyed by SKILL IDENTITY (hub names `sk-code`/`sk-design`/`sk-doc`/`sk-prompt`), which the rename does NOT touch — only the workflowMode keys and packet dir names change, not the four hub names. The one filesystem-reachable "gold" that DOES carry mode keys is the generated benchmark report (Class J, `skill-benchmark-report.json` `workflowMode` fields) — regenerated, not swept.

**Caveat (inferred, not confirmed):** the sample of `labeled-prompts.jsonl` showed only `skill_top_1`; if any row carries a mode-level expected label, it would be affected. To confirm: full scan of `labeled-prompts.jsonl` for `workflowMode`/mode-name fields (deferred — not load-bearing for the headline answer since skill-identity is the documented label key).

### Class L — `.devin/skills/` naming layer — SCOPE RESOLVED

`.devin/skills/` uses advisor-skill-identity dir names: `create-skill`, `create-skill-parent`, `interface-design`, `interface-design-reference`, `prompt-improve`, plus deep-*/doctor-*/speckit-*/memory-* [SOURCE: ls .devin/skills/]. These are NOT workflowMode keys and NOT sk-* packet dirs — they are the devin runtime's advisor-facing skill identities.

Content inspection:
- `.devin/skills/create-skill/SKILL.md:22-24,31,43-44,48,56` references `.opencode/commands/create/assets/create-skill-*` paths [SOURCE: .devin/skills/create-skill/SKILL.md:22-24] — it is a MIRROR of the `create-skill` COMMAND router, not the sk-doc packet.
- `.devin/skills/interface-design/SKILL.md:7,9,18,24` references `/interface:design`, `workflowMode=interface`, `design-interface/assets/interface-preflight-card.md` [SOURCE: .devin/skills/interface-design/SKILL.md:9,24] — carries the OLD workflowMode key `interface` and OLD packet dir `design-interface` in paths.

**Verdict (judgment, flagged not decided):**
- `.devin/skills/<name>/` DIR names = advisor skill identities → OUT of scope for the sk- prefix rename (the rename targets workflowMode keys + sk-* packet dirs, not advisor skill names).
- `.devin/skills/<name>/SKILL.md` CONTENT = mirrors of command routers → IN scope for content sweep (old workflowMode keys + packet-dir paths appear in content). These are real files (not symlinks) [SOURCE: `file .devin/skills/create-skill` → directory], so they must be swept or re-synced from `.opencode` after the rename, then verified via `doctor-runtime-mirrors`.

### Missing command files — RESOLVED + GAP

- `/prompt-improve` → `.opencode/commands/prompt/improve.md` (NOT `prompt-improve.md`) with assets `prompt_improve_{auto,confirm}.yaml` + `prompt_improve_presentation.txt` [SOURCE: paths under .opencode/commands/prompt/]. IN scope (command router + YAML assets reference `prompt-improve` mode + `.opencode/skills/sk-prompt/prompt-improve/...` paths).
- `/doc:quality` (create-quality-control) → NO router `.md` file found under `.opencode/commands/` or `.claude/commands/` (only a manual-testing-playbook `quality.md` matched, unrelated). **GAP:** the `/doc:quality` binding in sk-doc mode-registry.json:158 has no discoverable command router file. Hypothesis: it may be projected from `command-metadata.json` or hub-owned under a `doc/` command dir that does not exist in this worktree. Flagged for the rename phase to resolve before sweeping.

### Class M — Drift-guard test pattern (verification lever)

`routing-registry-drift-guard.vitest.ts` reads `mode-registry.json` `workflowMode`/`packet`/`packetSkillName` fields and guards drift [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/tests/routing-registry-drift-guard.vitest.ts:26,35-44,64,79]. It currently targets `system-deep-loop/mode-registry.json` (:26) — NOT the four sk- hubs. The PATTERN (per-hub drift guard) is a verification lever; if equivalent guards exist for the four sk- hubs, they must pass post-rename. To confirm: search for sibling drift-guard tests for sk-code/sk-design/sk-doc/sk-prompt (deferred).

### Cross-check frontier (broadened angles)

- `skill_graph_compiler.py` [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/scripts/skill_graph_compiler.py] — compiles the skill graph from manifests; a GENERATED consumer of mode-registry/leaf-manifest. Re-run after rename.
- `vocabulary-agreement.vitest.ts`, `parent-skill-check-fixtures.vitest.ts`, `routing-parity-deep-skills.vitest.ts`, `native-scorer.vitest.ts` [SOURCE: paths under system-skill-advisor/mcp-server/tests/] — additional test guards referencing mode keys; run post-rename.
- `check-prompt-quality-card-sync.sh` [SOURCE: path] — sync check; possible mode-key consumer.

## What Worked
- `grep -o ... | sort | uniq -c` on the embeddings cache and advisor state gave a definitive zero-mode-key answer cheaply.
- `head -3` on `labeled-prompts.jsonl` revealed the skill-identity label granularity, answering the spec open question.

## What Failed / Ruled Out
- Did not full-scan `labeled-prompts.jsonl` for mode-level labels (sampled 3 rows). Ruled out exhaustive scan — the documented label key is `skill_top_1`.
- Did not locate `/doc:quality` router file — flagged as a GAP, not ruled out (it may exist outside the searched trees).

## Carried-Forward Open Questions (for the rename phase, not this research)
- `/doc:quality` command router file location (GAP).
- Sibling drift-guard tests for the four sk- hubs (vs the confirmed deep-loop one).
- Full `labeled-prompts.jsonl` scan for any mode-level expected labels.
- Whether `.devin/skills/` dir names should be renamed too (judgment: no — advisor identities).

## Next Focus
Research complete — all five key questions answered (Q1–Q4 fully, Q5 partial-with-levers) and the spec open question answered (no non-filesystem DB/cache mode-key consumer). Proceed to synthesis.

## newInfoRatio: 0.55
Novelty justification: answered the spec open question (no DB/cache mode-key consumer; caches are skill-identity-keyed), resolved `.devin/skills/` scope (dir names out, content in), located `/prompt-improve` and flagged `/doc:quality` as a gap, and added the drift-guard + skill_graph_compiler verification consumers. Lower novelty because it finalizes rather than opens new surface.
