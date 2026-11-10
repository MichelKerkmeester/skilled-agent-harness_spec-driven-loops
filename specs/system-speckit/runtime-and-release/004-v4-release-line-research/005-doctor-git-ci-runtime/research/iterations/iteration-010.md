# Iteration 010 — Doctor engine battery: exit-code contracts, pass/fail legibility, and mirror body-parity

Iteration: 10 of 11 · Mode: research · newInfoRatio: 0.62

## FOCUS

Key questions 10 (friction in doctor output, hook rejections, CI failures) and 12 (concrete
extensions), plus the v4.0.0.11 / v4.0.0.12 releases. Two carried tasks from the reducer brief:
re-test the P1 install-checklist fail-open claim, and run every `/doctor:*` engine script in a
read-only mode while quoting output length, exit code and first actionable line.

## ACTIONS TAKEN

All actions read-only. Two actions were **not** taken because they need writes this run forbids —
see `## SCOPE VIOLATIONS`.

1. **Engine battery, correct invocations.** Ran `symlink-engine check --root .`, `overlay-engine
   status --root .` and `overlay-engine --help`, `ci-toggle --help`, `release-update check
   --offline`, `route-validate.sh`, `sk-skill-check check sk-git`, `parent-skill-check
   .skilled/skills/sk-code`. Captured exit code and byte length for each; first bad measurement
   (piping through `head`, so `$?` read the pager) was discarded and re-measured without a pipe.
2. **`--help` contract probe** across six engines, unpiped.
3. **Mirror copy census.** Counted markdown files per runtime mirror and classified symlink vs
   regular copy; then compared sizes against the `.skilled/` source for every regular copy.
4. **Mirror checker probe.** Ran `agent-roster-mirror-check.cjs` and
   `command-catalog-mirror-check.cjs`; resolved all 66 `hook_adapter_fallback_health_checks` paths.
5. **Hook layer map.** `readlink` on the six live `.git/hooks/*`, then read the `commit-msg` hook
   header, its rule-resolution helper, and the installed hooks README. Ran the `commit-msg` hook
   once with an unreadable message file.

### Battery results (output bytes, exit code, first actionable line)

| Engine (read-only mode) | Exit | Bytes | First actionable line |
|---|---|---|---|
| `symlink-engine.cjs check --root .` | **2** | 51 | `ERROR: root and source must not contain one another` |
| `overlay-engine.cjs status --root .` | 2 | 261 | `[overlay-engine] no overlay manifest at skilled-overlays/overlay-manifest.json: …` |
| `overlay-engine.cjs --help` | 0 | 387 | `usage: node overlay-engine.cjs status [--root <tree>] [--json]` |
| `ci-toggle.cjs --help` | **2** | — | `ERROR: unknown argument: --help` (no usage block) |
| `release-update.cjs check --offline` | **0** | 3,638 | `release: v4.0.2.0` … every one of 20 unit lines reads `unknown (ancestry)`; no RESULT line |
| `route-validate.sh` | 0 | 2,901 | `WARN: H1: flag '--dry-run' appears in multiple /doctor:skill-advisor targets …` |
| `sk-skill-check.cjs check sk-git` | 0 | 1,101 | `Skill check: sk-git (canon)` → `Result: PASS` |
| `parent-skill-check.cjs .skilled/skills/sk-code` | 0 | 5,044 | `INFO: Parent skill: …` then `INFO: Advisory findings: FAIL. Hard failures always FAIL.` → tail `OK: parent-skill-check — all hard invariants passed, 0 warnings` |
| `symlink-engine.cjs --help` | **2** | — | `ERROR: unknown flag: --help` (no usage block) |
| `sk-skill-check.cjs --help` | **2** | — | `USAGE: Unknown option: --help` (no usage block) |
| `parent-skill-check.cjs --help` | **2** | — | `parent-skill-check.cjs: unknown option: --help` (no usage block) |

## FINDINGS

