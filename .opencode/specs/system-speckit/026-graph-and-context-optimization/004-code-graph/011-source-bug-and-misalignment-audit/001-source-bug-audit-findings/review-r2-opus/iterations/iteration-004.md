<!-- deep-review iteration (Opus 4.8, Workflow round 4/10) -->
# Iteration 4 — Path / socket validation (DR-003-02, DR-008-01) [security]

> Opus-4.8 finder + 2 independent adversarial skeptics per finding. A finding is CONFIRMED-REAL only if BOTH skeptics agree it is outstanding in current code.

_No findings raised this round._

---

coverage: Round 4 (security — path/socket validation, DR-003-02 + DR-008-01). Read current canonical-db-dir.ts, ipc/socket-server.ts, utils/workspace-path.ts and git-diffed all three vs baseline 0ef38d58 (workspace-path.ts had NO diff — unchanged this session). Both landed fixes verified CORRECT and COMPLETE; no new issues, no incorrect/incomplete fixes.

DR-003-02 (canonical-db-dir.ts:34-52): The deepest-existing-ancestor walk (`while(!existsSync(ancestor)) ancestor=dirname(ancestor)`, with `parent===ancestor` break for the FS-root terminus) then `realpathSync.native(ancestor)` + `isWithinWorkspace` BEFORE mkdir is sound. The comparison base `canonicalWorkspace` is realpath-resolved (line 32). Empirically confirmed (live FS test) it rejects BOTH a leaf-level symlink escape (alias→outside, leaf not yet created) AND a mid-path symlink that already exists (ws/linkdir→/tmp/outside resolves out-of-workspace → rejected). The lexical pre-check (line 26) and post-mkdir realpath check (line 55) remain as layered defense-in-depth against a TOCTOU swap after the ancestor check. Edge cases sound: when resolvedDir already exists the loop is a no-op and the full path is realpathed; FS-root terminus handled.

DR-008-01 (socket-server.ts:173-188): owner+mode check on the socket dir AFTER mkdir is correct because `mode:0o700` only applies on creation, not to a pre-existing dir. Uses `fs.statSync` (FOLLOWS symlinks) — empirically confirmed this sees the real target's mode/uid, so a symlinked socketDir→world-writable target is correctly rejected (lstatSync would have been the bug; statSync is right). Mode mask `& 0o022` correctly flags group-write (0o020) and other-write (0o002) while ignoring read/exec and setgid/setuid (verified: 0700/0750/0755 allow; 0770/0707/1777 reject). uid check guarded by `typeof process.getuid==='function'` (skips on Windows, where the test also skips). ENOENT swallowed (dir vanished post-mkdir → race, harmless); all other stat errors re-thrown. In production socketPath comes from `resolveIpcSocketPath(DATABASE_DIR)` which already canonicalizes + validates `isWithinAllowedSocketRoot`, so the dir argument to the check is canonical.

isWithinWorkspace prefix-match: verified NO `/workspace-evil` sibling-prefix bug — it appends `sep` before `startsWith` (`/workspace`→`/workspace/`), so `/workspace-evil/x` and `/tmpfoo/x` are correctly rejected while exact-match and true descendants pass.

allowedSocketRoots / canonicalizePath: ancestor-canonicalization handles symlinked roots (macOS /tmp→/private/tmp) and cleared dirs; comment at line 87 doc-fixed to the accurate path `.opencode/skills/system-code-graph/mcp_server/database` (matches readiness-marker.ts/config DATABASE_DIR default). canUnlinkExistingSocket (EADDRINUSE unlink path) was NOT modified this session (hardened in a prior packet) — out of scope for new findings.

Regression tests verified as GENUINE (not false confidence): ran both new tests against the un-fixed baseline source (git show 0ef38d58 of both .ts files restored, new tests kept) → 2 FAILED (DR-003-02 leaf dirs got created under outside target; DR-008-01 server resolved instead of rejecting). Against current fixed source → 8/8 PASS. DR-008-01 test correctly skipIf no process.getuid. Source restored and git-diff-stat reconfirmed clean after the experiment.

newFindings: 0 (confirmed-real), rawFindings: 0, dimension: security
