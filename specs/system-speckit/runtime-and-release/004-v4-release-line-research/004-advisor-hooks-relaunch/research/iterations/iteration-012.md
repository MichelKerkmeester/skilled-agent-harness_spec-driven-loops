# Iteration 012 — Unread releases v4.0.0.5, v4.0.0.15, v4.0.0.16 (cluster paths only)

## Focus

Close the three unread release notes for the advisor / hooks / relaunch cluster and test their
claims against the current tree:

1. **v4.0.0.5** — the one cluster claim in a spec-kit release: the pre-commit trigger-phrase gate
   and its fail-open list.
2. **v4.0.0.15** — three advisor claims: typed-command owner cap, mode-suffix tokenisation, and the
   ambiguity/floor tie rules ("flags fell to 78").
3. **v4.0.0.16** — the hook git-call time limit (carried open for nine iterations), the
   changelog-request routing fix, and the `/create:skill-parent` route (generation-1 follow-up).

## Actions Taken

1. Read all three release notes; enumerated every advisor, hook and relaunch claim in each.
   v4.0.0.5 carries exactly one hook claim; v4.0.0.15 carries four advisor claims; v4.0.0.16
   carries six across hooks, advisor routing and deep-loop resume.
2. Located the implementation of the v4.0.0.16 git-timeout claim: `.skilled/scripts/git-hooks/lib/bounded-git.sh`
   plus the two hooks that source it. Read the bound arithmetic and the refusal path.
3. Located the v4.0.0.15 ambiguity claims in `runtime/lib/scorer/ambiguity.ts` and read the tie
   function in full.
4. Traced the phrase gate from `pre-commit` into `template-phrase-lint.mjs` and read its git helper
   and its fail-open guards.
5. Ran the advisor twice (live): `write a changelog for this packet` and
   `/create:skill-parent for a new hub skill`.

## Findings

### f-iter012-001 — v4.0.0.16's "every git call in the commit and push hooks" is false for the gate v4.0.0.5 added (drift, P2)

The release note states: "Every git call in the commit and push hooks that reads the index now stops
after 20 seconds and blocks with `BLOCKED [gate:git-timeout]`."
[SOURCE: .skilled/changelog/skilled/v4.0.0.16.md:222]

The phrase gate added one release earlier runs an index read outside that helper.
`gitOutput()` in the linter calls `execFileSync('git', args, {cwd, encoding: 'buffer', stdio})` with
no `timeout` option and no `core.fsmonitor=false` override
[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-lint.mjs:29],
and its first use is `git diff --cached --name-status --find-renames -z`
[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-lint.mjs:39] — an index read,
which is precisely the class `bounded-git.sh` says it exists for
[SOURCE: .skilled/scripts/git-hooks/lib/bounded-git.sh:5]. `pre-commit` invokes the linter as a child
process [SOURCE: .skilled/scripts/git-hooks/pre-commit:232], so the linter cannot write
`GIT_BOUND_DIR/timeout` and `git_bound_finish` can never emit the refusal for it
[SOURCE: .skilled/scripts/git-hooks/lib/bounded-git.sh:94].

The two releases were never reconciled: `.16` bounded the hook's own shell-level git calls and left
the `.5` gate's Node-level git calls untouched. A wedged fsmonitor daemon or a stuck index lock that
stalls that `git diff --cached` still hangs the commit with no bound and no message.

- Release: v4.0.0.16 (claim), v4.0.0.5 (the unbounded path)
- Confidence: high on the code path; the 20s bound is confirmed as
  `${GIT_BOUND_SECONDS:-${SPECKIT_GIT_TIMEOUT:-20}}` [SOURCE: .skilled/scripts/git-hooks/lib/bounded-git.sh:54]
- Verify: `grep -n "timeout" .skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-lint.mjs`
  returns nothing; `grep -c git_bounded .skilled/scripts/git-hooks/pre-commit` counts the shell calls only.

### f-iter012-002 — any non-zero linter exit is reported to the operator as a trigger-phrase violation (bug, P2)

