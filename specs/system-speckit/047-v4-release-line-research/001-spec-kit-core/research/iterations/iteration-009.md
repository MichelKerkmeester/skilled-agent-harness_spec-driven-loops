# Iteration 9 — v4.0.0.15 / v4.0.0.16 / v4.0.1.0 / v4.0.2.0 and the trigger-index `--check` contract

## Focus

Close the four releases that carried no finding yet in this cluster, and take the Q3 depth probe the prompt pack
asked for: run `generate-trigger-index.mjs --check` and two lookups, then say how staleness reaches Gate 1.
Gate 3 was pre-resolved; no gate was asked and no stop-for-yes occurred.

## Actions Taken

1. Pairwise path-limited diff stats (my first loop compared each tag against v4.0.0.14 and so produced cumulative
   numbers; the corrected pairs are below). Largest code deltas per release:
   - `v4.0.0.14..v4.0.0.15` → `runtime/lib/validation/orchestrator.ts` +331/−28,
     `runtime/cli/rules/check-measured-behavior.sh` +137, `runtime/cli/tests/draft-auto-repair.vitest.ts` +461,
     all four `templates/core/*.tmpl` rewritten, `create.sh` +74/−11.
   - `v4.0.0.15..v4.0.0.16` → `runtime/cli/spec-folder/nested-changelog.ts` +38/−5, `create.sh` **−3 only**.
   - `v4.0.0.16..v4.0.1.0` → `runtime/lib/continuity/decision-record-writer.ts` +895,
     `runtime/cli/continuity/match-decision-table.ts` +495, `ROUTER.md` +405,
     `manual-testing-playbook/plugins-and-hooks/decision-capture-live-conversation.md` +431.
   - `v4.0.1.0..v4.0.2.0` → `runtime/hooks/lib/history/{cli,navigator,pages}.ts` +576/+559/+489,
     `runtime/tests/history-lookup-cli.vitest.ts` +665, `runtime/tests/thin-continuity-record.vitest.ts` +194,
     `create.sh` +154/−12.
2. Read the Note sections for v4.0.0.15 (Spec Kit), v4.0.1.0 (decision capture), v4.0.2.0 (history + question tool).
3. Ran `generate-trigger-index.mjs --check` twice (once piped, once bare to capture the real exit status) and two
   `lookup-trigger-index.mjs --json --scoring-only` queries: a known phrase ("gate 3 spec folder question") and a
   phrase from a doc added after the last index build ("manual testing playbook decision capture live conversation").
4. Traced the MEASURED_BEHAVIOR rule from template anchor → registry row → orchestrator dispatch, and ran the rule
   script directly against two packets.
5. Read `create.sh` `refresh_track_root` / `is_declared_subtrack` / `subtrack_diagnostic` and the `--track` refusal
   block; read the v4.0.0.16 three-line `create.sh` deletion and the v4.0.2.0 `create.sh` addition.
6. Grepped `SKILL.md` + `references/` for the decision-capture off-switch and for `operatorDecisions`.

## Findings

### F1 — `--check` is red on a clean checkout, so it cannot be a gate — and nothing consumes it
Type: drift/improvement · Severity **P1** · Release: v4.0.0.15 · Confidence: high (ran it)

```
node .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs --check ; echo $?
→ trigger index is STALE or the corpus is untrusted
  documents scanned : 28685
  stale documents   : 43 (43 missing from the index)
  obsolete paths    : 0
→ EXIT=1
```

43 of 43 are *additions* ("stale  specs/…/research/deep-research-strategy.md (added: …; removed: none)") — every
document created since the index was last built, including this research packet's own `spec.md`, `tasks.md`,
`timeline.md` and `decision-record.md`. So the check is red on any branch that adds a packet, and red on the very
run directory doing the checking. The message vocabulary has one bucket for "a doc changed under the index" and
"a doc is new since the index": the summary line says "43 missing from the index" while the per-row word is
"stale". Gate 1 documents the lookup as "exit 1 with no rows is a clean no-hit" and no freshness gate exists, and
the lookup emits only two opaque hashes (`indexHash`, `manifestHash`) with no `stale` boolean — grepping
`stale` in the lookup script returns nothing. The check also prints, for the manifest mismatch:
"note: manifest hash differs … no lookup answer depends on it" — an assertion the check itself does not verify.

