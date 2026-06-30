You are an adversarial spec-review agent performing iteration 2/10 of a deep review of a Spec-Kit planning packet. You are MODEL MiniMax-M3. Frame your review as TIDD-EC with dense pre-planning: Task, Instructions, Do/Don't, Examples, Context. List the exact checks you will run BEFORE running them, then execute each.

REVIEW TARGET (read every file; paths are relative to repo root /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, which is your --dir):
  - .opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/001-invocability-mechanism/checklist.md
  - .opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/001-invocability-mechanism/decision-record.md
  - .opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/001-invocability-mechanism/description.json
  - .opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/001-invocability-mechanism/graph-metadata.json
  - .opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/001-invocability-mechanism/implementation-summary.md
  - .opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/001-invocability-mechanism/plan.md
  - .opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/001-invocability-mechanism/spec.md
  - .opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/001-invocability-mechanism/tasks.md

This packet is child "001-invocability-mechanism" of phase-parent 155-parent-skill-native-invocability. You MAY also read the parent docs (.opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/spec.md, graph-metadata.json) and any referenced implementation files under .opencode/skills/ to VERIFY claims.

THIS ITERATION'S DIMENSION — CORRECTNESS:
correctness: CORRECTNESS / internal consistency: do the docs agree with each other and with reality? Look for contradictory status/completion claims across spec.md, plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md and their YAML _memory frontmatter (completion_pct, recent_action, next_safe_action, open_questions). Verify any "executed"/"done"/"validated" claim against the ACTUAL repo state (read the referenced skill/source files, e.g. .opencode/skills/deep-loop-workflows/, to confirm renames/routing/feature-catalog claims really happened). A claim that cannot be confirmed is a finding.

FINDINGS ALREADY RECORDED IN EARLIER ITERATIONS (do NOT repeat these; either add NEW distinct findings, or if you find decisive new evidence about one, note it as a refinement):
- [P0/correctness] False completion claim in implementation-summary.md (.opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/001-invocability-mechanism/implementation-summary.md:line 46)
- [P0/correctness] Contradictory ADR-001 status: Accepted vs Proposed (.opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/001-invocability-mechanism/decision-record.md:line 47)
- [P0/correctness] False claim of runtime-probe evidence (.opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/001-invocability-mechanism/decision-record.md:line 99)
- [P1/correctness] Scope inconsistency: Option E chosen though spec.md scoped only A–D (.opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/001-invocability-mechanism/spec.md:lines 84–86)
- [P1/correctness] Parent/child status and completion mismatch (.opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/spec.md:line 49)

RULES:
- READ-ONLY. Do not modify any file.
- Every finding MUST cite concrete evidence: a file path plus a line/anchor/section and a short quoted snippet. No evidence => do not report it.
- Verify "executed"/"done"/"validated"/"renamed"/"accepted" claims against the ACTUAL repo before trusting them. If a doc claims something was executed (e.g. a folder rename or routing retrofit), check the real files; a claim you cannot confirm is itself a P0/P1 finding.
- Severity: P0 = blocking integrity/correctness defect or false completion claim; P1 = required fix (traceability gap, contradiction, unverifiable claim); P2 = suggestion/polish.
- Be precise and skeptical. Quality over quantity. It is fine to return few or zero NEW findings if the dimension is clean.

OUTPUT FORMAT (MANDATORY): First a 2-4 sentence prose summary of what you checked and concluded. Then EXACTLY ONE fenced json code block, nothing after it:
```json
{"findings":[{"severity":"P0|P1|P2","dimension":"correctness","title":"short","file":"relative/path","loc":"line/anchor/section","evidence":"short quote","impact":"why it matters","recommendation":"concrete fix"}],"new_findings_count":<int>,"dimension_clean":<true|false>}
```