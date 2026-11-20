# Deep Review Strategy - Session Tracking

## 1. REVIEW CHARTER

- **Target**: `.skilled/skills/system-skill-advisor`, `.skilled/bin/system-skill-advisor-launcher.cjs`, `.skilled/bin/launcher-heartbeat-watchdog.vitest.ts`, `.skilled/bin/launcher-threshold-env.vitest.ts`, `.skilled/commands/doctor/assets`, `.skilled/commands/create/assets`, `.skilled/changelog/skilled/v4.1.0.0.md`, `.skilled/skills/sk-doc/hub-router.json`, `.skilled/skills/sk-doc/sk-create-readme/SKILL.md`, `.skilled/hooks/session-handover/pi/session-handover.test.ts`, `.opencode/plugins/tests/system-skill-advisor.test.cjs`, `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md`, `.github/workflows/skill-advisor-stress.yml`, `.env.example`, `INSTALL-SKILLED.md`, `README.md`, `specs/**/decision-record.md`
- **Target type**: files
- **Dimensions**: correctness, security, traceability, maintainability
- **Stop conditions**: convergence at weighted ratio 0.10, or 16 iterations, or the frontier draining
- **Success criteria**: every commit in the review focus read at HEAD; shipped-behavior defects reported with file:line evidence; test changes that match new text while leaving behavior unchecked reported as findings

## 2. TOPIC

Review of the Ollama-lane honesty and closeout commits: background vector refresh, semantic lane coverage gate, launcher liveness, `OLLAMA_*` passthrough, generation counter, status and doctor coverage, plus the test/routing follow-ups and the ten `docs(specs)` commits that wrote 231 ended-session answers into `decision-record.md` files.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS

- Style and formatting preferences in the reviewed files.
- Re-litigating the frozen decisions D1-D7 in the owning packet's goal.md.
- Changing `system-spec-kit/shared/embeddings` (decision D4 forbids it).
- Running the repository's test suites, `validate.sh`, or `generate-context.js` from this lineage.

---

## 5. STOP CONDITIONS

- Weighted new-finding ratio below 0.10 with all dimensions covered and the frontier drained.
- 16 iterations reached.
- Three consecutive failed iterations.

---

<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability

<!-- /ANCHOR:completed-dimensions -->
<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 3
- P2 (Suggestions): 9
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED
- Reading the commit diff first and then the HEAD file: the diff showed which lines the commit touched, and the HEAD read showed the surrounding contract the change broke (iteration 1).
- Reading a feature-catalog page sentence by sentence and grepping each shipped-behavior claim against the code: six of seven claims on the new refresh page held, and the one that did not was a guarantee the single-flight guard contradicts (iteration 4).
- Tracing a test change to the source it asserts against instead of judging the diff: both halves of `0390556ee2b` resolve to the same absolute path or the same emitted variable as the hook, so the change is a legitimate fix rather than a text-matching dodge (iteration 4).
- Reading the vitest config to scope a completion criterion: `vitest.config.bin.ts` includes only `bin/**/*.vitest.ts`, which settles whether the `[x]` on criterion 1 is overstated (iteration 4).
- Asking of each follow-up fix whether it leaves a second copy of the value it corrected: that question found both iteration-5 findings, the surviving `ROUTER.md` vocabulary and the hardcoded lane weight (iteration 5).
- Reading the registry beside the test literal: `lane-registry.ts:13` carries both `defaultWeight: 0` and `defaultShadowWeight: 0.05`, which explains why the stress test held `0.05` and why the literal was wrong rather than merely stale (iteration 5).

---

