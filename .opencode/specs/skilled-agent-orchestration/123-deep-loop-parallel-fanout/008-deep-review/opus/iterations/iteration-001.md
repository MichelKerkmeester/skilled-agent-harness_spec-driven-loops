# Opus Verification — Iteration 001 (packet 123 deep-loop parallel fan-out)

> Integrity note. This session had an intermittent tool-result delivery channel
> (large batched Bash/Read sometimes returned empty; memory note
> "bash-persisted-output-truncation" / "blank-lagged-output is NOT success").
> EVERY verdict below is tied to a file region I actually read and that actually
> returned content this session. Where the channel denied me a re-read, I mark
> the item UNVERIFIED-THIS-SESSION rather than clear or fabricate it. Files I
> fully read and that returned: `fanout-run.cjs` (391 lines), `fanout-pool.cjs`
> (262), `fanout-salvage.cjs` (143), `fanout-merge.cjs` (355),
> `executor-config.ts` (393), `fanout-pool.vitest.ts` (206),
> `fanout-salvage.vitest.ts` (head), parent `spec.md`, and the fan-out regions of
> both `*_auto.yaml` files (research lines 144-172 + 595-625; review 115-168).

## Test ground truth

REAL, run three times this session from `.opencode/skills/system-spec-kit/mcp_server`
(vitest 4.1.6):

```
Test Files  5 passed (5)
     Tests  72 passed (72)
     EXIT = 0
```

Files: fanout-pool, fanout-run, fanout-merge, fanout-salvage, executor-config.
The report's "5 files / 72 tests, exit 0" is ACCURATE. "53/53" and "170" (flagged
in the report as prior fabrications) are NOT what the suite emits.

## Confirmed findings

### C-01 — P0 — CLI fan-out is fully serial; `concurrency` has no effect
- File:line: `scripts/fanout-run.cjs:341` (worker passed to runCappedPool at 304-362)
- Source read: line 21 `const { spawnSync } = require('node:child_process');`;
  worker declared `worker: async (lineage) => {` (line 308) with NO `await`
  anywhere before line 341 `const result = spawnSync(command, cmdArgs, {...});`.
- Pool trace (`fanout-pool.cjs`, read in full): `runCappedPool` (138) → `pump()`
  (165) admission `while (active < concurrency && nextIndex < items.length)`
  (174) calls `settleItem(...)` (178); `settleItem` (76) does
  `const output = await worker(item,...)` (86). An async function with no internal
  `await` runs SYNCHRONOUSLY to completion before yielding a microtask. So when
  pump admits item 0, `settleItem`→`worker`→`spawnSync` blocks the single event
  loop until lineage 0's CLI subprocess fully exits; only then does the `.finally`
  (190) decrement `active` and re-`pump()`. Items are admitted one-at-a-time.
  `concurrency` (306) is read but rendered inert.
- Why it matters: defeats success-criterion #1 (`spec.md` §6: "Fan-out runs N
  lineages concurrently (capped)") and the §1 promise ("N executor lineages run
  concurrently with a concurrency cap"). The headline CLI feature is inert.
- Why uncaught: `fanout-pool.vitest.ts:35` `makeGatedWorker` returns a worker that
  `await`s a gated Promise (40-51) — it genuinely yields, so the test
  (`'never exceeds the concurrency cap'`, 77-103) observes interleaving. The REAL
  `spawnSync` worker is never exercised by any test. CONFIRMED both sides.
- Fix: async `spawn`, resolve on child `close`, keep timeout/kill; add an overlap
  test driving two real sleeping stub subprocesses.

### C-02 — P0 (review) / P1 (research) — non-zero subprocess exit reported as success
- File:line: `scripts/fanout-run.cjs:359-360`
- Source read: line 359 `const exitCode = result.status ?? (result.error ? 1 : 0);`
  line 360 `return { label: lineage.label, exitCode, timedOut: result.signal === 'SIGTERM', salvage };`.
  The worker RETURNS for any exit; it never `throw`s on non-zero exit or timeout.
