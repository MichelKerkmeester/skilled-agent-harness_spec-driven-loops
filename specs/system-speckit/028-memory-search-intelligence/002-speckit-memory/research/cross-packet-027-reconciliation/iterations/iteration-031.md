# Iteration 31 (Round N adversarial): C8 render-gap — mechanism refuted, substance survives at a different seam

## Focus
Adversarially verify the C8 render-gap (does getSessionMemories content reach model output unescaped). Read-only.

## Findings (newInfoRatio 0.7) — CORRECTS iteration-022's seam
**VERDICT: PARTIAL.** The stated mechanism is REFUTED; the substance survives via a different path.
- `getSessionMemories` SELECTs `m.*` but the handler immediately projects to `{memoryId, attentionScore}` (`memory-triggers.ts:655-656`) — content discarded, used only for attention scoring (`:664,675,684`). So the iter-022 seam (getSessionMemories→:655 renders content) is wrong.
- The ACTUAL unescaped-content render is `getTieredContent` (`memory-triggers.ts:706-707`): `fs.readFileSync` returns raw HOT-tier content with no escaper (`:299-304`), flowing into the model-facing MCP response `data.results[].content` (`:721,784`). `formatSearchResults`/`search-results.ts` is NOT on this handler's path.
- **So C8's substance (unescaped recall content reaching model output) is REAL**, but at the tiered-content path. LEVERAGE M, EFFORT M.

## Threat-model caveat (sharpens the leverage)
The "untrusted recall" here is **on-disk spec/memory file content** — so the injection threat model is "who can write spec files," weaker than external untrusted input. C8's leverage is conditional on that threat model; not a clear always-on must-fix.

## Next Focus
Correct the C8 seam in the ledger: real gap at `getTieredContent` HOT-tier (not getSessionMemories), threat-model-gated. WARM-tier 150-char truncation caps exposure but isn't an escaper.
