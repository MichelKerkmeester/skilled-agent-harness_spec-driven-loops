# Seat gpt-wip-doctrine — iteration 1 (global #63)

- Model: `claude-opus-4-8` · Executor: claude · Angle: gpt-wip-doctrine
- Verdict: **CONDITIONAL** · Findings: P0=0 P1=1 P2=0

## Analysis

## Review Analysis — Seat `gpt-wip-doctrine`

**Angle:** 001 peck verification discipline — self-check / current-state templates: claims in spec/docs vs what shipped (traceability lens).

I traced the three template/doctrine-shipping children of `001-peck-teachings-adoption` against the code they claim to add.

### 002-self-check-templates — claims hold (PASS)
Impl-summary claims `SELF-CHECK:` + `FAILURE MODES:` comment blocks were added to `spec.md.tmpl`, `plan.md.tmpl`, `checklist.md.tmpl`. Verified: all three templates contain the blocks at every generated level, placed immediately after the `SPECKIT_TEMPLATE_SOURCE` marker, with per-artifact tailored copy (`spec.md.tmpl:34-40`). Matches the documented design (HTML-comment, not a tracked header). No mismatch.

### 003-current-state-discipline — claims hold (PASS)
Claims: added `scripts/rules/check-current-state-discipline.sh`, registered `CURRENT_STATE_DISCIPLINE` at `info`, documented it. Verified all three: script exists and behaves as described (targets `implementation-summary.md` only, fence/comment-aware awk, `info` status), registry entry `severity: "info"` (`validator-registry.json:136-139`), doc row present (`validation_rules.md:68`). No mismatch.

### 006-peck-verification-discipline — **docs-vs-shipped mismatch (P1)**

The headline feature is the `CONTINUITY_FRESHNESS` validator with a documented **graduated rollout**:
- `validation_rules.md:96` — "Severity: WARNING by default; ERROR when `SPECKIT_COMPLETION_FRESHNESS_ENFORCE=true`"
- `validation_rules.md:105` — "Promotes stale completion freshness from warning to error"
- `006/implementation-summary.md:82` — "warns by default, and promotes to error only when `SPECKIT_COMPLETION_FRESHNESS_ENFORCE=true`"
- `CLAUDE.md` completion rule — "warn-only unless `SPECKIT_COMPLETION_FRESHNESS_ENFORCE=true`"

The shipped behavior does **not** deliver a non-blocking warn tier for normal packets. Tracing the wiring:
1. The rule is **strict-only** — it runs only inside `run_strict_validators`, which early-returns unless `$STRICT_MODE` (`validate.sh:830`).
2. The documented completion command is `validate.sh <folder> --strict` (CLAUDE.md COMPLETION VERIFICATION RULE).
3. Under `--strict`, **any** warning forces exit 2 / FAILED: `if [[ $WARNINGS -gt 0 ]] && $STRICT_MODE && ! $LEGACY_GRANDFATHERED; then exit 2` (`validate.sh:1062`).
4. Default (non-enforce) stale → `status=warn` → `log_warn` → `WARNINGS++` (`continuity-freshness.ts:340-342`, `validate.sh:762`).

So enabling `SPECKIT_COMPLETION_FRESHNESS=true` *without* enforce hard-fails completion validation (exit 2) on any stale packet — identical to enforce mode. The `ENFORCE` flag changes only the cosmetic status label (`warn`/`WARNINGS` vs `error`/`ERRORS`), not the pass/fail exit code. `LEGACY_GRANDFATHERED` is the lone carve-out where the distinction is observable, but it requires an explicit `legacy_grandfathered:true` in `graph-metadata.json` (`validate.sh:175-182`) — false for all normal/new packets this feature targets.

The phase's **own test encodes this contradiction**: `continuity-freshness.vitest.ts:191` asserts `result.status` (exit code) `=== 2` for the default warn case, and `:208` asserts `=== 2` for enforce — same exit code, only the inner label differs (`'warn'` line 193 vs `'error'` line 209). The test proves the documented "warn-only" tier does not exist behaviorally.

