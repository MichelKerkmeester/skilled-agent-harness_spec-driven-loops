# Iteration 4 — mimo-v25-pro lineage
**Focus:** Measurement harness portability across runtimes
**Model:** xiaomi/mimo-v2.5-pro via cli-opencode
**Timestamp:** 2026-06-15T12:41:00Z

---

## Findings

### M16: The deep-loop state JSONL is already a cross-runtime measurement surface

Every deep-loop iteration (research, review, context, ai-council, improvement) writes to `{artifact_dir}/deep-research-state.jsonl` (or the equivalent `deep-review-state.jsonl`, etc.). The record includes `type`, `iteration`, `newInfoRatio`, `status`, `focus`, and `executor` metadata.

**Source:** `deep-research/assets/prompt_pack_iteration.md.tmpl:43-49`

This JSONL already captures the **model** (via `executor` block) and the **iteration content** (via the iteration markdown file). A behavioral measurement harness could:
1. Read the JSONL records (model-agnostic — same format across all runtimes)
2. Read each `iterations/iteration-NNN.md` file
3. Compute the same metrics `leak_test.py` computes: words/msg, tool:text ratio, caveat%, self-opener%

**Implication:** The measurement harness doesn't need to parse runtime-specific log formats. It can use the deep-loop's own state files as the data source. This is already cross-runtime by design.

### M17: The iteration markdown files contain all the text needed for behavioral analysis

Each `iterations/iteration-NNN.md` file contains the agent's full output for that iteration. The text analysis metrics from `leak_test.py` can be computed directly on these files:

- **Words per iteration**: `wc -w iterations/iteration-NNN.md`
- **Result-first opening**: check if the first sentence starts with a result word (Done, Complete, Found, Result) vs. a self-reference (I'll, Let me, I will)
- **Caveat density**: count caveat phrases ("to be fair", "one caveat", "it's worth noting", etc.)
- **Tool:text ratio**: compare tool call count (from JSONL `executor` block) to prose word count

**Source:** `external/opus-fable-mode-main/leak_test.py:30-34` (caveat and self-opener lists)

**Implication:** The measurement harness can be a standalone script that reads the deep-loop state files. No runtime-specific log parsing needed. The metrics are computed from the same artifact format regardless of whether the executor was cli-opencode, cli-codex, cli-claude-code, or native.

### M18: The `post-dispatch-validate` advisory system is the right enforcement layer for behavioral metrics

`PostDispatchAdvisory` is already a typed output of `post-dispatch-validate.ts`. It carries `code`, `detail`, and optional `fieldPath`. Adding behavioral advisory codes is architecturally clean:

```typescript
// New advisory codes
{ code: 'behavioral_low_tool_text_ratio', detail: 'tool:text ratio 1.2 below target 3.0', fieldPath: 'iteration-003.md' }
{ code: 'behavioral_self_opener', detail: 'iteration opens with "I\'ll" instead of result word', fieldPath: 'iteration-003.md' }
{ code: 'behavioral_high_caveat_density', detail: '4 unsolicited caveats detected (target: 0-1)', fieldPath: 'iteration-003.md' }
```

**Source:** `.opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts:56`

**Implication:** These advisories are non-blocking (warnings, not failures), per-iteration, and auto-generated. They give operators a real-time signal that an iteration is drifting toward Opus-style verbosity without stopping the loop. Combined with the iteration JSONL, they create a longitudinal behavioral trend.

### M19: A standalone `fable_metrics.py` harness is more portable than modifying `leak_test.py`

Rather than adapting `leak_test.py` (which is tightly coupled to `~/.claude/projects/` JSONL), a new standalone script could:

1. Accept a path to any deep-loop artifact directory
2. Read `deep-research-state.jsonl` (or any `*-state.jsonl`)
3. Read each `iterations/iteration-NNN.md`
4. Compute behavioral metrics
5. Output the same table format as `leak_test.py`

**Input format:** `--artifact-dir <path>` (works for any deep-loop packet: research, review, context, ai-council)
**Metrics:** median words/iteration, tool:text ratio, caveat%, self-opener%, result-first opener%
**Output:** Same table as `leak_test.py` with per-iteration trend

**Source:** `external/opus-fable-mode-main/leak_test.py:49-159` (metric definitions and output format)

**Implication:** This is the Tier C deliverable. It's model-agnostic, runtime-agnostic, and uses the deep-loop's own artifacts as input. It can be run against any lineage (codex-xhigh, opus-account2, mimo-v25-pro) without modification.

### M20: The three-layer architecture (setpoint → thermostat → measurement) maps cleanly to Public's surfaces

From the opus source (G2): "setpoint(CLAUDE.md) → thermostat(UserPromptSubmit reinject) → measurement(leak_test)"

In Public's architecture:

| Layer | Opus equivalent | Public surface | Read-reliability |
|-------|----------------|---------------|-----------------|
| **Setpoint** | `CLAUDE.md` governor block | `AGENTS.md` §1 (Operating Discipline) + constitutional memories | High (all runtimes) |
| **Thermostat** | `reinject.sh` UserPromptSubmit hook | Skill-advisor hook (Claude: `user-prompt-submit.ts`, Codex: same, OpenCode: plugin bridge) | High (all runtimes, per M1) |
| **Measurement** | `leak_test.py` on `~/.claude/projects/` | `fable_metrics.py` on deep-loop state files | High (all deep-loop runtimes) |

**Source:** `external/opus-fable-mode-main/README.md:69-77`, `skill_advisor_hook.md:62-68`

**Implication:** Public already has the setpoint (round 1 shipped it) and the thermostat (the hook fires every prompt). The missing piece is measurement. A `fable_metrics.py` equivalent completes the three-layer architecture.

---

## Ruled Out
- Modifying `leak_test.py` directly (too coupled to `~/.claude/projects/`)
- Parsing runtime-specific session logs (unnecessary — deep-loop state files are the universal data source)
- Making behavioral metrics blocking in post-dispatch-validate (advisory-only is safer)

## Assessment
- **newInfoRatio:** 0.65 (5 findings, building on iterations 1-3 but with new measurement-specific insights)
- **Status:** complete
- **Focus for next iteration:** Final synthesis gaps — what has this lineage not covered? What questions remain? Convergence check.
