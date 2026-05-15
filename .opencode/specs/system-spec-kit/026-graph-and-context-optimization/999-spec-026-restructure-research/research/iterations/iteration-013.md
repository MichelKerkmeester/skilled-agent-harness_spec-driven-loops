I cannot write files due to read-only mode constraints. Here is the iteration-013.md content as required:

---

# Iteration 013 — Track 3 (013-doctor-update-orchestrator deep-read)

## Research Question

For `026/013-doctor-update-orchestrator/`:

1. Which packet pairs overlap?
2. Which 3+ packet groups overlap?
3. Proposed merge target per overlap?
4. Load-bearing siblings (look overlapping, actually distinct)?

## Evidence

**Step 1: Iter 011 + 012 output review**
- Iter 011 cataloged 5 NNN-name children under 013-doctor-update-orchestrator/ <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-011.md" lines="39-53" />
- Iter 012 classified each packet: 001+002 superseded by router arc, 003 remediation complete, 004+005 main arc complete <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-012.md" lines="59-103" />

**Step 2: Supersession metadata analysis**
- 001-doctor-commands spec.md line 61: "Superseded By ../004-router-phase/ and ../005-cutover-phase/" <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-doctor-update-orchestrator/001-doctor-commands/spec.md" line="61" />
- 002-sandbox-testing-playbook spec.md line 68: "Superseded By ../004-router-phase/ and ../005-cutover-phase/" <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-doctor-update-orchestrator/002-sandbox-testing-playbook/spec.md" line="68" />
- 001 implementation-summary: "COMPLETE (~95%)" with 34 files delivered (5 commands + 10 YAMLs + migration manifest) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-doctor-update-orchestrator/001-doctor-commands/implementation-summary.md" lines="1-4" />
- 002 implementation-summary: "COMPLETE (~95%)" with 70+ files delivered (23 scenarios + Docker sandbox harness) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-doctor-update-orchestrator/002-sandbox-testing-playbook/implementation-summary.md" lines="1-4" />

**Step 3: Problem statement comparison**
- 001 problem: Users at older spec-kit versions need unified entry point to rebuild databases in dependency-safe order <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-doctor-update-orchestrator/001-doctor-commands/spec.md" lines="100-111" />
- 002 problem: No reproducible test harness for the 5 doctor commands from 001 <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-doctor-update-orchestrator/002-sandbox-testing-playbook/spec.md" lines="82-86" />
- 004 problem: 10 /doctor:* commands share ~50 lines of duplicated boilerplate per file <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-doctor-update-orchestrator/004-router-phase/spec.md" lines="65-68" />
- 005 problem: Phase 1 left repository in temporary overlap state (both old and new invocation forms) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-doctor-update-orchestrator/005-cutover-phase/spec.md" lines="67-70" />
- 003 problem: Deep-review CONDITIONAL verdict with 30 P1 + 30 P2 findings (doc honesty, security, cross-runtime mirror) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-doctor-update-orchestrator/003-rm8-013-remediation-doc-honesty-security/spec.md" lines="83-86" />

**Step 4: Delivered artifact comparison**
- 001 delivered: 5 doctor commands (/doctor memory, causal-graph, deep-loop, cocoindex, update) + 10 YAML assets + migration manifest <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-doctor-update-orchestrator/001-doctor-commands/spec.md" lines="83-88" />
- 002 delivered: 23 manual testing scenarios (IDs 323-336, 338-342, 344-347) + Docker sandbox harness (Dockerfile, docker-compose.yml, fixtures, harness scripts, per-scenario wrappers) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-doctor-update-orchestrator/002-sandbox-testing-playbook/spec.md" lines="100-113" />
- 004 delivered: /doctor router (argv-positional), /doctor:mcp infra command, _routes.yaml canonical manifest, route-validate.sh CI assertion, cross-runtime mirrors <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-doctor-update-orchestrator/004-router-phase/spec.md" lines="77-84" />
- 005 delivered: Hard cutover from 10 legacy /doctor:* commands to 3 router-based entrypoints (deleted 9 old .md files + 9 old .toml files, updated playbook/harness invocations, refreshed advisor indices) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-doctor-update-orchestrator/005-cutover-phase/spec.md" lines="79-86" />
- 003 delivered: Doc honesty fixes, security hardening (flock, cap_drop, narrowed mounts), cross-runtime mirrors, P2 cleanup <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-doctor-update-orchestrator/003-rm8-013-remediation-doc-honesty-security/implementation-summary.md" lines="36-41" />

