# Iteration 003 — Prose conformance sample, ownership map, and the family tie-break

Run: `rsr-2026-09-21T08-45-54-679Z` · Mode: research · Iteration 3 of 10

## FOCUS

Close the two remaining tails against the pinned README HEAD: Q4's sentence-level prose conformance sample and Q1's per-paragraph ownership map for merged or dropped content. Supporting work: settle the family-block tie-break against README §7 SKILL LIBRARY's own sub-order, resolve the F-008 over-specific-count list into keep / re-derive-at-publication / soften-to-role, and finish the `.opencode/*` sweep as a line-numbered classification. No implementation: findings and decisions only.

## ACTIONS TAKEN

1. Read README HEAD prose: §1 SUMMARY and §2 THE FOUNDATION opening (lines 10–100) for sentence shape, and §7 SKILL LIBRARY (lines 758–933) end to end for the group order that drives the family tie-break.
2. Read the changelog's reader-facing prose in both directions: frontmatter, H1, intro and the full glance list (lines 1–60), and the close — Plain-English tail, Upgrade Notes, Internal Seams, After This Draft (lines 700–747). Mid-document sentences (lines 81, 87, 101, 168, 188, 219, 463, 660, 716, 717) were already in hand from iterations 1–2 and the current sweep.
3. Swept every `.opencode/*` occurrence in the changelog with line numbers: 25, 81, 87, 101, 168, 188, 463, 660, 716, 717, 742. Verified the live tree at HEAD: `.skilled/hooks`, `.skilled/bin/skill-advisor.cjs`, `.skilled/skills/mcp-tooling`, `.skilled/skills/system-spec-kit/runtime/cli` all exist; `.opencode` is the compatibility alias.
4. Read delta `iter-002.jsonl` to keep graph node ids continuous (`f-iter002-order`, `f-iter002-kmd`, `q-iter002-q3`) and to confirm which prior artifacts this iteration closes.
5. Mined iteration 1's registry notes for the F-008 list verbatim, then resolved each count against whether a machine source can re-derive it.

## FINDINGS

### F-016 — Sentence-level prose conformance sample against README HEAD (Q4 tail)

Paired sample of ten constructions, changelog sentence against the README rule it either matches or breaks.

| # | Changelog construction (line) | README HEAD rule | Verdict |
|---|---|---|---|
| 1 | "This release is about shape. Skill after skill stopped standing alone and folded into a parent that routes you to the one small piece you need." (11–12) | §2 opens with the thesis then the blocks: "Three building blocks carry the whole system:" | CONFORMS. Thesis-first, present tense, second person |
| 2 | "Where a monolith once hid a 28KB command or a 3,000-line template, a router now hands you the slice that fits." (13) | README states mechanisms without quoting internal sizes; its counts are product surfaces ("12 specialized agents", "15 On-Demand Skills"), never file sizes | SOFTEN. Drop the size props, keep the slice sentence |
| 3 | "Hermes joins as the seventh runtime … bridges eighteen of the twenty-two hook packages." (≈47) | §7 counts structural rosters ("seven bridges", "ten modes", "fourteen workflow modes"), not process ratios | SOFTEN to role: "most of the hook packages" |
| 4 | "Rules for how a reply reads … The root document fell from 496 lines to 284 and every rule ends in a self-check." (≈53) | README never narrates a line-count delta; it names the surface ("Thirteen repo rules … routed by `REPO RULES.md`") | DROP the 496→284 clause |
| 5 | "Six silent-approval conditions closed, including a shape bug that left every Codex dispatch unchecked." (≈45) | README product voice states the outcome, not the defect forensics | REWRITE to the outcome ("every dispatch now proves its declared check ran"); send the shape-bug detail to the appendix or the owning packet |
| 6 | "Run on GLM-5.3-Flash and Sonnet 5 it showed the first-line contract … each moving one model and not the other, and the operator chose to accept the flat list on the model that kept printing it." (700–703) | README carries no model-specific pilot transcript in a product surface | MOVE. The durable claims — the benchmark, the opt-in switch — stay; the pilot narration goes to the packet |
| 7 | "You feel this change everywhere." (58) | README section intros start on the substance: "Two skills power the autonomous loops described in Deep Loop:" | REWRITE. Cut the mood sentence; keep "Most of the framework's skills stopped standing alone" |
| 8 | "It is one place to read without duplicating a line of code." (463) | README close sentences are short and concrete | CONFORMS |
| 9 | "Writing this draft was not the end of the work." (738) | README has zero meta-narration about its own drafting | DROP (already F-014) |
| 10 | Heading "A Closed Roster, and Where It Is Narrower Than the Code" (383) | README H4s are short noun phrases ("Sticky Routing", "Adapting to Your Stack"); contract rule 5 forbids sentence-length headings unless sequence is load-bearing | RETITLE to "A Closed Roster" |

