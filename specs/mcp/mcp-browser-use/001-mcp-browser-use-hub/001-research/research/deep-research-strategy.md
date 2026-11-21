---
title: Deep Research Strategy - mcp-browser-use hub
description: Session tracking for the ten-iteration deep-research run that answers KQ1-KQ8 of the mcp-browser-use hub research charter.
trigger_phrases:
  - "deep research strategy"
  - "browser use hub research"
importance_tier: normal
contextType: planning
version: 1.14.3.0
---

# Deep Research Strategy - Session Tracking

Tracks research progress across iterations for the mcp-browser-use hub research charter.

## 1. OVERVIEW

### Purpose

Serves as the "persistent brain" for this deep research session. Records what to investigate, what worked, what failed, and where to focus next. Read by the orchestrator and agents at every iteration.

### Question Injection Surface

Use `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/001-research/research/inbox.jsonl` to append external questions during an active run. Each line is one JSON object with `id`, `text`, `source`, `origin` (`angle-bank`, `analyst-strategy`, `frontier`, `operator` or `legacy-import`), `injectedAtIteration` and `promotedQuestionId`.

Inbox rows are immutable input. The reducer registry is canonical question state. Section 3 is rendered only from the registry view.

---

## 2. TOPIC
mcp-browser-use hub: answer KQ1-KQ8 in spec.md (capability, lane rule, hub contract, blast radius, naming, macOS verification, security, Aside overlap)

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] KQ1: What can Bladebro, Chrome DevTools (bdg plus chrome-devtools-mcp) and Aside each do, and where does each stop? Answer as a cited capability matrix over page model, actions, console/network logs, HAR, heap/perf trace, Lighthouse, raw CDP, iframes, signed-in profiles and stealth.
- [x] KQ2: When does each mode use its CLI and when its MCP server through Code Mode? Answer as one lane rule per mode with the detection command and the fallback trigger.
- [x] KQ3: What hub contract does mcp-browser-use need? Answer with proposed mode-registry.json, hub-router.json and leaf-manifest.json shapes, the advisor routingClass and packetKind per mode, each checked against mcp-tooling's files.
- [x] KQ4: What is the full blast radius of moving mcp-chrome-devtools and mcp-aside-devtools out of mcp-tooling? Answer with every file inside and outside mcp-tooling that names them, split into hand-edit, regenerate and leave-as-history.
- [x] KQ5: Do the modes keep the mcp- prefix inside the new hub? Answer with one naming decision giving the folder, workflowMode and packetSkillName for each of the three modes.
- [x] KQ6: How is Bladebro verified on macOS? Answer with a step list from install through a live agent-browser and real-browser probe, each step with its expected output and its rollback.
- [x] KQ7: What are the security risks of Bladebro and the browser modes? Answer with findings on signed-in profiles, stealth and site terms of service, and the npm binary supply chain, each with a mitigation the 004 safety rules can quote.
- [x] KQ8: Should Bladebro take over Aside's deterministic signed-in work? Answer yes or no with the cases that decide it.
- [x] List every file outside .skilled/skills/mcp-tooling that names mcp-chrome-devtools or mcp-aside-devtools (rg -l, excluding changelog and benchmark/reports), and classify each: rewrite path / rewrite mode name / historical, leave.
- [x] Does the Chrome DevTools mode really offer Lighthouse? Its hub router lists it but its feature catalog has no entry; settle it from the files and the chrome-devtools-mcp / bdg upstream docs.

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Installing Bladebro or any npm, brew or pip package. The install is an operator stop-for-yes that phase 006 asks for.
- Editing any file outside `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/001-research/`. The run changes nothing else in the repository.
- Building the hub, moving the modes or writing the 002-006 plans. This run produces findings only.

---

