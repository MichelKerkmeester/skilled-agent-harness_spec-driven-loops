# Iteration 36: Round I Implementation Sketch — Recall-Trust Spine + the ingest-bypass finding (ready-to-spec)

## Focus
Round I: synthesize the recall-trust sub-spine (C8 + injection-filter + redteam-gate) into ONE coherent build + verify the ingest-bypass risk. Read-only.

## Build sketch (newInfoRatio 0.70) — **READY-TO-SPEC** (+ a real security finding)
- **C8_WRAP:** wrap at the recall-CONTENT formatter, NOT the generic `wrapForMCP`/`serializeEnvelope` boundary (`envelope.ts:284-295`) — that serializes EVERY response (would tag errors/status too). Correct site: the memory-content field in the context/search formatter, before `serializeEnvelope`. `body = "<recalled-memory-context>\n" + escapeTags(content) + "\n</recalled-memory-context>"`; `escapeTags` neutralizes literal wrapper/instruction-frame sequences so a poisoned memory can't forge the closing tag. (Confidence on exact formatter line: MEDIUM — confirm the recall formatter file:line at spec time.) Net-new (grep `<recalled`/`escapeTag` = 0 non-test).
- **INJECTION_FILTER:** a SEPARATE NON-destructive `detectInjectionMarkers(text)→{flagged,markers[]}` — do NOT add markers to the destructive `redaction-gate.ts:25-33 PATTERNS` (that replaces text). Flag-only + surface as row metadata; body byte-identical. (Round H7 reference: anchored multi-token phrases benchmarked for zero-FP.)
- **REDTEAM_GATE:** new vitest modeled on the existing `checkpoint-restore-readme-poisoning.vitest.ts` precedent; probes = poisoned-RAG breakout (forged `</recalled-memory-context>` → escaped), markers flagged-not-stripped, zero-success ceiling in BOTH full+compact render.
- **INGEST-BYPASS — CONFIRMED (real security gap):** `memory_ingest_start` → worker `processQueuedJob` (`job-queue.ts:635`) → `indexSingleFile` (`context-server.ts:2190-2200`). The only capture gate (`applyRedactionGate`) is in the after-tool hook (`extraction-adapter.ts:247`), which fires on MCP tool RESULTS, NOT the ingest path. So ingest + file-watcher + startup-scan (all share `indexSingleFile`) **bypass the gate entirely.** → install the injection filter + capture redaction INSIDE `indexSingleFile` (the single shared write chokepoint), NOT the after-tool hook.
- **READINESS:** ready-to-spec.

## Next Focus
The recall-trust spine ships as one coherent build (C8 at the recall formatter + non-destructive flag filter at indexSingleFile + redteam vitest). The ingest-bypass is a real security finding (the capture gate must move to indexSingleFile). Feeds Round J + the roadmap addendum.
