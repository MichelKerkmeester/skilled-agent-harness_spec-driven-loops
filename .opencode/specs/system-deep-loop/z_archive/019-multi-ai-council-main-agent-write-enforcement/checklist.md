---
title: "Verification Checklist: Multi-AI Council main-agent write enforcement [system-deep-loop/z_archive/019-multi-ai-council-main-agent-write-enforcement/checklist]"
description: "Per-requirement verification gates with evidence slots. Run before claiming completion."
trigger_phrases:
  - "100 checklist"
  - "council main agent enforcement checklist"
importance_tier: "normal"
contextType: "verification"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/019-multi-ai-council-main-agent-write-enforcement"
    last_updated_at: "2026-05-09T17:50:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored verification checklist"
    next_safe_action: "Dispatch implementation; fill evidence as items pass"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "council-main-agent-enforcement-2026-05-09"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->

# Verification Checklist: Multi-AI Council main-agent write enforcement

<!-- SPECKIT_LEVEL: 2 -->

<!-- ANCHOR:protocol -->
## VERIFICATION PROTOCOL

Mark each item `[x]` only after running the named verification command and recording evidence inline (file:line, command output excerpt, or sandbox log). Do not pre-fill. Each item has a `[P0]`, `[P1]`, or `[P2]` priority tag for the validator.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## PRE-IMPLEMENTATION

- [ ] [P0] Predecessor packet 098 confirmed shipped: `permission.write: allow` and `permission.edit: allow` set in all 4 runtime mirrors of `multi-ai-council`. Evidence: `grep -A2 'permission:' .opencode/agents/multi-ai-council.md`.
- [ ] [P0] `lib/persist-artifacts.js` exists with all 7 named exports. Evidence: `grep -E 'export (async )?function (write[A-Z])' .opencode/skills/system-spec-kit/scripts/multi-ai-council/lib/persist-artifacts.js`.
- [ ] [P0] 4-runtime parity test from packet 098 currently passes against unmodified main. Evidence: test command + exit code.
<!-- /ANCHOR:pre-impl -->

## P0 — Blocker Requirements

### REQ-001: Step 0 RESOLVE present in §1 across 4 mirrors

- [ ] [P0] `.opencode/agents/multi-ai-council.md` §1 includes a "Step 0. RESOLVE" entry before "Step 1. RECEIVE". Evidence: `grep -n "0\\. RESOLVE" .opencode/agents/multi-ai-council.md`.
- [ ] [P0] `.claude/agents/multi-ai-council.md` §1 carries the same step.
- [ ] [P0] `.gemini/agents/multi-ai-council.md` §1 carries the same step.
- [ ] [P0] `.codex/agents/multi-ai-council.toml` carries the same step in the equivalent TOML body key.
- [ ] [P0] The step body lists all 4 resolution stages: prompt → continuity → cwd ancestor → HALT-and-ASK.

### REQ-002: §7 ALWAYS contains the hard write-or-fail rule

- [ ] [P0] `.opencode/agents/multi-ai-council.md` §7 ALWAYS includes a bullet that names "Persist `ai-council/**` artifacts" + "BEFORE claiming completion" + the minimum required artifact set.
- [ ] [P0] §7 NEVER includes the mirrored constraint ("Deliver a council report without persisting…").
- [ ] [P0] All 3 markdown mirrors carry the same bullets.
- [ ] [P0] `.codex/agents/multi-ai-council.toml` carries the same bullets in the equivalent body key.

### REQ-003: §9 PERSISTENCE VERIFICATION block + SELF-CHECK Q11

- [ ] [P0] §9 contains a new MANDATORY block titled "PERSISTENCE VERIFICATION" with 9 checklist items.
- [ ] [P0] §9 SELF-CHECK section has 11 questions (was 10).
- [ ] [P0] The "DO NOT CLAIM COMPLETION" failure handler trailer references the new Q11.
- [ ] [P0] All 4 mirrors carry the additions.

### REQ-004: §12 OUTPUT PROTOCOL is unconditional

- [ ] [P0] §12 no longer contains "When invoked with a `spec_folder`". Evidence: `grep -n "When invoked with a" .opencode/agents/multi-ai-council.md` returns no §12 hits.
- [ ] [P0] §12 cites the new §1 Step 0 RESOLVE as the source of the packet path.
- [ ] [P0] All 4 mirrors carry the same updated §12 opening.

### REQ-005: §13 INVOCATION CONTRACT first-call sequence is numbered with writer-function calls

- [ ] [P0] §13 first-call paragraph is replaced with a numbered checklist (or numbered list) referencing: `writeConfig` → `writeStrategyMd` → `writeStateJsonl(round_start)` → dispatch seats → `writeSeat` → `writeStateJsonl(seat_returned)` → `writeDeliberation` → `writeStateJsonl(deliberation_synthesized + round_end)` → convergence check → `writeReport` → `writeStateJsonl(council_complete)`.
- [ ] [P0] Each persistence step explicitly notes that an `artifact_written` event MUST be emitted.
- [ ] [P0] All 4 mirrors carry the same updated §13.

