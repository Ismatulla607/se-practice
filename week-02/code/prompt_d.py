def analyze_marks(marks, pass_mark=50):
    if not marks:
        raise ValueError("The marks list cannot be empty.")

    passing_count = 0
    total = 0.0
    highest = None
    lowest = None

    for mark in marks:
        # Check for non-numeric types (bool is a subclass of int in Python)
        if type(mark) not in (int, float):
            raise ValueError(f"Invalid element type {type(mark).__name__}: expected int or float.")

        if not (0 <= mark <= 100):
            raise ValueError(f"Mark {mark} is out of the valid range [0, 100].")

        total += mark

        if highest is None or mark > highest:
            highest = mark
        if lowest is None or mark < lowest:
            lowest = mark

        if mark >= pass_mark:
            passing_count += 1

    total_marks = len(marks)
    average = total / total_marks
    pass_rate = round((passing_count / total_marks) * 100, 2)

    return {
        "average": average,
        "highest": highest,
        "lowest": lowest,
        "pass_rate": pass_rate,
    }