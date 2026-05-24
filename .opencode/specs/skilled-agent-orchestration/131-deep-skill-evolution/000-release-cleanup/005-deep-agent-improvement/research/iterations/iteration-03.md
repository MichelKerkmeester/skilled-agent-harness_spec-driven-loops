# Iter 003 — Integration scanning logic gaps

## Question

Does the deep-agent-improvement INTEGRATION SCANNING surface (surface discovery, runtime-mirror parity, command/skill coverage in scan-integration.cjs + check-mirror-drift.cjs + mirror-sync-verify.cjs) contain logic gaps — a mismatch between the runtime mirrors the docs claim (4 runtimes incl. .gemini/agents) and the mirrors the scanner actually checks, or scanner-vs-policy divergence — NOT already captured in spec.md, audit-findings.jsonl, or iterations 01-02?

## Evidence (file:line citations required)

**Grep results for runtime mirror paths across scripts:**
- `.claude/agents`: 3 matches (scan-integration.cjs:17, mirror-sync-verify.cjs:11, mirror-sync-verify.vitest.ts:66) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-agent-improvement/scripts/scan-integration.cjs" lines="15-20" /> <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-agent-improvement/scripts/lib/mirror-sync-verify.cjs" lines="9-14" />
- `.codex/agents`: 4 matches (scan-integration.cjs:18, mirror-sync-verify.cjs:12, promote-candidate.cjs:89, mirror-sync-verify.vitest.ts:67) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-agent-improvement/scripts/scan-integration.cjs" lines="15-20" /> <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-agent-improvement/scripts/lib/mirror-sync-verify.cjs" lines="9-14" />
- `.gemini/agents`: 3 matches (scan-integration.cjs:19, mirror-sync-verify.cjs:13, mirror-sync-verify.vitest.ts:69) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-agent-improvement/scripts/scan-integration.cjs" lines="15-20" /> <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-agent-improvement/scripts/lib/mirror-sync-verify.cjs" lines="9-14" />
- `.agents/agents`: 0 matches (no script checks this path)

**Key evidence files read:**
- scan-integration.cjs (MIRROR_TEMPLATES constant) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-agent-improvement/scripts/scan-integration.cjs" lines="15-20" />
- mirror-sync-verify.cjs (RUNTIME_MIRRORS constant) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-agent-improvement/scripts/lib/mirror-sync-verify.cjs" lines="9-14" />
- check-mirror-drift.cjs (manifest-driven drift report) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-agent-improvement/scripts/check-mirror-drift.cjs" lines="1-147" />
- integration_scanning.md (reference documentation) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-agent-improvement/references/integration_scanning.md" lines="32-45" />
- mirror_drift_policy.md (policy documentation) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-agent-improvement/references/mirror_drift_policy.md" lines="31-48" />
- SKILL.md (runtime parity section) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-agent-improvement/SKILL.md" lines="269-279" />
- README.md (runtime parity table) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-agent-improvement/README.md" lines="269-279" />

**Cross-reference against known findings:**
- spec.md <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/000-release-cleanup/005-deep-agent-improvement/spec.md" lines="1-306" /> - no integration scanning logic gaps documented
- audit-findings.jsonl (AF-0001..AF-0009, all resolved) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/000-release-cleanup/005-deep-agent-improvement/audit-findings.jsonl" lines="1-9" /> - all findings are documentation structure issues, not integration scanning logic
- iteration-01.md (LG-0001..LG-0003) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/000-release-cleanup/005-deep-agent-improvement/research/iterations/iteration-01.md" lines="1-67" /> - LG-0001 (plateau detection), LG-0002 (stop-condition defaults), LG-0003 (promotion gate evaluation disconnect) - none address integration scanning
- iteration-02.md (LG-0004) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/000-release-cleanup/005-deep-agent-improvement/research/iterations/iteration-02.md" lines="1-64" /> - LG-0004 (benchmark threshold contradiction) - does not address integration scanning

## Findings

### LG-0005: Documentation claims .agents/agents mirror but scanner checks .gemini/agents (P1)

**Severity:** P1

**Description:** There is a documentation-to-implementation mismatch in the runtime mirror paths checked by the integration scanner:
- integration_scanning.md line 39 claims the scanner checks `.agents/agents/{name}.md` as a mirror surface <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-agent-improvement/references/integration_scanning.md" lines="32-45" />
- README.md line 278 lists `.agents/agents/` in the Runtime Parity table as the fourth runtime mirror path <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-agent-improvement/README.md" lines="269-279" />
- However, scan-integration.cjs lines 15-20 defines MIRROR_TEMPLATES with `.gemini/agents/{name}.md` as the fourth mirror, not `.agents/agents/{name}.md` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-agent-improvement/scripts/scan-integration.cjs" lines="15-20" />
- mirror-sync-verify.cjs lines 9-14 similarly defines RUNTIME_MIRRORS with `runtime: 'gemini'` and template `.gemini/agents/{name}.md` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-agent-improvement/scripts/lib/mirror-sync-verify.cjs" lines="9-14" />
- Grep results confirm: `.gemini/agents` has 3 matches across the scripts, while `.agents/agents` has 0 matches

This is a logic gap because operators reading integration_scanning.md or the README Runtime Parity table will expect the scanner to check `.agents/agents/` for mirror parity, but the actual implementation checks `.gemini/agents/`. The mirror_drift_policy.md line 35 correctly references `.gemini/agents/` in its policy text <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-agent-improvement/references/mirror_drift_policy.md" lines="31-48" />, creating inconsistency across the documentation surface.

**in_scope_check:**
- already_in_spec: false
- already_in_audit_findings: false

## Gaps for next iter

- Determine whether the documentation should be updated to reflect .gemini/agents (aligning docs with implementation) or whether the implementation should be changed to check .agents/agents (aligning implementation with docs)
- Review whether .agents/agents/ is a legacy path that was replaced by .gemini/agents/ or if both paths should be supported
- Verify that the integration scanner example output in integration_scanning.md lines 69-90 reflects the actual mirror paths checked by the implementation

## JSONL delta row

{"iter_id":"iteration-003","timestamp_utc":"2026-05-24T03:40:00Z","executor":"cli-devin","model":"swe-1.6","iter_role":"breadth","status":"complete","findings_count":1,"gaps_count":1,"primary_evidence_files":[".opencode/skills/deep-agent-improvement/scripts/scan-integration.cjs",".opencode/skills/deep-agent-improvement/scripts/check-mirror-drift.cjs",".opencode/skills/deep-agent-improvement/scripts/lib/mirror-sync-verify.cjs",".opencode/skills/deep-agent-improvement/references/integration_scanning.md",".opencode/skills/deep-agent-improvement/references/mirror_drift_policy.md",".opencode/skills/deep-agent-improvement/SKILL.md",".opencode/skills/deep-agent-improvement/README.md"]}
