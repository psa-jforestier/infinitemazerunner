<?php

/**
 * This script is called when a new game start.
 * It returns a unique player ID (and a cool player name) 
 * and a unique game ID (and a cool game name).
 */

include_once('config.php');

// Enable CORS headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

$prefix = 
    ['Ze', 'El', 'Le', 'La', 'The', 'Das', 'Die', 'Los'];
$gameWord1 = 
    ['Game', 'Laby', 'Labo', 'Maze', 'Labyrinth', 'Puzzle', 'Quest', 'Adventure', 'Journey', 'Expedition', 'Odyssey', 'Voyage', 'Exploration'];
$gameWord2 = 
    ['Master', 'Runner', 'Seeker', 'Finder', 'Chaser', 'Explorer', 'Wanderer', 'Traveler', 'Navigator', 'Rover', 'Pioneer', 'Wizzard'];
$userWord1 = 
    ['Krazy', 'Mad', 'Slim', 'Fat', 'Gross','Nice', 'Cool', 'Swifty', 'Bravo', 'Chapi', 'Chapo', 'Clever', 'Wise', 'Fierce', 'Nimble', 'Bold', 'Quick', 'Sly', 'Sharp', 'Keen', 'Bright'];
$userWord2 = 
    ['Lapinoo', 'Rabitoo', 'Foxy', 'Hawkas', 'Liones', 'Tigroo', 'Birdy', 'Wolfy', 'Puppy', 'Sharko', 'Panthera', 'Cheetah', 'Falcono', 'Lynx', 'Jaguar', 'Cougar', 'Viper', 'Dragon', 'Griffin'];
// Generate unique player ID
function generatePlayerId($length = 10) {
    /**
    $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    $playerId = '';
    for ($i = 0; $i < $length; $i++) {
        $playerId .= $chars[rand(0, strlen($chars) - 1)];
    }
    return $playerId;
    **/
    global $prefix, $userWord1, $userWord2;
    $p = $prefix[array_rand($prefix)];
    $w1 = $userWord1[array_rand($userWord1)];
    $w2 = $userWord2[array_rand($userWord2)];
    return "$p $w1 $w2";
}

// Generate game ID based on current date/time
function generateGameId($seed) {
    global $prefix, $gameWord1, $gameWord2;
    /**
    $p = $prefix[array_rand($prefix)];
    $w1 = $gameWord1[array_rand($gameWord1)];
    $w2 = $gameWord2[array_rand($gameWord2)];
     */
    /**
    $p = $prefix[$seed % count($prefix)];
    $w1 = $gameWord1[($seed >> 3) % count($gameWord1)];
    $w2 = $gameWord2[($seed >> 6) % count($gameWord2)];
     */
    srand($seed);
    $p = $prefix[array_rand($prefix)];
    $w1 = $gameWord1[array_rand($gameWord1)];
    $w2 = $gameWord2[array_rand($gameWord2)];
    return "$p $w1 $w2";
}


function generateSeed() {
    $now = new DateTime();
    return (int)$now->format('YmdHi'); // Generate seed on every minute
    //return (int)$now->format('YmdH'); // Generate seed on every hours
}

// playerid is truely randomized
$playerid = generatePlayerId();
// but the game id is pseudo-random, based on date/time
$seed = generateSeed();
$gameid = generateGameId($seed);

// Return JSON response with playerID and gameID
$response = array(
    'seed' => $seed,
    'playerid' => $playerid,
    'gameid' => $gameid
);

echo json_encode($response);
?>
