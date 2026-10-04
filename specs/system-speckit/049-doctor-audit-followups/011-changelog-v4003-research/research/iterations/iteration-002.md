# Iteration 002

## Focus

Reconcile the two hook counts that the added changelog text could quote (`ENV-REFERENCE.md` section 5 versus `gates.tsv`), and settle the carried-forward attribution of the entry's "Trigger Lookups Handle No Hits" paragraph between `cli-jev/003/010`, the 048 audit and 049.

## Actions Taken

1. Read `ENV-REFERENCE.md` section 5 (lines 213-234) and counted the table rows: 14 variables.
2. Read `gates.tsv` (12 data rows: 10 persistable, 2 non-persistable) and `gate-config.sh` (lines 5-40) to map `speckit.hooks.<key>` keys to their `SPECKIT_*` variables and persistence semantics.
3. Verified commit `d1fe481584` ("docs(docs): list every git hook switch and describe the hooks as they run") touches `ENV-REFERENCE.md` (+20/-2) plus three READMEs. `rg -n -i 'switch|ENV-REFERENCE|gates\.tsv|speckit\.hooks'` over `.skilled/changelog/skilled/v4.0.0.3.md` returns zero matches, so the entry has no switch-registry text to correct; anything added must use the right counts.
4. Traced the entry's `--scoring-only` and generator `--check` wording to `specs/cli-jev/003-cli-jev-workflow-integration/010-trigger-index-search-fixes` (REQ-006 and related rows), and re-read 049/001's own records for how they name the regeneration owner.
5. Read the reducer's question matcher (`reduce-state.cjs`) and `deltas/iter-001.jsonl` to find why the strategy still shows `0/4` answered despite iteration 1 listing all four.

All work was read-only against the research surface; no scope violations occurred. No sub-agents were dispatched.

## Findings

### G1 (P1) - The 14 and the 12 describe different sets; each count must be quoted with its own role

`ENV-REFERENCE.md` section 5 has 14 table rows (lines 221-234). Exactly 12 of them are gate switches and match `gates.tsv`'s 12 data rows (lines 7-18) one-to-one:

- 10 `SPECKIT_SKIP_*` gates, all `persistable=yes` in `gates.tsv`: `COMMENT_HYGIENE`, `MIRROR_PARITY`, `CARD_SYNC`, `MCP_MUTATION_CLASS`, `ROUTE_REMINT`, `SPEC_REMINT` (pre-commit), `PREPARE_COMMIT_MSG` (prepare-commit-msg), `PREPUSH_SKILL_GATE`, `PREPUSH_ROUTE_GATE`, `PREPUSH_TRACK_GATE` (pre-push). These are the ones `speckit.hooks.<key>` can switch off, per `gates.tsv` lines 3-5 and `gate-config.sh` lines 5-14.
- 2 `SPECKIT_ALLOW_*` approvals, `persistable=no` in `gates.tsv` lines 17-18: `SPECKIT_ALLOW_REMOTE_PUSH` and `SPECKIT_ALLOW_MASS_DELETION`. They are per-push approvals and are never read from config, matching `ENV-REFERENCE.md` line 217 ("The `SPECKIT_ALLOW_*` approvals cannot be saved").

The two remaining section 5 rows are not gates: `SPECKIT_COMMIT_SPEC` (appends a `Spec:` trailer when the message has none, a message input rather than a bypass) and `SPECKIT_MASS_DELETION_THRESHOLD` (integer, default 100, the threshold knob the mass-deletion approval bypasses).

Changelog-safe wording: "12 switchable gates (10 saveable through `speckit.hooks.<key>`, 2 per-push approvals)" and, if section 5 is counted, "14 documented git-hook variables". "14 gates" or "12 hook variables" for the other set would each be wrong.

Sources: `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md` (lines 213-234), `.skilled/scripts/git-hooks/lib/gates.tsv` (lines 7-18), `.skilled/scripts/git-hooks/lib/gate-config.sh` (lines 5-40), commit `d1fe481584`.

### G2 (P1) - The trigger-lookup paragraph is `cli-jev/003/010` work; 049/001 only adds the doctor verdict and the content-staleness signal

Entry lines 134-136 describe `--scoring-only` (exit 1 with no rows is a clean no-hit) and the generator's `--check` option as a CI report-only comparison. Both shipped in `specs/cli-jev/003-cli-jev-workflow-integration/010-trigger-index-search-fixes` (REQ-006; files list names `lookup-trigger-index.mjs` and the `--check` mode). Neither came from the 048 audit or from 049.