Result: of ten sampled constructions, five conform (1, 8, plus second-person density, bold-lead-in bullets and benefit-labeled sections unbroken across the sampled prose), three soften, two rewrite-or-drop. **The prose delta is narrow compared with the structural delta.** The voice rewrite should scope itself to (a) process-metric clauses and (b) maintainer narration, and leave the thesis-first opener, second person, bullet pattern and close sentences alone.

### F-017 — Per-paragraph ownership map for merged or dropped content (Q1 tail)

Every merge, move or drop from the iteration-2 decision table now has a named owner. "Title-match" means a 033 child exists whose title names the fact; "no 033 child" means the contract's component-changelog rule applies instead.

| Changelog content (decision) | Owning packet or surface | Basis |
|---|---|---|
| Memory-database detail in Spec Kit (KEEP trimmed) | `017-memory-database-decommission`, `019-memory-decommission-branch-landing`, `021-decommission-debt-and-cli-nesting` | Title-match |
| Runtime renamed and nested under `runtime/cli/` (KEEP) | `020-runtime-package-rename` | Title-match |
| Gate 3 four options (KEEP) | `040-gate-3-option-merge` | Title-match |
| Completion gate + forty registered rules (KEEP) | `007-completion-gate-coherence`, `009-validation-rule-reduction` | Title-match |
| Reindex/startup scans stop editing documents (KEEP) | `023-trigger-index-root-and-drift-fixes`, `024-metadata-regeneration-and-shared-parser` | Title-match |
| Three rounds of simplification, every finding closed (KEEP) | `030-spec-kit-simplification-research`, `032-recorded-findings-closure` | Title-match |
| Smaller templates (KEEP) | `003-spec-doc-template-reduction`, `008-template-contracts-and-acceptance-criteria` | Title-match |
| CI mirror checks and Dependabot zero (KEEP) | `031-ci-shared-package-resolution`, `033-ci-dependency-hardening` | Title-match |
| Goals in the packet and its character limits (KEEP) | `010-goal-file-addon`, `029-goal-operator-resync-rule`, `038-goal-unification` | Title-match |
| Late-cycle entries: Orca graduation, Jev hub, defaults (KEEP trimmed) | `044-v4-changelog-late-cycle-entries` | Title-match |
| Adopter reconciliation bullet (KEEP as one pointer) | `043-v4-root-readme` owns standing adoption guidance; the changelog points at `upgrading-a-skill-to-v4.md` | Title-match plus the guide path already in the bullet |
| `.skilled/` source-root fact and the blanket alias sentence (line 742) | `041-skilled-source-root-migration` | Title-match |
| `After This Draft` commit-hash narration (DROP) | `044-v4-changelog-late-cycle-entries` (census and late entries), `035-v4-changelog-draft-update` (draft mechanics), `041` (the migration commits `60f0e91764`, `8b2b831184`, `2a57cc635d`, `c34e1bd73b`) | Hash and fact ownership separated; the changelog keeps none of the hashes |
| Internal Seams bullets that restate owner sections (MERGE into appendix) | Owner sections themselves; the appendix keeps only the four non-repeated seams | Duplication table F-015 |
| Deep-loop ledger/protocol/admission hash narration (745–747) | No 033 child; the deep-loop runtime's own packet family. Component-changelog rule applies: one line stays, hashes go | No title-match in 033 |
| Orchestrating roster asymmetry and cache-worth maintainer detail (383–422) | No 033 child; `cli-*` skill packets own executor specifics. Changelog keeps the reader line | No title-match in 033 |
| Intro/glance restatements of owner mechanisms (MERGE) | Internal dedupe only — owner sections already hold the fact; no packet needed | F-015 |

