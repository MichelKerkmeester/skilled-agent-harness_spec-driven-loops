## Findings

### P0 — Blockers

None confirmed.

### P1 — Required

#### P1-001 — Boundary mutation failures are reported as successful
- **Evidence:**  
  - `.opencode/skills/system-skill-advisor/hooks/claude/directive-lifecycle-boundary.ts:55-60`
  - `.opencode/skills/system-spec-kit/mcp-server/hooks/claude/directive-lifecycle-boundary.ts:42-55`
  - `.opencode/skills/system-skill-advisor/hooks/lib/directive-lifecycle-file-store.ts:216-224`
- **Status:** Confirmed by static control-flow inspection.
- **Finding class:** Cross-consumer.
- **Impact:** `advanceGeneration()` or `advanceSessionEpoch()` can return `false`, but the boundary CLI discards that result and always exits zero. The bridge therefore returns `true` based only on child exit status. A transient write failure can leave the old epoch/generation valid, allowing a later prompt to suppress directives across a real lifecycle boundary.
- **Required fix:** Make successful acknowledgement mean the mutation was durably committed. On failure, establish state that forces subsequent prompts to always deliver full directives; merely returning a bridge error is insufficient if a later process can consume the old record.

#### P1-002 — Suppression is not atomic with epoch/generation changes
- **Evidence:**  
  - `.opencode/skills/system-skill-advisor/hooks/lib/directive-lifecycle.ts:126-150`
  - `.opencode/skills/system-skill-advisor/hooks/lib/directive-lifecycle-file-store.ts:162-180`
- **Status:** Confirmed possible interleaving; runtime reproduction not run.
- **Finding class:** Algorithmic/concurrency.
- **Impact:** The second clock read occurs at line 129, but a boundary can advance the clock before the high-water write or suppression return at lines 146-150. `set()` does not compare the supplied record clock with the current durable clock, so it can also install an old-clock record after a boundary.
- **Required fix:** Use an atomic compare-and-set/transaction shared by record reads, high-water updates, and boundary advancement. A third unlocked clock read would narrow but not eliminate the race.

#### P1-003 — File-store topology checks remain TOCTOU-vulnerable
- **Evidence:**  
  - `.opencode/skills/system-skill-advisor/hooks/lib/directive-lifecycle-file-store.ts:230-258`
  - `.opencode/skills/system-skill-advisor/hooks/lib/directive-lifecycle-file-store.ts:261-272`
  - `.opencode/skills/system-skill-advisor/hooks/lib/directive-lifecycle-file-store.ts:284-325`
  - `.opencode/skills/system-skill-advisor/hooks/lib/directive-lifecycle-file-store.ts:339-345`
- **Status:** Confirmed.
- **Finding class:** Security/class-of-bug.
- **Impact:** `mkdirSync(..., {recursive:true})` and final-path `lstat`/`realpath` do not reject symlinked intermediate components. Reads, renames, and unlinks then use absolute paths after separate identity checks. Replacing a directory between those checks can redirect authoritative operations. This does not satisfy the required directory-handle-anchored or equivalent invariant.
- **Required fix:** Anchor operations to securely opened directory handles with no-follow semantics and inode validation, or disable durable suppression where that guarantee cannot be implemented.
- **Severity note:** Kept at P1 rather than P0 because exploitation assumes local filesystem access under the relevant principal, but it remains a required guardrail-state security fix.

#### P1-004 — A record is treated as a delivery receipt before output is handed off
- **Evidence:** `.opencode/skills/system-skill-advisor/hooks/lib/directive-lifecycle.ts:141-150`
- **Status:** Confirmed by static flow.
- **Finding class:** Cross-consumer/correctness.
- **Impact:** First/full delivery stores the record at line 142 before the caller writes the hook output. If output delivery fails or the process exits in that window, the next invocation can treat the record as proof and return reduced context even though the full directives were never delivered.
- **Required fix:** Separate decision state from committed delivery receipts. Commit the receipt only after successful output handoff, with rollback or pending-record recovery for process failure.

#### P1-005 — Devin post-compaction can miss the global invalidation path
- **Evidence:**  
  - `.opencode/skills/system-spec-kit/mcp-server/hooks/devin/post-compaction.cjs:93-112`
  - `.opencode/skills/system-spec-kit/mcp-server/hooks/devin/post-compaction.cjs:144-161`
- **Status:** Confirmed.
- **Finding class:** Cross-consumer/host coupling.
- **Impact:** Invalid JSON returns before any boundary notification, rather than advancing the global generation for an unidentified boundary. Valid payloads use a direct `<cwd>/.opencode/.../dist` path rather than the root-walking canonical bridge, so a subdirectory `cwd` silently skips invalidation.
- **Required fix:** Notify the canonical bridge for every observed post-compaction event, including malformed/missing identity, and use the same root-resolution logic as other lifecycle owners.