## 9. WHAT FAILED
- Grepping for a production caller of `scoreAdvisorPrompt` outside the daemon: the CLI's local fallback is the checked-in Python scorer, so the read-write-handle finding could not be raised to P0 (iteration 1).
- Trying to reproduce the summary's "hooks vitest tree passes 509 of 509" and "plugin suites 595 of 595": the review may not execute the repository's test tooling from inside the lineage write surface, so those claims stay unverified evidence rather than a pass (iteration 4).
- Treating the ten `docs(specs)` commits' "decisions only" message as a claim to test: `memoryNameHistory` is a slug-collision history, not a file pointer, so the absent memory files are expected and the message-versus-diff gap is not shipped behavior (iteration 4).
- Trying to drain the frontier: the two bound nodes F-1-001 and F-1-004 were worked in iterations 1, 2 and 4, but this executor is forbidden from writing the node store or a coverage surface, so `searchDebtCount` stays 2 and the "frontier drained" half of the STOP condition cannot be met from here (iteration 5). Recorded as a blocked stop for the merge.

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **`0390556ee2b` loosened a test to hide a behavior change.** Both halves were traced to the current source and both still assert the behavior; see Edge Cases. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **`0390556ee2b` loosened a test to hide a behavior change.** Both halves were traced to the current source and both still assert the behavior; see Edge Cases.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`0390556ee2b` loosened a test to hide a behavior change.** Both halves were traced to the current source and both still assert the behavior; see Edge Cases.

### **`571575632a4` broke `security.md` routing.** The `security.md` keyword survives in `hub-router.json`. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **`571575632a4` broke `security.md` routing.** The `security.md` keyword survives in `hub-router.json`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`571575632a4` broke `security.md` routing.** The `security.md` keyword survives in `hub-router.json`.

### **`571575632a4` left the two compiled manifests out of step.** Both copies carry the same `effectivePolicyHash` and generation. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **`571575632a4` left the two compiled manifests out of step.** Both copies carry the same `effectivePolicyHash` and generation.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`571575632a4` left the two compiled manifests out of step.** Both copies carry the same `effectivePolicyHash` and generation.

### **`86038dfba80` changed a shipped default.** It changed a test literal; the registry default at `lane-registry.ts:13` is unchanged. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **`86038dfba80` changed a shipped default.** It changed a test literal; the registry default at `lane-registry.ts:13` is unchanged.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`86038dfba80` changed a shipped default.** It changed a test literal; the registry default at `lane-registry.ts:13` is unchanged.

### **`advisor_status` can create the database.** Ruled out: the read-only handle uses `fileMustExist: true` and the absent-file branch returns before opening (`advisor-status.ts:168-174`). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **`advisor_status` can create the database.** Ruled out: the read-only handle uses `fileMustExist: true` and the absent-file branch returns before opening (`advisor-status.ts:168-174`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`advisor_status` can create the database.** Ruled out: the read-only handle uses `fileMustExist: true` and the absent-file branch returns before opening (`advisor-status.ts:168-174`).

### **`c74042fd559` weakened the Vibe document assertion.** The case still asserts that a tracked command's document is found; only the fixture changed. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **`c74042fd559` weakened the Vibe document assertion.** The case still asserts that a tracked command's document is found; only the fixture changed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`c74042fd559` weakened the Vibe document assertion.** The case still asserts that a tracked command's document is found; only the fixture changed.

### **`vitest.config.bin.ts` silently covers the failing Pi hook test.** It includes only `bin/**/*.vitest.ts`. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **`vitest.config.bin.ts` silently covers the failing Pi hook test.** It includes only `bin/**/*.vitest.ts`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`vitest.config.bin.ts` silently covers the failing Pi hook test.** It includes only `bin/**/*.vitest.ts`.

### **A concurrent caller receives a different result than the first caller.** Ruled out: both callers await the same promise object (`skill-graph-db.ts:1443`). -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **A concurrent caller receives a different result than the first caller.** Ruled out: both callers await the same promise object (`skill-graph-db.ts:1443`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A concurrent caller receives a different result than the first caller.** Ruled out: both callers await the same promise object (`skill-graph-db.ts:1443`).

### **The `docs(specs)` commits wrote answers into the wrong packets.** `packet_pointer` matches the file path in all 73 changed `decision-record.md` files. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **The `docs(specs)` commits wrote answers into the wrong packets.** `packet_pointer` matches the file path in all 73 changed `decision-record.md` files.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The `docs(specs)` commits wrote answers into the wrong packets.** `packet_pointer` matches the file path in all 73 changed `decision-record.md` files.

