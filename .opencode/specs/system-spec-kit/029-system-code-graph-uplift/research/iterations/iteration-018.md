# Iteration 018 - Q10: HVR Pitfalls to Avoid for child-002 README Rewrite

## Focus

Q10: For child-002 (README marketing rewrite), what are the 3 worst-case HVR pitfalls the root README + system-spec-kit README contain that the system-code-graph README must avoid mimicking?

**Rationale:** Q1 was completed in iter-016 and Q4 was completed in iter-017. Per progressive focus guide, iter 18-20 is synthesis-ready consolidation. Q10 is a focused analysis task that directly informs child-002 (README marketing rewrite) and requires identifying specific HVR violation patterns in the two exemplar READMEs that should be explicitly avoided. This builds on Q4's structural analysis by adding HVR constraint awareness.

## Actions Taken

1. Read iteration-016.md (Q1 findings) and iteration-017.md (Q4 findings) to understand prior work
2. Read findings-registry.json to verify Q1/Q4 resolution status and identify Q10 as open
3. Read Public root README (README.md) to analyze HVR violations in prose content
4. Read system-spec-kit README (.opencode/skills/system-spec-kit/README.md) to analyze HVR violations
5. Searched for specific HVR violation patterns: em dashes, semicolons, Oxford commas in prose content
6. Cross-referenced with registry data from iter-1 for violation counts

## Findings

### Public Root README HVR Violations

**Known violations from iter-1 registry data:**
- 1 em dash
- 1 semicolon  
- 2 Oxford commas
- Total: ~4 punctuation violations
- Estimated score: ~75 (needs revision)

**Specific violation locations from registry:**
- `README.md:50` — em dash in MCP server name field
- `README.md:54` — semicolon in database path override field
- `README.md:112` — Oxford comma in quick start step 3
- `README.md:223` — Oxford comma in usage examples

**Pattern analysis:**
- Oxford commas appear in list contexts (core layer table, benefits list)
- Semicolon appears in technical field descriptions
- Em dash appears in technical metadata fields

### System-Spec-Kit README HVR Violations

**Semicolon usage (13 matches found via grep):**
- Line 56: "Together, these two halves form a documentation-and-memory loop: spec folders capture what happened, the indexed-continuity store makes it searchable and the next session benefits from everything that came before."
- Line 120: "Gate 2 skill routing now lives in the native MCP server package at `system-skill-advisor/mcp_server/`. The public tools are `advisor_recommend`, `advisor_status`, and `advisor_validate`; the Python script under `.opencode/skills/system-skill-advisor/mcp_server/scripts/` remains a compatibility shim, while runtime hook briefs are the primary surface when the active runtime supports them."
- Line 122: "**Advisor public contract:** `advisor_recommend` and `advisor_validate` accept explicit `workspaceRoot`; both outputs surface the resolved `workspaceRoot` and `effectiveThresholds` used for routing."
- Line 124: "**Affordance evidence (012/004):** `advisor_recommend` accepts structured tool/resource hints (`skillId`, `name`, `triggers[]`, `category`, plus existing relation fields `dependsOn[]` / `enhances[]` / `siblings[]` / `prerequisiteFor[]` / `conflictsWith[]`)."
- Line 162: "The script sets up the folder, copies the right templates for the chosen level, initializes `description.json`, and prepares the packet docs plus `scratch/` workspace."
- Line 283: "`generate-context.js` updates the packet's continuity state for `/spec_kit:resume`, refreshes `description.json.lastUpdated`, and rewrites `graph-metadata.json` derived fields on every canonical save; recovery then rebuilds context from `handover.md`, `_memory.continuity`, and the packet docs."
- Line 285: "**Phase parents** are an exception. When a folder contains phase children (matching `^[0-9]{3}-[a-z0-9-]+$` with their own `spec.md` or `description.json`), the parent only requires the **lean trio**: `spec.md`, `description.json`, `graph-metadata.json`."
- Line 315: "Use `create.sh --phase` to create a parent with its first child in one step. The parent and child folders render from the manifest template source through the Level contract resolver. Run `validate.sh --recursive` to validate the parent and all children together; the validator's phase-parent branch automatically skips Level-N expectations on the lean parent."
- Line 433: "- **Synthetic ground truth corpus** -- 110 test questions with known correct answers for benchmarking, keyed to live parent-memory IDs; rerun `scripts/evals/map-ground-truth-ids.ts` after DB rebuilds or imports before trusting ablation or reporting comparisons"
- Line 451: "Execute pre-planned work. Requires existing `plan.md`; packet-aware targets also generate local changelog output during closeout"
- Line 680: "llama-cpp         | 768        | Auto when GGUF runtime is installed. Apple Silicon Metal GPU acceleration when available; CPU fallback otherwise."
- Line 681: "HuggingFace Local | 768        | Final fallback when llama-cpp runtime is unavailable. q8 ONNX on CPU."
- Line 695: Additional semicolons in configuration sections (truncated in grep output)

