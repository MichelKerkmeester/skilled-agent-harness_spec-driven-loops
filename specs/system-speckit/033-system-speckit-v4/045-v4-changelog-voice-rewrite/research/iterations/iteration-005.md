# Iteration 005 — Outline reconciliation, README HEAD pin, and the research close

Run: `rsr-2026-09-21T08-45-54-679Z` · Mode: research · Iteration 5 of 10

## FOCUS

The prompt-pack focus recycled the iteration-3 text (sentence-level prose sample, per-paragraph ownership map); both were delivered as F-016/F-017 and independently validated in iteration 4 (F-021/F-022). Re-running them would duplicate evidence, so this iteration closes the two genuinely open residuals instead:

1. The candidate major-release outline written in iteration 2 was never updated after iteration 3's F-018 flipped the family-block order and iteration 4's F-023 revised two count dispositions. The outline literal still reads `Code -> Documentation -> Design -> MCP -> Prompt`, which now contradicts the validated decision sheet.
2. The iteration-1 carried item "pin the exact README HEAD snapshot as the voice standard" had a relative pin (README HEAD) but no commit identity, so the prose standard was not reproducible.

No implementation. The changelog, README and prior artifacts were read-only throughout.

## ACTIONS TAKEN

1. Re-read the strategy-relevant state: config, findings registry (99 findings, F-001–F-024) and the iteration-2/iteration-3 narratives, to establish the outline's exact pre-validation text and the validation deltas that must land in it.
2. Pinned the voice standard: `git log -1 --format='%H | %ad | %s' -- README.md` → `3ad5ca25fb98916cc8cfa740212dc03800595b21 | Mon Sep 21 10:29:56 2026 +0200 | docs(readme): section 2 heading to all caps`; enumerated the six most recent README commits (the five post-rewrite commits plus `e4f20dabe8`).
3. Re-read the changelog's live H2 sequence at HEAD (`grep -n '^## '`, 18 H2 from line 22 to line 738) to map the outline's zones onto real sections and confirm the current order still matches iteration 1's F-007 finding.
4. Cross-checked the iteration-2 outline against F-018 (family tie-break), F-021–F-023 (validation corrections) and F-024 (mechanical checklist), and folded the validated decisions into one final outline block.

## FINDINGS

### F-025 — Candidate outline reconciled with the validated decisions (final form)

The iteration-2 outline (`iteration-002.md` lines 125–143) predates F-018 and F-023. One literal line is stale — the family row — and the count notes were not yet folded in. The rest of the order stands, as iteration 3 recorded. Final block:

```text
frontmatter (title, trigger_phrases)
H1  v4.0.0.0, Fewer Skills, Safer Paths
WHY THIS RELEASE        two paragraphs of shape plus failure paths, then the two
                        must-know breaking bullets; intro trimmed per F-016 (agent
                        clause corrected per F-010)
WHAT'S NEW AT A GLANCE  about 15 bullets, body order; near-verbatim previews dropped
                        (F-015/F-017 dedupe against README §2)
THE CORE                Spec Kit -> Deep Loops -> Orchestrating -> Advisor (unchanged, F-018)
THE SKILL FAMILIES      Code -> MCP -> Design -> Documentation -> Prompt
                        (F-018; the iteration-2 literal had Code -> Documentation ->
                        Design -> MCP -> Prompt, which README §7 rejects)
THE SYSTEM SURFACES     Hooks and Goals -> Safer Git -> Agent Discipline -> Plain-English
UPGRADE NOTES           renames to adopt / repoint what moved / drop removed surfaces /
                        changed defaults / reconcile your own skills
APPENDIX: UNDER THE HOOD  collapsed. Former Internal Seams, deduped, corrections applied
                        (L730 "Six" -> "Seven"; L742 reworded per F-022)
```

Corrections folded in at their lines (F-023 dossier and F-024 §C): drop the "178 recommendations" number at L295 (no re-derivation source, 042 verdict A16); soften the Cursor per-CLI id count at L274; drop or rephrase the "102 relative symlinks" count at L463 (measured 101 at HEAD; prefer "one relative symlink per hook"); soften "eighteen of the twenty-two" at L35; soften the two-knob cache history at L393; plus the path-correctness swaps L101 / L188 / L463 / L660 / L716-target / L717, the L168 verify, and the L730 and L742 rewords. The structural edits (drop `After This Draft`, collapse `Internal Seams`, merge the thesis restatement) necessarily change the REQ-005-pinned counts 18 H2 / 56 H4 / 19 `---` / 44 `&nbsp;`; treat those as a pre-change baseline or amend REQ-005 in the same change (F-023 note).

This is a synthesis correction over previously validated evidence — no question reopened, and no new research direction opened. The reconciled outline is the deliverable the topic names ("a recommended section order, and a candidate major-release changelog outline") in its post-validation form.

### F-026 — README voice standard pinned to a commit

The prose standard for the changelog is README at `3ad5ca25fb98916cc8cfa740212dc03800595b21` (2026-09-21), the head of the five post-rewrite README commits and the sixth since the rewrite baseline:

| Commit | Subject | Class |
|---|---|---|
| `3ad5ca25fb` | section 2 heading to all caps | post-rewrite (F-005) |
| `4b51a59fb7` | the foundation leads section 2 | post-rewrite (F-005) |
| `f3c98aa316` | section 2 becomes Overview, h3s stripped bare | post-rewrite (F-005) |
| `b6431fe588` | retitle section 2 and restore its overview subheading | post-rewrite (F-005) |
| `b5bba1e1e8` | keep overview in the merged section title | post-rewrite (F-005) |
| `e4f20dabe8` | drop resource-map, merge 2+3, h5 lead sentences | pre-rewrite baseline area |

All five post-rewrite commits touch only section-2 voice/structure (F-005); none invalidates an F-016 prose rule or an F-019 path classification. Iteration 4's validation pass (F-021/F-022) was measured against this same content, so the F-016 sample remains valid at this pin. Future prose "fixes" are to be measured against this hash, not against a moving HEAD. This resolves the iteration-1 carried item.

## QUESTIONS ANSWERED

Q1–Q5 remain answered; none reopened. This iteration confirms the Q4 and Q1 tails are complete and validated (F-016 prose sample, F-017 ownership map, F-021 line-map validation), pins the voice standard for reproducibility (F-026), and completes the topic's stated outline deliverable (F-025).

## QUESTIONS REMAINING

None. Research closes here: every question is answered, the decision sheet is validated (F-021–F-024), and the outline is reconciled (F-025) against the pinned standard (F-026). The only remaining work is the deferred implementation pass.

## NEXT FOCUS

None required. Any further iteration before implementation would either duplicate F-016/F-017 or rehearse the implementation that the topic defers. The run is at its natural close; the packet is implementation-ready.

## SCOPE VIOLATIONS

None. Writes landed only in `research/iterations/iteration-005.md`, `research/deltas/iter-005.jsonl`, the gateway contract's temp file, and the gateway's own ledger refresh. Researched surfaces (`CHANGELOG-v4.0.0.0.md`, `README.md`, prior iteration artifacts, git queries) were read only.
