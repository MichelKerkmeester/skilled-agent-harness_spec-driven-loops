---
title: "Phase Parent: Deep-Agent Router & Orchestration Hardening (GPT-backed OpenCode)"
description: "Phase parent owning the completed research plus the phased implementation of the DEEP router, orchestrate hardening, pre-route headers, and GPT verification. Research is complete; implementation is decomposed into 5 single-concern child phases."
trigger_phrases:
  - "deep primary agent"
  - "gpt deep agent router"
  - "orchestrate deep loop"
  - "deep agent invocation"
  - "gpt deep skills slow"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/031-deep-loop-issues-with-gpt-opencode/001-deep-agent-router-and-orchestration"
    last_updated_at: "2026-06-30T15:00:00Z"
    last_updated_by: "opencode-gpt"
    recent_action: "Research complete; implementation decomposed into flat sibling phases 002-007"
    next_safe_action: "See ../spec.md phase map for current status"
    blockers:
      - "Cited prior research (030/010-gpt-deep-agent-routing, ../001-gpt-deep-agent-routing) and sibling ../002-gpt-routing-fixes do not exist on disk."
    key_files:
      - "research/research.md (v2 synthesis)"
      - "research/iterations/iteration-001.md..iteration-006.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "031-001-phase-parent"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Recover prior-research evidence base OR formally accept axioms as operator-asserted (accepted as axioms per 002-route-proof-validation/decision-record.md)."
    answered_questions:
      - "Research KQ1-KQ10 answered + deepened (research/research.md v2)."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Phase Parent: Deep-Agent Router & Orchestration Hardening (GPT-backed OpenCode)

<!-- SPECKIT_LEVEL: phase -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | phase |
| **Priority** | P0 |
| **Status** | Complete (research) — implementation lives in flat sibling phases 002-006 under the 031 parent, not nested under this folder |
| **Created** | 2026-06-30 |
| **Parent Packet** | `deep-loops/031-deep-loop-issues-with-gpt-opencode` |
| **Research** | COMPLETE — `research/research.md` (v2, 6 iterations, 10/10 KQs) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

GPT-backed models running inside OpenCode do not properly invoke deep skills (deep-research, deep-review, deep-context, deep-ai-council). The root cause — a soft identity boundary (`subagent_type` normalized to `"general"`, identity prompt-injected) — was researched and is treated as an operator-asserted axiom (the cited prior-research evidence base is missing from disk; see integrity caveat in `research/research.md` §0). Three mis-route modes (A/B/C) and the FIX-5 structural-prevention ceiling frame the work.

### Purpose

Make GPT-backed OpenCode reliably invoke the correct deep agent on the first dispatch — correctly, quickly, and without sacrificing Claude's flexibility — via an agent-layer structural fix (smaller blast radius than FIX-5). The completed research (`research/research.md` v2) produced the design + a concrete `deep.md` draft + a 4-mode pre-route edit map + a FIX-5 trigger (with a documented false-negative) + a verification approach. This research phase informed the implementation, which was decomposed into single-concern phases 002-006 living as flat siblings of this folder directly under the `031-deep-loop-issues-with-gpt-opencode` parent (not nested here).

> **Structural note (corrected 2026-07-01):** this folder is a regular completed phase, not a nested phase-parent — the `031` root is the packet's sole phase parent, with 001-006 (and 007, pending) as its flat children. Prior versions of this doc described a `001/00N-*` nested layout that never matched the actual filesystem; that description has been corrected packet-wide (see `031/spec.md` §3 and each phase's `graph-metadata.json`).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

The research that produced the DEEP primary router design, orchestrate hardening design, pre-route edit map, FIX-5 trigger criterion, and verification approach — all now decomposed into and executed as phases 002-007 (see PHASE DOCUMENTATION MAP below).

### Out of Scope

- Anything outside GPT-backed OpenCode deep-loop dispatch (this packet does not touch unrelated agent/skill behavior).
- Implementation itself — that lives in the child phases, not in this research phase.

### Files to Change

