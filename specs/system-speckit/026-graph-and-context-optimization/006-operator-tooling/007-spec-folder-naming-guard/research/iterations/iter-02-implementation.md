# Iteration 02 — Concrete Implementation Design (gpt-5.5-fast xhigh)

_Read-only deep-research pass. Source: create.sh / is-phase-parent / validate.sh / validator-registry evidence._

I’ll keep this read-only, load the required project context, then produce a concrete implementation design with file/line evidence.
SKILL ROUTING: Advisor surfaced `sk-code` at confidence 0.88. I’m loading it for stack-aware code research while keeping the task read-only.
I found no direct memory trigger hits, but constitutional context surfaced the naming and tool-routing rules. I’m now reading only the requested files plus the validator rule examples and code-graph status.
Code graph is stale, so I’m not relying on structural graph answers. I’ll use direct file evidence from the requested scripts and rule files.
The key creation paths are now identified: normal mkdir, phase-parent mkdir, child-phase mkdir, and subfolder helper. I’m checking validator dispatch wiring next so the new rule design matches the existing registry contract.
One important wrinkle: `validate.sh` has a Node orchestrator fast path, so a buildable validation rule likely needs registry visibility and parity with the orchestrator path, not only a shell `check-*.sh`. I’m verifying that before finalizing.
For the final design I’ll call out that shell fallback and TypeScript orchestrator both need the rule, because `validate.sh` exits through the orchestrator when available.
I’m doing one targeted directory check for the motivating pattern so the embedded-number algorithm is grounded in the actual track layout.
The prior defect folder is no longer present at the track root, but the parent/child structure exists at `026/.../006-operator-tooling/007-spec-folder-naming-guard`, which is enough to specify the guard logic.
Dist directories do exist; my first glob missed them because I asked for files under `spec/*.js` without checking the directory listing first. I’m verifying the specific dist spec artifacts.
No files edited. Code graph was stale, so I used direct file reads for evidence.

**1. Classification Ruleset**
Evidence: phase-child regex is `^[0-9]{3}-[a-z0-9][a-z0-9-]*$` in `.opencode/skills/system-spec-kit/scripts/spec/is-phase-parent.ts:8` and shell mirror in `.opencode/skills/system-spec-kit/scripts/lib/shell-common.sh:53-67`. Current `create.sh` only enforces loose basename syntax at `.opencode/skills/system-spec-kit/scripts/spec/create.sh:681-687`.

Recommended result type:

```ts
type SpecFolderNamingSeverity = 'OK' | 'WARN' | 'HARD-BLOCK';

interface SpecFolderNamingClassification {
  ok: boolean;
  severity: SpecFolderNamingSeverity;
  reason: string;
  suggestedLocation?: string;
  ruleId?: string;
}
```

Pseudocode:

```ts
function classifyProposedSpecFolder(targetPath: string): SpecFolderNamingClassification {
  const parentDir = resolveExistingParent(dirname(targetPath));
  const name = basename(targetPath);

  if (!/^[0-9]{3}-[A-Za-z0-9._-]+$/.test(name)) {
    return hard('INVALID_BASENAME', 'Spec folder must match NNN-name syntax');
  }

  const strictPhaseChild = /^[0-9]{3}-[a-z0-9][a-z0-9-]*$/;
  const specRoot = nearestSpecsRoot(parentDir);
  const nestedUnderNumberedSpec = ancestorsBetween(specRoot, parentDir)
    .some((part) => /^[0-9]{3}-/.test(part));

  if (nestedUnderNumberedSpec && !strictPhaseChild.test(name)) {
    return hard(
      'INVALID_PHASE_CHILD_SYNTAX',
      'Nested spec/phase child must be lowercase alphanumeric with hyphens only',
      normalizeToStrictName(parentDir, name),
    );
  }

  if (!nestedUnderNumberedSpec) {
    const [, ownNumber, body] = name.match(/^([0-9]{3})-(.+)$/) ?? [];
    for (const embedded of embeddedThreeDigitTokens(body)) {
      const siblings = matchingSiblingDirs(parentDir, embedded); // dirs named `${embedded}-*`
      if (siblings.length === 1 && isPhaseParent(siblings[0])) {
        const residual = removeEmbeddedToken(body, embedded);
        return hard(
          'EMBEDDED_SIBLING_PACKET_NUMBER',
          `${name} embeds existing phase-parent packet ${basename(siblings[0])}`,
          join(siblings[0], `${nextChildNumber(siblings[0])}-${slugify(residual)}`),
        );
      }

      if (siblings.length === 1 && hasSpecIdentity(siblings[0])) {
        return warn(
          'EMBEDDED_SIBLING_PACKET_NUMBER_NON_PHASE_PARENT',
          `${name} embeds existing sibling packet ${basename(siblings[0])}; verify location`,
        );
      }
    }
  }

  const normalizedBody = normalizeSlugBody(name.replace(/^[0-9]{3}-/, ''));
  if (
    /^(fix|cleanup|remediation|research|analysis|implementation|followup|misc|general)$/i.test(normalizedBody) ||
    /^(phase|round|iteration|pass)-[0-9]+$/i.test(normalizedBody)
  ) {
    return warn('GENERIC_STANDALONE_SLUG', 'Slug is generic; use concrete work wording');
  }

  return { ok: true, severity: 'OK', reason: 'Spec folder naming accepted' };
}
```

