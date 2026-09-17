## Edit 1

File: `.gitignore`

OLD:

~~~~text
!.opencode/
!specs
~~~~

NEW:

~~~~text
!.opencode/
!.skilled/
!specs
~~~~

## Edit 2

File: `.gitignore`

OLD:

~~~~text
.opencode/output/

# ───────────────────────────────────────────
~~~~

NEW:

~~~~text
.opencode/output/
.skilled/output/

# ───────────────────────────────────────────
~~~~

## Edit 3

File: `.gitignore`

OLD:

~~~~text
.opencode/skills/system-skill-advisor/runtime/lib/**/*.js
.opencode/skills/system-skill-advisor/runtime/lib/**/*.js.map
.opencode/skills/system-skill-advisor/runtime/lib/**/*.d.ts
.opencode/skills/system-skill-advisor/runtime/lib/**/*.d.ts.map
.opencode/skills/system-skill-advisor/runtime/schemas/**/*.js
.opencode/skills/system-skill-advisor/runtime/schemas/**/*.js.map
.opencode/skills/system-skill-advisor/runtime/schemas/**/*.d.ts
.opencode/skills/system-skill-advisor/runtime/schemas/**/*.d.ts.map

# ───────────────────────────────────────────
~~~~

NEW:

~~~~text
.opencode/skills/system-skill-advisor/runtime/lib/**/*.js
.skilled/skills/system-skill-advisor/runtime/lib/**/*.js
.opencode/skills/system-skill-advisor/runtime/lib/**/*.js.map
.skilled/skills/system-skill-advisor/runtime/lib/**/*.js.map
.opencode/skills/system-skill-advisor/runtime/lib/**/*.d.ts
.skilled/skills/system-skill-advisor/runtime/lib/**/*.d.ts
.opencode/skills/system-skill-advisor/runtime/lib/**/*.d.ts.map
.skilled/skills/system-skill-advisor/runtime/lib/**/*.d.ts.map
.opencode/skills/system-skill-advisor/runtime/schemas/**/*.js
.skilled/skills/system-skill-advisor/runtime/schemas/**/*.js
.opencode/skills/system-skill-advisor/runtime/schemas/**/*.js.map
.skilled/skills/system-skill-advisor/runtime/schemas/**/*.js.map
.opencode/skills/system-skill-advisor/runtime/schemas/**/*.d.ts
.skilled/skills/system-skill-advisor/runtime/schemas/**/*.d.ts
.opencode/skills/system-skill-advisor/runtime/schemas/**/*.d.ts.map
.skilled/skills/system-skill-advisor/runtime/schemas/**/*.d.ts.map

# ───────────────────────────────────────────
~~~~

## Edit 4

File: `.gitignore`

OLD:

