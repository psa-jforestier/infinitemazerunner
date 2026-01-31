<?php
/**
 * This script is called when a player dies in the game.
 */ 
include_once('config.php');
require_once('mazelib.php');
$gameid = @$_REQUEST['gid'];
$playerid = @$_REQUEST['pid'];
$x = @$_REQUEST['x'];
$y = @$_REQUEST['y'];

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-cache, no-store, private');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

$gameData = updatePlayerPosition($gameid, $playerid, $x, $y);
// the player die, we can manage the highscore here if needed
$highscore = 0 + (@$gameData['highscores'][$playerid]['score']) ;
$distance = round(sqrt($x*$x + $y*$y), 2);

if ($distance >= $highscore) {
	$gameData = updatePlayerHighScore($gameid, $playerid, $distance, $x, $y);
}
echo json_encode($gameData);