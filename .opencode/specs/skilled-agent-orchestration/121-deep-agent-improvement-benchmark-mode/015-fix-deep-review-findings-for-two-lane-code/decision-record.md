---
title: "Decision Record: fix deep-review findings for two-lane code"
description: "Architecture decisions and per-finding disposition register for remediating the 014 two-lane deep review: space-form parser, read-only grader sandbox, fixture-id sanitization, criteria-exec fail-closed default, packet-local candidate-keyed cache."
trigger_phrases:
  - "two-lane remediation decisions"
  - "014 disposition register"
  - "Lane B parser decision"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/121-deep-agent-improvement-benchmark-mode/015-fix-deep-review-findings-for-two-lane-code"
    last_updated_at: "2026-05-29T12:50:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored 015 ADRs + per-finding disposition register"
    next_safe_action: "Implement per the ADRs then fill dispositions"
    blockers: []
    key_files:
      - "../014-review-two-lane-workflow-implementation/review/all-findings.jsonl"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "remediation-20260529"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Decision Record: fix deep-review findings for two-lane code

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Fix the P0 by teaching parseArgs the space-form, not by rewriting the command surfaces

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-29 |
| **Deciders** | Orchestrator, remediation agent |

---

<!-- ANCHOR:adr-001-context -->
### Context

The 014 review confirmed F-P0-1: `loop-host.cjs` `parseArgs` only accepts `--key=value` and bare flags, but all three Lane B command surfaces invoke loop-host with SPACE-form flags (`--profile {profile} --scorer {scoring_method} --grader {grader}`), so `profile`, `outputs-dir`, `scorer`, and `grader` all parse to `true`. The model-benchmark command does not run as intended. We could either teach the parser the space-form or rewrite the three command surfaces to `=`-form.

### Constraints

- TST-1 byte-identity gate must hold: the `=`-form parse path and the Lane A plan must be byte-identical pre and post fix.
- The space-style command surface is the natural, readable form and matches the rest of the deep-loop commands.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Teach `parseArgs` to accept both `--key=value` and `--key value`, consuming the next non-`--` token as the value when no `=` is present.

**How it works**: The parser keeps the existing `=`-form branch untouched, so its output is byte-identical. When a flag has no `=` and the following argv token is not another `--flag`, the parser consumes that token as the value; otherwise it stores `true` as before. A regression test asserts space-form parsing and a separate assertion confirms the `=`-form plan is byte-identical (TST-1 safe).
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Parser accepts space-form (chosen)** | One fix covers all 3 surfaces; matches command style; TST-1 safe | Parser logic slightly more complex | 9/10 |
| Rewrite 3 surfaces to `=`-form | No parser change | 3 edit sites; brittle; diverges from command style; still fails if a 4th caller uses space-form | 5/10 |

**Why this one**: The parser is the single chokepoint; fixing it once is robust and matches how the command surfaces are actually written, and it stays TST-1 safe because the `=`-form branch is unchanged.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- The Lane B command runs as intended through the YAML path.
- Future space-form callers parse correctly without further edits.

**What it costs**:
- Slightly more parser logic. Mitigation: covered by a focused space-form test plus a TST-1 identity assertion.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Space-form consumes a following flag as a value | M | Only consume the next token when it does not match `^--`; test both adjacency cases |
| `=`-form path perturbed and TST-1 breaks | H | Leave the `=`-form branch byte-identical; assert TST-1 in the test |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | P0 release blocker; Lane B is broken without it |
| 2 | **Beyond Local Maxima?** | PASS | Surface-rewrite alternative considered and rejected |
| 3 | **Sufficient?** | PASS | One parser change covers all three surfaces |
| 4 | **Fits Goal?** | PASS | Directly clears the CONDITIONAL verdict blocker |
| 5 | **Open Horizons?** | PASS | Robust to future space-form callers |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `scripts/shared/loop-host.cjs` `parseArgs`: additive space-form branch.
- `scripts/tests/loop-host.vitest.ts`: space-form test + TST-1 identity assertion.

**How to roll back**: Revert the `parseArgs` edit and the added test; re-run vitest to confirm the `=`-form baseline.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Run grader/executor dispatch read-only by default with an explicit write-capable opt-in

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-29 |
| **Deciders** | Orchestrator, remediation agent |

