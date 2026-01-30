<?php

/**
 * This script cleans up old game data files in the data/ directory.
 * Call this script periodically (e.g., via cron) to remove files
 * older than MAX_GAME_AGE_SECONDS defined in config.php.
 * The script must have read/write permissions on the data/ folder.
 */

include_once('config.php');

if (!is_dir(DATA_FOLDER)) {
    mkdir(DATA_FOLDER, 0755, true);
}

$now = time();
// search for data game files
$files = glob(DATA_FOLDER . '/*.json');
// delete all old files
foreach ($files as $file) {
    if (is_file($file)) {
        $fileModTime = filemtime($file);
        if ($now - $fileModTime > MAX_GAME_AGE_SECONDS) {
            // delete old file
            unlink($file);
        }
    }
}