# Iteration 9 — Release-cluster pass v4.0.0.1 / v4.0.0.3 / v4.0.0.11 / v4.0.0.12 / v4.0.0.14, plus the shared-mechanism answer to Q12

## Focus

The five remaining empty release rows for this cluster were filled by date-limited,
path-limited `git log` over the four hubs plus the three command directories, then by
reading the code those commits changed and running one note claim per release.

Date windows were taken from the tag commit dates, not from the note files, because
`.skilled/changelog/skilled/v4.0.0.1.md` was last rewritten on 2026-10-28 (`9a75d61568`),
five weeks after its tag. That distinction matters for anyone filling these rows later:
`git log -1 -- <note path>` returns the note's last edit, not the release date.

| Release | Date window used | Hub-path commits found |
| --- | --- | --- |
| v4.0.0.1 | 2026-09-24 .. 09-25 | 1 — `568d2b12c9 fix(sk-code): stop the rule canary from checking the removed CLAUDE.md` |
| v4.0.0.3 | 2026-10-05 .. 10-06 | 3 — `295c93623a`, `7412c0a4cb`, `901c9936e1` (all sk-doc) |
| v4.0.0.11 | 2026-10-16 .. 10-17 | 0 in the exact window; nearest hub commits are `44ab94ac4d feat(sk-doc): space the root README with forced blank lines` (10-17, after the tag) and `6dca819204 feat(sk-prompt): make Haiku eligible` (10-18) |
| v4.0.0.12 | 2026-10-17 .. 10-17 | 0 |
| v4.0.0.14 | 2026-10-24 .. 10-25 | 17, headed by `7041b05478 feat(sk-doc): validate the fields of an external surface detection block` |

The v4.0.0.11 and v4.0.0.12 rows are legitimately empty for this cluster: both notes are
doctor/sk-git/advisor releases whose only hub mention is a consequence sentence in
v4.0.0.12 (`/doctor:git setup` and the sk-code drift guards) [SOURCE: .skilled/changelog/skilled/v4.0.0.12.md:28].
No hub file changed on 2026-10-17, so that sentence describes the guard's *behaviour* being
what the doctor release measured, not a hub edit. Two empty rows out of five is the
expected shape, not a coverage hole.

## Actions Taken

1. Read the registry's last 45 findings and the 12 key questions so nothing below repeats
   iteration 4/6/8 ground (`sk-code`'s version renumbering, the retired `sk-doc-template`
   comment, the `sk-prompt` DEPTH removal, `compiled-route.cjs` exit 2, the root-metadata gate).
2. Ran the v4.0.0.1 canary that `568d2b12c9` changed, and read its delivery-prefix cap.
3. Read the v4.0.0.3 stem change in `check-repo-rules.cjs` and ran the repo's own CHECK 10.
4. Read the v4.0.0.14 detection-block validator change and ran `ci-skill-root-metadata.cjs`.
5. Traced the v4.0.0.14 note claim ("sk-doc's citation scan … skips the monitor too") into
   `cite-drift-scan.mjs` and into the split classifier half.

## Findings

### F1 — CHECK 10 grades a vague rule bullet more leniently than a precise one

**Type:** improvement (4) · **Severity:** P2 · **Release:** v4.0.0.3 (the stem change made it
worse) · **Confidence:** high for the mechanism, medium that the inversion is unintended

`coverage()` iterates the **rule bullet's** words and divides the matches by the bullet's own
word count [SOURCE: .skilled/skills/sk-doc/sk-create-repo-rule/scripts/check-repo-rules.cjs:272]
and [SOURCE: .skilled/skills/sk-doc/sk-create-repo-rule/scripts/check-repo-rules.cjs:275].
The pass bar is a flat 0.30 [SOURCE: .skilled/skills/sk-doc/sk-create-repo-rule/scripts/check-repo-rules.cjs:40],
applied at the best-matching router row [SOURCE: .skilled/skills/sk-doc/sk-create-repo-rule/scripts/check-repo-rules.cjs:539].

