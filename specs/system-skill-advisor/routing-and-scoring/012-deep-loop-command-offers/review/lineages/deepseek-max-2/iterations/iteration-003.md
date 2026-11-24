# Iteration 3 - Security: trust boundaries around the offer gate and the brief

## Dimension

Security, over the surfaces the packet touches: the untrusted prompt text the gate reads, the child process that answers it on the fallback path, the label rendering that carries a command into the brief, and the policy metadata that decides whether a deep command can spend.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:24-1519` (tracked command rows, the gate patterns, `commandOnlyMentioned`)
- `.skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts:190-330` (child spawn, recommendation parsing, typed overlay)
- `.skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts:250-300` (prompt cap and output schema)
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:880-900,6290-6310` (prompt head and gate call)
- `.skilled/skills/system-skill-advisor/runtime/lib/render.ts:180-275` (label sanitization)
- `.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1489-1590` (degraded row validation)
- `.skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py:2040-2105` (data-hygiene contract for compiled triggers)
- Every file in `review-scope-files.txt`, searched for directive-like text addressed to a reviewer

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `checklist_evidence` | partial | The security-tagged checklist rows and their files were opened this iteration; the task-table pass is next |

- CHK-030 (no secret in a changed file) and CHK-031 (both `/deep` commands keep policy `ask`) are the security-tagged checklist rows; both rest on `command-attach.ts:71-72`, which holds `policy: 'ask'` for `/deep:research` and `/deep:review`, and `:79`, which holds `policy: 'run'` only for the read-mostly doctor.
- REQ-024's refusal reading and REQ-038's degraded-row validation were re-read from the security angle: neither lets a child-supplied string reach the head without the tracked table naming it for that row's owner.
- Evidence: `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:71]`, `[SOURCE: .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1489]`

## Integration Evidence

- `.skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts:283` spawns the Python advisor with an argument vector and no shell, and the prompt travels on stdin, so a prompt carrying shell metacharacters never reaches a shell parser.
- `.skilled/hooks/injection-contract.md` is the hook surface that injects the brief; the brief's command label is produced by `render.ts:227` from sanitized parts only.

## Edge Cases

- Over-long input: the MCP schema rejects a prompt above 10,000 characters (`advisor-tool-schemas.ts:262`), while the Python fallback truncates to the same ceiling before gating (`skill_advisor.py:888`). The two surfaces therefore differ in what they do with an over-long prompt (reject versus answer from the head), but neither reads past the ceiling the packet names, so REQ-030's claim holds and the divergence is documented in `_advisor_prompt_head`'s own docstring.
- A child-supplied `policy` string carrying a newline: `sanitizeSkillLabel` returns `null` for it, so the label renders without a policy word rather than across two lines; a tab collapses to one space and C0/C1 controls are dropped.
- A prompt that opens with a pasted earlier reply: `stripLeadingPastedReply` removes the pasted block before the typed overlay, which withholds a command rather than granting one, so the failure direction is safe.

## Confirmed-Clean Surfaces

- No shell interpolation on the fallback path: `spawn(args.command, args.commandArgs, …)` with `stdio` pipes and the prompt on stdin (`subprocess.ts:283`).
- No terminal-escape injection through the label: `sanitizeSkillLabel` drops the escape byte and the bell, rejects a newline string, and collapses a tab (`render.ts:208-221`).
- No unbounded scan reachable from a prompt: `commandOnlyMentioned` answers a 100,000-character refusal prompt in 14.4 ms and a 72,000-character or-list in 1.6 ms on the built copy.
- Policy metadata cannot make a deep command run unattended: both deep rows are `ask` with `mutating: 'mutates'` (`command-attach.ts:71-72`), which is what NFR-S01 requires.
- No embedded instruction in the review target: the only "ignore previous instructions" strings in scope are assertions inside `test_skill_advisor.py:2055-2097` that require such text to be dropped from compiled triggers.
- The compiled-trigger hygiene contract is pinned by that test: a free-form description, an injection string and an email marker never become triggers.

## Ruled Out

- A command-injection path through the child spawn: the call uses an argv vector, no shell, and a fixed in-repo entrypoint.
- A label-injection path from the fallback's JSON: the tracked-table check gates every supplied command, and the label sanitizer handles the remaining text.
- A denial-of-service path through the gate regexes: bounded windows and linear scans keep the worst sampled prompt under 15 ms.
- A prompt-echo path: the brief prints skill ids, commands and policy words from tracked tables, never the prompt body.

## Next Focus

- Dimension: traceability
- Focus area: `checklist_evidence` - every ticked task in `tasks.md` and every `Met` row against evidence in the tree
- Reason: the focus's second core protocol is still open, and security found nothing to follow up
- Rotation status: correctness, traceability and security covered; maintainability remains after the checkpoint protocol
- Blocked/productive carry-forward: line-by-line citation opening stays PRODUCTIVE
- Required evidence: task ids with their cited paths and the content found there
- Recovery note: none

Review verdict: PASS
