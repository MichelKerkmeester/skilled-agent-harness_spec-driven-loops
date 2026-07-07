You are an adversarial spec-review agent performing iteration 2/10 of a deep review of a Spec-Kit planning packet. You are MODEL MiMo-v2.5-Pro. Frame your review as COSTAR: Context, Objective, Style, Tone, Audience, Response-format. Keep it lean; lead with the format the findings must take.

REVIEW TARGET (read every file; paths are relative to repo root /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, which is your --dir):
  - .opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/002-deep-loop-alignment/checklist.md
  - .opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/002-deep-loop-alignment/decision-record.md
  - .opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/002-deep-loop-alignment/description.json
  - .opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/002-deep-loop-alignment/graph-metadata.json
  - .opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/002-deep-loop-alignment/implementation-summary.md
  - .opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/002-deep-loop-alignment/plan.md
  - .opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/002-deep-loop-alignment/spec.md
  - .opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/002-deep-loop-alignment/tasks.md

This packet is child "002-deep-loop-alignment" of phase-parent 155-parent-skill-native-invocability. You MAY also read the parent docs (.opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/spec.md, graph-metadata.json) and any referenced implementation files under .opencode/skills/ to VERIFY claims.

THIS ITERATION'S DIMENSION — CORRECTNESS:
correctness: CORRECTNESS / internal consistency: do the docs agree with each other and with reality? Look for contradictory status/completion claims across spec.md, plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md and their YAML _memory frontmatter (completion_pct, recent_action, next_safe_action, open_questions). Verify any "executed"/"done"/"validated" claim against the ACTUAL repo state (read the referenced skill/source files, e.g. .opencode/skills/deep-loop-workflows/, to confirm renames/routing/feature-catalog claims really happened). A claim that cannot be confirmed is a finding.

FINDINGS ALREADY RECORDED IN EARLIER ITERATIONS (do NOT repeat these; either add NEW distinct findings, or if you find decisive new evidence about one, note it as a refinement):
- [P0/correctness] implementation-summary.md: 'R5 validated' (line 45) contradicts 'Not run' (line 89) on the same page (.opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/002-deep-loop-alignment/implementation-summary.md:lines 45 vs 89)
- [P0/correctness] implementation-summary.md: 'EXECUTED' (line 54) contradicts 'No source tree changed' (line 57) and 'nothing was implemented' (line 65) (.opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/002-deep-loop-alignment/implementation-summary.md:lines 54, 57, 65)
- [P0/correctness] checklist.md: Verification Summary says 0/11 P0 verified but ALL individual items are [x] (.opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/002-deep-loop-alignment/checklist.md:lines 136-139 (Summary) vs lines 60-209 (items))
- [P1/correctness] tasks.md: completion_pct YAML = 0 but ALL 17 tasks and ALL 3 completion criteria marked [x] (.opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/002-deep-loop-alignment/tasks.md:YAML line 23 vs task/criteria checkboxes lines 57-103)
- [P1/correctness] Cross-document completion state split: tasks.md [x] vs spec.md 'Draft'/0% vs plan.md phases unchecked (.opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/002-deep-loop-alignment/:tasks.md T001-T017 [x]; spec.md line 65 'Status: Draft' + YAML completion_pct:0; plan.md lines 123-133 all phases '[ ]')
- [P1/correctness] implementation-summary.md YAML recent_action says 'Executed' but completion_pct is still 0 (.opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/002-deep-loop-alignment/implementation-summary.md:lines 14 vs 25)

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