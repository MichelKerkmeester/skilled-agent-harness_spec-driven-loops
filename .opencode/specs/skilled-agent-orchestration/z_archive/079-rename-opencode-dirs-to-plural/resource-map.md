---
title: "Resource Map: 096 - opencode plural-rename + post-rename review/remediation cycle (umbrella)"
description: "Umbrella resource map for 8 phases: 1 rename + 3 deep-reviews + 3 remediations + 1 cli-opencode executor add. Aggregates surface inventories, finding clusters, and cross-phase dependencies."
trigger_phrases:
  - "096 resource map"
  - "rename and review cycle resources"
importance_tier: "high"
contextType: "infrastructure-quality"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural"
    last_updated_at: "2026-05-08T01:30:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored umbrella resource map"
    next_safe_action: "Phase complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-4-7-2026-05-08"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Resource Map: 096 — opencode plural-rename + post-rename review/remediation cycle

This map indexes all 8 phases of the cycle, the surfaces each touched, the findings each surfaced, and the cross-phase dependencies. For per-phase detail, see each phase's own `spec.md` / `implementation-summary.md` / phase-local `resource-map.md` (Phase 001 has a dedicated detailed map).

---

## 1. PHASE INVENTORY

| Phase | Title | Type | Sub-phases | Status | LOC / file impact |
|-------|-------|------|-----------:|--------|-------------------|
| **001** | rename-opencode-dirs-to-plural | feature | 4 (skills/agents/commands/symlinks) | ✓ complete | ~11,348 files / ~670,000 occurrences |
| **002** | track-review (deep-review #1) | review | 0 (flat) | ✓ complete | 10 iter md, 22 findings catalogued |
| **003** | 097-remediation | remediation | 7 (per finding cluster) | ✓ complete | ~50 file edits + 7 sub-phase docs |
| **004** | track-rereview (deep-review #2) | review | 0 (flat) | ✓ complete | 10 iter md, 19 findings catalogued |
| **005** | 099-remediation | remediation | 0 (flat Level 2) | ✓ complete | ~25 file edits incl. reducer fix |
| **006** | cli-opencode-executor | feature | 0 (flat Level 2) | ✓ complete | 1 TS edit + 4 YAML branch inserts |
| **007** | track-rereview-2 (deep-review #3) | review | 0 (flat) | ✓ complete | 8 iter md, 6 findings catalogued |
| **008** | 101-remediation | remediation | 0 (flat Level 2) | ✓ complete | 5 fixes (1 TS + 4 YAML edits + tests) |

---

## 2. CROSS-PHASE DEPENDENCIES

```
001 (rename)
  └─► 002 (deep-review #1) audits 001
      └─► 003 (remediation) resolves 002's 22 findings
          └─► 004 (deep-review #2) audits 001+002+003
              └─► 005 (remediation) resolves 004's 13 findings
                  └─► 006 (cli-opencode-executor) feature add
                      └─► 007 (deep-review #3) audits 001-006
                          └─► 008 (remediation) resolves 007's 5 findings
```

Each remediation depends on the immediately-preceding deep-review's findings catalog. Each deep-review widens its scope to include all prior phases.

---

## 3. SURFACE INDEX (cumulative across phases)

### Source code surfaces touched

| Surface | Phases that touched | Notes |
|---------|---------------------|-------|
| `mcp_server/dist/**` | 001, 003 (002 audit), 005, 006, 008 | Rebuilt repeatedly; gitignored |
| `mcp_server/lib/deep-loop/executor-config.ts` | 006, 008 | EXECUTOR_KINDS extension + cli-opencode field policy |
| `mcp_server/handlers/skill-graph/scan.ts` | 005 | Source default singular → plural (P1-015) |
| `mcp_server/skill_advisor/lib/scorer/aliases.ts` | 005 | deep-review/deep-research aliases (P1-025) |
| `mcp_server/skill_advisor/lib/scorer/lanes/explicit.ts` | 008 | cli-opencode disambiguation regex (P2-027r) |
| `mcp_server/skill_advisor/lib/freshness/generation.ts` | 005 | Advisor state path plural (P1-003) |
| `mcp_server/skill_advisor/scripts/skill_advisor.py` | 003, 005 | Native bridge constants plural |
| `mcp_server/hooks/claude/session-stop.ts` | 003 | Test-only-gated env override (P1-006) |
| `shared/review-research-paths.cjs` | 005 | Shell-metachar guard for spec_folder (P1-019) |
| `commands/doctor/scripts/audit_descriptions.py` | 003, 005 | Plural roots + zero-inventory failure |
| `scripts/spec/check-smart-router.sh` | 005 | SKILL_ROOT plural + sibling fallback (P1-013, P1-021) |
| `scripts/dist/**` | 005 | Rebuilt for source/dist parity (P1-016) |
| `commands/speckit/assets/speckit_deep-{review,research}_{auto,confirm}.yaml` | 005, 006, 008 | Token replace + cli-opencode branch + --pure |
| `agents/{orchestrate,deep-review,deep-research}.md` | 005 | sk-deep-* token replacement |
| `agents/review.toml` (codex mirror) | 005 | P1-blocking doctrine alignment (P1-009) |
| `skills/{sk-code-review,sk-git}/SKILL.md` | 005 | Manual Testing Playbook citations (P1-018) |
| `skills/deep-review/scripts/reduce-state.cjs` | 005 | Reducer findings-from-deltas extraction (P1-026) |

### Spec-doc surfaces

| Surface | Phases | Notes |
|---------|--------|-------|
| Adjacent packets 093-094-095 checklists | 005 | Bulk `[x]` mark for P1-007 |
| 096/001 (rename) sub-phase narratives | 005 | Tautology repair (P1-010) |
| 096/001/004 (symlinks) spec.md anchors | 005 | Anchor pair repair (P1-022) |
| 095 implementation-summary | 005 | CR-016/017/018 PASS reconciliation (P1-017) |

### Tests touched

| Surface | Phases | Notes |
|---------|--------|-------|
| `mcp_server/tests/deep-loop/executor-config.vitest.ts` | 006 (initial), 008 (cli-opencode tests) | 21 → 25 tests |
| `mcp_server/skill_advisor/tests/hooks/settings-driven-invocation-parity.vitest.ts` | 003 | Repaired sed-mangled regex literal |
| `scripts/tests/{deep-review-reducer-schema, review-reducer-fail-closed, deep-research-reducer}.vitest.ts` | 005 | sk-deep-* path fixes (carryover from 001's bulk sed) |

---

## 4. FINDINGS CLUSTERS (3 deep-reviews × 47 total findings)

### Phase 002 — deep-review #1 (22 findings)
- 1 P0: dist/code-graph globs stale (P0-001)
- 12 P1: source/dist drift, sk-deep-* dead refs, 096 narrative tautologies, hook env override, advisor state path, smart-router validator, Python tools defaults, etc.
- 9 P2: install guides, Barter root, dead Copilot guard, etc.

### Phase 004 — deep-review #2 (19 findings)
- 0 P0 (carryover-fully-resolved)
- 13 P1: scan.ts source default, scripts/dist parity, 095 contradictions, playbook reachability, spec_folder injection, audit zero-inventory, smart-router shared-CLI, 096/004 anchors, continuity blockers, 098 sub-phase strict-validate, advisor aliases, reducer findings extraction
- 6 P2: P1-005 downgraded + new advisories

### Phase 007 — deep-review #3 (6 findings)
- 0 P0 (verdict-flip confirmed)
- 2 P1 regressions in Phase 006 (cli-opencode): missing `--pure` flag in YAML branches; sandboxMode silent no-op
- 4 P2 advisories: advisor scoring lane, unit-test coverage, strategy-doc drift

### Closure pattern
- All 22 from #1 → resolved by Phase 003
- All 13 from #2 → resolved by Phase 005
- 5/6 from #3 → resolved by Phase 008 (P2-032 cosmetic deferred)

Net: **40 of 41 in-scope P0+P1 findings closed.** P2-032 deferred as cosmetic.

---

## 5. CYCLE TELEMETRY

| Metric | Value |
|--------|-------|
| Total deep-review iterations | 28 (10 + 10 + 8) |
| Total cli-codex compute (high reasoning, fast tier) | ~640 minutes |
| Total commits on `main` | 12+ across the cycle |
| Total tests passing post-cycle | 48 (executor + reducer suites) |
| Source/dist parity surfaces (now matching) | 15+ TS sources rebuilt to plural |

---

## 6. RELEASE READINESS

- ✓ All P0 findings closed (1 in #1, 0 in #2/#3)
- ✓ All in-scope P1 findings closed (12 in #1, 13 in #2, 2 in #3)
- ✓ All 8 phases validate strict-clean
- ✓ All non-deferred P2 advisories closed
- ⚠ 1 cosmetic P2 deferred (P2-032 strategy-doc drift in Phase 007 review artifact)

**Track is release-ready.** Optional future Phase 009 = deep-review #4 to empirically confirm verdict-flip CONDITIONAL → PASS post-008.

---

## 7. RELATED DOCUMENTS

- **Per-phase resource maps**: Phase 001 has a detailed inventory at `001-rename-opencode-dirs/resource-map.md`. Phase 002 + 004 + 007 review packets each carry their own `review/resource-map.md`.
- **Review reports**: `00{2,4,7}-track-{review,rereview,rereview-2}/review/review-report.md`
- **Track parent**: `../` (`skilled-agent-orchestration`)
