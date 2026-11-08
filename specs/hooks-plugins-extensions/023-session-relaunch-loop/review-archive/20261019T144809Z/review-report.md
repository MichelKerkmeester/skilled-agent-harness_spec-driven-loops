---
title: "Deep Review Report: session relaunch loop (generation 2, fan-out)"
description: "Generation-2 fan-out deep review of the session relaunch loop packet on cli-codex gpt-6-luna and cli-devin swe-2-max, three iterations each. Merged verdict PASS with twelve active P2 advisories and a Search Ledger verdict conflict flagged for the operator."
importance_tier: normal
contextType: review
---

# Deep Review Report: Session Relaunch Loop (Generation 2)

## 1. OVERVIEW AND EXECUTIVE SUMMARY

### Overview

- **Verdict:** PASS (merged verdict as dispatched). See the LOGIC-SYNC item in section 10: the Search Ledger rule conflicts with this verdict and the operator must rule on it.
- **hasAdvisories:** true
- **Active findings:** P0 0, P1 0, P2 12
- **Finding accounting:** the merged registry holds 15 open P2 entries from the two lineages. Verification disposed of them as 11 confirmed, 1 disproved (R1-P2-003) and 3 duplicates folded into their primaries (R2-P2-001 into LUNA-003, LUNA-005 into R3-P2-001, R3-P2-002 into LUNA-004). The orchestrator's verification pass added NEW-001, which no lineage reported. That gives 11 + 1 = 12 active.
- **Scope:** `specs/hooks/023-session-relaunch-loop`. The relaunch core, the five runtime adapters (Claude, Codex, Hermes, Pi, OpenCode), the `skilled-loop` wrapper, the handoff command, the hook wiring, the tests, the catalog and playbook surfaces, and the packet's phase specs (001 to 005).
- **Run:** generation 2. Two lineages, three iterations each, stop policy max-iterations. Both lineages stopped at the iteration cap (`maxIterationsReached`); convergence was telemetry only.
  - `luna`: cli-codex, model gpt-6-luna, reasoning effort `max` per the merged registry. The dispatch's "max/fast" pairing is not recorded in state, so the fast setting is UNKNOWN.
  - `swe`: cli-devin, model swe-2-max. No reasoning-effort value is recorded (`null`).
- **Generation 1:** the first run (10-iteration cap, deepseek-v4.1-flash through cli-pi) was archived by the restart to `review-archive/20261018T184826Z/`. Its own report records 7 iterations run, stop reason `converged`, and 12 P2 advisories. Phase 005 (`005-deep-review-remediation`) remediated those 12. The swe lineage's section 2 confirms the phase 005 remediation in the code.
- **Dimension coverage (merged):** 4 of 4 (correctness, security, traceability, maintainability). Per lineage: luna 3 of 4 (maintainability uncovered, reduced to 0.75 in its event row); swe 4 of 4.

No active finding blocks release. The twelve advisories cluster into six groups: state directory and log robustness, killer lock and PID handling, handoff path and repo-root resolution, the live-shell guard, process-walk duplication, and spec documentation drift.

---

## 2. PLANNING TRIGGER

`/speckit:plan` is not required by the PASS verdict. The remediation workstreams in section 4 seed a follow-on phase if the operator chooses to fix the advisories. `triggered` is `false` and `fixCompletenessRequired` is `false`, because no operator instruction in the inputs asks for full remediation. Both values are decisions taken by this report, not inherited state.

