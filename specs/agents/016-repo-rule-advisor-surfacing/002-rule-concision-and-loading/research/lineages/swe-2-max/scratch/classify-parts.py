#!/usr/bin/env python3
"""Per-part byte decomposition of the 13 repo rules.

Method (documented for iteration-001):
  * Each file is split into BLOCKS on blank lines. Every block gets exactly one
    part label by dominant function. Bytes per part = sum(len(block)+1) where
    the +1 restores the newline that separated blocks (blank line included in
    the preceding block's byte count, matching `wc -c` totals).
  * Labels: the eight steer parts (fires-when, rule-statement, failure-prevents,
    examples, self-check, what-this-is-not, cross-references, rationale) plus
    two reconciliation parts not in the steer list: `frontmatter` (the YAML
    block) and `header` (# title, > routing quotes, ## section headings, ---
    separators). Headings count as structure, not as their section's part.
  * Rule order below. A line/block is classified by the first rule that hits.
  * OVERRIDES: explicit (file, block-index) labels where the deterministic
    rules misfire on dominant function; each override is listed in the output.
"""
import re, sys, os, json

RULES_DIR = "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/repo-rules"

FILES = [
    "answer-the-actual-request.md",
    "blast-radius.md",
    "communication-decisions.md",
    "communication-handoff.md",
    "communication-prose.md",
    "communication.md",
    "delegation-and-orchestration.md",
    "evidence-and-proof.md",
    "prevent-overengineering.md",
    "root-cause-and-debugging.md",
    "scope-discipline.md",
    "skill-hub-routing.md",
    "uncertainty-and-honesty.md",
]

PARTS = [
    "frontmatter",
    "header",
    "fires-when",
    "rule-statement",
    "failure-prevents",
    "examples",
    "cross-references",
    "rationale",
    "what-this-is-not",
    "self-check",
]

# (filename, block_index_0based) -> label. Each documented in iteration-001.
# Dominant-function test applied: a block is rule-statement when a model could
# violate it (issues or refines a checkable norm); rationale when it explains
# motivation/mechanism/design without adding a norm; failure-prevents when its
# payload is naming the specific failure forestalled; cross-references when its
# payload is "the substance lives elsewhere"; examples for demonstrations
# (quoted utterances, fill-in templates, sample sentences).
OVERRIDES = {
    "answer-the-actual-request.md": {},
    "blast-radius.md": {
        9: "examples",           # stakes-read italic sample sentences
        10: "failure-prevents",  # 'Not ceremony' names what the line forestalls
        21: "rule-statement",
        31: "rule-statement",
    },
    "communication-decisions.md": {
        7: "cross-references",   # 'how sentences read' lives in communication.md
    },
    "communication-handoff.md": {
        10: "cross-references",  # AGENTS.md/e-and-p already require the status
        19: "rule-statement",
        30: "rule-statement",
    },
    "communication-prose.md": {
        19: "rule-statement",    # 'Plain words by default' norm
        27: "rule-statement",    # semicolon/serial-comma prohibitions
        29: "cross-references",  # full standard is HVR, routed via sk-doc
    },
    "communication.md": {
        5: "rationale",          # provenance note inside 'Fires when'
        8: "cross-references",   # moved-to / lives-in pointer block
        12: "cross-references",  # u-and-h §6 owns the two-register distinction
        13: "rule-statement",    # the boundary definition is the applied test
        18: "rule-statement",    # 'earned by reader's need' criterion
        30: "rule-statement",
        31: "rule-statement",
    },
    "delegation-and-orchestration.md": {
        11: "rationale",         # 'One lens' epistemic self-disclosure
        27: "rule-statement",
        44: "rule-statement",
        45: "rule-statement",
    },
    "evidence-and-proof.md": {
        10: "failure-prevents",  # 'certifies work nobody checked' = the failure
        16: "rule-statement",
        26: "rule-statement",
        28: "rule-statement",
        39: "failure-prevents",  # 'the result becomes the standard'
        43: "self-check",        # checkbox list outside the SELF-CHECK section
        47: "rule-statement",
    },
    "prevent-overengineering.md": {
        12: "cross-references",  # real ladder lives in sk-code
        14: "examples",          # 'Extending parseConfig' sample sentence
        19: "rule-statement",    # pre-write pass numbered items
        22: "cross-references",  # Restraint Signals binds elsewhere
        30: "cross-references",  # coverage floor lives in AGENTS.md §3
    },
    "root-cause-and-debugging.md": {
        10: "rule-statement",    # THE LOOP procedure
        11: "rule-statement",
        20: "rule-statement",
        22: "rule-statement",
        29: "rule-statement",
        32: "rule-statement",
        35: "rule-statement",
        36: "rule-statement",    # escalation-format list
    },
    "scope-discipline.md": {
        13: "cross-references",  # Law 2 owns the freeze
        15: "rule-statement",
        21: "rule-statement",
        22: "rule-statement",
        26: "cross-references",  # PLAN-WORKFLOW LOCK read in AGENTS.md
        32: "cross-references",  # §3 binds; restates then points (borderline)
        37: "rule-statement",    # the three-item plan list
        38: "failure-prevents",  # 'the failure is the mid-task realization'
    },
    "skill-hub-routing.md": {
        10: "rationale",         # routingClass mechanism explanation
        33: "rationale",         # file's own pointer-design self-description
        34: "cross-references",  # 'Question | Read' pointer table
    },
    "uncertainty-and-honesty.md": {
        9: "cross-references",   # the scale lives in AGENTS.md §2
        25: "examples",          # LOGIC-SYNC output template
    },
}