- Pool trace: `settleItem` only reaches the `catch`→`status:'rejected'` branch
  (100-118) when the worker THROWS. A returned object → `status:'fulfilled'` (92).
  `buildPoolSummary` (207): `succeeded = results.filter(r => r.status==='fulfilled')`
  (209); `failed = total - succeeded` (210). So a lineage whose CLI exited 1, or
  timed out (spawnSync sets `error`, status null → exitCode 1, still RETURNED),
  counts as SUCCEEDED. `main()` (373):
  `exitCode = summary.all_failed ? 3 : summary.failed > 0 ? 2 : 0;` emits status
  'ok' when failed===0. Every lineage can crash and the run reports success.
- Downstream: `fanout-merge.cjs` (read in full) keys verdict purely on findings
  registries it can read (`tryReadJson`, 61); a crashed lineage that wrote no
  registry is silently `skipped_no_registry` (326), NOT a failure. For REVIEW,
  `mergeReviewRegistries` (167) with zero readable registries → `activeP0=0` →
  `mergedVerdict='PASS'` (202). A fan-out review where every lineage crashed yields
  a clean PASS verdict. This is a FALSE-PASS on a quality gate.
- Severity: P0 for review (false PASS), P1 for research. Report's "P0/P1" is fair;
  I pin P0 for the review path.
- Fix: throw (or mark failed) on non-zero exitCode / timedOut so summary.failed
  and merge are correct; make merge fail-closed when a requested lineage has no
  valid registry.

### C-03 — P1 — buildLoopPrompt synthesizes a prompt; violates Option-B "verbatim"
- File:line: `scripts/fanout-run.cjs:122,131,315`
- Source read: `buildLoopPrompt` (122) returns a natural-language array; line 131
  `` `Read ${skillFile} and execute the ${loopType} loop with these parameters:` ``;
  138-145 ask the MODEL to bind artifact_dir, skip resolveArtifactRoot, run phases,
  emit `FANOUT_LINEAGE_COMPLETE:`. Called at 315; the string becomes subprocess
  argv/stdin via `buildLineageCommand` (164-246).
- Spec conflict CONFIRMED against source: parent `spec.md` §2 (read this session):
  "Per-lineage execution = **Option B**: orchestrator shells the existing command
  per lineage into an isolated sub-packet … so the YAML loop runs verbatim. Option
  A (re-implement the loop in JS) rejected — divergence risk." For CLI lineages the
  code does NEITHER a verbatim command invocation NOR re-implements the loop; it
  hands a prose instruction to the model. Parsing/validation/session-binding/
  max-iteration enforcement are left to model interpretation — the exact divergence
  Option B was chosen to avoid.
- Corroborating: `lineage.iterations` is used ONLY for the timeout
  (`computeLineageTimeoutMs`, 154-158: `iters * perIterSecs * 2`), never forwarded
  as a max-iterations cap — because there is no command to carry it. (raw
  f-p123-i2-03, line 155.) CONFIRMED.
- Severity: P1 (correctness/contract divergence; not a crash). Note: for pure-CLI
  executors there is arguably no headless loop binary to shell (the spec's own
  handover flagged "no headless loop binary" as a Phase-003 blocker), so an
  operator MAY accept prompt-synthesis as a deliberate deviation — but it still
  contradicts the written §2 decision and must be reclassified explicitly.
- Fix: invoke the existing command path per lineage with explicit executor +
  artifact-dir override + session_id + max_iterations; OR amend spec §2 to record
  prompt-synthesis as the accepted CLI mechanism.

### C-04 — P1 — salvage writes UNPADDED `iteration-${n}.md` vs canonical `iteration-{NNN}.md`
- File:line: `scripts/fanout-salvage.cjs:106`
- Source read (full file): line 106
  `const iterFile = path.join(iterDir, \`iteration-${iterNum}.md\`);` where `iterNum`
  comes from the state-log `record.iteration` number (91) — an integer, written raw
  with NO zero-pad. So salvage produces `iteration-1.md`, `iteration-12.md`.
