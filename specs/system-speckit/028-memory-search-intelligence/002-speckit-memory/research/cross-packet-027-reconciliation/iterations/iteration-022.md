# Iteration 22 (Round M): C8 true status post-refutation → REAL RENDER-GAP

## Focus
Resolve C8's status after the L1 ingest-bypass refutation: is there a real unescaped-content render path; is 027's scrubber reusable. Read-only.

## Findings (newInfoRatio 0.6)
**C8-STATUS: REAL RENDER-GAP (BUILD-new, reuse 027's pattern not its seam).** Stronger than Round K assumed.
- The Round-K premise "an escaper exists at `search-results.ts:782`" is **also refuted**: `:782` is merely the `formatSearchResults` signature, and a whole-package grep for `untrusted|escapeXml|<recalled|CDATA|injection` returns **ZERO hits**. No untrusted-XML recall wrapper exists on ANY render path. (Roadmap independently tags C8 "BUILD-new security GAP".)
- Concrete gap: `getSessionMemories` selects `m.*` (carries `content`) and renders via `memory-triggers.ts:655` with no escaper (`working-memory.ts:297-308`). `getSessionPromptContext` selects only title/path/score (no content) → that resume path is structurally low-risk.
- 027's secret scrubber is **write-lane only** (parse-pipeline head, before hash/embed/FTS; every importer is a write path). Its PATTERN (fail-closed pure `string→{scrubbed}` transform at one seam) is reusable, but a NEW render-boundary seam must be built. LEVERAGE M-H, EFFORT M.

## Most-likely-wrong
Did not read `memory-triggers.ts:655`'s body to confirm the `content` column specifically reaches prompt-facing output (vs being projected to title/score like the prompt-context path). → Round N adversarial.

## Next Focus
C8 confirmed real + the concrete render path pinned (getSessionMemories→memory-triggers.ts:655). The reverse-transfer (027 scrubber pattern → C8) is pattern-only. Round N verifies the :655 render body.
