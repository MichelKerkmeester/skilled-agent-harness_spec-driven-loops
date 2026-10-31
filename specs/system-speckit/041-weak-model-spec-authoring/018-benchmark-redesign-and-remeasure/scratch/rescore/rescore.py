#!/usr/bin/env python3
"""Deterministic rescore of authored spec packets.

Two subcommands, both run from the repository root:

  build-residue <sandbox-map.tsv> <out.txt>
      Writes the residue list: the union of the sample rows in the core spec, plan
      and tasks templates of the four variant sandbox trees, one exact string per line.

  score <packets.tsv> <residue-strings.txt> <out.tsv> [--claims <claims.tsv>]
        [--summary <rescore.md>] [--script <recommend-level.sh>] [--allow-unparsed]
      Scores every packet in packets.tsv on four checks:
        1. the Verify: ratio on task lines, from the authoring card's two rg -c patterns
        2. one count per residue string
        3. each stated line count of the recommend-level.sh text report, checked against
           `bash <script> <named input> | wc -l` for the input the same sentence names
        4. each line naming decision-record.md in a packet folder without that file
      A line-count claim that names no input, or names it ambiguously, is UNPARSED. The
      script never fills in an input on the packet's behalf: each UNPARSED claim is
      printed to stderr and the run exits 3 unless --allow-unparsed is passed, so the
      conductor reads those claims by hand.

Run it with python3 -I. It reads the packets and the templates and writes only the
output paths named on its command line.
"""
import csv
import os
import re
import statistics
import subprocess
import sys

VARIANTS = ("pre054", "main-no054", "now054", "refined")
CORE = ("spec.md.tmpl", "plan.md.tmpl", "tasks.md.tmpl")
TEMPLATES = ".skilled/skills/system-spec-kit/templates/core"
DEFAULT_SCRIPT = ".skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh"

# The authoring card's task-line check (spec-authoring-card.md section 7): the first
# pattern counts task lines that carry a Verify: clause, the second counts task lines.
CARD_VERIFY = r"^- \[[ xB]\] T[0-9].*Verify: "
CARD_TASK = r"^- \[[ xB]\] T[0-9]"

# ---------------------------------------------------------------------------
# Sample-row normalization, shared by the residue builder and the residue count
# ---------------------------------------------------------------------------

# An unfilled placeholder in the 054 token style. Such a row never survives strict
# validation verbatim, so it is not a residue string.
TOKEN = re.compile(r"\[YOUR_VALUE_HERE")
# Metadata rows and template-kept rows: a correct packet carries them too.
METADATA = re.compile(r"^\| \*\*(Level|Status|Priority|Created|Branch|Parent Spec|Phase)\*\* \|")
KEPT = {
    "| `[ ]` | Pending |",
    "| `[x]` | Completed |",
    "| `[P]` | Parallelizable |",
    "| `[B]` | Blocked |",
    "| **[P0]** | HARD BLOCKER | Cannot claim done until complete |",
    "| **[P1]** | Required | Must complete OR get user approval |",
    "| **[P2]** | Optional | Can defer with documented reason |",
    "All tasks marked `[x]`",
    "No `[B]` blocked tasks remaining",
}
LEAD = re.compile(
    r"^(?:-\s+\[[ xB]\]\s+|-\s+|\d+\.\s+)"   # list, checklist or numbered marker
    r"(?:(?:T\d{3}|CHK-[A-Z0-9-]+)\s+)?"    # task or check id
    r"(?:\[(?:P\d?|B)\]\s+)*"                # priority, parallel or blocked tags
)
SEPARATOR = re.compile(r"^\|[\s:|-]+\|$")
BOX = re.compile(r"[←-⇿─-╿▲-◄]+|-{2,}>|<-{2,}")
MIN_LEN = 10


