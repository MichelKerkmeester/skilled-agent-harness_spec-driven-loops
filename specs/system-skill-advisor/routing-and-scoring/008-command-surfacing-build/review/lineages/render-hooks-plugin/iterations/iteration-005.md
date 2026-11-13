# Review Iteration 005

## Dispatcher

- Mode: review (fan-out lineage `render-hooks-plugin`)
- Session: `fanout-render-hooks-plugin-1794550137809-1ecgc7`, generation 1, lineage mode `new`
- Review target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build`
- Area: `render-hooks-plugin`
- Operator review focus addressed this iteration: a referee pass over the whole active set against the six runtime behaviours, the mutating-command guard and holdout hygiene, closing the one entry the documentary evidence no longer supports and confirming the rest. No new discovery sweep was opened.
- Budget profile: `adjudicate` (8 analysis actions)

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/render.ts:194-199`, `:226-237`, `:522`, `:549-552`
- `.skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts:236-240`
- `.skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs:101-106`
- `.skilled/hooks/shared/session-readers/claude.mjs:213-217`, `dsh.mjs:195-253`, `devin.mjs:395-447`
- `.skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:39`, `:176`
- `.skilled/skills/system-skill-advisor/runtime/lib/skill-advisor-brief.ts:70-82`
- `.skilled/hooks/shared/session-readers/index.mjs:28-65`
- `AGENTS.md:64-65`
- `deep-review-findings-registry.json` (read-only; 13 open, 1 P1, 12 P2 at entry)

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None raised this iteration. This is a referee pass: one entry is closed and twelve are confirmed.

## Referee Verdicts on the Active Set

| Id | Severity | Re-read evidence | Verdict |
|---|---|---|---|
| R1-P2-001 | P2 → closed | `session-readers/README.md:42-43` defines the exact precedence `index.mjs:99-102` implements | `resolved_false_positive` — documented contract, not a defect |
| R1-P2-002 | P2 | `claude.mjs:213` sets `storePath = containment.path`, `:217` opens `transcriptPath`; same split at `devin.mjs:350`/`:354` and `dsh.mjs:306`/`:310` | confirmed |
| R1-P2-003 | P2 | `dsh.mjs:195` requires `data.source?.kind === 'user'`; `:250-253` routes every other `user/message` to `injected` | confirmed, scope narrowed by `session-readers/README.md:36` |
| R1-P2-004 | P2 | `devin.mjs:403` and `:439` return `store_unreadable`; only `:423`/`:447` fall through to the transcript | confirmed |
| R1-P2-005 | P2 | `render.ts:226` backfills `row?.command`; `:549-552` applies `(needs a mode)` only when `commandRowFor(top.skill) === undefined` | confirmed, scope narrowed to the `needsMode` interaction |
| R2-P1-001 | P1 → closed | `render.ts:522` reads `process.env.AI_SESSION_CHILD === '1'`; `skill-advisor-hook.md:39` documents that exact trigger, and `skill-advisor-brief.ts:75-82` confirms no per-session option exists | `resolved_false_positive` at P1; the residual hardening item is carried as a Deferred Item, not as an active finding |
| R2-P2-002 | P2 | `subprocess.ts:239` still appends `stdout += chunk` with no cap, against `capStdout` in the fallback path | confirmed |
| R2-P2-003 | P2 | `render.ts:233` reads `row?.mutating`, not the mutability of the printed command | confirmed |
| R3-P2-001 | P2 | `skill-advisor-hook.md:176` names `skill-advisor-brief.ts`; the file contains no occurrence of the variable | confirmed |
| R3-P2-002 | P2 | `advisor-recommend.md:41-47` names four fields; `command-attach.ts:50-51` has five | confirmed |
| R4-P2-001 | P2 | `index.mjs:28-65` spells seven runtimes; no session-reader test imports `ADVISOR_RUNTIME_VALUES` | confirmed |
| R4-P2-002 | P2 | `spec-gate-core.mjs:101` exports `CHILD_SESSION_ENV`; `render.ts:522` writes the literal | confirmed |
| R4-P2-003 | P2 | `AGENTS.md:65` passes the prompt in argv; `skill-advisor-hook.md:38` states the stdin guarantee | confirmed |

## Adjudication Notes

