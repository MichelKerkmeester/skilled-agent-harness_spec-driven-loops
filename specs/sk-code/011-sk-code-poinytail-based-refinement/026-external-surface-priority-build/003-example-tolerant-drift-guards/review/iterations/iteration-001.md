# Iteration 001 — Correctness

**Run:** review-i1-g1 · **Session:** 2026-10-13T05:58:44.591Z · **Generation:** 1 · **Scope class:** standard
**Target:** commit `b6eef4ebbb` — "fix(sk-code-opencode): let the drift guards pass after an example surface is removed"
**Dimension under review:** D1 correctness (core protocols: `spec_code`, `checklist_evidence`)

## Dimension

Correctness of the four guard changes, their four tests, the release collateral, and the phase spec docs. The review was read-only: no reviewed file was modified. Security, dedicated traceability and maintainability iterations remain; the core traceability protocols were checked here as required.

## Files Reviewed

- `.skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify-router-sync.cjs` — full read (375 lines); changed hunks: existence filter `31-34`, leg 1a prose anchor `126-140`, leg 3 archived-gold skip `247-259`.
- `.skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify-doc-claims.cjs` — full read (410 lines); changed hunks: count vocabulary `42-46`, allowlist row `66-72`, `checkSurfaces` `320-338`.
- `.skilled/skills/sk-code/sk-code-opencode/scripts/tests/verify-router-sync.test.cjs` — full read (180 lines); new tests `134-180`.
- `.skilled/skills/sk-code/sk-code-opencode/scripts/tests/verify-doc-claims.test.cjs` — full read (239 lines); new test `227-238`.
- Release collateral: `assets/scripts/README.md` (row/version change), both `SKILL.md` copies (version `1.2.4.0`), `changelog/v1.2.4.0.md`.
- Phase specs: `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, `goal.md`.
- Supporting reads: `leaf-resource-contract.cjs:435-461`, `ROUTER.md:107-130` and its heading list, `mode-registry.json`, `leaf-manifest.json`, archived `route-gold.typed.json`, `run-all-drift-guards.sh`, `agent-authoring.md:43`.

## Findings by Severity

### P0

None.

### P1

None.

### P2

#### R1-P2-001 [P2] Malformed `mode-registry.json` crashes the `surfaces` check before it can report

- **Case:** `--root <hub>` where `mode-registry.json` exists but is not valid JSON (truncated write, trailing comma). `checkSurfaces` calls `JSON.parse` at [SOURCE: .skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify-doc-claims.cjs:324]; `main` runs every check with no containment [SOURCE: .skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify-doc-claims.cjs:396], so the process dies with a raw `SyntaxError` stack. No `FAIL check surfaces` line and no `doc-claims: N/4` summary is printed.
- **Evidence:** parse at `verify-doc-claims.cjs:322-324`, unguarded call chain at `:396-404`; the sibling guard wraps every leg in try/catch at [SOURCE: .skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify-router-sync.cjs:357].
- **User impact:** the completion gate still fails — `run-all-drift-guards.sh` runs the guard under `set -o pipefail`, so a non-zero exit lands in the wrapper's `FAIL: doc-claims` branch — but the operator loses the named check, the problem line and the fix hint, and the guard's documented one-line-per-check report is violated.
- **Finding class:** class-of-bug (single parse site).
- **Scope proof:** `rg -n "JSON.parse" verify-doc-claims.cjs` shows this is the script's only `JSON.parse`; every `verify-router-sync.cjs` parse sits inside the per-leg try/catch.
- **Recommendation:** wrap the registry read in try/catch returning a problem string (mirroring `checkTiers`' "ROUTER.md not found" pattern), or move the per-check invocation into a try/catch in `main`.
- **Confidence:** high.

#### R1-P2-002 [P2] Count check cannot flag stale one-surface wording

- **Case:** a hub whose registry declares three surfaces and whose docs say "one surface" or "a single surface" passes the `surfaces` check: the wording is never matched, so it is never compared with the declared count.
- **Evidence:** `COUNT_WORDS` covers `two`..`ten` [SOURCE: .skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify-doc-claims.cjs:45]; both patterns require one of those words or "both" [SOURCE: .skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify-doc-claims.cjs:46]. No `one`/`single`/`1 surface` token exists in the check.
- **User impact:** stale singular wording survives the guard, including in the full-removal copy (both example packets gone) where one-surface prose is the most likely stale claim. REQ-004's two-surface test does not cover it.
- **Finding class:** instance-only.
- **Scope proof:** a hub-wide `grep -niE "\b(one|single) surface"` over the guard and its patterns returns no vocabulary entry; the change generalized 2→10 but not to 1.
- **Recommendation:** add `one` (and optionally `single`) to `COUNT_WORDS` and the alternation; keep the "both supported surfaces" alias for 2.
- **Confidence:** high on behavior, medium on real-world frequency.

## Ruled Out / Accepted Risks

- **Leg 1a first-map anchor** [SOURCE: .skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify-router-sync.cjs:129] — on the pristine `ROUTER.md` the first `## N. <NAME> MAP` heading is `## 4. WEBFLOW MAP` (line 119), the same offset the removed literal anchor used, so pristine output cannot move; T3 covers the no-Webflow-map hub; a hub with no matching heading still fails closed via `start < 0`.
- **Leg 2 on-disk filter** [SOURCE: .skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify-router-sync.cjs:33] — a parent-map path under a dropped packet is not silently accepted: the owner is absent from `SURFACE_PACKETS` and falls to `ownedLeaf`, which fails when the regenerated manifest no longer declares the mode. The absence case is covered by the new test `134-144`.
- **Leg 3 skip breadth** [SOURCE: .skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify-router-sync.cjs:256] — `ORPHAN_WORKFLOW_MODE` covers every undeclared mode, not only archived examples, so a renamed mode with stale gold would be skipped. This is the frozen tradeoff (goal D2; `spec.md` risk row F83 mitigation); a declared mode with a wrong packet still fails through `PACKET_MISMATCH` [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/lib/leaf-resource-contract.cjs:460], covered by the T2 fail case. Recorded as accepted residual risk.
- **Doc-claims allowlist row** — verified live: `agent-authoring.md:43` contains the lowercase substring `mirror it across all three surfaces`, so `isAllowed` matches; the row is not inert.
- **Pristine parity** — no new count-word hits exist in non-skipped docs: `three surfaces` in `sk-code/SKILL.md:40`, `sk-code/README.md:23` and `shared/references/phase-detection.md:16` all equal the registry's three; the only `two surfaces` hits sit inside skipped `changelog/` folders.