## 5. STOP CONDITIONS
- Stop policy is `max-iterations`: the run continues through all 10 iterations; convergence is telemetry only.
- Halt on a pause sentinel, three consecutive failed iterations, or the duration budget.
- Every upstream Bladebro claim is pinned to the version and read date it came from.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- KQ1: What can Bladebro, Chrome DevTools (bdg plus chrome-devtools-mcp) and Aside each do, and where does each stop? Answer as a cited capability matrix over page model, actions, console/network logs, HAR, heap/perf trace, Lighthouse, raw CDP, iframes, signed-in profiles and stealth.
- KQ2: When does each mode use its CLI and when its MCP server through Code Mode? Answer as one lane rule per mode with the detection command and the fallback trigger.
- KQ3: What hub contract does mcp-browser-use need? Answer with proposed mode-registry.json, hub-router.json and leaf-manifest.json shapes, the advisor routingClass and packetKind per mode, each checked against mcp-tooling's files.
- KQ4: What is the full blast radius of moving mcp-chrome-devtools and mcp-aside-devtools out of mcp-tooling? Answer with every file inside and outside mcp-tooling that names them, split into hand-edit, regenerate and leave-as-history.
- KQ5: Do the modes keep the mcp- prefix inside the new hub? Answer with one naming decision giving the folder, workflowMode and packetSkillName for each of the three modes.
- KQ6: How is Bladebro verified on macOS? Answer with a step list from install through a live agent-browser and real-browser probe, each step with its expected output and its rollback.
- KQ7: What are the security risks of Bladebro and the browser modes? Answer with findings on signed-in profiles, stealth and site terms of service, and the npm binary supply chain, each with a mitigation the 004 safety rules can quote.
- KQ8: Should Bladebro take over Aside's deterministic signed-in work? Answer yes or no with the cases that decide it.
- List every file outside .skilled/skills/mcp-tooling that names mcp-chrome-devtools or mcp-aside-devtools (rg -l, excluding changelog and benchmark/reports), and classify each: rewrite path / rewrite mode name / historical, leave.
- Does the Chrome DevTools mode really offer Lighthouse? Its hub router lists it but its feature catalog has no entry; settle it from the files and the chrome-devtools-mcp / bdg upstream docs.

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- reading all five named contract files in one batch plus the two downstream specs let each proposed shape be checked against a concrete file and let two downstream open questions be closed explicitly. (iteration 3)
- a two-stage search — broad `grep` for shape, then `rg -l` for canonical file lists — kept the radius complete while making the history-vs-live classification tractable; reading the hub `SKILL.md` regeneration rule turned "regenerate" from a guess into a cited rule. (iteration 4)
- going to the canonical authoring contract and the authoritative checker first turned a judgment call into a cited rule; the checker's "stale flag" soft-fail specifically eliminated the tempting hybrid option. (iteration 5)
- reusing iteration 4's cluster inventory and spending the iteration on the new axis — reference form (path vs bare id) — turned a potentially huge re-inventory into a tractable classification; reading line-level `rg -n` output was what made the path/name split decidable. (iteration 11)
- going from the router claim to the *tool inventory* rather than hunting for a catalog leaf; the discovery fixture and the auto-generated upstream Tool Reference are both authoritative about what is actually invocable, so they settled the question in one pass. (iteration 12)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- nothing failed; the only gap was the absent Bladebro packet, which is a scheduled later phase, not a research failure. (iteration 3)
- the unscoped 400-result grep was mostly scratch and benchmark history; it would have buried the ~30 live files. Fixed by re-scoping to `rg -l` plus path-shape classification. (iteration 4)
- the broad naming grep over the parent packet returned mostly prompt-template boilerplate; narrowing to the canonical rule and the checker produced the decisive evidence. (iteration 5)
- the first whole-repository `rg -l` was hundreds of spec-history lines wide and had to be re-scoped twice; path-shape exclusions, not the pattern, were the discriminator, same lesson as iteration 4. (iteration 11)
- the initial catalog-only reading (iteration 1) produced a "genuine contradiction" verdict because the catalog is organized by CLI features and MCP invocation patterns, not by MCP tool names. The granularity mismatch was the root cause. (iteration 12)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### Broad web search for Bladebro capability facts: unnecessary once the official README and `docs/tools.md` were reachable. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Broad web search for Bladebro capability facts: unnecessary once the official README and `docs/tools.md` were reachable.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Broad web search for Bladebro capability facts: unnecessary once the official README and `docs/tools.md` were reachable.

### Broad web search for Bladebro facts: BLOCKED since iteration 1; not retried — closure uses only local state evidence. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Broad web search for Bladebro facts: BLOCKED since iteration 1; not retried — closure uses only local state evidence.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Broad web search for Bladebro facts: BLOCKED since iteration 1; not retried — closure uses only local state evidence.

