### .skilled/skills/system-deep-loop/deep-research/README.md
- [P2] .skilled/skills/system-deep-loop/deep-research/README.md:41 | 1 | The README template bans semicolons in README prose, and this is the file's only one. | Replace `.../mode-registry.json`); this packet...` with `.../mode-registry.json`. This packet...` so the semicolon becomes a full stop.
- [P2] .skilled/skills/system-deep-loop/deep-research/README.md:78 | 9 | "now include" is a temporal change marker in a current-state README. | Delete `now `: `Lifecycle controls include [run-now control]...`
- [P2] .skilled/skills/system-deep-loop/deep-research/README.md:82 | 7 | The Externalized State paragraph packs five file roles and three ownership rules into one block; the README template asks for an itemized inventory. | Replace line 82 with:
  ```text
  All continuity lives in packet files under `{spec_folder}/research/`, not in conversation memory.
  - **Config:** `deep-research-config.json` holds settings.
  - **Log:** the append-only `deep-research-state.jsonl` records every iteration, event and convergence signal.
  - **Strategy:** `deep-research-strategy.md` tracks focus areas, what worked, what failed and exhausted approaches.
  - **Registry:** `findings-registry.json` indexes every discovery.
  - **Dashboard:** `deep-research-dashboard.md` shows convergence trends.
  - **Reducer:** machine-owns the strategy sections, the registry and the dashboard.
  - **Agent:** writes only iteration files and JSONL records.
  - **Workflow:** owns the canonical `research.md`.
  ```
- [P2] .skilled/skills/system-deep-loop/deep-research/README.md:205 | 1 | The capability-matrix row names OpenCode twice and omits Copilot, which the matrix actually covers. | Replace `across OpenCode, Claude and OpenCode executors` with `across OpenCode, Copilot and Claude executors`.

### .skilled/skills/system-deep-loop/deep-research/ROUTER.md
- [P2] .skilled/skills/system-deep-loop/deep-research/ROUTER.md:23 | 7 | The OVERVIEW is one sentence carrying the trigger vocabulary, hub selection, the default reference, the conditional reference families and the asset family. | Replace line 23 with:
  ```text
  - Requests reach this skill when they name `autoresearch`, a deep research loop, autonomous or iterative research, a multi-round investigation, a convergence check, a stuck loop, a research state packet or a `spec.md` anchoring question. The `system-deep-loop` hub's `research` mode selects this packet.
  - It routes to two resource families. The `references/` doctrine starts at `references/guides/quick-reference.md` on every invocation and adds the loop protocol, spec anchoring, convergence, state, recovery, runtime-parity and resource-map references. The `assets/` markdown templates and prompt assets load on explicit request.
  ```

### .skilled/skills/system-deep-loop/deep-research/SKILL.md
- [P2] .skilled/skills/system-deep-loop/deep-research/SKILL.md:19 | 1 | An H3 subsection sits in the H1 intro zone before Section 1; the SKILL template allows no subsections in the intro and requires the body to open with numbered H2s. | Move lines 19-30 to immediately after line 80 (`## 3. HOW IT WORKS`), before `### Invocation Contract`, keeping the block verbatim and one blank line on each side. The move is line-count neutral, so the cited lines at 95, 129, 148, 154 and 224 keep their numbers.
- [P1] .skilled/skills/system-deep-loop/deep-research/SKILL.md:229 | 10 | "(see §8 EXAMPLES)" points to a section that does not exist; §8 is REFERENCES AND RELATED RESOURCES and this file has no EXAMPLES section. | Delete ` (see §8 EXAMPLES)` so the sentence reads `...flags on the command. Each lineage...`