## Traceability Checks

| Protocol | Status | Note |
|----------|--------|------|
| `spec_code` (core) | partial | REQ-002/003/004 and decisions D1–D4 map 1:1 to the four hunks and their tests. Gap: `spec.md` "Files to Change" (`spec.md:86-95`) omits `.skilled/skills/sk-code/sk-code-opencode/assets/scripts/README.md`, which the commit changes (frontmatter-version bump plus the `verify-doc-claims.cjs` row rewrite that D4 requires). The `.hermes/skills/sk-code-opencode/SKILL.md` copy is release collateral for D6. |
| `checklist_evidence` (core) | pending | `tasks.md` T001–T012 and the Verification Checklist are unchecked, `acceptance-criteria.md` rows are `Unmet`, and `implementation-summary.md` does not exist yet. That is the expected pre-review state per `tasks.md` T011→T012 (evidence fill follows review); the commit's own run evidence was not re-observable under this iteration's containment. |

## Scope Violations

None. No out-of-scope mutation was planned or attempted; all writes are confined to this review run directory.

## Verdict

PASS with advisories (`hasAdvisories=true`). No P0 or P1 findings; two P2 advisories recorded. The four changes match the frozen decisions, the four tests exercise the changed behavior, and the pristine tree's anchor arithmetic and surface sets are preserved by construction.

## Next Dimension

Security (D2): input and path handling in the two guard scripts (symlink walks, `--root`/`--checks` argument handling, `git check-ignore` invocation) plus the release collateral; carry the two P2 advisories as traced follow-ups.

Review verdict: PASS
