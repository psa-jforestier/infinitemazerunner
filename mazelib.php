<?php
include_once('config.php');

function updatePlayerPosition($gameid, $playerid, $x, $y) {
    $gamefilename = DATA_FOLDER.'/'.md5($gameid).'.json';
    $NOW = time();
    if (!file_exists($gamefilename))
    {
        $GAME_DATA = array(
            'created' => date('Y-m-d H:i:s', $NOW),
            'updated' => date('Y-m-d H:i:s', $NOW),
            'gameid'=>$gameid,
            'players'=>[],
            'highscores'=>[]
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
    return $GAME_DATA;
}

function updatePlayerHighScore($gameid, $playerid, $score, $x, $y) {
    $gamefilename = DATA_FOLDER.'/'.md5($gameid).'.json';
    $NOW = time();
    $d = file_get_contents($gamefilename);
    $GAME_DATA = json_decode($d, true);
    $GAME_DATA['highscores'][$playerid] = array(
        'x'=>$x, 
        'y'=>$y, 
        'score'=> $score);
    $d = json_encode($GAME_DATA);
    file_put_contents($gamefilename, $d, LOCK_EX);
    return $GAME_DATA;
}