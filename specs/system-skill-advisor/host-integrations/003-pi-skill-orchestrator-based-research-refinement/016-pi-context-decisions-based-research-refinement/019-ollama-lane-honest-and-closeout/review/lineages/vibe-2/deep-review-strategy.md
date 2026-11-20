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

# Deep Review Strategy - Session Tracking Template

Runtime template copied into the resolved `{artifact_dir}/` during initialization. Tracks review progress across iterations.

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
Review: .skilled/skills/system-skill-advisor .skilled/bin/system-skill-advisor-launcher.cjs .skilled/bin/launcher-heartbeat-watchdog.vitest.ts .skilled/bin/launcher-threshold-env.vitest.ts .skilled/commands/doctor/assets .skilled/commands/create/assets .skilled/changelog/skilled/v4.1.0.0.md .skilled/skills/sk-doc/hub-router.json .skilled/skills/sk-doc/sk-create-readme/SKILL.md .skilled/hooks/session-handover/pi/session-handover.test.ts .opencode/plugins/tests/system-skill-advisor.test.cjs .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md .github/workflows/skill-advisor-stress.yml .env.example INSTALL-SKILLED.md README.md specs/**/decision-record.md

Target type: files. Declared scope entries: 17.

Operator review focus (bound as review_focus, covered by every iteration):

Review only what these commits changed, read at HEAD with git show: 31ffd18beab, 1ccbb3283c6 and dc3979eb451 (background vector refresh, semantic lane coverage gate, launcher liveness, OLLAMA_* passthrough, generation counter, status and doctor coverage); 86038dfba80, c74042fd559, 571575632a4, 5c91b2f3f5d and 0390556ee2b (test and routing follow-ups); and the ten docs(specs) commits 2f5fe41bb9e to aaaff7dd9df that wrote 231 ended-session answers into decision-record.md files. Report defects in shipped behavior, not style. P0 is wrong routing, a crash, lost data, or a doc claim that misleads an operator. A test change that matches new text while leaving the behavior unchecked is a finding. Owning packet: specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/019-ollama-lane-honest-and-closeout.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS
- Style, formatting and naming preferences. The focus says: report defects in shipped behavior, not style.
- Implementation of fixes. This loop reports findings only.
- Files outside the declared review target, except as traceability context evidence.
- Re-litigating the frozen decisions D1-D7 of the owning packet.

---

## 5. STOP CONDITIONS
- Convergence: newFindingsRatio below 0.10 with no open frontier node.
- maxIterations 16 reached.
- Three consecutive failed iterations (stop reason error).
- maxDurationMinutes 120 reached.
- An active P0 keeps the verdict at FAIL regardless of convergence.

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
- P2 (Suggestions): 11
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED
- Tracing a stated invariant to every call site in the same module: the read-only comment at semantic-shadow.ts:170 named the exact contract the coverage gate breaks (iteration 1).
- Reading the database openers (getDb vs getDbReadOnly) before judging the lane: it separated the daemon path from the secondary-process path and fixed the severity (iteration 1).
- Checking each doc claim against the exact code symbol it names: the allowlist entry plus the undefined guard disproved the "always sets" sentence (iteration 2).
- Counting the corpus on disk before accepting a published row count: 196 rows confirmed one claim and exposed the 193 in the same section (iteration 2).
- Reading the adapter error constructors before judging a logging concern: it proved the base URL is embedded verbatim and bounded the finding (iteration 3).
- Enumerating the code's diagnostic token vocabulary and diffing it against the docs: it turned a vague "docs may be thin" suspicion into a precise 3-of-8 gap (iteration 4).
- Reading a test change against the call site it asserts, rather than against its commit message: it cleared both halves of `0390556ee2b` and left the acceptance criteria as the only place the evidence did not hold (iteration 5).
- Comparing every surface that quotes a measurement against the one table that records it: it found a superseded score pair the earlier row-count finding had walked past (iteration 6).
- Reading a guard's input back to its assignment instead of trusting its name: it turned a suspected behavior bug into a precise naming hazard (iteration 7).
- Reading the older changelog for a claim already recorded as wrong: it found the duplication that made the single-file findings survive a fix (iteration 8).

---