### Broad web search for Bladebro facts: BLOCKED since iteration 1; not retried — terminal verification uses only local state evidence. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Broad web search for Bladebro facts: BLOCKED since iteration 1; not retried — terminal verification uses only local state evidence.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Broad web search for Bladebro facts: BLOCKED since iteration 1; not retried — terminal verification uses only local state evidence.

### Broad web search for Bladebro facts: BLOCKED since iteration 1; not retried (no upstream fetch needed). -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Broad web search for Bladebro facts: BLOCKED since iteration 1; not retried (no upstream fetch needed).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Broad web search for Bladebro facts: BLOCKED since iteration 1; not retried (no upstream fetch needed).

### Broad web search for Bladebro facts: BLOCKED since iteration 1; specific known URLs were fetched instead. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Broad web search for Bladebro facts: BLOCKED since iteration 1; specific known URLs were fetched instead.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Broad web search for Bladebro facts: BLOCKED since iteration 1; specific known URLs were fetched instead.

### Broad web search for Bladebro facts: still BLOCKED from iteration 1; the official docs were directly reachable via the docs index. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Broad web search for Bladebro facts: still BLOCKED from iteration 1; the official docs were directly reachable via the docs index.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Broad web search for Bladebro facts: still BLOCKED from iteration 1; the official docs were directly reachable via the docs index.

### Dropping the `mcp-` prefix from workflow mode ids: rejected because the canonical create-skill-parent rule is `folder == packetSkillName == [hub-prefix]-<mode>` and dropping it would rename every literal mode id in the KQ4 hand-edit set for no contract benefit. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Dropping the `mcp-` prefix from workflow mode ids: rejected because the canonical create-skill-parent rule is `folder == packetSkillName == [hub-prefix]-<mode>` and dropping it would rename every literal mode id in the KQ4 hand-edit set for no contract benefit.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Dropping the `mcp-` prefix from workflow mode ids: rejected because the canonical create-skill-parent rule is `folder == packetSkillName == [hub-prefix]-<mode>` and dropping it would rename every literal mode id in the KQ4 hand-edit set for no contract benefit.

### Editing runtime mirrors under `.claude`, `.opencode` or `.pi`: rejected after `ls -l` showed them to be symlinks into `.skilled/skills`. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Editing runtime mirrors under `.claude`, `.opencode` or `.pi`: rejected after `ls -l` showed them to be symlinks into `.skilled/skills`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Editing runtime mirrors under `.claude`, `.opencode` or `.pi`: rejected after `ls -l` showed them to be symlinks into `.skilled/skills`.

### Giving any mode a non-`metadata` routingClass: rejected because it would add per-mode projection maps to 005's scope for no benefit under hub-membership routing. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Giving any mode a non-`metadata` routingClass: rejected because it would add per-mode projection maps to 005's scope for no benefit under hub-membership routing.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Giving any mode a non-`metadata` routingClass: rejected because it would add per-mode projection maps to 005's scope for no benefit under hub-membership routing.

### Hand-writing `leaf-manifest.json`: rejected by mcp-tooling's "never hand-edit" rule; it must be regenerated (blocked until 004 authors the Bladebro packet). -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Hand-writing `leaf-manifest.json`: rejected by mcp-tooling's "never hand-edit" rule; it must be regenerated (blocked until 004 authors the Bladebro packet).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Hand-writing `leaf-manifest.json`: rejected by mcp-tooling's "never hand-edit" rule; it must be regenerated (blocked until 004 authors the Bladebro packet).

### Hand-writing the new hub's `leaf-manifest.json`: already BLOCKED in strategy and now independently confirmed by `SKILL.md:111`; not retried. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Hand-writing the new hub's `leaf-manifest.json`: already BLOCKED in strategy and now independently confirmed by `SKILL.md:111`; not retried.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Hand-writing the new hub's `leaf-manifest.json`: already BLOCKED in strategy and now independently confirmed by `SKILL.md:111`; not retried.

