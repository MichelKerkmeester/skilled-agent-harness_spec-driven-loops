---
title: "Implementation Summary"
description: "AGENTS.md, four repo rules, the rule router and sk-prompt now agree with themselves and with the current Claude and GPT-6 prompting guides, after three model lenses and a line-by-line check of every finding; GPT-6 Luna joined the cli-devin roster to make the second lens possible."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "agents/013-prompting-guide-alignment"
    last_updated_at: "2026-09-24T09:52:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Applied 18 verified findings and recorded the synthesis"
    next_safe_action: "Operator settles the three open decisions and approves deleting scratch/"
    blockers:
      - "Deleting scratch/sources and scratch/briefs needs the operator's yes (AGENTS.md stop-for-yes on delete)"
      - "Stop-for-yes list against the reversibility ladder: operator decision"
      - "@prompt-improver improvement-cycle cap, 3 or 1: operator decision"
    key_files:
      - "research/synthesis.md"
      - "AGENTS.md"
      - ".skilled/skills/sk-prompt/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "0c3eaa67-d9c2-4f09-a546-1be4055e458e"
      parent_session_id: null
    completion_pct: 90
    open_questions:
      - "Which prevails for reversible deletes and installs: AGENTS.md:116 or blast-radius.md §2?"
      - "How many improvement cycles does @prompt-improver run: SKILL.md §7 and the playbook say 3, the agent says 1?"
    answered_questions:
      - "Luna model: GPT-6 Luna max-priority, added to the roster"
      - "MiMo route: restore the one comma in .pi/models.json"
      - "Apply scope: autonomous"
      - "Workspace: a git worktree"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 013-prompting-guide-alignment |
| **Completed** | Not yet: three operator decisions and one delete approval open |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A model reading `AGENTS.md`, the repo rules or `sk-prompt` literally no longer meets instructions that contradict each other. GPT-6's guide warns that exactly this makes it pause and block early, and eighteen changes remove the contradictions the three lenses found, plus the techniques both vendors document.

### Align AGENTS.md, repo rules and sk-prompt with current vendor prompting guides

You can now ask a question-heavy model to act, and it reads first, asks once, and asks before the work the answer would change rather than before any analysis. When a rule, skill or gate stops it, it names the file and quotes the line, so you can see whether the stop was real. Law 4 halts where the confidence table says to ask, and a skipped gate other than Gate 3 is run instead of triggering a spec-folder question.

In the rules, a tier-3 stop comes after the reversible work is done, a model id or CLI flag is checked against the live tool before it is named as current, and a resume restatement carries your constraints in your words. `sk-prompt` now asks its one question only when someone can answer it, lets prompts address the model as "you", drops seven unsourced success percentages, asks for conclusions instead of reasoning transcripts, tags and varies few-shot examples, puts long source material first, and defines RICCE once.

To make the GPT-6 Luna lens possible, `gpt-6-luna-max` and `gpt-6-luna-max-priority` joined the cli-devin roster. The full ranked list, with every rejected proposal and its reason, is `research/synthesis.md`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `AGENTS.md` | Modified | Law 4, question timing, Violation Recovery, targeted recheck, name-the-source bullet (284 to 285 lines) |
| `REPO RULES.md` | Modified | Skill guidance ranks at level 3 in the precedence table |
| `.skilled/repo-rules/uncertainty-and-honesty.md` | Modified | Question timing; check fast-moving names live (1.0.1.1) |
| `.skilled/repo-rules/blast-radius.md` | Modified | Finish reversible work before a tier-3 stop (1.0.1.1) |
| `.skilled/repo-rules/communication-decisions.md` | Modified | Approach list capped at five (1.3.0.1) |
| `.skilled/repo-rules/communication-handoff.md` | Modified | Restatement carries standing constraints (1.6.0.1) |
| `.skilled/skills/sk-prompt/SKILL.md` | Modified | Matrix, ALWAYS 1, NEVER 1 and 4 (3.0.1.0) |
| `.skilled/skills/sk-prompt/references/patterns-evaluation.md` | Modified | Matrix, chain-of-thought format, few-shot tags |
| `.skilled/skills/sk-prompt/references/depth-framework.md` | Modified | Single-point interaction, selection criteria, RICCE |
| `.skilled/skills/sk-prompt/assets/cli-prompt-quality-card.md` | Modified | Expression and Arrangement checks |
| `.skilled/skills/sk-prompt/changelog/v3.0.1.0.md` | Created | Release note |
| `.hermes/skills/sk-prompt/SKILL.md`, `.hermes/skills/cli-devin/SKILL.md` | Regenerated | Hermes mirrors |
| `system-deep-loop/runtime/lib/deep-loop/executor-config.ts`, `runtime/scripts/fanout-run.cjs`, `runtime/tests/unit/fanout-run.vitest.ts` | Modified | GPT-6 Luna pair on the devin roster |
| `cli-devin/SKILL.md`, `README.md`, `references/providers-and-models.md`, `references/cli-reference.md`, `changelog/v1.4.3.0.md` | Modified / Created | Roster docs (1.4.3.0) |
| `.pi/models.json` (main checkout) | Modified | Comma and space restored in a line another session had joined |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Three lenses read the same five vendor page copies. Opus wrote its lens first, before either delegate's output was opened. GPT-6 Luna max-fast on cli-devin and MiMo v2.6 pro high on cli-pi each ran three one-angle briefs, read-only and headless, and all six exited 0 with empty stderr. The worktree's tracked-diff hash matched before and after, so neither delegate wrote anything.

