# Iteration 001 — Changelog inventory, claim extraction, competing-surface map

Run: `rsr-2026-09-21T08-45-54-679Z` · Mode: research · Iteration 1 of 10

## FOCUS

Inventory the changelog's current structure (headings, sizes, counts), extract its factual claims, and map the surfaces it competes with (root README, 033 specs, sk-create-changelog contract) so the evidence base for keep/merge/move/drop decisions exists.

## ACTIONS TAKEN

1. Enumerated the run directory, read `deep-research-config.json` (lineage sessionId `rsr-2026-09-21T08-45-54-679Z`), and read `deep-research-strategy.md`'s topic, key questions and non-goals.
2. Read the full changelog, `specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md` (747 lines, all of it), and extracted its heading skeleton, separator usage, path spellings, count claims and the `After This Draft` block.
3. Read the root `README.md` head (lines 1–240): its live heading scheme, section-2 OVERVIEW shape, install commands and live paths.
4. Read the `sk-create-changelog` contract (`.skilled/skills/sk-doc/sk-create-changelog/SKILL.md`, lines 1–450): output modes, format contract, compact and expanded templates, source-mismatch note.
5. Read the 045 packet `spec.md` (scope, REQ-001–006, the four already-corrected counts) and inventoried the 033 packet family (45 phase children) plus `.skilled/changelog/` (13 component folders).
6. Git forensics, all read-only: `git log` on the changelog file, `git rev-list --count` from the rewrite commit (`7076dba64b`) and the last draft edit (`1d43dbd38b`) to HEAD, the five post-rewrite commit subjects, and `ls -la`/`find` over `.opencode` and `.skilled`.

Read-only targets were never modified. Vitest-style runtime checks were not needed at this stage. No scope violation occurred (see the closing section).

## FINDINGS

### F-001 — The skeleton skips H3 entirely and keeps 44 `&nbsp;` separators; the README uses none

- Changelog: 1 H1, 18 H2, **0 H3**, 56 H4, 19 `---` rules, **44 `&nbsp;` separator lines** (`grep -c '&nbsp;'` → 44; the 045 spec REQ-005 pins exactly these counts: 18/56/19/44).
- README: **0 `&nbsp;`** (`grep -c '&nbsp;' README.md` → 0) — README commit `83757eb6f8` is literally "strip the nbsp spacers".
- README's live scheme is numbered emoji H2 (`## 2. 🎁 OVERVIEW`) with H3 sub-areas (`### THE FOUNDATION`, `### Spec Kit`); the changelog is unnumbered, un-emoji'd H2 (`## Spec Kit`) with H4 items.
- Part of the divergence is deliberate: the sk-create-changelog expanded template itself prints H4 items separated by `&nbsp;` (SKILL.md lines 294–306), and REQ-002 keeps semicolons inside `&nbsp;` entities. The tension is real: the changelog's own template authority and the README voice disagree on this separator, and the 045 rewrite resolved it toward the template.

### F-002 — Live-path spelling contradicts the README for the same files (`.opencode/...` vs `.skilled/...`)

- Changelog line 101: "Its engine lives at `.opencode/skills/system-spec-kit/runtime/cli/`".
- Changelog line 188: "`node .opencode/bin/skill-advisor.cjs <command>`".
- Changelog line 463: "The `.opencode/hooks/` directory gathers every hook through 102 relative symlinks".
- README lines 188–190, 199–200, 227: `.skilled/skills/system-skill-advisor/runtime`, `.skilled/bin/skill-advisor.cjs`, `.skilled/skills/<your-skill>/`; README line 162: "shared policy cores in `.skilled/hooks/`".
- Two documents from the same release instruct different roots for the same live files. A reader who copies the changelog's advisor command against a tree that drops the compatibility aliases gets a stale path.

### F-003 — `After This Draft` carries a stale commit census and a false framing

- Changelog line 740: "266 commits landed after the last edit here (`1d43dbd38b`, 2026-09-16) and none of them are recorded in the sections above".
- Measured on the current HEAD (2026-09-21): `git rev-list --count 1d43dbd38b..HEAD` → **278**. The stated 266 is stale by 12, and it will keep drifting until the section is removed or regenerated from git.
- The framing is already false: the same section's later bullets and the glance list (lines 45–46) do record jev and orca, and the rewrite commit `7076dba64b` is itself inside the counted range but is recorded in the document.
- This is a draft-workflow residue: raw commit-hash narration (`60f0e91764`, `8b2b831184`, `c34e1bd73b`, `3182db…`-style ids) that belongs in the 033 packets, not in reader-facing release notes.

