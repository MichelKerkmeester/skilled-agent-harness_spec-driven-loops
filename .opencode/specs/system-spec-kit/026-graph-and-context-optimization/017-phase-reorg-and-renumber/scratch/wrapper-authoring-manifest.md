# Wrapper Authoring Manifest — 026 wave-4 (for codex)

Author a compliant phase-parent `spec.md` for each of the 10 wrappers below.
Base every file on the template (READ IT FIRST):
`.opencode/skills/system-spec-kit/templates/manifest/phase-parent.spec.md.tmpl`

## HARD COMPLIANCE RULES (every spec.md)
- Frontmatter: `title` (format `Feature Specification: <Name> [<packet-pointer>/spec]`), `description` (1 line, root purpose, NO history), `trigger_phrases` (3), `importance_tier: "important"`, `contextType: "implementation"`, and a `_memory.continuity` block (packet_pointer = repo-relative path below; last_updated_at "2026-05-26T17:00:00Z"; last_updated_by "claude-opus-4-7"; recent_action "Authored during 026 wave-4 reorg"; next_safe_action; blockers []; key_files ["spec.md"]; completion_pct = the wrapper rollup % below; open_questions []; answered_questions []).
- Body markers: `<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->` and `<!-- SPECKIT_LEVEL: 2 -->`.
- Sections (anchored exactly as template): 1. METADATA, 2. PROBLEM & PURPOSE (+ the phase-parent note), 3. SCOPE (In/Out/Files-to-Change), PHASE DOCUMENTATION MAP (4-col: Phase | Folder | Focus | Status) + Phase Transition Rules + Phase Handoff Criteria, 4. OPEN QUESTIONS, RELATED DOCUMENTS.
- **FORBIDDEN tokens anywhere in spec.md** (validator PHASE_PARENT_CONTENT): `consolidat*`, `merged from`, `renamed from`, `collapsed`, `reorganization`, the arrow pattern `N→N`, `migrated from`, `ported from`, `originally in`. Describe CURRENT purpose + outcomes only — never how the folder came to be. (Migration history lives in the root context-index.md, not here.)
- Do NOT author plan.md/tasks.md/checklist.md/decision-record.md/implementation-summary.md — parent level is spec.md only.
- Status column vocabulary: `complete`, `in progress (NN%)`, `deferred`, `abandoned`.
- Write ONLY `<wrapper>/spec.md` for each. Do not touch child folders or any other file.

## WRAPPERS

### 000-release-and-program-cleanup  (rollup: complete)
Theme: Release readiness, system audits, cross-cutting cleanup, post-program follow-up, stress testing, and program-level adoption follow-ups. Final release gate for the 026 program.
| Folder | Focus | Status |
|--------|-------|--------|
| 001-release-readiness | Release-readiness deep-review + P1/P2 remediation train | complete |
| 002-audit | System audits: dependency/security/supply-chain, runtime-matrix validation | complete |
| 003-cross-cutting-cleanup-pass | Cross-cutting dead-code pruning + doc/runtime cleanup sweep | complete |
| 004-followup-post-program | Post-program follow-up items | complete |
| 005-stress-test | Stress-test cycles + pattern docs | complete |
| 006-research | Release-phase research spikes | complete |
| 007-clean-room-license-audit | Clean-room license audit for external-project adoption | deferred |
| 008-docs-and-catalogs-rollup | Docs + catalogs rollup for adoption uplift | deferred |

### 002-spec-kit-internals  (rollup: in progress)
Theme: Internal spec-kit + skill-system mechanics — resource-map/deep-loop plumbing, the skill-advisor system, the spec-folder template system, and spec-folder naming policy.
| Folder | Focus | Status |
|--------|-------|--------|
| 001-resource-map-deep-loop-fix | resource-map.md template + deep-loop artifact placement/auto-emit | complete |
| 002-skill-advisor | Skill-advisor system: graph, scoring engine, routing engine, hardening, docs | complete |
| 003-template-levels | Manifest-driven spec template system (research→design→implementation) | in progress (85%) |
| 004-literal-spec-folder-names | Concrete-token spec-folder/phase naming policy | deferred |

### 003-memory-and-causal-runtime  (rollup: in progress)
Theme: Memory continuity substrate, causal-graph channel routing, and embedding architecture — the spec-memory stack.
| Folder | Focus | Status |
|--------|-------|--------|
| 001-continuity-memory-runtime | Memory-quality, continuity gates, memory-save rewrite, runtime hardening, indexer invariants | complete |
| 002-causal-graph-channel-routing | Causal-graph channel routing MVP + deep-review remediation | in progress (85%) |
| 003-embedder-testing-and-architecture | Local-embedding foundation + per-surface stack testing + ollama/bge promotion + rerank-sidecar | in progress (75%) |

### 004-code-graph  (rollup: in progress)
Theme: Code-graph structural-indexing surface — package build-out, CocoIndex decoupling, startup fixes, and code-graph sub-themes. (Memory store ≠ code graph: cross-link to 003 in handoff criteria, do not imply a merge.)
| Folder | Focus | Status |
|--------|-------|--------|
| 001-mcp-shared-dependency-startup-fix | Fix @spec-kit/shared dependency declaration for mk_code_index MCP startup | complete |
| 002-deprecate-coco-index | Remove mcp-coco-index + rerank-sidecar; stand code-graph alone (structural-only) | in progress (95%) |
| 003-code-graph-workspace-root-fix | Fix workspace-root + socket-dir resolution for code-index MCP reconnection | complete |
| 010-runtime-and-scan | Code-graph runtime upgrades, scan scope/correctness, resolver/hooks, excludes | complete |
| 011-resilience-and-advisor | Advisor refinement, backend resilience research/impl, iteration-quality, doctor apply-mode | complete |
| 012-extraction-and-isolation | system-code-graph extraction, decision record, standalone-MCP pivot, three-way isolation | complete |
| 013-docs-and-readmes | Doctor diagnostic phase-a, READMEs, doc-drift alignment, cross-skill + reference-template polish | complete |
| 014-real-world-usefulness-test-planning | Real-world usefulness test planning (nested phase parent) | complete |
| 015-system-code-graph-uplift-phase-parent | system-code-graph uplift (nested phase parent) | complete |

