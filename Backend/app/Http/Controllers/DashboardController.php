<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Commission;
use App\Models\Meeting;
use App\Models\PV;

class DashboardController extends Controller
{
    public function getStats()
    {
        // Fetch total commissions
        $totalCommissions = Commission::count();

        // Fetch upcoming meetings (assuming future meetings are based on a `date` column)
        $upcomingMeetings = Meeting::where('date', '>=', now())->count();

        // Fetch total meeting minutes (PV)
        $recentMinutes = PV::count();

        // Get last added meeting minute (if available)
        $lastAddedMinute = PV::latest()->first();
        $lastAddedMinutes = $lastAddedMinute ? $lastAddedMinute->created_at->diffForHumans() : 'N/A';

        // Get the next scheduled meeting
        $nextMeeting = Meeting::where('date', '>=', now())->orderBy('date', 'asc')->first();
        $nextMeetingDate = $nextMeeting ? $nextMeeting->date->format('F j, Y') : 'No upcoming meetings';

        return response()->json([
            'total_commissions' => $totalCommissions,
            'upcoming_meetings' => $upcomingMeetings,
            'recent_minutes' => $recentMinutes,
            'last_added_minutes' => $lastAddedMinutes,
            'next_meeting' => $nextMeetingDate
        ]);
    }
}
