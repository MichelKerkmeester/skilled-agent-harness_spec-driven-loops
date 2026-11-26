# Iteration 4: Q3 Hub and Executor Surface Audit

## Focus

Inspect the changed `mcp-browser-use`, `mcp-tooling`, `cli-external-orchestration` and former `cli-orca` surfaces for broken paths, registry or hub-router drift, and executor-builder issues. The state read also showed that iteration 3 recorded Q2 as answered while the strategy and registry still show it open; I traced that mismatch because it affects question coverage.

## Actions Taken

1. Read the config, iteration log, strategy and findings registry before choosing the focus. The log had three iteration records and an iteration-4 start row; the strategy's next focus is Q3. No exhausted approach blocks this pass.
2. Compared the changed-path inventory in `v4.1.0.0..HEAD` with the current hub registries and routers. The browser modes now appear under `mcp-browser-use`; `mcp-tooling` lists the remaining six modes. The current CLI hub lists eight modes, with no `cli-orca` entry.
3. Compared the current versions and mode lists in the registries and router manifests. The three pairs report the same version and corresponding mode keys.
4. Read the changed OpenCode setup helper. Its supported operations are v2 installation and a read-only check; it does not construct an executor dispatch command. No tests or live route replay were run.
5. Traced Q2 closure through the reducer's question comparison. It normalizes whitespace only, then compares the full strategy question text against `answeredQuestions`.

## Findings

1. **P3 — Q2's stored answer omits the prefix the reducer matches.** Iteration 3's `answeredQuestions` entry is `Does the changed system-skill-advisor ...?`, while the strategy and registry store `Q2: Does the changed system-skill-advisor ...?`. The reducer's `normalizeText` only collapses whitespace, and its resolution path checks whether the normalized full strategy question is included in the normalized `answeredQuestions` list. The strings therefore do not match, leaving Q2 open in the registry and strategy despite the prior iteration's answer. This is a packet-state mismatch; the evidence does not show a reducer implementation defect. This record carries Q2's exact full text so the next reducer pass can recognize the prior answer. [SOURCE: specs/system-speckit/runtime-and-release/007-v4-2-0-0-release-audit-research/research/deep-research-state.jsonl:12] [SOURCE: specs/system-speckit/runtime-and-release/007-v4-2-0-0-release-audit-research/research/deep-research-strategy.md:59] [SOURCE: specs/system-speckit/runtime-and-release/007-v4-2-0-0-release-audit-research/research/findings-registry.json:24] [SOURCE: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:210] [SOURCE: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:2740] [SOURCE: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:2749]

## Ruled Out

- No version or mode-key mismatch was found between the current registry and hub-router manifests for `mcp-browser-use`, `mcp-tooling` and `cli-external-orchestration`. The moved Chrome DevTools and Aside modes are listed under `mcp-browser-use`, and absent from `mcp-tooling`'s current registry/router. [SOURCE: .skilled/skills/mcp-browser-use/mode-registry.json:3] [SOURCE: .skilled/skills/mcp-browser-use/hub-router.json:3] [SOURCE: .skilled/skills/mcp-tooling/mode-registry.json:3] [SOURCE: .skilled/skills/mcp-tooling/hub-router.json:3]
- The current CLI registry/router manifests list eight CLI modes and do not retain `cli-orca`. The changed OpenCode setup helper is an installer/checker, not a dispatch-command builder. Static review found no executor-builder defect; runtime reachability remains unchecked. [SOURCE: .skilled/skills/cli-external-orchestration/mode-registry.json:3] [SOURCE: .skilled/skills/cli-external-orchestration/mode-registry.json:19] [SOURCE: .skilled/skills/cli-external-orchestration/mode-registry.json:241] [SOURCE: .skilled/skills/cli-external-orchestration/hub-router.json:3] [SOURCE: .skilled/skills/cli-external-orchestration/hub-router.json:34] [SOURCE: .skilled/skills/cli-external-orchestration/hub-router.json:104] [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/scripts/opencode-setup.sh:8] [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/scripts/opencode-setup.sh:28]

