<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PV extends Model {
    use HasFactory;

    protected $table = 'pv';
    protected $fillable = ['title', 'date', 'commission', 'content', 'commission_id', 'attendees', 'author', 'status'];

    protected $casts = [
        'attendees' => 'array',
    ];
    
    public function commission()
    {
        return $this->belongsTo(Commission::class);
    }
}
