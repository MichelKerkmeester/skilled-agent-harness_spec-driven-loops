---
title: "Deep Review Iteration 006 - maintainability"
description: "Maintainability pass over the hub's documentation and metadata surface: changelog claims against the tree, version authority, the global changelog tree, and the benchmark run indexes."
importance_tier: normal
contextType: review
iteration: 6
dimension: maintainability
sessionId: fanout-vibe-1-1795504079797-ay97sx
generation: 1
lineageMode: new
---

# Deep Review Iteration 006 - Maintainability

## Dispatcher

- **Agent**: `@deep-review` (LEAF, single iteration, no nested dispatch)
- **Lineage**: `vibe-1`, sessionId `fanout-vibe-1-1795504079797-ay97sx`, generation 1, lineageMode `new`
- **Artifact directory**: `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/review/lineages/vibe-1`
- **Review target**: `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub` (spec-folder)
- **Dimension**: maintainability (the last unreviewed dimension)
- **Operator review focus**: every phase's shipped work against its goal criteria, including the phase 014 fixes and the advisor scorer change it made. This iteration addressed the focus by auditing the phase-014 release note (`changelog/v1.1.2.0.md`) and the run report it cites as its evidence, which is the documentation trail the 014 fixes ship with.
- **steer.md**: absent at the time of this iteration (re-checked before reading sources); no lead ruling applied.

## Files Reviewed

| File | What was checked |
|---|---|
| `.skilled/skills/mcp-browser-use/changelog/v1.1.2.0.md` | Every claim in "What's New at a Glance" against the tree and the cited CSV |
| `.skilled/skills/mcp-browser-use/changelog/v1.1.1.0.md` | The 403 Forbidden fix claim and the global changelog tree claim |
| `.skilled/skills/mcp-browser-use/benchmark/reports/README.md` | The run index against the run folders on disk |
| `.skilled/skills/mcp-browser-use/benchmark/reports/compiled-routing/2026-11-24--two-stage-replay--compiled/README.md` | The row inventory claim against `results.csv` |
| `.skilled/skills/mcp-browser-use/benchmark/reports/compiled-routing/2026-11-24--two-stage-replay--compiled/results.csv` | 49 rows parsed; verdict tally, negative-row counts, before/after actions, advisor confidences |
| `.skilled/skills/mcp-browser-use/graph-metadata.json` | Edge, domain, intent-signal and derived-block coherence; alias removal |
| `.skilled/skills/mcp-browser-use/description.json` | Version field and keyword set against the changelog's five-copy claim |
| `.skilled/skills/mcp-browser-use/mode-registry.json` | Version field and alias removal |
| `.skilled/skills/mcp-browser-use/ROUTER.md` | Version field, the narrow-alias note, and the keyword maps |
| `.skilled/skills/mcp-browser-use/SKILL.md` | Version authority statement |
| `.skilled/changelog/mcp-browser-use/` | The four symlinks the v1.1.1.0 entry claims |
| `.skilled/changelog/mcp-tooling/` | Absence of browser-mode leftovers |

## Findings - New

### P0 Findings

None.

### P1 Findings

None. The maintainability surface is materially sound: version authority is consistent across four files, the global changelog tree is correct, and the alias-removal claim holds in all five copies. The two defects below are documentation-accuracy drift with no behavioral consequence, so they are recorded at P2 rather than inflated.

### P2 Findings

1. **Benchmark run index omits the newest run folder, including the run the release note cites as its evidence** -- `.skilled/skills/mcp-browser-use/benchmark/reports/README.md:18` and `:24-28` -- The index states its own invariant at `:18`: "Each row below is one run folder." Four run folders exist under `benchmark/reports/`, but the RUN INDEX at `:24-28` carries three rows, and the newest row is dated 2026-11-21. The unlisted folder is `compiled-routing/2026-11-24--two-stage-replay--compiled/`, which holds a complete run (`README.md`, `results.csv`, `skill-benchmark-report.json`, `source.md`) and is the exact path `changelog/v1.1.2.0.md:32` names as the record of the before and after numbers. A reader who enters through the index sees the alias-tightening replay as never recorded, and the release note's evidence pointer resolves to a folder the index denies exists.
   Finding class: documentation-index drift
   Scope proof: both sides read directly -- `find .skilled/skills/mcp-browser-use/benchmark/reports -maxdepth 2 -type d` returns four run folders; `grep -c '^| 2026' benchmark/reports/README.md` returns 3; `grep -n '11-24' benchmark/reports/README.md` returns only the 2026-11-21 row.
   Affected surface hints: `.skilled/skills/mcp-browser-use/benchmark/reports/README.md` (add one row); no code, registry or routing surface.
   Case: an operator reads `changelog/v1.1.2.0.md:32`, follows the cited path, then opens the parent index to compare against the earlier runs and finds no row for the run they just read.

