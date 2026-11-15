---
title: "Goal: Phase 15: vibe-turn-start-advisor-and-dist"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "vibe turn start advisor and dist goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/015-vibe-turn-start-advisor-and-dist"
    last_updated_at: "2026-11-14T22:55:00Z"
    last_updated_by: "code-worker"
    recent_action: "Built the composer, advisor part and dist hook; both keyed runs recorded"
    next_safe_action: "Repair F001 outside this phase's write authority"
    blockers:
      - "F001: advisor runtime-list parity and legacy tuple tests pin the label list"
    key_files:
      - ".skilled/hooks/session-lifecycle/vibe/turn-start.mjs"
      - ".skilled/skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs"
      - ".vibe/plugins/repo-guards/dist-freshness.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "mistral-support-2026-11-14"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions:
      - "Does the shared advisor handler repeat the routing head every turn? No: it reduces to the head, and the advisor part's head receipt drops that too."
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 15: vibe-turn-start-advisor-and-dist

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Give each main-session Vibe prompt the skill advisor brief, and each edit to a watched package source a dist-staleness warning, through hooks that never block.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | One `pre_agent` composer entry carries all turn-start parts. Later phases add parts, not entries |
| D2 | `spec-gate-classify` stays a separate `pre_agent` entry |
| D3 | The advisor part reuses the shared handler under runtime `vibe` and its file-backed directive store. No Vibe-specific dedupe store |
| D4 | The dist hook is non-strict and separate from the strict `post-edit-quality` entry |
| D5 | Children and subagents get no advisor brief |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `node --test .skilled/hooks/session-lifecycle/vibe/turn-start.test.mjs .vibe/plugins/repo-guards/tests/dist-freshness.test.mjs` prints `fail 0`
- [ ] `rg -c "'vibe'" .skilled/skills/system-skill-advisor/runtime/dist/lib/advisor-runtime-values.js` prints 1
- [ ] A main-session keyed run shows the advisor context and a child keyed run shows a dist warning, saved in `scratch/keyed-run/`
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
| Plan | Done | Spec, plan and tasks authored from the Fable gap designs and the orchestrator's source checks |
| Label | Done | T004: `vibe` in `ADVISOR_RUNTIME_VALUES`, advisor runtime rebuilt, `rg -c "'vibe'"` prints 1 on the built file |
| Composer and advisor part | Done | T005 to T007: `pass 6`, `fail 0`; keyed run shows `Advisor:` in the journal |
| Dist hook | Done | T008 to T010: `pass 3`, `fail 0`; child keyed run shows `STALE DIST WARNING` |
| Latency | Done | T015: median 377.7 ms, p95 737.6 ms, max 870.7 ms, `limit: pass` |
| Dedupe | Done | T018: first call holds the head and `Directives:`, second prints nothing |

### Deviations and findings

| Item | Note |
|------|------|
| Directive store | The dsh adapter keeps its receipts in memory, which works because dsh is one long process. A Vibe hook is a new process per call, so this phase relies on the shared file-backed store (`.skilled/skills/system-skill-advisor/hooks/lib/directive-lifecycle.ts:248-253`) |
| Second `pre_agent` entry | `spec-gate-classify` is already a `pre_agent` entry, so `hooks.toml` holds two |
| F001 blocked | The `vibe` label breaks the advisor's runtime-list parity test and its legacy tuple assertion. Both repairs sit in files this phase's write authority does not name, so `tasks.md` records F001 for the operator |
| `--add-dir` loads project hooks | A child dispatch with `--add-dir <checkout root>` makes that root a project root, so its unrendered `.vibe/hooks.toml` wins over the rendered home copy and every `$(git rev-parse --show-toplevel)` command fails from a scratch cwd. The recorded run adds only the watched package's `lib/` folder |

Open question answered: the shared handler reduces to the routing head once the directive block is proven delivered, so the advisor part keeps its own per-session head receipt for the head itself. T018 proved both reductions.
<!-- /ANCHOR:log -->
