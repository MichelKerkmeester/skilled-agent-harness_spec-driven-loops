### .skilled/skills/system-deep-loop/deep-ai-council/README.md

- [P2] `.skilled/skills/system-deep-loop/deep-ai-council/README.md:137` | 9 | A spec packet folder name (`033-deep-loop-behavior-benchmarks`) sits in the body, which the README template also forbids ("Keep READMEs current-state only. Do not cite spec packet numbers"). | Replace `live in the \`033-deep-loop-behavior-benchmarks\` packet` with `live in the deep-loop behavior-benchmarks packet`.
- [P2] `.skilled/skills/system-deep-loop/deep-ai-council/README.md:199` | 8 | §9 RELATED DOCUMENTS is this skill's document index, as it is in the sibling `deep-review/README.md`, but it omits six shipped references and two shipped markdown assets that `SKILL.md` §6 lists. | Insert after line 213 (`state-format`): `| [\`references/convergence/deep-mode.md\`](./references/convergence/deep-mode.md) | Deep-mode session, topic and round hierarchy with state files, cost guards and the runtime dependency |`, `| [\`references/convergence/failure-handling.md\`](./references/convergence/failure-handling.md) | Seat timeout, all-seat failure, contradiction and insufficient-vantage guidance |`, `| [\`references/patterns/anti-patterns.md\`](./references/patterns/anti-patterns.md) | Council quality failure modes, detection cues and recovery actions |`, `| [\`references/patterns/command-wiring.md\`](./references/patterns/command-wiring.md) | Caller-owned post-dispatch persistence patterns |`, `| [\`references/integration/graph-support.md\`](./references/integration/graph-support.md) | Derived council graph boundaries, tool surface and recovery behavior |`, `| [\`references/scoring/findings-registry.md\`](./references/scoring/findings-registry.md) | Cross-topic findings registry, fingerprint dedup and filesystem locking |`; insert after line 215 (`config`): `| [\`assets/deep-ai-council-dashboard.md\`](./assets/deep-ai-council-dashboard.md) | Status dashboard template for rounds, seats, convergence and artifact health |`, `| [\`assets/prompt-pack-round.md\`](./assets/prompt-pack-round.md) | Seat prompt template with role, context slots, critique steps and verdict footer |`.

### .skilled/skills/system-deep-loop/deep-ai-council/ROUTER.md

- [P3] `.skilled/skills/system-deep-loop/deep-ai-council/ROUTER.md:23` | 7 | One 120-word sentence packs the activation vocabulary and four resource families, and calls them "three" while listing four. | Replace line 23 with: `Requests reach this skill when they name \`deep-ai-council\`, \`ai council\`, \`council deliberation\`, \`multi-seat planning\`, \`planning council\`, \`council convergence\`, \`council artifacts\` or \`packet-local ai-council\`, and the \`system-deep-loop\` hub's \`ai-council\` signal selects this packet. It routes to three resource families:` then a blank line, then three bullets: `- The \`references/\` doctrine, which starts at \`references/integration/quick-reference.md\` on every invocation and adds the loop protocol, output schema, scoring, depth-dispatch, failure-handling, anti-pattern, folder-layout, state-format, seat-diversity, convergence, graph-support and findings-registry references as the intent asks for them.` / `- The \`assets/\` markdown templates.` / `- The \`manual-testing-playbook/\` operator scenarios.` then a blank line and the closing sentence `The \`scripts/\` helpers are invoked explicitly rather than routed.`
- [P2] `.skilled/skills/system-deep-loop/deep-ai-council/ROUTER.md:86` | 8 | The `references/` inventory names 8 of the 15 reference files, so a reader cannot discover `command-wiring`, `deep-mode`, `anti-patterns`, `graph-support`, `findings-registry`, `failure-handling` or `depth-dispatch` from it. | Replace line 86 with: `- \`references/\` contains the quick reference, loop protocol, graph support, anti-patterns, caller wiring, seat diversity, findings registry, scoring rubric, folder layout, output schema, council state format, depth dispatch, failure handling, convergence signals, and deep mode.`
- [P1] `.skilled/skills/system-deep-loop/deep-ai-council/ROUTER.md:88` | 1 | The router states 32 playbook scenarios; the playbook holds DAC-001..DAC-033 and 33 scenario files, and `README.md:195` says 33. | Replace `(32 scenarios across 9 categories)` with `(33 scenarios across 9 categories)`, and on line 89 replace `(32 entries)` with `(33 entries)`.

