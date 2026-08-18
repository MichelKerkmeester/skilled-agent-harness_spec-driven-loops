---
title: "Implementation Summary: Cursor + Devin testing-playbook scenarios"
description: "Closeout for adding VSN-017..VSN-020 scenarios and the shared-transport catalog page so the sk-vision playbook covers all four hosts and the vision-blind-model value story."
trigger_phrases:
  - "sk-vision cursor devin testing playbook summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "specs/sk-vision/001-sk-vision-fork-of-opencode-senses/017-cursor-devin-testing-playbook"
    last_updated_at: "2026-08-17T16:00:00.000Z"
    last_updated_by: "claude"
    recent_action: "Authored VSN-017..VSN-020 playbook scenarios and updated the index."
    next_safe_action: "Commit the sk-vision-scoped changes on v4."
    blockers: []
    key_files:
      - "specs/sk-vision/001-sk-vision-fork-of-opencode-senses/017-cursor-devin-testing-playbook/implementation-summary.md"
      - ".opencode/skills/sk-vision/manual-testing-playbook/host-adapters/vision-blind-model.md"
      - ".opencode/skills/sk-vision/manual-testing-playbook/manual-testing-playbook.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-017-cursor-devin-testing-playbook"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 017-cursor-devin-testing-playbook |
| **Status** | In Progress |
| **Level** | 1 |

The four scenarios, the catalog page, and the index update are done and verified; the sk-vision-scoped commit on v4 is the one remaining step.
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The manual-testing-playbook now covers the MCP path and the reason it exists. Four new operator scenarios and one ported feature-catalog page extend coverage from two in-process hosts to all four hosts plus the end-to-end value story.

### Fix evidence

| Edit | Artifact | Result |
|------|----------|--------|
| Standalone server scenario | `host-adapters/mcp-standalone.md` | `VSN-017`: server starts, advertises 13 tools |
| Cursor attach scenario | `host-adapters/cursor-mcp.md` | `VSN-018`: merged config preserved, attach, `sk_vision_status` |
| Devin attach scenario | `host-adapters/devin-mcp.md` | `VSN-019`: dedicated config, namespaced `mcp__sk-vision__sk_vision_status` |
| Value scenario | `host-adapters/vision-blind-model.md` | `VSN-020`: text-only model reads an image via a tool call |
| Catalog page | `feature-catalog/host-adapters/mcp-transport.md` | Shared-transport page the four scenarios reference |
| Index | `manual-testing-playbook.md` | §10 four hosts + `VSN-017`..`VSN-020`; coverage note 20; version 1.1.0.0 |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The three MCP host scenarios were authored against the existing `VSN-014`/`VSN-015` shape: a nine-column scenario table plus prose Test Execution, Source Files, and Source Metadata sections. `VSN-020` was authored fresh to isolate the value: a text-only model such as GLM, which cannot see a pixel of an attached image, calls `sk_vision_ocr`/`sk_vision_inspect` and quotes the real text — PASS only when a vision tool is called and the quote matches ground truth. The Cursor and Devin "Why This Matters" sections were enriched to name GLM and the vision-blind case as the reason the MCP path ships. Because the four scenarios reference `../feature-catalog/host-adapters/mcp-transport.md`, which was absent on this branch, that catalog page was ported too so the links resolve. Adding a file under the `feature-catalog` leaf root changed the manifest, so `ci-skill-root-metadata.cjs --fix` regenerated `leaf-manifest.json`/`leaf-aliases.json`; the MCP server, the 13 tools, the adapters, and the host configs were not touched.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Separate `VSN-020` from the attach scenarios | Attach proves the socket connects; only a dedicated scenario proves a text-only model actually reads an image |
| Lead the Cursor/Devin value with the GLM vision-blind angle | Both hosts commonly run GLM, which cannot see images; sk-vision's tools are what give it sight |
| Add `VSN-017` as a standalone-server scenario | It isolates transport failures from host-config failures, and both hosts depend on it |
| Port the transport catalog page | The four scenarios link it; without it the playbook links dangle |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `host-adapters/` tree | lists `mcp-standalone.md`, `cursor-mcp.md`, `devin-mcp.md`, `vision-blind-model.md` alongside the two in-process files |
| catalog page | `feature-catalog/host-adapters/mcp-transport.md` present |
| index §10 | names all four hosts and links `VSN-017`..`VSN-020` |
| coverage note | reads 20 operator scenarios; version `1.1.0.0` |
| `ci-skill-root-metadata.cjs` | `OK [S] sk-vision (wrote leaf-manifest.json, leaf-aliases.json)` |
| `validate_skill_package.py --check` | PASS |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## KNOWN LIMITATIONS

- The scenarios are authored and internally consistent, but `VSN-018`/`VSN-019`/`VSN-020` require a live Cursor/Devin host and a text-only model to execute; this packet ships the executable contract, not a run log.
- `dist/mcp-server.js` remains a gitignored build artifact, so every MCP scenario needs `bun run build` before it launches on a fresh checkout.
- The changes live in the main checkout only; the commit on `v4` is pending. Unrelated checkout work is untouched.
- `description.json` and `graph-metadata.json` are conductor-generated, not hand-authored.
<!-- /ANCHOR:limitations -->
