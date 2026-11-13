# Review Iteration 002

## Dispatcher

- Run: `fanout-scorer-attach-2-1794570021136-noekp0` (lineage `scorer-attach-2`, pass two, area `scorer-attach`)
- Mode: review; executor: in-process (no nested dispatch)
- Dimension: security
- Review focus addressed: the operator focus names "safety of offering a mutating command" and "holdout hygiene, so no tune, fix or report path reads or leaks holdout rows". This iteration re-proves the mutating-command invariant against the changed tables (pass one's claim was "no `run` row writes"), then re-reads the two changed files that could carry a leak: the status handler and its test.
- Budget profile: `verify` (11-13 calls), used 11.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:257-349` (gate, pattern, attach path)
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:675-680` (the same pattern in the scorer path, and its base revision)
- `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-status.ts:1-567` (whole file, changed)
- `.skilled/skills/system-skill-advisor/runtime/tests/handlers/advisor-status.vitest.ts:1-748` (whole file, changed)
- Executed whole-table invariants over the live module (below).

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The no-edit gate does not fire on "don't change" or "no changes", so a writing command is still offered** -- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:289` -- `NO_EDIT_REQUEST` covers `do not (change|edit|modify|touch)` but not the contracted forms `don't change`, nor the noun form `no changes`. The pass-one fix (`command-attach.ts:329`) now applies the pattern to every hub, so the gap reaches every attached command rather than the deep-loop one. This is not a re-report of `R2-P2-001` — that fix holds; the pattern it reads is narrower than the wording it names.
   Finding class: security_policy_vocabulary_gap
   Scope proof: `NO_EDIT_REQUEST` is declared and exported in `runtime/lib/command-attach.ts` (scorer-attach scope) and consumed by the attach path at `:329` and by `fusion.ts:677`, `:881`.
   Affected surface hints: hub command attachment for every hub; scorer read-only lift; hook briefs that surface the command.
   Case: `attachCommand('sk-doc', { action: 'route', selectionKind: 'single', targets: [{ workflowMode: 'sk-create-skill' }] }, "create a skill called invoice-parser, don't change anything yet")` returns `/create:skill` with tracked policy `start`; the same prompt with "no changes yet" also returns `/create:skill`. Executed against the live module, both reported `noEdit: false`.
   Claim: the gate withholds a command on "do not change anything yet" but not on the two most common paraphrases of the same instruction.
   Evidence refs: `command-attach.ts:289`, `command-attach.ts:329`, `fusion.ts:677`
   Counterevidence sought: checked whether the pattern was widened in the reviewed range (it was copied unchanged from the base `fusion.ts:675` inline regex), and whether `start` makes the offer harmless (it asks before writing, and `AGENTS.md:68` says an explicit instruction outranks the policy).
   Alternative explanation: the vocabulary is deliberately narrow to avoid withholding a command on a sentence that asks for a change while mentioning a restriction elsewhere.
   Final severity: P2 (the offered policy is `start`, which asks before writing; no silent write path)
   Confidence: high
   Downgrade trigger: withdraw if `NO_EDIT_REQUEST` is widened by another change in this range, or if a caller starts treating a `start` offer as authority to run without asking.

2. **The privacy guard at `advisor-status.vitest.ts:493` cannot fail because the fixture never stores anything private** -- `.skilled/skills/system-skill-advisor/runtime/tests/handlers/advisor-status.vitest.ts:493` -- The test named "does not leak prompt content in status output" builds `workspace('privacy')`, writes an empty DB file and a generation record, then asserts the serialized output contains neither `prompt` nor `secret@example.com`. No diagnostic record, prompt or secret is ever written, so the assertion is true for an empty status and would stay green if the handler later echoed a stored prompt. Holdout hygiene is the one operator check that depends on a test like this actually exercising the read path.
   Finding class: vacuous_privacy_assertion
   Scope proof: the test lives in `runtime/tests/handlers/advisor-status.vitest.ts` (scorer-attach scope) and its subject `readAdvisorHookHealthSection` is reached from `advisor-status.ts:487`, which this iteration read.
   Affected surface hints: `advisor_status` output; hook diagnostic record read path; holdout/privacy assurance for the status surface.
   Case: the fixture at `:494-496` writes only `skill-graph.sqlite` (empty) and `skill-graph-generation.json`; then `handleAdvisorStatus({ workspaceRoot: root })` is serialized and searched. There is no record containing `secret@example.com` for the assertion to exclude, so the case passes identically before and after any leak is introduced.
   Finding class (second line retained for the reducer): privacy_test_gap
   Claim: the assertion does not exercise the path that could leak.
   Evidence refs: `tests/handlers/advisor-status.vitest.ts:493-502`, `handlers/advisor-status.ts:487-512`
   Counterevidence sought: the neighbouring test at `:537-564` proves the writer strips `errorDetails` and `skillLabel`, so the write path is covered; what is uncovered is the *read* path echoing a record that already contains such text.
   Alternative explanation: the test may be a smoke check that the schema has no prompt-shaped field, which it does prove for the empty case.
   Final severity: P2 (assurance gap, no reachable leak shown)
   Confidence: medium
   Downgrade trigger: withdraw if a fixture elsewhere in the suite persists a prompt-bearing record and asserts its absence from `advisor_status` output.

## Security Checks (executed)

- **Mutating-command invariant.** Loaded `command-attach.ts` through `node --experimental-strip-types` and enumerated the live tables: 56 `COMMAND_ROWS`, 19 with `policy: 'run'`, 0 of those carrying `mutating: 'mutates'`, and 0 rows with no class at all. Pass one's "no `run` row writes" claim holds on the current table. The two `run` + `add-only` rows (`/doctor:deep-loop`, `/doctor:speckit`) are the deferred decision in pass-one section 8 and are not re-reported here.
- **Policy/owner parity.** For the 63 `TRACKED_COMMANDS` entries, every command that also has a `COMMAND_ROWS` row agrees on `policy` and `ownerSkillId` (0 mismatches). The 11 commands without a row (`/create:benchmark`, `/create:command`, `/create:diff`, `/create:goal`, `/create:repo-rule`, `/create:skill-parent`, `/create:with-human-voice`, `/deep:ai-council`, `/design:chart`, `/design:diagram`, `/design:extract`) are exactly the set pass one named; they take their policy from `TRACKED_COMMANDS` at `advisor-recommend.ts:483`, so deleting the old table did not strip it.
- **Holdout hygiene on this surface.** `advisor-status.ts` reads no prompt fixture; the only prompt-shaped strings in its output are schema keys and redacted diagnostics (`:519` uses `redactDiagnosticText`). `derive-command-bridges.cjs` reads no prompt fixture either (searched for `prompts`, `jsonl`, `holdout`: no hits). No holdout prompt text was read or printed in this iteration; no holdout counts were needed.

## Traceability Checks

- `spec_code` — partial. The `run` policy means "safe to start without asking" and the table honours it; the no-edit wording is narrower than the packet's stated intent, recorded as `SA2-P2-002`.
- `checklist_evidence` — pending. No checklist claim in focus.
- `feature_catalog_code` — pending; `command-meaning-matching.md` and the command-bridges README are the traceability iteration's job.
- `skill_agent`, `agent_cross_runtime`, `playbook_capability` — pending / notApplicable.

## Integration Evidence

- `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:478-485` is the only production path that turns an attached command into a `policy`; it reads `TRACKED_COMMANDS` (`:483`), not `COMMAND_ROWS`, which is why the 11 row-less commands still carry a policy.
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:20` imports `NO_EDIT_REQUEST` from the same module, so a widening of the pattern changes the scorer's read-only lift and the attach gate together — the single-vocabulary property the pass-one comment claims.
- `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-status.ts:554-560` keeps the async backend probe on the command path only, so the synchronous recommend reader never performs a network call.

## Edge Cases

- **Pattern copied, not widened.** The current `NO_EDIT_REQUEST` is byte-identical to the base `fusion.ts:675` inline regex (`git show 35c3188681:…/fusion.ts`). Recorded so the vocabulary finding is read as pre-existing wording that the new gate now exposes, not as a regression the fix introduced.
- **`start` vs `run`.** Every command the no-edit gap would attach is `start` or `ask`; the only `run` rows are read-only or add-only. That is what keeps `SA2-P2-002` at P2 instead of P1.
- **Row-less commands.** Eleven tracked commands have no `COMMAND_ROWS` entry, so their `mutating` class is not recorded anywhere on the attach path. Read as out of reach for this iteration: those commands are all `start` or `ask`, so the missing class cannot turn into a `run` offer.

## Confirmed-Clean Surfaces

- `command-attach.ts:289` — pattern is a stateless, non-global regex, so repeated `.test()` calls cannot alternate.
- `command-attach.ts:329` — the gate sits before any table lookup and returns `undefined`, so no command and no policy are produced.
- `advisor-status.ts:224-231`, `:318-326` — database handles close on every path, including the error path; a failed close is reported as `unavailable`, not swallowed.
- `advisor-status.ts:424-434` — the integrity probe is opt-in on the sync reader and default-on in `handleAdvisorStatus` (`:553`), and a transient lock/IO reason does not force a rebuild.
- `derive-command-bridges.cjs:1121-1143` — a runnable with no policy record throws at generation time rather than defaulting to a permissive class.

## Ruled Out

- **A `run` row that mutates.** Ruled out by executed enumeration: 19 run rows, 0 `mutates`.
- **The `COMMAND_POLICIES` deletion removing policy from row-less commands.** Ruled out: policy travels in `TRACKED_COMMANDS`, 0 mismatches against rows for the 52 commands that have both.
- **`advisor_status` leaking holdout prompt text.** No prompt source is read on this surface; the residual is that the privacy test cannot prove it (`SA2-P2-003`).
- **Path traversal through `skill_nodes.source_path` in `readIndexStaleness`.** Read as not a leak: the file is read only to hash it, the hash is compared with a hash from the same database, and no content or path is returned to the caller. A writer of that row already controls the artifact.

## Next Focus

- Dimension: traceability
- Focus area: the changed docs in this area — `feature-catalog/scorer-fusion/command-meaning-matching.md` and `runtime/scripts/command-bridges/README.md` — against the code they describe (`fusion.ts` command-meaning gate, `derive-command-bridges.cjs`), plus the pass-one `R4-P2-001` prose claim that `COMMAND_POLICIES` is gone.
- Reason: two changed docs describe generated tables and a meaning gate; pass one found three doc/code drifts in this area, so the same surface needs a re-read after the fixes.
- Rotation status: correctness and security complete (both PASS); traceability next.
- Blocked/productive carry-forward: security was productive (two P2); no blocked approach.
- Required evidence: the documented numbers against the generated JSON, and the doc's policy-source claim against `advisor-recommend.ts:483`.

Review verdict: PASS
