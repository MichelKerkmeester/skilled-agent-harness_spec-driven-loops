# Deep Review Report — opus-claude2 lineage

> Fan-out lineage: `opus-claude2` (executor cli-claude-code, model claude-opus-4-8). Target: spec folder `skilled-agent-orchestration/150-open-design-terminal-and-interface-integration` (phase parent + 8 child phases). Independent review; sibling lineage findings re-verified, not inherited.

## 1. Executive Summary

- **Verdict**: **CONDITIONAL**
- **hasAdvisories**: true
- **Active findings**: P0 = 0, P1 = 1, P2 = 6
- **Dimension coverage**: 4/4 (correctness, security, traceability, maintainability)
- **Stop reason**: converged (5 iterations; all legal-stop gates green; new-findings ratio decayed to 0.00 over a stabilization pass)
- **Release-readiness state**: converged

The packet's shipped work is in good shape. The headline objectives are genuinely met: `mcp-open-design` documents a live-verified, internally consistent terminal control surface for the Open Design app; `sk-design-interface` is **cleanly de-vendored to Apache-2.0 only** with no residual MIT/ui-ux-pro-max material on disk (the original legal driver); and the `mcp-magicpath` deprecation swept every live markdown/metadata reference and correctly marked spec 147 superseded. The single P1 is a disclosed, deliberately-deferred runtime artifact: the deleted `mcp-magicpath` skill still exists in the skill-advisor's `skill-graph.sqlite`, so the advisor can route to a skill whose files are gone. The six P2s are documentation-consistency and contract-clarity advisories.

## 2. Planning Trigger

The CONDITIONAL verdict routes to `/speckit:plan` for a small remediation packet. The dominant driver is F005 (advisor-DB drift), which the team already tracks as deferred maintenance (`008/implementation-summary.md:100,124`; parent `spec.md:16`). If the operator confirms the skill-advisor rescan is an accepted out-of-scope follow-on, F005 downgrades to P2 and the verdict moves to PASS-with-advisories. The P2 set is a low-effort doc-hygiene cleanup that can ride the same packet.

## 3. Active Finding Registry

| ID | Sev | Category | Location | Summary |
|----|-----|----------|----------|---------|
| F005 | P1 | traceability | `system-skill-advisor/.../skill-graph.sqlite` | Deleted `mcp-magicpath` skill persists in the runtime advisor DB (12 occurrences vs 0 files on disk); `advisor_recommend` can surface a skill that no longer exists. **Disclosed + deliberately deferred** (Known Limitation 1; Key Decision to defer the sqlite rescan). Remediation: run the advisor skill-graph rescan. Confidence 0.78; downgrades to P2 if the deferral is accepted as out-of-scope. |
| F001 | P2 | correctness | `mcp-open-design/SKILL.md:116` | `DESIGN_INTENTS = {"READ","RUN"}` declared but never referenced in `route_open_design_resources()`; the mandatory cross-skill sk-design-interface load (ALWAYS rule 5) is unexpressed in the routing pseudocode. |
| F002 | P2 | correctness | `mcp-open-design/references/mcp_wiring.md:65` | Daemon-down install fallback (`{command:"od",...}`) asserted as known behavior in `mcp_wiring.md` but listed as needs-live-verification in `od_cli_reference.md:244` item 8 — contradictory confidence between two references in the same skill. |
| F003 | P2 | correctness | `mcp-open-design/references/mcp_wiring.md:60` | §2 emphasizes `command[0]` is the Helper binary "(NOT `Contents/MacOS/Open Design`)" while §5 manual fallback uses exactly `Contents/MacOS/Open Design` as `command[0]`, with no note reconciling the apparent contradiction (both are in fact valid for their distinct contexts). |
| F004 | P2 | security | `mcp-open-design/references/od_cli_reference.md:131` | No safe-handling directive (env-not-argv, no-logging) for the `OD_TOOL_TOKEN` bearer when a user sets it for standalone `od tools` use; the credential guidance only covers cloud `vela` auth. Bounded exposure (loopback + same-origin 403). |
| F006 | P2 | maintainability | `mcp-open-design/SKILL.md:9`, `sk-design-interface/SKILL.md:5` | Frontmatter `version` is 3-part (`1.2.0`, `1.3.0`) vs the 4-part library convention and the skills' own 4-part changelog filenames (`v1.2.0.0.md`, `v1.3.0.0.md`). `sk-prompt` (`2.3.0.0`) is conformant. |
| F007 | P2 | maintainability | `sk-design-interface/SKILL.md:192` | Build/hand-off contract is internally ambiguous: STEP 3/4 + `allowed-tools` imply this skill builds, while §7 says sk-code owns implementation. The least-privilege/seam question is undefined. |

## 4. Remediation Workstreams

