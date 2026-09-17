## Verdict

REQUEST CHANGES. `.skilled`-only execution still fails in the divergence ledger and hook installer, while the new root walks accept invalid `.skilled` layouts as workspace/spec roots.

## Findings

| ID | Severity (P0 blocks the phase, P1 must fix, P2 should fix) | File:line | Scenario (the inputs and the wrong outcome) | Suggested fix |
|---|---|---|---|---|
| F-001 | P1 | `.opencode/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-local-native-divergence-ledger.mjs:85` | In a `.skilled`-only checkout with the built scorer present, root discovery succeeds, but the Python scorer imports `/repo/.opencode/.../skill_advisor.py`, which does not exist, and the capture fails. The added test stops earlier at the missing `fusion.js` check (`capture-ledger-workspace-root.vitest.ts:31-44`). | Derive the Python script path from the active source-root name and add a fixture that reaches `runPython`. |
| F-002 | P1 | `.opencode/scripts/install-git-hooks.sh:30` | In a `.skilled`-only checkout with `.skilled/scripts/git-hooks/pre-commit`, invoking the installer through `.skilled` scans the absent `.opencode` directory, silently installs nothing, and exits successfully. | Derive `HOOK_SOURCE_DIR` from the installer’s actual source-root path and use it consistently for install, status, and uninstall. |
| F-003 | P1 | `.opencode/skills/system-spec-kit/runtime/lib/graph/graph-metadata-parser.ts:884-903` | With `/repo/.skilled/specs/track/packet` and `/repo/.skilled/skills/system-spec-kit/SKILL.md`, the detector treats `.skilled/specs` as a valid spec root and resolves the repository as `/repo`, despite `.skilled/specs` being an unsupported alias. | Keep the nested spec-root spelling restricted to `.opencode/specs`; recognize `.skilled` only as the sibling source tree for the canonical `/repo/specs` layout, requiring a real source-tree marker. |
| F-004 | P1 | `.opencode/skills/system-spec-kit/shared/gate-3-classifier.ts:360-364` | In a repository containing `AGENTS.md`, `specs/`, and an unrelated empty `.skilled/` directory with no `skills` tree or `.opencode`, the fallback branch sets `holdsSourceTree` true and returns the repository as a valid workspace. | Require a concrete source-tree marker such as `<root>/.skilled/skills` or the system-spec-kit sentinel; do not accept a bare `.skilled` directory. |
Codex exit 0, 2026-09-17T11:45:39Z to 2026-09-17T11:57:22Z, --model gpt-5.6-luna, reasoning xhigh, service tier fast, --sandbox read-only.