`pre-commit` branches on `elif ! node "$PHRASE_LINTER"; then` and prints
`BLOCKED [gate:template-phrase-lint]: staged trigger phrases contain a template or editor fallback`
for **every** non-zero exit [SOURCE: .skilled/scripts/git-hooks/pre-commit:234]. The linter itself has
a richer exit contract — `process.exit(0)` and `process.exit(2)` on its two deliberate paths
[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-lint.mjs:147] — and the hook
does not read it. A crash, an `ENOENT` from the unguarded `git` spawn, or an OOM is therefore
reported as a phrase problem, and the operator is told to fix a phrase or bypass with
`SPECKIT_SKIP_PHRASE_LINT=1` [SOURCE: .skilled/scripts/git-hooks/pre-commit:235].

This also puts v4.0.0.5's own promise under strain: "If the linter, its YAML library, `node` or git is
unavailable, the check warns and lets the commit through."
[SOURCE: .skilled/changelog/skilled/v4.0.0.5.md:134] The hook guards the first and third of those
explicitly [SOURCE: .skilled/scripts/git-hooks/pre-commit:229]
[SOURCE: .skilled/scripts/git-hooks/pre-commit:231] and the linter guards the second by loading YAML
lazily inside a `try` [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-lint.mjs:129].
The fourth — git unavailable — has no guard on either side of the boundary, so the only path left is
the throw from `gitOutput`, which the hook turns into a block.

- Release: v4.0.0.5
- Confidence: medium-high. The message conflation is confirmed by reading; that a missing `git`
  reaches it uncaught is inferred from the absence of a guard, and the residual check is
  `node .skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-lint.mjs` under
  `PATH=/usr/bin:/bin` minus git, comparing the exit code with 2.
- Verify: `grep -n "catch\|process.exit" .skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-lint.mjs`
  shows catches at 60 and 122 and 129, none wrapping `stagedMarkdownChanges`.

### f-iter012-003 — v4.0.0.15's ambiguity change is real, and the "never past the owner" rule is two exceptions, not one (verified, no defect)

The release claims the advisor "stops calling most prompts ambiguous": "A skill that only reached
that floor now counts as tied only when its score is also close, and a skill held below a typed
command's owner never counts as tied with it." [SOURCE: .skilled/changelog/skilled/v4.0.0.15.md:78]

Both are implemented exactly as described. `clustersWithTop` returns `false` for a member whose
`heldBelow` names the top [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/ambiguity.ts:37],
and for a floor-only member when the top earned its own confidence
[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/ambiguity.ts:42]. The margins are a
single 0.05 constant [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/ambiguity.ts:7].

Live behaviour matches. `write a changelog for this packet` — the exact phrase v4.0.0.16 says now
routes to sk-doc [SOURCE: .skilled/changelog/skilled/v4.0.0.16.md:238] — returns `sk-doc` first at
score 0.346 / confidence 0.82 with `compiledRoute.targets[0].packetId = sk-create-changelog`.
No ambiguity flag.

The recorded-but-unexplained inversion from iteration 1 is still visible here: sk-doc ranks first on
0.346 while the association-strength number is the lowest of the top three. That remains an
observation, not a finding — the ranking lane is documented and I have no evidence of a sort fault.

### f-iter012-004 — one bound, two names, and a documented fail-open the message stream hides (improvement, P2)

Three small defects sit on the same helper:

- Two env names set one bound, `GIT_BOUND_SECONDS` and `SPECKIT_GIT_TIMEOUT`
  [SOURCE: .skilled/scripts/git-hooks/lib/bounded-git.sh:54], and only the second appears in the
  operator-facing timeout message [SOURCE: .skilled/scripts/git-hooks/lib/bounded-git.sh:75].
- Without `perl` on PATH the bound silently does not exist — the helper runs the command unbounded
  and says so only in a source comment [SOURCE: .skilled/scripts/git-hooks/lib/bounded-git.sh:29].
- If the helper file itself is unreadable, `pre-commit` substitutes an unbounded `git_bounded` and
  prints a `WARNING [gate:git-timeout]` [SOURCE: .skilled/scripts/git-hooks/pre-commit:100], so an
  operator grepping hook output for the documented `BLOCKED [gate:git-timeout]` string sees nothing
  while the gate is unarmed.

