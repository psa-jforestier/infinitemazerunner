<?php
/**
 * This script is called periodicaly by the web front end.
 * It record the player position and return all position of the player
 * of the current game.
 * Positions are stored in a game data file in the data/ folder.
 */
include_once('config.php');
$gameid = @$_REQUEST['gid'];
$playerid = @$_REQUEST['pid'];
$x = @$_REQUEST['x'];
$y = @$_REQUEST['y'];

$gamefilename = DATA_FOLDER.'/'.md5($gameid).'.json';
$NOW = time();
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-cache, no-store, private');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
if (!file_exists($gamefilename))
{
	$GAME_DATA = array(
		'created' => date('Y-m-d H:i:s', $NOW),
		'updated' => date('Y-m-d H:i:s', $NOW),
		'gameid'=>$gameid,
		'players'=>[]
	);
}
else
{
	$d = file_get_contents($gamefilename);
	$GAME_DATA = json_decode($d, true); // associative array
	$GAME_DATA['updated'] = date('Y-m-d H:i:s', $NOW);	
	
}
$GAME_DATA['players'][$playerid] = array('x'=>$x, 'y'=>$y);
$d = json_encode($GAME_DATA);
file_put_contents($gamefilename, $d, LOCK_EX);
echo $d;