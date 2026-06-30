---
title: "Implementation Plan: Merged hub and mode packets"
description: "Implementation Plan for phase 003 of the deep-loop-workflows merge: Merged hub and mode packets."
trigger_phrases:
  - "deep-loop-workflows phase 003"
  - "merged-hub-and-mode-packets"
  - "deep loop merge implementation plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/029-deep-loop-workflows/003-merged-hub-and-mode-packets"
    last_updated_at: "2026-06-15T05:45:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Assembled implementation plan from parallel planning fleet"
    next_safe_action: "Execute phase 003 per the gated pipeline"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-152-003-merged-hub-and-mode-packets-implementationplan"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Merged hub and mode packets

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown skill docs, `.cjs`/`.ts` runtime, YAML command assets |
| **Framework** | deep-loop-workflows merge (two-skill architecture) |
| **Storage** | `.opencode/skills/`, `.opencode/commands/deep/`, advisor SQLite graph |
| **Testing** | byte-identical per-mode parity vs phase-001 baseline + `validate.sh --strict` |

### Overview
Build deep-loop-workflows/ as a COPY (not git mv — old dirs stay live until phase 009): a routing-only hub SKILL.md, one hub graph-metadata.json (skill_id=deep-loop-workflows), the mandatory mode-registry.json, and 5 mode packets. Each packet is copied verbatim, drops its graph-metadata.json (keystone: skill_id!=folder would throw), and gets THREE rewrite classes — anchored deep-<name>/ string rewrites, +1 '..' on packet-escaping __dirname walks, and +1 on ai-council's 8 relative requires into deep-loop-runtime. 5 packet seats + 1 registry seat run in parallel on disjoint write paths after a serial hub scaffold, converging on a serial verify gate.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Predecessor (phase 002) green.
- [ ] Phase-001 parity baseline available.
- [ ] Scope limited to this phase per `spec.md`.

### Definition of Done
- [ ] deep-loop-workflows/ exists; hub SKILL.md routes by mode with no per-mode logic (grep-verified)
- [ ] hub graph-metadata.json skill_id==name==folder==deep-loop-workflows, family=deep-loop
- [ ] exactly one graph-metadata.json under deep-loop-workflows/ (keystone)
- [ ] mode-registry.json: 8 workflowModes each with workflowMode + runtimeLoopType(value\|explicit null) + backendKind + aliases + packetPath + permissions + commandNames + artifactRoot
- [ ] registry completeness test (R4) green incl explicit-null negative test and backendKind<->nullability consistency
- [ ] 5 packets copied verbatim; per-packet source-verbatim diff clean except dropped graph-metadata.json

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Gated phase in the deep-loop-workflows merge pipeline. Additive/reversible (old skill dirs survive until phase 009).

### Parallel Groups (worker fleet)
- **G1** (opus seats): Serial hub scaffold: create deep-loop-workflows/, routing-only SKILL.md, hub graph-metadata.json (skill_id=deep-loop-workflows, family=deep-loop), README
- **G2** (mixed seats): Five independent packet builds (copy+drop-graph-metadata+anchored-rewrite+depthfix+self-parity) on disjoint trees; improvement+ai-council on opus, context/research/review on gpt-fast
- **G3** (opus seats): mode-registry.json + registry completeness test; reads only the discriminator table and mode->path map, so runs concurrently with G2
- **G4** (opus seats): Serial verification gate: keystone find-check + residual grep + cross-mode resolve, per-mode artifact byte-parity, strict validate + runtime/old-dir untouched

### Read/Write Split
Read-only analysis + parity capture run on `gpt-5.5-fast --variant high` (cli-opencode); file writes/edits run on `opus-4.8` via `claude2`; the orchestrator reduces and validates.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Read predecessor continuity (phase 002) and `../research/research.md`.
- [ ] Load the phase-001 parity baseline for the affected modes/surfaces.

