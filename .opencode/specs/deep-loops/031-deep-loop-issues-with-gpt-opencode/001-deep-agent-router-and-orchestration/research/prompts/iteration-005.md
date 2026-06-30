DEEP-RESEARCH

# Deep-Research Iteration 5 (DEEPENING) — Stress-test FIX-5 Trigger (KQ8) + Pre-route Edits for All 4 Modes (KQ5)

## STATE

Segment: 1 | Iteration: 5 of 8 (DEEPENING ARC)
Questions: 10/10 answered; deepening KQ8 + KQ5.
Last 3 ratios: 0.75 -> 0.58 -> 0.55 | Stuck count: 0
Next focus: (1) Walk each of the 3 FIX-5 failure signals with a CONCRETE scenario — what a GPT mis-dispatch looks like, how the trigger fires, what the native/Claude baseline shows. (2) Flesh the pre-route edits for ALL 4 deep modes (research/review/context/council); iter 2 only did research.

## PRIOR RESULTS (build on)

- Iter 2 KQ5 proposed 3 research-mode pre-route edits (prompt template, CLI dispatch, orchestrator task format). Review/context/council equivalents NOT yet done.
- Iter 3 KQ8 FIX-5 criterion: if GPT cli-opencode first dispatch fails mode-local validation (no canonical type:"iteration" record, OR delta_file_missing_iteration_record, OR dispatch_failure_logged/executor_missing) while native/Claude baseline passes → FIX-5 mandatory. Failure signals enumerated at `deep_research_auto.yaml:940-968`.
- Iter 4 produced concrete deep.md draft (mode: primary, registry-aligned route table, mis-route guards).
Read iterations/iteration-002.md, iteration-003.md, iteration-004.md and research/research.md §3, §5.

## STATE FILES

- State Log: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/001-deep-agent-router-and-orchestration/research/deep-research-state.jsonl
- Registry: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/001-deep-agent-router-and-orchestration/research/findings-registry.json
- Write iteration narrative to: .../research/iterations/iteration-005.md
- Write delta to: .../research/deltas/iter-005.jsonl

## CONSTRAINTS

- LEAF agent. No sub-agents. Max 12 tool calls. Cite file:line. CONFIRMED vs INFERRED.
- Do NOT write/modify research.md or create real files. Only iteration-005.md + state-log append + delta.

## FOCUS — two deliverables

### Deliverable A: FIX-5 trigger stress-test (KQ8 deepen)

The iter-3 criterion is a one-liner. Stress-test it by walking EACH of the failure signals with a concrete scenario. For each signal, produce:
- **What GPT does wrong** (the mis-dispatch behavior, tied to operator-asserted mode A/B/C where relevant).
- **What the artifact/state looks like** (the exact malformed/missing output — cite the validator lines at `deep_research_auto.yaml:940-968` that catch it).
- **What the native/Claude baseline shows** (the correct output, so the differential is clear).
- **Verdict: does the trigger fire correctly?** (yes/no/edge).

The signals (from iter 3 + `deep_research_auto.yaml:957-968`):
1. `iteration_file_missing` / `iteration_file_empty` — no canonical narrative.
2. `jsonl_not_appended` / `jsonl_missing_fields` / `jsonl_parse_error` / `jsonl_wrong_type` (e.g. `iteration_delta` instead of `iteration`).
3. `delta_file_missing` / `delta_file_empty` / `delta_file_missing_iteration_record`.
4. `executor_missing` / `dispatch_failure_logged`.

Also identify ANY gap: is there a mis-dispatch that would NOT trip any of these signals (false-negative for the trigger)? That's the most important finding — if the trigger has a blind spot, FIX-5 might be needed even when the trigger says "pass."

### Deliverable B: Pre-route edits for all 4 deep modes (KQ5 deepen)

Iter 2 gave research-mode edits. Produce the review/context/council equivalents. For EACH mode, read the relevant YAML + prompt template and give the concrete `Resolved route` header + the exact file:line to edit:
- research: `deep_research_auto.yaml:916-925` (CLI) + `deep-loop-workflows/deep-research/assets/prompt_pack_iteration.md.tmpl:1-5` (done in iter 2 — confirm/carry forward).
- review: `deep_review_auto.yaml` CLI dispatch + review prompt template — find the lines.
- context: `deep_context_auto.yaml` CLI dispatch + context prompt template — find the lines.
- council: `deep_ai-council_auto.yaml` dispatch + council prompt — find the lines (note: council may not have a CLI branch / may be native-only — confirm).

For each mode, give: the `Resolved route: mode=<...>; target_agent=@<...>; execution=<...>` line, and the before/after at the cited file:line.

## OUTPUT CONTRACT

1. Iteration narrative iterations/iteration-005.md (Focus, Actions Taken, Findings = Deliverable A [4 signal walkthroughs + false-negative analysis] + Deliverable B [4-mode pre-route edit table], Questions Remaining, Next Focus).
2. Canonical `{"type":"iteration","iteration":5,...}` APPENDED to state log (type exactly "iteration"; single-line; newline-terminated). newInfoRatio reflects net-new stress-test + 4-mode coverage (likely 0.4-0.55). status "complete" or "insight". Include focus, findingsCount, keyQuestions ["KQ8","KQ5"], answeredQuestions, durationMs, timestamp, sessionId "031-001-res-1782823402", generation 1.
3. Delta file deltas/iter-005.jsonl.

All three REQUIRED.