## 9. WHAT FAILED
- Grepping with `--include=*.ts` under zsh: the glob was expanded by the shell and the search returned nothing. Use quoted patterns or `rg` (iteration 1).

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **`_semanticShadowTest` exposing internals is a defect.** Ruled out: it is a named test hook, not a production surface. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: **`_semanticShadowTest` exposing internals is a defect.** Ruled out: it is a named test hook, not a production surface.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`_semanticShadowTest` exposing internals is a defect.** Ruled out: it is a named test hook, not a production surface.

### **`liveLaneCount` over-counts a zero-weight lane.** `semantic_shadow` is `live: true` with weight 0 (`lane-registry.ts:13`), so `runtimeLiveLaneCount` counts it. Ruled out: the field counts live lanes, and the lane is live; its weight is reported separately through `fusion_live_weight_share`. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **`liveLaneCount` over-counts a zero-weight lane.** `semantic_shadow` is `live: true` with weight 0 (`lane-registry.ts:13`), so `runtimeLiveLaneCount` counts it. Ruled out: the field counts live lanes, and the lane is live; its weight is reported separately through `fusion_live_weight_share`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`liveLaneCount` over-counts a zero-weight lane.** `semantic_shadow` is `live: true` with weight 0 (`lane-registry.ts:13`), so `runtimeLiveLaneCount` counts it. Ruled out: the field counts live lanes, and the lane is live; its weight is reported separately through `fusion_live_weight_share`.

### **`mergeSemanticShadowRuntimeLaneHealth` reads a stale reason.** Ruled out: `withSemanticShadowPromptEmbedding` sets the reason before invoking `run()`, so the read inside the callback observes this call's reason. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **`mergeSemanticShadowRuntimeLaneHealth` reads a stale reason.** Ruled out: `withSemanticShadowPromptEmbedding` sets the reason before invoking `run()`, so the read inside the callback observes this call's reason.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`mergeSemanticShadowRuntimeLaneHealth` reads a stale reason.** Ruled out: `withSemanticShadowPromptEmbedding` sets the reason before invoking `run()`, so the read inside the callback observes this call's reason.

### **`runLaneAblation` is described as honouring lane weights.** Ruled out: `ablation.md:22` says it ignores weights and includes lanes already at 0. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **`runLaneAblation` is described as honouring lane weights.** Ruled out: `ablation.md:22` says it ignores weights and includes lanes already at 0.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`runLaneAblation` is described as honouring lane weights.** Ruled out: `ablation.md:22` says it ignores weights and includes lanes already at 0.

### **`semanticLaneHealth` is always emitted.** Ruled out: both call sites gate it on `includeSemanticHealth || debug`. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **`semanticLaneHealth` is always emitted.** Ruled out: both call sites gate it on `includeSemanticHealth || debug`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`semanticLaneHealth` is always emitted.** Ruled out: both call sites gate it on `includeSemanticHealth || debug`.

### **`why_recommended` leaks prompt phrases.** Ruled out: `evidenceFeature` returns a fixed token for every prefix and a fixed fallback for anything else. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **`why_recommended` leaks prompt phrases.** Ruled out: `evidenceFeature` returns a fixed token for every prefix and a fixed fallback for anything else.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`why_recommended` leaks prompt phrases.** Ruled out: `evidenceFeature` returns a fixed token for every prefix and a fixed fallback for anything else.

### **AC-001's 14/14 and AC-011's 15/15 contradict each other.** Ruled out: they describe the fresh isolated daemon and main respectively, and the summary states both. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **AC-001's 14/14 and AC-011's 15/15 contradict each other.** Ruled out: they describe the fresh isolated daemon and main respectively, and the summary states both.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **AC-001's 14/14 and AC-011's 15/15 contradict each other.** Ruled out: they describe the fresh isolated daemon and main respectively, and the summary states both.

### **AC-005's "default 0 asserted by the pass bar" misstates which branch ran.** Ruled out: the criterion's Then clause is "the default weight follows the pass bar", and the pass bar failed, so 0 is the correct outcome. The wording is terse, not false. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **AC-005's "default 0 asserted by the pass bar" misstates which branch ran.** Ruled out: the criterion's Then clause is "the default weight follows the pass bar", and the pass bar failed, so 0 is the correct outcome. The wording is terse, not false.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **AC-005's "default 0 asserted by the pass bar" misstates which branch ran.** Ruled out: the criterion's Then clause is "the default weight follows the pass bar", and the pass bar failed, so 0 is the correct outcome. The wording is terse, not false.

