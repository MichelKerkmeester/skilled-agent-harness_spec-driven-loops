# Deep Review Iteration 002

## Dimension

Security

## Files Reviewed

| File | Lines | Purpose |
|---|---:|---|
| `.opencode/specs/deep-loops/032-goal-opencode-plugin/review/deep-review-state.jsonl` | 1-2 | Prior iteration state and open finding guard. |
| `.opencode/specs/deep-loops/032-goal-opencode-plugin/review/deep-review-strategy.md` | 22-43, 117-129, 147-167 | Charter, known context, and pending doc inventory. |
| `.opencode/specs/deep-loops/032-goal-opencode-plugin/review/deep-review-findings-registry.json` | 9-55 | Open finding registry; `P1-001` was not re-emitted. |
| `.opencode/skills/sk-code-review/references/review_core.md` | 28-48, 77-103 | Severity and evidence doctrine. |
| `.opencode/plugins/mk-goal.js` | 25-29, 98-124 | Character caps and env-driven limits for objective, goal prompt, injection, and evidence. |
| `.opencode/plugins/mk-goal.js` | 191-235 | Sanitization and redaction behavior for goal text and verifier evidence. |
| `.opencode/plugins/mk-goal.js` | 287-324, 348-355 | Generated goal prompt storage and metadata behavior. |
| `.opencode/plugins/mk-goal.js` | 652-730 | Stored-goal normalization; objective is sanitized and verifier evidence is redacted. |
| `.opencode/plugins/mk-goal.js` | 1538-1578 | Active-goal injection sanitization and length clamp. |
| `.opencode/plugins/mk-goal.js` | 1602-1647, 1668-1675 | Tool output fields, `store_health`, and `mutation=` enum behavior. |
| `.opencode/skills/system-spec-kit/references/hooks/goal_plugin.md` | 33-59 | Operator contract for sanitized objective, exact injection preview, env caps, and state boundaries. |
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | 646-660 | Central env-variable reference and char-cap rows. |
| `.opencode/skills/system-spec-kit/constitutional/goal-prompting-runtime-specific.md` | 53-71 | Runtime-routing constitutional note; no sanitizer/storage claim beyond tool routing. |
| `.opencode/skills/system-skill-advisor/feature_catalog/07--hooks-and-plugin/goal-opencode-plugin.md` | 27-41 | Skill-advisor feature catalog claims for sanitized injection/readback. |
| `.opencode/skills/system-skill-advisor/manual_testing_playbook/02--cli-hooks-and-plugin/goal-opencode-plugin.md` | 60-83, 115-145 | Manual validation and failure modes for bounded sanitized injection. |
| `.opencode/skills/system-spec-kit/feature_catalog/18--ux-hooks/goal-opencode-plugin.md` | 29-61 | System-spec-kit feature catalog claims for raw sanitized objective and tests. |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/18--ux-hooks/goal-opencode-plugin.md` | 17-59 | System-spec-kit manual scenario for goal status and injection preview. |
| `.opencode/skills/system-spec-kit/references/config/hook_system.md` | 168-177 | Hook-system note on raw objective preview and goalPrompt boundary. |
| `.opencode/skills/system-spec-kit/SKILL.md` | 433-437 | Skill-level pointer to the goal-plugin operator contract. |
| `README.md` | 1230-1233 | Root README high-level goal-plugin claim. |
| `.opencode/plugins/README.md` | 45-50 | Plugin inventory contract. |

## Security Audit Findings

No new security-relevant doc drift was confirmed in this iteration.

Source behavior confirmed:

- The plugin does not implement blanket encryption or full PII scrubbing. It normalizes Unicode, removes selected control/invisible characters, rewrites active-goal markers and role labels, redacts selected prompt-injection phrases, trims whitespace, and clamps text in `normalizeUserAuthoredText`, `sanitizeInlineText`, and `sanitizePromptText` [SOURCE: `.opencode/plugins/mk-goal.js:191-225`].
- Evidence redaction is stronger than generic text sanitization but still pattern-based: OpenAI-style `sk-`, GitHub `gh*`, Slack `xox*`, AWS `AKIA`, and assignment-like `api_key`/`token`/`password`/`secret` values are redacted [SOURCE: `.opencode/plugins/mk-goal.js:228-235`].
- Stored goals sanitize `objective`, `goalId`, message ids, continuation reasons, verifier reason, evidence, and usage source before returning normalized state [SOURCE: `.opencode/plugins/mk-goal.js:657-730`].
- Active-goal injection re-sanitizes objective, goal prompt, reason, verdict, and goal id, then clamps the rendered block to `maxInjectionChars` [SOURCE: `.opencode/plugins/mk-goal.js:1538-1578`].
- `/goal` output still intentionally includes sanitized `objective=`, `goal_prompt=`, redacted `verifier_last_evidence=`, and JSON-encoded `injection_preview=` so operators can inspect what the model receives [SOURCE: `.opencode/plugins/mk-goal.js:1602-1647`].
- `store_health` does not expose raw goal text or file paths: it emits `no_active_goal` when absent or `state_age_ms:<number>` when a goal exists [SOURCE: `.opencode/plugins/mk-goal.js:1602-1637`].
- `mutation=` is restricted to `created`, `refreshed`, or `replaced`, derived from previous/current objective equality, and does not include raw objective content [SOURCE: `.opencode/plugins/mk-goal.js:1668-1675`].

Documentation adjudication:

- `references/hooks/goal_plugin.md` accurately says `/goal set` stores a sanitized raw `objective`, derives `goalPrompt`, injects one active-goal block, and exposes the exact injection preview for operator inspection [SOURCE: `.opencode/skills/system-spec-kit/references/hooks/goal_plugin.md:33-39`]. It does not overclaim encryption, secure storage, or full sanitization.
- `ENV_REFERENCE.md` accurately lists the current char caps for objective, generated goal prompt, injection block, and verifier evidence [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:655-658`]. The pre-existing omission of three state-retention env vars remains covered by `P1-001` and was not re-emitted.
- `system-spec-kit` and `system-skill-advisor` feature/playbook docs make bounded/sanitized injection claims that match the code's pattern-based sanitizer and cap behavior [SOURCE: `.opencode/skills/system-skill-advisor/feature_catalog/07--hooks-and-plugin/goal-opencode-plugin.md:31-35`; `.opencode/skills/system-skill-advisor/manual_testing_playbook/02--cli-hooks-and-plugin/goal-opencode-plugin.md:70-81`; `.opencode/skills/system-spec-kit/feature_catalog/18--ux-hooks/goal-opencode-plugin.md:37-57`; `.opencode/skills/system-spec-kit/manual_testing_playbook/18--ux-hooks/goal-opencode-plugin.md:23-25`].
- `hook_system.md`, `SKILL.md`, root `README.md`, and `.opencode/plugins/README.md` stay at a high-level contract boundary and do not assert stronger sanitizer guarantees than the code provides [SOURCE: `.opencode/skills/system-spec-kit/references/config/hook_system.md:168-177`; `.opencode/skills/system-spec-kit/SKILL.md:433-437`; `README.md:1230-1233`; `.opencode/plugins/README.md:45-50`].

