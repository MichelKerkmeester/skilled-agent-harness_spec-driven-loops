---
title: "Goal: docs, governance and packet closeout"
description: "The durable directive this phase executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/071-cli-hermes-creation/009-docs-governance-and-closeout"
    last_updated_at: "2026-09-14T19:40:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Roster surfaces, READMEs, contracts and closeout gate done"
    next_safe_action: "None; packet closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-071-009-docs-governance-and-closeout"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: docs, governance and packet closeout

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Every place the six runtimes are named also names `cli-hermes`, the READMEs
describe the shipped state, and the whole packet validates recursively.

### Decisions

Frozen choices for this phase. The parent goal's decisions bind here too; changing one of those is
an amendment to the packet root `goal.md`.

| ID | Decision |
|----|----------|
| P1 | Roster surfaces: the agent roster docs (`context.md`, `deep-research.md`, `deep-review.md`, `deep-improvement.md` and their runtime mirrors), the hub `README.md`, the root `README.md`, and the one `AGENTS.md`/`CLAUDE.md` line that names a runtime |
| P2 | `REPO RULES.md` and the rule files gain no new rule; phase 001 found nothing Hermes-specific that a rule must carry beyond what the packet's hard rules already hold. If a phase finds otherwise, that is an amendment to this decision |
| P3 | READMEs are authored or refreshed with `sk-create-readme`; historical records are never edited |
| P4 | Closeout is `validate.sh --recursive --strict` on the parent with every phase Complete, and the parent `goal.md` criteria all checked |

### Completion criteria

1. A grep for the six runtime names across the roster surfaces shows `cli-hermes` beside them.
2. Hub and packet READMEs describe the shipped state, verified after the other phases are tested.
3. The parent passes `validate.sh --recursive --strict` with zero errors.

### Operator copy

The operator holds the parent directive as the session objective. A change here that alters a
parent decision or criterion is an amendment to the parent: apply it there and resend that file.
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

| Surface | Bound to |
|---------|----------|
| Phase spec | `spec.md` |
| Closure gate | `acceptance-criteria.md` |

The parent directive in the packet root `goal.md` binds above this file. Evidence:
`../001-deep-research/research/research.md` section 4 row R8.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `cli-hermes` present on every roster surface
- [x] READMEs describe the shipped state
- [x] Parent recursive strict validation passes
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Roster surfaces | Done | orchestrate copies, root and hub READMEs, `AGENTS.md` row, rewrite command, sibling READMEs, council and benchmark docs, deep presentations; grep proof in the summary |
| READMEs | Done | packet README rewritten with `sk-create-readme`; three READMEs `Total issues: 0` |
| Contracts | Done | research, review and ai-council recompiled; drift OK |
| Closeout gate | Done | see the parent goal log |

### Deviations and findings

| Item | Note |
|------|------|
| `CLAUDE.md` is a symlink to `AGENTS.md` | One row serves both; a first pass appended it twice through the two paths and the duplicate was removed. |
| Pre-existing validator findings | `AGENTS.md` lacks an overview section and the orchestrate copies number sections from 0; both predate the packet and were left as found. |
<!-- /ANCHOR:log -->
