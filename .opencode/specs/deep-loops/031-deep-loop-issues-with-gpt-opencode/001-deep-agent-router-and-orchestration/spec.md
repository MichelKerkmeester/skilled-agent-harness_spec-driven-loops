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
    recent_action: "Transitioned to phase parent; research complete (research/research.md v2); decomposed implementation into 5 child phases (001-005)"
    next_safe_action: "Plan + implement child 001-route-proof-validation first (closes the FIX-5 false-negative), then 002/003/004. 005 stays parked unless 004 fires."
    blockers:
      - "Cited prior research (030/010-gpt-deep-agent-routing, ../001-gpt-deep-agent-routing) and sibling ../002-gpt-routing-fixes do not exist on disk."
    key_files:
      - "research/research.md (v2 synthesis)"
      - "research/iterations/iteration-001.md..iteration-006.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "031-001-phase-parent"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Recover prior-research evidence base OR formally accept axioms as operator-asserted (owned by child 001)."
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
| **Status** | In Progress (research complete; implementation phased) |
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

Make GPT-backed OpenCode reliably invoke the correct deep agent on the first dispatch — correctly, quickly, and without sacrificing Claude's flexibility — via an agent-layer structural fix (smaller blast radius than FIX-5). The completed research (`research/research.md` v2) produced the design + a concrete `deep.md` draft + a 4-mode pre-route edit map + a FIX-5 trigger (with a documented false-negative) + a verification approach. This phase parent decomposes the implementation into 5 single-concern child phases.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. Detailed planning, tasks, checklists, and decisions live in the child phase folders. The completed research artifacts stay at `research/` (workflow-owned; moving them would break the deep-research state-log paths).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:phase-map -->
## 3. PHASE DOCUMENTATION MAP

> Research is complete. Implementation is decomposed into 5 child phases executed in dependency order: **001 → 002 → 003 → 004 → (decision) → 005 only if triggered.**

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| Route-proof validation | `001-route-proof-validation/` | Route-proof validator fields (close FIX-5 false-negative) + prior-research evidence + citation corrections. **Lands first.** | Draft |
| Agent dispatch hardening | `002-agent-dispatch-hardening/` | Land `deep.md` (iter-4 draft) + `.claude` mirror + `Deep Route:` field in `orchestrate.md`. | Draft |
| Command pre-route headers | `003-command-pre-route-headers/` | `Resolved route:` headers across all 4 deep modes (prompt templates + CLI/inline dispatch). | Draft |
| GPT verification smoke | `004-gpt-verification-smoke/` | GPT before/after smoke per mode with route-proof assertions — acceptance gate + FIX-5 escalation decision. | Draft |
| Host hard identity / FIX-5 | `005-host-hard-identity-fix5/` | Host-runtime hard identity (architectural) + FIX-5 process isolation. **Parked** — escalated only if 004's trigger fires. | Parked |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next begins.
- 001 → 002 → 003 → 004 is the hard dependency chain (validation must precede prevention; prevention precedes verification).
- 005 is gated on 004's outcome: unpark ONLY if GPT still produces route-mismatched artifacts after 001+002+003 land.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001 | 002 | Route-proof validator fields land; a schema-valid-but-wrong-mode artifact is rejected | `validate.sh --strict` on 001 + manual wrong-mode rejection test |
| 002 | 003 | `deep.md` routes correctly via mode-registry; orchestrate emits Deep Route field; Claude-flex test PASS | `validate.sh --strict` on 002 |
| 003 | 004 | All 4 deep modes carry pre-resolved route headers; native `agent:` fields preserved | `validate.sh --strict` on 003 |
| 004 | (done / 005) | GPT first-dispatch passes route-proof validation per mode; FIX-5 escalation decision recorded | smoke results in 004 |
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
## 5. OPEN QUESTIONS

- Recover the cited prior-research evidence base (`030/010-gpt-deep-agent-routing`, `../001-gpt-deep-agent-routing`) OR formally accept the mis-route taxonomy as operator-asserted axioms? (owned by child 001)
- Resolve the Codex mirror TOML-location doc contradiction (`agents/README.txt:8` vs `deep-loop-runtime/SKILL.md:253-261`) before claiming REQ-006 parity? (out-of-band, R9)
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Completed research**: `research/research.md` (v2) + `research/iterations/iteration-00{1-6}.md`
- **Research charter**: `research-prompt.md`
- **Phase children**: `001-route-proof-validation/`, `002-agent-dispatch-hardening/`, `003-command-pre-route-headers/`, `004-gpt-verification-smoke/`, `005-host-hard-identity-fix5/`
- **Parent Spec**: `../spec.md`
- **Graph Metadata**: `graph-metadata.json` (`derived.last_active_child_id` pointer)
