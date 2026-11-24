# Review Iteration 002 — security

- Iteration: 2 of 5
- Dimension: security
- Operator review focus (covered in addition to the dimension): traceability — this iteration checks the security claims the packet records (NFR-S01, NFR-S02, CHK-030 to CHK-032) against the tree, and records the REQ-023/REQ-024 gate lines that the refusal work touches.
- How this iteration addressed the focus: it read NFR-S01's `ask` invariant in the command table and in the rendered brief, read NFR-S02 against the subprocess hand-off, and checked that prompt-supplied text cannot become a command label.

## Dispatcher

Executed inline as `@deep-review` for lineage `deepseek-max-3`. No nested dispatch.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:122-150` (`TRACKED_COMMANDS` policies), `:1190-1245` (`commandOnlyMentioned` naming reads), `:469-471` (`escapePhrase`)
- `.skilled/skills/system-skill-advisor/runtime/lib/render.ts:108-118` (instruction-label guard, control-char strip, offer command set), `:163-178` (`sanitizeSkillLabel`), `:223-255` (`commandLabel`)
- `.skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts:187-265` (`parseRecommendations` field carrying, `typedCommandForRecommendation`), `:275-310` (spawn with `env: process.env`, prompt on stdin)
- `.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1490-1565` (`degradedRecommendations` typed marker)
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5265-5360` (`_RUN_REFUSED_RE`, doctor drop, gate)
- `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:138-160` (refusing-stuck doctor rows)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:303-312` (NFR-S01, NFR-S02), `tasks.md:260-262` (CHK-030 to CHK-032)

## Findings - New

### P0 Findings

None.

### P1 Findings

None new. The iteration-1 P1 (`R1-P1-001`) remains active, so this iteration's verdict stays CONDITIONAL.

### P2 Findings

None new this iteration. Two hardening surfaces were examined and ruled out below rather than raised, because neither reaches a caller that the code's stated contract allows to send the failing value.

## Traceability Checks

| Protocol | Level | Status | Evidence | Note |
|----------|-------|--------|----------|------|
| `spec_code` | core | partial | `command-attach.ts:136`, `command-attach.ts:137`, `render.ts:250`, `subprocess.ts:283` | NFR-S01's `ask` invariant holds in the table and in the rendered offer; NFR-S02's "no credential read" holds for the gate, while the subprocess inherits the environment as any child does. The REQ sweep continues in iteration 3. |

## Integration Evidence

- Command table: `/deep:research` and `/deep:review` both carry `policy: 'ask'` `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:136]`, `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:137]`.
- Brief renderer: the three-option offer is printed only for an `ask` row that is not typed `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:250]`.
- Subprocess hand-off: the prompt is written to the child's stdin, and the child is spawned without a shell `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts:306]`.
- Fallback gate: a refused run or a no-edit request drops the doctor row before it is served `[SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5333]`.

## Edge Cases

- **Inherited environment.** The advisor subprocess receives `process.env`, so any credential exported in the parent environment is visible to the child. Treated as ordinary parent/child inheritance, not as the gate reading a credential; NFR-S02 speaks about what the advisor reads and writes, and the gate reads only the prompt.
- **A very long refusal lead.** A refusal lead farther than 400 characters before the loop name is dropped by design; the command is then offered. Recorded as intended prior behaviour, not a finding.
- **A command string from a degraded subprocess.** `parseRecommendations` accepts any non-empty `command`, `policy` and `ownerSkillId` string, and `degradedRecommendations` prints `entry.command` for a row the subprocess marked typed. The brief renderer sanitizes every command label (newlines, control characters and instruction-shaped labels are rejected), so the injected text cannot become a second line of the brief `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:163]`.

## Confirmed-Clean Surfaces

- Prompt text never reaches the regexes unescaped as a pattern: every pattern is built from static lists or table keys, through `escapePhrase` where a word is interpolated `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:469]`.
- The command-naming read requires a lead and a boundary on both sides of the name, and a doc path such as `/create:readme.md` does not read as a naming `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1154]`.
- The run policy never attaches to a deep command: the only deep rows are `ask` `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:71]`, `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:72]`.
- The doctor row is withheld on a run refusal in both copies: `isRunRefused` feeds the fused row `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1084]` and the Python gate drops the row `[SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5333]`.
- The offer text itself is a fixed three-option string built from the sanitized command, not from prompt text `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:251]`.

## Ruled Out

- **Prompt-as-instruction injection through the brief.** Ruled out: the gate treats the prompt only as text; nothing echoes it into the brief, and every label that does reach the brief is sanitized `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:163]`.
- **Shell injection through the prompt.** Ruled out: the prompt goes over stdin and the child is spawned with an argument array and no shell `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts:283]`.
- **A `run` policy reaching a `/deep:*` command.** Ruled out: both deep commands are `ask` in the table and the scorer row, and the renderer's offer branch requires `ask` `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:137]`.
- **A refused stuck complaint keeping the doctor row.** Ruled out in both copies, and pinned by seven Python cases `[SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py:2943]`.

## Next Focus

- Dimension: traceability
- Focus area: the REQ sweep for REQ-001 to REQ-022, then the sixth-round REQ-023 to REQ-034: map each requirement to the code predicate or the decision record that implements it, and finish `spec_code`.
- Reason: security is clean; the operator focus commits this run to the full requirement map before the checklist pass.
- Rotation status: correctness and security reviewed; traceability and maintainability remain.
- Blocked/productive carry-forward: none blocked. Productive: reading the cited line before trusting the row.
- Required evidence: `file:line` for every REQ; an explicit `notApplicable` or `partial` where a requirement rests only on a recorded observation.

Review verdict: CONDITIONAL
