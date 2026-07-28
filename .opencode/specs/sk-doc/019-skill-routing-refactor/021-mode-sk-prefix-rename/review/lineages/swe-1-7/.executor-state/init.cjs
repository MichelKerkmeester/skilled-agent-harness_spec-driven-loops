const fs = require('fs');
const path = require('path');
const artifactDir = '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/0114-sk-doc-mode-sk-prefix-rename/.opencode/specs/sk-doc/019-skill-routing-refactor/021-mode-sk-prefix-rename/review/lineages/swe-1-7';

const config = {
  topic: "One sk- prefix across every mode packet and routing key",
  sessionId: "fanout-swe-1-7-1785217654899-ls3rh2",
  parentSessionId: null,
  lineageMode: "new",
  generation: 1,
  continuedFromRun: null,
  migrationWindowEndsAt: "",
  maxIterations: 10,
  convergenceThreshold: 0.10,
  antiConvergence: {
    minIterations: 2,
    convergenceMode: "default",
    stopPolicy: "max-iterations"
  },
  stuckThreshold: 2,
  maxDurationMinutes: 240,
  maxToolCallsPerIteration: 12,
  maxMinutesPerIteration: 10,
  progressiveSynthesis: false,
  specFolder: ".opencode/specs/sk-doc/019-skill-routing-refactor/021-mode-sk-prefix-rename",
  createdAt: "2026-07-28T12:00:00.000Z",
  status: "initialized",
  releaseReadinessState: "in-progress",
  executionMode: "auto",
  executor: {
    kind: "cli-devin",
    model: "swe-1-7",
    reasoningEffort: null,
    serviceTier: null,
    sandboxMode: "accept-edits",
    timeoutSeconds: 900
  },
  mode: "review",
  reviewTarget: ".opencode/specs/sk-doc/019-skill-routing-refactor/021-mode-sk-prefix-rename",
  reviewTargetType: "spec-folder",
  reviewDimensions: ["correctness", "security", "traceability", "maintainability"],
  severityThreshold: "P2",
  crossReference: {
    core: ["spec_code", "checklist_evidence"],
    overlay: ["skill_agent", "agent_cross_runtime", "feature_catalog_code", "playbook_capability"]
  },
  qualityGateThreshold: true,
  runtimeCapabilityResolver: ".opencode/skills/system-deep-loop/deep-review/scripts/runtime-capabilities.cjs",
  reducerScriptPath: ".opencode/skills/system-deep-loop/runtime/scripts/reduce-state.cjs",
  "config.fanout_lineage_artifact_dir": ".opencode/specs/sk-doc/019-skill-routing-refactor/021-mode-sk-prefix-rename/review/lineages/swe-1-7",
  stopPolicy: "max-iterations",
  lineageTimeoutHours: 4,
  fileProtection: {
    "deep-review-config.json": "immutable",
    "deep-review-state.jsonl": "append-only",
    "deep-review-findings-registry.json": "auto-generated",
    "deep-review-strategy.md": "mutable",
    "deep-review-dashboard.md": "auto-generated",
    ".deep-review-pause": "operator-controlled",
    "review-report.md": "mutable",
    "review-report-v*.md": "write-once",
    "iteration-*.md": "write-once"
  },
  reducer: {
    enabled: true,
    inputs: ["latestJSONLDelta", "newIterationFile", "priorReducedState"],
    outputs: ["findingsRegistry", "dashboardMetrics", "strategyUpdates"],
    metrics: ["dimensionsCovered", "findingsBySeverity", "openFindings", "resolvedFindings", "convergenceScore"]
  }
};

fs.mkdirSync(path.join(artifactDir, 'iterations'), { recursive: true });
fs.mkdirSync(path.join(artifactDir, 'deltas'), { recursive: true });
fs.mkdirSync(path.join(artifactDir, 'prompts'), { recursive: true });

fs.writeFileSync(path.join(artifactDir, 'deep-review-config.json'), JSON.stringify(config, null, 2) + '\n', 'utf8');

const stateInit = {
  type: "event",
  event: "initialized",
  mode: "review",
  reviewTarget: config.reviewTarget,
  reviewTargetType: config.reviewTargetType,
  reviewDimensions: config.reviewDimensions,
  sessionId: config.sessionId,
  lineageMode: config.lineageMode,
  generation: config.generation,
  maxIterations: config.maxIterations,
  stopPolicy: config.stopPolicy,
  convergenceThreshold: config.convergenceThreshold,
  timestamp: new Date().toISOString(),
  targetAgent: "deep-review",
  resolvedRoute: "system-deep-loop/deep-review/SKILL.md -> deep-review-auto.yaml",
  agentDefinitionLoaded: true
};

