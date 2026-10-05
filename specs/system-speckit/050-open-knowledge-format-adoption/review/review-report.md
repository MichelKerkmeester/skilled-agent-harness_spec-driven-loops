# Deep Review Report: Open Knowledge Format Adoption (Packet 050)

Target: `specs/system-speckit/050-open-knowledge-format-adoption`, as a spec folder, plus the 80 files that its 18 commits shipped. Those files cover the shared `contextType`/`importance_tier` value list, the four checkers that read it, the `FRONTMATTER_VALUES` and `SOURCE_TAGS` rules, the citation census `cite-drift-scan.mjs`, their tests and the catalog, playbook and command docs that describe them.

Executor: cli-codex GPT-6 Luna (`max` effort, `fast` tier) for iterations 1, 2, 4 and 5. Iteration 3 is recorded as an error. Its first attempt hit the Codex usage limit, and the retry, on cli-pi DeepSeek V4.1 Flash through LLM Gateway (thinking pinned to `max`), was killed at the 900 s timeout. A DeepSeek attempt at iteration 4 timed out too, and Luna then ran that iteration's retry. Stop policy `max-iterations`.

<!-- ANCHOR:review-dimensions -->
Dimensions reviewed: correctness, security, traceability, maintainability
<!-- /ANCHOR:review-dimensions -->

---

## 1. Executive Summary

- **Verdict: CONDITIONAL**, `hasAdvisories: false`, `hasSearchDebt: true`. No P0 or P1 is active. On findings alone the verdict would be PASS with advisories. The Search Ledger rule turns it into CONDITIONAL because reducer-owned search debt is still open (§9).
- Active findings: **P0 0, P1 0, P2 4.** All four are class-of-bug advisories in the validator and census tooling. None of them breaks a shipped default path.
- Iterations: 5 run, 4 complete and 1 error. Stop reason `maxIterationsReached`. Dimension coverage is 4 of 4. Release readiness is `converged`, because no P0 or P1 appeared in any iteration.
- Coverage: the iteration records name 29 of the 80 scope files, which is 13 of 17 code files, 6 of 7 test files and 10 of 56 doc files. They also name the six phase `acceptance-criteria.md` files outside the scope list. The shipped code is close to fully covered. Most of the docs are not: the catalog, playbook and command-doc pages were sampled, not read in full.
- The orchestrator re-read each P2 at its cited lines during synthesis, and all four hold (see the Checked column in §3). Every finding is P2, so the adversarial self-check over P0 and P1 had nothing to adjudicate.

---

## 2. Planning Trigger

`/speckit:plan` is not required by severity, since no P0 or P1 is active. The CONDITIONAL comes from search debt, and the remedy is a narrower follow-up review rather than a code change. The four P2 advisories fall into two small workstreams that can ride one change or wait.

Planning Packet:

```json
{
  "triggered": false,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "hasSearchDebt": true,
  "activeFindings": [
    {"id": "R1-P2-001", "severity": "P2", "file": ".skilled/skills/system-spec-kit/runtime/cli/rules/check-source-tags-helper.mjs:64", "findingClass": "class-of-bug"},
    {"id": "R1-P2-002", "severity": "P2", "file": ".skilled/skills/system-skill-advisor/runtime/scripts/check-skill-doc-frontmatter.mjs:72", "findingClass": "class-of-bug"},
    {"id": "R2-P2-001", "severity": "P2", "file": ".skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:452", "findingClass": "UNKNOWN"},
    {"id": "R5-P2-001", "severity": "P2", "file": ".skilled/skills/system-skill-advisor/runtime/scripts/check-skill-doc-frontmatter.mjs:139", "findingClass": "UNKNOWN"}
  ],
  "remediationWorkstreams": [
    "WS-A: frontmatter scalar parsing parity across the four readers (R1-P2-002, R5-P2-001)",
    "WS-B: input hardening in the source-tag cutoff and the census batch reader (R1-P2-001, R2-P2-001)"
  ],
  "specSeed": "Make the four frontmatter-value readers agree on scalar parsing (YAML comments, case) and harden two inputs (cutoff override, newline pathnames).",
  "planSeed": "One shared scalar-normalization rule plus parity tests; a real-date check on SPECKIT_SOURCE_TAG_CUTOFF; reject or per-path-read newline pathnames in the census.",
  "findingClasses": ["class-of-bug", "UNKNOWN"],
  "affectedSurfacesSeed": [
    ".skilled/skills/system-skill-advisor/runtime/scripts/check-skill-doc-frontmatter.mjs",
    ".skilled/skills/system-spec-kit/runtime/cli/rules/check-frontmatter-values-helper.cjs",
    ".skilled/skills/sk-doc/shared/scripts/validate_document.py",
    ".skilled/skills/system-spec-kit/runtime/cli/rules/check-source-tags-helper.mjs",
    ".skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs"
  ],
  "fixCompletenessRequired": false
}
```

---

## 3. Active Finding Registry