### **The ablation page's numbers disagree with the packet's own record.** Both cite 156 with the lane against 161 without, 7 flips, no new none-gold fire, default stays 0. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **The ablation page's numbers disagree with the packet's own record.** Both cite 156 with the lane against 161 without, 7 flips, no new none-gold fire, default stays 0.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The ablation page's numbers disagree with the packet's own record.** Both cite 156 with the lane against 161 without, 7 flips, no new none-gold fire, default stays 0.

### **The catalog index overstates the feature count.** Counted the tree: 49 pages, per-group 8/8/5/5/10/10/3, summing to 49. The claim holds. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **The catalog index overstates the feature count.** Counted the tree: 49 pages, per-group 8/8/5/5/10/10/3, summing to 49. The claim holds.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The catalog index overstates the feature count.** Counted the tree: 49 pages, per-group 8/8/5/5/10/10/3, summing to 49. The claim holds.

### **The changelog shape test has no independent coverage of the word ceiling.** `test_a_sentence_fails_one_word_past_22` fails a 23-word sentence and passes a 22-word one against a synthetic fixture, and `test_the_average_sentence_fails_past_10_words` covers the mean. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **The changelog shape test has no independent coverage of the word ceiling.** `test_a_sentence_fails_one_word_past_22` fails a 23-word sentence and passes a 22-word one against a synthetic fixture, and `test_the_average_sentence_fails_past_10_words` covers the mean.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The changelog shape test has no independent coverage of the word ceiling.** `test_a_sentence_fails_one_word_past_22` fails a 23-word sentence and passes a 22-word one against a synthetic fixture, and `test_the_average_sentence_fails_past_10_words` covers the mean.

### **The coverage gate scores a stale vector.** Ruled out: `embeddingCoverage().complete` is false whenever any row is stale or missing, and the lane returns `[]` in that case (`semantic-shadow.ts:391-395`). -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **The coverage gate scores a stale vector.** Ruled out: `embeddingCoverage().complete` is false whenever any row is stale or missing, and the lane returns `[]` in that case (`semantic-shadow.ts:391-395`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The coverage gate scores a stale vector.** Ruled out: `embeddingCoverage().complete` is false whenever any row is stale or missing, and the lane returns `[]` in that case (`semantic-shadow.ts:391-395`).

### **The create-command workflow can skip the bridge check.** Ruled out: the check is a validation row that fails the step on a non-zero exit (`create-command-auto.yaml:483`). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **The create-command workflow can skip the bridge check.** Ruled out: the check is a validation row that fails the step on a non-zero exit (`create-command-auto.yaml:483`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The create-command workflow can skip the bridge check.** Ruled out: the check is a validation row that fails the step on a non-zero exit (`create-command-auto.yaml:483`).

### **The database-directory pin can be bypassed by an empty value.** Ruled out: the filter keeps only `typeof value === 'string'` entries and the pin applies whenever the filtered value is `undefined`, which an empty string is not -- an empty string is forwarded and `resolvedAdvisorDbDir` then resolves it to the process cwd, which is the documented sandbox behavior. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **The database-directory pin can be bypassed by an empty value.** Ruled out: the filter keeps only `typeof value === 'string'` entries and the pin applies whenever the filtered value is `undefined`, which an empty string is not -- an empty string is forwarded and `resolvedAdvisorDbDir` then resolves it to the process cwd, which is the documented sandbox behavior.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The database-directory pin can be bypassed by an empty value.** Ruled out: the filter keeps only `typeof value === 'string'` entries and the pin applies whenever the filtered value is `undefined`, which an empty string is not -- an empty string is forwarded and `resolvedAdvisorDbDir` then resolves it to the process cwd, which is the documented sandbox behavior.

