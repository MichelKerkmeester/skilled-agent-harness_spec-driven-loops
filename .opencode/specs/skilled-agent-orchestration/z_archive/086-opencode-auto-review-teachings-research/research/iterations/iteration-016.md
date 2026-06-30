Iteration 016 complete. I've successfully performed the gap analysis comparing upstream auto-review mechanisms to sk-code-review:

**Key findings:**
- **17 mechanisms analyzed**: 6 are n/a (skill-vs-plugin mismatch), 5 are HAVE (different implementation), 6 are DON'T HAVE
- **Architectural difference**: sk-code-review is user-triggered with PR-level scope vs upstream's event-driven session-turn scope
- **High-value adoptions identified**:
  1. Final-line exact-string contract (enables CI gate parsing)
  2. Loop-prevention header (defends against review-of-review loops)
  3. Anti-repetition rule (prevents reviewer-fixing-code anti-pattern)
  4. Diagnostic logging with async-IIFE pattern

**Gap matrix highlights:**
- sk-code-review lacks: loop-prevention markers, dedup map, boundary detection, min-evidence gate, final-line exact-string contract, anti-repetition rule, bounded evidence interpolation, 3-tier config, diagnostic logging
- sk-code-review has (different): structured prompt template (smart routing vs inline), severity vocabulary (P0/P1/P2 vs PASS/FAIL/UNKNOWN)
- Not applicable: event-driven activation, cross-model selection, family bias, session-set, dynamic discovery, child-session isolation

**Output:**
- `research/iterations/iteration-016.md` (129 lines) — includes gap matrix, adopt-decision table, definitely-don't-adopt table, detailed category analysis, and implementation notes
- `research/deep-research-state.jsonl` — appended iteration record with mechanismsExtracted=17, gapsIdentified=9