```json
{
  "label": "Planning Packet",
  "triggered": false,
  "verdict": "PASS",
  "hasAdvisories": true,
  "activeFindings": [
    {"id": "LUNA-001", "severity": "P2", "file": ".skilled/hooks/session-relaunch/lib/relaunch-core.cjs:580", "findingClass": "io-error-handling", "aliases": []},
    {"id": "LUNA-002", "severity": "P2", "file": ".skilled/hooks/session-relaunch/lib/relaunch-core.cjs:42-46,143-145", "findingClass": "cross-user-state-directory", "aliases": []},
    {"id": "LUNA-003", "severity": "P2", "file": ".skilled/hooks/session-relaunch/lib/killer.cjs:449-464", "findingClass": "process-identity-race", "aliases": ["R2-P2-001"]},
    {"id": "R1-P2-001", "severity": "P2", "file": ".skilled/hooks/session-relaunch/lib/killer.cjs:106", "findingClass": "io-error-handling", "aliases": []},
    {"id": "R1-P2-002", "severity": "P2", "file": ".skilled/hooks/session-relaunch/lib/killer.cjs:441", "findingClass": "concurrency", "aliases": []},
    {"id": "R1-P2-004", "severity": "P2", "file": ".skilled/hooks/session-relaunch/lib/killer.cjs:275", "findingClass": "concurrency", "aliases": []},
    {"id": "R2-P2-002", "severity": "P2", "file": ".skilled/hooks/session-relaunch/bin/session-relaunch.cjs:72", "findingClass": "trust-boundary", "aliases": []},
    {"id": "NEW-001", "severity": "P2", "file": ".skilled/hooks/session-relaunch/lib/nudge.cjs:189; .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:73", "findingClass": "UNKNOWN", "aliases": []},
    {"id": "R2-P2-003", "severity": "P2", "file": ".skilled/hooks/session-relaunch/bin/session-relaunch.cjs:190", "findingClass": "protection-bypass", "aliases": []},
    {"id": "R3-P2-003", "severity": "P2", "file": ".skilled/hooks/session-relaunch/bin/session-relaunch.cjs:138", "findingClass": "cross-consumer-duplication", "aliases": []},
    {"id": "LUNA-004", "severity": "P2", "file": "specs/hooks/023-session-relaunch-loop/005-deep-review-remediation/spec.md:40,43", "findingClass": "documentation-evidence-defect", "aliases": ["R3-P2-002"]},
    {"id": "R3-P2-001", "severity": "P2", "file": "specs/hooks/023-session-relaunch-loop/spec.md:39", "findingClass": "documentation-drift", "aliases": ["LUNA-005"]}
  ],
  "remediationWorkstreams": [
    "WS-1 state directory and log robustness: LUNA-001, LUNA-002",
    "WS-2 killer lock and PID handling: LUNA-003 (narrow and document the residual window), R1-P2-001, R1-P2-002, R1-P2-004",
    "WS-3 handoff path and repo-root resolution: R2-P2-002, NEW-001",
    "WS-4 live-shell guard: R2-P2-003",
    "WS-5 process-walk consolidation: R3-P2-003",
    "WS-6 spec documentation drift: R3-P2-001, LUNA-004"
  ],
  "specSeed": "Follow-on phase only if the operator opts in: fix the twelve P2 advisories in the six workstreams, with a test for each code fix, and repoint the parent and phase 005 review references to the archived report. Record the LUNA-003 residual PID-reuse window as an accepted, documented limit.",
  "planSeed": "One lane per workstream. Serialize WS-2 before WS-5 (both touch the killer ancestry walk) and serialize WS-3, WS-4 and WS-5 (all touch bin/session-relaunch.cjs). Tests first for WS-1 to WS-4. Spec documentation fixes for WS-6 run last.",
  "findingClasses": ["io-error-handling", "cross-user-state-directory", "process-identity-race", "race-toctou", "concurrency", "trust-boundary", "protection-bypass", "cross-consumer-duplication", "documentation-evidence-defect", "checklist-evidence-defect", "documentation-drift", "parent-child-contract-drift", "UNKNOWN"],
  "affectedSurfacesSeed": [
    ".skilled/hooks/session-relaunch/lib/relaunch-core.cjs",
    ".skilled/hooks/session-relaunch/lib/killer.cjs",
    ".skilled/hooks/session-relaunch/lib/nudge.cjs",
    ".skilled/hooks/session-relaunch/bin/session-relaunch.cjs",
    ".skilled/hooks/session-relaunch/pi/session-relaunch.ts",
    ".skilled/hooks/session-relaunch/tests/",
    "specs/hooks/023-session-relaunch-loop/spec.md",
    "specs/hooks/023-session-relaunch-loop/005-deep-review-remediation/spec.md",
    "specs/hooks/023-session-relaunch-loop/005-deep-review-remediation/acceptance-criteria.md"
  ],
  "fixCompletenessRequired": false
}
```

---

## 3. ACTIVE FINDING REGISTRY

Twelve active P2 findings. Severity counts: P0 0, P1 0, P2 12. Each entry carries the lineage-reported finding class and scope proof. Where a field exists in no source, it is `UNKNOWN`. The registry's `file:line` is cited first, and the verifier's narrower line range is noted where it differs.

### LUNA-001 - P2 - appendLog accepts a short write as complete

- **Dimension:** correctness
- **File:** `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:580` (the write and success return run through :580-585)
- **Evidence:** a single `fs.writeSync` call ignores its returned byte count, then the helper fsyncs and returns success. The verifier ran a stubbed 10-byte write that returned success with a truncated line.
- **Impact:** a short write (disk full, file-size limit) truncates an event in `relaunch.log` while the helper reports success. The next append restores the line boundary but not the lost bytes.
- **Fix recommendation:** throw when the returned count is less than `Buffer.byteLength(text)`. Add a stubbed short-write test.
- **Disposition:** CONFIRMED (run). The luna lineage marks it a static inference until a short result is observed; the verifier observed one.
- **findingClass:** io-error-handling
- **scopeProof:** all inspected runtime event producers route through the shared append helper.
- **affectedSurfaceHints:** Claude, Codex, Hermes, Pi and OpenCode event logging; the wrapper; the killer.
- **Lineage and iteration:** luna, iteration 1.

