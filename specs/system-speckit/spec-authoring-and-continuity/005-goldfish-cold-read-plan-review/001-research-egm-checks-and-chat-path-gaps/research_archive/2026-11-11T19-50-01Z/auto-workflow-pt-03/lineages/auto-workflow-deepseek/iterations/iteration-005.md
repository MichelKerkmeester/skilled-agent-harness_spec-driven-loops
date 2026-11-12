# Iteration 5: Mechanism C — a hook that injects the relevant step

## Focus

Mechanism C: a hook that injects the one relevant workflow step at prompt time or tool time. The question is whether the hook surface can deliver a step rather than a routing hint, what each of the seven runtimes can carry, and what the existing spec-gate precedent — which already delivers a once-per-session notice at the first mutation — proves about the ceiling.

## Actions Taken

1. Read the injection contract's channel legend and its prompt-time and tool-time sections.
2. Read the skill-advisor hook reference's per-runtime delivery table and its fail-open and dedup rules.
3. Read the `spec-gate` README's core contract: `classifyIntent`, `evaluateMutation`, the once-per-session delivery marker and the `SYSTEM_SPEC_GATE_ENFORCE` opt-in.
4. Read the Cursor rule file's dormancy note and the injection contract's Cursor row.
5. Read the hooks index's kill-switch table and its note on which concerns keep code inside their owning skill.

## Findings

1. **Prompt-time injection reaches all seven runtimes, with one dormant channel.** Claude, Codex, Cursor, Devin and OpenCode deliver the advisor brief as `[SYS]` `additionalContext` or an appended system string, Pi delivers it as `[MSG]` on the visible prompt, and DSH delivers it at `agent/pre-step` as an appended `repo-guards` message [SOURCE: .skilled/hooks/injection-contract.md:66]. Cursor is the exception: its `beforeSubmitPrompt` adapter is registered but "its dynamic per-turn delivery is dormant under the tested CLI build" [SOURCE: .cursor/rules/skill-routing.md:18], which the injection contract restates for another concern as "its `beforeSubmitPrompt` never delivers, `stop` never fires" [SOURCE: .skilled/hooks/injection-contract.md:115].

2. **Tool-time delivery is a real, already-shipped channel, and it is where the workflow step belongs.** `spec-gate` classifies the prompt, holds the decision in session state, and delivers its A/B/C/D notice at the first `Write`/`Edit`/`Bash` call rather than on the turn [SOURCE: .skilled/hooks/spec-gate/README.md:12] [SOURCE: .skilled/hooks/spec-gate/README.md:24]. That is the same shape a "before you write plan.md, do this step" injection needs, and it already exists in every runtime's adapter set.

3. **The precedent proves the ceiling is a notice, not a gate.** `evaluateMutation` returns `allow`, `advise` or `deny`, and denial is opt-in through `SYSTEM_SPEC_GATE_ENFORCE`: "Without it, an open-gate mutation surfaces as `advise` (a warning the operator can ignore) rather than `deny`" [SOURCE: .skilled/hooks/spec-gate/README.md:16]. A workflow step carried the same way would be advisory by default and blocking only with an env flag.

4. **The spec-gate precedent also proves a hook can be quiet about repetition.** Delivery is once per session, tracked by a persisted marker (`questionDeliveredAtMs`, `questionDeliveredChannel`, `questionDeliveredCount`), and suppression is on by default [SOURCE: .skilled/hooks/spec-gate/README.md:34]. A step injection inherits the same control, which answers the "will this nag every write" objection before it is raised.

5. **A hook delivers model-context text, and in Pi that text lands on the prompt the operator sees.** The channel legend marks `[SYS]` as model-context-only and `[MSG]` as "rendered as visible chat content ... Pi's `input`-event transform, which appends text directly onto the user's own visible prompt" [SOURCE: .skilled/hooks/injection-contract.md:38] [SOURCE: .skilled/hooks/injection-contract.md:39]. A workflow step injected on Pi would therefore appear as if the operator had typed it.

6. **Hook delivery is fail-open, so the worst case is silence rather than a stall.** Every entrypoint "fails open: an unreadable state file, a classifier throw, an unresolvable project root, or an unexpected argument shape all resolve to `allow` with no side effects" [SOURCE: .skilled/hooks/spec-gate/README.md:14]. The advisor's contract is the same: "the prompt always proceeds" [SOURCE: .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:25].

