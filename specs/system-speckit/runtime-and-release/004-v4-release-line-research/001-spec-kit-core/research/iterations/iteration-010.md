# Iteration 10 — KQ1 re-run through `classifyPrompt`, KQ2 fixtures under /tmp, and the withdrawal of the "clean checkout" claim

## Focus

Deepen the two half-answered key questions rather than open new ground. Ten prompts run through the real
`classifyPrompt` export; three rules the v4.0.0.0 note names exercised against mutated copies of a packet under
`/tmp`; every readings-only claim from iteration 9 re-checked against the working tree. Gate 3 was pre-resolved;
no gate was asked and no stop-for-yes occurred. No repository file was written.

## Actions Taken

1. **Withdrawal first.** `git status --porcelain -uall` on the repository: 566 untracked entries and 1 modified
   file. The untracked entries are 558 files under
   `specs/system-speckit/047-v4-release-line-research/` and 8 under `specs/001-test-feature/`. Nothing else.
2. **KQ1 harness.** Ran the real export through `tsx -e`, importing
   `.skilled/skills/system-spec-kit/shared/gate-3-classifier.ts` by absolute path (the `dist/` copy was avoided so
   the verdict comes from source). Ten prompts, each with an expected verdict taken from the Gate 3 sentence in
   AGENTS.md §2 ("Fires when the turn will write a file"), printed with `reason` and the matched vocabulary.
3. **Mode-axis reads.** Read the four canonical trigger arrays — file-write tokens, memory-save phrases, resume
   phrases, read-only disqualifiers — and the `classifyPromptCore` decision order plus `hasMixedWriteTail`.
4. **KQ2 fixtures.** Copied the leftover packet `specs/001-test-feature` to a `mktemp -d` root four times and ran
   `validate.sh <abs-path> --strict --json` on each, filtering `SOURCE_TAGS`, `AC_COVERAGE`, `AC_CLOSURE`,
   `PLACEHOLDER_FILLED`, `SCOPE_ADHERENCE`.
   - baseline, unmutated;
   - `v1` with a `research/research.md` carrying one dead citation and one live one;
   - `v2` with every acceptance-criteria checkbox forced to `- [ ]`;
   - a fifth run of the baseline with `SYSTEM_SCOPE_CHANGED_FILES` and `SYSTEM_SCOPE_BASE` both set.
5. **Absence proof for one named rule.** `git ls-tree -r <tag> --name-only | grep -ci scope-adherence` on
   `v4.0.0.0-beta.1`, `v4.0.0.0`, `v4.0.2.0` and `HEAD`: **0** for every one. Repo-wide
   `SYSTEM_SCOPE_CHANGED_FILES` grep: hits only inside `specs/` changelog drafts, zero inside `.skilled/`.
6. **Registry count.** 42 `rule_id` rows in the registry, 44 rule scripts in `runtime/cli/rules/`.

## Findings

### W1 — WITHDRAWAL: iteration 9's "clean checkout" framing for f-iter009-001 is wrong

**Withdrawn text** (iteration 9): "`--check` is red on a clean checkout"; "the check is red on any branch that adds
a packet, and red on the very run directory doing the checking".

**What the tree actually says.** The working tree is not clean and never was during this run:

```
$ git status --porcelain -uall | awk '{print $1}' | sort | uniq -c
    566 ??
      1 M
$ ... | grep '^??' | sed -E 's|^\?\? (specs/[^/]+/[^/]+)/.*|\1|' | sort | uniq -c
    558 specs/system-speckit/047-v4-release-line-research
      8 specs/001-test-feature
```

So the 43 documents that `generate-trigger-index.mjs --check` reported as absent from the index are this research
packet (558 files, of which the `*.md` docs are the indexed class) plus the 8-file packet an earlier probe left
behind. The red verdict is **explained by two untracked additions**, one of them created by this very run. The
sentence "red on any branch that adds a packet" was an extrapolation from one observation, not a measurement on a
clean tree, and I did not measure a clean tree in this tree's state — the correct statement is narrower.

**What survives from f-iter009-001, unchanged and still evidenced:** one verdict bucket for *added since build* and
*changed under the index*; the summary word ("missing from the index") disagreeing with the per-row word ("stale");
no `stale` boolean in the lookup JSON; and the manifest note asserting "no lookup answer depends on it" without a
check. Those four claims were read in the code and are not affected by the withdrawal.

