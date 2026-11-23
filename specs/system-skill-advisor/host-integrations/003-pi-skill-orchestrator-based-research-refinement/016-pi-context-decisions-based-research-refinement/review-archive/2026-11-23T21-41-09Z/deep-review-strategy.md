---
title: Deep Review Strategy Template
description: Runtime template copied to review/ during initialization to track review progress, dimension coverage, findings, and outcomes across iterations.
trigger_phrases:
  - "deep review strategy template"
  - "review dimension tracking"
  - "exhausted review approaches"
  - "review session tracking"
importance_tier: normal
contextType: planning
version: 1.11.1.0
---

# Deep Review Strategy - Advisor Logic, Generation 4

Live strategy for the five-pass Devin review of the system-skill-advisor logic.

## 1. OVERVIEW

### Purpose

Serves as the "persistent brain" for a deep review session. Records which dimensions remain, what was found (P0/P1/P2), what review approaches worked or failed, and where to focus next. Read by the orchestrator and agents at every iteration.

### Usage

- **Init:** Orchestrator copies this template to `{artifact_dir}/deep-review-strategy.md` and populates Topic, Review Dimensions, Known Context, and Review Boundaries from config and memory context.
- **Per iteration:** Agent reads Next Focus, reviews the assigned dimension/files, updates findings, marks dimensions complete, and sets new Next Focus.
- **Mutability:** Mutable, updated by both orchestrator and agents throughout the session.
- **Protection:** None (shared mutable state). Orchestrator validates consistency on resume.
- **Ownership:** Machine-managed metrics and coverage blocks are wrapped in explicit ownership markers. Human commentary and operator overrides live outside those markers.

---

## 2. TOPIC
The system-skill-advisor logic: 154 source files under `.skilled/skills/system-skill-advisor/runtime/` and `hooks/` (tests, fixtures, benches and dist excluded), about 50k lines, at HEAD `82af76f6754`. Target type: skill. Focus: The advisor's logic: runtime/ (lib, scorer, handlers, scripts including the Python fallback skill_advisor.py) and hooks/. Prose docs are out of scope unless code contradicts them.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS
- Prose docs (SKILL.md, references, feature catalog, playbook), except where code contradicts them.
- Test files as review targets; read them only to judge what the code is expected to do.
- The epic 016 packet docs: the three earlier generations reviewed those and are archived under `review-archive/`.
- No fixes: the review target is read-only.

---

## 5. STOP CONDITIONS
- Stop policy is max-iterations: all 5 iterations run; convergence is telemetry only.
- Halt on a P0 that needs operator attention before more passes.

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
- P1 (Required): 1
- P2 (Suggestions): 14
- Resolved: 2

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED
- Reading each guard beside the claim it enforces: every security finding this pass came from proving a documented default against the launcher that supplies it. (iteration 2)
- Separating the prompt-time door (the hook bridge) from the mutation door (the CLI), then asking which layer owns each rule. (iteration 2)
- Reading the Python state store beside the TypeScript store before claiming a parity gap; there was none. (iteration 2)
- Running the registries through each other: manifest against server tool definitions, descriptors against the contract tuple, catalog Source Files against the tree. Two of the three axes were clean and the third exposed drift a per-file read would not have caught. (iteration 3)
- Turning the carried P1's reachability question into a measurement: the live socket stat plus the shared transport's bind guards answered who can reach the daemon without arguing from code alone. (iteration 3)
- Using the feature catalog's own Validation and Tests table as the corrective evidence for its drifted overview path. (iteration 3)
- Reading fusion.ts whole, beside the constants it consumes and the consumers that render its flags: every finding came from a unit or invariant mismatch that a per-function read would have missed. (iteration 1)
- Probing the wired CLI first to capture the weighted-path baseline before judging any constant. (iteration 1)
- Reading the named consumer (render.ts) whenever a flag's validity was in question, to see which defects reach a reader. (iteration 1)
- Comparing each duplicated rule against whether a shared data file or a shared fixture already guards it: the prompt-policy sets and the directive store fell away, and only the unguarded copies became findings. (iteration 4)
- Letting a dead-surface claim be settled by one repository-wide identifier search instead of by reading the imports of possible consumers. (iteration 4)
- Measuring function spans mechanically before claiming an oversized pipeline, then arguing from statement order rather than line count. (iteration 4)
- Following the carried P1 to the launcher that actually supplies its environment instead of arguing from the in-target comment: the inversion is real and the comment's promise is what fails. (iteration 5)
- Loading the severity doctrine's reach calibration before deciding whether the only P1 could be downgraded: the doctrine's promise-failure rule kept it at P1 and overrode an impact-based instinct. (iteration 5)
- Reading the cache modules whole and following each cache key to its producer: the expected stale-cache defect was absent because the key carries the content signature, and the real defect was one directory over in the lock publication. (iteration 5)
- Asking which branches an existing stress suite pins before filing a race: the suite covers stale-token reclamation twice and never the empty-file window, which is what made the gap a finding. (iteration 5)
- Re-checking a doc citation by resolving it from the repo root and then by resolving it under `runtime/`: the difference separated a real prefix defect from a false positive. (iteration 5)