POINTER_LEAD = re.compile(
    r"^(see|moved to|lives in|owned by|route through|read it there|the commands are|"
    r"the authoritative list|the full standard|apply \[|as \[|per `|the same (floor|test|ban)|"
    r"the coverage floor|route|load all of it)",
    re.I,
)
LINK = re.compile(r"\[[^\]]*\]\([^)]*\)")
INLINE_CODE = re.compile(r"`[^`]*`")
QUOTE = re.compile(r"[\"'\u201c\u201d][^\"'\u201c\u201d\n]*[\"'\u201c\u201d]|\*[^*\n]+\*")
IMPERATIVE = re.compile(
    r"^(never|always|do not|don't|no |every |each |match|number|suppress|cut|end|name|state|"
    r"write|read|run|capture|report|check|verify|confirm|keep|deliver|answer|ask|recommend|"
    r"mark|treat|open|split|measure|cite|label|give|show|tell|say|prefer|take|make|let|put|"
    r"place|size|fix|trace|locate|reproduce|re-run|enumerate|rescan|restate|inspect|try|stop|"
    r"wait|record|finish|fold|proceed|pause|update|present|separate|triage|decide|post|attach|"
    r"resolve|inventory|scope|position|introduce|replace|explain|turn|reserve|build|default|"
    r"catch|add|abstract|follow|honor|carry|hold|correct|pass|replay|bind|freeze|persist|"
    r"route|escalate|ground|diverge|hand|judge|accept|quote|act|diff|re-dispatch|drop|claim|"
    r"start|before|after|if |when |for |a |an |the |one |two |three |four |five |in |on |at |"
    r"and |or |but |so |then |not |with |from |into |of |to |that |this |it |what |how |why |"
    r"agreement|padding|declining|delivering|installing|narrowing|restating|removing|sending|"
    r"naming|skipping|agreeing|praise|reasoning|reason|write `unknown)",
    re.I,
)


def split_blocks(text):
    """Return list of (block_text, span_bytes). Blocks are maximal runs of
    non-blank lines; each block OWNS the blank lines that follow it, so the
    byte spans partition the file exactly and the per-file sum equals wc -c."""
    lines = text.split("\n")
    # BYTE offset where each line starts (UTF-8 aware)
    starts = []
    off = 0
    for ln in lines:
        starts.append(off)
        off += len(ln.encode("utf-8")) + 1  # +1 for the newline (or EOF slack)
    blocks = []  # (text, byte_len)
    cur = None
    for i, ln in enumerate(lines):
        if ln.strip() == "":
            if cur is not None:
                blocks.append(cur)
                cur = None
            continue
        if cur is None:
            cur = [i, i]
        else:
            cur[1] = i
    if cur is not None:
        blocks.append(cur)
    out = []
    for j, (a, b) in enumerate(blocks):
        # span: from start of line a to start of next block's first line (or EOF)
        start = starts[a]
        end = starts[blocks[j + 1][0]] if j + 1 < len(blocks) else len(text.encode("utf-8"))
        btext = "\n".join(lines[a : b + 1])
        out.append((btext, end - start))
    return out


def section_of(block):
    m = re.match(r"^##\s+(.+?)\s*$", block.split("\n", 1)[0])
    return m.group(1) if m else None


def quote_ratio(b):
    stripped = QUOTE.sub("", b)
    return 1.0 - (len(stripped) / max(len(b), 1))


def link_ratio(b):
    stripped = LINK.sub("", b)
    stripped = INLINE_CODE.sub("", stripped)
    return 1.0 - (len(stripped.strip()) / max(len(b.strip()), 1))