049/001's additions are doctor-side and separate: phase 0 of `doctor-speckit-retrieval.yaml` now runs `generate-trigger-index.mjs --check --json` as its verdict, the `index_content_stale` signal judges content rather than mtime (mtime demoted to low-severity supporting evidence), `folder-token-fallback` reaches the generation bucket through the validator's own `packetFolderTokens` (43 phrases over 69 documents after regeneration), and the index plus three sidecars were regenerated. New entry text near that paragraph must credit the doctor usage to 049 and must not present the already-shipped `--scoring-only` flag as new.

Sources: `.skilled/changelog/skilled/v4.0.0.3.md` (lines 134-136), `specs/cli-jev/003-cli-jev-workflow-integration/010-trigger-index-search-fixes/spec.md` (line 86, REQ-006), `specs/system-speckit/049-doctor-audit-followups/001-trigger-index-freshness/implementation-summary.md` (lines 59, 67-68), `.../001-trigger-index-freshness/acceptance-criteria.md` (AC-003).

### G3 (P2) - Phase 001's own records name `/doctor:rebuild`, which phase 008 then deletes

The 049/001 documents name `/doctor:rebuild` as the regeneration owner and the byte-identical proof owner: `spec.md` line 23 ("regenerates ... through `/doctor:rebuild`") and line 25 ("Regeneration runs through `/doctor:rebuild`"), `plan.md` lines 32 and 81-82, and `acceptance-criteria.md` AC-001 ("regenerates ... through `/doctor:rebuild`"). Phase 008 deletes `/doctor:rebuild` entirely (workflow, presentation, bootstrap script, test, nine playbook scenarios, the v3.3 migration leg; commit `46ecac338c`) and the trigger index is regenerated by a direct `generate-trigger-index.mjs` run. The changelog must describe the regeneration by what ran (the generator), never present `/doctor:rebuild` as a live target, and if it cites phase 001 it should attribute the command name to the state before phase 008.

Sources: `specs/system-speckit/049-doctor-audit-followups/001-trigger-index-freshness/spec.md` (lines 23-25), `.../plan.md` (lines 32, 81-82), `.../acceptance-criteria.md` (line 57), `specs/system-speckit/049-doctor-audit-followups/008-doctor-ownership-split/implementation-summary.md`, commit `46ecac338c`.

### G4 (P3) - The strategy's `0/4` is a record-format miss, not missing answers

`reduce-state.cjs` parses each `- [ ] Q1: ...` bullet and keeps everything after the checkbox, so the question text it compares carries the `Q1:` prefix (lines 1839-1851); `normalizeText` only collapses whitespace (lines 117-119). Iteration 1's record (`deltas/iter-001.jsonl` line 1) listed all four answers without the `Qn:` prefix, so none matched. This iteration's record carries the prefix-exact texts; Q1 and Q3 are restated from iteration 1's recorded evidence, Q2 and Q4 also gain the evidence above.

Sources: `.skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs` (lines 117-119, 1839-1851), `specs/system-speckit/049-doctor-audit-followups/011-changelog-v4003-research/research/deltas/iter-001.jsonl` (line 1), `.../research/deep-research-strategy.md` (lines 63-66).

## Questions Answered

- **Q1** - Covered by iteration 1 (F2-F8): every phase 001-010 item changes what an operator runs or sees; the entry mentions only the adjacent trigger-lookup behavior, with the 049 doctor verdict absent. Restated here in matcher-exact form (G4).
- **Q2** - The 12-gate registry and its 10/2 persistence split are now pinned (G1); the `/doctor:git hooks` and standards surfaces remain as captured in iteration 1 F5.
- **Q3** - Covered by iteration 1 F9 (partial coverage; `9c99983374` and `d1fe481584` missing). Restated here in matcher-exact form (G4).
- **Q4** - The hook-count half is now exact (G1), the stale-name half is now backed by the phase 001 versus phase 008 evidence (G3), and the `--scoring-only` attribution is settled (G2).

## Questions Remaining

- The precise placement and wording of the added entry sections (at-a-glance bullets, section order, Upgrade Notes list) is still not fixed (carried forward).
- Whether the added text should note the `cli-jev/003/010` origin of `--scoring-only` inside the existing paragraph or leave that paragraph untouched and only add the doctor-side sentence (new, wording-level).

## Next Focus

Iteration 3: draft the exact entry edits with line anchors: header title/description/trigger phrases and the `> Also:` list, at-a-glance bullets, the new doctor/git-hooks section quoting "12 switchable gates (10 persistable, 2 per-push approvals)" and "14 documented git-hook variables", Repository Checks additions for `9c99983374` and `d1fe481584`, and the Upgrade Notes lines (doctor target moves, saved gate settings, `.sk-git/` ownership, first-run `record-base`, `--include-prerelease`, `/doctor:rebuild` removal).