#### P1-006 — Adapter parity tests do not exercise the required failure/path matrix
- **Evidence:** `.opencode/skills/system-spec-kit/mcp-server/tests/directive-lifecycle-adapter-parity.vitest.ts:82-97`
- **Status:** Confirmed.
- **Finding class:** Matrix/evidence.
- **Impact:** The test supplies already-rendered full/route-only strings through a stub and checks symlink targets. It does not test lifecycle decisions, malformed child output, timeout, required-field omissions, or invocation through both discovery and canonical paths for each runtime.
- **Required fix:** Add the full Claude/Codex/Cursor/Devin matrix, including negative cases and actual execution through both path forms.

### P2 — Suggestions

#### P2-001 — Renames are not made crash-durable
- **Evidence:** `.opencode/skills/system-skill-advisor/hooks/lib/directive-lifecycle-file-store.ts:297-318`
- **Status:** Confirmed; crash consequence inferred from filesystem semantics.
- **Impact:** The temp file is `fsync`ed, but the containing directory is not synchronized after `renameSync`. A crash can lose an epoch/generation rename and leave older suppression state.
- **Suggestion:** Synchronize the state directory after authoritative renames where supported; otherwise document and fail open for unsupported durability.

### P3 — Residual risks

1. **Native-host evidence remains unproven.**  
   `.opencode/skills/system-spec-kit/mcp-server/tests/directive-lifecycle-boundary-bridge.vitest.ts:11-37` replaces the canonical target with a test stub. This proves adapter wiring, not native host delivery.

2. **TypeScript/OpenCode mirror drift remains possible.**  
   The OpenCode plugin retains a separate in-memory JavaScript implementation and the changed tests do not compare shared contract vectors against the canonical TypeScript decision engine.

3. **Structural-impact analysis was unavailable.**  
   Code graph/detect-changes tooling was not available, so impact was derived from the scoped diff, owner inventory, and direct source inspection.

## Adversarial Self-Check

| Finding | Hunter | Skeptic challenge | Referee verdict |
|---|---|---|---|
| Boundary false acknowledgement | P1 | A store failure may also make the next prompt fail open | Confirmed P1: transient/bridge-only failures can recover while leaving old state |
| Clock/high-water race | P1 | The second read could be treated as a linearization point | Confirmed P1: record mutation and actual suppression occur afterward without shared locking |
| File-store TOCTOU | P0 | Private ownership and modes reduce exploitability | Downgraded to P1; required invariant is still absent |
| Pre-delivery receipt | P1 | Output normally follows immediately | Confirmed P1: process/output failure leaves a reusable false receipt |
| Devin coupling gap | P1 | Malformed input may not represent a real event | Confirmed P1: the hook firing is the boundary and unidentified boundaries require global invalidation |
| Adapter test matrix | P1 | The file could be intended only as a smoke test | Confirmed P1 against the phase’s explicit parity acceptance matrix |

## Positive observations

- The `5 KB → 10 KB → 7 KB` high-water behavior and repeated unknown-stat fail-open behavior are implemented and unit-tested.
- Records validate schema, ownership, restrictive mode, regular-file type, link count, and bounded size.
- Temporary writes use exclusive creation, `O_NOFOLLOW`, inode verification, and cleanup in `finally`.
- Directory scans, eviction, and temp cleanup are bounded.
- OpenCode identity resolution rejects object-shaped, conflicting, and explicitly ambiguous identities.
- No newly added forbidden ephemeral identifiers were observed in scoped code comments. Test-name/string literals containing identifiers are not comments.

## Score and Verdict

| Dimension | Score |
|---|---:|
| Correctness | 13/30 |
| Security | 12/25 |
| Patterns | 15/20 |
| Maintainability | 12/15 |
| Performance | 8/10 |
| **Total** | **60/100** |

**Verdict: REQUEST CHANGES.** The high-water remediation is directionally sound, but boundary failure acknowledgement, atomicity, file-store topology safety, receipt timing, Devin coupling, and required test coverage prevent acceptance.

**Confidence:** MEDIUM. Static findings are well-supported; focused test execution and structural-impact tooling were unavailable before the tool budget closed.

## Commands Run

- `git status --short`, `git diff --stat`, `git diff --cached --stat`, and changed-path inventories.
- Targeted `git diff --unified=60/30` for plugin, hook owners, and changed tests.
- Targeted `wc -l`, `git diff --numstat`, and scoped status inventory.
- File discovery for lifecycle sources, bridges, phase packet, and tests.
- Scoped comment-pattern grep.
- Line-numbered `nl -ba ... | sed` and focused symbol/call-site grep.
- No mutation, build, or test command was run.
- Cached/staged diff was empty; unrelated unstaged/untracked repository work remains.

Review status: REQUESTED_CHANGES