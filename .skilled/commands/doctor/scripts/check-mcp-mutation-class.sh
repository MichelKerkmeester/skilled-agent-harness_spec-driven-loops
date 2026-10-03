#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: MCP MUTATION CLASS GUARD
# ───────────────────────────────────────────────────────────────
# Enforces the read-only / mutating contract for the mcp-* install, doctor and
# embedded-server setup scripts. Two real bugs shipped because nothing held the
# line: a doctor.sh that connected to every MCP server, and an install.sh that
# wiped a global cache under --dry-run. This check fails a "read-only" doctor
# that grows a network or mutation call before it merges.
#
# Manifest (source of truth for declared class, owned by this guard so its
# coverage does not shrink when an install workflow narrows):
#   .skilled/commands/doctor/assets/mcp-mutation-class-manifest.yaml
#     servers[*] and cli_skill_diagnostics[*] entries, each with skill_dir plus
#     any of install_script, doctor_script, setup_script and the matching
#     <kind>_script_mutation_class field.
#
# Coverage: every script the pre-commit hook sends here must have a manifest
# row. Discovery uses the hook's own path pattern under .skilled/ and .opencode/:
#   skills/(mcp-tooling/)?mcp-*/scripts/{doctor,install}*.sh
#   skills/(mcp-tooling/)?mcp-*/mcp-servers/*/setup.sh
# A discovered script with no row fails.
#
# Contract enforced:
#   read-only scripts (doctors) fail on an unguarded mutation or an unbounded
#   network call:
#     - rm with both a recursive and a force flag, in any order or spelling
#     - append-redirect into a shell profile (>> ~/.bashrc|.zshrc|.profile|.bash_profile)
#     - npm i -g / npm install -g
#     - pipx install / pip install (not behind an obvious guard)
#     - network without a timeout: `claude mcp ...`, curl/wget without
#       `timeout`, npx without BOTH --no-install and timeout
#   Clearly-local reads are allowed (command -v probes, including for curl and
#   wget, node -e require, node --check, --version/--help probes, grep/cat...).
#   mutating scripts (installers) only need the `mutating` label. Mutation is
#   expected there, not forbidden.
#   none is the "no script" sentinel and needs `<kind>_script: null`.
#   Every manifest-listed script must exist; a missing file fails.
#
# Usage: check-mcp-mutation-class.sh [--help] [repo-root]
#   repo-root defaults to the git top level, then the current directory. Tests
#   pass a fixture tree here.
#
# Exit Codes:
#   0 - Contract holds
#   1 - A violation, a missing or wrong manifest label, or an unlisted script
#   2 - Harness error (bad arguments, manifest missing or malformed, python3 or
#       PyYAML missing)
set -euo pipefail

# ───────────────────────────────────────────────────────────────
# 1. ARGUMENTS
# ───────────────────────────────────────────────────────────────

show_help() {
  sed -n '2,/^set -euo pipefail$/p' "${BASH_SOURCE[0]}" | sed '$d' | sed 's/^# \{0,1\}//'
}

ROOT=""
while [[ $# -gt 0 ]]; do
  case "$1" in
    --help|-h)
      show_help
      exit 0
      ;;
    -*)
      echo "ERROR: unknown option: $1" >&2
      exit 2
      ;;
    *)
      if [[ -n "$ROOT" ]]; then
        echo "ERROR: only one repo-root argument is accepted" >&2
        exit 2
      fi
      ROOT="$1"
      shift
      ;;
  esac
done

if [[ -z "$ROOT" ]]; then
  ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
fi
if [[ ! -d "$ROOT" ]]; then
  echo "ERROR: repo root not found: $ROOT" >&2
  exit 2
fi
ROOT="$(cd "$ROOT" && pwd)"
MANIFEST="$ROOT/.skilled/commands/doctor/assets/mcp-mutation-class-manifest.yaml"

command -v python3 >/dev/null 2>&1 || { echo "ERROR: python3 required" >&2; exit 2; }
[[ -f "$MANIFEST" ]] || { echo "ERROR: manifest not found: $MANIFEST" >&2; exit 2; }

overall_exit=0

