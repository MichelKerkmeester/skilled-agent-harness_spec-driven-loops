# Review Report — 019 maintenance-grace daemon survives re-election

Fan-out lineage `p019-opus-4` · executor cli-claude-code / claude-opus-4-8 · 1 iteration · stop reason `maxIterations`

---

## 1. Executive Summary

**Verdict: PASS** (`hasAdvisories: true`, release readiness `converged`)

- Active findings: **P0: 0 · P1: 0 · P2: 1**
- Scope: spec folder `019-maintenance-grace-daemon-survives-reelection` — daemon-written `.maintenance-active.json` marker + launcher adopt/refuse-respawn guards at both reap sites.
- All four review dimensions (correctness, security, traceability, maintainability) and both core traceability protocols covered in a single full pass.
- All four requirements (REQ-001..004) resolve to shipped behavior; REQ-004's marker-dir alignment is additionally confirmed by the live marker artifact and the 330s end-to-end reindex.

## 2. Planning Trigger

PASS with one P2 advisory. No remediation is required to ship. The single P2 is a documentation path-drift cleanup; route it to a lightweight doc fix (or fold into the next docs pass) rather than `/speckit:plan`. Follow-on `/create:changelog` is the natural next step for the shipped fix.

## 3. Active Finding Registry

| ID | Sev | Category | Location | Finding |
|----|-----|----------|----------|---------|
| F001 | P2 | traceability / docs-vs-code-drift | `spec.md:117` (and `plan.md`, `tasks.md` "Files to Change") | The two `.cjs` deliverables are cited as `mcp_server/bin/lib/model-server-supervision.cjs` and `mcp_server/bin/mk-spec-memory-launcher.cjs`, but no `mcp_server/bin/` directory exists. The real files are `.opencode/bin/lib/model-server-supervision.cjs` and `.opencode/bin/mk-spec-memory-launcher.cjs`. Handler + test paths are correct. A reader following the spec's path table would not find the files. Non-blocking. |

## 4. Remediation Workstreams

- **Docs accuracy (P2, optional):** correct the three "Files to Change" path references to `.opencode/bin/...` in `spec.md`, `plan.md`, and `tasks.md`. One-line edits each; no code impact.

## 5. Spec Seed

No spec change required for shippability. If the docs-accuracy fix is taken: amend the "Files to Change" tables so the two `.cjs` paths point at `.opencode/bin/`, matching the shipped tree and the predecessor 018 docs.

## 6. Plan Seed

1. Edit `spec.md` §3 "Files to Change" rows for the two `.cjs` files → `.opencode/bin/lib/model-server-supervision.cjs`, `.opencode/bin/mk-spec-memory-launcher.cjs`.
2. Mirror the same correction in `plan.md` "FIX ADDENDUM: AFFECTED SURFACES" and `tasks.md` T003/T004.
3. Re-run `validate.sh <spec-folder> --strict`.

## 7. Traceability Status

| Protocol | Class | Status | Evidence |
|----------|-------|--------|----------|
| `spec_code` | core / hard | PASS | REQ-001 `memory-index.ts:1450-1502`; REQ-002 launcher `:814-825` + `:1685-1694`; REQ-003 predicate fail-safe branches `model-server-supervision.cjs:622-628`; REQ-004 `config.ts:63-94` vs launcher `:329-333` + live marker artifact |
| `checklist_evidence` | core / hard | PASS | implementation-summary Verification table corroborated by commit `7800409646`/`44ab2dbfaf` and on-disk marker |

No overlay protocols apply to a spec-folder target.

## 8. Deferred Items

- **F001 (P2):** docs path drift — deferred to an optional doc fix; does not block ship.
- **Test re-run:** `npx vitest` was blocked by the sandbox permission layer this run; the documented 12/12 unit + 6/6 harness + 330s live results were accepted on commit + artifact evidence. A reviewer with shell access should re-run `tests/launcher-maintenance-guard.vitest.ts` and `stress_test/durability/daemon-reelection-adoption-live.vitest.ts` to independently re-confirm.
- **Out-of-scope follow-ons (already tracked by 020/021):** the marker does not protect the post-scan background-embedding queue; a re-election can still fire during the embedding burst. Noted in Known Limitations and addressed by successor packets — not a finding against 019.

## 9. Audit Appendix

- **Coverage:** 4/4 dimensions, 2/2 core traceability protocols, 6 files read (3 source + 1 config anchor + 2 tests).
- **Replay validation:** single iteration, `newFindingsRatio=0.05`, no P0 → no P0 override; coverage vote 100%; `maxIterations=1` is the legal stop reason. Recomputed verdict (no active P0/P1) matches the recorded `synthesis_complete` event → PASS.
- **Adversarial replay:** no P0 findings to replay. The one P2 is evidence-backed by direct file-existence checks (absence of `mcp_server/bin/`, presence of `.opencode/bin/*`), not inference.
- **Confirmed vs inferred:** code logic, guard placement, exports, DB-dir precedence, and unit-test contents are CONFIRMED by direct read; REQ-004 path alignment is CONFIRMED by the live `.maintenance-active.json` artifact; test-pass + live-reindex numbers are INFERRED from commit/summary evidence (sandbox blocked re-running them).
- **Most-likely-wrong claim:** that the no-override production `DATABASE_DIR` and launcher `resolvedDbDir()` are byte-identical under all symlink layouts — `canonicalizePath` vs `realpathAllowMissing` could differ on an exotic symlinked DB path; the live marker landing in the expected dir is strong evidence they agree in this deployment.
