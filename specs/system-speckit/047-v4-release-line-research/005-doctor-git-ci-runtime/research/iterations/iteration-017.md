# Iteration 17 — Bug pass on the least-cited doctor routes (/doctor:env, :update, :overlay, :install, :ci)

## Focus

Read code behind the five doctor routes this child has cited least, and look for four specific
fault classes: an exit code that hides a failure, a write a check-only route performs, a flag the
YAML passes that the script rejects (or the reverse), and a path resolved from the wrong root. Each
script was run with `--help` and with its check or status mode only, recording the command and the
exit code.

## Actions Taken

1. Enumerated the route manifold: 41 YAML assets under `.skilled/commands/doctor/assets/` and 21
   scripts under `.skilled/commands/doctor/scripts/`. `/doctor:env` has **no script** — it is a pure
   prompt-time workflow reading `ENV-REFERENCE.md` plus `.env.example`.
2. Ran the four scripted routes' `--help` and recorded exit codes:
   `symlink-engine.cjs --help` → **2**, `ci-report.cjs --help` → **2**,
   `overlay-engine.cjs --help` → **0**, `release-update.cjs --help` → **0**.
   The two exit-2 cases are correct behaviour for a UsageError, but it means neither script can be
   probed by an operator who guesses `--help`, and the two scripts that do support `--help` set the
   expectation.
3. `release-update.cjs check --repo . --json` → exit 0, `status: "current"`, no state-log file
   written, `git status --porcelain` unchanged. The check route's no-write claim holds.
4. `release-update.cjs check --repo /tmp --json` → **exit 1**, with a JSON error object on
   **stdout**: `{"ok": false, "error": "Command failed: git rev-parse --show-toplevel ..."}`.
5. `overlay-engine.cjs status` in this non-vendored tree → **exit 2** with
   `[overlay-engine] no overlay manifest at skilled-overlays/overlay-manifest.json`, no
   `.build-lock`, no state directory created. The documented exit-2 mapping is accurate.
6. `symlink-engine.cjs check --root <this repo>` → **exit 2**
   `{"error":"root and source must not contain one another"}` — the self-containment guard fires
   before any work, which is the correct answer for `/doctor:install` run against the checkout.
7. `ci-report.cjs --sha=<40 UPPERCASE hex> --no-gh` → **exit 2**
   `ERROR: --sha needs 40 lowercase hex characters`.
8. `skill-advisor.cjs list-tools --format json` (the `/doctor:install` advisor build check) →
   exit 0, and no file under `.skilled/skills/.state/advisor` was touched in the following 90 s. A
   pre-existing daemon makes this result inconclusive rather than a clean no-write proof.
9. Read the ENV-REFERENCE table headers and found a third header shape the `/doctor:env` parser does
   not recognise.
10. Read the `_routes.yaml` entries for `/doctor:install`, `/doctor:env` and `/doctor:ci report`.

## Findings

### F17-01 — `/doctor:update check` documents an exit-code contract with no slot for exit 1, and the engine uses exit 1 for every non-usage failure (P2, bug)

`check`'s exit policy names exactly two codes: exit 0 "means a report was produced", exit 2 "is
usage failure" [SOURCE: .skilled/commands/doctor/assets/doctor-update-check.yaml:127]. The engine's
top-level handler only distinguishes usage from everything else —
`const exitCode = error.usage ? 2 : 1` [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:2642].
So any internal failure exits 1, and the route asset tells the agent nothing about what 1 means. The
`on_failure` step says "Present the command output and exit code, then stop without writing a file"
[SOURCE: .skilled/commands/doctor/assets/doctor-update-check.yaml:128] — but because the failure body
is *valid JSON on stdout* (`release-update.cjs` writes `{ok:false,error,exitCode}` there), an agent
following "present the command output" renders a parseable report-shaped object. The one signal that
distinguishes the failure is the exit code the YAML never maps.

- Repro: `node .skilled/commands/doctor/scripts/release-update.cjs check --repo /tmp --json`
  → exit **1**, stdout `{"ok": false, "error": "Command failed: git rev-parse --show-toplevel\nfatal:
  not a git repository ..."}`.
- Release: present at the v4.0.0.0 baseline; last-touch date unverified this iteration
  (`git log --oneline -1 -- .skilled/commands/doctor/assets/doctor-update-check.yaml`).
