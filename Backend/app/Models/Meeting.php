<?php



namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Meeting extends Model {
    use HasFactory;

    // Make sure 'commission_id' is fillable, not 'commission' (unless you plan to store a commission name directly)
    protected $fillable = ['title', 'date', 'time', 'location', 'commission_id', 'attendees', 'status'];

    // Define the relationship: a meeting belongs to one commission
    public function commission()
    {
        return $this->belongsTo(Commission::class);
        
    }
    
}