### .skilled/skills/system-deep-loop/deep-research/assets/deep-research-dashboard.md
- [P2] .skilled/skills/system-deep-loop/deep-research/assets/deep-research-dashboard.md:83 | 10 | `## 6A.` is a letter-suffixed H2, the file's only validator warning. | Rename to `## 7. DIVERGENT PIVOTS`; shift `## 7. NEXT FOCUS` to 8, `## 8. ACTIVE RISKS` to 9, `## 9. EXAMPLE (POPULATED)` to 10. The reducer emits the same titles at `scripts/reduce-state.cjs:2887, 3011, 3016, 3023, 3035`, so change them to 7, 8, 9, 10, 11 in the same commit.
- [P2] .skilled/skills/system-deep-loop/deep-research/assets/deep-research-dashboard.md:130 | 1 | The populated example labels the trend section `## 5. CONVERGENCE TREND`, but section 5 above and the reducer both use `## 5. TREND`. | Replace `## 5. CONVERGENCE TREND` with `## 5. TREND`.

### .skilled/skills/system-deep-loop/deep-research/assets/deep-research-strategy.md
- [P2] .skilled/skills/system-deep-loop/deep-research/assets/deep-research-strategy.md:131 | 10 | Sections 10A and 11A carry letter suffixes, and 11A sits before 11, so the file reads 10, 10A, 11A, 11, 12. | Renumber in document order, reserving 13 for the reducer's optional rejected-pattern cache: `10A`→`11`, `11A`→`12`, `11`→`14`, `12`→`15`, `13`→`16`. Change line 180 to `reducer controls Sections 3, 6, 7-14, including Section 11 pivot lineage`, and change the reducer titles at `scripts/reduce-state.cjs:2762, 2769, 2783, 2809` to 11, 12, 13, 14.

### .skilled/skills/system-deep-loop/deep-research/references/convergence/convergence-graph.md
- clean

### .skilled/skills/system-deep-loop/deep-research/references/convergence/convergence-recovery.md
- [P2] .skilled/skills/system-deep-loop/deep-research/references/convergence/convergence-recovery.md:17 | 3 | The intro opens with "This reference covers...", a pure pointer sentence that restates the Purpose. | Replace the first sentence with `When a research run stalls, the recovery ladder runs from retrying one source to state reconstruction and operator escalation.` Keep the second sentence, `The stop contract lives in `convergence.md`.`

### .skilled/skills/system-deep-loop/deep-research/references/convergence/convergence-reference-only.md
- clean

### .skilled/skills/system-deep-loop/deep-research/references/convergence/convergence-signals.md
- [P2] .skilled/skills/system-deep-loop/deep-research/references/convergence/convergence-signals.md:19 | 3 | The first intro sentence is a pure pointer ("This reference defines...") that restates the Purpose and gives no reason to open the file; only the second sentence carries a fact (where the stop contract lives). | Replace the first sentence with: "Reach for it when a run's STOP decision has to be defended from the raw ratios upward, or when a reported number needs tracing back to the record that produced it." Leave the second sentence ("The compact stop contract lives in `convergence.md`.") verbatim.

### .skilled/skills/system-deep-loop/deep-research/references/convergence/convergence.md
- [P2] .skilled/skills/system-deep-loop/deep-research/references/convergence/convergence.md:70 | 7 | One 654-character paragraph packs four mechanisms: council composition, the no-external-CLI rule, the three-seat transaction rule, the candidate sources, and the completion/failure branch. | Split line 70 into a lead sentence plus four bullets, wording unchanged: lead "Each eligible pivot runs one native, in-process Council round with exactly three distinct seats: analytical, critical, and pragmatic."; bullets "It does not use an external CLI.", "The transaction requires all three seat returns to be parse-valid and at least two seats to materially endorse the same candidate without a high-severity blocker.", "Research candidates come from persisted adjacent questions, contradiction or verification gaps, missing source classes, alternate evidence methods, and independent checks of recent findings.", "A completed pivot restores the selected candidate's focus and returns to the research loop; a failed pivot fails closed to synthesis."

### .skilled/skills/system-deep-loop/deep-research/references/guides/capability-matrix.md
- [P2] .skilled/skills/system-deep-loop/deep-research/references/guides/capability-matrix.md:27 | 4 | The overview goes Purpose then Machine-Readable Source of Truth and never says when to load the matrix. | Insert before line 27: "### When to Use\n\nLoad this matrix when adding or auditing a runtime mirror, or when deciding whether a provider difference is allowed adaptation or forbidden drift."

