I'm in read-only mode as specified in the task. Here is the complete iteration-020.md content:

---

# Iteration 020 — Track 5 (009-hook-parity per-packet classification)

**Date:** 2026-05-15
**Track:** 5 (009-hook-parity per-packet classification)
**Research Question:** For each nested packet under `026/009-hook-parity/`: problem? load-bearing? merge? delete?

---

## 1. Iter 019 Context

Iter 019 cataloged 8 direct NNN-name children under `009-hook-parity/` and identified three thematic groups:
- Group A: Runtime Hook Parity Core (001-005) — main arc
- Group B: Copilot Wrapper Fixes (006-007)
- Group C: Documentation Alignment (008)

This iteration classifies each packet as load-bearing / merge-candidate / delete-candidate based on spec.md and implementation-summary.md analysis.

---

## 2. Per-Packet Classification

### 001-hook-parity-remediation

| Field | Value | Rationale |
|-------|-------|-----------|
| **Problem solved** | Yes | Fixed 10 hook parity defects across OpenCode plugin bridge, Codex advisor hooks, Copilot startup routing, Codex PreToolUse safety, and runtime documentation. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-parity/001-hook-parity-remediation/spec.md" lines="28-32" /> |
| **Status** | Complete | spec.md shows Status: Complete, implementation-summary shows completion_pct: 100. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-parity/001-hook-parity-remediation/spec.md" lines="44" /> <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-parity/001-hook-parity-remediation/implementation-summary.md" lines="18" /> |
| **Still load-bearing** | Yes | Foundational runtime hook parity remediation with dependencies on skill-advisor and compact-code-graph work. The OpenCode transport diagnostics, Codex prompt hook visibility, Copilot startup routing, and PreToolUse policy changes are live runtime code. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-parity/001-hook-parity-remediation/spec.md" lines="30-32" /> |
| **Merge candidate** | No | Standalone foundational packet that closes the highest customer-facing risks (silent no-op OpenCode context, invisible Codex advisor timeout). Spans multiple runtimes and subsystems; merging would obscure the architectural scope. |
| **Delete candidate** | No | Core of the hook parity remediation arc. Deleting would revert critical runtime fixes across OpenCode, Codex, and Copilot. |

**Classification:** load-bearing

---

### 002-copilot-hook-parity-remediation

| Field | Value | Rationale |
|-------|-------|-----------|
| **Problem solved** | Yes | Copilot CLI had no hook parity with Claude Code — no startup context and no advisor brief. Implemented Outcome B: file-based workaround via `$HOME/.copilot/copilot-instructions.md` because Copilot hook output cannot mutate prompts. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-parity/002-copilot-hook-parity-remediation/spec.md" lines="45-52" /> |
| **Status** | Complete | spec.md shows Status: Complete, implementation-summary shows completion_pct: 100. Parent graph-metadata shows in_progress (status drift). <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-parity/002-copilot-hook-parity-remediation/spec.md" lines="63" /> <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-parity/002-copilot-hook-parity-remediation/implementation-summary.md" lines="18" /> |
| **Still load-bearing** | Yes | The managed custom-instructions writer (`custom-instructions.ts`) and Copilot prompt/session hooks are live runtime code. Copilot users receive startup context and advisor brief through this path. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-parity/002-copilot-hook-parity-remediation/implementation-summary.md" lines="65-78" /> |
| **Merge candidate** | No | Standalone Copilot-specific parity packet with a clear outcome (file-based workaround). Merging would obscure the Copilot-specific constraints and the documented limitation of next-prompt freshness. |
| **Delete candidate** | No | Only working path for Copilot hook parity. Deleting would remove the custom-instructions writer and leave Copilot sessions without advisor context. |

**Classification:** load-bearing

---

### 003-codex-hook-parity-remediation

