---
title: "Phase 5 Resume Instructions: deep-loop-runtime release cleanup"
description: "How to resume Phase 5a (10-iter cli-devin SWE-1.6 deep-research loop) in a fresh session. State machine fully initialized; iterations 0/10 dispatched at handoff."
trigger_phrases:
  - "deep-loop-runtime phase 5 resume"
  - "deep-research loop resume"
importance_tier: "important"
contextType: "implementation"
---

# Phase 5 Resume Instructions

> **STATE AT HANDOFF**: Phase 5a state machine fully initialized. Zero iterations dispatched. Ready for iter 1 via the deep-research skill's resume mechanism in a fresh session.

---

## Why a Fresh Session

Phase 5a is `me orchestrating 10 sequential cli-devin SWE-1.6 Task dispatches`, each 15-25 min wall-clock, with convergence eval + dashboard + state writes between each. That is fundamentally a multi-hour orchestration. The deep-research skill state machine is designed resumable for exactly this case (`on_resume`, `on_fresh`, `on_restart` branch labels in the YAML). Splitting iteration orchestration across multiple sessions is the architecturally sound path.

ADR-006 in `decision-record.md` records explicit operator approval with full 10-iter budget. Resume is authorized.

---

## State at Handoff (2026-05-23)

| Item | State |
|------|-------|
| `research/deep-research-config.json` | Created (1838 bytes). Topic + spec_folder + 10-iter budget + cli-devin/swe-1.6 executor + 1500-second timeout. References ADR-006 + ADR-002. |
| `research/deep-research-strategy.md` | Created (8257 bytes). Research question + charter (non-goals + stop conditions) + known-context inventory + per-iter guidance + synthesis contract. |
| `research/iterations/` | Empty dir |
| `research/deltas/` | Empty dir |
| `research/prompts/` | Empty dir |
| `research/logs/` | Empty dir |
| `research/deep-research-state.jsonl` | (absent — will be created by the loop on iter 1 dispatch) |
| `research/deep-research-dashboard.md` | (absent — will be created on iter 1) |
| `research/.deep-research.lock` | (absent — to be acquired by the resumed loop) |

---

## Resume Command (Recommended Path)

In a fresh Claude Code / OpenCode / Codex / Gemini session at the repo root:

```
/deep:start-research-loop :auto --spec-folder=.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/000-release-cleanup/001-deep-loop-runtime
```

The skill's auto YAML workflow will:

1. Detect existing `deep-research-config.json` (since `iterationCount: 0` and `convergenceState.stopReason: null`, this is a fresh-loop-not-yet-started state, not a restart).
2. Acquire `.deep-research.lock`.
3. Read `deep-research-strategy.md` for the charter + per-iter guidance.
4. Begin iteration 1 dispatch via Task to `@deep-research` LEAF agent.
5. The LEAF agent reads the executor config (cli-devin, swe-1.6, 1500s timeout) and dispatches accordingly.
6. Repeat for iters 2-10 OR until convergence (2 consecutive iters with `newInfoRatio < 0.05` AND zero new P0/P1 logic_gaps).

---

## Alternative: Manual Resume

If the `:auto` skill detects the existing config but classifies the state as something other than `fresh`, the operator may need to manually invoke with `--mode=fresh` or remove and recreate the config. The config and strategy are intentionally durable so any of these paths recover cleanly.

To force-restart the loop while preserving the strategy:

```bash
# Reset iter counter while keeping strategy
node -e '
  const fs = require("fs");
  const p = ".opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/000-release-cleanup/001-deep-loop-runtime/research/deep-research-config.json";
  const c = JSON.parse(fs.readFileSync(p, "utf8"));
  c.iterationCount = 0;
  c.lastIterationAt = null;
  c.convergenceState = { newInfoRatio: null, consecutiveLowDeltaIters: 0, stopReason: null };
  fs.writeFileSync(p, JSON.stringify(c, null, 2));
'
```

Then invoke `/deep:start-research-loop :auto --spec-folder=<path>` as above.

---

## Convergence Criteria (per ADR-002 + strategy.md)

- **Soft stop**: 2 consecutive iterations with `newInfoRatio < 0.05` AND zero new P0/P1 logic_gaps AND Bayesian-scorer confidence ≥ 0.9 → mark converged
- **Hard cap**: iter 10 regardless
- **Output per iter**: `research/iterations/iteration-{NNN}.md` (narrative) + `research/deltas/iter-{NN}.jsonl` (state delta with `type: "iteration"`)
- **Bundle gate per iter**: grep `internal_imports` + smoke-run `validation_commands` per memory `feedback_bundle_gate_smoke_run`
- **Between-iter cleanup**: `pkill -9 -f "devin|codex|opencode"` + sweep `/tmp/devin-*`, `/tmp/deep-research-*`

---

## Step 5b: After Convergence

When the loop terminates:

1. Author `research/research.md` (17-section template per `deep-research/references/loop_protocol.md`)
2. Emit `research/resource-map.md` (deep-research skill's resource-map, distinct from the spec folder's `resource-map.md`)
3. **Merge** novel logic gaps into `../resource-map.md` Phase-5 Augmentation section with `Source Iter` links
4. Author `research/convergence-summary.md` with stop reason + per-iter novelty rate
5. Fill `../implementation-summary.md` evidence rows (no template placeholders)
6. Final strict validate (`bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh ../ --strict` exit 0)
7. `/memory:save` writes continuity update
8. If `graph-metadata.json` touched anywhere across phases, re-run `skill_graph_compiler.py --export-json --pretty`
9. Confirm SC-007: `git diff --stat -- '.opencode/skills/deep-loop-runtime/lib/' '.opencode/skills/deep-loop-runtime/scripts/' '.opencode/skills/deep-loop-runtime/tests/' '.opencode/skills/deep-loop-runtime/storage/'` returns empty

---

## Packet Close

Once Step 5b is done:
- Update `checklist.md` CHK-5.* rows with completion evidence
- Update `tasks.md` T071-T122 status to `[x]`
- Update `decision-record.md` ADR-006 with the validation-report.md SHA from the final commit
- Update `spec.md` frontmatter `_memory.continuity.recent_action` + status if needed

---

## RELATED DOCUMENTS

- **Phase-4 gate evidence**: `../validation/validation-report.md` (passed; ADR-006 records approval)
- **Phase-2 findings input**: `../findings/audit-findings.jsonl` (21 findings, used as input to iter 1)
- **Spec**: `../spec.md` (research question + acceptance criteria)
- **Plan**: `../plan.md` §Phase 5
- **Tasks**: `../tasks.md` T071-T122
- **Decision Records**: `../decision-record.md` (ADR-002 executor choice; ADR-006 approval)
- **Strategy**: `deep-research-strategy.md` (this folder)
- **Config**: `deep-research-config.json` (this folder)
- **Skill SKILL.md**: `.opencode/skills/deep-research/SKILL.md` (mandatory pre-read per CLAUDE.md CLI dispatch rule for cli-devin SWE-1.6)
- **cli-devin SKILL.md**: `.opencode/skills/cli-devin/SKILL.md` (mandatory pre-read for SWE-1.6 RCAF + medium-density pre-planning)
- **sk-prompt-small-model SKILL.md**: `.opencode/skills/sk-prompt-small-model/SKILL.md` (mandatory pre-read per small-model dispatch rule)