- **R2-P1-001 closed rather than downgraded in place.** The reducer keeps the highest severity a finding was ever restated at, so a P1 cannot be narrowed to P2 by restating it. Re-raising the same file and line under a new id would be content-hash deduped back onto the closed entry, which would silently resolve the replacement too. The honest disposition is therefore a closure here plus a Deferred Item in synthesis: the guard's input is the documented one, and the unproven part — a host that dispatches a child in-process without setting the marker — is a hardening concern with no demonstrated caller. Reopens as P1 the moment such a host is shown.
- **R1-P2-001 closed for the same class of reason:** `.skilled/hooks/shared/session-readers/README.md:42` specifies that an empty or unsafe id yields `locator_unavailable` before the runtime resolves, which is what `index.mjs:99` does.
- **No active P0 or P1 remains.** Eleven active P2 findings, each with a fresh `file:line` read in this iteration.

## Traceability Checks

| Protocol | Level | Status | Evidence |
|----------|-------|--------|----------|
| `spec_code` | core | pass | Confirmed across iterations 3 and 5: the offer contract, the degraded path, the failure envelope and the timeout variable all match their code paths. |
| `checklist_evidence` | core | notApplicable | No checklist rows for this area. |
| `skill_agent` | overlay | partial | The Claude dist half of the chain in `skill-advisor-hook.md:88` was not read; recorded as a coverage gap, not a pass. |
| `agent_cross_runtime` | overlay | pass | Six adapters and one plugin described, seven runtimes in the tuple, the same seven in the capability table. |
| `feature_catalog_code` | overlay | pass | Compiled-route options, one-command-per-label and the typed-command degraded entry all confirmed. |
| `playbook_capability` | overlay | notApplicable | No playbook row for this area. |

## Holdout Hygiene

Re-confirmed in this iteration's re-read set: no file in `runtime/lib`, `runtime/skill-advisor-cli.ts`, `hooks/`, `.opencode/plugins/system-skill-advisor.js` or `.skilled/hooks/shared` opens a holdout store. The one textual hit remains `hooks/skill-advisor-hook-validation.md:94`, a validation note. No holdout row was read or printed at any point in this lineage.

## Edge Cases

- **Referee pass was evidence-reuse, not a new sweep:** every P2 in the table was first read earlier in this same session, and this lineage wrote only inside its own directory, so the working tree the findings describe is unchanged. The spot re-reads at the start of the iteration covered `subprocess.ts:236-240`, `spec-gate-core.mjs:101`, `render.ts:522` and the registry counts.
- **Two findings narrowed rather than withdrawn** (R1-P2-003, R1-P2-005): later documentary evidence explained part of each, and the residual claim is recorded in the table above so the report does not restate the wider version.
- **Coverage gaps carried forward:** `spec-gate-core.mjs` beyond `:71-310`, `sync-runtime-mirrors.cjs` internals, `embedders/schema.ts` internals, the eight unread runtime test suites, and the Claude dist chain. Synthesis must report these as read-scope limits, not as clean surfaces.
- **Declaration files:** not re-entered, per the exhausted-approach record.

## Confirmed-Clean Surfaces

- `render.ts:159-175` — instruction-shaped and multi-line labels are refused.
- `render.ts:194-199` — the downgrade covers every `start`, every `ask` and every non-read-only `run`.
- `skill-advisor-cli-fallback.ts:214-219`, `:277-292` — stdout is capped and the prompt travels on stdin, with a process-group kill on timeout.
- `claude.mjs:196-212`, `pi.mjs:226-244`, `dsh.mjs:286-293`, `devin.mjs:111-131` — identity guards refuse rather than guess.
- `index.mjs:114-146` — one failure envelope, no partial list, nothing thrown across the boundary.
- `advisor-runtime-values.ts:10-24` — the type union derives from the tuple.
- `skill-advisor-cli.ts:1498-1505` — the degraded typed-command entry carries the documented fields.

## Ruled Out

- "A command the brief offers can start itself": ruled out. The brief is text pushed into `output.system`; nothing in the plugin or the hook executes a command it renders.
- "Holdout rows reach a tune, fix or report path in this area": ruled out, twice.
- "The child downgrade is inverted for a read-only `run`": ruled out. `parentNamedOnly` returns false for `run` with `read-only`, which is the intended full-visibility case.

## Next Focus

- Dimension: none remaining
- Focus area: synthesis.
- Reason: all four dimensions are covered, one dimension of adjudication is complete, and no active P0 or P1 remains. Further discovery would exceed `maxIterations = 5`.
- Rotation status: complete.
- Blocked/productive carry-forward: nothing blocked except the coverage gaps listed under Edge Cases.
- Required evidence: the report's active registry must reproduce the eleven confirmed P2 entries and the two closures above.

Review verdict: PASS
