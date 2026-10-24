import re, sys

def summary(path):
    rows = []
    for line in open(path, encoding="utf-8", errors="replace"):
        text = line.strip()
        if re.match(r"^(Test Files|Tests)\s", text) or re.match(r"^exit=\d+$", text):
            rows.append(re.sub(r"\s+", " ", text))
    return rows

def counts(row):
    passed = re.search(r"(\d+) passed", row)
    failed = re.search(r"(\d+) failed", row)
    total = re.search(r"\((\d+)\)", row)
    return (int(passed.group(1)) if passed else 0, int(failed.group(1)) if failed else 0, int(total.group(1)) if total else 0)

start, end = summary(sys.argv[1]), summary(sys.argv[2])
new_files, new_tests = int(sys.argv[3]), int(sys.argv[4])
if len(start) != len(end):
    sys.exit(f"SUITE_DIFF summary line counts differ: {len(start)} against {len(end)}")
files_changed, tests_changed = 0, 0
for before, after in zip(start, end):
    if before == after:
        continue
    kind = "files" if before.startswith("Test Files") else "tests" if before.startswith("Tests") else None
    after_kind = "files" if after.startswith("Test Files") else "tests" if after.startswith("Tests") else None
    if kind is None or kind != after_kind:
        sys.exit(f"SUITE_DIFF unexpected change: '{before}' became '{after}'")
    b, a = counts(before), counts(after)
    expected = new_files if before.startswith("Test Files") else new_tests
    if a != (b[0] + expected, b[1], b[2] + expected):
        sys.exit(f"SUITE_DIFF '{before}' became '{after}', expected {expected} more passed")
    if before.startswith("Test Files"):
        files_changed += 1
    else:
        tests_changed += 1
if files_changed != 1 or tests_changed != 1:
    sys.exit(f"SUITE_DIFF expected one Test Files line and one Tests line to change, got {files_changed} and {tests_changed}")
print("SUITE_MATCH_PLUS_NEW_TEST")