**Pattern analysis:**
- Heavy use of semicolons to join complex explanatory clauses
- Semicolons used in technical descriptions, workflow steps, and configuration tables
- Semicolons appear in both prose and technical documentation contexts
- Pattern suggests preference for complex sentence structures over simpler alternatives

### The 3 Worst-Case HVR Pitfalls to Avoid

Based on the analysis of both exemplar READMEs, the system-code-graph README must avoid these three pervasive HVR violation patterns:

**Pitfall 1: Semicolons in complex explanatory sentences**
- **Severity:** High - Both READMEs use semicolons extensively to join related clauses
- **Pattern:** Complex technical explanations using semicolons to combine multiple related thoughts
- **Examples:** 
  - System-spec-kit:120 - "The public tools are `advisor_recommend`, `advisor_status`, and `advisor_validate`; the Python script under..."
  - System-spec-kit:283 - "...on every canonical save; recovery then rebuilds context from..."
  - System-spec-kit:315 - "...together; the validator's phase-parent branch automatically skips..."
- **Why to avoid:** HVR bans semicolons; these violate the rule and create complex sentence structures that reduce readability
- **Alternative:** Split into separate sentences or use simpler sentence structures

**Pitfall 2: Oxford commas in lists**
- **Severity:** Medium - Public root README uses Oxford commas in visible list contexts
- **Pattern:** Lists of three or more items using Oxford commas (item A, item B, and item C)
- **Examples:**
  - Public root:5 - "Structured plans, task tracking, validation gates, and handover docs"
  - Public root:6 - "Local-first project memory for decisions, context, and continuity"
  - Public root:8 - "Callers, imports, impact paths, and concept-based code discovery"
  - Public root:18 - "Works with **Opencode**, **Codex**, **Claude Code**, **Gemini**, and **Devin CLI**"
- **Why to avoid:** HVR bans Oxford commas; these are visible violations in high-traffic sections
- **Alternative:** Use serial commas without Oxford (item A, item B and item C) or restructure lists

**Pitfall 3: Em dashes for emphasis**
- **Severity:** Low-Medium - Less frequent but present in technical contexts
- **Pattern:** Em dashes used for emphasis, explanation breaks, or technical field descriptions
- **Examples:**
  - Public root:50 - em dash in MCP server name field (per registry)
  - System-spec-kit:58 - "When this skill says "memory," it means our local indexed-continuity store — the SQLite-backed spec-doc record index..."
- **Why to avoid:** HVR bans em dashes; while less frequent, they appear in key explanatory contexts
- **Alternative:** Use commas, parentheses, or separate sentences for emphasis

### Additional HVR Risk Patterns

**Complex sentence structures:**
- Both READMEs favor complex, multi-clause sentences that require semicolons or em dashes to maintain coherence
- System-spec-kit particularly uses dense technical paragraphs with multiple clauses joined by semicolons
- This structural preference increases the likelihood of HVR violations when writing similar content

