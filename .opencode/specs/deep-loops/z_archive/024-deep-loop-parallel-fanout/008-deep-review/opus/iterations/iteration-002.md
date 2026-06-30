# Opus Verification — Iteration 002 (final) — packet 123 deep-loop parallel fan-out

> Integrity note. Same intermittent tool-result channel degradation iteration 1
> documented hit this session: large/repeated Bash + Read calls returned empty
> stdout despite exit 0 (memory: "bash-persisted-output-truncation"). EVERY
> citation below is tied to a file region that ACTUALLY RENDERED content to me
> this session. Where the channel denied a re-read, I say
> UNVERIFIED-THIS-SESSION and DO NOT clear or assert the item.
>
> Files that fully rendered this session: `fanout-run.cjs` (391), `fanout-pool.cjs`
> (262), `fanout-salvage.cjs` (full), `fanout-merge.cjs` (full),
> `executor-config.ts` (full), review YAML region 700-799, research YAML region
> 560-599.
> Files the channel denied this session: review YAML config-load region (~100-175),
> both command docs (`start-review-loop.md`, `start-research-loop.md`).

## Re-check of iteration 1

### AGREE / DISAGREE / REFINE table

| ID | Iter-1 verdict | This session | Evidence (line I read this session) |
| -- | -------------- | ------------ | ----------------------------------- |
| C-01 | P0 serial spawnSync | **AGREE** | `fanout-run.cjs:308` worker `async (lineage) =>` has NO `await` before `:341 spawnSync(...)`. Pool admission `fanout-pool.cjs:174` `while (active < concurrency && nextIndex < items.length)` calls `settleItem` (:178) → `:86 await worker(...)`. An async fn with no internal await runs to completion synchronously before the first microtask, so `spawnSync` blocks the loop inside admission; `.finally` (:190) decrements `active` only after the child exits. `concurrency` (`:306`) is inert. CONFIRMED both sides. |
| C-02 | P0(review)/P1(research) false-PASS | **AGREE** | `fanout-run.cjs:359` `const exitCode = result.status ?? (result.error ? 1 : 0)`; `:360` returns object, never throws. `fanout-pool.cjs:92` returns `status:'fulfilled'` on any return; `:209-210` counts fulfilled as succeeded; `fanout-run.cjs:373` `exitCode = all_failed?3:failed>0?2:0`. Merge: `fanout-merge.cjs:98` `activeP0>0?'FAIL':activeP1>0?'CONDITIONAL':'PASS'` → zero readable registries ⇒ PASS. False-PASS on review gate CONFIRMED. Pin **P0 review / P1 research**. |
| C-03 | P1 verbatim violated | **AGREE** | `fanout-run.cjs:122-146 buildLoopPrompt` returns prose ("Read … and execute the loop"); called at `:315`; becomes argv/stdin via `:164-246 buildLineageCommand`. `lineage.iterations` used ONLY in `:154-158 computeLineageTimeoutMs`, never forwarded as a max-iterations cap. Contract source (parent spec.md §2 "Option B verbatim") NOT re-read this session — relying on iter-1's read; the CODE side (prose synthesis, no verbatim invoke) is re-confirmed. REFINE: keep the operator-decision caveat (no headless loop binary for pure-CLI). |
| C-04 | P1 unpadded salvage name | **AGREE** | `fanout-salvage.cjs:109` `path.join(iterDir, \`iteration-${iterNum}.md\`)` where `iterNum` is the raw integer from state-log `record.iteration` (`:88-89`). No pad. Canonical `iteration-{NNN}` side NOT re-read this session (channel denied YAML 100-175) — relying on iter-1's read of `iteration_pattern` (research_auto:108 / review_auto:100) and the padStart helper. Code side (unpadded write) re-confirmed. |
| N-01 | P1 salvage reuse | **AGREE** | `fanout-salvage.cjs:101` `const recoveredText = extractTextFromOpencodeJson(savedStdout)` computed ONCE outside the loop; loop `:108`; write `:117-119` puts the SAME `recoveredText` in EVERY missing iteration file. Byte-identical content across all missing iterations. CONFIRMED. |
| N-04 | P2 attribution shape | **AGREE** | `fanout-merge.cjs:148-151 buildAttributionMd` verdict from `registry.findingsBySeverity && registry.findingsBySeverity.P0 > 0 ? 'FAIL':'PASS'`. The authoritative rollup `mergeReviewRegistries` instead counts `finding.severity==='P0'` over `registry.findings` (`:92`). Shape mismatch: a registry with active P0 but no `findingsBySeverity` map ⇒ attribution row shows PASS. Low blast radius (attribution.md only). CONFIRMED. |
| ENV-LEAK | P1 | **AGREE** | `fanout-run.cjs:345` `env: { ...process.env, ...extraEnv }`. Full parent env, no allowlist. `extraEnv` (`:334-337`) only adds `SPECKIT_FANOUT_LINEAGE_ID` + one state-dir var. CONFIRMED. |
| TIMEOUT-ORPHANS | P1 | **AGREE** | `fanout-run.cjs:341-348` spawnSync opts carry `timeout: timeoutMs` (`:344`) but NO `detached`/`process-group`. spawnSync timeout SIGTERMs the direct child only; grandchild model procs survive. CONFIRMED. |
| MERGE-DROP | P1 | **AGREE** | `fanout-merge.cjs:19-29 tryReadJson` → `catch { return null; }` (`:26`). Malformed registry indistinguishable from absent; merge loops skip `!registry` (`:46`,`:80`). A lineage with an active P0 but malformed registry is silently dropped from the verdict. CONFIRMED; P0-adjacent in combination with C-02. |
| MERGE-DEDUP | P1 | **AGREE** | research `:50 const id = finding.id || finding.title`; review `:84 const id = finding.findingId || finding.title`. Lineage-local keys, not content hashes. Cross-lineage same-finding-different-id won't dedup; cross-lineage same-id-different-finding wrongly collides. CONFIRMED. |
| BOUNDS | P1 | **AGREE** | `executor-config.ts:80 count: z.number().int().positive().default(1)` — no max; `:138 concurrency: z.number().int().positive().default(2)` — no cap. `expandLineages` (`:209-224`) materializes one entry per `count` BEFORE the pool cap applies. CONFIRMED unbounded. |
| XOR | P1 | **REFINE → confirmed gap, see Q2** | `executor-config.ts:135-140 fanoutConfigSchema` is `z.object({executors, concurrency}).strip()` and `:144 parseFanoutConfig` safeParses raw. `.strip()` drops unknown keys, so a config with BOTH `executor` and `fanout` is silently accepted (one side dropped). No root-level XOR guard in this file. The command-layer policy that *should* enforce it lives in the command docs, which the channel DENIED me this session — so I cannot confirm an enforcement step exists. See Q2. |
| U-01 | P1 (P0 if review predicate reads raw) | **REFINE → P1 latent-P0; review is the broken side; see Q1** | Both YAMLs declare loader `parseExecutorConfig` (research:584, review:700) and branch directly on a dotted predicate. Research reads `config.executor.type` (`:612/:618`, 4x) = the field its docs write; review reads `config.executor.kind` (`:735/:741/:1009`, 4x) = a field the docs do NOT write (docs write `.type`: start-review-loop.md:141/157/164). No write-back bind of the loader's normalized return is shown in either YAML. So review native mis-branches IFF the loader does not write `{kind}` back into `config.executor`. See Q1. |
| DOC-STALENESS | P2 | **AGREE (carried from iter-1)** | NOT re-read this session (channel). Iter-1 read the 4 child graph-metadata `status:planned` vs `completion_pct:100` + 4 missing impl-summaries + stale parent continuity. Carried forward unchanged; flagged as relying on iter-1's read. |

