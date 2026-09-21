# Iteration 007 — Executability audit of the frozen patch list at the pinned blob

Run: `rsr-2026-09-21T08-45-54-679Z` · Mode: research · Iteration 7 of 10

## FOCUS

The prompt pack served the iteration-3 focus text (sentence-level prose sample, per-paragraph ownership map) for the fourth consecutive dispatch. Those artifacts were delivered as F-016/F-017 and independently validated in iteration 4 (F-021/F-022) against the same pinned README content; iteration 6 already recorded their re-execution as ruled out. Running them again would add evidence volume without signal.

The one check iteration 4 named as still open was a dry-run of F-024 §E against a scratch copy. A real dry-run requires writing outside this packet's allowed zone and rehearses the implementation the topic defers. Its read-only half does not: every F-024 item is anchored by line number to the pinned changelog blob, and those anchors had never been resolved against the blob's actual content. This iteration runs that half — an executability audit of the frozen handoff:

1. Do all F-024 line anchors still point at the claimed content at the pinned blob?
2. Are the edit anchors mechanically unique, or can two items collide on one token?
3. Do the fix targets exist, and are the "dead path" classifications true at HEAD?
4. Does the post-edit sweep (F-024 §E) have an exact line inventory to check against?

No implementation; the changelog, README and prior artifacts were read-only throughout.

## ACTIONS TAKEN

1. Re-verified both pins against the working tree: changelog sha256 `33abcc9a865e688189ce2a5cab458f838fc5a185e3d521aded0bed47b45fcb19`, commit `7076dba64b`; README `3ad5ca25fb98916cc8cfa740212dc03800595b21`; both clean in `git status`.
2. Re-measured the REQ-005 counts at HEAD: 18 H2 / 56 H4 / 19 `---` / 44 `&nbsp;` across 747 lines — the "after" side re-confirmed.
3. Resolved all 22 F-024 anchor lines (items 1–10 plus §C) against the actual blob content and matched each line to the item's claimed spelling or role.
4. Ran a uniqueness probe on every token the patch list keys on ("Six", "skill-advisor", "twenty-two", "496", "284", "six families", `.opencode`).
5. Probed the fix targets and all in-document `.opencode/*` paths at the repository root (`git rev-parse --show-toplevel`), including symlink status.
6. Enumerated the complete `.opencode` line inventory (11 lines); verified the drop target L738 has no H4 children and that the document's `.skilled` mentions number exactly two.

## FINDINGS

### F-030 — Anchor-resolution audit: all 22 F-024 anchors resolve at the pinned blob; the list is location-exact and not string-unique

Every anchor the patch list names was found at the line claimed, carrying the spelling or role claimed. Zero drift since the F-028 pin.

| Line | F-024 item | Text observed at the pinned blob | Status |
|---|---|---|---|
| 11 | item 10 (size props) | "a 28KB command or a 3,000-line template" | MATCH |
| 35 | item 10 + §C ("eighteen of the twenty-two") | "eighteen of the twenty-two hook packages" | MATCH |
| 36 | item 10 (outcome rewrite) | "The dispatch guards stop approving what they forbid." | MATCH |
| 50 | item 10 ("496→284") | "fell from 496 lines to 284" | MATCH |
| 58 | item 10 (mood sentence) | "You feel this change everywhere." | MATCH |
| 101 | item 1 | `.opencode/skills/system-spec-kit/runtime/cli/` | MATCH |
| 168 | item 7 (verify boundary) | "hoists state above the outermost `.opencode`" | MATCH |
| 188 | item 2 | `node .opencode/bin/skill-advisor.cjs <command>` | MATCH |
| 274 | §C (Cursor id count) | "Cursor carries 21 ids across six families." | MATCH |
| 295 | §C (178) | "178 recommendations" | MATCH |
| 310 | item 9 corroboration | "Seven separate CLI-orchestrator skills became one hub." | MATCH |
| 314 | item 9 corroboration | "The seven CLI-orchestrator skills live under one hub" | MATCH |
| 383 | item 10 (retitle) | `#### A Closed Roster, and Where It Is Narrower Than the Code` | MATCH |
| 393 | §C (cache history) | "Pi ran two forked cache extensions" | MATCH |
| 463 | item 3 + §C (102) | `.opencode/hooks/` and "102 relative symlinks" | MATCH |
| 660 | item 4 | `.opencode/skills/mcp-tooling/mcp-figma/` | MATCH |
| 705 | item 10 (pilot narration) | "Run on GLM-5.3-Flash and Sonnet 5 it showed…" | MATCH |
| 716 | item 5 | `.opencode/specs/` (source half) + `.opencode/skills/system-spec-kit/runtime/cli/` (target half) | MATCH |
| 717 | item 6 | `node .opencode/bin/skill-advisor.cjs` | MATCH |
| 730 | item 9 | "Six CLI-orchestrator skills became one hub" | MATCH |
| 738 | item 10 (drop section) | `## After This Draft`, with zero H4 beneath it | MATCH |
| 742 | item 8 | "Every `.opencode/*` path in this document still resolves…" | MATCH |

