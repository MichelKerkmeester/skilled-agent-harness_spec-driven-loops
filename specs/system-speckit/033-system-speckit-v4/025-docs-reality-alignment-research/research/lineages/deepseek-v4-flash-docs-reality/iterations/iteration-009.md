# Iteration 9: Broaden — references/workflows and references/debugging retired-capability scan

## Focus

Broaden pass over `references/workflows/**` and `references/debugging/**` for retired capabilities (vector DB indexing, embedding queues, MCP scripts) still framed as live workflow steps.

## Findings

### F9-01 — execution-methods.md lists live workflow steps that re-index into a retired vector database (P1 misleading)

**Doc claim (quoted):** `references/workflows/execution-methods.md:234` — "| **11** | Semantic Indexing | Re-index the updated packet docs in the vector database |"; `:237` — "| **12** | Retry Processing | Process any pending embeddings from retry queue |". Step 9.5 (`:231`) "State Embedding — Embed `_memory.continuity` into the routed packet docs."

**Actual behavior:** The vector database and embedding/indexing queue were decommissioned. `runtime/database/` is empty and there is no vector store in `runtime/` (`find runtime -iname "*vector*"|"*.sqlite*"|"*vectordb*"` yields no store). `references/memory/memory-system.md:9` declares "Vector and BM25 fusion — Gone" and "Access tracking — Gone." The save flow (`generate-context.js`) writes canonical continuity and does not re-index into a vector DB, and there is no retry queue of pending embeddings. Steps 9.5 ("State Embedding" — this may mean embedding the continuity payload into packet docs, ambiguous), 11 and 12 therefore describe steps the decommissioned pipeline no longer performs.

- Doc: [SOURCE: references/workflows/execution-methods.md:231,234,237]
- Actual: [SOURCE: runtime/database/] (empty); [SOURCE: references/memory/memory-system.md:9]
- Severity: P1
- One-line fix: drop or re-scope step 11 (vector-DB re-index) and step 12 (embedding retry queue) to the lexical/packet-docs save flow; keep 9.5 only if it correctly describes writing `_memory.continuity` into packet docs.

## Sources Consulted

- references/workflows/execution-methods.md:220-245 (workflow step table 11/12)
- references/workflows/rename-pattern.md:75 (cross-checked: `skill_graph_compiler.py` EXISTS — validated, not a finding)
- references/workflows/intake-contract.md, auto-mode-contract.md (no retired-capability terms)
- references/debugging/troubleshooting.md, universal-debugging-methodology.md (no retired memory/daemon references)
- runtime/database/ (empty); runtime/ (no vector store); references/memory/memory-system.md:9

## Assessment

- newInfoRatio: 0.8
- Novelty justification: F9-01 is a new retired-capability-as-live-step finding in the workflows group; the debugging references were clean, and the rename-pattern cross-skill path checks out, so only one finding here.
- Confidence notes: F9-01 confirmed by the empty `runtime/database/` + absence of a vector store + the declared loss table. The rename-pattern path was re-verified from repo root (it exists) and correctly NOT flagged.

## Reflection

- What worked: a whole-group grep for deployed-capability verbs (vector/embed/daemon/mcp) across workflows+debugging surfaced only the one stale flow; empty `runtime/database/` confirms no vector store to re-index.
- What failed: two apparent leads resolved to non-issues — `skill_graph_compiler.py` exists (cwd shadowing made it look missing), and `semantic-summarizer`/`semantic-signal-extractor` are still-present code with a live consumer (skill-advisor), so they are not vestigial retrieval.
- Ruled out: rename-pattern.md:75 cross-skill path (exists); semantic-summarizer/signal-extractor as vestigial (live skill-advisor consumer).

## Recommended Next Focus

[Broaden/final] final de-dup and cross-check pass (iteration 10): reconcile the inventory for near-duplicate findings (F4-01/F6-02 share the /doctor route topic; F7-01 constitutional overlaps F2 retired-capability framing), confirm severity consistency, and verify no finding was missed in the under-audited `references/config` and `references/cli` groups.
