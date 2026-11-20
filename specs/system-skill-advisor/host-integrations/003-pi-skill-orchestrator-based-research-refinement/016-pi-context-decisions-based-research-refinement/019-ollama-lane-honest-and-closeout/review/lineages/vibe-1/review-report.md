# Deep Review Report

- Packet: `specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/019-ollama-lane-honest-and-closeout`
- Lineage: `vibe-1` (fan-out, detached)
- Session: `fanout-vibe-1-1795172940208-84a42n`, generation 1, lineageMode `new`
- Executor: `cli-mistral-vibe model=deepseek-flash`
- Mode: review, stopPolicy convergence, maxIterations 16, convergenceThreshold 0.10, depthMode expansive
- Iterations run: 5
- Verdict: **CONDITIONAL**

---

## 1. Executive Summary

The change set is sound in its shipped behavior and does not contain a P0. The background vector refresh, the semantic-lane coverage gate, the launcher liveness and `OLLAMA_*` forwarding, the generation counter, the doctor coverage rule and the create-command bridge gate all behave as the packet claims. Twelve findings remain open: three P1 and nine P2.

The three P1s share one shape: a surface reports a state the scoring path does not honor. `R1-P1-001` is a dropped reindex behind the refresh's single-flight guard. `R1-P1-002` is a read-write database handle reached from the recommend path. `R2-P1-001` is `laneEnabled` reporting `true` while `semantic-shadow.ts:392` refuses to score on incomplete coverage. Each is a small, local fix.

The nine P2s are two kinds. Five are operator-facing claims that overstate what the code does (`R1-P2-001`, `R4-P2-001`, `R4-P2-002`) or a switch that fails open (`R3-P2-001`). Four are duplicated sources of truth that already caused one red CI job (`R5-P2-002`) or will drift silently (`R5-P2-001`, `R1-P2-002`, `R2-P2-001`).

The packet's own completion criteria hold up under reading. The one criterion whose scope could have been overstated — `npx vitest run` from `.skilled` with `--config vitest.config.bin.ts` — is honestly scoped, because that config includes only `bin/**/*.vitest.ts` and therefore does not claim the Pi hook test.

## 2. Review Scope

The declared target is a file list (`review_target_type: files`), read at HEAD, restricted to what the named commits changed:

| Group | Commits | Surfaces |
|---|---|---|
| Feature | `31ffd18beab`, `1ccbb3283c6`, `dc3979eb451` | background vector refresh, semantic lane coverage gate, launcher liveness, `OLLAMA_*` passthrough, generation counter, status and doctor coverage |
| Follow-up | `86038dfba80`, `c74042fd559`, `571575632a4`, `5c91b2f3f5d`, `0390556ee2b` | stress weight, Vibe document fixture, sk-doc hub vocabulary, changelog shape, two stale tests |
| Docs | `2f5fe41bb9e`..`aaaff7dd9df` (ten commits) | 231 ended-session answers into 73 `decision-record.md` files |

Dimensions reviewed: correctness, security, traceability, maintainability. Frontier nodes bound: F-1-001 (vector refresh lifecycle) and F-1-004 (status and doctor surfaces).

Out of scope by the scope lock: the repository's test tooling was not executed, so every test-run claim in the packet is recorded as unverified evidence rather than a pass.

## 3. Findings by Severity

### P0 — Blockers (0)

None.

### P1 — Required (3)

1. **`R1-P1-001` — A reindex that lands mid-refresh is dropped, so a new skill stays vectorless.** `skill-graph-db.ts:1437-1439` returns the in-flight promise instead of queueing a follow-up pass; `watcher.ts:494-496` fires the refresh after each reindex. Case: a skill is added while a startup refresh is embedding the command corpus; the watcher's refresh returns the running promise and the new skill has no vector until the next restart.
2. **`R1-P1-002` — `embeddingCoverage()` falls back to `getDb()`, a read-write handle, from the recommend path.** `skill-graph-db.ts:1326` contradicts `getDbReadOnly`'s documented invariant; `semantic-shadow.ts:391` is the caller. Confidence medium: the fallback only runs when no handle is passed, and the status path does pass one. Downgrade trigger recorded.
3. **`R2-P1-001` — `laneEnabled` ignores `coverageComplete`.** `advisor-status.ts:242` computes the field without the coverage term, while `semantic-shadow.ts:392-393` disables the lane and sets `disabledReason: 'incomplete_skill_vectors'` whenever coverage is incomplete. The envelope can therefore report `laneEnabled: true` beside `coverageComplete: false` while the lane contributes nothing. `advisor-status.vitest.ts:444-448` codifies the contradiction.

### P2 — Suggestions (9)

