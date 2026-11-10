# Review Iteration 2 — Security

- Review target: the three build commits `4b9bf840b0..HEAD` (HEAD `f9eb84c4fe`) on `worktrees/127-surface-messages`.
- Dimension: security (iteration 2 of 5).
- Prior state: P0=0 P1=0 P2=2 (both correctness, iteration 1).

## Dimension

Security lens over the changed surfaces: the new `authoredDrift` derivation and the remediation text the guard prints, the `requireAuthoredRoot` guard on the sync CLI, the hardcoded copy-back in the doctor repair string, and the new T2–T4 tests. The security question this surface raises is not auth or secrets — it is whether a gate that now prints instructions an operator (or agent) will act on can be steered into a destructive write, and whether the missing-authored failure can fail open.

## Files Reviewed

- `.skilled/bin/compiled-route-guard.cjs:63-83` — `authoredDrift` derivation, missing/drift returns, fix templates [SOURCE: .skilled/bin/compiled-route-guard.cjs:70]
- `.skilled/bin/compiled-route-guard.cjs:124` — `inspect` ordering (freshness before drift) and the spread of the drift record
- `.skilled/bin/compiled-route-guard.cjs:174-183` — `main` per-hub fix printing for drift and missing [SOURCE: .skilled/bin/compiled-route-guard.cjs:179]
- `.skilled/bin/compiled-route-sync.cjs:1061-1066` — `requireAuthoredRoot` [SOURCE: .skilled/bin/compiled-route-sync.cjs:1061]
- `.skilled/bin/compiled-route-sync.cjs:760-776` — `build` trace-before-write ordering; `.skilled/bin/compiled-route-sync.cjs:1110` — build-path guard call; `.skilled/bin/compiled-route-sync.cjs:1114` — top-level catch
- `.skilled/bin/lib/compiled-route-layout.cjs:53-55` — `AUTHORED_PROGRAM_DIR`, the claimed single naming point [SOURCE: .skilled/bin/lib/compiled-route-layout.cjs:53]
- `.skilled/bin/tests/compiled-route-manifest.test.cjs:558` (T2, CLI `--check` no-authored), `:586` (T3, drift fix contents), `:604` (T4, authored-missing)
- `.skilled/commands/doctor/assets/doctor-update-apply.yaml:160` — the new copy-back repair string [SOURCE: .skilled/commands/doctor/assets/doctor-update-apply.yaml:160]
- `.skilled/commands/doctor/scripts/parent-skill-check.cjs:496`; `.skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs:656`

## Findings by Severity

### P0 — none

### P1 — none

### P2

#### R2-P2-001 [P2] Doctor `compiled_routes` repair hardcodes the authored destination path, duplicating `layout.AUTHORED_PROGRAM_DIR`

- Case: the authored router-program packet moves (`AUTHORED_PROGRAM_DIR` or the activation segment of `CURRENT_LAYOUT` is renamed). The guard still checks and prints the *derived* authored path, but the YAML repair keeps instructing the operator/agent to copy the runtime manifest over the old literal path under `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/013-live-activation/...`. The authored twin the guard reported stays missing (guard stays red), while the approved copy lands at a stale location that may hold an unrelated archived file.
- File: `.skilled/commands/doctor/assets/doctor-update-apply.yaml:160`
- Evidence: the repair string restates both endpoints as literals. The destination literal equals `AUTHORED_PROGRAM_DIR` + `013-live-activation/activation/<hub>/manifest.json` today; `layout.cjs` owns that name and its comment states it is "named once here so the pre-commit hook, the guard and the sync tool all move together when that packet moves" [SOURCE: .skilled/bin/lib/compiled-route-layout.cjs:53]. The guard's own fix line already prints the correct derived path at runtime [SOURCE: .skilled/bin/compiled-route-guard.cjs:81], and the YAML repair is a fourth, unlinked encoding that moves with nothing.
- EvidenceRefs: `.skilled/commands/doctor/assets/doctor-update-apply.yaml:160`, `.skilled/bin/compiled-route-guard.cjs:70`, `.skilled/bin/compiled-route-guard.cjs:81`, `.skilled/bin/lib/compiled-route-layout.cjs:53`
- Counterevidence sought: verified the literal destination exists today (`ls specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/sk-code/` shows `manifest.json`); searched `.skilled` for a renderer or test that links the YAML literal to `AUTHORED_PROGRAM_DIR` — none found; no code generator rewrites this asset.
- Alternative explanation: YAML cannot `require()` the layout module, so a self-contained literal may be the only way to make the step actionable; the operator sees the guard's correct path one step earlier and may never read the YAML path literally.
- Final severity: P2. Confidence: medium (latent; correct today, high-confidence drift consequence).
- Downgrade trigger: a generator or test that renders the YAML repair from `layout.AUTHORED_PROGRAM_DIR`, or removal of the literal path from the repair string, withdraws this finding.
- User impact: on a layout move, an operator or agent following the approved repair writes the runtime manifest into the wrong directory (or fails), the guard remains red, and an archived file can be clobbered. No impact today.
- Finding class: class-of-bug (duplicated single-source-of-truth path in an executable instruction).
- Scope proof: `grep -rln "019-skill-routing-refactor" .skilled --include=*.cjs --include=*.yaml --include=*.json` shows `compiled-route-layout.cjs` as the derived owner plus this new YAML restatement; no build step reconciles them.
- Recommendation: do not restate destination endpoints in the YAML repair; reference the path the guard printed in the same run (its authored-missing/authored-drift `fix` line). If the literal stays, add a test that fails when it diverges from `AUTHORED_PROGRAM_DIR`.

