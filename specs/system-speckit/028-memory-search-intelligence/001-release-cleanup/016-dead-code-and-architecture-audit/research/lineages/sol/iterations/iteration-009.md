# Iteration 009: Adversarial dead-code verification

## Focus

Try to prove or falsify deadness for smoke scripts, guards, plugin bridges, legacy bodies, generated routers, and hidden scan artifacts using literal searches across code and documentation formats.

## Findings

No CAT-1 candidate survived the required cross-format literal checks.

## Ruled Out

- `check-no-spec-imports.cjs` is invoked by `.github/workflows/runtime-no-spec-import.yml` and imported by the compiled-routing foundation test. [SOURCE: file:.github/workflows/runtime-no-spec-import.yml:35] [SOURCE: file:.opencode/bin/compiled-routing-foundation.vitest.ts:39]
- `mk-skill-advisor-bridge.mjs` is the live OpenCode plugin subprocess bridge. [SOURCE: file:.opencode/plugins/mk-skill-advisor.js:111]
- `cli-exit-taxonomy-smoke.cjs` is a documented manual operator smoke, so absence from CI is insufficient for deletion. [SOURCE: file:.opencode/bin/README.md:226]
- Legacy deep-command bodies and numbered compiled routers are dynamically loaded. [SOURCE: file:.opencode/skills/system-deep-loop/runtime/scripts/render-command-contract.cjs:84] [SOURCE: file:.opencode/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs:65]
- `.rename-engine-disposable` is an intentional safety marker, not residue.

## Sources Consulted

- `rg -n --glob '!**/.opencode/specs/**' --glob '*.{ts,js,cjs,mjs,md,yaml,yml,json,sh,py,toml}' '<literal>' .`
- `.github/workflows/runtime-no-spec-import.yml`
- `.opencode/plugins/mk-skill-advisor.js`

## Assessment

- New information ratio: 0.35
- Confidence: high for ruled-out candidates; code graph was unavailable, so exact searches and direct reads are the authority.

## Reflection

This pass invalidated several attractive but false deletion claims. The audit should report zero proven CAT-1 files rather than inflate the count.

## Recommended Next Focus

Falsify, deduplicate, rank, and bound the remaining architecture and residue findings.