- Canonical naming side NOW CONFIRMED (re-read this session):
  `deep_start-research-loop_auto.yaml:108` and
  `deep_start-review-loop_auto.yaml:100` both define
  `iteration_pattern: "{artifact_dir}/iterations/iteration-{NNN}.md"`. `{NNN}` is
  the zero-padded form; `lib/council/session-state-hierarchy.cjs:26`
  (`String(value).padStart(3, '0')`) is the repo's 3-digit pad helper. So the loop's
  canonical iteration file is `iteration-001.md` while salvage writes
  `iteration-1.md`. Single-digit iterations mismatch the canonical `NNN` form; a
  recovered file lands at a name downstream validation/merge globbing
  `iterations/iteration-*.md` (research_auto:994 `read_pattern`) MAY still glob-match
  via the `*` wildcard, but the canonical `iteration_pattern` `assert_exists`
  checks (research_auto:860/917) expect `{NNN}`. The mismatch is REAL; blast radius
  is the salvage-recovery path specifically (its whole job is to make write-failure
  iterations visible — and it names them off-pattern).
- NUANCE I will not overstate: the `iteration-*.md` glob (994) is permissive, so a
  recovered `iteration-1.md` is not necessarily invisible to a wildcard reader;
  the hard break is anywhere the padded `{NNN}` form is asserted. Net: REAL naming
  inconsistency, P1, severity bounded by which consumers use exact-NNN vs wildcard.
- CAVEAT on the TEST: `fanout-salvage.vitest.ts` itself uses unpadded names
  (`iteration-${n}.md`, line 45/118) — so the test ENSHRINES the unpadded behavior
  and would not catch the canonical-pattern mismatch. The green salvage suite does
  not validate against the loop's real `{NNN}` pattern.
- Fix: zero-pad to 3 digits (`String(iterNum).padStart(3,'0')`) or pass the
  resolved iteration path into salvage; update the test to assert padded names.

## Confirmed-adjacent (from source read this session; GPT-5.5 also flagged)

- ENV-LEAK (f-p123-i15-05) — P1 — `fanout-run.cjs:345`:
  `env: { ...process.env, ...extraEnv }` — full parent env to every CLI lineage,
  no `buildExecutorDispatchEnv()` allowlist. CONFIRMED from source. Leaks provider
  secrets across executor kinds, weakens recursion/dispatch-stack guards.
- TIMEOUT-ORPHANS (f-p123-i12-02 / i15-04) — P1 — `fanout-run.cjs:341-348`:
  spawnSync options carry `timeout: timeoutMs` (344) but NO `detached` / process-
  group setup. spawnSync's timeout SIGTERMs the direct child only; grandchildren
  (the actual `codex`/`claude`/`opencode` model processes) can survive. CONFIRMED.
- MERGE dedup keys (f-p123-i3-02 :97 / i3-03 :174) — P1 — `fanout-merge.cjs`:
  research `const id = finding.id || finding.title;` (97); review
  `const id = finding.findingId || finding.title;` (174). CONFIRMED these key on
  lineage-local id/title, not a content hash — so identical findings from different
  lineages with different local ids will NOT dedup (split attribution / inflated
  counts), and unrelated findings sharing a local id across lineages could
  wrongly collide. Real cross-lineage dedup unreliability.
- MERGE-DROP (f-p123-i3-04 :65) — P1 — `fanout-merge.cjs:61-67 tryReadJson`:
  malformed registry JSON → `catch { return null; }` (65); main filters
  `lineageData.filter(d => d.registry !== null)` (305) and only reports it as
  `skipped_no_registry` (326), NOT a failure. A lineage that found an active P0 but
  whose registry is malformed is SILENTLY DROPPED from the merged review verdict.
  CONFIRMED from source. For a review rollup this is a false-PASS contributor —
  P1 (P0-adjacent in combination with C-02).
- BOUNDS (f-p123-i15-02 :298 / i15-03 :306) — P1 — `executor-config.ts`:
  `count: z.number().int().positive().default(1)` (298) — no upper bound;
  `concurrency: z.number().int().positive().default(2)` (306) — positive only, no
  cap. `expandLineages` (381) materializes one entry per `count`. CONFIRMED
  unbounded: a config with `count: 1e6` expands to a million lineages before the
  pool cap matters → memory exhaustion. P1 (resource), needs a malformed/hostile
  config to trigger.