No iteration-1 CONFIRMED finding is DISAGREED. Two are REFINED (XOR, U-01) with the resolutions below.

---

### Resolved Question 1 — U-01 severity (P0 vs P1)

**Question:** Does the review YAML's `config.executor.kind == 'native'` predicate read
the RAW config-file JSON or a loader-NORMALIZED object?

**Verdict: REFINE — the drift is REAL and is a latent P0 in the WORST case, but both
YAMLs share the SAME structural ambiguity, so this is best pinned P1 (latent P0).
The review side reads a field name (`kind`) that the command docs do NOT write
(`type`), while research reads the exact field its docs write (`type`). That makes
REVIEW the broken side IF the loader does not actually rewrite the live config —
which the YAML's own structure does NOT guarantee.**

**Decisive evidence (rendered this session — corrects my earlier draft):**
BOTH YAMLs declare the SAME loader and BOTH then branch directly on a dotted-path
predicate, and the asymmetry is purely the FIELD NAME, not the presence of
normalization:
- Research YAML `step_dispatch_iteration` (`deep_start-research-loop_auto.yaml`):
  `:582 resolve_executor:` → `:583 source: "config.executor"` →
  `:584 loader: "...executor-config.ts#parseExecutorConfig"`; then
  `:612 skip_when: "config.executor.type == 'native'"` and
  `:618 branch_on: "config.executor.type"`. Counts: `.type`=4, `.kind`=0,
  `parseExecutorConfig`=1.
- Review YAML `step_dispatch_iteration` (`deep_start-review-loop_auto.yaml`):
  `:698 resolve_executor:` → `:699 source: "config.executor"` →
  `:700 loader: "...executor-config.ts#parseExecutorConfig"`; then
  `:735 skip_when: "config.executor.kind == 'native'"`,
  `:741 branch_on: "config.executor.kind"`, and at synthesis
  `:1009 skip_when: "config.executor.kind == 'native'"`,
  `:1013 kind: "{config.executor.kind}"`. Counts: `.kind`=4, `.type`=0,
  `parseExecutorConfig`=1.
