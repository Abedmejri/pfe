<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class MakeCommissionNullableInPvTable extends Migration
{
    public function up()
    {
        if (Schema::hasColumn('pv', 'commission')) {
            Schema::table('pv', function (Blueprint $table) {
                $table->string('commission')->nullable()->change(); // Make commission nullable
            });
        }
    }

    public function down()
    {
        if (Schema::hasColumn('pv', 'commission')) {
            Schema::table('pv', function (Blueprint $table) {
                $table->string('commission')->nullable(false)->change(); // Revert to NOT NULL
            });
        }
    }
}