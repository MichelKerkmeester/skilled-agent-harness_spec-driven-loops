---
title: "Phase Parent: Deep-Loop Issues with GPT-backed OpenCode"
description: "Parent packet for fixing deep-skill invocation, routing, and orchestration under GPT-backed OpenCode. Children implement research, validator hardening, and the structural deep-agent router."
trigger_phrases:
  - "gpt deep agent"
  - "deep loop gpt"
  - "deep skills gpt opencode"
  - "deep agent router"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/031-deep-loop-issues-with-gpt-opencode"
    last_updated_at: "2026-07-01T21:15:00Z"
    last_updated_by: "claude-code"
    recent_action: "Packet complete: phases 008-017 implemented, 006 closed"
    next_safe_action: "None -- packet complete"
    blockers: []
    key_files:
      - "goal-prompt.md"
      - "007-gpt-behavioral-hardening-research/research/research.md"
      - "012-gpt-claude-benchmark/benchmark-results.md"
      - "006-host-hard-identity-fix5/decision-record.md"
      - "016-mk-deep-loop-guard-hardening/implementation-summary.md"
      - "017-loop-guard-implementation/implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "031-parent-init"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Phase 007's 9 KQs all answered with file:line evidence across 6 lineages, 2 rounds (research/research.md)."
      - "Phase ordering resolved and executed: 008 (Mode-D + ai-council identity) -> 009 (orchestrate routing) -> 010 (ai-council subagent-only, operator override) -> 011 (plugin) -> 012 (benchmark) -> 013 (FIX-5 checkpoint)."
      - "Should phase 006/FIX-5 unpark? No -- closed by phase 013's gate against phase 012's real benchmark results (zero semantic wrong-mode artifacts, zero route-proof mismatches)."
      - "Phases 014-015 (skill-doc drift audit + remediation) and 016-017 (mk-deep-loop-guard loop-detection research + implementation) closed out the packet's remaining follow-up work."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Phase Parent: Deep-Loop Issues with GPT-backed OpenCode

<!-- SPECKIT_LEVEL: phase -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | phase |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-06-30 |
| **Parent Packet** | None (top-level packet under deep-loops track) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PURPOSE

GPT-backed models running inside OpenCode do not properly invoke deep skills (deep-research, deep-review, deep-context, deep-ai-council). The deep-loop dispatch path relies on prose/prompt contracts rather than a hard runtime identity boundary, so GPT absorbs or misinterprets deep LEAF roles, re-dispatches incorrectly, and is often slower than Claude even in fast mode. This parent packet owns the research and phased implementation that fix deep-skill invocation, routing, orchestration, and adherence for GPT while preserving Claude's flexibility.

### Operator symptom report (2026-07-01, real-world OpenCode usage)

Phases 002-004 (route-proof validation, `deep.md` primary router, `orchestrate.md` Deep Route field, pre-route headers) are code-complete, but phase 005's GPT verification smoke never reached a clean pass — 0/4 command-owned smokes reached a real leaf dispatch (all blocked upstream by `cli-opencode` self-invocation guards). The operator now independently reports the same underlying problem persisting in real usage: GPT is very slow as `@orchestrate` primary agent; frequently fails to invoke the correct deep sub-agent; gets stuck on pre-defined flows (deep-loop commands especially, possibly others); and overthinks, needing literal, deterministic instructions rather than prose/judgment. This is corroborating evidence, not new information — it points at the same gap phase 005 already flagged as unresolved. Full charter for the follow-up investigation: `goal-prompt.md` (this folder) and phase `007` (pending).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:phases -->
## 3. PHASE MAP

> All phases below are flat siblings directly under this parent folder (not nested under `001/`). Prior docs described a nested `001/00N-*` layout that never matched the actual filesystem; this table and the packet's graph-metadata now reflect the real flat structure.

