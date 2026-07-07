---
title: "Spec: Deep-Loop Router Agent Deprecation"
description: "Phase 002 of packet 036 (command contract compiler). Retire the now-dead deep-loop primary router agent: the compiled-command-contract mechanism (phase 001 + the review/research/context/ai-council rollout) made the /deep:* commands dispatch their leaf agents directly, so the routing hop the deep-loop agent provided is off every live path. Full-delete the three mirror agent files and reword the two orchestrate boundary lines that named it, preserving the positive leaf-dispatch rule."
trigger_phrases:
  - "036 phase 002"
  - "deep-loop router deprecation"
  - "deprecate deep-loop agent"
importance_tier: "medium"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/031-deep-loop-gpt-reliability/007-compiled-contract-compiler/002-deep-loop-router-deprecation"
    last_updated_at: "2026-07-04T12:55:17Z"
    last_updated_by: "claude-code"
    recent_action: "Deleted 3 deep-loop.md mirrors; reworded orchestrate lines; verified parity + no refs"
    next_safe_action: "None -- phase complete"
    blockers: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "036-002-init"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Spec: Deep-Loop Router Agent Deprecation

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-07-04 |
| **Parent Packet** | ../ (036-command-contract-compiler) |
| **Parent Spec** | ../spec.md |
| **Effort** | S |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The `deep-loop` primary router agent resolved a `/deep:*` mode request against `mode-registry.json`, emitted a `Deep Route:` header, and performed one Task dispatch to the resolved leaf. The compiled-command-contract mechanism (phase 001 plus the review/research/context/ai-council rollout) moved that routing into each command body: the compiled contract names its own leaf and dispatch rules, and orchestrate resolves `/deep:*` leaves directly from its registry-backed priority table. The router is therefore off every live execution path — nothing dispatches it, it has no `mode-registry` entry, and orchestrate's own rules already forbade dispatching it — so keeping it is dead surface that a user could still invoke by hand and that misleads readers about how routing works.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

**In scope:** deleting the three `deep-loop.md` runtime mirror agents (`.opencode`, `.claude`, `.codex`); rewording the two `@deep-loop`-specific boundary lines in each of the three `orchestrate.md` mirrors while preserving their positive "dispatch the `/deep:*` leaf directly at depth 1" rule.

**Out of scope:** the 14-agent pointer rewrite and AGENTS.md thinning (separate follow-up); any change to the leaf agents, `mode-registry.json`, the `/deep:*` commands, or the compiled contracts (none reference the router).
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **REQ-001**: Confirm zero live dispatchers of the router before deletion (no `@deep-loop` Task target, no `subagent_type`/`agentType` reference, no `mode-registry` entry, no command-body reference).
- **REQ-002**: Delete `.opencode/agents/deep-loop.md` and `.claude/agents/deep-loop.md` in the same commit so the agent-mirror-sync gate stays green; remove the untracked `.codex/agents/deep-loop.md` local mirror for runtime parity.
- **REQ-003**: Reword the two boundary lines in all three `orchestrate.md` mirrors to drop the dead-agent name while keeping the positive leaf-dispatch rule and a generalized no-intermediary-router guardrail.
- **REQ-004**: Verify `.opencode`↔`.claude` agent-set parity and re-run the mirror-sync checker on the changed paths (exit 0).
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

1. The three `deep-loop.md` mirror files are gone and no live reference to the router remains outside historical spec artifacts.
2. All three `orchestrate.md` mirrors keep the positive leaf-dispatch guidance and no longer name the deleted agent.
3. The agent-mirror-sync checker passes on the changed paths (both tracked mirrors deleted together → no orphan drift).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk / Dependency | Handling |
|---|---|
| Deleting only one tracked mirror orphans the other | REQ-002 deletes `.opencode` + `.claude` together in one commit |
| A human relies on manually typing `@deep-loop` | No quickstart/README/CLAUDE.md documents it as an entrypoint; the `/deep:*` commands are the supported surface |
| A hidden dispatcher still targets the router | REQ-001 sweeps for every dispatch shape before deletion |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None — the dependency map confirmed the router is fully vestigial before deletion.
<!-- /ANCHOR:questions -->
