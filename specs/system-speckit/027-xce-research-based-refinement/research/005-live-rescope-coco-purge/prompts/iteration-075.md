DEEP-RESEARCH

# Deep-Research Iteration 075 — vocab/constants: RELATION_TYPES vs DEFAULT_RELATION_TARGETS; STATE_LIMITS

You are a LEAF deep-research analyst. READ-ONLY. No sub-agents, no file edits. Max ~12 tool calls. Cite `file:line`.

Spec folder: `specs/system-spec-kit/027-xce-research-based-refinement` (pre-approved; skip Gate 3 — read-only, write NOTHING).

## CONTEXT
- The 2026-06-05 audit said: `RELATION_TYPES` is stable, but `DEFAULT_RELATION_TARGETS` is MISALIGNED with it (includes `produced`/`cited_by`, omits `enabled`/`derived_from`) — and 008/003-causal-reducer plans `ENABLED` edges. Also `STATE_LIMITS` exists but isn't a production export (iter-065 confirmed it's at `lib/search/pipeline/stage4-filter.ts` via `__testables`).
- 027 phases touch causal relation vocabulary (004, 005, 008/003).

## FOCUS — answer only this
Resolve the vocabulary alignment questions against live code:
1. What is the live `RELATION_TYPES` set? (grep for it)
2. What is `DEFAULT_RELATION_TARGETS` and does it diverge from `RELATION_TYPES` (extra `produced`/`cited_by`? missing `enabled`/`derived_from`?)? Is it coverage-only or production-consumed?
3. Does 008/003-causal-reducer plan `ENABLED` edges, and is `enabled` in the live relation vocabulary?
4. Reconfirm STATE_LIMITS export status (one grep).
Greps:
- `grep -rn "RELATION_TYPES\|DEFAULT_RELATION_TARGETS" .opencode/skills/system-spec-kit/mcp_server/lib/`
- `grep -rn "ENABLED\|enabled\|derived_from\|produced\|cited_by" .opencode/skills/system-spec-kit/mcp_server/lib/causal/ .opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts | head`
- `005-learning-feedback-reducers/003-causal-reducer/spec.md`

## DELIVER (plain text — orchestrator writes artifacts)
### FINDINGS
3-5 findings `[F-075-NN]` + `file:line`. Cover the RELATION_TYPES set, the DEFAULT_RELATION_TARGETS divergence (and whether it's a real bug or coverage-only), the ENABLED-edge feasibility for 008/003, and STATE_LIMITS export.

### VOCAB_ACTIONS
Bullets: align-or-document `DEFAULT_RELATION_TARGETS`; the `STATE_LIMITS` export fix; any 027 phase requirement that must reference the canonical vocabulary source.

### VERDICT
vocab/constants = {NEEDS-FIX | DOC-ONLY | ...} + which 027 phase owns each fix.

### RULED_OUT
1-3 bullets.

### METRICS
newInfoRatio: <0.0-1.0>
novelty: <1 sentence>
status: complete
sources: <comma-separated file:line list>

Terse, evidence-dense, no preamble.