[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/normalize.mjs:16]
[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/normalize.mjs:103]

Verify: `node .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs --check; echo $?` on
a clean `main` → expect 1 with N>0 "missing from the index" rows.
Extension: split the verdict into `stale-changed` / `new-since-build` and exit 1 only for the first, or add a
`stale: true|false` field to the lookup JSON so Gate 1 can choose.

### F2 — `--build` churn: the index is rebuilt in every release at ~50k lines a time
Type: over-engineering · Severity **P2** · Release: v4.0.0.15 → v4.0.2.0 · Confidence: high (numstat read)

`runtime/data/trigger-index.json` is the single largest file in the path-limited diff of all four releases:
+47 952/−45 440 (v4.0.0.15), +49 505/−46 644 (v4.0.0.16), +59 675/−52 086 (v4.0.1.0), +54 271/−50 889
(v4.0.2.0). The index re-encodes every doc's phrases, so adding a handful of docs rewrites most of the file.
What breaks if it is left alone: nothing in the lookup — the build is deterministic from the corpus, and F1 shows
the corpus is already ahead of the index at every release boundary. Removing the committed index in favour of a
build-on-first-lookup would remove ~200k lines of review noise across this release line; the cost is a cold
start (the repo already carries `measure-cold-lookup.mjs` for exactly that number).

### F3 — The MEASURED_BEHAVIOR rule is wired, but running it directly reports a pass for a failing packet
Type: ux · Severity **P2** · Release: v4.0.0.15 · Confidence: high (ran it)

The rule is not dead: it has a registry row and the orchestrator dispatches `rules/*.sh` through `bash`.

[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json:239]
[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json:243]
[SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:439]
[SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:441]
[SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:269]

But the script only defines `run_measure_behavior_rule`-style functions and a `RULE_*` contract; executed
standalone it prints nothing and exits 0:

```
bash .skilled/…/runtime/cli/rules/check-measured-behavior.sh specs/001-test-feature ; echo $?
→ (no output) EXIT=0
```

while that packet's block is present but not filled — the state `check-measured-behavior.sh` exists to catch.
An author told "run the rule to see why strict failed" (which the v4.0.0.15 authoring card now encourages: one
strict run, fix everything, `[SOURCE: .skilled/changelog/skilled/v4.0.0.15.md:54]`) gets a green, silent script.
`MEASURED_BEHAVIOR` is `severity: warn` and the script's header says "This rule never reports fail", so it cannot
become an error either.
Verify: the command above against a packet whose `measured-behavior` block is empty.
Fix shape: add a `--rule-only` entrypoint (or a `case "${1:-}" in --self-check`) that prints `RULE_STATUS` and
exits non-zero on `warn` when invoked outside the sourcing contract.

### F4 — Every new packet starts with an empty measured-behavior block, so the warn is guaranteed at creation
Type: ux · Severity **P2** · Release: v4.0.0.15 · Confidence: medium (template read, rule logic read)

The block ships in the template and the scaffold copies it:

[SOURCE: .skilled/skills/system-spec-kit/templates/core/spec.md.tmpl:109]
[SOURCE: .skilled/skills/system-spec-kit/templates/core/spec.md.tmpl:36]
[SOURCE: specs/001-test-feature/spec.md:41]
[SOURCE: specs/system-speckit/047-v4-release-line-research/001-spec-kit-core/spec.md:61]

