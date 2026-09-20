def analyze_student_marks(marks_dict, passing_score=50):
    """
    Analyzes student marks and provides general statistics and individual grades.
    
    :param marks_dict: Dictionary mapping student names to their numerical marks.
    :param passing_score: Minimum mark required to pass (default 50).
    :return: Dictionary containing summary statistics and detailed student results.
    """
    if not marks_dict:
        return "No data provided."

    scores = list(marks_dict.values())
    total_students = len(scores)
    
    # Calculate statistics
    average_mark = sum(scores) / total_students
    highest_score = max(scores)
    lowest_score = min(scores)
    
    top_students = [name for name, score in marks_dict.items() if score == highest_score]
    lowest_students = [name for name, score in marks_dict.items() if score == lowest_score]
    
    passed_students = [name for name, score in marks_dict.items() if score >= passing_score]
    pass_rate = (len(passed_students) / total_students) * 100

    # Grade assignment function
    def get_grade(score):
        if score >= 90:
            return 'A'
        elif score >= 80:
            return 'B'
        elif score >= 70:
            return 'C'
        elif score >= 60:
            return 'D'
        else:
            return 'F'

    # Build detailed records
    student_details = {}
    for name, score in marks_dict.items():
        student_details[name] = {
            "Score": score,
            "Grade": get_grade(score),
            "Status": "Pass" if score >= passing_score else "Fail"
        }

    return {
        "summary": {
            "Total Students": total_students,
            "Average Mark": round(average_mark, 2),
            "Highest Mark": highest_score,
            "Top Scorer(s)": ", ".join(top_students),
            "Lowest Mark": lowest_score,
            "Lowest Scorer(s)": ", ".join(lowest_students),
            "Pass Rate": f"{pass_rate:.1f}%"
        },
        "student_details": student_details
    }


# Example Usage
if __name__ == "__main__":
    student_marks = {
        "Alice": 92,
        "Bob": 67,
        "Charlie": 45,
        "Diana": 88,
        "Evan": 73,
        "Fiona": 50
    }

    results = analyze_student_marks(student_marks)

    print("=== SUMMARY STATISTICS ===")
    for key, value in results["summary"].items():
        print(f"{key}: {value}")

    print("\n=== INDIVIDUAL RESULTS ===")
    print(f"{'Name':<10} {'Score':<8} {'Grade':<8} {'Status':<8}")
    print("-" * 36)
    for name, details in results["student_details"].items():
        print(f"{name:<10} {details['Score']:<8} {details['Grade']:<8} {details['Status']:<8}")