---

<!-- ANCHOR:adr-002-context -->
### Context

F-P1-1 found `buildSpawnSpec` runs external model executors with write-capable modes (Claude `--permission-mode acceptEdits`, Codex `--sandbox workspace-write`, Devin `--permission-mode auto`). Grading and benchmarking should observe output, not edit the workspace.

### Constraints

- A legitimate write-capable evaluation profile may exist and must remain reachable via an explicit, isolated opt-in.
- The default must be safe without configuration.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: Default grader/executor dispatch to read-only/no-edit modes, with an explicit documented opt-in for write-capable evaluation in an isolated temp workspace, and assert `cwd` stays inside the benchmark sandbox before spawning.

**How it works**: `buildSpawnSpec` emits read-only permission flags per executor by default. A documented opt-in flag or env var switches to write-capable mode only when the caller explicitly requests it, and the spawn path validates the resolved `cwd` is inside the benchmark sandbox first.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Read-only default + opt-in (chosen)** | Safe by default; write path still reachable | Opt-in surface to document | 9/10 |
| Keep write-capable default | No change | Grading can mutate the workspace; violates least privilege | 2/10 |

**Why this one**: Least privilege for an evaluation path that should only observe, with an escape hatch for the rare write-capable case.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- Grader dispatch cannot edit the workspace by default.
- `cwd` containment is verified before any spawn.

**What it costs**:
- An opt-in surface to document. Mitigation: documented alongside the criteria-exec opt-in.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A profile depended on write-capable default | M | Opt-in restores it explicitly; surfaced in docs |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Write-capable grading is a real privilege gap |
| 2 | **Beyond Local Maxima?** | PASS | Keep-default alternative rejected |
| 3 | **Sufficient?** | PASS | Default closed + opt-in covers both needs |
| 4 | **Fits Goal?** | PASS | Security cluster fix-before-promote |
| 5 | **Open Horizons?** | PASS | Sandbox containment generalizes |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- `scripts/model-benchmark/dispatch-model.cjs` `buildSpawnSpec`: read-only default + cwd sandbox assert + opt-in.
- A spawn-spec test asserts read-only-by-default per executor.

**How to roll back**: Revert the `buildSpawnSpec` edit; the prior write-capable flags return.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Sanitize fixture IDs as basenames and assert the resolved path stays inside the outputs directory

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-29 |
| **Deciders** | Orchestrator, remediation agent |

---

<!-- ANCHOR:adr-003-context -->
### Context

F-P1-9 found fixture-controlled `fixture.id` is used in `path.join(outputsDir, ` + "`${fixture.id}.md`" + `)` without validating it is a basename or that the resolved path stays under `outputsDir`. A crafted id with separators or `..` can read or score files outside the benchmark output directory.

### Constraints

- Legitimate fixture ids are plain basenames today; the guard must not reject those.
- The guard must cover separators, backslashes, `..`, absolute syntax, and empty ids.
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: Reject fixture ids that contain path separators, absolute-path syntax, or `..`, then resolve the output path and assert it remains a child of the resolved outputs directory before reading or scoring.

**How it works**: A small guard validates the id is a single safe basename, the runner resolves `outputsDir` and the candidate path, and asserts containment via a separator-bounded prefix check before any file access.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Basename guard + resolved-inside-outputs assert (chosen)** | Defense in depth; both id-shape and resolved-path checked | Two checks to maintain | 9/10 |
| Resolved-path assert only | Simpler | Misses early, clearer id-shape rejection | 6/10 |

**Why this one**: An id-shape reject gives a clear early failure, and the resolved-path containment assert is the authoritative invariant.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- Fixture ids cannot escape the benchmark output directory.

**What it costs**:
- A guard plus an adversarial table test. Mitigation: small and covered by a 6-row matrix.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Guard rejects a legitimate id shape | L | Plain basenames pass; matrix proves accept/reject rows |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Traversal from fixture-controlled input |
| 2 | **Beyond Local Maxima?** | PASS | Resolved-only alternative rejected |
| 3 | **Sufficient?** | PASS | Id-shape + containment covers the axes |
| 4 | **Fits Goal?** | PASS | Security cluster fix |
| 5 | **Open Horizons?** | PASS | Containment pattern reusable |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- `scripts/model-benchmark/run-benchmark.cjs`: fixture-id guard + resolved-inside-outputs assert.
- An adversarial table test (basename, separator, backslash, `..`, absolute, empty).

