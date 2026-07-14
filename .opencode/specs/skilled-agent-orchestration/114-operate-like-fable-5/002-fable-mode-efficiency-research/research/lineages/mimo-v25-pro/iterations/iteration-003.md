# Iteration 3 — mimo-v25-pro lineage
**Focus:** Implementation path analysis for top recommendations
**Model:** xiaomi/mimo-v2.5-pro via cli-opencode
**Timestamp:** 2026-06-15T12:38:00Z

---

## Findings

### M11: Governor-in-agent-prompts: minimal change, high blast radius

**Surface:** All 12 `.opencode/agents/*.md` files
**Change:** Add a compact fable-5 governor block to the `Hook-Injected Advisor Context` section or as a new section after it.
**Example:**
```markdown
**Behavioral Governor (fable-5 compact):** Reason about the problem and the person, not yourself. Commit decisions; don't enumerate alternatives. Open with the result, not "I'll" / "Let me". Batch work and report once. Cut caveats addressed to no one.
```

**Blast radius:** HIGH — affects every agent dispatch across all runtimes. The 12 agents are the subagent surface the opus source identifies as "the only subagent surface" (G2).
**Risk:** Agent prompts are read by ALL models. The governor rules are Opus-specific (targeting "anxious texture"). For non-Opus models, rules like "one audit, then done" may be unnecessary or counterproductive.
**Mitigation:** Make the governor conditional on model family, or keep it generic (remove Opus-specific language, keep only the universal efficiency rules).
**Effort:** LOW — 12 file edits, no schema changes, no build step.

**Source:** `.opencode/agents/*.md` (all 12 files), `external/opus-fable-mode-main/governor-block.md`

### M12: Governor-in-executor-config: cleanest per-lineage attachment, requires schema change

**Surface:** `deep-loop-runtime/lib/deep-loop/executor-config.ts`
**Change:** Add optional `governor` field to `executorConfigSchema`:
```typescript
governor: z.string().nullable().default(null),
```
Then in prompt-pack rendering, pass the governor text as a template variable.

**Blast radius:** MEDIUM — only affects deep-loop iterations, not user-facing sessions. Per-lineage control (each fan-out lineage can have its own governor or none).
**Risk:** Schema change requires test updates (36 existing executor-config tests). The `EXECUTOR_KIND_FLAG_SUPPORT` map needs updating.
**Mitigation:** Optional field with null default = zero impact on existing configs.
**Effort:** MEDIUM — schema change + test updates + prompt-pack template variable + caller wiring.

**Source:** `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts:22-30`

### M13: Governor-in-prompt-pack-template: template variable injection, no schema change needed

**Surface:** `deep-loop-workflows/deep-research/assets/prompt_pack_iteration.md.tmpl`
**Change:** Add `{governor_block}` token to the template's CONSTRAINTS section:
```
{governor_block}
```
The caller passes an empty string or the governor text. The `renderPromptPack` function already handles variable substitution.

**Blast radius:** LOW — only affects deep-research iterations. Other deep-loop workflows (review, context, ai-council) have their own templates.
**Risk:** Template variable must be passed by the caller or `renderPromptPack` throws `PromptPackError`. Needs default handling.
**Mitigation:** Make the variable optional in `renderPromptPack` (currently all variables are required). Or use a conditional section pattern.
**Effort:** LOW-MEDIUM — template edit + caller wiring + optional-variable handling.

**Source:** `.opencode/skills/deep-loop-workflows/deep-research/assets/prompt_pack_iteration.md.tmpl`

### M14: Behavioral gates in post-dispatch-validate: measurement surface, non-blocking

**Surface:** `deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts`
**Change:** Add optional behavioral quality checks after structural validation:
- Tool:text ratio check (warn if < 2.0, the Fable target is 3.91)
- Result-first opening check (warn if iteration starts with "I'll" or "Let me")
- Caveat density check (warn if > threshold)

**Blast radius:** LOW — advisory only (warnings, not failures). Non-blocking by design.
**Risk:** Needs access to the iteration markdown content for text analysis. Currently `validateIterationOutputs` only checks structural completeness.
**Mitigation:** Add as optional advisory checks, gated by a config flag. Return as `PostDispatchAdvisory` codes, not failures.
**Effort:** MEDIUM — new advisory codes, text analysis logic, config flag, tests.

**Source:** `.opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts:12-26`

### M15: AGENTS.md dead pointer fix: one-character change, proof-of-concept for F6

**Surface:** `AGENTS.md` (or `CLAUDE.md`)
**Change:** Change `skill-advisor-hook.md` to `skill_advisor_hook.md` (hyphen → underscore)
**Blast radius:** TRIVIAL — one character in one file.
**Risk:** None — the file reference is already broken.
**Effort:** TRIVIAL — one edit.

**Value beyond the fix:** This is a live example of the F6 pattern ("engineer staleness out of artifacts"). The fix itself is trivial, but it demonstrates the principle: static pointers rot; convert them to checks or fix them immediately. A CI grep for the file's existence would be the F6 "table-walking test" equivalent.

**Source:** grep confirmed the actual filename is `skill_advisor_hook.md`; AGENTS.md references `skill-advisor-hook.md`

---

## Ruled Out
- Modifying `renderPromptPack` to support optional variables (too invasive for a governor feature)
- Adding behavioral gates as blocking checks in post-dispatch-validate (advisory-only is safer)
- Per-model governor variants in the initial release (start generic, specialize later)

## Assessment
- **newInfoRatio:** 0.70 (5 findings, mostly implementation details building on iterations 1-2)
- **Status:** complete
- **Focus for next iteration:** Measurement harness portability — how to adapt leak_test.py metrics for OpenCode and Codex runtimes
