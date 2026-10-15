# Inventories (T002)

Taken at HEAD `828cb749da` on 2026-10-15, with `dist/` and `node_modules/` excluded from both searches.

## 1. Same-class producers

Command: `rg -n "GENERATED COMMAND BRIDGES|kind === 'command'|kind_priority" .skilled/skills/system-skill-advisor/runtime`

22 hits. The generated bridge blocks live in `lib/scorer/projection.ts` (lines 153 to 615) and `scripts/skill_advisor.py` (lines 2233 to 2498), and `derive-command-bridges.cjs` (lines 39 to 42) owns their markers. Command ranking policy lives in two places: the 0.08 command demotion in `lib/scorer/fusion.ts` (lines 776 and 777) and the `_kind_priority` sort key in `skill_advisor.py` (lines 4405 to 4485). Two readers of the command kind sit outside ranking: `lib/render.ts:170` and `handlers/advisor-validate.ts:503`.

```
.skilled/skills/system-skill-advisor/runtime/handlers/advisor-validate.ts:503:      if (top?.kind === 'command') commandBridgeFalsePositive += 1;
.skilled/skills/system-skill-advisor/runtime/lib/render.ts:170:    kind: recommendation.kind === 'command' ? 'command' : 'skill',
.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:39:const TS_GENERATED_START = '// BEGIN GENERATED COMMAND BRIDGES';
.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:40:const TS_GENERATED_END = '// END GENERATED COMMAND BRIDGES';
.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:41:const PY_GENERATED_START = '# BEGIN GENERATED COMMAND BRIDGES';
.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:42:const PY_GENERATED_END = '# END GENERATED COMMAND BRIDGES';
.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:2135:    # at `kind_priority=2`, so `/deep:research` lost its owning-skill
.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:2233:# BEGIN GENERATED COMMAND BRIDGES
.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:2498:# END GENERATED COMMAND BRIDGES
.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:2866:    normalized["_kind_priority"] = max(
.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:2867:        int(top.get("_kind_priority", 0)),
.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:2868:        int(normalized.get("_kind_priority", 0)),
.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:3955:            "_kind_priority": 1,
.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4405:            kind_priority = 2 if name == explicit_command_intent else (1 if kind == "command" else 0)
.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4407:            kind_priority = 1 if kind == "skill" else 0
.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4418:            "_kind_priority": kind_priority,
.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4470:            x['_kind_priority'],
.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4485:        rec.pop('_kind_priority', None)
.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:776:    const leftCommandBonus = left.kind === 'command' && !promptLower.includes('/') ? -0.08 : 0;
.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:777:    const rightCommandBonus = right.kind === 'command' && !promptLower.includes('/') ? -0.08 : 0;
.skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts:153:// BEGIN GENERATED COMMAND BRIDGES
.skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts:615:// END GENERATED COMMAND BRIDGES
```

## 2. Consumers of the changed symbols

Command: `rg -n "renderAdvisorBrief|renderAdvisorFallbackDirective|GENERATED_COMMAND_BRIDGES" .skilled --glob '*.ts' --glob '*.js' --glob '*.md'`

97 hits across 27 files. Per file:

```
   1 .skilled/hooks/injection-contract.md
   1 .skilled/skills/system-skill-advisor/ARCHITECTURE.md
   1 .skilled/skills/system-skill-advisor/feature-catalog/cli-surface/compat-entrypoint.md
   2 .skilled/skills/system-skill-advisor/feature-catalog/hooks-and-plugin/opencode-plugin-bridge.md
   1 .skilled/skills/system-skill-advisor/feature-catalog/hooks-and-plugin/pi-prompt-advisor.md
   6 .skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts
   4 .skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts
   1 .skilled/skills/system-skill-advisor/hooks/pi/README.md
   4 .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook-validation.md
   3 .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md
   4 .skilled/skills/system-skill-advisor/runtime/bench/hook-brief-signal-noise.bench.ts
   1 .skilled/skills/system-skill-advisor/runtime/compat/index.ts
   3 .skilled/skills/system-skill-advisor/runtime/lib/render.ts
   2 .skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts
   2 .skilled/skills/system-skill-advisor/runtime/lib/skill-advisor-brief.ts
   4 .skilled/skills/system-skill-advisor/runtime/tests/command-bridges-drift-guard.vitest.ts
   7 .skilled/skills/system-skill-advisor/runtime/tests/hooks/claude-user-prompt-submit-hook.vitest.ts
   2 .skilled/skills/system-skill-advisor/runtime/tests/hooks/prompt-advisor.vitest.ts
   5 .skilled/skills/system-skill-advisor/runtime/tests/hooks/runtime-parity.vitest.ts
   3 .skilled/skills/system-skill-advisor/runtime/tests/legacy/advisor-brief-producer.vitest.ts
   2 .skilled/skills/system-skill-advisor/runtime/tests/legacy/advisor-privacy.vitest.ts
  18 .skilled/skills/system-skill-advisor/runtime/tests/legacy/advisor-renderer.vitest.ts
   4 .skilled/skills/system-skill-advisor/runtime/tests/parity/policy-plan-serializer-parity.vitest.ts
   4 .skilled/skills/system-skill-advisor/runtime/tests/policy-observation-sink.vitest.ts
   4 .skilled/skills/system-skill-advisor/runtime/tests/policy-plan-negative-controls.vitest.ts
   4 .skilled/skills/system-skill-advisor/runtime/tests/system-skill-advisor-plugin.vitest.ts
   4 .skilled/skills/system-spec-kit/runtime/tests/copilot-user-prompt-submit-hook.vitest.ts
```

The runtime callers of the renderer are the Claude hook (`user-prompt-submit.ts:306` and `:336`), the Pi hook, which calls the fallback with no arguments (`prompt-advisor.ts:283`), and `lib/skill-advisor-brief.ts:194`. `compat/index.ts:9` only re-exports `renderAdvisorBrief`. The Copilot hook test under system-spec-kit defines its own local `renderAdvisorBrief`, so it is a name match and not a consumer. The test files that pin brief text are `tests/legacy/advisor-renderer.vitest.ts`, the three hook tests and `tests/hooks/runtime-parity.vitest.ts`.

## 3. Matrix axes

- Prompt kind: onboarding, uncontested diagnostic, contested diagnostic, skill-shaped control, typed slash command, gold-`none`.
- Scorer: TypeScript, Python.
- Render mode: single, ambiguous, no-match.

That gives 6 x 2 x 3 = 36 cells. The Python scorer matches doctor bridges on slash markers only, so in the Python column only the typed slash command row can surface a doctor bridge.

## 4. Ordering invariant

No doctor bridge sorts above a skill that passes the threshold unless the prompt contains that doctor command's slash marker.
