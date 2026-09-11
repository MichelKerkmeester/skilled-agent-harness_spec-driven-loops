#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: history rewrite runner
# ───────────────────────────────────────────────────────────────
# Rehearse a two-pass git filter-repo rewrite of the named refs on a
# throwaway mirror, stamp the machine trailer paragraph from the frozen
# plan, remap hash citations from the commit map, and prove the result
# against invariants.  The bare backup is the rollback; the script never
# pushes.  Without --rehearse it prints the push lines for the operator.
#
# Usage:
#   rewrite-run.sh --source <repo-or-url> --plan <plan.jsonl> --work <dir> \
#       [--refs main,skilled/v4.0.0.0] [--tags] [--rehearse]
#
# Output:
#   <work>/rewrite.log                timestamped step log and invariants
#   <work>/tips-before.txt            every ref tip of backup and mirror
#   <work>/commit-map-1               first-pass commit map
#   <work>/commit-map                 cumulative commit map
#   <work>/backup.git, mirror.git     the bare rollback and rewrite targets
# ───────────────────────────────────────────────────────────────
set -euo pipefail

usage() {
  cat >&2 <<'USAGE'
usage: rewrite-run.sh --source <repo-or-url> --plan <plan.jsonl> --work <dir>
                      [--refs main,skilled/v4.0.0.0] [--tags] [--rehearse]

  --source   repository or URL to clone twice (backup and mirror)
  --plan     frozen JSONL plan of old SHA, ordinal and packet
  --work     scratch directory for the clones, maps and log
  --refs     comma-separated branch names to rewrite
  --tags     also rewrite every tag on the mirror
  --rehearse run everything and stop before printing push lines
USAGE
}

SOURCE=""
PLAN=""
WORK=""
REFS="main,skilled/v4.0.0.0"
TAGS=0
REHEARSE=0

while [ $# -gt 0 ]; do
  case "$1" in
    --source)
      SOURCE="${2:-}"
      shift 2
      ;;
    --plan)
      PLAN="${2:-}"
      shift 2
      ;;
    --work)
      WORK="${2:-}"
      shift 2
      ;;
    --refs)
      REFS="${2:-}"
      shift 2
      ;;
    --tags)
      TAGS=1
      shift
      ;;
    --rehearse)
      REHEARSE=1
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "error: unknown option '$1'" >&2
      usage
      exit 2
      ;;
  esac
done

if [ -z "$SOURCE" ] || [ -z "$PLAN" ] || [ -z "$WORK" ]; then
  usage
  exit 2
fi
[ -f "$PLAN" ] || { echo "error: plan '$PLAN' not found" >&2; exit 2; }
command -v git-filter-repo >/dev/null 2>&1 || { echo "error: git-filter-repo not on PATH" >&2; exit 2; }

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
STAMP_SCRIPT="$SCRIPT_DIR/stamp-callback.py"
[ -f "$STAMP_SCRIPT" ] || { echo "error: stamp-callback.py not beside rewrite-run.sh" >&2; exit 2; }

mkdir -p "$WORK"
LOG="$WORK/rewrite.log"
: > "$LOG"

log() {
  printf '%s %s\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$*" | tee -a "$LOG"
}

die() {
  log "ERROR: $*"
  exit 1
}

log "start: source=$SOURCE plan=$PLAN work=$WORK refs=$REFS tags=$TAGS rehearse=$REHEARSE"

# ───────────────────────────────────────────────────────────────
# 1. CLONES AND TIPS
# ───────────────────────────────────────────────────────────────

BACKUP="$WORK/backup.git"
MIRROR="$WORK/mirror.git"

if [ ! -d "$BACKUP" ]; then
  log "clone backup: git clone --mirror $SOURCE $BACKUP"
  git clone --mirror "$SOURCE" "$BACKUP" >>"$LOG" 2>&1 || die "backup clone failed"
else
  log "reuse existing backup: $BACKUP"
