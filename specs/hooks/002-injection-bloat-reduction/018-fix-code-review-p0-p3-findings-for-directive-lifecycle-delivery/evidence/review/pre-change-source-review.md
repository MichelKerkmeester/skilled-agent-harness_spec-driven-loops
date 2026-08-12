## Review

**Verdict:** Pre-change baseline has **0 active P0 findings**, **7 P1 findings**, and **3 P2 findings**. The main risks are stale suppression, unsafe durable state, untrusted lifecycle/identity signals, and evidence that overstates runtime coverage.

### Correct

- The kill switch defaults on and recognizes `0|false|off|no`; disabling dedup preserves full delivery (`.opencode/skills/system-skill-advisor/hooks/lib/directive-lifecycle.ts:55-58`).
- Unknown or explicitly unconfirmed shim sessions fail open (`directive-lifecycle.ts:181-186`).
- Directive changes and recognized boundaries cause full delivery (`directive-lifecycle.ts:191-210`).
- All four discovery paths are currently symlinks resolving to existing regular dist files:
  - `.claude/hooks/user-prompt-submit.js`
  - `.cursor/hooks/user-prompt-submit.js`
  - `.codex/hooks/user-prompt-submit.js`
  - `.devin/hooks/user-prompt-submit.js`
- Codex, Cursor, and Devin adapters normalize the canonical Claude hook output rather than exposing its JSON envelope directly (`dist/hooks/codex/user-prompt-submit.js:8-16`, `dist/hooks/cursor/user-prompt-submit.js:37-46`, `dist/hooks/devin/user-prompt-submit.js:8-16`).
- OpenCode explicitly re-arms known sessions on `session.created`, `session.resumed`, and compaction events (`.opencode/plugins/mk-skill-advisor.js:1255-1298`).

## Finding Registry

