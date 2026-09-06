---
title: "Implementation Summary: memory consumer rewire"
description: "Every live consumer of the memory MCP surface now resolves through the trigger index, the ripgrep recipes, the continuity ladder or the continuity writer, the residue sweep returns zero live records, and the skill advisor keeps its embedder after the shared seam moved off the memory database."
trigger_phrases:
  - "memory consumer rewire"
  - "gate 1 rewire"
  - "continuity writer"
  - "memory tool call sites"
  - "implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/017-memory-database-decommission/002-memory-consumer-rewire"
    last_updated_at: "2026-09-03T09:50:00Z"
    last_updated_by: "claude-code"
    recent_action: "Closed all twelve acceptance rows"
    next_safe_action: "Decide the MCP package fate, then start phase 003"
    blockers:
      - "Logic-sync decision on whether the MCP package survives as the spec-kit engine"
    key_files:
      - "AGENTS.md"
      - ".opencode/skills/system-spec-kit/scripts/core/workflow.ts"
      - ".opencode/skills/system-spec-kit/shared/embeddings/providers/hf-local.ts"
      - ".opencode/skills/system-spec-kit/scripts/retrieval/sweep-memory-residue.mjs"
      - ".opencode/skills/system-spec-kit/scripts/retrieval/fixtures/residue-allowlist.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-03-002-memory-consumer-rewire"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Does the MCP package survive as the spec-kit engine, or is its validation closure extracted before deletion?"
    answered_questions:
      - "The continuity writer is generate-context.js, packet-local, atomic on the metadata pair, with no indexing hand-off"
      - "The shared embedding socket defaults to the model server's own directory, not the memory database"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-memory-consumer-rewire |
| **Completed** | 2026-09-03 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing outside the memory subsystem calls it any more. Gate 1 in AGENTS.md runs the trigger index lookup, every agent in all four runtime roots lost its memory grants and gained the continuity ladder, the command families route retrieval through ripgrep and saves through the continuity writer, the deep-loop workflows persist to lineage-local state, and the save path no longer imports the indexing API or probes for a daemon. A residue sweep with 45 terms over the hidden-aware tree returns zero live records, and every exemption states why it exists and when it expires.

### Consumers rewired

Thirty-four agent and root files across `.opencode`, `.claude`, `.codex` and `.pi`, with the two generated mirrors regenerated from the canonical root. Forty-nine command files across the memory, doctor, speckit and create families, with `/memory:search` as the retrieval front door, `/memory:save` as the writer front door, `/memory:manage` retiring, and the doctor memory routes diagnosing the index, the lookup and ripgrep instead of a daemon. Thirty-nine deep-loop files, where the end-of-run memory save became a continuity write and the per-iteration upsert disappeared because the iteration file was always lineage-local. Forty-two skill documents and twenty spec-kit references, including two references rewritten outright because they were tool references for a surface that no longer exists.

### Seams split

The save workflow keeps the graph-metadata refresh through the package's top-level API and drops the indexing import, the index-scan follow-up and the launcher-lease daemon probe, shrinking the module by 237 lines. The shared embedding provider's socket default moved from the memory database directory to the model server's own directory, and the IPC socket server no longer needs a database directory to resolve its path, so the skill advisor resolves its embedder with the memory database gone. The environment example carries ownership markers on every memory-only and shared row without deleting any.

### Residue sweep