---

## 9. WHAT FAILED
- Treating the in-target comment as the whole trust story: the default it describes is set by a launcher outside the review target, so the comment alone would have misled the pass. (iteration 2)
- Deferring the socket peer-identity question because the client transport sits outside the target; the gap is real and now waits on the traceability pass. (iteration 2)
- Probing the RRF flag from the client process: a warm daemon answers from its own environment, so the probe could neither confirm nor deny the flag; code reading was the only route. (iteration 1)
- Whitespace word count as a stand-in for informativeness: it treats stop-word padding as content, which is the drift now recorded as R1-P2-004. (iteration 1)
- Trusting a module header's list of consumers: the contract-key header named two consumers that do not exist, so the stated invariant had to be re-derived from imports rather than read. (iteration 3)
- Treating a doc-cited test path as resolved because a same-named suite exists; the base path was wrong and only an existence probe caught it. (iteration 3)
- Corroborating the manifest parity through the compiled dist rather than the sources: useful, but the source-level suite is the primary evidence and dist can only weaken a probe. (iteration 3)
- Treating adapters that differ by host capability as duplication: only the Pi/Claude budget pair had to agree numerically, so the other receipt shapes were cost, not a finding. (iteration 4)
- Looking for the symbol the prior strategy named (`ADVISOR_INPUT_SCHEMAS`) instead of the symbol the tree actually holds (`AdvisorToolInputSchemas`); the search hit zero until the name was corrected. (iteration 4)
- Reading the Pi adapter's import block only after assuming it shared the directive-lifecycle module; it imports the extension API type and nothing else. (iteration 4)
- Beginning the severity comparison for the only P1 before loading the doctrine's reach-calibration section; the first pass reasoned toward a downgrade on impact equivalence and had to be re-decided against the loaded rule. (iteration 5)
- Trusting the dispatch's module list as a reachable budget: four of the seven named directories were only partly read, so the closing pass had to record a deferred slice instead of a covered one. (iteration 5)
- Expecting a stale-cache defect in `freshness.ts` on the strength of its 15-minute TTL, without first reading the cache key; the TTL is redundant, not stale, because the key carries the source signature. (iteration 5)

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### `AdvisorToolInputSchemas` having a consumer outside the skill: repository-wide search returns the definition only. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `AdvisorToolInputSchemas` having a consumer outside the skill: repository-wide search returns the definition only.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `AdvisorToolInputSchemas` having a consumer outside the skill: repository-wide search returns the definition only.

### `clearAdvisorSourceCache` being dead as a correctness defect: the only consumers are legacy tests, but the cache is key-correct, so the export is unused rather than broken. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: `clearAdvisorSourceCache` being dead as a correctness defect: the only consumers are legacy tests, but the cache is key-correct, so the export is unused rather than broken.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `clearAdvisorSourceCache` being dead as a correctness defect: the only consumers are legacy tests, but the cache is key-correct, so the export is unused rather than broken.

