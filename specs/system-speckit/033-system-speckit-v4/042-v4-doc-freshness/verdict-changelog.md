---
title: "Changelog freshness verdict: CHANGELOG-v4.0.0.0.md"
date: 2026-09-19
---

# Changelog freshness verdict: `CHANGELOG-v4.0.0.0.md`

**Verdict: TARGETED CORRECTIONS, NOT A REWRITE.** The document's structure, narrative and
capability claims hold. What drifted is a set of counts, one retirement it predates, one
over-broad parenthetical, an incomplete rename list and the entire post-draft body of work.

## How this verdict was reached

Ten deep-research iterations ran on the `cli-devin` executor (`deepseek-v4-1-flash-max`) through
the `deep-research` workflow, with a hard ten-iteration ceiling and convergence recorded as
telemetry only. Evidence is the repository itself: files, live counters, `git log` and commits.

Two further dispatches then hardened the result: a synthesis pass on `gemini-3-8-flash-high`, an
independent review of that synthesis on `glm-5-3-flash-max`, and a bounded repair pass that
recovered README rows the synthesis had dropped. The review is what caught the one unsafe row in
the run's own apply list (see the README verdict, row B2).

Iteration narratives: `research/iterations/iteration-001.md` through `iteration-010.md`.
Consolidated tables: `iteration-009.md`. Final adjudication: `iteration-010.md`.

## Rows

Line numbers are as they stood before the correction pass.

### Applied

| # | Line | Claim that drifted | Current truth | Evidence | Correction applied | Confidence |
|---|---|---|---|---|---|---|
| A1 | L41, L511 | `mcp-tooling` has "nine modes" | Ten modes ship | `.skilled/skills/mcp-tooling/mode-registry.json` modes 0-9; ten `mcp-*` packet dirs, the tenth being `mcp-orca-cli` from commit `a3272f5944` | "nine modes" becomes "ten modes" in both places; the hub bullet now names the six workflow modes and four design transports | High |
| A2 | L26, L592 | The skill has "six `/deep:*` commands" and "the two benchmarks"; "The six modes behave as before" | Five commands and five modes ship | `.skilled/commands/deep/` holds `agent-improvement`, `ai-council`, `model-benchmark`, `research`, `review`; `.skilled/skills/system-deep-loop/mode-registry.json` modes 0-4 | "six" becomes "five"; "the two benchmarks" becomes "the benchmark"; L592 reads "The five modes behave as before." | High |
| A3 | L45, L553 | "Twelve repo rules" / "Twelve rule files" | Thirteen rule files ship | `repo-rules/` holds 13 files; `answer-the-actual-request.md` is routed by `REPO RULES.md:47` and was missing from the enumeration | Both counts become "Thirteen" | High |
| A4 | L45, L553 | The root document "fell from 496 lines to 283" | It is 284 lines | `wc -l AGENTS.md` returns 284 | Both figures become 284 | High |
| A5 | L433, L435 | `sk-code-mobile-cli` is one of the surface packets | It was retired | Commit `173ce63f59` retires it (2026-09-19); `sk-code` ships `sk-code-webflow`, `sk-code-opencode`, `sk-code-obsidian` | The packet is dropped from the L433 list and the mobile-cli sentence is deleted from L435 | High |
| A6 | L278 | "Hermes scans a linked directory in full, so symlinks were rejected on evidence" | Only the skills tree is a generated copy; the agent tree is a symlink | `.hermes/agents` is a git-tracked symlink to `../.skilled/agents`; `.hermes/skills` is a generated directory | The parenthetical is narrowed to the skills tree and now states the agent tree ships as a symlink into `.skilled/agents` | High |
| A14 | L579 | The renames-to-adopt list omits two reply-rule renames | Both renames happened | `repo-rules/` holds `communication-handoff.md` and `communication-decisions.md`; the old names are absent from the live rule set | Both renames added to the list | High |
| A13 + A15 | whole document | The document never names `.skilled`, and 231 commits of post-draft work are absent from every section | The source root is `.skilled/` and the work landed | `git rev-list --count 1d43dbd38b..HEAD` returns 231; the changelog contains zero `.skilled` matches; migration closed at `60f0e91764`, compat root settled at `8b2b831184` and `2a57cc635d`, aliases retired at `c34e1bd73b` | A new closing section, **After This Draft**, records the source-root move and the `.opencode/*` alias rule, the deep-loop ledger, protocol and admission work (`9e650decee`, `6e82579080`, `bbb7d23386`, `9365fbc83d`), the orca bridge and its follow-ups, the mobile-cli retirement and the documentation-correction commits | High |

### Closed with no edit

| # | Line | Claim | Verdict | Evidence |
|---|---|---|---|---|
| A7 | L278 | "bridges eighteen of the twenty-two hook packages" | Holds. Eighteen is right by count; the identity of the non-literal 18th bridge is unresolved and stays that way | 22 package dirs under `.skilled/hooks`; `.hermes/SYNC.md:87` names exactly four stay-outs. The string `session-lifecycle` appears in neither `SYNC.md` nor the plugin source, so no identity is claimed |
| A8 | L278 | "102 relative symlinks" | Holds | 101 git-tracked mode-120000 symlinks plus the `.opencode/hooks` alias = 102 inclusive |
| A9 | L45 | "forty registered rules" | Holds | `runtime/cli/lib/validator-registry.json` holds exactly 40 rows |
| A10 | L372 | sk-design chart forms | Holds at 29 | 29 chart templates ship |
| A11 | L372 | sk-design diagram types | Holds at 27 | 27 diagram type files plus a README |
| A12 | L577 | "your spec paths resolve through a compatibility symlink" | Holds | All nine `.opencode/*` root entries are git-tracked symlinks into `.skilled/` that survive a clone |
| A16 | L11, L90, L108, L114, L120, L228 | Pre-release numerics (28KB command, 3,000-line template, forty-two surfaces, twenty-two remediation children, 1,275 lines, forty-four alerts, 178 recommendations) | Not re-derivable; closed with no edit | The artifacts these counted no longer exist in a re-derivable form. Flagged, not corrected |
| A17 | L130 | Anchored root resolver and the specs-only deny-list | Claim stands as written; no replacement proposed | Closed at iteration 10 |
| A18 | L392 | "Joining the compiled closure is planned, not shipped" | Holds | `HUB_CHILD` in `compiled-route.cjs` enumerates five hubs and sk-design is absent from the engine, so the caveat still describes the serving cohort |
| A19 | L27 | "six hubs plus seven standalones" | Holds | 6 + 7 = 13, matching the shipped skill packets |
| A20 | L36-38 | Retirements listed under Drop removed surfaces | Holds on sampling | Each sampled item is absent from the live tree |
| A21 | L372 | sk-design's four modes | Holds | Four mode packets ship |
| A22 | L581 | `mcp-figma` moved under `mcp-tooling`; `storage/` became `database/` | Holds | Both moves are on disk |
| A23 | L581-585 | The removals list | Holds | No contrary evidence found |

### Recommended, not executed

**No rewrite.** The document's shape is sound; every defect above is local. A rewrite was never
required by the evidence, and the change set that satisfies it is the eight edits plus one
closing section listed under Applied.

## What the correction pass did not touch

Two adjacent defects stay outside this packet's scope and are recorded here rather than fixed:

- `cli-devin`'s `SKILL.md` roster line still lists only `deepseek-v4-flash-max`.
- `041-skilled-source-root-migration/spec.md` carries a stale continuity block (90%, "plan phases
  003 to 011" while 020 phases exist).
