---
title: "Implementation Summary: Memory MCP to CLI Feasibility [system-spec-kit/028-memory-mcp-cli-feasibility/implementation-summary]"
description: "GO verdict shipped: the mk-spec-memory MCP can become a CLI with zero feature loss iff the daemon stays; 3-lane fan-out research (15 iterations) merged with full parity matrix and migration plan."
trigger_phrases:
  - "mcp cli feasibility result"
  - "028 go verdict"
  - "memory cli research outcome"
importance_tier: "important"
contextType: "implementation-summary"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-mcp-cli-feasibility"
    last_updated_at: "2026-06-06T09:50:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Run-3 risk resolution cleared the CLI for implementation"
    next_safe_action: "Open the spec-memory CLI implementation packet via speckit:plan"
    blockers: []
    key_files:
      - "research/research.md"
      - "spec.md"
      - "implementation-summary.md"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Zero loss achievable: YES iff the daemon stays; GO with CLI-over-daemon plus auto-spawn"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 028-memory-mcp-cli-feasibility |
| **Completed** | 2026-06-06 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

You now have a decision-grade answer to "can we drop the memory MCP": **GO — a CLI over the existing daemon/IPC socket achieves strict zero feature loss**, while a pure per-invocation CLI provably cannot. Three heterogeneous research lanes (DeepSeek-v4-pro, MiniMax-M3, MiMo-V2.5-Pro) each ran a forced 5-iteration loop on the same five key questions and were merged into one adjudicated synthesis.

### The verdict and its evidence

`research/research.md` carries the merged result: a consolidated 37-tool parity matrix (zero MCP-only tools; 5 already have CLI ports), a per-architecture daemon-dependency loss table, an MCP-affordance replacement design, a ~28-file/~125-reference migration map with the OpenCode `tools:` permission gate as the single critical path, a merged risk register, and a phased ~3-week implementation sequence with feature-flag rollout and 1–2 day rollback.

### Lane disagreement, adjudicated

DeepSeek and MiMo recommended plain CLI-over-daemon; MiniMax recommended hybrid auto-spawn. The merge adopts (b)+auto-spawn: the 2026-06-06 mid-session disconnect showed the daemon stays down after its owner exits until a new launcher connects — auto-spawn-on-connect closes exactly that gap at ~1 day of marginal effort. MiMo's lane was found to be deepseek-informed (it read the sibling lineage dir mid-run) and is weighted as verification, not independent replication.

### Run 2: the CLI back-end design (operator-directed follow-up)

A second forced-3-iteration run (cli-codex, gpt-5.5, reasoning xhigh, service tier fast — 7.8 minutes, 3/3 KQs) turned the GO verdict into a buildable design: compiled `mcp_server/spec-memory-cli.ts` behind a `.opencode/bin/spec-memory.cjs` shim, subcommands generated from the canonical 37 `TOOL_DEFINITIONS` with the existing Zod validation at argv, auto-spawn through the existing launcher, exits 0/1/64/69/75, dual-stack coexistence proven against existing multi-client bridge tests, MCP untouched. 8 file-level changes, 3 new test suites, 8–12 engineering days. Full design: `research/cli-backend/lineages/gpt/research.md`; condensed in `research/research.md` §12.

### Run 3: risk resolution (operator-directed, convergence-driven)

Two lanes (deepseek-v4-pro + mimo-v2.5-pro @ high, convergence 0.05, cap 20) attacked an 11-item risk register with a strict done-definition. Both converged early — 3/20 and 5/20 iterations, every question terminally classified: 7 RESOLVED, 4 MITIGATED, 0 unresolved (the gpt-5.5 escalation gate never fired). Per-call overhead was measured on this host (~50ms warm / ~150ms cold, validating the design assumption), 8 design deltas were produced for the implementation packet, and the consolidated estimate landed at 10–13 engineering days. Verdict: **cleared for implementation**. Matrix in `research/research.md` §13.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| research/** | Created | Run 1: 3 lane packets (15 iterations), merged registry, attribution, merged research.md |
| research/cli-backend/** | Created | Run 2: codex lane (3 iterations), design synthesis, registry |
| spec.md | Modified | Generated findings fence (runs 1+2) + answered questions + Complete status |
| tasks.md, plan.md, implementation-summary.md | Modified | Reconciliation with evidence |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

One `/deep:start-research-loop:auto` fan-out invocation (3 cli-opencode lanes, concurrency 2, forced 5 iterations per lane via terminal caps, convergence pinned to 0). All lanes exited clean: 3/3 succeeded, 15/15 iterations, no salvage events, lane wall-clocks 9.6 / 40.7 / 6.6 minutes. The orchestrator merged registries with lineage attribution, compiled the root synthesis, wrote the bounded findings fence into spec.md, and passed targeted strict validation before completion.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Adjudicated (b)+auto-spawn over plain (b) or (c) | The incident evidence (owner-exit leaves the daemon down until demand) is exactly what auto-spawn closes, at ~1 day marginal cost; plain (b) keeps a MEDIUM availability risk the CLI can retire for free |
| Weighted MiMo as deepseek-informed, not independent | Its report explicitly compares to "the DeepSeek lane" — it read the sibling lineage mid-run; honest attribution beats a fake 2-vs-1 tally |
| Kept forced-5 iteration caps | Both fast lanes would otherwise have legally stopped early; the full budget bought MiniMax's debunks (lease and briefs are not daemon-resident) and the per-runtime affordance matrix |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Pre-run `validate.sh --strict` | PASS (0 errors, 0 warnings) |
| Lane outcomes (`orchestration-summary.json`) | PASS — 3/3 succeeded, 0 failed |
| Forced-5 semantics | PASS — every lane recorded 5/5 iterations, stopReason maxIterationsReached |
| Merge artifacts | PASS — merged registry (18 findings) + fanout-attribution.md present; registry coverage 1/3 lanes (deepseek/mimo carried findings in research.md; noted) |
| Verdict shape (REQ-002) | PASS — parity matrix, loss table, go/no-go with risks + effort in research/research.md |
| Post-writeback targeted strict validation | PASS (0 errors, 0 warnings) |
| Run-2 lane outcome (`cli-backend/orchestration-summary.json`) | PASS — 1/1 succeeded, 3/3 forced iterations, correct topic adopted, design fully file:line-cited |
| Run-3 lane outcomes (`risk-resolution/orchestration-summary.json`) | PASS — 2/2 succeeded; deepseek-risk all-questions-answered at 3/20, mimo-risk all-classified at 5/20 (one stdout salvage, content intact); 100% of register terminally classified |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **MiMo lane independence.** Sequential pooling let the mimo lane read the deepseek lineage; future fan-outs should exclude sibling `lineages/` paths in lane prompts when independence matters.
2. **Registry coverage 1/3.** Only the minimax lane wrote a findings registry (under a non-canonical name, aliased before merge); deepseek/mimo embedded findings in research.md. The merged registry undercounts; the merged research.md is the canonical synthesis.
3. **Effort estimates are research-grade.** 13–16 days (MiniMax) vs 3–4 weeks (DeepSeek/MiMo); treat ~3 weeks as the center until an implementation packet re-estimates.
4. **The OpenCode `tools:` gate is unverified upstream.** The 1–3 week estimate and the 2–3 day shim are designs, not commitments.
<!-- /ANCHOR:limitations -->
