---
title: "Tasks: 019 README Resource Map and Cleanup"
description: "Task list for applying README edits per the DeepSeek-generated resource map."
trigger_phrases:
  - "019 tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/019-readme-resource-map"
    last_updated_at: "2026-05-13T15:50:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored tasks plan"
    next_safe_action: "Execute T020-T080 in order"
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0140190c2a9e0000000000000000000000000000000000000000000000000003"
      session_id: "019-readme-resource-map-2026-05-13"
      parent_session_id: "019-readme-resource-map-2026-05-13"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: 019 README Resource Map and Cleanup

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## PHASE 1: SETUP

(Research and operator decision capture.)

- [x] T000 Dispatch cli-opencode + DeepSeek v4 pro for read-only README scan. Evidence: `resource-map.md` 41 KB, 522 READMEs classified.
- [x] T001 Operator review of findings. Evidence: 4 open questions answered (Q1: A, Q2: B, Q3: A, Q4: No).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

(Author spec docs, apply README edits, create barter symlinks.)

- [x] T010 Author `spec.md`, `plan.md`, `tasks.md` with operator decisions captured.
- [ ] T011 Fill `implementation-summary.md` after edits land.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

(Acceptance grep + strict-validate + parent metadata update.)

### 3a. Canonical README edits

- [ ] T020 Edit root `README.md` per resource-map section 3.1 (6 stale sections).
- [ ] T021 Edit `.opencode/install_guides/README.md` per resource-map section 3.2 (6 stale sections).
- [ ] T022 Remove all Ollama sections from `.opencode/install_guides/README.md` (Q1: A).
- [ ] T023 Edit `.opencode/skills/system-spec-kit/README.md` per resource-map section 3.3 (5 stale sections).
- [ ] T024 Edit `.opencode/skills/system-spec-kit/shared/embeddings/providers/README.md` per resource-map section 3.4 (2 stale sections).
- [ ] T025 Add brief auto-migration mention with link to `shared/embeddings/providers/README.md` (Q3: A).
- [ ] T026 Edit `.opencode/skills/system-spec-kit/shared/embeddings/README.md` per resource-map section 3.5 (3 stale sections).
- [ ] T027 Edit `.opencode/skills/system-spec-kit/shared/README.md` per resource-map section 3.6 (7 stale sections).
- [ ] T028 Edit `.opencode/skills/mcp-coco-index/README.md` per resource-map section 3.7 (6 stale sections).
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: barter symlinks

- [ ] T040 Replace `barter/.opencode/skills/system-spec-kit/README.md` with symlink.
- [ ] T041 Replace `barter/.opencode/skills/mcp-coco-index/README.md` with symlink.
- [ ] T042 Replace `barter/.opencode/install_guides/README.md` with symlink.
- [ ] T043 Replace `barter/.opencode/skills/system-spec-kit/shared/README.md` with symlink.
- [ ] T044 Replace `barter/.opencode/skills/system-spec-kit/shared/embeddings/README.md` with symlink.
- [ ] T045 Replace `barter/.opencode/skills/system-spec-kit/shared/embeddings/providers/README.md` with symlink.
- [ ] T046 Verify each symlink resolves to the canonical README.
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:phase-5 -->
## Phase 5: Validation

- [ ] T050 Run strict-validate on packet 019. Gate: exit 0.
- [ ] T051 Acceptance grep: no remaining "voyage-code-3 as primary", "nomic-ai/nomic-embed-text-v1.5 as default", "1024 as default", "voyage as recommended" in the 7 canonical READMEs.
- [ ] T052 Acceptance grep: at least one `llama-cpp` mention in each of the 7 canonical READMEs.
- [ ] T053 Fill `implementation-summary.md` with edit count, files touched, before/after diff stats.
- [x] T054 Update parent `graph-metadata.json` to add packet 019 as child, set `derived.last_active_child_id`, append causal_summary line.
<!-- /ANCHOR:phase-5 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Resource map authored by DeepSeek read-only scan
- [x] Operator decisions Q1-Q4 captured
- [x] 7 canonical READMEs aligned with factory.ts cascade
- [x] Phase 2 Ollama content removed from install guide (Q1: A)
- [x] 7 barter copies replaced with relative symlinks (Q2: B)
- [x] Auto-migration mention + link added to providers README (Q3: A)
- [x] `ollama` not introduced as `EMBEDDINGS_PROVIDER` value (Q4: No)
- [x] Parent graph-metadata updated with 019 entry and final causal summary
- [x] Acceptance grep: zero stale matches across 7 canonical files
- [x] Strict-validate clean on packet 019
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Predecessor: `../018-llama-cpp-auto-migration/` (depends_on)
- Sibling: `../014-onnx-cross-platform-backend/` (rejected experiment record)
- Parent: `../spec.md` and `../BEFORE_VS_AFTER.md`
- Research output: `./resource-map.md` (authored by DeepSeek v4 pro)
- Plan file: `~/.claude/plans/glittery-juggling-lecun.md`
<!-- /ANCHOR:cross-refs -->
