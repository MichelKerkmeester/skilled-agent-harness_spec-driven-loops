---
title: "Goal: Frontend upstream proposals from Barter's frontend practice program"
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
    packet_pointer: "sk-code/code-surfaces/006-frontend-upstream-proposals"
    last_updated_at: "2026-11-03T18:10:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "All six phases closed against the completion criteria"
    next_safe_action: "None; the Barter re-pin is Barter's next step"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "ae286a84-7880-4ce7-a5fe-7d1335e09c78"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Frontend upstream proposals from Barter's frontend practice program

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Skilled gains a dedicated stack-agnostic `sk-code-frontend` surface with the five-pass Figma check and the Frontend overrides contract, the router-tooling fixes and design hand-offs Barter's frontend program proposed, generic playbook scenarios, and an evidence-backed verdict on each inferred tooling defect, with no Barter-only content.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Phases run in the proposals' adoption order: 001 surface, 002 tooling, 003 hand-offs, 004 scenarios, 005 inferred ranks, then 006 closes the open items and aligns the touched skills. |
| D2 | The frontend surface is a dedicated sk-code surface, never part of `sk-code-quality`. |
| D3 | Routing vocabulary ships only once router reach proves it; an outrank is fixed by renaming the phrase, never by an allowlist entry or a scorer change. |
| D4 | No Barter-only content lands: no Barter tokens, profile, repository modes, aliases or browser targets. |
| D5 | Work stays on `worktrees/314-frontend-upstream-proposals` and follows the sk-git-skilled commit flow. |
| D6 | Research, verification and builds run on DeepSeek V4.1 Flash via opencode-go (`opencode-go/deepseek-v4.1-flash`), never through a gateway. |
| D7 | An INFERRED rank changes code only after its confirming run is saved. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

**Read the child goal before working a phase.** Each is authoritative for its
phase and binds as if written here.

| Phase | Goal document |
|-------|---------------|
| 001-frontend-surface-mode | `001-frontend-surface-mode/goal.md` |
| 002-tooling-fixes | `002-tooling-fixes/goal.md` |
| 003-design-handoffs | `003-design-handoffs/goal.md` |
| 004-playbook-scenarios | `004-playbook-scenarios/goal.md` |
| 005-inferred-confirmations | `005-inferred-confirmations/goal.md` |

**Precedence.** Decisions above outrank child detail. Child detail outranks any
summary of it. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done. An evaluator sees the objective
string, not these files.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `.skilled/skills/sk-code/mode-registry.json` lists `sk-code-frontend` in its `surfaces` array and in `modes[]`
- [ ] Router reach at concurrency 2, run after the last edit, prints `outranked=  0` for sk-code, sk-design and mcp-tooling
- [ ] `rg -n -i "barter" .skilled/skills/sk-code/sk-code-frontend/` prints no line
- [ ] `node --test .skilled/skills/sk-doc/sk-create-skill/scripts/tests/` exits 0 and includes an orphan-phrase test and a reach-default test
- [ ] `rg -n "sk-design-fundamentals"` hits `sk-code/SKILL.md`, `sk-code/README.md` and `mcp-figma/SKILL.md`
- [ ] `validate-playbook-package.cjs --package` exits 0 for `mcp-figma/manual-testing-playbook` at 20 scenarios and for `sk-design-fundamentals/manual-testing-playbook` at 13 or more
- [ ] `validate.sh --strict --recursive` on `specs/sk-code/code-surfaces/006-frontend-upstream-proposals` prints `RESULT: PASSED`, with four rank verdicts in `005-inferred-confirmations/decision-record.md`
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
| Packet planned | Done | Parent, five children and six goals authored 2026-11-03 on `worktrees/314-frontend-upstream-proposals` |
| 001-frontend-surface-mode | Pending | Waits on the operator's React Native ruling for its native half |
| Decision capture | Done | 17 operator answers from session ae286a84 written to decision-record.md |

### Deviations and findings

| Item | Note |
|------|------|
| React Native in canonical sk-code | `sk-code/ROUTER.md:171` keeps React Native in the Barter fork, while rank 1 ships a native stack layer. Phase 001 ADR-001 records the operator's answer. |
| `SKD-010` overlap | The fundamentals playbook already has "Every value comes from a scale"; phase 004 checks it before adding the proposed token-or-scale scenario. |
| Rank 10 lead | `leaf-route-replay.cjs:121` reads `INTENT_SIGNALS`, while the fundamentals router declares `INTENT_MODEL`; phase 005 T001 confirms the cause. |
<!-- /ANCHOR:log -->
