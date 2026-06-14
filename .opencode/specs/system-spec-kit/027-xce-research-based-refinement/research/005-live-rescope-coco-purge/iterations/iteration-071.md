# Iteration 071 — 001 NEEDS-RESCOPE (003 only): mostly INFO already, residual warn wording; 002/004 as-is; 028 folded

**Executor:** cli-opencode `openai/gpt-5.5-fast` --variant xhigh (read-only). **Status:** complete. **newInfoRatio:** 0.55. **Findings:** 5.
**Raw analysis:** `research/prompts/iteration-071.out`

### FINDINGS
[F-071-01] 003 is no longer primarily planned as `warn`: current scope says advisory `INFO`, registry change `severity: info`, and warns that WARNING blocks under `--strict`. Residual wording still says “warn/warning” in AC/SC text, so cleanup is still needed. Sources: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-research-and-doctrine/001-peck-teachings-adoption/003-current-state-discipline/spec.md:85`, `:95`, `:111`, `:125`, `:131`, `:140`.

[F-071-02] Validator supports `INFO` today: registry has `LEVEL_DECLARED` with `"severity": "info"`, and validation docs define INFO as exit 0 / strict-mode 0. Sources: `.opencode/skills/system-spec-kit/scripts/lib/validator-registry.json:27`, `:30`; `.opencode/skills/system-spec-kit/references/validation/validation_rules.md:29`, `:33`, `:46`.

[F-071-03] 002 needs no audit rescope: it remains T3 self-check templates only, explicitly no validation logic / no T1 AC-coverage work, with HTML-comment guidance selected to avoid template-header drift. Sources: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-research-and-doctrine/001-peck-teachings-adoption/002-self-check-templates/spec.md:63`, `:94`, `:96`, `:102`.

[F-071-04] 004 needs no audit rescope: it remains T2 read-only constitutional-rule review, with no auto-expiry/decay/deletion and standalone diagnostic host resolved. Sources: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-research-and-doctrine/001-peck-teachings-adoption/004-constitutional-rule-review/spec.md:62`, `:92`, `:97`, `:157`.

[F-071-05] 028 is folded into 027/001, not a live duplicate: parent 001 says phases 002-004 implement the peck work, decisions are folded into child specs, and live glob checks found no `.opencode/specs/system-spec-kit/028*` or `specs/system-spec-kit/028*`. Sources: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-research-and-doctrine/001-peck-teachings-adoption/spec.md:64`, `:103`, `:105`, `:131`.

### RESCOPE_001
- 001-peck-teachings-for-spec-kit: KEEP-AS-IS.
- 002-self-check-templates: KEEP-AS-IS.
- 003-current-state-discipline: REFINE warn→INFO; implementation feasible now because validator has INFO, but residual warning wording remains.
- 004-constitutional-rule-review: KEEP-AS-IS.

### VERDICT
001 = NEEDS-RESCOPE (003 only): align remaining warning language to INFO; no validator capability blocker.

### RULED_OUT
- Separate live 028 peck packet duplication.
- 002 expansion into validation logic or T1 coverage gate.
- 004 mutation/auto-expiry scope.

### METRICS
newInfoRatio: 0.55  
novelty: Found 003 already mostly INFO-rescoped, but with residual warning text plus obsolete parent fallback language.  
status: complete  
sources: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-research-and-doctrine/001-peck-teachings-adoption/003-current-state-discipline/spec.md:85`, `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-research-and-doctrine/001-peck-teachings-adoption/003-current-state-discipline/spec.md:95`, `.opencode/skills/system-spec-kit/scripts/lib/validator-registry.json:30`, `.opencode/skills/system-spec-kit/references/validation/validation_rules.md:33`, `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-research-and-doctrine/001-peck-teachings-adoption/002-self-check-templates/spec.md:63`, `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-research-and-doctrine/001-peck-teachings-adoption/004-constitutional-rule-review/spec.md:62`, `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-research-and-doctrine/001-peck-teachings-adoption/spec.md:131`
