---
name: deep-review
description: "Autonomous iterative code-review loop with externalized state, convergence detection, P0/P1/P2 findings, fresh context per pass."
argument-hint: "[target] [:auto|:confirm] [--max-iterations=N] [--convergence=N] [--stop-policy=convergence|max-iterations]"
version: 1.11.13.0
allowed-tools: [Read, Write, Edit, Bash, Grep, Glob, Task]
---
<!-- Note: Task is for the command executor (loop management); @deep-review agent is LEAF-only (no Task). No WebFetch: review is code-only. -->

<!-- Keywords: deep-review, iterative-review, review-loop, convergence-detection, externalized-state, fresh-context, review-agent, JSONL-state, severity-findings, P0-P1-P2, release-readiness, spec-alignment -->

# Autonomous Deep Review Loop

Iterative code review and quality auditing protocol with fresh context per iteration, externalized state, convergence detection, and severity-weighted findings (P0/P1/P2).

Runtime path resolution:
- OpenCode/Copilot runtime: `.opencode/agents/*.md`
- Claude runtime: `.claude/agents/*.md`

Convergence threshold semantics and sibling-parity notes (deep-review 0.10 vs deep-research 0.05 vs deep-ai-council 0.20) live in `references/convergence/convergence.md` §1 under "Threshold Semantics and Sibling Parity".

## 1. WHEN TO USE

### When to Use This Skill

Use this skill when:
- Code quality audit requiring multiple rounds across different review dimensions
- Spec folder validation requiring cross-reference checks between docs and implementation
- Release readiness check before shipping a feature or component
- Finding misalignments between spec documents and actual code
- Verifying cross-references across documentation, agents, commands, and code
- Iterative review where each dimension's findings inform subsequent dimensions
- Unattended or overnight audit sessions

### When NOT to Use

