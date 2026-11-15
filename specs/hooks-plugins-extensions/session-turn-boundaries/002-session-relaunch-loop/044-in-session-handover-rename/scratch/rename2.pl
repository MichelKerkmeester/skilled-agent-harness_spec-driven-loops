#!/usr/bin/perl
# In-place rename of every "in-session handover" form to the shorter "session handover".
# Spec folder names such as 044-in-session-handover-rename are shielded first.
use strict; use warnings;
local $/;
for my $file (@ARGV) {
  open(my $in, '<', $file) or die "$file: $!"; my $s = <$in>; close $in;
  my $orig = $s; my @keep;
  $s =~ s/(\d{3}-in-session-handover[-a-z0-9]*)/push @keep, $1; "\x{1}KEEP".$#keep."\x{1}"/ge;
  $s =~ s/IN_SESSION_HANDOVER/SESSION_HANDOVER/g;
  $s =~ s/IN-SESSION HANDOVER/SESSION HANDOVER/g;
  $s =~ s/in_session_handover/session_handover/g;
  $s =~ s/InSessionHandover/SessionHandover/g;
  $s =~ s/inSessionHandover/sessionHandover/g;
  $s =~ s/In-Session Handover/Session Handover/g;
  $s =~ s/In-session handover/Session handover/g;
  $s =~ s/In-session-handover/Session-handover/g;
  $s =~ s/in-session-handover/session-handover/g;
  $s =~ s/in-session handover/session handover/g;
  $s =~ s/in session handover/session handover/g;
  $s =~ s/\b([Aa])n (session[- ]handover|Session[- ]handover|Session Handover)/$1 $2/g;
  $s =~ s/\x{1}KEEP(\d+)\x{1}/$keep[$1]/g;
  next if $s eq $orig;
  open(my $out, '>', $file) or die "$file: $!"; print $out $s; close $out;
  print "$file\n";
}