### 005-graph-impact-and-affordance  (rollup: deferred — external-project adoption uplift, ~5%)
Theme: External-project adoption uplift — phase-DAG runner, edge-explanation/impact, advisor affordance evidence, memory causal-trust display. Mostly planned/deferred work.
| Folder | Focus | Status |
|--------|-------|--------|
| 001-code-graph-phase-runner | Code-graph phase runner + detect-changes | deferred |
| 002-edge-explanation-impact-uplift | Edge explanation + impact uplift | deferred |
| 003-skill-advisor-affordance-evidence | Skill-advisor affordance evidence display | deferred |
| 004-memory-causal-trust-display | Memory causal-trust display layer | deferred |
| 005-deep-review-findings | Deep-review findings for the adoption track | abandoned |
| 006-deep-research-review | Deep research/review spike for adoption | abandoned |

### 006-operator-tooling  (rollup: in progress)
Theme: Operator-facing tooling — runtime hook parity across runtimes, doctor command surface, and install-script/doctor realignment.
| Folder | Focus | Status |
|--------|-------|--------|
| 001-hook-parity | Runtime hook parity across Claude/Codex/Copilot/OpenCode (schema + wiring) | in progress (85%) |
| 002-doctor-update-orchestrator | Doctor command surface + dependency-safe rebuild orchestration | in progress (90%) |
| 003-install-scripts-doctor-realignment | Install guides/scripts + doctor realignment for post-CocoIndex world | deferred |

### 004-code-graph/010-runtime-and-scan  (rollup: complete) — sub-wrapper; parent ../spec.md = 004-code-graph
Theme: Code-graph runtime + scan correctness/scope track.
| Folder | Focus | Status |
|--------|-------|--------|
| 001-code-graph-runtime-upgrades | Runtime upgrades | complete |
| 002-fix-stale-highlights-and-scan-scope | Stale-highlights + scan-scope fix | complete |
| 003-resolver-and-hook-improvements | Resolver + hook improvements | complete |
| 004-end-user-scope-default-and-opt-in | End-user scope default + opt-in | complete |
| 005-broader-excludes-and-granular-skills | Broader excludes + granular skills | complete |

### 004-code-graph/011-resilience-and-advisor  (rollup: complete) — sub-wrapper
Theme: Code-graph resilience + advisor-integration track.
| Folder | Focus | Status |
|--------|-------|--------|
| 001-code-graph-advisor-refinement | Advisor refinement | complete |
| 002-code-graph-resilience-research | Resilience research | complete |
| 003-code-graph-backend-resilience-implementation | Backend resilience implementation | complete |
| 004-iteration-quality-meta-research | Iteration-quality meta research | complete |
| 005-doctor-apply-mode-implementation | Doctor apply-mode implementation | complete |

### 004-code-graph/012-extraction-and-isolation  (rollup: complete) — sub-wrapper
Theme: system-code-graph extraction + standalone-MCP isolation track.
| Folder | Focus | Status |
|--------|-------|--------|
| 001-system-code-graph-extraction | Extraction | complete |
| 002-extraction-design-and-decision-record | Extraction design + decision record | complete |
| 003-standalone-mcp-topology-pivot | Standalone-MCP topology pivot | complete |
| 004-three-way-isolation-finalize | Three-way isolation finalize | complete |

### 004-code-graph/013-docs-and-readmes  (rollup: complete) — sub-wrapper
Theme: Code-graph documentation + READMEs track.
| Folder | Focus | Status |
|--------|-------|--------|
| 001-doctor-diagnostic-command-phase-a | Doctor diagnostic command phase-a | complete |
| 002-system-code-graph-readmes-update | system-code-graph READMEs update | complete |
| 003-code-folder-readmes-poc | Code-folder READMEs PoC | complete |
| 004-doc-drift-alignment | Doc-drift alignment | complete |
| 005-cross-skill-doc-polish | Cross-skill doc polish | complete |
| 006-reference-template-alignment | Reference-template alignment | complete |

## packet_pointer values (repo-relative, for _memory.continuity)
Prefix each with `system-spec-kit/026-graph-and-context-optimization/`:
000-release-and-program-cleanup · 002-spec-kit-internals · 003-memory-and-causal-runtime ·
004-code-graph · 005-graph-impact-and-affordance · 006-operator-tooling ·
004-code-graph/010-runtime-and-scan · 004-code-graph/011-resilience-and-advisor ·
004-code-graph/012-extraction-and-isolation · 004-code-graph/013-docs-and-readmes

NOTE: 000-release-and-program-cleanup and 004-code-graph ALREADY have a stale spec.md from before the
reorg — OVERWRITE them with a fresh compliant spec.md per this manifest. The other 8 need new files.
For sub-wrappers, set METADATA "Parent Spec" to `../spec.md` and "Parent Packet" to `system-spec-kit/026-graph-and-context-optimization/004-code-graph`.
