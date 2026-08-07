# Iter 010 — Capstone (uncovered dimensions + meta-patterns)

## Question

(A) What gap-dimension is NOT yet covered by iters 001-009? Pick one and surface any findings. (B) What META-PATTERN across the 32 cumulative gaps from iters 001-009 points at a single root cause requiring a coordinated remediation? Identify at least one meta-pattern with the affected LG-#### list.

## Evidence (file:line citations required)

### Step 1: Prior iterations summary

**Iter 1 (reducer drift):** 8 gaps - LG-0001 to LG-0008 <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/000-release-cleanup/003-deep-review/research/iterations/iter-01-cli-devin.json" />

**Iter 2 (feature_catalog drift):** 7 gaps - LG-0009 to LG-0015 <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/000-release-cleanup/003-deep-review/research/iterations/iter-02-cli-devin.json" />

**Iter 3 (playbook-runtime drift):** 5 gaps - LG-0016 to LG-0020 <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/000-release-cleanup/003-deep-review/research/iterations/iter-03-cli-devin.json" />

**Iter 4 (convergence-defaults drift):** 2 gaps - LG-0021 to LG-0022 <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/000-release-cleanup/003-deep-review/research/iterations/iter-04-cli-devin.json" />

**Iter 5 (skill-wide doc-no-impl drift):** 2 gaps - LG-0023 to LG-0024 <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/000-release-cleanup/003-deep-review/research/iterations/iter-05-cli-devin.json" />

**Iter 6 (cross-skill dep drift):** 3 gaps - LG-0025 to LG-0027 <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/000-release-cleanup/003-deep-review/research/iterations/iter-06-cli-devin.json" />

**Iter 7 (CP suite drift):** 3 gaps - LG-0028 to LG-0030 <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/000-release-cleanup/003-deep-review/research/iterations/iter-07-cli-devin.json" />

**Iter 8 (severity model):** 0 gaps - ZERO drift <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/000-release-cleanup/003-deep-review/research/iterations/iter-08-cli-devin.json" />

**Iter 9 (within-doc consistency):** 2 gaps - LG-0031 to LG-0032 <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/000-release-cleanup/003-deep-review/research/iterations/iter-09-cli-devin.json" />

### Step 2: Counts-by-category table

| Category | Iteration | Gap Count | LG Range | Severity Breakdown |
|----------|-----------|-----------|----------|-------------------|
| Reducer drift | 1 | 8 | LG-0001 to LG-0008 | P1:6, P2:2 |
| Feature_catalog drift | 2 | 7 | LG-0009 to LG-0015 | P1:5, P2:2 |
| Playbook-runtime drift | 3 | 5 | LG-0016 to LG-0020 | P1:1, P2:4 |
| Convergence-defaults drift | 4 | 2 | LG-0021 to LG-0022 | P0:1, P2:1 |
| Skill-wide doc-no-impl drift | 5 | 2 | LG-0023 to LG-0024 | P1:1, P2:1 |
| Cross-skill dep drift | 6 | 3 | LG-0025 to LG-0027 | P0:1, P1:1, P2:1 |
| CP suite drift | 7 | 3 | LG-0028 to LG-0030 | P2:3 |
| Severity model | 8 | 0 | N/A | N/A |
| Within-doc consistency | 9 | 2 | LG-0031 to LG-0032 | P0:1, P1:1 |
| **TOTAL** | **9** | **32** | **LG-0001 to LG-0032** | **P0:3, P1:14, P2:15** |

### Step 3: Candidate uncovered dimensions

**Dimension 1: JSONL schema enforcement across YAML workflow vs reducer**
- Rationale: The YAML workflow (deep_start-review-loop_auto.yaml) contains extensive JSONL append operations with specific event shapes (lines 206, 215, 566) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml" lines="206,215,566" />, but the reducer's parseJsonlDetailed function (lines 127-151) only performs generic JSON.parse with basic error handling <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/scripts/reduce-state.cjs" lines="127-151" />. There is no schema validation that the workflow's required fields (type, event, mode, etc.) are actually present.

**Dimension 2: Agent-runtime parity across .opencode/.claude/.codex/.gemini**
- Rationale: State format documentation references multiple runtime directories (.opencode, .claude, .codex, .gemini) for agent definitions <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/references/state_format.md" lines="183,293,815,816,874" />, but no iteration has verified whether the deep-review agent definition is consistent across these runtimes. This could lead to behavioral drift if different runtimes have different agent configurations.

**Dimension 3: Error-handling coverage in scripts**
- Rationale: The reducer has error handling (try-catch blocks at lines 63-64, 139-147, 1170-1171) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/scripts/reduce-state.cjs" lines="63-64,139-147,1170-1171" />, but there's no verification that all error paths are covered or that error messages are actionable. No iteration has audited error-handling completeness.

