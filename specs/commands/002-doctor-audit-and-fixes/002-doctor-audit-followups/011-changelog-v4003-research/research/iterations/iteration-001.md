# Iteration 001

## Focus

Map the 049 doctor phases 001-010 and the git-hook gate surfaces against `.skilled/changelog/skilled/v4.0.0.3.md` to separate missing items from items stated wrongly or made stale. Questions Q1-Q4 of the strategy.

## Actions Taken

1. Read all 188 lines of the v4.0.0.3 entry and `.skilled/changelog/skilled/README.md` (placement rules; the v4.0.0.3 tag does not exist yet, so the entry is still open for content).
2. Read the 049 parent `spec.md` and each child `implementation-summary.md` (001-011), plus the phase map for `specs/sk-git/032-template-driven-message-enforcement` and the bodies of its children 001-003.
3. Read the hook-gate surfaces: `.skilled/scripts/git-hooks/lib/gates.tsv` (12 rows) and `gate-config.sh`; listed the live doctor command files under `.skilled/commands/doctor/`.
4. Mapped the four named sk-git commits (`e5b1ea84c7`, `9c99983374`, `d1fe481584`, `f7316afc6a`) to child folders and read their changed-file stats; listed the doctor/hook commit log on this branch.
5. Swept v4.0.0.0 through v4.0.0.3 for `doctor:*`, `/doctor:rebuild`, `/doctor:speckit` and fable-mode tokens to test the "stale reference" hypothesis.

All work was read-only against the research surface; no scope violations occurred. No sub-agents were dispatched.

## Findings

### F1 (P1) - The entry has zero coverage of the 049 doctor work

A token sweep of the entry for `doctor`, `rebuild`, `fable`, `hooks`, `gate` returns no mention of any doctor command, `/doctor:git`, hook-gate settings or `.sk-git/` overrides. The entry's scope (`> Also:` list, lines 18-20) names only `sk-communication/007`, `sk-git/032` and `system-deep-loop/039`. The whole 049 surface - phases 001-010, committed on this branch between `26aa00bb2a` and `f4485249ed` - is absent. The entry needs a doctor/git-hooks section plus at-a-glance bullets, and the header's spec-folder list needs `specs/system-speckit/049-doctor-audit-followups` (predecessor `048-doctor-command-audit`).

Sources: `.skilled/changelog/skilled/v4.0.0.3.md` (lines 18-20, whole file), `specs/system-speckit/049-doctor-audit-followups/spec.md`, `.skilled/changelog/skilled/README.md`.

### F2 (P1) - Trigger-index freshness (phase 001) is only half-covered by "Trigger Lookups Handle No Hits"

The entry does cover `--scoring-only` and the generator's `--check` option as a CI report (line 136). What it omits is the doctor-side change: the retrieval doctor's phase 0 now runs `generate-trigger-index.mjs --check --json` as its verdict, a new `index_content_stale` signal judges staleness by content instead of mtime (mtime demoted to low-severity supporting evidence), the generator labels folder-echo phrases through the validator's own `packetFolderTokens` so `folder-token-fallback` is counted (43 phrases over 69 documents), the committed index was regenerated over 23,056 documents with its three sidecars, and `retrieval-conventions.md` observations were re-run at 15.2.0.

Sources: `specs/system-speckit/049-doctor-audit-followups/001-trigger-index-freshness/implementation-summary.md`, `.skilled/commands/doctor/assets/doctor-speckit-retrieval.yaml`, `.skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs`, `.skilled/changelog/skilled/v4.0.0.3.md` (line 136).

### F3 (P1) - `/doctor:update` release-updater changes (phases 002, 005, 006) are missing entirely

