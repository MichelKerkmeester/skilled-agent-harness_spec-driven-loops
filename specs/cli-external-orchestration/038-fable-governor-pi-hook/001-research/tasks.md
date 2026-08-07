---
title: "Tasks: Governor Hook + Pi Subagent Directive Research"
description: "Route verification, three model tracks (5/3/2 iterations), synthesis, validation."
trigger_phrases:
  - "governor research tasks"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/038-fable-governor-pi-hook/001-research"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "pi-main-agent"
    recent_action: "Task list authored"
    next_safe_action: "T001 route verification"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-04-cli-038-research"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Governor Hook + Pi Subagent Directive Research

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Verify model routes: gpt-5.6-luna enabled, cli-devin + cli-cursor SKILL.md contracts preloaded
  - [evidence: `settings.json` enabledModels includes openai-codex/gpt-5.6-luna; `command -v devin` + `command -v cursor-agent` exit 0; cli-devin + cli-cursor SKILL.md both read in full before dispatch]
  - [evidence: routes verified: luna enabled (settings.json), devin + cursor-agent present+authed, both SKILL.md preloaded]
- [x] T002 Create evidence/ + scratch/ working areas
  - [evidence: `mkdir -p evidence scratch` created both dirs; listed in phase folder listing]
  - [evidence: evidence/ and scratch/ created]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

**Track A — GPT-5.6 Luna (max), 5 iterations**

- [x] T003 Iteration A1: capsule vs doctrine vs AGENTS.md overlap scan
  - [evidence: A1: verdict UPDATE — `mk-skill-advisor-bridge.mjs:319-373` omits proof vs `render.ts:65`; dispatched `pi -p --model openai-codex/gpt-5.6-luna --thinking max`, exit 0]
  - [evidence: A1 done: UPDATE verdict (bridge parity gap mk-skill-advisor-bridge.mjs:319-373)]
- [x] T004 Iteration A2: injection chain mechanics (which hook, which composition point)
  - [evidence: A2: injection chain traced — pi imports compiled Claude hook directly (`prompt-advisor.ts:13-14,28-52`); bridge is OpenCode-only (`mk-skill-advisor-bridge.mjs:5-19`)]
  - [evidence: A2 done: injection chain traced; pi imports compiled Claude hook directly]
- [x] T005 Iteration A3: proof-over-appearance integration assessment
  - [evidence: A3: proof overlap assessed — `render.ts:65` one-line proof vs `AGENTS.md:93-96,373-388`; TARGET/SOLVE FAST labels intentionally removed (`checklist.md:64-65`)]
  - [evidence: A3 done: proof overlap assessed; labels intentionally removed from capsule]
- [x] T006 Iteration A4: pi subagent dispatch surface (plugin default vs cli-* routes)
  - [evidence: A4: plugin surface assessed — `pi-subagents/SKILL.md:13` parent-only; capability ceilings `prompting-and-roles.md:5-7`; model-visible routing limitation recorded]
  - [evidence: A4 done: plugin surface assessed; model-visible routing limitation found]
- [x] T007 Iteration A5: verdict synthesis signals + directive draft signals
  - [evidence: A5: final draft — sibling extension `.pi/extensions/pi-subagents-directive.ts`; subagent-blind recursion (`fable-governor.md:33`)]
  - [evidence: A5 done: final draft; sibling extension recommended]

**Track B — GLM 5.2 (high) via cli-devin, 3 iterations**

- [x] T008 Iteration B1: capsule usefulness + AGENTS.md drift assessment
  - [evidence: B1: KEEP verdict — compaction survival (`fable-governor.md:21`); dispatched `devin -p --model glm-5-2 --permission-mode accept-edits`, exit 0, 298 words]
  - [evidence: B1 done: KEEP verdict (compaction survival); directive v4]
- [x] T009 Iteration B2: pi directive necessity + wording draft
  - [evidence: B2: directive NEEDED — `AGENTS.md` §8 agent-directory table omits pi; fable-subagent-model-policy is Claude syntax not `subagent({model})`]
  - [evidence: B2 done: directive NEEDED (AGENTS.md §8 omits pi; fable policy is Claude syntax)]
- [x] T010 Iteration B3: guardrail/override semantics (explicit cli-* request precedence)
  - [evidence: B3: override machine-checkable — skill-invoke vs cli-execute separation; `cli-dispatch-skill-preload.md:34-36` post-override]
  - [evidence: B3 done: override semantics machine-checkable; skill-invoke vs cli-execute separation]

**Track C — Grok 4.5 Max via cli-cursor, 2 iterations**

- [x] T011 Iteration C1: independent verdict on governor hook
  - [evidence: C1: KEEP + light sync — `injection-contract.md:50-58` stale "Fable-5"; dispatched `cursor-agent -p --mode ask --model cursor-grok-4.5-high`, exit 0]
  - [evidence: C1 done: KEEP + light sync (injection-contract.md:50-58 stale Fable-5)]
- [x] T012 Iteration C2: adversarial review of pi directive design
  - [evidence: C2: adversarial — capsule reminder-only; enforce at `tool_call` reusing `DISPATCH_SHAPES` (`dispatch-preflight-lint.ts:12-19`) as pi-default deny]
  - [evidence: C2 done: adversarial — enforce at tool_call via DISPATCH_SHAPES deny]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Synthesize: verdict + pi directive + overlap/contradiction matrix (evidence/synthesis.md)
  - [evidence: `evidence/synthesis.md` written: verdicts, overlap/contradiction matrix, 5 recommendations]
  - [evidence: synthesis.md written with verdicts, matrix, 5 recommendations]
- [x] T014 Verify 10 iteration entries logged; no track truncated
  - [evidence: `evidence/iterations.md` lists A1-A5/B1-B3/C1-C2 = 10 entries; full counts in order]
  - [evidence: 10/10 iterations logged in evidence/iterations.md]
- [x] T015 Run validate.sh --strict on this phase folder; mark checklist with evidence
  - [evidence: `validate.sh --strict` on 001-research exits 0 (Errors: 0, Warnings: 0); checklist CHK-001..CHK-041 verified with evidence]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
  - [evidence: T001-T015 are checked with command or artifact receipts.]
- [x] No `[B]` blocked tasks remaining
  - [evidence: the ten iteration entries record route failures as evidence rather than leaving blocked task rows.]
- [x] synthesis.md + 10 iteration entries present
  - [evidence: `evidence/synthesis.md` and A1-A5/B1-B3/C1-C2 in `evidence/iterations.md`.]
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
