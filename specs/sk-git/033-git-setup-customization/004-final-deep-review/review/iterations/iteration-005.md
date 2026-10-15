# Review Iteration 5 — Final Traceability Closure and Adversarial Replay

## Dispatcher

- Mode: review; final iteration 5 of 5; session `2026-10-15T13:35:35.122Z`, generation 1, lineage `new`.
- Scope: shipped `/doctor:git` setup work and the named serializer, route-validator, and gate-input integration surfaces.
- Status: complete for this iteration. The serializer test body remains an explicit evidence gap.

## Dimension

Traceability closure plus correctness replay of the four active P1 findings. All four review dimensions are covered across the run; this pass replays correctness and traceability evidence.

## Files Reviewed

- `.skilled/commands/doctor/scripts/git-standards.cjs:135` — serializer round-trip branch.
- `.skilled/skills/sk-git/assets/commit-message-template.md:177` and `:262` — enforced rules block and `commitId` entry.
- `specs/sk-git/034-standards-template-round-trip/spec.md:33` and `:72` — failure mechanism and requirements.
- `specs/sk-git/034-standards-template-round-trip/implementation-summary.md:52` — claimed template reflow.
- `.skilled/commands/doctor/scripts/route-validate.py:16` and `:687` — duplicate target scope and command-target inputs.
- `.skilled/commands/doctor/scripts/tests/route-validate.test.sh:133` and `:140` — same-command duplicate failure and cross-command duplicate pass.
- `.github/scripts/check-gate-inputs.sh:283` and `.github/scripts/tests/check-gate-inputs.test.sh:477` — sentinel removal and adjacent missing-path coverage.
- `.skilled/commands/doctor/scripts/git-setup-check.cjs:141`, `:393`, `:559`, and `:580`; `.skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs:337` — active P1 replay.
- `.skilled/commands/doctor/scripts/tests/git-standards.test.cjs` was located by exact path search, but its body was not read in this iteration.

## Findings by Severity

### P0 Findings

None.

### P1 Findings

1. **Persistent hook disable flags remain invisible to the suppression check** — `.skilled/commands/doctor/scripts/git-setup-check.cjs:559`
   - Case: a truthy master-disable value is stored in the checkout's `hook-flags.env` while the process environment is unset; this check still reports PASS because it filters only `process.env`.
   - Evidence: `checkSuppression()` describes and enumerates environment variables only at lines 559–566. The active registry entry also records the hook-flags parser and preflight consumer evidence.
   - Finding class: cross-consumer.
   - Scope proof: the replayed checker branch does not read persistent hook flags; the active finding names `hook-flags.cjs`, the preflight consumer, and the checker test as affected surfaces.
   - Affected surface hints: `checkSuppression`, `hook-flags.cjs`, `git-preflight-advisory.mjs`, checker tests.
   - Claim adjudication: `{"type":"claim_adjudication","claim":"The setup check can report hooks active while the checkout's persistent hook-flags file disables the master or preflight path.","evidenceRefs":[".skilled/commands/doctor/scripts/git-setup-check.cjs:559",".skilled/commands/doctor/scripts/git-setup-check.cjs:561",".skilled/commands/doctor/scripts/git-setup-check.cjs:565"],"counterevidenceSought":"Re-read the checker and its cited environment-only branch; no persistent-file read is present in that branch.","alternativeExplanation":"The check may intentionally report process environment only, while persistent flags are an independent runtime control.","finalSeverity":"P1","confidence":0.91,"downgradeTrigger":"A test proving the checker intentionally excludes persisted flags and separately reports effective hook state would refute the user-visible mismatch."}`