| Field | Value | Rationale |
|-------|-------|-----------|
| **Problem solved** | Yes | Codex CLI natively supports hooks but no Spec Kit Memory hook was wired. Implemented Outcome A: full native hook parity with SessionStart and UserPromptSubmit hooks registered in `~/.codex/hooks.json`. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-parity/003-codex-hook-parity-remediation/spec.md" lines="47-53" /> |
| **Status** | Complete | spec.md shows Status: Complete, implementation-summary shows completion_pct: 100. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-parity/003-codex-hook-parity-remediation/spec.md" lines="66" /> <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-parity/003-codex-hook-parity-remediation/implementation-summary.md" lines="18" /> |
| **Still load-bearing** | Yes | Native Codex SessionStart and UserPromptSubmit hooks are live and inject developer context via `hookSpecificOutput.additionalContext`. Live config `~/.codex/hooks.json` and `~/.codex/config.toml` enable `codex_hooks = true`. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-parity/003-codex-hook-parity-remediation/implementation-summary.md" lines="49-63" /> |
| **Merge candidate** | No | Standalone Codex-specific parity packet with clear scope (native hook wiring). Merging would obscure the Codex-specific contract and the empirical verification evidence. |
| **Delete candidate** | No | Only path for Codex hook parity. Deleting would unregister the hooks and leave Codex sessions without startup context or advisor briefs. |

**Classification:** load-bearing

---

### 004-claude-hook-findings-remediation

| Field | Value | Rationale |
|-------|-------|-----------|
| **Problem solved** | Yes | Three findings from end-to-end Claude Code hook testing: (A) advisor freshness stuck in stale-loop because sourceSignature is null, (B) .claude/settings.local.json mixes Copilot-schema fields with Claude-schema, (C) no documented multi-turn regression harness. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-parity/004-claude-hook-findings-remediation/spec.md" lines="69-76" /> |
| **Status** | Complete | spec.md shows Status: In Progress (86%), implementation-summary shows implementation complete with some verification blocked by sandbox limitations. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-parity/004-claude-hook-findings-remediation/spec.md" lines="58" /> <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-parity/004-claude-hook-findings-remediation/implementation-summary.md" lines="48" /> |
| **Still load-bearing** | Yes | sourceSignature persistence fix is live in scan.ts and freshness.ts. .claude/settings.local.json normalization is live. Multi-turn regression harness documentation is live in skill-advisor-hook-validation.md. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-parity/004-claude-hook-findings-remediation/implementation-summary.md" lines="55-92" /> |
| **Merge candidate** | No | Standalone Claude-specific findings remediation with three distinct fixes (freshness, schema, harness). Merging would obscure the specific root causes and verification evidence. |
| **Delete candidate** | No | Fixes critical advisor freshness bug (sourceSignature null was causing stale-loop on every advisor call). Deleting would revert the freshness persistence and schema normalization. |

**Classification:** load-bearing

---

### 005-opencode-plugin-loader-remediation

| Field | Value | Rationale |
|-------|-------|-----------|
| **Problem solved** | Yes | OpenCode 1.3.17 TUI crash: `TypeError: null is not an object (evaluating 'plugin2.auth')`. Root cause: legacy loader invoked named `parseTransportPlan` export which returned null for non-string input. Fixed by hardening parser and moving helper modules out of `.opencode/plugins/`. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-parity/005-opencode-plugin-loader-remediation/spec.md" lines="50-66" /> |
| **Status** | Complete | spec.md shows Status: Complete, implementation-summary shows completion_pct: 100. Parent graph-metadata shows in_progress (status drift). <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-parity/005-opencode-plugin-loader-remediation/spec.md" lines="80" /> <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-parity/005-opencode-plugin-loader-remediation/implementation-summary.md" lines="18" /> |
| **Still load-bearing** | Yes | Helper modules moved to `plugin_bridges/` (architectural cleanup). parseTransportPlan hardening is live. Plugin folder purity test is live. Skill-advisor hook remap to OpenCode `event` and `experimental.chat.system.transform` is live. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-parity/005-opencode-plugin-loader-remediation/implementation-summary.md" lines="49-69" /> |
| **Merge candidate** | No | Standalone OpenCode-specific crash fix with architectural cleanup and hook remap. Merging would obscure the plugin discovery contract investigation and the multi-phase delivery. |
| **Delete candidate** | No | Fixes critical TUI crash that made OpenCode CLI non-functional across all directories. Deleting would reintroduce the null-hook crash and move helpers back into discovery scope. |

**Classification:** load-bearing

---

### 006-copilot-wrapper-schema-fix