The residual column is the honest one: two content classes (deep-loop ledger narration, cli-* executor internals) have no 033 child, so their detail travels to component-owned records rather than to a packet in this tree. Every other dropped paragraph has a concrete owner.

### F-018 — Family-block tie-break resolved: README §7 flips the middle of the order

README §7 group order at HEAD: SYSTEM → CODE WORKFLOW (`sk-code`, `sk-git`) → DEEP LOOP → CROSS-AI CLI → JUDGMENT TRANSPORT → MCP INTEGRATION (`mcp-code-mode`, `mcp-tooling`) → DESIGN (`sk-design`) → DOCUMENTATION (`sk-doc`) → PROMPTING (`sk-prompt`) → COMMUNICATION → OTHER.

- For the five product families (Code, Documentation, Design, MCP, Prompt), §7's relative order is **Code → MCP → Design → Documentation → Prompt**.
- Iteration 2 recommended Code → Documentation → Design → MCP → Prompt. The tie-break criterion was exactly this check, and §7 disagrees with it.
- Resolution: adopt the §7 relative order — **Code → MCP → Design → Documentation → Prompt**. This keeps MCP adjacent to Design (immediately before it) and Code first, and satisfies §7 completely. The only loss is the Code–Documentation pairing, which §7 never had.
- The core block order (Spec Kit → Deep Loops → Orchestrating → Advisor) is unchanged: it is justified by README §2 THE FOUNDATION, not §7, and §2 puts the loop before the advisor.
- The cross-cutting and doctrine blocks are untouched.

Revised family rows for the iteration-2 order table: 7 `One Code Skill` (first family, unchanged), 8 `MCP Tooling` (up from 10), 9 `The Design Surface` (was after Documentation), 10 `Documentation as a System` (down; keeps the split into intro mechanics plus sk-doc specifics), 11 `Prompt Engineering` (unchanged, last family).

### F-019 — `.opencode/*` sweep, classified: five current-path references to fix, six historical ones to keep, one blanket sentence to narrow

Live tree verified: `.skilled/hooks`, `.skilled/bin/skill-advisor.cjs`, `.skilled/skills/mcp-tooling`, `.skilled/skills/system-spec-kit/runtime/cli` all exist; `.opencode` is the alias.

| Line | Sentence's role | Verdict |
|---|---|---|
| 25 | Glance bullet names the old path ("keeps every old `.opencode/specs/...` reference working") | KEEP — historical side of the move |
| 81 | Spec Kit body: "moved from `.opencode/specs/` to a physical top-level `specs/`" | KEEP — historical side |
| 87 | Decommission note: the removed daemon CLI "under `.opencode/bin/`" | KEEP — historic home of a removed component |
| 101 | "Its engine lives at `.opencode/skills/system-spec-kit/runtime/cli/`" | FIX to `.skilled/skills/system-spec-kit/runtime/cli/` — "lives" is current, and the live path is under `.skilled/` |
| 168 | "hoists state above the outermost `.opencode`" | VERIFY at rewrite: the structural boundary sentence must name whichever root is outermost after the migration |
| 188 | "`node .opencode/bin/skill-advisor.cjs <command>` is the one way to reach them" | FIX to `.skilled/bin/skill-advisor.cjs` — README line 783 uses exactly that spelling; duplicate of the F-015 row |
| 463 | "`.opencode/hooks/` directory gathers every hook" | FIX to `.skilled/hooks/` — verified live |
| 660 | mcp-figma "lives at `.opencode/skills/mcp-tooling/mcp-figma/`" | FIX to `.skilled/...` — parent verified live |
| 716 | Repoint list: source "`.opencode/specs/`", target "`.opencode/skills/system-spec-kit/runtime/cli/`" | Source KEEP, target FIX |
| 717 | "reach the advisor through `node .opencode/bin/skill-advisor.cjs`" | FIX — same path as 188 |
| 742 | Blanket "read any `.opencode/...` reference in these notes as `.skilled/...`" | NARROW, do not delete. Historical references remain (25, 81, 87), so the sentence is load-bearing; reword to cover "the old `.opencode/...` references" and stop legitimizing the current-path sentences |

