---
title: "Feature Specification: Robust embedding-provider auto-resolution (ollama-first)"
description: "Research + fix so EMBEDDINGS_PROVIDER=auto reliably resolves the active local (ollama) embedder instead of silently degrading to an unhealthy hf-local fallback."
trigger_phrases:
  - "embedder provider auto resolution"
  - "embeddings provider auto cascade ollama"
  - "auto resolves hf-local not ollama"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/008-embedder-provider-auto-resolution"
    last_updated_at: "2026-05-27T12:21:59Z"
    last_updated_by: "main_agent"
    recent_action: "created-phase-008-research-into-auto-cascade-ollama-detection-failure"
    next_safe_action: "synthesize-gpt55-research-findings-into-research-md-then-plan-fix"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/shared/embeddings/factory.ts"
      - ".opencode/bin/mk-spec-memory-launcher.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000008"
      session_id: "embedder-auto-resolution-008"
      parent_session_id: null
    completion_pct: 30
    open_questions:
      - "Exact reason resolveActiveOllamaEmbedder() returns null at daemon startup"
      - "Most robust portable fix (DB-path injection vs package-root hardening)"
    answered_questions: []
---
# Feature Specification: Robust embedding-provider auto-resolution (ollama-first)

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | In Progress (research) |
| **Created** | 2026-05-27 |
| **Branch** | `main` |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
With `EMBEDDINGS_PROVIDER=auto` (the committed MCP-config default, documented as a local-first cascade `ollama → hf-local → openai → voyage`), the mk-spec-memory daemon silently resolves to **`hf-local`** — which is unhealthy on this host (no running backend) — instead of the active, working **`ollama`** embedder. ollama is up, has `nomic-embed-text:v1.5`, and owns the active vector shard `context-vectors__ollama__nomic-embed-text-v1.5__768`. The result: embeds fail, the retry queue flaps, and `auto` does not deliver the ollama-first behavior it advertises. The current interim mitigation is an explicit `EMBEDDINGS_PROVIDER=ollama` pin (phase-separate), which is non-portable.

### Purpose
Root-cause why `resolveProvider()` → `resolveActiveOllamaEmbedder()` returns null at daemon startup (so the cascade skips ollama), and determine the most robust, **portable** fix so `auto` reliably resolves the active local provider without hardcoding ollama — letting the interim pin be reverted.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Root-cause analysis of the `auto` cascade's ollama-detection failure (factory.ts resolution chain + launcher env/cwd context).
- A ranked, portable recommendation (DB-path injection, package-root hardening, config DB-dir, or active_embedder_provider persistence).
- Deep-research findings captured in `research/research.md`.

### Out of Scope
- Implementing the chosen fix (this packet researches + recommends; implementation is a follow-on `/speckit:plan` + `/speckit:implement`).
- The interim `EMBEDDINGS_PROVIDER=ollama` pin (applied separately).
- The success-vector-coverage hygiene (packet 007) and the reconcile tool (packet 006).

### Files to Change
| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `research/research.md` | Create | Deep-research findings: root cause + ranked portable fix |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Identify the exact root cause of the null ollama resolution at startup | Decisive `file:line` evidence in `research.md` explaining why `resolveActiveOllamaEmbedder()` returns null |
| REQ-002 | Produce a ranked, portable fix recommendation | `research.md` ranks the candidate fixes by robustness + portability with implementation sketch + verification |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Capture second-order risks | `research.md` notes the active-shard vs embed-provider mismatch and any other hazards |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A reviewer can read `research/research.md` and know precisely why `auto` chose hf-local, with verifiable code citations.
- **SC-002**: The recommended fix is portable (does not hardcode ollama; still cascades for hosts without ollama) and has a clear implementation + verification path.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Fix hardcodes ollama | Breaks portability for non-ollama hosts | Require the recommendation to preserve the cascade |
| Risk | Active-shard vs embed-provider mismatch | Re-embeds land in the wrong shard | Flag as a second-order finding; align provider with active shard |
| Dependency | factory.ts resolution chain | Fix must fit the existing cascade | Recommendation cites exact insertion points |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Does `resolveSpecKitPackageRoot()` resolve correctly when the daemon runs from `dist/context-server.js`, or does its cwd/module assumption miss `mcp_server/database`?
- Is the best portable fix the daemon passing its resolved DB path to the factory, or hardening the package-root/candidate resolution itself?

<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- Research packet: canonical findings live in research/research.md
-->
