# Iteration 2: What each hop surface reads and emits (Q2)

## Focus

Question 2: for each hop surface, what does it read and what does it emit, and does the purpose travel. Surfaces covered: the Claude compaction hook and session-prime, their counterparts in the codex, dsh, pi and devin adapters, `/speckit:resume`, `/speckit:handoff` and the relaunch note, `/speckit:save` through `generate-context.js`, the deep-loop iteration prompt, and the child-dispatch brief contract.

## Findings

1. The startup hop carries no purpose. When no cached brief exists, `session-prime` returns a fixed surface whose only state line is "Continuity: recover on demand from the packet docs", plus two recovery tools (`/speckit:resume`, a ripgrep over `specs/`). No packet field is read and no purpose is emitted. [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/session-prime.ts:230-251]

2. The Claude pre-compaction hook's transcript analysis emits exactly three sections: `## Active Files`, `## Recent Topics` and `## Recent Context` (the last five meaningful transcript lines). Nothing reconstructs the project's why from the packet. [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/compact-inject.ts:365-384]

3. Every runtime adapter follows the same post-compaction shape: a summary plus `Active Spec Folder`, an optional history lookup and a `Recovery` pointer instructing `/speckit:resume`. The dsh adapter composes base context + lookup + recovery pointer; the pi adapter composes `Post-Compaction Summary`, `Active Spec Folder`, lookup and recovery pointer; devin has the same recovery-pointer builder. [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/dsh/session-compact-context.mjs:126-142] [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/pi/session-compact-context.ts:148-165] [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/devin/post-compaction.cjs:265-285]

4. The authored-continuity snapshot injected at compaction has a facet labeled "Goal", but the builder fills that facet from `next_safe_action`. The rendered block is therefore `### Goal` followed by an imperative action, not by the packet's purpose; the other facets are answers, progress and blockers. [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/continuity/thin-continuity-record.ts:289-303] [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/continuity/thin-continuity-record.ts:307-313] [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/continuity/authored-continuity-snapshot.ts:104-115]

5. `/speckit:resume` emits a resume packet with the slots `now|last|next|blockers|artifact`, and its recovery ladder is handover.md (<24h) → `_memory.continuity` → supporting spec docs → ripgrep recipes. The ladder names spec.md among supporting docs, but the `context_loading_priority` order and the step-2 activity list substitute `tasks/plan/decision-record/resource-map` and omit spec.md. The intent-carrying document is therefore read only on the branch the workflow contradicts itself about, and even when read it maps to no purpose slot. [SOURCE: .skilled/commands/speckit/assets/speckit-resume-auto.yaml:92-93] [SOURCE: .skilled/commands/speckit/assets/speckit-resume-auto.yaml:106-110] [SOURCE: .skilled/commands/speckit/assets/speckit-resume-auto.yaml:159-174]

6. `/speckit:handoff` and the session relaunch are the one hop with a purpose-shaped slot. The note format is fixed as `## Goal`, `## Done`, `## Remaining work`, `## In-flight state`, and the instruction defines Goal as "states what the work is for". The note is hand-authored; `prepare` only adds an optional `goal_packet` pointer when it can prove the packet's `goal.md` holds the active goal. Purpose therefore travels only when the writer restates it or a `goal.md` exists to be pointed at. [SOURCE: .skilled/commands/speckit/handoff.md:104-131] [SOURCE: .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:822]

7. `/speckit:save` through `generate-context.js` writes action and state, never purpose. Its `--full-auto` continuity fields are `recent_action`, `next_safe_action`, `blockers`, `key_files`, `completion_pct`, `open_questions` and `answered_questions`, and the writer upserts them into the leaf's `implementation-summary.md` or a research record's `spec.md`. A save aimed at a phase parent descends one level per save to the leaf, so the parent's Problem & Purpose is neither refreshed nor checked by the save path. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/dist/continuity/generate-context.js:133-146] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/dist/continuity/generate-context.js:76-80] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/dist/continuity/generate-context.js:610-680]

8. The deep-loop iteration prompt carries `Research Topic`, `Focus Area`, `Remaining Key Questions`, carried-forward questions, last-three-iteration summaries, pivot lineage and saturated directions. There is no purpose field; the free-text research topic is the only channel that can carry a why, and a caller may pass a bare topic label. [SOURCE: .skilled/skills/system-deep-loop/deep-research/assets/prompt-pack-iteration.md.tmpl:10-20]