2. **The phase-014 release note misstates all three of its out-of-domain counts** -- `.skilled/skills/mcp-browser-use/changelog/v1.1.2.0.md:33-34` -- The changelog's evidence bullets give three numbers, and each disagrees with the CSV it cites. Line 33 says "all 11 out-of-domain prompts from the earlier runs. It routed 8 of them before"; `results.csv` holds 9 such rows (`MBU-N-01` through `MBU-N-09`), of which 6 carried `before_route_action=route` and all 9 now carry `route_action=defer`. Line 34 says "Eight out-of-domain prompts still reach 0.82 or more at the advisor stage"; the CSV holds 9 negative rows with `advisor_top_confidence >= 0.82` (`MBU-N-02`, `-03`, `-04`, `-07`, `-08`, `-09`, `-13`, `-14`, `-18`). The cited report repeats the same inventory error at `benchmark/reports/compiled-routing/2026-11-24--two-stage-replay--compiled/README.md:15`, which names "MBU-N-01 to MBU-N-11" although the CSV contains no `MBU-N-10` or `MBU-N-11`. The underlying evidence is present and correct; only the summary layer is wrong.
   Finding class: documentation-accuracy drift
   Scope proof: `results.csv` parsed with a quote-aware CSV reader -- 49 rows, 48 PASS, 1 FAIL (`MBU-PB-04`, `kind=playbook`, `stage1=false`); negative rows enumerated individually and counted by predicate rather than by eye.
   Affected surface hints: `.skilled/skills/mcp-browser-use/changelog/v1.1.2.0.md:33-34` and `benchmark/reports/compiled-routing/2026-11-24--two-stage-replay--compiled/README.md:15`; no code or routing surface.
   Case: an operator accepting phase 014 quotes "11 prompts, 8 routed before" in a sign-off, and a later auditor who re-derives the numbers from the CSV cannot reconcile the release note with its own evidence.

## Traceability Checks

| Check | Result | Evidence |
|---|---|---|
| `spec_code` (core) | pass (carried from iteration 2) | Criterion 2 holds; phase 005's compiled-serving claim holds |
| `checklist_evidence` (core) | partial (carried from iteration 2) | Criterion 5 holds per mode but not for a combined three-mode request; the admission corpus never tests it (R1-P1-001, R2-P1-001) |
| `skill_agent` (overlay) | pending | Not reached in this dimension |
| `agent_cross_runtime` (overlay) | pending | Not reached in this dimension |
| `feature_catalog_code` (overlay) | pending | Not reached in this dimension |
| `playbook_capability` (overlay) | pending | Not reached in this dimension |

Changelog claims checked against the tree in this iteration:

