---
title: "deep-research-strategy: fanout-deepseek-v4-flash-cli-runtime-r3 (final)"
---

# Deep Research Strategy — Round 3 (final)

## Charter
Skeptical audit of the system-spec-kit runtime CLI package and the assets and hooks that call it. Five bounded iterations, one fixed angle each, max 12 tool calls per iteration, every claim cited path:line, no edits, no redesign, write-only-under-lineage.

## Key Questions (13 posed, 11 answered)
1. Command assets vs scripts — answered (001-003).
2. Env reads vs reference — answered (004-005).
3. Test coverage by script — answered (006-007).
4. Hook adapters vs core — answered (008-009).
5. CI push vs PR — answered (010-012).
6. OPEN — pi loader relocation for runtime/hooks/pi/*.
7. OPEN — isHookEnabled("completion") reach to SYSTEM_COMPLETION_DISABLED.

## What Worked
- Exact-filename grep for script→suite mapping (iteration 3) avoided the token-noise of bare-name matches.
- Registry-based dispatch model (39 rule rows → 27 rules/*.sh + helpers) settled the "validation lane exemption" question without running anything.
- Reading the core's exports list (547-570) before the adapters made the adapter census one-pass.
- `grep -a` (text mode) for the CJS files that grep classifies as binary — first pass silently missed their env reads.

## What Failed
- `rg -r` misuse twice: `-r` is rg's replace flag, not a recurrence flag; both greps returned replaced-token artifacts and had to be redone. (Discipline note: use `-n`, never `-r`.)
- Iteration 2's first env-read sweep reported empty for check-ac-*.sh and the sentinel cjs — wrong-plausible results; direct `grep -n "SPECKIT_AC"` corrected them.
- grep's binary detection on `.cjs` files silently returned "matches" without content — required `-a`.

## Exhausted Approaches
- Counting test coverage with bare-name token grep (noise); replaced by exact-name grep.
- Verify=by-diff of cli/tests/check-*.sh vs rules/ copies (disproven as duplicates — they are harnesses).
- Reading the pi extension loader: no in-repo consumer of runtime/hooks/pi/* was located; recorded as an open question rather than guessed.

## Ruled Out Directions
- sweep-track-roots.mjs as a finding (recorded-kept manual tool; README cites invocation).
- check-links.sh as a defect (round-two census row 10; post-edit router call verified).
- MEMORY_BASE_PATH (documented-as-dead by its own row).
- cursor's 6-up hook-flags import (resolves correctly).
- strict-pass-freshness-report.yml (scheduled report, not a gate).

## Next Focus
None — synthesis complete (maxIterationsReached). Remediation candidates for a future child, in severity order: (1) spec-kit-check.yml push trigger; (2) pi hook-flags import depth + fallback; (3) ENV-REFERENCE.md SKIP_VALIDATION row + .env.example pointer; (4) standalone cli/tests bash tests lane; (5) doc fixes (save.md categories, workflow.ts:1740 comment, README validate.md absence, changed-packet-validation.yaml, PR-only rationale note).
