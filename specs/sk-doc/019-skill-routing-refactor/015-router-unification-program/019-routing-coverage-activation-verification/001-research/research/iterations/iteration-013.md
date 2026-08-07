# Iteration 13 — gpt-5.6-sol high — focus: unnamed

Headline: the continuity stack is routing-blind. Stop/save/resume preserves task state, but neither records nor live-checks compiled-router serving authority. Persisting that authority in memory would become stale; the correct fix is a live status surface during bootstrap/resume plus decision-time operational telemetry.

Verified claims:

- `SessionSnapshot.routingRecommendation` sounds like skill routing, but it is assembled exclusively from code-graph freshness and a Grep recommendation (`.opencode/skills/system-spec-kit/mcp-server/lib/session/session-snapshot.ts:161`, `.opencode/skills/system-spec-kit/mcp-server/lib/session/session-snapshot.ts:166`). Its declared snapshot fields contain no skill-router authority or rollout state (`.opencode/skills/system-spec-kit/mcp-server/lib/session/session-snapshot.ts:26`).
- `session_bootstrap` exposes resume, cached continuity, structural context, and skill-graph topology (`.opencode/skills/system-spec-kit/mcp-server/handlers/session-bootstrap.ts:349`, `.opencode/skills/system-spec-kit/mcp-server/handlers/session-bootstrap.ts:399`). It deliberately keeps advisory routing guidance out of recovery actions (`.opencode/skills/system-spec-kit/mcp-server/handlers/session-bootstrap.ts:459`), leaving no field for effective compiled/legacy authority.
- Resume may stop as soon as a safe next action plus two task essentials are known (`.opencode/commands/speckit/assets/speckit-resume-auto.yaml:108`, `.opencode/commands/speckit/assets/speckit-resume-auto.yaml:110`). Its output contract is limited to task continuity—now, last, next, blockers, artifact—and omits runtime routing posture (`.opencode/commands/speckit/assets/speckit-resume-auto.yaml:167`). A router-cutover packet can therefore resume without checking whether the daemon observes the current flag/default/cohort.
- The Stop-hook autosave emits a generic session observation into `generate-context.js` (`.opencode/skills/system-spec-kit/mcp-server/hooks/claude/session-stop.ts:124`), while canonical save execution routes collected session data into the normal workflow (`.opencode/skills/system-spec-kit/scripts/dist/memory/generate-context.js:775`). This is unsuitable for authoritative serving status because persisted runtime state can outlive a daemon restart or flag change.
- Startup/resume priming directs the model back to `memory_context` based on the last spec folder (`.opencode/skills/system-spec-kit/mcp-server/hooks/claude/session-prime.ts:292`); it does not require a live router-status probe before work resumes.

Ranked recommendations:

1. Add a read-only, live `skillRouterStatus` section to `session_bootstrap`, reporting flag/default source, daemon-observed value, hub cohort, manifest authority, effective authority, and fallback cause per eligible hub.
2. For compiled-routing packets and P4 operations, place that probe after canonical packet recovery but before the resume sufficiency early-exit. Never restore effective serving authority from saved continuity.
3. Rename `SessionSnapshot.routingRecommendation` to `codeSearchRecommendation`, then reserve a distinct typed field for skill-router status.
4. Record compiled/legacy decisions at advisor decision time in bounded operational telemetry. The Stop hook may flush that telemetry, but should not manufacture or persist a fresh authority claim through `generate-context.js`.
5. Render the same live status in startup/session-prime output so daemon restarts and environment propagation failures are visible before the first routed prompt.

===FINDINGS-JSON-START===
[
  {"id":"F-13-1","area":"unnamed","finding":"SessionSnapshot.routingRecommendation is actually code-search guidance and has no skill-router authority state, creating a misleading field collision during cutover.","evidence":".opencode/skills/system-spec-kit/mcp-server/lib/session/session-snapshot.ts:161","severity":"P1","actionable":"Rename it to codeSearchRecommendation and add a separate typed skillRouterStatus field.","novelty":"new"},
  {"id":"F-13-2","area":"activation","finding":"session_bootstrap exposes skill-graph topology but no live per-hub compiled-versus-legacy serving status.","evidence":".opencode/skills/system-spec-kit/mcp-server/handlers/session-bootstrap.ts:399","severity":"P1","actionable":"Add a live skillRouterStatus payload section with flag source, daemon-observed value, cohort, manifest authority, effective authority, and fallback cause.","novelty":"refines:F-3-6"},
  {"id":"F-13-3","area":"unnamed","finding":"The resume workflow may declare context sufficient before probing the current routing posture because its early-stop contract only requires task-continuity essentials.","evidence":".opencode/commands/speckit/assets/speckit-resume-auto.yaml:110","severity":"P1","actionable":"For router-cutover packets and P4 actions, require a live router-status probe after packet recovery and before the sufficiency early-exit.","novelty":"new"},
  {"id":"F-13-4","area":"unnamed","finding":"Stop-hook autosave sends generic continuity observations through generate-context rather than preserving decision-time compiled-routing evidence.","evidence":".opencode/skills/system-spec-kit/mcp-server/hooks/claude/session-stop.ts:124","severity":"P1","actionable":"Emit bounded route telemetry when advisor decisions occur and let Stop flush it separately; do not store effective runtime authority as canonical continuity.","novelty":"new"},
  {"id":"F-13-5","area":"unnamed","finding":"Session priming restores the last packet through memory_context without first surfacing whether the restarted runtime is compiled-serving or legacy-serving.","evidence":".opencode/skills/system-spec-kit/mcp-server/hooks/claude/session-prime.ts:292","severity":"P2","actionable":"Include the live session_bootstrap skillRouterStatus section in startup and resume prime output.","novelty":"new"}
]
===FINDINGS-JSON-END===