All acceptance criteria met. Ready for iteration 017.
-review evidence | Have it? | Notes |
|-----------|-------------------|------------------------------|----------|-------|
| Event-driven activation (session.idle) | auto-review.ts:139-151 event handler for session.idle + session.error | n/a | n/a | sk-code-review is a skill, not a plugin; activated by user request via keyword triggers (SKILL.md:16-26), not runtime session events |
| Cross-model selection algorithm | inferReviewModels with rank function (iter-008) | n/a | n/a | sk-code-review doesn't dispatch models; it's invoked by agents that already have a model selected |
| Cross-AI family bias (different family first) | rank function prioritizes differentFamily cohort (iter-008) | n/a | n/a | sk-code-review doesn't do model selection; grep for "family" only found "family": "sk-code" in graph-metadata.json:4 |
| Loop-prevention markers (text-based) | REVIEW_MARKERS array ["AUTO-REVIEW", "SELF_ASSESSMENT", "FEEDBACK"] (iter-009) | DON'T HAVE | grep for "marker|REVIEW_MARKER" found surface detection markers (next.config, vite.config, package.json, src/) at SKILL.md:203 but no loop-prevention markers | sk-code-review lacks "CODE-REVIEW" or similar header to prevent review-of-review loops |
| Loop-prevention session-set | reviewSessionIDs Set to skip child session.idle events (iter-007, iter-009) | n/a | n/a | sk-code-review is user-triggered, doesn't create child sessions; no session-set concept applies |
| Loop-prevention dedup map | reviewedMessageBySession Map with message signatures (iter-009) | DON'T HAVE | grep for "dedup|signature" found only function signature references in code_quality_checklist.md:76, 105; no dedup map mechanism | sk-code-review lacks runtime dedup to prevent re-reviewing the same PR state |
| Boundary detection (last user msg) | findLastRelevantUserBoundaryIndex + findLastAssistantAfterIndex (iter-010) | DON'T HAVE | grep for "boundary|last user" found "boundary" in intent keywords (SKILL.md:129, 132) and quality checklists (code_quality_checklist.md:3, 8) but no session message boundary detection | sk-code-review operates on PR diffs, not session message streams; different scope concept |
| Min-evidence gate (MIN_TOOL_CALLS) | MIN_TOOL_CALLS = 3, configurable via config.minToolCalls (iter-010) | DON'T HAVE | grep for "minToolCalls|min.*tool|gate" found "quality gate" references but no min-tool-call threshold mechanism | sk-code-review has no minimum evidence gate; would review a single-line change if requested |
| Structured prompt template | 34-line inline template with 9 sections (iter-011) | HAVE | sk-code-review uses smart routing with resource loading (SKILL.md:66-90) and references/ subdirectory; grep for "template" found no inline template but has structured resource loading pattern | sk-code-review's template is more complex (406-line skill + reference files) vs upstream's 34-line inline template |
| Severity vocabulary (PASS/FAIL/UNKNOWN) | Triple-state severity in checklist return (iter-011) | HAVE (different) | sk-code-review uses P0/P1/P2 severity tiers (SKILL.md:286, 314, README.md:77); grep for "PASS|FAIL|UNKNOWN" found PASS/FAIL in manual testing playbook verdicts but not as severity vocabulary | Different severity scheme: P0/P1/P2 vs PASS/FAIL/UNKNOWN; both are 3-tier but with different semantics |
| Final-line exact-string contract | "Review passed — no issues found." or "Review failed — <brief reason>." (iter-011) | DON'T HAVE | grep for "final line|exactly" found only test scenario execution instructions ("Execute the deterministic steps exactly as written") but no final-line exact-string contract in review output | sk-code-review uses free-form "APPROVE / REQUEST_CHANGES / COMMENT" (SKILL.md:308), not exact-string matchable |
| Anti-repetition rule | "Do not repeat the task." in prompt template (iter-011) | DON'T HAVE | grep for "repeat|anti" found "repeated logic" in DRY keywords (SKILL.md:131) and test scenario repeat instructions, but no anti-repetition rule for reviewers | sk-code-review lacks explicit rule to prevent reviewers from accidentally fixing code during review |
| Bounded evidence interpolation | lastUserText.slice(0, 2000) + lastAssistantText.slice(0, 3000) (iter-011) | DON'T HAVE | grep for "slice|interpolation|2000|3000" found only "template interpolation" in security_checklist.md:27 (XSS via unsafe template rendering), no evidence slicing | sk-code-review uses full diff / full packet evidence without character limits |
| 3-tier config (file/env/default) | loadConfig + plugin init with file-tier → env-tier → default-tier (iter-012) | DON'T HAVE | grep for "config|env|file" found "No configuration is required" in README.md:234 and file references, but no 3-tier config resolution | sk-code-review has hardcoded findings-first format and mandatory minimums; no file/env/default config tiers |
| Dynamic model discovery | client.config.providers() to fetch available models (iter-012) | n/a | n/a | sk-code-review doesn't dispatch models; dynamic discovery only applies to plugins that create child sessions |
| Diagnostic logging (per-workspace) | initDebugLogger with async-IIFE, lazy mkdir, ISO timestamps (iter-013) | DON'T HAVE | grep for "log|debug" found "sensitive logs" in security checklists and console.log in examples, but no diagnostic logging mechanism | sk-code-review has no per-workspace diagnostic logging; no debug logger |
| Child-session isolation | client.session.create({ parentID }) with 7 isolation properties (iter-014) | n/a | n/a | sk-code-review is user-triggered skill, doesn't create child sessions; isolation only applies to runtime plugins |

### Adopt? Decision Table