def sample_rows(path, template):
    """Yields the normalized sample rows of one markdown file.

    template=True applies the residue-list filters (placeholders, kept rows, header
    rows, short rows); template=False yields every candidate row of a packet so the
    residue count can compare it for equality.
    """
    with open(path, encoding="utf-8", errors="replace") as fh:
        lines = fh.read().splitlines()
    in_fence = False
    for i, raw in enumerate(lines):
        line = raw.strip()
        if line.startswith("```"):
            in_fence = not in_fence
            continue
        if in_fence:
            for frag in BOX.split(line):
                frag = frag.strip(" |")
                if len(frag) >= MIN_LEN and not (template and TOKEN.search(frag)):
                    yield frag
            continue
        if not line or line.startswith("<!--") or line.startswith("#"):
            continue
        if line.startswith("|"):
            if SEPARATOR.match(line):
                continue
            if template:
                nxt = lines[i + 1].strip() if i + 1 < len(lines) else ""
                if SEPARATOR.match(nxt):
                    continue  # header row
            text = re.sub(r"\s+", " ", line)
        elif LEAD.match(line):
            text = LEAD.sub("", line, count=1).strip()
        else:
            continue
        if not text:
            continue
        if template:
            if TOKEN.search(text) or METADATA.match(text) or text in KEPT or len(text) < MIN_LEN:
                continue
            if text.startswith('"') or re.match(r"^\*\*[^*]+\*\*: See `", text):
                continue  # frontmatter trigger phrases and cross-references
        yield text


def sandbox_trees(map_file):
    trees = {}
    with open(map_file) as fh:
        for line in fh:
            parts = line.rstrip("\n").split("\t")
            if len(parts) == 3 and parts[1] in VARIANTS:
                trees[parts[1]] = os.path.join(parts[0], parts[2], "tree")
    missing = [v for v in VARIANTS if v not in trees or not os.path.isdir(trees[v])]
    if missing:
        die(f"no sandbox tree for {', '.join(missing)} in {map_file}")
    return trees


def build_residue(map_file, out):
    trees = sandbox_trees(map_file)
    seen = []
    for v in VARIANTS:
        for name in CORE:
            path = os.path.join(trees[v], TEMPLATES, name)
            if not os.path.isfile(path):
                die(f"{v} has no {name} at {path}")
            for text in sample_rows(path, template=True):
                if text not in seen:
                    seen.append(text)
    with open(out, "w") as fh:
        fh.write("\n".join(seen) + "\n")
    print(f"{len(seen)} residue strings from {len(VARIANTS)} trees x {len(CORE)} templates")
    for v in VARIANTS:
        print(f"  {v}: {trees[v]}")


# ---------------------------------------------------------------------------
# Check 1: the Verify: ratio
# ---------------------------------------------------------------------------

def rg_count(pattern, path):
    """rg -c as the card runs it: prints a number, or nothing (exit 1) for zero."""
    p = subprocess.run(["rg", "-c", pattern, path], capture_output=True, text=True)
    if p.returncode == 1 and not p.stdout:
        return 0
    if p.returncode != 0:
        die(f"rg failed on {path}: {p.stderr.strip()}")
    return int(p.stdout.strip())


def verify_ratio(packet):
    tasks = os.path.join(packet, "tasks.md")
    if not os.path.isfile(tasks):
        return 0, 0, "NA"
    with_verify = rg_count(CARD_VERIFY, tasks)
    total = rg_count(CARD_TASK, tasks)
    return with_verify, total, ("NA" if total == 0 else f"{with_verify / total:.3f}")


# ---------------------------------------------------------------------------
# Check 3: stated line counts of the recommend-level.sh text report
# ---------------------------------------------------------------------------

NUMWORDS = {w: i for i, w in enumerate(
    "zero one two three four five six seven eight nine ten eleven twelve thirteen "
    "fourteen fifteen sixteen seventeen eighteen nineteen twenty".split())}
NUM = r"(?:\d+|" + "|".join(NUMWORDS) + r")"
# "16 lines", "sixteen or seventeen lines", "a 17-line report", "16 output lines"
PHRASE = re.compile(
    rf"(?<![\w.-])(?P<pre>\w+\s+)?(?P<n1>{NUM})(?:\s+or\s+(?P<n2>{NUM}))?"
    rf"(?:[ -](?:output|report|text|stdout)\s+|[ -])lines?\b(?P<post>(?:\s+\S+){{0,2}})",
    re.I)
# "`<cmd> | wc -l` prints `16`" or "prints 16, 16, 17, 17"
WCL = re.compile(rf"`(?P<cmd>[^`]*)`\s+(?:prints|returns|reads|is|=)\s+`?(?P<ns>{NUM}(?:`?,\s*`?{NUM})*)", re.I)
BARE_WCL = re.compile(r"^\s*wc -l\b")
NON_EXEC_LEAD = re.compile(r"`(?P<cmd>[^`]*)`\s+(?:prints|holds|lists|returns|outputs)\s+(?:at least |at most |exactly |only )?$", re.I)
# Nouns that make the count describe something other than the whole text report.
OTHER_NOUN = re.compile(
    r"^\s*(?:of\s+)?(?:script|json|document|payload|breakdown|block|section|function|file|"
    r"helper|diff|change|header|edit|patch|phase|description|summary|range|rows?|comment|"
    r"body|entry|usage|help|stderr|error|counts?)", re.I)
