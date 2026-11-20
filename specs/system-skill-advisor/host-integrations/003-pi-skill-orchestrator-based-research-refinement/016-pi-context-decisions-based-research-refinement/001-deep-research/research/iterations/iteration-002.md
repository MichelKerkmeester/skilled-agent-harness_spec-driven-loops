# Iteration 2: Allowlists, failure policy and observability (RQ5, RQ6, RQ8)

## Focus

RQ5 (allowlists and pins), RQ6 (fail-closed versus fail-open) and RQ8 (why-was-this-surfaced history), taken together as the one strategy key question. I read them narrowly: what each system does on the code path, which failures each policy hides, and whether a gap is worth closing. The polarity difference between a filter (the extension) and an additive hint (the advisor) came up early and shapes all three answers.

## Actions Taken

1. Read the state files, iteration 1 and the RQ5-RQ8 lines of the Research Brief.
2. Grepped the extension `src/` for allowlist, fail mode, timeout and abort handling. Read `src/apps/skill-filter.ts:55-106` and `src/extension/decisions-history.ts:1-110`.
3. Read the advisor Claude hook `hooks/claude/user-prompt-submit.ts:225-479` for every return path and its diagnostic.
4. Read the advisor diagnostic record schema and persistence rule in `runtime/lib/metrics.ts`, and the command table in `references/runtime/tool-ids-reference.md`.
5. Read the fallback directive renderer `runtime/lib/render.ts:630-674`.

## Findings

1. **The extension's failure policy is a filter policy: fail-closed keeps only pins and unfilterable skills (confirmed).** When the decision fails or the policy is invalid, the kept set is the skills with `disableModelInvocation` plus the pinned set; fail-open keeps the whole list [SOURCE: specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/context/pi-context-decisions-main/src/apps/skill-filter.ts:68-74]. An invalid policy can never opt in to fail-open [SOURCE: specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/context/pi-context-decisions-main/src/apps/skill-filter.ts:69-70]. The default is `failMode: "closed"`, `timeoutMs: 8000` [SOURCE: specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/context/pi-context-decisions-main/src/settings.ts:67]. Errors are reduced to a closed set of safe codes, with anything else mapped to `decision-failed` [SOURCE: specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/context/pi-context-decisions-main/src/apps/skill-filter.ts:102-106].

2. **The two policy words mean opposite outcomes in the two systems (inference). Do not port "fail-closed" by name.** The extension filters a list the host would otherwise advertise in full, so its fail-open costs tokens and its fail-closed risks hiding a needed skill. The advisor adds a hint on top of a skill list the host already advertises, so its "fail open" (emit nothing) already lands on the extension's fail-closed outcome minus the pins. [INFERENCE: based on skill-filter.ts:68-74 and the advisor hook's empty returns at user-prompt-submit.ts:326,340,356,479.] Porting the extension's fail-closed default would therefore mean nothing for the advisor. The question that transfers is which failures each policy hides from whom.

3. **The advisor has two fail-open outcomes, and one of them is silent to the model (confirmed). ADAPT.** When the CLI returns a failed or absent result, the hook emits a visible outage directive with a hand-routing command [SOURCE: .skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:389] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:633-663]. The parse-failure paths and the unhandled-exception path return `{}`: no context at all, with only a stderr line and the durable diagnostic [SOURCE: .skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:329-356] [SOURCE: .skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:468-479]. The model then cannot tell "advisor crashed" from "advisor disabled". The kill-switch path (`status: 'skipped'`) correctly returns `{}` [SOURCE: .skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:317-326]. The unhandled-exception path is the one that hides a real fault from the model. Candidate: on the unhandled catch, emit the static `renderAdvisorTimeoutFallback()` text, which needs no scorer state [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:669-674]. That would need its own try, so a render fault cannot escalate. Whether the other runtime hooks share the same `{}` path is UNKNOWN; I read only the Claude hook.