### LUNA-002 - P2 - The fallback state directory is shared across users on systems with a shared temp directory

- **Dimension:** security
- **File:** `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:42-46, 143-145` (the verifier cites :144 for the fallback and :45 for `chmodSync`)
- **Evidence:** without `XDG_RUNTIME_DIR`, `stateDir` falls back to `os.tmpdir()` plus the fixed name `skilled-relaunch`. `ensureStateDir` accepts an existing path and changes its mode. The verifier notes that `chmodSync` throws EPERM on a directory owned by another user.
- **Impact:** on Linux with `XDG_RUNTIME_DIR` unset and a shared `/tmp`, another local user can pre-create the directory and deny relaunch state to this user. The verifier judges this unreachable on macOS, which uses a per-user tmpdir.
- **Fix recommendation:** fall back to `skilled-relaunch-<uid>`. Before any chmod, `lstat` the path and require a real directory owned by this user.
- **Disposition:** CONFIRMED (conditional). Static inference; an isolated shared-temp run with `XDG_RUNTIME_DIR` unset would confirm the denial path.
- **findingClass:** cross-user-state-directory
- **scopeProof:** `stateDir` is the common path builder for relaunch records, killer locks and event logs.
- **affectedSurfaceHints:** state setup, relaunch records, killer locks, event logs when `XDG_RUNTIME_DIR` is absent.
- **Lineage and iteration:** luna, iteration 2.

### LUNA-003 - P2 - The killer can signal a reused PID after its ancestry check

- **Dimension:** security
- **File:** `.skilled/hooks/session-relaunch/lib/killer.cjs:449-464` (ancestry :449, liveness :454, record read :456, `process.kill` :463)
- **Evidence:** the killer checks loop ancestry and liveness by numeric PID on a `ps` snapshot, reads the armed record, then calls `process.kill` on the same number. Nothing binds the signal to a stable identity for the process that passed the ancestry check.
- **Impact:** if the target exits and its PID is reused inside that window, SIGTERM reaches a replacement process owned by the same user. The verifier judges this practically unreachable.
- **Fix recommendation:** move the record read above the ancestry check. Document the residual window, because Node has no pidfd. **Disposition decision for this report: narrow and document the residual window.** The fix narrows the window; it does not close it, and the closure gap is recorded as accepted.
- **Disposition:** CONFIRMED (cannot fully close).
- **findingClass:** process-identity-race
- **Folded duplicate:** R2-P2-001 (swe, iteration 2, class `race-toctou`, same file and line). Both ids are kept in this entry.
- **scopeProof:** the ancestry check is a point-in-time property; the signal is sent later by PID.
- **affectedSurfaceHints:** the only SIGTERM the feature delivers; every adapter that spawns the killer.
- **Lineage and iteration:** luna, iteration 2; duplicate reported by swe, iteration 2.

### LUNA-004 - P2 - Phase 5 depends on a review-report path that is absent

- **Dimension:** traceability
- **File:** `specs/hooks/023-session-relaunch-loop/005-deep-review-remediation/spec.md:40,43`, and the parent handoff row at `specs/hooks/023-session-relaunch-loop/spec.md:114`
- **Evidence:** both specs name `review/review-report.md`. That path is absent. The report and registry exist only under `review-archive/20261018T184826Z/`, and the archived report carries verdict PASS.
- **Impact:** the declared Phase 5 dependency cannot be followed from its specified path, so the remediation phase's review source is not reproducible through the packet's current links.
- **Fix recommendation:** point all three references (spec.md:114, 005 spec.md:40 and :43) at the archived report path, or restore the declared canonical path.
- **Disposition:** CONFIRMED (confirmed path mismatch).
- **findingClass:** documentation-evidence-defect
- **Folded duplicate:** R3-P2-002 (swe, iteration 3, class `checklist-evidence-defect`, the 004-to-005 verification cell at spec.md:114). Both ids are kept in this entry.
- **scopeProof:** the root handoff criterion and the Phase 5 dependency name the missing file directly.
- **affectedSurfaceHints:** phase handoff verification, remediation provenance, future packet review.
- **Lineage and iteration:** luna, iteration 3; duplicate reported by swe, iteration 3.

### R1-P2-001 - P2 - Killer liveness check crashes on EPERM where the core treats it as alive

