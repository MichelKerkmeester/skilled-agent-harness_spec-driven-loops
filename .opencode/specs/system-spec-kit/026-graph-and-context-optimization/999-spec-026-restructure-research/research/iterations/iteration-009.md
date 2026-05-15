I encountered a permission issue with the write tool in non-interactive mode. Since the task specifies "Stay read-only. Never propose file mutations," I'll output the iteration-009.md content directly for you to save manually.

```
# Iter 009 — Track 2: 014 duplicate / overlap detection

## Question

For `026/014-local-llama-cpp/`:

1. Which packet pairs overlap? (problem space, file targets, scope)
2. Which 3+ packet groups overlap?
3. What is the proposed merge target per overlap?
4. Are there pairs that LOOK overlapping but are actually load-bearing siblings (e.g., two different angles on the same surface)?

## Evidence

### Deep-review remediation loop (021-031)
- 021-local-llm-legacy-review: "Review packet owning a 20-iter /spec_kit:deep-review:auto run that hunts residue from the local-LLM and embedding-default migration" (spec.md:3)
- 022-local-llm-legacy-remediation: "Remediation packet executing 5 batched fixes for the residue surfaced by sibling packet 021's deep-review" (spec.md:3)
- 023-post-remediation-re-review: Template with placeholder problem statement (spec.md:54)
- 025-post-remediation-v2-re-review: Template with placeholder problem statement (spec.md:54)
- 026-llm-model-runtime-inventory: Research-only inventory document (spec.md:60)
- 026-post-batch-11-re-review: Listed in iter 008 as review artifact
- 027-post-batch-12-final-re-review: Listed in iter 008 as review artifact
- 030-post-029-final-re-review: Listed in iter 008 as review artifact
- 031-post-batch-15-final-re-review: Listed in iter 008 as review artifact

### MCP rename (052-053)
- 052-mk-spec-memory-rename: "Rename the configured Spec Kit Memory MCP server alias from spec_kit_memory to mk-spec-memory" (spec.md:3)
- 053-mk-spec-memory-rename-remediation: "Close the conditional 052 deep-review findings for the mk-spec-memory rename: namespace ownership corrections, shipped packet metadata, runtime config parity" (spec.md:3)

### Documentation arc (054-059)
- 054-code-folder-readmes: "Phase C: sk-doc-aligned READMEs for system-spec-kit code folders" (spec.md:39)
- 055-root-readme-realignment: "Phase D: Root README realignment" (spec.md:34)
- 056-root-readme-deep-research: "Deep audit of the root ./README.md across 7 thematic tracks (20 iter total)" (spec.md:3)
- 057-root-readme-deeper-rewrite: "Deeper second-pass rewrite of root README from 056 raw findings" (spec.md:3)
- 058-skill-md-realignment: "Align 3 SKILL.md + 3 mcp_server READMEs + 2 references/ folders" (spec.md:39)
- 059-cli-devin-deep-loop-alignment: "Translate the 056 + 058 SWE 1.6 retrospective into actionable updates" (spec.md:3)

### Skills alignment (050, 058)
- 050-all-skills-alignment-sweep: "Audit and align every .opencode skill documentation surface with sk-doc templates" (spec.md:3)
- 058-skill-md-realignment: "Align 3 SKILL.md + 3 mcp_server READMEs + 2 references/ folders" (spec.md:39)

### CocoIndex reliability (041-042)
- 041-cocoindex-ipc-observability: "Adds request correlation, structured timings, serialized response byte counts" (spec.md:3)
- 042-cocoindex-refresh-split: "Changes MCP search to avoid implicit index refresh by default and adds an explicit MCP refresh tool" (spec.md:3)

### Substrate repair (032 + children)
- 032-substrate-repair-followups: "Phase parent for the 5 approved follow-ups to 022-local-llm-legacy-remediation's substrate-repair work" (spec.md:3)

## Findings

### Overlap pairs

**Pair 1: 052-mk-spec-memory-rename + 053-mk-spec-memory-rename-remediation**
- Overlap area: MCP namespace rename work; 053 is explicitly a remediation of 052's findings
- Evidence: 053 spec.md states "Close the conditional 052 deep-review findings" (spec.md:3); 053 scope includes correcting 052 packet metadata (spec.md:99-103)
- Merge target: 052-mk-spec-memory-rename
- What survives: 052 absorbs 053's remediation fixes; 053's findings registry resolution moves into 052's implementation-summary

**Pair 2: 056-root-readme-deep-research + 057-root-readme-deeper-rewrite**
- Overlap area: Root README rewrite work; 057 explicitly consumes 056's raw findings for a second pass
- Evidence: 057 spec.md states "Deeper second-pass rewrite of root README from 056 raw findings" (spec.md:3); 057 scope includes re-reading 056 iter files (spec.md:81)
- Merge target: 057-root-readme-deeper-rewrite
- What survives: 057 absorbs 056's research artifacts; 056 becomes a research subfolder under 057

**Pair 3: 041-cocoindex-ipc-observability + 042-cocoindex-refresh-split**
- Overlap area: CocoIndex MCP reliability fixes; both address timeout/latency issues from 035
- Evidence: 041 spec.md states "Packet 035 found strong daemon-log evidence that the MCP host times out" (spec.md:68); 042 spec.md states "Packet 035 found that MCP requests can time out while CocoIndex continues daemon-side work" (spec.md:74); 042 depends on 041's observability hooks (spec.md:48)
- Merge target: 042-cocoindex-refresh-split
- What survives: 042 absorbs 041's observability implementation as a prerequisite phase; both are tightly coupled to 035's findings

### Overlap groups (3+)

**Group 1: Deep-review remediation loop (021, 022, 023, 025, 026, 027, 030, 031)**
- Overlap area: Post-014 residue remediation verification; multiple re-review packets all performing confirmatory deep-review runs
- Evidence: 021 is the initial review (spec.md:61-65); 022 is the remediation (spec.md:61-65); 023/025/026/027/030/031 are all "post-remediation re-review" or "final re-review" templates/artifacts (iter 008 findings)
- Merge target: 022-local-llm-legacy-remediation
- What survives: 022 absorbs 021's findings as research subfolder; 023/025/026/027/030/031 are archived as review artifacts under 022/review/; only the final verification status survives in 022's implementation-summary

**Group 2: Deep-loop foundation arc (056, 057, 058, 059)**
- Overlap area: cli-devin SWE 1.6 deep-loop methodology establishment; 056/057 are root README work that informed 058/059's methodology
- Evidence: 059 spec.md states "Translate the 056 + 058 SWE 1.6 retrospective into actionable updates" (spec.md:3); 058 depends on 057 being shipped (spec.md:56); all four use cli-devin SWE 1.6 iter patterns
- Merge target: 059-cli-devin-deep-loop-alignment
- What survives: 059 becomes the phase parent; 056/057/058 become child phases under 059 with clear dependency chain (056→057→058→059); 059 absorbs the retrospective lessons from all three

**Group 3: Documentation consolidation (050, 054, 055, 058)**
- Overlap area: Documentation alignment across skills, code folders, and root README; all use sk-doc templates and sonnet @markdown
- Evidence: 050 audits all 19 skills (spec.md:85); 054 is Phase C code folder READMEs (spec.md:39); 055 is Phase D root README (spec.md:34); 058 aligns 3 SKILL.md + 3 mcp_server READMEs (spec.md:39); all use sk-doc validation
- Merge target: 050-all-skills-alignment-sweep
- What survives: 050 becomes the phase parent for documentation work; 054/055/058 become child phases under 050 with clear scope boundaries (skills vs code-folders vs root vs system-skill-specific)

### Load-bearing siblings (look overlapping, actually distinct)

**Pair: 050-all-skills-alignment-sweep vs 058-skill-md-realignment**
- Why they look overlapping: Both align skill documentation (SKILL.md files)
- Why they're actually distinct: 050 is a broad sweep across all 19 skills (spec.md:85); 058 is focused on 3 specific system skills (system-spec-kit, system-code-graph, system-skill-advisor) plus their mcp_server READMEs and references folders (spec.md:68-84). 058 also adds new reference docs that 050's doc-only scope forbids (050 spec.md:93 explicitly out-of-scope "Renaming tool IDs, server IDs, or skill IDs"). These are different angles: 050 is breadth alignment, 058 is depth work on core infrastructure skills.

**Pair: 041-cocoindex-ipc-observability vs 042-cocoindex-refresh-split**
- Why they look overlapping: Both address CocoIndex MCP reliability from 035's timeout findings
- Why they're actually distinct: 041 adds observability infrastructure (reqId, timings, byte counts) without changing behavior (spec.md:90-93 explicitly out-of-scope "Changing the default value of refresh_index"); 042 changes the MCP contract (flip refresh_index default, add explicit refresh tool). These are orthogonal concerns: observability vs contract change. They should remain separate packets despite the dependency chain.

**Pair: 032-substrate-repair-followups (phase parent) vs its 5 children**
- Why they look overlapping: Phase parent and children all address substrate repair
- Why they're actually distinct: 032 is a coordination/phase parent only (spec.md:15-19); the 5 children (001-governance-retention-decouple, 002-rerun-24-scenarios-suite, 003-mcp-server-build-fix, 004-failed-embedding-cleanup, 005-substrate-stability-instrumentation) are independent implementation units (spec.md:31-37). This is the intended phase-parent pattern, not duplication.

**Pair: 054-code-folder-readmes vs 055-root-readme-realignment**
- Why they look overlapping: Both are README alignment work in the documentation arc
- Why they're actually distinct: 054 is Phase C targeting 8 system-spec-kit code folders (spec.md:75-87); 055 is Phase D targeting the project root README.md (spec.md:64-76). Different target surfaces, different phases of the documentation pipeline. Load-bearing siblings.

## Gaps for next iter

- Iter 010: Consolidated phase-list for 014 post-restructure (merge targets from this iteration applied to produce a clean child list)
- Question: Should placeholder directories (045-session-deep-review-2026-05-14, 048-deep-review-cocoindex-wiring) be deleted or completed before restructure?
- Question: How to handle the duplicate 026 numbering (026-llm-model-runtime-inventory vs 026-post-batch-11-re-review)?

## JSONL delta row

```json
{"track": 2, "iter_id": "009", "timestamp": "2026-05-15T22:43:00Z", "status": "complete", "overlap_pairs": 3, "overlap_groups": 3, "load_bearing_siblings": 4, "merge_targets_proposed": 6}
```
```
