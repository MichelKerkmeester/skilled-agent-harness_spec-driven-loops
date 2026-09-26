# Iteration 2: D2 Security — output surfaces, schema copies, plugin mirror

## Focus

- **Dimension**: security (D2). Secondary lens: traceability of the phase 002 runtime expansion and phase 004/005 requirement claims.
- **Scope**: the phase 3/4/5 output and trust surfaces from `goal-file-manifest.txt`:
  - tool descriptors and schema copies (`runtime/tools/advisor-recommend.ts`, `runtime/schemas/advisor-tool-schemas.ts`, `runtime/skill-advisor-cli-manifest.ts`, `runtime/lib/advisor-runtime-values.ts`)
  - prompt-boundary renderer (`runtime/lib/render.ts`), diagnostics writer (`runtime/lib/metrics.ts`)
  - OpenCode plugin mirror (`.opencode/plugins/system-skill-advisor.js`, byte-compared against `.skilled/plugins/system-skill-advisor.js`)
  - path handling in `hooks/lib/skill-advisor-cli-fallback.ts`, `hooks/pi/prompt-advisor.ts`, `runtime/handlers/advisor-recommend.ts`
  - phase 004/005 normative claims and the tests that pin them (`system-skill-advisor-plugin.vitest.ts`, `system-skill-advisor.test.cjs`)
- **Method**: traced every caller-supplied string from parse boundary to model-visible output; verified spawn argument construction (no shell), stdout caps, JSON guards and fail-open paths; checked the prompt-safety guard in the renderer; audited file creation modes on the diagnostics writer; re-read the three hardcoded runtime enums against the canonical tuple.

## Scorecard

- Dimensions covered: security, maintainability (lens), traceability (phase 004/005 verification)
- Files reviewed: 15
- New findings: P0=0 P1=0 P2=2
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.5 (severity-weighted new = 2.0 over accumulated = 4.0; telemetry only, `stopPolicy=max-iterations`)

## Findings

### P0, Blocker

None. No injection path, auth bypass, secret exposure, or unsafe deserialization found.

### P1, Required

None.

### P2, Suggestion

- **F003**: Runtime vocabulary drift — three hardcoded enum copies reject the four runtimes phase 002 added, `runtime/schemas/advisor-tool-schemas.ts:349` (daemon zod), `runtime/tools/advisor-validate.ts:22` (tool descriptor), `runtime/skill-advisor-cli-manifest.ts:89` (CLI manifest).
  `advisor-runtime-values.ts` declares itself the single source of truth: "Adding a new runtime (e.g. a future provider) requires changing only this tuple; downstream type unions and runtime guards inherit the change" (`:5-9`). Phase 002 R3 added `pi`, `codex`, `cursor`, `devin` to that tuple and the diagnostic/outcome *record* validators now accept all seven (`metrics.ts:401`, `:500`, `:575` use `enumIncludes(ADVISOR_RUNTIME_VALUES, ...)`). But the `advisor_validate` `outcomeEvents[].runtime` input enum is still `['claude', 'copilot', 'opencode']` in all three copies, so an outcome event for a Pi/Codex/Cursor/Devin turn is rejected twice (daemon `-32602`, CLI usage error) while the persist-side type would have accepted it. Scope note: the two in-scope copies are `runtime/schemas/advisor-tool-schemas.ts:349` (daemon schema) and `runtime/skill-advisor-cli-manifest.ts:89` (CLI manifest); the third, `runtime/tools/advisor-validate.ts:22` (tool descriptor), is outside `goal-file-manifest.txt` and is cited as adjacent context for the sweep, not as a review target. Phase 002's own sweep (plan.md §"Readers of the runtime list") listed seven readers and none of these three, which is how the drift survived. Recommendation: derive all three enums from `ADVISOR_RUNTIME_VALUES`, or justify the narrowing in the schema with a comment. Upgrade condition: if any workflow is expected to submit outcome telemetry for the new runtimes, this becomes P1.

- **F004**: Diagnostics log created with default permissions under `os.tmpdir()`, `.skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:182`, `:274-278`, `:302-325`.
  `DURABLE_METRICS_ROOT = join(tmpdir(), 'speckit-skill-advisor-metrics')`; the directory is created by `mkdir(dirname(path), { recursive: true })` with no `mode`, and the JSONL is written by `appendFile`/`writeFile` with default modes (subject only to umask). On shared Linux hosts (`os.tmpdir() === '/tmp'`), a default umask leaves the directory 0755 and the files 0644, so any local user can read the bounded diagnostic log. Content is prompt-free by design (closed schema plus `FORBIDDEN_DIAGNOSTIC_FIELDS`), yet it still exposes skill labels, runtimes, timing and error detail; the record is only written when `SKILL_ADVISOR_DEBUG` is on. Recommendation: create the root with mode `0o700` (and the files `0o600`) in `ensureParentDir`/the write path. Note: `mkdirSync(..., {recursive:true})` does not repair the mode of a pre-existing directory, so an explicit `chmod` on the resolved root is the robust form. Low severity: prompt-safety holds and the trigger is debug-on telemetry on a shared host.

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | `004-headless-fallback-status-and-dedup/spec.md` REQ-001..007; `005-follow-up-fixes/spec.md` REQ-004/REQ-005 vs. `runtime/lib/render.ts:476-497`, `hooks/pi/prompt-advisor.ts:184-189`, `.skilled/plugins/system-skill-advisor.js:67-84`, `:1357-1400` | Verified: three status heads match between plugin and renderer (outage/no-match/skipped, including `absent`/`degraded` labels); plugin transform dedup hashes the full block before lifecycle reduction; CJS same-message test now runs with lifecycle dedup on and the distinct-message/flag-off tests document their kill switch; five-turn no-route repeat delivers one full fallback then heads, unknown session stays full. Phase 004/005 claims hold in the files read. |
| checklist_evidence | notApplicable | hard | `006-fanout-deep-review/spec.md:15` | Level 1 child phase; no `checklist.md`. Re-checked in iteration 3. |