| ID | Sev | Title | Dimension | File:line | Checked |
|----|-----|-------|-----------|-----------|---------|
| R1-P2-001 | P2 | Impossible date-shaped cutoff silently skips source-tag validation | correctness | `check-source-tags-helper.mjs:64` | Re-read: the regex `^\d{4}-\d{2}-\d{2}$` accepts `9999-99-99`, and line 314 skips any packet whose `created <= cutoff` lexically |
| R1-P2-002 | P2 | Valid YAML inline comments are included in frontmatter enum values | correctness | `check-skill-doc-frontmatter.mjs:72` | Re-read: `cleanScalar` trims and unquotes but never strips a `# comment`. Whether the block extractor upstream strips comments was not traced |
| R2-P2-001 | P2 | Newline in a tracked Markdown path shifts batched Git replies | security (correctness class) | `cite-drift-scan.mjs:452` | Re-read: the `ls-files -z` list splits on NUL (line 189), but the `cat-file --batch` input joins requests with `\n` (line 452) |
| R5-P2-001 | P2 | Skill-doc checker applies case-sensitive frontmatter matching | maintainability | `check-skill-doc-frontmatter.mjs:139` | Re-read: `cleanScalar` keeps case, and `CONTEXT_TYPES.has(fields.contextType)` / `IMPORTANCE_TIERS.has(...)` test the raw value |

**R1-P2-001.** `cutoffDate` accepts any `YYYY-MM-DD`-shaped prefix without checking that it is a real calendar date. With `SPECKIT_SOURCE_TAG_CUTOFF=9999-99-99`, every dated packet compares as older and is skipped, so the rule reports nothing. The test rejects only a non-date string (`check-source-tags.vitest.ts:197-201`). *Impact:* a mistyped override silently turns the rule off, but only for an operator who sets the variable. *Fix:* validate the override as a real date, and fall back to the default with the existing note. Disposition: advisory.

**R1-P2-002.** `contextType: planning # rationale` becomes `"planning # rationale"` and fails membership. The reviewer cites the same pattern in `check-frontmatter-values-helper.cjs:57-59` and `validate_document.py:1635-1639`, and no test covers inline comments. *Impact:* a false warning, or a checker failure on valid YAML. *Fix:* parse these scalars with YAML comment semantics through one shared rule. Disposition: advisory.

**R2-P2-001.** A tracked path that contains a line feed adds a request line, and the reader assigns replies by position without matching the returned object id. Later documents are then read under the wrong path. *Impact:* the census is advisory, and newline pathnames are rare. *Fix:* reject line-feed pathnames before batching, or read them through a framing-safe per-path call and check each reply against its request. Disposition: advisory.

**R5-P2-001.** The helper (`check-frontmatter-values-helper.cjs:59`), `validate_document.py:1638` and `resolveCanonicalContextType` (`context-types.ts:107`) lowercase before matching, and the skill-doc checker does not. A mixed-case value such as `Planning` passes three readers and fails the fourth. The helper's own test accepts mixed-case `Review` and `high` aliases. *Fix:* lowercase in the skill-doc checker, and add parity tests for mixed case across all four readers. Disposition: advisory.

---

## 4. Remediation Workstreams

No P0 or P1 workstream. Two P2 advisory groups:

1. **WS-A, scalar parsing parity (R1-P2-002, R5-P2-001).** Give the four readers of `frontmatter-values.json` one scalar rule (strip YAML comments, trim, unquote, lowercase) and one parity test that feeds the same fixtures through all four.
2. **WS-B, input hardening (R1-P2-001, R2-P2-001).** Reject impossible dates in `cutoffDate`, and make the census batch reader safe for newline pathnames.

---

## 5. Spec Seed

- The four frontmatter-value readers must return the same verdict for the same scalar, covering quotes, a trailing YAML comment and mixed case.
- `SPECKIT_SOURCE_TAG_CUTOFF` accepts only a real calendar date. Anything else falls back to the default and reports the note.
- The citation census never attributes one document's content to another path, including for pathnames that contain a line feed.

---

## 6. Plan Seed

1. Add a shared fixture set (`planning # note`, `"Planning"`, `Review`, `HIGH`) and run it through `check-frontmatter-values-helper.cjs`, `validate_document.py`, `check-skill-doc-frontmatter.mjs` and `context-types.ts`.
2. Fix `cleanScalar` in the skill-doc checker, and the matching parsers in the helper and the Python validator, until the fixture agrees.
3. Add a real-date check to `cutoffDate`, plus a test for `9999-99-99` and `2026-02-30`.
4. In `cite-drift-scan.mjs`, filter or individually read pathnames that contain `\n`, plus a test with such a path in a temporary repository.

---

## 7. Traceability Status

**Core protocols** (iteration 4):
- `spec_code`: **pass**. The acceptance rows marked Met in phases 004, 005, 008, 009, 010 and 011 match the shipped code they name, with no new mismatch.
- `checklist_evidence`: **partial**. The cited evidence exists, but the historical measurements behind several rows (census counts, panel figures) were not replayed. That is search debt SL-002.

