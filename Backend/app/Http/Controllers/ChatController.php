<?php
namespace App\Http\Controllers;

use App\Models\Chat;
use Illuminate\Http\Request;
use Carbon\Carbon;

class ChatController extends Controller
{
   

    public function store(Request $request)
    {
        $request->validate([
            'sender' => 'required|string',
            'content' => 'required|string',
            'timestamp' => 'required|date',
        ]);

        // Convert the timestamp to the correct format
        $timestamp = Carbon::parse($request->timestamp)->format('Y-m-d H:i:s');

        // Save the message
        Chat::create([
            'sender' => $request->sender,
            'content' => $request->content,
            'timestamp' => $timestamp, // Use the formatted timestamp
        ]);

        return response()->json(['message' => 'Chat message saved successfully']);
    }

    public function getChats()
    {
        $chats = Chat::orderBy('timestamp', 'asc')->get();
        return response()->json($chats);
    }

    public function downloadChatLog()
    {
        $chats = Chat::orderBy('timestamp', 'asc')->get();
        $filename = 'chat_log_' . now()->format('Y_m_d_H_i_s') . '.txt';

        $log = $chats->map(function ($chat) {
            return "[{$chat->timestamp}] {$chat->sender}: {$chat->content}";
        })->implode("\n");

        return response($log, 200, [
            'Content-Type' => 'text/plain',
            'Content-Disposition' => "attachment; filename={$filename}",
        ]);
    }
}