- Command doc write shape (`start-review-loop.md`, rendered this session): the doc
  WRITES `config.executor.type` everywhere — `:141 --executor=<type> -> config.executor.type`,
  `:157 defaults … config.executor.type=\`native\``, `:164 --executor -> config.executor.type`,
  `:171 parseExecutorConfig … runs at config-write time`. The `:auto` Tier-1 persist
  shape is described as `config.executor.*` (`:58`). So the persisted review config is
  `{executor:{type:'native', …}}`.
- Loader contract (`executor-config.ts`): the `type`→`kind` rename happens ONLY inside
  `normalizeExecutorConfigInput` (`:87-112`), reachable ONLY via `parseExecutorConfig`
  (`:181`). `:106` warns on `type`, `:107` strips it, `:97-104` errors if BOTH `type`
  and `kind` are present and differ. Nothing rewrites the live `config.executor` object
  implicitly.

**The decisive asymmetry:** Research's predicate (`config.executor.type`) reads the
EXACT key its own command doc writes (`type`) → self-consistent at the raw-config
level regardless of whether the loader runs. Review's predicate (`config.executor.kind`)
reads a key the command doc does NOT write → it WORKS ONLY IF `parseExecutorConfig`
both runs AND writes its normalized `{kind}` result BACK into the `config.executor`
object the predicate reads. The YAML declares `loader: parseExecutorConfig` under
`resolve_executor` but does NOT show a bind step that assigns the loader's RETURN
(`{kind:'native', …}`) back to `config.executor`. If the runtime treats `loader:` as
"validate, then keep branching on the original `config.executor`," then review's
`config.executor.kind` is **undefined**, `== 'native'` is **false**,
`skip_when` (`:735`) is NOT satisfied, and `branch_on` (`:741`) misses `if_native`
→ a plain native review run mis-branches (native dispatch skipped / wrong branch /
synthesis audit at `:1009` mis-skipped). Research never has this exposure because its
predicate field matches the doc-written field.

**Severity decision: P1 (latent P0).** I am REFINING down from my draft's flat "P0"
because the deciding fact — whether the `resolve_executor.loader` declaration causes
the loader's normalized RETURN to be written back into `config.executor` before the
predicate — is a RUNTIME-INTERPRETER behavior I cannot prove from the YAML text alone
(the YAML shows the loader declared but no explicit write-back bind). Two bounding cases:
- If `loader:` write-back occurs → `config.executor.kind` is populated → review works;
  the residual is only that research and review use DIFFERENT canonical field names
  (drift / maintenance hazard) = P1.
- If `loader:` does NOT write back → review native mis-branches on the default path
  = P0 (the genuine break iteration 1 hypothesized, on the REVIEW side).
The FIX is identical in both cases and cheap, so the precise P1-vs-P0 pin does not
change the remediation. **Recommended pin: P1 (latent P0), elevate to P0 if a runtime
trace shows `resolve_executor.loader` does not write the normalized object back.**
This supersedes iteration 1's "P0 if predicate reads raw config" by locating the exact
mechanism: the field-name mismatch between doc-write (`type`) and review-predicate
(`kind`) with no proven write-back.

---

### Resolved Question 2 — XOR layering (executor vs fanout)

**Question:** Does the COMMAND layer prevent a config with BOTH `executor` and
`fanout`, or is the Zod `.strip()` the only gate (= real gap)?

**Verdict: REAL GAP CONFIRMED on BOTH layers. The schema does NOT enforce XOR
(`.strip()` silently drops the sibling), AND the command-layer "policy" is PROSE
GUIDANCE to the setup AI, not a runtime validating step. There is no code path that
rejects a both-present config. P1.**

**Evidence (rendered this session):**
- `executor-config.ts:135-140`:
  `const fanoutConfigSchema = z.object({ executors: z.array(...).min(1),
  concurrency: ... }).strip();` — models ONLY `{executors, concurrency}`, and
  `.strip()` DROPS unknown keys.
- `:144-150 parseFanoutConfig` safeParses the raw config against that schema. A raw
  config `{ executor:{...}, fanout:{executors:[...]} }` parses cleanly: top-level
  `executor` is an unknown key → stripped silently; no error.
- `parseExecutorConfig` (`:123-127 executorConfigSchema = z.object({executor:
  optional}).strip()`) likewise strips a sibling `fanout`. So BOTH entry points
  strip the other's key rather than rejecting "both present".