### A cache in the cross-skill-edge metadata loader: no cache exists (`metadata-loader.ts`, grep for `cache|mtime|Date.now` is empty). -- BLOCKED (iteration 5, 1 attempts)
- What was tried: A cache in the cross-skill-edge metadata loader: no cache exists (`metadata-loader.ts`, grep for `cache|mtime|Date.now` is empty).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A cache in the cross-skill-edge metadata loader: no cache exists (`metadata-loader.ts`, grep for `cache|mtime|Date.now` is empty).

### A clock mismatch inside the prompt cache: both ends default to `performance.now()` (`prompt-cache.ts:114`, `:145`), and no production caller overrides `nowMs`. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: A clock mismatch inside the prompt cache: both ends default to `performance.now()` (`prompt-cache.ts:114`, `:145`), and no production caller overrides `nowMs`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A clock mismatch inside the prompt cache: both ends default to `performance.now()` (`prompt-cache.ts:114`, `:145`), and no production caller overrides `nowMs`.

### A duplicate directive-lifecycle store in Python and TypeScript: the TypeScript store invokes the Python helper for every operation, so the pairing is a split implementation. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: A duplicate directive-lifecycle store in Python and TypeScript: the TypeScript store invokes the Python helper for every operation, so the pairing is a split implementation.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A duplicate directive-lifecycle store in Python and TypeScript: the TypeScript store invokes the Python helper for every operation, so the pairing is a split implementation.

### A missing descriptor for a manifest command (or vice versa): both registries hold the same nine names; `skill_graph_propagate_enhances` is present in the manifest and dispatched by `handleTool` (runtime/tools/skill-graph-tools.ts:138-140). -- BLOCKED (iteration 3, 1 attempts)
- What was tried: A missing descriptor for a manifest command (or vice versa): both registries hold the same nine names; `skill_graph_propagate_enhances` is present in the manifest and dispatched by `handleTool` (runtime/tools/skill-graph-tools.ts:138-140).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A missing descriptor for a manifest command (or vice versa): both registries hold the same nine names; `skill_graph_propagate_enhances` is present in the manifest and dispatched by `handleTool` (runtime/tools/skill-graph-tools.ts:138-140).

### A missing invalidation hook on the prompt cache: both `advisor-recommend.ts:528` and `skill-advisor-brief.ts:513` invalidate on signature change. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: A missing invalidation hook on the prompt cache: both `advisor-recommend.ts:528` and `skill-advisor-brief.ts:513` invalidate on signature change.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A missing invalidation hook on the prompt cache: both `advisor-recommend.ts:528` and `skill-advisor-brief.ts:513` invalidate on signature change.

### A partial rebuild when the doc harvest fails: the harvest runs after the node transaction but before `setMetadata('last_scan_timestamp')` and before any generation publish (`skill-graph-db.ts:1042-1068`, `advisor-server.ts:161-170`), so the failure leaves freshness stale rather than live. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: A partial rebuild when the doc harvest fails: the harvest runs after the node transaction but before `setMetadata('last_scan_timestamp')` and before any generation publish (`skill-graph-db.ts:1042-1068`, `advisor-server.ts:161-170`), so the failure leaves freshness stale rather than live.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A partial rebuild when the doc harvest fails: the harvest runs after the node transaction but before `setMetadata('last_scan_timestamp')` and before any generation publish (`skill-graph-db.ts:1042-1068`, `advisor-server.ts:161-170`), so the failure leaves freshness stale rather than live.

### A Python/TypeScript divergence in the shared fixture wiring: the fixtures are read by the Python suite at three sites rather than duplicated; execution of the parity suite remains deferred, not claimed clean. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: A Python/TypeScript divergence in the shared fixture wiring: the fixtures are read by the Python suite at three sites rather than duplicated; execution of the parity suite remains deferred, not claimed clean.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A Python/TypeScript divergence in the shared fixture wiring: the fixtures are read by the Python suite at three sites rather than duplicated; execution of the parity suite remains deferred, not claimed clean.