9. Child-dispatch briefs have a documented content contract and it carries no purpose. The brief must name the files and symbols to read, what has already been tried, the frozen scope and the question, and must exclude the dispatcher's preferred conclusion. The packet's problem, purpose and user need are absent from both the required and the forbidden lists. [SOURCE: .skilled/repo-rules/delegation-and-orchestration.md:80] [SOURCE: .skilled/repo-rules/delegation-and-orchestration.md:96-100]

10. Net travel of purpose across the seven hop surfaces: startup carries none; compaction carries none except an action mislabeled "Goal"; resume has no purpose slot and inconsistently reads spec.md; handoff has a Goal slot but depends on the writer restating it; save carries none and descends past a phase parent; the deep-loop prompt carries a free-text topic; the child brief carries none. Only the handoff Goal and the compaction "Goal" facet use a purpose vocabulary, and neither reads `spec.md`'s Problem & Purpose. [INFERENCE: derived from findings 1-9 above]

## Ruled Out

- Treating the compaction "Goal" facet as a purpose carrier: the code fills it from `next_safe_action`, so the label is misleading rather than a path. [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/continuity/thin-continuity-record.ts:299]
- Treating `/speckit:resume` as a purpose carrier: its output contract has no purpose field, so even a full read of spec.md cannot surface one through the resume packet. [SOURCE: .skilled/commands/speckit/assets/speckit-resume-auto.yaml:174]

## Dead Ends

- Searching `runtime/hooks/` for a runtime adapter that injects `spec.md` content at compaction or startup found none; every adapter emits summary, folder pointer, lookup and recovery instruction. Candidate for "Exhausted Approaches": per-runtime hook search for a purpose field.

## Edge Cases

- Ambiguous input: "the Claude compaction hooks ... and their counterparts for other runtimes" could mean only the two named files or the whole adapter family. Selected interpretation: the whole family, because the question says "counterparts". Verified claude, codex, dsh, pi and devin.
- Contradictory evidence: `speckit-resume-auto.yaml` lists `spec.md` in one recovery order and omits it in two others. Both claims are preserved in finding 5; the conflict is unresolved and is itself evidence that the purpose carrier is not a first-class recovery input.
- Missing dependencies: `runtime/hooks/opencode/` has no compact hook to read; the opencode runtime has no injected compaction surface, so no purpose can travel there. Recorded as a coverage gap rather than a failure.
- Partial success: none. Every named surface had a readable implementation.

## Sources Consulted

- .skilled/skills/system-spec-kit/runtime/hooks/claude/session-prime.ts:230-251
- .skilled/skills/system-spec-kit/runtime/hooks/claude/compact-inject.ts:365-384,613
- .skilled/skills/system-spec-kit/runtime/hooks/dsh/session-compact-context.mjs:126-142
- .skilled/skills/system-spec-kit/runtime/hooks/pi/session-compact-context.ts:148-165
- .skilled/skills/system-spec-kit/runtime/hooks/devin/post-compaction.cjs:265-285
- .skilled/skills/system-spec-kit/runtime/lib/continuity/thin-continuity-record.ts:289-313
- .skilled/skills/system-spec-kit/runtime/lib/continuity/authored-continuity-snapshot.ts:104-115
- .skilled/commands/speckit/assets/speckit-resume-auto.yaml:92-110,159-174
- .skilled/commands/speckit/handoff.md:104-131
- .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:822
- .skilled/skills/system-spec-kit/runtime/cli/dist/continuity/generate-context.js:76-80,133-146,610-680
- .skilled/skills/system-deep-loop/deep-research/assets/prompt-pack-iteration.md.tmpl:10-20
- .skilled/repo-rules/delegation-and-orchestration.md:80,96-100

## Assessment

- New information ratio: 0.95
- Questions addressed: Q2
- Questions answered: Q2

## Reflection

- What worked and why: reading the code that builds each payload, not the prose that describes it, produced the decisive evidence. The prose says resume reads spec.md; the activity list and output contract show that even if it does, no purpose field survives. The `Goal` facet built from `next_safe_action` is the clearest single drop: the label promises the why and the code supplies an action.
- What did not work and why: the first pass at the resume YAML read only `memory_loading` and would have concluded that spec.md is read on every resume. Comparing three lists in the same file exposed the contradiction.
- What I would do differently: the next iteration should sample real packet histories rather than more machinery, because the code shows every non-handoff hop is purpose-blind; the open question is how much the handoff writer actually preserves in practice.

## Recommended Next Focus

Question 3: sample real packets under `specs/` that carry `handover.md` and repeated continuity saves, and measure whether the purpose is restated, shortened or absent after hops; then check whether phase children restate the parent's purpose or drift.