# Synthesis: what to refine, what to drop

The loop's cost is plumbing, not prose. 39 of 120 validate calls FAILED and all 39 were `GENERATED_METADATA_*`, the validator's own bookkeeping.

**Level caveat, plainly:** every loop packet is Level 3 because the frozen brief forces `--level 3`, while `recommend-level.sh` recommends Level 0 (Level 1 per the card) for this one-flag feature. So every Level 2/3-gated saving below is real in the loop and worth zero for the work this kit exists to do. Level 1 work must be costed separately.

## 1. Ranked survivors

| # | Change (file + edit) | Evidence | Saving (per packet, levels) | Risk |
|---|---|---|---|---|
| 1 | `orchestrator.ts:1458`: skip `+` pass lines unless `--verbose`, print one count line; drop `tail -1` from card `:148` | 84 of 120 calls piped, 36 full; `:1458-1466` prints every non-info entry | 1 to 2 validate calls per run, all levels | passing entries can carry details; keep the verbose escape. Suite asserts `RESULT: PASSED` containment, so tests hold |
| 2 | Repair path: `orchestrator.ts:1493` prints the apply command first and names the three rewritten fields; card `:162` carries the same command | Apply is printed after preview and no file is named (`:1493-1497`); 11 of 12 runs ran preview first, 8 spent 64 calls proving safety | about 1 skipped call plus 5 to 8 investigation calls in 8 of 12 runs; about 3 calls per author packet when drift occurs; all levels editing spec.md | hint wording only |
| 3 | Visible id rule at `spec.md.tmpl:134`: one line saying REQ ids run across both tables and validate.sh never links ids; same for AC and T | guidance exists only in the stripped FILL comment `:135`; 33 calls in 11 of 12 runs hunting it | about 3 calls per run, all levels | two extra lines to read; keep it one sentence |
| 4 | `acceptance-criteria.md.tmpl:84`: forbid counts and id ranges; default `:88` to "No. Planning only." | 9 of 12 upkeep packets shipped a wrong count or range | up to 1 edit plus 1 read, levels 2/3/3+; main gain is a truthful artifact | none |
| 5 | Card `:145`: batch every failing rule in one pass, keep the three-round stop at `:169`, leave the frozen brief untouched | refined/r3 18 edits, 10 validates; but refined/r1 has 8 validates, not 6 | 2 to 4 calls, less than claimed; Level 1 loses the AC edits | a batch can miss a rule dependency |
| 6 | Card `:160`: the step 9 run is the close-out proof; remove "run the validator once more" | redundancy starts at `:140`, `:148`, `:160`; 22 identical PASS repeats in 24 runs | 1 to 2 author calls; not upkeep, the card is read in 0 upkeep runs | a late edit goes unchecked |
| 7 | Card `:16`: only the observational Verify lines become optional; sections 8 and 10 stay mandatory | packet-check 2.7 fast vs 10.0 slow, split itself UNKNOWN | up to 7 calls, only if section 8 stays | `:130` says Draft tokens only warn, so strict passes with leftovers |
| 8 | Card `:89-104`: plan §4 points at tasks.md; delete optional L2/L3 sections at the level in use | template already uses the pointer shape (`plan.md.tmpl:124`); only 4 of 14 packets carry Step blocks; sections gated at `:97`, `:181` | 130 to 165 words at Level 3, about 400 at Level 2, 0 at Level 1 | golden snapshots need regeneration |

## 2. Drop a whole doc?

- **implementation-summary.md: keep.** `speckit-resume-confirm.yaml:72,113` globs it and reads `_memory.continuity`. Deferral as proposed is unsound: nothing renders it at the first `[x]`, so `check-files.sh:70-81` would error where it passes today, and the six tokens merely move. If the tokens must go, change the eager scaffold at `create.sh:431` plus card `:130`/`:154`, or add a real first-`[x]` trigger.
- **acceptance-criteria.md: keep, slim.** Dropping costs three rule edits, two command YAML edits and `AGENTS.md:143` for 4.5 percent of calls, and `AC_CLOSURE` (`validator-registry.json:85-97`) fails every future Level 2+ packet. Slimming needs no rule change: `acceptance-criteria.md.tmpl:60` already accepts "command, file:line, or artifact". Note `AC_CLOSURE` reads no Verification column, so a stale citation passes.
- **plan.md: keep the seven core anchors, cut sections instead.** The template's own FILL notes already permit "or delete the whole section" (`plan.md.tmpl:186,206,220`), so this is one card sentence, not template surgery. Keeping Enhanced Rollback while trimming §7 leaves two rollback sections; pick one.

## 3. Test-loop changes

Stop asking the loop whether wording improved: 172 paired rounds are needed a 10 percent move on author tool_calls, 370 on seconds, 59 on upkeep tool_calls. Score deterministically instead: validator invocations the card forces (now three, `:140`, `:148`, `:160`, plus the `:145` loop), words a model must read and write per level, forced repair round trips. Also: 64 PASSED calls, 40 stacked on a verdict already reached. And PLACEHOLDER_FILLED can never clear, because all six tokens sit in a file both briefs forbid; say so in the card, but do not silence the Draft warn, since `check-placeholders.sh:11` still counts.

## 4. Build first

1. `orchestrator.ts:1458` pass lines behind `--verbose`. Proof: one passing-packet validate shows zero `+` lines and one count line.
2. Repair path, `orchestrator.ts:1493` plus card `:162`. Proof: on a drifted packet the first hint line runs and the next validate passes with no other diff.
3. Card `:148`/`:160` down to one close-out pass. Proof: a deterministic count of stated validator invocations, three to one.

**Refuted:** drop GOOD/WEAK from `tasks.md.tmpl:115` (breaks `template-fill-guidance.vitest.ts` at levels 2, 3, 3+); delete AI EXECUTION PROTOCOL from the plan template (no such header exists in `templates/`); restrict the repair hint to errors (metadata rules never emit warn, so no-op); replace the brief's cap text (frozen benchmark input).