Removing the two-name alias and printing the fail-open notice at the same severity as the block would
cost nothing and remove three ways for the gate to be quietly off. This is an improvement, not a bug:
each degrade is deliberate and defensible on its own (a gate must not break a host that lacks perl).

- Release: v4.0.0.16
- Confidence: high (all three read from source)
- Verify: `grep -n "GIT_BOUND_SECONDS\|SPECKIT_GIT_TIMEOUT" .skilled/scripts/git-hooks/lib/bounded-git.sh`

### f-iter012-005 — the `/create:skill-parent` route is not defective at the top recommendation (generation-1 follow-up, narrowed)

An eleventh-iteration-old open question asked whether sk-doc's shared-packet
`sk-create-skill-parent` entry causes a routing defect. Live probe:
`/create:skill-parent for a new hub skill` returns `sk-doc` 0.3765 / confidence 0.82 with
`compiledRoute.targets[0].packetId = sk-create-skill`, `heldBelow: null`, no ambiguity flag.
The top route lands on `sk-create-skill`, which is the parent packet a `skill-parent` request should
enter. So the observed route is consistent with a hub-to-leaf relationship rather than a
mis-route.

This does **not** close the question: it does not settle whether `sk-create-skill`'s ROUTER actually
forwards `skill-parent` to `sk-create-skill-parent`, nor the duplicate-`package_skill.py` half.
Recorded as narrowed, not answered.

- Release: n/a (pre-existing)
- Confidence: medium — the routing half is observed, the delegation half is unread.
- Verify: repeat the probe, then read `sk-create-skill` ROUTER for the `skill-parent` lead phrase.

## Questions Answered

None of the three strategy key questions is fully closed this iteration.

- The v4.0.0.15 advisor claims and the v4.0.0.16 changelog-routing claim are **verified working**.
- The v4.0.0.16 git-timeout claim is **verified partly false** (f-iter012-001).
- The generation-1 `/create:skill-parent` question is narrowed but not answered (f-iter012-005).

## Questions Remaining

- **Advisor transport (v4.0.0.0, v4.0.0.16)** — degraded local scoring and the shared-daemon
  lease/race are still unexercised. **Ten** iterations carried; still the run's largest untested claim.
  Nothing this iteration touched it.
- **Does the bounded-git claim hold for `pre-push`?** Only four `git_bounded` calls there, with plain
  `git -C "$REPO_ROOT" cat-file` and `git log --no-merges` at
  [SOURCE: .skilled/scripts/git-hooks/pre-push:326] and above. Those read the object store rather
  than the index, so they fall outside the claim's letter — but the helper's own rationale names
  "the index or the working tree" [SOURCE: .skilled/scripts/git-hooks/lib/bounded-git.sh:5], and I
  did not measure whether a wedged daemon can stall them.
- **Does the phrase linter's git-unavailable path exit non-zero?** One sandboxed run closes
  f-iter012-002's inference half.
- **UX and extension** — relaunch enable, brief reading, history recovery. Never reached; twelfth
  iteration running.
- Carried unchanged: the degraded daemon path; the duplicate `package_skill.py`; `hook-flags.sh` vs
  `hook-flags.cjs` differential; which non-shared adapters import the flag module; `leaf-scopes.json`
  optionality; the live Claude turn-end hang; the live Codex compaction; the v4.0.0.10 `/dev/null`
  helper resolution.

## Next Focus

- **Stop postponing the advisor transport question.** It has been open for ten iterations and it is
  now the only claim in the run whose truth I cannot state. Kill the daemon deliberately, run one
  `advisor_recommend`, and record whether the fallback is local scoring or an error; then start two
  launchers within the same second and count the daemons.
- Close f-iter012-002's inference with one sandboxed linter run under a PATH without git.
- Read `pre-push` around the four unbounded `cat-file`/`log` calls to settle whether the v4.0.0.16
  claim's scope, not just its wording, is defensible.

## SCOPE VIOLATIONS

None. All writes this iteration were the iteration narrative, the delta file and the gateway append.
