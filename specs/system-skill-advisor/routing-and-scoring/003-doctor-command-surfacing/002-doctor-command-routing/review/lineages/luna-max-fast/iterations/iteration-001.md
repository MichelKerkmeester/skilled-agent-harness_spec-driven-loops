# Iteration 1 — Advisor code correctness

## Dimension

Correctness, with a focused pass over command intent, fallback qualification, generated bridge parity, and hook delivery.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/render.ts:100-205,445-570`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:650-690,925-955`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts:235-275`
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:515-545,880-900,2238-2405,2909-2988,4380-4390,4518-4560`
- `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:180-260,395-490`
- `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/scoring-compatibility.json:360-415`
- `.skilled/skills/system-skill-advisor/README.md:56-60,192-195`
- `.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:49-51,328-343`
- `.skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts:230-290`
- `.opencode/plugins/system-skill-advisor.js:1290-1305`
- `.opencode/plugins/lib/skill-advisor-render.js:20-65`
- `.skilled/commands/doctor/scripts/doctor-phrase-reach.cjs:1-260`
- `.skilled/skills/system-skill-advisor/runtime/tests/doctor-command-bridges.vitest.ts:1-195`
- `.skilled/skills/system-skill-advisor/runtime/tests/doctor-brief-render.vitest.ts:1-145`
- `.skilled/skills/system-skill-advisor/runtime/tests/doctor-routing-slice.vitest.ts:1-155`
- `.skilled/skills/system-skill-advisor/runtime/tests/hooks/doctor-setup-hint.vitest.ts:1-120`
- `.skilled/skills/system-skill-advisor/runtime/tests/scorer/doctor-ordering.vitest.ts:1-100`
- `.skilled/skills/system-skill-advisor/runtime/stress-test/skill-advisor/single-writer-lease-stress.vitest.ts:1-120`

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **Quoted doctor-command text bypasses skill-first ordering** — `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:679` — The reorder guard treats any `/doctor:` substring as a typed invocation. The preceding phrase-anchor check accepts an `explicit_author` match without distinguishing quoted text (`fusion.ts:663-666`); Python's `detect_explicit_command_intent` also matches a slash marker anywhere in the prompt (`skill_advisor.py:2909-2916`). A question that discusses a command can therefore preserve a passing doctor bridge above the skill for the actual task.
   - Finding class: routing-disambiguation
   - Scope proof: The scoring path and its explicit-author anchor are in the configured advisor-code scope; the Python bridge matcher provides a second runtime comparison.
   - Affected surface hints: TypeScript scorer ordering, Python explicit-command priority, rendered advisor brief.
   - Case: `Review the routing taxonomy and explain the quoted example "/doctor:setup".` If both the review skill and setup bridge pass and the bridge ranks first, the substring guard returns the doctor-first ordering unchanged even though the slash text is being discussed.
   - Recommendation: Distinguish an actual slash-command invocation from a quoted or referenced command before accepting the anchor and bypassing skill-first ordering.

2. **Generic “check” wording advertises setup on unrelated no-match prompts** — `.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:51` — `SETUP_WORDING` treats every standalone “check” inflection as setup wording. The hook passes that boolean into the no-match renderer (`:338`), which then recommends `/doctor:setup` (`runtime/lib/render.ts:547-548`). Pi and OpenCode use the same broad predicate, so the false hint crosses runtime surfaces.
   - Finding class: fallback-intent-qualification
   - Scope proof: The predicate, its hook call site, and the conditional fallback text were read directly; the setup-hint tests cover environment checks and a French-capital no-match, but not unrelated prompts containing “check”.
   - Affected surface hints: Claude hook fallback, Pi timeout fallback, OpenCode plugin fallback.
   - Case: If `Check what time the tide turns` receives no advisor recommendation, the predicate is true and the no-match context suggests `/doctor:setup` even though the request is unrelated to tooling setup or health.
   - Recommendation: Require setup, environment, installation, or tooling-health context in addition to a generic check verb.

## Traceability Checks

- The bridge generator derives doctor phrases and runnable strings from `_routes.yaml`; the TypeScript bridge and renderer tests independently recompute manifest expectations. Those checks were read, not run.
- The routing slice and ordering cases cover direct slash invocation and doctor-versus-skill placement, but do not cover a quoted slash-command reference.
- Setup-hint cases cover positive setup wording and a generic unrelated no-match without setup verbs; they do not cover a generic “check” prompt that misses all skills.
- No runtime tests, test runners, builds, or validators were run in this iteration, as directed.

## Scope Violations

- The workflow's legacy-state migration step was skipped because it can move or rewrite review state outside the bound lineage directory.
- The workflow's coverage-graph seed/upsert step was skipped because it writes to shared graph storage outside the bound lineage directory. Graph-assisted coverage is therefore unavailable; this review uses direct reads and exact searches.
- No write outside the lineage directory was performed.

## Next Dimension

Review `/doctor:setup` command content, YAML and presentation, route behavior, and all five runtime mirrors for executable parity and read-only guarantees.

## Verdict

Review verdict: CONDITIONAL
