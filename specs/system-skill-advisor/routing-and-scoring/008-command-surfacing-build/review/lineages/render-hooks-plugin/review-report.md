# Deep Review Report — `render-hooks-plugin` lineage

Run: `fanout-render-hooks-plugin-1794550137809-1ecgc7` · generation 1 · lineage mode `new`
Target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build`
Artifact directory: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/render-hooks-plugin`

## 1. Executive Summary

- Overall verdict: **PASS** with advisories
- hasAdvisories: **true**
- Findings: **0 P0, 0 P1, 11 P2** active; 2 closed by adjudication
- Iterations: 5 of 5 (`maxIterations` reached, not converged by threshold)
- Dimensions covered: correctness, security, traceability, maintainability (4 of 4)
- Review scope: the 53 `render-hooks-plugin` rows of `review/review-scope.txt` — the OpenCode advisor plugin, the shared session-reader package, the advisor runtime render/spawn/CLI surfaces, the runtime-mirror sync scripts, the spec-gate core, and the shared `AGENTS.md` Gate 2 section.
- Operator review focus: Code review of command surfacing. Scope: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/review-scope.txt lists the changed files, one per line as area TAB path. Review the files whose area equals your lineage label (last folder of config.fanout_lineage_artifact_dir), plus shared docs that describe them. Every finding is P0, P1 or P2 with file:line. Check: behaviour on claude, codex, opencode, pi, devin and dsh; safety of offering a mutating command; holdout hygiene, so no tune, fix or report path reads or leaks holdout rows; docs that disagree with code. Never read or print holdout prompt text (split holdout in command-prompts.jsonl, or holdout-prompts.jsonl): counts only. The reviewer changes no code and writes only inside its lineage folder.

What the operator asked, and what this pass found:

- **Behaviour on the six named runtimes** — one dispatcher, four changed readers, and a capability table that names all six plus `cursor`. No P0/P1. The defects are in the edges: a link opened after being checked under its resolved path, a DSH event without a `source` losing the operator turn, and a corrupt Devin database shadowing a readable transcript.
- **Safety of offering a mutating command** — the guard is sound where it runs: `start`, `ask` and every non-read-only `run` render as `(parent-named only)` for a child. Two gaps remain advisory: the trigger is a process-wide environment marker with no per-session override, and the downgrade reads mutability from the skill row rather than from the command actually printed.
- **Holdout hygiene** — clean. No file in this area opens a holdout store; the only textual match is a validation note. No holdout row was read or printed.
- **Docs that disagree with code** — two real drifts: a document naming a timeout consumer that never reads the variable, and an offer contract that omits the field which gates a child.

## 2. Planning Trigger

`/speckit:plan` is **not required** for the verdict. Eleven advisory P2 findings are recorded for a follow-up pass; none blocks release.

```json
{
  "Planning Packet": {
    "triggered": false,
    "verdict": "PASS",
    "hasAdvisories": true,
    "activeFindings": [
      {"id": "R1-P2-002", "severity": "P2", "dimension": "correctness"},
      {"id": "R1-P2-003", "severity": "P2", "dimension": "correctness"},
      {"id": "R1-P2-004", "severity": "P2", "dimension": "correctness"},
      {"id": "R1-P2-005", "severity": "P2", "dimension": "correctness"},
      {"id": "R2-P2-002", "severity": "P2", "dimension": "security"},
      {"id": "R2-P2-003", "severity": "P2", "dimension": "security"},
      {"id": "R3-P2-001", "severity": "P2", "dimension": "traceability"},
      {"id": "R3-P2-002", "severity": "P2", "dimension": "traceability"},
      {"id": "R4-P2-001", "severity": "P2", "dimension": "maintainability"},
      {"id": "R4-P2-002", "severity": "P2", "dimension": "maintainability"},
      {"id": "R4-P2-003", "severity": "P2", "dimension": "maintainability"}
    ],
    "remediationWorkstreams": [],
    "specSeed": [
      "Record the session-reader identity rule: the path that is checked is the path that is opened.",
      "Record that the child-session command downgrade is keyed on AI_SESSION_CHILD and has no per-session override.",
      "Record that a command row's mutating class is the only input to the child downgrade."
    ],
    "planSeed": [],
    "findingClasses": ["cross-consumer", "class-of-bug", "instance-only"],
    "affectedSurfacesSeed": [
      "session-reader dispatcher",
      "claude/devine/dsh readers",
      "brief renderer",
      "advisor subprocess",
      "feature catalog",
      "root AGENTS.md Gate 2"
    ],
    "fixCompletenessRequired": false,
    "note": "Advisory only. No remediation workstream is opened because no active P0 or P1 exists; the eleven P2 items are recorded for a separate hardening pass."
  }
}
```