**How to roll back**: Revert the guard and the table test; the prior unguarded join returns.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: Default criteria shell execution to fail-closed with a documented opt-in

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-29 |
| **Deciders** | Orchestrator, remediation agent |

---

<!-- ANCHOR:adr-004-context -->
### Context

F-P1-10 found the hardening note says `DEEP_AGENT_ALLOW_CRITERIA_EXEC=0` refuses criteria-driven shell execution, but the gate defaults permissive for backward compatibility. A default-open shell-execution gate is a standing security gap. The 121/004 remediation chose ON-by-default for backward-compat; the 014 review re-flagged it, so this packet revisits the default.

### Constraints

- Existing trusted benchmark profiles may rely on criteria execution and must remain reachable via explicit opt-in.
- The default must be safe without configuration.
<!-- /ANCHOR:adr-004-context -->

---

<!-- ANCHOR:adr-004-decision -->
### Decision

**We chose**: Fail closed by default. Criteria command execution is disabled unless an explicit documented opt-in is set, and the refusal path emits a clear message naming the opt-in.

**How it works**: The gate inverts to default-off. Trusted profiles set the documented opt-in env var to re-enable criteria execution; without it the runner refuses and explains how to opt in.
<!-- /ANCHOR:adr-004-decision -->

---

<!-- ANCHOR:adr-004-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Fail-closed default + opt-in (chosen)** | Secure by default; trusted path explicit | Opt-in required for profiles that used exec | 9/10 |
| Keep ON-by-default (121/004 choice) | No profile changes | Standing default-open shell exec; re-flagged by 014 | 4/10 |

**Why this one**: 014 explicitly recommended fail-closed; secure-by-default outweighs the backward-compat convenience now that the opt-in is documented.
<!-- /ANCHOR:adr-004-alternatives -->

---

<!-- ANCHOR:adr-004-consequences -->
### Consequences

**What improves**:
- No criteria-driven shell execution runs without an explicit opt-in.

**What it costs**:
- Trusted profiles that used criteria exec must set the opt-in. Mitigation: clear refusal message + doc.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A trusted profile breaks until opt-in is set | M | Refusal message names the opt-in; documented in SKILL.md |
<!-- /ANCHOR:adr-004-consequences -->

---

<!-- ANCHOR:adr-004-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Default-open shell exec is a real gap |
| 2 | **Beyond Local Maxima?** | PASS | Keep-ON alternative considered and rejected |
| 3 | **Sufficient?** | PASS | Default-off + opt-in covers both needs |
| 4 | **Fits Goal?** | PASS | Security cluster fix-before-promote |
| 5 | **Open Horizons?** | PASS | Secure-by-default is the durable posture |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-004-five-checks -->

---

<!-- ANCHOR:adr-004-impl -->
### Implementation

**What changes**:
- The criteria-exec gate default inverts to disabled.
- `SKILL.md` documents the opt-in env var and the secure-by-default posture.

**How to roll back**: Restore the prior default-on gate value and the SKILL.md note.
<!-- /ANCHOR:adr-004-impl -->
<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005 -->
## ADR-005: Move the score cache packet-local and key it by candidate

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-29 |
| **Deciders** | Orchestrator, remediation agent |

---

<!-- ANCHOR:adr-005-context -->
### Context

Two findings target the score cache. F-P1-11: `defaultCacheDir()` stores scores under `os.tmpdir()/deep-agent-improvement-score-cache`, a shared world-writable path that is later trusted before rescoring. F-P1-12: the cache input hash includes candidate content and target path but not `candidatePath` or `baselinePath`, so a cache hit can carry the wrong candidate or baseline path in the result payload.

### Constraints

- Cache must not be trusted across owners or from a shared temp path.
- Cache hits must not mislabel which candidate or baseline produced the score.
<!-- /ANCHOR:adr-005-context -->

