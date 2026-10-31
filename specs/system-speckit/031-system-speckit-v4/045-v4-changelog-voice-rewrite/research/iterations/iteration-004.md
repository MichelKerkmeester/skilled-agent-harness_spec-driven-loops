# Iteration 004 — Independent validation pass and the publication-time checklist

Run: `rsr-2026-09-21T08-45-54-679Z` · Mode: research · Iteration 4 of 10

## FOCUS

The prompt-pack focus (sentence-level prose sample, ownership map) was delivered in iteration 3 as F-016/F-017; re-running it would duplicate evidence. The genuine residual, named by iteration 3's own close, is (a) an independent validation pass over the completed decision sheet and (b) the publication-time re-derivation checklist that turns the decisions into a mechanical patch list. This iteration does both. No implementation.

## ACTIONS TAKEN

1. Read config, strategy, the registry (§findings F-001–F-020) and iteration 3 to confirm nothing in the decision sheet is unspecified.
2. Re-measured the changelog at HEAD (`specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md`, 747 lines): `18 H2 / 56 H4 / 19 --- / 44 &nbsp;` — exact REQ-005 conformance.
3. Re-verified 26 cited lines against their quoted content with numbered range reads (23–26, 35–45, 100–102, 187–189, 273–275, 294–296, 309–314, 382–384, 392–394, 462–464, 488–490, 631–633, 659–661, 700–704, 714–718, 729–731, 737–743).
4. Re-checked the tree: `.opencode` entry census with targets; `EXISTS`/`MISSING` probes on nine paths; hook package directories (22) and symlinks (101); component changelogs (13).
5. Re-ran the git census: `1d43dbd38b..HEAD` = 278; `7076dba64b..HEAD` = 5.
6. Pinned F-016's five approximate quotes exactly via grep.

## FINDINGS

### F-021 — Validation pass: the line map holds; eight citations inside the decision sheet need correction

Confirmed at HEAD (no change to any decision):

| Claim | Evidence |
|---|---|
| L24 "Seven hubs" | present |
| L44 / L628 / L744 nine-modes family | present (body instance is 628) |
| L489 "other six hubs" | present |
| L274 seven external CLIs + "Cursor carries 21 ids across six families" | present |
| L295 "178 recommendations" | present |
| L310 / L314 "Seven CLI-orchestrator skills" | present |
| L383 heading, L393 cache forks, L463 hooks sentence, L660 mcp-figma | present |
| L715 renames, L716 repoint, L717 removals + advisor path | present |
| L730 "Six CLI-orchestrator skills" | present (the F-009 contradiction) |
| L740 "266 commits…", L742 blanket alias sentence | present |
| REQ-005 counts 18 / 56 / 19 / 44 | exact, re-measured |
| git: 278 commits vs stated 266; 5 post-rewrite README commits | re-measured |

Corrections to the decision sheet's own citations (the changelog is not edited by this iteration):

1. F-016 row 2 quote is **L11**, not 13.
2. F-016 row 4 quote is **L50**, not ≈53.
3. F-016 row 5 quote is **L36**, not ≈45.
4. F-016 row 6 quote is **L705**, not 700–703.
5. The spec-correction list (finding 1-42) cites "lines 39/44/632 nine modes"; the actual instances are **L44 / L628 / L744**. L39 is the design hub's "four modes", a different claim.
6. F-016's closing tally ("five conform, three soften, two rewrite-or-drop") does not reconcile with its own row verdicts; the rows are authoritative: 2 conform rows plus 3 unbroken patterns, 2 soften, 2 rewrite, 2 drop, 1 move, 1 retitle. The scope statement (process-metric clauses + maintainer narration) is unchanged.
7. F-019's heading claims "five … to fix, six … to keep"; its table and net line give **six fixes** (101, 188, 463, 660-target, 716-target, 717), **four keeps** (25, 81, 87, 716-source), one verify (168), one reword (742). The heading is the outlier.
8. F-020's "178 recommendations → re-derive from the authoritative ledger" is contradicted by 042's own verdict: `042-v4-doc-freshness/verdict-changelog.md` row A16 — "Not re-derivable; … The artifacts these counted no longer exist in a re-derivable form. Flagged, not corrected." Disposition revised in F-023.

### F-022 — Two changelog paths are dead at HEAD, and the blanket alias sentence is false in a stronger way than F-004 recorded

Alias probe at HEAD: `.opencode` is a real directory whose symlinks are exactly `agents`, `commands`, `manual-testing-playbook`, `repo-rules`, `skills`.

| Changelog path (line) | Probe | Verdict |
|---|---|---|
| `.opencode/hooks/` (463) | `MISSING` | Dead path, not a stale spelling; the fix is correctness |
| `.opencode/bin/skill-advisor.cjs` (188, 717) | `MISSING` (`.opencode/bin` absent); `.skilled/bin/skill-advisor.cjs` exists | Dead; the changelog's command cannot run as printed |
| `.opencode/specs/` (25, "a compatibility symlink") | exists as a real directory (`drwxr-xr-x`, link count 2, Sep 20 14:52), not a symlink | The promised compatibility symlink is not there |
| `.opencode/skills/...` (101, 660, 716-target) | resolves via the `skills` symlink | Resolves today, but contradicts the README spelling |

