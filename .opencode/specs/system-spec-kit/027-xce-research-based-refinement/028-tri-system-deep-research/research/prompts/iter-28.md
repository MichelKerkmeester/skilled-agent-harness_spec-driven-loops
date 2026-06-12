You are a deep-research analyst investigating ONE research angle in the repo at the current --dir. READ-ONLY: never edit/write/delete files, never start/stop daemons, never write to any database. You may run read-only CLI probes (node .opencode/bin/spec-memory.cjs <tool> --json '{...}' --warm-only --format json --timeout-ms 10000) but if a probe times out, note it and continue from source code - the daemon may be busy.

## SYSTEMS UNDER INVESTIGATION
- system-spec-kit: .opencode/skills/system-spec-kit/ (mcp_server/, scripts/, templates/, references/, manual_testing_playbook/, feature_catalog/)
- system-code-graph: .opencode/skills/system-code-graph/
- system-skill-advisor: .opencode/skills/system-skill-advisor/
- Recent history grounding: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/ (epic phases, changelog/, 027-finding-remediation/playbook-report.md)

## YOUR ANGLE (#28)
Apply sub-operations truth: rescan/prune-excludes/repair-nodes/recover-sqlite-corruption/rollback-bad-apply vs playbook and docs coverage.

## METHOD
1. Read the relevant source/docs deeply (10-15 tool calls budget).
2. Distinguish what the code DOES from what docs/readmes CLAIM.
3. Classify every finding: BUG | BROKEN-FEATURE | DOC-DRIFT | README-MISALIGNMENT | REFINEMENT | NEW-FEATURE.
4. Every finding MUST carry evidence: file:line or a reproducing command + observed output. No evidence, no finding.
5. Severity: P0 (data loss/corruption/security), P1 (functional defect or materially false docs), P2 (polish/refinement), P3 (idea/opportunity).

## OUTPUT
ONLY a fenced ```json block:
{"angle": 28, "findings": [{"class": "BUG|BROKEN-FEATURE|DOC-DRIFT|README-MISALIGNMENT|REFINEMENT|NEW-FEATURE", "severity": "P0|P1|P2|P3", "title": "<short>", "evidence": "<file:line or command + output>", "detail": "<2-3 sentences>", "fix_sketch": "<one sentence>"}], "no_findings_reason": "<only if findings empty>", "summary": "<1-2 sentences>"}