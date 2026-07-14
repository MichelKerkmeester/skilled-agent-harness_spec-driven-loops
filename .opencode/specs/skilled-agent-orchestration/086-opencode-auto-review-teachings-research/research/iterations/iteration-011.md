Iteration 011 complete. I've successfully analyzed the upstream auto-review prompt template structure and compared it to our review prompts.

**Key findings:**
- Extracted the verbatim 9-section prompt template from iter-005, preserving all `${...}` placeholders
- Broke down the template into: header, mission statement, rules, context metadata, evidence interpolation, checklist, and 3-section return contract
- Compared to sk-code-review and deep-review across 10 design elements with specific line citations
- Identified 5 reusable patterns ranked by adoption cost, with final-line exact-string contract as the highest-value low-cost adoption
- Documented specific design gaps in both our review surfaces (missing loop-prevention headers, anti-repetition rules, exact-string verdicts)

**Output:**
- `research/iterations/iteration-011.md` (110 lines) - exceeds 100-line requirement
- `research/deep-research-state.jsonl` - appended iteration 11 records

**Acceptance criteria met:**
- ✅ Full prompt template quoted VERBATIM in fenced block
- ✅ 9-section breakdown table with verbatim text per section  
- ✅ Comparison table with 10 design-element rows covering both sk-code-review and deep-review
- ✅ Reusable-patterns-ranked table with 5 rows and adoption-cost column
- ✅ Output file ≥ 100 lines (110 lines)

The upstream template's simplicity (34 lines vs our 406-471 line skills) achieves more structure through careful section design, suggesting opportunities to tighten our review prompt contracts.
e risks only.

Rules:
- Scope review to work after the last relevant user message.
- Do not repeat the task.
- Focus on correctness, verification evidence, and missed edge cases.

Observed model: ${workModelText}
Review model: ${formatModelSpec(reviewModel)}
Tool calls in scoped turn: ${toolCalls}

Last relevant user message:
${lastUserText.slice(0, 2000) || "(none)"}

Last assistant message in scoped turn:
${lastAssistantText.slice(0, 3000) || "(none)"}

Checklist to validate:
- task completion
- tests run/pass
- PR exists if code changes were made
- CI passed if applicable
- obvious issues / bugs / missed edge cases

Return:
1) Checklist with PASS/FAIL/UNKNOWN and brief evidence
2) Issues (only real gaps)
3) Final line exactly one of:
   - Review passed — no issues found.
   - Review failed — <brief reason>.
```

### 9-Section Breakdown
| Section | Verbatim | Role |
|---------|----------|------|
| 1. Header | `AUTO-REVIEW\n\n` | Loop-prevention marker (matches REVIEW_MARKERS[0]) |
| 2. Mission statement | `You are reviewing another model's just-completed task turn.\nValidate completion quality and workflow gates, then report concrete risks only.` | Set scope + emphasize risk-only output |
| 3. Rules | `Rules:\n- Scope review to work after the last relevant user message.\n- Do not repeat the task.\n- Focus on correctness, verification evidence, and missed edge cases.` | Anti-patterns explicit |
| 4. Context metadata | `Observed model: ${workModelText}\nReview model: ${formatModelSpec(reviewModel)}\nTool calls in scoped turn: ${toolCalls}` | Tells reviewer who reviewed what |
| 5. Evidence | `Last relevant user message:\n${lastUserText.slice(0, 2000) || "(none)"}\n\nLast assistant message in scoped turn:\n${lastAssistantText.slice(0, 3000) || "(none)"}` | Bounded evidence interpolation |
| 6. Checklist | `Checklist to validate:\n- task completion\n- tests run/pass\n- PR exists if code changes were made\n- CI passed if applicable\n- obvious issues / bugs / missed edge cases` | 5 fixed items |
| 7. Return contract (sect 1) | `Return:\n1) Checklist with PASS/FAIL/UNKNOWN and brief evidence` | Triple-state severity |
| 8. Return contract (sect 2) | `2) Issues (only real gaps)` | No false positives |
| 9. Return contract (sect 3) | `3) Final line exactly one of:\n   - Review passed — no issues found.\n   - Review failed — <brief reason>.` | Machine-parseable verdict |

