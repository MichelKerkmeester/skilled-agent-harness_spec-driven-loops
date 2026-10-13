# Iteration 002 — Security

**Run:** review-i1-g1 · **Session:** 2026-10-13T05:58:44.591Z · **Generation:** 1 · **Scope class:** standard
**Target:** commit `b6eef4ebbb` — "fix(sk-code-opencode): let the drift guards pass after an example surface is removed"
**Dimension under review:** D2 security (core protocols carried: `spec_code`, `checklist_evidence`)

## Dimension

Security of the two drift guards and the collateral the commit ships: how they handle paths and arguments (`--root`, `--checks`), what they do with symlinks, the single subprocess they spawn (`git check-ignore`), whether they can write or destroy anything, and how the tests manage temporary paths. Both guards read repository-shaped content (docs, `mode-registry.json`, `leaf-manifest.json`, route-gold) and decide a completion gate, so the security question is whether that content or a crafted tree can steer a guard away from its report or make it read outside its tree. Read-only iteration: no reviewed file was modified.

## Files Reviewed

- `.skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify-router-sync.cjs` — `node:child_process` import `:9`, `git check-ignore` call `:167`, walk predicates `:98-101`, packet-dir filter `:108`, playbook walk `:280-283`, argv parser `parseChecks`.
- `.skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify-doc-claims.cjs` — `--root` validation `:88`, `collectDocs` `:117-122`, `bases`/`insideHub` `:156-172`, containment call sites `:236`, `:243`, `:276`, `:281`, `checkSurfaces` parse `:324`, argv parser `parseArgs`.
- `.skilled/skills/sk-code/sk-code-opencode/scripts/tests/verify-doc-claims.test.cjs` — temp fixture `:48-49`, fixed negative path `:122`.
- `.skilled/skills/sk-code/sk-code-opencode/scripts/tests/verify-router-sync.test.cjs` — temp fixture `:31-32`.
- Release collateral: `.skilled/skills/sk-code/sk-code-opencode/SKILL.md:5` and `.hermes/skills/sk-code-opencode/SKILL.md:5` (version parity), `assets/scripts/README.md` and `changelog/v1.2.4.0.md` via the commit diff.
- Phase specs: `tasks.md:136` and `tasks.md:147` security checklist rows; `spec.md`, `plan.md`, `acceptance-criteria.md`, `goal.md` scanned for security claims.

## Findings by Severity

### P0

None.

### P1

None.

### P2

#### R2-P2-001 [P2] Symlinked docs and packet directories escape the walk-based guard checks while existence checks follow them

- **Case:** a routable `.md` placed under a scanned `references/` or `assets/` tree as a symlink (or a whole packet directory delivered as a symlink). `fs.readdirSync(..., { withFileTypes: true })` reports `isFile()` and `isDirectory()` as false for symlink entries, so `collectDocs` in the doc-claims guard never collects the doc [SOURCE: .skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify-doc-claims.cjs:122], the router-sync orphan walk never visits it [SOURCE: .skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify-router-sync.cjs:101], and a symlinked packet directory is filtered out of every packet walk [SOURCE: .skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify-router-sync.cjs:108]. The other legs use `fs.existsSync`, which does follow links, so surface discovery and doc discovery disagree about the same tree.
- **Evidence:** no `isSymbolicLink` or `realpath` handling exists anywhere in either guard (exact search over both scripts returns only the dirent predicates above and the lexical `insideHub` check). A local Node experiment over a scratch tree printed `isFile=false isDir=false isSym=true` for both a symlinked file and a symlinked directory. The doc-claims guard documents the skip as mirror-avoidance ("each one mirrors a canonical file the walk already reads"); the router-sync walk carries no such justification.
- **Counterevidence sought:** could a symlinked doc still be caught by another leg? Leg 1a only checks paths the routers name, and `checkPaths` only checks references that appear inside other docs; an unreferenced symlinked doc has no other net, so the evasion holds.
- **Alternative explanation:** skipping symlinks may be a deliberate choice to avoid escaping the hub through links. If so, the missing piece is not "follow them" but "detect and report them" — the silent skip is still the gap.
- **User impact:** the leg 1b contract ("every routable reference or asset doc is routed") and the paths check can be evaded with a symlink, so drift escapes the completion gate. Planting the link needs repository write access and the canonical target is usually walked anyway, so the practical consequence is a silently untracked duplicate rather than a privilege gain — hence P2, not P1.
- **Finding class:** class-of-bug (the same dirent predicate appears at three enumeration sites across two guards).
- **Scope proof:** exact search for the dirent predicates over both guards shows the enumeration sites (`verify-router-sync.cjs:100-101`, `:108`, `:282-283`; `verify-doc-claims.cjs:120`, `:122`) and zero symlink handling; the existence filter uses `fs.existsSync` [SOURCE: .skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify-router-sync.cjs:32], which follows links.
- **Affected surface hints:** ["doc-claims walk", "router-sync orphan walk", "surface existence filter"]
- **riskScore:** 3 (advisory only)
- **Recommendation:** pick one symlink policy and apply it in both guards — follow links with a cycle guard, or detect symlinked `.md`/packet entries and report them as drift; if links are followed, resolve `realpath` before the `insideHub` containment test [SOURCE: .skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify-doc-claims.cjs:167].
- **Confidence:** medium-high on behavior, medium on practical exploitability.
- **Downgrade trigger:** a documented decision plus a test asserting symlinked docs are intentionally outside the routable corpus.

