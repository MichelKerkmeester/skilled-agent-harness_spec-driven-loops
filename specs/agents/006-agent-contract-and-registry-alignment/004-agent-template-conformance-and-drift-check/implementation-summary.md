---
title: "Implementation Summary: Phase 4: agent-template-conformance-and-drift-check"
description: "The agent template now lists its required sections, all eleven agent files carry them, and the roster check fails when one drifts."
trigger_phrases:
  - "agent template conformance implementation summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "agents/006-agent-contract-and-registry-alignment/004-agent-template-conformance-and-drift-check"
    last_updated_at: "2026-11-14T13:26:02Z"
    last_updated_by: "generate-context"
    recent_action: "Closed phase 4 with all seven acceptance rows Met"
    next_safe_action: "Run the phase 005 tasks in order from T001"
    packet_purpose: "Purpose: Every agent file follows the template's current outline or carries a named exception, and CI fails the day one drifts."
    blockers: []
    key_files:
      - ".skilled/bin/sync-agent-roster.cjs"
      - ".skilled/skills/sk-doc/sk-create-agent/assets/agent-template.md"
      - ".skilled/agents/agent-registry.json"
    session_dedup:
      fingerprint: "sha256:17a86bd02214676aed807161cac5b6e1d753e6df195fee02c52fa5f058a970f7"
      session_id: "b4d994a7-2eea-4664-a8cc-18efadcb7983"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "b4d994a7-2eea-4664-a8cc-18efadcb7983"
      workspace: "/Users/michelkerkmeester/worktrees/public/377-agent-contract-and-registry-alignment"
      savedAt: "2026-11-14T13:26:02Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-agent-template-conformance-and-drift-check |
| **Completed** | 2026-11-14 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

An agent file that drops, renames or reorders a required section now fails the roster check. Before this phase nothing compared an agent file with the template, and ten of eleven files still used a section name the template had replaced.

### A required-sections list in the template

`agent-template.md` gives a full skeleton and never said which sections an agent must carry. It now holds a list of eight between two markers: ILLEGAL NESTING, CORE WORKFLOW, CAPABILITY SCAN, HOOK-INJECTED CONTEXT ROUTING, OUTPUT FORMAT, OUTPUT VERIFICATION, ANTI-PATTERNS and RELATED RESOURCES. A heading meets an entry when its text after the number starts with the entry. `0b`, RUNTIME PARAMETERS and SUMMARY stay optional.

### The outline check

The `--check` mode of `sync-agent-roster.cjs` reads that list from the template at run time, compares each agent's numbered headings with it, and skips an entry the registry records under `templateExceptions`. It exits 2 when the list cannot be read.

### Eleven outlines

Ten files renamed their skills section to CAPABILITY SCAN. The advisor paragraph moved from the preamble into its own HOOK-INJECTED CONTEXT ROUTING section in ten files, and `markdown.md` moved its existing section ahead of its output sections. The sections after the new one took the next number, and 79 section references were rechecked. `debug.md` renamed RESPONSE FORMAT to OUTPUT FORMAT.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-doc/sk-create-agent/assets/agent-template.md` | Modified | The required-sections list and three dialect bullets |
| `.skilled/bin/sync-agent-roster.cjs` | Modified | Outline check in `--check` mode |
| `.skilled/bin/sync-agent-roster.vitest.ts` | Modified | Five cases, twelve in total |
| `.skilled/agents/*.md`, eleven files | Modified | Section names, the hook section and section numbers |
| `.skilled/agents/agent-registry.json` | Modified | Four `templateExceptions` entries |
| `.skilled/bin/README.md` | Modified | The script's row names the two newer checks |
| `.skilled/skills/sk-doc/sk-create-agent/SKILL.md` | Modified | Creation step 13 names the check |
| `.claude/agents` twins of the eleven files | Modified | Hand-kept twins, the same lines |
| `.codex`, `.pi` and `.dsh` copies | Regenerated | Generated copies |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The orchestrating session compared the eleven outlines with the template skeleton and found 44 differences, 24 of them outside the two planned renames. It put the choice to the operator, who picked a narrow required list written into the template. DeepSeek V4.1 Flash at max, through `cli-opencode` on the LLM Gateway route, then made four changes in four dispatches: the template list, the check with its tests, the registry exceptions and the two documentation lines. The section moves were not dispatched. A script, kept as `scratch/outline-move.py`, moved each block and renumbered each heading and reference in the canonical file and its Claude twin, so the moved text is byte-identical by construction, and it wrote the parity and reference tables from the same run. The briefs are under `scratch/dispatch-briefs/`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| A narrow required list, written into the template | Operator answer, 2026-11-14. The alternative was about 20 registry exceptions, half of them for a section only one agent has, or new rule text in ten files |
| The template changed although the phase listed it as unchanged | The same operator answer amends the scope. `spec.md` records it |
| A heading meets an entry by its opening words | Section 0 has three titles across the files and `deep-review` adds a suffix to CORE WORKFLOW. An exact match would have forced seven heading changes that say nothing |
| `ai-council` carries its hook section as section 18, out of the template's order | Twelve files in the `deep-ai-council` skill cite its sections 3 to 17 by number, and this packet does not edit skill reference files |
| `code`, `deep-review` and `orchestrate` are excepted from OUTPUT FORMAT | Each states its output under a section of its own, and the registry gives the reason |
| The section moves ran as a script, not as dispatches | The phase requires each moved block to be byte-identical, which a script guarantees and a model retyping 458 lines does not |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Acceptance criteria | 7 of 7 `Met`, none waived, see `acceptance-criteria.md` |
| `tasks.md` checklist | Every P0, P1 and P2 item checked with its output |
| `node .skilled/bin/sync-agent-roster.cjs --check` | `agent-roster: OK`, exit 0, 0.052 seconds real. Before the conversion it listed 26 problems across all eleven agents |
| The same check on a scratch copy with one heading renamed | `missing required section: review: CAPABILITY SCAN`, exit 1 |
| The same check with the template's END marker removed | `cannot read the required sections from` with the path, exit 2 |
| `vitest run --root .skilled --config vitest.config.bin.ts bin/sync-agent-roster.vitest.ts` | 12 passed of 12 |
| `quality-gate.cjs --files` on the script and its test | No P0, P1 or P2 finding, exit 0 |
| `scratch/move-parity.md` | 11 blocks, all `identical apart from heading` |
| `scratch/section-refs.md` | 79 references, all `resolves` |
| `node .skilled/bin/check-agent-mirror-sync.cjs --all` | `11 agent(s) checked — all comparable mirrors in sync — OK`, exit 0 |
| Canonical diff against Claude twin diff, eleven files | The changed lines are identical in each pair |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No agent was dispatched after the outline change.** The sections moved and no rule text changed, so the proof is the parity table, not a live run. Phase 5 dispatches three agents before and after its own edits.
2. **References to agent sections outside the agent files were searched by one pattern.** It found citations of `ai-council.md` only, and those sections kept their numbers. A citation written in another form would not have been found.
3. **`debug.md`, `markdown.md` and `code.md` sections moved by one number.** `orchestrate.md` cites `code.md` section 8 and was repointed to section 9. Phase 5's documents still say `code.md` section 8 for the return contract, which is now section 9.
4. **The eleven files total 53,367 words.** Phases 3 and 4 added to the 52,568 that phase 5 measured, so phase 5 starts from the higher number.
5. **The CI step was not run on GitHub.** The branch is local, so the check has only run on this machine.
<!-- /ANCHOR:limitations -->

---