The stamp is `spec-core | v2.4`, which is exactly the `MEASURED_BEHAVIOR_MIN_MAJOR/MIN_MINOR` floor, so the rule
applies to every packet built from this template from its first second. A fenced placeholder line does not count
as filled (the rule excludes unfilled value tokens), so the packet warns until the author has measured something
that, by definition, they measure after writing the spec. That is a warn nobody can clear at creation time.
Verify: `create.sh` a scratch packet and grep the strict output for `MEASURED_BEHAVIOR` before editing anything.
Extension: scaffold the block with an `N/A: no behavior change` line for the levels where a measurement is not
expected, or gate the rule on `plan.md` existing (author has started).

### F5 — `create.sh` has no dry-run, so the Q7 claim is untestable without writing a packet
Type: improvement/ux · Severity **P2** · Release: v4.0.2.0 (surface) / present since v4.0.0.0 · Confidence: high

`create.sh --help` lists `--phase`, `--phases`, `--phase-names`, `--parent`, `--phase-parent`, `--path`,
`--track`, and no `--dry-run`/`--preview`. It is the one tool in this cluster whose entire job is to write, and the
v4.0.2.0 release added four more write paths to it (track-level and sub-track-level `graph-metadata.json`
refresh):

[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1011]
[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1029]
[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1113]