### Carried advisories (no new security angle)

- **R1-P2-001** — unguarded `JSON.parse` of `mode-registry.json` [SOURCE: .skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify-doc-claims.cjs:324] takes the `surfaces` check down before it can report. From the security side this is self-denial of the gate report, not a crossed privilege boundary; remediation stays with the open finding.
- **R1-P2-002** — the surface-count vocabulary starts at `two`, so stale singular wording survives. No security angle.

## Traceability Checks

| Protocol | Status | Note |
|----------|--------|------|
| `spec_code` (core) | partial | Unchanged since iteration 1 (the `spec.md:86-95` Files to Change list omits `assets/scripts/README.md`). Security lens: `spec.md` and `acceptance-criteria.md` carry no security requirement to trace against; the packet's only security rows are checklist items CHK-030/CHK-FIX-004 [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/003-example-tolerant-drift-guards/tasks.md:147], unchecked. |
| `checklist_evidence` (core) | pending | Security checklist rows at `tasks.md:144-150` unchecked, AC rows Unmet — the expected pre-T012 state. |
| overlay protocols | pending | D3 traceability owns `skill_agent`, `agent_cross_runtime`, `feature_catalog_code`, `playbook_capability`. |

## Security Search Ledger (summary)

| ID | Bug class | Disposition | Evidence |
|----|-----------|-------------|----------|
| SL-007 | command_injection | ruled_out | the only subprocess is array-form `spawnSync('git', [...])` with a fixed `-C` root and NUL-delimited stdin [SOURCE: .skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify-router-sync.cjs:167]; no shell, eval, exec or system call in either guard |
| SL-008 | symlink_handling | finding → R2-P2-001 | walk predicates [SOURCE: .skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify-router-sync.cjs:101], [SOURCE: .skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify-doc-claims.cjs:122]; zero `isSymbolicLink`/`realpath` handling |
| SL-009 | path_traversal | ruled_out | references resolve through `path.resolve` plus lexical `insideHub` [SOURCE: .skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify-doc-claims.cjs:167]; `--root` is operator-controlled and validated as a directory [SOURCE: .skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify-doc-claims.cjs:88]; the symlink read-through caveat lives inside R2-P2-001 |
| SL-010 | destructive_side_effects | ruled_out | no write/rm/rename/mkdir call in either guard; the one subprocess is a read-only `git check-ignore` |
| SL-011 | uncaught_error_on_malformed_input | deferred | already open as R1-P2-001; the security lens adds no new remediation |
| SL-012 | temp_path_tampering | ruled_out | per-run `mkdtempSync` fixtures [SOURCE: .skilled/skills/sk-code/sk-code-opencode/scripts/tests/verify-router-sync.test.cjs:31], [SOURCE: .skilled/skills/sk-code/sk-code-opencode/scripts/tests/verify-doc-claims.test.cjs:48]; the one fixed path [SOURCE: .skilled/skills/sk-code/sk-code-opencode/scripts/tests/verify-doc-claims.test.cjs:122] is a negative fixture that is never created or read |
| SL-013 | secrets_handling | not_applicable | neither guard reads environment variables, credentials or network resources; full-file read of both scripts |

## Release Collateral Notes

- `.hermes/skills/sk-code-opencode` is a real directory (not a symlink) and its `SKILL.md:5` version matches the canonical copy (`1.2.4.0`), so the Hermes runtime has no divergent instruction surface.
- `verify-router-sync.cjs:9` requires `node:child_process` for the single read-only `git check-ignore` call; no other external execution exists in either guard.

## Scope Violations

None. All writes are confined to this review run directory.

## Verdict

PASS with advisories (`hasAdvisories=true`). No P0 or P1 security findings. One new P2: symlink handling is inconsistent between the enumeration walks (which silently skip links) and the existence checks (which follow them), evidenced on the tree and by a dirent experiment. The two carried P2s from iteration 1 retain no new security angle. The guards handle arguments defensively, spawn exactly one read-only array-form subprocess, contain `..` traversal lexically, and write nothing.

## Next Dimension

Traceability (D3): core `spec_code` and `checklist_evidence` closure plus the overlay protocols; maintainability (D4) follows unless D3 exposes more.

Review verdict: PASS