### Hybrid bare folder + prefixed `packetSkillName` with `grandfatheredFolderMismatch:true`: rejected because the flag is defined as a preserved *legacy* mismatch, `parent-skill-check.cjs:595-597` soft-fails a stale `true` flag, and iteration 3 fixed folder == name as the invariant. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Hybrid bare folder + prefixed `packetSkillName` with `grandfatheredFolderMismatch:true`: rejected because the flag is defined as a preserved *legacy* mismatch, `parent-skill-check.cjs:595-597` soft-fails a stale `true` flag, and iteration 3 fixed folder == name as the invariant.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Hybrid bare folder + prefixed `packetSkillName` with `grandfatheredFolderMismatch:true`: rejected because the flag is defined as a preserved *legacy* mismatch, `parent-skill-check.cjs:595-597` soft-fails a stale `true` flag, and iteration 3 fixed folder == name as the invariant.

### Importing `mcp-tooling`'s `extensions.transport-axis` block: rejected because all three new modes are workflow-state-changing, directly answering 002's open question. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Importing `mcp-tooling`'s `extensions.transport-axis` block: rejected because all three new modes are workflow-state-changing, directly answering 002's open question.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Importing `mcp-tooling`'s `extensions.transport-axis` block: rejected because all three new modes are workflow-state-changing, directly answering 002's open question.

### Live `bladebro` probes or installing the binary: BLOCKED since iteration 1; install is a 006 operator stop-for-yes and a charter non-goal [SOURCE: specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/001-research/spec.md:98-100]. -- BLOCKED (iteration 10, 4 attempts)
- What was tried: Live `bladebro` probes or installing the binary: BLOCKED since iteration 1; install is a 006 operator stop-for-yes and a charter non-goal [SOURCE: specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/001-research/spec.md:98-100].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Live `bladebro` probes or installing the binary: BLOCKED since iteration 1; install is a 006 operator stop-for-yes and a charter non-goal [SOURCE: specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/001-research/spec.md:98-100].

### Live `bladebro` probes: the binary is absent from PATH and installation is an explicit non-goal; KQ6 owns live verification. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Live `bladebro` probes: the binary is absent from PATH and installation is an explicit non-goal; KQ6 owns live verification.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Live `bladebro` probes: the binary is absent from PATH and installation is an explicit non-goal; KQ6 owns live verification.

### No new dead end. Candidates for reducer promotion: none; the three ruled-out items above are classification choices specific to KQ4, not exhausted research directions. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: No new dead end. Candidates for reducer promotion: none; the three ruled-out items above are classification choices specific to KQ4, not exhausted research directions.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No new dead end. Candidates for reducer promotion: none; the three ruled-out items above are classification choices specific to KQ4, not exhausted research directions.

### No new dead end. Candidates for reducer promotion: none; the two ruled-out items are scope/classification choices specific to this question, not exhausted research directions. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: No new dead end. Candidates for reducer promotion: none; the two ruled-out items are scope/classification choices specific to this question, not exhausted research directions.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No new dead end. Candidates for reducer promotion: none; the two ruled-out items are scope/classification choices specific to this question, not exhausted research directions.

### No new directions ruled out this iteration. The two iteration-1 BLOCKED directions (broad Bladebro web search; live `bladebro` probes) were not retried. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: No new directions ruled out this iteration. The two iteration-1 BLOCKED directions (broad Bladebro web search; live `bladebro` probes) were not retried.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No new directions ruled out this iteration. The two iteration-1 BLOCKED directions (broad Bladebro web search; live `bladebro` probes) were not retried.

### None. Both alternatives produced a decisive finding rather than eliminating a path. Candidates for reducer promotion: the two ruled-out options above are classification choices specific to KQ5, not exhausted research directions. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: None. Both alternatives produced a decisive finding rather than eliminating a path. Candidates for reducer promotion: the two ruled-out options above are classification choices specific to KQ5, not exhausted research directions.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None. Both alternatives produced a decisive finding rather than eliminating a path. Candidates for reducer promotion: the two ruled-out options above are classification choices specific to KQ5, not exhausted research directions.

### Re-running KQ4's whole-repository inventory: rejected because the question is a strict subset and iteration 4 already holds the cluster inventory; only the outside-hub form split was new. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: Re-running KQ4's whole-repository inventory: rejected because the question is a strict subset and iteration 4 already holds the cluster inventory; only the outside-hub form split was new.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Re-running KQ4's whole-repository inventory: rejected because the question is a strict subset and iteration 4 already holds the cluster inventory; only the outside-hub form split was new.

