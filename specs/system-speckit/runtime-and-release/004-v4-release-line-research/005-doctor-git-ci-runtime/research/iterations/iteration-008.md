# Iteration 8 — Doctor overlay, GitHub workflows, runtime mirrors

**Focus:** read code, not notes. (a) overlay engine status/exit-code contract, (b) `.github/workflows` job → script wiring, (c) runtime mirror sync `--check`.

**Executor:** native research leaf. 19 tool calls, all read-only or dry/check/plan mode.

---

## Focus

Three code surfaces the release notes describe but the registry had not verified from source:

1. `/doctor:overlay` `status` — engine exit code vs the presentation contract's rendering rule, and the default route's behaviour in a tree with no overlay folder.
2. `.github/workflows` — which script each job actually runs, and whether the suite a job names is the whole suite.
3. Runtime mirrors — run the sync checkers the doctor route names and read their exit and drift lines.

Plus the two carried-forward questions attached to those surfaces: the `hook_adapter_fallback_health_checks` battery resolution (open since iteration 2) and the wedged-git timeout test (open since iterations 2–6).

---

## Actions Taken

| # | Action | Verdict |
|---|--------|---------|
| 1 | `node .skilled/commands/doctor/scripts/overlay-engine.cjs status --root /tmp/overlay-probe --json` | exit 2, JSON `{"result":"ERROR", "error":"no overlay manifest at ..."}` |
| 2 | Read `.skilled/commands/doctor/assets/doctor-overlay-status.yaml` (step 6 exit map, output block) and `.skilled/commands/doctor/assets/doctor-overlay-presentation.txt` lines 101, 376, 379, 398 | two contract lines disagree for `--json` + exit 2 |
| 3 | `node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs --check` | `PASS: 247 mirrors across 10 trees are in sync`, exit 0 |
| 4 | Enumerated every `path:` under `hook_adapter_fallback_health_checks` in `doctor-runtime-mirrors.yaml` and tested each with `[ -e ]` | **66 of 66 resolve**, no MISSING line |
| 5 | Read `.github/workflows/comment-hygiene.yml` end to end; checked its two candidate checkers and `hygiene-config-flags.cjs` are present and `-x` | checker 10254 B `-rwxr-xr-x`, helper 7090 B `-rwxr-xr-x` — job's fail-closed lookup resolves |
| 6 | Grepped every workflow's `if:` for `SKILLED_CI*`, then `ci-toggle.cjs --variable=SKILLED_CI_REPORTS --state=off --json --no-gh` | `covers` = `strict-pass-freshness-report.yml`, `trigger-index-rebuild.yml` — matches the toggle YAML |
| 7 | Read `.github/workflows/sk-git-script-tests.yml` (line 51) and `ls .skilled/skills/sk-git/scripts/tests/` | **1 of 5 suites wired** |
| 8 | Read the sk-git tests README and `sk-code-script-tests.yml` for the contrast | sk-code enumerates 5 distinct suites; sk-git names one |
| 9 | `git log -S` / `git tag --contains` on the workflow step and on the unwired `.mjs` | step → `ca571debab` → v4.0.0.13; `.mjs` → `c15f0842dc` → v4.0.0.16 |
| 10 | Read `.skilled/commands/doctor/_routes.yaml:622–671` for the overlay route manifest | `status` is `default_target: true`, `read-only`; flags match `overlay.md` |

---

## Findings

### F8-1 — `.github/workflows/sk-git-script-tests.yml` runs 1 of 5 sk-git suites

- **type:** improvement (CI coverage gap); adjacent **drift** in the tests README
- **severity:** P1
- **release:** step introduced in v4.0.0.13 (`ca571debab`); the unwired node suite arrived in v4.0.0.16 (`c15f0842dc`)
- **confidence:** high — directory listing and single `run:` line both read directly

The job has exactly one suite step: `run: bash .skilled/skills/sk-git/scripts/tests/worktree-naming.test.sh` [SOURCE: .github/workflows/sk-git-script-tests.yml:51]. The same directory holds `commit-id-naming.test.sh`, `migrate-legacy-branch-names.test.sh`, `stamp-branch.test.sh` and `validate-message-git-timeout.test.mjs`. A repo-wide grep for those four names across `.github/` finds them only inside `broken-move-drill.sh` as *break targets*, never as suites a workflow executes. `sk-git/scripts/hooks/git-preflight-advisory.test.mjs` is doubly invisible: it lives in `hooks/`, not `tests/`, so even a `tests/*.test.mjs` wildcard would miss it.

The contrast is explicit one workflow over: `sk-code-script-tests.yml` enumerates five distinct commands, including a `node --test .../*.test.cjs` wildcard [SOURCE: .github/workflows/sk-code-script-tests.yml:85]. So this is not a repository convention that suites are wired one at a time — it is a single workflow that was never widened.

