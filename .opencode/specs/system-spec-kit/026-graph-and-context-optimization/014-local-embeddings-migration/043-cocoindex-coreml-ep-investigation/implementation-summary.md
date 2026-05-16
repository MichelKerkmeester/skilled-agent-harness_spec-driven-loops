---
title: "Implementation Summary: CocoIndex CoreML EP Investigation"
description: "Research-only packet summary for CocoIndex CoreML EP availability, current backend usage, and adoption recommendation."
trigger_phrases:
  - "cocoindex coreml"
  - "onnxruntime execution provider"
  - "search latency baseline"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-migration/043-cocoindex-coreml-ep-investigation"
    last_updated_at: "2026-05-14T16:20:00Z"
    last_updated_by: "codex-gpt5.5"
    recent_action: "Summarized EP findings"
    next_safe_action: "Use ADR before source work"
    blockers: []
    key_files:
      - "research.md"
      - "decision-record.md"
      - "scratch/step4-search-baseline.txt"
    session_dedup:
      fingerprint: "sha256:a33bb4bef5fdfd3569505047c40304469c1099e70a4a2cff89280ce49f3cfab7"
      session_id: "cli-codex-gpt5.5-xhigh-fast-043"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "CoreML EP is bundled but unused."
      - "Leading hypothesis is H4."
      - "Recommended path is Option C, defer."
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
| **Spec Folder** | `043-cocoindex-coreml-ep-investigation` |
| **Completed** | 2026-05-14 |
| **Level** | 1 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This packet documents the actual CocoIndex acceleration state on this machine. CoreML EP is available in the installed ONNX Runtime package, but CocoIndex does not currently reach it because the embedder path uses `sentence-transformers` with the default Torch backend.

### Research Packet

The packet captures raw venv inventory, source inspection, gap probes, and a three-trial search baseline. The important correction is that there is no `InferenceSession(... providers=...)` call site in the fork to tweak. A future CoreML change would need to expose Sentence Transformers ONNX backend configuration and add missing ONNX/Optimum package support.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `spec.md` | Modified | Defines research scope, requirements, and success criteria. |
| `plan.md` | Modified | Records the evidence-first investigation plan. |
| `tasks.md` | Modified | Tracks completed research tasks. |
| `implementation-summary.md` | Modified | Summarizes outcome and verification. |
| `research.md` | Created | Documents EP state, hypotheses, baseline, and path comparison. |
| `decision-record.md` | Created | Recommends deferring CoreML adoption for now. |
| `description.json` | Modified | Adds packet identity and parent chain metadata. |
| `graph-metadata.json` | Modified | Adds parent linkage and derived research metadata. |
| `scratch/*.txt` | Created | Preserves raw command output. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The packet was delivered through read-only Python introspection, source inspection, a controlled in-process search probe, and strict spec-kit validation.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Treat the leading case as H4. | CoreML EP is bundled, but CocoIndex does not expose a providers list or an ONNX backend setting. |
| Recommend Option C, defer. | Warm search latency is about 80 ms, and CoreML enablement needs source/package work beyond a simple provider toggle. |
| Avoid daemon lifecycle changes. | `ccc status` hit a sandbox lock error, and the dispatch forbids killing live MCP child processes. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `onnxruntime.get_available_providers()` | PASS: `['CoreMLExecutionProvider', 'AzureExecutionProvider', 'CPUExecutionProvider']`. |
| Source inspection for EP call sites | PASS: no `InferenceSession` or provider list in fork source. |
| Sentence Transformers backend probe | PASS: default backend is `torch`; wrapper signature exposes only `device` and `trust_remote_code`. |
| Search baseline | PASS: trials were 3850.9 ms, 80.4 ms, and 79.5 ms; average 1337.0 ms. |
| Strict validation | PASS: `validate.sh <043-path> --strict` exited 0. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **CLI daemon path blocked by sandbox.** `ccc status` failed on `~/.cocoindex_code/daemon.spawn-lock`, so the latency probe used the same query function in-process.
2. **No CoreML toggle was benchmarked.** No safe env var or CLI provider flag exists in this fork, and source/package mutation was out of scope.
3. **Torch MPS availability is environment-specific.** This session reports Torch MPS built but unavailable, so the current probe ran on CPU.
<!-- /ANCHOR:limitations -->
