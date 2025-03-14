<?php

// app/Events/MessageSent.php

namespace App\Events;

use App\Models\Chat;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MessageSent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $message;

    // Constructor to accept the message data
    public function __construct(Chat $message)
    {
        $this->message = $message;
    }

    // Define the channel the event will broadcast on
    public function broadcastOn()
    {
        return new Channel('chat');
    }

    // Optionally, define the broadcast data format
    public function broadcastWith()
    {
        return [
            'sender' => $this->message->sender,
            'content' => $this->message->content,
            'timestamp' => $this->message->timestamp,
        ];
    }
}
