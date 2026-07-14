# Iteration 3: Opus Governor, Thermostat, and Measurement

## Focus
Extract portable mechanisms and metrics from `external/opus-fable-mode-main/`.

## Actions Taken
- Read `opus-fable-mode-main/README.md`.
- Read `governor-block.md`, `fable-mode.md`, `reinject.sh`, `settings-hook-snippet.json`, and `leak_test.py`.
- Classified source artifacts as doctrine, mechanism, measurement, or model-specific.

## Findings
1. **The source's strongest architecture is setpoint, thermostat, measurement.** The README maps `governor-block.md` to setpoint, `reinject.sh` to thermostat, and `leak_test.py` to measurement. [SOURCE: .opencode/specs/skilled-agent-orchestration/z_archive/114-operate-like-fable-5/external/opus-fable-mode-main/README.md:47]

2. **The behavioral governor is not generic evidence doctrine; it is recursion and armor control.** It tells the model to reason about the problem/person rather than itself, cap self-audit recursion at 1, hedge minimally, commit reversible decisions, and prioritize outcome over visible process. [SOURCE: .opencode/specs/skilled-agent-orchestration/z_archive/114-operate-like-fable-5/external/opus-fable-mode-main/governor-block.md:4]

3. **The re-injection hook is the persistence mechanism.** `reinject.sh` restates the governor on every `UserPromptSubmit` because the CLAUDE.md setpoint decays as context grows, and it explicitly says subagents need separate injection. [SOURCE: .opencode/specs/skilled-agent-orchestration/z_archive/114-operate-like-fable-5/external/opus-fable-mode-main/reinject.sh:4] [SOURCE: .opencode/specs/skilled-agent-orchestration/z_archive/114-operate-like-fable-5/external/opus-fable-mode-main/reinject.sh:8]

4. **The hook install shape is directly analogous to existing Public hooks.** The source uses a `UserPromptSubmit` hook command with timeout 5. Public already has prompt-time hook surfaces with fail-open behavior and runtime-specific transport. [SOURCE: .opencode/specs/skilled-agent-orchestration/z_archive/114-operate-like-fable-5/external/opus-fable-mode-main/install/settings-hook-snippet.json:4] [SOURCE: .opencode/skills/system-spec-kit/references/config/hook_system.md:59]

5. **The measurement harness is concrete and portable.** `leak_test.py` measures median words/message, tool:text ratio, unsolicited caveat percentage, and self-opener percentage; these metrics are exactly the behavior the governor claims to move. [SOURCE: .opencode/specs/skilled-agent-orchestration/z_archive/114-operate-like-fable-5/external/opus-fable-mode-main/leak_test.py:13]

6. **Capability limits are explicit.** The README says prompts can steer working style but cannot change the capability ceiling. Recommendations must claim efficiency/signature movement only, not capability equivalence. [SOURCE: .opencode/specs/skilled-agent-orchestration/z_archive/114-operate-like-fable-5/external/opus-fable-mode-main/README.md:7]

## Questions Answered
- Which opus-fable-mode mechanisms are portable?
- Which metrics can verify behavioral movement?

## Questions Remaining
- Which Public surfaces should own governor injection and measurement?
- How should ranked recommendations be tiered?

## Assessment
- newInfoRatio: 0.61.
- Novelty justification: the setpoint/thermostat/measurement architecture is a clearer implementation strategy than the round-1 doctrine distribution.
- Confidence: high that hook re-injection is the key mechanism; medium on exact hook integration point until surface map pass.

## Reflection
What worked: separating capability claims from behavioral efficiency claims.

What failed or was ruled out: prompt-only "capability recovery" claims. The source rejects them.

## Recommended Next Focus
Map current Public surfaces and identify where setpoint, thermostat, and measurement should land.
