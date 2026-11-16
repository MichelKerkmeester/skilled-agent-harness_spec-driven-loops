# Is parity with the legacy replay still a gate?

No. Checked on 2026-11-16 in this checkout.

| Check | Command | Result |
|-------|---------|--------|
| The replay script still exists | `git log --oneline --diff-filter=D -1 -- '.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs'` | `b45ea54cea3 feat(deep-loop)!: retire the skill-benchmark lane`. The file was deleted |
| The hub's parity harness runs | `node specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/001-sk-code/harness/validate-canary.cjs` | Exit 1. `ENOENT ... deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs`. It pins the digests of the deleted lane's scripts |
| CI runs that harness | `git grep -n "validate-canary" -- .github .skilled ':!*.md'` | No match |
| The engine says so | `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs` line 30 | "verified compiled-serving by the legacy-parity harness before it was retired" |
| Advisor parity data holds sk-code compiled targets | `grep -rln "sk-code-frontend\|sk-code-review\|sk-code-skilled\|sk-code-ci\b" tests/parity tests/routing-parity-* scripts/routing-accuracy` in the advisor runtime | No match, exit 1 |

What CI does enforce on compiled routing, in `.github/workflows/routing-registry-drift.yml`:

- `node .skilled/bin/compiled-route-guard.cjs` blocks.
- `node .skilled/bin/compiled-route-admission.cjs --all --warn-only` reports sk-code and never fails. Only `system-deep-loop` blocks. Its check reads a missing mode as drift and ignores an added one.
- `/doctor:sk-code` also runs `compiled-route-sync.cjs --check`, which fails when a served copy under `.skilled/bin/lib/compiled-routing/` differs from its authored twin under `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/`.

One side effect a score change would have: `router-replay-lib.cjs` in `sk-code-skilled/assets/scripts/` keeps its own scorer for leg 4 of `verify-router-sync.cjs`. A changed compiled score would differ from it and nothing would fail.

`compiled/policy.json` and `compiled/route-gold.typed.json` under the authored hub folder were already stale at HEAD. A fresh build of each differs from the committed bytes, and no check reads them.