Evidence: the counts above are my own measurement this iteration, not a code citation — that is the whole point
of the withdrawal. The surviving four claims keep iteration 9's citations, which I did not re-derive here.
Verify: `git status --porcelain -uall | grep -c '^??'` → 566 today; after committing the packet, rerun
`generate-trigger-index.mjs --check` and expect the *added* rows to disappear while the verdict logic is unchanged.
Confidence: high (counted). Release: n/a (research correction, not a product defect).

### F1 — Gate 3's suppression is order-asymmetric: a write verb placed *before* the read verb is thrown away, and the gate is skipped

Type: **bug** · Severity **P1** · Release: v4.0.0.0 (shared-package consolidation) · Confidence: high (ran it)
· Finding type: bug

Ten prompts, verdict from the real export. `expected` follows AGENTS.md §2: Gate 3 fires "when the turn will write
a file".

| # | Prompt | Expected | Actual | Reason | Verdict |
|---|---|---|---|---|---|
| 1 | `Edit the README and then review it.` | true | **false** | `read_only_override` | **FAIL** |
| 2 | `Review the README and then edit it.` | true | true | `file_write_match` | pass |
| 3 | `Fix the failing rule, then audit the packet.` | true | **false** | `read_only_override` | **FAIL** |
| 4 | `Create the level 2 packet docs.` | true | true | `file_write_match` | pass |
| 5 | `Could you create the level 2 packet docs?` | true | true | `file_write_match` | pass |
| 6 | `What does validate.sh check?` | false | false | `no_match` | pass |
| 7 | `save context` | true | true | `memory_save_match` | pass |
| 8 | `resume` | false | false | `no_match` | pass |
| 9 | `/speckit:resume 047` | true | true | `resume_match` | pass |
| 10 | `Audit the retrieval CLI and update the docs` | true | true | `file_write_match` | pass |

8 of 10 conform. The two failures are the same defect seen twice, and rows 1 and 2 are the minimal pair: *the same
two verbs, the same conjunction, opposite verdicts, decided only by word order*. Row 1 and row 3 are unambiguous
write requests ("Edit", "Fix" as the leading imperative) and both skip the documentation gate.

Cause, read in source: `hasMixedWriteTail` walks the read-only matches and, for each, computes
`between = normalized.slice(readIndex + readOnlyEntry.pattern.length, writeIndex)` — a forward slice from the read
verb to the write verb. When the write verb comes first, `writeIndex < readIndex`, so the guard
`if (writeIndex <= readIndex) { continue; }` discards the pair instead of treating it as mixed, no tail is
recovered, and the file-write branch falls through to `read_only_override`. The asymmetry is one comparison.

Impact: the operator's most natural phrasing for a two-step task — "fix X and then look at Y" — is the phrasing
that silently loses the spec-folder question, and the loss is invisible: `reason` is `read_only_override`, which
reads as a deliberate read-only judgement. The same defect direction also means the gate is *more* reliable for
timid phrasing than for decisive phrasing, which is backwards.

Evidence: `[SOURCE: .skilled/skills/system-spec-kit/shared/gate-3-classifier.ts:718]` (`hasMixedWriteTail`),
`[SOURCE: .skilled/skills/system-spec-kit/shared/gate-3-classifier.ts:731]` (`if (writeIndex <= readIndex)`),
`[SOURCE: .skilled/skills/system-spec-kit/shared/gate-3-classifier.ts:735]` (the forward-only `between` slice),
`[SOURCE: .skilled/skills/system-spec-kit/shared/gate-3-classifier.ts:854]` (the override return),
vocabulary at `[SOURCE: .skilled/skills/system-spec-kit/shared/gate-3-classifier.ts:151]` (file-write tokens
include `edit`, `fix`, `update`) and `[SOURCE: .skilled/skills/system-spec-kit/shared/gate-3-classifier.ts:241]`
(the read-only array opens here with `review`, and closes at
`[SOURCE: .skilled/skills/system-spec-kit/shared/gate-3-classifier.ts:246]` with `explain` — so the disqualifier
set is exactly `review`, `audit`, `inspect`, `analyze`, `explain`).

Repro (run this iteration, output pasted above):
```
cd .skilled/skills/system-spec-kit && ./node_modules/.bin/tsx -e "
(async () => { const m = await import('$PWD/shared/gate-3-classifier.ts');
  for (const p of ['Edit the README and then review it.','Fix the failing rule, then audit the packet.'])
    console.log(p, JSON.stringify(m.classifyPrompt(p))); })()"
```
Expected `triggersGate3: true` for both; actual `false` with `reason: read_only_override`.