4. **The extension tells the operator; the advisor tells only the record (confirmed both sides, gap inferred). ADAPT, low priority.** The extension raises a warning naming the reason and code and pointing at `/decisions status`. It skips the warning for `aborted`, so a superseded prompt does not nag [SOURCE: specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/context/pi-context-decisions-main/src/extension/runtime.ts:329]. Superseded or aborted decisions are still recorded as `fail-closed` with `errorCode: "aborted"` [SOURCE: specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/context/pi-context-decisions-main/src/extension/runtime.ts:282-287]. The advisor's operator signal is a rolling fail-open rate with warn and page thresholds in the hook health section [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:66-79]. That catches a sustained outage. It cannot catch one silent crash on the prompt that mattered. Finding 3 closes most of this gap through the model, so no separate operator channel is proposed.

5. **Pins (RQ5): the extension's pins are the fail-closed floor and a scoring bypass; the advisor has no pin concept (confirmed). REJECT a pinned set in the brief.** Effective pins are the union of `relevance.pinned` and the global and project allowlists [SOURCE: specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/context/pi-context-decisions-main/src/extension/runtime.ts:223]. Pinned skills skip scoring and the cap [SOURCE: specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/context/pi-context-decisions-main/src/apps/skill-filter.ts:76-78]. Names are bounded, at most 1000 [SOURCE: specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/context/pi-context-decisions-main/src/apps/allowlist.ts:18-24]. In the advisor, grep over `runtime/lib`, `references` and the Claude hook found no pinned or always-surface set; the only constant block is the directive and hygiene text appended to every brief [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:663]. Pins exist in the extension because filtering can hide a skill. The advisor never hides a skill, since the host still lists every skill. A pin would repeat a constant line on every prompt, which is the churn the directive-lifecycle dedup was built to remove [SOURCE: .skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:390-427]. The "always route X" need is already met outside the advisor by the framework's Gate 2 artifact trigger (sk-code before code writes, sk-doc before `.md` writes). [INFERENCE: from the loaded CLAUDE.md Gate 2 text; not an advisor file.]

6. **Observability (RQ8): the extension keeps a replayable per-turn history with each skill's score and threshold; the advisor's durable record drops the skill on purpose (confirmed). ADAPT, opt-in only.** The extension history is read from the committed branch. It marks each advertised skill with `score X / ≥min` on the same 0-2 scale, or `pinned (allowlist)`, `base`, `re-delivered` or `unknown`, and never infers a mark from current settings [SOURCE: specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/context/pi-context-decisions-main/src/extension/decisions-history.ts:12-27] [SOURCE: specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/context/pi-context-decisions-main/src/extension/decisions-history.ts:47-77]. The advisor's diagnostic record has `skillLabel` but no confidence, uncertainty or lane [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:50-64]. Persistence strips `skillLabel` and `errorDetails` unless `SKILL_ADVISOR_DEBUG` is set, because they say what the prompt was about [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:456-460]. "Why" is answerable only live: `advisor_recommend` with `includeAttribution` returns lane attribution for a prompt you re-run, and `advisor_status` reports freshness and lane weights [SOURCE: .skilled/skills/system-skill-advisor/references/runtime/tool-ids-reference.md:48-50]. The gap: after the fact, you cannot see what was surfaced on prompt N, or why, without the prompt. Re-running needs the prompt text, and that text may hit a different generation or cache state. Candidate: under the existing `SKILL_ADVISOR_DEBUG` opt-in only, add the top recommendation's confidence, uncertainty and `dominantLane` to the persisted record. The type already carries `dominantLane` [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/types.ts:165]. The prompt-free default stays as it is. Making it default-on would break a deliberate prompt-safety invariant, so it is rejected.