### .skilled/skills/system-deep-loop/deep-ai-council/SKILL.md

- [P1] `.skilled/skills/system-deep-loop/deep-ai-council/SKILL.md:16` | 1 | §1 is `OPERATIONAL MODES`, pushing `WHEN TO USE` to §2 and `SMART ROUTING` to §3; the template and the sibling `deep-research/SKILL.md` both open `1. WHEN TO USE`, `2. SMART ROUTING`, and the hub docs cite this skill's "§1 WHEN TO USE". | Delete lines 16-38 and reinsert the `## 3. OPERATIONAL MODES — IN-CLI (PRIMARY) + EXTERNAL-CLI (SECONDARY)` heading plus its body (original lines 17-36) after the SMART ROUTING divider at line 108, followed by one `---` divider; renumber `## 2. WHEN TO USE` → `## 1.`, `## 3. SMART ROUTING` → `## 2.`. `HOW IT WORKS` and `RULES` keep 4 and 5, so `(§5 ALWAYS rule 6)` at line 31 and `references/convergence/depth-dispatch.md:291` still resolve.
- [P2] `.skilled/skills/system-deep-loop/deep-ai-council/SKILL.md:80` | 1, 6 | `Keyword Triggers` is an activation trigger but sits after `When NOT to Use`, so a reader meets the anti-patterns before the keyword signals; the template groups it under Activation Triggers. | Move lines 80-90 (`### Keyword Triggers` and its nine bullets) to after line 49, before `### Use Cases` at line 51.
- [P1] `.skilled/skills/system-deep-loop/deep-ai-council/SKILL.md:216` | 2, 10 | `REFERENCES AND RELATED RESOURCES` is §6 but is followed by `SUCCESS CRITERIA` and `INTEGRATION POINTS`; `validate_document.py` reports `render_section_order` at this line. | Move lines 216-245 (the heading, reference list, related-skills line and its divider) to the end, after line 313; renumber it `## 8.`, `## 7. SUCCESS CRITERIA` → `## 6.`, `## 8. INTEGRATION POINTS` → `## 7.`.
- [P1] `.skilled/skills/system-deep-loop/deep-ai-council/SKILL.md:264` | 1 | The quality target says 32 playbook scenarios; the playbook and feature catalog both ship 33. | Replace `manual testing package has 32 scenarios across 9 categories` with `manual testing package has 33 scenarios across 9 categories`.

### .skilled/skills/system-deep-loop/deep-ai-council/assets/deep-ai-council-dashboard.md

- [P1] `.skilled/skills/system-deep-loop/deep-ai-council/assets/deep-ai-council-dashboard.md:21` | 2, 4 | OVERVIEW opens directly with the field table; `validate_document.py` reports `render_overview_orientation`, and the asset template requires Purpose and Usage before template content. | Insert after line 20 (`## 1. OVERVIEW`): `### Purpose` / blank / `One page of tables that shows where a council run stands, what each seat recommended and which artifacts already exist.` / blank / `### Usage` / blank / `Replace each placeholder with the run's values and refresh the status and next action as the run moves.` / blank.

### .skilled/skills/system-deep-loop/deep-ai-council/assets/deep-ai-council-strategy.md

- [P1] `.skilled/skills/system-deep-loop/deep-ai-council/assets/deep-ai-council-strategy.md:21` | 2, 4 | OVERVIEW opens directly with the field table; `validate_document.py` reports `render_overview_orientation`, and the asset template requires Purpose and Usage before template content. | Insert after line 20 (`## 1. OVERVIEW`): `### Purpose` / blank / `One brief that gives every seat the same planning boundary, the same mandates and the same list of open disagreements.` / blank / `### Usage` / blank / `Fill the rows before the round opens, then update the disagreement and convergence rows between rounds.` / blank.

