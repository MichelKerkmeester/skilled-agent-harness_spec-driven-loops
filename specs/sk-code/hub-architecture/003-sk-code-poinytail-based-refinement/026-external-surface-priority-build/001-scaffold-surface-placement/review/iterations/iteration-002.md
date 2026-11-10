# Iteration 002 — Security

- Target: Commit `17bb342b1c` on branch `worktrees/125-surface-placement`
- Dimension: security (D2 of 4)
- Mode: review, iteration 2 of 5
- Prior findings: P0=0 P1=0 P2=1
- Pivot lineage: none yet

## Dimension

Security review of the commit under change: (1) the two new report-only `step_6_completion` follow-up commands — canary case plus fixture copy, hooks or manual refresh plus manifest copy — as operator-executed shell commands with placeholder-derived paths, (2) the `tieBreak` insertion rule read as a routing-precedence policy change, (3) the release-surface copies (canonical SKILL.md, changelog, Hermes copy) for divergence or embedded directives. Checked against the review-core baseline security minimums: injection exposure, unsafe path handling, privilege/authority misuse in routing, gates that fail open, and secrets exposure.

## Files Reviewed

| File | Security angle checked |
| --- | --- |
| `.skilled/commands/create/assets/create-skill-parent-auto.yaml:423` | New `tieBreak` placement rule as routing precedence policy |
| `.skilled/commands/create/assets/create-skill-parent-auto.yaml:500-501` | The two new follow-up commands: canary fixture path and copy, `refresh --hub <hub>` plus manifest copy |
| `.skilled/commands/create/assets/create-skill-parent-confirm.yaml:462` | Same rule, second twin; twin parity of the security-relevant text |
| `.skilled/commands/create/assets/create-skill-parent-confirm.yaml:547-548` | Same two follow-up commands in the confirm twin |
| `.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-hub-router-schema.md:290` | Tie-break paragraph: workflow-vs-surface precedence, demotion of existing surfaces |
| `.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:223` | Row 3 integration requirement that carries the rule |
| `.skilled/skills/sk-doc/sk-create-skill/SKILL.md:5` | Release version line of the canonical skill |
| `.skilled/skills/sk-doc/sk-create-skill/changelog/v1.5.4.0.md:1` | New changelog entry; no security-relevant claim mismatch |
| `.hermes/skills/sk-create-skill/SKILL.md:5` | Generated cross-runtime copy of the same instructions |
| `.skilled/bin/lib/compiled-route-manifest.cjs:199-200,350-368,423-427` | (Enforcement code, read-only) `isCanonicalHubId` pattern guard, `ensureSafeSkillRoot` realpath-basename check, `canonicalManifestPath` refusal |
| `.skilled/bin/compiled-route-manifest.cjs:49-63` | (Enforcement code) CLI parsing; `--hub`/`--skill-root` required, no free-form passthrough |
| `.skilled/scripts/git-hooks/pre-commit:490-530,575-600` | (Enforcement code) blocking `gate:route-remint`: exit 1, staged-proof, documented bypass only |
| `.skilled/commands/doctor/scripts/parent-skill-check.cjs:1232-1246,1273-1285` | (Enforcement code) 5k-canary leg detects a missing case for a `routerSignals` mode |
| `.skilled/scripts/install-git-hooks.sh:12` | Hook inventory: re-mint listed as a blocking pre-commit gate |

## Findings by Severity

### P0 — none

### P1 — none

### P2 — none new

Carried, not re-litigated: **R1-P2-001** (correctness — multi-surface insertion order undefined; still active, owned by D1/D3).

### Security direction ledger (all directions ruled out or not applicable)