---

<!-- ANCHOR:adr-005-decision -->
### Decision

**We chose**: Store the cache packet-local (under the runtime/packet root) with owner/mode validation, treat unreadable or untrusted entries as cache misses, and include `candidatePath` and `baselinePath` in the cache key.

**How it works**: `defaultCacheDir()` resolves under the packet/runtime root with restrictive permissions; reads validate owner and mode and fall back to a miss on mismatch. The cache key hash adds the candidate and baseline paths, so a hit always corresponds to the exact candidate it scored.
<!-- /ANCHOR:adr-005-decision -->

---

<!-- ANCHOR:adr-005-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Packet-local + candidate-keyed (chosen)** | Closes the trust gap and the mislabel gap together | Cache no longer shared across packets | 9/10 |
| Rewrite path fields on hit only | Smaller change | Leaves the shared-tmp trust gap open | 5/10 |

**Why this one**: Both findings share the cache; one coherent change closes both, and a packet-local cache is the correct trust boundary.
<!-- /ANCHOR:adr-005-alternatives -->

---

<!-- ANCHOR:adr-005-consequences -->
### Consequences

**What improves**:
- The cache is no longer trusted from a shared world-writable path.
- A cache hit always names the correct candidate and baseline.

**What it costs**:
- Cache is no longer shared across packets. Mitigation: per-packet caches are cheap and correct.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Owner/mode check rejects a valid cache | L | Treated as a miss; rescoring is correct, only slower |
<!-- /ANCHOR:adr-005-consequences -->

---

<!-- ANCHOR:adr-005-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Shared-tmp trust + mislabel are real |
| 2 | **Beyond Local Maxima?** | PASS | Rewrite-on-hit alternative rejected |
| 3 | **Sufficient?** | PASS | One change closes both findings |
| 4 | **Fits Goal?** | PASS | Security + traceability fix |
| 5 | **Open Horizons?** | PASS | Packet-local cache is durable |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-005-five-checks -->

---

<!-- ANCHOR:adr-005-impl -->
### Implementation

**What changes**:
- `scripts/agent-improvement/score-candidate.cjs`: packet-local cache dir + owner/mode validation; cache key includes candidate and baseline paths.
- Tests: cache-key test + owner-mismatch miss test.

**How to roll back**: Restore the prior `os.tmpdir()` cache dir and the prior cache-key hash; revert the tests.
<!-- /ANCHOR:adr-005-impl -->
<!-- /ANCHOR:adr-005 -->

---

<!-- ANCHOR:disposition-register -->
## PER-FINDING DISPOSITION REGISTER

Every active 014 finding gets exactly one disposition: FIXED (real code or doc fix plus a test or adversarial check where applicable) or DOCUMENT-ACCEPT (an intended trusted-author boundary or by-design behavior, recorded with rationale). No silent drops. Status is planned at packet open and updated to the final disposition as fixes land.

