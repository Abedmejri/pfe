<?php

namespace App\Http\Controllers;
use Carbon\Carbon;
use App\Models\PV;
use Illuminate\Http\Request;

class PVController extends Controller {
    public function index() {
        return response()->json(PV::all());
    }

    
public function store(Request $request) {
    $validated = $request->validate([
        'title' => 'required|string|max:255',
        'date' => 'required|date', // Ensure the date is valid
        'content' => 'required|string',
        'attendees' => 'required|array',
        'commission_id' => 'required|exists:commissions,id',
        'author' => 'nullable|string|max:255',
        'status' => 'in:Draft,Published'
    ]);

    // Format the date if necessary
    $validated['date'] = Carbon::parse($validated['date'])->format('Y-m-d');

    $validated['author'] = 'Current User'; // Replace with authenticated user if needed
    $validated['status'] = 'Draft'; // Default status

    $pv = PV::create($validated);
    return response()->json($pv, 201);
}
}
