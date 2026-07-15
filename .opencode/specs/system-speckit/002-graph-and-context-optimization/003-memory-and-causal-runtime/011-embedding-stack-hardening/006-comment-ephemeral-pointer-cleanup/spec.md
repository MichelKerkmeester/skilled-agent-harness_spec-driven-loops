---
title: "Feature Specification: Comment ephemeral-artifact pointer cleanup"
description: "Strip sk-code-forbidden ephemeral-artifact pointers (spec folder/number, T###/CHK-###/REQ-###, ADR ids, review-finding ids, tickets) from code comments across the embedding-stack program and adjacent system-spec-kit modules, keeping the durable WHY."
trigger_phrases:
  - "comment ephemeral pointer cleanup"
  - "remove spec folder refs from code comments"
  - "sk-code no ephemeral-artifact pointers fix"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/011-embedding-stack-hardening/006-comment-ephemeral-pointer-cleanup"
    last_updated_at: "2026-05-29T19:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored Level-1 spec for the ephemeral-artifact comment cleanup"
    next_safe_action: "Apply comment-only edits across the in-scope file set, then verify + reconcile"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts"
      - ".opencode/bin/mk-code-index-launcher.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000003161"
      session_id: "031-006-spec"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Scope: full sweep across system-spec-kit source + bin launchers (user decision)."
      - "Documentation: folded into 031 as phase child 006 (user decision)."
      - "Extras: include the code-graph launcher + the 2 non-comment description/report strings (user decision)."
---
# Feature Specification: Comment ephemeral-artifact pointer cleanup

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | In Progress |
| **Created** | 2026-05-29 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | Cleanup follow-on (after 001–005 + the 20-iteration deep review) |
| **Predecessor** | 005-live-validation-bench-hardening |
| **Successor** | None |
| **Handoff Criteria** | Re-running the ephemeral-pointer audit over the in-scope files returns only allowed/structural/false-positive matches; builds + `node --check` + `validate.sh --strict` pass; diff is comment-only (zero logic change). |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The sk-code canonical rule `code_style_guide.md` §4 "No ephemeral-artifact pointers" forbids code comments from embedding a spec folder/number, a packet/phase/task/checklist/requirement id (`T###`, `CHK-###`, `REQ-###`), a feature-catalog entry, an ADR id, a review-finding id, or a ticket id. The embedding-stack hardening program (and several older system-spec-kit modules) introduced ~40 such pointers across ~27 files — e.g. `// WS-1 (031/review): …`, `// Spec 126: …`, `// Per DR-004`. When a packet is renamed, renumbered, or archived, each becomes a dangling pointer that sends the next reader chasing a dead reference.

### Purpose
Remove the perishable pointers from the affected comments while preserving the durable WHY (the constraint, invariant, or decision the comment actually explains), so the comments survive any artifact-lifecycle change and the codebase comes back into compliance with sk-code §4.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Strip ephemeral-artifact pointers from comments in system-spec-kit source (`mcp_server/`, `shared/`, `scripts/`), the shared `.opencode/bin` launchers, and — per explicit owner authorization — `mk-code-index-launcher.cjs`.
- Two non-comment cases with the same rot risk: a `CHK-160` in a tool-schema description string and a `Phase 005` literal in a generated benchmark report.
- Every edit keeps the durable WHY; only the perishable label is dropped.

