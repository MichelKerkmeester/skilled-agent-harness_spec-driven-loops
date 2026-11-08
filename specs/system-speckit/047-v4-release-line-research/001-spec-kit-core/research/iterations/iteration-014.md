# Iteration 014 — Release-coverage and UX pass

## Focus

Two things the run had never done: attribute every v4 release that carries zero or one finding, and judge the *messages* the tools print rather than the rules behind them.

1. Release coverage for v4.0.0.4, v4.0.0.6, v4.0.0.7, v4.0.0.8, v4.0.0.9, v4.0.0.10 (the seven notes all point at `4d8f403355`, so tags cannot separate them — date windows and path-limited `git log` do).
2. UX by execution: `validate.sh --strict` on `/tmp` copies of a Level 1 packet and a phase-parent packet, and `lookup-trigger-index.mjs` under a typo flag, an empty prompt and an unknown flag.
3. No copy or duplicate claim without `ls -ld` on the parents and `git ls-files -s` on the path.

## Actions Taken

- Measured the gap rather than assuming it: the run's own delta stream carries release attribution for 24 pre-v4 rows and for v4.0.0.0/1/2/3/5/11/12/13/14/15/16/4.0.1.0/4.0.2.0, and **zero** rows for v4.0.0.4, .6, .7, .8, .9 and .10 — the six (plus .4, seven) notes that share one commit.
- Dated the notes: `v4.0.0.4.md` was added 2026-10-07, and `v4.0.0.6`–`v4.0.0.10` were all added in one commit at 2026-10-14 23:04 ("apply the fresh review of the split releases"), so the 0.6–0.10 window exists only as prose.
- Ran `git log --since=2026-10-06 --until=2026-10-16 --name-only -- .skilled/skills/system-spec-kit .skilled/commands/speckit` and filtered the trigger-index rebuilds. Exactly **one** spec-kit code change survives in that window: `2c761d5e36` touching `check-placeholders.sh` (+8 lines). Everything else in the window is `SKILL.md`, `README.md`, feature-catalog and changelog text, or the per-skill changelog entries themselves.
- Read that commit's diff: it makes the placeholder scan skip `research/` and `review/` [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/check-placeholders.sh:116] and strip markdown link labels.
- Grepped `v4.0.0.4.md` for `placeholder`, `research/`, `review/` and `scan`: no hit. The note records `create.sh`'s series-parent listing and Gate 3 option C instead [SOURCE: .skilled/changelog/skilled/v4.0.0.4.md:20].
- Read the `create.sh` series-parent hint end to end, including the Node emitter, the 14-day cutoff, the metadata reads and the failure exits [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1547].
- Ran the lookup three ways. Typo flag (`--bogus-flag`): `unknown argument: --bogus-flag`, exit 2, no usage text. Empty prompt: header block with `query :` blank, `candidates : 0 from 0 phrase(s)`, exit 1. Typo query (`validaton rulles strict`): **20 candidates, every one at `0.000`, exit 0**.
- Re-ran the same typo query with `--json --scoring-only`: `results 0`, exit 1. Same query, opposite verdict, decided by a flag.
- Copied `specs/anobel.com/001-animated-card-border` (declared level 1) and `specs/agents-md/016-doctor-agents-md` (three phase children) to `/tmp/l14ux/` and ran `validate.sh --strict` on each.
  - Level 1 copy: `RESULT: FAILED`, 2 errors — `GENERATED_METADATA_INTEGRITY` (1 violation) and `SPEC_DOC_INTEGRITY` (1 issue) — both the copy's own path change, followed by a repair hint telling the reader to run `repair-derived.cjs --folder ../../../../../tmp/l14ux/l1 --apply`.
  - Phase-parent copy: `RESULT: PASSED`, 1 warning — `SOURCE_TAGS` "check skipped: the repository or the redirect table could not be read".
- Confirmed `specs/001-test-feature` is still untracked (`git ls-files -s` empty) — the containment leftover, unchanged and untouched.

## Findings

### F1 — ux, P1: the trigger lookup answers "hit" to a query nothing matches, unless the caller passes `--scoring-only`

The score-0 filter is inside the `scoringOnly` branch only [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs:203][SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs:204]. The default path keeps those rows, sorts them and prints the top of the cap [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs:304]. The file header even states the reason the filter exists — "so score-0 rows never take a slot and then vanish" [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs:22] — which is an argument for filtering *before* the cap in **both** modes, not for gating the filter behind a flag.

Observed: `node .../lookup-trigger-index.mjs -- "validaton rulles strict"` prints 20 rows, each `0.000 partial`, and exits 0; the same query with `--json --scoring-only` prints `results []` and exits 1. A Gate 1 caller that omits the flag therefore cannot distinguish a typo from a match, and the rows it gets are alphabetically convenient changelogs rather than anything related to validation rules.

