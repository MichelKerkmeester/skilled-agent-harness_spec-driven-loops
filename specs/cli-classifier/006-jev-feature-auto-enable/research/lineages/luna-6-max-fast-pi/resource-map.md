# Resource Map — Jev Feature Proof-or-Retire

This map indexes the source families used to answer the five research questions. Evidence classes distinguish implementation contracts from recorded benchmark outputs and lineage synthesis.

| Source | Role | Evidence used |
|---|---|---|
| `.skilled/skills/cli-classifier/shared/scripts/jev-features.mjs:33-55,77-105,139-185` | Shared Jev gate | Four registered features; default-on switch resolution; environment-over-config precedence; disabled-before-readiness; credential probe contract. |
| `.skilled/skills/cli-classifier/shared/scripts/tests/jev-features.test.mjs:56-72,96-130,159-229` | Gate tests | Defaults, master/per-feature switches, legacy alias, precedence, missing CLI/credentials, and no spawn when disabled. |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:26,55-64,816-894` | Feature 017 scorer | Shared report helper, frozen keep rule, exact paired decision; read with 049 results and tests. |
| `specs/cli-jev/003-cli-jev-workflow-integration/049-jev-feature-improvement-build/002-track-narrowing-improvements/implementation-summary.md:90-105` | Feature 017 repeat | 270-row repeat, margin-stop interval, power estimate, scorer hardening record. |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs:25,45-51,637-760,1521-1569` | Feature 020 scorer | Shared report helper, label threshold, actual-router replay/refusal, class and baseline scoring. |
| `specs/cli-jev/003-cli-jev-workflow-integration/020-routing-clarify-default/spec.md:72-104,150-166,212-213` | Feature 020 contract | Clarify event population, serving boundary, labels, rule and unresolved real-session rate. |
| `.skilled/skills/system-spec-kit/runtime/cli/evals/score-alignment-suggestion.ts:525,745-758,930-935,1631-1638,1697-1704` | Feature 022 scorer | Shared report helper, local verdict, state-rotation control, automatic baseline selection, and control runner. |
| `/Users/michelkerkmeester/.skilled/.labels/runs/049-008-jev.stdout.txt:1-12,36-85` | Feature 022 stored run | Primary keep, confidence-gated call reduction, distractor-state kill, row-level control choices and run pins. |
| `specs/cli-jev/003-cli-jev-workflow-integration/022-alignment-folder-suggestion/spec.md:111-130,184-208` | Feature 022 evidence contract | State input, labels, 30-row gate, fixed verdict rules, and explicit no-serving scope. |
| `.skilled/hooks/injection-screen/claude/injection-screen-posttooluse.mjs:75-110` | Existing gated consumer | Hook no-op/fail-open paths and `featureReady` call. |
| `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/reviewer-scorer.cjs:333-360` | Existing gated consumer | Auto grader selects Jev only when ready, otherwise retains noop baseline. |
| `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/run-benchmark.cjs:606-632` | Existing gated consumer | 5-dimensional auto grader gate and noop fallback. |
| `.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:1440-1449,1467-1475,1546-1556` | Existing gated consumer | Cite-drift's custom pinned readiness path and shared feature switch. |
| `iterations/iteration-001.md` through `iterations/iteration-005.md` and `deltas/iter-001.jsonl` through `deltas/iter-005.jsonl` | Lineage record | Five inline evidence passes, per-finding priorities, source citations, ruled-out directions, and per-question status. |
| `deep-research-state.jsonl` and `deep-research-ledger/` | Append-only run state | Config plus five iteration completion events; writes committed through `append-mode-event.cjs`. |
