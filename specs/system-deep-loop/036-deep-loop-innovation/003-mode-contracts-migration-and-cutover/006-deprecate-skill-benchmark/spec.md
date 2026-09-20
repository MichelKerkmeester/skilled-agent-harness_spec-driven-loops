---
title: "Feature Specification: Deprecate the deep-skill-benchmark lane"
description: "The skill-benchmark lane is a registered system-deep-loop workflow mode whose command, scripts, assets and runtime libraries are no longer wanted. It must be removed completely without destroying the historical benchmark reports other skills own, and without disturbing the two surviving improvement lanes."
trigger_phrases:
  - "deprecate skill benchmark"
  - "remove skill-benchmark lane"
  - "deep-skill-benchmark deprecation"
  - "lane c removal"
  - "deep-loop five modes"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Deprecate the deep-skill-benchmark lane

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

The `skill-benchmark` lane (Lane C of `deep-improvement`, reached through `/deep:skill-benchmark`) is removed from the repository in full: its command front doors in five runtimes, its workflow assets, its script tree, its fixture corpus, its reference and catalog documentation, and its three runtime ledger libraries. The `system-deep-loop` hub drops from six registered workflow modes to five.

**Key Decisions**: the lane was a fully registered hub mode with `advisorRouting.routingClass: "command-bridge"`, not an unregistered side lane, so removal ran through every hub surface plus the advisor command-bridge projection; historical `skill-benchmark-report.*` evidence owned by other skills is preserved untouched.

**Critical Dependencies**: `deep-improvement` remains live for `agent-improvement` and `model-benchmark`, so `scripts/shared/loop-host.cjs` and `runtime/scripts/append-mode-event.cjs` were edited surgically rather than removed.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-11 |
| **Branch** | `worktree-agent-a610d0d2b5e8a5edc` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `skill-benchmark` lane is carried by the `system-deep-loop` hub as a sixth workflow mode, with a command in five runtime trees, a 56-file script tree, a large fixture corpus, three runtime ledger libraries and its own reference, catalog and playbook documentation. It is no longer wanted, and every surface that advertises it is a route to code that should not run.

### Purpose
The lane is gone from every reachable surface, the hub registers exactly five modes, and nothing that belonged to another packet or another mode was destroyed along the way.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The lane's command front doors in all five runtime trees and its three workflow assets.
- The lane's own directories under `deep-improvement/`: `scripts/`, `assets/`, `references/`, `feature-catalog/`, `manual-testing-playbook/`.
- The three `runtime/lib/skill-benchmark-*` libraries and their three unit tests.
- Every `system-deep-loop` hub registry, router and metadata surface that named the mode.
- The advisor command-bridge projection, regenerated from its own generator.
- Shared files the removal would otherwise break: `loop-host.cjs` and `append-mode-event.cjs`.
- Index documentation inside `system-deep-loop` that pointed at deleted files.