### **The doctor can report FAIL because the lane weight is zero.** Ruled out: both the setup asset and the presentation forbid it (`doctor-setup.yaml:60`, `doctor-skill-advisor-presentation.txt:304`). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **The doctor can report FAIL because the lane weight is zero.** Ruled out: both the setup asset and the presentation forbid it (`doctor-setup.yaml:60`, `doctor-skill-advisor-presentation.txt:304`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The doctor can report FAIL because the lane weight is zero.** Ruled out: both the setup asset and the presentation forbid it (`doctor-setup.yaml:60`, `doctor-skill-advisor-presentation.txt:304`).

### **The doctor embedder leg can report PASS on incomplete coverage.** Ruled out: it requires `coverageComplete` true and `backend.state` reachable (`doctor-setup.yaml:60`). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **The doctor embedder leg can report PASS on incomplete coverage.** Ruled out: it requires `coverageComplete` true and `backend.state` reachable (`doctor-setup.yaml:60`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The doctor embedder leg can report PASS on incomplete coverage.** Ruled out: it requires `coverageComplete` true and `backend.state` reachable (`doctor-setup.yaml:60`).

### **The generation counter can be redirected outside the workspace without an explicit override.** Ruled out: the anchored resolver joins the repo root with a fixed relative path (`generation.ts:70`). -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **The generation counter can be redirected outside the workspace without an explicit override.** Ruled out: the anchored resolver joins the repo root with a fixed relative path (`generation.ts:70`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The generation counter can be redirected outside the workspace without an explicit override.** Ruled out: the anchored resolver joins the repo root with a fixed relative path (`generation.ts:70`).

### **The lane's `no_skill_vectors` branch scores with an empty vector set.** Ruled out: with no cached vectors every `cachedVectors.get` returns undefined and the map step filters every row out. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **The lane's `no_skill_vectors` branch scores with an empty vector set.** Ruled out: with no cached vectors every `cachedVectors.get` returns undefined and the map step filters every row out.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The lane's `no_skill_vectors` branch scores with an empty vector set.** Ruled out: with no cached vectors every `cachedVectors.get` returns undefined and the map step filters every row out.

### **The launcher can be made to forward an arbitrary ambient variable.** Ruled out: the filter is `CHILD_ENV_ALLOWLIST.has(key)` with exact keys only (`system-skill-advisor-launcher.cjs:320-322`). -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **The launcher can be made to forward an arbitrary ambient variable.** Ruled out: the filter is `CHILD_ENV_ALLOWLIST.has(key)` with exact keys only (`system-skill-advisor-launcher.cjs:320-322`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The launcher can be made to forward an arbitrary ambient variable.** Ruled out: the filter is `CHILD_ENV_ALLOWLIST.has(key)` with exact keys only (`system-skill-advisor-launcher.cjs:320-322`).

### **The new refresh page names test files that do not exist.** Both `refresh-in-background.vitest.ts` and `embedding-coverage.vitest.ts` exist at the stated paths. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **The new refresh page names test files that do not exist.** Both `refresh-in-background.vitest.ts` and `embedding-coverage.vitest.ts` exist at the stated paths.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The new refresh page names test files that do not exist.** Both `refresh-in-background.vitest.ts` and `embedding-coverage.vitest.ts` exist at the stated paths.

### **The refresh can leak the single-flight slot.** Ruled out: the `finally` block clears `backgroundEmbeddingRefresh` only when the slot still holds this refresh (`skill-graph-db.ts:1481-1485`), so a later refresh is never cleared by an earlier one. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **The refresh can leak the single-flight slot.** Ruled out: the `finally` block clears `backgroundEmbeddingRefresh` only when the slot still holds this refresh (`skill-graph-db.ts:1481-1485`), so a later refresh is never cleared by an earlier one.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The refresh can leak the single-flight slot.** Ruled out: the `finally` block clears `backgroundEmbeddingRefresh` only when the slot still holds this refresh (`skill-graph-db.ts:1481-1485`), so a later refresh is never cleared by an earlier one.