### Phase 2: Core Implementation
- [ ] T1 Scaffold the hub: routing-only SKILL.md (no per-mode logic), graph-metadata.json with skill_id=name=folder=deep-loop-workflows and family=deep-loop, README (`.opencode/skills/deep-loop-workflows/SKILL.md`, `.opencode/skills/deep-loop-workflows/graph-metadata.json`, `.opencode/skills/deep-loop-workflows/README.md`) — _verify:_ skill_id==name==folder==deep-loop-workflows; grep hub SKILL.md for convergence/strategy terms -> zero (R1)
- [ ] T2 Build context/ packet (copy deep-context, drop graph-metadata, anchored rewrite, fix 2 escaping runtime walks in loop-lock.cjs/reduce-state.cjs) (`.opencode/skills/deep-loop-workflows/context/`) — _verify:_ find -> no graph-metadata.json; residual grep empty; rewritten .cjs load without throw; reverse-rewrite diff -r vs deep-context clean
- [ ] T3 Build research/ packet (copy deep-research, drop graph-metadata, anchored rewrite ~434 self-refs, re-enumerate escaping walks on post-002 tree) (`.opencode/skills/deep-loop-workflows/research/`) — _verify:_ no graph-metadata.json; residual grep empty; reverse-rewrite diff -r clean; scripts load
- [ ] T4 Build review/ packet (copy deep-review, drop graph-metadata, anchored rewrite, depth fix) (`.opencode/skills/deep-loop-workflows/review/`) — _verify:_ no graph-metadata.json; residual grep empty; reverse-rewrite diff -r clean; scripts load
- [ ] T5 Build ai-council/ packet (opus): copy deep-ai-council, drop graph-metadata, anchored rewrite, and +1 '..' on the 8 relative require('../../deep-loop-runtime/...') that throw on load (`.opencode/skills/deep-loop-workflows/ai-council/`) — _verify:_ no graph-metadata.json; residual grep empty; node -e require() each rewritten orchestrate*.cjs loads; reverse-rewrite diff -r clean
- [ ] T6 Build improvement/ packet (opus, heaviest): copy deep-improvement, drop graph-metadata, anchored rewrite (~408 self + 43 exec refs), +1 '..' on escaping walks (check-agent-mirror-sync 4->5, skill-benchmark 3->4, shared/reduce-state runtime reach) leaving packet-internal scorer walks unchanged (`.opencode/skills/deep-loop-workflows/improvement/`) — _verify:_ no graph-metadata.json; residual grep empty; PACKET_ROOT/internal walks unchanged; escaping walks load; reverse-rewrite diff -r clean
- [ ] T7 Author mode-registry.json: 8 workflowModes each with runtimeLoopType (value or explicit null), backendKind, aliases, packetPath, permissions, commandNames, artifactRoot; ai-council->council mapping explicit (`.opencode/skills/deep-loop-workflows/mode-registry.json`) — _verify:_ JSON parses; every packetPath exists post-G2; 8 modes present
- [ ] T8 Author+run registry completeness test (R4): every mode has the unambiguous triple; improvement modes runtimeLoopType===null EXPLICIT (negative test on omission); backendKind<->nullability consistency (`.opencode/skills/deep-loop-workflows/tests/registry-completeness.vitest.ts`) — _verify:_ test green
- [ ] T9 Keystone+rewrite gate: exactly one graph-metadata.json under hub; nested-SKILL.md discovery test (read-only, not advisor_rebuild) shows zero extra packet nodes; full-tree residual self-path grep empty; ~15 cross-mode refs resolve (`.opencode/skills/deep-loop-workflows/`) — _verify:_ find returns only hub graph-metadata.json; discovery test 0 extra nodes; residual grep empty; cross-mode refs resolve
- [ ] T10 Per-mode single-executor artifact byte-parity vs phase-001 baseline (Lane D dry-run basis); doubles as depth-fix verifier since a missed +1 throws or diffs (`.opencode/skills/deep-loop-workflows/`) — _verify:_ byte-identical artifacts for all 5 modes; all scripts load
- [ ] T11 Strict validate + frozen-boundary check (`.opencode/specs/deep-loops/029-deep-loop-workflows/003-merged-hub-and-mode-packets`) — _verify:_ validate exit 0; git diff empty on deep-loop-runtime (MCP-free preserved) and on all 5 old deep-<name>/ dirs (still live)

### Phase 3: Verification
- [ ] Run the Parity Check (below).
- [ ] `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-phase-folder> --strict`.

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Method |
|-----------|-------|--------|
| Parity | This phase's affected modes/surfaces | Two required proofs vs phase-001 baseline: (1) per-packet source-verbatim — inverse-apply the path rewrite to each new packet and diff -r vs the source deep-<name>/, only allowed delta is the dropped graph-metadata.json; (2) artifact byte-parity — run each mode single-executor from the new path on phase-001's exact fixture and diff emitted artifacts byte-for-byte vs baseline (byte-identical only if no absolute skill path leaks into output AND every escaping __dirname walk/require was depth-corrected, so this test also verifies the depth fix). Registry correctness via the R4 completeness test incl explicit-null negative test. Lane D compared on dry-run basis (B8). |
| Structural | Spec docs | `validate.sh --strict` |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| phase 002 | Internal phase | Gating | This phase cannot start until its predecessor is green |
| Phase-001 baseline | Internal | Gating | Parity cannot be proven without the baseline |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Parity check fails or `validate.sh --strict` errors.
- **Procedure (per-strata)**: revert only this phase child's edits; the five old skill directories survive until phase 009, so rollback never requires a whole-tree reset.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | phase 002 | Core Implementation |
| Core Implementation | Setup | Verification |
| Verification | Core Implementation | Next pipeline phase |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | read baseline + predecessor |
| Core Implementation | High | 11 tasks across 4 parallel group(s) |
| Verification | Medium | parity + strict validation |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Phase-001 baseline captured for affected surfaces.
- [ ] Old skill directories intact (deletion only in phase 009).

### Rollback Procedure
1. **Depth off-by-one missed on an escaping walk/require (esp. the 8 ai-council requires that throw on load)** -> apply the missing +1 '..'; re-run T10; whole phase is one new dir with old dirs as live fallback
1. **Anchored rewrite misses a ref OR false-positive-rewrites a spec-folder name (003-deep-research/, z_archive/079-sk-deep-research/)** -> rm -rf deep-loop-workflows/ and redo with tightened anchor; zero blast radius, nothing points at new dir yet
1. **A per-mode graph-metadata.json survives the drop -> advisor scanner throws (skill_id!=folder)** -> delete the stray; re-run T9; enforced by T2-T6 step 2 + T9 find-check
1. **Hub SKILL.md absorbs per-mode logic (R1 violation)** -> trim hub to routing-only; re-verify T1 grep
1. **Registry inference-leak: improvement mode omits runtimeLoopType instead of explicit null (R4)** -> set explicit null in mode-registry.json; re-run T8
1. **deep-loop-runtime accidentally modified (breaks frozen/MCP-free boundary)** -> git checkout -- .opencode/skills/deep-loop-runtime/; re-run T11

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: git restore the affected files; no data migration.

<!-- /ANCHOR:enhanced-rollback -->