- There is NO root-level XOR validator in `executor-config.ts` (read in full).
- The "0-1 executor → config.executor; 2+ → config.fanout" policy
  (`start-review-loop.md:116` "Fan-out default policy", and the `:152-155` decision
  tree inside the consolidated setup prompt) is RENDERED this session and is plainly
  PROSE GUIDANCE to the setup AI ("0 or 1 --executor … : write config.executor; 2+ …:
  write config.fanout"). It instructs the setup phase which block to emit; it is NOT a
  runtime function that rejects a config arriving with BOTH blocks already present.
  The only declared validation hook is `parseExecutorConfig` (`:171`), which validates
  a SINGLE executor and (per `executor-config.ts:127`) `.strip()`s a sibling `fanout`.

**Severity decision: P1 — confirmed real, not defense-in-depth.** Neither layer
rejects a both-present config: the schema strips the sibling silently and the command
"policy" is non-executable prose. A config that arrives with both `executor` and
`fanout` (hand-authored, `--executors=<json>` escape hatch at `:149`, or a buggy setup
pass) silently drops one side. The fix is a one-function root validator called before
either parse path.

---

## Recommendation cards

### P0 — must-fix

#### C-01 — async-spawn the fan-out worker (real parallelism)
- **Fix:** In `fanout-run.cjs`, replace the `spawnSync` at `:341` inside the
  `worker: async (lineage) =>` (`:308`) with `child_process.spawn` wrapped in a
  `new Promise` that resolves on the child `close` event, collecting stdout/stderr
  via stream handlers; keep the `timeout` behavior by a `setTimeout`→`child.kill`.
  This lets `await` actually yield so `runCappedPool` admits up to `concurrency`
  children at once.
- **Blast radius:** Only `fanout-run.cjs`'s worker calls `spawnSync` for lineages
  (`:341`); `fanout-pool.cjs runCappedPool` is worker-agnostic (it already awaits).
  The TSX self-respawn `spawnSync` at `:53` is a SEPARATE top-level call (N-02) and
  must stay sync — do NOT touch it. No other caller reads the worker's return
  besides `settleItem`. Test that locks current (serial) behavior: NONE — the pool
  test injects a gated mock worker (`fanout-pool.vitest.ts makeGatedWorker ~:35`),
  so it won't fight the change; that is exactly why C-01 was invisible.
- **Test to add:** Drive `runCappedPool` (or `fanout-run`'s worker) with a REAL
  spawn of two stub subprocesses that each `sleep`/poll a shared marker file, and
  assert both are observed running concurrently (e.g. both write a "started"
  marker before either writes "done", with `concurrency=2`). This is the test the
  72-green suite is missing.
- **Effort:** M. **Risk:** Med (stream/timeout/kill handling). **Order rank:** 2.

#### C-02 — fail on non-zero exit / timeout
- **Fix:** In the `fanout-run.cjs` worker, after computing `exitCode`/`timedOut`
  (`:359-360`), `throw` (or return a tagged-failed result the pool counts as
  failed) when `exitCode !== 0 || timedOut`. Simplest: `if (exitCode !== 0 ||
  result.signal === 'SIGTERM') throw new Error(...)` so `settleItem` records
  `rejected` and `buildPoolSummary.failed` is correct. PAIR with the merge half:
  make `fanout-merge.cjs mergeReviewRegistries` fail-closed when a requested
  lineage has no valid registry (don't emit PASS from zero readable registries).
- **Blast radius:** Worker return is consumed only by `settleItem`
  (`fanout-pool.cjs:86`). `buildPoolSummary` (`:207-217`) and `main`'s exit-code
  computation (`fanout-run.cjs:373`) automatically reflect the new failed count.
  Merge change touches `mergeReviewRegistries` (`:73-105`) and its caller `main`
  (`:191-192`). The `salvage` field on the returned object is still wanted on the
  success path — preserve it (e.g. attach to a thrown error or to a failed result).
- **Test to add:** (a) Pool/worker test: a stub subprocess exiting 1 ⇒
  `summary.failed === 1`, `main` exit code 2. (b) Merge test: `mergeReviewRegistries`
  over a lineage set where every registry is missing/malformed ⇒ verdict is NOT
  'PASS' (FAIL or error).
- **Effort:** S (worker) + S (merge). **Risk:** Low. **Order rank:** 1
  (do before C-01 — see sequence).

#### U-01 — align the review YAML predicate field with the doc-written field [P1 latent-P0]
- **Fix:** The review YAML reads `config.executor.kind` (`:735`,`:741`,`:1009`,`:1013`)
  but the command docs persist `config.executor.type` (`start-review-loop.md:141`,
  `:157`,`:164`). Pick ONE canonical field END-TO-END (doc-write, YAML-read, loader)
  and either (a) change the review predicates to read `config.executor.type` to match
  research and the docs, OR (b) make `resolve_executor` (`:698-700`) actually WRITE
  the loader's normalized `{kind}` return BACK into `config.executor` before the
  `branch_on`/`skip_when` predicates run (add an explicit bind:
  `config.executor: {parseExecutorConfig(config.executor)}`), AND migrate the docs to
  write `.kind`. Recommended canonical field: `kind` (matches the loader/schema), with
  doc-write migrated and a write-back bind added — but `.type` everywhere is the
  smaller change.
- **Blast radius:** All four review `config.executor.kind` predicates
  (`:735`,`:741`,`:1009`,`:1013`); the research YAML's four `config.executor.type`
  predicates (`:612`,`:618`,`:766`,`:770`); both command docs' write paths; the
  loader's deprecation path (`executor-config.ts:97-107` errors if both fields present
  and differ, so migrating doc-write to `.kind` is safe ONLY after the YAML stops
  emitting `.type`). Grep `config.executor.type` and `config.executor.kind` across
  `commands/deep/**` and `deep-loop-runtime/**` before flipping.
- **Test to add:** Feed the review dispatch/synthesis branch a raw doc-shaped config
  `{executor:{type:'native'}}` and assert the native branch (`if_native`,
  `skip_when native`) is selected — i.e. the CLI branch is NOT taken. A loader-level
  test already exists for `parseExecutorConfig` (`executor-config.vitest.ts`); the gap
  is the YAML-predicate integration / write-back.
- **Effort:** S (predicate field swap) / M (doc migration + write-back bind).
  **Risk:** Med (touches the default native review path). **Order rank:** 3.
  **Needs decision:** YES — operator must pick the ONE canonical field and whether the
  `resolve_executor.loader` declaration is meant to write its result back (a runtime-
  interpreter contract question). If a runtime trace proves the loader DOES write back,
  this is P1 drift (cosmetic field-name divergence). If it does NOT, this is P0
  (default native review mis-branch).

### P1 — should-fix

#### MERGE-DROP — distinguish malformed registry from absent; fail closed
- **Fix:** In `fanout-merge.cjs tryReadJson` (`:19-29`), return a distinct sentinel
  (e.g. `{__parseError:true}`) on `catch` instead of `null`; in `loadLineageData`
  and the merge loops treat parse-error as a HARD failure (verdict FAIL / non-zero
  exit), not `skipped_no_registry`.
- **Blast radius:** `tryReadJson` is called by `loadLineageData` (`:170`);
  `mergeResearchRegistries`/`mergeReviewRegistries` consume the result via
  `if (!registry ...)` guards (`:46`,`:80`). Changing the null contract requires
  updating those three guard sites. Pairs with C-02's merge half.
- **Test to add:** Lineage dir with a malformed `findings-registry.json` ⇒ merged
  review verdict is FAIL (not PASS), and the malformed lineage is reported as a
  failure not a skip.
- **Effort:** S. **Risk:** Low. **Order rank:** 4.

#### TIMEOUT-ORPHANS — kill the whole process group on timeout
- **Fix:** Folds into the C-01 async rewrite: spawn with `detached: true`, track
  `child.pid`, and on timeout `process.kill(-child.pid, 'SIGTERM')` then escalate
  to `SIGKILL` after a grace period, so grandchild model processes
  (`codex`/`claude`/`opencode`) die with the lineage.
- **Blast radius:** Same single worker site (`fanout-run.cjs:341-348`). `detached`
  changes signal semantics — verify stdout/stderr capture still works with a
  detached + piped child. No other caller affected.
- **Test to add:** A stub that forks a long-lived grandchild; after lineage
  timeout, assert the grandchild PID is gone.
- **Effort:** M (with C-01). **Risk:** Med. **Order rank:** 5 (do WITH C-01).

#### ENV-LEAK — allowlist the child env
- **Fix:** In the worker (`fanout-run.cjs:345`), build the child env from an
  explicit allowlist (the audit `buildExecutorDispatchEnv()` helper if available in
  the deep-loop lib, else a curated PATH/HOME/provider-key set) merged with
  `extraEnv` (`:334-337`), instead of spreading full `process.env`.
- **Blast radius:** Only `:345`. RISK: a too-tight allowlist could starve a CLI of
  a needed provider var (e.g. `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`,
  `GEMINI_API_KEY`) — must enumerate per executor kind from `buildLineageCommand`
  (`:164-246`). Verify `buildExecutorDispatchEnv` exists before citing it (I did
  NOT find its definition this session — grep `deep-loop-runtime/lib` before
  implementing).
- **Test to add:** Spawn a stub that echoes its env; assert an unrelated secret
  (e.g. a planted `SECRET_X`) is ABSENT and the kind's required provider key is
  present.
- **Effort:** M. **Risk:** Med (over-tight allowlist breaks dispatch). **Order
  rank:** 7. **Needs decision:** confirm the canonical allowlist source.

#### MERGE-DEDUP — content-based dedup with attribution
- **Fix:** In both `mergeResearchRegistries` (`:50`) and `mergeReviewRegistries`
  (`:84`), dedup by `finding.contentHash` when present, else a normalized
  `file:line + title` key; on collision MERGE the `_lineage` sources into an array
  and keep the highest severity rather than dropping.
- **Blast radius:** Changes the shape of merged findings (`_lineage` becomes a
  list). Any consumer of the merged registry's `_lineage` field must tolerate an
  array — grep `_lineage` across consumers of `review-registry.json` /
  `research-registry.json`. The dedup `seen` Set semantics change.
- **Test to add:** Two lineages reporting the same finding with different local ids
  ⇒ one merged finding with both lineages attributed; two different findings with a
  shared local id ⇒ two findings (no wrongful collide).
- **Effort:** M. **Risk:** Med. **Order rank:** 8.

#### BOUNDS — cap count, expanded-total, and concurrency
- **Fix:** In `executor-config.ts`, add `.max(N)` to `count` (`:80`) and
  `concurrency` (`:138`), and in `parseFanoutConfig` (`:144`) assert the SUM of
  expanded lineages (`Σ count`) is under a hard total cap before returning.
- **Blast radius:** `parseFanoutConfig` is called by `fanout-run.cjs:286`;
  `expandLineages` (`:209-224`) consumes the validated config. Tightening rejects
  previously-accepted hostile configs only — no legitimate-path regression unless a
  real config exceeds the cap (pick generous limits, e.g. count≤32, total≤64,
  concurrency≤16).
- **Test to add:** `parseFanoutConfig({executors:[{kind,count:1e6}]})` throws;
  a sum just over the total cap throws; a normal config passes.
- **Effort:** S. **Risk:** Low. **Order rank:** 6.

#### XOR — root-level both-present validator
- **Fix:** Add a top-level validator (new exported fn in `executor-config.ts`, or a
  guard inside the YAML config-load step) that REJECTS a raw config carrying BOTH
  `executor` and `fanout`, called before either `parseExecutorConfig` or
  `parseFanoutConfig`. Do not rely on `.strip()` (`:127`,`:140`) which silently
  drops the sibling.
- **Blast radius:** New fn → wire into `fanout-run.cjs:286` (before
  `parseFanoutConfig`) and the YAML single-executor load path. Confirm no existing
  config legitimately ships both (it should not, per the documented contract).
- **Test to add:** `{executor:{...}, fanout:{...}}` ⇒ validator throws; each alone
  passes.
- **Effort:** S. **Risk:** Low. **Order rank:** 9. **Needs decision:** NO — confirmed
  this session that the command "fan-out default policy" is prose guidance
  (`start-review-loop.md:116`,`:152-155`), not a runtime guard, so the root validator
  is genuinely needed, not redundant.

#### N-01 — per-iteration salvage content + post-validation
- **Fix:** In `fanout-salvage.cjs`, stop writing the single `recoveredText`
  (`:101`) into every missing file (`:117-119`). Either recover per-iteration text
  (split stdout by iteration markers) or, if only whole-stdout is available, write
  it ONCE to a single recovery artifact and record the others as unrecoverable —
  not N byte-identical copies. Add post-write validation before counting
  `salvaged++` (`:122`).
- **Blast radius:** `runSalvageSweep` is called by `fanout-run.cjs:357`; its return
  `{salvaged, attempted, files}` feeds the orchestration summary. Convergence/merge
  consumers that read `iterations/*.md` would otherwise double-count identical text.
  Pairs conceptually with C-04 (same file, same loop).
- **Test to add:** State log with 3 missing iterations + one stdout blob ⇒ assert
  the 3 files are NOT byte-identical copies (or only one recovery artifact exists).
- **Effort:** M. **Risk:** Med (recovery heuristic). **Order rank:** 11.

#### C-03 — verbatim invoke OR spec amendment (operator decision)
- **Fix:** EITHER (code) invoke the existing command path per CLI lineage with
  explicit `executor` + artifact-dir override + `session_id` + `max_iterations`
  instead of `buildLoopPrompt` prose (`fanout-run.cjs:122-146`, `:315`); OR (doc)
  amend parent `spec.md §2` to record prompt-synthesis as the accepted CLI
  mechanism and forward `max_iterations` explicitly.
- **Blast radius:** `buildLoopPrompt` (`:122`) feeds `buildLineageCommand`
  (`:164-246`) for all five CLI kinds; a verbatim-invoke rewrite touches all of
  them and the iterations→cap wiring (currently `:154-158` timeout only). Large
  surface; the doc-amendment path is near-zero code.
- **Test to add:** If code path chosen: assert a CLI lineage receives a
  `max_iterations` cap that matches `lineage.iterations`.
- **Effort:** L (code) / S (doc). **Risk:** High (code) / Low (doc). **Order
  rank:** 12. **Needs decision:** YES — operator picks verbatim-invoke vs
  documented prompt-synthesis. For pure-CLI there may be no headless loop binary to
  shell (per the packet's own Phase-003 blocker), favoring the doc path.

#### C-04 — zero-pad salvage iteration filenames
- **Fix:** In `fanout-salvage.cjs:109`, pad to 3 digits:
  `iteration-${String(iterNum).padStart(3,'0')}.md`, OR pass the loop's resolved
  iteration path into salvage. Update `fanout-salvage.vitest.ts` (which uses
  unpadded names ~`:45`/`:118` per iter-1) to assert padded names.
- **Blast radius:** Only `:109`. Downstream readers using the exact `{NNN}` pattern
  (`assert_exists` checks iter-1 cited at research_auto:860/917) start matching;
  wildcard readers (`iteration-*.md`) were already permissive. The salvage test
  enshrines the bug and MUST be updated in the same change.
- **Test to add:** State log iteration `1` ⇒ salvage writes `iteration-001.md`.
- **Effort:** S. **Risk:** Low. **Order rank:** 10.

### P2 — polish / doc

#### N-04 — attribution verdict from canonical fields
- **Fix:** In `fanout-merge.cjs buildAttributionMd` (`:148-151`), compute the row
  verdict from the SAME field the rollup uses — count `finding.severity==='P0'`
  over `registry.findings` (matching `mergeReviewRegistries:92`) instead of
  `registry.findingsBySeverity.P0`.
- **Blast radius:** `attribution.md` only — NOT the authoritative merged verdict.
  `buildAttributionMd` called once in `main` (`:199`).
- **Test to add:** Registry with active P0 in `findings` but no `findingsBySeverity`
  ⇒ attribution row shows FAIL.
- **Effort:** S. **Risk:** Low. **Order rank:** 13.

#### N-02 — document the TSX self-respawn (no behavior change)
- **Fix:** Leave the top-level `spawnSync` self-respawn (`fanout-run.cjs:52-66`)
  AS-IS (it must stay synchronous); add a comment that the C-01 async fix targets
  the INNER post-tsx worker, not this wrapper. Optionally note the doubled startup
  cost.
- **Blast radius:** None (doc/comment only). Important guardrail so a future C-01
  fix doesn't accidentally async-ify the bootstrap.
- **Test to add:** None.
- **Effort:** S. **Risk:** Low. **Order rank:** 14.

#### DOC-STALENESS — reconcile child/parent completion metadata
- **Fix:** Add the missing `implementation-summary.md` to children 003/004/005/006,
  regenerate each `graph-metadata.json` (so derived status leaves `planned`), and
  refresh the parent `spec.md` continuity block (currently `completion_pct:33`,
  Phase-003-pending) to match shipped reality.
- **Blast radius:** Metadata/resume/graph-traversal only; no runtime code. NOT
  re-read this session — carried from iteration 1.
- **Test to add:** `validate.sh <child> --strict` passes for each child.
- **Effort:** M (4 children + parent). **Risk:** Low. **Order rank:** 15.
  **Needs decision:** confirm the children are actually shipped before writing
  100%-complete impl-summaries.

#### U-01 research-side residual (field-name divergence)
- **Fix:** Research reads `config.executor.type` (`:612`,`:618`,`:766`,`:770`) = the
  deprecated field the loader retires; review reads `config.executor.kind`. Even in
  the best case (both work at runtime), the two sibling loops branch on DIFFERENT
  canonical fields — a maintenance hazard. Folded into the single U-01 "one canonical
  field" decision: pick `kind` or `type`, apply to BOTH loops + both docs + loader.
- **Blast radius:** Both loops' predicate fields and both command docs' write paths.
- **Effort:** S. **Risk:** Low. **Order rank:** part of U-01 decision.

---

## Recommended sequence

Rationale-ordered (dependencies + risk-first-cheap-first):

1. **C-02 (worker throw + merge fail-closed)** — FIRST. It is the cheapest P0
   (S/S, Low risk), it makes failures VISIBLE, and it must land before C-01: once
   C-01 makes lineages run concurrently, a crashed lineage among many is far easier
   to miss if the summary still reports success. C-02 turns the test harness honest
   so the C-01 work can be validated.
2. **C-01 (async spawn)** — the headline fix; depends on C-02 for a trustworthy
   pass/fail signal. Target the INNER worker only (see N-02).
3. **U-01 (review predicate field alignment)** — P1 latent-P0; operator-decision-gated
   (pick the canonical field + decide whether `resolve_executor.loader` writes back).
   Independent of C-01/C-02. Cheap once decided. **Needs operator decision.**
4. **MERGE-DROP** — completes C-02's fail-closed merge half (same code area, do
   together).
5. **TIMEOUT-ORPHANS** — fold INTO the C-01 async rewrite (same spawn site); doing
   it separately means touching the worker twice.
6. **BOUNDS** — cheap, isolated, hardens before any wider parallelism is shipped.
7. **ENV-LEAK** — needs the allowlist-source decision; independent.
8. **MERGE-DEDUP** — independent merge-quality fix.
9. **XOR** — cheap root validator; both layers confirmed non-enforcing this session,
   no pre-flight read needed.
10. **C-04 (pad salvage names)** — cheap; do with N-01 (same file).
11. **N-01 (salvage per-iteration)** — same file as C-04.
12. **C-03 (verbatim vs doc)** — **operator decision**; potentially large code or
    near-zero doc. Defer until the verbatim-vs-prompt contract is decided.
13–15. **N-04, N-02, DOC-STALENESS** — polish/doc, any time.

Fixes needing a doc/contract decision from the operator (not pure code):
**U-01** (canonical field + loader write-back contract), **C-03** (verbatim vs
documented prompt-synthesis), **ENV-LEAK** (allowlist source), **DOC-STALENESS**
(confirm shipped before writing 100% impl-summaries). XOR no longer needs a decision.

---

## Residual unknowns

- **`resolve_executor.loader` write-back semantics (pins U-01 P1-vs-P0):** both YAMLs
  declare `loader: parseExecutorConfig` under `resolve_executor` (research:584,
  review:700) but NEITHER shows an explicit bind of the loader's normalized RETURN
  back into `config.executor`. Write-back → review works (P1 drift); no write-back →
  review native mis-branches (P0). Runtime-interpreter behavior, not derivable from
  YAML text. HIGHEST-VALUE follow-up (one native review trace, or read the YAML
  runner's `loader:` handling).
- **`buildExecutorDispatchEnv()` existence/location:** referenced as the ENV-LEAK
  fix source but I did not locate its definition this session — grep before
  implementing.
- **Parent spec.md §2 "Option B verbatim" text** and **DOC-STALENESS metadata:**
  carried from iteration 1, not re-read this session. The CODE side of C-03 is
  re-confirmed; the contract side relies on iter-1.
- **`fanout-run.cjs` worker return `salvage` field on failure:** if C-02 throws on
  non-zero exit, ensure the `salvage` result is still surfaced (attach to the error
  or a failed-result shape) — an implementation detail to verify during the fix.

## Verdict

**CONDITIONAL — NOT a clean pass. Confirms iteration 1 and ESCALATES U-01.**

Two source-confirmed P0s stand re-verified this session: **C-01** (CLI fan-out is
fully serial; `concurrency` inert — defeats success-criterion #1) and **C-02**
(non-zero exit/timeout reported as success → false-PASS review verdict via the
never-fail merge).

**Question 1 RESOLVED (correcting my own mid-session draft):** the deciding evidence
is the FIELD-NAME mismatch, not a missing normalization step. Both YAMLs declare the
SAME loader (`parseExecutorConfig`, research:584 / review:700) and both branch directly
on a dotted predicate. Research reads `config.executor.type` — the exact field its
command doc writes — so it is self-consistent at the raw-config level regardless of the
loader. Review reads `config.executor.kind` — a field the command doc does NOT write
(docs write `.type`: `start-review-loop.md:141`,`:157`,`:164`) — and NEITHER YAML shows
the loader's normalized `{kind}` return being written BACK into `config.executor`. So a
plain native review run mis-branches IFF the `resolve_executor.loader` declaration does
not write back. **I pin U-01 = P1 (latent P0)** — REFINING DOWN from my draft's flat P0
because the write-back is a runtime-interpreter behavior I cannot prove from the YAML
text; elevate to P0 if a trace shows no write-back. Review is the broken side, exactly
as iteration 1 hypothesized.

**Question 2 RESOLVED:** XOR is NOT enforced on EITHER layer — the schema
`fanoutConfigSchema`/`executorConfigSchema` `.strip()` silently drops the sibling key
(`executor-config.ts:127`,`:140`), AND the command "fan-out default policy"
(`start-review-loop.md:116`,`:152-155`) is PROSE GUIDANCE to the setup AI, not a runtime
guard. A both-present config silently drops one side. P1; root-validator fix needed,
no decision required.

All other iteration-1 findings (C-03, C-04, N-01, N-04, ENV-LEAK, TIMEOUT-ORPHANS,
MERGE-DROP, MERGE-DEDUP, BOUNDS, DOC-STALENESS) are AGREED with line citations; ZERO
are disagreed; two (U-01, XOR) are REFINED with resolutions. The 72-green suite still
cannot catch C-01/C-02 (mock-injected gated worker, never the real spawn) and the
salvage test still enshrines the unpadded name — the report's "green tests hid a real
P0" thesis holds and is understated (two confirmed P0s plus a latent-P0 review-side
U-01). Recommended remediation order: C-02 → C-01(+TIMEOUT-ORPHANS) → U-01 → the P1
set → P2 polish.
