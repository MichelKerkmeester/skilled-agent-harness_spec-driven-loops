# Deep Review Report — Two-Lane Program (121/008-013)

## 1. Executive Summary

A 10-iteration deep review (cli-codex gpt-5.5, reasoning xhigh, service tier fast) audited the curated substantive work of the deep-agent-improvement two-lane program across correctness, security, traceability, and maintainability. The reviewer surfaced 34 findings (raw 4 P0 / 14 P1 / 16 P2). After Opus 4.8 adjudication against the code: 1 confirmed P0, 1 P0 refuted as an intended deferral, 2 P0 downgraded to P1, leaving an active registry of 1 P0 + 16 P1 + 16 P2.

**Verdict: CONDITIONAL.** The build's core is sound (TST-1 byte-identity holds, vitest 133/133, both-lane smokes reached benchmark-complete, alignment-drift 0). But the Lane B command surface has a real flag-parse defect that makes the shipped `/deep:start-model-benchmark-loop` misbehave, plus a cluster of real security and traceability hardening gaps. Remediation is needed before Lane B is reliable.

## 2. Adjudication Note

The build's own verification exercised `loop-host.cjs` directly with `=`-form flags (`--scorer=5dim`) and passed. The review caught that the command surface (both YAMLs and the dedicated command) invokes loop-host with SPACE-form flags, which `parseArgs` does not accept. This gap (testing the script, not the command path) is exactly what an independent review is for.

## 3. Active Finding Registry

### P0 — confirmed blocker (1)

| ID | Title | File:line | Evidence | Fix |
|----|-------|-----------|----------|-----|
| F-P0-1 | Lane B command flags misparse to booleans | `scripts/shared/loop-host.cjs:32-41` + the 3 command surfaces | `parseArgs` regex `^--([a-z][a-z0-9-]*)(?:=(.*))?$` only accepts `--key=value`/bare. Both Lane B YAMLs (`:147`/`:178`) and the dedicated command (`start-model-benchmark-loop.md:303`) invoke `loop-host.cjs ... --profile {profile} --scorer {scoring_method} --grader {grader}` with SPACE separators, so `profile`/`outputs-dir`/`scorer`/`grader` all parse to `true`. The model-benchmark command does not run as intended. | Make `parseArgs` also accept `--key value` (consume the next non-`--` token), OR convert the 3 command surfaces to `=`-form. Recommended: the parser fix (robust, matches the space-style command surface, TST-1 safe since `=` is unchanged). Add a loop-host test for space-form parsing. |

### P0 — refuted (1, downgraded to documented-deferral)

| ID | Disposition | Rationale |
|----|-------------|-----------|
| F-P0-2 "Model benchmark never dispatches a model" | REFUTED | Intended, documented deferral (122/007 F-P2-1, arbiter-upheld). The default model-benchmark path is fixture pattern/5dim scoring with `--grader noop`; `dispatch-model.cjs` loads only on `--grader llm`. By design, not a defect. |

### P1 — confirmed (16; includes 2 downgraded from P0)

| ID | Title | File:line |
|----|-------|-----------|
| F-P1-1 (was P0) | Grader/executor dispatch grants write perms (`--sandbox workspace-write`, `--permission-mode acceptEdits`) when grading should be read-only | `scripts/model-benchmark/dispatch-model.cjs:140-160` |
| F-P1-2 (was P0) | Lane B YAML interpolates `{profile}` unquoted into a shell command (latent injection, trusted-author today) | `deep_start-model-benchmark-loop_auto.yaml:147` |
| F-P1-3 | Lane B emits an invalid session outcome value | `deep_start-model-benchmark-loop_auto.yaml:181` |
| F-P1-4 | LLM executor fields (`target_model`) dropped before reaching dispatch-model | `start-model-benchmark-loop.md:299` |
| F-P1-5 | Benchmark plateau stop not implemented for model-benchmark | `scripts/shared/reduce-state.cjs:773` |
| F-P1-6 | Lane B config path is split across two bindings | `deep_start-model-benchmark-loop_auto.yaml:102` |
| F-P1-7 | Failure reports lose scorer provenance (`scoringMethod` missing on error) | `scripts/model-benchmark/run-benchmark.cjs:426` |
| F-P1-8 | Explicit Lane B selection can be shadowed by the agent-path check ordering | `start-agent-improvement-loop.md:127` |
| F-P1-9 | Fixture IDs can escape the benchmark output directory (`path.join(outputsDir, fixture.id)` no sanitize) | `scripts/model-benchmark/run-benchmark.cjs:350` |
| F-P1-10 | Criteria shell execution defaults open (`DEEP_AGENT_ALLOW_CRITERIA_EXEC` default-on) | `SKILL.md:276` |
| F-P1-11 | Score cache trusted from a shared temp path | `scripts/agent-improvement/score-candidate.cjs:149` |
| F-P1-12 | Cached scores can point at the wrong candidate | `scripts/agent-improvement/score-candidate.cjs:558` |
| F-P1-13 | Benchmark report.json overwritten across iterations | `scripts/model-benchmark/run-benchmark.cjs:316` |
| F-P1-14 | Pause state not packet-local (shared state dir) | `scripts/model-benchmark/dispatch-model.cjs:36` |
| F-P1-15 | Lane B promotion gate references Lane A artifacts | `deep_start-model-benchmark-loop_confirm.yaml:202` |
| F-P1-16 | Agent "Lane awareness" note cites OLD flat script paths (4 mirrors) post-013 reorg | `agents/deep-agent-improvement.md:44` (+ 3 mirrors) |

### P2 — advisories (16)

