---
title: "Implementation Plan: Phase 2: cli-jev-skill-packet"
description: "Author the cli-jev packet from phase 001's pinned contract: a transport SKILL.md whose rules name their enforcing checks, four references that carry the contract without restating it, and the supporting assets a mode folder needs."
trigger_phrases:
  - "implementation plan"
  - "approach and phases"
  - "testing strategy"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/074-cli-jev-creation/002-cli-jev-skill-packet"
    last_updated_at: "2026-09-20T10:10:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Plan executed as written"
    next_safe_action: "None; the phase is complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-074-002-cli-jev-skill-packet"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 2: cli-jev-skill-packet

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| Artifacts | Eleven Markdown documents under `cli-jev/` |
| Contract source | Phase 001's references and probe transcripts, never a fresh reading of the vendor's README |
| Enforcement | Named check ids only; implementations land in phase 003 |
| Layout | The hub's existing mode layout, so the packet is indistinguishable in shape from its seven siblings |

### Overview

Declare, then prove the declaration is enforceable. Each rule is written with the check id that implements it, so the packet cannot claim a rule the hook does not enforce. The references carry the contract once; the `SKILL.md` links them rather than paraphrasing, so a contract change has one place to land.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- Phase 001 closed, with every claim tagged and the exit-code matrix captured
- The classification settled: transport, with `mutatesWorkspace: false` and `Write`/`Edit`/`Task` forbidden

### Definition of Done

- All eight rule ids resolve against the implemented check registry
- The documentation gate passes over the packet's references
- No instruction anywhere in the packet asks a reader to place a credential on a command line
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

One contract, four views. `SKILL.md` states the mode and its rules; `cli-reference.md` holds the command surface; `providers-and-models.md` holds the credential and provider surface; `integration-patterns.md` holds the shapes a caller composes; `mcp-server.md` holds the other entry point. The assets card holds the part no rule can check — how to write the question.

### Key Components

| Component | Responsibility |
|-----------|----------------|
| `SKILL.md` | Classification, rules, references, success criteria |
| `references/cli-reference.md` | Subcommands, flags, state forms, exit taxonomy |
| `references/providers-and-models.md` | Providers, key resolution, translation, unconfirmed set |
| `references/integration-patterns.md` | Gate, triage, branch and batch patterns |
| `references/mcp-server.md` | The four-tool surface and the operator step |
| `assets/question-shaping-card.md` | Question construction per judgment type |

### Data Flow

Phase 001 evidence → references → `SKILL.md` rule text → phase 003's checks. The dependency runs one way: a check is written to enforce a rule the packet declares, and the CI guard fails if either side is missing.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

| Phase | Name | Outcome |
|-------|------|---------|
| 1 | Classification and rules | The mode's kind, tool surface and eight rule ids |
| 2 | References | The four contract views, versioned and tagged |
| 3 | Assets and scaffolding | The card, README, changelog, benchmark and playbook root |
| 4 | Gate run and fixes | The documentation gate clean, ids resolved |
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The packet is verified by the guards that read it: the declared-rule resolver, the frontmatter-version gate, and the per-hub gate that checks a mode's folder shape. Each is re-run after the last edit rather than after the first, because a packet is read as a whole.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Why it matters | If unavailable |
|------------|----------------|----------------|
| Phase 001 evidence | The references quote it | Without it the references could only restate the vendor's README, which is the failure this packet avoids |
| The dispatch check registry | Rule ids must resolve | A rule without a check would have to be dropped or the rule list would ship unenforced |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Delete `cli-jev/`. Nothing else in the hub references the packet until phase 003 registers it, so removing the folder restores the previous state exactly; the seven existing modes never read it.
<!-- /ANCHOR:rollback -->
