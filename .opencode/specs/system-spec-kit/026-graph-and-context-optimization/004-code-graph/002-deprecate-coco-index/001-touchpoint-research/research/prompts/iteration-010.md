DEEP-RESEARCH

ROLE
You are a SWE-1.6 deep-research iteration worker (LEAF, read-only except this packet's output files). Run exactly ONE research cycle, then exit. Do not dispatch sub-agents.

MANDATORY FIRST STEP
Call mcp__sequential_thinking__sequentialthinking with at least 5 thoughts: (1) review all findings, (2) structure the resource-map skeleton, (3) check each RQ's acceptance, (4) finalize open uncertainties, (5) compose the JSONL record. Only then emit outputs.

CONTEXT
- Topic: Deprecate `mcp-coco-index` + `system-rerank-sidecar`; decouple `system-code-graph` from CocoIndex.
- Iteration: 10 of 12 (FINAL cli-devin iteration). FOCUS = PRE-SYNTHESIS CONSOLIDATION — organize all findings into a resource-map skeleton, verify RQ acceptance, finalize uncertainties for the deepseek closers.
- Repo root (cwd): /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
- READ FIRST: iterations 001-009 (the complete accumulated map; iter-007 DAG; iter-008 totals; iter-009 dynamic refs + coupling confirmation).
- SCOPE: `.opencode/specs/**` = FROZEN. Consolidation only — no implementation.

ACTION (pre-planned, <= 12 tool calls)
1. Read iterations 001-009 (focus on the tables + decisions + DAG).
2. Build the RESOURCE-MAP SKELETON: the section structure the final synthesis will fill — (a) Executive summary (3 targets, 3 end-states), (b) Classified touchpoint inventory grouped BY PHASE (002-008), (c) The 2 key decisions (memory cross-encoder loss + positional fallback; HYBRID semantic-search policy), (d) Phase DAG with ordering rationale, (e) Risk register, (f) Negative knowledge, (g) Deletion-completeness checklist. Reference which iteration sources each section.
3. RQ ACCEPTANCE CHECK — for RQ1-RQ7, state MET / PARTIAL / OPEN with the iteration that answered it and one-line evidence.
4. Finalize the OPEN-UNCERTAINTIES list for the deepseek adversarial closers (iters 11-12): the specific things to challenge — e.g. "is the DAG ordering truly safe?", "any touchpoint class mis-assigned?", "does positional fallback degrade default memory search?", "did we miss a runtime consumer?".
5. Note anything that would change the phase count or ordering.

FORMAT (write exactly these two, then exit)
A) Write `.../001-touchpoint-research/research/iterations/iteration-010.md`:
   - `## Focus (pre-synthesis consolidation)`
   - `## Resource-map skeleton` — the section outline with per-section source iterations
   - `## RQ acceptance check` — table: `RQ | Status (MET/PARTIAL/OPEN) | Answered in | Evidence`
   - `## Open uncertainties for deepseek closers`
   - `## Phase count/ordering confirmation`
   - Cite `[SOURCE: iteration-00N.md]` / `[SOURCE: file:line]`.
B) Append ONE line to `.../001-touchpoint-research/research/deep-research-state.jsonl`:
   `{"type":"iteration","iteration":10,"newInfoRatio":<0..1>,"status":"complete","focus":"pre-synthesis consolidation + RQ acceptance","novelty":"<one sentence>","timestamp":"<ISO-8601 now>","sessionId":"dr-014-001-touchpoint-20260525","generation":1}`

CONSTRAINTS
- Read-only outside the two packet output files. Report findings only.
- Never edit `.opencode/specs/**`. Stay within ~11 tool calls; stop after the two outputs.
