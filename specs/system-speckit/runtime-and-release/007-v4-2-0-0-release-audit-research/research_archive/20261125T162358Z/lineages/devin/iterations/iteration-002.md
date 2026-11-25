# Iteration 2: Remaining Seven Sections and the DRIFT Candidates

## Focus

Map the remaining seven notes sections (Skill Advisor, Installs and Overlays, OpenCode, Browser Use, Skills and Worktrees, How It Was Checked, Upgrade Notes) to window commits, and verify the concrete DRIFT candidates surfaced in iteration 1. Selected interpretation: verify every claim that can be checked from code, docs or a fixture without running a suite, and mark the rest as unconfirmed rather than guessed. Deferred: packet coverage (Q2) and BUG hunting (Q4).

## Actions Taken

1. Verified the advisor lane weights, the `advisor_status` refusal flags, the doctor command ownership and target counts, the doctor install steps and the playbook scenario count.
2. Verified the overlay engine's layout rules, the 20-line `LAYOUT` cap, the sibling overlay rule, the `root/skilled` refusal, the `docs=` audit counter, the Python-cache rule and the `Next:` line.
3. Verified the OpenCode claims: the 2.3.2 pin in both the setup helper and the v2 battery workflow, the two-mode CLI, the 18-subcommand shim list, the `opencode`/`OPENCODE_BIN` resolution and the major-2-only family rule.
4. Verified the browser claims: the Bladebro v4.8.2 pin, the bdg 0.6.10 pin, the three-mode hub and the eight-hub compiled router.
5. Verified the dispatch safety claims: the `APPEND_FAILED` gateway code, the append-state-record working-directory refusal, the sandbox `/tmp` guard, the SIGHUP path and the script interface contract.
6. Checked every internal anchor link in the notes and every component the notes name as having its own release entry.
7. Re-checked the notes' test table against HEAD after the post-notes Python cut.

## Findings

1. **DRIFT (P2) — the Python scorer test rows in "How It Was Checked" conflict with each other and no longer describe HEAD.** The table reports `Advisor Python scorer tests | 130 passed, none failed` (notes line 811) and, in the same table, `Python scorer 138 passed, none failed on 368 shared cases` pinned to commit `46465394d97` (notes line 807). The two counts differ by eight. `73d98332fff` (2026-11-25), which landed after the notes' last edit, removed 273 lines and four test functions from `.skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py` (26 functions at `46465394d97`, 22 at HEAD), so neither count can be reproduced from HEAD. The exact HEAD test count is UNKNOWN without running the suite, which this lineage does not do. [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py] [SOURCE: .skilled/changelog/skilled/v4.2.0.0.md:811]

## Verified Claims (not findings)

Every claim below was checked against HEAD and held; they are recorded so synthesis does not re-open them.

- Advisor lane weights `0.42`, `0.28`, `0.13` and `0.12` match `LANE_DEFINITIONS` in `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lane-registry.ts:9-12`.
- `advisor_status` refuses the two removed flags with exit 64, covered by `.skilled/skills/system-skill-advisor/runtime/tests/cli-exit-taxonomy.vitest.ts:79`.
- The doctor brief credits `system-skilled-doctor` for 17 commands: `.skilled/commands/doctor/` holds exactly 17 `*.md` files.
- `/doctor:setup` runs six read-only legs (`doctor-setup.yaml:5-6`) and its target table lists 26 rows (`doctor-setup-presentation.txt`).
- `/doctor:install` prints five ordered steps (`doctor-install-presentation.txt` section 6).
- The playbook holds 66 doctor scenarios: 67 `*.md` under `doctor-commands/` minus its README.
- Overlay layout, the 20-line `LAYOUT` cap, the `root/skilled` refusal, `docs=`, the `__pycache__`/`.pyc`/`.pyo` rule and the `Next:` line all match `.skilled/commands/doctor/scripts/overlay-engine.cjs` and `.skilled/skills/system-skilled-doctor/references/overlays.md`.
- OpenCode is pinned at 2.3.2 in `opencode-setup.sh:28` and `.github/workflows/opencode-v2-battery.yml:79`; the setup helper accepts only `v2` and `check`; the shim lists exactly 18 subcommands (`skilled-loop-shell.sh:136-139`); resolution uses only `opencode` or `OPENCODE_BIN` and maps any major but 2 to `unknown` (`opencode-version.cjs:162-164,185-206`).
- Bladebro is pinned at v4.8.2 (`mcp-bladebro/INSTALL-GUIDE.md:3`) and bdg at 0.6.10 (`mcp-chrome-devtools/INSTALL-GUIDE.md:11`).
- `mcp-browser-use` is the eighth hub: eight `hub-router.json` files exist across `.skilled/skills/`.
- The gateway emits `APPEND_FAILED` (`append-mode-event.ts:193,568`); `append-state-record.cjs:128` refuses an escaping target; the sandbox guard's message is asserted in `setup-cp-sandbox-guard.vitest.ts:107`; SIGHUP is forwarded (`fanout-run.cjs:74,680,723`); `.skilled/skills/system-deep-loop/runtime/references/script-interface-contract.md` exists and documents the exit codes.
- Every internal anchor link in the notes resolves: 63 `#c-` links against 45 ids, zero missing, zero duplicate ids.
- Every component the notes name as having its own release entry has changelog commits in the window, including `deep-loop-runtime` at `.skilled/skills/system-deep-loop/runtime/changelog`.
- The `47 allowlisted` residue claim matches 47 entries in `lane-residue-allowlist.json`.
- `rebuild-native-modules.sh` writes the `.node-version-marker` at step 2.