Consequence for this audit: Q7 ("do create.sh and the level templates produce a packet that passes
`validate.sh --strict` without hand edits") cannot be answered by running the tool in a read-only research run,
and cannot be answered by CI either, because there is no way to ask what it would write. The v4.0.0.15 note's own
upgrade advice is to hand a weaker model the authoring card, i.e. to make scaffolding reproducible — a preview
flag is what makes that checkable. `create.sh --track` refusal text is otherwise good (see R1).
Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh --help | grep -i dry` → no match.
Extension: `--dry-run` printing the folder path, the file list with byte counts, and the track metadata rows it
would refresh; the v4.0.0.15 create.sh refactor already isolates those steps.

### F6 — Decision capture's off-switch and runtime prerequisite live only in the release note
Type: drift · Severity **P2** · Release: v4.0.1.0 · Confidence: high (grepped)

`SKILL.md` and `references/memory/save-workflow.md` document the capability precisely — a `--full-auto` save writes
`operatorDecisions` into `decision-record.md`, creating it and stamping a missing level marker:

[SOURCE: .skilled/skills/system-spec-kit/SKILL.md:146]
[SOURCE: .skilled/skills/system-spec-kit/references/memory/save-workflow.md:278]

The note adds two operational facts that appear nowhere in the skill docs:
`SYSTEM_DECISION_CAPTURE_DISABLED=1` turns capture off, and a Claude Code session "may need `/hooks` approval or a
restart", plus the requirement to run one full-auto save per linked project to clear answers left in the old
shared folder.

[SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:114]
[SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:189]
[SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:190]

`grep -rn SYSTEM_DECISION_CAPTURE_DISABLED` over `SKILL.md` and `references/` returns nothing. So the one switch
that answers "why is my answer not in the decision record" is discoverable only by reading a changelog for an
older release. The environment-variables reference does not carry it either.
Verify: `grep -rn SYSTEM_DECISION_CAPTURE_DISABLED .skilled/skills/system-spec-kit/SKILL.md .skilled/skills/system-spec-kit/references/` → 0 hits.

### F7 — The v4.0.2.0 history lookup tells operators to run a build the shipped tree does not need
Type: drift · Severity **P2** · Release: v4.0.2.0 · Confidence: medium-high

The upgrade note says: "**To use the history lookup:** run `npm run build` in
`.skilled/skills/system-spec-kit/runtime`."
[SOURCE: .skilled/changelog/skilled/v4.0.2.0.md:230]
The compiled artifact already exists in the tree (`runtime/dist/hooks/lib/history/cli.js`, `cli.d.ts`,
`cli.js.map`), and the source lives at `runtime/hooks/lib/history/cli.ts`. So the step is not a user step — it is
a contributor step, presented under a heading that reads as setup. It also contradicts the repo's own guard:
`validate.sh` refuses to run when "compiled validation orchestrator is stale", i.e. the tree is supposed to arrive
compiled and fresh. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh:407]
Verify: `ls .skilled/skills/system-spec-kit/runtime/dist/hooks/lib/history/cli.js`.

### F8 — v4.0.0.16's whole spec-kit surface change is a 3-line deletion (release-shape observation)
Type: drift · Severity **P2** · Release: v4.0.0.16 · Confidence: high (diff read)

`git diff v4.0.0.15..v4.0.0.16 -- create.sh templates/` yields exactly three removed lines — the phase-context
`**Changelog**:` block that told a new phase child to refresh `../changelog/`. The note frames it as a behavior
fix ("`create.sh --phase` stops naming a changelog in a new phase child"), and the replacement routing is stated
in prose only. That is a correct fix: a scaffolded instruction that points at a folder the skill no longer owns is
exactly the drift the note describes. Nothing to repair; recorded so the release's spec-kit delta is not counted
as a surface change in later iterations.

## Ruled Out

**R1 — `create.sh` silently ignores an undeclared sub-track.** I expected the `>/dev/null` on
`is_declared_subtrack` [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1092] plus the
`|| return 0` in `refresh_track_root` [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1112] to
mean a packet gets created into a folder the tool considers invalid. Refuted: the `--track` guard runs first and
refuses outright, printing the diagnostic captured through `subtrack_diagnostic`
[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1096]
[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1439]. `refresh_track_root` is only reached on
the accepted path, so the silent skip is unreachable for a `--track` value and remains a defensive branch.
**R2 — "Gate 3" is unmatchable in the trigger index because `MIN_TOKEN_LENGTH = 2` discards the token `3`.** The
lookup really does discard it (`discardedTokens: [{reason: below-min-token-length, token: "3"}]`), but the query
still returned the gate-3 packet at rank 2 (`.…/048-gate-3-mutation-time-delivery/spec.md`, `query-containment`,
0.88), and the index does hold `gate 3` phrases ("claude gate 3 classifier", "codex gate 3 classifier"). No defect.

## Questions Answered

None. Both remaining questions were probed, not closed: Q6 (upgrade preview/rollback) was not run — only `check`
has been executed across three iterations — and Q7 is now blocked by F5 (no `--dry-run`), which is a finding in
its own right. `answeredQuestions` on this iteration's record is therefore empty.

## Questions Remaining

- **Q6** — `align`, `apply`, `rollback`, `compat` still unrun. Third iteration carrying this.
- **Q7** — blocked on F5: no preview mode exists, so "does the scaffold pass `--strict` without hand edits" can
  only be answered by writing a packet, which a read-only run may not do. If the next iteration runs it, it must
  be in a throwaway worktree, not this tree.
- **Q7 residual from iteration 5 closed:** `check-measured-behavior.sh` is the `MEASURED_BEHAVIOR` rule's source
  file and it is registered + dispatched (F3). Its fill-note comparison against sk-doc canon is still open.
- **New residual from F1:** whether any consumer (hook, CI job, resume YAML) ever reads the `--check` exit status.
  I grepped for `stale` in the lookup script only.
- **New residual from F6:** whether the four other runtimes' capture hooks are documented anywhere outside the
  manual-testing playbook added in v4.0.1.0 (+431 lines, unread).
- **New residual from F7:** whether `runtime/dist` is rebuilt at release time by CI or hand-committed; that decides
  whether F7 is misleading prose or a broken upgrade step.

## Next Focus

Iteration 10 should (a) finally execute one `/doctor:update` dry-run path end to end to close Q6, and (b) read the
`decision-record-writer.ts` (895 lines, the largest code addition in v4.0.1.0) against `save-workflow.md:278` to
test whether the documented `operatorDecisions` shape matches the writer's schema — that is the one claim from
v4.0.1.0 not yet tested with a command. Do not re-run `--check`; F1 is settled.
