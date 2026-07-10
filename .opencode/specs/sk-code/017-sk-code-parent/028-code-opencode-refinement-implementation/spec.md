---
title: "Feature Specification: Implement the code-opencode refinement backlog"
description: "Execute the Fable-5-validated refinement backlog for the sk-code code-opencode surface sub-skill: 24 P1 + 21 P2 + 7 P3 documentation/asset fixes across ~14 files in 7 sequenced phases, plus the sk-code-owned C1 validator retirement. code-opencode is this repo's playbook for writing code in its own .opencode/ tree; the research proved it teaches patterns that fail to compile, fabricates removed hook infrastructure, and misses the verify-doctrine reality. This packet makes the docs describe reality; underlying-code bugs C2-C8 are handed off to owning surfaces, not implemented here."
trigger_phrases:
  - "implement code-opencode refinement backlog"
  - "code-opencode refinement implementation"
  - "fix code-opencode findings"
importance_tier: "high"
contextType: "implementation"
parent: "sk-code/017-sk-code-parent"
_memory:
  continuity:
    packet_pointer: "sk-code/017-sk-code-parent/028-code-opencode-refinement-implementation"
    last_updated_at: "2026-07-08T20:00:00.000Z"
    last_updated_by: "claude-opus"
    recent_action: "All 7 phases implemented (GPT-5.5-fast), Sonnet-5-verified, and pushed as isolated scratch-index commits; parent-skill-check STRICT 0"
    next_safe_action: "Register 028 under the 017 parent once the memory daemon is healthy; file owner hand-offs C2/C4-C8 + Codex"
    blockers:
      - "028 registration under 017 needs generate-context.js (memory daemon), operator-gated"
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: Implement the code-opencode refinement backlog

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-08 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Source of truth** | `../027-code-opencode-refinement-research/research/final-synthesis.md` (Fable-5-validated) |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

`code-opencode` (`.opencode/skills/sk-code/code-opencode/`) is this repo's playbook for writing code in its own `.opencode/` tree. A 10-iteration GLM-5.2 deep-research, seeded by a Fable-5 council review and independently re-validated by a Fable-5 reviewer (88% spot-check accuracy), proved the packet **structurally sound but doctrinally drifted** across three failure classes: (1) **teaches patterns that break real work** — the TypeScript trio's import/emit examples fail to compile under the repo's own verified NodeNext + `verbatimModuleSyntax` + `"type":"module"` config; the authoring checklists predate the Option-E parent-hub architecture; `hooks.md` §4/§5 describe removed hook suites. (2) **missing coverage** of the verify reality (stale-dist trap, det-env test collisions, native-ABI rebuilds, daemon single-writer, comment-hygiene as a HARD-BLOCK gate). (3) ~10 **stale evidence pointers** from the v4 restructure + `system-spec-kit` relocation. Purpose: make code-opencode describe reality so an agent that follows it ships code that compiles, verifies correctly, and authors components the current way.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

**In scope:** the 52 validated code-opencode doc/asset refinements (24 P1 + 21 P2 + 7 P3), deduplicated by target file into 7 phases (`plan.md`); plus **C1** — retire/rewrite the always-failing `assets/scripts/verify_stack_folders.py` + the impossible playbook scenario DR-004 (both sk-code-owned).

**Out of scope (hand-offs, not implemented here):** underlying `.opencode` code bugs C2, C4, C5, C6, C7, C8 + the `.codex/agents/` README aspiration — filed as separate owner issues (per the review: never mix code bugs into doc PRs). Any edit to the migrating `deep-loop-workflows`/`system-deep-loop` tree (we re-verify path citations at edit time, prefer skill-relative wording, never touch the source). Re-running the research; sk-code parent-hub routing.

**Boundary:** `workflow_verify.md`/`workflow_implement.md` are in the shared tier (`sk-code/shared/references/`), symlinked into code-webflow too — additions MUST be labeled "OPENCODE reality" subsections so code-webflow doctrine is untouched.

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

The authoritative per-item backlog lives in `../027-.../research/final-synthesis.md` §B and is decomposed in `tasks.md`. By phase (see `plan.md`): (1) mechanical stale-pointer re-pathing sweep; (2) `hooks.md` rewrite + C3 docstring; (3) TypeScript trio import/emit + build-doctrine rewrite [#1 priority]; (4) verify-doctrine additions (OPENCODE-scoped); (5) four authoring-checklist rewrites (skill/agent/command/MCP; Option-E); (6) SKILL.md + config-genre split + detection markers; (7) validator retirement (C1) + `assets/scripts/` structural doc.

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- Every P1/P2/P3 item is implemented-with-evidence or deferred-with-reason (`checklist.md`).
- **Compile guarantee (Phase 3):** every TypeScript example is validated against a real compiling exemplar (`factory.ts`, `errors/core.ts`, `prompt-policy.ts`) — no example that fails `nodenext`/`verbatimModuleSyntax` remains.
- **Zero fabricated infrastructure:** no doc references a nonexistent path (symlink-aware check, not glob).
- `check-markdown-links` clean across edited files; `parent-skill-check` STRICT 0 on sk-code; vocab/router drift-guards green.
- Comment-hygiene HARD BLOCK respected in any touched script (durable WHY only).
- The 8 hand-off items (C2-C8 + Codex) filed to owners, not dropped.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Live migration (highest):** the repo is mid-`deep-loop-workflows→system-deep-loop` rename + a sk-code spec-folder renumber. Mitigation: isolate new paths; defer only the deep-loop path citations (Phase 5) + parent-registration; re-verify on edit day.
- **Shared-tier blast radius:** Phase 4 edits symlinked files — mitigation: additive, OPENCODE-labeled subsections only.
- **Correctness risk (Phase 3):** doc examples must actually compile — mitigation: validate each against a living exemplar.
- **Dependency:** the source-of-truth backlog is the sibling 027 packet's `final-synthesis.md`.

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

Docs-only change, low runtime risk. Each phase is one isolated scratch-index commit, blast-radius-gated. Comment-hygiene HARD BLOCK on any script. No new dependencies, no behavior change to shipped code (code bugs are hand-offs).

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- **Symlink masquerading as dead path:** `.claude/commands` is a live symlink → `.opencode/commands` (the one systematic research error, P2-40). Every "dead reference" claim is re-checked symlink-aware before removal.
- **Deep-loop path churn:** a cited deep-loop path may move mid-edit — land skill-relative wording if the rename is still churning.
- **C3 is a docstring, not a dead gate:** the live PostToolUse gate works (`settings.json:86` uses `python3`); only the hook's comment is stale.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

Level 2: multi-file (~14) doc reconciliation across 7 phases, ~52 items + C1. Low blast radius (docs), but Phase 3 and Phase 5 are substantive rewrites requiring care. Not Level 3 — no new architecture, no cross-service coordination beyond the documented hand-offs.

<!-- /ANCHOR:complexity -->
---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- Commit timing for the 027 research + this 028 packet vs. the live migration (operator to decide: commit-isolated-now / hold).
- Whether to execute Phase 3 immediately as the first implementation slice (recommended) or land the full plan first.

<!-- /ANCHOR:questions -->
---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- `../027-code-opencode-refinement-research/research/final-synthesis.md` — validated backlog + rec plan (source of truth).
- `../027-.../research/research.md` + `research/iterations/iteration-001..009.md` — evidence.
- `plan.md`, `tasks.md`, `checklist.md` — this packet's phased plan.

<!-- /ANCHOR:related-docs -->
