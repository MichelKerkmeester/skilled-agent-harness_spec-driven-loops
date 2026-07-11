---
title: "Implementation Summary"
description: "Open with a hook: what changed and why it matters. One paragraph, impact first."
trigger_phrases:
  - "implementation"
  - "summary"
  - "template"
  - "impl summary core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-phased-spec-preference"
    last_updated_at: "2026-07-11T13:44:07.775Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Initialized Level 2 template"
    next_safe_action: "Replace continuity placeholders"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/029-phased-spec-preference"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 029-phased-spec-preference |
| **Completed** | 2026-07-11 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

<!-- Voice guide:
     Open with a hook: what changed and why it matters. One paragraph, impact first.
     Then use ### subsections per feature. Each subsection: what it does + why it exists.
     Write "You can now inspect the trace" not "Trace inspection was implemented."
     NO "Files Changed" table for Level 3/3+. The narrative IS the summary.
     For Level 1-2, a Files Changed table after the narrative is fine.
     Reference: specs/system-spec-kit/020-mcp-working-memory-hybrid-rag/implementation-summary.md -->

system-spec-kit now prefers extending an active phased packet over spinning up a new sibling spec folder, and prefers one coordinated phased packet over several related single-spec folders — enforced across 8 files, including the Gate 3 hard-block every AI agent in this repo answers before any file write. GPT-5.6-sol-fast (xhigh reasoning, dispatched via cli-opencode) read every relevant reference doc itself and drafted exact wording; this session and an independent Opus 4.8 adversarial review both re-verified it against the real files before anything was applied.

### The Proposal

For Rule 1 ("prefer multi-phase specs over separate single spec folders, unless small or new/unrelated") and Rule 2 ("inside a phased spec, prefer adding a phase over a new spec folder"), the proposal edits seven files with exact diff-ready wording: `phase_definitions.md` (adds a "Phased-Packet Preference" and "Extending an Existing Phase Parent" section each), `SKILL.md` (rewrites ALWAYS rules 5 and 16), root `AGENTS.md`/`CLAUDE.md` (rewrites the Gate 3 A-E block with a recommendation priority `E → A → C → B → D`), `quick_reference.md` (rewrites §8 Update-vs-Create and §9 Confirmation Options), `folder_routing.md` (fixes the `"new folder"` bypass phrase that currently means "always create new, no evaluation"), and `sub_folder_versioning.md` (removes an existing invitation to dump unrelated work into one parent).

Critically, the proposal does not touch the existing phase-qualification math (complexity score >=25/50 AND documentation level >=3, both required) — it changes *recommendation priority*, not the dual-threshold gate, and it keeps the "AI recommends, user still chooses A-E" invariant intact everywhere.

### One correction this session made

The proposal (correctly) noticed that root `CLAUDE.md` and root `AGENTS.md` both carry the full Gate 3 text and told the maintainer to edit "both." Verification found `CLAUDE.md` is a **symlink to `AGENTS.md`** (`ls -la` confirms; `diff` is empty) — they are the same file on disk. So the Gate 3 edit is a single change, not two.

### Round 2: Adversarial Review (Opus 4.8)

The operator asked for a second opinion before anything got applied. Opus independently re-read every target file in its current state and found what neither GPT nor the first Claude pass caught: **the proposal's two separate edits to `quick_reference.md` §8 collide** — Rule 1 replaces the whole section and Rule 2 then tries to edit a paragraph that replacement just deleted, so applying them in the given order would fail mid-edit and silently drop Rule 2's content. It also caught that GPT's proposal still says "edit both CLAUDE.md and AGENTS.md" despite the symlink (the wording was never corrected even after being flagged), found a missed mirror (`README.md`'s Gate 3 ASCII diagram), flagged a category mismatch in the `folder_routing.md` edit (save-time routing vs. Gate 3 creation routing), and confirmed via grep that `gate-3-classifier.ts` never parses the option prose — so the edits are safe from the machine-contract side. It also answered the re-qualification question with real grounding instead of guessing.

Full review: `scratch/opus-review.md`.

### Round 3: Applied

The operator approved applying all 5 of Opus's fixes. **Opus's corrected wording, not GPT's raw diffs, is what shipped** — most consequentially, the merged `quick_reference.md` §8 (Fix 1) that avoids the blocking collision, and the symlink-aware single edit to `AGENTS.md` (Fix 2, `CLAUDE.md` picked it up automatically — confirmed identical after the edit). Verified before applying: no code in `.opencode/skills/system-spec-kit/scripts/` or `mcp_server/` string-matches any of the exact headings/sentences that changed, and `gate-3-classifier.ts` (left untouched) doesn't parse the option prose — so the edits carry zero runtime risk to the Gate 3 machine contract.

### Files Changed (this packet)

