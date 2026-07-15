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
    packet_pointer: "system-speckit/007-phased-spec-preference"
    last_updated_at: "2026-07-11T15:51:28.214Z"
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
| **Spec Folder** | 007-phased-spec-preference |
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
| `.opencode/commands/create/assets/create_{agent,command,flowchart}_{confirm,auto}.yaml` (6 files) | Modified | `memory_loaded`→`memory_choice` input rename + new `context_loading` block + dead activity-line fix |
| `.opencode/commands/create/assets/create_{benchmark,feature_catalog,manual_testing_playbook,skill,skill_parent}_{confirm,auto}.yaml` (10 files) | Modified | New `context_loading` block + dead activity-line fix (field was already named `memory_choice`) |
| `.opencode/commands/create/assets/create_{benchmark,feature_catalog,skill,skill_parent}_presentation.txt` (4 files) | Modified | Standardized "spec-doc record" wording to canonical "handover / canonical spec docs / skip" wording |
| `.opencode/commands/doctor/assets/doctor_{code-graph,skill-advisor}.yaml` | Modified | Real excludes-review, skill-filter, and verification-skip behavior (Round 10) |
| `.opencode/commands/create/assets/create_changelog_{confirm,auto,presentation}` (3 files) | Modified | Real git-tag + gh-release automation behind an explicit checkpoint/flag gate; fixed reversed exec-mode lettering (Round 10) |
| `.opencode/commands/create/assets/create_readme_{confirm,auto}.yaml` | Modified | Real install-guide Overwrite/Merge/Cancel conflict handler (Round 10) |
| `.opencode/commands/create/assets/create_{feature_catalog,manual_testing_playbook,skill_parent}_{confirm,auto}.yaml` (6 files) | Modified | Ported `create_agent`'s working spec-folder wiring pattern (Round 10) |
| `.opencode/commands/create/assets/create_skill_{confirm,auto}.yaml` | Modified | Deleted stale dead-code letter-check clause (Round 10) |
| `.opencode/commands/design/assets/design_{audit,foundations,interface,md-generator,motion}_{confirm,presentation}` (10 files) | Modified | Removed dead exec-mode question + fabricated ADR-002 citation (Round 10) |
| `.opencode/commands/memory/{README.txt,assets/manage_presentation.txt,assets/save_presentation.txt}` | Modified | 3 missing dashboards + subcommand row + exit-label standardization (Round 10) |
| `.opencode/commands/deep/assets/deep_review_presentation.txt`, `.opencode/commands/prompt-improve.md` | Modified | Cosmetic wording/reference corrections (Round 10) |
| `.opencode/commands/speckit/assets/speckit_{complete,plan}_presentation.txt` | Modified | Reply-format ambiguity + Q8 self-contradiction fixes (Round 10) |

### Round 4: Skip-Last Reorder (operator follow-up)

Operator feedback: "Skip" should always sort last among a command's option letters, not sit ahead of a real processing choice. Audited every "Skip" occurrence across `.opencode/skills/` and `.opencode/commands/` (~35 hits) and classified each: most were already last in their list (memory-save skip, validation skip, skill-approval skip, resume-vs-fresh skip, etc.) and were left untouched. Two genuine patterns needed reordering:

1. **The Gate-3 "Spec Folder A-E" list** (`D) Skip, E) Phase folder` → `D) Extend phased packet, E) Skip`) — found duplicated in 10 places beyond the framework docs already touched in Round 3: the live spec-gate hook source (`runtime/lib/spec-gate/spec-gate-core.mjs` — the actual runtime string behind every "SPEC FOLDER QUESTION" message this session), and 9 command asset files across `/speckit:plan`, `/speckit:implement`, `/speckit:complete`, `/create:skill`, `/create:feature-catalog`, `/create:skill-parent`, `/create:manual-testing-playbook` that duplicate the same list independently of AGENTS.md.
2. **The "Session Goal" list** (`B) Skip, C) Set goal: <objective>` → `B) Set goal: <objective>, C) Skip`) — found in 4 speckit presentation files (`resume`, `implement`, `complete`, `plan`).

