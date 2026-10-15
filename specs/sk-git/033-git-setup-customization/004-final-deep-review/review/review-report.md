# Deep Review Report: /doctor:git setup program

Review target: all shipped work of the `/doctor:git setup` program, commits 8d40b8c128 through 0b2414a14b on main (`git log c05034a20b..0b2414a14b`), across 25 scoped files plus the hooks and helpers they model.

Session `2026-10-15T13:35:35.122Z`, generation 1. Executor: cli-codex, `gpt-6-luna`, reasoning `max`, service tier `fast`. Five iterations ran and the loop stopped at the iteration cap (`maxIterationsReached`).

---

## 1. Executive Summary

**Verdict: CONDITIONAL.** No P0 is active. Two P1 findings remain after the adversarial self-check, and ten P2 advisories.

| Severity | Active | Notes |
|---|---:|---|
| P0 | 0 | none raised |
| P1 | 2 | both make a setup row report healthy while the real hook is off or never fires |
| P2 | 10 | eight raised as P2, two P1s downgraded at the referee step |

Both P1s break the battery's core promise: a row that reads PASS while the sk-git surface it describes is not working. The battery also makes no writes and runs no repository code under default conditions. Iteration 3 confirmed that `/doctor:git setup` is named correctly in every doc that lists the targets. The work is not complete: two checks fail open, and one requested invariant was never verified. Nobody confirmed that each FAIL's repair actually fixes its row (see §8).

Fix first: **F-001**, the suppression check that ignores `hook-flags.env`. It is the more likely failure in practice. A persisted master switch silences every hook, and the battery reports suppression PASS.

---

## 2. Planning Trigger

`/speckit:plan` is required, because the verdict is CONDITIONAL with two active P1 findings.

```json
{
  "Planning Packet": true,
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": true,
  "activeFindings": [
    {"id": "R1-P1-001", "severity": "P1", "file": ".skilled/commands/doctor/scripts/git-setup-check.cjs", "line": 559, "title": "Persistent hook disable flags are invisible to the suppression check"},
    {"id": "R1-P1-002", "severity": "P1", "file": ".skilled/commands/doctor/scripts/git-setup-check.cjs", "line": 580, "title": "AI-hook registration passes on a marker string in the wrong event"},
    {"id": "R2-P1-001", "severity": "P2", "previousSeverity": "P1", "file": ".skilled/commands/doctor/scripts/git-setup-check.cjs", "line": 141, "title": "Relative PATH entries can execute checkout-supplied git or bash"},
    {"id": "R2-P1-002", "severity": "P2", "previousSeverity": "P1", "file": ".skilled/commands/doctor/scripts/git-setup-check.cjs", "line": 393, "title": "Symlinked branch allowlist is followed and echoed"},
    {"id": "R1-P2-001", "severity": "P2", "file": ".skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs", "line": 130},
    {"id": "R2-P2-001", "severity": "P2", "file": ".skilled/commands/doctor/scripts/git-setup-check.cjs", "line": 612},
    {"id": "R2-P2-002", "severity": "P2", "file": ".skilled/commands/doctor/scripts/git-setup-check.cjs", "line": 127},
    {"id": "R3-P2-001", "severity": "P2", "file": "specs/sk-git/033-git-setup-customization/002-doctor-git-setup/acceptance-criteria.md", "line": 55},
    {"id": "R3-P2-002", "severity": "P2", "file": "specs/sk-git/033-git-setup-customization/002-doctor-git-setup/tasks.md", "line": 35},
    {"id": "R4-P2-001", "severity": "P2", "file": ".skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs", "line": 197},
    {"id": "R4-P2-002", "severity": "P2", "file": ".skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs", "line": 232},
    {"id": "R4-P2-003", "severity": "P2", "file": ".skilled/commands/doctor/scripts/git-setup-check.cjs", "line": 358}
  ],
  "remediationWorkstreams": ["WS1 fail-open setup checks (P1)", "WS2 trust-boundary hardening (P2)", "WS3 test strength and evidence (P2)", "WS4 unverified repair effectiveness (deferred)"],
  "specSeed": ["checkSuppression must merge hook-flags.env the way hook-flags.cjs does", "registersAdvisory must match the runtime's event and matcher, not a substring"],
  "planSeed": ["Fix checkSuppression and add a hook-flags.env fixture test", "Make registersAdvisory event-aware per runtime and fix the Codex SessionStart fixture", "Harden PATH, symlink, FIFO and GIT_DIR handling", "Strengthen the no-write and planted-helper tests", "Verify each FAIL repair end to end"],
  "findingClasses": ["cross-consumer", "matrix/evidence", "trust-boundary"],
  "affectedSurfacesSeed": [".skilled/commands/doctor/scripts/git-setup-check.cjs", ".skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs", ".skilled/hooks/shared/hook-flags.cjs", ".skilled/skills/sk-git/scripts/hooks/README.md", "specs/sk-git/033-git-setup-customization/002-doctor-git-setup/acceptance-criteria.md"],
  "fixCompletenessRequired": true
}
```

