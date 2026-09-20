def analyze_marks(marks, pass_mark=50):
    if not marks:
        raise ValueError("The marks list cannot be empty.")
    
    validated_marks = []
    for m in marks:
        # Exclude boolean types since bool is a subclass of int in Python
        if isinstance(m, bool) or not isinstance(m, (int, float)):
            raise ValueError(f"Invalid non-numeric value found: {m}")
        if not (0 <= m <= 100):
            raise ValueError(f"Mark out of range [0, 100]: {m}")
        validated_marks.append(float(m))
        
    total_count = len(validated_marks)
    passed_count = sum(1 for m in validated_marks if m >= pass_mark)
    
    avg_mark = sum(validated_marks) / total_count
    highest_mark = max(validated_marks)
    lowest_mark = min(validated_marks)
    pass_rate = round((passed_count / total_count) * 100, 2)
    
    return {
        "average": avg_mark,
        "highest": highest_mark,
        "lowest": lowest_mark,
        "pass_rate": pass_rate
    }


# ==========================================
# Unit Tests
# ==========================================

# 1. Single Mark
print("1. Single mark test:")
print(analyze_marks([75], pass_mark=50))
# Output: {'average': 75.0, 'highest': 75.0, 'lowest': 75.0, 'pass_rate': 100.0}

# 2. Decimals
print("\n2. Decimals test:")
print(analyze_marks([45.5, 62.3, 88.7], pass_mark=50))
# Output: {'average': 65.5, 'highest': 88.7, 'lowest': 45.5, 'pass_rate': 66.67}

# 3. Custom pass_mark
print("\n3. Custom pass_mark (pass_mark=70):")
print(analyze_marks([40, 60, 80], pass_mark=70))
# Output: {'average': 60.0, 'highest': 80.0, 'lowest': 40.0, 'pass_rate': 33.33}

# 4. Empty List (Expect ValueError)
print("\n4. Empty list test:")
try:
    analyze_marks([])
except ValueError as e:
    print(f"Caught expected error: {e}")

# 5. Text Value (Expect ValueError)
print("\n5. Text value test:")
try:
    analyze_marks([50, "eighty", 90])
except ValueError as e:
    print(f"Caught expected error: {e}")

# 6. Marks Out of Range (Below 0 or Above 100)
print("\n6a. Mark below 0 test:")
try:
    analyze_marks([-5, 50, 70])
except ValueError as e:
    print(f"Caught expected error: {e}")

print("\n6b. Mark above 100 test:")
try:
    analyze_marks([50, 70, 105])
except ValueError as e:
    print(f"Caught expected error: {e}")