| Field | Value | Rationale |
|-------|-------|-----------|
| **Problem solved** | Yes | Copilot CLI 1.0.34 throws "Neither 'bash' nor 'powershell' specified in hook command configuration" on every user prompt. Root cause: Copilot merges hook configs from both `.github/hooks/*.json` and `.claude/settings.local.json`, and Claude's nested matcher shape lacks top-level Copilot-safe fields. Fixed by adding top-level `type`/`bash`/`timeoutSec` to matcher wrappers. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-parity/006-copilot-wrapper-schema-fix/spec.md" lines="43-59" /> |
| **Status** | Implemented | spec.md shows Status: Reverted - Needs Reapply (40%), implementation-summary shows fields reapplied and status: implemented. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-parity/006-copilot-wrapper-schema-fix/spec.md" lines="33" /> <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-parity/006-copilot-wrapper-schema-fix/implementation-summary.md" lines="23" /> |
| **Still load-bearing** | Yes | Top-level Copilot-safe fields are live in `.claude/settings.local.json`. Without these fields, Copilot crashes on every user prompt. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-parity/006-copilot-wrapper-schema-fix/implementation-summary.md" lines="30-34" /> |
| **Merge candidate** | Yes (with 007) | Forms "Copilot Wrapper Integration" arc with 007-copilot-writer-wiring. Both are Level 1, both fix Copilot-specific integration issues, both were reverted then reapplied together. Could merge into single "Copilot wrapper schema + writer wiring" packet. |
| **Delete candidate** | No | Fixes schema collision that crashes Copilot on every prompt. Deleting would reintroduce the "Neither bash nor powershell" error. |

**Classification:** load-bearing, merge-candidate (with 007)

---

### 007-copilot-writer-wiring

| Field | Value | Rationale |
|-------|-------|-----------|
| **Problem solved** | Yes | After packet 010 fixed the schema crash, the userPromptSubmitted hook still didn't refresh the managed block because Superset wrapper clobbers `.github/hooks/superset-notify.json`. Fixed by replacing no-op `bash: "true"` in `.claude/settings.local.json` with actual Copilot writer commands. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-parity/007-copilot-writer-wiring/spec.md" lines="38-49" /> |
| **Status** | Implemented | spec.md shows Status: Reverted - Needs Reapply (35%), implementation-summary shows writer commands reapplied and status: implemented. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-parity/007-copilot-writer-wiring/spec.md" lines="31" /> <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-parity/007-copilot-writer-wiring/implementation-summary.md" lines="23" /> |
| **Still load-bearing** | Yes | Top-level Copilot writer commands are live in `.claude/settings.local.json` for UserPromptSubmit and SessionStart. These commands invoke the system-spec-kit writers to refresh the managed block. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-parity/007-copilot-writer-wiring/implementation-summary.md" lines="30-69" /> |
| **Merge candidate** | Yes (with 006) | Forms "Copilot Wrapper Integration" arc with 006-copilot-wrapper-schema-fix. Both are Level 1, both fix Copilot-specific integration issues, both were reverted then reapplied together. Merging would consolidate the schema fix and writer wiring into a coherent Copilot wrapper packet. |
| **Delete candidate** | No | Enables per-prompt refresh of the managed Copilot context block. Deleting would freeze the Refreshed: timestamp and leave Copilot without fresh advisor context. |

**Classification:** load-bearing, merge-candidate (with 006)

---

### 008-docs-impact-remediation

| Field | Value | Rationale |
|-------|-------|-----------|
| **Problem solved** | Yes | Sub-packets 001-011 changed runtime hook contracts, advisor delivery, plugin-loader semantics, Copilot wrapper schema, and Codex startup parity. 13 documentation files were flagged as factually wrong or misleading. Updated all 13 files to align with shipped behavior. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-parity/008-docs-impact-remediation/spec.md" lines="43-63" /> |
| **Status** | Complete | spec.md shows Status: Planning (5%), implementation-summary shows completion_pct: 100 and status: complete. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-parity/008-docs-impact-remediation/spec.md" lines="33" /> <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-parity/008-docs-impact-remediation/implementation-summary.md" lines="24" /> |
| **Still load-bearing** | Yes | Documentation is the source of truth for operators. The 13 updated files (hook_system.md, SKILL.md, ARCHITECTURE.md, AGENTS.md, install guides, feature catalog, testing playbook) now accurately reflect the shipped runtime behavior. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-parity/008-docs-impact-remediation/implementation-summary.md" lines="34-36" /> |
| **Merge candidate** | No | Standalone documentation remediation packet with clear scope (align docs with shipped behavior). Merging would obscure the impact analysis methodology and the per-file change evidence. |
| **Delete candidate** | No | Aligns documentation with actual runtime behavior. Deleting would leave operators with stale or misleading guidance about hook parity, advisor delivery, and plugin-loader semantics. |