---

## 3. Active Finding Registry

The reducer registry holds each P1 twice: iteration 5 re-emitted the four P1 ids during its replay. Deduplicated by id, the run holds 4 distinct P1 candidates and 8 distinct P2s. After the referee step: 2 P1, 10 P2.

### P1

**R1-P1-001: Persistent hook disable flags are invisible to the suppression check**
- Dimension: correctness. File: `.skilled/commands/doctor/scripts/git-setup-check.cjs:559-566`.
- Evidence: `checkSuppression()` filters `process.env` only. The shared reader `isHookEnabled()` merges the hook-flags config file, `path.join(__dirname, "..", "hook-flags.env")`, under the environment (`.skilled/hooks/shared/hook-flags.cjs:87-88`, `:150-173`). `git-preflight-advisory.mjs:76` returns early when `isHookEnabled('git-preflight')` is false.
- Failure case: the checkout's `.skilled/hooks/hook-flags.env` holds `SYSTEM_HOOKS_DISABLED=1` and the shell environment leaves it unset. Every hook is off, yet the suppression row prints PASS with no detail.
- Impact: the one row whose job is to say "hooks are switched off" says the opposite.
- Fix: read the hook-flags file with the same precedence as `isHookEnabled`, parsing it without requiring it from the inspected checkout. Report persisted values with their source, and fail on a persisted master switch. Add a fixture test with the flag in the file and not in the env.
- Disposition: confirmed by the orchestrator's re-read during the adversarial self-check.

**R1-P1-002: AI-hook registration passes on a marker string in the wrong event**
- Dimension: correctness. File: `.skilled/commands/doctor/scripts/git-setup-check.cjs:580-583`, with test `.skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs:337-344`.
- Evidence: `registersAdvisory()` runs `JSON.stringify(section).includes('git-preflight-advisory')` over the whole hooks section. The documented Codex wiring is `PreToolUse` with matcher `exec` (`.skilled/skills/sk-git/scripts/hooks/README.md:78`). The positive Codex fixture registers the marker under `SessionStart` and asserts PASS.
- Failure case: `--tool codex` with `.codex/hooks.json` holding `hooks.SessionStart: [{command: "echo git-preflight-advisory"}]` and no `PreToolUse` entry. The row reports registered, though git commands never trigger the advisory.
- Impact: the check meant to catch "present but unregistered" adapters fails open, and its own test locks in the wrong behavior.
- Fix: match the per-runtime event and matcher from the README table: Claude `PreToolUse`, Codex `PreToolUse`/`exec`, Devin `PreToolUse`/`^exec$`, Cursor `preToolUse`/`Shell`. Change the Codex fixture to the real shape, and add a negative wrong-event test.
- Disposition: confirmed.

### P2

