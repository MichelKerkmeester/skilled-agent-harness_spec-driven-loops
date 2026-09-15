---
title: "Iteration 7: Hermes Section Budgets and the Section 7 Emoji Blast Radius"
trigger_phrases: []
---
# Iteration 7: Hermes Section Budgets and the Section 7 Emoji Blast Radius

## Focus
Measure the character cost of the four plugin prompt sections against Hermes's per-section and total caps, state remaining headroom as numbers, decide whether a repo-rules digest section is worth that headroom versus naming the file in the dispatch prompt, and confirm what else in the repo would break if the section 7 heading emoji changed.

## Findings

1. **The only cap that exists is per-section: 4000 characters, and an over-cap section is skipped, not truncated** — "Hermes caps every plugin prompt section at 4000 characters and skips a section that exceeds it, so each piece of context is its own section and each stays under the cap." No total-section cap appears anywhere in the plugin or the packet; the adjacent budgets are `PROMPT_CONTEXT_MAX_CHARS = 3000` (pre_llm_call context) and `ADVISOR_BRIEF_MAX_CHARS = 1200`. The four registered sections are `repo-guards-session-context`, `repo-guards-persona`, `repo-guards-goal`, `repo-guards-session-advisories`. [SOURCE: .hermes/plugins/repo-guards/__init__.py:54-55,126-129,841-853]

2. **Measured cost per section and remaining headroom** (cost = characters; observed values cited, fixed templates computed):

| Section | Cap | Cost | Headroom | Evidence |
|---|---|---|---|---|
| session-context | 4000 | 303 without a bound packet; 3402 with bound packet + goal slice | 3697 / **598** | Playbook HERMES-015 first pass (303) and second pass re-verify (3402) |
| persona | 4000 | 276 (`code`) – 321 (`deep-research`); fixed template | ~3679–3724 | Computed by replicating the renderer template exactly |
| goal | 4000 | 0 with no bound goal; up to 3621 when the directive block exceeds the 3600-char slice cap (+21-char truncation notice) | 4000 / **379** | Renderer caps at `GOAL_SLICE_MAX_CHARS = 3600` then the section slice at 4000 |
| session-advisories | 4000 | variable; one `name: warning` line per session-start guard that warns | up to 4000 (renderer truncates to the cap) | Renderer joins guard lines and slices at `SECTION_MAX_CHARS` |

   Worst-case registered total is 4 × 4000 = 16,000 characters; the realistic bound is the packed session-context (3402) plus persona (~300) plus goal (0–3621) plus advisories (typically a few hundred) ≈ 3,700–7,300. The scarcest section is session-context at 598 characters of headroom whenever a bound packet carries a large goal. [SOURCE: .hermes/plugins/repo-guards/__init__.py:54,128-129,615-637,735-775]

3. **A repo-rules digest section is not worth the headroom; name the file in the dispatch prompt instead.** The costs: AGENTS.md is 25,085 characters, so a 4,000-char digest could carry at most 16% of it, and an over-cap digest is *skipped silently* rather than truncated — the worst failure shape (the digest would simply not exist for the runs that most needed it). The digest would also become a fifth copy of governance content with no drift guard, which is exactly the class iteration 6 found already drifting in four other places. Naming `.opencode/AGENTS.md` (or `AGENTS.md`) in the dispatch prompt costs one line, is always current, and is readable by any leaf carrying the `file` toolset — the same toolset whose absence iteration 3 flags as a defect. The repo's own precedent agrees: the persona section deliberately binds a *name* and defers the 22k persona to a preloaded skill rather than inlining it. [SOURCE: .hermes/plugins/repo-guards/__init__.py:703-713] [SOURCE: AGENTS.md:1-3 measured 25,085 chars] [INFERENCE: digest-doctrine judgment on top of the measured budget]

4. **The section 7 heading carries exactly one U+200D, and it is the only one in the file.** Line 247: `## 7. 🧑🏫 ESCALATION & CONFLICT` — codepoints `0x1f9d1 0x200d 0x1f3eb` (person + ZWJ + school), the teacher sequence. The file measures 25,085 characters / 25,263 bytes. Any replacement must avoid ZWJ sequences entirely, since the scanner blocks on the joiner, not on the emoji. [SOURCE: AGENTS.md:247, measured by script 2026-09-15]

