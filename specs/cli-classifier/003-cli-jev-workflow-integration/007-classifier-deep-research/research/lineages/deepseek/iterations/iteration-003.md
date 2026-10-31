---
title: "Iteration 3 — deepseek-03: Validators as gates: spec-kit's rules and `check-goal.cjs`"
trigger_phrases: []
---

# Iteration 3 — deepseek-03: Validators as gates

## Focus

Angle **deepseek-03** (W1): *Validators as gates: spec-kit's rules and `check-goal.cjs`.* Maps to question D; answers angle questions 1 to 5. All claims were opened this iteration. No round-3 sibling file was read (W1).

## Actions Taken

1. Read `SSK/runtime/cli/spec/validate.sh:1-90` (the front-end's contract, the help text with exit codes and levels) and the rule dispatch architecture.
2. Read the full rule registry `SSK/runtime/cli/lib/validator-registry.json` by rule id (40 rows; line map below) and each row's `script_path` and description via `jq`.
3. Read `SSK/runtime/cli/rules/README.md:1-80` (architecture, rule interface, directory tree).
4. Read `SSK/runtime/lib/validation/orchestrator.ts:80-140` (registry entry model, shell rule bridge interface) and `:278-407` (native-vs-shell dispatch, severity mapping, strict-only gate).
5. Read `SSK/references/validation/validation-rules.md:21-135` (severity semantics, the rule summary table, `AC_CLOSURE`, `AC_COVERAGE` and `CONTINUITY_FRESHNESS` contracts) and its section TOC to `:798`.
6. Read `DOC/sk-create-goal/scripts/check-goal.cjs`: `:18-48` (template assets, placeholders, the four checks), `:64-70` (phase-child discovery), `:88-126` (context load), `:131-165` (anchor/table parsing), `:162-213` (goal sections, criterion items), `:236-358` (the four check functions), `:640-699` (scan corpus, main, exit codes, exports).
7. Quoted BASE2 rows 61 and 62 and BASE1 row 12 as the baseline's own validator statements; nothing from them is presented as newly opened.

## Findings

**F1 (new; answers the architecture half of angle question 1). `validate.sh` owns no rules; one registry row spawns one rule implementation, of three kinds.** The front-end resolves folders and hands every decision to `dist/lib/validation/orchestrator.js` (`validate.sh:1-18`, `:23-30`; VERSION 3.0.0). The orchestrator reads `validator-registry.json`, runs each row not already covered by a native parser (`orchestrator.ts:384-407`), spawning either the registered shell script through the shared `run_check()` bridge (`:139-150`, `:299-375`) or a Node rule (`:346-375`); severities map `pass/fail/warn/info/skip` to exit-neutral statuses except `error` (`:278-289`). The registry's 40 rules dispatch to shell scripts under `rules/` (`rules/README.md:24-46`), to `native:orchestrator` (ANCHORS_VALID), to `ts:spec-doc-structure` (five save/structure rules) and to `validation/*.ts` (three strict/freshness rules) — the `script_path` column below is the map. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh:1-18, :23-30; .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:80-100, :278-407; .skilled/skills/system-spec-kit/runtime/cli/rules/README.md:24-46]

**F2 (new; answers angle question 1). The complete rule map, one row per rule, with the check's kind and the judgment residue it leaves.** Kind: **M** mechanical repository fact (verdict must be deterministic and final), **P** pattern proxy that stands in for substance, **A** authored/operational artifact shape. Residue names what a reader (or classifier) still judges after a pass; "none" means the rule's fact is the whole answer.

| Rule ID | Impl (`script_path`) | Kind | What it reads / checks | Residue after pass | Citation |
|---|---|---|---|---|---|
| FILE_EXISTS | `rules/check-files.sh` | M | required docs for the declared level | none | `validator-registry.json:3` |
| PLACEHOLDER_FILLED | `rules/check-placeholders.sh` | P | literal template placeholders in authored docs | prose that is unfilled in spirit but not a known literal (`TBD`, empty sections) | `:15` |
| COMMENT_HYGIENE_MARKER | `rules/check-comment-hygiene.sh` | M | ephemeral finding markers in HTML comments | none | `:27` |
| SCAFFOLD_NEVER_TOUCHED | `rules/check-scaffold-never-touched.sh` | M | scaffold-signature markers under a Complete claim | none | `:37` |
| STATUS_CROSS_DOC_CONSISTENCY | `rules/check-status-cross-doc-consistency.sh` | P | spec.md vs implementation-summary.md status words | whether the status is *true*, not just consistent | `:48` |
| LEVEL_DECLARED | `rules/check-level.sh` | M | declared vs inferred level | none | `:59` |
| AC_COVERAGE | `rules/check-ac-coverage.sh` | P | coverage of acceptance criteria; `file:line` evidence presence; floor 0.9 advisory | whether a cited line actually says what the row claims (existence is not checked — see F4) | `:69` |
| AC_CLOSURE | `rules/check-ac-closure.sh` | M | unmet criteria vs a completion claim; waiver must name an ADR | whether the criterion was correctly marked Met | `:85` |
| ANCHORS_VALID | `native:orchestrator` | M | anchor syntax, pairing, order, uniqueness | none | `:100` |
| FRONTMATTER_MEMORY_BLOCK | `ts:spec-doc-structure` | A | canonical `_memory` continuity block | none | `:112` |
| MERGE_LEGALITY | `ts:spec-doc-structure` | A | merge payload vs target anchor shape | none | `:123` |
| SPEC_DOC_SUFFICIENCY | `ts:spec-doc-structure` | P | implementation-summary sufficiency after save; `goal.md` budget and binding rows | whether the summary *means* anything | `:133` |
| CROSS_ANCHOR_CONTAMINATION | `ts:spec-doc-structure` | M | route/category mismatch in generated content | none | `:144` |
| POST_SAVE_FINGERPRINT | `ts:spec-doc-structure` | M | post-save fingerprints | none | `:155` |
| TOC_POLICY | `rules/check-toc-policy.sh` | M | TOC placement | none | `:166` |
| AI_PROTOCOLS | `rules/check-ai-protocols.sh` | P | four protocol sections present at L3+ | whether the protocol text constrains behavior | `:176` |
| COMPLEXITY_MATCH | `rules/check-complexity.sh` | P | content metrics vs declared level | whether size reflects real thoroughness | `:186` |
| FOLDER_NAMING | `rules/check-folder-naming.sh` | M | `###-short-name` | none | `:196` |
| FRONTMATTER_VALID | `rules/check-frontmatter.sh` | M | YAML structure and required values | none | `:204` |
| GREP_CONVENTION | `rules/check-grep-convention.sh` | M | every doc against the greppable-corpus convention | none | `:214` |
| LEVEL_MATCH | `rules/check-level-match.sh` | M | required files vs declared level | none | `:226` |
| GRAPH_METADATA_PRESENT | `rules/check-graph-metadata.sh` | A | description/graph metadata exist | none | `:234` |
| GRAPH_METADATA_CHILD_DRIFT | `rules/check-graph-metadata-child-drift.sh` | A | children_ids vs on-disk children | none | `:244` |
| GRAPH_METADATA_CHILD_IDENTITY | `rules/check-graph-metadata-child-identity.sh` | M | children_ids leading path identity | none | `:255` |
| GRAPH_METADATA_SHAPE | `rules/check-graph-metadata-shape.sh` | A | required blocks; `last_active_child_id` | none | `:266` |
| METADATA_DISK_PATH_CONSISTENCY | `rules/check-metadata-disk-consistency.sh` | M | description/graph/continuity ids vs disk | none | `:277` |
| DESCRIPTION_SHAPE | `rules/check-description-shape.sh` | A | description.json keys/typing | none | `:288` |
| NORMALIZER_LINT | `rules/check-normalizer-lint.sh` | M | duplicated runtime normalizer helpers (strict-only) | none | `:299` |
| SPEC_DOC_INTEGRITY | `rules/check-spec-doc-integrity.sh` | M | inline markdown references resolve | none | `:309` |
| TEMPLATE_SOURCE | `rules/check-template-source.sh` | M | `SPECKIT_TEMPLATE_SOURCE` markers | none | `:319` |
| CANONICAL_SAVE_ROOT_SPEC_REQUIRED | `rules/check-canonical-save-root-spec.sh` | M | root spec reference in a save | none | `:327` |
| CANONICAL_SAVE_SOURCE_DOCS_REQUIRED | `rules/check-canonical-save-source-docs.sh` | M | source document references | none | `:335` |
| CANONICAL_SAVE_LINEAGE_REQUIRED | `rules/check-canonical-save-lineage.sh` | M | save lineage metadata | none | `:343` |
| CANONICAL_SAVE_PACKET_IDENTITY_NORMALIZED | `rules/check-canonical-save-packet-identity.sh` | M | packet identity normalization | none | `:351` |
| CANONICAL_SAVE_DESCRIPTION_GRAPH_FRESHNESS | `rules/check-canonical-save-description-graph-freshness.sh` | M | generated description/graph freshness | none | `:359` |
| CONTINUITY_FRESHNESS | `validation/continuity-freshness.ts` | A | stored fingerprint vs recomputed; clean packet paths (strict-only, disabled by default) | none (attestation, not meaning) | `:367` |
| GENERATED_METADATA_INTEGRITY | `validation/generated-metadata-integrity.ts` | A | schema + path-prefix validation | none | `:376` |
| GENERATED_METADATA_DRIFT | `validation/generated-metadata-drift.ts` | A | re-derived folder vs stored description/causal_summary | none | `:388` |
| IMPROVEMENT_ARTIFACTS | `rules/check-improvement-artifacts.sh` | A | `improvement/*-config.json` parse | none | `:400` |
| LINKS_VALID | `rules/check-links.sh` | M | wikilinks in this skill's own docs resolve | none | `:411` |

[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json:3-411 (each row's line above); script paths from the registry's `script_path` column; runtime/validation/orchestrator.ts:96-100]

**F3 (new; answers angle question 2). Every authored-template rule is structural; exactly six rules approximate meaning with a pattern, and none reads meaning.** The meaning-adjacent set is `PLACEHOLDER_FILLED` (literal match only), `STATUS_CROSS_DOC_CONSISTENCY` (word agreement), `AC_COVERAGE` (`file:line` presence), `SPEC_DOC_SUFFICIENCY` (anchor/budget sufficiency), `AI_PROTOCOLS` (section presence) and `COMPLEXITY_MATCH` (counts vs level). All six judge a proxy, and each proxy can pass on hollow text: the first misses inconsistent-but-agreeing statuses, the second misses evidence that cites a dead line, the fourth counts anchors, the fifth counts headings, the sixth counts characters. This is the residue a classifier would face — and the reason none of these rules may be replaced by one (F7). [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json:15, :48, :69, :133, :176, :186]

**F4 (new; answers angle question 2's AC half). `AC_COVERAGE` is explicitly advisory, counts citations and names malformed evidence, but does not verify that a cited `file:line` exists or supports its row.** Registered at INFO and on by default; `SPECKIT_AC_COVERAGE_ENFORCE=true` would turn an under-floor result into a failure, and the default floor is 0.9 (`validation-rules.md:110-129`). Rows count as covered when Tests/Partially-covered rows carry `file:line` evidence, malformed citations are reported in the advisory details (`:120-129`), and the document itself records that about one in five Met criteria cites a `file:line` at all (`:123-126`). Whether a cited line exists, or says what the criterion claims, is left to a reader — the cleanest deterministic gap this iteration found (N-deepseek-03-3). [SOURCE: .skilled/skills/system-spec-kit/references/validation/validation-rules.md:110-135; .skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json:69]

**F5 (new; answers angle question 4's "what each reads" half). `check-goal.cjs` is a read-only packet checker with four checks, and its context construction tells exactly what passes.** `loadPacketContext` reads `goal.md`, splits frontmatter, extracts the durable slice and verifies the slice against the log anchor (`check-goal.cjs:88-126`); phase children are every direct subdirectory holding a `spec.md` (`:64-70`); sections come from heading scans and the `completion` anchor (`:162-205`); criteria are bullet items (`:207-213`). The four checks: `missing-binding-row` (`:236-263`), `placeholder` (`:269-311`), `criteria-count` (`:320-331`) and `parent-budget` (`:333-358`). `main` returns 0 for a pass, 1 for findings, 2 for read errors (`:660-671`), and exports the check functions (`:681-689`) — a frozen surface BASE2 row 61 already says a sibling must not edit. [SOURCE: .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs:64-70, :88-126, :162-213, :236-358, :660-689; BASE2 row 61]

**F6 (new; answers angle question 4's "judgment each leaves" half). Per-check residue, from the implementations.**

| Check | What it proves | Judgment left to the author after it passes |
|---|---|---|
| `missing-binding-row` | a binding-table row names `<child>/goal.md` for every direct phase child | whether the row's scope text actually describes the child, and whether a folder with a stray `spec.md` is truly a phase child (the child list is disk-derived, `:64-70`) |
| `placeholder` | no known template literal survives in objective, decisions or criteria (literals merged from the three asset templates, `:32-42`, `:269-291`) | whether filled-looking text is unfilled in spirit; a rewritten objective of "TBD." passes |
| `criteria-count` | 3 to 7 bullet criteria exist (`:207-213`, `:320-331`) | whether any criterion is observable, measurable or bounded — count is not quality |
| `parent-budget` | durable slice ≤ the resolved `errorChars` limit (`:333-358`; budget from `goal-slice.cjs`) | whether the right content was kept; trimming to fit is an authorial act the check cannot judge |

[SOURCE: .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs:32-42, :64-70, :207-213, :236-358]

**F7 (new; answers angle question 3). The classifier's permissible home is a separate, exit-neutral advisory script; the forbidden set is every rule whose verdict is a repository fact or a closure gate.** Permitted, all beside a validator and never inside it: a sibling of `check-goal.cjs` that imports its parser or reads the same goal and prints one advisory line per item (the BASE2 row-61 route, now code-confirmed by the exports at `:681-689`), and an `AC_COVERAGE`-style advisory extension that adds a separate report without touching the rule's status. Forbidden: every **M** rule of F2 — exits must stay deterministic (`orchestrator.ts:278-289` maps statuses to exit codes; only `error` blocks) — plus the closure gate `AC_CLOSURE` and the five `CANONICAL_SAVE_*` contracts, because a judgment must never stand in for a repository fact. BASE1 row 12 adds the hook side: the dispatch guard, dispatch linter, MCP route guard and Gate 3 sanitizer decide repository facts inside 5 s budgets and must be deterministic. [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:278-289; .skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json:85, :327-359; .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs:681-689; BASE1 row 12]

**F8 (new; answers angle question 5). With neither backend each advisory prints its own skip line and exits 0; the validator's output and exit code are untouched; with both, Deem is preferred for document text.** Each advisory carries its own switch (a flag on the new script, no global switch), probes per iteration 1's contract (Deem: `/health` + stub refusal + model pin; Jev: BASE2 section 11's three checks). A document advisory sends goal and criterion text; that is repository prose, so the local backend is preferred on privacy and cost, while Jev is reserved for a later gold-calibrated form. With neither, the script writes `advisory skipped: no classifier backend` (or, with the switch absent, prints nothing) and validate.sh's checklist, findings and exit code are byte-identical to today — the advisory is a new file, so today's behavior simply has no such file. [SOURCE: iteration 1 F1-F6; BASE2 section 11; spec.md:121]

**F9 (new; a scope note). The four-check goal surface and the 40-rule validator surface are separate gates that share no code, and their residue does not overlap on the goal.** `check-goal.cjs` is a standalone script invoked by the goal workflow (round-2 `SKILL.md:110` context), while `SPEC_DOC_SUFFICIENCY` in the registry now also checks a `goal.md`'s durable budget and binding rows (`validator-registry.json:133`; `validation-rules.md:231-248` section 12 title). So a goal passed by one can be failed by the other: the standalone returns findings (exit 1), the registry row maps to error/warn. Any classifier advisory must pick one host and print its own verdict; two answers to the same question is the failure `validate.sh`'s own header warns against (`validate.sh:8-10`). [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh:8-10; .skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json:133; .skilled/skills/system-spec-kit/references/validation/validation-rules.md:231-248]

## Per-Idea Records

### N-deepseek-03-1: `criterion-quality` advisory beside `check-goal.cjs`

- **Idea:** A sibling script (not a `CHECKS` entry) that reads a goal's completion criteria with the existing parser and asks one `choice` per criterion: "Is this criterion observable — could a reviewer decide it from an artifact, exit code or count?" Prints one advisory line per criterion and never changes `check-goal.cjs`'s exit code. Type: `choice`.
- **Question:** D, G.
- **Builds on:** F5/F6 (the count check leaves quality unjudged); BASE2 row 61's separate-script route; BASE2 row 62 (which surfaces it does not reach).
- **Value:** The one residue in the goal gate no rule touches: vague criteria pass a count. A reviewer gets a flag list, not a gate.
- **Seam:** `check-goal.cjs:681-689` (exports to reuse); host script beside it in `sk-create-goal/scripts/`.
- **Metric, baseline, harness:** Metric: agreement with a human "observable / not" label per criterion; baseline UNKNOWN (no labels); harness: a label set drawn from closed packets' criteria (count to be produced by mimo-02/mimo-08 if they land; not counted here). Pre-registered: ship only at precision ≥ 0.8 on a held-out half.
- **Savings:** No count available this iteration; the value is avoiding one review pass per vague criterion, unmeasured until the harness runs. Marked estimate.
- **Cost, latency, privacy:** 1 call per criterion, offline, no deadline (a person runs it). Goal text is repository prose; Deem keeps it local.
- **Two-backend gate:** Own flag on the sibling script; Deem probe (iteration 1) preferred; Jev gate (BASE2 §11) second. With neither: skip line, exit 0, goal output byte-identical.
- **Rough LOC:** 120-160 (parser reuse + prompt + line printer + fixtures).
- **Verdict:** **later** — no gold exists; building it before a label set would test the prompt, not the judge.
- **Confidence:** Confirmed: the residue and the parser reuse points. Inferred: that a 0.8B-class judge reaches the precision floor.

### N-deepseek-03-2: `placeholder-in-spirit` advisory

- **Idea:** A `choice` per goal section (objective, each decision row, criterion) between "authored" and "boilerplate", flagging text that passed the literal placeholder rule but reads as unfilled. Type: `choice`.
- **Question:** D.
- **Builds on:** F2's `PLACEHOLDER_FILLED` residue; F6's placeholder row.
- **Value:** Catches the case the literal rule cannot; lowers the chance a hollow goal passes both gates.
- **Seam:** Sibling of `check-goal.cjs`; literals it must not edit at `check-goal.cjs:32-42`.
- **Metric, baseline, harness:** Agreement with operator labels on flagged vs clean sections; no labels today; harness would need a hand-labeled split. UNKNOWN.
- **Savings:** Unmeasured; likely small (the literal rule plus review already catch most).
- **Cost, latency, privacy:** 1-3 local calls per goal; offline.
- **Two-backend gate:** As N-deepseek-03-1.
- **Rough LOC:** 80-120.
- **Verdict:** **drop for now** — the failure it catches is rare and the labels needed to justify it do not exist; revisit if review records show repeated hollow goals.
- **Confidence:** Confirmed: the literal-only matching (`check-goal.cjs:32-42`). Inferred: that the residue is rare.

### N-deepseek-03-3: Deterministic `AC_COVERAGE` evidence-existence check (no classifier)

- **Idea:** Extend the coverage advisory with a mechanical pass: for every `file:line` in a Verification cell, check the path exists (and optionally that the line is within the file), reporting dead citations. No model, no backend, exit-neutral.
- **Question:** D.
- **Builds on:** F4 (existence is not checked); the `AC_COVERAGE` advisory contract (`validation-rules.md:110-135`).
- **Value:** A citation that points at a deleted file or an out-of-range line is currently counted as evidence; this converts one class of hollow evidence into a named finding with zero calls.
- **Seam:** `rules/check-ac-coverage.sh` and its helper; the advisory already reports malformed citations, so the change is a sibling report, not a new rule.
- **Metric, baseline, harness:** Metric: dead citations found per corpus; baseline: the advisory's own "about one in five Met rows cites a `file:line`" and UNKNOWN dead-citation count; harness: run over `specs/**/acceptance-criteria.md`, count only.
- **Savings:** 0 calls; it removes dead evidence from the reading pile. No AI-pass saving until the enforce switch matters.
- **Cost, latency, privacy:** Pure local file reads.
- **Two-backend gate:** None needed — this is the "better solved without a model" case; if ever paired with a judgment it is the separate advisory of N-deepseek-03-1.
- **Rough LOC:** 80-120 in the rule's helper plus fixtures.
- **Verdict:** **build-now (next, as spec-kit's own surface)** — deterministic, cheap, and it closes the gap the coverage floor leans on.
- **Confidence:** Confirmed: the advisory counts presence, not existence. Inferred: the dead-citation rate.

### Dropped: any classifier inside `validate.sh` or a hook

- **Idea:** Let a classifier produce or upgrade a validator rule's verdict, or stand in a 5 s guard.
- **Reason:** The rule's verdict is a repository fact (F7); the orchestrator maps only `error` to a blocking exit (`orchestrator.ts:278-289`), and BASE1 row 12 keeps the dispatch guards deterministic inside 5 s. A judgment there is Q11's exact failure. Dropped.
- **Confidence:** Confirmed from code and the baseline.

## New against baseline

| Claim | new, contests BASE, confirms BASE with new evidence or restated | Evidence |
|---|---|---|
| `validate.sh` owns no rules; 40 registry rows dispatch to shell/native/TS implementations | **new** | `validate.sh:1-18`; `orchestrator.ts:384-407`; `rules/README.md:24-46` |
| The complete rule map with kind and residue (F2) | new | `validator-registry.json:3-411` |
| Six rules approximate meaning with a pattern; none reads meaning | new | registry rows `:15, :48, :69, :133, :176, :186` |
| `AC_COVERAGE` counts `file:line` presence, not existence or support | new | `validation-rules.md:110-135` |
| `check-goal.cjs` four checks with context construction and per-check residue | new | `check-goal.cjs:64-213, :236-358` |
| The sibling-script route is code-confirmed (exports; frozen exit codes) | confirms BASE2 row 61 with new evidence | `check-goal.cjs:660-689`; BASE2 row 61 |
| Allowed/forbidden seats for a classifier (separate advisory vs every M rule + closure + save contracts) | new | F7 table; `orchestrator.ts:278-289`; BASE1 row 12 |
| The two goal gates (standalone and `SPEC_DOC_SUFFICIENCY`) share no code | new | registry `:133`; `validation-rules.md:231-248` |
| Jev gate and its skip lines | restated (BASE2 §11) | BASE2 section 11 |

## Sibling check

Independent: no round-3 sibling file read.

## Hand-off

- swe-02/swe-06: the F2 map and the F6 residue table are the validator-side input; the criterion-quality advisory is the slice candidate if a label set is designed.
- mimo-02/mimo-08: count the goal/validator residues if the harness is built; this iteration produced no counts and says so.
- deepseek-09: the advisory skip line (`advisory skipped: no classifier backend`) belongs in the failure table.
- deepseek-10: question-D phases (006) must not read a classifier advisory as a gate; the closure gate stays `AC_CLOSURE` (F7).
