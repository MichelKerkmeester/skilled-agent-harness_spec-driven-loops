# Iteration 33 (Round N adversarial): content-hash citation + Primitive A — CONFIRMED

## Focus
Adversarially verify the createScanKey mis-citation + that computeContentHash is content-body-only. Read-only.

## Findings (newInfoRatio 0.3) — confirms iteration-018/021
**VERDICT-CITATION: MIS-CITATION HOLDS** (could not refute). `memory-index.ts:281` is unambiguously inside `createScanKey` (`:272`) — `createHash('sha256').update(JSON.stringify(normalized)).digest('hex').slice(0,16)` over scan OPTIONS `{spec_folder,force,incremental,include_constitutional,include_spec_docs}` (`:273-284`). The `.slice(0,16)` confirms the 16-char detail.
**VERDICT-PRIMITIVE-A: CONTENT-BODY-ONLY HOLDS.** `computeContentHash` definition is `crypto.createHash('sha256').update(content,'utf-8').digest('hex')` with signature `(content: string)` — no title/metadata/path folded in (`memory-parser.ts:914-916`). Reused content-agnostically for embeddings/chunks/triggers (`embedding-pipeline.ts:122`). The "folds-in-metadata" refutation has no surface to land on. LEVERAGE M, EFFORT S.

## Most-likely-wrong
Did not separately trace whether `parsed.content` ever carries frontmatter upstream — but that's upstream of the function and doesn't affect "the function folds in no metadata."

## Next Focus
The roadmap mis-citation correction + the two-primitive module (Primitive A = computeContentHash, B = hashJson) are confirmed. Solid ledger items.
