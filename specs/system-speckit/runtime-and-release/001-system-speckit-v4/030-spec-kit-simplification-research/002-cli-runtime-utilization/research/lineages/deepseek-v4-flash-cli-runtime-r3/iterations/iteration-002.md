---
title: "Iteration 2: Undocumented environment reads"
trigger_phrases: []
---
# Iteration 2: Undocumented environment reads

## Focus

Read `runtime/ENV-REFERENCE.md` (full 475 lines) and `.opencode/skills/system-spec-kit/.env.example`, then the env-read sites in the eight named files. A variable read there and absent from the reference, or documented and read nowhere in those files, is a finding.

## Actions Taken

1. Read ENV-REFERENCE.md in full (two chunks: lines 1-142, 143-475): 145 documented variables across sections 1 (flag inventory + hook kill-switches), 2 (infrastructure), 3 (spec validation + generated metadata), 4 (runtime hook adapters + spec gate), 5-7, plus advisor/embedding/goal/CLI/deep-loop sections.
2. `.env.example` premise: **the file does not exist** — `find .opencode -name ".env.example"` (excluding node_modules) returns zero results; only `.opencode/hooks/hook-flags.env.example` exists (2,533 bytes, attached to line 66's config-file story). ENV-REFERENCE.md:225 still says "Mirroring the markers in `.env.example`".
3. Env-read extraction per sampled file (`grep -oE '\$\{?[A-Z][A-Z0-9_]*\}|process\.env\.[A-Z0-9_]+'` plus follow-up `grep -n`):
   - `cli/spec/validate.sh` → `${SPECKIT_SKIP_VALIDATION}` (lines 19-20; also in its own usage help line 79).
   - `cli/spec/check-completion.sh` → only BLUE/BOLD/GREEN/NC/RED/YELLOW, all defined locally at lines 35/39 (not env reads).
   - `cli/spec/create.sh` → local shell vars only (DETECTED_CONF, DOC_LEVEL, REPO_ROOT, ...) plus `SPECKIT_TEMPLATES_BASE` reads at lines 954, 1091, 1649.
   - `cli/rules/check-ac-closure.sh` → SPECKIT_AC_CLOSURE (line 32), SPECKIT_AC_CLOSURE_CUTOFF (line 49).
   - `cli/rules/check-ac-coverage.sh` → SPECKIT_AC_COVERAGE (line 27), SPECKIT_AC_COVERAGE_ENFORCE (line 21), SPECKIT_AC_COVERAGE_FLOOR (lines 39, 50).
   - `runtime/lib/hooks/completion-evidence-sentinel.cjs` → binary-detected by grep; `-a` text grep finds no `process.env.X` form, yet `grep -rl SYSTEM_COMPLETION_DISABLED` lists this file (it resolves the flag through the hook-flags registry instead of a direct process.env read).
   - `runtime/hooks/claude/completion-evidence-stop.cjs` → no env reads in any form.
   - `cli/validation/continuity-freshness.ts` → SPECKIT_COMPLETION_FRESHNESS, SPECKIT_COMPLETION_FRESHNESS_ENFORCE.
4. Cross-check of every in-sample documented reader: SPECKIT_AC_CLOSURE/_CUTOFF, SPECKIT_AC_COVERAGE/_ENFORCE/_FLOOR, SPECKIT_TEMPLATES_BASE, SPECKIT_COMPLETION_FRESHNESS/_ENFORCE all have real reads in their named source files (see call evidence above). `grep -n "SKIP_VALIDATION"` over ENV-REFERENCE.md returns zero hits.

## Findings

| # | Severity | Claim side | Actual side | Verdict |
|---|----------|-----------|-------------|---------|
| F1 | P2 | `runtime/ENV-REFERENCE.md` (Section 3, SPEC VALIDATION) — documents validate.sh's env surface (SPECKIT_RULES :158, SPECKIT_FRONTMATTER_ALLOWLIST :159, SPECKIT_VALIDATE_SCRIPT :164) with nothing about a skip switch; "Total unique variables documented: 145" | `runtime/cli/spec/validate.sh:19-20` reads `${SPECKIT_SKIP_VALIDATION:-}` — if non-empty, validation is skipped with a "Validation skipped" message; the flag is documented only in the script's own usage help (validate.sh:79), never in the reference | Escape-hatch variable read by the reference's own flagship script but absent from the canonical env table; the 145-row claim is one-directional (readers without rows are unpatrolled). Recommend: **fix** — add the row to Section 3 (default unset, any non-empty value skips) |
| F2 | P2 | `runtime/ENV-REFERENCE.md:225` — "**Ownership.** Mirroring the markers in `.env.example`: every provider-selection row (...)" | No `.env.example` exists anywhere under `.opencode` (find returns zero; the only surviving example is `.opencode/hooks/hook-flags.env.example`, which line 66 already names) | Dangling file pointer to a file removed by the earlier env-flag remediation; the ownership-marker sentence now has no anchor. Recommend: **fix** — rewording to the surviving example or deleting the pointer |

## Verified Correct (no finding)

- The five AC/coverage/templates vars and the two freshness vars are read in exactly the files the reference's Source column names (lines 166-175 of the reference vs check-ac-closure.sh:32,49, check-ac-coverage.sh:21,27,39,50, create.sh:954,1091,1649, continuity-freshness.ts).
- `SYSTEM_COMPLETION_DISABLED` kill-switch has a live reader: `runtime/lib/hooks/completion-evidence-sentinel.cjs` (found by `grep -rl`), matching the reference's hook kill-switch row; the sampled claude stop adapter itself reads no env, consistent with "adapters delegate".
- `check-completion.sh` and the claude stop adapter read no environment variables; nothing in the reference claims they do.
- `SPECKIT_TEMPLATES_BASE`'s fallback default in create.sh matches the reference's "(bundled templates)" row.

## Questions Answered

- Are any of the 145 documented variables contradicting an in-sample reader? No — every variable whose stated Source is inside the eight-file sample is genuinely read there.
- Are there readers with no reference row? Yes, one: SPECKIT_SKIP_VALIDATION.

## Open Questions

1. Does any CI or hook set SPECKIT_SKIP_VALIDATION (making it more than an operator escape hatch)? Out of the sample; the doctor retrieve route does not obviously.
2. Was `.env.example` removed by 007/008 or by the 014 orphan cleanup? No git history available per invocation contract; the pointer at ENV-REFERENCE.md:225 is stale either way.

## Ruled Out

- MEMORY_BASE_PATH (reference line ~, Section 2): the reference itself discloses "no effect on running behavior" and names a real assignment site — documented-as-dead, not a contradiction.
- BLUE/BOLD/etc. in check-completion.sh: locally defined at lines 35/39, not environment reads.
- The `hooks/*/completion-evidence*` glob imprecision in the reference: the live reader is under `lib/hooks/`, not `hooks/*/` — surfaced as a question for iteration 4 (adapters vs core), not a standalone finding here.