7. **A dispatched child short-circuits the hook entirely, which is the correct behavior for the fan-out case.** `classifyIntent` and `evaluateMutation` are "a complete no-op before any gate-state read or write, question, denial, or telemetry" when `AI_SESSION_CHILD=1` [SOURCE: .skilled/hooks/spec-gate/README.md:24]. A hook carrying a workflow step can never be the mechanism a child lineage relies on.

8. **The cost of the hook itself is per-concern and per-runtime, not one file.** The hooks hub holds eleven concern folders plus symlinked per-runtime index entries, and each concern carries its own kill-switch [SOURCE: .skilled/hooks/README.md:45]. A new concern means a new core, seven adapters and a kill-switch row; extending the existing spec-gate notice means editing the notice text and the delivery predicate.

9. **The cheap hook variant collides with the same turn's other injections.** The advisor brief already appends a directive block on every prompt [SOURCE: .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:39], the goal hook appends a session block on every turn where the runtime injects [SOURCE: .skilled/hooks/injection-contract.md:117], and the spec-gate notice adds a third on the first mutation. A fourth injected block has to earn its place against three that already occupy the model's attention.

## Ruled Out

- A new hook concern for the workflow step: the hub's cost is a core plus seven adapters plus a kill-switch row [SOURCE: .skilled/hooks/README.md:45], which puts it above every mechanism that edits an existing line.
- A prompt-time-only hook: Cursor's prompt channel is dormant under the tested CLI build, so the mechanism would miss one of the seven runtimes entirely.

## Dead Ends

- "Inject the whole step list": the injection channels are designed for short, bounded text — the advisor brief is one line plus a fixed directive, and the spec-gate notice is three sentences. A multi-step list would either be truncated or dominate the turn.
- "Use the deny channel to force the step": a deny on the first write stops the turn and hands the model a reason string, which turns every documentation write into a failed call. That is the blocked-turn behavior the spec-gate design deliberately avoids by delivering at the prompt and not at the turn.

## Edge Cases

- Ambiguous input: "hook that injects the one relevant step" was read as an injection carrying one step's instructions, not as a hook that executes the step.
- Contradictory evidence: the advisor hook reference lists Cursor `beforeSubmitPrompt` as wired with a 10s timeout [SOURCE: .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:55], while the Cursor rule and the injection contract both say it is dormant. Recorded; the dormancy statements are the more specific and more recent claim, and the spec-gate README's Cursor row explains the workaround it needed [SOURCE: .skilled/hooks/spec-gate/README.md:50].
- Missing dependencies: no live runtime was exercised; the contracts are the evidence.
- Partial success: none.

## Sources Consulted

- `.skilled/hooks/injection-contract.md:38`, `:39`, `:66`, `:115`, `:117`
- `.skilled/hooks/spec-gate/README.md:12`, `:14`, `:16`, `:24`, `:26`, `:34`, `:50`
- `.skilled/hooks/README.md:45`
- `.skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:25`, `:39`, `:55`
- `.cursor/rules/skill-routing.md:18`

## Assessment

- New information ratio: 0.9
- Questions addressed: For each candidate mechanism, what it costs and what it breaks — the hook branch; plus its cross-runtime behavior at the contract level.
- Questions answered: none fully; the runtime question gets its own iteration.
- Novelty justification: the tool-time delivery precedent, the dormancy contradiction and the child short-circuit are all new; the existence of hooks as a mechanism was known before this run.

## Reflection

- What worked and why: reading `spec-gate` as a precedent rather than as an unrelated guard answered three questions at once — channel coverage, repetition control and block-versus-notice. It is the closest existing thing to "inject a step when a write is about to happen".
- What did not work and why: treating the advisor hook as the model. It is prompt-time only and one line long, so it understates both the reach (Cursor dormancy is a prompt-time problem) and the cost (a new concern is not one file).
- What I would do differently: read the `[SYS]`/`[MSG]` legend first. It decides whether an injection is invisible plumbing or visible text on the operator's own prompt, which changes the design more than any token count.

## Recommended Next Focus

Mechanism D: enforcement carried by templates and `validate.sh` — which existing rules could carry a workflow check, what each rule costs to extend, and whether any rule can read prose at all.
