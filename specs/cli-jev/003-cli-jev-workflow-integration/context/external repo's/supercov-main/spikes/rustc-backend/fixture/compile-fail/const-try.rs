pub const fn const_try(value: Result<usize, usize>) -> Result<usize, usize> {
    let value = value?;
    Ok(value + 1)
}

pub const VALUE: Result<usize, usize> = const_try(Ok(1));
