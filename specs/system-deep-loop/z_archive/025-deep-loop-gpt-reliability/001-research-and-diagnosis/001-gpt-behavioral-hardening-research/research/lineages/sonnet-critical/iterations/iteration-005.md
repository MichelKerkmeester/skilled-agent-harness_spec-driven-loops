# Iteration 5 — KQ4's top-ranked, "full agreement" recommendation ("orchestrate dispatches @deep and STOP") is ambiguous between two readings, and the literal one violates orchestrate's own NDP depth cap

**Focus:** KQ-CRIT-6 — is "orchestrate delegates deep-dispatch to deep.md" (KQ4, ranked #1 implementation phase in both prior lineages, "Full agreement" in the consolidated synthesis §2) actually the smallest defensible edit once NDP constraints are read directly?

## What was read

- `.opencode/agents/orchestrate.md:1-48` (frontmatter `mode: primary`; "0. ILLEGAL NESTING (HARD BLOCK)" section)
- `.opencode/agents/orchestrate.md:90-230` (Agent Selection Priority table, NDP section, Agent Files table, Task Format — re-read from iteration 3/4 context with depth-counting lens this time)
- `.opencode/agents/deep.md:1-20, 51-59` (frontmatter `mode: primary`; hard boundary #4 "single-hop only")

## Finding 12 — `@deep` is absent from every one of orchestrate.md's own routing/roster tables, and is `mode: primary`, not LEAF

Orchestrate.md's Agent Selection Priority table (7 rows: `@context`, `@deep-research`, `@ai-council`, `@markdown`, `@review`, `@code`, `@debug`) [orchestrate.md:97-105], its explicit LEAF roster ("@context, @code, @markdown, @ai-council, @review, @debug, @deep-research, @deep-review") [orchestrate.md:116], and its Agent Files table (same 7 agents, no `@deep`) [orchestrate.md:180-188] **never list `@deep` anywhere**. The only place `@deep` (or deep-routing) appears in orchestrate.md at all is the `Deep Route:` field description inside the Task Format template — a field describing what to attach to a dispatch of one of the *other* 7 agents, not a row saying "dispatch @deep" [orchestrate.md:206-207]. Meanwhile `deep.md`'s own frontmatter is `mode: primary` [deep.md:4], identical to `orchestrate.md`'s own `mode: primary` [orchestrate.md:4] — i.e., **`@deep` self-identifies as a primary entry-point agent, structurally the same class as `@orchestrate` itself, not as a LEAF**.

Both prior lineages' KQ4 answer is to have orchestrate "dispatch `@deep`... and STOP" [glm-max/research.md:55, "dispatch @deep with the Deep Route header resolved from mode-registry.json and STOP"; gpt-fast-high/research.md:73, "insert a deep-route branch in orchestrate.md that says... resolve via .opencode/agents/deep.md / mode-registry.json and emit the exact Deep Route package from that route"]. gpt-fast-high's phrasing ("resolve via deep.md") is actually ambiguous about whether `@deep` is Task-dispatched as an agent or merely read as a reference/registry-loader; glm-max's phrasing ("dispatch @deep... and STOP") is not ambiguous — it explicitly proposes a Task dispatch of `@deep` as the target.

## Finding 13 — The literal "Task-dispatch @deep" reading violates orchestrate's own documented NDP depth cap and matches an explicitly-labeled ILLEGAL chain

Orchestrate.md states its own hard constraint twice, in near-identical wording, in two different sections: "**Maximum agent depth is 2 (depth counter 0, 1). Only the depth-0 orchestrator may dispatch LEAF agents.**" [orchestrate.md:44-45, "0. ILLEGAL NESTING (HARD BLOCK)"] and "**Maximum depth: 2 levels** (depth counter 0, 1). No agent at depth 1 may dispatch further." [orchestrate.md:120, "Nesting Depth Protocol (NDP)"]. It also gives worked examples of illegal chains, including: `ILLEGAL: Orch(0) → Sub-Orch(1) → @leaf(2)` [orchestrate.md:148].

If orchestrate (depth 0) Task-dispatches `@deep` (a `mode: primary` routing agent, functionally a "Sub-Orch" — its own job description is literally "resolve mode, load agent definition, dispatch") at depth 1, and `@deep` then performs its own documented routing workflow step "Dispatch exactly once" to the resolved leaf (e.g. `@deep-research`) [deep.md:77] at depth 2, that is **exactly the shape of the `Orch(0) → Sub-Orch(1) → @leaf(2)` chain orchestrate.md's own documentation labels ILLEGAL.** This is not a hypothetical edge case — it is the literal mechanism both prior lineages recommend as the KQ4 fix, described with "full agreement" and ranked as the first, lowest-blast-radius implementation phase in both proposed sequences [consolidated research.md §3 item 1; glm-max/research.md §11 item 1; gpt-fast-high/research.md §11 item 2].

**Neither prior lineage stress-tested this against orchestrate's own explicit depth-counting rules and worked ILLEGAL-chain examples**, despite both citing `orchestrate.md:42` (glm-max) or the surrounding NDP section (gpt-fast-high, implicitly, via citing `orchestrate.md:196-225`) as supporting evidence for the delegation recommendation. Citing the file that documents the exact rule your recommendation would break, without checking the rule against the recommendation, is a second instance (after iteration 4's ai-council validator finding) of a citation being present but under-read by both lineages.

## Finding 14 — The corrected, still-minimal fix: reuse deep.md's registry-resolution *logic*, not `@deep` as a dispatch *target*

The intent both lineages are reaching for — stop orchestrate from re-deriving mode/execution via free-text judgment, and instead use `deep.md`'s deterministic table-lookup pattern — does not require Task-dispatching `@deep` at all, and is achievable without touching the depth cap:

**Smallest defensible edit (revised):** in orchestrate.md's routing section (§2, near the existing Priority table at :95-105), add a rule that says: *"If the request matches a `/deep:*` command or names a deep-loop leaf (`deep-research`, `deep-review`, `deep-context`, `ai-council`), resolve `workflowMode`/`target_agent`/`artifactRoot` by reading `.opencode/skills/deep-loop-workflows/mode-registry.json` directly (the same deterministic lookup `deep.md` §0 performs — read `deep.md` as a reference for the table/algorithm, do not dispatch it as an agent), populate the `Deep Route:` field from that lookup, and dispatch the resolved LEAF agent directly at depth 1 with no self-derivation."* This preserves the existing single-hop `Orchestrator(0) → @deep-research(1)` shape (already LEGAL per orchestrate.md's own examples: "LEGAL: Orchestrator(0) → @general(1)" generalizes to any LEAF target), converts the resolution step from judgment to table lookup exactly as intended, and never creates a depth-1 `@deep` hop. This is a smaller, safer diff than either prior lineage's literal wording, and it resolves the ambiguity in gpt-fast-high's "resolve via deep.md" phrasing in the NDP-safe direction rather than leaving it open to the NDP-violating reading glm-max stated explicitly.

