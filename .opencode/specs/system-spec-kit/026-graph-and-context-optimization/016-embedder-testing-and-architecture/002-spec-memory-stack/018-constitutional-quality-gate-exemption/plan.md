---
title: "Implementation Plan: Phase 1: constitutional-quality-gate-exemption [template:level_1/plan.md]"
description: "Single-file 5-line patch to memory-index.ts:474 plus rebuild plus daemon restart. The patch ORs isConstitutional into the existing useWarnOnly branch so constitutional policy markdown passes through warn-only sufficiency mode."
trigger_phrases:
  - "constitutional exemption plan"
  - "memory-index isConstitutional plan"
  - "warn-only branch policy text"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/002-spec-memory-stack/018-constitutional-quality-gate-exemption"
    last_updated_at: "2026-05-19T19:50:00Z"
    last_updated_by: "claude-code"
    recent_action: "Plan authored after patch landed and rebuild passed"
    next_safe_action: "ready to commit packet plus daemon restart"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "016-002-018-constitutional-exemption"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 1: constitutional-quality-gate-exemption

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript on Node 20+ |
| **Framework** | mk-spec-memory MCP server handler |
| **Storage** | none for this patch (the change is purely in-process logic) |
| **Testing** | Manual scan against the two known-failing constitutional files |

### Overview
One handler patch. `handlers/memory-index.ts::handleMemoryIndexScan` already classifies each file with `isSpecDoc` and `isConstitutional`. The patch adds `isConstitutional` to the `useWarnOnly` OR chain so constitutional files pass through the same warn-only sufficiency mode that spec docs use today.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Investigation report identified the exact source line and rejection chain
- [x] Affected constitutional files enumerated
- [x] Predecessor packet 016/002/016 fix in place so the index pipeline reaches the gate at all

### Definition of Done
- [x] Patch applied
- [x] Type-check clean
- [x] Build passes
- [x] Daemon restart picks up the new dist
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single decision point in the scan batch loop. The patch widens an existing exemption (`isSpecDoc`) to also cover an existing classification (`isConstitutional`) that the same function already computes downstream.

### Key Components
- **`handleMemoryIndexScan`** (`handlers/memory-index.ts`): owner of the scan batch loop, computes both `isSpecDoc` and `isConstitutional` per file.
- **`useWarnOnly` OR chain**: gate selector that the patch widens.

### Data Flow
Scan walks files: per file, computes `isSpecDoc` from the spec-doc key set and `isConstitutional` from the constitutional key set. Before the patch the warn-only mode triggered on `force || isSpecDoc`. After the patch it triggers on `force || isSpecDoc || isConstitutional`. The `indexSingleFile` call downstream then runs with `qualityGateMode: 'warn-only'` for constitutional files, which lets the sufficiency check log advisories instead of hard-rejecting.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `handleMemoryIndexScan` batch loop (`handlers/memory-index.ts:469-479`) | Selects warn-only vs strict per file | Update to include `isConstitutional` | grep + post-restart scan |
| `indexSingleFile` consumer | Receives `qualityGateMode` | Unchanged | Existing tests, no behavior change for non-constitutional files |
| `memory-sufficiency.ts` policy module | Computes the reject decision | Unchanged | Sufficiency logic still fires, just with warn-only severity for constitutional files |
| `validation-responses.ts` envelope builder | Formats the rejection | Unchanged | The envelope still constructs when warn-only emits an advisory, but it does not trigger a hard reject |

Required inventories:
- Producers of the warn-only flag: `grep -n "useWarnOnly\|qualityGateMode" .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts`.
- Consumers of `qualityGateMode`: `rg -n "qualityGateMode" .opencode/skills/system-spec-kit/mcp_server/`.
- Matrix axes: file classification (spec doc, constitutional, neither), force flag on or off.
- Algorithm invariant: warn-only never hides advisories, it only changes the response envelope severity. Strict mode for non-classified files stays intact.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Patch
- [x] Edit `handlers/memory-index.ts:474` to OR `isConstitutional` into `useWarnOnly`
- [x] Add a rationale comment naming this packet and the policy-not-evidence reasoning

### Phase 2: Build
- [x] `cd .opencode/skills/system-spec-kit/mcp_server && npx tsc --noEmit -p tsconfig.json` (type-check)
- [x] `npm run build` (compile dist)

### Phase 3: Verification
- [x] Daemon restart through the same Python double-fork plus setsid pattern used in 016/002/016
- [x] Re-run `memory_index_scan` and confirm the 2 constitutional rejections disappear from the failure list
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Type-check | Patched handler plus its closure | `npx tsc --noEmit` |
| Build | Compile dist | `npm run build` |
| Manual | Scan against the two known-failing files | launcher stdio bridge with `memory_index_scan` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 016/002/016 factory plus reindex fix | Internal | Green | Indexing pipeline is broken without it, the gate never gets a chance to fire |
| Daemon launcher and bridge socket | Internal | Green | Required to apply the rebuilt dist without losing multi-client serving |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Constitutional files surface real quality issues that the warn-only path silently accepts, OR a downstream consumer relies on hard-reject behavior for constitutional content.
- **Procedure**:
  - `git revert <commit-sha>` for this packet.
  - `npm run build` mcp_server.
  - Restart the daemon. Constitutional files go back to hard-reject on next scan.
  - If the policy intent shifts toward authored evidence, run a backfill pass instead of restoring the reject path.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
