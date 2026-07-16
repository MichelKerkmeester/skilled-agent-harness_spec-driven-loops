# Iteration 001 Prompt Snapshot

STATE SUMMARY (auto-generated, review mode):
Iteration: 1 of 1 | Mode: review
Target: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review-r2/scopes/C-rest-of-server (spec-folder)
Dimensions: 0/4 complete | Next: correctness/security/IPC lifecycle
Findings: P0:0 P1:0 P2:0 active
Traceability: core=pending overlay=pending
Last ratios: none | Stuck count: 0
Provisional verdict: PENDING | hasAdvisories=false
Next focus: daemon IPC, launcher bridge, session proxy, request-handler boundary, provider retry

Constraints:
- LEAF agent, no sub-agent dispatch.
- Target files read-only.
- Artifact directory bound directly from `config.fanout_lineage_artifact_dir`.
- Do not run the resolveArtifactRoot node command.
