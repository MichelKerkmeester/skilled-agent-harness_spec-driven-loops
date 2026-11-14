---
title: "Goal: Phase 9: deep-loop-executor-kind"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "deep loop executor kind goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/009-deep-loop-executor-kind"
    last_updated_at: "2026-11-14T14:30:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Planned the cli-mistral-vibe executor kind, adapter and scoring"
    next_safe_action: "After phase 007 lands, run T001 to T004"
    blockers:
      - "MISTRAL_API_KEY is unset, so the end-to-end lineage run cannot happen"
    key_files:
      - ".skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts"
      - ".skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts"
      - ".skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "mistral-vibe-plans-2026-11-14"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Does a lineage show as vibe or vibe-rs in the ancestor walk?"
      - "Does Mistral's catalog list the two roster models for Vibe without a hand-written row?"
      - "Does this phase wait on phase 006 for the model aliases?"
      - "Does --prompt-file alone run print mode, or does it need -p?"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 9: deep-loop-executor-kind

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Let a deep-loop run use Vibe as an isolated executor kind whose lineages are scored from `export.json`.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The adapter builds print mode only. ACP stays deferred |
| D2 | A Vibe lineage counts as success only with an `export.json` whose `exit_code` is 0. Exit 3 with an export is recorded as a per-lineage partial outcome and never counted as success. No export records failure, which separates Vibe's exit 3 from the recursion guard's |
| D3 | The recursion guard matches both `vibe` and `vibe-rs` until phase 004 shows which name the ancestor walk sees |
| D4 | Vibe runs only as a fan-out lineage, as dsh does, because the lineage-local `VIBE_HOME`, output folder and export scoring live in the fan-out adapter. The YAML branch refuses single-executor use and names `--count=2` or a second `--executor` group, so the end-to-end proof runs a Vibe lineage beside a second group |
| D5 | Reasoning effort is pinned by the model row's `thinking`, never by a flag. The kind rejects `reasoningEffort` |
| D6 | No default model or default executor changes. DevPass stays the default |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] Every row in `acceptance-criteria.md` is `Met`
- [ ] One keyed Vibe research lineage, run beside a second executor group, has an `export.json` showing `exit_code` 0
- [ ] The three executor unit suites print zero failures and more than 365 passes
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
| Unit baseline | Done | `Tests  365 passed (365)` over the three executor unit files on 2026-11-14 |
| Stress baseline | Pending | T002 |
| Kind, adapter, scoring | Pending | Waits on phase 007 |
| Keyed lineage | Pending | `MISTRAL_API_KEY` unset on 2026-11-14 |

### Deviations and findings

| Item | Note |
|------|------|
| Exit 3 collision | `RECURSION_GUARD_EXIT_CODE = 3` at `executor-audit.ts:26`, and Vibe uses exit 3 for a run stopped without finishing. D2 tells them apart by `export.json` |
| Per-lineage partial | `rg -n "'partial'" fanout-run.cjs` printed only lines 3571 and 4321, both run-level. Lineages settle as fulfilled or rejected, so T005 locates the result record and T011 adds the per-lineage outcome |
| Budget flags | Flag support carries no turn, token, price or time budget, so a keyed run cannot request exit 3. The exit 3 path is proven with a shim (SC-002) |
| Binary table | `EXECUTOR_BINARY_BY_KIND` holds one string per kind, so T007 widens it before Vibe can carry two names |
| Process name | Open question: does a lineage show as `vibe` or `vibe-rs` in the ancestor walk? UNKNOWN until phase 004. D3 matches both |
| Catalog membership | Open question: does Mistral's catalog list `deepseek-v4-1-flash-1017` and `zai-glm-5-3-flash` for Vibe without a hand-written row? UNKNOWN until phase 004. A hand-written row with `thinking` pins them either way |
| Alias source | Open question: does this phase wait on phase 006? The phase plan's graph lists only 007, but the aliases `VIBE_SUPPORTED_MODELS` holds come from the model rows 006 writes |
| Prompt delivery | Open question: does `--prompt-file` alone run print mode, or does it need `-p`? The adapter prefers `--prompt-file`, so the prompt stays out of the process list. Stdin as a prompt source is UNKNOWN until phase 004 |
| Single-executor use | D4 follows the dsh precedent at `deep-research-auto.yaml:1216`. If the operator wants single-executor Vibe runs, D4 is the amendment point |
<!-- /ANCHOR:log -->
