#!/usr/bin/env node
'use strict';
/* Generate 10 compliant phase-parent spec.md files for the 026 wave-4 wrappers. */
const fs = require('fs');
const path = require('path');

const ROOT = '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public-026-reorg/.opencode/specs/system-spec-kit/026-graph-and-context-optimization';
const PP = 'system-spec-kit/026-graph-and-context-optimization'; // packet-pointer prefix

// per-wrapper data
const W = [
  {
    dir: '000-release-and-program-cleanup', name: 'Release and Program Cleanup', pct: 100, parent: null,
    purpose: 'Coordinate release readiness, system audits, cross-cutting cleanup, stress testing, and program-level adoption follow-ups for the graph-and-context program. Acts as the final release gate.',
    triggers: ['026 release and program cleanup', 'release readiness 026', 'program cleanup audits'],
    children: [
      ['001-release-readiness', 'Release-readiness deep-review and P1/P2 remediation train', 'complete'],
      ['002-audit', 'System audits: dependency, security, supply-chain, runtime-matrix validation', 'complete'],
      ['003-cross-cutting-cleanup-pass', 'Cross-cutting dead-code pruning and doc/runtime cleanup sweep', 'complete'],
      ['004-followup-post-program', 'Post-program follow-up items', 'complete'],
      ['005-stress-test', 'Stress-test cycles and pattern documentation', 'complete'],
      ['006-research', 'Release-phase research spikes', 'complete'],
      ['007-clean-room-license-audit', 'Clean-room license audit for external-project adoption', 'deferred'],
      ['008-docs-and-catalogs-rollup', 'Documentation and catalogs rollup for adoption uplift', 'deferred'],
    ],
  },
  {
    dir: '002-spec-kit-internals', name: 'Spec-Kit Internals', pct: 85, parent: null,
    purpose: 'Improve internal spec-kit and skill-system mechanics: the resource-map and deep-loop artifact plumbing, the skill-advisor system, the spec-folder template system, and spec-folder naming policy.',
    triggers: ['026 spec-kit internals', 'skill advisor template system', 'spec folder naming policy'],
    children: [
      ['001-resource-map-deep-loop-fix', 'resource-map.md template and deep-loop artifact placement and auto-emit', 'complete'],
      ['002-skill-advisor', 'Skill-advisor system: graph, scoring engine, routing engine, hardening, docs', 'complete'],
      ['003-template-levels', 'Manifest-driven spec template system (research, design, implementation)', 'in progress (85%)'],
      ['004-literal-spec-folder-names', 'Concrete-token spec-folder and phase naming policy', 'deferred'],
    ],
  },
  {
    dir: '003-memory-and-causal-runtime', name: 'Memory and Causal Runtime', pct: 85, parent: null,
    purpose: 'Harden the memory continuity substrate, deliver causal-graph channel routing, and validate the embedding architecture. The memory store is a distinct surface from the code graph and cross-links to it.',
    triggers: ['026 memory and causal runtime', 'memory continuity embeddings', 'causal graph channel routing'],
    children: [
      ['001-continuity-memory-runtime', 'Memory quality, continuity gates, memory-save rewrite, runtime hardening, indexer invariants', 'complete'],
      ['002-causal-graph-channel-routing', 'Causal-graph channel routing MVP and deep-review remediation', 'in progress (85%)'],
      ['003-embedder-testing-and-architecture', 'Local-embedding foundation, per-surface stack testing, ollama/bge promotion, rerank-sidecar', 'in progress (75%)'],
    ],
  },
  {
    dir: '004-code-graph', name: 'Code Graph', pct: 90, parent: null,
    purpose: 'Build and harden the code-graph structural-indexing surface: the standalone package, CocoIndex decoupling, startup fixes, and the code-graph runtime, resilience, extraction, and documentation sub-themes. Code graph is a structural surface distinct from the memory store and cross-links to it.',
    triggers: ['026 code graph', 'code graph structural indexing', 'coco-index decoupling'],
    children: [
      ['001-mcp-shared-dependency-startup-fix', 'Fix @spec-kit/shared dependency declaration for mk_code_index MCP startup', 'complete'],
      ['002-deprecate-coco-index', 'Remove mcp-coco-index and rerank-sidecar; stand code-graph alone as structural-only', 'in progress (95%)'],
      ['003-code-graph-workspace-root-fix', 'Fix workspace-root and socket-dir resolution for code-index MCP reconnection', 'complete'],
      ['010-runtime-and-scan', 'Code-graph runtime upgrades, scan scope and correctness, resolver and hooks, excludes', 'complete'],
      ['011-resilience-and-advisor', 'Advisor refinement, backend resilience research and implementation, iteration-quality, doctor apply-mode', 'complete'],
      ['012-extraction-and-isolation', 'system-code-graph extraction, decision record, standalone-MCP pivot, three-way isolation', 'complete'],
      ['013-docs-and-readmes', 'Doctor diagnostic phase-a, READMEs, doc-drift alignment, cross-skill and reference-template polish', 'complete'],
      ['014-real-world-usefulness-test-planning', 'Real-world usefulness test planning (nested phase parent)', 'complete'],
      ['015-system-code-graph-uplift-phase-parent', 'system-code-graph uplift (nested phase parent)', 'complete'],
    ],
  },
  {
    dir: '005-graph-impact-and-affordance', name: 'Graph Impact and Affordance', pct: 5, parent: null,
    purpose: 'Deliver the external-project adoption uplift: a code-graph phase runner, edge-explanation and impact display, skill-advisor affordance evidence, and memory causal-trust display. Most of this track is planned and deferred in place.',
    triggers: ['026 graph impact and affordance', 'external project adoption uplift', 'affordance evidence display'],
    children: [
      ['001-code-graph-phase-runner', 'Code-graph phase runner and detect-changes', 'deferred'],
      ['002-edge-explanation-impact-uplift', 'Edge explanation and impact uplift', 'deferred'],
      ['003-skill-advisor-affordance-evidence', 'Skill-advisor affordance evidence display', 'deferred'],
      ['004-memory-causal-trust-display', 'Memory causal-trust display layer', 'deferred'],
      ['005-deep-review-findings', 'Deep-review findings for the adoption track', 'abandoned'],
      ['006-deep-research-review', 'Deep research and review spike for adoption', 'abandoned'],
    ],
  },
  {
    dir: '006-operator-tooling', name: 'Operator Tooling', pct: 85, parent: null,
    purpose: 'Improve operator-facing tooling: runtime hook parity across runtimes, the doctor command surface, and install-script and doctor realignment for the post-CocoIndex world.',
    triggers: ['026 operator tooling', 'runtime hook parity', 'doctor command surface install scripts'],
    children: [
      ['001-hook-parity', 'Runtime hook parity across Claude, Codex, Copilot, OpenCode (schema and wiring)', 'in progress (85%)'],
      ['002-doctor-update-orchestrator', 'Doctor command surface and dependency-safe rebuild orchestration', 'in progress (90%)'],
      ['003-install-scripts-doctor-realignment', 'Install guides and scripts plus doctor realignment for the post-CocoIndex world', 'deferred'],
    ],
  },
  // sub-wrappers under 004-code-graph
  {
    dir: '004-code-graph/010-runtime-and-scan', name: 'Code-Graph Runtime and Scan', pct: 100, parent: `${PP}/004-code-graph`,
    purpose: 'The code-graph runtime and scan-correctness track: runtime upgrades, scan scope and correctness, resolver and hook improvements, and exclude tuning.',
    triggers: ['code graph runtime and scan', 'code graph scan scope', 'code graph runtime upgrades'],
    children: [
      ['001-code-graph-runtime-upgrades', 'Runtime upgrades', 'complete'],
      ['002-fix-stale-highlights-and-scan-scope', 'Stale-highlights and scan-scope fix', 'complete'],
      ['003-resolver-and-hook-improvements', 'Resolver and hook improvements', 'complete'],
      ['004-end-user-scope-default-and-opt-in', 'End-user scope default and opt-in', 'complete'],
      ['005-broader-excludes-and-granular-skills', 'Broader excludes and granular skills', 'complete'],
    ],
  },
  {
    dir: '004-code-graph/011-resilience-and-advisor', name: 'Code-Graph Resilience and Advisor', pct: 100, parent: `${PP}/004-code-graph`,
    purpose: 'The code-graph resilience and advisor-integration track: advisor refinement, backend resilience research and implementation, iteration-quality meta research, and doctor apply-mode.',
    triggers: ['code graph resilience and advisor', 'code graph backend resilience', 'code graph advisor refinement'],
    children: [
      ['001-code-graph-advisor-refinement', 'Advisor refinement', 'complete'],
      ['002-code-graph-resilience-research', 'Resilience research', 'complete'],
      ['003-code-graph-backend-resilience-implementation', 'Backend resilience implementation', 'complete'],
      ['004-iteration-quality-meta-research', 'Iteration-quality meta research', 'complete'],
      ['005-doctor-apply-mode-implementation', 'Doctor apply-mode implementation', 'complete'],
    ],
  },
  {
    dir: '004-code-graph/012-extraction-and-isolation', name: 'Code-Graph Extraction and Isolation', pct: 100, parent: `${PP}/004-code-graph`,
    purpose: 'The system-code-graph extraction and standalone-MCP isolation track: extraction, extraction design and decision record, standalone-MCP topology pivot, and three-way isolation.',
    triggers: ['code graph extraction and isolation', 'system-code-graph extraction', 'standalone mcp isolation'],
    children: [
      ['001-system-code-graph-extraction', 'Extraction', 'complete'],
      ['002-extraction-design-and-decision-record', 'Extraction design and decision record', 'complete'],
      ['003-standalone-mcp-topology-pivot', 'Standalone-MCP topology pivot', 'complete'],
      ['004-three-way-isolation-finalize', 'Three-way isolation finalize', 'complete'],
    ],
  },
  {
    dir: '004-code-graph/013-docs-and-readmes', name: 'Code-Graph Docs and READMEs', pct: 100, parent: `${PP}/004-code-graph`,
    purpose: 'The code-graph documentation track: doctor diagnostic command phase-a, system-code-graph READMEs, code-folder READMEs, doc-drift alignment, cross-skill doc polish, and reference-template alignment.',
    triggers: ['code graph docs and readmes', 'system-code-graph readmes', 'code graph doc drift'],
    children: [
      ['001-doctor-diagnostic-command-phase-a', 'Doctor diagnostic command phase-a', 'complete'],
      ['002-system-code-graph-readmes-update', 'system-code-graph READMEs update', 'complete'],
      ['003-code-folder-readmes-poc', 'Code-folder READMEs proof-of-concept', 'complete'],
      ['004-doc-drift-alignment', 'Doc-drift alignment', 'complete'],
      ['005-cross-skill-doc-polish', 'Cross-skill doc polish', 'complete'],
      ['006-reference-template-alignment', 'Reference-template alignment', 'complete'],
    ],
  },
];

