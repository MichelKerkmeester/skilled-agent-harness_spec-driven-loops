# Iteration 5: Closure-gate cross-check of the 29-candidate map, and the two deferred single-file verifications

## Focus

Test the iteration-4 synthesis against the gate that consumes it. Phase 002 closes on its own
acceptance criteria, so this iteration:

1. read phase 002's acceptance criteria and the parent handoff criteria for the first time and
   check the merged map against each verbatim;
2. audit the map's two arithmetic lines (decision-row count, owning-surface totals) against the
   gate's own count formula;
3. close the two deferred single-file verifications — the `sk-code-quality` comment checklist
   (candidate 25) and `doctor-runtime-mirrors.yaml` (candidate 24).

No ambiguity in the dispatch focus; strategy §11's next focus matches it. Short forms: `AC-NNN`,
`REQ-NNN`, `SC-NNN` are the identifiers in `002-synthesis-and-decisions/spec.md` and its
`acceptance-criteria.md`; `cN` is candidate N of iteration 4's merged map; `S:N` / `A:N` / `HVR`
keep iteration 4's meaning.

## Actions Taken

1. Read runtime state — `deep-research-config.json`, `deep-research-state.jsonl` (4 iteration
   records, so this is iteration 5; the log's last line is a `containment_violation` event for
   iteration 4 listing out-of-scope dirty files, all preserved), `deep-research-strategy.md`
   §3/§9/§11/§13. Hard-block invariants confirmed: `convergenceMode: "off"`,
   `progressiveSynthesis: true`, `lineageMode: "new"`.
2. Verified the packet write boundary: packet root is
   `.../001-research-communication-context/research/`; `iterations/iteration-005.md` and
   `deltas/iter-005.jsonl` do not exist; no reducer-owned file scheduled for a write.
3. Read `002-synthesis-and-decisions/spec.md` (handoff metadata, REQ-001..007, SC-001..003, risk
   table) and `acceptance-criteria.md` (AC-001..AC-007, status vocabulary, waiver rule) — the
   consuming gate's first read in this run.
4. Read the parent `spec.md`'s Phase Documentation Map and Phase Handoff Criteria verbatim — the
   first read of the 001→002 handoff criterion.
5. Cross-checked iteration 4's F1/F5 arithmetic against the gate's count formula and audited the
   owning-surface totals line.
6. Verified candidate 25 by reading
   `.opencode/skills/sk-code/sk-code-quality/assets/code-quality-checklist/overview-header-and-comments.md`
   in full (213 lines) and grepping the adjacent comment surfaces.
7. Verified candidate 24 by reading `.opencode/commands/doctor/assets/doctor-runtime-mirrors.yaml`
   in full (160 lines) and grepping the CI workflow and doctor route surfaces for the checker
   commands.
8. Re-read the last accepted gateway record (`deltas/iter-004.jsonl` line 1) to mirror its
   accepted schema, including the `runId`/`lineageId` identity pair.

## Findings

### F1 — The gate-facing row count is 32, not 33

The gate's exact wording, read this iteration:

- Handoff criterion: "Every recommendation carries an adopt or reject verdict and, if adopted,
  exactly one owning document", verified as "`decision-record.md` row count equals the
  recommendation count" (parent `spec.md`, Phase Handoff Criteria).
- AC-001: "Given the **merged** recommendation list, When the phase closes, Then every row
  carries adopt, reject or already-covered", verified by "Count rows against the union of lineage
  recommendations, and scan for blanks" (`acceptance-criteria.md`, AC-001).
- SC-001: "The allocation table's row count equals the union of the lineages' recommendation
  counts" (`002-synthesis-and-decisions/spec.md` SC-001).

Counting against that formula from iteration 4's own decomposition: 81 classified rows = 34
covered + 47 candidate-or-decision rows; 47 = 44 candidate rows + 3 pure decision rows (colon
`S:25-29`, not-X-but-Y `S:39`, "load-bearing" ban `S:69`); 44 → 29 merged candidates. The
**gate-facing count is 29 + 3 = 32 recommendation rows**.

Iteration 4's F5 published "29 + 3 + 1 closed conflict (C-3) = **33**" — that line re-adds the
closed not-X-but-Y conflict even though C-3 **is** one of the three pure decisions (`S:39`), so it
double-counts one row. The four conflict ADRs add no rows either: C-1 is candidate 19 inside the
29, and C-2/C-3/C-4 are the three pure-decision rows. Clean statement for phase 002: **32
allocation rows; 4 contradiction ADRs whose subjects are a subset of the 32**. If phase 002 seeds
its table from "33", AC-001's row-count verification fails by one row or the table carries a
phantom row.