2. **AI-hook registration accepts a marker in the wrong event or command shape** — `.skilled/commands/doctor/scripts/git-setup-check.cjs:580`
   - Case: a Codex hooks file contains `hooks.SessionStart` with a command string that merely includes `git-preflight-advisory`; `registersAdvisory()` returns true without validating the runtime event, matcher, or executable target.
   - Evidence: lines 580–583 stringify the selected hooks section and use substring inclusion. The positive fixture at `.skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs:337`–`:344` uses `SessionStart` and the marker-only command; the active registry cites the runtime contract's `PreToolUse` requirement.
   - Finding class: cross-consumer.
   - Scope proof: the helper is shared by adapter checks, and the positive Codex fixture exercises the permissive predicate.
   - Affected surface hints: `registersAdvisory`, adapter event schemas, Codex hooks configuration, checker tests.
   - Claim adjudication: `{"type":"claim_adjudication","claim":"A marker string in a hooks section is treated as registration even when the runtime event or command does not invoke the advisory correctly.","evidenceRefs":[".skilled/commands/doctor/scripts/git-setup-check.cjs:580",".skilled/commands/doctor/scripts/git-setup-check.cjs:583",".skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs:337",".skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs:344"],"counterevidenceSought":"Re-read the predicate and the positive fixture; both confirm substring matching and a SessionStart fixture, not schema validation.","alternativeExplanation":"Some adapters may validly load the advisory from a non-tool event; the active runtime contract still needs event-specific validation.","finalSeverity":"P1","confidence":0.88,"downgradeTrigger":"Per-adapter tests showing that each accepted event and command shape is valid and actually invokes the advisory would narrow or refute the claim."}`

3. **Relative PATH lookup can resolve a spawned executable from the inspected checkout** — `.skilled/commands/doctor/scripts/git-setup-check.cjs:141`
   - Case: if the child environment retains a relative PATH component and the inspected checkout contains an executable matching a spawned command, `spawnSync()` runs with that checkout as `cwd`, allowing lookup to depend on repository contents.
   - Evidence: lines 137–145 show child commands run from the inspected root with `spawnSync(command, args, { cwd, env: safeGitEnv(), ... })`. This replay did not inspect `safeGitEnv()` itself, so the guard remains unresolved rather than refuted.
   - Finding class: cross-consumer.
   - Scope proof: the path-resolution boundary is the common `runCommand()` child-process wrapper.
   - Affected surface hints: `runCommand`, `safeGitEnv`, git probes, helper process launch.
   - Claim adjudication: `{"type":"claim_adjudication","claim":"A relative PATH entry can make child executable resolution depend on files in the repository being inspected.","evidenceRefs":[".skilled/commands/doctor/scripts/git-setup-check.cjs:137",".skilled/commands/doctor/scripts/git-setup-check.cjs:141",".skilled/commands/doctor/scripts/git-setup-check.cjs:143"],"counterevidenceSought":"Re-read the cited spawn call and checked whether this call site uses an absolute executable path; it passes the command value through PATH lookup. The safe PATH builder was not re-read in this iteration.","alternativeExplanation":"safeGitEnv() may replace PATH with absolute trusted directories, which would close this path; that remains the key unresolved counterevidence.","finalSeverity":"P1","confidence":0.76,"downgradeTrigger":"Direct evidence that safeGitEnv() removes relative PATH entries and a fixture proving a repository-local executable is never selected would refute the case."}`

4. **Allowlist parsing follows a repository-controlled symlink while reading patterns** — `.skilled/commands/doctor/scripts/git-setup-check.cjs:393`
   - Case: a candidate allowlist file in the inspected checkout is a symlink to another readable host file; `readFileSync()` follows it and imports that file's lines as patterns.
   - Evidence: candidate selection uses `existsSync()` at lines 387–388, and `allowlistPatternsIn()` reads the selected path directly at lines 391–396 without checking its real path.
   - Finding class: cross-consumer.
   - Scope proof: the read occurs at the shared allowlist-pattern loader after candidate selection.
   - Affected surface hints: allowlist candidate discovery, `allowlistPatternsIn`, inspection report details.
   - Claim adjudication: `{"type":"claim_adjudication","claim":"An inspected repository can steer the checker to read a host file through a symlink used as an allowlist candidate.","evidenceRefs":[".skilled/commands/doctor/scripts/git-setup-check.cjs:387",".skilled/commands/doctor/scripts/git-setup-check.cjs:393",".skilled/commands/doctor/scripts/git-setup-check.cjs:395"],"counterevidenceSought":"Re-read candidate selection and the file read; no realpath or symlink rejection appears in the cited path.","alternativeExplanation":"Only text lines are consumed as patterns, so impact depends on whether those lines are surfaced in report details; the external-file read itself remains repository-steered.","finalSeverity":"P1","confidence":0.84,"downgradeTrigger":"A realpath containment check or a test proving symlink candidates are rejected before reading would refute the disclosure path."}`