- **Dimension:** correctness
- **File:** `.skilled/hooks/session-relaunch/lib/killer.cjs:106` (the registry line; the verifier's rethrow is at :111-112)
- **Evidence:** `targetIsRunning` rethrows every non-ESRCH error, so a `kill(pid, 0)` EPERM leaves the poll loop. The core's `isProcessAlive` counts EPERM as alive (`relaunch-core.cjs:617-620`). The verifier ran `--target-pid 1`, which logged `killer-error kill_EPERM`.
- **Impact (verifier):** only a misleading `killer-error` line. The lineage description adds that the poll loop exits through `main().catch`, so the verifier's impact and the lineage's description should both be read.
- **Fix recommendation:** `targetIsRunning` returns false on EPERM.
- **Disposition:** CONFIRMED (run).
- **findingClass:** io-error-handling
- **scopeProof:** killer.cjs:108-112 against relaunch-core.cjs:617-620.
- **affectedSurfaceHints:** killer supervise and wait loops; arm paths that respawn the killer.
- **Lineage and iteration:** swe, iteration 1.

### R1-P2-002 - P2 - recordTimeout gates unarm and notify on a pre-wait record snapshot

- **Dimension:** correctness
- **File:** `.skilled/hooks/session-relaunch/lib/killer.cjs:441`
- **Evidence:** `watchedRecord` is read once before `waitForIdle`. The armed-status gate and `expectedHandoff` come from that stale snapshot, while the SIGTERM path re-reads the record (scope proof :441, :408, :412, :480).
- **Impact (verifier, narrower than the lineage stated):** K1 watches note A, prepare B is armed, K2 exits on `killer-lock-held`, K1 times out on snapshot A, and the notification names A. B stays armed with no killer until the next Stop.
- **Fix recommendation:** re-read the record in `recordTimeout`. Skip unarm and notify when the handoff changed.
- **Disposition:** CONFIRMED (narrower than stated).
- **findingClass:** concurrency
- **scopeProof:** killer.cjs:441, :408, :412, :480.
- **affectedSurfaceHints:** killer timeout path; `core.unarm` expected-field guards.
- **Lineage and iteration:** swe, iteration 1.

### R1-P2-004 - P2 - Lock-owner liveness trusts PID identity; a recycled PID pins a stale lock

- **Dimension:** correctness
- **File:** `.skilled/hooks/session-relaunch/lib/killer.cjs:275` (the verifier cites :280 for the check and :333 for its use)
- **Evidence:** the owner check treats pid-exists as killer-alive. `relaunch-core.cjs:612-622` uses the same pid-existence semantics. The verifier ran a lock naming pid 1, which gave `killer-lock-held ownerPid=1`.
- **Impact:** a SIGKILLed killer whose PID is reused by a long-lived process pins the lock. No new killer starts for that loop until that process exits.
- **Fix recommendation:** treat the lock as stale when its `createLock` timestamp is older than the killer's maximum lifetime, in both `acquireLock` and `liveKillerPid`.
- **Disposition:** CONFIRMED (run).
- **findingClass:** concurrency
- **scopeProof:** killer.cjs:280 and :333; relaunch-core.cjs:612-622.
- **affectedSurfaceHints:** killer supervision takeover; `liveKillerPid` consumers.
- **Lineage and iteration:** swe, iteration 1.

### R2-P2-002 - P2 - The handoff containment boundary follows REPO_ROOT, not the repository

- **Dimension:** security
- **File:** `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs:72` (the verifier cites :73)
- **Evidence:** `handoffPathWithinRepo` and `plannedNotePath` both resolve against `env.REPO_ROOT`. Other repo scripts also export a generic `REPO_ROOT` that the three readers honor (`session-relaunch.cjs:73`, `nudge.cjs:189`, `pi/session-relaunch.ts:179`).
- **Impact (verifier):** a shell exporting `REPO_ROOT` for another project redirects notes to that tree. The relocated write and the prepare and claim validation stay self-consistent, so the redirect is not caught.
- **Fix recommendation:** namespace the variable as `SESSION_RELAUNCH_REPO_ROOT` at the three readers and in the tests.
- **Disposition:** CONFIRMED (low).
- **findingClass:** trust-boundary
- **scopeProof:** session-relaunch.cjs:73, :75-82, :296, :397, :414; nudge.cjs:189.
- **affectedSurfaceHints:** prepare, claim, complete, and the printed manual command.
- **Lineage and iteration:** swe, iteration 2.

### NEW-001 - P2 - Repo-root fallback diverges between note-path planning and the containment check

- **Dimension:** UNKNOWN (no lineage reported it)
- **File:** `.skilled/hooks/session-relaunch/lib/nudge.cjs:189` and `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs:73`
- **Evidence:** `nudge.cjs:189` resolves `env.REPO_ROOT || cwd || process.cwd()`. `session-relaunch.cjs:73` falls back to the CLI install root (four levels above `__dirname`). Both lines were re-read in this synthesis.
- **Impact (verifier):** a runtime started in a repo subdirectory without `REPO_ROOT` gets a planned note path that `prepare` then refuses.
- **Fix recommendation:** resolve the repo root the same way in both places, through one shared helper.
- **Disposition:** CONFIRMED by reading (orchestrator spot-check; the behavior was not run). Found by the orchestrator's verification pass, not by a lineage.
- **findingClass:** UNKNOWN (no lineage recorded a class)
- **scopeProof:** nudge.cjs:189 against session-relaunch.cjs:73.
- **affectedSurfaceHints:** every adapter that plans a note path; the `prepare` refusal path.
- **Lineage and iteration:** UNKNOWN (orchestrator verification pass).

### R2-P2-003 - P2 - The live-shell guard fails open on any shell outside a three-name list

- **Dimension:** security
- **File:** `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs:190` (the verifier cites :195; the wider guard spans :138-148 and :200-228)
- **Evidence:** `refuseForShellChild` detects live shell children by comm basename in `[zsh, bash, sh]`.
- **Impact (verifier):** fish, dash, ksh, tcsh, nu or a renamed shell is invisible to the guard, so the killer can SIGTERM a session with running work.
- **Fix recommendation:** widen the list, strip a leading `-` from comm, and document that non-shell children are not detected.
- **Disposition:** CONFIRMED.
- **findingClass:** protection-bypass
- **scopeProof:** session-relaunch.cjs:195, :138-148, :200-228.
- **affectedSurfaceHints:** the prepare and should-relaunch refusal path on all runtimes.
- **Lineage and iteration:** swe, iteration 2.

### R3-P2-003 - P2 - Two ps process-table readers and three ancestor walks survive the helper consolidation

- **Dimension:** maintainability
- **File:** `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs:138`
- **Evidence:** the bin keeps its own `parseProcessTable` and `readProcessTable` (comm column, throws on error) beside `core.readProcessTable` (pid and ppid, null on error). Ancestor walking exists three times: `hasAncestor`, `cliAncestorsOf` with `runtimePidFromLoop`, and `findLoopChildPid`. `runtimePidFromLoop` duplicates `relaunch-core.cjs:668 findLoopChildPid`.
- **Impact:** a fix to one walk misses the others.
- **Fix recommendation:** `runtimePidFromLoop` calls `core.findLoopChildPid`. Reword phase 005 AC-002, which says the walk is defined once. Keep the killer's fail-closed walk.
- **Disposition:** CONFIRMED (maintainability).
- **findingClass:** cross-consumer-duplication
- **scopeProof:** session-relaunch.cjs:138-165 against relaunch-core.cjs:645-686; killer.cjs:124-135.
- **affectedSurfaceHints:** killer ancestry gate, running-work check, CLI target resolution.
- **Lineage and iteration:** swe, iteration 3.

### R3-P2-001 - P2 - Parent spec prose still describes four children while five exist and are complete

- **Dimension:** traceability
- **File:** `specs/hooks/023-session-relaunch-loop/spec.md:39` (also :51, scope :62-65, files :79-82, against the phase map at :94-98)
- **Evidence:** the metadata handoff criteria, the purpose paragraph and In Scope describe four child phases. The phase map and transition table correctly list five, including `005-deep-review-remediation`.
- **Impact:** the parent packet reports the wrong phase count, so parent closure reads a different child set from the phase map.
- **Fix recommendation:** say five. Add the 005 scope bullet and the 005 files row.
- **Disposition:** CONFIRMED.
- **findingClass:** documentation-drift
- **Folded duplicate:** LUNA-005 (luna, iteration 3, class `parent-child-contract-drift`, the same handoff criterion at spec.md:39 and :92-98). Both ids are kept in this entry.
- **scopeProof:** spec.md:39, :51, :62-65 against :94-98.
- **affectedSurfaceHints:** packet-level spec prose; generated metadata; parent closure.
- **Lineage and iteration:** swe, iteration 3; duplicate reported by luna, iteration 3.

---

## 4. REMEDIATION WORKSTREAMS

No P0 or P1 workstream applies. All twelve findings are P2 advisories, grouped by the files and the decision they share. The order follows the group list; section 6 gives the sequencing constraints.

1. **WS-1 State directory and log robustness:** LUNA-001, LUNA-002. Files: `lib/relaunch-core.cjs` (`appendLog`, `stateDir`, `ensureStateDir`) and its tests. Action: throw on an incomplete write; add a per-user fallback that checks ownership before chmod.
2. **WS-2 Killer lock and PID handling:** LUNA-003 (with R2-P2-001), R1-P2-001, R1-P2-002, R1-P2-004. Files: `lib/killer.cjs` (`targetIsRunning`, `recordTimeout`, `acquireLock`, `liveKillerPid`, the ancestry check) and `lib/relaunch-core.cjs`. Action: EPERM counts as not-running in the killer; re-read the record in `recordTimeout`; treat a lock older than the killer's maximum lifetime as stale; move the record read above the ancestry check for LUNA-003. **LUNA-003 is narrowed and its residual window documented, not closed,** because Node has no pidfd.
3. **WS-3 Handoff path and repo-root resolution:** R2-P2-002, NEW-001. Files: `bin/session-relaunch.cjs`, `lib/nudge.cjs`, `pi/session-relaunch.ts` and their tests. Action: one shared repo-root helper, with the variable renamed to `SESSION_RELAUNCH_REPO_ROOT` at all readers.
4. **WS-4 Live-shell guard:** R2-P2-003. Files: `bin/session-relaunch.cjs` (`refuseForShellChild`). Action: widen the shell list, strip a leading `-` from comm, and document the non-shell limit.
5. **WS-5 Process-walk consolidation:** R3-P2-003. Files: `bin/session-relaunch.cjs`, `lib/relaunch-core.cjs` (`findLoopChildPid`), and the phase 005 AC-002 wording. Action: route `runtimePidFromLoop` through `core.findLoopChildPid`; keep the killer's fail-closed walk.
6. **WS-6 Spec documentation drift:** R3-P2-001 (with LUNA-005), LUNA-004 (with R3-P2-002). Files: `specs/hooks/023-session-relaunch-loop/spec.md` and `005-deep-review-remediation/spec.md`. Action: say five children; repoint the three report references to the archived path.

---

## 5. SPEC SEED

- Parent `spec.md`: change the child count at :39 and :51 to five, add the phase 005 scope bullet at :62-65 and the files row at :79-82, and repoint the 004-to-005 verification cell at :114 to `review-archive/20261018T184826Z/review-report.md`.
- Phase 005 `spec.md`: repoint the report dependency at :40 and :43 to the archived report and registry.
- Phase 005 `acceptance-criteria.md` AC-002: reword the claim that the ancestor walk is defined once, once WS-5 lands.
- Record LUNA-003's residual PID-reuse window as an accepted, documented limit (no pidfd in Node), so the packet does not claim it closed.
- Specify a single repo-root resolution helper with `SESSION_RELAUNCH_REPO_ROOT` as the only override (WS-3).
- If the operator opts in to fixing the advisories, a follow-on phase takes the six workstreams with a test for each code fix.

---

## 6. PLAN SEED

- Order the lanes: WS-2 before WS-5, because both touch the killer's ancestry walk. WS-3, WS-4 and WS-5 all touch `bin/session-relaunch.cjs`, so run them serially.
- WS-1: add a forced short-write test and make `appendLog` throw on an incomplete write. Add a fallback test with `XDG_RUNTIME_DIR` unset and a pre-created state path.
- WS-2: add a test that a recycled PID does not pin a stale lock; add a test that `recordTimeout` skips unarm when the handoff changed; add an EPERM case for `targetIsRunning`. Document the LUNA-003 residual window in the killer's comments and in the spec.
- WS-3 and WS-4: add tests for the renamed override and for the widened shell list.
- WS-5: confirm `runtimePidFromLoop` calls `core.findLoopChildPid` and that no second `ps` reader remains.
- WS-6: documentation edits go through the sk-doc modes. Run them after the code lanes.
- Verification after the last lane: `node --test` on the killer, relaunch-core and session-relaunch-cli test files; the packet's `validate.sh --strict` with an explicit `RESULT: PASSED`.

---

## 7. TRACEABILITY STATUS

### Core protocols

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | partial | The code matches the spec except where the parent spec and the phase 005 spec drift (R3-P2-001 and LUNA-005 at `spec.md:39`; LUNA-004 at `spec.md:114` and `005 spec.md:40,43`). Code-side findings are in section 3. |
| `checklist_evidence` | partial | The 004-to-005 verification cell (`spec.md:114`) and the Phase 5 dependency (`005 spec.md:40,43`) point at `review/review-report.md`, which is absent. Both resolve to the archive. Unresolved drift: LUNA-004 and R3-P2-002. |

### Overlay protocols

| Protocol | Status | Evidence |
|----------|--------|----------|
| `feature_catalog_code` | pass | The swe lineage (section 2) reports the catalog leaf exists and matches the code. The luna lineage did not cover overlays. Not re-verified by the orchestrator. |
| `playbook_capability` | pass | The swe lineage (section 2) reports the three playbooks exist and match the code. Not re-verified by the orchestrator. |
| `skill_agent` | UNKNOWN | No per-protocol row exists in lineage state. The swe lineage reports the handoff command is present, which is not a complete check of this protocol. |
| `agent_cross_runtime` | UNKNOWN | No per-protocol row exists in lineage state. The swe lineage reports hook-registry rows in `.claude/settings.json` and `.codex/hooks.json`, which is not a complete check of this protocol. |

**AC_COVERAGE:** exempt. The parent target has no root `checklist.md` and no root `implementation-summary.md`, and the review strategy records it as exempt. Covered and total counts do not apply.

---

## 8. DEFERRED ITEMS

- **Blocked search-depth obligation:** `graph_backed_coverage` was blocked in luna iteration 1, because the lineage-only write boundary kept the packet-level graph seed out of scope. This is the one search-debt item. It is advisory and is the basis of the verdict conflict in section 10.
- **Behavioral confirmation for LUNA-002 and LUNA-003:** both stay static inferences. LUNA-002 needs an isolated shared-temp run with `XDG_RUNTIME_DIR` unset. LUNA-003 needs a controlled PID-reuse case, and even then only narrows the window.
- **NEW-001 behavioral check:** the orchestrator confirmed it by reading, not by running a subdirectory launch. A launch from a repo subdirectory without `REPO_ROOT` would confirm it.
- **Maintainability coverage:** the luna lineage did not cover maintainability; the swe lineage did. The merged coverage is complete, so nothing is deferred on this dimension.

---

## 9. DIMENSION EXPANSION MAP

- **Selected review directions:** luna ran correctness, then security, then traceability, one dimension per iteration. swe ran correctness, then security, then traceability with maintainability, one or two per iteration.
- **Saturated directions:** `divergence.saturatedDirections` is not present in lineage state. UNKNOWN. The luna dashboard records none.
- **Completed pivots:** 0 (luna dashboard, section 2A). swe records no pivot field; UNKNOWN.
- **Failed pivots:** 0 (luna dashboard). swe: UNKNOWN.
- **Audited overrides:** 0 (luna dashboard). swe: UNKNOWN.
- **Council artifact references:** none recorded in lineage state.
- **Remaining frontier:** none recorded (luna dashboard). The luna report names maintainability as uncovered by that lineage; swe covered it.
- This section records breadth only. It does not alter the verdict, `hasAdvisories`, the registry or the self-check results.

---

## 10. SEARCH LEDGER

**LOGIC-SYNC REQUIRED:** the merged verdict PASS (as dispatched) contradicts the Search Ledger rule. When `searchDebt` is non-empty, the rule carries the dashboard verdict as CONDITIONAL unless an active P0 makes it FAIL. The luna dashboard records one blocked search-debt obligation and a provisional verdict of CONDITIONAL ("Verdict is CONDITIONAL until they are covered or ruled out"). The swe dashboard records PASS. The operator must rule which verdict prevails. This report keeps PASS as dispatched and does not reconcile it silently.

- **hasSearchDebt:** true (luna dashboard, section 10).
- **Dashboard verdict:** CONDITIONAL (luna lineage, provisional). Swe: PASS. Merged: PASS as dispatched, pending the ruling above.

### searchCoverage (luna, latest row per iteration)

| Iteration | Covered | Ruled out | Blocked |
|-----------|---------|-----------|---------|
| 1 (correctness) | append_short_write_handling | append_concurrency, partial_tail_recovery, state_directory_permissions | graph_backed_coverage |
| 2 (security) | cross_user_state_directory_collision, pid_reuse_before_signal | handoff_path_escape, stale_lock_takeover_race, transcript_disappearance_signal | none |
| 3 (traceability) | remediation_report_dependency_path, phase_count_handoff_criteria | acceptance_evidence_links, archived_report_registry_alignment | none |

The luna state log holds duplicate iteration rows for iterations 2 and 3. The earlier rows lack `bugClass` and are superseded by the corrected rows the lineage appended. The table uses the corrected rows.

### candidateCoverage, searchDebt, ruledOutCandidates, cleanSearchProof

- **candidateCoverage (luna dashboard):** covered 6, ruled out 9, deferred 0, blocked 1.
- **searchDebt:** one item, `graph_backed_coverage` (iteration 1, blocked). The lineage-only write boundary prevented the graph seed.
- **ruledOutCandidates:** listed in section 11, Ruled-Out Claims.
- **cleanSearchProof:** no `cleanSearchProof` field exists in lineage state. The luna report (section 9) describes ruled-out evidence for the classes above; UNKNOWN as a structured field.
- **swe lineage:** no `searchCoverage`, `searchDebt` or `ruledOutCandidates` fields exist in its state, so its search-depth state is absent. *No search-depth state captured (legacy v1 record)* for the swe lineage.
- **Graph coverage mode:** `graphless_fallback` for both lineages.

---

## 11. AUDIT APPENDIX

### Convergence Summary

- **luna:** three of three iterations; stop reason `maxIterationsReached`; event `dimensionCoverage` 0.75; `releaseReadinessState` advisory. The `newFindingsRatio` on the latest row of each iteration is 1.00. The luna report records a final reducer score of 0.00 against a 0.10 threshold, which is telemetry only.
- **swe:** three of three iterations; stop reason `maxIterationsReached`; `dimensionCoverage` 1.0; `releaseReadinessState` converged. The `newFindingsRatio` is 1.0 on all three iterations.
- Convergence did not govern the stop. The max-iteration policy did.

### Coverage Summary

- Merged: four of four dimensions (correctness, security, traceability, maintainability).
- luna: three of four (maintainability uncovered). swe: four of four.
- Search debt: one blocked graph-seed class (luna). Search debt is non-empty, so the section 10 conflict stands.

### Ruled-Out Claims

- **R1-P2-003 (`plannedNotePath` interpolates an unvalidated session id): DISPROVED by the orchestrator's verification.** Every caller runs `validSessionId` first: `claude/context-nudge.mjs:69`, `codex/shared.mjs:73`, `hermes/context-nudge.mjs:59`, Pi at :162, OpenCode at :38 and :253. `SESSION_ID_PATTERN` at `nudge.cjs:25` excludes `/` and `.`. No reachable path exists. Not counted in the 12 active findings. The swe lineage still lists it as active in its own report, so that report's count of 10 is superseded by this disposition.
- **Lineage ruled-out classes (luna dashboard and report):**
  - `append_concurrency`: no race for complete writes (`relaunch-core.cjs:567-581`).
  - `partial_tail_recovery`: the next append is separated from an unterminated tail (`relaunch-core.cjs:571-585`).
  - `state_directory_permissions`: no incorrect mode in the create or reuse path, which is pinned 0700 (`relaunch-core.cjs:42-46`).
  - `handoff_path_escape`: no static escape on the checked entry path (`session-relaunch.cjs:71-135`).
  - `stale_lock_takeover_race`: no double takeover in the inspected scenario (`killer.cjs:285-388`).
  - `transcript_disappearance_signal`: the path returns before SIGTERM (`killer.cjs:157-176`).
  - `acceptance_evidence_links` and `archived_report_registry_alignment`: the content is consistent; the defect is the path (section 3, LUNA-004).
- Some luna dashboard ruled-out rows carry `UNKNOWN` as the class because they came from untyped iteration rows. Those rows are listed as evidence but not as typed classes.
- The phase 005 remediation of generation 1's twelve P2 is confirmed in the code by the swe lineage (section 2).

### Run Notes and Deviations

1. The luna state holds duplicate iteration rows for iterations 2 and 3. The corrected rows are used; the original rows are superseded.
2. Lineage registries disagree with the verifier on several line numbers (R1-P2-001, R1-P2-002, R1-P2-004, R2-P2-002, R2-P2-003, R3-P2-003). Both are cited.
3. Several luna entries carry empty `findingClass`, `scopeProof` and `affectedSurfaceHints` fields in the registry. Those values come from the luna lineage report section 3. Where no source exists, the field is `UNKNOWN`.
4. Generation 1: the dispatch describes a 10-iteration run. Its archived report records a 10-iteration cap, 7 iterations run, and stop reason `converged`. This report uses the archived record.
5. The swe lineage recorded one projection refusal (a config-key mismatch on a hand-seeded row) in `gateway-refusals.jsonl`. Its state order was aligned to the ledger. This is not a finding.
6. The luna lineage's generic packet review-root migration and continuity save were skipped under its write boundary. Synthesis events were staged in the lineage's `events/` directory.

### Sources Reviewed

- Merged registry `review/deep-review-findings-registry.json`, `review/fanout-attribution.md`, `review/orchestration-summary.json`, `review/orchestration-status.log`.
- Orchestrator verification table (`scratchpad/rv2/verification.md`), authoritative for disposition.
- Lineage reports `review/lineages/luna/review-report.md` and `review/lineages/swe/review-report.md`.
- Lineage iterations `review/lineages/{luna,swe}/iterations/iteration-001.md` to `iteration-003.md`, deltas `review/lineages/{luna,swe}/deltas/iter-001.jsonl` to `iter-003.jsonl`, state logs `review/lineages/{luna,swe}/deep-review-state.jsonl`, and dashboards `review/lineages/{luna,swe}/deep-review-dashboard.md`.
- Generation-1 archive `review-archive/20261018T184826Z/review-report.md`.
- Spec and code reads for the re-checked lines: `spec.md:39, 51, 62-65, 79-82, 94-98, 114`; `005-deep-review-remediation/spec.md:40, 43`; `lib/nudge.cjs:186-196`; `bin/session-relaunch.cjs:70-76`.

### Cross-Reference Appendix

#### Core Protocols

- `spec_code`: `spec.md:39, 51, 62-65, 114` against the code findings in section 3. Status partial.
- `checklist_evidence`: `spec.md:114` and `005-deep-review-remediation/spec.md:40, 43`. Status partial.
- Shared append producer: `lib/relaunch-core.cjs:555-585` (LUNA-001).
- State directory path and mode: `lib/relaunch-core.cjs:42-46, 143-145` (LUNA-002).
- Killer signal path: `lib/killer.cjs:449-469` (LUNA-003).

#### Overlay Protocols

- `feature_catalog_code`: pass (swe lineage).
- `playbook_capability`: pass (swe lineage).
- `skill_agent`: UNKNOWN.
- `agent_cross_runtime`: UNKNOWN.
- Parent phase handoff: `spec.md:39, 92-115`.
- Phase 5 dependency and requirements: `005-deep-review-remediation/spec.md:40-43, 117-129`.
- Archived review artifacts: `review-archive/20261018T184826Z/`.

Review verdict: PASS (as dispatched; LOGIC-SYNC REQUIRED, see section 10).