### F10-01 — Doctor has no shared exit-code contract, and `release-update` signals "unknown" with exit 0
- **type** improvement (also UX) · **severity P1** · **release** v4.0.2.0 (release-update ship) · **confidence** high
- `route-validate.sh` publishes a four-value taxonomy — `0` manifest valid, `1` assertion failure,
  `2` bad args or unparseable manifest, `3` missing dependency [SOURCE: .skilled/commands/doctor/scripts/route-validate.sh:17] [SOURCE: .skilled/commands/doctor/scripts/route-validate.sh:18].
  `release-update.cjs` computes an exit code through `process.exitCode = outcome.exitCode`
  [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:2669], yet `check --offline` returns
  **0** while every unit reads `unknown (ancestry)` and the output carries no `RESULT:`/`STATUS:`
  line. The command docs publish no exit contract at all: `update.md` has zero matches for `exit`,
  and `.skilled/commands/doctor/release-update.md` does not exist.
- **Why it matters:** CI and the AI user cannot gate on release position. A machine check that
  cannot be behind and cannot be ahead both exit 0, so "unknown" is indistinguishable from
  "aligned" — the exact confusion `route-validate.sh` avoided by writing its taxonomy down.
- **verify:** `node .skilled/commands/doctor/scripts/release-update.cjs check --offline; echo "exit=$?"` → 20 `unknown (ancestry)` lines, `exit=0`.

### F10-02 — The documented install inspection cannot run inside the Skilled checkout, and the refusal names no remedy
- **type** bug · **severity P1** · **release** v4.0.0.8 (install and symlink safety) · **confidence** high
- `/doctor:install` step 3 runs the engine "in place and read-only" [SOURCE: .skilled/commands/doctor/install.md:74], and the asset spells the command as `check --root <dir>` [SOURCE: .skilled/commands/doctor/assets/doctor-install.yaml:59]. Step 2 binds only `--root` and `--runtimes` [SOURCE: .skilled/commands/doctor/install.md:73] — never a source. The engine then refuses when root and source contain one another [SOURCE: .skilled/commands/doctor/scripts/symlink-engine.cjs:289] with a bare message [SOURCE: .skilled/commands/doctor/scripts/symlink-engine.cjs:290].
- **Repro (ran):** `node .skilled/commands/doctor/scripts/symlink-engine.cjs check --root .` inside the
  Skilled repository → `ERROR: root and source must not contain one another`, exit **2**, 51 bytes.
  `/doctor:install` therefore dies at its own inspection step on the canonical repository, and any
  vendored tree whose `--root` contains the source hits the same wall. The adjacent
  `symlink.md` contract says `check` adds `--root` only when the operator passed one
  [SOURCE: .skilled/commands/doctor/symlink.md:86], so the failing invocation is the documented one.
- **Fix direction:** the refusal should name the escape (`--source <outside-dir>`) or the workflow
  should bind `--source` alongside `--root`; the message currently tells the operator what is wrong
  and nothing about what to do.
- **verify:** `node .skilled/commands/doctor/scripts/symlink-engine.cjs check --root .; echo "exit=$?"` → `exit=2`.

### F10-03 — `parent-skill-check` prints `Advisory findings: FAIL` on a passing run
- **type** UX · **severity P1** · **release** v4.0.1.0 (doctor commands) · **confidence** high
- The run that ends `OK: parent-skill-check — all hard invariants passed, 0 warnings` and exits 0
  carries, in its first four lines, `INFO: Advisory findings: FAIL. Hard failures always FAIL.`
  Every later row is `PASS:`. An operator reading the head, or an AI handed the first lines of a
  truncated grep, reads a failure on a green run — the one signal a doctor check must never emit.
- **verify:** `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-code | head -4` → the `FAIL` line; then `… | tail -2` → `OK … 0 warnings`.