One open count sub-question the gate will also ask: whether the 34 covered rows are table rows at
all. AC-001's verdict vocabulary includes `already-covered`, which suggests they might be; SC-001's
"union of the lineages' recommendation counts" read literally counts every recommendation, covered
ones included — a number this run never published (cross-source duplicates among the covered rows
were never tallied). The published decomposition pins the 32 decision-eligible rows only.
Recommendation: phase 002 declares the table's unit in the record's opening line. The parent
handoff's two-verdict vocabulary ("adopt or reject") against REQ-001's three is the same question
in miniature.

`[SOURCE: specs/sk-communication/006-sk-communication-clarity/002-synthesis-and-decisions/acceptance-criteria.md AC-001]`
`[SOURCE: specs/sk-communication/006-sk-communication-clarity/002-synthesis-and-decisions/spec.md:136 (SC-001), :32 (handoff metadata)]`
`[SOURCE: specs/sk-communication/006-sk-communication-clarity/spec.md, Phase Handoff Criteria (002→003 row)]`
`[SOURCE: research/iterations/iteration-004.md F1, F2, F5]`

### F2 — Verdict and vacancy gaps against the gate

- **"Defer" is not a closure-legal verdict.** AC-001's vocabulary is exactly adopt / reject /
  already-covered, and its verification scans for blanks. The map uses "defer" for c28 ("lowest
  value; defer"), "currently unverified, deferred" for c24, "gap statement only" for c21 and
  "none today" for c11 — none of these is a legal verdict as written. Converting each is a
  decision, not formatting.
- **Some owning surfaces are not documents.** "Doctor surface + CI" (c24), "gap statement only"
  (c21) and "repo-rule template contract" (c29) are surface *descriptions*, not documents. The
  handoff and AC-002 require exactly one owning document per adopted row, and a duplicate scan
  over that column. An adopted row must therefore name a document path, and if that document is a
  new rule file, AC-006 additionally requires the row to name why no existing document can carry
  it.
- **AC-005 cannot be met by this run's shape.** AC-005 reads "Given **two lineages** that
  disagree, … Then it is diagnosed as underspecified or thin-evidence"; the parent maps phase 1
  as "Independent research lineages over the three context sources". This run is one lineage (one
  packet, one researcher) covering all three sources, so there is no second lineage whose
  disagreement could be diagnosed. An unmeetable criterion is not `Met`; the acceptance criteria's
  own status table makes `Waived` require an ADR in `decision-record.md`. Phase 002 needs either
  that waiver ADR (recording the single-lineage reality) or a parent phase-map amendment. No prior
  iteration recorded this.
- **REQ-007/AC-007 is pre-committed by the map.** AC-007 requires the reader-profile question to
  be decided as an always-binding rule or an operator-selected mode. The map assigns c1 (reader
  triage) to `presenting-decisions.md` §1/§3 — silently answering "always-binding". Phase 002
  should record that as the REQ-007 answer explicitly, and note the consequence: choosing
  operator-selected mode instead moves c1's owning surface.

**The 001→002 handoff is objectively unmet today.** Its criterion is "Every lineage wrote a
non-empty `research.md` and its iteration count matches the requested depth"; `research/research.md`
does not exist in the packet (verified by listing this iteration). The config-vs-strategy
discrepancy has been carried since iteration 3 — `progressiveSynthesis: true` in the config while
strategy §13 calls the file workflow-owned and this agent's allowed-write list excludes it. The
handoff's verification method is "Read the state log, not the run's own summary", and the log shows
four complete, high-ratio iterations (spirit satisfied; letter not). This is now a named consumer
consequence rather than a bookkeeping note: either the workflow produces `research.md` before phase
002 opens, or the criterion is amended. The depth half of the criterion is on track at iteration 5
of 10.

`[SOURCE: specs/sk-communication/006-sk-communication-clarity/002-synthesis-and-decisions/acceptance-criteria.md AC-001, AC-002, AC-005, AC-006, AC-007]`
`[SOURCE: specs/sk-communication/006-sk-communication-clarity/002-synthesis-and-decisions/spec.md:114-118 (REQ-001..005), :124-126 (REQ-006/007), :150 (duplicate-assignment risk)]`
`[SOURCE: specs/sk-communication/006-sk-communication-clarity/spec.md, Phase Documentation Map and Phase Handoff Criteria (001→002 row)]`
`[SOURCE: research/ (packet listing: no research.md); research/deep-research-strategy.md §13]`

### F3 — Iteration 4's surface totals do not reconcile

F1's totals line reads: "`communication.md` split bundle 10 assignments; HVR 6;
`presenting-decisions.md` 2; `handoff-and-questions.md` 2; `benchmark/` 2; `evidence-and-proof.md`
1; `sk-code-quality` 1; no surface today 5 (candidates 11, 21, 24, 28 — plus 24's doctor/CI is the
unverified one)". The named buckets sum to 24, and the parenthetical names four candidates, not
five; 24 + 4 = 28, not 29. The uncounted row is c29, whose home ("repo-rule template contract, not
a communication rule") is neither a communication surface nor "no surface today". Corrected
totals: 24 assigned + 4 no-surface + 1 non-communication home = 29. Both arithmetic corrections
(F1 here and this one) feed the same consumer, so the map's counts should be republished together.

`[SOURCE: research/iterations/iteration-004.md F1, owning-surface totals line]`

### F4 — Candidate 25 is partially covered; the residual narrows to present-state narration

Read in full:
`.opencode/skills/sk-code/sk-code-quality/assets/code-quality-checklist/overview-header-and-comments.md`
(213 lines), plus a bounded grep over the adjacent comment surfaces. The asset is confirmed as the
owning surface, and it already bans the two strongest archaeology forms:

- §2 carries `[P1] CHK-CMT-01: No ephemeral artifact ids in any comment (ticket/ClickUp ids,
  spec/phase/packet numbers, ADR ids) — keep the WHY` — the repo's comment-hygiene rule already
  concretized as a checklist row.
- §4 carries `[P0] CHK-CMT-01: No commented-out code (delete unused code, git preserves history)`
  and `[P1] CHK-CMT-02: Comments explain WHY, not WHAT`.
- One layer out, `sk-code/shared/references/universal/code-quality-standards.md:77`: "No
  commented-out code — delete it; commented code rots and confuses readers." A comment-hygiene CI
  workflow exists (`.github/workflows/comment-hygiene.yml`), and the bounded grep over
  `check-comment-hygiene.sh`, `comment-hygiene-hook.md` and `quality-checklist.md` matched no
  present-state vocabulary at all.

What remains un-named is exactly the S:31 class: present-state/history narration ("changed X to
Y", "used to", "no longer") — a time-shifted comment that is neither commented-out code nor an
ephemeral id, and that WHY-not-WHAT does not catch (a history comment can explain a why while
still narrating a past state). The residual is a one-line extension of CHK-CMT-01/02, not a new
rule: the asset's own rationale ("git preserves history") is the rationale the present-state rule
rests on.

Two bounded residuals, recorded rather than assumed: (1) the checklist's §2 row points at
`references/universal/code-style-guide.md` §4 and §4's Comment Principles point at the Webflow
`style-guide/overview-naming-and-structure.md` §5 — neither was read, and either could carry more
comment-language rules; (2) the grep reached four comment surfaces only. Observation: the asset
has **two rows both labeled `CHK-CMT-01`** — the §2 ephemeral-id row (P1) and the §4
commented-out-code row (P0) — a duplicate stable id inside one checklist; low severity, and
ownership is `sk-code-quality`'s rather than this program's.

`[SOURCE: .opencode/skills/sk-code/sk-code-quality/assets/code-quality-checklist/overview-header-and-comments.md §2 CHK-CMT-01; §4 CHK-CMT-01, CHK-CMT-02]`
`[SOURCE: .opencode/skills/sk-code/shared/references/universal/code-quality-standards.md:77]`
`[SOURCE: .github/workflows/comment-hygiene.yml (listing); .opencode/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh (bounded grep)]`

### F5 — Candidate 24 recast: the mirror verification exists, and four of its checkers are CI-wired

Read in full: `.opencode/commands/doctor/assets/doctor-runtime-mirrors.yaml` (160 lines). The
carried-forward question is answered precisely: the check is **neither a byte-compare nor a load
smoke test** — it is structural sync checking plus path-existence reads, and it never executes the
artifacts it checks.

- Seven `--check` steps (yaml `execution.steps`): runtime mirrors (cursor/devin agent, command and
  skill **symlink trees** plus hook discovery mirrors), codex agents (`*.toml`), codex prompts
  (`*.md` stubs), agent roster ("rejects a real file where a symlink belongs"), codex hooks
  installer (`~/.codex/hooks.json` vs the repo's `.codex/hooks.json`, including orphaned adapter
  entries), pi agents, pi prompts; each exits 0 in sync / 1 on drift.
- Hook-adapter fallback health: every row is a `file_exists` read — "a plain path-existence read,
  no execution of the adapter or the shell command that wraps it" — and the asset explains a
  missing path is "exactly the state a synthetic adapter failure produces" (a live failure carries
  `"mkHookDrift": true` plus an `mk-hook-drift host=… event=… adapter=…` stderr line), so drift is
  surfaced without firing any hook.
- Invariant (`mutation_boundaries`): check-only; the route "MUST NOT run any generator in write
  mode, create or delete a symlink, or install a hook config".
- Deliberate blind spot (asset output block): hook **config structure** is out of scope for
  mirroring — the runtimes' event vocabularies are incompatible, so those files are hand-authored
  per runtime and "cannot be mirror-checked against each other".

CI: the checkers are not merely operator-invoked. `.github/workflows/spec-kit-check.yml:142-145`
runs four of them (`sync-runtime-mirrors.cjs --check`, `sync-agents.cjs --check`,
`sync-prompts.cjs --check`, `agent-roster-mirror-check.cjs`), the same four appear in the doctor
route manifest (`.opencode/commands/doctor/_routes.yaml:193-196`), and the asset is referenced from
`.opencode/commands/doctor/speckit.md:57`. Not evidenced by this pass: CI wiring for the pi
checkers, the codex-hooks-installer check and the fallback-health rows —
`.github/workflows/agent-mirror-sync.yml` exists and is the natural next read; recorded as a
residual, asserted neither way.

Consequence for the map: the ADHD source's runtime-mirror mechanism has a repo equivalent — a
named asset, a read-only doctor route and a CI job — so c24's "currently unverified" framing
overstates the absence. The residual is narrower and nameable: (a) CI coverage of the pi/hooks
checkers and the fallback-health rows, and (b) any structural check of hook config, which the
asset deliberately excludes.

`[SOURCE: .opencode/commands/doctor/assets/doctor-runtime-mirrors.yaml (mutation_boundaries, execution.steps, hook_adapter_fallback_health_checks, output)]`
`[SOURCE: .github/workflows/spec-kit-check.yml:142-145]`
`[SOURCE: .opencode/commands/doctor/_routes.yaml:193-196; .opencode/commands/doctor/speckit.md:57]`

## Ruled Out

- Counting the conflict ADRs as additional allocation rows on top of the 29 candidates: C-1 is
  candidate 19 inside the 29, and C-2/C-3/C-4 are the three pure-decision rows — the ADR carries
  the reasoning, the allocation table carries the row; adding both double-counts. [SOURCE: F1 above]
- Treating "defer" as a closure-legal verdict for c11/c21/c24/c28: AC-001's vocabulary is
  adopt/reject/already-covered and its verification scans for blanks. [SOURCE: F2 above]
- Expecting the mirror check to execute its targets as a load smoke test: the fallback rows are
  `file_exists` reads and the asset's invariant forbids execution. [SOURCE: F5 above]

## Dead Ends

- No new dead ends worth reducer promotion. The two standing exhausted items (`sk-communication`
  as a rule owner; single-surface undercount) were used as constraints again, not revisited.

## Edge Cases

- **Ambiguous input (resolved).** Strategy §11's "Next Focus" names the baseline-capture scheduling
  question, while the dispatch focus names the gate cross-check and the two verifications.
  Interpretation taken: dispatch wins (it also matches iteration 4's own Recommended Next Focus);
  the baseline-scheduling question stays with the reducer/operator. Deferred alternative recorded,
  not investigated.
- **Contradictory evidence (pre-existing, not this iteration's).** The state log's last line before
  this iteration is a `containment_violation` event for iteration 4 (label `research-i4-g1`)
  listing out-of-scope dirty files in `specs/hooks/022-smart-rule-injection/**` and a modified
  compiled contract file, all preserved with a patch under `containment-out-of-scope/`. A
  workspace condition, not a finding; this iteration wrote only to its two artifact paths and the
  gateway.
- **Missing dependencies.** None blocking. Residuals are bounded, not blocking: the two unread
  comment sections (F4), and CI wiring for the pi/hooks checker set (F5).
- **Partial success.** None for this iteration's own actions.

## SCOPE VIOLATIONS

None. Every write stayed inside the allowed list (`research/iterations/iteration-005.md`,
`research/deltas/iter-005.jsonl`, and the append gateway's own writes). `research/research.md` was
left untouched: `progressiveSynthesis` is `true`, but the prompt pack's allowed-write list excludes
it and strategy §13 declares it workflow-owned; F2 now records the consumer consequence of that gap.

## Sources Consulted

- `research/deep-research-config.json`, `research/deep-research-state.jsonl` (4 iteration records
  + 1 containment event), `research/deep-research-strategy.md` §3/§9/§11/§13
- `research/iterations/iteration-004.md` (F1, F2, F5, Recommended Next Focus; re-read for the
  merge arithmetic)
- `research/deltas/iter-004.jsonl` line 1 (accepted gateway record schema)
- `specs/sk-communication/006-sk-communication-clarity/002-synthesis-and-decisions/spec.md`
  (handoff metadata, REQ-001..007, SC-001..003, risk table) and `acceptance-criteria.md`
  (AC-001..AC-007, status vocabulary, waiver rule)
- `specs/sk-communication/006-sk-communication-clarity/spec.md` (Phase Documentation Map, Phase
  Handoff Criteria)
- `.opencode/skills/sk-code/sk-code-quality/assets/code-quality-checklist/overview-header-and-comments.md`
  (full, 213 lines)
- `.opencode/skills/sk-code/shared/references/universal/code-quality-standards.md:77` (bounded
  grep)
- `.opencode/commands/doctor/assets/doctor-runtime-mirrors.yaml` (full, 160 lines)
- `.github/workflows/spec-kit-check.yml:142-145`; `.opencode/commands/doctor/_routes.yaml:193-196`;
  `.opencode/commands/doctor/speckit.md:57`; `.opencode/commands/doctor/scripts/README.md:60`;
  `.github/workflows/` listing
- Bounded grep over `check-comment-hygiene.sh`, `comment-hygiene-hook.md`, `quality-checklist.md`,
  `code-quality-standards.md` (present-state terms; one hit at `code-quality-standards.md:77`)

## Assessment

- **New information ratio: 0.85.** Five findings: F1 (0.5 — re-derivation over known rows, but the
  corrected count is new), F2 (0.75 — the AC file and handoff criteria were read for the first
  time, though the `research.md` gap was known since iteration 3), F3 (1.0 — new count audit), F4
  (1.0 — first read of the checklist asset; closes a deferred verification), F5 (1.0 — first read
  of the mirror asset and its CI wiring). (1.0+1.0+1.0+0.75+0.5)/5 = 0.85. No simplicity bonus:
  this iteration corrects and narrows; it does not collapse the model further.
- **Questions addressed:** none of the five key questions; the gate cross-check hardens Q4's map
  and closes the mirror sub-item of Q5's mechanism half.
- **Questions answered:** the two deferred single-file verifications (candidates 25 and 24) — the
  carried-forward items from iterations 2-4. No key question changes answer state.

## Questions Answered

- The `sk-code-quality` comment-checklist verification (F8; candidate 25): answered — the asset
  already bans commented-out code and ephemeral ids; the residual is present-state narration only.
- The doctor runtime-mirror verification (candidate 24): answered — structural/path-existence
  checks with explicit no-execution; four checkers CI-wired (`spec-kit-check.yml:142-145`);
  hook-config structure deliberately out of scope.
- No key question (Q1-Q5) changes answer state this iteration; the changes are to their gate-facing
  counts (32, not 33) and to c24's framing.

## Questions Remaining

- Whether CI also runs the pi checkers, the codex-hooks-installer check and the fallback-health
  rows (`.github/workflows/agent-mirror-sync.yml` is the likely next read) — F5 residual.
- Whether the unread `code-style-guide.md` §4 / Webflow style-guide §5 comment sections carry
  present-state wording — F4 residual.
- The baseline-capture scheduling question from iteration 4's F4 — still with the reducer/operator.
- The 001→002 handoff's missing `research.md` — now a named gate blocker (F2); resolution belongs
  to the workflow/reducer, not this agent.
- Duplicate `CHK-CMT-01` id in the checklist asset — belongs to `sk-code-quality`'s owner.

## Next Focus

Anchor spot checks only, and hold budget. The map's claims about specific stack lines are what
phases 002-004 will edit, so iteration 6 should verify 3-5 high-traffic anchors cited repeatedly by
the map (`repo-rules/communication.md:49-51` ceiling; `HVR:114`; `AGENTS.md:144`;
`communication.md:116-126`) with narrow reads, not rereads. If those hold, iterations 7-10 have
negative marginal value and should hold budget per the dispatch's instruction.

## Recommended Next Focus

Iteration 6: spot-check the 3-5 anchors the map leans on hardest (file:line reads, one narrow grep
each, no source rereads), then hold budget; do not re-open the merge, the counts (now corrected),
or the two closed verifications.
