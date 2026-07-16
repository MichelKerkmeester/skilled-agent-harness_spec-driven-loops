# Resource Map: Deep-Loop Unification Merge Design Research

Coverage map — what was actually investigated (file-verified) vs. what remains uninvestigated, per subsystem.

## Covered (file-verified, not assumed)

| Subsystem | Investigated by | Confidence |
|---|---|---|
| Structural layout, Class A/B path-repair, `graph-metadata.json` consolidation, established-pattern check | gpt55-fast (10 replicas) + Plan-agent pass 1 | High — independently corroborated by both |
| External reference migration inventory, CI/CD, agent duplicate, prefix-derivation exception | gpt55-fast/glm52 + Plan-agent pass 2 | High |
| Advisor routing corpus: `MERGED_DEEP_SKILL_ID`, divergence ratchet, codegen ordering, baseline scoring | glm52 (5 replicas, max effort) + Plan-agent pass 3 | High — includes a live-run confirmation (`score-routing-corpus.py`'s own broken import) |
| `system-spec-kit` tooling-borrow, real `npm test`/`test:council` baselines | Plan-agent pass 4 (ran the actual test suites, not simulated) | High — direct command output evidence |
| `fallback-router.ts` wiring feasibility + whole-packet risk synthesis | Plan-agent pass 5 | High — includes a decisive live-evidence check (glm52's own real run never needed the fallback) |
| Fan-out mechanism's own spec.md write-back boundary gap | 3 independent replicas (gpt55-fast-2, glm52-4, glm52-5), cross-model corroborated | High, but scoped to "did not cause harm this run" — not a full audit of the mechanism |

## Not covered / explicitly out of scope for this research phase

- Phase 004's real implementation (fallback-router wiring) — deliberately deferred, not designed in detail.
- A full audit of `deep_research_auto.yaml`'s fan-out boundary gap beyond this run's own evidence (§8 of research.md) — flagged as a future hardening item outside this merge packet.
- Live verification of any fix in this research phase — this phase is read-only; the fixes are unapplied recommendations, verified against 002/003's plan.md text, not against edited source.
- `.worktrees/**` (17 live checkouts) — explicitly out of scope per the original plan design, not re-litigated here.

## Known correlated-failure note

All 5 `sonnet5` (`cli-claude-code`) replicas failed for the identical root cause (macOS Keychain auth gap in headless dispatch) — this is a single infrastructure failure, not 5 independent data points. Treat the 5 substitute Plan-agent passes as the actual independent-verification signal for that slice of coverage, not as "5x redundant confirmation" of anything the gpt55-fast/glm52 lineages also touched.
