---
title: "Goal: Close the session relaunch known gaps and ship them"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "known gap fixes goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "hooks/023-session-relaunch-loop/035-known-gap-fixes"
    last_updated_at: "2026-10-25T20:12:15Z"
    last_updated_by: "orchestrator"
    recent_action: "Revised the directive for the four review findings and the ship"
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
# Goal: Close the session relaunch known gaps and ship them

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** The session-relaunch loop's eight known gaps and four review findings are fixed with failing-first tests and pass the full gate, and this packet is Complete and pushed to origin/main.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Claim seeds parse through `parseClaimSeed`, split at the last spec-folder marker |
| D2 | On Pi a recorded provider other than the launch one (`--provider X` or `X/model`) is a model switch; the Hermes and empty-launch-model rules stay; a Pi launch naming no provider is a documented limit, not code |
| D3 | `prepare` checks its runtime's concern before reading or editing the note, in or out of the loop, exits 2 and names the deciding switch; `keep`, `claim`, `cancel`, `complete`, `history` unchanged |
| D4 | Per-runtime flags for CLAUDE, CODEX, PI, OPENCODE, HERMES, CURSOR and DEVIN, env before file; a non-empty one beats the global flag; master switch and `SYSTEM_SESSION_RELAUNCH_DISABLED` beat both; `.cjs`, `.mjs`, `.ts` and `.sh` readers agree |
| D5 | Every validator git call passes `-c core.fsmonitor=false`, enforced by a test tracing the validator's files |
| D6 | Each fix gets a test that fails before it; no assertion weakened |
| D8 | Reported to the operator, not acted on: goal rows for parent children 012 to 032, with no `goal.md`, and deleting untracked transcripts in 033's scratch folders |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `validate.sh specs/hooks/023-session-relaunch-loop/035-known-gap-fixes --strict` prints `RESULT: PASSED`, every `acceptance-criteria.md` row is Met, `spec.md`, `tasks.md` and `implementation-summary.md` say Complete, and CHK-FIX-007 names the fix commit SHA
- [ ] Tests red before each fix and green after cover: claim-seed parsing, Pi provider switch, `prepare` refusal in and out of the loop naming the deciding switch, a refused `prepare` leaving the note's bytes unchanged, `hook-flags.sh` runtime trim and master aliases, and validator git calls after `if`, `elif`, `while` or `until` or behind an env prefix
- [ ] `node --test .skilled/hooks/shared/hook-flags.test.cjs` exits 0 with a precedence table where `SYSTEM_SESSION_RELAUNCH_ENABLED=1` plus `SYSTEM_SESSION_RELAUNCH_CLAUDE_ENABLED=0` gives Claude off and Pi, OpenCode and Codex on in all four readers, and an adapter test shows Claude's adapter silent under it
- [ ] From the final tree, with a clean environment and again with `SYSTEM_SESSION_RELAUNCH_CLAUDE_ENABLED=0` exported, each exits 0: `node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/session-relaunch.test.cjs` (at least 934 pass), Pi vitest (at least 59), hook-flags tests (at least 28), validator git-call and ENV-REFERENCE drift vitests, and `bash -n` plus `shellcheck -S warning` on `.skilled/bin/skilled-loop` and `.skilled/hooks/shared/hook-flags.sh`
- [ ] A grep finds `SYSTEM_SESSION_RELAUNCH_CLAUDE_ENABLED` in README.md, ENV-REFERENCE.md, .env.example, hook-flags.env.example, doctor-env.yaml, the session-relaunch, shared and hooks READMEs and the three session-relaunch playbooks, and the root README has one in-session handover heading, saying it ships off
- [ ] The packet's commits are on origin/main with a `Spec: hooks/023-session-relaunch-loop/035-known-gap-fixes` trailer, hold no file from another session, no transcript and no secret, and `git status` lists none of the packet's paths
- [ ] The final report names every judgement call made and every item left for the operator
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
| Phase opened | Done | spec docs in this folder |
| Parent goal binding rows | Done | Rows 033 to 035 added; `packet_durable_chars=3997`, `packet_budget=ok` |
| Goal revised for the review fixes and ship | Done | D3 amended for the review findings, D7 retired because its sequencing is done, D8 added; criteria reset for the review fixes, the full gate and the push |

### Deviations and findings

| Item | Note |
|------|------|
| Scope grew from six gaps to eight | Coordinator, 2026-10-25: per-runtime switch and the README fold added |
| Parent binding completeness | Left for the operator under D8: `check-goal.cjs` wants rows for 012 to 032, which hold no `goal.md`; the validator rejects a row with a missing target and 21 more rows would exceed the budget |
| Scope grew by four review findings | Operator approved finishing autonomously, 2026-10-25: the pre-commit review's four P2 findings (refusal names the deciding switch, a refused `prepare` leaves the note unchanged, the `.sh` reader trims the runtime and honours every master alias, the git-call test covers `if`, `elif`, `while`, `until` and env-prefixed calls) are fixed in this packet, then commit and push |
<!-- /ANCHOR:log -->