### .skilled/skills/system-deep-loop/deep-ai-council/assets/prompt-pack-round.md

- [P1] `.skilled/skills/system-deep-loop/deep-ai-council/assets/prompt-pack-round.md:18` | 1, 4 | `validate_document.py` blocks this file: `missing_required_section: overview`. It has no `## 1. OVERVIEW`, and its four H2s are unnumbered, so the asset template order is absent. | Insert after line 16: `---` / blank / `## 1. OVERVIEW` / blank / `### Purpose` / blank / `The seat prompt for one council round: the role, the context slots, the critique steps and the verdict footer a seat returns.` / blank / `### Usage` / blank / `Fill every \`{{placeholder}}\` from the round strategy before dispatch, and keep the seat read-only.` / blank / `---`; then renumber `## Role` → `## 2. ROLE`, `## Context` → `## 3. CONTEXT`, `## Action` → `## 4. ACTION`, `## Format` → `## 5. FORMAT`, putting a `---` line and a blank line above each one.

### .skilled/skills/system-deep-loop/deep-ai-council/references/convergence/convergence-signals.md

- [P2] `.skilled/skills/system-deep-loop/deep-ai-council/references/convergence/convergence-signals.md:20` | 4 | OVERVIEW has no Purpose or When to Use; it opens with the rule body, unlike the sibling reference `deep-review/references/convergence/convergence-recovery.md`. | Insert after line 20: `### Purpose` / blank / `The rule that lets a council round stop with a report, and the signals that block that stop.` / blank / `### When to Use` / blank / `- Deciding whether a round may declare convergence and write \`council-report.md\`` / `- Explaining a round that ended without agreement` / blank.
- [P1] `.skilled/skills/system-deep-loop/deep-ai-council/references/convergence/convergence-signals.md:54` | 2, 10 | `## Convergence Threshold Semantics` is an unnumbered H2 among sections 1-4; `validate_document.py` reports `render_h2_numbering`. | Change line 54 to `## 5. CONVERGENCE THRESHOLD SEMANTICS`.

### .skilled/skills/system-deep-loop/deep-ai-council/references/convergence/deep-mode.md

- [P2] `.skilled/skills/system-deep-loop/deep-ai-council/references/convergence/deep-mode.md:22` | 1, 4 | OVERVIEW opens with `Core Principle`, has no Purpose, and puts `When to Use` after `Core Principle`; the reference skeleton orders Purpose, When to Use, Core Principle, Key Sources. | Insert `### Purpose` / blank / `The container model behind a long council session, with the file and the guard that each level owns.` / blank immediately after line 20, and move lines 26-28 (`### When to Use` and its paragraph) to before line 22.

### .skilled/skills/system-deep-loop/deep-ai-council/references/convergence/depth-dispatch.md

- [P1] .skilled/skills/system-deep-loop/deep-ai-council/references/convergence/depth-dispatch.md:19 | 2, 6, 10 | `## Deep Mode (Iterative Multi-Topic)` is an unnumbered H2 among numbered peers and sits before `## 1. OVERVIEW`; `validate_document.py` reports `render_h2_numbering`, and a reader meets deep-mode detail before the overview. | Move the block from line 19 through the paragraph at line 37 to after line 65 (the divider that closes §1), head it `## 2. DEEP MODE (ITERATIVE MULTI-TOPIC)`, add a `---` divider after the moved block, and renumber `## 2. DEPTH DETECTION` to `## 3.`, `## 3. DEPTH 0: PARALLEL DISPATCH` to `## 4.`, `## 4. DEPTH 1: SEQUENTIAL VIA MCP` to `## 5.`, `## 5. DECISION RULE FLOWCHART` to `## 6.`, `## 6. NO RECURSIVE COUNCILING` to `## 7.`, `## 7. CROSS-REFERENCES` to `## 8.`.
- [P2] .skilled/skills/system-deep-loop/deep-ai-council/references/convergence/depth-dispatch.md:41 | 4 | OVERVIEW has no Purpose or When to Use; it opens with dispatch prose and ends with the bare lead-in `Use this reference when:`. | Insert after line 41: `### Purpose` / blank / `A dispatch contract that keeps council work NDP-compliant at any nesting depth.` / blank; replace line 57 `Use this reference when:` with `### When to Use`.
- [P2] .skilled/skills/system-deep-loop/deep-ai-council/references/convergence/depth-dispatch.md:35 | 7 | The cost-guard paragraph packs four settings, the 45-output bound, operator tuning and the `:auto` disclosure into one paragraph. | Replace line 35 with `Default cost guards are intentionally conservative:` / blank / `- \`max_rounds_per_topic = 3\`` / `- \`max_topics_per_session = 5\`` / `- \`saturation_threshold = 0.20\`` / `- three seats per round` / blank / `The default upper bound is 45 seat outputs, but stable verdict deltas should stop topics earlier. Operators may tune these values through command setup answers, and \`:auto\` must surface the computed upper bound before dispatch.`
- [P2] .skilled/skills/system-deep-loop/deep-ai-council/references/convergence/depth-dispatch.md:291 | 6 | The qualifier `Unless those tools actually ran...` at line 293 belongs to the dishonest-label example but sits after the one-CLI invariant note, so it reads as a qualification of the invariant. | Move line 293 to after line 289 (the closing fence of the dishonest-label block), before line 291.