## 3. Active Finding Registry

### R1-P2-002 — Containment is proven on the resolved path while the bytes are opened from the caller's path

- Severity: P2 · Dimension: correctness · Finding class: cross-consumer
- File: `.skilled/hooks/shared/session-readers/claude.mjs:213`, opened at `:217`; same split at `devin.mjs:350`/`:354` and `dsh.mjs:306`/`:310`
- Evidence: `storePath = containment.path` records the checked path; `readFileSync(transcriptPath, 'utf8')` opens the caller's path. `pi.mjs:246-256` closes the same gap by reading the guard's resolved path.
- Impact: `source.storePath` can name a file other than the one whose bytes produced the records.
- Fix: read `containment.path` in all three readers, matching `pi.mjs`.
- Disposition: open · Scope proof: `rg -n "storePath = containment.path"` returns exactly the three readers

### R1-P2-003 — A DSH operator message with no `source` object is silently reclassified as injected

- Severity: P2 · Dimension: correctness · Finding class: instance-only
- File: `.skilled/hooks/shared/session-readers/dsh.mjs:195`, classification at `:250-253`
- Evidence: a record requires `data.source?.kind === 'user'`; every other `user/message` becomes an `injected` entry with source `unknown`.
- Impact: an operator turn disappears from history while the read still reports `ok: true`.
- Fix: treat a missing `source` object as operator content, or reject the event, and pin the case in `injected-text.test.mjs`.
- Disposition: open (narrowed: `session-readers/README.md:36` shows the absent case was considered)

### R1-P2-004 — A corrupt Devin `sessions.db` suppresses the transcript fallback

- Severity: P2 · Dimension: correctness · Finding class: class-of-bug
- File: `.skilled/hooks/shared/session-readers/devin.mjs:395`, `:403`, `:439`, fall-through at `:447`
- Evidence: only an absent row or an empty projection reaches `loadTranscript`; an open or projection failure returns `store_unreadable`.
- Impact: a truncated or locked database hides a readable `transcripts/<sessionId>.json` on the same machine.
- Fix: fall through to the transcript on a database read failure, keeping the database error as a diagnostic.
- Disposition: open

### R1-P2-005 — `needsMode` withholding is defeated when the skill also has a generated command row

- Severity: P2 · Dimension: correctness · Finding class: instance-only
- File: `.skilled/skills/system-skill-advisor/runtime/lib/render.ts:226`, `:549-552`
- Evidence: `recommendation.command ?? row?.command` backfills a withheld command; the `(needs a mode)` head applies only when no row exists.
- Impact: a prompt that names no single mode can still be answered with one runnable command.
- Fix: when `needsMode` is set, never backfill from the row.
- Disposition: open (narrowed: `skill-advisor-hook.md:53` documents the general precedence)

### R2-P2-002 — The low-level advisor spawn accumulates child output without a byte cap

- Severity: P2 · Dimension: security · Finding class: cross-consumer
- File: `.skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts:239`
- Evidence: `stdout += chunk` has no ceiling; the fallback path caps the same stream at `MAX_STDOUT_BYTES` (`skill-advisor-cli-fallback.ts:214-219`).
- Impact: a CLI that keeps writing grows the caller's heap for the whole timeout.
- Fix: apply the same `capStdout` bound in `runSpawnAttempt`.
- Disposition: open

### R2-P2-003 — The child downgrade reads mutability from the skill row, not from the command that is printed

- Severity: P2 · Dimension: security · Finding class: instance-only
- File: `.skilled/skills/system-skill-advisor/runtime/lib/render.ts:233`
- Evidence: `policyWord(policy, row?.mutating, childSession)` while the printed command may come from `recommendation.command` (`:226`).
- Impact: a caller-supplied command can be judged by another command's mutability class.
- Fix: resolve `mutating` for the command that is actually printed.
- Disposition: open

### R3-P2-001 — A documented timeout consumer never reads the timeout variable

- Severity: P2 · Dimension: traceability · Finding class: instance-only
- File: `.skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:176`
- Evidence: the line names `skill-advisor-brief.ts`; that file contains no occurrence of `SPECKIT_OPENCODE_HOOK_TIMEOUT_MS`. `subprocess.ts:119` does read it, against `DEFAULT_TIMEOUT_MS = 3000`.
- Impact: a maintainer looks for the flag's effect in a file that has none.
- Fix: drop the file from the consumer list, or make it read the flag.
- Disposition: open

### R3-P2-002 — The documented recommendation contract omits the field that decides the child-session downgrade