The entry says nothing about the release updater. Missing from phases 002/005/006: a `generated` file class with one content rule for the hybrid `graph-metadata.json` (only a `derived`-block-only change counts as generated); `record-base` writing `.skilled/release/base.json` and `check` reporting `baseRecording`; `--include-prerelease` with numeric segment ordering; alignment-free `apply` that plans from the current check, writes only update and new units, re-reads each file under the lock, and records `plan.json`/`rollback.json` in a run directory; refusal of a decisions file with no alignment run; the six commit-verified fixes from phase 006 (`eb315be211` apply only fully decided units plus lock owner/stale recovery and `unlock`, `eaa4b79d26` copied-tree base/remote and `--trust-release`, `b4e02411d3` plan-digest binding plus routed rollback/record-base with approval gates, `f67263c396` rename linking and an engine/router/workflow contract test); the 26 research findings behind them; and the rejected `provenance_fingerprint` pre-filter (ADR-003).

Sources: `specs/system-speckit/049-doctor-audit-followups/002-release-update-customization-signals/implementation-summary.md`, `.../005-doctor-update-research/implementation-summary.md`, `.../006-doctor-update-fixes/implementation-summary.md`, `.skilled/commands/doctor/scripts/release-update.cjs`.

### F4 (P1) - Doctor ownership split (phase 008) is missing, and it retires names the entry must not present as live

Missing: `/doctor:skill-advisor <target>` (with `tune` as the old `skill-advisor` target and new `rebuild` backing up and restoring `skill-graph.sqlite`), `/doctor:deep-loop` and `/doctor:runtime-mirrors` as one-owner routers; `/doctor:speckit` reduced to retrieval with no target and a moved-target notice for old target names; route-validate's command-owner rule B3. Deleted: `/doctor:rebuild` (workflow, presentation, bootstrap script, test, nine playbook scenarios, v3.3 migration leg), the fable-mode workflow/script/test and the fable metrics module, with the trigger index now regenerated by a direct `generate-trigger-index.mjs` run and the deep-loop workflow no longer recommending `/doctor:rebuild`. Commit `46ecac338c`.

Sources: `specs/system-speckit/049-doctor-audit-followups/008-doctor-ownership-split/implementation-summary.md`, `.skilled/commands/doctor/_routes.yaml`, commit `46ecac338c`.

### F5 (P1) - Saved hook gate settings and `/doctor:git` (phase 009) are missing

The entry has no mention of hook switches or `/doctor:git`. Missing detail to capture: `lib/gates.tsv` lists 12 switchable gates (10 persistable, 2 non-persistable per-push approvals) with hook, key, bypass variable, persistable flag and description; `lib/gate-config.sh` runs in `pre-commit`, `prepare-commit-msg` and `pre-push` and turns `speckit.hooks.<key>` set to `off|false|no|0` in local or global config into the gate's existing `SPECKIT_SKIP_*` variable for that run, printing one notice line; `git -c` and `GIT_CONFIG_*` values are ignored (scope `command`); only a trusted toolchain repository reads settings. `/doctor:git hooks` lists every gate with local/global/effective value and hook install state and edits one gate after approval; `/doctor:git standards` copies the shipped sk-git templates into `.sk-git/` once without overwriting, edits or removes a rules-block setting or a kind's rules section, rechecks with sk-git's own shape check, reports template prose still stating an old rule and offers a fix; every change waits for approval and `--dry-run` writes nothing. A 25-case gate test and 16-case script tests exist. Commit `e3626413cd`.

Sources: `specs/system-speckit/049-doctor-audit-followups/009-doctor-git/implementation-summary.md`, `.skilled/scripts/git-hooks/lib/gates.tsv`, `.skilled/scripts/git-hooks/lib/gate-config.sh`, `.skilled/commands/doctor/git.md`, commit `e3626413cd`.

### F6 (P2) - Mandatory router input gates (phase 010) are missing

`/doctor:skill-advisor` and `/doctor:mcp` now carry the same mandatory target gate as `/doctor:git`: with no target in the arguments each shows its presentation menu and waits, and neither infers a target from the conversation or repository. The same phase exempted commands from the array-format `allowed-tools` rule in `extract_structure.py`. Commit `f4485249ed`.