### **The refresh can overlap a watcher reindex's database writes.** Ruled out: `indexSkillMetadata` is synchronous and `defaultReindex` calls it before firing the refresh, and better-sqlite3 serializes writes inside the process. The overlap that remains is the dropped reindex, reported as P1-001. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **The refresh can overlap a watcher reindex's database writes.** Ruled out: `indexSkillMetadata` is synchronous and `defaultReindex` calls it before firing the refresh, and better-sqlite3 serializes writes inside the process. The overlap that remains is the dropped reindex, reported as P1-001.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The refresh can overlap a watcher reindex's database writes.** Ruled out: `indexSkillMetadata` is synchronous and `defaultReindex` calls it before firing the refresh, and better-sqlite3 serializes writes inside the process. The overlap that remains is the dropped reindex, reported as P1-001.

### **The status schema rejects the new fields.** Ruled out: `stale`, `missing` and `coverageComplete` are declared optional on the strict schema (`advisor-tool-schemas.ts:254-270`). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **The status schema rejects the new fields.** Ruled out: `stale`, `missing` and `coverageComplete` are declared optional on the strict schema (`advisor-tool-schemas.ts:254-270`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The status schema rejects the new fields.** Ruled out: `stale`, `missing` and `coverageComplete` are declared optional on the strict schema (`advisor-tool-schemas.ts:254-270`).

### **The stress workflow can embed against a live Ollama.** Ruled out: it sets the exact `off` value the check accepts (`skill-advisor-stress.yml:49`). -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **The stress workflow can embed against a live Ollama.** Ruled out: it sets the exact `off` value the check accepts (`skill-advisor-stress.yml:49`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The stress workflow can embed against a live Ollama.** Ruled out: it sets the exact `off` value the check accepts (`skill-advisor-stress.yml:49`).

