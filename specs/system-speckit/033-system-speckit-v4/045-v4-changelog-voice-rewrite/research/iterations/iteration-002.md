# Iteration 002 — Recommended section order and first-draft keep/merge/move/drop decisions

Run: `rsr-2026-09-21T08-45-54-679Z` · Mode: research · Iteration 2 of 10

## FOCUS

Q3: the concrete recommended section order, and the first-draft keep/merge/move/drop decision per section. Supporting work: finish the Q5 contract read (the remainder of `SKILL.md` plus the separator and Upgrade rules), pin the live README order as the voice-and-order standard, and build the sentence-level duplication table that the merge/drop calls depend on.

## ACTIONS TAKEN

1. Read the full changelog `specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md` end to end (747 lines) and annotated every H2 with its line span and H4 count. Iteration 1 had extracted claims. This pass extracted structure and decided per section.
2. Read `README.md` lines 95–245 (live HEAD): section-2 opening through QUICK START. Confirmed the live foundation order `Spec Kit → Spec Memory & Search → Deep Loop → Skill Advisor → Agent Library → Plugin & Extension Library` (lines 103–164) and the adoption territory in `Adapting to Your Stack` (lines 221–229) that the Upgrade Notes partially duplicate.
3. Scanned the live heading skeleton: `rg -n '^#{2,3} ' README.md` and `rg -n '^## ' CHANGELOG-v4.0.0.0.md`. README top-level order is `1 SUMMARY → 2 OVERVIEW → 3 QUICK START → 4 SPEC KIT → 5 DEEP LOOP → 6 SKILL ADVISOR → 7 SKILL LIBRARY → 8 AGENT LIBRARY → 9 PLUGIN & EXTENSION LIBRARY → 10 COMMAND LIBRARY → 11 CODE MODE MCP → 12 GIT → 13 CONFIGURATION → 14 FAQ → 15 RELATED DOCUMENTS`. Changelog is 18 H2s, unnumbered.
4. Read the `sk-create-changelog` contract remainder (`.skilled/skills/sk-doc/sk-create-changelog/SKILL.md` lines 440–604): the seven-step workflow, `NOTATION AND FORMAT RULES` (voice rules 1–5, structure rules 1–11), `VALIDATION` global checks 1–11, the ALWAYS/NEVER lists, and success criteria. This closes the Q5 carry-forward.
5. Built the sentence-level duplication table (F-015), the recommended order table, and the per-section decision table. No file outside the run directory was written. Read-only targets were never modified.

## FINDINGS

### F-009 — The CLI-orchestrator count contradicts itself inside one document

- `Internal Seams` line 730: "Six CLI-orchestrator skills became one hub."
- `Orchestrating Other AIs` line 310: "Seven separate CLI-orchestrator skills became one hub", line 313: "The seven CLI-orchestrator skills live under one `cli-external-orchestration` hub", line 274: "any of the seven external CLIs" with a seven-name list, and line 45: the hub keeps "seven workflow modes".
- One of the two numbers is wrong. The body's seven matches the named roster (`cli-opencode`, `cli-codex`, `cli-devin`, `cli-cursor`, `cli-pi`, `cli-claude-code`, `cli-hermes`) and the Upgrade Notes. This is a P1 consistency defect and a stale-count symptom of the same class as F-001/F-008.

### F-010 — "The agent names behave as before" is false as written

- Intro line 15: "The `/deep:*`, `/create:*`, `/design:*` and `/speckit:*` families and the agent names behave as before".
- Upgrade Notes line 715 lists two agent renames in the same document: `@create` to `@markdown` and `@improve-prompt` to `@prompt-improver`.
- The four command families do keep their shape. The agent clause does not. Replace with a shape statement about the families and let the rename list carry the two agent names.

### F-011 — The quality-packet rename is named three different ways

- Body line 219: "the quality packet is `sk-create-quality-control` with the old `/doc:quality` command gone".
- Upgrade Notes line 715: "`doc-quality` to `create-quality-control`".
- The packet prefix (`create-*` → `sk-create-*`) is itself one of the renames that same bullet set lists, so the notes name both the old and new form of the target inconsistently and drop the `sk-` prefix. The same bullet also writes `/prompt` to `/prompt:improve` with slashes but `sk-skill` to `skill` without. P2, but it is the exact class of drift a reader acts on.

### F-012 — The contract mandates the `&nbsp;` separators, so the README divergence is a required departure, not a defect