- Verify: `node .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs -- "validaton rulles strict"; echo "EXIT=$?"` → 20 rows at 0.000, `EXIT=0`.
- Release: pre-v4.0.0.0 (`7f1e0e8878`, 2026-09-27, introduced `scoringOnly` by `git log -S`); still live at v4.0.2.0. Confidence 0.95.

### F2 — ux, P1: `--strict` says PASSED while a rule reports that it could not run

`SOURCE_TAGS` degrades to `warn` and returns success when its helper cannot read the repository or redirect table [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/rules/check-source-tags.sh:31][SOURCE: .skilled/skills/system-spec-kit/runtime/cli/rules/check-source-tags.sh:33]. The `RESULT:` line is then derived from `report.passed` alone [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:1508], after a summary that already shows `Errors: 0  Warnings: 1` [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:1507].

Observed on the phase-parent copy: `! SOURCE_TAGS: [SOURCE:] check skipped: the repository or the redirect table could not be read`, then `Summary: Errors: 0  Warnings: 1`, then `RESULT: PASSED`. Every `[SOURCE: path:line]` tag in that packet was unchecked, and the gate went green. The same run shows the mirror defect on the other side: the Level 1 copy fails `GENERATED_METADATA_INTEGRITY` and `SPEC_DOC_INTEGRITY` purely because the copy sits outside the path its generated metadata names. So a packet validated anywhere but its tracked location either fails on rules the copy broke or passes with the citation rule disabled — there is no portable mode for validating a copy, a tarball or an export.

- Verify: `cp -R specs/agents-md/016-doctor-agents-md /tmp/pp && bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh /tmp/pp --strict | tail -4` → warning above `RESULT: PASSED`.
- Release: live at v4.0.2.0; the warn-on-unreadable-repo branch predates v4 and was not isolated to a release this iteration. Confidence 0.9.

### F3 — drift, P2: v4.0.0.4's only in-scope code change is missing from its own note

The note's spec-kit paragraph is about packets, `create.sh` and trigger phrases [SOURCE: .skilled/changelog/skilled/v4.0.0.4.md:20]. Its stated theme is "packets, rules and runtimes". The one validator behaviour that changed in the same window is that the placeholder scan now skips `research/` and `review/` [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/check-placeholders.sh:116][SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/check-placeholders.sh:117], and no v4.0.0.x note mentions it (`grep -n "placeholder\|research/" .skilled/changelog/skilled/v4.0.0.4.md` → no match).

Why it matters beyond bookkeeping: this exemption is what lets any deep-research packet pass the placeholder rule, so a reader who upgrades and finds a bracket no longer flagged has no note explaining that `research/` is now exempt by design. It is also the exact rule this run's own packet depends on.

- Verify: `git show 2c761d5e36 --stat` (one file, +8) and the empty grep above.
- Release: v4.0.0.4. Confidence 0.9.

### F4 — improvement, P2: the repair hint prints a path that only resolves from the cwd that produced it

The hint is written from the failing report [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:1509], and on the `/tmp` copy it printed `--folder ../../../../../tmp/l14ux/l1`. That string resolves from the repository root and from nowhere else: paste it into a shell at `/` or inside the packet and `repair-derived.cjs` receives a path that no longer names the packet. The hint exists precisely so the reader does not have to work out what to run; a relative path re-introduces the work for anyone who is not standing where the validator stood.

