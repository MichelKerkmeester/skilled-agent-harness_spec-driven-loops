---
title: "Decision Record: opus deep-review remediation"
description: "Architecture decisions and per-finding disposition register for remediating the 017 Opus deep review: shared fixture-id guard parity for the first-writer materializer, bundle-gate criteria-exec gating plus doc truth, Lane B benchmark-mode promotion, grader prompt-injection defense, and score-cache read integrity."
trigger_phrases:
  - "opus review remediation decisions"
  - "017 disposition register"
  - "benchmark-mode promotion decision"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/121-deep-agent-improvement-benchmark-mode/018-opus-review-remediation"
    last_updated_at: "2026-05-29T17:10:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored 018 ADRs + per-finding disposition register"
    next_safe_action: "Implement per the ADRs then fill dispositions"
    blockers: []
    key_files:
      - "../017-two-lane-opus-deep-review/review/review-report.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "remediation-018-20260529"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Decision Record: opus deep-review remediation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Close the first-writer materializer traversal with a shared fixture-id guard, not a second inline copy

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-29 |
| **Deciders** | Orchestrator, remediation agent |

---

<!-- ANCHOR:adr-001-context -->
### Context

F017-P1-01 found that the materializer is the FIRST writer in the wired Lane B plan and writes `path.join(outputsDir, fixture.id + '.md')` with no id guard, so a hostile id such as `../escaped-by-materializer` escapes the outputs directory at materialization time. The 015 F-P1-9 hardening added `assertSafeFixtureId` and `SAFE_FIXTURE_ID` only to run-benchmark.cjs, the second writer. The two writers must enforce one identical rule, and the run-benchmark reject semantics must not drift.

### Constraints

- run-benchmark already owns the canonical `SAFE_FIXTURE_ID` rule; its reject semantics must stay byte-identical so the existing traversal test keeps passing.
- The materializer runs before run-benchmark, so the guard must fire at materialization, not only at scoring.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Extract the `SAFE_FIXTURE_ID` regex and the assert into a shared helper under `scripts/lib/`, require it in both run-benchmark.cjs and materialize-benchmark-fixtures.cjs, and call it before the materializer's `path.join` write.

**How it works**: The helper is the single source of the reject rule (separators, `..`, absolute syntax, empty). run-benchmark consumes it with identical semantics so its test is unchanged. The materializer calls the same assert before writing, so a hostile id is refused at the first writer with an `infra_failure`-equivalent error rather than escaping outputsDir.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Shared helper required by both writers (chosen)** | One rule, no drift, covers first and second writer | Adds a lib file and two requires | 9/10 |
| Inline a second copy of the guard in the materializer | No new file | Two copies drift over time, the exact failure mode that produced this finding | 4/10 |

**Why this one**: A shared helper makes the parity an enforced invariant rather than a hand-maintained byte-alignment contract, which is precisely the gap that left the materializer unguarded after 015.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Both Lane B writers reject hostile fixture ids with one rule.
- A future third writer requires the same helper instead of re-deriving the rule.

**What it costs**:
- One new lib file and two require sites.
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | First-writer traversal escapes outputsDir at materialization |
| 2 | **Beyond Local Maxima?** | PASS | Inline-copy alternative considered and rejected (drift risk) |
| 3 | **Sufficient?** | PASS | One shared rule covers both writers |
| 4 | **Fits Goal?** | PASS | Closes the active P1 traversal class |
| 5 | **Open Horizons?** | PASS | A future third writer requires the same helper |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `scripts/lib/` new shared fixture-id guard (`SAFE_FIXTURE_ID` + assert).
- `scripts/model-benchmark/run-benchmark.cjs`: consume the shared guard.
- `scripts/shared/materialize-benchmark-fixtures.cjs`: call the assert before path.join.
- `scripts/tests/run-benchmark-hardening.vitest.ts`: materializer hostile-id test.

**How to roll back**: Revert the materializer require and the shared lib; run-benchmark falls back to its inline guard and the existing traversal test still passes.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Route the bundle-gate Layer-3 execSync through the existing criteria-exec gate and make SKILL.md true

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-29 |
| **Deciders** | Orchestrator, remediation agent |

---

<!-- ANCHOR:adr-002-context -->
### Context

