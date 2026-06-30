# Deep Review Report — sk-design design-work review

Fan-out deep review of the session's shipped work (the 68-phase design-enforcement build, the 22-file OVERVIEW conformance, and the guided-run.ts header) scoped to `skill:sk-design` plus the skill-benchmark gate code. Two independent CLI lineages reviewed read-only and their findings were merged with strongest-restriction.

## 1. Summary

- **Verdict: CONDITIONAL** — 0 P0, 1 P1, 13 P2 (merged, deduped).
- **No blockers (P0=0).** The single P1 and the bulk of the P2s land on **pre-existing** design-md-generator backend code, not on this session's enforcement-gate or conformance deliverables.
- **This session's shipped work reviewed clean of P0/P1.** The few P2s touching it are minor advisories (one DRY suggestion, one report-omission note) plus one refuted false-positive.
- **Standing invariants all hold** after the review: surface-check STATUS=PASS drift=0; skill-benchmark hubRoute 34/29/5/0; naming_doc_check exit 0.

## 2. Scope

- Target: `skill:sk-design` (the 4-layer design-command-surface-check, proof_check.py opt-in lanes, naming_doc_check.py, the numeric/perf/baseline/polish/variant/fingerprint gates, command-metadata.json, context_loading_contract.md, the 22 OVERVIEW-conformed docs, guided-run.ts) + the skill-benchmark gate code (score-skill-benchmark.cjs, the route-gold fixtures).
- Dimensions: correctness, security, traceability, maintainability (all four covered by both lineages).

## 3. Lineages

| Lineage | Executor | Iters | Convergence | Findings (P0/P1/P2) | Duration |
|---------|----------|-------|-------------|----------------------|----------|
| codex | cli-codex gpt-5.5, reasoning xhigh, service-tier fast | 5 | 1.0 (STOP_ALLOWED) | 0 / 1 / 3 | 8.7 min |
| glm | cli-opencode zai-coding-plan/glm-5.2, reasoning xhigh* | 8 | 0.75 | 0 / 0 / 10 | 22.2 min |

\* Requested "max"; the deep-loop executor schema caps reasoning at `xhigh` (no `max` value), so the glm lineage ran at `xhigh` — glm's thinking-on-by-default still engaged its reasoning. Both lineages converged before their 20/10 iteration caps (legitimate convergence — finding signal stabilized).

## 4. Findings by severity

**P0 (blocker): none.**

**P1 (required): 1**
- `correctness` — `design-md-generator/backend/scripts/guided-run.ts:47-65` — `parseGuidedRunArgs` takes the first non-`--` token as the URL (`args.find(a => !a.startsWith('--'))`), so a flag value that precedes the URL (e.g. `--output dir <url>`) is misread as the URL. **CONFIRMED real** against the code. **Pre-existing** parser logic — this session only added the MODULE header comment to this file.

**P2 (suggestion): 13** (see §5).

## 5. Per-finding detail

### On this session's deliverables (gate + conformance work)
- P2 `traceability` — `skill-benchmark/score-skill-benchmark.cjs:1303-1316` — the human-readable skill-benchmark report omits advisory signals that the JSON aggregate computes (e.g. recipeMissRate). Real, minor — reporting completeness.
- P2 `correctness` — `shared/scripts/proof_check.py` — the `READY` verdict regex's `\*\*` branch matches any bolded `**READY**` in prose, not only a verdict line. Partially real; the regex is checkbox-aware but the bolded branch is loose. Base proof_check verdict detection (pre-existing).
- P2 `maintainability` — `shared/scripts/numeric_law_check.py` (+ 6 sibling Python gate scripts) — the markdown-cell parsing helpers are duplicated across the 7 Python gate scripts. A DRY suggestion (shared helper module). Observation on the gate family this session built/extended.
- P2 `traceability` — `mode-registry.json` — "prose says all five grandfathered but booleans say false". **REFUTED (false positive)** — `grandfatheredFolderMismatch=False` correctly means "no folder mismatch (flat names preserved)", which is exactly what the prose states; the boolean semantics are consistent.

### On pre-existing design-md-generator backend (not this session's changes)
- P2 `correctness` — `guided-run.ts:73-87` — preflight reports the exact skill-root output path as "safe".
- P2 `security` — `guided-run.ts` — `spawnSync` has no timeout; a hung child blocks the runner.
- P2 `security` — `crawl.ts` — `triggerModals` clicks subscribe/join buttons on production sites.
- P2 `security` — `crawl.ts` — `dismissCookieBanners` uses `querySelectorAll('*')` and suppresses GDPR consent.
- P2 `security` — `crawl.ts` — `isCaptchaPage` misses hCaptcha, Turnstile, Arkose, Datadome, PerimeterX.
- P2 `security` — `extract.ts` — `--extra-urls` entries skip URL normalization.
- P2 `maintainability` — `extract.ts` / `crawl.ts` — duplicated section-header comments.

### On cross-runtime agent config (design agent files)
- P2 `maintainability` — `.opencode/agents/design.md:6-18` — the OpenCode design agent has broader permissions than the Claude/Codex design agents.
- P2 `traceability` — `.opencode/agents/design.md` — frontmatter drift: OpenCode grants WebFetch, Claude omits it.

## 6. Cross-lineage agreement

Both lineages independently flagged two surfaces, raising confidence:
- **guided-run.ts** — codex (parser P1 + preflight P2), glm (spawnSync-no-timeout P2). Strong agreement this pre-existing file has real robustness gaps.
- **agents/design.md** — codex (broader OpenCode permissions), glm (WebFetch frontmatter drift). Agreement on a cross-runtime agent-config inconsistency.

## 7. Verdict

**CONDITIONAL** (strongest-restriction across lineages: no active P0 → not FAIL; ≥1 P1 → CONDITIONAL). The CONDITIONAL is driven by pre-existing code, not this session's deliverables. **For this session's shipped enforcement + conformance work specifically: effectively PASS with minor P2 advisories** (no P0/P1 on it; one refuted false-positive).

## 8. Standing invariants (re-confirmed read-only, post-review)

- `design-command-surface-check.mjs` → STATUS=PASS drift=0 ✓
- skill-benchmark hubRoute → 34/29/5/0 ✓
- `naming_doc_check.py` (token_starter.md) → exit 0 ✓
- evergreen → 0 leaks ✓

## 9. Remediation pointers

- The P1 (guided-run.ts arg parsing) and the guided-run/crawl/extract P2s are **pre-existing** robustness/security gaps in the md-generator backend — worth a scoped `/speckit:plan` remediation if that backend is on the active path, but out of scope of the work this review was meant to validate.
- On this session's work: the only actionable items are advisory P2s — surface advisory signals in the human skill-benchmark report, tighten the proof_check READY regex to a verdict-line anchor, and optionally extract the shared markdown-cell helper across the Python gate scripts. None block; none change behavior.
- The `mode-registry.json` "grandfathered" finding is refuted — no action.

_Lineage packets: `review/lineages/codex/` and `review/lineages/glm/` (each with its own review-report.md, findings-registry, iteration files)._