### .skilled/skills/system-deep-loop/deep-ai-council/references/convergence/failure-handling.md

- [P2] .skilled/skills/system-deep-loop/deep-ai-council/references/convergence/failure-handling.md:21 | 4 | OVERVIEW opens with the stance `The council is allowed to fail.` and has no Purpose or When to Use. | Insert after line 21: `### Purpose` / blank / `A run whose report, state log and resume path all agree about what failed.` / blank / `### When to Use` / blank / `- A seat times out or errors.` / `- A round loses quorum, or every seat fails.` / `- Seats contradict each other or real external vantages are unavailable.` / `- A failed round needs rollback, state-log treatment or a reduced-confidence handoff.` / blank.
- [P2] .skilled/skills/system-deep-loop/deep-ai-council/references/convergence/failure-handling.md:165 | 7 | One sentence packs the five things the contradiction report must include. | Replace line 165 with `The report should include:` / blank / `- both plans;` / `- evidence for each;` / `- risk for each;` / `- what priority chooses each option;` / `- a recommended user decision question.`
- [P2] .skilled/skills/system-deep-loop/deep-ai-council/references/convergence/failure-handling.md:200 | 7 | The closing paragraph packs the proceed condition and four escalation triggers into two sentences. | Replace line 200 with `Proceed with lens diversity only when:` / blank / `- local source evidence is sufficient;` / `- missing external vantages do not control the outcome.` / blank / `Escalate when:` / blank / `- external facts are central;` / `- no lens can challenge the default plan;` / `- all seats converge without evidence;` / `- the user explicitly required real external AI participation.`

### .skilled/skills/system-deep-loop/deep-ai-council/references/integration/graph-support.md

- [P2] .skilled/skills/system-deep-loop/deep-ai-council/references/integration/graph-support.md:20 | 4 | OVERVIEW defines the graph but has no Purpose or When to Use. | Insert after line 20: `### Purpose` / blank / `Structural questions about a council run answered from a rebuildable index rather than from a second source of truth.` / blank / `### When to Use` / blank / `- Auditing decisions, evidence chains or unresolved disagreements.` / `- Checking convergence blockers before a stop is approved.` / `- Rebuilding a projection that drifted from the packet artifacts.` / blank.
- [P2] .skilled/skills/system-deep-loop/deep-ai-council/references/integration/graph-support.md:45 | 5 | The namespace prohibition that governs all four graph commands sits after the command list. | Move line 45 to after line 37, ahead of `Dedicated graph operations run through the shared deep-loop runtime scripts...`.
- [P2] .skilled/skills/system-deep-loop/deep-ai-council/references/integration/graph-support.md:108 | 5 | The hard `Never rewrite historical...` rule sits after the recovery steps it governs. | Move line 108 to after line 97, ahead of `Safe recovery path:`.
- [P2] .skilled/skills/system-deep-loop/deep-ai-council/references/integration/graph-support.md:103 | 7 | Step 3 packs the replay script, its input, eight node kinds and the dry-run option into one paragraph. | Replace line 103 with `3. Replay derived nodes and edges from packet-local artifacts with \`scripts/replay-graph-from-artifacts.cjs\`.` / `   - It reads \`ai-council-state.jsonl\` and calls the runtime \`upsert.cjs --loop-type council\` path across the SESSION / ROUND / SEAT / CLAIM / EVIDENCE / DISAGREEMENT / DECISION / RECOMMENDATION node kinds.` / `   - Use \`--dry-run\` to inspect the derived payload without writing.`

