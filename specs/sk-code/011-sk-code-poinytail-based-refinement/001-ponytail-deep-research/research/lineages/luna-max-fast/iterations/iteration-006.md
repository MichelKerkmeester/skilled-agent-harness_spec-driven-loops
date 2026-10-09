# Deep Research — Iteration 6

- Run: fanout-luna-max-fast-1791552201492-cjjo4q
- Focus: Audit surface-specific verification and minified-runtime evidence
- Status: complete
- New information ratio: 1.0

## Focus

Do the remaining Webflow and Obsidian surface checks test the behavior their verification labels imply?

## Actions Taken

- Read the Webflow minification, static pattern-verification, and mock-runtime scripts.
- Compared Webflow's runtime test behavior with Ponytail's test rule and a Ponytail hook regression test.
- Checked the Obsidian packet's stated boundary between screenshot freshness and rendered correctness.

## Findings

1. **NEW:** Webflow's minified-runtime checker can report PASS while errors in scheduled or event-driven code are hidden. The mock timer and animation-frame callbacks discard exceptions, Webflow.push does the same, and DOM event listeners are no-ops; the PASS path only requires top-level VM execution not to throw. Ponytail's own open-stdin regression test instead fails on a timeout and checks the process exits cleanly, matching its rule that non-trivial logic needs a test that catches breakage. A minimal improvement is to collect callback errors and fail the script before PASS, then add explicit dispatch for only the lifecycle events the checked scripts require. Sources: specs/sk-code/011-sk-code-poinytail-based-refinement/context/skills/ponytail/SKILL.md:34-41; specs/sk-code/011-sk-code-poinytail-based-refinement/context/tests/hooks-windows.test.js:107-125; .skilled/skills/sk-code/sk-code-webflow/assets/scripts/test-minified-runtime.mjs:47-48,81-83,118-132,186-191,333-357,398-405; .skilled/skills/sk-code/sk-code-webflow/assets/scripts/verify-minification.mjs:150-274.
    
## Questions Answered

- Do the remaining Webflow and Obsidian surface checks test the behavior their verification labels imply? **Answered:** Webflow has both lexical minification checks and a VM runtime check, but the latter swallows selected callback errors and does not dispatch DOM listeners. The Obsidian packet explicitly says screenshot source-hash freshness does not prove what the PNG shows and directs the operator to inspect changed images; its verification baseline also distinguishes known lint debt from clean gates.

## Rejected Transfers

- Do not replace Webflow's existing multi-stage minification checks with a broad browser simulation. The observed gap has a bounded harness fix: surface callback failures and exercise only relevant lifecycle events. The Obsidian packet's explicit manual visual review is a known boundary, not evidence that a new screenshot framework is needed.

## Assessment

The Webflow minification workflow already separates output naming, token preservation, and mock execution. Its runtime harness needs to report failures from the callbacks it invokes; the source inspection does not establish whether every production behavior is covered by the chosen mocks. The Obsidian packet already documents what its screenshot freshness gate proves and does not prove, so no additional Ponytail transfer is supported there.

## Reflection

A verification label should map to the failure signal it can actually observe. This inspection found one concrete signal loss in the Webflow harness and no corresponding hidden claim in the Obsidian packet's stated screenshot boundary.

## Recommended Next Focus

Run a low-novelty recheck of the already-audited routing, review, hook, benchmark, and surface-verification areas. Promote only a materially new gap; otherwise evaluate convergence against the configured threshold.

## Sources Consulted

- specs/sk-code/011-sk-code-poinytail-based-refinement/context/skills/ponytail/SKILL.md:34-41
- specs/sk-code/011-sk-code-poinytail-based-refinement/context/tests/hooks-windows.test.js:107-125
- .skilled/skills/sk-code/sk-code-webflow/assets/scripts/test-minified-runtime.mjs:47-48,81-83,118-132,186-191,333-357,398-405
- .skilled/skills/sk-code/sk-code-webflow/assets/scripts/verify-minification.mjs:150-274
- .skilled/skills/sk-code/sk-code-obsidian/SKILL.md:17-23,54-57,142-160

## Assessment Notes

- Read-only audit only; no test was run and no source file was changed.