| Claim | Source | Verdict |
|---|---|---|
| Bare `aside`, `lighthouse`, `har file`, `export a har`, `performance trace`, `rb status`, `rb attach` gone from every vocabulary copy | `changelog/v1.1.2.0.md:22` | Holds. `grep -E '"(aside\|lighthouse\|har\|rb)"'` over `hub-router.json`, `mode-registry.json`, `ROUTER.md`, `graph-metadata.json`, `description.json` returns only verb and page forms (`as a har file`, `record a performance trace`, `capture a performance trace`, `chrome performance trace`). |
| All five copies changed together | `changelog/v1.1.2.0.md:24` | Holds for the removal. `description.json` carries the replacement forms `use aside` and `record a performance trace`; it is a 17-keyword surface by design and does not carry every form. |
| Tie-break paraphrases now reach Aside and Bladebro | `changelog/v1.1.2.0.md:26-28` | Holds. `results.csv` rows `MBU-P-01` (hub confidence 0.9161, lane `explicit_author`) and `MBU-P-03` (0.8751) both route correctly; both carried `before_verdict=FAIL` with `before_hub_confidence=0`. |
| Recorded tie-break rows moved to 0.8482 and 0.8525 | `changelog/v1.1.2.0.md:29` | Holds exactly. `MBU-T-01` = 0.8482, `MBU-T-02` = 0.8525. |
| Front door defers on all 11 earlier out-of-domain prompts; routed 8 before | `changelog/v1.1.2.0.md:33` | Fails. 9 rows, 6 routed before. Finding 2. |
| Eight out-of-domain prompts still reach 0.82 or more at the advisor stage | `changelog/v1.1.2.0.md:34` | Fails. 9 rows. Finding 2. |
| The two-stage replay records the before and after numbers | `changelog/v1.1.2.0.md:32` | Holds for the folder; the folder is missing from the index. Finding 1. |
| Post-review hub routing run passed 7 of 7 and supersedes the earlier run | `changelog/v1.1.1.0.md:23-25` | Holds. Index row at `benchmark/reports/README.md:26` records 7 PASS and names the superseded FAIL run. |
| Global changelog tree links `parent` and all three modes | `changelog/v1.1.1.0.md:27-28` | Holds. `.skilled/changelog/mcp-browser-use/` holds four symlinks (`parent`, `mcp-chrome-devtools`, `mcp-aside-devtools`, `mcp-bladebro`), each resolving into `../../skills/mcp-browser-use/`. |
| The two links left under `mcp-tooling/` are gone | `changelog/v1.1.1.0.md:29` | Holds. `.skilled/changelog/mcp-tooling/` holds `mcp-click-up`, `mcp-figma`, `mcp-mobbin`, `mcp-notion`, `mcp-obsidian`, `mcp-refero`, `parent` -- no browser mode. |
| Version authority: `SKILL.md` version matches the newest changelog entry and the hub metadata files | `SKILL.md:18` | Holds. `SKILL.md:5`, `description.json:4`, `mode-registry.json:3` and `ROUTER.md:9` all read `1.1.2.0`, matching `changelog/v1.1.2.0.md:9`. |

## Integration Evidence

- `.skilled/skills/mcp-browser-use/benchmark/reports/README.md` -- the hub's run index, reviewed as the discovery surface for every recorded run.
- `.skilled/skills/mcp-browser-use/benchmark/reports/compiled-routing/2026-11-24--two-stage-replay--compiled/` -- the phase-014 evidence run, reviewed as the source the release note cites.
- `.skilled/changelog/mcp-browser-use/` -- the global changelog tree, reviewed as the downstream packaging surface the v1.1.1.0 entry claims.
- `.skilled/skills/mcp-browser-use/changelog/v1.1.2.0.md` -- the phase-014 release note, reviewed as the operator-facing summary of the fix under review.

## Edge Cases

- **Ambiguity: which count the changelog means by "out-of-domain prompts from the earlier runs".** The report at `.../README.md:15` scopes the before/after set to `MBU-N-01 to MBU-N-11`, so the changelog's "11" is consistent with the report's prose and inconsistent with the CSV. I resolved it against the CSV, because the CSV is the recorded execution evidence and the report's own pass rule is defined over CSV columns. Recorded as finding 2 rather than as an unresolved contradiction.
- **Ambiguity: whether `description.json` is a vocabulary copy for the five-copy claim.** The changelog names it as one of five. It carries two of the five replacement forms and none of the tie-break paraphrases, yet the tie-break rows pass at stage one. The advisor therefore reaches the hub through a surface other than `description.json` keywords -- `graph-metadata.json` intent signals carry both paraphrases at `:120-122`. I did not raise this as a finding: the five-copy claim is about the removal, which holds, and the advisor's actual keyword source is the subject of the carried P1 R4-P1-001, which synthesis rechecks.
- **Observation deferred to iteration 7: `MBU-N-12` routes after the change with `hub_confidence` 0.** It is the only one of 16 negative rows that does not defer. It passes under the report's stated rule (a negative passes when the advisor does not return the hub at 0.8 or above), so it is not a documentation defect, but a front door that routes a prompt the advisor scored zero is a stage-2 behavior worth a correctness look. Recorded here rather than raised, because this iteration's dimension is maintainability and the row needs a correctness read of `router.cjs` to classify.
- **Partial success, stated honestly.** The maintainability dimension was sampled, not swept: the four changelog entries were read for v1.1.2.0 and v1.1.1.0 in full and v1.1.0.0 and v1.0.0.0 not at all, and the three mode packets' own changelogs were not read. The two findings are exact for the surfaces read; the unread changelog entries are unverified, not clean.