Every finding the synthesis repeats was re-opened at both its vendor line and its repository line. That check rejected three proposals two lenses agreed on, and it moved one accepted row, the improvement-cycle cap, to the operator once the playbook turned out to test the other side. Edits went through the owning workflow: `sk-create-repo-rule`'s revise path for the rules, `sk-create-changelog`'s compact format for the release notes. The work is committed on the worktree branch in four commits, one per area, and is not pushed. The vendor page copies, prompts and logs under `scratch/` stay out of every commit.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Leave `AGENTS.md:116`'s stop-for-yes unchanged | It clashes with `blast-radius.md` §2, but relaxing a mandatory wait is a safety call that belongs to the operator |
| Leave the prompt-improver agent's CRITICAL and MANDATORY labels | `sk-create-agent`'s template prescribes them for all twelve agents; the amendment is proposed against the template instead |
| Leave `SKILL.md:464`'s three-cycle cap | Two playbook scenarios assert it while the agent says one retry; either fix changes tested behavior |
| Add no new rule file | Every accepted change had an existing owner, which is where `decision-tests.md` §5 sends it |
| Keep AGENTS.md growth to one line | Detail belongs in the rules, and each AGENTS.md change was a rewording in place |
| Write two files the frozen scope table does not list | `cli-devin/changelog/v1.4.3.0.md` follows from the version rule (a `SKILL.md` version equals its newest changelog), and `.hermes/skills/sk-prompt/SKILL.md` is regenerated by the mirror script; `scope-discipline.md` §2 counts both as the same change |
| Leave `.codex/AGENTS.md` alone although scope names it | It is a nodeterm-generated file that does not copy `AGENTS.md` |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `check-repo-rules.cjs` | PASS 9/9, exit 0 |
| sk-doc `validate_document.py`, sk-prompt files and changelog | VALID, exit 0 on all five |
| sk-doc `validate_document.py`, `AGENTS.md`, `REPO RULES.md`, four rules | One issue each (missing "overview", read as README type), identical at base `c70180f373` |
| Frontmatter-version gate, sk-prompt and cli-external-orchestration | ok=37 and ok=433, exit 0, run from the worktree with the main checkout's engine |
| Hermes skill mirrors | PASS 70/70 after regenerating two |
| Runtime, Codex agent, Codex prompt, hook-registration mirrors | PASS 168, 12, 33, 4 files; exit 0 each |
| Agent mirror sync and roster | 12 agents in sync; roster OK |
| vitest `fanout-run` + `combo-matrix` | 155 passed, 0 failed, exit 0. Baseline in the main checkout under load: 146 passed, 9 failed |
| Drift guards | Exit 1 at base and after: nine errors, all in files this packet does not touch |
| `validate.sh --strict` | RESULT: PASSED, 0 errors, 0 warnings, exit 0, after generating `description.json` and re-deriving `graph-metadata.json` with the main checkout's built tools |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Three decisions are the operator's.** The stop-for-yes list against the reversibility ladder, the agent template's emphasis labels, and the improvement-cycle cap. Each is written up in `research/synthesis.md` §3 with the fix for either answer.
2. **Vendor page copies are still on disk.** `scratch/sources/` and `scratch/briefs/` wait for the operator's yes to delete; the page text must not be committed.
3. **The worktree has no shared dependencies.** Post-edit hooks and `check-agent-mirror-sync.cjs` cannot load `@spec-kit/shared` here, so those checks ran from the main checkout's copy.
4. **Adjacent defects, reported and not fixed.** The drift-guard errors in `cli-jev` probe scripts and old containment copies; `child-dispatch-preamble.md:61`'s files-on-disk completion line; the cli-devin docs' default permission mode, default model, Gemini note and unlisted Grok; em dashes in `answer-the-actual-request.md` against `communication-prose.md`; the hub `ROUTER.md:61` roster line, which omits GPT-6 Luna and feeds compiled routing; nine `fanout-run` tests that failed in the loaded baseline run and passed on the quiet rerun, so they look load-sensitive rather than broken.
<!-- /ANCHOR:limitations -->

---
