---
title: "Implementation Summary: Pi docs, agents, governance, and closeout"
description: "cli-pi added to every roster/governance/hub-doc surface where a majority of its siblings already appeared, with an opportunistic cli-devin backfill since the hub's own registry files already fully documented devin; a pre-existing leaf-manifest.json byte-drift was fixed via mechanical regeneration; whole-packet validate.sh --recursive --strict and parent-skill-check.cjs both clean, GLM-5.2 APPROVEd the diff."
trigger_phrases:
  - "cli-pi closeout summary"
  - "pi governance docs summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/031-cli-pi-creation/011-docs-agents-governance-and-closeout"
    last_updated_at: "2026-07-27T13:59:00Z"
    last_updated_by: "claude-code"
    recent_action: "Implemented via LUNA, reviewed by GLM-5.2 APPROVE, leaf-manifest fixed, validate clean"
    next_safe_action: "None -- terminal phase; commit and report the packet as closed"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cli-pi-creation-authoring"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: ["Devin backfill: opportunistic, since the hub's own SKILL.md/mode-registry.json/hub-router.json were already fully 6-of-6 at implementation time.", "pi IS a real (if currently stubbed) dispatch-model.cjs case, added by phase 009 -- deep-improvement.md's Lane-B paragraph now says so honestly.", "Hub README.md version left unbumped, matching the no-bump precedent set by the cursor/devin additions."]
---
# Implementation Summary: Pi docs, agents, governance, and closeout

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 011-docs-agents-governance-and-closeout |
| **Completed** | 2026-07-27 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This is the terminal phase of the `031-cli-pi-creation` packet. It added `cli-pi` to every roster/governance/hub-doc surface where a majority of its 5 siblings (`cli-opencode`, `cli-claude-code`, `cli-codex`, `cli-cursor`, `cli-devin`) already appeared, resolved the packet's own open questions with real evidence instead of the planning pass's assumptions, and ran the packet-wide terminal validation.

### The tree had already moved since planning