### A rebuild race through the *stale*-lock branch: that branch re-reads and compares the token before deleting (`generation.ts:174-185`), and the stress suite pins it twice. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: A rebuild race through the *stale*-lock branch: that branch re-reads and compares the token before deleting (`generation.ts:174-185`), and the stress suite pins it twice.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A rebuild race through the *stale*-lock branch: that branch re-reads and compares the token before deleting (`generation.ts:174-185`), and the stress suite pins it twice.

### A stale `getAdvisorFreshness` entry surviving a rebuild: the cache key includes `sourceSignature` and `generation` (`freshness.ts:386-391`), so a rebuild misses rather than hits. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: A stale `getAdvisorFreshness` entry surviving a rebuild: the cache key includes `sourceSignature` and `generation` (`freshness.ts:386-391`), so a rebuild misses rather than hits.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A stale `getAdvisorFreshness` entry surviving a rebuild: the cache key includes `sourceSignature` and `generation` (`freshness.ts:386-391`), so a rebuild misses rather than hits.

### A stale ambiguousWith list after the withhold passes: render.ts:603-607 falls back to the second passing entry when a named partner is absent, so the reader never sees a partner that is not offered. Not a finding, though R1-P2-003 covers the aggregate flag. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: A stale ambiguousWith list after the withhold passes: render.ts:603-607 falls back to the second passing entry when a named partner is absent, so the reader never sees a partner that is not offered. Not a finding, though R1-P2-003 covers the aggregate flag.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A stale ambiguousWith list after the withhold passes: render.ts:603-607 falls back to the second passing entry when a named partner is absent, so the reader never sees a partner that is not offered. Not a finding, though R1-P2-003 covers the aggregate flag.

### A workspace-controlled lease file redirecting a signal at another process: liveness only probes with signal 0 and treats EPERM as held (runtime/lib/daemon/lease.ts:248-262). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: A workspace-controlled lease file redirecting a signal at another process: liveness only probes with signal 0 and treats EPERM as held (runtime/lib/daemon/lease.ts:248-262).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A workspace-controlled lease file redirecting a signal at another process: liveness only probes with signal 0 and treats EPERM as held (runtime/lib/daemon/lease.ts:248-262).

### buildConflictMatchIndex seeding rawScore at 0 and taking Math.min: correct for negative demotion scores, which is the only shape the graph conflict lane emits (.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:256-267). -- BLOCKED (iteration 1, 1 attempts)
- What was tried: buildConflictMatchIndex seeding rawScore at 0 and taking Math.min: correct for negative demotion scores, which is the only shape the graph conflict lane emits (.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:256-267).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: buildConflictMatchIndex seeding rawScore at 0 and taking Math.min: correct for negative demotion scores, which is the only shape the graph conflict lane emits (.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:256-267).

### Catalog-wide source-file path loss: 229 of 230 resolve; the one miss is isolated to the overview citation (finding R3-P2-002). -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Catalog-wide source-file path loss: 229 of 230 resolve; the one miss is isolated to the overview citation (finding R3-P2-002).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Catalog-wide source-file path loss: 229 of 230 resolve; the one miss is isolated to the overview citation (finding R3-P2-002).

### Comment hygiene violations: zero artifact identifiers in comments under review. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Comment hygiene violations: zero artifact identifiers in comments under review.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Comment hygiene violations: zero artifact identifiers in comments under review.

### Cross-user reach to the daemon socket: the socket dir is 0700 and owner-checked, the socket node is 0600, and a non-owned or group/world-writable dir is refused at bind. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Cross-user reach to the daemon socket: the socket dir is 0700 and owner-checked, the socket node is 0600, and a non-owned or group/world-writable dir is refused at bind.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Cross-user reach to the daemon socket: the socket dir is 0700 and owner-checked, the socket node is 0600, and a non-owned or group/world-writable dir is refused at bind.

### Dead production code from the retired embedding lane: no embedding module, flag or branch remains outside one generated keyword row. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Dead production code from the retired embedding lane: no embedding module, flag or branch remains outside one generated keyword row.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Dead production code from the retired embedding lane: no embedding module, flag or branch remains outside one generated keyword row.

