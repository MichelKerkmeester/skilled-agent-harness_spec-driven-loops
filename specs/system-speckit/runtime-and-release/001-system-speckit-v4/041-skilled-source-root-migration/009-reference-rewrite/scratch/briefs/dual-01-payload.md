Columns: path, line, column, hash, class and detail from the rule, text of the line.

~~~~tsv
.github/dependabot.yml	13	10	4fb5720b08500fdd	R3:root-fragment	- "/.opencode/**"
.github/scripts/check-gate-inputs.sh	14	46	c0ceb50aa525f0b5	R3:directory	#   hook-inputs      every literal $REPO_ROOT/.opencode/<path> a hook command uses, every
.github/scripts/check-gate-inputs.sh	15	49	b7921398b08709b6	R3:directory	#                    variable assigned a literal .opencode/<path> and every quoted literal
.github/scripts/check-gate-inputs.sh	16	21	8f9c62aacd70446b	R3:directory	#                    .opencode/<path> handed to a command other than git resolves
.github/scripts/check-gate-inputs.sh	17	35	bf5e57c5efa2ff44	R3:directory	#   workflow-inputs  every literal .opencode/<path> a workflow runs resolves, a glob
.github/scripts/check-gate-inputs.sh	108	20	6547cbfe1d2d38dc	R3:absolute	if (tok ~ /^!?\/?\.opencode(\/|$)/) sub(/\.opencode/, ".skilled", tok)
.github/scripts/check-gate-inputs.sh	108	44	6547cbfe1d2d38dc	R3:directory	if (tok ~ /^!?\/?\.opencode(\/|$)/) sub(/\.opencode/, ".skilled", tok)
.github/scripts/check-gate-inputs.sh	109	25	936673a8b55264b8	R3:segment	else sub(/\.skilled/, ".opencode", tok)
.github/scripts/check-gate-inputs.sh	130	3	6d8f2bf7450b30a4	R3:directory	# \.opencode/, which match one root however the rest of the pattern reads. A trailing
.github/scripts/check-gate-inputs.sh	147	96	0749f41ca0b76cf4	R3:directory	if (parts[p] ~ /\\\.opencode\// && parts[p] !~ /\\\.skilled\//) print FNR "\tliteral-one\t\\.opencode/"
.github/scripts/check-gate-inputs.sh	194	19	586673c0cb0010d2	R3:entry:.	if (path !~ /^\.opencode\/./) emit("note", "read")
.github/scripts/check-gate-inputs.sh	267	134	03fd132c0bbc9644	R3:bare	if (part ~ /^[[:space:]]*((local|export|readonly|declare|typeset)([[:space:]]+-[A-Za-z]+)*[[:space:]]+)?[A-Za-z_][A-Za-z0-9_]*="?\.opencode\/[A-Za-z0-9._\/-]+"?[[:space:]]*$/) {
.github/scripts/check-gate-inputs.sh	290	21	e8ca21d7d3d29518	R3:bare	if (lit ~ /^\.opencode\/[A-Za-z0-9._\/-]+$/) emit("repo", lit)
.github/scripts/check-gate-inputs.sh	317	16	0a2728e9fa762bcb	R3:bare	# `npm --prefix .opencode`, which carry no path to resolve. A path filter may list its
.github/scripts/check-gate-inputs.sh	369	42	bcbf80b4a580991f	R3:bare	while (match(line, /(^|[^A-Za-z0-9_])\.opencode\/[][A-Za-z0-9._*?\/-]*/)) {
.github/scripts/check-gate-inputs.sh	376	45	b3b88633a8a52943	R3:bare	while (match(line, /(^|[^A-Za-z0-9_\/.])\.opencode([^\/A-Za-z0-9_]|$)/)) {
.github/scripts/check-gate-inputs.sh	377	20	1714a2fdb447db66	R3:segment	emit("bare", ".opencode"); line = substr(line, RSTART + RLENGTH)
.github/scripts/check-gate-inputs.sh	446	18	f0bd95f13bc2962c	R3:directory	if [[ -f "$ROOT/.opencode/$gate" ]]; then rel=".opencode/$gate"
.github/scripts/check-gate-inputs.sh	446	49	f0bd95f13bc2962c	R3:directory	if [[ -f "$ROOT/.opencode/$gate" ]]; then rel=".opencode/$gate"
~~~~
