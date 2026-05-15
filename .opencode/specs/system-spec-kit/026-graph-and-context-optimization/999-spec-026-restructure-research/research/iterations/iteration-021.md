I'm in read-only mode as specified in the task. Here is the complete iteration-021.md content that should be written to the specified path:

---

# Iteration 021 — Track 5 (009-hook-parity deep-read) — duplicate / overlap detection

**Date:** 2026-05-15
**Track:** 5 (009-hook-parity deep-read)
**Research Question:** For `026/009-hook-parity/`: overlapping pairs? groups? merge targets? load-bearing siblings?

---

## 1. Iter 019 + 020 Context

Iter 019 cataloged 8 direct NNN-name children under `009-hook-parity/` and identified three thematic groups:
- Group A: Runtime Hook Parity Core (001-005) — main arc
- Group B: Copilot Wrapper Fixes (006-007)
- Group C: Documentation Alignment (008)

Iter 020 classified all 8 packets as load-bearing and identified one merge candidate pair (006 + 007). This iteration deepens the overlap analysis by comparing problem statements and delivered artifacts to identify all overlapping pairs/groups and propose merge targets.

---

## 2. Overlap Analysis

### Overlap Group 1: Copilot Wrapper Integration (006 + 007)

**Overlap Type:** 2-pair sequential dependency

**Problem Statements:**
- 006: "Copilot CLI 1.0.34 throws 'Neither bash nor powershell specified in hook command configuration' on every user prompt" <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-parity/006-copilot-wrapper-schema-fix/spec.md" lines="45-48" />
- 007: "After packet 010 fixed the Copilot schema crash, the userPromptSubmitted hook still doesn't refresh the managed block" <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-parity/007-copilot-writer-wiring/spec.md" lines="40-45" />

**Delivered Artifacts:**
- 006: Added top-level Copilot-safe fields (`type`, `bash`, `timeoutSec`) to matcher wrappers in `.claude/settings.local.json` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-parity/006-copilot-wrapper-schema-fix/spec.md" lines="67-69" />
- 007: Replaced no-op `bash: "true"` with actual Copilot writer commands for `UserPromptSubmit` and `SessionStart` in `.claude/settings.local.json` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-parity/007-copilot-writer-wiring/spec.md" lines="56-59" />

**Overlap Evidence:**
- Both packets modify the same file (`.claude/settings.local.json`)
- Both are Level 1 packets <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-parity/006-copilot-wrapper-schema-fix/spec.md" line="31" /> <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-parity/007-copilot-writer-wiring/spec.md" line="29" />
- Both were reverted then reapplied together (status: "reverted-needs-reapply") <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-parity/006-copilot-wrapper-schema-fix/spec.md" line="33" /> <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-parity/007-copilot-writer-wiring/spec.md" line="31" />
- 007 explicitly depends on 006 (schema crash must be resolved first) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-parity/007-copilot-writer-wiring/spec.md" line="35" />
- Both address Copilot-specific integration issues with the Claude wrapper

**Merge Target:** 006 (absorb 007)
- Rationale: 006 fixes the schema crash (prerequisite), 007 builds on that fix to enable writer functionality. Merging into 006 creates a coherent "Copilot wrapper schema + writer wiring" packet that addresses the full Copilot wrapper integration surface in one pass.
- Merge strategy: Rebrand 006 to "Copilot Wrapper Integration (schema fix + writer wiring)", add 007's writer-wiring requirements and success criteria as Phase 2 of 006.

**Load-bearing Siblings:** None (both are part of the merge target)

---

### Overlap Group 2: Copilot Hook Parity (002 + 006 + 007)

**Overlap Type:** 3-packet thematic cluster

**Problem Statements:**
- 002: "Copilot CLI had no hook parity with Claude Code — no startup context and no advisor brief" <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-parity/002-copilot-hook-parity-remediation/spec.md" lines="76-84" />
- 006: "Copilot CLI 1.0.34 throws 'Neither bash nor powershell specified in hook command configuration' on every user prompt" <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-parity/006-copilot-wrapper-schema-fix/spec.md" lines="45-48" />
- 007: "userPromptSubmitted hook still doesn't refresh the managed block" <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-parity/007-copilot-writer-wiring/spec.md" lines="40-45" />

