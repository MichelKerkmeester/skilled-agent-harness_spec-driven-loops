# Compares the start rates printed before and after the start rule change. Under the
# fixed rule a read alone is a lookup, so each new numerator must equal the old one
# minus the old read-alone count, and no denominator may move. The decline and
# skill-only counts already followed the rule, so they must not move at all.
import json
import os

HERE = os.path.dirname(os.path.abspath(__file__))
SETS = (('007', 'start-007-before.json', 'start-007-after.json'),
        ('033', 'arm-033-before.json', 'arm-033-after.json'))


def load(name):
    with open(os.path.join(HERE, name)) as handle:
        return json.load(handle)


def split(rate):
    started, total = rate.split(' of ')
    return int(started), int(total)


for label, before_name, after_name in SETS:
    before, after = load(before_name), load(after_name)
    for runtime, entry in before.items():
        if runtime == 'pooled':
            continue
        for arm, block in entry.items():
            if arm in ('unscored', 'paired'):
                continue
            new = after[runtime][arm]
            old_n, old_d = split(block['startRate'])
            new_n, new_d = split(new['startRate'])
            read_alone = block['startShapes']['readOnly']
            moved = 'numerator moved by readOnly' if new_n == old_n - read_alone else 'numerator DIFF'
            held = 'denominator equal' if new_d == old_d else 'denominator DIFF'
            lookups = new['startShapes']['readOnly']
            print(f'{label} {runtime} {arm} start {block["startRate"]} -> {new["startRate"]}'
                  f' lookups {lookups}, {moved}, {held}')
            if label == '033':
                same = all(block[key] == new[key] for key in ('declineStarts', 'skillOnlyStarts'))
                print(f'{label} {runtime} {arm} decline {new["declineStarts"]} skillOnly'
                      f' {new["skillOnlyStarts"]} {"equal" if same else "DIFF"}')
