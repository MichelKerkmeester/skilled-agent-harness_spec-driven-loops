# Review Iteration 5

## Dispatcher

- Mode: review, single review iteration (fan-out lineage `deepseek-max-3`).
- Resolved route: `Resolved route: mode=review target_agent=deep-review`.
- Review target: `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers` (spec-folder).
- Iteration 5 of 7, stop policy `max-iterations`.
- `steer.md` is still absent.
- Operator focus: the traceability pass supplies the trust-boundary map for this security iteration (REQ-038 and the degraded path).

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1480` to `:1600` (degraded path)
- `.skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts:160` to `:255` (`parseRecommendations` and the typed helper)
- `.skilled/skills/system-skill-advisor/runtime/lib/render.ts:155` to `:280`, `:530` to `:570` (label sanitization and the child-session policy)
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:230` to `:320`, `:480` to `:500`, `:790`, `:1380` to `:1519`
- `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:420` to `:470`
- `.skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:1` to `:90`
- `.skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts:250` to `:265`
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5440` to `:5500`, `:6290` to `:6310`
- `.skilled/skills/system-skill-advisor/runtime/tests/cli-degraded-command-contract.vitest.ts:145` to `:200`
- `.skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py:3017` to `:3070`

## Operator Focus

The traceability work already named the one trust boundary this packet changes: a command string that crosses the child-process boundary. This iteration read that boundary and the renderer behind it. REQ-038's guard holds, and no new security finding was raised; the traceability finding R2-P2-001 still stands because it is a documentation defect, not a security one.

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

No new finding. R2-P2-001, R2-P2-002 and R4-P2-001 remain active.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | pass | REQ-038 read at both ends: `trackedCommandForOwner` at `skill-advisor-cli.ts:1489` to `:1494`, its call at `:1571`, and the test at `cli-degraded-command-contract.vitest.ts:152` and `:178`. NFR-S01 read at the deep command rows. |
| `checklist_evidence` | partial | The two P2 evidence drifts remain; AC-047's four assertions were opened at `cli-degraded-command-contract.vitest.ts:152` to `:195`. |

## Integration Evidence

- `render.ts:163` to `:177` (`sanitizeSkillLabel`) strips control characters and newlines and rejects an instruction-shaped label, so a child-supplied label cannot forge a second brief line.
- `skill-advisor-cli.ts:1489` to `:1494` gates a supplied command on the tracked table and the row's own skill or alias before the row prints it.
- `subprocess.ts:180` to `:245` keeps a command, policy, owner and `typed: true` only from a non-empty string or a literal `true`, so a truthy string cannot hide the offer options.

## Edge Cases

- A supplied command string that is unknown or owned by another skill is dropped to the plain skill row and carries no `typed` marker; the test asserts the four missing properties at `cli-degraded-command-contract.vitest.ts:193` to `:195`.
- The Python subprocess path receives its command from the tracked Python advisor rather than from the prompt, so the same child-injection surface does not exist there; recorded, not raised.
- A child-supplied skill label reaches `render.ts` and is sanitized on the way out, so a newline or control character in the label is removed rather than printed.

## Confirmed-Clean Surfaces

- Prompt cap: `ADVISOR_PROMPT_MAX_CHARS = 10_000` at `advisor-tool-schemas.ts:257`, and `_advisor_prompt_head` at `skill_advisor.py:888` cuts the same number of UTF-16 code units.
- Bounded scans: `LEAD_WINDOW = 400` at `command-attach.ts:641` and `_LEAD_WINDOW = 400` at `skill_advisor.py:5009`, with the long-prompt cases at `command-attach-guards.vitest.ts:998` and `test_skill_advisor.py:3017`.
- No secret: the changed files hold no credential, token or environment read that would expose one; the gate reads only the prompt string and the tracked command table.
- In the `system-deep-loop` branch, `attachCommand` never returns a `run`-policy deep command: every `/deep:*` row keeps `ask`, and the only run-policy row that branch returns is the separately tracked `/doctor:deep-loop` diagnosis.
- The hook fallback spawns the CLI with an argument vector, not a shell string.

## Ruled Out

- "A child-supplied command string can reach the brief on the CLI degraded path": ruled out; `trackedCommandForOwner` checks the tracked table and the row's own owner or alias, and the test drops an unknown shell pipeline and another skill's command.
- "A child-supplied label can inject a second brief line": ruled out; `sanitizeSkillLabel` rejects newlines, strips control characters and rejects an instruction-shaped label.
- "A prompt larger than the schema cap reaches the Python gate whole": ruled out; `_advisor_prompt_head` cuts the same 10,000 units and the long-prompt test covers 96,000 characters.
- "The deep commands can be started by the `run` policy": ruled out; the deep rows carry `ask` and the gate never upgrades a policy.

## Next Focus

- Dimension: maintainability, with the overlay traceability protocols.
- Focus area: comment hygiene in the changed files, the skill-to-agent and cross-runtime contracts, the feature-catalog and playbook claims, and the two P2 documentation drifts' fix shape.
- Reason: correctness and security are covered; maintainability is the last dimension, and the overlay protocols have not been run.
- Rotation status: security moves to completed clean; maintainability remains.
- Carry-forward: R2-P2-001, R2-P2-002 and R4-P2-001 stay active advisories.
- Required evidence: a file:line for every maintainability finding, and an explicit overlay-protocol status with the exact surfaces checked.

Review verdict: PASS
