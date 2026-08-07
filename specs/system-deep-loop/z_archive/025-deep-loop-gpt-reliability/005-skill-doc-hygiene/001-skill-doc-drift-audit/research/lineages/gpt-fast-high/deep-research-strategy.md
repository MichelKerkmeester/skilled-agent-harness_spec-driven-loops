# Deep Research Strategy: Skill Doc Drift Audit

## Research Topic

Investigate whether `SKILL.md` files, `references/`, `assets/`, and READMEs across `.opencode/skills/` went stale because packet `031-deep-loop-issues-with-gpt-opencode` changed deep-loop routing, ai-council mode, plugin guarding, benchmark conclusions, FIX-5 disposition, and OpenCode TOML mirror expectations.

## Known Context

- In-scope candidate list is defined in `.opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/014-skill-doc-drift-audit/spec.md:67-122`.
- Phase 009 added orchestrate priority rows for `@deep-context` and `@deep-review`, registry-backed `Deep Route:` resolution, and a hard boundary against Task-dispatching `@deep` itself. [SOURCE: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/009-orchestrate-universal-routing/implementation-summary.md:48-60]
- Phase 010 converted `.opencode/agents/ai-council.md` from `mode: all` to `mode: subagent` and verified direct `opencode run --agent ai-council` is rejected. [SOURCE: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/010-ai-council-subagent-only/implementation-summary.md:48-60]
- Phase 011 added `.opencode/plugins/mk-deep-loop-guard.js`, renamed from `deep-route-guard.js`, with `MK_DEEP_LOOP_GUARD_REJECT`. [SOURCE: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/011-deep-route-guard-plugin/implementation-summary.md:48-58] [SOURCE: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/011-deep-route-guard-plugin/implementation-summary.md:129-139]
- Phase 012 benchmark found zero Mode-D recurrences, zero route mismatches, and a GPT latency gap. [SOURCE: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/012-gpt-claude-benchmark/implementation-summary.md:54-57]
- Phase 013 closed FIX-5 as unnecessary because the trigger conditions were not met. [SOURCE: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/013-fix5-checkpoint/implementation-summary.md:48-56]
- The 014 charter records `.opencode/agents/*.toml` mirrors as removed obsolete requirements. [SOURCE: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/014-skill-doc-drift-audit/spec.md:56]
- `resource-map.md` was not present in the target spec folder at init; coverage gate skipped.

## Key Questions

- Which docs still claim `ai-council` is direct/top-level/primary after phase 010?
- Which docs still reference old `deep-route-guard` names, env vars, or omit `mk-deep-loop-guard` after phase 011?
- Which docs still require `.opencode/agents/*.toml` mirrors after the obsolete mirror requirement was removed?
- Which docs still contradict phase 009's registry-backed orchestrate routing?
- Which docs remain current and should not be flagged?

## Answered Questions

- `cli-opencode` has direct/top-level `ai-council` drift in `SKILL.md`, `README.md`, and `assets/prompt_templates.md`.
- `.opencode/plugins/README.md` omits `mk-deep-loop-guard.js` and has an outdated entrypoint count.
- Core deep-loop docs and deep-improvement integration-scanner docs still encode `.opencode/agents/*.toml` as active runtime mirrors.
- `deep-ai-council/SKILL.md` combines a stale primary-agent claim with a stale TOML mirror claim.
- No live skill-doc references to the removed `deep-route-guard.js` file were found outside historical phase summaries; current skill/runtime docs that mention the guard use `mk-deep-loop-guard`.
- Top-level `AGENTS.md` and root `README.md` did not show 031-caused stale routing or plugin claims in the checked lines.

## What Worked

- Exact Grep for `--agent ai-council`, `mode: all`, `mode: subagent`, `deep-route-guard`, `mk-deep-loop-guard`, and `.opencode/agents/*.toml` quickly found high-signal candidates.
- Phase implementation summaries provided exact contradiction evidence for ai-council, orchestrate, plugin, benchmark, and FIX-5 changes.
- Current filesystem checks were decisive for removed file surfaces: no `.opencode/agents/*.toml`, no `.opencode/plugins/deep-route-guard.js`, and present `.opencode/plugins/mk-deep-loop-guard.js`.

## What Failed

- The audit charter names TOML mirror removal, but no dedicated phase implementation summary for that removal was found; the research therefore cites the 014 charter plus current filesystem state for that contradiction class.
- Some stale mirror docs are coupled to still-existing implementation assumptions in `scan-integration.cjs`, so the drift is not purely prose; it may require follow-up implementation changes, not only doc edits.

## Exhausted Approaches

- Treating all `ai-council` mentions as stale was rejected. Mentions of packet-local `ai-council/**` artifacts, registry mode keys, or neutral rosters remain current.
- Treating historical phase summaries as stale was rejected. Phase 011 explicitly preserves old `deep-route-guard` names as historical records.

## Ruled-Out Directions

- `AGENTS.md` deep-ai-council quick-reference row is not stale: it names `/deep:ai-council` and `ai-council/**` artifacts, not direct `--agent` reachability. [SOURCE: AGENTS.md:453]
- Root `README.md` neutral roster/feature mentions are not stale unless they claim direct top-level invocation or the removed TOML mirror path. [SOURCE: README.md:850] [SOURCE: README.md:1169-1170]

## Next Focus

Synthesis complete. Follow-up should patch stale docs and decide whether deep-improvement's scanner implementation should drop `.opencode/agents/{name}.toml` from active mirror templates.

## Non-Goals

- Do not modify source docs in this research lineage.
- Do not rewrite skill or plugin docs here.
- Do not run live `opencode run` dispatches; this lineage is evidence-gathering only.

## Stop Conditions

- Stop after exactly 10 iterations per `stopPolicy: max-iterations`.
- Produce a cited stale-doc list or explicitly confirm no stale docs.
- Write all outputs only under the lineage artifact directory.