**Overlay protocols:**
- `feature_catalog_code`: **partial**. The source-tag and census catalog entries match the code on the points checked, but the redirect table was not audited. That is search debt SL-003.
- `playbook_capability`: **pass**. The inspected manual-testing scenarios expect outputs the tools do produce.
- `skill_agent`, `agent_cross_runtime`: **not applicable**. The packet ships no agent definitions.

`AC_COVERAGE`: **exempt** for verdict purposes. The packet is closed and every phase's acceptance table is fully Met per the packet's own record. The rows sampled in iteration 4 match the code.

---

## 8. Deferred Items

- Replay the historical measurements cited in the acceptance tables (SL-002). This is advisory and needs the same corpus state to be meaningful.
- Audit the census redirect table against `git log --follow` (SL-003).
- Cross-checker test parity (SL-005-MAINT-003). The Python validator, skill-doc checker and `context-types` test suites were not read against each other. WS-A's parity test closes this one.
- The 46 scope doc files not named in any iteration record: catalog, playbook, command-doc and README pages.

---

## Dimension Expansion Map

No divergent pivots ran (`convergenceMode: default`), and no directions were marked saturated. Selected directions, in order: correctness (code), security (process and path handling), traceability (acceptance tables, catalog and playbook, SL-005), and maintainability (the four readers of the shared list). The remaining frontier is §8.

---

## 9. Search Ledger

- `hasSearchDebt: true`. The open reducer-owned debt is SL-002 (checklist evidence staleness), SL-003 (feature-catalog drift, partial) and SL-005-MAINT-003 (cross-checker test parity).
- **SL-005 is listed by the reducer as debt but was cleared in iteration 4.** `input-normalizer.ts:9` and `session-extractor.ts` import `SESSION_CONTEXT_TYPES`, and `frontmatter-migration.ts` imports the canonical and legacy alias sets from the shared module (iteration-004.md:34). The reducer did not carry that clearance into the registry.
- Candidate coverage covered: case normalization drift, citation path resolution, `contextType` consumer drift, feature-catalog drift, git batch framing, invalid date override, playbook capability drift, the shared alias contract, spec-code drift and YAML comment semantics.
- Ruled out (10 candidates), among them: shell argument injection, content-driven execution, regex denial of service, document-derived write paths, spaced-path resolution, alias acceptance drift, and the distinction between document aliases and runtime legacy aliases.
- Graph coverage mode: `graphless_fallback`. Every iteration cites direct reads and exact searches.

---

## 10. Audit Appendix

**Convergence.** The stop policy was `max-iterations`, so convergence was telemetry only. New-findings ratio by iteration: 1.0, 1.0, error, 0.0, 0.25. The reducer's convergence score is 0.75, and graph convergence returned `STOP_BLOCKED` on uncovered dimensions until traceability landed.

**Iteration log:**
1. correctness, Luna: 2 P2. The first attempt wrote nothing: its final command named a nonexistent working directory (`.worktrees/090-open-knowledge-format-adoption`). The retry passed.
2. security, Luna: 1 P2.
3. traceability: **error**. Codex usage limit, then a DeepSeek retry killed by SIGTERM at 900 s (receipt `exitStatus: 143`).
4. traceability (reduced scope), Luna: 0 new findings, SL-005 cleared. The first attempt on DeepSeek was killed at 900 s after five tool calls in about 11.5 minutes.
5. maintainability, Luna: 1 P2. The first attempt was killed at 900 s just before writing, and the reduced-scope retry passed.

**Runtime defects observed during the run** (not in the review target):
- The single-executor dispatch returned exit status 0 for both the Codex usage-limit failure and the Pi SIGTERM timeout. Only `verify-iteration.cjs` caught them. A dispatch exit status cannot show that an iteration ran.
- `deep-review-auto.yaml`'s `if_cli_codex` block loops over `$EVENT_DIR` and calls `$GATEWAY`, but only the `if_cli_opencode` block defines them. The loop is a harmless no-op today.
- `step_release_lock` runs `loop-lock.cjs release --owner-pid` without `--nonce`. A lock taken by `acquire` carries an `acquire_nonce`, and `lockIdentityMatches` refuses a release without it, so the step as written returns `released:false` and leaves the lock in place. The release here succeeded with `--nonce <acquire_nonce>`.
- DeepSeek V4.1 Flash at its roster-pinned `max` thinking took about 6 minutes to its first tool call and 1–2 minutes per call after that. It cannot finish a review iteration inside a 900 s executor timeout.

**Core Protocols:** `spec_code` pass, `checklist_evidence` partial.
**Overlay Protocols:** `feature_catalog_code` partial, `playbook_capability` pass, `skill_agent` and `agent_cross_runtime` not applicable.

**Sources reviewed:** `iterations/iteration-001.md` through `iteration-005.md` (iteration 3 absent; error record in the state log), `deltas/iter-001.jsonl` through `iter-005.jsonl` (iteration 3 absent), `deep-review-findings-registry.json`, `dispatch-receipts/` and `resource-map.md`.
