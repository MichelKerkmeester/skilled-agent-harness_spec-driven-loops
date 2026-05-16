# Iteration 009 - Python Support Tool Re-pass

## Dimension(s)

Cross-cutting narrow re-pass on Python support tools. Dimension coverage remains 4/4. This pass only bounded P1-014 and checked for adjacent zero-coverage singular-root scan patterns.

## Files Reviewed

- `.opencode/commands/doctor/scripts/audit_descriptions.py:10`
- `.opencode/commands/doctor/scripts/audit_descriptions.py:47`
- `.opencode/commands/doctor/scripts/audit_descriptions.py:157`
- `.opencode/commands/doctor/scripts/audit_descriptions.py:185`
- `.opencode/commands/doctor/scripts/audit_descriptions.py:220`
- `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py:42`
- `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py:56`
- `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py:67`
- `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py:78`
- `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py:298`
- `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py:3449`
- `.opencode/skills/system-spec-kit/README.md:131`

Additional commands:

- `rg --files .opencode | rg '(^|/)(audit_descriptions|skill_advisor)\.py$'`
- `rg -n --glob '*.py' "\.opencode/(skill|agent|command)(/|\b)|\.opencode/skill\b|os\.walk\(|glob\.glob\(|rglob\(|glob\(" .opencode/commands .opencode/skills/system-spec-kit -S`
- `python3 .opencode/commands/doctor/scripts/audit_descriptions.py --json`
- `python3 .opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py "deep review" --force-native`
- `find .opencode/skills -maxdepth 2 -name SKILL.md | wc -l`
- `find .opencode/commands -type f -name '*.md' | wc -l`
- `find .opencode/agents -maxdepth 1 -name '*.md' | wc -l`

## Findings by Severity

Only new or changed findings are listed here.

### P0

No new or changed P0 findings. P0-001 remains active and unchanged.

P1-014 should not escalate to P0 on this pass. The singular defaults are reachable, but the evidence still points to support-tool degradation rather than a production-blocking runtime path:

- `audit_descriptions.py` advertises plural scan surfaces in its docstring: `.opencode/skills/<name>/SKILL.md` at line 11, `.opencode/commands/**/<name>.md` at line 12, and `.opencode/agents/<name>.md` at line 13.
- The same file still imports the shared validation constants through the singular quick-validate path at line 47: `SCRIPT_DIR.parent.parent.parent / "skill" / "sk-doc" / "scripts"`.
- `walk_skills()` still scans the singular root at line 157: `base = repo / ".opencode" / "skill"`.
- `walk_commands()` still scans the singular root at line 185: `base = repo / ".opencode" / "command"`.
- The OpenCode agent surface still scans the singular mirror at line 220: `(repo / ".opencode" / "agent", "yaml")`.
- Running the audit proved the zero-coverage behavior: `counts.skills=0`, `counts.commands=0`, and `counts.agents=11`, while the plural roots contain 16 skill `SKILL.md` files, 24 command markdown files, and 11 OpenCode agent markdown files.

For `skill_advisor.py`, the patched plural path is real but only covers the local Python-side skill root:

- Line 42 derives `SKILLS_DIR` from the script location, which resolves under `.opencode/skills`.
- Lines 44-51 derive `LOCAL_CCC_BIN` through `SKILLS_DIR`, so that helper path is plural.

The retained singular native bridge defaults are also real and reachable:

- Lines 56-66 build `NATIVE_ADVISOR_STATUS` under `.opencode/skill/system-spec-kit/...`.
- Lines 67-77 build `NATIVE_ADVISOR_COMPAT` under `.opencode/skill/system-spec-kit/...`.
- Lines 78-89 build `NATIVE_GENERATION_MODULE` under `.opencode/skill/system-spec-kit/...`.
- `_native_bridge_available()` gates on those paths at lines 267-269, and `_run_native_bridge()` returns `NATIVE_DIST_MISSING` when they are absent at lines 298-309.
- The default single-prompt route tries native first at lines 3449-3456, but only exits non-zero when `--force-native` is set at lines 3466-3472.
- `.opencode/skills/system-spec-kit/README.md:131` classifies this Python script as a compatibility shim and names runtime hook briefs as the primary surface when available.

Given that default `skill_advisor.py "deep review"` can fall back to the local scorer when the native bridge is unavailable, and `--force-native` is an explicit diagnostic mode, this remains P1. It is active and required, but not a P0 under the review doctrine's blocker threshold.

### P1

No new or changed P1 findings. P1-014 remains active with the same severity and scope.

### P2

No new or changed P2 findings.

## Zero-Coverage Guard Re-pass

The Python same-family sweep did not find an additional support script that both scans a singular `.opencode/skill`, `.opencode/command`, or `.opencode/agent` root and can silently pass with zero matches.

Relevant hits were:

- `audit_descriptions.py:188` uses `base.rglob("*.md")` after assigning singular `.opencode/command`, already covered by P1-014.
- `audit_descriptions.py:230` uses `base.glob(pattern)` after assigning singular `.opencode/agent`, already covered by P1-014.
- `skill_advisor_runtime.py:156` uses `glob.glob(pattern)` but the targeted literal sweep found no singular `.opencode/skill` root in that file.
- `.enumerate-no-frontmatter.py:13` and `.scan-validate-all.py:13` use `rglob`, but neither carries the singular OpenCode root literal.

P1-013 remains isolated to `check-smart-router.sh`; no new Python zero-coverage finding lands in this iteration.

## Verdict

FAIL, `hasAdvisories=true`.

The active P0 remains. Iteration 9 found no new or changed findings, so cumulative findings remain P0=1, P1=12, P2=9, 22 total.

## Closure Recommendation

Proceed to synthesis. The loop is converged with verdict FAIL pending P0-001 remediation.

## Next Status

Synthesis: loop is converged with verdict FAIL pending P0-001 remediation.
