# Deep Review Iteration 3 — Traceability

**Dimension:** traceability (docs-vs-code drift, cross-reference integrity, spec/checklist alignment)
**Iteration:** 3 of 10
**Session:** 2026-06-10T06:19:24Z
**Run:** run-003

---

## Files Reviewed

- `references/non_dev_ai_system/loop_contract.md` — formal contract for loop.py
- `references/non_dev_ai_system/operator_guide.md` — operator guide + conformance checklist
- `references/non_dev_ai_system/guardrails_teachings.md` — T1-T12 guardrail claims
- `scripts/shared/loop-host.cjs` — mode-switching entry point
- `scripts/non-dev-ai-system/run-non-dev-ai-system.cjs` — Lane D adapter
- `scripts/non-dev-ai-system/init_packaging.py` — scaffolder
- `assets/non_dev_ai_system/templates/loop.py.template` — loop template
- `assets/non_dev_ai_system/templates/gates.py.template` — gates template
- `assets/non_dev_ai_system/templates/gauntlet.py.template` — gauntlet template
- `assets/non_dev_ai_system/templates/derive.py.template` — derive template
- `assets/non_dev_ai_system/packaging_config.schema.json` — config schema
- `assets/non_dev_ai_system/packaging_config.example.json` — example config
- `commands/deep/start-non-dev-ai-system-loop.md` — command doc
- `SKILL.md` — skill lane table
- `Barter/Copywriter/_gates/gates.py` — pilot instance
- `Barter/Barter deals/_gates/gates.py` — second instance (docstring check)

---

## Findings by Severity

### P0 (Critical)

(none)

### P1 (Major)

#### R3-P1-001: Schema validation gaps in init_packaging.py — fields required by schema but unchecked by scaffolder

**File:** `scripts/non-dev-ai-system/init_packaging.py:43-119`

The `validate_config()` function in `init_packaging.py` does not validate several fields that the schema or template rendering depend on:

1. **`harness` sub-fields missing from validation but used by templates:** `init_packaging.py` validates `harness.benchmark_mode_instructions` but NOT `harness.ci_compact_path`, `harness.ci_full_path`, or `harness.skill_dir_name`. Yet the example config (`packaging_config.example.json:203-205`) provides all three, and `build_placeholders()` silently consumes them (they map to `CI_COMPACT`, `CI_FULL`, `SKILL_DIR` placeholders). A config missing these fields would pass validation but produce broken templates with unresolved `{{CI_COMPACT}}` etc.

2. **`lexicon` sub-structure not fully validated:** `init_packaging.py:113-117` checks `hard_blocker_words` and `hard_blocker_patterns` but does not validate pattern structure (`label`, `regex` required per schema:238-243).

3. **`self_score_regex` not validated for regex syntax:** The schema requires it (line 66), `init_packaging.py` checks existence (line 48), but it never compiles the regex to verify it's valid Python regex syntax. A malformed regex would fail at runtime during benchmark, not at scaffold time.

**Severity rationale:** Silent template corruption from missing harness fields is a P1 — an operator would get broken loop files from the scaffolder with no validation error.

**Claim:** `init_packaging.py` validation is incomplete relative to what templates consume.
**Evidence:** `init_packaging.py:109-112` only checks `benchmark_mode_instructions`; `build_placeholders()` uses `ci_compact_path`, `ci_full_path`, `skill_dir_name` without prior validation.
**Counterevidence sought:** Fields have defaults or are optional in templates — checked templates, no fallback for `{{CI_COMPACT}}`.
**Alternative explanation:** Schema `additionalProperties: false` on `harness` means well-formed JSON from schema validation would include these. But `init_packaging.py` does its own validation, independent of JSON schema enforcement.
**Final severity:** P1
**Confidence:** 0.85
**Downgrade trigger:** Add `harness` sub-field validation to `validate_config()`.

---

### P2 (Suggestions)

#### R3-P2-001: loop_contract.md missing LOOP_SKIP_PROBE env knob

**File:** `references/non_dev_ai_system/loop_contract.md:39-52`

The `## 3. ENV KNOBS` table lists 10 env vars but omits `LOOP_SKIP_PROBE`. The env var is documented in `operator_guide.md:15` ("env knobs: ... `LOOP_SKIP_PROBE`"), implemented in `loop.py.template:529` (`os.environ.get("LOOP_SKIP_PROBE") != "1"`), and referenced in `guardrails_teachings.md:103` (T11). The contract doc's env table is the authoritative reference; its omission means a packaging team reading only the contract would not know this knob exists.

**Evidence:** `loop_contract.md:39-52` has 10 rows; `LOOP_SKIP_PROBE` absent. `loop.py.template:529` reads it. `operator_guide.md:15` lists it.

#### R3-P2-002: loop_contract.md missing 3 journal events from the code

**File:** `references/non_dev_ai_system/loop_contract.md:54-75`

