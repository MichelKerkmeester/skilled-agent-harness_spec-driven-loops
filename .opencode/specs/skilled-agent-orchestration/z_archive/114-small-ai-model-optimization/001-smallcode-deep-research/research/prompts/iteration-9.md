DEEP-RESEARCH

# Deep-Research Iteration Prompt Pack — iter 9 of 20 (DEEPEN RQ4)

## STATE

state_summary: Iter 9 of 20. Trajectory 0.85→0.78→0.72→0.68→0.65→0.55→0.45→0.35. Deepening pass continues.

Iteration: 9 of 20

Focus Area: **RQ4 deepening — Concrete permissions-matrix.schema.json + RM-8 counter-example walkthrough.** Iter 4 surfaced structured-permissions principle. This iter produces patch-ready specifics: (a) full `permissions-matrix.schema.json` with fields {target_glob, operation_class, scope, allow|deny, rationale} plus example matrix entries (read-only-corpus pattern, packet-local-write pattern, repo-wide-write pattern), (b) RM-8 counter-example walkthrough — for each of the 44 files actually deleted on 2026-05-04, show whether the schema's allow/deny decision would have prevented deletion (the cli-opencode v1.3.3.0 four-layer prose mitigation is documented in `cli-opencode/references/destructive_scope_violations.md`), (c) where the schema lives (extend cli-opencode agent-config recipe pattern? new `.opencode/skills/cli-opencode/assets/permissions-matrix.schema.json`?), (d) runtime enforcement design (where does the enforcer hook in — pre-tool-call vs post-tool-call vs both?).

Last 3 Iterations Summary:
- iter 6: RQ1 deepen (0.55 insight)
- iter 7: RQ2 deepen (0.45 insight)
- iter 8: RQ3 deepen (0.35 insight)

## STATE FILES

- Write iteration narrative to: `.opencode/specs/skilled-agent-orchestration/114-small-ai-model-optimization/001-smallcode-deep-research/research/iterations/iteration-009.md`
- Write per-iteration delta file to: `.opencode/specs/skilled-agent-orchestration/114-small-ai-model-optimization/001-smallcode-deep-research/research/deltas/iter-009.jsonl`
- State Log: `.opencode/specs/skilled-agent-orchestration/114-small-ai-model-optimization/001-smallcode-deep-research/research/deep-research-state.jsonl`
- Strategy: `.opencode/specs/skilled-agent-orchestration/114-small-ai-model-optimization/001-smallcode-deep-research/research/deep-research-strategy.md`
- Registry: `.opencode/specs/skilled-agent-orchestration/114-small-ai-model-optimization/001-smallcode-deep-research/research/findings-registry.json`

## CONSTRAINTS

- LEAF agent. No sub-agent dispatch. Max 12 tool calls. 3–5 research actions.
- Already-shipped 113: RM-8 four-layer mitigation IS shipped — your job is to propose the STRUCTURED replacement, not re-derive the four-layer. Cite as "shipped" baseline.

## SOURCE BOUNDARIES

- Re-read smallcode: `external/smallcode-master/src/tools/registry.ms`, `src/tools/router.ms`, `src/tools/validator.ms`. Extract the registry-time permission entries verbatim.
- Read iter-004.md (RQ4 baseline patterns) + iter-005.md (RQ5 verdict HYBRID — Option B distributed sub-path for RQ4).
- Read-only refs: `.opencode/skills/cli-opencode/references/destructive_scope_violations.md` (RM-8 incident — read the 44-file list + four-layer mitigation), `.opencode/skills/cli-opencode/SKILL.md` ALWAYS #13, `.opencode/skills/cli-devin/assets/agent-config-deep-research-iter.json` (existing structured permission pattern via Devin --agent-config — analog template for our permissions-matrix).

## OUTPUT CONTRACT (REQUIRED — all 3 artifacts)

1. **iteration-009.md** — Findings MUST include:
   - The permissions-matrix.schema.json (full JSON with fields + example matrix entries)
   - RM-8 counter-example walkthrough (per-file or per-pattern: would the schema have blocked the deletion?)
   - Schema location verdict (new file path)
   - Runtime enforcement design (pre/post hook + integration point)

2. **state.jsonl APPEND**: `{"type":"iteration","iteration":9,"newInfoRatio":<0..1>,"status":"insight","focus":"RQ4 deepening — permissions-matrix schema + RM-8 walkthrough","graphEvents":[]}`. Expected ratio 0.20-0.35.

3. **deltas/iter-009.jsonl** — one iter record + ≥3 finding records.

## EXECUTION

1. Pre-plan (3 steps):
   a. Re-read smallcode tool registry surface + iter-004.md + iter-005.md HYBRID verdict.
   b. Read RM-8 incident doc + existing four-layer mitigation. Read agent-config-deep-research-iter.json (its structured permissions are an analog).
   c. Author the concrete artifacts: schema JSON, RM-8 walkthrough, location verdict, runtime enforcement design.
2. Execute. Stop at step c.
3. Append JSONL + delta. Stop.
