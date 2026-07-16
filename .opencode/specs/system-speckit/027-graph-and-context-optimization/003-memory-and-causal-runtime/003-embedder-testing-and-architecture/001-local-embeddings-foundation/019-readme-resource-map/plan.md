---
title: "Implementation Plan: 019 README Resource Map and Cleanup"
description: "Two-phase plan: cli-opencode + DeepSeek v4 pro produced the staleness inventory; main agent applies the edits."
trigger_phrases:
  - "019 plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/019-readme-resource-map"
    last_updated_at: "2026-05-13T15:50:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored plan capturing the two-phase research+execution flow"
    next_safe_action: "Apply README edits per resource-map.md section 3"
    blockers: []
    key_files:
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0140190c2a9e0000000000000000000000000000000000000000000000000002"
      session_id: "019-readme-resource-map-2026-05-13"
      parent_session_id: "019-readme-resource-map-2026-05-13"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: 019 README Resource Map and Cleanup

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Approach

Two distinct phases:

1. **Research (complete).** `cli-opencode --pure --model deepseek/deepseek-v4-pro` scanned 522 READMEs read-only, classified 7 as MAJOR, and produced `resource-map.md` with per-README line numbers, current content quotes, and suggested replacement text.
2. **Edit (this phase).** Main agent (Claude Opus 4.7 1M) applies the edits surgically using Edit tool calls keyed by quoted content. Then symlinks the barter copies.

### Why not dispatch to `@markdown` for the edit phase

`@markdown` is template-first and gated on `/create:*` commands. Surgical README edits keyed by a resource map sit outside its convention. Doing the edits inline with the main agent avoids the Phase 0 gate refusal risk and the dispatch latency. The work is well-specified (every change has a quoted before/after) so the value-add of an additional agent layer is small.

If a sonnet-tier review pass is desired afterward, `cli-claude-code` can be dispatched separately to spot-check the changes.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Pass criterion |
|------|----------------|
| Resource map present | `resource-map.md` exists at packet root, ≥ 30 KB |
| Canonical READMEs aligned | 0 grep hits for stale-pattern phrases (Voyage-as-recommended, Nomic-as-default, MiniLM-as-default) across the 7 MAJOR files |
| Barter symlinks live | All 7 barter copies are symlinks resolving to canonical (verified via `readlink` + content match) |
| Parent graph-metadata updated | `019-readme-resource-map` appears in `children_ids` and `derived.last_active_child_id` |
| Strict-validate clean | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh ...019-readme-resource-map --strict` exits 0 |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

| Step | Surface | Tool |
|------|---------|------|
| 1 | Packet 019 spec docs | Write (main agent) |
| 2 | 7 canonical README edits | Edit (main agent, keyed by quoted content) |
| 3 | Q1: Ollama section removal | Edit (main agent, install_guides README) |
| 4 | Q3: auto-migration mention | Edit (main agent, providers README) |
| 5 | barter symlinks | Bash (main agent, `ln -sfn`) |
| 6 | Strict-validate | Bash (main agent) |
| 7 | Parent metadata update | Edit (main agent) |
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 0: Research (complete)

- `cli-opencode --pure --model deepseek/deepseek-v4-pro` dispatched read-only
- Output: `resource-map.md` (41 KB, 6 sections, 7 MAJOR READMEs classified)
- Operator answered Q1-Q4 from open questions

### Phase 1: Spec docs (in progress)

- Write `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` (this work)
- `description.json` and `graph-metadata.json` already in place from packet scaffolding

### Phase 2: Canonical README edits

- Apply Edit calls keyed by quoted content from `resource-map.md` section 3
- Apply Q1 (Ollama removal) to install_guides README
- Apply Q3 (auto-migration mention) to providers README

### Phase 3: barter symlinks

- Replace each barter copy with a relative symlink to canonical
- 6 files in total

### Phase 4: Validation

- Strict-validate exits 0
- Update parent graph-metadata.json
- Fill implementation-summary.md with final state
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

This is a doc-only packet. Tests are acceptance greps rather than unit tests.

```bash
# Verify no stale references remain in canonical READMEs
for f in README.md \
         .opencode/install_guides/README.md \
         .opencode/skills/system-spec-kit/README.md \
         .opencode/skills/system-spec-kit/shared/README.md \
         .opencode/skills/system-spec-kit/shared/embeddings/README.md \
         .opencode/skills/system-spec-kit/shared/embeddings/providers/README.md \
         .opencode/skills/mcp-coco-index/README.md; do
  grep -ciE "(Voyage.+recommended|nomic-ai/nomic-embed-text|all-MiniLM-L6-v2.+default)" "$f"
done

# Verify barter symlinks
for f in barter/.opencode/skills/system-spec-kit/README.md \
         barter/.opencode/skills/mcp-coco-index/README.md \
         barter/.opencode/install_guides/README.md \
         barter/.opencode/skills/system-spec-kit/shared/README.md \
         barter/.opencode/skills/system-spec-kit/shared/embeddings/README.md \
         barter/.opencode/skills/system-spec-kit/shared/embeddings/providers/README.md \
         barter/README.md; do
  test -L "$f" && test -e "$f" && echo "ok: $f -> $(readlink $f)"
done
```
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Note |
|------------|------|------|
| Packet 018 | Logical | `BEFORE_VS_AFTER.md` and 018 auto-migration provide the canonical reference for the new state described in the resource map |
| `cli-opencode` + DeepSeek API | Tool | Required for the Phase 0 read-only research scan |
| Edit tool (main agent) | Tool | Used to apply line-by-line edits keyed by quoted content |
| `bash` | Tool | Used to create the 7 barter symlinks via `ln -s` |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

If the README edits cause issues, the safest rollback is per-file `git checkout HEAD -- <path>` on each affected canonical README. The 7 barter symlinks can be reverted with `rm <symlink> && git checkout HEAD -- <symlink>` to restore the previous independent copies.

Packet 019's spec docs and `resource-map.md` are research output and have no operational dependency on each other.
<!-- /ANCHOR:rollback -->