## Findings

### Overlap pairs

**Pair 1: 001-doctor-commands + 002-sandbox-testing-playbook**

| Dimension | Evidence |
|-----------|----------|
| **Supersession metadata** | Both explicitly marked "Superseded By ../004-router-phase/ and ../005-cutover-phase/" in spec.md <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-doctor-update-orchestrator/001-doctor-commands/spec.md" line="61" /> <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-doctor-update-orchestrator/002-sandbox-testing-playbook/spec.md" line="68" /> |
| **Completion status** | Both ~95% complete per implementation-summary <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-doctor-update-orchestrator/001-doctor-commands/implementation-summary.md" lines="1-4" /> <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-doctor-update-orchestrator/002-sandbox-testing-playbook/implementation-summary.md" lines="1-4" /> |
| **Parent graph-metadata status** | Both marked "in_progress" in parent graph-metadata.json <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-011.md" lines="27-28" /> |
| **Functional relationship** | 001 implements 5 doctor commands; 002 provides validation layer (23 scenarios + sandbox harness) for those same commands <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-doctor-update-orchestrator/001-doctor-commands/spec.md" lines="83-88" /> <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-doctor-update-orchestrator/002-sandbox-testing-playbook/spec.md" lines="100-113" /> |
| **Replacement relationship** | Router consolidation arc (004 + 005) replaced the per-command implementation pattern with unified router-based surface <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-011.md" lines="57-58" /> |

**Overlap nature:** 001 and 002 form the "Doctor Runtime Foundation" arc — implementation (001) + validation (002) pairing. Both are superseded by the router consolidation arc (004 + 005), which replaced the per-command implementation pattern with a unified router-based surface.

**Merge proposal:** Merge 001-doctor-commands + 002-sandbox-testing-playbook into a single historical packet with proposed name `001-doctor-runtime-foundation-historical`. This consolidates the original doctor command implementation and its validation layer into a coherent "superseded by router consolidation" historical artifact. Rationale:
- Both are explicitly superseded by the same successor packets (004 + 005)
- Both are ~95% complete and in_progress status
- They form a natural implementation + validation pairing
- Merging preserves the historical context of the original approach while reducing packet count
- The merged packet can be archived as "historical implementation superseded by router consolidation"

### Overlap groups

**None identified.** The 5 packets under 013-doctor-update-orchestrator fall into clear non-overlapping categories:
- **Group A (superseded):** 001 + 002 — Original doctor implementation + validation (merge candidate identified above)
- **Group B (remediation):** 003 — Deep-review remediation (distinct scope, complete)
- **Group C (main arc):** 004 + 005 — Router consolidation (tightly coupled 2-phase rollout, not a merge candidate — see load-bearing siblings below)

No 3+ packet groups overlap. The remediation packet (003) is self-contained and does not span other packets. The router consolidation arc (004 + 005) is intentionally separated into two phases for safety reasons.

### Load-bearing siblings

**Pair 1: 004-router-phase + 005-cutover-phase**

| Dimension | Evidence |
|-----------|----------|
| **Architectural relationship** | 004 is Phase 1 (additive router alongside legacy commands); 005 is Phase 2 (hard cutover, deletes legacy commands) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-doctor-update-orchestrator/004-router-phase/spec.md" lines="65-68" /> <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-doctor-update-orchestrator/005-cutover-phase/spec.md" lines="67-70" /> |
| **Safety mechanism** | Two-phase rollout pattern: additive validation window → hard cutover <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-doctor-update-orchestrator/004-router-phase/spec.md" lines="68" /> |
| **Phase 1 scope** | Ships /doctor router + /doctor:mcp + _routes.yaml + route-validate.sh; NO deletes, NO playbook changes <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-doctor-update-orchestrator/004-router-phase/spec.md" lines="86-93" /> |
| **Phase 2 scope** | Deletes 9 old .md files + 9 old .toml files; updates playbook/harness invocations; refreshes advisor indices <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-doctor-update-orchestrator/005-cutover-phase/spec.md" lines="79-86" /> |
| **004 → 005 dependency** | 004 spec.md lists 005 as successor; 005 spec.md lists 004 as predecessor <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-doctor-update-orchestrator/004-router-phase/spec.md" lines="56" /> <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-doctor-update-orchestrator/005-cutover-phase/spec.md" lines="57" /> |