# ───────────────────────────────────────────────────────────────
# 2. WORK LIST
# ───────────────────────────────────────────────────────────────
# One tab-separated record per line:
#   CHECK <abs-path> <declared-class> <origin>   scan or label-check this script
#   NONE  <origin>                               explicit "no script" sentinel
#   FAIL  <label> <reason>                       manifest hygiene or coverage gap
# The Python step exits 2 on any manifest problem it cannot classify.

if ! WORKLIST="$(
  ROOT="$ROOT" MANIFEST="$MANIFEST" python3 - <<'PY'
import glob
import os
import re
import sys

try:
    import yaml
except ImportError:
    print("ERROR: PyYAML is required (python3 -m pip install pyyaml)", file=sys.stderr)
    sys.exit(2)

ROOT = os.environ["ROOT"]
MANIFEST = os.environ["MANIFEST"]
SECTIONS = ("servers", "cli_skill_diagnostics")
SCRIPT_KINDS = ("install", "doctor", "setup")
# Mirrors the pre-commit trigger so every script the hook sends here needs a row.
HOOK_PATTERN = re.compile(
    r"^skills/(mcp-tooling/)?mcp-[a-z-]+/"
    r"(scripts/(doctor|install)[a-z.-]*\.sh|mcp-servers/[^/]+/setup\.sh)$"
)
DISCOVERY_GLOBS = (
    "skills/mcp-*/scripts/*.sh",
    "skills/mcp-tooling/mcp-*/scripts/*.sh",
    "skills/mcp-*/mcp-servers/*/setup.sh",
    "skills/mcp-tooling/mcp-*/mcp-servers/*/setup.sh",
)


def harness_error(message):
    print(f"ERROR: {message}", file=sys.stderr)
    sys.exit(2)


def emit(*fields):
    print("\t".join(str(field) for field in fields))


try:
    with open(MANIFEST, encoding="utf-8") as handle:
        doc = yaml.safe_load(handle)
except (OSError, yaml.YAMLError) as exc:
    harness_error(f"manifest unreadable: {exc}")

doc = {} if doc is None else doc
if not isinstance(doc, dict):
    harness_error("manifest top level must be a mapping")

listed = set()
for section in SECTIONS:
    entries = doc.get(section) or {}
    if not isinstance(entries, dict):
        harness_error(f"{section} must map entry names to entries")
    for name, entry in entries.items():
        entry = entry or {}
        if not isinstance(entry, dict):
            harness_error(f"{section}.{name} must be a mapping")
        skill_dir = entry.get("skill_dir")
        for kind in SCRIPT_KINDS:
            key = f"{kind}_script"
            class_key = f"{key}_mutation_class"
            if key not in entry and class_key not in entry:
                continue
            origin = f"{section}.{name}.{key}"
            rel = entry.get(key)
            klass = entry.get(class_key)
            if rel is None:
                if klass == "none":
                    emit("NONE", origin)
                else:
                    emit("FAIL", origin, f"script path is null but mutation_class is {klass!r}; use none")
                continue
            if not skill_dir:
                emit("FAIL", origin, "entry has a script but no skill_dir")
                continue
            path = os.path.join(ROOT, skill_dir, rel)
            label = os.path.relpath(path, ROOT)
            listed.add(os.path.realpath(path))
            if klass is None:
                emit("FAIL", label, f"no mutation_class declared in manifest ({origin})")
            elif klass == "none":
                emit("FAIL", label, f"declared none but names a script ({origin})")
            else:
                emit("CHECK", path, klass, origin)

seen = set()
for base in (".skilled", ".opencode"):
    base_dir = os.path.join(ROOT, base)
    if not os.path.isdir(base_dir):
        continue
    found = set()
    for pattern in DISCOVERY_GLOBS:
        found.update(glob.glob(os.path.join(base_dir, pattern)))
    for path in sorted(found):
        if not HOOK_PATTERN.match(os.path.relpath(path, base_dir)):
            continue
        real = os.path.realpath(path)
        if real in seen:
            continue
        seen.add(real)
        if real not in listed:
            emit("FAIL", os.path.relpath(path, ROOT),
                 "no manifest row; add one with its mutation_class")
PY
)"; then
  echo "ERROR: could not build the work list from $MANIFEST" >&2
  exit 2
fi

if [[ -z "${WORKLIST//[$'\n\t ']/}" ]]; then
  echo "ERROR: no scripts resolved from manifest or discovery" >&2
  exit 2
fi

