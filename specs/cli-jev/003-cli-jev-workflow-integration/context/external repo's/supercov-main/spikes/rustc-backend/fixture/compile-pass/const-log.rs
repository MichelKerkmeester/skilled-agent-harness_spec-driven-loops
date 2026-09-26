pub const fn logged_const(value: bool) -> usize {
    if value { 1 } else { 2 }
}

pub const VALUE: usize = logged_const(true);