### Out of Scope
- **Logic changes** — the diff is comment/string text only.
- **False positives** — HTTP status codes (`401/403`), embedding dims (`256/512/1024`), token-budget tiers (`1500/2500`), rolling-window sizes (`200-decision`), schema-version tags (`V16:`).
- **Allowed structural cases** — runtime paths the code reads (`.opencode/specs/` default-root constants), JSDoc `@example` / parser format illustrations (`"019-system-hardening"`, `specs/001-demo`).
- **Markdown / spec docs** — these legitimately reference packet ids.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| mcp_server/lib/search/vector-index-store.ts | Modify | Drop `WS-1`, `031/review`, `026/004/012` from 3 WAL-durability comments |
| mcp_server/context-server.ts | Modify | Drop `026/007/011`, `026/007/009` review-finding tags (2) |
| mcp_server/lib/embedders/reindex.ts | Modify | Drop `031/review`, `026/004/012` from 2 WAL comments |
| shared/embeddings/registry.ts | Modify | Drop `031/005` from the reranker-removal note |
| shared/embeddings/factory.ts | Modify | Drop spec-folder names + `ADR-014` (2) |
| shared/embeddings/providers/hf-local.ts | Modify | Drop spec-folder names from the prefix-registry header |
| mcp_server/scripts/bench-dtype-q8-fp16.cjs | Modify | Drop `031/005`, `REQ-006` (2) |
| mcp_server/lib/embedders/embedding-reconcile.ts | Modify | Drop acceptance-contract folder + iteration pointers (2) |
| shared/types.ts | Modify | Drop `REC-010` / `Spec 103` |
| mcp_server/lib/storage/document-helpers.ts | Modify | Drop `Spec 126` |
| mcp_server/lib/parsing/memory-parser.ts | Modify | Drop `Spec 126` |
| mcp_server/lib/storage/lineage-state.ts | Modify | Drop `T070-3` |
| scripts/core/quality-scorer.ts | Modify | Drop `Per DR-004` |
| mcp_server/api/index.ts | Modify | Drop `review-report.md P2-MNT-02` pointer |
| mcp_server/lib/validation/preflight.ts | Modify | Drop `010-index-large-files` prefix |
| mcp_server/lib/feedback/query-flow-tracker.ts | Modify | Drop the `Spec: …` header pointer |
| scripts/core/config.ts | Modify | Drop `(010-perfect-session-capturing)` |
| mcp_server/lib/search/vector-index-schema.ts | Modify | Drop `(010-index-large-files)`, keep `V16:` |
| mcp_server/lib/enrichment/retry-budget.ts | Modify | Drop `C4 (iter 5)` |
| scripts/lib/trigger-phrase-sanitizer.ts | Modify | Drop iteration-doc authority pointer |
| mcp_server/tool-schemas.ts | Modify | Drop `(CHK-160)` description string + the `@see decision-record.md` comment |
| mcp_server/lib/context/shared-payload.ts | Modify | Drop the `@see …/research.md` pointer |
| bin/mk-spec-memory-launcher.cjs | Modify | Drop rename pointer, `016/006/009`, `REQ-007`, `REQ-011` (4) |
| bin/mk-skill-advisor-launcher.cjs | Modify | Drop `008-REQ-001/002`, `REQ-011`, deep-review iter pointer (4) |
| bin/lib/launcher-ipc-bridge.cjs | Modify | Drop `031/005`, `026/007/011` (2) |
| bin/mk-code-index-launcher.cjs | Modify | Drop `DR-*`, `REQ-011`, `016/006/009`, packet pointer (~12) — owner-authorized |
| mcp_server/benchmarks/benchmark-2026-05-20-rerank-ab/scripts/generate_report.py | Modify | Drop `Phase 005` from generated report output |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every flagged comment keeps its durable WHY, drops only the ephemeral id | Re-audit grep returns no forbidden pointer on a touched line; the explanatory text remains |
| REQ-002 | Zero logic changes | `git diff` shows only comment/docstring/description-string text; no executable tokens altered |
| REQ-003 | Builds and syntax pass after edits | `npm run build --workspace=@spec-kit/{shared,mcp-server}` clean; `node --check` clean on every `.cjs`; `python3 -m py_compile` clean on the report script |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | False positives and allowed structural cases untouched | HTTP codes, dims, token tiers, runtime-path constants, and JSDoc format examples are unchanged in the diff |
| REQ-005 | Safe commit under the shared-tree hazard | `git reset` then explicit pathspecs; `git diff --cached` and `git show HEAD --name-only` verified to contain only in-scope files |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Re-running the ephemeral-pointer audit over the in-scope files yields only allowed/structural/false-positive matches.
- **SC-002**: Builds, `node --check`, and `validate.sh --strict` on this packet all pass; the working tree diff is comment/string-only.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Cross-session collision on `mk-code-index-launcher.cjs` (adjacent code-graph session) | Concurrent edits clobber each other | Comment-only edits; `node --check`; owner explicitly authorized inclusion |
| Risk | Daemon index-staging hazard pre-stages other agents' files | Wrong files committed | `git reset` + explicit pathspecs; verify `git diff --cached` and `git show HEAD --name-only` |
| Risk | Over-reach into false positives / allowed cases | Loses durable info (e.g. HTTP codes) | Pre-classified allowed-vs-forbidden set; each edit reviewed against sk-code §4 table |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None — scope, documentation home, and the optional extras were resolved with the user before implementation.

<!-- /ANCHOR:questions -->