- Change: print the absolute folder the validator was given (the report already carries `report.folder` [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:1495]) instead of a cwd-relative rendering.
- Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh /tmp/l14ux/l1 --strict | tail -8` and read the `--folder` argument.
- Release: pre-v4, live at v4.0.2.0. Confidence 0.95.

### F5 — ux, P2: the two tools in this family that refuse an unknown flag both decline to say what is accepted

`create.sh` prints `Error: unknown option '$arg'` and stops [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:352]. The lookup prints `unknown argument: --bogus-flag` and exits 2 — observed, no usage block, even though `validate.sh`'s own usage text spells its flags out [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh:68]. A misspelling is the most likely reason to see that message, and the message names the mistake while withholding the fix, so the reader's next move is to open the script.

- Verify: `node .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs --bogus-flag -- x; echo "EXIT=$?"` → one line, `EXIT=2`.
- Release: the unknown-option refusal shipped in the v4.0.0.8 batch per its note; line-level attribution was not isolated this iteration. Confidence 0.85.

### F6 — ux, P2: the series-parent hint silently drops every packet that has no generated metadata

The note promises `create.sh` "lists the packets made in the same track in the last 14 days" [SOURCE: .skilled/changelog/skilled/v4.0.0.4.md:20]. The implementation reads `graph-metadata.json` and `description.json` inside a try, and on any miss takes `continue` [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1572]. A hand-authored sibling — the packet most likely to overlap new work, because nothing generated it — is invisible, and nothing says the list is partial. The hint's own closing sentence asks the reader to compare their new work against that list [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1584], which is unsafe advice when the list can be empty for a reason.

- Change: when `rows.length === 0` because every candidate was skipped rather than absent, say so; keep the metadata read to fill the date and description, not to decide membership.
- Verify: build a `/tmp/specs/<track>/001-x` with only `spec.md` next to a freshly `create.sh`-made sibling and run a scaffold in a copy — the hand-authored sibling never appears.
- Release: v4.0.0.4. Confidence 0.75 (read, not run).

## Release coverage: the seven thin releases

- **v4.0.0.4** — in scope twice: `create.sh` series-parent listing plus Gate 3 option C (in the note) and the placeholder-scan exemption (not in the note, F3). Also carries the `--mode`/`--json` refusals in `heal-spec-docs` and the two removals that exit 2 in favour of `upgrade-legacy`.
- **v4.0.0.6** — nothing in scope. The note's changes are review status lines, `@code`/`@debug`/`@orchestrate`, the sk-code surface order, drift-guard warning counts and `prevent-overengineering.md`; the path-limited log shows no `system-spec-kit` or `speckit` code in the window.
- **v4.0.0.7** — nothing in scope. Deep-loop mode retirement, skill-advisor path/verb handling, routing-drift CI. The only spec-kit artefacts in the window are `SKILL.md`, feature-catalog and changelog text.
- **v4.0.0.8** — one in-scope limb, by its own wording: "scripts refuse unknown options" reaches `create.sh` (F5). The rest is README Node-24 steps, Pi build messaging, packet-tool symlink refusal in archive/restore/heal/upgrade/repair, and hook read deadlines.
- **v4.0.0.9** — nothing in scope. Doc-version frontmatter, changelog `version:` keys, citation checks in PRs and the retired `sk-doc-template` comment are sk-doc and hook work; the window shows no validator code.
- **v4.0.0.10** — nothing in scope. sk-code surface adaptation, git-hook trust and Commit-Id stamping.
- The remaining release with one finding or fewer elsewhere in the run, **v4.0.0.5**, stays thin on purpose: it is the `heal-spec-docs`/`upgrade-legacy` release and this iteration did not re-open it.

## Questions Answered

None of the two strategy questions closed this iteration. Q7 was advanced but not answered: a Level 1 packet copied outside its tracked path fails `--strict` on generated-metadata rules (F2), so "does a scaffold pass strict without hand edits" cannot be settled by the copy method — it needs a scaffold created *and* validated inside one scratch repo. Q6 was not touched.

## Questions Remaining

- **Q6** — `align`, `apply`, `rollback`, `compat` still unrun. Seventh iteration carrying this. Nothing in this pass blocked it; the budget went to the coverage and UX work instead.
- **Q7** — the fill-note comparison against sk-doc canon is untouched, and the strict-pass half now has a method requirement (scratch repo, not a copy).
- **New from F2**: whether `report.passed` is meant to ignore warn-level skips by design, or whether any consumer (hook, CI, resume) treats `Warnings: 1` as failure. That decides whether F2 is "the gate lies" or "the gate is right and only the `RESULT:` line overstates".
- **New from F2**: whether the generated-metadata rules could compare against the *declared* packet id rather than the on-disk path, which is what makes copies fail.
- **New from F6**: whether `derived.created_at` is rewritten by `repair-derived.cjs --apply`, which would pull old packets into the 14-day window.
- **Carried**: Q3 freshness signal, Q4 stale-index gate (F1 sharpens it — a typo'd resume prompt now yields 20 noise rows with exit 0), Q5 over-budget bind, Q8 doc-drift remainder, Q10 operator friction (F1, F4, F5 are three concrete instances), Q11 sk-code/sk-doc conformance, Q12 extensions for trigger index, continuity and goal.

## Observation, not a finding

The phase-parent strict run printed `+ GRAPH_METADATA_CHILD_DRIFT: children_ids matches the on-disk phase children` and, in the same output, `! GRAPH_METADATA_CHILD_DRIFT: children_ids is missing on-disk phase children: 001-doctor-agents-md, 002-doctor-helper, 003-advisor-bridge-activation`. Both children were present in the copy. Either the rule runs once per folder and judges a child as if it were a parent, or the second invocation resolves children against a root the copy lacks. Two contradictory verdicts for one packet in one run is worth a dedicated probe before it becomes a finding. The same run also reported `Level: ... (Level 1)` for a three-child phase parent, which is mechanically right (the lean trio lives in the children) and therefore only noted.

## Next Focus

Iteration 15 should close the oldest debt rather than open a seventh front:

1. **Q6 by execution**, unchanged and now the only read-complete surface left: run `compat`, `align --dry-run`, `apply --dry-run` and `rollback --dry-run` against a `/tmp` clone and record exit codes and the mutated file set.
2. **F2's decision**: read what `report.passed` includes and whether any hook or CI job reads `Warnings:` — one function and one grep settle whether the gate lies or only the RESULT line does.
3. **The CHILD_DRIFT double verdict**: run the phase-parent copy with `SPECKIT_RULES=GRAPH_METADATA_CHILD_DRIFT` and `--verbose` to see how many times the rule fires and over which folder.