- `SKILL.md` §8 Structure rule 7: "Use `&nbsp;` between H4 subsections within the same H2." Rule 8: "Use `---` only between H2 sections." Rule 9: "Do not place `---` or `&nbsp;` between an H2 or intro paragraph and its first H4."
- The changelog's 44 `&nbsp;` lines and 19 `---` rules comply with rules 7–9. The README has zero because the README is not a changelog, not because the separators are wrong.
- This resolves the F-001 tension formally. The separators are NOT to be stripped in the voice rewrite. Record this as a required departure from README style so a later pass does not "fix" it.

### F-013 — The expanded-format contract expects `## Upgrade` and offers no `What's New at a Glance`, so the v4 shape carries three recorded departures

- `SKILL.md` §9 validation check 6: "File starts with a summary paragraph, not a version header, per the shared template." Check 8: compact files include `## What Changed`, category H4s, `## Files Changed`, `## Upgrade`. Check 9: expanded files include category sections, item H4s, Test Impact when relevant, Technical Details when files changed are listed, and `## Upgrade`.
- The v4 document starts with YAML frontmatter plus an H1 version header, names its close `## Upgrade Notes`, and carries no Test Impact or Technical Details section.
- The departures are deliberate and audience-justified: the file is one repo-wide major release note (no single `.skilled/changelog/{component}` owns v4), the frontmatter feeds the trigger index and the H1 is the page title, and the release's "files changed" are the entire repository. Contract rule 10 says "Never hide source-format conflicts; mark them clearly", so the three departures plus F-012's reverse case should be written down in the 045 packet rather than left implicit.

### F-014 — `After This Draft` breaks the contract's voice and structure rules, not just the count

- Structure rule 5: "Do not use packet IDs, numbering, or sentence-length headings unless sequence is load-bearing." Voice rule 5: "Put file paths, line numbers, function names, SQL syntax, and other technical specifics in Files Changed, not in user-facing descriptions."
- The block is raw commit-hash narration (`1d43dbd38b`, `60f0e91764`, `8b2b831184`, `c2a57cc635d`, `c34e1bd73b`, `9e650decee` and so on) with a stale census (F-003: 266 stated, 278 measured). It is the clearest DROP in the document, and the fix direction is now named by the contract itself: commit-level specifics belong in the packets that own them, which for this release are 033's phase children.

### F-015 — Sentence-level duplication table (the merge/drop evidence)

| Repeated fact | Occurrences | Single home |
|---|---|---|
| Memory database retired, trigger index replaced it | Intro bullet; glance bullet 3; Spec Kit H4 plus 3 bullets; Upgrade Notes "Drop removed surfaces" | Intro keeps the why in one bullet, Spec Kit keeps the detail, Upgrade Notes keeps only the replacement action (`/speckit:search`, continuity writer) |
| Specs root moved with a compatibility symlink | Glance bullet 2; Spec Kit H4 (the mechanism sentence); Upgrade Notes repoint bullet | Spec Kit owns the mechanism sentence, the other two get one clause each |
| Gate 3 letters A-D | Glance bullet; Spec Kit H4; Upgrade Notes rename bullet | Spec Kit owns the detail, glance keeps one line, notes keep the actionable letters |
| Advisor reachable through one CLI | Skill Advisor H4 (line 188, `.opencode/bin/skill-advisor.cjs`); Upgrade Notes (line 717, same stale path); README line 190 (`.skilled/bin/skill-advisor.cjs`) | Fix both changelog occurrences to the README spelling and keep one command line in the Skill Advisor H4 |
| Hub-and-modes shape explained | Intro paragraph 2; the whole `One Shape for Every Skill` section; Documentation H4 "Parent Skills, Nested Modes and the Tool That Builds Them" plus the "None of this was hand-assembled" paragraph | One home in the merged intro/thesis. Documentation keeps only the sk-doc instance and the renamed commands |
| Executor roster and model counts | Glance bullets; Orchestrating line 274 and line 320; Upgrade Notes defaults bullet | Orchestrating owns the roster. One count per fact, softened where F-008 flagged drift |
| Adopter reconciliation | Upgrade Notes last bullet; README `Adapting to Your Stack` lines 221-229; `upgrading-a-skill-to-v4.md` | README owns the standing guidance. The changelog keeps one pointer line with the guide path |
| Internal Seams bullets | Eight of ten bullets restate a section above (two-axis hubs, deep-loop merge, CLI consolidation, review fold-in, proof distribution, push gate, shared goal core, shared parser) | Owner sections keep the fact. The appendix keeps the four genuinely non-repeated seams (advisor package extraction, root routers, renamed database, frontmatter parser detail is already in Spec Kit) |
| Pi depth | Glance bullets; Orchestrating H4s (native host, dispatch carve-out, cache extension, roster asymmetry, cost) | Orchestrating keeps native host and cache value, folds the dispatch carve-out and roster asymmetry into one H4 |