~~~~text
.opencode/skills/system-spec-kit/runtime/lib/**/*.js
.opencode/skills/system-spec-kit/runtime/lib/**/*.js.map
.opencode/skills/system-spec-kit/runtime/lib/**/*.d.ts
.opencode/skills/system-spec-kit/runtime/lib/**/*.d.ts.map
.opencode/skills/system-spec-kit/shared/**/*.js
.opencode/skills/system-spec-kit/shared/**/*.js.map
.opencode/skills/system-spec-kit/shared/**/*.d.ts
# The hand-written ambient declaration for js-yaml is source, not emitted output; the shared build fails without it on a clean checkout.
!.opencode/skills/system-spec-kit/shared/js-yaml.d.ts
.opencode/skills/system-spec-kit/shared/**/*.d.ts.map
.opencode/skills/system-spec-kit/runtime/cli/tests/*.vitest.d.ts.map
.opencode/skills/system-spec-kit/runtime/cli/tests/*.vitest.js.map

# ═══════════════════════════════════════════════════════════════════════════════
~~~~

NEW:

~~~~text
.opencode/skills/system-spec-kit/runtime/lib/**/*.js
.skilled/skills/system-spec-kit/runtime/lib/**/*.js
.opencode/skills/system-spec-kit/runtime/lib/**/*.js.map
.skilled/skills/system-spec-kit/runtime/lib/**/*.js.map
.opencode/skills/system-spec-kit/runtime/lib/**/*.d.ts
.skilled/skills/system-spec-kit/runtime/lib/**/*.d.ts
.opencode/skills/system-spec-kit/runtime/lib/**/*.d.ts.map
.skilled/skills/system-spec-kit/runtime/lib/**/*.d.ts.map
.opencode/skills/system-spec-kit/shared/**/*.js
.skilled/skills/system-spec-kit/shared/**/*.js
.opencode/skills/system-spec-kit/shared/**/*.js.map
.skilled/skills/system-spec-kit/shared/**/*.js.map
.opencode/skills/system-spec-kit/shared/**/*.d.ts
.skilled/skills/system-spec-kit/shared/**/*.d.ts
# The hand-written ambient declaration for js-yaml is source, not emitted output; the shared build fails without it on a clean checkout.
!.opencode/skills/system-spec-kit/shared/js-yaml.d.ts
!.skilled/skills/system-spec-kit/shared/js-yaml.d.ts
.opencode/skills/system-spec-kit/shared/**/*.d.ts.map
.skilled/skills/system-spec-kit/shared/**/*.d.ts.map
.opencode/skills/system-spec-kit/runtime/cli/tests/*.vitest.d.ts.map
.skilled/skills/system-spec-kit/runtime/cli/tests/*.vitest.d.ts.map
.opencode/skills/system-spec-kit/runtime/cli/tests/*.vitest.js.map
.skilled/skills/system-spec-kit/runtime/cli/tests/*.vitest.js.map

# ═══════════════════════════════════════════════════════════════════════════════
~~~~

## Edit 5

File: `.gitignore`

OLD:

~~~~text
.opencode/skills/.state/*/*
!.opencode/skills/.state/*/README.md
# Pre-consolidation state directories still written by some tooling. They are
# runtime output, so they stay untracked wherever they reappear.
.opencode/skills/.authority-state/
.opencode/skills/.spec-gate-state/

# ───────────────────────────────────────────
~~~~

NEW:

~~~~text
.opencode/skills/.state/*/*
.skilled/skills/.state/*/*
!.opencode/skills/.state/*/README.md
!.skilled/skills/.state/*/README.md
# Pre-consolidation state directories still written by some tooling. They are
# runtime output, so they stay untracked wherever they reappear.
.opencode/skills/.authority-state/
.skilled/skills/.authority-state/
.opencode/skills/.spec-gate-state/
.skilled/skills/.spec-gate-state/

# ───────────────────────────────────────────
~~~~

## Edit 6

File: `.gitignore`

OLD:

~~~~text
.opencode/skills/system-deep-loop/runtime/database/*.sqlite
.opencode/skills/system-deep-loop/runtime/database/*.sqlite-shm
.opencode/skills/system-deep-loop/runtime/database/*.sqlite-wal
.opencode/skills/system-deep-loop/runtime/database/*.sqlite.bak*
.opencode/skills/system-deep-loop/runtime/database/observability-events.jsonl

# ───────────────────────────────────────────
~~~~

NEW:

~~~~text
.opencode/skills/system-deep-loop/runtime/database/*.sqlite
.skilled/skills/system-deep-loop/runtime/database/*.sqlite
.opencode/skills/system-deep-loop/runtime/database/*.sqlite-shm
.skilled/skills/system-deep-loop/runtime/database/*.sqlite-shm
.opencode/skills/system-deep-loop/runtime/database/*.sqlite-wal
.skilled/skills/system-deep-loop/runtime/database/*.sqlite-wal
.opencode/skills/system-deep-loop/runtime/database/*.sqlite.bak*
.skilled/skills/system-deep-loop/runtime/database/*.sqlite.bak*
.opencode/skills/system-deep-loop/runtime/database/observability-events.jsonl
.skilled/skills/system-deep-loop/runtime/database/observability-events.jsonl

# ───────────────────────────────────────────
~~~~

## Edit 7

File: `.gitignore`

OLD:

~~~~text
.opencode/skills/system-skill-advisor/runtime/database/*.db
.opencode/skills/system-skill-advisor/runtime/database/*.db-*
.opencode/skills/system-skill-advisor/runtime/database/*.sqlite
.opencode/skills/system-skill-advisor/runtime/database/*.sqlite-*
.opencode/skills/system-skill-advisor/runtime/database/*.sqlite.bak*
.opencode/skills/system-skill-advisor/runtime/database/.system-skill-advisor-launcher.json
.opencode/skills/system-skill-advisor/runtime/database/.system-skill-advisor-launcher.lockdir/
.opencode/skills/system-skill-advisor/runtime/database/skill-graph.json

# ───────────────────────────────────────────
~~~~

NEW:

~~~~text
.opencode/skills/system-skill-advisor/runtime/database/*.db
.skilled/skills/system-skill-advisor/runtime/database/*.db
.opencode/skills/system-skill-advisor/runtime/database/*.db-*
.skilled/skills/system-skill-advisor/runtime/database/*.db-*
.opencode/skills/system-skill-advisor/runtime/database/*.sqlite
.skilled/skills/system-skill-advisor/runtime/database/*.sqlite
.opencode/skills/system-skill-advisor/runtime/database/*.sqlite-*
.skilled/skills/system-skill-advisor/runtime/database/*.sqlite-*
.opencode/skills/system-skill-advisor/runtime/database/*.sqlite.bak*
.skilled/skills/system-skill-advisor/runtime/database/*.sqlite.bak*
.opencode/skills/system-skill-advisor/runtime/database/.system-skill-advisor-launcher.json
.skilled/skills/system-skill-advisor/runtime/database/.system-skill-advisor-launcher.json
.opencode/skills/system-skill-advisor/runtime/database/.system-skill-advisor-launcher.lockdir/
.skilled/skills/system-skill-advisor/runtime/database/.system-skill-advisor-launcher.lockdir/
.opencode/skills/system-skill-advisor/runtime/database/skill-graph.json
.skilled/skills/system-skill-advisor/runtime/database/skill-graph.json

# ───────────────────────────────────────────
~~~~

## Edit 8

File: `.gitignore`

OLD:

~~~~text
.opencode/skills/*/mcp-server/database/.*-owner.json
.opencode/skills/*/runtime/database/.*-owner.json
.opencode/skills/*/mcp-server/database/.*-launcher.lockdir/
.opencode/skills/*/runtime/database/.*-launcher.lockdir/
**/database/.crash-probe-receipt
~~~~

