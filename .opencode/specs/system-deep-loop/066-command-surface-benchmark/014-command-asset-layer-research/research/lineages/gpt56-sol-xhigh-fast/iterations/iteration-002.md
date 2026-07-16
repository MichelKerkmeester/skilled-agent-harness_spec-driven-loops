# Iteration 2: Presentation Ownership and Typed Exceptions

## Focus

This iteration answered RQ2 by inventorying representative presentation ownership across create, design, speckit, memory, doctor, and deep; comparing router `PRESENTATION BOUNDARY` prose with the referenced `.txt` assets; isolating the intentional `memory/search` inline block; and converting those observations into a typed owner/exception proposal. The selected interpretation treats “owner” as authority over user-visible wording, not merely the file that repeats or enforces a render invariant.

## Findings

1. The stable default across all six families is one presentation asset as the display authority, with the router retaining routing and input binding. Create, design, speckit, memory, doctor, and deep each name a `_presentation.txt` path in `OWNED ASSETS`; their topology differences affect workflow dispatch, not presentation authority. [SOURCE: .opencode/commands/create/command.md:18] [SOURCE: .opencode/commands/design/interface.md:42] [SOURCE: .opencode/commands/speckit/plan.md:19] [SOURCE: .opencode/commands/memory/search.md:32] [SOURCE: .opencode/commands/doctor/update.md:18] [SOURCE: .opencode/commands/deep/command-benchmark.md:42]

2. `PRESENTATION BOUNDARY` is a capability fence, not a second owner declaration: routers enumerate the visible surfaces that must come from the asset and require loading it before rendering. The presentation files independently identify themselves as the single/source-of-truth contract while assigning routing and execution elsewhere. [SOURCE: .opencode/commands/create/command.md:33] [SOURCE: .opencode/commands/create/assets/create_command_presentation.txt:1] [SOURCE: .opencode/commands/doctor/update.md:41] [SOURCE: .opencode/commands/doctor/assets/doctor_update_presentation.txt:1] [SOURCE: .opencode/commands/deep/command-benchmark.md:72] [SOURCE: .opencode/commands/deep/assets/deep_command-benchmark_presentation.txt:1]

3. `memory/search` is a legitimate bounded inline exception, not router-level presentation ownership. The router declares direct dispatch with no workflow YAML, loads the presentation asset, repeats only the compressed retrieval result shape and its invariants, then explicitly says that this is the sole inline hard-render reminder; startup, analysis, empty, error, vocabulary, and recovery displays remain asset-owned. The asset contains the same retrieval envelope plus its field mapping and rendering rules. [SOURCE: .opencode/commands/memory/search.md:30] [SOURCE: .opencode/commands/memory/search.md:47] [SOURCE: .opencode/commands/memory/search.md:68] [SOURCE: .opencode/commands/memory/search.md:137] [SOURCE: .opencode/commands/memory/assets/search_presentation.txt:40] [SOURCE: .opencode/commands/memory/assets/search_presentation.txt:72]

4. The canonical rule is currently too absolute for that exception: it says routers carry no inline prompts, dashboards, or result templates and that the presentation asset owns the display. A contract therefore needs a default `asset` authority plus an optional bounded router-copy declaration, rather than `asset | runtime | router-exception` as mutually exclusive owners. Recommended shape: `presentation.owner = {kind: "asset", path, media_type: "text/plain"}` and optional `presentation.inline_exceptions[] = {id, kind: "hard_render_reminder", router_anchor, source_anchor, surfaces, rationale}`. [SOURCE: .opencode/skills/sk-doc/create-command/assets/command_router_template.md:17] [SOURCE: .opencode/skills/sk-doc/create-command/assets/command_template.md:824] [INFERENCE: based on .opencode/commands/memory/search.md:137 and .opencode/commands/memory/assets/search_presentation.txt:40]

5. The known ownership-label defect is reproducible as prose type drift: create and doctor routers point to `.txt` assets but call them “presentation Markdown.” The path and asset header remain correct, so ownership is not ambiguous at runtime; the manually authored media label is wrong and copied across routers. Generated prose should derive a neutral label such as “presentation asset” from typed metadata and never infer authority from a human-written file-type noun. [SOURCE: .opencode/commands/create/command.md:22] [SOURCE: .opencode/commands/create/command.md:29] [SOURCE: .opencode/commands/doctor/update.md:22] [SOURCE: .opencode/commands/doctor/update.md:37] [SOURCE: .opencode/specs/system-deep-loop/066-command-surface-benchmark/012-command-improvement-research/research/lineages/gpt56-sol-high-fast/iterations/iteration-002.md:35]

## Candidate Deltas

1. **Target:** `.opencode/skills/sk-doc/create-command/assets/command_contract.schema.json` (new versioned schema proposed by the parent remediation). Add the typed `presentation.owner` record and `presentation.inline_exceptions[]` fields above. **Acceptance criterion:** every inventoried command resolves exactly one existing presentation owner path; ordinary routers fail when they contain a prompt/dashboard/result block; a bounded exception passes only with a non-empty rationale, stable router/source anchors, and an enumerated surface list. [INFERENCE: based on .opencode/commands/memory/search.md:137 and .opencode/skills/sk-doc/create-command/assets/command_router_template.md:19]