Fix shape (not applied): make the pair order-independent — take the min/max of the two indices and test the span
between them for a `then|and|if` or a comma, or simply treat "any read-only match *and* any file-write match" in a
single imperative clause as a write. Row 4 and row 6 show the vocabulary is already precise enough that removing
`hasMixedWriteTail` entirely would over-trigger; the span test is the smaller change.

### F2 — `SCOPE_ADHERENCE`, named in the v4.0.0.0 note with two environment variables, does not exist in any tag of this release line

Type: **drift** · Severity **P1** · Release: v4.0.0.0 (introduced), still absent at v4.0.2.0 · Confidence: high
· Finding type: drift

The v4.0.0.0 note, under "A Completion Gate That Tells the Truth", says the gate "grew two checks of its own":

> Scope adherence refuses a packet whose changed files fall outside what its spec names, driven by
> `SYSTEM_SCOPE_CHANGED_FILES` and `SYSTEM_SCOPE_BASE`. Acceptance coverage runs on by default as an advisory.

The first of those two checks is not in the tree, not in any tag, and reads no environment variable:

```
$ for t in v4.0.0.0-beta.1 v4.0.0.0 v4.0.2.0; do echo -n "$t: "; git ls-tree -r "$t" --name-only | grep -ci scope-adherence; done
v4.0.0.0-beta.1: 0
v4.0.0.0: 0
v4.0.2.0: 0
$ grep -rln "SYSTEM_SCOPE_CHANGED_FILES" .skilled/ | wc -l
0
```

The registry has 42 rows and none of them is `SCOPE_ADHERENCE`; `runtime/cli/rules/` has 44 scripts and none of
them is `check-scope-adherence.sh`. Running the fixture with both variables set produces no entry at all — the two
`scope` hits in the output are an unrelated `spec.md` table row and `NORMALIZER_LINT`'s message about
`normalizeScope*` helpers.

This is not an unnoticed gap: the repository's own changelog-draft review had already recorded it before the
release text shipped —

> `SCOPE_ADHERENCE` is missing entirely. `v3.9.0.0.md` documents `check-scope-adherence.sh` as a new opt-in
> advisory rule with the `SYSTEM_SCOPE_CHANGED_FILES` and `SYSTEM_SCOPE_BASE` inputs.

— and the remediation that produced the shipped sentence kept the rule's name and both variables while the rule
stayed absent. So the note describes a gate that cannot fire, and an operator who follows the note and exports the
two variables gets silence, not a warning.

Evidence: `[SOURCE: .skilled/changelog/skilled/v4.0.0.0.md:91]` (the "two checks of its own" paragraph),
`[SOURCE: specs/system-speckit/031-system-speckit-v4/035-v4-changelog-draft-update/scratch/changelog-digests/system-spec-kit.md:50]`
(the prior finding that it is missing entirely), `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json:69]`
(`AC_COVERAGE` — the *other* named check — is present, so the omission is selective, not a rename),
`[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json:225]` (`SOURCE_TAGS`, an
advisory rule that does have a row).

Verify: `SYSTEM_SCOPE_CHANGED_FILES=".skilled/outside/x.ts" SYSTEM_SCOPE_BASE=HEAD \
bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <packet> --strict | grep -i scope` → only the two
unrelated hits; the correct answer is a `SCOPE_ADHERENCE` row with either a pass or a warning.

### F3 — `SOURCE_TAGS` cannot resolve anywhere outside the repository, and its "skipped" verdict is indistinguishable from "all citations are fine"

Type: **bug** / UX · Severity **P2** · Release: v4.0.0.0 · Confidence: high (ran it) · Finding type: bug

Fixture `v1` added a `research/research.md` carrying two citations — one to `does/not/exist.md:5` (dead) and one to
a real file (live). Verdict, identical to the baseline that has no research artifact at all:

```
SOURCE_TAGS = warn | [SOURCE:] check skipped: the repository or the redirect table could not be read
```

The packet lives under `/tmp`, so the rule cannot locate the repository and gives up. Two consequences:

- The rule's own contract — "A pass means the cited path and line exist; it never says the lines support the
  claim" — is unreachable for an out-of-tree packet, and `validate.sh` explicitly supports out-of-tree packets
  (it printed a `../../../../../tmp/...` repair path for this one, see F5).
- The one-word status `warn` is the same word the rule uses for a dead citation, so a caller cannot tell "I checked
  and found nothing wrong" from "I did not check". In a `--strict` run, where the doctrine is "a warning is advice
  that does not fail a run", a packet whose every citation is broken exits the same as a packet whose every
  citation is correct.