Agent-note stale paths overlap F-P1-16; remaining: spawn-path map untested, max-iteration binding split, grader/profile provenance not persisted, unknown-mode collapse, benchmark profile duplicates fixture schema, advisor penalty uses alias-shaped ids, fixture regex DoS, ledger writer ownership ambiguous, benchmark option schema split, router assets not lane-aware, infra-failure emission duplicated, dispatcher hides failure diagnostics, integration scoring comment contradicts code. (Full list in `all-findings.jsonl`.)

## 4. Remediation Workstreams

1. **WS1 — Lane B command runs (P0, small):** fix loop-host `parseArgs` to accept space-form flags + a test; verify the Lane B command end to end through the YAML path (not just the script). This is the release blocker.
2. **WS2 — Dispatch hardening (P1):** read-only sandbox/permission for grader/benchmark dispatch (F-P1-1); quote YAML command interpolations (F-P1-2); sanitize fixture IDs against traversal (F-P1-9); revisit criteria-exec default (F-P1-10).
3. **WS3 — Lane B traceability (P1):** valid session outcome (F-P1-3), thread LLM executor fields (F-P1-4), scorer provenance on failure (F-P1-7), per-iteration report naming (F-P1-13), packet-local pause state (F-P1-14), Lane B promotion gate (F-P1-15), config-path consolidation (F-P1-6).
4. **WS4 — Doc/test sync (P1/P2):** repoint the 4 agent-note script paths post-reorg (F-P1-16), add a resolveScriptPath spawn-map test, lane-resolution ordering (F-P1-8), plus the P2 advisories.

## 5. Audit Appendix

- Iterations: 10/10 exit 0 (correctness ×3, security ×3, traceability ×2, maintainability ×2). Durations 152-304s. Executor: cli-codex gpt-5.5 xhigh/fast, read-only sandbox.
- Single-model review (gpt-5.5) + Opus 4.8 adjudication. No second executor this run.
- Build gates that still hold post-review: TST-1 byte-identity, vitest 133/133, both-lane smokes, alignment-drift 0, validate --recursive. The P0 is a command-surface parse mismatch, not a script-logic regression, which is why those gates passed.
- Raw findings: `all-findings.jsonl`. Per-iteration outputs: `iterations/iteration-NNN.md`. Prompts: `prompts/iteration-N.md`.


---

## 6. Remediation Status (phase 121/015)

> Closure of every active finding. Remediation packet: `skilled-agent-orchestration/121-deep-agent-improvement-benchmark-mode/015-two-lane-review-remediation`. Verification: vitest 14 files/163 tests green (+30 regression tests); TST-1 byte-identity intact; space-form Lane B smoke reaches benchmark-complete with scoringMethod=5dim; grader dispatch read-only by default; fixture-id traversal rejected; mirror-drift 0; alignment-drift 0; validate --strict on 015 PASS.

### Disposition: 31 FIXED + 2 DOCUMENT-ACCEPT (all 33 active findings)

| Finding | Disposition | Closure |
|---------|-------------|---------|
| F-P0-1 command flag misparse | FIXED | `loop-host.parseArgs` accepts space-form; `=`-form byte-identical so TST-1 holds; space-form test + e2e test added |
| F-P1-1 grader write perms | FIXED | dispatch defaults read-only (codex `--sandbox read-only`, claude `--permission-mode plan`); write behind `DEEP_AGENT_DISPATCH_WRITE=1` |
| F-P1-2 unquoted {profile} | FIXED | command interpolations quoted |
| F-P1-3 invalid session outcome | FIXED | canonical enum value |
| F-P1-4a llm executor fields dropped | FIXED | target_model threaded to dispatch-model |
| F-P1-4b profile-by-id fails pre-run | FIXED | loop-host forwards `--profiles-dir` to both steps + materialize now resolves path-or-id (orchestrator closed the cross-file residual) |
| F-P1-5 plateau stop | FIXED | reduce-state plateau path made honest |
| F-P1-6 config path split | FIXED | single config path |
| F-P1-7 scorer provenance on failure | FIXED | report carries scoringMethod/grader/profileId on success and failure |
| F-P1-8 explicit Lane B shadowed | FIXED | explicit `--lane`/`--profile` honored before agent-path auto-resolve (CMD-1 preserved) |
| F-P1-9 fixture-id traversal | FIXED | `^[A-Za-z0-9._-]+$` sanitizer + adversarial test |
| F-P1-10 criteria-exec default open | DOCUMENT-ACCEPT | trusted-author boundary upheld by the 122 arbiter, rationale recorded |
| F-P1-11 cache shared temp | FIXED | packet-local cache dir |
| F-P1-12 cache wrong candidate | FIXED | cache keyed by candidate path + content hash + test |
| F-P1-13 report overwrite | FIXED | history-preserving report snapshot |
| F-P1-14 pause state not packet-local | FIXED | run-scoped sentinel path |
| F-P1-15 Lane B promotion gate -> Lane A | FIXED | gate points at the benchmark report + promote-candidate --benchmark-report |
| F-P1-16 agent note stale paths | FIXED | 4 mirrors repointed to lane paths, mirror-drift 0 |
| P2 x16 | 15 FIXED + 1 DOCUMENT-ACCEPT | spawn-map test, option-schema, diagnostics, regex-DoS bound, provenance, ledger owner, max-iter binding, router lane assets, advisor penalty id, profile schema, infra-emit dedup, comment reconcile, resume hint; unknown-mode legacy default documented |

### Verdict update: CONDITIONAL -> remediated. The Lane B command now runs correctly via its command path; the security and traceability cluster is closed; the two trusted-author boundaries are documented.
