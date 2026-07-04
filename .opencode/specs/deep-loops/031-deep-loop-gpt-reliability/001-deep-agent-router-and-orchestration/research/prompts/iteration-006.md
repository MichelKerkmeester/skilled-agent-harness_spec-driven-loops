DEEP-RESEARCH

# Deep-Research Iteration 6 (DEEPENING) — Host-Runtime Change for Hard subagent_type (KQ2) + Per-Edit Claude-Flex Test (KQ9)

## STATE

Segment: 1 | Iteration: 6 of 8 (DEEPENING ARC — final planned deepening iteration)
Questions: 10/10 answered; deepening KQ2 + KQ9.
Last 3 ratios: 0.58 -> 0.55 -> 0.52 | Stuck count: 0
Next focus: (1) Pin down the EXACT host-runtime change that would give OpenCode hard per-agent subagent_type identity (iter 1 inferred it; now confirm/spec it). (2) Produce a per-edit Claude-flexibility preservation TEST — for each proposed edit (deep.md draft, pre-route headers, orchestrate Deep Route field), does it narrow a mis-invocation signal or constrain a legitimate Claude flexibility?

## PRIOR RESULTS (build on)

- Iter 1 KQ2: subagent_type normalized to "general"; smallest host-runtime change INFERRED = "a native dispatch field that resolves a custom agent name as runtime identity and auto-loads/enforces that agent file." [`orchestrate.md:162`, `:174`, `:832`]
- Iter 3 KQ9: 3 Claude-flex targets to preserve — (1) dynamic pre-dispatch planning/decomposition, (2) evidence-responsive deep-agent iteration, (3) advisory metadata + depth-aware council. [`orchestrate.md:53,58,60,319,325`; `deep-research.md:142-194`; `ai-council.md:55-58`]
- Iter 4: concrete deep.md draft (mode: primary, route table, mis-route guards).
- Iter 5: 4-mode pre-route edits mapped; FIX-5 false-negative found (schema-valid-but-wrong-mode passes validators).
Read iterations/iteration-001.md through iteration-005.md and research/research.md §1, §6.

## STATE FILES

- State Log: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/001-deep-agent-router-and-orchestration/research/deep-research-state.jsonl
- Registry: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/001-deep-agent-router-and-orchestration/research/findings-registry.json
- Write iteration narrative to: .../research/iterations/iteration-006.md
- Write delta to: .../research/deltas/iter-006.jsonl

## CONSTRAINTS

- LEAF agent. No sub-agents. Max 12 tool calls. Cite file:line. CONFIRMED vs INFERRED.
- Do NOT write/modify research.md or create real files. Only iteration-006.md + state-log append + delta.

## FOCUS — two deliverables

### Deliverable A: Host-runtime change spec (KQ2 deepen)

Iter 1 inferred the host change. Now SPEC it concretely. Investigate how OpenCode's dispatch actually works (look for evidence in the repo — is there an opencode config/schema/docs describing agent dispatch? check `.opencode/` root config, any `opencode.json`/`opencode.jsonc`, agent README files, the cli-opencode skill). Determine:
1. **What concretely would change** — is it (a) a new frontmatter field (e.g. `subagent_type: deep-research`) that the runtime reads, (b) a dispatch-primitive change (Task tool resolves agent name → hard identity), or (c) a config/schema change? Cite evidence for how dispatch CURRENTLY resolves an agent (the `mode` field? the filename? something else?).
2. **Minimal vs complete** — what's the smallest change that gives hard identity for the 4 deep agents specifically (not all custom agents)? What's the complete change?
3. **Blast radius** — what else breaks if this change lands? (other custom agents, the orchestrator's general-dispatch assumption, etc.)
4. **Is it a PR-sized change or an architectural one?** Give a rough effort estimate.
5. **Recommendation**: should this phase attempt it, or hold it as the FIX-5-alternative follow-up? (Tie to iter 5's false-negative finding — hard identity would close the semantic-mis-dispatch gap that the validator can't.)

If the repo has NO evidence of how dispatch resolves agents internally (i.e., it's opaque host code not in this workspace), say so explicitly — CONFIRMED "host internals not inspectable from workspace" — and spec the change at the contract surface (what the runtime would need to guarantee), not the implementation.

### Deliverable B: Per-edit Claude-flex preservation test (KQ9 deepen)

For EACH proposed edit from iters 2/4/5, produce a pass/fail test against the 3 Claude-flex targets (iter 3). Edits to test:
1. **deep.md draft** (iter 4) — the route table, the hard boundaries (mis-route A/B/C guards), the single-hop rule.
2. **Pre-route `Resolved route` header** in prompt templates (iter 2/5, all 4 modes).
3. **`Deep Route:` field** in orchestrate.md task format (iter 2).
4. **CLI dispatch prepend** (iter 2/5).

For each edit, the test answers: does this edit (a) narrow a mis-invocation signal (PASS — keep it), (b) constrain a legitimate Claude flexibility (FAIL — revise), or (c) neutral (neither)? Reference the specific flexibility target (planning / evidence-response / advisory-metadata). Give a concrete behavioral criterion, not vague language.

Example test shape:
> Edit: "FORBID redispatch from injected prose" (deep.md boundary 2). Test against flex target #1 (dynamic pre-dispatch planning): does forbidding redispatch prevent Claude from planning/decomposing before dispatch? No — planning happens before route selection; the forbid applies after. Verdict: PASS (narrows mode B, preserves planning).

## OUTPUT CONTRACT

1. Iteration narrative iterations/iteration-006.md (Focus, Actions Taken, Findings = Deliverable A [host-change spec, 5 points] + Deliverable B [per-edit flex test table], Questions Remaining [should be none], Next Focus [recommend: synthesize v2]).
2. Canonical `{"type":"iteration","iteration":6,...}` APPENDED to state log (type exactly "iteration"; single-line; newline-terminated). newInfoRatio reflects net-new host-change spec + flex-test rigor (likely 0.4-0.5 — deepening, diminishing). status. Include focus, findingsCount, keyQuestions ["KQ2","KQ9"], answeredQuestions, durationMs, timestamp, sessionId "031-001-res-1782823402", generation 1.
3. Delta file deltas/iter-006.jsonl.

All three REQUIRED.