### .skilled/skills/system-deep-loop/deep-ai-council/references/integration/loop-protocol.md

- [P2] .skilled/skills/system-deep-loop/deep-ai-council/references/integration/loop-protocol.md:20 | 4 | OVERVIEW opens with the four-phase list and has no Purpose or When to Use. | Insert after line 20: `### Purpose` / blank / `The phase order a caller follows so a council report and its state land in the packet exactly once.` / blank / `### When to Use` / blank / `- Running a round from packet resolution to persisted handoff.` / `- Checking what each phase must load before it starts.` / `- Recovering a run from disk state instead of conversation memory.` / blank.
- [P2] .skilled/skills/system-deep-loop/deep-ai-council/references/integration/loop-protocol.md:153 | 7 | The acceptance criterion is one 46-word sentence that packs the event-order nuance, the report and failed-round preservation. | Replace line 153 with `Acceptance criteria:` / blank / `- \`ai-council-state.jsonl\` contains a \`council_complete\` event, not necessarily the final line: \`artifact_written\` audit events for the state log itself and each subsequent artifact write typically follow it (see \`references/structure/state-format.md\` §5.1).` / `- The final report exists.` / `- Any failed rounds are preserved under \`failed/\`.`

### .skilled/skills/system-deep-loop/deep-ai-council/references/integration/quick-reference.md

- [P2] .skilled/skills/system-deep-loop/deep-ai-council/references/integration/quick-reference.md:20 | 4 | OVERVIEW opens with a When-to-Use sentence and has no Purpose. | Insert after line 20: `### Purpose` / blank / `An operator's shortest path from a planning question to validated, persisted artifacts.` / blank / `### When to Use` / blank.
- [P2] .skilled/skills/system-deep-loop/deep-ai-council/references/integration/quick-reference.md:67 | 8 | The artifact map omits `ai-council-strategy.md`, which the persistence helper writes and `command-wiring.md` §6 lists. | Insert after line 69 the row `ai-council-strategy.md` with Owner `Persistence helper` and Purpose `First-run charter: task framing, selected lenses, executor targets and the convergence rule`.
- [P2] .skilled/skills/system-deep-loop/deep-ai-council/references/integration/quick-reference.md:80 | 5 | The stop-and-escalate gate sits after the persist command it gates. | Move lines 80-90 (the `## 5. STOP AND ESCALATE` section and its trailing divider) to before line 41, keep a blank line after the moved divider, change the moved heading to `## 3.`, and renumber `## 3. COMMANDS` to `## 4.` and `## 4. ARTIFACTS` to `## 5.`.

### .skilled/skills/system-deep-loop/deep-ai-council/references/patterns/anti-patterns.md

- [P2] .skilled/skills/system-deep-loop/deep-ai-council/references/patterns/anti-patterns.md:20 | 4 | OVERVIEW opens with the council's contract and has no Purpose or When to Use. | Insert after line 20: `### Purpose` / blank / `A council report whose rigor can be checked, not assumed.` / blank / `### When to Use` / blank / `- Auditing a council report before accepting its consensus.` / `- Diagnosing a run that converged too easily.` / `- Repairing a report that lost attribution or simulated labels.` / blank.

### .skilled/skills/system-deep-loop/deep-ai-council/references/patterns/command-wiring.md

