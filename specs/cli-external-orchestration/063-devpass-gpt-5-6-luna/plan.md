---
title: "Implementation Plan: Luna on both DevPass rosters"
description: "Add one model to the existing pi provider block, and create the DevPass catalog section cli-opencode never had, dispatch-testing every row on the CLI that documents it rather than carrying pi's evidence across."
trigger_phrases:
  - "luna devpass plan"
  - "llmgateway both rosters"
  - "implementation"
  - "plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/063-devpass-gpt-5-6-luna"
    last_updated_at: "2026-09-04T00:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Both rosters updated and verified"
    next_safe_action: "None - work is complete and verified"
    blockers: []
    key_files:
      - ".pi/models.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-063-luna-devpass"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Luna on both DevPass rosters

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JSON config + Markdown catalogs |
| **Framework** | pi 0.84.3, opencode 1.18.11 |
| **Storage** | None |
| **Testing** | Live `curl` for the wire id, then live dispatch per model per CLI |

### Overview
Asymmetric work behind a symmetric-sounding request. On cli-pi this is one model object in a block that already exists. On cli-opencode it is the whole DevPass catalog section, because that side had none — so "add Luna to the opencode roster" required building the roster first.

The evidence rule drove the shape: a dispatch through pi proves nothing about opencode, since they compose the model reference differently and hold separate credentials. Every row is tested on the CLI whose catalog claims it, which is why there are ten dispatches rather than five.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Luna present on the gateway, with ladder, limits and pricing captured
- [x] Bare wire id confirmed by live call before any config was written
- [x] cli-opencode confirmed to have no existing DevPass section

### Definition of Done
- [x] Luna dispatches on both CLIs
- [x] Five rows on each roster, each dispatch-tested on its own CLI
- [x] pi JSON valid and operator-formatted
- [x] Packet 060 reconciled so WS1 is not claimed twice
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Two enforcement models, one roster. cli-pi enforces through config — a model absent from `.pi/models.json` cannot be selected. cli-opencode enforces through discipline — `--model` is free-form and the catalog *is* the rule. So the same five models need a config object on one side and a catalog row on the other, and only one of those two is machine-checkable.

### Key Components
- **`providers.llmgateway.models`** — five objects, five different `thinkingLevelMap`s.
- **cli-opencode `### llmgateway`** — the new catalog section, bounded by the closed-roster rule against the gateway's 183 available models.
- **The `--variant` mapping table** — gains a row saying effort is per-model here, unlike every other provider in that table.

### Data Flow
pi: `--provider llmgateway --model llmgateway/gpt-5.6-luna` → sends `model: "gpt-5.6-luna"`. opencode: `--model llmgateway/gpt-5.6-luna` → same wire id. Both two-segment, both bare, and the gateway reports `azure/gpt-5.6-luna` back.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

N/A beyond the verification tasks in `tasks.md`. Ten dispatches: five models times two CLIs, each at that model's own ceiling. Cross-CLI inference was rejected deliberately — the two compose references differently and authenticate separately, so one CLI's success is not evidence for the other's catalog.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| DevPass subscription | External | Green — ten live turns | No dispatch |
| `LLMGATEWAY_API_KEY` in `~/.zshenv` | Operator machine | Green — set and verified against a scrubbed environment | pi dispatches 401 |
| opencode `llmgateway` credential | External | Green — in opencode's own auth store | opencode dispatches fail |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a route misbehaves, or the DevPass plan changes.
- **Procedure**: to drop Luna alone, remove its model object and its one `enabledModels` line, and the row from each catalog. To drop DevPass from cli-opencode, delete the `### llmgateway` section and its `--variant` row — nothing enforces it in code, so removing the catalog removes the permission. `.pi/custom-providers.md` §6 covers the pi side.
<!-- /ANCHOR:rollback -->