1. **`R1-P2-001`** — the Ollama-unavailable early return reports `failed: 0` (`skill-graph-db.ts:1503`), contradicting the module's own outage convention that reports every row as failed.
2. **`R1-P2-002`** — `embeddingCoverage` re-reads every `SKILL.md` (58 files) plus the command-bridges JSON on each scored prompt. The packet's own limitations section records this as "gate cost not measured", so it is a known and accepted cost at the shipped weight of 0.
3. **`R2-P2-001`** — no test seeds a stale or missing command vector, so `commandVectorCoverage.stale` and `.missing` are only ever asserted at zero.
4. **`R3-P2-001`** — `SYSTEM_SKILL_ADVISOR_EMBED_REFRESH` matches only the exact string `off` after lowercasing; `false`, `0` and `no` fail open. The catalog page's "case-insensitive" claim is accurate; the falsy spellings are the gap.
5. **`R3-P2-002`** — `OLLAMA_BASE_URL` is forwarded and used with no loopback check (`system-skill-advisor-launcher.cjs:185`), so the shared daemon ships the whole corpus to whatever host the first caller names. Decision D1 approves forwarding, not an unvalidated destination.
6. **`R4-P2-001`** — `background-vector-refresh.md:31` promises a refresh "after each reindex" that the single-flight guard does not provide. Documentation face of `R1-P1-001`.
7. **`R4-P2-002`** — `advisor-status.md:41` describes `laneEnabled` as "whether the semantic lane is enabled" while the field omits the coverage gate the page's next sentence describes. Documentation face of `R2-P1-001`.
8. **`R5-P2-001`** — `571575632a4` removed `security policy` from `hub-router.json` and `sk-create-readme/SKILL.md` but left two copies in `sk-create-readme/ROUTER.md:47,107`; no check compares that list with the router, so it drifts silently.
9. **`R5-P2-002`** — `mcp-diagnostics-stress.vitest.ts:75` hardcodes `semantic_shadow: 0` instead of deriving it from `lane-registry.ts:13`, and the literal it replaced was the lane's `defaultShadowWeight` (0.05), so the test conflated the two weights and kept the stress workflow red on every run until `86038dfba80`.

## 4. Dimension Coverage

| Dimension | Iteration | Status | Findings |
|---|---|---|---|
| correctness | 1 (F-1-001), 2 (F-1-004) | complete | 2 P1, 3 P2 |
| security | 3 | complete | 2 P2 |
| traceability | 4 | complete | 2 P2 |
| maintainability | 5 | complete | 2 P2 |

All four canonical dimensions have one pass. No configured custom dimension was declared.

## 5. Traceability Checks

| Protocol | Status | Evidence | Summary |
|---|---|---|---|
| `spec_code` | partial | `ENV-REFERENCE.md:394`, `skill-graph-db.ts:1445`; `ablation.md:21`, `implementation-summary.md:113` | The env reference matches the code's exact `off` value. The ablation page's 156/161/7-flip record matches both the runs 3-4 and runs 6-9 rows, and its fail branch matches decision D2. |
| `feature_catalog_code` | partial | `background-vector-refresh.md:31`, `advisor-status.md:41` | Six of seven shipped-behavior sentences on the new refresh page hold; the watcher guarantee does not. The status page's coverage and degradation sentences hold; its `laneEnabled` description does not. |
| `checklist_evidence` | notApplicable | none | The review target is a file list, so there is no `checklist.md`. |
| `skill_agent` | pass | `sk-create-readme/SKILL.md:28`, `hub-router.json:254` | The mode's keyword line and the hub router agree; the surviving disagreement is in `ROUTER.md`, which no check reads. |
| `catalog_inventory` | pass | `feature-catalog.md:20` | 49 features across 7 groups; the tree holds 49 pages and the per-group counts sum to 49. |
| `test_reference_integrity` | pass | `background-vector-refresh.md:47-48` | Both named test files exist. |
| `playbook_capability` | notApplicable | none | No playbook scenario covers the routing vocabulary or the stress diagnostics assertion. |

## 6. Integration Evidence