### dominantLane corrupting contribution order: it sorts a filtered copy, not the source array (runtime/lib/scorer/attribution.ts:8-10). -- BLOCKED (iteration 1, 1 attempts)
- What was tried: dominantLane corrupting contribution order: it sorts a filtered copy, not the source array (runtime/lib/scorer/attribution.ts:8-10).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: dominantLane corrupting contribution order: it sorts a filtered copy, not the source array (runtime/lib/scorer/attribution.ts:8-10).

### Executing the workspace-resolved `skill_advisor.py` at prompt time as a supply-chain escalation (runtime/lib/subprocess.ts:337-347): this repository vendors `.skilled`, so the workspace copy is the installed product, and executing it is the same trust decision as running any repo tool. Recorded, not filed. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Executing the workspace-resolved `skill_advisor.py` at prompt time as a supply-chain escalation (runtime/lib/subprocess.ts:337-347): this repository vendors `.skilled`, so the workspace copy is the installed product, and executing it is the same trust decision as running any repo tool. Recorded, not filed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Executing the workspace-resolved `skill_advisor.py` at prompt time as a supply-chain escalation (runtime/lib/subprocess.ts:337-347): this repository vendors `.skilled`, so the workspace copy is the installed product, and executing it is the same trust decision as running any repo tool. Recorded, not filed.

### Manifest/TOOL_DEFINITIONS drift: the dist probe reports IDENTICAL for all nine commands, and the source parity suite enforces name-set and schema equality (runtime/tests/skill-advisor-cli-manifest-parity.vitest.ts:15-30). -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Manifest/TOOL_DEFINITIONS drift: the dist probe reports IDENTICAL for all nine commands, and the source parity suite enforces name-set and schema equality (runtime/tests/skill-advisor-cli-manifest-parity.vitest.ts:15-30).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Manifest/TOOL_DEFINITIONS drift: the dist probe reports IDENTICAL for all nine commands, and the source parity suite enforces name-set and schema equality (runtime/tests/skill-advisor-cli-manifest-parity.vitest.ts:15-30).

### Prompt injection steering a mutation through a hook: every hook path goes through the CLI, whose prompt-time refusal is set by env the wrapper controls, so the prompt never reaches a mutating tool (hooks/lib/skill-advisor-cli-fallback.ts:207-212, runtime/skill-advisor-cli.ts:747-761). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Prompt injection steering a mutation through a hook: every hook path goes through the CLI, whose prompt-time refusal is set by env the wrapper controls, so the prompt never reaches a mutating tool (hooks/lib/skill-advisor-cli-fallback.ts:207-212, runtime/skill-advisor-cli.ts:747-761).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Prompt injection steering a mutation through a hook: every hook path goes through the CLI, whose prompt-time refusal is set by env the wrapper controls, so the prompt never reaches a mutating tool (hooks/lib/skill-advisor-cli-fallback.ts:207-212, runtime/skill-advisor-cli.ts:747-761).

### Prompt-policy vocabulary duplication between TypeScript and Python: the sets and thresholds come from one JSON data file, and only the strip regex and the numerics with no data file are filed. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Prompt-policy vocabulary duplication between TypeScript and Python: the sets and thresholds come from one JSON data file, and only the strip regex and the numerics with no data file are filed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Prompt-policy vocabulary duplication between TypeScript and Python: the sets and thresholds come from one JSON data file, and only the strip regex and the numerics with no data file are filed.

### Test-only ablation helpers as dead production code: imported by the parity and stress suites. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Test-only ablation helpers as dead production code: imported by the parity and stress suites.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Test-only ablation helpers as dead production code: imported by the parity and stress suites.