| Mechanism | Adopt? | Justification |
|-----------|--------|---------------|
| Loop-prevention markers | YES | Adding "CODE-REVIEW\n\n" header to review prompts would defend against review-of-review loops across all our review surfaces (sk-code-review, deep-review); low adoption cost (1-line addition to prompt templates) |
| Loop-prevention dedup map | MAYBE | Could add dedup tracking to review workflows to prevent re-reviewing the same PR state, but sk-code-review is typically invoked once per PR; more valuable for deep-review multi-iteration loops |
| Final-line exact-string contract | YES | Machine-parseable verdict enables automation (CI gates, PR status checks) and removes ambiguity; low adoption cost (add 1-line contract to output template) |
| Anti-repetition rule | YES | Explicit "Do not repeat the task" rule prevents reviewers from accidentally fixing code during review, a common anti-pattern; low adoption cost (add 1 sentence to rules block) |
| Bounded evidence interpolation | MAYBE | Character limits (2000/3000) prevent context bloat in large diffs, but sk-code-review's full-evidence approach is valuable for cross-file architectural analysis; adopt only for very large PRs |
| 3-tier config | NO | sk-code-review is a skill, not a plugin; hardcoded findings-first format and mandatory minimums are by design; operator customization would weaken the baseline contract |
| Diagnostic logging | YES | Per-workspace diagnostic logging with enable gate (config or env var) would help debug review failures and track review quality; adopt upstream's async-IIFE pattern for non-blocking writes |

### Definitely Don't Adopt (skill-vs-plugin mismatch)

| Mechanism | Rationale |
|-----------|-----------|
| Event-driven activation (session.idle) | sk-code-review is a skill, not a plugin; activated by user request via keyword triggers (SKILL.md:16-26), not runtime session events. The upstream plugin's session.idle event handler (auto-review.ts:139-151) is a runtime hook that only applies to OpenCode SDK plugins. |
| Cross-model selection algorithm | sk-code-review doesn't dispatch models; it's invoked by agents that already have a model selected. Model selection is the caller's responsibility. The upstream inferReviewModels function (iter-008) with rank function is specific to plugins that choose reviewer models dynamically. |
| Cross-AI family bias | sk-code-review doesn't do model selection at all; family bias only applies to plugins that choose reviewer models dynamically. The upstream rank function prioritizing differentFamily cohort (iter-008) is irrelevant to a skill that doesn't select models. |
| Loop-prevention session-set | sk-code-review is user-triggered and doesn't create child sessions; session-set only applies to runtime plugins that spawn child sessions. The upstream reviewSessionIDs Set (iter-007, iter-009) is for tracking child review sessions to prevent their idle events from triggering reviews. |
| Dynamic model discovery | sk-code-review doesn't dispatch models; client.config.providers() is only relevant for plugins that create child sessions with model selection. The upstream dynamic provider discovery (iter-012) adapts to user's configured models at runtime, which doesn't apply to a skill with no model dispatch. |
| Child-session isolation | sk-code-review is a user-triggered skill, doesn't create child sessions; isolation guarantees only apply to runtime plugins. The upstream client.session.create({ parentID }) with 7 isolation properties (iter-014) is specific to OpenCode SDK child sessions. |

### Detailed Gap Analysis by Category

