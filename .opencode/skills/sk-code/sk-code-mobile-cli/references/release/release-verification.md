---
title: Pi Remote Release Verification
description: Pi Remote separates reproducible checks on this machine from evidence that only a target host or physical device can provide. A green machine suite does not make a rollout stage available when operator evidence is missing.
trigger_phrases:
  - 'release verify gate'
  - 'machine status stage readiness'
  - 'numeric thresholds release'
  - 'stage readiness rollout'
  - 'threshold checker measurements'
  - 'rollout evidence matrix'
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Pi Remote Release Verification

Pi Remote separates reproducible checks on this machine from evidence that only a target host or physical device can provide. A green machine suite does not make a rollout stage available when operator evidence is missing.

---

## 1. OVERVIEW

### When to Use

- Before any rollout stage is enabled.
- When machine evidence must be distinguished from operator evidence.
- When thresholds or stage readiness must be assessed from the evidence records.

### Key Sources

- `release/thresholds.json`
- `release/rollout.json`
- `release/evidence/release-verify-v1-<timestamp>.json`
- `scripts/check-thresholds.mjs`
- `scripts/check-rollout.mjs`

---

## 2. RUN THE WHOLE GATE

Run from the Pi Remote app directory:

```bash
npm run release:verify
```

The command runs the existing typecheck, the lint gate, the format-check gate, every Vitest suite, the explicit web build, the four-workspace build, the executable rollback drill, and the numeric threshold checker. The lint and format gates run the root `eslint .` and `prettier --check .` scripts, and the runner records their exit status like any other gate.

Each run writes `release/evidence/release-verify-v1-<timestamp>.json`. The document records schema version, sanitized command output, output hash, exact command, tool versions, exit status, measured threshold results, rollback results, and rollout readiness. Its top-level `machineStatus` reports whether the executable machine gates passed. The separate `stageReadiness` summary lists ready and not-ready rollout stages, while `rollout.stages` retains the evidence details for each stage. Absolute app and home paths are replaced with placeholders.

The command exits non-zero when a runnable gate fails. Pending operator evidence does not falsify a machine failure. It keeps the dependent stage `NOT-READY`.

---

## 3. NUMERIC THRESHOLDS

`release/thresholds.json` is the authority. Every threshold is a finite number.

| Metric                             |                                            Pass condition | Evidence source                                               | Current handling |
| ---------------------------------- | --------------------------------------------------------: | ------------------------------------------------------------- | ---------------- |
| Foreground p95 relay-added latency |                                               `<= 250 ms` | Operator on target device and host                            | PENDING          |
| Visible streaming cadence          |                               `<= 500 ms` between updates | Operator on target device                                     | PENDING          |
| Queue memory                       |                                     `<= 16,777,216 bytes` | Operator under target load                                    | PENDING          |
| Replay/snapshot size               |                                      `<= 1,048,576 bytes` | Machine-generated 1,000-envelope retained snapshot            | Enforced         |
| Storage growth                     | `<= 4,194,304 bytes` for 1,001 writes with 1,000 retained | Disposable SQLite database                                    | Enforced         |
| Restart/reconnect recovery         |                                             `<= 2,000 ms` | Close, reopen, and build the retained reconnect snapshot plan | Enforced         |
| WCAG conformance                   |                             `>= 2` where A=1, AA=2, AAA=3 | Physical-device accessibility review                          | PENDING          |
| Web bundle gzip size               |                                        `<= 153,600 bytes` | Gzip sum of built HTML, CSS, and JavaScript                   | Enforced         |

Run the threshold checker alone after building:

```bash
npm run build
npm run release:thresholds
```

An optional operator measurement JSON can be supplied with `node scripts/check-thresholds.mjs --measurements <relative-file>`. Its keys must match declared metrics and each value must have the shape `{ "value": number }`. A measured key without a declaration, a missing machine measurement, or a threshold violation fails the checker. Missing operator measurements remain `PENDING`. No number is synthesized.

---

## 4. STAGE READINESS

