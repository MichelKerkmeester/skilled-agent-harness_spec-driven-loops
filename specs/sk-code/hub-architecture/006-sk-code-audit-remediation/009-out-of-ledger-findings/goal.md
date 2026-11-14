---
title: "Goal: Phase 9: out-of-ledger-findings"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "out of ledger findings goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-code/hub-architecture/006-sk-code-audit-remediation/009-out-of-ledger-findings"
    last_updated_at: "2026-11-14T16:51:38Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 9: out-of-ledger-findings

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Fix each finding that phases 006 to 008 logged outside the ledger, in the file it cites, with a command that proves it.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|---|---|
| D1 | A finding is fixed with one literal edit on the line it cites. No router block, script or test changes. |
| D2 | Ledger row `H7` is not fixed here. The operator decides on a packet of its own. |
<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `rg -c 'CHK-CMT' .skilled/skills/sk-code -g '*.md' -g '!**/changelog/**'` prints nothing and exits 1.
- [ ] `bash .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh` prints `all 4 guards PASSED` and exits 0.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/hub-architecture/006-sk-code-audit-remediation/009-out-of-ledger-findings --strict --quiet` prints `RESULT: PASSED`.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Spec, plan, tasks and acceptance criteria authored | Done | Written on 2026-11-14 from the goal logs and summaries of phases 006 to 008 |
| Phase 009 closed | Done | Code 7f35cb2db1. Ten criteria Met. Eight documents fixed in three packets, three release notes, packet versions 2.2.1.0, 1.9.18.0 and 1.13.21.0. 16 DeepSeek V4.1 Flash dispatches through cli-pi |
| Edge cases | Recorded | Every finding held, so the empty case did not arise. All eight documents changed in one commit. A dead path added to the scripts README made the reference check exit 1, and it exited 0 after the restore |
| MCP server checklist selector, second reading | Recorded | A read-only DeepSeek reader saw lines 14 to 30 of mcp-server-authoring.md and not the selector. It named tools, input schemas, registry entries, response envelopes, a ported workflow, server startup and the choice between native registration and Code Mode. The selector names a file that defines a server, registers its tools or sets how it starts. They agree on definition, tools and startup. The... |
| Deviation: the rule id criterion was scoped to Markdown | Recorded | As first written the command also matched a benchmark report JSON from 2026-07-21, a record of a past run. The criterion now passes -g '*.md', and was changed before any row was marked |
| Deviation: the playbook sentence that says seven test files stays | Recorded | The handoff note listed it as wrong. Step 8 of the verification scenario runs exactly seven files, so the sentence is true. The test table gained the two rows |
| Finding outside the phase: the verification scenario expects tests 37 | Open | verification-alignment.md says step 8 prints tests 37. The same seven files print tests 46. The pass rule reads fail 0 only |
| Finding outside the phase: two more lines say OpenCode for the tree | Open | sk-code-skilled/SKILL.md lines 90 and 94. The logged finding named line 13 only |
| Assumption: fix open items is the acknowledgement CHK-012 of phase 002 waited on | Recorded | The operator's instruction of 2026-11-14 named the open items. The line is ticked with that instruction as evidence |
| Continuity saved | Done | Full-auto save on 2026-11-14 after the docs commit 3422a19f52. The trigger index was not regenerated |
| Operator instruction 2026-11-14: fix open | Done | Code bcb8bbab3f. The verification scenario expects tests 46, which its seven files print. Lines 90 and 94 of sk-code-skilled/SKILL.md say SKILLED. Packet version 2.2.2.0. The two findings above are closed |

### Deviations and findings

| Item | Note |
|------|------|
| Two deviations and two findings outside the phase | Each has its own row in the Progress table above, written by the goal log command |
<!-- /ANCHOR:log -->