- XOR executor-vs-fanout not enforced (f-p123-i5-01 :304 / i9-04 :323) — P1 —
  `executor-config.ts`: `fanoutConfigSchema` (304) is a plain `z.object` modelling
  only `{executors, concurrency}`; `parseFanoutConfig` (323) `safeParse`s it. Zod
  object parse strips unknown keys by default, so a raw config carrying BOTH a
  top-level `executor` AND `fanout` is accepted (executor silently dropped) instead
  of failing the documented "EITHER executor OR fanout, never both" contract
  (stated in the § FAN-OUT comment, lines 282-283). CONFIRMED no root-level XOR
  guard exists in this file. P1.

## Rejected / revised

- REVISION of a brief hypothesis ("lock/state-dir collisions for same-kind
  replicas"): I find the isolation IS present, so this is NOT a live bug as posed.
  Source: `fanout-run.cjs` 108-115 `SPECKIT_STATE_ENV_BY_KIND` maps each CLI kind
  to a distinct `SPECKIT_*_STATE_DIR`; 333-337 sets it to the per-lineage
  `stateDir` (`lineageDir/.executor-state`, 310); 314 gives each lineage a unique
  `sessionId = \`fanout-${label}-${runId}\``. Same-kind replicas get distinct state
  dirs + session ids. Residual risk only if the underlying CLI ignores its
  `*_STATE_DIR` env — unverifiable without runtime, so not asserted as a bug.
- No GPT-5.5 finding is FIRMLY REJECTED. I will not issue a rejection from memory;
  the items I could not re-read are listed UNVERIFIED, not cleared.
- Severity revision: report's C-02 "P0/P1" → I pin **P0 for the review loop**
  (false-PASS on a gate), P1 for research.

## UNVERIFIED-THIS-SESSION (channel denied the re-read — NOT cleared)

  (U-01 has been PROMOTED to a confirmed finding below — see "Newly confirmed
  this session". The remaining unverified items follow.)
- fanout_run_id binding for native session_id template (review_auto.yaml ~165:
  `session_id: fanout-{lineage.label}-{fanout_run_id}`). The literal IS in the YAML
  I read (review 165). Whether `fanout_run_id` is ever BOUND before native dispatch
  (vs left as a literal token → cross-run collisions) — not re-confirmed. Note:
  the CLI path generates its own `runId` inside fanout-run.cjs (300); the native
  YAML branch is separate and may not share it.
- SHELL-INJECT `'{config.fanout_json}'` single-quote interpolation
  (review_auto.yaml:150, research_auto.yaml:161). I READ both command blocks
  (research 157-162, review 146-151): the fanout-run.cjs invocation passes
  `--fanout-config-json '{config.fanout_json}'` inside single quotes. A
  `config.fanout_json` value containing a single quote (e.g. a model string with an
  apostrophe) breaks out of the quoting before fanout-run.cjs can validate. The
  literal IS confirmed present; I classify the injectability as
  LIKELY-REAL-but-runtime-dependent (depends whether any field can contain `'`).
- ARTIFACT-DIR containment (review_auto.yaml:121 binds
  `artifact_dir: "{config.fanout_lineage_artifact_dir}"` with no normalization —
  CONFIRMED present in the 115-131 region I read; containment-escape severity not
  traced).
- RECURSIVE fan-out guard (`step_fanout_spawn skip_when: "config.fanout is absent"`,
  4×) — CONFIRMED the guard text in all regions I read (research 146, review 135);
  a spawned lineage that still carries `config.fanout` could re-fan-out. The
  proposed stronger guard (skip when `config.fanout_lineage_artifact_dir` present)
  is absent. LIKELY-REAL; depends on what the spawned subprocess's config actually
  contains (the CLI prompt does not pass config.fanout — see C-03 — so for the CLI
  path the recursion may not fire; native path unverified). Nuanced — hand to 002.
- DOC-STALENESS — NOW CONFIRMED P2 (re-read this session). For ALL of 003, 004,
  005, 006: `graph-metadata.json` `"status": "planned"` while the child
  `spec.md` frontmatter has `completion_pct: 100` (and e.g. 003 continuity
  `recent_action: "Phase 3 complete … 176/176"`, `next_safe_action: "Phase 4 …"`).
  Additionally `implementation-summary.md` is ABSENT in all four children
  (`impl-summary present: NO` for 003/004/005/006). So the graph-metadata derives
  `status:planned` (its fallback uses impl-summary presence + checklist completion;
  with no impl-summary it cannot derive `complete`). The parent `spec.md` continuity
  is ALSO stale: `completion_pct: 33`, `recent_action: "Phases 001-002 done"`,
  `next_safe_action: "Phase 003…"`, `blockers:["Phase 003 needs design decision…"]`
  — parent still claims 33% / Phase-003-pending while children claim 100% and the
  packet is being deep-reviewed as shipped. CONFIRMED real doc-staleness across the
  whole packet (8 metadata/spec disagreements: 4 child graph-metadata vs spec +
  4 missing impl-summaries + 1 stale parent). P2 each (no runtime impact; pollutes
  resume/graph traversal). Fix: add the missing `implementation-summary.md` per
  child and regenerate graph-metadata; refresh the parent continuity block.
- SALVAGE reuse-same-text (f-p123-i4-03 :103) and no-post-validation (:119,:48):
  CONFIRMED from the full salvage file I read. Line 103
  `const recoveredText = extractTextFromOpencodeJson(savedStdout);` is computed ONCE
  outside the per-iteration loop (105), then line 120 writes that SAME
  `recoveredText` into EVERY missing iteration file. So if 3 iterations are missing,
  all 3 get the identical whole-stdout blob — not per-iteration content. CONFIRMED
  real (promoting to a confirmed finding, see N-list). And `extractTextFromOpencodeJson`
  (26-52) accepts raw stdout with only a `length > 50` check (51) and no truncation
  flag, and salvage counts it `salvaged` (129) without any post-dispatch validation
  — CONFIRMED.

## Newly confirmed this session (was U-01 unverified in the prior report)

### U-01 → CONFIRMED P1 — research/review YAMLs are SELF-CONSISTENT, NOT broken;
### the real defect is the cross-loop `.type`/`.kind` SPLIT (drift), and both read a
### DEPRECATED field name
- Files: `deep_start-research-loop_auto.yaml` (618 `branch_on: "config.executor.type"`,
  612/766 `skip_when: "config.executor.type == 'native'"`; 4× `.type`, 0× `.kind`);
  `deep_start-review-loop_auto.yaml` (741 `branch_on: "config.executor.kind"`,
  735/1009 `skip_when: "config.executor.kind == 'native'"`; 4× `.kind`, 0× `.type`).
- Command-doc write shape (re-read this session): BOTH command docs write
  `config.executor.type` (research-doc 128/143/150; review-doc 141/157/164;
  defaults line 143/157 `config.executor.type=\`native\``). The persisted config
  shape is described as `config.executor.*`.
- Loader (`executor-config.ts`): canonicalizes `type`→`kind` (87-112), warns on
  `type` (106), strips it (107), errors only if BOTH present and differ (97-104).
- VERDICT (revising the prior report's "P0? unconfirmed"):
  - RESEARCH: doc writes `.type`, YAML reads `.type` → self-consistent. A plain
    native research run DOES select the native branch. NOT broken at runtime — but
    it operates on the DEPRECATED field name (the loader would warn/canonicalize if
    it ever parsed the raw config, which the YAML predicate does NOT — it reads the
    raw pre-loader config directly). So research works by reading a deprecated key
    the loader is trying to retire.
  - REVIEW: doc writes `.type`, YAML reads `.kind`. If the review config is the raw
    doc-written object (`{executor:{type:'native'}}`) and the YAML predicate
    `config.executor.kind == 'native'` reads it WITHOUT passing through the loader,
    `.kind` is UNDEFINED → the `skip_when`/`branch_on` for native is NOT satisfied →
    a plain native review run mis-branches (native dispatch skipped or falls to a
    wrong branch). This is the genuine break, and it is on the REVIEW side, the
    OPPOSITE of where the report hypothesized (it flagged research). Whether the
    config is loader-normalized before the YAML predicate is the deciding factor —
    if some step runs `parseExecutorConfig` first, `.kind` is populated and review
    works; if the predicate reads the raw doc-written config, review native
    mis-branches. The DRIFT (research `.type` vs review `.kind`, both vs loader
    `.kind`, doc writes `.type`) is unambiguously REAL and is a latent P1 (P0 if the
    review predicate reads the raw config). One of the two loops is reading a field
    name that does not match what its own command doc writes.
- Fix: make BOTH YAMLs branch on `config.executor.kind` AND normalize legacy `type`
  → `kind` before any workflow predicate runs (or have the command docs write
  `.kind`). Pick ONE canonical field end-to-end (doc-write, YAML-read, loader) —
  currently three layers disagree.

## Newly discovered (Opus, beyond GPT-5.5 + prior pass)

- N-01 — P1 — SALVAGE reuses one stdout blob for ALL missing iterations
  (`fanout-salvage.cjs:103` computed once, written at `:120` inside the
  `for (const iterNum…)` loop). Multiple missing iterations receive byte-identical
  content. CONFIRMED from source. This corrupts per-iteration provenance and can
  make convergence/merge double-count the same text. (GPT-5.5 raised this as
  i4-03; I independently CONFIRM it from the loop structure — promote from
  "unverified" to CONFIRMED.)
- N-02 — P2 — TSX self-re-exec is a second top-level blocking spawnSync
  (`fanout-run.cjs:52-66`): when `DEEP_LOOP_TSX_LOADED !== '1'` the script
  `spawnSync`s a full copy of itself with the tsx loader and `process.exit`s on its
  status (65). Not the cause of C-01 (that's the worker at 341) but it confirms a
  codebase-wide spawnSync habit; the C-01 async rewrite must target the INNER
  (post-tsx) execution, and this wrapper doubles process startup cost per run.
- N-03 — observation/mitigant — `computeLineageTimeoutMs` (154-158) caps at 4h and
  doubles `iterations*perIterSecs`. With unbounded `iterations` (BOUNDS finding) the
  timeout still caps at 4h, so a single runaway lineage is time-bounded — a partial
  mitigant for runaway count, but it does NOT bound process/memory count from
  `expandLineages` materializing a huge `count`.
- N-04 — P2 — merge attribution verdict reads a DIFFERENT shape than the rollup.
  `buildAttributionMd` (242-247) computes each row's verdict from
  `registry?.findingsBySeverity?.P0` — but the per-lineage deep-review registry's
  actual field may be `activeP0`/`openFindings` (the merge output uses
  `findingsBySeverity` AND `activeP0`, 210-213). If a lineage registry lacks
  `findingsBySeverity`, the attribution row silently shows PASS even with active
  P0s. Source-confirmed shape mismatch; low blast radius (attribution doc only,
  not the authoritative merged verdict) → P2.

## Verdict

CONDITIONAL — at least TWO real P0-class defects CONFIRMED from source this
session: C-01 (CLI fan-out fully serial; `concurrency` inert; defeats success-
criterion #1) and C-02 (non-zero exit / timeout reported as success → false-PASS
review verdict via the never-fail merge). C-03 (Option-B "verbatim" violated), C-04
(unpadded salvage filename vs canonical `iteration-{NNN}.md`), and U-01 (cross-loop
`.type`/`.kind` field split + deprecated-field read; P1, P0 if the review predicate
reads the raw config) all CONFIRMED at the source level. ENV-LEAK, TIMEOUT-ORPHANS,
MERGE-DROP, MERGE-DEDUP, BOUNDS, XOR-not-enforced, SALVAGE-reuse (N-01), and
DOC-STALENESS (8 instances) are CONFIRMED real from source. The 72-test green suite
exercises only mock/pure functions and never drives the real spawnSync worker, and
the salvage test itself enshrines the unpadded filename — so the suite cannot catch
C-01/C-02 and would not catch C-04. The report's core thesis ("green tests hid a
real P0") is CORRECT and, if anything, understated: a SECOND P0 (false-PASS) and a
confirmed U-01 drift were also hidden. ZERO GPT-5.5 findings firmly REJECTED; one
brief hypothesis (same-kind replica state collision) REVISED to not-a-bug. NOT a
clean pass. Iteration-002 should trace the single remaining runtime question
(whether the review YAML's `config.executor.kind` predicate reads a loader-
normalized or raw config — that pins U-01 at P1 vs P0) plus the shell-inject and
recursion-guard nuances.