**Delivered Artifacts:**
- 002: File-based workaround via `$HOME/.copilot/copilot-instructions.md` with custom-instructions writer <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-parity/002-copilot-hook-parity-remediation/spec.md" lines="120-123" />
- 006: Schema fix in `.claude/settings.local.json` to enable hook execution <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-parity/006-copilot-wrapper-schema-fix/spec.md" lines="67-69" />
- 007: Writer wiring in `.claude/settings.local.json` to refresh managed block <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-parity/007-copilot-writer-wiring/spec.md" lines="56-59" />

**Overlap Evidence:**
- All three packets address Copilot-specific hook parity issues
- All three modify Copilot-related configuration (002: custom-instructions file, 006/007: settings.local.json)
- All three are part of the "Copilot Wrapper Fixes" thematic group identified in iter 019 <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-019.md" lines="49-55" />
- 002 is Level 3 (runtime-specific parity), 006/007 are Level 1 (wrapper fixes) — different complexity but same runtime target
- All three were delivered in response to Copilot hook parity gaps discovered on 2026-04-21/22

**Merge Target:** 002 (absorb 006 + 007)
- Rationale: 002 is the foundational Copilot hook parity packet (Level 3, runtime-specific), while 006/007 are Level 1 wrapper fixes that enable the 002 workaround to function. Merging all three into a single "Copilot Hook Parity (file-based workaround + wrapper fixes)" packet creates a coherent Copilot-specific remediation arc.
- Merge strategy: Rebrand 002 to "Copilot Hook Parity Remediation (file-based workaround + wrapper integration)", add 006/007's schema fix and writer wiring as Phase 2 and Phase 3 of 002.
- Caveat: This would elevate the merged packet to Level 3 (consistent with 002's current level), but the complexity increase is justified by the coherent Copilot-specific narrative.

**Load-bearing Siblings:** None (all three are part of the merge target)

---

### Overlap Group 3: Runtime Hook Parity Core (001 + 002 + 003 + 004 + 005)

**Overlap Type:** 5-packet thematic arc

**Problem Statements:**
- 001: "10 runtime-hook issues across OpenCode plugin bridge, Codex advisor hooks, Copilot startup routing, Codex PreToolUse safety, and runtime documentation" <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-parity/001-hook-parity-remediation/spec.md" lines="57-60" />
- 002: "Copilot CLI had no hook parity with Claude Code — no startup context and no advisor brief" <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-parity/002-copilot-hook-parity-remediation/spec.md" lines="76-84" />
- 003: "Codex CLI sessions do not receive the two payloads Claude Code receives: SessionStart:startup and UserPromptSubmit" <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-parity/003-codex-hook-parity-remediation/spec.md" lines="80-86" />
- 004: "Three findings from end-to-end Claude Code hook testing: advisor freshness stuck, settings.local.json schema mismatch, no multi-turn regression harness" <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-parity/004-claude-hook-findings-remediation/spec.md" lines="69-76" />
- 005: "OpenCode 1.3.17 TUI crash: TypeError: null is not an object (evaluating 'plugin2.auth')" <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-parity/005-opencode-plugin-loader-remediation/spec.md" lines="95-106" />

**Delivered Artifacts:**
- 001: OpenCode plugin transport diagnostics, Codex prompt hook visibility, Copilot startup routing, PreToolUse policy changes, runtime documentation <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-parity/001-hook-parity-remediation/spec.md" lines="73-78" />
- 002: Copilot file-based custom-instructions writer and hook wiring <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-parity/002-copilot-hook-parity-remediation/spec.md" lines="120-123" />
- 003: Codex native SessionStart and UserPromptSubmit hooks <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-parity/003-codex-hook-parity-remediation/spec.md" lines="111-113" />
- 004: Claude sourceSignature persistence fix, settings.local.json normalization, multi-turn regression harness documentation <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-parity/004-claude-hook-findings-remediation/spec.md" lines="84-86" />
- 005: OpenCode plugin loader hardening, helper module relocation, skill-advisor hook remap <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-parity/005-opencode-plugin-loader-remediation/spec.md" lines="61-66" />

**Overlap Evidence:**
- All five packets form the "Runtime Hook Parity Core" thematic group identified in iter 019 <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-019.md" lines="38-47" />
- All five address hook parity defects across different runtimes (Claude, Copilot, Codex, OpenCode)
- All five are Level 3 packets except 004 (Level 2) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-parity/001-hook-parity-remediation/spec.md" line="42" /> <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-parity/002-copilot-hook-parity-remediation/spec.md" line="61" /> <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-parity/003-codex-hook-parity-remediation/spec.md" line="64" /> <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-parity/004-claude-hook-findings-remediation/spec.md" line="56" /> <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-parity/005-opencode-plugin-loader-remediation/spec.md" line="78" />
- 001 is the foundational general runtime parity packet, 002-005 are runtime-specific remediations that build on it
- All five were delivered in response to hook parity defects discovered on 2026-04-21/22
- 001 has dependencies on skill-advisor and compact-code-graph work, indicating it's the starting point <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-parity/001-hook-parity-remediation/spec.md" lines="48-49" />

**Merge Target:** No merge recommended
- Rationale: While these packets form a coherent thematic arc, each addresses a distinct runtime with specific root causes and implementation details. Merging would obscure the runtime-specific contracts and verification evidence. The current structure (foundational 001 + runtime-specific 002-005) is appropriate for a cross-runtime parity remediation effort.
- Alternative: Keep as-is but consider renumbering as sequential phases under a single parent (e.g., 001 → 002-005 as 001-001 through 001-005) if phase-based organization is preferred for 009.

**Load-bearing Siblings:** All five packets are load-bearing (per iter 020 classification) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-020.md" lines="140-147" />

---

## 3. Summary of Overlaps

### Overlap Pairs/Groups Identified

| Group | Packets | Overlap Type | Merge Target | Rationale |
|-------|--------|--------------|--------------|-----------|
| 1 | 006 + 007 | 2-pair sequential dependency | 006 (absorb 007) | Both modify `.claude/settings.local.json`, both Level 1, both reverted/reapplied together, 007 depends on 006 |
| 2 | 002 + 006 + 007 | 3-packet thematic cluster | 002 (absorb 006 + 007) | All address Copilot hook parity, all modify Copilot config, 002 is foundational Level 3, 006/007 are Level 1 enablers |
| 3 | 001 + 002 + 003 + 004 + 005 | 5-packet thematic arc | No merge | Coherent arc but distinct runtimes with specific contracts; merging would obscure runtime-specific evidence |

### Load-bearing Siblings

All 8 packets under `009-hook-parity/` are load-bearing per iter 020 classification. No packets are delete candidates. The overlap analysis confirms this: each packet delivers critical runtime fixes or documentation alignment that would regress if deleted.

---

## 4. Merge Proposals

### Proposal 1: Merge 007 into 006

**Target:** 006-copilot-wrapper-schema-fix
**Absorb:** 007-copilot-writer-wiring
**New Name:** 006-copilot-wrapper-integration
**New Description:** Copilot wrapper schema fix and writer wiring for .claude/settings.local.json cross-runtime compatibility
**Rationale:**
- Both packets are Level 1
- Both modify the same file (`.claude/settings.local.json`)
- Both were reverted then reapplied together
- 007 depends on 006 (schema fix prerequisite)
- Merging creates a coherent "Copilot wrapper integration" packet

**Implementation:**
- Rebrand 006 to "Copilot Wrapper Integration"
- Add 007's writer-wiring requirements as Phase 2
- Add 007's success criteria to 006
- Preserve 007's verification evidence in 006's implementation-summary
- Delete 007 folder after merge

### Proposal 2: Merge 006 + 007 into 002

**Target:** 002-copilot-hook-parity-remediation
**Absorb:** 006-copilot-wrapper-schema-fix, 007-copilot-writer-wiring
**New Name:** 002-copilot-hook-parity-remediation (unchanged)
**New Description:** Copilot CLI hook parity remediation including file-based workaround, wrapper schema fix, and writer wiring
**Rationale:**
- All three address Copilot hook parity
- 002 is the foundational Level 3 packet
- 006/007 are Level 1 enablers for the 002 workaround
- Merging creates a coherent Copilot-specific remediation arc
- Elevates the merged packet to Level 3 (consistent with 002)

**Implementation:**
- Add 006's schema fix requirements as Phase 2 of 002
- Add 007's writer-wiring requirements as Phase 3 of 002
- Add 006/007 success criteria to 002
- Preserve 006/007 verification evidence in 002's implementation-summary
- Delete 006 and 007 folders after merge

### Proposal 3: No Merge for Runtime Hook Parity Core (001-005)

**Target:** None (keep as-is)
**Rationale:**
- Coherent thematic arc but distinct runtimes
- Each packet has specific root causes and implementation details
- Merging would obscure runtime-specific contracts and verification evidence
- Current structure (foundational 001 + runtime-specific 002-005) is appropriate
- Alternative: Consider phase-based renumbering (001-001 through 001-005) if phase organization is preferred

---

## 5. Key Observations

1. **Merge Hierarchy:** There are two merge options:
   - Conservative: Merge 007 into 006 (2-pair merge)
   - Aggressive: Merge 006 + 007 into 002 (3-packet merge)
   - The conservative option preserves the Level 1/Level 3 distinction, the aggressive option creates a coherent Copilot-specific Level 3 packet

2. **Temporal Clustering:** 006-007 have earlier timestamps (2026-04-25) than 001-005 and 008 (2026-05-08), suggesting they were delivered as quick fixes for the Copilot wrapper schema crash <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-019.md" lines="123-126" />

3. **Status Drift:** 002 and 005 show status drift between spec.md (Complete) and parent graph-metadata.json (in_progress) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-020.md" lines="158-166" />

4. **Documentation Alignment:** 008 is a standalone documentation remediation packet that aligns docs with the behavioral changes from 001-007. It is not a merge candidate because it has clear scope (align docs with shipped behavior) and serves as the cleanup phase of the arc <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-020.md" lines="124-135" />

5. **Cohesive Arc:** All 8 packets form a coherent hook parity remediation arc with clear narrative flow: general runtime parity (001) → runtime-specific fixes (002-005) → Copilot wrapper fixes (006-007) → documentation cleanup (008) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-019.md" lines="99-113" />

---

## 6. Next Steps (for Iter 022)

Based on this overlap analysis, iter 022 should:
1. Evaluate the two merge proposals (conservative vs. aggressive)
2. Decide on the merge strategy for the Copilot packets
3. Propose a phase list for 009-hook-parity based on the merge decisions
4. Consider whether phase-based renumbering is appropriate for 001-005

---

**JSONL row to append:**
```json
{"iter_id": "021", "timestamp_utc": "2026-05-15T21:02:00Z", "executor": "cli-devin", "model": "swe-1.6", "track": 5, "status": "complete", "overlap_pairs_count": 1, "overlap_groups_count": 3, "merge_target_count": 2, "load_bearing_count": 8, "primary_evidence_files": [".opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-parity/001-hook-parity-remediation/spec.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-parity/002-copilot-hook-parity-remediation/spec.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-parity/003-codex-hook-parity-remediation/spec.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-parity/004-claude-hook-findings-remediation/spec.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-parity/005-opencode-plugin-loader-remediation/spec.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-parity/006-copilot-wrapper-schema-fix/spec.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-parity/007-copilot-writer-wiring/spec.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-parity/008-docs-impact-remediation/spec.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-019.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-020.md"]}
```

---

**To complete this iteration, please:**
1. Write the above content to `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-021.md`
2. Append the JSONL row to `research/deep-research-state.jsonl`