Evidence: `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/rules/check-source-tags.sh:31]` (the literal
`RULE_MESSAGE`), `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json:225]` (the rule
is registered with severity `warn`).
Verify: `bash validate.sh /tmp/specprobe.xtuwsC/base --strict --json` → `SOURCE_TAGS = warn` with the skip message.

### F4 — The closure gate's own failure on a scaffolded packet is a recomputable metadata drift, while the open acceptance criterion is only `info`

Type: **misalignment** (against AGENTS.md §4's "the acceptance criteria are the closure gate") · Severity **P2**
· Release: v4.0.0.0 · Confidence: high (ran it) · Finding type: misalignment

The baseline fixture — a Level 2 packet, 39 task checkboxes, `acceptance-criteria.md` present — returns
`passed: false` with `Errors: 1  Warnings: 3`. The one error is:

```
implementation-summary.md has stale Spec Folder metadata: 001-test-feature
```

and the packet also carries `CANONICAL_SAVE_PACKET_IDENTITY_NORMALIZED` drift
(`identity=scaffold/001-test-feature` vs `identity=001-test-feature`). Meanwhile the rule that the completion
contract names as the closure gate reports:

```
AC_CLOSURE = info | AC_CLOSURE: 0/1 criteria settled; 1 still open while the packet is in progress
AC_COVERAGE = pass | Acceptance coverage gate not active for this level or lifecycle state
```

Three observations, in order of confidence:

1. `AC_COVERAGE`'s "on by default" (the note's word) is true and vacuous at Level 2 Draft: the rule is registered
   and enabled, and it answers `pass` with "not active for this level or lifecycle state". A green gate that never
   evaluates anything is the pattern the note's own `_ac_enforce` comment argues against.
2. `AC_CLOSURE` at `info` does not fail a run, so 0/1 criteria settled coexists with a `--strict` verdict driven
   entirely by a stale `Spec Folder` row that `repair-derived.cjs` can rewrite mechanically. The failure a reader
   sees is the one a machine can fix; the failure that needs a human decision is silent.
3. The `Draft` qualifier is doing real work — I did not test a packet whose status is `Complete`, so I do not claim
   `AC_CLOSURE` never fails. The precise claim is the Draft-state one measured here.

Evidence: `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json:69]` (`AC_COVERAGE`),
`[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh:68]` (`--strict` in the help; the help's
"STRICT MODE" note at `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh:99]` is the strict
flag parse), `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/rules/check-ac-coverage.sh:6]` (the rule is
sourced by `validate.sh`, so it is a rule and not a separate tool).
Verify: `bash validate.sh /tmp/specprobe.xtuwsC/base --strict --json` → `passed: false` with one error whose text
is the `implementation-summary.md` metadata line, and `AC_CLOSURE` at `info`.

### F5 — The repair hint prints a five-level `../..` path for an out-of-tree packet

Type: **UX** · Severity **P2** · Release: v4.0.0.0 · Confidence: high (observed output) · Finding type: ux

The failing run closes with an actionable hint that is correct and unreadable at the same time:

```
Some of these are recomputable from the repository. Fix them with:
  node .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs --folder ../../../../../tmp/specprobe.xtuwsC/base --apply
```

Five `..` segments walk from the repo root to `/`, then back down into `/tmp`. The path resolves, so this is
cosmetic — but it is the one line a failing user is meant to paste, and it is produced whenever the target sits
outside the repository, which is exactly the case for a `mktemp` fixture or a CI checkout elsewhere. The same
relativization also means the hint is not portable to a different cwd.

Note on my own measurement: I first wrote `EXIT_BASE=$?` after a pipeline and captured `tail`'s status, not
`validate.sh`'s. The corrected measurement is `PIPESTATUS[0]` → **2**, which matches the documented
"2=validation error". The `0` I nearly reported was my bug, not the script's. Worth recording because it is the
same class of error as the tool's: a green-looking number from the wrong process.

