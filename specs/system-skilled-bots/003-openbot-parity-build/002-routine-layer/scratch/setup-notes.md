# Setup notes

Recorded before any edit of the routine layer, on the worktree cut from `system-skilled-bots` at `85426e6ce0a`.

## Switch and trigger call sites

`rg -n 'readSwitch|SWITCH_KINDS' .skilled/skills/system-skilled-bots/runtime/lib/runner.ts .skilled/skills/system-skilled-bots/runtime/lib/installer.ts | wc -l` printed 6:

```text
runner.ts:89:import { readSwitch } from './switches.js';
runner.ts:849:  if (readSwitch(context.stateRoot, context.identity, input.botId, 'disabled') !== null) {
runner.ts:955:    if (readSwitch(context.stateRoot, context.identity, input.botId, 'paused') !== null) {
installer.ts:71:import { readSwitch } from './switches.js';
installer.ts:556:      readSwitch(stateRoot, identity.value.identity, input.botId, 'disabled');
installer.ts:557:      readSwitch(stateRoot, identity.value.identity, input.botId, 'paused');
```

The runner reads `disabled` before the lease and `paused` after it. The installer preflight reads both to prove the switch folder is readable. The `trigger` field is produced only by `definition.ts` and read by the installer, slot accounting, the request queue and the runner.

## Baseline suite

`(cd .skilled/skills/system-skilled-bots/runtime && npm test)` printed `Test Files  37 passed (37)` and `Tests  424 passed (424)` and exited 0. `npm run typecheck` exited 0 with no error.

## Measured fixture

`node .skilled/skills/system-skilled-bots/scripts/bot-check.cjs specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/scratch/measured` exited 0 on the pre-edit tree, printing `PASS: schedule: bots/every-five/BOT.md: "*/5 * * * *" translates to 12 calendar dictionaries`. Once the floor lands the same command exits 1, which is the change this phase makes.

## Period helper

`rg -n 'export function schedulePeriodSeconds' .skilled/skills/system-skilled-bots/runtime/lib/slot-accounting.ts` printed `102:export function schedulePeriodSeconds(translation: Translation, around: Date): number | null {`.
