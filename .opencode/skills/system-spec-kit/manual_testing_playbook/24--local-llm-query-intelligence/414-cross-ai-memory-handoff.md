---
title: "414 — Cross-AI memory handoff (one AI stores, another retrieves)"
description: "AI-A (e.g., Claude) saves a memory through Memory MCP. AI-B (e.g., Codex or Gemini via CLI) later queries it. Verifies the local-LLM embedding produces vectors that any MCP-connected AI can find — not just the AI that wrote them."
audited_post_018: true
---

# 414 — Cross-AI memory handoff (one AI stores, another retrieves)

## 1. OVERVIEW

The Memory MCP is designed as a SHARED substrate across AI assistants. Claude saves a memory; later, Codex or Gemini (invoked via CLI) opens a session and uses `memory_search` to find what Claude stored. The embedding produced by the local LLM must be retrievable regardless of which AI initiated the search.

This scenario tests that **storage AI ≠ retrieval AI** does NOT degrade recall. It's the central use case of having a shared Memory MCP at all.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm Memory MCP delivers stored memories across AI consumer boundary.
- Real user request: `Validate that what Claude stores in Memory MCP is retrievable by Codex (or Gemini) in a separate CLI session.`
- AI-to-CLI handoff prompt: `You are Codex / Gemini / claude-code. I am the orchestrating AI. I just saved a memory through Memory MCP. Open a fresh MCP session and find that memory using the trigger phrases I provide. Return rank, score, and content snippet.`
- Expected execution process: orchestrating AI stores, dispatches external CLI with a clean session, external CLI runs `memory_search`, returns top-K, orchestrator verifies the stored memory is in top-3.
- Expected signals: external-CLI top-3 contains the stored memory's parent ID; similarity score ≥ 0.6.
- Desired user-visible outcome: `PASS — Codex retrieved Claude's memory at rank 1 (score 0.84); cross-AI handoff confirmed.`
- Pass/fail: PASS if external CLI returns the memory in top-3 with score ≥ 0.6; PARTIAL if rank 4-10; FAIL if absent from top-10.

---

## 3. TEST EXECUTION

### Phase 1 — Orchestrating AI stores

The orchestrating AI (the one running the playbook) first writes a canonical research-doc file at `<spec-folder>`:

```markdown
---
title: "Cross-AI handoff probe (scenario 414)"
description: "Test memory for cross-AI retrieval validation."
trigger_phrases: ["cross-AI handoff scenario 414", "shared Memory MCP retrieval probe"]
---

Cross-AI handoff test: this memory was stored by Claude during validation scenario 414. The retrieval test verifies any MCP-connected AI (Codex, Gemini, claude-code) can find it via memory_search using the trigger phrases below. Active embedding provider should be local-LLM (llama-cpp + EmbeddingGemma).
```

Then saves it:

```
mcp__mk_spec_memory__memory_save({
  filePath: "<absolute path to the file written above>"
})
```

(Do NOT pass `retentionPolicy: "ephemeral"` — see post-014/022 follow-up note in 401-paraphrase-recall.md.)

Save the returned parent_id as `STORED_ID`. Wait 3 seconds for indexing.

### Phase 2 — External CLI handoff prompt

Invoke an external CLI (rotate through cli-codex, cli-gemini, cli-claude-code across runs):

For **cli-codex**:
```bash
codex exec \
  --model "gpt-5.5" \
  -c model_reasoning_effort="high" \
  -c approval_policy=never \
  --sandbox workspace-write \
  - <<'PROMPT'
You are Codex. I am Claude orchestrating a Memory MCP cross-AI validation. I just saved a memory with trigger phrases ["cross-AI handoff scenario 414", "shared Memory MCP retrieval probe"].

Open a fresh Memory MCP session (your MCP client should already be wired). Then:

1. Call mcp__mk_spec_memory__memory_search({ query: "cross-AI handoff scenario 414", limit: 10 }).
2. Capture top-5 results: rank, score, parent_id, first 100 chars of content.
3. Verify whether a memory whose content references "scenario 414 ... cross-AI handoff" appears.
4. Return JSON:
   {
     "session": "codex-fresh",
     "query": "cross-AI handoff scenario 414",
     "top_5": [{rank, score, parent_id, snippet}],
     "stored_memory_rank": <rank or null>,
     "verdict": "PASS|PARTIAL|FAIL" + rationale
   }
PROMPT
```

For **cli-gemini** / **cli-claude-code**: same prompt template, just substitute the CLI invocation.

### Phase 3 — Verification

The orchestrating AI parses the external CLI's JSON response and confirms:
- The returned `stored_memory_rank` is between 1 and 3.
- The matching parent_id equals `STORED_ID`.
- The similarity score is ≥ 0.6.

Run Phase 2 across all 3 CLIs (rotate) if available, or at least 2.

### Expected

Per CLI:
```
{
  "session": "codex-fresh",
  "query": "cross-AI handoff scenario 414",
  "top_5": [
    { "rank": 1, "score": 0.84, "parent_id": "a1b2...", "snippet": "Cross-AI handoff test: this memory was stored by Claude..." },
    { "rank": 2, "score": 0.52, "parent_id": "c3d4...", "snippet": "..." },
    ...
  ],
  "stored_memory_rank": 1,
  "verdict": "PASS — stored memory found at rank 1 with score 0.84; cross-AI handoff confirmed."
}
```

### Evidence

- The orchestrating-AI memory_save payload + STORED_ID.
- The external-CLI invocation command line per CLI tested.
- The external-CLI verbatim response JSON per CLI tested.
- A summary table across CLIs:
  ```
  | External CLI       | stored_memory_rank | score | verdict |
  |--------------------|--------------------|------:|---------|
  | cli-codex          | 1                  | 0.84  | PASS    |
  | cli-gemini         | 1                  | 0.81  | PASS    |
  | cli-claude-code    | 2                  | 0.69  | PASS    |
  ```
- Active provider at time of test from `memory_health` (same DB, both AIs should see the same data).

---

## 4. NOTES

- Each external-CLI session SHOULD use its own MCP client process, but read from the same active profile DB (since the DB is workspace-local).
- A FAIL here points to a SERIOUS issue: either the DB isn't shared correctly (each CLI is opening its own DB), the embedding rendering differs across MCP clients (shouldn't, since embeddings are persisted in the DB), or the trigger-phrase routing is AI-session-dependent (it shouldn't be).
- PARTIAL (rank 4-10) is acceptable if the corpus is large — drift down the ranking is normal when there's a busy index.

## 5. CLEAN-UP

```
mcp__mk_spec_memory__memory_delete({ parent_id: STORED_ID })
rm -rf <spec-folder>
```