- Confidence: high on the mismatch, medium on operator impact (the agent must additionally ignore
  `ok:false` to mis-render it).
- Verify: the repro above; then `grep -n 'exit_policy' .skilled/commands/doctor/assets/doctor-update-check.yaml`.

### F17-02 — `--sha` rejects uppercase hex, while the route asset and manifest document a bare "40 hex" (P2, ux)

The parser enforces lowercase: `if (!SHA_PATTERN.test(sha)) throw new Error('--sha needs 40 lowercase
hex characters: ...')` [SOURCE: .skilled/commands/doctor/scripts/ci-report.cjs:100]. The document
written for the operator says only `sha: "--sha=<40 hex> skips the commit search"`
[SOURCE: .skilled/commands/doctor/assets/doctor-ci-report.yaml:46], and the route manifest carries
the same bare placeholder [SOURCE: .skilled/commands/doctor/_routes.yaml:379]. GitHub's commit list,
copy from a rendered PR page and several CI logs surface mixed-case SHAs, so the friction is real and
the error text is the only place the constraint appears.

- Repro: `node .skilled/commands/doctor/scripts/ci-report.cjs --sha=51F70A03175D9E249BAF4B26AD43158232859E77 --no-gh`
  → exit **2**, `ERROR: --sha needs 40 lowercase hex characters`.
- Release: pre-v4 baseline; unverified last touch
  (`git log --oneline -1 -- .skilled/commands/doctor/scripts/ci-report.cjs`).
- Confidence: high (reproduced).
- Verify: the repro above; `sed -n '80p' .skilled/commands/doctor/scripts/ci-report.cjs` shows the
  usage line advertising `--sha=<40 hex>` with no case constraint.

### F17-03 — `/doctor:env` silently drops 8 documented variables, because ENV-REFERENCE.md uses a third table header the parser does not know (P2, drift)

The parser accepts exactly two header shapes [SOURCE: .skilled/commands/doctor/assets/doctor-env.yaml:38]
and instructs "Parse only tables whose header matches one of the two supported shapes"
[SOURCE: .skilled/commands/doctor/assets/doctor-env.yaml:40]. `ENV-REFERENCE.md` carries a third
shape, `| Variable | Set to | Read by |` [SOURCE: .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:131],
under which it documents `SKILLED_LOOP_ID`, `SKILLED_LOOP_RUNTIME`, `SKILLED_LOOP_HOPS`,
`SKILLED_LOOP_MODEL`/`PROVIDER`, `SKILLED_LOOP_NAME`, `SESSION_RELAUNCH_GOAL_PACKET` and
`SKILLED_LOOP_MANUAL_TEMPLATE` [SOURCE: .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:133].
The `.env.example` supplement cannot rescue them: it mentions the family only in a prose comment —
"the loop itself sets SKILLED_LOOP_* for each session, so never set those"
[SOURCE: .env.example:605] — and a prose line is explicitly not a setting. The result: those names
are outside the inventory with no note, and a selector naming one hits "A selector that matches
nothing is an error" [SOURCE: .skilled/commands/doctor/assets/doctor-env.yaml:102].

- Repro: `grep -c 'SKILLED_LOOP_ID' .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md` → 1,
  and that occurrence is inside the 3-column table; then apply the YAML's own rule at line 40 — no
  supported header, no row.
- Release: pre-v4 baseline (the reference table predates the v4 line).
- Confidence: high on the parse outcome; medium on severity, because every dropped name is
  wrapper-set rather than operator-set, so the inventory loss is completeness rather than wrong
  guidance.
- Verify: `awk 'NR>=129 && NR<=140' .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md`;
  `grep -n 'supported_headers' -A 3 .skilled/commands/doctor/assets/doctor-env.yaml`.

### F17-04 — `/doctor:env` is the only mutating route in this set with no `allowed_flags` and no `gate3_location` in its route entry (P2, drift)

The entry is `mutating: mutates`, then straight to `runnable: /doctor:env list`
[SOURCE: .skilled/commands/doctor/_routes.yaml:760] [SOURCE: .skilled/commands/doctor/_routes.yaml:762].
`--dry-run`, which the YAML names as its single accepted flag
[SOURCE: .skilled/commands/doctor/assets/doctor-env.yaml:100], therefore never appears in the
manifest, and no `gate3_location` string tells the Gate-3 answer what this route's mutation target
is. Every sibling route within this iteration's scope declares both: `/doctor:ci report` at
[SOURCE: .skilled/commands/doctor/_routes.yaml:379] and [SOURCE: .skilled/commands/doctor/_routes.yaml:381],
`/doctor:install` at [SOURCE: .skilled/commands/doctor/_routes.yaml:603] with its read-only
`gate3_location` on the following line. A mutating route without a Gate-3 location is the shape the
manifest exists to prevent.

