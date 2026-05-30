# Lane C — skill-benchmark operator guide

Lane C benchmarks whether a *skill* is well-routed, discoverable, efficient, and useful **in practice** — distinct from `sk-doc`/`validate.sh` (doc shape) and manual testing playbooks (described behavior). It emits a ranked, remediable Skill Benchmark Report.

## Invocation

```bash
# Mode A (router-replay, deterministic — the CI gate). Run on a skill that has an
# INTENT_SIGNALS + RESOURCE_MAP smart router in its SKILL.md.
node .opencode/skills/deep-improvement/scripts/shared/loop-host.cjs \
  --mode=skill-benchmark \
  --skill=<skill-id-or-root> \
  --outputs-dir=<path> \
  [--fixtures-dir=<path>] [--trace-mode=router]
```

Command surface: `/deep:start-skill-benchmark-loop` (see `commands/deep/start-skill-benchmark-loop.md`).

## What runs (Mode A)

1. **D5 connectivity** (static, hard gate) — runs first; dead routed paths, dead intent keys, path escapes, orphan refs, unparseable router. Any P0 caps the verdict to `BLOCKED-BY-STRUCTURE`.
2. **Fixtures** — public/private pairs under `assets/skill-benchmark/fixtures/<skill-id>/` (`<id>.public.json` + `<id>.private.json`).
3. **Per scenario** — contamination-lint the public prompt (a leak is a fixture failure), then router-replay, then join with private gold to score.
4. **Report** — `skill-benchmark-report.json` + `skill-benchmark-report.md` (rendered FROM the JSON, anti-drift).

## Dimensions

| Dim | What | Mode A |
| --- | ---- | ------ |
| D1-intra | in-skill router selects expected intents/resources | scored |
| D2 | unprompted discovery (router-replay recall proxy) | scored |
| D3 | efficiency (over-routing proxy) | scored |
| D5 | structural connectivity | scored (hard gate) |
| D1-inter | advisor selects the right skill | unscored (needs live/advisor) |
| D4 | usefulness via skill-on/off ablation | unscored (needs live mode) |

D1-inter + D4 are deferred to live mode (Mode B) — see the 002 implementation playbook. Mode A is honest about its coverage: the aggregate normalizes over the dimensions actually measured.

## Verdict bands (provisional — calibrate on 2-3 pilots)

`PASS` ≥80 & no gate · `CONDITIONAL` 50–79 · `FAIL` <50 · `BLOCKED-BY-STRUCTURE` on any D5 P0.

## Target eligibility

Mode A needs a parseable `INTENT_SIGNALS` + `RESOURCE_MAP` router (e.g. the `cli-*` skills). Skills without that pattern report `router_unparseable` and gate — that is a real signal that the skill is not smart-router-routable, not a harness bug. A skill that routes via a different mechanism is a candidate for live-mode (Mode B) measurement once built.
