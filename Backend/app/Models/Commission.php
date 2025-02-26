<?php


namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Commission extends Model {
    use HasFactory;

    protected $fillable = ['name', 'president', 'members'];

    // Define the relationship: one commission can have many meetings
    public function meetings()
    {
        return $this->hasMany(Meeting::class);
    }
}