### F10-04 — `route-validate` prints 11 warnings before its verdict, with no severity field
- **type** UX (improvement) · **severity P2** · **release** v4.0.3.0-era runner · **confidence** high
- Exit 0, 2,901 bytes, and the first six lines are `WARN: H1: flag '…' appears in multiple /doctor:…
  targets (allowed but informational)`. The verdict arrives last: `OK: route-validate — 31 routes
  validated, 11 warnings`. The only thing distinguishing "informational" from "regression" is the
  prose parenthetical, so a reader cannot triage without reading all six. The taxonomy that would fix
  it already exists two files over [SOURCE: .skilled/commands/doctor/scripts/route-validate.sh:18].
- **verify:** `bash .skilled/commands/doctor/scripts/route-validate.sh | head -6; echo "exit=$?"`.

### F10-05 — The `--help` contract is per-engine: one engine documents it, four reject it
- **type** UX · **severity P2** · **release** v4.0.0.3 (doctor commands) · **confidence** high
- `doctor-overlay-apply.yaml` promises `overlay-engine.cjs --help` "prints its usage block and exits
  0" [SOURCE: .skilled/commands/doctor/assets/doctor-overlay-apply.yaml:65]. **Verified true**
  (exit 0, 387 bytes, 5 usage lines). `symlink-engine`, `ci-toggle`, `sk-skill-check` and
  `parent-skill-check` all answer `--help` with an unknown-option error and exit **2**, and print no
  usage block, so the promise holds for exactly one engine and nothing states that it is one engine's
  contract. `overlay.md` also records that status writes nothing and takes no lock
  [SOURCE: .skilled/commands/doctor/overlay.md:91], which is the discipline the others should share
  but whose help text they do not.
- **verify:** `for s in symlink-engine ci-toggle sk-skill-check parent-skill-check; do node .skilled/commands/doctor/scripts/$s.cjs --help; echo "$s exit=$?"; done` → four `exit=2`.

### F10-06 — The runtime-mirrors hook battery is existence-only, and its degraded verdict is prose
- **type** extension · **severity P1** · **release** v4.0.0.1-era mirrors layer · **confidence** high
- 66 rows, every one `type: file_exists`, e.g. the Claude `PreToolUse` rows
  [SOURCE: .skilled/commands/doctor/assets/doctor-runtime-mirrors.yaml:59]. All 66 paths resolve
  today (checked with a `test -e` sweep), so the battery is green. The degraded path is an
  instruction to the model, not a check: "Collect every row whose path does not resolve as a
  degraded hook adapter" [SOURCE: .skilled/commands/doctor/assets/doctor-runtime-mirrors.yaml:148],
  aggregated by reporting each surface with its own verdict. Nothing computes `N hook adapters
  degraded` deterministically, so the report is only as reliable as the model's obedience.
- **Extension:** add a `hook_degraded` count and a non-zero exit to the workflow, and give the
  battery a second row type (`body_parity`) — see F10-07 for why existence is not enough.

### F10-07 — Mirror hosts are mostly copies, so existence checks cannot see a stale body — and sanctioned deltas look exactly like drift
- **type** extension · **severity P1** · **release** v4.0.0.1+ mirrors · **confidence** high
- Census over markdown files per host: `.pi` 400 files / **0** symlinks, `.codex` 48 / **0**,
  `.dsh` 50 / **0**, `.opencode` 37 / **1**, versus `.claude` 60 files / 45 symlinks and `.cursor`
  61 / 56. For the copy-backed hosts a mirror whose body is a release behind still satisfies
  `file_exists`.
- The discriminating evidence cuts both ways, which is the point: `.codex/hooks/README.md` is
  **3,676 B** against a **41,311 B** source, and the delta is *intentional* — its own frontmatter
  calls it a "Codex Hook Discovery Mirror … Discovery-only symlinks … not the runtime wiring source"
  [SOURCE: .codex/hooks/README.md:2] [SOURCE: .codex/hooks/README.md:7]. `.pi/agents/*.md` differ
  from `.skilled/agents/*` by ~128 B each (11 files) and pass `agent-roster-mirror-check`
  (11/11 present, `STATUS=OK`) — a presence-only check, so intent was never tested. A size delta
  therefore proves nothing on its own, and neither checker can tell a sanctioned pointer from a
  stale copy.
