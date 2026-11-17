# Iteration 6: One measurement model, the final ranked list, and what remains unmeasured

## Focus

Reconcile the four plain-offer numbers in play into one measurement model, map every one of the 17 no-command rows to the candidate that moves it, restate the final ranking with its verification, and name the gaps that no iteration could close from inside this lineage.

## Actions Taken

1. Re-read the committed capture's `attachedMetrics.plain.tune`, the real-embedding capture, and the live per-row table.
2. Recomputed the head / Also / none partition and the exact versus subcommand split from `prompts/tune-live.jsonl`.
3. Mapped the six causes from iteration 1 onto the six ranked candidates from iteration 4.

## Findings

1. The four numbers describe one state under four definitions: the committed fixture capture's 23 is expected-command reach through bridge row ids under fixture vectors; the real-embedding capture's 28 is the same metric under the operator's vectors; the live brief renders 27 head commands plus 1 `Also:` line, which is 28 rows carrying a command; and candidate 1 projects 30. None of them is a regression of another. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/offer-reach-3/prompts/real-embed-capture.json]

2. Of the 28 rendered commands, 22 are the exact corpus label and 6 are a documented subcommand (`/doctor:agents-md check`, `/doctor:ci report`, `/doctor:env list`, `/doctor:git hooks`, `/doctor:overlay status`, `/doctor:symlink link`). Exact-string metrics therefore understate plain reach by 6 rows at HEAD, and that is a corpus-label decision for the operator, not a routing defect. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/offer-reach-3/prompts/tune-live.jsonl]

3. Every one of the 17 no-command rows maps to a candidate: 1 to the duplicate-suppression fix, 2 to the sk-doc alias fix, 2 to the silent-hub label fix, 6 to the below-threshold anchors, and 2 to the wrong-top doctor fix; the remaining 4 already print `(needs a mode)` and are an intentional ask, not a defect. [INFERENCE: based on iterations 1 and 4]

4. Final ranking by expected gain in started-when-useful per unit of risk: (1) sk-doc readme and human-voice aliases, +2 rows, zero floor exposure; (2) below-threshold anchors plus one scorer row, up to +6 rows, the only candidate with real floor risk; (3) the silent-hub label for `sk-code`, +2 actionable labels; (4) in-process TypeScript scoring on the degraded path, 28 rendered commands instead of 0 on untyped rows whenever the daemon is down; (5) the duplicate-suppression fix, +1 row; (6) the doctor wrong-top pair, +2 rows, medium-high risk. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/offer-reach-3/iterations/iteration-004.md]

5. Verification per candidate is already executable with committed scripts: `compiled-route.cjs --hub sk-doc --prompt` for the alias modes; `capture-command-routing-baseline.mjs --real-embedding` (no `--write`) for the tune and false-offer lines; the advisor suite for the label and duplicate changes; a new unreachable-endpoint vitest for the degraded path; and the three named floor row ids (`mns-chat-03`, `nm-system-skilled-doctor-01`, `sv-03`) for the anchor work. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-command-routing-baseline.mjs:36]

6. Three gaps remain, all measurement rather than routing: no persistent counter records how often the local-scorer fallback answers; OpenCode's degraded behaviour is unmeasured because its delivery is `unknown`; and the six subcommand labels need an operator decision on whether the corpus should name the subcommand. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/011-typed-command-delivery-and-guards/scratch/hook-health.json]

7. The lane's three questions are answered with commands and file evidence: (a) 17 rows and six causes, each named by row id; (b) re-embedding and intent enrichment declined again, measured at 0 brief-level commands and priced at about 83 ms for all 14 skill vectors with hash-gated incremental refresh; (g) the fallback runs the Python scorer and then collapses untyped rows, measured at 644 ms and 0 observed occurrences in the recorded arms. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/offer-reach-3/prompts/degraded-readme.json]

## Ruled Out

- Reporting a single "plain recall" number without its definition. The four numbers differ by metric and regime, and quoting one alone would misstate the built state.
- Treating the 4 needs-mode rows as fixable recall. They are a deliberate ask, and forcing a command on them would repeat the eliminated "default command for a deferring hub" item.
- Counting the six subcommand rows as misses in the final ranking; they are reach, and only the label granularity differs.

## Dead Ends

- Closing the fallback-frequency gap from inside the lineage: it needs a persistent counter that only a build phase can add.
- Measuring OpenCode's degraded path: no delivery marker exists for the committed arm.

## Edge Cases

- Ambiguous input: "plain reach" is used in four senses in the packet; this iteration fixes one definition per number.
- Contradictory evidence: the 012 summary's claim that the deep rows attach their commands against the committed capture's `offered: false` is resolved by the field definition, not by a code difference.
- Missing dependencies: none new.
- Partial success: none.

## Sources Consulted

- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/offer-reach-3/prompts/tune-live.jsonl`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/offer-reach-3/prompts/real-embed-capture.json`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/offer-reach-3/prompts/degraded-readme.json`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/offer-reach-3/iterations/iteration-001.md`, `iteration-004.md`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-command-routing-baseline.mjs:36`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/011-typed-command-delivery-and-guards/scratch/hook-health.json`

## Assessment

- New information ratio: 0.2
- Questions addressed: the reconciliation of the four plain-offer numbers and the closure of the lane's three questions
- Questions answered: none newly; the three lane questions were answered in iterations 1 to 3 and are restated here with their evidence

## Reflection

- What worked and why: mapping each cause to a candidate forced the ranking to cover all 17 rows instead of the three most visible ones.
- What did not work and why: earlier iterations quoted 23, 27 and 28 without a shared definition, which read as disagreement; the model now assigns one definition per number.
- What I would do differently: define the measurement model before the first row measurement, so every later iteration quotes the same one.

## Recommended Next Focus

Synthesis: write the lane's final research document with the ranked recommendations, each one's file, measured gain, verification command and floor risk, the declined items with their reasons, and the convergence report.