Evidence: the hint is emitted by `validate.sh` at the fatal path
`[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh:68]` (help text:
`--folder` is the repair tool's flag) — the run itself is the evidence for the printed path.
Verify: `bash validate.sh "$(mktemp -d)/pkt" --strict` on any packet whose only errors are derived-metadata rules;
read the `--folder` argument in the closing hint.

### Ruled out this iteration

- **"The single `[SOURCE:]` skip means the packet has no research artifact to scan."** Rejected: `v1` *added*
  `research/research.md` and produced the byte-identical message, so the skip is environmental (out-of-tree),
  not artifact-conditional.
- **"Bare continuity words (`resume`) are a Gate 3 gap."** Rejected as a finding: row 8 returned `no_match`, which
  is the right answer under AGENTS.md §2 — "the answer holds for the ENTIRE session. A relaunch hop is the same
  session" — so re-asking on a bare `resume` would be the wrong behaviour. The resume triggers deliberately cover
  the loop commands and the named continuations (`/speckit:resume`, `resume the packet`, `continue iteration`), not
  the bare verb.
- **"The registry's 42 rules contradict the note's 'Forty rules are registered'."** Rejected: the note is the
  v4.0.0.0 count and `AC_CLOSURE`/`MEASURED_BEHAVIOR`-class rows were added later in the line. A moved count is not
  drift unless the note claims to be current; it does not.
- **"`--json` exit 2 means the JSON path is broken."** Rejected: exit 2 is the documented validation-error code and
  the payload parsed cleanly. My first parse read `result`/`rules`; the real shape is
  `{folder, level, engine, entries, summary, passed}`.

## Questions Answered

- **KQ1 — "…classify the same prompts as the Gate 3 text in AGENTS.md… and which prompt does it misclassify?"**
  Answered against the real export: 8 of 10 prompts conform; the misclassifying class is identified precisely —
  a write verb that precedes a read-only verb ("Edit the README and then review it.",
  "Fix the failing rule, then audit the packet."), caused by a forward-only span at
  `gate-3-classifier.ts:731`. The remaining disagreement with AGENTS.md is the bare-continuity case, where the
  classifier is right and the prose is silent.
- **KQ2 — "…does any rule pass on a packet it should fail?"** Answered for the three rules the v4.0.0.0 note names:
  `SCOPE_ADHERENCE` does not exist (F2), `AC_COVERAGE` passes without evaluating anything at Level 2 Draft (F4),
  `SOURCE_TAGS` reports `warn`+skipped outside the repo and therefore cannot distinguish a dead citation from a
  live one (F3). A fourth, `AC_CLOSURE`, is `info` at Draft. So yes — three named rules pass a packet they should
  judge, for three different reasons.

## Questions Remaining

- **Q6 (`/doctor:update` preview/rollback)** — unchanged, and now the oldest open item: only `check` has ever been
  executed. `align --dry-run`, `apply --dry-run`, `rollback --dry-run` and `compat --dry-run` are read but unrun.
- **Q7 (`create.sh` + level templates)** — still blocked: no preview mode exists, so "does the scaffold pass
  `--strict` without hand edits" cannot be tested by a read-only run. F4 adds a related datum without closing it:
  the one leftover scaffolded packet fails `--strict` on a `Spec Folder` metadata row that
  `repair-derived.cjs` rewrites, which is suggestive of a scaffold defect and not proof of one, because that
  packet was hand-probed after creation.
- **Residual from F1:** whether the order asymmetry also suppresses the `memory_save_match` / `resume_match`
  branches. The code returns those before the file-write branch, so the reading says no — but I only ran
  `save context` and `/speckit:resume 047`, not "review the packet and save context", which would test the same
  order axis for the memory branch.
- **Residual from F3:** whether the skip is triggered by the packet living outside the repository or by cwd being
  the repo root while the folder is `/tmp`. Both were true in my fixture; separating them needs a second fixture.
- **Residual from W1:** whether the 43 stale rows match the untracked docs one-for-one. I counted 566 untracked
  files and 43 stale documents but did not join the two lists.
- **Untouched:** Q3 freshness signal, Q4 stale-index gate, Q5 over-budget bind, Q8 doc drift across
  v4.0.0.13–v4.0.2.0, Q9 rules/options pairs, Q10 operator friction, Q11 sk-code/sk-doc conformance, Q12
  extensions (F5–F7 still cover only the classifier, the validate rules and the goal).

## Next Focus

Iteration 11 is the last one. Highest value left, in order: (1) run the four unrun `/doctor:update` modes in dry-run
and close Q6, which has now carried five iterations; (2) test the F1 order asymmetry on the memory-save and resume
branches so the bug's blast radius is bounded rather than inferred; (3) take the one decision the packet has been
circling — whether `SCOPE_ADHERENCE` is deleted from the note or implemented, since the note and the tree cannot
both be right and the run has no authority to settle it. Keep the discipline from this iteration: a verdict is only
a verdict if I ran the thing that produces it.

## SCOPE VIOLATIONS

None. All writes went to this iteration's two artifacts plus the append gateway; fixtures were created under
`mktemp -d` roots only; no repository file was edited, staged or committed, and no banned operation was executed.
The one clone I made was `cp -R specs/001-test-feature → /tmp/specprobe.xtuwsC/base`, which reads a repository path
and writes only under `/tmp`.