2. **Target:** `.opencode/skills/sk-doc/create-command/assets/command_router_template.md` and `.opencode/skills/sk-doc/create-command/assets/command_template.md`. Render `OWNED ASSETS`, load-before-render prose, and `PRESENTATION BOUNDARY` from the typed presentation record; document bounded exceptions as copied invariants that do not change the owner. **Acceptance criterion:** generated routers contain no authored media-type noun, the `.txt` path renders as “presentation asset” or “presentation contract,” and changing the contract path updates both the table and boundary in one generation pass. [SOURCE: .opencode/skills/sk-doc/create-command/assets/command_router_template.md:61] [SOURCE: .opencode/skills/sk-doc/create-command/assets/command_template.md:824]

3. **Target:** `.opencode/commands/memory/search.md` and `.opencode/commands/memory/assets/search_presentation.txt`. Mark the compressed retrieval envelope with stable paired anchors and declare it as `hard_render_reminder`, sourced from the asset’s retrieval-display section. **Acceptance criterion:** the validator accepts exactly the declared retrieval envelope and invariant prose, rejects startup/analysis/error display leakage, and fails when either anchor is missing or the router copy widens beyond the declared surfaces. [SOURCE: .opencode/commands/memory/search.md:68] [SOURCE: .opencode/commands/memory/search.md:139] [SOURCE: .opencode/commands/memory/assets/search_presentation.txt:40]

4. **Target:** `.opencode/commands/create/*.md` and `.opencode/commands/doctor/{mcp,speckit,update}.md`. Replace “presentation Markdown” with the generated neutral owner label after the contract renderer exists. **Acceptance criterion:** `rg -n 'presentation Markdown'` returns no current router hits, and schema-driven regeneration cannot reintroduce a label inconsistent with `media_type: text/plain`. [SOURCE: .opencode/commands/create/command.md:29] [SOURCE: .opencode/commands/doctor/update.md:37]

## Ruled Out

- Banning all inline presentation: this would reject the explicitly bounded `memory/search` hard-render reminder while adding no new owner clarity. [SOURCE: .opencode/commands/memory/search.md:137]
- Treating `memory/search` as router-owned presentation: the asset declares itself the source of truth and contains the canonical envelope; the router preserves only a constrained copy. [SOURCE: .opencode/commands/memory/assets/search_presentation.txt:3] [SOURCE: .opencode/commands/memory/search.md:139]
- Hand-authoring file-type labels next to authoritative paths: repeated `.txt`/“Markdown” disagreement shows that the duplicate noun drifts. [SOURCE: .opencode/commands/create/command.md:22] [SOURCE: .opencode/commands/create/command.md:29]

## Dead Ends

No evidence supports a second presentation owner category for current routers. The useful distinction is authoritative asset versus bounded router copy; runtime engines may produce values, but the presentation contract still owns their visible envelope.

## Edge Cases

- Ambiguous input: “owner” could mean producer of result values or authority over visible rendering. This iteration selected rendering authority because the router and presentation contracts consistently divide those responsibilities. [SOURCE: .opencode/commands/deep/assets/deep_command-benchmark_presentation.txt:3]
- Contradictory evidence: none. The absolute canonical no-inline rule is incomplete rather than evidence that `memory/search` has two owners.
- Missing dependencies: none.
- Partial success: none; RQ2 is answered with six-family router evidence, asset evidence, the documented exception, and contract-ready deltas.

## Sources Consulted

- `.opencode/commands/create/command.md:18-48`
- `.opencode/commands/create/assets/create_command_presentation.txt:1-46`
- `.opencode/commands/design/interface.md:42-102`
- `.opencode/commands/speckit/plan.md:19-78`
- `.opencode/commands/memory/search.md:30-145`
- `.opencode/commands/memory/assets/search_presentation.txt:1-118`
- `.opencode/commands/doctor/update.md:18-57`
- `.opencode/commands/doctor/assets/doctor_update_presentation.txt:1-26`
- `.opencode/commands/deep/command-benchmark.md:42-79`
- `.opencode/commands/deep/assets/deep_command-benchmark_presentation.txt:1-67`
- `.opencode/skills/sk-doc/create-command/assets/command_router_template.md:17-67`
- `.opencode/skills/sk-doc/create-command/assets/command_template.md:818-845`
- `.opencode/skills/sk-doc/create-command/references/router_presentation_split.md:27-78`
- `.opencode/specs/system-deep-loop/066-command-surface-benchmark/012-command-improvement-research/research/research.md:117-144`
- `.opencode/specs/system-deep-loop/066-command-surface-benchmark/012-command-improvement-research/research/lineages/gpt56-sol-high-fast/iterations/iteration-002.md:33-37`
- `.opencode/specs/system-deep-loop/066-command-surface-benchmark/012-command-improvement-research/research/lineages/gpt56-sol-high-fast/iterations/iteration-005.md:27-33`

## Assessment

- New information ratio: 0.90 (3 fully new findings + 2 partially new findings = 0.80, plus a 0.10 simplicity bonus because the owner/copy model resolves RQ2 without adding a competing owner category).
- Questions addressed: RQ2.
- Questions answered: RQ2.

## Reflection

- What worked and why: pairing each router boundary with its referenced asset separated authoritative wording from route-local enforcement, while the six-family census showed that topology does not require different presentation owners.
- What did not work and why: broad lineage-log search produced noisy generated tool transcripts; narrow checked-in iteration evidence and current source files carried the same claim with stable line anchors.
- What I would do differently: for RQ5, start from the proposed typed fields and trace each generated prose consumer, rather than searching all historical logs for wording defects.

## Recommended Next Focus

RQ3: build the family-specific mode/default matrix and validate each declared mode against both an executable asset and its `EXECUTION TARGETS` row. Carry forward `presentation.owner` as an independent field so mode topology cannot implicitly redefine display authority.