- **Extension (concrete):** a `/doctor:runtime-mirrors` `body_parity` row type with an explicit
  `intentional_pointer: true` allowlist keyed by path, plus `cmp -s` against the `.skilled` source for
  every non-symlinked copy. Removing the check keeps today's behaviour, so nothing breaks by adding it.
- **verify:** `for f in $(find .pi .codex .dsh .opencode -name '*.md'); do …` size compare — 11 `.pi`
  deltas and 1 `.codex` delta; `cmp .codex/hooks/README.md .skilled/hooks/README.md` → differ.

### F10-08 — The install-checklist fail-open is confirmed by code; the live repro is still blocked
- **type** drift (docs vs behaviour) · **severity P1** · **release** v4.0.0.3 (hook safety) · **confidence** high (code) / none (repro)
- The hook documents its own fail-open: exit `0` means "message passes, **or the repository declares
  no commit rules**" [SOURCE: .opencode/scripts/git-hooks/commit-msg:26], and exit `1` covers both a
  broken contract and an unreadable one [SOURCE: .opencode/scripts/git-hooks/commit-msg:27]. Rules
  resolve from `skgit.contractDir` and otherwise the first of `.sk-git/`, `.skilled/`, `.opencode/`
  that carries the templates [SOURCE: .opencode/scripts/git-hooks/lib/message-contract-gate.sh:60]
  [SOURCE: .opencode/scripts/git-hooks/lib/message-contract-gate.sh:77]. The hooks are installed
  machine-wide through the global hooksPath, with the validator found next to the hook rather than in
  the target repository [SOURCE: .opencode/scripts/git-hooks/commit-msg:14]. The README states the
  same exception in operator language — it blocks "only where the repository declares rules"
  [SOURCE: .opencode/scripts/git-hooks/README.md:114] — and the link step is a single `ln -sf`
  [SOURCE: .opencode/scripts/install-git-hooks.sh:181].
- **Consequence:** a repo with the global hooks installed and none of the three dirs accepts a
  malformed commit *by design*. The exception is documented inside the hook and its README; the
  question carried since iteration 2 is whether the operator-facing install checklist states it. That
  comparison was not reachable this iteration.
- **Partial live evidence (ran):** `bash .opencode/scripts/git-hooks/commit-msg <(printf 'garbage message\n')`
  → `BLOCKED: commit-msg hook received no readable message file.`, exit 1 — the fail-closed guard at
  [SOURCE: .opencode/scripts/git-hooks/commit-msg:30] works. `/dev/fd` fails the `-f` test, so this
  probes the guard, not the rules path.
- **verify (needs a scratch repo, blocked):** `git init /tmp/x && cd /tmp/x && printf 'garbage\n' > m && git commit --allow-empty -F m; echo $?` → expect 0 (accept).

### F10-09 — Two hook layers, no duplication — but sk-git's docs never name the hooks that actually run
- **type** UX · **severity P2** · **release** v4.0.0.3 · **confidence** high
- **Answer to Q9 for hooks: not duplication.** The six live `.git/hooks/*` (`commit-msg`,
  `prepare-commit-msg`, `pre-commit`, `pre-push`, `post-commit`, `post-merge`, `post-rewrite`) are
  symlinks into `.opencode/scripts/git-hooks/` — verified with `readlink`. The separate
  `.skilled/skills/sk-git/scripts/hooks/` set (`git-message-gate.mjs`,
  `git-preflight-advisory.mjs`) is the *agent* gate, a `PreToolUse` check on the command before it
  runs [SOURCE: .skilled/skills/sk-git/feature-catalog/workflow-playbooks/message-contract-enforcement.md:62].
  Removing either loses a distinct layer; nothing is dead.
- **The gap is discoverability:** the git-hook resolution text (`.sk-git` / `contractDir` / fail-open)
  lives only in `.opencode/scripts/git-hooks/README.md:114`. `.skilled/skills/sk-git/scripts/hooks/README.md`
  contains no `.sk-git` or contract-dir text at all (grep: zero matches), yet that is the file sk-git
  routing points at. An operator reading sk-git cannot find the hook code that gates their commits.
