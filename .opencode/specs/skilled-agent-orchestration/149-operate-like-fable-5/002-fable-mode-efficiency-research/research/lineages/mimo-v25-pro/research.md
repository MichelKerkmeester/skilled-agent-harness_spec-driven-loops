# Research Synthesis — mimo-v25-pro lineage

**Lineage:** mimo-v25-pro (cli-opencode `xiaomi/mimo-v2.5-pro`)
**Session:** fanout-mimo-v25-pro-1781518620710-yepc7q
**Iterations:** 5/5 (max_iterations reached, not converged)
**newInfoRatio trend:** 0.75 → 0.80 → 0.70 → 0.65 → 0.60
**Findings:** 25 (M1-M25)
**Spec folder:** `149-operate-like-fable-5/002-fable-mode-efficiency-research`
**Sources:** `external/fable-mode-main/`, `external/opus-fable-mode-main/`, `external/Fable5.md`, live codebase inspection

---

## 1. Headline — cross-runtime transferability is better than the prior lineages stated

The codex-xhigh and opus-account2 lineages produced excellent extraction and ranking, but flagged "OpenCode/Codex per-turn-hook read-reliability is unverified." This lineage investigated that claim and found it **overly cautious**: the skill-advisor hook system is documented and tested across all three runtimes (Claude Code, Codex CLI, OpenCode), with smoke tests in `skill_advisor_hook.md`. The thermostat surface exists everywhere — it's just wired differently per runtime.

The unique contribution of this lineage is the **cross-runtime transferability lens**: which surfaces work the same across runtimes, which are architecturally different, and what that means for the governor-on-hook recommendation.

---

## 2. Net-new findings vs. prior lineages

### Corrected claims

| Prior lineage claim | Correction | Evidence |
|---|---|---|
| "OpenCode/Codex hook read-reliability is unverified" | Verified — `skill_advisor_hook.md` documents all 3 runtimes | `skill_advisor_hook.md:62-68` |
| "~17 constitutional memories" | Exact: 16 rules + 1 README; 2 are round-1 products | glob of `constitutional/*.md` |
| "leak_test.py as measurement" | Standalone `fable_metrics.py` on deep-loop state files is more portable | `leak_test.py:56-95` (Claude-specific paths) |

### New surfaces identified

| Surface | Type | Prior lineage coverage | This lineage's finding |
|---|---|---|---|
| Agent prompts (12 agents) | Governor injection | Not named | M6, M11: The subagent injection surface — hook doesn't fire for subagents, but agent prompts do |
| `renderPromptPack` | Behavioral injection | Not named | M8, M13: Template-driven injection for every deep-loop iteration |
| `post-dispatch-validate` | Measurement enforcement | Not named | M9, M14, M18: Advisory behavioral metrics per iteration |
| `executor-config` | Per-lineage governor | Not named | M10, M12: Schema field for per-model governor blocks |
| Deep-loop state JSONL | Cross-runtime measurement | Not named | M16, M17: Already universal data source for behavioral analysis |

### New architectural insights

1. **OpenCode's hook is system prompt mutation** (M2) — stronger than Claude/Codex's additionalContext injection. The governor can be woven into the system prompt, not just appended.

2. **The governor is model-specific** (M3) — the 8 rules target Opus's "anxious texture." Non-Anthropic models may not share this failure mode. Governor should be parameterized per model family.

3. **The three-layer architecture maps cleanly to Public** (M20) — setpoint (AGENTS.md + constitutional memories), thermostat (skill-advisor hook), measurement (proposed `fable_metrics.py`). Only the measurement layer is missing.

4. **Five implementation paths for the governor** (M11-M15) — from trivial (agent prompts, one-line edits) to moderate (executor-config schema change). Blast radius ranges from trivial to high.

---

## 3. Recommendations for the merged research

### Tier A (doctrine text)
- Fix the AGENTS.md dead pointer (`skill-advisor-hook.md` → `skill_advisor_hook.md`) — proof-of-concept for F6 staleness pattern (M4, M15)
- Add "model-specific governor tuning" as a principle — the governor rules should be parameterized per model family, not one-size-fits-all (M3)

### Tier B (mechanisms)
- **B1: Governor-in-agent-prompts** — add compact fable-5 rules to the `Hook-Injected Advisor Context` section of all 12 agent prompts. Minimal change, high blast radius. Start with generic efficiency rules (not Opus-specific). (M6, M11)
- **B2: Governor-in-executor-config** — add optional `governor` field to `executorConfigSchema`. Per-lineage control. Medium effort. (M10, M12)
- **B3: Governor-in-prompt-pack-template** — add `{governor_block}` variable to iteration prompt templates. Low effort for deep-loop iterations. (M8, M13)

### Tier C (measurement)
- **C1: Standalone `fable_metrics.py`** — reads deep-loop state JSONL + iteration markdown files. Computes words/iteration, tool:text ratio, caveat%, self-opener%. Model-agnostic, runtime-agnostic. (M16, M17, M19)
- **C2: Behavioral advisories in post-dispatch-validate** — non-blocking warnings for low tool:text ratio, self-openers, high caveat density. (M9, M14, M18)

---

## 4. Implementation priority (this lineage's recommendation)

1. **Fix the dead pointer** (trivial, immediate) — Tier A
2. **Capture a behavioral baseline** using the deep-loop state files (before any governor changes) — Tier C prerequisite
3. **Governor-in-agent-prompts** (generic efficiency rules, not Opus-specific) — Tier B, highest reach
4. **Standalone `fable_metrics.py`** — Tier C, completes the three-layer architecture
5. **Governor-in-executor-config** — Tier B, for per-lineage control in deep-loop runs

---

## 5. Eliminated alternatives

| Approach | Reason eliminated | Evidence |
|---|---|---|
| Modifying `leak_test.py` directly | Too coupled to `~/.claude/projects/` — Claude-specific | `leak_test.py:56-95` |
| Optional variables in `renderPromptPack` | Too invasive — currently all variables are required | `prompt-pack.ts:55-73` |
| Blocking behavioral gates | Premature — advisory-only is safer until baselines are captured | `post-dispatch-validate.ts:12-26` |
| Per-model governor variants initially | Premature — start generic, specialize after empirical validation | M3 analysis |
| Constitutional memories as behavioral surfaces | They're rule-level, not style-level | M7 analysis |

---

## 6. Open questions

1. Should the governor rules be generic ("be concise, result-first") or model-family-specific ("Opus: stop self-auditing")?
2. Should behavioral advisories eventually be promoted from warning to blocking?
3. What's the right scope for agent prompt modification — all 12 agents or just implementation agents (code, review, context)?
4. How does mimo-v2.5-pro actually respond to fable-5 directives? (Empirical question, not research answerable)

---

## 7. References

- `external/fable-mode-main/{fable-mode-profile.md, fable-mode.md, README.md}`
- `external/opus-fable-mode-main/{governor-block.md, fable-mode.md, reinject.sh, leak_test.py, README.md}`
- `external/Fable5.md`
- `.opencode/skills/system-spec-kit/references/hooks/skill_advisor_hook.md` (cross-runtime hook reference)
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts` (executor schema)
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/prompt-pack.ts` (template renderer)
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts` (iteration validator)
- `.opencode/skills/deep-loop-workflows/deep-research/assets/prompt_pack_iteration.md.tmpl` (iteration template)
- `.opencode/agents/*.md` (all 12 agent prompts)
- `.opencode/skills/system-spec-kit/constitutional/*.md` (17 files)
- Per-lineage iterations: `research/lineages/mimo-v25-pro/iterations/iteration-{001..005}.md`
