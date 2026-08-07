# Iteration 41 (Round O): C8 threat model → REAL injection vector, must-fix

## Focus
Resolve the highest residual: is the unescaped getTieredContent render a real prompt-injection vector. Read-only.

## Findings (newInfoRatio 0.8) — UPGRADES iter-031 (threat-gated → must-fix)
**THREAT-VERDICT: REAL injection vector → C8 = MUST-FIX (H leverage).** The write→recall→prompt loop closes:
- `memory_save` accepts arbitrary caller-supplied `content: string` (`memory-save.ts:367,597,3818`) and scrubs **secrets ONLY** — the scrubber pattern set is keys/tokens/JWT, NO injection markers (`secret-scrubber.ts:4-8,51-131`).
- That content is atomic-written to the on-disk file that `getTieredContent` `readFileSync`s and emits VERBATIM at HOT tier (`memory-triggers.ts:299-300`), into the MCP `data.results[].content` (`:721,784`).
- `memory_match_triggers` fires at GATE 1 of EVERY user turn → recalled content re-enters the agent loop. `import` + tool-extraction are first-class non-human write sources (`write-provenance.ts:7,70`; `extraction-adapter.ts`).
- So a user pasting web/issue text into `memory_save`, or an agent quoting tool output into `handover.md`, lands untrusted bytes that recall later feeds to a model unescaped. C8 = the always-on render-wrapper (027 scrubber doctrine, extended secrets→injection). LEVERAGE H, EFFORT M.

## Most-likely-wrong
Whether `params.content` reaches the HOT file BODY verbatim vs being routed through the content-router/agent-summarization path (which would interpose summarization and downgrade must-fix→conditional — but the user-paste-to-memory_save flow stays real either way).

## Next Focus
C8 upgraded to a real must-fix in the ledger (no longer threat-gated). The render-wrapper seam is `memory-triggers.ts:706-721` + the canonical recall formatter.
