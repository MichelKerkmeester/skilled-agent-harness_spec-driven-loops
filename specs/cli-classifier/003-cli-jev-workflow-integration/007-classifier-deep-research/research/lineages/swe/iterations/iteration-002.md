---
title: "Iteration 2: sk-doc's validators as code — every template-alignment check and its residue"
trigger_phrases: []
---
# Iteration 2: sk-doc's validators as code — every template-alignment check and its residue

**Angle:** swe-02 · **Lens:** code-level slice design · **Maps to:** D

Independent: no round-3 sibling file read.

## Focus

Map every template-alignment check in sk-doc — what it asserts, its `file:line`, and what judgment remains after it passes — then characterize the residue a classifier could judge. Covers `validate_document.py` + `template-rules.json`, `extract_structure.py`'s `calculate_dqi`, `quick_validate.py`, `validate_skill_package.py`, `frontmatter-version.mjs`/`check-frontmatter-versions.sh`, `hvr_scan.py`, and the naming scripts.

## Actions Taken (opened this iteration)

- `.skilled/skills/sk-doc/shared/scripts/validate_document.py` (exclusions `:158-187`, rules load `:194-207`, type detection `:210-256`, `validate_toc` `:431-502`, fence tracker `:509-534`, structure env gate `:537-540`, agent frontmatter `:1216-1299`, command frontmatter `:1302-1432`, code-folder durability `:1094-1113`, `validate_code_folder` `:1116-1152`, dispatch `:1435-1537`)
- `.skilled/skills/sk-doc/shared/assets/template-rules.json` (whole file via `json.load`: 12 documentTypes, validationRules, severityDefinitions, autoFixRules)
- `.skilled/skills/sk-doc/shared/scripts/extract_structure.py:899-1186` (CONTENT_THRESHOLDS `:903-944`, `calculate_dqi` `:947-1158`)
- `.skilled/skills/sk-doc/shared/scripts/quick_validate.py` (`validate_skill` `:143-269`)
- `.skilled/skills/sk-doc/sk-create-skill/scripts/validate_skill_package.py` (`main` `:187-306`, `check_compiled_routing_state` `:63`)
- `.skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:1-55` (verb contract, `VERSION_RE` `:41`, `SCOPE_SUBTREES` `:50`), `check-frontmatter-versions.sh` whole (execs `gate` mode `:40`)
- `.skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py:1-80` (coverage boundary `:13-21`, `MINIMUM_TERMS` `:61-67`, exits `:37-38`)
- `.skilled/skills/sk-doc/shared/scripts/` listing: five `check_*.py` naming scripts; `.claude/agents/` (10 files), `.skilled/commands/` (mixed roots) inventories

## The check map