A fresh `rg` sweep at implementation time (not a replay of the planning-time snapshot) found the tree in a different state than `spec.md` assumed: the hub's own `SKILL.md`, `mode-registry.json`, and `hub-router.json` were **already fully 6-of-6** (including `cli-devin`, at full field parity) — only the hub's own `README.md` and two repo-wide catalog rows (root `README.md`, `.opencode/skills/README.md`) were still stale at 4-of-6 or 2-of-6. This changed the devin-backfill decision from a genuine open question into a straightforward accuracy fix: since devin already exists and is fully wired elsewhere in the same hub, adding it to these already-open, already-stale surfaces alongside pi is not new scope.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/cli-external-orchestration/README.md` | Modified | Hub's own README: frontmatter description/trigger_phrases, "four"→"six" mode-count tagline, AT A GLANCE table, OVERVIEW bullets (+2 new: cli-devin, cli-pi) and routing-policy sentence, QUICK START (+2 new examples). Version field left at `1.1.0.0` (no-bump precedent). |
| `README.md` (repo root) | Modified | CROSS-AI CLI section: hub-summary bullet + 2 new bullets (cli-devin, cli-pi); `prompt-models` sentence updated to note deepseek-v4-pro/minimax-m3/mimo-v2.5-pro are also reachable via `cli-pi`; skills-catalog table row updated to list all 6 modes. |
| `.opencode/skills/README.md` | Modified | `cli-external-orchestration` catalog row updated to list all 6 modes. |
| `.opencode/agents/deep-improvement.md`, `.claude/agents/deep-improvement.md` | Modified | Lane-B lane-awareness paragraph now names `pi` as a benchmarkable dispatch executor, with an honest "(currently stubbed pending confirmation of Pi's headless invocation syntax)" qualifier. |
| `.opencode/skills/cli-external-orchestration/leaf-manifest.json` | Modified | Regenerated via the hub's own `generate-leaf-manifest.cjs --write` (mechanical, not a hand-edit) to add the `cli-pi/references/model-dispatch-gpt-5.6.md` entry phase 009 introduced but never regenerated the manifest for. |
| `spec.md`, `tasks.md`, `checklist.md` | Modified | Open questions resolved with real evidence; all tasks/checklist items marked `[x]` with evidence; status set to Complete. |
| `implementation-summary.md` | Created | This document. |

No other files were touched. The 2 explicit regression-guard surfaces (`advisor-runtime-values.ts`, `post-implementation-deep-review.md`) and the registry files owned by phase 003 (`mode-registry.json`, `hub-router.json`, hub `SKILL.md`, `leaf-manifest.json`'s structure) show a clean `git diff` except for the one legitimate `leaf-manifest.json` regeneration described above.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The doc/roster edits were dispatched to **GPT-5.6-LUNA** (`codex exec --model gpt-5.6-luna -c model_reasoning_effort="xhigh" -c service_tier="fast" --sandbox workspace-write`) with a fully-grounded brief naming every exact file, section, and decided open question, and instructing LUNA to verify the two live facts (the `hub-router.json` `tieBreak` order and the `sk-prompt/prompt-models` model list) against the real files rather than trust the brief's summary verbatim. The first dispatch attempt halted on a Gate-3 documentation-scope question (a known GPT-family behavior in non-interactive `codex exec` sessions); the retry included an explicit "GATE-3 PRE-RESOLVED, do not ask" instruction and completed cleanly.

The resulting diff (5 files) was independently re-verified: `git status --porcelain` confirmed exactly the 5 intended files changed, `git diff --stat` on all 6 named regression-guard/registry surfaces showed zero drift, and both cross-check test files (`executor-config.vitest.ts`, `executor-audit.vitest.ts`) were manually re-read to confirm `cli-pi` is already asserted, not stale.

Running `parent-skill-check.cjs` surfaced one real, pre-existing gap unrelated to LUNA's diff: `leaf-manifest.json` was stale (`10b-byte-drift`) because phase 009 added a new reference file without regenerating the manifest. This was fixed by running the hub's own generator script with `--write` — a mechanical regeneration, not a hand-edit — and re-confirmed clean.

The full diff (post leaf-manifest fix) was then dispatched to **GLM-5.2** (`devin -p --model glm-5.2 -- "<review>"`) for an independent review. Two real, non-obvious `devin` CLI facts surfaced during this dispatch and are worth recording: (1) a long multi-line prompt passed as a single positional argument to `devin -p` is misparsed as an unrecognized flag unless preceded by `--` (`devin -p --model <model> -- "<prompt>"`), confirming the "flag-like token" gotcha documented in `cli-devin/SKILL.md` applies more broadly than just prompts starting with `-`; (2) the live-valid model short name is the **versioned slug `glm-5.2`**, not the bare `glm` this packet's own goal directive had assumed — `devin`'s own error output enumerates the full valid model list. GLM-5.2's review independently re-verified every load-bearing claim against the real repo (the `dispatch-model.cjs` switch case, the `leaf-manifest.json` alphabetical ordering, the `_index.md` model list, the untouched "four" mentions elsewhere in root `README.md`) and returned **APPROVE**, no blocking findings, two minor observations both judged already-sufficient as written.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Opportunistic `cli-devin` backfill alongside `cli-pi`, applied to all 4 stale surfaces | The hub's own `SKILL.md`/`mode-registry.json`/`hub-router.json` were confirmed live to already be fully 6-of-6 (devin included) — leaving the hub's own `README.md` and 2 catalog rows stale would be an internal inconsistency within already-shipped facts, not a new capability claim. Devin already exists and is fully wired elsewhere in the same hub. |
| Add `pi` to `deep-improvement.md`'s Lane-B benchmarkable-executor list, with a stubbed-pending qualifier | `dispatch-model.cjs`'s `KNOWN_EXECUTORS`/switch statement already has a real `cli-pi` case (added by phase 009) that throws until Pi's headless invocation syntax is confirmed — registered, not fabricated. Omitting it would understate the real state; claiming it works unqualified would overclaim. The parenthetical grounds the claim precisely; GLM-5.2 independently confirmed this judgment. |
| Leave the hub's own `README.md` `version:` field unbumped | Neither the prior `cli-cursor` nor `cli-devin` addition bumped this file's version when registered — this phase follows the same established precedent rather than inventing a new version-bump policy. |
| Fix the `leaf-manifest.json` byte-drift via mechanical regeneration rather than leaving it, even though `leaf-manifest.json` itself is nominally phase 003's file | REQ-006 (`parent-skill-check.cjs` exits 0) is this closeout phase's own explicit P0 requirement; the drift was a real, blocking failure discovered while running this phase's own terminal validation step, and the fix is a deterministic script run (no hand-editing of registry content), not new judgment-laden scope. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `git status --porcelain` scoped to the intended 5 doc files | PASS — exactly `.opencode/skills/cli-external-orchestration/README.md`, `README.md`, `.opencode/skills/README.md`, `.opencode/agents/deep-improvement.md`, `.claude/agents/deep-improvement.md` changed |
| `git diff` on the 2 regression-guard surfaces + registry files (`mode-registry.json`, `hub-router.json`, hub `SKILL.md`) | PASS — empty |
| `executor-config.vitest.ts` / `executor-audit.vitest.ts` manual cross-check | PASS — both already assert `cli-pi`'s presence, no stale union |
| `node .opencode/commands/doctor/scripts/parent-skill-check.cjs .opencode/skills/cli-external-orchestration` | Initial run: FAIL on `10b-byte-drift` (stale `leaf-manifest.json`). After `generate-leaf-manifest.cjs --write`: "OK: parent-skill-check — all hard invariants passed, 0 warnings" |
| GLM-5.2 independent review | Verdict: **APPROVE** — no blocking findings; both minor observations judged already-sufficient |
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/cli-external-orchestration/031-cli-pi-creation --recursive --strict` | Run via the main-tree metadata round-trip pattern (worktree lacks the toolchain); result recorded in the commit — `Errors: 0` across the phase-parent and all 11 phase children |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Pi's headless dispatch is still unconfirmed.** `deep-improvement.md`'s new `pi` mention is honest about this (a real, currently-throwing switch case), but no live `pi` dispatch has been run in this packet — that remains gated on the same provider-credential blocker phase 001 first surfaced.
2. **The pre-existing `codex`/`devin` gap in `dispatch-model.cjs`'s `KNOWN_EXECUTORS`** (no real case for either, despite `deep-improvement.md`'s prose already naming "codex" as benchmarkable) was left untouched, per this phase's own scope boundary — it belongs to phase 002/009, not this docs phase. GLM-5.2's review confirmed this diff did not worsen that pre-existing inaccuracy.
3. **The hub `README.md`/`hub-router.json` version-number drift** (README.md at 1.1.0.0, `hub-router.json`'s own top-level version also at 1.1.0.0, `SKILL.md`/`mode-registry.json` at 1.2.0.0) was left as found — cross-referenced to phase 003's registration decisions rather than resolved here, per this phase's own scope.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
HVR rules: .opencode/skills/sk-doc/references/hvr-rules.md
-->
