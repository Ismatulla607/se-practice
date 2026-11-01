def can_book(start, end, now, blocked, existing):
    if not isinstance(start, int) or not isinstance(end, int) or not isinstance(now, int):
        return False
    if not (0 <= start < end <= 1440):
        return False
    if start <= now:
        return False
    if (end - start) > 120:
        return False
    if blocked:
        return False
    for ex_start, ex_end in existing:
        if max(start, ex_start) < min(end, ex_end):
            return False
    return True