What this costs: the two behaviours the research brief asks about by name — commit-id rules (v4.0.0.3 / v4.0.0.10) and the bounded-git timeout (v4.0.0.16) — are the two behaviours whose regression tests CI does not run. The `.mjs` suite is literally `validate-message-git-timeout.test.mjs`, written in the same commit as the fix, and no workflow invokes it.

Stale README compounds it: `tests/README.md` still says "`tests/` holds the harness for `worktree-naming.sh`" and describes only that allocator [SOURCE: .skilled/skills/sk-git/scripts/tests/README.md:16], which is accurate for CI and wrong for the directory — five files, one described. Either sentence is a plausible truth depending on which way this is fixed.

**Verify:**

```bash
grep -c 'run: bash\|run: node' .github/workflows/sk-git-script-tests.yml   # 1
ls .skilled/skills/sk-git/scripts/tests/*.test.* | wc -l                  # 5
grep -rn 'validate-message-git-timeout\|commit-id-naming.test' .github/    # only broken-move-drill.sh
```

### F8-2 — `--json` and exit 2 are two contract lines with no shared answer

- **type:** drift (presentation contract vs workflow step), **ux** for the AI user
- **severity:** P2
- **release:** v4.0.2.0 (both overlay docs land with the engine, `git tag --contains f965c658d4` → v4.0.2.0)
- **confidence:** confirmed by a run, not inference — the engine produced the exact state the two lines disagree about

`doctor-overlay-status.yaml` step 6 requires the exit code to be mapped to a route status: "exit 2 is a precondition that failed, such as a missing overlay manifest" [SOURCE: .skilled/commands/doctor/assets/doctor-overlay-status.yaml:58]. The presentation contract's error template for an engine failure is `STATUS=FAIL ERROR="[code]"` [SOURCE: .skilled/commands/doctor/assets/doctor-overlay-presentation.txt:379].

But the same contract's `--json` rule says: "With `--json`, print the engine's JSON and nothing around it" [SOURCE: .skilled/commands/doctor/assets/doctor-overlay-presentation.txt:101]. With `--json` **and** exit 2 both apply, and they are mutually exclusive: the route must print a failure status line or print nothing but JSON. A scripted consumer piping `--json` gets `{"result":"ERROR","error":"no overlay manifest at ..."}` on stdout with exit 2 and no `STATUS=` token, while the same consumer of an exit-0/1 run gets whatever the JSON carries. The route's contract never says which wins.

Reproduced:

```bash
mkdir -p /tmp/overlay-probe
node .skilled/commands/doctor/scripts/overlay-engine.cjs status --root /tmp/overlay-probe --json
# {"result": "ERROR", "error": "no overlay manifest at skilled-overlays/overlay-manifest.json: ..."}
# EXIT=2
```

The engine's message is thrown from two separate sites with different suffixes [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:433] and [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:437] — the un-suffixed variant at 437 gives a consumer no hint about `.skilled-overlays.json`, while the presentation contract's remedy row assumes the suffixed one [SOURCE: .skilled/commands/doctor/assets/doctor-overlay-presentation.txt:398]. So the "name the fix" promise holds only on one of the two throw paths.

### F8-3 — the overlay diagnostic cannot self-check the source repo

- **type:** ux (operator), **drift** (documented default route is a guaranteed error in the tree that ships the command)
- **severity:** P2
- **release:** v4.0.2.0
- **confidence:** confirmed — `/tmp` run plus a directory listing of the repo root

`status` is the route's `default_target` and declared read-only [SOURCE: .skilled/commands/doctor/_routes.yaml:622-628], so a bare `/doctor:overlay` in the Skilled source checkout always resolves to an engine exit 2, because that checkout has neither `skilled-overlays/` nor `.skilled-overlays.json`. The presentation contract documents this as an *error* with a remedy ("add `.skilled-overlays.json` at the tree root") [SOURCE: .skilled/commands/doctor/assets/doctor-overlay-presentation.txt:398] — advice that is correct for a vendored tree and wrong for the source repo, whose overlay folder does not and should not exist. A new operator's first `/doctor:overlay` is therefore an error with an inapplicable fix. The `<overlay folder>` placeholder is also named twice for two different things in the same contract (the folder the engine reads, and the folder that *holds* `overlay-manifest.json`) [SOURCE: .skilled/commands/doctor/assets/doctor-overlay-presentation.txt:149].

### F8-4 — the no-op refusal silently degrades when `gh` is unavailable

- **type:** ux (operator), **improvement** (the safety property is stated as unconditional)
- **severity:** P2
- **release:** v4.0.0.x CI doctor line (route is in the current tree; `ci-toggle.cjs` header states the rule)
- **confidence:** confirmed by a run with `--no-gh`