- Severity: P2 · Dimension: traceability · Finding class: class-of-bug
- File: `.skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-recommend.md:41`
- Evidence: the contract names four fields; `command-attach.ts:51` carries a fifth, `mutating`, and `render.ts:233` is its only reader.
- Impact: the guard's single input is absent from the contract that describes the offer.
- Fix: add `mutating` and its vocabulary to the contract section.
- Disposition: open

### R4-P2-001 — A fourth hand-spelled runtime list sits outside the parity test that exists to catch exactly this

- Severity: P2 · Dimension: maintainability · Finding class: class-of-bug
- File: `.skilled/hooks/shared/session-readers/index.mjs:28`
- Evidence: seven runtimes spelled by hand, the same seven as `advisor-runtime-values.ts:10-18`; `advisor-runtime-list-parity.vitest.ts` ties three lists and not this one.
- Impact: a runtime added to the tuple passes every parity test and stays gated in `readSession`.
- Fix: derive `capabilities` from the tuple, or add it to the parity comparison.
- Disposition: open

### R4-P2-002 — The child-session marker is interpreted twice, once through an exported constant and once as a hard-coded literal

- Severity: P2 · Dimension: maintainability · Finding class: cross-consumer
- File: `.skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs:101`
- Evidence: `CHILD_SESSION_ENV` and `isChildSession(env)` exist in the spec-gate core; `render.ts:522` writes the literal inline. Both accept `'1'` today.
- Impact: a change to the accepted value updates one reader and silently skips the other.
- Fix: have the renderer import the shared helper.
- Disposition: open

### R4-P2-003 — The operator-facing direct-call example puts the prompt in argv, against the guarantee the hook path keeps

- Severity: P2 · Dimension: maintainability · Finding class: instance-only
- File: `AGENTS.md:65`
- Evidence: the Gate 2 example passes the prompt as an argv JSON string; `skill-advisor-hook.md:38` states the stdin guarantee the same section points to.
- Impact: the diagnostic path exposes the prompt in the process table.
- Fix: show the stdin form in the Gate 2 example.
- Disposition: open

### Closed by adjudication

- **R1-P2-001** — resolved. `session-readers/README.md:42-43` specifies that an empty or unsafe id yields `locator_unavailable` before the runtime resolves, which is what `index.mjs:99-102` does. Documented contract, not a defect.
- **R2-P1-001** — resolved at P1. `render.ts:522` keys the child downgrade on `AI_SESSION_CHILD`, and `skill-advisor-hook.md:39` documents that exact trigger. Code and document agree; the residual is carried as a Deferred Item.

## 4. Remediation Workstreams

No workstream is opened. The verdict is PASS with advisories and no active P0 or P1 exists.

For the follow-up hardening pass, the suggested order is by blast radius:

1. **Reader path identity** — R1-P2-002 (three files, one mechanical change).
2. **Reader data loss** — R1-P2-003, R1-P2-004 (two readers, each with a test to add).
3. **Advisor resource bound** — R2-P2-002 (one function, mirrors an existing helper).
4. **Offer-contract clarity** — R1-P2-005, R2-P2-003, R3-P2-002 (one renderer plus two documents).
5. **Vocabulary ownership** — R4-P2-001, R4-P2-002 (two modules, one test).

## 5. Spec Seed

- State, in the session-reader contract, that the path proven by containment is the path opened.
- State, in the child-session rule, that `AI_SESSION_CHILD` is a process marker and that no per-session override exists today.
- State, in the recommendation contract, that a command row's `mutating` class is the only input to the child downgrade.
- State, in the capability table section, that the advisor runtime tuple is the canonical list and every other runtime list derives from it.

## 6. Plan Seed

- Read `containment.path` instead of the caller's path in `claude.mjs`, `devin.mjs` and `dsh.mjs`.
- Add the absent-`source` DSH case to `injected-text.test.mjs` before changing `dsh.mjs:195`.
- Cap `runSpawnAttempt`'s stdout and stderr with the existing `capStdout` helper.
- Resolve `mutating` for the printed command in `commandLabel`.
- Add `mutating` to `advisor-recommend.md`'s contract section.
- Point the renderer at `CHILD_SESSION_ENV` / `isChildSession`.

## 7. Traceability Status

### Core Protocols

| Protocol | Status | Evidence | Unresolved drift |
|---|---|---|---|
| `spec_code` | pass | Every documented claim checked in iterations 3 and 5 has a matching code path except the consumer list in R3-P2-001 | R3-P2-001, R3-P2-002 |
| `checklist_evidence` | notApplicable | No checklist rows exist for this area; the review is of changed code, not packet acceptance criteria | none |

### Overlay Protocols