## Ruled Out

- **Overlay layout drift.** The notes' layout, relayout, sibling-folder, audit and cache claims match the engine and its reference doc line for line.
- **OpenCode drift.** The major-2-only rule, the two-mode helper, the retired launcher names, the 18-subcommand shim and the v2 battery workflow all match HEAD.
- **Browser pin drift.** Bladebro v4.8.2, bdg 0.6.10, three modes and eight hubs all match.
- **Anchor or component-list drift.** All 63 internal links resolve, and every named component has a release entry.
- **Doctor count drift.** 17 commands, 26 setup rows, 6 advisor targets, 5 install steps and 66 scenarios all match.

## Dead Ends

- **Reconciling 2,450 and 3,557 advisor suite totals.** The rows are labelled differently ("Advisor runtime suite" vs "with the loop offers"), so they may be two suite configurations rather than a contradiction. No HEAD run exists in the packet to settle it; recorded as an observation, not a finding.
- **Running the advisor or deep-loop suites to get HEAD counts.** Out of scope: a suite run writes test artifacts outside the lineage directory, which the dispatch forbids.

## Edge Cases

- Ambiguous input: "DRIFT" was applied only where HEAD contradicts a claim. An unpinned number that cannot be checked (2,450 vs 3,557) was recorded as an observation, not a finding.
- Contradictory evidence: the two Python scorer counts conflict; the finding states both values and marks the HEAD value UNKNOWN.
- Missing dependencies: none.
- Partial success: none; every planned check ran.

## Sources Consulted

- `.skilled/changelog/skilled/v4.2.0.0.md` lines 424-926
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lane-registry.ts:9-12`
- `.skilled/skills/system-skill-advisor/runtime/tests/cli-exit-taxonomy.vitest.ts:79`
- `.skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py`
- `.skilled/commands/doctor/` (17 `*.md`), `.skilled/commands/doctor/assets/doctor-setup.yaml`, `doctor-setup-presentation.txt`, `doctor-install-presentation.txt`
- `.skilled/skills/system-skilled-doctor/manual-testing-playbook/doctor-commands/` (67 `*.md` including README)
- `.skilled/commands/doctor/scripts/overlay-engine.cjs`, `.skilled/skills/system-skilled-doctor/references/overlays.md`
- `.skilled/skills/cli-external-orchestration/cli-opencode/scripts/opencode-setup.sh:28,300-340`
- `.github/workflows/opencode-v2-battery.yml:79`
- `.skilled/bin/skilled-loop-shell.sh:136-139`
- `.skilled/skills/system-deep-loop/runtime/scripts/opencode-version.cjs:162-164,185-206`
- `.skilled/skills/mcp-browser-use/mcp-bladebro/INSTALL-GUIDE.md:3`
- `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/INSTALL-GUIDE.md:11`
- `.skilled/skills/system-deep-loop/runtime/lib/mode-append-gateway/append-mode-event.ts:193,568`
- `.skilled/skills/system-deep-loop/runtime/scripts/append-state-record.cjs:128`
- `.skilled/skills/system-deep-loop/runtime/tests/unit/setup-cp-sandbox-guard.vitest.ts:107`
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:74,680,723`
- `.skilled/skills/system-deep-loop/runtime/references/script-interface-contract.md`
- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/lane-residue-allowlist.json` (47 entries)
- `.skilled/skills/system-spec-kit/runtime/cli/setup/rebuild-native-modules.sh:31-35`
- `.skilled/commands/deep/research.md:108,118`
- `.skilled/commands/doctor/scripts/release-update.cjs:283`

## Assessment

- New information ratio: 0.50
- Questions addressed: Q1 (the remaining seven sections mapped), Q3 (partially: one DRIFT confirmed, several candidates ruled out)
- Questions answered: none in full

## Reflection

- What worked and why: checking counts against filesystem facts (17 doctor commands, 26 target rows, 66 scenarios, 47 allowlist entries, eight hub routers, 18 subcommands) turned a large "unverifiable" surface into a short list of genuinely open numbers. Reading the notes' own last-edit commit first made the post-notes Python cut visible as the cause of the stale test rows.
- What did not work and why: the two advisor suite totals cannot be reconciled from files, because a test count is a run artifact and no run record for HEAD exists in the packet. Trying harder on that number would have consumed the budget without a citable answer.
- What I would do differently: for numeric claims, check first whether the packet holds a run record; when it does not, record UNKNOWN immediately instead of probing the code for a derivable count.

## Recommended Next Focus

Work Q2: check the 21 recent packets against the notes' "Spec folders (10)" list and their implementation summaries, starting with the twelve unlisted packets, and record which shipped user-visible work with no note coverage.