### F-004 — The `.opencode` compatibility claim is contradicted by the tree

- Changelog line 742: "Every `.opencode/*` path in this document still resolves, as a git-tracked symlink alias into `.skilled/` rather than as a directory of its own".
- Tree: `ls -ld .opencode .skilled` shows `.opencode` as a real directory (`drwxr-xr-x`), not a symlink; inside it, only five entries are symlinks (`agents -> ../.skilled/agents`, `commands -> ../.skilled/commands`, etc.) alongside real files (`package.json`, `package-lock.json`, `node_modules`).
- So paths resolve today, but not for the stated reason. Anyone who reads the claim and then checks or scripts the root sees a directory, which undermines trust in the surrounding note.

### F-005 — The voice baseline moved after the rewrite: five README commits post-date `7076dba64b`

- `git rev-list --count 7076dba64b..HEAD` → **5**, and all five touch only the README's section-2 voice/structure:
  - `3ad5ca25fb` `docs(readme): section 2 heading to all caps`
  - `4b51a59fb7` `docs(readme): the foundation leads section 2`
  - `0fd86a8c32` `docs(readme): correct the recorded section-2 verdict`
  - `f3c98aa316` `docs(readme): section 2 becomes Overview, h3s stripped bare`
  - `b6431fe588` `docs(readme): retitle section 2 and restore its overview subheading`
- The changelog was rewritten "in the root README voice" against a README snapshot that is now five commits old. Any voice-conformance judgment must pin README at HEAD, not at the rewrite baseline.
- Confirmed against the live README: `## 2. 🎁 OVERVIEW` (all caps) with `### THE FOUNDATION` leading, exactly as the last two commits describe.

### F-006 — Duplication map across the four competing surfaces

- **Root README §2 OVERVIEW** already gives one benefit-led bullet block per subsystem (Spec Kit, Spec Memory & Search, Deep Loop, Skill Advisor, Agent Library, Plugin & Extension Library, README lines 103–164). The changelog's `What's New at a Glance` (31 bullets, lines 24–52) fills the same role for v4 changes at roughly five times the volume.
- **README §3+** owns install paths, verification commands and adoption ("Adapting to Your Stack", README lines 221–229). The changelog's `Upgrade Notes` (lines 711–719) duplicates the same operational territory as three ~40-line mega-bullets (renames, repoints, changed defaults, adopter reconciliation).
- **033 specs**: the changelog is one of 45 phase children; packets 034 (v4-state inventory), 035 (changelog draft update), 042 (doc freshness), 043 (root README), 044 (late-cycle entries) and 045 (this voice rewrite) own the same surface, and parent `spec.md`/`timeline.md` carry the phase map. The changelog's job is the reader-facing digest; the packets hold the durable history the `After This Draft` block currently duplicates in worse form.
- **sk-create-changelog contract** (SKILL.md): global changelogs live at `.skilled/changelog/{component}/v{VERSION}.md`, "start directly with the summary paragraph", and carry "no version header or boilerplate at the top of the file" (lines 12, 244–249); compact format under 10 changes, expanded at 10+, major, or breaking (line 248); the expanded template's item shape is H4 heading + paragraph + `&nbsp;` (lines 287–306). The v4 changelog matches the **item skeleton** but departs on **location** (packet root, not a component folder), **frontmatter** (YAML `title`/`trigger_phrases` for the trigger index), and **H1 header** (`# v4.0.0.0, Fewer Paths…`). Format-choice rule is satisfied: v4 is a major release → expanded format is correct.
- One more surface: `.skilled/changelog/` holds 13 component changelogs; `system-spec-kit` is only one of them, so the v4 release notes are not a per-component changelog at all and must not be forced into that path.

### F-007 — Audience and ordering map; where priority breaks down

