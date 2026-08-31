"""Fill <!-- ANCHOR:x -->...<!-- /ANCHOR:x --> blocks and literal substrings in a spec doc.

Authoring aid for this packet. Removed at the end of phase 4 as one-shot, then needed
again one phase later - kept from here on, because a rule set that keeps growing keeps
needing its docs filled. Fails loud when an anchor or substitution target is missing, so
a silent partial fill cannot pass for a success.
"""
import re, pathlib

def fill(path, blocks, subs=()):
    p = pathlib.Path(path)
    s = p.read_text()
    for name, body in blocks.items():
        pat = re.compile(r'<!-- ANCHOR:%s -->.*?<!-- /ANCHOR:%s -->' % (re.escape(name), re.escape(name)), re.S)
        new = '<!-- ANCHOR:%s -->\n%s\n<!-- /ANCHOR:%s -->' % (name, body.strip('\n'), name)
        s, n = pat.subn(lambda m: new, s)
        if n != 1:
            raise SystemExit('anchor %s matched %d times in %s' % (name, n, path))
    for old, new in subs:
        if old not in s:
            raise SystemExit('substitution target missing in %s: %r' % (path, old[:70]))
        s = s.replace(old, new)
    p.write_text(s)
    print('filled %-74s %2d anchors %2d subs' % (path, len(blocks), len(subs)))