### **The watchdog can kill a healthy daemon during a slow startup refresh.** Ruled out: the heartbeat is written before the refresh is fired (`liveness.ts:136`, `advisor-server.ts:391`). -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **The watchdog can kill a healthy daemon during a slow startup refresh.** Ruled out: the heartbeat is written before the refresh is fired (`liveness.ts:136`, `advisor-server.ts:391`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The watchdog can kill a healthy daemon during a slow startup refresh.** Ruled out: the heartbeat is written before the refresh is fired (`liveness.ts:136`, `advisor-server.ts:391`).

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS
- The refresh can overlap a watcher reindex's database writes: `indexSkillMetadata` is synchronous and runs before the refresh is fired, and better-sqlite3 serializes writes in-process (iteration 1, evidence: `lib/daemon/watcher.ts:494`).
- The refresh can leak the single-flight slot: the `finally` block clears the slot only when it still holds this refresh (iteration 1, evidence: `lib/skill-graph/skill-graph-db.ts:1481`).
- The coverage gate scores a stale vector: `embeddingCoverage().complete` is false whenever any row is stale or missing and the lane returns `[]` (iteration 1, evidence: `lib/scorer/lanes/semantic-shadow.ts:391`).
- A concurrent caller receives a different result than the first caller: both await the same promise object (iteration 1, evidence: `lib/skill-graph/skill-graph-db.ts:1443`).
- The lane's `no_skill_vectors` branch scores with an empty vector set: every `cachedVectors.get` returns undefined and the map step filters every row out (iteration 1, evidence: `lib/scorer/lanes/semantic-shadow.ts:389`).
- The catalog index overstates the feature count: the tree holds 49 pages and the per-group counts 8/8/5/5/10/10/3 sum to 49 (iteration 4, evidence: `feature-catalog.md:20`).
- The new refresh page names test files that do not exist: both `refresh-in-background.vitest.ts` and `embedding-coverage.vitest.ts` exist at the stated paths (iteration 4, evidence: `background-vector-refresh.md:47`).
- The ablation page's numbers disagree with the packet's own record: both cite 156 with the lane against 161 without, 7 flips, no new none-gold fire, default stays 0 (iteration 4, evidence: `ablation.md:21`, `implementation-summary.md:113`).
- `0390556ee2b` loosened a test to hide a behavior change: `shellQuote` always single-quotes, the test's `fileURLToPath` resolves to the same absolute path as the hook's `path.join`, `CONTINUITY_WRITER` is asserted at `session-handover.test.ts:368`, and `user-prompt-submit.ts:535` observes the `additionalContext` it emits (iteration 4).
- The `docs(specs)` commits wrote answers into the wrong packets: `packet_pointer` matches the file path in all 73 changed `decision-record.md` files (iteration 4).
- `vitest.config.bin.ts` silently covers the failing Pi hook test: it includes only `bin/**/*.vitest.ts` (iteration 4, evidence: `vitest.config.bin.ts:7`).
- The changelog shape test has no independent coverage of the word ceiling: `test_a_sentence_fails_one_word_past_22` fails a 23-word sentence and passes a 22-word one against a synthetic fixture, and `test_the_average_sentence_fails_past_10_words` covers the mean (iteration 5, evidence: `test_check_changelog_shape.py:193-202`).
- `571575632a4` left the two compiled manifests out of step: both copies carry the same `effectivePolicyHash` `73c7a1c0` at generation 5 (iteration 5).
- `571575632a4` broke `security.md` routing: the `security.md` keyword survives in `hub-router.json:255` (iteration 5).
- `c74042fd559` weakened the Vibe document assertion: the case still asserts that a tracked command's document is found; only the fixture changed to `/doctor:setup` (iteration 5).
- `86038dfba80` changed a shipped default: it changed a test literal, and the registry default at `lane-registry.ts:13` is unchanged at `defaultWeight: 0` (iteration 5).

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Frontier node F-1-001 (depth 1, scope .skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts, .skilled/skills/system-skill-advisor/runtime/advisor-server.ts, .skilled/skills/system-skill-advisor/runtime/lib/daemon/watcher.ts, .skilled/skills/system-skill-advisor/runtime/tests/skill-graph/refresh-in-background.vitest.ts): Vector refresh lifecycle: is the background refresh single-flight, can it overlap a watcher reindex or a second refresh, does an Ollama outage mid-refresh keep the old vectors, and can a refresh block, crash or leak in the daemon? - review the security dimension

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- **Target pointers**: `.skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts` (`embeddingCoverage`, `refreshEmbeddingsInBackground`, `refreshSkillEmbeddingsViaAdapter`), `.skilled/skills/system-skill-advisor/runtime/lib/daemon/watcher.ts` (`defaultReindex`), `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts` (coverage gate), `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-status.ts` (`readSemanticLaneHealth`), `.skilled/bin/system-skill-advisor-launcher.cjs` (`CHILD_ENV_ALLOWLIST`, `heartbeatVerdict`), `.skilled/skills/system-skill-advisor/runtime/lib/freshness/generation.ts` (`getSkillGraphGenerationPath`).
- **Behavior claims**: the daemon refreshes missing and stale vectors in the background at any lane weight; an Ollama outage keeps the old vector; the semantic lane scores only with full current coverage; status reports current/stale/missing; the launcher forwards `OLLAMA_*` and pins the database directory; the generation counter stays shared for a pinned daemon.
- **Reuse and conventions**: `refreshSkillEmbeddings` is the existing full-refresh entry point; `hasActiveEmbedderPointer`/`getActiveEmbedder` are the existing pointer readers; `probeOllamaModel`/`resolveOllamaBaseUrl` are the existing Ollama probes.
- **Review risks and gaps**: no `resource-map.md` in the packet, so the Resource Map Coverage Gate is skipped. The review target is a file list, so `specs/**/decision-record.md` is read as a glob.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | partial | 1 | The feature-catalog page describes the background refresh; the single-flight drop and the read-write handle are not described there. |
| `checklist_evidence` | core | notApplicable | 1 | The review target is a file list, not a spec folder, so there is no `checklist.md`. |
| `skill_agent` | overlay | pending | - | - |
| `agent_cross_runtime` | overlay | pending | - | - |
| `feature_catalog_code` | overlay | pending | - | - |
| `playbook_capability` | overlay | pending | - | - |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 16
- Convergence threshold: 0.1
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-vibe-1-1795172940208-84a42n, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 24 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: files
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-11-20T11:10:31Z
<!-- MACHINE-OWNED: END -->
