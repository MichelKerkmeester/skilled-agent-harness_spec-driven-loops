---
title: "Goal: Phase 7: dispatch-recognition-and-hard-rules"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "dispatch recognition and hard rules goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/007-dispatch-recognition-and-hard-rules"
    last_updated_at: "2026-11-14T14:10:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Planned the Vibe dispatch recognition and hard-rule checks"
    next_safe_action: "After phase 005 lands, run T001 to list the declared check names"
    blockers:
      - "Phase 005 has not written cli-mistral-vibe/hard-rules.json yet"
    key_files:
      - ".skilled/hooks/dispatch/lib/dispatch-audit.mjs"
      - ".skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "mistral-vibe-plans-2026-11-14"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Does a dispatch show as vibe or vibe-rs in a process walk?"
      - "Is stdin a prompt source in vibe 3.1.2?"
      - "Does vibe 3.1.2 load a .env from its working directory?"
      - "Does --prompt-file alone run print mode, or does it need -p?"
    answered_questions:
      - "Phase 005 names its roster check vibe-closed-roster and adds stdin-redirect-required"
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 7: dispatch-recognition-and-hard-rules

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Refuse any Vibe print-mode dispatch that breaks a cli-mistral-vibe hard rule before it launches.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Recognition covers a `vibe`, `vibe-rs` or `vibe-acp` word in command position, except the session-free forms `-v`, `--version`, `-h`, `--help`, `config`, `mcp` and `help`. Both `vibe` and `vibe-rs` stay until phase 004 shows which name a dispatch carries |
| D2 | This phase implements the checks phase 005's `hard-rules.json` names. A rule that needs new wording is an amendment to 005, not an edit here |
| D3 | A rule counts as done only when its violating command is refused in a test |
| D4 | No default model changes. DevPass stays the default |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `resolveDispatchPackets` names `cli-mistral-vibe` for `vibe -p` and `vibe-rs -p` commands
- [ ] Each cli-mistral-vibe rule has a refusing test that returns its rule id
- [ ] `node --test lib/dispatch-rule-checks.test.mjs tests/dsh-dispatch.test.mjs` prints `fail 0` with more than 53 passes
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
| Baseline | Done | `pass 53`, `fail 0` for the rule-check suites. `Tests 128 passed (128)` for `dispatch-audit.test.mjs` |
| Vibe recognition | Pending | `resolveDispatchPackets` returns `[]` for a `vibe -p` command on 2026-11-14 |
| Checks | Pending | Waits on phase 005's `hard-rules.json` |

### Deviations and findings

| Item | Note |
|------|------|
| Process name | Open question: does a dispatch show as `vibe` or `vibe-rs` in a process walk? UNKNOWN until phase 004's keyed run. D1 matches both meanwhile |
| Stdin | Open question: is stdin a prompt source in vibe 3.1.2? UNKNOWN until phase 004. Phase 005 now lists `stdin-redirect-required`, so the shared stdin check runs on a Vibe dispatch once T005 adds the Vibe shape to it. The answer only changes the cli-reference text |
| Prompt file | Open question: does `--prompt-file` alone run print mode, or does it need `-p`? UNKNOWN until phase 004. The answer decides whether `print-mode-only` accepts `vibe --prompt-file` without `-p` |
| Repository-root rule | Open question: does vibe 3.1.2 load a `.env` from its working directory? Vibe's bundled skill documents a `.env` in `VIBE_HOME`, and whether it also reads one from its working directory is UNKNOWN. The check refuses the repository root either way, as dsh's `no-repo-root-dotenv` does. The answer only changes the rule message |
| Check name collision | Settled 2026-11-14: phase 005 now names its roster check `vibe-closed-roster` and adds `stdin-redirect-required`. Its plan names the check `closed-roster`, which is already dsh's check in the shared `CHECKS` registry. `CHECKS['closed-roster']` returned `true` for `vibe -p hi --model off-roster` on 2026-11-14, so the Vibe rule would never fire. Proposed amendment: in 005's `spec.md` In Scope and `hard-rules.json`, replace `closed-roster` with `vibe-closed-roster` |
| Test runner | `dispatch-audit.test.mjs` is a vitest file. Under `node --test` it fails to load, so its baseline comes from the hooks vitest config |
<!-- /ANCHOR:log -->