NEW:

~~~~text
.opencode/skills/*/mcp-server/database/.*-owner.json
.skilled/skills/*/mcp-server/database/.*-owner.json
.opencode/skills/*/runtime/database/.*-owner.json
.skilled/skills/*/runtime/database/.*-owner.json
.opencode/skills/*/mcp-server/database/.*-launcher.lockdir/
.skilled/skills/*/mcp-server/database/.*-launcher.lockdir/
.opencode/skills/*/runtime/database/.*-launcher.lockdir/
.skilled/skills/*/runtime/database/.*-launcher.lockdir/
**/database/.crash-probe-receipt
~~~~

## Edit 9

File: `.gitignore`

OLD:

~~~~text
.opencode/commands/deep/assets/compiled/manifest.jsonl

# ───────────────────────────────────────────
~~~~

NEW:

~~~~text
.opencode/commands/deep/assets/compiled/manifest.jsonl
.skilled/commands/deep/assets/compiled/manifest.jsonl

# ───────────────────────────────────────────
~~~~

## Edit 10

File: `.gitignore`

OLD:

~~~~text
.opencode/skills/system-skill-advisor/runtime/config/route-exclusions.local.json
.opencode/skills/system-skill-advisor/runtime/data/shadow-deltas.jsonl
.opencode/skills/system-skill-advisor/runtime/data/shadow-deltas.jsonl.*

# ───────────────────────────────────────────
~~~~

NEW:

~~~~text
.opencode/skills/system-skill-advisor/runtime/config/route-exclusions.local.json
.skilled/skills/system-skill-advisor/runtime/config/route-exclusions.local.json
.opencode/skills/system-skill-advisor/runtime/data/shadow-deltas.jsonl
.skilled/skills/system-skill-advisor/runtime/data/shadow-deltas.jsonl
.opencode/skills/system-skill-advisor/runtime/data/shadow-deltas.jsonl.*
.skilled/skills/system-skill-advisor/runtime/data/shadow-deltas.jsonl.*