Consequence: L742's "Every `.opencode/*` path in this document still resolves, as a git-tracked symlink alias into `.skilled/`" is false for at least `hooks`, `bin` and `specs`. The reword must not keep "every": the surviving aliases resolve; the historical references (25, 81, 87) stay history; the current-path sentences must be re-pointed at `.skilled/`. F-019's six swaps are correctness fixes first, style consistency second.

### F-023 — Count dispositions revised: one number has already drifted, one has no re-derivation source

| Count (line) | F-020 disposition | Validation result | Revised disposition |
|---|---|---|---|
| "102 relative symlinks" (463) | re-derive at publication | measured **101** at `.skilled/hooks` (`find -type l`); already off by one | Prefer the sentence's own per-hook formulation ("one relative symlink per hook") or drop; a re-derived count is fragile and will drift again |
| "178 recommendations" (295) | re-derive from the ledger | no ledger exists; 042 A16 ruled all pre-release numerics non-re-derivable | DROP the number; keep role phrasing ("a research program of recommendations") |
| "eighteen of the twenty-two hook packages" (35) | soften to role | denominator verified: 22 hook-package directories under `.skilled/hooks`; numerator not independently verified | Soften regardless (reader-facing glance bullet) |
| Cursor "21 ids across six families" (274) | soften to role | not re-derived (third-party CLI roster) | Unchanged |
| "two forked cache extensions" (393) | soften to role | mechanism sentence verified at L393 | Unchanged |
| "266 commits" (740) | (section is a DROP) | 278 measured again today | Deletion resolves the number; no re-derivation |

Also flagged: the structural edits the decision sheet prescribes (drop `After This Draft`, collapse `Internal Seams`, merge intro/thesis restatements) necessarily change the REQ-005-pinned counts (18/56/19/44). The implementation step must either treat those counts as a pre-change baseline or amend REQ-005 in the same change; otherwise the packet's own acceptance check fails on a correct edit.

### F-024 — Publication-time checklist: the mechanical patch list

Ordered; each item names its verification. This is the artifact the implementation step executes. None of it was executed here (implementation deferred, per the topic).

**A. Path correctness**
1. L101 → `.skilled/skills/system-spec-kit/runtime/cli/` (directory exists; the `.opencode` spelling also resolves today but is not the standard).
2. L188 → `node .skilled/bin/skill-advisor.cjs` (README spelling; `.opencode/bin` is dead).
3. L463 → `.skilled/hooks/` (dead path today) and drop or soften the 102.
4. L660 → `.skilled/skills/mcp-tooling/mcp-figma/`.
5. L716 target → `.skilled/skills/system-spec-kit/runtime/cli/`; the source half keeps `.opencode/specs/` as history.
6. L717 advisor path → `.skilled/bin/skill-advisor.cjs`.
7. L168: verify the outermost-root sentence against the post-migration boundary, then fix or keep.
8. L742: reword without "every" (see F-022).

**B. Internal consistency**
9. L730 "Six" → "Seven" (rosters at 274, 310, 314; README and Upgrade Notes agree).
10. F-016 prose trims at their corrected lines: L11 (drop the size props), L35 (role phrase), L50 (drop 496→284), L36 (outcome rewrite), L58 (cut the mood sentence), L383 (retitle "A Closed Roster"), L705 (move the pilot narration to the owning packet), L738 (drop the section).

**C. Counts** — per F-023: L295 drop; L274 soften; L463 soften/drop; L393 soften; L35 soften.

**D. Structure** — merge `Internal Seams` into the collapsed appendix; drop `After This Draft`; dedupe glance vs thesis vs README; apply the F-018 order (family rows Code → MCP → Design → Documentation → Prompt; core block unchanged). Reconcile the REQ-005 counts as noted above.

**E. Post-edit publication checks** — re-run `grep -c` counts against the amended REQ; probe every remaining `.skilled/` mention for existence; confirm no `.opencode` current-path spellings remain in reader-facing sentences; re-verify the six/seven roster statement against `.skilled/skills/cli-external-orchestration/`.

## QUESTIONS ANSWERED

Q1–Q5 remain answered (iterations 1–3). This iteration adds validation-level corrections (F-021–F-023) and converts the decision sheet into an executable checklist (F-024); no question reopened. The two corrections that change implementation behavior: F-022 (dead paths → correctness class) and F-023 (178 has no source; 102 already drifted).

## QUESTIONS REMAINING

None substantive. No further research is warranted; remaining work is the implementation pass, which the topic defers.

## NEXT FOCUS

None required. If the reducer schedules another iteration before the implementation step, the highest-value check left is a dry-run of F-024's section E against a scratch copy — but that is implementation rehearsal, not research, and would violate the non-goal. The packet is ready for the reducer and the implementation follow-up.

## SCOPE VIOLATIONS

None. Writes landed only in `research/iterations/iteration-004.md`, `research/deltas/iter-004.jsonl`, the gateway temp file, and the gateway's own ledger refresh. All researched paths (`CHANGELOG-v4.0.0.0.md`, `README.md`, the 042 verdict files, `.skilled/` and `.opencode/` tree reads, git queries) were read-only.
