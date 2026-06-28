You are a remediation-research agent (read-only), iteration 1/10, determining the BEST way to fix Spec-Kit packet 155 (parent-skill native invocability) after a deep review found it FAILing. (Pre-approved, skip Gate 3; do NOT edit any file — research only.)

Read the two deep-review reports for the findings:
  - .opencode/specs/skilled-agent-orchestration/155-parent-skill-native-invocability/001-invocability-mechanism/review/review-report.md
  - .opencode/specs/skilled-agent-orchestration/155-parent-skill-native-invocability/002-deep-loop-alignment/review/review-report.md
Target packet: .opencode/specs/skilled-agent-orchestration/155-parent-skill-native-invocability (children 001-invocability-mechanism, 002-deep-loop-alignment). You may read any file (spec docs, .opencode/skills/deep-loop-workflows/**, .opencode/commands/**, .opencode/agents/**, sk-design, git log) to VERIFY ground truth. Use rg/cat/ls; do not mutate.

YOUR SLICE THIS ITERATION: Ground truth: 002 R1/R2 (rename + invokable-hub routing)
Verify EXACTLY what was executed for 002 R1 (invokable-hub routing) and R2 (name==folder rename). On disk: does .opencode/skills/deep-loop-workflows/deep-ai-council/ exist and ai-council/ absent? Does deep-loop-workflows/SKILL.md implement Option E hub routing (quote lines)? Do all 6 deep-loop packets satisfy name==folder? Run rg for every remaining 'ai-council' reference across .opencode/commands, .opencode/agents, .opencode/skills and classify each as (a) intentional legacy command/agent KEY ADR-001 keeps, or (b) a real broken/stale path. Report which R1/R2 doc claims are TRUE.

ACCUMULATED LEDGER (build on it; correct it if wrong; do NOT repeat steps already present):
VERIFIED FACTS SO FAR:
(none yet)

PROPOSED STEPS SO FAR:
(none yet)

OPEN DECISIONS SO FAR:
(none yet)

RULES: Verify every claim against the real repo with file:line/command evidence. 'Reconcile-to-reality' is the default philosophy (docs should match what is actually on disk) unless you find a decisive reason to revert. Prefer reversible doc edits; flag live-infra edits and destructive ops (folder removal, tool-permission changes) explicitly. Be concrete: exact files, exact changes.

OUTPUT: a short prose summary, then EXACTLY ONE fenced json block as the FINAL content, nothing after it:
```json
{"verified_facts":[{"claim":"","status":"confirmed|refuted|partial","evidence":"file:line + quote or command"}],"recommended_steps":[{"id":"S?","action":"","files":[""],"rationale":"","risk":"low|med|high","reversible":true}],"open_decisions":[{"question":"","options":[""],"recommendation":""}],"critique_prior":[""]}
```