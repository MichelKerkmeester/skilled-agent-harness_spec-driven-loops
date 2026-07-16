---
title: "Feature Specification: command lane integration — register the peer adapter and prove full-corpus convergence"
description: "Registers and configures the sk-doc-command peer adapter as a lane, runs all canonical commands to convergence, and hard-gates raw-delta and reducer agreement so the deterministic verdict is trustworthy."
status: complete
trigger_phrases:
  - "command lane integration"
  - "peer adapter registration"
  - "alignment convergence gate"
  - "raw-delta reducer agreement"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/035-command-surface-benchmark/004-command-lane-integration"
    last_updated_at: "2026-07-14T20:45:00Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded the lane-integration child for the full-corpus deterministic run"
    next_safe_action: "Register the peer adapter lane and run scoping against the command scope"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/deep-alignment/scripts/scoping.cjs"
      - ".opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-doc.cjs"
      - ".opencode/commands/scripts/validate-command-references.cjs"
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 1 -->

# Feature Specification: command lane integration — register the peer adapter and prove full-corpus convergence

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-14 |
| **Parent Spec** | ../spec.md |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

A proven adapter still needs to run as a lane over the whole command corpus and converge with trustworthy state. This phase registers the peer adapter, runs all canonical commands, proves convergence, and hard-gates raw-delta and reduced-report agreement, keeping the peer lane isolated from the generic sk-doc lane.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

**In scope:**
- Register and configure the peer adapter lane via the lane-config adapter discriminator.
- Run all canonical commands through the deterministic lane to convergence.
- Hard-gate raw-delta and reduced-report count and code agreement.
- Keep the peer lane and the generic sk-doc lane off the same scope in one run.
- Register `sk-doc-command` in `AUTHORITY_ADAPTERS['sk-doc']`, finalize and validate `lane-config.json`, and make prompt-pack and LEAF known-deviation suppression resolve by the selected adapter rather than by authority.
- Prove full 36-command convergence at this phase; the 37-command rerun after the launcher ships is owned by closeout.

**Out of scope:**
- Behavioral scenarios, the evaluator, or the model matrix.
- Remediating any command the lane marks failing.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **REQ-001 (P0):** Scoping resolves the peer adapter lane and the run reaches converged true over the full command corpus.
- **REQ-002 (P0):** Raw-delta and reduced-report counts and codes agree exactly, with zero corrupt deltas.
- **REQ-003 (P1):** The peer adapter and the generic sk-doc adapter never run over the same scope in one alignment run.
- **REQ-004 (P1):** A valid deterministic verdict requires full discovered-corpus coverage and no unresolved adapter errors.
- **REQ-005 (P2):** Adapter or runtime errors emit an adapter-error record and are never attributed to the command corpus.
- **REQ-006 (P1):** `sk-doc-command` is allowlisted in `AUTHORITY_ADAPTERS['sk-doc']`, known-deviation suppression resolves by the selected adapter, and scoping and partition tests cover the peer-adapter path.
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- Scoping resolves sk-doc over docs with the command adapter and exits 0.
- The alignment run reaches converged true.
- Raw-delta and reduced counts and codes agree exactly.
- The generic lane runs separately, never on the same scope.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- Peer-lane collision if both adapters share scope, mitigated by running only the command adapter over the command scope.
- Convergence instability on a large corpus, mitigated by the existing stability-window convergence.
- Dependencies: the adapter, scoping, and convergence machinery.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Whether the command corpus needs partitioning for convergence stability at full scale.
<!-- /ANCHOR:questions -->

## PHASE SEQUENCE

Predecessor: 003-command-contract-adapter. Successor: 005-command-behavior-evaluator.
