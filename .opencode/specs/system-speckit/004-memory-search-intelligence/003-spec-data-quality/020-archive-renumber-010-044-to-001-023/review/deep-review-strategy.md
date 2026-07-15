---
title: Deep Review Strategy Template
description: Runtime template copied to review/ during initialization to track review progress, dimension coverage, findings, and outcomes across iterations.
trigger_phrases:
  - "deep review strategy template"
  - "review dimension tracking"
  - "exhausted review approaches"
  - "review session tracking"
importance_tier: normal
contextType: planning
version: 1.11.0.13
---

# Deep Review Strategy - Session Tracking Template

Runtime template copied into the resolved `{artifact_dir}/` during initialization. Tracks review progress across iterations.

## 1. OVERVIEW

### Purpose

Serves as the "persistent brain" for a deep review session. Records which dimensions remain, what was found (P0/P1/P2), what review approaches worked or failed, and where to focus next. Read by the orchestrator and agents at every iteration.

### Usage

- **Init:** Orchestrator copies this template to `{artifact_dir}/deep-review-strategy.md` and populates Topic, Review Dimensions, Known Context, and Review Boundaries from config and memory context.
- **Per iteration:** Agent reads Next Focus, reviews the assigned dimension/files, updates findings, marks dimensions complete, and sets new Next Focus.
- **Mutability:** Mutable, updated by both orchestrator and agents throughout the session.
- **Protection:** None (shared mutable state). Orchestrator validates consistency on resume.
- **Ownership:** Machine-managed metrics and coverage blocks are wrapped in explicit ownership markers. Human commentary and operator overrides live outside those markers.

---

## 2. TOPIC
Review: `.opencode/specs/system-speckit/004-memory-search-intelligence/002-spec-data-quality/054-archive-renumber-010-044-to-001-023` — the z_archive renumbering (010-044 → 001-023) + full-depth metadata/cross-reference optimization packet, including its post-completion audit fix (TOP_MAP key/value overlap bug across 8 subtrees, since re-verified with 0 remaining mismatches).

---

## 3. REVIEW DIMENSIONS (remaining)
<!-- MACHINE-OWNED: START -->
- [x] D1 Correctness, Logic errors, off-by-one, wrong return types, broken invariants
- [x] D2 Security, Injection, auth bypass, secrets exposure, unsafe deserialization
- [x] D3 Traceability, Spec/code alignment, checklist evidence, cross-reference integrity
- [x] D4 Maintainability, Patterns, clarity, documentation quality, safe follow-on change cost
<!-- MACHINE-OWNED: END -->

---

## 4. NON-GOALS
Not reviewing: the live `system-deep-loop/` tree (029-045, 051-053) except to confirm it was NOT touched; `.opencode/specs/descriptions.json` regeneration (explicitly deferred, out of scope by design); the SQLite/vector daemon reindex (explicitly deferred). Not re-litigating the renumbering mapping decision itself (010→001 etc.) — reviewing whether the EXECUTION of that decision is correct and complete.

---

## 5. STOP CONDITIONS
`stopPolicy = max-iterations`: convergence signals are telemetry-only until iteration 5. The loop runs the full 5 iterations regardless of early convergence; only the hard `maxIterationsReached` stop at iteration 5 is legal.

---

## 6. COMPLETED DIMENSIONS
<!-- MACHINE-OWNED: START -->
| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|
| Inventory | CONDITIONAL | 1 | Artifact map built. Structural renumbering, root children_ids, graph identity fields, and command contracts passed; 7 stale description.json parentChain entries found. |
| Correctness | CONDITIONAL | 2 | Exact old-number+slug scan confirmed exactly 7 stale description.json parentChain records; graph parent fields, identity fields, folder layout, and mapping logic passed. |
| Security | PASS | 3 | No new injection, secret exposure, unsafe execution, executable metadata payload, or permission/scope security issue found; descriptions.json attribution limit carried to traceability. |
| Traceability | PASS | 4 | No new findings. REQ-004/checklist wording was refined: narrow `packet_id`/`spec_folder`/`specFolder` and `children_ids` claims remain supported, while existing P1-001 remains a broader `parentChain` self-reference gap. Overlay protocols marked notApplicable. |
| Maintainability | PASS | 5 | No new findings. P1-001 remediation is low-risk and narrow; implementation-summary scope is clear enough to avoid a separate P2; renumbering lessons are packet-local and should be promoted during synthesis/process follow-up. |
<!-- MACHINE-OWNED: END -->