Reading of the table: the duplicate roles (headline, detail, action) are legitimate. The duplication that earns a merge or drop is where a section restates the mechanism instead of its role, and where maintainer-only material (roster asymmetry, process metrics, commit hashes) occupies reader-facing slots.

## RECOMMENDED SECTION ORDER (Q3 deliverable)

Ordering principles, in priority order: (1) why-first then what, (2) core systems in the README §2 foundation order (`Spec Kit → Deep Loop → Advisor`), (3) product families grouped by adjacency with the authoring pair first, (4) cross-cutting policy and runtime surfaces after the product scan, (5) doctrine last, (6) upgrade actions at the close, (7) maintainer material collapsed in an appendix.

| # | Section | Change from today |
|---|---|---|
| 0 | Frontmatter plus H1 | unchanged |
| 1 | Intro, merged with the thesis | merges `One Shape for Every Skill` in. Keeps the four reasons list. Two must-know breaking items stay |
| 2 | `What's New at a Glance` | compressed to about 15 bullets, ordered like the body. Stops previewing each section in near-verbatim sentences |
| 3 | `Spec Kit` | stays first family |
| 4 | `The Deep Loops, Unified and Extended` | moves up, from 4th body family to 2nd |
| 5 | `Orchestrating Other AIs` | stays adjacent to the loops, now 3rd |
| 6 | `The Skill Advisor` | moves down to 4th, matching the README foundation order that puts the loop before the advisor |
| 7 | `One Code Skill` | moves up ahead of Documentation |
| 8 | `Documentation as a System` | moves down. Keeps the sk-doc-specific half. The generic hub mechanics move to the intro |
| 9 | `The Design Surface` | stays after the authoring pair |
| 10 | `MCP Tooling` | stays design-adjacent, now directly after Design |
| 11 | `Prompt Engineering` | last of the product families |
| 12 | `Hooks, Goals and the Runtime` | moves out of the middle of the product scan, to the cross-cutting block |
| 13 | `Safer Git` | follows Hooks in the cross-cutting block |
| 14 | `Agent Discipline` | doctrine block |
| 15 | `Plain-English Output` | doctrine block |
| 16 | `Upgrade Notes` | position kept. Shape restructured, see below |
| 17 | Appendix: `Under the Hood` | was `Internal Seams`, renamed, collapsed, deduped, `Six` fixed to `Seven` (F-009) |
| — | `After This Draft` | removed (F-014). Four facts fold into owners: `.skilled/` root into Upgrade Notes, `cli-orca` and `cli-jev` into Orchestrating, mobile-surface retirement into One Code Skill |

Remaining tie-break to verify in iteration 3: the relative order of Code, Documentation and Design inside the family block should be checked against README §7 SKILL LIBRARY's own sub-order. The current recommendation puts the authoring pair first with Code ahead of Documentation, which follows the F-007 README library observation. If §7 disagrees, the middle of the block flips without touching anything else.

## KEEP / MERGE / MOVE / DROP DECISION TABLE (Q3 deliverable)

| Section | Decision | Detail |
|---|---|---|
| Frontmatter plus H1 | KEEP as-is | departure recorded in F-013 |
| Intro (3 paragraphs, 2 breaking bullets) | KEEP, trim | fix the agent-names clause (F-010). Keep the breaking items |
| `What's New at a Glance` | KEEP, COMPRESS | 31 bullets to about 15. One line per family, ordered like the body. Delete near-verbatim previews |
| `One Shape for Every Skill` | MERGE into intro | keeps the four reasons. Its restatement of the intro thesis goes |
| `Spec Kit` | KEEP | fix line 101's `.opencode/skills/...` spelling to `.skilled/...` (F-002). Soften `178`-class process metrics |
| `The Skill Advisor` | MOVE down, KEEP content | fix line 188's CLI path. The `Breaking` callout stays |
| `Documentation as a System` | MOVE down, SPLIT | generic hub mechanics and the scaffold paragraph move to the intro. sk-doc-specific content and the rename list stay |
| `The Deep Loops` | MOVE up, KEEP | ledger section stays. `178 recommendations` softens (F-008) |
| `Orchestrating Other AIs` | KEEP position, TRIM | fold `Pi Dispatches Pi` into the native-host H4, move the OpenRouter roster asymmetry to the appendix, soften `eighteen of the twenty-two` |
| `Hooks, Goals and the Runtime` | MOVE to the cross-cutting block | fix line 463's `.opencode/hooks` spelling |
| `The Design Surface` | KEEP | trim the pre-1.0 caveat's double statement. Keep the honest caveat about the compiled router |
| `One Code Skill` | MOVE up, KEEP | add the retired mobile surface to this section instead of an appendix bullet |
| `Safer Git` | KEEP | content is already policy-shaped |
| `Prompt Engineering` | KEEP, last family | short and settled, no change beyond order |
| `MCP Tooling` | KEEP, design-adjacent | fix line 660's `.opencode/skills/mcp-tooling/...` spelling. Fold `cli-orca` in |
| `Agent Discipline` | KEEP | doctrine, unchanged |
| `Plain-English Output` | KEEP | doctrine, unchanged. Optionally merge into Agent Discipline if the close runs long, but keep as its own H2 by default since it is a new skill |
| `Upgrade Notes` | KEEP position, RESTRUCTURE | five bullets stay. Each drops to about one screen. Fix the quality-packet naming (F-011). Fold the `.skilled/` source-root fact into the repoint bullet. Keep the adopter bullet as one pointer to the guide |
| `Internal Seams` | MOVE to collapsed appendix | rename `Under the Hood`, dedupe eight bullets against owners (F-015), fix `Six` to `Seven` (F-009) |
| `After This Draft` | DROP | fold four facts into owners, send hashes to the 033 packets (F-014) |