### **Concurrent recommend calls race on the module-level prompt embedding.** Ruled out: the set, the synchronous scoring call and the clear run in one microtask with no await between them. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Concurrent recommend calls race on the module-level prompt embedding.** Ruled out: the set, the synchronous scoring call and the clear run in one microtask with no await between them.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Concurrent recommend calls race on the module-level prompt embedding.** Ruled out: the set, the synchronous scoring call and the clear run in one microtask with no await between them.

### **The `|| liveWeightTotal()` fallback in `liveTotal` inflates confidence when every lane is degraded.** Ruled out: with every lane degraded there are no matches to normalize, so the fallback cannot raise a score. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **The `|| liveWeightTotal()` fallback in `liveTotal` inflates confidence when every lane is degraded.** Ruled out: with every lane degraded there are no matches to normalize, so the fallback cannot raise a score.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The `|| liveWeightTotal()` fallback in `liveTotal` inflates confidence when every lane is degraded.** Ruled out: with every lane degraded there are no matches to normalize, so the fallback cannot raise a score.

### **The 750 ms deadline leaves unbounded pending requests.** Ruled out: the adapter aborts its own fetch, so each abandoned request is bounded. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **The 750 ms deadline leaves unbounded pending requests.** Ruled out: the adapter aborts its own fetch, so each abandoned request is bounded.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The 750 ms deadline leaves unbounded pending requests.** Ruled out: the adapter aborts its own fetch, so each abandoned request is bounded.

### **The ablation test compares two identical arms.** Ruled out: the full arm overrides the weight to 0.05 through `laneWeightsOverride`, which `fusion.ts:1284` honors, and the disabled arm disables the lane outright. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **The ablation test compares two identical arms.** Ruled out: the full arm overrides the weight to 0.05 through `laneWeightsOverride`, which `fusion.ts:1284` honors, and the disabled arm disables the lane outright.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The ablation test compares two identical arms.** Ruled out: the full arm overrides the weight to 0.05 through `laneWeightsOverride`, which `fusion.ts:1284` honors, and the disabled arm disables the lane outright.

### **The ablation test would pass with the lane weight raised.** Ruled out: the assertion branches on the measured pass bar, so a passing measurement requires a nonzero default and a failing one requires 0. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **The ablation test would pass with the lane weight raised.** Ruled out: the assertion branches on the measured pass bar, so a passing measurement requires a nonzero default and a failing one requires 0.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The ablation test would pass with the lane weight raised.** Ruled out: the assertion branches on the measured pass bar, so a passing measurement requires a nonzero default and a failing one requires 0.

### **The child environment allowlist leaks secrets to the daemon.** Ruled out: it is a closed allowlist with no credential-shaped key. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **The child environment allowlist leaks secrets to the daemon.** Ruled out: it is a closed allowlist with no credential-shaped key.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The child environment allowlist leaks secrets to the daemon.** Ruled out: it is a closed allowlist with no credential-shaped key.

### **The doctor route reports FAIL on a zero lane weight.** Ruled out: `doctor-skill-advisor-embedder.yaml:149` forbids it explicitly. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **The doctor route reports FAIL on a zero lane weight.** Ruled out: `doctor-skill-advisor-embedder.yaml:149` forbids it explicitly.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The doctor route reports FAIL on a zero lane weight.** Ruled out: `doctor-skill-advisor-embedder.yaml:149` forbids it explicitly.

### **The feature catalog index undercounts its leaves.** Ruled out: the row says 10 and the directory holds 10. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: **The feature catalog index undercounts its leaves.** Ruled out: the row says 10 and the directory holds 10.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The feature catalog index undercounts its leaves.** Ruled out: the row says 10 and the directory holds 10.

### **The feature catalog's ablation leaf still claims an `advisor_validate` slice.** Ruled out: `ablation.md:22` says `advisor_validate` returns no ablation slice, which is the corrected negative claim. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **The feature catalog's ablation leaf still claims an `advisor_validate` slice.** Ruled out: `ablation.md:22` says `advisor_validate` returns no ablation slice, which is the corrected negative claim.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The feature catalog's ablation leaf still claims an `advisor_validate` slice.** Ruled out: `ablation.md:22` says `advisor_validate` returns no ablation slice, which is the corrected negative claim.