**Residual for the implementation phase:** `@deep`'s standalone role (as a *direct* `/deep:*` command entry point, its own depth-0 invocation, per deep.md's self-description "a primary entry-point agent") is unaffected by this correction — this finding only blocks the specific "orchestrate Task-dispatches `@deep` as a depth-1 hop" mechanism, not `@deep`'s existence or its direct-invocation utility.

## Ruled out this iteration

- "Orchestrate dispatches `@deep` and STOP" as a safe, NDP-compliant implementation of KQ4, as literally stated by glm-max — RULED OUT; it matches orchestrate.md's own documented ILLEGAL chain shape.
- Treating gpt-fast-high's vaguer "resolve via deep.md" phrasing as equivalent/interchangeable with glm-max's explicit dispatch wording — RULED OUT as safe to treat interchangeably; they resolve to different, non-equivalent diffs, and only one is NDP-safe.

## Status

`insight` — the second structurally significant finding this round (after Mode D in iteration 3); this one corrects the #1-ranked, "full agreement" recommendation in the consolidated synthesis.

newInfoRatio: 0.70 — novelty: stress-tests the highest-confidence, most-agreed-upon recommendation in the prior round against a rule (`orchestrate.md`'s own NDP depth cap and worked ILLEGAL-chain examples) that both lineages cited as supporting evidence without actually applying it as a constraint on their own proposal.
