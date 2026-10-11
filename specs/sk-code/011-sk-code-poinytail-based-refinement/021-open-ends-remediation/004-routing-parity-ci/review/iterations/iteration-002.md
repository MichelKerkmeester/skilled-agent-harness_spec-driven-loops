# Deep Review - Iteration 002

- **Session**: rvw-021-004-routing-parity-20261011T193333Z (generation 1, lineage new)
- **Iteration**: 2 of 5 | **Dimension**: security
- **Target**: commit f34b01bf0a on worktrees/115-rem-routing-parity-ci
- **Method note**: read-only dispatch. No vitest gate, CI job, or repository script was executed; claims are source reading, `git show`/`blame`, `rg`, and filesystem probes (`readlink`, `find`). Anything that needs a run to confirm is labeled as such.

## Dimension

Security review of the commit's blocking gates and the machinery they depend on:

1. CI surface of the two new `golden-prompt-gate` steps and the workflow's token, trigger and injection posture.
2. Subprocess, temp-graph and environment handling in the divergence ratchet that CI now blocks on.
3. Traversal boundary of the widened independence scan over the runtime tree.
4. Dynamic evaluation on the ledger-capture path that produces the ratchet's approved-divergence fixture.

Baseline families applied (review-core §6): injection exposure, secrets handling, privilege misuse, and reliability risks with security impact.

## Files Reviewed

| File | Where inspected | Result |
|------|-----------------|--------|
| `.github/workflows/routing-registry-drift.yml` | triggers 19-113; `permissions` 118-119; new steps 271-297; whole file for injection markers | no finding; static `run:` text, read-only token |
| `.../tests/parity/local-native-divergence-ratchet.vitest.ts` | full file (427 lines) | spawnSync argv-only; temp DB dir; env handling sound |
| `.../tests/parity/holdout-independent.vitest.ts` | full file (368 lines) | finding 2 (symlink traversal) |
| `.../tests/parity/fixtures/local-native-approved-divergences.json` | schema, `approvedAt` values, entry classes | data-only; no injection path |
| `.../lib/scorer/projection.ts` | 70-73 (module-load env capture) | operator-set env; no boundary crossed |
| `.../lib/skill-graph/skill-graph-db.ts` | SQL sites 208-235, 334-364, 497, 593-596 | parameterized; no interpolation |
| `.../lib/lifecycle/age-haircut.ts` | full file (52 lines) | pure arithmetic; no security surface |
| `.../scripts/skill_advisor.py` | subprocess sites 617, 714, 1382 + imports | argv-only, no shell |
| `.../scripts/routing-accuracy/holdout-prompts.jsonl` | header and row schema | data-only |
| `.../scripts/routing-accuracy/build-holdout.mjs` | full file | writes only its own fixture path |
| `.../scripts/routing-accuracy/capture-local-native-divergence-ledger.mjs` | full file (220 lines) | finding 1 (`Function` eval; pre-existing per blame 38e2577a55a) |
| `specs/.../004-routing-parity-ci/spec.md` | full file (158 lines) | scope matches the commit; R1/R5 semantics present |

Static verification performed: `git show --stat f34b01bf0a` (3 files, +356/-21); `git blame` of the eval site; `rg` over the scope for `pull_request_target|workflow_run|continue-on-error|secrets\.|github.event|github.head_ref` and `new Function|eval\(|subprocess|shell=True|os.system|pickle`; `readlink -f` and `find -type l` on the scan root and its symlink target.

## Findings

### P0

None.

### P1

None.

### P2

#### R2-P2-001 [P2] Dynamic code evaluation evaluates more than the data literal it slices

- **Case**: a maintainer or future fixture edit adds a `]` anywhere after the corpus array in `harder-intent-prompt-corpus.ts` (a comment, a second literal). `arrayEnd = source.lastIndexOf(']')` then reaches past the array close, and `Function(...)()` executes everything between the first `[` after the marker and that last `]` in the capture process. Even without a second `]`, the site executes the fixture's array as code instead of parsing it as data.
- **File**: `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-local-native-divergence-ledger.mjs:93`
- **Evidence**: [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-local-native-divergence-ledger.mjs:84-94] — the slice is bounded by `indexOf('[')` after the `HARDER_INTENT_PROMPT_CORPUS` occurrence and `lastIndexOf(']')`, then passed to `Function`. The comment states the "data-only array" assumption; nothing enforces it. `build-holdout.mjs` reads the same fixture through a different path, so the two readers disagree on how faithful the load must be. `git blame` shows the site predates this commit (38e2577a55a, 2026-08-15); the commit's new CI gate makes the capture script's output load-bearing.
- **User impact**: the capture runs in a maintainer shell with the full user environment; a fixture shape change silently executes text instead of failing the capture, so the "recording of live behavior" claim rests on an unenforced data-only convention.
- **Finding class**: instance-only
- **Scope proof**: `rg -n "new Function|Function\(|eval\(" .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/` returns this one site; no other dynamic-eval site exists in the scope.
- **Affected surface hints**: ["capture-local-native-divergence-ledger.mjs", "harder-intent-prompt-corpus fixture", "divergence ledger capture"]
- **riskScore**: 2 (advisory only)
- **Confidence**: medium-high (code path read; capture not executed in this dispatch). **Downgrade trigger**: a checked-in assertion or lint rule that keeps the fixture data-only and slice-bounded collapses this to a documentation note; confirmed arbitrary-code execution from a fixture edit would raise it.
- **Recommendation**: move the corpus to a `.json`/`.jsonl` data file both readers parse, or anchor the slice at the array's closing `];` and parse it as data. If the eval stays, assert there is exactly one `]` after the marker and document that the load executes code.

