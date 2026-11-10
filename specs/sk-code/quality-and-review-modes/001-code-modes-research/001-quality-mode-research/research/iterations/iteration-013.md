# Iteration 13: Second-model re-check 3 of 5 — the INFERRED claims

## Focus

Re-check on current disk the four claim clusters the first pass could only mark INFERRED: rank 9 (no reader of the `CODE_QUALITY_RESULT` envelope or the `code-quality/v1` schema id), rank 10 (`HOOK_FLAGS_CONFIG` is the only settings seam and the label patterns are a literal list), the External-User Modes claim that integration row 4 is the closest carrier and is ungated, and the three INFERRED rows in section 8 Eliminated Alternatives. Iterations 1 to 10 ran on one model family; this pass tests the anchors rather than restating the synthesis. Every verdict is CONFIRMED, REFUTED or NOT TESTED, and says why.

A prior attempt at this same iteration had left `iteration-013.md` and `deltas/iter-013.jsonl` on disk, with two section-8 rows marked NOT TESTED. Those two rows are tested here, and the rank 9 scope limit that attempt declared (`.skilled/` only) is closed with a repo-wide search.

## Verdict Summary

| # | Claim under test | Verdict | Basis |
|---|---|---|---|
| 1 | Rank 9: no reader of the envelope or the `code-quality/v1` schema id exists | **CONFIRMED (repo-wide)** | A repo-wide search returns 45 files; every executable hit is the producer, one presence guard, or a scratch copy of that guard |
| 2 | Rank 9 sub-claim: the guard's `reason` implies a machine consumer | **CONFIRMED as not evidence of one** | The guard entry is a `names` presence assertion over a literal line; it parses no envelope |
| 3 | Rank 10: `HOOK_FLAGS_CONFIG` is the only settings seam | **REFUTED** | The dist checker alone reads three environment keys, not one |
| 4 | Rank 10: the label patterns are a literal list | **CONFIRMED** | Two module-level list literals; the comment checker reads no environment at all |
| 5 | External-User Modes: row 4 is the closest carrier and is ungated | **CONFIRMED** | Row 4 is the stage-two intent and resource row, and the reference names it in the ungated set |
| 6 | Section 8: the always-loaded checklist cannot be copied wholesale as the portable core | **CONFIRMED** | The checklist's own description scopes it to JavaScript and CSS |
| 7 | Section 8: `HOOK_FLAGS_CONFIG` cannot serve as the repo-local quality setting | **CONFIRMED** | Its reader resolves hook enable flags only; the comment checker reads no environment |
| 8 | Section 8: a registered or bundled surface is not proof that quality uses its checklist | **CONFIRMED** | Quality's own map-authority sentence still stands on current disk |

No claim in this cluster is left NOT TESTED. Two scope limits survive and are stated under Edge Cases.

## Actions Taken

1. Searched `.skilled/` for `CODE_QUALITY_RESULT` and `code-quality/v1` with one line of context. Three lines matched, in two files: the producer's envelope block and one doc-claims guard entry.
2. Searched the whole repository for the same two tokens in file-list mode. 45 files matched; the full list was read from the overflow capture so the result cap could not hide a code file.
3. Searched `sk-code-quality/scripts/` for `HOOK_FLAGS_CONFIG`, `os.environ`, `VIOLATION_PATTERNS` and `ALLOWED_PATTERNS` with one line of context. Seven lines matched, in two files. Neither the comment checker nor the ceiling report matched on `os.environ`.
4. Opened the dist checker's config reader and its three environment reads (`check-dist-staleness.sh:28-69`) to see what the seam actually configures.
5. Opened the stage-two integration table and its gate paragraph (`parent-skills-nested-packets.md:210-249`), the quality workflow and envelope block (`SKILL.md:165-219`), and the checklist's own description line.
6. Opened the prior attempt's `iteration-013.md` header to see which rows it had left NOT TESTED, so this pass would not silently repeat them.

## Findings

### Rank 9 — CONFIRMED repo-wide, and stronger than the prior attempt could state

**OBSERVED — the framework tree holds one producer and one presence guard.** [SOURCE: .skilled/skills/sk-code/sk-code-quality/SKILL.md:210] `CODE_QUALITY_RESULT v1` [SOURCE: .skilled/skills/sk-code/sk-code-quality/SKILL.md:211] `schema_version: code-quality/v1` [SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-doc-claims.cjs:57] `line: 'schema_version: code-quality/v1',`

**OBSERVED — the guard is a presence assertion, not a parser.** Its entry kind is a literal-name check, and the consumer claim lives only in a prose `reason` string. [SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-doc-claims.cjs:58] `reason: 'a versioned schema id that other tools consume',`