`release/rollout.json` defines three independent evidence subsets and kill switches. `READY` means every item in that stage's subset is `PASS`. `FAIL`, `PENDING`, and `UNRUN` all produce `NOT-READY` and `available: false`. The rollout evaluator's `machineStatus` reports whether its configuration is valid. It does not assert that any stage is ready.

Run the assessment against the latest evidence:

```bash
npm run release:rollout
```

To use the checker as an enablement gate, require one stage explicitly:

```bash
node scripts/check-rollout.mjs --require-ready read-only
node scripts/check-rollout.mjs --require-ready protected-mutation
node scripts/check-rollout.mjs --require-ready optional-push
```

These commands exit non-zero while the named stage is not ready. Operator evidence is accepted only from a supplied schema-versioned file whose passing rows include an ISO verification time, reviewer, and relative artifact path. The repository intentionally contains no fabricated passing operator evidence.

When operator measurements and boundary evidence exist as app-relative JSON files, include them in a fresh whole-gate run:

```bash
npm run release:verify -- --measurements release/operator-measurements.json --operator-evidence release/operator-evidence.json
```

The measurements file uses metric keys with `{ "value": number }`. The operator evidence file uses `schemaVersion: 1` and an `evidence` object keyed by the exact `operator:*` ids in `release/rollout.json`. Each passing row must include `status: "PASS"`, an ISO `verifiedAt`, a non-empty `reviewer`, and an app-relative `artifact` path.

---

## 5. SUPPORTED MATRIX AND LIMITATIONS

| Boundary                                                                                | Machine status                           | Operator status                             | Release effect            |
| --------------------------------------------------------------------------------------- | ---------------------------------------- | ------------------------------------------- | ------------------------- |
| Typecheck, tests, web build, workspace build                                            | Verified by `release:verify`             | Not applicable                              | Required by every stage   |
| Replay size, retention/storage growth, restart recovery, bundle gzip                    | Numerically enforced                     | Not applicable                              | Required by read-only     |
| Tailscale HTTPS/WSS Serve identity, direct-backend rejection, Funnel absence            | Configuration and negative controls only | **PENDING** on target tailnet               | Blocks every stage        |
| iOS and Android install, streaming, reconnect                                           | Browser-independent components only      | **PENDING** on physical devices             | Blocks read-only          |
| Foreground p95, cadence, queue memory                                                   | Thresholds declared                      | **PENDING** under target load               | Blocks read-only          |
| VoiceOver, TalkBack, keyboard, 200% zoom/reflow, live regions                           | UI implementation only                   | **PENDING** with assistive technology       | Blocks read-only          |
| Mutation policy, authenticated authority loop, command-family drain, approval contracts | Mocked-extension integration-tested      | **PENDING** with live Pi extension mutation | Blocks protected mutation |
| macOS `sandbox-exec` escape denial and abort termination                                | Script available                         | **PENDING** on exact deployment OS          | Blocks protected mutation |
| Push subscription and content-free hint logic                                           | Component-tested                         | **PENDING** on physical iOS and Android     | Blocks optional push      |

The production relay wires approval request and lease consumption through a per-process authenticated loopback channel when mutation is explicitly enabled. Protected mutation remains not ready until an operator proves the built extension loads last in the target Pi process and actual tool execution stays inside `deploy/containment/pi-remote.sb`. Push has no live administrative toggle. Omitting all four push configuration values and restarting keeps `PushService` absent.

---

## 6. ROLLBACK EVIDENCE

`npm run rollback:drill` builds the relay and executes the drill against an app-local disposable SQLite database. The drill enables then disables the real `MutationPolicy`, verifies outstanding approval drain and in-flight abort, takes a database backup, damages the working copy, restores it, executes the latest down-migration, and confirms that the relay session row plus the consumed row marked `external-outcome-indeterminate` survive.

A separate native-session sentinel is hashed before and after database rollback to prove the drill does not cross that boundary. This is machine proof of path isolation, not a claim about a real Pi installation. The target-host local Pi smoke test remains operator-verified and pending.