Uniqueness hazards — an item keyed on the bare token would match the wrong site:

- `Six` → lines 36, 60, 365, 730 (4 sites). Item 9's oldText must include `Six CLI-orchestrator skills`.
- `six families` → twice inside L274 alone ("Devin carries six families" / "Cursor carries 21 ids across six families"). The §C edit must include the `Cursor carries` prefix.
- `skill-advisor` → lines 188, 717, 729.
- `twenty-two` → lines 35, 357, 464.
- `496` and `284` → both also appear at line 687.
- `.opencode` → 11 lines (see F-032 inventory).

Unique anchors, for contrast: `178 recommendations` (295), `102 relative symlinks` (463), `After This Draft` (738), `A Closed Roster` (383).

Consequence: every mechanical item must carry whole-line (or wider) oldText. The six prose rewrites that F-024 inherits from F-016 (L11, L36, L50, L58, L383, L705) ship no oldText at all and require selection during implementation; they are the only items not mechanically executable from the list as written. This does not change any decision — it is the granularity constraint the implementation pass must honor.

### F-031 — Pins and fix targets re-verified at HEAD

| Check | Result |
|---|---|
| Changelog sha256 | `33abcc9a865e688189ce2a5cab458f838fc5a185e3d521aded0bed47b45fcb19` = F-028 pin exactly |
| Changelog commit | `7076dba64b` (2026-09-21 08:08:20), unchanged |
| Counts / size | 18 H2 / 56 H4 / 19 `---` / 44 `&nbsp;`; 747 lines |
| README pin | `3ad5ca25fb98916cc8cfa740212dc03800595b21` (2026-09-21 10:29:56), unchanged |
| Working tree | clean for both files |

Fix targets, probed at the repository root:

| Path | State |
|---|---|
| `.skilled/skills/system-spec-kit/runtime/cli` | EXISTS |
| `.skilled/bin/skill-advisor.cjs` | EXISTS |
| `.skilled/hooks` | EXISTS |
| `.skilled/skills/mcp-tooling/mcp-figma` | EXISTS |
| `.opencode/bin/skill-advisor.cjs` | MISSING (dead, as F-022 classified) |
| `.opencode/hooks` | MISSING (dead, as F-022 classified) |
| `.opencode/skills` | symlink → `../.skilled/skills` |
| `.opencode/specs` | resolves; not observed as a symlink itself at this pin |

The dead-path classifications behind items 2/3 and 6/7 hold at HEAD; items 1 and 4 are alias standardization, not repair. Every target the patch list sends the reader to exists.

### F-032 — L742's "every `.opencode/*` path in this document still resolves" is false at the pinned blob

The sentence claims every `.opencode/*` path "still resolves, as a git-tracked symlink alias into `.skilled/`". At the pinned blob, three in-document paths do not resolve at all:

- `.opencode/bin/skill-advisor.cjs` — absent (L188 and L717 instruct the reader to run it).
- `.opencode/bin/` — absent (L87).
- `.opencode/hooks/` — absent (L463).

The paths that do resolve are `.opencode/specs` and the `.opencode/skills/...` family (via the symlink above). So the reword must be scoped to "the paths that moved" or must enumerate the resolving ones; "every" is falsified, not merely imprecise. This upgrades F-022's classification from drift risk to already-wrong-as-written and SUPPORTS its correctness-class grading. The exact `.opencode` line inventory for the §E sweep is:

`25, 81, 87, 101, 168, 188, 463, 660, 716, 717, 742`

After the edits, `.opencode` should remain only on the deliberately historic or boundary lines and on the rewritten L742 — nowhere that instructs a reader to run or open a path today. The two document-wide `.skilled` mentions (L353, L742) make §E's "probe every remaining `.skilled/` mention" a two-path check, smaller than the section implies.

## QUESTIONS ANSWERED

None new. Q1–Q5 remain answered as recorded in iterations 3–6; F-030–F-032 are handoff assurance for the deferred implementation, not research answers. F-032 sharpens the F-022 edit scope without reopening Q4 (voice conformance) or Q1 (duplication).

## QUESTIONS REMAINING

None. The run is closed for the second time, now with the patch list's anchors proven to resolve and its uniqueness requirements named. The only remaining work is the deferred implementation pass.

## NEXT FOCUS

None. If the reducer dispatches again before implementation, the only non-duplicative action is re-running this iteration's pin-and-anchor check as a drift sentinel; everything else duplicates delivered and validated evidence. Pre-flight for implementation: confirm the changelog sha256 still equals `33abcc9a…`; if it differs, re-derive F-024 before applying it.

## SCOPE VIOLATIONS

None. Writes landed only in `research/iterations/iteration-007.md`, `research/deltas/iter-007.jsonl`, the gateway contract's temp file, and the gateway's own ledger refresh. All researched surfaces (`CHANGELOG-v4.0.0.0.md`, `README.md`, prior iteration artifacts, git queries, repository tree probes) were read only. Note: a first target-existence probe used a relative root that stopped at `specs/`; it was discarded and re-run from the repository root before any conclusion was drawn. Neither version modified a file.