| ID | Title | File:line | Failure case | Fix |
|---|---|---|---|---|
| R2-P1-001 (P1→P2) | Relative PATH entries can run a checkout-supplied `git` or `bash` | `git-setup-check.cjs:137-145`, `:127` | `safeGitEnv()` copies `PATH` unchanged and `runCommand` uses the inspected root as `cwd`. With `.`, an empty component, or a trailing `:` in the operator's PATH, a clone's `./git` runs | Resolve `git` and `bash` to absolute paths once, from the battery's own environment, or strip relative PATH entries |
| R2-P1-002 (P1→P2) | Symlinked allowlist is followed and its lines are echoed | `git-setup-check.cjs:383-396`, `:371` | A clone makes `remote-branch-allowlist.txt` a symlink to any file the operator can read. Its non-comment lines appear in the human and JSON report | `lstat` the candidate, refuse symlinks or paths outside the main worktree, and cap the size |
| R1-P2-001 | JSON outcome tests skip SKIP- and UNKNOWN-only runs | `tests/git-setup-check.test.cjs:130-155` | A future JSON-only aggregation change that treats SKIP or UNKNOWN as FAIL prints `status: FAIL` with exit 0, and no test catches it | Add no-FAIL JSON cases with SKIP and with UNKNOWN, asserting `OK` and exit 0 |
| R2-P2-001 | A FIFO at a recognized hook path blocks the checker | `git-setup-check.cjs:598`, `:612` | A clone puts a FIFO where a hook file is read; `readFileSync` blocks forever | Read only regular files below a size cap |
| R2-P2-002 | Inherited `GIT_DIR`/`GIT_WORK_TREE` redirect the probe | `git-setup-check.cjs:127` | An exported `GIT_DIR` makes `--repo X` report on a different repository | Delete `GIT_DIR`, `GIT_WORK_TREE`, `GIT_INDEX_FILE` and `GIT_COMMON_DIR` in `safeGitEnv` |
| R3-P2-001 | AC-002 cites tests that never assert human rows or repair lines | `002-doctor-git-setup/acceptance-criteria.md:55` | `renderHuman` drops a row or a `repair:` line, the cited tests still pass, and AC-002 stays Met | Add human-mode assertions for the rows and the repair lines |
| R3-P2-002 | Completed tasks cite scratch-only evidence | `002-doctor-git-setup/tasks.md:35`, 034 `tasks.md` T001/T003 | No retained artifact lets a reviewer recheck the baseline and `cmp` claims | Keep the evidence in the packet, or cite a reproducible command |
| R4-P2-001 | The no-write test only sees writes inside the fixture repo | `tests/git-setup-check.test.cjs:197-209` | A regression that writes a marker under the installed `.skilled/skills/sk-git` tree or `/tmp` leaves `f.repo` unchanged, so the test passes | Also observe the install root and other writable paths, or run under a write-denying sandbox |
| R4-P2-002 | The planted-helper test can pass without exercising helper resolution | `tests/git-setup-check.test.cjs:232-254` | The fixture fails the install gate first (the test's own comment says so), so it never reaches the validator lookup. A regression that resolves the validator from the checkout would still pass | Use a fixture that passes the install gate, and assert the validator row was reached before asserting the planted marker stayed absent |
| R4-P2-003 | Allowlist verdicts and displayed patterns pick their source separately | `git-setup-check.cjs:358-388` | The verdicts come from `worktree-naming.sh` and the patterns from `allowlistFileFor()`. If the matcher changes which file wins when both `.skilled` and `.opencode` copies exist, the report shows patterns from a file the verdict did not use | Have the matcher expose its selected source, or add a both-files regression test |

---

## 4. Remediation Workstreams

1. **WS1, fail-open checks (P1):** R1-P1-001, then R1-P1-002. Each needs a negative fixture test that fails before the fix.
2. **WS2, trust-boundary hardening (P2):** R2-P1-001, R2-P1-002, R2-P2-001, R2-P2-002. They share one theme: inputs a clone or the parent environment controls.
3. **WS3, test strength and evidence (P2):** R1-P2-001, R4-P2-001, R4-P2-002, R3-P2-001, R3-P2-002, R4-P2-003.
4. **WS4, unverified invariant (deferred):** check every FAIL's repair end to end (§8).

---

## 5. Spec Seed

- The suppression row reports the effective switch state from both sources, the environment and `hook-flags.env`, each with its source, and fails on a persisted master switch.
- AI-tool registration means the runtime's documented event and matcher reference the advisory, not that the marker string appears somewhere.
- The battery resolves `git` and `bash` to absolute paths, clears repository-selecting git env vars, and reads only regular, non-symlinked files below a size cap.
- Each FAIL row's repair is checked by a test: apply the repair to the fixture and the row turns PASS.

---

## 6. Plan Seed

1. In `checkSuppression`, parse `hook-flags.env` with the same precedence rules, without requiring code from the checkout. Add a fixture test where the flag is in the file and not in the env.
2. Make `registersAdvisory(tool, body)` event- and matcher-aware per runtime. Fix the Codex fixture at `tests/git-setup-check.test.cjs:337`, and add a wrong-event negative test.
3. Harden `safeGitEnv` and `runCommand`: absolute binaries, cleared `GIT_DIR`-family variables, regular-file and size guards, no symlinked allowlist.
4. Strengthen `tests/git-setup-check.test.cjs`: JSON SKIP/UNKNOWN cases, out-of-repo write detection, and proof that the planted helper was reached.
5. Write repair round-trip tests: for each FAIL, apply the named repair and expect PASS.
6. Fix the AC-002 evidence and the scratch-only task evidence in 002 and 034.

---

## 7. Traceability Status

**Core protocols**
- `spec_code`: **partial**. The 002 claims hold, apart from R1-P1-001 and R1-P1-002: eleven checks, read-only, helpers loaded from the install root, exit codes 0/1/2, `--json`, and the three build-time defect fixes. The 034 serializer branch (`git-standards.cjs:135-139`) matches the 034 spec's failure mechanism and its reflow claim. The body of the serializer's dedicated test, `tests/git-standards.test.cjs`, was never read, so whether that test catches a broken round trip is unverified.
- `checklist_evidence`: **partial**. AC-007 is marked Met on the Codex fixture that R1-P1-002 shows is wrong. AC-002 and the scratch-only tasks are covered by R3-P2-001 and R3-P2-002.

**Overlay protocols**
- `feature_catalog_code`: **pass**. The catalog names `setup` and describes it as read-only.
- `playbook_capability`: **pass**. DOC-384's expected output matched a live run: `git-setup-check.cjs --repo . --tool claude` printed eleven rows ending `STATUS=OK checks=11`, exit 0.
- `skill_agent`: **partial**. The hook README's runtime table is the contract R1-P1-002 breaks.
- `agent_cross_runtime`: **partial**. Only the Codex false-positive path was adjudicated. The Claude, Devin and Cursor registration shapes were not re-audited.
- **Setup naming across docs:** pass. Every list of `/doctor:git` targets names `setup`: `git.md`, `_routes.yaml`, the presentation asset, the setup workflow YAML, sk-git `SKILL.md` and `README.md`, the feature-catalog playbook, DOC-384, `.skilled/commands/README.txt`, and the root `README.md`.
- **Route validator and gate-inputs check:** pass. Duplicate-target checking is scoped to one command, and `route-validate.test.sh:133-143` fails if the check were removed or made global. The gate-inputs sentinel strips only `/dev/null/.skilled-untrusted`, and `check-gate-inputs.test.sh:477-487` keeps a neighboring missing path failing.
- `AC_COVERAGE`: advisory only. The target is a file set, not a lifecycle spec folder.

Resource-map coverage gate: skipped, because no `resource-map.md` existed at init.

---

## 8. Deferred Items

- **Repair effectiveness was never verified (search debt SL-005).** The operator's invariant "each FAIL's repair actually fixes it" stayed deferred after iteration 1 and no later iteration picked it up. The build summary records two repairs fixed during the build (ai-tool-hooks, Commit-Id). Nobody checked the remaining repair texts end to end.
- **Dynamic test execution (SL-007).** Iteration 1 did not run the test file, because the prompt's ban on `rm` conflicted with the test's own `fs.rmSync` cleanup. Iteration 3 ran the battery live; the test suite itself was never run during the review.
- **Serializer test sensitivity (SL-005-001).** The body of `tests/git-standards.test.cjs` was not read.
- **Cross-runtime registration shapes** for Claude, Devin and Cursor were not re-audited.

---

## 9. Dimension Expansion Map

- Completed pivots: 0. Failed pivots: 0. Audited overrides: 0.
- Directions covered: correctness (iteration 1), security (iteration 2), traceability (iteration 3), maintainability (iteration 4), traceability closure plus P1 replay (iteration 5).
- Remaining frontier: repair effectiveness, a test-suite run, serializer test sensitivity, and cross-runtime registration shapes.

---

## 10. Search Ledger

- `hasSearchDebt: true`. The reducer carries 7 search-debt items, listed in `deep-review-findings-registry.json` under `searchDebt`. Iteration 5 closed three of them: SL-003-005 (034 serializer comparison), SL-004-006 (duplicate-target scoping) and SL-004-007 (gate-inputs test sensitivity). Their registry rows were not cleared, because the reducer keys them by iteration. Still open: SL-005 (repair effectiveness), SL-007 (dynamic test run), SL-004-005 and SL-005-001 (serializer test body).
- Graph coverage mode: graphless fallback. Direct reads, exact grep and producer/consumer traces are cited in each iteration's `searchLedger` rows.
- Ruled out: a missing `setup` in any target list; a DOC-384 output-shape mismatch; global duplicate-target rejection; a sentinel strip that hides a neighboring missing path; shell evaluation of repository text in `check-gate-inputs.sh`.

---

## 11. Audit Appendix

### Convergence summary
- Stop reason: `maxIterationsReached` (5 of 5). The final graph convergence check returned CONTINUE (score 0.919; evidence density 0.625 below threshold), so the run did not converge legally. It stopped at the cap.
- Dimension coverage: 4/4 (1.0).
- Claim adjudication: passed every iteration; every new P1 carried a typed packet.

### Adversarial self-check (P1)
| ID | Hunter (re-read) | Skeptic | Referee |
|---|---|---|---|
| R1-P1-001 | `git-setup-check.cjs:559-566` reads env only; `hook-flags.cjs:87-88,150-173` merges the file; `git-preflight-advisory.mjs:76` honors it | Could the row be env-only on purpose? Its stated source names the suppression flags, and the hook honors the file, so an env-only row misreports | **Confirmed P1** |
| R1-P1-002 | `git-setup-check.cjs:580-583` substring match; README:78 requires `PreToolUse`/`exec`; fixture uses `SessionStart` | Could a marker probe suffice? It cannot show the advisory fires on git commands | **Confirmed P1** |
| R2-P1-001 | `safeGitEnv` (`:125-134`) copies PATH; `runCommand` (`:137-145`) uses `cwd` = inspected root | The repository cannot set PATH. Exploitation needs the operator to have a relative PATH component, which is non-default | **Downgraded to P2**: real breach of the invariant, but only under that precondition |
| R2-P1-002 | `allowlistFileFor` uses `existsSync`, which follows symlinks; `allowlistPatternsIn` reads and echoes the file (`:383-396`) | The disclosure reaches the operator's own terminal and crosses no privilege boundary. Exposure needs the output to be shared, such as pasted into a log or read by an agent | **Downgraded to P2**: hardening |

### Process notes
- Iteration 1's first dispatch wrote a malformed delta: lines serialized as `[object Object]`. It was quarantined to `quarantine/iter-001.malformed.jsonl` and repaired by the single allowed redispatch.
- Iteration 2's first dispatch ran out of its tool budget and wrote nothing. The single redispatch completed it.
- The write-containment advisories in the state log name paths that parallel sessions wrote during the run: `003-improvement-research/`, `specs/system-skill-advisor/034-doctor-command-guidance/`, and the parent `graph-metadata.json`. The review child wrote none of them; all were left on disk.

### Sources reviewed
The 25 scoped files in `deep-review-config.json#reviewScopeFiles`, plus `.skilled/hooks/shared/hook-flags.cjs`, `.skilled/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs`, `.skilled/skills/sk-git/scripts/hooks/README.md`, `.skilled/commands/doctor/scripts/git-standards.cjs` and `.skilled/commands/README.txt`.