5. **Doc validators would not break.** `validate_document.py` no longer enforces heading emojis at all: `EMOJI_REQUIRED_TYPES = set()` with the comment "Emoji enforcement has been removed — no document types require H2 emojis". `SECTION_EMOJIS` (which does not contain the teacher sequence anyway) is used only by `extract_structure.py`, whose `has_emoji` detection tests single-codepoint ranges (`\U0001F300-\U0001F9FF`, plus dingbats) — the leading 🧑 (U+1F9D1) alone keeps `has_emoji` true even after the joiner is gone. So swapping or dropping the joiner cannot fail a validator; a swapped single-codepoint emoji is still detected. [SOURCE: .opencode/skills/sk-doc/shared/scripts/extract_structure.py:171,307-331] [SOURCE: .opencode/skills/sk-doc/shared/scripts/validate_document.py:259,666-668]

6. **Byte-drift checks do not key on the heading.** The only generator that reads AGENTS.md is `sync-gate1-pointers.cjs`: it extracts the single line containing the Gate 1 marker and writes pointer blocks into `.codex/AGENTS.md` and `.cursor/rules/skill-routing.md`. A section 7 heading change produces no diff in either pointer file, because neither the marker line nor the pointer text includes the heading. The pre-commit mirror checker covers `.claude/agents`, `.codex/agents`, `.cursor/agents|commands|hooks` and hook JSON files — AGENTS.md is not among the mirrored artifacts. `CLAUDE.md` is a symlink to `AGENTS.md`, so it follows automatically with no copy to update. [SOURCE: .opencode/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-gate1-pointers.cjs:24,30-35,55] [SOURCE: .opencode/scripts/git-hooks/pre-commit:88-100,126-129] [SOURCE: `ls -la` — `CLAUDE.md -> AGENTS.md`]

7. **What *would* notice the change: only historical snapshots.** Two archived copies under the governance-alignment packet carry the same heading (`specs/sk-doc/055-governance-doc-alignment/scratch/agents-md.original-496.md:381`, `agents-md.pre-audit-453.md:358`); a future manual diff against those snapshots would show it. No automated check compares them, and no test or fixture asserts the heading text (a repo-wide search for the teacher sequence outside archives finds only unrelated application code). [SOURCE: grep for U+200D / 🧑 across the repo, excluding node_modules, 2026-09-15]

8. **The practical blast radius is therefore one line and zero automated checks — the fix is safe but should be paired with the Hermes-side proof.** The joiner's only known consumer that rejects it is Hermes's context scanner; removing it clears the scan (starting fact 6). The cheapest verification is a Hermes session that injects rules (no `--ignore-rules`) quoting a section-7 line, with the pre-fix block recorded as the control. [INFERENCE: based on starting fact 6 plus the absence of any other consumer found here]

## Ruled Out
- A repo-rules digest section: over-cap sections are skipped outright, the digest would be 16%-at-best stale text, and it duplicates governance content with no drift guard. [SOURCE: plugin:126-128 plus AGENTS.md measured length]
- Expecting sk-doc validation to catch the emoji change either way: emoji enforcement is explicitly disabled and `SECTION_EMOJIS` does not police H2 headings. [SOURCE: validate_document.py EMOJI_REQUIRED_TYPES]

## Dead Ends
- Searching for a byte-drift or hash check over AGENTS.md: the retrieval corpus entries that mention AGENTS.md are unrelated packet context files, and the only root-file consumer is the Gate 1 pointer generator. [SOURCE: .opencode/skills/system-spec-kit/runtime/cli/retrieval/fixtures/corpus-manifest.json entries + sync-gate1-pointers.cjs]

## Edge Cases
- Contradictory evidence: the charter asks about "per-section and total caps"; only a per-section cap exists in the plugin, and the repo comment names only that one. The "total" figure is reported here as the registry's worst case (4 × 4000), not as an enforced cap. [SOURCE: plugin:126-128]
- Partial success: session-context cost is observed (303/3402) only for the sampled packets; a different packet with a longer session-start context and a large goal competes for the same 4000 and can push the section toward the cap. The goal section's worst case (3621) is computed from the slice cap, not observed.
- Missing dependencies: the Hermes-side scanner is outside the repo; the "no other consumer" claim is bounded to this repository.

## Sources Consulted
- .hermes/plugins/repo-guards/__init__.py
- AGENTS.md
- .opencode/skills/sk-doc/shared/scripts/extract_structure.py
- .opencode/skills/sk-doc/shared/scripts/validate_document.py
- .opencode/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-gate1-pointers.cjs
- .opencode/scripts/git-hooks/pre-commit
- .opencode/skills/cli-external-orchestration/cli-hermes/manual-testing-playbook/skills-and-plugins/session-start-advisories-section.md (observed section sizes via HERMES-015/020 records)
- .opencode/skills/cli-external-orchestration/cli-hermes/references/agent-delegation.md:48