Because the denominator is the bullet's length, the bar scales with verbosity: a one-word
bullet must match that word 100%, while a ten-word bullet passes by sharing three. The gate
therefore rewards the padded bullet and punishes the terse one — the opposite of the
coverage it claims to measure, which is "does this rule fire on the condition its router row
announces".

The v4.0.0.3 change compounds the arithmetic rather than the logic. It lowers the stem floor
for `ed`/`ing` to three letters and, for a three-letter stem, adds a second synthetic token
`<stem>e` to the word set [SOURCE: .skilled/skills/sk-doc/sk-create-repo-rule/scripts/check-repo-rules.cjs:251]
and [SOURCE: .skilled/skills/sk-doc/sk-create-repo-rule/scripts/check-repo-rules.cjs:254].
A bullet containing one `-ed` word therefore contributes **two** entries to its own
denominator, and every one of them has to be matched or the ratio drops — for exactly the
bullets the change was written to rescue. The fix rests on `wordsMeet`'s four-letter prefix
rule [SOURCE: .skilled/skills/sk-doc/sk-create-repo-rule/scripts/check-repo-rules.cjs:263],
which cannot reach a three-letter stem at all, so the `mov`/`move` pair only meets through
the synthetic token.

**What breaks if the synthetic token is removed:** only the two tests the same commit added
(`test_moved_bullet_meets_moving_router_item`, `test_moved_bullet_meets_move_router_item`);
all 62 real bullets in this repository still pass, because none of them depends on a
three-letter stem. That is a narrow purchase for a permanent wrinkle in the denominator.

**Observed:** `node .skilled/skills/sk-doc/sk-create-repo-rule/scripts/check-repo-rules.cjs`
→ `10/11 PASS fires-when coverage - bullets=62 every bullet has a router counterpart (threshold 0.3)`,
`11/11`, `RESULT: PASSED`, exit 0.

**Verify:** run the checker above; then print the denominator asymmetry with
`node -e` evaluating the module's `coverage(contentWords('Deploy'), item)` against
`coverage(contentWords('a file was moved out of the folder below'), item)`.

### F2 — The delivery-prefix canary sits five bytes inside its own cap

**Type:** improvement (4) / ux (5) · **Severity:** P2 · **Release:** v4.0.0.1 (the commit that
re-pointed the canary at `AGENTS.md`) · **Confidence:** high — the run prints both numbers

`568d2b12c9` removed `CLAUDE.md` from `IRON_LAW_FILES` and put `AGENTS.md` in its place, and
re-pointed the self-test's tamper target the same way. That is correct for a repository with
no `CLAUDE.md` (`ls CLAUDE.md` → no such file). The canary now also measures where each
delivery-prefix heading ends [SOURCE: .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js:140]
and prints the highest offset [SOURCE: .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js:465].

The current run reports the last anchor, `#### Blast-Radius Management`, ending at byte
**16379** against a cap of **16384** — five bytes of headroom, one word. Any edit that adds
a heading or nudges that section later fails the canary, and the failure will look like a
rule-invariant violation rather than the budget overflow it is. A gate that is one word from
red is a gate that will next be "fixed" by moving the anchor list, not by trimming the prefix.

**Verify:** `node .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js | grep 'end byte'`
and read the last offset in the table under it.

### F3 — sk-doc's shared validator imports a sibling hub's private scripts, unguarded

**Type:** misalignment (2) · **Severity:** P2 · **Release:** present at v4.0.2.0 (the import is
in the split classifier half its own README says the host "never gets imported back" from)
· **Confidence:** high for the coupling, medium for the failure mode

`classifier-cite-drift-scan.mjs` reaches out of sk-doc entirely and into `cli-classifier`'s
shared scripts [SOURCE: .skilled/skills/sk-doc/shared/scripts/classifier-cite-drift-scan.mjs:15]
and [SOURCE: .skilled/skills/sk-doc/shared/scripts/classifier-cite-drift-scan.mjs:16].
The host re-exports from it [SOURCE: .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:39],
and `validate_document.py` drives the advisory through that path, carrying the legacy
env-name tuple of its own [SOURCE: .skilled/skills/sk-doc/shared/scripts/validate_document.py:3110].

