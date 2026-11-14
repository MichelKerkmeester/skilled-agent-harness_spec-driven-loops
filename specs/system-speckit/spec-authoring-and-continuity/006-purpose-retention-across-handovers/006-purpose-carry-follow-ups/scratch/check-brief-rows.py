"""Compare the resume brief row labels in the presentation file with each workflow asset's reply_format.

Usage: python3 check-brief-rows.py <presentation.txt> <workflow.yaml> [<workflow.yaml> ...]
Prints one line per workflow asset: "<file> match" or "<file> differ yaml=[...] brief=[...]".
"""
import re
import sys

import yaml


def labels(items):
    return [re.split(r"[:(]", part)[0].strip() for item in items for part in item.split(" | ")]


brief = open(sys.argv[1]).read().split("RESUME BRIEF\n", 1)[1].split("```", 1)[0]
expected = labels(line for line in brief.splitlines() if line)
for path in sys.argv[2:]:
    actual = labels(yaml.safe_load(open(path))["confidence_framework"]["reply_format"])
    name = path.split("/")[-1]
    print(f"{name} match" if actual == expected else f"{name} differ yaml={actual} brief={expected}")