- [P2] .skilled/skills/system-deep-loop/deep-ai-council/references/patterns/command-wiring.md:20 | 4 | OVERVIEW opens with the planning-only rule and has no Purpose or When to Use. | Insert after line 20: `### Purpose` / blank / `Durable packet artifacts for a returned council report, written by the caller that holds write access.` / blank / `### When to Use` / blank / `- A top-level caller dispatches \`@deep-ai-council\` and needs durable artifacts.` / `- \`@orchestrate\` runs the council as a LEAF.` / `- A command YAML or an external CLI playbook owns the persistence step.` / blank.
- [P2] .skilled/skills/system-deep-loop/deep-ai-council/references/patterns/command-wiring.md:131 | 8 | The helper-inputs table is the flag index but omits `--not-converged`, which both the shell and YAML snippets pass. | Insert after line 139 the row `--not-converged` with Required `No` and Purpose `Records convergence:false on the persisted council_complete event when the round ceiling was reached without a converged report`.

### .skilled/skills/system-deep-loop/deep-ai-council/references/patterns/seat-diversity-patterns.md

- [P2] .skilled/skills/system-deep-loop/deep-ai-council/references/patterns/seat-diversity-patterns.md:23 | 4 | OVERVIEW opens with the quality-gate thesis and has no Purpose or When to Use. | Insert after line 23: `### Purpose` / blank / `A council that earns its extra cost by comparing genuinely different judgments.` / blank / `### When to Use` / blank / `- Choosing two or three lenses for a round.` / `- Pairing a lens with a vantage target.` / `- Sizing a round before dispatch.` / blank.
- [P2] .skilled/skills/system-deep-loop/deep-ai-council/references/patterns/seat-diversity-patterns.md:138 | 7 | One paragraph packs within-round model diversity and across-round CLI staging. | Replace line 138 with `- **Within one round**: vantage diversity comes from different models or reasoning levels on the same CLI (for example, on \`cli-opencode\`: \`deepseek/deepseek-v4-pro --variant high\` + \`llmgateway/glm-5.3-flash\`; on \`cli-claude-code\`: Opus + Haiku).` / `- **Across rounds**: cross-CLI diversity is staged as additional rounds, and each round runs on one CLI only.`

### .skilled/skills/system-deep-loop/deep-ai-council/references/scoring/findings-registry.md

- [P2] .skilled/skills/system-deep-loop/deep-ai-council/references/scoring/findings-registry.md:22 | 4 | `## 1. OVERVIEW` opens with `### Core Principle`; `### When to Use` follows it and no `### Purpose` exists. | Replace lines 22-28 with:

  ```markdown
  ### Purpose

  Keep what the council has already established available to later topics, so a repeated claim is recognised instead of re-argued.

  ### When to Use

  Use the registry when you need to track findings across multiple topics in a session and retrieve priors for later topics.

  ### Core Principle

  Findings persist across topics. Fingerprints prevent duplicates. Locking prevents corruption.
  ```

### .skilled/skills/system-deep-loop/deep-ai-council/references/scoring/scoring-rubric.md

- [P2] .skilled/skills/system-deep-loop/deep-ai-council/references/scoring/scoring-rubric.md:22 | 4 | `## 1. OVERVIEW` has no Purpose or When to Use heading; it opens with the failure-mode paragraph, and the planning-only scope sentence at line 26 is unlabelled. | Insert `### Purpose` and a blank line before line 22; insert `### When to Use` and a blank line before line 26.
- [P2] .skilled/skills/system-deep-loop/deep-ai-council/references/scoring/scoring-rubric.md:268 | 7 | Four distinct rules are packed into one paragraph. | Replace line 268 with:

  ```markdown
  - Close races merge only elements that improve the plan without bloating it.
  - All-low-score rounds escalate for reframing.
  - Timeout rows remain visible as `TIMEOUT (N/A)` and are excluded from scored totals.
  - Simulated external vantages must be labeled as simulated unless the CLI or native agent actually executed.
  ```

### .skilled/skills/system-deep-loop/deep-ai-council/references/structure/folder-layout.md

- [P2] .skilled/skills/system-deep-loop/deep-ai-council/references/structure/folder-layout.md:22 | 4 | `## 1. OVERVIEW` opens with the bold persistence rule; it has no Purpose or When to Use. | Insert before line 22:

  ```markdown
  ### Purpose

  Make every file a completed council run leaves behind traceable to the record it holds and the writer that produced it.

  ### When to Use

  - You are starting a council run and need to know what it will write.
  - You are inspecting a completed run and need to find the record for a round, a seat, or a rollback.
  ```

