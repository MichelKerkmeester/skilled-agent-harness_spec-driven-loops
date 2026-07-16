---
title: "Implementation Summary: Memory MCP to CLI Feasibility [system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/001-spec-memory-cli/000-spec-memory-cli-research/implementation-summary]"
description: "GO verdict shipped: the mk-spec-memory MCP can become a CLI with zero feature loss iff the daemon stays; 3-lane fan-out research (15 iterations) merged with full parity matrix and migration plan."
trigger_phrases:
  - "mcp cli feasibility result"
  - "028 go verdict"
  - "memory cli research outcome"
importance_tier: "important"
contextType: "implementation-summary"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/001-spec-memory-cli/000-spec-memory-cli-research"
    last_updated_at: "2026-06-06T12:15:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Run-4 total risk closure converged 4/20: zero unknowns remain in dual-stack scope"
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
      - "Run 4: all remaining items terminal (2 RESOLVED, 4 MITIGATED-terminal, 2 ACCEPTED); nothing unknown"
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
| **Spec Folder** | 000-spec-memory-cli-research |
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

### Run 4: total risk closure (operator-directed — "nothing unknown")

A single convergence-driven lane (cli-codex, gpt-5.5, reasoning xhigh, service tier fast; cap 20, threshold 0.05) attacked everything still non-terminal after run 3 under a stricter done-definition: DEFERRED stopped being legal for repo-answerable items, and MITIGATED counted only with a fully specified mitigation verified by code-trace or measurement. It converged at **4/20 in 9.4 minutes** (registry 8/8 terminal, score 0.97). Both run-3 deferrals went terminal: the OpenCode `tools:` gate is ACCEPTED upstream-only on installed-1.16.2 evidence (dual-stack does not need it), and the migration map is now MEASURED — 93 files / 1,041 references on a broad counting basis. The run also corrected two prior claims: warm hook-path overhead is ~40–46ms p95 (run 3's "<1ms" was IPC RTT alone), and the default socket path measures 134B pre-pin. Deltas D1–D7+DD-001 were re-derived bottom-up (2.0–2.5d) and the 10–13 day total held. Final posture: **2 RESOLVED · 4 MITIGATED-terminal · 2 ACCEPTED · 0 UNRESOLVED · 0 unexamined hedges**. Matrix: `research/research.md` §14; lane report: `research/risk-closure/lineages/gpt-closure/research.md`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| research/** | Created | Run 1: 3 lane packets (15 iterations), merged registry, attribution, merged research.md |
| research/cli-backend/** | Created | Run 2: codex lane (3 iterations), design synthesis, registry |
| research/risk-resolution/** | Created | Run 3: 2 risk lanes (3+5 iterations), risk matrix, attribution |
| research/risk-closure/** | Created | Run 4: closure lane (4 iterations), terminal classifications, registry |
| spec.md | Modified | Generated findings fence (runs 1–4) + answered questions + Complete status |
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
| Run-4 lane outcome (`risk-closure/orchestration-summary.json`) | PASS — 1/1 succeeded; converged at 4/20 (stopReason convergence, score 0.97); registry 8/8 terminal; post-writeback targeted strict validation PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **MiMo lane independence.** Sequential pooling let the mimo lane read the deepseek lineage; future fan-outs should exclude sibling `lineages/` paths in lane prompts when independence matters. *Run-4 status: ACCEPTED as a methodology note — no implementation risk.*
2. **Registry coverage 1/3 (run 1).** Only the minimax lane wrote a findings registry; deepseek/mimo embedded findings in research.md. The merged research.md is the canonical synthesis. *Run-4 status: ACCEPTED as an artifact note.* Related runner quirk: the fan-out salvage sweep writes small `iteration-N.md` placeholders alongside the canonical zero-padded `iteration-NNN.md` files even on clean runs (observed in runs 3 and 4) — the zero-padded set is canonical.
3. **Effort estimates.** Run 4 re-derived the delta set bottom-up (D1–D7+DD-001 = 2.0–2.5d) and confirmed 10–13 days for dual-stack; routine re-estimation at implementation-packet planning still applies.
4. **The OpenCode `tools:` gate.** Verified on installed OpenCode 1.16.2: no documented first-class shell-subcommand permission gate exists today. ACCEPTED as upstream-only — dual-stack delivery does not require it; it matters only for eventual full MCP removal.
<!-- /ANCHOR:limitations -->