### .skilled/skills/system-deep-loop/deep-research/references/guides/quick-reference.md
- [P1] .skilled/skills/system-deep-loop/deep-research/references/guides/quick-reference.md:223 | 10 | RELATED is not the last H2; REVIEW MODE follows it, and `validate_document.py` reports `render_section_order` at line 223. | Move lines 236-238 to before line 223, renumber the moved heading to `## 12. REVIEW MODE` and the existing heading to `## 13. RELATED`, and delete the `---` left at the end of the file.
- [P2] .skilled/skills/system-deep-loop/deep-research/references/guides/quick-reference.md:24 | 4 | The overview has neither Purpose nor When to Use; the opening paragraph is unlabelled and the page's only "when" content sits in §3, far below. | Replace lines 22-31 with: "## 1. OVERVIEW\n\n### Purpose\n\nLookup surface during runs covering when to invoke the loop, what each phase produces, how convergence is computed, and where live state lives on disk. Defer to the full protocol and convergence references for deep reasoning.\n\n### When to Use\n\n- Before a run, to confirm the command and its parameter defaults.\n- During a run, to follow the iteration checklist and the convergence decision tree.\n- After a run, to read the convergence summary and tune or troubleshoot the next one.\n\n### Key Sources\n\nOperator contract source of truth for this page:\n- command syntax: `.skilled/commands/deep/research.md`\n- convergence stop contract: `references/convergence/convergence.md`, `references/convergence/convergence-signals.md`, and the deep-research YAML workflow\n- state packet contract: `references/state/state-format.md`, `references/state/state-jsonl.md`, `references/state/state-outputs.md`, and `references/state/state-reducer-registry.md`"
- [P2] .skilled/skills/system-deep-loop/deep-research/references/guides/quick-reference.md:148 | 5 | The rule that quality guards must pass before STOP sits after the decision tree whose branch reads "Yes --> STOP (converged)", so a reader following the tree stops without the guard rule. | Move line 148 to line 119, directly under `## 7. CONVERGENCE DECISION TREE` and before the ```text block.

### .skilled/skills/system-deep-loop/deep-research/references/protocol/context-snapshot.md
- clean

### .skilled/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md
- [P2] .skilled/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md:166 | 6 | Step 2c sits between Step 2 and Step 2a, so the step sequence reads 2, 2c, 2a, 2b, 2d and a reader scanning headings sees the steps out of order. | Move lines 166-179 to after line 215 so the order becomes 2, 2a, 2b, 2c, 2d; the `convergence.md §2.4` citation currently at line 169 then sits at line 202.
- [P2] .skilled/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md:410 | 6 | Step 3b is an H3 among H4 steps and sits after Step 5 and the Stuck Recovery Protocol, separated from Step 3a, so it reads as a peer of "Stuck Recovery Protocol" rather than a step. | Move lines 410-426 to after line 307 and change the heading to `#### Step 3b: Direct Mode Fallback (REFERENCE-ONLY)`; the `convergence.md §4` citation currently at line 400 then sits at line 417.
- [P2] .skilled/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md:272 | 9 | Spec numbers sit in the body: "spec 018 + 019" in the heading and "(spec 018)", "(spec 019)", "from spec 018" in the bullets and the failure-handling line. | Change line 272 to `#### Executor Resolution`; line 276 to `- \`native\`: dispatch \`@deep-research\` agent with model Opus.`; line 278 to `- \`cli-claude-code\`: \`claude -p ...\`` (drop only the `(spec 019)` parenthetical); line 294 to `Failure handling: \`schema_mismatch\` → conflict event → 3 consecutive failures → \`stuck_recovery\`.`
- [P2] .skilled/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md:292 | 7 | A single 2,601-character bullet carries nine mechanisms: attribution, the default preserve remedy, opt-in restore, untracked-file handling, the contested second-writer path, earlier-quarantine ownership, the sibling-lineage lock exemption, diff storage, and baseline storage. | Split line 292 into the existing bold lead plus six sub-bullets, moving whole sentences verbatim: "Default remedy is preserve." (byte-for-byte preservation, ledger/observability recording, `completed_with_containment_advisory`); "Restore is opt-in" (single-writer condition, pre-dispatch bytes, baseline-less path, untracked files); "Contested path" (second writer, `containment_contested`/`containmentContested`, single-lineage reporting); "Earlier quarantine" (lane-owned path, clean-at-baseline attribution); "Sibling lineage exemption" (live loop lock, no-lock/stale attribution); "Evidence" (the `containment/quarantine/...` diff paths and `<lineage dir>/containment/baseline/`).

