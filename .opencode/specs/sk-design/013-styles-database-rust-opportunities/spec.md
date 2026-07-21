---
title: "Research Charter: Rust opportunities for the sk-design styles database"
description: "Deep research into which NEW features, optimizations, automations, and integrations a Rust component could add or improve for the styles database — explicitly not a like-for-like rewrite."
trigger_phrases:
  - "styles database rust opportunities"
  - "rust features optimizations automations integrations styles"
  - "sk-design styles rust research"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "sk-design/013-styles-database-rust-opportunities"
    last_updated_at: "2026-07-20T07:07:01Z"
    last_updated_by: "spec-author"
    recent_action: "Author the Rust-opportunities research charter and launch the 20-iteration fanout"
    next_safe_action: "Let the cli-codex + cli-opencode lineages run to 10 iterations each, then synthesize"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/styles/_db/retrieval.mjs"
      - ".opencode/skills/sk-code/code-opencode/references/rust/style-guide/interop-model.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Research Charter: Rust opportunities for the sk-design styles database

<!-- ANCHOR:metadata -->
## 1. METADATA

- **Track:** sk-design
- **Packet:** 013-styles-database-rust-opportunities
- **Level:** 2 (research charter; deep-research loop populates `research/`)
- **Status:** In progress (research running)
- **Sibling precedent:** the Rust-backend-rewrite charters `system-speckit/029` + `030`, `system-code-graph/035`, `system-skill-advisor/017`, and the shipped standard `sk-code/018-rust-standards-for-code-opencode`.

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The styles database (`styles/_db/`, SQLite + FTS5 + rebuildable vector projection over ~1,290 style bundles) works, but the question is whether Rust could make it materially *better* — not whether to port it. **Grounding, do not re-litigate:** storage and FTS5 lexical search already run natively inside `node:sqlite`; the only JS-resident compute is a brute-force `cosine()` (`retrieval.mjs:218,246`), the weighted-RRF fusion `weight/(k+rank)` (`retrieval.mjs:259-266`), and a regex tokenizer (`retrieval.mjs:54`), over a small corpus that normal reads never walk, off by default behind the `legacy|shadow|persistent` adapter. By the repo's own when-to-use-Rust gates (JS-resident + materially costly + at scale, `sk-code/018`), a straight port of that math is **not** justified.

### Purpose

Find what Rust *unlocks* that JS cannot easily do — new capabilities, not a rewrite. A valid finding may be "not worth Rust" for a given idea.

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Feature, optimization, automation, and integration opportunities a Rust component could add/improve for the styles DB.
- Fit against the `sk-code/018` Rust standard (pure `core` crate + thin napi-rs/WASM/sidecar adapter; TS stays the shell with `legacy|shadow|persistent` selection + JS fallback; byte-for-byte parity vs a TS oracle).
- A ranked opportunity matrix + phased adoption path.

### Out of Scope

- Actually writing Rust code (a later packet, gated on this research).
- Porting already-native FTS5/SQLite work or the tiny cosine loop as-is.

### Files to Change

| File | Change |
|---|---|
| `research/research.md` | Synthesized converged findings (loop-produced). |
| `research/deep-research-state.jsonl`, `research/deltas/**` | Loop state (loop-produced). |

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance |
|---|---|---|
| REQ-001 | Opportunity matrix | A matrix classifying each idea as feature / optimization / automation / integration, with value, Rust-necessity, effort, and risk. |
| REQ-002 | Residency-honest | Every latency/perf claim respects the residency gate; no credit for already-native FTS5/SQLite work. |
| REQ-003 | Standard-fit | Each viable opportunity maps to the `sk-code/018` core-crate + thin-adapter model, with the TS fallback boundary preserved. |

### P1 - Required

| ID | Requirement | Acceptance |
|---|---|---|
| REQ-004 | Scale scenarios | Assess opportunities under 10× / 100× corpus growth (beyond ~1,290), e.g. ANN vector index (HNSW/IVF), in-DB vector extension. |
| REQ-005 | Automation/integration angle | Cover indexing/embedding automations and cross-skill integrations (shared search core across sk-design + code-graph + memory), not just query speed. |
| REQ-006 | Ranked recommendation | A ranked list with a phased adoption path and explicit "not worth Rust" calls where warranted. |

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- 20 iterations complete (cli-codex ×10 + cli-opencode ×10, concurrency 2, stop-policy max-iterations — no early convergence) [TESTED: fanout ledger].
- `research/research.md` delivers the opportunity matrix + ranked recommendation [VERIFIED: synthesis].

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Risk:** the loop rediscovers "the hot path is already native." Mitigated — that grounding is stated here and seeded into the research topic.
- **Dependency:** cli-codex + cli-opencode availability/auth; GPT-5.6-SOL access.

<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance

Research-only; no runtime change. Findings must quantify claimed wins against a real residency decomposition, not hand-waved "Rust is faster."

### Security

Any proposed Rust boundary must follow the `sk-code/018` safety discipline (`#![forbid(unsafe_code)]` in core, owned boundary DTOs, JS-controlled input never reaching `unwrap`/`panic`).

<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Does any opportunity clear the materiality gate at the current ~1,290-bundle scale, or only under growth?
- Is a shared cross-skill Rust search core worth the coordination cost vs a styles-DB-local one?

<!-- /ANCHOR:questions -->