---

## 7. RUNNING FINDINGS
<!-- MACHINE-OWNED: START -->
- **P0 (Critical):** 0 active
- **P1 (Major):** 1 active
- **P2 (Minor):** 0 active
- **Delta this iteration:** +0 P0, +0 P1, +0 P2 (maintainability pass found no new findings; existing P1-001 remains open)

[Findings are tracked in `deep-review-findings-registry.json`. This section provides a running count summary updated after each iteration.]
<!-- MACHINE-OWNED: END -->

---

## 8. WHAT WORKED
- Exhaustive, field-specific metadata checks were more useful than sampling: `packet_id`/`spec_folder`/`specFolder` and `children_ids` passed, while `description.json.parentChain` exposed a narrower remaining integrity gap.
- Contract drift can be checked cheaply by comparing compiled source digests and invoking `check-contract-drift.cjs` directly.
- Exact old-number+slug matching is required for archive-reference checks because bare numbers false-positive on valid new numbers in the overlapping `001-023` / `010-044` ranges.

---

## 9. WHAT FAILED
- Treating `description.json.specId` as a full path would over-report every file; current evidence indicates it is a short local sequence ID. Parent-chain ancestry is the actionable integrity field.
- A number-only stale-reference scan is invalid for this packet: it over-reports current folders such as `010-deep-context-gathering`, `012-deep-improvement-guarded-refine-hardening`, `021-skill-readme-standardization`, `022-multi-ai-council-write-protocol`, and `023-sk-deep-research-evolution` because those new numbers overlap old mapping keys with different slugs.

---

## 10. EXHAUSTED APPROACHES (do not retry)
[Populated when a review approach has been tried from multiple angles without yielding new findings]

---

## 11. RULED OUT DIRECTIONS
- Root `z_archive/graph-metadata.json.children_ids`: exact 23 current child paths, no duplicates/missing/extra entries.
- `graph-metadata.json` identity fields: 0 `packet_id`/`spec_folder` mismatches across 235 files.
- `description.json.specFolder`: 0 mismatches across 235 files.
- Command contracts: three presentation source digests match compiled contracts; drift checker returned no failures/warnings.
- `description.json.parentChain` scope: exactly 7 stale records under `006-deep-skill-evolution`, not more, when scanned by exact old-number+slug segment.
- `graph-metadata.json` parent/ancestry fields: 0 stale old-number+slug segments across 235 files.
- Current identity fields: 0 mismatches for `description.json.specFolder` and `graph-metadata.json.packet_id`/`spec_folder` across 235 files each.
- Mapping logic: all 23 top-level archive folders and all 8 `006-deep-skill-evolution` child folders match the spec table; no orphan or miscounted folder found.

---

## 12. NEXT FOCUS
<!-- MACHINE-OWNED: START -->
None - final iteration. Overall packet verdict is CONDITIONAL because 0 P0 and exactly 1 P1 remain open.
<!-- MACHINE-OWNED: END -->

---

## 13. KNOWN CONTEXT
No prior review session exists for this packet (fresh lineage, `context_loading` returned no prior review context — this is the first `/deep:review` run against `054-archive-renumber-010-044-to-001-023`).

### Bounded Context Snapshot