## Ruled-Out Security Directions

- Command injection: the guard's fix strings are template literals over static `HUBS` ids and layout constants, written with `process.stdout.write` only [SOURCE: .skilled/bin/compiled-route-guard.cjs:81]; no exec/eval/shell sink consumes them.
- Path traversal in `authoredDrift`: production call sites pass only frozen hub ids and derive the manifest beneath the root they also pass; the `runtimeRoot`/`authoredRoot` parameters are a test seam, and no untrusted component reaches them [SOURCE: .skilled/bin/compiled-route-guard.cjs:70].
- Symlink bypass: `existsSync`/`readFileSync` follow symlinks, but the rebuild trace and copy also follow them, so a symlinked twin would still be reinstated byte-identically by a rebuild; the gate is anti-accident, not anti-tamper, and a writer who can plant the symlink can edit both copies.
- TOCTOU: an `existsSync` → `readFileSync` race throws; the outcome is a non-zero exit in the guard or the `SYNC FAILED` catch line in sync [SOURCE: .skilled/bin/compiled-route-sync.cjs:1114] — fail-closed, no verdict flip.
- Fail-open: `inspect` returns on `!manifestValid` and `!fresh` before drift, and authored-missing now returns an explicit failure instead of the old `null` [SOURCE: .skilled/bin/compiled-route-guard.cjs:124] [SOURCE: .skilled/bin/compiled-route-guard.cjs:75]; the missing-manifest case is a strict improvement (previous behavior was a false green).
- Exemption abuse: only `inputs-do-not-compile` is excusable and the expiry must parse in the future; authored-drift and authored-missing never match `EXCUSABLE`.
- Deferred: authored twin that is a directory/unreadable, or removed mid-check, can throw out of `authoredDrift` into `main` (no try/catch there) and break `--warn-only`'s exit-0 contract — fail-closed, so not a security bypass; robustness belongs to the maintainability dimension.

## Traceability Checks

- Core `spec_code`: pass. The packet maps to R3/R7 (spec.md:3); the security-relevant named-failure behavior is present at [SOURCE: .skilled/bin/compiled-route-sync.cjs:1061] and [SOURCE: .skilled/bin/compiled-route-guard.cjs:75]. The finding is a latent single-source-of-truth breach against `layout.cjs`, not a current spec mismatch.
- Core `checklist_evidence`: pass (carried from iteration 1, re-verified for this finding's destination by direct path listing — the YAML literal destination exists today). `tasks.md` checklist not re-read this iteration.
- Overlay: pending (not exercised by the security dimension).

## SCOPE VIOLATIONS

None. No file outside the four allowed state paths was created or modified; all reads were read-only.

## Verdict

One new P2, no P0 or P1 this iteration. The authored-missing failure now fails closed (previously a false green), and no security bypass was found in the changed control flow.

## Next Dimension

traceability.

Review verdict: PASS