Hard vs warn boundary:

| Rule | Severity | Why |
|---|---:|---|
| Invalid loose `NNN-name` syntax | HARD-BLOCK | Existing `create.sh` already exits for this class. |
| Nested/phase-child name fails strict regex | HARD-BLOCK | `is_phase_parent` ignores non-strict children, so uppercase/underscore children break structure. |
| Top-level slug embeds `NNN` matching exactly one existing sibling that is a phase parent | HARD-BLOCK | High-confidence mis-location, covers `028-026-program-research`. |
| Top-level slug embeds `NNN` matching a non-phase sibling | WARN | Related-packet naming may be intentional. |
| Generic standalone slug | WARN | Semantic quality signal, subjective enough to avoid blocking. |

**2. Dual-Impl Mechanics**
Use the verified workspaces instead of inventing new roots: root package builds `shared`, `mcp_server`, and `scripts` at `.opencode/skills/system-spec-kit/package.json:6-18`; scripts TS includes `spec/**/*.ts` at `.opencode/skills/system-spec-kit/scripts/tsconfig.json:20-34`; MCP TS includes `lib/**/*.ts` at `.opencode/skills/system-spec-kit/mcp_server/tsconfig.json:37-44`.

Files/functions to add:

| File | Purpose |
|---|---|
| `.opencode/skills/system-spec-kit/shared/spec-folder-naming.ts` | Authoritative pure TS classifier: `classifyProposedSpecFolder(targetPath: string): SpecFolderNamingClassification`. |
| `.opencode/skills/system-spec-kit/scripts/spec/spec-folder-naming.ts` | CLI wrapper compiled to `scripts/dist/spec/spec-folder-naming.js`; emits TSV/JSON for shell. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/spec/spec-folder-naming.ts` | Runtime export/re-export for hooks and validator orchestrator. |
| `.opencode/skills/system-spec-kit/scripts/lib/shell-common.sh` | Add `classify_proposed_spec_folder "$target_path"` shell shim, mirroring existing shared shell helpers at lines `40-67`. |

Shell signature:

```bash
classify_proposed_spec_folder() {
  local target_path="$1"
  # stdout TSV: ok<TAB>severity<TAB>reason<TAB>suggestedLocation
}
```

**3. `create.sh` Integration**
Evidence: `create.sh` sources `shell-common.sh` at `.opencode/skills/system-spec-kit/scripts/spec/create.sh:24-28`.

Add a local gate helper near `validate_spec_folder_basename()` at `create.sh:681-687`:

```bash
run_spec_folder_naming_gate() {
  local target_path="$1"
  local result ok severity reason suggested

  if ! result="$(classify_proposed_spec_folder "$target_path" 2>&1)"; then
    echo "[speckit] Warning: spec-folder naming guard unavailable; proceeding: $result" >&2
    return 0
  fi

  IFS=$'\t' read -r ok severity reason suggested <<< "$result"

  if [[ "$severity" == "HARD-BLOCK" ]]; then
    echo "Error: Spec-folder naming guard blocked: $reason" >&2
    [[ -n "$suggested" ]] && echo "Suggested location: $suggested" >&2
    exit 1
  fi

  [[ "$severity" == "WARN" ]] && echo "[speckit] Warning: $reason" >&2
}
```

Call points:

| Mode | Exact point |
|---|---|
| Subfolder mode | Inside `create_versioned_subfolder()`, after `subfolder_path="$base_folder/$subfolder_name"` at `create.sh:382-383`, before `mkdir -p "$subfolder_path/scratch"` at `create.sh:385-386`. |
| Normal top-level mode | After `FEATURE_DIR` is finalized at `create.sh:1513-1533`, before `mkdir -p "$FEATURE_DIR" "$FEATURE_DIR/scratch"` at `create.sh:1546`. This is the deterministic fix for the `028-026-*` defect. |
| Phase mode parent creation | After `FEATURE_DIR` is resolved at `create.sh:1064-1076`, before parent `mkdir -p "$FEATURE_DIR"` at `create.sh:1078-1079`. |
| Phase mode child creation | After `_child_path="$FEATURE_DIR/$_child_folder"` at `create.sh:1328-1329`, before `mkdir -p "$_child_path"` at `create.sh:1332-1333`. |
| Phase-parent validation child | Inside `scaffold_phase_parent_validation_child()`, after `child_path="$parent_path/$child_name"` at `create.sh:588-590`, before `mkdir -p "$child_path"` at `create.sh:641`. |

Companion cleanup needed before enabling hard phase-child syntax: placeholder child names at `create.sh:588` and `create.sh:1111` contain uppercase `PROVIDE-DESCRIPTIVE-SLUG`; make them lowercase or the new hard gate will correctly block them.

Fail-open behavior: classifier crash, missing dist artifact, malformed output, or unavailable Node prints a warning and proceeds. Classifier `HARD-BLOCK` is not a guard error; it exits `1`.

**4. `validate.sh` Rule**
Evidence: rule metadata comes from `.opencode/skills/system-spec-kit/scripts/lib/validator-registry.json`; `FOLDER_NAMING` is registered at lines `139-144`. Shell rules use `run_check()` and `RULE_*` variables, shown in `.opencode/skills/system-spec-kit/scripts/rules/check-folder-naming.sh:17-57`. `validate.sh` loads registry scripts at `.opencode/skills/system-spec-kit/scripts/spec/validate.sh:370-415` and executes shell rules at `589-711`.

Add:

| File | Change |
|---|---|
| `.opencode/skills/system-spec-kit/scripts/rules/check-semantic-naming.sh` | New `run_check "$folder" "$level"` rule calling `classify_proposed_spec_folder "$folder"`. |
| `.opencode/skills/system-spec-kit/scripts/lib/validator-registry.json` | Add `SEMANTIC_NAMING` after `FOLDER_NAMING`, severity `warn`. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/validation/orchestrator.ts` | Add `validateSemanticNaming(folder)` and push it into `entries`, because `validate.sh` calls `run_node_orchestrator` before shell fallback at `validate.sh:1044`. |

