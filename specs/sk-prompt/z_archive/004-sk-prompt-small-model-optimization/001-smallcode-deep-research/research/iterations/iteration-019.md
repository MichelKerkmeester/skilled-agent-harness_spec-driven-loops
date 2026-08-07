# Iteration 019 — Operational Concerns: Infrastructure Impact Assessment

**Iteration:** 19 of 20  
**Focus:** OPERATIONAL CONCERNS — Infrastructure impact of 12 follow-on packets + sentinel skill  
**Status:** Insight  
**New Info Ratio:** 0.15

---

## Focus

Identify infrastructure-level changes needed across spec-kit validator, memory indexing, skill-advisor, code-graph, CI checks, and AGENTS.md hooks to accommodate the 41 artifacts + HYBRID-with-Anchor sentinel skill from the 12 follow-on packets. Produce per-system change list with effort estimates, sequencing constraints, and cross-system dependency notes.

---

## Actions Taken

1. **Read research.md §RQ5 cross-cutting** (lines 1-10) to understand the 12 follow-on packets and HYBRID-with-Anchor architecture verdict.
2. **Read iter-018.md** (lines 1-165) to understand sequencing decisions and dependency graph.
3. **Read system-spec-kit SKILL.md** (lines 1-395) to understand validator and memory indexing surfaces.
4. **Read system-skill-advisor SKILL.md** (lines 1-287) to understand advisor scoring and skill graph infrastructure.
5. **Read system-code-graph SKILL.md** (lines 1-230) to understand structural indexing and graph representation.
6. **Read memory_system.md** (lines 1-150) to understand memory indexing categories and pipeline.
7. **Read advisor-scorer.md** (lines 1-150) to understand lane attribution and confidence calibration.
8. **Read validate.sh** (lines 1-100) to understand validator registry and rule execution.
9. **Read isolation-check.yml** (full file) to understand current CI checks.
10. **Composed operational impact table** with per-system changes, effort estimates, and sequencing constraints.

---

## Operational Impact Table

| Infrastructure System | Required Change | Effort | Sequencing Constraint | Risk |
|---|---|---|---|---|
| **Spec-kit Validator** | Add permissions-matrix.schema.json conformance check rule to validator registry | Medium | Must ship before 010-permissions-matrix packet | Low |
| **Spec-kit Validator** | Add sk-small-model sentinel structure check rule (if sentinel skill is created as standalone) | Low | Must ship before 012-rq5-cross-cutting-sentinel-skill packet | Low |
| **Spec-kit Validator** | Add graph-metadata.json enhances edges validation rule | Medium | Must ship before 012-rq5-cross-cutting-sentinel-skill packet | Low |
| **Memory Indexing** | Add new memory category for small-model patterns (optional, can use existing categories) | Low | No sequencing constraint (optional enhancement) | Low |
| **Memory Indexing** | Add cross-skill memory linking for enhances edges between cli-devin/cli-opencode patterns | Medium | Must ship after 012-rq5-cross-cutting-sentinel-skill packet | Low |
| **Skill-advisor Scorer** | Re-index skill graph after 012 enhances edges are added to graph-metadata.json files | Low | Must ship after 012-rq5-cross-cutting-sentinel-skill packet | Low |
| **Skill-advisor Scorer** | Add lexical lane keywords for small-model patterns (context budget, verification pipeline, model profiles) | Low | Must ship before 001/005/007 packets for advisor routing | Low |
| **Skill-advisor Scorer** | Threshold tuning for small-model-specific routing (optional, current thresholds likely sufficient) | Low | No sequencing constraint (optional enhancement) | Low |
| **Code-graph** | No changes required (enhances edges are skill-graph, not code-graph) | N/A | N/A | N/A |
| **CI Checks** | Add permissions-matrix schema validation check to isolation-check.yml | Medium | Must ship before 010-permissions-matrix packet | Low |
| **CI Checks** | Add graph-metadata.json enhances edges validation check to isolation-check.yml | Medium | Must ship before 012-rq5-cross-cutting-sentinel-skill packet | Low |
| **AGENTS.md** | Add "Small-model dispatch rule" parsing entry for HYBRID-with-Anchor sentinel skill | Low | Must ship before 012-rq5-cross-cutting-sentinel-skill packet | Low |

