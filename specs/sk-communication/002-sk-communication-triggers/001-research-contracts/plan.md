---
title: "Research Plan: Phase 1: research and contracts"
description: "Plan for verifying the activation gate, entrypoint, providers, rubric, cli roster, authoring standard, mirror model, and dispatch contract for the trigger commands."
importance_tier: "normal"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "sk-communication/002-sk-communication-triggers/001-research-contracts"
    last_updated_at: "2026-08-19T04:41:42Z"
    last_updated_by: "claude"
    recent_action: "Planned the contract verification"
    next_safe_action: "Author the commands from the contracts"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-001-research-contracts"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
trigger_phrases: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Research Plan: Phase 1: research and contracts

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Read the shipped sk-communication package and skill, the sk-create-command standard, and the cli-devin dispatch contract to verify every fact the two trigger commands depend on. Record the findings, file-anchored, in `research/research.md`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- Each load-bearing claim cites a file path or command output.
- The default-off invariant and the projection invariant are stated precisely.
- The dispatch model id is confirmed present in the runtime allowlist.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Read-only investigation across four areas: the enablement gate and pipeline, the runnable entrypoint and provider registry, the command-authoring standard and cross-runtime mirror model, and the cli-devin dispatch path and model allowlist.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

- `research/research.md` (new). No runtime surface is modified by this phase.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Verify the activation gate and pipeline invariants.

### Phase 2: Core Implementation
- [x] Verify the runnable entrypoint and the local/hosted provider families.
- [x] Verify the authoring standard, the cli roster, and the mirror model.
- [x] Verify the dispatch contract (devin installed/authed, model in allowlist).

### Phase 3: Verification
- [x] Record all findings in `research/research.md` with file anchors.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- Confirm each cited symbol or path exists via grep/read.
- Confirm `gemini-3-7-flash-high` appears in the runtime allowlist and `devin auth status` reports logged in.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Shipped sk-communication package and skill.
- sk-create-command standard; cli-devin SKILL and runtime.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Delete `research/research.md`. The phase writes no runtime code, so removal fully reverts it.
<!-- /ANCHOR:rollback -->