### Step 4: Investigation of JSONL schema enforcement dimension

**Investigation findings:**

The YAML workflow enforces JSONL record shapes through explicit append operations with required fields:

- Resume event: `{"type":"event","event":"resumed","mode":"review","sessionId":"...","parentSessionId":"...","lineageMode":"resume","continuedFromRun":N,"generation":1,"archivedPath":null,"timestamp":"..."}` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml" line="206" />

- Restart event: Similar shape with lineageMode="restart" and archivedPath <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml" line="215" />

- Migration event: `{"type":"event","event":"migration","mode":"review","legacyArtifacts":[...],"canonicalArtifacts":[...],"timestamp":"..."}` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml" line="188" />

However, the reducer's parseJsonlDetailed function only validates JSON syntax:

```javascript
function parseJsonlDetailed(jsonlContent) {
  const records = [];
  const corruptionWarnings = [];
  let lineNumber = 0;

  for (const rawLine of jsonlContent.split('\n')) {
    lineNumber += 1;
    const line = rawLine.trim();
    if (!line) {
      continue;
    }

    try {
      records.push(JSON.parse(line));  // Only syntax validation
    } catch (error) {
      corruptionWarnings.push({
        line: lineNumber,
        raw: rawLine.length > 200 ? `${rawLine.slice(0, 200)}...` : rawLine,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return { records, corruptionWarnings };
}
```
<ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/scripts/reduce-state.cjs" lines="127-151" />

**Schema documentation exists but is not enforced:**

state_format.md defines required fields for each event type:
- iteration records: required fields include `type`, `mode`, `run`, `status`, `focus`, `dimensions`, `filesReviewed`, `findingsCount`, `sessionId`, `generation`, `lineageMode`, `timestamp` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/references/state_format.md" lines="180-212" />
- event records: required fields include `type`, `event`, `mode`, `timestamp` plus event-specific fields <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/references/state_format.md" lines="299-365" />

**Gap identified:** LG-0033 - JSONL schema enforcement gap

The reducer accepts any valid JSON regardless of whether it contains the required fields documented in state_format.md. This means:
1. Malformed records (missing required fields) can pass through the reducer silently
2. The YAML workflow's contract enforcement is not backed by runtime validation
3. Downstream consumers (dashboard, analysis tools) may encounter undefined field access errors

**Evidence:**
- Workflow assumes specific shapes: <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml" lines="206,215,566" />
- Reducer does not validate shapes: <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/scripts/reduce-state.cjs" lines="127-151" />
- Schema documentation defines required fields: <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/references/state_format.md" lines="180-212,299-365" />

### Step 5: Meta-pattern identification

**Meta-pattern 1: Gate model drift cluster**

Root cause: The legal-stop gate model has accumulated drift across 5 surfaces, all stemming from incomplete propagation when the gate model was extended from 3 gates to 7 gates.

Affected gaps:
- LG-0013: Extended quality gates only mentioned in passing in feature_catalog, full contracts not surfaced <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/000-release-cleanup/003-deep-review/research/iterations/iter-02-cli-devin.json" />
- LG-0016: DRV-018 scenario claims 3 gates but runtime contract specifies 7 gates <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/000-release-cleanup/003-deep-review/research/iterations/iter-03-cli-devin.json" />
- LG-0031: convergence.md has 3-way within-doc contradiction on gate count (7 vs 6 vs missing claimAdjudication) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/000-release-cleanup/003-deep-review/research/iterations/iter-09-cli-devin.json" />
- LG-0032: loop_protocol.md gate-count drift (5 vs 6+) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/000-release-cleanup/003-deep-review/research/iterations/iter-09-cli-devin.json" />

Coordinated remediation: Reconcile all gate-model surfaces against the AUTHORITATIVE event shape in state_format.md §Section-1 (7 gates with Gate suffix: convergenceGate, dimensionCoverageGate, p0ResolutionGate, evidenceDensityGate, hotspotSaturationGate, claimAdjudicationGate, fixCompletenessReplayGate) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/references/convergence.md" lines="105-117" />

**Meta-pattern 2: Documentation-promise-no-implementation cluster**

Root cause: Three gaps share the same pattern - documentation describes behavior that has no runtime implementation surface.

Affected gaps:
- LG-0022: Security-sensitive fix overrides documented in convergence.md but no implementation in config/yaml/reducer <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/000-release-cleanup/003-deep-review/research/iterations/iter-04-cli-devin.json" />
- LG-0004: graphEvents array processing documented in state_format.md but zero implementation in reducer <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/000-release-cleanup/003-deep-review/research/iterations/iter-01-cli-devin.json" />
- LG-0006: traceabilityChecks field processing documented in state_format.md but zero implementation in reducer <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/000-release-cleanup/003-deep-review/research/iterations/iter-01-cli-devin.json" />

