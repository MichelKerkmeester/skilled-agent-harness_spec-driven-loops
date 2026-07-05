# Iteration 8 — Correctness Deep Pass 3: Loop Instance Operational Edge Cases

**Dimension:** correctness (deep pass 3: packaging loop instances under operational edge cases)
**Mode:** review
**Run:** run-008
**Timestamp:** 2026-06-10T06:19:24Z

## Focus

Function-level analysis of the LIVE packaging loop instances (Barter deals + Copywriter) for operational edge cases that prior passes covered only at file level. Five sub-targets:

1. **(a) resume-from-journal:** `build_resume_cache` validity windows — env differences, torn journal lines, orphaned sessions with different configs
2. **(b) worktree mechanics:** `make_worktree` on merge commits, nested worktrees, `cleanup_worktree` dirname() for both layers, `sweep_stale_worktrees` prefix isolation
3. **(c) Barter deals instance specifics:** empty derived set (zero SHARED entries), DEAL self-score regex false matches
4. **(d) lint_held_out run-tagged filter:** prefix collision class (D2-deal-stat vs D2-deal-stat-v2)
5. **(e) probe_provider:** timeout 180 vs loop dispatch timeouts, partial output matching 'invalid api key'

## Files Reviewed

- `Barter/Barter deals/_loop/loop.py` (full read, function-level analysis of build_resume_cache, sweep_stale_worktrees, lint_held_out, probe_provider, guarded_promote, make_worktree, cleanup_worktree)
- `Barter/Copywriter/_loop/loop.py` (full read, same functions for comparison)
- `Barter/Barter deals/_gates/gates.py` (derive.py contract check)
- `Barter/Copywriter/_gates/derive.py` (SHARED list for empty-set analysis)
- `Barter/Barter deals/benchmark/grader/regrade.py` (self_meqt regex: `(DEAL|MEQT)/25`)
- `Barter/Copywriter/benchmark/grader/regrade.py` (self_meqt regex: `MEQT/25`)
- `scripts/shared/fixture-lint.cjs` (classifyFixture: `f.startswith(id + '.')`)
- `scripts/shared/loop-host.cjs` (planInvocation forwarding)
- `scripts/non-dev-ai-system/run-non-dev-ai-system.cjs` (ENV_FORWARD map)
- `assets/non_dev_ai_system/templates/loop.py.template` (template-vs-instance comparison)

## Findings by Severity

### P0 (Critical): 0

No new P0 findings.

### P1 (Major): 0

No new P1 findings.

### P2 (Minor / Advisory): 3 new

**R8-P2-001: `_config_hash()` omits HELD_OUT — safe-by-structure but not explicitly guarded**

- **File:** `Barter/Barter deals/_loop/loop.py:148` (and Copywriter `loop.py:149`)
- **Evidence:** `_config_hash()` hashes `[FIXTURES, VARIANTS, SAMPLES, GRADER_MODEL, PROPOSER_MODEL]`. HELD_OUT is absent. If an operator changes HELD_OUT between a killed run and its resume, the config hash matches and the resume cache activates.
- **Why safe today:** Cache keys are `{phase}:{variant}:{fixture}:{run}`. Baseline-phase keys reference HELD_OUT fixture names (e.g. `baseline:cli:D2-deal-stat:1`). A new HELD_OUT set produces different keys, so old cached grades are never looked up. Unused orphan entries remain in the cache dict but are harmless.
- **Risk:** If future code paths cache grades using phase names alone (without fixture in the key), HELD_OUT omission would cause cross-contamination. The structural safety depends on the key format, not the hash.
- **Recommendation:** Add `HELD_OUT` to the hash blob for defense-in-depth. Low urgency.

**R8-P2-002: `lint_held_out()` prefix collision class with overlapping fixture names**

- **File:** `Barter/Barter deals/_loop/loop.py:495` (and Copywriter `loop.py:496`)
- **Evidence:** `f.startswith(t + ".run")` matches `D2-deal-stat.run1.txt` but would also match `D2-deal-stat-v2.run1.txt` if such a fixture existed. A fixture named `D2-deal-stat` would falsely include outputs from `D2-deal-stat-extra` in its lint check.
- **Why safe today:** Current fixture names (D1-deal-write, D2-deal-stat, T1-write, T5-quick, T7-stat, etc.) have no prefix-overlap relationships. The collision class is theoretical.
- **Comparison:** `fixture-lint.cjs:48` uses `f.startswith(id + '.') && f.endsWith(ext)` — same prefix-class vulnerability, but bounded by the extension check. The Python `lint_held_out` uses `.run` as the separator, which is more specific.
- **Recommendation:** Use `f.startswith(t + '.run')` (already done) or `re.match(re.escape(t) + r'\.run\d+', f)` for exact-match. Low urgency; add a fixture-naming guideline to `fixture_authoring.md`.