### Unverified assumptions about `/tmp/system-skill-advisor` ownership: the shared bridge refuses a socket directory it does not own and one that is group- or world-writable, and refuses a non-socket leaf, which covers the bind and reclaim paths (.skilled/skills/system-spec-kit/shared/ipc/socket-server.ts:439-470, 570-580). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Unverified assumptions about `/tmp/system-skill-advisor` ownership: the shared bridge refuses a socket directory it does not own and one that is group- or world-writable, and refuses a non-socket leaf, which covers the bind and reclaim paths (.skilled/skills/system-spec-kit/shared/ipc/socket-server.ts:439-470, 570-580).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Unverified assumptions about `/tmp/system-skill-advisor` ownership: the shared bridge refuses a socket directory it does not own and one that is group- or world-writable, and refuses a non-socket leaf, which covers the bind and reclaim paths (.skilled/skills/system-spec-kit/shared/ipc/socket-server.ts:439-470, 570-580).

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS
- dominantLane mutating contribution order: it sorts a filtered copy, not the source array (iteration 1, evidence: runtime/lib/scorer/attribution.ts:8-10).
- buildConflictMatchIndex seeding rawScore at 0 with Math.min: correct for the negative demotion scores the conflict lane emits (iteration 1, evidence: runtime/lib/scorer/fusion.ts:256-267).
- Stale ambiguousWith partner reaching the reader: render.ts falls back to the second passing entry (iteration 1, evidence: runtime/lib/render.ts:603-607).
- The RRF flag being inert through the CLI as a code defect: a warm daemon with its own environment explains the identical probe output (iteration 1).
- Manifest versus server registry drift: all nine commands are byte-identical in description and inputSchema on the dist probe, and the source parity suite asserts the same equality (iteration 3, evidence: runtime/tests/skill-advisor-cli-manifest-parity.vitest.ts:15-30).
- Catalog-wide source path loss: 229 of 230 cited paths resolve; the single miss is the CLI overview citation (iteration 3).
- Cross-user reach to the daemon socket: the socket dir is 0700 owner-checked and the node is chmodded 0600 after an lstat guard (iteration 3, evidence: /tmp/system-skill-advisor stat, .skilled/skills/system-spec-kit/shared/ipc/socket-server.ts:449-470, 570-580).
- A dead embedding-lane surface after the lane removal: no module, flag or branch survives (iteration 4, evidence: vocabulary sweep over runtime/ and hooks/).
- `ablation.ts` as dead production code: imported by the parity and stress suites (iteration 4, evidence: runtime/tests/parity/python-ts-parity.vitest.ts:41).
- A second directive-lifecycle store: the TypeScript store is a wrapper over the Python helper (iteration 4, evidence: hooks/lib/directive-lifecycle.ts:19-33, hooks/lib/directive-lifecycle-file-store.ts).
- `AdvisorToolInputSchemas` having a consumer outside the target skill: repository-wide search returns the definition only (iteration 4, evidence: runtime/schemas/advisor-tool-schemas.ts:588).
- A stale freshness or prompt-cache entry after a rebuild: both caches key on the content signature (iteration 5, evidence: runtime/lib/freshness.ts:386-391, runtime/handlers/advisor-recommend.ts:528, runtime/lib/skill-advisor-brief.ts:513).
- A cache in the cross-skill-edge metadata loader: none exists (iteration 5, evidence: runtime/lib/cross-skill-edges/metadata-loader.ts).
- A clock mismatch in the prompt cache: both `get` and `set` default to `performance.now()` (iteration 5, evidence: runtime/lib/prompt-cache.ts:114, :145).
- A rebuild race through the stale-lock branch: the token is compared before deletion and the stress suite pins it (iteration 5, evidence: runtime/lib/freshness/generation.ts:174-185, runtime/stress-test/skill-advisor/generation-cache-invalidation-stress.vitest.ts:145-191).
- A partial rebuild on doc-harvest failure: the throw precedes the metadata stamp and the publish (iteration 5, evidence: runtime/lib/skill-graph/skill-graph-db.ts:1042-1068).
- R3-P2-002 as a missing test suite: the cited suite exists at `runtime/tests/skill-advisor-cli-manifest-parity.vitest.ts`; the defect is the missing `runtime/` prefix at feature-catalog/cli-surface/skill-advisor-cli.md:16 (iteration 5).

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none remaining (4/4 reviewed; iteration budget exhausted at 5 of 5). - Focus area: none — this was the closing pass. Remaining work belongs to remediation, not to another review iteration. - Reason: `maxIterations` reached; `stopPolicy` is `max-iterations`, so the loop stops here by configuration rather than by convergence. - Rotation status: correctness, security, traceability, maintainability all reviewed. This pass: 1 new P2, 0 new P1/P0, 1 severity re-adjudication (R2-P1-001 retained at P1), 1 finding sharpened (R3-P2-002). - Blocked/productive carry-forward: nothing was blocked this pass; the deferred slice (`lifecycle/`, `derived/`, most of `cross-skill-edges/` and `skill-graph/`) is named in the edge cases for a follow-up run. - Required evidence for remediation: a file:line fix plus a test for R2-P1-001's promise (either the comment and default agree, or the launcher comment owns the behaviour and the reference doc stops saying "authentication"); an `openSync`-then-`write` replacement plus an empty-lock test for R5-P2-001. - Recovery note: if a future pass re-runs these modules, start with `lifecycle/` and `derived/`, which no generation of this review has read.

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT
[Populated during initialization from the continuity ladder and ripgrep recipes, if any prior work exists]