---

## Cross-System Dependency Notes

### Dependency Chain 1: Permissions Matrix Infrastructure
- **010-permissions-matrix packet** introduces permissions-matrix.schema.json (JSON schema for tool permission categories)
- **Spec-kit validator** must add conformance check rule before 010 ships (otherwise schema validation is manual)
- **CI checks** should add schema validation to isolation-check.yml before 010 ships (prevents malformed schemas from merging)
- **Sequencing constraint:** Validator rule and CI check must ship BEFORE 010-permissions-matrix packet

### Dependency Chain 2: Sentinel Skill and Enhances Edges
- **012-rq5-cross-cutting-sentinel-skill packet** introduces HYBRID-with-Anchor sentinel skill + enhances edges in graph-metadata.json files
- **Spec-kit validator** must add graph-metadata.json enhances edges validation rule before 012 ships
- **Skill-advisor scorer** must re-index skill graph after 012 ships (enhances edges affect advisor routing)
- **AGENTS.md** must add small-model dispatch rule parsing entry before 012 ships
- **Memory indexing** should add cross-skill linking for enhances edges after 012 ships (optional but recommended)
- **Sequencing constraint:** Validator rule and AGENTS.md entry must ship BEFORE 012 packet; skill-advisor re-indexing must happen AFTER 012 packet

### Dependency Chain 3: Lexical Lane Keywords for Advisor Routing
- **Packets 001/005/007** (context budget, verification pipeline, model profiles) add new reference docs to cli-devin/cli-opencode
- **Skill-advisor scorer** should add lexical lane keywords for these patterns before packets ship (enables advisor routing)
- **Sequencing constraint:** Lexical keywords should ship BEFORE 001/005/007 packets (but can be added incrementally)

### No Code-Graph Changes Required
- The enhances edges from RQ5 are skill-graph edges (system-skill-advisor domain), not code-graph edges (system-code-graph domain)
- Code-graph focuses on structural code indexing (AST, symbols, calls, imports)
- Skill-graph focuses on skill metadata relationships (enhances, siblings, depends_on)
- No code-graph infrastructure changes are needed for the 12 packets

---

## Pre-Implementation Infrastructure Prerequisite List

### Prerequisite 1: Spec-kit Validator Rules (Before Packet 010)
**System:** Spec-kit Validator  
**Change:** Add permissions-matrix.schema.json conformance check rule to validator registry  
**File:** `.opencode/skills/system-spec-kit/scripts/spec/validate.sh` (line 22 references validator-registry.json)  
**Effort:** Medium (2-3 hours)  
**Risk:** Low (schema validation is well-understood pattern)  
**Sequencing:** Must ship BEFORE 010-permissions-matrix packet  

**Implementation notes:**
- Add new rule to `VALIDATOR_REGISTRY_JSON` path at line 22
- Rule should validate JSON schema structure and required fields (category classification, allowlist filtering, structured matrix)
- Should integrate with existing `--strict` mode (warnings as errors)
- Test with sample permissions-matrix.schema.json from packet 010 artifacts

---

### Prerequisite 2: CI Schema Validation Check (Before Packet 010)
**System:** CI Checks  
**Change:** Add permissions-matrix schema validation check to isolation-check.yml  
**File:** `.github/workflows/isolation-check.yml` (add new job step after existing isolation checks)  
**Effort:** Medium (2-3 hours)  
**Risk:** Low (follows existing isolation-check pattern)  
**Sequencing:** Must ship BEFORE 010-permissions-matrix packet  

