## Multi-AI Council Report: Active Codex Reference Cleanup

### Task Classification
- **Type**: Refactoring / deprecation cleanup plan
- **Council Seats Dispatched**: 3: Analytical / native OpenCode-gpt-5.5, Critical / native review lens, Pragmatic / native explore lens
- **Dispatch Mode**: Parallel Depth 0
- **Vantage Integrity**: Native agent dispatch only; no external CLI or external AI system participation claimed.

### Council Composition

| Seat | Strategy Lens | AI Vantage Target | Distinct Mandate | Confidence |
| --- | --- | --- | --- | --- |
| Seat 001 | Analytical | native OpenCode-gpt-5.5 | Exact scope boundaries and dependency order | 86 |
| Seat 002 | Critical | native review lens | False positives and runtime hook failure modes | 88 |
| Seat 003 | Pragmatic | native explore lens | Smallest safe edit and verification sequence | 84 |

### Strategy Comparison

| Dimension | Weight | Seat 001 | Seat 002 | Seat 003 |
| --- | --- | --- | --- | --- |
| Correctness | 30% | 26 | 27 | 25 |
| Completeness | 20% | 18 | 18 | 16 |
| Elegance | 15% | 12 | 12 | 15 |
| Robustness | 20% | 17 | 20 | 15 |
| Integration | 15% | 13 | 13 | 14 |
| Pre-Critique Total | 100% | 86 | 90 | 85 |
| Post-Critique Adjustment | +/-10 | +1 | -1 | 0 |
| Final Total | 100% | 87 | 89 | 85 |

### Deliberation Notes
- **Round 1 Independent Findings**: Analytical proposed dependency-ordered active-surface cleanup; Critical required classification-first safeguards; Pragmatic recommended using the existing Level 3 packet as a follow-up.
- **Round 2 Cross-Critique**: The leading risk is confusing generic `codex` strings with live Codex CLI hook support. The leading implementation risk is deleting hook files while leaving doctor/create/deep assets or pre-commit checks pointing at them.
- **Round 3 Reconciliation**: Converged on active-scope zero Codex support claims/behavior, with explicit preservation only for archives/changelogs/specs/fixtures that are not runtime inputs.

### Winning Strategy
- **Leader**: Seat 002, Score: 89/100
- **Key Strength**: Best protection against false positives and runtime breakage.
- **Complementary Elements**: Adopt Seat 001's ordered producer-to-documentation cleanup and Seat 003's recommendation to reuse the existing packet.

### Recommended Plan
Use the existing packet `.opencode/specs/skilled-agent-orchestration/122-cli-codex-deprecation`. No new top-level spec is needed. Because the packet currently records completion for exact `cli-codex` retirement, the implementation should add a follow-up task/evidence update in the same packet rather than split context into a new phase folder.

**Scope boundary:**
- In scope: `README.md`, `.opencode/hooks/**`, `.opencode/commands/**`, and active `.opencode/skills/**` content that advertises, generates, installs, debugs, imports, or executes Codex/Codex CLI support.
- Preserve by default: `.opencode/specs/**`, `specs/**`, `.opencode/skills/z_archive/**`, changelogs, prior run logs, and intentional fixtures unless an active runtime path imports or executes them.
- Success target: active-scope greps show no current Codex CLI hook/support path; any remaining `codex` hits are archive/fixture/history exceptions documented by the implementation.

**Remove/delete:**
- Active Codex hook trees: `.opencode/skills/system-spec-kit/mcp_server/hooks/codex/**` and `.opencode/skills/system-skill-advisor/hooks/codex/**`.
- Codex-specific hook policy modules/tests/docs if caller checks show they exist only for deleted hook paths, including `.opencode/skills/system-spec-kit/mcp_server/lib/codex-hook-policy.ts` and `.opencode/skills/system-code-graph/mcp_server/lib/shared/codex-hook-policy.ts`.
- `.codex` mirror/parity enforcement in `.opencode/hooks/pre-commit`.
- Active command route/assets/scripts that list `.codex/config.toml`, `.codex/agents`, `codex exec`, `if_cli_codex`, or Codex as a valid project runtime/executor.