| File | Action | Purpose |
|------|--------|---------|
| `scratch/dispatch-prompt.txt` | Created | CRAFT-framework dispatch prompt (built by `@prompt-improver`, CLEAR 44/50) |
| `scratch/gpt-5.6-sol-analysis.json` | Created | Raw `opencode run` JSON event stream (34 events, 624KB) |
| `scratch/gpt-5.6-sol-proposal.md` | Created | Extracted final-response text: the full proposal |
| `scratch/opus-review.md` | Created | Round-2 adversarial review: verdict + blocking defect + 5 fixes |
| `spec.md`, `plan.md`, `tasks.md`, `checklist.md` | Modified | Filled from template with this packet's actual scope |
| `AGENTS.md` (`CLAUDE.md` symlinks to it) | Modified | Gate 3 A-E options + recommendation-priority line (Opus Fix 2 + Fix 3 applied) |
| `.opencode/skills/system-spec-kit/SKILL.md` | Modified | ALWAYS rules 5 + 16 |
| `.opencode/skills/system-spec-kit/references/structure/phase_definitions.md` | Modified | §1 sentence, "Phased-Packet Preference" section, "Extending an Existing Phase Parent" section (+27/-2 lines) |
| `.opencode/skills/system-spec-kit/references/workflows/quick_reference.md` | Modified | §8 merged replacement (Opus Fix 1) + §9 rewrite (+58/-30 lines) |
| `.opencode/skills/system-spec-kit/references/structure/folder_routing.md` | Modified | §9 `"new folder"` row, save-scoped wording (Opus Fix 4) |
| `.opencode/skills/system-spec-kit/references/structure/sub_folder_versioning.md` | Modified | §1 bullet |
| `.opencode/skills/system-spec-kit/references/workflows/spec_folder_authoring_checklist.md` | Modified | §2 pre-checks insert |
| `README.md` | Modified | Gate 3 ASCII diagram E-label sync (Opus Fix 5), box alignment preserved |

### Round 4: Skip-Last Reorder (operator follow-up)

Operator feedback: "Skip" should always sort last among a command's option letters, not sit ahead of a real processing choice. Audited every "Skip" occurrence across `.opencode/skills/` and `.opencode/commands/` (~35 hits) and classified each: most were already last in their list (memory-save skip, validation skip, skill-approval skip, resume-vs-fresh skip, etc.) and were left untouched. Two genuine patterns needed reordering:

1. **The Gate-3 "Spec Folder A-E" list** (`D) Skip, E) Phase folder` → `D) Extend phased packet, E) Skip`) — found duplicated in 10 places beyond the framework docs already touched in Round 3: the live spec-gate hook source (`runtime/lib/spec-gate/spec-gate-core.mjs` — the actual runtime string behind every "SPEC FOLDER QUESTION" message this session), and 9 command asset files across `/speckit:plan`, `/speckit:implement`, `/speckit:complete`, `/create:skill`, `/create:feature-catalog`, `/create:skill-parent`, `/create:manual-testing-playbook` that duplicate the same list independently of AGENTS.md.
2. **The "Session Goal" list** (`B) Skip, C) Set goal: <objective>` → `B) Set goal: <objective>, C) Skip`) — found in 4 speckit presentation files (`resume`, `implement`, `complete`, `plan`).

Deliberately left alone: `doctor_update_presentation.txt`'s `2) Skip` before `X) Cancel`, and `doctor_skill-advisor.yaml`'s `C) Skip verification` before `D) Rollback all changes` — treated `Cancel`/`Rollback` as abort/escape actions in a different category from a peer processing choice, not something Skip needs to precede. Also left `speckit_resume_presentation.txt`'s Q0 line alone (`A) List and select B) Start new... C) Cancel E) Phase folder` — a pre-existing, unrelated bug (missing `D)`, no literal "Skip" wording) outside this fix's scope. The `manual_testing_playbook/plugins-and-hooks/spec-mutation-gate-enforce.md` fixture still shows the old captured hook output (an honest historical transcript, not a living spec) — now stale relative to the source fix; flagged for the operator to refresh by re-running that playbook rather than hand-edited to avoid fabricating a "captured" result that wasn't re-executed.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

<!-- Voice guide:
     Tell the delivery story. What gave you confidence this works?
     "All features shipped behind feature flags" not "Feature flags were used."
     For Level 1: a single sentence is enough.
     For Level 3+: describe stages (testing, rollout, verification). -->