### **The guard ignores the operator override.** Ruled out: the constant it reads is the resolved weights, and a test stubs the env to prove the lane proceeds. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: **The guard ignores the operator override.** Ruled out: the constant it reads is the resolved weights, and a test stubs the env to prove the lane proceeds.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The guard ignores the operator override.** Ruled out: the constant it reads is the resolved weights, and a test stubs the env to prove the lane proceeds.

### **The install guide overstates the lane's benefit.** Ruled out: it says a measured run routed fewer prompts correctly with the lane on. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **The install guide overstates the lane's benefit.** Ruled out: it says a measured run routed fewer prompts correctly with the lane on.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The install guide overstates the lane's benefit.** Ruled out: it says a measured run routed fewer prompts correctly with the lane on.

### **The lane's health object is a hidden global that callers must know to read.** Ruled out as a finding: the tests read it deliberately and the status handler surfaces it, so the coupling is documented by use. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: **The lane's health object is a hidden global that callers must know to read.** Ruled out as a finding: the tests read it deliberately and the status handler surfaces it, so the coupling is documented by use.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The lane's health object is a hidden global that callers must know to read.** Ruled out as a finding: the tests read it deliberately and the status handler surfaces it, so the coupling is documented by use.

### **The module-level prompt embedding races across concurrent calls.** Ruled out in iteration 3: set, run and clear share one microtask with no await between them. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: **The module-level prompt embedding races across concurrent calls.** Ruled out in iteration 3: set, run and clear share one microtask with no await between them.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The module-level prompt embedding races across concurrent calls.** Ruled out in iteration 3: set, run and clear share one microtask with no await between them.

### **The older changelog describes a refresh that no longer ships.** Ruled out: the described refresh matches the shipped one. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: **The older changelog describes a refresh that no longer ships.** Ruled out: the described refresh matches the shipped one.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The older changelog describes a refresh that no longer ships.** Ruled out: the described refresh matches the shipped one.

### **The older changelog's ablation numbers are stale.** Ruled out: they match the packet table. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: **The older changelog's ablation numbers are stale.** Ruled out: they match the packet table.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The older changelog's ablation numbers are stale.** Ruled out: they match the packet table.

### **The OpenCode test change loosened the assertion to accept a wrong argument.** Ruled out: `additionalContext` is the parameter that holds the emitted text. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **The OpenCode test change loosened the assertion to accept a wrong argument.** Ruled out: `additionalContext` is the parameter that holds the emitted text.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The OpenCode test change loosened the assertion to accept a wrong argument.** Ruled out: `additionalContext` is the parameter that holds the emitted text.

### **The Pi test change made the assertion tautological.** Ruled out: it compares the nudge's text against a path derived from the test file's own location, so a nudge-side drift still fails. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **The Pi test change made the assertion tautological.** Ruled out: it compares the nudge's text against a path derived from the test file's own location, so a nudge-side drift still fails.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The Pi test change made the assertion tautological.** Ruled out: it compares the nudge's text against a path derived from the test file's own location, so a nudge-side drift still fails.

### **The playbook index points at a missing scenario file.** Ruled out: `scorer-fusion/ablation.md` exists. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: **The playbook index points at a missing scenario file.** Ruled out: `scorer-fusion/ablation.md` exists.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The playbook index points at a missing scenario file.** Ruled out: `scorer-fusion/ablation.md` exists.

### **The playbook's pass-bar sentence contradicts D2.** Ruled out: it says the default stays at 0 and the test asserts the default follows the pass bar, which is D2's fail branch. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **The playbook's pass-bar sentence contradicts D2.** Ruled out: it says the default stays at 0 and the test asserts the default follows the pass bar, which is D2's fail branch.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The playbook's pass-bar sentence contradicts D2.** Ruled out: it says the default stays at 0 and the test asserts the default follows the pass bar, which is D2's fail branch.

### **The reference's line citations drifted.** Ruled out: all three cited ranges resolve to the code they describe. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **The reference's line citations drifted.** Ruled out: all three cited ranges resolve to the code they describe.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The reference's line citations drifted.** Ruled out: all three cited ranges resolve to the code they describe.