# ───────────────────────────────────────────────────────────────
# 3. CODE VIEW
# ───────────────────────────────────────────────────────────────
# Forbidden tokens are legitimately MENTIONED in doctor help text and comments
# (e.g. err "do NOT 'npm i -g figma-cli'"). Matching raw lines would flag those,
# so each line is emitted as <lineno>:<code> with the trailing comment removed
# and quoted-string contents blanked. Heredoc bodies are text too: a quoted
# delimiter never expands, so its body is blanked; an unquoted body keeps only
# its $(...) and backtick substitutions, the parts the shell would execute.
# A pattern that hits is a real call.

code_view() {
  python3 - "$1" <<'PY'
import re
import sys

path = sys.argv[1]
sq = re.compile(r"'[^']*'")
dq = re.compile(r'"(\\.|[^"\\])*"')
heredoc = re.compile(r"<<(-?)[ \t]*(['\"]?)([A-Za-z_][A-Za-z0-9_]*)\2")
substitution = re.compile(r"\$\([^)]*\)|`[^`]*`")


def heredocs_opened(line):
    """Heredoc operators outside quotes and comments, in source order."""
    found = []
    i, quote = 0, None
    while i < len(line):
        char = line[i]
        if quote:
            if char == "\\" and quote == '"':
                i += 2
                continue
            if char == quote:
                quote = None
            i += 1
            continue
        if char == "#" and (i == 0 or line[i - 1] in " \t"):
            break
        if char in "'\"":
            quote = char
        elif char == "\\":
            i += 1
        elif not line.startswith("<<<", i) and (i == 0 or line[i - 1] != "<"):
            match = heredoc.match(line, i)
            if match:
                found.append((match.group(1) == "-", bool(match.group(2)), match.group(3)))
                i = match.end()
                continue
        i += 1
    return found


pending = []
body = None
for i, raw in enumerate(open(path, encoding="utf-8", errors="replace"), 1):
    line = raw.rstrip("\n")
    if body is not None:
        strip_tabs, quoted, delimiter = body
        if (line.lstrip("\t") if strip_tabs else line) == delimiter:
            body = pending.pop(0) if pending else None
            print(f"{i}:")
            continue
        kept = "" if quoted else " ".join(substitution.findall(line))
        print(f"{i}:{kept}")
        continue
    pending.extend(heredocs_opened(line))
    # Blank string contents first, keeping the delimiters so structure stays.
    line = dq.sub('""', line)
    line = sq.sub("''", line)
    line = re.sub(r'(^|\s)#.*$', r'\1', line)
    print(f"{i}:{line}")
    if pending:
        body = pending.pop(0)
PY
}

# ───────────────────────────────────────────────────────────────
# 4. READ-ONLY SCANNER
# ───────────────────────────────────────────────────────────────
# Emits "LINE ::reason" per violation in a read-only script; silent when clean.
# Each grep runs over <lineno>:<code>, so the emitted number is the file line.

