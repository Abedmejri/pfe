<?php

namespace App\Http\Controllers;

use App\Models\PV;
use Illuminate\Http\Request;

class PVController extends Controller {
    public function index() {
        return response()->json(PV::all());
    }

    public function store(Request $request) {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'date' => 'required|date',
            'commission' => 'required|string|max:255',
            'content' => 'required|string',
            'attendees' => 'required|array',
            'author' => 'nullable|string|max:255',
            'commission_id' => 'required|exists:commissions,id',
            'status' => 'in:Draft,Published'
        ]);

        $validated['author'] = 'Current User'; // Replace with authenticated user if needed
        
        $validated['status'] = 'Draft';

        $pv = PV::create($validated);
        return response()->json($pv, 201);
    }
}