Deliberately left alone: `doctor_update_presentation.txt`'s `2) Skip` before `X) Cancel`, and `doctor_skill-advisor.yaml`'s `C) Skip verification` before `D) Rollback all changes` — treated `Cancel`/`Rollback` as abort/escape actions in a different category from a peer processing choice, not something Skip needs to precede. The `manual_testing_playbook/plugins-and-hooks/spec-mutation-gate-enforce.md` fixture still shows the old captured hook output (an honest historical transcript, not a living spec) — now stale relative to the source fix; flagged for the operator to refresh by re-running that playbook rather than hand-edited to avoid fabricating a "captured" result that wasn't re-executed.

### Round 5: speckit presentation-asset re-sweep (operator follow-up)

Operator flagged not to forget speckit's own presentation assets. Re-audited every `.txt`/`.yaml` under `.opencode/commands/speckit/assets/` and `.opencode/commands/create/assets/` against both patterns — all 4 speckit presentation files (`complete`, `plan`, `implement`, `resume`) and the confirm/auto yaml pair now carry the fixed wording, and no `create:*` asset was missed. This pass also relettered a pre-existing bug flagged (but left alone) in Round 4: `speckit_resume_presentation.txt`'s Q0 line jumped straight from `C)` to `E)` with no `D)`.

### Round 6: Removed a non-functional Q0 option (operator follow-up)

Operator questioned whether Round 5's `D) Phase folder` reletter was actually meaningful, or should sit before `C) Cancel`. Traced the real mechanics in `speckit_resume_confirm.yaml`: phase-folder handling in `/speckit:resume` is a fully automatic downstream step (`phase_folder_detection`, triggered after the spec folder is already resolved — reads `graph-metadata.json`'s `derived.last_active_child_id` pointer to auto-redirect, or falls back to listing children for the user to pick from). It is not a Q0 branch; no `on_D`-style handling exists anywhere for it. `D) Phase folder` was never a real selectable choice, so the right fix isn't reordering it relative to Cancel — it's removing it. Q0 is now `A) List and select  B) Start new with /speckit:complete  C) Cancel`, a clean 3-option list with Cancel already last.

### Round 7: 6-lane command-asset audit (operator follow-up)

Operator asked to have GPT-5.6-luna-fast (xhigh) double-check every OTHER command family for the same class of defect, spawning >=5 parallel dispatches. The GPT dispatch stalled after ~48 minutes with zero output across all 6 lanes (provider-side contention from 6 concurrent xhigh requests on one API key, not a true hang — confirmed alive via low but non-zero CPU) and was killed cleanly with no side effects. Operator redirected to a 6-lane Claude Sonnet 5 subagent swarm covering `/create`, `/deep`, `/design`, `/doctor`, `/memory` + standalone commands (`agent_router.md`, `goal_opencode.md`, `prompt-improve.md`), and an independent re-check of `/speckit`. All 6 completed with real findings: 27 total across the six lanes, spanning genuinely orphaned options (a lettered choice with zero handler anywhere), a systemic 16-file pattern (`memory_choice`/`memory_loaded` "Prior Session Context" asked in 8 `/create:*` families, never once branched on), and assorted stale cross-references. One finding was a regression from this packet's own Round 4 work: the D/E relabel swapped which letter means "Extend phased packet" vs "Skip" in the presentation text, but 4 internal `phase_folder_awareness.note` cross-references in the matching workflow YAML still said "Option E" — independently verified via grep + git log (those YAML lines weren't touched this session, so the note went stale the moment the sibling presentation.txt was edited). Full findings published as an artifact and archived at `scratch/luna-audit/report.html`; raw dispatch prompts also archived in the same folder. Nothing was applied in this round — pure discovery, pending operator review.

### Round 8: Applied the confirmed-regression fixes only (operator follow-up)

