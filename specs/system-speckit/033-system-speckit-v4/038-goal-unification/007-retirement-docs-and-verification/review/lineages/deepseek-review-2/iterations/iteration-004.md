---
iteration: 4
focus: "traceability — plugin versus core parity: workspace resolution and packet-read fields"
dimensions: [traceability, correctness]
started_at: "2026-09-11T11:12:00Z"
status: complete
---

# Iteration 004 — plugin versus core parity

## Scope

The review scope names "the plugin versus core parity (labels, caps, keying, the `set` on a bound record)" and the pass-1 report closed F013 ("plugin bind stores an unresolved workspace through a dead ternary") as fixed. This iteration re-reads that fix and compares the two management surfaces through the plugin's pinned `__test` seam and the shared slice module. Surfaces read: `.opencode/plugins/opencode-goal.js` (bind, packet, injection), `.opencode/hooks/goal/lib/goal-core.cjs` (repo-root resolution, bind, packet description), `.opencode/hooks/goal/bin/goal.cjs` (packet action), `.opencode/hooks/goal/README.md`.

## Findings

### F103 — P2 — The plugin still resolves a packet against the directory it was handed, so a bind from a subdirectory fails where the core succeeds

**Dimension**: traceability (cross-runtime parity) | **Bears on**: ADR-005 (OpenCode is the primary surface) | **Status of pass-1 F013**: the dead ternary is gone, the root walk was never added — the fix is incomplete

**Evidence** (read at the cited lines):

- Plugin: `const workspace = options.directory || process.cwd();` and then `goalSlice.readPacketGoal(workspace, packetPath)` — `.opencode/plugins/opencode-goal.js:1817-1818`. The stored pointer is that same raw directory (`:1838`), and every later render resolves the packet against it (`resolvePacketGoalForRecord`, `:2701-2704`).
- Core: `bindGoal` resolves through `goalScope.workspace` (`.opencode/hooks/goal/lib/goal-core.cjs:191`), which comes from `resolveRepoRoot` walking up to `.git` or `.opencode/skills` (`.opencode/hooks/goal/lib/goal-core.cjs:135-144`). The pi/cursor/devin adapters inherit that walk because they call the core.
- The packet path in every surface is repository-relative ("`bind <packet-path>` resolves the path inside the workspace", `.opencode/hooks/goal/README.md:60`).

**Reproduction** (fixture workspace under this lineage, packet `specs/pkt/goal.md`, both writers given `scratch/ws/sub` as their directory):

| Surface | Result |
|---|---|
| Core `bindGoal` from the subdirectory | `ok: true`, stored workspace = `scratch/ws` (the walk found the repo root) |
| Plugin `bindGoal` from the subdirectory | `PACKET_GOAL_NOT_FOUND` — "No goal.md at that packet path inside the workspace" |

The same call from the workspace root succeeds on both surfaces and stores identical pointers, so the divergence is the root walk alone.

**Impact**: on the primary runtime, a bind issued while the effective directory is narrower than the repo root fails outright, and a record that carries a narrower workspace keeps failing at render time — the injection silently disappears while the record still reads `status: active`. The core's walk exists to absorb exactly this case, so the two surfaces disagree about what "inside the workspace" means.

**Recommendation**: resolve the workspace through the same repo-root walk the core uses (or refuse a directory that is not a repo root with an explicit error). Report only; no fix in this review.

### F105 — P2 — The plugin's session-free `packet` action omits the budget field its own CLI twin prints

**Dimension**: traceability (surface parity) | **Bears on**: ADR-006 (the budget is reported where a packet is read)

**Evidence**: plugin `packet` returns `packet_path`, `packet_nested`, `packet_durable_chars`, `packet_slice_hash`, `objective_slice`, `chat_slice` (`.opencode/plugins/opencode-goal.js:2989-2995`); the core CLI prints the same block plus `packet_budget=${packet.budgetState}` (`.opencode/hooks/goal/bin/goal.cjs:211`). The plugin's own `bind` does report the budget (`.opencode/plugins/opencode-goal.js:2974-2977`), and the runtime computes it in the shared reader (`.opencode/hooks/goal/lib/goal-slice.cjs:224-226`), so only the `packet` action drops it. Confirmed in the probe: the plugin's `packet` output carried `packet_durable_chars=188` and no budget line.

**Impact**: the session-free read is the surface an operator or a docs sweep uses to check a packet before binding; it reports the size but not the tier the validator will apply, while the identical CLI action does. A caller comparing the two runtimes sees different field sets for one action.

**Recommendation**: emit `packet_budget` from the plugin's `packet` action, as its `bind` already does. Report only; no fix in this review.

## Ruled out

- Plugin `bind` reporting no budget at all: ruled out. The warn/over branch is present at `.opencode/plugins/opencode-goal.js:2974-2977`, and the plain branch still emits `packet_budget=<state>`.
- OpenCode injection carrying no resend reminder (pass-1 F010): ruled out as fixed. `appendGoalBrief` appends `renderResendReminderText` while the copy is behind (`.opencode/plugins/opencode-goal.js:2820-2824`), pinned by `opencode-goal-tool-path.test.cjs:211-221` (present while unresent, cleared after `resent`).
- Planar record `set` dropping the pointer being undocumented: ruled out. The behaviour is now recorded in the target packet's own Known Limitations (`007/implementation-summary.md`, "a new text `set` on a bound record drops the pointer by design, now documented"), so no new finding is raised here.
- Injection preview caps and labels drifting: ruled out at label level. Both builders emit the same marker set and field labels (`goal-core.cjs:420-425`, `opencode-goal.js:2736-2745`); the `usage:` payload differs by design (the core has no token feed) and is documented as such in `README.md:37`.

## Coverage

| Item | Value |
|---|---|
| Dimensions touched | traceability, correctness |
| Files reviewed | `opencode-goal.js:168,1815-1845,2701-2704,2707-2759,2815-2825,2974-2996`, `goal-core.cjs:135-144,191,389-448,887-896,924-957`, `bin/goal.cjs:202-216`, `README.md:37,60` |
| New findings | 2 (P2, P2) |
| Reproduction fidelity | plugin module loaded through its pinned `__test` seam; core compared on the same fixture; both runs against the same packet |

Review verdict: PASS
