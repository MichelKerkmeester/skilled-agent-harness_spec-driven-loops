## Verdict

The standard sentinel-bearing layouts are covered, but nested leaks and no-sentinel root-name collisions still resolve incorrectly; the new leak test also misses the failing path, and linked aliases remain absent from `matchPaths` (`.opencode/skills/system-spec-kit/runtime/cli/utils/workspace-identity.ts:76-95,162-192`).

## Findings

| ID | Severity (P0 blocks the phase, P1 must fix, P2 should fix) | File:line | Scenario (the inputs and the wrong outcome) | Suggested fix |
|---|---|---|---|---|
| F-001 | P1 must fix | `.opencode/skills/system-spec-kit/runtime/cli/utils/workspace-identity.ts:76-95,105-115,168-173` | With `R/.skilled/skills/system-spec-kit/SKILL.md` and a stray `R/.skilled/skills/x/.opencode/skills/.state`, `buildWorkspaceIdentity(R/.skilled/skills/x)` selects the bare nested `.opencode` and returns `R/.skilled/skills/x` instead of `R`. A start inside the stray tree similarly anchors at the leak. | Ignore nested source-root names below an existing source root unless selecting the outer sentinel-backed checkout; add parent and leaf leak-start rows. |
| F-002 | P1 must fix | `.opencode/skills/system-spec-kit/runtime/cli/utils/workspace-identity.ts:91-95,127-137,168-173` | For checkout root `R=/tmp/base/.skilled` containing a bare `R/.opencode` directory with no spec-kit sentinel, `buildWorkspaceIdentity(R)` returns `/tmp/base` instead of `R`. | Preserve the child source-root anchor when no sentinel disambiguates a checkout whose own directory is `.skilled`; add a no-sentinel fixture. |
| F-003 | P2 should fix | `.opencode/skills/system-spec-kit/runtime/cli/tests/workspace-identity.vitest.ts:154-160` | The test creates `R/.skilled/.opencode/skills/.state` but starts at `R/.skilled/skills/system-spec-kit`, so the parent implementation also passes and the row does not detect the nested-leak defect. | Start the resolver at the stray tree and at its parent, asserting both resolve to `R`. |
| F-004 | P2 should fix | `.opencode/skills/system-spec-kit/runtime/cli/utils/workspace-identity.ts:76-84,179-192` | With real `R/.skilled/skills/system-spec-kit/SKILL.md` and `R/.opencode -> .skilled`, `getWorkspacePathVariants(R)` omits the existing lexical `R/.opencode` link because only the first sentinel-bearing anchor is added. | Include every existing sentinel-bearing source-root spelling in `matchPaths`, and add a whole-link variant assertion. |
Codex exit 0, 2026-09-17T11:29:24Z to 2026-09-17T11:40:07Z, --model gpt-5.6-luna, reasoning xhigh, service tier fast, --sandbox read-only.