**Implementation notes:**
- Add new step: "Validate permissions-matrix.schema.json conformance"
- Use same pattern as existing isolation checks (ripgrep + error handling)
- Check that schema validates against JSON Schema Draft 7 spec
- Check that required fields exist (category_classification, allowlist_filtering, structured_matrix, runtime_enforcement)
- Fail PR if schema is malformed or missing required fields

---

### Prerequisite 3: Spec-kit Validator Graph-Metadata Rule (Before Packet 012)
**System:** Spec-kit Validator  
**Change:** Add graph-metadata.json enhances edges validation rule  
**File:** `.opencode/skills/system-spec-kit/scripts/spec/validate.sh` (extend validator registry)  
**Effort:** Medium (2-3 hours)  
**Risk:** Low (graph-metadata validation is existing pattern)  
**Sequencing:** Must ship BEFORE 012-rq5-cross-cutting-sentinel-skill packet  

**Implementation notes:**
- Add new rule to validate graph-metadata.json enhances edges structure
- Check that enhances edges reference valid target skill IDs
- Check that edge weights are within valid range (0.0-1.0)
- Check that enhances edges do not create cycles (graph validation)
- Integrate with existing `RULE_SEVERITY_GRAPH_METADATA` severity settings (lines 83-84)

---

### Prerequisite 4: AGENTS.md Small-Model Dispatch Rule (Before Packet 012)
**System:** AGENTS.md  
**Change:** Add "Small-model dispatch rule" parsing entry for HYBRID-with-Anchor sentinel skill  
**File:** `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/AGENTS.md` (add new rule section)  
**Effort:** Low (1 hour)  
**Risk:** Low (rule addition is straightforward)  
**Sequencing:** Must ship BEFORE 012-rq5-cross-cutting-sentinel-skill packet  

**Implementation notes:**
- Add new rule: "Small-model dispatch: Use cli-devin for SWE-1.6 context budget, verification pipeline, and model profiles; use cli-opencode for permissions matrix and eviction system"
- Reference the HYBRID-with-Anchor architecture from iter-014
- Include cross-reference to 012 packet artifacts (AGENTS.md pointer, enhances edges)
- Follow existing AGENTS.md rule format (see current rules for pattern)

---

### Prerequisite 5: Skill-Advisor Lexical Lane Keywords (Before Packets 001/005/007)
**System:** Skill-Advisor Scorer  
**Change:** Add lexical lane keywords for small-model patterns  
**File:** `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/lexical.ts` (extend TOKEN_BOOSTS and PHRASE_BOOSTS)  
**Effort:** Low (1-2 hours)  
**Risk:** Low (lexical keyword addition is low-risk)  
**Sequencing:** Should ship BEFORE 001/005/007 packets (enables advisor routing)  

**Implementation notes:**
- Add TOKEN_BOOSTS for: "context budget", "token budget", "truncation", "eviction" → cli-devin/cli-opencode
- Add PHRASE_BOOSTS for: "verification pipeline", "confidence scoring", "hard fail" → cli-devin
- Add PHRASE_BOOSTS for: "model profiles", "escalation" → cli-devin
- Follow existing lexical lane pattern (advisor-scorer.md lines 55-57)
- Weight suggestions: 0.3-0.5 for tokens, 0.4-0.6 for phrases (consistent with existing boosts)

---

### Prerequisite 6: Skill-Advisor Graph Re-indexing (After Packet 012)
**System:** Skill-Advisor Scorer  
**Change:** Re-index skill graph after 012 enhances edges are added  
**File:** Manual run of `advisor_rebuild` MCP tool after 012 packet completion  
**Effort:** Low (15 minutes)  
**Risk:** Low (re-indexing is routine maintenance)  
**Sequencing:** Must ship AFTER 012-rq5-cross-cutting-sentinel-skill packet  