## Findings by Severity

### P0

None.

### P1

None new. Existing `P1-001` remains open from iteration 1 and was not re-emitted.

### P2

None.

## Traceability Checks

| Protocol | Status | Evidence |
|---|---|---|
| `spec_code` | pass | Security claims were checked against sanitizer/redaction and output-field code in `.opencode/plugins/mk-goal.js:191-235`, `:657-730`, `:1538-1578`, and `:1602-1675`. |
| `checklist_evidence` | not_applicable | This iteration audited doc-vs-code security claims; no checklist-specific acceptance item was needed. |
| `skill_agent` | pass | Deep-review skill and review-core severity doctrine were loaded before severity adjudication. |
| `agent_cross_runtime` | partial | Runtime-specific constitutional doc was checked for OpenCode-vs-Claude routing claims, but cross-runtime execution was not part of the security pass. |
| `feature_catalog_code` | pass | Goal-plugin feature catalog entries in `system-skill-advisor` and `system-spec-kit` were checked against code behavior. |
| `playbook_capability` | pass | Goal-plugin manual playbooks in `system-skill-advisor` and `system-spec-kit` were checked for sanitizer/output-field claims. |

Ruled out directions:

- Overclaim: no in-scope doc claims encryption, secure storage, full PII scrubbing, or complete sanitization for `mk-goal`.
- Underclaim with security impact: no in-scope doc says unsanitized goal text is stored or injected. The docs that discuss this boundary describe sanitized objective/injection behavior.
- Output-field disclosure: `store_health` and `mutation=` do not leak raw goal text, absolute state paths, or PII by themselves.
- Related traceability gap: absence of `store_health`/`mutation=` documentation remains relevant for later traceability coverage, but this security pass found no inaccurate security characterization of those fields.

## Next Dimension

Traceability. Prioritize complete coverage of `store_health`, `mutation=`, and the three `MK_GOAL_STATE_*` retention variables across `references/hooks/goal_plugin.md`, central env references, feature catalogs, and manual playbooks without re-emitting `P1-001` as a new finding.

Review verdict: PASS