| ID | Severity | Title | Planned Disposition | Notes |
|----|----------|-------|---------------------|-------|
| F-P0-1 | P0 | Lane B command flags misparse to booleans | FIXED | ADR-001; space-form parseArgs + test + e2e |
| F-P0-2 | P0 (refuted) | Model benchmark never dispatches a model | DOCUMENT-ACCEPT | Intended deferral (122/007 F-P2-1, arbiter-upheld); default path is fixture scoring with `--grader noop` |
| F-P1-1 | P1 | Grader/executor dispatch grants write perms | FIXED | ADR-002; read-only default + opt-in + cwd assert |
| F-P1-2 | P1 | Lane B YAML interpolates `{profile}` unquoted | FIXED | Quote or argv-array both Lane B YAMLs |
| F-P1-3 | P1 | Lane B emits an invalid session outcome | FIXED | Use a valid SESSION_OUTCOMES value (advisoryOnly) in both YAMLs |
| F-P1-4 | P1 | LLM executor fields dropped before dispatch | FIXED | Thread `--executor`/`--model` through YAML, loop-host, run-benchmark |
| F-P1-5 | P1 | Benchmark plateau stop not implemented | FIXED | Add aggregate-score plateau check + stop reason in reduce-state |
| F-P1-6 | P1 | Lane B config path split across two bindings | FIXED | Consolidate on one canonical Lane B config artifact |
| F-P1-7 | P1 | Failure reports lose scorer provenance | FIXED | Add scoringMethod/grader to failure report + infra_failure row |
| F-P1-8 | P1 | Explicit Lane B shadowed by agent-path check order | FIXED | Resolve explicit lane before agent-path inference; fail fast on conflict |
| F-P1-9 | P1 | Fixture IDs can escape the output directory | FIXED | ADR-003; basename guard + resolved-inside-outputs assert + table test |
| F-P1-10 | P1 | Criteria shell execution defaults open | FIXED | ADR-004; fail-closed default + documented opt-in |
| F-P1-11 | P1 | Score cache trusted from a shared temp path | FIXED | ADR-005; packet-local + owner/mode validation |
| F-P1-12 | P1 | Cached scores can point at the wrong candidate | FIXED | ADR-005; cache key includes candidate/baseline path |
| F-P1-13 | P1 | Benchmark report.json overwritten across iterations | FIXED | Iteration-scoped immutable reports; persist immutable path in ledger |
| F-P1-14 | P1 | Pause state not packet-local | FIXED | Write pause sentinel under `{spec_folder}/improvement`; record path |
| F-P1-15 | P1 | Lane B promotion gate references Lane A artifacts | FIXED | Bind Lane B artifacts or remove promotion until schema is defined |
| F-P1-16 | P1 | Agent Lane note cites OLD flat script paths (4 mirrors) | FIXED | Repoint to lane-separated paths across all 4 mirrors |
| P2 traceability-3-4 | P2 | Agent note old script paths | FIXED | Overlaps F-P1-16; repointed |
| P2 traceability-3-5 | P2 | Pause resume hint points nowhere | FIXED | Repo-relative resume command to shared loop-host path |
| P2 traceability-3-6 | P2 | Spawn path mapping untested | FIXED | Import resolveScriptPath; assert lane paths while keeping plan byte-identical |
| P2 traceability-7-5 | P2 | Benchmark result omits profile provenance | FIXED | Persist profilePath/version/fixtureDir in report + ledger |
| P2 traceability-7-6 | P2 | Ledger writer ownership ambiguous | FIXED | Make run-benchmark the sole writer; YAML step verifies the row |
| P2 maintainability-4-1 | P2 | Max-iteration binding split | FIXED | Bind `max_iterations` in the Lane B command, default 5 |
| P2 maintainability-4-2 | P2 | Grader provenance not persisted | FIXED | Persist grader in report + benchmark_run row + test |
| P2 maintainability-4-3 | P2 | Unknown modes collapse into Lane A | FIXED | Validate record.mode; unknown bucket or infra warning |
| P2 maintainability-4-4 | P2 | Benchmark profile duplicates fixture schema | FIXED | One canonical fixture shape; schema validation rejects duplicates |
| P2 maintainability-4-5 | P2 | Advisor penalty uses alias-shaped ids | FIXED | Normalize ids in explicit-lane scorer + advisor test |
| P2 maintainability-8-1 | P2 | Benchmark option schema split | FIXED | Shared option schema; forward or remove orphaned `--integration-report` |
| P2 maintainability-8-2 | P2 | Router assets not lane-aware | FIXED | Split RUNTIME_ASSETS by lane in SKILL.md |
| P2 maintainability-8-3 | P2 | Infra-failure emission duplicated | FIXED | Extract a single emitInfraFailure helper |
| P2 maintainability-8-4 | P2 | Dispatcher hides failure diagnostics | FIXED | Include error/stderr in the dispatcher CLI JSON |
| P2 maintainability-8-5 | P2 | Integration scoring comment contradicts code | FIXED | Replace stale point comments with named normalized-scale constants |
| P2 security-6-6 | P2 | Benchmark fixtures can trigger regex DoS | FIXED | Treat patterns as literals by default or apply a safe-regex policy + length limit |
<!-- /ANCHOR:disposition-register -->

---

<!--
Level 3 Decision Record (Addendum): One ADR per major decision.
Write in human voice: active, direct, specific. No em dashes, no hedging.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
