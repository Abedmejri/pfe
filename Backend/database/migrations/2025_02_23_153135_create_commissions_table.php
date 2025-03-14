<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        
        Schema::create('commissions', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('president');
            $table->integer('members');
            $table->timestamps();
        });
    }

    public function down() {
        Schema::dropIfExists('commissions');
    }
};
