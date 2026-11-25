---
title: "Contract: Packet decisions D1 to D9"
description: "The nine packet-level decisions the plan-depth research raised, each with the choice taken, its author, its date and the documents it changes. Each is open for the operator to override."
trigger_phrases:
  - "parity build decisions"
  - "proposal sentinel decision"
  - "deep review missing executor"
  - "routine streak after enable"
importance_tier: "important"
contextType: "decision"
version: 1.0.0.0
---

# Packet decisions D1 to D9

The nine decisions come from the plan-depth research's work order WO-01. [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/research.md:321-333] For each one the choice taken is the research's recommended default.

**Who took them.** The assistant, on 2026-11-25, under the operator's directive to proceed without asking. None was put to the operator. Each stays open: the operator overrides one by editing its row here, and a writer applies the row as it stands when the work order runs.

**How a writer uses this file.** A work order that names a decision applies the choice below to the documents in the last column, in the same change. A decision this file marks overridden is applied as overridden.

| ID | Decision | Choice taken | Why | Documents it changes | Status |
|----|----------|--------------|-----|----------------------|--------|
| D1 | The proposal sentinel: one reserved id or two | Two. 009 keeps `skill-proposals` beside 005's `memory-proposals` | 009 already uses its sentinel in three places [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:164] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:264], and the inbox's `botId` column then names the right queue. The hold stays off by the `kind` filter either way [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:154] | `specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:265`, the last clause ("009 sets `kind` to `skill-proposal` and adds no id of its own") | Taken 2026-11-25, open to override |
| D2 | The envelope for `--json` verbs outside the screen | An object with a top-level `version`, the screen's rule. The chat transcript becomes `{"version": 1, "conversationId": "<id>", "messages": [...]}` | A bare array has no place for a version or a sibling key [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/002-architecture-and-contracts/design/contracts.md:740]. The rule and every verb's row are `cli-json.md` | 010 REQ-006 and AC-003 and AC-006, 011 REQ-019, 005 REQ-004, 012's empty-inbox edge case | Taken 2026-11-25, open to override |
| D3 | 014 and a missing executor binary | The fallback wins. Setup probes the five binaries and records which are present. At least one must be. An absent one is replaced in the plan's fallback order | Setup demands all five while the plan says an absent one drops its lineage [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/014-deep-review/tasks.md:43] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/014-deep-review/plan.md:219]. A review that cannot start helps no one | 014 task T003, the plan's definition of ready, AC-003 | Taken 2026-11-25, open to override |
| D4 | 012's failure policy | A product failure does not block 012 once it is filed in `012-manual-testing-scenarios/scratch/failures.md` with scenario id, phase, requirement, observed line and evidence path. It does block 014's PASS | 012 may close with recorded failures, and no later phase reads them today [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/012-manual-testing-scenarios/spec.md:191] | 012 REQ-006 and AC-006 and T046, 014's verdict rule and dependency list | Taken 2026-11-25, open to override |
| D5 | 007's shared-run record | Confirm as designed: a shared run that declares no `apps` records `posture.apps: []` while its child reads the full repository config. A shared run that declares `apps` is refused `apps-unenforceable` | Stated, tested on purpose and named as a limit [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/spec.md:144] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/spec.md:153] | One line in 007's risk table | Taken 2026-11-25, open to override |
| D6 | 008's same-user boundary | Confirm as designed: every bot child runs as the same OS user and can read another name's 0600 value file. The grant is enforced by not injecting a name | Stated and accepted three times in 008 [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:165] | One line in 008's risk table | Taken 2026-11-25, open to override |
| D7 | 014 after its own fixes | No second review. After the last fix, re-run each 012 scenario whose owning phase a fix touched, and record the result | The fix pass re-runs unit suites only [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/014-deep-review/spec.md:102], and a scenario re-run is the cheaper proof that the fix holds where an operator drives it | 014, one task and one acceptance row | Taken 2026-11-25, open to override |
| D8 | 002's first-failure notice | Defer, with one out-of-scope line. `delivery.onFailure` already reports each failure | The reference posts one notice on the first failure after a success [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/routines.md:118-123]. The existing failure delivery covers the operator's need | 002's out-of-scope list | Taken 2026-11-25, open to override |
| D9 | 002's failure streak after `bots enable` | Count only runs newer than a stored `enabledAt`, which `bots enable` writes into the routine state file | Without it the ten old failures stay the newest ten and the next single failure trips the switch again [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:167]. The reference restarts the count at re-enable [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/routines.md:118-123]. The field is in `records.md` section 6 | 002 REQ-006, the routine state file | Taken 2026-11-25, open to override |