### Bounded Context Snapshot

Populate during initialization before the first review dimension runs. Keep this pointer-based and scoped to the declared review target:

- Target pointers: files, specs, symbols, or resource-map entries under review.
- Behavior claims: acceptance criteria, public contracts, or docs to verify.
- Reuse and conventions: existing patterns that define expected implementation shape.
- Review risks and gaps: stale graph or memory caveats, missing files, and out-of-scope areas.

Do not inline full source bodies. Do not dispatch the retired standalone context loop. Use this snapshot only to seed review dimensions and final traceability.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
[Alignment checks completed across core and overlay protocols]

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | fail | 5 | Re-verified at HEAD: the invariant at references/graph/propagate-enhances.md:76 promises authentication and a refusal for untrusted callers, but trust is caller-declared (advisor-server.ts:237-240) and the shipped launcher makes absent authority trusted (launcher.cjs:73-82). R2-P1-001 retained at P1 in iteration 5; the status stays fail because the invariant is false in every configuration |
| `checklist_evidence` | core | notApplicable | 3 | Packet 016 carries no checklist.md or acceptance-criteria.md (spec.md:59-222 has no acceptance section), so there are no rows to evidence; catalog validation claims checked under feature_catalog_code |
| `skill_agent` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
| `agent_cross_runtime` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
| `feature_catalog_code` | overlay | partial | 5 | The CLI entry's gate description is accurate and names the daemon-side env knob (feature-catalog/cli-surface/skill-advisor-cli.md:3), and 7/7 root-relative test rows resolve (:61-67). The single gap is the inline citation at :16, which omits the `runtime/` prefix its siblings use (R3-P2-002, scope narrowed in iteration 5). The earlier "headline contradicts the launcher default" note is withdrawn: the headline names the knob |
| `playbook_capability` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
[Per-file coverage state table -- populated during initialization from scope discovery]

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| runtime/lib/scorer/fusion.ts | D1 | 1 | 0 P0, 0 P1, 4 P2 | complete for D1 |
| runtime/lib/scorer/ambiguity.ts | D1 | 1 | 0 P0, 0 P1, 2 P2 | complete for D1 |
| runtime/lib/prompt-policy.ts | D1 | 1 | 0 P0, 0 P1, 1 P2 | complete for D1 |
| runtime/lib/command-attach.ts | D1 | 1 | 0 | partial: typedCommandIn, commandOnlyMentioned only |
| runtime/lib/render.ts | D1 | 1 | 0 | partial: brief head and ambiguity line |
| runtime/handlers/advisor-recommend.ts | D1 | 1 | 0 | partial: threshold and pass-through path |
| runtime/lib/scorer/executor-delegation.ts | D1 | 1 | 0 | partial: override return shape |
| runtime/lib/scorer/fusion.ts | D1, D4 | 4 | 0 P0, 0 P1, 5 P2 | D4: pipeline spans and stage order |
| runtime/lib/command-attach.ts | D1, D4 | 4 | 0 P0, 0 P1, 0 P2 | D4: spans measured, no new defect |
| runtime/schemas/advisor-tool-schemas.ts | D3, D4 | 4 | 0 P0, 0 P1, 1 P2 | D4: dead aggregate export |
| runtime/lib/policy-plan.ts | D4 | 4 | 0 P0, 0 P1, 1 P2 | D4: swallowed gate-question lookup |
| runtime/scripts/skill_advisor.py | D3, D4 | 4 | 0 P0, 0 P1, 2 P2 | D4: duplicated cap and floors; strip rule copy |
| hooks/pi/prompt-advisor.ts | D4 | 4 | 0 P0, 0 P1, 1 P2 | D4: copied budget constant |
| hooks/lib/route-receipt.ts | D2, D4 | 4 | 0 | D4: best-effort catches are documented |
| runtime/lib/prompt-cache.ts | D1 | 5 | 0 | full read: key, TTL, eviction, invalidation all sound |
| runtime/lib/source-cache.ts | D1 | 5 | 0 | full read: TTL/LRU sound; unused clear export only |
| runtime/lib/freshness/cache-invalidation.ts | D1 | 5 | 0 | full read: monotonic generation guard |
| runtime/lib/freshness/generation.ts | D1 | 5 | 0 P0, 0 P1, 1 P2 | full read: R5-P2-001 empty-lock reclaim |
| runtime/lib/freshness.ts | D1 | 5 | 0 | partial: cache call site and generation branch only |
| runtime/lib/skill-graph/skill-graph-db.ts | D1 | 5 | 0 | partial: rebuild transaction and pragmas only |
| runtime/lib/cross-skill-edges/metadata-loader.ts | D1 | 5 | 0 | cache grep only: no cache present |
| runtime/lib/lifecycle/*.ts, runtime/lib/derived/*.ts | - | - | - | deferred: not read by any generation of this review |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: [from config]
- Convergence threshold: [from config]
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=[from config.sessionId], parentSessionId=[from config.parentSessionId], generation=[from config.generation], lineageMode=[from config.lineageMode]
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: [from config.maxToolCallsPerIteration] tool calls, [from config.maxMinutesPerIteration] minutes
- Severity threshold: [from config.severityThreshold]
- Review target type: [from config.reviewTargetType]
- Cross-reference checks: core=[from config.crossReference.core], overlay=[from config.crossReference.overlay]
- Started: [timestamp]
<!-- MACHINE-OWNED: END -->

---

## 17. EXAMPLE (POPULATED)

Reference snippet showing a partially populated strategy file mid-review. Use this as a visual anchor when opening a live strategy doc.

```markdown
## 1. REVIEW CHARTER
- Target: .skilled/skills/system-deep-loop/deep-research (skill, v1.4.0)
- Dimensions: correctness, test-coverage, cross-runtime-parity, observability
- Stop conditions: rolling newInfoRatio < 0.08 for 2 iterations OR all dimensions converged OR max=7 reached
- Success criteria: zero P0 in correctness; test-coverage P0 resolved or deferred with rationale

## 4. NEXT FOCUS
- Dimension: traceability
- Files: .skilled/skills/system-skill-advisor/references/graph/propagate-enhances.md, .skilled/skills/system-skill-advisor/runtime/ENV-REFERENCE.md, the epic 016 packet acceptance rows
- Why: the shipped launcher default contradicts both the daemon comment and the documented refusal guarantee (R2-P1-001), and the socket peer-identity question deferred from iteration 2 needs the bridge module traced from outside the target.

## 9. COVERAGE MATRIX
| Dimension            | Status     | Iterations touched |
|----------------------|------------|--------------------|
| correctness          | reviewed   | 1                  |
| security             | reviewed   | 2                  |
| traceability         | pending    | -                  |
| maintainability      | pending    | -                  |
```
