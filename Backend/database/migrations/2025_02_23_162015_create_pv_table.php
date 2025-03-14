<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::create('pv', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->date('date');
            $table->text('content');
            $table->json('attendees');
            $table->string('author')->nullable();
            $table->foreignId('commission_id')->constrained()->onDelete('cascade');
            $table->enum('status', ['Draft', 'Published'])->default('Draft');
            $table->timestamps();
        });
    }

    public function down() {
        Schema::dropIfExists('pv');
    }
};