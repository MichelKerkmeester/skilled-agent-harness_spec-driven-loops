# Iteration 8: Command-routing measurement

## Focus

Investigate Angle 8: what existing evidence can measure slash-command routing, plain-language reach, ambiguity, run-or-ask behavior and cross-runtime delivery. The reducer still names Q1 as Next Focus, while the dispatched sequence explicitly places measurement eighth; I followed that ordered angle. [SOURCE: specs/system-skill-advisor/routing-and-scoring/007-command-surfacing-and-workflow-enforcement/research/lineages/codex-luna/deep-research-strategy.md:293-296]

## Findings
1. The existing evaluator has a reusable 195-row baseline, 66-row holdout and 24-row contested slice; its recorded skill top-1 accuracy is 158/195 (0.8103), but it is not command-route accuracy. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/scorer-eval-baseline.json:1-35] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-routing-corpus.py:95-139] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-routing-corpus.py:142-209]
2. Current gold rows and replay gates label expected skills and advisor firing, while the scorer evaluates exact skill top-1; they do not grade canonical command ID, run/ask/abstain action, or command-specific recall, so the existing harness is a foundation rather than sufficient evidence. [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/prompt-policy-gold-replay.vitest.ts:9-19] [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/prompt-policy-gold-replay.vitest.ts:44-83] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-routing-corpus.py:142-181] [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/command-binding-existence.vitest.ts:4-14] [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/command-binding-existence.vitest.ts:45-64]
3. The frozen ambiguity slice measures top-1 accuracy on prompts inside a top-two score-margin band; its own source states the corpus has no expected-ambiguous labels, so ambiguity false-positive and false-negative rates cannot be claimed from it. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/derive-ambiguity-slice.mjs:5-23] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/derive-ambiguity-slice.mjs:37-94]
4. The prior doctor packet supports a command-specific slice, explicit controls and measured reach gate, but it says contested thresholds should come from the first baseline; its 12/14 at a 0.05 margin and 10/10 controls are doctor-scope gates, not evidence for universal 45-command thresholds. [SOURCE: specs/system-skill-advisor/routing-and-scoring/003-doctor-command-surfacing/001-doctor-command-guidance/research/research.md:206] [SOURCE: specs/system-skill-advisor/routing-and-scoring/003-doctor-command-surfacing/001-doctor-command-guidance/research/research.md:217-231]
5. The runtime-parity test says three runtimes but its list contains only two unique tags (claude and opencode), and assertions check brief shape for a skill; the manual playbook separately says its validator cannot prove every command executes. Measure route delivery and command/workflow handoff per active adapter and command, with non-loader runtimes scored against their supported handoff contract. [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/hooks/runtime-parity.vitest.ts:2-10] [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/hooks/runtime-parity.vitest.ts:25-72] [SOURCE: .skilled/skills/system-skill-advisor/manual-testing-playbook/manual-testing-playbook.md:75-84] [SOURCE: .skilled/skills/system-skill-advisor/manual-testing-playbook/manual-testing-playbook.md:303-314] [SOURCE: specs/system-skill-advisor/routing-and-scoring/007-command-surfacing-and-workflow-enforcement/research/lineages/codex-luna/iterations/iteration-005.md:8-16]

## Ruled Out

- Treating skill top-1 accuracy as command identity or action correctness.
- Copying doctor-specific thresholds unchanged across all command families.

## Dead Ends

- None established. Existing corpora and scoring scripts are useful, but their label schema does not yet answer command-route and action questions.

## Edge Cases

- Ambiguous input: Strategy Next Focus remains Q1 on source authority; the dispatch fixes the ten-angle order, so Angle 8 was followed.
- Contradictory evidence: The runtime-parity test advertises three runtimes but lists two unique runtime tags; the broader runtime survey also found documentation/registration drift.
- Missing dependencies: None for reading current corpus, scorer or runtime tests.
- Partial success: Existing skill-routing metrics, holdout and hard-margin slice are present; command-specific, run/ask and full active-adapter labels remain missing, so no acceptance threshold is established here.

## Sources Consulted

- specs/system-skill-advisor/routing-and-scoring/007-command-surfacing-and-workflow-enforcement/research/lineages/codex-luna/deep-research-config.json
- specs/system-skill-advisor/routing-and-scoring/007-command-surfacing-and-workflow-enforcement/research/lineages/codex-luna/deep-research-state.jsonl
- specs/system-skill-advisor/routing-and-scoring/007-command-surfacing-and-workflow-enforcement/research/lineages/codex-luna/deep-research-strategy.md:293-296
- .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/scorer-eval-baseline.json:1-35
- .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-routing-corpus.py:95-181
- .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/derive-ambiguity-slice.mjs:5-94
- .skilled/skills/system-skill-advisor/runtime/tests/prompt-policy-gold-replay.vitest.ts:9-83
- .skilled/skills/system-skill-advisor/runtime/tests/hooks/runtime-parity.vitest.ts:2-72
- .skilled/skills/system-skill-advisor/runtime/tests/command-binding-existence.vitest.ts:4-64
- .skilled/skills/system-skill-advisor/manual-testing-playbook/manual-testing-playbook.md:75-84,303-314
- specs/system-skill-advisor/routing-and-scoring/003-doctor-command-surfacing/001-doctor-command-guidance/research/research.md:206,217-231
- specs/system-skill-advisor/routing-and-scoring/007-command-surfacing-and-workflow-enforcement/research/lineages/codex-luna/iterations/iteration-005.md:8-16

## Assessment

- New information ratio: 0.90 (four findings add measure-specific command/action, ambiguity, threshold-transfer and runtime-coverage evidence; one builds on the earlier runtime-parity finding).
- Questions addressed: What existing corpus metrics do and do not establish; which command, action, ambiguity and runtime labels are missing.
- Questions answered: None fully; a measurement design and evidence gaps are identified, but thresholds remain open.

## Reflection

- What worked and why: Comparing the scorer's gold fields, its actual metric functions, the ambiguity-slice generator and runtime test assertions exposed the gap between skill selection and command execution evidence.
- What did not work and why: The old doctor benchmark gives a useful structural precedent but is scoped to a route family, so it cannot establish all-command acceptance thresholds.
- What I would do differently: Freeze command-level gold labels for typed slash, plain chat, competitor controls, missing-argument and explicit-confirmation cases; evaluate exact route precision/recall, no-route abstention, action correctness, calibration, and adapter-specific handoff with a separate held-out set.

## Recommended Next Focus

Angle 9: prior art for command discovery and invocation contracts, emphasizing sources that show model-visible command catalogs, selection versus execution semantics, and host/runtime constraints.