| ID | Severity | Class | Finding and evidence | Affected producers → consumers |
|---|---|---|---|---|
| DL-01 | **P1** | Correctness / stale state | Transcript size is recorded only on full delivery. The suppression branch returns without advancing it (`directive-lifecycle.ts:191-211`). Thus `5 KB → 10 KB → 7 KB` retains 5 KB and suppresses at 7 KB. The test only proves isolated growth suppresses and never follows it with shrink (`directive-lifecycle.vitest.ts:137-153`). Initial `null → null`, missing current path, and known path → missing path also suppress because `transcriptShrunkOrMoved` returns false when either path is absent and only treats unknown size as unsafe if a numeric size was previously recorded (`directive-lifecycle.ts:139-160`). | Transcript stat producer in Claude shim → canonical decision → emitted policy context |
| DL-02 | **P1** | Lifecycle integration | The prompt hook trusts lifecycle fields supplied on the prompt payload (`user-prompt-submit.ts:128-139,306-314`). A source scan of registered Claude/Codex/Cursor/Devin session-start and compact adapters found no directive-store reset or epoch coupling. Their lifecycle processes therefore do not invalidate shared state directly. The current compact test likewise injects `lifecycle_event: 'compact'` into the prompt call rather than invoking a registered host reset path (`claude-user-prompt-submit-hook.vitest.ts:304-317`). | Host session/compact hooks → file-backed state → prompt subprocess |
| DL-03 | **P1** | Identity / isolation | OpenCode selects the first truthy identity candidate rather than rejecting disagreement (`mk-skill-advisor.js:407-417`). Ambiguity and object detection are used only for shadow-delivery metadata (`:666-690`), while active dedup receives the normalized `sessionID` directly (`:1179-1184`). The tests explicitly accept object identities as deterministic cache keys (`mk-skill-advisor-plugin.vitest.ts:502-516`). Object, explicitly ambiguous, or conflicting top-level/nested identities can therefore create or consume suppression state. Unknown lifecycle events also delete only the normalized `__global__` entry rather than invalidating all older records (`:1255-1298`). | OpenCode hook/event payloads → `sessionIdFrom` → directive map/cache/system transform |
| DL-04 | **P1** | Filesystem security | The file store performs path-based `mkdirSync`, `statSync`, `readFileSync`, `writeFileSync`, and `renameSync` operations without no-follow or inode revalidation (`directive-lifecycle.ts:272-318`). It checks `isFile()` before a separate read, creating TOCTOU exposure. It does not validate owner, mode, hard-link count, record size, secure directory ancestry, or containment after symlink resolution. Existing insecure directories are not repaired. An attacker or corrupted local state can redirect reads/writes or inject a matching record that authorizes suppression. | Environment-selected state directory/filesystem → `FileDirectiveLifecycleStore` → all subprocess adapters |
| DL-05 | **P1** | Adapter parity / coverage | The reviewed tests exercise the canonical Claude handler, core, and OpenCode plugin, but no Codex/Cursor/Devin payload-and-envelope parity matrix was found. Cursor additionally requires only `session_id` before forwarding possibly missing `prompt` (`dist/hooks/cursor/user-prompt-submit.js:37-46`), whereas Codex/Devin require `prompt` but may run without a usable session identity (`dist/hooks/codex/user-prompt-submit.js:8-16`, `dist/hooks/devin/user-prompt-submit.js:8-16`). Cursor’s own adapter header says native delivery remains unconfirmed. | Native host payload dialects → outer adapters → canonical Claude handler |
| DL-06 | **P1** | Evidence integrity | Scenario 457 defines PASS as every runtime demonstrating every lifecycle behavior, but its authoritative suites cover core/Claude/OpenCode plus Pi; Codex, Cursor, and Devin registered adapters are not executed independently (`manual-testing-playbook/ux-hooks/directive-lifecycle-dedup.md:27-56`). The grouped “Claude/Cursor/Devin/Codex shim” commands invoke only the compiled Claude target and write evidence solely beneath `/tmp` (`:55-62`). “Recorded fragments” have no command log, timestamp, runtime version, payload fixture, or hash. Adapter-driven evidence can therefore be reported as native cross-runtime PASS. | Scenario/manual operator → benchmark row/report → release and documentation consumers |
| DL-07 | **P1** | Persistence / provenance | The entire benchmark directory is currently untracked (`git status --short`: `?? .opencode/skills/system-spec-kit/benchmark/`), so these reports are not durable repository evidence. The same scenario has multiple same-date PASS and FAIL report directories, while one CSV has a quoted model field beginning `gpt-5.6-luna` across a newline (`benchmark/reports/...ux-hooks-3/results.csv:2`). Other rows store different executor/model identities. No inspected source established an external supersession manifest or per-evidence hash. | Benchmark executor/environment → report JSON/CSV/index → provenance and completion consumers |
| DL-08 | **P2** | Cleanup / reliability | Store temp files are created before `renameSync`, but there is no `finally` cleanup if write or rename fails (`directive-lifecycle.ts:299-318`). Eviction scans and sorts every `.json` file with no cap on directory work (`:327-357`). The tests cover normal eviction and corrupt JSON, not temp residue, symlink topology, injected types, size, ownership, or failure cleanup (`directive-lifecycle.vitest.ts:271-296`). | Concurrent store writers / filesystem faults → state directory and hook latency |
| DL-09 | **P2** | Test isolation | Claude hook tests delete environment variables after each test rather than restoring pre-suite values (`claude-user-prompt-submit-hook.vitest.ts:77-80`). The state-directory test deletes its override only at the end of the test body, so an earlier assertion failure leaks both the environment and singleton (`directive-lifecycle.vitest.ts:299-314`). Plugin tests reset environment and timers only in `beforeEach`; no corresponding post-test restoration was observed (`mk-skill-advisor-plugin.vitest.ts:132-140`). | Test process state → later tests and repeated/hostile-order runs |
| DL-10 | **P2** | Metadata consistency | Current records present incompatible evidence states without an explicit machine-readable authority: Scenario 457 says every runtime must pass, while benchmark folders contain both PASS and registered-runtime FAIL rows. Phase 018’s spec declares the P0 tier empty, while its implementation summary correctly says that count was merely reported and lacked phase-018 source evidence. The fresh source review resolves the present P0 count, but the stored metadata still needs reconciliation. | Scenario/spec/report producers → graph, index, operators, completion tooling |

## Severity Summary

- **Active P0: 0**
- **Active P1: 7**
- **Active P2: 3**

No verified issue crosses the P0 threshold. The filesystem weaknesses require local access to the same state boundary, and the current behavior remains recoverable through always-full delivery or the kill switch. They remain release-blocking P1 issues because they can silently authorize stale suppression.

## Residual Risks

- Native Claude, Codex, Cursor, Devin, and OpenCode host delivery was not live-fired in this review.
- Focused tests were not executed due the review tool-budget boundary; findings are source-attested, not runtime-attested.
- The checkout contains extensive unrelated modifications and deletions. Attribution must remain packet-scoped.
- Cross-process same-session writes, eviction races, and hook latency remain unmeasured.
- The OpenCode JavaScript mirror has no shared contract-vector gate proving parity with the canonical TypeScript decision.