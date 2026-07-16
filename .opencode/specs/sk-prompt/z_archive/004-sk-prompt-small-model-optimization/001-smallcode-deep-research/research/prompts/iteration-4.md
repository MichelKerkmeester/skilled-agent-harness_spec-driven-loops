DEEP-RESEARCH

# Deep-Research Iteration Prompt Pack — iter 4 of 20

## STATE

state_summary: Iter 4 of 20. Iter 1 → RQ1 (5 patterns, 0.85). Iter 2 → RQ2 (0.78 insight). Iter 3 → RQ3 (0.72 progress). Focus → RQ4.

Research Topic: Mine smallcode-master MIT corpus for small-model output-quality runtime patterns (5 RQs).

Iteration: 4 of 20

Focus Area: **RQ4 — Structured Scope/Permissions.** Read smallcode's tool registry + permission surface (`src/tools/registry.ms`, `src/tools/router.ms`, `src/tools/validator.ms`, `src/tools/executor.ms` if present) via preflight context-card §RQ4 (~22 citations). Identify 3–5 reusable patterns for STRUCTURED permission contracts (vs prose constraints that failed for deepseek-v4-pro in RM-8). The structured permissions matrix idea is to encode file-glob × operation × scope as JSON, not prose, and have a runtime enforcer reject out-of-scope writes deterministically. For each pattern emit: (a) smallcode primitive (file:line + code quote), (b) candidate target path (e.g. new `.opencode/skills/cli-opencode/assets/permissions-matrix.schema.json` + ref doc), (c) one-line patch shape, (d) acceptance criteria including the RM-8 counter-example (would the schema have prevented 44 file deletions on 2026-05-04?).

Remaining Key Questions (2):
- [x] RQ1 — Context Budget Engine (iter 1, 5 patterns)
- [x] RQ2 — Output Verification Pipeline (iter 2)
- [x] RQ3 — Per-Model Profiles & Escalation (iter 3)
- [ ] RQ4 — Structured Scope/Permissions ← current focus
- [ ] RQ5 — Skill Architecture (synthesis)

Last 3 Iterations Summary:
- iter 1: RQ1 (ratio 0.85, 5 patterns)
- iter 2: RQ2 (ratio 0.78, status insight)
- iter 3: RQ3 (ratio 0.72, status progress)

## STATE FILES

- Config: `.opencode/specs/sk-prompt/004-sk-prompt-small-model-optimization/001-smallcode-deep-research/research/deep-research-config.json`
- State Log: `.opencode/specs/sk-prompt/004-sk-prompt-small-model-optimization/001-smallcode-deep-research/research/deep-research-state.jsonl`
- Strategy: `.opencode/specs/sk-prompt/004-sk-prompt-small-model-optimization/001-smallcode-deep-research/research/deep-research-strategy.md`
- Registry: `.opencode/specs/sk-prompt/004-sk-prompt-small-model-optimization/001-smallcode-deep-research/research/findings-registry.json`
- Write iteration narrative to: `.opencode/specs/sk-prompt/004-sk-prompt-small-model-optimization/001-smallcode-deep-research/research/iterations/iteration-004.md`
- Write per-iteration delta file to: `.opencode/specs/sk-prompt/004-sk-prompt-small-model-optimization/001-smallcode-deep-research/research/deltas/iter-004.jsonl`

## CONSTRAINTS

- LEAF agent. No sub-agent dispatch. Max 12 tool calls. 3–5 research actions.
- Write all findings to files. Already-shipped 113 items: RCAF default, medium pre-plan, standard bundle-gate, anti-hallucination secondary, sequential_thinking 2-layer, SWE-1.6 free-tier, RM-8 four-layer mitigation — DO NOT re-propose; cite as "shipped" if relevant.

## SOURCE BOUNDARIES

- Read-only across `.opencode/specs/.../external/smallcode-master/`
- Primary sources iter 4: `external/smallcode-master/src/tools/registry.ms`, `src/tools/router.ms`, `src/tools/validator.ms`. Also check `src/tools/executor.ms` if present.
- Preflight evidence base: `.opencode/specs/.../preflight/context-card.md` §RQ4
- Read-only refs (deltas target): `.opencode/skills/cli-opencode/SKILL.md` (ALWAYS #13 four-layer RM-8 mitigation), `.opencode/skills/cli-opencode/references/destructive_scope_violations.md` (RM-8 incident analysis), `.opencode/skills/cli-devin/assets/agent-config-deep-research-iter.json` (existing structured permissions example via Devin's --agent-config)

## OUTPUT CONTRACT (REQUIRED — all 3 artifacts)

1. **iteration-004.md** — Focus/Actions Taken/Findings/Questions Answered/Questions Remaining/Next Focus structure.
2. **state.jsonl APPEND** — single line `{"type":"iteration","iteration":4,"newInfoRatio":<0..1>,"status":"...","focus":"RQ4 — Structured Scope/Permissions","graphEvents":[]}`. Expected ratio 0.55–0.80.
3. **deltas/iter-004.jsonl** — one iter record + N finding records.

## EXECUTION

1. Pre-plan (medium, 3 steps):
   a. Read preflight context-card §RQ4.
   b. Read `src/tools/registry.ms` (tool-definition + permission entries), `src/tools/router.ms` (2-stage routing + per-stage permission scope), `src/tools/validator.ms` (validate-before-exec gates). Cross-reference with `cli-opencode/references/destructive_scope_violations.md` to understand what the RM-8 four-layer prose mitigation looks like today.
   c. For each 3–5 pattern: section in iteration-004.md (smallcode primitive + candidate target path + patch shape + acceptance criteria with the RM-8 counter-example).
2. Execute. Stop at 5 patterns.
3. Append JSONL + delta. Stop.