Coordinated remediation: Either (a) implement the missing features in reducer/config (out of scope per ADR-002) OR (b) mark the documented sections as "SPEC ONLY / future implementation" in the relevant docs (in scope for doc-only cleanup).

**Meta-pattern 3: Path-reference staleness from skill split**

Root cause: The deep-research → deep-review skill split left stale path references in playbook scenarios.

Affected gaps:
- LG-0017: DRV-017 references wrong skill path (deep-research instead of deep-review) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/000-release-cleanup/003-deep-review/research/iterations/iter-03-cli-devin.json" />
- LG-0018: DRV-018 references wrong skill path <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/000-release-cleanup/003-deep-review/research/iterations/iter-03-cli-devin.json" />
- LG-0019: DRV-019 references wrong skill path <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/000-release-cleanup/003-deep-review/research/iterations/iter-03-cli-devin.json" />
- LG-0020: DRV-020 references wrong skill path <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/000-release-cleanup/003-deep-review/research/iterations/iter-03-cli-devin.json" />
- LG-0025: 5 dir-08 scenarios have stale test path references from AF-0023 migration <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/000-release-cleanup/003-deep-review/research/iterations/iter-06-cli-devin.json" />

Coordinated remediation: Run a global search-replace for `.opencode/skills/deep-research/` → `.opencode/skills/deep-review/` across all playbook scenarios, plus verify test path references match actual file locations after migrations.

## Findings (numbered) — covering uncovered-dimension(s) AND meta-pattern(s)

1. **Uncovered dimension: JSONL schema enforcement gap (LG-0033)** - The YAML workflow enforces specific JSONL record shapes with required fields (type, event, mode, sessionId, etc.) but the reducer's parseJsonlDetailed function only validates JSON syntax, not schema compliance. This creates a contract enforcement gap where malformed records can pass through silently, potentially causing downstream errors in dashboard/analysis tools. The schema documentation in state_format.md defines required fields but there is no runtime validation to enforce them. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml" lines="206,215,566" /> <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/scripts/reduce-state.cjs" lines="127-151" /> <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/references/state_format.md" lines="180-212,299-365" />

2. **Meta-pattern 1: Gate model drift cluster** - Four gaps (LG-0013, LG-0016, LG-0031, LG-0032) share a single root cause: incomplete propagation when the legal-stop gate model was extended from 3 gates to 7 gates. The drift spans feature_catalog, playbook scenarios, convergence.md (within-doc), and loop_protocol.md (within-doc). Coordinated remediation requires reconciling all surfaces against the AUTHORITATIVE 7-gate event shape in state_format.md §Section-1. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/references/convergence.md" lines="105-117" />

3. **Meta-pattern 2: Documentation-promise-no-implementation cluster** - Three gaps (LG-0022, LG-0004, LG-0006) share the pattern where documentation describes behavior with no runtime implementation: security-sensitive fix overrides, graphEvents processing, and traceabilityChecks processing. This suggests a systematic issue where feature documentation was written without corresponding implementation, or implementation was removed without updating docs. Coordinated remediation requires either implementing the features (out of scope per ADR-002) or marking docs as "SPEC ONLY / future implementation." <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/000-release-cleanup/003-deep-review/research/iterations/iter-04-cli-devin.json" /> <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/000-release-cleanup/003-deep-review/research/iterations/iter-01-cli-devin.json" />

4. **Meta-pattern 3: Path-reference staleness from skill split** - Five gaps (LG-0017, LG-0018, LG-0019, LG-0020, LG-0025) stem from incomplete path updates during the deep-research → deep-review skill split and the AF-0023 test migration. This represents a class-of-bug where search-replace operations missed prose-style references (SOURCE METADATA blocks) while updating command-line references. Coordinated remediation requires global search-replace plus verification of test path references. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/000-release-cleanup/003-deep-review/research/iterations/iter-03-cli-devin.json" /> <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/000-release-cleanup/003-deep-review/research/iterations/iter-06-cli-devin.json" />

## Gaps for next iter

None - phase 5 ends with this capstone iteration. All 33 gaps (LG-0001 to LG-0033) have been identified across 10 iterations.

## JSONL delta row

```json
{"iter_id":"010","timestamp_utc":"2026-05-23T17:49:00Z","executor":"cli-devin","model":"swe-1.6","status":"complete","findings_count":4,"gaps_count":1,"primary_evidence_files":[".opencode/commands/deep/assets/deep_start-review-loop_auto.yaml",".opencode/skills/deep-review/scripts/reduce-state.cjs",".opencode/skills/deep-review/references/state_format.md",".opencode/skills/deep-review/references/convergence.md"]}
```