### **The stress workflow exposes a secret.** Ruled out: the added line is a static `off` value. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **The stress workflow exposes a secret.** Ruled out: the added line is a static `off` value.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The stress workflow exposes a secret.** Ruled out: the added line is a static `off` value.

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS
- `liveLaneCount` over-counting a zero-weight lane: the field counts live lanes and the lane is live (iteration 1, evidence: lane-registry.ts:13, fusion.ts:1314).
- The `|| liveWeightTotal()` fallback inflating confidence: no matches exist to normalize when every lane is degraded (iteration 1, evidence: fusion.ts:1311-1313).
- A stale reason read inside the embedding callback: the reason is set before `run()` (iteration 1, evidence: semantic-shadow.ts:236-243).
- The ablation test comparing two identical arms: the full arm overrides the weight to 0.05 and fusion honors it (iteration 2, evidence: fusion.ts:1284).
- The doctor route failing on a zero lane weight: the asset forbids it (iteration 2, evidence: doctor-skill-advisor-embedder.yaml:149).
- The child environment allowlist leaking secrets: it is a closed allowlist with no credential-shaped key (iteration 3, evidence: system-skill-advisor-launcher.cjs:120-200).
- Unbounded in-flight requests after the 750 ms deadline: the adapter aborts its own fetch (iteration 3, evidence: shared/embeddings/adapters/ollama.ts:142-145).
- A race on the module-level prompt embedding: the set, run and clear share one microtask (iteration 3, evidence: semantic-shadow.ts:236-252).
- `why_recommended` leaking prompt phrases: every evidence entry is reduced to a fixed category token (iteration 4, evidence: advisor-recommend.ts:168-190).
- `semanticLaneHealth` being emitted unconditionally: both call sites gate it on `includeSemanticHealth || debug` (iteration 4, evidence: advisor-status.ts:534,558).
- The reference's line citations having drifted: all three cited ranges resolve to the code they describe (iteration 4, evidence: semantic-shadow.ts:27,325-338,405).
- AC-005's "default 0 asserted by the pass bar" misstating which branch ran: the Then clause is "the default weight follows the pass bar", and the bar failed (iteration 5, evidence: acceptance-criteria.md:60).
- AC-001's 14/14 and AC-011's 15/15 contradicting each other: they describe the fresh isolated daemon and main respectively (iteration 5, evidence: implementation-summary.md:114,123).
- The OpenCode test change loosening its assertion to accept a wrong argument: `additionalContext` is the parameter holding the emitted text (iteration 5, evidence: user-prompt-submit.ts:516-535).
- The Pi test change making its assertion tautological: it compares the nudge text against a path derived from the test file location, so nudge-side drift still fails (iteration 5, evidence: session-handover.test.ts:46-50).
- The feature catalog ablation leaf still claiming an `advisor_validate` slice: it states the corrected negative claim (iteration 6, evidence: ablation.md:22).
- `runLaneAblation` being described as honouring lane weights: the leaf says it ignores weights and includes lanes already at 0 (iteration 6, evidence: ablation.md:22).
- The install guide overstating the lane benefit: it says a measured run routed fewer prompts correctly with the lane on (iteration 6, evidence: INSTALL-SKILLED.md:88).
- The playbook pass-bar sentence contradicting D2: it states the fail branch, which is what ran (iteration 6, evidence: manual-testing-playbook/scorer-fusion/ablation.md:60).
- The lane weight guard ignoring the operator override: the constant it reads is the resolved weights, and a test stubs the env to prove the lane proceeds (iteration 7, evidence: lane-registry.ts:74-105).
- `_semanticShadowTest` exposing internals being a defect: it is a named test hook, not a production surface (iteration 7, evidence: semantic-shadow.ts:245-248).
- The lane health object being a hidden global callers must know to read: the tests read it deliberately and the status handler surfaces it (iteration 7, evidence: advisor-status.ts:534).
- The feature catalog index undercounting its leaves: the row says 10 and the directory holds 10 (iteration 8, evidence: feature-catalog.md:29).
- The playbook index pointing at a missing scenario file: `scorer-fusion/ablation.md` exists (iteration 8, evidence: manual-testing-playbook.md:281).
- The older changelog's ablation numbers being stale: they match the packet table (iteration 8, evidence: changelog/v1.3.0.0.md:33).
- The older changelog describing a refresh that no longer ships: the described refresh matches the shipped one (iteration 8, evidence: changelog/v1.3.0.0.md:22).

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none remaining. All four configured dimensions are covered and both frontier nodes are answered. - Focus area: synthesis. - Reason: the run reached legal convergence at iteration 7 and this iteration closed the last open frontier dimension. - Rotation status: F-1-002 all four dimensions complete; F-1-005 all four dimensions complete. - Blocked/productive carry-forward: productive — reading the older changelog for the same claim found the duplication the single-file findings missed. - Required evidence: the findings registry and the eight iteration artifacts, for synthesis. - Recovery note: none. Review verdict: CONDITIONAL

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- Target pointers: the 17 declared review-target entries. The skill directory `.skilled/skills/system-skill-advisor` expands to 5348 files and `specs/**/decision-record.md` to 1139 files, so the effective read is the commit set named in the review focus, not the whole tree.
- Behavior claims: the owning packet `019-ollama-lane-honest-and-closeout` decisions D1-D7 and its completion criteria; the changelogs and feature catalog that describe the semantic lane.
- Reuse and conventions: the deep-review loop contract in `.skilled/skills/system-deep-loop`, the review doctrine in `.skilled/skills/sk-code/sk-code-review/references/review-core.md`.
- Review risks and gaps: the target is a commit range, so a file read at HEAD may already carry later edits; every claim is checked against `git show <sha>` rather than the working tree alone.
- resource-map.md not present; skipping coverage gate.

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
| `spec_code` | core | partial | 1, 2 | The module read-only contract is contradicted by the coverage gate (R1-P1-001); two changelog statements do not match the code (R2-P2-001, R2-P2-002). |
| `checklist_evidence` | core | notApplicable | 1 | Files target, no checklist to reconcile. |
| `skill_agent` | overlay | pass | 4 | The skill's own scoring reference matches the lane's shipped weight, gating and degradation behavior. |
| `agent_cross_runtime` | overlay | notApplicable | 5 | No agent definition integrates the advisor status surface, so there is no agent-to-runtime pair to reconcile. |
| `feature_catalog_code` | overlay | pass | 2 | The ablation catalog paragraph matches the test pass bar and the registry default of 0. |
| `playbook_capability` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
[Per-file coverage state table -- populated during initialization from scope discovery]

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| runtime/lib/scorer/lanes/semantic-shadow.ts | D1 | 1 | 0 P0, 1 P1, 3 P2 | partial |
| runtime/handlers/advisor-recommend.ts | D1 | 1 | 0 P0, 0 P1, 0 P2 | partial |
| runtime/lib/scorer/fusion.ts | D1 | 1 | 0 P0, 0 P1, 0 P2 | partial |
| runtime/lib/skill-graph/skill-graph-db.ts | D1 | 1 | 0 P0, 1 P1, 1 P2 | partial |
| .skilled/changelog/skilled/v4.1.0.0.md | D1 | 2 | 0 P0, 0 P1, 2 P2 | partial |
| .skilled/bin/system-skill-advisor-launcher.cjs | D1 | 2 | 0 P0, 0 P1, 1 P2 | partial |
| runtime/lib/scorer/lanes/semantic-shadow.ts | D1, D2 | 1, 3 | 0 P0, 1 P1, 4 P2 | partial |
| references/scoring/advisor-scorer.md | D1 | 4 | 0 P0, 0 P1, 1 P2 | partial |
| acceptance-criteria.md | D2 | 5 | 0 P0, 0 P1, 1 P2 | partial |
| .skilled/changelog/skilled/v4.1.0.0.md | D2 | 2, 6 | 0 P0, 0 P1, 3 P2 | partial |
| runtime/lib/scorer/lane-registry.ts | D2 | 7 | 0 P0, 0 P1, 1 P2 | partial |
| .skilled/skills/system-skill-advisor/changelog/v1.3.0.0.md | D1, D2 | 8 | 0 P0, 0 P1, 1 P2 | partial |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 16
- Convergence threshold: 0.1
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-vibe-2-1795172940208-84a42n, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 24 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: files
- Cross-reference checks: core=spec_code, checklist_evidence, overlay=skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability
- Started: 2026-11-20T11:10:34.141Z
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
- Dimension: test-coverage
- Files: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs, .skilled/skills/system-spec-kit/runtime/cli/tests/deep-research-contract-parity.vitest.ts
- Why: Iteration 2 surfaced a P0 (convergence-path coverage gap); needs a focused follow-up before correctness can terminate PASS.

## 9. COVERAGE MATRIX
| Dimension            | Status     | Iterations touched |
|----------------------|------------|--------------------|
| correctness          | converged  | 1                  |
| test-coverage        | converging | 2, 4               |
| cross-runtime-parity | converging | 3                  |
| observability        | converging | 4                  |
```