Registry entry:

```json
{
  "rule_id": "SEMANTIC_NAMING",
  "aliases": ["SPEC_FOLDER_SEMANTIC_NAMING"],
  "script_path": "rules/check-semantic-naming.sh",
  "severity": "warn",
  "category": "authored_template",
  "description": "Warns on high-confidence spec-folder semantic mis-location and generic standalone names."
}
```

Validation severity: emit `WARN` for any non-OK classification, including classifier `HARD-BLOCK`. This is catch-later, not creation-time enforcement. Strict validation can still fail on warnings through existing strict behavior.

**5. Minimal Viable Slice**
Ship first: shared classifier with only `EMBEDDED_SIBLING_PACKET_NUMBER` hard rule, wired into normal `create.sh` top-level creation before `create.sh:1546`.

Why: the defect was a canonical creation-path top-level folder whose slug embedded an existing sibling phase-parent number. This one slice blocks `028-026-program-research` deterministically before disk creation, without needing hooks or full validator parity.

**Build Order**
1. Add `classifyProposedSpecFolder()` with the embedded-sibling phase-parent hard rule and CLI/shell shim.
2. Wire normal `create.sh` top-level gate before `mkdir -p "$FEATURE_DIR"`.
3. Add nested strict phase-child syntax and fix lowercase placeholder names in `create.sh`.
4. Wire subfolder, phase-parent, and phase-child create call points.
5. Add `SEMANTIC_NAMING` to shell rules, registry, and TS validation orchestrator.
6. Add best-effort runtime hooks after the canonical creation path and validator are stable.