### Running any live `bladebro` probe or installing the binary: the iteration-1 BLOCKED "live `bladebro` probes" direction and the charter/install non-goal still apply [SOURCE: specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/001-research/spec.md:98-100]. The plan is authored from pinned upstream docs, not executed. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Running any live `bladebro` probe or installing the binary: the iteration-1 BLOCKED "live `bladebro` probes" direction and the charter/install non-goal still apply [SOURCE: specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/001-research/spec.md:98-100]. The plan is authored from pinned upstream docs, not executed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Running any live `bladebro` probe or installing the binary: the iteration-1 BLOCKED "live `bladebro` probes" direction and the charter/install non-goal still apply [SOURCE: specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/001-research/spec.md:98-100]. The plan is authored from pinned upstream docs, not executed.

### Treating bare mode-id occurrences as path rewrites: rejected after line-level inspection showed cli-orca and advisor fixtures use ids as route labels, not paths, and KQ5 keeps the ids stable. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: Treating bare mode-id occurrences as path rewrites: rejected after line-level inspection showed cli-orca and advisor fixtures use ids as route labels, not paths, and KQ5 keeps the ids stable.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating bare mode-id occurrences as path rewrites: rejected after line-level inspection showed cli-orca and advisor fixtures use ids as route labels, not paths, and KQ5 keeps the ids stable.

### Treating the raw 400-match grep as the edit list: rejected because most hits are changelog/benchmark/spec-history records; it would inflate the hand-edit set by an order of magnitude. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Treating the raw 400-match grep as the edit list: rejected because most hits are changelog/benchmark/spec-history records; it would inflate the hand-edit set by an order of magnitude.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the raw 400-match grep as the edit list: rejected because most hits are changelog/benchmark/spec-history records; it would inflate the hand-edit set by an order of magnitude.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- Broad web search for Bladebro capability facts: unnecessary once the official README and `docs/tools.md` were reachable. (iteration 1)
- Live `bladebro` probes: the binary is absent from PATH and installation is an explicit non-goal; KQ6 owns live verification. (iteration 1)
- No new directions ruled out this iteration. The two iteration-1 BLOCKED directions (broad Bladebro web search; live `bladebro` probes) were not retried. (iteration 2)
- Giving any mode a non-`metadata` routingClass: rejected because it would add per-mode projection maps to 005's scope for no benefit under hub-membership routing. (iteration 3)
- Hand-writing `leaf-manifest.json`: rejected by mcp-tooling's "never hand-edit" rule; it must be regenerated (blocked until 004 authors the Bladebro packet). (iteration 3)
- Importing `mcp-tooling`'s `extensions.transport-axis` block: rejected because all three new modes are workflow-state-changing, directly answering 002's open question. (iteration 3)
- Editing runtime mirrors under `.claude`, `.opencode` or `.pi`: rejected after `ls -l` showed them to be symlinks into `.skilled/skills`. (iteration 4)
- Hand-writing the new hub's `leaf-manifest.json`: already BLOCKED in strategy and now independently confirmed by `SKILL.md:111`; not retried. (iteration 4)
- No new dead end. Candidates for reducer promotion: none; the three ruled-out items above are classification choices specific to KQ4, not exhausted research directions. (iteration 4)
- Treating the raw 400-match grep as the edit list: rejected because most hits are changelog/benchmark/spec-history records; it would inflate the hand-edit set by an order of magnitude. (iteration 4)
- Dropping the `mcp-` prefix from workflow mode ids: rejected because the canonical create-skill-parent rule is `folder == packetSkillName == [hub-prefix]-<mode>` and dropping it would rename every literal mode id in the KQ4 hand-edit set for no contract benefit. (iteration 5)
- Hybrid bare folder + prefixed `packetSkillName` with `grandfatheredFolderMismatch:true`: rejected because the flag is defined as a preserved *legacy* mismatch, `parent-skill-check.cjs:595-597` soft-fails a stale `true` flag, and iteration 3 fixed folder == name as the invariant. (iteration 5)
- None. Both alternatives produced a decisive finding rather than eliminating a path. Candidates for reducer promotion: the two ruled-out options above are classification choices specific to KQ5, not exhausted research directions. (iteration 5)
- Broad web search for Bladebro facts: still BLOCKED from iteration 1; the official docs were directly reachable via the docs index. (iteration 6)
- Running any live `bladebro` probe or installing the binary: the iteration-1 BLOCKED "live `bladebro` probes" direction and the charter/install non-goal still apply [SOURCE: specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/001-research/spec.md:98-100]. The plan is authored from pinned upstream docs, not executed. (iteration 6)
- Broad web search for Bladebro facts: BLOCKED since iteration 1; specific known URLs were fetched instead. (iteration 7)
- Live `bladebro` probes or installing the binary: BLOCKED since iteration 1; install is a 006 operator stop-for-yes and a charter non-goal [SOURCE: specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/001-research/spec.md:98-100]. (iteration 7)
- Broad web search for Bladebro facts: BLOCKED since iteration 1; not retried (no upstream fetch needed). (iteration 8)
- Broad web search for Bladebro facts: BLOCKED since iteration 1; not retried — closure uses only local state evidence. (iteration 9)
- Broad web search for Bladebro facts: BLOCKED since iteration 1; not retried — terminal verification uses only local state evidence. (iteration 10)
- No new dead end. Candidates for reducer promotion: none; the two ruled-out items are scope/classification choices specific to this question, not exhausted research directions. (iteration 11)
- Re-running KQ4's whole-repository inventory: rejected because the question is a strict subset and iteration 4 already holds the cluster inventory; only the outside-hub form split was new. (iteration 11)
- Treating bare mode-id occurrences as path rewrites: rejected after line-level inspection showed cli-orca and advisor fixtures use ids as route labels, not paths, and KQ5 keeps the ids stable. (iteration 11)

