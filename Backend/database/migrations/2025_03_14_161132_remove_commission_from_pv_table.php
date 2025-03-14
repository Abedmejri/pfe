<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::table('pv', function (Blueprint $table) {
            $table->dropColumn('commission'); // Remove the commission column
        });
    }

    public function down() {
        Schema::table('pv', function (Blueprint $table) {
            $table->string('commission'); // Add the commission column back if rolling back
        });
    }
};
