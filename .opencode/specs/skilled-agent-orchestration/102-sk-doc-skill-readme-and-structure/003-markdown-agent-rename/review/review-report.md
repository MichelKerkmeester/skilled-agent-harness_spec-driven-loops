# Deep Review Report

## 1. Executive Summary

Verdict: **CONDITIONAL**.

The review covered correctness, security, traceability, resource-map coverage, and maintainability over four iterations. No P0 findings were found. One active P1 remains: the Codex project registry still references the removed `agents/create.toml` file after the Codex agent was renamed to `markdown.toml`.

| Severity | Active |
|----------|--------|
| P0 | 0 |
| P1 | 1 |
| P2 | 0 |

`hasAdvisories=false` because there are no P2 findings.

## 2. Planning Trigger

Route this packet to remediation before closure. The required fix is localized: update `.codex/config.toml` so the Codex registry points at the renamed markdown agent, then update `resource-map.md` and checklist evidence to include that registry consumer.

## 3. Active Finding Registry

### P1-001: Codex Agent Registry Still Points At The Removed Create Agent

- Severity: P1
- Dimension: correctness, refined by traceability/resource-map and maintainability passes
- Evidence: `.codex/config.toml:62` still declares `[agents.create]`.
- Evidence: `.codex/config.toml:64` still points `config_file = "agents/create.toml"`.
- Evidence: `.codex/agents/markdown.toml:1-3` identifies the renamed agent as `markdown`.
- Evidence: `implementation-summary.md:65` claims the Codex runtime mirror moved to `.codex/agents/markdown.toml`.
- Evidence: `resource-map.md:64-67` verifies `.codex/agents` and old file absence, but omits `.codex/config.toml`.
- Recommendation: Rename the registry entry to `agents.markdown` and set `config_file = "agents/markdown.toml"`, or explicitly document a supported legacy alias and point it at a live config file.

## 4. Remediation Workstreams

| Workstream | Action |
|------------|--------|
| Codex registry | Update `.codex/config.toml` registry key/path to the markdown agent. |
| Verification scope | Add `.codex/config.toml` to resource-map read/write or verification coverage as appropriate. |
| Evidence refresh | Re-run exact searches and update checklist/implementation evidence after the fix. |

## 5. Spec Seed

Add a short remediation note to the phase spec or follow-up packet: Codex agent registry consumers must be updated when a `.codex/agents/*.toml` agent is renamed.

## 6. Plan Seed

1. Read `.codex/config.toml` and `.codex/agents/markdown.toml`.
2. Update the registry entry to `agents.markdown` and `agents/markdown.toml`, preserving `/create:*` command names elsewhere.
3. Update resource-map/checklist verification to include `.codex/config.toml`.
4. Re-run the old identity search, file presence checks, and spec validation.

## 7. Traceability Status

| Protocol | Status | Notes |
|----------|--------|-------|
| spec_code | partial | Runtime rename mostly matches spec, but Codex registry still routes to removed file. |
| checklist_evidence | partial | Existing evidence omitted `.codex/config.toml`. |
| feature_catalog_code | complete | No broader drift found in inspected skill/template surfaces. |
| playbook_capability | complete | `/create:*` command-family names remain preserved and gated through `@markdown`. |
| resource_map_coverage | complete for review, partial for release | Coverage gap is captured in `P1-001`. |
| security_boundaries | complete | No new security findings. |

## Resource Map Coverage Gate

The original resource map covers primary runtime mirrors, command docs/assets, sk-doc template, and root framework docs. It does not cover `.codex/config.toml`, which is a consumer of `.codex/agents/*.toml`. That omission allowed the recorded verification commands to pass while a stale Codex registry pointer remained.

## 8. Deferred Items

No P2 advisories were recorded. The only deferred work is required P1 remediation for `P1-001`.

## 9. Audit Appendix

| Iteration | Focus | Result |
|-----------|-------|--------|
| 001 | correctness | Found `P1-001`. |
| 002 | security | No new findings. |
| 003 | traceability/resource-map | Refined `P1-001` with verification coverage gap. |
| 004 | maintainability/stabilization | No broader drift; `P1-001` remains localized and active. |

Stop reason: all configured dimensions have coverage and stabilization found no additional P0/P1 findings. Final release readiness remains conditional until `P1-001` is fixed or explicitly documented as an intentional live alias.