fs.writeFileSync(path.join(artifactDir, 'deep-review-state.jsonl'), JSON.stringify(stateInit) + '\n', 'utf8');

const strategy = `# Deep Review Strategy - One sk- prefix rename review

## 1. OVERVIEW
Iterative review of the sk- prefix rename implementation across sk-code, sk-design, sk-doc and sk-prompt hubs.

## 2. TOPIC
One sk- prefix across every mode packet and routing key

## 3. REVIEW DIMENSIONS (remaining)
<!-- MACHINE-OWNED: START -->
- [ ] D1 Correctness, Logic errors, off-by-one, wrong return types, broken invariants
- [ ] D2 Security, Injection, auth bypass, secrets exposure, unsafe deserialization
- [ ] D3 Traceability, Spec/code alignment, checklist evidence, cross-reference integrity
- [ ] D4 Maintainability, Patterns, clarity, documentation quality, safe follow-on change cost
<!-- MACHINE-OWNED: END -->

## 4. NON-GOALS
No implementation changes; review only.

## 5. STOP CONDITIONS
Run all 10 iterations (stop-policy = max-iterations).

## 6. COMPLETED DIMENSIONS
<!-- MACHINE-OWNED: START -->
| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|
<!-- MACHINE-OWNED: END -->

## 7. RUNNING FINDINGS
<!-- MACHINE-OWNED: START -->
- **P0 (Critical):** 0 active
- **P1 (Major):** 0 active
- **P2 (Minor):** 0 active
- **Delta this iteration:** +0 P0, +0 P1, +0 P2
<!-- MACHINE-OWNED: END -->

## 8. WHAT WORKED

## 9. WHAT FAILED

## 10. EXHAUSTED APPROACHES (do not retry)

## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
<!-- MACHINE-OWNED: START -->
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded
<!-- MACHINE-OWNED: END -->

## 11. RULED OUT DIRECTIONS

## 12. NEXT FOCUS
<!-- MACHINE-OWNED: START -->
D1 Correctness: compare the rename-map.json against the four hub mode-registries, hub-routers, leaf-manifests and actual packet directories.
<!-- MACHINE-OWNED: END -->

## 13. KNOWN CONTEXT
### Bounded Context Snapshot
- Target pointers: \`.opencode/specs/sk-doc/019-skill-routing-refactor/021-mode-sk-prefix-rename\`, \`.opencode/skills/sk-code/mode-registry.json\`, \`.opencode/skills/sk-design/mode-registry.json\`, \`.opencode/skills/sk-doc/mode-registry.json\`, \`.opencode/skills/sk-prompt/mode-registry.json\`, and corresponding hub-routers/leaf-manifests.
- Behavior claims: 20 packets renamed with sk- prefix; 21 workflowMode keys renamed; one shared-packet exception for sk-create-skill/sk-create-skill-parent.
- Reuse and conventions: Hub registry schema with workflowMode, packet, packetSkillName, grandfatheredFolderMismatch.
- Review risks and gaps: Out-of-scope hubs (cli-external-orchestration, mcp-tooling, system-deep-loop) may still hold old references; benchmark gold may be stale; historical reports intentionally keep old names.

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| \`spec_code\` | core | pending | - | - |
| \`checklist_evidence\` | core | pending | - | - |
| \`skill_agent\` | overlay | pending | - | - |
| \`agent_cross_runtime\` | overlay | pending | - | - |
| \`feature_catalog_code\` | overlay | pending | - | - |
| \`playbook_capability\` | overlay | pending | - | - |
<!-- MACHINE-OWNED: END -->

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| \`.opencode/specs/sk-doc/019-skill-routing-refactor/021-mode-sk-prefix-rename/spec.md\` | - | - | - | pending |
| \`.opencode/specs/sk-doc/019-skill-routing-refactor/021-mode-sk-prefix-rename/assets/rename-map.json\` | - | - | - | pending |
| \`.opencode/skills/sk-*/mode-registry.json\` | - | - | - | pending |
| \`.opencode/skills/sk-*/hub-router.json\` | - | - | - | pending |
| \`.opencode/skills/sk-*/leaf-manifest.json\` | - | - | - | pending |
<!-- MACHINE-OWNED: END -->

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 10
- Convergence threshold: 0.10
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-swe-1-7-1785217654899-ls3rh2, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: \`deep-review-findings-registry.json\`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=spec_code,checklist_evidence; overlay=skill_agent,agent_cross_runtime,feature_catalog_code,playbook_capability
- Started: 2026-07-28T12:00:00.000Z
<!-- MACHINE-OWNED: END -->
`;

fs.writeFileSync(path.join(artifactDir, 'deep-review-strategy.md'), strategy, 'utf8');

console.log('init done');