- [P2] .skilled/skills/system-deep-loop/deep-ai-council/references/structure/folder-layout.md:68 | 1 | The document-level cross-reference list is an unheaded block inside §1, so it is not the last H2 the template requires. | Replace line 68 `Cross-references:` with `---`, a blank line, `## 2. CROSS-REFERENCES`, and a blank line.

### .skilled/skills/system-deep-loop/deep-ai-council/references/structure/output-schema.md

- [P2] .skilled/skills/system-deep-loop/deep-ai-council/references/structure/output-schema.md:21 | 4 | `## 1. OVERVIEW` has no Purpose or When to Use heading; it opens with the source-of-truth paragraph. | Insert `### Purpose` and a blank line before line 21; insert `### When to Use`, a blank line, and these bullets before line 23:

  ```markdown
  - You are changing the report sections `@deep-ai-council` must return.
  - You are debugging why `persist-artifacts.cjs` rejected a report or wrote placeholders for optional sections.
  ```

- [P2] .skilled/skills/system-deep-loop/deep-ai-council/references/structure/output-schema.md:25 | 10 | The cross-reference list sits inside §1, before §2-§6, so the related-resources section is not last. | Move lines 25-29 to the end of the file after line 135; change `Cross-references:` to `## 7. CROSS-REFERENCES` and add `---` plus a blank line above it.
- [P2] .skilled/skills/system-deep-loop/deep-ai-council/references/structure/output-schema.md:52 | 5 | The `Strict-required`/`Optional` definition comes after the §2 matrix that uses the terms. | Move line 52 to directly after line 34, before the table header at line 35.

### .skilled/skills/system-deep-loop/deep-ai-council/references/structure/state-format.md

- [P2] .skilled/skills/system-deep-loop/deep-ai-council/references/structure/state-format.md:22 | 4 | `## 1. OVERVIEW` opens with the `council_complete` rule; it has no Purpose or When to Use. | Insert before line 22:

  ```markdown
  ### Purpose

  Make the event log sufficient to tell an interrupted run from a completed one.

  ### When to Use

  - You are resuming an interrupted council run.
  - You are verifying that a run completed and its artifacts were written.
  - You are adding or changing a state event type.
  ```

- [P2] .skilled/skills/system-deep-loop/deep-ai-council/references/structure/state-format.md:156 | 10 | `## 5.1` (line 156) and `## 5.2` (line 171) are decimal H2 numbers among integer peers; `validate_document.py` reports `render_h2_numbering` at both lines. | Change both to H3: `### 5.1 WORKED EXAMPLE (V1.2 AUDIT TRAIL)` and `### 5.2 PROGRESS RECORD (v1.3, shared cross-mode)`. This keeps the `§5.1` label cited by `loop-protocol.md:153`.
- [P2] .skilled/skills/system-deep-loop/deep-ai-council/references/structure/state-format.md:201 | 6 | `Threshold T derivation` comes after the rules that use `T`. | Move lines 201-203 to directly before line 193 (`Rules:`).
- [P2] .skilled/skills/system-deep-loop/deep-ai-council/references/structure/state-format.md:215 | 7 | §6 packs four resume branches into one paragraph. | Replace line 215 with:

  ```markdown
  The last completed event determines the next action.

  - `round_start` exists without all expected `seat_returned` events: redo or complete that round.
  - All seats returned but `deliberation_synthesized` is missing: synthesize deliberation.
  - Deliberation exists but `round_end` is missing: close the round.
  - `council_complete` exists: treat the council as done unless the user requests another round.
  ```

- [P2] .skilled/skills/system-deep-loop/deep-ai-council/references/structure/state-format.md:223 | 10 | The document-level cross-reference list has no heading and sits inside §7 VALIDATION POLICY, so the related-resources section is not its own last section. | Replace line 223 `Cross-references:` with `---`, a blank line, `## 8. CROSS-REFERENCES`, and a blank line.