Audit-trail only; per-phase detail lives in each child's own plan.md.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.opencode/agents/deep.md`, `.claude/agents/deep.md` | Create | 003 | DEEP primary router + Claude mirror |
| `.opencode/agents/orchestrate.md`, `.claude/agents/orchestrate.md` | Modify | 003 | `Deep Route:` field |
| 4x deep prompt/YAML seams | Modify | 004 | `Resolved route:` headers |
| `post-dispatch-validate.ts` + tests | Modify | 002 | Route-proof validator fields |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> Research is complete. Implementation was decomposed into single-concern phases living as flat siblings of this folder under the `031` parent, executed in dependency order: **002 → 003 → 004 → 005 (acceptance gate) → (decision) → 006 only if triggered → 007 (follow-up research, now pending on real-world evidence).**

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| Route-proof validation | `../002-route-proof-validation/` | Route-proof validator fields (close FIX-5 false-negative) + prior-research evidence + citation corrections. | Complete |
| Agent dispatch hardening | `../003-agent-dispatch-hardening/` | Land `deep.md` (iter-4 draft) + `.claude` mirror + `Deep Route:` field in `orchestrate.md`. | Complete |
| Command pre-route headers | `../004-command-pre-route-headers/` | `Resolved route:` headers across all 4 deep modes (prompt templates + CLI/inline dispatch). | Complete |
| GPT verification smoke | `../005-gpt-verification-smoke/` | GPT before/after smoke per mode with route-proof assertions — acceptance gate + FIX-5 escalation decision. | **Blocked/inconclusive** — 0/4 command-owned smokes reached a real leaf dispatch |
| Host hard identity / FIX-5 | `../006-host-hard-identity-fix5/` | Host-runtime hard identity (architectural) + FIX-5 process isolation. | Parked (interim) — trigger not met, but evidence is inconclusive, not a clean disproof |
| GPT behavioral hardening research | `../007-.../` (pending) | Follow-up deep-research on real-world operator symptoms: ai-council subagent-only, `@orchestrate` hardening, sub-agent-enforcement plugin, GPT-vs-Claude benchmark, 006 unpark decision. | Planned |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next begins.
- 002 → 003 → 004 is the hard dependency chain (validation must precede prevention; prevention precedes verification).
- 005 is the acceptance gate; 006 is gated on 005's outcome: unpark ONLY if GPT still produces route-mismatched artifacts after 002+003+004 land. 005's actual result was inconclusive (blocked before real leaf dispatch in all 4 modes), so this gate has not yet been decisively resolved either way.
- 007 investigates whether real-world operator evidence changes that interim call, and expands scope beyond the original 5-phase plan (ai-council conversion, further orchestrate hardening, an enforcement plugin, benchmarking).

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 002 | 003 | Route-proof validator fields land; a schema-valid-but-wrong-mode artifact is rejected | `validate.sh --strict` on 002 + manual wrong-mode rejection test |
| 003 | 004 | `deep.md` routes correctly via mode-registry; orchestrate emits Deep Route field; Claude-flex test PASS | `validate.sh --strict` on 003 |
| 004 | 005 | All 4 deep modes carry pre-resolved route headers; native `agent:` fields preserved | `validate.sh --strict` on 004 |
| 005 | (006 / 007) | GPT first-dispatch passes route-proof validation per mode; FIX-5 escalation decision recorded | smoke results in 005 (result: inconclusive, not a clean pass) |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:scope -->
## 4. AGGREGATE SCOPE (audit trail — per-phase detail lives in each child)

### Files touched across all phases

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `deep_*_auto.yaml` validator blocks | Modify | 001 | Add route-proof fields to iteration/delta records |
| `.opencode/agents/deep.md` | Create | 002 | DEEP primary router (iter-4 draft) |
| `.claude/agents/deep.md` | Create | 002 | Claude mirror |
| `.opencode/agents/orchestrate.md` | Modify | 002 | `Deep Route:` field for deep targets |
| `.claude/agents/orchestrate.md` | Modify | 002 | Claude mirror |
| 4× prompt templates + 4× YAML dispatch | Modify | 003 | `Resolved route:` headers per mode |
| (none — procedure doc) | Create | 004 | verification-smoke.md |
| (deferred — host runtime) | — | 005 | PARKED until triggered |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Recover the cited prior-research evidence base (`030/010-gpt-deep-agent-routing`, `../001-gpt-deep-agent-routing`) OR formally accept the mis-route taxonomy as operator-asserted axioms? Resolved: accepted as axioms (`../002-route-proof-validation/decision-record.md`).
- Resolve the Codex mirror TOML-location doc contradiction (`agents/README.txt:8` vs `deep-loop-runtime/SKILL.md:253-261`) before claiming REQ-006 parity? (out-of-band, R9 — still open)
- Should phase 006/FIX-5 unpark given real-world operator evidence now corroborates phase 005's inconclusive result? (owned by phase 007)
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Completed research**: `research/research.md` (v2) + `research/iterations/iteration-00{1-6}.md`
- **Research charter**: `research-prompt.md`
- **Sibling phases** (flat, under `031` parent, not nested here): `../002-route-proof-validation/`, `../003-agent-dispatch-hardening/`, `../004-command-pre-route-headers/`, `../005-gpt-verification-smoke/`, `../006-host-hard-identity-fix5/`, `../007-...` (pending)
- **Parent Spec**: `../spec.md`
- **Goal / follow-up charter**: `../goal-prompt.md`
- **Graph Metadata**: `graph-metadata.json` (`derived.last_active_child_id` pointer)