### REQ-006: 4-runtime body parity holds

- [ ] [P0] Existing 4-runtime parity test from packet 098 passes after all body changes. Evidence: command + exit code.
- [ ] [P0] If the parity test only covered frontmatter pre-100, it has been extended to also cover §1, §7, §9, §12, §13 body equivalence. Evidence: test file diff.

## P1 — Required

### REQ-007: folder-layout.md adds the persistence-mandatory note

- [ ] [P1] `.opencode/skills/system-spec-kit/references/multi-ai-council/folder-layout.md` carries a new §0 paragraph that states persistence is mandatory and cites the agent's §1 Step 0 RESOLVE.

### REQ-008: state-format.md adds the council_complete-required note

- [ ] [P1] `.opencode/skills/system-spec-kit/references/multi-ai-council/state-format.md` carries a new paragraph stating that runs without `council_complete` are incomplete and the agent has violated §9 OUTPUT VERIFICATION.

### REQ-009: HALT-and-ASK fallback wording is clear

- [ ] [P1] The §1 Step 0 sub-step 4 wording explicitly tells the agent to emit a single user-facing question that lists the resolution candidates it tried, AND to skip seat dispatch entirely.
- [ ] [P1] The wording does NOT include any chat-form Council Report content when the HALT-and-ASK branch fires.

### REQ-010: Sandbox smoke verification

- [ ] [P1] **Smoke A** (no-packet invocation): dispatch the council against a small planning question in opencode main-agent slot WITHOUT naming a spec folder. Result: agent HALTs and asks for a packet. No `ai-council/` folder created anywhere. Evidence: chat transcript excerpt + `find -name 'ai-council' -newer <smoke-start>` returns empty.
- [ ] [P1] **Smoke B** (packet-named invocation): re-dispatch naming this packet (`skilled-agent-orchestration/100-multi-ai-council-main-agent-write-enforcement`) as the spec folder. Result: canonical artifact set materializes. Evidence: `ls <packet>/ai-council/` shows config + strategy + state + seats/ + deliberations/ + council-report.md; `tail -1 <packet>/ai-council/ai-council-state.jsonl` shows `council_complete` event.

## P2 — Refinement

### REQ-011 (optional): §9 verification example uses SELF-CHECK as report preface

- [ ] [P2] If implemented, §9 contains an example showing the 11-question self-check output as the first paragraph of the chat report.

### REQ-012 (conditional): Council changelog updated

- [ ] [P2] If `.opencode/skills/system-spec-kit/multi-ai-council-changelog.md` exists, it has a v1.3 entry summarizing the enforcement deltas. If the changelog file does not exist, this item is N/A.

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] [P1] No new lint or formatting errors introduced in any of the 4 agent files or 2 reference docs. Evidence: `git diff --check`.
- [ ] [P1] Body changes are confined to §1, §7, §9, §12, §13 in agent files and the targeted paragraphs in reference docs. Evidence: section-aware diff or hand audit.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] [P0] Sandbox Smoke A executed and recorded (per REQ-010 above).
- [ ] [P0] Sandbox Smoke B executed and recorded (per REQ-010 above).
- [ ] [P0] 4-runtime parity test re-run after all changes; passes (per REQ-006 above).
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] [P0] Original failure mode ("council ran but no artifacts on disk in opencode main-agent dispatch") cannot be reproduced after changes ship. Evidence: Smoke B transcript.
- [ ] [P0] All 4 runtime mirrors flipped together (no partial propagation). Evidence: parity test pass.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] [P0] Path-scope enforcement from packet 098 still holds: council writes outside `ai-council/**` are still rejected with `OUT_OF_SCOPE_WRITE`. Evidence: existing 098 path-scope test still passes.
- [ ] [P0] No new bash, patch, or external-write capability introduced.
- [ ] [P1] HALT-and-ASK branch never writes outside `ai-council/` (it doesn't write at all).
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] [P1] `folder-layout.md` updated per REQ-007.
- [ ] [P1] `state-format.md` updated per REQ-008.
- [ ] [P2] Council changelog entry added (REQ-012) if changelog file exists; N/A otherwise.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] [P1] No new files created outside this packet's spec folder and the documented agent + reference doc paths.
- [ ] [P1] `description.json` and `graph-metadata.json` refreshed via `/memory:save` after final commit. POST-SAVE QUALITY REVIEW shows no HIGH issues.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

- [ ] [P0] `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/100-multi-ai-council-main-agent-write-enforcement --strict` exits 0. Evidence: command + stdout last 5 lines.
- [ ] [P0] `implementation-summary.md` is filled (no `[###-feature-name]` or `[YYYY-MM-DD]` placeholders). Continuity `completion_pct: 100`.
- [ ] [P0] Git working tree clean of unintended edits. `git diff --stat` reports only the planned file paths.
- [ ] [P0] All P0 items in this checklist marked `[x]` with evidence.
<!-- /ANCHOR:summary -->