Sources: `specs/system-speckit/049-doctor-audit-followups/010-doctor-router-gates/implementation-summary.md`, `.skilled/commands/doctor/skill-advisor.md`, `.skilled/commands/doctor/mcp.md`, commit `f4485249ed`.

### F7 (P2) - Doctor gates/drift and script conformance (phases 003, 004) are missing

Missing: a guard-owned `mcp-mutation-class-manifest.yaml` so narrowing an install workflow cannot shrink coverage; `route-validate` assertion L1 (every route script invocation must be invoked by its workflow YAML; B3 comes in phase 008); the four scripts that reported PASS on real drift fixed against false PASS and crashes; the hub-contract check now comparing 21 commands; the mutation-class guard at 21 rows where there were 7; `mcp-doctor.sh --fix` removed because both MCP workflows forbid it; and one runner, `.skilled/commands/doctor/scripts/tests/run-all.sh`, wired into `.github/workflows/spec-kit-check.yml`. Commit `cc2d4ea5f2`.

Sources: `specs/system-speckit/049-doctor-audit-followups/003-doctor-gates-and-drift/implementation-summary.md`, `.../004-doctor-scripts-conformance/implementation-summary.md`, `.skilled/commands/doctor/scripts/tests/run-all.sh`, commit `cc2d4ea5f2`.

### F8 (P2) - Speckit router contract drift (phase 007) is missing

`command-contract.schema.json` gained a `workflow` purpose and an optional `commands` list on asset and execution-target entries; `command-contract.json` now names one shared workflow for `/speckit:plan`, `/speckit:implement` and `/speckit:complete` while `/speckit:resume` keeps its auto/confirm pair; `generate-command-routers.cjs` applies an asset only to the routers its `commands` list names. Commit `119c4ffb07`.

Sources: `specs/system-speckit/049-doctor-audit-followups/007-speckit-router-contract-drift/implementation-summary.md`, `.skilled/skills/sk-doc/sk-create-command/assets/command-contract.json`, commit `119c4ffb07`.

### F9 (P2) - sk-git/032 hook hardening is only partially covered

Covered by the entry: `f7316afc6a` ("run a linked worktree's own validator") maps to the entry's "Worktrees Use Their Own Validator" paragraph, and one sentence of `e5b1ea84c7` appears there too ("Any other repository still never runs its own code at commit time"). Missing or thinner than what shipped: `9c99983374` (a staged file whose content cannot be read now blocks, except for a submodule entry, and the pre-commit temp directory is removed on any exit) has no counterpart; `d1fe481584` (14 hook switches added to `ENV-REFERENCE.md` section 5, and hook READMEs corrected - pre-push warns rather than blocks, checks only the commits a push adds, bare `SPECKIT_ALLOW_REMOTE_PUSH=1` cannot create a branch) has none either; `e5b1ea84c7`'s mechanism (a repository runs its own hooks only when it shares a git common dir with the installed checkout, or sets `skilled.trustRepoHooks=true`) is not stated; and 032/001's other fixes (push range checks only added commits, Commit-Id owner/rebased-copy rule, `git -c skgit.contractDir` and `GIT_CONFIG_*` no longer disabling the message contract, prepare-commit-msg stripping only `Co-Authored-By:`/`Claude-Session:` lines) are absent.

Sources: `specs/sk-git/032-template-driven-message-enforcement/001-git-hook-review-fixes/implementation-summary.md`, `.../003-hook-docs-and-standards-alignment/implementation-summary.md`, commit stats for `e5b1ea84c7`, `9c99983374`, `d1fe481584`, `f7316afc6a`, `.skilled/scripts/git-hooks/README.md`, `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md`.

### F10 (P2) - No stale statements exist yet; staleness is a risk for the text still to be written

