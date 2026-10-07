# Deep Research Iteration 001 — Q1/Q2: Placement Decision Surfaces and Relatedness Signals

- **Run:** 007-series-parent-review-and-hardening-research (lineage session `2026-10-07T05:19:14.761Z`)
- **Iteration:** 1 of 10 | **Focus:** Q1 and Q2 | **Status:** insight | **New info ratio:** 0.72
- **Parallel review status:** `review/iterations/` and `review/deltas/` are empty as of this iteration, so the phase-006 deep review had not yet published defects to reuse.

## Focus

- **Q1:** At the moment an agent decides where new work goes (Gate 3 prompt text, `gate-3-classifier.ts`, the Gate 3 runtime hook, `/speckit:plan` setup), does anything surface the series parent rule or the sibling packets, and where are the gaps that still let a related singleton be created?
- **Q2:** Which existing mechanisms already compute relatedness (gate-3-classifier, folder-routing, the trigger index and lookup, the skill advisor, recommend-level.sh, graph-metadata) and which could detect a same-artifact sibling mechanically instead of relying on the agent to read stderr?

## Actions Taken

1. Loaded run state (config, strategy, registry, state log) and confirmed a fresh run with empty `iterations/` and `deltas/` directories.
2. Read every surface that participates in the placement decision: the AGENTS.md Gate 3 block, the Pi `spec-gate-classify` / `spec-gate-enforce` extensions, the runtime-neutral `spec-gate-core.mjs` policy (question, mutation notice, deferral, deny detail), and the shared `gate-3-classifier.ts` (classification result shape, binding validation).
3. Read the scaffolding-time surface `create.sh` `list_recent_track_packets` plus its call sites, and the `/speckit:plan` and `/speckit:complete` command routers, YAML workflow assets, and presentation contracts.
4. Inspected each candidate relatedness mechanism: folder-routing alignment scoring, the trigger index + `lookup-trigger-index.mjs`, `phrase-judge.mjs`, `recommend-level.sh` (negative result), track `graph-metadata.json`, and the skill-advisor identity docs.
5. Verified the byte-pinning of the Gate 3 question text through the spec-gate delivery tests.

## Findings

### Q1 — What the placement-decision moment actually surfaces

**f-iter001-001 — The runtime Gate 3 menu the operator answers never names the series parent and lists no siblings.** The canonical menu text `GATE_3_QUESTION` offers "C) Use a related spec folder, including a phase child" with no series-parent clause [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs:153]; the model-facing mutation notice repeats the same gap [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs:167]; the Pi dialog label is only "Use a related folder or phase child" [SOURCE: .pi/extensions/spec-gate-enforce.ts:13]. Only the AGENTS.md prose carries the full rule ("or a series parent when the work is a different change to the same artifact as an existing packet in the same track") [SOURCE: AGENTS.md:81]. So the rule reaches the model as background instruction but never reaches the decision dialog, and no surface ever lists the sibling candidates the rule is about.

**f-iter001-002 — The classifier and binding validation are structural, never relational.** `ClassificationResult` carries only trigger/satisfaction/write-boundary fields [SOURCE: .skilled/skills/system-spec-kit/shared/gate-3-classifier.ts:107]; `GATE_3_VOCABULARY` has four trigger categories and no placement vocabulary [SOURCE: .skilled/skills/system-spec-kit/shared/gate-3-classifier.ts:250]; `validateSpecFolderBinding` checks path resolution, mandatory metadata files, and the `NNN-name` shape [SOURCE: .skilled/skills/system-spec-kit/shared/gate-3-classifier.ts:138] [SOURCE: .skilled/skills/system-spec-kit/shared/gate-3-classifier.ts:619]. An answer that opens a related singleton when a same-artifact sibling exists binds cleanly: no warning, no advisory, no second look.

**f-iter001-003 — The `/speckit:plan` and `/speckit:complete` command surfaces carry no series-parent wording at all.** A case-insensitive search for "series" across `.skilled/commands` returns zero hits. The command's own Gate 3 confirmation is a bare four-option line, "Q1. Spec Folder: A) Use existing B) Create new C) Related D) Skip documentation" [SOURCE: .skilled/commands/speckit/assets/speckit-plan-presentation.txt:73] [SOURCE: .skilled/commands/speckit/assets/speckit-complete-presentation.txt:71]. Option C appears in the YAML only for phase-child `spec_id` derivation [SOURCE: .skilled/commands/speckit/assets/speckit-plan.yaml:129], and `related_to` is initialized empty and recorded only behind `--record-relationships=yes` [SOURCE: .skilled/commands/speckit/assets/speckit-plan.yaml:218] [SOURCE: .skilled/commands/speckit/plan.md:56]. This contradicts the strategy's §12 known-context claim that the plan/complete YAML shipped the updated option-C wording: the wording is present in AGENTS.md and the reference docs, not in the command assets.

