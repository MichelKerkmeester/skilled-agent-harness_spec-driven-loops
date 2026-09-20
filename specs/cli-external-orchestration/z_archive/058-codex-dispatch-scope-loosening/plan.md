---
title: "Implementation Plan: Codex Dispatch Scope"
description: "Find every statement of the rule, scope each to the loop types the runtime supports."
trigger_phrases:
  - "codex dispatch scope plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/058-codex-dispatch-scope-loosening"
    last_updated_at: "2026-08-30T11:20:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Scoped the runtime-delegation rule to deep-loop fan-outs"
    next_safe_action: "None outstanding"
    blockers: []
    key_files:
      - ".opencode/skills/cli-external-orchestration/cli-codex/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-30-cli-codex-058"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Codex Dispatch Scope

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Read the runtime to establish which loop types it accepts, then scope every
statement of the delegation rule to those, leaving the adapter prohibition
intact and stated more precisely.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- The supported loop types come from the runtime's own assertion, not from prose.
- Every restatement of the rule is found and scoped, not just the headline one.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

None. This changes prose in one skill document.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Establish the runtime's real surface

`fanout-run.cjs` requires specFolder, loopType, fanoutConfigJson and
baseArtifactDir, and asserts the loop type is active. The accepted values are
`deep-research` and `deep-review`.

### Phase 2: Scope every statement

The rule appeared five times: the frontmatter hard rule, the Execution
Ownership section, ALWAYS rule 2, NEVER rule 5, and two index lines. Each now
names the loop types rather than all execution.

### Phase 3: Make the distinction explicit

The loosened rule only works if "calling the CLI" and "building an adapter" are
distinguishable, so that sentence is stated rather than implied.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The check is a search: no remaining statement requires the runtime for a
dispatch it cannot run. A grep for the unscoped phrasing returns nothing.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- None.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Reverting the commit restores the previous wording in one file.
<!-- /ANCHOR:rollback -->
