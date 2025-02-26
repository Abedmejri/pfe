<?php
namespace App\Http\Controllers;

use App\Models\Meeting;
use Illuminate\Http\Request;

class MeetingController extends Controller {
    public function index() {
        // Eager load commission details when fetching meetings (optional but helpful)
        return Meeting::with('commission')->get();
    }

    public function store(Request $request) {
        $request->validate([
            'title' => 'required',
            'date' => 'required|date',
            'time' => 'required',
            'location' => 'required',
            'commission_id' => 'required|exists:commissions,id', // Make sure the commission_id exists in the commissions table
            'attendees' => 'required|integer',
        ]);

        // Create a new meeting with the validated data
        $meeting = Meeting::create([
            'title' => $request->title,
            'date' => $request->date,
            'time' => $request->time,
            'location' => $request->location,
            'commission_id' => $request->commission_id, // Store commission ID instead of name
            'attendees' => $request->attendees,
        ]);

        return response()->json($meeting, 201);
    }

    public function update(Request $request, Meeting $meeting) {
        $request->validate([
            'title' => 'required',
            'date' => 'required|date',
            'time' => 'required',
            'location' => 'required',
            'commission_id' => 'required|exists:commissions,id', // Validate commission_id
            'attendees' => 'required|integer',
        ]);

        $meeting->update([
            'title' => $request->title,
            'date' => $request->date,
            'time' => $request->time,
            'location' => $request->location,
            'commission_id' => $request->commission_id, // Update with commission ID
            'attendees' => $request->attendees,
        ]);

        return response()->json($meeting);
    }

    public function destroy(Meeting $meeting) {
        $meeting->delete();
        return response()->json(['message' => 'Meeting deleted']);
    }
}
