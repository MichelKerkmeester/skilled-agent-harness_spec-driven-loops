#!/bin/sh
# Print the process ancestry of this shell, one "pid comm" line per ancestor.
# comm is read on its own so a path holding spaces stays one field.
pid=$$
while [ -n "$pid" ] && [ "$pid" -gt 1 ]; do
  comm=$(ps -o comm= -p "$pid") || break
  echo "$pid $(basename -- "$comm")"
  pid=$(ps -o ppid= -p "$pid" | tr -d ' ')
done