The planner's own contract says "A change to the state the variable already has is refused as a no-op" [SOURCE: .skilled/commands/doctor/scripts/ci-toggle.cjs:17-18] — an unconditional sentence. Running the plan with `--no-gh` returns `"current": "unknown"` and `"noChange": false`, so the no-op check cannot fire, yet the plan still emits `"command": "gh variable set SKILLED_CI_REPORTS --body off"` and proceeds to the second-confirmation stage. The ruleset check degrades honestly (it prints `"reason": "gh disabled by --no-gh"`), but the no-op refusal degrades silently — it just reports "no change needed: false", which reads as *confirmed change needed*. An operator reading the plan cannot tell "the variable is currently on" from "I did not look".

Verify:

```bash
node .skilled/commands/doctor/scripts/ci-toggle.cjs --variable=SKILLED_CI_REPORTS --state=off --json --no-gh | grep -E '"current"|"noChange"|"reason"'
```

---

## Invariants established (no finding)

| id | Invariant | Evidence |
|----|-----------|----------|
| inv-008-001 | Every path in `doctor-runtime-mirrors.yaml`'s `hook_adapter_fallback_health_checks` battery exists in this tree. | 66 `path:` rows extracted and tested with `[ -e ]`; zero MISSING lines |
| inv-008-002 | The runtime mirror trees are in sync at v4.0.2.0. | `sync-runtime-mirrors.cjs --check` → `PASS: 247 mirrors across 10 trees are in sync`, exit 0 |
| inv-008-003 | The CI switch allowlist the planner derives from the profile is exactly what the docs name (`SKILLED_CI`, `_TESTS`, `_REPORTS`, `_REVIEW`, `_FRESHNESS`, `_MESSAGES`), and `_REPORTS` covers the two workflows the toggle YAML claims. | plan JSON `allowlist` + `covers`; [SOURCE: .skilled/commands/doctor/assets/doctor-ci-toggle.yaml:27] |
| inv-008-004 | `comment-hygiene.yml`'s fail-closed checker lookup resolves on both candidate paths, and its optional `hygiene-config-flags.cjs` helper is present and executable. | `ls -la` on both paths; [SOURCE: .github/workflows/comment-hygiene.yml:36] |

---

## Questions Answered

- **"Does the `hook_adapter_fallback_health_checks` battery in `doctor-runtime-mirrors.yaml` resolve every listed path?"** — Yes, all 66. The open half (does the full workflow *report* a degraded adapter when one is missing) is still unanswered; this iteration resolved paths, not the workflow's aggregation branch.
- **Q9 (partially): which CI wiring has no caller or duplicates another?** — answered for sk-git: four authored suites and one hook test have no CI caller (F8-1). Not yet answered for doctor's own `scripts/tests`.
- **Q5 (partially): do `.github/workflows` match the CI note, and does any call a missing script?** — the two workflows read here (`comment-hygiene.yml`, `sk-git-script-tests.yml`) call scripts that exist and accept the flags given; `comment-hygiene.yml` passes `--json` and `-- <file>` to a checker confirmed executable. No missing-script case found in this sample.

## Questions Remaining

- Does the runtime-mirrors workflow report a degraded adapter when one battery path is missing? (aggregation branch, not path resolution)
- Do the sk-git hook suites pass at HEAD, and would wiring them into CI fail today? Running them writes throwaway repos, which is outside this iteration's read-only bound.
- Does the message gate accept a push whose `Commit-Id` trailer carries both `0000000` and a valid id?
- Does `AGENTS.md` match `REPO RULES.md`, and does Devin's 16,384-byte rule cut truncate a binding rule?
- The remaining v4.0.0.15/v4.0.0.16 worktree behaviours (`local-*` links, fsmonitor reaper, merged-worktree sweep, `SPECKIT_WORKTREE_AUTOREAP=0`, `SPECKIT_WORKTREE_BASE`).
- **Q11** — the canon comparison (sk-code / sk-doc / hub routing) is still open; this iteration only reached the CI-wiring and test-harness contrast, not command or skill *format*.

## Next Focus

Read the doctor's own test surface and the `.github/scripts/tests` harness, which is where the sk-git suites should have been wired: does `doctor` have a workflow that runs `scripts/tests`, and does `broken-move-drill.sh` cover the mirror and overlay paths? Then close Q11 from the command and skill format side by diffing two doctor router frontmatters against the sk-doc command standard.

---

## SCOPE VIOLATIONS

None. Every write landed inside the lineage run directory. The `/tmp/overlay-probe` directory was created as a throwaway probe target for the engine's read-only `status` mode and holds no repository content.
