---
title: "Iteration 4 — deepseek-04: Missed seams: the round-1 DeepSeek registry loss and hook surfaces outside the seam map (question 26, RQ6)"
trigger_phrases: []
---

# Iteration 4 — deepseek-04: Missed seams and the round-1 registry loss

## Focus

Angle **deepseek-04** (W2): *Missed seams: the round-1 DeepSeek registry loss and hook surfaces outside the seam map (question 26, RQ6).* Answers angle questions 1 to 5. W2 sibling check below; field names and counts only where private material is involved.

## Sibling check

- Read `research/lineages/grok/iterations/iteration-004.md` (iteration 4, the newest grok file). Its sibling check read only `deepseek/iteration-001.md` and saw no iteration 2; at my read time iterations 002 and 003 exist, so that view is superseded. Its angle is egress/secrets/R10, which does not overlap this angle; I neither contest nor restate it. One agreement worth naming: its F1's conclusion (both local assignment regexes miss `TYPESAFE_API_KEY=` / `SERVICE_TOKEN=`) matches BASE section 5 item 11; no new corroboration for me, and I did not rerun the expressions.
- `research/lineages/mimo/iterations/` still holds only iteration-001.md, read in my iteration 3; nothing newer to read.
- `research/lineages/swe/iterations/` holds no file.
- No sibling supplied a missed-seam claim to push past; this angle's ground was untouched by round 2 so far.

## Actions Taken

1. Extracted every round-1 deepseek iteration's headline findings with a read-only scan of all ten files under `../001-deep-research/research/lineages/deepseek/iterations/`; read `iteration-004.md` in full and reopened the residue candidates at their cited lines.
2. Read the round-1 deepseek `findings-registry.json` (11 ranked, 17 dropped, 8 keyFindings) for the reduction-loss comparison.
3. Scanned the surfaces named in the angle: the four hook families' READMEs, four OpenCode plugins, the Hermes repo-guards manifest, the sk-code-review script, `hvr_scan.py`, `/rewrite:response` and `/prompt:improve`.
4. Grepped the round-1 seam map and BASE for the same surface terms to establish what is genuinely absent from both.
5. No repository module was run; no `jev` call; no write outside this lineage.

## Findings

**F1 (answers question 26). The round-1 DeepSeek loss did not drop a verdict-changing finding.** Method: each of the ten round-1 iteration files' finding headlines was compared against BASE's recommendation records (R1-R21), its 43 What Not To Build rows and its Changes section. Every load-bearing finding has a record, a drop row or a mention; the residue — findings with no record, no drop row and no mention — is small and design-level:

| Lost/under-carried finding | Round-1 origin | Verified now | Would it change a verdict? |
|---|---|---|---|
| `parseGraderResponse` status vocabulary `ok`, `dim_mismatch`, `fallback_fenced`, `fallback_fenced_dim_mismatch`, `fallback_regex`, `fallback_score_only`, `failed` | `iteration-001.md` finding 2 | Reopened at `grader/harness.cjs:231-260` (I read `:231-260`; `dimMismatch` is part of the check) | No. R7 stays later; the vocabulary is reusable when a Jev grader is ever built. |
| Objective clamped to 4,000 chars in goal-core | `iteration-003.md` finding 6 | Reopened: `DEFAULT_MAX_OBJECTIVE_CHARS = 4000` at `goal-core.cjs:59`, used at `:598` | No. It bounds R2's later payload; no rank or gate moves. |
| No repository code spawns `jev` today; the first arm is the first programmatic caller | `iteration-007.md` finding 1 | Spot-checked: the routing-accuracy scripts spawn `git` and `python3` only (`capture-scorer-eval-baseline.mjs:122`, `capture-local-native-divergence-ledger.mjs:95`) | No. It supports R1's build-now ranking; BASE already implies it. |
| No server-side Jev cache is documented; only deadline-bearing survivor has a 10 s wrapper timeout | `iteration-009.md` findings 5 and 10 | Not reopened (round-1 only; no repo line to reopen) | No. Reaffirms row 30 and §9. |
| Wave-2 wiring-cost shortlist ranking | `iteration-006.md` finding 5 | Superseded by BASE's own ranking (V9) | No. |

The registry's 8-of-57 reduction explains why the registry alone looks thin; BASE's re-synthesis already read the iteration markdown, and this pass finds nothing BASE's records needed that they lack. **Question 26: resolved, no change.** [SOURCE: `../001-deep-research/research/lineages/deepseek/iterations/iteration-001.md`, `iteration-003.md`, `iteration-006.md`, `iteration-007.md`, `iteration-009.md`; `grader/harness.cjs:231-260`; `.skilled/hooks/goal/lib/goal-core.cjs:59`, `:598`; `routing-accuracy/capture-scorer-eval-baseline.mjs:122`]

