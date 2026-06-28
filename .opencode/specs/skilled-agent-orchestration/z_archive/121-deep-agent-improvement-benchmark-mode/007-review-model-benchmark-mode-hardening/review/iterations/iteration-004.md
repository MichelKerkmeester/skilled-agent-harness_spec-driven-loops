## Dimension

D2 Security (second pass) — re-examine for injection/traversal/secrets the first pass missed; scrutinize the ported grader harness dispatchReal (claude CLI exec), cache.cjs file writes, and cross-check iteration-003 findings.

## Files Reviewed

- `.opencode/skills/deep-agent-improvement/scripts/dispatch-model.cjs:118` — buildSpawnSpec argv construction
- `.opencode/skills/deep-agent-improvement/scripts/dispatch-model.cjs:173` — spawnSync dispatch
- `.opencode/skills/deep-agent-improvement/scripts/scorer/lib/cache.cjs:162` — writeAtomic temp-file pattern
- `.opencode/skills/deep-agent-improvement/scripts/scorer/lib/cache.cjs:184` — atomic rename
- `.opencode/skills/deep-agent-improvement/scripts/scorer/grader/harness.cjs:115` — dispatchReal execFileSync
- `.opencode/skills/deep-agent-improvement/scripts/scorer/grader/dispute.cjs:71` — fs monkey-patch
- `.opencode/skills/deep-agent-improvement/scripts/scorer/grader/dispute.cjs:78` — adversarialSecondCall
- `.opencode/skills/deep-agent-improvement/scripts/scorer/deterministic/bundle-gate.cjs:153` — execSync string command
- `.opencode/skills/deep-agent-improvement/scripts/scorer/score-model-variant.cjs:103` — execSync string command
- `.opencode/skills/deep-agent-improvement/scripts/scorer/grader/prompts/system-grader.md` — grader prompt
- `.opencode/skills/deep-agent-improvement/scripts/scorer/grader/prompts/system-skeptic.md` — skeptic prompt
- `.opencode/skills/sk-prompt-models/SKILL.md` — MiniMax/small-model routing

## Findings by Severity

### P0

None.

### P1

No new P1 findings. The two P1 findings from iteration 3 are confirmed UNCHANGED:

#### DR-003-P1-001 - Benchmark criteria can execute arbitrary shell commands (CONFIRMED UNCHANGED)

- File: `.opencode/skills/deep-agent-improvement/scripts/scorer/score-model-variant.cjs:103`
- Evidence: `execSync(a.command, { cwd: cwdAbs, ... })` still executes a string command without allowlisting or argv splitting.
- Evidence: `.opencode/skills/deep-agent-improvement/scripts/scorer/deterministic/bundle-gate.cjs:153` repeats the same pattern with `execSync(acceptance.command, ...)`.
- Status: UNCHANGED from iteration 3. No remediation observed.
- Downgrade trigger: downgrade to P2 only if benchmark profiles are cryptographically pinned or proven repo-owned trusted code.

#### DR-003-P1-002 - D4 grader accepts unbounded model-provided scores (CONFIRMED UNCHANGED)

- File: `.opencode/skills/deep-agent-improvement/scripts/scorer/grader/harness.cjs:63`
- Evidence: `parseGraderResponse()` still accepts any numeric score including unbounded floats via regex fallback at line 98-105.
- Evidence: The score is used directly at `.opencode/skills/deep-agent-improvement/scripts/scorer/score-model-variant.cjs:216` and cached at `.opencode/skills/deep-agent-improvement/scripts/scorer/grader/harness.cjs:222`.
- Status: UNCHANGED from iteration 3. No remediation observed.

### P2

#### DR-004-P2-001 - dispute.cjs uses global fs monkey-patch for adversarial grader call

- File: `.opencode/skills/deep-agent-improvement/scripts/scorer/grader/dispute.cjs:71`
- Evidence: `fs.readFileSync = function patched(...)` is a global function replacement that swaps `system-grader.md` for `system-skeptic.md`. The swap is contained within a try-finally (lines 77-85) that restores the original, but the patch is global and could cause subtle bugs if the code path throws before the finally executes.
- Finding class: instance-only (no evidence of exploitation; contained by try-finally)
- Recommendation: Refactor harness.cjs to accept a `systemPromptPath` parameter, eliminating the monkey-patch.
- Severity: P2 (advisory, contained)

## Traceability Checks

- `spawned_cli_arg_injection`: PASS (ruled out). `dispatchReal` uses `execFileSync` with argv array; `buildSpawnSpec` constructs args safely.
- `criteria_command_execution`: FAIL (P1 unchanged). String `execSync` in score-model-variant.cjs:103 and bundle-gate.cjs:153.
- `cwd_path_escape`: FAIL (P1 unchanged from iter 3). cwd-relative path resolution with `path.resolve(cwdAbs, rawPath)` and `startsWith` check (cwd-check.cjs:86) still allows sibling-prefix traversal.
- `unsafe_deserialization`: FAIL (P1 unchanged). Grader JSON parsing still accepts unbounded numeric scores.
- `grader_dispatch_security`: PASS. harness.cjs:119 uses `execFileSync(CLAUDE_BIN, args, ...)` with argv array — safe, no shell string.
- `cache_file_writes`: PASS. cache.cjs uses mkdtempSync + rename for atomic writes; no TOCTOU race.
- `monkey_patch_footprint`: ADVISORY. dispute.cjs global fs patch is contained but is a code smell.
- `120_skill_edit_guidance`: NOT FOUND. No skill-edit docs found in the 120 MiniMax spec tree; safe-command guidance not present as a risk surface.

## Verdict

CONDITIONAL for D2 security. The two P1 findings from iteration 3 remain unresolved (no remediation observed in the code). The grader harness dispatch path is confirmed safe (execFileSync argv-based), and cache writes are confirmed atomic. One new P2 advisory on the dispute.cjs monkey-patch pattern. The benchmark criteria command execution and unbounded grader scores remain the blocking defects.

## Next Dimension

D2 security is exhausted (P1s unchanged, P2 new advisory). Recommend proceeding to traceability in iteration 5, then maintainability.
