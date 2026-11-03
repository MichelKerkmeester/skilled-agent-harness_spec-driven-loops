---
title: "Goal: Phase 1: frontend-surface-mode"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "frontend surface mode goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-code/018-frontend-upstream-proposals/001-frontend-surface-mode"
    last_updated_at: "2026-11-03T08:33:53Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
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
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 1: frontend-surface-mode

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** Give the sk-code hub a dedicated, read-only, stack-agnostic `sk-code-frontend` surface that carries frontend practice, the five-pass Figma check and the Frontend overrides contract, with vocabulary proven not to outrank any existing hub.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The surface is a peer of `sk-code-ci`, reached from request vocabulary alone, never part of `sk-code-quality`. |
| D2 | Vocabulary is multi-word frontend phrases only. An outrank is fixed by renaming the phrase, never by an allowlist entry or a scorer change. |
| D3 | No Barter value enters the packet: no Barter tokens, profile, Angular mappings, ngx-translate notes or declared browser floors. |
| D4 | Native content ships only if ADR-001 records the operator allowing React Native in canonical sk-code. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [ ] `.skilled/skills/sk-code/mode-registry.json` lists `sk-code-frontend` in `modes[]` and in its `surfaces` array
- [ ] Router reach at concurrency 2, run after the last edit, prints `outranked=  0` and `wrong-hub=  0` for sk-code, sk-design and mcp-tooling
- [ ] `rg -n -i "barter|@barter-bv|ngx-translate|declared browser floor|firefox esr" .skilled/skills/sk-code/sk-code-frontend/` prints no line
- [ ] `sk-code-frontend/references/figma-to-code.md` defines five passes and an `INCOMPLETE` verdict for any pass not run
- [ ] A frontend prompt replays through both routing stages to `sk-code-frontend`, saved in this phase's `scratch/replay.txt`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG
<!-- FILL: Record each step with its command output. Keep this table current. GOOD: T001 Done. `ls logs/archive | wc -l` printed 3. WEAK: Progress is good. -->

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Phase planned | Done | Planning docs authored 2026-11-03 |
| T001 reach baseline | Done | `scratch/reach-baseline.txt`: sk-code 70, sk-design 120 (1 allowed), mcp-tooling 115, each outranked=0 wrong-hub=0 probe-error=0 |
| T002 ADR-001 | Done | `decision-record.md`: web and native, operator 2026-11-03 |
| Dispatch (a) web layer | Done | 8 files, all at 215 lines or fewer; Barter grep exit 1 (no match) |
| Dispatch (f) topic intents | Done | 13 topic intents plus FIGMA_TO_CODE, 27 aliases; router-sync 5/5; intent-signals `--check` PASSED |
| Interim reach | Done | `scratch/reach-interim.txt`: outranked=0 on all three hubs; `react native list performance` no-reach, renamed to `react native scroll performance` in brief (h) |
| Dispatches (g) and (h) | Done | DeepSeek V4.1 Flash max: changelogs, shared docs, canary case, surface-hint tests, activation hashes; the test prompt was corrected to a review prompt |
| Final verification | Done | `scratch/reach-final.txt` outranked 0 on three hubs; `scratch/replay.txt`; parent-skill check passes; `scratch/verify-001.md` 15 rows |

### Deviations and findings

| Item | Note |
|------|------|
| Executor switch | Codex hit its usage limit mid-dispatch (f). The operator moved builds to `opencode-go/deepseek-v4.1-flash#max` (Q005). The commit gate refused the recovery-baseline commit while two parent-skill checks fail, so the baseline is HEAD `47016cc3ae` plus a 61-file tarball in the session scratchpad. |
| REQ-006 amendment | Native topic files name the React Native version, not a Baseline status (Q006). |
| mcp-tooling hash | The mcp-figma pointer changed the mcp-tooling policy hash, so its activation manifest was refreshed too. |
| Per-topic intents | The plan named one intent per stack layer; router-sync 1b needs every topic file routed, and the core page loads one topic file, so each topic file has its own intent. |
| Over-broad grep | The `safari 18` term also matched a real Safari 18.2 support version; dispatch (a) hid it with a non-breaking space. The character was removed and the grep narrowed to `declared browser floor` in spec, tasks, criteria and this goal. |
<!-- /ANCHOR:log -->