F017-P1-02 found that `DEEP_AGENT_ALLOW_CRITERIA_EXEC=0` is applied only to the type=deterministic execSync branch in score-model-variant.cjs, while bundle-gate scoreLayer3 runs `execSync(acceptance.command)` with no env-gate check. bundle-gate is the D2 hard gate. SKILL.md:279 documents the gate as refusing criteria-driven shell execution in the 5-dim scorer, which bundle-gate Layer-3 is, so the documented fail-closed guarantee is currently false. The gap is dormant by default (shipped fixtures carry no command) but live the moment a profile defines a smoke-run or deterministic-plus-command acceptance under `--scorer 5dim`.

### Constraints

- Command-free profiles must score identically before and after, so the default path cannot change.
- The gate must fail closed, matching the documented control, when the flag is 0.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: Route bundle-gate Layer-3 through the same `DEEP_AGENT_ALLOW_CRITERIA_EXEC` gate, early-returning a skipped layer when the flag is 0, so no execSync runs.

**How it works**: When the flag is 0 and an acceptance selects the smoke-run or deterministic-plus-command branch, Layer-3 returns a skipped result instead of executing. Command-free acceptances are unaffected, so their scores are byte-identical. A smoke-run regression test asserts no execution under the flag.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Route Layer-3 through the env gate (chosen)** | Matches the documented control, one consistent gate across both exec paths | Slight branch complexity in bundle-gate | 9/10 |
| Strip acceptance[].command before the virtual fixture is written when the flag is set | Removes the command earlier | Mutates the fixture shape, harder to reason about, surprising to a profile author | 6/10 |

**Why this one**: Reusing the existing env gate makes the documented SKILL.md guarantee literally true for both exec paths with one consistent mechanism.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- The documented fail-closed control covers the D2 hard gate.
- Hardened or shared-runner deployments can set the flag to 0 and trust it.

**What it costs**:
- A profile that relied on bundle-gate executing without the opt-in must set the flag to 1.
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The documented fail-closed control is false for the D2 hard gate |
| 2 | **Beyond Local Maxima?** | PASS | Command-stripping alternative considered and rejected |
| 3 | **Sufficient?** | PASS | One gate now covers both exec paths |
| 4 | **Fits Goal?** | PASS | Makes SKILL.md:279 literally true |
| 5 | **Open Horizons?** | PASS | Hardened deployments can trust the flag |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- `scripts/model-benchmark/scorer/deterministic/bundle-gate.cjs`: Layer-3 early-return a skipped layer when `DEEP_AGENT_ALLOW_CRITERIA_EXEC=0`.
- `scripts/tests/scorer.vitest.ts`: smoke-run no-execution test under the flag.

**How to roll back**: Revert the bundle-gate gate-check; the layer executes as before. Command-free profiles are unaffected either way.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Give promote-candidate.cjs a benchmark-mode path and make every doc state the resolved behavior

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-29 |
| **Deciders** | Orchestrator, remediation agent |

---

<!-- ANCHOR:adr-003-context -->
### Context

F017-P1-04 found two coupled defects. First, the Lane B auto YAML invokes promote-candidate.cjs as if a scored agent candidate exists, but the Lane B phase loop runs only loop-host (materialize plus run-benchmark) and reduce-state, so there is no candidate write, no score-candidate step, and no manifest. promote-candidate.cjs hard-requires `--score`, rejects unless `score.status==="scored"`, and rejects unless `score.recommendation==="candidate-better"`. The Lane B report.json carries `status=benchmark-complete` with no dimensions and no candidate-better recommendation, so promotion cannot execute. Second, the promoter has zero mode or lane branching, yet SKILL.md:278 and start-model-benchmark-loop.md:409/411/496 claim mode-aware promotion. The genuine record-level mode-awareness lives in reduce-state.cjs:620, which the docs conflate with non-existent promoter mode-awareness.

### Constraints