| Phase | Status | Purpose |
|-------|--------|---------|
| `001-deep-agent-router-and-orchestration` | Complete (research) | Owns the completed research (`research/research.md` v2, 6 iterations, 10/10 KQs) that decomposed the implementation into phases 002-006 below. |
| `002-route-proof-validation` | Complete | Route-proof validator fields (closes the FIX-5 false-negative) + prior-research evidence base + citation corrections. Independently re-verified (30/30 vitest, clean typecheck, `validate.sh --strict` PASS). |
| `003-agent-dispatch-hardening` | Complete | `deep.md` primary router (deterministic table lookup) + `.claude` mirror + `Deep Route:` field in `orchestrate.md`. Landed but currently uncommitted/untracked in the working tree. |
| `004-command-pre-route-headers` | Complete | `Resolved route:` headers across all 4 deep modes (research/review/context/council) — prompt templates + CLI/inline dispatch. |
| `005-gpt-verification-smoke` | **Blocked/inconclusive — not a clean pass** | GPT before/after smoke per mode with route-proof assertions. 0/4 command-owned smokes reached a real leaf dispatch — all blocked upstream by `cli-opencode` self-invocation guards before routing behavior could be observed. Does **not** prove phases 002-004 are sufficient; does not disprove it either. |
| `006-host-hard-identity-fix5` | **Closed (2026-07-01)** | Host-runtime hard identity (architectural) + FIX-5 process isolation. Closed by phase 013's gate evaluation against phase 012's real benchmark results: zero semantic wrong-mode artifacts, zero route-proof mismatches. Agent-layer fix (phases 002-004, 008-011) confirmed sufficient. See `decision-record.md` Final Resolution. Reopenable on fresh contrary evidence. |
| `007-gpt-behavioral-hardening-research` | Complete (research) | Six-lineage, two-round research (round 1: `glm-max` + `gpt-fast-high`, 30/30 each; round 2 operator-directed critical re-review: `sonnet-critical`, `glm-critical` partial, `opus-critical`, `gpt-critical`). Final consolidated verdict (`research/research.md`): do not unpark 006/FIX-5 yet (negative gate, very high confidence); keep `ai-council` as `mode: all` (unanimous 6/6 — see 010 for the operator's deliberate override); harden `@orchestrate` NDP-safely via registry delegation; corrected the ai-council route-proof finding (§2: record and validator agree with each other but both disagree with the registry); a detection-only enforcement plugin is feasible; run an external smoke + GPT-vs-Claude benchmark only after the cheaper fixes land. Proposes phases 008-012 (research's own numbering); implemented below as 008-013 after inserting a dedicated ai-council-conversion phase (010) for the operator's override. |
| `008-mode-d-ai-council-identity-fix` | Complete | Replaced the Phase-0 self-classification gate (Mode D) in all 8 `/deep:*` command files with an evidence-based dispatch-context check; reconciled the ai-council route-proof identity (`orchestrate-topic.cjs` + `deep_ai-council_auto.yaml`) toward `mode-registry.json`, both files together (completed live in-flight WIP found on both files rather than duplicating it). `validate.sh --strict` PASS, vitest 76/76 PASS. |
| `009-orchestrate-universal-routing` | Complete | Completed orchestrate's Priority table with the 2 missing deep-mode rows (`@deep-context` priority 2, `@deep-review` priority 7); made the Deep Route field explicitly registry-resolved; added an explicit NDP boundary against dispatching `@deep` itself as a worker. Verified live via `opencode run --agent orchestrate` -- correctly resolved "Agent: @ai-council per §2 Priority 4". Both runtime mirrors updated. |
| `010-ai-council-subagent-only` | Complete | Converted `ai-council.md` from `mode: all` to `mode: subagent` -- **explicit, deliberate operator override** of research's unanimous 6/6 recommendation, documented in `decision-record.md`. Verified live: direct `opencode run --agent ai-council` now correctly rejected; Task-dispatch reachability (orchestrate, general) confirmed still working. Redirected 2 real documentation callers found depending on the removed direct-invoke path. |
| `011-deep-route-guard-plugin` | Complete | Built `.opencode/plugins/mk-deep-loop-guard.js` (`tool.execute.before` hook; renamed 2026-07-01 from `deep-route-guard.js` for `mk-*` plugin-naming convention parity). Live-tested against the real opencode CLI: hook fires correctly; **fail-closed (throw) rejection genuinely blocks dispatch** (confirmed, task status became error); default mutate-and-warn path confirmed not blocking; fail-open guard confirmed (missing registry doesn't accidentally block); non-deep dispatches confirmed unaffected. Kept both warn/reject paths as a configurable toggle. |
| `012-gpt-claude-benchmark` | Complete | External-shell precondition **confirmed satisfied** (this Claude Code shell). Ran live smoke dispatches across 4 modes x 2 models: zero semantic wrong-mode artifacts, zero route-proof mismatches, zero Mode-D recurrences; measured 3-10x GPT latency gap corroborating the operator's original symptom report. Full results in `benchmark-results.md`. |
| `013-fix5-checkpoint` | Complete | Applied research's cross-validated negative gate against phase 012's real results. No trigger condition met on grounds FIX-5 would remedy. **006/FIX-5 closed as "agent-layer fix sufficient."** Packet complete. |
| `014-skill-doc-drift-audit` | Complete | 10-iteration deep-review + 10-iteration deep-research fan-outs (`cli-opencode openai/gpt-5.5-fast`, reasoning=high, `stopPolicy: max-iterations`) audited 45 candidate `SKILL.md`/`references/`/`assets/`/README files for staleness. All 20 iterations independently re-verified by fresh Claude Sonnet 5 agents (zero fabrications). Confirmed 6 real drift clusters: stale `ai-council` direct-invoke guidance across `cli-opencode` docs/templates/playbooks; stale `.opencode/agents/*.toml` mirror claims across 5 deep-loop `SKILL.md` docs (one code-coupled via `deep-improvement/scripts/agent-improvement/scan-integration.cjs:18`); a stale `.opencode/plugins/README.md` entrypoint count missing `mk-deep-loop-guard.js`; and an orchestrate-routing tension in `cli-opencode/SKILL.md:292`. Findings-only; recommended follow-up phase `015-skill-doc-drift-remediation` (now complete). |
| `015-skill-doc-drift-remediation` | Complete | Patched all 6 confirmed drift clusters from phase 014. A dedicated Cluster 6 investigation found orchestrate's `@deep-review` row is load-bearing (`deep-review.md`'s own Caller contract depends on it) -- fixed `cli-opencode/SKILL.md`'s internal self-contradiction instead of touching `orchestrate.md`. Post-fix re-scan found and fixed 13 additional real `.toml`-mirror references beyond phase 014's citation sample, plus a pre-existing `REPO_ROOT` path bug in two sandbox scripts found during live verification. `deep-improvement` vitest suite: 411/413 (2 pre-existing unrelated failures). A follow-up 10-iteration dual-model review (GPT-5.5-fast + GLM-5.2-max, 5/5) confirmed 2 more real residuals (a missed Cluster-1 instance, stale packet-completion metadata) -- both fixed; 1 GLM claim independently verified false and rejected. |
| `016-mk-deep-loop-guard-hardening` | Complete (research) | 5-iteration dual-model research (`gpt-fast-high` 3 iters + `glm-max` 2 iters) on hardening `mk-deep-loop-guard.js` to mechanically detect loop-like repeated `orchestrate`-to-loop-executor dispatches. Both lineages independently converged on session-scoped state + an iteration-aware heuristic. Surfaced and independently re-verified a load-bearing fact: `orchestrate`'s Task dispatches always set `subagent_type: "general"`, which also means phase 011's existing mode-mismatch guard silently no-ops on real `orchestrate`-routed dispatches. Recommended a new phase 017 to implement Option B; done below. |
| `017-loop-guard-implementation` | Complete | Implemented phase 016's Design Option B: `resolveTargetIdentity()` (prompt-text-first identity resolution, fixing the `subagent_type="general"` no-op gap for both checks) + session-scoped, iteration-aware loop-repeat detection (`.opencode/skills/.loop-guard-state/{hex(sessionID)}.json`, new `MK_DEEP_LOOP_GUARD_REJECT_LOOP` env var). Hermetic suite extended (original 8 scenarios + identity/loop/fail-open scenarios, all passing); live re-verified against the real installed `opencode` v1.17.11 host with zero regression in the throw-blocks-dispatch mechanism. Feature catalog (F050) and manual testing playbook (DLR-052) updated. |
<!-- /ANCHOR:phases -->