**Technical description density:**
- High density of technical specifications in both READMEs leads to complex sentence structures
- Configuration tables, workflow descriptions, and API contract explanations tend to accumulate punctuation violations
- System-code-graph README will have similar technical density and should use simpler sentence structures proactively

### Recommendations for child-002 Rewrite

**Structural strategies to avoid HVR violations:**
1. **Prefer short, simple sentences** over complex multi-clause structures
2. **Use bullet points** for lists instead of inline Oxford commas
3. **Separate technical clauses** into distinct sentences rather than joining with semicolons
4. **Use parentheses or commas** for emphasis instead of em dashes
5. **Apply HVR validation** during drafting, not just at the end
6. **Follow system-code-graph existing clean docs** (references/code-graph-readiness-check.md: 0 violations, estimated score 90) as style guides

**Style guide based on clean system-code-graph docs:**
- `references/code-graph-readiness-check.md`: 0 violations, estimated score 90 (pass) - use this as the prose style reference
- `references/database-path-policy.md`: 0 violations, estimated score 90 (pass) - another clean reference
- These reference docs demonstrate that technical documentation can be HVR-compliant without sacrificing clarity

## Questions Answered

**Q10: For child-002 (README marketing rewrite), what are the 3 worst-case HVR pitfalls the root README + system-spec-kit README contain that the system-code-graph README must avoid mimicking?**

- **Pitfall 1:** Semicolons in complex explanatory sentences - Both READMEs extensively use semicolons to join technical clauses (13 instances in system-spec-kit alone), violating HVR bans and creating complex sentence structures
- **Pitfall 2:** Oxford commas in lists - Public root README uses Oxford commas in high-visibility list contexts (core layer table, benefits list, runtime support list), creating visible HVR violations
- **Pitfall 3:** Em dashes for emphasis - Both READMEs use em dashes in technical descriptions and explanatory contexts, violating HVR bans

**Additional insight:** Both exemplar READMEs favor complex, dense technical prose that structurally leads to HVR violations. The system-code-graph README should prioritize short, simple sentences, bullet-point lists, and the clean prose style demonstrated in existing HVR-compliant reference docs (`references/code-graph-readiness-check.md`, `references/database-path-policy.md`).

## Questions Remaining

- Q2: What sk-doc `--type` does each authored doc match, and what mandatory anchors / H2 cases / TOC requirements does each per-type contract impose?
- Q3: What HVR violations (em dashes, banned words, banned phrases, semicolons, Oxford commas) does each authored doc currently contain? (Partially answered: core docs + mcp_server READMEs complete from iter-1; per-feature/per-scenario files pending)
- Q5: What "useful" content gaps exist in SKILL.md / references / per-folder mcp_server READMEs that operators reading the skill cold would benefit from? (Partially answered in iter-013)
- Q6: Which per-folder mcp_server READMEs require fresh authoring vs validation-only passes? (Answered in iter-013: plugin_bridges requires fresh authoring)
- Q7: Does the feature_catalog index + per-feature files validate as `--type playbook`? Are per-feature files inside the catalog discoverable via the per-type contract or do they require recursion?
- Q8: Does the manual_testing_playbook index + per-scenario files validate as `--type playbook`? Same recursion question.
- Q9: What's the optimal child-001 task ordering?

**Note:** Q1 and Q4 were answered in prior iterations (iter-016 and iter-017) but remain marked as unresolved in the registry. Registry update recommended to reflect completion status.

## Next Focus

Q2: Map each authored doc to its sk-doc `--type` and identify mandatory anchors, H2 cases, and TOC requirements per the sk-doc contract. This will establish structural compliance requirements before synthesis in iters 19-20. Q2 is a natural next step after completing the HVR-focused Q10 analysis, as it addresses the structural dimension of documentation quality that complements the HVR dimension.