**f-iter001-004 — The only mechanism that ever surfaces sibling packets runs after the decision, through narrow filters.** `list_recent_track_packets` [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1081] is called only from `resolve_branch_name` during scaffolding [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1124] — i.e., after Gate 3 has been answered and the folder chosen. It lists only top-level `NNN-` folders in one specs root [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1094], requires `graph-metadata.json > derived.created_at` and silently skips folders without it [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1099], applies a 14-day cutoff [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1091], caps output at 10 rows [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1114], prints name + date + 100-character description only [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1109], and writes everything to stderr [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1116]. Its closing nudge does cite the series-parent rule [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1115], but nothing compares the new work against the listed rows — matching is left entirely to the reader.

### Q2 — What already computes relatedness

**f-iter001-005 — Five distinct mechanisms exist, but none carries an artifact key.** (a) Folder-routing computes a 0–100 alignment score from conversation keywords against spec-folder name words, save-time only, and already knows how to print "better matching alternatives" [SOURCE: .skilled/skills/system-spec-kit/references/structure/folder-routing.md:119] [SOURCE: .skilled/skills/system-spec-kit/references/structure/folder-routing.md:444]. (b) The trigger index plus `lookup-trigger-index.mjs` scores prompt tokens against per-document trigger-phrase postings, with match classes and a `--spec-folder` scope filter, returning the document paths [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs:100] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs:173]; with `--scoring-only` a no-score prompt exits 1 cleanly [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs:22]. (c) Track `graph-metadata.json` mechanically enumerates same-track siblings through `children_ids` and `parent_id` [SOURCE: specs/system-speckit/034-spec-folder-tooling/graph-metadata.json:6], while `depends_on` / `related_to` / `supersedes` are manual and opt-in [SOURCE: .skilled/commands/speckit/plan.md:56]. (d) `phrase-judge.mjs` only gates phrase quality (template-default, editor-fallback, single-token classes) [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/phrase-judge.mjs:25]. (e) `recommend-level.sh` contains no relatedness vocabulary (pure level scoring) and skill-advisor routes prompts to skills, not packets — its "Related skills" section is resource links [SOURCE: .skilled/skills/system-skill-advisor/SKILL.md:437]. None stores "the artifact this packet changes", so mechanical same-artifact detection needs either a new signal or a combination of the trigger-index scoring (resemblance) with artifact extraction from titles/descriptions.

**f-iter001-006 — The Gate 3 question text is byte-pinned, constraining every menu-wording fix.** Delivery receipts assert `byteCount === Buffer.byteLength(core.GATE_3_QUESTION)` [SOURCE: .skilled/skills/system-spec-kit/runtime/tests/hooks/spec-gate-core.test.mjs:336], one test freezes byte-identical baseline output for the delivery flag [SOURCE: .skilled/skills/system-spec-kit/runtime/tests/hooks/spec-gate-core.test.mjs:300], and the question hash is computed through the canonical policy block with `GATE_SPEC_FOLDER_QUESTION_ID` [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs:226]. Any Q7 wording change must move both the runtime copies (AGENTS.md text and `GATE_3_QUESTION`) and these hashes/tests together.

**f-iter001-007 — Two canon copies of the option menu already drift.** AGENTS.md option C and the runtime `GATE_3_QUESTION` / dialog labels are different strings maintained in different trees; phase 006 updated the former [SOURCE: AGENTS.md:81] and left the latter without the series-parent clause [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs:153]. This is the mechanical shape of the drift that produced the singleton clusters: the strong rule lives in prompt prose, the weak menu is what gets answered.

### Placement gaps that still let a related singleton be created

1. The dialog/menu at the first write (the highest-attention human-in-the-loop moment) omits the series-parent rule and sibling data (f-001).
2. The classifier cannot object: it validates the chosen answer structurally (f-002).
3. `/speckit:plan`/`complete` confirmations inherit the bare "C) Related" and their YAMLs never carry the rule (f-003).
4. The sibling listing arrives at scaffold time, after the choice, filtered to 14 days, top-level folders, and `derived.created_at`-bearing packets (f-004).
5. Nothing computes same-artifact sameness; the closest primitives are phrase resemblance, track membership, and folder-name alignment (f-005).
6. AGENTS.md Option B is gated on "unrelated to suitable existing packets" [SOURCE: AGENTS.md:80], but no surface tells the agent what "suitable existing packets" exist.