- README foundation order: Spec Kit → Spec Memory & Search → Deep Loop → Skill Advisor → Agent Library → Plugin & Extension Library (building blocks first).
- Changelog order: glance → shape thesis → Spec Kit → **Skill Advisor** → Documentation → **Deep Loops** → Orchestrating → Hooks/Goals → Design → Code → Git → Prompt → MCP → Agent Discipline → Plain-English → Upgrade Notes → Internal Seams → After This Draft.
- Divergences: README puts the deep loop before the advisor (changelog reverses them); README's skill-library order (CODE WORKFLOW before DESIGN before DOCUMENTATION…) is not the changelog's section order (Documentation 4th, Design 9th, Code 10th).
- First-time reader vs maintainer: the glance list leads correctly but is 31 bullets; the maintainer-grade material (Upgrade Notes, mega-bullets) arrives last, which is right, but `Internal Seams` is explicitly non-user-facing ("No user-facing change in this section", line 725) yet occupies a top-level slot before `After This Draft`; `After This Draft` is pure draft residue. The thesis section `One Shape for Every Skill` restates the intro paragraph's thesis (lines 11–19) instead of extending it.

### F-008 — Over-specific, drift-prone counts beyond the four already-corrected ones

- The 045 spec's four corrections landed (line 24 "Seven hubs", lines 39/44/632 "nine modes", line 489 "other six hubs"), verified against `.skilled/changelog` expectations and the spec REQ-004.
- Still time-stamped and drift-prone: seven-external-CLI roster and per-CLI model counts (line 274, "Cursor carries 21 ids across six families"), "eighteen of the twenty-two hook packages" (line 35), "102 relative symlinks" (line 463), "178 recommendations" (line 295), "two forked cache extensions" history (line 393). These are true at write time and unverifiable later; candidates to re-derive at publication or soften to role language.

## QUESTIONS ANSWERED

- **Q4 (README voice and divergence)** — substantively answered for structure and prose mechanics: benefit-led bullets, bold labels, one idea per line, numbered emoji H2 sections, `.skilled/` paths, zero `&nbsp;`. The changelog diverges on H2 numbering/emoji, its 44 `&nbsp;` separators, H3-less skeleton, and `.opencode/` path spelling. Remaining work is sentence-level conformance sampling.
- **Q2 (stale / over-specific claims)** — substantively answered: post-rewrite drift (F-003, F-004, F-005) plus over-specific counts (F-008), with the four spec-tracked counts confirmed already fixed.
- **Q5 (contract vs deliberate departure)** — substantively answered: the expanded-template item skeleton is followed; location, frontmatter and H1 header are deliberate, audience-justified departures (trigger-index discoverability, single major release, packet workflow).
- **Q1 (duplication)** — partially answered: the surface-level map is complete (F-006); a sentence-level duplication table between the glance list and README §2, and between Upgrade Notes and README §3, remains.
- **Q3 (ordering)** — partially answered: divergences are mapped (F-007) and the obvious moves are visible (drop `After This Draft`, move `Internal Seams` to an appendix, align skill-family order with the README library order). The recommended order itself is iteration-2 work.

## QUESTIONS REMAINING

- Q1: sentence-level duplication table (glance vs README §2; Upgrade Notes vs README §3/adoption; which changelog paragraphs add nothing the 033 packets or README already say better).
- Q3: the concrete recommended section order, and the first-draft keep/merge/move/drop decision per section (evidence in hand, decision pending).
- Q2/follow-up: pin the exact README HEAD snapshot as the voice standard and re-audit the changelog's prose against it; verify whether the five post-rewrite README commits change any prose rule the rewrite applied.
- Q5/follow-up: read the remainder of the contract (`SKILL.md` lines 451+, `assets/changelog-template.md`) to confirm the template's summary/upgrade wording, then record the deliberate departures formally.
- Candidate outline work: a major-release changelog outline that serves the first-time reader (glance → thesis → families → upgrade) with the maintainer material in a collapsed appendix.

## NEXT FOCUS

Iteration 2: build the sentence-level duplication table and draft the keep/merge/move/drop decisions per section, plus a recommended section order pinned to README HEAD; verify the remaining over-specific counts against the tree and read the 035/044 packet summaries to source the late-cycle facts precisely.

## SCOPE VIOLATIONS

None. Every write stayed inside `research/iterations/` and the run's gateway contract; every read targeted files this iteration was chartered to analyze. No researched file was modified, renamed or deleted.
