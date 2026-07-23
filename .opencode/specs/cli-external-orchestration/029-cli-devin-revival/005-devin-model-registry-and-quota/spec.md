---
title: "Feature Specification: Devin model registry and quota restoration"
description: "Restore the swe-1.6 model entry and cli-devin executor rows removed by the 2026-06-08 deprecation, recreate the swe-1.6.md model card, and re-add the CI gate script's cli-devin arrays, all grounded against current model identifiers rather than the archived docs' stale slugs."
trigger_phrases: ["devin model registry restoration", "swe-1.6 model card", "devin quota tiers", "cli-devin executor rows"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/029-cli-devin-revival/005-devin-model-registry-and-quota"
    last_updated_at: "2026-07-23T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored spec/plan/tasks/checklist for this Planned phase"
    next_safe_action: "Confirm phase 003 hub registration, then run tasks.md"
    blockers: ["Depends on phase 003 registering cli-devin in the shared hub graph-metadata.json"]
    key_files: ["sk-prompt/prompt-models/assets/model-profiles.json", "sk-prompt/prompt-models/references/models/swe-1.6.md", "system-skill-advisor/mcp-server/scripts/check-prompt-quality-card-sync.sh"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-devin-revival-authoring", parent_session_id: null }
    completion_pct: 0
    open_questions: ["SKILL.md model-executor table not updated - in scope?", "cli-codex CI-gate gap - fix now or defer?", "Permanent phantom-wording CI guard - add now or defer?", "swe-1.6 context_length/avg_iter_wall_clock_min unconfirmed"]
    answered_questions: ["Registry today: 6 models, swe-1.6 absent, all cli-opencode/cli-claude-code", "haiku shape (no recommended_frameworks) is the swe-1.6 precedent"]
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Feature Specification: Devin model registry and quota restoration

<!-- ANCHOR:metadata -->
## 1. METADATA
| Field | Value |
|---|---|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-23 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `cli-external-orchestration/029-cli-devin-revival` |
| **Predecessor** | `004-devin-hook-adapter-layer` |
| **Successor** | `006-devin-manual-testing-playbook` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 2026-06-08 deprecation deleted the `swe-1.6` model entirely from `model-profiles.json` (it was cli-devin-exclusive; no `cli-opencode` alternative existed) and stripped `cli-devin` executor rows from 3 sibling models. Restoring that registry state against the *archived* docs would reintroduce two stale model identifiers: the archived docs say `kimi-k2.6` and `glm-5.1`, but both have since been renamed/superseded by unrelated work (the current slugs are `kimi-k2.7-code` and `glm-5.2`). A mechanical replay of the archived diff would silently point the registry at models that no longer exist. The archived `swe-1.6.md` model card and the CI gate script's `cli-devin` array entries were also deleted outright and need recreating against the current sibling-card format and the current live script, not a byte-for-byte historical replay.

### Purpose
Restore `swe-1.6` and the 3 sibling `cli-devin` executor rows using current model identifiers, recreate `swe-1.6.md` as a proper model card, and restore the CI gate script's `cli-devin` coverage (including a newly-identified dependency the restored rows will exercise), so the model registry accurately reflects both current model names and the current CI gate's actual data structures.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add a new `swe-1.6` model entry to `model-profiles.json` with a valid `executors[]` shape (`cli-devin` / `cognition` / `cognition-free`), mirroring the `haiku` entry's non-`cli-opencode` shape (no `recommended_frameworks` key, so it stays exempt from the `_index.md` / CHECK 3 / CHECK 4 "adopted model" obligations).
- Add one new `cli-devin` executor row to each of `deepseek-v4-pro`, `kimi-k2.7-code` (current slug), and `glm-5.2` (current slug), leaving each model's existing `cli-opencode` executor row byte-for-byte unchanged.
- Recreate `references/models/swe-1.6.md` matching the sibling cards' frontmatter and section conventions, including the reliability notes from phase 001's sibling research and the sequential-thinking 2-layer pattern.
- Restore the `cli-devin` entry in `check-prompt-quality-card-sync.sh`'s `cli_cards[]` and `cli_skills[]` arrays (current 2-entry arrays become 3).
- Add a `"cli-devin": "cli-external-orchestration/graph-metadata.json"` entry to the same script's `CLI_EXECUTOR_HUB_METADATA` dict, so CHECK 4 resolves `cli-devin` through the shared hub identity instead of a nonexistent per-skill `graph-metadata.json` once the 3 sibling models carry `cli-devin` rows.
- Run a one-time grep of this phase's new prose for the phantom permission-mode wording bug ("auto, dangerous, or dangerous") before closeout.

### Out of Scope
- Registering `swe-1.6`/`cli-devin` in `sk-prompt/prompt-models/SKILL.md`'s own model-executor table, Keywords comment, or "in-scope model set" prose - not in the parent packet's declared Files to Change table for this phase; recorded as an Open Question.
- Fixing the pre-existing, orthogonal gap where `cli-codex` is absent from `cli_cards[]`, `cli_skills[]`, and `CLI_EXECUTOR_HUB_METADATA` despite having its own `prompt-quality-card.md` and despite the script's header comment claiming coverage of "4 cli-* executors" - this gap predates and is unrelated to the cli-devin revival.
- Adding an `references/models/_index.md` row or a `recommended_frameworks` key for `swe-1.6` - correctly excluded because `swe-1.6` dispatches only via `cli-devin`, never `cli-opencode`'s framework engine, mirroring `haiku`'s existing exemption.
- Any deep-loop executor-kind code (phase 002), skill-packet/hub registration (phase 003), hook adapters (phase 004), or the manual-testing playbook (phase 006).
- Adding a permanent, repo-wide CI guard for the phantom permission-mode wording bug - recommended as a phase 007 follow-up, not built here.
- Live-dispatching `swe-1.6` through `devin` to confirm behavior - owned by phase 006's manual-testing playbook.

### Files to Change
| File Path | Change Type | Description |
|---|---|---|
| `sk-prompt/prompt-models/assets/model-profiles.json` | Modify | Add the `swe-1.6` entry; add a `cli-devin` executor row to `deepseek-v4-pro`, `kimi-k2.7-code`, and `glm-5.2`. |
| `sk-prompt/prompt-models/references/models/swe-1.6.md` | Create | Recreate the deleted model card. |
| `system-skill-advisor/mcp-server/scripts/check-prompt-quality-card-sync.sh` | Modify | Restore `cli-devin` in `cli_cards[]` and `cli_skills[]`; add `cli-devin` to `CLI_EXECUTOR_HUB_METADATA`. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `swe-1.6` is restored in `model-profiles.json` with a valid `executors[]` shape (`cli-devin` / `cognition` / `cognition-free`, `status: active`), `free_tier: true`, `fallback_target: null`, and no `recommended_frameworks` key (mirrors `haiku`'s non-`cli-opencode` shape). | `python3 -c "import json; json.load(open('model-profiles.json'))"` parses cleanly and the `swe-1.6` object matches this shape. |
| REQ-002 | `deepseek-v4-pro`, `kimi-k2.7-code`, and `glm-5.2` each gain one added `cli-devin` executor row while their existing `cli-opencode` executor row stays byte-for-byte unchanged (regression guard). | A diff against the pre-edit file shows only additive `executors[]` entries; no existing `cli-opencode` row's `provider`/`quota_pool`/`status`/`notes` changed. |
| REQ-003 | `references/models/swe-1.6.md` is recreated matching the sibling cards' frontmatter and section conventions, including the reliability notes (fastest of the family's small-model roster, default 10-15 min timeouts sufficient, historic Free-tier survival during Pro-quota-exhaustion windows) with an explicit re-verification caveat against Devin's current Adaptive-router tier/quota model. | File exists; `model_id: "swe-1.6"` frontmatter present; the re-verification caveat is stated in prose, not asserted as current fact. |
| REQ-004 | `check-prompt-quality-card-sync.sh`'s `cli_cards[]` and `cli_skills[]` arrays each carry a `cli-devin` entry (current 2-entry arrays become 3), verified against the live file's current line numbers, not the stale archived ones. | Running the script shows CHECK 1 and CHECK 2 both enumerate a `cli-devin` row. |
| REQ-005 | `check-prompt-quality-card-sync.sh`'s `CLI_EXECUTOR_HUB_METADATA` dict gains a `"cli-devin": "cli-external-orchestration/graph-metadata.json"` entry, matching the existing `cli-opencode`/`cli-claude-code` rows, so CHECK 4 resolves `cli-devin` through the shared hub identity rather than a nonexistent per-skill `graph-metadata.json`. | CHECK 4 passes with 0 fails for `deepseek-v4-pro`/`kimi-k2.7-code`/`glm-5.2`'s new `cli-devin` rows. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | The sequential-thinking 2-layer pattern (one-time `devin mcp add sequential_thinking npx @modelcontextprotocol/server-sequential-thinking@2025.12.18` at user scope, plus a `system_instructions` mandate in the agent config) is the documented mechanism wherever this phase's docs describe Devin + sequential-thinking; a top-level `mcp_servers` recipe field is explicitly named as the wrong, previously-broken alternative. | `swe-1.6.md` (or its cross-referenced doc) states both layers and the banned-field warning in prose. |
| REQ-007 | This phase's new/modified prose (`swe-1.6.md` at minimum) is grepped for the phantom permission-mode wording bug ("auto, dangerous, or dangerous") before closeout, with zero matches; a durable repo-wide grep guard is recommended as a phase 007 follow-up rather than added here. | A recorded `rg` run shows 0 matches; the phase-007 follow-up recommendation appears in Open Questions. |
| REQ-008 | `bash check-prompt-quality-card-sync.sh` exits 0 (all 4 checks PASS) end-to-end after all edits in this phase. | Command output shows "GUARD PASS" and exit code 0. |

### P2 - Nice to have

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-009 | `model-profiles.json`'s top-level `version` and `description` fields are updated to mention the `swe-1.6` cli-devin-exclusive stub, mirroring how the existing description already calls out Haiku as an "Optional unverified separate-pool stub". | The `description` field's prose includes an `swe-1.6` clause; `version` is bumped from `"1.5"` to a documented next value. |
| REQ-010 | The out-of-scope SKILL.md table gap and the pre-existing cli-codex CI-gate gap are both recorded as explicit Open Questions/follow-ups rather than silently left undiscovered. | Both appear in this spec's Open Questions section. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
- **SC-001**: `model-profiles.json` contains `swe-1.6` (`cli-devin`, `cognition-free`, `active`, no `recommended_frameworks`) and `cli-devin` executor rows on `deepseek-v4-pro`/`kimi-k2.7-code`/`glm-5.2`, with their `cli-opencode` rows unchanged.
- **SC-002**: `swe-1.6.md` exists, matches the sibling format, and documents both the re-verification-needed reliability notes and the 2-layer sequential-thinking pattern.
- **SC-003**: `check-prompt-quality-card-sync.sh` passes all 4 checks - including the newly-dependent CHECK 4 on the 3 sibling models' new `cli-devin` rows - with the `CLI_EXECUTOR_HUB_METADATA` fix in place.
- **SC-004**: No `cli-opencode` executor row, no unrelated model entry, and no file outside the declared 3-file scope changed.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | CHECK 4 fails silently if `CLI_EXECUTOR_HUB_METADATA` isn't extended for `cli-devin` | High | Made an explicit, separately-verified requirement (REQ-005); re-run the script after all edits. |
| Risk | Archived line numbers (63/93) are stale relative to the current script (currently 61-64 / 91, post kebab-case-migration squash) | Medium | Every line-number claim in this phase's docs is marked TBD-verify-at-implementation; array *contents*, not line numbers, are the ground truth. |
| Dependency | Phase 003 must have already registered `cli-devin`'s trigger_phrases (deepseek/kimi/glm family tokens) in the hub's shared `graph-metadata.json` | High | The phase transition rule already requires the 003-to-004 handoff to confirm hub registration; phase 005 re-verifies reachability via CHECK 4 before closeout. |
| Dependency | `swe-1.6`'s exact `context_length` / `avg_iter_wall_clock_min` were not confirmed by phase 001's research | Low | Both fields recorded as `null`/TBD rather than invented; can be filled in once Devin's model-card docs are re-fetched. |
| Risk | Devin's current tier/quota model may no longer match the archived free/pro split (Adaptive router is now default) | Medium | `swe-1.6.md` explicitly flags this as unconfirmed rather than asserting the old shape as current fact (REQ-003). |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: `check-prompt-quality-card-sync.sh`'s 4 checks remain a read-only, low-cost static analysis (no network calls); re-running after this phase's edits should complete in the same order of magnitude as today (a few seconds).

### Reliability
- **NFR-R01**: The 3 sibling models' existing `cli-opencode` dispatch path is provably unchanged (REQ-002's regression guard), so no live delegation currently routed through `cli-opencode` should observe any behavior change from this phase.

### Security
- **NFR-S01**: No credentials, tokens, or auth flows are touched; all edits are static JSON/Markdown/Bash-array data, matching phase 001's read-only, auth-adjacent boundary.

---

## 8. EDGE CASES

- **`swe-1.6` requested with no `devin` binary on PATH**: out of scope here, handled by phase 002's fail-closed executor guard (mirrors the `cli-codex` precedent), not this phase's registry data.
- **A caller assumes `swe-1.6` is reachable via `cli-opencode`**: the entry deliberately carries no `cli-opencode` executor row (Devin-exclusive), so callers must route through `cli-devin`.
- **Devin's tier/quota model has changed since phase 001's research and the Free tier no longer exists in the documented shape**: `swe-1.6.md`'s reliability notes are written as a historical/re-verify claim, not an unconditional current fact, so later drift doesn't leave a false assertion live.
- **CHECK 4 exercises `cli-devin` reachability for deepseek/kimi/glm but phase 003 hasn't actually landed yet when phase 005 executes**: the phase transition rule (003-to-004 handoff) is the sequencing guard; this phase's own task list explicitly re-verifies the precondition (T002) rather than assuming it.

---

## 9. COMPLEXITY ASSESSMENT

Low-to-medium. No runtime code changes; the work is JSON/Markdown/Bash-array data restoration across 3 files, but load-bearing correctness depends on a cross-file, cross-phase consumer relationship (CHECK 4 / `CLI_EXECUTOR_HUB_METADATA`) that isn't obvious from reading any single file in isolation - discovering and documenting that relationship is the real complexity driver, not the edits themselves.

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | 3 files, additive data + one dict-key fix. |
| Risk | 10/25 | Cross-consumer CHECK 4 dependency; regression guard on 3 existing live-routed models. |
| Research | 12/20 | Required direct-reading the live script to discover the CLI_EXECUTOR_HUB_METADATA gap; archived facts alone were insufficient. |
| **Total** | **30/70** | **Level 2** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | CHECK 4 fails post-edit because `CLI_EXECUTOR_HUB_METADATA` wasn't extended | H | M | REQ-005 makes this an explicit, separately-verified requirement. |
| R-002 | A sibling model's existing `cli-opencode` row is accidentally altered while adding `cli-devin` | H | L | REQ-002 regression guard + a dedicated diff-check task. |
| R-003 | `swe-1.6.md` reasserts stale free/pro-tier facts as current without caveat | M | M | REQ-003 mandates the explicit re-verification caveat. |
| R-004 | Archived line-number claims (63/93) are trusted over the live file | L | M | All line-number claims marked TBD-verify-at-implementation. |

---

## 11. USER STORIES

### US-001: Registry restored against current slugs (Priority: P0)
**As a** operator reviving cli-devin, **I want** `swe-1.6` and its sibling executor rows restored against current model slugs, **so that** the registry doesn't silently point at models that no longer exist (`kimi-k2.6`, `glm-5.1`).

**Acceptance Criteria**:
1. Given the restored registry, When any of the 3 sibling models is inspected, Then its `id` field matches a currently-live model in the file (`kimi-k2.7-code`, `glm-5.2`), never the archived slug.

### US-002: CI gate stays green (Priority: P0)
**As a** maintainer running the CI gate, **I want** `check-prompt-quality-card-sync.sh` to still pass after `cli-devin` rows are added, **so that** the restoration doesn't quietly break the existing drift guard.

**Acceptance Criteria**:
1. Given all 3 files edited, When `check-prompt-quality-card-sync.sh` is run, Then it exits 0 with all 4 checks PASS.

### US-003: Reliability claims stay honest (Priority: P1)
**As a** future reader of `swe-1.6.md`, **I want** the Free-tier reliability claim clearly marked as needing re-verification, **so that** I don't treat a 2026-05-era observation as a current guarantee.

**Acceptance Criteria**:
1. Given `swe-1.6.md`'s reliability section, When read, Then the Free-tier claim is explicitly framed as historical/needs-re-verification, not asserted as Devin's current tier model.

---

## 12. OPEN QUESTIONS

- Should `sk-prompt/prompt-models/SKILL.md`'s own model-executor table (~line 210), its Keywords comment, and its "in-scope model set" prose also gain an `swe-1.6`/`cli-devin` mention? Not in the parent packet's declared Files to Change table for this phase; recommended as a phase 005 follow-up or folded into phase 007's closeout sweep. Operator to decide.
- Should the pre-existing, orthogonal gap (`cli-codex` absent from `cli_cards[]`, `cli_skills[]`, and `CLI_EXECUTOR_HUB_METADATA` despite having its own `prompt-quality-card.md` and despite the script's header comment claiming "4 cli-* executors" coverage) be fixed now, deferred to phase 007, or tracked as a separate packet? Scoped **out** of this phase by default - it predates and is orthogonal to the cli-devin revival.
- Is a permanent, repo-wide grep-based CI guard against the phantom permission-mode wording bug ("auto, dangerous, or dangerous") worth adding as its own check, and if so, in `check-prompt-quality-card-sync.sh`, a new script, or an existing lint pass? Recommended in principle; this phase only runs a one-time grep against its own new prose, deferring the permanent-guard decision to phase 007.
- What are `swe-1.6`'s actual `context_length` and `avg_iter_wall_clock_min` values? Not confirmed by phase 001's research; recorded as `null`/TBD pending a fresh `docs.devin.ai` fetch during implementation.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS
- **Implementation Plan**: `plan.md`
- **Task Breakdown**: `tasks.md`
- **Verification Checklist**: `checklist.md`
- **Parent Spec**: `../spec.md`
- **Predecessor**: `../004-devin-hook-adapter-layer/spec.md`
- **Successor**: `../006-devin-manual-testing-playbook/spec.md`
- **Archived removal record**: `../../z_archive/022-cli-devin-deprecation/spec.md`
