# Iteration 007: Traceability Overlay Protocols

**Dimension:** traceability (re-pass)  
**Mode:** review  
**Status:** complete  
**Focus:** Overlay protocols from iter-003 that may have been under-covered

---

## Dimension: Traceability

### Overlay Protocol Coverage

This iteration focused on traceability overlay protocols to ensure consistency across skill documentation, cross-runtime configurations, feature catalogs, and testing playbooks following the 011/005 opt-in-only closure implementation.

---

## Files Reviewed

- `.opencode/skills/system-spec-kit/SKILL.md:377-379` - Reranking opt-in documentation
- `.opencode/skills/system-rerank-sidecar/SKILL.md:12,222-223` - Consumer opt-in semantics
- `.claude/mcp.json:19,71` - Cross-runtime SPECKIT_CROSS_ENCODER references
- `.codex/config.toml:21,24` - Cross-runtime SPECKIT_CROSS_ENCODER references
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts:99-126` - Implementation of opt-in logic
- `.opencode/skills/system-rerank-sidecar/manual_testing_playbook/manual_testing_playbook.md:42-43,151` - Playbook opt-in references
- `.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md:4469` - Feature catalog SPECKIT_CROSS_ENCODER entry
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/005-opt-in-only-closure/implementation-summary.md:46-47,117-118` - Implementation evidence

---

## Findings by Severity

### P1 Findings

#### P1-001: Feature catalog default value mismatch for SPECKIT_CROSS_ENCODER

**File:** `.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md:4469`  
**Cluster:** feature_catalog_code  
**Title:** Feature catalog shows SPECKIT_CROSS_ENCODER as default true, contradicting 011/005 opt-in-only implementation

**Evidence:**
- Feature catalog line 4469 states: `SPECKIT_CROSS_ENCODER | true | boolean | lib/search/search-flags.ts | Enables cross-encoder reranking in Stage 3...`
- Implementation in search-flags.ts:99-108 shows default FALSE with explicit opt-in logic: `export function isCrossEncoderEnabled(): boolean { if (isOptInEnabled('SPECKIT_CROSS_ENCODER')) return true; ... return false; }`
- Implementation summary 011/005:46-47 documents: "flipped SPECKIT_CROSS_ENCODER to opt-in semantics"
- SKILL.md:379 documents: "Default is OFF based on the 011 decision arc"

**Counterevidence sought:** None - contradiction is direct

**Alternative explanation:** Possible that feature catalog was not updated during 011/005 implementation

**Final severity:** P1 - This is a documentation mismatch that could mislead operators about the default behavior. The feature catalog is intended as the canonical inventory, so having it show the wrong default value is significant.

**Confidence:** High - Implementation and SKILL.md documentation are clear about opt-in-only default

**Downgrade trigger:** If feature catalog is explicitly marked as "legacy" or there is documented intent to keep it showing pre-011/005 state for some reason

**Reproduction:** Read feature_catalog.md:4469 and compare with search-flags.ts:99-108 and SKILL.md:377-379

---

### P2 Findings

#### P2-001: No agent definition references in SKILL.md files

**File:** `.opencode/skills/system-spec-kit/SKILL.md`, `.opencode/skills/system-rerank-sidecar/SKILL.md`  
**Cluster:** skill_agent  
**Title:** SKILL.md files do not reference specific agent definitions

**Evidence:**
- Neither SKILL.md file contains @agent references or links to specific agent definitions in .opencode/agents/
- Grep for @.*agent patterns in both files returned no matches
- Agent files exist at .opencode/agents/ (ai-council.md, code.md, context.md, debug.md, etc.)

**Counterevidence sought:** Check if agent references are expected in SKILL.md files or if this is intentional design

**Alternative explanation:** SKILL.md files may be designed as standalone documentation without direct agent references, with routing handled by skill advisor

**Final severity:** P2 - This may be intentional design rather than a traceability issue. The skill advisor system may handle agent routing dynamically without hard-coded references in SKILL.md files.

**Confidence:** Medium - Unclear whether agent references are expected in SKILL.md files

**Downgrade trigger:** If there is documentation showing that SKILL.md files should not contain agent references

**Reproduction:** Grep for @.*agent patterns in both SKILL.md files and verify no agent references exist

---

#### P2-002: No feature catalog entry for 011/005 opt-in-only closure

**File:** `.opencode/skills/system-spec-kit/feature_catalog/`  
**Cluster:** feature_catalog_code  
**Title:** Feature catalog lacks dedicated entry for the 011/005 opt-in-only closure feature

