# DeepPi

Reasonix-style DeepSeek price/performance for the Pi coding agent.

DeepPi targets the direct DeepSeek API only. It stabilizes cacheable request
prefixes, reports measured cache economics from Pi's real usage records, and
reduces paid retries with loop guards and hash-verified edits.

## Supported models

- `deepseek-v4-flash`
- `deepseek-v4-pro`

DeepPi is dormant for every other provider and model.

## Install

```bash
pi install git:github.com/christopherarter/deep-pi
```

Reload Pi, select a supported direct DeepSeek model, and run `/deeppi`.

## What `/deeppi` measures

- cache-read and uncached input tokens;
- cache-hit rate;
- actual input cost from Pi;
- estimated savings against fully uncached input;
- detected local prefix churn;
- guarded retry loops and hashline edit outcomes.

DeepPi does not promise a fixed hit rate. Provider cache expiry and backend
state can produce misses even when the local request prefix is stable.

## Development

```bash
npm install --ignore-scripts
npm run verify
```

Default verification never calls an external API. The paid smoke benchmark is
explicitly opt-in:

```bash
DEEPPI_LIVE=1 npm run benchmark:live
```

## Attribution

DeepPi is derived from
[`jrimmer/pi-deepseek-optimized`](https://github.com/jrimmer/pi-deepseek-optimized)
and is licensed under the Apache License 2.0. The original project implements
techniques described by Howard Chen and Can Akay; their credits are retained.

DeepPi's additions are its exact direct-V4 boundary, measured Pi cache/cost
telemetry, prefix-churn diagnostics, batch-aware retry guards, atomic hashline
edits, removal of destructive rewind behavior, and tests against current Pi
event shapes.

## Fork

The copy of `deep-pi` in this repository was vendored from `christopherarter/deep-pi` at commit `0f1cbd8124b4fb35df97f85aa943d730f4aae549`. It has since diverged through local patches documented in [CHANGES-FROM-UPSTREAM.md](./CHANGES-FROM-UPSTREAM.md). The vendored copy at `.pi/extensions/deep-pi/` is the version Pi runs in this repository. The README command `pi install git:github.com/christopherarter/deep-pi` installs the original, unmodified upstream and does not include these local changes.
