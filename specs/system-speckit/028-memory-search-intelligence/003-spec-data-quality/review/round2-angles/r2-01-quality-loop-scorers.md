# R2-01 quality-loop scorers (code-quality)

Angle summary: the pure scorer is genuinely pure and reusable as 001 claims and the destructive trim the specs flag is real, but the scorer is markdown-body-shaped so reusing it verbatim on metadata JSON yields a degenerate content-insensitive verdict, and the QUALITY_WEIGHTS give the highest weight to the one optional dimension.

Scope checked: `mcp_server/handlers/quality-loop.ts` in full (computeMemoryQualityScore, the four scorers, attemptAutoFix, runQualityLoop), `mcp_server/lib/search/search-flags.ts:180,393`, the live caller `mcp_server/handlers/memory-save.ts:528`, plus the 005 parent `research/research.md`, `spec.md`, and the 001 child `spec.md` / `plan.md`.

---

## FINDING 1 (P1) — pure scorer is markdown-body-shaped, so the 001 verbatim reuse on JSON is degenerate

The 001 keystone premise is that `computeMemoryQualityScore` is reused verbatim on the metadata-JSON surface and that "the authored-surface verdict cannot diverge from the memory-surface verdict" (001 `spec.md:152`, REQ-005 `spec.md:117`). H1 serializes each JSON payload into the scorer `content` argument and passes the JSON object as `metadata` (001 `plan.md:87`, `spec.md:73`). The live scorer was built for markdown memory bodies and three of its four dimensions degrade to near-constants on serialized JSON:

- `scoreAnchorFormat` returns a flat 0.5 neutral when no `<!-- ANCHOR -->` tags exist (`quality-loop.ts:156-159`). JSON never carries those tags, so this 0.30-weighted dimension is a constant 0.15 on every JSON.
- `scoreCoherence` awards 0.25 only when `HEADING_PATTERN` (`^#{1,3}\s+`, `quality-loop.ts:11,290-294`) matches. Serialized JSON has no markdown heading, so coherence is permanently capped at 0.75.
- `scoreTriggerPhrases` reads camelCase `metadata.triggerPhrases` (`quality-loop.ts:104`), but the JSON surface stores snake_case `trigger_phrases` (`graph-metadata.json:42`). A verbatim object pass resolves `triggerPhrases` to undefined, so the trigger count is 0 and the trigger score is 0.

Net effect for a graph-metadata.json: triggers 0, anchors 0.5, budget ~1.0, coherence 0.75, total approximately `0*0.25 + 0.5*0.30 + 1.0*0.20 + 0.75*0.25 = 0.5375`. Every graph-metadata.json scores roughly 0.54 regardless of its actual content, below the default 0.6 threshold, for structural reasons that have nothing to do with quality. The reused verdict on the JSON surface is noise, not signal, which hollows out the keystone's "cannot diverge" guarantee.

- Evidence (live code): `quality-loop.ts:104,156-159,290-294,11`; `graph-metadata.json:42`.
- Evidence (spec premise): 001 `spec.md:73,117,152`; 001 `plan.md:87`.
- Type: SPEC-PREMISE issue (001 keystone reuse plan), grounded in LIVE-CODE scorer behavior.

---

## FINDING 2 (P2) — QUALITY_WEIGHTS give the highest weight to the only optional dimension

`QUALITY_WEIGHTS` is `triggers 0.25, anchors 0.30, budget 0.20, coherence 0.25` (`quality-loop.ts:74-79`). The sum is exactly 1.00 so the composite stays in [0,1], which is correct arithmetic. The weighting is incoherent against the stated retrieval-quality goal. The dimension with the single highest weight is anchors, which the code itself documents as optional and scores a neutral 0.5 when absent (`quality-loop.ts:129,156-159`). Meanwhile triggers, the only dimension tied to actual retrieval through `memory_match_triggers` and documented as "memory will never surface" at count 0 (`quality-loop.ts:94`), carries just 0.25.