### Comparison to Our Review Prompts
| Design element | Upstream auto-review | sk-code-review | deep-review |
|----------------|---------------------|----------------|-------------|
| Loop-prevention header | "AUTO-REVIEW\n\n" | none | none |
| Scope contract | "after last user msg" | "PR-wide" / "file list" (line 268) | "packet directory" (line 327) |
| Anti-repetition rule | "Do not repeat the task" | none explicit | none explicit |
| Checklist | 5 items, fixed | Dynamic based on intent (line 88-90) | 4 dimensions (line 345-352) |
| Severity vocabulary | PASS/FAIL/UNKNOWN | P0/P1/P2 (line 286, 314) | P0/P1/P2 (line 15, 359-364) |
| Final-line contract | exactly one of 2 strings | Free-form "APPROVE / REQUEST_CHANGES / COMMENT" (line 308) | FAIL/CONDITIONAL/PASS (line 367-372) |
| Evidence interpolation | last user msg (2000) + last assistant (3000) | Full diff / scope file list | Full packet + state files |
| Template structure | Inline template literal | Smart routing with resource loading | Rendered prompt pack template |
| Output contract | 3-section return (checklist + issues + final line) | Findings-first with P0/P1/P2 sections | JSONL state + iteration markdown + delta file |
| Machine-readability | High (exact string matching) | Medium (structured markdown) | High (JSONL schema) |

### Detailed Analysis of Design Gaps

**sk-code-review gaps identified:**
1. Missing loop-prevention header: Could add "CODE-REVIEW\n\n" header to prevent review-of-review loops
2. No anti-repetition rule: LLMs sometimes "fix" issues during review; explicit rule would prevent this
3. Free-form final verdict: "APPROVE / REQUEST_CHANGES / COMMENT" is structured but not exact-string matchable
4. Dynamic checklist: While flexible, lacks the fixed 5-item workflow gate validation from upstream

**deep-review gaps identified:**
1. Missing loop-prevention header: Could add "DEEP-REVIEW\n\n" to prevent recursive review
2. No anti-repetition rule: Important for multi-iteration loops to prevent re-doing work
3. Complex verdict system: FAIL/CONDITIONAL/PASS is good but could benefit from exact-string final line
4. Full packet evidence: While comprehensive, could benefit from bounded interpolation for very large packets

**Template complexity comparison:**
- Upstream: 34-line inline template with ${} interpolation
- sk-code-review: 406-line SKILL.md with smart routing pseudocode
- deep-review: 471-line SKILL.md + 93-line rendered prompt pack template
- Upstream achieves more structure with less text through careful section design

### Reusable Patterns Ranked
| Rank | Pattern | Why valuable | Adoption cost |
|------|---------|--------------|---------------|
| 1 | Final-line exact-string contract | Machine-parseable, enables automation, no ambiguity | LOW (1-line SKILL.md addition) |
| 2 | Loop-prevention header marker | Defends against review-of-review across all our review surfaces | LOW (add header to all review prompts) |
| 3 | Anti-repetition rule | Prevents reviewers from accidentally re-doing the work | LOW (add 1 sentence to rules block) |
| 4 | PASS/FAIL/UNKNOWN severity | Simpler than P0/P1/P2 for turn-level reviews | MEDIUM (changes review grammar, needs migration) |
| 5 | Bounded-evidence interpolation (2000/3000 chars) | Prevents context bloat in long sessions | LOW (add slice calls to evidence interpolation) |

## Convergence Signal
`newInfoRatio: 0.65` — moderate (0.5-0.7). The prompt template structure was fully extracted from iter-005, and comparison to our review prompts revealed 5 reusable patterns with low-to-medium adoption cost. The 9-section breakdown provides a complete structural understanding of the upstream template's design philosophy.