- Release: pre-v4 baseline; `mutating:` and `runnable:` were added at different times, unverified.
- Confidence: high that the two keys are absent from the entry (lines 757-770 read in full); medium
  on whether the router enforces `gate3_location` at dispatch.
- Verify: `awk 'NR>=757 && NR<=770' .skilled/commands/doctor/_routes.yaml`.

### F17-05 — `/doctor:install` accepts positionals `list`, `?` and `menu`, but the manifest advertises only flags, and declares no default target (P2, drift)

The workflow says "The command takes no positional target. A whole argument of list, ? or menu
prints the ordered install steps and stops" [SOURCE: .skilled/commands/doctor/assets/doctor-install.yaml:44],
and step 1 repeats it [SOURCE: .skilled/commands/doctor/assets/doctor-install.yaml:57]. The route
entry lists `allowed_flags: ["--json", "--root <dir>", "--runtimes <list>"]`
[SOURCE: .skilled/commands/doctor/_routes.yaml:603] with no positional field, so the three words the
workflow promises are invisible to anything reading the manifest. The entry also carries
`target: guide` with no `default_target: true` [SOURCE: .skilled/commands/doctor/_routes.yaml:600],
where `/doctor:ci report` marks its report target `default_target: true`
[SOURCE: .skilled/commands/doctor/_routes.yaml:376]. A bare `/doctor:install` — the most likely
invocation — therefore depends on a defaulting rule that this entry does not opt into.

- Release: pre-v4 baseline for the entry shape; the `list`/`?`/`menu` positional and the default
  target are unverified against tag diffs this iteration.
- Confidence: high on the textual mismatch; medium on runtime effect (unproven router behaviour).
- Verify: `grep -n 'list, ? or menu' .skilled/commands/doctor/assets/doctor-install.yaml`;
  `awk 'NR>=599 && NR<=610' .skilled/commands/doctor/_routes.yaml`.

### F17-06 — `/doctor:install` mixes two roots in one run: its build checks are cwd-relative, its link plan is script-relative (P2, bug)

The two build probes are written as relative commands —
`test -d .skilled/skills/system-spec-kit/runtime/dist`
[SOURCE: .skilled/commands/doctor/assets/doctor-install.yaml:34] and
`node .skilled/bin/skill-advisor.cjs list-tools --format json`
[SOURCE: .skilled/commands/doctor/assets/doctor-install.yaml:35] — and step 1 runs them verbatim, so
both resolve against the agent's working directory
[SOURCE: .skilled/commands/doctor/assets/doctor-install.yaml:57]. The third probe,
`symlink-engine.cjs check --root <dir>`, resolves its **source** side inside the script:
`source: path.resolve(SCRIPT_ROOT)` [SOURCE: .skilled/commands/doctor/scripts/symlink-engine.cjs:68].
Run from a target repo that already vendors `.skilled/`, the builds are measured on the *target* and
the link plan on the *checkout*, which may be two different Skilled versions, while the route's
invariant still claims it "checks the Skilled checkout and target repo"
[SOURCE: .skilled/commands/doctor/assets/doctor-install.yaml:28]. Nothing in the run names which
tree answered the build question.

- Repro (root sensitivity, no write): from `/tmp`, `test -d .skilled/skills/system-spec-kit/runtime/dist`
  exits 1 while it exits 0 from the repo root — same command, opposite verdict.
- Release: pre-v4 baseline.
- Confidence: high on the two roots existing; medium on how often a run starts outside the checkout.
- Verify: `node .skilled/commands/doctor/scripts/symlink-engine.cjs check --root .` from the repo
  root → exit 2 `root and source must not contain one another`, proving the two sides are separate
  paths rather than one resolved tree.

### F17-07 — `/doctor:ci report` maps exit 1 to one cause, but exit 1 is also Node's exit on any uncaught throw in the report body (P2, improvement)