scan_readonly() {
  local file="$1" cv
  cv="$(code_view "$file")"

  # A recursive flag and a force flag in the same rm call, combined or split.
  printf '%s\n' "$cv" \
    | grep -E ':[^:]*\brm([[:space:]]+[^|&;[:space:]]+)*[[:space:]]+(-[a-zA-Z]*[rR][a-zA-Z]*|--recursive)([^[:alnum:]_-]|$)' \
    | grep -E '\brm([[:space:]]+[^|&;[:space:]]+)*[[:space:]]+(-[a-zA-Z]*f[a-zA-Z]*|--force)([^[:alnum:]_-]|$)' \
    | sed -E 's/^([0-9]+):.*/\1 ::rm -rf (destructive delete)/' || true

  printf '%s\n' "$cv" | grep -E '>>[[:space:]]*[^|&;]*\.(bashrc|zshrc|profile|bash_profile)\b' \
    | sed -E 's/^([0-9]+):.*/\1 ::append into shell profile (persistent env mutation)/' || true

  printf '%s\n' "$cv" | grep -E ':[^:]*\bnpm[[:space:]]+(i|install)\b[^|&;]*[[:space:]](-g|--global)\b' \
    | sed -E 's/^([0-9]+):.*/\1 ::npm install -g (global package mutation)/' || true

  # `pip --version` never matches "install"; a command -v guard is allowed.
  printf '%s\n' "$cv" \
    | grep -E ':[^:]*(\bpipx[[:space:]]+install\b|\bpip[0-9]?[[:space:]]+install\b|-m[[:space:]]+pip[[:space:]]+install\b)' \
    | grep -vE 'command -v|--version' \
    | sed -E 's/^([0-9]+):.*/\1 ::pip\/pipx install (package mutation)/' || true

  printf '%s\n' "$cv" | grep -E ':[^:]*\bclaude[[:space:]]+mcp\b' \
    | sed -E 's/^([0-9]+):.*/\1 ::claude mcp (network\/server connect)/' || true

  # Strip `command -v curl|wget` probes first, so a probe passes while a real
  # call on the same line is still checked for a timeout.
  printf '%s\n' "$cv" \
    | sed -E 's/command[[:space:]]+-v[[:space:]]+(curl|wget)//g' \
    | grep -E ':[^:]*\b(curl|wget)\b' \
    | grep -vE 'timeout[[:space:]]|--max-time|--connect-timeout|-m[[:space:]]+[0-9]|--timeout' \
    | sed -E 's/^([0-9]+):.*/\1 ::curl\/wget without a timeout (unbounded network)/' || true

  # An executing npx needs BOTH --no-install and a timeout to count as bounded.
  printf '%s\n' "$cv" | grep -E ':[^:]*\bnpx\b' \
    | grep -vE 'command -v[[:space:]]+npx' \
    | grep -vE '\bnpx\b[^|&;]*--no-install' \
    | sed -E 's/^([0-9]+):.*/\1 ::npx without --no-install (may fetch from network)/' || true
  printf '%s\n' "$cv" | grep -E ':[^:]*\bnpx\b' \
    | grep -vE 'command -v[[:space:]]+npx' \
    | grep -vE 'timeout[[:space:]]' \
    | sed -E 's/^([0-9]+):.*/\1 ::npx without a timeout (unbounded network)/' || true
}

# ───────────────────────────────────────────────────────────────
# 5. WALK THE WORK LIST
# ───────────────────────────────────────────────────────────────

# Check one manifest-listed script against its declared class
# Args: $1=absolute path $2=declared class $3=manifest origin
check_script() {
  local path="$1" klass="$2" origin="$3"
  local rel="${path#"$ROOT"/}" findings f lineno reason

  case "$klass" in
    read-only)
      if [[ ! -f "$path" ]]; then
        printf '  FAIL  %s  [declared read-only but file is missing]\n' "$rel"
        overall_exit=1
        return
      fi
      findings="$(scan_readonly "$path")"
      if [[ -z "$findings" ]]; then
        printf '  PASS  %s  [read-only — no unguarded mutation/network]\n' "$rel"
        return
      fi
      while IFS= read -r f; do
        [[ -n "$f" ]] || continue
        lineno="${f%% *}"
        reason="${f##*::}"
        printf '  FAIL  %s:%s  [read-only script: %s]\n' "$rel" "$lineno" "$reason"
      done <<< "$findings"
      overall_exit=1
      ;;
    mutating)
      if [[ -f "$path" ]]; then
        printf '  PASS  %s  [mutating — installer, label present]\n' "$rel"
      else
        printf '  FAIL  %s  [declared mutating but file is missing]\n' "$rel"
        overall_exit=1
      fi
      ;;
    *)
      printf '  FAIL  %s  [unknown mutation_class %q (%s)]\n' "$rel" "$klass" "$origin"
      overall_exit=1
      ;;
  esac
}

echo "== MCP mutation-class contract =="
while IFS=$'\t' read -r kind field_a field_b field_c; do
  case "$kind" in
    CHECK)
      check_script "$field_a" "$field_b" "$field_c"
      ;;
    NONE)
      printf '  PASS  %s  [declared none — no script]\n' "$field_a"
      ;;
    FAIL)
      printf '  FAIL  %s  [%s]\n' "$field_a" "$field_b"
      overall_exit=1
      ;;
  esac
done <<< "$WORKLIST"

# ───────────────────────────────────────────────────────────────
# 6. SUMMARY
# ───────────────────────────────────────────────────────────────

if [[ "$overall_exit" -eq 0 ]]; then
  echo "GUARD PASS — read-only doctors carry no unguarded mutation/network; installers labeled mutating"
else
  echo "GUARD FAIL — see FAIL lines above" >&2
fi

exit "$overall_exit"
