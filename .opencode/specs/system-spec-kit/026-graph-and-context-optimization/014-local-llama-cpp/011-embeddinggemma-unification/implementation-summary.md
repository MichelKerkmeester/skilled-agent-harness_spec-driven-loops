---
title: "Implementation Summary: 014/011 embeddinggemma-unification"
description: "EmbeddingGemma unification packet: source defaults changed for memory and CocoIndex, runtime notes mostly updated, Qwen3 purge in progress, and doc-prompt asymmetry documented. Codex config is blocked by filesystem EPERM."
trigger_phrases:
  - "011 embeddinggemma unification"
  - "EmbeddingGemma default both surfaces"
  - "Qwen3 purge"
  - "google embeddinggemma cocoindex"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-setup-a/011-embeddinggemma-unification"
    last_updated_at: "2026-05-13T07:35:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "All edits shipped + .codex/config.toml fixed by main agent"
    next_safe_action: "Use 012 for v3 remediation follow-up"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0140110c2a9e0000000000000000000000000000000000000000000000000004"
      session_id: "014-011-embeddinggemma-2026-05-13"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Gate 3 folder? -> User pre-answered existing 014/011"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 011-embeddinggemma-unification |
| **Completed** | 2026-05-13 |
| **Level** | 1 |
| **Status** | Complete (shipped 2026-05-13 in commit d76f3b795) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The embedding defaults now point at EmbeddingGemma at the editable source layers:

- Memory side: `onnx-community/embeddinggemma-300m-ONNX`, hf-local, 768 dims, q8 default after 012.
- CocoIndex side: `google/embeddinggemma-300m`, sentence-transformers, 768 dims, bf16 as loaded from the safetensors metadata.

CocoIndex keeps the query prompt mapping already added by the main agent: `google/embeddinggemma-300m -> InstructionRetrieval`, which resolves to `task: code retrieval | query: `. Document prompts are not applied because the CocoIndex daemon path does not expose asymmetric query/document prompt hooks. That means indexed documents remain unprefixed. This is suboptimal compared with a true asymmetric EmbeddingGemma setup, but acceptable for the current quiet/default profile.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `cocoindex_code/config.py` | Modified | New env fallback default `sbert/google/embeddinggemma-300m` |
| `cocoindex_code/settings.py` | Modified | New generated/default user setting `google/embeddinggemma-300m` + `sentence-transformers` |
| `hf-local.ts` | Modified | New ONNX EmbeddingGemma default for memory |
| `factory.ts` | Modified | hf-local provider-default metadata now matches ONNX EmbeddingGemma |
| Runtime configs | Modified | Notes now describe Gemma defaults |
| `011/*.md` + metadata | Created | Level-1 packet docs |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Main-agent execution in the shared workspace. The dedicated patch tool rejected workspace paths in this session, so deterministic in-place edits were used from the repo root and verified with `git diff` and strict validation. No live CocoIndex daemon was touched. No HuggingFace cache files were deleted.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep Qwen registry entries | They are recognized models for explicit opt-in; only defaults/current-state docs are being purged |
| Use canonical `google/embeddinggemma-300m` for CocoIndex | sentence-transformers loads the safetensors form directly and applies the bf16 default from metadata |
| Use ONNX-community port for memory | transformers.js needs the ONNX model form; this path was already validated by earlier packets |
| Document doc-prompt asymmetry instead of pretending it is solved | CocoIndex's daemon path does not support separate doc prompts today |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Command | Result |
|-------|---------|--------|
| Dedicated patch tool | `apply_patch` with workspace-relative paths | BLOCKED - rejected as outside project |
| Codex config write | `touch .codex/.write-test`; direct write to `.codex/config.toml` | BLOCKED - EPERM |
| Source default diff | `git diff -- config.py settings.py hf-local.ts factory.ts` | PASS - expected defaults changed |
| Shared TypeScript build | `cd .opencode/skills/system-spec-kit/shared && npx tsc --build` | PASS |
| Legacy model sweep | targeted `rg` over active legacy code-side default strings | PASS - only historical/registry mentions remain |
| Strict validate | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <packet> --strict` | PASS |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Prior `.codex/config.toml` write blocker is resolved for 011.** The main agent patched the file outside the previous sandbox on 2026-05-13; 012 records the new q8 launcher-parity patch separately.
2. **CocoIndex document-side prompt is unprefixed.** Query prompt is set through `InstructionRetrieval`, but doc prompts are not supported by the daemon.
3. **Gemma is the quiet default, not necessarily the strongest code model.** Qwen remains available as an explicit recognized model for users willing to pay the RAM/indexing cost.
<!-- /ANCHOR:limitations -->
