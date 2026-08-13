# Iteration 016 — Plan-mode boundary

## Focus

Can a Reasonix-style plan mode be added without claiming it is native Pi?

## Evidence

- Pi explicitly says plan mode is not built into its core. [SOURCE: https://pi.dev/docs/latest/usage] Its extension API supports custom commands and tools. [SOURCE: https://pi.dev/docs/latest/extensions]

## Assessment

A plugin can implement a planning convention and command workflow, but it should be described as extension behavior, not Pi-native plan mode.

## New Signal

Converted a categorical missing-feature claim into a scoped extension design. The preliminary convergence score is 0.09; it is telemetry only, so the loop continues to a distinct research angle.

Research iteration complete; stop policy remains `max-iterations`.
