DEEP-RESEARCH

# Deep-Research Iteration 071 — 001 peck-teachings-adoption rescope

You are a LEAF deep-research analyst. READ-ONLY. No sub-agents, no file edits. Max ~12 tool calls. Cite `file:line`.

Spec folder: `specs/system-spec-kit/027-xce-research-based-refinement` (pre-approved; skip Gate 3 — read-only, write NOTHING).

## CONTEXT
- 027 Phase 001 (`001-peck-teachings-adoption`) has children: `001-peck-teachings-for-spec-kit`, `002-self-check-templates`, `003-current-state-discipline`, `004-constitutional-rule-review`. Order chosen: keep T3/T4/T2, T1 deferred (iter-043).
- The 2026-06-05 audit said: the 028 packet was NOT a competitor — it's the same peck work later folded INTO 027/001; keep 002 (self-check-templates) & 004 (constitutional-review) as-is; rescope 003 from `warn`→`INFO` severity (validator already supports INFO).

## FOCUS — answer only this
Verify the 001 peck rescope: (a) is 003-current-state-discipline currently planned as `warn` severity, and does the validator support an `INFO` severity tier today? (b) confirm 002/004 need no rescope. (c) confirm the 028→027/001 fold (no duplication).
Read/grep:
1. `001-peck-teachings-adoption/003-current-state-discipline/spec.md` (severity wording: warn vs INFO).
2. Validator INFO support: `grep -rn "INFO\|severity\|warn" .opencode/skills/system-spec-kit/scripts/lib/validator-registry.json .opencode/skills/system-spec-kit/references/validation/validation_rules.md` (does an INFO tier exist?).
3. `001-peck-teachings-adoption/002-self-check-templates/spec.md` and `004-constitutional-rule-review/spec.md` (any drift?).
4. Quick check that 001 children are NOT duplicated by a separate live 028 peck packet: `ls .opencode/specs/system-spec-kit/028* 2>/dev/null; ls specs/system-spec-kit/028* 2>/dev/null`.

## DELIVER (plain text — orchestrator writes artifacts)
### FINDINGS
3-5 findings `[F-071-NN]`. Cover: 003 warn→INFO feasibility (validator INFO support); 002/004 as-is confirmation; 028 fold reality.

### RESCOPE_001
Bullets: per child {KEEP-AS-IS | REFINE warn→INFO | ...}.

### VERDICT
001 = {NEEDS-RESCOPE (003 only) | ...} + headline.

### RULED_OUT
1-3 bullets.

### METRICS
newInfoRatio: <0.0-1.0>
novelty: <1 sentence>
status: complete
sources: <comma-separated file:line list>

Terse, evidence-dense, no preamble.