Operator approved applying just the 2 confirmed, zero-decision-needed fixes from Round 7, leaving the other 25 findings (all of which need an implement-vs-remove call) for a separate follow-on. Fixed: `speckit_plan_confirm.yaml:110`, `speckit_plan_auto.yaml:110`, `speckit_complete_confirm.yaml:137`, `speckit_complete_auto.yaml:164` — "Option E is selected" → "Option D is selected" (matches the current presentation text where D is now Extend-phased-packet). Also `speckit_implement_confirm.yaml:66` and `speckit_implement_auto.yaml:66` — dropped the "When Option E is selected or" clause entirely, since implement's own Q1 (`A) Yes, implement  B) Different folder  C) Cancel and plan first`) never had a D or E option; this was a fully vestigial copy-paste from the plan/complete template, pre-existing and unrelated to Round 4. All 6 files re-verified: YAML parses clean, zero remaining "Option E is selected" anywhere in `.opencode/commands/`.

### Round 9: Fixed the memory_choice/memory_loaded gap across all 8 /create:* families (operator follow-up)

The largest of Round 7's 25 open findings: every `/create:*` command family (`agent`, `command`, `flowchart`, `benchmark`, `feature_catalog`, `manual_testing_playbook`, `skill`, `skill_parent`) asks a "Prior Session/Work Context" question during setup, declares an input field for the raw A/B/C reply, and has a throwaway activity line referencing it — but nothing anywhere branches on the answer. Before implementing, dispatched a fresh Fable-model agent to independently verify this was a real gap rather than intentional free-text guidance for the executing AI; it confirmed via four proofs (the repo's own YAML-behavior/presentation-wording split rule, comparable fields like `spec_choice` that ARE properly branched in the same files, sibling `/speckit:complete` and `/speckit:resume` commands that already have a working `context_loading` block for the identical kind of question, and `:auto` mode never even displaying the option label yet still carrying the dead field) and additionally found the wording itself had silently drifted three ways and the field name (`memory_choice` vs `memory_loaded`) didn't align with the wording split — evidence of accretion, not design.

Implemented via an 8-way parallel Sonnet-5 xhigh swarm (one agent per family, each owning its own confirm/auto YAML pair plus, where needed, its presentation.txt), followed by an independent Sonnet-5 xhigh verification agent. First launch failed cleanly before any edits (a stray `process.cwd` Node-API reference in the orchestrating script — unavailable in the workflow sandbox — crashed all 8 implement agents at the prompt-build step); fixed and re-run cleanly. Each family got a real `context_loading:` block modeled on the `speckit_complete_confirm.yaml`/`speckit_resume_confirm.yaml` precedent (`mcp_integration.tool: memory_context`, resume/resume mode+profile, daemon-CLI transport fallback), the raw input field unified to `memory_choice` everywhere (renamed from `memory_loaded` in `agent`/`command`/`flowchart`, already correct in the other 5), a new `memory_loaded` output produced by the block, and the dead activity line rewritten to actually reference block execution. The 4 families that still had stale "spec-doc record" wording (`benchmark`, `feature_catalog`, `skill`, `skill_parent`) had their presentation.txt option text standardized to the same "handover / canonical spec docs / skip" wording already used by `agent`/`command`/`manual_testing_playbook`; `flowchart` was deliberately left with its own distinct wording (diagram source material, not spec continuity) per Fable's explicit exception, with its `context_loading` block built around that family's own semantics instead of the generic handover ladder.

### Round 10: Closed out the rest of Round 7's 24 open findings (operator: "Fix all findings")

The operator asked to fix everything remaining. 8 of the 24 were flagged in the report as needing an explicit build-vs-remove call (real product-behavior implications, not mechanical fixes) — asked once, consolidated into 4 questions per this repo's own Consolidated Question Protocol rather than 8 separate asks. Operator chose: build real behavior for doctor's 3 dead options, build real git-tag+GitHub-release automation for `create:changelog`, build a real install-guide conflict handler for `create:readme`, and remove the fabricated-ADR-citation exec-mode question from all 5 `design:*` commands. The remaining 16 findings were clear mechanical fixes (dead-code deletion, wiring an already-working precedent into 3 more families, or wording/reference corrections) needing no decision.