- The agent-canonical guarded promotion path (manifest target, 4-runtime mirror sync, copy candidate over target) must stay unchanged for Lane A.
- Lane B produces a benchmark-complete report, not a scored agent candidate, so the promotion basis differs.
- Every doc that touches Lane B promotion must describe the SAME resolved behavior.
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: Add a benchmark-mode promotion path to promote-candidate.cjs. When `--benchmark-report` is provided and the report status is `benchmark-complete` with a passing recommendation, the promoter promotes on that basis, bypassing the agent-scored-file requirement. The agent-scored path is unchanged when no benchmark report is passed. Then correct every doc to state the resolved behavior: records and the reducer are mode-aware, and promotion gains a benchmark-mode branch driven by the benchmark-complete report (it is NOT a generic mode-aware promoter beyond that branch).

**How it works**: promote-candidate.cjs reads `--benchmark-report`, validates the report `status==="benchmark-complete"` and a passing recommendation, and promotes through the guarded path on that basis instead of requiring `score.status==="scored"`. The YAML promotion step is rewritten to pass `--benchmark-report` so it is executable. SKILL.md, start-model-benchmark-loop.md, and the YAML drop the over-claiming "mode-aware promotion" wording and instead state that records and the reducer are mode-aware while promotion has a benchmark-mode branch on top of the shared agent-canonical guarded path.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Benchmark-mode promotion branch + doc truth (chosen)** | Lane B promotion executes; docs match code; agent path untouched | Adds a second promotion basis to the promoter | 9/10 |
| Mark Lane B promotion not-yet-wired and remove the YAML step | Smallest code change | Leaves Lane B without a promotion path; a regression versus the YAML's intent | 6/10 |
| Build a separate Lane B promoter | Clean separation | Duplicates the guarded mirror-sync and manifest logic | 5/10 |

**Why this one**: The shared P1-04 resolution requires both that Lane B promotion be executable and that the docs stop over-claiming. A gated benchmark-report branch on the existing guarded promoter does both with the least duplication, and the agent-canonical path stays intact.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- The Lane B promotion step executes on a passing benchmark-complete report.
- SKILL.md, the command doc, and the YAML describe one consistent resolved behavior.

**What it costs**:
- The promoter carries two promotion bases (agent-scored and benchmark-report), gated by argument presence.
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The Lane B promotion step cannot execute and the docs over-claim |
| 2 | **Beyond Local Maxima?** | PASS | Separate-promoter and remove-step alternatives rejected |
| 3 | **Sufficient?** | PASS | Executable promotion plus one consistent doc story |
| 4 | **Fits Goal?** | PASS | Closes the shared P1-04 resolution (code + doc truth) |
| 5 | **Open Horizons?** | PASS | The agent-canonical path stays the guarded default |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- `scripts/shared/promote-candidate.cjs`: benchmark-mode branch for `--benchmark-report` + benchmark-complete.
- `deep_start-model-benchmark-loop_auto.yaml`: executable promotion step passing `--benchmark-report`.
- `SKILL.md`, `start-model-benchmark-loop.md`, the auto YAML: corrected promotion wording.
- `scripts/tests/remediation.vitest.ts`: benchmark-mode promotion test + agent-path-unchanged assertion.

**How to roll back**: Revert the promoter branch and the YAML step; the agent-only promoter and the not-yet-wired Lane B promotion return, and the docs revert with them.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: Treat graded model output as data-only and harden the grader against prompt injection

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-29 |
| **Deciders** | Orchestrator, remediation agent |

---

<!-- ANCHOR:adr-004-context -->
### Context

F017-P2-12 found that composeGraderPrompt embeds untrusted output text in a fenced block adjacent to the grading instruction, so a benchmarked model could fence-breakout and instruct the grader to return an inflated score. clampScore01 bounds only [0,1], not an in-range inflated score. This is live only on `--grader llm` (default noop), weight 0.15, and under the current model-blind wiring the graded text is the trusted fixture reference, so it is forward-looking. The companion F017-P2-13a found the grader cache root is a fixed in-repo location, not run-scoped, and the cache-hit path re-clamps but never re-validates against key inputs.

### Constraints

- The fix must not break the noop or mock grader paths.
- The grader cache key must be re-verifiable on read.
<!-- /ANCHOR:adr-004-context -->

---

<!-- ANCHOR:adr-004-decision -->
### Decision

**We chose**: Harden the grader system prompt to treat the graded output strictly as data, cross-check D4 against the deterministic hallucination-flag det-check on the llm path, anchor the grader cache under the run or packet outputs dir, and verify the derived key inside the cached blob on read.