## Confirmed-Clean Surfaces

- **Version authority is consistent.** `SKILL.md:5`, `description.json:4`, `mode-registry.json:3` and `ROUTER.md:9` all read `1.1.2.0`, matching the newest changelog entry. The `SKILL.md:18` statement that this must hold is true of the tree.
- **The alias-removal claim holds in all five named copies.** No bare `aside`, `lighthouse`, `har` or `rb` alias survives in `hub-router.json`, `mode-registry.json`, `ROUTER.md`, `graph-metadata.json` or `description.json`. `ROUTER.md:37` documents the rule that produced the removal.
- **The global changelog tree is correct.** `.skilled/changelog/mcp-browser-use/` holds exactly `parent` plus the three modes as symlinks into `../../skills/mcp-browser-use/`, and `.skilled/changelog/mcp-tooling/` holds no browser-mode entry.
- **`graph-metadata.json` is internally coherent.** `schema_version` 2, one `depends_on` edge to `mcp-code-mode` with a context string that explains why it is not a hub member, one `enhances` edge to `sk-code`, empty `siblings`/`conflicts_with`/`prerequisite_for`, and a `derived` block whose `source_docs` and `key_files` name only paths that exist. `created_at` 2026-11-21 and `last_updated_at` 2026-11-24 bracket the change correctly.
- **The v1.1.1.0 entry's three claims all hold** (7-of-7 post-review run, the four-symlink changelog tree, the removed `mcp-tooling` links).
- **The replay CSV's headline tally is correct.** 49 rows, 48 PASS, 1 FAIL, and the single failure is `MBU-PB-04` at stage one only, exactly as the report states.

## Ruled Out

- **"The changelog's five-copy claim is false because `description.json` lacks the tie-break paraphrases."** Ruled out. The claim at `changelog/v1.1.2.0.md:24` is scoped to the alias removal, and the removal holds in all five files. The paraphrase claim at `:26-28` is a routing claim, and it is verified by the CSV rows, not by keyword presence.
- **"`graph-metadata.json` is stale after the alias change."** Ruled out. `last_updated_at` is 2026-11-24, the removed aliases are absent, and the added paraphrases are present at `:120-122` and again in the `intent_signals_generated` block at `:280-282`.
- **"The hub's version fields drifted from the changelog."** Ruled out. All four read `1.1.2.0`.
- **"The global changelog tree still points at the pre-relocation `mcp-tooling` paths."** Ruled out. The four symlinks resolve into `../../skills/mcp-browser-use/`, and `mcp-tooling/` holds no browser mode.
- **"The 2026-11-24 replay report is missing or incomplete."** Ruled out. The folder holds `README.md` (11,843 bytes), `results.csv` (10,512 bytes), `skill-benchmark-report.json` (41,972 bytes) and `source.md` (2,570 bytes). Only its index row is missing.

## Next Focus

- **Dimension**: cross-reference convergence pass (all four dimensions)
- **Focus area**: the remaining core and overlay protocols -- `skill_agent`, `agent_cross_runtime`, `feature_catalog_code`, `playbook_capability` -- plus the deferred `MBU-N-12` stage-2 routing observation and a recheck of the four carried P1 findings against current file content.
- **Reason**: maintainability is now reviewed, so all four dimensions are covered. Iteration 7 is the last permitted by `maxIterations: 7`, and four overlay protocols are still `pending`; the convergence pass is the only place they can be closed.
- **Rotation status**: correctness, security, traceability and maintainability complete; cross-reference remains.
- **Blocked/productive carry-forward**: productive -- parsing the CSV with a quote-aware reader turned three prose claims into three exact counts in one call, which is what surfaced finding 2.
- **Required evidence**: a named surface per overlay protocol, and current file:line for each of R1-P1-001, R2-P1-001, R3-P1-001 and R4-P1-001 so synthesis can confirm they are still active rather than assuming it.
- **Recovery note**: if the overlay protocols have no shipped surface in this packet, record them as `notApplicable` with the reason rather than leaving them `pending`, so the STOP gate does not read an unclosed protocol as an unverified one.

Review verdict: CONDITIONAL