7. **The extension's recorded-not-inferred rule is the transferable discipline (confirmed for the extension; advisor side inferred).** The history note says counts are historical advertisements, not proof of provider visibility, and that missing picks are `unknown` rather than recomputed [SOURCE: specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/context/pi-context-decisions-main/src/extension/decisions-history.ts:27]. Any advisor "why" view built on finding 6 should follow the same rule. Show what was recorded at emit time, and mark gaps `unknown`, never a fresh re-score dressed as history. [INFERENCE: a re-score after an `advisor_rebuild` can differ from what was emitted.]

## Questions Answered

- Allowlists, failure policy and observability (RQ5, RQ6, RQ8): pinned always-surface sets, fail-closed versus fail-open, and why-was-this-surfaced history. Which gaps does the advisor have?
  - Answered. Pins: REJECT in the brief (finding 5). Failure: polarity inverts (finding 2); one real gap, the silent unhandled-exception `{}` (finding 3, ADAPT). Observability: opt-in recorded score and lane under the debug flag (findings 6-7, ADAPT). Open: whether the non-Claude hooks share the silent path.

## Questions Remaining

- RQ2 additive per-branch advertising and brief churn.
- RQ3 previous-reply context for short follow-ups.
- RQ7 tool and MCP filtering.

## Ruled Out

- Porting the extension's `failMode: "closed"` default by name (finding 2). The polarity is inverted for an additive advisor.
- An operator-pinned always-surface skill set in the brief (finding 5).
- Default-on persistence of surfaced skills or "why" fields (finding 6). It breaks the prompt-free record invariant.

## Dead Ends

- None. The grep for an advisor pin concept was a clean no-hit, which counts as evidence for finding 5, not a dead end.

## Edge Cases

- Ambiguous input: three RQs share one key question. I answered each one with its own verdict.
- Contradictory evidence: none.
- Missing dependencies: the non-Claude runtime hooks (Codex, Devin and others) were not read, so finding 3 is confirmed for Claude only.
- Partial success: none. I did not create or update `research/research.md` even though `progressiveSynthesis` is true, because the dispatch prompt's allowed-write list names only the iteration and delta files. The synthesis step owns that file.

## Sources Consulted

- `context/pi-context-decisions-main/src/apps/skill-filter.ts:55-106`
- `context/pi-context-decisions-main/src/apps/allowlist.ts:10-73`
- `context/pi-context-decisions-main/src/settings.ts:67,189-192`
- `context/pi-context-decisions-main/src/extension/runtime.ts:223,254,282-287,316,329`
- `context/pi-context-decisions-main/src/extension/decisions-history.ts:1-110`
- `.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:225-479`
- `.skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:24-79,456-460`
- `.skilled/skills/system-skill-advisor/runtime/lib/render.ts:630-674`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/types.ts:165`
- `.skilled/skills/system-skill-advisor/references/runtime/tool-ids-reference.md:48-51`

## Assessment

- New information ratio: 0.86. Six of 7 findings are fully new. Finding 4 is partially new, because the rolling fail-open rate is a known health surface from the sibling R3 diagnostics work.
- Questions addressed: RQ5, RQ6, RQ8
- Questions answered: the RQ5/RQ6/RQ8 key question

## Reflection

- What worked and why: grepping the extension with one regex across `src/` and counting per file first. It pointed straight at `skill-filter.ts`, `runtime.ts` and `decisions-history.ts`. Reading the hook's return paths in one block made the two kinds of fail-open visible.
- What did not work and why: shell variables, `cd &&` with `ls`, and pipes into `sed` were rejected by the permission layer. That cost 4 calls. Single commands with literal absolute paths work.
- What I would do differently: grep the Codex, Devin and OpenCode hooks for `return {}` in the same call as the Claude hook, so finding 3 covers every runtime.

## Recommended Next Focus

RQ2 brief churn and session memory: read `runtime/lib/prompt-cache.ts`, the directive-lifecycle dedup module behind `decideDirectiveLifecycleDelivery`, and the extension's `src/extension/skill-state.ts` and `test/extension-additive-runtime.test.ts`. Carry forward: does the silent `{}` path exist in the non-Claude hooks (finding 3)?