**How it works**: composeGraderPrompt frames the output text as untrusted data and instructs the grader to ignore any embedded instructions. On the llm path D4 is cross-checked against the hallucination-flag det-check so an inflated score is caught. The grader cache moves under the run-scoped outputs dir, and the cache-hit path asserts the embedded key matches the recomputed key, treating a mismatch as a miss.
<!-- /ANCHOR:adr-004-decision -->

---

<!-- ANCHOR:adr-004-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Data-only prompt + det-check cross-check + run-scoped verified cache (chosen)** | Defense-in-depth against injection and a poisoned cache | Touches the grader and cache modules | 8/10 |
| Clamp-only, no prompt hardening | Smallest change | Does not stop in-range inflation, the actual finding | 3/10 |

**Why this one**: clampScore01 already exists and does not stop the attack, so the residual must be closed at the prompt and via a deterministic cross-check, with the cache made run-scoped and key-verified to match the score-candidate F-P1-11 posture.
<!-- /ANCHOR:adr-004-alternatives -->

---

<!-- ANCHOR:adr-004-consequences -->
### Consequences

**What improves**:
- The llm grader resists fence-breakout injection and a cross-process cache poison.

**What it costs**:
- The grader cache no longer persists across runs at the old in-repo location.
<!-- /ANCHOR:adr-004-consequences -->

---

<!-- ANCHOR:adr-004-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | clampScore01 does not stop in-range injected inflation |
| 2 | **Beyond Local Maxima?** | PASS | Clamp-only alternative rejected |
| 3 | **Sufficient?** | PASS | Prompt hardening + det-check + verified run-scoped cache |
| 4 | **Fits Goal?** | PASS | Closes the forward-looking grader injection surface |
| 5 | **Open Horizons?** | PASS | Matches the score-candidate F-P1-11 cache posture |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-004-five-checks -->

---

<!-- ANCHOR:adr-004-impl -->
### Implementation

**What changes**:
- `scripts/model-benchmark/scorer/grader/harness.cjs`: data-only system prompt + D4 det-check cross-check on the llm path.
- `scripts/model-benchmark/scorer/lib/cache.cjs`: run-scoped grader cache root + embedded key verify on read.

**How to roll back**: Revert the harness and cache edits; the grader returns to the prior prompt and the fixed in-repo cache location.
<!-- /ANCHOR:adr-004-impl -->
<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005 -->
## ADR-005: Verify the embedded inputHash on score-cache read instead of trusting the filename

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-29 |
| **Deciders** | Orchestrator, remediation agent |

---

<!-- ANCHOR:adr-005-context -->
### Context

F017-P2-10 found readCachedScore returns the parsed blob verbatim without asserting `cached.inputHash === inputHash`, so the filename is the only integrity binding. The F-P1-11 packet-local relocation reduced the surface, and an attacker who can write the cache file usually already controls the candidate, but the read path should still re-validate.

### Constraints

- A mismatch must be a cache miss, not a hard error, so the loop rescore continues.
<!-- /ANCHOR:adr-005-context -->

---

<!-- ANCHOR:adr-005-decision -->
### Decision

**We chose**: After JSON.parse, assert `cached.inputHash === inputHash` and `cached.status === "scored"`, and on mismatch treat the entry as a cache miss and rescore.

**How it works**: The read path recomputes the input hash and compares it against the embedded value plus the status field. On mismatch it discards the cached blob and falls through to a fresh score, so a tampered or stale cache entry cannot inject a score.
<!-- /ANCHOR:adr-005-decision -->

---

<!-- ANCHOR:adr-005-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Verify embedded inputHash + status on read (chosen)** | Closes the read-integrity gap, fails safe to rescore | One extra comparison on the read path | 9/10 |
| Sign the cache file | Strong integrity | Heavy for a packet-local cache an attacker who writes it usually already controls | 4/10 |

**Why this one**: The lightweight embedded-hash check matches the threat (a stale or swapped cache file) and fails safe to a rescore.
<!-- /ANCHOR:adr-005-alternatives -->

---

<!-- ANCHOR:adr-005-consequences -->
### Consequences

**What improves**:
- A score cache entry must match its key inputs to be trusted, not just its filename.