1. **Advisor graph integrity (F005)** — run the skill-advisor `skill_graph_scan` rescan to drop the `mcp-magicpath` node + edges, then confirm `advisor_recommend` no longer surfaces it. (Or formally accept the deferral and re-tier to P2.)
2. **mcp-open-design reference reconciliation (F001, F002, F003)** — add the cross-skill load to the router pseudocode (or annotate it as illustrative); align the daemon-down-fallback confidence tag between the two references; add a one-line note reconciling the `command[0]` install-info value vs the manual-fallback value.
3. **Hardening + convention hygiene (F004, F006, F007)** — add a one-line `OD_TOOL_TOKEN` safe-handling directive; normalize the two design skills' frontmatter versions to 4-part; add a one-line build/hand-off scope statement to sk-design-interface.

## 5. Spec Seed

> Minimal spec delta for the remediation packet.

**Problem**: After the 150 packet shipped, the skill-advisor runtime graph (`skill-graph.sqlite`) still contains the deleted `mcp-magicpath` skill, and a handful of documentation-consistency defects remain across the mcp-open-design references and the two design skills' frontmatter.
**Scope (in)**: advisor graph rescan; mcp-open-design reference reconciliation (F001-F003); token-handling + version-format + contract-clarity cleanups (F004, F006, F007).
**Scope (out)**: any behavioral change to the skills; the Open Design app; historical changelog content.
**Done when**: advisor no longer routes to mcp-magicpath; the cited reference contradictions are resolved; frontmatter versions are 4-part.

## 6. Plan Seed

1. Run advisor `skill_graph_scan`; verify `advisor_recommend "drive open design"` surfaces mcp-open-design and never mcp-magicpath. (F005)
2. Edit `mcp-open-design/SKILL.md` router block — reference `DESIGN_INTENTS` or annotate pseudocode as illustrative. (F001)
3. Edit `mcp_wiring.md` — align the daemon-down fallback confidence tag with `od_cli_reference.md` item 8; add the `command[0]` reconciliation note. (F002, F003)
4. Edit `od_cli_reference.md:131` — add `OD_TOOL_TOKEN` safe-handling line. (F004)
5. Bump `mcp-open-design`/`sk-design-interface` frontmatter to 4-part; add sk-design-interface build/hand-off scope line. (F006, F007)
6. `validate.sh --strict` on the target spec folder; `package_skill.py --check` on the three skills.

## 7. Traceability Status

| Protocol | Level | Status | Evidence |
|----------|-------|--------|----------|
| `spec_code` | core (hard) | **pass** | Phase 006-008 normative claims verified vs shipped state: versions consistent, spec 147 = "Superseded (by spec 150)", mcp-figma repointed to mcp-open-design. The advisor-DB drift is captured as F005. |
| `checklist_evidence` | core (hard) | **pass** | Phase 008 checklist 26/26 `[x]`, 0 unchecked; "no live reference remains" accurate for markdown/metadata scope; sqlite runtime carved out as a Known Limitation. |
| `feature_catalog_code` | overlay (advisory) | pass (spot) | mcp-open-design (5 sections) + sk-design-interface (7 sections) catalogs align with the shipped reference surface. |
| `playbook_capability` | overlay (advisory) | pass | The licensing-and-provenance playbook maps to the verified-clean de-vendor state. |

## 8. Deferred Items

- **F005 remediation** if the operator confirms the advisor rescan is accepted out-of-scope (re-tier to P2 follow-on).
- All P2 advisories (F001-F004, F006, F007) — non-blocking; bundle into the remediation packet.
- Code-graph-assisted re-verification — the code graph was unavailable this session; findings used Grep/Read/sqlite-strings (the sanctioned graphless fallback). A graph-available re-run could add structural cross-checks.

## 9. Audit Appendix

- **Iterations**: 5 (correctness → security → traceability → maintainability → stabilization). One iteration per `iterations/iteration-00N.md`, each ending with the canonical verdict line.
- **Convergence (replay)**: dimension coverage 4/4; both core hard gates executed and passed; new-findings ratio 1.00 → 0.25 → 0.50 (P1 override) → 0.25 → 0.00; all nine legal-stop gates green at iteration 5 (`legal_stop` event). Recomputed decision agrees with the recorded `synthesis_complete` event (verdict CONDITIONAL, activeP1=1).
- **Adversarial replay**: the single P1 (F005) carries a typed claim-adjudication packet; evidence (12 sqlite occurrences, deleted folder, disclosure lines) re-read and confirmed. No P0 to replay.
- **Independent divergence from the sibling deepseek-v4-pro lineage** (the fan-out value): 5 sibling findings re-verified and **rejected** — deepseek-F001 (stale version) resolved in live state; deepseek-F006 (world-readable socket) ruled out on permission analysis; deepseek-F013 (ephemeral ids) not reproducible; deepseek-F014 (dual REFERENCES) is house-template convention; deepseek-F005 (fidelity automation gap) is intentional judgment. This lineage's distinct contribution is **F005** (advisor-DB runtime drift), which the sibling did not surface.
- **Resource map**: not present at the parent level — coverage gate skipped (no `## Resource Map Coverage Gate` section emitted).
- **Continuity save**: `generate-context.js` intentionally NOT run — fan-out lineage scope is confined to this lineage directory; canonical continuity save is the merge orchestrator's responsibility after lineage reconciliation.

---

Review verdict: CONDITIONAL
