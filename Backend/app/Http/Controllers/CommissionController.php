<?php

namespace App\Http\Controllers;

use App\Models\Commission;
use Illuminate\Http\Request;

class CommissionController extends Controller {
    public function index() {
        return Commission::all();
    }

    public function store(Request $request) {
        $commission = Commission::create($request->all());
        return response()->json($commission, 201);
    }

    public function update(Request $request, Commission $commission) {
        $commission->update($request->all());
        return response()->json($commission);
    }

    public function destroy(Commission $commission) {
        $commission->delete();
        return response()->json(null, 204);
    }
}
