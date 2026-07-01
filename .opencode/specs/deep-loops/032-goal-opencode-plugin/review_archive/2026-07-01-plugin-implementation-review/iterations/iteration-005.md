## Dimension

Security -- PASS A: prompt-injection sanitization.

## Files Reviewed

- `.opencode/plugins/mk-goal.js:177` -- `sanitizeInlineText` prompt-control stripping.
- `.opencode/plugins/mk-goal.js:189` -- `sanitizePromptText` multiline prompt-control stripping.
- `.opencode/plugins/mk-goal.js:205` -- `redactEvidence` secret redaction.
- `.opencode/plugins/mk-goal.js:264` -- deterministic goal-prompt enhancement.
- `.opencode/plugins/mk-goal.js:323` -- stored goal-prompt normalization.
- `.opencode/plugins/mk-goal.js:603` -- stored objective normalization on read.
- `.opencode/plugins/mk-goal.js:835` -- set/replacement path sanitization.
- `.opencode/plugins/mk-goal.js:1016` -- verifier-result evidence redaction.
- `.opencode/plugins/mk-goal.js:1350` -- active-goal injection renderer.
- `.opencode/plugins/mk-goal.js:1381` -- system-context append path.
- `.opencode/plugins/mk-goal.js:1412` -- status output and injection preview surface.
- `.opencode/plugins/mk-goal.js:1454` -- tool set/show action routing.
- `.opencode/plugins/__tests__/mk-goal-state.test.cjs:134` -- current adversarial injection coverage.
- `.opencode/plugins/__tests__/mk-goal-supervisor.test.cjs:45` -- secret-redaction coverage.
- `.opencode/specs/deep-loops/032-goal-opencode-plugin/002-injection-plugin/spec.md:123` -- sanitized/fenced injection requirement.
- `.opencode/specs/deep-loops/032-goal-opencode-plugin/002-injection-plugin/spec.md:151` -- prompt-injection risk mitigation claim.
- `.opencode/specs/deep-loops/032-goal-opencode-plugin/007-sk-prompt-goal-enhancement/spec.md:140` -- preserved prompt-injection defenses requirement.

## Findings by Severity

### P0

- None.

### P1

#### DR-005-P1-001 [P1] Active-goal sanitization is a narrow blacklist before promoting user objective text into system context