The `## 4. JOURNAL EVENTS` section lists 15 events but `loop.py.template` emits 3 additional events not documented:
- `promote_skip` (loop.py.template:560, 564) — emitted when held-out baseline is unmeasurable or proposer dispatch fails
- `heldout_baseline` (loop.py.template:558) — emitted with baseline measurement before propose
- `grade_cached` (loop.py.template:267) — emitted on resume cache hit

These are semantically distinct from the documented events. An operator parsing the journal for analytics would miss these event types.

**Evidence:** `loop_contract.md` lists `session_start`, `benchmark`, `regrade`, `grade`, `sample`, `iteration`, `heldout_baseline` (listed), `propose`, `promote_accept/reject`, `promotion`, `session_end`, `lock_evicted`, `session_orphaned`, `resume`, `worktree_swept`, `worktree_kept`, `provider_probe`, `grade_cached` (listed). Wait — re-reading: `heldout_baseline` IS listed (line 63), `grade_cached` IS listed (line 74). But `promote_skip` is NOT listed. Let me recheck.

Re-verified: `heldout_baseline` (line 63), `grade_cached` (line 74) are in the contract. `promote_skip` is NOT. So only 1 event is missing, not 3. Revised finding: `promote_skip` (loop.py.template:560, 564) is undocumented.

#### R3-P2-003: operator_guide.md claims gauntlet "passes 10/10" but gauntlet has 9 attacks

**File:** `references/non_dev_ai_system/operator_guide.md:62`

The conformance checklist says "The red-team gauntlet (`_loop/gauntlet.py` or equivalent) passes 10/10 dispatch-free." The `gauntlet.py.template` defines attacks A1 through A9 (9 attacks total). The guardrails_teachings.md T12 also says "passes 10/10 dispatch-free, covering frozen-surface edit, same-family grader, stale lock, and seven additional attack vectors" — which would be 3+7=10, but the code only has 9. A6 is explicitly labeled "KNOWN BOUNDARY: code lint passes it" which is a documented non-catch, not a caught attack.

**Evidence:** `gauntlet.py.template` defines A1-A9. `operator_guide.md:62` says "10/10". `guardrails_teachings.md:111` says "10/10".

#### R3-P2-004: guardrails_teachings.md T6 conflates fixture-lint.cjs with loop.py's lint_held_out()

**File:** `references/non_dev_ai_system/guardrails_teachings.md:63-65`

T6 states the guardrail "Lives in: `loop.py` (`lint_held_out`), `scripts/shared/fixture-lint.cjs`." These are two separate mechanisms: `lint_held_out()` is a Python function in `loop.py.template:476-489` that checks recorded outputs for `<DELIVERABLE>`. `fixture-lint.cjs` is a standalone Node.js script that classifies fixture lists. The loop.py template does NOT call `fixture-lint.cjs` — it only runs `lint_held_out()`. Claiming both "live in" the same guardrail conflates the loop-internal Python check with the external CLI tool. An operator reading T6 might expect `fixture-lint.cjs` to be automatically invoked by the loop, when it is not.

**Evidence:** `loop.py.template` has no reference to `fixture-lint`. `fixture-lint.cjs:16` shows standalone CLI usage. `guardrails_teachings.md:63-65` lists both.

#### R3-P2-005: Schema does not require harness sub-fields that templates consume

**File:** `assets/non_dev_ai_system/packaging_config.schema.json:188-220`

The `harness` object in the schema requires only `benchmark_mode_instructions` (line 190). But `init_packaging.py:build_placeholders()` (lines 172-173, 203-205) consumes `ci_compact_path`, `ci_full_path`, and `skill_dir_name` — these have no defaults and produce empty or unresolved template placeholders when missing. The schema's `additionalProperties: false` (line 192) prevents extra fields but doesn't enforce required sub-fields beyond `benchmark_mode_instructions`. This is the schema-side counterpart to R3-P1-001 (the validation gap).

**Evidence:** Schema `harness.required` = `["benchmark_mode_instructions"]`. `build_placeholders()` uses 3 additional fields without fallbacks.

---

## Traceability Checks

### (a) loop_contract.md vs loop.py.template

| Claim | Status | Detail |
|---|---|---|
| argv: `--dry-run` / `--run` | ✅ MATCH | Template lines 594-601 match contract §2 |
| argv: `--max-iters N` | ✅ MATCH | Template line 596, contract §2 |
| ENV: 10 knobs listed | ⚠️ PARTIAL | `LOOP_SKIP_PROBE` missing from contract table (R3-P2-001) |
| Journal: 15 events | ⚠️ PARTIAL | `promote_skip` missing from contract list (R3-P2-002) |
| Stop reasons: 7 reasons | ✅ MATCH | Template lines 83-84 match contract §5 |
| Lock: O_EXCL + stale eviction | ✅ MATCH | Template lines 94-118 match contract §7 |
| Resume: config hash + HEAD sha guard | ✅ MATCH | Template lines 187-196 match contract §7 |

### (b) operator_guide.md vs gates.py/derive.py/gauntlet.py reality