function statusWord(pct) {
  if (pct >= 100) return 'complete';
  if (pct <= 5) return 'deferred';
  return 'in progress';
}

function render(w) {
  const ptr = w.parent ? `${PP}/${w.dir}` : `${PP}/${w.dir}`;
  const parentLine = w.parent
    ? `| **Parent Spec** | \`../spec.md\` |\n| **Parent Packet** | \`${w.parent}\` |\n`
    : `| **Parent Spec** | \`../spec.md\` |\n`;
  const mapRows = w.children.map(c => {
    const n = c[0].split('-')[0];
    return `| ${n} | \`${c[0]}/\` | ${c[1]} | ${c[2]} |`;
  }).join('\n');
  const firstChild = w.children[0][0];
  const lastChild = w.children[w.children.length - 1][0];
  const trig = w.triggers.map(t => `  - "${t}"`).join('\n');
  return `---
title: "Feature Specification: ${w.name} [${ptr}/spec]"
description: "${w.purpose.split('.')[0]}."
trigger_phrases:
${trig}
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "${ptr}"
    last_updated_at: "2026-05-26T17:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored phase-parent map during the 026 wave-4 phase work."
    next_safe_action: "Resume or plan a child phase folder listed in the Phase Documentation Map."
    blockers: []
    key_files:
      - "spec.md"
    completion_pct: ${w.pct}
    open_questions: []
    answered_questions: []
---

# Feature Specification: ${w.name}

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | ${w.pct >= 100 ? 'Complete' : (w.pct <= 5 ? 'Deferred' : 'In Progress')} |
| **Created** | 2026-05-26 |
| **Branch** | \`027-graph-and-context-optimization\` |
${parentLine}<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
${w.purpose}

### Purpose
Own navigation, the child-phase map, and aggregate status for this theme. Each child phase folder owns its own planning, execution, and verification.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Coordinate the child phase folders for this theme and their aggregate status.
- Provide the navigation map from this theme to each child phase folder.

### Out of Scope
- Per-child implementation detail (lives in each child phase folder).
- Phase history narration (lives in the root \`context-index.md\`).

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| \`${firstChild}/\` … \`${lastChild}/\` | Modify | children | Per-child work lives in the child phase folders |
| \`spec.md\`, \`graph-metadata.json\`, \`description.json\` | Modify | this | Theme navigation and metadata |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> Each child below is an independently executable phase folder owning its own plan, tasks, checklist, decisions, and continuity. The Status column reports child state.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
${mapRows}

### Phase Transition Rules

- Each child MUST pass \`validate.sh\` independently.
- This parent tracks aggregate progress via the map; per-child detail stays in the children.
- Deferred and abandoned children remain in place with explicit status; they are not removed.
- Use \`/spec_kit:resume\` on a child folder to resume it.
- Run \`validate.sh --recursive\` on this folder to validate all children as a unit.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| \`${firstChild}\` | \`${lastChild}\` | Earlier children stable before later children build on them | Each child validates independently |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- None blocking. Deferred children are tracked in place and resumed via their folders when prioritized.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders \`[0-9][0-9][0-9]-*/\` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See \`../spec.md\`
- **Graph Metadata**: See \`graph-metadata.json\` for \`derived.last_active_child_id\` pointer
`;
}

let count = 0;
for (const w of W) {
  const out = path.join(ROOT, w.dir, 'spec.md');
  fs.writeFileSync(out, render(w));
  count++;
  console.log(`wrote ${w.dir}/spec.md (${w.children.length} children, ${w.pct}%)`);
}
console.log(`\nGenerated ${count} wrapper spec.md files.`);
