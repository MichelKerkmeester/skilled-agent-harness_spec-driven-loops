# Iteration 015 — Angle 15

**Angle:** Session trust adoption: resolveTrustedSession coverage across every session-accepting tool surface (search done — context, validate, list, bulk ops?).

**Summary:** resolveTrustedSession adoption is partial: context/search/triggers are covered, while governed ingest, validation feedback, learning tools, and session_resume remain outside the gate. memory_list and memory_bulk_delete do not currently accept sessionId, so they are not missing trust checks.

**Findings kept:** 5

## [P1][DOC-DRIFT] Session scoping docs overclaim E_SESSION_SCOPE coverage

- Evidence: .opencode/skills/system-spec-kit/references/cli/memory_handback.md:46 says memory_context, memory_search, memory_save and the rest return E_SESSION_SCOPE for foreign sessionId; .opencode/skills/system-spec-kit/mcp_server/handlers grep shows resolveTrustedSession only in memory-context.ts:1146, memory-search.ts:831, memory-triggers.ts:348
- Detail: The code only applies resolveTrustedSession on memory_context, memory_search, and memory_match_triggers. Several other public tools accept sessionId but do not use the trust gate, so the doc's blanket statement is materially false.
- Fix sketch: Either apply resolveTrustedSession consistently to every public sessionId argument or narrow the handback doc to the three currently guarded surfaces.

## [P1][BUG] Governed ingest session boundary is only syntactic

- Evidence: .opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:712 and :742 expose sessionId as a governed-ingest boundary; .opencode/skills/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:250-317 validates required presence but never calls resolveTrustedSession; memory-save.ts:3136-3146, memory-index.ts:360-363, memory-ingest.ts:146-149 all use validateGovernedIngest directly
- Detail: memory_save, memory_index_scan, and memory_ingest_start can accept any non-empty sessionId when the other governed-ingest fields are present. Because sessionId is documented as a boundary, this lets callers stamp indexed rows/jobs with an uncorroborated or foreign session label.
- Fix sketch: Resolve and replace governed-ingest sessionId through resolveTrustedSession before validateGovernedIngest persists or queues it.

## [P1][BUG] Learning tools allow arbitrary sessionId targeting

- Evidence: .opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:628-629 and :637 allow sessionId for task_preflight, task_postflight, and memory_get_learning_history; session-learning.ts:336 stores normalizedSessionId, :503-506 targets postflight by normalizedSessionId, and :697-700 filters history by normalizedSessionId with no trust check
- Detail: The learning surfaces use sessionId as a selector for updating or reading learning cycles, but they only trim the string. A caller with a guessed sessionId can target another cycle's postflight or filter history by that ID if they know the specFolder.
- Fix sketch: Gate session-learning sessionId with resolveTrustedSession and use the effective sessionId for inserts, updates, and reads.

## [P2][BUG] memory_validate accepts untrusted sessionId for feedback attribution

- Evidence: .opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:490 exposes sessionId for selection telemetry; checkpoints.ts:749-777 uses it as adaptive signal actor and checkpoints.ts:823-830 passes it into recordUserSelection; ground-truth-feedback.ts:235-248 persists session_id directly
- Detail: memory_validate writes confidence/adaptive/ground-truth feedback and can attribute that feedback to any caller-provided sessionId. This is less direct than retrieval IDOR, but it can pollute evaluation and feedback telemetry under a foreign session label.
- Fix sketch: Validate memory_validate.sessionId with resolveTrustedSession or drop caller-controlled session attribution from this write path.

## [P2][REFINEMENT] session_resume uses a separate auth model from resolveTrustedSession

- Evidence: .opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:602-605 exposes session_resume.sessionId; session-resume.ts:527-544 only compares args.sessionId to callerContext.sessionId; tests/session-resume-auth.vitest.ts:203-212 asserts a requested session proceeds when callerContext.sessionId is null
- Detail: session_resume intentionally uses transport callerContext matching rather than the session manager trust gate. That may be acceptable for stdio, but it is another session-accepting public surface outside resolveTrustedSession coverage and should be explicit in the trust contract.
- Fix sketch: Document session_resume as transport-bound rather than resolveTrustedSession-bound, or route targeted recovery through resolveTrustedSession when a real session manager identity is available.