### P2 Findings

No new P2 findings. The eight prior P2s were not re-entered in this final replay.

## Traceability Checks

- **Serializer and 034 packet:** `serialize()` preserves the styled layout only when the parsed original text already equals the serializer's canonical output; otherwise it falls back to `JSON.stringify()` (`git-standards.cjs:135`–`:139`). The 034 spec records that this fallback rewrote the rules block and names the template reflow and round-trip requirements (`spec.md:33`–`:37`, `:72`–`:75`); the implementation summary claims the `commitId` entry was reflowed (`implementation-summary.md:52`–`:54`). The shipped file's enforced rules block and `commitId` section were read (`commit-message-template.md:177`–`:184`, `:262`–`:267`). The dedicated test file was located, but its assertions were not read; mutation sensitivity for this test remains **blocked**.
- **Duplicate route targets:** the validator documents C1 as scoped within one command (`route-validate.py:16`) and supplies `(command_name, target)` pairs to the duplicate check (`:687`–`:691`). The test creates a duplicate route and expects C1 failure, then checks that `setup` repeated across commands passes (`route-validate.test.sh:133`–`:143`). These assertions would fail if duplicate detection were removed or made global.
- **Gate-input sentinel:** the parser emits a note for `/dev/null/.skilled-untrusted` and strips only that sentinel from the segment (`check-gate-inputs.sh:283`–`:289`). The test requires the sentinel-only case to pass and an adjacent missing path to fail (`check-gate-inputs.test.sh:477`–`:487`). These assertions would fail if the sentinel behavior broke or hid the neighboring missing path.
- **Core traceability:** `spec_code` and `checklist_evidence` remain partial because the serializer test body was not inspected and the SessionStart fixture remains inconsistent with the recorded adapter contract.
- **Overlay traceability:** `feature_catalog_code` and `playbook_capability` retain their prior pass status; `skill_agent` and `agent_cross_runtime` remain partial. Resource-map coverage is not applicable because `resource-map.md` is absent.

## Integration Evidence

- `.skilled/commands/doctor/scripts/route-validate.py` and `route-validate.test.sh` — command-scoped duplicate target rule and its positive/negative fixtures.
- `.github/scripts/check-gate-inputs.sh` and `check-gate-inputs.test.sh` — sentinel parser behavior and neighboring-path sensitivity.
- `.skilled/skills/sk-git/assets/commit-message-template.md`, `.skilled/commands/doctor/scripts/git-standards.cjs`, and the 034 spec/summary — serializer contract; the named serializer test was found but not inspected.
- `.skilled/commands/doctor/scripts/git-setup-check.cjs` and its test — active suppression, registration, executable lookup, and symlink findings.

## Edge Cases

- The dispatch state and config agree: four iteration records are complete, this is iteration 5, `maxIterations` is 5, and the convergence threshold is 0.10.
- The serializer regression test is `.skilled/commands/doctor/scripts/tests/git-standards.test.cjs`; it was discovered by exact path search but its body remains unverified.
- The relative-PATH replay did not inspect `safeGitEnv()`; retain the active finding until that sanitizer is directly checked.

## Confirmed-Clean Surfaces

- Duplicate target scoping is aligned between validator intent and its same-command/cross-command tests.
- The gate-input sentinel is narrowly removed, and the adjacent missing-path test protects against dropping the rest of a command segment.
- No new source-level finding was added in this iteration.

## Ruled Out

- Global duplicate target rejection: the real-manifest test explicitly requires same-name targets across different commands to pass.
- Sentinel overreach that hides a neighboring missing path: the test at `check-gate-inputs.test.sh:483`–`:487` requires that path to remain a failure.

## SCOPE VIOLATIONS

None. Only the review packet artifacts and append gateway state are written.

## Verdict

Conditional: four active P1 findings remain; no P0 is active. The iteration's evidence gap is the unread serializer test body.

## Next Dimension

None. The four dimensions are covered and the five-iteration cap is reached. Synthesis should carry the four active P1s, the eight prior P2s, and the serializer-test evidence gap.

Review verdict: CONDITIONAL