- File: `.opencode/plugins/mk-goal.js:177`
- Category: security
- Finding class: cross-consumer / prompt-injection boundary
- Claim: A malicious objective can still carry system-prompt-like instructions into the injected active-goal block because the sanitizer only strips a few ASCII role-prefix and instruction-reset patterns before `renderGoalInjection` promotes the derived `goalPrompt` into `output.system`.
- Evidence: `sanitizeInlineText` removes C0 controls, `[active_goal]` markers, triple backticks, five ASCII role labels followed by `:`, and only `ignore|disregard ... previous|prior instructions|messages` phrases [SOURCE: `.opencode/plugins/mk-goal.js:177`-`.opencode/plugins/mk-goal.js:185`]. `sanitizePromptText` applies the same narrow blacklist to the multiline prompt [SOURCE: `.opencode/plugins/mk-goal.js:189`-`.opencode/plugins/mk-goal.js:202`]. The set path stores `sanitizedObjective`, then builds an enhanced prompt from it [SOURCE: `.opencode/plugins/mk-goal.js:835`-`.opencode/plugins/mk-goal.js:847`], and `renderGoalInjection` places the sanitized objective plus sanitized `goalPrompt` under `[active_goal:<goalId>]` in system context [SOURCE: `.opencode/plugins/mk-goal.js:1350`-`.opencode/plugins/mk-goal.js:1378`]. The spec explicitly identifies stored objective prompt-injection language as a risk because injected context could alter higher-priority instructions, with mitigation stated as sanitizing role labels, goal markers, fenced code, and instruction-overriding phrases [SOURCE: `.opencode/specs/deep-loops/032-goal-opencode-plugin/002-injection-plugin/spec.md:151`]. Phase 007 requires preserved prompt-injection defenses for adversarial objective text [SOURCE: `.opencode/specs/deep-loops/032-goal-opencode-plugin/007-sk-prompt-goal-enhancement/spec.md:140`].
- Counterevidence sought: Checked set/replacement and stored-normalization paths for alternate validation; both route through the same sanitizer rather than a stricter allowlist or untrusted-data delimiter [SOURCE: `.opencode/plugins/mk-goal.js:603`-`.opencode/plugins/mk-goal.js:613`, `.opencode/plugins/mk-goal.js:835`-`.opencode/plugins/mk-goal.js:865`]. Checked adversarial tests; they cover active-goal marker breakout, raw `system:`/`developer:` role labels, two instruction-reset phrases, and triple backticks, but not broader system-prompt phrases, unicode bidi/homoglyph controls, or non-backtick markdown fences [SOURCE: `.opencode/plugins/__tests__/mk-goal-state.test.cjs:134`-`.opencode/plugins/__tests__/mk-goal-state.test.cjs:164`].
- Alternative explanation: The implementation may intentionally use a lightweight blacklist because the active goal is user-authored by design. That does not eliminate the boundary issue: this plugin persists that text and reinjects it later as system context, so the sanitizer is the only protection between untrusted objective text and durable instruction elevation.
- Scope proof: Exact search found all objective-setting and injection paths using `sanitizeInlineText`/`sanitizePromptText`; no stricter normalization or allowlist exists on the path from `mk_goal set` to `renderGoalInjection`/`appendGoalBrief` [SOURCE: `.opencode/plugins/mk-goal.js:177`, `.opencode/plugins/mk-goal.js:189`, `.opencode/plugins/mk-goal.js:264`, `.opencode/plugins/mk-goal.js:603`, `.opencode/plugins/mk-goal.js:835`, `.opencode/plugins/mk-goal.js:1350`, `.opencode/plugins/mk-goal.js:1381`].
- Affected surface hints: `mk_goal set`, replacement/reset-by-same-objective path, deterministic goal-prompt enhancement, system transform injection, status injection preview.
- Recommendation: Treat objective/goalPrompt as untrusted quoted data in the injected block and add a positive/structural sanitizer for dangerous prompt-control syntax, including unicode bidi controls, homoglyph/normalization-sensitive role labels, markdown fence variants, and broader instruction-override phrases. Add adversarial tests that prove those payloads cannot become active instructions in `goal_prompt` or `objective`.
- Final severity: P1.
- Confidence: 0.84.
- Downgrade trigger: Downgrade to P2 if the active-goal injection contract is explicitly changed to state that user objectives are trusted instructions by design and only marker/format breakout is in scope.

### P2

- None.

## Traceability Checks

- `spec_code`: Partial. Phase 002 and phase 007 claim prompt-injection defenses; current implementation covers marker breakout, raw ASCII role labels, triple backticks, C0 controls, caps, and two instruction-reset phrase families, but does not meet the broader risk implied by persisted user objective text being injected into system context.
- `checklist_evidence`: Not applicable. The scoped phase folders are Level 1 packets and do not have `checklist.md` files.
- `evidence_redaction`: Pass for reviewed verifier/status surfaces. Verifier evidence is normalized through `redactEvidence`, and tests cover API key and `sk-...` redaction in stored state and status output.
- `graph_status`: Stale. `code_graph_status` reported stale readiness, so this iteration used graphless fallback with exact Grep and direct reads.

## SCOPE VIOLATIONS

- None.

## Verdict

CONDITIONAL. One new P1 security finding was recorded.

## Next Dimension

Traceability -- core spec/code and overlay catalog/playbook alignment, excluding `032-goal-opencode-plugin/009-speckit-command-goal-prompt-offer/**`.

Review verdict: CONDITIONAL