**OBSERVED — the repo-wide search adds one second producer and no consumer.** The 45 matching files are research packets, changelog and benchmark prose, scratch captures and two logs. The only executable files are the guard and a scratch copy of it under `specs/sk-code/011-.../scratch/units/`. The only additional framework hit is a second copy of the same envelope block outside `.skilled/`. [SOURCE: .hermes/skills/sk-code-quality/SKILL.md:215] `CODE_QUALITY_RESULT v1` [SOURCE: .hermes/skills/sk-code-quality/SKILL.md:216] `schema_version: code-quality/v1`

**DERIVED.** The prior attempt's scope limit is closed: `.claude`, `.opencode` and `.codex` were inside the repo-wide search and returned no hit. Rank 9's "no reader" half is now a repo-wide observation rather than a `.skilled/`-only one. The `.hermes` copy is a producer duplicate, so it does not weaken the claim; if anything it widens the surface a future consumer must serve.

**Scope limit, stated plainly.** The search is token-literal. A consumer that parses `schema_version:` generically without naming either token, or one living in a gitignored local-skill tree the search did not enumerate, would not appear. This narrows the claim; it does not overturn it.

### Rank 10 — REFUTED on "the only settings seam"; CONFIRMED on the literal label list

**OBSERVED — the dist checker reads three environment keys.** [SOURCE: .skilled/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh:31] `override = os.environ.get("HOOK_FLAGS_CONFIG")` [SOURCE: .skilled/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh:63] `return os.environ[key] if key in os.environ else cfg.get(key)` [SOURCE: .skilled/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh:136] `value = os.environ.get("SPECKIT_DIST_AUTO_REBUILD", "1").strip().lower()`

Line 31 relocates the flags file, line 63 lets any `SYSTEM_*_DISABLED` key override that file per process, and line 136 changes whether a stale package is rebuilt. The third is load-bearing elsewhere in the same synthesis, where rank 14 depends on it. So "the only settings seam" is false as written, and the prior attempt's REFUTED verdict is itself confirmed on current disk.

**OBSERVED — what the seam actually configures is narrower than a quality setting.** The reader resolves `hooks/hook-flags.env` and the values it returns are hook enable flags. [SOURCE: .skilled/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh:33] `"hooks", "hook-flags.env"` [SOURCE: .skilled/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh:68] `flag = "SYSTEM_" + re.sub(r"[^A-Z0-9]+", "_", concern.upper()) + "_DISABLED"`

**DERIVED.** The load-bearing half of rank 10 survives even though its wording fails: no seam anywhere in the packet carries checklists or label patterns. The recommendation's justification should be rewritten as "no seam configures checklists or label patterns", not "only one settings seam exists". That is a wording fix inside rank 10, not a change to its build order.

**OBSERVED — the label patterns are two module-level literals.** [SOURCE: .skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh:144] `ALLOWED_PATTERNS = [` [SOURCE: .skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh:160] `VIOLATION_PATTERNS = [` They are consumed in fixed order, allowed first, and the file contains no environment read. [SOURCE: .skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh:196] `if any(pat.search(comment_text) for pat in ALLOWED_PATTERNS):` [SOURCE: .skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh:200] `for vpat, _desc in VIOLATION_PATTERNS:`

### External-User Modes — row 4 CONFIRMED as the closest carrier, and ungated

**OBSERVED — row 4 is the stage-two intent and resource row, and its stated failure is exactly the user-mode symptom.** The row is the stage-two intent row, and its consequence column reads as follows. [SOURCE: .skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:226] `The mode is selected but loads no leaves. Keys must stay equal`

**OBSERVED — the reference lists row 4 in the ungated set.** [SOURCE: .skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:239] `Rows 4, 5, 6, 8 and 10 have no gate:`

**OBSERVED — quality's map authority is unchanged, so registering a surface still does not make quality load its checklist.** [SOURCE: .skilled/skills/sk-code/sk-code-quality/SKILL.md:171] `The target-path checklist map remains authoritative; the prompt-intent projection only makes the default quality resources scoreable.`

**DERIVED.** The synthesis claim holds in both halves. Row 4 carries a surface's checklists into stage two, no gate covers it, and the map-authority sentence means a resource entry alone does not change which checklist quality selects. The integration row is a necessary carrier, not a sufficient one.

### Section 8 — all three INFERRED rows CONFIRMED, including the two the prior attempt left untested

**OBSERVED — the always-loaded checklist is scoped to JavaScript and CSS in its own description.** [SOURCE: .skilled/skills/sk-code/sk-code-quality/assets/code-quality-checklist/overview-header-and-comments.md:3] `description: Validation checklist for JavaScript and CSS code quality and style compliance.` [SOURCE: .skilled/skills/sk-code/sk-code-quality/assets/code-quality-checklist/overview-header-and-comments.md:14] `Validation checklist for JavaScript and CSS code quality and style compliance.` Copying it wholesale as a portable core would therefore import a web house style, so the elimination reason stands.

