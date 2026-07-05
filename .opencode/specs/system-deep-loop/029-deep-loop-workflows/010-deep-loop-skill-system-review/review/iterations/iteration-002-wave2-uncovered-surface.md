# Iteration 002 — Wave 2: uncovered-surface review (152 per-phase tree / 155 fidelity / 153 installers)

Three claude2-opus seats on the genuinely-uncovered surface. Result: **1 P1, 8 P2** — the uncovered surface had real teeth (this wave moved the review off "converged"). 6 fixed this session, 3 flagged for operator decision.

## Confirmed clean (load-bearing, by the seats)
- 152: registry↔reality (5 packets match packetSkillName; 4 runtimeLoopTypes match convergence.cjs:300; loopHostModes match loop-host.cjs:45); one hub graph-metadata.json; MCP-free boundary holds (shared/ re-exports use only node:fs/path).
- 155: core pattern faithfully implemented — `/doctor:parent-skill` validator exit 0, drift-guard genuinely asserts maps==registry, ADR amended, benchmark shipped.

## Findings + disposition

- **W2-001 [P1, 152tree → FIXED]** parent `152/spec.md` claimed EPIC COMPLETE / 100% / all 9 phases Complete while `009` (which this session reconciled) says 6/18 P0 with 12 gates unrun — a parent↔child contradiction on the resume source-of-truth. **Fix:** reconciled the parent headline to "Merged & functional (351 runtime tests); formal per-phase gate sign-off pending", completion_pct 100→90, recent_action/next_safe_action reworded, Phase Map row 9 → "Partial — 6/18 P0". `validate.sh --strict` PASSED.
- **155F-1 [P2 → FIXED]** `003/spec.md` still cited `/create:parent-skill` + a non-existent `parent-skill.md` key_file (impl-summary was fixed earlier, spec missed). Repointed both to `sk-skill-parent`. 0 stale refs remain; `--strict` PASSED.
- **155F-3 [P2 → FIXED]** `sk-skill-parent.md:38` advisorRouting field list omitted `legacyAdvisorId` (the projection-map key). Added it.
- **155F-2 [P2 → DOC-FIXED + code flagged]** `/doctor:parent-skill` check 4a hardcodes the canonical drift-guard path → passes vacuously for any non-canonical parent skill. Documented the single-parent limitation in `parent_skills_nested_packets.md` (matches the advisor-investigation finding); the 4a target-aware code change is flagged.
- **153 W2-001 [P2 → FIXED]** `mcp-code-mode/install.sh` wiped `~/.npm/_npx/*` even under `--dry-run`. Guarded the rm behind `DRY_RUN`; dry-run now logs the would-do. `bash -n` OK.
- **153 W2-002 [P2 → FIXED]** `mcp-open-design/doctor.sh` shelled `claude mcp list` (health-checks every approved MCP server), violating the read-only/no-network contract. Replaced with a local `~/.claude.json` config read. `bash -n` OK; `~/.claude.json` confirmed present.

## Flagged for operator (not unilaterally resolved)
- **152 W2-002 [P2]** phase-007 R1 (MUST: one consolidated feature_catalog/manual_testing_playbook root) was never implemented — 5 per-mode trees ship with no recorded decision, and parent marks 007 "Complete" while `007/spec.md` is "Planned (scaffold)". **Decision needed:** implement R1, or record a decision-record amendment ("per-packet governance supersedes R1; per-mode trees intentional") + reconcile the 007 row.
- **153 W2-003 [P2]** the uniform install/doctor surface declares no mutation-class per script and has zero CI enforcement (drift-silent; W2-002 proves it already drifted). **Follow-up:** add a mutation-class manifest field + a sandbox CI check.
- **Full 009 sign-off:** the remaining 10 P0 gates (byte-parity replay CHK-065, strict-validation CHK-066, skill-graph rebuild, advisor/mirror/registry) — the real epic acceptance bar.

## Convergence read (honest)
Wave 2 found a P1 + real safety/contract bugs on the uncovered surface — so the review had NOT fully converged at ~15 seats; the uncovered tree mattered. Effective seats now ~21. The flagged items are decisions/larger work, not fresh defects. Recommend stopping fresh discovery here and routing the 3 flags to the operator.