- **Target pointers:** `.opencode/specs/system-deep-loop/z_archive/` (23 top-level folders `001-023`, 234 nested spec-folders, `graph-metadata.json` container); the 054 packet's own `spec.md`/`plan.md`/`tasks.md`/`checklist.md`/`implementation-summary.md`; 3 live command-asset files (`deep_{ai-council,research,review}_presentation.txt`) and their 3 compiled contracts; `check-contract-drift.vitest.ts`.
- **Behavior claims:** REQ-001..REQ-010 in spec.md (exact renumbering mapping, no live-tree touch, metadata regeneration correctness, `children_ids` correctness, cross-reference fix completeness, `descriptions.json` untouched, delta-based validate.sh verification). Post-completion-audit section in implementation-summary.md claims 0 remaining `packet_id`/`spec_folder`/`specFolder` mismatches and 0 dangling `children_ids` entries after the TOP_MAP-overlap-bug fix — this specific claim is the highest-value thing to independently re-verify, not just trust.
- **Reuse and conventions:** `generate-description.js` + `backfill-graph-metadata.js` derive identity fields fresh from the live disk path (idempotent); single-pass regex-callback substitution (not chained sed) is this session's established anti-corruption pattern for mapping-table substitutions.
- **Review risks and gaps:** the packet's own limitations section documents a lost pre-rename `validate.sh` baseline (timing race) and pre-existing document-era drift that is out of scope — do not flag either as new findings without re-confirming they're pre-existing.

Do not inline full source bodies. Do not dispatch the retired standalone context loop. Use this snapshot only to seed review dimensions and final traceability.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | partial | 4 | Structural mapping, graph identity, graph parent fields, and REQ-004's narrow named fields pass; exactly 7 description.json parentChain mismatches remain as a broader identity-metadata gap. |
| `checklist_evidence` | core | partial | 4 | CHK-P0-001 overclaims all self-references because parentChain remains stale; CHK-P0-004 and the narrower post-audit identity/children_ids claims remain supported. |
| `security_scope` | core | pass | 3 | No injection, secret exposure, unsafe execution, or executable metadata payload found; descriptions.json dirty-state attribution remains a traceability follow-up, not a security finding. |
| `skill_agent` | overlay | notApplicable | 4 | No skill or agent definition files were changed by this spec-folder-only packet. |
| `agent_cross_runtime` | overlay | notApplicable | 4 | No runtime agent contract or cross-runtime agent surface was changed. |
| `feature_catalog_code` | overlay | notApplicable | 4 | No feature catalog inventory or code mapping files were in scope. |
| `playbook_capability` | overlay | notApplicable | 4 | No playbook capability contract was edited; sampled playbook evidence is a frozen fixture. |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| `054-archive-renumber-010-044-to-001-023/spec.md` | correctness, security, traceability | 4 | - | reviewed |
| `054-archive-renumber-010-044-to-001-023/plan.md` | security | 3 | - | reviewed |
| `054-archive-renumber-010-044-to-001-023/tasks.md` | - | - | - | pending |
| `054-archive-renumber-010-044-to-001-023/checklist.md` | correctness, security, traceability | 4 | P1-001 active | reviewed |
| `054-archive-renumber-010-044-to-001-023/implementation-summary.md` | correctness, security, traceability | 4 | P1-001 active | reviewed |
| `system-deep-loop/z_archive/graph-metadata.json` | correctness, security | 3 | - | reviewed |
| `system-deep-loop/z_archive/description.json` | correctness | 2 | - | reviewed |
| `system-deep-loop/z_archive/{001-023}-*` (234 nested spec-folders) | correctness, security-sample | 3 | P1-001 active | reviewed |
| `system-deep-loop/z_archive/006-deep-skill-evolution/{001-008}-*` | correctness, security-sample | 3 | P1-001 active | reviewed |
| `.opencode/commands/deep/assets/deep_{ai-council,research,review}_presentation.txt` | traceability | 4 | - | reviewed via compiled contract sourceDigests |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 5
- Convergence threshold: 0.10 (telemetry-only; stopPolicy=max-iterations)
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=2026-07-08T14:06:02.000Z, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Executor: cli-opencode, model=openai/gpt-5.5-fast, reasoningEffort=high
- Started: 2026-07-08T14:06:02.000Z
<!-- MACHINE-OWNED: END -->

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->