def is_table(b):
    return all(ln.lstrip().startswith("|") for ln in b.split("\n") if ln.strip())


def is_list(b):
    n = [ln for ln in b.split("\n") if ln.strip()]
    return sum(1 for ln in n if re.match(r"^\s*([-*]|\d+\.)\s", ln)) >= max(1, len(n) * 0.6)


def first_line(b):
    for ln in b.split("\n"):
        if ln.strip():
            return ln.strip()
    return ""


def classify(fname, idx, b, section):
    if fname in OVERRIDES and idx in OVERRIDES[fname]:
        return OVERRIDES[fname][idx], "override"
    sec = (section or "").upper()
    fl = first_line(b)
    # 1 frontmatter: caller handles (block 0 starting with ---)
    # 2 header: headings, routing quotes, bare separators
    if b.startswith("# ") or b.startswith("> ") or re.match(r"^#{1,6}\s", b) or b.strip() == "---":
        return "header", "rule"
    # 3 section-bound labels
    if sec == "FIRES WHEN":
        return "fires-when", "rule"
    if "WHAT THIS RULE IS NOT" in sec:
        return "what-this-is-not", "rule"
    if "SELF-CHECK" in sec:
        return "self-check", "rule"
    # 4 failure-prevents
    if re.match(r"^\**\s*the\s+(three\s+)?failure", fl, re.I):
        return "failure-prevents", "rule"
    # 5 'The rule' section: bold rule statement, unless pointer-dominant
    if sec == "THE RULE":
        if link_ratio(b) > 0.45 or POINTER_LEAD.match(re.sub(r"^[-*\d.\s>*`]+", "", fl)):
            return "cross-references", "rule"
        return "rule-statement", "rule"
    # 6 tables: normative taxonomy by default
    if is_table(b):
        return "rule-statement", "rule"
    # 7 pointer-dominant -> cross-references
    body = re.sub(r"^[-*\d.\s>]+", "", fl)
    if LINK.search(b) and (link_ratio(b) > 0.40 or POINTER_LEAD.match(body)):
        return "cross-references", "rule"
    # 8 example-dominant: quoted utterances / demonstration spans
    if quote_ratio(b) > 0.30:
        return "examples", "rule"
    if is_list(b):
        items = [ln for ln in b.split("\n") if re.match(r"^\s*([-*]|\d+\.)\s", ln)]
        quoted = sum(1 for ln in items if QUOTE.search(ln))
        if quoted >= max(1, len(items) * 0.5):
            return "examples", "rule"
    # 9 rule-statement: bold-led or imperative-led or normative list
    if fl.startswith("**") or re.match(r"^[-*] \*\*", fl) or IMPERATIVE.match(body):
        return "rule-statement", "rule"
    if is_list(b):
        bold_items = sum(1 for ln in b.split("\n") if re.match(r"^\s*([-*]|\d+\.)\s+\*\*", ln))
        if bold_items >= 1:
            return "rule-statement", "rule"
    # 10 fallback
    return "rationale", "rule"


def main():
    grand = {p: 0 for p in PARTS}
    rows = []
    dump = []
    for fname in FILES:
        path = os.path.join(RULES_DIR, fname)
        text = open(path, encoding="utf-8").read()
        wc = len(text.encode("utf-8"))
        blocks = split_blocks(text)
        counts = {p: 0 for p in PARTS}
        section = None
        for i, (b, nb) in enumerate(blocks):
            head = section_of(b)
            if i == 0 and b.startswith("---"):
                label, how = "frontmatter", "rule"
            else:
                label, how = classify(fname, i, b, section)
            if head:
                section = head
            counts[label] += nb
            dump.append((fname, i, label, how, nb, first_line(b)[:80]))
        total = sum(counts.values())
        rows.append((fname, counts, total, wc))
        for p in PARTS:
            grand[p] += counts[p]

    hdr = ["file"] + PARTS + ["sum", "wc -c", "diff"]
    print("\t".join(hdr))
    for fname, counts, total, wc in rows:
        print("\t".join([fname] + [str(counts[p]) for p in PARTS] + [str(total), str(wc), str(total - wc)]))
    print("\t".join(["TOTAL"] + [str(grand[p]) for p in PARTS] + [str(sum(grand.values())), "", ""]))
    print("\n--- BLOCK DUMP ---")
    for fname, i, label, how, nb, prev in dump:
        print(f"{fname}#{i:02d}\t{label}\t{nb}\t{how}\t{prev!r}")


if __name__ == "__main__":
    main()