**Evidence:**
- Feature catalog contains general SPECKIT_CROSS_ENCODER flag documentation but no dedicated entry describing the 011/005 opt-in-only closure decision
- Grep for "opt-in" in feature catalog shows 18 matches, but none specifically document the 011/005 rerank decision arc
- Implementation summary shows this was a significant decision affecting default behavior

**Counterevidence sought:** Check if 011/005 is documented elsewhere in feature catalog under different naming

**Alternative explanation:** The change may be considered a flag default change rather than a new feature requiring catalog entry

**Final severity:** P2 - While the flag itself is documented, the decision arc and rationale for the opt-in-only closure are not captured in the feature catalog, which could impact future maintainers' understanding of the change context.

**Confidence:** Medium - Feature catalog may not be intended to capture decision arc rationale

**Downgrade trigger:** If there is documentation showing that decision arcs should not have feature catalog entries

**Reproduction:** Search feature catalog for "011", "opt-in-only", "decision arc" and verify no dedicated entry exists

---

#### P2-003: No feature catalog or manual testing playbook in rerank-sidecar-arc scope

**File:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/`  
**Cluster:** feature_catalog_code, playbook_capability  
**Title:** No feature_catalog.md or manual_testing_playbook.md in rerank-sidecar-arc spec scope

**Evidence:**
- find_file_by_name for feature_catalog.md in rerank-sidecar-arc returned no results
- find_file_by_name for manual_testing_playbook.md in rerank-sidecar-arc returned no results
- These artifacts exist at the skill level (system-rerank-sidecar has manual_testing_playbook, system-spec-kit has feature_catalog) but not at the arc spec level

**Counterevidence sought:** Check if arc-level feature catalogs/playbooks are expected or if skill-level coverage is sufficient

**Alternative explanation:** Arc-level specs may not require their own feature catalogs/playbooks if skill-level coverage exists

**Final severity:** P2 - This may be intentional design. The skill-level manual_testing_playbook.md for system-rerank-sidecar does cover the arc's functionality, and the system-spec-kit feature catalog covers the flag behavior.

**Confidence:** Medium - Unclear whether arc-level artifacts are expected

**Downgrade trigger:** If there is documentation showing that arc specs should not have their own feature catalogs/playbooks

**Reproduction:** find_file_by_name for feature_catalog.md and manual_testing_playbook.md in rerank-sidecar-arc directory

---

## Traceability Checks

### skill_agent
- **Status:** P2 finding - No agent definition references found in SKILL.md files
- **Evidence:** Grep for @.*agent patterns returned no matches in both SKILL.md files
- **Assessment:** May be intentional design; skill advisor may handle routing dynamically

### agent_cross_runtime
- **Status:** PASS - Opt-in language consistent across runtimes
- **Evidence:** 
  - .claude/mcp.json:19,71 correctly references SPECKIT_CROSS_ENCODER=true as opt-in mechanism
  - .codex/config.toml:21,24 correctly references SPECKIT_CROSS_ENCODER=true as opt-in mechanism
  - Both runtimes align with the opt-in semantics from 011/005
- **Assessment:** Cross-runtime consistency is maintained

### feature_catalog_code
- **Status:** P1 finding - Default value mismatch in feature catalog
- **Evidence:** Feature catalog shows SPECKIT_CROSS_ENCODER as default true, but implementation changed it to default false in 011/005
- **Assessment:** Significant documentation mismatch requiring correction

### playbook_capability
- **Status:** PASS - Manual testing playbook correctly references opt-in semantics
- **Evidence:** system-rerank-sidecar/manual_testing_playbook/manual_testing_playbook.md:42-43 correctly documents spec-memory as opt-in via SPECKIT_CROSS_ENCODER=true
- **Assessment:** Playbook coverage is accurate and consistent with implementation

### cross_file_consistency
- **Status:** PASS - No generated scripts/dist directory found to check
- **Evidence:** scripts/dist directory does not exist or is inaccessible
- **Assessment:** Cannot verify generated file consistency, but no generated files were found in the expected location

---

## Verdict

**CONDITIONAL** - hasAdvisories=true

The traceability overlay protocol review identified one P1 finding (feature catalog default value mismatch) and three P2 findings (agent references, feature catalog decision arc coverage, arc-level artifact placement). The cross-runtime consistency and playbook capability checks passed. The P1 finding represents a significant documentation mismatch that should be corrected to maintain the feature catalog as an accurate source of truth.

---

## Next Dimension

Given that:
- This was a traceability re-pass focusing on overlay protocols
- One P1 finding was identified requiring documentation correction
- Cross-runtime consistency and playbook coverage passed
- Prior findings total: P0=0, P1=4, P2=13

Recommend proceeding to **maintainability** dimension for iteration 008, or addressing the P1 finding before continuing if the operator prefers to resolve documentation mismatches first.