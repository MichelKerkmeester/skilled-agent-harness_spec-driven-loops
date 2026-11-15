#!/usr/bin/perl
# In-place rename of every "session relaunch" form to "in-session handover".
# History tokens (spec folder names, benchmark report folders) are shielded first.
use strict; use warnings;
local $/;
for my $file (@ARGV) {
  open(my $in, '<', $file) or die "$file: $!"; my $s = <$in>; close $in;
  my $orig = $s; my @keep;
  $s =~ s/(\d{3}-session-relaunch[-a-z0-9]*|--session-relaunch[-a-z0-9]*)/push @keep, $1; "\x{1}KEEP".$#keep."\x{1}"/ge;
  $s =~ s/SESSION_RELAUNCH/IN_SESSION_HANDOVER/g;
  $s =~ s/SESSION RELAUNCH/IN-SESSION HANDOVER/g;
  $s =~ s/session_relaunch/in_session_handover/g;
  $s =~ s/SessionRelaunch/InSessionHandover/g;
  $s =~ s/sessionRelaunch/inSessionHandover/g;
  $s =~ s/Session Relaunch/In-Session Handover/g;
  $s =~ s/Session[- ]relaunch/In-session handover/g;
  $s =~ s/session-relaunch/in-session-handover/g;
  $s =~ s/session relaunch/in-session handover/g;
  $s =~ s/\b([Aa]) (in-session|In-session|In-Session)/my ($art, $rest) = ($1, $2); $art eq "A" ? "An $rest" : "an $rest"/ge;
  $s =~ s/\x{1}KEEP(\d+)\x{1}/$keep[$1]/g;
  next if $s eq $orig;
  open(my $out, '>', $file) or die "$file: $!"; print $out $s; close $out;
  print "$file\n";
}