**Why this is load-bearing (not an overlap):** 004 and 005 might appear to overlap (both deal with doctor command consolidation), but they are intentionally separated as a two-phase rollout pattern for operational safety:
- **Phase 1 (004)** is additive — ships the router alongside legacy commands so both `/doctor memory` and `/doctor:memory` invocation forms succeed during the validation window
- **Phase 2 (005)** is destructive — performs hard cutover by deleting the 9 legacy command files and updating all references
- The two-phase pattern is a deliberate safety mechanism to allow validation before irreversible changes
- Merging would obscure the architectural clarity of the additive → cutover rollout
- This is the defining arc of 013's purpose (consolidating 10 legacy commands into 3 router-based entrypoints)

**Merge recommendation:** DO NOT MERGE. Keep 004 and 005 as separate packets to preserve the two-phase rollout pattern and architectural clarity.

**Pair 2: 003-rm8-013-remediation-doc-honesty-security (vs 001 + 002)**

| Dimension | Evidence |
|-----------|----------|
| **Scope** | 003 addresses deep-review findings (doc honesty, security hardening, cross-runtime mirror) — does not implement new runtime surface <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-doctor-update-orchestrator/003-rm8-013-remediation-doc-honesty-security/spec.md" lines="83-86" /> |
| **Deliverables** | 003 delivered doc fixes, security hardening (flock, cap_drop, narrowed mounts), cross-runtime mirrors, P2 cleanup <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-doctor-update-orchestrator/003-rm8-013-remediation-doc-honesty-security/implementation-summary.md" lines="36-41" /> |
| **Status** | 003 implementation-summary shows "complete" (100%) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-doctor-update-orchestrator/003-rm8-013-remediation-doc-honesty-security/implementation-summary.md" line="32" /> |
| **Relationship to 001 + 002** | 003 modified 001 + 002 docs (doc honesty fixes) but did not implement the same functional scope <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-doctor-update-orchestrator/003-rm8-013-remediation-doc-honesty-security/spec.md" lines="96-110" /> |

**Why this is load-bearing (not an overlap):** 003 might appear to overlap with 001 + 002 (all touch 013 spec docs), but it's actually a distinct remediation packet:
- 003's purpose is to close out deep-review findings (CONDITIONAL → PASS verdict)
- 003's deliverables are quality improvements (doc honesty, security hardening, cross-runtime mirrors), not new runtime implementation
- 003 modified 001 + 002 docs as part of remediation, but did not implement the same functional scope
- 003 is self-contained and complete (100% per implementation-summary)
- 003 does not span other packets beyond the doc fixes required for remediation

**Merge recommendation:** DO NOT MERGE. Keep 003 as a standalone remediation packet. The security hardening and cross-runtime mirror changes are load-bearing improvements that should remain distinct from the historical implementation packets.

## Gaps for next iter

- Iter 014: Consolidated phase-list for 013 clarifying the main router consolidation arc (004 + 005) vs supporting implementation work (001 + 002 merged) vs remediation (003)
- Decision needed: Should 001 + 002 be merged into `001-doctor-runtime-foundation-historical` and archived as superseded work?
- Decision needed: Should 003's parent graph-metadata.json status be updated from "planned" to "complete" to reflect remediation completion?
- Decision needed: Should 002's sandbox harness be updated (sed-updates) to target the new router invocation forms (`/doctor memory` instead of `/doctor:memory`) before the sandbox becomes load-bearing again?

---

**JSONL row to append:**
```json
{"iter_id": "013", "timestamp_utc": "2026-05-15T20:47:00Z", "executor": "cli-devin", "model": "swe-1.6", "track": 3, "status": "complete", "findings_count": 3, "gaps_count": 4, "primary_evidence_files": [".opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-doctor-update-orchestrator/001-doctor-commands/spec.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-doctor-update-orchestrator/001-doctor-commands/implementation-summary.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-doctor-update-orchestrator/002-sandbox-testing-playbook/spec.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-doctor-update-orchestrator/002-sandbox-testing-playbook/implementation-summary.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-doctor-update-orchestrator/003-rm8-013-remediation-doc-honesty-security/spec.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-doctor-update-orchestrator/003-rm8-013-remediation-doc-honesty-security/implementation-summary.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-doctor-update-orchestrator/004-router-phase/spec.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-doctor-update-orchestrator/005-cutover-phase/spec.md"]}
```