### .skilled/skills/system-deep-loop/deep-research/references/protocol/spec-check-protocol.md
- [P2] .skilled/skills/system-deep-loop/deep-research/references/protocol/spec-check-protocol.md:29 | 4 | The overview goes Purpose then Scope then Relation to the Deep-Research Loop and never says when to load the protocol. | Insert before line 29: "### When to Use\n\nLoad this protocol when a deep-research run will touch `spec.md`: seeding a missing one, adding pre-init context, or writing back after synthesis."
- [P2] .skilled/skills/system-deep-loop/deep-research/references/protocol/spec-check-protocol.md:163 | 7 | One 571-character paragraph packs gateway ingestion, a seven-stem enumeration, the upcast rule, and the log display rule. | Replace line 163 with: "Each spec-protocol row a workflow writes keeps its legacy shape. The append gateway accepts it and stores it as a typed ledger event under one of seven stems:\n\n- `deep_research.spec_check_result`\n- `deep_research.spec_seed_created`\n- `deep_research.spec_preinit_context_added`\n- `deep_research.spec_preinit_context_deduped`\n- `deep_research.spec_mutation`\n- `deep_research.spec_mutation_conflict`\n- `deep_research.spec_synthesis_deferred`\n\nThe gateway upcasts the row into that stem's payload, and the state log shows the row as written, with the append time as its timestamp."

### .skilled/skills/system-deep-loop/deep-research/references/state/state-format.md
- clean

### .skilled/skills/system-deep-loop/deep-research/references/state/state-jsonl.md
- clean

### .skilled/skills/system-deep-loop/deep-research/references/state/state-outputs.md
- [P2] .skilled/skills/system-deep-loop/deep-research/references/state/state-outputs.md:18 | 3 | The intro opens with "This reference covers human-readable packet outputs." — a pure pointer sentence that restates the Purpose at line 26 and gives no reason to open the file. The second sentence is a routing fact and stays. | Replace `This reference covers human-readable packet outputs.` with `Open it before writing an iteration narrative or the final synthesis, so every section the reducer and the operator expect is present.` Keep the second sentence (`JSONL records live in ...`) verbatim.
- [P2] .skilled/skills/system-deep-loop/deep-research/references/state/state-outputs.md:159 | 5 | The ownership rule "This output path is protocol-owned, not iteration-agent owned" — the trust rule deciding who may perform the four writes — sits after the write steps it governs, so an iteration agent reading the bullets reaches the prohibition last. | Move line 159 to immediately before line 152, so the section reads: ownership sentence, then "`references/protocol/spec-check-protocol.md` defines bounded `spec.md` writes:" and the four bullets.

### .skilled/skills/system-deep-loop/deep-research/references/state/state-reducer-registry.md
- [P2] .skilled/skills/system-deep-loop/deep-research/references/state/state-reducer-registry.md:51 | 5 | The fail-closed trust rule ("It must fail closed before writing derived files when JSONL corruption is detected in strict mode") sits after the eight-item reducer contract list, so a reader following the bullets reaches the guard only after the writes it is meant to stop. | Move line 51 to immediately before line 40 and change `It must fail closed` to `The reducer must fail closed`, leaving the eight-item list unchanged after "The workflow reducer:".

