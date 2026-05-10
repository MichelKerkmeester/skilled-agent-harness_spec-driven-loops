# Iteration 006 — Adversarial / Skeptic Review

**Stance:** Assume prior reviewers were over-confident. Hunt for missed issues.

## Findings (P0/P1/P2 — adversarial)

### NEW P0 (issues prior iters missed entirely)

1. **Deep-review state is not replayable even though iteration artifacts exist.**
   Evidence: `review/deep-review-state.jsonl:1` contains only the init event. It has no iteration records for `001` through `005`, no `findingsNew`, no dimensions covered, and no convergence data. `find review/iterations -name 'iteration-*.md'` now shows `iteration-001.md` through `iteration-005.md`, but `review/deep-review-strategy.md:60-63` still marks D1-D4 as `[pending]`.
   This violates the `sk-deep-review` contract that every iteration appends JSONL state and updates strategy. A final iteration cannot truthfully claim convergence or synthesize from reducer state until the JSONL/strategy state is repaired.

### NEW P1

1. **Deleting `.opencode/skills/mcp-figma/` broke live user-facing source links and a global install-guide symlink.**
   Evidence:
   - `.opencode/install_guides/MCP - Figma.md` is a symlink to `../skill/mcp-figma/INSTALL_GUIDE.md`; `test -e .opencode/install_guides/MCP\ -\ Figma.md` exits `1`.
   - `.opencode/install_guides/README.md:83` still advertises `[MCP - Figma.md](./MCP%20-%20Figma.md)` as a symlink install guide.
   - The deleted target is confirmed by `test -d .opencode/skills/mcp-figma` exit `1`.
   Earlier Phase 3 checks searched `.opencode/skills/` and mcp-code-mode, but this broken symlink lives outside that scope and is exactly the kind of non-test dependency the deletion could break.

2. **Both shipped Figma agents link to the deleted `mcp-figma` source skill.**
   Evidence:
   - `AI_Systems/Barter/MCP Agents/Figma/README.md:674-677` links to `../../../../Code_Environment/Public/.opencode/skills/mcp-figma/{INSTALL_GUIDE.md,README.md,SKILL.md,changelog/}`.
   - `AI_Systems/Public/Figma/README.md:674-677` has the same dead links.
   - Both Combined Workflows docs repeat deleted source references at `knowledge base/reference/Figma - Reference - Combined Workflows - v0.100.md:1068-1070`.
   - The target files do not exist: `test -f .../.opencode/skills/mcp-figma/INSTALL_GUIDE.md` and `test -f .../.opencode/skills/mcp-figma/SKILL.md` both exit `1`.
   This is a real post-removal regression: user-facing Resources sections now route readers to a removed skill.

3. **Public/Figma local-bundled setup still points at the Barter repo path.**
   Evidence:
   - `AI_Systems/Public/Figma/INSTALL_GUIDE.md:401-414` shows a local `node` config with `cwd` set to `/Users/michelkerkmeester/MEGA/Development/AI_Systems/Barter/MCP Agents/Figma/mcp servers/figma-mcp-stdio`.
   - `AI_Systems/Public/Figma/mcp servers/figma-mcp-stdio/config-snippets.md:112-127` repeats a Barter path template.
   A user following the Public guide's local-bundled path will launch the Barter bundle, not the Public bundle. The line `Adjust cwd` in config snippets weakens but does not remove the defect because the main install guide uses a concrete wrong absolute path.

### NEW P2

1. **System Prompt references a non-existent `references/tool_reference.md`.**
   Evidence: both System Prompt copies list `references/tool_reference.md` as "All 18 MCP tools documented" at `knowledge base/system/Figma - System - Prompt - v0.100.md:83`. No such file exists at `Figma/references/tool_reference.md` or `Figma/knowledge base/system/references/tool_reference.md` in either Barter or Public. The actual tool catalog lives in `knowledge base/integrations/Figma - Integrations - MCP Knowledge - v0.100.md`, so behavior can still work, but the reference architecture has a dead path.

2. **`verify.sh` is a reachability check, not the documented MCP protocol verification.**
   Evidence: running `bash "mcp servers/figma-mcp-http/verify.sh"` in both Barter and Public exits `0`, but the output says `Empty or non-MCP response — endpoint reachable but protocol layer untested`. The install guide says this "checks DNS, HTTPS reachability, and MCP protocol response" at `INSTALL_GUIDE.md:606`. The script is useful, but its success code overstates protocol verification.

### Re-classified Findings (prior iter said X, actually Y)

