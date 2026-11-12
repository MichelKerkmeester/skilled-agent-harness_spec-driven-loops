# Local test timings

Measured on 2026-11-12 from the repository root, under Node v26.13.0.

## Run conditions

- one run per suite: each runtime's declared `npm test` ran exactly once, so every row is a single observation and not a median.
- No vitest process ran before or during a timing command, and no build or other test run of this repository ran while each command ran. The only load was the desktop's usual applications (Figma and WindowServer): 18 cores, load average between 9 and 15, so the numbers describe a working desktop rather than a bare CI runner.
- Wall seconds are the `/usr/bin/time -p` `real` line. That line includes npm startup and the runtime's declared wrapper, so it measures the wait an operator feels.
- Exit 0 is pass. Any other status is fail, and a failing row is not used as a baseline.

## Timings

| Runtime | Command | Wall seconds | Exit |
|---------|---------|--------------|------|
| .skilled/skills/system-spec-kit/runtime | npm test | 913.63 | 0 |
| .skilled/skills/system-skill-advisor/runtime | npm test | 210.52 | 0 |
| .skilled/skills/system-deep-loop/runtime | npm test | 527.21 | 0 |