| Checklist Item | Status | Detail |
|---|---|---|
| `_loop/loop.py --dry-run` exits 0 | ✅ MATCH | Template implements `dry_run()` |
| `_gates/gates.py freeze` + `check` | ✅ MATCH | Template lines 55-98 |
| `_gates/derive.py derive && check` | ✅ MATCH | Template lines 39-87 |
| CW_ROOT honored | ✅ MATCH | Template line 34, gates line 19 |
| `<DELIVERABLE>` contract | ✅ MATCH | Template has `lint_held_out()` |
| Deterministic code linter | ✅ MATCH | Gauntlet A5 tests it |
| Different-family grader | ✅ MATCH | `assert_grader_family()` in template |
| Gauntlet 10/10 | ❌ MISMATCH | Only 9 attacks (A1-A9), not 10 (R3-P2-003) |
| `_loop/state/` gitignored | ✅ MATCH | `init_packaging.py:270` writes it |

### (c) packaging_config.schema.json vs templates vs init_packaging.py

| Field/Placeholder | Schema Required | Validated by init_packaging | Used by templates | Status |
|---|---|---|---|---|
| `system_name_short` | No (optional) | No | `SYSTEM_NAME_SHORT` placeholder | ✅ OK (optional) |
| `packaging_root_env` | No (optional) | No | `PACKAGING_ROOT_ENV` in every template | ✅ OK (has default) |
| `harness.ci_compact_path` | No | No | Yes (variant preludes) | ⚠️ DRIFT (R3-P1-001, R3-P2-005) |
| `harness.ci_full_path` | No | No | Yes (variant preludes) | ⚠️ DRIFT |
| `harness.skill_dir_name` | No | No | Yes (SKILL_DIR) | ⚠️ DRIFT |
| `lexicon.*` | Yes | Partial (words+patterns checked) | Yes (deterministic_lint) | ✅ OK |
| `self_score_regex` | Yes | Existence only | Yes (run.sh template) | ⚠️ No syntax check |

### (d) command doc vs loop-host.cjs vs adapter ENV_FORWARD

| Command flag | loop-host forward | adapter ENV_FORWARD | Status |
|---|---|---|---|
| `--packaging-root` | Yes (required) | Direct argv | ✅ MATCH |
| `--live` | Yes (boolean) | → `--run` argv | ✅ MATCH |
| `--max-iters` | Yes | → `--max-iters` argv | ✅ MATCH |
| `--fixtures` | Yes | → `LOOP_FIXTURES` | ✅ MATCH |
| `--variants` | Yes | → `LOOP_VARIANTS` | ✅ MATCH |
| `--held-out` | Yes | → `LOOP_HELD_OUT` | ✅ MATCH |
| `--samples` | Yes | → `LOOP_SAMPLES` | ✅ MATCH |
| `--proposer-model` | Yes | → `PROPOSER_MODEL` | ✅ MATCH |
| `--grader-model` | Yes | → `GRADER_MODEL` | ✅ MATCH |

All flags consistent across the three surfaces.

### (e) guardrails_teachings.md T1-T12 vs code locations

| Teaching | Claimed Location | Actual Location | Status |
|---|---|---|---|
| T1 | `loop.py`, `regrade.py` | ✅ | MATCH |
| T2 | `_gates/gates.py`, `packaging_config.schema.json`, `loop.py` | ✅ | MATCH |
| T3 | `loop.py`, `packaging_config.schema.json` | ✅ | MATCH |
| T4 | `loop.py`, env `LOOP_SAMPLES` | ✅ | MATCH |
| T5 | `run.sh`, `regrade.py` | ✅ | MATCH |
| T6 | `loop.py`, `fixture-lint.cjs` | ⚠️ | Conflated (R3-P2-004) |
| T7 | `loop.py` | ✅ | MATCH |
| T8 | `loop.py` | ✅ | MATCH |
| T9 | `loop.py` | ✅ | MATCH |
| T10 | `loop.py`, env `LOOP_POLISH` | ✅ | MATCH |
| T11 | `loop.py` | ✅ | MATCH |
| T12 | `_loop/gauntlet.py` | ⚠️ | "10/10" claim incorrect (R3-P2-003) |

### (f) SKILL.md lane table vs actual mode/paths

| Lane | SKILL.md mode | VALID_MODES | Status |
|---|---|---|---|
| Lane A | `agent-improvement` | `agent-improvement` | ✅ MATCH |
| Lane B | `model-benchmark` | `model-benchmark` | ✅ MATCH |
| Lane C | `skill-benchmark` | `skill-benchmark` | ✅ MATCH |
| Lane D | `non-dev-ai-system-refine` | `non-dev-ai-system-refine` | ✅ MATCH |

---

## Verdict

**CONDITIONAL** — No P0, no new P1 outside the schema/validation seam, P2 findings are docs-only drift. The pipeline from command → loop-host → adapter → loop.py is well-aligned. The main gap is in the scaffolder's validation completeness (R3-P1-001) and several minor contract/docs omissions.

---

## Next Dimension

`maintainability` — template/instance divergence cost, pattern clarity, safe follow-on change cost.