fi

log "clone mirror: git clone --mirror $SOURCE $MIRROR"
rm -rf "$MIRROR"
git clone --mirror "$SOURCE" "$MIRROR" >>"$LOG" 2>&1 || die "mirror clone failed"

TIPS="$WORK/tips-before.txt"
{
  printf '# backup %s\n' "$BACKUP"
  git -C "$BACKUP" for-each-ref --format='%(objectname) %(refname)'
  printf '# mirror %s\n' "$MIRROR"
  git -C "$MIRROR" for-each-ref --format='%(objectname) %(refname)'
} > "$TIPS"

backup_tips="$(git -C "$BACKUP" for-each-ref --format='%(objectname) %(refname)')"
mirror_tips="$(git -C "$MIRROR" for-each-ref --format='%(objectname) %(refname)')"
if [ "$backup_tips" != "$mirror_tips" ]; then
  log "FAIL tips: backup and mirror ref tips differ; the source moved between clones"
  exit 1
fi
log "PASS tips: backup and mirror ref tips match"

# ───────────────────────────────────────────────────────────────
# 2. REF LIST
# ───────────────────────────────────────────────────────────────

REF_LIST=()
old_ifs="$IFS"
IFS=','
for name in $REFS; do
  [ -n "$name" ] || continue
  ref="refs/heads/$name"
  git -C "$MIRROR" rev-parse --verify --quiet "$ref" >/dev/null 2>&1 || die "named ref '$ref' is not on the mirror"
  REF_LIST[${#REF_LIST[@]}]="$ref"
done
IFS="$old_ifs"
[ "${#REF_LIST[@]}" -gt 0 ] || die "no refs to rewrite"

if [ "$TAGS" -eq 1 ]; then
  IFS=$'\n'
  for tagref in $(git -C "$MIRROR" for-each-ref --format='%(refname)' refs/tags); do
    [ -n "$tagref" ] || continue
    REF_LIST[${#REF_LIST[@]}]="$tagref"
  done
  IFS="$old_ifs"
fi

FILTER_REF_ARGS=(--refs "${REF_LIST[@]}")
REFSPEC_CSV=""
for ref in "${REF_LIST[@]}"; do
  REFSPEC_CSV="$REFSPEC_CSV,$ref"
done
REFSPEC_CSV="${REFSPEC_CSV#,}"
log "rewriting refs: $REFSPEC_CSV"

# ───────────────────────────────────────────────────────────────
# 3. PLAN COVERAGE AND ORDINAL GAPS
# ───────────────────────────────────────────────────────────────

set +e
python3 - "$PLAN" "$MIRROR" "$REFSPEC_CSV" <<'PY' | tee -a "$LOG"
import json
import subprocess
import sys

plan_path, repo, refspec = sys.argv[1], sys.argv[2], sys.argv[3]
refs = [ref for ref in refspec.split(",") if ref]

plan = {}
ordinals = []
with open(plan_path, "r", encoding="utf-8") as handle:
    for line in handle:
        stripped = line.strip()
        if not stripped:
            continue
        row = json.loads(stripped)
        plan[row["old"]] = row
        ordinals.append(int(row["ordinal"]))

ok = True

missing = []
for ref in refs:
    proc = subprocess.run(["git", "-C", repo, "rev-list", ref], capture_output=True)
    if proc.returncode != 0:
        missing.append((ref, "unresolvable"))
        continue
    for sha in proc.stdout.decode("ascii", "replace").split():
        if sha not in plan:
            missing.append((ref, sha))
if missing:
    ok = False
    print("FAIL plan-coverage: %d commit(s) on the named refs are absent from the plan (e.g. %s %s)"
          % (len(missing), missing[0][0], missing[0][1]))
else:
    print("PASS plan-coverage: every commit on the named refs is in the plan")

sorted_ordinals = sorted(ordinals)
if len(set(ordinals)) != len(ordinals):
    ok = False
    print("FAIL plan-ordinals: duplicate ordinals in the plan")
elif sorted_ordinals != list(range(1, len(ordinals) + 1)):
    ok = False
    gap = next(index for index, value in enumerate(sorted_ordinals, start=1) if value != index)
    print("FAIL plan-ordinals: expected %07d, found %07d" % (gap, sorted_ordinals[gap - 1]))
else:
    print("PASS plan-ordinals: %d consecutive ordinals from 0000001" % len(ordinals))

sys.exit(0 if ok else 1)
PY
plan_status=${PIPESTATUS[0]}
set -e
[ "$plan_status" -eq 0 ] || die "plan validation failed; nothing rewritten"

# ───────────────────────────────────────────────────────────────
# 4. FIRST PASS: STAMP THE TRAILERS
# ───────────────────────────────────────────────────────────────

script_repr="$(python3 -c 'import sys; print(repr(sys.argv[1]))' "$STAMP_SCRIPT")"
plan_repr="$(python3 -c 'import sys; print(repr(sys.argv[1]))' "$PLAN")"
map1_repr="$(python3 -c 'import sys; print(repr(sys.argv[1]))' "$WORK/commit-map-1")"

cat > "$WORK/pass1_callback.py" <<PY
import importlib.util

SCRIPT = ${script_repr}
PLAN = ${plan_repr}


def _load():
    spec = importlib.util.spec_from_file_location("stamp_callback", SCRIPT)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


_MODULE = _load()
_PLAN = _MODULE.load_plan(PLAN)


def stamp(commit):
    row = _PLAN.get(commit.original_id)
    if row is not None:
        commit.message = _MODULE.stamp_message(commit.message, row)
PY

log "pass 1: stamp Spec and Commit-Id trailers on the mirror"
set +e
(
  cd "$MIRROR"
  PYTHONPATH="$WORK${PYTHONPATH:+:$PYTHONPATH}" git filter-repo --force "${FILTER_REF_ARGS[@]}" \
    --commit-callback 'import pass1_callback; pass1_callback.stamp(commit)' \
    --replace-refs delete-no-add
) >>"$LOG" 2>&1
pass1_status=$?
set -e
[ "$pass1_status" -eq 0 ] || die "first filter-repo pass failed"

cp "$MIRROR/filter-repo/commit-map" "$WORK/commit-map-1"
log "pass 1: copied commit map to $WORK/commit-map-1"

# ───────────────────────────────────────────────────────────────
# 5. SECOND PASS: REMAP CITATIONS
# ───────────────────────────────────────────────────────────────

cat > "$WORK/pass2_callback.py" <<PY
import importlib.util

SCRIPT = ${script_repr}
MAP = ${map1_repr}

PREFIX_LENGTHS = tuple(range(10, 41))
ZERO = "0" * 40


def _load():
    spec = importlib.util.spec_from_file_location("stamp_callback", SCRIPT)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


_MODULE = _load()


def _build_prefix_map(path):
    table = {}
    with open(path, "r", encoding="utf-8") as handle:
        lines = handle.read().splitlines()
    for line in lines[1:]:
        stripped = line.strip()
        if not stripped:
            continue
        old, new = stripped.split()
        if new == ZERO:
            continue
        for length in PREFIX_LENGTHS:
            prefix = old[:length]
            existing = table.get(prefix)
            if existing is not None and existing != new:
                raise SystemExit("prefix collision at %s" % prefix)
            table[prefix] = new
    return table


_PREFIX_MAP = _build_prefix_map(MAP)


def remap(message):
    return _MODULE.remap_message(message, _PREFIX_MAP)
PY

log "pass 2: remap commit hash citations from $WORK/commit-map-1"
set +e
(
  cd "$MIRROR"
  PYTHONPATH="$WORK${PYTHONPATH:+:$PYTHONPATH}" git filter-repo --force "${FILTER_REF_ARGS[@]}" \
    --message-callback 'import pass2_callback; return pass2_callback.remap(message)' \
    --replace-refs delete-no-add
) >>"$LOG" 2>&1
pass2_status=$?
set -e
[ "$pass2_status" -eq 0 ] || die "second filter-repo pass failed"

cp "$MIRROR/filter-repo/commit-map" "$WORK/commit-map"
log "pass 2: copied cumulative commit map to $WORK/commit-map"

# ───────────────────────────────────────────────────────────────
# 6. INVARIANTS
# ───────────────────────────────────────────────────────────────

log "running invariants"
set +e
python3 - "$MIRROR" "$BACKUP" "$PLAN" "$WORK/commit-map" "$REFSPEC_CSV" <<'PY' | tee -a "$LOG"
import json
import re
import subprocess
import sys

mirror, backup, plan_path, map_path, refspec = sys.argv[1:6]
refs = [ref for ref in refspec.split(",") if ref]
ZERO = "0" * 40
HEX = re.compile(rb"(?<![0-9a-zA-Z])[0-9a-f]{10,40}(?![0-9a-zA-Z])")

results = []


def report(label, ok, detail=""):
    results.append(bool(ok))
    line = "INVARIANT %s: %s" % ("PASS" if ok else "FAIL", label)
    if detail:
        line = line + " -- " + detail
    print(line)


def git(repo, *args):
    return subprocess.run(["git", "-C", repo, *args], capture_output=True)


def rev_list(repo, ref):
    proc = git(repo, "rev-list", ref)
    if proc.returncode != 0:
        raise RuntimeError(proc.stderr.decode("utf-8", "replace").strip())
    return proc.stdout.decode("ascii", "replace").split()


def meta(repo, refs_):
    fmt = "%H%x1f%T%x1f%an%x1f%ae%x1f%aI%x1f%cI"
    proc = git(repo, "log", "--format=" + fmt, *refs_)
    if proc.returncode != 0:
        raise RuntimeError(proc.stderr.decode("utf-8", "replace").strip())
    table = {}
    for line in proc.stdout.decode("utf-8", "replace").splitlines():
        parts = line.split("\x1f")
        if len(parts) == 6:
            table[parts[0]] = tuple(parts[1:])
    return table


def load_messages(repo, refs_):
    proc = git(repo, "log", "-z", "--format=%H%x1f%B", *refs_)
    if proc.returncode != 0:
        raise RuntimeError(proc.stderr.decode("utf-8", "replace").strip())
    table = {}
    for record in proc.stdout.split(b"\x00"):
        if not record:
            continue
        sha, _, body = record.partition(b"\x1f")
        if sha:
            table[sha.decode("ascii", "replace")] = body
    return table


plan = {}
with open(plan_path, "r", encoding="utf-8") as handle:
    for line in handle:
        stripped = line.strip()
        if stripped:
            row = json.loads(stripped)
            plan[row["old"]] = row

pairs = {}
with open(map_path, "r", encoding="utf-8") as handle:
    map_lines = handle.read().splitlines()
for line in map_lines[1:]:
    stripped = line.strip()
    if not stripped:
        continue
    parts = stripped.split()
    if len(parts) >= 2:
        pairs[parts[0]] = parts[1]

# 1. commit count per ref
try:
    ok = True
    details = []
    for ref in refs:
        count_backup = len(rev_list(backup, ref))
        count_mirror = len(rev_list(mirror, ref))
        details.append("%s mirror=%d backup=%d" % (ref, count_mirror, count_backup))
        if count_backup != count_mirror:
            ok = False
    report("commit count per ref equals backup", ok, "; ".join(details))
except Exception as exc:
    report("commit count per ref equals backup", False, str(exc))

# 2. mapped commits keep tree, author and dates
try:
    backup_meta = meta(backup, refs)
    mirror_meta = meta(mirror, refs)
    mismatch = 0
    missing = 0
    for old, new in pairs.items():
        if new == ZERO:
            continue
        if old not in backup_meta or new not in mirror_meta:
            missing += 1
            continue
        if backup_meta[old] != mirror_meta[new]:
            mismatch += 1
    report("mapped commits keep tree, author name, email and dates",
           mismatch == 0 and missing == 0,
           "mismatch=%d missing=%d" % (mismatch, missing))
except Exception as exc:
    report("mapped commits keep tree, author name, email and dates", False, str(exc))

# 3. one Commit-Id per message, equal to the plan ordinal
messages = {}
try:
    messages = load_messages(mirror, refs)
    old_of_new = {new: old for old, new in pairs.items() if new != ZERO}
    bad = 0
    checked = 0
    for ref in refs:
        for sha in rev_list(mirror, ref):
            old = old_of_new.get(sha)
            if old is None or old not in plan:
                bad += 1
                continue
            checked += 1
            expected = str(plan[old]["ordinal"])
            found = [line for line in messages.get(sha, b"").split(b"\n") if line.startswith(b"Commit-Id:")]
            if len(found) != 1:
                bad += 1
                continue
            value = found[0][len(b"Commit-Id:"):].strip().decode("ascii", "replace")
            if value != expected:
                bad += 1
    report("exactly one Commit-Id per message equal to the plan ordinal",
           bad == 0, "checked=%d bad=%d" % (checked, bad))
except Exception as exc:
    report("exactly one Commit-Id per message equal to the plan ordinal", False, str(exc))

# 4. tag count
try:
    def tag_count(repo):
        proc = git(repo, "for-each-ref", "--format=%(refname)", "refs/tags")
        if proc.returncode != 0:
            raise RuntimeError("for-each-ref failed")
        return len([line for line in proc.stdout.decode("utf-8", "replace").splitlines() if line])

    report("tag count equals backup", tag_count(backup) == tag_count(mirror),
           "mirror=%d backup=%d" % (tag_count(mirror), tag_count(backup)))
except Exception as exc:
    report("tag count equals backup", False, str(exc))

# 5. commit-map rows equal the commit count
try:
    reachable = set()
    for ref in refs:
        reachable.update(rev_list(mirror, ref))
    report("commit-map rows equal the commit count", len(pairs) == len(reachable),
           "rows=%d commits=%d" % (len(pairs), len(reachable)))
except Exception as exc:
    report("commit-map rows equal the commit count", False, str(exc))

# 6. no old 10-hex prefix remains
try:
    prefixes = {old[:10] for old in pairs}
    residue = set()
    for body in messages.values():
        for match in HEX.finditer(body):
            token = match.group(0).decode("ascii", "replace")
            if token[:10] in prefixes:
                residue.add(token)
    report("no old 10-hex prefix remains in messages", not residue, "residue=%d" % len(residue))
except Exception as exc:
    report("no old 10-hex prefix remains in messages", False, str(exc))

print("INVARIANTS: %s" % ("PASS" if all(results) else "FAIL"))
sys.exit(0 if all(results) else 1)
PY
invariant_status=${PIPESTATUS[0]}
set -e
if [ "$invariant_status" -ne 0 ]; then
  log "FAIL invariants: rewrite-run.sh stops; nothing was pushed"
  exit 1
fi
log "PASS invariants: all checks passed"

# ───────────────────────────────────────────────────────────────
# 7. STOP (OR PRINT THE OPERATOR PUSH LINES)
# ───────────────────────────────────────────────────────────────

if [ "$REHEARSE" -eq 1 ]; then
  log "REHEARSE: stopping after invariants; no push lines emitted"
else
  log "operator push commands (run by hand; this script never pushes):"
  for ref in "${REF_LIST[@]}"; do
    log "git -C $MIRROR push --force $SOURCE $ref:$ref"
  done
fi
log "done"
exit 0