Net: six concrete line edits, all one-token path swaps (101, 188, 463, 660, 716-target, 717), one verification (168), one reword (742). Do NOT sweep blindly — six occurrences become wrong if "fixed."

### F-020 — F-008 over-specific-count list resolved per count

Iteration 1 named five remaining drift-prone counts. Each now has an explicit disposition.

| Count (line) | Disposition | Ground |
|---|---|---|
| "Cursor carries 21 ids across six families" (274) | SOFTEN TO ROLE — keep the roster's seven names, drop the per-CLI id count; it drifts with every CLI release and no script re-derives it | Role language survives; the named roster is the load-bearing fact |
| "eighteen of the twenty-two hook packages" (35) | SOFTEN TO ROLE — "most of the repo's hook packages" | Same class: process ratio in a reader-facing glance bullet |
| "102 relative symlinks" (463) | RE-DERIVE AT PUBLICATION — the count is mechanically countable from the tree; if no count is taken, soften to "one relative symlink per hook" | A script can produce it; keep the number only if generated |
| "178 recommendations" (295) | RE-DERIVE AT PUBLICATION from the authoritative ledger, or drop the number and keep "every finding was closed" (already stated at line 138) | The ledger is the machine source of truth and is queryable |
| "two forked cache extensions" history (393) | SOFTEN TO ROLE — "early cache forks were folded back"; keep only the mechanism sentence | History clause carries no reader action |

The four spec-tracked corrections (line 24 "Seven hubs", lines 39/44/632 "nine modes", line 489 "other six hubs") stand as landed and verified against spec REQ-004.

## QUESTIONS ANSWERED

- **Q4 (voice and structure vs README)** — ANSWERED. Structure was pinned in iterations 1–2; this iteration pins the prose: F-016's ten-construction sample, plus F-019's path-spelling classification. The live README HEAD is the standard and the changelog's sentence shape mostly conforms; the divergence concentrates in process metrics and maintainer narration.
- **Q1 (duplication / unneeded content)** — ANSWERED. F-015 was the sentence-level table; F-017 closes the tail by naming each merged or dropped paragraph's owner, including the two classes with no 033 child.
- **Q3 (ordering and per-section decisions)** — ANSWERED, revised. The tie-break in F-018 flips the family block to Code → MCP → Design → Documentation → Prompt; the rest of the iteration-2 order stands.
- **Q2 (stale claims)** — ANSWERED. Post-rewrite drift (F-003–F-005), internal contradictions (F-009–F-011), stale paths (F-019) and over-specific counts (F-020) are all dispositioned.
- **Q5 (contract)** — ANSWERED in iteration 2. The departure set is recorded in F-012/F-013/F-014 and no new contract interaction surfaced this iteration.

## QUESTIONS REMAINING

None. All five questions are now answered; the decision sheet is complete for a deferred implementation step. Open work is execution, not research.

## NEXT FOCUS

Iteration 3 is the planned research close. If another iteration runs, the highest-value residual is a publication-time re-derivation checklist (F-020's two re-derive counts, the F-009 six/seven correction, and the F-019 path swaps as a single mechanical patch list), or an independent validation pass over the decision sheet itself. Otherwise the packet is ready for the reducer and for the implementation follow-up.

## SCOPE VIOLATIONS

None. Writes landed only in `research/iterations/iteration-003.md`, `research/deltas/iter-003.jsonl`, the gateway temp file, and the gateway's own ledger refresh. Every researched file (`CHANGELOG-v4.0.0.0.md`, `README.md`, the 033 packet tree) was read only; nothing outside the run directory was created, modified, renamed or deleted.
