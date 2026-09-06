---
title: "Goal: close every gate this packet left red"
description: "The durable directive this phase executes against, and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/018-sk-design-parent-v2/007-close-inherited-failures"
    last_updated_at: "2026-09-06T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Closed all four inherited gate failures"
    next_safe_action: "Run phase 008: broaden fundamentals past screen UI"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/ROUTER.md"
      - ".opencode/skills/sk-design/graph-metadata.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-06-018-sk-design-parent-v2"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Goal: close every gate this packet left red

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->

**Inherits the parent `goal.md`. Where this file and that one disagree, that one wins.**

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

No gate this packet touched is red, and nothing is left failing without a named owner.

### Decisions

**Four failures, four causes, none large.** Three playbook fixtures move to a `sk-design` hub
playbook this phase creates. The fourth is cross-hub and, on operator instruction, is moved with them
and repointed to a pair the design hub owns rather than retired. One compiled-routing scenario gains
the pass/fail criteria it never had. Two spec documents get a closed anchor and a filled frontmatter
field.

**The benchmark reports of 2026-07-21 stay as written.** They record what was measured then. The
fixture ids are kept so those reports still resolve to a file with the same id.

### Operator copy

Every red gate closes; the four fixtures move to the hub that owns their mode.
<!-- /ANCHOR:directive -->

<!-- ANCHOR:binding -->
## 2. BINDING

1. **Run after the rename, not before.** The fixtures should land on the final mode names and move
   once.
2. **Moves must be renames, and ids must not change.** Published reports key results to these ids.
3. **Repointing changes what a fixture tests.** Say so in the fixture and in the decision record, so
   a reader of the old reports is not misled.
4. **`--strict` on every gate.** One of these gates prints a failing verdict and exits 0 without it.
5. **Re-run every gate after every repair,** not once at the end. A repair that fixes one gate and
   breaks another is the failure mode here.
<!-- /ANCHOR:binding -->

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

| # | Criterion | How it is proven |
|---|-----------|------------------|
| 1 | Playbook topology green on both hubs | `validate-playbook-topology --strict` exits 0 for each |
| 2 | The scenario with no criteria passes | `validate-compiled-routing-scenarios --strict` exits 0 |
| 3 | Both router-unification children validate | `validate.sh --strict` reports 25 of 25, against 23 |
| 4 | Fixture history survives | `git diff --cached --name-status -M` shows renames, ids unchanged |
| 5 | The index describes the corpus it holds | Scenario ranges and FLOWCHART rows corrected |
<!-- /ANCHOR:completion -->

<!-- ANCHOR:log -->
## 4. LOG

### Progress

Done. Four fixtures moved as renames, a hub playbook created, two indexes corrected, one heading
renamed and two spec documents repaired. Every gate green.

### Deviations and findings

- **`SD-CR-001` was never missing its criteria.** It carried a full PASS/FAIL/SKIP section under a
  heading reading `Pass / Fail`; the parser matches `Pass/Fail Criteria`. A diagnosis that read as
  missing content was a heading mismatch, and writing new criteria would have duplicated a section the
  document already had.
- **The moved fixtures carried a relative gate path that broke on arrival.** Each pointed at
  `../../sk-create-skill/scripts/...`, a sibling the design hub does not have. No gate checks a path
  inside a fixture's source table, so this would have sat wrong indefinitely.
- **`sk-doc`'s index named scenarios it no longer held.** Correcting the receiving hub alone would
  have left the sending one lying.
<!-- /ANCHOR:log -->