**OBSERVED — the `HOOK_FLAGS_CONFIG` seam cannot carry comment or ceiling settings.** Its only reader resolves hook enable flags, and the comment checker reads no environment; the ceiling report matched no environment read at all. The elimination reason stands.

**OBSERVED — a bundled surface is not proof of use.** The map-authority sentence at `SKILL.md:171` is the anchor, and it is unchanged. The elimination reason stands.

**DERIVED.** The INFERRED label on these three rows was a label about the evidence chain, not about doubt. On current disk each rests on a line that says what the row claims. They can be promoted to OBSERVED in a later synthesis pass.

## Questions Answered

None of the five strategy key questions is newly answered; all five were already ticked. This iteration is a verification pass over claims, not a question-answering pass.

One open question in the synthesis narrows without closing: "Who consumes the `code-quality/v1` schema id?" is now answered for this repository (no consumer) and remains UNKNOWN outside it.

## Questions Remaining

- Who consumes the `code-quality/v1` schema id outside this repository, and would a gitignored local skill that parses it be invisible to a token-literal search? (open question 5, narrowed here)
- Where should the boundary between the quality and review checklists sit? Carried from iterations 5 and 11; untouched here.
- Should the house-style P0 items stay P0 for this repository's own `.js` files? The operator's decision, and rank 1 waits on it.
- Which manifest name and merge rule should a repository without a surface packet use? The operator's decision, and rank 10 waits on it.

## Edge Cases

- **Ambiguous input:** none. The focus named four claim clusters and the three INFERRED section-8 rows by label.
- **Contradictory evidence:** none between sources. One internal contradiction inside the synthesis itself: rank 10's justification says `HOOK_FLAGS_CONFIG` is the only settings seam while rank 14 relies on a second environment seam. Recorded as a finding, not resolved by editing the synthesis, which is out of this iteration's write scope.
- **Missing dependencies:** none. Every anchor resolved on current disk.
- **Partial success:** none. All eight claims reached a verdict.
- **Pre-existing artifacts:** `iteration-013.md` and `deltas/iter-013.jsonl` already existed from an earlier attempt at this iteration, and the dispatch names both paths as writable. They were replaced with this pass's evidence rather than appended to, so the packet holds one coherent iteration 13. No other file was touched.

## Sources Consulted

- `.skilled/skills/sk-code/sk-code-quality/SKILL.md:171`, `:193`, `:210`, `:211`, `:214`, `:216`
- `.skilled/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh:28-69`, `:136`
- `.skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh:144`, `:160`, `:196`, `:200`
- `.skilled/skills/sk-code/sk-code-quality/assets/code-quality-checklist/overview-header-and-comments.md:3`, `:14`
- `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-doc-claims.cjs:57`, `:58`
- `.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:217`, `:226`, `:239`
- `.hermes/skills/sk-code-quality/SKILL.md:215`, `:216`
- `research/research.md:183`, `:203`, `:204`, `:240`, `:241`, `:247`
- `research/iterations/iteration-013.md` (prior attempt, header only)

## Assessment

- New information ratio: 0.40. Two of the eight claims had never been tested and are settled here; rank 9 moved from a `.skilled/`-only observation to a repo-wide one, and one new source (the `.hermes` producer copy) entered the record. The other five restate or tighten verdicts the prior attempt already reached.
- Questions addressed: rank 9, rank 10 (both halves), the External-User Modes row-4 claim, and the three section-8 INFERRED rows.
- Questions answered: none of the strategy key questions; all were already ticked.

## Reflection

- **What worked and why:** opening the file list from the overflow capture rather than trusting a truncated display. That is what turned rank 9 from "confirmed in `.skilled/`" into a repo-wide observation, and it is what surfaced the `.hermes` duplicate. The lesson generalises: a capped or truncated search result is not a negative result.
- **What did not work and why:** the first attempt to inspect `.hermes` was a combined `ls` plus `git ls-files` whose output was itself truncated, so the mirror status of that file is still unconfirmed. A single-purpose stat call would have answered it.
- **What I would do differently:** test the two rows the prior attempt left NOT TESTED first, since they were the only genuinely open items in the cluster.

## Recommended Next Focus

Second-model re-check 4 of 5: the remaining INFERRED and DERIVED rows not yet re-tested on current disk, in particular rank 2's surface-declaration claim, rank 6's read-only handback target, and rank 14's auto-rebuild path. Then a compiled-route replay for the `yagni` claim, which no amount of reading will settle.