OTHER_PRE = re.compile(r"^(?:first|last|top|bottom|extra|blank|json|six-row)\s+$", re.I)
RELATES = re.compile(r"report|output|stdout|prints|writes|emits|baseline|invocation|recommend-level|\$S\b", re.I)
QUIET = re.compile(r"quiet", re.I)
NOT_QUIET = re.compile(r"without\s+(?:`?--quiet|it\b|the flag)|no\s+`?--quiet|flag is absent", re.I)
EXEC = re.compile(r"^(?:\w+=\S+\s+)*(?:bash\s+|sh\s+)?\S*(?:recommend-level\.sh|\$S\b|\"\$S\")")
VALUE_FLAGS = ("--loc", "--files", "--phase-threshold")
BOOL_FLAGS = ("--auth", "--api", "--db", "--architectural", "--recommend-phases", "--no-recommend-phases")
MIN_COUNT, MAX_COUNT = 2, 60


def num(tok):
    tok = tok.strip("`").lower()
    return int(tok) if tok.isdigit() else NUMWORDS[tok]


def units(line):
    """A table row is one unit; prose splits into sentences outside code spans."""
    if line.lstrip().startswith("|"):
        return [line]
    masked = re.sub(r"`[^`]*`", lambda m: "x" * len(m.group(0)), line)
    out, start = [], 0
    for m in re.finditer(r"(?<=[.;])\s+(?=[A-Z`*(])", masked):
        out.append(line[start:m.start()])
        start = m.end()
    out.append(line[start:])
    return out


def named_input(unit):
    """Returns (argv, why). argv is None when the unit names no single input."""
    values, flags = {}, []
    for flag in VALUE_FLAGS:
        found = set(re.findall(rf"(?<![\w-]){flag}[ =](\d+)", unit))
        if len(found) > 1:
            return None, f"{flag} names {len(found)} values"
        if found:
            values[flag] = found.pop()
    for flag in BOOL_FLAGS:
        if re.search(rf"(?<![\w-]){flag}(?![\w-])", unit):
            flags.append(flag)
    if "--loc" not in values or "--files" not in values:
        return None, "no --loc and --files input named"
    argv = []
    for flag in VALUE_FLAGS:
        if flag in values:
            argv += [flag, values[flag]]
    return argv + flags, ""


def claims_in(unit, line):
    """Returns the set of report line counts this unit states, or an empty set.

    The topic test reads the whole source line, since a sentence such as "that is 16
    lines" takes its subject from the sentence before it; the input never does.
    """
    if not RELATES.search(line):
        return set()
    if QUIET.search(unit) and not NOT_QUIET.search(unit):
        return set()
    if re.search(r"(?<![\w-])--json\b|(?<![\w-])-j\b", unit):
        return set()
    counts = set()
    for m in PHRASE.finditer(unit):
        # "`rg -n ... plan.md` prints two lines" counts another command's output.
        lead = NON_EXEC_LEAD.search(unit[:m.start("n1")])
        if lead and not EXEC.match(lead.group("cmd").split("|")[0].strip()):
            continue
        if OTHER_NOUN.match(m.group("post") or ""):
            continue
        if m.group("pre") and OTHER_PRE.match(m.group("pre")):
            continue
        for g in ("n1", "n2"):
            if m.group(g):
                counts.add(num(m.group(g)))
    for m in WCL.finditer(unit):
        cmd = m.group("cmd")
        if "wc -l" not in cmd:
            continue
        source = cmd.split("|")[0].strip()
        if "2>&1 >/dev/null" in cmd or ">/dev/null" in source:
            continue  # counts stderr, not the report
        if not (EXEC.match(source) or BARE_WCL.match(cmd)):
            continue  # rg, ls, grep, sed or cat output, not a run of the script
        for tok in re.split(r"`?,\s*`?", m.group("ns")):
            counts.add(num(tok))
    return {c for c in counts if MIN_COUNT <= c <= MAX_COUNT}