**Implementation notes:**
- After 012 packet completes, run `mcp__mk_skill_advisor__advisor_rebuild` to refresh skill graph
- Verify that enhances edges from 012 are present in skill graph query results
- Verify that advisor routing now surfaces cli-devin/cli-opencode patterns for small-model queries
- Document re-indexing step in 012 packet implementation-summary.md

---

### Optional Enhancement 1: Memory Cross-Skill Linking (After Packet 012)
**System:** Memory Indexing  
**Change:** Add cross-skill memory linking for enhances edges  
**File:** `.opencode/skills/system-spec-kit/mcp_server/lib/memory/` (extend memory linking logic)  
**Effort:** Medium (3-4 hours)  
**Risk:** Low (memory linking is optional enhancement)  
**Sequencing:** Should ship AFTER 012-rq5-cross-cutting-sentinel-skill packet  

**Implementation notes:**
- Extend memory linking to follow enhances edges between skills
- When searching for cli-devin context budget patterns, also surface related cli-opencode permissions patterns via enhances edges
- Use existing memory causal linking infrastructure (memory_causal_link tool)
- This is optional because current memory search already works well; enhances linking would improve cross-skill discovery

---

### Optional Enhancement 2: CI Graph-Metadata Validation (Before Packet 012)
**System:** CI Checks  
**Change:** Add graph-metadata.json enhances edges validation check to isolation-check.yml  
**File:** `.github/workflows/isolation-check.yml` (add new job step)  
**Effort:** Medium (2-3 hours)  
**Risk:** Low (follows existing isolation-check pattern)  
**Sequencing:** Should ship BEFORE 012-rq5-cross-cutting-sentinel-skill packet  

**Implementation notes:**
- Add new step: "Validate graph-metadata.json enhances edges"
- Check that enhances edges reference valid target skill IDs
- Check that edge weights are within valid range (0.0-1.0)
- Check for cycles in enhances edge graph
- Fail PR if graph-metadata.json is malformed

---

## Infrastructure Readiness Assessment

### Ready Systems (No Changes Required)
- **Code-graph:** No changes required. Enhances edges are skill-graph domain, not code-graph domain.
- **Memory indexing core:** Current memory categories (spec documents, constitutional rules) are sufficient. Optional cross-skill linking is enhancement only.

### Systems Requiring Changes
- **Spec-kit validator:** 3 new rules needed (permissions-matrix schema, graph-metadata enhances edges, optional sentinel structure check)
- **Skill-advisor scorer:** 2 changes needed (lexical keywords, graph re-indexing)
- **CI checks:** 2 new validation steps needed (permissions-matrix schema, graph-metadata enhances edges)
- **AGENTS.md:** 1 new rule needed (small-model dispatch rule)

### Effort Summary
- **Total infrastructure effort:** 15-20 hours across all systems
- **Critical path prerequisites:** 10-12 hours (validator rules, CI checks, AGENTS.md rule before packets 010/012)
- **Optional enhancements:** 5-8 hours (memory cross-skill linking, CI graph-metadata validation)

### Risk Assessment
- **Overall risk:** Low. All changes follow existing patterns (validator rules, CI checks, lexical keywords).
- **Highest-risk change:** CI graph-metadata validation (medium risk due to graph cycle detection complexity). Mitigation: start with manual validation, automate after pattern stabilizes.
- **Sequencing risk:** Low. Prerequisites are clearly defined and can be shipped before dependent packets.

---

## Conclusion

The 12 follow-on packets require infrastructure changes across 4 systems (spec-kit validator, skill-advisor scorer, CI checks, AGENTS.md). No code-graph changes are needed. Total infrastructure effort is 15-20 hours, with 10-12 hours of critical path prerequisites that must ship before packets 010 and 012. Risk is low overall because all changes follow existing patterns. The most sequencing-sensitive dependency is the permissions-matrix schema validation, which must ship before packet 010 to prevent RM-8 exposure.