- **verify:** `readlink .git/hooks/commit-msg` → `.opencode/scripts/git-hooks/commit-msg`; `grep -n 'sk-git/' .skilled/skills/sk-git/scripts/hooks/README.md` → no match.

### F10-10 — Extension: CI can run the existing doctor suites today, with no `gh` and no network
- **type** extension · **severity** P2 · **release** n/a (gap) · **confidence** medium
- Every engine has a test file beside it: `ci-toggle`, `overlay-engine` ×5, `parent-skill-check` ×5,
  `release-update`, `route-validate`, `sk-skill-check`, `symlink-engine` under
  `.skilled/commands/doctor/scripts/tests/`, and `.opencode/scripts/git-hooks/tests/` beside the
  hooks. All the engines here run offline (`release-update check --offline` exits 0 with
  `upstream: unknown`), so a CI job could gate on them without credentials.
- **Gap in this finding:** whether `.github/workflows` already runs them was *not* re-verified this
  iteration; that stays open. The extension is the wiring, not the suites — and it pairs with
  F10-01, because wiring suites whose engines disagree on exit codes would bake the ambiguity in.
- **verify:** `ls .skilled/commands/doctor/scripts/tests/ | wc -l`; `grep -rl 'doctor/scripts/tests' .github/workflows/`.

### Observation (not a finding)
`overlay-engine status` gives the best failure message in the battery: it names the path it looked
for, the fallback location, and the two ways to fix it — exit 2, 261 bytes. It is the shape
F10-01, F10-02 and F10-03 should copy.

## QUESTIONS ANSWERED

- **Q12** — "What concrete extensions to doctor checks, hooks, CI and mirror sync would close a gap
  found in this run?" Answered by F10-06 (deterministic degraded count + exit), F10-07
  (`body_parity` row type with an `intentional_pointer` allowlist), F10-10 (wire the existing
  offline suites), and F10-01's shared exit-code contract.

## QUESTIONS REMAINING

- **Q10** — narrowed, not closed. Doctor-output friction is now measured on four engines
  (F10-01…F10-05) and hook-rejection friction on one (F10-08), but **CI-failure friction was not
  examined at all** this iteration.
- **Q4 (hooks half)** — the fail-open repro still needs a scratch repo; open since iteration 2.
- `Commit-Id: 0000000` plus a valid id; `pre-push` without a `Commit-Id`; the 20 s
  `BLOCKED [gate:git-timeout]` — all unchanged, all need writes.
- The v4.0.0.15/v4.0.0.16 worktree behaviours (`local-*` links, fsmonitor reaper, merged-worktree
  sweep, `SPECKIT_WORKTREE_AUTOREAP=0`, `SPECKIT_WORKTREE_BASE`) — still unread.
- Whether `.github/workflows` runs the doctor suites (F10-10's gap).

## SCOPE VIOLATIONS

Two actions the reducer brief asked for require writes outside this run's allowed paths, so they
were **not executed**; recorded here per the scope-violation protocol.

1. **`/tmp` scratch-repo repro of the fail-open commit.** The brief asked for "a /tmp repo with hooks
   installed and no `.sk-git`". `git init`, a message file and a commit all create paths, and the
   run's allowed write list is this narrative, `deltas/iter-010.jsonl` and the append gateway. Not
   performed. This is why F10-08 rests on code plus a partial live probe rather than a commit.
2. **`ci-toggle` in a mutating mode.** Its only documented interface is `--variable=<NAME>
   --state=<on|off>`; there is no check/plan flag, so any invocation is a state change. Not
   performed; the battery row records only its `--help` refusal.

## NEXT FOCUS (iteration 11/11)

Close what is closable without writes: read the v4.0.0.15/v4.0.0.16 notes against the worktree code
(path-limited diff only), settle `.github/workflows` coverage of the doctor suites, and check whether
any CI failure path prints a legible verdict — the last limb of Q10.
