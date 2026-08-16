---
title: "Feature Specification: sk-vision rebrand identifiers"
description: "Longest-token-first identifier rewrite in vision-runtime/ only. Package name sk-vision. Keep LICENSE Adarsh line. Do not invent sk_vision_query."
trigger_phrases:
  - "sk-vision rebrand"
  - "sk-vision SK_VISION_"
  - "sk-vision package name"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-vision/001-sk-vision-fork-of-opencode-senses/003-runtime-fork/002-rebrand-identifiers"
    last_updated_at: "2026-08-16T07:45:00.000Z"
    last_updated_by: "cursor-grok"
    recent_action: "Authored nested-phase copy pack and L1 suite."
    next_safe_action: "Implement files from this child's spec.md copy pack."
    blockers: []
    key_files:
      - "spec.md"
      - ".opencode/skills/sk-vision/vision-runtime/package.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-001-sk-vision-fork-of-opencode-senses-003-runtime-fork-002-rebrand-identifiers"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: sk-vision rebrand identifiers

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-08-16 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 4 |
| **Predecessor** | 001-copy-shipped-files |
| **Successor** | 003-build-and-tests |
| **Handoff Criteria** | rg residual dump identifiers returns only the LICENSE Adarsh exception (or zero hits). No sk_vision_query. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of `003-runtime-fork`.

**Scope Boundary**: String rewrite in dest only. No bun build. No context/ edits.

**Dependencies**:
- 001-copy-shipped-files dest files exist.

**Deliverables**:
- Rebranded source under vision-runtime/. Fork ADRs stay in 001-research.

**Changelog**:
- When this phase closes, refresh the matching file in the parent changelog using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Copied files still speak dump identifiers. Hosts and caches would collide with upstream names.

### Purpose
Rewrite identifiers longest-token-first in dest only. Keep MIT Adarsh copyright.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Apply the find/replace table longest-token-first
- Set package.json name to sk-vision
- Keep LICENSE Adarsh line; append this project's modification notice
- Correct python/runtime.py header: default model stays moondream2

### Out of Scope
- Editing context/
- bun install / bun run build — next child
- GPU smoke — later child
- Global replace of remaining opencode-senses provenance URLs
- Inventing sk_vision_query

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-vision/vision-runtime/src/**` | Modify | Identifier rewrite |
| `.opencode/skills/sk-vision/vision-runtime/python/runtime.py` | Modify | Env, envelope, model comment |
| `.opencode/skills/sk-vision/vision-runtime/package.json` | Modify | name sk-vision |
| `.opencode/skills/sk-vision/vision-runtime/LICENSE` | Modify | Append modification notice only |

### Implementer copy pack (follow exactly)

Stop and report if any of these is true: dest files from 001-copy-shipped-files are missing; you are about to edit `context/`; you are about to invent `sk_vision_query`; you are about to rewrite the LICENSE author name.

Apply replacements longest-token-first. Skip LICENSE for string rewrite; keep `Copyright (c) 2026 Adarsh Gourab Mahalik` and append a second line `Copyright (c) 2026` plus this project's modification notice.

| Find | Replace | Notes |
|------|---------|-------|
| `SENSES_DISABLE_AUTO_PROVISION` | `SK_VISION_DISABLE_AUTO_PROVISION` | |
| `SENSES_KV_CACHE_PAGES` | `SK_VISION_KV_CACHE_PAGES` | |
| `SENSES_CACHE_DIR` | `SK_VISION_CACHE_DIR` | |
| `SENSES_VENV_DIR` | `SK_VISION_VENV_DIR` | |
| `SENSES_PYTHON` | `SK_VISION_PYTHON` | |
| `SENSES_MODEL` | `SK_VISION_MODEL` | default remains `moondream2` |
| `SENSES_DEBUG` | `SK_VISION_DEBUG` | |
| `SENSES_ERROR` | `SK_VISION_ERROR` | |
| `SENSES_UV` | `SK_VISION_UV` | |
| `~/.cache/opencode-senses` | `~/.cache/sk-vision` | also `.cache", "opencode-senses"` path joins |
| `/tmp/senses-` | `/tmp/sk-vision-` | |
| `<SENSES` | `<SK-VISION` | includes Atlas/Notice variants |
| `</SENSES>` | `</SK-VISION>` | |
| `senses_inspect` | `sk_vision_inspect` | then the other 12 keys |
| `senses_detect` | `sk_vision_detect` | |
| `senses_point` | `sk_vision_point` | |
| `senses_ocr` | `sk_vision_ocr` | |
| `senses_status` | `sk_vision_status` | |
| `senses_segment` | `sk_vision_segment` | |
| `senses_metadata` | `sk_vision_metadata` | |
| `senses_crop` | `sk_vision_crop` | |
| `senses_zoom` | `sk_vision_zoom` | |
| `senses_colors` | `sk_vision_colors` | |
| `senses_diff` | `sk_vision_diff` | |
| `senses_annotate` | `sk_vision_annotate` | |
| `senses_reverse` | `sk_vision_reverse` | |
| `sensesTools` | `skVisionTools` | |
| `SensesPlugin` | `SkVisionPlugin` | |
| `SensesError` | `SkVisionError` | |
| `SensesMessage` | `SkVisionMessage` | |
| `[senses]` / `[senses:py]` | `[sk-vision]` / `[sk-vision:py]` | stderr prefixes |
| package.json `"name": "opencode-senses"` | `"name": "sk-vision"` | not `@opencode-ai/sk-vision` |

Do not globally replace every remaining `opencode-senses` string. The dump `package.json` `repository.url` may keep the upstream git URL as provenance. Do not rewrite LICENSE author name.

In `python/runtime.py` header: it mentions Moondream 3.1 Photon. Keep default model `moondream2`. Correct the comment.

Proof (full rg wait until after build tests if you prefer; this child must at least prove no `sk_vision_query` and package name `sk-vision`):

```bash
rg -n 'sk_vision_query' .opencode/skills/sk-vision/vision-runtime && exit 1 || true
rg -n '"name": "sk-vision"' .opencode/skills/sk-vision/vision-runtime/package.json
```

Close this child with:

```bash
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/sk-vision/001-sk-vision-fork-of-opencode-senses/003-runtime-fork/002-rebrand-identifiers --strict
```
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Longest-token-first rewrite in dest only | No SENSES_* env names remain except LICENSE exception |
| REQ-002 | Package name sk-vision | package.json name field |
| REQ-003 | 13 sk_vision_* tools; no sk_vision_query | rg sk_vision_query empty |
| REQ-004 | LICENSE Adarsh line kept | Copyright line still present |
| REQ-005 | Default model moondream2 | SK_VISION_MODEL / package default |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-P1 | No extra scope | Files outside Files to Change stay untouched |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- [ ] package.json name is sk-vision
- [ ] No sk_vision_query
- [ ] LICENSE keeps Adarsh copyright
- [ ] This child validate.sh --strict exits 0
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Short-token replace breaking longer names | High | Longest-token-first table |
| Risk | Rewriting LICENSE author | High | Skip LICENSE for bulk replace |
| Risk | Inventing sk_vision_query | High | Stop rule |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

### Answered Questions
- **Q**: Publish as opencode-senses? **A**: No. Package name is sk-vision.
- **Q**: Keep dump repository.url? **A**: Yes, provenance.
- **Q**: Where do the fork ADRs live? **A**: `001-research/decision-record.md`. This child executes the rebrand; it does not keep a packet-local decision-record.md.

### Open Questions
- None.
<!-- /ANCHOR:questions -->
