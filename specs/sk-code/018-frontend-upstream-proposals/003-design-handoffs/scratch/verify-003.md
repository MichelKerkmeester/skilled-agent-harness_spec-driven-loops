# Verification: 003-design-handoffs

Read-only verification of phase 003 against `acceptance-criteria.md`. Every row below was
re-run from the repository root; no file's own claim of completion was trusted.

`F` is `.skilled/skills/sk-design/sk-design-fundamentals`.

| Row | Verdict | Command | Deciding output |
|---|---|---|---|
| AC-001 | MET | `rg -n "sk-design-fundamentals" .skilled/skills/sk-code/SKILL.md .skilled/skills/sk-code/README.md .skilled/skills/mcp-tooling/mcp-figma/SKILL.md` then `rg -c "sk-design-fundamentals" <same three paths>` | Three hit lines, exactly one per file: `sk-code/SKILL.md:67`, `sk-code/README.md:104`, `mcp-figma/SKILL.md:233`. `rg -c` printed `1` for each path. Each line is the hand-off line. |
| AC-002 | MET | `rg -n "prefers-reduced-motion" $F/references/motion-principles.md`; `rg -n -i "reduce motion\|remove animations\|native" $F/references/motion-principles.md`; `rg -n -i "reanimated\|framer\|gsap\|lottie\|anime\|popmotion\|react-spring" $F/references/motion-principles.md` | Line 173 contains both required settings: ``the `prefers-reduced-motion: reduce` media query`` and `On native it is the platform setting, iOS Reduce Motion or Android Remove animations`. The library grep exited 1 with no output. |
| AC-003 | MET | `rg -n -i "profile" $F/SKILL.md`; `sed -n '220,227p' $F/SKILL.md` | Hits at `:220` `### Project Profile Slot`, `:222` the optional `` `references/<project>-profile.md` `` slot sentence, `:227` `4. The profile.` The read shows the four-step precedence beneath the slot paragraph. |
| AC-004 | MET | `git diff --stat`; `git diff HEAD --stat`; `git diff HEAD --stat -- '*ROUTER.md' '*hub-router.json' '*graph-metadata.json'` | Both diff stats list only five `.md` files; no `ROUTER.md`, `hub-router.json` or `graph-metadata.json` appears. The path-filtered diff printed 0 lines, exit 0. |
| AC-005 | MET | `node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs --hub sk-design --concurrency 2`; same with `--hub sk-code`; `diff -u scratch/reach-baseline.txt scratch/reach-final.txt` | Fresh rerun: `OK sk-design declared=120 wrong-hub=0 outranked=0 no-reach=0 allowed=1 probe-error=0 operator-local=0` and `OK sk-code declared=97 wrong-hub=0 outranked=0 no-reach=0 allowed=0 probe-error=0 operator-local=0`; both `RESULT: PASSED`, exit 0. Identical to the two baseline rows. The baseline-to-final diff exited 0 with no output. |
| AC-006 | MET | `sed -n '222p' $F/SKILL.md` | `A profile loads only when the request names that project's UI. An unknown or unnamed project loads none, and the slot adds no routing phrase, since naming the project is what reaches it.` |
| AC-007 | MET | `wc -l $F/references/motion-principles.md` | `204` (limit 250). |
| D-01 diff scope | MET | `git diff HEAD --stat` | Exactly five paths, all outside `specs/`: `mcp-tooling/mcp-figma/SKILL.md`, `sk-code/README.md`, `sk-code/SKILL.md`, `sk-design-fundamentals/SKILL.md`, `sk-design-fundamentals/references/motion-principles.md`. No other path listed. |
| D-02 sentence identity | MET | `for f in <three files>; do grep -o 'When a request or a frame leaves a visual value open.*decide it there\.' "$f" \| shasum -a 256; done` | All three extractions produced the same sentence and the same digest: `46b4aae5b94754a9b50744a31d85efdf8bb085a3d2af9d21e7628f30c97484e3`. Word-for-word identical. |
| D-03 precedence order | MET | `sed -n '224,227p' $F/SKILL.md` | `1. The repository's mode.` / `2. The tokens the app installs.` / `3. The design scales in this file.` / `4. The profile.` The order is repository mode, installed tokens, design scales, profile. |
| D-04 no new routing phrase | MET | `git diff HEAD -- '*ROUTER.md' '*hub-router.json' '*graph-metadata.json' '*mode-registry.json'`; `git diff HEAD` filtered for `trigger_phrases\|intent_signal`; `rg -n "leaves a visual value open" --glob '!specs/**' .` | Path-filtered diff printed 0 lines. No added line carries `trigger_phrases` or `intent_signal`. The new sentence appears only in the three hand-off files, in no router or registry. Supplementary: `--hub mcp-tooling --concurrency 2` rerun printed `OK mcp-tooling declared=115 wrong-hub=0 outranked=0 no-reach=0 allowed=0 probe-error=0 operator-local=0`, `RESULT: PASSED`. |

## Anything that looked wrong

- **The packet's own docs contradict the observed state.** `acceptance-criteria.md` still
  marks every row `Unmet`, `Status: Draft`, `Closeable: No`; `tasks.md` has every task and
  check unticked with `Verification Summary` at `0/5`, `0/9`, `0/1` and `Not yet verified`;
  `implementation-summary.md` says `Nothing is built yet` and `Completed | Not completed`.
  The five doc changes exist and every criterion above passes, so these three files are
  stale. Read-only verifier: not fixed here.
- **AC-004's stated check is blind to untracked files.** `git diff` reports tracked content
  only, so a newly added router file would leave it green. This packet's own
  `graph-metadata.json` does not appear in the diff for the same reason. The gap was closed
  separately by the path-filtered diff, the added-line filter and the phrase search, which
  are clean, but the AC's command alone cannot prove absence.
- **`scratch/reach-*.txt` are untracked evidence files.** AC-005 was settled by rerunning
  the reach tool, not by trusting either file; the rerun matched both. The files themselves
  never appear in `git diff`.