## Dead Ends

- The static manifests did not reveal a registry/router key or version drift.
- The reviewed changed CLI helper did not contain executor construction logic, so it yielded no executor-builder defect.

## Edge Cases

- Ambiguous input: none.
- Contradictory evidence: iteration 3's state record says Q2 was answered, while the current strategy and registry leave it open. The exact text mismatch explains the reducer outcome; this iteration records the full Q2 question text for the next reducer pass.
- Missing dependencies: none.
- Partial success: the static registry and helper review is complete, but runtime route reachability and any shared executor builder outside the changed paths were not exercised. Q3 remains open for that narrow follow-up.

## Sources Consulted

- `specs/system-speckit/runtime-and-release/007-v4-2-0-0-release-audit-research/research/deep-research-config.json`
- `specs/system-speckit/runtime-and-release/007-v4-2-0-0-release-audit-research/research/deep-research-state.jsonl:12`
- `specs/system-speckit/runtime-and-release/007-v4-2-0-0-release-audit-research/research/deep-research-strategy.md:59`
- `specs/system-speckit/runtime-and-release/007-v4-2-0-0-release-audit-research/research/findings-registry.json:24`
- `.skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:210, 2740`
- `.skilled/skills/mcp-browser-use/mode-registry.json:3, 19`
- `.skilled/skills/mcp-browser-use/hub-router.json:3, 29`
- `.skilled/skills/mcp-tooling/mode-registry.json:3, 30`
- `.skilled/skills/mcp-tooling/hub-router.json:3, 32`
- `.skilled/skills/cli-external-orchestration/mode-registry.json:3, 19`
- `.skilled/skills/cli-external-orchestration/hub-router.json:3, 34`
- `.skilled/skills/cli-external-orchestration/cli-opencode/scripts/opencode-setup.sh:8, 28`
- `git diff --name-only v4.1.0.0..HEAD -- .skilled/skills/mcp-browser-use .skilled/skills/mcp-tooling .skilled/skills/cli-external-orchestration .skilled/skills/cli-orca`

## Assessment

- New information ratio: 0.5
- Questions addressed: Q2 closure mismatch; static Q3 registry/router review.
- Questions answered: Q2; the prior Pi route-receipt finding remains the substantive answer, and this record supplies the exact question text for reducer closure.
- Questions remaining: Q3 runtime route/executor-consumer follow-up, Q4 and Q5.

## Reflection

- What worked and why: comparing the canonical answer text with the reducer's exact normalized comparison identified why a previously answered question stayed open.
- What did not work and why: static hub files did not establish runtime route reachability or cover a shared executor builder outside the changed paths.
- What I would do differently: inspect the stage-one metadata and executor-registry consumer alongside the compiled route path in the Q3 follow-up.

## Questions Answered

- Q2: Does the changed system-skill-advisor (scorer, hooks, brief policy, embedding-lane removal) hold routing bugs or drift between code, hook docs and AGENTS.md Gate 2? Yes. Iteration 3's cited Pi adapter finding answers it; this iteration corrects the answer text shape needed for reducer closure.

## Questions Remaining

- Q3: Do the changed mcp-browser-use, mcp-tooling, cli-external-orchestration and cli-orca modes hold broken paths, registry or hub-router drift, or executor builder bugs? Static manifest review found no drift; runtime route and executor-consumer checks remain.
- Q4: Do the changed system-spec-kit runtime and hooks (decision-capture, session-handover, cli-dispatch, overlay-guard, git hooks) hold logic bugs or doc drift against what v4.2.0.0 claims?
- Q5: Do the doctor commands and skill, sk-doc, sk-code, sk-git, runtime mirrors, CI workflows and the v4.2.0.0 changelog agree with the code they describe?

## Recommended Next Focus

Q3 follow-up: inspect stage-one hub metadata and the executor-registry consumer, then confirm every declared hub-router resource path resolves. Keep Q4 and Q5 for later iterations.