### Out of Scope
- The 554 tracked `skill-benchmark-report.{json,md}` files under other skills' `benchmark/reports/` directories - they are those skills' historical run evidence, not this lane's source.
- `sk-doc/sk-create-benchmark`'s skill-benchmark authoring mode - a different parent hub with its own registry and router.
- Other skills' `benchmark/README.md` files that describe their own stored reports.
- Every `changelog/` entry naming the lane - changelogs are an immutable historical record.
- `specs/**` packets about the lane - historical spec record.
- Generated spec-kit retrieval corpora (`trigger-index.json`, retrieval fixtures).
- The dead `'skill-benchmark'` string constant retained in shared improvement type unions.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/commands/deep/skill-benchmark.md` | Delete | OpenCode command front door |
| `.claude/commands/deep/skill-benchmark.md` | Delete | Claude Code command front door |
| `.codex/prompts/deep-skill-benchmark.md` | Delete | Codex prompt front door |
| `.cursor/commands/deep-skill-benchmark.md` | Delete | Cursor command front door |
| `.pi/prompts/deep-skill-benchmark.md` | Delete | Pi prompt front door |
| `.opencode/commands/deep/assets/deep-skill-benchmark-*.{yaml,txt}` | Delete | Auto/confirm workflows and presentation contract |
| `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/` | Delete | Orchestrator, scorers, executors and lane tests |
| `.opencode/skills/system-deep-loop/deep-improvement/assets/skill-benchmark/` | Delete | Profile and fixture corpus |
| `.opencode/skills/system-deep-loop/deep-improvement/references/skill-benchmark/` | Delete | Scoring contract and operator guide |
| `.opencode/skills/system-deep-loop/deep-improvement/feature-catalog/skill-benchmark/` | Delete | Lane feature catalog |
| `.opencode/skills/system-deep-loop/deep-improvement/manual-testing-playbook/skill-benchmark/` | Delete | Lane playbook |
| `.opencode/skills/system-deep-loop/runtime/lib/skill-benchmark-*/` | Delete | Ledger schema, reducers, sealed artifacts |
| `.opencode/skills/system-deep-loop/mode-registry.json` | Modify | Drop the mode entry |
| `.opencode/skills/system-deep-loop/hub-router.json` | Modify | Drop signal, vocabulary class and tie-break entry |
| `.opencode/skills/system-deep-loop/leaf-manifest.json` | Modify | Regenerated from its generator |
| `.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/loop-host.cjs` | Modify | Drop the lane branch, keep the two live lanes |
| `.opencode/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs` | Modify | Drop the adapter importing a deleted library |
| `.opencode/skills/system-skill-advisor/mcp-server/**` | Modify | Regenerated command-bridge projection |
| `AGENTS.md` | Modify | Remove the command pointer only |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | No runtime tree exposes a `skill-benchmark` command or prompt. |
| REQ-002 | The hub registers exactly five workflow modes and every hub surface agrees. |
| REQ-003 | No source file imports a deleted `skill-benchmark-*` module. |
| REQ-004 | The 554 historical `skill-benchmark-report.*` files under other skills are untouched. |
| REQ-005 | `deep-improvement` still plans and runs `agent-improvement` and `model-benchmark`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | No `system-deep-loop` document links to a deleted file. |
| REQ-007 | The advisor command-bridge projection is regenerated, not hand-edited. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `parent-skill-check.cjs` on `system-deep-loop` reports all hard invariants passed, with mode counts reading 5.
- **SC-002**: A repository scan finds no `skill-benchmark` reference outside the deliberately preserved surfaces named in Out of Scope.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `deep-improvement` shared scripts | Removing the lane branch could break the two live lanes | Smoke-tested `planInvocation` for both survivors after the edit |
| Risk | Deleting other packets' report evidence because it shares a filename prefix | High | Report paths excluded from every deletion set and verified by count afterwards |
| Risk | Hand-editing a generated artifact and leaving byte drift | Medium | `leaf-manifest.json` and the advisor bridges regenerated from their own generators |
| Risk | A shared runtime library importing a deleted module | High | Post-deletion import scan across `lib/`, `scripts/` and `tests/` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Removal adds no runtime cost; the hub resolves one fewer mode.

### Security
- **NFR-S01**: No credential, token or permission surface is touched.

### Reliability
- **NFR-R01**: The five surviving modes remain resolvable from the hub registry and router with no fallback path.

---

## 8. EDGE CASES

### Data Boundaries
- A caller passing `--mode=skill-benchmark` to `loop-host.cjs`: warns on stderr and falls back to `agent-improvement`, the pre-existing behavior for any unknown mode.
- A caller passing `skill-benchmark` to `append-mode-event.cjs`: reaches the `default` branch and throws `Unsupported mode`.

### Error Scenarios
- A stale compiled validation orchestrator: `validate.sh` exits 3 with no rule output, so verification requires an explicit `RESULT: PASSED` line rather than the absence of a failure marker.
- A grep filter written against library directory names hides callers whose import path contains that name; the reference map was rebuilt per file, not per line.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 25/25 | Files: 196 deleted + ~40 modified, LOC: 31742, Systems: hub, advisor, runtime, 5 runtime trees |
| Risk | 18/25 | Auth: N, API: Y (shared registry + type contracts), Breaking: Y (registered mode removed) |
| Research | 16/20 | Reachability, asset ownership and dependency direction all had to be established first |
| Multi-Agent | 12/15 | Registry surgery, two disjoint documentation sweeps |
| Coordination | 12/15 | Generated artifacts must be regenerated in order after their sources change |
| **Total** | **83/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Historical report evidence deleted by name match | H | M | Excluded by path from every deletion set; count verified before and after |
| R-002 | A surviving improvement lane breaks | H | M | Shared files edited surgically and smoke-tested |
| R-003 | Generated manifest left stale | M | H | Regenerated; byte-drift invariant re-run |
| R-004 | Dead mode constant left in shared type unions | L | H | Recorded as residue for an operator decision rather than removed unverified |

---

## 11. USER STORIES

### US-001: Remove an unwanted loop completely (Priority: P0)

**As a** maintainer, **I want** the skill-benchmark lane gone from every runtime and registry, **so that** nobody can invoke a loop the repository no longer supports.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: Keep other packets' evidence (Priority: P1)

**As a** maintainer, **I want** past benchmark reports stored under other skills left intact, **so that** deprecating a tool does not erase the record of what it measured.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

## 12. OPEN QUESTIONS

- Should the dead `'skill-benchmark'` string constant be stripped from the shared improvement type unions, adjudication contracts and write-set census, which would touch two live lanes and five test files?
- Should `sk-doc/sk-create-benchmark`'s skill-benchmark authoring mode be retired now that there is no lane to author for?
- Should the 554 historical report files, and other skills' `benchmark/README.md` text describing them, be retained, archived or removed?
- Four `sk-doc` scripts and one `sk-code` drift-guard script consumed the lane's script tree as a shared library and now point at deleted paths. Should they be retired with the lane, or should the handful of modules they imported be rehomed as a standalone library?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Acceptance Criteria**: See `acceptance-criteria.md`

---

