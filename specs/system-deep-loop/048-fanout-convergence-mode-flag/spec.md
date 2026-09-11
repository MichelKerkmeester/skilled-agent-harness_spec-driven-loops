---
title: "Feature Specification: A Documented Flag That Reached Nothing"
description: "The fan-out path never read --convergence-mode, so every lineage silently took the default while the caller believed convergence was disabled."
trigger_phrases:
  - "fanout convergence mode"
  - "convergence-mode flag dropped"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/048-fanout-convergence-mode-flag"
    last_updated_at: "2026-09-11T00:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Threaded the flag from the runner to the leaf"
    next_safe_action: "None outstanding"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-11-deeploop-048"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: A Documented Flag That Reached Nothing

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-11 |
| **Branch** | `skilled/v4.0.0.0` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The deep-loop command surface documents `--convergence-mode` with four values and
maps it to the lineage's anti-convergence config. On a fan-out run it reached
nothing: the runner that spawns each lineage never read the flag, and passed only
the stop policy and the threshold to the leaf. A caller who asked for convergence
off got a lineage running the default, and nothing said so.

It stayed invisible because `--stop-policy=max-iterations`, which the runner does
carry, produces the same visible outcome: the loop runs to its ceiling either
way. The two only diverge in what the stored config records and in what a mode
other than `off` would have done.

This was found by reading a completed run's config, not by the run failing. It
recorded `convergenceMode: "standard"` and `maxIterations: 6` against a caller
that had asked for `off` and `5`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

**In scope**

- Reading `--convergence-mode` in the fan-out runner and validating it.
- Carrying it into the leaf's prompt config and its setup bindings.

**Out of scope**

- The anti-convergence behaviour itself.
- The single-executor path, which already binds the flag through the command.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement |
|----|-------------|
| REQ-001 | The runner accepts `--convergence-mode` with the four documented values and rejects anything else with an input error. |
| REQ-002 | An accepted value reaches the leaf in the prompt config and in the setup bindings. |
| REQ-003 | Omitting the flag changes nothing, so existing callers keep their behaviour. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- A bad value fails fast with the list of valid ones.
- A good value appears in the leaf's config and command line.
- No flag means no emission, and no change to the prompt.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS

| Risk | Mitigation |
|------|------------|
| A lineage that relied on the silent default changes behaviour | Only a caller that passes the flag is affected; absent means absent |
| The leaf ignores the binding | The leaf already reads this key on the single-executor path; the gap was upstream |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## 8. RELATED DOCS

- `.opencode/commands/deep/deep-review.md` — the flag surface that documents the four values.
<!-- /ANCHOR:related-docs -->
