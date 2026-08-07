Deep-research iter 3/10 SCOPE-EXPANSION pass for packet .opencode/specs/system-spec-kit/027-xce-research-based-refinement.

CONTEXT: Iter 1-2 covered RQ-A1 (intent steering) + RQ-A2 (HLD/LLD rerank fusion). This iter covers RQ-A3.

ITER 3 FOCUS: RQ-A3 — ccc_feedback JSONL graduation to active rerank-weight loop.

READ FIRST:
- .opencode/skills/mcp-coco-index/SKILL.md (look for ccc_feedback section — current schema, what events get logged)
- .opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/ (grep for "feedback" — find the writer)
- (search) .opencode/skills/mcp-coco-index/ for any reader of ccc_feedback JSONL (the analysis says it's WRITE-ONLY today — verify)
- .opencode/specs/system-spec-kit/z_archive/024-compact-code-graph/004-cocoindex-overfetch-dedup/ (precedent for adaptive coco-index work — what shipped, what was deferred)
- .opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py (where rerank weights are applied — would consume the feedback signal)
- .opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-pt-03/iterations/iteration-001.md (iter 1 findings)
- .opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-pt-03/iterations/iteration-002.md (iter 2 findings)

QUESTION: Should `ccc_feedback` JSONL graduate from write-only telemetry to a feedback-driven rerank-weight loop?
- What's the current schema (events, fields, frequency)?
- Bounded online learning design: a periodic reducer that reads recent feedback events → updates a small reweight table (e.g. per path_class, per intent-tag from RQ-A1) → applied as a small additional rerank delta (clamped, e.g. ±0.10).
- NEVER full re-embed (out of scope per strategy.md non-goals).
- Storage: extend existing JSONL or new sqlite table?
- Cold start: how does the loop behave with 0 feedback events?
- Privacy / multi-user: feedback is local-only; does that change the design?
- LOC estimate: feedback-reducer + reweight-table + rerank-shim.
- Dependencies on RQ-A1 (intent tags) — does this require RQ-A1 ADOPT first?

DELIVERABLES (all 3 required, same shapes as iter 1):
1. WRITE `research/027-xce-research-pt-03/iterations/iteration-003.md`
2. APPEND state.jsonl: `{"type":"iteration","iteration":3,"newInfoRatio":<0..1>,"status":"complete","focus":"RQ-A3"}`
3. WRITE `research/027-xce-research-pt-03/deltas/iter-003.jsonl`

CONSTRAINTS: same as iter 1. Out-of-scope reminder: NEVER full re-embed; NEVER add SaaS dependencies.

NEXT iter focus hint: RQ-A4 — Few-shot example-bank retrieval for coco-index.