Live consequence: a memory with zero trigger phrases, no anchors, and substantial body scores `0*0.25 + 0.5*0.30 + 1.0*0.20 + 1.0*0.25 = 0.60`, which clears the default 0.6 threshold at `runQualityLoop` (`quality-loop.ts:587,614`) before auto-fix even runs. The gate passes a memory the trigger scorer itself calls retrieval-dead.

- Evidence (live code): `quality-loop.ts:74-79,94,129,156-159,587,614`.
- Type: LIVE-CODE issue (weighting and threshold coherence).

---

## FINDING 3 (P1) — the destructive substring-trim the specs flag is real and is reached LIVE default-ON

The risk flagged across the 005 docs is accurate. `attemptAutoFix` trims content with `substring(0, DEFAULT_CHAR_BUDGET)` to an 8000-char budget (`quality-loop.ts:463-468`, budget derived at `:82-85`). The 005 docs cite this exactly (`research/research.md:63`, parent `spec.md:79`, governance `research/lineages/dq-governance-rollout/research.md:24` names `quality-loop.ts:463-468`). It is not hypothetical machinery. `runQualityLoop` is the live memory-save path (`memory-save.ts:528`) and both gates default TRUE (`search-flags.ts:180,393`), so on the memory surface a note over 8000 chars is silently amputated and the trimmed body is returned as `fixedContent` on the pass path (`quality-loop.ts:660-673`) for the caller to persist. The fallback when no newline sits inside the first 8000 chars is a hard mid-line cut (`quality-loop.ts:466-467`, `lastNewline > 0` is false, returns the raw 8000-char slice).

This confirms the spec premise and validates 001 REQ-002 (`spec.md:109`, no path reaches `runQualityLoop` or `attemptAutoFix`) as the correct guard for the authored surface. The under-examined part is that the amputation already exists on the live memory surface itself, which the program quarantines but does not propose repairing.

- Evidence (live code): `quality-loop.ts:463-468,82-85,660-673`; `memory-save.ts:528`; `search-flags.ts:180,393`.
- Evidence (spec premise confirmed): `research/research.md:63`; `spec.md:79`; `dq-governance-rollout/research.md:24`.
- Type: SPEC-PREMISE confirmed against LIVE-CODE, plus a LIVE-CODE silent-data-loss path on the memory surface.

---

## FINDING 4 (P2) — autofix ordering lets a single pass re-exceed the budget it just trimmed to

The O2-6 comment (`quality-loop.ts:457-458`) sequences Fix #3 trim before Fix #2 anchor-close so the trim does not strip freshly appended closers. The closers are still appended at the very end of content, past the 8000 boundary (`normalizeAnchors`, `quality-loop.ts:560-564`). So when both a budget issue and an unclosed-anchor issue fire in the same `attemptAutoFix` call, the content is cut to budget and then grows back beyond budget by one closer line per unclosed anchor. A single autofix pass does not guarantee budget compliance, and the re-score then re-flags budget. The loop is bounded by `maxRetries` so this self-corrects rather than runs away, but it means the trim is not idempotent within one pass.

- Evidence (live code): `quality-loop.ts:457-477,560-564`.
- Type: LIVE-CODE issue (autofix ordering, low blast radius).

---

## What is sound

- `computeMemoryQualityScore` (`quality-loop.ts:392`, export `:747`) is genuinely pure: no I/O, no input mutation, no `Date.now`/random, deterministic given (content, metadata). The 001 claim that it can be imported and reused verbatim is mechanically correct (file:line citations in 001 `plan.md:104` match the live tree).
- `QUALITY_WEIGHTS` sum to 1.00, so the composite total is correctly bounded.
- The best-state tracking in `runQualityLoop` (`quality-loop.ts:636-658`) does revert to the higher-scoring content on rejection, which limits the trim's reach on the soft-reject path.
