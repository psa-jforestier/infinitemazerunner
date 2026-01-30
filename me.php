<?php
define('DATA_FOLDER', dirname(__FILE__).'/data');
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