def real_count(script, argv, cache):
    key = tuple(argv)
    if key not in cache:
        p = subprocess.run(["bash", script] + argv, capture_output=True, text=True)
        if p.returncode != 0:
            die(f"{script} {' '.join(argv)} exited {p.returncode}: {p.stderr.strip()}")
        # wc -l counts newline characters; match it exactly.
        cache[key] = p.stdout.count("\n")
    return cache[key]


def quote(unit):
    """The claim text as stored in the outputs; an em dash is written as " - "."""
    return unit.strip().replace("\u2014", " - ")


def line_claims(packet, script, cache):
    rows = []
    for name in sorted(os.listdir(packet)):
        path = os.path.join(packet, name)
        if not (name.endswith(".md") and os.path.isfile(path)):
            continue
        with open(path, encoding="utf-8", errors="replace") as fh:
            for n, line in enumerate(fh, 1):
                if line.lstrip().startswith("<!--"):
                    continue
                for unit in units(line.rstrip("\n")):
                    counts = claims_in(unit, line)
                    if not counts:
                        continue
                    argv, why = named_input(unit)
                    stated = ",".join(str(c) for c in sorted(counts))
                    if argv is None:
                        rows.append((name, n, stated, "", "", "UNPARSED", why, quote(unit)))
                        continue
                    if len(counts) > 1:
                        rows.append((name, n, stated, " ".join(argv), "", "UNPARSED",
                                     "one input, several counts", quote(unit)))
                        continue
                    actual = real_count(script, argv, cache)
                    verdict = "MATCH" if actual in counts else "MISMATCH"
                    rows.append((name, n, stated, " ".join(argv), str(actual), verdict, "", quote(unit)))
    return rows


# ---------------------------------------------------------------------------
# Check 4: decision-record.md pointers in a folder without that file
# ---------------------------------------------------------------------------

def dangling_dr(packet):
    if os.path.isfile(os.path.join(packet, "decision-record.md")):
        return 0
    hits = 0
    for name in sorted(os.listdir(packet)):
        path = os.path.join(packet, name)
        if name.endswith(".md") and os.path.isfile(path):
            with open(path, encoding="utf-8", errors="replace") as fh:
                hits += sum(1 for line in fh if "decision-record.md" in line)
    return hits


# ---------------------------------------------------------------------------
# score
# ---------------------------------------------------------------------------

def residue_counts(packet, residue):
    index = {s: i for i, s in enumerate(residue)}
    counts = [0] * len(residue)
    for name in sorted(os.listdir(packet)):
        path = os.path.join(packet, name)
        if name.endswith(".md") and os.path.isfile(path):
            for text in sample_rows(path, template=False):
                if text in index:
                    counts[index[text]] += 1
    return counts


def mean(xs):
    xs = [x for x in xs if x is not None]
    return f"{statistics.mean(xs):.2f}" if xs else "NA"


