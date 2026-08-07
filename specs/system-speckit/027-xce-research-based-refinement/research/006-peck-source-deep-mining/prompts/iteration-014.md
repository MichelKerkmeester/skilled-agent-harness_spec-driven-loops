DEEP-RESEARCH — CROSS-MODEL VERIFY (MiniMax M3)

# Iteration 014 — Adversarially verify T6 (completion-verdict freshness binding)

## Task
Independently REFUTE-or-CONFIRM a prior gpt-5.5-fast finding (iter 002): that spec-kit's completion gate has NO freshness binding (verdict/checklist evidence is not bound to current file content or git HEAD), making "completion-verdict freshness" a real net-new gap. You are a second model; reach your OWN verdict from the live code.

## Instructions
1. Read the live completion/validation surfaces (spec-kit root = `.opencode/skills/system-spec-kit/`): `mcp_server/lib/validation/spec-doc-structure.ts` (around the `session_dedup.fingerprint` / `POST_SAVE_FINGERPRINT` checks ~309, 636, 1072), `scripts/validation/continuity-freshness.ts` (~153, 233), `mcp_server/handlers/memory-save.ts` (~1006), `CLAUDE.md` §2 COMPLETION VERIFICATION (~247-258), `constitutional/verify-before-completion-claims.md`.
2. For EACH sub-claim below, reach a verdict by reading the actual code — do NOT trust the prior finding:
   - C1: `session_dedup.fingerprint` is validated for SYNTAX only and never recomputed against current in-scope files.
   - C2: `CONTINUITY_FRESHNESS` checks only a timestamp lag, not content equality.
   - C3: completion (`validate.sh --strict` + checklist `[x]`) is NOT invalidated by later edits to in-scope files (no HEAD/content binding).
3. Emit a verdict per claim + your own `file:line` evidence.

## Do's
- READ-ONLY. Cite every claim as `file:line`. Max ~12 tool calls.
- Reach an INDEPENDENT verdict {CONFIRMED | REFUTED | PARTIAL | UNKNOWN}; if you find an EXISTING mechanism the prior run missed, REFUTE and cite it exactly.
- Be honest: if you cannot verify a claim, mark UNKNOWN — never fabricate agreement or disagreement.

## Don'ts
- Do NOT modify, create, or write any file (the orchestrator writes artifacts).
- Do NOT rubber-stamp the prior finding — actively try to refute C1/C2/C3 first.
- Do NOT dispatch sub-agents; do NOT exceed 12 tool calls.

## Examples
Output exactly these sections:
### VERDICTS
`[V-014-C1] CONFIRMED|REFUTED|PARTIAL|UNKNOWN — <restate claim> — evidence `file:line` — 1-line reasoning` (one per C1,C2,C3)
### NEW_CONSIDERATIONS
Anything the gpt-5.5 run missed (an existing mechanism, an extra risk, a simpler design). 0-3 bullets with cites.
### METRICS
agreement: AGREE | DISAGREE | MIXED (vs the prior ADOPT verdict)
newInfoRatio: <0.0-1.0 — how much NEW vs the prior finding>
status: complete
sources: <file:line list you cited>

## Context
- Cross-model verification (MiniMax M3) of a gpt-5.5-fast deep-research run on `external/peck-master`. peck root: `specs/system-spec-kit/027-xce-research-based-refinement/external/peck-master/`.
- Prior finding doc: `specs/system-spec-kit/027-xce-research-based-refinement/research/006-peck-source-deep-mining/iterations/iteration-002.md`.
- Spec folder pre-approved; skip Gate 3 — you write NOTHING.
- peck reference for the mechanism: `external/peck-master/src/assets/agents/implementer.md:41,53` ("code changes after a reviewer run invalidate prior verdicts"; report only from current HEAD + clean tree).