- `.skilled/commands/deep/review.md` and `.skilled/commands/deep/assets/deep-review.yaml` — the loop owner and workflow; this lineage ran their per-iteration steps inline as the dispatch required.
- `.skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs` — every state record went through the gateway; six ledger sequences were committed (config plus five iterations), each with exit 0 and a receipt.
- `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs` — run after every gateway append; it owns the registry, dashboard and strategy anchors.
- `.skilled/skills/sk-code/sk-code-review/SKILL.md` — the review doctrine entry file that supplies the P0/P1/P2 definitions used here.
- `.skilled/skills/system-skill-advisor/feature-catalog/` — the four pages the feature commits added or rewrote, each compared sentence by sentence with the code.
- `.skilled/bin/system-skill-advisor-launcher.cjs`, `.skilled/skills/system-skill-advisor/runtime/advisor-server.ts`, `lib/daemon/watcher.ts`, `lib/daemon/liveness.ts` — the daemon and launcher surfaces the feature commits changed.
- `.skilled/commands/doctor/assets/` — the two doctor assets and two presentation files that gate on `coverageComplete` and `backend.state`.
- `.skilled/commands/create/assets/` — the create-command bridge gate in the auto and confirm workflows.
- `.skilled/skills/sk-doc/hub-router.json`, `sk-create-readme/SKILL.md`, `sk-create-readme/ROUTER.md` — the routing vocabulary the follow-up commit corrected.
- `.skilled/hooks/session-handover/lib/nudge.cjs`, `pi/session-handover.test.ts`, `.opencode/plugins/tests/system-skill-advisor.test.cjs`, `.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts` — the two stale tests and the sources they assert against.
- `.skilled/vitest.config.bin.ts` — read to scope completion criterion 1.

## 7. Edge Cases and Ruled Out

### Edge cases

- **Commit message versus diff on the docs commits.** The ten `docs(specs)` commits describe themselves as decisions-only, yet `019-workflow-outcome-measure/description.json` moved `memorySequence` 0→2 and gained two `memoryNameHistory` entries. That field is a slug-collision history consumed by `workflow.ts:1807-1816`, not a file pointer, so the absent memory files are expected. A commit message is not shipped behavior.
- **Two CI rows in the summary describe different runs.** `implementation-summary.md:126` carries the historical row saying Hook Vitest Suites fails one Pi test, while `03c7fb56e47` added a later row saying both stale tests now pass. Both are dated records; a reader who stops at line 126 gets the stale state. Editorial.
- **Test-run claims are unverified.** The summary's "hooks vitest tree passes 509 of 509" and "plugin suites 595 of 595" were not reproduced, because this review may not execute the repository's test tooling from inside the lineage write surface.
- **`0390556ee2b` is a legitimate fix.** Both halves were traced to the source they assert against: `shellQuote` always single-quotes and the test's `fileURLToPath` resolves to the same absolute path as the hook's `path.join`; `user-prompt-submit.ts:535` observes the `additionalContext` it emits. Residual weakness: the OpenCode assertion's `[\s\S]*` span is unbounded, so it proves token order rather than that the observed value is the emitted one.
- **The changelog fix edits the artifact the test reads.** `test_check_changelog_shape.py:21` points `MODEL_ENTRY` at the live `v4.1.0.0.md`. That is circular on its face, but the 22-word ceiling has synthetic coverage at `test_a_sentence_fails_one_word_past_22`, so the model-entry assertion is supplementary.
- **The `ROUTER.md` duplicate is outside the declared target.** It is cited as the surviving duplicate that makes `571575632a4` incomplete, which is a finding about the change rather than a new review of that file.
- **The frontier could not be drained.** The two bound nodes were worked in iterations 1, 2 and 4, but this executor may not write the node store or a coverage surface, so `searchDebtCount` stays 2. Recorded as a blocked stop.

### Ruled out

- The refresh deletes stale vectors on outage or failure — it keeps them.
- `embeddingCoverage` counts a stale row as current — it requires matching `model_id` and `content_hash`.
- The coverage gate scores a stale vector — `complete` is false whenever any row is stale or missing.
- The refresh leaks its single-flight slot — the `finally` clears it only when it still holds this refresh.
- The refresh overlaps a watcher reindex's database writes — `indexSkillMetadata` is synchronous and runs before the refresh fires.
- The doctor can report FAIL because the lane weight is zero — both assets forbid it.
- The doctor embedder leg can report PASS on incomplete coverage — it requires `coverageComplete` true and `backend.state` reachable.
- The create-command workflow can skip the bridge check — it is a validation row that fails the step on a non-zero exit.
- The launcher can forward an arbitrary ambient variable — the filter is exact-key only.
- The generation counter can be redirected without an explicit override — the resolver joins the repo root with a fixed relative path.
- The watchdog can kill a healthy daemon during a slow startup refresh — the heartbeat is written before the refresh fires.
- The stress workflow can embed against a live Ollama — it sets the exact `off` value.
- The status schema rejects the new fields — `stale`, `missing` and `coverageComplete` are declared optional.
- The catalog index overstates the feature count — 49 pages, per-group counts sum to 49.
- The new refresh page names test files that do not exist — both exist.
- The ablation page's numbers disagree with the packet's record — both cite 156 against 161.
- `0390556ee2b` loosened a test to hide a behavior change — both halves still assert the behavior.
- The `docs(specs)` commits wrote answers into the wrong packets — `packet_pointer` matches in all 73 files.
- `vitest.config.bin.ts` silently covers the failing Pi hook test — it includes only `bin/**/*.vitest.ts`.
- The changelog shape test has no independent coverage of the word ceiling — synthetic tests cover both the max and the mean.
- `571575632a4` left the two compiled manifests out of step — both carry the same hash at generation 5.
- `571575632a4` broke `security.md` routing — the keyword survives.
- `c74042fd559` weakened the Vibe document assertion — only the fixture changed.
- `86038dfba80` changed a shipped default — it changed a test literal; the registry default is unchanged.

