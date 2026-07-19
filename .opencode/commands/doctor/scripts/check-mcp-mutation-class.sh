#!/usr/bin/env bash
# ====================================================================
# check-mcp-mutation-class.sh — Mutation-class contract guard for the
#                               mcp-* install / doctor surface
# ====================================================================
# Enforces the read-only / mutating contract declared in the install
# doctor manifest. Two real bugs shipped because nothing held the line:
#   - a doctor.sh that connected to every MCP server (read-only violated)
#   - an install.sh that wiped a global cache under --dry-run
# This check is the net so a "read-only" doctor that later grows a
# network or mutation call fails before it merges.
#
# Manifest (source of truth for declared class):
#   .opencode/commands/doctor/assets/doctor-mcp-install.yaml
#     servers[*].install_script + .install_script_mutation_class
#     cli_skill_diagnostics[*].install_script / .doctor_script
#       + their *_mutation_class fields
# Plus nested embedded-server installers discovered on disk:
#   .opencode/skills/mcp-*/mcp-servers/*/setup.sh  (treated as mutating)
#
# Contract enforced:
#   read-only scripts (doctors) — FAIL on an unguarded mutation or an
#     unbounded network call:
#       - rm -rf
#       - append-redirect into a shell profile (>> ~/.bashrc|.zshrc|.profile|.bash_profile)
#       - npm i -g / npm install -g
#       - pipx install / pip install (not behind an obvious guard)
#       - network without a timeout: `claude mcp ...`, curl/wget without
#         `timeout`, npx without BOTH --no-install and timeout
#     Clearly-local reads are allow-listed (command -v, node -e require,
#     node --check, --version/--help probes, pip --version, grep/cat...).
#   mutating scripts (installers) — only assert they ARE labeled
#     `mutating` in the manifest. Mutation is expected; not forbidden.
#
# Exit codes:
#   0 — contract holds
#   1 — a violation or a missing/wrong manifest label (see FAIL lines)
#   2 — harness error (manifest unreadable, python3 missing)
#
# Usage: check-mcp-mutation-class.sh [repo-root]
set -euo pipefail

ROOT="${1:-$(git rev-parse --show-toplevel 2>/dev/null || pwd)}"
MANIFEST="$ROOT/.opencode/commands/doctor/assets/doctor-mcp-install.yaml"

command -v python3 >/dev/null 2>&1 || { echo "ERROR: python3 required" >&2; exit 2; }
[ -f "$MANIFEST" ] || { echo "ERROR: manifest not found: $MANIFEST" >&2; exit 2; }

overall_exit=0

# ── Build the (script_path<TAB>declared_class<TAB>origin) work list ──
# The manifest is the source of truth for declared class; nested
# mcp-servers/*/setup.sh are discovered on disk (no manifest row) and
# asserted to be mutating installers.
WORKLIST="$(
  ROOT="$ROOT" MANIFEST="$MANIFEST" python3 - <<'PY'
import os, sys, yaml, glob

root = os.environ["ROOT"]
manifest = os.environ["MANIFEST"]
doc = yaml.safe_load(open(manifest)) or {}
rows = []  # (abs_path, declared_class, origin_label)

def add(skill_dir, rel, klass, origin):
    if not rel or not skill_dir:
        return
    rows.append((os.path.join(root, skill_dir, rel), str(klass), origin))

# servers[*]: install_script + install_script_mutation_class
for name, sdef in (doc.get("servers") or {}).items():
    sdef = sdef or {}
    add(sdef.get("skill_dir"), sdef.get("install_script"),
        sdef.get("install_script_mutation_class", "MISSING"),
        f"servers.{name}.install_script")

# cli_skill_diagnostics[*]: install_script + doctor_script (+ classes)
for name, sdef in (doc.get("cli_skill_diagnostics") or {}).items():
    sdef = sdef or {}
    add(sdef.get("skill_dir"), sdef.get("install_script"),
        sdef.get("install_script_mutation_class", "MISSING"),
        f"cli_skill_diagnostics.{name}.install_script")
    add(sdef.get("skill_dir"), sdef.get("doctor_script"),
        sdef.get("doctor_script_mutation_class", "MISSING"),
        f"cli_skill_diagnostics.{name}.doctor_script")

