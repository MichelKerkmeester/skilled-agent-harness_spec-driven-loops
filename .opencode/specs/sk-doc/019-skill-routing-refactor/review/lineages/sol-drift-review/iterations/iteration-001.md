# Iteration 1: Current Routing Capability Claims

## Dispatcher

- Focus: correctness
- Scope: current-state routing explainers and all seven parent-hub manifests

## Findings

### P0

None.

### P1

- **F001 — Authoritative routing reference reports a two-hub manifest surface after fleet rollout.** The reference says only `sk-code` and `sk-doc` carry manifests and describes the other five as manifest-free. All seven parent hubs named by the same document now have `leaf-manifest.json`. This makes the document's stated measurement boundary false and can send new planning toward work already shipped. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/routing-config-and-advisor-reference.md:122-124] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/routing-config-and-advisor-reference.md:198-203] [SOURCE: .opencode/skills/cli-external-orchestration/leaf-manifest.json:1] [SOURCE: .opencode/skills/mcp-tooling/leaf-manifest.json:1] [SOURCE: .opencode/skills/sk-design/leaf-manifest.json:1] [SOURCE: .opencode/skills/sk-prompt/leaf-manifest.json:1] [SOURCE: .opencode/skills/system-deep-loop/leaf-manifest.json:1]

```json
{"findingId":"F001","claim":"The routing reference's two-hub manifest account is stale; all seven parent hubs now carry manifests.","evidenceRefs":[".opencode/specs/sk-doc/019-skill-routing-refactor/routing-config-and-advisor-reference.md:122-124",".opencode/skills/cli-external-orchestration/leaf-manifest.json:1",".opencode/skills/mcp-tooling/leaf-manifest.json:1",".opencode/skills/sk-design/leaf-manifest.json:1",".opencode/skills/sk-prompt/leaf-manifest.json:1",".opencode/skills/system-deep-loop/leaf-manifest.json:1"],"counterevidenceSought":"Checked whether the additional manifests were historical, malformed, or outside the seven parent hubs; they are live files at the exact hub roots.","alternativeExplanation":"The prose accurately described an earlier rollout stage but was not revised after fleet expansion.","finalSeverity":"P1","confidence":0.99,"downgradeTrigger":"Downgrade only if the added manifests are proven non-serving artifacts and the reference explicitly scopes itself to an earlier snapshot."}
```

### P2

None.

## Ruled Out

- The additional manifests are archival copies: ruled out by their placement at live hub roots.
- Only two manifests parse: ruled out by direct inspection of all seven JSON files.

## Next Focus

Security review of compiled-routing fallback, kill-switch, and path containment.

Review verdict: CONDITIONAL