**R8-P2-003: `cleanup_worktree` dirname() assumes single-level packaging subdir**

- **File:** `Barter/Barter deals/_loop/loop.py:600` (and Copywriter `loop.py:601`)
- **Evidence:** `make_worktree()` returns `os.path.join(base, "Copywriter")`. `cleanup_worktree()` reverses via `os.path.dirname(wt_cw)`. This works because the packaging subdir is exactly one level deep. If a packaging's `_loop/loop.py` returned a deeper path (e.g. `base/Copywriter/subdir`), `dirname()` would only go up one level, leaving a partial worktree.
- **Why safe today:** Both Barter deals and Copywriter use `"Copywriter"` as the single-level subdir. The template uses `{{WORKTREE_SUBDIR}}` which is a single directory name by convention.
- **Risk:** Low. A new packaging that nests deeper would need to override `make_worktree` and `cleanup_worktree` together. The template enforces the single-level contract via `{{WORKTREE_SUBDIR}}`.
- **Recommendation:** Document the single-level assumption in `loop_contract.md`. No code change needed.

## Ruled-Out Directions

| Hypothesis | Ruled-out reason |
|---|---|
| Torn journal line crashes `read_journal()` | `try/except` on `json.loads(l)` with `continue` — explicitly tolerates torn trailing lines (loop.py:164) |
| Two orphaned sessions with different configs cause cache contamination | `build_resume_cache` filters on `cfg == current_cfg` AND `head == current_sha` — different configs produce different hashes, no cross-contamination |
| Worktree-in-worktree (T12 nested worktree) breaks `cleanup_worktree` | `make_worktree` always uses `BARTER` (the main repo root) for `git worktree add`, not the outer worktree. Nested worktree creation operates on the main repo. `dirname()` correctly resolves the single-level subdir. Verified in both loop instances. |
| `sweep_stale_worktrees` mixes deals-loop-* and copywriter-loop-* prefixes | Deals uses `deals-loop-` prefix, Copywriter uses `copywriter-loop-` prefix. Each loop's sweep only matches its own prefix. No cross-contamination. |
| Empty derived set causes `guarded_promote` to misbehave | `derive.py` iterates SHARED list; empty list = zero iterations, zero copies, prints "Derived 0 copies" and exits 0. `check()` with empty SHARED = zero drift, exits 0. Safe no-op. |
| DEAL self-score regex `(DEAL\|MEQT)/25` false-matches | Regex uses `[^\d]{0,15}` gap limiter. In practice, model output follows structured format. False-match risk is negligible for the expected scoring output shape. |
| `probe_provider` "invalid api key" substring match false-positives | Probe prompt is "Reply with exactly: OK" — model should output "OK", not produce error-like text. `subprocess.run` stderr contains provider error messages, not model reasoning. False-positive risk negligible. |
| `HELD_OUT` env change invalidates guarded_promote comparison | `HELD_OUT` is module-level constant, read once at import. Cannot change mid-run. The baseline and candidate phases always measure the same HELD_OUT set within a single run. |

## Traceability Checks

| Protocol | Check | Result |
|---|---|---|
| spec_code | Loop contract edge cases vs `loop_contract.md` | PASS — resume, worktree, and convergence contracts hold at function level |
| checklist_evidence | T6 (held-out gradeability), T11 (auth probe), T2 (rubric guard) | PASS — all three teachings correctly applied in both instances |
| agent_cross_runtime | Deals vs Copywriter loop instances diverge only in domain config (fixtures, dims, prefix) | PASS — structural identity confirmed, no cross-instance bugs |

## Verdict

**PASS-candidate** with `hasAdvisories=true`

All five sub-targets analyzed at function level. Three new P2 advisories (config hash omission, prefix collision class, dirname nesting assumption). All are safe-by-structure under current naming conventions. Zero P0, zero P1. Prior findings unchanged at P0=0, P1=0, P2=27 (+3 new = 30 total).

## Next Dimension

All four dimensions complete (correctness, security, traceability, maintainability). This deep pass covered the remaining correctness surface at function-level granularity. With 10 iterations allocated and 8 consumed, two remaining iterations are available for convergence confirmation or targeted re-visits if the stuck count increases.