So a document validator in one hub has a module-load-time dependency on a *different* hub's
internals, and nothing in sk-doc declares it. Remove or rename `cli-classifier` and the
advisory does not degrade — the module fails to load, and because the advisory is specified
to "never change the exit code", the validator stays green with the check silently gone. The
`featureSwitch` call at the top of `runAdvise` [SOURCE: .skilled/skills/sk-doc/shared/scripts/classifier-cite-drift-scan.mjs:909]
is a runtime guard; the import above it is not.

**What breaks if the coupling is reversed** (sk-doc owns a tiny local switch reader): nothing
today — `jev-features.mjs` exposes one frozen table and one resolver, and the only feature
sk-doc needs is `cite-drift`.

**Verify:** `grep -rn "cli-classifier" .skilled/skills/sk-doc/shared/scripts | wc -l` (non-zero),
then `node --input-type=module -e "import('./.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs').then(()=>console.log('loads'))"`.

### F4 — The fleet gate skips two of sixteen skills and does not say so

**Type:** ux (5) · **Severity:** P2 · **Release:** v4.0.0.14 (the same commit that taught the
gate to check detection-block fields) · **Confidence:** high — counted from the run

The v4.0.0.14 work makes `ci-skill-root-metadata.cjs` validate `surface_detection` field by
field, and the reference now says out loud that folders beginning `local-` are skipped. The
skip is real [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs:181]:
the run reports `checked=14 passed=14 failed=0` while `.skilled/skills/` holds 16 skill
directories, the two missing ones being `local-obsidian` and `local-webflow`.

The defect is not the exemption, it is the report. A CI reader sees a full-pass line with no
skipped count, so a broken `local-*` skill is indistinguishable from a fleet with no
`local-*` skills. Every other gate in this run states its population (`files=13`,
`bullets=62`); this one states only what it looked at.

**Verify:** `node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs`
and `ls -d .skilled/skills/*/ | wc -l` → 14 checked against 16 present.

### F5 — Three gates, three summary formats, three meanings for exit 1 (Q12 answer)

**Type:** extension (7) · **Severity:** P2 · **Release:** n/a — a gap across all releases in
scope · **Confidence:** high, each format observed in this iteration's own runs

The operator's cost of unclear validator errors is concrete: in one iteration four gates ran
and produced four different success vocabularies.

| Gate | Success line | Failure signal |
| --- | --- | --- |
| `check-repo-rules.cjs` | `11/11 PASS …` then `RESULT: PASSED` | non-zero exit |
| `check-rule-copies.js` | `OK: all rule invariants present (…)` | non-zero exit |
| `ci-skill-root-metadata.cjs` | `checked=14 passed=14 failed=0` | non-zero exit |
| `validate.sh` | requires the literal `RESULT: PASSED` | exit code, separately |

Only the first and fourth agree, and the framework's own completion rule had to be written
to demand the literal token precisely because exit status alone has been wrong in both
directions.

**Three shared mechanisms, each tied to two findings already in the registry:**

1. **One validator exit-code contract (0 = pass, 1 = findings, 2 = could-not-check).**
   Grounded in `check-repo-rules.cjs`'s PASSED line and in `compiled-route.cjs`'s confirmed
   exit `2` on an unknown option (registry finding-8-13, which withdrew the earlier "exits 0"
   reading as a `head`-in-pipeline artifact). Today a caller cannot tell "clean" from "I never
   looked" without parsing prose; F4 above is exactly that hole. Adopt the taxonomy the
   gates already half-use, and require `RESULT: PASSED|FAILED|UNCHECKED` on every gate.
2. **One routing test harness.** Grounded in the registry rows that observed hub routes
   replaying cleanly (`sk-code` `single,orderedBundle,surfaceBundle,defer`; `sk-design`
   `single,orderedBundle,defer,none`) and in the `sk-design-chart` / `sk-design-diagram`
   replays that fired only on an explicit verb, while "make me a chart for monthly revenue"
   deferred. A single harness driving `compiled-route.cjs` with a table of prompts per hub
   would have caught the `none` outcome (registry F2, still unsettled) as a schema violation
   instead of a manual reading.