**Classification:** load-bearing

---

## 3. Summary

### Load-bearing packets (8)

All 8 packets under `009-hook-parity/` are load-bearing:

- **001-005**: Runtime Hook Parity Core — foundational remediation across all runtimes (OpenCode, Codex, Copilot, Claude)
- **006-007**: Copilot Wrapper Integration — schema fix and writer wiring for Copilot-specific integration
- **008**: Documentation Alignment — reconciles docs with behavioral changes from 001-007

### Merge candidates (1 pair)

- **006 + 007**: Both are Level 1, both fix Copilot-specific wrapper issues, both were reverted then reapplied together. Could merge into single "Copilot wrapper schema + writer wiring" packet. The arc is coherent (schema fix → writer wiring) but the two-phase pattern is intentional for validation safety.

### Delete candidates (0)

No packets are delete candidates. All 8 packets deliver load-bearing runtime fixes or critical documentation alignment.

---

## 4. Status Drift

Two packets show status drift between spec.md and parent graph-metadata.json:

- **002-copilot-hook-parity-remediation**: spec.md shows Complete, parent shows in_progress
- **005-opencode-plugin-loader-remediation**: spec.md shows Complete, parent shows in_progress

Both implementation-summaries show 100% completion with verification evidence. Parent metadata should be updated to reflect complete status.

---

## 5. Key Observations

1. **Cohesive remediation arc**: All 8 packets form a coherent hook parity remediation arc across all runtimes. The narrative flow is clear: general runtime parity (001) → runtime-specific fixes (002-005) → Copilot wrapper fixes (006-007) → documentation cleanup (008).

2. **No dead code**: Every packet delivers live runtime code or critical documentation. No research-only or placeholder packets exist in this arc.

3. **Verification evidence**: All packets have implementation-summary.md with verification evidence (build, vitest, smoke tests, strict validation where applicable).

4. **Cross-runtime coverage**: The arc achieves hook parity across Claude (001, 004), Copilot (002, 006, 007), Codex (001, 003), and OpenCode (001, 005).

5. **Documentation-first remediation**: Packet 008 used a sophisticated impact analysis methodology (10 parallel agents, merged report, severity rollup) to ensure docs alignment. This is a reusable pattern for future behavioral changes.

---

## 6. Gaps for Next Iter

- **Status drift**: Parent graph-metadata.json for 009-hook-parity should update 002 and 005 status from in_progress to complete.
- **Merge candidate evaluation**: Consider whether 006 and 007 should be merged into a single "Copilot Wrapper Integration" packet. The two-phase pattern (schema → writer) is intentional but the packets are tightly coupled.
- **Cross-runtime smoke matrix**: 002, 006, and 007 implementation-summaries note that cross-runtime smoke testing should be rerun before claiming full operational closure.
- **004 verification blockers**: 004 has two blocked acceptance scenarios (AS-003, AS-004) due to user-global hooks and Claude auth in sandbox. These may need user-local verification.

---

**JSONL row to append:**
```json
{"iter_id": "020", "timestamp_utc": "2026-05-15T21:00:00Z", "executor": "cli-devin", "model": "swe-1.6", "track": 5, "status": "complete", "packets_classified": 8, "load_bearing": 8, "merge_candidates": 2, "delete_candidates": 0, "primary_evidence_files": [".opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-parity/001-hook-parity-remediation/spec.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-parity/001-hook-parity-remediation/implementation-summary.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-parity/002-copilot-hook-parity-remediation/spec.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-parity/002-copilot-hook-parity-remediation/implementation-summary.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-parity/003-codex-hook-parity-remediation/spec.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-parity/003-codex-hook-parity-remediation/implementation-summary.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-parity/004-claude-hook-findings-remediation/spec.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-parity/004-claude-hook-findings-remediation/implementation-summary.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-parity/005-opencode-plugin-loader-remediation/spec.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-parity/005-opencode-plugin-loader-remediation/implementation-summary.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-parity/006-copilot-wrapper-schema-fix/spec.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-parity/006-copilot-wrapper-schema-fix/implementation-summary.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-parity/007-copilot-writer-wiring/spec.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-parity/007-copilot-writer-wiring/implementation-summary.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-parity/008-docs-impact-remediation/spec.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-parity/008-docs-impact-remediation/implementation-summary.md"]}
```