# Discovered nested embedded-server installers (not in the manifest).
for p in sorted(glob.glob(os.path.join(root, ".opencode/skills/mcp-*/mcp-servers/*/setup.sh"))):
    rows.append((p, "mutating", "discovered:mcp-servers/*/setup.sh"))

for path, klass, origin in rows:
    print(f"{path}\t{klass}\t{origin}")
PY
)"

if [ -z "${WORKLIST//[$'\n\t ']/}" ]; then
  echo "ERROR: no scripts resolved from manifest — parse problem?" >&2
  exit 2
fi

# ── Code-only view of a script (real line numbers preserved) ────────
# Forbidden tokens are legitimately MENTIONED in doctor help/warning
# text and comments (e.g. err "do NOT 'npm i -g figma-cli'"). Matching
# raw lines would false-positive on those. So we emit, per line:
#   <lineno>:<code>
# where <code> has the trailing # comment removed AND the contents of
# single/double-quoted strings blanked. Only real, executable shell
# tokens survive — so a pattern that hits is an actual call, not prose.
code_view() {
  python3 - "$1" <<'PY'
import sys, re
path = sys.argv[1]
sq = re.compile(r"'[^']*'")        # '...'  (no escapes inside single quotes in sh)
dq = re.compile(r'"(\\.|[^"\\])*"') # "..." with escapes
for i, raw in enumerate(open(path, encoding="utf-8", errors="replace"), 1):
    line = raw.rstrip("\n")
    # Blank quoted-string CONTENTS first (keep delimiters so structure stays).
    line = dq.sub('""', line)
    line = sq.sub("''", line)
    # Strip a trailing comment (# not inside a now-blanked string; conservative:
    # cut at the first ' #' or a line-leading #).
    line = re.sub(r'(^|\s)#.*$', r'\1', line)
    print(f"{i}:{line}")
PY
}

# ── Scanner: forbidden patterns in a read-only script ───────────────
# Reads the code-only view (real line numbers) and emits "LINE:reason"
# per violation; silent when clean. Each grep runs over <lineno>:<code>
# so the emitted number is the true file line.
scan_readonly() {
  local file="$1" cv
  cv="$(code_view "$file")"

  # rm -rf  (any flag order)
  printf '%s\n' "$cv" | grep -E ':[^:]*\brm[[:space:]]+-[a-zA-Z]*(rf|fr|r[a-zA-Z]*f|f[a-zA-Z]*r)\b' \
    | sed -E 's/^([0-9]+):.*/\1 ::rm -rf (destructive delete)/' || true

  # append-redirect into a shell profile
  printf '%s\n' "$cv" | grep -E '>>[[:space:]]*[^|&;]*\.(bashrc|zshrc|profile|bash_profile)\b' \
    | sed -E 's/^([0-9]+):.*/\1 ::append into shell profile (persistent env mutation)/' || true

  # global npm install (npm i -g / npm install -g, flag in any position)
  printf '%s\n' "$cv" | grep -E ':[^:]*\bnpm[[:space:]]+(i|install)\b[^|&;]*[[:space:]](-g|--global)\b' \
    | sed -E 's/^([0-9]+):.*/\1 ::npm install -g (global package mutation)/' || true

  # pipx install / pip install — flag unless the line is an obvious guard
  # (command -v) or a version probe. `pip --version` never matches "install".
  printf '%s\n' "$cv" \
    | grep -E ':[^:]*(\bpipx[[:space:]]+install\b|\bpip[0-9]?[[:space:]]+install\b|-m[[:space:]]+pip[[:space:]]+install\b)' \
    | grep -vE 'command -v|--version' \
    | sed -E 's/^([0-9]+):.*/\1 ::pip\/pipx install (package mutation)/' || true

  # network: `claude mcp <sub>` — connects/lists servers; unbounded.
  printf '%s\n' "$cv" | grep -E ':[^:]*\bclaude[[:space:]]+mcp\b' \
    | sed -E 's/^([0-9]+):.*/\1 ::claude mcp (network\/server connect)/' || true

  # network: curl / wget without a timeout
  printf '%s\n' "$cv" | grep -E ':[^:]*\b(curl|wget)\b' \
    | grep -vE 'timeout[[:space:]]|--max-time|--connect-timeout|-m[[:space:]]+[0-9]|--timeout' \
    | sed -E 's/^([0-9]+):.*/\1 ::curl\/wget without a timeout (unbounded network)/' || true

  # network: npx that actually executes (not `command -v npx`) must carry
  # BOTH --no-install and a timeout to count as a bounded read.
  printf '%s\n' "$cv" | grep -E ':[^:]*\bnpx\b' \
    | grep -vE 'command -v[[:space:]]+npx' \
    | grep -vE '\bnpx\b[^|&;]*--no-install' \
    | sed -E 's/^([0-9]+):.*/\1 ::npx without --no-install (may fetch from network)/' || true
  printf '%s\n' "$cv" | grep -E ':[^:]*\bnpx\b' \
    | grep -vE 'command -v[[:space:]]+npx' \
    | grep -vE 'timeout[[:space:]]' \
    | sed -E 's/^([0-9]+):.*/\1 ::npx without a timeout (unbounded network)/' || true
}

