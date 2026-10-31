# Proposal: /doctor:speckit embeddings

## Verdict

retire

## Evidence

The doctor asks advisor_status for provider resolution and model-server health, but the current CLI command does not provide that contract:

- The route declares advisor_status without a workspace root at .skilled/commands/doctor/_routes.yaml:55-56. The CLI schema requires workspaceRoot at .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli-manifest.ts:77-86.
- The workflow supplies the root but expects data.embeddings.provider and data.embeddings.modelServer fields at .skilled/commands/doctor/assets/doctor-embeddings.yaml:49-52. The strict advisor status output schema contains freshness, generation, trust state, timestamps, skill count, lane weights, optional semantic-lane health, daemon PID, and errors, with no embeddings field at .skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts:319-336. The handler constructs and returns that shape at .skilled/skills/system-skill-advisor/runtime/handlers/advisor-status.ts:317-329,360-370.
- The CLI help output confirms workspaceRoot is required; the direct route-form invocation failed validation with exit 64. The workflow-form invocation reached IPC but the sandbox returned EPERM with exit 75. Both full outputs are in doctor-run.log. The live provider and model-server state remain UNKNOWN.
- The provider fields exist separately through getProviderInfo() at .skilled/skills/system-spec-kit/shared/embeddings/factory.ts:602-619,1128-1130. The model server exposes a separate /api/health payload at .skilled/bin/hf-model-server.cjs:45,838-853. Neither surface is wired into the advisor_status output schema above.
- The route validator passed structural parity and known-command checks, but it did not catch the required-argument and response-shape mismatches. Its complete output is in doctor-run.log.

A text-only or YAML-only change cannot make advisor_status return data.embeddings. Keeping this target would require a separately implemented and supported read-only status interface that joins provider configuration and server health; that interface is not present in the inspected status contract. Retirement is the minimal proposal that makes the doctor match the current system.

## Removal list

1. Remove the embeddings route stanza at .skilled/commands/doctor/_routes.yaml:49-61, including its yaml, setup_vars, allowed_flags, mutating class, gate3_location, cli_commands, and trigger_phrases.
2. Remove .skilled/commands/doctor/assets/doctor-embeddings.yaml.
3. Remove the embeddings workflow row at .skilled/commands/doctor/speckit.md:49.
4. Remove these embeddings-specific presentation entries from .skilled/commands/doctor/assets/doctor-speckit-presentation.txt:
   - Startup menu item at line 14.
   - Accepted answer 3 at line 32.
   - Help symptom at line 54.
   - Embeddings quick-reference row at line 68.
   - embeddings from the valid-target list at line 77.
   - Manifest display row at line 96.
5. Keep unrelated generic presentation references and companion routes out of this retirement list; they are not embeddings-target rows.

No source or runtime code edit is proposed.

## FINDINGS: inspected subsystem

1. The advisor status API has no joined embedding provider or model-server status fields. Its current output contract is advisor graph freshness and trust data, while provider details and model health are separate surfaces. Evidence: .skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts:319-336; .skilled/skills/system-spec-kit/shared/embeddings/factory.ts:602-619,1128-1130; .skilled/bin/hf-model-server.cjs:45,838-853.
2. The model server health payload uses state, model, dim, device, load timing, and error. It does not match the complete object the workflow expects, which also names dtype, healthy, serverState, loaded, baseUrl, and modelServerError. Evidence: .skilled/commands/doctor/assets/doctor-embeddings.yaml:51-52 and .skilled/bin/hf-model-server.cjs:838-853.
3. Live provider/server health is UNKNOWN: the workflow-shaped advisor_status command was blocked by sandbox IPC EPERM, exit 75. The exact command and complete output are recorded in doctor-run.log. This audit does not claim that the provider or server is unhealthy.

## Separate doctor-surface observation

The presentation's generic /doctor forms do not have matching root command files in either checked command tree; the inventory in reality-check.md records the missing paths and the nested router that is present. This is separate from the embeddings subsystem finding and is not included in the removal list.

Review status: REQUESTED_CHANGES