3. **One template lint, shared.** Grounded in the playbook marker pair the registry recorded
   (`RESULT_PERSISTENCE_MARKER_MISSING` emitted when `RESULT_PERSISTENCE_MARKER` is absent
   from the template) and in F1's inversion: both are "check that a document follows its
   template" rules, written twice, with different matching heuristics and different severity
   vocabularies. One lint, invoked with a template id, fixes F1's lenient denominator and
   gives the playbook marker a second caller.

## Questions Answered

- **Q12 (carried forward, registry key question)** — "What concrete extensions would let the
  hubs share validators, routing tests or templates?" The three mechanisms are F5, each named
  with the two registry findings it grows from and the gate code observed this iteration.
  Recorded as an `ANSWERS` edge from `f-iter009-005` to `q-shared-mechanisms`; the strategy
  checkbox for Q12 is not touched because Q12 lives in the registry, not in the strategy's
  `- [ ]` list.
- **Q11 (strategy, still open)** — not answered. This iteration adds only the validator-error
  third of it (F4, F5). Ambiguous mode choice and large mandatory loads are untouched here,
  so the strategy line stays unchecked.

## Ruled Out

- **"The legacy `SKDOC_CITE_DRIFT_CHECK` opt-out no longer works, so the READMEs are stale."**
  False. The alias is declared centrally in the feature table
  [SOURCE: .skilled/skills/cli-classifier/shared/scripts/jev-features.mjs:41] and resolved
  before the feature's own name, and `validate_document.py` short-circuits on the same tuple
  [SOURCE: .skilled/skills/sk-doc/shared/scripts/validate_document.py:3110]. The three docs
  that name it are accurate [SOURCE: .skilled/skills/sk-doc/SKILL.md:118] and
  [SOURCE: .skilled/skills/sk-doc/README.md:208]. The behavioural half cannot be re-checked
  without a stored Jev credential, so confidence is high on the mechanism and the claim stops
  there.
- **"v4.0.0.14's fsmonitor fix missed the classifier half of the citation scan."** False.
  `cite-drift-scan.mjs` applies one `GIT_NO_FSMONITOR` constant to every git call site
  [SOURCE: .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:145], and the classifier
  half runs no git at all — its `spawnSync` calls are `jev --version` and `jev auth status`.
- **"v4.0.0.1's canary fix left a stale `CLAUDE.md` reference."** False. The diff shows all
  four sites changed in the one commit (`rule-invariant-canary.md`, `scripts/README.md`,
  `check-rule-copies.js`, `check-rule-copies.test.sh`), and the canary passes from a tree that
  has no `CLAUDE.md` at all.

## Details Worth Carrying

- `git show 7041b05478` also bumps `.skilled/skills/sk-code/shared/references/stack-detection.md`
  from `2.2.5.0` to `2.2.6.0` and rewrites the sentence describing what the fleet check does —
  doc and code moved together, which is the shape most of the drift findings in this run
  lacked. Worth citing as the counter-example in the report's method section.
- The v4.0.0.3 note's hub claims are all sk-doc validator hardening
  (`295c93623a` stem floors, `7412c0a4cb` out-of-range citations in the advise summary,
  `901c9936e1` unreadable frontmatter values degraded to one warning). All three are visible
  in the code that ships at v4.0.2.0; the third is why F1's reading of `contentWords` starts
  from a hardened, not raw, file.

## Next Focus

Iteration 10 (last): assemble the report. Lead with F1–F5 and the previously settled rows,
build the release table for the whole cluster (five rows filled here, sixteen earlier), and
state plainly which registry questions close and which two stay open — the `none` outcome
schema question and Q11's mode-choice half. Then write the shared-mechanism proposal as the
closing recommendation rather than a finding, since it is a change to four gates, not a
defect in any one of them.