<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergence-frontier -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
[None yet]

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

Prior context from the continuity ladder: no `handover.md`; `implementation-summary.md` continuity is the scaffold default (planning only, run not started). The packet `spec.md` is the research charter and defines KQ1-KQ8 with an "answered means" bar for each. The ripgrep recipe over `specs` and `.skilled` for the topic phrase found one hit, in this packet's own planning docs, so there is no earlier research on this topic.

Measured behavior recorded in `spec.md`: `bladebro` is absent from PATH, `aside` is at `/Users/michelkerkmeester/.local/bin/aside`, `bdg` is at `/opt/homebrew/bin/bdg`. Upstream Bladebro shipped about 40 releases in 4 months, so pin every upstream claim to a version and read date.

resource-map.md not present; skipping coverage gate

### Bounded Context Snapshot

- Source pointers: `.skilled/skills/mcp-tooling/` (`SKILL.md`, `ROUTER.md`, `mode-registry.json`, `hub-router.json`, `leaf-manifest.json`, `graph-metadata.json`), the mode packets `.skilled/skills/mcp-tooling/mcp-chrome-devtools/` and `.skilled/skills/mcp-tooling/mcp-aside-devtools/`.
- Reuse candidates: the `mcp-tooling` hub contract (registry, router and leaf manifest shapes) as the template for the new hub; other parent hubs under `.skilled/skills/` for comparison.
- Integration points: the skill advisor graph, `.utcp_config.json` Code Mode manuals, runtime agent and command mirrors, and the downstream phase specs `002-hub-scaffold` through `006-verification` in the parent packet.
- Constraints and risks: findings only; no installs; no edits outside this phase folder; upstream Bladebro moves fast.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 10
- Convergence threshold: 0.05
- Stop policy: max-iterations
- Per-iteration budget: 24 tool calls, 10 minutes
- Progressive synthesis: true (default)
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `new`, `resume`, `restart`, `completed-continue` through `--extend=N` and `--extend-minutes=M` (live)
- Deferred lifecycle branch: `fork` (not runtime-wired)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A, including Section 10A pivot lineage
- Question injection surface: `research/inbox.jsonl`
- Question conflict owner: reducer registry; `question_conflict` events surface inbox/registry disagreements for operator decision
- Canonical pause sentinel: `research/.deep-research-pause`
- Capability matrix: `.skilled/skills/system-deep-loop/deep-research/assets/runtime-capabilities.json`
- Capability matrix doc: `.skilled/skills/system-deep-loop/deep-research/references/guides/capability-matrix.md`
- Capability resolver: `.skilled/skills/system-deep-loop/deep-research/scripts/runtime-capabilities.cjs`
- Executor: cli-opencode, model opencode-go/hy4-flash-free, reasoning high, sandbox danger-full-access
- Current generation: 1
- Started: 2026-11-21T08:29:48.000Z