# ───────────────────────────────────────────
~~~~

## Edit 11

File: `.gitignore`

OLD:

~~~~text
.opencode/skills/system-spec-kit/runtime/.opencode/
.opencode/skills/system-spec-kit/runtime/skill_advisor/scripts/out/*.json

# ───────────────────────────────────────────
~~~~

NEW:

~~~~text
.opencode/skills/system-spec-kit/runtime/.opencode/
.skilled/skills/system-spec-kit/runtime/.opencode/
.opencode/skills/system-spec-kit/runtime/skill_advisor/scripts/out/*.json
.skilled/skills/system-spec-kit/runtime/skill_advisor/scripts/out/*.json

# ───────────────────────────────────────────
~~~~

## Edit 12

File: `.gitignore`

OLD:

~~~~text
/*/**/.opencode/logs/
/*/**/.opencode/skills/.advisor-state/
/*/**/.opencode/skills/.spec-gate-state/
# Runtime state was consolidated under .state/, but the leak these rules catch
~~~~

NEW:

~~~~text
/*/**/.opencode/logs/
/*/**/.skilled/logs/
/*/**/.opencode/skills/.advisor-state/
/*/**/.skilled/skills/.advisor-state/
/*/**/.opencode/skills/.spec-gate-state/
/*/**/.skilled/skills/.spec-gate-state/
# Runtime state was consolidated under .state/, but the leak these rules catch
~~~~

## Edit 13

File: `.gitignore`

OLD:

~~~~text
/*/**/.opencode/skills/.state/

# ───────────────────────────────────────────
~~~~

NEW:

~~~~text
/*/**/.opencode/skills/.state/
/*/**/.skilled/skills/.state/

# ───────────────────────────────────────────
~~~~

## Edit 14

File: `.gitignore`

OLD:

~~~~text
.opencode/bin/lib/compiled-routing/*/activation/manifest-race-*/
.opencode/bin/lib/compiled-routing/*/activation/manifest-test-*/
.opencode/bin/tests/.sandboxes/

# ───────────────────────────────────────────
~~~~

NEW:

~~~~text
.opencode/bin/lib/compiled-routing/*/activation/manifest-race-*/
.skilled/bin/lib/compiled-routing/*/activation/manifest-race-*/
.opencode/bin/lib/compiled-routing/*/activation/manifest-test-*/
.skilled/bin/lib/compiled-routing/*/activation/manifest-test-*/
.opencode/bin/tests/.sandboxes/
.skilled/bin/tests/.sandboxes/

# ───────────────────────────────────────────
~~~~

## Edit 15

File: `.gitignore`

OLD:

~~~~text
.opencode/agents/.provider-backups/
.opencode/skills/system-spec-kit/manual-testing-playbook/_sandbox/*/fixtures/states/*.tar.gz
/fixtures/
~~~~

NEW:

~~~~text
.opencode/agents/.provider-backups/
.skilled/agents/.provider-backups/
.opencode/skills/system-spec-kit/manual-testing-playbook/_sandbox/*/fixtures/states/*.tar.gz
.skilled/skills/system-spec-kit/manual-testing-playbook/_sandbox/*/fixtures/states/*.tar.gz
/fixtures/
~~~~

## Edit 16

File: `.gitignore`

OLD:

~~~~text
.opencode/barter
specs/ai-systems
~~~~

NEW:

~~~~text
.opencode/barter
.skilled/barter
specs/ai-systems
~~~~

## Edit 17

File: `.gitignore`

OLD:

~~~~text
.opencode/hooks/hook-flags.env

# ───────────────────────────────────────────
~~~~

NEW:

~~~~text
.opencode/hooks/hook-flags.env
.skilled/hooks/hook-flags.env

# ───────────────────────────────────────────
~~~~

## Edit 18

File: `.gitignore`

OLD:

~~~~text
.opencode/skills/system-spec-kit/runtime/database/
~~~~

NEW:

~~~~text
.opencode/skills/system-spec-kit/runtime/database/
.skilled/skills/system-spec-kit/runtime/database/
~~~~