- Simple single-pass code review (use `sk-code`'s code-review mode instead)
- Known issues that just need fixing (go directly to implementation)
- Implementation tasks (use `sk-code` or `/speckit:implement`)
- Quick one-file checks (use direct Grep/Read)
- Fewer than 2 review dimensions needed (single-pass suffices)

### FORBIDDEN INVOCATION PATTERNS

This skill is invoked EXCLUSIVELY through the `/deep:review` command. The command's YAML workflow owns state, dispatch, and convergence.

**NEVER:**
- Write a custom bash/shell dispatcher to parallelize iterations (ad-hoc shell fan-out)
- Invoke any CLI executor (cli-codex, cli-claude-code, cli-opencode, cli-cursor, cli-devin, cli-pi, cli-hermes) directly in a loop to simulate iterations
- Manually write iteration prompts to `/tmp` and dispatch them via `copilot -p`
- Dispatch the `@deep-review` LEAF agent via the Task tool for iteration loops (the agent is LEAF, a single iteration, and MUST be driven by the command's workflow)
- Skip the state machine: `deep-review-state.jsonl`, `deep-review-config.json`, `deltas/`, `prompts/`, `logs/`
- Manage iteration state outside the resolved local review packet under `{spec_folder}/review/`

**COMMAND-DRIVEN FAN-OUT IS SUPPORTED:** use `--executor`/`--executors`/`--concurrency` flags on `/deep:review`. The command's YAML `step_fanout_spawn` owns multi-lineage dispatch; `fanout-merge.cjs` applies strongest-restriction (any lineage active P0 → merged FAIL). This is not ad-hoc shell dispatch — it is the canonical fan-out path. Intra-lineage wave orchestration remains deferred.

**ALWAYS:**
- Invoke via `/deep:review :auto` or `/deep:review :confirm`
- Let the command's YAML workflow own dispatch (auto: `.skilled/commands/deep/assets/deep-review-auto.yaml`)
- Record each leaf iteration through the append gateway (`runtime/scripts/append-mode-event.cjs --mode review --run-directory <spec folder> --event-json <file>`) — the gateway is the SINGLE state-log writer: it authorizes, fences, and receipts the write, then refreshes `{state_paths.state_log}` from the ledger
- Treat `scripts/reduce-state.cjs` as the reducer for DERIVED artifacts only (finding registry, dashboard metrics, strategy updates); it never writes the state log
- Require every iteration to produce BOTH the markdown narrative AND the JSONL delta (dispatch scripts must fail if either is missing)
- Use `resolveArtifactRoot(specFolder, 'review')` from `.skilled/skills/system-spec-kit/shared/review-research-paths.cjs` to locate the canonical review root

### Trigger Phrases

- "review code quality" / "audit this code"
- "audit spec folder" / "validate spec completeness"
- "release readiness check" / "pre-release review"
- "find misalignments" (between spec and implementation)
- "verify cross-references" (across docs and code)
- "deep review" / "iterative review" / "review loop"
- "quality audit" / "convergence detection"

### Keyword Triggers

`deep review`, `convergence review`, `iterative review`, `review loop`, `release readiness`, `spec folder review`, `convergence detection`, `quality audit`, `find misalignments`, `verify cross-references`, `pre-release review`, `audit spec folder`

---

## 2. SMART ROUTING

The `system-deep-loop` hub routes an iterative review loop here, and its `review` mode signal selects this packet.
The signal fires when a request names a deep review, a convergence review, a review loop, a release readiness check or a spec-folder audit.
The loop runs only through `/deep:review`, whose workflow owns state, dispatch and convergence.

`references/protocol/quick-reference.md` loads first on every invocation.
The review phase named by the dispatch context then selects the loop protocol, the convergence documents or the state documents.

The routing pseudocode in [`ROUTER.md`](./ROUTER.md) is the one route from a request to a resource set.
A request whose intent scores stay under the threshold returns `UNKNOWN_FALLBACK` with a disambiguation checklist, never a silent default.
Read [`ROUTER.md`](./ROUTER.md) before selecting skill-local resources; open only the matched files.

---

## 3. HOW IT WORKS

### Resource Map Coverage Gate

When `{spec_folder}/resource-map.md` exists at init, deep review treats it as a mandatory audit input and does four things:

- Persists `resource_map_present` in config.
- Seeds `Known Context` with a snapshot of the map.
- Has at least one iteration audit `target_files` coverage against the map: touched, not-touched with `expected-by-scope`-versus-`gap`, and absent-from-map, with findings tagged `resource-map-coverage`.
- Has synthesis add the `## Resource Map Coverage Gate` report section and a converged `resource-map.md`. Disable this with `--no-resource-map`.

Absent at init, the gate and section are skipped without failing the loop.
Full sequencing: `references/protocol/loop-protocol.md` (init 9a, iteration 3b, synthesis 4). Schema: `references/state/state-format.md`.

### Bounded Context Snapshot Replacement

During initialization, capture a bounded, pointer-based context snapshot in `deep-review-strategy.md` `Known Context` before the first dimension runs.
The snapshot holds:

- Target pointers: files, specs, symbols and resource-map entries.
- The claimed behavior and acceptance criteria to verify.
- Reuse and convention pointers.
- Risk areas, missing context, stale-graph caveats and out-of-scope areas.

Do not create a context-loop report or widen scope beyond the declared target.
Use `@context` for quick retrieval, and `/speckit:plan` only when findings require implementation planning.

### Architecture

`/deep:review` owns the loop. The YAML workflow initializes state, dispatches one LEAF review iteration at a time, evaluates convergence, synthesizes `review-report.md`, and saves continuity. The LEAF agent reads state, reviews one dimension, writes `iteration-NNN.md`, updates strategy, and appends JSONL. Full 4-phase lifecycle: `references/protocol/loop-protocol.md`.

### State Packet Location

The review state packet always lives under the target spec's local `review/` folder.
Root-spec targets use `{spec_folder}/review/` directly.
Child-phase and sub-phase targets use **flat-first** placement: the first run writes flat, and a `pt-NN` sibling packet is allocated only when prior content already exists for a different target.
Full resolution rule and worked examples: `references/state/state-format.md` §1.

Core artifacts: `deep-review-config.json`, `deep-review-state.jsonl`, `deep-review-strategy.md`, `deep-review-dashboard.md`, `.deep-review-pause`, `resource-map.md`, `review-report.md`, and `iterations/iteration-NNN.md`.

The loop writes `review/review-report.md` itself at synthesis rather than scaffolding it through `create.sh --level review`.
The report is assembled from the findings registry and the JSONL state, so its content exists only once the loop has run, and a scaffolded skeleton would be overwritten whole.
`create.sh --level review` exists for a review packet authored by hand, and its template carries the same nine sections the loop emits.

### Core Innovation: Fresh Context Per Iteration

Each agent dispatch gets a fresh context window; state continuity comes from files, not memory, preventing accumulated findings from biasing later dimensions. Init writes config/strategy/JSONL; each loop reads state, checks convergence, dispatches one dimension, records findings, and reduces state; synthesis compiles the report and saves continuity.

### Review Dimensions

The four primary review dimensions (configured in `assets/review-mode-contract.yaml`):

| Dimension | Focus | Key Questions |
|-----------|-------|---------------|
| **Correctness** | Logic, behavior, error handling | Behavior matches claims? Edge cases handled? |
| **Security** | Vulnerabilities, exposure, trust boundaries | Inputs validated? Credentials exposed? |
| **Spec-Alignment / Traceability** | Spec vs. implementation fidelity | Code matches spec.md? Planned items present? |
| **Completeness / Maintainability** | Coverage, dead code, documentation | TODOs resolved? Code self-documenting? |

### Lifecycle + Reducer Contract

Review mode is lineage-aware. Supported lifecycle modes are `new`, `resume`, and `restart`. Required lineage fields include `sessionId`, `parentSessionId`, `lineageMode`, `generation`, `continuedFromRun`, and `releaseReadinessState`. The reducer consumes the latest JSONL delta, the new iteration file, and prior reduced state, then emits finding registry, dashboard metrics, and strategy updates.

### Severity Classification

| Severity | Criteria | Blocking |
|----------|----------|---------|
| **P0** | Correctness failure, security vulnerability, spec contradiction | Yes, blocks PASS verdict |
| **P1** | Degraded behavior, incomplete implementation, missing validation | Conditional, triggers CONDITIONAL verdict |
| **P2** | Style, naming, minor improvements, documentation gaps | No, PASS with advisories |

P0 and P1 also follow the reach calibration in `sk-code-review`'s `references/review-core.md` §2.
A blocking finding names an input or call path the code's stated contract allows, or a real caller that sends the failing input.
"Missing validation" is P1 only when the unvalidated input is in reach. Validation the code never claimed, for input outside its stated contract, is P2 hardening.
At a trust boundary every value the outside can send is in reach.

The scale has exactly three tiers, and no fourth is reserved.
A severity outside P0/P1/P2 is not a fourth tier. That covers a `P3` inherited from an older four-level convention, and any unlisted word.
Collapse it to the tier its impact actually matches (a `P3` becomes `P2`) and keep the original rating visible in the finding, so the rating is converted rather than lost.
An unconverted out-of-scale severity reaches the cross-lineage merge unranked, where it sorts below every P2 and cannot raise the merged verdict.

### Verdicts

| Verdict | Condition |
|---------|-----------|
| **PASS** | No P0/P1 findings, P2 findings recorded as advisories (`hasAdvisories: true`) |
| **CONDITIONAL** | P1 findings present, remediation plan included in report |
| **FAIL** | Any P0 finding confirmed after adversarial self-check |

### Acceptance-Coverage Signal

When the review target is a spec folder, deep review reflects the `AC_COVERAGE` validation signal in synthesis for Level 2+ folders.
The signal applies only once `checklist.md` exists and `implementation-summary.md` is in-progress or later. Level 1 folders and fresh scaffolds are exempt.
It is advisory while the validation rule stays INFO/default-on (non-blocking, and `RULE_STATUS` stays `pass`).
It can add traceability context and planning-seed work, but must not alter the iteration final-line contract below unless a later enforcement rollout explicitly changes severity.

### Iteration Final-Line Contract (MANDATORY)

Every `iteration-NNN.md` MUST end with exactly one of the following plain-text lines as the **absolute final line** (no trailing whitespace, no variation), and every review MUST emit exactly one parseable verdict:

```
Review verdict: PASS
```

```
Review verdict: CONDITIONAL
```

```
Review verdict: FAIL
```

**Mapping rule:** PASS if no P0 or P1 findings in this iteration. CONDITIONAL if any P1 (but no P0) findings. FAIL if any P0 findings. P2-only findings → PASS.

**VERDICT_LOCK:** Any confirmed active P0 forces the exact final line `Review verdict: FAIL` -- never relabel that state as conditional, partial, mixed, or advisory, and truncated/partial output is not a valid substitute for the final line. An optional advisory `riskScore` may appear in narratives/JSONL for relative risk calibration but never changes the `PASS|CONDITIONAL|FAIL` mapping.

Downstream automation (including the synthesis phase and CI gate parser) parses this final line via exact string match, do not vary the format.

**What the check proves:** the post-dispatch verifier validates the *shape* of this line, and nothing more: exactly one well-formed verdict line, and it is final.
It does not read findings, so a `PASS` written above active P1 findings satisfies it, and no parser here makes the line true.
The verdict a release decision reads is recomputed from the findings registry.
In a fan-out run the cross-lineage merge is the authoritative rollup, where any active P0 becomes a merged FAIL.
Treat the final line as the leaf's self-report and the registry as the record.

### Executor Selection Contract

Executor settings are owned by the YAML workflow and rendered prompt pack -- never hand-dispatch review iterations; each iteration stays LEAF-only and produces the required markdown plus JSONL delta. Full contract (per-iteration invariants, failure modes, JSONL audit field, config surface/precedence, TrustState surface): `references/protocol/loop-protocol.md`.

---

## 4. RULES

### ✅ ALWAYS

1. Read JSONL and strategy before review action.
2. Review one dimension per iteration and write findings to `iteration-NNN.md`.
3. Append JSONL with severity counts, finding detail, and `newInfoRatio`.
4. Cite every finding with `[SOURCE: file:line]`. Reject inference-only findings.
5. Re-read cited code before recording any P0.
6. Keep target files read-only.
7. Use `generate-context.js` for continuity saves. **Owner**: the YAML workflow (`deep_review_{auto,confirm}.yaml`) calls it at the save phase, not the reducer (`scripts/reduce-state.cjs`) directly — don't expect continuity-save side effects from the reducer alone.
8. Emit setup `BINDING:` lines before workflow output.
9. Refuse nested dispatch with: `REFUSE: nested Task tool dispatch is forbidden for LEAF agents. Returning partial findings instead.`

### ⛔ NEVER

1. **Dispatch sub-agents**, `@deep-review` is LEAF-only. It cannot dispatch additional agents. When dispatch is requested, use the canonical REFUSE wording (ALWAYS rule 14).
2. **Hold findings in context**, Write everything to iteration files. Context is discarded after each dispatch.
3. **Exceed TCB**, Target 8-11 tool calls per iteration (max 12). Breadth over depth per cycle.
4. **Ask the user**, Autonomous execution. The agent makes best-judgment decisions without pausing.
5. **Skip convergence checks**, Every iteration must be evaluated against convergence criteria before the next dispatch.
6. **Modify config after init**, review parameters in `deep-review-config.json` are read-only after initialization; the terminal `step_update_config_status` flip to `status: complete` is the one permitted write.
7. **Modify files under review**, The review loop is observation-only. No code changes during audit.
8. **Use WebFetch**, Review is code-only. No external resource fetching is permitted.
9. **Implement fixes during review**, Report findings only. Implementation is a separate follow-up step.

### Iteration Status Enum

`complete | timeout | error | stuck | insight`

- `insight`: Low newInfoRatio but important finding that changes the verdict trajectory.

### ⚠️ ESCALATE IF

1. **3+ consecutive timeouts**, Infrastructure issue. Pause loop and report to user.
2. **State file corruption**, Cannot reconstruct iteration history from JSONL or iteration files.
3. **All dimensions covered with P0 findings remaining**, Human sign-off required before shipping.
4. **Security vulnerabilities discovered in production code**, Escalate immediately. Do not defer to report synthesis.
5. **All recovery tiers exhausted**, No automatic recovery path remaining in convergence protocol.

---

## 5. REFERENCES AND RELATED RESOURCES

The router discovers reference, asset and script docs dynamically.
Start with these, in order:

1. `references/protocol/quick-reference.md`
2. `references/protocol/loop-protocol.md`
3. `references/convergence/convergence.md`
4. `references/convergence/convergence-signals.md`
5. `references/state/state-format.md`
6. `references/state/state-outputs.md`
7. `references/state/state-reducer-registry.md`
8. `assets/deep-review-dashboard.md`
9. `assets/deep-review-strategy.md`

Then load task-specific resources from `references/`, templates from `assets/`, and automation from `scripts/` when present.

Scripts: `scripts/reduce-state.cjs`, `scripts/runtime-capabilities.cjs`.

Detailed contracts:

- `references/protocol/loop-protocol.md`: executor invariants, failure modes and config surface.
- `references/protocol/loop-state-and-gates.md`: state transitions, error handling and STOP-decision gates.
- `references/protocol/completion-criteria.md`: the full loop-completion, quality-gate and validation-success checklist.
- `references/state/state-reducer-registry.md`: two-tier content-hash dedup.

Related skills: `deep-research` for investigation loops, `sk-code`'s code-review mode for single-pass review doctrine, and `system-spec-kit` for command-owned state and continuity saves.

---

## 6. SUCCESS CRITERIA

A review loop is complete only when convergence and every quality gate agree.
All of these must hold:

- The composite stop score clears `compositeStopScore`, or `maxIterations` is hit without a false-positive STOP.
- Every configured dimension plus the required traceability protocols (`spec_code`, `checklist_evidence`) has at least one full iteration of coverage.
- All canonical state files exist and parse cleanly: `deep-review-config.json`, `deep-review-state.jsonl`, `deep-review-findings-registry.json`, `deep-review-strategy.md` and `deep-review-dashboard.md` (a fan-out run keeps one per lineage instead), plus one `iterations/iteration-NNN.md` per dispatched iteration.
- `review-report.md` carries all 9 core sections plus the conditional `## Resource Map Coverage Gate`.
- Continuity is saved via `generate-context.js`.

Nine binary quality gates must all pass before STOP is legal:

1. Config validity and lineage match.
2. Strategy initialization completeness.
3. State and registry consistency.
4. Iteration completeness (markdown plus JSONL delta).
5. Severity-field coverage on every finding (`severity`/`category`/`file:line`/`content_hash`).
6. The advisory-only `riskScore` never gating verdict logic.
7. Adversarial P0 replay.
8. Dimension and protocol coverage stability.
9. Acceptance coverage: the advisory `AC_COVERAGE` signal when the spec-folder lifecycle predicate is active.

The security-sensitive override also applies when the target touches security, path handling, env precedence, schema boundaries, persistence or shared policy (`minStabilizationPasses=2` plus fix-completeness replay).
Full gate-by-gate criteria and rationale: `references/protocol/completion-criteria.md`.

Validate a completed run with `skill_advisor.py "run a deep review loop" --threshold 0.8` (skill still surfaces) and `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <spec-folder> --strict` (exits 0).

---

## 7. INTEGRATION POINTS

### Framework Integration

This skill operates within the behavioral framework defined in the active runtime's root doc (CLAUDE.md or AGENTS.md).

Key integrations:
- **Gate 2**: Skill routing via `skill_advisor.py` (keywords: deep review, convergence review, iterative review)
- **Gate 3**: File modifications require spec folder question per the root doc Gate 3. The spec folder determines the `{spec_folder}/review/` state packet location
- **Continuity**: `/speckit:resume` is the operator-facing recovery surface, resolving context in the order `handover.md -> _memory.continuity -> spec docs`. During review, the agent writes iteration, strategy, and JSONL state; after synthesis, run `generate-context.js` to write canonical packet continuity
- **Command**: `/deep:review` is the primary invocation point

### Code Graph Integration

The review loop consumes the shared runtime graph and its strict mode-gate validator; packet-specific convergence and state rules remain in this skill.