**Impact:** An operator following the docs would enable the flag (no enforce) expecting non-blocking warnings, and instead get hard FAILED completion/CI gates on stale packets. The two documented knobs collapse into one for the common case; the graduated-rollout value proposition is not shipped. Default-off caps blast radius to opt-in users, but the mismatch is squarely the deliverable of phase 006. Traceability defect.

**Fix:** Either (a) correct the docs (`validation_rules.md:93-105`, `006/implementation-summary.md:82`, `CLAUDE.md`/`AGENTS.md`) to state that enabling the flag blocks `--strict` completion regardless of enforce for non-grandfathered packets, and that enforce only changes the error/warning classification; or (b) make the warn tier genuinely non-blocking — e.g. have `run_continuity_freshness_check` emit `info` (not `warn`) when not in enforce mode, or exempt `CONTINUITY_FRESHNESS` warnings from the `--strict` exit-2 promotion unless enforce is set.

```json
{"seat":"gpt-wip-doctrine","model":"openai/gpt-5.5-fast","angle":"001 peck verification discipline: self-check / current-state templates — claims in spec/docs vs what shipped.","verdict":"CONDITIONAL","summary":"002/003 template+rule claims verify. 006: documented CONTINUITY_FRESHNESS warn-vs-enforce graduated rollout is inert for normal packets — both modes exit 2 under --strict (only --strict runs the rule); phase's own test proves it.","files_reviewed":[".opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-research-and-doctrine/001-peck-teachings-adoption/002-self-check-templates/implementation-summary.md",".opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-research-and-doctrine/001-peck-teachings-adoption/003-current-state-discipline/implementation-summary.md",".opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-research-and-doctrine/001-peck-teachings-adoption/006-peck-verification-discipline/implementation-summary.md",".opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl",".opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl",".opencode/skills/system-spec-kit/templates/manifest/checklist.md.tmpl",".opencode/skills/system-spec-kit/scripts/rules/check-current-state-discipline.sh",".opencode/skills/system-spec-kit/scripts/lib/validator-registry.json",".opencode/skills/system-spec-kit/scripts/validation/continuity-freshness.ts",".opencode/skills/system-spec-kit/scripts/spec/validate.sh",".opencode/skills/system-spec-kit/references/validation/validation_rules.md",".opencode/skills/system-spec-kit/mcp_server/tests/continuity-freshness.vitest.ts"],"findings":[{"severity":"P1","dimension":"traceability","title":"CONTINUITY_FRESHNESS documented warn-vs-enforce graduated rollout does not exist for normal packets","file":".opencode/skills/system-spec-kit/scripts/spec/validate.sh:1062","evidence":"Rule runs only inside run_strict_validators (validate.sh:830 early-returns unless $STRICT_MODE). Under --strict, ANY warning forces exit 2 (validate.sh:1062). Default non-enforce stale emits status=warn -> log_warn -> WARNINGS++ (continuity-freshness.ts:340-342, validate.sh:762). The phase's own vitest asserts exit code === 2 for BOTH default-warn (continuity-freshness.vitest.ts:191) and enforce (line 208); only the inner status label differs ('warn' line 193 vs 'error' line 209). LEGACY_GRANDFATHERED (validate.sh:175-182) is the only carve-out and is false for new packets.","why":"validation_rules.md:96 and :105, 006/implementation-summary.md:82, and CLAUDE.md document a graduated 'WARNING by default; ERROR when ENFORCE=true' / 'warn-only unless enforce' rollout. In the only execution path (validate.sh --strict, the documented completion command), default mode hard-fails completion (exit 2) identically to enforce; the ENFORCE flag is functionally inert (cosmetic label only) for normal packets. Operators enabling the flag without enforce, expecting non-blocking warnings, get hard FAILED completion/CI gates — the shipped behavior contradicts the documented feature.","recommendation":"Either correct the docs (validation_rules.md:93-105, 006 implementation-summary.md:82, CLAUDE.md/AGENTS.md) to state that enabling SPECKIT_COMPLETION_FRESHNESS blocks --strict completion regardless of enforce for non-grandfathered packets and that enforce only reclassifies warn->error; or make the warn tier genuinely non-blocking — emit 'info' (not 'warn') in non-enforce mode, or exempt CONTINUITY_FRESHNESS warnings from the --strict warnings->exit-2 promotion unless enforce is set."}]}
```