GPT-5.6 self-corrected its own briefing during the read phase (it noticed the dispatch prompt's framing — "only CLAUDE.md has Gate 3" — was wrong, and found AGENTS.md carries it too via `gate-enforcement.md`'s canonical citation), which is a strong signal it read the files rather than pattern-matched the prompt. This session then independently re-verified via direct `grep`/`Read`/`diff` (not trusting GPT's self-report either): AGENTS.md/CLAUDE.md symlink relationship, SKILL.md ALWAYS rules 5+16 exact text, quick_reference.md §8/§9 exact text, folder_routing.md §9 bypass table, sub_folder_versioning.md's "Separating unrelated tasks" line, and gate-enforcement.md's "AGENTS.md §2 canonical" claim. All confirmed byte-accurate except the symlink nuance noted above. No framework edits were applied — this packet is proposal-only per its stated scope; the operator reviews and approves before any doc changes ship.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

<!-- Voice guide: "Why" column should read like you're explaining to a colleague.
     "Chose X because Y" not "X was selected due to Y." -->

| Decision | Why |
|----------|-----|
| Dispatched GPT-5.6-sol-fast at `--variant xhigh` instead of the skill default (deepseek-v4-pro) | Operator explicitly named this model; also this is governance-doc work where the extra reasoning budget pays for itself in citation accuracy |
| Escalated to `@prompt-improver` (CRAFT framework) instead of hand-writing the dispatch prompt | This edits the framework's own routing rules — a Tier-3 trigger (policy/governance sensitivity) per `cli_prompt_quality_card.md` §5 |
| Kept this packet proposal-only; no framework doc edits applied | Spec's own scope (§3 Out of Scope) reserves the actual edits for a follow-on once the operator approves the wording |
| Independently re-verified GPT's claims instead of forwarding them as-is | `finding-is-a-hypothesis` constitutional rule — a sub-agent's (or dispatched model's) claim is a hypothesis, not a fact, until checked against the real files |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

<!-- Voice guide: Be honest. Show failures alongside passes.
     "FAIL, TS2349 error in benchmarks.ts" not "Minor issues detected." -->

| Check | Result |
|-------|--------|
| `openai` provider auth pre-flight | PASS - `opencode providers list` shows OpenAI configured |
| `opencode run` dispatch | PASS - exit code 0, 34 JSON events, 624419 bytes, empty stderr |
| Gate 3 location claim (AGENTS.md vs CLAUDE.md) | VERIFIED - `ls -la` shows `CLAUDE.md -> AGENTS.md` (symlink), `diff` empty |
| `gate-enforcement.md` "AGENTS.md §2 canonical" claim | VERIFIED - `grep` confirms exact text |
| `SKILL.md` ALWAYS rules 5 + 16 exact text | VERIFIED - `grep` line-for-line match |
| `quick_reference.md` §8 + §9 exact text | VERIFIED - `sed`/`grep` line-for-line match, including the E-option "only shown when...phased content" caveat |
| `folder_routing.md` §9 `"new folder"` bypass row | VERIFIED - matches text read earlier in this session |
| `sub_folder_versioning.md` "Separating unrelated tasks" line | VERIFIED - `grep` line 33 exact match |
| `level_decision_matrix.md` "no Level 1 exempt tier" claim | VERIFIED - exempt (<5 chars) and Level 1 (<100 LOC) are documented as separate concepts |
| Opus 4.8 adversarial review of the full proposal | RAN - 16 tool uses, found 1 blocking defect + 1 repeated factual error + 1 missed file + 1 category-mismatch edit; verdict "apply with fixes," not as-is |
| `gate-3-classifier.ts` prose-dependency check | VERIFIED (by Opus) - `classifyPrompt`/`validateSpecFolderBinding` never parse the A-E option prose; edits are safe from the code side |
| Code-dependency sweep before applying | PASS - `grep` for the exact changed headings/sentences across `scripts/` and `mcp_server/` found zero matches; `gate-3-classifier.ts` diff is empty (untouched) |
| `CLAUDE.md` symlink propagation | PASS - edited `AGENTS.md` once; `diff CLAUDE.md AGENTS.md` empty after the edit, confirming the symlink carried it through |
| All 8 target files apply cleanly | PASS - every `old_string` matched on first attempt, no "string not found" errors |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

<!-- Voice guide: Number them. Be specific and actionable.
     "Adaptive fusion is enabled by default. Set SPECKIT_ADAPTIVE_FUSION=false to disable."
     not "Some features may require configuration."
     Write "None identified." if nothing applies. -->

1. **`spec-folder-naming.md` and `spec_folder_authoring_checklist.md`'s pre-existing content weren't independently re-read line-by-line** beyond the specific anchor points edited — the insert into `spec_folder_authoring_checklist.md` §2 applied cleanly and is additive-only, so risk is low, but it wasn't re-verified against every other section the way the higher-stakes files were.
2. **Behavioral-model expansion, not just a wording tweak.** Phase parents can now grow indefinitely (a new related workstream = a new child phase, added any time) rather than only decomposing once at creation. `phase_definitions.md`'s new "Extending an Existing Phase Parent" section documents this explicitly, but it's a real shift in what a phase parent is for — watch for parents that stay open for months accumulating unrelated-adjacent children; the "scope match against the parent's documented purpose" guardrail is interpretive, not mechanical.
3. **No automated test suite ran.** `npx vitest` wasn't available in this environment (`vitest: command not found`); verification instead relied on a targeted grep sweep (zero code references to the exact strings that changed) plus the untouched `gate-3-classifier.ts` diff being empty. Sufficient for prose-only doc edits with no code dependents, but a full `npm run test` pass would be stronger evidence if the maintainer wants to run it separately.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->

