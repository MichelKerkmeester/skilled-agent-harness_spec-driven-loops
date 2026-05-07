# Deep Review Strategy — Packet 070 (sk-deep-* → deep-* Rename)

## TARGET

`specs/skilled-agent-orchestration/070-sk-deep-rename/` — 6-phase skill rename audit.

## CHARTER

Final pre-commit audit. Verify the sk-deep-* → deep-* rename is complete and correct across ALL phases. Packet is currently in "complete" state (all 6 phases validated strict; SQLite advisor rebuilt and routes correctly; 0 active-scope grep residual).

## ITERATION POLICY

- **Fixed 5 iterations.** Do not converge early.
- **Executor**: cli-codex (gpt-5.5, model_reasoning_effort=high, service_tier=fast, --full-auto sandbox)
- **READ-ONLY**: do not modify source files; only `review/iterations/*.md`, `review/deltas/*.jsonl`, `review/review-report.md`

## DIMENSION ROTATION (5 dimensions across 5 iterations)

| Iter | Focus dimension | Cross-cutting check |
|---|---|---|
| 001 | (1) Cross-file consistency | Sample 30+ files across .opencode/{skill,agent,command}, .opencode/specs (active), .claude, .codex, .gemini, root, configs |
| 002 | (2) Advisor + skill graph integrity | skill-graph.json keys/signals/anti-signals/families/adjacency/hub_skills + advisor probes |
| 003 | (3) No broken references | Cross-skill graph-metadata edges; SKILL.md routing tables; command files; MCP TS constants |
| 004 | (4) No over-replacement | Spec docs that DOCUMENT the rename retain old names in narrative; pre-promote-backup snapshots untouched |
| 005 | (5) Behavior parity + adversarial pass | Renamed skills' content unchanged beyond names; challenge prior findings; final referee verdict |

## CONFIG

- Target: `specs/skilled-agent-orchestration/070-sk-deep-rename`
- Mode: review
- maxIterations: 5
- convergenceThreshold: 0.0 (force fixed-pass)
- Executor: cli-codex / gpt-5.5 / high / fast
- Output root: `review/`
- Iteration files: `review/iterations/iteration-NNN.md`
- Final synthesis: `review/review-report.md`

## KNOWN CONTEXT (loaded at init)

- All 6 phases validate strict-pass at packet level (recursive)
- Phase 002 renamed `.opencode/skills/sk-deep-review/` → `deep-review/` and `sk-deep-research/` → `deep-research/`
- Phase 003 updated 1,300+ .opencode/ internal references
- Phase 004 updated runtime mirrors (.claude, .codex, .gemini)
- Phase 005 updated root docs + configs
- Phase 006 ran final verification + restored over-replaced parent narrative + dispatched advisor rebuild
- Final orchestrator advisor_rebuild: gen 1144, 0 rejected edges, freshness live
- Direct advisor probes confirm: deep-review (0.883) and deep-research (0.834) route correctly as top-1
- 36 residual hits in Phase 006 final tally, of which:
  - 4 fixed in `.codex/` post-Phase 006 (codex couldn't self-edit; orchestrator patched)
  - Remaining 32 are LEGITIMATE: pre-promote-backup snapshots (preserve old state), telemetry compliance.jsonl (historical log), shadow-deltas.jsonl (compiled), the 070 spec docs themselves describing the rename
- 0 active-scope hits remaining post all fixes