Dispatched a 9-lane Sonnet-5 swarm (Agent tool, not Workflow — no explicit swarm/workflow keyword this turn, so stayed with the ungated tool rather than assuming standing opt-in from an earlier turn), each lane owning a disjoint file set:

1. **doctor (build)** — `doctor_code-graph.yaml` gained a real "excludes" scope branch (traced the actual exclude-config sources in `system-code-graph`'s TypeScript: `index-scope.ts`, `index-scope-policy.ts`, `exclude-rule-confidence.json`) that flags stale zero-match and overly-broad patterns; `doctor_skill-advisor.yaml` gained real skill-name filtering (pre_phase_2 option B) and a real, explicitly-unsafe verification skip (pre_phase_4 option C, with a "NOT VERIFIED" warning banner replacing the silent no-op).
2. **create:changelog (build)** — the "Publish Release?" question now runs real `git tag` + `git push` + `gh release create`, gated behind an explicit Step 7 checkpoint that shows the literal tag name and exact commands before anything executes (confirm mode) and an explicit `--release` flag / PRE-BOUND marker with `default: false` (auto mode) — never a silent default in either mode. Includes tag-collision detection, `gh auth status` verification, working-tree-dirty warning, and H1-stripping for release notes. Also fixed the reversed A/B execution-mode lettering (changelog was the one `/create:*` outlier).
3. **create:readme (build)** — a real `error_recovery.install_guide_exists` handler for the previously-dead Overwrite/Merge/Cancel question, with Merge grounded in the actual numbered-section structure of a real install guide in the repo (`.opencode/install_guides/MCP - Code Mode.md`), not an invented format.
4. **create: 3-family spec-folder wiring** — ported `create_agent`'s working `spec_choice` → `spec_path` → doc-creation pattern into `feature_catalog`, `manual_testing_playbook`, and `skill_parent` (6 files, 396 insertions/0 deletions) — these three previously declared `spec.md`/`plan.md`/`tasks.md`/`checklist.md` as required output and then never wrote them.
5. **create:skill dead-code cleanup** — deleted the stale `spec_choice is not D` clause from 2 files; verified it was actually excluding the valid "Extend phased packet" case from context-save, a bug on top of being dead weight.
6. **design: removed the exec-mode question** from all 5 `design:*` confirm.yaml + presentation.txt pairs (10 files) — confirmed via repo-wide grep that the cited "ADR-002" never existed anywhere. All 5 confirmed independently (not assumed identical); none needed relettering (question was trailing in every family).
7. **memory: 3 missing dashboards** — added confirmation+result dashboard blocks for `learned-expire`/`learned-clear`/`ledger-sweep` to `manage_presentation.txt`, grounded in the real handler code (`memory-learned-maintenance.ts`, 7 real ledger-sweep tables cross-checked against their own test file), plus the missing `retention-sweep` row in the subcommand table; standardized the save-vs-manage trigger-edit exit label to `[b] back` (3-file-internal precedent beat the 1-file outlier).
8. **misc cosmetic (3 unrelated files)** — `create_agent_confirm.yaml` header's stale ":auto unsupported" claim, `deep_review_presentation.txt`'s summary line listing 2 options that don't exist in the real gates (corrected to the 3 that do), `prompt-improve.md`'s reply-format example token-count-off-by-one.
9. **speckit wording** — fixed the Q0-dropped/delimiter-collision reply-format example and the Q8 "required" vs. Auto-Resolution-Table "not required" self-contradiction in `speckit_complete_presentation.txt`/`speckit_plan_presentation.txt`.

Independently re-verified before committing (not just trusting the 9 self-reports): ran a personal YAML-parse sweep across all 20 touched `.yaml` files (20/20 clean), read the changelog release-automation diff in full to confirm the confirm-mode checkpoint and auto-mode `default: false` gate are real and can't silently fire, and grepped the design assets directory for leftover "ADR-002"/"Execution mode" references (zero hits).
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
| Dispatched a Fable-model agent for the implement-vs-leave verdict on Round 7's `memory_choice` finding before touching any files | A behavior-changing addition across 16+ files needs a decisive, independently-grounded call, not a self-serving continuation of my own earlier audit |
| Used an 8-way Sonnet-5 xhigh swarm (Workflow tool) for the fix, one agent per command family | Operator explicitly requested a swarm; families are file-disjoint so no coordination risk, and the fix is mechanical/templated enough that per-family agents needed no cross-talk |
| Ran a 9th independent verification agent (read-only) after the swarm instead of trusting each family agent's self-report | `finding-is-a-hypothesis` — a subagent's own "PASS" is a claim, not a fact, until a separate pass checks it against the files |
| Asked a single consolidated question (4 sub-questions) before Round 10 instead of silently picking build-or-remove for all 8 "needs your call" findings | The report itself flagged these as requiring a product decision; several (git tag/GitHub release, install-guide file overwrite) are hard-to-reverse or externally-visible actions this repo's own safety framework requires confirming first |
| Used the Agent tool (not Workflow) for the Round 10 9-lane swarm | The operator's "fix all findings" carried no explicit swarm/workflow keyword this turn; Agent tool needs no opt-in and gives the same parallelism without assuming a standing opt-in from an earlier, different request |
| Personally re-verified the changelog release-automation diff line-by-line before committing, not just the subagent's self-report | Highest-stakes lane in this round (creates a real git tag + GitHub release) — confirmed the checkpoint and `default: false` gate are real, not just claimed |
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
| `context_loading` fix: all 16 YAML files parse | PASS - `python3 -c "import yaml..."` clean on every file, confirmed by both the implementing agents and the independent verify agent |
| `context_loading` fix: field naming unified | PASS - exactly one `memory_choice` in `user_inputs`/`input_contract.optional` per file, zero leftover `memory_loaded`-as-input-field across all 16 |
| `context_loading` fix: dead activity line replaced | PASS - zero remaining inert "Confirm memory_loaded/memory_choice from UNIFIED SETUP PHASE (Q# if applicable)" lines with no `context_loading` reference nearby |
| `context_loading` fix: presentation wording standardized | PASS - `benchmark`/`feature_catalog`/`skill`/`skill_parent` presentation.txt Q-blocks now read the canonical "handover / canonical spec docs / skip" wording, zero remaining "spec-doc record" occurrences; `flowchart` deliberately left with its own distinct wording |
| `context_loading` fix: scope discipline | PASS - `git diff --stat` on `.opencode/commands/create/assets/` shows exactly 20 files changed (16 YAML + 4 presentation.txt), 335 insertions / 42 deletions, additive-only; no file outside that directory touched |
| Round 10: all 20 touched `.yaml` files parse (personal re-check, not just subagent self-report) | PASS - `python3 -c "import yaml..."` 20/20 clean, run directly by this session after the swarm completed |
| Round 10: changelog release automation can't silently fire | PASS - read the full diff; `field_handling.publish_release.default: false` in both confirm/auto, explicit Step 7 checkpoint shows literal tag+commands before executing in confirm mode, auto mode requires an explicit `--release` flag/marker with 3 documented pause_conditions (tag collision, missing gh auth, nested changelog_mode) |
| Round 10: design exec-mode removal left no dangling references | PASS - repo-wide `grep -rn "ADR-002\|Execution mode: Auto"` across `.opencode/commands/design/assets/` returns zero hits |
| Round 10: 3-family spec-folder wiring is additive-only | PASS - `git diff --stat` on the 6 touched files shows 396 insertions, 0 deletions |
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

