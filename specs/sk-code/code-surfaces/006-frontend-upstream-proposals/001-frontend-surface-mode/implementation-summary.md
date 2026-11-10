---
title: "Implementation Summary"
description: "The sk-code hub gains a read-only sk-code-frontend surface: a core practice page, web and React Native layers, eleven routed topic files and the five-pass Figma check."
trigger_phrases:
  - "frontend surface mode implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/code-surfaces/006-frontend-upstream-proposals/001-frontend-surface-mode"
    last_updated_at: "2026-11-03T11:40:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Built and verified the sk-code-frontend surface"
    next_safe_action: "Commit and push phase 001, then open phase 002 with its baseline run."
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "ae286a84-7880-4ce7-a5fe-7d1335e09c78"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-frontend-surface-mode |
| **Completed** | 2026-11-03 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A frontend prompt on the sk-code hub now bundles `sk-code-frontend`, a read-only surface with stack-agnostic web and React Native practice and a five-pass check of a built screen against its Figma frame. "review my css cascade layers change" routes to `sk-code-review` plus `sk-code-frontend`, and the packet loads the core page, the web layer and the cascade topic file.

### Phase 1: frontend-surface-mode

The packet holds the core page with the Frontend overrides contract, a web layer with live-verified `bdg` recipes, a native layer, six web and five native topic files, and `figma-to-code.md`. Each topic file has its own router intent. The hub registry, router, docs, changelogs, canary case, activation manifests and Hermes mirror carry the new surface.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-code/sk-code-frontend/` | Created | The surface packet: SKILL, README, ROUTER, changelog, 15 references, 3 workflow symlinks |
| `.skilled/skills/sk-code/{mode-registry,hub-router,description,graph-metadata,leaf-manifest}.json` | Modified | Register and route the surface, add its intent signals, hub version 3.10.0.0 |
| `.skilled/skills/sk-code/{ROUTER,SKILL,README}.md`, `changelog/v3.10.0.0.md` | Modified, created | Hub routing maps and surface listings |
| `.skilled/skills/sk-code/shared/`, `feature-catalog/` | Modified | Name the third surface |
| `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs` | Modified | Add the surface to the guard's list |
| `.skilled/skills/mcp-tooling/mcp-figma/SKILL.md` | Modified | One pointer to the five-pass check |
| `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/` canary and two manifests, promoted into `.skilled/bin/lib/compiled-routing/` | Modified | Frontend canary case; sk-code and mcp-tooling activation hashes |
| `.skilled/bin/tests/compiled-route-surface-hint.test.cjs` | Modified | A bundling test and a stay-off test |
| `.hermes/skills/` | Regenerated | Mirrors for sk-code, sk-code-frontend and mcp-figma |
| `.skilled/skills/sk-doc/scripts/tests/code-folder/durable-directory-manifest.json` | Modified | List the new packet folder |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Builds ran on cli-codex gpt-6-luna until its quota ran out mid-dispatch, then on DeepSeek V4.1 Flash max through opencode-go by operator ruling. Each dispatch was checked in this session. Then came the final reach on three hubs, the two-stage replay, the parent-skill checker, the router-sync guard, the compiled-route tests and an independent DeepSeek verification pass (`scratch/verify-001.md`).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Web and native layers (ADR-001) | The operator ruled both in; the hub's section 6 sentence now names the stack-agnostic surface |
| One router intent per topic file | The core page loads one topic file, and the router-sync guard needs every topic file routed |
| "react native scroll performance" over "react native list performance" | Any prompt with the word "list" reached no hub; a rename, not an allowlist entry |
| Canary and test use a review prompt | With no workflow-mode word the surface routes alone, exactly as `sk-code-ci` does on main |
| Native files cite a React Native version, not Baseline | Baseline covers web features only; REQ-006 amended by operator ruling |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Reach, concurrency 2 | sk-code 97, sk-design 120 (1 allowed), mcp-tooling 115: outranked 0, wrong-hub 0, no-reach 0, each `RESULT: PASSED` |
| `parent-skill-check.cjs .skilled/skills/sk-code` | All hard invariants passed, 0 warnings |
| `verify-router-sync.cjs` | 5/5 checks passed |
| `compiled-route-surface-hint.test.cjs` | 15/15 pass |
| Compiled-route suite | 96/97; the one failure (gold corpus pinned at 96) also fails on main |
| sk-code-quality tests | 154/154 |
| Barter grep on the packet | No line, exit 1 |
| Hermes mirror `--check` | 66 copies in sync |
| Independent verification | 15 rows; AC-006 met under the amended wording |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The intent-signal generator never prunes.** The renamed phrase stayed in `graph-metadata.json` until it was removed by hand. Phase 002 adds the orphan check and prune.
2. **Two suites fail for reasons outside this phase.** The compiled-route gold-corpus pin and the durable-directory manifest (two decision-capture benchmark folders) fail on main too.
<!-- /ANCHOR:limitations -->

---
