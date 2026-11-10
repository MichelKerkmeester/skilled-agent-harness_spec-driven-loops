# Runs one teardown against a fresh idle sandbox. Sourced by bash or zsh so $$ is the running shell.
# Arguments: sandbox prefix, teardown file, and "hidden" to leave /usr/sbin (lsof) out of PATH.
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public || exit 1
[ "$3" = hidden ] && export PATH=/usr/bin:/bin
SANDBOX=$(mktemp -d "/tmp/$1.XXXXXX")
case "$SANDBOX" in /tmp/"$1".?*) ;; *) echo "unexpected sandbox path: $SANDBOX"; exit 1 ;; esac
GEN=.skilled/skills/.state/advisor/skill-graph-generation.json
GEN_BEFORE=$(shasum "$GEN")
echo "# $(date -u +%H:%M:%SZ) shell=$(ps -o comm= -p $$) sandbox=$SANDBOX lsof=$(command -v lsof || echo not-on-PATH)"
. "$2"
echo "# $(date -u +%H:%M:%SZ) sandbox now: $([ -d "$SANDBOX" ] && echo present || echo gone)"
