# Iteration 11: Hook fallback status and cleanup observability

## Focus

Inspect the active Codex and Devin hook JSON registrations against the renamed
runtime paths and their fallback shell expressions. The goal was to detect
registrations that can look healthy after a dropped or unavailable hook, not to
recount the already-reported mirror symlink inventory. This was source-only
research.

## Findings

1. **LUNA-044 — Codex and Devin runtime-hook registrations convert missing adapter failures into successful shell commands. P1. CONFIRMED shell semantics; host-level false-green impact is INFERRED.** The Codex `SessionStart`, `UserPromptSubmit`, and `Stop` registrations run compiled `system-spec-kit/runtime/dist/hooks/...` adapters followed by `|| printf` of a warning envelope. The Devin `SessionStart` and `Stop` registrations use the same `node ... || printf` shape. In POSIX shell, if the `node` process cannot resolve a renamed/dropped adapter or exits nonzero, the `printf` branch runs and becomes the command's final status, normally zero. The warning text is only additional context; it is not a nonzero health result. Thus the confirmed registration contract masks adapter failure at the shell boundary, while the inference is that the host treats the hook as successful and continues without the lifecycle/prompt/stop behavior. Smallest fix: keep an explicit fail-open user message if desired, but return a machine-detectable nonzero status or emit a structured failure signal that the hook host and install/check tooling reject; keep the build path in the current `runtime` package. [SOURCE: .codex/hooks.json:3-9,43-59,122-132] [SOURCE: .devin/hooks.v1.json:2-9,137-149]

2. **LUNA-045 — Codex Stop cleanup has an unreachable diagnostic fallback and therefore hides cleanup failure. P2. CONFIRMED shell semantics.** The Codex Stop registration runs `.opencode/scripts/session-cleanup.sh >/dev/null 2>&1 || true || printf ...`. Because `true` always succeeds after any cleanup failure, the second `|| printf` branch can never execute; the hook command always exits zero and emits no warning. Claude's corresponding SessionEnd registration also explicitly suppresses cleanup failure with `|| true`, while Devin invokes cleanup without a diagnostic fallback. This is a live lifecycle observability gap: a dropped or broken cleanup path can survive registration checks as a successful event, leaving stale session state undetected. Smallest fix: use one intentional best-effort wrapper that logs/returns a structured warning, or preserve failure status when cleanup is part of the health contract; do not chain a diagnostic branch after unconditional `true`. [SOURCE: .codex/hooks.json:122-142] [SOURCE: .claude/settings.json:157-164] [SOURCE: .devin/hooks.v1.json:168-177]

## Ruled Out

- The source hook tree contains the expected Claude, Codex, Cursor, Devin, and Pi source adapters, and runtime `tsconfig.json` includes lifecycle `hooks/**/*.ts` while intentionally excluding `hooks/pi/**`. The Pi source boundary is documented as a separate extension model, so it was not treated as a dropped system-spec-kit registration. [SOURCE: .opencode/skills/system-spec-kit/runtime/tsconfig.json:34-65] [SOURCE: .opencode/skills/system-spec-kit/runtime/hooks/README.md:15-25,55-65]
- The direct `.mjs` spec-gate registrations were not classified as false-green here; this iteration is limited to the explicit shell fallback/status expressions around lifecycle and cleanup adapters. [SOURCE: .codex/hooks.json:43-59] [SOURCE: .devin/hooks.v1.json:52-80]

## Dead Ends

- No new dangling mirror link was promoted: the four mirror inventories were already measured in iteration 3, and the current source-side link scan produced no missing link target.

## Edge Cases

- A fail-open lifecycle hook may be intentional so a broken context injector cannot block a turn. That does not justify reporting zero/normal status as “resolved”; the fix can retain fail-open execution while exposing machine-readable drift.
- The compiled `dist` target existence was not inspected in this iteration because the research budget excludes reading `dist`; the finding is about the registered fallback contract, not a claim that the current compiled files are absent.

## Questions Remaining

- Q2 gains confirmed fallback/status masking in active lifecycle registrations, beyond the earlier mirror-count drift.
- Q7 gains a hook-level false-green path for missing or failing runtime adapters and cleanup.
- Q1/Q3-Q6 remain open for package dependency edges, test weakness, docs parity, successor coverage, and validator/continuity gates.

## Sources Consulted

- [SOURCE: .codex/hooks.json:3-9,43-59,122-142]
- [SOURCE: .devin/hooks.v1.json:2-9,137-177]
- [SOURCE: .claude/settings.json:157-164]
- [SOURCE: .opencode/skills/system-spec-kit/runtime/tsconfig.json:34-65]
- [SOURCE: .opencode/skills/system-spec-kit/runtime/hooks/README.md:15-25,55-65]
- [SOURCE: .opencode/skills/system-spec-kit/runtime/hooks/codex/README.md:16-34]

## Assessment

- New information ratio: 0.72
- Questions addressed: Q2, Q7
- Questions answered: Q2 = expanded (active fallback contracts confirmed); Q7 = expanded (shell-level false-green path confirmed)
- Confidence: high for shell status and registration text; medium for the host's treatment of the returned status

## Reflection

- What worked and why: numbering the JSON commands exposed the difference between a warning envelope and a process failure, and showed the unreachable `|| printf` branch after `true`.
- What did not work and why: build-output availability was intentionally not tested because `dist` is outside the allowed reading budget.
- What I would do differently: next map remaining manifest dependencies to actual source importers and look for package edges that still assume the retired memory lane.

## Recommended Next Focus

Angle 3: reconcile the shared/scripts/runtime manifests with source imports and build scripts, focusing on sqlite-vec, better-sqlite3, legacy-lane, and any dependency declared solely for the retired memory database.