**What it costs**:
- A rescore on hash mismatch, which is the safe outcome.
<!-- /ANCHOR:adr-005-consequences -->

---

<!-- ANCHOR:adr-005-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The filename is the only integrity binding today |
| 2 | **Beyond Local Maxima?** | PASS | Signing alternative rejected as too heavy |
| 3 | **Sufficient?** | PASS | Embedded hash + status check fails safe to rescore |
| 4 | **Fits Goal?** | PASS | Closes the read-integrity P2 |
| 5 | **Open Horizons?** | PASS | Lightweight, matches the threat model |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-005-five-checks -->

---

<!-- ANCHOR:adr-005-impl -->
### Implementation

**What changes**:
- `scripts/agent-improvement/score-candidate.cjs`: assert `cached.inputHash` and `cached.status` on read; rescore on mismatch.

**How to roll back**: Revert the read-path assertion; the reader trusts the filename hash as before.
<!-- /ANCHOR:adr-005-impl -->
<!-- /ANCHOR:adr-005 -->

---

<!-- ANCHOR:disposition-register -->
## Per-Finding Disposition Register

Every active 017 finding carries exactly one disposition. FIXED items reference the ADR and the test or evidence; DOCUMENT-ACCEPT items carry a rationale. Evidence is filled as fixes land.

### P1 (4)

| Finding | Disposition | Rationale / Evidence |
|---------|-------------|----------------------|
| F017-P1-01 materializer fixture-id traversal | FIXED | ADR-001 shared guard ported into the materializer; hostile-id regression test (T003) |
| F017-P1-02 bundle-gate fail-open execSync | FIXED | ADR-002 Layer-3 routed through the criteria-exec gate; smoke-run no-exec test (T007) |
| F017-P1-03 dead Mode-4 anchors | FIXED | Repoint the three anchors to `§4 LANE B: MODEL-BENCHMARK` (T014) |
| F017-P1-04 Lane B promotion non-executable + over-claim docs | FIXED | ADR-003 benchmark-mode promotion branch + doc truth across SKILL.md, command doc, YAML; promotion test (T011) |

### P2 (13)

| Finding | Disposition | Rationale / Evidence |
|---------|-------------|----------------------|
| F017-P2-01 Lane B model-blind headline | DOCUMENT-ACCEPT (deferral) + FIXED (doc) | Arbiter-upheld 122/007 to 014/015 F-P0-2 model-dispatch deferral stays accepted; the residual doc over-claim is reworded to the deferred reality (T015) |
| F017-P2-02 unreachable dispatch-model resolver branch | FIXED | Drop the unused LANE_MODEL_BENCHMARK entry (or wire it) (T022) |
| F017-P2-03 criteria-grep file-read containment | FIXED | Separator-bounded isInside containment on the resolved path (T004) |
| F017-P2-04 advisor single-node comment stale | FIXED | Update the explicit.ts comment to the two-node projection (T016) |
| F017-P2-05 four-dialect parseArgs divergence | FIXED | Shared parse-args helper (T018) |
| F017-P2-06 duplicated integration-score | FIXED | Shared integration-score helper resolving status/syncStatus (T019) |
| F017-P2-07 cwd-check dead third parameter | FIXED | Drop the unused parameter and call-site argument (T021) |
| F017-P2-08 mixed provenance tags | FIXED | Normalize tags to this packet's lineage or label ported upstream rationale (T017) |
| F017-P2-09 duplicated fixturePathFor / default dir | FIXED | Shared profile-resolve helper imported in both writers (T020) |
| F017-P2-10 score-cache read-integrity | FIXED | ADR-005 verify embedded inputHash + status on read (T023) |
| F017-P2-11 bare finding-id-shaped source comments | FIXED | Packet-qualified citation form so comments do not collide with an active review namespace (T017) |
| F017-P2-12 grader prompt-injection surface | FIXED | ADR-004 data-only grader prompt + det-check cross-check on the llm path (T008) |
| F017-P2-13 grader cache run-scope + systemFitness ref oracle | FIXED | ADR-004 run-scoped key-verified grader cache (T009); basename-sanitize cmd/skill refs before fs.existsSync (T005) |
<!-- /ANCHOR:disposition-register -->