<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability

<!-- /ANCHOR:completed-dimensions -->

<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 2
- P2 (Suggestions): 0
- Resolved: 0

<!-- /ANCHOR:running-findings -->

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### `agent_cross_runtime`: Not evaluated in this inventory iteration. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `agent_cross_runtime`: Not evaluated in this inventory iteration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `agent_cross_runtime`: Not evaluated in this inventory iteration.

### `checklist_evidence`: Partial. CHK-P0-001 at `checklist.md:78` remains too broad because `parentChain` still contains stale ancestry in 7 files. The narrower post-audit identity claims at `implementation-summary.md:99` and `implementation-summary.md:137` were independently re-verified for `packet_id`/`spec_folder`/`specFolder` with 0 mismatches. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `checklist_evidence`: Partial. CHK-P0-001 at `checklist.md:78` remains too broad because `parentChain` still contains stale ancestry in 7 files. The narrower post-audit identity claims at `implementation-summary.md:99` and `implementation-summary.md:137` were independently re-verified for `packet_id`/`spec_folder`/`specFolder` with 0 mismatches.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: Partial. CHK-P0-001 at `checklist.md:78` remains too broad because `parentChain` still contains stale ancestry in 7 files. The narrower post-audit identity claims at `implementation-summary.md:99` and `implementation-summary.md:137` were independently re-verified for `packet_id`/`spec_folder`/`specFolder` with 0 mismatches.

### `checklist_evidence`: Partial. CHK-P0-001 is contradicted for the `parentChain` slice of identity metadata, though the narrower fields named in the implementation-summary post-audit (`packet_id`, `spec_folder`, `specFolder`, `children_ids`) pass. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `checklist_evidence`: Partial. CHK-P0-001 is contradicted for the `parentChain` slice of identity metadata, though the narrower fields named in the implementation-summary post-audit (`packet_id`, `spec_folder`, `specFolder`, `children_ids`) pass.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: Partial. CHK-P0-001 is contradicted for the `parentChain` slice of identity metadata, though the narrower fields named in the implementation-summary post-audit (`packet_id`, `spec_folder`, `specFolder`, `children_ids`) pass.

### `feature_catalog_code`: Not evaluated in this inventory iteration. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `feature_catalog_code`: Not evaluated in this inventory iteration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code`: Not evaluated in this inventory iteration.

### `graph-metadata ancestry`: Pass for this bug class. All 235 `graph-metadata.json` files have parent-like fields, and the exact old-segment scan found 0 stale `parent_id` or related parent/ancestry/chain fields. Representative reads show current `packet_id`, `spec_folder`, and `parent_id` at `.opencode/specs/system-deep-loop/z_archive/005-deep-multi-ai-council-skill/001-deep-ai-council-skill-creation/graph-metadata.json:3-5` and `.opencode/specs/system-deep-loop/z_archive/014-agent-deep-review-optimization/graph-metadata.json:3-5`. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `graph-metadata ancestry`: Pass for this bug class. All 235 `graph-metadata.json` files have parent-like fields, and the exact old-segment scan found 0 stale `parent_id` or related parent/ancestry/chain fields. Representative reads show current `packet_id`, `spec_folder`, and `parent_id` at `.opencode/specs/system-deep-loop/z_archive/005-deep-multi-ai-council-skill/001-deep-ai-council-skill-creation/graph-metadata.json:3-5` and `.opencode/specs/system-deep-loop/z_archive/014-agent-deep-review-optimization/graph-metadata.json:3-5`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `graph-metadata ancestry`: Pass for this bug class. All 235 `graph-metadata.json` files have parent-like fields, and the exact old-segment scan found 0 stale `parent_id` or related parent/ancestry/chain fields. Representative reads show current `packet_id`, `spec_folder`, and `parent_id` at `.opencode/specs/system-deep-loop/z_archive/005-deep-multi-ai-council-skill/001-deep-ai-council-skill-creation/graph-metadata.json:3-5` and `.opencode/specs/system-deep-loop/z_archive/014-agent-deep-review-optimization/graph-metadata.json:3-5`.

