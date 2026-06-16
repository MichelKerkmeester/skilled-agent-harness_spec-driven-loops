# Seat opus-advisor-daemon — iteration 3 (global #14)

- Model: `claude-opus-4-8` · Executor: claude · Angle: opus-advisor-daemon
- Verdict: **PASS** · Findings: P0=0 P1=0 P2=1

## Analysis

## Review: Advisor provenance guard (`apply-graph-metadata-patch.ts`)

**Angle:** Does `applyEnhanceEdge` correctly prevent automated overwrite of manually-maintained edges?

### Core guard — verified CORRECT

I traced the full write path. For the **only production write intent** (`'automated'`, hardcoded at `propagate-enhances.ts:71`), the control flow is:

- `applyEnhanceEdge` (lines 83–89): `if (existingEdge && writeIntent === 'automated')` → **always returns `applied: false`**. If the existing edge's `source_kind` is `manual`/`trusted` it returns `"manual provenance protected"`; otherwise `"edge already exists"`. It never reaches the update block (91–97) or a push-over-existing.

This means automated propagation **never overwrites any existing edge** — manual, trusted, *or* legacy (no `source_kind`). That is stronger than the stated requirement and closes the manual-overwrite hole completely. The three guard tests (`preserves manual provenance on automated reruns`, `tolerates legacy edges without source provenance`, `derives automated provenance…`) confirm this behavior, and `index.ts:60-70` applies candidates sequentially (`await` per item), so no in-process write race on the read-modify-write.

The trust gating is also sound: `propagate-enhances.ts:45-50` requires a trusted caller only for real applies (`mode==='apply' && dryRun!==true`), and the handler forces `writeIntent: 'automated'` regardless of caller authority — so even a `--trusted` CLI caller cannot escalate the propagate tool into overwriting a protected edge. `deriveSourceKind` cannot be influenced by the candidate payload (the `derives automated provenance` test guards against payload-supplied `source_kind`).

### One latent traceability defect (P2)

The trusted-maintainer **update** branch (`apply-graph-metadata-patch.ts:91-97`) mutates only `weight`, `context`, and `source_kind`. When it upgrades an edge that was previously `automated` (carrying `auto_added_at` / `auto_added_reason` from lines 108-109), those auto-marker fields are **not cleared**. The resulting edge claims `source_kind: "trusted"` while still carrying `auto_added_reason: "family-inference:…"`, producing contradictory provenance. This path is exported and advertised by the changelog ("trusted-maintainer server writes… stamp `source_kind: trusted`"), though currently reachable only via the direct API / tests (no wired production caller passes `'trusted-maintainer'`). Non-blocking; flagged for provenance integrity.

I did **not** flag the absence of a wired `trusted-maintainer` caller as a defect: `changelog…003-002-002` line 32 explicitly documents that `skill_graph_propagate_enhances` *forces automated intent*, so the propagate-is-automated-only behavior is an intended, disclosed design choice.

```json
{"seat":"opus-advisor-daemon","model":"claude-opus-4-8","angle":"Advisor provenance guard: does apply-graph-metadata-patch correctly prevent automated overwrite of manual edges.","verdict":"PASS","summary":"Core guard correct: automated writes never overwrite ANY existing edge (manual/trusted/legacy); trust gating sound. One latent P2: trusted-update path leaves stale auto_added markers.","files_reviewed":[".opencode/skills/system-skill-advisor/mcp_server/lib/cross-skill-edges/apply-graph-metadata-patch.ts",".opencode/skills/system-skill-advisor/mcp_server/lib/cross-skill-edges/types.ts",".opencode/skills/system-skill-advisor/mcp_server/lib/cross-skill-edges/metadata-loader.ts",".opencode/skills/system-skill-advisor/mcp_server/lib/cross-skill-edges/index.ts",".opencode/skills/system-skill-advisor/mcp_server/handlers/skill-graph/propagate-enhances.ts",".opencode/skills/system-skill-advisor/mcp_server/tools/skill-graph-tools.ts",".opencode/skills/system-skill-advisor/mcp_server/skill-advisor-cli.ts",".opencode/skills/system-skill-advisor/mcp_server/tests/cross-skill-edges.vitest.ts",".opencode/specs/system-spec-kit/027-xce-research-based-refinement/changelog/003-advisor-and-codegraph/changelog-003-002-002-advisor-provenance-guard.md"],"findings":[{"severity":"P2","dimension":"traceability","title":"Trusted-maintainer update relabels edge 'trusted' but leaves stale automated markers","file":".opencode/skills/system-skill-advisor/mcp_server/lib/cross-skill-edges/apply-graph-metadata-patch.ts:91","evidence":"The existingEdge update block sets only weight, context, and source_kind='trusted' (lines 92-94). It never deletes auto_added_at / auto_added_reason that an earlier automated write added at lines 108-109. Upgrading a previously-automated edge yields {source_kind:'trusted', auto_added_reason:'family-inference:...'} — contradictory provenance.","why":"Provenance metadata becomes self-inconsistent: an edge marked trusted still carries an automated-origin reason/timestamp, defeating the purpose of the source_kind audit trail. The function is exported and the changelog advertises trusted-maintainer writes as a real capability, so this is a latent contract defect (currently exercised only by tests / direct API; no production caller passes 'trusted-maintainer').","recommendation":"In the trusted update branch, delete existingEdge.auto_added_at and existingEdge.auto_added_reason when stamping source_kind='trusted' (and conversely never carry them on trusted writes), so provenance fields stay mutually consistent."}]}
```