The route asset says exit 1 means "at least one workflow failed to parse (name each file with its
parser message and still show the other rows)"
[SOURCE: .skilled/commands/doctor/assets/doctor-ci-report.yaml:60]. The script derives 1 from
`loaded.errors.length > 0` [SOURCE: .skilled/commands/doctor/scripts/ci-report.cjs:153], yet several
steps run outside a `try` — `readVariables`, `resolveNewestNonRebuildSha`, `parseWorkflows` and
`loadWorkflows` are called in sequence before that return
[SOURCE: .skilled/commands/doctor/scripts/ci-report.cjs:140]. A throw from any of them (an unreadable
workflows directory, a YAML library fault) propagates out of `main`, Node exits 1, and the agent
renders the parse-failure branch with no per-file line to show. `runGh` is safe — it converts spawn
errors into `{ok:false}` [SOURCE: .skilled/commands/doctor/scripts/lib/ci-report-sources.cjs:46] — so
this is narrow but real.

- Release: pre-v4 baseline.
- Confidence: medium (code path read, not induced).
- Verify: `node -e "require('./.skilled/commands/doctor/scripts/ci-report.cjs')"`; then read
  `ci-report.cjs:140-153` for the unguarded call sequence.

## Negative results (recorded so the next iteration does not repeat them)

- `/doctor:overlay status` is honest: exit 2 on a tree with no overlay manifest, no `.build-lock`
  created, no state directory written. The documented mapping at
  [SOURCE: .skilled/commands/doctor/assets/doctor-overlay-status.yaml:58] matches the engine.
- `/doctor:update check` writes no state log (`.skilled/skills/.state/doctor-update/` unchanged
  before and after, README.md only) and leaves `git status` unchanged.
- `symlink-engine.cjs` validates flags **per command**: `check`, `plan`, `apply` and `unlink` each
  get their own allowlist and a flag outside it is refused with the flag named
  [SOURCE: .skilled/commands/doctor/scripts/symlink-engine.cjs:157]. `--root` is required for
  `check` [SOURCE: .skilled/commands/doctor/scripts/symlink-engine.cjs:168]. No flag mismatch exists
  between `/doctor:install` step 3 and the parser.
- `ci-toggle.cjs` does exit 1 on a refusal (`plan.status === 'REFUSED' ? 1 : 0`)
  [SOURCE: .skilled/commands/doctor/scripts/ci-toggle.cjs:334], exactly as `doctor-ci-toggle.yaml`
  claims — the refusal branch is not silently swallowed.
- `--profile` accepts both `--profile <path>` and `--profile=<path>`
  [SOURCE: .skilled/commands/doctor/scripts/lib/ci-profile.cjs:129], so the YAML's equals form and
  the usage line's space form cannot diverge.

## Questions Answered

None fully. F17-01..F17-07 add evidence to **Q10 (friction)** and to the code-level half of
**Q5/`.github` + `/doctor:ci`**, but neither key question closes.

## Questions Remaining

- **Q3/Q4 hooks half** — unchanged and still the dominant gap: no scratch repo, so `pre-push`
  without a `Commit-Id` and the 20 s `gate:git-timeout` remain unreproduced for a sixth iteration.
- **Q6** — Devin's 16,384-byte rule cut against the concatenated repo-rules size.
- **Q11** — command and skill *format* against sk-code / sk-doc canon.
- New: does the router enforce `gate3_location` and `allowed_flags` for positionals at dispatch?
  F17-04 and F17-05 both hinge on it, and both can be settled by reading the router (`_routes.yaml`
  consumer) rather than the assets.
- New: whether `SKILLED_LOOP_*` belongs in the `/doctor:env` inventory at all. If the answer is "no,
  wrapper-set only", F17-03 downgrades to a documentation note for the third header shape.

## Next Focus

Read the `_routes.yaml` **consumer** — the command router that validates `allowed_flags`,
`gate3_location` and `default_target` — and settle F17-04/F17-05 against it rather than against the
asset text. One pass, no scratch repo needed.

## SCOPE VIOLATIONS

None. Every write in this iteration landed under the lineage directory. No repository file was
modified; `git status --porcelain` was identical before and after each script run. Note for the
record: `specs/001-test-feature/` is still untracked in the working tree, left by an earlier
iteration of this run — observed again this iteration, and deliberately not removed, because deleting
it is outside this child's write authority.
