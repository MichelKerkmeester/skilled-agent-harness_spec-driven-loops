---
title: "Implementation Plan: loose command ID naming (032 phase 008/013/008)"
description: "Resolve the loader contract, classify root command filenames, and close path references without changing public command IDs or tool contracts."
trigger_phrases:
  - "loose command naming plan"
  - "root command filename plan"
  - "command ID preservation plan"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/008-component-migration/013-commands/008-loose-command-ids"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/008-component-migration/013-commands/008-loose-command-ids"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored loose command plan"
    next_safe_action: "Build the root filename disposition map"
    blockers: []
    key_files:
      - ".opencode/commands/agent_router.md"
      - ".opencode/commands/goal_opencode.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Implementation Plan: Loose command ID naming

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

Separate three facts for each root command: its physical basename, its public slash-command ID, and any tool/plugin path contract. Resolve those facts against the loader, classify both underscore names, perform only approved physical moves, and then update exact path consumers without rewriting IDs.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [ ] Candidate, control, consumer, and contract inventories are complete.
- [ ] The actual active loader or authoritative test behavior is available for review.
- [ ] No candidate is assigned a rename before its ID and tool disposition are evidence-backed.

### Definition of Done

- [ ] Both candidate dispositions and the compliant control are recorded in the frozen map.
- [ ] Approved path consumers resolve to final targets while public IDs and tool names remain unchanged.
- [ ] Command discovery, exact-ID invocation, plugin tests, collision checks, and old-path search pass.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

The command filesystem is a discovery surface, while `/agent_router` and `/goal_opencode` are user-facing identifiers and `mk_goal`/`mk_goal_status` are tool contracts. The migration map must keep these namespaces distinct. A filename may move only if the loader preserves the identifier or an explicit compatibility mapping is part of the existing contract; this phase does not invent such a mapping.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [ ] Capture BASE listings and search all root command, install-guide, plugin-test, loader, and tool-path references.
- [ ] Verify how filenames become command IDs and how the goal plugin locates its command document.

### Phase 2: Implementation

- [ ] Record one disposition for `agent_router.md` and `goal_opencode.md`; retain `prompt-improve.md` as the compliant control.
- [ ] For approved moves, rename the file, update exact path consumers, and preserve public ID strings and tool names.

### Phase 3: Verification

- [ ] Run command discovery and exact invocation of each preserved public ID.
- [ ] Run goal-plugin capability/path tests and search for active old paths.
- [ ] Hand loader evidence, disposition rows, collision results, and path closure to `010-commands-gate`.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Required evidence includes command-loader discovery, exact invocation of each preserved public ID, the goal plugin path/capability tests, a repository-wide search separating active paths from historical text, and a casefold/NFC collision check for each target. If either file is classified tool-mandated, the evidence must show why the exact underscore basename is exempt.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Naming rules and exemption set | Internal | Required | A root filename could be moved despite a tool-mandated contract. |
| Loose command inventory | Local | Required | Candidate and control rows could be incomplete. |
| Goal plugin consumers | Local | Required | The physical goal path could remain stale or unsupported. |
| `010-commands-gate` rollup | Internal | Required for handoff | The final disposition lacks a blocking acceptance owner. |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Before any approved move, capture both source files, their consumer list, and the loader/test baseline. If command discovery or plugin tests regress, restore only the affected root file and its path references to BASE, then retain the disposition as blocked until the contract discrepancy is resolved.
<!-- /ANCHOR:rollback -->