`sweep-memory-residue.mjs` streams ripgrep JSONL for the 41 tool names and four substrings, classifies each hit live, historical or allowlisted, and exits non-zero on any live hit. The allowlist is data: 79 entries, each with a reason, the phase 003 targets phrased to expire when that phase lands. An owner reconciliation ledger records the state of all 588 consumer files the sweep found before the rewire.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `AGENTS.md`, `README.md` | Modified | Gate 1, tool table, save rule and quick reference on the trigger index and conventions |
| `.opencode/agents/*.md`, `.claude/agents/*.md`, `.codex/agents/*.toml`, `.pi/agents/*.md` | Modified | Memory grants removed, continuity ladder and recipes in place, mirrors regenerated |
| `.opencode/commands/{memory,doctor,speckit,create,deep}/**` | Modified | Retrieval and writer front doors, retiring notices, lineage-local deep-loop steps, no memory grants |
| `.opencode/commands/deep/assets/compiled/*.contract.md` | Modified | Recompiled with no memory tool in any allow list |
| `.opencode/skills/system-deep-loop/**` | Modified | Runtime tests on lineage-local state, contract compiler allow lists, docs |
| `.opencode/skills/system-spec-kit/scripts/core/{workflow,daemon-detect}.ts` | Modified | Indexing import, index-scan follow-up and daemon probe removed |
| `.opencode/skills/system-spec-kit/shared/embeddings/providers/hf-local.ts`, `shared/ipc/socket-server.ts` | Modified | Socket defaults independent of the memory database directory |
| `.opencode/skills/system-spec-kit/scripts/retrieval/sweep-memory-residue.mjs`, `fixtures/residue-allowlist.json` | Created | The residue gate and its reasoned exemptions |
| `.opencode/skills/system-spec-kit/{SKILL,README,ARCHITECTURE}.md`, `references/**` | Modified | Retrieval and continuity described without the retired tools |
| `.opencode/skills/{sk-code,sk-doc,cli-external-orchestration,sk-git,mcp-code-mode,sk-vision,system-skill-advisor}/**` | Modified | Live instructions and templates on the successors, advisor references only |
| `.opencode/install-guides/**`, `.env.example` | Modified | Producers name no memory server; env rows carry ownership markers |
| `owner-reconciliation.json` | Created | Ledger for the 588 consumer files |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Eight Opus leaf agents worked disjoint file sets in one wave: agents and root docs, four command families, deep-loop commands and runtime, skill documentation, spec-kit documentation, the save workflow seam, the shared embedding seam, and the sweep script. A network outage killed six of them mid-task; each was resumed in its own transcript against the on-disk state rather than restarted. Two doc agents had swept with an eight-pattern list narrower than the sweep's 45 terms and were sent the exact residual term lists to close. The orchestrator verified every result on disk, made the comment-level and exemption decisions itself, and generated the reconciliation ledger from the sweep, the git state and the allowlist.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The exemption list is data with a reason per entry, and a surviving file is never exempted whole | Silencing a live config to hide one registration line would let real residue in behind it |
| Spec packet documents are exempt from this phase's sweep | They are historical narrative of the work they record, and spec-doc content is the retrofit phase's |
| Phase 003 targets are exempted with expiring reasons instead of being rewritten | This phase deletes nothing, the server stays running as the comparison baseline, and rewriting a file that is deleted next phase is wasted motion |
| The embed socket defaults to the model server's directory, not the advisor's daemon directory | The advisor's daemon socket and the model server's embed socket are different sockets, and only the latter directory has anything binding `hf-embed.sock` |
| Retired tool names in tests survive only as negative guards | A guard that lists what must not reappear is the mechanism that keeps the rewire honest |
| The MCP package's fate is escalated, not absorbed | Validation, metadata refresh and the continuity writer run from modules inside it, so deleting the tree as one unit breaks what the parent says must survive |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `sweep-memory-residue.mjs --json` from the worktree root, final state | live 0, livePaths 0, exit 0, 79 reasoned exemptions |
| Grant scan across four agent roots and all commands | no `mcp__system_spec_memory__` remains |
| Agent mirror checks for codex and pi | PASS, 12 in sync each |
| Trigger index regenerated twice on the rewired corpus | byte-identical, 3,814,782 bytes, 35,481 phrases, 13,597 paths |
| Spec-kit targeted suites (save guard, daemon detect, retrieval, parity, sweep) | 5 files, 110 tests, exit 0 |
| Deep-loop targeted suites (contracts, persistence, reducers) | 101 tests, exit 0 |
| Spec-kit typecheck | 0 errors |
| Advisor proof after the seam split | `advisor_status` exit 0, freshness live, embedder suite 24 passed |
| Continuity writer exercised with no daemon | exit 0, metadata refreshed, no index scan or daemon probe |
| Whole deep-loop runtime suite, final state | 1 failed, 2533 passed, 153 files: the one failure is a cli-devin adapter stress test that spawns the real devin binary, fails on a different case when rerun alone, and touches no file this phase changed |
| Whole spec-kit scripts suite, final state | 42 failed in 9 files, 1340 passed; every failing file reproduces at the pre-phase commit in a fresh worktree or in the untouched main checkout (untracked scratch fixtures, a coverage-graph module absent from the tree, a restart-contract line absent at HEAD), so zero regressions |
| `validate.sh --strict` on this phase | recorded after metadata regeneration |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The package decision is open.** Validation, the metadata refresh and the continuity writer import modules from the MCP package. Phase 003 cannot delete the tree as one unit; the recommended amendment is to delete the engine and keep the package, and it is the operator's call.
2. **Deferred to phase 003 under expiring exemptions:** the five runtime configuration roots, the launcher, plugin, hooks, process-cleanup scripts, the 265 catalog and playbook files, the memory-only tests and CLIs, and the memory server install guide.
3. **Two pre-existing defects were left alone under scope lock:** `deep-model-benchmark-confirm.yaml` does not parse under strict YAML at HEAD either, and two import-policy tests fail in the untouched main checkout.
4. **Unverified payload shape:** the doctor embeddings route now calls the advisor's status tool, and its field names are not confirmed to match the retired server's.
5. **Two items with no owner yet:** the pi extension's CLI fallback to the retired shim, and `cli-offline-smoke.cjs` asserting the retired tool count. Both are phase 003 work.
6. **Frontmatter version fields were not bumped** on the roughly one hundred edited documents, because the briefs preserved frontmatter shape.
<!-- /ANCHOR:limitations -->