### `identity field sample`: Pass. A fresh sample spanning `001`, `005`, `006`, `014`, and `023` subtrees matched current paths; the exhaustive scan found 0 mismatches for `description.json.specFolder` and `graph-metadata.json.packet_id`/`spec_folder`. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `identity field sample`: Pass. A fresh sample spanning `001`, `005`, `006`, `014`, and `023` subtrees matched current paths; the exhaustive scan found 0 mismatches for `description.json.specFolder` and `graph-metadata.json.packet_id`/`spec_folder`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `identity field sample`: Pass. A fresh sample spanning `001`, `005`, `006`, `014`, and `023` subtrees matched current paths; the exhaustive scan found 0 mismatches for `description.json.specFolder` and `graph-metadata.json.packet_id`/`spec_folder`.

### `mapping logic`: Pass. Every current top-level archive directory aligns with the ordered REQ-001 mapping (`010→001`, `012→002`, ..., `044→023`), and every DSE child aligns with REQ-002 (`000→001`, ..., `007→008`). No orphan or miscounted folder was found. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `mapping logic`: Pass. Every current top-level archive directory aligns with the ordered REQ-001 mapping (`010→001`, `012→002`, ..., `044→023`), and every DSE child aligns with REQ-002 (`000→001`, ..., `007→008`). No orphan or miscounted folder was found.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `mapping logic`: Pass. Every current top-level archive directory aligns with the ordered REQ-001 mapping (`010→001`, `012→002`, ..., `044→023`), and every DSE child aligns with REQ-002 (`000→001`, ..., `007→008`). No orphan or miscounted folder was found.

### `playbook_capability`: Not evaluated in this inventory iteration. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `playbook_capability`: Not evaluated in this inventory iteration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `playbook_capability`: Not evaluated in this inventory iteration.

### `skill_agent`: Not evaluated in this inventory iteration. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `skill_agent`: Not evaluated in this inventory iteration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `skill_agent`: Not evaluated in this inventory iteration.

### `spec_code`: Partial. REQ-001 and REQ-002 structural layout still pass: the top-level archive directories are exactly `001`-`023`, and `006-deep-skill-evolution` children are exactly `001`-`008`. REQ-004 remains partially contradicted for the `description.json.parentChain` slice only. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `spec_code`: Partial. REQ-001 and REQ-002 structural layout still pass: the top-level archive directories are exactly `001`-`023`, and `006-deep-skill-evolution` children are exactly `001`-`008`. REQ-004 remains partially contradicted for the `description.json.parentChain` slice only.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: Partial. REQ-001 and REQ-002 structural layout still pass: the top-level archive directories are exactly `001`-`023`, and `006-deep-skill-evolution` children are exactly `001`-`008`. REQ-004 remains partially contradicted for the `description.json.parentChain` slice only.

### `spec_code`: Partial. Structural claims passed for top-level folder count (`001`-`023`), nested `006-deep-skill-evolution` children (`001`-`008`), root `z_archive/graph-metadata.json.children_ids`, graph identity fields, and command contract digest alignment. The `description.json.parentChain` check failed for 7 records. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `spec_code`: Partial. Structural claims passed for top-level folder count (`001`-`023`), nested `006-deep-skill-evolution` children (`001`-`008`), root `z_archive/graph-metadata.json.children_ids`, graph identity fields, and command contract digest alignment. The `description.json.parentChain` check failed for 7 records.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: Partial. Structural claims passed for top-level folder count (`001`-`023`), nested `006-deep-skill-evolution` children (`001`-`008`), root `z_archive/graph-metadata.json.children_ids`, graph identity fields, and command contract digest alignment. The `description.json.parentChain` check failed for 7 records.

<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All dimensions covered]

<!-- /ANCHOR:next-focus -->
