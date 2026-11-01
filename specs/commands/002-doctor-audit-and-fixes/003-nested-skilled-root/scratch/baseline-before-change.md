# Baseline before the change (orchestrator, 2026-11-01)

Skilled HEAD: 82e726664d. Nested fixture: Barter's coder/ (framework copy at 6f42c7b169, one folder below Barter's git root).

## Negative control, run from coder/
```text
$ node .skilled/commands/doctor/scripts/sk-skill-check.cjs check sk-code-terraform --into-hub sk-code
HUB_NOT_FOUND: No hub directory was found for "sk-code".
exit=2
$ node .skilled/commands/doctor/scripts/skill-graph-freshness.cjs
  panel error: ENOENT: no such file or directory, scandir '/Users/michelkerkmeester/MEGA/Development/Skilled/barter/ai-speckit/.skilled/skills'
exit=0
```

## Same commands from the Skilled checkout
```text
$ node .skilled/commands/doctor/scripts/sk-skill-check.cjs check sk-code-skilled --into-hub sk-code --json | head -c 200
{
  "mode": "hub",
  "skill": "sk-code-skilled",
  "hub": "sk-code",
  "hubPath": ".skilled/skills/sk-code",
  "routingClass": "metadata",
  "findingCount": 0,
  "unknownCount": 0,
  "naCount": 2,
  "
exit=0
$ node .skilled/commands/doctor/scripts/skill-graph-freshness.cjs | tail -3
  SIGNAL DRIFT compiled vs disk: none
  NULL derived timestamp: none
  (report-only — the canonical reindex is operator-gated; nothing was written)
exit=0
$ node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-code | tail -2
─────────────────────────────────────────────────────────────────
OK: parent-skill-check — all hard invariants passed, 0 warnings
exit=0
```

## Existing test suites, before the change
```text
sk-skill-check                           ℹ pass 58 ℹ fail 0 exit=0
sk-skill-convert                         ℹ pass 69 ℹ fail 0 exit=0
sk-skill-integrate                       ℹ pass 30 ℹ fail 0 exit=0
doctor-sk-skill-contract                 ℹ pass 34 ℹ fail 0 exit=0
parent-skill-check-invariants            ℹ pass 109 ℹ fail 0 exit=0
parent-skill-check-command-column        ℹ pass 1 ℹ fail 0 exit=0
parent-skill-check-leaf-manifest         ℹ pass 1 ℹ fail 0 exit=0
parent-skill-check-root-router           ℹ pass 1 ℹ fail 0 exit=0
parent-skill-check-routing-shape         ℹ pass 1 ℹ fail 0 exit=0
```

```text
system-skill-advisor/runtime: vitest run tests/doctor/skill-graph-freshness-panel.vitest.ts
Test Files  1 passed (1); Tests  19 passed (19); exit=0
```