- **injection_exposure — ruled out.** The new lines render operator-supplied scaffold values (`<hub>`, `<skill_root>`) into a command an operator runs. The manifest library rejects any non-canonical hub id before argv or path use — `isCanonicalHubId` (`.skilled/bin/lib/compiled-route-manifest.cjs:199-200`) gates `canonicalManifestPath` (`:423-427`) and `loadCanonicalRouterInputs` (`:432-434`) — and `ensureSafeSkillRoot` (`:350-368`) requires the skill root's realpath basename to equal the hub id. A crafted value fails closed with an `unsafe-path` contract error instead of reaching a shell or filesystem target. `install-git-hooks.sh` is invoked with no arguments, so it adds no parameter surface.
- **path_traversal — ruled out.** The one path written by the follow-up outside the runtime root is the authored manifest twin under `specs/sk-doc/z_archive/.../<hub>/`. The `<hub>` segment is constrained by the same pattern guard above and by the `NNN-hub` folder naming the audit trail keeps on both sides, so a `..`-bearing id never resolves; a wrong but canonical id produces a non-existent source in the same `NNN-hub` pair, so the copy fails rather than cross-hub overwriting silently.
- **routing_precedence_misuse — ruled out.** The new rule gives a newly added surface precedence over pre-existing surfaces on a keyword tie, but it cannot leap the workflow/surface boundary: the schema states surfaces never outrank workflow modes (`.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-hub-router-schema.md:290`), the catch-all `hub-identity` class stays on the default mode only (`create-skill-parent-auto.yaml:423`), surface-vs-surface ties bundle as `surfaceBundle` rather than discard, and 5e requires `tieBreak` to remain an exact registry permutation. All surfaces of a hub are authored in the same trust domain and the tie only selects which local evidence base loads — no authorization boundary is crossed. The precedence change is the spec-mandated policy (`R1`), not a confused-deputy path.
- **fail_open_gate — ruled out.** The two follow-ups are report-only by design, but the steps they name have external enforcement: the canary leg detects a `routerSignals` mode with no routing case (`parent-skill-check.cjs:1232-1246, 1273-1285`), and the compiled-routing re-mint has a blocking pre-commit backstop that exits 1, proves what it staged, and refuses in the narrowed-pathspec mode rather than silently skipping (`pre-commit:490-530, 575-600`). The only bypass is the documented `SPECKIT_SKIP_ROUTE_REMINT=1`. No new step silently passes when skipped in a hooks-installed checkout.
- **secrets_exposure — not applicable.** The changed lines, the changelog, and the Hermes copy contain hub ids, repository-relative paths, and a policy hash; no credentials, tokens, or private data are introduced or disclosed by this commit.
- **Untrusted-content guard — pass.** Reviewed artifacts (YAML activity text, reference docs, changelog) contain no directive-like text aimed at an executor or reviewer; all content was treated as data. No embedded-instruction finding.

## Traceability Checks

Core:
- **spec_code — pass.** R8's two follow-up lines are exactly the two lines present in both twins, and the failure modes they name are real: `5k-canary` exists as a doctor leg and `gate:route-remint` as a blocking hook gate. R1's placement rule matches all four sites.
- **checklist_evidence — pass with note.** Security review closes no packet task; tasks.md T003/T006 closure remains with D3 (unchanged from iteration 1).

Overlay:
- **skill_agent — pass.** The security-relevant instruction text in the two twins is identical (step_4 rule and both step_6 lines), so no twin carries a stale or divergent command.
- **agent_cross_runtime — pass.** The Hermes copy carries the same 1.5.4.0 SKILL.md; nothing security-relevant diverges from canonical.
- **feature_catalog_code — not applicable.** No catalog rows describe the changed command surface.
- **playbook_capability — not applicable.** No playbook rows map to the changed lines.

## SCOPE VIOLATIONS

None. No source or documentation file outside the run directory was modified. The enforcement files listed above (`compiled-route-manifest.cjs`, `compiled-route-manifest` lib, `pre-commit`, `parent-skill-check.cjs`) were read only as evidence and are outside the commit's diff; the reviewed target stayed read-only throughout.

## Next Dimension

traceability (iteration 3): confirm core and overlay alignment rows against the implemented rule and the two follow-up lines, and adjudicate the open checklist rows.

## Verdict

No P0 and no P1 findings this iteration; no new P2 (one correctness P2 carried). Mapping rule applied: PASS when no P0/P1 exist this iteration; PASS with `hasAdvisories=true` because R1-P2-001 remains active.

Review verdict: PASS