**Retarget:**
- README support claims from OpenCode/Codex/Claude wording to OpenCode plugins + Claude Code hooks.
- Startup/hook documentation from Claude+Codex native hooks to Claude Code hooks + OpenCode plugin bridge.
- Doctor/create/deep command prose to supported surfaces only; retarget to OpenCode plugin or Claude Code hook only where behavior is truly equivalent. Otherwise remove the Codex branch.
- Skill docs that currently present Codex as a current supported caller/runtime should become OpenCode/Claude-only or be removed.

**Do not blindly retarget:**
- Third-party product references, benchmark labels, design fingerprint fixture labels, historical manual-test cases, and archived retired package docs. Classify them; preserve only if not active support claims and not in the user's active current-support surface.

### Implementation Steps
1. **Inventory active references**: run active-scope grep over README/hooks/commands/skills with archive/changelog/node_modules exclusions and separately list hook directories/files named `*codex*`. (Source: Seat 001 + Seat 002)
2. **Remove runtime producers and registrations**: delete Codex hook directories, remove imports/callers, remove pre-commit `.codex` mirror checks, and remove command branches that generate/install/debug Codex surfaces. (Source: Seat 001)
3. **Retarget user-facing docs/assets**: update README, command presentations/YAML, and active skill docs to state only OpenCode plugins and Claude Code hooks are supported. (Source: Seat 003)
4. **Handle residue by classification**: preserve archive/changelog/spec/fixture hits only with an explicit documented allowlist; otherwise remove active Codex claims. (Source: Seat 002)
5. **Validate**: run targeted greps, hook shell checks, relevant TypeScript/Vitest tests for touched hook/advisor/spec-kit packages, and strict spec validation for the existing packet. (Source: Seat 001 + Seat 003)

### Prerequisites
- Read target files before editing.
- Confirm imports/callers before deleting policy modules.
- Keep implementation changes outside the council agent; this council only wrote `ai-council/**` artifacts.

### Plan Confidence
- **Overall**: 87%
- **Strategy Agreement**: Strong: all seats converged on active-scope cleanup plus archive/fixture safeguards.
- **Consensus Quality**: Strong, with one caveat: exact delete-vs-retarget decisions for policy modules require caller reads.
- **Risk Level**: Medium due to hook/runtime behavior and noisy generic `codex` matches.

### Dropped Alternatives
- **Seat 001 rejected broad repo-wide deletion** (Score: 87/100): too likely to corrupt historical and fixture material.
- **Seat 002 rejected string-only replacement with Claude/OpenCode** (Score: 89/100): could create false support claims where no equivalent exists.
- **Seat 003 rejected a new deprecation packet** (Score: 85/100): would fragment the active retirement context.

### Risks & Mitigations
- Dangling references after hook deletion → remove callers/routes first or in the same commit; run path greps for deleted hook directories.
- Generic `codex` false positives → classify and document archive/fixture exceptions instead of blind deletion.
- Archived retired package policy confusion → keep `z_archive/cli-codex-retired` unless active code references it; exclude it from active support sweeps.
- Hook runtime behavior regression → verify Claude Code hook and OpenCode plugin paths still cover startup/advisor behavior.
- README/command contradiction → final grep both user docs and command assets before completion.

### Verification Commands

```bash
rg -n --hidden --glob '!**/.git/**' --glob '!**/node_modules/**' --glob '!**/z_archive/**' --glob '!**/archive/**' --glob '!**/changelog/**' 'Codex|codex|cli-codex|Codex CLI|\.codex|codex-hook|hooks/codex|if_cli_codex|codex exec' README.md .opencode/hooks .opencode/commands .opencode/skills

rg --files README.md .opencode/hooks .opencode/commands .opencode/skills | rg -i 'codex|cli-codex'

rg -n 'hooks/codex|mcp_server/hooks/codex|system-skill-advisor/hooks/codex|codex-hook-policy|CODEX_|codex_hooks|\.codex/config|\.codex/agents' .opencode/hooks .opencode/commands .opencode/skills -g '!**/z_archive/**' -g '!**/node_modules/**'

bash -n .opencode/hooks/pre-commit

bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/122-cli-codex-deprecation --strict
```

If touched, also run the relevant package tests/typechecks for `.opencode/skills/system-spec-kit/mcp_server`, `.opencode/skills/system-skill-advisor/mcp_server`, and any command/hook test suites that reference deleted Codex paths.

### Planning-Only Boundary
- No implementation files were modified by the Multi-AI Council.
- This report is a recommendation for user review or handoff to an implementation agent.