**F2 (answers question 2 for the hook families). The four hook families are deterministic, fail-open (or fail-closed by design) routers; none hosts a typed judgment.**

| Surface | What it decides today | Deadline / failure mode | Reader | Jev fit |
|---|---|---|---|---|
| `post-edit-quality/` | Path-dispatch to checker scripts (comment hygiene, dist staleness, flowchart, frontmatter, placeholders, wikilinks); at most one checker per edit | Shared deadline; warn-only; every failure path resolves to no finding | The model, via the printed warning | **Drop.** Repository facts and formatting; no judgment; a model answer would be slower and weaker than the checks (`post-edit-quality/README.md:25-39`) |
| `session-lifecycle/` | Primes, restores and checkpoints continuity context; the post-compaction recovery chain that reads the cached brief | Fail-open; 30-minute cache TTL; token-pressure budget shrink | The model, via injected context | **Drop as new.** Its compact-brief recovery is the artifact R19's census measures; no new judgment beyond that (`session-lifecycle/README.md:19-49`) |
| `directive-lifecycle/` | Decides `full` or `suppressed` delivery of the advisor's constant directive block, per session | Fail-open; durable per-session store | The model, indirectly | **Drop.** Bookkeeping over a text block; no meaning to judge (`directive-lifecycle/README.md:19-40`) |
| `permission-policy/` | Devin `PermissionRequest` allow/deny from write-target and dispatch hard-rule cores | **Fails closed**; deny is the safe default | Devin, then the operator | **Drop, must not replace.** Safety decision on repository facts; Q11 (`permission-policy/README.md:19-40`) |

**F3 (answers question 2 for the plugins). The plugin surfaces are the same two classes: deterministic guards and presentation projections.**

- `system-deep-loop-guard.js` enforces dispatch policy from `mode-registry.json` and fails open on its own errors; it is the OpenCode side of the guard core BASE row 12 already drops (`system-deep-loop-guard.js:1-60`).
- `sk-communication-projection.js` replaces assistant text with a projected copy when opted in; it restores the byte-exact original on every non-accept terminal, fails open, declares `egressConsent: false` and an empty privacy allowlist, and currently falls back to the exact original because the chat.message seam exposes no transcript (`sk-communication-projection.js:20-43`). **Drop:** it is a display projection with a byte-fidelity contract; a Jev rewrite adds egress of assistant text and removes the determinism the original-restore path guarantees.
- `.hermes/plugins/repo-guards/` bridges the *same* shared cores into Hermes (dispatch preflight, gate classification, advisor brief, git advisory, post-edit advisory, completion nudge) — a delivery adapter, not a new decision surface (`plugin.yaml:1-14`).
- `sk-code-review/scripts/check-rule-copies.js` is a doc-drift checker over duplicated rules; repository facts, no judgment.

**F4 (new; answers question 3 and question 5). The one genuinely missed surface is the Human Voice Rules scan's documented reader-needed gap — absent from the seam map, absent from BASE, and drivable offline.** `hvr_scan.py` covers only "the findings a machine can settle without reading for meaning": punctuation bans, hard blockers and soft deductions; its own docstring lists what it does NOT cover — "three-item enumerations, triple headers, synonym cycling, false ranges, fragmented headers, copula avoidance, significance inflation, generic conclusions and personality" — and says the printed subtotal "is a floor on the deductions, never the document's score" (`hvr_scan.py:1-29`). A `noul` per reader-needed category (or a `score` over the standard's severity bands) is exactly a lens for the half the scanner admits it cannot see, and the scanner's `--json` output is a ready evaluation shape. `rg` over the round-1 seam map and BASE for `hvr`, `human voice`, `rewrite`, `projection` and `sk-prompt` finds no mention of this surface in either (the two matches for `projection` are the advisor's `projection.ts`; `rewrite` matches only history rewriting). See the per-idea record. [SOURCE: `.skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py:1-29`; `../001-deep-research/context/seam-map.md` (no matches); BASE (no matches)]