1. **Iteration 004 classified AGENTS.md drift as P2; under the formal Phase 2 byte-equivalence contract it is at least P1.**
   Evidence: `diff -rq Barter/MCP\ Agents/Figma Public/Figma` reports `Files .../AGENTS.md and .../AGENTS.md differ`. The exact diff is Barter `AGENTS.md:181` `### Step 7 Detail: Figma Operations Pipeline` versus Public `AGENTS.md:181` `### Figma Operations Pipeline`. Phase 2 checklist says `Public/Figma/AGENTS.md` must be byte-equivalent to Barter at `002-public-figma-agent/checklist.md:57`, and `CHK-027` at `:64` only allows context, README, and node_modules differences. Behavior impact is low, but the contract is explicit.

2. **Parent `validate.sh --strict` PASS is not enough to clear the packet.**
   Evidence: parent validation exits `0` with `RESULT: PASSED`, but every child still fails independent strict validation:
   - `001-barter-figma-agent`: exit `2`, `TEMPLATE_SOURCE` missing, 25 template header issues, 47 anchor issues, 9 frontmatter memory block issues.
   - `002-public-figma-agent`: exit `2`, `TEMPLATE_SOURCE` missing, 26 template header issues, 54 anchor issues, 9 frontmatter memory block issues.
   - `003-mcp-figma-skill-removal`: exit `2`, `TEMPLATE_SOURCE` missing, 26 template header issues, 54 anchor issues, 10 frontmatter memory block issues.
   Parent `spec.md:108` says each phase must pass `validate.sh` independently before the next phase begins. So the parent PASS is a phase-parent validator limitation, not a packet-level clean bill.

## Adversarial Verifications (each contradicts a prior PASS)

| Prior PASS Claim | Re-verification Result | Evidence |
|---|---|---|
| "Barter/Public AGENTS.md parity PASS" | FAILED | `diff -rq Barter/MCP\ Agents/Figma Public/Figma` reports `AGENTS.md` differs; `cmp -s .../AGENTS.md .../AGENTS.md` exits `1`; only heading line 181 differs. |
| "Byte-equivalent except expected README/context/node_modules differences" | WEAKENED | `cmp -s INSTALL_GUIDE.md` exits `0` and System Prompt `cmp` exits `0`, but AGENTS parity fails. No CRLF/BOM issue found by `file`, so this is real content drift. |
| "mcp-figma deletion did not break non-test dependencies" | FAILED | Broken symlink `.opencode/install_guides/MCP - Figma.md -> ../skill/mcp-figma/INSTALL_GUIDE.md`; README and KB source links point to deleted `.opencode/skills/mcp-figma/*`. |
| "Install-guide path works if a user follows it" | FAILED for Public local-bundled path | `Public/Figma/INSTALL_GUIDE.md:410` hardcodes the Barter `cwd`; Public `config-snippets.md:121` also templates Barter. |
| "System Prompt DAG/references resolve" | WEAKENED | AGENTS DAG paths exist, but System Prompt `references/tool_reference.md` at line 83 does not exist in either repo. |
| "verify.sh works as documented" | WEAKENED | Script exits `0`, but prints `protocol layer untested`; it verifies reachability more than protocol behavior. |
| "Hook F current state is one known sk-code failure" | RECONFIRMED | Targeted `npx vitest run advisor-corpus-parity ... python-ts-parity ... advisor-graph-health ...` produced 2 passed files and 1 failed file: `advisor-graph-health` fails on `sk-code` `reference-category`. |
| "mcp-code-mode mcp-figma skill-name strip" | RECONFIRMED | SQLite `skill_edges` has no figma targets; `.opencode/skills/mcp-code-mode` no longer has live `mcp-figma` skill-name refs. Remaining grep hits are telemetry/history/comments or binary DB snapshots. |

## Verdict

ADVERSARIAL: FAIL

The core Figma agent behavior looks mostly intact, but the packet is not done. It has active P0 review-state corruption plus unresolved P0/P1 traceability failures from earlier iterations, and this pass adds concrete post-deletion broken links and setup-path regressions that prior reviewers missed.

## Confidence Assessment

MEDIUM — high confidence in the specific findings above because they are direct filesystem, diff, validator, and test evidence. Medium overall because the repo has concurrent dirty-tree work and review artifacts appeared while this iteration was running; the final pass should first stabilize/replay the review state before making convergence claims.

## Next Focus (for iteration 7)

Final convergence should not search broadly first. It should adjudicate and group remediation:

1. Repair review state: append missing JSONL iteration records or explicitly mark the manual review corpus non-reducer-backed, then update strategy coverage.
2. Fix live broken links from `mcp-figma` deletion: `.opencode/install_guides` symlink/README, Barter/Public README Resources, and Combined Workflows source references.
3. Fix Public local-bundled `cwd` examples.
4. Decide whether child spec strict failures/checklists are remediation scope or accepted historical debt; do not let parent strict PASS mask child failures.
5. Update formal Phase 2/3 docs for D9 internal-scope, ADR-005 revised bundling, and Hook F one-failure state.