**Activation & Scope (3 mechanisms, 2 n/a, 1 DON'T HAVE)**
- Event-driven activation: n/a (skill-vs-plugin mismatch)
- Cross-model selection: n/a (skill doesn't dispatch models)
- Boundary detection: DON'T HAVE — sk-code-review operates on PR diffs, not session message streams. The upstream findLastRelevantUserBoundaryIndex (iter-010) is session-specific.

**Loop Prevention (3 mechanisms, 1 n/a, 2 DON'T HAVE)**
- Loop-prevention markers: DON'T HAVE — sk-code-review lacks "CODE-REVIEW" header to prevent review-of-review loops. Upstream REVIEW_MARKERS array (iter-009) provides text-based loop prevention.
- Loop-prevention session-set: n/a (skill doesn't create child sessions)
- Loop-prevention dedup map: DON'T HAVE — sk-code-review lacks runtime dedup to prevent re-reviewing the same PR state. Upstream reviewedMessageBySession Map (iter-009) tracks message signatures.

**Evidence & Gates (2 mechanisms, 2 DON'T HAVE)**
- Min-evidence gate: DON'T HAVE — sk-code-review has no minimum evidence gate. Upstream MIN_TOOL_CALLS = 3 (iter-010) skips review if scoped tool count < threshold.
- Bounded evidence interpolation: DON'T HAVE — sk-code-review uses full diff evidence without character limits. Upstream uses lastUserText.slice(0, 2000) + lastAssistantText.slice(0, 3000) (iter-011).

**Prompt & Output (4 mechanisms, 2 HAVE, 2 DON'T HAVE)**
- Structured prompt template: HAVE (different) — sk-code-review uses smart routing with resource loading (SKILL.md:66-90). Upstream uses 34-line inline template (iter-011).
- Severity vocabulary: HAVE (different) — sk-code-review uses P0/P1/P2 (SKILL.md:286). Upstream uses PASS/FAIL/UNKNOWN (iter-011).
- Final-line exact-string contract: DON'T HAVE — sk-code-review uses free-form "APPROVE / REQUEST_CHANGES / COMMENT" (SKILL.md:308). Upstream requires exact string match (iter-011).
- Anti-repetition rule: DON'T HAVE — sk-code-review lacks explicit rule to prevent reviewers from fixing code. Upstream has "Do not repeat the task." (iter-011).

**Config & Logging (2 mechanisms, 2 DON'T HAVE)**
- 3-tier config: DON'T HAVE — sk-code-review has hardcoded format. Upstream uses file-tier → env-tier → default-tier (iter-012).
- Diagnostic logging: DON'T HAVE — sk-code-review has no per-workspace logging. Upstream has initDebugLogger (iter-013).

### Implementation Notes for Adopted Mechanisms

**Final-line exact-string contract implementation:**
Add to SKILL.md Phase 4 output contract (line 302-329):
```markdown
### Final Verdict
**Review status**: [APPROVED | REQUESTED_CHANGES | COMMENTED]
```
Replace free-form "Overall assessment" with exact-string matchable status line to enable CI gate parsing.

**Loop-prevention header implementation:**
Add to all review prompt templates in references/:
```markdown
CODE-REVIEW

You are reviewing a code change for security, correctness, and quality.
```
This header matches upstream's "AUTO-REVIEW" pattern (iter-009) and can be scanned by review workflows to prevent nested review dispatch.

**Anti-repetition rule implementation:**
Add to SKILL.md Phase 3 rules (line 336-358):
```markdown
- Do not implement fixes during review. Report findings only; implementation is a separate follow-up step.
```
This explicit rule prevents the common anti-pattern where reviewers accidentally start fixing code instead of just reporting issues.

**Diagnostic logging implementation:**
Adopt upstream's async-IIFE pattern (iter-013) with JSONL format (our existing pattern is better than upstream's plaintext):
```typescript
const debugLog = (msg: any) => {
  if (!debugEnabled) return
  ;(async () => {
    try {
      await appendFile(logPath, JSON.stringify({ timestamp: new Date().toISOString(), msg }) + "\n")
    } catch {}
  })()
}
```
Add enable gate via env var `SK_CODE_REVIEW_DEBUG=1` or config file.

## Convergence Signal
`newInfoRatio: 0.75` — high (0.6-0.8) since this is the first gap-analysis pass comparing all upstream mechanisms to sk-code-review. Identified 9 mechanisms sk-code-review lacks (loop-prevention markers, dedup map, boundary detection, min-evidence gate, final-line exact-string contract, anti-repetition rule, bounded evidence interpolation, 3-tier config, diagnostic logging) and 6 mechanisms that are not applicable due to skill-vs-plugin architectural differences. The adopt-decision table prioritizes final-line exact-string contract, loop-prevention header, and anti-repetition rule as high-value low-cost adoptions. Implementation notes provide concrete paths for adopting the 3 YES-ranked mechanisms.