**F5 (answers question 3's runner-up and question 4).** `/rewrite:response` is contractually in-context — "Uses no local or external LLM providers" — and display-only, so a Jev engine would break its own contract (`rewrite/response.md:16-24`); drop. `/prompt:improve` routes to sk-prompt, whose CLEAR scoring is the executing model's; a cross-family Jev second score is conceivable but has no labels and no decision it would gate — drop for now, keep as the runner-up behind F4's seam. Neither surface appears in the seam map. [SOURCE: `.skilled/commands/rewrite/response.md:16-24`; `.skilled/commands/prompt/improve.md:1-30`]

**F6 (answers question 4). Which of these must Jev never replace.** The permission-policy deny path and the dispatch guard's block path decide on repository facts with safety semantics and fail-closed defaults (`permission-policy/README.md:19-40`; `system-deep-loop-guard.js:44-60`); the projection's exact-original restore and the post-edit checkers' warn-only contract are deterministic guarantees a model answer would soften; and the session/directive hooks are bookkeeping whose failure mode is already chosen. BASE row 12 and its Q11 cover these as a family; this iteration adds the projection and permission surfaces to that family. [SOURCE: F2/F3 sources]

## Per-Idea Records

### N-deepseek-04-1: A reader-needed-categories lens beside `hvr_scan.py` (the best checklist result of this angle)

- **Idea:** `N-deepseek-04-1`. For each reader-needed HVR category (synonym cycling, significance inflation, false ranges, fragmented headers, copula avoidance, generic conclusions, personality), one `noul` per flagged section — or one `score` over the standard's severity bands — asked offline over a document the operator names, as a candidate list beside the deterministic scan. Type: `noul` (or `score`).
- **Builds on:** Angle question 5; the scanner's own declared blind half; operator idea 1's grading family.
- **Value:** The operator gets candidate lines for the categories the machine cannot settle, with the standard as the rubric, instead of a subtotal that is only a floor. The decision it informs: which passages to rewrite before a doc ships.
- **Seam:** `hvr_scan.py:1-29` (the gap statement and `--json` output shape); the rubric is the HVR standard the scanner parses (`hvr-rules.md`, named at `hvr_scan.py:15-19`, not reopened here).
- **Metric, baseline, harness:** Baseline: the scanner's own floor and no measurement of the reader-needed categories. Metric: per-category precision and recall against operator labels; the scan's `--json` findings as the deterministic column. Smallest missing harness: a labeled set of about 50 passages, positive and negative per category; H13-adjacent but its own rubric.
- **Cost, latency, privacy:** Offline; one call per section or document; no deadline. Document prose leaves the machine (operator-authored docs; medium), so the payload is named before the first call and the switch is per-run.
- **Key gate and no-key behavior:** Its own flag (proposed `--jev`), the three D5 checks in order; with the gate failing it prints `jev arm skipped: <check>` and the scan's existing output is byte-identical. Exit 3 stops the arm; exit 4 one backoff then the section is unmeasured; malformed answer unmeasured; exit 2 stops, since the script built a bad command.
- **Rough LOC:** About 80–140 LOC as a sibling script beside the scanner plus the labels (estimate).
- **Verdict:** **later.** It passes the checklist except Q1: no labels exist yet, and no decision changes until precision is known. It is the best of this angle's candidates because the blind half is documented by the tool itself.
- **Confidence:** The gap statement is confirmed from the scanner's docstring; that Jev agrees with a human reader on those categories is UNKNOWN and would be confirmed by the labeled set.

### Dropped: Jev in the projection, permission, guard or checker surfaces

- **Idea:** no surviving form for `sk-communication-projection.js` (byte-fidelity and no-context constraints), `permission-policy` (fail-closed safety, Q11), `system-deep-loop-guard.js` (repository-fact policy, BASE row 12), `check-rule-copies.js` and the post-edit checkers (deterministic doc/file facts), `/rewrite:response` (its contract forbids external providers).
- **Verdict:** **drop each** with the reason at its row above.

## New against baseline

| Claim | new, contests BASE, confirms BASE with new evidence, or restated | Evidence |
|---|---|---|
| Question 26: no verdict-changing finding was lost in round 1 | new (resolves BASE open question 26) | F1 table and reopened lines |
| The hook families are deterministic routers with no typed judgment | new (confirms row 12's family for two more surfaces) | F2 table |
| The projection plugin and `/rewrite:response` are contractually in-context/byte-exact; Jev must not replace them | new | `sk-communication-projection.js:20-43`; `rewrite/response.md:16-24` |
| The HVR scan's reader-needed half is a missed seam in neither the seam map nor BASE | new (RQ6) | `hvr_scan.py:1-29`; seam-map and BASE greps |
| Wave-2 wiring order and the registry residue: no rank moves | confirms BASE with new evidence | F1 |

## Hand-off

- Iteration 5 is the engineering failure-mode pass over the survivors; carry forward the HVR seam as a `later` candidate only, and the projection/permission drops as new family members of row 12's reasoning.
- The synthesis should mark question 26 resolved with the F1 table, and should not reopen R7, R2, R1 or R8 on account of the registry loss.
- If swe-04 writes the skip-line table, my N-deepseek-01-2 (key-origin line) and N-deepseek-01-3 (per-code table) still wait on it; this iteration adds no new contract-line proposal.