## 8. Convergence and Stop Decision

| Signal | Value |
|---|---|
| Iterations run | 5 of 16 |
| Weighted new-finding ratio, iteration 5 | 0.08 (below the 0.10 threshold) |
| Convergence score | 0.92 |
| Dimensions covered | 4 of 4 |
| Frontier drained | no — `searchDebtCount` 2 |
| Consecutive failed iterations | 0 |
| Corruption count | 0 |

Stop reason: the weighted new-finding ratio fell below 0.10 with all four dimensions covered, so further passes would restate the twelve open findings rather than open new directions. The "frontier drained" half of the STOP condition is not met and cannot be met from this executor, which may not write the node store or a coverage surface. That is a blocked stop, not a pass, and the merge should read it as such.

Verdict mapping over the findings active at the final iteration: no active P0, three active P1, so **CONDITIONAL**. Carrying a finding forward does not downgrade it; the three P1s were raised in iterations 1 and 2 and remain active.

## 9. Planning Packet

### Fix order

| Order | Finding | Surface | Why this order |
|---|---|---|---|
| 1 | `R2-P1-001` | `handlers/advisor-status.ts:242` | One expression change plus the test at `advisor-status.vitest.ts:444-448`; it makes the status envelope honest for every other fix's verification. |
| 2 | `R1-P1-001` | `lib/skill-graph/skill-graph-db.ts:1437-1439` | Queue a follow-up pass instead of returning the in-flight promise; also closes `R4-P2-001` if the page is left as written. |
| 3 | `R1-P1-002` | `lib/skill-graph/skill-graph-db.ts:1326` | Pass the read-only handle through, or make the fallback explicit; the status path already does the right thing. |
| 4 | `R3-P2-002` | `bin/system-skill-advisor-launcher.cjs:185` | Add a loopback check or document the destination as trusted; decision D1 approves forwarding, not an unvalidated host. |
| 5 | `R3-P2-001` | `lib/skill-graph/skill-graph-db.ts:1445` | Accept the falsy spellings, or narrow the catalog page's claim. |
| 6 | `R5-P2-002` | `stress-test/skill-advisor/mcp-diagnostics-stress.vitest.ts:75` | Import `lane-registry.ts` and derive the weight; this is the fix that stops the stress workflow going red again. |
| 7 | `R5-P2-001` | `sk-create-readme/ROUTER.md:47,107` | Remove the two surviving copies, or add a check that compares the list with `hub-router.json`. |
| 8 | `R4-P2-002` | `cli-surface/advisor-status.md:41` | Add the coverage caveat to the field description; closes with fix 1. |
| 9 | `R1-P2-001` | `lib/skill-graph/skill-graph-db.ts:1503` | Report the row count as failed, matching the adapter-unavailable branch. |
| 10 | `R2-P2-001` | `tests/handlers/advisor-status.vitest.ts` | Seed a stale and a missing command vector. |
| 11 | `R1-P2-002` | `lib/skill-graph/skill-graph-db.ts` | Cache the coverage inputs, or leave it as the packet's recorded limitation at weight 0. |

### Acceptance checks

- `advisor_status --include-semantic-health true` never returns `laneEnabled: true` beside `coverageComplete: false`.
- A skill added during an in-flight refresh has a current vector within one refresh cycle.
- The recommend path never opens a read-write handle.
- `mcp-diagnostics-stress.vitest.ts` derives every lane weight from `lane-registry.ts`.
- `grep -c "security policy" .skilled/skills/sk-doc/sk-create-readme/ROUTER.md` returns 0, or a check fails when it does not.
- `npx vitest run` exits 0 from `.skilled/skills/system-skill-advisor/runtime` and from `.skilled` with `--config vitest.config.bin.ts`.

### Open questions for the operator

- Whether `OLLAMA_BASE_URL` should be restricted to loopback, or whether a remote destination is an intended deployment (`R3-P2-002`).
- Whether the coverage check's per-prompt cost should be cached before the lane weight is ever raised above 0 (`R1-P2-002`).
- Whether the two bound frontier nodes should be closed in the store by the merge, since this executor may not write it.

---

Review verdict: CONDITIONAL