An `rg` sweep finds no `/doctor:rebuild`, `/doctor:speckit`, `/doctor:skill-advisor` or `fable` token anywhere in v4.0.0.0-v4.0.0.3. So nothing in the entry needs correcting today. What must change is the future text: it must use the post-049 names ("rebuild" lives at `/doctor:skill-advisor rebuild`; `/doctor:speckit` takes no target; fable-mode is removed), and Upgrade Notes must add the migration lines (doctor target moves, saved gate settings, `.sk-git/` ownership, first-run `record-base`, `--include-prerelease`). The entry's adjacent hook statements remain true but incomplete rather than wrong.

Sources: `.skilled/changelog/skilled/v4.0.0.3.md`, `.skilled/changelog/skilled/v4.0.0.2.md`, `.skilled/changelog/skilled/v4.0.0.1.md`, `.skilled/changelog/skilled/v4.0.0.0.md` (sweep).

### F11 (P2) - Entry metadata and spec-folder list need the 049 packet

The title ("Stronger Repository Rules, Clearer Routing and Plain Language"), the description, and the four trigger phrases do not cover doctor commands or git-hook settings; the `> Also:` list names three packets and omits `049-doctor-audit-followups`. Phase 006 already modified `.skilled/changelog/skilled/README.md` to name the untagged v4.0.0.3 entry, so the entry is still open for added content.

Sources: `.skilled/changelog/skilled/v4.0.0.3.md` (lines 1-20), `.skilled/changelog/skilled/README.md`, `specs/system-speckit/049-doctor-audit-followups/006-doctor-update-fixes/implementation-summary.md`.

## Questions Answered

- **Q1** - Every phase 001-010 item listed in F2-F8 changes what an operator runs or sees: the doctor's verdict and signals (F2), the updater engine and recovery actions (F3), the command surface itself including deleted `/doctor:rebuild` and fable-mode (F4, F6), the new `/doctor:git` (F5), the script/runner and route checks (F7), the router contract (F8). The entry already mentions only one adjacent item, the trigger lookup's `--scoring-only`/`--check` behavior (F1, F2); all doctor-named items are unmentioned.
- **Q2** - Captured in F5: the 12-row `gates.tsv` registry, `speckit.hooks.<key>` semantics (`off|false|no|0`, command scope ignored, trusted repo only, one notice line), the hooks/standards targets of `/doctor:git`, and the `.sk-git/` copy-once + shape-recheck behavior of `git-standards.cjs`.
- **Q3** - Captured in F9: `f7316afc6a` is covered by the worktree-validator paragraph; `e5b1ea84c7` is covered in one sentence that omits its mechanism; `9c99983374` and `d1fe481584` are missing; 032/001's remaining fixes are missing.
- **Q4** - Captured in F10: no statement is wrong or stale today (sweep of v4.0.0.0-v4.0.0.3); the risk is that new text must use the post-049 names, and Upgrade Notes must add the doctor-target migration, gate-setting, `.sk-git/` and `/doctor:update` first-run lines. Hook switch names/counts: the entry currently quotes none, so nothing is wrong, but any future mention must match `gates.tsv`'s 12 gates and ENV-REFERENCE's 14 switches.

## Questions Remaining

- (New, self-owned) The entry's "Trigger Lookups Handle No Hits" paragraph mixes 048-era `--scoring-only` work with 049/001's doctor verdict. Iteration 2 should attribute items correctly between the 048 audit packet and 049 so the added text does not credit the wrong phase.
- (New, self-owned) The precise placement and wording of the added entry sections (at-a-glance bullets, section order, Upgrade Notes list) is not yet fixed.
- (New, self-owned) `ENV-REFERENCE.md` section 5 lists 14 hook switches while `gates.tsv` carries 12 gate rows; iteration 2 should confirm the two counts describe different sets (whole-hook kill switches vs switchable gates) so no count is quoted wrongly.

## Next Focus

Iteration 2: (a) read `specs/system-speckit/048-doctor-command-audit` summaries to attribute the trigger-index items between 048 and 049; (b) draft the exact entry edits (section placement, at-a-glance bullets, Upgrade Notes wording) with line-anchored citations; (c) reconcile the 14-switch vs 12-gate counts. No scope violations to report.
