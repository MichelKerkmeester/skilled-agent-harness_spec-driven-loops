# Deep Review Iteration 5

## Review metadata

- Session: fanout-luna-max-pass3-1788562574615-h6l4fh
- Target: .opencode/specs/system-speckit/053-spec-kit-runtime-rename
- Dimension: correctness
- Angle: freshness cache identity, build preparation order, workspace links, and dependency replay
- Prior active findings: DR-001, DR-002, DR-003, DR-004
- Executor: inline cli-codex, model gpt-5.6-luna

## Evidence reviewed

- The freshness table gives scripts a whole-root source candidate and gives runtime its new package id, runtime dist entries, and runtime build command. [SOURCE: .opencode/skills/system-spec-kit/scripts/lib/dist-freshness.cjs:33-83]
- The walker still follows the scripts/runtime generated link and checkPackageFreshness returns a freshness error when traversal throws. [SOURCE: .opencode/skills/system-spec-kit/scripts/lib/dist-freshness.cjs:217-235,361-369,662-669,795-800]
- The runtime build prepares both freshness entries before TypeScript build. [SOURCE: .opencode/skills/system-spec-kit/runtime/package.json:12-16]
- The test cleanup glob now uses system-spec-kit-runtime, which matches the safe id derived from system-spec-kit/runtime. [SOURCE: .opencode/skills/system-spec-kit/scripts/tests/test-dist-freshness.sh:10-18,32-44,76-79] [SOURCE: .opencode/skills/system-spec-kit/scripts/lib/dist-freshness.cjs:265-268]
- The runtime manifest and lockfile still contain chokidar, while a bounded production search across runtime and scripts finds no chokidar import or require. [SOURCE: .opencode/skills/system-spec-kit/runtime/package.json:41-45] [SOURCE: .opencode/skills/system-spec-kit/package-lock.json:1176-1184,2051-2066]
- Observed filesystem state remains scripts/runtime -> ../runtime/dist with the target runtime/dist absent. The symlink is present but dangling.

## Finding refinement

### DR-001 [P1] Scripts freshness scan still crosses the unprovisioned runtime distribution boundary

- File: .opencode/skills/system-spec-kit/scripts/lib/dist-freshness.cjs:228-235
- Evidence: The current source table still treats the scripts root as a recursive source tree. The generated runtime link sits inside it. With runtime/dist absent, statSync on that link throws and the catch path emits a freshness error. Replaying the direct checker path confirms the original failure remains active.
- Finding class: class-of-bug
- Scope proof: The same producer and consumer paths were checked after the package table and build command replay. The current test fixture covers stale and fresh runtime dist timestamps, but does not provision the dangling-link state before scripts traversal.
- Affected surface hints: scripts freshness source candidates, runtime build order, freshness test fixture, validate.sh
- Recommendation: Ignore the generated runtime link during scripts traversal or record it as a package boundary, then add an unprovisioned-runtime regression case.

### DR-004 [P1] Runtime manifest keeps chokidar on an advisor-only consumer claim

- File: .opencode/skills/system-spec-kit/runtime/package.json:41-45
- Evidence: The lockfile faithfully mirrors the manifest, but that only proves installation ownership. The production source inventory still has no chokidar consumer, and the only keep rationale points to system-skill-advisor/mcp-server, which is a separate preserved package. The dependency contract remains unresolved.
- Finding class: class-of-bug
- Scope proof: Manifest, tsconfig mapping, lockfile, runtime source, scripts source, and dependency audit were replayed. No live runtime consumer was found.
- Affected surface hints: runtime manifest, runtime tsconfig, lockfile, dependency audit
- Recommendation: Remove chokidar and its unused type mapping or document and implement the actual runtime consumer before marking AC-006 Met.

## Ruled out

- The suspected old cache cleanup mismatch is not present in the current source. The test glob uses system-spec-kit-runtime and the producer derives that same prefix from the new package id. [SOURCE: .opencode/skills/system-spec-kit/scripts/tests/test-dist-freshness.sh:17] [SOURCE: .opencode/skills/system-spec-kit/scripts/lib/dist-freshness.cjs:265-268]
- Runtime and scripts workspace links and project references point to the new runtime path. [SOURCE: .opencode/skills/system-spec-kit/runtime/tsconfig.json:32-36] [SOURCE: .opencode/skills/system-spec-kit/scripts/tsconfig.json:10-18]
- The runtime public API identity remains @spec-kit/runtime with no old package alias. [SOURCE: .opencode/skills/system-spec-kit/runtime/package.json:2-10]

## Dimension result

- Correctness: CONDITIONAL due to DR-001 and DR-004. The cache-cleanup concern is ruled out.
- Security: PASS with DR-002 advisory.
- Traceability: CONDITIONAL due to the dependency audit evidence and AC-006 status.
- Maintainability: PASS with DR-003 advisory.
- New findings: 0 P0, 0 P1, 0 P2. Refined findings: DR-001 and DR-004.
- Convergence: telemetry only. Continue to the max-iteration hard stop.

## Next angle

Iteration 6 revisits security with an adversarial pass over environment precedence, path canonicalization, database/socket isolation, and preserved advisor boundaries.

Review verdict: CONDITIONAL