## Assessment

- New findings ratio: 0.5
- Dimensions addressed: security (full pass), plus traceability verification of phase 004/005 claims and a maintainability lens
- Novelty justification: two independent P2s, both new. The security pass found no injectable data on the model-visible boundary: the renderer emits only enum-checked freshness, sanitized skill labels (unicode-folded, control-char-stripped, instruction-shape-rejected) and numeric scores; caller text never reaches the output. The plugin spawns with an argv array and `stdio: ['ignore','pipe','ignore']`, caps stdout, guards JSON parsing, and kills on term/deadline. Workspace roots are bounded by a separator-aware allowlist after realpath canonicalization, and the handler's re-canonicalization cannot widen it. The two recorded findings are a vocabulary drift that the runtime module's own comment denies, and temp-file permissions on the diagnostics writer.

## Ruled Out

- **Prompt injection through skill labels or descriptions**: `sanitizeSkillLabel` folds unicode, rejects newlines/control chars and instruction-shaped strings via `INSTRUCTION_LABEL_PATTERN`; only label + scores + constant directives are rendered. (`runtime/lib/render.ts:94-96`, `:140-156`, `:426-451`)
- **Command injection in the plugin CLI call**: `options.spawnAdvisor(options.nodeBinary, advisorCliArgs(...), {...})` passes an argument vector, no shell; prompt length is clamped to the configured prompt-byte budget. (`.skilled/plugins/system-skill-advisor.js:780-799`, `:1075-1081`)
- **Plugin/renderer fallback divergence**: the plugin's three heads and outage labels are string-equal to the renderer's for every status/freshness pair the CLI path can produce (`ok`/`skipped`/`fail_open` × live/stale/unavailable/absent); the `degraded` case is defensive-only because `parseCliResponse` never emits it. (`render.ts:455-473` vs. plugin `:67-84`, `:1342-1346`)
- **Workspace-root allowlist bypass**: prefix match is separator-aware (`canonical === prefix || canonical.startsWith(prefix + '/')`), canonicalization realpaths existing ancestors for not-yet-existing paths, and the handler's weaker re-canonicalization cannot move the path outside the schema-validated form. (`runtime/schemas/advisor-tool-schemas.ts:83-151`, `handlers/advisor-recommend.ts:62-69`)
- **Plugin mirror drift**: `.opencode/plugins/system-skill-advisor.js` and `.skilled/plugins/system-skill-advisor.js` are byte-identical (md5 `28114f4c629b341a44ce9f7bfef76ef5`). The duplication is still a follow-on-change risk; noted for iteration 3 rather than filed.
- **Metrics diagnostic record leakage of prompt content**: the record is a closed schema with forbidden prompt fields, error text is whitespace-compacted and capped at 240 chars, skill labels are regex-restricted at persist time. (`runtime/lib/metrics.ts:213-228`, `:391-415`)

## Dead Ends

- **IPC socket directory hardening (out of scope)**: `.skilled/bin/skill-advisor.cjs:91` creates the socket dir with `mode: 0o700` but `mkdirSync(recursive)` does not repair an attacker-pre-created directory, and `.skilled/bin/lib/launcher-ipc-bridge.cjs` has no chmod. Both files are outside `goal-file-manifest.txt`, so this is recorded as an adjacent-surface observation for the deferred-items section, not a finding.
- **Outcome-event enum as a phase 002 REQ-003 violation**: plan.md names seven readers and these enums are not among them, so the letter of REQ-003 is met; recorded as F003 on architecture grounds (denied single-source invariant), not as a spec contradiction.

## Recommended Next Focus

Iteration 3: D3 Traceability + D4 Maintainability — phases 002-005 spec claims against the full manifest (including `.pi/extensions/pi-cache-optimizer/index.ts` hash-verified edits section and the four deep-loop YAML `step_convergence_report` blocks), docs (`skill-advisor-hook.md`, `ARCHITECTURE.md`, pi-cache-optimizer README), the remaining tests, `checklist_evidence` re-check, and the plugin duplication note.

Review verdict: PASS