Recorded non-departure so nobody "fixes" it later: the 44 `&nbsp;` separators and the `---` rules stay (F-012).

## CANDIDATE MAJOR-RELEASE OUTLINE

```
frontmatter (title, trigger_phrases)
H1  v4.0.0.0, Fewer Skills, Safer Paths
WHY THIS RELEASE        two paragraphs of shape plus failure paths, then the two
                        must-know breaking bullets
WHAT'S NEW AT A GLANCE  about 15 bullets, body order
THE CORE                Spec Kit -> Deep Loops -> Orchestrating -> Advisor (H4 items)
THE SKILL FAMILIES      Code -> Documentation -> Design -> MCP -> Prompt (H4 items)
THE SYSTEM SURFACES     Hooks and Goals -> Safer Git -> Agent Discipline -> Plain-English
UPGRADE NOTES           renames to adopt / repoint what moved / drop removed surfaces /
                        changed defaults / reconcile your own skills
APPENDIX: UNDER THE HOOD  collapsed. Former Internal Seams, deduped, corrections applied
```

The appendix is the only maintainer-zone, it is collapsed, and the document ends there rather than on draft residue.

## QUESTIONS ANSWERED

- **Q3 (ordering and per-section decisions)** — ANSWERED this iteration. The concrete order is tabled above, the keep/merge/move/drop call exists per section, and each call cites its evidence (F-009 through F-015 plus iteration 1's F-001 through F-008).
- **Q5 (contract)** — ANSWERED. The contract remainder confirms the separator law (F-012), the `## Upgrade` expectation and the missing template sections (F-013), and the rule that makes `After This Draft` a violation (F-014). The departure set is now written down in the three findings rather than left implicit.
- **Q4 (README voice and order)** — structural half now pinned to live HEAD: the foundation order, the numbered emoji H2 scheme and the adoption territory were re-read in this session. Sentence-level prose sampling remains.
- **Q1 (duplication)** — mostly answered. F-015 is the sentence-level table. What remains is connecting each merged paragraph to the 033 packet that should own the fact instead.
- **Q2 (stale claims)** — three additions this iteration (F-009, F-010, F-011), all internal contradictions rather than external drift. The F-008 soften-list still stands.

## QUESTIONS REMAINING

- Iteration 3: sentence-level prose conformance sample against README HEAD (Q4 tail), and the per-paragraph ownership map for merged or dropped content (Q1 tail).
- Iteration 3: verify the family-block tie-break against README §7 SKILL LIBRARY's sub-order.
- Iteration 3, if budget allows: resolve the F-008 soften list into keep-as-is, re-derive-at-publication or soften-to-role per count, and sweep every remaining `.opencode/*` spelling to a line-numbered list (lines 101, 188, 463, 660, 716 and 717 are known).

## NEXT FOCUS

Iteration 3: sentence-level prose conformance against the pinned README HEAD, the ownership map that connects each merged or dropped paragraph to its 033 packet, and the README §7 tie-break for the family order. The Q3 decision sheet from this iteration is then ready for the reducer and for the deferred implementation step.

## SCOPE VIOLATIONS

None. Every artifact write stayed inside the run's `research/iterations/` and `research/deltas/` paths, plus the gateway contract's temp-file and ledger path. The researched surface (`CHANGELOG-v4.0.0.0.md`, `README.md`, the `sk-create-changelog` skill) was read only. Nothing outside the run directory was created, modified, renamed or deleted.
