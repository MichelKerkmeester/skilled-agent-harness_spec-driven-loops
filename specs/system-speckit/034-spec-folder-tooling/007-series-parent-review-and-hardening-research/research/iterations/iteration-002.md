# Deep Research Iteration 002 — Q3: create.sh Recent-Packets Listing Reliability and Hardening

- **Run:** 007-series-parent-review-and-hardening-research (lineage session `2026-10-07T05:19:14.761Z`)
- **Iteration:** 2 of 10 | **Focus:** Q3 | **Status:** insight | **New info ratio:** 0.62
- **Reviewer note:** the phase-006 `review/` outputs remain absent; all evidence below is from source, tests and a read-only census.

## Focus

- **Q3:** How reliable and actionable is the create.sh recent-packets listing (14-day window, created_at source, stderr in non-interactive runs, noise, no same-artifact matching), and what concrete changes would harden it?

## Actions Taken

1. Read `list_recent_track_packets` end to end, including its embedded node script and its two call sites in `resolve_branch_name`. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1076] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1081] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1123]
2. Traced the producers of both files the listing reads: the scaffold's own `create_graph_metadata_file` stub (writes `derived.created_at`) and the optional `dist/spec-folder/generate-description.js` step plus the post-scaffold graph backfill. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:550] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:617] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1824] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1846]
3. Located every invocation path: `resolve_branch_name` is reached in normal mode and in new-phase-parent mode, and skipped for `--parent` appends and explicit `--path` targets. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1286] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1768]
4. Read the only test coverage and the one command consumer that runs create.sh directly. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/create-track-refresh.vitest.ts:152] [SOURCE: .skilled/commands/speckit/assets/speckit-plan.yaml:79]
5. Ran a read-only census over `specs/` with the listing's own filter semantics (a node walk): 4725 NNN-named dirs, 415 of them immediate children of a non-packet dir, 4310 nested under another packet; 4552 dirs carry `graph-metadata.json` with `derived.created_at`; 3 dirs carry `derived.created_at` but no `description.json` (all under `z_archive`).

## Findings

### The unknown-packet-visible gate

**f-iter002-001 — A packet with `derived.created_at` is still dropped when `description.json` is missing, and the scaffold itself can produce exactly that packet.** The graph metadata read, the `description.json` read, and the `description` assignment sit in one `try` block; any throw on the second read lands in the catch and executes `continue`, discarding the row even though `createdAt` was already captured. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1098] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1103] Normal-mode scaffolding tolerates a missing generator: it prints "description.json generation skipped" or the missing-file warning and continues, so a checkout without the built `dist/` produces packets that the listing will never show. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1834] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1837] Census finds 3 such dirs today (all archived), so the defect is structural, not currently noisy. A related gap: a packet entirely without `graph-metadata.json` (173 of 4725 census dirs) also falls into `continue`. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1099] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1106]

### Candidate-set shape

**f-iter002-002 — The scan only ever sees immediate children of one root.** `fs.readdirSync(specsDir)` plus the `/^[0-9]{3}-/` name test excludes every nested packet, and when `--track` is used the scan root narrows to that track. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1093] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1094] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:980] The census shows 4310 of 4725 packet dirs nested under another packet, e.g. the six children under `specs/agents/009-turn-closeout-next-steps/` — exactly the sibling set a series-parent decision is about.

**f-iter002-003 — Every filter is silent, so absent output is ambiguous.** Zero rows exits before printing anything (`process.exit(0)` at the top), which the test suite pins as "not.toContain('Recent packets')". [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1112] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/create-track-refresh.vitest.ts:180] The 14-day cutoff excludes an older-but-relevant sibling without a trace, and the 10-row cap truncates the newest rows with no "and N more" marker or route to the remainder. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1091] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1114] An agent cannot distinguish "no recent siblings" from "the lister never ran" — a missing dir or missing node is an unconditional silent return too. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1082] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1083]

**f-iter002-004 — There is no matching step, and the lister never receives the new work's topic.** The node invocation passes exactly the scan root and the label; the script reads only those two argv slots, so `FEATURE_DESCRIPTION` and `SHORT_NAME` never reach it and no row can be ranked, flagged or compared. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1117] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1089] Rows carry name, a 10-character date and a 100-character description; the closing nudge asks the reader to perform the same-artifact judgment unaided. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1109] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1115]

**f-iter002-007 — `created_at` measures scaffold/derive time, never work recency.** The stub writes `created_at` and `last_save_at` as the same scaffold timestamp, and the filter consults `created_at` alone. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:617] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1108] A packet created 30 days ago but saved yesterday is excluded; `last_save_at` sits unused in the same metadata block.

### Delivery channel and noise

**f-iter002-005 — Stderr-only delivery is invisible to structured consumers.** The stream split is deliberate to keep the `--json` stdout payload parseable, and a test asserts `JSON.parse(result.stdout)` succeeds. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1076] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1116] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/create-track-refresh.vitest.ts:157] The consequence for non-interactive runs: there is no `recent_packets` field to consume, a caller that merges `2>&1` breaks JSON parsing, and a caller that drops stderr loses the nudge entirely. The one command asset that invokes create.sh runs it exactly in that mode. [SOURCE: .skilled/commands/speckit/assets/speckit-plan.yaml:79]