## Contradictions / Logic-Sync Notes

- **f-iter001-003 vs. strategy §12.** The strategy's known context states the speckit plan/complete YAML shipped the Option C series-parent wording; the command tree contains no "series" string at all. Per iteration rules this is recorded, not halted on: treat the command assets as the un-updated surface, and re-check the phase-006 record (`implementation-summary.md`) in a later iteration before treating either side as final.
- No scope violations occurred; all researched files were read-only.

## Questions Answered

- **Q1:** At the moment an agent decides where new work goes (Gate 3 prompt text, gate-3-classifier.ts, the Gate 3 runtime hook, /speckit:plan setup), does anything surface the series parent rule or the sibling packets, and where are the gaps that still let a related singleton be created? — Answered at mapping depth: the rule surfaces only in AGENTS.md/reference prose; the runtime menu, the classifier and the command assets do not surface it; sibling packets surface only post-decision via `create.sh` stderr under narrow filters.
- **Q2:** Which existing mechanisms already compute relatedness (gate-3-classifier, folder-routing, the trigger index and lookup, the skill advisor, recommend-level.sh, graph-metadata) and which could detect a same-artifact sibling mechanically instead of relying on the agent to read stderr? — Answered at inventory depth: folder-routing alignment scoring, trigger-index phrase scoring, and graph-metadata sibling enumeration are the live signals; classifier, level scorer, and advisor compute none; no mechanism carries an artifact key.

## Questions Remaining

- **Q3:** create.sh recent-packets reliability and hardening (14-day window, `created_at` source, stderr in non-interactive runs, noise, no same-artifact matching) — this iteration adds concrete defect candidates: invisible packets without `derived.created_at`, top-level-only scan, 10-row recency cap, and no matching step.
- **Q4:** Guardrails against gaming/misapplying the series parent rule (catch-all bucket, correction-vs-new-change, cross-track grouping, artifact drift).
- **Q5:** Detecting and proposing retroactive grouping of existing singleton clusters without false positives or unsafe renumbering.
- **Q6:** Robustness of seeded trigger phrases / template-default judge class and safe backfill for older specs.
- **Q7:** UX changes across Gate 3 wording, speckit commands and create.sh output — now with the byte-pinning constraint (f-iter001-006) and the two-canon drift (f-iter001-007) as hard pre-conditions.

## Next Focus

Iteration 2: Q3 — trace the `created_at` producer (`derived.created_at` in graph-metadata generation), simulate/patch-read the listing's failure modes (missing metadata, non-interactive stderr capture, >10 candidates, 14-day edge, same-artifact absence), and shortlist hardening changes. Begin Q4 evidence gathering in the same pass: find validator rules and metadata fields that could carry guardrails.

## SCOPE VIOLATIONS

None. The only writes were this narrative, the iteration delta file, a temporary single-record JSON file under `/tmp` for the gateway call, and the gateway's own writes into the run directory. No researched file was modified.

## Sources (key)

- `.skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs`
- `.skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/README.md`
- `.pi/extensions/spec-gate-classify.ts`, `.pi/extensions/spec-gate-enforce.ts`
- `.skilled/skills/system-spec-kit/shared/gate-3-classifier.ts`
- `AGENTS.md`
- `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh`
- `.skilled/commands/speckit/plan.md`, `complete.md`, `assets/speckit-plan.yaml`, `assets/speckit-plan-presentation.txt`, `assets/speckit-complete-presentation.txt`
- `.skilled/skills/system-spec-kit/references/structure/phase-definitions.md`, `sub-folder-versioning.md`, `folder-routing.md`
- `.skilled/skills/system-spec-kit/references/workflows/quick-reference.md`
- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs`, `lib/phrase-judge.mjs`
- `.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`
- `.skilled/skills/system-spec-kit/runtime/tests/hooks/spec-gate-core.test.mjs`, `.skilled/skills/system-spec-kit/runtime/tests/spec-gate-pi-extension.vitest.ts`
- `specs/system-speckit/034-spec-folder-tooling/graph-metadata.json`
- `.skilled/skills/system-skill-advisor/SKILL.md`