| Protocol | Status | Evidence | Unresolved drift |
|---|---|---|---|
| `skill_agent` | partial | `skill-advisor-hook.md:88` names the Claude shim chain; the source half resolves, the dist half was not read | coverage gap, not a finding |
| `agent_cross_runtime` | pass | Six adapters plus one plugin; seven runtimes in the tuple and the same seven in the capability table | R4-P2-001 |
| `feature_catalog_code` | pass | Compiled-route options, one-command-per-label, and the typed-command degraded entry all confirmed | R3-P2-002 |
| `playbook_capability` | notApplicable | No manual-testing playbook row covers this area | none |

`AC_COVERAGE`: exempt — the review target is a spec-folder parent, and this lineage reviewed changed implementation files rather than the packet's acceptance criteria.

## 8. Deferred Items

- **Child-session guard per-session override.** The downgrade input is the documented process marker. A host that dispatches a child in-process without setting `AI_SESSION_CHILD=1` would receive a fully visible mutating command. No such host was demonstrated, so this is hardening, not a finding. Reopens as P1 if one is shown.
- **Unread modules.** `spec-gate-core.mjs` beyond `:71-310` (1888 lines total), `sync-runtime-mirrors.cjs` internals (465 lines), `embedders/schema.ts` internals (377 lines), eight runtime test suites, and the Claude dist half of the hook chain. These are read-scope limits, not clean surfaces.
- **`.d.mts` declaration files.** Not reviewed as behaviour; they carry types only.

## Dimension Expansion Map

- Saturated directions: declaration-file signature parity (iteration 1), plugin-README runtime matrix (iteration 2).
- Completed pivots: 1 → 2 (correctness → security), 2 → 3 (security → traceability), 3 → 4 (traceability → maintainability), 4 → 5 (maintainability → adjudication).
- Failed pivots: 0.
- Audited overrides: 0.
- Council artifact references: none (single-lineage review, no Council pass).
- Selected review directions: reader identity and data loss; command-offer safety; documentation-to-code drift; vocabulary ownership.
- Remaining frontier: the unread modules and the Claude dist chain listed under Deferred Items.

## 9. Search Ledger

- Covered bug classes: contract violation, silent data loss, error-path masking, privileged command offer, prompt injection, holdout leakage, documentation drift, contract omission, duplicated vocabulary, missing test coverage.
- Ruled out: path traversal in `claude.mjs`, chain-cycle truncation in `devin.mjs`, prompt text in argv, a relabelable `mutating` class, holdout reads (twice), a duplicated brief renderer, `spec-gate-core` render duplication, a dead documented timeout variable, a self-starting offered command.
- Deferred: `spec-gate-core.mjs` internals, `sync-runtime-mirrors.cjs` internals, `embedders/schema.ts` internals, eight runtime test suites, the Claude dist chain.
- Blocked: none.
- Graph coverage mode: `graphless_fallback` (no graph was available; every search was a direct read or an exact search).
- Search debt: none recorded by the reducer.

## 10. Audit Appendix

### Convergence

| Iteration | Focus | New findings | Ratio | Verdict |
|---|---|---|---|---|
| 1 | correctness | 5 P2 | 1.00 | PASS |
| 2 | security | 1 P1, 2 P2 | 1.00 | CONDITIONAL |
| 3 | traceability | 2 P2 (1 P1 closed, 1 P2 closed) | 0.33 | PASS |
| 4 | maintainability | 3 P2 | 0.23 | PASS |
| 5 | adjudication | 0 new (2 closed) | 0.15 | PASS |

Stop reason: `maxIterationsReached`. The threshold of 0.10 was not met on the final ratio of 0.15, and the iteration ceiling of 5 was reached. Release readiness: `in-progress`.

### Coverage

- Dimensions: 4 of 4 (`dimensionCoverage` all true in the registry).
- Files: 30 of 53 scope files read in full or in the substantive part; the gaps are listed under Deferred Items.
- Integration surfaces named: `.opencode/plugins/system-skill-advisor.js`, `.skilled/hooks/shared/session-readers/*`, `.skilled/skills/system-skill-advisor/runtime/*`, `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/*`, `.skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs`, `AGENTS.md`.

### Sources reviewed

- Iteration files: `iterations/iteration-001.md` … `iterations/iteration-005.md`
- Deltas: `deltas/iter-001.jsonl` … `deltas/iter-005.jsonl`
- Registry, strategy and dashboard as refreshed by the reducer after each iteration.

### Rule sources

`Rule sources: .skilled/skills/sk-code/sk-code-review/references/review-core.md. Overrides: none. Refused: none. Ignored: none. Conflicts: none`
