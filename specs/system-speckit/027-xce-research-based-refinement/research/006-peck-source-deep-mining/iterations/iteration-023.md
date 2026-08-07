# Iteration 023 — Re-rank everything through the UX + automation lens

**Focus:** score every change on friction/automation/value → ship-rank; reshape/defer; net-new UX+auto opportunities.
**Executor:** cli-opencode `openai/gpt-5.5-fast` --variant high (read-only; orchestrator-written). **Status:** complete. **newInfoRatio:** 0.72.

## Ship-rank scorecard (full detail in `prompts/iteration-023.out`)
1. **T6 completion-freshness** (low friction / full auto / high value) — invisible automation, biggest gap.
2. **010 reviewer test-bench** (med / full / high) — automates regression safety for 009+011.
3. **T7 anti-softening** (low / semi / high).
4. **011 deep-review verdict binding** (low / full / high) — `/speckit:complete` already surfaces a verification summary.
5. **AC_COVERAGE warning** (med / semi / high). 6. **AC-format norm** (med / semi / high). 7. **AC traceability table** (med / semi / high). 8. **T5 escalation** (med / semi / med). 9. **T12 cap+recurrence** (low / semi / med). 10. **T13 resume manifest** (low / full / med). 11. **T14 narrative** (med / semi / med). 12. **T8 read-budget** (med / manual / med).
- **Defer:** 011 ERROR promotion (high friction — warn-window first), T9 numeric note (docs-only), T11 cheap-model preset (opt-in after 010), T12(c) prune lifecycle (governance risk).

## Net-new UX/automation opportunities (NOT in the proposal — add them)
1. **Validation auto-fix hints** — `fix:` lines in validator failures + JSON so `/speckit:complete` shows "run this / edit this" (`validate.sh:767,930`).
2. **Startup/brief freshness + AC indicator** — surface `completion-freshness: stale|fresh` + `AC coverage: n/m` in the startup/advisor brief, fail-open (`hooks/README.md:18`, `skill_advisor_hook.md:81`).
3. **Auto-generate AC stubs** from the `Requirement | Acceptance Criteria` table instead of blank authoring (`spec.md.tmpl:445`, `speckit_complete_auto.yaml:638`).
4. **One-command "refresh completion fingerprint"** helper (`checklist.md.tmpl:21`, `validate.sh:828`).
5. **Single deep-review verdict in `/speckit:complete`** Step-12 summary (`reviewVerdict: PASS|CONDITIONAL|FAIL|PENDING`).
6. **Checklist evidence quick-fill** — emit candidate evidence slots from changed files + test output.

## Verdict contribution
Re-frames the rollout **automation-first / UX-first**: ship the invisible-automation wins (freshness, deep-review-verdict surfacing, validator auto-fix hints, AC-stub generation) before any user-facing blocker. These 6 opportunities become first-class UX/automation requirements in the scaffolded packets (esp. 009 + 011).
