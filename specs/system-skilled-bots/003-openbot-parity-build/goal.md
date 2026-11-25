---
title: "Goal: Build OpenBot parity for skilled bots"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/003-openbot-parity-build"
    last_updated_at: "2026-11-25T20:00:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "w2-000-goals-parent"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Build OpenBot parity for skilled bots

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Give skilled bots the human surface and the small records OpenBot has and this runtime lacks, proven by an operator scenario corpus, aligned with the docs that describe it, and closed by one deep review that leaves no open P0 or P1.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The parent `spec.md` is the only authored document at the parent level; plan, tasks, checklist and decisions live in the child phase folders. |
| D2 | A phase passes `validate.sh --strict` for its own folder before the next phase starts. |
| D3 | One owner per shared record. The owner fixes the shape and every other phase reads it. |
| D4 | The state root stays owner-only. No phase builds the shared-host 0770 mode, and 011 lands only the minimal `owner`/`members` roster. |
| D5 | Every MIT or Apache-2.0 lift keeps its notice, and one `THIRD_PARTY_NOTICES.md` entry per lifted file names its source path. |
| D6 | The desktop app, the research skip list and a browser computer per bot stay out of scope. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

**Read the child goal before working a phase.** Each is authoritative for its
phase and binds as if written here.

| Phase | Goal document |
|-------|---------------|
| 001-activity-and-actor | `001-activity-and-actor/goal.md` |
| 002-routine-layer | `002-routine-layer/goal.md` |
| 003-terminal-screen | `003-terminal-screen/goal.md` |
| 004-computer-exposure | `004-computer-exposure/goal.md` |
| 005-memory | `005-memory/goal.md` |
| 006-approval-grants | `006-approval-grants/goal.md` |
| 007-per-bot-apps | `007-per-bot-apps/goal.md` |
| 008-vault | `008-vault/goal.md` |
| 009-skills | `009-skills/goal.md` |
| 010-conversations | `010-conversations/goal.md` |
| 011-messaging-channels | `011-messaging-channels/goal.md` |
| 012-manual-testing-scenarios | `012-manual-testing-scenarios/goal.md` |
| 013-skilled-and-doc-alignment | `013-skilled-and-doc-alignment/goal.md` |
| 014-deep-review | `014-deep-review/goal.md` |

**Precedence.** Decisions above outrank child detail. Child detail outranks any
summary of it. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done. An evaluator sees the objective
string, not these files.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build --recursive --strict` prints `RESULT: PASSED` for the parent and all fourteen children.
- [ ] `find specs/system-skilled-bots/003-openbot-parity-build -mindepth 1 -maxdepth 1 -type d -name '[0-9][0-9][0-9]-*' | wc -l` prints 14, and `rg -c '^\| [0-9]+ \| `[0-9]{3}-' specs/system-skilled-bots/003-openbot-parity-build/spec.md` prints 14.
- [ ] `rg -c '^\| [0-9]{3} \| `cli-' specs/system-skilled-bots/003-openbot-parity-build/spec.md` prints 14, one orchestration row per phase.
- [ ] `cd .skilled/skills/system-skilled-bots/runtime && npm test` exits 0.
- [ ] `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package system-skilled-bots` prints `PASS` with `scenarios=58` and `violations=0`.
- [ ] `node -e "const r=require('./specs/system-skilled-bots/003-openbot-parity-build/014-deep-review/review/deep-review-findings-registry.json');console.log(r.findingsBySeverity.P0,r.findingsBySeverity.P1)"` prints `0 0`.
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
| Parent goal authored | Done | `node .skilled/hooks/goal/bin/goal.cjs packet specs/system-skilled-bots/003-openbot-parity-build --workspace "$PWD"` reports `packet_budget=ok` |
| Fourteen binding rows | Done | `find specs/system-skilled-bots/003-openbot-parity-build -mindepth 1 -maxdepth 1 -type d -name '[0-9][0-9][0-9]-*' | wc -l` prints 14 |
| Child goals authored | Pending | No `NNN-slug/goal.md` exists yet; each is a `/create:goal <child> child` run |

### Deviations and findings

| Item | Note |
|------|------|
| Child goals absent | The binding table names each child's `goal.md` because the phase-parent contract requires that target. The files do not exist yet, so `validate.sh --strict` reports `SPEC_DOC_SUFFICIENCY` with 14 `SPECDOC_SUFFICIENCY_006` errors, one per row. |
| The one open rule | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build --strict` prints `RESULT: FAILED` on that rule alone. Every other rule passes, `check-goal.cjs` prints `RESULT: PASSED (5/5 checks)`, and `goal.cjs packet` reports `packet_budget=ok`. |
| The fix, outside this goal's write scope | Author the fourteen child goals, one `/create:goal specs/system-skilled-bots/003-openbot-parity-build/<NNN-slug> child` run each. The validator names the same fix in its own message. |
<!-- /ANCHOR:log -->