#### R2-P2-002 [P2] The widened runtime scan follows a symlinked directory outside its declared root

- **Case**: `listRuntimeSourceFiles` decides recursion with `statSync(path).isDirectory()`, which follows symlinks. `runtime/lib/shared/embeddings` is a symlink to `.skilled/skills/system-spec-kit/shared/embeddings`, so the new "every runtime file that reads a scored corpus" scan reads a foreign skill's tree while reporting paths as if they lived under `runtime/`. Any symlink placed under `runtime/` is traversed the same way; a cyclic or oversized target recurses without a depth guard, and a corpus reference inside the target would be reported with a `lib/shared/embeddings/...` path that does not exist under `runtime/`.
- **File**: `.skilled/skills/system-skill-advisor/runtime/tests/parity/holdout-independent.vitest.ts:233`
- **Evidence**: [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/parity/holdout-independent.vitest.ts:228-237] (`statSync(path).isDirectory()` recursion) and [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/parity/holdout-independent.vitest.ts:346-353] (scan loop). `readlink -f` resolves `.../runtime/lib/shared/embeddings` to `.../.skilled/skills/system-spec-kit/shared/embeddings`, which exists and holds 10+ `.ts` files the scan now reads; `find -type l` inside the target returns none, so the gate is green today and the effect is latent. No data leaves the runner on failure — the message prints matching relative paths, not file contents — so this is a gate-boundary and robustness defect, not an exploitable leak.
- **User impact**: the independence gate's input boundary is implicit rather than declared, so a future symlink or target-tree change produces confusing failures, and a loop turns the gate into a hung job instead of a clean verdict.
- **Finding class**: instance-only
- **Scope proof**: `readlink -f` shows the one symlinked directory reachable from the scan root; every other symlink under `runtime` is inside `node_modules`, which the scan skips by basename.
- **Affected surface hints**: ["holdout-independent.vitest.ts", "runtime tree scan", "lib/shared/embeddings symlink"]
- **riskScore**: 2 (advisory only)
- **Confidence**: high for the traversal fact; low for practical exploitability (worst case is this PR's own CI job). **Downgrade trigger**: a skip-symlink directive or realpath containment assertion in the scan would close it; a demonstrated gate bypass (a corpus reader hidden behind a symlink or a `node_modules` basename) would raise it.
- **Recommendation**: use `readdirSync(dir, { withFileTypes: true })` and recurse only on `dirent.isDirectory()` (symlinks report false), or skip `lstatSync(path).isSymbolicLink()` entries, and assert the walked realpath stays under `RUNTIME_ROOT`.

## Traceability Checks

| Protocol | Status | Notes |
|----------|--------|-------|
| spec_code (core) | partial | `git show --stat f34b01bf0a` = exactly the three `Files to Change` at [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/004-routing-parity-ci/spec.md:80-82]; R1's blocking-step intent and R5's widened-independence intent are present in the workflow steps and tests [SOURCE: .github/workflows/routing-registry-drift.yml:278-297]. Security behavior matches the spec's scope boundary ("No scorer, floor or ledger entry changes"). |
| checklist_evidence (core) | deferred | SC-002's execution proof (clock moved forward; injected overlap fails) is recorded in the commit message; re-execution needs the suites to run, which this read-only dispatch does not do. Left to the packet's completion validation, same posture as iteration 1. |
| skill_agent / agent_cross_runtime / feature_catalog_code / playbook_capability (overlay) | not exercised | The security-relevant behavior lives in the skill's runtime tests and CI, none of which the four overlays claim. The traceability iteration owns the overlay pass. |

## Ruled-Out Directions (security)

- Workflow script or event-context injection — `rg` over the workflow finds no `${{ github.event.* }}`, `github.head_ref`, `pull_request_target`, or `workflow_run`; every `run:` block is static text. Evidence: [SOURCE: .github/workflows/routing-registry-drift.yml:118-119].
- Token or secret exposure — top-level `permissions: contents: read`, no job-level override, no `secrets.*`, no `continue-on-error`; third-party actions are SHA-pinned. Evidence: [SOURCE: .github/workflows/routing-registry-drift.yml:118].
- Command injection in scorer subprocesses — every `subprocess.run` call passes an argv array without `shell=True`, and prompt text travels via stdin JSON. Evidence: [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:617], [:714], [:1382].
- SQL injection in the skill graph — statements use `prepare()` with `?` placeholders; `exec()` calls are static DDL. Evidence: [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:497].
- Environment-variable path trust — `SYSTEM_SKILL_ADVISOR_DB_DIR` is operator-set and the ratchet passes a `mkdtemp` path; no privilege boundary is crossed. Evidence: [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts:70-73].

## Verdict

PASS (`hasAdvisories=true`) — no P0 or P1 this iteration; two P2 advisories (R2-P2-001, R2-P2-002). Both touch supporting machinery rather than the new gates' trust boundary: neither crosses a privilege boundary, and neither changes the blocking verdict of the commit's gates. The three correctness P2s from iteration 1 remain open. Security dimension: covered.

## Next Dimension

traceability (remaining: traceability, maintainability).

Review verdict: PASS