**f-iter002-006 — Three scenarios are pinned; every hardening path is uncovered.** The suite covers the happy path (header, row format, JSON stdout), phase-parent-append silence, and 30-day exclusion. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/create-track-refresh.vitest.ts:152] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/create-track-refresh.vitest.ts:160] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/create-track-refresh.vitest.ts:173] Missing: missing/blank `description.json`, missing `derived` block, the 10-row cap and omission marker, nested-child scanning, cross-track scanning, and the zero-row output contract.

### When the listing runs (context, not a defect)

`resolve_branch_name` calls the lister in normal mode and in new-phase-parent mode, before the folder exists. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1286] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1768] `--parent` appends and explicit `--path` targets skip it — defensible, since those are already destinations. The timing (pre-creation) is the one strong property of the current mechanism and hardening should not move it.

### Hardening shortlist (candidates for Q7)

1. Make the two file reads independent: capture `derived.created_at` first, treat a missing `description.json` as an empty description instead of a skip, and fall back to filesystem mtime when metadata is absent or invalid.
2. Use `max(created_at, last_save_at)` for the window, and print the signal used.
3. Widen the candidate set: include direct children of top-level siblings (phase children), and when no `--track` is set do not silently ignore other tracks.
4. Pass the new work's description/short-name into the lister and rank rows by token overlap (the trigger-index phrase scorer already exists per f-iter001-005); mark the best matches and print an explicit "no close matches" line where today there is silence.
5. Preserve the cap but report it: "+N more in <root>" plus the count of folders checked and the count excluded by the window.
6. Add a `recent_packets` array to the `--json` payload and a `--no-recent` opt-out, keeping stderr for humans; never merge the listing into stdout for non-JSON mode changes.
7. Extend `create-track-refresh.vitest.ts` with fixtures for items 1, 3, 4, 5 and the zero-row contract.
8. Preserve the advisory-only invariant (see inv-iter002-001): the lister must keep returning 0 on every failure and must never fail a scaffold.

## Contradictions / Logic-Sync Notes

- None new. The f-iter001-003 vs. strategy §12 drift remains recorded, not halted on; the phase-006 `implementation-summary.md` re-check stays queued for a later iteration.
- No scope violations occurred; every researched file was read-only.

## Questions Answered

- **Q3:** How reliable and actionable is the create.sh recent-packets listing (14-day window, created_at source, stderr in non-interactive runs, noise, no same-artifact matching), and what concrete changes would harden it? — Answered at mechanism depth, extending f-iter001-004 into seven concrete defects plus a hardening shortlist. Verdict: the lister runs at the right moment on the two common creation paths and is correctly advisory-only, but its candidate set is narrow by construction (top-level only; 91% of packet dirs are nested), its data-loss paths are silent (missing `description.json` drops a packet; missing metadata drops a packet; zero rows prints nothing; the cap truncates without notice), it never sees the new work's topic so no matching can happen, and its stderr-only channel makes it invisible to the structured consumers that actually invoke create.sh.

## Questions Remaining

- **Q4:** Can the series parent rule be gamed into a catch-all bucket or misapplied (a correction treated as a new change, cross-track grouping, artifact drift), and what guardrails in validators or metadata would prevent that?
- **Q5:** How should existing singleton clusters be detected and proposed for retroactive grouping (census tooling, a validator advisory, a proposal step in a speckit command) without noisy false positives or unsafe renumbering?
- **Q6:** Are the seeded trigger phrases and the template-default judge class robust (phase-child scaffolds, punctuation, non-English text, very short descriptions), and what backfill path for the older specs is safe?
- **Q7:** Which UX changes across Gate 3 wording, the speckit commands and create.sh output would make grouping the default choice while keeping the operator in control? — carry the byte-pinning constraint (f-iter001-006), the two-canon drift (f-iter001-007), and this iteration's hardening shortlist as pre-conditions.

## Next Focus

Iteration 3: Q4 — guardrails against gaming/misapplying the series parent rule. Evidence targets: the validator rule set and `graph-metadata.json` fields (`parent_id`, `children_ids`, `manual.*`) as the mechanical places a catch-all or cross-track grouping could be detected; the phase-definitions §2 thresholds as the qualifying rule; and how a "correction vs new change" distinction could be validated. Secondary, if budget allows: Q5 census-tooling feasibility using this iteration's walk script as a prototype.

## SCOPE VIOLATIONS

None. Writes were this narrative, the iteration delta file, a temporary single-record JSON file under `/tmp` for the gateway call, and the gateway's own writes into the run directory. No researched file was modified.

## Sources (key)

- `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh` (lister 1076-1117, call sites 1286/1768, stub 550-624, description step 1824-1838, backfill 1840-1860, root resolution 980-982)
- `.skilled/skills/system-spec-kit/runtime/cli/tests/create-track-refresh.vitest.ts` (152-182)
- `.skilled/commands/speckit/assets/speckit-plan.yaml` (79)