# ── Walk the work list ──────────────────────────────────────────────
echo "== MCP mutation-class contract =="
while IFS=$'\t' read -r path klass origin; do
  [ -n "$path" ] || continue
  rel="${path#"$ROOT"/}"

  # Manifest hygiene: a manifest-declared script must carry a known class.
  if [ "$klass" = "MISSING" ]; then
    printf '  FAIL  %s  [no mutation_class declared in manifest (%s)]\n' "$rel" "$origin"
    overall_exit=1
    continue
  fi

  case "$klass" in
    read-only)
      if [ ! -f "$path" ]; then
        printf '  FAIL  %s  [declared read-only but file is missing]\n' "$rel"
        overall_exit=1
        continue
      fi
      findings="$(scan_readonly "$path")"
      if [ -n "$findings" ]; then
        # findings lines look like:  <lineno> ::<reason>
        while IFS= read -r f; do
          [ -n "$f" ] || continue
          lineno="${f%% *}"
          reason="${f##*::}"
          printf '  FAIL  %s:%s  [read-only script: %s]\n' "$rel" "$lineno" "$reason"
        done <<< "$findings"
        overall_exit=1
      else
        printf '  PASS  %s  [read-only — no unguarded mutation/network]\n' "$rel"
      fi
      ;;
    mutating)
      # Installers: only assert the label is present (it is, since klass==mutating).
      # Mutation is expected here; do not scan/forbid. Just confirm the file exists.
      if [ -f "$path" ]; then
        printf '  PASS  %s  [mutating — installer, label present]\n' "$rel"
      else
        printf '  PASS  %s  [mutating — declared, file absent (optional installer)]\n' "$rel"
      fi
      ;;
    none)
      # Explicit "no script" sentinel (install_script: null). Nothing to scan.
      printf '  PASS  %s  [declared none — no script]\n' "$origin"
      ;;
    *)
      printf '  FAIL  %s  [unknown mutation_class %q (%s)]\n' "$rel" "$klass" "$origin"
      overall_exit=1
      ;;
  esac
done <<< "$WORKLIST"

# ── Summary ─────────────────────────────────────────────────────────
if [ "$overall_exit" -eq 0 ]; then
  echo "GUARD PASS — read-only doctors carry no unguarded mutation/network; installers labeled mutating"
else
  echo "GUARD FAIL — see FAIL lines above" >&2
fi

exit "$overall_exit"