| Check | Doc types | What it asserts | `file:line` | Judgment residue after it passes |
|---|---|---|---|---|
| `detect_document_type` | all | Path→type classification; `/specs/`→spec, `/agents/`→agent, `readme.md`/`skill.md` suffixes; **silent `readme` fallback** | `validate_document.py:210-256` (`:255`) | Whether the detected type is *right* — a doc in a novel location gets minimal rules with no flag |
| `should_exclude_path` | all | Fixture trees skip entirely | `:158-187`, honored `:1454-1469` | Whether a non-fixture doc was wrongly skipped (returns `valid:true, skipped:true`) |
| `validate_toc` | types with `tocRequired` | TOC section exists, double-dash anchors, uppercase entries (auto-fixable) | `:431-502` | Whether TOC entries point at the right sections semantically |
| `validate_h2_headers` | all with H2 rules | Numbered `N. ALL CAPS` H2 style per rules | `:627-728` | Whether the section order tells a story vs satisfies a pattern |
| `validate_general_structure` | all except code_folder | Env-gated (`SKDOC_ENFORCE_STRUCTURE`) structural check | `:537-540`, `:562-627` | Off by default unless env set — a whole layer that may not run |
| `validate_required_sections` | all | Required/recommended sections present via alias-normalized matching | `:728-833` | Presence ≠ content: `## RULES` with wrong rules passes |
| `validate_feature_catalog_table` | feature_catalog | Type taxonomy + placeholder rows | `:1159-1215` | Whether catalog entries describe real, current behavior |
| `validate_agent_frontmatter` | agent | Runtime-split schema: `.claude/agents/` needs `tools:` (blocking; `permission:` ignored→warn), `.opencode`/`.skilled` needs `permission:` (blocking; `tools:`→warn) | `:1216-1299` | Whether the listed tools are the *least-authority* set — schema presence never judges the list's contents |
| `validate_command_frontmatter` | command | Presence-conditional; description single-line/length/TODO/angle-brackets, argument-hint budget, non-FQ MCP tokens blocking, `$ARGUMENTS` echo warning | `:1302-1432` | Whether `description` actually routes the command (trigger fit) — a length cap never reads meaning |
| `validate_code_folder` | code_folder | Numbered OVERVIEW, no TOC/ANCHORs, tree-vs-flat inventory, referenced files exist, durability regexes (packet/phase/ADR/commit/specs-path) skip fenced lines | `:1116-1152`, `:1094-1113` | Whether the tree/inventory is *current* vs merely present |
| Naming checks | authored docs | kebab names, no snake_case, no numbered categories/snippets, no hyphenated catalog content | `shared/scripts/check_*.py` (5 scripts) | Boundary cases the regex can't see (a "not-numbered" name that is still ordinal) |
| `quick_validate.validate_skill` | skill/command | Frontmatter presence, name hyphen-case, description single-line/length/`<>`/TODO, allowed-tools array form (skills), non-FQ MCP (blocking for command, **warn for skill** `:249-251`), 4-part version required for skills | `quick_validate.py:143-269` | Same description-routing residue; severity asymmetry between kinds is a policy call baked into code |
| `validate_skill_package` | standalone/parent | Kind coupling: `mode-registry.json` XOR `hub-router.json` fails explicitly; parents also run `check_compiled_routing_state` + `parent-skill-check.cjs` | `validate_skill_package.py:187-306` (`:213-232`, `:259-284`) | Whether declared modes/route signals are *sensible*, not just consistent |
| `frontmatter-version` (compute/apply/verify/gate) | in-scope skill docs | 4-part `version` field, deterministic from git state; frontmatter-less docs skipped | `frontmatter-version.mjs:1-55`, `check-frontmatter-versions.sh:40` | Whether a version bump *should* fire for a semantic-only change — git diff decides, meaning never consulted |
| `hvr_scan.py` | prose docs | Mechanical subset only: punctuation bans, §6 hard words, §7 phrases, §8 soft deductions; fail-closed `MINIMUM_TERMS` floors | `hvr_scan.py:13-21`, `:61-67` | **All of HVR §2/§4/§5 by its own docstring**: three-item enumerations, triple headers, synonym cycling, false ranges, fragmented headers, copula avoidance, significance inflation, generic conclusions, personality — "the printed subtotal is a floor on the deductions, never the document's score" |

## DQI anatomy (`extract_structure.py:947-1158`)

100% deterministic, 40/30/30 split: **Structure** = checklist pass rate × 40 (`:986`); **Content** = word-count band (`:994-1009`), H2 count+density (`:1011-1030`), ≥3 code blocks→6 (`:1032-1043`), tables+lists→3 (`:1045-1057`), 2+ internal +1 external links→3 (`:1059-1073`); **Style** = numbered+all-caps H2 rate ×12 (`:1080-1097`, changelog exempted `:1082-1087`), divider count (`:1099-1110`), −2/style issue from 8 (`:1112-1117`), intro paragraph 4 (`:1119-1124`). Bands: ≥90 excellent / ≥75 good / ≥60 acceptable / else needs_work (`:1132-1143`).

**Where a doc scores well and reads badly**: every input is a count. A doc with required sections, in-band word count, three code blocks, a table, two links, numbered caps H2s and an intro lands ≥90 while making false claims — no input touches truth, currency, or voice. The band boundary at 75/60 is a threshold artifact: 74 vs 76 flips the label on one divider.

## Conventions the repository states but no script checks

