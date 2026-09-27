# Acceptance criteria — three selected stories

Assumptions first, then the criteria. Each block names the story it belongs to. 3 to 5 criteria per
story, every one in Given / When / Then form, and every set covers a validation or error case — not
three happy paths.

---

## Assumptions

These must settle the two questions the scenario leaves open. Either answer is accepted; no answer
is not.

- **Overlap:** a booking that ends exactly when another begins is allowed under R3, because contiguous booking slots do not conflict in time (0-length intersection).
- **Duration:** a booking of exactly two hours is allowed under R2, because two hours is within the maximum allowed single-booking threshold.
- **Cancellation Window:** a booking can only be cancelled at least 1 hour before the start time.

---

## US-01 — View available rooms

### AC-01
- **Given** an authenticated user on the booking page
- **When** they select a valid start time and end time with no overlapping existing bookings
- **Then** the system displays a list of all available rooms for that time slot.

### AC-02
- **Given** an authenticated user selecting a time range
- **When** the end time is selected to be earlier than or equal to the start time
- **Then** the system displays a validation error "End time must be after start time" and prevents searching.

### AC-03
- **Given** an authenticated user viewing available rooms
- **When** all rooms are fully booked for the chosen time slot
- **Then** the system shows an empty state message "No rooms available for the selected time period".

---

## US-02 — Create a room booking

### AC-04
- **Given** an authenticated user selecting an available room for a 1-hour slot in the future
- **When** they submit the booking request with valid details
- **Then** the booking is saved, status is set to "Confirmed", and a confirmation message is displayed.

### AC-05
- **Given** an authenticated user attempting to book a room
- **When** another user has already confirmed a booking for the exact same room and overlapping time slot
- **Then** the system rejects the booking and shows an error "Selected room is no longer available".

### AC-06
- **Given** an authenticated user attempting to book a room
- **When** they select a start time in the past
- **Then** the system blocks the submission and displays an error "Cannot book a room for a past date or time".

---

## US-03 — Cancel an existing booking

### AC-07
- **Given** an authenticated user who owns an active booking scheduled for tomorrow
- **When** they click "Cancel Booking" and confirm
- **Then** the booking status changes to "Cancelled" and the room becomes available for others.

### AC-08
- **Given** an authenticated user
- **When** they attempt to cancel a booking owned by another user via direct link or API
- **Then** the system responds with a 403 Forbidden error and keeps the booking intact.

### AC-09
- **Given** an authenticated user who has a booking starting in 15 minutes
- **When** they attempt to cancel the booking
- **Then** the system prevents cancellation and shows an error "Bookings cannot be cancelled less than 1 hour before start time".