def score(argv):
    opts = {"--claims": None, "--summary": None, "--script": DEFAULT_SCRIPT}
    allow_unparsed = False
    pos = []
    it = iter(argv)
    for a in it:
        if a in opts:
            opts[a] = next(it, None)
            if opts[a] is None:
                die(f"{a} needs a value")
        elif a == "--allow-unparsed":
            allow_unparsed = True
        else:
            pos.append(a)
    if len(pos) != 3:
        die("score needs <packets.tsv> <residue-strings.txt> <out.tsv>")
    packets_tsv, residue_txt, out_tsv = pos
    script = opts["--script"]
    if not os.path.isfile(script):
        die(f"no script at {script}; run from the repository root or pass --script")

    with open(residue_txt) as fh:
        residue = [l.rstrip("\n") for l in fh if l.strip()]
    with open(packets_tsv, newline="") as fh:
        packets = list(csv.DictReader(fh, delimiter="\t"))
    if not packets:
        die(f"{packets_tsv} lists no packets")

    cache, rows, claims = {}, [], []
    for p in packets:
        d = p["packet"]
        if not os.path.isdir(d):
            die(f"packet folder missing: {d}")
        wv, tl, ratio = verify_ratio(d)
        rc = residue_counts(d, residue)
        lc = line_claims(d, script, cache)
        for c in lc:
            claims.append((p["run"], p["variant"], p["round"]) + c)
        verdicts = [c[5] for c in lc]
        rows.append({
            "run": p["run"], "variant": p["variant"], "round": p["round"],
            "verify_tasks": wv, "task_lines": tl, "verify_ratio": ratio,
            "residue_total": sum(rc), "residue_distinct": sum(1 for x in rc if x),
            "lc_claims": len(lc), "lc_match": verdicts.count("MATCH"),
            "lc_mismatch": verdicts.count("MISMATCH"), "lc_unparsed": verdicts.count("UNPARSED"),
            "dr_dangling": dangling_dr(d),
            "residue": rc,
        })

    head = ["run", "variant", "round", "verify_tasks", "task_lines", "verify_ratio",
            "residue_total", "residue_distinct", "lc_claims", "lc_match", "lc_mismatch",
            "lc_unparsed", "dr_dangling"]
    res_cols = [f"res_{i + 1:03d}" for i in range(len(residue))]
    with open(out_tsv, "w") as fh:
        fh.write("\t".join(head + res_cols) + "\n")
        for r in rows:
            fh.write("\t".join([str(r[h]) for h in head] + [str(x) for x in r["residue"]]) + "\n")

    if opts["--claims"]:
        with open(opts["--claims"], "w") as fh:
            fh.write("run\tvariant\tround\tfile\tline\tstated\tinput\tactual\tverdict\twhy\ttext\n")
            for c in claims:
                fh.write("\t".join(str(x).replace("\t", " ") for x in c) + "\n")

    if opts["--summary"]:
        write_summary(opts["--summary"], rows, residue, claims, cache, argv)

    unparsed = [c for c in claims if c[8] == "UNPARSED"]
    print(f"scored {len(rows)} packets; {len(claims)} line-count claims: "
          f"{sum(1 for c in claims if c[8] == 'MATCH')} MATCH, "
          f"{sum(1 for c in claims if c[8] == 'MISMATCH')} MISMATCH, {len(unparsed)} UNPARSED")
    if unparsed:
        for c in unparsed:
            print(f"UNPARSED {c[0]} {c[1]} r{c[2]} {c[3]}:{c[4]} stated={c[5]} ({c[9]}): {c[10][:160]}",
                  file=sys.stderr)
        if not allow_unparsed:
            print(f"FAIL: {len(unparsed)} line-count claims name no single input; read them by hand "
                  "or pass --allow-unparsed to record them as UNPARSED", file=sys.stderr)
            sys.exit(3)