| Convention | Source of the rule | Why no check exists |
|---|---|---|
| HVR §2/§4/§5 voice rules (enumerations, synonym cycling, copula avoidance, significance inflation, personality) | `hvr_scan.py:17-21` docstring + `references/hvr-rules.md` | Declared unmachineable by the scanner's own design |
| Description↔body consistency (does the frontmatter `description:`/`trigger_phrases` match what the doc does) | `quick_validate.py:208-235` checks only length/format | Needs meaning-level comparison |
| Agent `tools:` least-authority *content* (is the listed set minimal and correct) | `validate_agent_frontmatter:1216-1299` checks presence only | Needs the agent's actual tool needs — a judgment |
| Citation drift (a doc's `file:line` references still saying what the doc claims) | `reference_checker*.py` checks link shape/target existence, not claim fidelity | Needs reading the target for meaning — exactly what the synthesis ledger does by hand |
| Doc-type misclassification (novel location → silent `readme` rules) | `validate_document.py:255-256` | The fallback is the defect: silent downgrade, no flag |

## The residue as classifier candidates

Per residue, the smallest sibling script that judges it without editing the validator (all advisory, exit-0, never wired into the validator's exit path):

| # | Residue | Judgment | Sibling script sketch | Rough LOC |
|---|---|---|---|---|
| R-a | HVR §2/§4/§5 residue | `noul` per rule per section ("does this section cycle synonyms?") or one `score` per section | `hvr-residue-scan.mjs`: splits a doc into sections (reuse `_fenced_line_numbers` port ~40 LOC), posts one question per (section × rule) via the two-backend client, aggregates into the same point model | ~160 + probe |
| R-b | description↔body consistency | `noul`: "does this description fit this body" | `desc-fit-check.mjs`: reads frontmatter + first 500 words | ~90 |
| R-c | agent tools least-authority | `choice` over {minimal, permissive, mismatched} per agent doc | fold into R-b's pass | +30 |
| R-d | citation drift | `noul` per cited `file:line`: "does this line still support the claim" | `cite-check.mjs`: extracts `file:line` pairs + the claim sentence, asks per pair | ~120 |
| R-e | marginal-DQI triage | `score` on docs landing 60-89 | thin: feed `calculate_dqi` breakdown + doc head | ~70 |

The pattern matters more than any one script: every residue above is a **meaning** check the validators structurally cannot do, and each is enumerable as one bounded `noul`/`choice`/`score` per unit (section, description, citation) — Deem-shaped by construction.

## New against baseline

| Claim | Status | Evidence |
|---|---|---|
| sk-doc's validator surface is 6 distinct tools + 5 naming scripts, all deterministic; the complete check map is 16 rows | **new** (BASE2 examined only `hvr_scan.py`) | check map above, `validate_document.py:1505-1518` dispatch |
| `validate_document` silently falls back to `readme` rules for any unrecognized path — a classification judgment never asked | **new** | `validate_document.py:255-256` |
| `validate_general_structure` is env-gated off by default — a whole rule layer that may not run | **new** | `validate_document.py:537-540` |
| Agent frontmatter enforces the runtime-split *schema* but never the *contents* of the allow-list | **new** | `validate_document.py:1264-1297` |
| DQI is 11 count-based inputs; a doc can score `excellent` while false; 74↔76 band flips on one divider | **new** | `extract_structure.py:986-1143` |
| quick_validate's non-FQ-MCP check is blocking for commands but only a warning for skills — an asymmetry embedded in code | **new** | `quick_validate.py:249-251` |
| HVR §2/§4/§5 is the largest residue: the scanner's own docstring declares it unmachineable and floors its output | confirms BASE with new evidence | `hvr_scan.py:13-21` (BASE2 R22 named one category without a count — this names nine) |

## Ruled out

- Editing `validate_document.py` to add classifier hooks: its exit codes are contract-pinned (`:1520-1537`) and `should_exclude_path` semantics must not change; siblings are strictly additive.
- A single "judge the whole doc" call: unbounded state and a vague judgment; per-(section × rule) questions are enumerable, cheap (~60 ms each measured, `deem-local.md:34-38`), and individually checkable.

## Hand-off

- swe-06: the residue table above is the candidate set; R-d (citation drift) and R-b (description fit) have the cleanest label schemas — pick the best count.
- swe-04: none of these are context-reduction seams; the classifier residue work feeds swe-06 directly.
- Any lineage: `detect_document_type`'s `readme` fallback (`:255-256`) is a latent misclassification channel — a classifier `choice` over the 12 types is itself a candidate idea (N-swe-06 candidate note).
