def analyze_marks(marks, pass_mark=50):
    """Analyzes student marks and returns summary statistics.

    Parameters:
        marks (list of int/float): A list of numeric marks from 0 to 100.
        pass_mark (int/float): The passing threshold (default is 50).

    Returns:
        dict: A dictionary containing 'average', 'highest', 'lowest',
              and 'pass_rate' (percentage of passing students).

    Raises:
        ValueError: If marks is empty, contains non-numeric/boolean elements,
                    or contains values outside the range [0, 100].
    """
    if not marks:
        raise ValueError("The marks list cannot be empty.")

    validated_marks = []
    for mark in marks:
        # Check type explicitly to exclude bool (bool is a subclass of int in Python)
        if isinstance(mark, bool) or not isinstance(mark, (int, float)):
            raise ValueError(f"Invalid value '{mark}'. All marks must be numeric.")

        if not (0 <= mark <= 100):
            raise ValueError(
                f"Mark '{mark}' is out of range. Marks must be between 0 and 100."
            )

        validated_marks.append(float(mark))

    total_count = len(validated_marks)
    total_sum = sum(validated_marks)
    highest = max(validated_marks)
    lowest = min(validated_marks)

    passed_count = sum(1 for mark in validated_marks if mark >= pass_mark)

    average = total_sum / total_count
    pass_rate = (passed_count / total_count) * 100

    return {
        "average": average,
        "highest": highest,
        "lowest": lowest,
        "pass_rate": pass_rate,
    }