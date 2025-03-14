<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CommissionController;
use App\Http\Controllers\MeetingController;
use App\Http\Controllers\PVController;
use App\Http\Controllers\DashboardController;






/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
use App\Http\Controllers\ChatController;


Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::apiResource('/users', UserController::class);
    Route::apiResource('commissions', CommissionController::class);

    
    Route::apiResource('meetings', MeetingController::class);
    Route::get('/meetings', [MeetingController::class, 'index']);
    Route::post('/meetings', [MeetingController::class, 'store']);
    Route::put('/meetings/{meeting}', [MeetingController::class, 'update']); 
    Route::delete('/meetings/{meeting}', [MeetingController::class, 'destroy']);

    Route::get('/dashboard-stats', [DashboardController::class, 'getStats']);
        
    Route::get('/chat', [ChatController::class, 'getChats']);
    Route::post('/chat', [ChatController::class, 'store']);
    Route::get('/chat/download', [ChatController::class, 'downloadChatLog']);
    


    Route::middleware(['auth:sanctum', 'admin'])->group(function () {
        Route::get('/admin/dashboard', [AdminController::class, 'index']);
    });
    
        
    Route::get('/pvs', [PVController::class, 'index']);
    Route::post('/pvs', [PVController::class, 'store']);


   
});

Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/login', [AuthController::class, 'login']);
