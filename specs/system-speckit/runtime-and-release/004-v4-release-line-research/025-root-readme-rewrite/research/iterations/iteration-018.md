# Iteration 18: The Last Unmeasured Numbers a Rewrite Would Publish

## Focus

All five key questions are answered and strategy §11 reads "[All tracked questions are resolved]", so no dispatch focus was supplied. The live follow-ups were the two hand-offs iteration 17 left open: the command-surface statement (resolved in that iteration) and the synthesis fold (workflow-owned, outside this dispatch's write scope).

This iteration therefore took the narrowest remaining evidence-backed target: the numeric claims in `README.md` that no iteration had measured against an oracle. Iteration 6's Q4 audit left "42 rules" explicitly unverified, and two further counts in the same document — the 10 repo-rule files and the "4 levels" taxonomy — had never been counted at all. A rewrite inherits all three the moment it restates them.

Deferred alternatives: a broad Q4 re-audit (blocked in strategy §9 since iteration 10), an independent re-count of the 14 skills and 14 templates (blocked in iterations 6, 11 and 14), and a full read of `INSTALL-SKILLED.md` (blocked in iteration 12).

## Actions Taken

1. Read `deep-research-config.json`, the 42-line `deep-research-state.jsonl` (17 iteration records plus iteration_start rows), `deep-research-strategy.md` and `iteration-017.md`.
2. Swept `README.md` for every `N <noun>` count claim in one grep, producing the test set of numbers a rewrite could publish.
3. Listed `.skilled/repo-rules/` and counted its markdown files.
4. Followed the `VALIDATOR_REGISTRY_JSON` assignment in `validate.sh` to the registry and counted its rule objects with `jq`.
5. Re-ran the depth-banded `git ls-files` count over `.skilled/commands` at `NF==4`, with a per-group breakdown, as an independent reproduction of iteration 17's 44.
6. Grepped `system-spec-kit` for level definitions and for corroborating "four levels" prose.
7. Verified every cited line number before writing this file.

## Findings

### F1 (P2) — "42 rules" verifies against the registry, closing the last unverified count

`README.md:403` says "`validate.sh` runs 42 rules", and `README.md:153` repeats "42 rules" in the architecture diagram. Iteration 6 recorded the number as unverified because a grep over `runtime/cli/rules` returned 36 loose matches and no registry. The registry is reachable through the script's own pointer: `validate.sh:20` declares `VALIDATOR_REGISTRY_JSON="$SCRIPT_DIR/../lib/validator-registry.json"`, and that file is a JSON array of exactly 42 objects, each carrying a `rule_id`, `script_path`, `severity` and `category`. The first entry is `FILE_EXISTS` with `script_path` `rules/check-files.sh`. `jq '[.. | objects | select(has("rule_id"))] | length'` returns 42. The claim is correct and now has a mechanical oracle. [SOURCE: README.md:403] [SOURCE: README.md:153] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh:20] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json:3]

### F2 (P2) — "10 rule files in `.skilled/repo-rules/`" is exact

`README.md:452` states that Gates 5 and 6 load the 10 rule files in `.skilled/repo-rules/`. The directory holds exactly ten markdown files: `blast-radius.md`, `communication-handoff.md`, `communication.md`, `delegation-and-orchestration.md`, `evidence-and-proof.md`, `prevent-overengineering.md`, `root-cause-and-debugging.md`, `scope-discipline.md`, `skill-hub-routing.md` and `uncertainty-and-honesty.md`. Both reply rules the sentence names as Gate 6's are present. The count and the naming are accurate. [SOURCE: README.md:452] [SOURCE: .skilled/repo-rules/scope-discipline.md:1]

### F3 (P2) — "4 levels" is accurate for documentation levels but the phrase collides with validation levels

`README.md:153` renders "4 levels - template set - 42 rules". `quick-reference.md` defines four named documentation levels: Level 1 Baseline (`:72`), Level 2 Verification (`:78`), Level 3 Full Documentation (`:84`) and Level 3+ Extended Documentation (`:90`). `system-spec-kit/README.md:69` corroborates the same set as "four levels matched to task complexity, from the Level 1 baseline up to the Level 3+ governance set". So the number is right.

The phrasing is the risk, not the count. The progressive-validation catalog uses "Level 4" for a different axis — validation verbosity — so a reader who follows a "Level 4" hit lands on the wrong taxonomy. A rewrite should spell the set as "four documentation levels (1, 2, 3, 3+)" rather than "4 levels". [SOURCE: README.md:153] [SOURCE: .skilled/skills/system-spec-kit/references/workflows/quick-reference.md:72] [SOURCE: .skilled/skills/system-spec-kit/references/workflows/quick-reference.md:90] [SOURCE: .skilled/skills/system-spec-kit/README.md:69]

### F4 (P2, confirmation) — The 44-command depth-band count reproduces independently

`git ls-files .skilled/commands` at `NF==4` returns 49 entries, of which 44 are markdown command documents: doctor 17, create 13, speckit 8, design 3, deep 2, prompt 1. This reproduces iteration 17's F1 exactly on a fresh call, so the count is stable rather than a one-pass artefact. The consequence for the rewrite is unchanged: `README.md:86`'s "45 command entry points" is the correct total for the canonical-plus-`/goal-opencode` scope, while `README.md:1174`'s "43 in six groups plus two utilities" is the wrong partition of that same total. [SOURCE: README.md:86] [SOURCE: README.md:1174]

## Questions Answered

None newly. Q1-Q5 were answered in iterations 1-8 and remain answered; this iteration closes the last numeric claim the packet described as unverified.

## Questions Remaining

None tracked. Two hand-offs for the rewrite owner:

- Publish "44 canonical commands in six groups" plus the authored runtime commands, never "43 in six groups plus two utilities".
- Write "four documentation levels (1, 2, 3, 3+)", not "4 levels", to avoid collision with validation verbosity levels.

## Ruled Out

- **A broad Q4 re-audit.** Blocked in strategy §9 since iteration 10; this iteration measured only claims with no prior oracle.
- **An independent re-count of the 14 skills and 14 templates.** Blocked in iterations 6, 11 and 14, and untouched here.
- **Reading `INSTALL-SKILLED.md` in full.** Blocked in iteration 12; nothing in this iteration's claim set depends on it.
- **Deriving the command count from a recursive markdown glob.** Blocked in iterations 16-17; the depth band has to be applied before the count means anything.

## Dead Ends

- **Counting rules from `references/validation/validation-rules.md`.** The doc's §2 table documents 16 rules, so it understates the registry by 26. It is a reader's guide, not the registry. (Established in iteration 8; re-confirmed here as the reason the registry is the oracle.)
- **Grepping `runtime/cli/rules` for quoted uppercase rule ids.** Returns loose matches over `check-*.sh` entry points and `.cjs` helpers, not a rule count. This is the dead end that left "42 rules" unverified since iteration 6.
- **`NF==3` as the command depth band.** Returns 1 (`README.txt`) because group command documents sit at `NF==4`.

## Edge Cases

- Ambiguous input: no dispatch focus was supplied. The selected interpretation is recorded in Focus, with the blocked alternatives listed under Ruled Out.
- Contradictory evidence: none new. The command-partition contradiction is re-cited, not re-resolved.
- Missing dependencies: none. The registry was reachable through the variable `validate.sh` itself declares.
- Partial success: none for this iteration's evidence. The synthesis update remains blocked by write scope and is recorded under SCOPE VIOLATIONS.

## Sources Consulted

- `README.md:86`, `:153`, `:403`, `:452`, `:1174`
- `.skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh:20`
- `.skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json` (array length, first object, `rule_id` count)
- `.skilled/repo-rules/` (full directory listing, markdown count)
- `.skilled/repo-rules/scope-discipline.md:1`
- `.skilled/skills/system-spec-kit/references/workflows/quick-reference.md:72`, `:78`, `:84`, `:90`
- `.skilled/skills/system-spec-kit/README.md:69`
- `.skilled/commands` (depth-banded `git ls-files` at `NF==4`, per-group breakdown)

## Assessment

- New information ratio: 0.62
- Questions addressed: none new; the last unverified numeric claim among Q4's answers is now settled.
- Questions answered: none — Q1-Q5 were already answered and remain answered.

## Reflection

- What worked and why: following the script's own `VALIDATOR_REGISTRY_JSON` assignment instead of re-grepping the rules directory turned an "unverifiable" claim into a one-call count. The variable is the pointer and the directory is a decoy; iteration 6 and iteration 8 both approached the directory and both failed. Second, sweeping the README for `N <noun>` patterns first produced the complete test set, so the iteration measured only claims with no prior oracle rather than re-reading prose.
- What did not work and why: the first registry probe globbed `spec/*registry*.json`, which does not exist — the registry lives in `spec/../lib/`. The glob was a guess about location, the same class as the earlier schema guesses; the pointer line in `validate.sh:20` was authoritative and should have been read first.
- What I would do differently: read the pointer line before globbing for the artefact, and print `jq type` before any structural query.

## Recommended Next Focus

None required — every tracked question is answered and every numeric claim a rewrite would publish now has either a mechanical oracle or a documented correction. The one remaining packet-level gap is the synthesis fold: `research.md` stops at §5D (172 lines) while iterations 6-18 exist only as iteration files, so a rewrite brief assembled from `research.md` alone still misses the hook map, the claim audit, the runtime matrix, the MCP topology, the install path, the link audit and every count correction from iterations 15-18. That fold is workflow-owned and outside this dispatch's write scope.

## SCOPE VIOLATIONS

- **`research.md` synthesis update not executed.** `progressiveSynthesis` is true in config, but this dispatch's ALLOWED WRITE PATHS names only `iterations/iteration-018.md` and `deltas/iter-018.jsonl`. The 42-rule oracle, the 10-file confirmation, the four-level phrasing correction and the reproduced 44-command count are ready to fold into §5B/§5C.
