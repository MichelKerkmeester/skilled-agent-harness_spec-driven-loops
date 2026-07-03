---
title: "Spec: Root-Policy Injection Slimming (P2)"
description: "Phase 010 of packet 035 (implement 034 GPT-reliability fixes). Closes findings F-027, F-029 (effort S-M). Cut the dominant per-session load: the root policy file is ~40KB (six hard-block families) and byte-identical to its symlink, so it can be double-injected. Reduce salience competit"
trigger_phrases:
  - "035 phase 010"
  - "injection-slimming"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/035-gpt-reliability-fixes/010-injection-slimming"
    last_updated_at: "2026-07-03T13:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Phase scaffolded from 034 synthesis"
    next_safe_action: "Execute per dependency order; plan.md/tasks.md authored at execution"
    blockers: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "035-010-init"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Spec: Root-Policy Injection Slimming (P2)

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-03 |
| **Parent Packet** | ../ (035-gpt-reliability-fixes) |
| **Parent Spec** | ../spec.md |
| **Predecessor** | [../009-pacing-and-resume/spec.md](../009-pacing-and-resume/spec.md) |
| **Closes findings** | F-027, F-029 |
| **Effort** | S-M |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Cut the dominant per-session load: the root policy file is ~40KB (six hard-block families) and byte-identical to its symlink, so it can be double-injected. Reduce salience competition for command-scoped GPT runs.

Findings closed: F-027, F-029. Full mechanism + evidence in `../../034-gpt-reliability-research/research/findings-registry.md`; the ranked package in `../../034-gpt-reliability-research/research/synthesis.md`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

**In scope:** Injection path (session-prime + plugins); an autonomous-run policy profile.

**Out of scope:** none
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **REQ-001**: Dedupe root policy at injection (hash check → one canonical copy + mirror note) (F-027).
- **REQ-002**: Keep plugin briefs terse; defer command-irrelevant sections (spec levels, memory-save, completion mechanics, agent routing, quick reference) for autonomous command runs (F-029).
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

1. root policy injected once; command runs receive a slimmed profile
2. full policy still reaches interactive/mutation sessions

**Acceptance harness (033 behavior-benchmark cells):** Prompt salience (indirect; supports the Gate-3 + presentation cells). Re-run the affected cells (gpt-fast-med + gpt-fast-high legs) after the change; record primary/secondary cause for any multi-cause cell.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk / Dependency | Handling |
|---|---|
| Regressing the Claude-native path | Re-run the baseline leg; it must stay green after every change |
| Phase ordering | Depends on the parent dependency order; phase 002 (Gate-3) must land before P1 phases are verified |
| Design drift from the 034 designs | The 034 iter-011/012/013/014 designs are the reference; verify quoted current-text before applying |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Resolved at execution: exact file targets are named in the closed findings + 034 design iterations; plan.md/tasks.md are authored when this phase starts.
<!-- /ANCHOR:questions -->