def write_summary(path, rows, residue, claims, cache, argv):
    def fnum(x):
        return None if x == "NA" else float(x)

    lines = ["# Rescore of the speed-loop author packets", "",
             "Generated by `python3 -I P/scratch/rescore/rescore.py score "
             + " ".join(a for a in argv) + "` from the repository root.", ""]
    lines += ["## Per-variant means", "",
              "| Variant | Packets | Verify ratio | Residue total | Residue distinct | "
              "Line claims | MATCH | MISMATCH | UNPARSED | Dangling DR pointers |",
              "|---|---|---|---|---|---|---|---|---|---|"]
    for v in VARIANTS:
        rs = [r for r in rows if r["variant"] == v]
        if not rs:
            continue
        lines.append("| {} | {} | {} | {} | {} | {} | {} | {} | {} | {} |".format(
            v, len(rs), mean([fnum(r["verify_ratio"]) for r in rs]),
            mean([r["residue_total"] for r in rs]), mean([r["residue_distinct"] for r in rs]),
            mean([r["lc_claims"] for r in rs]), mean([r["lc_match"] for r in rs]),
            mean([r["lc_mismatch"] for r in rs]), mean([r["lc_unparsed"] for r in rs]),
            mean([r["dr_dangling"] for r in rs])))
    lines += ["", "## Per-run means", "",
              "| Run | Variant | Packets | Verify ratio | Residue total | MATCH | MISMATCH | UNPARSED | Dangling DR |",
              "|---|---|---|---|---|---|---|---|---|"]
    for run in sorted({r["run"] for r in rows}):
        for v in VARIANTS:
            rs = [r for r in rows if r["run"] == run and r["variant"] == v]
            if rs:
                lines.append("| {} | {} | {} | {} | {} | {} | {} | {} | {} |".format(
                    run, v, len(rs), mean([fnum(r["verify_ratio"]) for r in rs]),
                    mean([r["residue_total"] for r in rs]), mean([r["lc_match"] for r in rs]),
                    mean([r["lc_mismatch"] for r in rs]), mean([r["lc_unparsed"] for r in rs]),
                    mean([r["dr_dangling"] for r in rs])))
    lines += ["", "## Per-packet rows", "",
              "| Run | Variant | Round | Verify | Ratio | Residue | Claims M/X/U | Dangling DR |",
              "|---|---|---|---|---|---|---|---|"]
    for r in rows:
        lines.append(f"| {r['run']} | {r['variant']} | {r['round']} | {r['verify_tasks']}/{r['task_lines']} | "
                     f"{r['verify_ratio']} | {r['residue_total']} | {r['lc_match']}/{r['lc_mismatch']}/"
                     f"{r['lc_unparsed']} | {r['dr_dangling']} |")
    top = sorted(((sum(r["residue"][i] for r in rows), i) for i in range(len(residue))), reverse=True)
    lines += ["", "## Most frequent residue strings", "",
              "| Hits | Packets | Variants hit (packets) | String |", "|---|---|---|---|"]
    for hits, i in top:
        if hits == 0:
            break
        per = {v: sum(1 for r in rows if r["variant"] == v and r["residue"][i]) for v in VARIANTS}
        lines.append("| {} | {} | {} | `{}` |".format(
            hits, sum(1 for r in rows if r["residue"][i]),
            ", ".join(f"{v} {n}" for v, n in per.items() if n),
            residue[i].replace("|", "\\|").replace("`", "'")))
    lines += ["", "## Real report line counts used", "",
              "| Input | `wc -l` |", "|---|---|"]
    for key, n in sorted(cache.items()):
        lines.append(f"| `{' '.join(key)}` | {n} |")
    lines += ["", "## Line-count claims by verdict", ""]
    for verdict in ("MISMATCH", "UNPARSED"):
        cs = [c for c in claims if c[8] == verdict]
        lines += [f"### {verdict} ({len(cs)})", ""]
        for c in cs:
            extra = f"input `{c[6]}` prints {c[7]}" if c[6] else c[9]
            text = c[10].replace("|", "\\|")
            lines.append(f"- {c[0]} {c[1]} r{c[2]} `{c[3]}:{c[4]}` states {c[5]}; {extra}. Text: {text[:220]}")
        lines.append("")
    lines += [
        "## Method", "",
        "- Verify ratio: `rg -c '" + CARD_VERIFY + "' tasks.md` over `rg -c '" + CARD_TASK
        + "' tasks.md`, the card's two patterns (`spec-authoring-card.md:122`). `NA` when the packet has no task line.",
        "- Residue: each packet `.md` file is cut into sample rows by the same rule that built "
        "`residue-strings.txt` (list or checklist item with its marker, id and priority tags stripped, "
        "whitespace-collapsed table row, or a diagram fragment), and a row counts when it equals a residue "
        "string exactly. A row the author edited no longer counts. `residue-strings.txt` comes from "
        "`rescore.py build-residue L/prep/sandbox-map.tsv`, so its refined tree is the latest prepared "
        "refined snapshot, not necessarily the one each old run used. The plan's Definition of Ready and "
        "Done defaults lead the hit list; a reader may judge some of them acceptable as kept.",
        "- Line counts: a sentence (a table row is one unit) states a report line count when it gives a number "
        f"from {MIN_COUNT} to {MAX_COUNT} before `lines`, `-line` or a `wc -l` of a run of the script, is about "
        "the report or output, is not about `--quiet` or `--json`, and the number does not describe a script, "
        "breakdown, block, section or other part. The input is the `--loc`, `--files` and flag set named in the "
        "same unit; the count is checked against `bash recommend-level.sh <input> | wc -l` from this worktree, "
        "whose script is byte-identical in all four sandbox trees. A unit with no `--loc` and `--files`, or with "
        "two values for one flag, is UNPARSED and never filled in from another sentence.",
        "- Dangling DR pointers: lines naming `decision-record.md` in a packet folder that holds no such file.",
        "- Quoted claim text writes each em dash as a spaced hyphen.",
        "",
    ]
    with open(path, "w") as fh:
        fh.write("\n".join(lines))


def die(msg):
    print(f"ERROR: {msg}", file=sys.stderr)
    sys.exit(2)


def main():
    if len(sys.argv) < 2 or sys.argv[1] not in ("build-residue", "score"):
        print(__doc__, file=sys.stderr)
        sys.exit(2)
    if sys.argv[1] == "build-residue":
        if len(sys.argv) != 4:
            die("build-residue needs <sandbox-map.tsv> <out.txt>")
        build_residue(sys.argv[2], sys.argv[3])
    else:
        score(sys.argv[2:])


if __name__ == "__main__":
    main()
